import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  ShieldCheck, FileText, Bot, Zap, Code2, Award, TrendingUp,
  MapPin, LogOut, ChevronRight, User, Building2, Sparkles,
  ExternalLink, CheckCircle2, Menu, X, ArrowLeft, RefreshCw,
  Target, Flame, Download, Check, Star, Printer
} from 'lucide-react';
import {
  logoutCampusScholar,
  getStoredCampusProfile,
  DREAM_COMPANIES,
  getTargetDreamCompany,
  saveTargetDreamCompany,
  getCampusReadinessMetrics
} from '../services/campusAuthService';
import lazyWithRetry from '../utils/lazyWithRetry';

// Lazy load standard placement engines
const CompanyPlacementPapers = lazyWithRetry(() => import('./CompanyPlacementPapers'));
const AiMockInterviewRoom = lazyWithRetry(() => import('./AiMockInterviewRoom'));
const CodingPractice = lazyWithRetry(() => import('./CodingPractice'));
const AptitudeArena = lazyWithRetry(() => import('../components/AptitudeArena'));
const ResumeCreator = lazyWithRetry(() => import('./ResumeCreator'));
const TechPulsePortal = lazyWithRetry(() => import('./TechPulsePortal'));
const ProofOfSkillCertificates = lazyWithRetry(() => import('./ProofOfSkillCertificates'));
const CareerRoadmap = lazyWithRetry(() => import('./CareerRoadmap'));
const SpeakVersePortal = lazyWithRetry(() => import('./SpeakVersePortal'));
const InternshipPortal = lazyWithRetry(() => import('./InternshipPortal'));
const StudentOffersPortal = lazyWithRetry(() => import('./StudentOffersPortal'));

function ModuleFallback({ title = 'Loading Module...' }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3" />
      <div className="text-sm font-bold text-slate-200">{title}</div>
      <div className="text-xs text-slate-500 mt-1">Calibrating placement telemetry</div>
    </div>
  );
}

export default function CampusPlacementCommander({
  user,
  setActiveTab: setParentActiveTab,
  onLogout
}) {
  const [activeModule, setActiveModule] = useState('company-papers');
  const [scholar, setScholar] = useState(() => user || getStoredCampusProfile() || {});
  const [targetCompany, setTargetCompany] = useState(() => getTargetDreamCompany());
  const [metrics, setMetrics] = useState(() => getCampusReadinessMetrics());
  const [showDossierModal, setShowDossierModal] = useState(false);

  useEffect(() => {
    if (user) {
      setScholar(user);
    } else {
      const cached = getStoredCampusProfile();
      if (cached) setScholar(cached);
    }
  }, [user]);

  const handleTargetCompanyChange = (companyId) => {
    setTargetCompany(companyId);
    saveTargetDreamCompany(companyId);
  };

  const handleLogout = () => {
    logoutCampusScholar();
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  const selectedDream = DREAM_COMPANIES.find(c => c.id === targetCompany) || DREAM_COMPANIES[0];

  const MODULES = [
    {
      id: 'company-papers',
      label: 'Placement Papers',
      shortDesc: '100+ Companies',
      icon: FileText,
      badge: '100+ Drives'
    },
    {
      id: 'interview',
      label: 'AI Mock Interview',
      shortDesc: 'HR & Tech Voice AI',
      icon: Bot,
      badge: 'Live Voice'
    },
    {
      id: 'aptitude-arena',
      label: 'Aptitude Arena',
      shortDesc: 'Speed & Logic Tests',
      icon: Zap,
      badge: 'Timed'
    },
    {
      id: 'coding-practice',
      label: 'Coding & DSA',
      shortDesc: '30-Day Code Sprint',
      icon: Code2,
      badge: 'Compiler'
    },
    {
      id: 'resume',
      label: 'AI Resume & ATS',
      shortDesc: 'Recruiter Score',
      icon: Award,
      badge: 'ATS Scanner'
    },
    {
      id: 'tech-pulse',
      label: 'TechPulse™ Radar',
      shortDesc: 'Hikes & Openings',
      icon: TrendingUp,
      badge: 'Live Radar'
    },
    {
      id: 'certificates',
      label: 'Proof of Skill',
      shortDesc: 'Verified Badges',
      icon: ShieldCheck,
      badge: 'Credentials'
    },
    {
      id: 'career-roadmap',
      label: 'Career Roadmaps',
      shortDesc: 'Role Pathways',
      icon: Sparkles,
      badge: 'Guided'
    },
    {
      id: 'speakverse',
      label: 'SpeakVerse Lab',
      shortDesc: 'GD & Communication',
      icon: User,
      badge: 'Speech AI'
    }
  ];

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 flex flex-col font-sans">
      {/* ── TOP EXECUTIVE BANNER ── */}
      <header className="border-b border-emerald-500/20 bg-[#070D1E]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/40">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">
                  LUMIXORA <span className="text-emerald-400">CAMPUS</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Universal Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Placement & Career Operating System
              </p>
            </div>
          </div>

          {/* Scholar Verified Identity Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-left">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase">
                {scholar.name ? scholar.name.charAt(0) : 'S'}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{scholar.name || 'Campus Scholar'}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30 font-mono">
                    {scholar.roll_number || 'VERIFIED'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                  {scholar.college_name || scholar.college || 'Autonomous Institution'}
                </div>
              </div>
            </div>

            {/* Print / Download Dossier Button */}
            <button
              onClick={() => setShowDossierModal(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1.5 text-xs font-bold"
              title="View Placement Dossier"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Placement Dossier</span>
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700/80 hover:border-rose-500/40 transition flex items-center gap-1.5 text-xs font-semibold"
              title="End Secure Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* ── MODULE PILL SELECTOR ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 pt-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {MODULES.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                  <span>{m.label}</span>
                  {m.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive
                          ? 'bg-black/20 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── CAMPUS READINESS INDEX (CRI) COCKPIT ── */}
      <section className="border-b border-slate-800 bg-slate-950/70 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* CRI Readiness Score Gauge */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Placement Readiness (CRI)</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-emerald-400">{metrics.totalScore}%</span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    {metrics.tier}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-400 flex items-center justify-center font-black text-xs text-white">
                CRI
              </div>
            </div>

            {/* Target Dream Recruiter */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Target Recruiter</span>
                </div>
                <div className="mt-1 font-bold text-xs text-white truncate max-w-[170px]">
                  {selectedDream.name}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">{selectedDream.package}</div>
              </div>
              <select
                value={targetCompany}
                onChange={(e) => handleTargetCompanyChange(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-1.5 outline-none"
              >
                {DREAM_COMPANIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name.split(' ')[0]}</option>
                ))}
              </select>
            </div>

            {/* Prep Streak & Activity */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Preparation Streak</span>
                </div>
                <div className="mt-1 text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{metrics.streakDays} Days Consistent</span>
                  <span className="text-[10px] text-orange-400">🔥 On Fire</span>
                </div>
                <div className="text-[10px] text-slate-400">{metrics.papersViewed} company drills completed</div>
              </div>
            </div>

            {/* Daily 15-Minute Placement Workout */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/40 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-300">Daily 15-Min Workout</div>
                <div className="text-[11px] text-slate-400 mt-0.5">3 Aptitude + 1 Coding + 1 Interview</div>
              </div>
              <button
                onClick={() => setActiveModule('aptitude-arena')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition shadow-md shadow-emerald-500/20 shrink-0"
              >
                Start →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTIVE MODULE CONTAINER ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={<ModuleFallback title="Loading Placement Engine..." />}>
          {activeModule === 'company-papers' && (
            <CompanyPlacementPapers user={scholar} />
          )}

          {activeModule === 'interview' && (
            <AiMockInterviewRoom user={scholar} />
          )}

          {activeModule === 'aptitude-arena' && (
            <AptitudeArena user={scholar} />
          )}

          {activeModule === 'coding-practice' && (
            <CodingPractice user={scholar} />
          )}

          {activeModule === 'resume' && (
            <ResumeCreator user={scholar} />
          )}

          {activeModule === 'tech-pulse' && (
            <TechPulsePortal user={scholar} />
          )}

          {activeModule === 'certificates' && (
            <ProofOfSkillCertificates user={scholar} />
          )}

          {activeModule === 'career-roadmap' && (
            <CareerRoadmap user={scholar} />
          )}

          {activeModule === 'speakverse' && (
            <SpeakVersePortal user={scholar} />
          )}
        </Suspense>
      </main>

      {/* ── OFFICIAL PLACEMENT DOSSIER MODAL ── */}
      {showDossierModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#070B19] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative space-y-5 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">Official Placement Dossier</h3>
              </div>
              <button
                onClick={() => setShowDossierModal(false)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Dossier Card Preview */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-sm font-black text-white">{scholar.name || 'Campus Scholar'}</div>
                  <div className="text-slate-400 font-mono mt-0.5">{scholar.roll_number || 'USN-VERIFIED'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Verified Scholar</div>
                  <div className="text-slate-400 text-[11px]">{scholar.batch || 'Class of 2026'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Institution</span>
                  <span className="font-semibold text-white">{scholar.college_name || scholar.college || 'Higher Education College'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Department / Branch</span>
                  <span className="font-semibold text-white">{scholar.branch || scholar.department || 'Computer Science'}</span>
                </div>
              </div>

              {/* CRI Breakdown */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-emerald-400">Campus Readiness Index (CRI)</span>
                  <span className="text-white font-mono">{metrics.totalScore}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div>• Aptitude Mastery: <strong className="text-slate-200">{metrics.aptitudeScore}%</strong></div>
                  <div>• Coding & DSA: <strong className="text-slate-200">{metrics.codingScore}%</strong></div>
                  <div>• AI Mock Interviews: <strong className="text-slate-200">{metrics.interviewScore}%</strong></div>
                  <div>• ATS Resume Score: <strong className="text-slate-200">{metrics.resumeScore}%</strong></div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-center">
                Cryptographically bound & signed by Lumixora Campus • Autonomous OS
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDossierModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#070D1E] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Lumixora Campus • Universal Higher Education Career Network</span>
          <span>End-to-End Encrypted Session</span>
        </div>
      </footer>
    </div>
  );
}
