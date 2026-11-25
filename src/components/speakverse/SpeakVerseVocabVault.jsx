// ============================================================================
// LUMIXORA SpeakVerse™ — VOCABULARY VAULT & MISTAKE MEMORY
// Tagline: "From Hesitation to Communication. From Communication to Confidence."
// Features: Active Saved Vocabulary • Acoustic Pronunciation Audio
// Mistake Memory with 1-Click "Practice Fix" Audio Drills
// ============================================================================

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Volume2, AlertCircle, Check, Search, Plus, 
  RotateCcw, Play, Sparkles, Filter, CheckCircle2, ChevronRight,
  Languages, Clock, Zap, ArrowRight, Brain, AlertTriangle
} from 'lucide-react';
import { DEFAULT_VOCABULARY_VAULT, DEFAULT_MISTAKE_MEMORY, TELUGU_BRIDGE_DRILLS } from './SpeakVerseData';

export const VERNACULAR_RAPID_DRILLS = [
  ...TELUGU_BRIDGE_DRILLS.map(t => ({ ...t, lang: 'Telugu', flag: '🇮🇳 TEL' })),
  {
    id: "hb-1",
    lang: "Hindi",
    flag: "🇮🇳 HIN",
    telugu: "हमें इस प्रोजेक्ट में डेटाबेस को ऑप्टिमाइज़ करना है।",
    transliteration: "Hamein is project mein database ko optimize karna hai.",
    literalWrong: "We in this project database want to optimize.",
    correctEnglish: "We need to optimize the database in this project.",
    grammarKey: "Direct Subject-Verb-Object ('We need to optimize...', not 'We in this project...')"
  },
  {
    id: "hb-2",
    lang: "Hindi",
    flag: "🇮🇳 HIN",
    telugu: "क्या आप कल कैंपस प्लेसमेंट ड्राइव में आ रहे हैं?",
    transliteration: "Kya aap kal campus placement drive mein aa rahe hain?",
    literalWrong: "You tomorrow campus placement drive coming?",
    correctEnglish: "Are you attending the campus placement drive tomorrow?",
    grammarKey: "Formal professional verb ('attending' rather than 'coming')"
  },
  {
    id: "hb-3",
    lang: "Hindi",
    flag: "🇮🇳 HIN",
    telugu: "मैंने पहले कभी इस तरह के बग का सामना नहीं किया था।",
    transliteration: "Maine pehle kabhi is tarah ke bug ka saamna nahi kiya tha.",
    literalWrong: "I before never this kind of bug faced.",
    correctEnglish: "I had never encountered this kind of bug before.",
    grammarKey: "Past Perfect Tense ('had never encountered', natural adverb placement)"
  },
  {
    id: "tb-extra-1",
    lang: "Telugu",
    flag: "🇮🇳 TEL",
    telugu: "ఈ ప్రాజెక్ట్‌లో మనం డేటాబేస్ ఆప్టిమైజ్ చేయాలి.",
    transliteration: "Ee project lo manam database optimize cheyaali.",
    literalWrong: "This project inside we database must do optimize.",
    correctEnglish: "We need to optimize the database in this project.",
    grammarKey: "Eliminate Telugu postposition 'lo' (inside) & place subject first"
  },
  {
    id: "tb-extra-2",
    lang: "Telugu",
    flag: "🇮🇳 TEL",
    telugu: "నేను ఆ కంపెనీ ఇంటర్వ్యూ కోసం ప్రిపేర్ అవుతున్నాను.",
    transliteration: "Nenu aa company interview kosam prepare avutunnanu.",
    literalWrong: "I that company interview for preparing am becoming.",
    correctEnglish: "I am preparing for that company's interview.",
    grammarKey: "Continuous Present 'I am preparing' (not 'preparing am becoming')"
  }
];

export default function SpeakVerseVocabVault({ onLaunchVoiceModal = () => {} }) {
  const [activeTab, setActiveTab] = useState('vault'); // 'vault' | 'mistakes' | 'eliminator'
  const [searchQuery, setSearchQuery] = useState('');
  const [vocabList, setVocabList] = useState(DEFAULT_VOCABULARY_VAULT);
  const [mistakeList, setMistakeList] = useState(DEFAULT_MISTAKE_MEMORY);

  // Vernacular Eliminator State
  const [drillLangFilter, setDrillLangFilter] = useState('all'); // 'all' | 'Telugu' | 'Hindi'
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasRevealedAnswer, setHasRevealedAnswer] = useState(false);
  const [rapidScore, setRapidScore] = useState(0);

  const availableDrills = VERNACULAR_RAPID_DRILLS.filter(d => 
    drillLangFilter === 'all' ? true : d.lang === drillLangFilter
  );

  const activeDrill = availableDrills[currentDrillIndex % availableDrills.length] || availableDrills[0];

  // 10-Second Countdown Timer
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setHasRevealedAnswer(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, countdown]);

  const handleStartCountdown = () => {
    setCountdown(10);
    setIsTimerRunning(true);
    setHasRevealedAnswer(false);
  };

  const handleNextRapidDrill = () => {
    setCurrentDrillIndex(prev => prev + 1);
    setCountdown(10);
    setIsTimerRunning(false);
    setHasRevealedAnswer(false);
  };

  const handleScoreSuccess = () => {
    setRapidScore(prev => prev + 25);
    setHasRevealedAnswer(true);
    setIsTimerRunning(false);
  };

  // Play audio pronunciation with SpeechSynthesis
  const handleSpeakWord = (word) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredVocab = vocabList.filter(v => 
    v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.synonyms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* ─── TAB SWITCHER ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vault' 
                ? 'bg-white text-indigo-700 shadow-xs font-black' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📚 Vocabulary Vault ({vocabList.length})
          </button>
          <button
            onClick={() => setActiveTab('mistakes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'mistakes' 
                ? 'bg-white text-rose-700 shadow-xs font-black' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚠️ Mistake Memory ({mistakeList.length})
          </button>
          <button
            onClick={() => setActiveTab('eliminator')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'eliminator' 
                ? 'bg-indigo-600 text-white shadow-xs font-black' 
                : 'text-indigo-700 hover:bg-white/60 font-black'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${activeTab === 'eliminator' ? 'fill-white text-white' : 'text-amber-500 fill-amber-500'}`} />
            <span>⚡ Mental Translation Eliminator (Telugu / Hindi)</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${activeTab === 'eliminator' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'}`}>10s RAPID</span>
          </button>
        </div>

        {activeTab === 'vault' && (
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vocabulary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-400 transition-all text-slate-800"
            />
          </div>
        )}
      </div>

      {/* ─── TAB 1: VOCABULARY VAULT ───────────────────────────────────────── */}
      {activeTab === 'vault' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVocab.map(item => (
            <div 
              key={item.id}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between hover:border-indigo-200 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-black text-slate-900 font-sora">
                      {item.word}
                    </h4>
                    <span className="text-xs font-mono text-indigo-600 font-semibold">
                      {item.phonetic}
                    </span>
                    <button
                      onClick={() => handleSpeakWord(item.word)}
                      className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                      title="Listen to native audio pronunciation"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {item.pos}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {item.meaning}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 italic">
                  "{item.sampleSentence}"
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.synonyms.map((syn, sIdx) => (
                    <span key={sIdx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-50/70 text-indigo-700 font-medium">
                      ≈ {syn}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{item.stageRelevance}</span>
                <button
                  onClick={() => onLaunchVoiceModal({
                    id: `vocab-${item.id}`,
                    title: `Vocabulary Usage: ${item.word}`,
                    prompt: `Use the word "${item.word}" in a natural sentence describing your academic or professional life.`,
                    sampleResponse: item.sampleSentence,
                    difficulty: item.stageRelevance
                  })}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-indigo-700" />
                  <span>Practice Usage Spoken</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB 2: MISTAKE MEMORY ─────────────────────────────────────────── */}
      {activeTab === 'mistakes' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider font-mono">
                AI Cognitive Mistake Memory
              </h4>
              <p className="text-xs text-slate-600">
                SpeakVerse records recurring grammar, preposition, and filler errors detected during live sessions so you can rehearse the corrected habits.
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-white border border-rose-200 px-2.5 py-1 rounded-full font-mono shrink-0">
              Auto-Tracked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mistakeList.map(item => (
              <div 
                key={item.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-rose-700 font-mono text-[10px] uppercase tracking-wider">
                      {item.errorType}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Logged {item.frequency} times
                    </span>
                  </div>

                  {/* Struck-through user mistake */}
                  <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-xs text-rose-900 line-through">
                    "{item.userPhrase}"
                  </div>

                  {/* Corrected version */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>"{item.correctedPhrase}"</span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    <strong>Rule:</strong> {item.explanation}
                  </p>
                </div>

                <button
                  onClick={() => onLaunchVoiceModal({
                    id: `mistake-${item.id}`,
                    title: `Fix Drill: ${item.errorType}`,
                    prompt: `Say the corrected phrase clearly 3 times: "${item.correctedPhrase}"`,
                    sampleResponse: item.correctedPhrase,
                    difficulty: "Mistake Fix"
                  })}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Practice Corrected Phrase Spoken</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: VERNACULAR MENTAL TRANSLATION ELIMINATOR ─────────────── */}
      {activeTab === 'eliminator' && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-50/90 via-white to-violet-50/60 border border-indigo-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-600 text-white font-mono">
                  Vernacular Neural Reprogramming
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Telugu & Hindi Thought Elimination
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-sora">
                Vernacular Mental Translation Eliminator
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Vernacular scholars often think in Telugu or Hindi and translate word-by-word, leading to hesitation, stammering, and awkward syntax. This 10-second rapid formulation drill trains your brain to bypass mental translation and formulate direct natural English.
              </p>
            </div>

            {/* Score & Streak Widget */}
            <div className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm text-center shrink-0 min-w-[150px] space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Neural Reflex XP</span>
              <span className="text-3xl font-black text-indigo-600 font-sora">+{rapidScore}</span>
              <span className="text-[10px] font-bold text-emerald-600 block">Active Reflex Speed</span>
            </div>
          </div>

          {/* Language Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 font-mono">Language Filter:</span>
            {['all', 'Telugu', 'Hindi'].map(lang => (
              <button
                key={lang}
                onClick={() => {
                  setDrillLangFilter(lang);
                  setCurrentDrillIndex(0);
                  setCountdown(10);
                  setIsTimerRunning(false);
                  setHasRevealedAnswer(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  drillLangFilter === lang
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                {lang === 'all' ? 'All Languages' : (lang === 'Telugu' ? 'తెలుగు (Telugu)' : 'हिन्दी (Hindi)')}
              </button>
            ))}
          </div>

          {/* Active Rapid Drill Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activeDrill.flag} {activeDrill.lang} Thought Drill #{currentDrillIndex + 1}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Target: 10s Instant Formulation
                </span>
              </div>

              {/* Countdown Timer Display */}
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border font-mono font-black text-sm ${
                  isTimerRunning 
                    ? (countdown <= 3 ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-amber-50 text-amber-600 border-amber-200')
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{countdown}s Countdown</span>
                </div>

                {!isTimerRunning && !hasRevealedAnswer && (
                  <button
                    onClick={handleStartCountdown}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start 10s Drill</span>
                  </button>
                )}
              </div>
            </div>

            {/* Vernacular Thought Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/40 border border-indigo-100/90 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 font-mono flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" />
                Raw Vernacular Thought (మీ మైండ్‌లో వచ్చే ఆలోచన):
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#0F172A] leading-relaxed font-sora">
                "{activeDrill.telugu}"
              </p>
              <p className="text-xs text-indigo-600 font-mono italic">
                Transliteration: {activeDrill.transliteration}
              </p>
            </div>

            {/* Revealed Comparison: Literal Vernacular Trap vs Direct English */}
            {hasRevealedAnswer ? (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* The Literal Translation Mistake Trap */}
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-rose-800 uppercase font-mono flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Vernacular Word-by-Word Mistake (The Trap):
                    </span>
                    <p className="text-sm font-bold text-rose-950 line-through">
                      "{activeDrill.literalWrong}"
                    </p>
                    <span className="text-[11px] text-rose-700 block">
                      Why it sounds awkward: Word-by-word translation retains native SOV (Subject-Object-Verb) grammar.
                    </span>
                  </div>

                  {/* Direct Natural English Formation */}
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Direct Natural English Formation:
                    </span>
                    <p className="text-base font-black text-emerald-950">
                      "{activeDrill.correctEnglish}"
                    </p>
                    <span className="text-[11px] text-emerald-800 block font-medium">
                      💡 Rule: {activeDrill.grammarKey}
                    </span>
                  </div>
                </div>

                {/* Score Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleScoreSuccess}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>I Formulated It Correctly (+25 XP)</span>
                    </button>
                    <button
                      onClick={handleNextRapidDrill}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Next Vernacular Thought</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onLaunchVoiceModal({
                      id: activeDrill.id,
                      title: `Vernacular Rapid Drill: ${activeDrill.lang}`,
                      prompt: `Speak the natural English formation within 5 seconds: "${activeDrill.telugu}"`,
                      sampleResponse: activeDrill.correctEnglish,
                      difficulty: "Vernacular Rapid"
                    })}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/20 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Practice Aloud With Voice Coach</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <p className="text-xs font-semibold text-slate-600">
                  Formulate this thought directly in English in your head before the timer expires!
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setHasRevealedAnswer(true)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Reveal Natural English Formation</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
