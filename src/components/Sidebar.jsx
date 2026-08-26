import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, HelpCircle, FileText, Calendar, Sparkles, 
  GraduationCap, Settings, LogOut, BookOpen, X, UploadCloud, 
  Mail, Trophy, Code, Clock, AlertTriangle, Users, Film, Shield, 
  Target, ClipboardList, ShoppingCart, MessageCircle, Map, 
  Activity, Power, Cpu, ShieldCheck, Rocket, Video, Search 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, isOpen, onClose, onLogout, onExitApp }) {
  const userEmail = (user?.email || '').toLowerCase().trim();
  const isFounder = user?.role === 'founder' || 
                    userEmail === 'founder@lumixora.com' ||
                    userEmail === '249xa33106@gmail.com';
  const isTeammate = user?.role === 'teammate' || 
                     user?.role === 'team' || 
                     user?.role === 'team_member' || 
                     userEmail.endsWith('@lumixora.com') || 
                     isFounder;
  const isFaculty = user?.role === 'faculty' || user?.role === 'mentor' || isFounder;

  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  const menuItems = [
    ...(isFounder ? [{ id: 'founder-portal', label: 'Founder Control', icon: Shield, badge: 'Secure' }] : []),
    ...(isTeammate ? [{ id: 'team-portal', label: 'Teammate Portal', icon: Sparkles, badge: 'Team ⚡' }] : []),
    ...(isFaculty ? [{ id: 'faculty-portal', label: 'Faculty Command', icon: GraduationCap, badge: 'Faculty' }] : []),
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'videos', label: 'Video Lectures', icon: Video, badge: 'Sem Wise 🎬' },
    { id: 'resume', label: 'AI Resume Builder', icon: FileText, badge: 'ATS PDF 📄' },
    { id: 'projects', label: 'Project Showcase', icon: Rocket, badge: 'Showcase 🚀' },
    { id: 'grievance', label: 'Anonymous Grievances', icon: ShieldCheck, badge: 'Encrypted 🔒' },
    { id: 'ai-commander', label: 'AI Placement Commander™', icon: Cpu, badge: 'NEW 🔥' },
    { id: 'future-twin', label: 'AI Future Twin™', icon: Sparkles, badge: 'PRO' },
    { id: 'coding-practice', label: 'Code Arena', icon: Code, badge: 'Beta' },
    { id: 'hackathons', label: 'Hackathons & Internships', icon: Trophy, badge: 'HOT 🏆' },
    { id: 'simulation', label: 'Simulation Portal', icon: Activity, badge: 'New' },
    { id: 'community', label: 'Class Community', icon: MessageCircle, badge: 'New' },
    { id: 'test-portal', label: 'Test Portal', icon: Target, badge: 'Hot' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart, badge: 'New' },
    { id: 'assigned-tasks', label: 'Assigned Tasks', icon: ClipboardList, badge: 'New' },
    { id: 'life-replay', label: 'Life Replay', icon: Film, badge: 'New' },
    { id: 'doubts', label: 'Doubt Solver', icon: HelpCircle, badge: 'AI 24/7' },
    { id: 'learning-hub', label: 'Learning Hub', icon: BookOpen },
    { id: 'career-roadmap', label: 'Career Roadmap', icon: Map, badge: 'Pro' },
    { id: 'notes', label: 'Previous Papers', icon: FileText },
    { id: 'attendance', label: 'My Attendance', icon: ClipboardList, badge: 'New' },
    { id: 'clubs', label: 'College Clubs', icon: Users, badge: 'New' },
    { id: 'tasks', label: 'Task Scheduler', icon: Calendar },
    { id: 'study-with-me', label: 'Study Arena', icon: Clock },
    { id: 'contribute', label: 'Contribute Notes', icon: UploadCloud },
    { id: 'contact', label: 'Connect with Founder', icon: Mail },
    { id: 'report-bug', label: 'Report Bug', icon: AlertTriangle },
  ];

  // Filtered menu items based on search input
  const filteredMenuItems = useMemo(() => {
    if (!menuSearchQuery.trim()) return menuItems;
    const q = menuSearchQuery.toLowerCase().trim();
    return menuItems.filter(item => 
      item.label.toLowerCase().includes(q) || 
      (item.badge && item.badge.toLowerCase().includes(q)) ||
      item.id.toLowerCase().includes(q)
    );
  }, [menuItems, menuSearchQuery]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Close sidebar on mobile after navigation
    if (onClose) onClose();
  };

  const cleanScholarName = (str) => {
    if (!str || typeof str !== 'string') return 'Scholar';
    let cleaned = str;
    if (cleaned.includes('{')) {
      cleaned = cleaned.split('{')[0].trim();
    }
    cleaned = cleaned.replace(/[\{\}":;]/g, '').trim();
    return cleaned || 'Scholar';
  };

  const parseUserProfile = (fullName) => {
    let rawStr = fullName || '';
    let name = cleanScholarName(rawStr);
    let metadata = { qualification: '', college: 'GPREC', place: 'Kurnool, AP', year: '1st Year', avatarUrl: '' };
    if (rawStr.includes('{')) {
      const idx = rawStr.indexOf('{');
      const jsonStr = rawStr.substring(idx).trim();
      try {
        const rawJson = JSON.parse(jsonStr);
        if (rawJson && typeof rawJson === 'object') {
          Object.keys(rawJson).forEach(k => {
            const lowerK = k.toLowerCase();
            if (lowerK === 'qualification') metadata.qualification = rawJson[k];
            if (lowerK === 'college') metadata.college = rawJson[k];
            if (lowerK === 'place') metadata.place = rawJson[k];
            if (lowerK === 'year') metadata.year = rawJson[k];
            if (lowerK === 'avatarurl') metadata.avatarUrl = rawJson[k];
          });
        }
      } catch (e) {
        const qualMatch = jsonStr.match(/"qualification"\s*:\s*"([^"]+)"/i);
        const collMatch = jsonStr.match(/"college"\s*:\s*"([^"]+)"/i);
        const placeMatch = jsonStr.match(/"place"\s*:\s*"([^"]+)"/i);
        const yearMatch = jsonStr.match(/"year"\s*:\s*"([^"]+)"/i);
        const avatarMatch = jsonStr.match(/"avatarurl"\s*:\s*"([^"]+)"/i);
        if (qualMatch) metadata.qualification = qualMatch[1];
        if (collMatch) metadata.college = collMatch[1];
        if (placeMatch) metadata.place = placeMatch[1];
        if (yearMatch) metadata.year = yearMatch[1];
        if (avatarMatch) metadata.avatarUrl = avatarMatch[1];
      }
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

      <aside className={`fixed top-0 left-0 h-screen w-[250px] bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col z-50 transition-transform duration-300 ease-in-out text-[var(--text-main)] overflow-x-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Brand Logo and Title */}
        <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-[var(--border-color)] shrink-0">
          <div className="relative group cursor-pointer" onClick={() => handleTabClick('dashboard')}>
            <div className="absolute inset-0 bg-brand-teal/20 rounded-full blur-md group-hover:bg-brand-purple/30 transition-all duration-500"></div>
            <img 
              src="/lumixora_logo.jpg" 
              alt="Lumixora Logo" 
              className="w-9 h-9 rounded-full object-cover border border-white/20 relative z-10 scale-100 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleTabClick('dashboard')}>
            <h1 className="text-[19px] font-sora font-bold tracking-wider gradient-text-cyan-purple truncate">LUMIXORA</h1>
            <p className="text-[9px] text-gray-400 tracking-widest font-semibold uppercase truncate">Student OS</p>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── SIDEBAR SEARCH BAR ── */}
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search features..."
              value={menuSearchQuery}
              onChange={(e) => setMenuSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal/60 transition-all"
            />
            {menuSearchQuery && (
              <button
                onClick={() => setMenuSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Menu Options */}
        <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  title={item.label}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors duration-200 group relative cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#5B3DF5] to-[#7048F8] text-white shadow-[0_4px_16px_rgba(91,61,245,0.25)] font-bold' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-main)]'}`} />
                    <span className="font-semibold text-xs tracking-tight truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold tracking-wide shrink-0 ml-1 ${
                      isActive 
                        ? 'bg-brand-teal text-black shadow-sm' 
                        : 'bg-white/10 text-brand-teal group-hover:bg-brand-teal group-hover:text-black transition-colors duration-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="py-8 px-2 text-center space-y-2">
              <p className="text-xs text-gray-400">No tools found matching "{menuSearchQuery}"</p>
              <button
                onClick={() => setMenuSearchQuery('')}
                className="text-[11px] font-bold text-brand-teal hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-[var(--border-color)] flex items-center gap-3 text-[var(--text-secondary)] shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--bg-card)] flex items-center justify-center font-bold text-sm text-brand-primary border border-[var(--border-color)] shrink-0">
            {profile.avatarUrl ? (
              <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              profile.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'S'
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-[var(--text-main)] truncate">{profile.name || 'Student'}</p>
            <p className="text-[10px] text-[var(--text-secondary)] truncate">{user?.email || 'student@lumixora.edu'}</p>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={onLogout}
              className="text-[var(--text-secondary)] hover:text-brand-orange transition-colors p-1 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
