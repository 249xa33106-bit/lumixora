import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, ShieldCheck, Heart, Sparkles, Check } from 'lucide-react';
import { luminaAudio } from '../../../services/luminaAudioEngine';

const YOGA_POSES = [
  {
    id: 'vrikshasana',
    name: 'Vrikshasana (Tree Pose)',
    focus: 'Balance & Hip Mobility',
    points: [
      'Grounded foot active through three arch points',
      'Sole placed on inner calf or thigh (never on the knee joint)',
      'Hands in Anjali Mudra (prayer) at heart center or raised overhead',
      'Fixed eye gaze (Drishti) on an unmoving point ahead'
    ]
  },
  {
    id: 'warrior2',
    name: 'Virabhadrasana II (Warrior 2)',
    focus: 'Leg Power & Torso Alignment',
    points: [
      'Front knee bent to 90 degrees directly stacked over ankle',
      'Back foot grounded at a 45-degree angle',
      'Arms extended parallel to the floor in opposite directions',
      'Gaze over the front middle finger with relaxed shoulders'
    ]
  },
  {
    id: 'tadasana',
    name: 'Tadasana (Mountain Pose)',
    focus: 'Spinal Decompression & Posture',
    points: [
      'Big toes touching, heels slightly apart',
      'Thighs engaged and rotated subtly inward',
      'Crown of the head lengthening toward the sky',
      'Even weight distribution across both soles'
    ]
  }
];

export default function YogaStudioStage({ onPoseSelect }) {
  const [selectedPose, setSelectedPose] = useState('vrikshasana');
  const [breathPhase, setBreathPhase] = useState('Inhale (4s)'); // 'Inhale' | 'Hold' | 'Exhale'
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathCount, setBreathCount] = useState(4);

  const currentPoseData = YOGA_POSES.find(p => p.id === selectedPose) || YOGA_POSES[0];

  useEffect(() => {
    if (!isBreathingActive) return;

    luminaAudio.playZenChime();
    let currentStep = 0; // 0: Inhale, 1: Hold, 2: Exhale

    const interval = setInterval(() => {
      currentStep = (currentStep + 1) % 3;
      if (currentStep === 0) {
        setBreathPhase('Inhale (4s)');
        luminaAudio.playZenChime();
      } else if (currentStep === 1) {
        setBreathPhase('Hold (4s)');
      } else {
        setBreathPhase('Exhale (4s)');
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isBreathingActive]);

  return (
    <div className="relative w-full h-full rounded-2xl bg-[#0f1917]/95 border-2 border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.25)] p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none">
      
      {/* ─── HEADER ─── */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-200">
            Yoga & Pranayama Breath Anatomy
          </span>
        </div>

        <button
          onClick={() => {
            luminaAudio.init();
            setIsBreathingActive(!isBreathingActive);
          }}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-all ${
            isBreathingActive
              ? 'bg-rose-600 text-white shadow-rose-600/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/30'
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          <span>{isBreathingActive ? 'Stop Breath Cycle' : 'Start Pranayama (4-4-4)'}</span>
        </button>
      </div>

      {/* ─── PRANAYAMA EXPANDING VISUALIZER & POSES ─── */}
      <div className="py-2 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Left: Interactive Breath Ring */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Animated breathing glow ring */}
            <div 
              className={`absolute inset-0 rounded-full border-4 border-emerald-400/60 shadow-[0_0_30px_rgba(52,211,153,0.5)] transition-all duration-[4000ms] ${
                isBreathingActive && breathPhase.startsWith('Inhale')
                  ? 'scale-125 bg-emerald-500/20'
                  : isBreathingActive && breathPhase.startsWith('Hold')
                  ? 'scale-125 bg-emerald-400/30'
                  : 'scale-90 bg-emerald-950/20'
              }`}
            />
            <div className="text-center z-10">
              <span className="block text-sm font-black text-white font-mono">{breathPhase}</span>
              <span className="text-[10px] text-emerald-300 font-mono">Box Breathing</span>
            </div>
          </div>
        </div>

        {/* Right: Yoga Pose Alignment Checkpoints */}
        <div className="md:col-span-7 space-y-2">
          {/* Pose Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-emerald-500/30 mb-2">
            {YOGA_POSES.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPose(p.id);
                  onPoseSelect?.(p);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedPose === p.id
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-white text-sm">{currentPoseData.name}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {currentPoseData.focus}
              </span>
            </div>

            <ul className="space-y-1.5 text-xs text-gray-300">
              {currentPoseData.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* ─── SAFETY & ALIGNMENT FOOTER ─── */}
      <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-300 font-mono">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Anatomical Safety First · Gentle Joint Alignment Guidance</span>
        </span>
        <span>Zen Movement Studio</span>
      </div>

    </div>
  );
}
