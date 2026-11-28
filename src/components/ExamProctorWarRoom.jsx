import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Video, Shield, AlertTriangle, Users, Volume2, Search, CheckCircle, CheckCircle2,
  Send, X, Maximize2, Minimize2, RefreshCw, Radio, Eye, Flag, UserX, BellRing,
  Smartphone, Monitor, Activity, Sparkles, Power, Sliders, LayoutGrid, Camera
} from 'lucide-react';
import { ExamProctorBridge } from '../services/examProctorService';

// Default 9 Candidate Profiles (C001 - C009) matching exact visual feed
const DEFAULT_CANDIDATE_FEEDS = [
  { id: 'C001', name: 'Aarav Patel', roll: '229X1A0501', email: 'c001@lumixora.in', frame: '/candidates/c001.jpg', status: 'live', warnings: 0, trustScore: 99, faceStatus: 'Centered', currentQuestion: 12, totalQuestions: 30 },
  { id: 'C002', name: 'Ananya Sharma', roll: '229X1A0502', email: 'c002@lumixora.in', frame: '/candidates/c002.jpg', status: 'live', warnings: 0, trustScore: 98, faceStatus: 'Centered', currentQuestion: 14, totalQuestions: 30 },
  { id: 'C003', name: 'Rohan Verma', roll: '229X1A0503', email: 'c003@lumixora.in', frame: '/candidates/c003.jpg', status: 'live', warnings: 0, trustScore: 97, faceStatus: 'Centered', currentQuestion: 11, totalQuestions: 30 },
  { id: 'C004', name: 'Pooja Reddy', roll: '229X1A0504', email: 'c004@lumixora.in', frame: '/candidates/c004.jpg', status: 'live', warnings: 0, trustScore: 99, faceStatus: 'Centered', currentQuestion: 16, totalQuestions: 30 },
  { id: 'C005', name: 'Karthik Rao', roll: '229X1A0505', email: 'c005@lumixora.in', frame: '/candidates/c005.jpg', status: 'live', warnings: 0, trustScore: 96, faceStatus: 'Centered', currentQuestion: 9, totalQuestions: 30 },
  { id: 'C006', name: 'Sneha Kulkarni', roll: '229X1A0506', email: 'c006@lumixora.in', frame: '/candidates/c006.jpg', status: 'live', warnings: 0, trustScore: 98, faceStatus: 'Centered', currentQuestion: 15, totalQuestions: 30 },
  { id: 'C007', name: 'Vikram Joshi', roll: '229X1A0507', email: 'c007@lumixora.in', frame: '/candidates/c007.jpg', status: 'live', warnings: 1, trustScore: 89, faceStatus: 'Gaze Shift (8s)', currentQuestion: 10, totalQuestions: 30 },
  { id: 'C008', name: 'Divya Nair', roll: '229X1A0508', email: 'c008@lumixora.in', frame: '/candidates/c008.jpg', status: 'live', warnings: 0, trustScore: 99, faceStatus: 'Centered', currentQuestion: 18, totalQuestions: 30 },
  { id: 'C009', name: 'Aditya Gupta', roll: '229X1A0509', email: 'c009@lumixora.in', frame: '/candidates/c009.jpg', status: 'live', warnings: 0, trustScore: 97, faceStatus: 'Centered', currentQuestion: 13, totalQuestions: 30 }
];

export default function ExamProctorWarRoom({ testId, testTitle, onClose }) {
  const [candidates, setCandidates] = useState({}); // Live real candidates from WebRTC channel
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'flagged' | 'snapshots'
  const [gridCols, setGridCols] = useState(3); // 2 | 3 | 4
  const [searchQuery, setSearchQuery] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [sendingAction, setSendingAction] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);
  const warRoomRef = useRef(null);

  // Auto clean up stale candidates after 15 seconds of no frames
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCandidates(prev => {
        let changed = false;
        const next = { ...prev };
        Object.keys(next).forEach(email => {
          if (now - next[email].timestamp > 15000) {
            next[email] = { ...next[email], status: 'disconnected' };
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Connect to live proctor channel
  useEffect(() => {
    if (!testId) return;

    const session = ExamProctorBridge.joinFacultyWarRoom(
      testId,
      (payload) => {
        setCandidates(prev => ({
          ...prev,
          [payload.email]: {
            ...payload,
            status: 'live',
            timestamp: Date.now()
          }
        }));
      },
      ({ email }) => {
        setCandidates(prev => {
          if (!prev[email]) return prev;
          return {
            ...prev,
            [email]: { ...prev[email], status: 'offline' }
          };
        });
      },
      (payload) => {
        setCandidates(prev => ({
          ...prev,
          [payload.email]: {
            ...prev[payload.email],
            ...payload,
            status: 'connecting',
            timestamp: Date.now()
          }
        }));
      }
    );

    warRoomRef.current = session;

    return () => {
      if (warRoomRef.current) {
        warRoomRef.current.leaveWarRoom();
      }
    };
  }, [testId]);

  // Combine real candidates with default demonstration feeds
  const allCandidates = useMemo(() => {
    const realList = Object.values(candidates);
    if (realList.length === 0) {
      return DEFAULT_CANDIDATE_FEEDS;
    }
    // Merge real ones with default feeds for full grid coverage
    const map = {};
    DEFAULT_CANDIDATE_FEEDS.forEach(c => { map[c.id] = c; });
    realList.forEach((r, idx) => {
      const key = r.id || `C00${idx + 1}`;
      map[key] = { ...(map[key] || {}), ...r };
    });
    return Object.values(map);
  }, [candidates]);

  // Filtered candidate list based on active tab and search
  const displayedCandidates = useMemo(() => {
    return allCandidates.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchSearch = (c.name?.toLowerCase() || '').includes(q) || 
                          (c.email?.toLowerCase() || '').includes(q) || 
                          (c.id?.toLowerCase() || '').includes(q) ||
                          (c.roll?.toLowerCase() || '').includes(q);
      if (!matchSearch) return false;
      if (activeTab === 'flagged') return c.warnings > 0 || c.trustScore < 90;
      return true;
    });
  }, [allCandidates, searchQuery, activeTab]);

  const stats = useMemo(() => {
    const total = 142; // Corporate cohort standard
    const flagged = 3;
    const integrity = '98.6%';
    return { total, flagged, integrity };
  }, []);

  const handleSendIntervention = async (action, customMsg = null) => {
    if (!selectedCandidate || !warRoomRef.current) return;
    setSendingAction(true);
    try {
      await warRoomRef.current.sendIntervention(
        selectedCandidate.email,
        action,
        customMsg || warningMessage || 'Proctor has flagged your activity. Please focus on the screen.'
      );
      setWarningMessage('');
    } catch (e) {
      console.warn("Failed sending proctor action", e);
    } finally {
      setSendingAction(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#FAF9F6] dark:bg-[#0B0F19] flex flex-col overflow-y-auto text-slate-900 dark:text-white font-sans animate-fadeIn">
      {/* ── 🌟 SILKY GOLDEN HEADER WAVE RIBBON ── */}
      <div className="absolute top-0 left-1/4 w-[420px] h-32 pointer-events-none opacity-40 -z-0">
        <img src="/invigilation_header_wave.png" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 relative z-10 flex flex-col flex-1">
        
        {/* ── 1. TOP HEADER & KPI METRICS BAR ── */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-2 border-b border-slate-200/60 dark:border-white/10">
          {/* Header Left: Logo, Title, Subtitle & Chips */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {/* Lumixora Brand Emblem */}
              <div className="flex items-center gap-2">
                <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                  <path d="M6 26L16 6L26 26H6Z" stroke="#1E1B4B" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M16 14L22 26H10L16 14Z" fill="#7553E8" />
                </svg>
                <span className="text-xl font-black text-[#1E1B4B] dark:text-white tracking-tight">Lumixora</span>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E1B4B] dark:text-white tracking-tight leading-tight">
                Live Invigilation
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Real-time proctoring • AI-assisted monitoring • Exam integrity
              </p>
            </div>

            {/* Meta Information Chips Row */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{testTitle || 'Campus Examination'}</span>
              </span>

              <span className="px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs flex items-center gap-2">
                <span>📅</span>
                <span>24 Nov 2026</span>
              </span>

              <span className="px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs flex items-center gap-2">
                <span>⏱</span>
                <span>10:00 AM - 12:00 PM</span>
              </span>

              <span className="px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>142 Candidates</span>
              </span>
            </div>
          </div>

          {/* Header Right: Session Status + End Session + 3 Stat KPI Cards */}
          <div className="flex flex-col items-start lg:items-end gap-3 w-full lg:w-auto">
            {/* Status & Actions Strip */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Session in Progress</span>
              </span>

              <button
                onClick={() => setShowEndSessionConfirm(true)}
                className="px-4 py-1.5 rounded-full border border-red-200 hover:border-red-400 bg-white hover:bg-red-50 dark:bg-white/5 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Power className="w-3.5 h-3.5" />
                <span>End Session</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-600 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer ml-1"
                title="Exit War Room"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3 KPI Metric Cards */}
            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
              {/* Card 1: Online Candidates (Dark Navy) */}
              <div className="rounded-2xl bg-[#1E2538] text-white p-3.5 px-4 sm:px-5 flex items-center gap-3 shadow-md min-w-[140px] sm:min-w-[160px]">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black font-mono leading-none">{stats.total}</div>
                  <div className="text-[11px] text-slate-300 font-medium mt-1">Online Candidates</div>
                </div>
              </div>

              {/* Card 2: Violations Flagged (White Card, Red Alert) */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 p-3.5 px-4 sm:px-5 flex items-center gap-3 shadow-xs min-w-[140px] sm:min-w-[160px]">
                <div className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-red-600 leading-none">0{stats.flagged}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">Violations Flagged</div>
                </div>
              </div>

              {/* Card 3: Session Integrity (White Card, Green Shield) */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30 p-3.5 px-4 sm:px-5 flex items-center gap-3 shadow-xs min-w-[140px] sm:min-w-[160px]">
                <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-emerald-600 leading-none">{stats.integrity}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">Session Integrity</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. MAIN INVIGILATION GRID & SIDEBAR SPLIT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          
          {/* ── LEFT SECTION (70% WIDTH): DARK VIDEO MATRIX CONTAINER ── */}
          <div className="lg:col-span-8 xl:col-span-8 rounded-3xl bg-[#181E29] p-4 sm:p-5 shadow-2xl border border-slate-800 text-white flex flex-col space-y-4">
            
            {/* Top Toolbar: Tabs on Left, Zoom Slider & Fullscreen on Right */}
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10 flex-wrap">
              {/* Left Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'live'
                      ? 'bg-[#FCE8D5] text-[#2B1F4E] shadow-sm'
                      : 'bg-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Live Grid</span>
                </button>

                <button
                  onClick={() => setActiveTab('flagged')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'flagged'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-white/10 text-red-400 hover:bg-white/15'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Flagged ({stats.flagged})</span>
                </button>

                <button
                  onClick={() => setActiveTab('snapshots')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'snapshots'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Snapshots</span>
                </button>
              </div>

              {/* Right Controls: Grid Icon, Zoom Slider & Fullscreen Toggle */}
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 text-slate-400" />
                
                {/* Grid Size Slider */}
                <input
                  type="range"
                  min="2"
                  max="4"
                  value={gridCols}
                  onChange={(e) => setGridCols(Number(e.target.value))}
                  className="w-20 sm:w-24 accent-[#FCE8D5] cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  title={`Grid Columns: ${gridCols}`}
                />

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 3x3 Live Video Feeds Matrix (9 Cameras) */}
            <div className={`grid gap-3 ${
              gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' :
              gridCols === 4 ? 'grid-cols-2 sm:grid-cols-4' :
              'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
            }`}>
              {displayedCandidates.map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidate(cand)}
                  className="group relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-white/5 hover:border-purple-400/80 transition-all cursor-pointer shadow-md"
                >
                  {/* Candidate Camera Stream */}
                  <img
                    src={cand.frame}
                    alt={cand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Candidate ID Bottom-Left Pill */}
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md flex items-center gap-1.5 text-[11px] font-bold text-white font-mono border border-white/10 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{cand.id}</span>
                  </div>

                  {/* Warning Indicator if Flagged */}
                  {cand.warnings > 0 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Flagged</span>
                    </div>
                  )}

                  {/* Hover Overlay with Student Details */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-3 text-center pointer-events-none">
                    <span className="text-xs font-bold text-white">{cand.name}</span>
                    <span className="text-[10px] font-mono text-slate-300 mt-0.5">{cand.roll}</span>
                    <span className="text-[10px] font-bold text-emerald-400 mt-1">Trust Score: {cand.trustScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT SECTION (30% WIDTH): AI MONITORING & LIVE ACTIVITY ── */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-6">
            
            {/* 1. AI Monitoring Status Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-base font-extrabold text-[#1E1B4B] dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>AI Monitoring</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 text-[11px] font-bold">
                  Active
                </span>
              </div>

              {/* 5 AI Integrity Checks */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-2.5">
                    <Eye className="w-4 h-4 text-slate-500" />
                    <span>Face Presence</span>
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>Multiple Faces</span>
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-2.5">
                    <Monitor className="w-4 h-4 text-slate-500" />
                    <span>Screen Focus</span>
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-slate-500" />
                    <span>Prohibited Devices</span>
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-slate-500" />
                    <span>Suspicious Activity</span>
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </div>

            {/* 2. Live Activity Timeline Feed Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
                <Radio className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-extrabold text-[#1E1B4B] dark:text-white">
                  Live Activity
                </h3>
              </div>

              {/* Activity Timeline Events */}
              <div className="space-y-4 pt-1">
                {/* Event 1 */}
                <div className="flex items-start gap-3">
                  <span className="text-[11px] font-mono text-slate-400 pt-0.5 shrink-0">10:00 AM</span>
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-emerald-100 mt-1 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Session Started</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Live invigilation is now active</p>
                  </div>
                </div>

                {/* Event 2 (Gaze Warning) */}
                <div className="flex items-start gap-3">
                  <span className="text-[11px] font-mono text-slate-400 pt-0.5 shrink-0">10:12 AM</span>
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-amber-100 mt-1 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-amber-700 dark:text-amber-400">Candidate C074 – Gaze Warning</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Looked away for 8 seconds</p>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="flex items-start gap-3">
                  <span className="text-[11px] font-mono text-slate-400 pt-0.5 shrink-0">10:27 AM</span>
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-emerald-100 mt-1 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">All Checks Normal</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">No active violations</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── 3. CANDIDATE FOCUS & INTERVENTION POPUP ── */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col text-white">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-black text-sm text-white">
                  {selectedCandidate.id}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedCandidate.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedCandidate.email} • Roll: {selectedCandidate.roll}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Large Camera Feed + Status */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                <img 
                  src={selectedCandidate.frame} 
                  alt={selectedCandidate.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold tracking-wider">
                  LIVE SURVEILLANCE
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-emerald-400">
                  {selectedCandidate.id}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-white/5 text-xs">
                    <span className="text-slate-400">Proctor Trust Score:</span>
                    <span className="font-bold text-emerald-400 text-sm">{selectedCandidate.trustScore}%</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-white/5 text-xs">
                    <span className="text-slate-400">Recorded Violations:</span>
                    <span className={`font-bold ${selectedCandidate.warnings > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {selectedCandidate.warnings} of 3 Strikes
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-white/5 text-xs">
                    <span className="text-slate-400">Face Framing:</span>
                    <span className="font-bold text-slate-200 capitalize">{selectedCandidate.faceStatus || 'Centered'}</span>
                  </div>
                </div>

                {/* Instant Actions */}
                <div className="mt-4 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Send live instruction to student..."
                      value={warningMessage}
                      onChange={(e) => setWarningMessage(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={() => handleSendIntervention('warning')}
                      disabled={sendingAction}
                      className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      Warn
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to FORCE-SUBMIT the examination for ${selectedCandidate.name}?`)) {
                        handleSendIntervention('force_submit', 'Examination terminated by Faculty Invigilator due to integrity policy violation.');
                        setSelectedCandidate(null);
                      }
                    }}
                    disabled={sendingAction}
                    className="w-full py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/30 hover:border-red-600 text-red-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserX className="w-4 h-4" />
                    Force Auto-Submit Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. END SESSION CONFIRMATION MODAL ── */}
      {showEndSessionConfirm && (
        <div className="fixed inset-0 z-[140] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
                <Power className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">End Invigilation Session?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">All candidate streams will disconnect and final integrity audits will be archived.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEndSessionConfirm(false)}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEndSessionConfirm(false);
                  onClose();
                }}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-red-600/30"
              >
                Confirm End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
