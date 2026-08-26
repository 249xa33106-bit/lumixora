import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Award, Clock, ArrowUpRight, AlertTriangle, Send, 
  Loader2, Flame, BarChart2, BookOpen, User, CheckCircle2, ChevronRight, Zap, Star, Compass, Trophy,
  Briefcase, Cpu, Shield, ShieldCheck, Code2, FileText, HelpCircle, ClipboardList, Target, Map, Users, ShoppingCart, Lock, Rocket, Video
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { getLiveMentorData } from '../services/mentorDataService';
import { generateTwinResponse } from '../services/aiService';
import { getCollegeByEmail } from '../data/collegesData';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit, where, getDoc, doc } from 'firebase/firestore';
import Dashboard3DBackground from '../components/Dashboard3DBackground';

export default function Dashboard({ setActiveTab, user }) {
  const { tasks, doubts, notes } = useData();
  const { addToast } = useToast();
  const userId = user?.uid || user?.email || 'default';
  const chatEndRef = useRef(null);

  // ─── Clean Student Name ────────────────────────────────────────────────────
  const cleanScholarName = (str) => {
    if (!str || typeof str !== 'string') return 'Scholar';
    let cleaned = str;
    if (cleaned.includes('{')) {
      cleaned = cleaned.split('{')[0].trim();
    }
    cleaned = cleaned.replace(/[\{\}":;]/g, '').trim();
    return cleaned || 'Scholar';
  };

  const parseUserProfile = (fullName) => {
    let rawStr = fullName || '';
    let name = cleanScholarName(rawStr);
    const matchedCollege = getCollegeByEmail(user?.email);
    const fallbackCollege = user?.college || user?.collegeName || matchedCollege?.shortName || matchedCollege?.name || 'GPREC';
    let metadata = { qualification: '', college: fallbackCollege, place: 'Kurnool, AP', year: '1st Year', avatarUrl: '' };
    if (rawStr.includes('{')) {
      const idx = rawStr.indexOf('{');
      const jsonStr = rawStr.substring(idx).trim();
      try {
        const rawJson = JSON.parse(jsonStr);
        if (rawJson && typeof rawJson === 'object') {
          Object.keys(rawJson).forEach(k => {
            const lowerK = k.toLowerCase();
            if (lowerK === 'qualification') metadata.qualification = rawJson[k];
            if (lowerK === 'college') metadata.college = rawJson[k];
            if (lowerK === 'place') metadata.place = rawJson[k];
            if (lowerK === 'year') metadata.year = rawJson[k];
            if (lowerK === 'avatarurl') metadata.avatarUrl = rawJson[k];
          });
        }
      } catch (e) {
        const qualMatch = jsonStr.match(/"qualification"\s*:\s*"([^"]+)"/i);
        const collMatch = jsonStr.match(/"college"\s*:\s*"([^"]+)"/i);
        const placeMatch = jsonStr.match(/"place"\s*:\s*"([^"]+)"/i);
        const yearMatch = jsonStr.match(/"year"\s*:\s*"([^"]+)"/i);
        const avatarMatch = jsonStr.match(/"avatarurl"\s*:\s*"([^"]+)"/i);
        if (qualMatch) metadata.qualification = qualMatch[1];
        if (collMatch) metadata.college = collMatch[1];
        if (placeMatch) metadata.place = placeMatch[1];
        if (yearMatch) metadata.year = yearMatch[1];
        if (avatarMatch) metadata.avatarUrl = avatarMatch[1];
      }
    }
    return { name: name || 'Scholar', ...metadata };
  };
  
  const studentProfile = parseUserProfile(user?.name || user?.displayName);

  // ─── Launchpad Category Filter State ──────────────────────────────────────
  const [launchpadCategory, setLaunchpadCategory] = useState('all');

  // ─── Feedback State ────────────────────────────────────────────────────────
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [feedbackAnswers, setFeedbackAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState([
    { name: 'Rahul K.', text: 'Lumixora completely transformed how I study for my exams!', rating: 5 },
    { name: 'Sneha M.', text: 'The AI Twin is like having a personal tutor 24/7.', rating: 4.5 },
    { name: 'Aman S.', text: 'I love the task tracking and readiness score features.', rating: 4 }
  ]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const q = query(
          collection(db, 'feedbacks'),
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => doc.data());
        
        if (fetched.length > 0) {
          // Sort to put pinned feedbacks at the top
          const sorted = fetched.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return 0;
          });
          setFeedbacks(sorted);
        }
      } catch (e) {
        console.error("Error fetching feedbacks:", e);
      }
    };
    fetchFeedbacks();

    const checkFormActive = async () => {
      try {
        const configDoc = await getDoc(doc(db, 'app_config', 'feedbacks_status'));
        let isActive = false;
        if (configDoc.exists()) {
          const data = configDoc.data();
          isActive = data.isActive || false;
          if (data.questions && Array.isArray(data.questions)) {
            setFeedbackQuestions(data.questions);
          } else if (data.customQuestion) {
            setFeedbackQuestions([data.customQuestion]);
          }
        }
        const hasGivenFeedback = localStorage.getItem(`feedback_given_${userId}`);
        
        if (isActive && !hasGivenFeedback) {
          const timer = setTimeout(() => {
            setShowFeedbackModal(true);
          }, 3000);
          return () => clearTimeout(timer);
        }
      } catch (e) {
        console.error("Error checking form status", e);
      }
    };
    checkFormActive();
  }, [userId]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    const hasAnswers = feedbackQuestions.length > 0 
      ? Object.values(feedbackAnswers).some(a => (a || '').trim() !== '')
      : feedbackInput.trim() !== '';
      
    if (!hasAnswers) return;

    let textFallback = '';
    let answersArr = null;

    if (feedbackQuestions.length > 0) {
      answersArr = feedbackQuestions.map((q, idx) => ({
        question: q,
        answer: feedbackAnswers[idx] || ''
      }));
      textFallback = answersArr.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n');
    } else {
      textFallback = feedbackInput;
    }

    const newFeedback = {
      name: studentProfile.name || 'Scholar',
      userId: userId,
      text: textFallback,
      answers: answersArr || [],
      rating: 5,
      status: 'pending',
      createdAt: serverTimestamp()
    };

    try {
      localStorage.setItem(`feedback_given_${userId}`, 'true');
      setShowFeedbackModal(false);
      addToast({ message: 'Thank you! Your feedback is pending approval.', type: 'success' });

      // Save to DB
      await addDoc(collection(db, 'feedbacks'), newFeedback);

    } catch (e) {
      console.error(e);
      addToast({ message: 'Error submitting feedback', type: 'error' });
    }
  };



  // ─── Timetable & Intelligence Harvester ────────────────────────────────────
  const [timetable] = useState(() => {
    const saved = localStorage.getItem('lumixora_timetable');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const liveMentorData = getLiveMentorData(userId, tasks, notes, doubts, user);
  const profile = liveMentorData.profile;
  const metrics = liveMentorData.metrics;

  const synergyScore = metrics.compositeReadiness;
  const consistencyScore = Math.min(100, (liveMentorData.analytics.totalSessions * 10));
  const focusScore = liveMentorData.analytics.totalSessions > 0 ? (liveMentorData.analytics.avgFocusScore || 0) : 0;
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

  // ─── Target Exam Countdown ────────────────────────────────────────────────
  const [examCountdown, setExamCountdown] = useState(null);
  const [isWarMode, setIsWarMode] = useState(false);

  useEffect(() => {
    const targetDateStr = localStorage.getItem('lumixora_targetExamDate');
    if (!targetDateStr) return;

    const calculateDays = () => {
      const now = new Date().getTime();
      const target = new Date(targetDateStr).getTime();
      const distance = target - now;
      const days = Math.ceil(distance / (1000 * 60 * 60 * 24));
      setExamCountdown(days > 0 ? days : 0);
      setIsWarMode(days > 0 && days <= 15);
    };

    calculateDays();
    const interval = setInterval(calculateDays, 60000);
    return () => clearInterval(interval);
  }, []);

  // ─── Weakness Diagnostic Warnings ─────────────────────────────────────────
  const [warnings, setWarnings] = useState([]);
  useEffect(() => {
    const list = [];
    if (profile.weakSubjects) {
      const weakSub = profile.weakSubjects;
      const progress = liveMentorData.syllabusProgress?.[weakSub] || {};
      const units = Object.values(progress);
      const completed = units.filter(u => u === true).length;
      const total = units.length || 5;
      const pct = Math.round((completed / total) * 100);

      list.push({
        subject: weakSub,
        text: `Low proficiency: Study coverage is only ${pct}%.`,
        recommendation: `Revise flashcards or take a custom AI quiz.`
      });
    }
    if (twinData.tasksStats.completionRate < 65 && twinData.tasksStats.total > 0) {
      list.push({
        subject: 'Milestones',
        text: `Incomplete tasks detected (${twinData.tasksStats.completionRate}% complete).`,
        recommendation: `Schedule 1 study sprint to resolve backlog.`
      });
    }
    setWarnings(list);
  }, [profile.weakSubjects, twinData.tasksStats.completionRate, liveMentorData.syllabusProgress]);

  // ─── Mini AI Twin Chat Console ─────────────────────────────────────────────
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi ${studentProfile.name}! I am your AI Academic Twin™. How can I help you today?` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || chatLoading) return;

    const userMsg = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setChatLoading(true);

    try {
      const response = await generateTwinResponse([...messages, userMsg], twinData, 'Intermediate');
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      addToast({ message: 'Could not reach your AI Academic Twin.', type: 'error' });
    } finally {
      setChatLoading(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ─── AI Roadmap Generator ──────────────────────────────────────────────────
  const [quizState, setQuizState] = useState('start'); // start, quiz, loading, result
  const [quizAnswers, setQuizAnswers] = useState({
    targetRole: '',
    currentLevel: ''
  });
  const [aiRoadmap, setAiRoadmap] = useState(null);

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setQuizState('loading');

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      // Offline fallback roadmap
      setTimeout(() => {
        setAiRoadmap({
          roadmap: [
            { step: 1, title: `Basics of ${quizAnswers.targetRole}`, desc: `Understand fundamental concepts for a ${quizAnswers.currentLevel} level.`, videos: ['Introductory Crash Course'], practical: 'Build a Hello World project.' },
            { step: 2, title: `Intermediate Patterns`, desc: `Learn standard industry practices.`, videos: ['Advanced Patterns Tutorial'], practical: 'Refactor your project.' }
          ],
          market: {
            demand: 'High demand in tech hubs.',
            companies: ['TechCorp', 'InnovateInc']
          }
        });
        setQuizState('result');
      }, 1500);
      return;
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are an expert career counselor and tutor. Generate a highly detailed roadmap. 
Return ONLY a valid JSON object with the following schema:
{
  "roadmap": [
    {
      "step": 1,
      "title": "...",
      "desc": "...",
      "videos": ["...", "..."],
      "practical": "..."
    }
  ],
  "market": {
    "demand": "...",
    "companies": ["...", "..."]
  }
}
Do NOT use markdown backticks. Return raw JSON.`
            },
            {
              role: "user",
              content: `Target Goal/Role: ${quizAnswers.targetRole}. Current Level: ${quizAnswers.currentLevel}.`
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
      setAiRoadmap(JSON.parse(content));
      setQuizState('result');
    } catch (err) {
      console.error(err);
      setAiRoadmap({
        roadmap: [
          { step: 1, title: `Start learning ${quizAnswers.targetRole}`, desc: `Focus on visual crash courses for ${quizAnswers.currentLevel}.`, videos: ['YouTube Crash Course'], practical: 'Build a small app.' }
        ],
        market: { demand: 'Growing demand', companies: ['Startups'] }
      });
      setQuizState('result');
    }
  };

  return (
    <div className={`space-y-8 animate-fade-in pb-12 relative ${isWarMode ? 'border-t-4 border-t-red-600' : ''}`}>
      {/* 🔮 Interactive 3D WebGL Neural Background 🔮 */}
      <Dashboard3DBackground />

      {/* 🌟🌟🌟 Premium Founder Banner & Story 🌟🌟🌟 */}
      <div className="w-full space-y-6 relative z-10">
        {/* Banner Image */}
        <div className="w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl aspect-[1024/480] md:aspect-[21/9]">
          <img 
            src="/founder_banner.jpg" 
            alt="LUMIXORA Learn Smarter - Founder Shaik Sowban" 
            className="w-full h-full object-cover object-center select-none"
          />
        </div>

        {/* Founder Story */}
        <div className="glass-panel p-6 md:p-10 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
          {/* Background Glow Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-pink/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
          
          <h2 className="text-2xl md:text-4xl font-black text-white mb-6 tracking-tight relative z-10 flex items-center gap-3">
            The Journey of Innovation
          </h2>
          
          <div className="max-w-5xl relative z-10">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 italic border-l-4 border-brand-teal/30 pl-6 py-2 bg-gradient-to-r from-brand-teal/5 to-transparent rounded-r-xl">
              "Every great platform starts with a single problem. For Lumixora, it was the realization that learning shouldn't be a one-size-fits-all struggle. Built from late-night coding sessions and an unyielding belief in personalized education, our mission is to empower every student to reach their peak potential. Your journey to excellence starts here."
            </p>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-white/5 pt-6">
              <div>
                <p className="text-[#00dfc4] font-bold text-sm md:text-base mb-1">
                  — Shaik Sowban
                </p>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">
                  Founder, Lumixora
                </p>
              </div>

              <div className="flex items-center gap-4 bg-black/40 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-md transition-all hover:bg-black/60">
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shadow-[0_0_15px_rgba(255,107,0,0.3)]">
                  <Flame className="w-5 h-5 fill-current animate-pulse" />
                </div>
                <span className="text-xs md:text-sm font-bold text-white uppercase tracking-[0.15em]">
                  Keep pushing boundaries
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* ─── Welcome Quick Stats Row ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome Actions Card */}
        <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between border border-border-glass md:col-span-2 animate-fade-in-up animate-stagger-1 ">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 border border-white/10 text-[10px] font-bold text-brand-teal tracking-wide">
              <Zap className="w-3 h-3 animate-bounce" />
              <span>Academic Twin Connected</span>
            </div>
            <h1 className="text-xl font-extrabold text-white">
              Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-blue">{studentProfile.name}</span>
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              Lumixora is tracking your stats. Your target CGPA is **{profile.targetCGPA}** and career path is **{profile.careerGoal}**. Keep your Synergy indicator high to maintain perfect alignment.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <button 
              onClick={() => setActiveTab('hackathons')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>🏆 Hackathons & Internships</span>
            </button>
            <button 
              onClick={() => setActiveTab('grievance')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>🔒 Anonymous Grievances</span>
            </button>
            <button 
              onClick={() => setActiveTab('doubts')}
              className="px-4 py-2.5 rounded-xl bg-brand-pink hover:opacity-95 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              Ask AI Assistant
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('lumixora_open_tour'))}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-brand-teal border border-brand-teal/30 font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Platform Tour</span>
            </button>
          </div>
        </div>
        {/* Real-Time Synergy Indicator Widget */}
        <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-border-glass flex flex-col items-center justify-center text-center animate-fade-in-up animate-stagger-2 ">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
              <circle 
                cx="50" cy="50" r="42" 
                stroke={isWarMode ? "#ef4444" : "#00f5d4"} strokeWidth="7" fill="transparent" 
                strokeDasharray="263.89" 
                strokeDashoffset={263.89 - (263.89 * twinData.metrics.synergyScore) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-extrabold text-white">{twinData.metrics.synergyScore}%</span>
              <span className="text-[7px] text-gray-500 font-bold uppercase tracking-wide">Synergy</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-[9px] text-brand-pink font-extrabold uppercase block tracking-wider">Twin Health</span>
            <h4 className="text-xs font-bold text-gray-200">Consistency: {twinData.metrics.consistencyScore}%</h4>
          </div>
        </div>
      </div>

      {/* ─── 🚀 ESSENTIAL STUDENT PLATFORM LAUNCHPAD (CATEGORIZED) ─── */}
      <div className="space-y-5 animate-fade-in my-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-[10px] font-black uppercase tracking-wider">
              <Zap className="w-3 h-3 animate-bounce" /> Lumixora Student Super-Tools
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>🚀 Essential Campus Portals & Tools</span>
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/10 overflow-x-auto max-w-full">
            {[
              { id: 'all', label: 'All Super-Tools', icon: Sparkles, count: 16 },
              { id: 'exams', label: '📚 Exam Preparation', count: 5 },
              { id: 'career', label: '💼 Career & Placements', count: 6 },
              { id: 'campus', label: '🏫 Campus & Productivity', count: 5 }
            ].map(cat => {
              const isSelected = launchpadCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setLaunchpadCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-teal to-brand-purple text-black shadow-md shadow-brand-teal/20 scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            // ── EXAM PREPARATION CATEGORY (5 Tools) ──
            {
              id: 'videos',
              category: 'exams',
              categoryLabel: 'Exam Prep',
              title: 'Academic Video Lectures',
              desc: 'Branch & Sem-wise verified video lectures, one-shot marathons & unit syllabus playlists',
              icon: Video,
              badge: 'SEM WISE 🎬',
              badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
              gradient: 'from-rose-950/40 via-purple-900/10 to-black/80',
              borderColor: 'border-rose-500/30 hover:border-rose-400 shadow-rose-500/5',
              iconBg: 'bg-rose-500 text-white',
            },
            {
              id: 'notes',
              category: 'exams',
              categoryLabel: 'Exam Prep',
              title: 'Previous Question Papers',
              desc: 'Semester PYQs, solved university model papers & verified lecture notes',
              icon: FileText,
              badge: 'EXAMS 🎓',
              badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
              gradient: 'from-blue-950/40 via-indigo-900/10 to-black/80',
              borderColor: 'border-blue-500/30 hover:border-blue-400 shadow-blue-500/5',
              iconBg: 'bg-blue-400 text-black',
            },
            {
              id: 'learning-hub',
              category: 'exams',
              categoryLabel: 'Exam Prep',
              title: 'Learning Hub & Notes',
              desc: 'Curated semester study modules, formula cheat-sheets & structured learning materials',
              icon: BookOpen,
              badge: 'STUDY HUB 📖',
              badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
              gradient: 'from-emerald-950/40 via-teal-900/10 to-black/80',
              borderColor: 'border-emerald-500/30 hover:border-emerald-400 shadow-emerald-500/5',
              iconBg: 'bg-emerald-400 text-black',
            },
            {
              id: 'doubts',
              category: 'exams',
              categoryLabel: 'Exam Prep',
              title: '24/7 AI Doubt Solver',
              desc: 'Step-by-step concept explanations with LaTeX math, diagrams & code',
              icon: HelpCircle,
              badge: 'AI TUTOR 🧠',
              badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
              gradient: 'from-pink-950/40 via-rose-900/10 to-black/80',
              borderColor: 'border-pink-500/30 hover:border-pink-400 shadow-pink-500/5',
              iconBg: 'bg-pink-400 text-black',
            },
            {
              id: 'test-portal',
              category: 'exams',
              categoryLabel: 'Exam Prep',
              title: 'Test Portal & Mock Exams',
              desc: 'Timed subject assessments, GATE test bank & instant score analysis',
              icon: Target,
              badge: 'MOCK EXAMS 🎯',
              badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
              gradient: 'from-rose-950/40 via-red-900/10 to-black/80',
              borderColor: 'border-rose-500/30 hover:border-rose-400 shadow-rose-500/5',
              iconBg: 'bg-rose-400 text-black',
            },

            // ── CAREER & PLACEMENTS CATEGORY (6 Tools) ──
            {
              id: 'ai-commander',
              category: 'career',
              categoryLabel: 'Career & Placement',
              title: 'AI Placement Commander™',
              desc: 'ATS resume scanner, system design architect & DSA mock technical interviews',
              icon: Cpu,
              badge: 'PRO 🔥',
              badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
              gradient: 'from-purple-950/40 via-indigo-900/10 to-black/80',
              borderColor: 'border-purple-500/30 hover:border-purple-400 shadow-purple-500/5',
              iconBg: 'bg-purple-400 text-black',
            },
            {
              id: 'resume',
              category: 'career',
              categoryLabel: 'Career & Placement',
              title: 'AI Resume Builder & PDF',
              desc: 'ATS-optimized templates, AI STAR bullet writer & 1-click high-resolution A4 vector PDF download',
              icon: FileText,
              badge: 'PDF EXPORT 📄',
              badgeColor: 'bg-[#00f5d4]/20 text-[#00f5d4] border-[#00f5d4]/40',
              gradient: 'from-teal-950/40 via-cyan-900/10 to-black/80',
              borderColor: 'border-[#00f5d4]/30 hover:border-[#00f5d4] shadow-[#00f5d4]/5',
              iconBg: 'bg-[#00f5d4] text-black',
            },
            {
              id: 'coding-practice',
              category: 'career',
              categoryLabel: 'Career & Placement',
              title: 'Code Arena & LeetCode DSA',
              desc: 'Interactive compiler, curated algorithmic challenges & campus leaderboard',
              icon: Code2,
              badge: 'COMPILER ⚡',
              badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
              gradient: 'from-cyan-950/40 via-blue-900/10 to-black/80',
              borderColor: 'border-cyan-500/30 hover:border-cyan-400 shadow-cyan-500/5',
              iconBg: 'bg-cyan-400 text-black',
            },
            {
              id: 'hackathons',
              category: 'career',
              categoryLabel: 'Career & Placement',
              title: 'Hackathons & Internships',
              desc: '28+ FAANG/HFT internships up to ₹2.5L/mo, SIH, GSoC & Squad Matcher',
              icon: Trophy,
              badge: 'HOT 💼',
              badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
              gradient: 'from-amber-950/40 via-amber-900/10 to-black/80',
              borderColor: 'border-amber-500/30 hover:border-amber-400 shadow-amber-500/5',
              iconBg: 'bg-amber-400 text-black',
            },
            {
              id: 'projects',
              category: 'career',
              categoryLabel: 'Career & Placement',
              title: 'Project Showcase & Expo',
              desc: 'Publish your side-projects, AI models & builds, get upvotes, find teammates & AI resume bullets',
              icon: Rocket,
              badge: 'SHOWCASE 🚀',
              badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
              gradient: 'from-purple-950/40 via-indigo-900/10 to-black/80',
              borderColor: 'border-purple-500/30 hover:border-purple-400 shadow-purple-500/5',
              iconBg: 'bg-gradient-to-r from-purple-500 to-[#00f5d4] text-black',
            },
            {
              id: 'career-roadmap',
              category: 'career',
              categoryLabel: 'Career & Placement',
              title: 'Career Roadmap & Skills',
              desc: 'Step-by-step career path tailored for SDE, AI/ML, Cloud & Core domains',
              icon: Map,
              badge: 'ROADMAP 🗺️',
              badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
              gradient: 'from-violet-950/40 via-purple-900/10 to-black/80',
              borderColor: 'border-violet-500/30 hover:border-violet-400 shadow-violet-500/5',
              iconBg: 'bg-violet-400 text-black',
            },

            // ── CAMPUS LIFE & PRODUCTIVITY CATEGORY (5 Tools) ──
            {
              id: 'attendance',
              category: 'campus',
              categoryLabel: 'Campus Life',
              title: 'My Attendance & Bunk Calc',
              desc: 'Subject-wise 75% threshold monitor, safe leaves simulator & alerts',
              icon: ClipboardList,
              badge: '75% CRITICAL',
              badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
              gradient: 'from-yellow-950/40 via-amber-900/10 to-black/80',
              borderColor: 'border-yellow-500/30 hover:border-yellow-400 shadow-yellow-500/5',
              iconBg: 'bg-yellow-400 text-black',
            },
            {
              id: 'future-twin',
              category: 'campus',
              categoryLabel: 'Campus Life',
              title: 'AI Future Twin™ & CGPA',
              desc: 'Simulate semester CGPA scenarios, study consistency & exam readiness',
              icon: Sparkles,
              badge: 'AI TWIN 🔮',
              badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
              gradient: 'from-teal-950/40 via-emerald-900/10 to-black/80',
              borderColor: 'border-teal-500/30 hover:border-teal-400 shadow-teal-500/5',
              iconBg: 'bg-teal-400 text-black',
            },
            {
              id: 'grievance',
              category: 'campus',
              categoryLabel: 'Campus Life',
              title: 'Anonymous Grievances',
              desc: 'Encrypted teaching & classroom feedback routed to professors via Unique Code',
              icon: ShieldCheck,
              badge: 'ENCRYPTED 🔒',
              badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
              gradient: 'from-emerald-950/40 via-teal-900/10 to-black/80',
              borderColor: 'border-emerald-500/30 hover:border-emerald-400 shadow-emerald-500/5',
              iconBg: 'bg-emerald-400 text-black',
            },
            {
              id: 'community',
              category: 'campus',
              categoryLabel: 'Campus Life',
              title: 'Class Community & Squads',
              desc: 'Connect with GPREC & Ashoka peers, join study rooms & collaborate',
              icon: Users,
              badge: 'CAMPUS 👥',
              badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
              gradient: 'from-sky-950/40 via-blue-900/10 to-black/80',
              borderColor: 'border-sky-500/30 hover:border-sky-400 shadow-sky-500/5',
              iconBg: 'bg-sky-400 text-black',
            },
            {
              id: 'marketplace',
              category: 'campus',
              categoryLabel: 'Campus Life',
              title: 'Campus Marketplace',
              desc: 'Buy, sell & exchange engineering textbooks, drafters, calculators & lab coats',
              icon: ShoppingCart,
              badge: 'EXCHANGE 🛍️',
              badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
              gradient: 'from-emerald-950/40 via-green-900/10 to-black/80',
              borderColor: 'border-emerald-500/30 hover:border-emerald-400 shadow-emerald-500/5',
              iconBg: 'bg-emerald-400 text-black',
            }
          ]
            .filter(item => launchpadCategory === 'all' || item.category === launchpadCategory)
            .map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`group relative p-5 rounded-3xl border bg-gradient-to-br ${item.gradient} ${item.borderColor} backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 shadow-lg`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`p-3 rounded-2xl ${item.iconBg} shadow-md group-hover:rotate-6 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <h3 className="text-sm font-black text-white group-hover:text-brand-teal transition-colors flex items-center gap-1.5">
                      <span>{item.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-brand-teal" />
                    </h3>
                    <p className="text-[11px] text-gray-300 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-extrabold text-gray-400 group-hover:text-white transition-colors">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">{item.categoryLabel}</span>
                    <span className="flex items-center gap-1">Launch <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ─── Main 3-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8-Column Block */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* AI Weakness & Patterns Warning Alerts */}
          {warnings.length > 0 && (
            <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-3 animate-fade-in-up animate-stagger-3 ">
              <h3 className="text-xs font-extrabold tracking-wide text-gray-100 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-brand-orange animate-pulse" /> Real-Time Cognitive Alerts
              </h3>
              
              <div className="space-y-2">
                {warnings.map((warn, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[9px] text-brand-orange font-extrabold uppercase block">{warn.subject} Warning</span>
                      <h4 className="text-xs font-semibold text-gray-200 mt-0.5">{warn.text}</h4>
                      <p className="text-[10px] text-gray-400 mt-1">{warn.recommendation}</p>
                    </div>

                    <button 
                      onClick={() => handleQuizSubmit(new Event('submit'))}
                      className="text-[9px] font-extrabold uppercase tracking-wide px-3 py-1.5 rounded bg-brand-orange/20 border border-white/10 text-brand-orange hover:bg-brand-orange hover:text-black transition-all cursor-pointer shrink-0"
                    >
                      Remediate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommended Study Plan Generator */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden animate-fade-in-up animate-stagger-1 ">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-brand-pink animate-spin" />
              <h3 className="text-xs font-extrabold tracking-wide text-gray-100">AI Target Roadmap Builder</h3>
            </div>

            {quizState === 'start' && (
              <div className="text-center py-6 bg-white/5 border border-white/5 rounded-xl">
                <p className="text-xs text-gray-400 mb-4">Assemble an immediate review strategy based on your target weakness.</p>
                <button 
                  onClick={() => setQuizState('quiz')}
                  className="px-5 py-2 rounded-xl bg-brand-pink text-white font-bold text-xs uppercase tracking-wide cursor-pointer shadow-sm hover:scale-105 transition-transform"
                >
                  Configure Study Plan
                </button>
              </div>
            )}

            {quizState === 'quiz' && (
              <form onSubmit={handleQuizSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Target Goal / Role</label>
                    <input 
                      type="text" 
                      value={quizAnswers.targetRole} 
                      onChange={(e) => setQuizAnswers({...quizAnswers, targetRole: e.target.value})}
                      placeholder="e.g. Frontend Developer" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-teal"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Current Level</label>
                    <input 
                      type="text" 
                      value={quizAnswers.currentLevel} 
                      onChange={(e) => setQuizAnswers({...quizAnswers, currentLevel: e.target.value})}
                      placeholder="e.g. Beginner in HTML/CSS" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-teal"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end border-t border-white/5 pt-3">
                  <button type="submit" className="bg-brand-pink text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer hover:scale-105 transition-transform">Generate Roadmap</button>
                  <button type="button" onClick={() => setQuizState('start')} className="bg-white/5 border border-white/5 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer transition-colors">Cancel</button>
                </div>
              </form>
            )}

            {quizState === 'loading' && (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-6 h-6 text-brand-pink animate-spin mb-2" />
                <p className="text-xs font-bold text-gray-300">Harvester compiling variables...</p>
              </div>
            )}

            {quizState === 'result' && aiRoadmap && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <span className="text-[10px] bg-brand-pink/20 text-brand-pink border border-brand-pink/30 px-2.5 py-1 rounded-md font-black uppercase tracking-widest">Your Master Plan</span>
                    <h4 className="text-white font-bold text-sm mt-1">{quizAnswers.targetRole} Roadmap</h4>
                  </div>
                  <button onClick={() => setQuizState('start')} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-gray-300 font-bold transition-all">New Roadmap</button>
                </div>

                {/* Steps Timeline */}
                <div className="space-y-4">
                  {aiRoadmap.roadmap?.map((task, i) => (
                    <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-brand-teal/30 transition-all flex gap-4 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-teal to-brand-blue opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="w-8 h-8 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center text-xs font-black shrink-0 border border-brand-teal/30 shadow-[0_0_10px_rgba(0,245,212,0.2)]">
                        {task.step || (i + 1)}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white mb-1">{task.title}</h4>
                        <p className="text-xs text-gray-400 mb-3">{task.desc}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-[9px] text-brand-orange uppercase font-bold tracking-wider mb-2 block flex items-center gap-1"><Sparkles className="w-3 h-3"/> Videos</span>
                            <ul className="list-disc pl-4 space-y-1.5">
                              {task.videos?.map((vid, idx) => (
                                <li key={idx} className="text-[10px] text-gray-300 italic">
                                  <a 
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(vid)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-brand-orange transition-colors underline decoration-white/20 underline-offset-2"
                                  >
                                    {vid}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors flex flex-col">
                            <span className="text-[9px] text-brand-teal uppercase font-bold tracking-wider mb-2 block flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Practical</span>
                            <p className="text-[10px] text-gray-300 flex-1">{task.practical}</p>
                            <a 
                              href={`https://www.google.com/search?q=${encodeURIComponent(task.practical + ' tutorial or exercise')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[9px] font-bold text-brand-teal hover:text-white transition-colors mt-2 underline decoration-brand-teal/50 underline-offset-2"
                            >
                              Find Resources & Tutorials →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Market Demand */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-purple/10 to-transparent border border-brand-purple/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="w-4 h-4 text-brand-purple" />
                    <h4 className="text-sm font-bold text-white">Market Insights</h4>
                  </div>
                  <p className="text-xs text-gray-300 mb-3">{aiRoadmap.market?.demand}</p>
                  <div className="flex flex-wrap gap-2">
                    {aiRoadmap.market?.companies?.map((company, idx) => (
                      <span key={idx} className="bg-brand-purple/20 text-brand-purple border border-brand-purple/30 px-2 py-1 rounded-md text-[10px] font-bold">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* User Feedback Display */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl animate-fade-in-up animate-stagger-3 ">
             <div className="flex items-center gap-2 mb-4">
               <User className="w-4 h-4 text-brand-teal" />
               <h3 className="text-xs font-extrabold tracking-wide text-gray-100">Community Voices</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {feedbacks.slice(0, 4).map((fb, i) => (
                 <div key={i} className={`p-4 rounded-xl bg-white/5 border relative transition-colors flex flex-col justify-between ${fb.isPinned ? 'border-brand-orange/40' : 'border-white/5 hover:border-white/10'}`}>
                   <div>
                     {fb.isPinned && (
                       <div className="absolute -top-2 -right-2 bg-brand-orange text-black p-1 rounded-full shadow-lg">
                         <Star className="w-2.5 h-2.5 fill-current" />
                       </div>
                     )}
                     <div className="flex items-center gap-1 mb-2">
                       {[...Array(fb.rating || 5)].map((_, j) => (
                         <Star key={j} className="w-3 h-3 text-brand-orange fill-brand-orange" />
                       ))}
                     </div>
                     <p className="text-xs text-gray-300 italic mb-3">"{fb.text}"</p>
                   </div>
                   
                   <div className="flex items-center gap-2 mt-auto pt-2 border-t border-white/5">
                     {fb.imageUrl ? (
                       <img src={fb.imageUrl} alt={fb.name} className="w-6 h-6 rounded-full object-cover border border-white/10" />
                     ) : (
                       <div className="w-6 h-6 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center text-[10px] font-bold border border-brand-teal/30 uppercase">
                         {fb.name.charAt(0)}
                       </div>
                     )}
                     <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wide">{fb.name}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>

        </div>

        {/* Right 4-Column Sidebar Block */}
        <div className="lg:col-span-4 space-y-6">
          


          {/* Mini Interactive AI Twin Chat Widget */}
          <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col h-[280px] animate-fade-in-up animate-stagger-3 ">
            <div className="p-3 bg-white/5 border-b border-white/5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-ping"></span>
              <span className="text-[10px] font-extrabold tracking-wide text-gray-300">Quick Twin Synchronizer</span>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl p-2.5 text-[11px] leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-brand-pink text-white rounded-br-none' 
                      : 'bg-white/5 border border-white/5 text-gray-300 rounded-bl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="text-[10px] text-gray-500 italic animate-pulse">Syncing...</div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-2 border-t border-white/5 flex gap-1.5">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your Twin..."
                className="flex-1 glass-input rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim() || chatLoading}
                className="p-1.5 rounded-lg bg-brand-pink text-white disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>



          {/* Badges Widget Removed */}

        </div>

      </div>

      {/* ─── Feedback Modal ─── */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f1115] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-pink/20 flex items-center justify-center text-brand-pink">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">We Value Your Feedback!</h3>
                <p className="text-[10px] text-gray-400 tracking-wide uppercase">Help us improve Lumixora</p>
              </div>
            </div>
            
            <p className="text-xs text-gray-300 mb-5 leading-relaxed">
              {feedbackQuestions.length > 0 ? "Please answer the following questions to help us improve." : "How has your experience with Lumixora been so far? As our founder believes in constant innovation, your thoughts matter directly to our journey."}
            </p>
            
            <form onSubmit={handleFeedbackSubmit}>
              {feedbackQuestions.length > 0 ? (
                <div className="space-y-4 mb-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {feedbackQuestions.map((q, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300 flex gap-2">
                        <span className="text-brand-teal">{idx + 1}.</span> {q}
                      </label>
                      <textarea
                        value={feedbackAnswers[idx] || ''}
                        onChange={(e) => setFeedbackAnswers({ ...feedbackAnswers, [idx]: e.target.value })}
                        placeholder="Your answer here..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-teal resize-none min-h-[80px] transition-colors"
                        required={idx === 0}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <textarea 
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Share your thoughts, suggestions, or love..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-teal resize-none h-28 mb-5 placeholder:text-gray-600 transition-colors"
                  required
                />
              )}
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowFeedbackModal(false);
                    localStorage.setItem(`feedback_given_${userId}`, 'skipped');
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
                >
                  Skip for Now
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-orange text-white text-xs font-extrabold shadow-lg shadow-brand-pink/20 hover:scale-105 transition-transform cursor-pointer"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
