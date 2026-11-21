import React, { useState, useEffect } from 'react';
import { 
  Search, BookOpen, ChevronRight, GraduationCap, Map, Clock, Shield, Plus, Trash2, 
  Edit2, X, Video, Sparkles, Film, Layers, Award, Filter, SlidersHorizontal, Check, FileText
} from 'lucide-react';
import SubjectPage from './SubjectPage';
import VideoPortal from './VideoPortal';
import { useData } from '../context/DataContext';

export default function LearningHub({ user, setActiveTab, initialTab = 'videos' }) {
  const { hubSubjects, addHubSubject, updateHubSubject, deleteHubSubject, hubMaterials, updateHubMaterials, uploadFile } = useData();
  
  const [activeHubView, setActiveHubView] = useState(initialTab === 'resources' || initialTab === 'notes' ? 'resources' : 'videos');
  
  // ── Auto-Detect User's Branch & Semester ──
  const [selectedScheme, setSelectedScheme] = useState('Scheme-2026');
  const [selectedBranch, setSelectedBranch] = useState(() => {
    const userBranch = user?.branch || user?.department;
    if (userBranch) {
      const ub = userBranch.toUpperCase();
      if (['CSE', 'CSM', 'ECE', 'EEE', 'CIVIL', 'MECHANICAL'].includes(ub)) {
        return ub === 'CIVIL' ? 'Civil' : ub === 'MECHANICAL' ? 'Mechanical' : ub;
      }
    }
    return 'CSE';
  });

  const [selectedSem, setSelectedSem] = useState(() => {
    const userSem = user?.semester || user?.sem;
    if (userSem) {
      const semNum = String(userSem).replace(/[^0-9]/g, '');
      if (semNum && Number(semNum) >= 1 && Number(semNum) <= 8) {
        return `Sem ${semNum}`;
      }
    }
    return 'Sem 1';
  });

  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'theory' | 'labs'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState(null);
  const [isFounderMode, setIsFounderMode] = useState(false);

  // Synchronize subject selection with window location hash for back button support
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/learning-hub/subject-')) {
        const subId = hash.replace('#/learning-hub/subject-', '');
        const matched = hubSubjects.find(s => String(s.id) === subId);
        if (matched) {
          setActiveSubject(matched);
        }
      } else if (hash === '#/learning-hub' || hash === 'learning-hub') {
        setActiveSubject(null);
      }
    };
    
    window.addEventListener('hashchange', handleHash);
    handleHash(); // initial check
    return () => window.removeEventListener('hashchange', handleHash);
  }, [hubSubjects]);

  const handleSelectSubject = (subject) => {
    setActiveSubject(subject);
    window.location.hash = `#/learning-hub/subject-${subject.id}`;
  };

  const handleBackFromSubject = () => {
    setActiveSubject(null);
    window.location.hash = `#/learning-hub`;
  };

  const branches = ['CSE', 'CSM', 'ECE', 'EEE', 'Civil', 'Mechanical'];
  const semesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];

  // Modal State for adding/editing subject
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [subjectForm, setSubjectForm] = useState({
    name: '', code: '', credits: 3, difficulty: 'Medium'
  });

  // Quick Upload State
  const [quickUploadSubject, setQuickUploadSubject] = useState(null);
  const [quickFile, setQuickFile] = useState(null);
  const [quickUrl, setQuickUrl] = useState('');
  const [quickLabel, setQuickLabel] = useState('');
  const [quickUploading, setQuickUploading] = useState(false);

  const schemes = [
    { id: 'Scheme-2026', label: 'Scheme-2026 (Autonomous)', badge: '2026' },
    { id: '2023 Scheme', label: 'Scheme-2023 (Autonomous)', badge: '2023' },
    { id: 'All', label: 'All Curricula', badge: 'ALL' }
  ];

  const filteredSubjects = hubSubjects.filter(sub => {
    const matchesBranch = sub.branch === selectedBranch || (sub.branchesApplicable && sub.branchesApplicable.includes(selectedBranch));
    const matchesSem = sub.semester === selectedSem || (sub.semestersApplicable && sub.semestersApplicable.includes(selectedSem));
    const matchesScheme = selectedScheme === 'All' || 
      (selectedScheme === 'Scheme-2026' && (sub.scheme === 'Scheme-2026' || !sub.scheme && (sub.semester === 'Sem 1' || sub.semester === 'Sem 2'))) ||
      (selectedScheme === '2023 Scheme' && (sub.scheme === '2023 Scheme' || !sub.scheme));
    const matchesSearch = !searchQuery || 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (sub.code && sub.code.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category filter: theory vs lab
    const isLab = (sub.name || '').toLowerCase().includes('lab') || (sub.name || '').toLowerCase().includes('workshop') || (sub.name || '').toLowerCase().includes('practice');
    const matchesCategory = categoryFilter === 'all' || (categoryFilter === 'labs' && isLab) || (categoryFilter === 'theory' && !isLab);
      
    return matchesBranch && matchesSem && matchesScheme && matchesSearch && matchesCategory;
  });

  const theoryCount = hubSubjects.filter(s => (s.branch === selectedBranch || (s.branchesApplicable && s.branchesApplicable.includes(selectedBranch))) && (s.semester === selectedSem || (s.semestersApplicable && s.semestersApplicable.includes(selectedSem))) && !((s.name || '').toLowerCase().includes('lab') || (s.name || '').toLowerCase().includes('workshop') || (s.name || '').toLowerCase().includes('practice'))).length;
  const labCount = hubSubjects.filter(s => (s.branch === selectedBranch || (s.branchesApplicable && s.branchesApplicable.includes(selectedBranch))) && (s.semester === selectedSem || (s.semestersApplicable && s.semestersApplicable.includes(selectedSem))) && ((s.name || '').toLowerCase().includes('lab') || (s.name || '').toLowerCase().includes('workshop') || (s.name || '').toLowerCase().includes('practice'))).length;

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSubjectForm({ name: '', code: '', credits: 3, difficulty: 'Medium' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e, subject) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditingId(subject.id);
    setSubjectForm({ 
      name: subject.name, 
      code: subject.code, 
      credits: subject.credits, 
      difficulty: subject.difficulty 
    });
    setIsModalOpen(true);
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateHubSubject(editingId, subjectForm);
    } else {
      const subjectToAdd = {
        ...subjectForm,
        branch: selectedBranch,
        semester: selectedSem
      };
      await addHubSubject(subjectToAdd);
    }
    setIsModalOpen(false);
  };

  const handleDeleteSubject = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this subject? All its resources will be unlinked globally.")) {
      await deleteHubSubject(id);
    }
  };

  const handleQuickUploadOpen = (e, subject) => {
    e.stopPropagation();
    setQuickUploadSubject(subject);
    setQuickFile(null);
    setQuickUrl('');
    setQuickLabel('');
    setQuickUploading(false);
  };

  const handleQuickUploadSubmit = async (e) => {
    e.preventDefault();
    if (!quickFile && !quickUrl) {
      alert("Please upload a file or paste a document URL.");
      return;
    }

    setQuickUploading(true);
    try {
      let downloadUrl = quickUrl;

      if (quickFile) {
        const path = `subject_resources/${quickUploadSubject.id}/${Date.now()}_${quickFile.name}`;
        downloadUrl = await uploadFile(path, quickFile);
      }

      const currentMat = hubMaterials.find(m => m.id === quickUploadSubject.id) || {
        playlists: { pass: { featured: null, alternatives: [] }, complete: { featured: null, alternatives: [] }, industry: { featured: null, alternatives: [] } },
        resources: []
      };

      const updatedMaterials = JSON.parse(JSON.stringify(currentMat));
      delete updatedMaterials.id;

      const newResource = {
        id: `res_${Date.now()}`,
        name: quickLabel || quickFile?.name || "Uploaded Document",
        type: quickFile ? quickFile.name.split('.').pop().toUpperCase() : 'PDF',
        url: downloadUrl,
        size: quickFile ? `${(quickFile.size / (1024 * 1024)).toFixed(1)} MB` : 'Cloud Link'
      };

      updatedMaterials.resources.push(newResource);

      await updateHubMaterials(quickUploadSubject.id, updatedMaterials);
      setQuickUploadSubject(null);
    } catch (err) {
      alert("Failed to save resource. Please try again.");
    } finally {
      setQuickUploading(false);
    }
  };

  const handleNavigateBranchSem = (branch, sem) => {
    setActiveSubject(null);
    window.location.hash = `#/learning-hub`;
    if (branch) setSelectedBranch(branch);
    if (sem) setSelectedSem(sem);
  };

  // If a subject is selected, render the detailed Subject Page instead
  if (activeSubject) {
    return (
      <SubjectPage 
        subject={activeSubject} 
        onBack={handleBackFromSubject} 
        onNavigateBranchSem={handleNavigateBranchSem}
        user={user} 
      />
    );
  }

  return (
    <div className="space-y-5 animate-fade-in pb-12 relative max-w-7xl mx-auto">
      
      {/* ── 1. CLEAN APPLE/NOTION-STYLE SEGMENTED VIEW SWITCHER ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-[#0a0e17]/90 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="inline-flex p-1 bg-white/5 rounded-xl border border-white/5 gap-1">
          <button
            onClick={() => { setActiveHubView('resources'); setActiveSubject(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeHubView === 'resources'
                ? 'bg-teal-500 text-black shadow-md font-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Resource Academy & Notes</span>
          </button>
          
          <button
            onClick={() => { setActiveHubView('videos'); setActiveSubject(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeHubView === 'videos'
                ? 'bg-rose-500 text-white shadow-md font-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Academic Video Lectures</span>
          </button>
        </div>

        {/* User Academic Badge & Founder Switch */}
        <div className="flex items-center gap-3 px-3 justify-between sm:justify-end">
          <span className="text-[11px] font-bold text-gray-400 hidden md:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>{selectedBranch} • {selectedSem}</span>
          </span>

          {user?.role === 'founder' && (
            <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
              <Shield className={`w-3.5 h-3.5 ${isFounderMode ? 'text-teal-400' : 'text-gray-500'}`} />
              <button 
                onClick={() => setIsFounderMode(!isFounderMode)}
                className="text-[10px] font-bold text-gray-300 hover:text-white"
              >
                {isFounderMode ? 'Founder Active ✓' : 'Founder Mode'}
              </button>
            </div>
          )}
        </div>
      </div>

      {activeHubView === 'videos' ? (
        <VideoPortal user={user} setActiveTab={setActiveTab} />
      ) : (
        <div className="space-y-5 animate-fade-in">
          
          {/* ── 2. UNIFIED COMPACT FILTER BAR (ELIMINATES GIANT 3-BOX CLUTTER) ── */}
          <div className="bg-[#0e1422]/95 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              
              {/* Left Selectors: Scheme, Branch, Semester in a single streamlined row */}
              <div className="flex flex-wrap items-center gap-2.5">
                
                {/* Scheme Select */}
                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
                  <Layers className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="text-[11px] text-gray-400 font-medium">Scheme:</span>
                  <select
                    value={selectedScheme}
                    onChange={(e) => {
                      const sch = e.target.value;
                      setSelectedScheme(sch);
                      if (sch === 'Scheme-2026' && (selectedSem !== 'Sem 1' && selectedSem !== 'Sem 2')) {
                        setSelectedSem('Sem 1');
                      }
                    }}
                    className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
                  >
                    {schemes.map(sch => (
                      <option key={sch.id} value={sch.id} className="bg-[#111827] text-white">
                        {sch.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Branch Select */}
                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
                  <span className="text-[11px] text-gray-400 font-medium">Branch:</span>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="bg-transparent text-xs font-bold text-teal-300 focus:outline-none cursor-pointer pr-1"
                  >
                    {branches.map(b => (
                      <option key={b} value={b} className="bg-[#111827] text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester Select */}
                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
                  <span className="text-[11px] text-gray-400 font-medium">Sem:</span>
                  <select
                    value={selectedSem}
                    onChange={(e) => setSelectedSem(e.target.value)}
                    className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
                  >
                    {semesters.map(s => (
                      <option key={s} value={s} className="bg-[#111827] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Theory vs Lab Category Filter Pills */}
                <div className="flex items-center p-1 bg-white/5 rounded-xl border border-white/5 text-[11px] font-bold">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${categoryFilter === 'all' ? 'bg-white/20 text-white font-black' : 'text-gray-400 hover:text-white'}`}
                  >
                    All ({filteredSubjects.length})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('theory')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${categoryFilter === 'theory' ? 'bg-teal-500/30 text-teal-300 font-black' : 'text-gray-400 hover:text-white'}`}
                  >
                    Theory ({theoryCount})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('labs')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${categoryFilter === 'labs' ? 'bg-purple-500/30 text-purple-300 font-black' : 'text-gray-400 hover:text-white'}`}
                  >
                    Labs ({labCount})
                  </button>
                </div>
              </div>

              {/* Subject Search Bar */}
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Quick search subjects or codes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── 3. STREAMLINED SUBJECTS SECTION ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>Curriculum for {selectedBranch} • {selectedSem}</span>
                <span className="text-xs font-normal text-gray-500">({filteredSubjects.length} courses)</span>
              </div>
              
              {isFounderMode && (
                <button 
                  onClick={handleOpenAddModal}
                  className="text-xs bg-teal-500 hover:bg-teal-400 text-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all font-black shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Subject
                </button>
              )}
            </div>

            {filteredSubjects.length === 0 ? (
              <div className="bg-[#0e1422]/60 p-12 rounded-2xl flex flex-col items-center justify-center text-center border border-dashed border-white/10">
                <Map className="w-10 h-10 text-gray-600 mb-3" />
                <h3 className="text-sm font-bold text-gray-300">No subjects found</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mb-4">
                  No courses match your selected filter. Try switching between Theory or Labs.
                </p>
                {isFounderMode && (
                  <button 
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 bg-teal-500 text-black font-bold rounded-xl text-xs transition-all flex items-center gap-2 hover:scale-105"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add the First Subject
                  </button>
                )}
              </div>
            ) : (
              /* ── 4. STREAMLINED, MODERN CARDS (NO CLUTTER) ── */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubjects.map(subject => {
                  const isLab = (subject.name || '').toLowerCase().includes('lab') || (subject.name || '').toLowerCase().includes('workshop') || (subject.name || '').toLowerCase().includes('practice');
                  
                  return (
                    <div 
                      key={subject.id}
                      onClick={() => handleSelectSubject(subject)}
                      className="bg-[#0f1422] hover:bg-[#141b2e] border border-white/10 hover:border-teal-500/40 p-5 rounded-2xl transition-all duration-200 cursor-pointer group flex flex-col justify-between h-[180px] relative shadow-md hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-0.5"
                    >
                      {/* Admin Controls (Founder Mode) */}
                      {isFounderMode && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                          <button 
                            onClick={(e) => handleOpenEditModal(e, subject)}
                            className="w-6 h-6 rounded-lg bg-blue-500 text-black flex items-center justify-center hover:scale-110 shadow transition-transform"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteSubject(e, subject.id)}
                            className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center hover:scale-110 shadow transition-transform"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Card Top: Code + Regulation + Lab Tag */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-extrabold bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">
                            {subject.code || 'BS101'}
                          </span>
                          <span className="text-[10px] text-gray-500 font-semibold">
                            {subject.scheme || 'Scheme-2026'}
                          </span>
                          {isLab && (
                            <span className="text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded uppercase">
                              Lab Practical
                            </span>
                          )}
                        </div>

                        {/* Subject Title */}
                        <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2 leading-snug">
                          {subject.name}
                        </h3>
                      </div>

                      {/* Card Bottom: Credits, Chapters indicator & Arrow */}
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-2 text-[11px] font-medium">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          <span>{subject.credits || 3} Credits</span>
                          <span>•</span>
                          <span className="text-gray-400">5 Chapters</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-teal-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
                          <span>Open</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subject Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-teal" /> 
                {isEditing ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSaveSubject} className="p-5 space-y-4">
              {!isEditing && (
                <div className="bg-brand-blue/10 border border-white/10 rounded-lg p-3 mb-4">
                  <p className="text-xs text-brand-blue/80 font-semibold">
                    Adding subject to: <strong className="text-brand-blue">{selectedBranch} - {selectedSem}</strong>
                  </p>
                </div>
              )}

              <div>
                <label className="text-[10px] text-gray-500 tracking-wide mb-1 block">Subject Name</label>
                <input 
                  type="text" 
                  value={subjectForm.name} 
                  onChange={e => setSubjectForm({...subjectForm, name: e.target.value})} 
                  placeholder="e.g. Thermodynamics"
                  className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-500 tracking-wide mb-1 block">Subject Code</label>
                  <input 
                    type="text" 
                    value={subjectForm.code} 
                    onChange={e => setSubjectForm({...subjectForm, code: e.target.value})} 
                    placeholder="e.g. ME301"
                    className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 tracking-wide mb-1 block">Credits</label>
                  <input 
                    type="number" 
                    value={subjectForm.credits} 
                    onChange={e => setSubjectForm({...subjectForm, credits: parseInt(e.target.value) || 0})} 
                    className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 tracking-wide mb-1 block">Difficulty</label>
                <select 
                  value={subjectForm.difficulty} 
                  onChange={e => setSubjectForm({...subjectForm, difficulty: e.target.value})} 
                  className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 font-semibold rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-teal text-black font-bold rounded-lg text-xs"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
