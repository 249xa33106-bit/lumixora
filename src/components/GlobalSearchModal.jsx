import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, X, Sparkles, BookOpen, Code, GraduationCap, 
  HelpCircle, Trophy, Briefcase, Mic, Film, Map, 
  ClipboardList, ArrowRight, CornerDownLeft, Clock,
  Layers, ChevronRight, Hash, Compass
} from 'lucide-react';
import { useData } from '../context/DataContext';

const SEARCHABLE_PORTALS = [
  { id: 'dashboard', title: 'Dashboard', desc: 'Main academic home, stats & daily roadmap', category: 'General', icon: Sparkles, keywords: ['home', 'overview', 'stats', 'analytics'] },
  { id: 'my-academics', title: 'My Academics', desc: 'Track SGPA, CGPA, semester marks & attendance', category: 'Academics', icon: GraduationCap, badge: 'NEW', keywords: ['marks', 'cgpa', 'sgpa', 'semester', 'grades', 'subjects', 'attendance'] },
  { id: 'doubts', title: 'Doubt Solver', desc: 'Instant AI & mentor step-by-step LaTeX academic solutions', category: 'Academics', icon: HelpCircle, badge: 'AI 24/7', keywords: ['questions', 'help', 'math', 'derivation', 'homework', 'equations'] },
  { id: 'learning-hub', title: 'Learning & Video Hub', desc: 'Video lectures, enhanced AI study notes & PPTs', category: 'Academics', icon: BookOpen, keywords: ['notes', 'lectures', 'videos', 'courses', 'curriculum'] },
  { id: 'test-portal', title: 'Test & Assessment Portal', desc: 'Practice online tests, quizzes & placement evaluations', category: 'Academics', icon: ClipboardList, keywords: ['exams', 'quizzes', 'mock tests', 'assessments'] },
  { id: 'attendance', title: 'My Attendance', desc: 'Subject-wise class attendance & safety thresholds', category: 'Academics', icon: ClipboardList, keywords: ['bunk', 'classes', 'percentage', 'threshold'] },
  { id: 'coding-practice', title: 'Code Arena & Practice', desc: '30-Day Java/Python track, algorithms & DSA challenges', category: 'Coding', icon: Code, keywords: ['dsa', 'java', 'python', 'leetcode', 'compiler', 'problems'] },
  { id: 'ai-commander', title: 'AI Placement Commander™', desc: 'Target company readiness, syllabus & recruitment drives', category: 'Career', icon: Briefcase, badge: 'HOT', keywords: ['jobs', 'placements', 'tcs', 'infosys', 'amazon', 'interviews'] },
  { id: 'interview', title: 'AI Mock Interview Room', desc: 'Real-time voice speech AI technical & HR mock interviews', category: 'Career', icon: Mic, badge: 'Live AI', keywords: ['speech', 'voice', 'mock interview', 'hr', 'technical'] },
  { id: 'certificates', title: 'Proof-of-Skill Badges', desc: 'Verified academic badges & LinkedIn certificates', category: 'Career', icon: Trophy, keywords: ['certs', 'credentials', 'proof', 'linkedin'] },
  { id: 'alumni-referrals', title: 'Alumni & Referrals', desc: 'Connect with verified campus alumni for off-campus jobs', category: 'Career', icon: Briefcase, keywords: ['networking', 'referrals', 'seniors', 'jobs'] },
  { id: 'future-twin', title: 'AI Future Twin™', desc: 'Predictive career trajectory & AI persona simulator', category: 'Career', icon: Sparkles, keywords: ['simulation', 'twin', 'career path', 'prediction'] },
  { id: 'hackathons', title: 'Hackathons & Internships', desc: 'Curated national hackathons, bounties & paid internships', category: 'Opportunities', icon: Trophy, keywords: ['competitions', 'internships', 'projects', 'prizes'] },
  { id: 'career-roadmap', title: 'Career Roadmap', desc: 'Year-by-year engineering milestones & target skills', category: 'Career', icon: Map, keywords: ['guide', 'steps', 'curriculum', 'plan'] },
  { id: 'community', title: 'Class Community & Squads', desc: 'Study groups, peer discussion & resource sharing', category: 'Social', icon: Compass, keywords: ['chat', 'groups', 'peers', 'friends'] },
  { id: 'study-with-me', title: 'Study Arena & Pomodoro', desc: 'Live focus timers, Lo-Fi study beats & session tracking', category: 'Tools', icon: Clock, keywords: ['focus', 'pomodoro', 'timer', 'music'] },
];

export default function GlobalSearchModal({ isOpen, onClose, onSelectTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const inputRef = useRef(null);
  const { doubts } = useData() || {};

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        e.stopPropagation();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, onClose]);

  const filteredResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    
    const matchedPortals = SEARCHABLE_PORTALS.filter(item => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.keywords && item.keywords.some(k => k.includes(q)))
      );
    });

    const matchedDoubts = (doubts || []).filter(d => {
      if (selectedCategory !== 'All' && selectedCategory !== 'Doubts') return false;
      if (!q) return false;
      return (
        (d.topic && d.topic.toLowerCase().includes(q)) ||
        (d.tag && d.tag.toLowerCase().includes(q))
      );
    }).slice(0, 5);

    return { portals: matchedPortals, doubts: matchedDoubts };
  }, [searchQuery, selectedCategory, doubts]);

  const totalResultsCount = filteredResults.portals.length + filteredResults.doubts.length;

  const handleSelectPortal = (portalId) => {
    if (onSelectTab) onSelectTab(portalId);
    onClose();
  };

  const handleSelectDoubt = () => {
    if (onSelectTab) onSelectTab('doubts');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xl flex items-start justify-center p-4 pt-16 sm:pt-24 animate-fade-in font-sans cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div 
        className="relative w-full max-w-2xl bg-[#090e1a]/95 border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden z-10 flex flex-col max-h-[80vh] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 bg-black/40">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }
            }}
            placeholder="Search portals, marks, doubts, coding tracks, notes..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              title="Clear text"
              className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            title="Close Search (ESC)"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-300 border border-white/10 hover:border-red-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm group"
          >
            <kbd className="text-[10px] font-mono group-hover:text-red-300">ESC</kbd>
            <X className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-300" />
          </button>
        </div>

        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
          {['All', 'Academics', 'Coding', 'Career', 'Opportunities', 'Doubts'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                  : 'bg-white/5 text-gray-400 hover:text-white border-white/5 hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 custom-scrollbar">
          {filteredResults.portals.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider px-2 block">
                Platform Portals & Tools ({filteredResults.portals.length})
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {filteredResults.portals.map(item => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectPortal(item.id)}
                      className="p-3 rounded-2xl bg-white/[0.02] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 truncate mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-gray-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-2">
                        <span className="text-[10px] font-medium hidden sm:inline">Jump</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredResults.doubts.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider px-2 block">
                Saved Doubt Solutions ({filteredResults.doubts.length})
              </span>
              <div className="space-y-1.5">
                {filteredResults.doubts.map(d => (
                  <div
                    key={d.id}
                    onClick={handleSelectDoubt}
                    className="p-3 rounded-2xl bg-purple-950/20 hover:bg-purple-900/30 border border-purple-500/30 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 shrink-0">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white group-hover:text-purple-300 truncate block">
                          {d.topic}
                        </span>
                        <span className="text-[10px] text-purple-300 font-medium">
                          {d.tag || 'Academic'} • {d.status || 'Resolved'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-purple-400 shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalResultsCount === 0 && (
            <div className="text-center p-8 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
              <Search className="w-8 h-8 text-gray-600 mx-auto opacity-50" />
              <h4 className="text-xs font-bold text-gray-300">No matching portal or doubt found</h4>
              <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                Try searching for "marks", "attendance", "calculus", "java", "interview", or "placements".
              </p>
            </div>
          )}
        </div>

        <div className="p-3 bg-black/50 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400 px-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-[9px]">↵</kbd> Select
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-all cursor-pointer text-gray-300"
            >
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-[9px]">ESC</kbd> Close
            </button>
          </div>
          <span className="text-cyan-400 font-semibold text-[10px]">
            LUMIXORA Academic Search Engine
          </span>
        </div>
      </div>
    </div>
  );
}
