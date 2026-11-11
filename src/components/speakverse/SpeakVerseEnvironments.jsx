import React, { useState } from 'react';
import { 
  GraduationCap, Users, Briefcase, Building2, Mic, 
  MessageCircle, ShieldAlert, Rocket, Play, ChevronRight, 
  Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import { SPEAKVERSE_ENVIRONMENTS } from './SpeakVerseData';

export default function SpeakVerseEnvironments({ onSelectScenario = () => {} }) {
  const [selectedEnvId, setSelectedEnvId] = useState('classroom');

  const selectedEnv = SPEAKVERSE_ENVIRONMENTS.find(e => e.id === selectedEnvId) || SPEAKVERSE_ENVIRONMENTS[0];

  const getIcon = (name) => {
    switch (name) {
      case 'GraduationCap': return GraduationCap;
      case 'Users': return Users;
      case 'Briefcase': return Briefcase;
      case 'Building2': return Building2;
      case 'Mic': return Mic;
      case 'MessageCircle': return MessageCircle;
      case 'ShieldAlert': return ShieldAlert;
      case 'Rocket': return Rocket;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── 8 ENVIRONMENT SELECTOR GRID ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {SPEAKVERSE_ENVIRONMENTS.map(env => {
          const IconComp = getIcon(env.iconName);
          const isSelected = env.id === selectedEnvId;
          return (
            <button
              key={env.id}
              onClick={() => setSelectedEnvId(env.id)}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-[1.03]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <IconComp className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
              <span className="text-[11px] font-black leading-tight line-clamp-1">
                {env.name}
              </span>
              <span className={`text-[9px] font-mono uppercase ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                {env.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── ENVIRONMENT DETAILS & BANNER ────────────────────────────────── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 font-mono border border-indigo-100">
                Immersive Environment
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedEnv.scenarios.length} Practice Scenarios
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] font-sora">
              {selectedEnv.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {selectedEnv.tagline}
            </p>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
              Live Roleplay Armed
            </span>
          </div>
        </div>

        {/* ─── SCENARIOS CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedEnv.scenarios.map((sc, i) => (
            <div
              key={sc.id}
              className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Scenario 0{i + 1}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    High-Stakes Situation
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-[#0F172A] font-sora">
                  {sc.title}
                </h4>

                {/* Context Box */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-0.5">Situation Context:</span>
                  {sc.context}
                </div>

                {/* Objective */}
                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 leading-relaxed font-medium">
                  <span className="font-bold text-indigo-700 block mb-0.5">Your Mission Objective:</span>
                  {sc.objective}
                </div>

                {/* Evaluation Rubrics */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sc.rubric.map((rb, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 font-semibold font-mono">
                      ✓ {rb}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectScenario({
                  title: `${selectedEnv.name} • ${sc.title}`,
                  prompt: `${sc.context} \nObjective: ${sc.objective}`,
                  badge: selectedEnv.name,
                  duration: '15 mins',
                  targetSkills: sc.rubric
                })}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Enter Room & Begin Spoken Roleplay</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
