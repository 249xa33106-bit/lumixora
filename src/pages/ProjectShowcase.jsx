import React, { useState, useEffect, useMemo } from 'react';
import { 
  Rocket, Search, Filter, Globe, Heart, MessageSquare, 
  Sparkles, Plus, Share2, Tag, CheckCircle2, Bookmark, ExternalLink,
  Code2, Eye, Star, Layers, Cpu, Smartphone, Database, Shield,
  Users, Award, X, Send, ThumbsUp, Lightbulb, ArrowUpRight,
  TrendingUp, Laptop, RefreshCw, AlertCircle, GitBranch, Edit3, Trash2,
  ShieldCheck, Pin, Sparkle, Check
} from 'lucide-react';
import { db } from '../config/firebase';
import { 
  collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, setDoc, increment, 
  serverTimestamp, query, orderBy 
} from 'firebase/firestore';
import { useToast } from '../context/ToastContext';
import { callAICompletion } from '../services/aiService';

// Default starter community projects
const STARTER_PROJECTS = [
  {
    id: 'proj_1',
    title: 'PulseCare AI - Rural Healthcare Triage',
    tagline: 'Edge AI diagnostic assistant that works offline in remote PHCs using LLMs & computer vision.',
    description: 'An offline-capable healthcare triage platform built during Smart India Hackathon. Uses lightweight ONNX models to scan symptoms, classify dermatological issues, and suggest immediate first-aid before a doctor arrives.',
    domain: 'AI & Machine Learning',
    techStack: ['Python', 'TensorFlow', 'FastAPI', 'React', 'TailwindCSS'],
    liveUrl: 'https://pulsecare-ai.web.app',
    githubUrl: 'https://github.com/scholar-innovators/pulsecare-ai',
    author: {
      name: 'Aditya Sharma',
      college: 'GPREC Kurnool',
      dept: 'CSE - 3rd Year',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60'
    },
    upvotes: 42,
    stars: 18,
    commentsCount: 7,
    seekingTeammates: true,
    seekingRole: 'Looking for React Native / Flutter developer to build mobile companion app.',
    createdAt: '2 days ago',
    featured: true
  },
  {
    id: 'proj_2',
    title: 'BlockVote - Tamper-Proof Student Council Election',
    tagline: 'Zero-gas fee voting system leveraging Polygon zkEVM & Aadhaar biometric zk-SNARK proofs.',
    description: 'Built for university elections to ensure 100% election auditability and eliminate paper ballots. Voters verify identity anonymously using zero-knowledge proofs without exposing their identity or roll number.',
    domain: 'Blockchain & Web3',
    techStack: ['Solidity', 'Polygon zkEVM', 'Ethers.js', 'Next.js', 'Tailwind'],
    liveUrl: 'https://blockvote-campus.vercel.app',
    githubUrl: 'https://github.com/web3-campus/blockvote',
    author: {
      name: 'Sneha Reddy',
      college: 'GPREC Kurnool',
      dept: 'ECE - 4th Year',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60'
    },
    upvotes: 38,
    stars: 25,
    commentsCount: 12,
    seekingTeammates: false,
    createdAt: '4 days ago',
    featured: true
  },
  {
    id: 'proj_3',
    title: 'CampusRide - Peer-to-Peer College Commute Sharing',
    tagline: 'Student carpooling and bike-pool network saving fuel costs and daily traffic bottlenecks.',
    description: 'A verified campus ride-sharing web app allowing day-scholars and hostellers to match commutes, split fuel expenses automatically via UPI QR, and stay safe with SOS emergency alerts.',
    domain: 'Web Apps',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Mapbox GL', 'Socket.io'],
    liveUrl: 'https://campusride-gprec.web.app',
    githubUrl: 'https://github.com/day-scholars/campusride',
    author: {
      name: 'K. Sai Varun',
      college: 'GPREC Kurnool',
      dept: 'IT - 3rd Year',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60'
    },
    upvotes: 29,
    stars: 14,
    commentsCount: 5,
    seekingTeammates: true,
    seekingRole: 'Seeking UI/UX Designer to revamp the booking flow.',
    createdAt: '1 week ago',
    featured: false
  },
  {
    id: 'proj_4',
    title: 'CodeScribe - AI DSA Visualizer & Debugger',
    tagline: 'Interactive step-by-step memory pointer and tree visualizer for LeetCode problems.',
    description: 'Turn complex recursive algorithms, dynamic programming tables, and linked list pointers into animated, interactive 3D visualizations with one click.',
    domain: 'Open Source Tools',
    techStack: ['TypeScript', 'Three.js', 'React', 'Monaco Editor', 'Tailwind'],
    liveUrl: 'https://codescribe-dsa.vercel.app',
    githubUrl: 'https://github.com/algorithm-visuals/codescribe',
    author: {
      name: 'Rohan Verma',
      college: 'GPREC Kurnool',
      dept: 'CSE - 2nd Year',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60'
    },
    upvotes: 56,
    stars: 31,
    commentsCount: 9,
    seekingTeammates: false,
    createdAt: '5 days ago',
    featured: true
  },
  {
    id: 'proj_5',
    title: 'SmartHydro - IoT Automated Crop Water Optimizer',
    tagline: 'ESP32 solar-powered soil moisture node with LoRaWAN telemetry and rainfall prediction.',
    description: 'Hardware IoT prototype engineered for precision agriculture. Analyzes NPK soil sensors and live meteorological APIs to trigger automated micro-drip irrigation.',
    domain: 'IoT & Robotics',
    techStack: ['C++', 'ESP32', 'LoRaWAN', 'Python', 'Flask', 'MQTT', 'Chart.js'],
    liveUrl: '',
    githubUrl: 'https://github.com/iot-innovators/smart-hydro',
    author: {
      name: 'M. Bhavana',
      college: 'GPREC Kurnool',
      dept: 'EEE - 4th Year',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60'
    },
    upvotes: 34,
    stars: 21,
    commentsCount: 4,
    seekingTeammates: true,
    seekingRole: 'Looking for a Cloud Engineer to connect AWS IoT Core pipeline.',
    createdAt: '1 week ago',
    featured: false
  }
];

const DOMAINS = [
  'All Domains',
  'Web Apps',
  'AI & Machine Learning',
  'Mobile Apps',
  'Blockchain & Web3',
  'IoT & Robotics',
  'Cybersecurity',
  'Open Source Tools',
  'Cloud & DevOps'
];

export default function ProjectShowcase({ user, setActiveTab }) {
  const { addToast } = useToast();
  const userId = user?.uid || user?.email || 'scholar_user';
  const userName = user?.name || user?.displayName || 'Scholar Innovator';

  // Check if User is Founder / Super-Admin
  const isFounder = Boolean(
    user?.role === 'founder' || 
    user?.email?.toLowerCase() === 'founder@lumixora.com' || 
    user?.isFounder || 
    user?.email?.includes('shaik') || 
    user?.email?.includes('moham') ||
    localStorage.getItem('lumixora_active_role') === 'founder'
  );

  // Projects list (Firestore + fallback starter)
  const [customProjects, setCustomProjects] = useState([]);
  const [deletedProjectIds, setDeletedProjectIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lumixora_deleted_project_ids') || '[]');
    } catch {
      return [];
    }
  });

  const [loadingProjects, setLoadingProjects] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [filterSeekingTeammates, setFilterSeekingTeammates] = useState(false);
  const [sortBy, setSortBy] = useState('trending'); // 'trending', 'recent', 'stars'

  // User Upvotes & Starred in LocalStorage
  const [upvotedIds, setUpvotedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`lumixora_upvoted_projects_${userId}`) || '[]');
    } catch {
      return [];
    }
  });

  const [starredIds, setStarredIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`lumixora_starred_projects_${userId}`) || '[]');
    } catch {
      return [];
    }
  });

  // Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState(null);
  const [isAiOptimizerOpen, setIsAiOptimizerOpen] = useState(false);
  const [aiOptimizingProject, setAiOptimizingProject] = useState(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Publish Project Form State
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    domain: 'Web Apps',
    description: '',
    techStackText: '',
    liveUrl: '',
    githubUrl: '',
    seekingTeammates: false,
    seekingRole: ''
  });

  // Edit Project Form State
  const [editFormData, setEditFormData] = useState({
    id: '',
    title: '',
    tagline: '',
    domain: 'Web Apps',
    description: '',
    techStackText: '',
    liveUrl: '',
    githubUrl: '',
    seekingTeammates: false,
    seekingRole: '',
    featured: false
  });

  // 1. Sync from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, 'student_projects'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setCustomProjects(list);
        setLoadingProjects(false);
      }, (err) => {
        console.warn('Firestore projects stream note:', err);
        setLoadingProjects(false);
      });
      return () => unsubscribe();
    } catch (e) {
      setLoadingProjects(false);
    }
  }, []);

  // Save upvoted/starred to LocalStorage
  useEffect(() => {
    localStorage.setItem(`lumixora_upvoted_projects_${userId}`, JSON.stringify(upvotedIds));
  }, [upvotedIds, userId]);

  useEffect(() => {
    localStorage.setItem(`lumixora_starred_projects_${userId}`, JSON.stringify(starredIds));
  }, [starredIds, userId]);

  useEffect(() => {
    localStorage.setItem('lumixora_deleted_project_ids', JSON.stringify(deletedProjectIds));
  }, [deletedProjectIds]);

  // Combine Starter + Custom Projects (excluding deleted IDs)
  const allProjects = useMemo(() => {
    const combined = [...customProjects, ...STARTER_PROJECTS];
    const seen = new Set();
    return combined.filter(p => {
      if (deletedProjectIds.includes(p.id)) return false;
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [customProjects, deletedProjectIds]);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter(p => {
      if (selectedDomain !== 'All Domains' && p.domain !== selectedDomain) return false;
      if (filterSeekingTeammates && !p.seekingTeammates) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(q);
        const matchesTagline = p.tagline?.toLowerCase().includes(q);
        const matchesAuthor = p.author?.name?.toLowerCase().includes(q);
        const matchesTech = p.techStack?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTagline && !matchesAuthor && !matchesTech) return false;
      }
      return true;
    }).sort((a, b) => {
      // Featured projects float to top
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      if (sortBy === 'trending') return (b.upvotes || 0) - (a.upvotes || 0);
      if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0);
      return (b.id > a.id ? 1 : -1);
    });
  }, [allProjects, selectedDomain, filterSeekingTeammates, searchQuery, sortBy]);

  // Handle Upvote
  const handleToggleUpvote = async (projectId, e) => {
    if (e) e.stopPropagation();
    const isUpvoted = upvotedIds.includes(projectId);
    
    if (isUpvoted) {
      setUpvotedIds(prev => prev.filter(id => id !== projectId));
      addToast({ message: 'Upvote removed', type: 'info' });
    } else {
      setUpvotedIds(prev => [...prev, projectId]);
      addToast({ message: '🚀 Upvoted project! Innovation score boosted.', type: 'success' });
      
      try {
        const docRef = doc(db, 'student_projects', projectId);
        await updateDoc(docRef, { upvotes: increment(1) });
      } catch (err) {}
    }
  };

  // Handle Star / Bookmark
  const handleToggleStar = (projectId, e) => {
    if (e) e.stopPropagation();
    const isStarred = starredIds.includes(projectId);
    if (isStarred) {
      setStarredIds(prev => prev.filter(id => id !== projectId));
      addToast({ message: 'Removed from bookmarks', type: 'info' });
    } else {
      setStarredIds(prev => [...prev, projectId]);
      addToast({ message: '⭐ Project saved to your bookmarks!', type: 'success' });
    }
  };

  // ─── FOUNDER / AUTHOR DELETE PROJECT ────────────────────────────────────────
  const handleDeleteProject = async (project, e) => {
    if (e) e.stopPropagation();
    const confirmDelete = window.confirm(`Are you sure you want to delete "${project.title}" from the Innovation Expo?`);
    if (!confirmDelete) return;

    try {
      // 1. If in Firestore, delete document
      const docRef = doc(db, 'student_projects', project.id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Local/Starter project removal note:', err);
    }

    // 2. Track deleted ID in state and localStorage
    setDeletedProjectIds(prev => [...prev, project.id]);
    setCustomProjects(prev => prev.filter(p => p.id !== project.id));
    if (selectedProjectForDetails?.id === project.id) {
      setSelectedProjectForDetails(null);
    }

    addToast({ message: `🗑️ Deleted project "${project.title}"!`, type: 'success' });
  };

  // ─── FOUNDER / AUTHOR OPEN EDIT MODAL ───────────────────────────────────────
  const handleOpenEditModal = (project, e) => {
    if (e) e.stopPropagation();
    setProjectToEdit(project);
    setEditFormData({
      id: project.id,
      title: project.title || '',
      tagline: project.tagline || '',
      domain: project.domain || 'Web Apps',
      description: project.description || '',
      techStackText: Array.isArray(project.techStack) ? project.techStack.join(', ') : (project.techStack || ''),
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      seekingTeammates: Boolean(project.seekingTeammates),
      seekingRole: project.seekingRole || '',
      featured: Boolean(project.featured)
    });
    setIsEditModalOpen(true);
  };

  // ─── SAVE EDITED PROJECT ───────────────────────────────────────────────────
  const handleSaveEditedProject = async (e) => {
    e.preventDefault();
    if (!editFormData.title.trim() || !editFormData.tagline.trim()) {
      addToast({ message: 'Please enter a valid title and tagline', type: 'error' });
      return;
    }

    const techArray = editFormData.techStackText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const updatedData = {
      title: editFormData.title.trim(),
      tagline: editFormData.tagline.trim(),
      domain: editFormData.domain,
      description: editFormData.description.trim() || editFormData.tagline.trim(),
      techStack: techArray.length > 0 ? techArray : ['Full Stack', 'Web'],
      liveUrl: editFormData.liveUrl.trim(),
      githubUrl: editFormData.githubUrl.trim(),
      seekingTeammates: Boolean(editFormData.seekingTeammates),
      seekingRole: editFormData.seekingRole.trim(),
      featured: Boolean(editFormData.featured),
      updatedAt: serverTimestamp()
    };

    try {
      const docRef = doc(db, 'student_projects', editFormData.id);
      await updateDoc(docRef, updatedData);
      addToast({ message: '✨ Project updated successfully in Cloud Expo!', type: 'success' });
    } catch (err) {
      // Local / starter fallback update
      setCustomProjects(prev => {
        const idx = prev.findIndex(p => p.id === editFormData.id);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...updatedData };
          return copy;
        } else {
          return [{ id: editFormData.id, ...projectToEdit, ...updatedData }, ...prev];
        }
      });
      addToast({ message: '✨ Project changes saved!', type: 'success' });
    }

    if (selectedProjectForDetails?.id === editFormData.id) {
      setSelectedProjectForDetails(prev => ({ ...prev, ...updatedData }));
    }

    setIsEditModalOpen(false);
  };

  // ─── FOUNDER 1-CLICK FEATURE TOGGLE ────────────────────────────────────────
  const handleToggleFeatured = async (project, e) => {
    if (e) e.stopPropagation();
    const newFeatured = !project.featured;

    try {
      const docRef = doc(db, 'student_projects', project.id);
      await updateDoc(docRef, { featured: newFeatured });
    } catch (err) {
      setCustomProjects(prev => prev.map(p => p.id === project.id ? { ...p, featured: newFeatured } : p));
    }

    addToast({ 
      message: newFeatured ? '⭐ Project pinned as Featured Innovation!' : 'Project unpinned from Featured', 
      type: 'info' 
    });
  };

  // Handle Submit Project
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.tagline.trim()) {
      addToast({ message: 'Please enter a project title and tagline', type: 'error' });
      return;
    }

    const techArray = formData.techStackText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newProject = {
      title: formData.title.trim(),
      tagline: formData.tagline.trim(),
      domain: formData.domain,
      description: formData.description.trim() || formData.tagline.trim(),
      techStack: techArray.length > 0 ? techArray : ['Full Stack', 'Web'],
      liveUrl: formData.liveUrl.trim(),
      githubUrl: formData.githubUrl.trim(),
      seekingTeammates: Boolean(formData.seekingTeammates),
      seekingRole: formData.seekingRole.trim(),
      featured: isFounder,
      author: {
        name: userName,
        college: user?.college || 'GPREC Kurnool',
        dept: user?.department || user?.branch || 'Engineering',
        avatar: user?.avatarUrl || user?.photoURL || '/lumixora_logo.jpg',
        userId
      },
      upvotes: 1,
      stars: 0,
      commentsCount: 0,
      createdAt: serverTimestamp()
    };

    try {
      const docRef = await addDoc(collection(db, 'student_projects'), newProject);
      setUpvotedIds(prev => [...prev, docRef.id]);
      addToast({ message: '🎉 Your project has been published to the Showcase!', type: 'success' });
      
      setFormData({
        title: '',
        tagline: '',
        domain: 'Web Apps',
        description: '',
        techStackText: '',
        liveUrl: '',
        githubUrl: '',
        seekingTeammates: false,
        seekingRole: ''
      });
      setIsSubmitModalOpen(false);
    } catch (err) {
      console.error('Project upload error:', err);
      const localId = `local_proj_${Date.now()}`;
      setCustomProjects(prev => [{ id: localId, ...newProject, createdAt: 'Just now' }, ...prev]);
      setUpvotedIds(prev => [...prev, localId]);
      addToast({ message: '🎉 Project published locally!', type: 'success' });
      setIsSubmitModalOpen(false);
    }
  };

  // AI Resume & Elevator Pitch Generator for Project
  const handleGenerateAiPitch = async (project) => {
    setAiOptimizingProject(project);
    setIsAiOptimizerOpen(true);
    setAiLoading(true);
    setAiAnalysisResult(null);

    const prompt = `You are a Senior Tech Recruiter and Technical Interview Architect. 
Analyze the following student project and produce a high-impact portfolio review:

Project Title: ${project.title}
Tagline: ${project.tagline}
Domain: ${project.domain}
Tech Stack: ${Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack}
Description: ${project.description}

Please provide:
1. 🎯 3 High-Impact Resume STAR Bullet Points (quantifiable, recruiter-appealing with action verbs like "Architected", "Engineered", "Optimized").
2. ⚡ 30-Second Elevator Pitch (for interviews or hackathon demos).
3. 🚀 2 Architectural Recommendations & Next Feature Ideas (to take this from a student prototype to an enterprise/startup product).
4. 💡 Top 3 Interview Questions a recruiter might ask about this specific stack.`;

    try {
      const response = await callAICompletion(prompt);
      setAiAnalysisResult(response);
    } catch (err) {
      setAiAnalysisResult("Unable to generate AI pitch right now. Please check your network connection.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
        
        {/* ─── HERO HEADER ─────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-white/10 bg-gradient-to-br from-indigo-950/40 via-purple-950/40 to-black/90 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-[#00f5d4]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-widest">
                  <Rocket className="w-3.5 h-3.5 text-[#00f5d4] animate-bounce" /> Campus Innovation Expo & Showcase
                </div>
                {isFounder && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
                    <ShieldCheck className="w-3.5 h-3.5" /> Founder Super-Admin Controls Active 🛡️
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5d4] via-teal-300 to-purple-400">Project Showcase</span>
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Showcase your side-projects, AI models, hackathon builds, and open-source tools. Get peer feedback, find co-founders, and impress recruiters.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00f5d4] to-[#00b4d8] text-black font-black text-xs sm:text-sm shadow-[0_4px_20px_rgba(0,245,212,0.3)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> 🚀 Publish Your Project
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white">{allProjects.length}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Innovations Live</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Heart className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <span className="text-xl font-black text-white">
                  {allProjects.reduce((acc, p) => acc + (p.upvotes || 0), 0)}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Upvotes</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white">
                  {allProjects.filter(p => p.seekingTeammates).length}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Seeking Teammates</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-[#00f5d4]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-white block mt-0.5">AI Verified</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Resume Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SEARCH & FILTER CONTROLS ────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects by title, tech stack (React, Python...), or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs font-bold focus:outline-none focus:border-[#00f5d4] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              {/* Seeking Teammates Filter Button */}
              <button
                onClick={() => setFilterSeekingTeammates(!filterSeekingTeammates)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                  filterSeekingTeammates
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Seeking Teammates ({allProjects.filter(p => p.seekingTeammates).length})</span>
              </button>

              {/* Sort Switcher */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setSortBy('trending')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    sortBy === 'trending' ? 'bg-[#00f5d4] text-black shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3 h-3" /> Trending
                </button>
                <button
                  onClick={() => setSortBy('stars')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    sortBy === 'stars' ? 'bg-[#00f5d4] text-black shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Star className="w-3 h-3" /> Starred
                </button>
              </div>
            </div>
          </div>

          {/* Domain Chips Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {DOMAINS.map(domain => {
              const count = domain === 'All Domains' 
                ? allProjects.length 
                : allProjects.filter(p => p.domain === domain).length;
              const isSelected = selectedDomain === domain;

              return (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white shadow-lg scale-[1.02]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{domain}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── PROJECTS GRID ───────────────────────────────────────────── */}
        {filteredProjects.length === 0 ? (
          <div className="glass-panel p-12 sm:p-16 rounded-3xl border border-white/10 text-center space-y-4 max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto shadow-inner">
              <Rocket className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">No Projects Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No projects matched your search criteria. Be the first to publish a project in this domain!
              </p>
            </div>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-[#00f5d4] text-black font-extrabold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> + Publish Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const isUpvoted = upvotedIds.includes(project.id);
              const isStarred = starredIds.includes(project.id);
              const effectiveUpvotes = (project.upvotes || 0) + (isUpvoted && !STARTER_PROJECTS.some(p => p.id === project.id) ? 0 : isUpvoted ? 1 : 0);
              const canEditOrDelete = isFounder || project.author?.userId === userId;

              return (
                <div
                  key={project.id}
                  className={`glass-panel rounded-3xl border ${
                    project.featured ? 'border-amber-500/50 shadow-amber-500/10' : 'border-white/10'
                  } hover:border-purple-500/40 bg-gradient-to-b from-white/[0.04] to-black/60 p-6 flex flex-col justify-between space-y-5 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 relative group`}
                >
                  {/* Founder / Author Moderation Bar */}
                  {canEditOrDelete && (
                    <div className="flex items-center justify-between p-2 px-3 rounded-2xl bg-black/60 border border-white/10 mb-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-amber-300">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{isFounder ? 'Founder Controls' : 'Author Controls'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {isFounder && (
                          <button
                            onClick={(e) => handleToggleFeatured(project, e)}
                            className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                              project.featured
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                            }`}
                            title={project.featured ? 'Unpin Featured' : 'Pin to Top as Featured'}
                          >
                            <Pin className={`w-3 h-3 ${project.featured ? 'fill-amber-400' : ''}`} />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleOpenEditModal(project, e)}
                          className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 cursor-pointer"
                          title="Edit / Modify Project"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteProject(project, e)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Top Badge & Bookmark */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-wider">
                          {project.domain}
                        </span>
                        {project.featured && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <Sparkle className="w-3 h-3 text-amber-400" /> Featured
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {project.seekingTeammates && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 animate-pulse">
                            <Users className="w-3 h-3" /> Hiring
                          </span>
                        )}

                        <button
                          onClick={(e) => handleToggleStar(project.id, e)}
                          className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                            isStarred
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                          title="Bookmark Project"
                        >
                          <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-lg font-black text-white group-hover:text-[#00f5d4] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1.5 line-clamp-2 leading-relaxed">
                      {project.tagline}
                    </p>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.techStack?.slice(0, 4).map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-mono font-bold text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack?.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-gray-400">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Author Strip */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={project.author?.avatar || '/lumixora_logo.jpg'} 
                          alt={project.author?.name || 'Author'}
                          className="w-8 h-8 rounded-full border border-white/20 object-cover"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block truncate">
                            {project.author?.name || 'Scholar Innovator'}
                          </span>
                          <span className="text-[10px] text-gray-400 block truncate">
                            {project.author?.dept || 'Engineering'} • {project.author?.college || 'GPREC'}
                          </span>
                        </div>
                      </div>

                      {/* AI Resume Pitch Trigger */}
                      <button
                        onClick={() => handleGenerateAiPitch(project)}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                        title="Generate Recruiter Pitch & Resume STAR points"
                      >
                        <Sparkles className="w-3 h-3 text-[#00f5d4]" /> AI Pitch
                      </button>
                    </div>

                    {/* Bottom Action Strip: Upvote + Links */}
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <button
                        onClick={(e) => handleToggleUpvote(project.id, e)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isUpvoted
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-105'
                            : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-white' : 'text-rose-400'}`} />
                        <span>{effectiveUpvotes}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                            title="View Source Code on GitHub"
                          >
                            <Code2 className="w-4 h-4" />
                          </a>
                        )}

                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00f5d4] to-[#00b4d8] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:opacity-95 transition-all"
                          >
                            <span>Live Demo</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <button
                            onClick={() => setSelectedProjectForDetails(project)}
                            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold"
                          >
                            Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── MODAL: EDIT / MODIFY PROJECT ────────────────────────────── */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#10101c] border border-blue-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">
                    {isFounder ? '🛡️ Founder Super-Admin Mode' : '✏️ Project Author Edit'}
                  </span>
                  <h2 className="text-xl font-black text-white">Edit & Modify Project</h2>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedProject} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Domain</label>
                    <select
                      value={editFormData.domain}
                      onChange={(e) => setEditFormData({ ...editFormData, domain: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-blue-400 cursor-pointer"
                    >
                      {DOMAINS.filter(d => d !== 'All Domains').map(d => (
                        <option key={d} value={d} className="bg-neutral-900">{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Tagline (1-Sentence Summary) *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.tagline}
                    onChange={(e) => setEditFormData({ ...editFormData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={editFormData.techStackText}
                    onChange={(e) => setEditFormData({ ...editFormData, techStackText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Full Description & Architecture</label>
                  <textarea
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-blue-400 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Live Demo URL</label>
                    <input
                      type="url"
                      value={editFormData.liveUrl}
                      onChange={(e) => setEditFormData({ ...editFormData, liveUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">GitHub Repo URL</label>
                    <input
                      type="url"
                      value={editFormData.githubUrl}
                      onChange={(e) => setEditFormData({ ...editFormData, githubUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                {/* Founder Feature Switch */}
                {isFounder && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pin className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-amber-200">Feature on Top of Innovation Expo</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={editFormData.featured}
                      onChange={(e) => setEditFormData({ ...editFormData, featured: e.target.checked })}
                      className="w-4 h-4 accent-amber-400 cursor-pointer"
                    />
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.seekingTeammates}
                      onChange={(e) => setEditFormData({ ...editFormData, seekingTeammates: e.target.checked })}
                      className="w-4 h-4 accent-[#00f5d4] rounded"
                    />
                    <span className="text-xs font-bold text-white">Seeking Co-Founders / Teammates</span>
                  </label>
                  {editFormData.seekingTeammates && (
                    <input
                      type="text"
                      placeholder="Role needed (e.g. Backend Dev, UI/UX Designer)"
                      value={editFormData.seekingRole}
                      onChange={(e) => setEditFormData({ ...editFormData, seekingRole: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(projectToEdit)}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Project
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-[#00f5d4] text-black font-black text-xs shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: PUBLISH PROJECT ─────────────────────────────────── */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#10101c] border border-purple-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#00f5d4] uppercase">Student Innovation Portal</span>
                  <h2 className="text-xl font-black text-white">Publish Your Project</h2>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitProject} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lumixora AI Academic Engine"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Domain</label>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4] cursor-pointer"
                    >
                      {DOMAINS.filter(d => d !== 'All Domains').map(d => (
                        <option key={d} value={d} className="bg-neutral-900">{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Tagline (1-Sentence Pitch) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Real-time distributed campus operating system built for 1,200+ students."
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, Python, TensorFlow, Firebase"
                    value={formData.techStackText}
                    onChange={(e) => setFormData({ ...formData, techStackText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Full Description & Architecture</label>
                  <textarea
                    rows={3}
                    placeholder="Explain the problem you solved, architectural details, metrics achieved..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-[#00f5d4] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Live Demo URL</label>
                    <input
                      type="url"
                      placeholder="https://myproject.vercel.app"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">GitHub Repo URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/project"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.seekingTeammates}
                      onChange={(e) => setFormData({ ...formData, seekingTeammates: e.target.checked })}
                      className="w-4 h-4 accent-[#00f5d4] rounded"
                    />
                    <span className="text-xs font-bold text-white">Seeking Co-Founders / Teammates</span>
                  </label>
                  {formData.seekingTeammates && (
                    <input
                      type="text"
                      placeholder="Role needed (e.g. Backend Dev, UI/UX Designer)"
                      value={formData.seekingRole}
                      onChange={(e) => setFormData({ ...formData, seekingRole: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                    />
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00f5d4] to-[#00b4d8] text-black font-black text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    Publish to Innovation Expo 🚀
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: AI RESUME STAR POINTS & ELEVATOR PITCH ──────────── */}
        {isAiOptimizerOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#10101c] border border-purple-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">AI Recruiter & Pitch Engine</span>
                  <h2 className="text-xl font-black text-white">Project Resume Optimizer</h2>
                  <p className="text-xs text-gray-400">{aiOptimizingProject?.title}</p>
                </div>
                <button
                  onClick={() => setIsAiOptimizerOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {aiLoading ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-300 font-bold animate-pulse">
                    Synthesizing STAR impact bullets & technical elevator pitch...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-xs text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">
                    {aiAnalysisResult}
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiAnalysisResult || '');
                        addToast({ message: 'Copied AI Resume points to clipboard!', type: 'success' });
                      }}
                      className="px-4 py-2 rounded-xl bg-[#00f5d4] text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Copy Resume Points
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
  );
}
