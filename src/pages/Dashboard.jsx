import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Award, Clock, ArrowUpRight, AlertTriangle, Send, 
  Loader2, Flame, BarChart2, BookOpen, User, CheckCircle2, ChevronRight, Zap, Star, Compass, Trophy,
  Briefcase, Cpu, Shield, ShieldCheck, Code2, FileText, HelpCircle, ClipboardList, Target, Map, Users, ShoppingCart, Lock, Rocket, Video, GraduationCap
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { getLiveMentorData } from '../services/mentorDataService';
import { generateTwinResponse } from '../services/aiService';
import { getCollegeByEmail } from '../data/collegesData';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit, where, getDoc, doc } from 'firebase/firestore';
import Dashboard3DBackground from '../components/Dashboard3DBackground';
import LumixoraHeroSuite from '../components/dashboard/LumixoraHeroSuite';
import StudentDnaCard from '../components/omiverse/StudentDnaCard';
import UnifiedCommandHub from '../components/dashboard/UnifiedCommandHub';
import VyomraProveModal from '../components/omiverse/VyomraProveModal';
import { cloudSync } from '../services/cloudSyncService';
import { useGamification } from '../context/GamificationContext';
import { ALL_ACHIEVEMENTS, getPlacementTier } from '../services/gamificationService';
import { isGprecPlacementSubdomain } from '../utils/placementSubdomain';

export default function Dashboard({ setActiveTab, user }) {
  const handleOpenOnboarding = () => window.dispatchEvent(new CustomEvent('lumixora_open_onboarding'));
  const { tasks, doubts, notes } = useData();
  const { addToast } = useToast();
  const userId = user?.uid || user?.email || 'default';
  const chatEndRef = useRef(null);
  const { profile: gamifyProfile, challenges } = useGamification ? useGamification() : { profile: null, challenges: { daily: [], weekly: [] } };
  const [isProveModalOpen, setIsProveModalOpen] = useState(false);

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
    let metadata = { 
      qualification: user?.qualification || 'B.Tech', 
      college: fallbackCollege, 
      place: user?.place || 'Kurnool, AP', 
      year: user?.year || user?.yearOfStudy || '1st Year', 
      avatarUrl: user?.avatarUrl || user?.photoURL || '' 
    };
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
    { name: 'Rahul K.', text: 'Vyomra completely transformed how I study for my exams!', rating: 5 },
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

      {/* 🌟 1. Flagship Hero Spotlight Banner (Career Commitment • Founder's Journey • AI Predictor) 🌟 */}
      {!isGprecPlacementSubdomain() && (
        <LumixoraHeroSuite onNavigateTab={setActiveTab} user={user} />
      )}

      {/* ⚡ 1.5. Today's Scholar Sprint (Daily High-Impact Focus Bar) ⚡ */}
      {!isGprecPlacementSubdomain() && (
        <div className="animate-fade-in my-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0f172a]/70 to-indigo-950/40 border border-cyan-500/30 p-3.5 backdrop-blur-md shadow-lg shadow-cyan-950/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 flex-shrink-0">
                  <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-wider uppercase text-cyan-400">Today's Scholar Sprint</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Day Priority</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5 font-medium">Keep your momentum alive — complete 1 core focus block today.</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('coding-practice')}
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Codeverse DSA
                </button>
                <button
                  onClick={() => setActiveTab('notes-platform')}
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Curated Notes
                </button>
                <button
                  onClick={() => setActiveTab('ai-mock-interview')}
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                >
                  <Zap className="w-3.5 h-3.5" />
                  AI Interview
                </button>
                <button
                  onClick={() => setActiveTab('doubt-solving')}
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Ask Doubt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⚡ 2 & 3. Clean 4-Track Command Switcher & Unified Interactive Portal Grid (100% Intact - All 36 Portals) ⚡ */}
      <div className="animate-fade-in my-3">
        <UnifiedCommandHub 
          onNavigateTab={setActiveTab} 
          onOpenProveModal={() => setIsProveModalOpen(true)} 
        />
      </div>

      {/* 📊 4. Student AI Talent Graph & DNA (Streamlined readiness metrics, next best action, verified proofs) 📊 */}
      <div className="animate-fade-in my-3">
        <StudentDnaCard 
          user={user} 
          onNavigateTab={setActiveTab} 
          onOpenProveModal={() => setIsProveModalOpen(true)} 
        />
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
                <p className="text-[10px] text-gray-400 tracking-wide uppercase">Help us improve Vyomra</p>
              </div>
            </div>
            
            <p className="text-xs text-gray-300 mb-5 leading-relaxed">
              {feedbackQuestions.length > 0 ? "Please answer the following questions to help us improve." : "How has your experience with Vyomra been so far? As our founder believes in constant innovation, your thoughts matter directly to our journey."}
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

      {/* ─── VYOMRA PROVE: TRUST LAYER MODAL ─── */}
      <VyomraProveModal
        isOpen={isProveModalOpen}
        onClose={() => setIsProveModalOpen(false)}
        onNavigateTab={setActiveTab}
        user={user}
      />
    </div>
  );
}
