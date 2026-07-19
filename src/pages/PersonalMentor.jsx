import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  GraduationCap, Sparkles, User, Calendar, BarChart2, MessageSquare, 
  Award, Clock, BookOpen, ChevronRight, CheckCircle2, Circle, Send, 
  RefreshCw, Star, Briefcase, Target, TrendingUp, AlertTriangle, 
  Play, HelpCircle, FileText, CheckCircle, RefreshCcw, LayoutDashboard, Flame, Zap, Volume2
} from 'lucide-react';
import { generateTwinResponse, generateQuizFromTopic, generateFlashcardsFromTopic, generatePlacementRoadmap } from '../services/aiService';
import { getLiveMentorData, saveSyllabusCompletion } from '../services/mentorDataService';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function PersonalMentor({ user }) {
  const { addToast } = useToast();
  const { tasks, notes, doubts } = useData(); // Real-time data from database context
  const userId = user?.uid || user?.email || 'default';
  const chatEndRef = useRef(null);

  // ─── Active Sub-Tab State ──────────────────────────────────────────────────
  const [activeSubTab, setActiveSubTab] = useState('dashboard'); // dashboard, profile, chat, analytics, planner, career
  const [expandedSubject, setExpandedSubject] = useState(null);

  // ─── Live Data Calculations for Analytics ──────────────────────────────────
  const last7DaysData = useMemo(() => {
    const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const colors = [
      'bg-brand-pink',
      'bg-brand-purple',
      'bg-brand-blue',
      'bg-brand-teal',
      'bg-brand-orange',
      'bg-red-400',
      'bg-brand-pink'
    ];
    
    const list = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toDateString();
      const mins = liveMentorData.analytics?.daily?.[key] || 0;
      const hrs = Math.round((mins / 60) * 10) / 10;
      list.push({
        day: daysShort[d.getDay()],
        hrs,
        color: colors[d.getDay()]
      });
    }
    return list;
  }, [liveMentorData.analytics?.daily]);

  const maxHrs = useMemo(() => {
    const maxVal = Math.max(...last7DaysData.map(d => d.hrs), 6);
    return maxVal > 0 ? maxVal : 6;
  }, [last7DaysData]);

  const syllabusMasteryData = useMemo(() => {
    const subjectList = profile.subjects ? profile.subjects.split(',').map(s => s.trim()) : [];
    const colors = ['bg-brand-pink', 'bg-brand-blue', 'bg-brand-orange', 'bg-brand-purple', 'bg-brand-teal'];
    
    return subjectList.map((sub, i) => {
      const progress = liveMentorData.syllabusProgress?.[sub] || {};
      const units = Object.values(progress);
      const completed = units.filter(u => u === true).length;
      const total = units.length || 5;
      const pct = Math.round((completed / total) * 100);
      
      let displayName = sub;
      if (sub === 'Data Structures') displayName = 'Data Structures & Algorithms';
      if (sub === 'Database Systems') displayName = 'Database Management Systems';
      
      const unitsList = liveMentorData.syllabusDetails?.[sub] || [];
      
      return {
        name: displayName,
        rawName: sub,
        mastery: pct,
        color: colors[i % colors.length],
        unitsList
      };
    });
  }, [profile.subjects, liveMentorData.syllabusProgress, liveMentorData.syllabusDetails]);

  const handleToggleUnit = async (subjectName, unitName) => {
    const currentProgress = { ...liveMentorData.syllabusProgress };
    if (!currentProgress[subjectName]) {
      currentProgress[subjectName] = {};
    }
    currentProgress[subjectName][unitName] = !currentProgress[subjectName][unitName];
    
    await saveSyllabusCompletion(userId, currentProgress);
    addToast({ 
      message: `Updated progress for ${subjectName} — ${unitName}!`, 
      type: 'success' 
    });
    window.dispatchEvent(new Event('storage'));
  };

  // ─── Timetable local state ─────────────────────────────────────────────────
  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('lumixora_timetable');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Listen for storage changes to keep timetable updated in real-time
  useEffect(() => {
    const syncTimetable = () => {
      const saved = localStorage.getItem('lumixora_timetable');
      if (saved) {
        try { setTimetable(JSON.parse(saved)); } catch (e) {}
      }
    };
    window.addEventListener('storage', syncTimetable);
    return () => window.removeEventListener('storage', syncTimetable);
  }, []);

  // Handle redirected subtabs (e.g. Profile) from Dashboard settings
  useEffect(() => {
    const subtab = localStorage.getItem('mentor_subtab');
    if (subtab) {
      localStorage.removeItem('mentor_subtab');
      setActiveSubTab(subtab);
    }
  }, []);

  // ─── Harvest Student Intelligence Metrics ──────────────────────────────────
  const liveMentorData = getLiveMentorData(userId, tasks, notes, doubts, user);
  const profile = liveMentorData.profile;
  const metrics = liveMentorData.metrics;

  const synergyScore = metrics.compositeReadiness;
  const consistencyScore = Math.min(100, (metrics.streak * 12) + (liveMentorData.analytics.totalSessions * 5)) || 60;
  const focusScore = liveMentorData.analytics.avgFocusScore || 75;
  const currentStreak = metrics.streak;
  const productivityScore = Math.round(
    Math.min(100, ((liveMentorData.analytics.totalMinutes || 0) / ((Number(profile.dailyHours) || 4) * 60)) * 100)
  ) || 0;

  const twinData = {
    profile,
    studyAnalytics: liveMentorData.analytics,
    tasksStats: {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Completed' || t.status === 'Done').length,
      completionRate: metrics.taskProgressPct
    },
    metrics: {
      synergyScore,
      productivityScore,
      consistencyScore,
      focusScore
    }
  };

  // ─── Exam Countdown & War Mode Check ───────────────────────────────────────
  const [examCountdown, setExamCountdown] = useState(null);
  const [isWarMode, setIsWarMode] = useState(false);

  useEffect(() => {
    const targetDateStr = localStorage.getItem('lumixora_targetExamDate');
    if (!targetDateStr) {
      setExamCountdown(null);
      setIsWarMode(false);
      return;
    }

    const calculateDays = () => {
      const now = new Date().getTime();
      const target = new Date(targetDateStr).getTime();
      const distance = target - now;
      const days = Math.ceil(distance / (1000 * 60 * 60 * 24));
      
      setExamCountdown(days > 0 ? days : 0);
      setIsWarMode(days > 0 && days <= 15); // Automatically activate Exam War Mode if within 15 days
    };

    calculateDays();
    const interval = setInterval(calculateDays, 60000);
    return () => clearInterval(interval);
  }, []);

  // ─── Profile Update Handler ────────────────────────────────────────────────
  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem(`lumixora_mentor_profile_${userId}`, JSON.stringify(profileState));
    addToast({ message: 'AI Academic Twin™ intelligence profile updated!', type: 'success' });
    window.dispatchEvent(new Event('storage')); // trigger refresh
  };

  const [profileState, setProfileState] = useState(profile);
  useEffect(() => {
    setProfileState(profile);
  }, [profile.name, profile.college, profile.department, profile.year, profile.careerGoal, profile.weakSubjects]);

  // ─── Streaks & Goal Tracker ────────────────────────────────────────────────
  const toggleGoalCompletion = (taskId) => {
    // Simulate checking goals
    addToast({ message: 'Study milestone status updated!', type: 'success' });
  };

  // ─── Weakness Diagnostic Alert ─────────────────────────────────────────────
  const [weaknessAlerts, setWeaknessAlerts] = useState([]);
  useEffect(() => {
    const alerts = [];
    if (profile.weakSubjects) {
      alerts.push({
        title: `Low Proficiency: ${profile.weakSubjects}`,
        desc: `Your study logs show minimal review coverage. Recommendation: dedicate 30 minutes to review notes daily.`,
        severity: 'high'
      });
    }
    if (twinData.tasksStats.completionRate < 60 && twinData.tasksStats.total > 0) {
      alerts.push({
        title: `Task Checklist Gap Detected`,
        desc: `Your milestone completion rate is sitting at ${twinData.tasksStats.completionRate}%. Try resolving 2 pending items to avoid backlog.`,
        severity: 'medium'
      });
    }
    setWeaknessAlerts(alerts);
  }, [profile.weakSubjects, twinData.tasksStats.completionRate]);

  // ─── AI Mentor Chat States ─────────────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem(`lumixora_twin_chat_${userId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { role: 'system', content: 'You are now talking to your Lumixora AI Academic Twin™.' },
      { role: 'assistant', content: `Greetings ${profile.name || 'Scholar'}! I am your AI Academic Twin™. I have successfully harvested your study sessions, task logs, and timetable records. I am ready to synchronize. What concept or problem can I help you solve today?` }
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [complexityLevel, setComplexityLevel] = useState('Intermediate'); // Beginner, Intermediate, Advanced
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  useEffect(() => {
    localStorage.setItem(`lumixora_twin_chat_${userId}`, JSON.stringify(chatMessages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || chatLoading) return;

    const userMsg = { role: 'user', content: inputMessage };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setChatLoading(true);

    try {
      const thread = chatMessages.concat(userMsg).filter(m => m.role !== 'system');
      const responseText = await generateTwinResponse(thread, twinData, complexityLevel);
      
      const assistantMsg = { role: 'assistant', content: responseText };
      setChatMessages(prev => [...prev, assistantMsg]);

      if (voiceEnabled && 'speechSynthesis' in window) {
        const speechText = responseText.replace(/[*#`_\-]/g, '').substring(0, 150) + '...';
        const utterance = new SpeechSynthesisUtterance(speechText);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      addToast({ message: 'Failed to synchronize with AI Academic Twin.', type: 'error' });
    } finally {
      setChatLoading(false);
    }
  };

  // ─── Dynamic AI Tools States ────────────────────────────────────────────────
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);

  const [activeFlashcards, setActiveFlashcards] = useState(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);
  const [customQuizTopic, setCustomQuizTopic] = useState('');

  // Monitor action auto-trigger for quiz
  useEffect(() => {
    const action = localStorage.getItem('mentor_action');
    if (action === 'generate_quiz' && profile?.weakSubjects) {
      localStorage.removeItem('mentor_action');
      setActiveSubTab('chat');
      handleGenerateQuiz(profile.weakSubjects);
    }
  }, [profile?.weakSubjects]);

  const handleGenerateQuiz = async (topic) => {
    setFlashcardsLoading(false);
    setActiveFlashcards(null);
    setQuizLoading(true);
    setActiveQuiz(null);
    setQuizSubmitted(false);
    setQuizAnswers({});
    setActiveSubTab('chat');
    
    try {
      const quiz = await generateQuizFromTopic(topic, profile.weakSubjects);
      setActiveQuiz(quiz);
      setQuizStartTime(Date.now());
      addToast({ message: 'AI Quiz generated successfully!', type: 'success' });
    } catch (e) {
      addToast({ message: 'Could not generate quiz. Try again.', type: 'error' });
    } finally {
      setQuizLoading(false);
    }
  };

  const handleGenerateFlashcards = async (topic) => {
    setActiveQuiz(null);
    setQuizSubmitted(false);
    setQuizLoading(false);
    setFlashcardsLoading(true);
    setActiveFlashcards(null);
    setFlashcardIndex(0);
    setFlashcardFlipped(false);
    setActiveSubTab('chat');

    try {
      const cards = await generateFlashcardsFromTopic(topic, profile.weakSubjects);
      setActiveFlashcards(cards);
      addToast({ message: 'AI Flashcards generated successfully!', type: 'success' });
    } catch (e) {
      addToast({ message: 'Could not generate flashcards.', type: 'error' });
    } finally {
      setFlashcardsLoading(false);
    }
  };

  // ─── Career roadmap ────────────────────────────────────────────────────────
  const [careerRoadmap, setCareerRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  const handleGenerateRoadmap = async () => {
    setRoadmapLoading(true);
    try {
      const r = await generatePlacementRoadmap(profile);
      setCareerRoadmap(r);
      addToast({ message: 'Custom roadmap generated!', type: 'success' });
    } catch (e) {
      addToast({ message: 'Roadmap generation failed.', type: 'error' });
    } finally {
      setRoadmapLoading(false);
    }
  };

  return (
    <div className={`space-y-6 animate-fade-in text-gray-200 pb-10 ${isWarMode ? 'border-t-4 border-t-red-600' : ''}`}>
      
      {/* ─── Header ─── */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border p-4 rounded-2xl ${
        isWarMode ? 'border-red-500/20 bg-gradient-to-r from-red-950/20 to-black' : 'border-white/5'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl border text-brand-pink ${
            isWarMode ? 'bg-red-500/10 border-red-500/35 text-red-400' : 'bg-brand-purple/10 border-brand-purple/20'
          }`}>
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              LUMIXORA Student OS™
              <span className={`text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded border ${
                isWarMode ? 'bg-red-600/25 border-red-500 text-red-400 animate-pulse' : 'bg-brand-pink/20 text-brand-pink border-brand-pink/30'
              }`}>
                {isWarMode ? 'Exam War Mode' : 'PRO'}
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Real-time AI-powered academic operating system for student life.</p>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'profile', label: 'Twin Setup', icon: User },
            { id: 'chat', label: 'Twin Chat', icon: MessageSquare },
            { id: 'career', label: 'Career Mentor', icon: Briefcase }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                  isSel 
                    ? isWarMode ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]' : 'bg-brand-pink text-white shadow-[0_0_12px_rgba(247,37,133,0.3)]' 
                    : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 1. DASHBOARD VIEW ─── */}
      {activeSubTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* Exam War Mode Alert (if active) */}
            {isWarMode && (
              <div className="p-5 rounded-2xl border border-red-500/35 bg-gradient-to-br from-red-950/40 via-red-900/10 to-transparent relative overflow-hidden animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-400 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-red-200">Exam countdown alert: Only {examCountdown} days remaining!</h2>
                    <p className="text-xs text-gray-300 leading-relaxed mt-1">
                      Lumixora AI has automatically activated **Exam War Mode**. Your daily study planner has adjusted focus to target your weak subject **{profile.weakSubjects}** with high priority.
                    </p>
                    
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={() => handleGenerateQuiz(profile.weakSubjects)}
                        className="text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all uppercase"
                      >
                        Start War Quiz
                      </button>
                      <button 
                        onClick={() => handleGenerateFlashcards(profile.weakSubjects)}
                        className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-gray-200 px-4 py-2 rounded-xl border border-white/10 transition-colors uppercase"
                      >
                        Revision Flashcards
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Student Intelligence Panel */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-br from-brand-purple/10 to-transparent">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 rounded-full blur-2xl"></div>
              <div className="flex flex-col md:flex-row items-center gap-6">
                
                {/* Composite Gauge */}
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="42" 
                      stroke="rgba(255, 255, 255, 0.04)" strokeWidth="6" fill="transparent" 
                    />
                    <circle 
                      cx="50" cy="50" r="42" 
                      stroke="url(#grad)" strokeWidth="8" fill="transparent" 
                      strokeDasharray="263.89" 
                      strokeDashoffset={263.89 - (263.89 * twinData.metrics.synergyScore) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00f5d4" />
                        <stop offset="100%" stopColor="#f72585" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-white">{twinData.metrics.synergyScore}%</span>
                    <span className="text-[8px] text-gray-400 uppercase font-extrabold tracking-widest mt-0.5">Synergy</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
                    Sync Complete. Academic Twin online.
                  </h2>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Analyzing active parameters for **{profile.name}** ({profile.year}, {profile.department}). Target goal is **{profile.careerGoal}** and target CGPA is **{profile.targetCGPA}**.
                  </p>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="p-2.5 rounded-xl bg-black/25 border border-white/5 text-center">
                      <span className="text-[8px] text-gray-500 font-extrabold uppercase block">Productivity</span>
                      <span className="text-xs font-bold text-brand-teal mt-0.5 block">{twinData.metrics.productivityScore}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/25 border border-white/5 text-center">
                      <span className="text-[8px] text-gray-500 font-extrabold uppercase block">Focus Score</span>
                      <span className="text-xs font-bold text-brand-pink mt-0.5 block">{twinData.metrics.focusScore}/100</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/25 border border-white/5 text-center">
                      <span className="text-[8px] text-gray-500 font-extrabold uppercase block">Consistency</span>
                      <span className="text-xs font-bold text-brand-blue mt-0.5 block">{twinData.metrics.consistencyScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weakness Detection Panels */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-100 flex items-center gap-1.5 mb-4">
                <AlertTriangle className="w-4 h-4 text-brand-orange animate-pulse" /> AI Weakness & Pattern Diagnostic
              </h3>

              {weaknessAlerts.length === 0 ? (
                <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-center">
                  <p className="text-xs text-gray-500 italic">No academic warnings generated. Keep up the high synergy!</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {weaknessAlerts.map((alert, i) => (
                    <div 
                      key={i} 
                      className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                        alert.severity === 'high' 
                          ? 'bg-red-500/10 border-red-500/20 text-red-200' 
                          : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wide">{alert.title}</h4>
                        <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">{alert.desc}</p>
                        
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleGenerateQuiz(profile.weakSubjects)}
                            className="text-[9px] font-extrabold px-3 py-1.5 rounded-lg bg-black/35 hover:bg-black/55 text-white border border-white/10 uppercase"
                          >
                            Diagnose with Quiz
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Smart Study Planners / Schedules */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-blue" /> Adaptive Plan & Rescheduling Timetable
                </h3>
                
                {timetable.some(c => c.status === 'missed') && (
                  <button 
                    onClick={() => addToast({ message: 'Rescheduled missed classes successfully!', type: 'success' })}
                    className="text-[10px] font-bold bg-brand-orange/20 border border-brand-orange/30 text-brand-orange px-3 py-1.5 rounded-lg hover:bg-brand-orange hover:text-black transition-all uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> Auto Reschedule
                  </button>
                )}
              </div>

              {timetable.length === 0 ? (
                <div className="p-6 rounded-xl border border-white/5 text-center bg-white/5">
                  <p className="text-xs text-gray-500 italic">No class timetable detected. Set up classes in Task Scheduler first!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {timetable.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-start gap-4"
                    >
                      <div>
                        <span className="text-[10px] text-brand-blue font-extrabold block">{item.day} at {item.time} ({item.duration})</span>
                        <h4 className="text-xs font-bold text-gray-200 mt-1">{item.subject}</h4>
                      </div>

                      <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${
                        item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'missed' ? 'bg-red-500/20 text-red-400 animate-pulse' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {item.status || 'pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hour charts */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-100 flex items-center gap-2 mb-4">
                <BarChart2 className="w-4 h-4 text-brand-pink" /> Real-Time Study Focus Hours (Last 7 Days)
              </h3>
              
              <div className="relative w-full h-44 bg-black/20 rounded-xl border border-white/5 p-4 flex flex-col justify-end">
                <div className="flex justify-between items-end h-32 px-4 relative z-10">
                  {last7DaysData.map((bar, i) => {
                    const heightPercent = Math.min((bar.hrs / maxHrs) * 100, 100);
                    return (
                      <div key={i} className="flex flex-col items-center gap-1.5 w-8">
                        <span className="text-[10px] text-gray-400 font-bold">{bar.hrs}h</span>
                        <div 
                          className={`w-4 rounded-t-sm transition-all duration-700 hover:opacity-85 ${bar.color}`}
                          style={{ height: `${heightPercent}px` }}
                        ></div>
                        <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-wide">{bar.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Subject Mastery checklist */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-100">Syllabus Completion & Mastery Analytics</h3>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Click to expand syllabus units</span>
              </div>
              
              <div className="space-y-4">
                {syllabusMasteryData.map((sub, i) => (
                  <div key={i} className="space-y-2 p-2.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => setExpandedSubject(expandedSubject === sub.rawName ? null : sub.rawName)}
                    >
                      <div className="flex-1 space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-gray-200">{sub.name}</span>
                          <span className="text-brand-teal">{sub.mastery}% Mastered</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${sub.color}`}
                            style={{ width: `${sub.mastery}%` }}
                          ></div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-500 ml-3 transition-transform ${expandedSubject === sub.rawName ? 'rotate-90' : ''}`} />
                    </div>
                    
                    {/* Units list */}
                    {expandedSubject === sub.rawName && (
                      <div className="mt-3 pl-2 pr-2 py-2 bg-black/35 rounded-xl border border-white/5 space-y-2 animate-fade-in text-left">
                        {sub.unitsList.length === 0 ? (
                          <p className="text-[10px] text-gray-500 italic p-2 text-center">No unit outline available for this subject.</p>
                        ) : (
                          sub.unitsList.map((unitObj, uIdx) => {
                            const isCompleted = liveMentorData.syllabusProgress?.[sub.rawName]?.[unitObj.unit] || false;
                            return (
                              <div key={uIdx} className="flex items-start gap-2.5 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors">
                                <input 
                                  type="checkbox"
                                  checked={isCompleted}
                                  onChange={() => handleToggleUnit(sub.rawName, unitObj.unit)}
                                  className="mt-0.5 rounded border-white/10 text-brand-teal focus:ring-brand-teal cursor-pointer"
                                />
                                <div className="text-[11px]">
                                  <span className="font-bold text-brand-pink block">{unitObj.unit} — {unitObj.name}</span>
                                  <span className="text-gray-400 text-[10px] leading-relaxed block mt-0.5">{unitObj.topics}</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right sidebar widgets: Streak, Motivation Feed, Upcoming */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Active streak */}
            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-brand-pink/10 to-brand-purple/10 text-center relative overflow-hidden border border-brand-pink/20">
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-brand-pink/15 rounded-full blur-xl animate-pulse"></div>
              <div className="w-16 h-16 rounded-full bg-brand-pink/20 border border-brand-pink/30 flex items-center justify-center mx-auto text-brand-pink text-2xl font-black mb-3 shadow-[0_0_15px_rgba(247,37,133,0.3)]">
                🔥
              </div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-100">Study Streak</h3>
              <p className="text-3xl font-extrabold tracking-tight gradient-text-cyan-purple mt-1">{twinData.studyAnalytics.currentStreak} Days</p>
              <p className="text-[10px] text-gray-400 mt-2 font-semibold">Study focus multiplier active! Keep up the momentum.</p>
            </div>

            {/* Daily motivational advice */}
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-brand-purple relative overflow-hidden">
              <span className="text-[9px] text-brand-purple font-extrabold uppercase tracking-widest block mb-2">Daily Twin Guidance</span>
              <p className="text-xs text-gray-300 font-medium italic leading-relaxed">
                "Based on your target of {profile.careerGoal} with a target CGPA of {profile.targetCGPA}, prioritize testing your skills in {profile.weakSubjects}. Let's run a Mock Interview simulation when you feel ready."
              </p>
              <div className="flex gap-2 mt-4 items-center">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-brand-purple/20 flex items-center justify-center text-xs font-bold text-brand-pink">
                  T
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-white block">Dr. Academic Twin™</span>
                  <span className="text-[9px] text-gray-500 font-semibold block">Lumixora Core Coach</span>
                </div>
              </div>
            </div>

            {/* Upcoming items */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-100 flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-brand-pink" /> Critical Deadlines
              </h3>
              
              <div className="space-y-3">
                {[
                  { text: 'Semester Exam Countdown', status: examCountdown !== null ? `${examCountdown} Days` : 'Not set', color: 'border-l-brand-pink' },
                  { text: 'Task list completion status', status: `${twinData.tasksStats.completed}/${twinData.tasksStats.total} done`, color: 'border-l-brand-teal' },
                  { text: 'Avg focus score target', status: `${twinData.metrics.focusScore}/100`, color: 'border-l-brand-orange' }
                ].map((note, idx) => (
                  <div key={idx} className={`p-3 rounded-lg bg-white/5 border-l-2 ${note.color} text-xs text-gray-300 flex justify-between`}>
                    <span>{note.text}</span>
                    <span className="font-extrabold text-white shrink-0">{note.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Exam Readiness Projection */}
            <div className="glass-panel p-6 rounded-2xl text-center space-y-5">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-100">AI Exam Readiness Projection</h3>
              
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="rgba(255, 255, 255, 0.05)" strokeWidth="8" fill="transparent" 
                  />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="#00f5d4" strokeWidth="8" fill="transparent" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * twinData.metrics.synergyScore) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white">{twinData.metrics.synergyScore}%</span>
                  <span className="text-[8px] text-gray-400 uppercase font-extrabold tracking-widest mt-0.5">Readiness</span>
                </div>
              </div>

              <div className="space-y-3.5 text-left border-t border-white/5 pt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-semibold">Confidence Level:</span>
                  <span className="text-white font-bold">{twinData.metrics.synergyScore >= 80 ? 'High 🚀' : 'Medium 📈'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-semibold">Estimated GPA:</span>
                  <span className="text-brand-teal font-extrabold">{(twinData.metrics.synergyScore / 10).toFixed(1)} / 10.0</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-left">
                <span className="text-[9px] text-brand-orange font-extrabold uppercase tracking-wider block">High Priority Target</span>
                <p className="text-[11px] text-gray-300 font-medium leading-relaxed mt-1">
                  Complete at least 3 practice questions for **{profile.weakSubjects}** to secure a readiness score above 80%.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ─── 2. PROFILE SETTINGS ─── */}
      {activeSubTab === 'profile' && (
        <div className="glass-panel p-6 rounded-2xl max-w-3xl mx-auto">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
            <User className="w-5 h-5 text-brand-pink" />
            <div>
              <h2 className="text-base font-bold text-gray-100">Twin Intelligence Config</h2>
              <p className="text-xs text-gray-400 mt-0.5">Customize your variables to adjust the calculations of the AI Academic Twin.</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={profileState.name}
                  onChange={(e) => setProfileState({...profileState, name: e.target.value})}
                  className="w-full glass-input px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">College / Institution</label>
                <input 
                  type="text" 
                  value={profileState.college}
                  onChange={(e) => setProfileState({...profileState, college: e.target.value})}
                  className="w-full glass-input px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Department / Major</label>
                <input 
                  type="text" 
                  value={profileState.department}
                  onChange={(e) => setProfileState({...profileState, department: e.target.value})}
                  className="w-full glass-input px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Year & Semester</label>
                <input 
                  type="text" 
                  value={profileState.year}
                  onChange={(e) => setProfileState({...profileState, year: e.target.value})}
                  className="w-full glass-input px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Learning Style</label>
                <select 
                  value={profileState.learningStyle}
                  onChange={(e) => setProfileState({...profileState, learningStyle: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Visual" className="bg-slate-900">Visual (Diagrams, Mindmaps)</option>
                  <option value="Reading" className="bg-slate-900">Reading / Writing (Summaries)</option>
                  <option value="Audio" className="bg-slate-900">Audio (Lectures, Voice)</option>
                  <option value="Practical" className="bg-slate-900">Practical (Coding, Mock tests)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Daily Study Target (Hours)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="16" 
                  value={profileState.dailyHours}
                  onChange={(e) => setProfileState({...profileState, dailyHours: e.target.value})}
                  className="w-full glass-input px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Target CGPA</label>
                <input 
                  type="text" 
                  value={profileState.targetCGPA}
                  onChange={(e) => setProfileState({...profileState, targetCGPA: e.target.value})}
                  className="w-full glass-input px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Career Goal</label>
                <select 
                  value={profileState.careerGoal}
                  onChange={(e) => setProfileState({...profileState, careerGoal: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Placement" className="bg-slate-900">Campus Placements / Jobs</option>
                  <option value="GATE" className="bg-slate-900">GATE / PSU Exams</option>
                  <option value="Higher Studies" className="bg-slate-900">Higher Studies (MS / MBA)</option>
                  <option value="Government Jobs" className="bg-slate-900">Government Jobs / UPSC</option>
                  <option value="Entrepreneurship" className="bg-slate-900">Entrepreneurship / Startups</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Strong Subjects</label>
                <input 
                  type="text" 
                  value={profileState.strongSubjects}
                  onChange={(e) => setProfileState({...profileState, strongSubjects: e.target.value})}
                  className="w-full glass-input px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Weak Subjects</label>
                <input 
                  type="text" 
                  value={profileState.weakSubjects}
                  onChange={(e) => setProfileState({...profileState, weakSubjects: e.target.value})}
                  className="w-full glass-input px-4 py-2.5 text-xs text-white"
                />
              </div>

            </div>

            <div className="border-t border-white/5 pt-5 flex justify-end">
              <button 
                type="submit"
                className="bg-brand-pink hover:opacity-95 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-[0_0_15px_rgba(247,37,133,0.35)]"
              >
                Sync Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── 3. AI TWIN CHAT ─── */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <div className="lg:col-span-8 flex flex-col glass-panel rounded-2xl overflow-hidden h-[540px]">
            
            {/* Header toolbar */}
            <div className="p-4 bg-white/5 border-b border-white/5 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-pink animate-ping"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-100">Synchronized Twin Context</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 font-semibold">Explanations:</span>
                  <select 
                    value={complexityLevel}
                    onChange={(e) => setComplexityLevel(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-2 py-0.5 text-xs text-brand-pink focus:outline-none"
                  >
                    <option value="Beginner" className="bg-slate-900">Beginner (Analogies)</option>
                    <option value="Intermediate" className="bg-slate-900">Intermediate (Formulas)</option>
                    <option value="Advanced" className="bg-slate-900">Advanced (Details & Math)</option>
                  </select>
                </div>

                <button 
                  onClick={() => {
                    setVoiceEnabled(!voiceEnabled);
                    addToast({ message: voiceEnabled ? 'Voice disabled.' : 'Voice response enabled.', type: 'info' });
                  }}
                  className={`p-1.5 rounded border transition-colors ${
                    voiceEnabled 
                      ? 'bg-brand-teal/20 border-brand-teal text-brand-teal' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                  title="Toggle Voice Output"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {chatMessages.filter(m => m.role !== 'system').map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-pink text-white rounded-br-none'
                      : 'bg-white/5 border border-white/5 text-gray-200 rounded-bl-none'
                  }`}>
                    <div className="whitespace-pre-line font-medium">{msg.content}</div>
                  </div>
                </div>
              ))}

              {/* Embed Interactive Quiz */}
              {activeQuiz && Array.isArray(activeQuiz.questions) && (
                <div className="p-4 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 space-y-4 my-2">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-brand-pink uppercase tracking-widest flex items-center gap-1">
                      <HelpCircle className="w-4 h-4" /> Interactive Quiz Solver
                    </span>
                    <button onClick={() => setActiveQuiz(null)} className="text-[10px] text-gray-500 hover:text-white">Clear</button>
                  </div>

                  {activeQuiz.questions.map((q, qIdx) => {
                    if (!q || !q.q || !Array.isArray(q.options)) return null;
                    return (
                      <div key={qIdx} className="space-y-2">
                        <p className="text-xs font-semibold text-gray-100">{qIdx + 1}. {q.q}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isSel = quizAnswers[qIdx] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                disabled={quizSubmitted}
                                onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                                  isSel 
                                    ? 'bg-brand-pink/20 border-brand-pink text-white' 
                                    : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/15'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className={`p-2 rounded-lg text-[11px] font-medium mt-1 ${
                            quizAnswers[qIdx] === q.correct ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            <span className="font-extrabold block mb-0.5">{quizAnswers[qIdx] === q.correct ? 'Correct! ✓' : `Incorrect (Correct: ${q.options[q.correct] || 'Option ' + (q.correct + 1)})`}</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {!quizSubmitted ? (
                    <button
                      onClick={async () => {
                        if (Object.keys(quizAnswers).length < activeQuiz.questions.length) {
                          addToast({ message: 'Answer all questions first.', type: 'info' });
                          return;
                        }
                        
                        // Calculate score
                        const correctCount = activeQuiz.questions.reduce((acc, q, qIdx) => {
                          return acc + (quizAnswers[qIdx] === q.correct ? 1 : 0);
                        }, 0);
                        
                        // Calculate duration
                        const durationSeconds = quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : 0;
                        const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));
                        
                        setQuizSubmitted(true);
                        
                        // Save quiz attempt in Firestore
                        try {
                          await addDoc(collection(db, 'Users', userId, 'QuizResults'), {
                            subjectId: profile.weakSubjects || 'general',
                            score: correctCount,
                            total: activeQuiz.questions.length,
                            date: new Date().toISOString().split('T')[0],
                            duration: durationMinutes,
                            wrongAnswers: ['Quiz Concept Check']
                          });
                          addToast({ message: `Quiz complete! Score: ${correctCount}/${activeQuiz.questions.length}`, type: 'success' });
                        } catch (err) {
                          console.error("Error logging quiz result to Firestore:", err);
                        }
                      }}
                      className="w-full bg-brand-teal text-black font-extrabold py-2 rounded-xl text-xs hover:opacity-95 transition-opacity"
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <button
                      onClick={() => handleGenerateQuiz(profile.weakSubjects)}
                      className="w-full bg-white/5 border border-white/10 text-white font-extrabold py-2 rounded-xl text-xs hover:bg-white/10"
                    >
                      New Quiz
                    </button>
                  )}
                </div>
              )}

              {/* Embed Flashcards */}
              {activeFlashcards && (
                <div className="max-w-md mx-auto p-6 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex flex-col items-center space-y-4 my-2 text-center">
                  <span className="text-[10px] text-brand-blue font-extrabold uppercase">
                    Flashcard ({flashcardIndex + 1} / {activeFlashcards.flashcards.length})
                  </span>

                  <div 
                    onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                    className="w-full h-36 bg-black/40 border border-white/10 rounded-2xl p-5 flex items-center justify-center cursor-pointer hover:border-brand-blue/40 transition-all select-none"
                  >
                    {!flashcardFlipped ? (
                      <p className="text-xs font-semibold text-gray-100">{activeFlashcards.flashcards[flashcardIndex].front}</p>
                    ) : (
                      <p className="text-xs font-medium text-brand-teal leading-relaxed">{activeFlashcards.flashcards[flashcardIndex].back}</p>
                    )}
                  </div>

                  <div className="flex gap-2 w-full">
                    <button
                      disabled={flashcardIndex === 0}
                      onClick={() => { setFlashcardIndex(prev => prev - 1); setFlashcardFlipped(false); }}
                      className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold disabled:opacity-30"
                    >
                      Prev
                    </button>
                    <button
                      disabled={flashcardIndex === activeFlashcards.flashcards.length - 1}
                      onClick={() => { setFlashcardIndex(prev => prev + 1); setFlashcardFlipped(false); }}
                      className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 text-xs text-gray-400 animate-pulse">
                    AI Academic Twin is syncing cognitive weights...
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Synchronize with your Twin: ask syllabus questions, project tips, or start mock exams..."
                className="flex-1 glass-input px-4 py-2 text-xs text-white"
                disabled={chatLoading}
              />
              <button 
                type="submit"
                disabled={!inputMessage.trim() || chatLoading}
                className="p-2.5 rounded-xl bg-brand-pink hover:opacity-95 text-white flex items-center justify-center shrink-0 disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick study widgets sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick diagnostics triggers */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-pink" /> AI Twin Generators
              </h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Topic of Interest</label>
                <input
                  type="text"
                  value={customQuizTopic}
                  onChange={(e) => setCustomQuizTopic(e.target.value)}
                  placeholder={`e.g. ${profile.weakSubjects || 'Data Structures'}`}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-brand-pink outline-none transition-colors"
                />
                <p className="text-[9px] text-gray-500 mt-1 leading-relaxed">Leave blank to default to your weak subject: <span className="text-brand-pink font-semibold">{profile.weakSubjects}</span></p>
              </div>

              <div className="space-y-2">
                <button
                  disabled={quizLoading || chatLoading}
                  onClick={() => handleGenerateQuiz(customQuizTopic.trim() || profile.weakSubjects)}
                  className="w-full py-2.5 bg-brand-purple/20 hover:bg-brand-purple/35 border border-brand-purple/30 rounded-xl text-xs font-bold text-brand-pink transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  {quizLoading ? 'Generating Quiz...' : 'Generate Practice Quiz'}
                </button>

                <button
                  disabled={flashcardsLoading || chatLoading}
                  onClick={() => handleGenerateFlashcards(customQuizTopic.trim() || profile.weakSubjects)}
                  className="w-full py-2.5 bg-brand-blue/20 hover:bg-brand-blue/35 border border-brand-blue/30 rounded-xl text-xs font-bold text-brand-blue transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  {flashcardsLoading ? 'Generating Flashcards...' : 'Generate Flashcards'}
                </button>
              </div>
            </div>

            {/* Simulated mock and oral test questions */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-100 mb-3">Suggested Twin Workouts</h3>
              
              <div className="space-y-2.5">
                {[
                  `Explain OSI Model layers (${profile.weakSubjects})`,
                  `QuickSort partition steps (${profile.strongSubjects.split(',')[0]})`,
                  'Practice SQL transactions & normalization rules'
                ].map((topic, i) => (
                  <button
                    key={i}
                    disabled={chatLoading}
                    onClick={() => {
                      setInputMessage(`Can you explain: "${topic}" step-by-step?`);
                      setActiveSubTab('chat');
                    }}
                    className="w-full p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-left text-[11px] font-medium text-gray-300 transition-colors flex justify-between items-center cursor-pointer"
                  >
                    <span>{topic}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}



      {/* ─── 5. CAREER MENTOR ─── */}
      {activeSubTab === 'career' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto items-stretch">
          
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-pink" />
                  <h2 className="text-base font-bold text-gray-100">Twin Career Coach</h2>
                </div>
                <button 
                  disabled={roadmapLoading}
                  onClick={handleGenerateRoadmap}
                  className="px-3 py-1.5 rounded-lg bg-brand-pink text-white font-bold text-xs hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1"
                >
                  {roadmapLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {careerRoadmap ? 'Regenerate Roadmap' : 'Generate Roadmap'}
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {careerRoadmap ? (
                  careerRoadmap.milestones.map((ms, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                      <h4 className="text-xs font-bold text-brand-teal">{ms.phase}</h4>
                      <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                        {ms.tasks.map((task, tid) => (
                          <li key={tid}>{task}</li>
                        ))}
                      </ul>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-1">Recommended: {ms.resource}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-white/5 border border-white/5 rounded-2xl border-dashed">
                    <p className="text-xs text-gray-500 italic">No roadmap generated yet. Click generate to plan your milestones for {profile.careerGoal}!</p>
                  </div>
                )}
              </div>
            </div>

            {careerRoadmap && (
              <div className="p-3.5 rounded-xl bg-brand-pink/15 border border-brand-pink/25 flex gap-2.5 items-start mt-4">
                <Target className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-brand-pink font-extrabold uppercase tracking-wide">Roadmap Advisory</span>
                  <p className="text-[11px] text-gray-200 mt-0.5 leading-relaxed">
                    Custom roadmap created for **{profile.careerGoal}**. Complete foundational algorithms before reviewing systems.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            
            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-brand-pink/20 to-brand-purple/20 border border-brand-pink/30 relative overflow-hidden group shadow-[0_0_20px_rgba(247,37,133,0.15)]">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-pink/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-brand-pink text-xs font-black uppercase tracking-widest">
                  <Star className="w-4 h-4 fill-brand-pink animate-pulse" />
                  <span>Pro Interview Simulator</span>
                </div>
                
                <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                  Test your skills with placement simulations, mock exams, or resume revisions.
                </p>

                <div className="space-y-2 border-t border-white/10 pt-4 text-xs font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-teal" />
                    <span>Mock Technical interviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-teal" />
                    <span>Resume optimization reviews</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-100 font-bold">Launch AI Simulators</h3>
              
              <button
                disabled={chatLoading}
                onClick={() => {
                  setInputMessage(`Let's start a mock technical interview for a ${profile.department} job placement. Ask me the first question!`);
                  setActiveSubTab('chat');
                }}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-left px-4 rounded-xl text-xs font-bold text-gray-200 transition-all flex justify-between items-center cursor-pointer"
              >
                <span>Mock Technical Interview</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>

              <button
                disabled={chatLoading}
                onClick={() => {
                  setInputMessage(`Can you check my resume? Here are my core details: I study at ${profile.college}, my CGPA is ${profile.targetCGPA}, and my core skills are ${profile.strongSubjects}. Highlight 3 quick improvement tips.`);
                  setActiveSubTab('chat');
                }}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-left px-4 rounded-xl text-xs font-bold text-gray-200 transition-all flex justify-between items-center cursor-pointer"
              >
                <span>Resume Optimizer Pro</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>

              <button
                disabled={chatLoading}
                onClick={() => {
                  setInputMessage(`I have an upcoming viva on the subject "${profile.weakSubjects}". Ask me 3 challenging questions step-by-step to test my knowledge.`);
                  setActiveSubTab('chat');
                }}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-left px-4 rounded-xl text-xs font-bold text-gray-200 transition-all flex justify-between items-center cursor-pointer"
              >
                <span>AI Viva Preparation</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
