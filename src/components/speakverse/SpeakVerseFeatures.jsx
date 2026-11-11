import React, { useState } from 'react';
import { 
  Brain, Flame, Shuffle, Users, Swords, Sparkles, 
  Volume2, AlertTriangle, BookOpen, Play, ChevronRight,
  RotateCcw, CheckCircle2, ArrowRight
} from 'lucide-react';
import { SPEAKVERSE_DIFFERENTIATORS, PRONUNCIATION_DRILLS } from './SpeakVerseData';

export default function SpeakVerseFeatures({ onLaunchFeature = () => {} }) {
  const [randomTopic, setRandomTopic] = useState('');
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);

  const sampleRandomTopics = [
    "If you had to teach an alien civilization about human engineering, what single artifact would you show them and why?",
    "Should algorithms prioritize pure computational efficiency or human explainability when deciding college placements?",
    "The single most impactful mistake you made in a group project, and how it permanently reshaped your engineering discipline.",
    "Describe the feeling of debugging code at 2 AM when the breakthrough solution finally clicks in your mind.",
    "If physical currency vanished tomorrow, how would trust and trade operate in rural communities?",
    "Why curiosity outlasts raw technical skill over a 30-year engineering career."
  ];

  const handleGenerateTopic = () => {
    setIsGeneratingTopic(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * sampleRandomTopics.length);
      setRandomTopic(sampleRandomTopics[idx]);
      setIsGeneratingTopic(false);
    }, 300);
  };

  const getIcon = (name) => {
    switch (name) {
      case 'Brain': return Brain;
      case 'Flame': return Flame;
      case 'Shuffle': return Shuffle;
      case 'Users': return Users;
      case 'Swords': return Swords;
      case 'Sparkles': return Sparkles;
      case 'Volume2': return Volume2;
      case 'AlertTriangle': return AlertTriangle;
      case 'BookOpen': return BookOpen;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── BANNER ──────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 font-mono border border-indigo-100">
            Proprietary Innovations
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] font-sora">
            10 Unique Features That Make SpeakVerse Different
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Engineered specifically to solve native language hesitation, filler word dependency, and spontaneous placement freeze.
          </p>
        </div>

        <button
          onClick={handleGenerateTopic}
          className="py-2.5 px-4 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap self-start sm:self-center"
        >
          <Shuffle className={`w-3.5 h-3.5 ${isGeneratingTopic ? 'animate-spin' : ''}`} />
          <span>Spin Random Topic</span>
        </button>
      </div>

      {/* ─── RANDOM TOPIC GENERATOR LIVE MODAL/CARD ──────────────────────── */}
      {randomTopic && (
        <div className="p-6 rounded-3xl bg-indigo-50/70 border border-indigo-200 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Spontaneous Prompt Generated
            </span>
            <button
              onClick={() => setRandomTopic('')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕ Dismiss
            </button>
          </div>

          <p className="text-base sm:text-lg font-black text-[#0F172A] font-sora leading-snug">
            "{randomTopic}"
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => onLaunchFeature({
                title: 'Random Spontaneous Challenge',
                prompt: randomTopic,
                badge: 'Random Topic',
                duration: '60 secs',
                targetSkills: ['Spontaneous Framing', 'Continuous Speech', 'Zero Hesitation']
              })}
              className="py-2.5 px-5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Record 60s Spoken Answer</span>
            </button>

            <button
              onClick={handleGenerateTopic}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Reroll</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── 10 DIFFERENTIATOR FEATURE CARDS ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SPEAKVERSE_DIFFERENTIATORS.map((feat, idx) => {
          const IconComp = getIcon(feat.iconName);
          return (
            <div
              key={feat.id}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 text-indigo-600 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    {feat.tag}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-[#0F172A] font-sora group-hover:text-indigo-600 transition-colors">
                    {feat.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                    {feat.shortDesc}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 leading-relaxed font-mono">
                  <span className="font-bold text-slate-700 block mb-0.5">How It Works:</span>
                  {feat.howItWorks}
                </div>
              </div>

              {/* Action Trigger */}
              <button
                onClick={() => {
                  if (feat.id === 'random-topic') {
                    handleGenerateTopic();
                  } else {
                    onLaunchFeature({
                      title: feat.name,
                      prompt: `Practice drill for ${feat.name}: ${feat.shortDesc}`,
                      badge: feat.tag,
                      duration: '15 mins',
                      targetSkills: [feat.name, 'Real-time Evaluation', 'Confidence']
                    });
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-200 hover:border-indigo-600 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:bg-indigo-600 group-hover:text-white"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch {feat.name}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* ─── PRONUNCIATION LAB PREVIEW (MINIMAL PAIRS) ───────────────────── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="text-lg font-black text-[#0F172A] font-sora flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-indigo-600" />
              Pronunciation Lab: Minimal Pairs & Syllable Stress
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Targeted phonetic drills to soften Mother Tongue Influence (MTI) and master difficult English phonemes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {PRONUNCIATION_DRILLS.map(pair => (
            <div
              key={pair.id}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-2 hover:bg-white hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {pair.category}
                </span>
              </div>

              <div className="flex items-center justify-around py-2 border-y border-slate-200/60 font-mono">
                <div className="text-center">
                  <span className="text-sm font-black text-[#0F172A] block">{pair.pair[0]}</span>
                  <span className="text-[10px] text-slate-400">{pair.phonetic[0]}</span>
                </div>
                <span className="text-xs text-slate-300 font-bold">vs</span>
                <div className="text-center">
                  <span className="text-sm font-black text-[#0F172A] block">{pair.pair[1]}</span>
                  <span className="text-[10px] text-slate-400">{pair.phonetic[1]}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-tight">
                <span className="font-bold text-slate-800">Acoustic Tip:</span> {pair.tip}
              </p>

              <button
                onClick={() => onLaunchFeature({
                  title: `Phonetics: ${pair.pair[0]} vs ${pair.pair[1]}`,
                  prompt: `Articulate the following drill sentence with precise phonetic distinction:\n"${pair.drillSentence}"`,
                  badge: pair.category,
                  duration: '5 mins',
                  targetSkills: ['Phonetics', pair.category, 'Acoustic Clarity']
                })}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Practice Pair Drill</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
