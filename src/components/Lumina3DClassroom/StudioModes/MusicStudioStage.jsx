import React, { useState } from 'react';
import { Music, Play, Volume2, Sparkles, Mic, Activity } from 'lucide-react';
import { luminaAudio } from '../../../services/luminaAudioEngine';

const SARGAM_SWARAS = [
  { key: 'Sa', western: 'C4', label: 'Sa (Shadja)' },
  { key: 'Re', western: 'D4', label: 'Re (Rishabh)' },
  { key: 'Ga', western: 'E4', label: 'Ga (Gandhar)' },
  { key: 'Ma', western: 'F4', label: 'Ma (Madhyam)' },
  { key: 'Pa', western: 'G4', label: 'Pa (Pancham)' },
  { key: 'Dha', western: 'A4', label: 'Dha (Dhaivat)' },
  { key: 'Ni', western: 'B4', label: 'Ni (Nishad)' },
  { key: 'Sa_high', western: 'C5', label: 'Ṡa (Tar Saptak)' }
];

const PIANO_KEYS = [
  { note: 'C4', swara: 'Sa', isBlack: false },
  { note: 'C#4', isBlack: true },
  { note: 'D4', swara: 'Re', isBlack: false },
  { note: 'D#4', isBlack: true },
  { note: 'E4', swara: 'Ga', isBlack: false },
  { note: 'F4', swara: 'Ma', isBlack: false },
  { note: 'F#4', isBlack: true },
  { note: 'G4', swara: 'Pa', isBlack: false },
  { note: 'G#4', isBlack: true },
  { note: 'A4', swara: 'Dha', isBlack: false },
  { note: 'A#4', isBlack: true },
  { note: 'B4', swara: 'Ni', isBlack: false },
  { note: 'C5', swara: 'Ṡa', isBlack: false }
];

export default function MusicStudioStage({ onNotePlayed }) {
  const [activeNote, setActiveNote] = useState(null);
  const [isPlayingWarmup, setIsPlayingWarmup] = useState(false);

  const handlePlayKey = (noteKey, swaraName = null) => {
    setActiveNote(noteKey);
    luminaAudio.playNote(noteKey, 0.9, 'triangle');
    onNotePlayed?.(noteKey, swaraName);
    setTimeout(() => setActiveNote(null), 300);
  };

  // Play Complete Sargam Scale Routine (Ascending & Descending)
  const handleRunScale = async () => {
    if (isPlayingWarmup) return;
    setIsPlayingWarmup(true);

    const fullScale = [...SARGAM_SWARAS, ...[...SARGAM_SWARAS].reverse().slice(1)];
    for (const swara of fullScale) {
      handlePlayKey(swara.key, swara.label);
      await new Promise(r => setTimeout(r, 450));
    }
    setIsPlayingWarmup(false);
  };

  return (
    <div className="relative w-full h-full rounded-2xl bg-[#120826]/95 border-2 border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.3)] p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none">
      
      {/* ─── HEADER ─── */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-400/20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-200">
            Vocal & Musical Ear Training Studio
          </span>
        </div>

        <button
          onClick={handleRunScale}
          disabled={isPlayingWarmup}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-500/30 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{isPlayingWarmup ? 'Demonstrating Swaras...' : 'Demonstrate Sargam Scale'}</span>
        </button>
      </div>

      {/* ─── SARGAM SWARA PITCH PADS ─── */}
      <div className="py-2 grid grid-cols-4 sm:grid-cols-8 gap-2">
        {SARGAM_SWARAS.map(s => {
          const isActive = activeNote === s.key;
          return (
            <button
              key={s.key}
              onClick={() => handlePlayKey(s.key, s.label)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-t from-cyan-500 to-purple-600 border-white shadow-[0_0_20px_rgba(56,189,248,0.7)] scale-105'
                  : 'bg-black/40 border-purple-400/30 hover:bg-white/10 hover:border-purple-300'
              }`}
            >
              <span className={`text-xl font-black ${isActive ? 'text-white' : 'text-purple-300'}`}>
                {s.key.replace('_high', '')}
              </span>
              <span className="text-[10px] text-gray-300 mt-1 font-mono">
                {s.western}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── PLAYABLE PIANO KEYBOARD ─── */}
      <div className="py-3 flex justify-center">
        <div className="relative flex items-start bg-black/60 p-2.5 rounded-2xl border border-white/20 shadow-2xl">
          {PIANO_KEYS.map((k, idx) => {
            const isPressed = activeNote === k.note || (k.swara && activeNote === k.swara);
            if (!k.isBlack) {
              return (
                <button
                  key={k.note}
                  onClick={() => handlePlayKey(k.note, k.swara)}
                  className={`w-9 sm:w-11 h-28 sm:h-32 rounded-b-xl border border-gray-400/30 transition-all cursor-pointer flex flex-col justify-end pb-2 items-center mx-[1px] ${
                    isPressed
                      ? 'bg-cyan-200 shadow-[0_0_15px_#38bdf8] scale-y-98'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <span className="text-[9px] font-bold text-gray-800 font-mono">{k.swara || k.note}</span>
                </button>
              );
            } else {
              return (
                <button
                  key={k.note}
                  onClick={() => handlePlayKey(k.note)}
                  className={`w-6 sm:w-7 h-18 sm:h-20 -mx-3 sm:-mx-3.5 z-20 rounded-b-lg transition-all cursor-pointer shadow-md ${
                    isPressed
                      ? 'bg-purple-600 shadow-[0_0_15px_#a855f7]'
                      : 'bg-[#1e1b2e] hover:bg-black border border-gray-700'
                  }`}
                  title={k.note}
                />
              );
            }
          })}
        </div>
      </div>

      {/* ─── VOCAL PHYSIOLOGY TIP ─── */}
      <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-400/30 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
          <span className="text-gray-200">
            <strong>Vocal Resonance Principle:</strong> Diaphragmatic breath expansion allows your vocal folds to vibrate freely without throat tension.
          </span>
        </div>
        <span className="text-[10px] text-purple-300 font-mono hidden sm:block">Click keys to play notes</span>
      </div>

      {/* ─── FOOTER ─── */}
      <div className="pt-2 border-t border-purple-400/20 flex items-center justify-between text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5 text-purple-300 font-mono">
          <Music className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-time Web Audio Synthesizer · 440 Hz Equal Temperament</span>
        </span>
        <span className="font-mono text-purple-300">Natural Pitched Audio</span>
      </div>

    </div>
  );
}
