import React from 'react';
import LuminaReal3DScene from '../components/Lumina3DClassroom/LuminaReal3DScene';
import { Sparkles, BarChart2 } from 'lucide-react';

/**
 * 🌟 Lumixora Crystal Emblem
 */
function LumixoraFlowerEmblem({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="lumina3dEmblem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
      </defs>
      <path d="M50 8 C42 24, 42 38, 50 48 C58 38, 58 24, 50 8 Z" fill="url(#lumina3dEmblem)" />
      <path d="M50 92 C42 76, 42 62, 50 52 C58 62, 58 76, 50 92 Z" fill="url(#lumina3dEmblem)" />
      <path d="M8 50 C24 42, 38 42, 48 50 C38 58, 24 58, 8 50 Z" fill="url(#lumina3dEmblem)" />
      <path d="M92 50 C76 42, 62 42, 52 50 C62 58, 76 58, 92 50 Z" fill="url(#lumina3dEmblem)" />
      <circle cx="50" cy="50" r="5" fill="#ffffff" />
    </svg>
  );
}

export default function PersonalMentor({ user, setActiveTab: setPlatformTab, onBackHome }) {
  const studentName = user?.name || user?.displayName || 'Scholar';

  return (
    <div className="fixed inset-0 z-50 bg-[#090614] text-white flex flex-col justify-between overflow-hidden select-none">
      
      {/* ─── 1. TOP HEADER (MATCHING USER REFERENCE DESIGN) ─── */}
      <header className="absolute top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
        
        {/* Brand & Mentor Status */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <LumixoraFlowerEmblem className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-widest uppercase text-white font-sans">LUMIXORA</span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] font-black uppercase tracking-wider">
                Lumina AI
              </span>
            </div>
            <p className="text-[11px] text-purple-300/80 font-medium tracking-tight">Your Personal Polymath Mentor</p>
          </div>
        </div>

        {/* Right Action Pills */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Lumina Studio Active Pill */}
          <button 
            className="px-4 py-2 rounded-full text-xs font-bold transition-all bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer border border-purple-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>Lumina Studio</span>
          </button>

          {/* Study Analytics Pill */}
          <button 
            onClick={() => {
              if (setPlatformTab) setPlatformTab('learning-hub');
            }}
            className="px-4 py-2 rounded-full text-xs font-bold transition-all bg-black/60 hover:bg-black/90 border border-white/20 text-gray-200 hover:text-white flex items-center gap-1.5 cursor-pointer shadow-xl backdrop-blur-md"
          >
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Study Analytics</span>
          </button>

          {/* Exit Studio Button */}
          <button
            onClick={() => {
              if (onBackHome) onBackHome();
              else if (setPlatformTab) setPlatformTab('dashboard');
              else window.location.hash = '';
            }}
            className="px-4 py-2 rounded-full text-xs font-bold transition-all bg-black/60 hover:bg-black/90 border border-white/20 text-gray-200 hover:text-white cursor-pointer shadow-xl backdrop-blur-md"
          >
            ← Exit Studio
          </button>
        </div>

      </header>

      {/* ─── 2. THE REAL 3D PHYSICAL CLASSROOM & RIGGED HUMAN MODEL ─── */}
      <main className="w-full h-full absolute inset-0">
        <LuminaReal3DScene studentName={studentName} />
      </main>

    </div>
  );
}
