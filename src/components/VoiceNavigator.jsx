import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Sparkles, X, ArrowRight, 
  Compass, Zap, CheckCircle2, AlertCircle, Command, Radio, 
  HelpCircle, Activity, RotateCcw, Moon, Sun, Search, ChevronRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Comprehensive Voice Navigation Registry for Lumixora Platform (lumixora.in)
export const VOICE_COMMANDS = [
  // 1. Academics & Learning
  {
    targetTab: 'dashboard',
    label: 'Dashboard Home',
    icon: '🏠',
    description: 'Personalized study cockpit & roadmap',
    phrases: ['dashboard', 'home', 'main page', 'cockpit', 'omiverse', 'start page', 'go home', 'open dashboard', 'show dashboard']
  },
  {
    targetTab: 'notes',
    label: 'Notes & Syllabus Platform',
    icon: '📚',
    description: 'Curriculum notes, PYQs, and textbooks',
    phrases: ['notes', 'notes platform', 'syllabus', 'study materials', 'textbooks', 'previous papers', 'pyqs', 'engineering notes', 'open notes', 'show notes']
  },
  {
    targetTab: 'boloclass',
    label: 'BoloClass AI Classroom',
    icon: '🤖',
    description: 'Interactive AI-powered 3D video classroom',
    phrases: ['bolo class', 'boloclass', 'ai classroom', 'ai class', 'interactive class', 'lecture videos', 'open boloclass', 'bolo']
  },
  {
    targetTab: 'learning-hub',
    label: 'Learning & Video Hub',
    icon: '🎥',
    description: 'Curated video lectures & Learnverse',
    phrases: ['learning hub', 'video hub', 'learnverse', 'watch videos', 'video lectures', 'youtube lectures', 'open learning hub']
  },
  {
    targetTab: 'doubts',
    label: 'AI Doubt Solver 24/7',
    icon: '⚡',
    description: 'Instant AI solutions to academic doubts',
    phrases: ['doubt', 'doubts', 'doubt solver', 'solve doubt', 'ask doubt', 'ai doubt solver', 'homework help', 'open doubts']
  },
  {
    targetTab: 'courses',
    label: 'All Courses & Diplomas',
    icon: '🎓',
    description: 'Industry certifications & specialized diplomas',
    phrases: ['courses', 'all courses', 'diplomas', 'diploma', 'certifications', 'specializations', 'degree', 'open courses']
  },
  {
    targetTab: 'simulations',
    label: 'Engineering 3D Simulations',
    icon: '🔬',
    description: 'Interactive STEM virtual physics & circuit labs',
    phrases: ['simulations', 'simulation', 'virtual lab', '3d lab', 'circuit lab', 'physics lab', 'engineering lab', 'open simulations']
  },
  {
    targetTab: 'my-academics',
    label: 'My Academics (SGPA / CGPA)',
    icon: '📊',
    description: 'Semester grade tracker and SGPA calculator',
    phrases: ['my academics', 'academics', 'sgpa', 'cgpa', 'grades', 'marks', 'academic tracker', 'semester results', 'open academics']
  },
  {
    targetTab: 'attendance',
    label: 'Attendance & Bunk Meter',
    icon: '📅',
    description: 'College attendance percentage & bunk planner',
    phrases: ['attendance', 'bunk meter', 'attendance tracker', 'college attendance', 'attendance percentage', 'open attendance']
  },
  {
    targetTab: 'test-portal',
    label: 'Tests & Assessment Hub',
    icon: '📝',
    description: 'Timed tests, subject quizzes, and rankings',
    phrases: ['tests', 'test portal', 'exams', 'assessments', 'quizzes', 'mock test', 'subject test', 'open tests']
  },
  {
    targetTab: 'assigned-tasks',
    label: 'Assigned Curriculum Tasks',
    icon: '📋',
    description: 'Class assignments & homework deadlines',
    phrases: ['assigned tasks', 'tasks', 'homework', 'curriculum tasks', 'assignments', 'talentverse', 'open tasks']
  },
  {
    targetTab: 'study-with-me',
    label: 'Study Arena & Pomodoro',
    icon: '⏱️',
    description: 'Focus timer, lo-fi study arena, and deep work',
    phrases: ['study with me', 'pomodoro', 'study arena', 'focus timer', 'deep work', 'timer', 'study room']
  },

  // 2. Career & Placement
  {
    targetTab: 'ai-commander',
    label: 'Placement Commander™',
    icon: '💼',
    description: 'AI placement readiness & company drives',
    phrases: ['placement commander', 'placement', 'placements', 'campus placement', 'jobs', 'tpo', 'placement suite', 'ai commander', 'open placement']
  },
  {
    targetTab: 'tech-pulse',
    label: 'TechPulse™ Radar & Trends',
    icon: '📡',
    description: 'Live hiring intelligence, tech news & radar',
    phrases: ['tech pulse', 'techpulse', 'tech news', 'radar', 'hiring trends', 'industry radar', 'jobs radar', 'open tech pulse']
  },
  {
    targetTab: 'speakverse',
    label: 'SpeakVerse™ AI Communication',
    icon: '🎙️',
    description: 'Speech clarity, fluency coach & English viva',
    phrases: ['speakverse', 'speak verse', 'communication coach', 'speech coach', 'english speaking', 'accent', 'fluency', 'open speakverse']
  },
  {
    targetTab: 'interview',
    label: 'AI Mock Interview Room',
    icon: '🎯',
    description: 'Bar Raiser viva & technical mock interviews',
    phrases: ['mock interview', 'interview room', 'interview', 'ai interview', 'bar raiser', 'technical viva', 'hr interview', 'open interview']
  },
  {
    targetTab: 'coding-practice',
    label: 'Codeverse & 30D Java',
    icon: '💻',
    description: 'DSA coding arena, compiler, and LeetCode drills',
    phrases: ['coding practice', 'coding', 'code arena', 'codeverse', 'dsa', 'programming', 'java', 'leetcode', 'compiler', 'code editor', 'open coding']
  },
  {
    targetTab: 'resume',
    label: 'AI Resume Builder (PDF)',
    icon: '📄',
    description: 'ATS resume scoring & PDF download',
    phrases: ['resume', 'cv', 'resume builder', 'ats resume', 'create resume', 'cv builder', 'pdf resume', 'open resume']
  },
  {
    targetTab: 'certificates',
    label: 'Proof-of-Skill Badges',
    icon: '🏅',
    description: 'Verifiable skill credentials & LinkedIn badges',
    phrases: ['certificates', 'certificate', 'badges', 'proof of skill', 'skill badges', 'credentials', 'open certificates']
  },
  {
    targetTab: 'internships',
    label: 'Lumixora Internships',
    icon: '🏢',
    description: 'Verified industry internships & live projects',
    phrases: ['internships', 'internship', 'find internship', 'summer internship', 'apply internship', 'open internships']
  },
  {
    targetTab: 'career-roadmap',
    label: 'Career Roadmap & Roles',
    icon: '🗺️',
    description: 'Milestones & target career blueprints',
    phrases: ['career roadmap', 'roadmap', 'career path', 'target roles', 'career guidance', 'open roadmap']
  },
  {
    targetTab: 'alumni-referrals',
    label: 'Alumni Referrals Bridge',
    icon: '🤝',
    description: 'Connect with alumni working at top tech firms',
    phrases: ['alumni', 'referrals', 'alumni bridge', 'off campus', 'job referrals', 'open alumni']
  },

  // 3. Community & Innovation
  {
    targetTab: 'hackathons',
    label: 'Hackathons & Contests',
    icon: '🏆',
    description: 'National competitions & prize hackathons',
    phrases: ['hackathons', 'hackathon', 'contests', 'competitions', 'coding contest', 'open hackathons']
  },
  {
    targetTab: 'projects',
    label: 'Buildverse Project Studio',
    icon: '🚀',
    description: 'Capstone architectures & real-world projects',
    phrases: ['projects', 'buildverse', 'project studio', 'capstone', 'project builder', 'open projects']
  },
  {
    targetTab: 'community',
    label: 'Connectverse & Squads',
    icon: '👥',
    description: 'Student squads, study circles, and peer chat',
    phrases: ['community', 'connectverse', 'squads', 'study squads', 'class chat', 'friends', 'student community', 'open community']
  },
  {
    targetTab: 'marketplace',
    label: 'Campus P2P Marketplace',
    icon: '🛒',
    description: 'Student marketplace for drafters, calculators, notes & gadgets',
    phrases: ['marketplace', 'market place', 'campus store', 'campus shop', 'p2p store', 'buy books', 'sell drafter', 'open marketplace', 'store', 'drafter', 'calculator']
  },
  {
    targetTab: 'clubs',
    label: 'Student Clubs & Societies',
    icon: '⚡',
    description: 'CAD English Club, tech clubs, cultural bodies & events',
    phrases: ['clubs', 'student clubs', 'all clubs', 'cad club', 'english club', 'societies', 'campus clubs', 'open clubs', 'cad']
  },

  // 4. Contribution & Support
  {
    targetTab: 'contribute',
    label: 'Contribute Notes & Earn',
    icon: '✍️',
    description: 'Upload study notes and earn creator XP',
    phrases: ['contribute', 'upload notes', 'contribute notes', 'share notes', 'earn xp', 'open contribute']
  },
  {
    targetTab: 'contact',
    label: 'Connect with Founder',
    icon: '📞',
    description: 'Direct priority feedback & support line',
    phrases: ['contact', 'contact founder', 'founder', 'support', 'help', 'report issue', 'open contact']
  }
];

// Helper: Web Audio API synthesized chimes for instant tactile audio feedback
function playChime(type = 'success') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'start') {
      // Pleasant dual tone rising
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'success') {
      // Success harmonic triad
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'error') {
      // Low double beep
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.setValueAtTime(220, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    // Audio context may require prior user interaction in some environments
  }
}

export default function VoiceNavigator({
  isOpen = false,
  onClose = () => {},
  onNavigate = () => {},
  onToggleTheme = () => {},
  onOpenSearch = () => {},
  activeTab = 'dashboard'
}) {
  const { addToast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [matchedCommand, setMatchedCommand] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Listening for voice navigation commands...');
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState([20, 45, 80, 55, 30]);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [hasPermissionError, setHasPermissionError] = useState(false);

  const recognitionRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const audioIntervalRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMessage('Web Speech API is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setHasPermissionError(false);
      setStatusMessage('Listening... speak your destination');
      playChime('start');
      startWaveAnimation();
    };

    rec.onresult = (event) => {
      let finalStr = '';
      let interimStr = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        if (item.isFinal) {
          finalStr += item[0].transcript;
        } else {
          interimStr += item[0].transcript;
        }
      }

      const activeText = (finalStr || interimStr).trim();
      setInterimTranscript(interimStr);

      if (activeText) {
        setTranscript(activeText);
        parseVoiceIntent(activeText);
      }
    };

    rec.onerror = (e) => {
      console.warn('Voice navigator recognition warning:', e.error);
      if (e.error === 'not-allowed') {
        setHasPermissionError(true);
        setStatusMessage('Microphone access was denied. Please allow microphone permission in your browser.');
        stopListening();
      } else if (e.error === 'no-speech') {
        setStatusMessage('No speech detected. Speak clearly into your microphone.');
      }
    };

    rec.onend = () => {
      // Auto restart if still marked as open and listening
      if (isOpen && isListening) {
        try {
          rec.start();
        } catch (err) {
          setIsListening(false);
          stopWaveAnimation();
        }
      } else {
        setIsListening(false);
        stopWaveAnimation();
      }
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      stopWaveAnimation();
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, []);

  // When modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setInterimTranscript('');
      setMatchedCommand(null);
      setHasPermissionError(false);
      startListening();
    } else {
      stopListening();
      if (synthRef.current) synthRef.current.cancel();
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    }
  }, [isOpen]);

  // Keyboard shortcut listener: Escape closes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Audio wave visualizer animation simulation
  const startWaveAnimation = () => {
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    audioIntervalRef.current = setInterval(() => {
      setAudioLevel([
        Math.floor(15 + Math.random() * 65),
        Math.floor(25 + Math.random() * 70),
        Math.floor(40 + Math.random() * 55),
        Math.floor(20 + Math.random() * 75),
        Math.floor(15 + Math.random() * 60),
        Math.floor(30 + Math.random() * 60),
        Math.floor(18 + Math.random() * 50)
      ]);
    }, 90);
  };

  const stopWaveAnimation = () => {
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    setAudioLevel([20, 20, 20, 20, 20, 20, 20]);
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (e) {
      // already started
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {}
    setIsListening(false);
    stopWaveAnimation();
  };

  // Text-To-Speech Synthesizer
  const speakFeedback = (text) => {
    if (!voiceFeedbackEnabled || typeof window === 'undefined') return;
    try {
      if (synthRef.current) {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        synthRef.current.speak(utterance);
      }
    } catch (e) {}
  };

  // Natural Language Voice Intent Parser
  const parseVoiceIntent = (rawText) => {
    const clean = rawText.toLowerCase().trim()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ');

    if (!clean) return;

    // 1. Cancel / Close HUD
    if (['cancel', 'close', 'stop listening', 'exit', 'nevermind', 'dismiss'].some(w => clean.includes(w))) {
      playChime('start');
      setStatusMessage('Voice navigation cancelled');
      speakFeedback('Cancelled');
      onClose();
      return;
    }

    // 2. Theme Toggling Commands
    if (['dark mode', 'light mode', 'toggle theme', 'switch theme', 'turn on dark mode', 'turn on light mode', 'change theme'].some(w => clean.includes(w))) {
      playChime('success');
      setStatusMessage('Theme toggled');
      speakFeedback('Theme toggled');
      onToggleTheme();
      executeAction(() => onClose(), 800);
      return;
    }

    // 3. Global Spotlight Search Command
    if (['open search', 'search portals', 'spotlight', 'find notes', 'search', 'global search'].some(w => clean.includes(w))) {
      playChime('success');
      setStatusMessage('Opening Spotlight Search...');
      speakFeedback('Opening Spotlight Search');
      onOpenSearch();
      executeAction(() => onClose(), 600);
      return;
    }

    // 4. Scrolling Controls
    if (clean.includes('scroll to top') || clean.includes('go to top') || clean === 'top') {
      playChime('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStatusMessage('Scrolled to top');
      speakFeedback('Scrolled to top');
      return;
    }
    if (clean.includes('scroll to bottom') || clean.includes('go to bottom') || clean === 'bottom') {
      playChime('success');
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      setStatusMessage('Scrolled to bottom');
      speakFeedback('Scrolled to bottom');
      return;
    }
    if (clean.includes('scroll down') || clean.includes('page down') || clean.includes('scroll down a bit')) {
      playChime('success');
      window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
      setStatusMessage('Scrolling down');
      return;
    }
    if (clean.includes('scroll up') || clean.includes('page up')) {
      playChime('success');
      window.scrollBy({ top: -window.innerHeight * 0.75, behavior: 'smooth' });
      setStatusMessage('Scrolling up');
      return;
    }

    // 5. Portal Navigation Intent Matching
    let bestMatch = null;
    let highestScore = 0;

    for (const cmd of VOICE_COMMANDS) {
      for (const phrase of cmd.phrases) {
        if (clean === phrase) {
          bestMatch = cmd;
          highestScore = 100;
          break;
        }
        if (clean.includes(phrase)) {
          const score = phrase.length;
          if (score > highestScore) {
            highestScore = score;
            bestMatch = cmd;
          }
        }
      }
      if (highestScore === 100) break;
    }

    if (bestMatch) {
      setMatchedCommand(bestMatch);
      setStatusMessage(`Navigating to ${bestMatch.label}...`);
      playChime('success');
      speakFeedback(`Opening ${bestMatch.label}`);

      // Auto redirect with instant action
      executeAction(() => {
        onNavigate(bestMatch.targetTab);
        addToast({
          message: `🎙️ Voice Navigation: Opened ${bestMatch.label}`,
          type: 'success'
        });
        onClose();
      }, 750);
    } else {
      setStatusMessage(`Heard: "${rawText}" — Try saying "Open Notes" or "Go to Codeverse"`);
    }
  };

  const executeAction = (fn, delay = 800) => {
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    countdownTimerRef.current = setTimeout(fn, delay);
  };

  const handleManualSelect = (cmd) => {
    playChime('success');
    speakFeedback(`Opening ${cmd.label}`);
    onNavigate(cmd.targetTab);
    addToast({
      message: `🎙️ Navigated to ${cmd.label}`,
      type: 'success'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#050814]/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Main Voice Navigator Card */}
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0F172A] via-[#0B132B] to-[#080E21] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200 text-white">
        
        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-44 bg-gradient-to-r from-cyan-500/30 via-blue-600/30 to-purple-600/30 blur-3xl pointer-events-none" />

        {/* Header Row */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
                <span>Lumixora AI Voice Navigator</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Speak Any Portal or Action
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle TTS Voice Feedback */}
            <button
              onClick={() => setVoiceFeedbackEnabled(prev => !prev)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                voiceFeedbackEnabled 
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' 
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
              title={voiceFeedbackEnabled ? 'Voice confirmation is ON (Click to mute)' : 'Voice confirmation is MUTED (Click to enable)'}
            >
              {voiceFeedbackEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Glowing Mic / Soundwave Visualizer */}
        <div className="flex flex-col items-center justify-center py-6 relative z-10">
          <div className="relative flex items-center justify-center mb-5">
            {/* Pulsing Concentric Aura */}
            <div className={`absolute w-32 h-32 rounded-full transition-all duration-700 ${
              isListening ? 'bg-cyan-500/20 scale-125 animate-ping' : 'bg-transparent'
            }`} />
            <div className={`absolute w-24 h-24 rounded-full transition-all duration-500 ${
              isListening ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 scale-110' : 'bg-transparent'
            }`} />

            {/* Glowing Microphone Orb */}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer relative z-10 ${
                isListening
                  ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/40 ring-4 ring-cyan-400/30 scale-105'
                  : 'bg-white/10 hover:bg-white/15 text-gray-300 border border-white/20'
              }`}
              title={isListening ? 'Click to pause listening' : 'Click to start listening'}
            >
              <Mic className={`w-8 h-8 ${isListening ? 'animate-pulse text-white' : 'text-gray-300'}`} />
            </button>
          </div>

          {/* Real-time Dynamic Soundwave Bars */}
          <div className="flex items-center gap-1.5 h-10 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-3">
            {audioLevel.map((height, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-cyan-500 to-blue-400 transition-all duration-100"
                style={{ height: `${isListening ? height : 15}%` }}
              />
            ))}
            <span className="text-[11px] font-mono text-cyan-300 ml-2 font-semibold">
              {isListening ? 'LISTENING LIVE' : 'MIC PAUSED'}
            </span>
          </div>

          {/* Transcript / Spoken Feedback Box */}
          <div className="w-full min-h-[58px] p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center flex flex-col items-center justify-center">
            {transcript ? (
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Transcribed Speech</span>
                <p className="text-sm md:text-base font-bold text-cyan-300 tracking-wide">
                  "{transcript}"
                  {interimTranscript && <span className="opacity-60 italic"> {interimTranscript}</span>}
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                {hasPermissionError 
                  ? '⚠️ Microphone permission needed. Please allow microphone in your browser URL bar.'
                  : 'Say e.g. "Open Notes", "Take me to Placement", "Go to Codeverse", or "Dark Mode"'}
              </p>
            )}
          </div>

          {/* Matched Destination Preview Card */}
          {matchedCommand && (
            <div className="w-full mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{matchedCommand.icon}</span>
                <div className="text-left">
                  <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Recognized Target</div>
                  <div className="text-sm font-bold text-white">{matchedCommand.label}</div>
                  <div className="text-[11px] text-gray-400">{matchedCommand.description}</div>
                </div>
              </div>
              <button
                onClick={() => handleManualSelect(matchedCommand)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Go Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Status Line */}
        <div className="text-center text-[11px] font-medium text-gray-400 mb-5 flex items-center justify-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>{statusMessage}</span>
        </div>

        {/* Quick Suggestion Voice Chips */}
        <div className="space-y-2 pt-2 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-semibold text-gray-300">Quick Voice Navigation Commands:</span>
            <button
              onClick={() => setShowCheatSheet(prev => !prev)}
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3 h-3" />
              <span>{showCheatSheet ? 'Hide Full List' : 'View All (25+)'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: '📚 Notes Platform', cmd: 'open notes', targetTab: 'notes' },
              { label: '💼 Placement Suite', cmd: 'placement commander', targetTab: 'ai-commander' },
              { label: '💻 Codeverse DSA', cmd: 'open coding', targetTab: 'coding-practice' },
              { label: '🤖 BoloClass AI', cmd: 'open boloclass', targetTab: 'boloclass' },
              { label: '🎯 Mock Interview', cmd: 'mock interview', targetTab: 'interview' },
              { label: '⚡ Doubt Solver', cmd: 'open doubts', targetTab: 'doubts' },
              { label: '🎥 Learning Hub', cmd: 'learning hub', targetTab: 'learning-hub' },
              { label: '🏆 Hackathons', cmd: 'open hackathons', targetTab: 'hackathons' },
              { label: '🛒 Marketplace', cmd: 'open marketplace', targetTab: 'marketplace' },
              { label: '⚡ Clubs & CAD', cmd: 'open clubs', targetTab: 'clubs' },
              { label: '🌓 Toggle Dark Mode', cmd: 'dark mode', isTheme: true },
              { label: '🔍 Search (Ctrl+K)', cmd: 'search', isSearch: true }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (chip.isTheme) onToggleTheme();
                  else if (chip.isSearch) onOpenSearch();
                  else if (chip.targetTab) {
                    onNavigate(chip.targetTab);
                    onClose();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-[11px] font-medium text-gray-300 hover:text-cyan-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs group"
                title={`Click or say: "${chip.cmd}"`}
              >
                <span>{chip.label}</span>
                <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>

          {/* Expanded Full Cheat Sheet */}
          {showCheatSheet && (
            <div className="mt-4 p-3 rounded-2xl bg-black/40 border border-white/10 max-h-48 overflow-y-auto divide-y divide-white/5 text-xs animate-in fade-in duration-150">
              <div className="pb-2 font-bold text-cyan-300 text-[11px] uppercase tracking-wider">
                Full Voice Command Taxonomy
              </div>
              {VOICE_COMMANDS.map((cmd, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleManualSelect(cmd)}
                  className="py-2 flex items-center justify-between hover:bg-white/5 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{cmd.icon}</span>
                    <span className="font-bold text-gray-200">{cmd.label}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 italic">
                    Say: "{cmd.phrases[0]}"
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
          <div className="flex items-center gap-2">
            <span>Shortcut:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-cyan-300">Alt + V</kbd>
            <span>or click mic</span>
          </div>
          <div>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-gray-300">Esc</kbd> to close</span>
          </div>
        </div>

      </div>
    </div>
  );
}
