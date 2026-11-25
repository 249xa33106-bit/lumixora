import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Play, Briefcase, Zap, Brain, BookOpen, 
  Sparkles, Grid, Lightbulb, Star, Code2, Award, ChevronRight, ChevronLeft, X,
  GraduationCap, Target, Users, Rocket, ExternalLink, Heart,
  CheckCircle2, Compass, Layers, ShieldCheck, Flame, Quote, Building2
} from 'lucide-react';

/* ─── ELEMENTAL NEXUS: FIRE GLOW & WATER FOUNTAIN VISUAL ─── */
function FounderElementalVisual({ maxH = "max-h-[84%] sm:max-h-[86%] md:max-h-[88%]", shadowColor = "rgba(79,70,229,0.4)", children }) {
  return (
    <div className="relative h-full flex items-center justify-center py-3 sm:py-4 overflow-visible">
      {/* ─── SURROUNDING ELEMENTAL CONIC HALO ─── */}
      <div 
        className="absolute w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full pointer-events-none opacity-80 blur-[26px] -z-10 animate-pulse"
        style={{
          background: 'conic-gradient(from 180deg at 50% 50%, rgba(249,115,22,0.5) 0deg, rgba(239,68,68,0.45) 75deg, rgba(168,85,247,0.3) 140deg, rgba(6,182,212,0.55) 220deg, rgba(59,130,246,0.6) 290deg, rgba(245,158,11,0.5) 360deg)'
        }}
      />

      {/* ─── FIRE GLOW EFFECT: LEFT & SURROUNDING ─── */}
      {/* 1. Fire Ambient Core Glow */}
      <div 
        className="absolute -left-12 sm:-left-16 top-1/2 -translate-y-1/2 w-48 sm:w-56 h-48 sm:h-56 rounded-full pointer-events-none opacity-85 blur-[24px] animate-fire-glow -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(255,100,0,0.7) 0%, rgba(239,68,68,0.5) 45%, rgba(245,158,11,0.2) 75%, transparent 90%)'
        }}
      />

      {/* 2. Rising Fiery Embers & Sparks */}
      <div className="absolute -left-8 sm:-left-10 bottom-14 sm:bottom-16 w-24 h-48 pointer-events-none overflow-visible -z-0">
        <span className="absolute left-2 bottom-4 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b,0_0_16px_#ef4444] animate-ember-1" />
        <span className="absolute left-6 bottom-10 w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_10px_#f97316,0_0_20px_#dc2626] animate-ember-2" style={{ animationDelay: '0.6s' }} />
        <span className="absolute left-0 bottom-20 w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_6px_#fde047,0_0_12px_#ea580c] animate-ember-3" style={{ animationDelay: '1.2s' }} />
        <span className="absolute left-8 bottom-6 w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e,0_0_16px_#b91c1c] animate-ember-1" style={{ animationDelay: '1.8s' }} />
        <span className="absolute left-4 bottom-24 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24,0_0_12px_#c2410c] animate-ember-2" style={{ animationDelay: '0.3s' }} />
        <span className="absolute left-7 bottom-32 w-1 h-1 rounded-full bg-yellow-200 shadow-[0_0_4px_#fef08a] animate-ember-3" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* 3. Dynamic Curved Fire Flame Tongues (SVG) */}
      <svg 
        className="absolute -left-10 sm:-left-12 top-1/2 -translate-y-1/2 w-32 h-64 pointer-events-none animate-fire-tongue -z-5 overflow-visible"
        viewBox="0 0 100 200" 
        fill="none"
      >
        <defs>
          <linearGradient id="fireGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="0.75" />
            <stop offset="90%" stopColor="#fde047" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="fireGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0.8" />
          </linearGradient>
          <filter id="fireBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path 
          d="M70 170 C40 150, 10 110, 25 70 C35 90, 45 80, 40 50 C55 75, 70 45, 65 20 C75 55, 85 90, 70 130 Z" 
          fill="url(#fireGrad1)" 
          filter="url(#fireBlur)"
          opacity="0.85"
        />
        <path 
          d="M68 150 C50 135, 25 105, 38 75 C45 90, 52 85, 48 65 C58 85, 68 65, 66 40 C72 70, 78 100, 68 150 Z" 
          fill="url(#fireGrad2)" 
          opacity="0.9"
        />
      </svg>

      {/* ─── WATER FOUNTAIN EFFECT: RIGHT & SURROUNDING ─── */}
      {/* 1. Water Ambient Core Glow */}
      <div 
        className="absolute -right-12 sm:-right-16 top-1/2 -translate-y-1/2 w-48 sm:w-56 h-48 sm:h-56 rounded-full pointer-events-none opacity-85 blur-[24px] animate-water-glow -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.7) 0%, rgba(14,165,233,0.5) 45%, rgba(59,130,246,0.2) 75%, transparent 90%)'
        }}
      />

      {/* 2. Expanding Water Ripple Splash Waves */}
      <div className="absolute -right-6 sm:-right-8 bottom-12 sm:bottom-14 w-28 h-28 pointer-events-none -z-10">
        <span className="absolute inset-0 rounded-full border border-cyan-400/50 animate-water-ripple" />
        <span className="absolute inset-0 rounded-full border border-sky-400/40 animate-water-ripple" style={{ animationDelay: '1.2s' }} />
      </div>

      {/* 3. Water Fountain Spray Droplets */}
      <div className="absolute -right-8 sm:-right-10 bottom-14 sm:bottom-16 w-28 h-52 pointer-events-none overflow-visible -z-0">
        <span className="absolute right-4 bottom-4 w-2.5 h-2.5 rounded-full bg-cyan-200 shadow-[0_0_10px_#22d3ee,0_0_20px_#0284c7] animate-fountain-1" />
        <span className="absolute right-8 bottom-10 w-3 h-3 rounded-full bg-sky-100 shadow-[0_0_12px_#38bdf8,0_0_24px_#2563eb] animate-fountain-2" style={{ animationDelay: '0.5s' }} />
        <span className="absolute right-2 bottom-18 w-2 h-2 rounded-full bg-teal-200 shadow-[0_0_8px_#2dd4bf,0_0_16px_#0369a1] animate-fountain-3" style={{ animationDelay: '1.1s' }} />
        <span className="absolute right-10 bottom-6 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff,0_0_18px_#38bdf8] animate-fountain-1" style={{ animationDelay: '1.6s' }} />
        <span className="absolute right-5 bottom-26 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9] animate-fountain-2" style={{ animationDelay: '0.8s' }} />
        <span className="absolute right-1 bottom-36 w-1.5 h-1.5 rounded-full bg-blue-200 shadow-[0_0_6px_#93c5fd] animate-fountain-3" style={{ animationDelay: '1.3s' }} />
        <span className="absolute right-9 bottom-14 w-2 h-2 rounded-full bg-sky-200 shadow-[0_0_8px_#7dd3fc] animate-fountain-1" style={{ animationDelay: '2.0s' }} />
      </div>

      {/* 4. Graceful Arched Water Fountain Stream Jets (SVG) */}
      <svg 
        className="absolute -right-10 sm:-right-12 top-1/2 -translate-y-1/2 w-36 h-64 pointer-events-none animate-water-jet -z-5 overflow-visible"
        viewBox="0 0 100 200" 
        fill="none"
      >
        <defs>
          <linearGradient id="waterStream1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#67e8f9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="waterStream2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.85" />
          </linearGradient>
          <filter id="waterGlint" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path 
          d="M30 180 C55 150, 75 110, 70 65 C68 45, 82 25, 92 15 C82 35, 78 60, 55 110 C45 135, 38 160, 30 180 Z" 
          fill="url(#waterStream1)" 
          filter="url(#waterGlint)"
          opacity="0.85"
        />
        <path 
          d="M35 160 C55 130, 85 95, 80 50 C86 70, 70 105, 52 135 Z" 
          fill="url(#waterStream2)" 
          opacity="0.8"
        />
        <circle cx="92" cy="15" r="3" fill="#ffffff" filter="drop-shadow(0 0 6px #67e8f9)" />
        <circle cx="85" cy="30" r="2.2" fill="#a5f3fc" />
        <circle cx="78" cy="48" r="2.5" fill="#e0f2fe" />
        <circle cx="68" cy="80" r="2" fill="#38bdf8" />
      </svg>

      {/* ─── THE EXACT FOUNDER PORTRAIT (Z-10, CRISP & INTACT WITH FULL ROUND BOTTOM RING) ─── */}
      <img 
        src="/dashboard_hero_founder_exact.png?v=6.0" 
        alt="Shaik Sowban - Founder, Lumixora" 
        className={`h-full ${maxH} w-auto object-contain drop-shadow-[0_15px_45px_${shadowColor}] relative z-10 my-auto`}
      />

      {/* Extra floating badges / children */}
      {children}
    </div>
  );
}

export default function LumixoraHeroSuite({ onNavigateTab, user }) {
  const [activeSubTab, setActiveSubTab] = useState('placement');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFounderJourneyModal, setShowFounderJourneyModal] = useState(false);
  const [showJourneyVideoModal, setShowJourneyVideoModal] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // Requirement 5: Pause-on-hover
  const [slideProgress, setSlideProgress] = useState(0); // Requirement 5: Smooth 5s Countdown Progress (0-100%)

  const minSwipeDistance = 40;

  const handleSelectSlide = (idx) => {
    setCurrentSlide(idx);
    setSlideProgress(0);
  };

  // Touch Swipe handlers for mobile & tablet
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      // Swiped Left -> Next slide
      handleSelectSlide((currentSlide + 1) % 3);
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev slide
      handleSelectSlide((currentSlide - 1 + 3) % 3);
    }
  };

  // Mouse Drag / Swipe handlers for desktop & laptop
  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    // Don't hijack button/link clicks inside the banner
    if (e.target.closest('button') || e.target.closest('a')) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
  };

  const onMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const distance = dragStartX - e.clientX;
    if (distance > minSwipeDistance) {
      // Dragged Left -> Next slide
      handleSelectSlide((currentSlide + 1) % 3);
    } else if (distance < -minSwipeDistance) {
      // Dragged Right -> Prev slide
      handleSelectSlide((currentSlide - 1 + 3) % 3);
    }
  };

  const onMouseLeave = (e) => {
    setIsHovered(false);
    if (isDragging) {
      onMouseUp(e);
    }
  };

  // Auto-advance slides every 5 seconds (50ms x 100 steps) with Pause-on-Hover (Requirement 5)
  useEffect(() => {
    if (isHovered || isDragging) return;

    const interval = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((s) => (s + 1) % 3);
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isHovered, isDragging]);

  const handleWatchOverview = () => {
    setShowJourneyVideoModal(true);
  };

  return (
    <div className="space-y-6 w-full animate-fade-in relative z-10">
      {/* ─── 1. HERO BANNER: WORKABLE SWIPABLE CAROUSEL (3 SLIDES) ─── */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        className={`w-full rounded-[32px] md:rounded-[36px] overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl relative bg-gradient-to-r from-[#070f23] via-[#0c142b] to-[#12102e] p-6 sm:p-8 md:p-10 lg:p-12 transition-all min-h-[340px] md:min-h-[380px] lg:min-h-[400px] flex items-center group select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {/* Ambient background glow */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── SLIDE 0: FOUNDER'S JOURNEY (DEFAULT FIRST SLIDE ON LOAD) ── */}
        {currentSlide === 0 && (
          <div className="w-full flex items-center justify-between animate-fade-in">
            {/* Content Left */}
            <div className="relative z-10 max-w-full md:max-w-[52%] lg:max-w-[48%] xl:max-w-xl text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-black shadow-sm mb-4 md:mb-5">
                <span>Shaik Sowban • Founder's Vision</span>
                <span className="text-sm">🌟</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.08] mb-3 md:mb-4">
                Built by Students.<br />
                <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
                  Founder's Journey.
                </span>
              </h1>

              <p className="text-slate-300 text-sm md:text-base font-semibold max-w-md md:max-w-sm lg:max-w-md mb-6 md:mb-7 leading-relaxed">
                From solving tier-2 placement disparities to empowering 450+ engineering scholars with AI placement radar, zero-cost blueprints, and mentorship.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-5 md:mb-6">
                <button 
                  onClick={() => setShowFounderJourneyModal(true)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explore Founder's Story</span>
                </button>

                <button 
                  onClick={handleWatchOverview}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 shadow-md backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Watch Journey Video</span>
                </button>

                <button
                  onClick={() => setCurrentSlide(1)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/20 transition-all cursor-pointer"
                >
                  <span>Career Nexus</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Visual: Founder in Neon Ring with Impact Badges & Elemental Fire & Water Aura */}
            <div className="hidden md:flex absolute right-4 sm:right-6 md:right-8 lg:right-12 top-0 bottom-0 h-full items-center justify-end pointer-events-none select-none z-0">
              <FounderElementalVisual maxH="max-h-[82%] sm:max-h-[84%] md:max-h-[86%]" shadowColor="rgba(245,158,11,0.35)">
                {/* Floating Impact Card beside founder */}
                <div className="hidden lg:block absolute -left-28 lg:-left-32 top-8 w-44 p-3 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-1.5 z-20">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Award className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Mission Impact</span>
                  </div>
                  <div className="text-sm font-black text-white">450+ Scholars</div>
                  <p className="text-[10px] text-gray-400">Active across 7+ Campus Innovation Hubs</p>
                </div>

                <div className="hidden lg:flex absolute -left-20 lg:-left-24 bottom-8 w-40 p-2.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-xl shadow-2xl items-center gap-2 z-20">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold shrink-0">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-white">AI Placement</div>
                    <div className="text-[9px] text-purple-300 font-bold">100% Free Core Access</div>
                  </div>
                </div>
              </FounderElementalVisual>
            </div>
          </div>
        )}

        {/* ── SLIDE 1: YOUR CAREER. OUR COMMITMENT. ── */}
        {currentSlide === 1 && (
          <div className="w-full flex items-center justify-between animate-fade-in">
            {/* Content Left */}
            <div className="relative z-10 max-w-full md:max-w-[54%] lg:max-w-[50%] xl:max-w-xl text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-purple-400/20 text-purple-300 text-xs font-black shadow-sm mb-4 md:mb-5">
                <span>Powered by Lumixora</span>
                <span className="text-sm">🪄</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.08] mb-3 md:mb-4">
                Your Career.<br />
                <span className="bg-gradient-to-r from-[#818cf8] via-[#c084fc] to-[#38bdf8] bg-clip-text text-transparent">
                  Our Commitment.
                </span>
              </h1>

              <p className="text-slate-300 text-sm md:text-base font-semibold max-w-md mb-6 md:mb-7 leading-relaxed">
                Explore opportunities, build skills and achieve your dreams with Lumixora.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-5 md:mb-6">
                <button 
                  onClick={() => onNavigateTab ? onNavigateTab('ai-commander') : null}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Opportunities</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button 
                  onClick={handleWatchOverview}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 shadow-md backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                  <span>Watch Overview</span>
                </button>

                <button
                  onClick={() => setCurrentSlide(0)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/20 transition-all cursor-pointer"
                >
                  <span>Founder's Story</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Visual: 3D Career Command Center Showcase */}
            <div className="hidden md:flex absolute right-4 sm:right-6 md:right-8 lg:right-12 top-0 bottom-0 h-full w-[46%] lg:w-[48%] xl:w-[46%] items-center justify-end pointer-events-none select-none z-0">
              <div className="w-[340px] lg:w-[380px] p-6 rounded-3xl bg-slate-900/85 border border-purple-500/30 backdrop-blur-2xl shadow-2xl space-y-4 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-purple-500/30">
                      ⚡
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">Lumixora Career Nexus</h4>
                      <p className="text-[10px] text-purple-300">Live AI Placement Ecosystem</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-black border border-emerald-500/30 animate-pulse">
                    ● Active 2026
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-base font-black text-white">450+</div>
                    <div className="text-[10px] text-gray-400">Campus Offers & Drives</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-base font-black text-cyan-400">94.8%</div>
                    <div className="text-[10px] text-gray-400">AI Placement Readiness</div>
                  </div>
                </div>

                {/* Callout */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/20 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-black text-white">Engineering Excellence</div>
                    <div className="text-[9px] text-purple-300">Amazon • TCS • Cognizant • Infosys</div>
                  </div>
                  <button 
                    onClick={() => setCurrentSlide(0)}
                    className="pointer-events-auto px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-[10px] font-bold cursor-pointer transition-all"
                  >
                    Founder ➔
                  </button>
                </div>

                {/* Dream Bigger Typography */}
                <div className="pt-1 flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-serif italic font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-200">
                    Dream Bigger!
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SLIDE 2: AI 70M BLUEPRINT PREDICTOR ── */}
        {currentSlide === 2 && (
          <div className="w-full flex items-center justify-between animate-fade-in">
            {/* Content Left */}
            <div className="relative z-10 max-w-full md:max-w-[54%] lg:max-w-[50%] xl:max-w-xl text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 backdrop-blur-md border border-cyan-400/30 text-cyan-300 text-xs font-black shadow-sm mb-4 md:mb-5">
                <span>2026 Forecast • AI Blueprint</span>
                <span className="text-sm">🎯</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.08] mb-3 md:mb-4">
                Predict Exam Papers.<br />
                <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
                  Two Exact Sets.
                </span>
              </h1>

              <p className="text-slate-300 text-sm md:text-base font-semibold max-w-md mb-6 md:mb-7 leading-relaxed">
                Submit past university question papers to forecast the exact 2026 examination blueprint model with solved sectional questions.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-5 md:mb-6">
                <button 
                  onClick={() => onNavigateTab ? onNavigateTab('previous-papers') : null}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
                >
                  <span>Launch Paper Predictor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => onNavigateTab ? onNavigateTab('previous-papers') : null}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 shadow-md backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Company Placement Drives</span>
                </button>
              </div>
            </div>

            {/* Right Visual: Predictor Blueprint Badge */}
            <div className="hidden md:flex absolute right-6 lg:right-12 top-0 bottom-0 h-full items-center justify-end pointer-events-none select-none z-0">
              <div className="w-[340px] lg:w-[380px] p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">AI 70M Predictor</h4>
                      <p className="text-[10px] text-cyan-400">JNTU & Autonomous Calibrated</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-black border border-cyan-500/20">
                    2 Sets Ready
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between text-gray-300 font-medium">
                    <span>Set 1: High-Frequency Theory & Derivations</span>
                    <span className="text-cyan-400 font-bold">100%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between text-gray-300 font-medium">
                    <span>Set 2: Analytical & Problem Modeling</span>
                    <span className="text-emerald-400 font-bold">Solved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── WORKABLE CAROUSEL CONTROL DOCK (Prev + Countdown Progress Dots + Next) (Requirement 5) ── */}
        <div className="absolute left-6 sm:left-8 md:left-10 lg:left-12 bottom-5 sm:bottom-6 z-20 flex items-center gap-2.5 bg-black/70 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/20 shadow-2xl">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleSelectSlide((currentSlide - 1 + 3) % 3);
            }}
            className="w-6 h-6 rounded-full hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Animated Countdown Progress Indicators (Requirement 5) */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((idx) => {
              const isActive = currentSlide === idx;
              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSlide(idx);
                  }}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-2.5 transition-all duration-300 rounded-full cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'w-10 bg-white/15 border border-white/25 shadow-sm'
                      : 'w-2.5 bg-white/30 hover:bg-white/60'
                  }`}
                  title={isActive ? (isHovered ? "Paused (Hovered)" : `${Math.round((5000 - (slideProgress / 100) * 5000) / 1000)}s remaining`) : `Jump to Slide ${idx + 1}`}
                >
                  {isActive && (
                    <div
                      className={`h-full rounded-full transition-all duration-75 ${
                        idx === 0
                          ? 'bg-gradient-to-r from-amber-400 to-rose-500 shadow-sm shadow-rose-500/50'
                          : idx === 1
                          ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 shadow-sm shadow-purple-500/50'
                          : 'bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-sm shadow-cyan-500/50'
                      }`}
                      style={{ width: `${slideProgress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleSelectSlide((currentSlide + 1) % 3);
            }}
            className="w-6 h-6 rounded-full hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Status Label with Pause indicator */}
          <div className="flex items-center gap-1.5 ml-1">
            <span className="text-[10px] text-slate-300 font-bold hidden sm:inline-block">
              {currentSlide === 0 ? 'Founder' : currentSlide === 1 ? 'Career' : 'Predictor'}
            </span>
            {isHovered && (
              <span className="text-[9px] font-mono text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded border border-amber-400/30 animate-pulse">
                ⏸ Paused
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ─── FOUNDER'S JOURNEY MODAL ─── */}
      {showFounderJourneyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 md:p-6 animate-fade-in">
          <div className="bg-[#0b0f19] border border-purple-500/30 rounded-3xl max-w-2xl w-full p-5 sm:p-7 md:p-8 relative shadow-[0_0_60px_rgba(147,51,234,0.25)] text-left max-h-[92vh] overflow-y-auto space-y-6 custom-scrollbar">
            {/* Close Button */}
            <button 
              onClick={() => setShowFounderJourneyModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-10"
              title="Close Story"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: Founder Identity */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-5 pr-10">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center shadow-xl shrink-0">
                <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center text-2xl font-black text-amber-300">
                  SS
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">Shaik Sowban</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30 uppercase tracking-wider">
                    Founder & CEO
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-purple-400 mt-0.5">
                  Founder – Lumixora • A Product of Vyomra
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
                  <span>B.Tech Scholar & Engineering Founder</span>
                  <span>•</span>
                  <span>Kurnool, Andhra Pradesh</span>
                </p>
              </div>
            </div>

            {/* Core Genesis Quote */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/20 border border-purple-500/25">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Story Behind Lumixora</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mb-2">
                From a Vision to Building Something That Matters.
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                “Every startup begins with a problem. Lumixora began with a question: <strong className="text-amber-300 font-semibold not-italic">What if students had everything they needed to prepare for their future in one place?</strong>”
              </p>
              <p className="text-xs text-gray-400 leading-relaxed mt-2.5">
                Students were juggling separate websites for coding, aptitude, communication, projects, internships, and placement preparation. Resources were scattered, guidance was inconsistent, and managing everything was exhausting. I wanted to build a unified ecosystem that changes that completely.
              </p>
            </div>

            {/* 6-Stage Chronological Journey */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>The 6-Stage Journey</span>
                </span>
                <span className="text-[11px] text-gray-500 font-mono">2024 — Present</span>
              </div>

              <div className="space-y-2.5">
                {/* 01. An Idea */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all flex items-start gap-3.5">
                  <span className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 font-mono text-xs font-bold shrink-0">
                    01
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">The Beginning – An Idea</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Started by observing the day-to-day challenges faced by engineering students, including myself. Believing education must provide career certainty, not just marks.
                    </p>
                  </div>
                </div>

                {/* 02. Behind the Screens */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all flex items-start gap-3.5">
                  <span className="px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold shrink-0">
                    02
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Behind the Screens – Building Lumixora</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Planning features, designing clean interfaces, late-night coding sessions, fixing bugs, and continuously rebuilding experiences until every module felt natural.
                    </p>
                  </div>
                </div>

                {/* 03. Turning Ideas into Reality */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all flex items-start gap-3.5">
                  <span className="px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold shrink-0">
                    03
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Turning Ideas into Reality</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Lumixora took shape as a student-focused super-platform: AI Placement Commander, SpeakVerse voice coach, 102 verified branch syllabi, and live TechPulse radar.
                    </p>
                  </div>
                </div>

                {/* 04. Beyond One Person */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all flex items-start gap-3.5">
                  <span className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-bold shrink-0">
                    04
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Beyond One Person – Building a Team</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      A vision grows when passionate people unite. We brought together student interns, campus ambassadors, and contributors under Vyomra.
                    </p>
                  </div>
                </div>

                {/* 05. From Screens to Students */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all flex items-start gap-3.5">
                  <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold shrink-0">
                    05
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">From Screens to Students</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      The most fulfilling milestone: launching to real college students. Their daily practice, feedback, and success stories continue to shape what we engineer next.
                    </p>
                  </div>
                </div>

                {/* 06. The Road Ahead */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all flex items-start gap-3.5">
                  <span className="px-2 py-1 rounded-md bg-rose-500/20 text-rose-300 font-mono text-xs font-bold shrink-0">
                    06
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">The Road Ahead – A Bigger Vision</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Continuously evolving to make Tier-1 quality placement prep, communication coaching, and engineering mastery accessible to every student across India.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Raw Challenges Behind The Journey */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>The Challenges Behind The Journey</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Building a startup while being a full-time engineering student is not easy. There were moments of uncertainty, technical roadblocks, ideas that needed radical pivots, features that had to be rebuilt from scratch, and academic responsibilities to balance. There was no perfect roadmap. I had to learn, experiment, make mistakes, and keep moving forward.
              </p>
              <p className="text-xs font-semibold text-white pt-1">
                “Building something meaningful matters far more than waiting for the perfect moment to start.”
              </p>
            </div>

            {/* Impact Milestones */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <div className="font-black text-white text-lg font-mono">450+</div>
                <div className="text-gray-400 text-[10px] mt-0.5">Active Scholars</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <div className="font-black text-cyan-400 text-lg font-mono">102+</div>
                <div className="text-gray-400 text-[10px] mt-0.5">Branch Syllabi</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <div className="font-black text-purple-400 text-lg font-mono">10+</div>
                <div className="text-gray-400 text-[10px] mt-0.5">Career Portals</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <div className="font-black text-amber-400 text-lg font-mono">GPREC</div>
                <div className="text-gray-400 text-[10px] mt-0.5">Autonomous Campus</div>
              </div>
            </div>

            {/* Founder Direct Sign-off */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex items-start gap-3">
              <Quote className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm text-gray-200 italic leading-relaxed">
                  “I started Lumixora not because I had everything figured out, but because I believed something better could be built. This is still the beginning. Every student who joins us, every problem we solve, and every improvement we make brings us one step closer to that vision.”
                </p>
                <div className="mt-2 text-xs font-black text-white">
                  Shaik Sowban
                  <span className="text-gray-400 font-normal ml-1.5">— Founder, Lumixora | A Product of Vyomra</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setShowFounderJourneyModal(false);
                    if (onNavigateTab) onNavigateTab('ai-commander');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Placement Commander</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setShowFounderJourneyModal(false);
                    if (onNavigateTab) onNavigateTab('speakverse');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-purple-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Try SpeakVerse</span>
                </button>
              </div>

              <button
                onClick={() => setShowFounderJourneyModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-xs transition-all cursor-pointer"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── JOURNEY VIDEO MODAL ─── */}
      {showJourneyVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-6 animate-fade-in">
          <div className="bg-[#0b0f19] border border-cyan-500/30 rounded-3xl max-w-4xl w-full p-5 sm:p-7 relative shadow-[0_0_60px_rgba(6,182,212,0.25)] text-left max-h-[95vh] overflow-y-auto space-y-4">
            {/* Close Button */}
            <button 
              onClick={() => setShowJourneyVideoModal(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-20"
              title="Close Video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 pr-12">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5 flex items-center justify-center shrink-0 shadow-lg">
                <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center text-amber-300">
                  <Play className="w-4 h-4 fill-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-white font-sora">
                    Lumixora Journey & Vision Demo
                  </h3>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
                    HD 1080p
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Shaik Sowban • Built by Students for Engineering Scholars Worldwide
                </p>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl group">
              <video 
                src="/LUMIXORA_90S_CINEMATIC_DEMO.mp4" 
                controls 
                autoPlay 
                playsInline
                className="w-full h-full object-contain bg-black"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Interactive Jump Points & Alternate Modes */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setShowJourneyVideoModal(false);
                    window.dispatchEvent(new CustomEvent('lumixora_open_tour'));
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 font-bold border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Interactive 8-Step Tour</span>
                </button>

                <button
                  onClick={() => {
                    setShowJourneyVideoModal(false);
                    window.dispatchEvent(new CustomEvent('lumixora_open_tom_and_jerry_intro'));
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 font-bold border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Rocket className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cartoon Multiverse Showcase</span>
                </button>

                <button
                  onClick={() => {
                    setShowJourneyVideoModal(false);
                    setShowFounderJourneyModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-purple-300 font-bold border border-purple-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Read Founder Story</span>
                </button>
              </div>

              <button
                onClick={() => setShowJourneyVideoModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-bold transition-all cursor-pointer ml-auto"
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── THE JOURNEY OF INNOVATION (Founder's Vision Card) ─── */}
      <div className="w-full glass-panel bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/50 dark:from-slate-900 dark:via-[#0e1424] dark:to-[#171b36] border border-slate-200/80 dark:border-white/10 rounded-[28px] p-6 sm:p-7 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden mt-6">
        {/* Ambient atmospheric glows */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Authentic Founder Vision & Story */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-700/50 text-purple-700 dark:text-purple-300 text-[11px] font-black uppercase tracking-wider mb-3.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Founder's Journey • Built by Students for Students</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
                The Journey of Innovation
              </h2>

              {/* Authentic Story Quote */}
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 italic">
                “Every startup begins with a problem. Lumixora began with a single question: <strong className="text-gray-900 dark:text-white font-semibold not-italic">What if students had everything they needed to prepare for their future in one place?</strong> As a B.Tech scholar, I saw brilliant engineering students juggling fragmented platforms for coding, aptitude, communication, and placement prep. Built through late-night coding sessions, testing, and continuous feedback, Lumixora was created to turn potential into career certainty.”
              </p>

              {/* Founder Signature Line */}
              <div className="flex items-center gap-3 pt-1 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center shrink-0 shadow-md">
                  <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center text-xs font-black text-amber-300">
                    SS
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>Shaik Sowban</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20">Founder</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Lumixora • A Product of Vyomra
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setShowFounderJourneyModal(true)}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Read Full Founder Story & Milestones</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button 
                onClick={() => setShowJourneyVideoModal(true)}
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current text-purple-600 dark:text-purple-400" />
                <span>Watch Vision Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D Innovation Book Artwork with soft ambient glow */}
          <div className="md:col-span-5 lg:col-span-4 flex items-center justify-center relative">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-none flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-cyan-500/15 to-indigo-500/20 rounded-3xl blur-2xl -z-10 opacity-70" />
              <img 
                src="/dashboard_journey_book_fade.png" 
                alt="Lumixora Open Book of Innovation" 
                className="w-full max-h-52 md:max-h-56 object-contain pointer-events-none select-none transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
