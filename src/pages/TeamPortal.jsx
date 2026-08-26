import React, { useState, useMemo } from 'react';
import { 
  FileText, BookOpen, Upload, Plus, Trash2, Edit3, Search, Download, 
  Eye, CheckCircle2, Sparkles, ArrowRight, ExternalLink, Play, Layers,
  Filter, Shield, Video, Clock, Star, HelpCircle, Save, X, RefreshCw,
  FolderPlus, Link as LinkIcon, Award, UserCheck, AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export default function TeamPortal({ user, setActiveTab }) {
  const formatCleanName = (rawName, email) => {
    if (!rawName) return email ? email.split('@')[0] : 'Team Member';
    let str = String(rawName).trim();
    if (str.includes('{')) {
      str = str.split('{')[0].trim();
    }
    return str.replace(/[\{\}":;]/g, '').trim() || (email ? email.split('@')[0] : 'Team Member');
  };

  const { 
    notes, addNote, updateNote, deleteNote, 
    hubSubjects, addHubSubject, updateHubSubject, deleteHubSubject, 
    hubMaterials, updateHubMaterials, 
    uploadFile, loading 
  } = useData();

  const { addToast } = useToast();

  // Active section tab: 'papers' | 'hub' | 'preview'
  const [activeSection, setActiveSection] = useState('papers');

  // --- PREVIOUS PAPERS STATE ---
  const [paperSearch, setPaperSearch] = useState('');
  const [paperBranch, setPaperBranch] = useState('All');
  const [paperSem, setPaperSem] = useState('All');
  const [paperExamType, setPaperExamType] = useState('All');

  const [isPaperModalOpen, setIsPaperModalOpen] = useState(false);
  const [editingPaperId, setEditingPaperId] = useState(null);
  const [paperUploading, setPaperUploading] = useState(false);
  const [paperFile, setPaperFile] = useState(null);
  const [paperPreviewUrl, setPaperPreviewUrl] = useState(null);

  const [paperForm, setPaperForm] = useState({
    title: '',
    subject: '',
    subjectCode: '',
    branch: 'CSE',
    semester: 'Sem 3',
    examType: 'End Semester Regular',
    year: '2024',
    regulation: 'R20',
    fileUrl: '',
    tags: '',
    description: ''
  });

  // --- LEARNING HUB STATE ---
  const [hubBranch, setHubBranch] = useState('CSE');
  const [hubSem, setHubSem] = useState('Sem 3');
  const [hubSearch, setHubSearch] = useState('');
  const [selectedHubSubject, setSelectedHubSubject] = useState(null);

  // Subject Modal State
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    credits: 3,
    difficulty: 'Medium',
    branch: 'CSE',
    semester: 'Sem 3'
  });

  // Material Modal State (Playlists / Resources)
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialType, setMaterialType] = useState('resource'); // 'playlist' | 'resource'
  const [activeTrack, setActiveTrack] = useState('pass'); // 'pass' | 'complete' | 'industry'
  const [resourceFile, setResourceFile] = useState(null);
  const [materialUploading, setMaterialUploading] = useState(false);

  const [playlistForm, setPlaylistForm] = useState({
    track: 'pass',
    title: '',
    channel: '',
    playlistUrl: '',
    duration: '8h',
    videos: 12,
    lang: 'English',
    level: 'Beginner',
    thumbnail: ''
  });

  const [resourceForm, setResourceForm] = useState({
    label: '',
    type: 'FileText',
    category: 'Lecture Notes',
    fileUrl: '',
    color: 'text-brand-teal',
    bg: 'bg-brand-teal/10'
  });

  const branches = ['CSE', 'CSM', 'ECE', 'EEE', 'Civil', 'Mechanical', 'AI & DS'];
  const semesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];
  const examTypes = ['All', 'Mid 1 Exam', 'Mid 2 Exam', 'End Semester Regular', 'Supplementary Exam', 'Model / Practice Paper'];

  // Helper for embed URLs (Drive, etc.)
  const convertToEmbedUrl = (url) => {
    if (!url) return '';
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (openMatch) return `https://drive.google.com/file/d/${openMatch[1]}/preview`;
    return url;
  };

  // --- Filtered Previous Papers ---
  const previousPapersList = useMemo(() => {
    return (notes || []).filter(note => {
      const isPaper = note.category === 'previous_paper' || 
                      note.examType || 
                      note.regulation ||
                      (note.title && note.title.toLowerCase().includes('paper')) ||
                      (note.tags && note.tags.toLowerCase().includes('paper'));
      
      if (!isPaper) return false;

      const matchesSearch = !paperSearch.trim() || 
        (note.title || '').toLowerCase().includes(paperSearch.toLowerCase()) ||
        (note.subject || '').toLowerCase().includes(paperSearch.toLowerCase()) ||
        (note.subjectCode || '').toLowerCase().includes(paperSearch.toLowerCase());

      const matchesBranch = paperBranch === 'All' || note.branch === paperBranch;
      const matchesSem = paperSem === 'All' || note.semester === paperSem;
      const matchesType = paperExamType === 'All' || note.examType === paperExamType;

      return matchesSearch && matchesBranch && matchesSem && matchesType;
    });
  }, [notes, paperSearch, paperBranch, paperSem, paperExamType]);

  // --- Filtered Hub Subjects ---
  const filteredHubSubjects = useMemo(() => {
    return (hubSubjects || []).filter(sub => {
      const matchBranch = sub.branch === hubBranch;
      const matchSem = sub.semester === hubSem;
      const matchSearch = !hubSearch.trim() || 
        (sub.name || '').toLowerCase().includes(hubSearch.toLowerCase()) ||
        (sub.code || '').toLowerCase().includes(hubSearch.toLowerCase());
      return matchBranch && matchSem && matchSearch;
    });
  }, [hubSubjects, hubBranch, hubSem, hubSearch]);

  // Selected subject's materials
  const selectedMaterials = useMemo(() => {
    if (!selectedHubSubject) return null;
    return (hubMaterials || []).find(m => m.id === selectedHubSubject.id) || {
      playlists: {
        pass: { featured: null, alternatives: [] },
        complete: { featured: null, alternatives: [] },
        industry: { featured: null, alternatives: [] }
      },
      resources: []
    };
  }, [hubMaterials, selectedHubSubject]);

  // --- PAPER HANDLERS ---
  const handleOpenAddPaper = () => {
    setEditingPaperId(null);
    setPaperFile(null);
    setPaperForm({
      title: '',
      subject: '',
      subjectCode: '',
      branch: hubBranch || 'CSE',
      semester: hubSem || 'Sem 3',
      examType: 'End Semester Regular',
      year: new Date().getFullYear().toString(),
      regulation: 'R20',
      fileUrl: '',
      tags: 'Question Paper, Solved',
      description: ''
    });
    setIsPaperModalOpen(true);
  };

  const handleOpenEditPaper = (paper) => {
    setEditingPaperId(paper.id);
    setPaperFile(null);
    setPaperForm({
      title: paper.title || '',
      subject: paper.subject || '',
      subjectCode: paper.subjectCode || '',
      branch: paper.branch || 'CSE',
      semester: paper.semester || 'Sem 3',
      examType: paper.examType || 'End Semester Regular',
      year: paper.year || '2024',
      regulation: paper.regulation || 'R20',
      fileUrl: paper.fileUrl || '',
      tags: paper.tags || '',
      description: paper.description || ''
    });
    setIsPaperModalOpen(true);
  };

  const handleSavePaper = async (e) => {
    e.preventDefault();
    setPaperUploading(true);

    try {
      let finalUrl = paperForm.fileUrl;

      // Handle File Upload to Supabase Storage if file attached
      if (paperFile) {
        const cleanName = paperFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `previous_papers/${paperForm.branch}/${paperForm.semester}/${Date.now()}_${cleanName}`;
        finalUrl = await uploadFile(storagePath, paperFile);
      }

      if (!finalUrl && !paperForm.fileUrl) {
        addToast({ message: "Please upload a paper PDF or enter a valid resource URL.", type: "error" });
        setPaperUploading(false);
        return;
      }

      const paperData = {
        ...paperForm,
        fileUrl: finalUrl,
        category: 'previous_paper',
        contributedBy: user?.name || user?.email || 'Lumixora Teammate',
        contributorEmail: user?.email || '',
        contributorRole: 'Teammate',
        last_edited: new Date().toISOString()
      };

      if (editingPaperId) {
        await updateNote(editingPaperId, paperData);
        addToast({ message: `Updated question paper: "${paperForm.title}"`, type: "success" });
      } else {
        await addNote(paperData);
        addToast({ message: `Uploaded question paper: "${paperForm.title}"`, type: "success" });
      }

      setIsPaperModalOpen(false);
      setPaperFile(null);
    } catch (err) {
      console.error("Paper save error:", err);
      addToast({ message: "Failed to save question paper. Please try again.", type: "error" });
    } finally {
      setPaperUploading(false);
    }
  };

  const handleDeletePaper = async (paperId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this paper'}"? This action cannot be undone.`)) return;
    try {
      await deleteNote(paperId);
      addToast({ message: "Question paper deleted successfully.", type: "success" });
    } catch (err) {
      console.error("Delete paper error:", err);
      addToast({ message: "Failed to delete question paper.", type: "error" });
    }
  };

  // --- LEARNING HUB SUBJECT HANDLERS ---
  const handleOpenAddSubject = () => {
    setEditingSubjectId(null);
    setSubjectForm({
      name: '',
      code: '',
      credits: 3,
      difficulty: 'Medium',
      branch: hubBranch,
      semester: hubSem
    });
    setIsSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (subject) => {
    setEditingSubjectId(subject.id);
    setSubjectForm({
      name: subject.name || '',
      code: subject.code || '',
      credits: subject.credits || 3,
      difficulty: subject.difficulty || 'Medium',
      branch: subject.branch || hubBranch,
      semester: subject.semester || hubSem
    });
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    try {
      if (editingSubjectId) {
        await updateHubSubject(editingSubjectId, subjectForm);
        addToast({ message: `Subject "${subjectForm.name}" updated.`, type: "success" });
      } else {
        await addHubSubject(subjectForm);
        addToast({ message: `New subject "${subjectForm.name}" added to Learning Hub!`, type: "success" });
      }
      setIsSubjectModalOpen(false);
    } catch (err) {
      console.error("Save subject error:", err);
      addToast({ message: "Failed to save subject. Please try again.", type: "error" });
    }
  };

  const handleDeleteSubject = async (subjectId, subjectName) => {
    if (!window.confirm(`Are you sure you want to delete subject "${subjectName}" and all its materials?`)) return;
    try {
      await deleteHubSubject(subjectId);
      if (selectedHubSubject?.id === subjectId) {
        setSelectedHubSubject(null);
      }
      addToast({ message: "Subject removed from Learning Hub.", type: "success" });
    } catch (err) {
      console.error("Delete subject error:", err);
      addToast({ message: "Failed to delete subject.", type: "error" });
    }
  };

  // --- LEARNING HUB MATERIAL HANDLERS ---
  const handleOpenPlaylistModal = (track) => {
    setActiveTrack(track);
    setMaterialType('playlist');
    const existing = selectedMaterials?.playlists?.[track]?.featured;
    setPlaylistForm({
      track,
      title: existing?.title || '',
      channel: existing?.channel || '',
      playlistUrl: existing?.playlistUrl || existing?.url || '',
      duration: existing?.duration || '10h',
      videos: existing?.videos || 15,
      lang: existing?.lang || 'English',
      level: existing?.level || (track === 'pass' ? 'Beginner' : track === 'complete' ? 'Intermediate' : 'Advanced'),
      thumbnail: existing?.thumbnail || ''
    });
    setIsMaterialModalOpen(true);
  };

  const handleOpenResourceModal = () => {
    setMaterialType('resource');
    setResourceFile(null);
    setResourceForm({
      label: '',
      type: 'FileText',
      category: 'Lecture Notes',
      fileUrl: '',
      color: 'text-brand-teal',
      bg: 'bg-brand-teal/10'
    });
    setIsMaterialModalOpen(true);
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    if (!selectedHubSubject) return;

    setMaterialUploading(true);
    try {
      let updatedMaterials = JSON.parse(JSON.stringify(selectedMaterials || {}));
      delete updatedMaterials.id;

      if (!updatedMaterials.playlists) updatedMaterials.playlists = {};
      if (!updatedMaterials.playlists[activeTrack]) updatedMaterials.playlists[activeTrack] = { featured: null, alternatives: [] };
      if (!updatedMaterials.resources) updatedMaterials.resources = [];

      if (materialType === 'playlist') {
        updatedMaterials.playlists[activeTrack].featured = {
          title: playlistForm.title,
          channel: playlistForm.channel,
          playlistUrl: playlistForm.playlistUrl,
          duration: playlistForm.duration,
          videos: Number(playlistForm.videos) || 1,
          lang: playlistForm.lang,
          level: playlistForm.level,
          thumbnail: playlistForm.thumbnail || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000'
        };
        addToast({ message: `Updated ${activeTrack.toUpperCase()} playlist for ${selectedHubSubject.name}!`, type: "success" });
      } else if (materialType === 'resource') {
        let finalUrl = resourceForm.fileUrl;
        if (resourceFile) {
          const cleanName = resourceFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const path = `subject_resources/${selectedHubSubject.id}/${Date.now()}_${cleanName}`;
          finalUrl = await uploadFile(path, resourceFile);
        }

        const newResource = {
          id: Date.now(),
          label: resourceForm.label,
          category: resourceForm.category,
          type: resourceForm.type,
          fileUrl: finalUrl,
          color: resourceForm.color,
          bg: resourceForm.bg,
          uploadedBy: user?.name || user?.email || 'Teammate',
          uploadedAt: new Date().toLocaleDateString()
        };

        updatedMaterials.resources.push(newResource);
        addToast({ message: `Resource "${resourceForm.label}" added to ${selectedHubSubject.name}!`, type: "success" });
      }

      await updateHubMaterials(selectedHubSubject.id, updatedMaterials);
      setIsMaterialModalOpen(false);
      setResourceFile(null);
    } catch (err) {
      console.error("Save material error:", err);
      addToast({ message: "Failed to update materials. Please try again.", type: "error" });
    } finally {
      setMaterialUploading(false);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!selectedHubSubject || !window.confirm("Remove this resource from Learning Hub?")) return;
    try {
      let updatedMaterials = JSON.parse(JSON.stringify(selectedMaterials));
      delete updatedMaterials.id;
      updatedMaterials.resources = (updatedMaterials.resources || []).filter(r => r.id !== resourceId);
      await updateHubMaterials(selectedHubSubject.id, updatedMaterials);
      addToast({ message: "Resource removed successfully.", type: "success" });
    } catch (err) {
      console.error("Delete resource error:", err);
      addToast({ message: "Failed to remove resource.", type: "error" });
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 md:px-6">
      
      {/* ── HEADER BANNER ────────────────────────────────────────────── */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-r from-brand-purple/20 via-brand-teal/10 to-brand-pink/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-black tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Lumixora Core Contributor Portal
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              Teammate Command Hub
              <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-brand-purple">
                Team Access ⚡
              </span>
            </h1>
            <p className="text-xs md:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Welcome back, <strong className="text-white font-bold">{formatCleanName(user?.name, user?.email)}</strong>! Upload verified question papers, curate high-yield video playlists, and publish curriculum notes for scholars.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-center backdrop-blur-md min-w-[100px]">
              <span className="block text-xl md:text-2xl font-black text-brand-teal">{previousPapersList.length}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Papers Live</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-center backdrop-blur-md min-w-[100px]">
              <span className="block text-xl md:text-2xl font-black text-brand-purple">{hubSubjects.length}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Subjects</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-center backdrop-blur-md min-w-[100px]">
              <span className="block text-xl md:text-2xl font-black text-brand-pink">
                {hubMaterials.reduce((acc, m) => acc + (m.resources?.length || 0), 0)}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Resources</span>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setActiveSection('papers')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSection === 'papers'
                ? 'bg-brand-teal text-black shadow-lg shadow-brand-teal/20 scale-105'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Previous Question Papers ({previousPapersList.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('hub')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSection === 'hub'
                ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20 scale-105'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Learning Hub & Playlists</span>
          </button>

          <button
            onClick={() => setActiveSection('preview')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSection === 'preview'
                ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20 scale-105'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Student View Shortcut</span>
          </button>
        </div>
      </div>

      {/* ── SECTION 1: PREVIOUS PAPERS UPLOADER & MANAGER ─────────────── */}
      {activeSection === 'papers' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Action & Filter Bar */}
          <div className="glass-panel p-4 md:p-6 rounded-3xl border border-white/10 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={paperSearch}
                onChange={(e) => setPaperSearch(e.target.value)}
                placeholder="Search question papers by title, subject or code..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={paperBranch}
                onChange={(e) => setPaperBranch(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-gray-300 font-bold focus:outline-none"
              >
                <option value="All">All Branches</option>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>

              <select
                value={paperSem}
                onChange={(e) => setPaperSem(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-gray-300 font-bold focus:outline-none"
              >
                <option value="All">All Semesters</option>
                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select
                value={paperExamType}
                onChange={(e) => setPaperExamType(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-gray-300 font-bold focus:outline-none"
              >
                {examTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              {/* Add Paper Button */}
              <button
                onClick={handleOpenAddPaper}
                className="bg-brand-teal hover:opacity-90 text-black font-black px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-brand-teal/20 transition-all cursor-pointer ml-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Paper</span>
              </button>
            </div>
          </div>

          {/* Paper Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {previousPapersList.length === 0 ? (
              <div className="col-span-full glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto">
                  📄
                </div>
                <h3 className="text-base font-bold text-white">No Previous Papers Found</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Upload university mid-term or semester-end papers so students can prepare with authentic past questions.
                </p>
                <button
                  onClick={handleOpenAddPaper}
                  className="bg-brand-teal text-black font-extrabold px-6 py-2.5 rounded-2xl text-xs inline-flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload First Question Paper</span>
                </button>
              </div>
            ) : (
              previousPapersList.map(paper => (
                <div
                  key={paper.id}
                  className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-brand-teal/40 transition-all group flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-brand-teal/10 border border-brand-teal/30 text-[10px] font-black text-brand-teal uppercase">
                        {paper.branch || 'Engineering'} • {paper.semester || 'Sem'}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300">
                        {paper.year || '2024'} ({paper.regulation || 'R20'})
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-white group-hover:text-brand-teal transition-colors line-clamp-2">
                        {paper.title}
                      </h4>
                      <p className="text-xs font-semibold text-gray-400 mt-1 flex items-center gap-1.5">
                        <span>{paper.subject || 'Core Subject'}</span>
                        {paper.subjectCode && (
                          <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-md text-gray-400">
                            {paper.subjectCode}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="text-[11px] text-gray-400 bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Exam Type:</span>
                        <span className="font-bold text-gray-200">{paper.examType || 'Semester End'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Contributor:</span>
                        <span className="font-bold text-brand-teal">{paper.contributedBy || 'Teammate'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                    {paper.fileUrl && (
                      <button
                        onClick={() => setPaperPreviewUrl(convertToEmbedUrl(paper.fileUrl))}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-teal" />
                        <span>Preview</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenEditPaper(paper)}
                      className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
                      title="Edit Paper"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeletePaper(paper.id, paper.title)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-colors cursor-pointer"
                      title="Delete Paper"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── SECTION 2: LEARNING HUB & PLAYLISTS MANAGER ────────────────── */}
      {activeSection === 'hub' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Branch & Semester Selection Bar */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-purple" />
                  Select Branch & Semester to Manage Subjects
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Curate syllabi, verified video playlists, and high-yield study materials.
                </p>
              </div>

              <button
                onClick={handleOpenAddSubject}
                className="bg-brand-purple hover:bg-brand-purple/90 text-white font-black px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-brand-purple/20 transition-all cursor-pointer self-start md:self-auto"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Add New Subject</span>
              </button>
            </div>

            {/* Branch Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-2">Branch:</span>
              {branches.map(b => (
                <button
                  key={b}
                  onClick={() => { setHubBranch(b); setSelectedHubSubject(null); }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    hubBranch === b
                      ? 'bg-brand-purple text-white shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/5'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Semester Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-2">Semester:</span>
              {semesters.map(s => (
                <button
                  key={s}
                  onClick={() => { setHubSem(s); setSelectedHubSubject(null); }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    hubSem === s
                      ? 'bg-brand-teal text-black shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/5'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Subjects Grid & Detailed Material Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Subject List Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                  {hubBranch} • {hubSem} Subjects ({filteredHubSubjects.length})
                </span>
              </div>

              {filteredHubSubjects.length === 0 ? (
                <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-3">
                  <p className="text-xs text-gray-400">No subjects found for this branch and semester.</p>
                  <button
                    onClick={handleOpenAddSubject}
                    className="bg-brand-purple/20 text-brand-purple hover:bg-brand-purple/30 font-bold px-4 py-2 rounded-xl text-xs border border-brand-purple/30 transition-colors cursor-pointer"
                  >
                    + Add Subject
                  </button>
                </div>
              ) : (
                filteredHubSubjects.map(sub => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedHubSubject(sub)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedHubSubject?.id === sub.id
                        ? 'glass-panel border-brand-purple bg-brand-purple/10 shadow-lg shadow-brand-purple/10'
                        : 'glass-panel border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/10 text-brand-teal font-mono">
                          {sub.code || 'SUB'}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1.5">{sub.name}</h4>
                        <span className="text-[11px] text-gray-400 mt-1 block">
                          {sub.credits || 3} Credits • {sub.difficulty || 'Medium'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenEditSubject(sub)}
                          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                          title="Edit Subject"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(sub.id, sub.name)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Subject Materials & Playlist Curator Column */}
            <div className="lg:col-span-2 space-y-6">
              {selectedHubSubject ? (
                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6 animate-fade-in">
                  
                  {/* Selected Subject Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-brand-purple/20 text-brand-purple text-xs font-mono font-bold">
                          {selectedHubSubject.code}
                        </span>
                        <h3 className="text-lg font-black text-white">{selectedHubSubject.name}</h3>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Curate playlists across 3 tracks and upload unit notes, syllabi & formulas.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleOpenResourceModal}
                        className="bg-brand-teal text-black font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-md"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Resource</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. PLAYLIST TRACKS (Pass, Complete, Industry) */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
                      <Video className="w-4 h-4 text-brand-teal" />
                      Curated Video Playlists (3 Tracks)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Track 1: Pass Track */}
                      {['pass', 'complete', 'industry'].map((trackKey) => {
                        const trackNames = {
                          pass: '⚡ Pass Track (One-Shot)',
                          complete: '📚 Complete Semester',
                          industry: '💼 Industry & Placements'
                        };
                        const trackColors = {
                          pass: 'border-brand-teal/30 bg-brand-teal/5 text-brand-teal',
                          complete: 'border-brand-purple/30 bg-brand-purple/5 text-brand-purple',
                          industry: 'border-brand-pink/30 bg-brand-pink/5 text-brand-pink'
                        };
                        const featured = selectedMaterials?.playlists?.[trackKey]?.featured;

                        return (
                          <div
                            key={trackKey}
                            className={`p-4 rounded-2xl border ${trackColors[trackKey]} flex flex-col justify-between space-y-3`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black">{trackNames[trackKey]}</span>
                                <button
                                  onClick={() => handleOpenPlaylistModal(trackKey)}
                                  className="text-[10px] font-bold underline cursor-pointer hover:opacity-80"
                                >
                                  {featured ? 'Edit' : '+ Setup'}
                                </button>
                              </div>

                              {featured ? (
                                <div className="space-y-1">
                                  <h5 className="text-xs font-bold text-white line-clamp-1">{featured.title}</h5>
                                  <p className="text-[11px] text-gray-400">{featured.channel} • {featured.duration}</p>
                                  {featured.playlistUrl && (
                                    <a
                                      href={featured.playlistUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-brand-teal hover:underline flex items-center gap-1 mt-1 font-semibold"
                                    >
                                      <ExternalLink className="w-3 h-3" /> Open Playlist
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <p className="text-[11px] text-gray-500 italic">No playlist set up yet.</p>
                              )}
                            </div>

                            <button
                              onClick={() => handleOpenPlaylistModal(trackKey)}
                              className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-1.5 rounded-xl text-[11px] border border-white/10 transition-colors cursor-pointer"
                            >
                              {featured ? 'Update Playlist' : 'Add Playlist'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. ACADEMIC RESOURCES (Syllabus, Notes, Formulas) */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4 text-brand-pink" />
                        Uploaded Study Resources ({selectedMaterials?.resources?.length || 0})
                      </h4>
                      <button
                        onClick={handleOpenResourceModal}
                        className="text-xs font-bold text-brand-teal hover:underline cursor-pointer"
                      >
                        + Add File
                      </button>
                    </div>

                    {(!selectedMaterials?.resources || selectedMaterials.resources.length === 0) ? (
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-gray-400">
                        No resource PDFs or links uploaded for this subject yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedMaterials.resources.map(res => (
                          <div
                            key={res.id}
                            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-all"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-9 h-9 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center shrink-0 text-brand-teal">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="overflow-hidden">
                                <h5 className="text-xs font-bold text-white truncate">{res.label}</h5>
                                <span className="text-[10px] text-gray-400 block">{res.category || 'Academic Resource'}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {res.fileUrl && (
                                <button
                                  onClick={() => setPaperPreviewUrl(convertToEmbedUrl(res.fileUrl))}
                                  className="p-1.5 bg-white/5 hover:bg-white/10 text-brand-teal rounded-lg text-xs"
                                  title="View Resource"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteResource(res.id)}
                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs"
                                title="Remove Resource"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-3">
                  <BookOpen className="w-12 h-12 text-gray-600 mx-auto opacity-50" />
                  <h4 className="text-sm font-bold text-white">Select a Subject to Manage Content</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Click on any subject in the left column to configure YouTube playlists and attach verified PDF resources.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── SECTION 3: STUDENT VIEW SHORTCUT ──────────────────────────── */}
      {activeSection === 'preview' && (
        <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-6 animate-fade-in max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center text-3xl mx-auto text-brand-teal">
            👁️
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-white">Live Student Experience Preview</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Verify how your uploaded question papers, YouTube video playlists, and notes render for scholars across web and mobile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => setActiveTab && setActiveTab('notes')}
              className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-teal/40 transition-all text-left space-y-2 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <FileText className="w-6 h-6 text-brand-teal" />
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-brand-teal group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-teal transition-colors">Previous Papers Platform</h4>
              <p className="text-xs text-gray-400">Open the student previous papers repository and AI reader.</p>
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('learning-hub')}
              className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-purple/40 transition-all text-left space-y-2 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <BookOpen className="w-6 h-6 text-brand-purple" />
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-purple transition-colors">Learning Hub Platform</h4>
              <p className="text-xs text-gray-400">Browse semester subjects, video tracks & study materials.</p>
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: UPLOAD / EDIT QUESTION PAPER ─────────────────────────── */}
      {isPaperModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 md:p-8 border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar relative animate-fade-in-up">
            <button
              onClick={() => setIsPaperModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-teal" />
                {editingPaperId ? 'Edit Question Paper' : 'Upload Previous Year Question Paper'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Fill in the academic details and attach the official question paper PDF.
              </p>
            </div>

            <form onSubmit={handleSavePaper} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Paper Title *</label>
                <input
                  type="text"
                  required
                  value={paperForm.title}
                  onChange={(e) => setPaperForm({ ...paperForm, title: e.target.value })}
                  placeholder="e.g. Data Structures & Algorithms - Mid 1 - Nov 2024"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={paperForm.subject}
                    onChange={(e) => setPaperForm({ ...paperForm, subject: e.target.value })}
                    placeholder="e.g. Operating Systems"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={paperForm.subjectCode}
                    onChange={(e) => setPaperForm({ ...paperForm, subjectCode: e.target.value })}
                    placeholder="e.g. CS301"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Branch *</label>
                  <select
                    value={paperForm.branch}
                    onChange={(e) => setPaperForm({ ...paperForm, branch: e.target.value })}
                    className="w-full bg-[#12121e] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none"
                  >
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Semester *</label>
                  <select
                    value={paperForm.semester}
                    onChange={(e) => setPaperForm({ ...paperForm, semester: e.target.value })}
                    className="w-full bg-[#12121e] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none"
                  >
                    {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Exam Type</label>
                  <select
                    value={paperForm.examType}
                    onChange={(e) => setPaperForm({ ...paperForm, examType: e.target.value })}
                    className="w-full bg-[#12121e] border border-white/10 rounded-xl px-2.5 py-2.5 text-xs text-white font-semibold focus:outline-none"
                  >
                    <option value="Mid 1 Exam">Mid 1 Exam</option>
                    <option value="Mid 2 Exam">Mid 2 Exam</option>
                    <option value="End Semester Regular">End Semester Regular</option>
                    <option value="Supplementary Exam">Supplementary Exam</option>
                    <option value="Model / Practice Paper">Model Paper</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Year</label>
                  <input
                    type="text"
                    value={paperForm.year}
                    onChange={(e) => setPaperForm({ ...paperForm, year: e.target.value })}
                    placeholder="2024"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Regulation</label>
                  <input
                    type="text"
                    value={paperForm.regulation}
                    onChange={(e) => setPaperForm({ ...paperForm, regulation: e.target.value })}
                    placeholder="R20"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Direct File Upload */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-300 block">Attach Paper File (PDF / Word)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setPaperFile(e.target.files[0] || null)}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-teal/20 file:text-brand-teal hover:file:bg-brand-teal/30 cursor-pointer"
                />
                {paperFile && (
                  <span className="text-[10px] text-emerald-400 font-bold block">✓ Attached: {paperFile.name}</span>
                )}
              </div>

              {/* Direct URL Fallback */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Or Paste Google Drive / Cloud Link</label>
                <input
                  type="url"
                  value={paperForm.fileUrl}
                  onChange={(e) => setPaperForm({ ...paperForm, fileUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/.../view"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPaperModalOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paperUploading}
                  className="flex-1 bg-brand-teal hover:opacity-90 text-black font-extrabold py-3 rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {paperUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Paper...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingPaperId ? 'Update Paper' : 'Publish Question Paper'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD / EDIT SUBJECT ─────────────────────────────────── */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 md:p-8 border border-white/10 relative animate-fade-in-up">
            <button
              onClick={() => setIsSubjectModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-purple" />
                {editingSubjectId ? 'Edit Subject' : 'Add Subject to Learning Hub'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Configure curriculum course details for {subjectForm.branch} • {subjectForm.semester}.
              </p>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  placeholder="e.g. Design and Analysis of Algorithms"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    placeholder="e.g. CS401"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={subjectForm.credits}
                    onChange={(e) => setSubjectForm({ ...subjectForm, credits: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Branch</label>
                  <select
                    value={subjectForm.branch}
                    onChange={(e) => setSubjectForm({ ...subjectForm, branch: e.target.value })}
                    className="w-full bg-[#12121e] border border-white/10 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none"
                  >
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Semester</label>
                  <select
                    value={subjectForm.semester}
                    onChange={(e) => setSubjectForm({ ...subjectForm, semester: e.target.value })}
                    className="w-full bg-[#12121e] border border-white/10 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none"
                  >
                    {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Difficulty</label>
                  <select
                    value={subjectForm.difficulty}
                    onChange={(e) => setSubjectForm({ ...subjectForm, difficulty: e.target.value })}
                    className="w-full bg-[#12121e] border border-white/10 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-purple hover:bg-brand-purple/90 text-white font-extrabold py-3 rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSubjectId ? 'Update Subject' : 'Add Subject'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD / EDIT MATERIAL (PLAYLIST OR RESOURCE) ─────────── */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 md:p-8 border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar relative animate-fade-in-up">
            <button
              onClick={() => setIsMaterialModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                {materialType === 'playlist' ? <Video className="w-5 h-5 text-brand-teal" /> : <FileText className="w-5 h-5 text-brand-pink" />}
                {materialType === 'playlist' ? `Configure ${activeTrack.toUpperCase()} Playlist` : 'Upload Study Resource'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Target Subject: <strong className="text-white">{selectedHubSubject?.name}</strong>
              </p>
            </div>

            {materialType === 'playlist' ? (
              <form onSubmit={handleSaveMaterial} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Playlist Title *</label>
                  <input
                    type="text"
                    required
                    value={playlistForm.title}
                    onChange={(e) => setPlaylistForm({ ...playlistForm, title: e.target.value })}
                    placeholder="e.g. One Shot Complete Revision"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">Channel Name *</label>
                    <input
                      type="text"
                      required
                      value={playlistForm.channel}
                      onChange={(e) => setPlaylistForm({ ...playlistForm, channel: e.target.value })}
                      placeholder="e.g. Neso Academy"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">Estimated Duration</label>
                    <input
                      type="text"
                      value={playlistForm.duration}
                      onChange={(e) => setPlaylistForm({ ...playlistForm, duration: e.target.value })}
                      placeholder="e.g. 12h"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">YouTube Playlist URL *</label>
                  <input
                    type="url"
                    required
                    value={playlistForm.playlistUrl}
                    onChange={(e) => setPlaylistForm({ ...playlistForm, playlistUrl: e.target.value })}
                    placeholder="https://www.youtube.com/playlist?list=..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">Total Videos</label>
                    <input
                      type="number"
                      min="1"
                      value={playlistForm.videos}
                      onChange={(e) => setPlaylistForm({ ...playlistForm, videos: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">Language</label>
                    <input
                      type="text"
                      value={playlistForm.lang}
                      onChange={(e) => setPlaylistForm({ ...playlistForm, lang: e.target.value })}
                      placeholder="English / Telugu / Hindi"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsMaterialModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={materialUploading}
                    className="flex-1 bg-brand-teal hover:opacity-90 text-black font-extrabold py-3 rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Playlist</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveMaterial} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Resource Label *</label>
                  <input
                    type="text"
                    required
                    value={resourceForm.label}
                    onChange={(e) => setResourceForm({ ...resourceForm, label: e.target.value })}
                    placeholder="e.g. Unit 1 to 5 Comprehensive Notes (PDF)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Category</label>
                  <select
                    value={resourceForm.category}
                    onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                    className="w-full bg-[#12121e] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none"
                  >
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Official Syllabus">Official Syllabus Copy</option>
                    <option value="Formula Cheat Sheet">Formula Cheat Sheet</option>
                    <option value="Question Bank">Question Bank / Imp Questions</option>
                    <option value="Lab Manual">Lab Manual</option>
                  </select>
                </div>

                {/* Direct File Attachment */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-300 block">Attach File (PDF / Docs)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResourceFile(e.target.files[0] || null)}
                    className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-pink/20 file:text-brand-pink hover:file:bg-brand-pink/30 cursor-pointer"
                  />
                  {resourceFile && (
                    <span className="text-[10px] text-emerald-400 font-bold block">✓ File Attached: {resourceFile.name}</span>
                  )}
                </div>

                {/* Link Fallback */}
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Or Cloud / Web Link</label>
                  <input
                    type="url"
                    value={resourceForm.fileUrl}
                    onChange={(e) => setResourceForm({ ...resourceForm, fileUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsMaterialModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={materialUploading}
                    className="flex-1 bg-brand-pink hover:opacity-90 text-white font-extrabold py-3 rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {materialUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Upload Resource</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: DOCUMENT / PDF PREVIEWER ────────────────────────────── */}
      {paperPreviewUrl && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[99999] flex flex-col p-4 md:p-6">
          <div className="flex items-center justify-between pb-4 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-teal" />
              <span className="text-sm font-bold text-white">Live Resource Preview</span>
            </div>
            <button
              onClick={() => setPaperPreviewUrl(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 max-w-5xl mx-auto w-full glass-panel rounded-3xl border border-white/10 overflow-hidden bg-black/50">
            <iframe
              src={paperPreviewUrl}
              className="w-full h-full border-none rounded-3xl"
              title="Document Preview"
            />
          </div>
        </div>
      )}

    </div>
  );
}
