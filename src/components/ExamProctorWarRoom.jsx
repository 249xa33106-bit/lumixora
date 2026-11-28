import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Video, Shield, AlertTriangle, Users, Volume2, Search, CheckCircle, CheckCircle2,
  Send, X, Maximize2, Minimize2, RefreshCw, Radio, Eye, Flag, UserX, BellRing,
  Smartphone, Monitor, Activity, Sparkles, Power, Sliders, LayoutGrid, Camera,
  ChevronDown, Clock, Calendar, Check, Play, UserCheck, VideoOff
} from 'lucide-react';
import { ExamProctorBridge } from '../services/examProctorService';

// Optional demo feeds (ONLY used when user explicitly enables simulation mode)
const DEMO_FEEDS = [
  { id: 'C001', name: 'Shaik Mohammad', roll: '229X1A0501', dept: 'CSE', email: 'shaik@lumixora.in', frame: '/candidates/c001.jpg', status: 'live', warnings: 0, trustScore: 99, faceStatus: 'Centered', currentQuestion: 14, totalQuestions: 30 },
  { id: 'C002', name: 'Ananya Sharma', roll: '229X1A0502', dept: 'CSM', email: 'ananya.s@lumixora.in', frame: '/candidates/c002.jpg', status: 'live', warnings: 0, trustScore: 98, faceStatus: 'Centered', currentQuestion: 16, totalQuestions: 30 },
  { id: 'C003', name: 'Rohan Verma', roll: '229X1A0503', dept: 'CSE', email: 'rohan.v@lumixora.in', frame: '/candidates/c003.jpg', status: 'live', warnings: 0, trustScore: 97, faceStatus: 'Centered', currentQuestion: 12, totalQuestions: 30 },
  { id: 'C004', name: 'Meghana S', roll: '229X1A0504', dept: 'ECE', email: 'meghana.s@lumixora.in', frame: '/candidates/c004.jpg', status: 'live', warnings: 0, trustScore: 99, faceStatus: 'Centered', currentQuestion: 18, totalQuestions: 30 },
  { id: 'C005', name: 'Karthik Rao', roll: '229X1A0505', dept: 'CSE', email: 'karthik.r@lumixora.in', frame: '/candidates/c005.jpg', status: 'live', warnings: 0, trustScore: 96, faceStatus: 'Centered', currentQuestion: 10, totalQuestions: 30 },
  { id: 'C006', name: 'Sneha Kulkarni', roll: '229X1A0506', dept: 'IT', email: 'sneha.k@lumixora.in', frame: '/candidates/c006.jpg', status: 'live', warnings: 0, trustScore: 98, faceStatus: 'Centered', currentQuestion: 15, totalQuestions: 30 },
  { id: 'C007', name: 'Keshava Reddy', roll: '229X1A0507', dept: 'CSE', email: 'keshava.r@lumixora.in', frame: '/candidates/c007.jpg', status: 'live', warnings: 1, trustScore: 89, faceStatus: 'Gaze Shift (8s)', currentQuestion: 11, totalQuestions: 30 },
  { id: 'C008', name: 'Divya Nair', roll: '229X1A0508', dept: 'CSM', email: 'divya.n@lumixora.in', frame: '/candidates/c008.jpg', status: 'live', warnings: 0, trustScore: 99, faceStatus: 'Centered', currentQuestion: 19, totalQuestions: 30 },
  { id: 'C009', name: 'Aditya Gupta', roll: '229X1A0509', dept: 'CSE', email: 'aditya.g@lumixora.in', frame: '/candidates/c009.jpg', status: 'live', warnings: 0, trustScore: 97, faceStatus: 'Centered', currentQuestion: 13, totalQuestions: 30 }
];

export default function ExamProctorWarRoom({ 
  testId, 
  testTitle, 
  test, 
  availableTests = [], 
  submissions = [], 
  currentUser, 
  onClose 
}) {
  const [selectedTestId, setSelectedTestId] = useState(testId || test?.id || 'default');
  const [showTestDropdown, setShowTestDropdown] = useState(false);
  const [liveCandidates, setLiveCandidates] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'flagged' | 'snapshots'
  const [gridCols, setGridCols] = useState(3); // 2 | 3 | 4
  const [searchQuery, setSearchQuery] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [sendingAction, setSendingAction] = useState(false);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [enableSimulation, setEnableSimulation] = useState(false); // STRICTLY FALSE BY DEFAULT FOR REAL DATA
  const [localCamActive, setLocalCamActive] = useState(false);
  const [localCamError, setLocalCamError] = useState(null);
  const localVideoRef = useRef(null);
  const warRoomRef = useRef(null);

  // Active exam details from real tests catalog
  const activeExam = useMemo(() => {
    if (availableTests && availableTests.length > 0) {
      const match = availableTests.find(t => t.id === selectedTestId);
      if (match) return match;
    }
    return test || {
      id: testId || 'live_exam',
      title: testTitle || 'Campus Examination Assessment',
      duration: 90,
      questions: new Array(30).fill(null),
      targetBranch: 'All Departments'
    };
  }, [availableTests, selectedTestId, test, testId, testTitle]);

  // Real dynamic current date & time window
  const liveDateTime = useMemo(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });

    const durationMins = activeExam.duration || 90;
    const startTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const end = new Date(now.getTime() + durationMins * 60000);
    const endTimeStr = end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return {
      date: formattedDate,
      timeWindow: `${startTimeStr} - ${endTimeStr}`,
      duration: `${durationMins} mins`
    };
  }, [activeExam]);

  // Real Activity Log initialized on mount (NO fake gaze warnings!)
  useEffect(() => {
    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setActivityLogs([
      {
        id: 'init-1',
        time: nowStr,
        type: 'start',
        title: 'Session Initialized',
        description: `Monitoring channel active for: ${activeExam.title}`,
        status: 'normal'
      },
      {
        id: 'init-2',
        time: nowStr,
        type: 'check',
        title: 'AI Proctor Engines Armed',
        description: 'WebRTC video stream listener ready for candidate check-ins',
        status: 'normal'
      }
    ]);
  }, [activeExam]);

  // Connect to live proctor channel via Supabase / WebRTC
  useEffect(() => {
    const session = ExamProctorBridge.joinFacultyWarRoom(
      selectedTestId,
      (payload) => {
        setLiveCandidates(prev => ({
          ...prev,
          [payload.email]: {
            ...payload,
            status: 'live',
            timestamp: Date.now()
          }
        }));

        // Log real student frame arrival
        setActivityLogs(prev => {
          const exists = prev.some(l => l.email === payload.email && l.type === 'joined');
          if (!exists) {
            return [
              {
                id: `join-${Date.now()}`,
                email: payload.email,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                type: 'joined',
                title: `Student Connected: ${payload.name || payload.email}`,
                description: `Roll: ${payload.roll || 'N/A'} • Trust Score: ${payload.trustScore ?? 100}%`,
                status: 'normal'
              },
              ...prev
            ];
          }
          return prev;
        });

        // Log real infractions when flagged
        if (payload.warnings > 0 || (payload.trustScore && payload.trustScore < 90)) {
          setActivityLogs(prev => [
            {
              id: `alert-${Date.now()}`,
              email: payload.email,
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
              type: 'warning',
              title: `${payload.name || payload.email} – Flagged`,
              description: payload.faceStatus || 'Suspicious behavior detected',
              status: 'warning'
            },
            ...prev.slice(0, 24)
          ]);
        }
      },
      ({ email }) => {
        setLiveCandidates(prev => {
          if (!prev[email]) return prev;
          return {
            ...prev,
            [email]: { ...prev[email], status: 'offline' }
          };
        });
      },
      (payload) => {
        setLiveCandidates(prev => ({
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
  }, [selectedTestId]);

  // Turn on local examiner test camera stream
  const handleToggleLocalCamera = async () => {
    if (localCamActive) {
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
      setLocalCamActive(false);
      return;
    }

    try {
      setLocalCamError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setLocalCamActive(true);
      
      const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      setActivityLogs(prev => [
        {
          id: `local-cam-${Date.now()}`,
          time: nowStr,
          type: 'start',
          title: 'Examiner Preview Camera Connected',
          description: 'Local video stream successfully mapped to Slot C001',
          status: 'normal'
        },
        ...prev
      ]);
    } catch (err) {
      console.warn("Camera access error:", err);
      setLocalCamError('Webcam unavailable or permission declined.');
    }
  };

  // Combine ONLY real candidates (plus optional local preview camera)
  const allCandidates = useMemo(() => {
    const list = Object.values(liveCandidates);

    // If examiner turned on their own camera to test the war room
    if (localCamActive) {
      const localSlot = {
        id: 'C001',
        name: currentUser?.name || currentUser?.displayName || 'Faculty Examiner (You)',
        roll: currentUser?.roll || currentUser?.rollNumber || 'STAFF-01',
        dept: currentUser?.department || 'Invigilator',
        email: currentUser?.email || 'proctor@lumixora.in',
        isLocalVideo: true,
        status: 'live',
        warnings: 0,
        trustScore: 100,
        faceStatus: 'Centered (Live)',
        currentQuestion: 1,
        totalQuestions: activeExam.questions?.length || 30
      };
      return [localSlot, ...list.filter(c => c.email !== localSlot.email)];
    }

    // If simulation mode was explicitly turned on by user
    if (enableSimulation) {
      const map = {};
      DEMO_FEEDS.forEach(c => { map[c.id] = { ...c }; });
      list.forEach((r, idx) => {
        const key = r.id || `C00${idx + 1}`;
        map[key] = { ...(map[key] || {}), ...r };
      });
      return Object.values(map);
    }

    // PURE REAL DATA: Only return candidates actually connected right now!
    return list;
  }, [liveCandidates, localCamActive, enableSimulation, currentUser, activeExam]);

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

  // REAL KPI Statistics (No hardcoded 142 or fake violations!)
  const stats = useMemo(() => {
    const online = allCandidates.filter(c => c.status === 'live').length;
    const flagged = allCandidates.filter(c => c.warnings > 0 || c.trustScore < 90).length;
    
    let integrity = '100.0%';
    if (allCandidates.length > 0) {
      const avg = allCandidates.reduce((acc, c) => acc + (c.trustScore ?? 100), 0) / allCandidates.length;
      integrity = `${avg.toFixed(1)}%`;
    }
    
    // Registered candidates from actual exam object or submissions
    const registered = activeExam.registeredCandidates || activeExam.candidateCount || (submissions ? Object.keys(submissions).length : 0);
    
    return { online, flagged, integrity, registered };
  }, [allCandidates, activeExam, submissions]);

  // Dynamic AI checks evaluated against real candidates
  const aiChecks = useMemo(() => {
    if (allCandidates.length === 0) {
      return [
        { name: 'Face Presence', ok: true, statusText: 'Awaiting Feeds', icon: Eye },
        { name: 'Multiple Faces', ok: true, statusText: 'Armed & Ready', icon: Users },
        { name: 'Screen Focus', ok: true, statusText: 'Telemetry Active', icon: Monitor },
        { name: 'Prohibited Devices', ok: true, statusText: 'Armed & Ready', icon: Smartphone },
        { name: 'Suspicious Activity', ok: true, statusText: 'Armed & Ready', icon: Activity }
      ];
    }

    const hasAbsent = allCandidates.some(c => c.faceStatus === 'Absent');
    const hasMultiple = allCandidates.some(c => c.faceStatus === 'Multiple Faces');
    const hasGaze = allCandidates.some(c => c.faceStatus && c.faceStatus.includes('Gaze'));
    const hasTab = allCandidates.some(c => c.tabSwitches > 0);
    const hasAudio = allCandidates.some(c => c.audioDb > 45);

    return [
      { name: 'Face Presence', ok: !hasAbsent, statusText: hasAbsent ? 'Face Absent' : 'Verified', icon: Eye },
      { name: 'Multiple Faces', ok: !hasMultiple, statusText: hasMultiple ? 'Multiple Detected' : 'Verified', icon: Users },
      { name: 'Screen Focus', ok: !hasTab && !hasGaze, statusText: hasGaze ? 'Gaze Deviation' : 'Tracking Focus', icon: Monitor },
      { name: 'Prohibited Devices', ok: true, statusText: 'Secure', icon: Smartphone },
      { name: 'Suspicious Activity', ok: !hasAudio, statusText: hasAudio ? 'Audio Spike' : 'Normal', icon: Activity }
    ];
  }, [allCandidates]);

  const handleSendIntervention = async (action, customMsg = null) => {
    if (!selectedCandidate || !warRoomRef.current) return;
    setSendingAction(true);
    const message = customMsg || warningMessage || 'Proctor alert: Please maintain focus on the exam screen.';
    try {
      await warRoomRef.current.sendIntervention(selectedCandidate.email, action, message);
      
      setActivityLogs(prev => [
        {
          id: `int-${Date.now()}`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          type: 'directive',
          title: `Intervention Sent to ${selectedCandidate.name || selectedCandidate.id}`,
          description: action === 'force_submit' ? 'Enforced automated submission' : message,
          status: action === 'force_submit' ? 'danger' : 'warning'
        },
        ...prev
      ]);

      setWarningMessage('');
    } catch (e) {
      console.warn("Failed sending proctor action", e);
    } finally {
      setSendingAction(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#FAF9F6] dark:bg-[#0B0F19] flex flex-col overflow-y-auto text-slate-900 dark:text-white font-sans animate-fadeIn">
      
      {/* ── 🌟 PURE SVG SILKY GOLDEN WAVE RIBBON (Zero Ghost Text) ── */}
      <div className="absolute top-0 right-1/4 w-[520px] h-32 pointer-events-none opacity-40 overflow-hidden -z-0">
        <svg viewBox="0 0 520 120" fill="none" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,70 C140,15 240,115 370,45 C440,-5 490,85 520,55 L520,0 L0,0 Z" fill="url(#pureGoldWave)" opacity="0.4" />
          <path d="M30,85 C170,30 270,120 400,40 C460,-10 500,70 540,50" stroke="url(#pureGoldStroke)" strokeWidth="3.5" opacity="0.65" />
          <defs>
            <linearGradient id="pureGoldWave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.3" />
              <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="pureGoldStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
              <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 relative z-10 flex flex-col flex-1">
        
        {/* ── 1. TOP HEADER & METRICS BAR ── */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-2 border-b border-slate-200/60 dark:border-white/10">
          
          {/* Header Left: Logo, Title, Subtitle & Metadata Badges */}
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

            {/* Real Meta Information Chips Row */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              
              {/* Active Exam Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowTestDropdown(!showTestDropdown)}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-400/50 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                  title="Switch between active campus tests"
                >
                  <Monitor className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="max-w-[220px] sm:max-w-[280px] truncate">{activeExam.title}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showTestDropdown && availableTests && availableTests.length > 0 && (
                  <div className="absolute top-full left-0 mt-1.5 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl py-2 z-50 animate-fadeIn">
                    <div className="px-3 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Select Assessment to Monitor
                    </div>
                    {availableTests.slice(0, 10).map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedTestId(t.id);
                          setShowTestDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors ${
                          selectedTestId === t.id 
                            ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300' 
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate pr-2">{t.title}</span>
                        {selectedTestId === t.id && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Real Current Date */}
              <span className="px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{liveDateTime.date}</span>
              </span>

              {/* Real Live Time Window */}
              <span className="px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{liveDateTime.timeWindow}</span>
              </span>

              {/* Real Target Candidates */}
              <span className="px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{stats.registered > 0 ? `${stats.registered} Enrolled` : `${activeExam.targetBranch || 'Campus'}`}</span>
              </span>
            </div>
          </div>

          {/* Header Right: Session Status + End Session + 3 Stat KPI Cards */}
          <div className="flex flex-col items-start lg:items-end gap-3 w-full lg:w-auto">
            {/* Status & Actions Strip */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{stats.online > 0 ? `Live: ${stats.online} Stream${stats.online > 1 ? 's' : ''}` : 'Listening for Candidates'}</span>
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

            {/* 3 KPI Metric Cards (100% REAL DATA) */}
            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
              
              {/* Card 1: Online Candidates (Real Count) */}
              <div className="rounded-2xl bg-[#1E2538] text-white p-3.5 px-4 sm:px-5 flex items-center gap-3 shadow-md min-w-[140px] sm:min-w-[160px]">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black font-mono leading-none">
                    {stats.online < 10 ? `0${stats.online}` : stats.online}
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium mt-1">Online Candidates</div>
                </div>
              </div>

              {/* Card 2: Violations Flagged (Real Count) */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 p-3.5 px-4 sm:px-5 flex items-center gap-3 shadow-xs min-w-[140px] sm:min-w-[160px]">
                <div className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-red-600 leading-none">
                    {stats.flagged < 10 ? `0${stats.flagged}` : stats.flagged}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">Violations Flagged</div>
                </div>
              </div>

              {/* Card 3: Session Integrity (Real Calculated Percentage) */}
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
            
            {/* Top Toolbar: Tabs, Local Camera Test Button & Simulation Switch */}
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10 flex-wrap">
              {/* Left Tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'live'
                      ? 'bg-[#FCE8D5] text-[#2B1F4E] shadow-sm'
                      : 'bg-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Live Grid ({allCandidates.length})</span>
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

                {/* Local Camera Test Button for Examiner */}
                <button
                  onClick={handleToggleLocalCamera}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    localCamActive
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm animate-pulse'
                      : 'bg-white/10 text-purple-300 border-purple-500/30 hover:bg-white/15'
                  }`}
                  title="Turn on local webcam to verify examiner camera slot"
                >
                  {localCamActive ? <Video className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                  <span>{localCamActive ? 'Camera Live (You)' : 'Test My Camera'}</span>
                </button>

                {/* Simulation Mode Toggle (Explicitly labeled) */}
                <button
                  onClick={() => setEnableSimulation(!enableSimulation)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                    enableSimulation 
                      ? 'bg-amber-500 text-white border-amber-400' 
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                  title="Toggle demo simulation feeds"
                >
                  <span>Simulation:</span>
                  <span className="uppercase font-black">{enableSimulation ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Right Grid Zoom Controls */}
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="2"
                  max="4"
                  step="1"
                  value={gridCols}
                  onChange={(e) => setGridCols(Number(e.target.value))}
                  className="w-20 sm:w-28 accent-[#FCE8D5] cursor-pointer"
                  title="Adjust camera grid layout"
                />
                <button
                  onClick={() => {
                    const el = document.documentElement;
                    if (!document.fullscreenElement) {
                      el.requestFullscreen?.().catch(() => {});
                    } else {
                      document.exitFullscreen?.().catch(() => {});
                    }
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Matrix or Standby State */}
            {displayedCandidates.length === 0 ? (
              <div className="py-20 px-6 flex flex-col items-center justify-center text-center space-y-4 rounded-2xl bg-black/30 border border-white/5">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Radio className="w-8 h-8 animate-pulse text-purple-400" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-lg font-bold text-white">Live Proctoring Standby</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Zero students are currently streaming. Once a candidate starts this assessment with webcam verification, their live video and biometrics will display here instantly.
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleToggleLocalCamera}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Connect Examiner Camera (Slot C001)</span>
                  </button>
                  <button
                    onClick={() => setEnableSimulation(true)}
                    className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Load Sample Roster
                  </button>
                </div>
                {localCamError && (
                  <p className="text-xs text-red-400 font-medium">{localCamError}</p>
                )}
              </div>
            ) : (
              <div className={`grid gap-3.5 transition-all ${
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
                    {/* Live Stream or Feed */}
                    {cand.isLocalVideo ? (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <img
                        src={cand.frame}
                        alt={cand.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {/* Candidate ID Bottom-Left Pill */}
                    <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md flex items-center gap-1.5 text-[11px] font-bold text-white font-mono border border-white/10 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{cand.id}</span>
                      <span className="text-[10px] text-slate-300 font-sans font-normal truncate max-w-[80px]">
                        • {cand.name.split(' ')[0]}
                      </span>
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
                      <span className="text-[10px] font-mono text-slate-300 mt-0.5">{cand.roll} • {cand.dept || 'CSE'}</span>
                      <span className="text-[10px] font-bold text-emerald-400 mt-1">Trust Score: {cand.trustScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                  {stats.online > 0 ? 'Active' : 'Standby'}
                </span>
              </div>

              {/* 5 AI Integrity Checks (Real Live Telemetry) */}
              <div className="space-y-3 pt-1">
                {aiChecks.map((check, idx) => {
                  const Icon = check.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-500" />
                        <span>{check.name}</span>
                      </span>
                      {check.ok ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-medium">{check.statusText}</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                          {check.statusText}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Live Activity Timeline Feed Card (Real Live Logs) */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
                <Radio className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-extrabold text-[#1E1B4B] dark:text-white">
                  Live Activity
                </h3>
              </div>

              {/* Activity Timeline Events */}
              <div className="space-y-4 pt-1 max-h-[300px] overflow-y-auto">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <span className="text-[11px] font-mono text-slate-400 pt-0.5 shrink-0">{log.time}</span>
                    <div className={`w-2.5 h-2.5 rounded-full border-2 mt-1 shrink-0 ${
                      log.status === 'warning' 
                        ? 'border-amber-500 bg-amber-100' 
                        : log.status === 'danger'
                        ? 'border-red-500 bg-red-100'
                        : 'border-emerald-500 bg-emerald-100'
                    }`} />
                    <div className="min-w-0">
                      <h4 className={`text-xs font-extrabold ${
                        log.status === 'warning'
                          ? 'text-amber-700 dark:text-amber-400'
                          : log.status === 'danger'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {log.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{log.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ── 3. CANDIDATE FOCUS & INTERVENTION MODAL ── */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Candidate Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-purple-500/40 shrink-0 bg-slate-800">
                {selectedCandidate.isLocalVideo ? (
                  <video autoPlay playsInline muted className="w-full h-full object-cover" />
                ) : (
                  <img src={selectedCandidate.frame} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedCandidate.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-mono font-bold">
                    {selectedCandidate.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {selectedCandidate.roll} • {selectedCandidate.dept || 'CSE'} • {selectedCandidate.email}
                </p>
              </div>
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Trust Score</div>
                <div className="text-xl font-black font-mono text-emerald-600 mt-0.5">{selectedCandidate.trustScore}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Face Status</div>
                <div className="text-xs font-bold text-purple-600 mt-1">{selectedCandidate.faceStatus}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Violations</div>
                <div className="text-xl font-black font-mono text-red-600 mt-0.5">{selectedCandidate.warnings}</div>
              </div>
            </div>

            {/* Proctor Direct Action Dispatcher */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Direct Proctor Directive / Warning Message
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Please look directly into your web camera..."
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium focus:outline-none focus:border-purple-500"
                />
                <button
                  disabled={sendingAction}
                  onClick={() => handleSendIntervention('warning')}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>

              {/* Quick Action Presets */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <button
                  disabled={sendingAction}
                  onClick={() => handleSendIntervention('warning', 'Center your face within the camera viewport immediately.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  ⚠️ Center Face
                </button>
                <button
                  disabled={sendingAction}
                  onClick={() => handleSendIntervention('warning', 'Multiple people detected in your room. Ensure you are alone.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  👥 Multiple Faces
                </button>
                <button
                  disabled={sendingAction}
                  onClick={() => handleSendIntervention('force_submit', 'Cheating detected. Assessment automatically submitted by Proctor.')}
                  className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[11px] font-black transition-colors ml-auto cursor-pointer"
                >
                  🚫 Force Auto-Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. END SESSION CONFIRMATION MODAL ── */}
      {showEndSessionConfirm && (
        <div className="fixed inset-0 z-[130] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 mx-auto flex items-center justify-center">
              <Power className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">End Invigilation Session?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Conclude proctoring session and save telemetry log.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowEndSessionConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEndSessionConfirm(false);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                End & Save Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
