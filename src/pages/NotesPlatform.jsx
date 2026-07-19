import React, { useState, useEffect } from 'react';
import { FileText, Search, Upload, Plus, Download, Sparkles, Filter, Eye, X, BookOpen, Brain, ListCollapse, AlertTriangle, Loader2, Edit3, Trash2, RefreshCw } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';
import { generateNoteEnhancement } from '../services/aiService';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import * as pdfjsLib from 'pdfjs-dist';
// Use the legacy worker which is compatible with Vite's standard bundler config for ES modules
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function NotesPlatform({ user }) {
  // ── All state hooks first ──────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterSem, setFilterSem] = useState('All');
  const [viewMode, setViewMode] = useState('library');
  const [showEnhancer, setShowEnhancer] = useState(false);
  const [activeNoteForEnhance, setActiveNoteForEnhance] = useState(null);
  const [linkInput, setLinkInput] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditingNote, setIsEditingNote] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', branch: 'CSE', semester: 'Sem 1', fileUrl: '' });
  const [noteOpenTime, setNoteOpenTime] = useState(null);
  const [activeNoteForTimeTracking, setActiveNoteForTimeTracking] = useState(null);

  // ── Context hooks ──────────────────────────────────────────────────
  const { notes, addNote, updateNote, deleteNote, uploadFile, loading } = useData();
  const { addToast } = useToast();
  const { setIsStudying } = useGamification();

  // ── Constants ──────────────────────────────────────────────────────
  const branches = ['All', 'CSE', 'CSM', 'ECE', 'EEE', 'Civil', 'Mechanical'];
  const semesters = ['All', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];

  // ── Effects ────────────────────────────────────────────────────────
  useEffect(() => {
    const handlePopState = () => {
      setPreviewUrl(null);
      setShowEnhancer(false);
      setIsEditingNote(null);
    };
    if (previewUrl || showEnhancer || isEditingNote) {
      window.history.pushState({ modal: true }, '');
      window.addEventListener('popstate', handlePopState);
    }
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [previewUrl, showEnhancer, isEditingNote]);

  useEffect(() => {
    if (setIsStudying) {
      setIsStudying(!!previewUrl || showEnhancer);
    }
    return () => {
      if (setIsStudying) setIsStudying(false);
    };
  }, [previewUrl, showEnhancer, setIsStudying]);

  // Track note reading time and save to Firestore when closed
  useEffect(() => {
    const isOpened = !!previewUrl || showEnhancer;
    
    if (isOpened) {
      setNoteOpenTime(Date.now());
      if (showEnhancer && activeNoteForEnhance) {
        setActiveNoteForTimeTracking(activeNoteForEnhance);
      } else if (previewUrl) {
        const matched = notes.find(n => getEmbedUrl(n.fileUrl) === previewUrl);
        if (matched) {
          setActiveNoteForTimeTracking(matched);
        }
      }
    } else {
      if (noteOpenTime && activeNoteForTimeTracking && user?.id) {
        const durationSeconds = Math.round((Date.now() - noteOpenTime) / 1000);
        const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));
        
        const logNotesReadDoc = async () => {
          try {
            await addDoc(collection(db, 'Users', user.id, 'NotesRead'), {
              subjectId: activeNoteForTimeTracking.subject || 'general',
              noteId: activeNoteForTimeTracking.id,
              title: activeNoteForTimeTracking.title,
              readDuration: durationMinutes,
              date: new Date().toISOString().split('T')[0]
            });
            addToast({ message: `Logged ${durationMinutes}m note reading!`, type: 'success' });
          } catch (err) {
            console.error("Error logging note reading to Firestore:", err);
          }
        };
        logNotesReadDoc();
      }
      setNoteOpenTime(null);
      setActiveNoteForTimeTracking(null);
    }
  }, [previewUrl, showEnhancer]);

  // ── Helpers ────────────────────────────────────────────────────────
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com/file/d/')) {
      return url.replace(/\/(view|edit).*/, '/preview');
    }
    if (url.toLowerCase().includes('.pdf')) {
      return `${url}#toolbar=0`;
    }
    return url;
  };

  const handleCloseModal = () => {
    if (window.history.state && window.history.state.modal) {
      window.history.back();
    } else {
      setPreviewUrl(null);
      setShowEnhancer(false);
      setIsEditingNote(null);
    }
  };


  const handleEnhanceClick = (note) => {
    setActiveNoteForEnhance(note);
    setShowEnhancer(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop().toLowerCase();
    
    // Early check for unsupported formats (DOCX/PPTX)
    if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(fileExt)) {
      addToast({ message: 'Word, Excel, and PowerPoint files are not yet supported. Please upload a PDF or plain text file.', type: 'error' });
      return;
    }

    // Clean up the title (remove extension, strip trailing dots, fallback to Untitled)
    const rawTitle = file.name.replace(/\.[^/.]+$/, "").replace(/\.+$/, "").trim();
    const finalTitle = rawTitle || "Untitled Document";

    // Upload file to Supabase Storage
    let fileUrl = '';
    try {
      const path = `notes/${Date.now()}_${file.name}`;
      fileUrl = await uploadFile(path, file);
    } catch (err) {
      addToast({ message: 'Failed to upload PDF to cloud. Continuing with local processing...', type: 'error' });
    }

    // 1. Instantly create the note with a "generating" state
    const initialNoteData = {
      title: finalTitle,
      subject: `${filterBranch === 'All' ? 'CSE' : filterBranch} - ${filterSem === 'All' ? 'Sem 1' : filterSem}`,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      downloads: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: fileExt === 'pdf' ? 'PDF Document' : 'Text File',
      fileUrl: fileUrl,
      aiEnhancement: {
        status: 'generating',
        summary: 'Newly uploaded file. Summary is being generated automatically by Lumixora AI. Please wait a moment...',
        concepts: ['Analyzing text content...', 'Extracting core key terms...'],
        questions: [{ q: 'AI is thinking...', a: 'Generating practice material.' }]
      }
    };
    
    const savedNote = await addNote(initialNoteData);
    addToast({ message: 'File uploaded successfully! Processing...', type: 'success' });

    const processExtractedText = async (textContent) => {
      let finalContent = textContent;
      // Prevent huge payloads from crashing the API (limit to ~40k chars)
      if (finalContent && finalContent.length > 40000) {
        finalContent = finalContent.substring(0, 40000) + "\n...[Content Truncated due to size constraints]";
      }
      
      try {
        // 3. Call AI Service
        const enhancedData = await generateNoteEnhancement(finalContent);
        
        // 4. Update the note in the database
        const newAiData = { status: 'complete', ...enhancedData };
        await updateNote(savedNote.id, { aiEnhancement: newAiData });
        setActiveNoteForEnhance(prev => prev?.id === savedNote.id ? { ...prev, aiEnhancement: newAiData } : prev);
        addToast({ message: 'AI Enhancement complete!', type: 'success' });
      } catch (error) {
        console.error("AI Generation failed:", error);
        const errorData = {
          status: 'error',
          summary: error.message || 'Failed to generate AI summary. Please check your API key or file format.',
          concepts: ['Error'],
          questions: []
        };
        await updateNote(savedNote.id, { aiEnhancement: errorData });
        setActiveNoteForEnhance(prev => prev?.id === savedNote.id ? { ...prev, aiEnhancement: errorData } : prev);
        addToast({ message: 'AI Enhancement failed. Please try again.', type: 'error' });
      }
    };

    // 2. Read file content based on type
    if (fileExt === 'pdf' || file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const typedarray = new Uint8Array(event.target.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContentPage = await page.getTextContent();
            const pageText = textContentPage.items.map(item => item.str).join(' ');
            fullText += pageText + '\n\n';
          }
          
          await processExtractedText(fullText);
        } catch (err) {
          console.error("PDF Parsing failed:", err);
          const errorData = {
            status: 'error',
            summary: err.message || "Failed to parse the PDF file. The file might be corrupted or protected.",
            concepts: ['Error'],
            questions: []
          };
          await updateNote(savedNote.id, { aiEnhancement: errorData });
          setActiveNoteForEnhance(prev => prev?.id === savedNote.id ? { ...prev, aiEnhancement: errorData } : prev);
          addToast({ message: 'PDF Extraction failed.', type: 'error' });
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = async (event) => {
        await processExtractedText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!linkInput.trim() || !linkTitle.trim()) return;
    
    const initialNoteData = {
      title: linkTitle.trim(),
      subject: `${filterBranch === 'All' ? 'CSE' : filterBranch} - ${filterSem === 'All' ? 'Sem 1' : filterSem}`,
      size: `-- MB`,
      downloads: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'Drive Link',
      fileUrl: linkInput.trim(),
      aiEnhancement: {
        status: 'error',
        summary: 'AI Enhancement is not available for external drive links.',
        concepts: [],
        questions: []
      }
    };
    
    await addNote(initialNoteData);
    addToast({ message: 'Drive Link added successfully!', type: 'success' });
    setLinkInput('');
    setLinkTitle('');
  };

  const handleDownloadStudySet = (note) => {
    if (!note || !note.aiEnhancement || note.aiEnhancement.status !== 'complete') return;
    
    const { title } = note;
    const { summary, concepts, questions } = note.aiEnhancement;
    
    let content = `LUMIXORA AI STUDY SET: ${title}\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n`;
    content += `=====================================================\n\n`;
    
    content += `[ STRUCTURED SUMMARY ]\n`;
    content += `${summary}\n\n`;
    
    content += `[ CORE ACADEMIC CONCEPTS ]\n`;
    concepts.forEach(c => content += `- ${c}\n`);
    content += `\n`;
    
    content += `[ PRACTICE QUESTIONS ]\n`;
    questions.forEach((q, i) => {
      content += `Q${i+1}: ${q.q}\n`;
      content += `A${i+1}: ${q.a}\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_study_set.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    addToast({ message: 'Study set downloaded successfully!', type: 'success' });
  };

  const handleDeleteClick = async (note) => {
    if (viewMode === 'library') {
      if (window.confirm(`Move "${note.title}" to Recycle Bin?`)) {
        await updateNote(note.id, { isDeleted: true });
        addToast({ message: 'Note moved to Recycle Bin', type: 'success' });
      }
    } else {
      if (window.confirm(`Permanently delete "${note.title}"? This cannot be undone.`)) {
        await deleteNote(note.id);
        addToast({ message: 'Note permanently deleted', type: 'success' });
      }
    }
  };

  const handleRestoreClick = async (note) => {
    await updateNote(note.id, { isDeleted: false });
    addToast({ message: 'Note restored to Library', type: 'success' });
  };

  const handleEditClick = (note) => {
    setIsEditingNote(note);
    let noteBranch = note.subject;
    let noteSem = 'Sem 1';
    if (note.subject && note.subject.includes(' - ')) {
      [noteBranch, noteSem] = note.subject.split(' - ');
    } else {
      noteBranch = 'CSE'; // Fallback
    }
    setEditForm({ title: note.title, branch: noteBranch, semester: noteSem, fileUrl: note.fileUrl || '' });
  };

  const handleSaveEdit = async () => {
    if (!editForm.title.trim()) {
      addToast({ message: 'Title cannot be empty', type: 'error' });
      return;
    }
    await updateNote(isEditingNote.id, {
      title: editForm.title.trim(),
      subject: `${editForm.branch} - ${editForm.semester}`,
      fileUrl: editForm.fileUrl.trim()
    });
    addToast({ message: 'Note updated successfully', type: 'success' });
    setIsEditingNote(null);
  };

  const filteredNotes = notes.filter((n) => {
    // Exclude code arena custom problems
    if (n.type === 'code_arena_problem' || n.category === 'code_arena_problem') return false;

    const isTrash = !!n.isDeleted;
    if (viewMode === 'library' && isTrash) return false;
    if (viewMode === 'trash' && !isTrash) return false;

    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    let noteBranch = n.subject;
    let noteSem = 'Sem 1';
    if (n.subject && n.subject.includes(' - ')) {
      const parts = n.subject.split(' - ');
      noteBranch = parts[0];
      noteSem = parts[1] || 'Sem 1';
    }

    const matchesBranch = filterBranch === 'All' || noteBranch === filterBranch;
    const matchesSem = filterSem === 'All' || noteSem === filterSem;
    
    return matchesSearch && matchesBranch && matchesSem;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* View Toggle (Library vs Trash) - Founders Only */}
          {user?.role === 'founder' && (
            <div className="flex items-center bg-black/20 p-1 rounded-xl mr-2">
              <button
                onClick={() => setViewMode('library')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${viewMode === 'library' ? 'bg-brand-teal text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                Library
              </button>
              <button
                onClick={() => setViewMode('trash')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${viewMode === 'trash' ? 'bg-red-500/20 text-red-400 shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Trash
              </button>
            </div>
          )}

          {/* Branch and Semester Filters */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar w-full max-w-[600px]">
              {branches.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setFilterBranch(sub)}
                  className={`px-3 py-1.5 shrink-0 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    filterBranch === sub 
                      ? 'bg-brand-blue text-black font-bold shadow-[0_0_10px_rgba(0,180,216,0.25)]' 
                      : 'bg-white/5 border border-white/5 hover:border-white/10 text-gray-400'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar w-full max-w-[600px]">
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => setFilterSem(sem)}
                  className={`px-3 py-1.5 shrink-0 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    filterSem === sem 
                      ? 'bg-brand-orange text-black font-bold shadow-[0_0_10px_rgba(255,159,28,0.25)]' 
                      : 'bg-white/5 border border-white/5 hover:border-white/10 text-gray-400'
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes, formulas..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Main Grid: Upload Area + Notes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Upload Notes Drag & Drop Box - Only show in Library mode for Founders */}
        {viewMode === 'library' && user?.role === 'founder' && (
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center border border-brand-teal/30 hover:border-brand-teal/60 bg-brand-teal/5 transition-all duration-300 h-64 relative overflow-hidden gap-4">
            
            {/* File Upload Section */}
            <div className="w-full flex-1 flex flex-col justify-center items-center relative group border-2 border-dashed border-brand-teal/30 rounded-xl">
              <input
                type="file"
                id="notes-file-upload"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label 
                htmlFor="notes-file-upload"
                className="flex flex-col items-center justify-center cursor-pointer text-center w-full h-full p-2"
              >
                <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform duration-300 mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-gray-200">Upload File</h4>
              </label>
            </div>

            <div className="w-full flex items-center gap-2">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <span className="text-[10px] text-gray-500 font-bold">OR</span>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>

            {/* Drive Link Section */}
            <form onSubmit={handleLinkSubmit} className="w-full flex flex-col gap-2">
              <input 
                type="text" 
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="Document Title (e.g., 2023 Previous Paper)" 
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" 
                required
              />
              <div className="w-full flex gap-2">
                <input 
                  type="url" 
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Paste Drive Link..." 
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" 
                  required
                />
                <button 
                  type="submit"
                  className="bg-brand-teal text-black px-3 py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all shrink-0"
                >
                  Add Link
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notes Cards */}
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-64 animate-pulse">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-20 h-5 bg-brand-blue/10 rounded"></div>
                  <div className="w-12 h-3 bg-white/5 rounded"></div>
                </div>
                <div className="w-4/5 h-6 bg-white/10 rounded"></div>
                <div className="w-1/2 h-4 bg-white/5 rounded"></div>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                <div className="w-24 h-3 bg-white/5 rounded"></div>
                <div className="flex gap-2">
                  <div className="w-9 h-9 bg-brand-purple/10 rounded-lg"></div>
                  <div className="w-9 h-9 bg-white/5 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredNotes.length === 0 ? (
          <div className="text-center text-gray-500 py-4 col-span-full italic">
            {viewMode === 'library' ? "No notes found. Upload one!" : "Your recycle bin is empty."}
          </div>
        ) : filteredNotes.map((note) => (
          <div key={note.id} className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between h-64">
            
            {/* Note Content Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] bg-brand-blue/15 text-brand-blue border border-brand-blue/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {note.subject}
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">{note.size || '-- MB'}</span>
              </div>
              <h4 className="text-sm font-bold text-gray-100 leading-normal line-clamp-2">
                {note.title}
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-semibold">
                <span>{note.type || 'Uploaded File'}</span>
                <span className="flex items-center">•</span>
                <span>{note.downloads || 0} downloads</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
              <span className="text-[10px] text-gray-500 font-medium">Uploaded {note.date}</span>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => handleEnhanceClick(note)}
                  className="p-2 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-pink hover:bg-brand-purple hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer relative group/btn"
                  title="Enhance notes with Lumixora AI"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                </button>

                {/* View Original PDF Button */}
                {note.fileUrl && (
                  <button 
                    onClick={() => setPreviewUrl(getEmbedUrl(note.fileUrl))}
                    className="p-2 rounded-lg bg-brand-blue/10 border border-brand-blue/20 text-brand-blue hover:bg-brand-blue hover:text-black transition-all duration-300 flex items-center justify-center cursor-pointer"
                    title="View Original Document"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Edit Button - Library Only & Founder Only */}
                {viewMode === 'library' && user?.role === 'founder' && (
                  <button 
                    onClick={() => handleEditClick(note)}
                    title="Edit Note"
                    className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-brand-teal/40 text-gray-400 hover:text-brand-teal transition-all duration-300 flex items-center justify-center cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Restore Button - Trash Only & Founder Only */}
                {viewMode === 'trash' && user?.role === 'founder' && (
                  <button 
                    onClick={() => handleRestoreClick(note)}
                    title="Restore Note"
                    className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-green-400/40 text-gray-400 hover:text-green-400 transition-all duration-300 flex items-center justify-center cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
                
                {/* Delete Button - Founder Only */}
                {user?.role === 'founder' && (
                  <button 
                    onClick={() => handleDeleteClick(note)}
                    title={viewMode === 'library' ? "Move to Trash" : "Permanently Delete"}
                    className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-red-500/40 text-gray-400 hover:text-red-400 transition-all duration-300 flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Download Button */}
                <button 
                  onClick={() => handleDownloadStudySet(note)}
                  disabled={!note.aiEnhancement || note.aiEnhancement.status !== 'complete'}
                  title={note.aiEnhancement?.status === 'complete' ? "Download Study Set" : "AI Enhancement not ready"}
                  className={`p-2 rounded-lg border transition-all duration-300 flex items-center justify-center ${
                    note.aiEnhancement?.status === 'complete'
                      ? 'bg-white/5 border-white/5 hover:border-brand-blue/40 text-gray-400 hover:text-brand-blue cursor-pointer'
                      : 'bg-black/10 border-transparent text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* AI Notes Enhancer Modal */}
      {showEnhancer && activeNoteForEnhance && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl glass-panel rounded-3xl overflow-hidden border border-border-glass shadow-2xl relative animate-scale-in">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-border-glass bg-gradient-to-r from-brand-purple/10 to-brand-teal/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-pink/20 flex items-center justify-center text-brand-pink animate-pulse-glow">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-100 tracking-tight">Lumixora AI Notes Enhancer</h3>
                  <span className="text-[10px] text-gray-400 truncate max-w-[280px] block font-medium">{activeNoteForEnhance.title}</span>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[480px]">
              
              {activeNoteForEnhance.aiEnhancement.status === 'error' ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-200">Enhancement Failed</h4>
                  <p className="text-sm text-gray-400 max-w-sm">
                    {activeNoteForEnhance.aiEnhancement.summary || "There was a problem generating the AI enhancement. Please check your API key and try uploading the file again."}
                  </p>
                  {activeNoteForEnhance.type === 'Drive Link' ? (
                    <p className="text-xs text-brand-blue mt-4 font-semibold px-4 py-2 bg-brand-blue/10 rounded-lg border border-brand-blue/20">
                      Tip: If you want AI summaries and practice questions, upload the document as a PDF or Text file instead of a Drive Link.
                    </p>
                  ) : (
                    <p className="text-xs text-brand-pink mt-4 font-semibold px-4 py-2 bg-brand-pink/10 rounded-lg border border-brand-pink/20">
                      Tip: Re-upload the file to retry now that the API is fixed!
                    </p>
                  )}
                </div>
              ) : activeNoteForEnhance.aiEnhancement.status === 'generating' ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-teal blur-xl opacity-20 rounded-full animate-pulse-glow"></div>
                    <Loader2 className="w-12 h-12 text-brand-teal animate-spin relative" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-gray-200 animate-pulse">AI is reading your document...</h4>
                    <p className="text-sm text-gray-400">Extracting key concepts, generating practice questions, and writing a structured summary.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Outline / Summary Section */}
                  <div className="space-y-2 text-left animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h4 className="text-xs font-bold text-brand-teal uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Structured Summary Outline</span>
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed font-normal p-4 rounded-xl bg-white/5 border border-white/5">
                      {activeNoteForEnhance.aiEnhancement.summary}
                    </p>
                  </div>

                  {/* Core Concepts */}
                  <div className="space-y-2 text-left animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h4 className="text-xs font-bold text-brand-blue uppercase tracking-wider flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      <span>Core Academic Concepts</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeNoteForEnhance.aiEnhancement.concepts.map((concept, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px] font-semibold text-gray-300 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                          <span>{concept}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Practice Q&A */}
                  <div className="space-y-2 text-left animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <h4 className="text-xs font-bold text-brand-purple uppercase tracking-wider flex items-center gap-2">
                      <ListCollapse className="w-4 h-4" />
                      <span>AI-Generated Practice Questions</span>
                    </h4>
                    <div className="space-y-3">
                      {activeNoteForEnhance.aiEnhancement.questions.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                          <h5 className="text-xs font-bold text-gray-200">Q: {item.q}</h5>
                          <p className="text-xs text-gray-400 font-medium">A: {item.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-border-glass bg-black/20 flex items-center justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
              >
                Close Summary
              </button>
              <button 
                onClick={() => handleDownloadStudySet(activeNoteForEnhance)}
                disabled={activeNoteForEnhance.aiEnhancement.status !== 'complete'}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeNoteForEnhance.aiEnhancement.status === 'complete' 
                    ? 'bg-brand-teal text-brand-dark hover:brightness-110' 
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Download Study Set</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {isEditingNote && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-brand-dark border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-gray-200">Edit Note Details</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Note Title</label>
                <input 
                  type="text" 
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-brand-teal outline-none transition-colors"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-semibold text-gray-400">Branch</label>
                  <select 
                    value={editForm.branch}
                    onChange={(e) => setEditForm(prev => ({ ...prev, branch: e.target.value }))}
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-brand-teal outline-none transition-colors appearance-none"
                  >
                    {branches.filter(b => b !== 'All').map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-semibold text-gray-400">Semester</label>
                  <select 
                    value={editForm.semester}
                    onChange={(e) => setEditForm(prev => ({ ...prev, semester: e.target.value }))}
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-brand-teal outline-none transition-colors appearance-none"
                  >
                    {semesters.filter(s => s !== 'All').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Document URL (Optional)</label>
                <input 
                  type="url" 
                  value={editForm.fileUrl}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fileUrl: e.target.value }))}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-brand-teal outline-none transition-colors"
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-black/20">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-6 py-2 rounded-xl text-sm font-bold bg-brand-teal text-black hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,245,212,0.3)]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
          <div className="relative w-full max-w-6xl h-full max-h-[90vh] glass-panel rounded-2xl flex flex-col border border-brand-teal/30">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/40">
              <h3 className="text-brand-teal font-bold tracking-wider">Document Preview</h3>
              <button 
                onClick={handleCloseModal}
                className="px-4 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm font-bold"
              >
                Close Preview
              </button>
            </div>
            <div 
              className="flex-1 w-full bg-[#f8f9fa] rounded-b-2xl overflow-hidden relative"
              onContextMenu={(e) => e.preventDefault()}
            >
              <iframe 
                src={previewUrl} 
                className="w-full h-full border-0"
                allow="autoplay"
                title="Document Preview"
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
