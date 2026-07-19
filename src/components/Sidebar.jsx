import React from 'react';
import { LayoutDashboard, HelpCircle, FileText, Calendar, Sparkles, GraduationCap, Settings, LogOut, BookOpen, X, UploadCloud, Mail, Trophy, Code, Clock, AlertTriangle, Users, Film } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, isOpen, onClose, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'future-twin', label: 'AI Future Twin™', icon: Sparkles, badge: 'PRO' },
    { id: 'coding-practice', label: 'Code Arena', icon: Code, badge: 'Beta' },
    { id: 'life-replay', label: 'Life Replay', icon: Film, badge: 'New' },
    { id: 'doubts', label: 'Doubt Solver', icon: HelpCircle, badge: 'AI 24/7' },
    { id: 'learning-hub', label: 'Learning Hub', icon: BookOpen },
    { id: 'notes', label: 'Previous Papers', icon: FileText },
    { id: 'tasks', label: 'Task Scheduler', icon: Calendar },
    { id: 'study-with-me', label: 'Study Arena', icon: Clock },
    { id: 'contribute', label: 'Contribute Notes', icon: UploadCloud },
    { id: 'contact', label: 'Connect with Founder', icon: Mail },
    { id: 'report-bug', label: 'Report Bug', icon: AlertTriangle },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Close sidebar on mobile after navigation
    if (onClose) onClose();
  };

  const parseUserProfile = (fullName) => {
    let name = fullName || '';
    let metadata = { qualification: '', college: '', place: '', year: '1st Year', avatarUrl: '' };
    if (name.includes('{')) {
      const idx = name.indexOf('{');
      const jsonStr = name.substring(idx).trim();
      name = name.substring(0, idx).trim();
      try {
        metadata = JSON.parse(jsonStr);
      } catch (e) {}
    }
    return { name: name || 'Scholar', ...metadata };
  };

  const profile = parseUserProfile(user?.name);
  const avatarSrc = profile.avatarUrl || '/lumixora_logo.jpg';

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 left-0 h-screen w-[280px] glass-panel border-r border-border-glass flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Brand Logo and Title */}
        <div className="p-6 flex items-center gap-3 border-b border-border-glass">
          <div className="relative group">
            <div className="absolute inset-0 bg-brand-teal/20 rounded-full blur-md group-hover:bg-brand-purple/30 transition-all duration-500"></div>
            <img 
              src="/lumixora_logo.jpg" 
              alt="Lumixora Logo" 
              className="w-10 h-10 rounded-full object-cover border border-white/20 relative z-10 scale-100 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-wider gradient-text-cyan-purple">LUMIXORA</h1>
            <p className="text-[10px] text-gray-400 tracking-widest font-semibold uppercase">Student OS</p>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Options */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-brand-teal/20 to-brand-purple/10 border border-brand-teal/30 text-brand-teal shadow-[0_0_15px_rgba(0,245,212,0.1)]' 
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-brand-teal' : 'text-gray-400 group-hover:text-gray-200'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isActive 
                      ? 'bg-brand-teal text-black shadow-[0_0_8px_rgba(0,245,212,0.4)]' 
                      : 'bg-white/10 text-brand-teal group-hover:bg-brand-teal group-hover:text-black transition-colors duration-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick AI Widget */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-brand-pink/20 to-brand-purple/20 border border-brand-pink/30 relative overflow-hidden group shadow-[0_0_20px_rgba(247,37,133,0.15)] hover:shadow-[0_0_30px_rgba(247,37,133,0.3)] transition-shadow duration-500">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-pink/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 animate-pulse-glow"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-brand-pink text-xs font-black uppercase tracking-widest mb-1.5 drop-shadow-[0_0_5px_rgba(247,37,133,0.5)]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Lumixora AI Plus</span>
            </div>
            <p className="text-[11px] text-gray-300 font-medium mb-3 leading-relaxed">Instant Doubt Solving, Notes Enhancer & AI Schedules.</p>
            <button 
              onClick={() => handleTabClick('doubts')}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple hover:opacity-90 border-none text-xs font-bold text-white transition-all duration-300 shadow-[0_4px_15px_rgba(247,37,133,0.3)] hover:shadow-[0_4px_25px_rgba(247,37,133,0.5)] cursor-pointer"
            >
              Access Copilot
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-border-glass flex items-center gap-3 text-gray-400">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center font-bold text-sm text-brand-teal border border-white/10 shrink-0">
            {profile.avatarUrl ? (
              <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              profile.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'S'
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-gray-200 truncate">{profile.name || 'Student'}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email || 'student@lumixora.edu'}</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-gray-500 hover:text-brand-pink transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
