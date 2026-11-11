import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Zap, Brain, Trophy, Flame, Play, CheckCircle2, 
  XCircle, Award, RefreshCw, Send, ArrowRight, ShieldCheck, 
  HelpCircle, Star, Target, Atom, ChevronRight
} from 'lucide-react';
import Realistic3DLogo from './Realistic3DLogo';
import { awardXP } from '../services/gamificationService';

// Curated daily brain spark challenges designed for university students
const CURATED_CHALLENGES = [
  {
    id: 1,
    category: 'Computer Science & Logic',
    badge: '⚡ Algorithms & Bitwise',
    question: "If you have a binary number `1101` and apply a bitwise XOR with `1010`, what is the decimal equivalent of the result?",
    options: [
      { id: 'A', text: "5", isCorrect: false },
      { id: 'B', text: "7", isCorrect: true, explanation: "1101 XOR 1010 = 0111 in binary, which equals (4 + 2 + 1) = 7 in decimal." },
      { id: 'C', text: "6", isCorrect: false },
      { id: 'D', text: "3", isCorrect: false }
    ],
    hint: "XOR yields 1 when the bits are different, and 0 when they are identical.",
    xp: 50,
    coins: 15
  },
  {
    id: 2,
    category: 'Placement Quantitative Aptitude',
    badge: '🎯 Probability & Puzzles',
    question: "A bag contains 5 red, 4 green, and 3 blue balls. If two balls are drawn at random without replacement, what is the probability that both are green?",
    options: [
      { id: 'A', text: "1 / 11", isCorrect: true, explanation: "P(1st green) = 4/12 = 1/3. P(2nd green) = 3/11. Total = (4/12) * (3/11) = 12/132 = 1/11." },
      { id: 'B', text: "1 / 9", isCorrect: false },
      { id: 'C', text: "2 / 33", isCorrect: false },
      { id: 'D', text: "1 / 16", isCorrect: false }
    ],
    hint: "Remember to reduce the total count to 11 when picking the second ball.",
    xp: 45,
    coins: 12
  },
  {
    id: 3,
    category: 'System Design & OS',
    badge: '🧠 Memory & Caching',
    question: "Which cache eviction algorithm always evicts the item that has not been accessed for the longest period of time?",
    options: [
      { id: 'A', text: "FIFO (First In First Out)", isCorrect: false },
      { id: 'B', text: "LFU (Least Frequently Used)", isCorrect: false },
      { id: 'C', text: "LRU (Least Recently Used)", isCorrect: true, explanation: "LRU keeps track of recent accesses and evicts the least recently accessed element, typically implemented with a Doubly Linked List + HashMap in O(1)." },
      { id: 'D', text: "MRU (Most Recently Used)", isCorrect: false }
    ],
    hint: "Think LeetCode 146 — combination of a Doubly Linked List and Hash Map.",
    xp: 50,
    coins: 15
  },
  {
    id: 4,
    category: 'Engineering Riddle',
    badge: '💡 Lateral Thinking',
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind and sound waves in distributed communications. What am I?",
    options: [
      { id: 'A', text: "A Radar", isCorrect: false },
      { id: 'B', text: "An Echo", isCorrect: true, explanation: "An echo has no body or mouth, but repeats every sound wave carried by the medium." },
      { id: 'C', text: "A Transistor", isCorrect: false },
      { id: 'D', text: "A Cloud Server", isCorrect: false }
    ],
    hint: "Think reflections in acoustic telecommunications.",
    xp: 40,
    coins: 10
  }
];

export default function DailyBrainSpark({ user, onRewardClaimed }) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const storageKey = `lumixora_brain_spark_${todayKey}`;

  const [currentIndex, setCurrentIndex] = useState(() => {
    const dayNum = new Date().getDate();
    return dayNum % CURATED_CHALLENGES.length;
  });

  const activeChallenge = CURATED_CHALLENGES[currentIndex];

  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(() => {
    try {
      return parseInt(localStorage.getItem('lumixora_spark_streak') || '3', 10);
    } catch (e) {
      return 3;
    }
  });
  const [claimedReward, setClaimedReward] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Check if solved today
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedOption(parsed.selected);
        setHasSubmitted(true);
        setIsCorrect(parsed.isCorrect);
        setClaimedReward(true);
      }
    } catch (e) {}
  }, [storageKey]);

  const handleSelect = (optionId) => {
    if (hasSubmitted) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = async () => {
    if (!selectedOption || hasSubmitted) return;
    const chosen = activeChallenge.options.find(o => o.id === selectedOption);
    const correct = chosen?.isCorrect || false;

    setHasSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('lumixora_spark_streak', newStreak.toString());

      // Award XP
      if (user?.uid || user?.id) {
        try {
          await awardXP(user.uid || user.id, 'COMPLETE_AI_TASK', activeChallenge.xp);
        } catch (e) {}
      }
      if (onRewardClaimed) onRewardClaimed(activeChallenge.xp);
      setClaimedReward(true);
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify({
        selected: selectedOption,
        isCorrect: correct,
        date: todayKey
      }));
    } catch (e) {}
  };

  const handleNextChallenge = () => {
    const nextIdx = (currentIndex + 1) % CURATED_CHALLENGES.length;
    setCurrentIndex(nextIdx);
    setSelectedOption(null);
    setHasSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
    setClaimedReward(false);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#0c1322] via-[#090d18] to-[#120f26] border border-cyan-500/25 shadow-2xl transition-all group">
      {/* Dynamic ambient cyber neon glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Realistic3DLogo size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-wide font-sora flex items-center gap-1.5">
                <span>Lumixora Brain Spark™</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30">
                  Daily Puzzle
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              Daily engineering riddle & placement aptitude puzzle
            </p>
          </div>
        </div>

        {/* Streak & XP Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-300 shadow-sm">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            <span className="text-xs font-black tracking-wide font-mono">{streak} Day Streak</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-black font-mono">+{activeChallenge.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Challenge Card Content */}
      <div className="relative z-10 space-y-4">
        {/* Category tag */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-bold text-cyan-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            {activeChallenge.badge}
          </span>
          <span className="text-[11px] text-gray-500 font-mono">
            Puzzle #{activeChallenge.id} of {CURATED_CHALLENGES.length}
          </span>
        </div>

        {/* Question Text */}
        <p className="text-sm sm:text-base font-semibold text-gray-100 leading-relaxed font-sans">
          {activeChallenge.question}
        </p>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {activeChallenge.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            let btnStyle = "bg-white/[0.04] border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.08] text-gray-200";

            if (hasSubmitted) {
              if (opt.isCorrect) {
                btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-emerald-500/20";
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = "bg-rose-500/20 border-rose-500 text-rose-200 shadow-rose-500/20";
              } else {
                btnStyle = "opacity-40 bg-white/[0.02] border-white/5 text-gray-400";
              }
            } else if (isSelected) {
              btnStyle = "bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10";
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={hasSubmitted}
                className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2.5 cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-cyan-500 text-black' : 'bg-white/10 text-gray-300'
                  }`}>
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </div>
                {hasSubmitted && opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {hasSubmitted && isSelected && !opt.isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Hint Box (if toggled) */}
        {showHint && !hasSubmitted && (
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-xs text-purple-200 flex items-start gap-2 animate-fade-in">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span><strong>Clue:</strong> {activeChallenge.hint}</span>
          </div>
        )}

        {/* Explanation & Feedback Banner (Post-submit) */}
        {hasSubmitted && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm animate-fade-in ${
            isCorrect 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Brilliant Solution! +{activeChallenge.xp} XP Claimed</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Almost! Review the engineering logic below:</span>
                </>
              )}
            </div>
            <p className="text-gray-300 text-xs leading-relaxed mt-1">
              {activeChallenge.options.find(o => o.isCorrect)?.explanation}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          {!hasSubmitted ? (
            <>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Need a Clue?'}</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
                  selectedOption 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white shadow-cyan-500/25 scale-100 hover:scale-102'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Lock In Answer</span>
                <Send className="w-3 h-3" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Recorded to your Academic Skill Vector
              </span>

              <button
                type="button"
                onClick={handleNextChallenge}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <span>Try Another Puzzle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
