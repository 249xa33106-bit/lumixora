import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import Dashboard3DBackground from './Dashboard3DBackground';
import { 
  Bot, FileText, Rocket, Award, Code2, Map, Users, BarChart3, 
  Calendar, CheckSquare, Zap, GraduationCap, ArrowRight, SkipForward, Volume2, VolumeX, Sparkles
} from 'lucide-react';

const ALL_LUMIXORA_FEATURES = [
  { id: 'twin', name: 'AI Academic Twin™', category: 'NEURAL MENTOR', icon: Bot, color: '#00f5d4', hex: 0x00f5d4 },
  { id: 'notes', name: 'Smart Notes Platform', category: 'KNOWLEDGE REPO', icon: FileText, color: '#38bdf8', hex: 0x38bdf8 },
  { id: 'pyq', name: 'PYQ Question Bank', category: 'EXAM VAULT', icon: Award, color: '#fbbf24', hex: 0xfbbf24 },
  { id: 'planner', name: 'AI Study Planner', category: 'ADAPTIVE TIMELINE', icon: Calendar, color: '#a855f7', hex: 0xa855f7 },
  { id: 'tasks', name: 'Task Manager', category: 'STUDY SPRINTS', icon: CheckSquare, color: '#10b981', hex: 0x10b981 },
  { id: 'coding', name: 'Live Coding Lab', category: 'COMPILER & DSA', icon: Code2, color: '#ec4899', hex: 0xec4899 },
  { id: 'courses', name: 'Learning Hub & Courses', category: 'CURRICULUM', icon: GraduationCap, color: '#6366f1', hex: 0x6366f1 },
  { id: 'projects', name: 'Student Project Expo', category: 'INNOVATION', icon: Rocket, color: '#f43f5e', hex: 0xf43f5e },
  { id: 'roadmaps', name: '18+ Tech Roadmaps', category: 'CAREER MATRIX', icon: Map, color: '#06b6d4', hex: 0x06b6d4 },
  { id: 'attendance', name: 'Official Attendance', category: 'RADAR & SAFETY', icon: BarChart3, color: '#e11d48', hex: 0xe11d48 },
  { id: 'productivity', name: 'Streaks & Leaderboard', category: 'GAMIFICATION', icon: Zap, color: '#f59e0b', hex: 0xf59e0b },
  { id: 'clubs', name: 'Campus Clubs & Peers', category: 'COLLABORATION', icon: Users, color: '#8b5cf6', hex: 0x8b5cf6 }
];

export default function CinematicIntro({ onComplete }) {
  // Timeline State: 'awakening' -> 'features_materialize' -> 'singularity_merge' -> 'lumixora_reveal' -> 'tagline_settle'
  const [sceneState, setSceneState] = useState('awakening');
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(-1);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef(null);

  // ─── CONTINUOUS 135 BPM TELUGU MASS BGM ENGINE (Kuthu Dappu + Brass Hero Riff) ──
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playMassDappuBeat = (time, accent = false) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // 1. Thavil / Dhol Heavy Sub Impact
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(accent ? 160 : 120, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + (accent ? 0.35 : 0.22));

    gain.gain.setValueAtTime(accent ? 0.7 : 0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (accent ? 0.38 : 0.25));

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + (accent ? 0.38 : 0.25));

    // 2. High-Frequency Dappu / Marfa Rim Snap
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(accent ? 2400 : 1600, time);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(accent ? 0.35 : 0.2, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(time);
    noise.stop(time + 0.08);
  };

  const playMassBrassNote = (time, freq, dur = 0.25) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.006, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, time);
    filter.frequency.linearRampToValueAtTime(3200, time + 0.06);
    filter.frequency.exponentialRampToValueAtTime(600, time + dur);

    gain.gain.setValueAtTime(0.24, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur);
    osc2.stop(time + dur);
  };

  // Start 135 BPM Telugu Mass Kuthu Beat Loop
  useEffect(() => {
    let intervalId;
    if (soundEnabled) {
      initAudio();
      let step = 0;
      const heroRiff = [293.66, 0, 369.99, 440.00, 293.66, 369.99, 440.00, 587.33];

      intervalId = setInterval(() => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        
        if (step === 0 || step === 4 || step === 5) {
          playMassDappuBeat(now, step === 0);
        } else if (step === 2 || step === 6) {
          playMassDappuBeat(now, true);
        }

        const note = heroRiff[step];
        if (note > 0) {
          playMassBrassNote(now + 0.02, note, 0.2);
        }

        step = (step + 1) % 8;
      }, 220); // ~135 BPM
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [soundEnabled]);

  // ─── MASTER TIMELINE ───────────────────────────────────────────────────────
  useEffect(() => {
    const tScene2 = setTimeout(() => {
      setSceneState('features_materialize');
    }, 1800);

    const featureInterval = 350;
    let currentIdx = 0;
    let featTimer;

    const startFeatureLoop = setTimeout(() => {
      featTimer = setInterval(() => {
        setActiveFeatureIndex(currentIdx);
        currentIdx++;

        if (currentIdx >= ALL_LUMIXORA_FEATURES.length) {
          clearInterval(featTimer);
        }
      }, featureInterval);
    }, 1800);

    const tScene3 = setTimeout(() => {
      setSceneState('singularity_merge');
    }, 6000);

    const tScene4 = setTimeout(() => {
      setSceneState('lumixora_reveal');
      if (soundEnabled && audioCtxRef.current) {
        const now = audioCtxRef.current.currentTime;
        for (let i = 0; i < 8; i++) {
          playMassDappuBeat(now + (i * 0.08), true);
        }
        setTimeout(() => {
          if (!audioCtxRef.current) return;
          const cTime = audioCtxRef.current.currentTime;
          playMassDappuBeat(cTime, true);
          playMassBrassNote(cTime, 146.83, 1.8);
          playMassBrassNote(cTime, 220.00, 1.8);
          playMassBrassNote(cTime, 293.66, 1.8);
          playMassBrassNote(cTime, 440.00, 1.8);
        }, 640);
      }
    }, 7800);

    const tScene5 = setTimeout(() => {
      setSceneState('tagline_settle');
    }, 9800);

    return () => {
      clearTimeout(tScene2);
      clearTimeout(startFeatureLoop);
      if (featTimer) clearInterval(featTimer);
      clearTimeout(tScene3);
      clearTimeout(tScene4);
      clearTimeout(tScene5);
    };
  }, []);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete?.();
    }, 600);
  };

  const activeFeat = ALL_LUMIXORA_FEATURES[activeFeatureIndex] || ALL_LUMIXORA_FEATURES[0];
  const ActiveIcon = activeFeat.icon;

  return (
    <div 
      className={`fixed inset-0 z-[999999] bg-[#020308] select-none overflow-hidden transition-all duration-1000 flex flex-col justify-between ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      onClick={initAudio}
    >
      {/* ─── 1. EXACT 3D DASHBOARD BACKGROUND (SHARED FOR INTRO & DASHBOARD) ──── */}
      <Dashboard3DBackground />

      {/* ─── 2. ANAMORPHIC HORIZONTAL CYBER LENS FLARE ──────────────────────── */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f5d4] via-[#38bdf8] to-transparent blur-[1px] pointer-events-none z-10 shadow-[0_0_35px_#00f5d4]" />

      {/* ─── 3. TOP BAR: AUDIO & SKIP CONTROLS ──────────────────────────────── */}
      <div className="relative z-30 w-full flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-black/90 border border-cyan-400/40 overflow-hidden flex items-center justify-center p-1 shadow-2xl backdrop-blur-2xl">
            <img src="/lumixora_logo.jpg" alt="LUMIXORA" className="w-full h-full object-contain" />
          </div>
          <span className="text-[11px] font-mono tracking-[0.3em] text-[#00f5d4] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            LUMIXORA // 3D INTRO
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSoundEnabled(!soundEnabled);
            }}
            className="p-2.5 rounded-xl bg-black/70 hover:bg-white/10 text-cyan-300 hover:text-white border border-cyan-500/30 transition-all cursor-pointer backdrop-blur-xl shadow-lg"
            title={soundEnabled ? "Mute Mass BGM" : "Enable Mass BGM"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00f5d4]" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white font-mono text-xs tracking-widest flex items-center gap-2 backdrop-blur-2xl border border-cyan-500/40 shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <span>SKIP INTRO</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── CENTRAL MASTER CINEMA STAGE (100% DEAD-CENTERED) ───────────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 pointer-events-none">
        
        {/* ─── SCENE 1: DIGITAL AWAKENING (0.0s - 1.8s) ────────────────────────── */}
        {sceneState === 'awakening' && (
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#00f5d4] to-cyan-400 animate-ping shadow-[0_0_60px_#00f5d4]" />
            <div className="mt-8 text-xs font-mono tracking-[0.6em] text-transparent bg-clip-text bg-gradient-to-r from-[#00f5d4] via-cyan-300 to-blue-300 uppercase font-black animate-pulse">
              INITIALIZING PLATFORM
            </div>
          </div>
        )}

        {/* ─── SCENE 2: FEATURES MATERIALIZE ONE BY ONE (1.8s - 6.0s) ─────────── */}
        {sceneState === 'features_materialize' && (
          <div className="flex flex-col items-center text-center px-4 max-w-xl animate-in zoom-in-95 fade-in duration-300">
            
            {/* Active 3D Holographic Colorful Feature Card */}
            <div 
              key={activeFeat.id}
              className="relative flex flex-col items-center p-8 sm:p-10 rounded-3xl bg-[#020b1b]/90 border-2 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,245,212,0.4)]"
              style={{ borderColor: `${activeFeat.color}80` }}
            >
              {/* Category Tag */}
              <div 
                className="px-4 py-1 rounded-full text-[10px] font-mono tracking-[0.3em] uppercase mb-4 font-bold border shadow-md"
                style={{ 
                  backgroundColor: `${activeFeat.color}20`,
                  borderColor: `${activeFeat.color}60`,
                  color: activeFeat.color 
                }}
              >
                {activeFeat.category}
              </div>

              {/* Glowing Icon Emblem */}
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mb-5 shadow-2xl"
                style={{ 
                  background: `radial-gradient(circle, ${activeFeat.color}40 0%, rgba(2,11,27,0.95) 100%)`,
                  border: `2px solid ${activeFeat.color}`,
                  boxShadow: `0 0 40px ${activeFeat.color}70`
                }}
              >
                <ActiveIcon className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]" style={{ color: activeFeat.color }} />
              </div>

              {/* Feature Title */}
              <h2 className="text-2xl sm:text-4xl font-black tracking-wider text-white mb-1 drop-shadow-md">
                {activeFeat.name}
              </h2>

              <p className="text-xs font-mono text-cyan-200/80 tracking-widest mt-1">
                MODULE {activeFeatureIndex + 1} OF {ALL_LUMIXORA_FEATURES.length}
              </p>
            </div>

            {/* Colorful Feature Micro-Indicator */}
            <div className="flex items-center gap-1.5 mt-8">
              {ALL_LUMIXORA_FEATURES.map((f, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeFeatureIndex 
                      ? 'w-8 shadow-[0_0_12px_#00f5d4]' 
                      : idx < activeFeatureIndex 
                      ? 'w-2 opacity-80' 
                      : 'w-1.5 opacity-25'
                  }`}
                  style={{ backgroundColor: f.color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── SCENE 3: DIRECT MERGE (6.0s - 7.8s) ───────────────────────────── */}
        {sceneState === 'singularity_merge' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#00f5d4] to-transparent shadow-[0_0_40px_#00f5d4] animate-pulse" />
            <div className="mt-8 text-[11px] font-mono tracking-[0.5em] text-[#00f5d4] uppercase font-bold">
              CONVERGING INTELLIGENCE MATRIX...
            </div>
          </div>
        )}

        {/* ─── SCENE 4 & FINAL: DIAMOND LUMIXORA & TAGLINE (7.8s - 12.0s) ──────── */}
        {(sceneState === 'lumixora_reveal' || sceneState === 'tagline_settle') && (
          <div className="flex flex-col items-center text-center px-6 max-w-4xl animate-in zoom-in-90 fade-in duration-1000">
            
            {/* Pristine Glowing Logo Badge */}
            <div className="relative mb-6 group">
              <div className="absolute -inset-6 bg-gradient-to-r from-[#00f5d4] via-[#38bdf8] to-[#a855f7] rounded-3xl blur-3xl opacity-90 animate-pulse" />
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-[#020b1b]/95 border-2 border-cyan-400/50 overflow-hidden shadow-[0_0_60px_rgba(0,245,212,0.8)] p-3 backdrop-blur-3xl flex items-center justify-center">
                <img 
                  src="/lumixora_logo.jpg" 
                  alt="LUMIXORA" 
                  className="w-full h-full object-contain rounded-2xl drop-shadow-[0_0_30px_rgba(0,245,212,0.9)]"
                />
              </div>
            </div>

            {/* Ultra-Attractive 3D Cyber LUMIXORA Typography */}
            <div className="relative mb-4">
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-[0.2em] text-white drop-shadow-[0_0_40px_#00f5d4] drop-shadow-[0_0_80px_rgba(56,189,248,0.9)] drop-shadow-[0_0_120px_rgba(0,245,212,0.6)] font-sans">
                LUMIXORA
              </h1>
              {/* L -> A Cyber Light Sweep Beam */}
              <div className="absolute -inset-x-8 top-1/2 h-[2.5px] bg-gradient-to-r from-transparent via-white via-[#00f5d4] to-transparent opacity-95 blur-[1px] animate-[pulse_1.5s_infinite]" />
            </div>

            {/* Minimalist Sophisticated Tagline: LEARN • CONNECT • GROW */}
            <div className={`transition-all duration-1000 ${
              sceneState === 'tagline_settle' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-[2px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#00f5d4]" />
                <p className="text-xs sm:text-base font-black tracking-[0.5em] uppercase text-white drop-shadow-[0_0_15px_#00f5d4]">
                  LEARN • CONNECT • GROW
                </p>
                <div className="h-[2px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#00f5d4]" />
              </div>

              {/* Seamless Launch Action */}
              <button
                onClick={handleFinish}
                className="px-10 py-4.5 rounded-2xl bg-gradient-to-r from-[#00f5d4] via-[#38bdf8] to-[#60a5fa] text-[#020817] font-black text-sm sm:text-base tracking-[0.25em] uppercase shadow-[0_0_50px_rgba(0,245,212,0.85)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer mx-auto group pointer-events-auto"
              >
                <span>ENTER WORKSPACE</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-[#020817]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
