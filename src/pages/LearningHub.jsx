import React, { useState } from 'react';
import { Search, BookOpen, ChevronRight, GraduationCap, Map, Clock, Shield, Plus, Trash2, Edit2, X } from 'lucide-react';
import SubjectPage from './SubjectPage';
import { useData } from '../context/DataContext';

export default function LearningHub({ user }) {
  const { hubSubjects, addHubSubject, updateHubSubject, deleteHubSubject, hubMaterials, updateHubMaterials, uploadFile } = useData();
  
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSem, setSelectedSem] = useState('Sem 3');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState(null);
  const [isFounderMode, setIsFounderMode] = useState(false);

  // Synchronize subject selection with window location hash for back button support
  React.useEffect(() => {
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

  const filteredSubjects = hubSubjects.filter(sub => 
    sub.branch === selectedBranch && 
    sub.semester === selectedSem &&
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        id: Date.now(),
        label: quickLabel || (quickFile ? quickFile.name.replace(/\.[^/.]+$/, "") : "Notes Link"),
        type: 'FileText',
        color: 'text-brand-blue',
        bg: 'bg-brand-blue/10',
        fileUrl: downloadUrl
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

  // If a subject is selected, render the detailed Subject Page instead
  if (activeSubject) {
    return <SubjectPage subject={activeSubject} onBack={handleBackFromSubject} user={user} />;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative">
      {/* Header Section */}
      <div className="glass-panel p-8 rounded-3xl bg-gradient-to-br from-brand-blue/10 to-transparent border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-brand-blue" />
                Resource Academy
              </h1>
              {/* Founder Mode Toggle */}
              {user?.role === 'founder' && (
                <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 shrink-0">
                  <Shield className={`w-4 h-4 ${isFounderMode ? 'text-brand-teal' : 'text-gray-500'}`} />
                  <span className="text-xs uppercase tracking-wider font-bold hidden sm:block">Founder Mode</span>
                  <button 
                    onClick={() => setIsFounderMode(!isFounderMode)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${isFounderMode ? 'bg-brand-teal' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isFounderMode ? 'translate-x-5' : ''}`}></span>
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-400 max-w-xl">
              Select your branch and semester to access the highest-quality YouTube playlists, study materials, and academic resources tailored to your curriculum.
            </p>
          </div>
          
          <div className="relative w-full md:w-72 shrink-0 self-end">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search subjects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-blue/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">1. Select Branch</label>
          <div className="flex flex-wrap gap-2">
            {branches.map(branch => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                  selectedBranch === branch 
                    ? 'bg-brand-blue text-black shadow-[0_0_15px_rgba(0,180,216,0.3)]' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {branch}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">2. Select Semester</label>
          <div className="flex flex-wrap gap-2">
            {semesters.map(sem => (
              <button
                key={sem}
                onClick={() => setSelectedSem(sem)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                  selectedSem === sem 
                    ? 'bg-brand-orange text-black shadow-[0_0_15px_rgba(255,159,28,0.3)]' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {sem}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-teal" />
              Subjects for {selectedBranch} - {selectedSem}
            </h2>
            <span className="text-xs font-semibold text-gray-500">{filteredSubjects.length} subjects found</span>
          </div>
          
          {isFounderMode && (
            <button 
              onClick={handleOpenAddModal}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-bold"
            >
              <Plus className="w-4 h-4" /> Add Subject
            </button>
          )}
        </div>

        {filteredSubjects.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-white/10 relative">
            <Map className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-300">No subjects found</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mb-6">
              We couldn't find any subjects matching your current filters.
            </p>
            {isFounderMode && (
              <button 
                onClick={handleOpenAddModal}
                className="px-6 py-2.5 bg-brand-teal text-black font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,210,211,0.3)] hover:scale-105"
              >
                <Plus className="w-4 h-4" /> Add the First Subject
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSubjects.map(subject => (
              <div 
                key={subject.id}
                onClick={() => handleSelectSubject(subject)}
                className="glass-panel p-5 rounded-2xl hover:border-brand-blue/30 transition-all duration-300 cursor-pointer group flex flex-col h-full relative"
              >
                {/* Admin Controls (Founder Mode) */}
                {isFounderMode && (
                  <div className="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={(e) => handleOpenEditModal(e, subject)}
                      className="w-7 h-7 rounded-full bg-brand-blue text-black flex items-center justify-center hover:scale-110 shadow-lg transition-transform"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteSubject(e, subject.id)}
                      className="w-7 h-7 rounded-full bg-brand-pink text-white flex items-center justify-center hover:scale-110 shadow-lg transition-transform"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-bold bg-white/10 text-gray-300 px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {subject.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                    subject.difficulty === 'Hard' ? 'bg-brand-pink/20 text-brand-pink' :
                    subject.difficulty === 'Medium' ? 'bg-brand-orange/20 text-brand-orange' :
                    'bg-brand-teal/20 text-brand-teal'
                  }`}>
                    {subject.difficulty}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white group-hover:text-brand-blue transition-colors mb-2 line-clamp-2">
                  {subject.name}
                </h3>
                
                {isFounderMode && (
                  <button
                    onClick={(e) => handleQuickUploadOpen(e, subject)}
                    className="mt-2 mb-4 text-[10px] bg-brand-teal/20 text-brand-teal hover:bg-brand-teal/35 border border-brand-teal/30 px-2.5 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-bold z-10 relative"
                  >
                    <Plus className="w-3.5 h-3.5" /> Upload PDF/Notes
                  </button>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between text-xs font-semibold text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{subject.credits} Credits</span>
                  </div>
                  <div className="flex items-center gap-1 text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-3 mb-4">
                  <p className="text-xs text-brand-blue/80 font-semibold">
                    Adding subject to: <strong className="text-brand-blue">{selectedBranch} - {selectedSem}</strong>
                  </p>
                </div>
              )}

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Subject Name</label>
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
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Subject Code</label>
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
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Credits</label>
                  <input 
                    type="number" 
                    min="1" max="10"
                    value={subjectForm.credits} 
                    onChange={e => setSubjectForm({...subjectForm, credits: parseInt(e.target.value)})} 
                    className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Difficulty</label>
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

              <div className="flex gap-3 pt-4 border-t border-[#222]">
                <button type="submit" className="flex-1 bg-brand-teal text-black font-bold py-2 rounded-lg text-xs hover:bg-brand-teal/90 transition-colors shadow-[0_0_15px_rgba(0,210,211,0.3)]">
                  {isEditing ? 'Save Changes' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Quick Upload Modal */}
      {quickUploadSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="text-brand-teal w-4 h-4" />
                Quick Upload PDF/Notes
              </h3>
              <button onClick={() => setQuickUploadSubject(null)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleQuickUploadSubmit} className="p-5 space-y-4">
              <div className="bg-brand-teal/10 border border-brand-teal/20 rounded-lg p-3">
                <p className="text-xs text-brand-teal/90 font-semibold">
                  Uploading to: <strong className="text-white">{quickUploadSubject.name}</strong>
                </p>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">File Label / Title</label>
                <input
                  type="text"
                  value={quickLabel}
                  onChange={e => setQuickLabel(e.target.value)}
                  placeholder="e.g. Unit 1 Handwritten Notes"
                  className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Choose PDF or Image File</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    setQuickFile(file);
                    if (file && !quickLabel) {
                      setQuickLabel(file.name.replace(/\.[^/.]+$/, ""));
                    }
                  }}
                  className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none"
                />
              </div>
              <div className="relative flex items-center justify-center py-1">
                <span className="bg-[#111] px-2 text-[9px] text-gray-500 font-bold uppercase z-10">OR</span>
                <div className="absolute w-full h-[1px] bg-white/5"></div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Paste Document Link (Google Drive / OneDrive)</label>
                <input
                  type="url"
                  value={quickUrl}
                  onChange={e => setQuickUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or direct PDF link"
                  className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-[#222]">
                <button
                  type="submit"
                  disabled={quickUploading}
                  className="flex-1 bg-brand-teal text-black font-bold py-2 rounded-lg text-xs hover:bg-brand-teal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {quickUploading ? "Uploading..." : "Upload & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
