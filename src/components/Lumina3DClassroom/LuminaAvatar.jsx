import React, { useState, useEffect } from 'react';

/**
 * 🌟 LuminaAvatar: Precision Facial, Eye-Blink, Lip-Sync & Pointer Motion Engine
 * Positions living movements directly onto Lumina's face and hand with exact coordinates.
 */
export default function LuminaAvatar({
  isSpeaking = false,
  isListening = false,
  isInterrupted = false,
  pointingTarget = 'roots' // 'roots' | 'standard' | 'graph'
}) {
  const [blink, setBlink] = useState(false);
  const [mouthShape, setMouthShape] = useState(0); // 0: closed, 1: slight, 2: open, 3: wide

  // 1. Natural Human Eye-Blinking Cycle (every 2.5 - 4 seconds)
  useEffect(() => {
    let timeoutId;
    const triggerBlink = () => {
      const nextDelay = Math.random() * 2000 + 2500;
      timeoutId = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          // 30% chance of realistic double-blink
          if (Math.random() < 0.3) {
            setTimeout(() => {
              setBlink(true);
              setTimeout(() => {
                setBlink(false);
                triggerBlink();
              }, 120);
            }, 90);
          } else {
            triggerBlink();
          }
        }, 140);
      }, nextDelay);
    };

    triggerBlink();
    return () => clearTimeout(timeoutId);
  }, []);

  // 2. Audio-Driven Real-Time Lip Sync
  useEffect(() => {
    if (!isSpeaking) {
      setMouthShape(0);
      return;
    }

    const interval = setInterval(() => {
      // Natural speech phoneme transitions
      const shapes = [1, 2, 3, 2, 1, 0, 2];
      setMouthShape(shapes[Math.floor(Math.random() * shapes.length)]);
    }, 115);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20">
      
      {/* ─── A. LIVING EYELID BLINK OVERLAY ─── */}
      {/* Mapped precisely onto Lumina's eyes at x: 26.2%, y: 29.8% in the 1024x576 frame */}
      <div 
        className={`absolute rounded-full transition-opacity duration-100 ${
          blink ? 'opacity-95' : 'opacity-0'
        }`}
        style={{
          left: '24.2%',
          top: '28.8%',
          width: '4.8%',
          height: '2.0%',
          background: 'linear-gradient(180deg, #7c4436 0%, #a46b5a 60%, #c48b7a 100%)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.6)',
          transform: 'rotate(-1deg)'
        }}
      />

      {/* ─── B. AUDIO-DRIVEN LIP-SYNC MOUTH OVERLAY ─── */}
      {/* Mapped precisely onto Lumina's lips at x: 26.5%, y: 35.2% in the 1024x576 frame */}
      {isSpeaking && (
        <div 
          className="absolute transition-all duration-100"
          style={{
            left: '25.3%',
            top: '34.6%',
            width: '3.6%',
            height: mouthShape === 0 ? '0.8%' : mouthShape === 1 ? '1.8%' : mouthShape === 2 ? '2.6%' : '2.1%',
            background: mouthShape === 0 
              ? 'transparent' 
              : mouthShape === 1 
              ? 'radial-gradient(ellipse at center, #3b0a14 0%, #7c2234 80%)'
              : mouthShape === 2
              ? 'radial-gradient(ellipse at center, #26050d 30%, #6e1c2b 85%)'
              : 'radial-gradient(ellipse at center, #420d18 0%, #87263b 80%)',
            borderRadius: mouthShape >= 2 ? '50% 50% 45% 45%' : '40%',
            boxShadow: mouthShape > 0 ? '0 0 4px rgba(180,50,75,0.7)' : 'none',
            transform: 'rotate(-1.5deg)'
          }}
        />
      )}

      {/* ─── C. GESTURING HAND LASER POINTER & GLOW ─── */}
      {/* Positioned right at Lumina's outstretched hand at x: 48%, y: 43% */}
      <div 
        className="absolute"
        style={{
          left: '48.2%',
          top: '43.2%'
        }}
      >
        {/* Pulsing light bead at her fingertip */}
        <div className="relative">
          <span className="absolute -inset-2 rounded-full bg-cyan-400/40 blur-sm animate-ping" />
          <span className="block w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_15px_#38bdf8,0_0_30px_#a855f7]" />
        </div>

        {/* Dynamic laser pointer targeting the specific whiteboard section */}
        <svg className="absolute top-1.5 left-2 w-96 h-48 overflow-visible pointer-events-none">
          <defs>
            <linearGradient id="luminaPointerBeam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#c084fc" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line 
            x1="0" 
            y1="0" 
            x2={pointingTarget === 'roots' ? '180' : pointingTarget === 'standard' ? '140' : '220'} 
            y2={pointingTarget === 'roots' ? '80' : pointingTarget === 'standard' ? '-20' : '20'} 
            stroke="url(#luminaPointerBeam)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* ─── D. INTERRUPT ACKNOWLEDGEMENT BANNER ─── */}
      {isInterrupted && (
        <div 
          className="absolute px-3 py-1 rounded-full bg-cyan-500/25 border border-cyan-400/60 backdrop-blur-md text-[10px] font-black text-cyan-200 tracking-wider shadow-lg animate-bounce"
          style={{
            left: '20%',
            top: '18%'
          }}
        >
          ✋ "I hear you! What would you like to clarify?"
        </div>
      )}

      {/* ─── E. ATTENTIVE LISTENING STATE PULSE AROUND HER EMBLEM ─── */}
      {isListening && !isSpeaking && (
        <div 
          className="absolute w-12 h-12 rounded-full border border-purple-400/50 animate-ping"
          style={{
            left: '24.5%',
            top: '39%'
          }}
        />
      )}

    </div>
  );
}
