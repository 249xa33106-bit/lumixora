import React, { useState, useEffect } from 'react';
import { Film, Award, Sparkles, Folder, Calendar, Share2, Shield, Play, ChevronRight, FileText, Trash2, Edit3, Check, BarChart2, Zap } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import codeArenaFiles from '../data/codeArenaFiles.json';
import { useData } from '../context/DataContext';

const parseUserProfile = (fullName) => {
  let name = fullName || '';
  let metadata = { qualification: '', college: '', place: '', year: '3rd Year', avatarUrl: '' };
  if (name.includes('{')) {
    const idx = name.indexOf('{');
    const jsonStr = name.substring(idx).trim();
    name = name.substring(0, idx).trim();
    try {
      metadata = JSON.parse(jsonStr);
    } catch (e) {}
  }
  return { name: name || 'Scholar Student', ...metadata };
};

export default function LifeReplay({ user }) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'roadmap', 'gallery', 'story', 'movie'
  
  const { profile: gamifyProfile } = useGamification();
  const { notes, tasks } = useData();

  const parsedUser = parseUserProfile(user?.name);

  // Privacy & Sharing
  const [privacy, setPrivacy] = useState('Public'); // 'Public', 'Friends Only', 'Private'
  const [shareLink, setShareLink] = useState('');

  // AI Story States
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [editingStory, setEditingStory] = useState(false);
  const [journeyStory, setJourneyStory] = useState(() => {
    const saved = localStorage.getItem('lumixora_life_story');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [storyDraft, setStoryDraft] = useState({
    title: '',
    semesters: '',
    achievements: '',
    challenges: '',
    skills: '',
    summary: ''
  });

  // Movie Script states
  const [movieScript, setMovieScript] = useState(null);
  const [loadingMovie, setLoadingMovie] = useState(false);

  // Roadmap Checkpoint State — user-managed milestones
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [checkpoints, setCheckpoints] = useState(() => {
    const saved = localStorage.getItem('lumixora_roadmap_milestones');
    return saved ? JSON.parse(saved) : [];
  });
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState({
    year: 'Year 1', semester: 'Semester 1', title: '', desc: '', date: '', relatedSubjects: '', achievements: ''
  });

  useEffect(() => {
    localStorage.setItem('lumixora_roadmap_milestones', JSON.stringify(checkpoints));
  }, [checkpoints]);

  const iconMap = { 'Zap': Zap, 'FileText': FileText, 'Award': Award, 'Sparkles': Sparkles, 'Film': Film };

  const handleSaveMilestone = (e) => {
    e.preventDefault();
    if (!milestoneForm.title.trim()) return;
    if (editingMilestoneId !== null) {
      setCheckpoints(prev => prev.map(cp => cp.id === editingMilestoneId ? { ...cp, ...milestoneForm } : cp));
      addToast({ message: 'Milestone updated!', type: 'success' });
    } else {
      const newMilestone = { id: Date.now(), ...milestoneForm, iconName: 'Award' };
      setCheckpoints(prev => [...prev, newMilestone]);
      addToast({ message: 'Milestone added to your journey!', type: 'success' });
    }
    setIsMilestoneModalOpen(false);
    setEditingMilestoneId(null);
    setMilestoneForm({ year: 'Year 1', semester: 'Semester 1', title: '', desc: '', date: '', relatedSubjects: '', achievements: '' });
  };

  const handleEditMilestone = (cp) => {
    setMilestoneForm({ year: cp.year, semester: cp.semester, title: cp.title, desc: cp.desc, date: cp.date, relatedSubjects: cp.relatedSubjects || '', achievements: cp.achievements || '' });
    setEditingMilestoneId(cp.id);
    setIsMilestoneModalOpen(true);
  };

  const handleDeleteMilestone = (id) => {
    setCheckpoints(prev => prev.filter(cp => cp.id !== id));
    addToast({ message: 'Milestone removed.', type: 'info' });
  };

  // Gallery Filters
  const [galleryFilter, setGalleryFilter] = useState('All');

  // User-managed Gallery Items (persisted in localStorage)
  const [galleryItems, setGalleryItems] = useState(() => {
    const saved = localStorage.getItem('lumixora_gallery_items');
    return saved ? JSON.parse(saved) : [];
  });

  // Notification permission handling
  const [notificationPermission, setNotificationPermission] = useState(() => {
    if (typeof Notification !== 'undefined') return Notification.permission;
    return 'denied';
  });

  const requestNotificationPermission = () => {
    if (typeof Notification !== 'undefined' && Notification.requestPermission) {
      Notification.requestPermission().then(permission => setNotificationPermission(permission));
    }
  };

  // Request on mount if not decided yet
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      requestNotificationPermission();
    } else {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Persist gallery items
  useEffect(() => {
    localStorage.setItem('lumixora_gallery_items', JSON.stringify(galleryItems));
  }, [galleryItems]);

  // Derived filtered list based on selected semester filter
  const filteredGallery = galleryItems.filter(item => galleryFilter === 'All' || item.sem === galleryFilter);

  // Modal state for adding/editing gallery items
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '', type: 'Photo', sem: 'Sem 1-2', fileUrl: ''
  });

  // Utility to send a web notification (requires permission)
  const sendAppNotification = (title, body) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  // Analyze image (simple client‑side analysis: dimensions & dominant color)
  const analyzeImage = async (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // sample top‑left pixel as dominant colour approximation
        const data = ctx.getImageData(0, 0, 1, 1).data;
        const dominant = `rgb(${data[0]},${data[1]},${data[2]})`;
        resolve({ width: img.width, height: img.height, dominantColor: dominant });
      };
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  };

  const handleSaveGalleryItem = async (e) => {
    e.preventDefault();
    if (!galleryForm.title.trim() || !galleryForm.fileUrl.trim()) return;
    let meta = {};
    try {
      meta = await analyzeImage(galleryForm.fileUrl);
    } catch (err) {
      console.warn('Image analysis failed:', err);
    }
    if (editingGalleryId !== null) {
      setGalleryItems(prev =>
        prev.map(item => item.id === editingGalleryId ? { ...item, ...galleryForm, metadata: meta } : item)
      );
      addToast({ message: 'Gallery item updated!', type: 'success' });
      sendAppNotification('Gallery Item Updated', `Updated "${galleryForm.title}"`);
    } else {
      const newItem = { id: Date.now(), ...galleryForm, metadata: meta };
      setGalleryItems(prev => [...prev, newItem]);
      addToast({ message: 'Gallery item added!', type: 'success' });
      sendAppNotification('New Gallery Item', `Added "${galleryForm.title}"`);
    }
    setIsGalleryModalOpen(false);
    setEditingGalleryId(null);
    setGalleryForm({ title: '', type: 'Photo', sem: 'Sem 1-2', fileUrl: '' });
  };

  const handleEditGallery = (item) => {
    setGalleryForm({ title: item.title, type: item.type, sem: item.sem, fileUrl: item.fileUrl });
    setEditingGalleryId(item.id);
    setIsGalleryModalOpen(true);
  };

  const handleDeleteGallery = (id) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
    addToast({ message: 'Gallery item removed.', type: 'info' });
  };

  const handleGenerateStory = () => {
    setIsGeneratingStory(true);
    setTimeout(() => {
      const generated = {
        title: 'From First Login to SDE Placement: A Journey of Grit',
        semesters: 'Successfully completed 5 academic semesters maintaining a 9.1 Target CGPA and completing over 300+ Code Arena problems.',
        achievements: 'Secured Microsoft Summer SDE Internship, won 1st Place at BITS AI Hackathon, and awarded "Guru Contributor" note sharing badge.',
        challenges: 'Overcoming Data Structures memory leak concepts in Year 2 and balancing high credits during Semester 3.',
        skills: 'React.js, Node.js, Python, Firebase Cloud Systems, Advanced SQL, Figma Design.',
        summary: 'An outstanding progression showing robust technical skillset, exceptional community contribution rates, and high placement readiness grades.'
      };
      setStoryDraft(generated);
      setJourneyStory(generated);
      localStorage.setItem('lumixora_life_story', JSON.stringify(generated));
      setIsGeneratingStory(false);
      addToast({ message: 'AI Journey generated successfully!', type: 'success' });
    }, 1500);
  };

  const handleSaveEditedStory = () => {
    setJourneyStory(storyDraft);
    localStorage.setItem('lumixora_life_story', JSON.stringify(storyDraft));
    setEditingStory(false);
    addToast({ message: 'Graduation Story Saved!', type: 'success' });
  };

  const handleGenerateMovie = () => {
    setLoadingMovie(true);
    setTimeout(() => {
      setMovieScript({
        title: `${parsedUser.name}'s Legacy: Every Step Counts`,
        scenes: [
          { scene: 'Scene 1: The Gateway', script: `[Visual: Camera pans up from college gate to reveal student walking in with bag.] Narrator: "Every dream starts with a single step. For ${parsedUser.name}, that step began on a bright August morning in Year 1."` },
          { scene: 'Scene 2: Code Arena Arena Spark', script: '[Visual: Code editing screen typing rapidly in terminal sandbox.] Narrator: "Through late-night compilation bugs and early diagnostic loops, the Code Arena became the training ground of a developer."' },
          { scene: 'Scene 3: Community & Notes', script: '[Visual: PDF documents directory counting 48 student downloads.] Narrator: "Knowledge shared is knowledge multiplied. Helping peers revise became part of the daily streak."' },
          { scene: 'Scene 4: The Milestone Victory', script: '[Visual: Hackathon trophy holding and microsoft offer email landing.] Narrator: "And then came the payoff. Hard work compiled, yielding SDE placements and academic readiness."' }
        ]
      });
      setLoadingMovie(false);
      addToast({ message: 'Graduation script generated!', type: 'success' });
    }, 2000);
  };

  const generateShareLink = () => {
    const url = `https://luminora-27653.web.app/share/life-replay-${user?.id || 'guest'}`;
    setShareLink(url);
    addToast({ message: 'Public share link generated!', type: 'success' });
  };

  return (
    <div className="space-y-8 animate-fade-in text-white pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue bg-clip-text text-transparent uppercase tracking-tight flex items-center gap-2">
            <Film className="w-8 h-8 text-brand-pink animate-pulse" />
            <span>LUMIXORA Life Replay™</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-medium text-left">
            Chronological memory timeline, AI story generator, graduation script movie, and career readiness projections.
          </p>
        </div>

        {/* Global tab nav */}
        {notificationPermission !== 'granted' && (
          <div className="flex items-center justify-between bg-yellow-600/20 border border-yellow-600 text-yellow-200 p-2 rounded-lg mb-2">
            <span className="text-sm font-medium">Notifications are disabled. Enable to get updates.</span>
            <button onClick={requestNotificationPermission} className="ml-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-1 px-3 rounded">
              Enable
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-1 bg-black/45 p-1 rounded-2xl border border-white/5">
          {[
            { id: 'dashboard', label: 'Summary' },
            { id: 'roadmap', label: 'Roadmap Map' },
            { id: 'gallery', label: 'Memory Gallery' },
            { id: 'story', label: 'AI Story' },
            { id: 'codeArena', label: 'Code Arena' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-[0_0_10px_rgba(247,37,133,0.25)]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Core tab dashboards */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (() => {
            const realXp = gamifyProfile?.xp || 0;
            const realNotes = notes?.length || 0;
            const realTasks = tasks?.filter(t => t.status === 'Done').length || 0;
            const realReadiness = 100;
            
            const resumeStrength = Math.min(100, Math.max(40, 55 + (realTasks * 5) + (realNotes * 5)));
            const dsaProficiency = Math.min(100, Math.max(35, 50 + (realTasks * 8)));
            const portfolioGrade = Math.min(100, Math.max(45, 60 + (realNotes * 10)));
            
            const strengthText = realTasks > 0 ? "Analytical debug cycles, database integrations, modular system layouts." : "Basic programming structure, loops, and algorithm syntax.";
            const weaknessText = realNotes > 0 ? `Reduced code blockers; uploaded ${realNotes} note packs for peers.` : "Ambiguity on project documentation; try uploading notes.";
            const confidenceText = realTasks > 4 ? "Highly capable in collaborative coding sprints." : "Needs more active sprints in the Code Arena.";
            
            return (
              <div className="space-y-6">
                
                {/* Journey progress card */}
                <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-brand-pink/5 via-brand-purple/5 to-transparent border border-brand-pink/10 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 rounded-full blur-3xl"></div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-brand-pink/15 text-brand-pink border border-brand-pink/20 px-3 py-1 rounded-full flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Graduation Readiness</span>
                    </span>
                    <span className="text-xs font-extrabold text-brand-purple">75% Journey Complete</span>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-extrabold text-white">Your College Replay Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Note uploads</span>
                        <span className="text-base font-black text-gray-200 mt-1 block">{realNotes} Notes</span>
                      </div>
                      <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Solved Code</span>
                        <span className="text-base font-black text-gray-200 mt-1 block">{realTasks} Tasks</span>
                      </div>
                      <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Readiness</span>
                        <span className="text-base font-black text-brand-pink mt-1 block">{realReadiness}% Score</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart breakdown and projections */}
                <div className="grid grid-cols-1 gap-6">

                  {/* AI Reflection summary */}
                  <div className="glass-panel p-6 rounded-3xl text-left space-y-4">
                    <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-pink" />
                      <span>AI Reflection Summary</span>
                    </h3>
                    
                    <div className="space-y-2 text-[11px] leading-relaxed text-gray-400 font-normal">
                      <p>🎯 *Core Strengths Improved:* {strengthText}</p>
                      <p>💡 *Weaknesses Reduced:* {weaknessText}</p>
                      <p>📈 *Confidence Growth:* {confidenceText}</p>
                    </div>
                  </div>

                </div>

              </div>
            );
          })()}

          {/* TAB: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl text-left space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Interactive Journey Roadmap</h3>
                <button
                  onClick={() => { setEditingMilestoneId(null); setMilestoneForm({ year: 'Year 1', semester: 'Semester 1', title: '', desc: '', date: '', relatedSubjects: '', achievements: '' }); setIsMilestoneModalOpen(true); }}
                  className="text-[10px] bg-brand-teal/15 hover:bg-brand-teal text-brand-teal hover:text-black border border-brand-teal/20 px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3 stroke-[3]" /> Add Milestone
                </button>
              </div>
              
              {checkpoints.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center space-y-3">
                  <Award className="w-10 h-10 text-gray-600 mx-auto" />
                  <p className="text-xs text-gray-500 font-semibold">No milestones added yet.</p>
                  <p className="text-[11px] text-gray-600">Click "Add Milestone" to start recording your academic journey — hackathons, certifications, internships, and more.</p>
                </div>
              ) : (
                <div className="space-y-6 pl-2 relative border-l border-white/10 ml-4 pt-2 pb-2">
                  {checkpoints.map(cp => {
                    const IconComp = iconMap[cp.iconName] || Award;
                    return (
                      <div 
                        key={cp.id}
                        className="relative pl-6 group transition-all"
                      >
                        {/* Checkpoint Node indicator */}
                        <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-[#090910] border-2 border-brand-teal flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-black transition-colors shadow-[0_0_10px_rgba(0,245,212,0.2)]">
                          <IconComp className="w-3.5 h-3.5 fill-current" />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase text-brand-teal tracking-widest">{cp.year} • {cp.semester} ({cp.date})</span>
                          <h4 className="text-xs font-extrabold text-white group-hover:text-brand-teal transition-colors">{cp.title}</h4>
                          <p className="text-[11px] text-gray-400 font-normal leading-relaxed">{cp.desc}</p>
                        </div>

                        {/* Detail Drawer overlay */}
                        {(cp.relatedSubjects || cp.achievements) && (
                          <div 
                            className="mt-3 p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2 font-normal text-xs text-gray-300 leading-normal cursor-pointer"
                            onClick={() => setSelectedMilestone(selectedMilestone === cp.id ? null : cp.id)}
                          >
                            <span className="text-[10px] text-gray-500 font-black uppercase block">Milestone Details</span>
                            {cp.relatedSubjects && <div><span className="text-gray-500">Related Subjects:</span> {cp.relatedSubjects}</div>}
                            {cp.achievements && <div><span className="text-gray-500">Achievements:</span> {cp.achievements}</div>}
                          </div>
                        )}

                        {/* Edit / Delete actions */}
                        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditMilestone(cp)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-brand-teal/20 text-gray-500 hover:text-brand-teal transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteMilestone(cp.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* Milestone Add/Edit Modal */}
          {isMilestoneModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-white/10 relative">
                <button 
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <h3 className="text-sm font-bold text-gray-100 mb-4">
                  {editingMilestoneId !== null ? 'Edit Milestone' : 'Add New Milestone'}
                </h3>
                <form onSubmit={handleSaveMilestone} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Year</label>
                      <select 
                        value={milestoneForm.year}
                        onChange={(e) => setMilestoneForm({...milestoneForm, year: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-teal/50"
                      >
                        {['Year 1', 'Year 2', 'Year 3', 'Year 4'].map(y => (
                          <option key={y} value={y} className="bg-slate-900">{y}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Semester</label>
                      <select 
                        value={milestoneForm.semester}
                        onChange={(e) => setMilestoneForm({...milestoneForm, semester: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-teal/50"
                      >
                        {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map(s => (
                          <option key={s} value={s} className="bg-slate-900">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Milestone Title *</label>
                    <input 
                      type="text" 
                      value={milestoneForm.title}
                      onChange={(e) => setMilestoneForm({...milestoneForm, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-teal/50"
                      placeholder="e.g. Hackathon Win, Internship Offer, Certification"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Description</label>
                    <textarea
                      value={milestoneForm.desc}
                      onChange={(e) => setMilestoneForm({...milestoneForm, desc: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-teal/50 resize-none"
                      placeholder="Describe what happened..."
                      rows="2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Date</label>
                      <input 
                        type="text" 
                        value={milestoneForm.date}
                        onChange={(e) => setMilestoneForm({...milestoneForm, date: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-teal/50"
                        placeholder="e.g. Aug 2024"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Related Subjects</label>
                      <input 
                        type="text" 
                        value={milestoneForm.relatedSubjects}
                        onChange={(e) => setMilestoneForm({...milestoneForm, relatedSubjects: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-teal/50"
                        placeholder="e.g. DSA, Python"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Achievements / Key Items</label>
                    <input 
                      type="text" 
                      value={milestoneForm.achievements}
                      onChange={(e) => setMilestoneForm({...milestoneForm, achievements: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-teal/50"
                      placeholder="e.g. Won 1st place, Got offer letter"
                    />
                  </div>

                  <button type="submit" className="w-full bg-brand-teal hover:bg-brand-teal/90 text-black font-bold py-2.5 rounded-xl text-xs transition-colors mt-2 cursor-pointer">
                    {editingMilestoneId !== null ? 'Save Changes' : 'Add to Journey'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {/* Header with Add button */}
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Memory Gallery</h3>
                <button
                  onClick={() => {
                    setEditingGalleryId(null);
                    setGalleryForm({ title: '', type: 'Photo', sem: 'All', fileUrl: '' });
                    setIsGalleryModalOpen(true);
                  }}
                  className="text-[10px] bg-brand-teal/15 hover:bg-brand-teal text-brand-teal hover:text-black border border-brand-teal/20 px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3 stroke-[3]" /> Add Photo
                </button>
              </div>

              {/* Empty state */}
              {galleryItems.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center space-y-3">
                  <Award className="w-10 h-10 text-gray-600 mx-auto" />
                  <p className="text-xs text-gray-500 font-semibold">No gallery items added yet.</p>
                  <p className="text-[11px] text-gray-600">Click "Add Photo" to start populating your memories.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredGallery.map(item => (
                    <div key={item.id} className="glass-panel overflow-hidden rounded-3xl border border-white/5 text-left flex flex-col h-64 bg-black/40 relative group">
                      <div className="flex-1 overflow-hidden relative group">
                        <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute bottom-3 left-4 text-[9px] font-black uppercase bg-brand-blue/20 text-brand-blue border border-brand-blue/30 px-2 py-0.5 rounded leading-none">
                          {item.sem}
                        </span>
                      </div>
                      <div className="p-4 space-y-1">
                        <h4 className="text-xs font-extrabold text-white">{item.title}</h4>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">{item.type}</span>
                        {item.metadata && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[9px] text-gray-400">{item.metadata.width}×{item.metadata.height}</span>
                            <div className="w-4 h-4 rounded-full border border-white/20" style={{backgroundColor: item.metadata.dominantColor}}></div>
                          </div>
                        )}
                      </div>
                      {/* Edit / Delete actions */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditGallery(item)} className="p-1.5 rounded-lg bg-white/5 hover:bg-brand-teal/20 text-gray-500 hover:text-brand-teal transition-colors cursor-pointer">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteGallery(item.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Gallery Add/Edit Modal */}
              {isGalleryModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-white/10 relative">
                    <button
                      onClick={() => setIsGalleryModalOpen(false)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <h3 className="text-sm font-bold text-gray-100 mb-4">
                      {editingGalleryId !== null ? 'Edit Photo' : 'Add New Photo'}
                    </h3>
                    <form onSubmit={handleSaveGalleryItem} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Title</label>
                        <input
                          type="text"
                          value={galleryForm.title}
                          onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-teal/50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Type</label>
                        <select
                          value={galleryForm.type}
                          onChange={e => setGalleryForm({ ...galleryForm, type: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-teal/50"
                        >
                          <option value="Photo">Photo</option>
                          <option value="Certificate">Certificate</option>
                          <option value="Award">Award</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Semester</label>
                        <select
                          value={galleryForm.sem}
                          onChange={e => setGalleryForm({ ...galleryForm, sem: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-teal/50"
                        >
                          {['All', 'Sem 1-2', 'Sem 3-4', 'Sem 5-6', 'Sem 7-8'].map(s => (
                            <option key={s} value={s} className="bg-slate-900">{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Image URL (or upload)</label>
                        <input
                          type="text"
                          value={galleryForm.fileUrl}
                          onChange={e => setGalleryForm({ ...galleryForm, fileUrl: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-teal/50"
                          placeholder="https://..."
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = ev => {
                                setGalleryForm(prev => ({ ...prev, fileUrl: ev.target.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white"
                        />
                      </div>
                      <button type="submit" className="w-full bg-brand-teal hover:bg-brand-teal/90 text-black font-bold py-2.5 rounded-xl text-xs transition-colors mt-2 cursor-pointer">
                        {editingGalleryId !== null ? 'Save Changes' : 'Add to Gallery'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CODE ARENA */}
          {activeTab === 'codeArena' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-200">Code Arena Resources</h2>
              <ul className="space-y-2">
                {codeArenaFiles
                  .filter((file, idx, arr) => {
                    // Remove duplicate copies (e.g., "dij - Copy.pdf" vs "dij.pdf")
                    const base = file.name.replace(/\s-\sCopy/, '').toLowerCase();
                    return arr.findIndex(f => f.name.replace(/\s-\sCopy/, '').toLowerCase() === base) === idx;
                  })
                  .map((file, i) => (
                    <li key={i} className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                      <span className="text-sm text-gray-200">{file.name}</span>
                      <span className="text-xs text-gray-400">{(file.size/1024).toFixed(1)} KB</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* TAB: STORY */}
          {activeTab === 'story' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 text-left space-y-6">
              
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-pink" />
                  <span>AI Graduation Story</span>
                </h3>
                {journeyStory && (
                  <button 
                    onClick={() => {
                      if (editingStory) {
                        handleSaveEditedStory();
                      } else {
                        setEditingStory(true);
                      }
                    }}
                    className="text-[10px] font-black uppercase text-brand-pink hover:underline"
                  >
                    {editingStory ? 'Save Changes' : 'Edit Draft'}
                  </button>
                )}
              </div>

              {!journeyStory ? (
                <div className="space-y-4 py-8 text-center flex flex-col items-center">
                  <p className="text-xs text-gray-400 leading-relaxed font-normal max-w-sm">
                    Compile all timeline milestones, achievements, badging metrics, and placement notes into an inspirational written story of your academic journey.
                  </p>
                  <button
                    onClick={handleGenerateStory}
                    disabled={isGeneratingStory}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-extrabold text-xs tracking-wider uppercase transition-opacity flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingStory ? 'Synthesizing Story...' : 'Generate My Journey Story'}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Title */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold block">Story Title</span>
                    {editingStory ? (
                      <input type="text" value={storyDraft.title} onChange={e => setStoryDraft({...storyDraft, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white" />
                    ) : (
                      <h4 className="text-sm font-extrabold text-white italic">"{journeyStory.title}"</h4>
                    )}
                  </div>

                  {/* Semesters progression */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold block">Progression Log</span>
                    {editingStory ? (
                      <textarea value={storyDraft.semesters} onChange={e => setStoryDraft({...storyDraft, semesters: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white resize-none" rows="2" />
                    ) : (
                      <p className="text-xs text-gray-400 font-normal leading-relaxed">{journeyStory.semesters}</p>
                    )}
                  </div>

                  {/* Achievements */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold block">Top Milestones</span>
                    {editingStory ? (
                      <textarea value={storyDraft.achievements} onChange={e => setStoryDraft({...storyDraft, achievements: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white resize-none" rows="2" />
                    ) : (
                      <p className="text-xs text-gray-400 font-normal leading-relaxed">{journeyStory.achievements}</p>
                    )}
                  </div>

                  {/* Challenges */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold block">Challenges Overcome</span>
                    {editingStory ? (
                      <textarea value={storyDraft.challenges} onChange={e => setStoryDraft({...storyDraft, challenges: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white resize-none" rows="2" />
                    ) : (
                      <p className="text-xs text-gray-400 font-normal leading-relaxed">{journeyStory.challenges}</p>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold block">AI Growth Summary</span>
                    {editingStory ? (
                      <textarea value={storyDraft.summary} onChange={e => setStoryDraft({...storyDraft, summary: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white resize-none" rows="2" />
                    ) : (
                      <p className="text-xs text-gray-400 font-normal leading-relaxed">{journeyStory.summary}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: MOVIE */}
          {activeTab === 'movie' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 text-left space-y-6">
              
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-brand-purple" />
                  <span>Graduation Movie Script</span>
                </h3>
              </div>

              {!movieScript ? (
                <div className="space-y-4 py-8 text-center flex flex-col items-center">
                  <p className="text-xs text-gray-400 leading-relaxed font-normal max-w-sm">
                    Convert your college roadmap timeline into a cinematic, scene-by-scene script detailing entrance, code sprints, challenges, placements, and final graduation.
                  </p>
                  <button
                    onClick={handleGenerateMovie}
                    disabled={loadingMovie}
                    className="px-6 py-2.5 rounded-xl bg-brand-purple text-white font-extrabold text-xs tracking-wider uppercase transition-opacity flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {loadingMovie ? 'Compiling Storyboard...' : 'Generate Movie Script'}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Title: {movieScript.title}</h4>
                    <button 
                      onClick={() => addToast({ message: 'Script exported as PDF!', type: 'success' })}
                      className="text-[9px] font-black uppercase text-brand-teal hover:underline"
                    >
                      Export PDF
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {movieScript.scenes.map((sc, i) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                        <span className="text-[10px] text-brand-teal font-black block uppercase tracking-wide">{sc.scene}</span>
                        <p className="text-xs text-gray-300 font-mono leading-relaxed leading-normal whitespace-pre-wrap">{sc.script}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Sharing & Privacy settings */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Share & Privacy panel */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4 text-left">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-3">
              <Shield className="w-4 h-4 text-brand-purple" />
              <span>Sharing & Privacy</span>
            </h3>

            {/* Privacy Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold uppercase">Visibility Control</label>
              <select
                value={privacy}
                onChange={e => {
                  setPrivacy(e.target.value);
                  addToast({ message: `Privacy updated to ${e.target.value}!`, type: 'info' });
                }}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-300 outline-none focus:border-brand-purple"
              >
                <option value="Public">Public (Anyone can view)</option>
                <option value="Friends Only">Friends Only (Connections only)</option>
                <option value="Private">Private (Just Me)</option>
              </select>
            </div>

            {/* Link generation */}
            <div className="space-y-3 pt-2">
              <button
                onClick={generateShareLink}
                className="w-full py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white font-extrabold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Get Share Link</span>
              </button>

              {shareLink && (
                <div className="p-3 bg-brand-purple/5 border border-brand-purple/10 rounded-2xl text-center space-y-2 animate-fade-in">
                  <span className="text-[9px] text-gray-500 font-bold block">Shareable URL</span>
                  <input 
                    type="text" 
                    readOnly 
                    value={shareLink} 
                    className="w-full bg-transparent text-[10px] text-brand-purple font-semibold text-center select-all outline-none truncate" 
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      addToast({ message: 'Share link copied to clipboard!', type: 'success' });
                    }}
                    className="text-[9px] font-black uppercase text-brand-purple hover:underline block mx-auto mt-1"
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
</div>
    
  );
}
