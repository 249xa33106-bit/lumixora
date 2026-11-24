import React, { useState } from 'react';
import { Code, Play, Terminal, CheckCircle2, Sparkles, Copy, Check } from 'lucide-react';

const CODE_EXAMPLES = [
  {
    id: 'binary_search',
    lang: 'python',
    title: 'Binary Search Algorithm',
    complexity: 'O(log N) Time · O(1) Space',
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid  # Found target index!
        elif arr[mid] < target:
            left = mid + 1  # Discard left half
        else:
            right = mid - 1 # Discard right half
            
    return -1 # Not found

# Example execution:
numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print("Index of 23:", binary_search(numbers, 23))`,
    output: `Index of 23: 5\nSearch completed in 3 iterations (log2(10) ≈ 3.32 steps).`
  },
  {
    id: 'two_sum',
    lang: 'javascript',
    title: 'Two Sum with Hash Map',
    complexity: 'O(N) Time · O(N) Space',
    code: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`,
    output: `[0, 1]\nComplement 7 found in O(1) dictionary lookup.`
  }
];

export default function CodingStudioStage() {
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);

  const snippet = CODE_EXAMPLES[activeSnippetIndex];

  const handleRunCode = () => {
    setIsRunning(true);
    setShowOutput(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowOutput(true);
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-full rounded-2xl bg-[#0b0f19]/95 border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none font-mono">
      
      {/* ─── TERMINAL HEADER ─── */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-700/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-bold text-gray-300">
            {snippet.title} · <span className="text-cyan-400">{snippet.complexity}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-40 text-black font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>{isRunning ? 'Running...' : 'Execute'}</span>
          </button>
        </div>
      </div>

      {/* ─── CODE EDITOR WINDOW ─── */}
      <div className="py-2 flex-1 overflow-y-auto text-xs sm:text-[13px] leading-relaxed text-gray-200">
        <pre className="p-3.5 rounded-xl bg-black/50 border border-white/10 overflow-x-auto text-left font-mono">
          <code>{snippet.code}</code>
        </pre>
      </div>

      {/* ─── EXECUTION CONSOLE OUTPUT ─── */}
      {showOutput && (
        <div className="mb-2 p-3 rounded-xl bg-black/80 border border-emerald-500/40 text-xs animate-fade-in">
          <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminal Output (Exit Code: 0)</span>
          </div>
          <pre className="text-gray-200 text-[11px] whitespace-pre-wrap">{snippet.output}</pre>
        </div>
      )}

      {/* ─── FOOTER ─── */}
      <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5 text-cyan-300">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Runtime · Memory Complexity Analyzer</span>
        </span>
        <button
          onClick={() => {
            setActiveSnippetIndex((activeSnippetIndex + 1) % CODE_EXAMPLES.length);
            setShowOutput(false);
          }}
          className="text-xs text-purple-300 hover:text-white underline cursor-pointer"
        >
          Switch Algorithm →
        </button>
      </div>

    </div>
  );
}
