import React, { useState } from 'react';
import { 
  TrendingUp, Award, Sparkles, Brain, CheckCircle2, 
  AlertCircle, Briefcase, Zap, Terminal, ArrowRight, ShieldCheck, 
  ChevronRight, Laptop, Target
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
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
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
    readinessColor: 'from-amber-500 to-yellow-500',
    description: 'Focusing on core programming fundamentals, academic subjects, and building initial problem-solving confidence.',
    signals: [
      { label: 'Core Programming', val: 'Basic / Learning', status: 'weak' },
      { label: 'Practical Projects', val: '1 Academic Project', status: 'weak' },
      { label: 'Mock Practice', val: 'Getting Started', status: 'weak' },
      { label: 'Placement Readiness', val: 'Foundation Stage', status: 'weak' }
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
    readinessColor: 'from-[#7553E8] to-[#08BFD0]',
    description: 'Actively solving DSA problems in Code Arena, participating in BoloClass sessions, and building verified full-stack applications.',
    signals: [
      { label: 'DSA & Problem Solving', val: '72% Consistent', status: 'good' },
      { label: 'Hands-On Projects', val: '2 Deployed Apps', status: 'good' },
      { label: 'Mock Interview Practice', val: '6 Rounds Cleared', status: 'good' },
      { label: 'Resume Signal', val: 'ATS Optimized', status: 'good' }
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
    readinessColor: 'from-[#08BFD0] to-[#00B987]',
    description: 'Confidently clearing technical interviews, holding verifiable Proof-of-Skill credentials, and standing out in top campus drives.',
    signals: [
      { label: 'DSA & Core Fundamentals', val: '85% Advanced', status: 'elite' },
      { label: 'Verified Web/App Projects', val: '3 Production Apps', status: 'elite' },
      { label: 'Mock Interview Clearance', val: '12 Cleared Rounds', status: 'elite' },
      { label: 'Campus Placement Rank', val: 'Top 5% Batch Tier', status: 'elite' }
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7553E8]/10 border border-[#7553E8]/30 text-xs font-bold text-[#7553E8] uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5" />
          Interactive Trajectory Simulator
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#101A35] tracking-tight">
          Where Are You in Your Engineering Journey?
        </h2>
        <p className="text-sm text-gray-600">
          Drag the slider to see how Lumixora transforms a confused college fresher into a top-tier sovereign engineer.
        </p>
      </div>

      {/* ── Outer Interactive Card ── */}
      <div className="rounded-3xl bg-[#101A35] border border-white/10 shadow-2xl p-6 sm:p-10 text-white relative overflow-hidden">
        {/* Ambient Gradient Blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7553E8]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#08BFD0]/15 rounded-full blur-3xl pointer-events-none" />

        {/* ── The Tactile Scrubber Bar ── */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-gray-300">
            <span className="font-bold text-gray-400">YEAR 1 (FRESHER)</span>
            <span className="font-bold text-[#08BFD0]">YEAR 2–3 (BUILDER)</span>
            <span className="font-bold text-[#00B987]">YEAR 4 (SOVEREIGN)</span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              onChange={handleSliderChange}
              className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#08BFD0] focus:outline-none"
            />
            {/* Visual gradient fill behind slider */}
            <div 
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-rose-500 via-[#7553E8] to-[#00B987] rounded-lg pointer-events-none transition-all duration-75"
              style={{ width: `${sliderVal}%` }}
            />
          </div>

          {/* Quick Stage Click Buttons */}
          <div className="flex justify-between gap-2 pt-1">
            {STAGES.map((s, idx) => (
              <button
                key={s.stage}
                onClick={() => {
                  playSliderTick(500 + idx * 200);
                  setSliderVal(idx === 0 ? 10 : idx === 1 ? 50 : 90);
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  stageIdx === idx 
                    ? 'bg-white/15 text-white border border-white/30 shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {s.title.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* ── Stage Content Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 border-t border-white/10">
          
          {/* Left: Stage Title & Narrative */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                stageIdx === 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                stageIdx === 1 ? 'bg-[#7553E8]/20 text-[#08BFD0] border border-[#7553E8]/30' :
                'bg-[#00B987]/20 text-[#00B987] border border-[#00B987]/30'
              }`}>
                {current.statusPill}
              </span>
              <span className="text-xs text-gray-400 font-mono">Stage {current.stage} of 3</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#08BFD0] font-semibold">
              {current.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {current.description}
            </p>

            {/* 4 Signals Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {current.signals.map((sig, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="text-[11px] text-gray-400 font-medium">{sig.label}</div>
                  <div className={`text-sm font-bold font-mono mt-0.5 ${
                    sig.status === 'weak' ? 'text-rose-400' :
                    sig.status === 'good' ? 'text-[#08BFD0]' : 'text-[#00B987]'
                  }`}>
                    {sig.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Salary & Readiness Gauge */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white/[0.03] border border-white/15 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 mb-1">
              Projected Starting CTC
            </div>
            
            <div className="text-3xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white my-1">
              {current.ctc}
            </div>
            <div className="text-xs text-gray-400 font-medium mb-4">
              {current.ctcSubtitle}
            </div>

            {/* Readiness Score Progress */}
            <div className="w-full space-y-2 pt-3 border-t border-white/10">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">Placement Readiness:</span>
                <span className="font-bold text-white">{current.readinessScore}%</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${current.readinessColor} transition-all duration-300 rounded-full`}
                  style={{ width: `${current.readinessScore}%` }}
                />
              </div>
            </div>

            {/* Call to action button */}
            <button
              onClick={() => onGetStarted && onGetStarted('student')}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7553E8] to-[#08BFD0] hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#7553E8]/25 transition-all cursor-pointer"
            >
              <span>Accelerate Your Growth on Lumixora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
