import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, ShieldCheck, ArrowRight, TrendingUp, Award, 
  Code, Rocket, Bot, Users, CheckCircle2, Zap
} from 'lucide-react';
import { calculateStudentDna, getNextBestAction, getRealStudentActivities } from '../../services/omiverseService';
import { useData } from '../../context/DataContext';

export default function StudentDnaCard({ user, onNavigateTab, onOpenProveModal }) {
  const { tasks = [], doubts = [], notes = [] } = useData() || {};
  const [version, setVersion] = useState(0);

  // Listen for local activity updates across the browser session
  useEffect(() => {
    const handleUpdate = () => setVersion(v => v + 1);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('lumixora_activity_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('lumixora_activity_updated', handleUpdate);
    };
  }, []);

  const activities = useMemo(() => {
    return getRealStudentActivities(user, { tasks, doubts, notes });
  }, [user, tasks, doubts, notes, version]);

  const dna = useMemo(() => {
    return calculateStudentDna(user, activities);
  }, [user, activities]);

  const nextAction = useMemo(() => {
    return getNextBestAction(dna, user);
  }, [dna, user]);

  const metrics = [
    { label: 'Technical Skills', score: dna.technicalSkills, icon: Code, color: 'text-sky-400', bar: 'bg-sky-400' },
    { label: 'Problem Solving', score: dna.problemSolving, icon: Zap, color: 'text-emerald-400', bar: 'bg-emerald-400' },
    { label: 'Verified Projects', score: dna.projectsScore, icon: Rocket, color: 'text-amber-400', bar: 'bg-amber-400' },
    { label: 'Interview Readiness', score: dna.interviewReadiness, icon: Bot, color: 'text-purple-400', bar: 'bg-purple-400' },
    { label: 'Communication', score: dna.communication, icon: Users, color: 'text-pink-400', bar: 'bg-pink-400' },
    { label: 'Leadership & Collab', score: dna.leadership, icon: Award, color: 'text-teal-400', bar: 'bg-teal-400' }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-[#0c0f17] via-[#0a0d14] to-[#121524] border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden space-y-6">
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header with Title and Trust Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-teal-400 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                AI CAREER BRAIN <span className="text-gray-400 text-sm font-medium">| Student DNA & Talent Graph</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase border border-emerald-500/30">
                Live Evidence Sync
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Continuous multi-world evidence synthesis powering your verified career readiness score.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenProveModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>VYOMRA PROVE (Trust Layer)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left DNA Radar Stats + Right Next Best Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left: 6 Core DNA Dimension Bars */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">
              Talent Graph Dimensions
            </span>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <span>{dna.tier}</span>
              <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-black">
                {dna.rankLabel}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${m.color}`} />
                    <span className="text-sm font-black text-white">{m.score}/100</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-300 truncate">{m.label}</p>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-1.5">
                      <div 
                        className={`h-full ${m.bar} rounded-full transition-all duration-700`}
                        style={{ width: `${m.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Next Best Action Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-teal-500/10 border border-amber-400/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                  AI Next Best Action
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-200 text-[10px] font-bold border border-amber-400/30">
                {nextAction?.worldName || 'OMIVERSE'}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-black text-white leading-snug">
              {nextAction?.title || 'Explore Your Learning Journey'}
            </h4>

            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              {nextAction?.description || 'Take your next step in the Vyomra Omiverse to earn verified skill credentials.'}
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold text-emerald-300">
              ✨ {nextAction?.points || '+50 XP'}
            </span>
            <button
              onClick={() => onNavigateTab(nextAction?.targetTab || 'coding-practice')}
              className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs shadow-md hover:bg-gray-200 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>{nextAction?.ctaText || 'Get Started'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
