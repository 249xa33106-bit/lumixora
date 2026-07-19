import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Play, Pause, Square, SkipForward, BookOpen, Target, Clock, Zap, Flame,
  TrendingUp, Award, BarChart2, Coffee, Brain, Sparkles, RefreshCw,
  CheckCircle2, XCircle, AlertTriangle, Star, Trophy, Calendar, Mic,
  Volume2, VolumeX, Maximize2, Minimize2, ChevronRight, ChevronLeft,
  Moon, Activity, Home
} from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import {
  getCoachMessage, calculateFocusScore, getFocusLabel, calculateSessionXP,
  getRandomQuote, saveSession, getSessions, getAnalytics, getAISessionFeedback
} from '../services/aiStudyCoachService';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

// ─── Constants ────────────────────────────────────────────────────────────────
const DURATION_PRESETS = [
  { label: '25 min', value: 25, icon: '⚡', desc: 'Quick Focus' },
  { label: '50 min', value: 50, icon: '🎯', desc: 'Deep Work' },
  { label: '90 min', value: 90, icon: '🚀', desc: 'Marathon' },
  { label: 'Custom', value: 0, icon: '⏱️', desc: 'Your pace' },
];

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'Data Structures', 'Algorithms', 'Machine Learning', 'Database Systems',
  'Software Engineering', 'Electronics', 'Electrical Engineering',
  'Civil Engineering', 'English Literature', 'History', 'Economics',
  'Psychology', 'Philosophy', 'Other'
];

const INACTIVITY_WARNING_1 = 2 * 60; // 2 minutes
const INACTIVITY_WARNING_2 = 5 * 60; // 5 minutes
const INACTIVITY_AUTO_PAUSE = 10 * 60; // 10 minutes

// ─── Circular Progress Ring ────────────────────────────────────────────────────
function CircularProgress({ percent, size = 220, strokeWidth = 12, color = '#00f5d4', children }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function MiniBarChart({ data, label, color = '#00f5d4' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-end gap-1 h-16">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-sm transition-all duration-500"
              style={{ height: `${Math.round((d.value / max) * 52)}px`, backgroundColor: color, opacity: 0.7 + 0.3 * (d.value / max) }}
            />
            <span className="text-[8px] text-gray-600 font-bold">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StudyWithMe({ user }) {
  const { awardXP } = useGamification();
  const { addToast } = useToast();

  // Phase: 'setup' | 'session' | 'summary' | 'analytics'
  const [phase, setPhase] = useState('setup');

  // Setup form state
  const [subject, setSubject] = useState('Computer Science');
  const [goal, setGoal] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [customDuration, setCustomDuration] = useState(45);
  const [isCustom, setIsCustom] = useState(false);
  const [ambientSound, setAmbientSound] = useState(false);

  // Session state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0); // in seconds
  const [elapsedActive, setElapsedActive] = useState(0); // seconds actively studying
  const [breakTime, setBreakTime] = useState(0); // seconds on break
  const [distractions, setDistractions] = useState(0);
  const [breaks, setBreaks] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Inactivity detection
  const [inactivitySeconds, setInactivitySeconds] = useState(0);
  const [inactivityWarning, setInactivityWarning] = useState(null); // null | 'warn1' | 'warn2'
  const lastActivityRef = useRef(Date.now());
  const inactivityRef = useRef(0);

  // Coaching
  const [coachMessage, setCoachMessage] = useState('');
  const [showCoach, setShowCoach] = useState(false);
  const coachTimerRef = useRef(null);

  // Session result
  const [sessionResult, setSessionResult] = useState(null);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Analytics
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState({});

  // Refs for timer loops
  const timerRef = useRef(null);
  const inactivityIntervalRef = useRef(null);

  // Load analytics on mount
  useEffect(() => {
    if (user) {
      setSessions(getSessions(user.id));
      setAnalytics(getAnalytics(user.id));
    }
  }, [user, phase]);

  // Handle preset duration from AI Twin action center
  useEffect(() => {
    const presetDuration = localStorage.getItem('study_session_duration');
    if (presetDuration) {
      const dur = parseInt(presetDuration);
      if (dur > 0) {
        setSelectedDuration(dur);
        if (dur === 45) {
          setIsCustom(true);
          setCustomDuration(45);
        } else {
          setIsCustom(false);
        }
      }
      localStorage.removeItem('study_session_duration');
    }
  }, []);

  // ─── Activity Detection ────────────────────────────────────────────────────
  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    inactivityRef.current = 0;
    setInactivitySeconds(0);
    if (inactivityWarning) setInactivityWarning(null);
  }, [inactivityWarning]);

  useEffect(() => {
    if (phase !== 'session') return;
    const events = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    const throttled = () => resetActivity();
    events.forEach(e => window.addEventListener(e, throttled, { passive: true }));
    return () => events.forEach(e => window.removeEventListener(e, throttled));
  }, [phase, resetActivity]);

  // ─── Main Session Timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning || isPaused) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSessionComplete(true);
          return 0;
        }
        return prev - 1;
      });
      setElapsedActive(prev => prev + 1);

      // Inactivity counter
      const idleSeconds = Math.round((Date.now() - lastActivityRef.current) / 1000);
      inactivityRef.current = idleSeconds;
      setInactivitySeconds(idleSeconds);

      if (idleSeconds >= INACTIVITY_AUTO_PAUSE) {
        handleAutoPause();
      } else if (idleSeconds >= INACTIVITY_WARNING_2 && inactivityWarning !== 'warn2') {
        setInactivityWarning('warn2');
        setDistractions(prev => prev + 1);
      } else if (idleSeconds >= INACTIVITY_WARNING_1 && !inactivityWarning) {
        setInactivityWarning('warn1');
        setDistractions(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, isPaused]);

  // ─── Break Timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPaused || !isRunning) return;
    const ref = setInterval(() => setBreakTime(prev => prev + 1), 1000);
    return () => clearInterval(ref);
  }, [isPaused, isRunning]);

  // ─── AI Coach Message Scheduler ────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning || isPaused) {
      clearTimeout(coachTimerRef.current);
      return;
    }
    const scheduleNext = () => {
      const delay = (Math.random() * 3 + 3) * 60 * 1000; // 3–6 minutes
      coachTimerRef.current = setTimeout(() => {
        const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
        const msg = getCoachMessage('progress', progress);
        setCoachMessage(msg);
        setShowCoach(true);
        setTimeout(() => setShowCoach(false), 6000);
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => clearTimeout(coachTimerRef.current);
  }, [isRunning, isPaused, totalDuration, timeLeft]);

  // ─── Session Controls ──────────────────────────────────────────────────────
  const handleStart = () => {
    const dur = isCustom ? customDuration : selectedDuration;
    if (!goal.trim()) { addToast({ message: 'Please enter a study goal!', type: 'error' }); return; }
    if (dur < 1) { addToast({ message: 'Please set a valid duration.', type: 'error' }); return; }

    const totalSecs = dur * 60;
    setTotalDuration(totalSecs);
    setTimeLeft(totalSecs);
    setElapsedActive(0);
    setBreakTime(0);
    setDistractions(0);
    setBreaks(0);
    setIsRunning(true);
    setIsPaused(false);
    setSessionResult(null);
    setAiFeedback(null);
    setInactivityWarning(null);
    resetActivity();

    const msg = getCoachMessage('start', 0);
    setCoachMessage(msg);
    setShowCoach(true);
    setTimeout(() => setShowCoach(false), 5000);

    setPhase('session');
    addToast({ message: `🚀 Study session started! ${dur} minutes of focus begins now.`, type: 'success' });
  };

  const handlePause = () => {
    setIsPaused(true);
    setBreaks(prev => prev + 1);
    setCoachMessage(getCoachMessage('break', 0));
    setShowCoach(true);
    setTimeout(() => setShowCoach(false), 5000);
  };

  const handleResume = () => {
    setIsPaused(false);
    resetActivity();
    setInactivityWarning(null);
    setCoachMessage(getCoachMessage('resumed', 0));
    setShowCoach(true);
    setTimeout(() => setShowCoach(false), 4000);
  };

  const handleAutoPause = () => {
    setIsPaused(true);
    setBreaks(prev => prev + 1);
    setInactivityWarning(null);
    addToast({ message: '⏸️ Session auto-paused due to 10 minutes of inactivity.', type: 'info' });
  };

  const handleSessionComplete = useCallback(async (completed = false) => {
    clearInterval(timerRef.current);
    clearTimeout(coachTimerRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setIsFullscreen(false);

    const dur = isCustom ? customDuration : selectedDuration;
    const activeMinutes = Math.round(elapsedActive / 60);
    const breakMinutes = Math.round(breakTime / 60);

    const score = calculateFocusScore({
      totalMinutes: dur,
      activeMinutes,
      distractions,
      breakMinutes,
      completed
    });

    const xp = calculateSessionXP({ totalMinutes: activeMinutes, focusScore: score, completed, distractions });
    const quote = getRandomQuote();

    const result = {
      subject, goal,
      totalMinutes: dur,
      activeMinutes,
      breakMinutes,
      distractions,
      breaks,
      focusScore: score,
      xpEarned: xp,
      completed,
      quote,
      timestamp: new Date().toISOString()
    };

    setSessionResult(result);
    setPhase('summary');

    // Save to localStorage
    if (user) {
      saveSession(user.id, result);
      
      // Save to Firestore so Academic Digital Twin updates predictions automatically
      try {
        addDoc(collection(db, 'Users', user.id, 'StudySessions'), {
          subjectId: subject.toLowerCase().replace(/\s+/g, '-'),
          duration: activeMinutes,
          date: new Date().toISOString().split('T')[0],
          focusScore: score,
          topic: goal || 'General Study Session'
        });
      } catch (err) {
        console.error("Error saving study session to Firestore:", err);
      }
    }

    // Award XP via Gamification system
    if (awardXP) {
      await awardXP('FINISH_QUIZ', xp);
    }

    addToast({ message: `✅ Session complete! +${xp} XP earned!`, type: 'success' });

    // Fetch AI feedback
    setFeedbackLoading(true);
    try {
      const feedback = await getAISessionFeedback({ subject, goal, focusScore: score, totalMinutes: activeMinutes, distractions, completed });
      setAiFeedback(feedback);
    } finally {
      setFeedbackLoading(false);
    }
  }, [elapsedActive, breakTime, distractions, breaks, subject, goal, isCustom, customDuration, selectedDuration, user, awardXP]);

  const handleEndEarly = () => {
    if (window.confirm('End this study session early? Progress will be saved.')) {
      handleSessionComplete(false);
    }
  };

  // ─── Computed values ───────────────────────────────────────────────────────
  const progressPercent = totalDuration > 0 ? Math.round(((totalDuration - timeLeft) / totalDuration) * 100) : 0;
  const focusScoreNow = calculateFocusScore({
    totalMinutes: Math.round(totalDuration / 60),
    activeMinutes: Math.round(elapsedActive / 60),
    distractions,
    breakMinutes: Math.round(breakTime / 60),
    completed: false
  });
  const focusLabelNow = getFocusLabel(focusScoreNow);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // ─── Analytics Data ────────────────────────────────────────────────────────
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    return days.map((label, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (today.getDay() - 1 - i + 7) % 7);
      const key = d.toDateString();
      return { label, value: analytics.daily?.[key] || 0 };
    });
  }, [analytics]);

  const subjectData = useMemo(() => {
    const subjects = analytics.subjects || {};
    return Object.entries(subjects)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([label, value]) => ({ label: label.slice(0, 4), value }));
  }, [analytics]);

  // ─── Render ────────────────────────────────────────────────────────────────

  // ── Phase: SETUP ────────────────────────────────────────────────────────────
  if (phase === 'setup') return (
    <div className="space-y-8 animate-fade-in text-white pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-brand-teal to-brand-blue bg-clip-text text-transparent uppercase tracking-tight flex items-center gap-2">
            <Brain className="w-8 h-8 text-brand-teal" />
            Study With Me
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">AI-powered focus sessions with inactivity detection, coach messages, and XP rewards.</p>
        </div>
        <button
          onClick={() => setPhase('analytics')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <BarChart2 className="w-4 h-4 text-brand-blue" />
          View Analytics
        </button>
      </div>

      {/* Stats Bar */}
      {user && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Today's Study", value: `${analytics.daily?.[new Date().toDateString()] || 0} min`, icon: Clock, color: 'text-brand-teal' },
            { label: 'Total XP', value: `${analytics.totalXP || 0} XP`, icon: Zap, color: 'text-yellow-400' },
            { label: 'Current Streak', value: `${analytics.currentStreak || 0} days 🔥`, icon: Flame, color: 'text-brand-orange' },
            { label: 'Avg Focus Score', value: `${analytics.avgFocusScore || 0}/100`, icon: Target, color: 'text-brand-pink' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="glass-panel p-4 rounded-2xl flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">{stat.label}</span>
                  <span className="text-sm font-black text-white block mt-0.5">{stat.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Session Setup Card */}
      <div className="glass-panel rounded-3xl p-8 max-w-2xl mx-auto">
        <h2 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal text-sm font-black">1</span>
          Setup Your Focus Session
        </h2>

        <div className="space-y-6">
          {/* Subject */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-brand-teal" /> Subject
            </label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-teal outline-none transition-colors appearance-none cursor-pointer"
            >
              {SUBJECTS.map(s => <option key={s} value={s} className="bg-[#0b0b14]">{s}</option>)}
            </select>
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-brand-pink" /> Study Goal
            </label>
            <input
              type="text"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="e.g., Complete Chapter 5 — Binary Trees"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-brand-pink outline-none transition-colors"
            />
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-blue" /> Duration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DURATION_PRESETS.map(d => (
                <button
                  key={d.label}
                  onClick={() => {
                    if (d.value === 0) { setIsCustom(true); setSelectedDuration(0); }
                    else { setIsCustom(false); setSelectedDuration(d.value); }
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all duration-300 cursor-pointer ${
                    (d.value === 0 ? isCustom : !isCustom && selectedDuration === d.value)
                      ? 'border-brand-teal bg-brand-teal/10 shadow-[0_0_15px_rgba(0,245,212,0.15)]'
                      : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-lg">{d.icon}</div>
                  <div className="text-xs font-extrabold text-white mt-0.5">{d.label}</div>
                  <div className="text-[9px] text-gray-500 font-semibold">{d.desc}</div>
                </button>
              ))}
            </div>
            {isCustom && (
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="number"
                  min={5} max={240}
                  value={customDuration}
                  onChange={e => setCustomDuration(Number(e.target.value))}
                  className="w-28 bg-black/30 border border-brand-teal/30 rounded-xl px-3 py-2 text-sm text-white outline-none text-center font-bold"
                />
                <span className="text-xs text-gray-400 font-bold">minutes (5–240)</span>
              </div>
            )}
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={!goal.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-teal to-brand-blue text-black font-black text-base uppercase tracking-widest shadow-[0_0_25px_rgba(0,245,212,0.3)] hover:shadow-[0_0_35px_rgba(0,245,212,0.5)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Focus Session
          </button>
        </div>
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Recent Sessions</h3>
          <div className="space-y-2">
            {sessions.slice(0, 4).map(s => {
              const fl = getFocusLabel(s.focusScore || 0);
              return (
                <div key={s.id} className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-white block">{s.subject}</span>
                    <span className="text-[10px] text-gray-500 truncate max-w-[160px] block">{s.goal}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${fl.bg} ${fl.color}`}>{s.focusScore}/100</span>
                    <span className="text-[10px] text-gray-500 font-bold">{s.activeMinutes || s.totalMinutes}m</span>
                    <span className="text-[10px] text-brand-teal font-extrabold">+{s.xpEarned} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // ── Phase: SESSION ──────────────────────────────────────────────────────────
  if (phase === 'session') return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-[#05050a] p-6 md:p-12 flex flex-col items-center justify-center' : 'min-h-[70vh] flex flex-col items-center justify-center py-12'} text-white animate-fade-in`}>

      {/* Inactivity Warning Overlay */}
      {inactivityWarning && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full rounded-3xl p-8 border border-white/10 text-center animate-scale-in shadow-2xl">
            <div className="text-5xl mb-4">{inactivityWarning === 'warn1' ? '📚' : '⚠️'}</div>
            <h3 className="text-lg font-extrabold text-white mb-2">
              {inactivityWarning === 'warn1' ? 'Still studying?' : 'You\'ve been inactive'}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {inactivityWarning === 'warn1'
                ? "Let's continue! Your streak and focus score are counting on you. 📚"
                : 'Resume your study session to keep your streak alive. Your progress is saved!'}
            </p>
            <button
              onClick={handleResume}
              className="w-full py-3 rounded-xl bg-brand-teal text-black font-black text-sm uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(0,245,212,0.3)]"
            >
              ✅ Resume Session
            </button>
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Studying</span>
          <h2 className="text-xl font-extrabold text-white">{subject}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Circular Timer */}
      <div className="relative mb-8">
        <CircularProgress
          percent={progressPercent}
          size={240}
          strokeWidth={14}
          color={isPaused ? '#f72585' : '#00f5d4'}
        >
          <div className="text-center">
            <div className="text-5xl font-black text-white font-mono tracking-tighter">{formatTime(timeLeft)}</div>
            <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest mt-1">{isPaused ? '⏸ Paused' : '▶ Focusing'}</div>
          </div>
        </CircularProgress>
        {/* Glow backdrop */}
        <div className={`absolute inset-0 rounded-full blur-3xl -z-10 transition-all duration-1000 ${isPaused ? 'bg-brand-pink/5' : 'bg-brand-teal/5'}`} />
      </div>

      {/* Goal display */}
      <div className="text-center mb-6 max-w-md px-4">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Goal</p>
        <p className="text-sm text-gray-300 font-medium leading-relaxed">{goal}</p>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-sm">
        {[
          { label: 'Focus Score', value: focusScoreNow, icon: '🎯', color: focusLabelNow.color },
          { label: 'Distractions', value: distractions, icon: '⚠️', color: 'text-yellow-400' },
          { label: 'Breaks', value: breaks, icon: '☕', color: 'text-brand-blue' },
        ].map((m, i) => (
          <div key={i} className="glass-panel p-3 rounded-2xl text-center">
            <div className="text-xl">{m.icon}</div>
            <div className={`text-lg font-black ${m.color}`}>{m.value}</div>
            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isPaused ? (
          <button onClick={handlePause} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 text-white text-sm font-bold transition-all cursor-pointer">
            <Pause className="w-4 h-4" /> Pause
          </button>
        ) : (
          <button onClick={handleResume} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-teal text-black text-sm font-black transition-all cursor-pointer shadow-[0_0_15px_rgba(0,245,212,0.3)]">
            <Play className="w-4 h-4 fill-current" /> Resume
          </button>
        )}
        <button onClick={handleEndEarly} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-sm font-bold transition-all cursor-pointer">
          <Square className="w-4 h-4" /> End Session
        </button>
      </div>

      {/* AI Coach floating message */}
      {showCoach && coachMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 max-w-sm w-full px-4 z-40 animate-fade-in">
          <div className="glass-panel rounded-2xl p-4 flex items-start gap-3 border border-brand-pink/20 shadow-xl">
            <div className="w-8 h-8 rounded-xl bg-brand-pink/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-brand-pink" />
            </div>
            <div>
              <span className="text-[9px] font-black text-brand-pink uppercase tracking-widest block mb-0.5">AI Study Coach</span>
              <p className="text-xs text-gray-300 leading-relaxed">{coachMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── Phase: SUMMARY ──────────────────────────────────────────────────────────
  if (phase === 'summary' && sessionResult) {
    const fl = getFocusLabel(sessionResult.focusScore);
    return (
      <div className="space-y-6 max-w-2xl mx-auto animate-fade-in text-white pb-16">
        {/* Header */}
        <div className="text-center pt-4">
          <div className="text-6xl mb-3">{sessionResult.completed ? '🏆' : '📊'}</div>
          <h2 className="text-2xl font-black text-white">{sessionResult.completed ? 'Session Complete!' : 'Session Saved'}</h2>
          <p className="text-xs text-gray-400 mt-1">{sessionResult.subject} — {sessionResult.goal}</p>
        </div>

        {/* XP Banner */}
        <div className="glass-panel rounded-3xl p-6 border border-brand-teal/20 bg-brand-teal/5 text-center">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">XP Earned This Session</span>
          <div className="text-5xl font-black text-brand-teal">+{sessionResult.xpEarned}</div>
          <div className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">Experience Points</div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-2xl text-center">
            <CircularProgress percent={sessionResult.focusScore} size={100} strokeWidth={8} color={sessionResult.focusScore >= 70 ? '#00f5d4' : sessionResult.focusScore >= 50 ? '#ffd700' : '#f72585'}>
              <span className="text-xl font-black text-white">{sessionResult.focusScore}</span>
            </CircularProgress>
            <div className={`mt-2 text-xs font-extrabold ${fl.color}`}>{fl.label}</div>
            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Focus Score</div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Active Study', value: `${sessionResult.activeMinutes} min`, icon: '⏱️' },
              { label: 'Breaks Taken', value: sessionResult.breaks, icon: '☕' },
              { label: 'Distractions', value: sessionResult.distractions, icon: '⚠️' },
              { label: 'Break Time', value: `${sessionResult.breakMinutes} min`, icon: '😌' },
            ].map((m, i) => (
              <div key={i} className="glass-panel p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span>{m.icon}</span>
                  <span className="text-[10px] text-gray-400 font-bold">{m.label}</span>
                </div>
                <span className="text-xs font-extrabold text-white">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Feedback */}
        <div className="glass-panel rounded-3xl p-6 border border-brand-pink/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-brand-pink/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-pink" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">AI Coach Feedback</h3>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Personalized analysis</span>
            </div>
          </div>

          {feedbackLoading ? (
            <div className="flex items-center gap-3 py-4">
              <RefreshCw className="w-5 h-5 text-brand-pink animate-spin" />
              <span className="text-xs text-gray-400">Generating personalized feedback...</span>
            </div>
          ) : aiFeedback ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-300 leading-relaxed">{aiFeedback.feedback}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-green-500/5 border border-green-500/10 p-3 rounded-xl">
                  <span className="text-[9px] font-black text-green-400 uppercase tracking-widest block mb-1">✨ Strength</span>
                  <p className="text-xs text-gray-300 leading-relaxed">{aiFeedback.strength}</p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-xl">
                  <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest block mb-1">🚀 Improvement</span>
                  <p className="text-xs text-gray-300 leading-relaxed">{aiFeedback.improvement}</p>
                </div>
              </div>
              <div className="bg-brand-blue/5 border border-brand-blue/15 p-3 rounded-xl">
                <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest block mb-1">💡 Next Session Tip</span>
                <p className="text-xs text-gray-300 leading-relaxed">{aiFeedback.nextSessionTip}</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Motivational Quote */}
        {sessionResult.quote && (
          <div className="glass-panel rounded-2xl p-5 border border-white/5 text-center">
            <div className="text-2xl mb-2">💬</div>
            <p className="text-sm text-gray-300 italic leading-relaxed">"{sessionResult.quote.quote}"</p>
            <p className="text-[10px] text-gray-500 font-bold mt-2">— {sessionResult.quote.author}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setPhase('setup')}
            className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> New Session
          </button>
          <button
            onClick={() => setPhase('analytics')}
            className="flex-1 py-3 rounded-2xl bg-brand-teal text-black text-sm font-black transition-all cursor-pointer shadow-[0_0_15px_rgba(0,245,212,0.2)] flex items-center justify-center gap-2 hover:brightness-110"
          >
            <BarChart2 className="w-4 h-4" /> View Analytics
          </button>
        </div>
      </div>
    );
  }

  // ── Phase: ANALYTICS ─────────────────────────────────────────────────────────
  if (phase === 'analytics') {
    const totalHours = Math.round((analytics.totalMinutes || 0) / 60 * 10) / 10;
    const todayMin = analytics.daily?.[new Date().toDateString()] || 0;
    const topSubject = subjectData[0]?.label || '—';

    return (
      <div className="space-y-8 animate-fade-in text-white pb-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent uppercase tracking-tight flex items-center gap-2">
              <BarChart2 className="w-7 h-7 text-brand-blue" />
              Study Analytics
            </h1>
            <p className="text-xs text-gray-400 mt-1">Your complete focus & productivity dashboard.</p>
          </div>
          <button
            onClick={() => setPhase('setup')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-teal text-black text-xs font-black transition-all cursor-pointer shadow-[0_0_12px_rgba(0,245,212,0.2)]"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Start Session
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Today's Study", value: `${todayMin} min`, icon: Clock, color: 'text-brand-teal', glow: 'from-brand-teal/10' },
            { label: 'Total Hours', value: `${totalHours}h`, icon: Activity, color: 'text-brand-blue', glow: 'from-brand-blue/10' },
            { label: 'Current Streak', value: `${analytics.currentStreak || 0}d 🔥`, icon: Flame, color: 'text-brand-orange', glow: 'from-brand-orange/10' },
            { label: 'Avg Focus', value: `${analytics.avgFocusScore || 0}/100`, icon: Target, color: 'text-brand-pink', glow: 'from-brand-pink/10' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={`glass-panel p-5 rounded-2xl bg-gradient-to-br ${stat.glow} to-transparent`}>
                <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <div className="text-xl font-black text-white">{stat.value}</div>
                <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly study time chart */}
          <div className="glass-panel p-6 rounded-3xl">
            <MiniBarChart data={weeklyData} label="This Week (minutes/day)" color="#00f5d4" />
          </div>
          {/* Top subjects chart */}
          <div className="glass-panel p-6 rounded-3xl">
            {subjectData.length > 0 ? (
              <MiniBarChart data={subjectData} label="Top Subjects (minutes)" color="#7b2ff7" />
            ) : (
              <div className="text-center py-8 text-gray-600 text-xs italic">Complete study sessions to see subject breakdown.</div>
            )}
          </div>
        </div>

        {/* Level & XP */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="text-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Total XP Earned</span>
            <span className="text-4xl font-black text-brand-teal">{analytics.totalXP || 0}</span>
            <span className="text-xs text-gray-500 font-bold block mt-0.5">XP Points</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Sessions Completed</span>
            <span className="text-4xl font-black text-brand-blue">{analytics.totalSessions || 0}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Longest Streak</span>
            <span className="text-4xl font-black text-brand-orange">{analytics.longestStreak || 0}</span>
            <span className="text-xs text-gray-500 font-bold block mt-0.5">days</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Top Subject</span>
            <span className="text-lg font-black text-brand-pink">{topSubject}</span>
          </div>
        </div>

        {/* Session History */}
        {sessions.length > 0 && (
          <div>
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Session History</h3>
            <div className="space-y-2">
              {sessions.slice(0, 10).map(s => {
                const fl = getFocusLabel(s.focusScore || 0);
                return (
                  <div key={s.id} className="glass-panel p-4 rounded-2xl flex flex-wrap items-center gap-4 justify-between">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-white block">{s.subject}</span>
                      <span className="text-[10px] text-gray-500 truncate block">{s.goal}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 flex-wrap">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${fl.bg} ${fl.color}`}>{s.focusScore}/100</span>
                      <span className="text-[10px] text-gray-500">{s.activeMinutes || s.totalMinutes}min</span>
                      <span className="text-[10px] text-brand-teal font-extrabold">+{s.xpEarned} XP</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${s.completed ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {s.completed ? '✓ Done' : 'Early'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sessions.length === 0 && (
          <div className="glass-panel rounded-3xl p-12 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-base font-extrabold text-white mb-2">No Sessions Yet</h3>
            <p className="text-xs text-gray-500">Start your first study session to see analytics here.</p>
            <button onClick={() => setPhase('setup')} className="mt-5 px-6 py-2.5 rounded-xl bg-brand-teal text-black text-xs font-black cursor-pointer">
              Start Now
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
