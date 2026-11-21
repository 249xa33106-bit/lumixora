import React, { useState, useMemo } from 'react';
import Realistic3DLogo from './Realistic3DLogo';
import { isGprecPlacementSubdomain, isTpoSubdomain, GPREC_PLACEMENT_PORTALS, isAllowedGprecPlacementTab } from '../utils/placementSubdomain';
import { 
  LayoutDashboard, HelpCircle, FileText, Calendar, Sparkles, 
  GraduationCap, Settings, LogOut, BookOpen, X, UploadCloud, 
  Mail, Trophy, Code, Clock, AlertTriangle, Users, Film, Shield, 
  Target, ClipboardList, ShoppingCart, MessageCircle, Map as MapIcon, 
  Activity, Power, Cpu, ShieldCheck, Rocket, Video, Search, Briefcase,
  Mic, Award, ChevronDown, ChevronRight, Brain, Flame, GitFork, Atom, Gift, Star, Pin,
  Eye, EyeOff, Sliders, Radio, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';


const TAB_TO_WORKSPACE = {
  'dashboard': 'academics',
  'learning-hub': 'academics',
  'previous-papers': 'academics',
  'doubts': 'academics',
  'my-academics': 'academics',
  'courses': 'academics',
  'tests': 'academics',
  'bolo-class': 'academics',
  'simulations': 'academics',
  'attendance': 'academics',

  'ai-placement': 'career',
  'speakverse': 'career',
  'interviews': 'career',
  'techpulse': 'career',
  'coding-practice': 'career',
  'certificates': 'career',
  'internships': 'career',
  'referrals': 'career',
  'roadmap': 'career',

  'perks': 'social',
  'marketplace': 'social',
  'clubs': 'social',
  'projects': 'social',
  'hackathons': 'social',

  'notes-contribute': 'support',
  'contact': 'support',
  'report-bug': 'support',
  'founder-portal': 'support',
  'team-workspace': 'support',
  'intern-portal': 'support',
  'faculty-portal': 'support',
};

export default function Sidebar({ activeTab, setActiveTab, user, isOpen, onClose, onLogout, onExitApp, isCollapsed = false, onToggleCollapse }) {
  const isGprecSubdomain = isGprecPlacementSubdomain(user);
  const isTpo = isTpoSubdomain();
  const userEmail = (user?.email || '').toLowerCase().trim();
  const isFounder = user?.role === 'founder' || 
                    userEmail === 'founder@lumixora.com' ;
  const isTeammate = user?.role === 'teammate' || 
                     user?.role === 'team' || 
                     user?.role === 'team_member' || 
                     userEmail.endsWith('@lumixora.com') || 
                     isFounder;
  const isFaculty = user?.role === 'faculty' || user?.role === 'mentor' || isFounder;
  const isIntern = user?.role === 'intern' || userEmail.includes('intern');

  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_sidebar_workspace');
      if (saved) return saved;
    } catch (_) {}
    return 'all';
  });

  const handleSelectWorkspace = (wsId) => {
    setSelectedWorkspace(wsId);
    try {
      localStorage.setItem('lumixora_sidebar_workspace', wsId);
    } catch (_) {}
  };
  // ─── Pinned / Favorite Portals State ───
  const [pinnedPortals, setPinnedPortals] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_sidebar_pinned_portals');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return ['dashboard', 'ai-commander', 'coding-practice'];
  });

  const togglePinPortal = (portalId, e) => {
    if (e) e.stopPropagation();
    setPinnedPortals(prev => {
      let updated;
      if (prev.includes(portalId)) {
        updated = prev.filter(id => id !== portalId);
      } else {
        if (prev.length >= 6) {
          updated = [...prev.slice(1), portalId]; // keep max 6
        } else {
          updated = [...prev, portalId];
        }
      }
      try {
        localStorage.setItem('lumixora_sidebar_pinned_portals', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

    const [collapsedSections, setCollapsedSections] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_sidebar_collapsed_sections');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    // Default smart collapse: keep Academics & Learning + Career open, collapse social & support
    return { social: true, support: true };
  });

  const toggleSection = (sectionKey) => {
    setCollapsedSections(prev => {
      const updated = { ...prev, [sectionKey]: !prev[sectionKey] };
      try {
        localStorage.setItem('lumixora_sidebar_collapsed_sections', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  // Active portals configured in live user preferences (if empty/unspecified or founder, all are allowed)
  const userActivePortals = useMemo(() => {
    if (isFounder || isTeammate || isFaculty) return null; // Admins see all
    if (Array.isArray(user?.activePortals) && user.activePortals.length > 0) {
      if (isGprecSubdomain) {
        return new Set(user.activePortals.filter(id => isAllowedGprecPlacementTab(id)));
      }
      return new Set(user.activePortals);
    }
    return null;
  }, [user?.activePortals, isFounder, isTeammate, isFaculty, isGprecSubdomain]);

  // GPREC Placement Suite dedicated menu items
  const isOfficerOrFaculty = isFaculty || isFounder || user?.isOfficer || user?.isDean || user?.email === 'dean.placements@gprec.ac.in' || user?.email === 'srikanth.csm@gprec.ac.in';

  const gprecSections = [
    ...(isOfficerOrFaculty ? [{
      key: 'tpo_admin',
      title: '🏛️ T&P Officer Command',
      items: [
        { id: 'tpo-dashboard', label: 'T&P Officer Dashboard', icon: Shield, badge: 'OFFICER 🛡️' },
        { id: 'student-database', label: 'Student Placement Database', icon: Users, badge: 'DATABASE 🗄️' },
        { id: 'faculty-portal', label: 'T&P Faculty', icon: GraduationCap, badge: 'FACULTY 🎓' },
      ]
    }] : []),
    {
      key: 'gprec_flagship',
      title: '🎯 GPREC Placement Suite',
      items: [
        { id: 'ai-commander', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'placement', label: 'My Placement', icon: Briefcase },
        { id: 'tech-pulse', label: 'TechPulse', icon: Activity, badge: 'LIVE' },
        { id: 'interview', label: 'Mock Interviews', icon: Video },
        { id: 'coding-practice', label: 'Skill Hub', icon: Code },
        { id: 'analytics', label: 'Analytics', icon: Target },
        { id: 'company-papers', label: 'Resources', icon: BookOpen },
        { id: 'contact', label: 'Settings & Support', icon: Settings }
      ]
    }
  ];

  const tpoSections = [
    {
      key: 'tpo_admin',
      title: '🏛️ T&P Officer Command',
      items: [
        { id: 'tpo-dashboard', label: 'T&P Officer Dashboard', icon: Shield, badge: 'OFFICER 🛡️' },
        { id: 'student-database', label: 'Student Placement Database', icon: Users, badge: 'DATABASE 🗄️' },
        { id: 'faculty-portal', label: 'T&P Faculty', icon: GraduationCap, badge: 'FACULTY 🎓' },
      ]
    },
    {
      key: 'support',
      title: '🏛️ GPREC Placement Cell',
      items: [
        { id: 'contact', label: 'Placement Support / Help', icon: Mail },
        { id: 'report-bug', label: 'Report Issue', icon: AlertTriangle },
      ]
    }
  ];

  const menuSections = isTpo ? tpoSections : isGprecSubdomain ? gprecSections : [
    ...(isFounder || isFaculty || isTeammate || isIntern ? [{
      key: 'admin',
      title: '🛡️ Command & Ops',
      items: [
        ...(isFounder ? [{ id: 'founder-portal', label: 'Founder Control', icon: Shield }] : []),
        ...(isFounder || isTeammate ? [{ id: 'team-workspace', label: 'Team Workspace', icon: Sparkles }] : []),
        { id: 'intern-portal', label: 'Intern Portal (48)', icon: Award },
        ...(isFaculty ? [{ id: 'faculty-portal', label: 'T&P Faculty', icon: GraduationCap }] : []),
      ]
    }] : []),
    {
      key: 'academics',
      title: '🎓 Learning & Academics',
      items: [
        { id: 'dashboard', label: 'Omiverse Hub', icon: LayoutDashboard },
        { id: 'learning-hub', label: 'Notes & Curriculum', icon: BookOpen },
        { id: 'previous-papers', label: 'Previous Papers & Predictor', icon: FileText, badge: 'ML 🧠' },
        { id: 'doubts', label: 'AI Doubt Solver', icon: HelpCircle },
        { id: 'my-academics', label: 'My Academics (SGPA)', icon: GraduationCap },
        { id: 'courses', label: 'Courses & Diplomas', icon: BookOpen },
        { id: 'test-portal', label: 'Tests & Assessments', icon: Target },
        { id: 'boloclass', label: 'BoloClass AI', icon: Brain },
        { id: 'simulations', label: 'Interactive 3D Labs', icon: Atom },
        { id: 'attendance', label: 'Attendance Tracker', icon: ClipboardList },
      ]
    },
    {
      key: 'career',
      title: '🚀 Career & Placements',
      items: [
        { id: 'ai-commander', label: 'Placement Commander', icon: Cpu },
        { id: 'speakverse', label: 'SpeakVerse™ AI', icon: Mic },
        { id: 'interview', label: 'AI Mock Interviews', icon: Video },
        { id: 'tech-pulse', label: 'TechPulse Radar', icon: Radio },
        { id: 'coding-practice', label: 'Code Arena & DSA', icon: Code },
        { id: 'certificates', label: 'Skill Certifications', icon: Award },
        { id: 'internships', label: 'Student Internships', icon: Briefcase },
        { id: 'alumni-referrals', label: 'Alumni Referrals', icon: Users },
        { id: 'career-roadmap', label: 'Career Roadmap', icon: MapIcon },
      ]
    },
    {
      key: 'social',
      title: '🌐 Campus & Community',
      items: [
        { id: 'student-offers', label: 'Student Perks & Offers', icon: Gift },
        { id: 'marketplace', label: 'Campus Marketplace', icon: ShoppingCart },
        { id: 'clubs', label: 'Clubs & Societies', icon: Users },
        { id: 'projects', label: 'Project Showcase', icon: Rocket },
        { id: 'hackathons', label: 'Hackathons & Contests', icon: Trophy },
      ]
    },
    {
      key: 'support',
      title: '🛠️ Support & Settings',
      items: [
        { id: 'contribute', label: 'Contribute Notes', icon: UploadCloud },
        { id: 'contact', label: 'Founder Connect', icon: Mail },
        { id: 'report-bug', label: 'Report Issue', icon: AlertTriangle },
      ]
    }
  ];

  // Flattened map of all portal items for pinned tray
  const allPortalItemsMap = useMemo(() => {
    const map = {};
    menuSections.forEach(sec => {
      sec.items.forEach(it => {
        if (!map[it.id]) map[it.id] = { ...it, secTitle: sec.title };
      });
    });
    return map;
  }, [menuSections]);

    // Search & Personalization filter across sections
  const filteredSections = useMemo(() => {
    let sections = menuSections;

    // Filter by Workspace Mode when active and not searching
    if (!isGprecSubdomain && !isTpo && selectedWorkspace !== 'all' && !menuSearchQuery.trim()) {
      if (selectedWorkspace === 'support') {
        sections = sections.filter(sec => sec.key === 'support' || sec.key === 'admin');
      } else {
        sections = sections.filter(sec => sec.key === selectedWorkspace);
      }
    }

    if (!menuSearchQuery.trim()) return sections;
    const q = menuSearchQuery.toLowerCase().trim();
    return sections.map(sec => ({
      ...sec,
      items: sec.items.filter(item => 
        item.label.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q)) ||
        item.id.toLowerCase().includes(q)
      )
    })).filter(sec => sec.items.length > 0);
  }, [menuSections, menuSearchQuery, selectedWorkspace, isGprecSubdomain, isTpo]);

  const handleTabClick = (tabId) => {
    if (isGprecSubdomain && !isAllowedGprecPlacementTab(tabId)) {
      setActiveTab('ai-commander');
    } else {
      setActiveTab(tabId);
      const ws = TAB_TO_WORKSPACE[tabId];
      if (ws && selectedWorkspace !== 'all') {
        handleSelectWorkspace(ws);
      }
    }
    if (onClose) onClose();
  };

  const cleanScholarName = (str) => {
    if (!str || typeof str !== 'string') return 'Scholar';
    let cleaned = str.split('{')[0].trim();
    cleaned = cleaned.replace(/[\{\}":;]/g, '').trim();
    return cleaned || 'Scholar';
  };

  const scholarName = cleanScholarName(user?.name);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 bottom-0 w-[260px] bg-[#070b14] border-r border-white/10 z-50 flex flex-col transition-transform duration-300 ease-in-out select-none shadow-2xl ${
        isOpen ? 'translate-x-0' : (isCollapsed ? '-translate-x-full' : '-translate-x-full lg:translate-x-0')
      }`}>
        
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-3">
            {isGprecSubdomain ? (
              <img 
                src="/gprec-logo.png" 
                alt="GPREC Logo" 
                className="w-10 h-10 object-contain rounded-xl p-0.5 bg-white shadow-xs" 
              />
            ) : (
              <Realistic3DLogo size="md" />
            )}
            <div>
              <h1 className="text-base font-black text-white tracking-wider flex items-center gap-1.5 font-sora">
                {isGprecSubdomain ? 'GPREC PLACEMENT' : 'LUMIXORA'}
              </h1>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                {isGprecSubdomain ? 'Placement Suite • Vyomra' : 'Student OS • Vyomra'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Desktop Collapse Button */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex w-8 h-8 rounded-xl items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4 group-hover:scale-105 transition-transform" />
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── 4 Workspace Mode Segmented Control (Academics / Career / Campus / More / All) ─── */}
        {!isGprecSubdomain && !isTpo && (
          <div className="px-3 pt-2.5 pb-1 bg-black/20 border-b border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-gray-400 px-1">
              <span>Workspaces</span>
              <span className="text-[9px] font-mono font-bold text-cyan-400">
                {selectedWorkspace === 'all' ? 'All Portals' : selectedWorkspace.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1 p-1 bg-white/[0.04] border border-white/10 rounded-2xl">
              {[
                { id: 'all', label: 'All', icon: Sparkles },
                { id: 'academics', label: 'Study', icon: GraduationCap },
                { id: 'career', label: 'Career', icon: Rocket },
                { id: 'social', label: 'Campus', icon: Users },
                { id: 'support', label: 'More', icon: Settings },
              ].map(ws => {
                const isWsActive = selectedWorkspace === ws.id;
                const Icon = ws.icon;
                return (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => handleSelectWorkspace(ws.id)}
                    className={`py-1.5 px-0.5 rounded-xl text-[10px] font-black transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      isWsActive
                        ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 text-cyan-300 border border-cyan-500/40 shadow-xs'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                    title={`Switch to ${ws.label} Workspace`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isWsActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                    <span className="truncate tracking-tight text-[9px]">{ws.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Menu Search & Personalized Toggle */}
        <div className="p-3 border-b border-white/5 bg-black/20 space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={menuSearchQuery}
              onChange={(e) => setMenuSearchQuery(e.target.value)}
              placeholder="Search features..."
              className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            {menuSearchQuery && (
              <button
                onClick={() => setMenuSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >✕</button>
            )}
          </div>
        </div>

        {/* Navigation Categories & Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">

          {/* ─── 📌 Pinned Favorites / Quick Access Tray ─── */}
          {!menuSearchQuery && pinnedPortals.length > 0 && (
            <div className="space-y-1.5 pb-2 border-b border-white/10">
              <div className="flex items-center justify-between px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-amber-400/90 select-none">
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Pinned Quick Access</span>
                </span>
                <span className="text-[9px] font-mono font-bold text-gray-500">{pinnedPortals.length}/6</span>
              </div>

              <div className="space-y-1 pt-1">
                {pinnedPortals.map(portalId => {
                  const item = allPortalItemsMap[portalId];
                  if (!item) return null;
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <div
                      key={'pinned-' + item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-purple-600/20 text-amber-300 border border-amber-500/35 shadow-sm shadow-amber-500/10'
                          : 'text-gray-200 hover:text-white hover:bg-white/5 border border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-amber-400/70 group-hover:text-amber-300'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => togglePinPortal(item.id, e)}
                        title="Unpin tool"
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-lg text-amber-400 transition-opacity"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {filteredSections.map(sec => {
            const isCollapsed = collapsedSections[sec.key];
            return (
              <div key={sec.key} className="space-y-1.5 pt-1">
                <div 
                  onClick={() => toggleSection(sec.key)}
                  className="flex items-center justify-between px-2 py-1 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-indigo-300 cursor-pointer transition-colors group select-none"
                >
                  <span className="font-extrabold tracking-wide text-[11px] text-gray-400 group-hover:text-indigo-300 transition-colors">
                    {sec.title}
                  </span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-indigo-300 transition-transform stroke-[2.5]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-indigo-300 transition-transform stroke-[2.5]" />
                  )}
                </div>

                {!isCollapsed && (
                  <div className="space-y-1 pt-0.5">
                    {sec.items.map(item => {
                      const IconComp = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleTabClick(item.id)}
                          className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                              : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.badge && (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase shrink-0 ${
                                isActive ? 'bg-indigo-500 text-white shadow-sm' : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                            
                            <button
                              type="button"
                              onClick={(e) => togglePinPortal(item.id, e)}
                              title={pinnedPortals.includes(item.id) ? "Unpin from favorites" : "Pin to quick access"}
                              className={`p-1 rounded-lg transition-all ${
                                pinnedPortals.includes(item.id)
                                  ? 'text-amber-400 opacity-90 hover:scale-110'
                                  : 'text-gray-500 hover:text-amber-300 opacity-0 group-hover:opacity-100 hover:bg-white/10'
                              }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${pinnedPortals.includes(item.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Footer Profile & Quick Logout */}
        <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-xs text-cyan-300 shrink-0">
              {scholarName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white truncate block">{scholarName}</span>
              <span className="text-[10px] text-gray-400 truncate block">{user?.email || 'scholar@campus.edu'}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-1.5 rounded-xl hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>
    </>
  );
}


