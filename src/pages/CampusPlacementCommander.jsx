import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  ShieldCheck, FileText, Bot, Zap, Code2, Award, TrendingUp,
  MapPin, LogOut, ChevronRight, User, Building2, Sparkles,
  ExternalLink, CheckCircle, Menu, X, ArrowLeft, RefreshCw
} from 'lucide-react';
import { logoutCampusScholar, getStoredCampusProfile } from '../services/campusAuthService';
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

  useEffect(() => {
    if (user) {
      setScholar(user);
    } else {
      const cached = getStoredCampusProfile();
      if (cached) setScholar(cached);
    }
  }, [user]);

  const handleLogout = () => {
    logoutCampusScholar();
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

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
