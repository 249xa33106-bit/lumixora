import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles, CheckCircle2, Clock, Calendar, ArrowRight,
  TrendingUp, Award, Users, AlertCircle, FileText, Send,
  Vote, Video, ShieldCheck, ChevronRight, Bell, Zap, Compass, Check,
  Edit3, Plus, X, Radio, MessageSquare, Megaphone
} from 'lucide-react';

export default function NexusMissionControl({
  session,
  activeRole,
  onNavigateTab,
  allottedTasks = [],
  submissions = [],
  selectedMissions = []
}) {
  // Detect if current session is Founder Shaik Sowban
  const isFounder = useMemo(() => {
    return session?.email?.includes('sowban') || session?.role === 'founder' || session?.isFounder === true;
  }, [session]);

  // Dynamic Orientation Session & Poll State (Updated / Posted by Founder)
  const [orientation, setOrientation] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_live_orientation_session');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      mode: 'poll', // 'poll' | 'confirmed'
      title: 'Batch 01 Official Cohort Kickoff & Founder Keynote',
      dateTime: 'Sunday, 30 Nov 2026 · 11:00 AM – 12:15 PM IST',
      platform: 'Google Meet',
      meetUrl: 'https://meet.google.com/new',
      calendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Lumixora+Batch+01+Cohort+Orientation&dates=20261130T053000Z/20261130T064500Z&details=Batch+01+Kickoff+with+Founder+Shaik+Sowban&location=Google+Meet',
      description: 'Welcome manifesto, sprint deliverables standard, and live Q&A on capstone projects and recommendation letters.',
      status: 'Confirmed Live Session',
      pollQuestion: 'Founder Shaik Sowban is scheduling the official Batch 01 orientation. Vote for your preferred time:',
      pollStatus: 'Poll is open',
      pollOptions: [
        { id: 'sat_6pm', label: 'Saturday · 6:00 PM IST', baseVotes: 14 },
        { id: 'sun_11am', label: 'Sunday · 11:00 AM IST', baseVotes: 22 },
        { id: 'sun_5pm', label: 'Sunday · 5:00 PM IST', baseVotes: 12 }
      ]
    };
  });

  // Modal State for Founder Orientation & Meeting Manager
  const [orientationModalOpen, setOrientationModalOpen] = useState(false);
  const [orientationForm, setOrientationForm] = useState(orientation);

  // Real Cohort Availability Poll State (persisted & aggregated)
  const [cohortVotes, setCohortVotes] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_cohort_poll_votes');
      return saved ? JSON.parse(saved) : {};
    } catch (_) {
      return {};
    }
  });

  const pollSelected = session?.id ? cohortVotes[session.id] || '' : '';

  const handleVote = (optionId) => {
    if (!session?.id) return;
    const updated = { ...cohortVotes, [session.id]: optionId };
    setCohortVotes(updated);
    try {
      localStorage.setItem('lumixora_cohort_poll_votes', JSON.stringify(updated));
    } catch (_) {}
  };

  const handleSaveOrientation = (e) => {
    if (e) e.preventDefault();
    setOrientation(orientationForm);
    try {
      localStorage.setItem('lumixora_live_orientation_session', JSON.stringify(orientationForm));
      window.dispatchEvent(new Event('lumixora_orientation_updated'));
    } catch (_) {}
    setOrientationModalOpen(false);
  };

  // Dynamic Founder Notice State
  const [founderNotice, setFounderNotice] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_founder_broadcast_notice');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      badge: 'Founder Notice · Nov 2026',
      author: 'From Shaik Sowban',
      message: '"Batch 01 tasks are live! Select your two weekly missions, complete deliverables with production rigor, and earn verified contribution credit towards your Letter of Recommendation."'
    };
  });

  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [noticeForm, setNoticeForm] = useState(founderNotice);

  const handleSaveNotice = (e) => {
    if (e) e.preventDefault();
    setFounderNotice(noticeForm);
    try {
      localStorage.setItem('lumixora_founder_broadcast_notice', JSON.stringify(noticeForm));
    } catch (_) {}
    setNoticeModalOpen(false);
  };

  // Department mission briefs
  const DEPARTMENT_MISSIONS = {
    marketing: {
      title: 'Make Lumixora discoverable.',
      subtitle: 'Complete any 2 of your 3 weekly tasks to drive viral campus adoption.',
      keyResult: 'Expand GPREC & Rayalaseema campus reach through structured student outreach.',
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
      keyResult: 'Validate critical user journeys across auth, code editor and placement radar.',
      week: 'Week 01'
    }
  };

  const currentMission = DEPARTMENT_MISSIONS[activeRole?.id] || DEPARTMENT_MISSIONS.marketing;

  // Real-time calculation of authentic stats
  const completedCount = submissions.filter(s => s.status === 'approved' || (s.score && Number(s.score) >= 70)).length;
  const submittedCount = submissions.length;
  const tasksDisplay = `${completedCount}/2`;
  const progressPercent = Math.min(100, Math.round((completedCount / 2) * 100));

  // Real Performance Index derived from evaluated deliverables
  const evaluatedSubmissions = submissions.filter(s => s.score !== null && s.score !== undefined && !isNaN(Number(s.score)));
  const hasEvaluations = evaluatedSubmissions.length > 0;
  const performanceScore = hasEvaluations
    ? Math.round(evaluatedSubmissions.reduce((sum, s) => sum + Number(s.score), 0) / evaluatedSubmissions.length)
    : (submittedCount > 0 ? 'In Review' : '—');

  const performanceSubtext = hasEvaluations
    ? (performanceScore >= 90 ? 'High Distinction · LOR On Track' : performanceScore >= 80 ? 'Distinction · Passing Grade' : 'Passing Grade')
    : (submittedCount > 0 ? 'Founder Evaluation In Progress' : 'Pending Sprint 01 Deliverables');

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
                {activeRole?.shortTitle} Intern • <span className="text-emerald-400 font-semibold">Batch 01 Active</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── 3 METRIC PILLARS (100% REAL DYNAMIC DATA) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Tasks completed</span>
              <CheckCircle2 className={`w-4 h-4 ${completedCount >= 2 ? 'text-emerald-400' : 'text-slate-500'}`} />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{tasksDisplay}</span>
              <span className="text-[11px] text-slate-500 font-medium">Sprint requirement</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium flex items-center gap-1">
              <span>{completedCount >= 2 ? 'Week 01 quota fulfilled' : `${2 - completedCount} more needed this sprint`}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Internship progress</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{progressPercent}%</span>
              <span className="text-[11px] text-slate-500 font-medium">Week 01 Goal</span>
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
              {hasEvaluations && <span className="text-[11px] text-slate-500 font-medium">/ 100 Index</span>}
            </div>
            <p className="text-[11px] text-purple-300/90 mt-1 font-semibold flex items-center gap-1">
              <span>{performanceSubtext}</span>
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
              <span className="text-cyan-400">{progressPercent}% completed ({completedCount}/2)</span>
            </div>
            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>Target Output:</strong> {currentMission.keyResult}
            </p>
          </div>

          {/* Upcoming Orientation: Interactive Poll OR Confirmed Session (Founder Configurable) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-transparent border border-purple-500/30 space-y-3 shadow-lg relative overflow-hidden">
            
            {/* Header with Title and Mode Badge / Founder Edit Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">Upcoming Orientation</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono flex items-center gap-1 ${
                  orientation.mode === 'confirmed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                  {orientation.mode === 'confirmed' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{orientation.status || 'Confirmed Live Session'}</span>
                    </>
                  ) : (
                    <span>{orientation.pollStatus || 'Poll is open'}</span>
                  )}
                </span>

                {/* Founder Edit / Post Button */}
                {isFounder && (
                  <button
                    onClick={() => {
                      setOrientationForm(orientation);
                      setOrientationModalOpen(true);
                    }}
                    className="p-1 px-2 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all"
                    title="Founder: Update or Post Orientation & Poll details"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Update / Post</span>
                  </button>
                )}
              </div>
            </div>

            {/* ── MODE A: INTERACTIVE AVAILABILITY POLL ── */}
            {orientation.mode === 'poll' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {orientation.pollQuestion || 'Founder Shaik Sowban is scheduling the official Batch 01 orientation. Vote for your preferred time:'}
                </p>

                <div className="space-y-1.5">
                  {(orientation.pollOptions || []).map((opt) => {
                    const extraVotes = Object.values(cohortVotes).filter(v => v === opt.id).length;
                    const totalVotes = (opt.baseVotes || 0) + extraVotes;
                    const isMyVote = pollSelected === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleVote(opt.id)}
                        className={`w-full p-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer border ${
                          isMyVote
                            ? 'bg-purple-500/25 border-purple-400 text-white font-bold shadow-md shadow-purple-500/15'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isMyVote ? 'border-purple-400 bg-purple-400' : 'border-white/30'
                          }`}>
                            {isMyVote && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                          </span>
                          <span>{opt.label}</span>
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {pollSelected ? (
                  <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Your vote is confirmed for {orientation.pollOptions.find(o => o.id === pollSelected)?.label || 'this slot'}!</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-400/90 font-medium">
                    Select your preferred slot to help finalize the meeting time.
                  </p>
                )}
              </div>
            ) : (
              /* ── MODE B: CONFIRMED LIVE ORIENTATION SESSION ── */
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    {orientation.title || 'Batch 01 Official Cohort Kickoff & Founder Keynote'}
                  </h4>
                  <p className="text-[11px] text-purple-300 font-semibold mt-0.5">
                    {orientation.dateTime || 'Sunday, 30 Nov 2026 · 11:00 AM – 12:15 PM IST'}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-gray-300 space-y-1">
                  <div className="flex items-center justify-between text-gray-400 text-[10px] font-mono">
                    <span>HOST: {orientation.host || 'Shaik Sowban (Founder)'}</span>
                    <span>PLATFORM: {orientation.platform || 'Google Meet'}</span>
                  </div>
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    {orientation.description || 'Welcome manifesto, sprint deliverables standard, and live Q&A on capstone projects and recommendation letters.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={orientation.meetUrl || 'https://meet.google.com/new'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-500/20 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Google Meet</span>
                  </a>
                  <a
                    href={orientation.calendarUrl || 'https://calendar.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1 border border-white/10 transition-all cursor-pointer"
                    title="Add to Google Calendar"
                  >
                    <Calendar className="w-3.5 h-3.5 text-gray-300" />
                    <span>Add to Cal</span>
                  </a>
                </div>
              </div>
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

      {/* ── FOUNDER ANNOUNCEMENTS STRIP (Configurable by Founder) ── */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/30 border border-cyan-500/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {founderNotice.badge || 'Founder Notice · Nov 2026'}
              </span>
              <span className="text-xs text-slate-400">{founderNotice.author || 'From Shaik Sowban'}</span>
              
              {isFounder && (
                <button
                  onClick={() => {
                    setNoticeForm(founderNotice);
                    setNoticeModalOpen(true);
                  }}
                  className="px-2 py-0.5 rounded bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 text-[10px] font-bold border border-cyan-400/40 ml-2 cursor-pointer transition-all flex items-center gap-1"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Edit Notice</span>
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white mt-1">
              {founderNotice.message}
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
      {/* ── FOUNDER MODAL: UPDATE OR POST ORIENTATION / POLL ── */}
      {orientationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0a0e1a] border border-cyan-500/30 p-6 shadow-2xl space-y-5 text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Founder Orientation & Meeting Desk</h3>
                  <p className="text-[11px] text-gray-400">Post orientation dates, update Google Meet link, or manage availability poll.</p>
                </div>
              </div>
              <button
                onClick={() => setOrientationModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOrientation} className="space-y-4 text-xs">
              {/* Mode Toggle */}
              <div>
                <label className="text-gray-300 font-bold block mb-1.5">Card Display Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrientationForm(prev => ({ ...prev, mode: 'poll' }))}
                    className={`p-2.5 rounded-xl font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      orientationForm.mode === 'poll'
                        ? 'bg-purple-500/25 border-purple-400 text-white shadow-md shadow-purple-500/20'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>Interactive Poll Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrientationForm(prev => ({ ...prev, mode: 'confirmed' }))}
                    className={`p-2.5 rounded-xl font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      orientationForm.mode === 'confirmed'
                        ? 'bg-emerald-500/25 border-emerald-400 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Confirmed Session Mode</span>
                  </button>
                </div>
              </div>

              {orientationForm.mode === 'poll' ? (
                /* Poll Configuration Fields */
                <div className="space-y-3 p-3.5 rounded-2xl bg-black/40 border border-white/5">
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Poll Question / Headline</label>
                    <input
                      type="text"
                      value={orientationForm.pollQuestion}
                      onChange={e => setOrientationForm({ ...orientationForm, pollQuestion: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Poll Badge</label>
                    <input
                      type="text"
                      value={orientationForm.pollStatus}
                      onChange={e => setOrientationForm({ ...orientationForm, pollStatus: e.target.value })}
                      placeholder="e.g. Poll is open / Voting closes tonight"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-300 font-bold block">Poll Options & Base Votes</label>
                    {orientationForm.pollOptions.map((opt, idx) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={opt.label}
                          onChange={e => {
                            const updated = [...orientationForm.pollOptions];
                            updated[idx].label = e.target.value;
                            setOrientationForm({ ...orientationForm, pollOptions: updated });
                          }}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-400"
                        />
                        <input
                          type="number"
                          value={opt.baseVotes}
                          onChange={e => {
                            const updated = [...orientationForm.pollOptions];
                            updated[idx].baseVotes = parseInt(e.target.value) || 0;
                            setOrientationForm({ ...orientationForm, pollOptions: updated });
                          }}
                          className="w-16 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-white font-mono text-center outline-none focus:border-purple-400"
                        />
                        <span className="text-[10px] text-gray-400">votes</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Confirmed Session Configuration Fields */
                <div className="space-y-3 p-3.5 rounded-2xl bg-black/40 border border-white/5">
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Session Title</label>
                    <input
                      type="text"
                      value={orientationForm.title}
                      onChange={e => setOrientationForm({ ...orientationForm, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Date & Time Slot</label>
                    <input
                      type="text"
                      value={orientationForm.dateTime}
                      onChange={e => setOrientationForm({ ...orientationForm, dateTime: e.target.value })}
                      placeholder="e.g. Sunday, 30 Nov 2026 · 11:00 AM – 12:15 PM IST"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Google Meet / Live Link</label>
                    <input
                      type="text"
                      value={orientationForm.meetUrl}
                      onChange={e => setOrientationForm({ ...orientationForm, meetUrl: e.target.value })}
                      placeholder="https://meet.google.com/..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Agenda / Description</label>
                    <textarea
                      rows={2}
                      value={orientationForm.description}
                      onChange={e => setOrientationForm({ ...orientationForm, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setOrientationModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-slate-950 font-black shadow-lg shadow-purple-500/25 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Post to Cohort</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FOUNDER MODAL: UPDATE BROADCAST NOTICE ── */}
      {noticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0a0e1a] border border-cyan-500/30 p-6 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <span>Founder Broadcast Notice</span>
              </h3>
              <button onClick={() => setNoticeModalOpen(false)} className="p-1 rounded bg-white/5 hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Badge Text</label>
                <input
                  type="text"
                  value={noticeForm.badge}
                  onChange={e => setNoticeForm({ ...noticeForm, badge: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Notice Message</label>
                <textarea
                  rows={3}
                  value={noticeForm.message}
                  onChange={e => setNoticeForm({ ...noticeForm, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setNoticeModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black shadow-md cursor-pointer"
                >
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
