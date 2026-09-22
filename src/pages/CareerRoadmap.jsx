import React, { useState, useEffect, useMemo } from 'react';
import { 
  Map, ChevronRight, CheckCircle, PlayCircle, BookOpen, Award, ArrowLeft, 
  ExternalLink, Video, Play, X, Trophy, Sparkles, Flame, Clock, 
  BarChart2, Check, RefreshCw, Printer, Share2, Layers, 
  Search, CheckCircle2, ShieldCheck, Zap
} from 'lucide-react';
import { ROADMAPS } from '../data/roadmapsData';
import { resolveLectureVideo } from '../data/roadmapVideosMap';

export default function CareerRoadmap({ user }) {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [activeTab, setActiveTab] = useState('steps'); // 'steps' | 'videos' | 'dashboard' | 'certificate'
  const [progress, setProgress] = useState({});
  const [subProgress, setSubProgress] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [expandedStep, setExpandedStep] = useState(null);
  const [activeDayVideo, setActiveDayVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [videoFilter, setVideoFilter] = useState('all'); // 'all' | 'playlist' | 'bootcamp' | 'crash-course' | 'masterclass' | 'daily'
  const [copiedLink, setCopiedLink] = useState(false);

  const scholarName = useMemo(() => {
    if (!user?.name && !user?.displayName) return 'Vyomra Scholar';
    let name = user.name || user.displayName;
    if (typeof name === 'string' && name.includes('{')) {
      name = name.split('{')[0].trim();
    }
    return name.replace(/[\{\}":;]/g, '').trim() || 'Vyomra Scholar';
  }, [user]);

  // Handle ESC key to close activeDayVideo modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeDayVideo) {
        setActiveDayVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDayVideo]);

  useEffect(() => {
    // Load progress from local storage
    if (user?.uid) {
      const savedProgress = localStorage.getItem(`lumixora_roadmap_progress_${user.uid}`);
      if (savedProgress) {
        try {
          setProgress(JSON.parse(savedProgress));
        } catch (e) {
          console.error("Failed to parse roadmap progress");
        }
      }
      
      const savedSubProgress = localStorage.getItem(`lumixora_roadmap_subprogress_${user.uid}`);
      if (savedSubProgress) {
        try {
          setSubProgress(JSON.parse(savedSubProgress));
        } catch (e) {
          console.error("Failed to parse roadmap sub progress");
        }
      }

      const savedVideoProgress = localStorage.getItem(`lumixora_roadmap_videos_${user.uid}`);
      if (savedVideoProgress) {
        try {
          setVideoProgress(JSON.parse(savedVideoProgress));
        } catch (e) {
          console.error("Failed to parse roadmap video progress");
        }
      }
    }
  }, [user]);

  const toggleStep = (roadmapId, stepId) => {
    if (!user?.uid) return;
    
    const newProgress = { ...progress };
    if (!newProgress[roadmapId]) {
      newProgress[roadmapId] = {};
    }
    
    const isNowCompleted = !newProgress[roadmapId][stepId];
    newProgress[roadmapId][stepId] = isNowCompleted;
    setProgress(newProgress);
    localStorage.setItem(`lumixora_roadmap_progress_${user.uid}`, JSON.stringify(newProgress));

    // Also auto-toggle all subtasks of this step
    const roadmap = ROADMAPS.find(r => r.id === roadmapId);
    const step = roadmap?.steps.find(s => s.id === stepId);
    if (step?.actionItems) {
      const key = `${roadmapId}_${stepId}`;
      const newSubProgress = { ...subProgress };
      if (!newSubProgress[key]) newSubProgress[key] = {};
      step.actionItems.forEach((_, idx) => {
        newSubProgress[key][idx] = isNowCompleted;
      });
      setSubProgress(newSubProgress);
      localStorage.setItem(`lumixora_roadmap_subprogress_${user.uid}`, JSON.stringify(newSubProgress));
    }
  };

  const toggleSubItem = (roadmapId, stepId, itemIndex) => {
    if (!user?.uid) return;
    const key = `${roadmapId}_${stepId}`;
    const newSubProgress = { ...subProgress };
    if (!newSubProgress[key]) {
      newSubProgress[key] = {};
    }
    newSubProgress[key][itemIndex] = !newSubProgress[key][itemIndex];
    setSubProgress(newSubProgress);
    localStorage.setItem(`lumixora_roadmap_subprogress_${user.uid}`, JSON.stringify(newSubProgress));

    // Check if all sub items in this step are completed
    const roadmap = ROADMAPS.find(r => r.id === roadmapId);
    const step = roadmap?.steps.find(s => s.id === stepId);
    if (step?.actionItems) {
      const allDone = step.actionItems.every((_, i) => newSubProgress[key]?.[i]);
      const newProgress = { ...progress };
      if (!newProgress[roadmapId]) newProgress[roadmapId] = {};
      newProgress[roadmapId][stepId] = allDone;
      setProgress(newProgress);
      localStorage.setItem(`lumixora_roadmap_progress_${user.uid}`, JSON.stringify(newProgress));
    }
  };

  const toggleVideoWatched = (roadmapId, videoKey) => {
    if (!user?.uid) return;
    const key = `${roadmapId}_${videoKey}`;
    const newVideoProgress = { ...videoProgress };
    newVideoProgress[key] = !newVideoProgress[key];
    setVideoProgress(newVideoProgress);
    localStorage.setItem(`lumixora_roadmap_videos_${user.uid}`, JSON.stringify(newVideoProgress));
  };

  const isVideoWatched = (roadmapId, videoKey) => {
    return Boolean(videoProgress[`${roadmapId}_${videoKey}`]);
  };

  // Granular completion percentage calculation
  const calculateProgress = (roadmapId) => {
    const roadmap = ROADMAPS.find(r => r.id === roadmapId);
    if (!roadmap) return 0;
    
    let totalItems = 0;
    let completedItems = 0;

    roadmap.steps.forEach(step => {
      if (step.actionItems && step.actionItems.length > 0) {
        step.actionItems.forEach((_, idx) => {
          totalItems++;
          if (subProgress[`${roadmapId}_${step.id}`]?.[idx]) {
            completedItems++;
          }
        });
      } else {
        totalItems++;
        if (progress[roadmapId]?.[step.id]) {
          completedItems++;
        }
      }
    });

    if (totalItems === 0) return 0;
    return Math.round((completedItems / totalItems) * 100);
  };

  const calculatePhaseProgress = (roadmapId, step) => {
    if (!step?.actionItems || step.actionItems.length === 0) {
      return progress[roadmapId]?.[step.id] ? 100 : 0;
    }
    const completed = step.actionItems.filter((_, idx) => subProgress[`${roadmapId}_${step.id}`]?.[idx]).length;
    return Math.round((completed / step.actionItems.length) * 100);
  };

  const getCompletedTasksCount = (roadmapId) => {
    const roadmap = ROADMAPS.find(r => r.id === roadmapId);
    if (!roadmap) return { completed: 0, total: 0 };
    let total = 0;
    let completed = 0;
    roadmap.steps.forEach(step => {
      if (step.actionItems) {
        step.actionItems.forEach((_, idx) => {
          total++;
          if (subProgress[`${roadmapId}_${step.id}`]?.[idx]) completed++;
        });
      }
    });
    return { completed, total };
  };

  const getReadinessStatus = (percent) => {
    if (percent === 100) return { label: 'Industry Master / Certified', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', badge: '👑 Master' };
    if (percent >= 80) return { label: 'Interview & Production Ready', color: 'text-brand-teal', bg: 'bg-brand-teal/20', border: 'border-brand-teal/40', badge: '💼 Advanced' };
    if (percent >= 50) return { label: 'Core Competency Specialist', color: 'text-brand-blue', bg: 'bg-brand-blue/20', border: 'border-brand-blue/40', badge: '🚀 Intermediate' };
    if (percent >= 20) return { label: 'Foundations Explorer', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40', badge: '🌱 Apprentice' };
    return { label: 'Getting Started', color: 'text-gray-400', bg: 'bg-white/5', border: 'border-white/10', badge: '🔰 Beginner' };
  };

  const resetRoadmapProgress = (roadmapId) => {
    if (!window.confirm("Are you sure you want to reset your progress for this roadmap?")) return;
    const newProgress = { ...progress };
    delete newProgress[roadmapId];
    setProgress(newProgress);
    localStorage.setItem(`lumixora_roadmap_progress_${user.uid}`, JSON.stringify(newProgress));

    const roadmap = ROADMAPS.find(r => r.id === roadmapId);
    const newSubProgress = { ...subProgress };
    roadmap?.steps.forEach(s => {
      delete newSubProgress[`${roadmapId}_${s.id}`];
    });
    setSubProgress(newSubProgress);
    localStorage.setItem(`lumixora_roadmap_subprogress_${user.uid}`, JSON.stringify(newSubProgress));
  };

  const markAllComplete = (roadmapId) => {
    const roadmap = ROADMAPS.find(r => r.id === roadmapId);
    if (!roadmap) return;
    
    const newProgress = { ...progress, [roadmapId]: {} };
    const newSubProgress = { ...subProgress };
    
    roadmap.steps.forEach(step => {
      newProgress[roadmapId][step.id] = true;
      const key = `${roadmapId}_${step.id}`;
      if (!newSubProgress[key]) newSubProgress[key] = {};
      step.actionItems?.forEach((_, idx) => {
        newSubProgress[key][idx] = true;
      });
    });

    setProgress(newProgress);
    setSubProgress(newSubProgress);
    localStorage.setItem(`lumixora_roadmap_progress_${user.uid}`, JSON.stringify(newProgress));
    localStorage.setItem(`lumixora_roadmap_subprogress_${user.uid}`, JSON.stringify(newSubProgress));
  };

  // Global Multi-Roadmap Stats
  const globalStats = useMemo(() => {
    let enrolled = 0;
    let totalDaysCompleted = 0;
    let totalTasksAvailable = 0;
    let totalWatchedVideos = 0;

    ROADMAPS.forEach(r => {
      const p = calculateProgress(r.id);
      if (p > 0) enrolled++;
      const { completed, total } = getCompletedTasksCount(r.id);
      totalDaysCompleted += completed;
      totalTasksAvailable += total;
    });

    Object.keys(videoProgress).forEach(k => {
      if (videoProgress[k]) totalWatchedVideos++;
    });

    const overallPercent = totalTasksAvailable > 0 ? Math.round((totalDaysCompleted / totalTasksAvailable) * 100) : 0;
    return {
      enrolled,
      totalDaysCompleted,
      totalWatchedVideos,
      overallPercent
    };
  }, [progress, subProgress, videoProgress]);

  // Categories Filter for main overview
  const filteredRoadmaps = useMemo(() => {
    return ROADMAPS.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'software') return ['it-placements', 'full-stack', 'python-dev', 'java-dsa', 'qa-sdet'].includes(r.id);
      if (selectedCategory === 'ai-data') return ['ai-ml', 'data-science', 'data-eng'].includes(r.id);
      if (selectedCategory === 'cloud-cyber') return ['cloud-devops', 'cybersecurity', 'web3'].includes(r.id);
      if (selectedCategory === 'mobile-game') return ['mobile-dev', 'game-dev'].includes(r.id);
      if (selectedCategory === 'gate-core') return ['gate-prep', 'govt-jobs', 'core-hardware', 'ui-ux', 'product-mgmt'].includes(r.id);
      return true;
    });
  }, [searchQuery, selectedCategory]);

  // ─────────────────────────────────────────────────────────────────────────────
  // SELECTED ROADMAP VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (selectedRoadmap) {
    const roadmap = ROADMAPS.find(r => r.id === selectedRoadmap);
    const progressPercent = calculateProgress(roadmap.id);
    const Icon = roadmap.icon;
    const taskStats = getCompletedTasksCount(roadmap.id);
    const readiness = getReadinessStatus(progressPercent);

    // Collect all daily action items connected to their verified respective videos
    const allDailyVideos = [];
    roadmap.steps.forEach((step, sIdx) => {
      step.actionItems?.forEach((item, iIdx) => {
        const resolvedVideo = resolveLectureVideo(roadmap, step, item, iIdx, sIdx);
        allDailyVideos.push({
          ...resolvedVideo,
          stepId: step.id,
          stepIndex: sIdx,
          itemIndex: iIdx,
          type: 'daily',
          isCompleted: Boolean(subProgress[`${roadmap.id}_${step.id}`]?.[iIdx])
        });
      });
    });

    // Filter videos in video tab
    const curatedVideos = roadmap.resources?.videos || [];
    const displayedVideos = curatedVideos.filter(v => {
      if (videoFilter === 'all') return true;
      return v.type === videoFilter;
    });

    const videosWatchedCount = curatedVideos.filter(v => isVideoWatched(roadmap.id, v.title)).length;
    const totalCuratedVideos = curatedVideos.length;

    return (
      <div className="space-y-6 animate-fade-in pb-16 max-w-7xl mx-auto">
        {/* Top Breadcrumb & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedRoadmap(null)}
              className="p-2.5 hover:bg-white/10 rounded-2xl transition-all text-gray-400 hover:text-white border border-white/5 hover:border-white/20 flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Roadmaps</span>
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-xl bg-white/5 border border-white/10 ${roadmap.color}`}>
                <Icon className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-gray-300 truncate max-w-[200px] sm:max-w-xs">{roadmap.title}</span>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => resetRoadmapProgress(roadmap.id)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-red-400 border border-white/5 hover:border-red-500/20 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset progress for this roadmap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            {progressPercent < 100 && (
              <button
                onClick={() => markAllComplete(roadmap.id)}
                className="px-3 py-1.5 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Mark all 30 days complete"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark All Complete</span>
              </button>
            )}
          </div>
        </div>

        {/* Roadmap Hero Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`p-2.5 rounded-2xl bg-white/10 border border-white/10 ${roadmap.color} shadow-inner`}>
                  <Icon className="w-7 h-7" />
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${readiness.bg} ${readiness.color} ${readiness.border} flex items-center gap-1.5 shadow-sm`}>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  {readiness.badge}: {readiness.label}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">{roadmap.title}</h1>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{roadmap.description}</p>
            </div>

            {/* Completion Gauge Widget */}
            <div className="flex sm:flex-row lg:flex-col items-center sm:items-end justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 min-w-[200px]">
              <div className="text-left sm:text-right">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Roadmap Completion</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className={`text-4xl font-black ${roadmap.color}`}>{progressPercent}%</span>
                  <span className="text-xs text-gray-500 font-bold">/ 100%</span>
                </div>
              </div>
              <div className="text-left sm:text-right text-xs text-gray-400">
                <span className="text-white font-bold">{taskStats.completed}</span> of <span className="text-white font-bold">{taskStats.total}</span> Days Mastered
              </div>
            </div>
          </div>

          {/* Progress bar line */}
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden relative z-10 mt-6 border border-white/5">
            <div 
              className={`h-full ${roadmap.bgColor} transition-all duration-1000 ease-out rounded-full shadow-lg`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className={`absolute -right-16 -top-16 w-64 h-64 ${roadmap.bgColor} blur-[120px] opacity-20`} />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 glass-panel rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('steps')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'steps'
                ? 'bg-brand-teal text-brand-dark shadow-lg shadow-brand-teal/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Step-by-Step Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Video Learning Hub</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'videos' ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-300'}`}>
              {curatedVideos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Progress & Completion Dashboard</span>
            {progressPercent === 100 && <Award className="w-3.5 h-3.5 text-yellow-400" />}
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'certificate'
                ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Milestones & Certificate</span>
            {progressPercent === 100 && (
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            )}
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 1: STEP-BY-STEP ROADMAP GUIDE
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === 'steps' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Main Steps Accordion */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-brand-teal" /> 30-Day Phased Curriculum
                </h3>
                <span className="text-xs text-gray-400 font-semibold">
                  {taskStats.completed} / {taskStats.total} Tasks Completed
                </span>
              </div>
              
              {roadmap.steps.map((step, index) => {
                const isCompleted = progress[roadmap.id]?.[step.id];
                const isExpanded = expandedStep === step.id || (expandedStep === null && index === 0);
                const phasePercent = calculatePhaseProgress(roadmap.id, step);
                
                return (
                  <div 
                    key={step.id} 
                    className={`glass-panel rounded-3xl border transition-all ${
                      isCompleted 
                        ? 'border-green-500/40 bg-green-500/[0.04]' 
                        : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                    }`}
                  >
                    <div 
                      className="p-5 sm:p-6 flex items-start gap-4 cursor-pointer select-none"
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    >
                      <button 
                        type="button"
                        className={`mt-1 flex-shrink-0 transition-all cursor-pointer ${
                          isCompleted ? 'text-green-400 scale-110' : 'text-gray-500 hover:text-white'
                        }`}
                        onClick={(e) => { e.stopPropagation(); toggleStep(roadmap.id, step.id); }}
                        title={isCompleted ? "Mark phase incomplete" : "Mark phase complete"}
                      >
                        <CheckCircle className={`w-6 h-6 ${isCompleted ? 'fill-green-500/20' : ''}`} />
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-black uppercase tracking-wider text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-lg border border-brand-teal/20">
                                Phase {index + 1}
                              </span>
                              <span className="text-xs font-semibold text-gray-400">
                                {step.actionItems?.length || 6} Days Plan
                              </span>
                            </div>
                            <h4 className={`font-bold ${isCompleted ? 'text-gray-300' : 'text-white'} text-base sm:text-lg`}>
                              {step.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs font-bold text-gray-400 hidden sm:inline">
                              {phasePercent}%
                            </span>
                            <div className={`p-1.5 rounded-full bg-white/5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-white' : ''}`}>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Phase Mini Progress Bar */}
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-3">
                          <div 
                            className={`h-full ${isCompleted ? 'bg-green-500' : roadmap.bgColor} transition-all duration-500`}
                            style={{ width: `${phasePercent}%` }}
                          />
                        </div>

                        {/* Expandable Action Items */}
                        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                          <div className="overflow-hidden space-y-3 pt-2 border-t border-white/5">
                            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                            
                            {step.actionItems && (
                              <ul className="space-y-2 mt-3">
                                {step.actionItems.map((item, i) => {
                                  const isSubCompleted = Boolean(subProgress[`${roadmap.id}_${step.id}`]?.[i]);
                                  const resolvedVideo = resolveLectureVideo(roadmap, step, item, i, index);

                                  return (
                                    <li 
                                      key={i} 
                                      className={`text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all p-3 rounded-2xl border cursor-pointer ${
                                        isSubCompleted 
                                          ? 'bg-green-500/10 border-green-500/20 text-gray-400' 
                                          : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5 text-gray-200'
                                      }`}
                                      onClick={(e) => { e.stopPropagation(); toggleSubItem(roadmap.id, step.id, i); }}
                                    >
                                      <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className={`mt-0.5 flex-shrink-0 transition-colors ${isSubCompleted ? 'text-green-400' : 'text-gray-600'}`}>
                                          <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <span className={`font-medium ${isSubCompleted ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                                          {item.text}
                                        </span>
                                      </div>

                                      {/* Action buttons: Watch video + Cheatsheet */}
                                      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveDayVideo({
                                              ...resolvedVideo,
                                              roadmapId: roadmap.id,
                                              videoKey: item.text
                                            });
                                          }}
                                          className="px-3 py-1 rounded-xl bg-red-600/15 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer group shadow-sm"
                                          title="Watch Video Lecture"
                                        >
                                          <Video className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
                                          <span>Watch Video</span>
                                        </button>

                                        {item.url && (
                                          <a 
                                            href={item.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            onClick={(e) => e.stopPropagation()} 
                                            className="px-2.5 py-1 rounded-xl bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal border border-brand-teal/20 text-[11px] font-semibold transition-colors flex items-center gap-1"
                                            title="Open Documentation & Notes"
                                          >
                                            <BookOpen className="w-3 h-3" />
                                            <span className="hidden sm:inline">Notes</span>
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        )}
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resources Sidebar */}
            <div className="space-y-6">
              {/* Quick Video Lectures Card */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-brand-pink" /> Curated Video Series
                  </h3>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className="text-xs text-brand-pink hover:underline font-bold"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {curatedVideos.slice(0, 3).map((vid, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setActiveDayVideo({
                        title: vid.title,
                        stepTitle: vid.channel || 'Curated Lecture',
                        roadmapTitle: roadmap.title,
                        videoUrl: vid.embedUrl || vid.url,
                        watchUrl: vid.url,
                        notesUrl: vid.url,
                        channel: vid.channel,
                        duration: vid.duration,
                        roadmapId: roadmap.id,
                        videoKey: vid.title
                      })}
                      className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-gray-200 group-hover:text-brand-pink transition-colors line-clamp-2">
                          {vid.title}
                        </h4>
                        <Play className="w-3.5 h-3.5 text-brand-pink flex-shrink-0 group-hover:scale-125 transition-transform" />
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
                        <span className="font-semibold text-gray-400">{vid.channel || 'Curated'}</span>
                        <span>•</span>
                        <span>{vid.duration || 'Full Course'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Platforms */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-blue" /> Practice & Platforms
                </h3>
                <div className="space-y-3">
                  {roadmap.resources?.platforms?.map((plat, idx) => (
                    <a 
                      key={idx} 
                      href={plat.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all group"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-gray-200 group-hover:text-brand-blue transition-colors">
                        <span>{plat.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-blue" />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{plat.desc}</p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Key Certifications */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" /> Target Certifications
                </h3>
                <div className="space-y-3">
                  {roadmap.resources?.certifications?.map((cert, idx) => (
                    <a 
                      key={idx} 
                      href={cert.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block p-3.5 rounded-2xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 transition-all group"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-yellow-400">
                        <span>{cert.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-yellow-400/60 group-hover:text-yellow-400" />
                      </div>
                      <p className="text-[11px] text-yellow-500/80 mt-1">{cert.desc}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 2: VIDEO LEARNING & RESOURCE HUB
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === 'videos' && (
          <div className="space-y-6 animate-fade-in">
            {/* Video Hub Stats & Filters */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-6 h-6 text-brand-pink" />
                  <h3 className="text-xl font-bold text-white">Video Resource & Lecture Hub</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Curated video bootcamps, structured playlists, and daily video walkthroughs for {roadmap.title}.
                </p>
              </div>

              {/* Video Stats */}
              <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-semibold uppercase">Videos Watched</span>
                  <p className="text-lg font-black text-brand-pink">{videosWatchedCount} / {totalCuratedVideos}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-semibold uppercase">Daily Lectures</span>
                  <p className="text-lg font-black text-brand-teal">{allDailyVideos.length}</p>
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setVideoFilter('all')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  videoFilter === 'all'
                    ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                All Videos ({curatedVideos.length})
              </button>
              <button
                onClick={() => setVideoFilter('bootcamp')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  videoFilter === 'bootcamp'
                    ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Full Bootcamps
              </button>
              <button
                onClick={() => setVideoFilter('playlist')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  videoFilter === 'playlist'
                    ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Complete Playlists
              </button>
              <button
                onClick={() => setVideoFilter('crash-course')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  videoFilter === 'crash-course'
                    ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Crash Courses
              </button>
              <button
                onClick={() => setVideoFilter('daily')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  videoFilter === 'daily'
                    ? 'bg-brand-teal text-brand-dark shadow-md shadow-brand-teal/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                30 Daily Lectures ({allDailyVideos.length})
              </button>
            </div>

            {/* Video Cards Grid */}
            {videoFilter !== 'daily' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedVideos.map((video, idx) => {
                  const watched = isVideoWatched(roadmap.id, video.title);

                  return (
                    <div 
                      key={idx}
                      className={`glass-panel p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                        watched ? 'border-green-500/30 bg-green-500/[0.02]' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Video Header Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-brand-pink/15 text-brand-pink border border-brand-pink/30 px-2.5 py-1 rounded-full">
                              {video.type || 'Course'}
                            </span>
                            <span className="text-[11px] font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {video.duration || 'Full Series'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleVideoWatched(roadmap.id, video.title)}
                            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              watched 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span>{watched ? 'Watched' : 'Mark Watched'}</span>
                          </button>
                        </div>

                        {/* Title & Channel */}
                        <div>
                          <p className="text-xs text-brand-teal font-bold mb-1">{video.channel || 'Official Channel'}</p>
                          <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                            {video.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">
                            {video.description}
                          </p>
                        </div>
                      </div>

                      {/* Video Player Action Buttons */}
                      <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-4">
                        <button
                          type="button"
                          onClick={() => setActiveDayVideo({
                            title: video.title,
                            stepTitle: video.channel || 'Curated Resource',
                            roadmapTitle: roadmap.title,
                            videoUrl: video.embedUrl || video.url,
                            watchUrl: video.url,
                            notesUrl: video.url,
                            channel: video.channel,
                            duration: video.duration,
                            roadmapId: roadmap.id,
                            videoKey: video.title
                          })}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-pink/20"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Play in Modal</span>
                        </button>

                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                          title="Open in YouTube"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Daily Action Lectures Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allDailyVideos.map((dayVideo, idx) => (
                  <div 
                    key={idx}
                    className={`glass-panel p-4 rounded-2xl border transition-all ${
                      dayVideo.isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-white/5 hover:border-white/15 bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
                      <span className="font-bold text-brand-teal">{dayVideo.stepTitle.split(':')[0]}</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded-md">Day {idx + 1}</span>
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-white line-clamp-2 mb-3">
                      {dayVideo.title}
                    </h5>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <button
                        onClick={() => setActiveDayVideo({
                          ...dayVideo,
                          roadmapId: roadmap.id,
                          videoKey: dayVideo.title
                        })}
                        className="text-xs font-bold text-brand-pink hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch Lecture</span>
                      </button>

                      {dayVideo.isCompleted && (
                        <span className="text-[10px] font-bold text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Done
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 3: COMPLETION PROGRESS DASHBOARD
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Performance Analytics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Readiness Score */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <span>Career Readiness</span>
                  <Zap className={`w-4 h-4 ${readiness.color}`} />
                </div>
                <div className={`text-2xl font-extrabold ${readiness.color}`}>
                  {readiness.badge}
                </div>
                <p className="text-xs text-gray-400">{readiness.label}</p>
                <div className={`absolute -right-6 -bottom-6 w-24 h-24 ${readiness.bg} blur-2xl opacity-40`} />
              </div>

              {/* Card 2: 30-Day Mastered */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <span>Days Mastered</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">
                  {taskStats.completed} <span className="text-sm text-gray-500 font-normal">/ {taskStats.total}</span>
                </div>
                <p className="text-xs text-gray-400">
                  {taskStats.total - taskStats.completed} days remaining
                </p>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-green-500/20 blur-2xl opacity-30" />
              </div>

              {/* Card 3: Estimated Study Time */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <span>Logged Time</span>
                  <Clock className="w-4 h-4 text-brand-blue" />
                </div>
                <div className="text-2xl font-extrabold text-white">
                  ~{taskStats.completed * 2} <span className="text-sm text-gray-500 font-normal">Hours</span>
                </div>
                <p className="text-xs text-gray-400">Estimated ~60 hours total plan</p>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-brand-blue/20 blur-2xl opacity-30" />
              </div>

              {/* Card 4: Study Streak */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <span>Learning Streak</span>
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-2xl font-extrabold text-orange-400 flex items-center gap-1.5">
                  <Flame className="w-6 h-6 fill-current animate-pulse text-orange-500" />
                  <span>{taskStats.completed > 0 ? `${taskStats.completed} Days` : '0 Days'}</span>
                </div>
                <p className="text-xs text-gray-400">Consistency accelerates mastery</p>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-500/20 blur-2xl opacity-30" />
              </div>
            </div>

            {/* 30-Day Interactive Completion Heatmap & Matrix */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-brand-teal" /> 30-Day Interactive Completion Matrix
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Click any day block to inspect its lecture, trigger video tutorials, or update status.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-green-400">
                    <span className="w-3 h-3 rounded-md bg-green-500/30 border border-green-500/50" /> Completed
                  </span>
                  <span className="flex items-center gap-1.5 text-brand-teal">
                    <span className="w-3 h-3 rounded-md bg-brand-teal/20 border border-brand-teal/40" /> In Focus
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <span className="w-3 h-3 rounded-md bg-white/5 border border-white/10" /> Pending
                  </span>
                </div>
              </div>

              {/* 30 Day Blocks Grid (5 Phases x 6 Days) */}
              <div className="space-y-4">
                {roadmap.steps.map((step, sIdx) => (
                  <div key={step.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                      <span className="font-bold text-gray-300">Phase {sIdx + 1}: {step.title}</span>
                      <span>{calculatePhaseProgress(roadmap.id, step)}%</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {step.actionItems?.map((item, iIdx) => {
                        const dayNum = sIdx * 6 + iIdx + 1;
                        const isDone = Boolean(subProgress[`${roadmap.id}_${step.id}`]?.[iIdx]);
                        const isNextFocus = !isDone && (dayNum === 1 || subProgress[`${roadmap.id}_${roadmap.steps[Math.floor((dayNum-2)/6)]?.id}`]?.[(dayNum-2)%6]);
                        const resolvedVideo = resolveLectureVideo(roadmap, step, item, iIdx, sIdx);

                        return (
                          <div
                            key={iIdx}
                            onClick={() => {
                              setActiveDayVideo({
                                ...resolvedVideo,
                                roadmapId: roadmap.id,
                                videoKey: item.text
                              });
                            }}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between min-h-[90px] relative overflow-hidden ${
                              isDone
                                ? 'bg-green-500/15 border-green-500/30 hover:bg-green-500/25'
                                : isNextFocus
                                ? 'bg-brand-teal/15 border-brand-teal/40 hover:bg-brand-teal/25 ring-1 ring-brand-teal/30'
                                : 'bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.06]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-[11px] font-black ${isDone ? 'text-green-400' : isNextFocus ? 'text-brand-teal' : 'text-gray-400'}`}>
                                Day {dayNum}
                              </span>
                              {isDone ? (
                                <CheckCircle className="w-3.5 h-3.5 text-green-400 fill-green-400/20" />
                              ) : isNextFocus ? (
                                <span className="w-2 h-2 rounded-full bg-brand-teal animate-ping" />
                              ) : (
                                <Clock className="w-3 h-3 text-gray-600" />
                              )}
                            </div>

                            <p className="text-[11px] font-semibold text-gray-300 line-clamp-2 leading-tight mt-1">
                              {item.text.split(':')[1]?.trim() || item.text}
                            </p>

                            <div className="flex items-center justify-between text-[9px] text-gray-500 mt-2">
                              <span className="flex items-center gap-0.5 text-red-400 group-hover:text-red-300">
                                <Play className="w-2.5 h-2.5 fill-current" /> Video
                              </span>
                              <span className="text-gray-400 font-bold">{isDone ? '100%' : '0%'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase Breakdown Deep Dive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmap.steps.map((step, sIdx) => {
                const phasePercent = calculatePhaseProgress(roadmap.id, step);
                const isStepComplete = phasePercent === 100;

                return (
                  <div key={step.id} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-lg border border-brand-teal/20">
                        Phase {sIdx + 1}
                      </span>
                      <span className={`text-xs font-bold ${isStepComplete ? 'text-green-400' : 'text-gray-400'}`}>
                        {isStepComplete ? 'Completed ✅' : `${phasePercent}% Done`}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{step.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{step.desc}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isStepComplete ? 'bg-green-500' : roadmap.bgColor} transition-all duration-500`}
                        style={{ width: `${phasePercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <button
                        onClick={() => {
                          setSelectedRoadmap(roadmap.id);
                          setActiveTab('steps');
                          setExpandedStep(step.id);
                        }}
                        className="text-brand-teal hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Phase Tasks</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-gray-500 font-semibold">
                        {step.actionItems?.filter((_, i) => subProgress[`${roadmap.id}_${step.id}`]?.[i]).length || 0} / {step.actionItems?.length || 6} Tasks
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 4: MILESTONES & COMPLETION CERTIFICATE
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === 'certificate' && (
          <div className="space-y-8 animate-fade-in">
            {/* Milestone Badges Grid */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" /> Milestone Badges & Achievements
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Unlock official badges by progressing through the 30-day curriculum.
                  </p>
                </div>
                <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full">
                  {progressPercent}% Unlocked
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Badge 1: 20% */}
                <div className={`p-5 rounded-2xl border text-center space-y-2 transition-all ${
                  progressPercent >= 20 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/[0.02] border-white/5 opacity-50'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-xl">
                    🥉
                  </div>
                  <h4 className="text-sm font-bold text-white">Foundations Unlocked</h4>
                  <p className="text-[11px] text-gray-400">Complete Phase 1 (20% Target)</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${progressPercent >= 20 ? 'text-amber-400 bg-amber-500/20' : 'text-gray-500 bg-white/5'}`}>
                    {progressPercent >= 20 ? 'Unlocked ✨' : 'Locked 🔒'}
                  </span>
                </div>

                {/* Badge 2: 50% */}
                <div className={`p-5 rounded-2xl border text-center space-y-2 transition-all ${
                  progressPercent >= 50 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.02] border-white/5 opacity-50'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto text-xl">
                    🥈
                  </div>
                  <h4 className="text-sm font-bold text-white">Core Competency</h4>
                  <p className="text-[11px] text-gray-400">Complete Phase 3 (50% Target)</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${progressPercent >= 50 ? 'text-blue-400 bg-blue-500/20' : 'text-gray-500 bg-white/5'}`}>
                    {progressPercent >= 50 ? 'Unlocked ✨' : 'Locked 🔒'}
                  </span>
                </div>

                {/* Badge 3: 80% */}
                <div className={`p-5 rounded-2xl border text-center space-y-2 transition-all ${
                  progressPercent >= 80 ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/[0.02] border-white/5 opacity-50'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto text-xl">
                    🥇
                  </div>
                  <h4 className="text-sm font-bold text-white">Production Ready</h4>
                  <p className="text-[11px] text-gray-400">Complete Phase 4 (80% Target)</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${progressPercent >= 80 ? 'text-purple-400 bg-purple-500/20' : 'text-gray-500 bg-white/5'}`}>
                    {progressPercent >= 80 ? 'Unlocked ✨' : 'Locked 🔒'}
                  </span>
                </div>

                {/* Badge 4: 100% */}
                <div className={`p-5 rounded-2xl border text-center space-y-2 transition-all ${
                  progressPercent === 100 ? 'bg-yellow-500/15 border-yellow-500/40 shadow-lg shadow-yellow-500/10' : 'bg-white/[0.02] border-white/5 opacity-50'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 flex items-center justify-center mx-auto text-xl animate-bounce">
                    👑
                  </div>
                  <h4 className="text-sm font-bold text-white">Roadmap Champion</h4>
                  <p className="text-[11px] text-gray-400">Master all 30 Days (100%)</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${progressPercent === 100 ? 'text-yellow-400 bg-yellow-500/20' : 'text-gray-500 bg-white/5'}`}>
                    {progressPercent === 100 ? 'Mastery Certified 🌟' : 'Locked 🔒'}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Certificate Card */}
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-black text-white tracking-wide">Vyomra Verified Certificate of Completion</h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {progressPercent === 100 
                      ? 'Congratulations! You have successfully mastered this entire career roadmap.' 
                      : `Complete all 30 days of this roadmap to unlock your official credential (${progressPercent}% completed).`}
                  </p>
                </div>

                {/* Print and Share Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-brand-dark text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-brand-teal/20"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copiedLink ? 'Link Copied!' : 'Share Credential'}</span>
                  </button>
                </div>
              </div>

              {/* Certificate Template Graphic */}
              <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-black/80 via-slate-900/90 to-black/80 border-2 border-yellow-500/30 text-center space-y-6 relative shadow-2xl">
                <div className="flex justify-between items-center text-xs text-yellow-500/70 uppercase tracking-widest font-extrabold border-b border-yellow-500/20 pb-4">
                  <span>Vyomra Academic & Career Excellence</span>
                  <span>ID: LMX-RDMP-{roadmap.id.toUpperCase()}-2026</span>
                </div>

                <div className="space-y-2 py-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">This is to officially certify that</p>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide underline decoration-brand-teal decoration-2 underline-offset-8">
                    {scholarName}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 pt-3 max-w-lg mx-auto leading-relaxed">
                    has successfully completed the intensive 30-Day curriculum, practical day tasks, and domain examinations for:
                  </p>
                  <h3 className={`text-xl sm:text-2xl font-black ${roadmap.color} pt-2`}>
                    {roadmap.title}
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-yellow-500/20 text-xs text-gray-400">
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] uppercase font-bold text-gray-500">Issued On</p>
                    <p className="font-bold text-white mt-0.5">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[11px] font-bold">
                    <ShieldCheck className="w-5 h-5 text-yellow-400" />
                    <span>VYOMRA VERIFIED ACCREDITATION</span>
                  </div>

                  <div className="text-center sm:text-right">
                    <p className="text-[10px] uppercase font-bold text-gray-500">Authorized By</p>
                    <p className="font-bold text-white mt-0.5">Vyomra Engineering Council</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            DAY TASK VIDEO LECTURE MODAL
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeDayVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="glass-panel w-full max-w-3xl rounded-3xl border border-white/10 p-6 space-y-4 text-left shadow-2xl relative">
              <button 
                onClick={() => setActiveDayVideo(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 pr-10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    🎬 Video Lecture & Walkthrough
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold">{activeDayVideo.roadmapTitle}</span>
                </div>
                <h3 className="text-base font-extrabold text-white">{activeDayVideo.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span>Topic: <strong className="text-brand-teal">{activeDayVideo.stepTitle}</strong></span>
                  <span>•</span>
                  <span>Educator: <strong className="text-gray-300">{activeDayVideo.channel || 'Official Guide'}</strong></span>
                  {activeDayVideo.duration && (
                    <>
                      <span>•</span>
                      <span>Duration: <strong className="text-gray-300">{activeDayVideo.duration}</strong></span>
                    </>
                  )}
                </div>
              </div>

              {/* 16:9 Video Player */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                <iframe
                  src={
                    activeDayVideo.videoUrl.includes('youtube.com/embed')
                      ? activeDayVideo.videoUrl
                      : activeDayVideo.videoUrl.includes('watch?v=')
                      ? `https://www.youtube.com/embed/${activeDayVideo.videoUrl.split('watch?v=')[1]?.split('&')[0]}`
                      : activeDayVideo.videoUrl
                  }
                  title={activeDayVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Modal Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={
                      activeDayVideo.watchUrl ||
                      (activeDayVideo.videoUrl.includes('/embed/')
                        ? `https://www.youtube.com/watch?v=${activeDayVideo.videoUrl.split('/embed/')[1]?.split('?')[0]}`
                        : `https://www.youtube.com/results?search_query=${encodeURIComponent(activeDayVideo.title + ' tutorial')}`)
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/30 transition-all shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-red-500" />
                    <span>Watch on YouTube ↗</span>
                  </a>

                  {activeDayVideo.videoKey && (
                    <button
                      type="button"
                      onClick={() => toggleVideoWatched(activeDayVideo.roadmapId || roadmap.id, activeDayVideo.videoKey)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isVideoWatched(activeDayVideo.roadmapId || roadmap.id, activeDayVideo.videoKey)
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isVideoWatched(activeDayVideo.roadmapId || roadmap.id, activeDayVideo.videoKey) ? 'Watched ✅' : 'Mark as Watched'}</span>
                    </button>
                  )}
                </div>

                {activeDayVideo.notesUrl && (
                  <a
                    href={activeDayVideo.notesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-teal/20 hover:bg-brand-teal/30 text-brand-teal text-xs font-bold border border-brand-teal/30 transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Documentation & Notes</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TOP-LEVEL MAIN ROADMAPS OVERVIEW GRID
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-wide flex items-center gap-2.5">
            Career Roadmap & Skills Mastery <Map className="w-6 h-6 text-brand-teal" />
          </h2>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Industry-aligned 30-day roadmaps, curated video lectures, and completion progress tracking.
          </p>
        </div>

        {/* Global Stats Summary Bar */}
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 p-2 rounded-2xl">
          <div className="px-3 py-1 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-400">Enrolled Paths</span>
            <p className="text-base font-extrabold text-brand-teal">{globalStats.enrolled}</p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="px-3 py-1 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-400">Days Mastered</span>
            <p className="text-base font-extrabold text-green-400">{globalStats.totalDaysCompleted}</p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="px-3 py-1 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-400">Videos Watched</span>
            <p className="text-base font-extrabold text-brand-pink">{globalStats.totalWatchedVideos}</p>
          </div>
        </div>
      </div>

      {/* Global Learning Progress Hero Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-teal/15 text-brand-teal border border-brand-teal/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Vyomra Career Launchpad
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Transform Your Career in 30 Focused Days
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Select any high-demand field below to access structured day-by-day steps, video masterclasses, interactive progress heatmaps, and downloadable certificates.
            </p>
          </div>

          {/* Quick Stats Dial */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 min-w-[240px]">
            <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Global Completion</p>
              <p className="text-2xl font-black text-white">{globalStats.overallPercent}%</p>
              <p className="text-[11px] text-gray-400">{globalStats.totalDaysCompleted} total milestones completed</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand-teal blur-[120px] opacity-15" />
      </div>

      {/* Search and Domain Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All Paths' },
            { id: 'software', label: 'Software & Tech' },
            { id: 'ai-data', label: 'AI & Data' },
            { id: 'cloud-cyber', label: 'Cloud & Cyber' },
            { id: 'mobile-game', label: 'Mobile & Games' },
            { id: 'gate-core', label: 'Core & GATE' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roadmaps & skills..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-all"
          />
        </div>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRoadmaps.map((roadmap) => {
          const Icon = roadmap.icon;
          const progressPercent = calculateProgress(roadmap.id);
          const taskStats = getCompletedTasksCount(roadmap.id);
          const videoCount = roadmap.resources?.videos?.length || 0;
          
          return (
            <div 
              key={roadmap.id}
              onClick={() => {
                setSelectedRoadmap(roadmap.id);
                setActiveTab('steps');
              }}
              className={`glass-panel p-6 rounded-3xl border border-white/10 transition-all duration-300 cursor-pointer group ${roadmap.borderClass} hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between shadow-lg`}
            >
              <div className={`absolute -right-10 -top-10 w-32 h-32 ${roadmap.bgColor} blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${roadmap.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    {progressPercent === 100 ? (
                      <span className="p-1.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                        <Award className="w-4 h-4" />
                      </span>
                    ) : (
                      <div className="p-2 bg-white/5 rounded-full text-gray-400 group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative z-10 space-y-2 mb-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-teal transition-colors">
                    {roadmap.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-2">
                    {roadmap.description}
                  </p>
                </div>

                {/* Features Pill row */}
                <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-6">
                  <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1 font-semibold">
                    <Map className="w-3 h-3 text-brand-teal" /> 5 Phases
                  </span>
                  <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1 font-semibold">
                    <Video className="w-3 h-3 text-brand-pink" /> {videoCount}+ Videos
                  </span>
                  <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3 text-yellow-400" /> 30 Days
                  </span>
                </div>
              </div>

              {/* Progress summary bar */}
              <div className="relative z-10 pt-4 border-t border-white/5 mt-auto">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-gray-400 font-semibold">
                    {taskStats.completed > 0 ? `${taskStats.completed} of ${taskStats.total} Days` : 'Not Started'}
                  </span>
                  <span className={`font-black ${roadmap.color}`}>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${roadmap.bgColor} transition-all duration-1000 ease-out`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
