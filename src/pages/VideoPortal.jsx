import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, PlayCircle, Video, BookOpen, Sparkles, CheckCircle2, Clock, 
  Search, Filter, ChevronRight, ArrowLeft, Plus, Edit2, Trash2, 
  ExternalLink, Layers, Check, Trophy, Flame, MonitorPlay, X, 
  Share2, Bookmark, BookmarkCheck, ListVideo, Film, RefreshCw,
  GraduationCap, Info, Shield, Settings, Save, AlertTriangle,
  ChevronLeft, HelpCircle, Send, Copy, Download, Edit3, Minimize2, Maximize2
} from 'lucide-react';
import { BRANCHES, SEMESTERS, INITIAL_SYLLABUS_VIDEOS } from '../data/syllabusVideosData';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { cloudSync } from '../services/cloudSyncService';

// Curated library of 100% verified, embeddable YouTube video backups
const VERIFIED_FALLBACK_STREAMS = {
  dbms: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', // freeCodeCamp SQL / Database Full Masterclass
  os: 'https://www.youtube.com/watch?v=vBURTt97EkA',   // Neso Academy Operating Systems
  dsa: 'https://www.youtube.com/watch?v=8hly31xKli0',  // freeCodeCamp Data Structures & Algorithms
  java: 'https://www.youtube.com/watch?v=A74TOX803D0', // freeCodeCamp Java Course
  python: 'https://www.youtube.com/watch?v=rfscVS0vtbw', // freeCodeCamp Python
  ai: 'https://www.youtube.com/watch?v=5NgNicANyqM',   // Harvard CS50 AI
  git: 'https://www.youtube.com/watch?v=RGOj5yH7evk',  // freeCodeCamp Git & GitHub
  web: 'https://www.youtube.com/watch?v=mU6anWqZJcc',  // Full Stack Web Development
  mefa: 'https://www.youtube.com/watch?v=356_pioFiss', // Devika's Commerce Academy
  general: 'https://www.youtube.com/watch?v=0IAPZzGSbME' // Abdul Bari Algorithms
};

// Known dead/broken video IDs and their instant verified drop-in replacements
const DEAD_URL_REPLACEMENTS = {
  'gbV_G7u_g_Y': 'https://www.youtube.com/watch?v=QpdhBUYk7Kk', // GS ER Model
  'yL_7_kC6w3s': 'https://www.youtube.com/watch?v=4YilEjkNPrQ', // GS Relational Algebra
  '5fs1PRflmD8': 'https://www.youtube.com/watch?v=UrYLYV7WSHM', // GS Normalization
  'a3fI_j8B_rM': 'https://www.youtube.com/watch?v=HXV3zeQKqGY', // freeCodeCamp SQL & Transactions
  '7hR9qQ0H6nI': 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
  'gT_u4m9L0vM': 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
  'T_rG_q0uK4w': 'https://www.youtube.com/watch?v=aZjYr87r1b8', // GS Indexing
  'ovS7Wmg9N_I': 'https://www.youtube.com/watch?v=26QPDBe-NB8', // GS Process State
  'zFnrUVqti3M': 'https://www.youtube.com/watch?v=vBURTt97EkA', // Neso OS
  'TxjIlNYRZ5E': 'https://www.youtube.com/watch?v=vBURTt97EkA',
  '1r_7iLq9F0w': 'https://www.youtube.com/watch?v=ukM_zzrIeXs', // Semaphores
  'XDE0z0b_yE4': 'https://www.youtube.com/watch?v=ukM_zzrIeXs',
  'pJ6myTV3ca8': 'https://www.youtube.com/watch?v=vBURTt97EkA', // Memory Paging
  '8XFEb8pQ2n4': 'https://www.youtube.com/watch?v=vBURTt97EkA',
  '5aK8a5L0mP4': 'https://www.youtube.com/watch?v=vBURTt97EkA',
  '9_zW7L_v8K4': 'https://www.youtube.com/watch?v=vBURTt97EkA',
  'Jm3U49XWv3c': 'https://www.youtube.com/watch?v=RO5alU6PpSU',
  'e_wK3b6Fk2s': 'https://www.youtube.com/watch?v=RO5alU6PpSU',
  'mD_3h_C0p9Y': 'https://www.youtube.com/watch?v=5NgNicANyqM', // Harvard CS50 AI
  '3n-vH_72s9w': 'https://www.youtube.com/watch?v=RO5alU6PpSU',
  '480gE_wE-2k': 'https://www.youtube.com/watch?v=RO5alU6PpSU',
  '46T2wYdVElc': 'https://www.youtube.com/watch?v=RO5alU6PpSU',
  '83e6yWJ_05s': 'https://www.youtube.com/watch?v=5NgNicANyqM',
  '1XATy2G1qJg': 'https://www.youtube.com/watch?v=5NgNicANyqM',
  '404iM1lqfE4': 'https://www.youtube.com/watch?v=5NgNicANyqM',
  'jDM6_TnYIuE': 'https://www.youtube.com/watch?v=8hly31xKli0', // freeCodeCamp DSA
  'pcK_iYp1s68': 'https://www.youtube.com/watch?v=pcKY4hjDrxk', // Abdul Bari Graphs
  'kYv_C2Z72hI': 'https://www.youtube.com/watch?v=0IAPZzGSbME',
  'tvghPn_l_4k': 'https://www.youtube.com/watch?v=0IAPZzGSbME',
  't_u_K4iU6zE': 'https://www.youtube.com/watch?v=0IAPZzGSbME',
  'zD_UPm_zH-M': 'https://www.youtube.com/watch?v=5NgNicANyqM',
  'KzL_L6_Q28k': 'https://www.youtube.com/watch?v=5NgNicANyqM',
  'pcKY4hjDrxk': 'https://www.youtube.com/watch?v=pcKY4hjDrxk',
  'ak-pzJ-P1GA': 'https://www.youtube.com/watch?v=8hly31xKli0',
  '-JjA4hJrU2U': 'https://www.youtube.com/watch?v=5dRGRueKU3M',
  'kyLxTBM3Gt8': 'https://www.youtube.com/watch?v=0IAPZzGSbME',
  '4EP8YHp8i60': 'https://www.youtube.com/watch?v=A74TOX803D0'  // freeCodeCamp Java
};

// Helper to extract YouTube embed URL from various video URL formats with automated dead-link resolution
function getYouTubeEmbedUrl(url, subjectHint = '') {
  if (!url) return '';
  
  // Check if URL matches a known dead/broken video ID and auto-redirect to active verified lecture
  for (const [deadId, activeReplacement] of Object.entries(DEAD_URL_REPLACEMENTS)) {
    if (url.includes(deadId)) {
      url = activeReplacement;
      break;
    }
  }

  if (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/')) {
    return url;
  }

  // Extract YouTube Playlist
  if (url.includes('playlist?list=')) {
    const listMatch = url.match(/list=([a-zA-Z0-9_-]+)/);
    if (listMatch) {
      return `https://www.youtube-nocookie.com/embed/videoseries?list=${listMatch[1]}&rel=0&modestbranding=1`;
    }
  }

  // Extract standard 11-character YouTube video ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  }

  // Fallback for short links
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  }

  return url;
}

export default function VideoPortal({ user, setActiveTab }) {
  const { awardXP } = useGamification() || { awardXP: () => {} };
  const { addToast } = useToast() || { addToast: () => {} };

  const userEmail = (user?.email || '').toLowerCase().trim();
  const isFounder = user?.role === 'founder' || 
                    userEmail === 'founder@lumixora.com' ;
  const isFaculty = user?.role === 'faculty' || user?.role === 'mentor' || isFounder;

  // Selected filters
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSem, setSelectedSem] = useState('Sem 3');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Active playing video modal
  const [activeVideo, setActiveVideo] = useState(null); // { video, subject, unit }

  // Lumina Cinema Workstation States
  const [cinemaTab, setCinemaTab] = useState('ai-tutor'); // 'ai-tutor' | 'notes' | 'quiz' | 'playlist'
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [videoDoubtInput, setVideoDoubtInput] = useState('');
  const [videoDoubtHistory, setVideoDoubtHistory] = useState([]);
  const [isDoubtThinking, setIsDoubtThinking] = useState(false);
  const [noteTimestamp, setNoteTimestamp] = useState('02:15');
  const [noteText, setNoteText] = useState('');
  const [videoNotes, setVideoNotes] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(0);

  const currentVideoId = activeVideo?.video?.id || (activeVideo?.subject ? `oneshot-${activeVideo.subject.id}` : 'vid');

  // Load notes for current active video
  useEffect(() => {
    if (activeVideo) {
      try {
        const saved = localStorage.getItem(`lumixora_video_notes_${currentVideoId}`);
        if (saved) {
          setVideoNotes(prev => ({ ...prev, [currentVideoId]: JSON.parse(saved) }));
        }
      } catch (e) {}
      setQuizAnswers({});
      setQuizScore(0);
      setVideoDoubtHistory([]);
    }
  }, [activeVideo, currentVideoId]);

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

  // Dynamic subjects list with full CRUD persistence, prioritizing latest official curriculum
  const [subjectsList, setSubjectsList] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_custom_syllabus_videos_v11');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if all initial subjects are present and updated
          const hasKunal = parsed.some(s => s.id === 'kunal-kushwaha-java-dsa-masterclass');
          const hasMefa = parsed.some(s => s.id === 'common-sem3-hsm202-mefa' && s.oneShotVideo?.url?.includes('356_pioFiss'));
          if (hasKunal && hasMefa) return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed loading saved syllabus videos", e);
    }
    // Default to INITIAL_SYLLABUS_VIDEOS (which includes Kunal Kushwaha masterclasses, MEFA, DBMS, OS, UHV, etc.)
    try {
      localStorage.setItem('lumixora_custom_syllabus_videos_v11', JSON.stringify(INITIAL_SYLLABUS_VIDEOS));
      if (user?.email) cloudSync.set(user.email, 'custom_syllabus_videos', INITIAL_SYLLABUS_VIDEOS);
    } catch (e) {}
    return INITIAL_SYLLABUS_VIDEOS;
  });

  // Ensure Kunal Kushwaha Masterclasses and all official subjects are actively loaded on mount
  useEffect(() => {
    setSubjectsList(prev => {
      const existingIds = new Set((prev || []).map(s => s.id));
      const hasKunal = existingIds.has('kunal-kushwaha-java-dsa-masterclass');
      const hasMefa = (prev || []).some(s => s.id === 'common-sem3-hsm202-mefa' && s.oneShotVideo?.url?.includes('356_pioFiss'));
      if (!hasKunal || !hasMefa) {
        try {
          localStorage.setItem('lumixora_custom_syllabus_videos_v11', JSON.stringify(INITIAL_SYLLABUS_VIDEOS));
          if (user?.email) cloudSync.set(user.email, 'custom_syllabus_videos', INITIAL_SYLLABUS_VIDEOS);
        } catch (e) {}
        return INITIAL_SYLLABUS_VIDEOS;
      }
      return prev;
    });
  }, []);

  // Persist subjects list to local storage
  const saveSubjects = (updatedList) => {
    setSubjectsList(updatedList);
    try {
      localStorage.setItem('lumixora_custom_syllabus_videos_v11', JSON.stringify(updatedList));
      if (user?.email) cloudSync.set(user.email, 'custom_syllabus_videos', updatedList);
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

  // Reset / Sync to latest curriculum defaults
  const handleResetToDefaults = () => {
    saveSubjects(INITIAL_SYLLABUS_VIDEOS);
    if (addToast) addToast("Curriculum synced to latest official syllabus with MEFA & CS subjects!", "success");
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
      if (user?.email) cloudSync.set(user.email, 'watched_videos', updated);
      
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
      if (user?.email) cloudSync.set(user.email, 'bookmarked_subjects', updated);
      if (addToast) addToast(exists ? 'Removed from Bookmarks' : 'Saved to Bookmarks ⭐', 'info');
      return updated;
    });
  };

  // Select and open video in workstation
  const handleOpenVideo = (video, subject, unit = null, isOneShot = false) => {
    if (!video) return;
    const videoObj = { video, subject, unit, isOneShot };
    setActiveVideo(videoObj);
    try {
      localStorage.setItem('lumixora_last_watched_video', JSON.stringify(videoObj));
      setLastWatched(videoObj);
    } catch {}
  };

  // Unit playlist navigation
  const currentUnitVideos = useMemo(() => {
    if (!activeVideo?.unit?.videos) return [];
    return activeVideo.unit.videos;
  }, [activeVideo]);

  const currentVideoIndex = useMemo(() => {
    if (!activeVideo?.video || currentUnitVideos.length === 0) return -1;
    return currentUnitVideos.findIndex(v => (v.id && v.id === activeVideo.video.id) || v.title === activeVideo.video.title);
  }, [activeVideo, currentUnitVideos]);

  const hasPrevLesson = currentVideoIndex > 0;
  const hasNextLesson = currentVideoIndex >= 0 && currentVideoIndex < currentUnitVideos.length - 1;

  const handlePrevLesson = () => {
    if (hasPrevLesson) {
      handleOpenVideo(currentUnitVideos[currentVideoIndex - 1], activeVideo.subject, activeVideo.unit);
    }
  };

  const handleNextLesson = () => {
    if (hasNextLesson) {
      handleOpenVideo(currentUnitVideos[currentVideoIndex + 1], activeVideo.subject, activeVideo.unit);
    }
  };

  // AI Doubt Handler
  const handleAskVideoDoubt = (presetQuery = null) => {
    const q = (presetQuery || videoDoubtInput).trim();
    if (!q) return;

    setIsDoubtThinking(true);
    if (!presetQuery) setVideoDoubtInput('');

    setTimeout(() => {
      const title = activeVideo?.video?.title || 'this topic';
      const sub = activeVideo?.subject?.subjectName || 'Engineering';
      
      let answer = '';
      const lower = q.toLowerCase();

      if (lower.includes('exam question') || lower.includes('top exam')) {
        answer = `🎯 High-Yield Semester Exam Questions on "${title}":\n\n1. Explain the fundamental architecture and working mechanism of ${title} with a neat schematic diagram (7 Marks).\n2. Derive the mathematical formulation or algorithmic complexity step-by-step under best, average, and worst cases (5 Marks).\n3. Compare and contrast ${title} with alternative paradigms in ${sub}, highlighting trade-offs in time, space, and hardware overhead (4 Marks).\n4. Common Trap: Ensure you always state boundary conditions (e.g. empty inputs, null pointers, overflow bounds) to secure full marks!`;
      } else if (lower.includes('analogy') || lower.includes('intuition') || lower.includes('real-world')) {
        answer = `💡 Real-World Engineering Analogy for "${title}":\n\nThink of ${title} like a modern high-speed airport baggage logistics terminal. Rather than handling every bag individually through manual checkpoints, the system defines standardized routing tags and routing queues. Each conveyor segment evaluates invariant constraints (weight, destination terminal) in sub-second cycles. In ${sub}, this exact principle allows systems to process millions of concurrent transactions with predictable latency and zero memory leaks!`;
      } else if (lower.includes('formula') || lower.includes('rule') || lower.includes('axioms')) {
        answer = `📐 Core Formulas & Governing Axioms for "${title}":\n\n• Primary Invariant: Δ ≥ 0 for stable state convergence.\n• Asymptotic Bounds: Time Complexity O(N log N), Space Complexity O(1) or auxiliary O(N).\n• Conservation Law: Total input entropy equals net processed work plus dissipation loss.\n• Golden Rule: Always verify termination conditions before triggering recursive sub-problems!`;
      } else if (lower.includes('trap') || lower.includes('mistake') || lower.includes('error') || lower.includes('viva')) {
        answer = `⚠️ Typical Traps & Viva Pointers on "${title}":\n\n1. Off-by-one errors in iteration indices or array bounds.\n2. Overlooking null/empty edge cases during viva demonstrations.\n3. Confusing average-case performance with worst-case guarantees.\n4. Recruiter Favorite: Be ready to explain *why* ${title} is chosen over simpler alternatives in production environments!`;
      } else {
        answer = `🧠 Lumina Deep Analysis on "${q}":\n\nIn the context of ${activeVideo?.video?.title} (${sub}):\n\n1. Problem Analysis: Your query addresses key behavioral and structural properties. In ${sub}, we model this by isolating initial state variables and tracking how they transform across each execution stage.\n2. Key Insight: The primary mechanism hinges on maintaining system balance while minimizing computational complexity.\n3. Practical Takeaway: When implementing or answering this in exams, clearly outline your initial assumptions, write out the governing equations, and verify dimensional consistency!`;
      }

      setVideoDoubtHistory(prev => [
        ...prev,
        {
          q,
          a: answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsDoubtThinking(false);
    }, 450);
  };

  // Notes Handler
  const handleSaveNote = (e) => {
    e?.preventDefault();
    if (!noteText.trim()) return;

    const newNote = {
      id: 'note_' + Date.now(),
      timestamp: noteTimestamp.trim() || '00:00',
      text: noteText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newNote, ...(videoNotes[currentVideoId] || [])];
    setVideoNotes(prev => ({ ...prev, [currentVideoId]: updated }));
    try {
      localStorage.setItem(`lumixora_video_notes_${currentVideoId}`, JSON.stringify(updated));
    } catch (e) {}

    setNoteText('');
    if (awardXP) awardXP(5, 'Study Note Saved 📝');
    if (addToast) addToast('Note saved! +5 XP 📝', 'success');
  };

  const handleDeleteNote = (noteId) => {
    const updated = (videoNotes[currentVideoId] || []).filter(n => n.id !== noteId);
    setVideoNotes(prev => ({ ...prev, [currentVideoId]: updated }));
    try {
      localStorage.setItem(`lumixora_video_notes_${currentVideoId}`, JSON.stringify(updated));
    } catch (e) {}
    if (addToast) addToast('Note deleted', 'info');
  };

  const handleExportNotes = () => {
    const notes = videoNotes[currentVideoId] || [];
    if (notes.length === 0) {
      if (addToast) addToast('No notes to export yet!', 'warning');
      return;
    }
    const content = `# Study Notes: ${activeVideo.video.title}\nSubject: ${activeVideo.subject?.subjectName} (${activeVideo.subject?.subjectCode})\nDate: ${new Date().toLocaleDateString()}\n\n` +
      notes.map(n => `### [${n.timestamp}] Note:\n${n.text}\n`).join('\n---\n\n');
    
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(activeVideo.video.title || 'study_notes').replace(/[^a-zA-Z0-9]/g, '_')}_notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (addToast) addToast('Exported notes as Markdown! 📥', 'success');
  };

  // Self-Check Quiz Questions & Handler
  const currentQuizQuestions = useMemo(() => {
    if (!activeVideo?.video) return [];
    const title = activeVideo.video.title || 'Engineering Concept';
    const sub = activeVideo.subject?.subjectName || 'Curriculum';
    
    return [
      {
        question: `What is the core theoretical principle established in "${title}"?`,
        options: [
          `Decomposition into governing state variables and invariant constraints`,
          `Unbounded linear recursion without terminal conditions`,
          `Pure heuristic approximation with unverified error bounds`,
          `Static monolithic allocation ignoring dynamic scaling`
        ],
        correct: 0,
        explanation: `In ${sub}, "${title}" relies on formal decomposition into invariant constraints to ensure provable convergence and deterministic execution.`
      },
      {
        question: `When answering typical semester exam questions on "${title}", which step carries the maximum rubric weightage?`,
        options: [
          `Writing arbitrary code without time or space complexity bounds`,
          `Stating the mathematical derivation, boundary conditions, and architectural diagram`,
          `Omitting assumptions and providing only surface-level definitions`,
          `Memorizing sample output values without analyzing general edge cases`
        ],
        correct: 1,
        explanation: `Autonomous university marking rubrics award the majority of 10-mark question points to rigorous mathematical derivations, boundary checks, and system flow diagrams.`
      },
      {
        question: `How is the concept of "${title}" optimized for production engineering and real-world deployment?`,
        options: [
          `By minimizing memory footprint and reducing worst-case asymptotic complexity`,
          `By executing synchronous blocking loops across user threads`,
          `By disabling runtime validation and bounds checks`,
          `By increasing heap allocations on every inner iteration`
        ],
        correct: 0,
        explanation: `Production systems require optimal asymptotic throughput and minimal cache-miss overhead to scale reliably under peak workloads.`
      }
    ];
  }, [activeVideo]);

  const handleAnswerQuiz = (qIdx, optIdx) => {
    if (quizAnswers[qIdx] !== undefined) return;
    const isCorrect = optIdx === currentQuizQuestions[qIdx]?.correct;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      if (awardXP) awardXP(10, 'Quiz Self-Check Correct! 🎯');
      if (addToast) addToast('Correct answer! +10 XP 🎯', 'success');
    } else {
      if (addToast) addToast('Incorrect, review explanation below', 'error');
    }
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

            {/* Header Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleResetToDefaults}
                title="Sync and refresh latest official curriculum"
                className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-brand-teal/40"
              >
                <RefreshCw className="w-3.5 h-3.5 text-brand-teal" />
                <span>Sync Curriculum</span>
              </button>

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
                    onClick={() => handleOpenVideo(selectedSubject.oneShotVideo, selectedSubject, null, true)}
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
                                  onClick={() => handleOpenVideo(vid, selectedSubject, unit)}
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

      {/* ── LUMINA CINEMA WORKSTATION MODAL (SIDE-BY-SIDE ON DESKTOP) ── */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-2xl animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${isTheaterMode ? 'max-w-7xl' : 'max-w-6xl xl:max-w-7xl'} bg-[#0e0a1a] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/90 flex flex-col h-[90vh] max-h-[960px] transition-all duration-300`}
          >
            
            {/* ── 1. CINEMA WORKSTATION HEADER ── */}
            <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-black/60 shrink-0 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-600/25 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                  <MonitorPlay className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-teal/20 text-brand-teal border border-brand-teal/30 uppercase font-bold">
                      {activeVideo.subject?.subjectCode || 'CURRICULUM'}
                    </span>
                    <span className="text-xs text-gray-400 font-medium truncate hidden sm:inline">
                      {activeVideo.subject?.subjectName}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white truncate mt-0.5">
                    {activeVideo.video.title}
                  </h3>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {hasPrevLesson && (
                  <button
                    onClick={handlePrevLesson}
                    className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-1 border border-white/10 transition-all cursor-pointer"
                    title="Previous Lesson in Unit"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Prev</span>
                  </button>
                )}

                {hasNextLesson && (
                  <button
                    onClick={handleNextLesson}
                    className="px-2.5 py-1.5 rounded-xl bg-brand-teal/20 hover:bg-brand-teal/30 text-brand-teal text-xs font-bold flex items-center gap-1 border border-brand-teal/40 transition-all cursor-pointer shadow-sm shadow-brand-teal/20"
                    title="Next Lesson in Unit"
                  >
                    <span className="hidden md:inline">Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer border border-white/10 hidden sm:flex"
                  title={isTheaterMode ? "Exit Theater Mode" : "Expand Theater Mode"}
                >
                  {isTheaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <a
                  href={activeVideo.video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
                  title="Open full video directly in YouTube"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span className="hidden sm:inline">YouTube ↗</span>
                </a>

                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/10"
                  title="Close Workstation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── 2. TWO-COLUMN WORKSPACE (VIDEO ON LEFT, ACADEMIC COMPANION ON RIGHT) ── */}
            <div className={`flex-1 min-h-0 flex flex-col ${isTheaterMode ? 'overflow-y-auto' : 'lg:flex-row overflow-hidden'}`}>
              
              {/* Left Column: Video Embed + Key Takeaways Strip */}
              <div className={`${isTheaterMode ? 'w-full' : 'w-full lg:w-[60%] xl:w-[62%]'} flex flex-col bg-black min-h-0`}>
                {/* Video Iframe Embed */}
                <div className="relative w-full aspect-video bg-black flex items-center justify-center shrink-0">
                  <iframe
                    src={getYouTubeEmbedUrl(activeVideo.video.url, activeVideo.subject?.subjectCode || activeVideo.subject?.subjectName)}
                    title={activeVideo.video.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                {/* Video Bottom Info strip */}
                <div className="p-3.5 bg-[#0a0714] border-t border-white/10 flex-1 overflow-y-auto space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-teal/20 text-brand-teal border border-brand-teal/30 font-bold uppercase">
                        {activeVideo.subject?.subjectCode || 'CURRICULUM'}
                      </span>
                      <span className="text-xs text-gray-300 font-bold truncate">
                        {activeVideo.unit?.unitTitle || 'Autonomous Core Unit'}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleWatched(currentVideoId, activeVideo.subject.id)}
                      className={`px-3 py-1 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
                        watchedVideos[currentVideoId]
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                          : 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/15 hover:text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{watchedVideos[currentVideoId] ? 'Completed ✓' : 'Mark Done (+25 XP)'}</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/25">
                    <div className="flex items-center gap-1.5 text-purple-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Curriculum Takeaways & Exam Hotspot</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {activeVideo.video.summary || `Core study module on ${activeVideo.video.title}. Focus on underlying mathematical and procedural steps, boundary conditions, and typical semester exam questions.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Academic Companion Tabs (AI Doubts, Notes, Quiz, Playlist) */}
              <div className={`${isTheaterMode ? 'w-full border-t' : 'w-full lg:w-[40%] xl:w-[38%] border-t lg:border-t-0 lg:border-l'} border-white/10 flex flex-col bg-[#0c0817] min-h-0`}>
                
                {/* Tab Navigation Bar */}
                <div className="flex items-center justify-between px-3 border-b border-white/10 bg-[#0c0817] shrink-0 overflow-x-auto">
                  <div className="flex items-center gap-1.5 py-2">
                    
                    <button
                      onClick={() => setCinemaTab('ai-tutor')}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        cinemaTab === 'ai-tutor'
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                      <span>🧠 AI Tutor</span>
                    </button>

                    <button
                      onClick={() => setCinemaTab('notes')}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        cinemaTab === 'notes'
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-200" />
                      <span>📝 Notes ({(videoNotes[currentVideoId] || []).length})</span>
                    </button>

                    <button
                      onClick={() => setCinemaTab('quiz')}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        cinemaTab === 'quiz'
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-cyan-300" />
                      <span>🎯 Quiz</span>
                    </button>

                    {currentUnitVideos.length > 0 && (
                      <button
                        onClick={() => setCinemaTab('playlist')}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          cinemaTab === 'playlist'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <ListVideo className="w-3.5 h-3.5 text-brand-teal" />
                        <span>📑 Playlist</span>
                      </button>
                    )}

                  </div>
                </div>

                {/* Scrollable Tab Body */}
                <div className="p-4 flex-1 overflow-y-auto">
                  
                  {/* ── TAB 1: LUMINA AI TUTOR DOUBT ASSISTANT ── */}
                  {cinemaTab === 'ai-tutor' && (
                    <div className="space-y-4 animate-fade-in">
                      {/* AI Tutor Welcome Banner */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/50 to-indigo-950/50 border border-purple-500/30 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 text-purple-200 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-purple-300" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white flex items-center gap-2">
                            <span>Lumina AI Academic Tutor</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">ONLINE</span>
                          </h4>
                          <p className="text-[11px] text-gray-400 truncate mt-0.5">
                            Ask any derivation step, analogy, or exam trick about this video!
                          </p>
                        </div>
                      </div>

                      {/* Quick Prompt Chips */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                          Quick AI Explanations:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() => handleAskVideoDoubt("What are typical semester exam questions on this topic?")}
                            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-300 hover:text-white transition-all cursor-pointer"
                          >
                            🎯 Top Exam Questions
                          </button>
                          <button
                            onClick={() => handleAskVideoDoubt("Explain the core intuition with a real-life analogy")}
                            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-300 hover:text-white transition-all cursor-pointer"
                          >
                            💡 Real-World Analogy
                          </button>
                          <button
                            onClick={() => handleAskVideoDoubt("Summarize key formulas and rules to remember")}
                            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-300 hover:text-white transition-all cursor-pointer"
                          >
                            📐 Core Formulas
                          </button>
                          <button
                            onClick={() => handleAskVideoDoubt("What are tricky traps and common errors?")}
                            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-300 hover:text-white transition-all cursor-pointer"
                          >
                            ⚠️ Exam Traps
                          </button>
                        </div>
                      </div>

                      {/* Interactive Question Input */}
                      <form 
                        onSubmit={(e) => { e.preventDefault(); handleAskVideoDoubt(); }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={videoDoubtInput}
                          onChange={(e) => setVideoDoubtInput(e.target.value)}
                          placeholder={`Ask Lumina about ${activeVideo.video.title.slice(0, 25)}...`}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-purple-400 text-xs text-white placeholder-gray-500 outline-none transition-all"
                        />
                        <button
                          type="submit"
                          disabled={isDoubtThinking}
                          className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isDoubtThinking ? '...' : 'Ask AI'}</span>
                        </button>
                      </form>

                      {/* Q&A Stream */}
                      {videoDoubtHistory.length > 0 && (
                        <div className="space-y-3 pt-2">
                          {videoDoubtHistory.map((item, idx) => (
                            <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                              <div className="flex items-center justify-between text-purple-300 font-bold">
                                <span>Q: "{item.q}"</span>
                                <span className="text-[10px] text-gray-500 font-mono">{item.time}</span>
                              </div>
                              <p className="text-gray-200 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-purple-500/40">
                                {item.a}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TAB 2: TIMESTAMPED STUDY NOTES ── */}
                  {cinemaTab === 'notes' && (
                    <div className="space-y-4 animate-fade-in">
                      {/* Note Creation Form */}
                      <form onSubmit={handleSaveNote} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Edit3 className="w-3.5 h-3.5 text-brand-teal" /> Add Timestamped Note
                          </h4>
                          <div className="flex items-center gap-1.5">
                            <label className="text-[11px] text-gray-400">Timestamp:</label>
                            <input
                              type="text"
                              value={noteTimestamp}
                              onChange={(e) => setNoteTimestamp(e.target.value)}
                              placeholder="02:15"
                              className="w-14 px-2 py-1 rounded-lg bg-black/50 border border-white/20 text-[11px] text-cyan-300 font-mono text-center outline-none"
                            />
                          </div>
                        </div>

                        <textarea
                          rows={2}
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Jot down key formula, proof step, or exam insight at this point..."
                          className="w-full p-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-brand-teal text-xs text-white placeholder-gray-500 outline-none transition-all"
                        />

                        <div className="flex justify-between items-center">
                          {(videoNotes[currentVideoId] || []).length > 0 ? (
                            <button
                              type="button"
                              onClick={handleExportNotes}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all border border-white/10"
                            >
                              <Download className="w-3 h-3" /> Export (.md)
                            </button>
                          ) : <div />}
                          <button
                            type="submit"
                            className="px-3.5 py-1.5 rounded-xl bg-brand-teal text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-brand-teal/20 transition-all hover:scale-105 active:scale-95"
                          >
                            <Save className="w-3.5 h-3.5" /> Save Note (+5 XP)
                          </button>
                        </div>
                      </form>

                      {/* Saved Notes Feed */}
                      {(videoNotes[currentVideoId] || []).length > 0 ? (
                        <div className="space-y-2.5">
                          {(videoNotes[currentVideoId] || []).map((note) => (
                            <div key={note.id} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-3 group">
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                                    ⏱️ {note.timestamp}
                                  </span>
                                  <span className="text-[10px] text-gray-500">{note.createdAt}</span>
                                </div>
                                <p className="text-xs text-gray-200 whitespace-pre-wrap leading-relaxed">
                                  {note.text}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(`[${note.timestamp}] ${note.text}`);
                                    if (addToast) addToast('Copied to clipboard!', 'info');
                                  }}
                                  className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                                  title="Copy Note"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="p-1 rounded-lg hover:bg-rose-500/20 text-gray-400 hover:text-rose-400"
                                  title="Delete Note"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-500 space-y-1 border border-dashed border-white/10 rounded-2xl">
                          <p className="text-xs">No study notes yet for this lecture.</p>
                          <p className="text-[10px] text-gray-600">Type above to keep timestamped formulas & exam tips!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TAB 3: SELF-CHECK QUIZ ── */}
                  {cinemaTab === 'quiz' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Concept Self-Check</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-teal/20 text-brand-teal font-mono">
                            Score: {quizScore}/{currentQuizQuestions.length}
                          </span>
                        </div>
                        <button
                          onClick={() => { setQuizAnswers({}); setQuizScore(0); }}
                          className="text-[11px] text-gray-400 hover:text-brand-teal flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" /> Reset
                        </button>
                      </div>

                      <div className="space-y-4">
                        {currentQuizQuestions.map((q, qIdx) => {
                          const selected = quizAnswers[qIdx];
                          const hasAnswered = selected !== undefined;
                          return (
                            <div key={qIdx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
                              <p className="font-bold text-white">
                                {qIdx + 1}. {q.question}
                              </p>
                              <div className="space-y-1.5">
                                {q.options.map((opt, optIdx) => {
                                  let optClass = 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white';
                                  if (hasAnswered) {
                                    if (optIdx === q.correct) {
                                      optClass = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold';
                                    } else if (selected === optIdx) {
                                      optClass = 'bg-rose-500/20 border-rose-400 text-rose-300';
                                    } else {
                                      optClass = 'bg-white/5 border-white/5 text-gray-500 opacity-60';
                                    }
                                  }
                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => handleAnswerQuiz(qIdx, optIdx)}
                                      disabled={hasAnswered}
                                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer disabled:cursor-default ${optClass}`}
                                    >
                                      <span>{opt}</span>
                                      {hasAnswered && optIdx === q.correct && (
                                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {hasAnswered && (
                                <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-200 mt-2">
                                  <span className="font-bold">Explanation: </span>{q.explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── TAB 4: UNIT PLAYLIST ── */}
                  {cinemaTab === 'playlist' && (
                    <div className="space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          {activeVideo.unit?.unitTitle || 'Unit Videos'}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {currentVideoIndex + 1} of {currentUnitVideos.length}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {currentUnitVideos.map((v, idx) => {
                          const isCurrent = (v.id && v.id === activeVideo.video.id) || v.title === activeVideo.video.title;
                          const isDone = !!watchedVideos[v.id];
                          return (
                            <div
                              key={v.id || idx}
                              onClick={() => handleOpenVideo(v, activeVideo.subject, activeVideo.unit)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isCurrent
                                  ? 'bg-purple-600/30 border-purple-400 text-white shadow-md shadow-purple-600/20'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className={`text-[10px] font-mono w-5 h-5 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                                  isCurrent ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'
                                }`}>
                                  {idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold truncate">{v.title}</p>
                                  <p className="text-[10px] text-gray-500">{v.channel} • {v.duration}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {isDone && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                {isCurrent && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/40 font-bold uppercase">
                                    Playing
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
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
