import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Film, Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Sparkles, Code2, Terminal, Cpu, Award, Zap, Shield, Flame, BookOpen,
  ChevronRight, ArrowRight, Layers, Sliders, CheckCircle2, Clock, Maximize2,
  Tv, Compass, Check, Clapperboard, Star, Brain, GraduationCap
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
      master.gain.exponentialRampToValueAtTime(0.12, now + 1.8);
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
      g.gain.setValueAtTime(0.08, this.ctx.currentTime);
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
        clickGain.gain.setValueAtTime(0.01, now);
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
      this.gain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 1.5);
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
  director: 'Lumixora Autonomous AI Director',
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
      duration: 10,
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
        '>>> [LUMIXORA RADAR] Active matching: Amazon, TCS Prime, Cognizant, Infosys.'
      ],
      commentary: 'Welcome to Lumixora. Act I opens with the Autonomous Placement Radar. We bridge the gap between academic textbooks and real employment, calibrating student skills with AI mock interviews and placement readiness scoring.'
    },
    {
      actNumber: '02',
      title: 'CodeCinema™ — The Living Code Theater',
      concept: 'Real-Time AST Execution & Micro-Architecture Reactor',
      duration: 10,
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
      commentary: 'Act II reveals CodeCinema™. Forget dry, static video tutorials. Students enter a virtual IMAX auditorium where actual code triggers animated event loops, memory stacks, and live CPU architecture in real-time.'
    },
    {
      actNumber: '03',
      title: 'AI 70M Blueprint Exam Paper Predictor',
      concept: 'Deep Historical Pattern Synthesis & Solved Sets',
      duration: 10,
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
      commentary: 'Act III presents the AI 70M Blueprint Predictor. By analyzing multi-year university pattern shifts, Lumixora forecasts two exact predicted examination papers complete with step-by-step verified solutions.'
    },
    {
      actNumber: '04',
      title: 'BoloClass & Lumina 3D AI Classroom',
      concept: 'Natural Speech Synthesis & Instant Doubt Clearing',
      duration: 10,
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
      commentary: 'Act IV introduces BoloClass. An interactive AI classroom where Lumina, our virtual AI mentor, explains difficult engineering topics, illustrates them on chalkboard canvases, and answers student questions instantly.'
    },
    {
      actNumber: '05',
      title: 'Proof of Skill & Cryptographic Credentials',
      concept: 'Tamper-Proof GitHub & Compiler Verified Milestones',
      duration: 10,
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
      commentary: 'Act V seals your engineering journey. In Lumixora, every line of code, milestone, and project is cryptographically backed by tamper-proof proof of skill that employers can directly inspect and hire.'
    }
  ]
};

export default function LandingCodeCinema({ onGetStarted }) {
  // Stages: 'premiere' | 'opening_curtains' | 'countdown' | 'playing' | 'paused'
  const [cinemaStage, setCinemaStage] = useState('premiere');
  const [countdownNumber, setCountdownNumber] = useState(null);
  const [activeActIndex, setActiveActIndex] = useState(0);
  const [timelineTime, setTimelineTime] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [activeLine, setActiveLine] = useState(0);

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const tickRef = useRef(0);

  const activeAct = LUMIXORA_FEATURE_FILM.acts[activeActIndex];
  const areCurtainsClosed = cinemaStage === 'premiere';
  const isPlaying = cinemaStage === 'playing';

  // 🎬 Trigger Curtains Open and 3-2-1 Countdown
  const handleStartMovie = () => {
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
    } else {
      setCinemaStage('playing');
      if (isAudioEnabled) landingAudio.startScore();
    }
  };

  // Synchronized Act Timeline Loop (10 seconds per act)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimelineTime((prev) => {
        if (prev >= activeAct.duration) {
          // Advance to next act or loop to beginning
          if (activeActIndex < LUMIXORA_FEATURE_FILM.acts.length - 1) {
            setActiveActIndex((i) => i + 1);
          } else {
            setActiveActIndex(0);
          }
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

  // Speech Narration (Optional)
  useEffect(() => {
    if (isPlaying && isVoiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeAct.commentary);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }, [isPlaying, isVoiceEnabled, activeActIndex]);

  // ─── 60 FPS HTML5 LIVING ARCHITECTURE CANVAS ───
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;
      tickRef.current += 1;
      const tick = tickRef.current;

      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      // Deep space cinema background with subtle grid
      ctx.fillStyle = '#08080f';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 28;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const cx = width / 2;
      const cy = height / 2;

      // ── Act-Specific Visual Simulators ──
      if (activeActIndex === 0) {
        // ACT 1: AI Placement Radar Rotating Sweep
        const radius = Math.min(width, height) * 0.36;

        // Outer Ring
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.66, 0, Math.PI * 2);
        ctx.arc(cx, cy, radius * 0.33, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.beginPath();
        ctx.moveTo(cx - radius, cy);
        ctx.lineTo(cx + radius, cy);
        ctx.moveTo(cx, cy - radius);
        ctx.lineTo(cx, cy + radius);
        ctx.stroke();

        // Rotating Sweep Beam
        const angle = (tick * 0.03) % (Math.PI * 2);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, angle, angle + 0.5);
        ctx.closePath();
        ctx.fill();

        // Student nodes in orbit
        const nodes = [
          { label: 'Tier-2 Scholar', dist: 0.5, speed: 0.015, color: '#10b981' },
          { label: 'Amazon Prime', dist: 0.75, speed: -0.012, color: '#38bdf8' },
          { label: '94.8% Match', dist: 0.28, speed: 0.02, color: '#f59e0b' }
        ];

        nodes.forEach((n, idx) => {
          const a = (tick * n.speed) + (idx * 2);
          const nx = cx + Math.cos(a) * radius * n.dist;
          const ny = cy + Math.sin(a) * radius * n.dist;

          ctx.fillStyle = n.color;
          ctx.beginPath();
          ctx.arc(nx, ny, 5 + Math.sin(tick * 0.1 + idx) * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = '10px monospace';
          ctx.fillText(n.label, nx + 8, ny + 3);
        });
      } else if (activeActIndex === 1) {
        // ACT 2: Quantum AST Reactor & Constant Folding
        const pulse = Math.sin(tick * 0.08) * 8;
        
        // Left Operand Node (5)
        const leftX = cx - 80;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.beginPath();
        ctx.arc(leftX, cy, 32 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NUM 5', leftX, cy + 5);

        // Right Operand Node (7)
        const rightX = cx + 80;
        ctx.fillStyle = 'rgba(236, 72, 153, 0.2)';
        ctx.beginPath();
        ctx.arc(rightX, cy, 32 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ec4899';
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.fillText('NUM 7', rightX, cy + 5);

        // Center ALU Accumulator Fusion (12)
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftX + 32, cy);
        ctx.lineTo(cx - 30, cy);
        ctx.moveTo(rightX - 32, cy);
        ctx.lineTo(cx + 30, cy);
        ctx.stroke();

        ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.beginPath();
        ctx.arc(cx, cy, 40 + Math.sin(tick * 0.12) * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d4af37';
        ctx.stroke();

        ctx.fillStyle = '#fff4d6';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('ALU: 12', cx, cy + 6);
      } else if (activeActIndex === 2) {
        // ACT 3: AI 70M Blueprint Frequency Oscilloscope
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < width; x += 3) {
          const y = cy + Math.sin((x * 0.03) + (tick * 0.08)) * 35 * Math.sin((x * 0.01) + (tick * 0.02));
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // High frequency prediction spikes
        ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
        ctx.fillRect(cx - 100, cy - 70, 90, 140);
        ctx.fillRect(cx + 10, cy - 70, 90, 140);

        ctx.strokeStyle = '#22d3ee';
        ctx.strokeRect(cx - 100, cy - 70, 90, 140);
        ctx.strokeRect(cx + 10, cy - 70, 90, 140);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SET 1: DERIVATIONS', cx - 55, cy - 40);
        ctx.fillText('100% MATCH', cx - 55, cy + 20);

        ctx.fillText('SET 2: PROBLEMS', cx + 55, cy - 40);
        ctx.fillText('SOLVED', cx + 55, cy + 20);
      } else if (activeActIndex === 3) {
        // ACT 4: BoloClass Neural Waveform & Chalkboard Grid
        const bars = 24;
        const barWidth = 6;
        const totalW = bars * (barWidth + 4);
        const startX = cx - totalW / 2;

        for (let i = 0; i < bars; i++) {
          const h = 20 + Math.abs(Math.sin((i * 0.4) + (tick * 0.1))) * 70;
          const bx = startX + (i * (barWidth + 4));
          const by = cy - h / 2;

          ctx.fillStyle = `hsl(${260 + i * 3}, 80%, 65%)`;
          ctx.fillRect(bx, by, barWidth, h);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LUMINA AI SPEECH WAVEFORM • 0.4s LATENCY', cx, cy + 70);
      } else {
        // ACT 5: Cryptographic Proof of Skill Block Hash Ring
        const ringRadius = 60 + Math.sin(tick * 0.05) * 6;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius - 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VERIFIED 100%', cx, cy - 8);
        ctx.font = '9px monospace';
        ctx.fillStyle = '#fef08a';
        ctx.fillText('SHA-256 PROOF', cx, cy + 12);
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
    <section id="code-cinema" className="py-20 md:py-28 bg-[#06050a] text-white relative overflow-hidden select-none">
      
      {/* ── BACKGROUND PROJECTION LIGHT & CINEMA ATMOSPHERE ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-b from-[#d4af37]/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-20 left-0 right-0 h-60 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ── SECTION HEADER & THEATER TITLE ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-black tracking-widest uppercase shadow-md">
            <Film className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Lumixora CinemaScope 70MM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#fff7e6]">
            CodeCinema™ — The Living Code Theater
          </h2>
          <p className="text-sm sm:text-base text-gray-400 font-medium">
            Step inside our virtual IMAX theater. Watch how Lumixora bridges the gap between academic theory and real software architecture.
          </p>
        </div>

        {/* ── AUDITORIUM PROSCENIUM FRAME ── */}
        <div className="relative rounded-[28px] md:rounded-[36px] overflow-hidden border-2 border-[#d4af37]/40 bg-[#0a0812] shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
          
          {/* Top Marquee Header Bar */}
          <div className="h-10 bg-[#120f1c] border-b border-[#d4af37]/30 px-4 sm:px-6 flex items-center justify-between text-xs font-mono text-[#d4af37]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="font-bold tracking-wider hidden sm:inline">35MM OPTICAL • DOLBY ATMOS</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300 font-bold uppercase">{activeAct.title}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-md bg-[#d4af37]/15 border border-[#d4af37]/30 text-[10px] font-black uppercase text-[#d4af37]">
                {activeAct.badge}
              </span>
              <span className="text-[10px] text-gray-400 hidden sm:inline">
                ACT {activeActIndex + 1} OF 5
              </span>
            </div>
          </div>

          {/* Screen Content: Split Stage (Left Canvas Architecture + Right Code Projector) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[460px] sm:min-h-[500px] relative">
            
            {/* Left Screen: Living Architecture Simulator */}
            <div className="relative border-b lg:border-b-0 lg:border-r border-[#d4af37]/20 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-[#090812] to-[#040308]">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                <span className="text-[#d4af37] font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>LIVING ARCHITECTURE SIMULATION</span>
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  60 FPS HARDWARE ACCELERATED
                </span>
              </div>

              {/* HTML5 Canvas Simulator */}
              <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#d4af37]/15 shadow-inner">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>

              {/* Simulation Concept Footer */}
              <div className="mt-3 p-3 rounded-xl bg-black/60 border border-[#d4af37]/15 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-gray-400 block text-[10px]">CONCEPT MODEL:</span>
                  <span className="text-white font-bold">{activeAct.concept}</span>
                </div>
                <span className="text-[#d4af37] font-black text-xs">ACT {activeAct.actNumber}</span>
              </div>
            </div>

            {/* Right Screen: Code Projector Terminal */}
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

              {/* Code Display with Active Line Highlight */}
              <div className="flex-1 bg-[#050409] p-4 rounded-xl border border-white/10 overflow-x-auto text-[11px] leading-relaxed select-text space-y-0.5">
                {activeAct.code.split('\n').map((line, idx) => {
                  const isCurrent = idx === activeLine;
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start gap-3 px-2 py-0.5 rounded transition-all ${
                        isCurrent 
                          ? 'bg-[#d4af37]/20 border-l-2 border-[#d4af37] text-white font-bold' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <span className="w-6 text-right text-gray-600 select-none text-[10px]">
                        {idx + 1}
                      </span>
                      <pre className="font-mono flex-1 whitespace-pre-wrap">{line}</pre>
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
                  onClick={() => {
                    setActiveActIndex(idx);
                    setTimelineTime(0);
                  }}
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
                  setActiveActIndex((prev) => (prev - 1 + 5) % 5);
                  setTimelineTime(0);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                title="Previous Feature Act"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setActiveActIndex((prev) => (prev + 1) % 5);
                  setTimelineTime(0);
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

            {/* Audio Score & Voice Toggles */}
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
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

              {/* Get Started / Experience Platform CTA */}
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
