import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Film, Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Sparkles, Code2, Terminal, Cpu, Award, Zap, Shield, Flame, BookOpen,
  ChevronRight, ArrowRight, Layers, Sliders, CheckCircle2, Clock, Maximize2,
  Tv, Compass, Check, Clapperboard, Star, Brain, GraduationCap, Mic, MicOff,
  Eye, Monitor
} from 'lucide-react';

/* ─── HOLLYWOOD-GRADE DYNAMIC AUDIO SYNTHESIZER (WEB AUDIO API) ─── */
class CinemaDynamicAudio {
  constructor() {
    this.ctx = null;
    this.oscDrone = null;
    this.oscHarmonic = null;
    this.projectorInterval = null;
    this.gain = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playDeepNote() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const chord = [35.0, 52.3, 70.0, 104.6, 139.9, 209.3];
      const now = this.ctx.currentTime;
      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.01, now);
      master.gain.exponentialRampToValueAtTime(0.10, now + 1.8);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
      master.connect(this.ctx.destination);

      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq * 0.75, now);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 1.8);
        osc.connect(master);
        osc.start(now);
        osc.stop(now + 3.2);
      });
    } catch (e) {}
  }

  playCountdownBeep(freq = 440) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      g.gain.setValueAtTime(0.07, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch (e) {}
  }

  startProjectorSound() {
    try {
      this.init();
      if (!this.ctx || this.projectorInterval) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      this.projectorInterval = setInterval(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(140 + Math.random() * 80, now);
        clickGain.gain.setValueAtTime(0.008, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.03);
      }, 42);
    } catch (e) {}
  }

  stopProjectorSound() {
    if (this.projectorInterval) {
      clearInterval(this.projectorInterval);
      this.projectorInterval = null;
    }
  }

  startScore() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      if (this.isPlaying) return;

      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.gain.gain.exponentialRampToValueAtTime(0.035, this.ctx.currentTime + 1.5);
      this.gain.connect(this.ctx.destination);

      this.oscDrone = this.ctx.createOscillator();
      this.oscDrone.type = 'sawtooth';
      this.oscDrone.frequency.setValueAtTime(43.65, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, this.ctx.currentTime);
      this.oscDrone.connect(filter);
      filter.connect(this.gain);
      this.oscDrone.start();

      this.oscHarmonic = this.ctx.createOscillator();
      this.oscHarmonic.type = 'sine';
      this.oscHarmonic.frequency.setValueAtTime(130.81, this.ctx.currentTime);
      this.oscHarmonic.connect(this.gain);
      this.oscHarmonic.start();

      this.isPlaying = true;
      this.startProjectorSound();
    } catch (e) {}
  }

  stopScore() {
    try {
      this.stopProjectorSound();
      if (this.gain && this.ctx) {
        this.gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          if (this.oscDrone) { try { this.oscDrone.stop(); this.oscDrone.disconnect(); } catch(e){} this.oscDrone = null; }
          if (this.oscHarmonic) { try { this.oscHarmonic.stop(); this.oscHarmonic.disconnect(); } catch(e){} this.oscHarmonic = null; }
          this.isPlaying = false;
        }, 350);
      }
    } catch (e) {}
  }
}

const landingAudio = new CinemaDynamicAudio();

/* ─── 5 FEATURE ACTS: WELCOME TO LUMIXORA & CORE ECOSYSTEM ─── */
const LUMIXORA_FEATURE_FILM = {
  id: 'welcome-lumixora',
  title: 'Welcome to Lumixora: The Living Code Theater',
  synopsis: 'Experience how Lumixora unites autonomous placement radars, interactive code cinemas, 70M exam blueprint predictors, and verifiable proof of skill into one connected powerhouse.',
  runtime: '5 Key Feature Acts',
  director: 'Lumixora AI Director • Sweet Lumina Voice',
  crisis: 'Traditional education traps students in passive video tutorials without verified proof of skill, leaving 80% of Tier-2/3 engineering scholars disconnected from top tech placement opportunities.',
  outcomes: [
    'Autonomous AI Placement Radar with 94.8% Readiness Verification',
    'Interactive CodeCinema™ Transforming Code into Living Visual Architectures',
    'AI 70M Model Predicting University Question Papers with Solved Sets'
  ],
  acts: [
    {
      actNumber: '01',
      title: 'Autonomous Placement Radar & AI Commander',
      concept: 'AI Placement Twin & Dynamic Readiness Index',
      duration: 11,
      badge: 'Signature Feature',
      code: `// Act I: Lumixora Autonomous Placement Radar
import { AIPlacementRadar, CareerTwin } from '@lumixora/core';

export async function computePlacementReadiness(scholarId) {
  const twin = await CareerTwin.hydrate(scholarId);
  const benchmark = await AIPlacementRadar.getTier1Expectations({
    targetRole: 'Full-Stack Software Architect',
    firms: ['Amazon', 'Google', 'TCS Prime', 'Cognizant']
  });

  // Evaluate code rigor, mock communication, and verified projects
  const diagnostic = AIPlacementRadar.evaluateReadiness(twin, benchmark);
  return {
    readinessScore: 94.8, // Calibrated percentage
    matchedCampusOffers: 450,
    status: 'PLACED_AND_VERIFIED'
  };
}`,
      stdout: [
        '>>> [LUMIXORA RADAR] Initializing Placement Twin telemetry...',
        '>>> [LUMIXORA RADAR] Ingesting 450+ campus drives across GPREC, RGUKT & partner nodes...',
        '>>> [LUMIXORA RADAR] AI Mock Interview & ATS diagnostic score: 94.8% (TIER 1 READY)',
        '>>> [LUMIXORA RADAR] Active matching: Amazon, Google Cloud, TCS Prime, Cognizant.'
      ],
      commentary: 'Welcome to Lumixora. Act one opens with the Autonomous Placement Radar. We bridge the gap between academic textbooks and real industry careers, evaluating student readiness with AI mock interviews, skills verification, and direct employer matching.'
    },
    {
      actNumber: '02',
      title: 'CodeCinema™ — The Living Code Theater',
      concept: 'Real-Time AST Execution & Micro-Architecture Reactor',
      duration: 11,
      badge: 'IMAX Education',
      code: `// Act II: CodeCinema™ Living Architecture Engine
import { CodeCinema, DynamicASTReactor } from '@lumixora/cinema';

const cinema = new CodeCinema({
  canvas: '#lumixora-auditorium',
  framerate: 60, // Hardware-accelerated 60 FPS
  audio: 'DOLBY_OPTICAL_STEREO'
});

// Polyglot AST Reactor parses user programs into live visual pipelines
cinema.mountReactor(DynamicASTReactor.fromSource({
  expression: 'print(5 + 7)',
  constantFolding: true,
  simulateALU: true
}));

cinema.playFeature({ title: 'Constant Folding & Memory Stack Odyssey' });`,
      stdout: [
        '>>> [CODECINEMA] Projector beam focused. 70MM CinemaScope engaged.',
        '>>> [CODECINEMA] Parsing abstract syntax tree (AST): BinOp(Num(5), Add, Num(7))',
        '>>> [CODECINEMA] Constant Folding: [5] and [7] fused in ALU accumulator -> 12',
        '>>> [CODECINEMA] Zero passive learning: every line of code moves the architecture.'
      ],
      commentary: 'Act two reveals CodeCinema. Say goodbye to dry, passive tutorials. Students step into a virtual cinema where real code comes alive as animated CPU pipelines, memory stacks, and dynamic software architecture in real-time.'
    },
    {
      actNumber: '03',
      title: 'AI 70M Blueprint Exam Paper Predictor',
      concept: 'Deep Historical Pattern Synthesis & Solved Sets',
      duration: 11,
      badge: '2026 Calibrated',
      code: `// Act III: AI 70M Blueprint Paper Predictor
import { ExamPredictor70M } from '@lumixora/predictor';

export async function forecastSemesterExam(subjectCode, regulation) {
  // Analyze 7+ years of autonomous university paper shifts
  const shiftMatrix = await ExamPredictor70M.analyzeFrequency({
    subject: 'Data Structures & Algorithms',
    regulation: 'R20/R23 Autonomous'
  });

  const exactSets = await ExamPredictor70M.generateSolvedSets(shiftMatrix, {
    setCount: 2,
    includeSectionalDerivations: true
  });

  return exactSets; // 100% High-frequency coverage
}`,
      stdout: [
        '>>> [70M PREDICTOR] Scanning 1,195 verified question papers...',
        '>>> [70M PREDICTOR] Detecting recurring autonomous question patterns & algorithms...',
        '>>> [70M PREDICTOR] Generated Set 1: High-Frequency Theory & Derivations (100% matched)',
        '>>> [70M PREDICTOR] Generated Set 2: Analytical & Problem Modeling (Fully solved)'
      ],
      commentary: 'Act three presents the AI seventy-M Blueprint Predictor. By analyzing years of university question patterns, Lumixora forecasts two exact predicted examination papers, complete with step-by-step verified solutions.'
    },
    {
      actNumber: '04',
      title: 'BoloClass & Lumina 3D AI Classroom',
      concept: 'Natural Speech Synthesis & Instant Doubt Clearing',
      duration: 11,
      badge: 'Interactive AI',
      code: `// Act IV: BoloClass & Lumina 3D Interactive Classroom
import { LuminaVirtualMentor } from '@lumixora/boloclass';

const mentor = new LuminaVirtualMentor({
  voiceEngine: 'NATURAL_SPEECH_V2',
  interactiveChalkboard: true,
  doubtResolution: 'INSTANT'
});

// Student asks: "Why does QuickSort degrade to O(N^2) on sorted arrays?"
mentor.onStudentVoiceQuery(async (question) => {
  const answer = await mentor.explainWithChalkboardAnimation(question);
  mentor.drawPivotDecisionTree(); // Visual 3D explanation
  return answer;
});`,
      stdout: [
        '>>> [BOLOCLASS] Lumina 3D Classroom avatar connected.',
        '>>> [BOLOCLASS] Natural voice query received: QuickSort pivot degradation...',
        '>>> [BOLOCLASS] Drawing dynamic recursive tree on interactive chalkboard...',
        '>>> [BOLOCLASS] Personalized explanation rendered in 0.4 seconds.'
      ],
      commentary: 'Act four introduces BoloClass. An interactive AI classroom where Lumina, your personal mentor, explains complex engineering concepts, draws animated proofs on the chalkboard, and solves your doubts instantly with voice.'
    },
    {
      actNumber: '05',
      title: 'Proof of Skill & Cryptographic Credentials',
      concept: 'Tamper-Proof GitHub & Compiler Verified Milestones',
      duration: 11,
      badge: '100% Verifiable',
      code: `// Act V: Cryptographic Proof of Skill Protocol
import { ProofOfSkillRegistry } from '@lumixora/credentials';

export async function issueVerifiableDiploma(studentId, completedHubs) {
  // Validate real GitHub commits, test executions & proctor logs
  const verifiedAudit = await ProofOfSkillRegistry.verifyArtifacts({
    studentId,
    minimumLiveCodeRuns: 50,
    hackathonSubmissions: 3
  });

  return ProofOfSkillRegistry.mintSignedCredential({
    recipient: studentId,
    tamperProofSignature: verifiedAudit.sha256Digest,
    publicRecruiterVerificationUrl: 'https://lumixora.in/verify/p-9821'
  });
}`,
      stdout: [
        '>>> [PROOF OF SKILL] Compiling tamper-proof cryptographic audit...',
        '>>> [PROOF OF SKILL] Verified: 12 Real Projects, 60+ GitHub Commits, 0% Plagiarism.',
        '>>> [PROOF OF SKILL] Minted verified student credential with public recruiter link.',
        '>>> [LUMIXORA COMPLETE] Career unlocked. Built by Students, for Students.'
      ],
      commentary: 'Act five seals your engineering journey. In Lumixora, every project, git commit, and challenge completed is backed by cryptographic proof of skill, allowing recruiters and top companies to immediately verify your talent.'
    }
  ]
};

/* ─── HELPER TO COLORIZE SYNTAX IN CODE PROJECTOR ─── */
function renderSyntaxHighlighted(line) {
  if (line.trim().startsWith('//')) {
    return <span className="text-amber-400/80 italic font-mono">{line}</span>;
  }
  
  // Highlight keywords
  const parts = line.split(/(\b(?:import|from|export|async|function|const|let|var|return|await|new|class|true|false)\b|'[^']*'|"[^"]*"|\d+)/g);

  return (
    <span className="font-mono">
      {parts.map((part, i) => {
        if (!part) return null;
        if (/^(?:import|from|export|async|function|const|let|var|return|await|new|class)$/.test(part)) {
          return <span key={i} className="text-purple-400 font-bold">{part}</span>;
        }
        if (/^(?:true|false)$/.test(part)) {
          return <span key={i} className="text-amber-300 font-bold">{part}</span>;
        }
        if (/^['"].*['"]$/.test(part)) {
          return <span key={i} className="text-emerald-400">{part}</span>;
        }
        if (/^\d+$/.test(part)) {
          return <span key={i} className="text-cyan-300 font-semibold">{part}</span>;
        }
        if (part.includes('//')) {
          return <span key={i} className="text-amber-400/80 italic">{part}</span>;
        }
        return <span key={i} className="text-slate-200">{part}</span>;
      })}
    </span>
  );
}

export default function LandingCodeCinema({ onGetStarted }) {
  // Stages: 'premiere' | 'opening_curtains' | 'countdown' | 'playing' | 'paused'
  const [cinemaStage, setCinemaStage] = useState('premiere');
  const [countdownNumber, setCountdownNumber] = useState(null);
  const [activeActIndex, setActiveActIndex] = useState(0);
  const [timelineTime, setTimelineTime] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true); // ENABLED BY DEFAULT!
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'visuals' | 'code'
  const [activeLine, setActiveLine] = useState(0);
  const [availableVoices, setAvailableVoices] = useState([]);

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const tickRef = useRef(0);

  const activeAct = LUMIXORA_FEATURE_FILM.acts[activeActIndex];
  const areCurtainsClosed = cinemaStage === 'premiere';
  const isPlaying = cinemaStage === 'playing';

  // ─── SWEET NATURAL VOICE SELECTOR ───
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const vList = window.speechSynthesis.getVoices();
      if (vList && vList.length > 0) {
        setAvailableVoices(vList);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getSweetVoice = () => {
    if (availableVoices.length === 0) return null;

    // Sweet Female Natural Voice Keywords
    const sweetNames = ['jenny', 'aria', 'samantha', 'victoria', 'karen', 'serena', 'zira', 'natural', 'neural', 'female'];

    // 1. High-priority natural online/neural female voice (Edge/Windows/Chrome)
    let found = availableVoices.find(v => {
      const name = v.name.toLowerCase();
      const isEn = v.lang.toLowerCase().startsWith('en');
      return isEn && (name.includes('natural') || name.includes('online')) && (name.includes('jenny') || name.includes('aria') || name.includes('female'));
    });

    // 2. Named female sweet voices
    if (!found) {
      found = availableVoices.find(v => {
        const name = v.name.toLowerCase();
        const isEn = v.lang.toLowerCase().startsWith('en');
        return isEn && sweetNames.some(sn => name.includes(sn));
      });
    }

    // 3. Any English voice
    if (!found) {
      found = availableVoices.find(v => v.lang.toLowerCase().startsWith('en'));
    }

    return found || availableVoices[0];
  };

  const playSweetVoiceNarration = (text) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const sweetVoice = getSweetVoice();
      if (sweetVoice) {
        utterance.voice = sweetVoice;
      }
      // Sweet, warm, friendly cadence
      utterance.rate = 0.94;
      utterance.pitch = 1.16;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Voice narration error:', e);
    }
  };

  // 🎬 Trigger Curtains Open and 3-2-1 Countdown
  const handleStartMovie = () => {
    // Resume browser audio and speech synthesis contexts on user gesture
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    landingAudio.init();

    setCinemaStage('opening_curtains');
    landingAudio.playDeepNote();

    setTimeout(() => {
      setCinemaStage('countdown');
      setCountdownNumber(3);
      landingAudio.playCountdownBeep(440);

      const c2 = setTimeout(() => {
        setCountdownNumber(2);
        landingAudio.playCountdownBeep(554);
      }, 850);

      const c1 = setTimeout(() => {
        setCountdownNumber(1);
        landingAudio.playCountdownBeep(659);
      }, 1700);

      const cGo = setTimeout(() => {
        setCountdownNumber(null);
        landingAudio.playCountdownBeep(880);
        setCinemaStage('playing');
        if (isAudioEnabled) {
          landingAudio.startScore();
        }
        // Speak the first act with sweet voice immediately!
        playSweetVoiceNarration(LUMIXORA_FEATURE_FILM.acts[0].commentary);
      }, 2550);
    }, 1100);
  };

  const handleCloseCurtains = () => {
    setCinemaStage('premiere');
    landingAudio.stopScore();
    setTimelineTime(0);
    setActiveLine(0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const togglePlayPause = () => {
    if (cinemaStage === 'premiere') {
      handleStartMovie();
      return;
    }
    if (isPlaying) {
      setCinemaStage('paused');
      landingAudio.stopScore();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
    } else {
      setCinemaStage('playing');
      if (isAudioEnabled) landingAudio.startScore();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
    }
  };

  // Synchronized Act Timeline Loop (11 seconds per act)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimelineTime((prev) => {
        if (prev >= activeAct.duration) {
          // Advance to next act or loop to beginning
          const nextIndex = (activeActIndex < LUMIXORA_FEATURE_FILM.acts.length - 1) ? activeActIndex + 1 : 0;
          setActiveActIndex(nextIndex);
          playSweetVoiceNarration(LUMIXORA_FEATURE_FILM.acts[nextIndex].commentary);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, activeActIndex, activeAct.duration]);

  // Code Line Highlighter based on timeline progress
  useEffect(() => {
    if (!activeAct) return;
    const lines = activeAct.code.split('\n');
    const progressRatio = Math.min(timelineTime / activeAct.duration, 0.95);
    const lineIndex = Math.floor(progressRatio * lines.length);
    setActiveLine(lineIndex);
  }, [timelineTime, activeAct]);

  // Handle manual act select
  const handleSelectAct = (idx) => {
    setActiveActIndex(idx);
    setTimelineTime(0);
    if (isPlaying) {
      playSweetVoiceNarration(LUMIXORA_FEATURE_FILM.acts[idx].commentary);
    }
  };

  // ─── 60 FPS SPECTACULAR CINEMATIC LIVING ARCHITECTURE CANVAS ───
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    // Floating background particle dust motes
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * 600,
      y: Math.random() * 400,
      radius: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2
    }));

    const render = () => {
      if (!running) return;
      tickRef.current += 1;
      const tick = tickRef.current;

      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      // Deep space cinema background with vignette
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width);
      bgGrad.addColorStop(0, '#0d0c18');
      bgGrad.addColorStop(0.7, '#07060e');
      bgGrad.addColorStop(1, '#030206');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw floating cosmic particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha * (0.6 + Math.sin(tick * 0.05) * 0.4)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Perspective horizon grid
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.07)';
      ctx.lineWidth = 1;
      const horizonY = height * 0.82;
      for (let x = -width; x < width * 2; x += 40) {
        ctx.beginPath();
        ctx.moveTo(width / 2, horizonY * 0.5);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = horizonY * 0.5; y < height; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const cx = width / 2;
      const cy = height / 2 - 10;

      // ─── ACT 1: AUTONOMOUS PLACEMENT RADAR & AI COMMANDER ───
      if (activeActIndex === 0) {
        const radius = Math.min(width, height) * 0.40;

        // Glowing outer radar shield
        const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.15);
        outerGlow.addColorStop(0, 'rgba(16, 185, 129, 0.0)');
        outerGlow.addColorStop(0.7, 'rgba(16, 185, 129, 0.15)');
        outerGlow.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
        ctx.fill();

        // 3 Concentric Glowing Rings
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.70, 0, Math.PI * 2);
        ctx.arc(cx, cy, radius * 0.40, 0, Math.PI * 2);
        ctx.arc(cx, cy, radius * 0.15, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs with degree markers
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.beginPath();
        ctx.moveTo(cx - radius, cy);
        ctx.lineTo(cx + radius, cy);
        ctx.moveTo(cx, cy - radius);
        ctx.lineTo(cx, cy + radius);
        ctx.stroke();

        // High-tech rotating radar sweep with lingering phosphorescent trail
        const sweepAngle = (tick * 0.035) % (Math.PI * 2);
        const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        sweepGrad.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
        sweepGrad.addColorStop(0.6, 'rgba(6, 182, 212, 0.35)');
        sweepGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, sweepAngle - 0.7, sweepAngle);
        ctx.closePath();
        ctx.fill();

        // Orbiting Company Targets & Student Nodes
        const targets = [
          { name: 'AMAZON (Tier 1)', dist: 0.82, angle: 0.5, color: '#f59e0b', ping: true },
          { name: 'GOOGLE CLOUD', dist: 0.65, angle: 2.2, color: '#38bdf8', ping: true },
          { name: 'TCS PRIME', dist: 0.50, angle: 3.8, color: '#a855f7', ping: false },
          { name: 'COGNIZANT', dist: 0.75, angle: 5.1, color: '#10b981', ping: false }
        ];

        targets.forEach((t) => {
          const tx = cx + Math.cos(t.angle + tick * 0.005) * radius * t.dist;
          const ty = cy + Math.sin(t.angle + tick * 0.005) * radius * t.dist;

          // Glowing node
          ctx.fillStyle = t.color;
          ctx.beginPath();
          ctx.arc(tx, ty, 6, 0, Math.PI * 2);
          ctx.fill();

          // Laser lock-on beam from center
          ctx.strokeStyle = `${t.color}40`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(tx, ty);
          ctx.stroke();

          // Pulse ripple
          const ripple = (tick * 0.08) % 1;
          ctx.strokeStyle = `${t.color}${Math.floor((1 - ripple) * 255).toString(16).padStart(2, '0')}`;
          ctx.beginPath();
          ctx.arc(tx, ty, 6 + ripple * 16, 0, Math.PI * 2);
          ctx.stroke();

          // Label
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(t.name, tx + 10, ty + 4);
        });

        // Center Student Twin Pulse
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(cx, cy, 10 + Math.sin(tick * 0.1) * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 94.8% Holographic Readiness Pill in Center Top
        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cx - 75, cy - radius - 24, 150, 24, [6]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('94.8% READINESS CONFIRMED', cx, cy - radius - 8);
        ctx.textAlign = 'left';
      }

      // ─── ACT 2: CODECINEMA™ QUANTUM AST REACTOR ───
      else if (activeActIndex === 1) {
        const pulse = Math.sin(tick * 0.08) * 8;

        // Central Quantum Fusion Core
        const coreGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 65 + pulse);
        coreGrad.addColorStop(0, 'rgba(255, 240, 200, 0.9)');
        coreGrad.addColorStop(0.3, 'rgba(212, 175, 55, 0.7)');
        coreGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.3)');
        coreGrad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 65 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Orbiting Plasma Electron Ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tick * 0.04);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, 95, 38, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.rotate(Math.PI / 3);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 95, 38, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Left Operand Node [5]
        const leftX = cx - 110;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.beginPath();
        ctx.arc(leftX, cy, 34 + Math.sin(tick * 0.1) * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NUM [5]', leftX, cy + 5);

        // Right Operand Node [7]
        const rightX = cx + 110;
        ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
        ctx.beginPath();
        ctx.arc(rightX, cy, 34 + Math.sin(tick * 0.1 + 1) * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillText('NUM [7]', rightX, cy + 5);

        // High Voltage Lightning Electric Arcs Connecting into Center
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftX + 34, cy);
        const midY1 = cy + (Math.random() - 0.5) * 16;
        ctx.lineTo((leftX + cx) / 2, midY1);
        ctx.lineTo(cx - 30, cy);

        ctx.moveTo(rightX - 34, cy);
        const midY2 = cy + (Math.random() - 0.5) * 16;
        ctx.lineTo((rightX + cx) / 2, midY2);
        ctx.lineTo(cx + 30, cy);
        ctx.stroke();

        // Center ALU Output Result [12]
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('ALU: 12', cx, cy + 7);

        // Header Title
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#fde047';
        ctx.fillText('CONSTANT FOLDING AST PIPELINE', cx, cy - 70);
        ctx.textAlign = 'left';
      }

      // ─── ACT 3: AI 70M BLUEPRINT EXAM PAPER PREDICTOR ───
      else if (activeActIndex === 2) {
        // Multi-frequency harmonic spectrum oscilloscope waves
        const colors = ['#22d3ee', '#a855f7', '#10b981'];
        colors.forEach((col, idx) => {
          ctx.strokeStyle = col;
          ctx.lineWidth = 2.5 - idx * 0.5;
          ctx.beginPath();
          for (let x = 0; x < width; x += 4) {
            const freq = 0.025 + idx * 0.01;
            const phase = tick * (0.06 + idx * 0.02);
            const y = cy + Math.sin(x * freq + phase) * (36 - idx * 8) * Math.cos(x * 0.008);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });

        // 2 Glowing Holographic Examination Sets
        const setWidth = 135;
        const setHeight = 110;
        const setY = cy - 55;

        // Set 1 (Derivations & Theory)
        const set1X = cx - setWidth - 14;
        ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
        ctx.beginPath();
        ctx.roundRect(set1X, setY, setWidth, setHeight, [12]);
        ctx.fill();
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('PREDICTED SET 1', set1X + setWidth / 2, setY + 24);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.fillText('High-Frequency Theory', set1X + setWidth / 2, setY + 48);
        ctx.fillText('& Derivations', set1X + setWidth / 2, setY + 64);
        
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('✓ 100% MATCH', set1X + setWidth / 2, setY + 92);

        // Set 2 (Problems & Modeling)
        const set2X = cx + 14;
        ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
        ctx.beginPath();
        ctx.roundRect(set2X, setY, setWidth, setHeight, [12]);
        ctx.fill();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('PREDICTED SET 2', set2X + setWidth / 2, setY + 24);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.fillText('Analytical Problems', set2X + setWidth / 2, setY + 48);
        ctx.fillText('& Algorithms', set2X + setWidth / 2, setY + 64);
        
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('✓ FULLY SOLVED', set2X + setWidth / 2, setY + 92);

        // Vertical Laser Scanning Line
        const laserX = cx - 140 + ((tick * 3) % 280);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(laserX, cy - 70);
        ctx.lineTo(laserX, cy + 70);
        ctx.stroke();

        ctx.textAlign = 'left';
      }

      // ─── ACT 4: BOLOCLASS & LUMINA 3D AI CLASSROOM ───
      else if (activeActIndex === 3) {
        // Glowing Central Audio Sphere (Lumina's Voice Avatar)
        const orbRadius = 38 + Math.sin(tick * 0.12) * 5;
        const orbGrad = ctx.createRadialGradient(cx, cy - 20, 5, cx, cy - 20, orbRadius + 20);
        orbGrad.addColorStop(0, '#ffffff');
        orbGrad.addColorStop(0.4, '#a855f7');
        orbGrad.addColorStop(0.8, '#6366f1');
        orbGrad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(cx, cy - 20, orbRadius + 20, 0, Math.PI * 2);
        ctx.fill();

        // Lumina Voice Core Icon
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy - 20, orbRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4f46e5';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LUMINA', cx, cy - 15);

        // Dynamic 32-Bar Soundwave Equalizer at Bottom
        const barCount = 28;
        const bWidth = 6;
        const totalW = barCount * (bWidth + 4);
        const startX = cx - totalW / 2;

        for (let i = 0; i < barCount; i++) {
          const h = 15 + Math.abs(Math.sin((i * 0.3) + (tick * 0.15))) * 55;
          const bx = startX + (i * (bWidth + 4));
          const by = cy + 50 - h;

          ctx.fillStyle = `hsl(${260 + i * 4}, 85%, 65%)`;
          ctx.beginPath();
          ctx.roundRect(bx, by, bWidth, h, [3]);
          ctx.fill();
        }

        // Floating Chalkboard Math Equations
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'italic 12px serif';
        ctx.fillText('O(N log N)', cx - 110, cy - 50);
        ctx.fillText('f(x) = λe^-λx', cx + 110, cy - 50);
        ctx.fillText('QuickSort(A, p, r)', cx - 100, cy + 15);
        ctx.fillText('∇f(θ) = E[g]', cx + 100, cy + 15);

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#a855f7';
        ctx.fillText('0.4s NEURAL VOICE LATENCY • INSTANT DOUBTS', cx, cy + 75);
        ctx.textAlign = 'left';
      }

      // ─── ACT 5: CRYPTOGRAPHIC PROOF OF SKILL ───
      else {
        // Rotating 3D Isometric Blockchain Cube
        const cubeSize = 52 + Math.sin(tick * 0.05) * 4;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI / 6);

        // Outer Hex Ring
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const hx = Math.cos(angle) * (cubeSize + 25);
          const hy = Math.sin(angle) * (cubeSize + 25);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.fill();
        ctx.restore();

        // Center Verified Emblem
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(cx, cy, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('✓', cx, cy + 7);

        // Floating SHA-256 Hashes
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('SHA-256: 0x8F4A92...E17B', cx, cy - 65);
        ctx.fillText('12 PROJECTS • 60+ COMMITS VERIFIED', cx, cy + 70);
        ctx.fillStyle = '#34d399';
        ctx.fillText('PUBLIC RECRUITER AUDIT LINK ACTIVE', cx, cy + 86);
        ctx.textAlign = 'left';
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [activeActIndex]);

  return (
    <section id="code-cinema" className="py-20 md:py-28 bg-[#050409] text-white relative overflow-hidden select-none">
      
      {/* ── BACKGROUND PROJECTION LIGHT & CINEMA ATMOSPHERE ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-b from-[#d4af37]/20 via-purple-600/15 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-20 left-0 right-0 h-60 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ── SECTION HEADER & THEATER TITLE ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-black tracking-widest uppercase shadow-md">
            <Film className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Lumixora CinemaScope 70MM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#fff7e6]">
            CodeCinema™ — The Living Code Theater
          </h2>
          <p className="text-sm sm:text-base text-gray-400 font-medium">
            Step inside our virtual IMAX theater. Watch real code transform into living visual architectures with audio narration.
          </p>
        </div>

        {/* ── AUDITORIUM PROSCENIUM FRAME ── */}
        <div className="relative rounded-[28px] md:rounded-[36px] overflow-hidden border-2 border-[#d4af37]/40 bg-[#0a0812] shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
          
          {/* Top Marquee Header Bar */}
          <div className="h-11 bg-[#120f1c] border-b border-[#d4af37]/30 px-4 sm:px-6 flex items-center justify-between text-xs font-mono text-[#d4af37]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="font-bold tracking-wider hidden sm:inline">35MM OPTICAL • DOLBY ATMOS</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300 font-bold uppercase">{activeAct.title}</span>
            </div>

            {/* View Mode Switcher + Voice Status */}
            <div className="flex items-center gap-3">
              {/* Sweet Voice Active Badge */}
              <button
                onClick={() => {
                  const nextState = !isVoiceEnabled;
                  setIsVoiceEnabled(nextState);
                  if (nextState) {
                    playSweetVoiceNarration(activeAct.commentary);
                  } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                  isVoiceEnabled 
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                    : 'bg-white/5 border-white/10 text-gray-500'
                }`}
                title="Toggle Sweet Voice Narration"
              >
                {isVoiceEnabled ? <Mic className="w-3 h-3 text-emerald-400 animate-pulse" /> : <MicOff className="w-3 h-3" />}
                <span>{isVoiceEnabled ? 'Sweet Voice: ON' : 'Voice: OFF'}</span>
              </button>

              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-white/10">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    viewMode === 'split' ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Split Stage"
                >
                  Split Screen
                </button>
                <button
                  onClick={() => setViewMode('visuals')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    viewMode === 'visuals' ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Full Visualizer"
                >
                  IMAX Visuals
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    viewMode === 'code' ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Code Projector"
                >
                  Code
                </button>
              </div>

              <span className="text-[10px] text-gray-400 hidden sm:inline">
                ACT {activeActIndex + 1} OF 5
              </span>
            </div>
          </div>

          {/* Screen Content: Dynamic View Modes */}
          <div className={`grid ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} min-h-[480px] sm:min-h-[520px] relative`}>
            
            {/* Left Screen: Living Architecture Simulator */}
            {(viewMode === 'split' || viewMode === 'visuals') && (
              <div className="relative border-b md:border-b-0 md:border-r border-[#d4af37]/20 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-[#090812] to-[#040308]">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-[#d4af37] font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>LIVING ARCHITECTURE SIMULATION</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-500/30 font-bold">
                    60 FPS HARDWARE ACCELERATED
                  </span>
                </div>

                {/* HTML5 Canvas Simulator */}
                <div className="relative w-full h-72 sm:h-80 md:h-[340px] rounded-2xl overflow-hidden border border-[#d4af37]/20 shadow-2xl">
                  <canvas ref={canvasRef} className="w-full h-full block" />
                </div>

                {/* Simulation Concept Footer */}
                <div className="mt-3 p-3 rounded-xl bg-black/75 border border-[#d4af37]/20 text-xs font-mono flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 block text-[10px]">CONCEPT MODEL:</span>
                    <span className="text-white font-bold">{activeAct.concept}</span>
                  </div>
                  <span className="text-[#d4af37] font-black text-xs">ACT {activeAct.actNumber}</span>
                </div>
              </div>
            )}

            {/* Right Screen: Code Projector Terminal */}
            {(viewMode === 'split' || viewMode === 'code') && (
              <div className="relative flex flex-col justify-between p-4 sm:p-6 bg-[#08070d] font-mono text-xs">
                <div className="flex items-center justify-between text-gray-400 border-b border-white/10 pb-2 mb-3">
                  <span className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>projector_kernel.ts</span>
                  </span>
                  <span className="text-[10px] text-gray-400">
                    TIMECODE: 00:0{timelineTime} / 00:{activeAct.duration}
                  </span>
                </div>

                {/* Code Display with Active Line Highlight & Rich Syntax Colors */}
                <div className="flex-1 bg-[#050409] p-4 rounded-xl border border-white/10 overflow-x-auto text-[11px] leading-relaxed select-text space-y-0.5 max-h-72 sm:max-h-80 md:max-h-[300px] overflow-y-auto">
                  {activeAct.code.split('\n').map((line, idx) => {
                    const isCurrent = idx === activeLine;
                    return (
                      <div 
                        key={idx} 
                        className={`flex items-start gap-3 px-2 py-0.5 rounded transition-all ${
                          isCurrent 
                            ? 'bg-[#d4af37]/25 border-l-2 border-[#d4af37] text-white font-bold shadow-md' 
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <span className="w-6 text-right text-gray-600 select-none text-[10px]">
                          {idx + 1}
                        </span>
                        <pre className="font-mono flex-1 whitespace-pre-wrap">
                          {renderSyntaxHighlighted(line)}
                        </pre>
                      </div>
                    );
                  })}
                </div>

                {/* Live Terminal STDOUT Output */}
                <div className="mt-3 p-3 rounded-xl bg-black border border-white/10 text-[10px] text-emerald-400 space-y-1 max-h-24 overflow-y-auto">
                  <div className="text-gray-500 font-bold border-b border-gray-800 pb-1">
                    &gt;_ STDOUT LOG BUFFER:
                  </div>
                  {activeAct.stdout.map((out, idx) => (
                    <div key={idx} className="font-mono text-gray-300">
                      {out}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── DIRECTOR COMMENTARY CAPTIONS DOCK ── */}
          <div className="bg-[#0e0c17] border-t border-[#d4af37]/30 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-left flex-1 space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold">
                <Brain className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>AI DIRECTOR COMMENTARY • {activeAct.title}</span>
              </div>
              <p className="text-xs sm:text-sm font-serif italic text-[#fff4d6] leading-relaxed">
                "{activeAct.commentary}"
              </p>
            </div>

            {/* Act Navigation Chips */}
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
              {LUMIXORA_FEATURE_FILM.acts.map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAct(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeActIndex === idx
                      ? 'bg-[#d4af37] text-[#120f1c] shadow-md shadow-[#d4af37]/40'
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  Act {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* ── CINEMA CONTROL BAR (Play, Curtains, Sound, Act Skip, CTA) ── */}
          <div className="bg-[#090710] border-t border-[#d4af37]/20 p-3 sm:p-4 px-6 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              {/* Play / Pause Button */}
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b38728] hover:brightness-110 text-black flex items-center justify-center font-bold shadow-lg shadow-[#d4af37]/30 cursor-pointer transition-all"
                title={isPlaying ? 'Pause Movie' : 'Play Movie'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black translate-x-0.5" />}
              </button>

              {/* Prev / Next Act */}
              <button
                onClick={() => {
                  const prevIdx = (activeActIndex - 1 + 5) % 5;
                  handleSelectAct(prevIdx);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                title="Previous Feature Act"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  const nextIdx = (activeActIndex + 1) % 5;
                  handleSelectAct(nextIdx);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                title="Next Feature Act"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              {/* Re-Close Curtains Button */}
              <button
                onClick={handleCloseCurtains}
                className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                title="Close Curtains"
              >
                <Film className="w-3 h-3 text-red-400" />
                <span>Close Curtains</span>
              </button>
            </div>

            {/* Audio Score, Voice Toggles & CTA */}
            <div className="flex items-center gap-2.5 text-xs font-mono text-gray-400">
              
              {/* Sweet Voice Button */}
              <button
                onClick={() => {
                  const nState = !isVoiceEnabled;
                  setIsVoiceEnabled(nState);
                  if (nState) {
                    playSweetVoiceNarration(activeAct.commentary);
                  } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-all ${
                  isVoiceEnabled 
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' 
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
                title="Sweet Voice Narration"
              >
                <Mic className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Sweet Voice</span>
              </button>

              {/* Score Button */}
              <button
                onClick={() => {
                  setIsAudioEnabled(!isAudioEnabled);
                  if (isAudioEnabled) landingAudio.stopScore();
                  else if (isPlaying) landingAudio.startScore();
                }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-all ${
                  isAudioEnabled 
                    ? 'bg-[#d4af37]/15 border-[#d4af37]/40 text-[#d4af37]' 
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
                title="Atmospheric Theater Score"
              >
                {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Score</span>
              </button>

              {/* Get Started CTA */}
              <button
                onClick={onGetStarted}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white font-sans font-bold text-xs shadow-lg shadow-purple-500/30 flex items-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02]"
              >
                <span>Experience Lumixora</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* 🎭 PHYSICALLY CONVINCING CRIMSON VELVET CURTAINS 🎭 */}
          {/* Left Velvet Curtain */}
          <div 
            className="absolute inset-y-0 left-0 w-1/2 z-40 transition-transform duration-1000 ease-in-out origin-left pointer-events-none shadow-[25px_0_60px_rgba(0,0,0,0.95)]"
            style={{
              transform: areCurtainsClosed ? 'translateX(0)' : 'translateX(-100%)',
              background: 'repeating-linear-gradient(90deg, #35060a 0px, #5e0d14 20px, #7a111a 35px, #42080d 50px)',
              borderRight: '3px solid #d4af37'
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/70" />
          </div>

          {/* Right Velvet Curtain */}
          <div 
            className="absolute inset-y-0 right-0 w-1/2 z-40 transition-transform duration-1000 ease-in-out origin-right pointer-events-none shadow-[-25px_0_60px_rgba(0,0,0,0.95)]"
            style={{
              transform: areCurtainsClosed ? 'translateX(0)' : 'translateX(100%)',
              background: 'repeating-linear-gradient(90deg, #35060a 0px, #5e0d14 20px, #7a111a 35px, #42080d 50px)',
              borderLeft: '3px solid #d4af37'
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/70" />
          </div>

          {/* ─── STAGE 01: THE PREMIERE (MARQUEE BILLBOARD WITH "START YOUR MOVIE") ─── */}
          {areCurtainsClosed && (
            <div className="absolute inset-0 z-45 bg-[#08070a]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="max-w-2xl w-full border border-[#d4af37]/50 bg-[#121017] p-6 sm:p-8 md:p-10 rounded-2xl shadow-[0_0_60px_rgba(212,175,55,0.2)] relative">
                
                {/* Vintage Brass Corner Accents */}
                <div className="absolute top-2 left-2 text-[#d4af37] text-xs">╔</div>
                <div className="absolute top-2 right-2 text-[#d4af37] text-xs">╗</div>
                <div className="absolute bottom-2 left-2 text-[#d4af37] text-xs">╚</div>
                <div className="absolute bottom-2 right-2 text-[#d4af37] text-xs">╝</div>

                <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#d4af37] mb-2 font-bold flex items-center justify-center gap-2">
                  <Star className="w-3 h-3 fill-[#d4af37]" />
                  <span>LUMIXORA WORLD PREMIERE • 70MM IMAX</span>
                  <Star className="w-3 h-3 fill-[#d4af37]" />
                </div>

                <h3 className="text-2xl sm:text-4xl font-serif font-black text-[#fff4d6] tracking-tight mb-2">
                  Welcome to Lumixora
                </h3>

                <p className="text-xs sm:text-sm font-mono text-[#a89c89] mb-4">
                  The Living Code Theater & Autonomous Career Intelligence
                </p>

                <div className="p-4 bg-[#0a090e] border border-[#d4af37]/25 rounded-xl text-xs text-[#d6cdbe] mb-6 text-left leading-relaxed space-y-1.5">
                  <strong className="text-[#e55353] block uppercase tracking-wider text-[10px] font-mono">
                    The Problem We Solved:
                  </strong>
                  <p>
                    {LUMIXORA_FEATURE_FILM.crisis}
                  </p>
                </div>

                {/* 3 Key Film Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-7 text-left">
                  {LUMIXORA_FEATURE_FILM.outcomes.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#181620] border border-[#d4af37]/20 text-[11px] text-[#c2b6a2] space-y-1">
                      <span className="text-[#d4af37] font-black text-xs block">0{idx + 1}</span>
                      <p className="leading-snug">{item}</p>
                    </div>
                  ))}
                </div>

                {/* 🎬 Prominent "Start Your Movie" Button 🎬 */}
                <button
                  onClick={handleStartMovie}
                  className="px-8 sm:px-10 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f7d070] to-[#b38728] hover:brightness-110 text-[#1a140d] font-serif font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_0_35px_rgba(212,175,55,0.5)] flex items-center justify-center gap-3 cursor-pointer transform hover:scale-[1.03] active:scale-95 transition-all mx-auto"
                >
                  <Play className="w-5 h-5 fill-[#1a140d]" />
                  <span>Start Your Movie • Retract Curtains</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── STAGE 02: VINTAGE SMPTE 3... 2... 1... COUNTDOWN ─── */}
          {countdownNumber !== null && (
            <div className="absolute inset-0 z-50 bg-[#060608] flex flex-col items-center justify-center pointer-events-none animate-fade-in">
              <div className="relative w-44 h-44 rounded-full border-4 border-[#d4af37]/60 flex items-center justify-center animate-spin" style={{ animationDuration: '1s' }}>
                <div className="absolute top-0 bottom-0 w-0.5 bg-[#d4af37]/60" />
                <div className="absolute left-0 right-0 h-0.5 bg-[#d4af37]/60" />
                <div className="w-32 h-32 rounded-full border border-[#d4af37]/30" />
              </div>

              <div className="absolute text-8xl sm:text-9xl font-mono font-black text-[#fff4d6] drop-shadow-[0_0_35px_rgba(212,175,55,0.8)]">
                {countdownNumber}
              </div>

              <div className="mt-8 text-xs font-mono font-bold tracking-[0.35em] uppercase text-[#d4af37]">
                70MM FILM LEADER • LUMIXORA PREMIERE
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
