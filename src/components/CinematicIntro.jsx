import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Bot, FileText, Rocket, Award, Code2, Map, Users, BarChart3, 
  Calendar, CheckSquare, Zap, GraduationCap, ArrowRight, SkipForward, Volume2, VolumeX, Sparkles, Trophy, BookOpen,
  Play, Pause, RotateCcw, Compass, Star, ChevronRight, Eye, ShieldCheck, Flame, Music, Disc, Palette
} from 'lucide-react';

import tomAndJerryImg from '../assets/tom_and_jerry_intro.png';
import doraemonImg from '../assets/doraemon.png';
import bheemImg from '../assets/bheem.png';
import shinchanImg from '../assets/shinchan.png';
import pikachuImg from '../assets/pikachu.png';
import ben10Img from '../assets/ben10.png';

// ─── AUTHENTIC CARTOON MULTIVERSE ROSTER ───
const CARTOON_MASCOTS = [
  {
    id: 'tom_and_jerry',
    name: 'Tom & Jerry',
    emoji: '🐱🐭',
    universe: 'MGM Classics',
    quote: 'Welcome to Vyomra! The ultimate study & placement OS is finally here!',
    color: '#ffd166',
    collectible: '🧀 Golden Swiss Cheese',
    tag: 'Official Mentors',
    image: tomAndJerryImg
  },
  {
    id: 'doraemon',
    name: 'Doraemon & Nobita',
    emoji: '🐱🔔',
    universe: '22nd Century Gadgets',
    quote: 'Nobita! With Vyomra’s 4D AI Future Twin, your exams and placements are 100% sorted!',
    color: '#00a0e9',
    collectible: '🛸 Bamboo Copter & Dorayaki',
    tag: 'Gadget AI Twin',
    image: doraemonImg
  },
  {
    id: 'chhota_bheem',
    name: 'Chhota Bheem',
    emoji: '💪🟡',
    universe: 'Dholakpur Kingdom',
    quote: 'Tun Tun Mausi ke Ladoo + Vyomra Coding Lab = Unstoppable 28 LPA Placement Power!',
    color: '#ff9933',
    collectible: '🟡 Super Energizing Ladoo',
    tag: 'Dholakpur Champion',
    image: bheemImg
  },
  {
    id: 'shinchan',
    name: 'Shinchan Nohara',
    emoji: '👦🍫',
    universe: 'Kasukabe Defense Force',
    quote: 'Action Kamen zindabad! Vyomra is so fun, Shiro is also solving DSA challenges!',
    color: '#e74c3c',
    collectible: '🍫 Chocobi & Action Kamen',
    tag: 'Kasukabe Hero',
    image: shinchanImg
  },
  {
    id: 'pikachu',
    name: 'Pikachu',
    emoji: '⚡🔮',
    universe: 'Pokémon Master',
    quote: 'Pika-Pikachu! Powering your study streaks with 100,000 Volts of Placement Energy!',
    color: '#f1c40f',
    collectible: '⚡ Thunderstone Badge',
    tag: 'Electric Streaks',
    image: pikachuImg
  },
  {
    id: 'ben10',
    name: 'Ben 10',
    emoji: '⌚👽',
    universe: 'Omniverse Hero',
    quote: 'It’s Hero Time! Transforming your college journey into a Tier-1 Dream Placement!',
    color: '#2ecc71',
    collectible: '🟢 Omnitrix Core',
    tag: 'Omniverse Leader',
    image: ben10Img
  }
];

const ALL_VYOMRA_FEATURES = [
  { 
    id: 'twin', 
    name: 'AI Academic Twin™ & Placement Forecaster', 
    category: 'NEURAL CAREER MATRIX', 
    icon: Bot, 
    color: '#00f5d4', 
    desc: 'Monte Carlo simulated CTC prediction (₹18.5 – ₹28.2+ LPA) with dynamic micro-interventions & skill graph tracking.',
    stats: 'Tier-1 FAANG Probability: 84.6%',
    badge: 'Neural Placement Core',
    liveMetric: '₹24.8 LPA Target'
  },
  { 
    id: 'coding', 
    name: 'Interactive Multi-Language Coding Lab', 
    category: 'SANDBOX & DSA LAB', 
    icon: Code2, 
    color: '#ec4899', 
    desc: 'Full-stack in-browser IDE for Java 17, Python 3, C++, Go, and C with automated complexity evaluators & Monaco editor.',
    stats: 'Instant Execution & AI Copilot',
    badge: 'Real-Time Compiler',
    liveMetric: '6 Languages Supported'
  },
  { 
    id: 'pyq', 
    name: 'Autonomous PYQ & Exam Vault', 
    category: 'EXAMINATION VAULT', 
    icon: Award, 
    color: '#fbbf24', 
    desc: 'Complete past 5-year question papers, verified answer keys, and exam blue-prints mapped to university regulations.',
    stats: '100+ Verified Solution Dossiers',
    badge: 'University Regulations',
    liveMetric: '100% Syllabus Coverage'
  },
  { 
    id: 'notes', 
    name: 'Smart Notes & AI Knowledge Repo', 
    category: 'CURATED KNOWLEDGE', 
    icon: BookOpen, 
    color: '#38bdf8', 
    desc: 'Peer-shared and faculty-verified study notes, AI-generated summary sheets, and interactive formula cheat codes.',
    stats: 'Instant PDF / LaTeX Generation',
    badge: 'Smart Revision',
    liveMetric: 'AI Instant Flashcards'
  },
  { 
    id: 'attendance', 
    name: 'Official Attendance Radar & Compliance', 
    category: 'STUDENT SAFETY RADAR', 
    icon: BarChart3, 
    color: '#e11d48', 
    desc: 'Subject-wise 75% threshold safety radar, condonation calculator, and automated timetable scheduling.',
    stats: 'Real-time Safety Margin Alerts',
    badge: 'Zero Backlog Shield',
    liveMetric: 'Safe Zone Guaranteed'
  },
  { 
    id: 'productivity', 
    name: 'Global Resonance AP & Leaderboard', 
    category: 'CAMPUS GAMIFICATION', 
    icon: Zap, 
    color: '#f59e0b', 
    desc: 'Earn Aura Resonance Points (AP) and Synaptic Coins (SC) by solving daily tasks, coding labs, and study sprints.',
    stats: 'Live Inter-College Ranks',
    badge: 'Campus Prestige',
    liveMetric: 'Level 14 Scholar'
  }
];

const BACKGROUND_THEMES = [
  { id: 'cosmic_aurora', name: '🌌 Cosmic Aurora', bg: '#060614', topGlow: '#6938ef', bottomGlow: '#00f5d4' },
  { id: 'gold_studio', name: '✨ Gold Dreamstage', bg: '#0a0804', topGlow: '#f59e0b', bottomGlow: '#fbbf24' },
  { id: 'cyber_violet', name: '💜 Cyber Violet', bg: '#080410', topGlow: '#d946ef', bottomGlow: '#3b82f6' }
];

export default function CinematicIntro({ onComplete }) {
  const [selectedMascotIndex, setSelectedMascotIndex] = useState(0);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [currentBgThemeIndex, setCurrentBgThemeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioStarted, setAudioStarted] = useState(false);
  const [dialogueText, setDialogueText] = useState(CARTOON_MASCOTS[0].quote);
  const [progress, setProgress] = useState(0);

  // Mouse Parallax
  const [mouseNorm, setMouseNorm] = useState({ x: 0, y: 0 });
  const [interactiveSparks, setInteractiveSparks] = useState([]);

  const threeMountRef = useRef(null);
  const audioElementRef = useRef(null);

  const currentMascot = CARTOON_MASCOTS[selectedMascotIndex];
  const currentBgTheme = BACKGROUND_THEMES[currentBgThemeIndex];

  // ─── 3D THREE.JS LUXURY CINEMATIC DREAMSTAGE ───
  useEffect(() => {
    const mount = threeMountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04040d, 0.015);

    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 28);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 1. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(0, 20, 20);
    scene.add(mainLight);

    // 2. 3D Floating Luminous Fireflies / Golden Stardust (1200 Bokeh Stars)
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(currentMascot.color || '#00f5d4');
    const color2 = new THREE.Color('#ffd166');
    const color3 = new THREE.Color('#a855f7');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 75;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 55;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const c = i % 3 === 0 ? color1 : (i % 3 === 1 ? color2 : color3);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const starParticles = new THREE.Points(geometry, material);
    scene.add(starParticles);

    // 3. Elegant Glowing Pedestal Ring Underneath Mascot
    const ringGeo = new THREE.TorusGeometry(6.5, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(currentMascot.color || '#00f5d4'), 
      transparent: true, 
      opacity: 0.45 
    });
    const stageRing = new THREE.Mesh(ringGeo, ringMat);
    stageRing.rotation.x = Math.PI / 2.2;
    stageRing.position.set(-6, -6, 0);
    scene.add(stageRing);

    const ringGeo2 = new THREE.TorusGeometry(8.5, 0.03, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.2 
    });
    const stageRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    stageRing2.rotation.x = Math.PI / 2.2;
    stageRing2.position.set(-6, -6, 0);
    scene.add(stageRing2);

    // 4. Smooth Animation Loop
    let reqId;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Gentle Stardust Flow
      starParticles.rotation.y = time * 0.02;
      starParticles.rotation.x = time * 0.01;

      // Subtle Pedestal Spin
      stageRing.rotation.z = time * 0.4;
      stageRing2.rotation.z = -time * 0.25;

      // Smooth Camera Drift with Mouse Parallax
      camera.position.x = mouseNorm.x * 2.8;
      camera.position.y = -mouseNorm.y * 2.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      renderer.dispose();
    };
  }, [mouseNorm, currentMascot]);

  // ─── EXACT STUDIO AUDIO PLAYBACK ENGINE (HTML5 AUDIO) ───
  const startAudioPlayback = () => {
    if (audioElementRef.current) {
      audioElementRef.current.play().then(() => {
        setAudioStarted(true);
        setSoundEnabled(true);
      }).catch(() => {});
    }
  };

  useEffect(() => {
    startAudioPlayback();
    const handleGlobalInteraction = () => {
      startAudioPlayback();
      window.removeEventListener('pointerdown', handleGlobalInteraction);
      window.removeEventListener('keydown', handleGlobalInteraction);
    };
    window.addEventListener('pointerdown', handleGlobalInteraction);
    window.addEventListener('keydown', handleGlobalInteraction);
    return () => {
      window.removeEventListener('pointerdown', handleGlobalInteraction);
      window.removeEventListener('keydown', handleGlobalInteraction);
    };
  }, []);

  const toggleSound = () => {
    if (!audioElementRef.current) return;
    if (soundEnabled) {
      audioElementRef.current.pause();
      setSoundEnabled(false);
    } else {
      audioElementRef.current.play();
      setSoundEnabled(true);
      setAudioStarted(true);
    }
  };

  // Switch Background Theme
  const handleSwitchBgTheme = () => {
    setCurrentBgThemeIndex(prev => (prev + 1) % BACKGROUND_THEMES.length);
  };

  // Auto-Cycle Mascots & Features
  useEffect(() => {
    let cycleTimer;
    if (isPlaying) {
      cycleTimer = setInterval(() => {
        setActiveFeatureIndex(prev => {
          const nextFeat = (prev + 1) % ALL_VYOMRA_FEATURES.length;
          const feat = ALL_VYOMRA_FEATURES[nextFeat];
          
          setSelectedMascotIndex(mIdx => {
            const nextMascot = (mIdx + 1) % CARTOON_MASCOTS.length;
            const mascot = CARTOON_MASCOTS[nextMascot];
            setDialogueText(`${mascot.emoji} ${mascot.name}: "${feat.name} — ${feat.desc}" ✨`);
            return nextMascot;
          });

          return nextFeat;
        });
      }, 4500);
    }
    return () => clearInterval(cycleTimer);
  }, [isPlaying]);

  // 5-Second Duration Timer & Automatic Finish
  useEffect(() => {
    const totalDuration = 5000; // Exactly 5 seconds
    const interval = 50;
    const progressTimer = setInterval(() => {
      if (isPlaying) {
        setProgress(prev => {
          const next = prev + (interval / totalDuration) * 100;
          if (next >= 100) {
            clearInterval(progressTimer);
            handleFinish();
            return 100;
          }
          return next;
        });
      }
    }, interval);
    return () => clearInterval(progressTimer);
  }, [isPlaying]);

  const handleMouseMove = (e) => {
    const normX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const normY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    setMouseNorm({ x: normX, y: normY });
  };

  const handleScreenClick = (e) => {
    if (!audioStarted) {
      startAudioPlayback();
    }
    const newStar = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY
    };
    setInteractiveSparks(prev => [...prev.slice(-15), newStar]);
    setTimeout(() => {
      setInteractiveSparks(prev => prev.filter(s => s.id !== newStar.id));
    }, 900);
  };

  const handleFinish = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 600);
  };

  return (
    <div 
      className={`fixed inset-0 z-[999999] text-white flex flex-col justify-between overflow-hidden select-none transition-all duration-700 ${isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'}`}
      style={{ backgroundColor: currentBgTheme.bg }}
      onMouseMove={handleMouseMove}
      onClick={handleScreenClick}
    >
      {/* ─── REAL STUDIO HTML5 AUDIO ELEMENT ─── */}
      <audio 
        ref={audioElementRef}
        src="/anirudh_mass_bgm.wav"
        loop
        preload="auto"
      />
      
      {/* ─── REAL-TIME THREE.JS 3D WEBGL ENGINE MOUNT ─── */}
      <div ref={threeMountRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* ─── ULTRA-CLEAN VOLUMETRIC GLOWS (SMOOTH CINEMATIC LIGHTING) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute -top-40 -left-20 w-[700px] h-[700px] rounded-full opacity-35 blur-[160px] transition-all duration-1000"
          style={{ background: `radial-gradient(circle, ${currentBgTheme.topGlow} 0%, transparent 70%)` }}
        />
        <div 
          className="absolute -bottom-40 -right-20 w-[750px] h-[750px] rounded-full opacity-30 blur-[160px] transition-all duration-1000"
          style={{ background: `radial-gradient(circle, ${currentBgTheme.bottomGlow} 0%, transparent 70%)` }}
        />
      </div>

      {/* ─── INTERACTIVE TAP SPARKS ─── */}
      {interactiveSparks.map(s => (
        <div 
          key={s.id} 
          className="pointer-events-none fixed z-50 text-3xl animate-bounce"
          style={{ left: s.x - 16, top: s.y - 16 }}
        >
          ✨🌟⭐
        </div>
      ))}

      {/* ─── TOP HEADER BAR ─── */}
      <header className="relative z-30 flex flex-wrap items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3.5">
          <div 
            className="w-11 h-11 rounded-2xl border flex items-center justify-center text-2xl shadow-2xl transition-all"
            style={{ 
              backgroundColor: `${currentMascot.color}20`, 
              borderColor: `${currentMascot.color}60`,
              boxShadow: `0 0 20px ${currentMascot.color}30`
            }}
          >
            {currentMascot.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-[#00f5d4] to-pink-500 uppercase font-mono">
                VYOMRA 3D // CARTOON MULTIVERSE
              </h1>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#00f5d4]/20 text-[#00f5d4] font-bold border border-[#00f5d4]/40 uppercase tracking-widest">
                {currentMascot.universe}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono tracking-wider mt-0.5">🎸 BGM: ANIRUDH MASS THEME · CLICK ANYWHERE TO PLAY</p>
          </div>
        </div>

        {/* Action Controls & Theme Switcher */}
        <div className="flex items-center gap-2.5 mt-2 sm:mt-0">
          {/* Background Theme Switcher */}
          <button
            onClick={handleSwitchBgTheme}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-cyan-300 flex items-center gap-2 transition-all cursor-pointer shadow-lg backdrop-blur-md hover:scale-105"
            title="Click to Switch Background Theme"
          >
            <Palette className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{currentBgTheme.name}</span>
          </button>

          <button
            onClick={toggleSound}
            className="w-10 h-10 rounded-2xl bg-white/5 border border-white/15 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled && audioStarted ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>

          <button
            onClick={() => {
              if (!audioStarted) startAudioPlayback();
              if (isPlaying) {
                if (audioElementRef.current) audioElementRef.current.pause();
                setIsPlaying(false);
              } else {
                if (audioElementRef.current) audioElementRef.current.play();
                setIsPlaying(true);
              }
            }}
            className="w-10 h-10 rounded-2xl bg-white/5 border border-white/15 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black text-xs tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xl shadow-amber-400/25 hover:scale-105 active:scale-95"
          >
            <span>ENTER PLATFORM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ─── MAIN STAGE DISPLAY ─── */}
      <main className="relative z-20 flex-1 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 max-w-7xl mx-auto w-full gap-8">
        
        {/* 🌟 100% REAL AUTHENTIC HIGH-RES TRANSPARENT CARTOON HERO (FLOATING IN 3D) */}
        <div 
          className="relative flex items-center justify-center shrink-0 w-full lg:w-1/2 h-[320px] sm:h-[440px] select-none"
          style={{ 
            transform: `perspective(1000px) rotateY(${mouseNorm.x * 12}deg) rotateX(${-mouseNorm.y * 8}deg)` 
          }}
        >
          {/* Glowing 3D Base Platform Glow */}
          <div 
            className="absolute bottom-2 w-[340px] sm:w-[420px] h-24 rounded-full blur-3xl pointer-events-none animate-pulse transition-all duration-700"
            style={{ 
              background: `radial-gradient(circle, ${currentMascot.color}70 0%, #00f5d4 50%, transparent 80%)` 
            }}
          />

          {/* Render Real Authentic Transparent Image */}
          <div className="relative group cursor-pointer animate-fade-in flex items-center justify-center">
            <img 
              src={currentMascot.image} 
              alt={currentMascot.name}
              className="w-full max-h-[360px] sm:max-h-[420px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] transition-transform duration-300 group-hover:scale-105"
            />

            {/* Mascot Tag Badge */}
            <div 
              className="absolute -top-3 right-4 px-3.5 py-1.5 rounded-full bg-black/85 border text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce"
              style={{ borderColor: `${currentMascot.color}60`, color: currentMascot.color }}
            >
              <span>{currentMascot.emoji} {currentMascot.tag}</span>
            </div>

            {/* Floating Collectible Tag */}
            <div className="absolute -bottom-2 left-4 px-3.5 py-1 rounded-full bg-black/85 border border-white/15 text-[11px] font-mono text-amber-300 shadow-xl backdrop-blur-md">
              <span>{currentMascot.collectible}</span>
            </div>
          </div>
        </div>

        {/* 🌟 3D HOLOGRAPHIC FEATURE MATRIX CARD (RIGHT SIDE) */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start space-y-4" onClick={(e) => e.stopPropagation()}>
          
          <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 bg-[#08081a]/90 backdrop-blur-2xl shadow-2xl space-y-5 animate-fade-in">
            
            {/* Top Category & Live Metric Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <span 
                className="text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-2 shadow-sm"
                style={{ 
                  backgroundColor: `${ALL_VYOMRA_FEATURES[activeFeatureIndex].color}20`, 
                  borderColor: `${ALL_VYOMRA_FEATURES[activeFeatureIndex].color}60`, 
                  color: ALL_VYOMRA_FEATURES[activeFeatureIndex].color 
                }}
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                {ALL_VYOMRA_FEATURES[activeFeatureIndex].category}
              </span>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-white/10 text-emerald-300 font-bold border border-white/10">
                  {ALL_VYOMRA_FEATURES[activeFeatureIndex].liveMetric}
                </span>
                <span className="text-xs text-gray-400 font-mono font-bold">
                  {activeFeatureIndex + 1} / {ALL_VYOMRA_FEATURES.length}
                </span>
              </div>
            </div>

            {/* Feature Content */}
            {(() => {
              const feat = ALL_VYOMRA_FEATURES[activeFeatureIndex];
              const IconComp = feat.icon;
              return (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xl mt-0.5"
                      style={{ 
                        backgroundColor: `${feat.color}20`, 
                        borderColor: `${feat.color}50`, 
                        color: feat.color,
                        boxShadow: `0 0 35px ${feat.color}40`
                      }}
                    >
                      <IconComp className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-amber-300">
                        {feat.badge}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white font-sora leading-tight">{feat.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>

                  {/* Highlight Stat Pill */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>{feat.stats}</span>
                    </div>
                    <button 
                      className="text-[11px] text-[#00f5d4] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore Feature</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Clickable Feature Selector Pills */}
            <div className="flex items-center gap-2 pt-1">
              {ALL_VYOMRA_FEATURES.map((f, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveFeatureIndex(idx);
                    setDialogueText(`${currentMascot.emoji} ${currentMascot.name}: "Superpower #${idx + 1}: ${f.name} — ${f.desc}" ✨`);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeFeatureIndex 
                      ? 'w-12 bg-amber-400 shadow-lg shadow-amber-400/50' 
                      : idx < activeFeatureIndex 
                      ? 'w-4 bg-emerald-400/60' 
                      : 'w-2.5 bg-white/20 hover:bg-white/50'
                  }`}
                  title={f.name}
                />
              ))}
            </div>

          </div>
        </div>

      </main>

      {/* ─── FOOTER PROGRESS & DIALOGUE BAR ─── */}
      <footer className="relative z-30 px-6 py-5 space-y-3" onClick={(e) => e.stopPropagation()}>
        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden max-w-4xl mx-auto">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-[#00f5d4] to-brand-purple transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dialogue Card */}
        <div className="max-w-2xl mx-auto bg-black/85 backdrop-blur-2xl border border-white/15 px-6 py-3 rounded-2xl text-center shadow-2xl">
          <p className="text-xs sm:text-sm font-bold text-amber-300 tracking-wide leading-relaxed animate-fade-in">
            {dialogueText}
          </p>
        </div>
      </footer>

    </div>
  );
}
