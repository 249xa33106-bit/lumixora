// ============================================================================
// LUMIXORA SPEAKVERSE™ — PREMIUM AI ENGLISH & PLACEMENT VOICE METAVERSE
// Flagship Speaking Coach, 3D Virtual Classroom & AI Mock Interview Studio
// Developed for Lumixora Scholars by VYOMRA Networks
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Sparkles, 
  GraduationCap, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  BookOpen, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  ArrowRight, 
  Layers, 
  Globe,
  Lock,
  UserCheck
} from 'lucide-react';
import { cleanScholarName } from '../utils/authSecurity';

const SPEAKVERSE_LIVE_URL = 'https://installing-incidence-vpn-similarly.trycloudflare.com';
const SPEAKVERSE_LOCAL_URL = 'http://localhost:3000';

const getSpeakVerseBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // If on production domain (lumixora.in, lumixora.pages.dev, etc.), use the live Cloudflare Tunnel
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return SPEAKVERSE_LIVE_URL;
    }
    // If on localhost, check if port 3000 or live tunnel is preferred (defaults to localhost:3000)
    return SPEAKVERSE_LOCAL_URL;
  }
  return SPEAKVERSE_LIVE_URL;
};

const SPEAKVERSE_MODULES = [
  {
    id: 'home',
    label: 'Overview & Hub',
    path: '/speakverse/home',
    icon: Compass,
    badge: 'Hub',
    desc: 'Student dashboard, personalized learning paths, and recommended drills.'
  },
  {
    id: 'speak',
    label: 'AI Speaking Coach',
    path: '/speakverse/speak',
    icon: Mic,
    badge: 'Live Voice 🎙️',
    desc: 'Real-time conversational practice with instant pronunciation & grammar corrections.'
  },
  {
    id: 'classroom',
    label: '3D Virtual Classroom',
    path: '/speakverse/classroom',
    icon: Layers,
    badge: '3D Meta 🏛️',
    desc: 'Interactive 3D Three.js classroom with immersive learning stations.'
  },
  {
    id: 'interview',
    label: 'Placement Mock Interviews',
    path: '/speakverse/interview',
    icon: GraduationCap,
    badge: 'Campus Prep 💼',
    desc: 'HR, Technical, and Behavioral interview simulations with structured rubrics.'
  },
  {
    id: 'learn',
    label: 'Bilingual Course Track',
    path: '/speakverse/learn',
    icon: BookOpen,
    badge: 'Telugu + English',
    desc: 'Structured placement syllabus with native Telugu contextual assistance.'
  },
  {
    id: 'progress',
    label: 'CEFR Analytics & Skills',
    path: '/speakverse/progress',
    icon: BarChart3,
    badge: 'Analytics 📊',
    desc: 'Detailed fluency, vocabulary retention, and CEFR level growth.'
  },
  {
    id: 'group',
    label: 'Group Discussions (GD)',
    path: '/speakverse/group-discussion',
    icon: Users,
    badge: 'GD Round 👥',
    desc: 'Practice multi-speaker college placement group discussions with AI peers.'
  }
];

export default function SpeakVersePortal({ user = null, setActiveTab = () => {} }) {
  const [activeModule, setActiveModule] = useState('home');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [frameKey, setFrameKey] = useState(1);
  const iframeRef = useRef(null);

  // Resolved scholar identity from Lumixora session
  const scholarEmail = (user?.email || 'scholar@lumixora.in').toLowerCase().trim();
  const scholarName = cleanScholarName(user?.name || user?.displayName || scholarEmail.split('@')[0]);
  const scholarCollege = user?.college || user?.collegeName || 'G. Pulla Reddy Engineering College (GPREC)';

  // Build Zero-Login SSO Bridge URL
  const buildSsoUrl = (targetPath = '/speakverse/home') => {
    const params = new URLSearchParams({
      email: scholarEmail,
      name: scholarName,
      college: scholarCollege,
      target: targetPath
    });
    return `${getSpeakVerseBaseUrl()}/sso?${params.toString()}`;
  };

  const [currentFrameUrl, setCurrentFrameUrl] = useState(() => buildSsoUrl('/speakverse/home'));

  // Update SSO URL if user identity loads/changes
  useEffect(() => {
    if (user?.email) {
      const activeMod = SPEAKVERSE_MODULES.find(m => m.id === activeModule);
      const targetPath = activeMod ? activeMod.path : '/speakverse/home';
      setCurrentFrameUrl(buildSsoUrl(targetPath));
    }
  }, [user?.email, user?.name]);

  const handleSelectModule = (module) => {
    setActiveModule(module.id);
    setCurrentFrameUrl(buildSsoUrl(module.path));
    setFrameKey(k => k + 1);
  };

  const handleRefresh = () => {
    setFrameKey(k => k + 1);
  };

  return (
    <div className={`w-full min-h-screen text-slate-100 flex flex-col transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[999999] bg-[#070710]' : 'space-y-6 pb-12'}`}>
      
      {/* ─── Top Premium Header & Navigation ──────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#120d2b] via-[#0d1430] to-[#070b1e] border-b border-purple-500/20 p-4 sm:p-6 rounded-3xl shadow-[0_10px_40px_rgba(139,92,246,0.12)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Brand Info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> LUMIXORA PREMIUM PORTAL 👑
              </span>
              <span className="text-gray-500 text-xs">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                <UserCheck className="w-3 h-3 text-emerald-400" /> Seamless SSO Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Lumixora SpeakVerse™</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-400/30 text-purple-300">
                AI Voice & 3D Metaverse
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
              AI-driven English speaking coach, 3D interactive virtual classrooms, and campus placement mock interviews adapted with native Telugu + English explanations.
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-center">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Portal View"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-purple-300" /> : <Maximize2 className="w-4 h-4 text-purple-300" />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Expand View'}</span>
            </button>

            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
              title="Refresh Module"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── Module Quick Switcher Ribbon ─────────────────────────────────── */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {SPEAKVERSE_MODULES.map((mod) => {
            const Icon = mod.icon;
            const isSelected = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => handleSelectModule(mod)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 border border-purple-400/50' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 hover:border-white/15'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-purple-400'}`} />
                <span>{mod.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${isSelected ? 'bg-black/30 text-amber-200' : 'bg-white/10 text-gray-400'}`}>
                  {mod.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Unified Single Sign-On Active Banner ────────────────────────────── */}
      <div className="bg-[#0b0e1b] border border-cyan-500/20 px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-gray-200">Unified Lumixora Single Sign-On:</span>
          <span className="text-gray-400 text-[11px]">Logged in as <strong className="text-cyan-300 font-bold">{scholarName}</strong> ({scholarEmail})</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Zero-Password Access Granted
          </span>
        </div>
      </div>

      {/* ─── Main Interactive Embed Frame ───────────────────────────────────── */}
      <div className={`relative w-full rounded-3xl overflow-hidden border border-purple-500/30 bg-[#06070d] shadow-2xl flex-1 flex flex-col ${isFullscreen ? 'h-full rounded-none border-none' : 'min-h-[780px]'}`}>
        
        {/* Frame Top Browser Bar */}
        <div className="bg-[#0e101d] px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 font-mono text-[11px] text-gray-300 font-semibold bg-white/5 px-3 py-1 rounded-md border border-white/5 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-cyan-400" />
              {currentFrameUrl.split('?')[0]}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-purple-400">Next.js 16 • Unified Lumixora SSO</span>
          </div>
        </div>

        {/* Embedded Live Iframe with Full Voice/Microphone Permissions */}
        <iframe
          key={frameKey}
          ref={iframeRef}
          src={currentFrameUrl}
          title="Lumixora SpeakVerse Live Portal"
          className="w-full flex-1 border-none min-h-[740px] bg-[#070710]"
          allow="microphone; camera; display-capture; autoplay; clipboard-write; clipboard-read; accelerometer; gyroscope; xr-spatial-tracking"
        />
      </div>

      {/* ─── Module Showcase Cards (Overview Grid) ─────────────────────────── */}
      {!isFullscreen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {SPEAKVERSE_MODULES.slice(1, 5).map((mod) => {
            const Icon = mod.icon;
            return (
              <div 
                key={mod.id} 
                onClick={() => handleSelectModule(mod)}
                className="bg-gradient-to-b from-[#101328] to-[#0a0c18] border border-white/10 hover:border-purple-500/40 p-5 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer group shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1 group-hover:text-purple-300 transition-colors">
                  {mod.label}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  {mod.desc}
                </p>
                <span className="text-xs font-extrabold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Module <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
