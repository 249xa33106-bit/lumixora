import React from 'react';
import { motion } from 'framer-motion';

const AmplitudeHistogram = ({ probData }) => {
  if (!probData) return null;

  const states = Object.entries(probData);

  return (
    <div className="w-full h-[200px] flex items-end justify-around gap-2 p-4 relative bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] overflow-hidden">
      {/* High-Tech Background Grid */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .3) 25%, rgba(255, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .3) 75%, rgba(255, 255, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .3) 25%, rgba(255, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .3) 75%, rgba(255, 255, 255, .3) 76%, transparent 77%, transparent)', backgroundSize: '30px 30px' }}
      ></div>

      {states.map(([state, prob]) => {
        const heightPercent = prob;
        const isActive = prob > 0;

        return (
          <div key={state} className="flex flex-col items-center justify-end h-full w-full max-w-[40px] relative z-10 group">
            {/* Probability Value (Always visible above the pillar) */}
            <div className="absolute top-0 transform -translate-y-full mb-1 text-[10px] font-mono text-[var(--brand-orange)] opacity-80 z-20">
              {prob > 0 ? `${prob.toFixed(0)}%` : ''}
            </div>

            {/* Glowing Pillar */}
            <div className="w-full relative flex items-end justify-center h-[120px] bg-slate-800/50 rounded-t-sm border border-slate-700/50 overflow-hidden">
              <motion.div
                className="w-full absolute bottom-0 rounded-t-sm"
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ type: 'spring', damping: 15, stiffness: 60 }}
                style={{
                  background: isActive ? 'linear-gradient(180deg, rgba(56,189,248,1) 0%, rgba(14,165,233,0.8) 100%)' : 'transparent',
                  boxShadow: isActive ? '0 0 15px rgba(56,189,248,0.6), inset 0 2px 4px rgba(255,255,255,0.4)' : 'none'
                }}
              >
                {/* Laser Tip Overlay */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-80 rounded-t-sm shadow-[0_0_8px_#fff]"></div>
                )}
                {/* Holographic Scanline Overlay */}
                {isActive && (
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}></div>
                )}
              </motion.div>
            </div>

            {/* State Label */}
            <div className={`mt-3 text-xs font-mono font-bold transition-colors duration-300 ${isActive ? 'text-[var(--brand-orange)] drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'text-[var(--text-secondary)]'}`}>
              |{state}⟩
            </div>
            
            {/* Base Plate Glow */}
            {isActive && (
               <div className="w-8 h-1 mt-1 bg-sky-400 rounded-full blur-[2px] opacity-70"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AmplitudeHistogram;
