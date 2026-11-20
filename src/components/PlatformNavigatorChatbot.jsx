import React, { useState, useEffect, useRef } from 'react';
import { isGprecPlacementSubdomain } from '../utils/placementSubdomain';
import { 
  Bot, X, Send, Sparkles, Compass, ArrowRight, CornerDownLeft, 
  BookOpen, Code, GraduationCap, Briefcase, HelpCircle, Trophy, 
  Map, Award, Rocket, CheckCircle2, RefreshCw, MessageSquare,
  Search, ArrowUpRight, FileText, CheckSquare, Layers, ShieldCheck, Gift
} from 'lucide-react';

// Comprehensive registry of all Lumixora portals with descriptions, actions, and deep search keywords
export const PORTAL_CATALOG = [
  {
    id: 'dashboard',
    name: 'Dashboard Home',
    category: 'Academics & Core',
    description: 'Your personalized academic cockpit with streak tracking, daily roadmap, and quick stats.',
    icon: Sparkles,
    color: 'indigo',
    keywords: ['home', 'start', 'overview', 'dashboard', 'analytics', 'streak', 'coins', 'level'],
    suggestedQueries: ['Where can I see my daily study streak?', 'Take me to main dashboard']
  },
  {
    id: 'my-academics',
    name: 'My Academics (SGPA & CGPA)',
    category: 'Academics & Core',
    description: 'Track university marks, semester-wise SGPA, cumulative CGPA, and subject credits.',
    icon: GraduationCap,
    color: 'emerald',
    keywords: ['marks', 'sgpa', 'cgpa', 'grades', 'semester', 'percentage', 'result', 'academic score'],
    suggestedQueries: ['Calculate my SGPA/CGPA', 'Where can I see my semester marks?']
  },
  {
    id: 'learning-hub',
    name: 'Learning & Video Hub',
    category: 'Academics & Core',
    description: 'Curated video lectures, unit-wise notes, lecture PPTs, and verified question banks.',
    icon: BookOpen,
    color: 'cyan',
    keywords: ['notes', 'videos', 'lectures', 'syllabus', 'study material', 'units', 'ppts', 'learning hub', 'books'],
    suggestedQueries: ['Find notes for my subjects', 'Watch video lectures for Unit 1']
  },
  {
    id: 'courses',
    name: 'All Courses & Diplomas',
    category: 'Academics & Core',
    description: 'Explore Full Stack, Cloud, AI/ML, and Robotics engineering certified courses.',
    icon: Layers,
    color: 'purple',
    keywords: ['courses', 'diploma', 'certificates', 'learn web dev', 'full stack', 'cloud'],
    suggestedQueries: ['Show all available engineering courses', 'Explore diploma certifications']
  },
  {
    id: 'doubts',
    name: 'AI Doubt Solver 24/7',
    category: 'Academics & Core',
    description: 'Instant step-by-step LaTeX formula solutions, mathematical derivations, and concept explanations.',
    icon: HelpCircle,
    color: 'amber',
    keywords: ['doubts', 'doubt solver', 'ask question', 'homework', 'math problem', 'derivation', 'solution'],
    suggestedQueries: ['Help me solve a math problem', 'Explain a difficult concept']
  },
  {
    id: 'test-portal',
    name: 'Tests & Assessment Hub',
    category: 'Academics & Core',
    description: 'Online quizzes, mid-term mock assessments, and company evaluation simulators.',
    icon: Award,
    color: 'rose',
    keywords: ['tests', 'quiz', 'mock test', 'exams', 'assessment', 'mcq', 'practice test'],
    suggestedQueries: ['Take a practice test', 'Prepare for mid-term exams']
  },
  {
    id: 'coding-practice',
    name: 'Code Arena & 30D Java',
    category: 'Coding & Tech',
    description: 'Interactive in-browser code compiler with 30-Day Java/Python tracks and LeetCode-style DSA problems.',
    icon: Code,
    color: 'emerald',
    keywords: ['code', 'coding', 'compiler', 'dsa', 'java', 'python', 'problems', 'code arena', 'algorithms', 'data structures'],
    suggestedQueries: ['Where can I practice coding problems?', 'Open 30-Day Java track']
  },
  {
    id: 'ai-commander',
    name: 'AI Placement Commander™',
    category: 'Career & Placement',
    description: 'Company-specific recruitment readiness for TCS, Infosys, Amazon, Wipro, and Google drives.',
    icon: Briefcase,
    color: 'indigo',
    keywords: ['placement', 'jobs', 'companies', 'tcs', 'infosys', 'amazon', 'hiring', 'recruitment', 'package'],
    suggestedQueries: ['Prepare for TCS / Infosys placements', 'Target dream company requirements']
  },
  {
    id: 'interview',
    name: 'AI Mock Interview Room',
    category: 'Career & Placement',
    description: 'Real-time two-way voice AI interviewer conducting HR, technical, and behavioral rounds.',
    icon: MessageSquare,
    color: 'purple',
    keywords: ['interview', 'mock interview', 'voice interview', 'hr round', 'technical round', 'speech'],
    suggestedQueries: ['Start an AI voice mock interview', 'Practice behavioral HR questions']
  },
  {
    id: 'resume',
    name: 'AI Resume Builder (PDF)',
    category: 'Career & Placement',
    description: 'ATS-optimized professional resume generator with auto-formatting and instant PDF download.',
    icon: FileText,
    color: 'blue',
    keywords: ['resume', 'cv', 'ats', 'resume builder', 'download resume', 'job application'],
    suggestedQueries: ['Build an ATS-friendly resume', 'Export my resume to PDF']
  },
  {
    id: 'attendance',
    name: 'Attendance Tracker',
    category: 'Academics & Core',
    description: 'Smart attendance calculator with 75% cutoff threshold and bunkable class safety planner.',
    icon: CheckSquare,
    color: 'amber',
    keywords: ['attendance', 'bunk', 'classes', 'percentage', '75 percent', 'attendance calculator', 'tracker'],
    suggestedQueries: ['How many classes can I skip?', 'Calculate my attendance percentage']
  },
  {
    id: 'certificates',
    name: 'Proof-of-Skill Badges & Certs',
    category: 'Career & Placement',
    description: 'Verifiable cryptographic credential badges showcasing verified coding benchmarks.',
    icon: ShieldCheck,
    color: 'purple',
    keywords: ['certificates', 'badges', 'skills', 'proof', 'credentials', 'linkedin share'],
    suggestedQueries: ['View my verified certificates', 'How do I earn badges?']
  },
  {
    id: 'hackathons',
    name: 'Hackathons & Internships',
    category: 'Opportunities',
    description: 'Browse verified national hackathons, coding contests, and student internships.',
    icon: Trophy,
    color: 'amber',
    keywords: ['hackathons', 'internships', 'competitions', 'contests', 'cash prize', 'jobs', 'teams'],
    suggestedQueries: ['Find live hackathons', 'Apply for student internships']
  },
  {
    id: 'alumni-referrals',
    name: 'Alumni Referrals & Off-Campus Jobs',
    category: 'Career & Placement',
    description: 'Connect with alumni working at Google, Microsoft, Amazon, and top startups for direct referrals.',
    icon: ArrowUpRight,
    color: 'cyan',
    keywords: ['referral', 'alumni', 'off campus', 'jobs', 'connections', 'networking'],
    suggestedQueries: ['Get employee referral', 'Browse alumni network']
  },
  {
    id: 'career-roadmap',
    name: 'Career Roadmap & Target Roles',
    category: 'Career & Placement',
    description: 'Step-by-step 30-day transformation tracks for Software Engineer, AI/ML, Cloud, and Data Science.',
    icon: Map,
    color: 'indigo',
    keywords: ['roadmap', 'path', 'career guide', 'what to learn', 'target role', 'skills required'],
    suggestedQueries: ['Show Software Engineer roadmap', 'How to become an AI engineer?']
  },
  {
    id: 'student-offers',
    name: 'Student Perks & Pro Developer Offers',
    category: 'Campus & Perks',
    description: 'Unlock $14,500+ in free developer packs: GitHub Copilot, JetBrains All Products, Azure $100, Figma Pro, and 590+ software perks.',
    icon: Gift,
    color: 'emerald',
    keywords: ['student offers', 'student perks', 'free tools', 'discounts', 'github student pack', 'jetbrains', 'free pro', 'copilot free', 'azure credits', 'aws educate', 'figma student', 'software deals'],
    suggestedQueries: ['Where can I get free developer tools?', 'How to claim GitHub Student Pack?', 'Free student AI tools']
  },
  {
    id: 'contribute',
    name: 'Contribute Notes',
    category: 'Support & Community',
    description: 'Upload high-quality handwritten or typed notes and question banks to help fellow scholars.',
    icon: BookOpen,
    color: 'emerald',
    keywords: ['contribute', 'upload notes', 'share notes', 'community', 'submit material'],
    suggestedQueries: ['How to contribute notes?', 'Upload lecture notes']
  },
  {
    id: 'contact',
    name: 'Connect with Founder',
    category: 'Support & Community',
    description: 'Reach out directly to Founder Shaik Sowban for platform feedback, feature requests, or queries.',
    icon: MessageSquare,
    color: 'purple',
    keywords: ['founder', 'contact', 'founder connect', 'feedback', 'shaik sowban', 'ceo'],
    suggestedQueries: ['Message the founder', 'Give platform feedback']
  },
  {
    id: 'report-bug',
    name: 'Report Platform Issue',
    category: 'Support & Community',
    description: 'Found a bug or visual issue? Submit an instant report with screenshot attachments.',
    icon: HelpCircle,
    color: 'rose',
    keywords: ['bug', 'issue', 'problem', 'broken', 'error', 'report issue', 'support'],
    suggestedQueries: ['Report a bug', 'Something is not working']
  }
];

/**
 * Clean markdown-like text parser that renders bold, italic, and bullet points
 * without raw asterisks or unformatted text.
 */
function FormattedMessage({ text }) {
  if (!text) return null;

  // Split into paragraphs / lines
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, lIdx) => {
        if (!line.trim()) return <div key={lIdx} className="h-1" />;

        // Check if line is a bullet
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || /^\*\s+/.test(line.trim());
        const cleanLine = isBullet ? line.trim().replace(/^([•\-]|\*\s+)\s*/, '') : line;

        // Clean tokenizer for **bold** and *italic*
        const parts = [];
        let remaining = cleanLine;
        let pKey = 0;

        while (remaining.length > 0) {
          // Check for **bold** first
          const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
          // Check for *italic* or *"quoted"* (not surrounded by other asterisks)
          const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);

          let firstMatch = null;
          let matchType = null;

          if (boldMatch && (!italicMatch || boldMatch.index <= italicMatch.index)) {
            firstMatch = boldMatch;
            matchType = 'bold';
          } else if (italicMatch) {
            firstMatch = italicMatch;
            matchType = 'italic';
          }

          if (firstMatch) {
            if (firstMatch.index > 0) {
              parts.push(<span key={pKey++}>{remaining.substring(0, firstMatch.index)}</span>);
            }
            if (matchType === 'bold') {
              parts.push(
                <strong key={pKey++} className="font-bold text-white tracking-wide">
                  {firstMatch[1]}
                </strong>
              );
            } else {
              parts.push(
                <em key={pKey++} className="italic text-indigo-300 font-medium">
                  {firstMatch[1]}
                </em>
              );
            }
            remaining = remaining.substring(firstMatch.index + firstMatch[0].length);
          } else {
            parts.push(<span key={pKey++}>{remaining}</span>);
            break;
          }
        }

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-1 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
              <span>{parts}</span>
            </div>
          );
        }

        return <div key={lIdx} className="text-slate-200">{parts}</div>;
      })}
    </div>
  );
}

export default function PlatformNavigatorChatbot({ isOpen, onClose, onNavigate, user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello Scholar! 👋 I am your **Lumixora Platform Navigator**.\n\nTell me what you're trying to do (e.g. *\"Where are my semester notes?\"*, *\"I want to practice coding\"*, *\"Prepare for placements\"*) and I'll jump you directly to the right portal with one click!",
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

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  // Keyboard shortcut listener (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Semantic query matcher
  const matchPortals = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

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

  // Instant response engine
  const generateInstantReply = (query, matched) => {
    const q = query.toLowerCase().trim();
    const primary = matched[0];

    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo', 'greetings', 'namaste'];
    if (greetings.some(g => q === g || q.startsWith(g + ' ') || q.startsWith(g + '!') || q.startsWith(g + '.'))) {
      return `Hello there! 👋 How can I help you navigate Lumixora today? You can ask me things like:\n\n• *"Where can I find notes for Unit 2?"*\n• *"Take me to coding practice"*\n• *"Help me prepare for TCS / Infosys placements"*\n• *"How do I track my attendance?"*`;
    }

    if (q === 'thanks' || q === 'thank you' || q === 'ty' || q.includes('thank you') || q.includes('thanks')) {
      return `You're very welcome! 😊 Always here to help you get where you need on Lumixora. What would you like to explore next?`;
    }

    if (q.includes('who are you') || q.includes('what are you') || q.includes('what can you do')) {
      return `I am your **Lumixora Platform Navigator**! 🧭 I can instantly guide you to any portal across Lumixora: Learning Hub, Code Arena, AI Placement Commander, Mock Interviews, SGPA Calculators, and more. What are you looking for?`;
    }

    if (q.includes('note') || q.includes('material') || q.includes('book') || q.includes('pdf') || q.includes('ppt') || q.includes('syllabus')) {
      return `I found your study material! 📚 Head directly over to **${primary?.name || 'Learning & Video Hub'}** where all semester notes, verified unit question banks, and lecture PPTs are organized for your branch.`;
    }
    if (q.includes('code') || q.includes('dsa') || q.includes('java') || q.includes('python') || q.includes('practice') || q.includes('arena')) {
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
      return `Here is the best portal for your request: **${primary.name}**\n\n${primary.description}`;
    }

    return `I couldn't find a direct portal match for "${query}". Try asking about notes, coding practice, mock interview, placement commander, or attendance!`;
  };

  const handleSend = async (textToSend) => {
    const userQuery = (textToSend || input).trim();
    if (!userQuery) return;

    const userMsg = { id: Date.now(), sender: 'user', text: userQuery };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const qLower = userQuery.toLowerCase().trim();
    const isGreeting = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo', 'thanks', 'thank you'].some(g => qLower === g || qLower.startsWith(g + ' ') || qLower.startsWith(g + '!'));

    const matched = isGreeting ? [] : matchPortals(userQuery);
    const resolvedPortals = matched.length > 0 ? matched : [];

    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: generateInstantReply(userQuery, matched),
          portals: resolvedPortals
        }
      ]);
      setIsTyping(false);
    }, 180);
  };

  const handlePortalClick = (portalId) => {
    if (onNavigate) {
      onNavigate(portalId);
    }
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen || isGprecPlacementSubdomain()) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-end sm:justify-center p-2 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in font-sans">
      <div 
        className="relative w-full max-w-lg bg-[#0d111c] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[88vh] sm:h-[640px] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Header */}
        <div className="p-4 sm:p-5 bg-[#090d16] border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center shadow-inner relative shrink-0">
              <Bot className="w-5 h-5 text-indigo-400" />
              <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute top-1.5 right-1.5 animate-pulse" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#090d16] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Lumixora Navigator
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                  AI Copilot
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Instant portal finder & smart platform guide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Close Navigator (Esc)"
            className="w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 select-none">
          {[
            { label: '🎁 Free Student Perks', q: 'student offers' },
            { label: 'Find Notes & Lectures', q: 'notes' },
            { label: 'Practice Coding / DSA', q: 'coding' },
            { label: 'Placement Commander', q: 'placement' },
            { label: 'AI Mock Interview', q: 'interview' },
            { label: 'Check SGPA / CGPA', q: 'sgpa' },
            { label: 'Resume Builder', q: 'resume' }
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip.q)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-950/60 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 text-slate-300 whitespace-nowrap transition-all cursor-pointer shrink-0"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#0a0e18] custom-scrollbar">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              <div 
                className={`max-w-[90%] sm:max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-md font-medium'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-xs shadow-sm'
                }`}
              >
                <FormattedMessage text={m.text} />

                {/* Attached Interactive Portal Cards */}
                {m.portals && m.portals.length > 0 && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> Recommended Portals (Click to open):
                    </span>
                    <div className="space-y-2">
                      {m.portals.map((portal) => {
                        const IconComponent = portal.icon || Compass;
                        return (
                          <button
                            key={portal.id}
                            onClick={() => handlePortalClick(portal.id)}
                            className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800/80 hover:border-indigo-500/40 flex items-center justify-between text-left transition-all group cursor-pointer shadow-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              <div className="w-9 h-9 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-bold text-white block group-hover:text-indigo-300 transition-colors truncate">
                                  {portal.name}
                                </span>
                                <span className="text-[11px] text-slate-400 block line-clamp-2 leading-snug mt-0.5">
                                  {portal.description}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/15 group-hover:bg-indigo-600 text-indigo-300 group-hover:text-white text-xs font-semibold shrink-0 transition-all border border-indigo-500/30">
                              <span>Open</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
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
            <div className="flex justify-start animate-fade-in">
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-xs text-xs text-slate-400 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-medium text-slate-400">Finding best portal...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Modern Bottom Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-[#090d16] border-t border-slate-800/80 flex items-center gap-2 shrink-0"
        >
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search portals, notes, code arena, placement..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed shrink-0"
            title="Send (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
