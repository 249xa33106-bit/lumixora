import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, FileText, Bot, Zap, TrendingUp, Building2,
  Sparkles, CheckCircle2, ArrowRight, Lock, GraduationCap,
  Search, ChevronRight, Star, Award, Flame, Sliders, Volume2,
  Briefcase, Check, HelpCircle, RefreshCw, BarChart3, Code2,
  Target, Globe
} from 'lucide-react';
import { POPULAR_CAMPUS_COLLEGES } from '../services/campusAuthService';
import CampusPlacementLoginModal from './CampusPlacementLoginModal';

// Interactive CTC simulator lookup tiers
const CTC_TIERS = [
  {
    minLpa: 3.5,
    maxLpa: 5.0,
    label: '₹3.5 - ₹5.0 LPA',
    tierName: 'Core Mass Recruiter Tier',
    reqCri: '68 / 100',
    prepTime: '20 mins/day',
    companies: ['TCS Ninja', 'Wipro Elite', 'Infosys SE', 'Cognizant GenC'],
    focusAreas: ['Quantitative Aptitude', 'Verbal Ability', 'Basic Logic (Arrays/Strings)']
  },
  {
    minLpa: 5.0,
    maxLpa: 8.0,
    label: '₹5.0 - ₹8.0 LPA',
    tierName: 'Differential Digital Tier',
    reqCri: '78 / 100',
    prepTime: '35 mins/day',
    companies: ['Accenture FSE', 'Infosys DSE', 'TCS Digital', 'Cognizant GenC Next'],
    focusAreas: ['Advanced Coding (Trees/Graphs)', 'SQL Queries', 'Technical Screening']
  },
  {
    minLpa: 8.0,
    maxLpa: 14.0,
    label: '₹8.0 - ₹14.0 LPA',
    tierName: 'Super Dream & Product Tier',
    reqCri: '85 / 100',
    prepTime: '50 mins/day',
    companies: ['TCS Prime', 'Infosys Specialist', 'Zoho Corp', 'Virtusa Tech Lead'],
    focusAreas: ['System Design Basics', 'Dynamic Programming', 'Live Technical Rigor']
  },
  {
    minLpa: 14.0,
    maxLpa: 28.0,
    label: '₹14.0 - ₹28.0 LPA',
    tierName: 'Tier-1 Elite Cloud & Big Tech',
    reqCri: '92 / 100',
    prepTime: '75 mins/day',
    companies: ['Amazon SDE I', 'Adobe', 'ServiceNow', 'Oracle Cloud'],
    focusAreas: ['High-Concurrency DSA', 'Scalability', 'Bar-Raiser Interview Round']
  }
];

// Interactive Micro-Drill Question
const SAMPLE_DRILL = {
  company: 'TCS NQT 2026 / Infosys DSE',
  topic: 'Data Structures & Algorithms',
  question: 'What is the worst-case search time complexity of a Balanced Binary Search Tree (AVL / Red-Black)?',
  options: [
    { id: 'a', text: 'O(N)', correct: false, explanation: 'Incorrect: O(N) is the worst-case for an unbalanced or degenerate tree (like a linked list).' },
    { id: 'b', text: 'O(log N)', correct: true, explanation: 'Correct! Due to strict balance factors, the height is bounded by log₂(N), making searches O(log N).' },
    { id: 'c', text: 'O(1)', correct: false, explanation: 'Incorrect: O(1) average lookup is characteristic of Hash Tables, not Trees.' },
    { id: 'd', text: 'O(N log N)', correct: false, explanation: 'Incorrect: O(N log N) is typical of optimal comparison sorting, not single tree searches.' }
  ]
};

// Top target company pattern explorer
const FEATURED_COMPANIES = [
  {
    id: 'tcs',
    name: 'Tata Consultancy Services',
    short: 'TCS',
    badge: 'NQT 2026',
    ctc: '₹3.36 - ₹9.0 LPA',
    rounds: '3 Rounds (Foundation + Advanced + Interview)',
    color: 'from-blue-500/20 to-indigo-500/10',
    border: 'border-blue-500/30',
    textColor: 'text-blue-400',
    syllabus: 'Numerical, Verbal, Reasoning, 2 Hands-on Coding problems (Python/Java/C++)',
    papersCount: '28 Authentic Tests'
  },
  {
    id: 'infosys',
    name: 'Infosys Limited',
    short: 'Infosys',
    badge: 'SE / DSE / Specialist',
    ctc: '₹3.6 - ₹9.5 LPA',
    rounds: 'Online Assessment + Technical + HR',
    color: 'from-sky-500/20 to-cyan-500/10',
    border: 'border-sky-500/30',
    textColor: 'text-sky-400',
    syllabus: 'Mathematical Ability, Critical Thinking, Hands-on Programming, Pseudocode',
    papersCount: '22 Authentic Tests'
  },
  {
    id: 'accenture',
    name: 'Accenture',
    short: 'Accenture',
    badge: 'ASE / FSE',
    ctc: '₹4.5 - ₹6.5 LPA',
    rounds: 'Cognitive & Technical + Coding + Comm Test',
    color: 'from-purple-500/20 to-pink-500/10',
    border: 'border-purple-500/30',
    textColor: 'text-purple-400',
    syllabus: 'Critical Thinking, English Ability, Abstract Reasoning, Coding (2 Problems)',
    papersCount: '19 Authentic Tests'
  },
  {
    id: 'zoho',
    name: 'Zoho Corporation',
    short: 'Zoho',
    badge: 'Product Dev',
    ctc: '₹6.0 - ₹12.0 LPA',
    rounds: 'Basic C/DSA + Advanced Coding + Tech HR',
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    syllabus: 'Rigorous C/Java Code tracing, Pointers, Recursion, Complex String/Matrix Manipulation',
    papersCount: '16 Authentic Tests'
  },
  {
    id: 'amazon',
    name: 'Amazon India',
    short: 'Amazon',
    badge: 'SDE-1 / AWS',
    ctc: '₹14.0 - ₹28.0 LPA',
    rounds: 'Online OA (2 DSA + Work Style) + 3 Virtual Tech Rounds',
    color: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
    textColor: 'text-amber-400',
    syllabus: 'Dynamic Programming, Trees, Graphs, HashMaps, Leadership Principles',
    papersCount: '14 Authentic Tests'
  }
];

export default function CampusPlacementLanding({ onLoginSuccess }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [targetModule, setTargetModule] = useState(null);

  // College verification state
  const [collegeQuery, setCollegeQuery] = useState('');

  // Interactive CTC Target Simulator State (Index: 0, 1, 2, 3)
  const [ctcTierIndex, setCtcTierIndex] = useState(1); // default ₹5.0 - ₹8.0 LPA
  const activeCtcTier = CTC_TIERS[ctcTierIndex];

  // Interactive 10-Second Micro-Drill State
  const [selectedDrillOption, setSelectedDrillOption] = useState(null);
  const [drillAnswerSubmitted, setDrillAnswerSubmitted] = useState(false);

  // Active Company Pattern Tab
  const [activeCompanyId, setActiveCompanyId] = useState('tcs');
  const activeCompany = useMemo(() => {
    return FEATURED_COMPANIES.find(c => c.id === activeCompanyId) || FEATURED_COMPANIES[0];
  }, [activeCompanyId]);

  const triggerLogin = (moduleKey = null) => {
    setTargetModule(moduleKey);
    setIsLoginModalOpen(true);
  };

  // Check matching college
  const matchedCollege = useMemo(() => {
    if (!collegeQuery.trim()) return null;
    const q = collegeQuery.toLowerCase().trim();
    const found = POPULAR_CAMPUS_COLLEGES.find(c => c.toLowerCase().includes(q));
    if (found) return { name: found, direct: true };
    if (q.length > 2) return { name: collegeQuery.trim().toUpperCase(), direct: false };
    return null;
  }, [collegeQuery]);

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black antialiased font-sans">
      
      {/* ── 1. REAL-TIME NATIONAL HIRING RADAR TICKER ── */}
      <div className="bg-emerald-950/90 border-b border-emerald-500/20 py-2 px-3 sm:px-4 text-xs font-semibold text-emerald-300 overflow-x-auto no-scrollbar shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 min-w-max">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-widest font-black text-white text-[10px]">
              Live Hiring Radar:
            </span>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              🚀 <strong className="text-white">TCS NQT 2026:</strong> Registrations Active • Pattern Loaded
            </span>
            <span className="flex items-center gap-1.5">
              ⚡ <strong className="text-white">Infosys DSE:</strong> 3-Round Assessment Pack Live
            </span>
            <span className="flex items-center gap-1.5">
              🌐 <strong className="text-white">Accenture FSE:</strong> Cognitive & Technical Mock Active
            </span>
            <span className="flex items-center gap-1.5">
              🎯 <strong className="text-white">Zoho Developer:</strong> Round 1 C/DSA Bank Updated
            </span>
          </div>
          <button
            onClick={() => triggerLogin('company-papers')}
            className="text-[11px] text-emerald-300 hover:text-white underline font-bold transition flex items-center gap-1"
          >
            <span>Practice Live Papers</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── 2. EXECUTIVE ULTRA-CLEAN TOP BAR ── */}
      <header className="border-b border-emerald-500/15 bg-[#060A18]/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/40">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  LUMIXORA <span className="text-emerald-400">CAMPUS</span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hidden sm:inline-block">
                  Universal Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Autonomous Career & Placement OS for Higher Education Scholars
              </p>
            </div>
          </div>

          {/* Quick Header CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300 border border-slate-800 bg-slate-900/60 px-3 py-1.5 rounded-xl">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>₹10 Lifetime Verification • Zero Subscriptions</span>
            </div>
            <button
              onClick={() => triggerLogin('campus-commander')}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition active:scale-[0.98]"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── 3. HERO STAGE (TWO-COLUMN ARCHITECTURE) ── */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-800/80">
        {/* Ambient atmospheric radiants */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute -top-32 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column (Hero Content & Interactive Clearance) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Institutional clearance pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open to All Engineering, Technology & University Colleges Across India</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Crack Your Dream Campus Offer with{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Precision.
                </span>
              </h1>

              {/* Body narrative */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                The institutional placement operating system built for scholars from{' '}
                <strong className="text-white">JNTUA, CBIT, VIT, SRM, KL, RGMCET, SRIT</strong> and autonomous universities across India. Master 100+ authenticated company question papers, simulate AI voice interviews, and generate your certified placement dossier.
              </p>

              {/* Instant "Check My College" Clearance Bar */}
              <div className="p-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-xl shadow-black/40 max-w-xl">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-emerald-400 absolute left-3.5" />
                  <input
                    type="text"
                    placeholder="Check your college (e.g. RGMCET, VIT, SRIT, CBIT, JNTUA)..."
                    value={collegeQuery}
                    onChange={(e) => setCollegeQuery(e.target.value)}
                    className="w-full pl-10 pr-24 py-2.5 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => triggerLogin('campus-commander')}
                    className="absolute right-1 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition active:scale-95"
                  >
                    Enter Portal
                  </button>
                </div>

                {/* Real-time Clearance Confirmation */}
                {matchedCollege && (
                  <div className="mt-2 pt-2 border-t border-slate-800 px-2 flex items-center justify-between text-xs animate-in fade-in">
                    <div className="flex items-center gap-2 text-emerald-300 font-semibold truncate">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">
                        <strong>{matchedCollege.name}</strong> is verified & cleared for Lumixora Campus!
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerLogin('campus-commander')}
                      className="text-emerald-400 hover:underline font-bold text-[11px] shrink-0 ml-2"
                    >
                      Verify Now →
                    </button>
                  </div>
                )}
              </div>

              {/* ── 4. TACTILE CTC TARGET SIMULATOR WIDGET ── */}
              <div className="p-4 rounded-2xl bg-[#090D1E]/95 border border-emerald-500/30 shadow-xl space-y-3.5 max-w-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Target Salary & Readiness Calculator
                    </span>
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {activeCtcTier.label}
                  </span>
                </div>

                {/* Range Slider */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="1"
                    value={ctcTierIndex}
                    onChange={(e) => setCtcTierIndex(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                    <span>₹3.5 LPA</span>
                    <span>₹6.5 LPA</span>
                    <span>₹12.0 LPA</span>
                    <span>₹28.0 LPA</span>
                  </div>
                </div>

                {/* Tier details output */}
                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Target Tier</span>
                    <strong className="text-white text-[11px] truncate block">{activeCtcTier.tierName}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Required CRI Score</span>
                    <strong className="text-emerald-400 text-xs font-black block">{activeCtcTier.reqCri}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block font-medium">Daily Workout</span>
                    <strong className="text-cyan-400 text-xs font-bold block">{activeCtcTier.prepTime}</strong>
                  </div>
                </div>

                {/* Target Company Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold mr-1">Matching Companies:</span>
                  {activeCtcTier.companies.map((comp) => (
                    <span
                      key={comp}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-semibold"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Holographic Official Placement Dossier Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-[#0B1026] via-[#080D20] to-[#050814] border border-emerald-500/40 shadow-2xl shadow-emerald-950/60 space-y-5">
                
                {/* Dossier Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <Award className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-white">
                        Official Placement Dossier
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Cryptographic Academic Credential
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                    VERIFIED
                  </span>
                </div>

                {/* CRI Score Visual Ring */}
                <div className="text-center py-2 space-y-1">
                  <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-slate-900/90 border-4 border-emerald-400/80 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                    <div>
                      <div className="text-3xl font-black text-white tracking-tight">84</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                        CRI INDEX
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-2">
                    Tier-1 Placement Ready
                  </div>
                  <p className="text-[11px] text-slate-400">
                    High Probability for TCS Prime, Infosys Specialist & Zoho
                  </p>
                </div>

                {/* Metric Bars */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Quantitative & Logical Aptitude</span>
                      <strong className="text-emerald-400">88%</strong>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[88%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Data Structures & Hands-on Code</span>
                      <strong className="text-teal-400">82%</strong>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 w-[82%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Technical & HR Mock Interview</span>
                      <strong className="text-cyan-400">80%</strong>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 w-[80%]" />
                    </div>
                  </div>
                </div>

                {/* Security Footer & Unlock Action */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>🔒 256-Bit Cryptographic Seal</span>
                    <span>₹10 Nominal Clearance</span>
                  </div>
                  <button
                    onClick={() => triggerLogin('dossier')}
                    className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                  >
                    <Award className="w-4 h-4" />
                    <span>Unlock My Official Dossier (₹10)</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. INTERACTIVE BENTO GRID (4 CORE ENGINES) ── */}
      <section className="py-16 sm:py-20 bg-[#050816] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Complete Placement Arsenal
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Four Core Engines. Zero Guesswork.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Engineered specifically for engineering & technology colleges targeting high-tier placements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            
            {/* ── CARD A: LIVE 10-SECOND COMPANY DRILL (7 COLS) ── */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/70 border border-emerald-500/30 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Interactive Diagnostic Drill
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{SAMPLE_DRILL.company}</span>
                </div>

                <h3 className="text-base font-bold text-white mt-3">
                  {SAMPLE_DRILL.question}
                </h3>
              </div>

              {/* 4 Clickable Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SAMPLE_DRILL.options.map((opt) => {
                  const isSelected = selectedDrillOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedDrillOption(opt.id);
                        setDrillAnswerSubmitted(true);
                      }}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                        drillAnswerSubmitted && opt.correct
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                          : drillAnswerSubmitted && isSelected && !opt.correct
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                          : isSelected
                          ? 'bg-slate-800 border-emerald-500/50 text-white'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {drillAnswerSubmitted && opt.correct && (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic feedback on click */}
              {drillAnswerSubmitted && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 animate-in fade-in space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+25 Placement XP Unlocked!</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {SAMPLE_DRILL.options.find(o => o.id === selectedDrillOption)?.explanation}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Over 10,000+ Verified Practice Questions</span>
                <button
                  onClick={() => triggerLogin('company-papers')}
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Solve Full Exam Packs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── CARD B: AI MOCK INTERVIEW VOICE ROOM (5 COLS) ── */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-teal-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">AI Mock Interview Room</span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-300 bg-teal-500/15 px-2 py-0.5 rounded border border-teal-500/30">
                    Voice & Video AI
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Real-time Technical, HR & Behavioral mock interviews with live acoustic speech analysis and answer grading.
                </p>
              </div>

              {/* Simulated Audio Frequency Visualizer */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Speech Flow Telemetry</span>
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px]">Live 94% Fluency</span>
                </div>

                {/* Animated Audio Wave Bars */}
                <div className="flex items-end justify-center gap-1 h-10 px-2">
                  {[24, 40, 60, 85, 45, 90, 70, 35, 65, 80, 50, 95, 30, 75, 40].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-1.5 rounded-full bg-gradient-to-t from-teal-600 to-emerald-400 animate-pulse"
                    />
                  ))}
                </div>

                <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800">
                  <span>Confidence: <strong>High</strong></span>
                  <span>Filler Words: <strong>&lt; 2%</strong></span>
                  <span>Tech Depth: <strong>8.8 / 10</strong></span>
                </div>
              </div>

              <button
                onClick={() => triggerLogin('interview')}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 flex items-center justify-center gap-2 transition"
              >
                <span>Launch Mock Interview Simulator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ── CARD C: 100+ COMPANY EXAM PAPERS BANK (7 COLS) ── */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>100+ Authenticated Company Exam Papers</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Updated with 2026 exam formats, round rules, and negative marking
                  </p>
                </div>
              </div>

              {/* Company Tabs */}
              <div className="flex flex-wrap gap-2">
                {FEATURED_COMPANIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCompanyId(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeCompanyId === c.id
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.short}
                  </button>
                ))}
              </div>

              {/* Selected Company Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{activeCompany.name}</span>
                  <span className="font-bold text-emerald-400">{activeCompany.ctc}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Rounds:</span> {activeCompany.rounds}
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Syllabus:</span> {activeCompany.syllabus}
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                  <span>Available: <strong className="text-emerald-400">{activeCompany.papersCount}</strong></span>
                  <button
                    onClick={() => triggerLogin('company-papers')}
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    Start Drill →
                  </button>
                </div>
              </div>
            </div>

            {/* ── CARD D: TECHPULSE™ HIRING RADAR (5 COLS) ── */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">TechPulse™ Hiring Radar</span>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">
                    Live Updates
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Continuous intelligence feed monitoring fresher job postings, test announcements, and off-campus recruitment drives across India.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="font-medium text-slate-200">TCS National Qualifier Test 2026</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="font-medium text-slate-200">Infosys Specialist Programmer</span>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">Announced</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="font-medium text-slate-200">Zoho Off-Campus Developer Drive</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Scheduled</span>
                </div>
              </div>

              <button
                onClick={() => triggerLogin('tech-pulse')}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2 transition"
              >
                <span>View Full Hiring Radar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. THE TRUST VAULT: NOMINAL ₹10 LIFETIME CLEARANCE ── */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#050816] to-[#040612] border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Zero Exploitation Policy
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              One-Time Academic Verification Fee: ₹10
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              We reject recurring multi-thousand rupee course subscriptions. A nominal ₹10 cryptographic verification fee keeps the platform spam-free and grants full lifetime access across all 4 years.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#090E24] via-slate-900 to-[#060A1A] border border-emerald-500/40 shadow-2xl text-left space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Lifetime Academic Access Pass
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Universal Placement Operating System
                </h3>
              </div>
              <div className="sm:text-right">
                <div className="text-3xl font-black text-emerald-300">₹10.00</div>
                <span className="text-xs text-slate-400 font-semibold">One-time payment • Lifetime validity</span>
              </div>
            </div>

            {/* Inclusions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100+ Verified Company Question Papers & Solutions</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI Voice & Video Mock Interview Simulator</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-Click Official Printable Placement Dossier</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time National TechPulse Hiring Radar Feed</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Timed Aptitude & Reasoning Speed Arena</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Google Pay / PhonePe / Paytm / Razorpay Unlock</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => triggerLogin('checkout')}
                className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transition active:scale-[0.98]"
              >
                <ShieldCheck className="w-5 h-5 text-slate-950" />
                <span>Activate Lifetime Campus Access (₹10)</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
              <span>🔒 256-Bit SSL End-to-End Encryption</span>
              <span>⚡ Direct Bank UPI Settlement</span>
              <span>🛡️ Anti-Spam Verified Scholar Identity</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. FOOTER ── */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#040612] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">LUMIXORA CAMPUS</span>
            <span>• Universal Placement Operating System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>SSL Secured</span>
            <span>Anti-Bot Shielded</span>
            <span>lumixora.team@gmail.com</span>
          </div>
        </div>
      </footer>

      {/* ── LOGIN & VERIFICATION MODAL ── */}
      <CampusPlacementLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(scholar) => {
          setIsLoginModalOpen(false);
          if (onLoginSuccess) {
            onLoginSuccess(scholar);
          }
        }}
      />
    </div>
  );
}
