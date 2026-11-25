import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Sparkles, Code2, Terminal, Cpu, Award, Zap, Shield, Flame, BookOpen,
  ChevronRight, ArrowRight, Layers, Sliders, CheckCircle2, Clock, Maximize2, Minimize2,
  Tv, Compass, Check, Clapperboard, Star, Brain, GraduationCap, Mic, MicOff,
  Eye, Monitor, Radio, Activity, Target
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
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {}
  }

  playDeepNote() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});

      const chord = [43.65, 65.41, 87.31, 130.81, 196.00];
      const now = this.ctx.currentTime;
      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.02, now);
      master.gain.exponentialRampToValueAtTime(0.24, now + 1.2);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
      master.connect(this.ctx.destination);

      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq * 0.9, now);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 1.2);
        osc.connect(master);
        osc.start(now);
        osc.stop(now + 3.0);
      });
    } catch (e) {}
  }

  playCountdownBeep(stage = 3) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      
      const now = this.ctx.currentTime;
      
      if (stage === 'go') {
        // Triumphant opening fanfare chord for movie start
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major
        const chordGain = this.ctx.createGain();
        chordGain.gain.setValueAtTime(0.35, now);
        chordGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
        chordGain.connect(this.ctx.destination);

        freqs.forEach((f) => {
          const osc = this.ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now);
          osc.connect(chordGain);
          osc.start(now);
          osc.stop(now + 0.92);
        });

        // Sub impact thud
        const sub = this.ctx.createOscillator();
        const subG = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(110, now);
        sub.frequency.exponentialRampToValueAtTime(40, now + 0.4);
        subG.gain.setValueAtTime(0.4, now);
        subG.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        sub.connect(subG);
        subG.connect(this.ctx.destination);
        sub.start(now);
        sub.stop(now + 0.42);
        return;
      }

      // Crisp, resonant countdown beeps (3, 2, 1)
      const freqMap = { 3: 440, 2: 554.37, 1: 659.25 };
      const baseFreq = freqMap[stage] || (typeof stage === 'number' ? stage : 520);

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const click = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(baseFreq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 2, now);

      click.type = 'square';
      click.frequency.setValueAtTime(baseFreq * 4, now);

      const peak = 0.32;
      g.gain.setValueAtTime(peak, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc1.connect(g);
      osc2.connect(g);
      click.connect(g);
      g.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      click.start(now);

      osc1.stop(now + 0.24);
      osc2.stop(now + 0.24);
      click.stop(now + 0.08);
    } catch (e) {}
  }

  startProjectorSound() {
    try {
      this.init();
      if (!this.ctx || this.projectorInterval) return;
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});

      this.projectorInterval = setInterval(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(160 + Math.random() * 90, now);
        clickGain.gain.setValueAtTime(0.018, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.032);
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
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      if (this.isPlaying) return;

      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      this.gain.gain.exponentialRampToValueAtTime(0.065, this.ctx.currentTime + 1.5);
      this.gain.connect(this.ctx.destination);

      this.oscDrone = this.ctx.createOscillator();
      this.oscDrone.type = 'sawtooth';
      this.oscDrone.frequency.setValueAtTime(43.65, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.ctx.currentTime);
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
    firms: ['Amazon', 'Google Cloud', 'TCS Prime', 'Microsoft']
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
        '>>> [LUMIXORA RADAR] Active matching: Amazon, Google Cloud, Microsoft, TCS Prime.'
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
    return <span className="text-amber-400/90 italic font-mono">{line}</span>;
  }
  
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
          return <span key={i} className="text-emerald-400 font-medium">{part}</span>;
        }
        if (/^\d+$/.test(part)) {
          return <span key={i} className="text-cyan-300 font-semibold">{part}</span>;
        }
        if (part.includes('//')) {
          return <span key={i} className="text-amber-400/90 italic">{part}</span>;
        }
        return <span key={i} className="text-slate-200">{part}</span>;
      })}
    </span>
  );
}

export default function LandingCodeCinema({ onGetStarted }) {
  // Stages: 'premiere' | 'opening_curtains' | 'countdown' | 'playing' | 'paused' | 'finale'
  const [cinemaStage, setCinemaStage] = useState('premiere');
  const [countdownNumber, setCountdownNumber] = useState(null);
  const [activeActIndex, setActiveActIndex] = useState(0);
  const [timelineTime, setTimelineTime] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true); // Sweet Voice Enabled by Default
  const [isSubtitlesEnabled, setIsSubtitlesEnabled] = useState(true); // Requirement 2: Teleprompter / Subtitles
  const [isImaxFullscreen, setIsImaxFullscreen] = useState(false); // Requirement 3: IMAX Dark Theater
  const [mobileTab, setMobileTab] = useState('visuals'); // Requirement 6: 'visuals' | 'code' mobile toggle
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'visuals' | 'code'
  const [activeLine, setActiveLine] = useState(0);
  const [availableVoices, setAvailableVoices] = useState([]);

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const tickRef = useRef(0);

  const activeAct = LUMIXORA_FEATURE_FILM.acts[activeActIndex] || LUMIXORA_FEATURE_FILM.acts[0];
  const areCurtainsClosed = cinemaStage === 'premiere';
  const isPlaying = cinemaStage === 'playing';

  // Handle ESC key to exit IMAX fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isImaxFullscreen) {
        setIsImaxFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImaxFullscreen]);

  // Lock body scroll when IMAX fullscreen is active
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isImaxFullscreen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = '';
    };
  }, [isImaxFullscreen]);

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

    const sweetNames = ['jenny', 'aria', 'samantha', 'victoria', 'karen', 'serena', 'zira', 'natural', 'neural', 'female'];

    // 1. Natural online/neural female voice (Edge/Windows/Chrome)
    let found = availableVoices.find(v => {
      const name = v.name.toLowerCase();
      const isEn = v.lang.toLowerCase().startsWith('en');
      return isEn && (name.includes('natural') || name.includes('neural')) && (name.includes('jenny') || name.includes('aria') || name.includes('female'));
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
      utterance.rate = 0.94; // Sweet, natural pacing
      utterance.pitch = 1.16; // Sweet, melodic, friendly tone
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Voice narration error:', e);
    }
  };

  // 🎬 Trigger Curtains Open and 3-2-1 Countdown
  const handleStartMovie = (startFromAct = 0) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    landingAudio.init();

    setActiveActIndex(startFromAct);
    setTimelineTime(0);
    setCinemaStage('opening_curtains');
    
    // Play dramatic opening brass/sub swell and spin up projector audio
    landingAudio.playDeepNote();
    landingAudio.startProjectorSound();

    setTimeout(() => {
      setCinemaStage('countdown');
      setCountdownNumber(3);
      landingAudio.playCountdownBeep(3);

      const c2 = setTimeout(() => {
        setCountdownNumber(2);
        landingAudio.playCountdownBeep(2);
      }, 850);

      const c1 = setTimeout(() => {
        setCountdownNumber(1);
        landingAudio.playCountdownBeep(1);
      }, 1700);

      const cGo = setTimeout(() => {
        setCountdownNumber(null);
        landingAudio.playCountdownBeep('go');
        setCinemaStage('playing');
        if (isAudioEnabled) {
          landingAudio.startScore();
        }
        playSweetVoiceNarration(LUMIXORA_FEATURE_FILM.acts[startFromAct].commentary);
      }, 2550);
    }, 1100);
  };

  const handleCloseCurtains = () => {
    setCinemaStage('premiere');
    landingAudio.stopScore();
    setTimelineTime(0);
    setActiveLine(0);
    setActiveActIndex(0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleReplayPremiere = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    handleStartMovie(0);
  };

  const togglePlayPause = () => {
    if (cinemaStage === 'premiere' || cinemaStage === 'finale') {
      handleStartMovie(0);
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
          if (activeActIndex < LUMIXORA_FEATURE_FILM.acts.length - 1) {
            const nextIndex = activeActIndex + 1;
            setActiveActIndex(nextIndex);
            playSweetVoiceNarration(LUMIXORA_FEATURE_FILM.acts[nextIndex].commentary);
            return 0;
          } else {
            // Reached end of Act 5! Show Grand Finale Curtain Call (Requirement 1)
            setCinemaStage('finale');
            landingAudio.stopScore();
            playSweetVoiceNarration("Welcome to the future of learning. Lumixora is ready to accelerate your career.");
            return activeAct.duration;
          }
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

  const handleSelectAct = (idx) => {
    setActiveActIndex(idx);
    setTimelineTime(0);
    if (cinemaStage === 'finale') {
      setCinemaStage('playing');
      if (isAudioEnabled) landingAudio.startScore();
    }
    if (isPlaying || cinemaStage === 'finale') {
      playSweetVoiceNarration(LUMIXORA_FEATURE_FILM.acts[idx].commentary);
    }
  };

  const activeActIndexRef = useRef(activeActIndex);
  useEffect(() => {
    activeActIndexRef.current = activeActIndex;
  }, [activeActIndex]);

  // ─── ULTRA-HIGH PRODUCTION 60 FPS HTML5 LIVING ARCHITECTURE CANVAS ───
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let running = true;
    let cachedW = 0;
    let cachedH = 0;

    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.offsetWidth || 800;
      const h = canvas.offsetHeight || 500;
      if (w !== cachedW || h !== cachedH) {
        cachedW = w;
        cachedH = h;
        canvas.width = w;
        canvas.height = h;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Rich floating nebula stardust particles
    const starParticles = Array.from({ length: 45 }, () => ({
      x: Math.random() * (cachedW || 800),
      y: Math.random() * (cachedH || 500),
      radius: Math.random() * 2.0 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      hue: Math.random() > 0.5 ? 45 : (Math.random() > 0.5 ? 180 : 280),
      alpha: Math.random() * 0.6 + 0.3
    }));

    const render = () => {
      if (!running) return;
      tickRef.current += 1;
      const tick = tickRef.current;

      const width = cachedW || canvas.width || 800;
      const height = cachedH || canvas.height || 500;
      const currentActIdx = activeActIndexRef.current;

      ctx.clearRect(0, 0, width, height);

      // Deep Cosmic Background with Glowing Radial Flare
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2 - 20, 20, width / 2, height / 2, width);
      bgGrad.addColorStop(0, '#100e1f');
      bgGrad.addColorStop(0.5, '#090814');
      bgGrad.addColorStop(1, '#030206');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Swirling Cosmic Star Particles
      starParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pulseAlpha = p.alpha * (0.6 + Math.sin(tick * 0.05 + p.hue) * 0.4);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${pulseAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3D Perspective Cyber Floor Grid
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.09)';
      ctx.lineWidth = 1;
      const horizonY = height * 0.84;
      for (let x = -width * 0.5; x < width * 1.5; x += 45) {
        ctx.beginPath();
        ctx.moveTo(width / 2, horizonY * 0.48);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = horizonY * 0.48; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Overhead Projection Light Ray Cone
      ctx.save();
      const projGrad = ctx.createLinearGradient(width / 2, 0, width / 2, height * 0.7);
      projGrad.addColorStop(0, 'rgba(212, 175, 55, 0.16)');
      projGrad.addColorStop(0.6, 'rgba(212, 175, 55, 0.04)');
      projGrad.addColorStop(1, 'rgba(212, 175, 55, 0.0)');
      ctx.fillStyle = projGrad;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 20, 0);
      ctx.lineTo(width / 2 + 20, 0);
      ctx.lineTo(width * 0.9, height * 0.75);
      ctx.lineTo(width * 0.1, height * 0.75);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      const cx = width / 2;
      const cy = height / 2 - 10;

      // ───────────────────────────────────────────────────────────
      // ACT 1: NEURAL PLACEMENT MATRIX & TIER-1 CONSTELLATION
      // ───────────────────────────────────────────────────────────
      if (currentActIdx === 0) {
        const radius = Math.min(width, height) * 0.40;

        // 1. Concentric Holographic Orbital Rings with Cyber Degree Ticks
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(168, 85, 247, 0.18)';
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2);
        ctx.stroke();

        // 2. Rotating Ticked Reticle Ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tick * 0.005);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.lineWidth = 1.5;
        const tickCount = 24;
        for (let i = 0; i < tickCount; i++) {
          const a = (i * Math.PI * 2) / tickCount;
          const innerR = radius - 6;
          const outerR = radius + (i % 6 === 0 ? 6 : 2);
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * innerR, Math.sin(a) * innerR);
          ctx.lineTo(Math.cos(a) * outerR, Math.sin(a) * outerR);
          ctx.stroke();
        }
        ctx.restore();

        // 3. Dual Counter-Rotating 3D Gyroscope Energy Ellipses
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tick * 0.012);
        ctx.strokeStyle = 'rgba(0, 245, 212, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.92, radius * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.rotate(Math.PI / 2.3);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.92, radius * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 4. Subtle Ambient Luminous Scanner Sweep
        const sweepAngle = (tick * 0.025) % (Math.PI * 2);
        const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        sweepGrad.addColorStop(0, 'rgba(0, 245, 212, 0.45)');
        sweepGrad.addColorStop(0.4, 'rgba(117, 83, 232, 0.25)');
        sweepGrad.addColorStop(1, 'rgba(0, 245, 212, 0.0)');
        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, sweepAngle - 0.55, sweepAngle);
        ctx.closePath();
        ctx.fill();

        // 5. Tier-1 Target Company Constellation Nodes (Calibrated ₹10L–16L)
        const companyNodes = [
          { name: 'Cisco SDE', package: '₹18L', dist: 0.88, angle: 0.5, color: '#00f5d4' },
          { name: 'Darwinbox', package: '₹16L', dist: 0.82, angle: 1.8, color: '#a855f7' },
          { name: 'TCS Prime', package: '₹11.5L', dist: 0.86, angle: 3.1, color: '#f59e0b' },
          { name: 'Accolite', package: '₹14L', dist: 0.80, angle: 4.4, color: '#10b981' },
          { name: 'Amazon AWS', package: '₹16L', dist: 0.90, angle: 5.6, color: '#38bdf8' }
        ];

        // Draw curved conduits & traveling energy packets
        companyNodes.forEach((node, nodeIdx) => {
          const currentAngle = node.angle + tick * 0.004;
          const nx = cx + Math.cos(currentAngle) * radius * node.dist;
          const ny = cy + Math.sin(currentAngle) * radius * node.dist;

          // Curved Bezier Laser Conduit
          const midX = (cx + nx) / 2 + Math.sin(tick * 0.02 + nodeIdx) * 15;
          const midY = (cy + ny) / 2 + Math.cos(tick * 0.02 + nodeIdx) * 15;

          ctx.strokeStyle = `${node.color}35`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.quadraticCurveTo(midX, midY, nx, ny);
          ctx.stroke();

          // Traveling Telemetry Energy Packets along conduit
          for (let p = 0; p < 2; p++) {
            const t = ((tick * 0.015 + p * 0.5 + nodeIdx * 0.2) % 1);
            // Quadratic Bezier interpolation: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
            const px = Math.pow(1 - t, 2) * cx + 2 * (1 - t) * t * midX + Math.pow(t, 2) * nx;
            const py = Math.pow(1 - t, 2) * cy + 2 * (1 - t) * t * midY + Math.pow(t, 2) * ny;

            ctx.shadowBlur = 10;
            ctx.shadowColor = node.color;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Node Halo & Pulsing Core
          const pulse = (tick * 0.08 + nodeIdx) % 1;
          ctx.strokeStyle = `${node.color}${Math.floor((1 - pulse) * 180).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(nx, ny, 6 + pulse * 14, 0, Math.PI * 2);
          ctx.stroke();

          ctx.shadowBlur = 14;
          ctx.shadowColor = node.color;
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(nx, ny, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner Bright Nucleus
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // High-Contrast Glassmorphic Badge (Outward Radial Anchoring)
          const badgeText = `${node.name} • ${node.package}`;
          ctx.font = 'bold 10px monospace';
          const textWidth = ctx.measureText(badgeText).width;
          const badgeW = textWidth + 14;
          const badgeH = 20;

          const angleFromCenter = Math.atan2(ny - cy, nx - cx);
          let badgeX = nx + Math.cos(angleFromCenter) * 22 - badgeW / 2;
          let badgeY = ny + Math.sin(angleFromCenter) * 22 - badgeH / 2;

          // Safe clamping within canvas bounds
          badgeX = Math.max(8, Math.min(width - badgeW - 8, badgeX));
          badgeY = Math.max(34, Math.min(height - badgeH - 8, badgeY));

          ctx.fillStyle = 'rgba(11, 17, 32, 0.92)';
          ctx.strokeStyle = `${node.color}80`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(badgeX, badgeY, badgeW, badgeH, [6]);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = node.color;
          ctx.textAlign = 'left';
          ctx.fillText(badgeText, badgeX + 7, badgeY + 14);
        });

        // 6. Central Multi-Layered Student AI Twin Reactor
        const corePulse = Math.sin(tick * 0.08) * 3;

        // Outer Hexagonal / Circular Cyan Corona
        ctx.shadowBlur = 28;
        ctx.shadowColor = '#00f5d4';
        const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 24 + corePulse);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.35, '#00f5d4');
        coreGrad.addColorStop(0.75, 'rgba(117, 83, 232, 0.6)');
        coreGrad.addColorStop(1, 'rgba(0, 245, 212, 0.0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 24 + corePulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Center White Nucleus
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        // Central Identification Pill
        ctx.fillStyle = 'rgba(11, 17, 32, 0.9)';
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(cx - 52, cy + 30, 104, 18, [6]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#00f5d4';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('STUDENT AI TWIN', cx, cy + 42);

        // 7. Top HUD Floating Telemetry Badge
        const topPillW = 210;
        const topPillH = 26;
        const topPillY = Math.max(12, cy - radius - 28);

        ctx.fillStyle = 'rgba(11, 17, 32, 0.88)';
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cx - topPillW / 2, topPillY, topPillW, topPillH, [8]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('★ 95.4% TIER-1 PLACEMENT READINESS ★', cx, topPillY + 17);
        ctx.textAlign = 'left';
      }

      // ───────────────────────────────────────────────────────────
      // ACT 2: CODECINEMA™ QUANTUM AST RECTOR & CONSTANT FOLDING
      // ───────────────────────────────────────────────────────────
      else if (currentActIdx === 1) {
        const pulse = Math.sin(tick * 0.08) * 10;

        // Blazing Central Plasma Fusion Reactor
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#f59e0b';
        const coreGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 75 + pulse);
        coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        coreGrad.addColorStop(0.25, 'rgba(212, 175, 55, 0.85)');
        coreGrad.addColorStop(0.65, 'rgba(245, 158, 11, 0.4)');
        coreGrad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 75 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 3D Orbital Electron Rings
        ctx.save();
        ctx.translate(cx, cy);
        for (let ring = 0; ring < 3; ring++) {
          ctx.rotate((tick * 0.03) + (ring * Math.PI / 3));
          ctx.strokeStyle = ring === 0 ? '#38bdf8' : (ring === 1 ? '#d4af37' : '#ec4899');
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, 0, 105, 42, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // Left Node: NUM 5 (Electric Cyan)
        const leftX = cx - 120;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#38bdf8';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.beginPath();
        ctx.arc(leftX, cy, 36 + Math.sin(tick * 0.1) * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NUM [5]', leftX, cy + 5);

        // Right Node: NUM 7 (Hot Magenta)
        const rightX = cx + 120;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ec4899';
        ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
        ctx.beginPath();
        ctx.arc(rightX, cy, 36 + Math.sin(tick * 0.1 + 1) * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.fillText('NUM [7]', rightX, cy + 5);

        // Jagged High-Voltage Lightning Bolts connecting to central ALU
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(leftX + 36, cy);
        ctx.lineTo((leftX + cx) / 2, cy + (Math.random() - 0.5) * 22);
        ctx.lineTo(cx - 36, cy);

        ctx.moveTo(rightX - 36, cy);
        ctx.lineTo((rightX + cx) / 2, cy + (Math.random() - 0.5) * 22);
        ctx.lineTo(cx + 36, cy);
        ctx.stroke();

        // Central ALU Fusion Core Result [12]
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px monospace';
        ctx.fillText('ALU: 12', cx, cy + 8);

        // Header Pill
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#fde047';
        ctx.fillText('⚡ REAL-TIME AST CONSTANT FOLDING ⚡', cx, cy - 80);
        ctx.textAlign = 'left';
      }

      // ───────────────────────────────────────────────────────────
      // ACT 3: AI 70M BLUEPRINT EXAM PAPER PREDICTOR
      // ───────────────────────────────────────────────────────────
      else if (currentActIdx === 2) {
        // Multi-frequency harmonic spectrum oscilloscope waves
        const waveColors = ['#22d3ee', '#a855f7', '#10b981'];
        waveColors.forEach((col, idx) => {
          ctx.strokeStyle = col;
          ctx.lineWidth = 3 - idx * 0.5;
          ctx.beginPath();
          for (let x = 0; x < width; x += 4) {
            const freq = 0.024 + idx * 0.012;
            const phase = tick * (0.07 + idx * 0.025);
            const y = cy + Math.sin(x * freq + phase) * (42 - idx * 10) * Math.cos(x * 0.007);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });

        // 2 Glowing Holographic Examination Dossier Cards
        const cardW = 145;
        const cardH = 125;
        const cardY = cy - 62;

        // Set 1 (Derivations & Theory)
        const set1X = cx - cardW - 16;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#22d3ee';
        ctx.fillStyle = 'rgba(34, 211, 238, 0.2)';
        ctx.beginPath();
        ctx.roundRect(set1X, cardY, cardW, cardH, [14]);
        ctx.fill();
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.textAlign = 'center';
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('PREDICTED SET 1', set1X + cardW / 2, cardY + 26);
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px monospace';
        ctx.fillText('High-Frequency Theory', set1X + cardW / 2, cardY + 52);
        ctx.fillText('& Derivations', set1X + cardW / 2, cardY + 70);
        
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('✓ 100% EXAM ACCURACY', set1X + cardW / 2, cardY + 102);

        // Set 2 (Problems & Modeling)
        const set2X = cx + 16;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#a855f7';
        ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
        ctx.beginPath();
        ctx.roundRect(set2X, cardY, cardW, cardH, [14]);
        ctx.fill();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('PREDICTED SET 2', set2X + cardW / 2, cardY + 26);
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px monospace';
        ctx.fillText('Analytical Problems', set2X + cardW / 2, cardY + 52);
        ctx.fillText('& Architecture', set2X + cardW / 2, cardY + 70);
        
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('✓ VERIFIED SOLUTIONS', set2X + cardW / 2, cardY + 102);

        // Vertical Laser Scanner Sweep Ray
        const laserX = cx - 160 + ((tick * 3.5) % 320);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(laserX, cy - 80);
        ctx.lineTo(laserX, cy + 80);
        ctx.stroke();

        ctx.textAlign = 'left';
      }

      // ───────────────────────────────────────────────────────────
      // ACT 4: BOLOCLASS & LUMINA 3D AI CLASSROOM
      // ───────────────────────────────────────────────────────────
      else if (currentActIdx === 3) {
        // Glowing Central Audio Sphere (Lumina's Voice Avatar)
        const orbRadius = 42 + Math.sin(tick * 0.12) * 6;
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#a855f7';
        const orbGrad = ctx.createRadialGradient(cx, cy - 22, 5, cx, cy - 22, orbRadius + 22);
        orbGrad.addColorStop(0, '#ffffff');
        orbGrad.addColorStop(0.35, '#c084fc');
        orbGrad.addColorStop(0.7, '#6366f1');
        orbGrad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(cx, cy - 22, orbRadius + 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Core Avatar Emblem
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy - 22, orbRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4f46e5';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LUMINA', cx, cy - 16);

        // Vibrant 32-Band Equalizer Soundwave Spectrum
        const barCount = 32;
        const bWidth = 6;
        const totalW = barCount * (bWidth + 4);
        const startX = cx - totalW / 2;

        for (let i = 0; i < barCount; i++) {
          const h = 18 + Math.abs(Math.sin((i * 0.32) + (tick * 0.16))) * 65;
          const bx = startX + (i * (bWidth + 4));
          const by = cy + 54 - h;

          ctx.fillStyle = `hsl(${260 + i * 4}, 90%, 65%)`;
          ctx.beginPath();
          ctx.roundRect(bx, by, bWidth, h, [3]);
          ctx.fill();
        }

        // Floating Chalkboard Math & Algorithm Proofs
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = 'italic bold 13px serif';
        ctx.fillText('O(N log N)', cx - 120, cy - 55);
        ctx.fillText('f(x) = λe^-λx', cx + 120, cy - 55);
        ctx.fillText('QuickSort(A, p, r)', cx - 110, cy + 18);
        ctx.fillText('P(A|B) = \frac{P(B|A)}{P(B)}', cx + 110, cy + 18);

        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#c084fc';
        ctx.fillText('⚡ 0.3s NEURAL VOICE LATENCY • INSTANT DOUBTS ⚡', cx, cy + 80);
        ctx.textAlign = 'left';
      }

      // ───────────────────────────────────────────────────────────
      // ACT 5: CRYPTOGRAPHIC PROOF OF SKILL PROTOCOL
      // ───────────────────────────────────────────────────────────
      else {
        // Rotating 3D Isometric Blockchain Cube
        const cubeSize = 56 + Math.sin(tick * 0.05) * 5;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI / 6);

        // Outer Hexagonal Block
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#f59e0b';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const hx = Math.cos(angle) * (cubeSize + 28);
          const hy = Math.sin(angle) * (cubeSize + 28);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // Center Verified Shield
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#10b981';
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(cx, cy, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('✓', cx, cy + 8);

        // Floating Cryptographic Hashes
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('SHA-256: 0x8F4A92...E17B', cx, cy - 72);
        ctx.fillText('12 PROJECTS • 60+ COMMITS VERIFIED', cx, cy + 74);
        ctx.fillStyle = '#34d399';
        ctx.fillText('★ 100% RECRUITER VERIFIED CREDENTIAL ★', cx, cy + 92);
        ctx.textAlign = 'left';
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <section id="code-cinema" className="py-20 md:py-28 bg-[#040308] text-white relative overflow-hidden select-none">
      
      {/* ── BACKGROUND PROJECTION LIGHT & CINEMA ATMOSPHERE ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[420px] bg-gradient-to-b from-[#d4af37]/25 via-purple-600/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-20 left-0 right-0 h-64 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ── SECTION HEADER & THEATER TITLE ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-black tracking-widest uppercase shadow-md">
            <Film className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Lumixora CinemaScope 70MM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#fff7e6]">
            CodeCinema™ — The Living Code Theater
          </h2>
          <p className="text-sm sm:text-base text-gray-400 font-medium">
            Step inside our virtual IMAX theater. Watch real code transform into living visual architectures with sweet voice narration.
          </p>
        </div>

        {/* ── AUDITORIUM PROSCENIUM FRAME (IMAX FULLSCREEN CAPABLE) ── */}
        <div className={`transition-all duration-500 overflow-hidden bg-[#08060f] shadow-[0_30px_90px_rgba(0,0,0,0.98)] ${
          isImaxFullscreen 
            ? 'fixed inset-0 z-[99999] rounded-none border-0 overflow-y-auto flex flex-col justify-between bg-[#04020a]' 
            : 'relative rounded-[28px] md:rounded-[36px] border-2 border-[#d4af37]/50'
        }`}>
          
          {/* Top Marquee Header Bar with Film Sprockets */}
          <div className="h-12 bg-[#120f1e] border-b border-[#d4af37]/35 px-4 sm:px-6 flex items-center justify-between text-xs font-mono text-[#d4af37]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="font-bold tracking-wider hidden sm:inline">35MM OPTICAL • DOLBY ATMOS</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-200 font-bold uppercase truncate max-w-[140px] sm:max-w-none">
                {cinemaStage === 'finale' ? 'CURTAIN CALL • GRAND FINALE' : activeAct.title}
              </span>
            </div>

            {/* View Mode Switcher + Sweet Voice Status + IMAX Mode */}
            <div className="flex items-center gap-2">
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
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  isVoiceEnabled 
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-sm' 
                    : 'bg-white/5 border-white/10 text-gray-500'
                }`}
                title="Toggle Sweet Voice Narration"
              >
                {isVoiceEnabled ? <Mic className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isVoiceEnabled ? 'Sweet Voice: ON' : 'Voice: OFF'}</span>
              </button>

              {/* CC Subtitles Toggle (Requirement 2) */}
              <button
                onClick={() => setIsSubtitlesEnabled(!isSubtitlesEnabled)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  isSubtitlesEnabled 
                    ? 'bg-[#d4af37]/20 border-[#d4af37]/50 text-[#d4af37]' 
                    : 'bg-white/5 border-white/10 text-gray-500'
                }`}
                title="Toggle Live Synchronized Subtitles (CC)"
              >
                CC
              </button>

              {/* View Mode Toggle (Desktop) */}
              <div className="hidden md:flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    viewMode === 'split' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Split Stage"
                >
                  Split Stage
                </button>
                <button
                  onClick={() => setViewMode('visuals')}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    viewMode === 'visuals' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Full Visualizer"
                >
                  IMAX Visuals
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    viewMode === 'code' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Code Projector"
                >
                  Code
                </button>
              </div>

              {/* IMAX Fullscreen Mode Button (Requirement 3) */}
              <button
                onClick={() => setIsImaxFullscreen(!isImaxFullscreen)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all bg-[#d4af37]/15 hover:bg-[#d4af37]/30 text-[#d4af37] border border-[#d4af37]/40 cursor-pointer shadow-sm"
                title={isImaxFullscreen ? "Exit IMAX Fullscreen (Esc)" : "Expand to IMAX Dark Theater Mode"}
              >
                {isImaxFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isImaxFullscreen ? 'Exit IMAX' : 'IMAX Mode'}</span>
              </button>
            </div>
          </div>

          {/* ── 🎬 STORY-STYLE SEGMENTED ACT PROGRESS BAR (INSTAGRAM/YOUTUBE STYLE) (Requirement 4) ── */}
          <div className="w-full bg-[#0a0714] border-b border-[#d4af37]/20 p-2.5 px-4 sm:px-6">
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {LUMIXORA_FEATURE_FILM.acts.map((act, idx) => {
                const isPast = activeActIndex > idx || cinemaStage === 'finale';
                const isCurrent = activeActIndex === idx && cinemaStage !== 'finale';
                const progressPercent = cinemaStage === 'finale'
                  ? 100
                  : isPast 
                  ? 100 
                  : isCurrent 
                  ? Math.min(100, Math.round((timelineTime / act.duration) * 100))
                  : 0;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (cinemaStage === 'premiere') {
                        handleStartMovie(idx);
                      } else {
                        handleSelectAct(idx);
                      }
                    }}
                    className="group text-left cursor-pointer focus:outline-none"
                    title={`Act ${act.actNumber}: ${act.title}`}
                  >
                    {/* Progress track */}
                    <div className="h-1.5 sm:h-2 rounded-full bg-white/10 overflow-hidden relative border border-white/5 group-hover:border-[#d4af37]/50 transition-colors">
                      <div 
                        className={`h-full transition-all duration-300 rounded-full ${
                          isPast || isCurrent 
                            ? 'bg-gradient-to-r from-[#d4af37] via-[#f7d070] to-[#b8860b] shadow-[0_0_8px_rgba(212,175,55,0.7)]' 
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    {/* Label under segment */}
                    <div className="flex items-center justify-between mt-1.5 text-[9px] sm:text-[10px] font-mono">
                      <span className={`truncate font-bold transition-colors ${isCurrent ? 'text-[#d4af37]' : isPast ? 'text-gray-300' : 'text-gray-500'}`}>
                        <span className="hidden xs:inline">ACT 0{act.actNumber}: </span>
                        {idx === 0 ? 'Placement Radar' :
                         idx === 1 ? 'CodeCinema DSA' :
                         idx === 2 ? '70M Predictor' :
                         idx === 3 ? 'BoloClass AI' : 'Proof-of-Skill'}
                      </span>
                      <span className="text-gray-500 text-[8px] sm:text-[9px] font-bold hidden sm:inline ml-1">
                        {isCurrent ? `${timelineTime}s` : `${act.duration}s`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 📱 MOBILE VIEW TOGGLE SWITCH (< md) (Requirement 6) ── */}
          {cinemaStage !== 'finale' && (
            <div className="md:hidden flex items-center justify-center p-2 bg-[#090712] border-b border-[#d4af37]/20">
              <div className="inline-flex rounded-xl p-1 bg-black/70 border border-white/10 gap-1 w-full max-w-xs shadow-inner">
                <button
                  onClick={() => setMobileTab('visuals')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    mobileTab === 'visuals' 
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b38728] text-black shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>3D Architecture</span>
                </button>
                <button
                  onClick={() => setMobileTab('code')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    mobileTab === 'code' 
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b38728] text-black shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Live Projector</span>
                </button>
              </div>
            </div>
          )}

          {/* ── 🌟 REQUIREMENT 1: GRAND FINALE / CURTAIN CALL CARD ── */}
          {cinemaStage === 'finale' ? (
            <div className="relative z-30 min-h-[500px] sm:min-h-[560px] p-6 sm:p-10 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#0e0a1b] via-[#05030a] to-[#0a0714] text-white">
              {/* Radiant Particle Ambient Burst */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2)_0%,transparent_70%)] pointer-events-none animate-pulse" />

              {/* Verified Premiere Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] font-mono text-xs uppercase tracking-widest font-black mb-4 shadow-lg shadow-[#d4af37]/20">
                <Sparkles className="w-4 h-4 text-[#d4af37] animate-spin" />
                <span>Premiere Complete • Verified by Lumixora Director</span>
              </div>

              {/* Grand Marquee Heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-white tracking-tight mb-3">
                Welcome to the <span className="bg-gradient-to-r from-[#d4af37] via-[#fff1ba] to-[#e6a817] bg-clip-text text-transparent">Future of Learning</span>
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl mb-8 leading-relaxed font-sans">
                You have experienced all 5 pillars of the Lumixora ecosystem. Say goodbye to dry, passive tutorials — your verified path from university classroom to top tech placements begins now.
              </p>

              {/* 4 Glowing Milestone Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mb-8">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-[#d4af37]/30 text-left space-y-1.5 backdrop-blur-md hover:border-[#d4af37] transition-all">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    <Target className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">AI Placement Radar</h4>
                  <p className="text-[11px] text-gray-400">94.8% Readiness index with 450+ matched campus drives.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-[#d4af37]/30 text-left space-y-1.5 backdrop-blur-md hover:border-[#d4af37] transition-all">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">CodeCinema™ AST</h4>
                  <p className="text-[11px] text-gray-400">60 FPS dynamic execution turning code into living architecture.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-[#d4af37]/30 text-left space-y-1.5 backdrop-blur-md hover:border-[#d4af37] transition-all">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">70M Exam Predictor</h4>
                  <p className="text-[11px] text-gray-400">JNTU & Autonomous calibrated solved paper forecasting.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-[#d4af37]/30 text-left space-y-1.5 backdrop-blur-md hover:border-[#d4af37] transition-all">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Proof of Skill</h4>
                  <p className="text-[11px] text-gray-400">Cryptographically signed credentials backed by real commits.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => {
                    if (onGetStarted) onGetStarted();
                  }}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f7d070] to-[#b8860b] hover:brightness-110 text-black font-black text-sm shadow-xl shadow-[#d4af37]/30 hover:scale-105 transition-all cursor-pointer flex items-center gap-2.5"
                >
                  <Zap className="w-4 h-4 fill-black text-black" />
                  <span>Launch Placement Radar & Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleReplayPremiere}
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 shadow-md backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-[#d4af37]" />
                  <span>Replay Premiere</span>
                </button>

                <button
                  onClick={handleCloseCurtains}
                  className="px-5 py-3.5 rounded-full bg-red-950/40 hover:bg-red-900/50 text-red-300 font-bold text-xs border border-red-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Close Curtains</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Screen Content: Dynamic View Modes with Full-Height Canvas */}
              <div className={`grid ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} min-h-[500px] sm:min-h-[540px] relative`}>
                
                {/* Left Screen: Living Architecture Simulator */}
                {(viewMode === 'split' || viewMode === 'visuals') && (
                  <div className={`${mobileTab !== 'visuals' ? 'hidden md:flex' : 'flex'} relative border-b md:border-b-0 md:border-r border-[#d4af37]/25 flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-[#0a0815] to-[#040308]`}>
                    <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                      <span className="text-[#d4af37] font-bold flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>LIVING ARCHITECTURE SIMULATION</span>
                      </span>
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-500/40 font-bold">
                        60 FPS HARDWARE ACCELERATED
                      </span>
                    </div>

                    {/* HTML5 Canvas Simulator with Deep High-End Sizing */}
                    <div className="relative w-full h-80 sm:h-96 md:h-[380px] rounded-2xl overflow-hidden border border-[#d4af37]/25 shadow-2xl">
                      <canvas ref={canvasRef} className="w-full h-full block" />
                    </div>

                    {/* Simulation Concept Footer */}
                    <div className="mt-3 p-3 rounded-xl bg-black/80 border border-[#d4af37]/25 text-xs font-mono flex items-center justify-between">
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
                  <div className={`${mobileTab !== 'code' ? 'hidden md:flex' : 'flex'} relative flex-col justify-between p-4 sm:p-6 bg-[#07060c] font-mono text-xs`}>
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
                    <div className="flex-1 bg-[#050409] p-4 rounded-xl border border-white/10 overflow-x-auto text-[11px] leading-relaxed select-text space-y-0.5 max-h-80 sm:max-h-96 md:max-h-[340px] overflow-y-auto">
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

              {/* ── 💬 REQUIREMENT 2: LIVE TELEPROMPTER / SYNCHRONIZED SUBTITLES BAR ── */}
              {isSubtitlesEnabled && isPlaying && (
                <div className="bg-black/90 border-t border-[#d4af37]/30 px-4 py-2.5 text-center relative z-20 backdrop-blur-md animate-fade-in">
                  <div className="inline-flex items-center gap-2.5 max-w-4xl mx-auto">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/40 shadow-xs">
                      CC
                    </span>
                    <p className="text-xs sm:text-sm font-sans font-medium text-[#fff3cb] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wide">
                      "{activeAct.commentary}"
                    </p>
                  </div>
                </div>
              )}

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
            </>
          )}

          {/* ── CINEMA CONTROL BAR (Play, Curtains, Sound, Act Skip, CTA) ── */}
          <div className="bg-[#08060e] border-t border-[#d4af37]/25 p-3 sm:p-4 px-6 flex flex-wrap items-center justify-between gap-4">
            
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
            <div className="absolute inset-0 z-50 bg-[#060608]/95 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none animate-fade-in">
              <div className="relative w-52 h-52 rounded-full border-2 border-[#d4af37]/40 flex items-center justify-center">
                {/* Rotating Film Reticle */}
                <div 
                  className="absolute inset-0 rounded-full border border-dashed border-[#d4af37]/70 animate-spin" 
                  style={{ animationDuration: '2s' }} 
                />
                <div className="absolute top-0 bottom-0 w-[1.5px] bg-[#d4af37]/50" />
                <div className="absolute left-0 right-0 h-[1.5px] bg-[#d4af37]/50" />
                <div className="w-36 h-36 rounded-full border border-[#d4af37]/30 bg-black/40" />

                {/* Pulsing countdown numeral */}
                <div key={countdownNumber} className="absolute text-8xl sm:text-9xl font-mono font-black text-[#fff4d6] drop-shadow-[0_0_40px_rgba(212,175,55,0.9)] animate-ping" style={{ animationIterationCount: 1, animationDuration: '0.4s' }}>
                  {countdownNumber}
                </div>
                <div className="absolute text-8xl sm:text-9xl font-mono font-black text-[#fff4d6] drop-shadow-[0_0_40px_rgba(212,175,55,0.9)]">
                  {countdownNumber}
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center gap-1.5">
                <div className="text-xs font-mono font-black tracking-[0.4em] uppercase text-[#d4af37] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                  OPTICAL SOUNDTRACK ROLLING • 70MM SMPTE LEADER
                </div>
                <div className="text-[10px] font-mono text-gray-400">
                  DOLBY ATMOS AUDIO SYNTHESIZER ARMED • ACT 01 READY
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
