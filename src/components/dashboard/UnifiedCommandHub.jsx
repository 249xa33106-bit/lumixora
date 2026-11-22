import React, { useState, useMemo } from 'react';
import { 
  Search, ArrowRight, Sparkles, BookOpen, FileText, Bot, 
  Code, Award, UserCheck, HelpCircle, Briefcase, Zap, 
  Rocket, Video, GraduationCap, Cpu, Layers, Users, ShoppingCart, 
  Map, Gift, ShieldCheck, Mail, Bug, Terminal, FileCheck, CheckCircle2,
  TrendingUp, Radio, Sliders, ChevronRight
} from 'lucide-react';

export const ALL_SYSTEM_PORTALS = [
  // ─── Track 1: Academics & Exams (12) ───
  {
    id: 'previous-papers',
    label: 'Previous Papers & AI Predictor',
    track: 'academics',
    trackLabel: 'Academics',
    desc: 'University previous question papers archive & 2026 AI 70M model forecast.',
    icon: FileText,
    badge: '2026 Forecast',
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    iconColor: 'from-cyan-500 to-blue-600',
    popular: true,
  },
  {
    id: 'learning-hub',
    label: 'Learning Hub & Video Lectures',
    track: 'academics',
    trackLabel: 'Academics',
    desc: '102 verified branch syllabi with direct Drive preview notes & video lectures.',
    icon: BookOpen,
    badge: '102 Subjects',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    iconColor: 'from-emerald-500 to-teal-600',
    popular: true,
  },
  {
    id: 'notes',
    label: 'Curated Notes Platform',
    track: 'academics',
    trackLabel: 'Academics',
    desc: 'Subject-wise high yield study notes, hand-written unit summaries, and cheatsheets.',
    icon: FileText,
    badge: 'Verified Notes',
    badgeColor: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    iconColor: 'from-teal-600 to-emerald-600',
    popular: true,
  },
  {
    id: 'boloclass',
    label: 'BoloClass AI Voice Classroom',
    track: 'academics',
    trackLabel: 'Academics',
    desc: 'Interactive AI voice-guided lectures and personalized concept tutoring.',
    icon: Video,
    badge: 'AI Voice',
    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    iconColor: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'courses',
    label: 'Courses & Semester Subjects',
    track: 'academics',
    trackLabel: 'Academics',
    desc: 'Curriculum-aligned masterclasses, diplomas, and unit-by-unit roadmaps.',
    icon: GraduationCap,
    badge: 'Curriculum',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    iconColor: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'doubts',
    label: 'AI Doubt Solver 24/7',
    track: 'academics',
    trackLabel: 'Academics',
    desc: 'Instant step-by-step academic doubt resolution with formula parsing.',
    icon: HelpCircle,
    badge: 'Instant AI',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    iconColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 'test-portal',
    label: 'Tests & Assessment Hub',
    track: 'academics',
    trackLabel: 'Academics',
    desc: 'Chapter-wise MCQ assessments, timed tests, and detailed diagnostic analytics.',
    icon: CheckCircle2,
    badge: 'Exams',
    badgeColor: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    iconColor: 'from-teal-500 to-emerald-600',
  },
  {
    id: 'tasks',
    label: 'Task Manager & Study Sprints',
    track: 'academics',
    trackLabel: 'Academics',
    desc: 'Organize study sprints, track milestones, and maintain daily academic momentum.',
    icon: Sliders,
    badge: 'Productivity',
    badgeColor: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    iconColor: 'from-violet-500 to-indigo-600',
  },
  {
    id: 'simulations',
    label: 'Physics & Circuit Simulations',
    track: 'academics',
    trackLabel: 'Academics',
    desc: 'Interactive 3D laboratory simulations for ECE, EEE, Mech, and Civil engineering.',
    icon: Cpu,
    badge: '3D Labs',
    badgeColor: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    iconColor: 'from-pink-500 to-rose-600',
  },
  {
    id: 'attendance',
    label: 'Smart Attendance Tracker',
    track: 'academics',
    trackLabel: 'Academics',
    desc: 'Keep track of college attendance and stay safely above the 75% threshold.',
    icon: UserCheck,
    badge: '75% Guard',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    iconColor: 'from-emerald-500 to-cyan-600',
  },
  {
    id: 'contribute',
    label: 'Contribute Notes & Papers',
    track: 'academics',
    trackLabel: 'Academics',
    desc: 'Share verified study notes, previous mid-exam papers, and earn campus credits.',
    icon: Layers,
    badge: 'Community',
    badgeColor: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    iconColor: 'from-slate-600 to-slate-800',
  },

  // ─── Track 2: Placement & Coding (11) ───
  {
    id: 'ai-commander',
    label: 'AI Placement Commander™',
    track: 'placement',
    trackLabel: 'Placement',
    desc: 'Full placement operating system with dream role matching and readiness radar.',
    icon: Briefcase,
    badge: 'Top Suite',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    iconColor: 'from-purple-600 to-indigo-600',
    popular: true,
  },
  {
    id: 'coding-practice',
    label: 'Coding Arena & 30D Java',
    track: 'placement',
    trackLabel: 'Placement',
    desc: 'DSA coding practice, 30 Days of Java sprint, and company coding challenge sets.',
    icon: Code,
    badge: 'DSA Arena',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    iconColor: 'from-blue-600 to-cyan-600',
    popular: true,
  },
  {
    id: 'code-editor',
    label: 'Live AI Code Editor',
    track: 'placement',
    trackLabel: 'Placement',
    desc: 'In-browser multi-language coding workspace with compiler and AI error explanation.',
    icon: Terminal,
    badge: 'Web IDE',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    iconColor: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'company-papers',
    label: 'Company Placement Papers',
    track: 'placement',
    trackLabel: 'Placement',
    desc: 'Real exam papers and solved coding questions for TCS, Amazon, Infosys, Accenture, Zoho.',
    icon: FileCheck,
    badge: 'Top Recruiter',
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    iconColor: 'from-cyan-600 to-blue-600',
    popular: true,
  },
  {
    id: 'interview',
    label: 'AI Mock Interview Room',
    track: 'placement',
    trackLabel: 'Placement',
    desc: 'Real-time AI voice & camera interview simulations with instant scoring & feedback.',
    icon: Bot,
    badge: 'Voice AI',
    badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    iconColor: 'from-rose-500 to-pink-600',
  },
  {
    id: 'aptitude-arena',
    label: 'Aptitude & Reasoning Arena',
    track: 'placement',
    trackLabel: 'Placement',
    desc: 'Quantitative, logical reasoning, and verbal aptitude mock sets with explanations.',
    icon: Zap,
    badge: 'Speed Drills',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    iconColor: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'resume',
    label: 'AI Resume Builder & ATS Scorer',
    track: 'placement',
    trackLabel: 'Placement',
    desc: 'Build single-page tech resumes with real-time ATS scoring and instant PDF download.',
    icon: FileText,
    badge: 'ATS 90+',
    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    iconColor: 'from-indigo-600 to-blue-600',
  },
  {
    id: 'tech-pulse',
    label: 'Tech Pulse & Hiring Radar',
    track: 'placement',
    trackLabel: 'Placement',
    desc: 'Live industry tech hiring radar, salary insights, and off-campus drive alerts.',
    icon: Radio,
    badge: 'Live Radar',
    badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    iconColor: 'from-sky-500 to-blue-600',
  },
  {
    id: 'speakverse',
    label: 'SpeakVerse™ Communication AI',
    track: 'placement',
    trackLabel: 'Placement',
    desc: 'Master professional English fluency, HR conversation etiquette, and accent training.',
    icon: Sparkles,
    badge: 'Soft Skills',
    badgeColor: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    iconColor: 'from-pink-500 to-purple-600',
  },
  {
    id: 'certificates',
    label: 'Proof-of-Skill Certificates',
    track: 'placement',
    trackLabel: 'Placement',
    desc: 'Earn tamper-proof QR-verified internship and skill credentials for LinkedIn.',
    icon: ShieldCheck,
    badge: 'Verified',
    badgeColor: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    iconColor: 'from-teal-500 to-cyan-600',
  },
  {
    id: 'alumni-referrals',
    label: 'Alumni Referral Bridge',
    track: 'placement',
    trackLabel: 'Placement',
    desc: 'Direct job openings and referral bridges connecting students to working alumni.',
    icon: Users,
    badge: 'Referrals',
    badgeColor: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    iconColor: 'from-violet-600 to-purple-700',
  },

  // ─── Track 3: Build & Internships (6) ───
  {
    id: 'projects',
    label: 'Community Project Showcase',
    track: 'build',
    trackLabel: 'Build',
    desc: 'Discover, showcase, and collaborate on open-source student engineering projects.',
    icon: Rocket,
    badge: 'Showcase',
    badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    iconColor: 'from-rose-500 to-orange-500',
    popular: true,
  },
  {
    id: 'hackathons',
    label: 'Hackathons & Contests',
    track: 'build',
    trackLabel: 'Build',
    desc: 'National and campus hackathons, pitch decks, coding competitions, and prizes.',
    icon: Award,
    badge: 'Competitions',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    iconColor: 'from-amber-500 to-rose-500',
  },
  {
    id: 'internships',
    label: 'Lumixora Internships',
    track: 'build',
    trackLabel: 'Build',
    desc: 'Work on production EdTech & software projects with official mentorship and stipends.',
    icon: Briefcase,
    badge: 'Experience',
    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    iconColor: 'from-indigo-600 to-purple-600',
  },
  {
    id: 'intern-portal',
    label: 'Intern Workspace & Sprints',
    track: 'build',
    trackLabel: 'Build',
    desc: 'Weekly sprint task submissions, peer reviews, code repos, and completion badges.',
    icon: Sliders,
    badge: 'Workspace',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    iconColor: 'from-purple-600 to-indigo-700',
  },
  {
    id: 'career-roadmap',
    label: 'Career Roadmap & Target Roles',
    track: 'build',
    trackLabel: 'Build',
    desc: 'Personalized 4-year technical trajectory mapped to your dream engineering career.',
    icon: Map,
    badge: 'Roadmap',
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    iconColor: 'from-cyan-500 to-teal-600',
  },
  {
    id: 'student-offers',
    label: 'Student Perks & Dev Pack',
    track: 'build',
    trackLabel: 'Build',
    desc: 'Free developer tools, cloud credits, GitHub student developer pack, and perks.',
    icon: Gift,
    badge: 'Free Tools',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    iconColor: 'from-emerald-500 to-teal-500',
  },

  // ─── Track 4: Campus, Community & Support (7) ───
  {
    id: 'clubs',
    label: 'Student Clubs & CAD Societies',
    track: 'campus',
    trackLabel: 'Campus',
    desc: 'Explore technical clubs, robotics squads, CAD workshops, and campus chapters.',
    icon: Users,
    badge: 'Clubs',
    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    iconColor: 'from-indigo-500 to-blue-600',
    popular: true,
  },
  {
    id: 'marketplace',
    label: 'Campus P2P Marketplace',
    track: 'campus',
    trackLabel: 'Campus',
    desc: 'Buy and sell engineering drafters, scientific calculators, and reference textbooks.',
    icon: ShoppingCart,
    badge: 'Campus P2P',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    iconColor: 'from-amber-500 to-orange-500',
  },
  {
    id: 'our-team',
    label: 'Core Team & Leadership',
    track: 'campus',
    trackLabel: 'Leadership',
    desc: 'Meet the student innovators, developers, and engineers building Lumixora.',
    icon: Award,
    badge: 'Team',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    iconColor: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'contact',
    label: 'Connect with Founder',
    track: 'campus',
    trackLabel: 'Support',
    desc: 'Direct communication channel to Founder Shaik Sowban and platform leadership.',
    icon: Mail,
    badge: 'Direct',
    badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    iconColor: 'from-rose-500 to-pink-600',
  },
  {
    id: 'report-bug',
    label: 'Report Platform Issue',
    track: 'campus',
    trackLabel: 'Support',
    desc: 'Submit bug reports, feature requests, or UI suggestions directly to our team.',
    icon: Bug,
    badge: '24h Fix',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    iconColor: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'team-workspace',
    label: 'Campus Team Workspace',
    track: 'campus',
    trackLabel: 'Team',
    desc: 'Collaborative management console for student campus ambassadors and core teams.',
    icon: Layers,
    badge: 'Ambassadors',
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    iconColor: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'founder-portal',
    label: 'Founder & Admin Command',
    track: 'campus',
    trackLabel: 'Admin',
    desc: 'Super admin management console for university licenses, submissions, and metrics.',
    icon: ShieldCheck,
    badge: 'Admin Only',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    iconColor: 'from-amber-600 to-orange-700',
  },
];

export default function UnifiedCommandHub({ onNavigateTab, onOpenProveModal }) {
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tracks = [
    { id: 'all', label: 'All Portals', count: ALL_SYSTEM_PORTALS.length, icon: Sparkles },
    { id: 'academics', label: '🎯 Academics', count: ALL_SYSTEM_PORTALS.filter(p => p.track === 'academics').length, icon: BookOpen },
    { id: 'placement', label: '💼 Placement & Coding', count: ALL_SYSTEM_PORTALS.filter(p => p.track === 'placement').length, icon: Briefcase },
    { id: 'build', label: '🚀 Build & Projects', count: ALL_SYSTEM_PORTALS.filter(p => p.track === 'build').length, icon: Rocket },
    { id: 'campus', label: '👥 Campus & Life', count: ALL_SYSTEM_PORTALS.filter(p => p.track === 'campus').length, icon: Users },
  ];

  const filteredPortals = useMemo(() => {
    let list = ALL_SYSTEM_PORTALS;
    if (selectedTrack !== 'all') {
      list = list.filter(p => p.track === selectedTrack);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.label.toLowerCase().includes(q) || 
        p.desc.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.badge.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedTrack, searchQuery]);

  return (
    <div className="w-full space-y-6 my-2 animate-fade-in">
      {/* ─── SECTION HEADER & 4-TRACK SWITCHER ─── */}
      <div className="bg-[#0b0f19]/90 dark:bg-slate-900/90 border border-white/10 rounded-3xl p-4 sm:p-6 backdrop-blur-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-gradient-to-b from-blue-500 to-purple-600"></span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Lumixora Command Center</span>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {ALL_SYSTEM_PORTALS.length} Integrated Portals
                </span>
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1 pl-4">
              Everything in one unified flow. Click any portal to launch instantly with zero navigation friction.
            </p>
          </div>

          {/* Quick Search & Prove Action */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {onOpenProveModal && (
              <button
                onClick={onOpenProveModal}
                className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                title="Verify Proof-of-Skill & QR Credentials"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Trust Proofs</span>
              </button>
            )}

            <div className="relative min-w-[220px] sm:min-w-[260px] flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find any portal (e.g. Java, TCS, Notes, Resume)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Modern 4-Track Segmented Buttons ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-white/5">
          {tracks.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTrack === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTrack(t.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                <span>{t.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'
                }`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── UNIFIED GLASSMORPHIC PORTAL GRID (ALL 36 PORTALS) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredPortals.map((portal) => {
          const Icon = portal.icon;
          return (
            <div
              key={portal.id}
              onClick={() => onNavigateTab && onNavigateTab(portal.id)}
              className="group p-4 rounded-3xl bg-[#0c101d]/90 hover:bg-[#12182e]/95 border border-white/10 hover:border-indigo-500/40 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Top ambient glow on hover */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />

              <div className="space-y-3 relative z-10">
                {/* Header: Icon + Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${portal.iconColor} p-0.5 shadow-md flex items-center justify-center shrink-0`}>
                    <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${portal.badgeColor}`}>
                    {portal.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    <span>{portal.label}</span>
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed mt-1 line-clamp-2">
                    {portal.desc}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-white transition-colors relative z-10">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-black">
                  {portal.trackLabel}
                </span>
                <span className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Launch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPortals.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10 text-gray-400 space-y-2">
          <p className="text-sm font-bold text-white">No portals match "{searchQuery}"</p>
          <p className="text-xs">Try searching for keywords like "Java", "Notes", "TCS", "Interview", or "Resume".</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
