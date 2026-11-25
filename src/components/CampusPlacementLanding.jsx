import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, FileText, Code2, Bot, Award, Zap,
  TrendingUp, CheckCircle2, ArrowRight, Lock, Users, Sparkles,
  Building2, GraduationCap, ChevronRight, Compass, Search,
  Briefcase, Check, Clock, AlertCircle, ExternalLink
} from 'lucide-react';
import { POPULAR_CAMPUS_COLLEGES } from '../services/campusAuthService';

export default function CampusPlacementLanding({
  onLoginClick,
  onEnterPortal
}) {
  const [collegeQuery, setCollegeQuery] = useState('');
  const [selectedCompanyTab, setSelectedCompanyTab] = useState('tcs');

  const triggerLogin = (target = 'campus-commander') => {
    if (onEnterPortal) {
      onEnterPortal(target);
    } else if (onLoginClick) {
      onLoginClick();
    }
  };

  // Live "Check My College" Matcher
  const matchedCollege = useMemo(() => {
    if (!collegeQuery || collegeQuery.trim().length < 2) return null;
    const q = collegeQuery.toLowerCase().trim();
    const found = POPULAR_CAMPUS_COLLEGES.find(c => c.toLowerCase().includes(q));
    if (found) return { name: found, isRegistered: true };
    return { name: collegeQuery.trim(), isRegistered: true, isCustom: true };
  }, [collegeQuery]);

  // Company Exam Patterns & CTC Breakdown
  const COMPANY_PATTERNS = [
    {
      id: 'tcs',
      name: 'Tata Consultancy Services',
      shortName: 'TCS',
      roles: 'Ninja • Digital • Prime',
      ctc: '₹3.36 - ₹9.0 LPA',
      rounds: [
        { name: 'Round 1: Cognitive Assessment', details: 'Quants (20Q), Logical (20Q), Verbal (25Q) • 75 Mins' },
        { name: 'Round 2: Advanced Coding', details: '2 DSA Problems (Arrays, Strings, Recursion) • 90 Mins' },
        { name: 'Round 3: Technical & HR', details: 'OOPs, DBMS, System Basics & Behavioral Interview' }
      ],
      tag: 'Mass Hiring & Prime Tech'
    },
    {
      id: 'infosys',
      name: 'Infosys Limited',
      shortName: 'Infosys',
      roles: 'Systems Engineer • DSE • Specialist',
      ctc: '₹3.6 - ₹9.5 LPA',
      rounds: [
        { name: 'Round 1: Online Assessment', details: 'Reasoning (15Q), Mathematical (10Q), Verbal (20Q), Pseudocode (5Q), Puzzle (4Q)' },
        { name: 'Round 2: Technical Interview', details: 'DSA, Project Defense, SQL Queries, Problem Solving' },
        { name: 'Round 3: HR Discussion', details: 'Communication, Flexibility, Relocation & Behavioral' }
      ],
      tag: 'Tier-1 & DSE Roles'
    },
    {
      id: 'accenture',
      name: 'Accenture India',
      shortName: 'Accenture',
      roles: 'ASE (Associate SE) • FSE',
      ctc: '₹4.5 - ₹6.5 LPA',
      rounds: [
        { name: 'Round 1: Cognitive & Technical', details: 'Critical Thinking (50Q) + Pseudocode, Cloud Basics (40Q)' },
        { name: 'Round 2: Coding Assessment', details: '2 Medium Problems (C++, Java, Python) • 45 Mins' },
        { name: 'Round 3: Communication Assessment', details: 'AI Automated Speech & Sentence Fluency Test' }
      ],
      tag: 'Cognitive & Cloud'
    },
    {
      id: 'cognizant',
      name: 'Cognizant Technology Solutions',
      shortName: 'Cognizant',
      roles: 'GenC • GenC Next • GenC Pro',
      ctc: '₹4.0 - ₹6.75 LPA',
      rounds: [
        { name: 'Round 1: Aptitude & Reasoning', details: 'Quantitative, Analytical & Verbal Reasoning (50 Mins)' },
        { name: 'Round 2: Hands-on Coding', details: '2 Competitive Programming Questions (Arrays, Matrices, HashMaps)' },
        { name: 'Round 3: Technical & HR Voice', details: 'CS Fundamentals & Communication Evaluation' }
      ],
      tag: 'GenC & Next Tracks'
    },
    {
      id: 'zoho',
      name: 'Zoho Corporation',
      shortName: 'Zoho',
      roles: 'Software Developer • Member Technical Staff',
      ctc: '₹6.0 - ₹12.0 LPA',
      rounds: [
        { name: 'Round 1: Flowcharts & Basic C/Java', details: 'Code Tracing, Flowcharts, Pointers & Recursion (25Q)' },
        { name: 'Round 2: Advanced Coding', details: '5 In-depth Programming Problems (Strings, 2D Arrays, Logic)' },
        { name: 'Round 3: Application Design', details: 'Mini Console App System Design (e.g. Railway Booking, ATM System)' }
      ],
      tag: 'Product Engineering'
    },
    {
      id: 'amazon',
      name: 'Amazon Web Services',
      shortName: 'Amazon',
      roles: 'SDE-1 • Cloud Support Associate',
      ctc: '₹14.0 - ₹28.0 LPA',
      rounds: [
        { name: 'Round 1: Online Assessment (OA)', details: '2 LeetCode Medium/Hard DSA Problems + Work Simulation' },
        { name: 'Round 2: Data Structures & Algorithms', details: 'Trees, Graphs, DP & Space-Time Complexity' },
        { name: 'Round 3: Leadership Principles & System', details: 'Amazon 16 LPs + Low-Level System Design' }
      ],
      tag: 'Product Giant'
    }
  ];

  const currentPattern = COMPANY_PATTERNS.find(c => c.id === selectedCompanyTab) || COMPANY_PATTERNS[0];

  const FEATURES = [
    {
      id: 'company-papers',
      title: '100+ Company Placement Papers',
      desc: 'Real previous question papers, exam patterns, and round-by-round syllabus for TCS, Infosys, Cognizant, Wipro, Accenture, Amazon, Zoho & more.',
      icon: FileText,
      tag: 'Verified Questions',
      color: 'from-blue-500/20 to-indigo-500/10',
      border: 'border-blue-500/30',
      badgeColor: 'bg-blue-500/20 text-blue-300'
    },
    {
      id: 'interview',
      title: 'AI Mock Interview Room',
      desc: 'Interactive Technical, HR, and Behavioral mock interviews with real-time speech evaluation, body language tips, and answer grading.',
      icon: Bot,
      tag: 'Voice & AI Feedback',
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'aptitude-arena',
      title: 'Aptitude & Reasoning Arena',
      desc: 'Master Quantitative Aptitude, Logical Reasoning, and Verbal Ability with timed speed rounds and detailed explanations.',
      icon: Zap,
      tag: 'Speed & Accuracy',
      color: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/30',
      badgeColor: 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'coding-practice',
      title: 'DSA & Coding Practice Arena',
      desc: '30-Day Curated Coding Sprints in Java, Python, and C++ covering LeetCode/HackerRank placement patterns and live in-browser compiler.',
      icon: Code2,
      tag: '30D Code Sprint',
      color: 'from-purple-500/20 to-violet-500/10',
      border: 'border-purple-500/30',
      badgeColor: 'bg-purple-500/20 text-purple-300'
    },
    {
      id: 'resume',
      title: 'AI Resume Builder & ATS Scanner',
      desc: 'Build recruiter-ready resumes optimized with Stanford & Harvard templates and scan against job descriptions with our AI ATS analyzer.',
      icon: Award,
      tag: 'ATS 95%+ Match',
      color: 'from-pink-500/20 to-rose-500/10',
      border: 'border-pink-500/30',
      badgeColor: 'bg-pink-500/20 text-pink-300'
    },
    {
      id: 'tech-pulse',
      title: 'TechPulse™ Radar & Hiring Alerts',
      desc: 'Live intelligence feed tracking fresher hiring openings, compensation hikes, trending tech stacks, and off-campus recruitment drives.',
      icon: TrendingUp,
      tag: 'Live Market Radar',
      color: 'from-cyan-500/20 to-sky-500/10',
      border: 'border-cyan-500/30',
      badgeColor: 'bg-cyan-500/20 text-cyan-300'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* ── NATIONAL HIRING RADAR TICKER ── */}
      <div className="bg-emerald-950/80 border-b border-emerald-500/20 py-2 px-4 text-xs font-semibold text-emerald-300 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 min-w-max">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider font-bold text-white text-[11px]">National Off-Campus Hiring Live:</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-slate-300">
            <span>🚀 <strong>TCS NQT 2026:</strong> Registrations Active</span>
            <span>⚡ <strong>Infosys DSE:</strong> Pattern Updated (3 Rounds)</span>
            <span>🌐 <strong>Accenture ASE/FSE:</strong> Coding Round Live</span>
            <span>🎯 <strong>Zoho Developer:</strong> Round 1 Mock Pack Live</span>
          </div>
          <button
            onClick={() => triggerLogin('company-papers')}
            className="text-[11px] text-emerald-400 hover:text-white underline font-bold"
          >
            Practice Company Drills →
          </button>
        </div>
      </div>

      {/* ── TOP EXECUTIVE BAR ── */}
      <header className="border-b border-emerald-500/15 bg-[#070B19]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/40">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  LUMIXORA <span className="text-emerald-400">CAMPUS</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden sm:inline-block">
                  Universal Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Universal Career & Placement Suite for Higher Education Scholars
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 border border-slate-800 bg-slate-900/60 px-3 py-1.5 rounded-lg">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Institutional Secure Access</span>
            </div>
            <button
              onClick={() => triggerLogin('campus-commander')}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-[0.98]"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden py-14 sm:py-20 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.18),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open to All Engineering, Technology & University Scholars</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Crack Your Dream Campus Offer with{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              LUMIXORA CAMPUS
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-lg text-slate-300 leading-relaxed">
            The autonomous placement operating system engineered for students from{' '}
            <strong className="text-white font-semibold">JNTUA, JNTUK, JNTUH, SVU, CBIT, VIT, SRM, KL, RGM, SRIT</strong> and all higher education institutions across India. Complete with authentic previous company papers, AI mock interviews, live aptitude, and ATS resume intelligence.
          </p>

          {/* ── INTERACTIVE "CHECK MY COLLEGE" WIDGET ── */}
          <div className="max-w-xl mx-auto p-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-xl shadow-black/40">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3.5" />
              <input
                type="text"
                placeholder="Check your college (e.g. RGMCET, VIT, SRIT, CBIT, JNTU)..."
                value={collegeQuery}
                onChange={(e) => setCollegeQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={() => triggerLogin('campus-commander')}
                className="absolute right-1 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
              >
                Sign In
              </button>
            </div>

            {/* Instant College Clearance Badge */}
            {matchedCollege && (
              <div className="mt-2 pt-2 border-t border-slate-800 text-left px-2 flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    <strong>{matchedCollege.name}</strong> is verified & supported!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerLogin('campus-commander')}
                  className="text-emerald-400 hover:underline font-bold text-[11px] shrink-0 ml-2"
                >
                  Enter Portal →
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => triggerLogin('campus-commander')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transition active:scale-[0.98]"
            >
              <span>Launch Placement Suite</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => triggerLogin('company-papers')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center justify-center gap-2 transition"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Browse 100+ Placement Papers</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl font-black text-emerald-400">100+</div>
              <div className="text-xs text-slate-400 mt-0.5">Company Placement Papers</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl font-black text-teal-400">10,000+</div>
              <div className="text-xs text-slate-400 mt-0.5">Aptitude & DSA Questions</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl font-black text-cyan-400">AI Powered</div>
              <div className="text-xs text-slate-400 mt-0.5">Voice & Tech Interviews</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl font-black text-emerald-400">100% Free</div>
              <div className="text-xs text-slate-400 mt-0.5">Universal Student Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE COMPANY PATTERN & CTC EXPLORER ── */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" /> Company Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Explore Recruitment Patterns & CTC Packages
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Review the latest round breakdowns and testing formats before you sit for on-campus or off-campus drives.
          </p>
        </div>

        {/* Company Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {COMPANY_PATTERNS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCompanyTab(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCompanyTab === c.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {c.shortName}
            </button>
          ))}
        </div>

        {/* Selected Company Breakdown Card */}
        <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{currentPattern.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentPattern.tag}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Roles: <strong className="text-slate-200">{currentPattern.roles}</strong></p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-400 font-semibold">Compensation Tier</div>
              <div className="text-base font-black text-emerald-400">{currentPattern.ctc}</div>
            </div>
          </div>

          {/* Rounds list */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Recruitment Rounds:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentPattern.rounds.map((round, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-xs font-black text-emerald-300">{round.name}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{round.details}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">Includes previous papers, sectional timing & syllabus breakdown</span>
            <button
              onClick={() => triggerLogin('company-papers')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-500/20"
            >
              <span>Practice {currentPattern.shortName} Drills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── CORE PLACEMENT ENGINES GRID ── */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Complete Placement Arsenal
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            From technical rounds and coding tests to HR personal interviews and verified skill credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => triggerLogin(feat.id)}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br ${feat.color} bg-slate-900/60 border ${feat.border} hover:border-emerald-400/60 transition duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${feat.badgeColor}`}>
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>Open Module</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>



      {/* ── FOOTER ── */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#070B19] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">LUMIXORA CAMPUS</span>
            <span>• Universal Placement Operating System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>256-Bit SSL Encrypted</span>
            <span>Anti-Bot Shielded</span>
            <span>lumixora.team@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
