import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, 
  ArrowRight, X, Bot, Code2, BookOpen, Trophy, Rocket, GraduationCap,
  Flame, Award
} from 'lucide-react';

export default function TomAndJerryIntro({ onComplete, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentScene, setCurrentScene] = useState(0); // 0: MGM Intro, 1: The Chase, 2: The Ceasefire & Welcome, 3: Feature Tour, 4: Grand Finale
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const [dialogueText, setDialogueText] = useState('');
  const [progress, setProgress] = useState(0);

  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const animFrameRef = useRef(null);

  // Core Showcase Features
  const FEATURES = [
    { title: 'AI Future Twin & Placement Forecaster', icon: Bot, color: '#00f5d4', tag: 'Neural Placement CTC Prediction (₹18.5 - ₹28.2 LPA)' },
    { title: 'Interactive Multi-Language Coding Lab', icon: Code2, color: '#a855f7', tag: 'Java, Python, C++, Go Sandbox with AI Feedback' },
    { title: 'Comprehensive Notes & PYQ Vault', icon: BookOpen, color: '#ffd166', tag: 'Autonomous Syllabus, Previous Papers & AI Summaries' },
    { title: 'Real-time Institutional Leaderboards', icon: Trophy, color: '#ff007a', tag: 'Campus Resonance AP, Badges & Activity Tracking' }
  ];

  // ─── CARTOON SOUND ENGINE (Web Audio API) ───
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playCartoonSound = (type) => {
    if (!soundEnabled) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'whistle_slide') {
      // Classic cartoon whistle slide up
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'boing') {
      // Classic spring / boing jump sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'fanfare') {
      // MGM style brass fanfare chord
      [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + 0.85);
      });
    } else if (type === 'cheer') {
      // Happy chime
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.25, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + 0.65);
      });
    }
  };

  // ─── SCENE TIMELINE CONTROLLER ───
  useEffect(() => {
    let timer;
    if (isPlaying) {
      if (currentScene === 0) {
        setDialogueText('🎬 VYOMRA ENTERTAINMENT PRESENTS...');
        playCartoonSound('fanfare');
        timer = setTimeout(() => {
          setCurrentScene(1);
          playCartoonSound('whistle_slide');
        }, 3200);
      } else if (currentScene === 1) {
        setDialogueText('🐭 Jerry: "Catch me if you can, Tom! I found the ultimate study OS!" 🧀');
        timer = setTimeout(() => {
          setCurrentScene(2);
          playCartoonSound('boing');
        }, 4500);
      } else if (currentScene === 2) {
        setDialogueText('🐱 Tom & Jerry: "Welcome to Vyomra! Your all-in-one academic & placement platform!" 👋✨');
        playCartoonSound('cheer');
        timer = setTimeout(() => {
          setCurrentScene(3);
        }, 4200);
      } else if (currentScene === 3) {
        const tourInterval = setInterval(() => {
          setActiveTourIndex(prev => {
            if (prev < FEATURES.length - 1) {
              playCartoonSound('boing');
              return prev + 1;
            } else {
              clearInterval(tourInterval);
              setCurrentScene(4);
              playCartoonSound('fanfare');
              return prev;
            }
          });
        }, 3000);
        return () => clearInterval(tourInterval);
      } else if (currentScene === 4) {
        setDialogueText('🌟 Tom & Jerry: "Let\'s ace your academics and crack top tech placements together!" 🚀');
      }
    }
    return () => clearTimeout(timer);
  }, [currentScene, isPlaying]);

  // Track progress bar
  useEffect(() => {
    const totalDuration = 18000;
    const interval = 100;
    const progressTimer = setInterval(() => {
      if (isPlaying) {
        setProgress(prev => Math.min(100, prev + (interval / totalDuration) * 100));
      }
    }, interval);
    return () => clearInterval(progressTimer);
  }, [isPlaying]);

  // ─── CANVAS 2D CARTOON SCENERY & CHARACTERS ───
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let t = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      t += 0.04;

      const w = canvas.width = canvas.parentElement?.clientWidth || 800;
      const h = canvas.height = canvas.parentElement?.clientHeight || 450;

      ctx.clearRect(0, 0, w, h);

      // ─── SCENE BACKGROUNDS ───
      if (currentScene === 0) {
        // Classic MGM Golden Ring Intro
        const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 2);
        grad.addColorStop(0, '#8B0000');
        grad.addColorStop(1, '#2b0000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Golden concentric circles
        ctx.save();
        ctx.translate(w / 2, h / 2);
        for (let r = 140; r >= 60; r -= 20) {
          ctx.beginPath();
          ctx.arc(0, 0, r + Math.sin(t * 3) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 15;
          ctx.stroke();
        }

        // Center Spotlight
        ctx.fillStyle = '#FFA500';
        ctx.font = '900 24px "Sora", sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
        ctx.fillText('TOM & JERRY', 0, -10);
        ctx.font = 'bold 13px "Inter", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('SPECIAL ACADEMIC EDITION', 0, 18);
        ctx.restore();

      } else {
        // Vibrant Classroom / High-Tech Stage Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#0a0a18');
        bgGrad.addColorStop(0.7, '#14142b');
        bgGrad.addColorStop(1, '#080811');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Glowing Grid Floor
        ctx.strokeStyle = 'rgba(0, 245, 212, 0.15)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, h * 0.7);
          ctx.lineTo(x + (x - w / 2) * 0.8, h);
          ctx.stroke();
        }
        for (let y = h * 0.7; y < h; y += 18) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // ─── SCENE 1: THE COMIC CHASE ───
        if (currentScene === 1) {
          const chaseProgress = (Math.sin(t * 1.5) + 1) / 2;
          const jX = 120 + chaseProgress * (w - 240);
          const tX = jX - 110;
          const groundY = h * 0.78;

          // Dust clouds behind Jerry
          ctx.fillStyle = 'rgba(255, 209, 102, 0.4)';
          ctx.beginPath();
          ctx.arc(jX - 25, groundY - 5 + Math.sin(t * 10) * 4, 8, 0, Math.PI * 2);
          ctx.arc(jX - 40, groundY - 3, 5, 0, Math.PI * 2);
          ctx.fill();

          // Jerry running with Cheese
          drawJerry(ctx, jX, groundY - 20, Math.sin(t * 15) * 8, true);

          // Tom running with cartoon paws
          drawTom(ctx, tX, groundY - 30, Math.sin(t * 12) * 10, true);
        }

        // ─── SCENE 2, 3, 4: TOM & JERRY WELCOME & SHOWCASE ───
        if (currentScene >= 2) {
          const centerX = w * 0.28;
          const centerY = h * 0.72;

          // Soft Glowing Aura under Tom & Jerry
          const charGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 140);
          charGlow.addColorStop(0, 'rgba(0, 245, 212, 0.25)');
          charGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.15)');
          charGlow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = charGlow;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
          ctx.fill();

          // Draw the iconic Welcome Pose: Tom bowing with open gloved hand, Jerry smiling beside him!
          drawTomWelcome(ctx, centerX - 25, centerY - 15, t);
          drawJerryWelcome(ctx, centerX + 65, centerY - 5, t);

          // Sparkling Stars floating
          for (let i = 0; i < 6; i++) {
            const sx = centerX + Math.cos(t * 2 + i * 1.2) * (80 + i * 10);
            const sy = centerY - 60 + Math.sin(t * 1.8 + i * 1.5) * 45;
            ctx.fillStyle = i % 2 === 0 ? '#FFD166' : '#00F5D4';
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(sx, sy, 2.5 + Math.sin(t * 4 + i) * 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [currentScene]);

  // ─── CHARACTER DRAWING PROCEDURES ───
  const drawJerry = (ctx, x, y, legOffset, isRunning) => {
    ctx.save();
    ctx.translate(x, y);

    // Cheese Wedge in Jerry's Hands
    ctx.save();
    ctx.translate(14, -10);
    ctx.beginPath();
    ctx.moveTo(0, -10); ctx.lineTo(12, 6); ctx.lineTo(-12, 6); ctx.closePath();
    ctx.fillStyle = '#FFD166';
    ctx.shadowColor = '#FFD166';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    // Body
    ctx.fillStyle = '#9E6B43';
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = '#E8C5A5';
    ctx.beginPath();
    ctx.ellipse(3, 0, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#E8C5A5';
    ctx.beginPath();
    ctx.arc(8, 10 + legOffset, 3.5, 0, Math.PI * 2);
    ctx.arc(-8, 10 - legOffset, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Big Iconic Round Ears
    ctx.fillStyle = '#9E6B43';
    ctx.beginPath();
    ctx.arc(2, -11, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFAAA6';
    ctx.beginPath();
    ctx.arc(2, -11, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(9, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(10, -4, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(17, 0, 2, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.quadraticCurveTo(-28, -10, -36, Math.sin(legOffset) * 8);
    ctx.strokeStyle = '#C48A5E';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();
  };

  const drawTom = (ctx, x, y, legOffset, isRunning) => {
    ctx.save();
    ctx.translate(x, y);

    // Body (Blue Grey)
    ctx.fillStyle = '#5D737E';
    ctx.beginPath();
    ctx.ellipse(0, 0, 30, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // White Chest
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(8, 0, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Paws running
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(14, 14 + legOffset, 5, 0, Math.PI * 2);
    ctx.arc(-16, 14 - legOffset, 5, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#5D737E';
    ctx.beginPath();
    ctx.moveTo(8, -12); ctx.lineTo(16, -24); ctx.lineTo(20, -10); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFAAA6';
    ctx.beginPath();
    ctx.moveTo(10, -12); ctx.lineTo(15, -20); ctx.lineTo(18, -11); ctx.closePath();
    ctx.fill();

    // Eyes (Yellow)
    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.arc(18, -5, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(19, -5, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Pink Nose
    ctx.fillStyle = '#FFAAA6';
    ctx.beginPath();
    ctx.arc(28, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.quadraticCurveTo(-45, -15, -55, Math.sin(legOffset) * 10);
    ctx.strokeStyle = '#5D737E';
    ctx.lineWidth = 4.5;
    ctx.stroke();

    ctx.restore();
  };

  const drawTomWelcome = (ctx, x, y, t) => {
    ctx.save();
    ctx.translate(x, y);

    // Tom Body standing tall
    ctx.fillStyle = '#5D737E';
    ctx.beginPath();
    ctx.ellipse(0, -20, 26, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    // White Chest
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(4, -18, 14, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tom Head
    ctx.fillStyle = '#5D737E';
    ctx.beginPath();
    ctx.arc(4, -68, 22, 0, Math.PI * 2);
    ctx.fill();

    // Cheeks & Muzzle
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(10, -62, 11, 0, Math.PI * 2);
    ctx.arc(-2, -62, 10, 0, Math.PI * 2);
    ctx.fill();

    // Big Smile
    ctx.fillStyle = '#C0392B';
    ctx.beginPath();
    ctx.arc(4, -58, 8, 0, Math.PI);
    ctx.fill();

    // Yellow Eyes
    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.arc(11, -74, 5, 0, Math.PI * 2);
    ctx.arc(0, -74, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(12, -74, 2.5, 0, Math.PI * 2);
    ctx.arc(1, -74, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Pink Nose
    ctx.fillStyle = '#FFAAA6';
    ctx.beginPath();
    ctx.arc(4, -66, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#5D737E';
    ctx.beginPath();
    ctx.moveTo(12, -84); ctx.lineTo(24, -104); ctx.lineTo(26, -80); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFAAA6';
    ctx.beginPath();
    ctx.moveTo(14, -84); ctx.lineTo(22, -98); ctx.lineTo(24, -81); ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#5D737E';
    ctx.beginPath();
    ctx.moveTo(-4, -84); ctx.lineTo(-16, -104); ctx.lineTo(-18, -80); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFAAA6';
    ctx.beginPath();
    ctx.moveTo(-2, -84); ctx.lineTo(-14, -98); ctx.lineTo(-16, -81); ctx.closePath();
    ctx.fill();

    // Open Welcoming Hand (Recreating the uploaded user image!)
    const handWave = Math.sin(t * 3) * 4;
    ctx.save();
    ctx.translate(28, -25 + handWave);
    // Arm
    ctx.strokeStyle = '#5D737E';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-10, -10); ctx.lineTo(15, 8);
    ctx.stroke();
    // White Glove Palm Open
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(22, 10, 12, 8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Fingers outstretched welcomingly
    ctx.beginPath();
    ctx.arc(32, 8, 4, 0, Math.PI * 2);
    ctx.arc(30, 14, 4, 0, Math.PI * 2);
    ctx.arc(24, 18, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  };

  const drawJerryWelcome = (ctx, x, y, t) => {
    ctx.save();
    ctx.translate(x, y);

    // Jerry Body standing proudly
    ctx.fillStyle = '#9E6B43';
    ctx.beginPath();
    ctx.ellipse(0, -14, 15, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = '#E8C5A5';
    ctx.beginPath();
    ctx.ellipse(1, -12, 9, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#9E6B43';
    ctx.beginPath();
    ctx.arc(2, -40, 14, 0, Math.PI * 2);
    ctx.fill();

    // Muzzle & Cheeks
    ctx.fillStyle = '#E8C5A5';
    ctx.beginPath();
    ctx.arc(5, -36, 7, 0, Math.PI * 2);
    ctx.arc(-2, -36, 6, 0, Math.PI * 2);
    ctx.fill();

    // Big Happy Jerry Smile
    ctx.fillStyle = '#C0392B';
    ctx.beginPath();
    ctx.arc(2, -34, 5.5, 0, Math.PI);
    ctx.fill();

    // Big Iconic Round Pink Ears
    ctx.fillStyle = '#9E6B43';
    ctx.beginPath();
    ctx.arc(12, -52, 9, 0, Math.PI * 2);
    ctx.arc(-8, -52, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFAAA6';
    ctx.beginPath();
    ctx.arc(12, -52, 5.5, 0, Math.PI * 2);
    ctx.arc(-8, -52, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(6, -44, 3.5, 0, Math.PI * 2);
    ctx.arc(-1, -44, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(7, -44, 1.8, 0, Math.PI * 2);
    ctx.arc(0, -44, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(2, -38, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Hands on hips pose
    ctx.strokeStyle = '#9E6B43';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(14, -14, 6, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();

    ctx.restore();
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0e0e1a] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Control Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐱🐭</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2">
                <span>Tom & Jerry Presentation</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 uppercase tracking-widest">
                  Official Intro
                </span>
              </h2>
              <p className="text-xs text-gray-400">Discover all superpowers of Vyomra Academic OS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer"
              title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            </button>
            <button
              onClick={() => {
                if (onClose) onClose();
                else if (onComplete) onComplete();
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas Area */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[420px] bg-black flex items-center justify-center overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-contain" />

          {/* Dynamic Feature Spotlight Overlay (Scene 3 & 4) */}
          {currentScene >= 3 && (
            <div className="absolute top-6 right-6 w-80 sm:w-96 glass-panel p-4 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl shadow-2xl animate-fade-in space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Feature #{activeTourIndex + 1}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">{activeTourIndex + 1} / {FEATURES.length}</span>
              </div>

              {(() => {
                const item = FEATURES[activeTourIndex];
                const IconComp = item.icon;
                return (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{ backgroundColor: `${item.color}15`, borderColor: `${item.color}40`, color: item.color }}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                        <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{item.tag}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Bottom Subtitle / Dialogue Bubble */}
          <div className="absolute bottom-6 left-6 right-6 max-w-2xl mx-auto bg-black/75 backdrop-blur-xl border border-white/15 px-5 py-3 rounded-2xl text-center shadow-2xl">
            <p className="text-xs sm:text-sm font-bold text-amber-300 tracking-wide leading-relaxed animate-fade-in">
              {dialogueText}
            </p>
          </div>
        </div>

        {/* Player Controls & Action Bar */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0a0a14] space-y-3">
          {/* Progress Bar */}
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-brand-teal to-brand-purple transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentScene(0);
                  setActiveTourIndex(0);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Replay Video"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Replay</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (onClose) onClose();
                  else if (onComplete) onComplete();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-400/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Enter Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
