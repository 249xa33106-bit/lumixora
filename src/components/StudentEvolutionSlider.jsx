import React, { useState } from 'react';
import { 
  TrendingUp, Award, Sparkles, Brain, CheckCircle2, 
  AlertCircle, Briefcase, Zap, Terminal, ArrowRight, ShieldCheck, 
  ChevronRight, Laptop, Target, Code2, Flame
} from 'lucide-react';

/* ─── WEB AUDIO SOUND HELPER ─── */
const playSliderTick = (freq = 440) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (e) {}
};

const STAGES = [
  {
    stage: 1,
    title: 'Year 1–2: Foundation Phase',
    subtitle: 'Standard Service Firm Baseline',
    ctc: '₹3.5 LPA – ₹4.5 LPA',
    ctcSubtitle: 'Standard Mass Recruitment Package',
    readinessScore: 28,
    stressLevel: 'Developing',
    readinessColor: 'from-amber-500 via-yellow-500 to-amber-400',
    description: 'Focusing on core programming fundamentals, academic subjects, and building initial problem-solving confidence.',
    signals: [
      { label: 'Core Programming', val: 'Basic / Learning', status: 'weak', pct: 30, icon: Code2 },
      { label: 'Practical Projects', val: '1 Academic Project', status: 'weak', pct: 25, icon: Laptop },
      { label: 'Mock Practice', val: 'Getting Started', status: 'weak', pct: 20, icon: Zap },
      { label: 'Placement Readiness', val: 'Foundation Stage', status: 'weak', pct: 28, icon: Target }
    ],
    statusPill: 'Foundation Stage'
  },
  {
    stage: 2,
    title: 'Year 3: Skill Acceleration',
    subtitle: 'Differential & Specialized Hiring Track',
    ctc: '₹6.5 LPA – ₹9.0 LPA',
    ctcSubtitle: 'Specialized MNC Tracks & Fast-Growing Startups',
    readinessScore: 70,
    stressLevel: 'Consistent',
    readinessColor: 'from-purple-500 via-indigo-500 to-cyan-400',
    description: 'Actively solving DSA problems in Code Arena, participating in BoloClass sessions, and building verified full-stack applications.',
    signals: [
      { label: 'DSA & Problem Solving', val: '72% Consistent', status: 'good', pct: 72, icon: Code2 },
      { label: 'Hands-On Projects', val: '2 Deployed Apps', status: 'good', pct: 68, icon: Laptop },
      { label: 'Mock Interview Practice', val: '6 Rounds Cleared', status: 'good', pct: 70, icon: Zap },
      { label: 'Resume Signal', val: 'ATS Optimized', status: 'good', pct: 85, icon: Target }
    ],
    statusPill: 'Differential Ready'
  },
  {
    stage: 3,
    title: 'Year 4: Product & Core Tech Ready',
    subtitle: 'Top-Tier Campus Placement Drives',
    ctc: '₹10 LPA – ₹16 LPA',
    ctcSubtitle: 'Top Product Firms & Premium Campus Offers',
    readinessScore: 88,
    stressLevel: 'Prepared & Confident',
    readinessColor: 'from-cyan-400 via-teal-400 to-emerald-400',
    description: 'Confidently clearing technical interviews, holding verifiable Proof-of-Skill credentials, and standing out in top campus drives.',
    signals: [
      { label: 'DSA & Core Fundamentals', val: '85% Advanced', status: 'elite', pct: 85, icon: Code2 },
      { label: 'Verified Web/App Projects', val: '3 Production Apps', status: 'elite', pct: 90, icon: Laptop },
      { label: 'Mock Interview Clearance', val: '12 Cleared Rounds', status: 'elite', pct: 92, icon: Zap },
      { label: 'Campus Placement Rank', val: 'Top 5% Batch Tier', status: 'elite', pct: 95, icon: Target }
    ],
    statusPill: 'Top Batch Verified'
  }
];

export default function StudentEvolutionSlider({ onGetStarted }) {
  const [sliderVal, setSliderVal] = useState(50); // 0 to 100

  // Derive current stage based on slider percentage
  let stageIdx = 0;
  if (sliderVal < 33) stageIdx = 0;
  else if (sliderVal < 68) stageIdx = 1;
  else stageIdx = 2;

  const current = STAGES[stageIdx];

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setSliderVal(val);
    playSliderTick(350 + val * 5);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-black text-cyan-400 uppercase tracking-wider shadow-sm">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          Interactive Trajectory Simulator
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#101A35] tracking-tight">
          Where Are You in Your Engineering Journey?
        </h2>
        <p className="text-sm text-gray-600">
          Drag the interactive slider below to see how Lumixora guides engineering scholars from foundational mass-hiring baselines to Tier-1 sovereign product offers.
        </p>
      </div>

      {/* ── Outer Interactive Card ── */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#090d18] to-[#040710] border border-cyan-500/30 shadow-[0_20px_70px_rgba(0,0,0,0.5)] p-6 sm:p-10 text-white relative overflow-hidden">
        {/* Ambient Gradient Flares */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* ── The Tactile Scrubber Bar ── */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className={`px-2.5 py-1 rounded-lg border transition-all ${stageIdx === 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20' : 'text-gray-400 border-transparent'}`}>
              YEAR 1 (FRESHER)
            </span>
            <span className={`px-2.5 py-1 rounded-lg border transition-all ${stageIdx === 1 ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/20' : 'text-gray-400 border-transparent'}`}>
              YEAR 2–3 (BUILDER)
            </span>
            <span className={`px-2.5 py-1 rounded-lg border transition-all ${stageIdx === 2 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/20' : 'text-gray-400 border-transparent'}`}>
              YEAR 4 (SOVEREIGN)
            </span>
          </div>

          <div className="relative pt-1">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              onChange={handleSliderChange}
              className="w-full h-3.5 bg-black/60 rounded-full appearance-none cursor-pointer accent-cyan-400 focus:outline-none border border-white/10 relative z-10"
            />
            {/* Visual gradient fill behind slider */}
            <div 
              className="absolute top-1 left-0 h-3.5 bg-gradient-to-r from-amber-500 via-indigo-500 to-cyan-400 rounded-full pointer-events-none transition-all duration-75 shadow-sm shadow-cyan-500/30"
              style={{ width: `${sliderVal}%` }}
            />
          </div>

          {/* Quick Stage Click Buttons */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {STAGES.map((s, idx) => {
              const isSelected = stageIdx === idx;
              return (
                <button
                  key={s.stage}
                  onClick={() => {
                    playSliderTick(500 + idx * 200);
                    setSliderVal(idx === 0 ? 10 : idx === 1 ? 50 : 90);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-black font-mono transition-all text-center cursor-pointer flex items-center justify-center gap-2 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-cyan-500/25 to-purple-500/25 text-white border border-cyan-400/60 shadow-lg shadow-cyan-500/20 scale-[1.02]' 
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-gray-500'}`} />
                  <span>{s.title.split(':')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Stage Content Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 border-t border-white/10">
          
          {/* Left: Stage Title & Narrative */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                stageIdx === 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                stageIdx === 1 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {current.statusPill}
              </span>
              <span className="text-xs text-gray-400 font-mono">Stage {current.stage} of 3</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-cyan-400 font-bold font-mono">
              {current.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
              {current.description}
            </p>

            {/* 4 Signals Grid with Mini Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {current.signals.map((sig, i) => {
                const Icon = sig.icon;
                return (
                  <div key={i} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-gray-400" />
                        {sig.label}
                      </span>
                      <span className={`text-xs font-black font-mono ${
                        sig.status === 'weak' ? 'text-amber-400' :
                        sig.status === 'good' ? 'text-cyan-300' : 'text-emerald-400'
                      }`}>
                        {sig.val}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          sig.status === 'weak' ? 'bg-amber-400' :
                          sig.status === 'good' ? 'bg-gradient-to-r from-purple-500 to-cyan-400' : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                        }`}
                        style={{ width: `${sig.pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Salary & Readiness Gauge */}
          <div className="lg:col-span-5 p-7 rounded-3xl bg-gradient-to-b from-[#0e1628]/95 via-[#080d18]/95 to-[#04060c]/95 border border-cyan-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl shadow-cyan-950/40">
            <div className="text-xs font-mono font-black uppercase tracking-widest text-cyan-400 mb-1">
              Projected Starting CTC
            </div>
            
            <div className="text-3xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white my-1.5 drop-shadow-[0_0_20px_rgba(8,191,208,0.5)]">
              {current.ctc}
            </div>
            <div className="text-xs text-gray-400 font-medium mb-5">
              {current.ctcSubtitle}
            </div>

            {/* Readiness Score Progress */}
            <div className="w-full space-y-2 pt-4 border-t border-white/10">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">Placement Readiness:</span>
                <span className="font-black text-cyan-300">{current.readinessScore}%</span>
              </div>
              <div className="w-full bg-black/60 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div 
                  className={`h-full bg-gradient-to-r ${current.readinessColor} transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(8,191,208,0.7)]`}
                  style={{ width: `${current.readinessScore}%` }}
                />
              </div>
            </div>

            {/* Call to action button */}
            <button
              onClick={() => onGetStarted && onGetStarted('student')}
              className="mt-6 w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:brightness-110 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer transform hover:scale-[1.02]"
            >
              <span>Accelerate Your Growth on Lumixora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
