import React from 'react';
import Realistic3DLogo from './Realistic3DLogo';
import { 
  Cpu, Mic, Code, Award, Target, FileText, Briefcase, 
  Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Play, Brain, ChevronRight,
  TrendingUp, Users, CheckCircle, BarChart3, Star, Zap, Building2, BookOpen
} from 'lucide-react';

export default function GprecPlacementLanding({ onEnterPlacement, onLoginClick }) {
  const PLACEMENT_PORTALS = [
    {
      id: 'ai-commander',
      title: 'AI Placement Commander™',
      desc: 'Live Placement Readiness Index (0-100), Tier 1 / Tier 2 company matching, dynamic salary benchmarks, and gap analysis.',
      bestUse: 'Daily diagnostic check & target company preparation roadmap.',
      benefits: [
        'Real-time Readiness Score (0-100) based on coding + communication + resume',
        'Direct company criteria match: TCS Digital, Infosys SP, Amazon SDE, Capgemini',
        'Identifies exact skill gaps so you know what to practice before drive dates'
      ],
      badge: 'FLAGSHIP ⚡',
      icon: Cpu,
      gradient: 'bg-purple-50 text-[#7553E8] border-purple-200',
      accentColor: '#7553E8'
    },
    {
      id: 'speakverse',
      title: 'SpeakVerse™ AI Communication',
      desc: '6 AI laboratories: Live Conversation Arena, GD Battle with AI peers, Voice Intelligence Lab, and JAM Extempore Studio.',
      bestUse: 'Cracking Group Discussions (GD), JAM rounds, and HR behavioral screenings.',
      benefits: [
        'Practice extempore & GD rounds anytime with realistic AI candidate personas',
        'Instant scoring on voice modulation, filler words, grammar, and fluency',
        'Eliminates hesitation and builds confident corporate verbal articulation'
      ],
      badge: 'COMMUNICATION 👑',
      icon: Mic,
      gradient: 'bg-cyan-50 text-[#08BFD0] border-cyan-200',
      accentColor: '#08BFD0'
    },
    {
      id: 'interview',
      title: 'AI Mock Interview Room',
      desc: 'Real-time audio/speech placement interviews with STAR framework rubrics, behavioral grilling, and placement scores.',
      bestUse: 'Simulating full 30-minute Technical & HR interview rounds with speech.',
      benefits: [
        'Spoken two-way voice Q&A matching senior corporate interviewer tone',
        'STAR methodology feedback (Situation, Task, Action, Result) for every answer',
        'Pinpoints weak technical explanations before the real interview'
      ],
      badge: 'LIVE AI 🎙️',
      icon: Mic,
      gradient: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      accentColor: '#10b981'
    },
    {
      id: 'coding-practice',
      title: 'Code Arena & 30D Java / DSA',
      desc: 'Placement coding test simulator, integrated compiler, LeetCode-style problem tracks, and automated test-case evaluation.',
      bestUse: 'Clearing online coding rounds (HackerRank/Amcat/Wheebox patterns).',
      benefits: [
        'Structured 30-Day Java & DSA roadmap curated for on-campus drives',
        'Multi-language in-browser compiler with hidden corner-case testing',
        'Optimized solution explanations and time/space complexity analysis'
      ],
      badge: 'DSA TRACK 💻',
      icon: Code,
      gradient: 'bg-amber-50 text-amber-600 border-amber-200',
      accentColor: '#f59e0b'
    },
    {
      id: 'company-papers',
      title: 'Company Placement Papers',
      desc: 'Real past placement question papers, pattern analysis, and solved online test papers for TCS, Amazon, Infosys, and Capgemini.',
      bestUse: 'Pre-drive pattern mastery 48-72 hours before the company visits campus.',
      benefits: [
        'Authentic previous year question papers collected from recent drives',
        'Exact section-wise timing: Quants, Verbal, Reasoning, and Pseudo-code',
        'Detailed step-by-step solutions with shortcuts and time-saving tricks'
      ],
      badge: 'PAPERS 📄',
      icon: Target,
      gradient: 'bg-rose-50 text-rose-600 border-rose-200',
      accentColor: '#f43f5e'
    },
    {
      id: 'resume',
      title: 'AI Resume Builder & ATS Scanner',
      desc: 'Instantly build placement-approved resumes with 90+ ATS pass rates, bullet-point enhancers, and 1-click PDF export.',
      bestUse: 'Passing automated corporate ATS filters without getting filtered out.',
      benefits: [
        'ATS Score checker with keyword match against target Job Descriptions (JD)',
        'AI bullet-point rewriter that transforms project summaries into high-impact achievements',
        'Clean single-page corporate template accepted by all visiting recruiters'
      ],
      badge: 'ATS 90+ 📝',
      icon: FileText,
      gradient: 'bg-blue-50 text-blue-600 border-blue-200',
      accentColor: '#3b82f6'
    },
    {
      id: 'certificates',
      title: 'Proof-of-Skill Badges & Certs',
      desc: 'Verifiable cryptographically signed placement certificates with live QR verification for recruiters and LinkedIn.',
      bestUse: 'Showcasing verified domain competence on LinkedIn and digital resumes.',
      benefits: [
        'Tamper-proof verifiable credentials with unique QR verification codes',
        'Demonstrates hands-on proficiency in DSA, Web, Java, and Aptitude to HRs',
        'One-click direct sharing to LinkedIn Profile Certifications section'
      ],
      badge: 'LINKEDIN 📜',
      icon: Award,
      gradient: 'bg-teal-50 text-teal-600 border-teal-200',
      accentColor: '#14b8a6'
    },
    {
      id: 'alumni-referrals',
      title: 'Alumni Referral Bridge',
      desc: 'Direct connection to GPREC alumni working at top tech firms, off-campus placement drive alerts, and employee referrals.',
      bestUse: 'Securing off-campus interviews and high-package referral opportunities.',
      benefits: [
        'Access to verified GPREC alumni working across Tier 1 MNCs & startups',
        'Internal employee referral requests to bypass public application queues',
        'Live curated off-campus hiring alerts with verified application links'
      ],
      badge: 'OFF-CAMPUS 🚀',
      icon: Briefcase,
      gradient: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      accentColor: '#6366f1'
    }
  ];

  const INSTITUTIONAL_BENEFITS = [
    {
      icon: TrendingUp,
      title: 'Higher Placement Conversion Ratio',
      desc: 'Students practice company-specific assessment rounds in real exam conditions, boosting first-attempt selection rates by up to 3.4x.',
      color: 'text-[#7553E8]',
      bg: 'bg-purple-50 border-purple-200'
    },
    {
      icon: Mic,
      title: 'Overcoming Communication & Hesitation',
      desc: 'SpeakVerse AI gives Telugu and non-native English speakers a safe, private 24/7 environment to gain natural English fluency and ace HR & GD rounds.',
      color: 'text-[#08BFD0]',
      bg: 'bg-cyan-50 border-cyan-200'
    },
    {
      icon: BarChart3,
      title: 'Zero Guesswork Preparation',
      desc: 'The AI Placement Readiness Index pinpoints exact weaknesses in coding, quants, or communication so students focus strictly where it counts.',
      color: 'text-[#00B987]',
      bg: 'bg-emerald-50 border-emerald-200'
    },
    {
      icon: Building2,
      title: 'Corporate ATS Compliance',
      desc: 'Eliminates rejected resumes. Built-in ATS optimization guarantees student resumes score 90+ on automated corporate recruiter parsers.',
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-[#101A35] font-sans selection:bg-[#7553E8]/20 selection:text-[#7553E8] flex flex-col select-none relative overflow-x-hidden">
      {/* Subtle decorative grid and ambient glowing orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#101A3508_1px,transparent_1px),linear-gradient(to_bottom,#101A3508_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-r from-[#7553E8]/15 via-[#08BFD0]/10 to-[#00B987]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Sticky Header with matching Lumixora white glass style */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#101A35]/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Realistic3DLogo size="sm" />
            <img 
              src="/gprec-logo.png" 
              alt="G. Pulla Reddy Engineering College Logo" 
              className="w-12 h-12 object-contain rounded-xl p-1 bg-white border border-[#101A35]/10 shadow-xs" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-[#101A35] font-sora block">
                  GPREC PLACEMENT SUITE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-50 text-[#7553E8] border border-purple-200 hidden sm:inline-block">
                  Autonomous Kurnool
                </span>
              </div>
              <p className="text-[10px] text-[#7553E8] font-bold tracking-widest uppercase block -mt-0.5">
                Institutional Placement Intelligence • Powered by Vyomra
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onLoginClick ? onLoginClick('student') : onEnterPlacement('ai-commander')}
              className="px-5 py-2.5 rounded-xl bg-[#101A35] hover:bg-[#1E2E5D] text-white text-xs font-black shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Scholar Login</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#08BFD0]" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16 relative z-10 w-full">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Pill Header */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#7553E8]/20 shadow-xs text-xs font-black uppercase tracking-wider text-[#7553E8]">
            <ShieldCheck className="w-4 h-4 text-[#7553E8]" />
            <span>DEDICATED PLACEMENT SUITE FOR GPREC SCHOLARS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-[#101A35] tracking-tight leading-[1.12]">
            GPREC Institutional <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7553E8] via-[#08BFD0] to-[#00B987]">
              Placement Intelligence Suite
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#101A35]/70 max-w-2xl mx-auto leading-relaxed font-normal">
            A specialized, distraction-free placement ecosystem designed for G. Pulla Reddy Engineering College scholars. Master coding assessments, ace mock interviews, and build corporate communication skills.
          </p>

          {/* 3 Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#101A35]/80 pt-2">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#101A35]/10 shadow-xs">
              <Cpu className="w-3.5 h-3.5 text-[#7553E8]" /> AI Placement Commander™
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#101A35]/10 shadow-xs">
              <Mic className="w-3.5 h-3.5 text-[#08BFD0]" /> SpeakVerse™ 2.0
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#101A35]/10 shadow-xs">
              <Code className="w-3.5 h-3.5 text-[#00B987]" /> Code Arena & 30D Java
            </span>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <button
              onClick={() => onEnterPlacement('ai-commander')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#101A35] hover:bg-[#1E2E5D] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-[#101A35]/15 hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <Play className="w-4 h-4 fill-[#08BFD0] text-[#08BFD0]" />
              <span>Launch Placement Command Center</span>
            </button>

            <button
              onClick={() => onEnterPlacement('speakverse')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-gray-50 border border-[#101A35]/15 text-[#101A35] font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Mic className="w-4 h-4 text-[#7553E8]" />
              <span>Open SpeakVerse™ Communication</span>
            </button>
          </div>
        </div>

        {/* Institutional Benefits Overview Grid */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#101A35]/10 shadow-sm space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#7553E8] bg-purple-50 border border-purple-200 px-3 py-1 rounded-full inline-block">
              Institutional Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#101A35] font-sora tracking-tight">
              Why GPREC Scholars & Placement Cell Win With This Suite
            </h2>
            <p className="text-xs sm:text-sm text-[#101A35]/70 font-medium">
              Eliminating the common bottlenecks that cause deserving engineering scholars to miss out on top placement offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {INSTITUTIONAL_BENEFITS.map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-[#7553E8]/30 transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs ${item.bg}`}>
                      <ItemIcon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <h3 className="text-sm font-black text-[#101A35] font-sora leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#101A35]/70 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8 Core Placement Portals Grid with Best Use & Key Benefits */}
        <div className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#101A35] font-sora tracking-tight">
                Placement Portals • Best Use & Benefits
              </h2>
              <p className="text-xs sm:text-sm text-[#101A35]/60 font-medium">
                Detailed capabilities, recommended practice workflows, and targeted outcomes for each portal.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-50 border border-purple-200 text-[#7553E8] font-mono self-start sm:self-auto">
              8 Enterprise Modules
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PLACEMENT_PORTALS.map((portal) => {
              const Icon = portal.icon;
              return (
                <div
                  key={portal.id}
                  className="p-6 sm:p-7 rounded-3xl bg-white hover:bg-slate-50/50 border border-[#101A35]/10 hover:border-[#7553E8]/40 transition-all flex flex-col justify-between space-y-5 shadow-xs hover:shadow-lg relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Header line */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${portal.gradient}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-[#101A35] font-sora">
                            {portal.title}
                          </h3>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 inline-block mt-0.5">
                            {portal.badge}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Overview description */}
                    <p className="text-xs sm:text-sm text-[#101A35]/75 leading-relaxed font-normal">
                      {portal.desc}
                    </p>

                    {/* Best Use Tag */}
                    <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100/80 flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-[#7553E8] shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-bold text-[#7553E8]">Best Use: </span>
                        <span className="text-[#101A35]/80 font-medium">{portal.bestUse}</span>
                      </div>
                    </div>

                    {/* Key Benefits List */}
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        Key Benefits & Outcomes
                      </p>
                      <ul className="space-y-1.5">
                        {portal.benefits.map((benefit, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-xs text-[#101A35]/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00B987] shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Portal Action Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onEnterPlacement(portal.id)}
                      className="px-4 py-2 rounded-xl bg-[#101A35] hover:bg-[#1E2E5D] text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <span>Open {portal.title.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#08BFD0]" />
                    </button>
                    <span className="text-[11px] font-bold text-slate-400">
                      Free for GPREC Scholars
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Institutional Assurance Footer Notice */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#101A35]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#101A35]/70">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <p className="font-black text-[#101A35] text-sm">GPREC Placement Suite • Autonomous Institution Kurnool</p>
              <p className="text-[11px] text-slate-500 font-mono">Contract ID: LMX-GPREC-2026 • Enterprise Placement License Active through 2027</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium sm:text-right">
            Zero clutter • Pure placement readiness & corporate conversions
          </p>
        </div>
      </main>
    </div>
  );
}
