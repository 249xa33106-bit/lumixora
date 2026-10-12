import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Layers,
  Sparkles,
  TrendingUp,
  FileText,
  Settings,
  Compass,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenLanding: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenLanding,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'import', label: 'Tests & Results', icon: FileSpreadsheet },
    { id: 'topics', label: 'Topic Analysis', icon: Layers },
    { id: 'actions', label: 'Action Centre', icon: Sparkles, badge: 'Hero' },
    { id: 'interventions', label: 'Interventions', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Institution Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 select-none shadow-sm z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl text-slate-900 tracking-tight">EduPulse</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                SaaS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
              Kurnool, AP Edition
            </p>
          </div>
        </div>
      </div>

      {/* Tagline micro banner */}
      <div className="px-5 py-2.5 bg-slate-50/80 border-b border-slate-100">
        <p className="text-[11px] font-medium text-slate-600 italic">
          “Every test should lead to a better next step.”
        </p>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Platform
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-teal-50 text-teal-800 font-semibold shadow-xs border border-teal-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-600 text-white shadow-xs">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Showcase Button */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={onOpenLanding}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-teal-800 bg-teal-100/70 hover:bg-teal-200/70 rounded-lg transition-colors border border-teal-300/60"
        >
          <Compass className="w-3.5 h-3.5 text-teal-700" />
          <span>Product Overview / Pilot</span>
        </button>
      </div>
    </aside>
  );
};
