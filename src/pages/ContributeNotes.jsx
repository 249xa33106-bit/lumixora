import React, { useState } from 'react';
import { UploadCloud, Sparkles, BookOpen, User, FolderPlus, Compass, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';
import { Capacitor } from '@capacitor/core';

export default function ContributeNotes({ user, setActiveTab }) {
  const { addNote, uploadFile } = useData();
  const { addToast } = useToast();
  const { awardXP } = useGamification();

  const [userName, setUserName] = useState(user?.name || '');
  const [notesName, setNotesName] = useState('');
  const [subject, setSubject] = useState('CSE');
  const [semester, setSemester] = useState('Sem 1');
  const [topic, setTopic] = useState('');
  const [unit, setUnit] = useState('Unit 1');
  const [driveLink, setDriveLink] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const branches = ['CSE', 'CSM', 'ECE', 'EEE', 'Civil', 'Mechanical'];
  const semesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];
  const units = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDriveLink(''); // Clear drive link if file uploaded
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notesName.trim() || !userName.trim() || !topic.trim()) {
      addToast({ message: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    if (!file && !driveLink.trim()) {
      addToast({ message: 'Please upload a PDF file or provide a Google Drive Link.', type: 'error' });
      return;
    }

    const isNative = Capacitor.isNativePlatform();
    let newWindow = null;

    // Open a blank tab synchronously only on web to bypass popup blockers
    if (!isNative) {
      newWindow = window.open('', '_blank');
    }

    setLoading(true);
    let fileUrl = driveLink.trim();

    try {
      if (file) {
        const path = `contributions/${Date.now()}_${file.name}`;
        fileUrl = await uploadFile(path, file);
      }

      const noteData = {
        title: notesName.trim(),
        subject: `${subject} - ${semester}`,
        size: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '-- MB',
        downloads: 0,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: file ? 'PDF Document' : 'Drive Link',
        fileUrl: fileUrl,
        contributedBy: userName.trim(),
        topic: topic.trim(),
        unit: unit,
        aiEnhancement: {
          status: 'error',
          summary: `Contributed by ${userName.trim()} for Topic: ${topic.trim()} (${unit}). AI summaries not ready.`,
          concepts: [topic.trim()],
          questions: []
        }
      };

      await addNote(noteData);
      addToast({ message: 'Thank you for your contribution! Note added to library.', type: 'success' });
      
      // Automatically award XP for notes contribution!
      await awardXP('UPLOAD_NOTES');

      // Send notes details to your WhatsApp number
      const targetPhone = "919346476055"; // Your correct mobile number with country code
      const text = `📚 *New Note Contribution*\n\n`
        + `👤 *Contributor:* ${userName.trim()}\n`
        + `📄 *Title:* ${notesName.trim()}\n`
        + `🎓 *Subject:* ${subject} - ${semester}\n`
        + `📌 *Topic:* ${topic.trim()}\n`
        + `📁 *Unit:* ${unit}\n`
        + `🔗 *Link/File:* ${fileUrl}`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(text)}`;
      
      if (isNative) {
        window.open(whatsappUrl, '_system');
      } else if (newWindow) {
        newWindow.location.href = whatsappUrl;
      } else {
        window.open(whatsappUrl, '_blank');
      }
      
      // Reset form
      setNotesName('');
      setTopic('');
      setDriveLink('');
      setFile(null);
      
      // Redirect to previous papers tab
      if (setActiveTab) {
        setActiveTab('notes');
      }
    } catch (err) {
      console.error(err);
      if (newWindow) newWindow.close();
      addToast({ message: 'Failed to submit contribution. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="relative rounded-3xl p-8 overflow-hidden glass-panel border border-border-glass bg-gradient-to-br from-brand-teal/10 via-slate-900/40 to-brand-purple/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-teal/10 to-brand-purple/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-[10px] font-bold text-brand-teal uppercase tracking-wider">
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>Community Knowledge Sharing</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Contribute Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-blue">Academic Notes</span>
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Help your peers succeed by uploading high-yield class notes, previous papers, or topic summaries. Your notes will appear live in the Previous Papers directory.
          </p>
        </div>
      </div>

      {/* Contribution Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 bg-black/25">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Contributor Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-brand-teal" />
                <span>Your Name (Contributor) *</span>
              </label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-brand-teal outline-none transition-colors"
                required
              />
            </div>

            {/* Document Title */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                <FolderPlus className="w-3.5 h-3.5 text-brand-teal" />
                <span>Notes Title (e.g. Unit 2 Revision) *</span>
              </label>
              <input 
                type="text" 
                value={notesName}
                onChange={(e) => setNotesName(e.target.value)}
                placeholder="e.g. Data Structures Quick Reference" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-brand-teal outline-none transition-colors"
                required
              />
            </div>

            {/* Subject Branch */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-brand-blue" />
                <span>Subject Branch *</span>
              </label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-300 focus:border-brand-blue outline-none transition-colors appearance-none"
              >
                {branches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-brand-blue" />
                <span>Semester *</span>
              </label>
              <select 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-300 focus:border-brand-blue outline-none transition-colors appearance-none"
              >
                {semesters.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Topic Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                <span>Specific Topic / Chapter Name *</span>
              </label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. B-Trees and AVL Trees" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-brand-purple outline-none transition-colors"
                required
              />
            </div>

            {/* Unit */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                <FolderPlus className="w-3.5 h-3.5 text-brand-purple" />
                <span>Unit Number *</span>
              </label>
              <select 
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-300 focus:border-brand-purple outline-none transition-colors appearance-none"
              >
                {units.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="h-[1px] bg-white/10 my-8"></div>

          {/* Document Upload Area */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Attach Notes Document</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* File Upload Box */}
              <div className="md:col-span-5 relative group border-2 border-dashed border-white/10 hover:border-brand-teal/40 rounded-2xl p-6 text-center transition-all bg-white/5">
                <input 
                  type="file" 
                  id="contribute-file-upload" 
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden" 
                />
                <label htmlFor="contribute-file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <UploadCloud className="w-8 h-8 text-brand-teal group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-gray-300">Upload PDF File</span>
                  <span className="text-[10px] text-gray-500">Max size 25MB</span>
                </label>
                {file && (
                  <div className="mt-3 p-2 bg-brand-teal/15 rounded-xl border border-brand-teal/20 text-left text-[11px] text-brand-teal font-semibold truncate">
                    Attached: {file.name}
                  </div>
                )}
              </div>

              {/* Or separator */}
              <div className="md:col-span-2 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                — OR —
              </div>

              {/* Drive Link Box */}
              <div className="md:col-span-5 space-y-2">
                <label className="text-xs font-semibold text-gray-300 block">
                  Paste Google Drive Link
                </label>
                <input 
                  type="url" 
                  value={driveLink}
                  onChange={(e) => {
                    setDriveLink(e.target.value);
                    if (e.target.value) setFile(null); // Clear file if drive link entered
                  }}
                  placeholder="https://drive.google.com/file/d/..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-brand-teal outline-none transition-colors"
                />
                <span className="text-[9px] text-gray-500 block leading-normal">
                  Make sure link sharing is set to "Anyone with the link can view".
                </span>
              </div>

            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-brand-teal to-brand-blue text-black hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,245,212,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting Notes...</span>
                </>
              ) : (
                <>
                  <span>Submit Note</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
