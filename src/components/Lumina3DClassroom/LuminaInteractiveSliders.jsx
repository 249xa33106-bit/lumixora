import React, { useState } from 'react';
import { Sliders, RefreshCw, X, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * 🎛️ Lumina Interactive Quadratic & Parametric Coefficient Sliders (a, b, c)
 * 
 * Allows students to drag sliders for coefficients a, b, and c in real time:
 * - Dynamically re-plots the parabola on the 3D chalkboard
 * - Recalculates discriminant Δ = b² - 4ac and roots in real time
 * - Lumina gestures toward the shifting curve
 */
export default function LuminaInteractiveSliders({
  params = { a: 1.0, b: -2.0, c: -3.0 },
  onChange,
  onClose
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { a, b, c } = params;

  // Discriminant and roots calculation
  const delta = b * b - 4 * a * c;
  const vertexX = -b / (2 * (a || 0.001));
  const vertexY = a * vertexX * vertexX + b * vertexX + c;

  const handleSliderChange = (key, val) => {
    let numVal = parseFloat(val);
    if (key === 'a' && numVal === 0) {
      numVal = 0.1; // Prevent a = 0 in quadratic mode
    }
    const newParams = { ...params, [key]: numVal };
    if (onChange) onChange(newParams);
  };

  const applyPreset = (presetA, presetB, presetC) => {
    if (onChange) onChange({ a: presetA, b: presetB, c: presetC });
  };

  return (
    <div className="absolute top-20 right-6 z-40 w-80 sm:w-88 rounded-3xl bg-[#0c0817]/90 border border-purple-500/40 backdrop-blur-2xl p-4 shadow-2xl shadow-purple-950/80 text-white animate-in fade-in slide-in-from-right-4 transition-all select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
              Parabola & Curve Explorer
            </h4>
            <p className="text-[10px] text-purple-300/80 font-mono">y = ax² + bx + c</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Close Explorer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-3 space-y-3.5">
          
          {/* Live Equation & Discriminant Readout */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Equation:</span>
              <span className="text-purple-300 font-bold">
                y = {a}x² {b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Discriminant Δ:</span>
              <span 
                className={`font-bold px-2 py-0.5 rounded-full text-[11px] border ${
                  delta > 0 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : Math.abs(delta) < 0.05 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {delta.toFixed(2)} {delta > 0 ? '(2 Real Roots)' : Math.abs(delta) < 0.05 ? '(1 Root)' : '(Complex)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
              <span>Vertex:</span>
              <span className="text-cyan-300">({vertexX.toFixed(2)}, {vertexY.toFixed(2)})</span>
            </div>
          </div>

          {/* Slider A */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-purple-300 font-bold">a (Curvature):</span>
              <span className="text-white font-bold">{a.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-4.0"
              max="4.0"
              step="0.1"
              value={a}
              onChange={(e) => handleSliderChange('a', e.target.value)}
              className="w-full accent-purple-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>-4.0 (Inverted)</span>
              <span>+4.0 (Steep)</span>
            </div>
          </div>

          {/* Slider B */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-cyan-300 font-bold">b (Axis Shift):</span>
              <span className="text-white font-bold">{b.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-8.0"
              max="8.0"
              step="0.5"
              value={b}
              onChange={(e) => handleSliderChange('b', e.target.value)}
              className="w-full accent-cyan-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>-8.0</span>
              <span>+8.0</span>
            </div>
          </div>

          {/* Slider C */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-emerald-300 font-bold">c (Y-Intercept):</span>
              <span className="text-white font-bold">{c.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-6.0"
              max="6.0"
              step="0.5"
              value={c}
              onChange={(e) => handleSliderChange('c', e.target.value)}
              className="w-full accent-emerald-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>-6.0</span>
              <span>+6.0</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="pt-2 border-t border-white/10">
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block mb-2">
              Geometric Presets:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              <button
                onClick={() => applyPreset(1, -2, -3)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400 text-gray-300 hover:text-white transition-all cursor-pointer text-left"
              >
                2 Roots: x²-2x-3
              </button>
              <button
                onClick={() => applyPreset(1, -4, 4)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400 text-gray-300 hover:text-white transition-all cursor-pointer text-left"
              >
                1 Root: (x-2)²
              </button>
              <button
                onClick={() => applyPreset(1, 0, 4)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-400 text-gray-300 hover:text-white transition-all cursor-pointer text-left"
              >
                Complex: x²+4
              </button>
              <button
                onClick={() => applyPreset(-1, 0, 4)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400 text-gray-300 hover:text-white transition-all cursor-pointer text-left"
              >
                Inverted: -x²+4
              </button>
            </div>
          </div>

          {/* Reset Action */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => applyPreset(1.0, -2.0, -3.0)}
              className="text-[11px] text-gray-400 hover:text-purple-300 flex items-center gap-1 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Standard Curve</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
