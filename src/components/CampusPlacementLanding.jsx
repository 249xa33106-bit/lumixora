import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, FileText, Bot, Zap, TrendingUp, Building2,
  Sparkles, CheckCircle2, ArrowRight, Lock, GraduationCap,
  Search, ChevronRight, Star, Award, Flame, Sliders, Volume2,
  Briefcase, Check, HelpCircle, RefreshCw, BarChart3, Code2,
  Target, Globe, ChevronDown, ChevronUp, UserCheck, X, ThumbsUp
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

// Interactive Micro-Drill Questions with multi-switch capability
const SAMPLE_DRILLS = [
  {
    id: 1,
    company: 'TCS NQT 2026',
    topic: 'Data Structures & Algorithms',
    badge: 'Advanced Coding',
    question: 'What is the worst-case search time complexity of a Balanced Binary Search Tree (AVL / Red-Black)?',
    options: [
      { id: 'a', text: 'O(N)', correct: false, explanation: 'Incorrect: O(N) is the worst-case for an unbalanced or degenerate tree (like a linked list).' },
      { id: 'b', text: 'O(log N)', correct: true, explanation: 'Correct! Due to strict balance factors, the height is bounded by log₂(N), making searches O(log N).' },
      { id: 'c', text: 'O(1)', correct: false, explanation: 'Incorrect: O(1) average lookup is characteristic of Hash Tables, not Trees.' },
      { id: 'd', text: 'O(N log N)', correct: false, explanation: 'Incorrect: O(N log N) is typical of optimal comparison sorting, not single tree searches.' }
    ]
  },
  {
    id: 2,
    company: 'Infosys DSE',
    topic: 'Quantitative & Logic',
    badge: 'Round 1 Aptitude',
    question: 'A pipe can fill a reservoir in 6 hours, while an outlet empties it in 8 hours. If both open together, how long to fill?',
    options: [
      { id: 'a', text: '14 Hours', correct: false, explanation: 'Incorrect: Rates do not simply add directly as hours.' },
      { id: 'b', text: '24 Hours', correct: true, explanation: 'Correct! Net rate = 1/6 - 1/8 = (4-3)/24 = 1/24 per hour. Thus, exactly 24 hours.' },
      { id: 'c', text: '18 Hours', correct: false, explanation: 'Incorrect: Common arithmetic mistake when calculating the LCM of 6 and 8.' },
      { id: 'd', text: '12 Hours', correct: false, explanation: 'Incorrect: 12 hours would require a faster net filling rate.' }
    ]
  },
  {
    id: 3,
    company: 'Zoho Developer',
    topic: 'Core C & Pointer Tracing',
    badge: 'Technical Round 1',
    question: 'In C, what is the value of *arr if int arr[] = {10, 20, 30}; int *p = arr; (*p)++; ?',
    options: [
      { id: 'a', text: '20', correct: false, explanation: 'Incorrect: (*p)++ increments the value pointed to by p, not the pointer address itself.' },
      { id: 'b', text: '11', correct: true, explanation: 'Correct! Dereferencing *p yields 10, then the postfix ++ modifies arr[0] in place to 11.' },
      { id: 'c', text: '10', correct: false, explanation: 'Incorrect: The value at arr[0] is modified in memory by the post-increment operator.' },
      { id: 'd', text: 'Garbage Value', correct: false, explanation: 'Incorrect: p points to a valid stack-allocated array segment.' }
    ]
  }
];

// Top target company pattern explorer with authentic previous year question teasers
const FEATURED_COMPANIES = [
  {
    id: 'tcs',
    name: 'Tata Consultancy Services',
    short: 'TCS',
    badge: 'NQT 2026 Active',
    ctc: '₹3.36 - ₹9.0 LPA',
    rounds: '3 Rounds (Foundation + Advanced + Technical HR)',
    color: 'from-blue-500/20 to-indigo-500/10',
    border: 'border-blue-500/30',
    textColor: 'text-blue-400',
    syllabus: 'Numerical Ability (20 Qs), Verbal Ability (25 Qs), Reasoning Ability (20 Qs), 2 Hands-on Coding Problems (60 mins)',
    papersCount: '28 Authentic Tests',
    sampleQuestion: {
      type: 'Hands-on Coding (Python / Java / C++)',
      title: 'Subarray with Max Prime Factor Product',
      statement: 'Given an array of integers, find the contiguous subarray whose elements yield the maximum distinct prime factor product modulo 10^9+7.',
      approach: 'Precompute primes up to 10^6 using Sieve of Eratosthenes, then utilize a sliding window with frequency hashmap for O(N) linear scan.'
    }
  },
  {
    id: 'infosys',
    name: 'Infosys Limited',
    short: 'Infosys',
    badge: 'SE / DSE / Specialist',
    ctc: '₹3.6 - ₹9.5 LPA',
    rounds: 'Online Assessment (3 Programing Qs) + Technical + HR',
    color: 'from-sky-500/20 to-cyan-500/10',
    border: 'border-sky-500/30',
    textColor: 'text-sky-400',
    syllabus: 'Critical Thinking, Pseudocode Output Tracing, 3 Programming Problems (Easy, Medium, Hard DP/Graph)',
    papersCount: '22 Authentic Tests',
    sampleQuestion: {
      type: 'Advanced Pseudocode Tracing',
      title: 'Recursive Bitwise XOR Traversal',
      statement: 'Trace execution of recursive tree function with bitwise bitmask flags where recursion depth exceeds 10^4.',
      approach: 'Convert bitmask states to memoized 2D DP matrix to avoid call-stack overflow and achieve O(1) state lookup.'
    }
  },
  {
    id: 'accenture',
    name: 'Accenture',
    short: 'Accenture',
    badge: 'ASE / FSE',
    ctc: '₹4.5 - ₹6.5 LPA',
    rounds: 'Cognitive & Technical + Coding (2 Qs) + Communication Assessment',
    color: 'from-purple-500/20 to-pink-500/10',
    border: 'border-purple-500/30',
    textColor: 'text-purple-400',
    syllabus: 'Critical Thinking (18 Qs), Abstract Reasoning (17 Qs), English (17 Qs), Coding: 2 problems (45 mins)',
    papersCount: '19 Authentic Tests',
    sampleQuestion: {
      type: 'Coding Problem',
      title: 'Password Security & String Transformation',
      statement: 'Transform string by shifting consonants by ASCII offset of preceding vowel count, ignoring special characters.',
      approach: 'Two-pass buffer scan tracking cumulative vowel counters with modulo 26 alphabetic wrapping.'
    }
  },
  {
    id: 'zoho',
    name: 'Zoho Corporation',
    short: 'Zoho',
    badge: 'Product Developer',
    ctc: '₹6.0 - ₹12.0 LPA',
    rounds: 'Round 1: C/DSA Tracing + Round 2: Advanced Coding + Round 3: App Dev',
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    syllabus: 'Intense C Code Tracing, Pointers, Memory Layout, Complex String/Matrix Manipulation, Mini-Console App Dev',
    papersCount: '16 Authentic Tests',
    sampleQuestion: {
      type: 'Core Pointer & Memory Tracing',
      title: 'Multi-Dimensional Pointer Dereferencing',
      statement: 'Determine the exact stdout value of *(*(p + i) + j) with dynamically reallocated jagged matrix pointer buffers.',
      approach: 'Draw memory layout diagram; calculate row-major stride offsets against row base pointers.'
    }
  },
  {
    id: 'amazon',
    name: 'Amazon India',
    short: 'Amazon',
    badge: 'SDE-1 / AWS',
    ctc: '₹14.0 - ₹28.0 LPA',
    rounds: 'Online OA (2 DSA + Work Style Survey) + 3 Virtual Technical Bar-Raiser Rounds',
    color: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
    textColor: 'text-amber-400',
    syllabus: 'Dynamic Programming, Trees, Graphs, HashMaps, Sliding Window, Amazon Leadership Principles (Customer Obsession, Ownership)',
    papersCount: '14 Authentic Tests',
    sampleQuestion: {
      type: 'System Algorithm & Bar Raiser',
      title: 'Warehouse Routing with Constrained Battery Capacity',
      statement: 'Given graph of distribution centers with varying charging speeds, compute minimal total transit time with battery constraints.',
      approach: 'Modified Dijkstra algorithm with 2D state space: (node_id, current_battery_level) stored in min-heap priority queue.'
    }
  }
];

// Frequently Asked Questions
const CAMPUS_FAQS = [
  {
    q: 'Is Lumixora Campus open to students from all universities & colleges?',
    a: 'Yes, absolutely. While GPREC has a dedicated isolated subdomain, Lumixora Campus is open to students from JNTUA, JNTUK, JNTUH, SVUCE, CBIT, VIT, SRM, KL, RGMCET, SRIT, and all government, autonomous, and private engineering institutions across India.'
  },
  {
    q: 'What is the one-time ₹10 verification fee, and are there any recurring charges?',
    a: 'There are ZERO recurring subscriptions. The nominal ₹10 fee is a one-time cryptographic identity verification clearance. It prevents automated bot spam and unlocks lifetime full access across all 4 years to 100+ company exam packs, AI mock interviews, and your official dossier.'
  },
  {
    q: 'How are the company question papers compiled?',
    a: 'Every test pack is authenticated and reconstructed based on genuine recent exam memory logs, official recruitment syllabi, and verified candidate assessment submissions from 2024 to 2026 hiring drives.'
  },
  {
    q: 'What is the Campus Readiness Index (CRI) on the Placement Dossier?',
    a: 'The CRI is a 0–100 benchmark metric derived from your performance across Quantitative Aptitude, Technical Hands-on Coding, AI Mock Interview ratings, and ATS Resume strength. Recruiters look for a CRI above 75 for differential digital and product roles.'
  }
];

export default function CampusPlacementLanding({ onLoginSuccess, onEnterPortal, onLoginClick }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [targetModule, setTargetModule] = useState(null);

  // College verification state
  const [collegeQuery, setCollegeQuery] = useState('');

  // Interactive CTC Target Simulator State (Index: 0, 1, 2, 3)
  const [ctcTierIndex, setCtcTierIndex] = useState(1); // default ₹5.0 - ₹8.0 LPA
  const activeCtcTier = CTC_TIERS[ctcTierIndex];

  // Interactive Micro-Drill State
  const [activeDrillIndex, setActiveDrillIndex] = useState(0);
  const currentDrill = SAMPLE_DRILLS[activeDrillIndex];
  const [selectedDrillOption, setSelectedDrillOption] = useState(null);
  const [drillAnswerSubmitted, setDrillAnswerSubmitted] = useState(false);
  const [solvedDrillsCount, setSolvedDrillsCount] = useState(0);

  // Active Company Pattern Tab
  const [activeCompanyId, setActiveCompanyId] = useState('tcs');
  const [showSampleApproach, setShowSampleApproach] = useState(false);
  const activeCompany = useMemo(() => {
    return FEATURED_COMPANIES.find(c => c.id === activeCompanyId) || FEATURED_COMPANIES[0];
  }, [activeCompanyId]);

  // FAQ Accordion Open State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const triggerLogin = (moduleKey = null) => {
    setTargetModule(moduleKey);
    if (onLoginClick) onLoginClick();
    if (onEnterPortal) onEnterPortal(moduleKey);
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
    <div className="min-h-screen bg-[#020608] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 antialiased font-sans">
      
      {/* ── 1. REAL-TIME NATIONAL HIRING RADAR TICKER (JADE & GOLD ACCENTS) ── */}
      <div className="bg-[#03140F]/95 border-b border-amber-500/25 py-2 px-3 sm:px-4 text-xs font-semibold text-emerald-300 overflow-x-auto no-scrollbar shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 min-w-max">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="uppercase tracking-widest font-black text-amber-300 text-[10px]">
              Live Hiring Radar:
            </span>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              🚀 <strong className="text-white">TCS NQT 2026:</strong> Registrations Active • <span className="text-amber-300 font-semibold">Pattern Loaded</span>
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
            className="text-[11px] text-amber-300 hover:text-white underline font-bold transition flex items-center gap-1"
          >
            <span>Practice Live Papers</span>
            <ArrowRight className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      </div>

      {/* ── 2. EXECUTIVE ULTRA-CLEAN TOP BAR (JADE & GOLD SHEEN) ── */}
      <header className="border-b border-emerald-500/20 bg-[#040C10]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Identity - Kept Exact Official Icon & Typography */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  LUMIXORA <span className="text-emerald-400">CAMPUS</span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/35 hidden sm:inline-block">
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
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300 border border-amber-500/20 bg-[#061414]/70 px-3 py-1.5 rounded-xl">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>₹10 Lifetime Verification • Zero Subscriptions</span>
            </div>
            <button
              onClick={() => triggerLogin('campus-commander')}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 hover:from-emerald-400 hover:to-amber-200 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 border border-amber-400/30 transition active:scale-[0.98]"
            >
              <GraduationCap className="w-4 h-4 text-slate-950" />
              <span>Student Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── 3. HERO STAGE (JADE & GOLD DUAL ATMOSPHERIC GLOW) ── */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-emerald-950/80">
        {/* Ambient atmospheric radiants */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[520px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14),rgba(245,158,11,0.06),rgba(0,0,0,0))] pointer-events-none" />
        <div className="absolute -top-32 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column (Hero Content & Interactive Clearance) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Institutional clearance pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Open to All Engineering, Technology & Autonomous Colleges</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Crack Your Dream Campus Offer with{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  Precision.
                </span>
              </h1>

              {/* Body narrative */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                The autonomous placement operating system engineered for students from{' '}
                <strong className="text-white">JNTUA, CBIT, VIT, SRM, KL, RGMCET, SRIT</strong> and higher education institutions across India. Solve 100+ authenticated company question papers, simulate AI voice interviews, and generate your official placement dossier.
              </p>

              {/* Instant "Check My College" Clearance Bar */}
              <div className="p-2 bg-[#061114]/90 border border-emerald-500/30 rounded-2xl shadow-xl shadow-black/50 max-w-xl">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-amber-400 absolute left-3.5" />
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
                    className="absolute right-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-slate-950 font-black text-xs transition active:scale-95"
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
                      className="text-amber-400 hover:underline font-bold text-[11px] shrink-0 ml-2"
                    >
                      Verify Now →
                    </button>
                  </div>
                )}
              </div>

              {/* ── 4. TACTILE CTC TARGET SIMULATOR WIDGET (CHAMPAGNE GOLD TIER OUTPUT) ── */}
              <div className="p-4 rounded-2xl bg-[#061015]/95 border border-amber-500/25 shadow-xl space-y-3.5 max-w-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Target Salary & Readiness Calculator
                    </span>
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/35">
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
                    className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
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
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-amber-500/20">
                    <span className="text-[10px] text-slate-400 block font-medium">Required CRI Score</span>
                    <strong className="text-amber-400 text-xs font-black block">{activeCtcTier.reqCri}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-emerald-500/20 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block font-medium">Daily Workout</span>
                    <strong className="text-emerald-300 text-xs font-bold block">{activeCtcTier.prepTime}</strong>
                  </div>
                </div>

                {/* Target Company Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold mr-1">Matching Companies:</span>
                  {activeCtcTier.companies.map((comp) => (
                    <span
                      key={comp}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[10px] font-semibold"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Holographic Official Placement Dossier Card (PRESTIGE GOLD SEAL) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-[#081318] via-[#050E13] to-[#020508] border border-amber-500/35 shadow-2xl shadow-emerald-950/70 space-y-5">
                
                {/* Dossier Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center">
                      <Award className="w-4 h-4 text-amber-400" />
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
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 font-mono text-[10px] font-black">
                    ★ VERIFIED
                  </span>
                </div>

                {/* CRI Score Visual Ring (WARM CHAMPAGNE GOLD GLOW) */}
                <div className="text-center py-2 space-y-1">
                  <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-amber-400/85 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
                    <div>
                      <div className="text-3xl font-black text-white tracking-tight">84</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-amber-400">
                        CRI INDEX
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-black text-amber-200 mt-2 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Tier-1 Placement Ready</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    High Probability for TCS Prime, Infosys Specialist & Zoho
                  </p>
                </div>

                {/* Metric Bars */}
                <div className="space-y-2.5 pt-1 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Quantitative & Logical Aptitude</span>
                      <strong className="text-emerald-400 font-bold">88%</strong>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[88%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Data Structures & Hands-on Code</span>
                      <strong className="text-amber-400 font-bold">82%</strong>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 w-[82%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Technical & HR Mock Interview</span>
                      <strong className="text-teal-400 font-bold">80%</strong>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-300 w-[80%]" />
                    </div>
                  </div>
                </div>

                {/* Security Footer & Unlock Action */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>256-Bit Cryptographic Seal</span>
                    </span>
                    <span className="text-amber-300 font-bold">₹10 Nominal Clearance</span>
                  </div>
                  <button
                    onClick={() => triggerLogin('dossier')}
                    className="w-full py-3 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 hover:from-emerald-400 hover:to-amber-200 text-slate-950 flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-[0.98] border border-amber-400/30"
                  >
                    <Award className="w-4 h-4 text-slate-950" />
                    <span>Unlock My Official Dossier (₹10)</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. INTERACTIVE BENTO GRID (4 CORE ENGINES) ── */}
      <section className="py-16 sm:py-20 bg-[#03090D] border-b border-emerald-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Interactive Placement Sandbox
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Test Real Questions. Inspect Real Patterns.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Engineered with zero fluff: practice live questions right from this page before stepping into the portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            
            {/* ── CARD A: MULTI-QUESTION DIAGNOSTIC DRILL (7 COLS) ── */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#061115]/80 border border-emerald-500/30 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Drill #{currentDrill.id} of {SAMPLE_DRILLS.length}
                    </span>
                    <span className="text-xs font-bold text-white">{currentDrill.company}</span>
                  </div>
                  
                  {/* Switcher Buttons */}
                  <div className="flex items-center gap-1.5">
                    {SAMPLE_DRILLS.map((d, idx) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setActiveDrillIndex(idx);
                          setSelectedDrillOption(null);
                          setDrillAnswerSubmitted(false);
                        }}
                        className={`w-6 h-6 rounded-lg text-xs font-bold transition ${
                          activeDrillIndex === idx
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {d.id}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-amber-400 font-semibold">
                  Topic: {currentDrill.topic} • {currentDrill.badge}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mt-1 leading-snug">
                  {currentDrill.question}
                </h3>
              </div>

              {/* 4 Clickable Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentDrill.options.map((opt) => {
                  const isSelected = selectedDrillOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedDrillOption(opt.id);
                        setDrillAnswerSubmitted(true);
                        if (opt.correct) setSolvedDrillsCount(c => c + 1);
                      }}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                        drillAnswerSubmitted && opt.correct
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                          : drillAnswerSubmitted && isSelected && !opt.correct
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                          : isSelected
                          ? 'bg-slate-800 border-amber-500/50 text-white'
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
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{currentDrill.options.find(o => o.id === selectedDrillOption)?.correct ? 'Correct! +25 Placement XP' : 'Analysis Breakdown:'}</span>
                    </span>
                    <button
                      onClick={() => {
                        const nextIdx = (activeDrillIndex + 1) % SAMPLE_DRILLS.length;
                        setActiveDrillIndex(nextIdx);
                        setSelectedDrillOption(null);
                        setDrillAnswerSubmitted(false);
                      }}
                      className="text-amber-400 hover:underline font-bold text-[11px]"
                    >
                      Next Question →
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {currentDrill.options.find(o => o.id === selectedDrillOption)?.explanation}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">10,000+ Authenticated Exam Questions</span>
                <button
                  onClick={() => triggerLogin('company-papers')}
                  className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Solve Full Exam Packs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── CARD B: AI MOCK INTERVIEW VOICE ROOM (5 COLS) ── */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#061115]/80 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">AI Mock Interview Room</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
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
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Speech Flow Telemetry</span>
                  </span>
                  <span className="text-amber-400 font-bold text-[11px]">Live 94% Fluency</span>
                </div>

                {/* Animated Audio Wave Bars (Jade & Gold Pulse) */}
                <div className="flex items-end justify-center gap-1 h-10 px-2">
                  {[24, 40, 60, 85, 45, 90, 70, 35, 65, 80, 50, 95, 30, 75, 40].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-1.5 rounded-full bg-gradient-to-t from-emerald-600 via-teal-400 to-amber-300 animate-pulse"
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
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-2 transition"
              >
                <span>Launch Mock Interview Simulator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ── CARD C: 100+ COMPANY EXAM PAPERS BANK (7 COLS) ── */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#061115]/80 border border-slate-800 shadow-xl space-y-4">
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
                    onClick={() => {
                      setActiveCompanyId(c.id);
                      setShowSampleApproach(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeCompanyId === c.id
                        ? 'bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-black shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.short}
                  </button>
                ))}
              </div>

              {/* Selected Company Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{activeCompany.name}</span>
                  <span className="font-black text-amber-300">{activeCompany.ctc}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Rounds:</span> {activeCompany.rounds}
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Syllabus:</span> {activeCompany.syllabus}
                </div>

                {/* Expandable Real Sample Question Teaser */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowSampleApproach(!showSampleApproach)}
                    className="flex items-center gap-1.5 text-amber-400 hover:underline font-bold text-xs"
                  >
                    <span>{showSampleApproach ? '▲ Hide Sample Question' : '▼ Inspect Real Exam Question & Approach'}</span>
                  </button>

                  {showSampleApproach && (
                    <div className="p-3 rounded-xl bg-[#081518] border border-amber-500/30 space-y-2 animate-in fade-in">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-bold text-white">{activeCompany.sampleQuestion.type}</span>
                        <span className="text-amber-400 font-mono">Recent 2026 Test</span>
                      </div>
                      <div className="text-white font-semibold text-xs">{activeCompany.sampleQuestion.title}</div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{activeCompany.sampleQuestion.statement}</p>
                      <div className="text-[11px] text-amber-300/90 pt-1 border-t border-slate-800 font-mono">
                        💡 <strong>Optimal Approach:</strong> {activeCompany.sampleQuestion.approach}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-1 flex justify-between items-center text-[11px] text-slate-400">
                  <span>Available: <strong className="text-emerald-400">{activeCompany.papersCount}</strong></span>
                  <button
                    onClick={() => triggerLogin('company-papers')}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    Start Full Drill →
                  </button>
                </div>
              </div>
            </div>

            {/* ── CARD D: TECHPULSE™ HIRING RADAR (5 COLS) ── */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#061115]/80 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">TechPulse™ Hiring Radar</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
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
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Announced</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="font-medium text-slate-200">Zoho Off-Campus Developer Drive</span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">Scheduled</span>
                </div>
              </div>

              <button
                onClick={() => triggerLogin('tech-pulse')}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-2 transition"
              >
                <span>View Full Hiring Radar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. 4-STAGE PLACEMENT ROADMAP (ALTERNATING JADE & GOLD) ── */}
      <section className="py-16 sm:py-20 bg-[#020608] border-b border-emerald-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Clear Path to Placement
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              From Zero to Placed in 4 Phases
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Structured preparation eliminates randomness and replaces it with calibrated progress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#061114]/70 border border-emerald-500/30 hover:border-emerald-400 transition space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm border border-emerald-500/30">
                01
              </div>
              <h4 className="text-sm font-bold text-white">College Clearance & Audit</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bind your college USN/Roll Number and complete the 15-minute diagnostic test to establish your initial CRI score.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#061114]/70 border border-amber-500/30 hover:border-amber-400 transition space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-sm border border-amber-500/30">
                02
              </div>
              <h4 className="text-sm font-bold text-white">Target Company Mastery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Solve authenticated question packs for TCS, Infosys, Zoho, or Accenture with timed speed rounds and answer keys.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#061114]/70 border border-emerald-500/30 hover:border-emerald-400 transition space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm border border-emerald-500/30">
                03
              </div>
              <h4 className="text-sm font-bold text-white">AI Voice & Video Mock</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulate real Technical and HR interviews with instant grading on fluency, filler words, and technical depth.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#061114]/70 border border-amber-500/30 hover:border-amber-400 transition space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-sm border border-amber-500/30">
                04
              </div>
              <h4 className="text-sm font-bold text-white">Official Placement Dossier</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate your verifiable, cryptographic placement dossier to showcase to recruiters and TPO coordinators.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. BEFORE VS AFTER COMPARISON ── */}
      <section className="py-16 sm:py-20 bg-[#03090D] border-b border-emerald-950/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              The Placement Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Why Autonomous Preparation Wins
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-rose-500/20 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
                <X className="w-5 h-5" />
                <span>The Traditional Placement Struggle</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Scattered, unverified PDFs across WhatsApp & Telegram with wrong answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Outdated 2019 patterns that don't match the 2026 adaptive test rules</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Blank or non-ATS resumes rejected before any human reviewer sees them</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Expensive course subscriptions costing ₹10,000 to ₹30,000 with zero personal feedback</span>
                </li>
              </ul>
            </div>

            {/* The Lumixora Campus Way (JADE & GOLD FINISH) */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#071518] via-[#050E12] to-[#020508] border border-amber-500/35 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>With Lumixora Campus</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>100+ Authenticated company exam packs with step-by-step verified solutions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>CRI telemetry that tracks your exact clearance readiness for ₹3.5 to ₹28 LPA roles</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>AI voice simulator that trains you against actual Technical & HR pressure questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-amber-200 font-semibold">Nominal ₹10 one-time academic clearance with full 4-year lifetime validity</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ── 8. FREQUENTLY ASKED QUESTIONS (ACCORDION) ── */}
      <section className="py-16 sm:py-20 bg-[#020608] border-b border-emerald-950/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {CAMPUS_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#061114]/70 border border-slate-800 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-amber-300 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 9. THE TRUST VAULT: NOMINAL ₹10 LIFETIME CLEARANCE (GOLD ACCENT) ── */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#03090D] to-[#010405] border-b border-emerald-950/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Zero Exploitation Policy
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              One-Time Academic Verification Fee: ₹10
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              We reject recurring multi-thousand rupee course subscriptions. A nominal ₹10 cryptographic verification fee keeps the platform spam-free and grants full lifetime access across all 4 years.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#081519] via-[#050E12] to-[#020508] border border-amber-500/40 shadow-2xl text-left space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Lifetime Academic Access Pass
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Universal Placement Operating System
                </h3>
              </div>
              <div className="sm:text-right">
                <div className="text-3xl font-black text-amber-300">₹10.00</div>
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
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-amber-200 font-semibold">Instant Google Pay / PhonePe / Paytm / Razorpay Unlock</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => triggerLogin('checkout')}
                className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 hover:from-emerald-400 hover:to-amber-200 text-slate-950 flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/15 transition active:scale-[0.98] border border-amber-400/40"
              >
                <ShieldCheck className="w-5 h-5 text-slate-950" />
                <span>Activate Lifetime Campus Access (₹10)</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>256-Bit SSL End-to-End Encryption</span>
              </span>
              <span>⚡ Direct Bank UPI Settlement</span>
              <span>🛡️ Anti-Spam Verified Scholar Identity</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 10. FOOTER ── */}
      <footer className="mt-auto border-t border-emerald-950/80 bg-[#010406] py-8 text-center text-xs text-slate-500">
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
