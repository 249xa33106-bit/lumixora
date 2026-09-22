import React from 'react';
import { 
  BookOpen, Code, Rocket, Users, Briefcase, 
  ShieldCheck, ArrowRight, Sparkles, Compass
} from 'lucide-react';
import { OMIVERSE_WORLDS } from '../../services/omiverseService';

export default function OmiverseWorldNavigator({ activeTab, onNavigateTab, onOpenProveModal }) {
  return (
    <div className="w-full space-y-4">
      
      {/* Navigator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>THE 6 WORLDS OF VYOMRA OMIVERSE</span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-teal/20 text-brand-teal border border-brand-teal/30">
              Connected Ecosystem
            </span>
          </h3>
          <p className="text-xs text-gray-400">
            One connected talent graph powering your journey from learning to verified hireability.
          </p>
        </div>
      </div>

      {/* 6 Worlds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {OMIVERSE_WORLDS.map((world, index) => {
          return (
            <div
              key={world.id}
              className={`p-4 rounded-2xl bg-gradient-to-br ${world.gradient} border ${world.border} bg-[#0b0e17]/80 backdrop-blur-md hover:border-white/20 transition-all group relative overflow-hidden flex flex-col justify-between space-y-3 shadow-lg`}
            >
              {/* Card Top */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{world.icon}</span>
                    <span className={`text-xs font-black bg-gradient-to-r ${world.textGradient} bg-clip-text text-transparent tracking-wide`}>
                      {world.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-400">0{index + 1}</span>
                </div>

                <p className="text-[11px] font-bold text-gray-300">
                  {world.tagline}
                </p>

                <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                  {world.subtitle}
                </p>
              </div>

              {/* Sub-features list */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {world.features.map((feat) => (
                  <button
                    key={feat.id}
                    onClick={() => onNavigateTab(feat.id)}
                    className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    {feat.name}
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onNavigateTab(world.primaryTab)}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10 group-hover:border-white/20"
              >
                <span>Enter {world.name}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
