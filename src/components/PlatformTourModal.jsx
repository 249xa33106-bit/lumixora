import React, { useState } from 'react';
import { 
  Sparkles, Bot, Award, Code2, HelpCircle, BookOpen, 
  CheckSquare, Users, ArrowRight, ArrowLeft, 
  X, CheckCircle2, Compass, Play
} from 'lucide-react';

export const TOUR_STEPS = [
  {
    id: 'welcome',
    tab: 'dashboard',
    title: 'Welcome to Lumixora OS',
    subtitle: 'Your AI Academic & Placement Operating System',
    badge: '🌟 Getting Started',
    badgeColor: 'bg-brand-teal/20 text-brand-teal border-brand-teal/30',
    icon: Compass,
    iconColor: 'text-brand-teal',
    bgGlow: 'from-brand-teal/20 via-brand-purple/10 to-transparent',
    description: 'Lumixora is an all-in-one student platform designed specifically for engineering scholars to master academics, crack placements, and collaborate seamlessly.',
    highlights: [
      '⚡ Track your daily learning streaks, XP, and campus leaderboard ranks.',
      '🎯 Access your entire curriculum, AI tools, and placement prep in one place.',
      '🚀 Built for high performance, continuous progress, and real-time collaboration.'
    ]
  },
  {
    id: 'future-twin',
    tab: 'future-twin',
    title: 'AI Placement Commander & Twin',
    subtitle: 'Role-Weighted Skill Engine & Mock Interviews',
    badge: '🤖 Placement Engine',
    badgeColor: 'bg-brand-purple/20 text-brand-purple border-brand-purple/30',
    icon: Bot,
    iconColor: 'text-brand-purple',
    bgGlow: 'from-brand-purple/20 via-brand-pink/10 to-transparent',
    description: 'Simulate technical and HR interviews, analyze your ATS resume, and track role-weighted telemetry across 8 core engineering dimensions.',
    highlights: [
      '📊 Real-time skill telemetry across DSA, Coding, Aptitude, Core CS, and Resume.',
      '🎙️ Voice & text AI mock interviews with instant rubrics and actionable feedback.',
      '📄 ATS Resume Analyzer with job-fit scoring and keyword optimization.'
    ]
  },
  {
    id: 'test-portal',
    tab: 'test-portal',
    title: 'Tests & Assignments Hub',
    subtitle: 'Departmental Assessments & Homework',
    badge: '📝 Assessment Portal',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: Award,
    iconColor: 'text-emerald-400',
    bgGlow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    description: 'Attempt timed departmental tests, submit homework assignments, and view detailed answer keys, percentile analytics, and section rankings.',
    highlights: [
      '🎯 Attempt official tests and homework assignments targeted to your branch and semester.',
      '📈 View live scorecards, peer percentiles, and correct answer breakdowns.',
      '🏆 Compete on semester and branch-level performance leaderboards.'
    ]
  },
  {
    id: 'coding-practice',
    tab: 'coding-practice',
    title: 'Coding Practice & IDE',
    subtitle: 'DSA Challenges & Multi-Language Editor',
    badge: '💻 Code Lab',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Code2,
    iconColor: 'text-blue-400',
    bgGlow: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    description: 'Solve 200+ curated Data Structures and Algorithms problems with an in-browser Monaco code editor supporting C, C++, Java, Python, and JavaScript.',
    highlights: [
      '⚡ Multi-language compiler with custom testcase execution and complexity analysis.',
      '🧠 AI Code Assistant for hints, optimization tips, and line-by-line debugging.',
      '🔥 Earn XP and level up your coding rank as you solve harder problem tiers.'
    ]
  },
  {
    id: 'doubts',
    tab: 'doubts',
    title: 'Scholar Doubt Solving Center',
    subtitle: '24/7 AI Copilot & Faculty Resolution',
    badge: '❓ Doubt Clearance',
    badgeColor: 'bg-brand-pink/20 text-brand-pink border-brand-pink/30',
    icon: HelpCircle,
    iconColor: 'text-brand-pink',
    bgGlow: 'from-brand-pink/20 via-purple-500/10 to-transparent',
    description: 'Never get stuck on a concept. Ask any academic or coding question and receive instant, step-by-step mathematical and conceptual breakdowns.',
    highlights: [
      '⚡ Instant 24/7 AI explanation with code snippets, formulas, and visual diagrams.',
      '👨‍🏫 Direct verification and answers from department faculty members.',
      '🔍 Searchable archive of verified past doubts and solutions.'
    ]
  },
  {
    id: 'notes',
    tab: 'notes',
    title: 'Curated Notes & Learning Hub',
    subtitle: 'Syllabus, Textbooks & Video Playlists',
    badge: '📚 Academic Hub',
    badgeColor: 'bg-amber-400/20 text-amber-400 border-amber-400/30',
    icon: BookOpen,
    iconColor: 'text-amber-400',
    bgGlow: 'from-amber-400/20 via-orange-500/10 to-transparent',
    description: 'Access branch, semester, and subject-filtered handwritten notes, PPT slides, standard textbooks, and curated YouTube lecture playlists.',
    highlights: [
      '📑 Comprehensive study materials categorized from Sem 1 through Sem 8.',
      '📥 High-speed PDF viewer with direct downloads and offline study options.',
      '🤝 Contribute your own notes to earn community badges and rewards.'
    ]
  },
  {
    id: 'tasks',
    tab: 'tasks',
    title: 'Tasks & Exam Countdown',
    subtitle: 'Daily Study Planner & Attendance Tracker',
    badge: '📅 Productivity',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    icon: CheckSquare,
    iconColor: 'text-cyan-400',
    bgGlow: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    description: 'Organize your semester goals, track assignment deadlines with live exam countdown timers, and manage attendance percentages safely above thresholds.',
    highlights: [
      '⏳ Live countdown timers for mid-term exams and final semester examinations.',
      '✅ Integrated Pomodoro study timer with focus analytics and study hours logging.',
      '📊 Attendance calculator indicating how many classes you can afford to miss or need to attend.'
    ]
  },
  {
    id: 'clubs',
    tab: 'clubs',
    title: 'College Clubs, Hackathons & Community',
    subtitle: 'Campus Societies, Events & Marketplace',
    badge: '🏛️ Campus Life',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: Users,
    iconColor: 'text-purple-400',
    bgGlow: 'from-purple-500/20 via-pink-500/10 to-transparent',
    description: 'Discover official student clubs, register for upcoming hackathons and cultural events, join branch class groups, and explore peer buy/sell marketplace.',
    highlights: [
      '⚡ View and join technical, coding, and cultural student societies.',
      '🏆 Instant Google Form registration for campus hackathons and competitions.',
      '💬 Class group discussions and student marketplace for textbooks and supplies.'
    ]
  }
];

export default function PlatformTourModal({ isOpen, onClose, onNavigateTab }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const IconComponent = step.icon;
  const isFirst = currentStep === 0;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (!isLast) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      if (onNavigateTab && TOUR_STEPS[nextIdx].tab) {
        onNavigateTab(TOUR_STEPS[nextIdx].tab);
      }
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      if (onNavigateTab && TOUR_STEPS[prevIdx].tab) {
        onNavigateTab(TOUR_STEPS[prevIdx].tab);
      }
    }
  };

  const handleJumpToTab = (tabName) => {
    if (onNavigateTab && tabName) {
      onNavigateTab(tabName);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f0f18] border border-white/15 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Glow Header */}
        <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${step.bgGlow} pointer-events-none transition-all duration-500`} />

        {/* Top Bar */}
        <div className="relative z-10 px-6 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${step.badgeColor} flex items-center gap-1.5 shadow-sm`}>
              <Sparkles className="w-3.5 h-3.5" />
              {step.badge}
            </span>
            <span className="text-xs text-gray-400 font-bold">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Skip Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="relative z-10 px-6 py-2">
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-brand-teal via-brand-purple to-brand-pink h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 px-6 py-4 flex-1 space-y-5">
          {/* Header Title with Icon */}
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner ${step.iconColor}`}>
              <IconComponent className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {step.title}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-gray-400 mt-0.5">
                {step.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed bg-white/[0.03] p-3.5 rounded-2xl border border-white/5">
            {step.description}
          </p>

          {/* Key Highlights */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Key Capabilities:
            </h4>
            <div className="space-y-2">
              {step.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 p-6 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quick Preview Button */}
          <button
            onClick={() => handleJumpToTab(step.tab)}
            className="text-xs text-brand-teal hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-brand-teal" />
            <span>Switch to this Portal Now</span>
          </button>

          {/* Nav Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-purple text-black font-black text-xs transition-all hover:opacity-95 shadow-lg shadow-brand-teal/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLast ? 'Finish & Explore Platform' : 'Next Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
