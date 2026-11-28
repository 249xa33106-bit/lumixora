import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2, Circle, AlertCircle, Clock, Calendar, FileText, Send,
  ArrowRight, Sparkles, Layers, ShieldCheck, ChevronRight, Check,
  ExternalLink, RotateCcw, AlertTriangle, Eye, HelpCircle, Download,
  Copy, X, Lock, Flame, Compass, Target, BookmarkCheck, Plus, Edit3, Trash2
} from 'lucide-react';

export default function NexusMissionBoard({
  session,
  activeRole,
  onNavigateTab,
  allottedTasks = [],
  submissions = [],
  onOpenSubmitModal
}) {
  // Founder check
  const isFounder = useMemo(() => {
    return session?.email?.includes('sowban') || session?.role === 'founder' || session?.isFounder === true;
  }, [session]);

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
      desc: 'Automated Playwright/Postman E2E suites, multi-channel editorial calendars, and user interview dossiers.'
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

  // Real tasks state (Synced with localStorage and prop)
  const [tasksList, setTasksList] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_cohort_allotted_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return Array.isArray(allottedTasks) ? allottedTasks : [];
  });

  // Sync when prop updates
  useEffect(() => {
    if (Array.isArray(allottedTasks) && allottedTasks.length > 0) {
      setTasksList(allottedTasks);
    }
  }, [allottedTasks]);

  // Listen to window storage updates for instant cross-tab sync
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('lumixora_cohort_allotted_tasks');
        if (saved) setTasksList(JSON.parse(saved));
      } catch (_) {}
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('lumixora_tasks_updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('lumixora_tasks_updated', handleStorage);
    };
  }, []);

  // Filter tasks for active department and selected sprint week
  const currentPool = useMemo(() => {
    return tasksList.filter(t => {
      const matchDept = !t.roleId || t.roleId === 'all' || t.roleId === activeRole?.id || t.department === activeRole?.id;
      const tWeek = (t.week || t.sprint || 'Week 01').replace('Week ', 'Week 0').replace('Week 00', 'Week 0');
      const sWeek = selectedSprintWeek.replace('Week ', 'Week 0').replace('Week 00', 'Week 0');
      const matchWeek = tWeek === sWeek || t.week === selectedSprintWeek || t.sprint === selectedSprintWeek;
      return matchDept && matchWeek;
    });
  }, [tasksList, activeRole?.id, selectedSprintWeek]);

  // Selected missions state (persisted per intern)
  const [selectedMissions, setSelectedMissions] = useState(() => {
    try {
      const saved = localStorage.getItem(`lumixora_selected_missions_${session?.id}`);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
  });

  const [isConfirmed, setIsConfirmed] = useState(() => {
    try {
      return localStorage.getItem(`lumixora_missions_confirmed_${session?.id}`) === 'true';
    } catch (_) {}
    return false;
  });

  const [confirmFeedback, setConfirmFeedback] = useState('');

  const toggleMissionSelection = (taskId) => {
    if (isConfirmed) return;
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
    if (selectedMissions.length < 1) {
      setConfirmFeedback('Please select at least 1 mission to confirm your sprint.');
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
    setConfirmFeedback('Task selection unlocked. You can now adjust your chosen missions.');
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
      return { label: 'Available Mission', color: 'text-slate-400 bg-white/5 border-white/10', isSelected: false };
    }
    if (sub.status === 'approved' || (sub.score && sub.score >= 80)) {
      return { label: 'Approved & Credited', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', isSelected: true, sub };
    }
    if (sub.status === 'revision_requested') {
      return { label: 'Revision Required', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30', isSelected: true, sub };
    }
    return { label: 'Under Review', color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30', isSelected: true, sub };
  };

  // ── TEMPLATE GENERATOR MODAL STATE ──
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templateModalTask, setTemplateModalTask] = useState(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Generate standardized Markdown deliverable scaffold
  const generateScaffoldText = (task) => {
    const taskTitle = task?.title || 'Weekly Sprint Deliverable';
    const weekLabel = task?.week || selectedSprintWeek;
    const estHours = task?.estimatedHours || '15 Hours';
    return `# LUMIXORA ENGINEERING & INNOVATION WORKPLACE
## Official Sprint Deliverable Report • ${weekLabel}
---
**Project**: Lumixora (A Product of Vyomra)
**Track**: ${activeRole?.title || 'Engineering & Operations Track'}
**Mission / Deliverable**: ${taskTitle}
**Author**: ${session?.name || 'Intern Scholar'} (ID: ${session?.id || 'LMX-B01'})
**Date**: ${new Date().toLocaleDateString('en-GB')}
**Status**: Ready for Founder Evaluation (Shaik Sowban)

---

### 1. Executive Summary & Objective
<!-- Brief 2-3 sentence overview of what was built, audited, or executed, and its strategic utility to Lumixora -->
- Summary: 

### 2. Scope & Methodology
<!-- Tools, environments, test viewports, datasets, or target frameworks used -->
- Scope Covered: 
- Tools Employed: 

### 3. Core Deliverable Links (Verified Artifacts)
- Primary Artifact (Google Drive / GitHub / Figma): [Paste Link with Anyone with Link Can View]
- Demonstration / Walkthrough (Loom / Video): [Optional Walkthrough Link]
- Additional Notes / Supporting Spreadsheets: 

### 4. Findings, Test Cases & Impact Metrics
<!-- Observed results, edge cases discovered, reproduction steps, or analytical conclusions -->
| Component / Flow | Observed Behavior | Severity / Impact | Status |
| :--- | :--- | :--- | :--- |
| Core Flow 01 | Verified as expected | Baseline | PASSED |
| Edge Case 02 | Handled securely | Standard | VERIFIED |

### 5. Identified Challenges & Recommendations
1. 
2. 

### 6. Intern Authenticity Attestation
- Estimated Hours Invested: ${estHours}
- Authenticity Attestation: I confirm all work herein represents verified, original engineering and analytical output for Lumixora.
`;
  };

  // ── FOUNDER TASK CREATOR / EDITOR MODAL STATE ──
  const [postTaskModalOpen, setPostTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    roleId: activeRole?.id || 'software_testing',
    week: 'Week 01',
    tagline: '',
    description: '',
    deliverables: 'PDF Report, Google Drive spreadsheet, or GitHub repository link.',
    estimatedHours: '8-10 hours',
    dueDate: '2026-11-29',
    skills: 'Technical Analysis, Execution Rigor'
  });

  const handleOpenCreateTask = () => {
    setEditingTaskId(null);
    setTaskForm({
      title: '',
      roleId: activeRole?.id || 'software_testing',
      week: selectedSprintWeek,
      tagline: '',
      description: '',
      deliverables: 'PDF Report, Google Drive spreadsheet, or GitHub repository link.',
      estimatedHours: '8-10 hours',
      dueDate: '2026-11-29',
      skills: 'Technical Analysis, Execution Rigor'
    });
    setPostTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title || '',
      roleId: task.roleId || task.department || activeRole?.id || 'software_testing',
      week: task.week || task.sprint || selectedSprintWeek,
      tagline: task.tagline || '',
      description: task.description || '',
      deliverables: task.deliverables || task.submissionRequirements || '',
      estimatedHours: task.estimatedHours || '8-10 hours',
      dueDate: task.dueDate || '2026-11-29',
      skills: Array.isArray(task.skills) ? task.skills.join(', ') : (task.skills || '')
    });
    setPostTaskModalOpen(true);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    const skillsArray = typeof taskForm.skills === 'string'
      ? taskForm.skills.split(',').map(s => s.trim()).filter(Boolean)
      : taskForm.skills;

    let updatedTasks;
    if (editingTaskId) {
      updatedTasks = tasksList.map(t => {
        if (t.id === editingTaskId) {
          return {
            ...t,
            ...taskForm,
            skills: skillsArray,
            sprint: taskForm.week,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      });
    } else {
      const newTask = {
        id: `task_${Date.now()}`,
        ...taskForm,
        skills: skillsArray,
        sprint: taskForm.week,
        createdAt: new Date().toISOString()
      };
      updatedTasks = [newTask, ...tasksList];
    }

    setTasksList(updatedTasks);
    try {
      localStorage.setItem('lumixora_cohort_allotted_tasks', JSON.stringify(updatedTasks));
      window.dispatchEvent(new Event('lumixora_tasks_updated'));
    } catch (_) {}
    setPostTaskModalOpen(false);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Delete this mission?')) {
      const updated = tasksList.filter(t => t.id !== taskId);
      setTasksList(updated);
      try {
        localStorage.setItem('lumixora_cohort_allotted_tasks', JSON.stringify(updated));
        window.dispatchEvent(new Event('lumixora_tasks_updated'));
      } catch (_) {}
    }
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
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Batch 01
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">
              Selected Sprint: <strong className="text-white">{selectedSprintWeek}</strong>
            </span>
            {isFounder && (
              <button
                onClick={handleOpenCreateTask}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Task</span>
              </button>
            )}
          </div>
        </div>

        {/* 6 Sprint Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SPRINT_ROADMAP.map((sprint) => {
            const isSelected = selectedSprintWeek === sprint.week;
            const sprintTasksCount = tasksList.filter(t => {
              const matchDept = !t.roleId || t.roleId === 'all' || t.roleId === activeRole?.id || t.department === activeRole?.id;
              const tWeek = (t.week || t.sprint || 'Week 01').replace('Week ', 'Week 0').replace('Week 00', 'Week 0');
              const sWeek = sprint.week.replace('Week ', 'Week 0').replace('Week 00', 'Week 0');
              return matchDept && (tWeek === sWeek || t.week === sprint.week || t.sprint === sprint.week);
            }).length;

            return (
              <button
                key={sprint.week}
                onClick={() => setSelectedSprintWeek(sprint.week)}
                className={`p-3 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10 text-white'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className={isSelected ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                    {sprint.week}
                  </span>
                  {sprintTasksCount > 0 ? (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                      {sprintTasksCount} {sprintTasksCount === 1 ? 'task' : 'tasks'}
                    </span>
                  ) : (
                    <span className="text-slate-600 text-[9px]">0 tasks</span>
                  )}
                </div>
                <p className={`text-xs font-extrabold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {sprint.title}
                </p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {sprint.sub}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── HEADER BANNER: MISSION BOARD ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-cyan-400">
              {activeRole?.shortTitle?.toUpperCase() || 'COHORT'} · {selectedSprintWeek.toUpperCase()}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs font-bold text-slate-300">Sprint Missions</span>
            {currentPool.length > 0 && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ({selectedMissions.length}/{currentPool.length} selected)
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Weekly Mission Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            {currentPool.length > 0
              ? `Founder Shaik Sowban has assigned ${currentPool.length} mission${currentPool.length === 1 ? '' : 's'} for ${selectedSprintWeek}. Select your tasks, download the standardized template, and upload verified deliverables.`
              : `Founder Shaik Sowban has not assigned tasks for ${selectedSprintWeek} yet. Use the official Lumixora Deliverable Template below to prepare and submit your work.`
            }
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto flex-wrap">
          {/* Official Template Quick Action */}
          <button
            onClick={() => {
              setTemplateModalTask(currentPool[0] || null);
              setTemplateModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer transition-all"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Official Template</span>
          </button>

          {/* Founder Create Task Button */}
          {isFounder && (
            <button
              onClick={handleOpenCreateTask}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Post Mission</span>
            </button>
          )}

          {currentPool.length > 0 && (
            !isConfirmed ? (
              <button
                onClick={handleConfirmMissions}
                disabled={selectedMissions.length < 1}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  selectedMissions.length >= 1
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Missions ({selectedMissions.length})</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Missions Locked</span>
                </span>
                <button
                  onClick={handleUnlockMissions}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-xs transition-all cursor-pointer"
                  title="Change mission selections"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )
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

      {/* ── MISSION CARDS OR AWAITING FOUNDER TASKS STATE ── */}
      {currentPool.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {currentPool.map((task) => {
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
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 uppercase tracking-widest font-bold">
                    {task.week || selectedSprintWeek}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>
                      {status.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-white leading-snug">
                    {task.title}
                  </h3>
                  {task.tagline && (
                    <p className="text-xs text-cyan-300 font-medium">
                      {task.tagline}
                    </p>
                  )}
                  {task.description && (
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Deliverables Expected Box */}
                {(task.deliverables || task.submissionRequirements) && (
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Deliverables Expected:
                    </span>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {task.deliverables || task.submissionRequirements}
                    </p>
                  </div>
                )}

                {/* Skills Chips */}
                {task.skills && (
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(task.skills) ? task.skills : task.skills.split(',')).map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 border border-white/5"
                      >
                        {typeof sk === 'string' ? sk.trim() : sk}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer Time & Actions */}
                <div className="pt-2 border-t border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{task.estimatedHours || '8-10 hours'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>Due {task.dueDate || '2026-11-29'}</span>
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-1.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setTemplateModalTask(task);
                        setTemplateModalOpen(true);
                      }}
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer transition-all"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Get Official Lumixora Template</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenSubmitModal) {
                          onOpenSubmitModal(task);
                        } else if (onNavigateTab) {
                          onNavigateTab('submission_studio');
                        }
                      }}
                      className="w-full py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-cyan-500/30 cursor-pointer transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Deliverable for Mission</span>
                    </button>

                    {/* Founder Edit & Delete Controls */}
                    {isFounder && (
                      <div className="flex items-center justify-end gap-1 pt-1">
                        <button
                          onClick={() => handleOpenEditTask(task)}
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[11px] font-bold flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3 text-cyan-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3 text-rose-400" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── CLEAN AUTHENTIC STATE WHEN FOUNDER HAS NOT ASSIGNED TASKS YET ── */
        <div className="p-8 sm:p-12 rounded-3xl bg-[#090d18] border border-white/10 text-center space-y-6 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
            <Compass className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
              {selectedSprintWeek} · AWAITING FOUNDER SPRINT TASKS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              No Missions Assigned Yet for {selectedSprintWeek}
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Founder Shaik Sowban has not assigned weekly tasks for the {activeRole?.title || 'Cohort'} track yet. You can use the official deliverable template below to prepare your findings or submit self-initiated project deliverables.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
            <button
              onClick={() => {
                setTemplateModalTask(null);
                setTemplateModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Get Official Deliverable Template</span>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab('submission_studio')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs inline-flex items-center gap-2 border border-white/10 cursor-pointer transition-all"
            >
              <Send className="w-4 h-4 text-cyan-400" />
              <span>Submit Deliverable (Submission Studio)</span>
            </button>

            {isFounder && (
              <button
                onClick={handleOpenCreateTask}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Post New Sprint Mission</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── PERMANENT STANDARDIZED TEMPLATE SECTION FOR INTERNS ── */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0a0e1c] via-[#0d1326] to-[#0a0e1c] border border-cyan-500/30 p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                Standardized Delivery Framework
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                Official Lumixora Deliverable Submission Template
              </h3>
              <p className="text-xs text-slate-400 max-w-xl mt-0.5">
                All Batch 01 deliverables must follow the standardized Lumixora startup scaffold. Use this template to document your methodology, attach live artifact links, and detail observed metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateScaffoldText(currentPool[0] || null));
                setCopiedTemplate(true);
                setTimeout(() => setCopiedTemplate(false), 2500);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-400/20 cursor-pointer transition-all"
            >
              {copiedTemplate ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedTemplate ? 'Copied Scaffold!' : 'Copy Template Markdown'}</span>
            </button>

            <button
              onClick={() => {
                const blob = new Blob([generateScaffoldText(currentPool[0] || null)], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Lumixora_${activeRole?.id || 'intern'}_Deliverable_Template.md`;
                a.click();
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download .md</span>
            </button>

            <button
              onClick={() => {
                setTemplateModalTask(currentPool[0] || null);
                setTemplateModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── WORKFLOW TIMELINE CARD: The 6-Stage Real Startup Loop ── */}
      <div className="rounded-3xl bg-[#0a0e18] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400">
          THE LUMIXORA TASK LIFECYCLE
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          {[
            { step: '01', title: 'Founder Assigns', desc: 'Weekly Sprint Missions', active: true },
            { step: '02', title: 'Intern Selects', desc: 'Choose Missions or Pitch', active: true },
            { step: '03', title: 'Work in Progress', desc: 'Collaborate & Build', active: true },
            { step: '04', title: 'Submit Deliverable', desc: 'Drive / Git / PDF / Loom', active: true },
            { step: '05', title: 'Founder Reviews', desc: 'Rubric Scoring & Feedback', active: true },
            { step: '06', title: 'Approved & Credit', desc: 'Recorded to Skill Passport', active: true }
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
      {templateModalOpen && (
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
                  <p className="text-[11px] text-gray-400">
                    {templateModalTask?.title || 'Standardized Sprint Scaffold'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTemplateModalOpen(false)}
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

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 flex-wrap">
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
                  <span>{copiedTemplate ? 'Copied!' : 'Copy Markdown'}</span>
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([generateScaffoldText(templateModalTask)], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Lumixora_Deliverable_Template.md`;
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

      {/* ── FOUNDER POST / EDIT TASK MODAL ── */}
      {postTaskModalOpen && isFounder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-[#0b0f1c] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {editingTaskId ? 'Edit Sprint Mission' : 'Post New Sprint Mission'}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Assign task for {activeRole?.title || 'Selected Track'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPostTaskModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Mission Title</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g. Master Test Strategy & Production QA Plan"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Target Department</label>
                  <select
                    value={taskForm.roleId}
                    onChange={e => setTaskForm({ ...taskForm, roleId: e.target.value })}
                    className="w-full bg-[#121829] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="software_testing">Software Testing & QA</option>
                    <option value="research">Research & Competitive Intel</option>
                    <option value="marketing">Growth Marketing & Strategy</option>
                    <option value="content_creation">Content Creation & Visual Media</option>
                    <option value="all">All Departments</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Sprint Week</label>
                  <select
                    value={taskForm.week}
                    onChange={e => setTaskForm({ ...taskForm, week: e.target.value })}
                    className="w-full bg-[#121829] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="Week 01">Week 01 (Active)</option>
                    <option value="Week 02">Week 02</option>
                    <option value="Week 03">Week 03</option>
                    <option value="Week 04">Week 04</option>
                    <option value="Week 05">Week 05</option>
                    <option value="Week 06">Week 06 (Capstone)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Subtitle / Tagline (Optional)</label>
                <input
                  type="text"
                  value={taskForm.tagline}
                  onChange={e => setTaskForm({ ...taskForm, tagline: e.target.value })}
                  placeholder="e.g. Comprehensive boundary testing across mobile & web viewports."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Detailed Description & Guidelines</label>
                <textarea
                  rows={3}
                  value={taskForm.description}
                  onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Outline the problem scope, expectations, tools to use, and acceptance criteria..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Deliverables Expected</label>
                <input
                  type="text"
                  value={taskForm.deliverables}
                  onChange={e => setTaskForm({ ...taskForm, deliverables: e.target.value })}
                  placeholder="e.g. PDF Master Test Plan or Google Drive Spreadsheet matrix"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Estimated Hours</label>
                  <input
                    type="text"
                    value={taskForm.estimatedHours}
                    onChange={e => setTaskForm({ ...taskForm, estimatedHours: e.target.value })}
                    placeholder="8-10 hours"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={taskForm.skills}
                  onChange={e => setTaskForm({ ...taskForm, skills: e.target.value })}
                  placeholder="e.g. Test Planning, Boundary QA, Bug Tracking"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPostTaskModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-md cursor-pointer transition-all"
                >
                  {editingTaskId ? 'Update Mission' : 'Post Mission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
