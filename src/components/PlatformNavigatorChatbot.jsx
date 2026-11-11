import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, X, Send, Sparkles, Compass, ArrowRight, CornerDownLeft, 
  BookOpen, Code, GraduationCap, Briefcase, HelpCircle, Trophy, 
  Map, Award, Rocket, CheckCircle2, RefreshCw, MessageSquare
} from 'lucide-react';
import { callAICompletion } from '../services/aiService';

// Comprehensive registry of all Lumixora portals with descriptions, actions, and deep search keywords
export const PORTAL_CATALOG = [
  {
    id: 'dashboard',
    name: 'Dashboard Home',
    category: 'Academics & Core',
    description: 'Your personalized academic cockpit with streak tracking, daily roadmap, and quick stats.',
    icon: Sparkles,
    keywords: ['home', 'start', 'overview', 'dashboard', 'analytics', 'streak', 'coins', 'level'],
    suggestedQueries: ['Where can I see my daily study streak?', 'Take me to main dashboard']
  },
  {
    id: 'my-academics',
    name: 'My Academics (SGPA & CGPA)',
    category: 'Academics & Core',
    description: 'Track university marks, semester-wise SGPA, cumulative CGPA, and subject credits.',
    icon: GraduationCap,
    keywords: ['marks', 'sgpa', 'cgpa', 'grades', 'semester', 'percentage', 'result', 'academic score'],
    suggestedQueries: ['Calculate my SGPA/CGPA', 'Where can I see my semester marks?']
  },
  {
    id: 'learning-hub',
    name: 'Learning & Video Hub',
    category: 'Academics & Core',
    description: 'Curated video lectures, unit-wise notes, PPTs, and verified question banks.',
    icon: BookOpen,
    keywords: ['notes', 'videos', 'lectures', 'syllabus', 'study material', 'units', 'ppts', 'learning hub', 'books'],
    suggestedQueries: ['Find notes for my subjects', 'Watch video lectures for Unit 1']
  },
  {
    id: 'courses',
    name: 'All Courses & Diplomas',
    category: 'Academics & Core',
    description: 'Explore Full Stack, Cloud, AI/ML, and Robotics engineering certified courses.',
    icon: BookOpen,
    keywords: ['courses', 'diploma', 'certificates', 'learn web dev', 'full stack', 'cloud'],
    suggestedQueries: ['Show all available engineering courses', 'Explore diploma certifications']
  },
  {
    id: 'doubts',
    name: 'AI Doubt Solver 24/7',
    category: 'Academics & Core',
    description: 'Instant step-by-step LaTeX formula solutions, mathematical derivations, and concept explanations.',
    icon: HelpCircle,
    keywords: ['doubts', 'doubt solver', 'ask question', 'homework', 'math problem', 'derivation', 'solution'],
    suggestedQueries: ['Help me solve a math problem', 'Explain a difficult concept']
  },
  {
    id: 'test-portal',
    name: 'Tests & Assessment Hub',
    category: 'Academics & Core',
    description: 'Online quizzes, mid-term mock assessments, and company evaluation simulators.',
    icon: Award,
    keywords: ['tests', 'quiz', 'mock test', 'exams', 'assessment', 'mcq', 'practice test'],
    suggestedQueries: ['Take a practice test', 'Prepare for mid-term exams']
  },
  {
    id: 'coding-practice',
    name: 'Code Arena & 30D Java',
    category: 'Coding & Tech',
    description: 'Interactive Monaco code compiler with 30-Day Java/Python tracks, LeetCode style DSA problems.',
    icon: Code,
    keywords: ['code', 'coding', 'compiler', 'dsa', 'java', 'python', 'problems', 'code arena', 'algorithms', 'data structures'],
    suggestedQueries: ['Where can I practice coding problems?', 'Open 30-Day Java track']
  },
  {
    id: 'ai-commander',
    name: 'AI Placement Commander™',
    category: 'Career & Placement',
    description: 'Company-specific recruitment readiness for TCS, Infosys, Amazon, Wipro, and Google drives.',
    icon: Briefcase,
    keywords: ['placement', 'jobs', 'companies', 'tcs', 'infosys', 'amazon', 'hiring', 'recruitment', 'package'],
    suggestedQueries: ['Prepare for TCS / Infosys placements', 'Target dream company requirements']
  },
  {
    id: 'interview',
    name: 'AI Mock Interview Room',
    category: 'Career & Placement',
    description: 'Real-time two-way voice AI interviewer conducting HR, technical, and behavioral rounds.',
    icon: MessageSquare,
    keywords: ['interview', 'mock interview', 'voice interview', 'hr round', 'technical round', 'speech'],
    suggestedQueries: ['Start an AI voice mock interview', 'Practice behavioral HR questions']
  },
  {
    id: 'resume',
    name: 'AI Resume Builder (PDF)',
    category: 'Career & Placement',
    description: 'ATS-optimized professional resume generator with auto-formatting and instant PDF download.',
    icon: Briefcase,
    keywords: ['resume', 'cv', 'ats', 'resume builder', 'download resume', 'job application'],
    suggestedQueries: ['Build an ATS-friendly resume', 'Export my resume to PDF']
  },
  {
    id: 'future-twin',
    name: 'AI Future Twin™',
    category: 'Career & Placement',
    description: 'Predictive career simulator forecasting salary packages, role readiness, and skill gaps.',
    icon: Bot,
    keywords: ['future twin', 'career twin', 'ai mentor', 'career prediction', 'skill gap', 'salary'],
    suggestedQueries: ['Check my career twin readiness', 'Analyze my skill gap for software engineer']
  },
  {
    id: 'career-roadmap',
    name: 'Career Roadmap & Milestones',
    category: 'Career & Placement',
    description: 'Year-by-year engineering roadmap detailing tech stack mastery and semester milestones.',
    icon: Map,
    keywords: ['roadmap', 'career path', 'milestones', 'year guide', 'engineering journey'],
    suggestedQueries: ['Show my 4-year engineering roadmap', 'What should I learn in 2nd/3rd year?']
  },
  {
    id: 'internships',
    name: 'Internships & Opportunities',
    category: 'Career & Placement',
    description: 'Verified internship openings, research fellowships, and stipend programs for students.',
    icon: Briefcase,
    keywords: ['internship', 'intern', 'stipend', 'summer internship', 'training'],
    suggestedQueries: ['Find student internships', 'Apply for verified internships']
  },
  {
    id: 'hackathons',
    name: 'Hackathons & Competitions',
    category: 'Community & Build',
    description: 'Curated national & international hackathons, cash prize bounties, and team registrations.',
    icon: Trophy,
    keywords: ['hackathons', 'hackathon', 'competition', 'prizes', 'bounty', 'smart india hackathon'],
    suggestedQueries: ['Explore upcoming hackathons', 'Join a hackathon team']
  },
  {
    id: 'projects',
    name: 'Project Build Studio',
    category: 'Community & Build',
    description: 'Repository of mini and major engineering projects with GitHub proof verification.',
    icon: Rocket,
    keywords: ['projects', 'build', 'github', 'mini project', 'major project', 'final year project'],
    suggestedQueries: ['Find final year project ideas', 'Submit project for skill verification']
  },
  {
    id: 'community',
    name: 'Community & Study Squads',
    category: 'Community & Build',
    description: 'Connect with peers, branch study squads, campus ambassadors, and collaborate.',
    icon: Compass,
    keywords: ['community', 'chat', 'squads', 'groups', 'peers', 'friends', 'discussion'],
    suggestedQueries: ['Join my branch study squad', 'Ask peers in the community']
  },
  {
    id: 'attendance',
    name: 'Attendance Tracker',
    category: 'Tools & Utilities',
    description: 'Calculate 75% attendance threshold, track bunkable classes, and log daily lectures.',
    icon: GraduationCap,
    keywords: ['attendance', 'bunk', 'classes', '75 percent', 'attendance calculator'],
    suggestedQueries: ['Calculate how many classes I can miss', 'Track my daily attendance']
  },
  {
    id: 'study-with-me',
    name: 'Study Arena & Pomodoro',
    category: 'Tools & Utilities',
    description: 'Focus timer with Lo-Fi beats, ambient study sounds, and focus session leaderboards.',
    icon: Sparkles,
    keywords: ['pomodoro', 'study timer', 'focus', 'lofi', 'music', 'study room'],
    suggestedQueries: ['Start a 25-minute Pomodoro study timer', 'Play Lo-Fi study beats']
  },
  {
    id: 'contribute',
    name: 'Contribute Notes & Earn',
    category: 'Tools & Utilities',
    description: 'Upload handwritten notes, question papers, and earn Lumixora scholar coins and badges.',
    icon: BookOpen,
    keywords: ['upload notes', 'contribute', 'share notes', 'earn coins', 'submit'],
    suggestedQueries: ['How can I upload my handwritten notes?', 'Contribute study material']
  }
];

export default function PlatformNavigatorChatbot({ isOpen, onClose, onNavigate, user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello ${user?.displayName?.split(' ')[0] || 'Scholar'}! 👋 I am your **Lumixora Navigator Bot**.\n\nTell me what you're trying to do (e.g. *"I want to practice coding"*, *"Where are my semester notes?"*, *"Help me prepare for an interview"*) and I'll guide you directly to the right portal with one click!`,
      portals: [
        PORTAL_CATALOG.find(p => p.id === 'learning-hub'),
        PORTAL_CATALOG.find(p => p.id === 'coding-practice'),
        PORTAL_CATALOG.find(p => p.id === 'ai-commander')
      ].filter(Boolean)
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Find relevant portals via smart fuzzy keyword matching
  const matchPortals = (query) => {
    const q = query.toLowerCase();
    const scored = PORTAL_CATALOG.map(portal => {
      let score = 0;
      if (portal.name.toLowerCase().includes(q)) score += 10;
      if (portal.id.toLowerCase().includes(q)) score += 8;
      if (portal.description.toLowerCase().includes(q)) score += 4;
      portal.keywords.forEach(kw => {
        if (q.includes(kw) || kw.includes(q)) score += 5;
      });
      return { portal, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.portal);
  };

  // Smart local intent solver with instant zero-millisecond responses
  const generateInstantReply = (query, matched) => {
    const q = query.toLowerCase().trim();
    const primary = matched[0];

    // Check for conversational greetings / pleasantries
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo', 'greetings', 'namaste'];
    if (greetings.some(g => q === g || q.startsWith(g + ' ') || q.startsWith(g + '!') || q.startsWith(g + '.'))) {
      return `Hello there! 👋 How can I help you navigate Lumixora today? You can ask me things like:\n\n• *"Where can I find notes for Unit 2?"*\n• *"Take me to coding practice"* \n• *"Help me prepare for TCS / Infosys placements"*\n• *"How do I track my attendance?"*`;
    }

    if (q === 'thanks' || q === 'thank you' || q === 'ty' || q.includes('thank you') || q.includes('thanks')) {
      return `You're very welcome! 😊 Always here to help you get where you need on Lumixora. Let me know what you'd like to do next!`;
    }

    if (q.includes('who are you') || q.includes('what are you') || q.includes('what can you do')) {
      return `I am your **Lumixora Platform Navigator**! 🧭 I can instantly guide you to any portal across Lumixora: Learning Hub, Code Arena, AI Placement Commander, Mock Interviews, SGPA Calculators, and more. What are you looking for?`;
    }

    if (q.includes('note') || q.includes('material') || q.includes('book') || q.includes('pdf') || q.includes('ppt') || q.includes('syllabus')) {
      return `I found your study material! 📚 Head directly over to **${primary?.name || 'Learning & Video Hub'}** where all semester notes, verified unit question banks, and lecture PPTs are organized for your branch.`;
    }
    if (q.includes('code') || q.includes('dsa') || q.includes('java') || q.includes('python') || q.includes('practice') || q.includes('arena') || q.includes('problem 36') || q.includes('story')) {
      return `Time to build your coding muscle! 💻 Jump straight into **${primary?.name || 'Code Arena'}** for story-based programming quests, Monaco in-browser compiler, and 30-Day Java/Python tracks.`;
    }
    if (q.includes('placement') || q.includes('job') || q.includes('company') || q.includes('tcs') || q.includes('infosys') || q.includes('amazon') || q.includes('hiring')) {
      return `Let's accelerate your placement prep! 🎯 Check out **${primary?.name || 'AI Placement Commander™'}** to track target company readiness, syllabus rounds, and technical hiring trends.`;
    }
    if (q.includes('interview') || q.includes('mock') || q.includes('voice') || q.includes('hr') || q.includes('speech')) {
      return `Practice speaking with confidence! 🎤 Enter the **AI Mock Interview Room** for interactive two-way voice simulations with instant AI feedback on technical and behavioral answers.`;
    }
    if (q.includes('mark') || q.includes('sgpa') || q.includes('cgpa') || q.includes('grade') || q.includes('semester')) {
      return `Track your academic excellence! 📊 Open **My Academics** to calculate your SGPA, cumulative CGPA, and review credit breakdown.`;
    }
    if (q.includes('resume') || q.includes('cv') || q.includes('pdf')) {
      return `Build a job-winning resume! 📄 Use the **AI Resume Builder** to generate an ATS-friendly, single-click downloadable PDF.`;
    }
    if (q.includes('doubt') || q.includes('question') || q.includes('solve')) {
      return `Stuck on a concept or equation? 💡 The **AI Doubt Solver** is online 24/7 with LaTeX step-by-step mathematical explanations.`;
    }
    if (q.includes('attendance') || q.includes('bunk') || q.includes('class')) {
      return `Stay above the safety line! 🎓 Use the **Attendance Tracker** to calculate your 75% threshold and bunkable class allowance.`;
    }
    if (q.includes('hackathon') || q.includes('project') || q.includes('internship') || q.includes('bounty')) {
      return `Ready to compete and earn? 🏆 Browse national hackathons and verified paid student internships in **Hackathons & Internships**.`;
    }

    if (matched.length > 0 && primary) {
      return `Here is the best portal for your request: **${primary.name}** — ${primary.description}`;
    }

    return `I couldn't find a direct portal match for "${query}". Try asking about notes, coding practice, mock interview, placement commander, or attendance!`;
  };

  const handleSend = async (textToSend) => {
    const userQuery = (textToSend || input).trim();
    if (!userQuery) return;

    const userMsg = { id: Date.now(), sender: 'user', text: userQuery };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Check if greeting or casual query
    const qLower = userQuery.toLowerCase().trim();
    const isGreeting = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo', 'thanks', 'thank you'].some(g => qLower === g || qLower.startsWith(g + ' ') || qLower.startsWith(g + '!'));

    // 1. Match high-relevance portals locally
    const matched = isGreeting ? [] : matchPortals(userQuery);
    const resolvedPortals = matched.length > 0 ? matched : [];

    // 2. Generate INSTANT response immediately (Zero Lag - 0ms)
    const instantReply = generateInstantReply(userQuery, matched);
    
    // Add realistic 200ms natural typing feel without hanging on slow external API
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: instantReply,
          portals: resolvedPortals
        }
      ]);
      setIsTyping(false);
    }, 220);
  };

  const handlePortalClick = (portalId) => {
    if (onNavigate) {
      onNavigate(portalId);
    }
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-end sm:justify-center p-2 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div 
        className="relative w-full max-w-lg bg-[#0A0E1A] border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col h-[85vh] sm:h-[620px] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0e1424] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#101A35] border border-cyan-500/40 p-1 flex items-center justify-center shadow-md relative">
              <img 
                src="/lumixora_logo_icon.png" 
                alt="Lumixora Bot" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00B987] border-2 border-[#0A0E1A] animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>Lumixora Navigator Bot</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AI Guide
                </span>
              </h3>
              <p className="text-[11px] text-gray-400 font-medium">
                Instant portal finder & platform assistant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close Navigator (Esc)"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-black/40 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            '📝 Find Notes & Lectures',
            '💻 Practice Coding / DSA',
            '🎯 Placement Commander',
            '🎤 AI Mock Interview',
            '📊 Check SGPA / CGPA',
            '📄 Resume Builder'
          ].map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pill.replace(/^[^\s]+\s/, ''))}
              className="text-[11px] font-medium px-3 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 text-gray-300 whitespace-nowrap transition-all cursor-pointer shrink-0"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#070A12]/90">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-md font-medium'
                    : 'bg-[#121829] text-gray-200 border border-white/10 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Attached Interactive Portal Cards */}
                {m.portals && m.portals.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <span className="text-[10px] uppercase font-black tracking-wider text-cyan-400 block">
                      ⚡ Click to open required portal:
                    </span>
                    <div className="space-y-1.5">
                      {m.portals.map((portal) => {
                        const IconComponent = portal.icon || Compass;
                        return (
                          <button
                            key={portal.id}
                            onClick={() => handlePortalClick(portal.id)}
                            className="w-full p-2.5 rounded-xl bg-black/40 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-500/40 flex items-center justify-between text-left transition-all group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div className="truncate">
                                <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors">
                                  {portal.name}
                                </span>
                                <span className="text-[10px] text-gray-400 block truncate">
                                  {portal.description}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold shrink-0 ml-2 group-hover:translate-x-1 transition-transform">
                              <span>Go</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="p-3 bg-[#121829] border border-white/10 rounded-2xl rounded-bl-none text-xs text-gray-400 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-medium text-gray-400">Finding best portal...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[#0e1424] border-t border-white/10 flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question or where you want to go..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 text-white transition-all cursor-pointer shadow-md shadow-cyan-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
