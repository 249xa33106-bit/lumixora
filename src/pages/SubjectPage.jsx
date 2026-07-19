import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, PlayCircle, Star, Clock, Heart, Share2, FileText, Download, Users, CheckCircle2, Shield, Plus, Edit2, Trash2, X, BookOpen } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useGamification } from '../context/GamificationContext';

export default function SubjectPage({ subject, onBack, user }) {
  const { hubMaterials, updateHubMaterials, uploadFile } = useData();
  const { awardXP, trackActivity, setIsStudying } = useGamification();
  const [activePath, setActivePath] = useState('pass'); // 'pass', 'complete', 'industry'
  const [saved, setSaved] = useState(false);
  const [isFounderMode, setIsFounderMode] = useState(false);

  // Find this subject's materials from the global state
  const materialsData = useMemo(() => {
    return hubMaterials.find(m => m.id === subject.id) || {
      playlists: { pass: { featured: null, alternatives: [] }, complete: { featured: null, alternatives: [] }, industry: { featured: null, alternatives: [] } },
      resources: []
    };
  }, [hubMaterials, subject.id]);

  const playlists = materialsData?.playlists || { pass: { featured: null, alternatives: [] }, complete: { featured: null, alternatives: [] }, industry: { featured: null, alternatives: [] } };
  const resources = materialsData?.resources || [];
  const currentData = playlists[activePath] || { featured: null, alternatives: [] };
  const alternatives = currentData?.alternatives || [];

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'featured', 'alternative', 'resource'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewingUrl, setViewingUrl] = useState('');
  const [viewingType, setViewingType] = useState('pdf'); // 'pdf' or 'image'
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  // Window focus and blur listeners to prevent screenshots
  useEffect(() => {
    const handleBlur = () => setIsWindowFocused(false);
    const handleFocus = () => setIsWindowFocused(true);

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (setIsStudying) {
      setIsStudying(viewerOpen);
    }
    return () => {
      if (setIsStudying) setIsStudying(false);
    };
  }, [viewerOpen, setIsStudying]);

  // Keyboard shortcut blocking (Saves/Prints/DevTools)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        alert("Downloading/Saving is disabled for security reasons.");
      }
      // Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        alert("Printing is disabled for security reasons.");
      }
      // F12 / DevTools
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        alert("Developer Tools are disabled on this page.");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Helper to convert Google Drive share links to embeddable preview URLs
  const convertToEmbedUrl = (url) => {
    if (!url) return url;
    // Convert: https://drive.google.com/file/d/FILE_ID/view?... -> https://drive.google.com/file/d/FILE_ID/preview
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }
    // Convert: https://drive.google.com/open?id=FILE_ID -> preview
    const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (openMatch) {
      return `https://drive.google.com/file/d/${openMatch[1]}/preview`;
    }
    return url;
  };

  // Helper mapping for dynamic icons
  const getIconComponent = (typeStr) => {
    switch (typeStr) {
      case 'FileText': return FileText;
      case 'Download': return Download;
      case 'Star': return Star;
      case 'BookOpen': return BookOpen;
      default: return FileText;
    }
  };

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setSelectedFile(null);
    setUploading(false);
    
    if (item) {
      setFormData({ ...item });
    } else {
      // Defaults for new items
      if (type === 'alternative') {
        setFormData({ title: '', channel: '', duration: '', rating: '5.0', bestFor: '', playlistUrl: '' });
      } else if (type === 'resource') {
        setFormData({ label: '', type: 'FileText', color: 'text-brand-blue', bg: 'bg-brand-blue/10', fileUrl: '' });
      } else if (type === 'featured') {
        setFormData({ title: '', channel: '', duration: '', videos: 0, level: 'Beginner', lang: 'English', playlistUrl: '' });
      }
    }
    setModalOpen(true);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    
    // Create a copy of current materials to mutate and save
    let updatedMaterials = JSON.parse(JSON.stringify(materialsData));
    delete updatedMaterials.id; // remove id from payload

    // Schema Safeguards
    if (!updatedMaterials.playlists) updatedMaterials.playlists = { pass: { featured: null, alternatives: [] }, complete: { featured: null, alternatives: [] }, industry: { featured: null, alternatives: [] } };
    if (!updatedMaterials.playlists[activePath]) updatedMaterials.playlists[activePath] = { featured: null, alternatives: [] };
    if (!updatedMaterials.playlists[activePath].alternatives) updatedMaterials.playlists[activePath].alternatives = [];
    if (!updatedMaterials.resources) updatedMaterials.resources = [];

    let finalFormData = { ...formData };

    if (modalType === 'resource' && selectedFile) {
      setUploading(true);
      try {
        const path = `subject_resources/${subject.id}/${Date.now()}_${selectedFile.name}`;
        const downloadUrl = await uploadFile(path, selectedFile);
        finalFormData.fileUrl = downloadUrl;
      } catch (err) {
        alert("Failed to upload file. Please try again.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    if (modalType === 'featured') {
      updatedMaterials.playlists[activePath].featured = finalFormData;
    } else if (modalType === 'alternative') {
      if (editingItem) {
        updatedMaterials.playlists[activePath].alternatives = updatedMaterials.playlists[activePath].alternatives.map(alt => 
          alt.id === editingItem.id ? { ...alt, ...finalFormData } : alt
        );
      } else {
        updatedMaterials.playlists[activePath].alternatives.push({ ...finalFormData, id: Date.now() });
      }
    } else if (modalType === 'resource') {
      if (editingItem) {
        updatedMaterials.resources = updatedMaterials.resources.map(res => 
          res.id === editingItem.id ? { ...res, ...finalFormData } : res
        );
      } else {
        updatedMaterials.resources.push({ ...finalFormData, id: Date.now() });
      }
    }

    await updateHubMaterials(subject.id, updatedMaterials);
    setModalOpen(false);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    
    let updatedMaterials = JSON.parse(JSON.stringify(materialsData));
    delete updatedMaterials.id;

    if (type === 'alternative') {
      updatedMaterials.playlists[activePath].alternatives = updatedMaterials.playlists[activePath].alternatives.filter(alt => alt.id !== id);
    } else if (type === 'resource') {
      updatedMaterials.resources = updatedMaterials.resources.filter(res => res.id !== id);
    }

    await updateHubMaterials(subject.id, updatedMaterials);
  };

  const handleWatchFeatured = () => {
    if (currentData.featured?.playlistUrl) {
      window.open(currentData.featured.playlistUrl, '_blank');
      // Automatically award XP and track daily video minutes to secure streak!
      awardXP('STUDY_20_MIN');
      trackActivity('video_minutes', 15);
    } else {
      alert("No playlist link has been configured yet by the Founder. Use Founder Mode to edit this playlist and add a URL!");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative">
      {/* Back Button & Founder Mode Toggle */}
      <div className="flex items-center justify-between text-sm font-semibold text-gray-400">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 hover:text-brand-blue transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resource Hub
          </button>
          <span>/</span>
          <span>{subject.branch}</span>
          <span>/</span>
          <span>{subject.semester}</span>
        </div>
        
        {user?.role === 'founder' && (
          <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Shield className={`w-4 h-4 ${isFounderMode ? 'text-brand-teal' : 'text-gray-500'}`} />
            <span className="text-xs uppercase tracking-wider">Founder Mode</span>
            <button 
              onClick={() => setIsFounderMode(!isFounderMode)}
              className={`w-10 h-5 rounded-full relative transition-colors ${isFounderMode ? 'bg-brand-teal' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isFounderMode ? 'translate-x-5' : ''}`}></span>
            </button>
          </div>
        )}
      </div>

      {/* Subject Header */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden bg-gradient-to-tr from-brand-blue/10 via-transparent to-brand-orange/5 border border-white/5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-white/10 text-gray-300 px-2.5 py-1 rounded-full uppercase tracking-wide">
                {subject.code}
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                subject.difficulty === 'Hard' ? 'bg-brand-pink/20 text-brand-pink' :
                subject.difficulty === 'Medium' ? 'bg-brand-orange/20 text-brand-orange' :
                'bg-brand-teal/20 text-brand-teal'
              }`}>
                {subject.difficulty} Difficulty
              </span>
              <span className="text-[10px] font-bold bg-brand-blue/20 text-brand-blue px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                <Clock className="w-3 h-3" /> {subject.credits} Credits
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{subject.name}</h1>
            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
              Master the core concepts of {subject.name}. This curated resource hub provides the highest-rated playlists and academic materials tailored specifically for {subject.branch} students in {subject.semester}.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setSaved(!saved)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                saved ? 'bg-brand-pink/20 border-brand-pink/40 text-brand-pink' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Learning Paths Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
        {[
          { id: 'pass', label: 'Pass the Exam', icon: CheckCircle2, color: 'hover:text-brand-orange' },
          { id: 'complete', label: 'Complete Semester Prep', icon: BookOpen, color: 'hover:text-brand-blue' },
          { id: 'industry', label: 'Industry-Level Understanding', icon: Users, color: 'hover:text-brand-teal' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activePath === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePath(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shrink-0 ${
                isActive 
                  ? 'bg-white/10 text-white border border-white/20 shadow-lg' 
                  : `text-gray-500 bg-transparent hover:bg-white/5 ${tab.color} border border-transparent`
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Primary Featured Resource */}
      <div className="space-y-4 relative group/featured">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recommended Playlist</h2>
          {isFounderMode && (
            <button onClick={() => handleOpenModal('featured', currentData.featured)} className="text-xs bg-brand-teal/20 text-brand-teal px-3 py-1 rounded flex items-center gap-1 hover:bg-brand-teal/30 transition-colors">
              {currentData.featured ? <><Edit2 className="w-3 h-3" /> Edit Featured</> : <><Plus className="w-3 h-3" /> Add Featured</>}
            </button>
          )}
        </div>
        
        {!currentData.featured ? (
           <div className="glass-panel p-8 rounded-3xl border-dashed border-white/10 flex flex-col items-center justify-center text-center">
             <PlayCircle className="w-8 h-8 text-gray-600 mb-2" />
             <p className="text-sm text-gray-500">No featured playlist has been added for this path yet.</p>
           </div>
        ) : (
          <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col lg:flex-row gap-6 group hover:border-brand-blue/30 transition-colors">
            <div className="relative w-full lg:w-[400px] h-[220px] rounded-2xl overflow-hidden shrink-0 bg-black/50">
              <img 
                src={(currentData.featured.thumbnail && !currentData.featured.thumbnail.includes('unsplash')) ? currentData.featured.thumbnail : '/lumixora_logo.jpg'} 
                alt="Thumbnail" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div 
                onClick={handleWatchFeatured}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-brand-pink/90 flex items-center justify-center shadow-[0_0_30px_rgba(247,37,133,0.6)] cursor-pointer hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-white fill-current" />
                </div>
              </div>
              <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md">
                {currentData.featured.duration}
              </span>
            </div>

            <div className="flex-1 flex flex-col py-2">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[9px] font-bold bg-brand-orange/20 text-brand-orange px-2 py-0.5 rounded uppercase">{currentData.featured.level}</span>
                <span className="text-[9px] font-bold bg-white/10 text-gray-300 px-2 py-0.5 rounded uppercase">{currentData.featured.lang}</span>
                <span className="text-[9px] font-bold bg-white/10 text-gray-300 px-2 py-0.5 rounded uppercase">{currentData.featured.videos} Videos</span>
              </div>
              
              <h3 className="text-2xl font-extrabold text-white mb-2 leading-tight group-hover:text-brand-blue transition-colors">{currentData.featured.title}</h3>
              <p className="text-sm text-gray-400 font-semibold mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">YT</span>
                {currentData.featured.channel}
              </p>

              <div className="mt-auto flex items-center gap-3">
                <button 
                  onClick={handleWatchFeatured}
                  className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-black font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,180,216,0.3)]"
                >
                  <PlayCircle className="w-5 h-5" /> Start Watching
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alternative Playlists & Additional Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Alternative Playlists</h2>
            {isFounderMode && (
              <button onClick={() => handleOpenModal('alternative')} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded flex items-center gap-1 transition-colors">
                <Plus className="w-3 h-3" /> Add Alternative
              </button>
            )}
          </div>
          <div className="space-y-3">
            {alternatives.length === 0 && (
              <p className="text-xs text-gray-500 italic p-4 bg-white/5 rounded-xl text-center">No alternative playlists.</p>
            )}
            {alternatives.map(alt => (
              <div 
                key={alt.id} 
                onClick={() => {
                  if (alt.playlistUrl) {
                    window.open(alt.playlistUrl, '_blank');
                  } else {
                    alert("No link has been configured yet by the Founder. Use Founder Mode to edit this playlist and add a URL!");
                  }
                }}
                className="relative group/alt glass-panel p-4 rounded-2xl flex items-center gap-4 hover:border-white/20 transition-all cursor-pointer"
              >
                {isFounderMode && (
                  <div className="absolute -top-2 -right-2 flex items-center gap-1 z-10">
                    <button onClick={(e) => { e.stopPropagation(); handleOpenModal('alternative', alt); }} className="w-6 h-6 rounded-full bg-brand-blue text-black flex items-center justify-center hover:scale-110">
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete('alternative', alt.id); }} className="w-6 h-6 rounded-full bg-brand-pink text-white flex items-center justify-center hover:scale-110">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                <div className="w-32 h-20 bg-black/40 rounded-xl relative overflow-hidden shrink-0 border border-white/5 group-hover/alt:border-brand-blue/50">
                  <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                    <PlayCircle className="w-6 h-6 text-gray-500 group-hover/alt:text-brand-blue transition-colors" />
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md">
                    {alt.duration}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-200 truncate group-hover/alt:text-white mb-1">{alt.title}</h4>
                  <p className="text-[11px] text-gray-500 font-semibold mb-2">{alt.channel}</p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] text-brand-orange font-bold bg-brand-orange/10 px-1.5 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-current" /> {alt.rating}
                    </span>
                    <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">{alt.bestFor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Academic Resources</h2>
            <button 
              onClick={() => handleOpenModal('resource')} 
              className="text-xs bg-brand-teal/20 hover:bg-brand-teal/30 text-brand-teal font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors uppercase tracking-wider shadow-[0_0_10px_rgba(0,245,212,0.2)]"
            >
              <Plus className="w-3 h-3" /> Contribute PDF
            </button>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
             {resources.length === 0 && (
              <p className="text-xs text-gray-500 italic p-4 text-center">No resources added.</p>
            )}
            {resources.map((res) => {
              const Icon = getIconComponent(res.type);
              const handleClick = () => {
                if (res.fileUrl) {
                  const embedUrl = convertToEmbedUrl(res.fileUrl);
                  
                  // Check if URL is an image file
                  const isImage = 
                    /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(embedUrl) || 
                    embedUrl.includes('image/') ||
                    embedUrl.includes('image');

                  const isEmbeddable = 
                    embedUrl.includes('supabase.co/storage') || 
                    embedUrl.toLowerCase().includes('.pdf') ||
                    embedUrl.includes('drive.google.com/file/d/') && embedUrl.includes('/preview');
                  
                  if (isImage) {
                    setViewingUrl(embedUrl);
                    setViewingType('image');
                    setViewerOpen(true);
                  } else if (isEmbeddable) {
                    setViewingUrl(embedUrl);
                    setViewingType('pdf');
                    setViewerOpen(true);
                  } else {
                    window.open(res.fileUrl, '_blank');
                  }
                }
              };
              return (
                <div key={res.id} className="relative group/res">
                  {isFounderMode && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center gap-1 z-10">
                      <button onClick={(e) => { e.stopPropagation(); handleOpenModal('resource', res); }} className="w-6 h-6 rounded-full bg-brand-blue text-black flex items-center justify-center hover:scale-110">
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete('resource', res.id); }} className="w-6 h-6 rounded-full bg-brand-pink text-white flex items-center justify-center hover:scale-110">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={handleClick}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5 pr-16 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${res.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${res.color}`} />
                      </div>
                      <span className="text-xs font-semibold text-gray-300 group-hover:text-white truncate">{res.label}</span>
                    </div>
                    {res.fileUrl && !isFounderMode && (
                      <span className="text-[10px] text-gray-500 font-bold bg-white/5 px-2 py-0.5 rounded uppercase tracking-wide group-hover:text-white border border-white/5 shrink-0 ml-2">PDF</span>
                    )}
                    {!isFounderMode && <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-white rotate-135 transition-colors shrink-0" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-teal" /> 
                {editingItem ? 'Edit' : 'Add'} {modalType === 'featured' ? 'Featured Playlist' : modalType === 'alternative' ? 'Alternative Playlist' : 'Resource'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSaveModal} className="p-5 space-y-4">
              
              {/* Form fields based on type */}
              {(modalType === 'featured' || modalType === 'alternative') && (
                <>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Title</label>
                    <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" required />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Link (URL)</label>
                    <input type="url" value={formData.playlistUrl || ''} onChange={e => setFormData({...formData, playlistUrl: e.target.value})} className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Channel</label>
                      <input type="text" value={formData.channel || ''} onChange={e => setFormData({...formData, channel: e.target.value})} className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" required />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Duration</label>
                      <input type="text" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 5h 30m" className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" required />
                    </div>
                  </div>
                  {modalType === 'featured' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Level</label>
                        <input type="text" value={formData.level || ''} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" required />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Videos Count</label>
                        <input type="number" value={formData.videos || ''} onChange={e => setFormData({...formData, videos: parseInt(e.target.value)})} className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" required />
                      </div>
                    </div>
                  )}
                  {modalType === 'alternative' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Rating</label>
                        <input type="text" value={formData.rating || ''} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" required />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Best For</label>
                        <input type="text" value={formData.bestFor || ''} onChange={e => setFormData({...formData, bestFor: e.target.value})} className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" required />
                      </div>
                    </div>
                  )}
                </>
              )}

              {modalType === 'resource' && (
                <>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Resource Label</label>
                    <input type="text" value={formData.label || ''} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" required />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Upload PDF or Image File</label>
                    <input 
                      type="file" 
                      accept=".pdf,image/*" 
                      onChange={e => {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        if (file && !formData.label) {
                          setFormData({...formData, label: file.name.replace(/\.[^/.]+$/, "")});
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
                      value={formData.fileUrl || ''} 
                      onChange={e => setFormData({...formData, fileUrl: e.target.value})} 
                      placeholder="https://drive.google.com/... or direct PDF link"
                      className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" 
                    />
                    {formData.fileUrl && (
                      <p className="text-[10px] text-brand-teal mt-1">
                        Attached Link: <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer" className="underline">Test Link</a>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Icon Type</label>
                    <select value={formData.type || 'FileText'} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none">
                      <option value="FileText">Document</option>
                      <option value="Download">Download</option>
                      <option value="Star">Important</option>
                      <option value="BookOpen">Book</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Color Theme</label>
                    <select 
                      value={`${formData.color},${formData.bg}`} 
                      onChange={e => {
                        const [color, bg] = e.target.value.split(',');
                        setFormData({...formData, color, bg});
                      }} 
                      className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none"
                    >
                      <option value="text-brand-blue,bg-brand-blue/10">Blue</option>
                      <option value="text-brand-pink,bg-brand-pink/10">Pink</option>
                      <option value="text-brand-orange,bg-brand-orange/10">Orange</option>
                      <option value="text-brand-teal,bg-brand-teal/10">Teal</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4 border-t border-[#222]">
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="flex-1 bg-brand-teal text-black font-bold py-2 rounded-lg text-xs hover:bg-brand-teal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? "Uploading..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Secure PDF Viewer Modal */}
      {viewerOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 select-none animate-fade-in"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="relative w-full h-full max-w-5xl bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-pink animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Secure Document Viewer</span>
              </div>
              <button 
                onClick={() => {
                  setViewerOpen(false);
                  setViewingUrl('');
                }} 
                className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewer body */}
            <div className="flex-1 relative bg-[#020205] overflow-hidden flex items-center justify-center">

              {/* Watermark Overlay (Grid of diagonal text) */}
              <div className="absolute inset-0 z-20 pointer-events-none grid grid-cols-3 grid-rows-5 opacity-[0.22] overflow-hidden select-none">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-center text-xs sm:text-sm font-bold text-slate-400 tracking-widest uppercase rotate-[-25deg] select-none whitespace-nowrap"
                    style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.2)' }}
                  >
                    {user?.email || 'Student'} • Lumixora ID: {user?.id?.substring(0,6) || 'LM1024'}
                  </div>
                ))}
              </div>

              {/* PDF Viewer frame */}
              {/* Document/Image Render */}
              {viewingType === 'image' ? (
                <img 
                  src={viewingUrl} 
                  alt="Academic Resource" 
                  className="max-w-full max-h-[75vh] object-contain z-10 rounded-lg shadow-lg" 
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
              ) : (
                <iframe 
                  src={`${viewingUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full border-none z-10"
                  title="Document Viewer"
                  sandbox="allow-scripts allow-same-origin"
                />
              )}
            </div>
            
            {/* Footer */}
            <div className="p-3 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 font-semibold px-6 gap-2">
              <span>Authorized Access for: <strong className="text-brand-blue">{user?.email || 'Student'}</strong></span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
