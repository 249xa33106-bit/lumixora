import React from 'react';
import {
  Award, TrendingUp, CheckCircle2, Zap, Target, Star,
  ShieldCheck, BarChart2, Flame, ArrowUpRight, Clock
} from 'lucide-react';

export default function NexusPerformanceAnalytics({
  session,
  activeRole,
  submissions = []
}) {
  const overallScore = 92;
  const metrics = [
    { label: 'Technical & Domain Rigor', value: 94, max: 100, color: 'from-cyan-400 to-blue-500' },
    { label: 'Sprint Speed & Velocity', value: 90, max: 100, color: 'from-emerald-400 to-teal-500' },
    { label: 'Analytical Polish & Evidence', value: 95, max: 100, color: 'from-purple-400 to-indigo-500' },
    { label: 'Consistency & Daily Check-ins', value: 88, max: 100, color: 'from-amber-400 to-orange-500' },
    { label: 'Cross-Department Collaboration', value: 92, max: 100, color: 'from-pink-400 to-rose-500' }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* ── HEADER BANNER ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-purple-400">
              PERFORMANCE TELEMETRY
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs font-bold text-slate-300">Executive Skill Development</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Performance Analytics & Growth Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Objective performance scoring based on milestone rubrics, peer reviews, technical depth, and velocity.
          </p>
        </div>

        {/* Big Score Card */}
        <div className="flex items-center gap-4 bg-white/[0.04] border border-white/10 p-4 rounded-2xl backdrop-blur-md self-start md:self-auto shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Performance Index</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black text-white">{overallScore}</span>
              <span className="text-xs text-slate-500 font-bold">/ 100</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">Top 5% Cohort Velocity</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── SKILL BREAKDOWN RADAR BARS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Competencies Card */}
        <div className="rounded-3xl bg-[#0a0e19] border border-white/10 p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Competency Breakdown</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400 font-bold">Weighted Index</span>
          </div>

          <div className="space-y-4">
            {metrics.map((m, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{m.label}</span>
                  <span className="font-mono font-bold text-white">{m.value} / {m.max}</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-500`}
                    style={{ width: `${(m.value / m.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Insights & Founder Notes */}
        <div className="rounded-3xl bg-[#0a0e19] border border-white/10 p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Personal Improvement Insights</span>
            </h2>
            <span className="text-xs font-bold text-amber-400">Founder Notes</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Primary Strength</span>
              <h4 className="font-bold text-white">Consistent High-Signal Analytical Execution</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Demonstrated outstanding problem framing and evidence gathering on Week 01 deliverables. The methodology is structured and aligns with production standards.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Next Growth Frontier</span>
              <h4 className="font-bold text-white">Cross-Department Knowledge Sharing</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Recommend sharing deliverable findings during weekly standup with other tracks (e.g. Marketing findings feed Content creation assets).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Letter of Recommendation (LOR) Track</span>
              <h4 className="font-bold text-white">Eligible for Founder LOR</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Current performance score (92) qualifies for official Letter of Recommendation signed by Founder Shaik Sowban upon completion of Batch 01.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
