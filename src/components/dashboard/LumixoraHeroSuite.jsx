import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Play, Briefcase, Zap, Brain, BookOpen, 
  Sparkles, Grid, Lightbulb, Star, Code2, Award, ChevronRight, ChevronLeft, X,
  GraduationCap, Target, Users, Rocket, ExternalLink, Heart
} from 'lucide-react';

export default function LumixoraHeroSuite({ onNavigateTab, user }) {
  const [activeSubTab, setActiveSubTab] = useState('placement');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFounderJourneyModal, setShowFounderJourneyModal] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 45;

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
      setCurrentSlide((prev) => (prev + 1) % 3);
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev slide
      setCurrentSlide((prev) => (prev - 1 + 3) % 3);
    }
  };

  // Auto-advance slides every 8 seconds (pauses on interaction)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleWatchOverview = () => {
    // Dispatch event to open onboarding/platform tour modal
    window.dispatchEvent(new CustomEvent('lumixora_open_onboarding'));
  };

  const navItems = [
    { id: 'placement', label: 'Placement Dashboard', icon: Briefcase, targetTab: 'ai-commander' },
    { id: 'skills', label: 'Skill Hub', icon: Zap, targetTab: 'coding-practice' },
    { id: 'brain', label: 'AI Career Brain', icon: Brain, scrollTo: 'student-dna-section' },
    { id: 'learning', label: 'Learning Paths', icon: BookOpen, targetTab: 'learning-hub' },
    { id: 'services', label: 'Career Services', icon: Sparkles, targetTab: 'career-roadmap' },
  ];

  const handleNavClick = (item) => {
    setActiveSubTab(item.id);
    if (item.scrollTo) {
      const el = document.getElementById(item.scrollTo);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (item.targetTab && onNavigateTab) {
      onNavigateTab(item.targetTab);
    }
  };

  return (
    <div className="space-y-6 w-full animate-fade-in relative z-10">
      {/* ─── 1. HERO BANNER: WORKABLE SWIPABLE CAROUSEL (3 SLIDES) ─── */}
      <div 
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="w-full rounded-[32px] md:rounded-[36px] overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl relative bg-gradient-to-r from-[#070f23] via-[#0c142b] to-[#12102e] p-6 sm:p-8 md:p-10 lg:p-12 transition-all min-h-[340px] md:min-h-[380px] lg:min-h-[400px] flex items-center group select-none"
      >
        {/* Ambient background glow */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── SLIDE 0: YOUR CAREER. OUR COMMITMENT. ── */}
        {currentSlide === 0 && (
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
              </div>
            </div>

            {/* Right Visual (Exact Founder Portrait - Solid, 0 Holes, Fills Frame Cleanly) */}
            <div className="hidden md:flex absolute right-2 sm:right-4 md:right-6 lg:right-10 top-0 bottom-0 h-full w-[46%] lg:w-[48%] xl:w-[46%] items-center justify-end pointer-events-none select-none z-0">
              <div className="relative h-full flex items-center justify-center py-2 sm:py-3">
                <img 
                  src="/dashboard_hero_founder_exact.png?v=5.0" 
                  alt="Shaik Sowban - Founder, Lumixora" 
                  className="h-full max-h-[96%] w-auto object-contain drop-shadow-[0_15px_45px_rgba(79,70,229,0.4)]"
                />

                {/* Floating 'Dream Bigger!' Vector Typography & Glowing Sparkles (Zero missing glyph boxes) */}
                <div className="absolute -left-28 lg:-left-36 top-5 lg:top-8 flex items-center gap-2 select-none pointer-events-none transform -rotate-3">
                  <svg className="w-4 h-4 text-purple-400 animate-pulse drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                  <span className="font-serif italic font-black text-xl lg:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-200 drop-shadow-[0_2px_12px_rgba(168,85,247,0.7)] tracking-wide whitespace-nowrap">
                    Dream Bigger!
                  </span>
                  <svg className="w-3.5 h-3.5 text-cyan-300 animate-pulse drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                </div>

                {/* Ambient Floating 3D Crystal Diamonds */}
                <div className="absolute -left-10 bottom-12 w-5 h-7 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-sm rotate-45 border border-purple-300/40 shadow-lg shadow-purple-500/30 opacity-90" />
                <div className="absolute -right-3 top-14 w-4 h-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-sm rotate-45 border border-cyan-300/40 shadow-lg shadow-cyan-500/30 opacity-90" />
              </div>
            </div>
          </div>
        )}

        {/* ── SLIDE 1: FOUNDER'S JOURNEY ── */}
        {currentSlide === 1 && (
          <div className="w-full flex items-center justify-between animate-fade-in">
            {/* Content Left */}
            <div className="relative z-10 max-w-full md:max-w-[56%] lg:max-w-[52%] xl:max-w-xl text-left">
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

              <p className="text-slate-300 text-sm md:text-base font-semibold max-w-md mb-6 md:mb-7 leading-relaxed">
                From solving tier-2 placement disparities to empowering 50,000+ engineers with AI placement radar, zero-cost blueprints, and mentorship.
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
              </div>
            </div>

            {/* Right Visual: Founder in Neon Ring with Impact Badges */}
            <div className="hidden md:flex absolute right-4 sm:right-6 md:right-8 lg:right-12 top-0 bottom-0 h-full items-center justify-end pointer-events-none select-none z-0">
              <div className="relative h-full flex items-center justify-center py-2 sm:py-3">
                <img 
                  src="/dashboard_hero_founder_exact.png?v=5.0" 
                  alt="Shaik Sowban - Founder, Lumixora" 
                  className="h-full max-h-[94%] w-auto object-contain drop-shadow-[0_15px_45px_rgba(245,158,11,0.35)]"
                />

                {/* Floating Impact Card beside founder */}
                <div className="absolute -left-28 lg:-left-32 top-10 w-44 p-3 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Award className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Mission Impact</span>
                  </div>
                  <div className="text-sm font-black text-white">50,000+ Students</div>
                  <p className="text-[10px] text-gray-400">Guided across 100+ Engineering Colleges</p>
                </div>

                <div className="absolute -left-20 lg:-left-24 bottom-10 w-40 p-2.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-xl shadow-2xl flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold shrink-0">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-white">AI Placement</div>
                    <div className="text-[9px] text-purple-300 font-bold">100% Free Core Access</div>
                  </div>
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

        {/* ── Desktop Prev / Next Slide Arrows ── */}
        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer backdrop-blur-sm"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer backdrop-blur-sm"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* ── WORKABLE CAROUSEL INDICATOR DOTS (Clickable + Active Pill) ── */}
        <div className="absolute left-6 sm:left-8 md:left-10 lg:left-12 bottom-5 sm:bottom-6 z-20 flex items-center gap-2">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                currentSlide === idx
                  ? idx === 1 
                    ? 'w-7 bg-gradient-to-r from-amber-400 to-rose-500 shadow-md shadow-rose-500/50' 
                    : idx === 2 
                    ? 'w-7 bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-md shadow-cyan-500/50'
                    : 'w-7 bg-gradient-to-r from-blue-500 to-purple-500 shadow-md shadow-purple-500/50'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
          <span className="text-[10px] text-slate-400 font-bold ml-1.5 hidden sm:inline-block">
            {currentSlide === 0 ? '1 of 3 • Career' : currentSlide === 1 ? '2 of 3 • Founder\'s Journey' : '3 of 3 • AI Predictor'}
          </span>
        </div>
      </div>

      {/* ─── FOUNDER'S JOURNEY MODAL ─── */}
      {showFounderJourneyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0b0f19] border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl text-left max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setShowFounderJourneyModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-5 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center shadow-xl">
                <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center text-2xl font-black text-amber-300">
                  SS
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">Shaik Sowban</h2>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                    Founder & CEO
                  </span>
                </div>
                <p className="text-xs font-semibold text-purple-400">Creator of Lumixora & AI Placement Commander</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Kurnool, Andhra Pradesh • GPREC Alumnus</p>
              </div>
            </div>

            {/* Story / Mission */}
            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>
                <strong className="text-white">"Every student deserves an equal opportunity to land top-tier tech offers."</strong>
              </p>
              <p>
                Lumixora was born from a simple realization: brilliant engineers in regional colleges often lack access to early placement radar, curated company-specific question sets, and real-time AI interview practice that metro students take for granted.
              </p>
              <p>
                Starting from college dorms and campus labs, Shaik designed and engineered the <strong className="text-purple-300">Lumixora Ecosystem</strong> — integrating 102 verified branch syllabi, 70M AI exam prediction models, direct recruiter drive roadmaps, and full-stack placement commander suites.
              </p>

              {/* Milestones */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 mt-4">
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-400">Milestones & Impact</div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-black/30">
                    <div className="font-black text-white text-base">50,000+</div>
                    <div className="text-gray-400 text-[11px]">Engineering Students</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/30">
                    <div className="font-black text-cyan-400 text-base">500+</div>
                    <div className="text-gray-400 text-[11px]">Recruiter Test Drives</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowFounderJourneyModal(false);
                  if (onNavigateTab) onNavigateTab('ai-commander');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore AI Placement Commander</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowFounderJourneyModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── THE JOURNEY OF INNOVATION (Founder's Vision Card) ─── */}
      <div className="w-full glass-panel bg-gradient-to-r from-white via-indigo-50/30 to-purple-50/40 dark:from-slate-900 dark:via-slate-900/95 dark:to-[#171b36] border border-white/80 dark:border-white/10 rounded-[28px] p-6 sm:p-7 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden flex flex-col justify-between mt-6">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-1.5 h-6 rounded-full bg-purple-600 dark:bg-purple-500"></span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              The Journey of Innovation
            </h2>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 italic pr-0 sm:pr-32 md:pr-48">
            “Every great platform starts with a single problem. For Lumixora, it was the realization that learning shouldn't be a one-size-fits-all struggle. Built from late-night coding sessions and an unwavering belief in personalized education, our mission is to empower every student to reach their peak potential. Your journey to excellence starts here.”
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2 relative z-10">
          <button 
            onClick={() => setShowFounderJourneyModal(true)}
            className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Founder Story</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <img 
          src="/dashboard_journey_book_fade.png" 
          alt="Lumixora Open Book of Innovation" 
          className="hidden sm:block absolute right-0 bottom-0 max-h-36 sm:max-h-40 md:max-h-44 w-auto object-contain pointer-events-none select-none opacity-95 hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
}
