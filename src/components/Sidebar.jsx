import React, { useState, useMemo } from 'react';
import Realistic3DLogo from './Realistic3DLogo';
import { isGprecPlacementSubdomain, isTpoSubdomain, GPREC_PLACEMENT_PORTALS, isAllowedGprecPlacementTab } from '../utils/placementSubdomain';
import { 
  LayoutDashboard, HelpCircle, FileText, Calendar, Sparkles, 
  GraduationCap, Settings, LogOut, BookOpen, X, UploadCloud, 
  Mail, Trophy, Code, Clock, AlertTriangle, Users, Film, Shield, 
  Target, ClipboardList, ShoppingCart, MessageCircle, Map, 
  Activity, Power, Cpu, ShieldCheck, Rocket, Video, Search, Briefcase,
  Mic, Award, ChevronDown, ChevronRight, Brain, Flame, GitFork, Atom,
  Eye, EyeOff, Sliders, Radio
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, isOpen, onClose, onLogout, onExitApp }) {
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
  const [collapsedSections, setCollapsedSections] = useState({});
  const [showAllPortals, setShowAllPortals] = useState(false);

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

  const toggleSection = (sectionKey) => {
    setCollapsedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

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
    ...(isIntern ? [{
      key: 'intern',
      title: '💼 Intern Workspace Hub',
      items: [
        { id: 'intern-portal', label: 'Intern Workspace', icon: Briefcase, badge: 'Active ⚡' },
        { id: 'internships', label: 'Application Status', icon: Trophy, badge: 'Track' },
      ]
    }] : []),
    ...(isFounder || isTeammate || isFaculty ? [{
      key: 'admin',
      title: '🛡️ Command & Administration',
      items: [
        ...(isFounder ? [{ id: 'founder-portal', label: 'Founder Control', icon: Shield, badge: 'Secure' }] : []),
        ...(isFounder || isTeammate ? [{ id: 'intern-portal', label: 'Interns & Tasks Hub', icon: Users, badge: 'Review 💼' }] : []),
        ...(isTeammate ? [{ id: 'team-portal', label: 'Teammate Portal', icon: Sparkles, badge: 'Team ⚡' }] : []),
        ...(isFaculty ? [{ id: 'faculty-portal', label: 'T&P Faculty', icon: GraduationCap, badge: 'FACULTY 🎓' }] : []),
      ]
    }] : []),
    {
      key: 'academics',
      title: '🎓 Academics & Learning',
      items: [
        { id: 'dashboard', label: 'Dashboard Home', icon: LayoutDashboard },
        { id: 'simulations', label: 'Simulation Portal', icon: Atom, badge: 'Interactive ⚛️' },
        { id: 'courses', label: 'All Courses & Diplomas', icon: BookOpen, badge: 'Diplomas 🎓' },
        { id: 'boloclass', label: 'BoloClass AI Classroom', icon: Brain, badge: 'Voice & Slides 🎙️' },
        { id: 'my-academics', label: 'My Academics (SGPA/CGPA)', icon: GraduationCap, badge: 'NEW 📊' },
        { id: 'doubts', label: 'Doubt Solver (AI 24/7)', icon: HelpCircle, badge: 'AI ⚡' },
        { id: 'learning-hub', label: 'Learning & Video Hub', icon: BookOpen, badge: 'Notes + Vids' },
        { id: 'test-portal', label: 'Tests & Assessment Hub', icon: Target, badge: 'Exams' },
        { id: 'attendance', label: 'Attendance Tracker', icon: ClipboardList },
      ]
    },
    {
      key: 'speakverse_hub',
      title: '🎙️ SpeakVerse™ Flagship Portal',
      items: [
        { id: 'speakverse', label: 'SpeakVerse™ AI', icon: Mic, badge: 'PORTAL 👑' },
      ]
    },
    {
      key: 'career',
      title: '🚀 Placement & Career Hub',
      items: [
        { id: 'ai-commander', label: 'AI Placement Commander™', icon: Cpu, badge: 'NEW 📊' },
        { id: 'tech-pulse', label: 'Tech Pulse & Jobs Radar', icon: Radio, badge: 'LIVE 🔥' },
        { id: 'simulations', label: 'Simulation Portal', icon: Atom, badge: 'Visualizer ⚛️' },
        { id: 'interview', label: 'AI Mock Interview Room', icon: Mic, badge: 'Live AI 🎙️' },
        { id: 'coding-practice', label: 'Code Arena & 30D Java', icon: Code, badge: 'DSA' },
        { id: 'certificates', label: 'Proof-of-Skill Badges', icon: Award, badge: 'LinkedIn 📜' },
        { id: 'intern-portal', label: 'Intern Workspace & Pass', icon: Briefcase, badge: 'Portal 💼' },
        { id: 'internships', label: 'Lumixora Internships', icon: Briefcase, badge: 'Batch 01' },
        { id: 'alumni-referrals', label: 'Alumni & Off-Campus Jobs', icon: Briefcase, badge: 'Referrals' },
        { id: 'career-roadmap', label: 'Career Roadmap', icon: Map },
      ]
    },
    {
      key: 'social',
      title: '🌐 Campus & Opportunities',
      items: [
        { id: 'hackathons', label: 'Hackathons & Internships', icon: Trophy, badge: 'HOT 🏆' },
        { id: 'community', label: 'Class Community & Squads', icon: MessageCircle },
        { id: 'assigned-tasks', label: 'Assigned Curriculum Tasks', icon: ClipboardList },
        { id: 'study-with-me', label: 'Study Arena & Pomodoro', icon: Clock },
      ]
    },
    {
      key: 'support',
      title: '🛠️ Settings & Connect',
      items: [
        { id: 'contribute', label: 'Contribute Notes', icon: UploadCloud },
        { id: 'contact', label: 'Connect with Founder', icon: Mail },
        { id: 'report-bug', label: 'Report Platform Issue', icon: AlertTriangle },
      ]
    }
  ];

  // Search & Personalization filter across sections
  const filteredSections = useMemo(() => {
    let sections = menuSections;

    // Apply personalization filter if user has chosen portals and "showAllPortals" is toggled off
    if (userActivePortals && !showAllPortals) {
      sections = sections.map(sec => ({
        ...sec,
        items: sec.items.filter(item => {
          // Always keep dashboard, community, and support
          if (item.id === 'dashboard' || item.id === 'community' || sec.key === 'support' || sec.key === 'admin' || sec.key === 'intern') {
            return true;
          }
          return userActivePortals.has(item.id);
        })
      })).filter(sec => sec.items.length > 0);
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
  }, [menuSections, menuSearchQuery, userActivePortals, showAllPortals]);

  const handleTabClick = (tabId) => {
    if (isGprecSubdomain && !isAllowedGprecPlacementTab(tabId)) {
      setActiveTab('ai-commander');
    } else {
      setActiveTab(tabId);
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
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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

          {/* Show All Portals Toggle (when personalized filter is active) */}
          {userActivePortals && (
            <div className="flex items-center justify-between px-1 pt-0.5">
              <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                {showAllPortals ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-brand-teal" />}
                {showAllPortals ? 'All Portals' : 'Tailored Portals'}
              </span>
              <button
                type="button"
                onClick={() => setShowAllPortals(prev => !prev)}
                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  showAllPortals 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' 
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {showAllPortals ? 'Hide Extra' : 'Show All'}
              </button>
            </div>
          )}
        </div>

        {/* Navigation Categories & Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {filteredSections.map(sec => {
            const isCollapsed = collapsedSections[sec.key];
            return (
              <div key={sec.key} className="space-y-1.5 pt-1">
                <div 
                  onClick={() => toggleSection(sec.key)}
                  className="flex items-center justify-between px-2 py-1 text-xs font-black uppercase tracking-wider text-gray-200 hover:text-cyan-300 cursor-pointer transition-colors group select-none"
                >
                  <span className="font-extrabold tracking-wide text-[11px] text-gray-300 group-hover:text-cyan-300 transition-colors">
                    {sec.title}
                  </span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-cyan-300 transition-transform stroke-[2.5]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-cyan-300 transition-transform stroke-[2.5]" />
                  )}
                </div>

                {!isCollapsed && (
                  <div className="space-y-1 pt-0.5">
                    {sec.items.map(item => {
                      const IconComp = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTabClick(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                              : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {item.badge && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase shrink-0 ${
                              isActive ? 'bg-cyan-400 text-black' : 'bg-white/10 text-cyan-300'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
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


