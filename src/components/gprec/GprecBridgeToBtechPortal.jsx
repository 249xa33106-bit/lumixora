import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap, BookOpen, Code, CheckSquare, Video, FileText, Cpu,
  ArrowRight, CheckCircle2, Circle, Sparkles, Compass, Layers, Target,
  Zap, Award, Terminal, Briefcase, Filter
} from 'lucide-react';

const BRANCHES = [
  { id: 'CSE', name: 'CSE / IT', focus: 'Software Engineering, Algorithms, Systems & Cloud' },
  { id: 'CSM', name: 'CSM (AI & ML)', focus: 'Machine Learning, Python, Data Pipelines & SDE' },
  { id: 'CSD', name: 'CSD (Data Science)', focus: 'Analytics, SQL, Big Data & Full-Stack AI' },
  { id: 'ECE', name: 'ECE', focus: 'Embedded Systems, VLSI, Signal Processing & IT Bridge' },
  { id: 'EEE', name: 'EEE', focus: 'Power Systems, Control, EV Tech & Software Bridge' },
  { id: 'MECH', name: 'MECH', focus: 'CAD/CAM, Robotics, Manufacturing & Tech Bridge' },
  { id: 'CIVIL', name: 'CIVIL', focus: 'Structural Design, BIM, Infrastructure & Analytics Bridge' }
];

const BRIDGE_MODULES = [
  {
    id: 'y1_programming',
    year: 1,
    semester: 'Sem 1–2',
    track: 'both',
    branches: ['CSE', 'CSM', 'CSD', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    btechSubject: 'Problem Solving & C / Python Programming',
    industryBridge: 'Logic Building, Time Complexity & Coding Fundamentals',
    weightage: 'High (OA Gatekeeper)',
    targetNav: 'skill_hub',
    targetSub: 'coding_arena',
    ctaLabel: 'Practice in Coding Arena',
    tasks: [
      { id: 'y1_t1', label: 'Master loops, recursion, arrays & string manipulation in C++/Python/Java' },
      { id: 'y1_t2', label: 'Solve first 15 Beginner problems in GPREC Coding Arena' },
      { id: 'y1_t3', label: 'Set up GitHub profile, Git commits & Linux CLI fundamentals' }
    ]
  },
  {
    id: 'y1_math_aptitude',
    year: 1,
    semester: 'Sem 1–2',
    track: 'both',
    branches: ['CSE', 'CSM', 'CSD', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    btechSubject: 'Engineering Mathematics & Discrete Structures',
    industryBridge: 'Quantitative Aptitude, Probability & Logical Reasoning',
    weightage: 'Critical (TCS / Infosys / Accenture OA)',
    targetNav: 'skill_hub',
    targetSub: 'aptitude_arena',
    ctaLabel: 'Open Aptitude Arena',
    tasks: [
      { id: 'y1_m1', label: 'Map Permutation, Combination & Probability to placement quant shortcuts' },
      { id: 'y1_m2', label: 'Complete 20 timed questions in Aptitude Arena with >80% accuracy' },
      { id: 'y1_m3', label: 'Master Permutations, Number Theory & Modular Arithmetic for coding OAs' }
    ]
  },
  {
    id: 'y2_dsa',
    year: 2,
    semester: 'Sem 3–4',
    track: 'software',
    branches: ['CSE', 'CSM', 'CSD', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    btechSubject: 'Data Structures & Algorithms (R20/R23 Core)',
    industryBridge: 'LeetCode Blind 75 Patterns: Sliding Window, Trees, Graphs & DP',
    weightage: 'Very High (90% of Tech Rounds)',
    targetNav: 'skill_hub',
    targetSub: 'coding_arena',
    ctaLabel: 'Launch DSA Track',
    tasks: [
      { id: 'y2_d1', label: 'Implement Linked Lists, Stacks, Queues, Trees & HashMaps from scratch' },
      { id: 'y2_d2', label: 'Master Binary Search, Two Pointers, BFS/DFS & Greedy algorithms' },
      { id: 'y2_d3', label: 'Solve 30+ Medium problems tagged Amazon, Microsoft & TCS Digital' }
    ]
  },
  {
    id: 'y2_dbms_os',
    year: 2,
    semester: 'Sem 3–4',
    track: 'software',
    branches: ['CSE', 'CSM', 'CSD', 'ECE', 'EEE'],
    btechSubject: 'DBMS, Operating Systems & OOPS (Java/C++)',
    industryBridge: 'SQL Joins, Normalization, Indexing, Concurrency & SOLID Design',
    weightage: 'High (Technical Interview Core)',
    targetNav: 'resources',
    targetSub: 'library',
    ctaLabel: 'Get Core CS Cheat Sheets',
    tasks: [
      { id: 'y2_o1', label: 'Practice Complex SQL Joins, Window Functions & ACID Isolation Levels' },
      { id: 'y2_o2', label: 'Master OS Deadlocks, Virtual Memory, Paging & Thread Scheduling' },
      { id: 'y2_o3', label: 'Design clean OOPS classes using Inheritance, Polymorphism & SOLID' }
    ]
  },
  {
    id: 'y2_core_ece_eee',
    year: 2,
    semester: 'Sem 3–4',
    track: 'core',
    branches: ['ECE', 'EEE', 'MECH', 'CIVIL'],
    btechSubject: 'Core Engineering Fundamentals & Hardware Labs',
    industryBridge: 'VLSI/Embedded C, PLC/EV Systems, SolidWorks/ANSYS & Core Viva',
    weightage: 'Very High (Core Companies & GATE)',
    targetNav: 'mock_interviews',
    targetSub: 'project_defense',
    ctaLabel: 'Build Core Project Portfolio',
    tasks: [
      { id: 'y2_c1', label: 'Document 1 hardware/simulation mini-project with measurable KPIs' },
      { id: 'y2_c2', label: 'Master Embedded C / MATLAB / AutoCAD fundamentals for technical tests' },
      { id: 'y2_c3', label: 'Review GATE previous year conceptual questions for core mastery' }
    ]
  },
  {
    id: 'y3_fullstack_ai',
    year: 3,
    semester: 'Sem 5–6',
    track: 'software',
    branches: ['CSE', 'CSM', 'CSD', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    btechSubject: 'Web Technologies, Software Engineering & AI Electives',
    industryBridge: 'Production Full-Stack / AI Capstone with Cloud Deployment',
    weightage: 'Very High (Resume Shortlisting)',
    targetNav: 'mock_interviews',
    targetSub: 'project_defense',
    ctaLabel: 'Open Project Platform',
    tasks: [
      { id: 'y3_p1', label: 'Ship 2 deployed end-to-end projects with live URL & clean README' },
      { id: 'y3_p2', label: 'Add quantifiable latency, accuracy, or scale metrics to Resume Builder' },
      { id: 'y3_p3', label: 'Pass Architecture Viva Defense for your primary capstone project' }
    ]
  },
  {
    id: 'y3_cn_sysdesign',
    year: 3,
    semester: 'Sem 5–6',
    track: 'software',
    branches: ['CSE', 'CSM', 'CSD', 'ECE'],
    btechSubject: 'Computer Networks, Cloud Computing & Distributed Systems',
    industryBridge: 'HTTP/TCP Internals, Load Balancers, Caching & System Design Basics',
    weightage: 'High (Super-Dream & Product Roles)',
    targetNav: 'mock_interviews',
    targetSub: 'mock_interview',
    ctaLabel: 'Test in AI Mock Viva',
    tasks: [
      { id: 'y3_s1', label: 'Explain DNS, TCP 3-Way Handshake, HTTPS/TLS & REST vs WebSockets' },
      { id: 'y3_s2', label: 'Design scalable URL Shortener, Chat App & Rate Limiter architectures' },
      { id: 'y3_s3', label: 'Complete 2 AI Technical Mock Interviews scoring >80%' }
    ]
  },
  {
    id: 'y3_core_industrial',
    year: 3,
    semester: 'Sem 5–6',
    track: 'core',
    branches: ['ECE', 'EEE', 'MECH', 'CIVIL'],
    btechSubject: 'Industrial Training, Domain Electives & Mini Project',
    industryBridge: 'Core PSU / MNC Shortlisting (L&T, Bosch, Qualcomm, TI, Tata)',
    weightage: 'Critical (Core Drive Readiness)',
    targetNav: 'mock_interviews',
    targetSub: 'resume_defense',
    ctaLabel: 'Build Core ATS Resume',
    tasks: [
      { id: 'y3_ci1', label: 'Build ATS-optimized 1-page technical resume tailored to core JDs' },
      { id: 'y3_ci2', label: 'Complete 1 summer industrial internship / virtual engineering simulation' },
      { id: 'y3_ci3', label: 'Prepare 20 core domain viva questions + STAR behavioral stories' }
    ]
  },
  {
    id: 'y4_placement_sprint',
    year: 4,
    semester: 'Sem 7–8',
    track: 'both',
    branches: ['CSE', 'CSM', 'CSD', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    btechSubject: 'Major Project, Seminar & Campus Placement Drives',
    industryBridge: 'Company-Specific OA Sprints, Resume Defense & Offer Conversion',
    weightage: 'Critical (Final Offer Conversion)',
    targetNav: 'placement',
    targetSub: 'company_sim',
    ctaLabel: 'Simulate Target Companies',
    tasks: [
      { id: 'y4_f1', label: 'Run Resume ATS Audit (>85% score) & pass Claim Defense interrogation' },
      { id: 'y4_f2', label: 'Simulate top 3 target companies in Company Services & close skill gaps' },
      { id: 'y4_f3', label: 'Track every GPREC campus & off-campus drive in Application Tracker' }
    ]
  }
];

const CORE_SUBJECT_CARDS = [
  {
    subject: 'Operating Systems',
    tag: 'Sem 4 → Tech Round',
    topics: ['Processes vs Threads', 'Deadlock Conditions & Banker Algo', 'Virtual Memory & Paging', 'CPU Scheduling'],
    tip: 'Interviewers love asking what happens step-by-step when you run a program or hit a page fault.'
  },
  {
    subject: 'DBMS & SQL',
    tag: 'Sem 4 → OA + Tech',
    topics: ['ACID & Isolation Levels', 'B+ Tree Indexing', '1NF to BCNF Normalization', 'Complex Joins & Group By'],
    tip: 'Always explain index selectivity and write clean SQL queries without correlated subqueries where JOINs fit.'
  },
  {
    subject: 'Computer Networks',
    tag: 'Sem 5 → Product MNCs',
    topics: ['OSI vs TCP/IP Layers', 'TCP 3-Way Handshake', 'DNS Resolution Flow', 'HTTP/2, TLS & Status Codes'],
    tip: 'Practice answering "What happens when you type google.com in a browser?" in 90 crisp seconds.'
  },
  {
    subject: 'OOPS & Clean Design',
    tag: 'Sem 3 → Coding + LLD',
    topics: ['4 Pillars with Real Code', 'Abstract Class vs Interface', 'SOLID Principles', 'Singleton / Factory Patterns'],
    tip: 'Use real project examples (e.g., Payment Gateway interface) instead of textbook Animal/Dog analogies.'
  }
];

export default function GprecBridgeToBtechPortal({ user, navigateTo, awardXP, addToast }) {
  const storageKey = `gprec_bridge_btech_${user?.id || user?.email || 'guest'}`;

  const [selectedBranch, setSelectedBranch] = useState(() => {
    const raw = (user?.branch || user?.department || 'CSE').toUpperCase();
    const match = BRANCHES.find(b => raw.includes(b.id));
    return match ? match.id : 'CSE';
  });
  const [selectedTrack, setSelectedTrack] = useState('all'); // 'all' | 'software' | 'core'
  const [selectedYear, setSelectedYear] = useState('all'); // 'all' | 1 | 2 | 3 | 4
  const [completedTaskIds, setCompletedTaskIds] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedTaskIds));
    } catch (e) {}
  }, [completedTaskIds, storageKey]);

  const filteredModules = useMemo(() => {
    return BRIDGE_MODULES.filter(mod => {
      const branchOk = mod.branches.includes(selectedBranch);
      const trackOk = selectedTrack === 'all' || mod.track === 'both' || mod.track === selectedTrack;
      const yearOk = selectedYear === 'all' || mod.year === Number(selectedYear);
      return branchOk && trackOk && yearOk;
    });
  }, [selectedBranch, selectedTrack, selectedYear]);

  const allVisibleTasks = useMemo(
    () => filteredModules.flatMap(m => m.tasks),
    [filteredModules]
  );

  const completedVisibleCount = useMemo(
    () => allVisibleTasks.filter(t => completedTaskIds.includes(t.id)).length,
    [allVisibleTasks, completedTaskIds]
  );

  const progressPct = allVisibleTasks.length > 0
    ? Math.round((completedVisibleCount / allVisibleTasks.length) * 100)
    : 0;

  const toggleTask = (taskId, label) => {
    const alreadyDone = completedTaskIds.includes(taskId);
    if (alreadyDone) {
      setCompletedTaskIds(prev => prev.filter(id => id !== taskId));
    } else {
      setCompletedTaskIds(prev => [...prev, taskId]);
      if (awardXP) awardXP(25, `Bridge to B.Tech milestone: ${label.slice(0, 40)}`);
      if (addToast) addToast({ message: '+25 XP • Bridge milestone completed!', type: 'success' });
    }
  };

  const activeBranchInfo = BRANCHES.find(b => b.id === selectedBranch) || BRANCHES[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0B0F2A] via-[#131942] to-[#1E1B4B] rounded-2xl p-6 text-white shadow-lg border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[11px] font-bold mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>GPREC Autonomous Curriculum (R20 / R23) → Industry Bridge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bridge to B.Tech Placement Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Connect your semester B.Tech syllabus directly to high-paying placement competencies. Track milestones across Years 1–4 and jump straight into Coding, Aptitude, Projects, and Mock Interviews.
            </p>
          </div>

          {/* Progress Ring Summary Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 min-w-[230px] flex items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.15)" strokeWidth="7" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#38BDF8"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="201"
                  strokeDashoffset={201 * (1 - progressPct / 100)}
                />
              </svg>
              <span className="absolute text-sm font-black text-white">{progressPct}%</span>
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Bridge Progress</div>
              <div className="text-lg font-extrabold text-white mt-0.5">
                {completedVisibleCount} / {allVisibleTasks.length}
              </div>
              <div className="text-[11px] text-slate-300">Milestones Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar: Branch, Track, Year */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-purple-600" />
              <span>Personalize Your GPREC B.Tech Bridge</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Active Focus ({activeBranchInfo.name}): <span className="font-semibold text-slate-700">{activeBranchInfo.focus}</span>
            </div>
          </div>

          {/* Track Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
            {[
              { id: 'all', label: 'All Tracks' },
              { id: 'software', label: 'Software / IT' },
              { id: 'core', label: 'Core & GATE' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTrack(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTrack === t.id
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Branch Pills & Year Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Branch:</span>
            {BRANCHES.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBranch(b.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  selectedBranch === b.id
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Year:</span>
            {['all', 1, 2, 3, 4].map(yr => (
              <button
                key={String(yr)}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  selectedYear === yr
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {yr === 'all' ? 'All Years' : `Year ${yr}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Semester Bridge Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredModules.map(mod => {
          const doneCount = mod.tasks.filter(t => completedTaskIds.includes(t.id)).length;
          const allDone = doneCount === mod.tasks.length;
          return (
            <div
              key={mod.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all ${
                allDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200/80 hover:border-purple-300'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 uppercase">
                      Year {mod.year} • {mod.semester}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      {mod.weightage}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${allDone ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {doneCount}/{mod.tasks.length} Done
                  </span>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    B.Tech Course: {mod.btechSubject}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
                    <span>{mod.industryBridge}</span>
                  </h3>
                </div>

                {/* Checklist */}
                <div className="space-y-2 pt-1">
                  {mod.tasks.map(task => {
                    const checked = completedTaskIds.includes(task.id);
                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => toggleTask(task.id, task.label)}
                        className={`w-full text-left p-2.5 rounded-xl border flex items-start gap-2.5 transition-all cursor-pointer ${
                          checked
                            ? 'bg-emerald-50/70 border-emerald-200 text-slate-500 line-through'
                            : 'bg-slate-50/70 border-slate-100 hover:border-purple-200 text-slate-800'
                        }`}
                      >
                        {checked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-xs font-medium leading-snug">{task.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-medium">
                  Connected GPREC Suite Module
                </span>
                <button
                  onClick={() => navigateTo(mod.targetNav, mod.targetSub)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <span>{mod.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Core Subject Interview Bridge Quick Cards */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">B.Tech Core Subjects → Interview Cheat Matrix</h3>
            <p className="text-xs text-slate-500">High-frequency syllabus concepts tested directly in campus technical interviews.</p>
          </div>
          <button
            onClick={() => navigateTo('mock_interviews', 'mock_interview')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 w-fit cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Practice Core CS Viva</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CORE_SUBJECT_CARDS.map(card => (
            <div key={card.subject} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold text-purple-600 uppercase">{card.tag}</div>
                <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">{card.subject}</h4>
                <ul className="mt-2.5 space-y-1.5">
                  {card.topics.map(tp => (
                    <li key={tp} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                      <span>{tp}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 leading-snug">
                <span className="font-bold">Interview Tip:</span> {card.tip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
