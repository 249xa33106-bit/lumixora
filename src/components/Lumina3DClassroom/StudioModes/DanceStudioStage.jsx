import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Activity, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { luminaAudio } from '../../../services/luminaAudioEngine';

const DANCE_STYLES = [
  {
    id: 'hiphop',
    name: 'Urban Hip-Hop',
    steps: [
      { beat: 1, name: 'Chest Pop', desc: 'Isolate torso upward on kick beat 1' },
      { beat: 2, name: 'Rebound & Hold', desc: 'Settle weight into knees' },
      { beat: 3, name: 'Left Heel Slide', desc: 'Slide left foot diagonally' },
      { beat: 4, name: 'Snap & Head Tilt', desc: 'Right hand snap with quick chin tilt' },
      { beat: 5, name: 'Core Body Roll', desc: 'Undulate spine from chest to hips' },
      { beat: 6, name: 'Deep Knee Drop', desc: 'Lower center of gravity' },
      { beat: 7, name: 'Cross Turn', desc: 'Spin 180 degrees on ball of foot' },
      { beat: 8, name: 'Sharp Freeze', desc: 'Lock posture with strong eye contact' }
    ]
  },
  {
    id: 'bharatanatyam',
    name: 'Classical Bharatanatyam',
    steps: [
      { beat: 1, name: 'Aramandi Stance', desc: 'Half-seated diamond knee posture' },
      { beat: 2, name: 'Pataka Mudra', desc: 'Open palm hand gesture at shoulder' },
      { beat: 3, name: 'Tatta Adavu Strike', desc: 'Right heel stamp on ground' },
      { beat: 4, name: 'Tripataka Transition', desc: 'Ring finger bend with eye focus' },
      { beat: 5, name: 'Natta Adavu Stretch', desc: 'Left leg stretch with heel contact' },
      { beat: 6, name: 'Rhythm Sync (Tha)', desc: 'Torso alignment to rhythm' },
      { beat: 7, name: 'Dhi-Tha-Dhi Footwork', desc: 'Quick bilateral toe-heel strike' },
      { beat: 8, name: 'Samapada Release', desc: 'Return to center poise' }
    ]
  },
  {
    id: 'bollywood',
    name: 'Bollywood Freestyle',
    steps: [
      { beat: 1, name: 'Bhangra Bounce', desc: 'Shoulder bounce with raised hands' },
      { beat: 2, name: 'Double Tap', desc: 'Right toe tap twice' },
      { beat: 3, name: 'Thumka Hip Sway', desc: 'Side hip pop with cheerful smile' },
      { beat: 4, name: 'Clap Accent', desc: 'Mid-air sync clap' },
      { beat: 5, name: 'Spin & Twirl', desc: 'Graceful pirouette turn' },
      { beat: 6, name: 'Wrist Whirl', desc: 'Circular wrist rotations' },
      { beat: 7, name: 'Forward Step-Out', desc: 'Diagonal dynamic lunge' },
      { beat: 8, name: 'Celebration Pose', desc: 'High-energy ending freeze' }
    ]
  }
];

export default function DanceStudioStage({ onBeatChange }) {
  const [selectedStyle, setSelectedStyle] = useState('hiphop');
  const [activeBeat, setActiveBeat] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlowMo, setIsSlowMo] = useState(false); // 60 BPM (Slow-mo) vs 100 BPM (Normal)
  const timerRef = useRef(null);

  const currentStyleData = DANCE_STYLES.find(s => s.id === selectedStyle) || DANCE_STYLES[0];

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = isSlowMo ? 1000 : 600; // 60 BPM vs 100 BPM
      timerRef.current = setInterval(() => {
        setActiveBeat(prev => {
          const next = prev >= 8 ? 1 : prev + 1;
          luminaAudio.playDanceBeat(next);
          onBeatChange?.(next, currentStyleData.steps[next - 1]);
          return next;
        });
      }, intervalMs);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, isSlowMo, selectedStyle]);

  const handleTogglePlay = () => {
    luminaAudio.init();
    if (!isPlaying) {
      luminaAudio.playDanceBeat(activeBeat);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepClick = (beatNum) => {
    setActiveBeat(beatNum);
    luminaAudio.playDanceBeat(beatNum);
    onBeatChange?.(beatNum, currentStyleData.steps[beatNum - 1]);
  };

  return (
    <div className="relative w-full h-full rounded-2xl bg-[#140b28]/95 border-2 border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.3)] p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none">
      
      {/* ─── HEADER: DANCE STYLE SELECTOR & CONTROLS ─── */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-400/20 z-10">
        
        {/* Style Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-purple-400/30">
          {DANCE_STYLES.map(style => (
            <button
              key={style.id}
              onClick={() => {
                setSelectedStyle(style.id);
                setActiveBeat(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedStyle === style.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>

        {/* Metronome Speed (Normal 100 BPM vs Slow 60 BPM) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSlowMo(!isSlowMo)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
              isSlowMo
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {isSlowMo ? 'Slow-Mo (60 BPM)' : 'Normal (100 BPM)'}
          </button>
          
          <button
            onClick={handleTogglePlay}
            className={`px-3 py-1 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-all ${
              isPlaying
                ? 'bg-rose-600 text-white shadow-rose-600/30'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/40'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Count Aloud (1-8)'}</span>
          </button>
        </div>

      </div>

      {/* ─── 8-COUNT CHOREOGRAPHY TIMELINE GRID ─── */}
      <div className="py-4 grid grid-cols-4 sm:grid-cols-8 gap-2.5 z-10">
        {currentStyleData.steps.map(step => {
          const isActive = activeBeat === step.beat;
          return (
            <div
              key={step.beat}
              onClick={() => handleStepClick(step.beat)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between min-h-[105px] ${
                isActive
                  ? 'bg-gradient-to-b from-purple-600/60 to-indigo-900/80 border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.55)] scale-105'
                  : 'bg-black/40 border-purple-400/20 hover:border-purple-400/50 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xl font-black ${isActive ? 'text-cyan-300' : 'text-purple-300'}`}>
                  {step.beat}
                </span>
                {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
              </div>

              <div>
                <span className="block text-xs font-bold text-white leading-tight">
                  {step.name}
                </span>
                <span className="block text-[9px] text-gray-400 mt-1 line-clamp-2">
                  {step.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── ACTIVE STEP SPOTLIGHT & CHOREOGRAPHY CUE ─── */}
      <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-400/30 flex items-center justify-between text-xs z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center font-black text-cyan-300 text-lg">
            {activeBeat}
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>{currentStyleData.steps[activeBeat - 1].name}</span>
              <span className="text-[10px] text-purple-300 font-mono">({currentStyleData.name})</span>
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">
              {currentStyleData.steps[activeBeat - 1].desc}
            </p>
          </div>
        </div>

        <div className="text-right text-[10px] text-purple-300 font-mono hidden sm:block">
          Tap any beat to repeat movement
        </div>
      </div>

      {/* ─── FOOTER METRONOME STATUS ─── */}
      <div className="pt-2 border-t border-purple-400/20 flex items-center justify-between text-[11px] text-gray-400 z-10">
        <span className="flex items-center gap-1.5 text-purple-300 font-mono">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Rhythm Synchronizer · Rhythmic Movement Controller</span>
        </span>
        <span className="font-mono text-purple-300">Tempo: {isSlowMo ? '60 BPM' : '100 BPM'}</span>
      </div>

    </div>
  );
}
