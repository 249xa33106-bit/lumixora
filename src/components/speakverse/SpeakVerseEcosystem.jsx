// ============================================================================
// LUMIXORA SpeakVerse™ — COMPLETE 8-STAGE LEARNING PATH ECOSYSTEM
// Tagline: "From Hesitation to Communication. From Communication to Confidence."
// Stages 01 to 08 with all 50+ Structured Curriculum Drills
// ============================================================================

import React, { useState } from 'react';
import { 
  BookOpen, CheckCircle2, ChevronRight, Play, Clock, 
  Sparkles, Award, Target, Flame, ArrowRight, Star,
  Languages, ShieldAlert, Check
} from 'lucide-react';
import { SPEAKVERSE_STAGES } from './SpeakVerseData';

export default function SpeakVerseEcosystem({ onSelectDrill = () => {} }) {
  const [activeStageNum, setActiveStageNum] = useState(1);

  const currentStage = SPEAKVERSE_STAGES.find(s => s.stage === activeStageNum) || SPEAKVERSE_STAGES[0];

  return (
    <div className="space-y-6">
      {/* ─── STAGE SELECTOR TABS (STAGES 01 TO 08) ───────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {SPEAKVERSE_STAGES.map(stg => {
          const isActive = stg.stage === activeStageNum;
          return (
            <button
              key={stg.stage}
              onClick={() => setActiveStageNum(stg.stage)}
              className={`px-4 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono font-black ${
                isActive ? 'bg-white text-indigo-700' : 'bg-slate-100 text-slate-700'
              }`}>
                0{stg.stage}
              </span>
              <div className="text-left">
                <span className="block text-[11px] leading-tight">{stg.title}</span>
                <span className={`text-[9px] uppercase font-mono ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {stg.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── ACTIVE STAGE BANNER ─────────────────────────────────────────── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 font-mono border border-indigo-100">
                Stage 0{currentStage.stage} • {currentStage.subtitle}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentStage.modules.length} Interactive Spoken Drills
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] font-sora">
              {currentStage.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {currentStage.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center min-w-[120px]">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Stage Completion</span>
              <span className="text-base font-black text-indigo-600 font-sora">
                {currentStage.stage === 1 ? '4 / 10 Mastered' : (currentStage.stage === 4 ? '3 / 6 Mastered' : '0 / ' + currentStage.modules.length)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODULE DRILL CARDS (ALL MODULES FOR CURRENT STAGE) ──────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentStage.modules.map((mod, idx) => {
          return (
            <div
              key={mod.id}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 font-mono font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-bold">
                      {mod.duration}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono font-bold">
                      {mod.difficulty}
                    </span>
                  </div>
                </div>

                <h4 className="text-base font-black text-[#0F172A] font-sora group-hover:text-indigo-600 transition-colors">
                  {mod.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {mod.desc}
                </p>

                {/* Bilingual Telugu Hint if Stage 1 or present */}
                {mod.teluguHint && (
                  <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2">
                    <Languages className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>తెలుగు వివరణ:</strong> {mod.teluguHint}</span>
                  </div>
                )}

                {/* Target Skills Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mod.targetSkills?.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100/80 text-slate-600 font-medium font-mono"
                    >
                      #{skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Spoken Drill Prompt Box */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 italic">
                  "{mod.prompt}"
                </div>

                <button
                  onClick={() => onSelectDrill(mod)}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 group-hover:shadow-indigo-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch Spoken Drill</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
