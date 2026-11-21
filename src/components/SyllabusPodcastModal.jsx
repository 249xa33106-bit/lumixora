import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Pause, RotateCcw, FastForward, Rewind, Volume2, VolumeX, 
  Sparkles, Download, Copy, Check, Radio, Headphones, BookOpen, MessageSquare,
  Award, RefreshCw, ChevronRight, User, GraduationCap, Flame, ArrowRight
} from 'lucide-react';
import { generatePodcastScript } from '../services/academicIntelligenceService';

export default function SyllabusPodcastModal({ 
  isOpen, 
  onClose, 
  initialTopic = 'Operating Systems: Process Synchronization & Deadlocks',
  initialSubject = 'Computer Science' 
}) {
  const [topic, setTopic] = useState(initialTopic);
  const [subject, setSubject] = useState(initialSubject);
  const [customInput, setCustomInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [podcastData, setPodcastData] = useState(null);
  
  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Audio & Waveform References
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const transcriptContainerRef = useRef(null);
  const voicesRef = useRef({ maya: null, alex: null });

  // Update initial topic on open
  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
      setCustomInput(initialTopic);
    }
    if (initialSubject) {
      setSubject(initialSubject);
    }
  }, [initialTopic, initialSubject, isOpen]);

  // Initialize Speech Synthesis & Voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const voices = synthRef.current.getVoices();
        if (voices.length > 0) {
          // Identify Female voice for Maya
          const mayaVoice = voices.find(v => 
            (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Google UK English Female')) && v.lang.startsWith('en')
          ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

          // Identify Male voice for Alex
          const alexVoice = voices.find(v => 
            (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Alex') || v.name.includes('George') || v.name.includes('Google US English')) && v.lang.startsWith('en') && v !== mayaVoice
          ) || voices.find(v => v !== mayaVoice) || voices[0];

          voicesRef.current = { maya: mayaVoice, alex: alexVoice };
        }
      };

      loadVoices();
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      stopPlayback();
    };
  }, []);

  // Auto-generate on first open if no podcast data yet
  useEffect(() => {
    if (isOpen && !podcastData && !isGenerating) {
      loadEpisode(topic, subject);
    }
  }, [isOpen]);

  // Audio Waveform Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const renderWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 36;
      const barWidth = canvas.width / barCount;

      for (let i = 0; i < barCount; i++) {
        let height = 6;
        if (isPlaying && !isMuted) {
          // Dynamic pulsating heights when speaking
          const freq = Math.sin(phase + i * 0.3) * Math.cos(phase * 0.7 + i * 0.2);
          height = Math.max(6, Math.abs(freq) * 45 + Math.random() * 8);
        }

        const x = i * barWidth;
        const y = (canvas.height - height) / 2;

        const currentSpeaker = podcastData?.dialogue?.[currentLineIndex]?.speaker;
        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        
        if (currentSpeaker === 'Maya') {
          gradient.addColorStop(0, '#06b6d4'); // Cyan
          gradient.addColorStop(1, '#6366f1'); // Indigo
        } else {
          gradient.addColorStop(0, '#10b981'); // Emerald
          gradient.addColorStop(1, '#3b82f6'); // Blue
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 1.5, y, barWidth - 3, height, 4);
        ctx.fill();
      }

      phase += isPlaying ? 0.15 : 0.02;
      animationFrameRef.current = requestAnimationFrame(renderWaveform);
    };

    renderWaveform();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, isMuted, currentLineIndex, podcastData]);

  // Scroll transcript to active line
  useEffect(() => {
    if (transcriptContainerRef.current) {
      const activeEl = transcriptContainerRef.current.querySelector(`[data-line="${currentLineIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentLineIndex]);

  // Fetch / Generate Episode
  const loadEpisode = async (targetTopic, targetSubject) => {
    stopPlayback();
    setIsGenerating(true);
    try {
      const data = await generatePodcastScript(targetTopic, targetSubject);
      setPodcastData(data);
      setCurrentLineIndex(0);
    } catch (err) {
      console.error('Failed to generate podcast:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setTopic(customInput.trim());
    loadEpisode(customInput.trim(), subject);
  };

  // ── Speech Synthesis Controls ──
  const speakCurrentLine = (lineIdx) => {
    if (!synthRef.current || !podcastData?.dialogue || lineIdx >= podcastData.dialogue.length) {
      setIsPlaying(false);
      return;
    }

    synthRef.current.cancel();

    if (isMuted) {
      // Simulate playback silently
      const textLength = podcastData.dialogue[lineIdx].text.length;
      const durationMs = (textLength / 14) * (1000 / playbackSpeed);
      setTimeout(() => {
        if (isPlaying && lineIdx + 1 < podcastData.dialogue.length) {
          setCurrentLineIndex(lineIdx + 1);
        } else {
          setIsPlaying(false);
        }
      }, durationMs);
      return;
    }

    const item = podcastData.dialogue[lineIdx];
    const utterance = new SpeechSynthesisUtterance(item.text);
    utteranceRef.current = utterance;

    // Assign Voice based on speaker
    const voice = item.speaker === 'Maya' ? voicesRef.current.maya : voicesRef.current.alex;
    if (voice) utterance.voice = voice;

    utterance.rate = playbackSpeed;
    utterance.pitch = item.speaker === 'Maya' ? 1.05 : 0.95;

    utterance.onend = () => {
      if (lineIdx + 1 < podcastData.dialogue.length) {
        setCurrentLineIndex(lineIdx + 1);
      } else {
        setIsPlaying(false);
        setCurrentLineIndex(0);
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error", e);
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
  };

  useEffect(() => {
    if (isPlaying && podcastData?.dialogue) {
      speakCurrentLine(currentLineIndex);
    }
  }, [currentLineIndex, isPlaying, playbackSpeed, isMuted]);

  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    } else {
      stopPlayback();
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const jumpToLine = (index) => {
    setCurrentLineIndex(index);
    if (!isPlaying) setIsPlaying(true);
  };

  const skipNext = () => {
    if (podcastData?.dialogue && currentLineIndex + 1 < podcastData.dialogue.length) {
      setCurrentLineIndex(prev => prev + 1);
    }
  };

  const skipPrev = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(prev => prev - 1);
    }
  };

  const handleCopyScript = () => {
    if (!podcastData) return;
    let full = `[LUMIXORA AUDIO OVERVIEW - ${podcastData.episodeTitle}]\n`;
    full += `Subject: ${podcastData.subject} | Duration: ${podcastData.durationEstimate}\n\n`;
    podcastData.dialogue.forEach(d => {
      full += `${d.speaker.toUpperCase()}: ${d.text}\n\n`;
    });
    navigator.clipboard.writeText(full);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  if (!isOpen) return null;

  const currentSpeaker = podcastData?.dialogue?.[currentLineIndex]?.speaker || 'Maya';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-4xl bg-[#090d16] border border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-[#0d1322] to-indigo-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 border border-white/20">
              <Headphones className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono tracking-wider uppercase font-bold border border-cyan-500/30">
                  NOTEBOOKLM-STYLE AUDIO RECAP
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">&bull; Dual-Host AI Podcast</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate max-w-md">
                {podcastData?.episodeTitle || `Deep Dive: ${topic}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyScript}
              disabled={!podcastData}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5 cursor-pointer border border-white/5"
              title="Copy Full Podcast Script"
            >
              {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline font-mono text-[11px]">{copiedScript ? 'Copied' : 'Script'}</span>
            </button>
            <button 
              onClick={() => { stopPlayback(); onClose(); }}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Topic Switcher Bar */}
        <div className="px-5 py-3 bg-[#060911] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <form onSubmit={handleCustomSubmit} className="flex-1 flex items-center gap-2 min-w-[280px]">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter any unit, chapter, or topic to recap (e.g. Dynamic Programming, Normalization, TCP 3-Way Handshake)..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer shrink-0"
            >
              {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
              <span>Generate Audio</span>
            </button>
          </form>

          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono shrink-0">
            <span>Duration: <strong class="text-white">{podcastData?.durationEstimate || '3 Mins'}</strong></span>
            <span>&bull;</span>
            <span>Subject: <strong class="text-cyan-400">{subject}</strong></span>
          </div>
        </div>

        {/* Modal Center Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
          
          {/* Left Column: Visual Host Cockpit & Waveform (5 Cols) */}
          <div className="md:col-span-5 p-6 flex flex-col justify-between bg-gradient-to-b from-[#090d16] to-[#04060a]">
            
            {/* Dual Hosts Display */}
            <div className="space-y-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Active Studio Hosts</div>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Host 1: Dr. Maya */}
                <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                  currentSpeaker === 'Maya' && isPlaying 
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] scale-[1.02]' 
                    : 'bg-white/5 border-white/10 opacity-75'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        👩‍🏫
                      </div>
                      {currentSpeaker === 'Maya' && isPlaying && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping"></span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Dr. Maya</div>
                      <div className="text-[10px] text-cyan-300 font-mono">The Professor</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                    Focuses on architectural foundations, system principles, and academic theory.
                  </p>
                </div>

                {/* Host 2: Alex */}
                <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                  currentSpeaker === 'Alex' && isPlaying 
                    ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] scale-[1.02]' 
                    : 'bg-white/5 border-white/10 opacity-75'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        👨‍💻
                      </div>
                      {currentSpeaker === 'Alex' && isPlaying && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping"></span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Alex</div>
                      <div className="text-[10px] text-emerald-300 font-mono">Tech Scholar</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                    Asks practical questions, targets 10-mark exam pitfalls, and real-world SDE uses.
                  </p>
                </div>
              </div>

              {/* Takeaway Highlights */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-3">
                <div className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  Key Episode Takeaways
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {(podcastData?.takeaways || [
                    'Clear distinction between theory & practical exam traps',
                    'High-yield memory tricks for viva & interviews',
                    'Standard autonomous university marking rubric'
                  ]).map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">&bull;</span>
                      <span className="text-slate-300 text-[11px] leading-tight">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Audio Waveform Canvas */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>SPEECH FREQUENCY RADAR</span>
                <span className={isPlaying ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {isPlaying ? '● BROADCASTING' : 'IDLE'}
                </span>
              </div>
              <canvas ref={canvasRef} width={380} height={50} className="w-full h-12 bg-black/40 rounded-xl border border-white/5"></canvas>
            </div>

          </div>

          {/* Right Column: Live Scrolling Transcript (7 Cols) */}
          <div className="md:col-span-7 flex flex-col justify-between bg-[#070a12] p-6 overflow-hidden">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-xs font-mono text-slate-400">
              <span>LIVE CONVERSATIONAL SCRIPT</span>
              <span>CLICK ANY LINE TO JUMP</span>
            </div>

            {/* Dialogue Stream */}
            <div ref={transcriptContainerRef} className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar max-h-[380px]">
              {isGenerating ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-3 text-center">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <div className="text-sm font-bold text-white">Synthesizing Audio Deep Dive...</div>
                  <div className="text-xs text-slate-400 max-w-sm">
                    NotebookLM AI engine is crafting dual-host dialogue, analyzing syllabus nuances, and generating voice tracks.
                  </div>
                </div>
              ) : (
                podcastData?.dialogue?.map((item, idx) => {
                  const isCurrent = idx === currentLineIndex;
                  const isMaya = item.speaker === 'Maya';
                  
                  return (
                    <div
                      key={idx}
                      data-line={idx}
                      onClick={() => jumpToLine(idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? isMaya
                            ? 'bg-cyan-950/50 border-cyan-400 shadow-md scale-[1.01]'
                            : 'bg-emerald-950/50 border-emerald-400 shadow-md scale-[1.01]'
                          : 'bg-white/5 border-white/5 hover:border-white/20 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                            isMaya ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {isMaya ? 'DR. MAYA' : 'ALEX'}
                          </span>
                          {isCurrent && isPlaying && (
                            <span className="text-[10px] font-mono text-cyan-400 animate-pulse font-bold flex items-center gap-1">
                              <Volume2 className="w-3 h-3" /> Speaking...
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isCurrent ? 'text-white font-medium' : 'text-slate-300'}`}>
                        {item.text}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Audio Transport Player Bar */}
            <div className="mt-4 pt-4 border-t border-white/10 bg-[#090d16] p-3 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between">
                
                {/* Left: Speed & Mute */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                  </button>

                  <div className="flex items-center bg-white/5 rounded-xl p-0.5 border border-white/5 text-[10px] font-mono">
                    {[0.75, 1.0, 1.25, 1.5].map(speed => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                          playbackSpeed === speed ? 'bg-cyan-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Center: Transport Play/Pause/Skip */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={skipPrev}
                    disabled={currentLineIndex === 0}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                    title="Previous Dialogue"
                  >
                    <Rewind className="w-4 h-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    disabled={isGenerating || !podcastData}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black flex items-center justify-center font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer scale-100 active:scale-95"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 text-black fill-current" /> : <Play className="w-5 h-5 text-black fill-current ml-0.5" />}
                  </button>

                  <button 
                    onClick={skipNext}
                    disabled={!podcastData || currentLineIndex >= podcastData.dialogue.length - 1}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                    title="Next Dialogue"
                  >
                    <FastForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: Progress Indicator */}
                <div className="text-right text-[11px] font-mono text-slate-400">
                  <span className="text-white font-bold">{currentLineIndex + 1}</span> / {podcastData?.dialogue?.length || 0}
                  <div className="text-[10px] text-slate-500">EXCHANGES</div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
