import React, { useState } from 'react';
import { Sparkles, Check, X, MousePointer, Heart, Shield, Award, Play } from 'lucide-react';

export default function CursorCompanionModal({ isOpen, onClose, onSelect }) {
  const [selectedCompanion, setSelectedCompanion] = useState(null);

  if (!isOpen) return null;

  const COMPANIONS = [
    {
      id: 'off',
      name: 'Clean Standard Cursor',
      subtitle: 'Pure Professional UI',
      desc: 'No cartoons or animations. Smooth, ultra-fast, distraction-free modern interface.',
      badge: 'Recommended',
      color: '#94A3B8',
      preview: '🎯'
    },
    {
      id: 'tom_and_jerry',
      name: 'Tom & Jerry Chase',
      subtitle: 'Classic Cartoon Duo',
      desc: 'Jerry happily chases a cheese cursor while Tom playfully runs behind.',
      badge: 'Playful',
      color: '#F59E0B',
      preview: '🐱🐭'
    },
    {
      id: 'pikachu',
      name: 'Pikachu Lightning',
      subtitle: 'Electric Energy Boost',
      desc: 'Pikachu scurries alongside emitting sparks and 100,000V placement streak aura.',
      badge: 'High Energy',
      color: '#EAB308',
      preview: '⚡'
    },
    {
      id: 'doraemon',
      name: 'Doraemon & Gadgets',
      subtitle: 'Bamboo Copter Magic',
      desc: 'Doraemon flies on his Bamboo Copter leaving magic gadget sparkle trails.',
      badge: 'Creative',
      color: '#0284C7',
      preview: '🌀'
    },
    {
      id: 'shinchan',
      name: 'Shinchan Mischief',
      subtitle: 'Action Kamen Runner',
      desc: 'Shinchan zips around emitting mini Action Kamen beams & comedic stars.',
      badge: 'Fun',
      color: '#EF4444',
      preview: '🕶️'
    },
    {
      id: 'ben10',
      name: 'Ben 10 Omnitrix',
      subtitle: 'Alien Matrix Pulse',
      desc: 'Ben 10 with glowing neon-green Omnitrix pulse and matrix energy ring.',
      badge: 'Sci-Fi',
      color: '#10B981',
      preview: '🛸'
    },
    {
      id: 'bheem',
      name: 'Chhota Bheem Ladoo',
      subtitle: 'Dholakpur Power Surge',
      desc: 'Chhota Bheem with golden energy rings and high-power study motivation.',
      badge: 'Strength',
      color: '#F97316',
      preview: '🦾'
    }
  ];

  const handleApply = (id) => {
    const choice = id !== undefined ? id : (selectedCompanion || 'off');
    onSelect(choice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0B0F1C] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-white space-y-6">
        
        {/* Glow Ambient */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#7553E8]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#08BFD0]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-cyan-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalize Your Study OS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-sora tracking-tight text-white">
              Choose Your Workspace Style
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Do you want a playful cartoon companion following your cursor, or a clean, distraction-free interface?
            </p>
          </div>

          <button
            onClick={() => handleApply('off')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Skip & Keep Clean"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar relative z-10">
          {COMPANIONS.map((item) => {
            const isSelected = selectedCompanion === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedCompanion(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-white/10 border-cyan-400 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl shadow-inner bg-black/40 border border-white/10"
                  style={{ borderColor: isSelected ? item.color : undefined }}
                >
                  {item.preview}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white truncate block">
                      {item.name}
                    </span>
                    <span 
                      className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: `${item.color}20`, 
                        color: item.color,
                        border: `1px solid ${item.color}40`
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-snug line-clamp-2 mt-1">
                    {item.desc}
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-400 text-black flex items-center justify-center text-[10px] font-black shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 relative z-10">
          <p className="text-[11px] text-gray-400">
            You can change or turn this on/off anytime from the top bar icon ✨
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleApply('off')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/15 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer text-center"
            >
              Keep Clean (Off)
            </button>
            <button
              onClick={() => handleApply()}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-black text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer text-center"
            >
              Confirm Choice
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
