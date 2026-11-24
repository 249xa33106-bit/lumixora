import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, AlertCircle, ArrowRight, Sparkles, 
  Target, ShieldCheck, Code2, Brain, RefreshCw, X, ChevronRight, Award
} from 'lucide-react';

const playChirp = (freq = 600) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
};

const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'q1',
    category: 'Algorithms & Data Structures',
    targetRole: 'Cisco / Darwinbox SDE (₹12L–16L)',
    question: 'What is the tightest worst-case time complexity to find the Lowest Common Ancestor (LCA) in an arbitrary Binary Tree with N nodes without parent pointers?',
    options: [
      { text: 'O(1) using pointers', correct: false },
      { text: 'O(log N) always', correct: false },
      { text: 'O(N) with a single DFS traversal', correct: true },
      { text: 'O(N²) due to path backtracking', correct: false }
    ],
    explanation: 'In a general binary tree, each node must be visited at most once via bottom-up post-order DFS to locate both targets, achieving optimal O(N) time and O(H) auxiliary recursion stack space.'
  },
  {
    id: 'q2',
    category: 'Operating Systems & Concurrency',
    targetRole: 'Cisco Systems / TCS Prime (₹10L–15L)',
    question: 'Why does acquiring multiple mutex locks in differing order across concurrent threads cause deadlocks under high load?',
    options: [
      { text: 'It exhausts OS thread scheduling quantum', correct: false },
      { text: 'It satisfies Coffman\'s Circular Wait condition', correct: true },
      { text: 'Context switches corrupt the kernel registers', correct: false },
      { text: 'Semaphore permits cannot be negative', correct: false }
    ],
    explanation: 'Deadlock requires 4 Coffman conditions. Inconsistent acquisition order creates a cycle in the Resource Allocation Graph (Circular Wait), where Thread A holds Lock 1 waiting for Lock 2, while Thread B holds Lock 2 waiting for Lock 1.'
  },
  {
    id: 'q3',
    category: 'System Design & High-Throughput Caching',
    targetRole: 'Darwinbox Product SDE / Accolite (₹12L–16L)',
    question: 'To handle 80,000 read requests/sec with sub-5ms latency without overloading an RDBMS, what is the industry standard architectural pattern?',
    options: [
      { text: 'Increase relational DB connection pool to 20,000', correct: false },
      { text: 'Distributed Redis cache with Cache-Aside / Write-Through pattern', correct: true },
      { text: 'Switch database transaction isolation to Serializable', correct: false },
      { text: 'Write database queries with nested SELECT subqueries', correct: false }
    ],
    explanation: 'Distributed in-memory caching (Redis/Memcached) with Cache-Aside or Write-Through pattern absorbs >95% of read volume, keeping p99 response times under 5ms and shielding persistent relational tables.'
  }
];

export default function PlacementGapDiagnosticModal({ isOpen, onClose, onNavigate }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSelectOption = (qId, optionIdx) => {
    playChirp(700);
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleNext = () => {
    playChirp(820);
    if (currentIdx < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const handleRestart = () => {
    playChirp(550);
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
  };

  // Score calculation
  const calculateScore = () => {
    let correct = 0;
    DIAGNOSTIC_QUESTIONS.forEach(q => {
      const chosen = selectedAnswers[q.id];
      if (chosen !== undefined && q.options[chosen]?.correct) {
        correct++;
      }
    });
    return {
      correct,
      total: DIAGNOSTIC_QUESTIONS.length,
      percentage: Math.round((correct / DIAGNOSTIC_QUESTIONS.length) * 100)
    };
  };

  const scoreData = calculateScore();
  const currentQ = DIAGNOSTIC_QUESTIONS[currentIdx];
  const hasAnsweredCurrent = selectedAnswers[currentQ.id] !== undefined;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0B1120] border border-cyan-500/30 shadow-[0_20px_70px_rgba(0,0,0,0.8)] text-white overflow-hidden">
        
        {/* Glow Accent Top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">10 LPA – 16 LPA Readiness Diagnostic</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  REALISTIC CALIBRATION
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Tests core DSA complexity, OS concurrency, and system design patterns
              </p>
            </div>
          </div>
          <button
            onClick={() => { playChirp(450); onClose(); }}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!isSubmitted ? (
            <div className="space-y-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>QUESTION {currentIdx + 1} OF {DIAGNOSTIC_QUESTIONS.length}</span>
                <span className="text-cyan-400 font-semibold">{currentQ.category}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 font-mono">
                  Target: {currentQ.targetRole}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm ${
                        isSelected 
                          ? 'bg-cyan-500/15 border-cyan-400 text-white font-semibold shadow-md shadow-cyan-500/10' 
                          : 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.06] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold ${
                          isSelected ? 'bg-cyan-400 text-black' : 'bg-white/10 text-gray-400'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={onClose}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                >
                  Skip diagnostic
                </button>
                <button
                  disabled={!hasAnsweredCurrent}
                  onClick={handleNext}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    hasAnsweredCurrent
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02]'
                      : 'bg-white/10 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>{currentIdx === DIAGNOSTIC_QUESTIONS.length - 1 ? 'Compute Readiness Index' : 'Next Question'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Diagnostic Results & Actionable 10L-16L Blueprint */
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-1">
                  <Award className="w-8 h-8" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  Your Tier-1 Readiness Score: {scoreData.percentage}%
                </h4>
                <p className="text-xs text-gray-300 max-w-md mx-auto">
                  {scoreData.percentage >= 67 
                    ? 'Strong candidate profile. You have solid conceptual grounding for Cisco, Darwinbox, and TCS Prime technical rounds.'
                    : 'Target gap identified. Strengthening Time Complexity analysis and OS Deadlock conditions will secure ₹10L+ shortlists.'}
                </p>
              </div>

              {/* Detailed Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="text-[10px] uppercase font-mono text-gray-400">DSA Coverage</div>
                  <div className="text-sm font-bold text-cyan-300">Graphs, LCA, Stacks</div>
                  <div className="text-[11px] text-gray-400">4 New medium patterns live in Code Arena</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="text-[10px] uppercase font-mono text-gray-400">Core CS Viva</div>
                  <div className="text-sm font-bold text-purple-300">OS, DBMS, Networks</div>
                  <div className="text-[11px] text-gray-400">8 Crucible flashcards in Placement portal</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="text-[10px] uppercase font-mono text-gray-400">Resume Signal</div>
                  <div className="text-sm font-bold text-emerald-300">Google XYZ Formula</div>
                  <div className="text-[11px] text-gray-400">Instant bullet enhancer in Resume Builder</div>
                </div>
              </div>

              {/* Explanations Accordion / Review */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {DIAGNOSTIC_QUESTIONS.map((q, idx) => {
                  const userChoice = selectedAnswers[q.id];
                  const isCorrect = userChoice !== undefined && q.options[userChoice]?.correct;
                  return (
                    <div key={q.id} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-gray-300 truncate max-w-[80%]">{idx + 1}. {q.question}</span>
                        {isCorrect ? (
                          <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1 text-[11px] font-bold shrink-0">
                            <XCircle className="w-3.5 h-3.5" /> Needs Focus
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{q.explanation}</p>
                    </div>
                  );
                })}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retake Diagnostic
                </button>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onClose();
                      if (onNavigate) onNavigate('papers');
                      else window.location.hash = '#previous-papers';
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <span>Practice Placement Papers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
