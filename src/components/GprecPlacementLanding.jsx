import React, { useState } from 'react';
import { 
  Cpu, Mic, Code, Award, Target, FileText, Briefcase, 
  CheckCircle2, ArrowRight, ShieldCheck, ChevronRight,
  TrendingUp, Users, BarChart3, Star, Zap, Building2, BookOpen,
  Check, Lock, ExternalLink, Calendar, HelpCircle, FileSpreadsheet,
  Layers, Clock, Compass, Terminal, Shield, Sparkles
} from 'lucide-react';

export default function GprecPlacementLanding({ onEnterPlacement, onLoginClick }) {
  const [activeFilter, setActiveFilter] = useState('all');

  // Real data verified from official GPREC Training & Placement Cell records (gprec.ac.in/placement-record/ & NIRF)
  const INSTITUTIONAL_METRICS = [
    { label: 'ANNUAL OFFERS', value: '643', detail: '2025 Graduating Batch', sub: '574+ in 2024 • 1,457 Peak Record' },
    { label: 'AVERAGE PACKAGE', value: '₹4.82 LPA', detail: 'Institutional Mean', sub: 'NIRF Median: ₹4.36 LPA (CSE: ₹5.5 LPA)' },
    { label: 'HIGHEST PACKAGE', value: '₹23.0 LPA', detail: 'Wayfair Global Tech', sub: 'On-Campus CTC (Off-Campus: ₹32.5 LPA)' },
    { label: 'TOP RECRUITER OFFERS', value: '114 Offers', detail: 'TCS (Ninja, Digital & Prime)', sub: 'Accenture: 105 Offers • Tech M: 51' }
  ];

  const REAL_DRIVE_TRACKS = [
    { company: 'Wayfair Global Technology', ctc: '₹23.00 LPA', role: 'Software Development Engineer', tag: 'Highest On-Campus CTC' },
    { company: 'Ciena Networking', ctc: '₹11.95 LPA', role: 'R&D Systems & Protocol Engineer', tag: 'Core Product Cadre' },
    { company: 'IBM & Appyhigh', ctc: '₹11.00 LPA', role: 'Cloud & Software Engineering', tag: 'Tier-1 Tech Track' },
    { company: 'TCS Digital & Prime', ctc: '₹7.50 - 9.00 LPA', role: 'Digital Software Engineer', tag: '114 Total TCS Offers' },
    { company: 'Accenture Advanced (AASE)', ctc: '₹4.50 - 6.50 LPA', role: 'Advanced Application Engineer', tag: '105 Total Offers' },
    { company: 'Zelis & LTI Mindtree', ctc: '₹4.05 - 4.80 LPA', role: 'Healthcare Tech & Cloud SDE', tag: '61 Combined Offers' }
  ];

  const STRATEGIC_PILLARS = [
    {
      title: 'Automated Readiness Index',
      code: 'PILLAR-01',
      desc: 'Multi-vector scoring algorithm evaluating algorithm fluency, aptitude percentile, and verbal articulation in real time.',
      icon: Target
    },
    {
      title: 'Direct Recruiter Criteria Match',
      code: 'PILLAR-02',
      desc: 'Instant candidate eligibility mapping against official cutoff benchmarks for TCS Digital, Infosys SP, Wayfair, and Accenture.',
      icon: Briefcase
    },
    {
      title: '300+ Hours CRT Curriculum',
      code: 'PILLAR-03',
      desc: 'Structured Campus Recruitment Training tracks mapped across 4 years aligned with Dr. K. Govardhan Reddy (Dean) guidelines.',
      icon: BookOpen
    },
    {
      title: 'TPO Governance & Telemetry',
      code: 'PILLAR-04',
      desc: 'Official candidate talent database, round-by-round interview auditing, and automated NIRF & NBA compliance report generation.',
      icon: BarChart3
    }
  ];

  const PLACEMENT_PORTALS = [
    {
      id: 'ai-commander',
      modCode: 'MOD-01',
      category: 'flagship',
      title: 'AI Placement Commander™',
      desc: 'Comprehensive diagnostic command center providing dynamic Placement Readiness Scores (0-100), GPREC recruiter matching (TCS, Accenture, Wayfair, IBM), and gap analysis.',
      bestUse: 'Daily diagnostic check & target company preparation roadmap.',
      badge: 'Flagship Module',
      isGoldBadge: true,
      icon: Cpu,
      benefits: [
        'Dynamic Readiness Score (0-100) combining code assessments, aptitude, and resume strength',
        'Direct company criteria match: Wayfair, TCS Digital, Accenture AASE, Infosys SP',
        'Identifies exact skill gaps so scholars prioritize practice before drive dates'
      ]
    },
    {
      id: 'speakverse',
      modCode: 'MOD-02',
      category: 'communication',
      title: 'SpeakVerse™ Communication Laboratory',
      desc: 'Rigorous corporate communication laboratory featuring live GD battle rooms, voice modulation telemetry, and JAM extempore simulation.',
      bestUse: 'Group Discussions (GD), JAM rounds, and HR behavioral screenings.',
      badge: 'Communication',
      icon: Mic,
      benefits: [
        'Live speech rate, filler-word frequency, and voice modulation telemetry',
        'Structured argument delivery and rebuttal practice for corporate GD rounds',
        'Instant rubric scoring on vocabulary, confidence, and fluency'
      ]
    },
    {
      id: 'coding-practice',
      modCode: 'MOD-03',
      category: 'engineering',
      title: 'Code Arena & 30-Day Java / DSA',
      desc: '500+ curated algorithmic challenges, execution environment with automated test cases, and a structured 30-day curriculum covering Arrays to Dynamic Programming.',
      bestUse: 'Online technical assessments (HackerRank, AMCAT, CoCubes, TCS Xplore).',
      badge: 'Engineering',
      icon: Code,
      benefits: [
        'Mastery of core algorithmic patterns: Two-Pointers, Sliding Window, Trees, and DP',
        'Multi-language code execution: Java, Python, C++, and JavaScript',
        'Strict time and space complexity benchmarking against production standards'
      ]
    },
    {
      id: 'tpo-dashboard',
      modCode: 'MOD-04',
      category: 'governance',
      title: 'TPO Officer Command Center',
      desc: 'Official administrative portal for Dean & ATPO to orchestrate campus recruitment drives, audit candidate rosters, and generate NIRF reports.',
      bestUse: 'Institutional TPO operations, drive scheduling, and candidate eligibility verification.',
      badge: 'T&P Governance',
      isGoldBadge: true,
      icon: Building2,
      benefits: [
        'Instant candidate filtering by CGPA, backlogs, branch, and readiness tier',
        'Round-by-round interview tracker with status auditing from OA to Offer',
        'One-click Master CSV export for company submissions and accreditation reviews'
      ]
    },
    {
      id: 'interview',
      modCode: 'MOD-05',
      category: 'interview',
      title: 'Technical & HR Mock Interview Room',
      desc: 'Simulated corporate interview environment with adaptive technical questions, resume-driven inquiries, and structured STAR feedback.',
      bestUse: 'Pre-drive practice simulations 48 hours prior to company technical interviews.',
      badge: 'Simulation',
      icon: Terminal,
      benefits: [
        'Role-specific technical questioning (Frontend SDE, Backend, Data Engineer, Core)',
        'Detailed STAR evaluation (Situation, Task, Action, Result) with improvement tips',
        'Session transcripts and rubric scores archived for continuous student progress'
      ]
    },
    {
      id: 'company-papers',
      modCode: 'MOD-06',
      category: 'archives',
      title: 'Company Placement Papers & Archives',
      desc: 'Official historical assessment papers, pattern breakdowns, and sectional cutoff guidelines for TCS, Accenture, Tech Mahindra, Mindtree, and 40+ recruiters.',
      bestUse: 'Last-mile targeted preparation once a company drive date is officially notified.',
      badge: 'Archives',
      icon: FileSpreadsheet,
      benefits: [
        'Familiarity with company-specific assessment interfaces and sectional timers',
        'Recurring question banks categorized by company and difficulty level',
        'Strategic time-allocation guides to clear sectional qualifying cutoffs'
      ]
    },
    {
      id: 'resume',
      modCode: 'MOD-07',
      category: 'career',
      title: 'Executive Resume Builder & ATS Scanner',
      desc: 'Enterprise single-page resume architect formatted to Harvard standards with real-time keyword alignment analysis against job descriptions.',
      bestUse: 'Generating clean, verifiable resumes for corporate drive submissions.',
      badge: 'Career Tools',
      icon: FileText,
      benefits: [
        '90%+ ATS parsing compatibility verified across major enterprise HRMS systems',
        'Action-oriented bullet structure highlighting quantifiable engineering impact',
        'One-click high-resolution PDF generation ready for campus submission'
      ]
    },
    {
      id: 'certificates',
      modCode: 'MOD-08',
      category: 'credentials',
      title: 'Verified Skill Credentials & Badges',
      desc: 'Cryptographically verifiable completion certificates and competency badges validating benchmark achievements across DSA, Aptitude, and Communication.',
      bestUse: 'Validating skill mastery on LinkedIn profiles and resume portfolios.',
      badge: 'Credentials',
      isGoldBadge: true,
      icon: Award,
      benefits: [
        'Permanent institutional verification URL for prospective recruiters and HR cells',
        'Detailed syllabus and score transcript embedded in every credential',
        'Direct integration with the GPREC placement candidate database'
      ]
    }
  ];

  // Official GPREC 2024 / 2025 Recruiter Data
  const RECRUITER_ROSTER = [
    { 
      tier: 'Super Dream & Tier-1', 
      ctc: '₹11.0 - 23.0 LPA', 
      recruiters: 'Wayfair Global Tech (₹23 LPA), Ciena (₹11.95 LPA), IBM (₹11 LPA), Appyhigh (₹11 LPA)', 
      tag: 'Product SDE' 
    },
    { 
      tier: 'Digital & Niche Tech', 
      ctc: '₹6.5 - 9.5 LPA', 
      recruiters: 'Infosys SP (₹9.5 LPA), TCS Digital/Prime (₹7.5 - 9 LPA), BARC (₹9 LPA), Mavenir (₹8.75 LPA), Johnson Controls (₹8.5 LPA)', 
      tag: 'Digital Elite' 
    },
    { 
      tier: 'High-Volume Tech Roster', 
      ctc: '₹3.36 - 6.5 LPA', 
      recruiters: 'TCS (114 Offers), Accenture (105 Offers), Tech Mahindra (51 Offers), LTI Mindtree (38 Offers), Zelis (23 Offers)', 
      tag: '330+ Core Offers' 
    },
    { 
      tier: 'Core Engineering & R&D', 
      ctc: '₹4.0 - 7.5 LPA', 
      recruiters: 'Medha Servo Drives, L&T Technology Services, Schneider Electric, Tata Motors, Hyundai, Cognizant GenC (20 Offers)', 
      tag: 'Core & Embedded' 
    }
  ];

  const CRT_MILESTONES = [
    {
      step: '01',
      title: 'Diagnostic Baseline (Year 1 & 2)',
      desc: 'Foundational 300-hour assessment establishing candidate baseline benchmarks across arithmetic, logical reasoning, and C/Python/Java programming.'
    },
    {
      step: '02',
      title: 'Algorithmic Mastery (Year 3)',
      desc: 'Rigorous training in core Data Structures & Algorithms (Two-Pointers, Trees, Graphs, DP) tailored for TCS Digital and product assessments.'
    },
    {
      step: '03',
      title: 'Aptitude & Verbal Logic (Year 3 & 4)',
      desc: 'Intensive practice for AMCAT, CoCubes, and company qualifying rounds covering Quantitative Ability, Data Interpretation, and Verbal Reasoning.'
    },
    {
      step: '04',
      title: 'Corporate Simulation (Year 4)',
      desc: 'Full-dress mock interviews with Dean & TPO panelists, structured Group Discussions, resume ATS auditing, and final drive onboarding.'
    }
  ];

  const filteredPortals = activeFilter === 'all' 
    ? PLACEMENT_PORTALS 
    : PLACEMENT_PORTALS.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B132B] font-sans selection:bg-[#0B132B] selection:text-white flex flex-col select-none relative overflow-x-hidden antialiased">
      
      {/* ─── INSTITUTIONAL TOP BAR (SWISS DESIGN / ENTERPRISE SAAS) ─────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Institution Identity */}
          <div className="flex items-center gap-3.5">
            <img 
              src="/gprec_logo.png" 
              alt="G. Pulla Reddy Engineering College Official Crest" 
              className="w-12 h-12 object-contain rounded-lg p-1 bg-white border border-[#E2E8F0] shadow-xs shrink-0" 
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base sm:text-lg font-bold tracking-tight text-[#0B132B]">
                  G. PULLA REDDY ENGINEERING COLLEGE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#FDF8EE] text-[#9A7328] border border-[#F1E1B8]">
                  Autonomous • Estd. 1985
                </span>
              </div>
              <p className="text-[11px] text-[#475569] font-medium tracking-normal truncate">
                Institutional Placement Suite • Training & Placement Cell (Dr. K. Govardhan Reddy, Dean)
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://tpo.lumixora.in"
              onClick={(e) => {
                if (window.location.hostname !== 'tpo.lumixora.in' && onLoginClick) {
                  e.preventDefault();
                  onLoginClick('officer');
                }
              }}
              className="hidden sm:inline-flex px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-[#0B132B] border border-[#CBD5E1] text-xs font-semibold shadow-xs transition-colors cursor-pointer items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>TPO & Faculty Portal</span>
              <span className="text-[10px] text-[#64748B] font-mono">(tpo.lumixora.in)</span>
            </a>
            <button
              onClick={() => onLoginClick ? onLoginClick('student') : onEnterPlacement('ai-commander')}
              className="px-4 py-2 rounded-lg bg-[#0B132B] hover:bg-[#152042] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Scholar Login</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT 12-COLUMN GRID ────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-16 w-full">
        
        {/* ─── 1. HERO SECTION (12 COLUMNS: 7 COL CONTENT + 5 COL TELEMETRY) ─── */}
        <section className="grid grid-cols-12 gap-6 items-stretch">
          
          {/* Left Hero Column (7 Cols) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Subtle Gold Accreditation Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FDF8EE] border border-[#F1E1B8] text-[11px] font-semibold uppercase tracking-wider text-[#9A7328]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>NAAC 'A+' Grade • NBA Accredited • AICTE Approved • JNTUA</span>
              </div>

              {/* Authoritative Display Headline */}
              <h1 className="text-3xl sm:text-5xl font-bold text-[#0B132B] tracking-tight leading-[1.15]">
                Institutional Placement Suite & Candidate Readiness Matrix
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-normal max-w-xl">
                Official placement architecture for GPREC scholars and the Training & Placement Cell. Continuous assessment benchmarks, verified credentialing, and real-time recruitment drive synchronization backed by official institutional placement records.
              </p>
            </div>

            {/* Strategic Pillars Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-white border border-[#E2E8F0] shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9A7328] font-mono">TRACK 01</p>
                <p className="text-xs font-bold text-[#0B132B] mt-0.5">300+ Hrs CRT Training</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#E2E8F0] shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9A7328] font-mono">TRACK 02</p>
                <p className="text-xs font-bold text-[#0B132B] mt-0.5">Algorithmic Benchmarking</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#E2E8F0] shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9A7328] font-mono">TRACK 03</p>
                <p className="text-xs font-bold text-[#0B132B] mt-0.5">Corporate Communication</p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => onEnterPlacement('ai-commander')}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#0B132B] hover:bg-[#152042] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Launch Placement Command Center</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>

              <button
                onClick={() => onEnterPlacement('speakverse')}
                className="w-full sm:w-auto px-5 py-3 rounded-lg bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0B132B] font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-[#475569]" />
                <span>Open Communication Laboratory</span>
              </button>
            </div>

            <p className="text-[11px] text-[#64748B] font-medium">
              Enterprise Institutional License Active • Ref: LMX-GPREC-2026 • Verified GPREC Data
            </p>
          </div>

          {/* Right Telemetry Column (5 Cols) - REAL DATA AS CONFIRMED FROM gprec.ac.in */}
          <div className="col-span-12 lg:col-span-5">
            <div className="h-full p-6 sm:p-7 rounded-xl bg-white border border-[#E2E8F0] border-t-2 border-t-[#C5A059] shadow-xs flex flex-col justify-between space-y-6">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                <div>
                  <h3 className="text-sm font-bold text-[#0B132B]">
                    Institutional Placement Telemetry
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Official T&P Cell Operations Data
                  </p>
                </div>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDF8EE] text-[#9A7328] border border-[#F1E1B8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  Active Drive Session
                </span>
              </div>

              {/* 2x2 Metric Grid with REAL GPREC Statistics */}
              <div className="grid grid-cols-2 gap-4">
                {INSTITUTIONAL_METRICS.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] block">
                      {m.label}
                    </span>
                    <span className="text-2xl font-bold text-[#0B132B] tracking-tight block mt-0.5">
                      {m.value}
                    </span>
                    <span className="text-[11px] text-[#475569] font-medium block mt-0.5 truncate">
                      {m.detail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Real Corporate Drive Tracks (from GPREC Official Placement Reports) */}
              <div className="space-y-2.5 pt-2 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Verified Campus Placement Drives
                  </p>
                  <span className="text-[10px] font-mono text-[#9A7328] font-bold">
                    Official gprec.ac.in
                  </span>
                </div>
                
                <div className="space-y-2 text-xs">
                  {REAL_DRIVE_TRACKS.slice(0, 4).map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="font-semibold text-[#0B132B] truncate">{d.company}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-[#9A7328] shrink-0">{d.ctc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
                <span>TPO Audit Trail Synchronized</span>
                <span className="font-mono">NIRF 2026 Aligned</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2. STRATEGIC PILLARS (12 COLUMNS: 4 CARDS OF 3 COLS EACH) ─────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9A7328] font-mono">
                INSTITUTIONAL FOUNDATION
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B132B] tracking-tight mt-0.5">
                Strategic Placement Capabilities
              </h2>
            </div>
            <span className="text-xs text-[#64748B] font-medium hidden sm:inline-block">
              Engineered for GPREC Academic Standards
            </span>
          </div>

          <div className="grid grid-cols-12 gap-5">
            {STRATEGIC_PILLARS.map((pillar, idx) => {
              const PillarIcon = pillar.icon;
              return (
                <div 
                  key={idx} 
                  className="col-span-12 sm:col-span-6 lg:col-span-3 p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0B132B]">
                        <PillarIcon className="w-4 h-4 text-[#0B132B]" />
                      </div>
                      <span className="text-[10px] font-semibold text-[#9A7328] font-mono">
                        {pillar.code}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0B132B] leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#475569] leading-relaxed font-normal">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 3. 8 INTEGRATED PLACEMENT MODULES (12 COLUMNS: 2x4 GRID) ──────── */}
        <section className="space-y-6 pt-2">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9A7328] font-mono">
                SYSTEM MODULE DIRECTORY
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B132B] tracking-tight">
                8 Integrated Placement Modules
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] font-normal">
                Standardized diagnostic, preparation, and administrative architectures for each stage of campus hiring.
              </p>
            </div>

            {/* Filter segmented tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E2E8F0] rounded-lg text-xs self-start sm:self-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === 'all' 
                    ? 'bg-[#0B132B] text-white shadow-xs' 
                    : 'text-[#475569] hover:text-[#0B132B]'
                }`}
              >
                All (8)
              </button>
              <button
                onClick={() => setActiveFilter('flagship')}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === 'flagship' 
                    ? 'bg-[#0B132B] text-white shadow-xs' 
                    : 'text-[#475569] hover:text-[#0B132B]'
                }`}
              >
                Diagnostics
              </button>
              <button
                onClick={() => setActiveFilter('engineering')}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === 'engineering' 
                    ? 'bg-[#0B132B] text-white shadow-xs' 
                    : 'text-[#475569] hover:text-[#0B132B]'
                }`}
              >
                Coding
              </button>
              <button
                onClick={() => setActiveFilter('communication')}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === 'communication' 
                    ? 'bg-[#0B132B] text-white shadow-xs' 
                    : 'text-[#475569] hover:text-[#0B132B]'
                }`}
              >
                Communication
              </button>
            </div>
          </div>

          {/* 12-Column Grid of Portal Cards */}
          <div className="grid grid-cols-12 gap-6">
            {filteredPortals.map((portal) => {
              const Icon = portal.icon;
              return (
                <div
                  key={portal.id}
                  className="col-span-12 lg:col-span-6 p-6 sm:p-7 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    
                    {/* Top Meta Line */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0B132B] shrink-0">
                          <Icon className="w-5 h-5 text-[#0B132B]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-semibold text-[#64748B]">
                              {portal.modCode}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              portal.isGoldBadge 
                                ? 'bg-[#FDF8EE] text-[#9A7328] border border-[#F1E1B8]' 
                                : 'bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]'
                            }`}>
                              {portal.badge}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-[#0B132B] mt-0.5">
                            {portal.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                      {portal.desc}
                    </p>

                    {/* Recommended Workflow Tag */}
                    <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-0.5">
                      <span className="font-semibold text-[#9A7328] block text-[11px] uppercase tracking-wider">
                        Recommended Practice Workflow
                      </span>
                      <p className="text-[#334155] font-normal leading-relaxed">
                        {portal.bestUse}
                      </p>
                    </div>

                    {/* Key Outcomes / Deliverables */}
                    <div className="space-y-2 pt-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                        Key Capabilities & Evaluation Deliverables
                      </p>
                      <ul className="space-y-1.5">
                        {portal.benefits.map((benefit, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-xs text-[#334155]">
                            <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                    <button
                      onClick={() => onEnterPlacement(portal.id)}
                      className="px-4 py-2 rounded-lg bg-[#0B132B] hover:bg-[#152042] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Access {portal.title.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                    </button>
                    <span className="text-[11px] font-medium text-[#64748B]">
                      Authorized GPREC Scholars
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 4. CRT 4-STAGE PATHWAY (12 COLUMNS: 4 CARDS OF 3 COLS EACH) ───── */}
        <section className="p-7 sm:p-9 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9A7328] font-mono">
              CURRICULUM ARCHITECTURE (300+ HOURS)
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B132B] tracking-tight">
              Campus Recruitment Training (CRT) 4-Stage Pathway
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] font-normal">
              Structured progressive curriculum designed in synergy with GPREC Training & Placement Cell calendar under Dr. K. Govardhan Reddy (Dean).
            </p>
          </div>

          <div className="grid grid-cols-12 gap-5">
            {CRT_MILESTONES.map((m, idx) => (
              <div 
                key={idx} 
                className="col-span-12 sm:col-span-6 lg:col-span-3 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold font-mono text-[#9A7328]">
                      {m.step}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                      Phase {idx + 1}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0B132B]">
                    {m.title}
                  </h4>
                  <p className="text-xs text-[#475569] leading-relaxed font-normal">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 5. RECRUITER TIER CLASSIFICATION MATRIX (12 COLUMNS: 4 COLS) ──── */}
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9A7328] font-mono">
              OFFICIAL PLACEMENT ROSTER & VERIFIED CTC
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B132B] tracking-tight">
              Tiered Corporate Recruitment Classification
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] font-normal">
              Verified compensation benchmarks and recruiter classifications across official GPREC on-campus drives (source: gprec.ac.in).
            </p>
          </div>

          <div className="grid grid-cols-12 gap-5">
            {RECRUITER_ROSTER.map((tier, idx) => (
              <div 
                key={idx} 
                className="col-span-12 sm:col-span-6 lg:col-span-3 p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]">
                    {tier.tag}
                  </span>
                  <span className="text-xs font-bold text-[#9A7328] font-mono">
                    {tier.ctc}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B132B]">
                    {tier.tier}
                  </h4>
                  <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                    {tier.recruiters}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 6. INSTITUTIONAL COMPLIANCE & GOVERNANCE FOOTER (12 COLUMNS) ───── */}
        <footer className="pt-10 border-t border-[#E2E8F0] text-xs text-[#475569] space-y-8">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Col 1-6: Institution Pedigree */}
            <div className="col-span-12 lg:col-span-6 space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src="/gprec_logo.png" 
                  alt="G. Pulla Reddy Engineering College Crest" 
                  className="w-10 h-10 object-contain rounded p-0.5 bg-white border border-[#E2E8F0]" 
                />
                <div>
                  <p className="font-bold text-[#0B132B] text-sm">
                    G. Pulla Reddy Engineering College (Autonomous)
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Affiliated to JNTUA • Approved by AICTE • Accredited with 'A+' Grade by NAAC
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed max-w-lg">
                Established in 1985 by late Sri G. Pulla Reddy garu, GPREC is a premier autonomous engineering college in Andhra Pradesh dedicated to technical education, research, and career transformation.
              </p>
              <div className="pt-1">
                <a 
                  href="https://www.gprec.ac.in/placement-record/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A7328] hover:underline"
                >
                  <span>Official GPREC Placement Record Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Col 7-9: TPO Leadership Details */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0B132B] font-mono">
                Training & Placement Leadership
              </p>
              <p className="text-xs text-[#475569] leading-relaxed">
                <strong className="text-[#0B132B]">Dr. K. Govardhan Reddy</strong><br />
                Dean, Placements & Higher Studies<br /><br />
                <strong className="text-[#0B132B]">Sri V.V.S. Chandra Mouli</strong><br />
                Assistant Training & Placement Officer (ATPO)
              </p>
              <p className="text-xs font-semibold text-[#0B132B]">
                Official Webmail: <a href="mailto:dean.placements@gprec.ac.in" className="underline text-[#9A7328]">dean.placements@gprec.ac.in</a>
              </p>
            </div>

            {/* Col 10-12: Enterprise SLA & Licensing */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0B132B] font-mono">
                Enterprise SLA & Security
              </p>
              <p className="text-xs text-[#475569] leading-relaxed">
                Contract ID: <span className="font-mono font-bold text-[#0B132B]">LMX-GPREC-2026</span><br />
                Campus Placement Office, G. Pulla Reddy Nagar<br />
                Nandyal Road, Kurnool - 518007, Andhra Pradesh
              </p>
              <p className="text-[11px] text-[#64748B]">
                Deployment Node: <span className="font-mono text-[#0B132B]">gprec.lumixora.in</span> • TPO Suite: <a href="https://tpo.lumixora.in" className="font-mono text-[#9A7328] hover:underline font-semibold">tpo.lumixora.in</a>
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#64748B]">
            <p>© 2026 G. Pulla Reddy Engineering College. All institutional rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Standardized Enterprise SaaS</span>
              <span>•</span>
              <span>Swiss Architectural Hierarchy</span>
              <span>•</span>
              <span>Official GPREC Telemetry</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
