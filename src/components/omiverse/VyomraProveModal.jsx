import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, X, Award, CheckCircle, Code, Rocket, 
  Terminal, Bot, ExternalLink, Sparkles, AlertCircle, ChevronRight, RefreshCw, FileText, ArrowRight
} from 'lucide-react';
import { PROVE_VERIFICATION_LEVELS, calculateRealProveSkills, getRealStudentActivities } from '../../services/omiverseService';
import { useData } from '../../context/DataContext';

export default function VyomraProveModal({ isOpen, onClose, onNavigateTab, user }) {
  const { tasks = [], doubts = [], notes = [] } = useData() || {};

  const activities = useMemo(() => {
    return getRealStudentActivities(user, { tasks, doubts, notes });
  }, [user, tasks, doubts, notes]);

  const skills = useMemo(() => {
    return calculateRealProveSkills(user, activities);
  }, [user, activities]);

  const [selectedSkillId, setSelectedSkillId] = useState('dsa');
  const selectedSkill = skills.find(s => s.id === selectedSkillId) || skills[0];

  if (!isOpen) return null;

  const currentLevelObj = PROVE_VERIFICATION_LEVELS.find(l => l.level === selectedSkill?.level) || PROVE_VERIFICATION_LEVELS[0];
  const nextLevelObj = PROVE_VERIFICATION_LEVELS.find(l => l.level === (selectedSkill?.level || 1) + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0a0d14] border border-amber-500/30 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.2)] overflow-hidden my-auto">
        
        {/* Top Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-40 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-7 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 text-black font-black">
              <ShieldCheck className="w-7 h-7 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  VYOMRA <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">PROVE</span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                  The Trust Layer
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Don't just claim your skills. <strong className="text-amber-300">Prove them</strong> with multi-channel verifiable evidence.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Level Verification Ladder Banner */}
        <div className="px-5 sm:px-7 py-4 bg-white/[0.02] border-b border-white/5 relative z-10">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <span>5 Verification Tiers of Vyomra Trust</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PROVE_VERIFICATION_LEVELS.map((lvl) => {
              const isActive = selectedSkill?.level >= lvl.level;
              const isCurrent = selectedSkill?.level === lvl.level;
              return (
                <div 
                  key={lvl.level}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isCurrent 
                      ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-400' 
                      : isActive 
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : 'bg-white/5 border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-black">
                    <span className={isCurrent ? 'text-amber-300' : isActive ? 'text-emerald-400' : 'text-gray-400'}>
                      Level {lvl.level}
                    </span>
                    {isActive && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <p className="text-xs font-bold text-white mt-0.5 truncate">{lvl.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content: Left Skills Sidebar + Right Evidence Audit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-7 relative z-10">
          
          {/* Left Column: Verified Skills List */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">Your Proven Skills</span>
              <span className="text-[11px] font-bold text-amber-400">{skills.length} Active</span>
            </div>
            
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {skills.map((skill) => {
                const isSelected = selectedSkill?.id === skill.id;
                const lvl = PROVE_VERIFICATION_LEVELS.find(l => l.level === skill.level);
                return (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkillId(skill.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'bg-gradient-to-r from-amber-500/20 to-teal-500/15 border-amber-400/60 shadow-lg shadow-amber-500/10' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-black text-white">{skill.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${lvl?.bg} ${lvl?.color} border ${lvl?.border}`}>
                          Level {skill.level}: {lvl?.title}
                        </span>
                        <span className="text-[10px] text-gray-400">• {skill.evidenceCount} proof{skill.evidenceCount === 1 ? '' : 's'}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-amber-300">{skill.overallScore}</span>
                      <span className="text-[10px] text-gray-400 block">/100</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Skill Deep-Dive & Evidence Audit */}
          {selectedSkill && (
            <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-5">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg sm:text-xl font-black text-white">{selectedSkill.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[11px] font-black border border-amber-400/40">
                      Score: {selectedSkill.overallScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Verified Status: <span className="text-white font-bold">{currentLevelObj?.badge || 'Level 1: Claimed'}</span> — {currentLevelObj?.desc}
                  </p>
                </div>
              </div>

              {/* Next Level Advancement Requirement Card */}
              {selectedSkill.level < 5 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-teal-500/15 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-amber-500/5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                        Level {selectedSkill.level + 1} ({nextLevelObj?.title}) Requirement
                      </span>
                    </div>
                    <p className="text-xs text-gray-200 font-medium leading-relaxed">
                      {selectedSkill.nextGoal}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab(selectedSkill.worldTarget || 'coding-practice');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95"
                  >
                    <span>{selectedSkill.worldLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Multi-Channel Evidence Radar Breakdown */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-gray-400 block mb-3">
                  Multi-Channel Evidence Audit Scores
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(selectedSkill.breakdown).map(([key, score]) => {
                    const label = key === 'problemSolving' ? 'Problem Solving' : key.charAt(0).toUpperCase() + key.slice(1);
                    return (
                      <div key={key} className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 font-medium">{label}</span>
                          <span className="font-black text-white">{score}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-400 to-teal-400 rounded-full transition-all duration-700"
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verified Audit Log & Recent Evidence */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/25 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                    <Award className="w-4 h-4" />
                    <span>Active Audit Record & Verifiable Evidence</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{selectedSkill.verifiedAt}</span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed font-medium">
                  {selectedSkill.recentEvidence}
                </p>
              </div>

              {/* Action Buttons to practice in Omiverse */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('coding-practice');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Solve in Codeverse</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('projects');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Attach Buildverse Project</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('future-twin');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Mock Interview Proof</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
