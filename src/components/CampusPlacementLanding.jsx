import React from 'react';
import {
  ShieldCheck, FileText, Code2, Bot, Award, Zap,
  TrendingUp, CheckCircle, ArrowRight, Lock, Users, Sparkles,
  Building, GraduationCap, ChevronRight, Compass
} from 'lucide-react';

export default function CampusPlacementLanding({
  onLoginClick,
  onEnterPortal
}) {
  const triggerLogin = (target = 'campus-commander') => {
    if (onEnterPortal) {
      onEnterPortal(target);
    } else if (onLoginClick) {
      onLoginClick();
    }
  };

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
                  Universal Portal
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
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-800/80">
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
              <span>Browse Company Placement Papers</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
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

      {/* ── FEATURES GRID ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Everything You Need to Get Hired
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

      {/* ── SUPPORTED INSTITUTIONS ── */}
      <section className="py-12 bg-slate-950/60 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Open to Students Across All Universities & Autonomous Colleges
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-300">
            {['JNTU Anantapur', 'JNTU Hyderabad', 'JNTU Kakinada', 'Sri Venkateswara University', 'CBIT Hyderabad', 'Vasavi College of Engg', 'VNR VJIET', 'VIT', 'SRM University', 'KL University', 'RGMCET', 'SRIT', 'GPCET', 'AITS', 'KSRM', 'Osmania University'].map((name) => (
              <span key={name} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                {name}
              </span>
            ))}
          </div>
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
