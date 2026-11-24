import React from 'react';
import { 
  Camera, MessageSquare, Mic, MicOff, Monitor, Sparkles, 
  Volume2, VolumeX, Hand, HelpCircle, Layers, RefreshCw
} from 'lucide-react';

export default function ClassroomDock({
  cameraMode = 'stage', // 'stage' | 'whiteboard' | 'closeUp'
  onCameraChange,
  isListening = false,
  isSpeaking = false,
  onToggleMic,
  onInterrupt,
  show3DModel = false,
  onToggle3D,
  showTranscript = false,
  onToggleTranscript,
  activeSubject = 'math',
  onSelectSubject
}) {
  return (
    <div className="relative z-40 flex items-center justify-center p-3">
      
      {/* Floating Frosted Glass Dock Container */}
      <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 rounded-full bg-black/60 border border-purple-400/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(168,85,247,0.35)] transition-all">
        
        {/* 1. Camera Angle Switcher */}
        <button
          onClick={() => {
            const nextMode = cameraMode === 'stage' ? 'whiteboard' : cameraMode === 'whiteboard' ? 'closeUp' : 'stage';
            onCameraChange(nextMode);
          }}
          className={`p-2.5 rounded-full transition-all cursor-pointer border ${
            cameraMode !== 'stage'
              ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/30'
              : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border-white/10'
          }`}
          title={`Camera View: ${cameraMode.toUpperCase()} (Click to change)`}
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* 2. Chat / Lesson Transcript Toggle */}
        <button
          onClick={onToggleTranscript}
          className={`p-2.5 rounded-full transition-all cursor-pointer border ${
            showTranscript
              ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/30'
              : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border-white/10'
          }`}
          title="Toggle Full Lesson Transcript"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* ─── 3. LEFT DANCING AUDIO FREQUENCY BARS ─── */}
        <div className="hidden sm:flex items-center gap-1 px-1">
          {[40, 70, 95, 60, 80, 45].map((h, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-purple-500 to-cyan-400 transition-all duration-150"
              style={{
                height: isSpeaking || isListening ? `${Math.max(6, (h * (isSpeaking ? 0.35 : 0.25)))}px` : '4px',
                animation: isSpeaking || isListening ? `pulse 0.4s ease-in-out infinite alternate ${i * 0.08}s` : 'none'
              }}
            />
          ))}
        </div>

        {/* ─── 4. BIG PRIMARY INTERRUPT & SPEECH MICROPHONE BUTTON ─── */}
        <div className="relative">
          {/* Outer Pulsing Glow */}
          {(isListening || isSpeaking) && (
            <span className="absolute -inset-1.5 rounded-full bg-purple-500/40 animate-ping pointer-events-none" />
          )}

          <button
            onClick={() => {
              if (isSpeaking) {
                // If Lumina is currently talking, this interrupts her instantly
                onInterrupt();
              } else {
                onToggleMic();
              }
            }}
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
              isListening
                ? 'bg-rose-500 text-white shadow-rose-500/50 ring-4 ring-rose-400/30 animate-pulse'
                : isSpeaking
                ? 'bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-cyan-500/40 hover:scale-105'
                : 'bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 hover:opacity-95 text-white shadow-purple-600/40 hover:scale-105'
            }`}
            title={isSpeaking ? 'Click to Interrupt Lumina' : isListening ? 'Listening... (Click to stop)' : 'Speak to Lumina'}
          >
            {isSpeaking ? (
              <Hand className="w-6 h-6 animate-bounce" />
            ) : isListening ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* ─── 5. RIGHT DANCING AUDIO FREQUENCY BARS ─── */}
        <div className="hidden sm:flex items-center gap-1 px-1">
          {[45, 80, 60, 95, 70, 40].map((h, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-cyan-400 to-purple-500 transition-all duration-150"
              style={{
                height: isSpeaking || isListening ? `${Math.max(6, (h * (isSpeaking ? 0.35 : 0.25)))}px` : '4px',
                animation: isSpeaking || isListening ? `pulse 0.4s ease-in-out infinite alternate ${i * 0.08}s` : 'none'
              }}
            />
          ))}
        </div>

        {/* 6. 3D Model Demonstration Toggle */}
        <button
          onClick={onToggle3D}
          className={`p-2.5 rounded-full transition-all cursor-pointer border ${
            show3DModel
              ? 'bg-cyan-500 text-black border-cyan-300 shadow-md shadow-cyan-400/40'
              : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border-white/10'
          }`}
          title="Toggle 3D Scientific Demonstrations"
        >
          <Monitor className="w-4 h-4" />
        </button>

        {/* 7. Polymath Subject Switcher Menu */}
        <button
          onClick={() => {
            const subjects = ['math', 'music', 'dance', 'code', 'art'];
            const next = subjects[(subjects.indexOf(activeSubject) + 1) % subjects.length];
            onSelectSubject(next);
          }}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-purple-400/30 text-purple-300 hover:text-white transition-all cursor-pointer"
          title={`Active Subject: ${activeSubject.toUpperCase()} (Click to cycle)`}
        >
          <Sparkles className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
}
