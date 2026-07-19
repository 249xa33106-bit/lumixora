import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Award, Clock, ArrowUpRight, AlertTriangle, Send, 
  Loader2, Flame, BarChart2, BookOpen, User, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { getLiveMentorData } from '../services/mentorDataService';
import { generateTwinResponse } from '../services/aiService';

export default function Dashboard({ setActiveTab, user }) {
  const { tasks, doubts, notes } = useData();
  const { addToast } = useToast();
  const userId = user?.uid || user?.email || 'default';
  const chatEndRef = useRef(null);

  // ─── Clean Student Name ────────────────────────────────────────────────────
  const parseUserProfile = (fullName) => {
    let name = fullName || '';
    let metadata = { qualification: '', college: '', place: '', year: '1st Year', avatarUrl: '' };
    if (name.includes('{')) {
      const idx = name.indexOf('{');
      const jsonStr = name.substring(idx).trim();
      name = name.substring(0, idx).trim();
      try {
        metadata = JSON.parse(jsonStr);
      } catch (e) {}
    }
    return { name: name || 'Scholar', ...metadata };
  };
  
  const studentProfile = parseUserProfile(user?.name || user?.displayName);

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
  const consistencyScore = Math.min(100, (metrics.streak * 12) + (liveMentorData.analytics.totalSessions * 5));
  const focusScore = liveMentorData.analytics.totalSessions > 0 ? (liveMentorData.analytics.avgFocusScore || 0) : 0;
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
    { role: 'assistant', content: `Hi ${studentProfile.name}! I am your AI Academic Twin™. Your study streak is currently ${twinData.studyAnalytics.currentStreak} days. How can I help you today?` }
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
    subject: '',
    weakness: '',
    time: '1-5h',
    learningStyle: profile.learningStyle || 'practical',
    goal: 'pass'
  });
  const [aiRoadmap, setAiRoadmap] = useState([]);

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setQuizState('loading');

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      // Offline fallback roadmap
      setTimeout(() => {
        setAiRoadmap([
          { title: `Read summaries of ${quizAnswers.weakness}`, desc: `Focus on visual/practical learning templates.` },
          { title: `Solve 3 previous year questions on ${quizAnswers.subject}`, desc: `Practice with real GPREC exam papers.` },
          { title: `Review with AI Academic Twin`, desc: `Conduct a simulated oral viva session.` }
        ]);
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
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "You are an expert tutor. Generate a customized 3-step study roadmap. Return ONLY a valid JSON array of objects, each containing a 'title' (string) and 'desc' (string). No markdown backticks."
            },
            {
              role: "user",
              content: `Subject: ${quizAnswers.subject}. Weakness: ${quizAnswers.weakness}. Weekly hours: ${quizAnswers.time}. Style: ${quizAnswers.learningStyle}. Goal: ${quizAnswers.goal}.`
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
      setAiRoadmap([
        { title: `Study ${quizAnswers.weakness} concepts`, desc: `Focus on visual crash courses.` },
        { title: `Solve 5 GPREC exam questions`, desc: `Complete standard textbook questions.` }
      ]);
      setQuizState('result');
    }
  };

  return (
    <div className={`space-y-8 animate-fade-in pb-12 ${isWarMode ? 'border-t-4 border-t-red-600' : ''}`}>
      
      {/* ─── Premium Founder Banner ─── */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl aspect-[1024/480]">
        <img 
          src="/founder_banner.jpg" 
          alt="LUMIXORA Learn Smarter - Founder Shaik Sowban" 
          className="w-full h-full object-cover object-center select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* ─── Welcome Quick Stats Row ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome Actions Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-border-glass md:col-span-2">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-[10px] font-bold text-brand-teal uppercase tracking-wider">
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
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => {
                localStorage.setItem('mentor_subtab', 'profile');
                setActiveTab('mentor');
              }}
              className="px-4 py-2.5 rounded-xl bg-brand-pink hover:opacity-95 text-white font-bold text-xs shadow-[0_0_15px_rgba(247,37,133,0.35)] transition-all cursor-pointer"
            >
              Access Twin Profile
            </button>
            <button 
              onClick={() => setActiveTab('doubts')}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Ask AI Assistant
            </button>
          </div>
        </div>

        {/* Real-Time Synergy Indicator Widget */}
        <div className="glass-panel p-6 rounded-2xl border border-border-glass flex flex-col items-center justify-center text-center">
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

      {/* ─── Main 3-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8-Column Block */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* AI Weakness & Patterns Warning Alerts */}
          {warnings.length > 0 && (
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-100 flex items-center gap-1.5">
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
                      className="text-[9px] font-extrabold uppercase tracking-wide px-3 py-1.5 rounded bg-brand-orange/20 border border-brand-orange/30 text-brand-orange hover:bg-brand-orange hover:text-black transition-all cursor-pointer shrink-0"
                    >
                      Remediate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommended Study Plan Generator */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-brand-pink animate-spin" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-100">AI Target Roadmap Builder</h3>
            </div>

            {quizState === 'start' && (
              <div className="text-center py-6 bg-white/5 border border-white/5 rounded-xl">
                <p className="text-xs text-gray-400 mb-4">Assemble an immediate review strategy based on your target weakness.</p>
                <button 
                  onClick={() => setQuizState('quiz')}
                  className="px-5 py-2 rounded-xl bg-brand-pink text-white font-bold text-xs uppercase tracking-wide cursor-pointer shadow-[0_0_15px_rgba(247,37,133,0.25)]"
                >
                  Configure Study Plan
                </button>
              </div>
            )}

            {quizState === 'quiz' && (
              <form onSubmit={handleQuizSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Subject</label>
                    <input 
                      type="text" 
                      value={quizAnswers.subject} 
                      onChange={(e) => setQuizAnswers({...quizAnswers, subject: e.target.value})}
                      placeholder="e.g. Computer Networks" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Weak Concept</label>
                    <input 
                      type="text" 
                      value={quizAnswers.weakness} 
                      onChange={(e) => setQuizAnswers({...quizAnswers, weakness: e.target.value})}
                      placeholder="e.g. IP Subnetting" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end border-t border-white/5 pt-3">
                  <button type="submit" className="bg-brand-pink text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer">Generate Roadmap</button>
                  <button type="button" onClick={() => setQuizState('start')} className="bg-white/5 border border-white/5 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold uppercase">Cancel</button>
                </div>
              </form>
            )}

            {quizState === 'loading' && (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-6 h-6 text-brand-pink animate-spin mb-2" />
                <p className="text-xs font-bold text-gray-300">Harvester compiling variables...</p>
              </div>
            )}

            {quizState === 'result' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] bg-brand-pink/20 text-brand-pink border border-brand-pink/30 px-2 py-0.5 rounded font-extrabold uppercase">Generated Pathway</span>
                  <button onClick={() => setQuizState('start')} className="text-[10px] text-gray-400 hover:underline">Configure New</button>
                </div>

                <div className="space-y-2">
                  {aiRoadmap.map((task, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-brand-pink/35 transition-colors flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-pink/20 text-brand-pink flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-200">{task.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{task.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SVG Weekly Productivity Graphs */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-100 flex items-center gap-2 mb-4">
              <BarChart2 className="w-4 h-4 text-brand-teal" /> Weekly Study Allocation (Minutes per Subject)
            </h3>
            
            <div className="relative w-full h-44 bg-black/20 rounded-xl border border-white/5 p-4 flex flex-col justify-end">
              <div className="flex justify-between items-end h-32 px-4 relative z-10">
                {(() => {
                  const subjectMinutes = liveMentorData.analytics.subjects || {};
                  const subjectList = profile.subjects ? profile.subjects.split(',').map(s => s.trim()) : ['Data Structures', 'Database Systems', 'Computer Networks', 'Design and Analysis of Algorithms'];
                  
                  return subjectList.slice(0, 5).map((sub, i) => {
                    const colors = ['bg-brand-pink', 'bg-brand-blue', 'bg-brand-orange', 'bg-brand-purple', 'bg-brand-teal'];
                    const mins = subjectMinutes[sub] || 0;
                    const percent = mins > 0 ? Math.max(8, Math.min((mins / 360) * 100, 100)) : 0; // minimum 8px height so bar remains visible
                    return (
                      <div key={i} className="flex flex-col items-center gap-1.5 w-12">
                        <span className="text-[9px] text-gray-400 font-bold">{mins}m</span>
                        <div 
                          className={`w-5 rounded-t-sm transition-all duration-700 hover:opacity-85 ${colors[i % colors.length]}`}
                          style={{ height: `${percent}px` }}
                        ></div>
                        <span className="text-[8px] text-gray-500 font-extrabold uppercase tracking-wide truncate max-w-[48px]" title={sub}>{sub}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

        </div>

        {/* Right 4-Column Sidebar Block */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Streak Indicator */}
          <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-brand-pink/10 to-brand-purple/10 text-center relative overflow-hidden border border-brand-pink/20">
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-brand-pink/10 rounded-full blur-xl"></div>
            <div className="w-12 h-12 rounded-full bg-brand-pink/20 flex items-center justify-center mx-auto text-brand-pink text-xl font-bold mb-2 shadow-[0_0_15px_rgba(247,37,133,0.2)]">
              🔥
            </div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Current Streak</h3>
            <p className="text-2xl font-black text-white mt-0.5">{twinData.studyAnalytics.currentStreak} Days</p>
            <p className="text-[9px] text-gray-500 mt-2 font-semibold">Keep studying daily to maintain momentum multipliers.</p>
          </div>

          {/* Mini Interactive AI Twin Chat Widget */}
          <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[280px]">
            <div className="p-3 bg-white/5 border-b border-white/5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-ping"></span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-300">Quick Twin Synchronizer</span>
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
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
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

          {/* Exam Deadlines / Countdowns */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-100 flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-brand-pink" /> Critical Timelines
            </h3>
            
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-white/5 border-l-2 border-l-brand-pink flex justify-between text-xs">
                <span className="text-gray-400">Exam Target</span>
                <span className="font-extrabold text-white shrink-0">
                  {examCountdown !== null ? `${examCountdown} Days Left` : 'Not configured'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border-l-2 border-l-brand-teal flex justify-between text-xs">
                <span className="text-gray-400">Syllabus Completion</span>
                <span className="font-extrabold text-white shrink-0">
                  {twinData.tasksStats.completed}/{twinData.tasksStats.total} Tasks ({twinData.tasksStats.completionRate}%)
                </span>
              </div>
            </div>
          </div>

          {/* Badges Widget Removed */}

        </div>

      </div>
    </div>
  );
}
