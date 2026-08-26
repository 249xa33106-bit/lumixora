import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, PlayCircle, Video, BookOpen, Sparkles, CheckCircle2, Clock, 
  Search, Filter, ChevronRight, ArrowLeft, Plus, Edit2, Trash2, 
  ExternalLink, Layers, Check, Trophy, Flame, MonitorPlay, X, 
  Share2, Bookmark, BookmarkCheck, ListVideo, Film, RefreshCw,
  GraduationCap, Info, Shield, Settings, Save, AlertTriangle
} from 'lucide-react';
import { BRANCHES, SEMESTERS, INITIAL_SYLLABUS_VIDEOS } from '../data/syllabusVideosData';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';

// Helper to extract YouTube embed URL from various video URL formats
function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  if (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/')) return url;
  
  // Extract YouTube Playlist
  if (url.includes('playlist?list=')) {
    const listMatch = url.match(/list=([a-zA-Z0-9_-]+)/);
    if (listMatch) {
      return `https://www.youtube.com/embed/videoseries?list=${listMatch[1]}&rel=0&modestbranding=1`;
    }
  }

  // Extract standard 11-character YouTube video ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0&modestbranding=1`;
  }

  // Fallback for short links
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
  
  return url;
}

export default function VideoPortal({ user, setActiveTab }) {
  const { awardXP } = useGamification ? useGamification() : { awardXP: () => {} };
  const { addToast } = useToast ? useToast() : { addToast: () => {} };

  const userEmail = (user?.email || '').toLowerCase().trim();
  const isFounder = user?.role === 'founder' || 
                    userEmail === 'founder@lumixora.com' || 
                    userEmail === '249xa33106@gmail.com';
  const isFaculty = user?.role === 'faculty' || user?.role === 'mentor' || isFounder;

  // Selected filters
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSem, setSelectedSem] = useState('Sem 3');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Active playing video modal
  const [activeVideo, setActiveVideo] = useState(null); // { video, subject, unit }

  // Founder Mode Toggle (for editing & managing)
  const [founderEditMode, setFounderEditMode] = useState(false);

  // Watched videos tracking (persisted in localStorage)
  const [watchedVideos, setWatchedVideos] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_watched_videos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Bookmarked subjects
  const [bookmarkedSubjects, setBookmarkedSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_bookmarked_subjects');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dynamic subjects list with full CRUD persistence
  const [subjectsList, setSubjectsList] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_custom_syllabus_videos_v3');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed loading saved syllabus videos", e);
    }
    return INITIAL_SYLLABUS_VIDEOS;
  });

  // Persist subjects list to local storage
  const saveSubjects = (updatedList) => {
    setSubjectsList(updatedList);
    try {
      localStorage.setItem('lumixora_custom_syllabus_videos_v3', JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Failed to persist syllabus videos locally", e);
    }

    // Sync to Firestore if online
    try {
      if (db) {
        // Save subjects document snapshot
        const syncDoc = doc(db, 'AppSettings', 'academic_videos_db');
        setDoc(syncDoc, { data: updatedList, lastUpdated: new Date().toISOString() }, { merge: true }).catch(() => {});
      }
    } catch (e) {}

    // Update active subject reference if viewing it
    if (selectedSubject) {
      const refreshed = updatedList.find(s => s.id === selectedSubject.id);
      setSelectedSubject(refreshed || null);
    }
  };

  // Reset to original defaults
  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all subjects and videos to default 2023 curriculum?")) {
      saveSubjects(INITIAL_SYLLABUS_VIDEOS);
      if (addToast) addToast("Reset to default curriculum successfully!", "info");
    }
  };

  // ── Modals & State for Subject CRUD ──
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    branch: 'CSE',
    semester: 'Sem 3',
    subjectCode: '',
    subjectName: '',
    credits: 3,
    category: 'PC',
    scheme: '2023 Scheme',
    description: '',
    oneShotTitle: '',
    oneShotUrl: '',
    oneShotDuration: '',
    oneShotChannel: '',
    playlistUrl: ''
  });

  // ── Modals & State for Unit CRUD ──
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnitIdx, setEditingUnitIdx] = useState(null);
  const [unitForm, setUnitForm] = useState({
    unitNumber: 1,
    unitTitle: '',
    description: ''
  });

  // ── Modals & State for Video Lecture CRUD ──
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [targetUnitIdx, setTargetUnitIdx] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    channel: '',
    duration: '',
    url: '',
    summary: ''
  });

  // Open Subject Modal for Add
  const handleOpenAddSubject = () => {
    setEditingSubjectId(null);
    setSubjectForm({
      branch: selectedBranch,
      semester: selectedSem,
      subjectCode: '',
      subjectName: '',
      credits: 3,
      category: 'PC',
      scheme: '2023 Scheme',
      description: '',
      oneShotTitle: '',
      oneShotUrl: '',
      oneShotDuration: '',
      oneShotChannel: '',
      playlistUrl: ''
    });
    setIsSubjectModalOpen(true);
  };

  // Open Subject Modal for Edit
  const handleOpenEditSubject = (sub) => {
    setEditingSubjectId(sub.id);
    setSubjectForm({
      branch: sub.branch || 'CSE',
      semester: sub.semester || 'Sem 3',
      subjectCode: sub.subjectCode || '',
      subjectName: sub.subjectName || '',
      credits: sub.credits || 3,
      category: sub.category || 'PC',
      scheme: sub.scheme || '2023 Scheme',
      description: sub.description || '',
      oneShotTitle: sub.oneShotVideo?.title || '',
      oneShotUrl: sub.oneShotVideo?.url || '',
      oneShotDuration: sub.oneShotVideo?.duration || '',
      oneShotChannel: sub.oneShotVideo?.channel || '',
      playlistUrl: sub.playlistUrl || ''
    });
    setIsSubjectModalOpen(true);
  };

  // Save Subject Form (Create or Update)
  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (!subjectForm.subjectName || !subjectForm.subjectCode) {
      if (addToast) addToast('Please enter subject code and name', 'error');
      return;
    }

    if (editingSubjectId) {
      // Update existing subject
      const updated = subjectsList.map(s => {
        if (s.id === editingSubjectId) {
          return {
            ...s,
            branch: subjectForm.branch,
            semester: subjectForm.semester,
            subjectCode: subjectForm.subjectCode,
            subjectName: subjectForm.subjectName,
            credits: Number(subjectForm.credits) || 3,
            category: subjectForm.category,
            scheme: subjectForm.scheme,
            description: subjectForm.description,
            oneShotVideo: subjectForm.oneShotUrl ? {
              title: subjectForm.oneShotTitle || 'One Shot Marathon Revision',
              channel: subjectForm.oneShotChannel || 'Curated Faculty',
              url: subjectForm.oneShotUrl,
              duration: subjectForm.oneShotDuration || '4h 00m',
              views: s.oneShotVideo?.views || '500K'
            } : null,
            playlistUrl: subjectForm.playlistUrl || ''
          };
        }
        return s;
      });
      saveSubjects(updated);
      if (addToast) addToast(`Updated subject: ${subjectForm.subjectName}`, 'success');
    } else {
      // Create new subject
      const newId = `${subjectForm.branch.toLowerCase()}-${subjectForm.semester.toLowerCase()}-${subjectForm.subjectCode.toLowerCase()}-${Date.now()}`;
      const newSub = {
        id: newId,
        branch: subjectForm.branch,
        branchesApplicable: [subjectForm.branch],
        semester: subjectForm.semester,
        subjectCode: subjectForm.subjectCode,
        subjectName: subjectForm.subjectName,
        credits: Number(subjectForm.credits) || 3,
        category: subjectForm.category,
        scheme: subjectForm.scheme,
        description: subjectForm.description || 'Curriculum syllabus video lectures.',
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000',
        oneShotVideo: subjectForm.oneShotUrl ? {
          title: subjectForm.oneShotTitle || 'One Shot Marathon Revision',
          channel: subjectForm.oneShotChannel || 'Curated Faculty',
          url: subjectForm.oneShotUrl,
          duration: subjectForm.oneShotDuration || '4h 00m',
          views: '100K'
        } : null,
        playlistUrl: subjectForm.playlistUrl || '',
        units: [
          {
            unitNumber: 1,
            unitTitle: 'UNIT I: Introduction & Core Concepts',
            description: 'Foundational concepts and syllabus overview.',
            videos: []
          }
        ]
      };
      saveSubjects([newSub, ...subjectsList]);
      if (addToast) addToast(`Added subject: ${newSub.subjectName}`, 'success');
    }
    setIsSubjectModalOpen(false);
  };

  // Delete Subject
  const handleDeleteSubject = (subId, subName) => {
    if (window.confirm(`Are you sure you want to delete "${subName}" from the Video Portal?`)) {
      const updated = subjectsList.filter(s => s.id !== subId);
      saveSubjects(updated);
      if (selectedSubject?.id === subId) {
        setSelectedSubject(null);
      }
      if (addToast) addToast(`Deleted subject: ${subName}`, 'info');
    }
  };

  // ── Unit CRUD ──
  const handleOpenAddUnit = () => {
    setEditingUnitIdx(null);
    const nextNum = (selectedSubject?.units?.length || 0) + 1;
    setUnitForm({
      unitNumber: nextNum,
      unitTitle: `UNIT ${nextNum}: New Unit Title`,
      description: ''
    });
    setIsUnitModalOpen(true);
  };

  const handleOpenEditUnit = (uIdx, unit) => {
    setEditingUnitIdx(uIdx);
    setUnitForm({
      unitNumber: unit.unitNumber || uIdx + 1,
      unitTitle: unit.unitTitle || '',
      description: unit.description || ''
    });
    setIsUnitModalOpen(true);
  };

  const handleSaveUnit = (e) => {
    e.preventDefault();
    if (!selectedSubject) return;

    const currentUnits = [...(selectedSubject.units || [])];
    if (editingUnitIdx !== null) {
      currentUnits[editingUnitIdx] = {
        ...currentUnits[editingUnitIdx],
        unitNumber: Number(unitForm.unitNumber) || editingUnitIdx + 1,
        unitTitle: unitForm.unitTitle,
        description: unitForm.description
      };
    } else {
      currentUnits.push({
        unitNumber: Number(unitForm.unitNumber) || currentUnits.length + 1,
        unitTitle: unitForm.unitTitle,
        description: unitForm.description,
        videos: []
      });
    }

    const updatedSubjects = subjectsList.map(s => {
      if (s.id === selectedSubject.id) {
        return { ...s, units: currentUnits };
      }
      return s;
    });

    saveSubjects(updatedSubjects);
    setIsUnitModalOpen(false);
    if (addToast) addToast("Unit updated successfully!", "success");
  };

  const handleDeleteUnit = (uIdx, unitTitle) => {
    if (!selectedSubject) return;
    if (window.confirm(`Delete "${unitTitle}" and its video lectures?`)) {
      const currentUnits = selectedSubject.units.filter((_, idx) => idx !== uIdx);
      const updatedSubjects = subjectsList.map(s => {
        if (s.id === selectedSubject.id) {
          return { ...s, units: currentUnits };
        }
        return s;
      });
      saveSubjects(updatedSubjects);
      if (addToast) addToast("Unit deleted", "info");
    }
  };

  // ── Video Lecture CRUD ──
  const handleOpenAddVideo = (uIdx) => {
    setTargetUnitIdx(uIdx);
    setEditingVideoId(null);
    setVideoForm({
      title: '',
      channel: 'Gate Smashers',
      duration: '20:00',
      url: '',
      summary: ''
    });
    setIsVideoModalOpen(true);
  };

  const handleOpenEditVideo = (uIdx, vid) => {
    setTargetUnitIdx(uIdx);
    setEditingVideoId(vid.id);
    setVideoForm({
      title: vid.title || '',
      channel: vid.channel || '',
      duration: vid.duration || '',
      url: vid.url || '',
      summary: vid.summary || ''
    });
    setIsVideoModalOpen(true);
  };

  const handleSaveVideo = (e) => {
    e.preventDefault();
    if (!selectedSubject || targetUnitIdx === null) return;
    if (!videoForm.title || !videoForm.url) {
      if (addToast) addToast("Please enter video title and YouTube URL", "error");
      return;
    }

    const currentUnits = [...(selectedSubject.units || [])];
    const targetUnit = currentUnits[targetUnitIdx];
    if (!targetUnit) return;

    let targetVideos = [...(targetUnit.videos || [])];

    if (editingVideoId) {
      targetVideos = targetVideos.map(v => {
        if (v.id === editingVideoId) {
          return {
            ...v,
            title: videoForm.title,
            channel: videoForm.channel,
            duration: videoForm.duration,
            url: videoForm.url,
            summary: videoForm.summary
          };
        }
        return v;
      });
    } else {
      const newVideo = {
        id: `vid-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: videoForm.title,
        channel: videoForm.channel || 'Curated Faculty',
        duration: videoForm.duration || '20:00',
        url: videoForm.url,
        summary: videoForm.summary || ''
      };
      targetVideos.push(newVideo);
    }

    currentUnits[targetUnitIdx] = { ...targetUnit, videos: targetVideos };

    const updatedSubjects = subjectsList.map(s => {
      if (s.id === selectedSubject.id) {
        return { ...s, units: currentUnits };
      }
      return s;
    });

    saveSubjects(updatedSubjects);
    setIsVideoModalOpen(false);
    if (addToast) addToast("Video lecture saved successfully!", "success");
  };

  const handleDeleteVideo = (uIdx, vidId, vidTitle) => {
    if (!selectedSubject) return;
    if (window.confirm(`Delete video "${vidTitle}"?`)) {
      const currentUnits = [...(selectedSubject.units || [])];
      const targetUnit = currentUnits[uIdx];
      if (!targetUnit) return;

      const targetVideos = (targetUnit.videos || []).filter(v => v.id !== vidId);
      currentUnits[uIdx] = { ...targetUnit, videos: targetVideos };

      const updatedSubjects = subjectsList.map(s => {
        if (s.id === selectedSubject.id) {
          return { ...s, units: currentUnits };
        }
        return s;
      });

      saveSubjects(updatedSubjects);
      if (addToast) addToast("Video deleted", "info");
    }
  };

  // Toggle Watched status
  const toggleWatched = (videoId, subjectId) => {
    setWatchedVideos(prev => {
      const updated = { ...prev, [videoId]: !prev[videoId] };
      localStorage.setItem('lumixora_watched_videos', JSON.stringify(updated));
      
      if (!prev[videoId]) {
        if (awardXP) awardXP(25, 'Completed Video Lecture 🎬');
        if (addToast) addToast('Lecture completed! +25 XP', 'success');
      }
      return updated;
    });
  };

  const toggleBookmark = (subjectId) => {
    setBookmarkedSubjects(prev => {
      const exists = prev.includes(subjectId);
      const updated = exists ? prev.filter(id => id !== subjectId) : [...prev, subjectId];
      localStorage.setItem('lumixora_bookmarked_subjects', JSON.stringify(updated));
      if (addToast) addToast(exists ? 'Removed from Bookmarks' : 'Saved to Bookmarks ⭐', 'info');
      return updated;
    });
  };

  // Filtered subjects list
  const filteredSubjects = useMemo(() => {
    return subjectsList.filter(sub => {
      const matchesBranch = selectedBranch === 'All' || 
        sub.branch === selectedBranch || 
        (sub.branchesApplicable && sub.branchesApplicable.includes(selectedBranch));

      const matchesSem = selectedSem === 'All' || 
        sub.semester === selectedSem || 
        (sub.semestersApplicable && sub.semestersApplicable.includes(selectedSem));

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        sub.subjectName.toLowerCase().includes(q) || 
        sub.subjectCode.toLowerCase().includes(q) ||
        sub.description.toLowerCase().includes(q) ||
        sub.units?.some(u => u.unitTitle?.toLowerCase().includes(q) || u.videos?.some(v => v.title?.toLowerCase().includes(q)));
      
      return matchesBranch && matchesSem && matchesQuery;
    });
  }, [subjectsList, selectedBranch, selectedSem, searchQuery]);

  // Calculate statistics
  const getSubjectStats = (subject) => {
    let totalVideos = 0;
    let completedVideos = 0;
    if (subject.oneShotVideo) totalVideos += 1;
    if (subject.oneShotVideo && watchedVideos[`oneshot-${subject.id}`]) completedVideos += 1;

    subject.units?.forEach(unit => {
      unit.videos?.forEach(v => {
        totalVideos += 1;
        if (watchedVideos[v.id]) completedVideos += 1;
      });
    });

    const percent = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
    return { totalVideos, completedVideos, percent };
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-white pb-20">
      
      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0e0e18] via-[#09090f] to-[var(--bg-main)] px-4 sm:px-8 py-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-bold uppercase tracking-wider">
                <Video className="w-3.5 h-3.5" /> Branch & Semester Video Lecture Portal
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sora tracking-tight text-white">
                Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-cyan-400 to-brand-purple">Video Hub</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl font-medium">
                Structured unit-wise video lectures, high-yield marathon one-shots, and verified YouTube playlists mapped directly to your semester curriculum.
              </p>
            </div>

            {/* Founder Controls Header */}
            <div className="flex flex-wrap items-center gap-3">
              {isFaculty && (
                <>
                  <button
                    onClick={() => setFounderEditMode(!founderEditMode)}
                    className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      founderEditMode 
                        ? 'bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-400/20' 
                        : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>{founderEditMode ? 'Founder Mode: ON' : 'Founder Mode'}</span>
                  </button>

                  <button
                    onClick={handleOpenAddSubject}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-purple text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Subject
                  </button>

                  {founderEditMode && (
                    <button
                      onClick={handleResetToDefaults}
                      title="Reset subjects to default"
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-8 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by subject name, subject code (e.g. CS202, CM201, HSM201), unit, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-all backdrop-blur-md shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* ── DETAIL SUBJECT VIEW (If a subject is selected) ── */}
        {selectedSubject ? (
          <div className="space-y-8 animate-fade-in">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedSubject(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Subjects
              </button>

              <div className="flex items-center gap-2">
                {isFaculty && (
                  <>
                    <button
                      onClick={() => handleOpenEditSubject(selectedSubject)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-purple/20 border border-brand-purple/40 text-brand-purple hover:bg-brand-purple/30 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Subject
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(selectedSubject.id, selectedSubject.subjectName)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Subject
                    </button>
                  </>
                )}

                <button
                  onClick={() => toggleBookmark(selectedSubject.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    bookmarkedSubjects.includes(selectedSubject.id)
                      ? 'bg-amber-400/10 border-amber-400/40 text-amber-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {bookmarkedSubjects.includes(selectedSubject.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4" /> Bookmarked
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" /> Bookmark
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Subject Overview Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-br from-[#12121e] to-[#0a0a10]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-black uppercase tracking-wider">
                      {selectedSubject.branch} • {selectedSubject.semester}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold">
                      Code: {selectedSubject.subjectCode}
                    </span>
                    {selectedSubject.category && (
                      <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                        {selectedSubject.category}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-bold">
                      {selectedSubject.credits} Credits
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                    {selectedSubject.subjectName}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                    {selectedSubject.description}
                  </p>
                </div>

                {/* Progress Metric */}
                {(() => {
                  const stats = getSubjectStats(selectedSubject);
                  return (
                    <div className="bg-black/50 border border-white/10 p-5 rounded-2xl min-w-[240px] text-center space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                        <span>Course Completion</span>
                        <span className="text-brand-teal font-extrabold">{stats.percent}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-brand-teal to-brand-purple h-full transition-all duration-500 rounded-full"
                          style={{ width: `${stats.percent}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {stats.completedVideos} of {stats.totalVideos} Lectures Watched
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* One-Shot Marathon Banner & Playlist Link */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10">
                {selectedSubject.oneShotVideo && (
                  <div 
                    onClick={() => setActiveVideo({ video: selectedSubject.oneShotVideo, subject: selectedSubject, isOneShot: true })}
                    className="group cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 to-brand-purple/10 border border-rose-500/30 hover:border-rose-500/60 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Flame className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded-md">
                            One-Shot Marathon
                          </span>
                          <span className="text-xs text-gray-400 font-medium">{selectedSubject.oneShotVideo.duration}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                          {selectedSubject.oneShotVideo.title}
                        </h4>
                        <p className="text-xs text-gray-400">{selectedSubject.oneShotVideo.channel}</p>
                      </div>
                    </div>
                    <PlayCircle className="w-6 h-6 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
                  </div>
                )}

                {selectedSubject.playlistUrl && (
                  <a 
                    href={selectedSubject.playlistUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 hover:border-brand-blue/60 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-blue/20 text-brand-blue flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <ListVideo className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-brand-blue uppercase tracking-wider bg-brand-blue/10 px-2 py-0.5 rounded-md">
                          Verified Playlist
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-brand-blue transition-colors">
                          Full YouTube Curated Playlist
                        </h4>
                        <p className="text-xs text-gray-400">Complete curriculum coverage</p>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-brand-blue shrink-0 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>

            {/* ── UNIT WISE LECTURES LIST ── */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-teal" /> Unit-wise Syllabus Video Lectures
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-semibold">
                    {selectedSubject.units?.length || 0} Units Covered
                  </span>
                  {isFaculty && (
                    <button
                      onClick={handleOpenAddUnit}
                      className="px-3 py-1.5 rounded-xl bg-brand-teal/20 hover:bg-brand-teal/30 text-brand-teal border border-brand-teal/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Unit
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {selectedSubject.units?.map((unit, uIdx) => (
                  <div 
                    key={uIdx}
                    className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0d0d15] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div>
                        <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-brand-teal/20 text-brand-teal font-black text-xs flex items-center justify-center">
                            {unit.unitNumber || uIdx + 1}
                          </span>
                          {unit.unitTitle}
                        </h4>
                        {unit.description && (
                          <p className="text-xs text-gray-400 mt-1 pl-8">
                            {unit.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 pl-8 sm:pl-0">
                        <span className="text-xs text-gray-400 font-medium mr-2">
                          {unit.videos?.length || 0} Lessons
                        </span>

                        {isFaculty && (
                          <>
                            <button
                              onClick={() => handleOpenAddVideo(uIdx)}
                              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-brand-teal hover:text-black text-gray-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                              title="Add Video Lecture"
                            >
                              <Plus className="w-3 h-3" /> Add Video
                            </button>
                            <button
                              onClick={() => handleOpenEditUnit(uIdx, unit)}
                              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                              title="Edit Unit Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUnit(uIdx, unit.unitTitle)}
                              className="p-1 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Delete Unit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Videos Grid in this Unit */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 sm:pl-8">
                      {unit.videos && unit.videos.length > 0 ? (
                        unit.videos.map((vid) => {
                          const isWatched = !!watchedVideos[vid.id];
                          return (
                            <div 
                              key={vid.id}
                              className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                                isWatched 
                                  ? 'bg-brand-teal/5 border-brand-teal/30 hover:border-brand-teal/50' 
                                  : 'bg-white/5 border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <h5 className="text-sm font-bold text-white line-clamp-2">
                                    {vid.title}
                                  </h5>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {isFaculty && (
                                      <>
                                        <button
                                          onClick={() => handleOpenEditVideo(uIdx, vid)}
                                          className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
                                          title="Edit Video"
                                        >
                                          <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteVideo(uIdx, vid.id, vid.title)}
                                          className="p-1 rounded-md text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
                                          title="Delete Video"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </>
                                    )}
                                    <button
                                      onClick={() => toggleWatched(vid.id, selectedSubject.id)}
                                      title={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
                                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                        isWatched 
                                          ? 'bg-brand-teal text-black border-brand-teal shadow-md shadow-brand-teal/30' 
                                          : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                                      }`}
                                    >
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    </button>
                                  </div>
                                </div>

                                {vid.summary && (
                                  <p className="text-xs text-gray-400 line-clamp-2">
                                    {vid.summary}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                                <div className="flex items-center gap-2 text-gray-400">
                                  <span className="font-semibold text-gray-300">{vid.channel}</span>
                                  {vid.duration && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {vid.duration}</span>
                                    </>
                                  )}
                                </div>

                                <button
                                  onClick={() => setActiveVideo({ video: vid, subject: selectedSubject, unit })}
                                  className="px-3 py-1.5 rounded-lg bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                  <Play className="w-3 h-3 fill-current" /> Watch
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-2 py-6 text-center text-xs text-gray-500 border border-dashed border-white/10 rounded-xl">
                          No video lessons in this unit yet. {isFaculty && 'Click "+ Add Video" above to add lectures.'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── MAIN DIRECTORY (BRANCH & SEMESTER FILTERED) ── */
          <div className="space-y-8">
            
            {/* 1. Branch Selector Tabs */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brand-teal" /> 1. Select Engineering Branch
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {BRANCHES.map(b => {
                  const isSelected = selectedBranch === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBranch(b.id)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-br from-brand-teal/20 to-brand-purple/20 border-brand-teal shadow-lg shadow-brand-teal/10' 
                          : 'glass-panel border-white/10 hover:border-white/20 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="text-2xl mb-1">{b.icon}</div>
                      <h4 className="font-extrabold text-sm text-white group-hover:text-brand-teal transition-colors">
                        {b.id}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate">{b.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Semester Selector Pills */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-purple" /> 2. Select Semester
              </label>
              <div className="flex flex-wrap gap-2">
                {SEMESTERS.map(sem => {
                  const isSelected = selectedSem === sem;
                  return (
                    <button
                      key={sem}
                      onClick={() => setSelectedSem(sem)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20 scale-105'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {sem}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Subjects Grid */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-brand-teal" /> 
                    Curriculum Subjects ({selectedBranch} - {selectedSem})
                  </h3>
                  <p className="text-xs text-gray-400">
                    Showing {filteredSubjects.length} verified curriculum courses & labs
                  </p>
                </div>

                {bookmarkedSubjects.length > 0 && (
                  <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                    <BookmarkCheck className="w-3.5 h-3.5" /> {bookmarkedSubjects.length} Saved Subjects
                  </span>
                )}
              </div>

              {filteredSubjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSubjects.map(sub => {
                    const stats = getSubjectStats(sub);
                    const isBookmarked = bookmarkedSubjects.includes(sub.id);

                    return (
                      <div 
                        key={sub.id}
                        className="glass-panel rounded-3xl border border-white/10 relative overflow-hidden group hover:border-brand-teal/50 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between bg-gradient-to-b from-[#11111d] to-[#0a0a10]"
                      >
                        <div className="p-6 space-y-4">
                          {/* Subject Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-1 rounded-md bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-[10px] font-black uppercase">
                                {sub.subjectCode}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[10px] font-bold">
                                {sub.credits} Credits
                              </span>
                              {sub.category && (
                                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-[10px] font-bold">
                                  {sub.category}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {isFaculty && (
                                <>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleOpenEditSubject(sub); }}
                                    className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
                                    title="Edit Subject"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteSubject(sub.id, sub.subjectName); }}
                                    className="p-1 rounded-md text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
                                    title="Delete Subject"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}

                              <button 
                                onClick={() => toggleBookmark(sub.id)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isBookmarked 
                                    ? 'bg-amber-400/10 border-amber-400/40 text-amber-400' 
                                    : 'border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                              >
                                <Bookmark className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Title & Description */}
                          <div>
                            <h4 className="text-lg font-black text-white group-hover:text-brand-teal transition-colors line-clamp-1">
                              {sub.subjectName}
                            </h4>
                            <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                              {sub.description}
                            </p>
                          </div>

                          {/* Progress Meter */}
                          <div className="space-y-1.5 pt-2">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-brand-teal">{stats.percent}%</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-brand-teal to-brand-purple h-full rounded-full transition-all duration-300"
                                style={{ width: `${stats.percent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom CTA */}
                        <div className="p-4 border-t border-white/5 bg-black/30 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-gray-400 font-medium">
                            {sub.units?.length || 0} Units • {stats.totalVideos} Lectures
                          </span>

                          <button
                            onClick={() => setSelectedSubject(sub)}
                            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-brand-teal hover:text-black font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                          >
                            Explore <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-4 max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
                    <Video className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white">No Subjects Found for {selectedBranch} ({selectedSem})</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Click "Add Subject" to create a curriculum course for this semester.
                  </p>
                  {isFaculty && (
                    <button
                      onClick={handleOpenAddSubject}
                      className="px-4 py-2 rounded-xl bg-brand-teal text-black font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Subject Now
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── CINEMA VIDEO PLAYER MODAL ── */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-5xl bg-[#0e0e18] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <MonitorPlay className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase text-brand-teal tracking-wider block">
                    {activeVideo.subject?.subjectName} ({activeVideo.subject?.subjectCode})
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                    {activeVideo.video.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeVideo.video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Open in YouTube ↗</span>
                </a>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video iFrame */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.video.url)}
                title={activeVideo.video.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="font-bold text-white">{activeVideo.video.channel}</span>
                  {activeVideo.video.duration && <span>• {activeVideo.video.duration}</span>}
                </div>
                {activeVideo.video.summary && (
                  <p className="text-xs text-gray-400 max-w-xl">
                    {activeVideo.video.summary}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => toggleWatched(activeVideo.video.id || `oneshot-${activeVideo.subject.id}`, activeVideo.subject.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    watchedVideos[activeVideo.video.id || `oneshot-${activeVideo.subject.id}`]
                      ? 'bg-brand-teal text-black shadow-lg shadow-brand-teal/20'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {watchedVideos[activeVideo.video.id || `oneshot-${activeVideo.subject.id}`] ? 'Watched' : 'Mark Watched (+25 XP)'}
                </button>

                <a 
                  href={activeVideo.video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-white/10"
                  title="Open on YouTube"
                >
                  <span>Launch on YouTube</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FOUNDER SUBJECT ADD/EDIT MODAL ── */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#10101c] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {editingSubjectId ? <Edit2 className="w-5 h-5 text-brand-purple" /> : <Plus className="w-5 h-5 text-brand-teal" />}
                <span>{editingSubjectId ? 'Edit Subject / Curriculum' : 'Add Curriculum Subject'}</span>
              </h3>
              <button 
                onClick={() => setIsSubjectModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Branch</label>
                  <select
                    value={subjectForm.branch}
                    onChange={(e) => setSubjectForm({ ...subjectForm, branch: e.target.value })}
                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                  >
                    {BRANCHES.map(b => (
                      <option key={b.id} value={b.id}>{b.id} ({b.name})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Semester</label>
                  <select
                    value={subjectForm.semester}
                    onChange={(e) => setSubjectForm({ ...subjectForm, semester: e.target.value })}
                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                  >
                    {SEMESTERS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-gray-400 font-bold mb-1">Subject Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Universal Human Values"
                    value={subjectForm.subjectName}
                    onChange={(e) => setSubjectForm({ ...subjectForm, subjectName: e.target.value })}
                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Code *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. HSM 201"
                    value={subjectForm.subjectCode}
                    onChange={(e) => setSubjectForm({ ...subjectForm, subjectCode: e.target.value })}
                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Credits</label>
                  <input 
                    type="number"
                    step="0.5"
                    value={subjectForm.credits}
                    onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })}
                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Category / Scheme</label>
                  <input 
                    type="text"
                    placeholder="e.g. PC / BS&H / 2023 Scheme"
                    value={subjectForm.category}
                    onChange={(e) => setSubjectForm({ ...subjectForm, category: e.target.value })}
                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Subject Description & Syllabus Overview</label>
                <textarea 
                  rows={2}
                  placeholder="Key concepts, syllabus topics covered..."
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                />
              </div>

              <div className="pt-2 border-t border-white/10 space-y-3">
                <h5 className="font-bold text-gray-300">Featured Video Links</h5>
                
                <div>
                  <label className="block text-gray-400 font-bold mb-1">One-Shot Marathon Video URL</label>
                  <input 
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={subjectForm.oneShotUrl}
                    onChange={(e) => setSubjectForm({ ...subjectForm, oneShotUrl: e.target.value })}
                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Marathon Channel Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Gate Smashers / AICTE"
                      value={subjectForm.oneShotChannel}
                      onChange={(e) => setSubjectForm({ ...subjectForm, oneShotChannel: e.target.value })}
                      className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Duration</label>
                    <input 
                      type="text"
                      placeholder="e.g. 5h 30m"
                      value={subjectForm.oneShotDuration}
                      onChange={(e) => setSubjectForm({ ...subjectForm, oneShotDuration: e.target.value })}
                      className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Curated YouTube Playlist URL</label>
                  <input 
                    type="text"
                    placeholder="https://www.youtube.com/playlist?list=..."
                    value={subjectForm.playlistUrl}
                    onChange={(e) => setSubjectForm({ ...subjectForm, playlistUrl: e.target.value })}
                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-teal to-brand-purple text-black font-extrabold uppercase tracking-wider shadow-lg shadow-brand-teal/20"
                >
                  {editingSubjectId ? 'Save Changes' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FOUNDER UNIT ADD/EDIT MODAL ── */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#10101c] border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingUnitIdx !== null ? 'Edit Unit Details' : 'Add New Syllabus Unit'}
              </h3>
              <button 
                onClick={() => setIsUnitModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUnit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Unit Number</label>
                  <input 
                    type="number"
                    required
                    value={unitForm.unitNumber}
                    onChange={(e) => setUnitForm({ ...unitForm, unitNumber: e.target.value })}
                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-400 font-bold mb-1">Unit Title *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. UNIT I: Value Education"
                    value={unitForm.unitTitle}
                    onChange={(e) => setUnitForm({ ...unitForm, unitTitle: e.target.value })}
                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Unit Syllabus Topics Description</label>
                <textarea 
                  rows={3}
                  placeholder="Key sub-topics covered in this unit..."
                  value={unitForm.description}
                  onChange={(e) => setUnitForm({ ...unitForm, description: e.target.value })}
                  className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUnitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-teal text-black font-extrabold"
                >
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FOUNDER VIDEO LECTURE ADD/EDIT MODAL ── */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#10101c] border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingVideoId ? 'Edit Video Lecture' : 'Add Video Lecture to Unit'}
              </h3>
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Lecture Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Self-Exploration and Process of Value Education"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">YouTube Video URL *</label>
                <input 
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoForm.url}
                  onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                  className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Channel Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Gate Smashers / AICTE"
                    value={videoForm.channel}
                    onChange={(e) => setVideoForm({ ...videoForm, channel: e.target.value })}
                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Duration</label>
                  <input 
                    type="text"
                    placeholder="e.g. 24:15"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Topic Summary & Key Notes</label>
                <textarea 
                  rows={2}
                  placeholder="Concise exam takeaway for students..."
                  value={videoForm.summary}
                  onChange={(e) => setVideoForm({ ...videoForm, summary: e.target.value })}
                  className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-brand-teal"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-teal text-black font-extrabold"
                >
                  Save Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
