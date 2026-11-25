import React, { useEffect, useRef, useState } from 'react';
import { 
  Activity, ShieldCheck, Zap, Volume2, VolumeX, Eye, 
  Sparkles, CheckCircle2, TrendingUp, Radio
} from 'lucide-react';

export default function RecruiterTwinHUD({
  company = { name: 'Google', logo: '🌐' },
  role = { name: 'Full Stack Engineer' },
  isSpeaking = false,
  isEvaluating = false,
  isListening = false,
  voiceEnabled = true,
  onToggleVoice = () => {},
  candidateAnswer = ''
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const tickRef = useRef(0);

  // Biometrics & Speech Telemetry calculation
  const words = candidateAnswer.trim().split(/\s+/).filter(Boolean).length;
  const lowerAnswer = candidateAnswer.toLowerCase();

  // STAR Method detection
  const starDetection = {
    situation: lowerAnswer.includes('when') || lowerAnswer.includes('project') || lowerAnswer.includes('company') || lowerAnswer.includes('situation') || lowerAnswer.includes('team'),
    task: lowerAnswer.includes('goal') || lowerAnswer.includes('challenge') || lowerAnswer.includes('task') || lowerAnswer.includes('needed to') || lowerAnswer.includes('required'),
    action: lowerAnswer.includes('implemented') || lowerAnswer.includes('designed') || lowerAnswer.includes('built') || lowerAnswer.includes('architected') || lowerAnswer.includes('refactored') || lowerAnswer.includes('optimized'),
    result: lowerAnswer.includes('result') || lowerAnswer.includes('improved') || lowerAnswer.includes('reduced') || lowerAnswer.includes('latency') || lowerAnswer.includes('%') || lowerAnswer.includes('users')
  };

  // Filler words counter
  const fillerCount = (lowerAnswer.match(/\b(um|uh|like|you know|basically|actually|sort of)\b/g) || []).length;
  const clarityScore = Math.max(70, Math.min(99, 100 - (fillerCount * 4)));
  const confidenceScore = Math.min(98, 84 + Math.min(12, Math.floor(words / 15)));

  // Holographic 3D Neural Face Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      tickRef.current += 0.04;
      const t = tickRef.current;
      const w = canvas.width = 160;
      const h = canvas.height = 140;

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 - 4;

      // Outer radar sweep ring
      ctx.strokeStyle = isEvaluating ? 'rgba(168, 85, 247, 0.4)' : (isSpeaking ? 'rgba(0, 245, 212, 0.5)' : 'rgba(56, 189, 248, 0.25)');
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 48, 0, Math.PI * 2);
      ctx.stroke();

      // Audio Equalizer Waveforms when speaking
      if (isSpeaking) {
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 1.5;
        const waveCount = 18;
        for (let i = 0; i < waveCount; i++) {
          const ang = (i / waveCount) * Math.PI * 2;
          const amp = 6 + Math.sin(t * 8 + i * 2) * 5;
          const x1 = cx + Math.cos(ang) * 48;
          const y1 = cy + Math.sin(ang) * 48;
          const x2 = cx + Math.cos(ang) * (48 + amp);
          const y2 = cy + Math.sin(ang) * (48 + amp);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // 3D Neural Wireframe Contour Rings (Head shape)
      const rings = 4;
      for (let r = 1; r <= rings; r++) {
        const ry = (r / rings) * 36;
        const rx = ry * 0.82;
        ctx.strokeStyle = isEvaluating ? 'rgba(192, 132, 252, 0.35)' : 'rgba(0, 245, 212, 0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, Math.sin(t * 0.5) * 0.1, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Glowing Eyes with Micro-gaze tracking
      const eyeSpacing = 14;
      const eyeY = cy - 6;
      const gazeX = Math.sin(t * 0.8) * 2;
      const gazeY = Math.cos(t * 0.6) * 1.5;

      // Left Eye
      ctx.fillStyle = isEvaluating ? '#c084fc' : '#00f5d4';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(cx - eyeSpacing + gazeX, eyeY + gazeY, 3, 0, Math.PI * 2);
      ctx.arc(cx + eyeSpacing + gazeX, eyeY + gazeY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Subtle Nose Bridge & Mouth Waveform
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(cx, cy - 2);
      ctx.lineTo(cx, cy + 6);
      ctx.stroke();

      // Mouth
      ctx.beginPath();
      const mouthOpen = isSpeaking ? Math.abs(Math.sin(t * 6)) * 4 : 0;
      ctx.moveTo(cx - 8, cy + 14);
      ctx.quadraticCurveTo(cx, cy + 14 + mouthOpen, cx + 8, cy + 14);
      ctx.stroke();

      // Digital Scanline Effect
      const scanY = (t * 22) % h;
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.15)';
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isSpeaking, isEvaluating]);

  return (
    <div className="space-y-4">
      {/* 3D Neural Recruiter Avatar Card */}
      <div className="p-4 rounded-3xl bg-black/50 border border-white/10 text-center space-y-3 relative overflow-hidden shadow-2xl backdrop-blur-md">
        
        {/* Holographic Canvas Box */}
        <div className="relative mx-auto w-36 h-32 rounded-2xl bg-gradient-to-b from-cyan-950/20 via-black/40 to-purple-950/20 border border-cyan-500/20 flex items-center justify-center overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full" />
          
          {/* Top Status Pill */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] font-mono text-cyan-300">
            <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
            <span>AI TWIN</span>
          </div>

          <div className="absolute bottom-2 right-2 text-lg">
            {company.logo}
          </div>
        </div>

        {/* Recruiter Details */}
        <div>
          <h3 className="text-xs font-bold text-white tracking-wide">
            {company.name} Senior Interviewer
          </h3>
          <p className="text-[10px] text-cyan-300 font-mono mt-0.5 font-semibold">
            {role.name} Track
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-2.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase ${
              isSpeaking 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse' 
                : (isEvaluating 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse'
                  : 'bg-white/5 text-gray-400 border border-white/10')
            }`}>
              {isSpeaking ? 'Speaking...' : (isEvaluating ? 'Evaluating Rubric...' : (isListening ? 'Listening...' : 'Ready'))}
            </span>

            <button
              onClick={onToggleVoice}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title={voiceEnabled ? 'Mute AI voice' : 'Enable AI voice'}
            >
              {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Live Interview Telemetry HUD */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-3 backdrop-blur-md">
        <div className="flex items-center justify-between pb-2 border-b border-white/5 text-[11px] font-bold">
          <span className="text-gray-300 flex items-center gap-1.5 font-mono">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Biometric Telemetry HUD
          </span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">ACTIVE</span>
        </div>

        {/* Confidence Gauge */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-gray-400">Confidence Index</span>
            <span className="text-cyan-300 font-bold">{confidenceScore}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
        </div>

        {/* STAR Method Alignment Indicators */}
        <div className="pt-1 border-t border-white/5 space-y-1.5">
          <span className="text-[9px] text-gray-400 font-mono uppercase block font-semibold">
            STAR Method Recognition
          </span>
          <div className="grid grid-cols-4 gap-1 text-center font-mono text-[9px]">
            <div className={`p-1 rounded border transition-all ${starDetection.situation ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold' : 'bg-white/5 border-white/5 text-gray-500'}`}>
              [S] Sit
            </div>
            <div className={`p-1 rounded border transition-all ${starDetection.task ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold' : 'bg-white/5 border-white/5 text-gray-500'}`}>
              [T] Task
            </div>
            <div className={`p-1 rounded border transition-all ${starDetection.action ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold' : 'bg-white/5 border-white/5 text-gray-500'}`}>
              [A] Act
            </div>
            <div className={`p-1 rounded border transition-all ${starDetection.result ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold' : 'bg-white/5 border-white/5 text-gray-500'}`}>
              [R] Res
            </div>
          </div>
        </div>

        {/* Articulation & Filler Word Count */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
          <span className="text-gray-400">Clarity Rating:</span>
          <span className="text-emerald-300 font-bold">{clarityScore}/100</span>
        </div>
      </div>
    </div>
  );
}
