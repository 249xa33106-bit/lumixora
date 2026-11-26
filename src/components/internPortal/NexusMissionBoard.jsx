import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Circle, AlertCircle, Clock, Calendar, FileText, Send,
  ArrowRight, Sparkles, Layers, ShieldCheck, ChevronRight, Check,
  ExternalLink, RotateCcw, AlertTriangle, Eye, HelpCircle
} from 'lucide-react';

export default function NexusMissionBoard({
  session,
  activeRole,
  onNavigateTab,
  allottedTasks = [],
  submissions = [],
  onOpenSubmitModal
}) {
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
        dueDate: '2026-12-01'
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
        dueDate: '2026-12-02'
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
        dueDate: '2026-12-03'
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
        dueDate: '2026-12-01'
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
        dueDate: '2026-12-02'
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
        dueDate: '2026-12-03'
      }
    ],
    content_creation: [
      {
        id: 'cc-w1-t1',
        department: 'content_creation',
        week: 'Week 01',
        title: 'Flagship Lumixora AI Platform 60s Cinematic Explainer Video',
        tagline: 'Produce a high-energy, Apple-grade motion preview of the student OS.',
        description: 'Write script, storyboard, and edit a crisp 60-second video walkthrough showcasing the Omiverse Hub, Code Arena, and SpeakVerse AI coach. Focus on slick UI screen captures, kinetic typography, and inspiring audio.',
        deliverables: 'MP4 Video file (Drive/YouTube unlisted) + Project timeline export.',
        estimatedHours: '8-10 hours',
        skills: ['Video Editing', 'Motion Graphics', 'Storyboarding'],
        dueDate: '2026-12-01'
      },
      {
        id: 'cc-w1-t2',
        department: 'content_creation',
        week: 'Week 01',
        title: '5-Part LinkedIn Carousel Series: Demystifying Tech Placement Prep',
        tagline: 'Craft visually stunning 1080x1350 editorial carousels for engineering students.',
        description: 'Design 5 educational carousel slide decks (8-10 slides each) covering topics like "Cracking DSA in 90 Days", "Top 5 Resume Red Flags", and "The Future of AI Mock Interviews". Adhere to Lumixora brand typography.',
        deliverables: 'Figma link or export PDF slide packages.',
        estimatedHours: '7-9 hours',
        skills: ['Figma Design', 'Information Design', 'Social Branding'],
        dueDate: '2026-12-02'
      },
      {
        id: 'cc-w1-t3',
        department: 'content_creation',
        week: 'Week 01',
        title: 'Interactive Student UI Walkthrough & Feature Spotlight Media Kit',
        tagline: 'Create annotated GIFs, video b-rolls, and high-res feature mockups.',
        description: 'Generate high-fidelity animated clips and media assets spotlighting the 3D Lumina Classroom and TechPulse Radar. These assets will feed marketing outreach and founder product releases.',
        deliverables: 'Google Drive Media Archive with categorized folders (GIFs, MP4s, PNGs).',
        estimatedHours: '6-8 hours',
        skills: ['Asset Curation', 'Micro-Interactions', 'Visual Media'],
        dueDate: '2026-12-03'
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
        dueDate: '2026-12-01'
      },
      {
        id: 'st-w1-t2',
        department: 'software_testing',
        week: 'Week 01',
        title: 'Cross-Browser & Mobile Viewport Layout Audit Report (375px to 1920px)',
        tagline: 'Audit Chromium, WebKit and responsive breakpoints identifying defects.',
        description: 'Conduct exhaustive rendering tests across Chrome, Safari/WebKit, Firefox, and mobile screen viewports (iPhone SE, Pixel, iPad, 1080p desktop). Document layout shifts, broken overflows, contrast issues, and click-target collisions.',
        deliverables: 'PDF Audit Dossier with annotated screenshots and reproduction steps.',
        estimatedHours: '7-9 hours',
        skills: ['Cross-Browser QA', 'Responsive UI Auditing', 'Defect Logging'],
        dueDate: '2026-12-02'
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
        dueDate: '2026-12-03'
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
          // Replace the oldest
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

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* ── HEADER BANNER: Apple-inspired precision ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-cyan-400">
              {activeRole?.shortTitle?.toUpperCase()} · WEEK 01
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
            Founder Shaik Sowban has assigned 3 targeted missions for this sprint. Select any two to execute, upload your verified deliverables, and earn official contribution credit.
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

                {/* Submit Action Button (if mission is selected) */}
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
          );
        })}
      </div>

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
    </div>
  );
}
