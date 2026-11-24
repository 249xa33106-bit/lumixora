import React, { useState, useEffect } from 'react';
import { 
  Clock, Play, CheckCircle2, AlertTriangle, ArrowRight, 
  RotateCcw, Trophy, Award, ShieldAlert, Code2, Brain, Check, X, Sparkles
} from 'lucide-react';

const playSound = (freq = 640) => {
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

export default function TimedMockDriveAssessment({ drive, onExit }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const [activeSection, setActiveSection] = useState('mcq'); // 'mcq' | 'coding'
  const [currentMcqIdx, setCurrentMcqIdx] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState({}); // { [mcqId]: optionIndex }
  const [codingSolution, setCodingSolution] = useState(
    drive.codingQuestions?.[0]?.solution || '// Write your solution function here\nfunction solve(input) {\n  \n}'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const mcqs = drive.aptitudeMCQs || [];
  const codingQ = drive.codingQuestions?.[0] || null;

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (hasStarted && !isSubmitted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleFinalSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted, isSubmitted, timeLeft]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    playSound(750);
    setHasStarted(true);
    setTimeLeft(45 * 60);
    setIsSubmitted(false);
    setMcqAnswers({});
  };

  const handleSelectOption = (qIdx, optIdx) => {
    playSound(600);
    setMcqAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleFinalSubmit = () => {
    playSound(880);
    setIsSubmitted(true);

    // Calculate score: +3 for correct, -1 for wrong, 0 for unattempted
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    mcqs.forEach((mcq, idx) => {
      const ans = mcqAnswers[idx];
      if (ans === undefined) {
        unattemptedCount++;
      } else if (ans === mcq.correctOption) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const score = Math.max(0, correctCount * 3 - wrongCount * 1);
    const maxScore = mcqs.length * 3;
    const accuracy = correctCount + wrongCount > 0 
      ? Math.round((correctCount / (correctCount + wrongCount)) * 100) 
      : 0;

    setTestResult({
      score,
      maxScore,
      correctCount,
      wrongCount,
      unattemptedCount,
      accuracy,
      percentile: accuracy >= 80 ? 94 : (accuracy >= 50 ? 78 : 55)
    });
  };

  // 1. Initial State: Exam Instructions & Start Banner
  if (!hasStarted) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-black/40 border border-amber-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-300">
              <Clock className="w-3.5 h-3.5" /> 45-MINUTE TIMED MOCK ASSESSMENT
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {drive.company} Official Campus Drive Simulation
            </h3>
            <p className="text-xs text-gray-300">
              Realistic online assessment environment with section limits, negative marking (-1), and live timing.
            </p>
          </div>
          <button
            onClick={handleStartExam}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:opacity-95 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer transition-transform hover:scale-105 shrink-0"
          >
            <Play className="w-4 h-4 fill-black" /> Start Assessment Now
          </button>
        </div>

        {/* Blueprint Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-400" /> Part A: Aptitude & Tech MCQs
            </div>
            <p className="text-gray-400 font-mono text-[11px]">
              {mcqs.length} Questions • +3 Marks, -1 Negative Marking
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-cyan-400" /> Part B: Coding Assessment
            </div>
            <p className="text-gray-400 font-mono text-[11px]">
              1 Medium/Hard Algorithmic Problem • Edge Cases & Complexity
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-emerald-400" /> Shortlist Threshold
            </div>
            <p className="text-gray-400 font-mono text-[11px]">
              Target: 70%+ score for ₹10L–16L Interview Round shortlists
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Completed State: Scorecard & Percentile
  if (isSubmitted && testResult) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-black/40 border border-emerald-500/30 space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-1">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-white">
            {drive.company} Mock Assessment Completed!
          </h3>
          <p className="text-xs text-gray-300">
            Assessment score calculated with official marking scheme (+3 correct, -1 incorrect).
          </p>
        </div>

        {/* Scorecard Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] text-gray-400 font-mono uppercase block">Total Score</span>
            <span className="text-xl font-black text-emerald-400">{testResult.score} / {testResult.maxScore}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] text-gray-400 font-mono uppercase block">Accuracy</span>
            <span className="text-xl font-black text-cyan-400">{testResult.accuracy}%</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] text-gray-400 font-mono uppercase block">Correct / Wrong</span>
            <span className="text-xl font-black text-white">{testResult.correctCount} / {testResult.wrongCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] text-gray-400 font-mono uppercase block">Est. Percentile</span>
            <span className="text-xl font-black text-purple-400">{testResult.percentile}th</span>
          </div>
        </div>

        {/* Answer Key Review */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
            Detailed Solution & Rationale Breakdown:
          </h4>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {mcqs.map((m, idx) => {
              const userAns = mcqAnswers[idx];
              const isCorrect = userAns === m.correctOption;
              const isSkipped = userAns === undefined;
              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white max-w-[80%]">{idx + 1}. {m.question}</span>
                    {isCorrect ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" /> +3 Marks
                      </span>
                    ) : isSkipped ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                        Unattempted (0)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <X className="w-3 h-3" /> -1 Mark
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-emerald-300 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                    <strong>Correct Answer:</strong> {m.options[m.correctOption]}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{m.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={handleStartExam}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake Simulation
          </button>
          <button
            onClick={() => setHasStarted(false)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-extrabold text-xs cursor-pointer shadow-md"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    );
  }

  // 3. Active Test Taking Interface
  const currentMcq = mcqs[currentMcqIdx];

  return (
    <div className="p-6 rounded-3xl bg-black/60 border border-white/15 space-y-6">
      
      {/* Top Bar: Timer, Section switcher, and Submit button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('mcq')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'mcq'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            Section A: Technical MCQs ({Object.keys(mcqAnswers).length}/{mcqs.length})
          </button>
          {codingQ && (
            <button
              onClick={() => setActiveSection('coding')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'coding'
                  ? 'bg-cyan-400 text-black shadow-md'
                  : 'text-gray-400 hover:text-white bg-white/5'
              }`}
            >
              Section B: Coding Challenge
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Live Timer Pill */}
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold border ${
            timeLeft < 300 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
              : 'bg-white/10 text-emerald-400 border-white/15'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={handleFinalSubmit}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-black font-black text-xs shadow-md cursor-pointer"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* SECTION A: MCQS */}
      {activeSection === 'mcq' && currentMcq && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Question Box */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
              <span>QUESTION {currentMcqIdx + 1} OF {mcqs.length}</span>
              <span className="text-amber-400 font-semibold">{currentMcq.category || 'Core CS & Tech'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {currentMcq.question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentMcq.options.map((opt, optIdx) => {
                const isSelected = mcqAnswers[currentMcqIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentMcqIdx, optIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 text-white font-semibold'
                        : 'bg-white/[0.02] border-white/10 text-gray-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-[11px] ${
                        isSelected ? 'bg-amber-400 text-black' : 'bg-white/10 text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentMcqIdx === 0}
                onClick={() => { playSound(600); setCurrentMcqIdx(prev => prev - 1); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentMcqIdx === 0 ? 'opacity-30 cursor-not-allowed text-gray-500' : 'bg-white/5 hover:bg-white/10 text-white cursor-pointer'
                }`}
              >
                &larr; Previous
              </button>
              <button
                disabled={currentMcqIdx === mcqs.length - 1}
                onClick={() => { playSound(650); setCurrentMcqIdx(prev => prev + 1); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentMcqIdx === mcqs.length - 1 ? 'opacity-30 cursor-not-allowed text-gray-500' : 'bg-white/5 hover:bg-white/10 text-white cursor-pointer'
                }`}
              >
                Next &rarr;
              </button>
            </div>
          </div>

          {/* Right: Question Palette Grid */}
          <div className="lg:col-span-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase text-gray-400 block">
              Question Palette
            </span>
            <div className="grid grid-cols-5 gap-2">
              {mcqs.map((_, i) => {
                const isAnswered = mcqAnswers[i] !== undefined;
                const isCurrent = currentMcqIdx === i;
                return (
                  <button
                    key={i}
                    onClick={() => { playSound(600); setCurrentMcqIdx(i); }}
                    className={`h-9 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-amber-400 font-black scale-105'
                        : ''
                    } ${
                      isAnswered
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="pt-2 border-t border-white/10 text-[10px] text-gray-400 space-y-1 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500/40 inline-block" /> Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-white/10 inline-block" /> Unanswered
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: CODING CHALLENGE */}
      {activeSection === 'coding' && codingQ && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-400 font-bold font-mono">ALGORITHMIC PROBLEM</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">
                {codingQ.difficulty}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">{codingQ.title}</h4>
            <p className="text-xs text-gray-300 leading-relaxed">{codingQ.statement}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-mono">Live Code Workspace ({codingQ.language})</span>
              <span className="text-[11px] text-gray-500">Auto-saved to session</span>
            </div>
            <textarea
              rows={10}
              value={codingSolution}
              onChange={(e) => setCodingSolution(e.target.value)}
              className="w-full p-4 rounded-2xl bg-black border border-white/10 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400 leading-relaxed resize-y"
            />
          </div>
        </div>
      )}
    </div>
  );
}
