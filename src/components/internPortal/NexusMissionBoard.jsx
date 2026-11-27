import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2, Circle, AlertCircle, Clock, Calendar, FileText, Send,
  ArrowRight, Sparkles, Layers, ShieldCheck, ChevronRight, Check,
  ExternalLink, RotateCcw, AlertTriangle, Eye, HelpCircle, Download,
  Copy, X, Lock, Flame, Compass, Target, BookmarkCheck
} from 'lucide-react';

export default function NexusMissionBoard({
  session,
  activeRole,
  onNavigateTab,
  allottedTasks = [],
  submissions = [],
  onOpenSubmitModal
}) {
  // ── SPRINT ROADMAP (Weeks 1 to 6) ──
  const SPRINT_ROADMAP = [
    {
      week: 'Week 01',
      num: 1,
      title: 'Architecture & Strategy',
      sub: 'Active Sprint',
      startDate: '15 Nov 2026',
      endDate: '29 Nov 2026',
      status: 'active',
      desc: 'Foundation sprint establishing core technical plans, competitive baselines, and quality criteria.'
    },
    {
      week: 'Week 02',
      num: 2,
      title: 'Cross-Platform & Loops',
      sub: 'Starts 30 Nov',
      startDate: '30 Nov 2026',
      endDate: '06 Dec 2026',
      status: 'upcoming',
      desc: 'Mobile viewport testing, responsive breakpoints, student referral viral loops and campaign funnels.'
    },
    {
      week: 'Week 03',
      num: 3,
      title: 'Automated Test Regressions',
      sub: 'Starts 07 Dec',
      startDate: '07 Dec 2026',
      endDate: '13 Dec 2026',
      status: 'locked',
      desc: 'Postman/Newman API automation, deep competitor moat benchmarking, and qualitative user interviews.'
    },
    {
      week: 'Week 04',
      num: 4,
      title: 'Telemetry & Institutional B2B',
      sub: 'Starts 14 Dec',
      startDate: '14 Dec 2026',
      endDate: '20 Dec 2026',
      status: 'locked',
      desc: 'College TPO value frameworks, production error monitoring, and multi-channel editorial scaling.'
    },
    {
      week: 'Week 05',
      num: 5,
      title: 'Capstone Releases',
      sub: 'Starts 21 Dec',
      startDate: '21 Dec 2026',
      endDate: '27 Dec 2026',
      status: 'locked',
      desc: 'Production release testing, live student campus drives, and verified bug bounty resolution.'
    },
    {
      week: 'Week 06',
      num: 6,
      title: 'Graduation & Portfolio',
      sub: 'Starts 28 Dec',
      startDate: '28 Dec 2026',
      endDate: '30 Dec 2026',
      status: 'locked',
      desc: 'Founder evaluation, executive letters of recommendation, and cryptographic certificate issuance.'
    }
  ];

  const [selectedSprintWeek, setSelectedSprintWeek] = useState('Week 01');

  // ── DYNAMIC LIVE SPRINT CUTOFF COUNTDOWN (Target: Sunday 23:59:59 IST) ──
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      // Next Sunday 23:59:59
      const target = new Date();
      const currentDay = now.getDay();
      const daysUntilSunday = (7 - currentDay) % 7;
      target.setDate(now.getDate() + (daysUntilSunday === 0 && now.getHours() >= 23 && now.getMinutes() >= 59 ? 7 : daysUntilSunday));
      target.setHours(23, 59, 59, 999);

      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── TEMPLATE GENERATOR MODAL STATE ──
  const [templateModalTask, setTemplateModalTask] = useState(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Weekly missions pool (3 curated missions per department for Week 01)
  const DEPARTMENT_TASK_POOLS = {
    marketing: [
      {
        id: 'mk-w1-t1',
        department: 'marketing',
        week: 'Week 01',
        title: 'Brand Positioning & Student Communication Style Guide',
        tagline: 'Define core messaging pillars, taglines & tone of voice.',
        description: 'Analyze Lumixora placement and learning solutions. Create a comprehensive brand guide defining value propositions for students, campus leaders, and TPOs. Establish communication rules for social posts, posters, and campus engagement.',
        deliverables: 'PDF Brand Guide or Google Drive Slides deck (10+ slides).',
        estimatedHours: '6-8 hours',
        skills: ['Brand Architecture', 'Copywriting', 'Positioning'],
        dueDate: '2026-11-29',
        templateType: 'strategy'
      },
      {
        id: 'mk-w1-t2',
        department: 'marketing',
        week: 'Week 01',
        title: 'Campus Ambassador Network Blueprint & Referral Playbook',
        tagline: 'Design viral student loop mechanics and ambassador rewards.',
        description: 'Develop an operational playbook for recruiting and motivating student campus leads across engineering institutions. Detail viral referral incentive models, leaderboard dynamics, and week-by-week sprint targets.',
        deliverables: 'PDF Strategy Playbook or Google Docs operational brief.',
        estimatedHours: '7-9 hours',
        skills: ['Growth Marketing', 'Community Loops', 'GTM Strategy'],
        dueDate: '2026-11-29',
        templateType: 'playbook'
      },
      {
        id: 'mk-w1-t3',
        department: 'marketing',
        week: 'Week 01',
        title: '30-Day Multi-Channel Content & Campaign Launch Funnel',
        tagline: 'Plan editorial calendar across LinkedIn, Instagram and WhatsApp channels.',
        description: 'Map out 30 structured content pieces targeting final-year and pre-final year engineering students facing placement drives. Include hooks, visual formats (carousels, reels, infographics), and CTA funnels.',
        deliverables: 'Google Drive Spreadsheet or Notion / Markdown calendar.',
        estimatedHours: '5-7 hours',
        skills: ['Content Strategy', 'Funnel Optimization', 'Audience Analytics'],
        dueDate: '2026-11-29',
        templateType: 'calendar'
      }
    ],
    research: [
      {
        id: 'rs-w1-t1',
        department: 'research',
        week: 'Week 01',
        title: 'Top 10 EdTech Placement Platforms Competitive Moat Matrix',
        tagline: 'Deep architectural and feature breakdown of market competitors.',
        description: 'Conduct comprehensive competitive intelligence benchmarking Lumixora against 10 prominent platforms (Unstop, LeetCode, PrepInsta, GeeksforGeeks, etc.). Detail their pricing, weaknesses, and Lumixora unique differentiators.',
        deliverables: 'PDF Moat Dossier or Google Drive Comparison Matrix.',
        estimatedHours: '8-10 hours',
        skills: ['Market Intelligence', 'Competitive Analysis', 'Benchmarking'],
        dueDate: '2026-11-29',
        templateType: 'competitive_matrix'
      },
      {
        id: 'rs-w1-t2',
        department: 'research',
        week: 'Week 01',
        title: 'Undergraduate Placement Anxiety & Prep Behavior Survey (25+ Scholars)',
        tagline: 'Gather primary campus insights on engineering student pain points.',
        description: 'Design and deploy a structured student questionnaire. Conduct brief qualitative interviews with 25 engineering undergraduates regarding their preparation bottlenecks, coding mock fears, and willingness to adopt AI coaching.',
        deliverables: 'Google Drive Interview Transcripts + PDF Qualitative Synthesis.',
        estimatedHours: '7-9 hours',
        skills: ['User Research', 'Survey Design', 'Qualitative Synthesis'],
        dueDate: '2026-11-29',
        templateType: 'survey_synthesis'
      },
      {
        id: 'rs-w1-t3',
        department: 'research',
        week: 'Week 01',
        title: 'Institutional B2B College Partnership & TPO Value Proposition Report',
        tagline: 'Formulate institutional partnership frameworks for engineering colleges.',
        description: 'Research how Training & Placement Officers (TPOs) evaluate software platforms. Formulate proposal structures, accreditation support points (NBA / NAAC criterion compliance), and institutional pricing models.',
        deliverables: 'PDF Executive Whitepaper or Google Slides Pitch Deck.',
        estimatedHours: '6-8 hours',
        skills: ['B2B Research', 'Higher-Ed Policy', 'Value Engineering'],
        dueDate: '2026-11-29',
        templateType: 'whitepaper'
      }
    ],
    content_creation: [
      {
        id: 'cc-w1-t1',
        department: 'content_creation',
        week: 'Week 01',
        title: 'Flagship Lumixora AI Platform 60s Cinematic Explainer Video',
        tagline: 'Produce a high-energy, Apple-grade motion preview of the student OS.',
        description: 'Script, storyboard, and edit a 60-second high-tempo showcase of Lumixora AI features (Notes, Coding Practice, Mock Interview Room, Placement Radar). Use dynamic typography, crisp audio design, and authentic UI captures.',
        deliverables: 'Google Drive MP4 or YouTube unlisted preview link + Script file.',
        estimatedHours: '8-10 hours',
        skills: ['Video Editing', 'Motion Graphics', 'Storyboarding'],
        dueDate: '2026-11-29',
        templateType: 'video_script'
      },
      {
        id: 'cc-w1-t2',
        department: 'content_creation',
        week: 'Week 01',
        title: 'Complete Visual Brand Asset Library (Social Banners, Emblems, Icons)',
        tagline: 'Create vector-perfect marketing design assets for multi-platform distribution.',
        description: 'Design high-resolution Figma assets for Lumixora campus promotion: 5 LinkedIn carousel graphics, 3 Instagram story templates, 2 WhatsApp announcement posters, and crisp SVG emblems.',
        deliverables: 'Figma Community file or Google Drive folder with exported WebP / PNGs.',
        estimatedHours: '7-9 hours',
        skills: ['Figma Design', 'Visual Hierarchy', 'Brand Collateral'],
        dueDate: '2026-11-29',
        templateType: 'design_specs'
      },
      {
        id: 'cc-w1-t3',
        department: 'content_creation',
        week: 'Week 01',
        title: 'Viral Placement Success Stories & Student Interview Series (3 Articles)',
        tagline: 'Write deep-dive student success articles highlighting tier-1 placements.',
        description: 'Draft 3 long-form editorial spotlights (800-1200 words each) covering real student placement journeys (TCS Digital, Cognizant GenC Next, Google hiring). Focus on specific DSA concepts, interview hurdles, and practical guidance.',
        deliverables: 'Google Docs manuscript or Markdown articles with curated headers.',
        estimatedHours: '6-8 hours',
        skills: ['Technical Writing', 'Student Journalism', 'SEO Optimization'],
        dueDate: '2026-11-29',
        templateType: 'editorial'
      }
    ],
    software_testing: [
      {
        id: 'st-w1-t1',
        department: 'software_testing',
        week: 'Week 01',
        title: 'Master Test Strategy & S1-S4 Severity Production Bug Matrix',
        tagline: 'Comprehensive QA plan covering boundary values, auth edge cases and severity matrix.',
        description: 'Formulate formal QA test strategy for Lumixora web application. Define testing scopes, S1 (Blocker) to S4 (Cosmetic) severity criteria, test environments, and matrix covering Authentication, Notes Platform, and Placement Commander.',
        deliverables: 'PDF Master Test Plan or Google Drive Spreadsheet matrix.',
        estimatedHours: '8-10 hours',
        skills: ['Test Planning', 'Severity Matrix', 'Edge Case Analysis'],
        dueDate: '2026-11-29',
        templateType: 'qa_strategy'
      },
      {
        id: 'st-w1-t2',
        department: 'software_testing',
        week: 'Week 01',
        title: 'Cross-Browser UI/UX & Mobile Breakpoint Bug Audit Report',
        tagline: 'Audit Chromium, WebKit and responsive breakpoints identifying defects.',
        description: 'Conduct exhaustive rendering tests across Chrome, Safari/WebKit, Firefox, and mobile screen viewports (iPhone SE, Pixel, iPad, 1080p desktop). Document layout shifts, broken overflows, contrast issues, and click-target collisions.',
        deliverables: 'PDF Audit Dossier with annotated screenshots and reproduction steps.',
        estimatedHours: '7-9 hours',
        skills: ['Cross-Browser QA', 'Responsive UI Auditing', 'Defect Logging'],
        dueDate: '2026-11-29',
        templateType: 'bug_dossier'
      },
      {
        id: 'st-w1-t3',
        department: 'software_testing',
        week: 'Week 01',
        title: 'REST API & Auth Token Session Boundary Test Suite',
        tagline: 'Validate endpoint status codes, schema consistency and security boundaries.',
        description: 'Construct automated Postman/Newman or Playwright test script collection verifying API responses, payload sanitization, token expiry behaviour, and unauthorized route access blocks.',
        deliverables: 'GitHub repository or exported Postman Collection JSON with run logs.',
        estimatedHours: '6-8 hours',
        skills: ['API Testing', 'Postman / Playwright', 'Security Boundary QA'],
        dueDate: '2026-11-29',
        templateType: 'api_test_suite'
      }
    ]
  };

  const currentPool = DEPARTMENT_TASK_POOLS[activeRole?.id] || DEPARTMENT_TASK_POOLS.software_testing;

  // Selected missions state (persisted per intern)
  const [selectedMissions, setSelectedMissions] = useState(() => {
    try {
      const saved = localStorage.getItem(`lumixora_selected_missions_${session?.id}`);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [currentPool[0]?.id, currentPool[1]?.id].filter(Boolean); // default select 2
  });

  const [isConfirmed, setIsConfirmed] = useState(() => {
    try {
      return localStorage.getItem(`lumixora_missions_confirmed_${session?.id}`) === 'true';
    } catch (_) {
      return true;
    }
  });

  const [confirmFeedback, setConfirmFeedback] = useState('');

  const toggleMissionSelection = (taskId) => {
    if (isConfirmed) return; // Locked once confirmed unless reset
    setSelectedMissions(prev => {
      let updated;
      if (prev.includes(taskId)) {
        updated = prev.filter(id => id !== taskId);
      } else {
        if (prev.length >= 2) {
          updated = [prev[1], taskId];
        } else {
          updated = [...prev, taskId];
        }
      }
      try {
        localStorage.setItem(`lumixora_selected_missions_${session?.id}`, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const handleConfirmMissions = () => {
    if (selectedMissions.length !== 2) {
      setConfirmFeedback('Please select exactly 2 weekly missions to confirm your sprint.');
      return;
    }
    setIsConfirmed(true);
    setConfirmFeedback('Weekly missions locked! Your sprint is in progress.');
    try {
      localStorage.setItem(`lumixora_missions_confirmed_${session?.id}`, 'true');
    } catch (_) {}
  };

  const handleUnlockMissions = () => {
    setIsConfirmed(false);
    setConfirmFeedback('Task selection unlocked. You can now adjust your 2 chosen missions.');
    try {
      localStorage.setItem(`lumixora_missions_confirmed_${session?.id}`, 'false');
    } catch (_) {}
  };

  // Check submission status for a task
  const getTaskStatus = (taskId) => {
    const sub = submissions.find(s => s.deliverableId === taskId || s.taskId === taskId);
    if (!sub) {
      if (selectedMissions.includes(taskId)) {
        return { label: 'In Progress', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', isSelected: true };
      }
      return { label: 'Optional / Unselected', color: 'text-slate-400 bg-white/5 border-white/10', isSelected: false };
    }
    if (sub.status === 'approved' || (sub.score && sub.score >= 80)) {
      return { label: 'Approved & Credited', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', isSelected: true, sub };
    }
    if (sub.status === 'revision_requested') {
      return { label: 'Revision Required', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30', isSelected: true, sub };
    }
    return { label: 'Under Review', color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30', isSelected: true, sub };
  };

  // Generate standardized Markdown deliverable scaffold
  const generateScaffoldText = (task) => {
    if (!task) return '';
    return `# LUMIXORA ENGINEERING & INNOVATION WORKPLACE
## Official Sprint Deliverable Report • ${task.week}
---
**Project**: Lumixora (A Product of Vyomra)
**Track**: ${activeRole?.title || 'Engineering Intern'}
**Mission**: ${task.title}
**Author**: ${session?.name || 'Intern Scholar'} (ID: ${session?.id || 'LMX-B01'})
**Date**: ${new Date().toLocaleDateString('en-GB')}
**Status**: Ready for Founder Evaluation (Shaik Sowban)

---

### 1. Executive Summary
<!-- Brief 2-3 sentence overview of what was accomplished, why it matters, and core outcomes -->
- Summary: 

### 2. Objectives & Methodology
- Scope Covered:
- Tools / Frameworks Employed:
- Key Hypotheses or Quality Standards:

### 3. Deliverable Core Artifacts & Links
- Primary Deliverable (Google Drive / GitHub): 
- Secondary Walkthrough / Demo (Loom / Video): 
- Supporting Spreadsheets / Raw Data: 

### 4. Findings, Test Matrix & Analysis
| Category / Module | Scope Tested / Action Taken | Observed Outcome | Severity / Priority |
| :--- | :--- | :--- | :--- |
| Core Flow 01 | | Pass / Verified | S3 Normal |
| Edge Case 02 | | | S2 Major |

### 5. Identified Bottlenecks & Recommendations
1. 
2. 

### 6. Sign-off & Verification Telemetry
- Estimated Hours Invested: ${task.estimatedHours || '15 Hours'}
- Authenticity Attestation: I confirm all work herein represents verified, original engineering output for Lumixora.
`;
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* ── SPRINT 1–6 TIMELINE ROADMAP BAR ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#080c16] border border-white/10 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-black uppercase text-white tracking-wider">
              6-Week Intensive Sprint Roadmap
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Batch 01
            </span>
          </div>

          {/* Live Cutoff Countdown Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Sprint Cutoff:</span>
            <span className="text-white font-extrabold">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </div>
        </div>

        {/* Horizontal Sprint Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          {SPRINT_ROADMAP.map((sprint) => {
            const isCurrent = sprint.week === selectedSprintWeek;
            const isActive = sprint.status === 'active';
            const isLocked = sprint.status === 'locked' || sprint.status === 'upcoming';
            return (
              <button
                key={sprint.week}
                onClick={() => setSelectedSprintWeek(sprint.week)}
                className={`p-3 rounded-2xl text-left transition-all border cursor-pointer relative ${
                  isCurrent
                    ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : 'bg-white/[0.03] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-cyan-300' : 'text-gray-400'}`}>
                    {sprint.week}
                  </span>
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  ) : isLocked ? (
                    <Lock className="w-3 h-3 text-gray-500" />
                  ) : null}
                </div>
                <p className="text-xs font-bold text-white truncate mt-1">{sprint.title}</p>
                <p className="text-[10px] text-gray-400 truncate">{sprint.sub}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Sprint Notice if viewing future weeks */}
        {selectedSprintWeek !== 'Week 01' && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-300" />
              <span>
                <strong>{selectedSprintWeek} Objectives Preview</strong>: {SPRINT_ROADMAP.find(s => s.week === selectedSprintWeek)?.desc}
              </span>
            </div>
            <button
              onClick={() => setSelectedSprintWeek('Week 01')}
              className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-[11px] font-bold text-white transition-all"
            >
              Back to Active Week 01
            </button>
          </div>
        )}
      </div>

      {/* ── ACTIVE SPRINT BANNER & CONTROLS (Only for Active Week 01) ── */}
      {selectedSprintWeek === 'Week 01' ? (
        <>
          <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-black uppercase tracking-wider text-cyan-400">
                  {activeRole?.shortTitle?.toUpperCase()} · WEEK 01 (ACTIVE SPRINT)
                </span>
                <span className="text-white/30">•</span>
                <span className="text-xs font-bold text-slate-300">Choose your missions</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ({selectedMissions.length}/2 selected)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Weekly Mission Board
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Founder Shaik Sowban has assigned 3 targeted missions for this sprint. Select any two to execute, download standardized templates, and upload verified deliverables.
              </p>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
              {!isConfirmed ? (
                <button
                  onClick={handleConfirmMissions}
                  disabled={selectedMissions.length !== 2}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                    selectedMissions.length === 2
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25'
                      : 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Weekly Missions ({selectedMissions.length}/2)</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Missions Locked (Sprint in Progress)</span>
                  </span>
                  <button
                    onClick={handleUnlockMissions}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-xs transition-all cursor-pointer"
                    title="Change mission selections"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {confirmFeedback && (
            <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
              isConfirmed
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
                : 'bg-amber-500/15 border border-amber-500/30 text-amber-200'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{confirmFeedback}</span>
            </div>
          )}

          {/* ── 3 MISSION SELECTION CARDS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {currentPool.map((task, idx) => {
          const isSelected = selectedMissions.includes(task.id);
          const status = getTaskStatus(task.id);
          return (
            <div
              key={task.id}
              onClick={() => !isConfirmed && toggleMissionSelection(task.id)}
              className={`rounded-3xl p-6 transition-all relative flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-gradient-to-b from-[#0f1424] to-[#0a0e1a] border-2 border-cyan-500/60 shadow-xl shadow-cyan-500/10'
                  : 'bg-[#090d17] border border-white/10 hover:border-white/20'
              } ${!isConfirmed ? 'cursor-pointer' : ''}`}
            >
              {/* Header Badge Row */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                    Mission 0{idx + 1}
                  </span>
                  
                  {/* Selection Indicator Checkbox */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>
                      {status.label}
                    </span>
                    {!isConfirmed ? (
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-white/30 bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    ) : isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {task.title}
                  </h3>
                  <p className="text-xs text-cyan-300/90 font-medium mt-1">
                    {task.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Deliverable & Meta Footer */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Deliverables Expected:</span>
                  <p className="text-xs text-slate-200 font-medium leading-tight">
                    {task.deliverables}
                  </p>
                </div>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {task.skills.map((sk, sIdx) => (
                    <span key={sIdx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Time & Due Date */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.estimatedHours}</span>
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due {task.dueDate}</span>
                  </span>
                </div>

                {/* ACTION BUTTONS: Template Generator + Submit Button */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTemplateModalTask(task);
                    }}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Get Official Lumixora Template</span>
                  </button>

                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenSubmitModal) {
                          onOpenSubmitModal(task);
                        } else {
                          onNavigateTab('submission_studio');
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Deliverable for Mission 0{idx + 1}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
          </div>
        </>
      ) : (
        /* ── SPRINT LOCKED HORIZON SCREEN FOR FUTURE WEEKS ── */
        <div className="p-8 sm:p-12 rounded-3xl bg-[#090d18] border border-white/10 text-center space-y-6 max-w-2xl mx-auto shadow-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
              {selectedSprintWeek} · SPRINT HORIZON LOCKED
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {SPRINT_ROADMAP.find(s => s.week === selectedSprintWeek)?.title}
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {SPRINT_ROADMAP.find(s => s.week === selectedSprintWeek)?.desc}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-left space-y-2.5 max-w-md mx-auto text-xs">
            <div className="flex items-center justify-between text-gray-400 font-mono text-[11px]">
              <span>SCHEDULED SPRINT WINDOW</span>
              <span className="text-cyan-300 font-bold">{SPRINT_ROADMAP.find(s => s.week === selectedSprintWeek)?.startDate} – {SPRINT_ROADMAP.find(s => s.week === selectedSprintWeek)?.endDate}</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-normal">
              Weekly missions for {selectedSprintWeek} will be assigned by Founder Shaik Sowban following Week 01 deliverable evaluations and orientation kickoff.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setSelectedSprintWeek('Week 01')}
              className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-lg shadow-cyan-400/20 cursor-pointer transition-all"
            >
              <span>Return to Active Week 01 Missions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── WORKFLOW TIMELINE CARD: The 6-Stage Real Startup Loop ── */}
      <div className="rounded-3xl bg-[#0a0e18] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400">
          THE LUMIXORA TASK LIFECYCLE
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          {[
            { step: '01', title: 'Founder Assigns', desc: '3 Weekly Tasks Curated', active: true },
            { step: '02', title: 'Intern Selects', desc: 'Choose Any 2 Missions', active: true },
            { step: '03', title: 'Work in Progress', desc: 'Collaborate & Build', active: true },
            { step: '04', title: 'Submit Deliverable', desc: 'Drive / Git / PDF / Loom', active: true },
            { step: '05', title: 'Founder Reviews', desc: 'Evaluation & Rubric', active: true },
            { step: '06', title: 'Approved & Credit', desc: 'Impact DNA Recorded', active: true }
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <span className="text-[10px] font-mono font-bold text-cyan-400 block">{item.step}</span>
              <p className="text-xs font-bold text-white">{item.title}</p>
              <p className="text-[10px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── DELIVERABLE TEMPLATE MODAL ── */}
      {templateModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0b0f1c] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Official Lumixora Deliverable Template
                  </h3>
                  <p className="text-[11px] text-gray-400">{templateModalTask.title}</p>
                </div>
              </div>
              <button
                onClick={() => setTemplateModalTask(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Use this standardized template to document your mission findings. You can copy the Markdown scaffold directly into your Google Docs, GitHub README, or Notion document before submitting.
            </p>

            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 font-mono text-[11px] text-gray-300 whitespace-pre-wrap overflow-x-auto max-h-72 custom-scrollbar">
              {generateScaffoldText(templateModalTask)}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
              <span className="text-[11px] text-gray-400">
                Format: Standardized Markdown • Startup Grade
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateScaffoldText(templateModalTask));
                    setCopiedTemplate(true);
                    setTimeout(() => setCopiedTemplate(false), 2500);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-400/20 cursor-pointer"
                >
                  {copiedTemplate ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedTemplate ? 'Copied to Clipboard!' : 'Copy Template Markdown'}</span>
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([generateScaffoldText(templateModalTask)], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Lumixora_${templateModalTask.id}_Deliverable_Template.md`;
                    a.click();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
