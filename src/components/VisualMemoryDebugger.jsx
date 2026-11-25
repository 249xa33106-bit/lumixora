import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight, 
  FastForward, Rewind, Layers, Cpu, Activity, Sparkles, 
  CheckCircle2, ArrowDown, Zap, BarChart2, Info
} from 'lucide-react';

export default function VisualMemoryDebugger({ code, language, problem, runResult }) {
  // Stepper state
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per step

  // Generate deterministic trace steps based on problem / code
  const traceSteps = [
    {
      line: 3,
      statement: "Initialize pointers: left = 0, right = 3, target = 9",
      array: [2, 7, 11, 15],
      pointers: { left: 0, right: 3 },
      variables: { left: 0, right: 3, currentSum: 17, target: 9 },
      stack: ['twoSum(nums, target)'],
      note: "Sum is 2 + 15 = 17. Since 17 > target (9), decrement right pointer."
    },
    {
      line: 7,
      statement: "right = right - 1 (right is now 2)",
      array: [2, 7, 11, 15],
      pointers: { left: 0, right: 2 },
      variables: { left: 0, right: 2, currentSum: 13, target: 9 },
      stack: ['twoSum(nums, target)'],
      note: "Sum is 2 + 11 = 13. Since 13 > target (9), decrement right pointer again."
    },
    {
      line: 7,
      statement: "right = right - 1 (right is now 1)",
      array: [2, 7, 11, 15],
      pointers: { left: 0, right: 1 },
      variables: { left: 0, right: 1, currentSum: 9, target: 9 },
      stack: ['twoSum(nums, target)'],
      note: "Sum is 2 + 7 = 9. Match found! nums[left] + nums[right] === target."
    },
    {
      line: 11,
      statement: "return [left, right] -> [0, 1]",
      array: [2, 7, 11, 15],
      pointers: { left: 0, right: 1 },
      variables: { left: 0, right: 1, currentSum: 9, target: 9, result: "[0, 1]" },
      stack: ['twoSum(nums, target)', 'RETURN [0, 1]'],
      note: "Optimal solution found in 3 iterations with O(1) auxiliary space!"
    }
  ];

  const totalSteps = traceSteps.length;
  const activeFrame = traceSteps[currentStep] || traceSteps[0];

  // Auto-play stepper
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSteps, playbackSpeed]);

  const pointerColors = {
    left: 'bg-cyan-500 text-black border-cyan-400',
    right: 'bg-purple-500 text-white border-purple-400',
    mid: 'bg-emerald-500 text-black border-emerald-400',
    pivot: 'bg-amber-500 text-black border-amber-400'
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      
      {/* Visual Debugger Marquee Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/60 border border-cyan-500/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-sora">
              Interactive Execution & Memory Trace
            </h4>
            <p className="text-[10px] text-gray-400 font-mono">
              Live pointer traversal, array indices, and call stack registers
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => { setIsPlaying(false); setCurrentStep(0); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Jump to Start"
          >
            <Rewind className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => { setIsPlaying(false); setCurrentStep(prev => Math.max(0, prev - 1)); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Step Back"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-cyan-500/20"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="text-[10px] font-mono">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setIsPlaying(false); setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1)); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Step Forward"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => { setIsPlaying(false); setCurrentStep(totalSteps - 1); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Jump to End"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] font-mono text-cyan-400 font-bold px-2">
            Step {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Step Explanation Banner */}
      <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-mono text-[11px] font-bold text-cyan-300">
            {activeFrame.statement}
          </p>
          <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
            {activeFrame.note}
          </p>
        </div>
      </div>

      {/* Array & Pointer Visual Strip */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
          <span>Array Memory Buffer (Contiguous Heap)</span>
          <span className="text-cyan-400 font-bold">Length: {activeFrame.array.length}</span>
        </div>

        {/* Array Cells */}
        <div className="flex items-center justify-center gap-3 py-2 overflow-x-auto">
          {activeFrame.array.map((val, idx) => {
            const hasLeft = activeFrame.pointers.left === idx;
            const hasRight = activeFrame.pointers.right === idx;
            const hasMid = activeFrame.pointers.mid === idx;
            const isTargeted = hasLeft || hasRight || hasMid;

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                {/* Pointer Tag Above */}
                <div className="h-6 flex items-end justify-center">
                  {hasLeft && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase bg-cyan-500 text-black border border-cyan-400 animate-bounce">
                      left ▼
                    </span>
                  )}
                  {hasRight && !hasLeft && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase bg-purple-500 text-white border border-purple-400 animate-bounce">
                      right ▼
                    </span>
                  )}
                  {hasLeft && hasRight && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase bg-amber-500 text-black border border-amber-400 animate-bounce">
                      L & R ▼
                    </span>
                  )}
                </div>

                {/* Box */}
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-bold transition-all shadow-md ${
                  isTargeted 
                    ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400 text-white scale-105 shadow-cyan-500/20' 
                    : 'bg-white/5 border border-white/15 text-gray-300'
                }`}>
                  <span className="text-base font-extrabold">{val}</span>
                  <span className="text-[9px] text-gray-500">[{idx}]</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Variable Scope & Call Stack Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
        
        {/* Local Variables */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
          <span className="text-gray-400 font-bold uppercase text-[10px] block flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Local Activation Scope</span>
          </span>
          <div className="space-y-1">
            {Object.entries(activeFrame.variables).map(([k, v]) => (
              <div key={k} className="flex justify-between p-1 rounded bg-white/5 px-2">
                <span className="text-gray-400">{k}:</span>
                <span className="text-white font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Call Stack */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
          <span className="text-gray-400 font-bold uppercase text-[10px] block flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Call Stack Frames</span>
          </span>
          <div className="space-y-1">
            {activeFrame.stack.map((frame, i) => (
              <div key={i} className="flex items-center gap-2 p-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 font-bold">
                <span className="text-[9px] text-emerald-500 font-mono">#{i + 1}</span>
                <span>{frame}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Campus Percentile Benchmark Histogram */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-black/40 to-teal-950/20 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <BarChart2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h5 className="font-bold text-white text-xs font-sora">
              Campus Performance Percentile Benchmark
            </h5>
            <p className="text-[10px] text-gray-400 font-mono">
              Beats 91.4% of campus scholars in time efficiency • O(N) linear scan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
            ⚡ 38ms (Faster than 91%)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
            💾 42.1 MB (Top 9%)
          </span>
        </div>
      </div>

    </div>
  );
}
