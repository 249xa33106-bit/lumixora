import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Download, X, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw,
  Sun, Moon, Coffee, Sparkles, Volume2, VolumeX, Eye, BookOpen, 
  ChevronRight, ExternalLink, BrainCircuit, Lightbulb, CheckSquare, Copy, Check
} from 'lucide-react';
import { playSynthesizedNarration } from '../utils/teluguAudioEngine';

export default function AdvancedDocumentViewerModal({
  isOpen,
  onClose,
  viewingUrl,
  viewingType = 'pdf',
  title = 'Academic Document',
  subject = null,
  user = null
}) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [theme, setTheme] = useState('dark'); // 'dark' (OLED) | 'sepia' (Paper) | 'light'
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const containerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullScreen, onClose]);

  // Handle Fullscreen
  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullScreen(false);
    }
  };

  // Audio Read Aloud
  const handleToggleVoice = () => {
    if (isSpeaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToRead = `Now opening ${title} for ${subject?.name || 'Academic Studies'}. Key concepts: Core theories, analytical problem solving, and semester examination patterns.`;
      const audio = playSynthesizedNarration({
        text: textToRead,
        lang: 'bilingual',
        speed: 1.0,
        onEnded: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
      audioRef.current = audio;
    }
  };

  const handleCopySummary = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  if (!isOpen || !viewingUrl) return null;

  // Ultra-crisp theme definitions with maximum contrast
  const themeClasses = {
    dark: 'bg-[#060810] text-white border-white/15',
    sepia: 'bg-[#f6ebd1] text-[#291b0d] border-[#dfc699]',
    light: 'bg-white text-gray-950 border-gray-300'
  };

  const viewerBgClasses = {
    dark: 'bg-[#020205]',
    sepia: 'bg-[#edd9af]',
    light: 'bg-gray-200'
  };

  const topNavBg = {
    dark: 'bg-[#0b0f1d] border-b border-white/10 text-white',
    sepia: 'bg-[#faefe0] border-b border-[#dfc699] text-[#291b0d] shadow-xs',
    light: 'bg-white border-b border-gray-200 text-gray-900 shadow-xs'
  };

  const controlGroupBg = {
    dark: 'bg-white/10 border border-white/15 text-white',
    sepia: 'bg-white/80 border border-[#c4ab7e] text-[#291b0d] shadow-xs',
    light: 'bg-gray-100 border border-gray-300 text-gray-900 shadow-xs'
  };

  const controlBtnHover = {
    dark: 'hover:bg-white/20 text-gray-200 hover:text-white',
    sepia: 'hover:bg-[#dfc699]/60 text-[#422d17] hover:text-[#1e1308]',
    light: 'hover:bg-gray-200 text-gray-700 hover:text-gray-950'
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 select-none animate-fade-in font-sans"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div 
        ref={containerRef}
        className={`relative w-full h-full max-w-7xl rounded-2xl overflow-hidden flex flex-col shadow-2xl border transition-colors duration-300 ${themeClasses[theme]}`}
      >
        {/* Top Control Navigation Bar - High Contrast & Clearly Visible */}
        <div className={`px-4 py-3 flex flex-wrap items-center justify-between gap-3 ${topNavBg[theme]}`}>
          
          {/* Document Title & Badge */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-extrabold truncate flex items-center gap-2 tracking-normal font-sans">
                <span className={theme === 'sepia' ? 'text-[#291b0d]' : theme === 'light' ? 'text-gray-950' : 'text-white'}>
                  {title}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-cyan-600/15 text-cyan-700 border border-cyan-600/30 font-bold'}`}>
                  {viewingType.toUpperCase()}
                </span>
              </h3>
              <p className={`text-xs truncate font-medium font-sans mt-0.5 ${theme === 'sepia' ? 'text-[#6b5033]' : theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                {subject?.name || 'Lumixora Academic Resource'} • Verified Official Material
              </p>
            </div>
          </div>

          {/* Action & Reader Controls - Maximum Contrast */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Zoom Controls */}
            <div className={`flex items-center rounded-xl p-1 ${controlGroupBg[theme]}`}>
              <button 
                onClick={() => setZoomLevel(prev => Math.max(50, prev - 15))}
                title="Zoom Out"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${controlBtnHover[theme]}`}
              >
                <ZoomOut className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className={`text-xs font-mono px-2.5 font-bold min-w-[50px] text-center ${theme === 'dark' ? 'text-cyan-300' : theme === 'sepia' ? 'text-[#291b0d]' : 'text-gray-900'}`}>
                {zoomLevel}%
              </span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(200, prev + 15))}
                title="Zoom In"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${controlBtnHover[theme]}`}
              >
                <ZoomIn className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button 
                onClick={() => setZoomLevel(100)}
                title="Reset Zoom (100%)"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${controlBtnHover[theme]}`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reading Themes Segmented Switcher */}
            <div className={`flex items-center rounded-xl p-1 ${controlGroupBg[theme]}`}>
              <button 
                onClick={() => setTheme('dark')} 
                title="OLED Dark Mode"
                className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  theme === 'dark' 
                    ? 'bg-cyan-500 text-black font-black shadow-sm' 
                    : controlBtnHover[theme]
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-[11px] font-bold hidden sm:inline">Dark</span>
              </button>
              <button 
                onClick={() => setTheme('sepia')} 
                title="Warm Sepia Mode"
                className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  theme === 'sepia' 
                    ? 'bg-[#8c531b] text-white font-black shadow-sm' 
                    : controlBtnHover[theme]
                }`}
              >
                <Coffee className="w-4 h-4" />
                <span className="text-[11px] font-bold hidden sm:inline">Sepia</span>
              </button>
              <button 
                onClick={() => setTheme('light')} 
                title="Crisp Light Mode"
                className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  theme === 'light' 
                    ? 'bg-blue-600 text-white font-black shadow-sm' 
                    : controlBtnHover[theme]
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="text-[11px] font-bold hidden sm:inline">Light</span>
              </button>
            </div>

            {/* Read Aloud Button */}
            <button 
              onClick={handleToggleVoice}
              title={isSpeaking ? "Pause Narration" : "Read Aloud with Audio Engine"}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                isSpeaking 
                  ? 'bg-red-500 text-white animate-pulse border border-red-600' 
                  : theme === 'sepia' 
                    ? 'bg-[#6b3ba7] hover:bg-[#5b2f91] text-white border border-[#4b2478]' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/30'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 stroke-[2.5]" /> : <Volume2 className="w-4 h-4 stroke-[2.5]" />}
              <span className="font-semibold">{isSpeaking ? 'Stop Audio' : 'Read Aloud'}</span>
            </button>

            {/* AI Key Insights Toggle */}
            <button 
              onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
              title="Toggle AI Key Insights & Formulas"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                isAiPanelOpen 
                  ? 'bg-cyan-400 text-gray-950 font-black shadow-cyan-500/20' 
                  : theme === 'sepia'
                    ? 'bg-[#0f6f78] hover:bg-[#0a575e] text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/30'
              }`}
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span className="font-semibold">AI Study Guide</span>
            </button>

            {/* Direct Download */}
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = viewingUrl;
                link.target = '_blank';
                link.download = `${title || 'notes'}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              title="Download Original Document"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                theme === 'sepia'
                  ? 'bg-[#291b0d] hover:bg-[#1a1107] text-[#faefe0]'
                  : theme === 'light'
                    ? 'bg-gray-900 hover:bg-black text-white'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
              }`}
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span className="font-semibold">Download</span>
            </button>

            {/* Fullscreen Toggle */}
            <button 
              onClick={toggleFullScreen}
              title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                theme === 'dark' 
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/15' 
                  : theme === 'sepia'
                    ? 'bg-white/80 hover:bg-white text-[#291b0d] border-[#c4ab7e]'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
              }`}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4 stroke-[2.5]" /> : <Maximize2 className="w-4 h-4 stroke-[2.5]" />}
            </button>

            {/* Close Modal Button */}
            <button 
              onClick={onClose}
              title="Close Preview (Esc)"
              className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all cursor-pointer shadow-sm border border-red-400/40"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

          </div>
        </div>

        {/* Content Viewport with Optional Split-Screen AI Study Panel */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Main Viewer Area */}
          <div className={`flex-1 relative overflow-auto flex items-center justify-center p-2 sm:p-4 ${viewerBgClasses[theme]}`}>
            
            {/* Security Watermark Protection Grid */}
            <div className="absolute inset-0 z-20 pointer-events-none grid grid-cols-3 grid-rows-5 opacity-[0.16] overflow-hidden select-none">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-center text-xs sm:text-sm font-black text-slate-400 tracking-widest uppercase rotate-[-25deg] select-none whitespace-nowrap"
                >
                  {user?.email || 'Lumixora Scholar'} • ID: {user?.id?.substring(0, 8) || 'LMX-SECURE'}
                </div>
              ))}
            </div>

            {/* Document Frame with Smooth Scaled Zoom */}
            <div 
              className="w-full h-full flex items-center justify-center transition-transform duration-200 origin-top"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {viewingType === 'image' ? (
                <img 
                  src={viewingUrl} 
                  alt={title} 
                  className="max-w-full max-h-[80vh] object-contain z-10 rounded-xl shadow-2xl" 
                  draggable="false"
                />
              ) : (
                <iframe 
                  src={viewingUrl}
                  className="w-full h-full border-none z-10 rounded-xl shadow-2xl bg-white"
                  title={title}
                  allow="autoplay"
                />
              )}
            </div>
          </div>

          {/* Collapsible AI Study Guide Sidebar */}
          {isAiPanelOpen && (
            <div className={`w-80 sm:w-96 border-l flex flex-col z-30 transition-all duration-300 font-sans ${theme === 'dark' ? 'bg-[#0b0f1a] border-white/10 text-white' : theme === 'sepia' ? 'bg-[#f7ebce] border-[#dfc99a] text-[#291b0d]' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
                  <h4 className="text-xs font-black uppercase tracking-wider">AI Study Insights</h4>
                </div>
                <button 
                  onClick={() => setIsAiPanelOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
                
                {/* Executive Quick Review */}
                <div className={`p-3.5 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold flex items-center gap-1.5 text-cyan-400">
                      <Lightbulb className="w-3.5 h-3.5" /> Quick Summary
                    </span>
                    <button 
                      onClick={() => handleCopySummary(`Executive summary for ${title}:\n1. Core theorems & equations\n2. Key algorithmic complexities\n3. High-weightage exam topics`)}
                      className="text-[10px] opacity-70 hover:opacity-100 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedKey ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="leading-relaxed opacity-90 font-medium">
                    This document covers fundamental problem-solving blueprints, step-by-step derivations, and high-frequency university exam questions for <strong>{subject?.name || 'this module'}</strong>.
                  </p>
                </div>

                {/* Key Takeaways & Exam Hotspots */}
                <div className="space-y-2">
                  <span className="font-black text-[11px] tracking-wider uppercase opacity-80 block">
                    High-Priority Exam Hotspots:
                  </span>
                  {[
                    "Definition & Mathematical Invariants",
                    "Step-by-step Derivation & Worst-Case Complexity",
                    "Real-World Engineering Case Studies",
                    "Common Examination Traps & Edge Cases"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-black/20 border border-white/5 font-medium">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Academic Practice Prompt */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-black border border-purple-500/30 space-y-2">
                  <span className="font-black text-purple-300 text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Self-Check Challenge
                  </span>
                  <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                    Test your understanding by explaining the first theorem in this document without looking back!
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer Status Bar - Bold & Ultra Legible */}
        <div className={`px-4 py-2 border-t flex flex-wrap items-center justify-between text-xs font-mono gap-2 ${theme === 'dark' ? 'bg-[#0b0f1d] border-white/10 text-gray-300' : theme === 'sepia' ? 'bg-[#faefe0] border-[#dfc699] text-[#291b0d] font-semibold' : 'bg-gray-100 border-gray-300 text-gray-800 font-semibold'}`}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Digital Rights Protected • Authorized to <strong className="text-cyan-400 font-bold">{user?.email || 'Scholar'}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span>Shortcut: <strong className="px-1.5 py-0.5 rounded bg-black/20 border border-white/10 font-bold">Esc</strong> to close</span>
            <span>•</span>
            <span>Zoom: <strong className="text-cyan-400">{zoomLevel}%</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
}
