import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Eraser, RotateCcw, Trash2, Sliders, Check, Sparkles } from 'lucide-react';

export default function ClassroomBoard({ activePointingTarget = 'roots' }) {
  const [activeTool, setActiveTool] = useState('chalk');
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  // Dynamic Parabola Parameters
  const [coeffA, setCoeffA] = useState(1);
  const [coeffB, setCoeffB] = useState(0);
  const [coeffC, setCoeffC] = useState(-4);

  const discriminant = coeffB * coeffB - 4 * coeffA * coeffC;
  const root1 = discriminant >= 0 ? ((-coeffB + Math.sqrt(discriminant)) / (2 * coeffA)).toFixed(1) : null;
  const root2 = discriminant >= 0 ? ((-coeffB - Math.sqrt(discriminant)) / (2 * coeffA)).toFixed(1) : null;

  // Freehand Chalk Canvas
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setLines(prev => [...prev, [{ x, y, color: activeTool === 'eraser' ? 'eraser' : '#f1f5f9' }]]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setLines(prev => {
      const last = prev[prev.length - 1];
      if (!last) return prev;
      return [...prev.slice(0, -1), [...last, { x, y, color: activeTool === 'eraser' ? 'eraser' : '#f1f5f9' }]];
    });
  };

  const handleMouseUp = () => setIsDrawing(false);

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
        ctx.strokeStyle = '#1b382b'; // Blackboard chalk eraser color
        ctx.lineWidth = 20;
      } else {
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.5;
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
  }, [lines]);

  return (
    <div className="relative w-full h-full rounded-2xl bg-[#1a382a]/95 border-4 border-[#785434] shadow-[inset_0_0_80px_rgba(0,0,0,0.65),0_15px_35px_rgba(0,0,0,0.5)] p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none">
      
      {/* ─── CHALKBOARD HEADER & TOOLS ─── */}
      <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 z-30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-200 font-bold">
            Mathematics · Quadratic Equation
          </span>
        </div>

        {/* Chalk & Eraser Tools */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-emerald-600/30 backdrop-blur-md">
          <button
            onClick={() => setActiveTool('chalk')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              activeTool === 'chalk' ? 'bg-emerald-700 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
            title="White Chalk"
          >
            <PenTool className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTool('eraser')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              activeTool === 'eraser' ? 'bg-emerald-700 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
            title="Chalk Eraser"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setLines([])}
            className="p-1.5 rounded-lg text-rose-300 hover:bg-rose-900/30 cursor-pointer"
            title="Clean Blackboard"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── CHALK DRAWING LAYER ─── */}
      <canvas
        ref={canvasRef}
        width={760}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="absolute inset-0 w-full h-full z-20 cursor-crosshair pointer-events-auto"
      />

      {/* ─── STRUCTURED LESSON CONTENT ─── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 h-full py-2 pointer-events-none">
        
        {/* Left Column: Equations, Conditions & Formula */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-2.5">
          
          <div>
            <h3 className="text-2xl sm:text-3xl font-serif italic text-white/95 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Quadratic Equation
            </h3>
          </div>

          {/* Standard Form: ax^2 + bx + c = 0 */}
          <div className="w-fit px-4 py-2 rounded-xl bg-black/35 border border-white/20 text-white font-mono text-xl sm:text-2xl font-bold tracking-wide shadow">
            {coeffA !== 1 ? coeffA : ''}x² {coeffB >= 0 ? `+ ${coeffB}x` : `- ${Math.abs(coeffB)}x`} {coeffC >= 0 ? `+ ${coeffC}` : `- ${Math.abs(coeffC)}`} = 0
          </div>

          {/* Conditions */}
          <div className="space-y-1 text-xs sm:text-sm text-emerald-100 font-mono">
            <div>• a ≠ 0</div>
            <div>• b, c are constants</div>
            <div>• Degree = 2</div>
          </div>

          {/* Roots Formula Box */}
          <div className="p-3 rounded-xl bg-black/45 border border-white/25 shadow-md">
            <div className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider mb-1 flex items-center justify-between">
              <span>Roots Formula</span>
              <span className="text-white font-mono">
                {discriminant >= 0 ? `x = { ${root1}, ${root2} }` : 'Complex Conjugates'}
              </span>
            </div>
            <div className="font-mono text-lg sm:text-xl text-white text-center py-1 font-bold">
              x = <span className="inline-block px-1 border-b border-white">−b ± √(b² − 4ac)</span>
              <span className="block text-xs text-emerald-200">2a</span>
            </div>
          </div>

        </div>

        {/* Right Column: Chalk Parabola Graph */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-2 rounded-xl bg-black/25 border border-white/15">
          
          <svg viewBox="-80 -80 160 160" className="w-full max-w-[200px] max-h-[180px] overflow-visible">
            {/* Axes */}
            <line x1="-70" y1="0" x2="70" y2="0" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="0" y1="-70" x2="0" y2="70" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="72" y="4" fill="#cbd5e1" fontSize="9" fontFamily="monospace">x</text>
            <text x="3" y="-68" fill="#cbd5e1" fontSize="9" fontFamily="monospace">y</text>

            {/* Parabola: y = a*x^2 + b*x + c */}
            <path
              d={`M -60 ${-(coeffA * (-3.5) * (-3.5) + coeffB * (-3.5) + coeffC) * 8} Q 0 ${-coeffC * 8} 60 ${-(coeffA * (3.5) * (3.5) + coeffB * (3.5) + coeffC) * 8}`}
              fill="none"
              stroke="#f8fafc"
              strokeWidth="2.5"
              className="drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
            />

            {/* Roots Points */}
            {discriminant >= 0 && (
              <>
                <circle cx={root1 * 14} cy="0" r="4" fill="#38bdf8" />
                <circle cx={root2 * 14} cy="0" r="4" fill="#38bdf8" />
              </>
            )}
          </svg>

          {/* Interactive Parabola Sliders */}
          <div className="w-full pt-1.5 flex items-center justify-between text-[10px] font-mono text-emerald-200 pointer-events-auto">
            <label className="flex items-center gap-1">
              <span>a:</span>
              <input 
                type="range" min="0.5" max="2" step="0.5" value={coeffA} 
                onChange={e => setCoeffA(parseFloat(e.target.value))}
                className="w-12 h-1 accent-emerald-400 cursor-pointer"
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

      {/* ─── WOODEN CHALK TRAY AT BOTTOM ─── */}
      <div className="pt-2 border-t-2 border-[#5c3e23] flex items-center justify-between text-[11px] text-emerald-300 font-mono z-30">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>Interactive Chalkboard Canvas · Real-time Math Geometry</span>
        </span>
        <span>Lumina Class Studio</span>
      </div>

    </div>
  );
}
