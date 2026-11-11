// ============================================================================
// LUMIXORA SpeakVerse™ — VOCABULARY VAULT & MISTAKE MEMORY
// Tagline: "From Hesitation to Communication. From Communication to Confidence."
// Features: Active Saved Vocabulary • Acoustic Pronunciation Audio
// Mistake Memory with 1-Click "Practice Fix" Audio Drills
// ============================================================================

import React, { useState } from 'react';
import { 
  BookOpen, Volume2, AlertCircle, Check, Search, Plus, 
  RotateCcw, Play, Sparkles, Filter, CheckCircle2, ChevronRight
} from 'lucide-react';
import { DEFAULT_VOCABULARY_VAULT, DEFAULT_MISTAKE_MEMORY } from './SpeakVerseData';

export default function SpeakVerseVocabVault({ onLaunchVoiceModal = () => {} }) {
  const [activeTab, setActiveTab] = useState('vault'); // 'vault' | 'mistakes'
  const [searchQuery, setSearchQuery] = useState('');
  const [vocabList, setVocabList] = useState(DEFAULT_VOCABULARY_VAULT);
  const [mistakeList, setMistakeList] = useState(DEFAULT_MISTAKE_MEMORY);

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
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vault' 
                ? 'bg-white text-indigo-700 shadow-xs font-black' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📚 Vocabulary Vault ({vocabList.length})
          </button>
          <button
            onClick={() => setActiveTab('mistakes')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'mistakes' 
                ? 'bg-white text-rose-700 shadow-xs font-black' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚠️ Mistake Memory ({mistakeList.length})
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
    </div>
  );
}
