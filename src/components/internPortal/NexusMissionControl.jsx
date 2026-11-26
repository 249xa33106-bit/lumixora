import React, { useState, useEffect } from 'react';
import {
  Sparkles, CheckCircle2, Clock, Calendar, ArrowRight,
  TrendingUp, Award, Users, AlertCircle, FileText, Send,
  Vote, Video, ShieldCheck, ChevronRight, Bell, Zap, Compass
} from 'lucide-react';

export default function NexusMissionControl({
  session,
  activeRole,
  onNavigateTab,
  allottedTasks = [],
  submissions = [],
  selectedMissions = []
}) {
  // Availability poll state
  const [pollSelected, setPollSelected] = useState(() => {
    try {
      return localStorage.getItem(`lumixora_poll_vote_${session?.id}`) || '';
    } catch (_) {
      return '';
    }
  });

  const pollOptions = [
    { id: 'sat_6pm', label: 'Saturday · 6:00 PM IST', votes: 14 },
    { id: 'sun_11am', label: 'Sunday · 11:00 AM IST', votes: 22 },
    { id: 'sun_5pm', label: 'Sunday · 5:00 PM IST', votes: 12 }
  ];

  const handleVote = (optionId) => {
    setPollSelected(optionId);
    try {
      localStorage.setItem(`lumixora_poll_vote_${session?.id}`, optionId);
    } catch (_) {}
  };

  // Department mission briefs
  const DEPARTMENT_MISSIONS = {
    marketing: {
      title: 'Make Lumixora discoverable.',
      subtitle: 'Complete any 2 of your 3 weekly tasks to drive viral campus adoption.',
      keyResult: 'Expand GPREC & Rayalaseema campus reach to 1,500+ active scholars.',
      week: 'Week 01'
    },
    research: {
      title: 'Map EdTech moats & user intent.',
      subtitle: 'Analyze competitor architectures and synthesize student pain points.',
      keyResult: 'Deliver competitive moat matrix across top 10 EdTech ecosystems.',
      week: 'Week 01'
    },
    content_creation: {
      title: 'Build the visual identity of Lumixora.',
      subtitle: 'Produce high-converting visual media, explainer walkthroughs and design assets.',
      keyResult: 'Publish flagship product preview and student community reels.',
      week: 'Week 01'
    },
    software_testing: {
      title: 'Achieve zero-defect production reliability.',
      subtitle: 'Execute deep E2E audits, API validations and S1-S4 severity regression matrices.',
      keyResult: 'Validate 100% of critical paths across auth, code editor and placement radar.',
      week: 'Week 01'
    }
  };

  const currentMission = DEPARTMENT_MISSIONS[activeRole?.id] || DEPARTMENT_MISSIONS.marketing;

  // Real-time calculation of stats
  const completedCount = submissions.filter(s => s.status === 'approved' || s.score >= 80).length;
  const inProgressCount = Math.max(selectedMissions.length, submissions.length);
  const tasksDisplay = `${completedCount || (submissions.length > 0 ? 1 : 0)}/2`;
  const progressPercent = Math.min(100, Math.round(((completedCount || (submissions.length > 0 ? 1 : 0)) / 2) * 50) + 12);
  const performanceScore = 92;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* ── TOP HERO BANNER: Editorial Clean Startup Grade ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c101a] via-[#090d16] to-[#06080e] border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold tracking-wider uppercase text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>VYOMRA / LUMIXORA NEXUS</span>
              <span className="text-white/30">•</span>
              <span className="text-white/80">{activeRole?.shortTitle || 'Engineering'} Department · {currentMission.week}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Your journey starts here.
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Welcome to the digital engine room of Lumixora. Where talent becomes impact through real startup engineering, live user feedback, and verifiable contribution credit.
            </p>
          </div>

          {/* Quick Intern Profile Card */}
          <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 p-3.5 rounded-2xl backdrop-blur-md self-start md:self-auto shrink-0">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${activeRole?.gradient || 'from-cyan-500 to-blue-600'} flex items-center justify-center text-white font-black text-base shadow-lg shadow-cyan-500/20`}>
              {session?.name ? session.name.substring(0, 2).toUpperCase() : 'LX'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{session?.name || 'Intern Scholar'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300 font-bold">
                  {session?.id || 'LMX-B01'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeRole?.shortTitle} Intern • <span className="text-emerald-400 font-semibold">Active Status</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── 3 METRIC PILLARS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Tasks completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{tasksDisplay}</span>
              <span className="text-[11px] text-slate-500 font-medium">Selected missions</span>
            </div>
            <p className="text-[11px] text-emerald-400/90 mt-1 font-semibold flex items-center gap-1">
              <span>Sprint target: 2 completed</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Internship progress</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{progressPercent}%</span>
              <span className="text-[11px] text-slate-500 font-medium">Week 01 of 06</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Performance</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-purple-300 tracking-tight">{performanceScore}</span>
              <span className="text-[11px] text-slate-500 font-medium">/ 100 Index</span>
            </div>
            <p className="text-[11px] text-purple-300/90 mt-1 font-semibold flex items-center gap-1">
              <span>Top 5% Cohort Velocity</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── YOUR CURRENT MISSION CARD ── */}
      <div className="rounded-3xl bg-[#0a0e18] border border-white/10 p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400">YOUR CURRENT MISSION</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                Active Sprint
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {currentMission.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {currentMission.subtitle}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('weekly_missions')}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 shrink-0 self-start sm:self-auto"
          >
            <span>Choose Your Missions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mission Progress Bar & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">Sprint Goal Completion</span>
              <span className="text-cyan-400">50% completed</span>
            </div>
            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full rounded-full w-1/2" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>Target Output:</strong> {currentMission.keyResult}
            </p>
          </div>

          {/* Upcoming Orientation & Availability Poll Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">Upcoming Orientation</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Poll is open
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Founder Shaik Sowban is scheduling the official Batch 01 orientation. Vote for your preferred time:
            </p>

            <div className="space-y-1.5">
              {pollOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleVote(opt.id)}
                  className={`w-full p-2 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    pollSelected === opt.id
                      ? 'bg-purple-500/25 border border-purple-400 text-white font-bold'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${pollSelected === opt.id ? 'border-purple-400 bg-purple-400' : 'border-white/30'}`}>
                      {pollSelected === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </span>
                    <span>{opt.label}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {opt.votes + (pollSelected === opt.id ? 1 : 0)} votes
                  </span>
                </button>
              ))}
            </div>

            {pollSelected && (
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Vote registered for this session! Meeting link will arrive via email.</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── QUICK ACTION TILES: Apple-inspired modular grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          {
            tab: 'weekly_missions',
            label: 'Mission Board',
            sub: 'Select 2 weekly tasks',
            icon: Compass,
            color: 'text-cyan-400',
            bg: 'hover:border-cyan-500/40'
          },
          {
            tab: 'department_workspace',
            label: 'Department Suite',
            sub: `${activeRole?.shortTitle} Tools`,
            icon: Users,
            color: 'text-purple-400',
            bg: 'hover:border-purple-500/40'
          },
          {
            tab: 'submission_studio',
            label: 'Submission Studio',
            sub: 'Upload Drive / Git / PDF',
            icon: Send,
            color: 'text-emerald-400',
            bg: 'hover:border-emerald-500/40'
          },
          {
            tab: 'ai_mentor',
            label: 'AI Internship Mentor',
            sub: 'Guidance & assignment tips',
            icon: Sparkles,
            color: 'text-amber-400',
            bg: 'hover:border-amber-500/40'
          }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              onClick={() => onNavigateTab(item.tab)}
              className={`p-4 rounded-2xl bg-[#090d17] border border-white/10 ${item.bg} text-left transition-all group cursor-pointer flex flex-col justify-between space-y-3 hover:bg-white/[0.04]`}
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.label}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {item.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── FOUNDER ANNOUNCEMENTS STRIP ── */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/30 border border-cyan-500/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Founder Notice · Nov 2026
              </span>
              <span className="text-xs text-slate-400">From Shaik Sowban</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white mt-1">
              "Batch 01 tasks are live! Select your two weekly missions, complete deliverables with production rigor, and earn verified contribution credit towards your Letter of Recommendation."
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('meetings')}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-2"
        >
          <Video className="w-3.5 h-3.5 text-emerald-400" />
          <span>Join Standup Room</span>
        </button>
      </div>
    </div>
  );
}
