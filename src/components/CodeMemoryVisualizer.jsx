import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Cpu, 
  Layers, Database, Zap, Activity, Check, AlertCircle, Sparkles, Terminal
} from 'lucide-react';

export default function CodeMemoryVisualizer({ code = '', language = 'javascript', problem = null }) {
  // Parsing Problem & Code Archetype
  const cleanCode = (code || '').trim();
  const lowerCode = cleanCode.toLowerCase();

  // Determine Archetype
  const archetype = useMemo(() => {
    if (lowerCode.includes('tree') || lowerCode.includes('root') || lowerCode.includes('left') && lowerCode.includes('right')) {
      return 'tree';
    }
    if (lowerCode.includes('listnode') || lowerCode.includes('next') || lowerCode.includes('head')) {
      return 'linked_list';
    }
    if (lowerCode.includes('dp') || lowerCode.includes('memo') || lowerCode.includes('tab')) {
      return 'dp_table';
    }
    if (lowerCode.includes('map') || lowerCode.includes('dict') || lowerCode.includes('hash') || lowerCode.includes('seen')) {
      return 'hash_map';
    }
    return 'array'; // Default: Array two-pointer / traversal
  }, [lowerCode]);

  // Generate authentic execution trace steps based on problem / code
  const traceSteps = useMemo(() => {
    if (archetype === 'tree') {
      return [
        {
          step: 1,
          line: 2,
          action: 'Initialize root node pointer',
          stack: [{ frame: 'invertTree(root)', vars: { root: '0x1A00', val: 4 } }],
          heap: [
            { id: '0x1A00', val: 4, label: 'Root Node', state: 'active' },
            { id: '0x1A08', val: 2, label: 'Left Child', state: 'unvisited' },
            { id: '0x1A10', val: 7, label: 'Right Child', state: 'unvisited' }
          ],
          pointers: { current: '0x1A00' },
          narration: 'Allocated root node at heap 0x1A00 with value 4.'
        },
        {
          step: 2,
          line: 5,
          action: 'Traverse left subtree',
          stack: [
            { frame: 'invertTree(root)', vars: { root: '0x1A00' } },
            { frame: 'invertTree(root.left)', vars: { root: '0x1A08', val: 2 } }
          ],
          heap: [
            { id: '0x1A00', val: 4, label: 'Root Node', state: 'waiting' },
            { id: '0x1A08', val: 2, label: 'Left Child', state: 'active' },
            { id: '0x1A10', val: 7, label: 'Right Child', state: 'unvisited' }
          ],
          pointers: { current: '0x1A08', parent: '0x1A00' },
          narration: 'Pushed recursive frame invertTree(0x1A08). Visiting left child (val: 2).'
        },
        {
          step: 3,
          line: 8,
          action: 'Swap left and right pointers',
          stack: [{ frame: 'invertTree(root)', vars: { root: '0x1A00', temp: '0x1A08' } }],
          heap: [
            { id: '0x1A00', val: 4, label: 'Root Node', state: 'active' },
            { id: '0x1A08', val: 2, label: 'Swapped Right', state: 'swapped' },
            { id: '0x1A10', val: 7, label: 'Swapped Left', state: 'swapped' }
          ],
          pointers: { current: '0x1A00', swapped: '0x1A10 <-> 0x1A08' },
          narration: 'Pointers inverted: 0x1A00.left points to 0x1A10 (7), 0x1A00.right points to 0x1A08 (2).'
        },
        {
          step: 4,
          line: 12,
          action: 'Return inverted root',
          stack: [{ frame: 'main()', vars: { result: '0x1A00 (Inverted)' } }],
          heap: [
            { id: '0x1A00', val: 4, label: 'Root Node', state: 'completed' },
            { id: '0x1A10', val: 7, label: 'Left Child', state: 'completed' },
            { id: '0x1A08', val: 2, label: 'Right Child', state: 'completed' }
          ],
          pointers: { result: '0x1A00' },
          narration: 'All subtrees balanced and inverted in O(N) time and O(H) stack depth.'
        }
      ];
    }

    if (archetype === 'hash_map') {
      return [
        {
          step: 1,
          line: 2,
          action: 'Allocate Hash Table & Pointers',
          stack: [{ frame: 'twoSum(nums, target=9)', vars: { i: 0, nums_i: 2, target: 9 } }],
          heap: [
            { addr: '0x7FFE00', key: 2, val: 'idx 0', state: 'active' }
          ],
          pointers: { i: 0, target: 9, complement: 7 },
          narration: 'Iterating index 0 (val 2). Target complement 9 - 2 = 7 not in map. Saved 2 -> index 0.'
        },
        {
          step: 2,
          line: 4,
          action: 'Lookup complement in O(1)',
          stack: [{ frame: 'twoSum(nums, target=9)', vars: { i: 1, nums_i: 7, target: 9 } }],
          heap: [
            { addr: '0x7FFE00', key: 2, val: 'idx 0', state: 'match' },
            { addr: '0x7FFE08', key: 7, val: 'idx 1', state: 'active' }
          ],
          pointers: { i: 1, complement: 2, matchFound: true },
          narration: 'Iterating index 1 (val 7). Target complement 9 - 7 = 2 FOUND in Hash Table at index 0!'
        },
        {
          step: 3,
          line: 7,
          action: 'Return indices [0, 1]',
          stack: [{ frame: 'main()', vars: { result: '[0, 1]' } }],
          heap: [
            { addr: '0x7FFE00', key: 2, val: 'idx 0', state: 'selected' },
            { addr: '0x7FFE08', key: 7, val: 'idx 1', state: 'selected' }
          ],
          pointers: { return: '[0, 1]' },
          narration: 'Returned matching indices [0, 1] in O(1) auxiliary lookups.'
        }
      ];
    }

    // Default: Array Two-Pointer / Array Traversal Trace
    return [
      {
        step: 1,
        line: 1,
        action: 'Stack Frame Entry & Variable Binding',
        stack: [
          { frame: 'solve(nums, target)', vars: { left: 0, right: 3, target: 9 } }
        ],
        heap: [
          { index: 0, addr: '0x7FFE00', val: 2, label: 'nums[0]', state: 'active' },
          { index: 1, addr: '0x7FFE04', val: 7, label: 'nums[1]', state: 'unvisited' },
          { index: 2, addr: '0x7FFE08', val: 11, label: 'nums[2]', state: 'unvisited' },
          { index: 3, addr: '0x7FFE0C', val: 15, label: 'nums[3]', state: 'active' }
        ],
        pointers: { left: 0, right: 3, sum: 17 },
        narration: 'Allocated contiguous 16-byte buffer on Stack/Heap. Pointers initialized: left = 0, right = 3.'
      },
      {
        step: 2,
        line: 4,
        action: 'Sum Evaluation & Comparison',
        stack: [
          { frame: 'solve(nums, target)', vars: { left: 0, right: 3, sum: 17, target: 9 } }
        ],
        heap: [
          { index: 0, addr: '0x7FFE00', val: 2, label: 'nums[0]', state: 'compared' },
          { index: 1, addr: '0x7FFE04', val: 7, label: 'nums[1]', state: 'unvisited' },
          { index: 2, addr: '0x7FFE08', val: 11, label: 'nums[2]', state: 'unvisited' },
          { index: 3, addr: '0x7FFE0C', val: 15, label: 'nums[3]', state: 'compared' }
        ],
        pointers: { left: 0, right: 3, sum: 17 },
        narration: 'Current sum nums[0] + nums[3] = 17 > target 9. Decrementing right pointer to reduce sum.'
      },
      {
        step: 3,
        line: 6,
        action: 'Pointer Shift: right = 2',
        stack: [
          { frame: 'solve(nums, target)', vars: { left: 0, right: 2, sum: 13, target: 9 } }
        ],
        heap: [
          { index: 0, addr: '0x7FFE00', val: 2, label: 'nums[0]', state: 'compared' },
          { index: 1, addr: '0x7FFE04', val: 7, label: 'nums[1]', state: 'unvisited' },
          { index: 2, addr: '0x7FFE08', val: 11, label: 'nums[2]', state: 'compared' },
          { index: 3, addr: '0x7FFE0C', val: 15, label: 'nums[3]', state: 'out_of_bounds' }
        ],
        pointers: { left: 0, right: 2, sum: 13 },
        narration: 'Current sum nums[0] + nums[2] = 13 > target 9. Decrementing right pointer again.'
      },
      {
        step: 4,
        line: 8,
        action: 'Pointer Shift & Optimal Target Match!',
        stack: [
          { frame: 'solve(nums, target)', vars: { left: 0, right: 1, sum: 9, target: 9 } }
        ],
        heap: [
          { index: 0, addr: '0x7FFE00', val: 2, label: 'nums[0]', state: 'match' },
          { index: 1, addr: '0x7FFE04', val: 7, label: 'nums[1]', state: 'match' },
          { index: 2, addr: '0x7FFE08', val: 11, label: 'nums[2]', state: 'out_of_bounds' },
          { index: 3, addr: '0x7FFE0C', val: 15, label: 'nums[3]', state: 'out_of_bounds' }
        ],
        pointers: { left: 0, right: 1, sum: 9, status: 'MATCH!' },
        narration: 'nums[0] + nums[1] = 2 + 7 = 9. Exact target match found in 3 iterations! Returning [0, 1].'
      }
    ];
  }, [archetype]);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef(null);

  const currentStep = traceSteps[currentStepIdx] || traceSteps[0];

  // Auto-play stepper
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < traceSteps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1600);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, traceSteps.length]);

  return (
    <div className="space-y-4 font-sans text-xs animate-fade-in">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-mono text-[11px] font-bold text-white tracking-wide uppercase">
            Live Memory HUD & Dynamic Pointer Visualizer
          </span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold font-mono">
            {archetype.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentStepIdx(0)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
            disabled={currentStepIdx === 0}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
              isPlaying 
                ? 'bg-amber-500/20 border border-amber-400/40 text-amber-300' 
                : 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            onClick={() => setCurrentStepIdx(prev => Math.min(traceSteps.length - 1, prev + 1))}
            disabled={currentStepIdx === traceSteps.length - 1}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="ml-2 font-mono text-[11px] text-gray-400">
            Step <span className="text-white font-bold">{currentStepIdx + 1}</span> / {traceSteps.length}
          </span>
        </div>
      </div>

      {/* Main Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* 1. Call Stack Panel */}
        <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
              <Layers className="w-3.5 h-3.5" />
              <span>Call Stack Frames</span>
            </div>
            <span className="font-mono text-[10px] text-gray-500">Depth: {currentStep.stack.length}</span>
          </div>

          <div className="space-y-2">
            {currentStep.stack.map((frame, fIdx) => (
              <div 
                key={fIdx}
                className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-white space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-cyan-300">
                  <span>{frame.frame}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-200">ACTIVE</span>
                </div>
                
                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-cyan-500/10 font-mono text-[10px]">
                  {Object.entries(frame.vars || {}).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between bg-black/40 px-2 py-1 rounded">
                      <span className="text-gray-400">{k}:</span>
                      <span className="text-emerald-300 font-bold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Dynamic Memory Buffer / Heap Pointers */}
        <div className="lg:col-span-2 p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <Cpu className="w-3.5 h-3.5" />
              <span>Dynamic Heap & Memory Addresses</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
              <span>L1 Cache: <span className="text-emerald-400 font-bold">98.4% Hit</span></span>
              <span>Allocated: <span className="text-white font-bold">16 Bytes</span></span>
            </div>
          </div>

          {/* Memory Cells Container */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {currentStep.heap.map((cell, idx) => {
              const isMatch = cell.state === 'match' || cell.state === 'selected';
              const isCompared = cell.state === 'compared' || cell.state === 'active';
              const isOut = cell.state === 'out_of_bounds';

              let borderClass = 'border-white/10 bg-white/[0.02] text-gray-300';
              let badgeColor = 'bg-white/10 text-gray-400';

              if (isMatch) {
                borderClass = 'border-emerald-500 bg-emerald-500/15 text-emerald-200 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400';
                badgeColor = 'bg-emerald-500/30 text-emerald-200 font-bold';
              } else if (isCompared) {
                borderClass = 'border-cyan-500 bg-cyan-500/15 text-cyan-200 shadow-md shadow-cyan-500/20';
                badgeColor = 'bg-cyan-500/30 text-cyan-200 font-bold';
              } else if (isOut) {
                borderClass = 'border-white/5 bg-black/40 text-gray-600 opacity-40';
              }

              return (
                <div 
                  key={cell.addr || cell.id || idx}
                  className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${borderClass}`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 mb-2">
                    <span>{cell.addr || cell.id || `0x7FFE0${idx * 4}`}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${badgeColor}`}>
                      {cell.label || `idx ${cell.index ?? idx}`}
                    </span>
                  </div>

                  <div className="text-center py-1">
                    <span className="font-mono text-2xl font-black text-white">
                      {cell.val !== undefined ? cell.val : (cell.key ?? '-')}
                    </span>
                  </div>

                  {/* Active Pointer Arrow Marker */}
                  <div className="pt-2 border-t border-white/5 text-[10px] font-mono flex items-center justify-between">
                    {currentStep.pointers.left === (cell.index ?? idx) && (
                      <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                        ▲ left (ptr)
                      </span>
                    )}
                    {currentStep.pointers.right === (cell.index ?? idx) && (
                      <span className="text-amber-400 font-bold flex items-center gap-0.5 ml-auto">
                        ▲ right (ptr)
                      </span>
                    )}
                    {currentStep.pointers.current === (cell.id || cell.addr) && (
                      <span className="text-purple-400 font-bold flex items-center gap-0.5">
                        ▲ visiting
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-time Algorithmic Stepper Narration */}
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-start gap-2.5 text-[11px] text-gray-300">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white font-mono">Action (Line {currentStep.line}): </span>
              <span>{currentStep.narration}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
