import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Eraser, Square, Type, RotateCcw, RotateCw, Trash2, Download, Sparkles, Check } from 'lucide-react';

export default function InteractiveWhiteboard({ 
  lessonType = 'math', // 'math' | 'music' | 'dance' | 'code' | 'art' | 'career'
  activePointingTarget = 'roots', // 'title' | 'standard' | 'roots' | 'graph' | 'conditions'
  onToolSelect
}) {
  const [activeTool, setActiveTool] = useState('pen'); // 'pen' | 'eraser' | 'rect' | 'text'
  const [penColor, setPenColor] = useState('#c084fc');
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  // Interactive Parabola Coefficients for live quadratic manipulation
  const [coeffA, setCoeffA] = useState(1);
  const [coeffB, setCoeffB] = useState(0);
  const [coeffC, setCoeffC] = useState(-4);

  // Compute Roots dynamically: (-b +- sqrt(b^2 - 4ac)) / (2a)
  const discriminant = coeffB * coeffB - 4 * coeffA * coeffC;
  const root1 = discriminant >= 0 ? ((-coeffB + Math.sqrt(discriminant)) / (2 * coeffA)).toFixed(1) : null;
  const root2 = discriminant >= 0 ? ((-coeffB - Math.sqrt(discriminant)) / (2 * coeffA)).toFixed(1) : null;

  // Handle Freehand Canvas Drawing on Whiteboard
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setLines(prev => [...prev, [{ x, y, color: activeTool === 'eraser' ? 'eraser' : penColor }]]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setLines(prev => {
      const lastLine = prev[prev.length - 1];
      if (!lastLine) return prev;
      return [...prev.slice(0, -1), [...lastLine, { x, y, color: activeTool === 'eraser' ? 'eraser' : penColor }]];
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Render Freehand Drawings to Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lines.forEach(line => {
      if (line.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(line[0].x, line[0].y);
      for (let i = 1; i < line.length; i++) {
        ctx.lineTo(line[i].x, line[i].y);
      }
      if (line[0].color === 'eraser') {
        ctx.strokeStyle = '#0e0826';
        ctx.lineWidth = 14;
      } else {
        ctx.strokeStyle = line[0].color || '#c084fc';
        ctx.lineWidth = 3;
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
  }, [lines]);

  return (
    <div className="relative w-full h-full rounded-[28px] bg-[#120a2e]/85 backdrop-blur-xl border border-purple-400/40 shadow-[0_0_50px_rgba(168,85,247,0.35)] p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none">
      
      {/* ─── 1. TOP WHITEBOARD TOOLBAR (Exact Match to Reference Image) ─── */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-400/20">
        
        {/* Lesson Badge */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase text-purple-200">
            Lumina Whiteboard · {lessonType.toUpperCase()}
          </span>
        </div>

        {/* Whiteboard Action Icons (Pen, Eraser, Rect, Text, Undo, Redo, Clear) */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-purple-400/30 backdrop-blur-md">
          <button
            onClick={() => setActiveTool('pen')}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              activeTool === 'pen' ? 'bg-purple-600 text-white shadow-md shadow-purple-500/40' : 'text-gray-400 hover:text-white'
            }`}
            title="Marker Pen"
          >
            <PenTool className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('eraser')}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              activeTool === 'eraser' ? 'bg-purple-600 text-white shadow-md shadow-purple-500/40' : 'text-gray-400 hover:text-white'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('rect')}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              activeTool === 'rect' ? 'bg-purple-600 text-white shadow-md shadow-purple-500/40' : 'text-gray-400 hover:text-white'
            }`}
            title="Shape"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('text')}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              activeTool === 'text' ? 'bg-purple-600 text-white shadow-md shadow-purple-500/40' : 'text-gray-400 hover:text-white'
            }`}
            title="Text Tool"
          >
            <Type className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-white/20 mx-0.5" />
          <button
            onClick={() => setLines(prev => prev.slice(0, -1))}
            disabled={lines.length === 0}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLines([])}
            className="p-1.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 cursor-pointer"
            title="Clear Board"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ─── 2. WHITEBOARD LESSON BODY (Dynamic Math / Music / Dance Content) ─── */}
      <div className="relative flex-1 py-4 flex flex-col justify-between">
        
        {/* Interactive Drawing Layer Overlay */}
        <canvas
          ref={canvasRef}
          width={760}
          height={400}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="absolute inset-0 w-full h-full z-20 cursor-crosshair pointer-events-auto"
        />

        {/* ── LESSON: QUADRATIC EQUATIONS (Matching Reference Image) ── */}
        {lessonType === 'math' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full relative z-10 pointer-events-none">
            
            {/* Left Column: Equation, Conditions & Roots */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-3">
              
              {/* Title: 'Quadratic Equation' */}
              <div>
                <h3 className={`text-2xl sm:text-3xl font-serif italic text-purple-200 tracking-wide transition-all ${
                  activePointingTarget === 'title' ? 'text-purple-300 drop-shadow-[0_0_12px_rgba(192,132,252,0.9)] scale-105 origin-left' : ''
                }`}>
                  Quadratic Equation
                </h3>
              </div>

              {/* Standard Form Box: ax^2 + bx + c = 0 */}
              <div className={`w-fit px-5 py-2.5 rounded-2xl bg-black/40 border border-purple-400/40 text-center shadow-lg transition-all ${
                activePointingTarget === 'standard' ? 'ring-2 ring-purple-400 shadow-[0_0_25px_rgba(192,132,252,0.6)] scale-105' : ''
              }`}>
                <span className="font-mono text-xl sm:text-2xl text-white font-bold tracking-wider">
                  {coeffA !== 1 ? coeffA : ''}x² {coeffB >= 0 ? `+ ${coeffB}x` : `- ${Math.abs(coeffB)}x`} {coeffC >= 0 ? `+ ${coeffC}` : `- ${Math.abs(coeffC)}`} = 0
                </span>
              </div>

              {/* Conditions List */}
              <div className={`space-y-1 text-xs sm:text-sm text-gray-200 font-mono transition-all ${
                activePointingTarget === 'conditions' ? 'text-purple-300' : ''
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>a ≠ 0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>b, c are constants</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Degree = 2</span>
                </div>
              </div>

              {/* Roots Formula Box: x = (-b +- sqrt(b^2 - 4ac)) / (2a) */}
              <div className={`p-3.5 rounded-2xl bg-black/50 border border-purple-400/50 shadow-md transition-all ${
                activePointingTarget === 'roots' ? 'ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(56,189,248,0.7)] scale-102' : ''
              }`}>
                <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Quadratic Roots Formula</span>
                  {discriminant >= 0 ? (
                    <span className="text-emerald-400 font-mono">Roots: {root1}, {root2}</span>
                  ) : (
                    <span className="text-rose-400 font-mono">Complex Conjugates</span>
                  )}
                </div>
                
                <div className="font-mono text-lg sm:text-xl text-white text-center py-1 font-bold">
                  x = <span className="inline-block px-1 border-b border-white">−b ± √(b² − 4ac)</span>
                  <span className="block text-sm text-gray-300">2a</span>
                </div>
              </div>

            </div>

            {/* Right Column: Dynamic SVG Parabola Graph & Coordinate Plane */}
            <div className={`md:col-span-5 flex flex-col items-center justify-center p-2 rounded-2xl bg-black/30 border border-purple-400/30 transition-all ${
              activePointingTarget === 'graph' ? 'ring-2 ring-purple-400 shadow-[0_0_30px_rgba(192,132,252,0.5)]' : ''
            }`}>
              
              <svg viewBox="-80 -80 160 160" className="w-full max-w-[220px] max-h-[200px] overflow-visible">
                {/* Axes */}
                <line x1="-70" y1="0" x2="70" y2="0" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="0" y1="-70" x2="0" y2="70" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                
                {/* Axis Labels */}
                <text x="72" y="4" fill="#94a3b8" fontSize="9" fontFamily="monospace">x</text>
                <text x="3" y="-68" fill="#94a3b8" fontSize="9" fontFamily="monospace">y</text>

                {/* Parabola Curve: y = a*x^2 + b*x + c */}
                <path
                  d={`M -60 ${-(coeffA * (-3.5) * (-3.5) + coeffB * (-3.5) + coeffC) * 8} Q 0 ${-coeffC * 8} 60 ${-(coeffA * (3.5) * (3.5) + coeffB * (3.5) + coeffC) * 8}`}
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="3"
                  className="drop-shadow-[0_0_10px_rgba(192,132,252,0.9)]"
                />

                {/* Roots Indicators */}
                {discriminant >= 0 && (
                  <>
                    <circle cx={root1 * 14} cy="0" r="4.5" fill="#38bdf8" className="animate-pulse" />
                    <circle cx={root2 * 14} cy="0" r="4.5" fill="#38bdf8" className="animate-pulse" />
                  </>
                )}
              </svg>

              {/* Interactive Curve Controls for Student */}
              <div className="w-full pt-2 flex items-center justify-between text-[10px] font-mono text-purple-300 pointer-events-auto">
                <label className="flex items-center gap-1">
                  <span>a:</span>
                  <input 
                    type="range" min="0.5" max="2" step="0.5" value={coeffA} 
                    onChange={e => setCoeffA(parseFloat(e.target.value))}
                    className="w-12 h-1 accent-purple-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center gap-1">
                  <span>c:</span>
                  <input 
                    type="range" min="-6" max="2" step="1" value={coeffC} 
                    onChange={e => setCoeffC(parseFloat(e.target.value))}
                    className="w-12 h-1 accent-cyan-400 cursor-pointer"
                  />
                </label>
              </div>

            </div>

          </div>
        )}

        {/* ── LESSON: MUSIC & VOCAL HARMONICS ── */}
        {lessonType === 'music' && (
          <div className="space-y-4 h-full relative z-10 pointer-events-none">
            <h3 className="text-2xl font-serif italic text-purple-200">
              Vocal Physiology & Indian / Western Harmony
            </h3>
            
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-purple-400/30">
                <span className="text-purple-300 font-bold block mb-1">Raga Yaman (Kalyan Thaat)</span>
                <span className="text-white text-base">S · R · G · Ḿ · P · D · N · Ṡ</span>
                <p className="text-[10px] text-gray-400 mt-1">Teevra Madhyam (Ḿ) creates ethereal emotional depth.</p>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-purple-400/30">
                <span className="text-cyan-300 font-bold block mb-1">Jazz Cadence: ii - V - I</span>
                <span className="text-white text-base">Dm7 → G7 → Cmaj7</span>
                <p className="text-[10px] text-gray-400 mt-1">Smooth voice leading with 3rd and 7th guide tones.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs">
              <span className="font-bold text-purple-200">Lumina Vocal Tip:</span>
              <p className="text-gray-300 mt-0.5">Place your vocal timbre into the 'mask' of your face (paranasal sinuses) while supporting from the diaphragm for fatigue-free projection.</p>
            </div>
          </div>
        )}

        {/* ── LESSON: DANCE & 8-COUNT CHOREOGRAPHY ── */}
        {lessonType === 'dance' && (
          <div className="space-y-3 h-full relative z-10 pointer-events-none">
            <h3 className="text-2xl font-serif italic text-purple-200">
              8-Count Urban & Classical Movement Anatomy
            </h3>
            
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 font-mono text-center">
              {[
                { beat: 1, action: 'Chest Pop' },
                { beat: 2, action: 'Isolation' },
                { beat: 3, action: 'Weight Shift' },
                { beat: 4, action: 'Snap' },
                { beat: 5, action: 'Body Roll' },
                { beat: 6, action: 'Drop' },
                { beat: 7, action: 'Turn' },
                { beat: 8, action: 'Freeze' }
              ].map(b => (
                <div key={b.beat} className="p-2.5 rounded-xl bg-black/50 border border-purple-400/40">
                  <div className="text-lg font-black text-purple-300">{b.beat}</div>
                  <div className="text-[10px] text-gray-300 mt-0.5">{b.action}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs">
              <span className="font-bold text-purple-200">Choreography Principle:</span>
              <p className="text-gray-300 mt-0.5">Every movement originates from core engagement. Breath-accent on the &apos;and&apos; (&amp;) beats prepares the explosive hit on 1 and 5.</p>
            </div>
          </div>
        )}

      </div>

      {/* ─── 3. WHITEBOARD BOTTOM FOOTER (Live Teaching Synchronizer) ─── */}
      <div className="pt-2 border-t border-purple-400/20 flex items-center justify-between text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Lumina is tracking lesson context with student gesture recognition</span>
        </span>
        <span className="font-mono text-purple-300 font-semibold">Interactive Board v2.5</span>
      </div>

    </div>
  );
}
