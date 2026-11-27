import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Layers, Sparkles, TrendingUp, Search, Plus, CheckCircle2,
  AlertCircle, Bug, FileText, Video, Eye, Shield, Tag, Calendar,
  BarChart3, CheckSquare, Clock, ArrowRight, Share2, Filter, ExternalLink,
  Megaphone, Send, X, Trash2, Pin, ShieldCheck, ChevronRight
} from 'lucide-react';
import realInternsData from '../../data/realInternsBatch01.json';

export default function NexusDepartmentWorkspace({
  session,
  activeRole,
  onNavigateTab,
  isFounder = false
}) {
  const [activeToolTab, setActiveToolTab] = useState('tool_primary');
  
  // Real Batch 01 cohort members in this department
  const departmentMembers = realInternsData.filter(i => 
    i.roleId === activeRole?.id || 
    (activeRole?.id === 'marketing' && (i.roleTitle || '').toLowerCase().includes('marketing')) ||
    (activeRole?.id === 'research' && (i.roleTitle || '').toLowerCase().includes('research')) ||
    (activeRole?.id === 'content_creation' && (i.roleTitle || '').toLowerCase().includes('content')) ||
    (activeRole?.id === 'software_testing' && ((i.roleTitle || '').toLowerCase().includes('testing') || (i.roleTitle || '').toLowerCase().includes('qa')))
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // DEPARTMENT DIRECTIVES & ANNOUNCEMENTS (Department-Wise Posting)
  // ─────────────────────────────────────────────────────────────────────────────
  const DEFAULT_DEPARTMENT_ANNOUNCEMENTS = [
    {
      id: 'ann-qa-1',
      department: 'software_testing',
      departmentLabel: 'Software Testing & QA',
      author: 'Shaik Sowban',
      authorRole: 'Founder & Tech Lead',
      title: 'Week 01 Priority: Auth Token Boundaries & Code Arena Mobile Viewports',
      content: 'All QA scholars must run boundary tests across Chromium and WebKit mobile viewports (375px to 1440px). Document any token expiration anomalies or layout shifts directly into the S1-S4 matrix.',
      priority: 'Critical Sprint Directive',
      createdAt: '2026-11-20T10:00:00Z',
      pinned: true
    },
    {
      id: 'ann-mkt-1',
      department: 'marketing',
      departmentLabel: 'Growth Marketing',
      author: 'Shaik Sowban',
      authorRole: 'Founder & Tech Lead',
      title: 'Campus Ambassador Codes Activated for Batch 01',
      content: 'Your individual ambassador referral URLs are active and tracking student clicks. Formulate the 30-day viral loop launch funnel and campus outreach collateral for pre-final years.',
      priority: 'Sprint Priority',
      createdAt: '2026-11-20T10:00:00Z',
      pinned: true
    },
    {
      id: 'ann-res-1',
      department: 'research',
      departmentLabel: 'Research & Product Intelligence',
      author: 'Shaik Sowban',
      authorRole: 'Founder & Tech Lead',
      title: 'Moat Benchmarking Focus: Placement Prep Instability',
      content: 'Synthesize student survey transcripts focusing on placement anxiety. Highlight where existing platforms fail engineering scholars in tier-2 and tier-3 colleges.',
      priority: 'Sprint Priority',
      createdAt: '2026-11-20T10:00:00Z',
      pinned: true
    },
    {
      id: 'ann-cc-1',
      department: 'content_creation',
      departmentLabel: 'Content Creation',
      author: 'Shaik Sowban',
      authorRole: 'Founder & Tech Lead',
      title: '60s Cinematic Explainer Video Style Guide',
      content: 'Follow Apple-inspired motion design: dark aesthetic, sharp sans-serif typography, high contrast, and authentic screen recording captures of the AI Placement Commander.',
      priority: 'Sprint Priority',
      createdAt: '2026-11-20T10:00:00Z',
      pinned: true
    },
    {
      id: 'ann-global-1',
      department: 'all',
      departmentLabel: 'All Departments (Global Broadcast)',
      author: 'Shaik Sowban',
      authorRole: 'Founder & Tech Lead',
      title: 'Official Batch 01 Orientation Kickoff Confirmed',
      content: 'All-hands kickoff is confirmed for Sunday, 30 Nov 2026 at 11:00 AM IST on Google Meet. Please review your weekly mission scopes before the call.',
      priority: 'Executive Broadcast',
      createdAt: '2026-11-21T09:00:00Z',
      pinned: true
    }
  ];

  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_department_announcements');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_DEPARTMENT_ANNOUNCEMENTS;
  });

  // Filter announcements for current department (only matching department + global broadcasts)
  const currentDeptAnnouncements = useMemo(() => {
    const deptId = activeRole?.id || 'software_testing';
    return announcements.filter(a => {
      if (a.department === 'all') return true;
      if (a.department === deptId) return true;
      if (deptId === 'software_testing' && (a.department === 'testing' || a.department === 'qa')) return true;
      if (deptId === 'marketing' && a.department === 'marketing') return true;
      if (deptId === 'research' && a.department === 'research') return true;
      if (deptId === 'content_creation' && a.department === 'content_creation') return true;
      return false;
    });
  }, [announcements, activeRole?.id]);

  // Founder Post Announcement Modal State
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postForm, setPostForm] = useState({
    targetDept: activeRole?.id || 'all',
    title: '',
    content: '',
    priority: 'Executive Directive'
  });

  const handlePublishDirective = (e) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) return;

    const deptLabels = {
      all: 'All Departments (Global Broadcast)',
      software_testing: 'Software Testing & QA',
      marketing: 'Growth Marketing',
      research: 'Research & Product Intelligence',
      content_creation: 'Content Creation'
    };

    const newDirective = {
      id: `ann-${Date.now()}`,
      department: postForm.targetDept,
      departmentLabel: deptLabels[postForm.targetDept] || 'Department Directive',
      author: 'Shaik Sowban',
      authorRole: 'Founder, CEO & Tech Lead',
      title: postForm.title.trim(),
      content: postForm.content.trim(),
      priority: postForm.priority,
      createdAt: new Date().toISOString(),
      pinned: true
    };

    const updated = [newDirective, ...announcements];
    setAnnouncements(updated);
    try {
      localStorage.setItem('lumixora_department_announcements', JSON.stringify(updated));
    } catch (_) {}

    setPostModalOpen(false);
    setPostForm({
      targetDept: activeRole?.id || 'all',
      title: '',
      content: '',
      priority: 'Executive Directive'
    });
  };

  const handleDeleteDirective = (id) => {
    if (window.confirm('Delete this directive?')) {
      const updated = announcements.filter(a => a.id !== id);
      setAnnouncements(updated);
      try {
        localStorage.setItem('lumixora_department_announcements', JSON.stringify(updated));
      } catch (_) {}
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. MARKETING TOOLS STATE & DATA (Persistent)
  // ─────────────────────────────────────────────────────────────────────────────
  const [campaigns, setCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_real_campaigns');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      { id: 'c1', name: 'Rayalaseema Campus Blitz 2026', channel: 'Instagram + WhatsApp', reach: 'Campus Scholars', status: 'Live', conversion: 'Active' },
      { id: 'c2', name: 'GPREC Placement Radar Teaser', channel: 'LinkedIn Carousels', reach: 'Engineering Final Years', status: 'In Progress', conversion: 'Tracked' }
    ];
  });

  const [referrals, setReferrals] = useState(() => {
    const myCode = session?.id || 'LMX-B01';
    return [
      { code: myCode, ambassador: session?.name || 'My Ambassador Link', clicks: 12, signups: 3, tier: 'Active Intern' },
      { code: 'LMX-GPREC-AMB', ambassador: 'Mohammed Nazia', clicks: 42, signups: 18, tier: 'Diamond' },
      { code: 'LMX-CAMPUS-AIML', ambassador: 'Lakshmi Kushala', clicks: 31, signups: 14, tier: 'Gold' }
    ];
  });

  const [copiedMyRef, setCopiedMyRef] = useState(false);
  const myRefUrl = `https://lumixora.in/?ref=${session?.id || 'LMX-B01'}`;

  const copyMyRefUrl = () => {
    navigator.clipboard.writeText(myRefUrl);
    setCopiedMyRef(true);
    setTimeout(() => setCopiedMyRef(false), 3000);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. RESEARCH TOOLS STATE & DATA (Persistent)
  // ─────────────────────────────────────────────────────────────────────────────
  const [researchLibrary, setResearchLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_real_research');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      { id: 'r1', title: 'EdTech Market Moat & Pricing Elasticity Matrix', category: 'Competitive Moats', date: 'Nov 2026', author: 'Lakshmi Kushala', status: 'Active Sprint' },
      { id: 'r2', title: 'Undergraduate Coding Preparation Bottlenecks (GPREC Campus)', category: 'Student Interviews', date: 'Nov 2026', author: 'Research Track', status: 'In Progress' }
    ];
  });

  const [competitorIntel, setCompetitorIntel] = useState([
    { name: 'Unstop (Dare2Compete)', strength: 'Broad hackathon volume', weakness: 'Generic UI, zero 3D classroom coaching', moatVsLumixora: 'Lumixora has AI Placement Commander + 3D Lumina Classroom' },
    { name: 'LeetCode / HackerRank', strength: 'Massive problem bank', weakness: 'High barrier to entry for tier-2/3 college scholars', moatVsLumixora: 'Lumixora provides real company previous papers + syllabus-matched ML' },
    { name: 'PrepInsta Prime', strength: 'Indian campus placement focus', weakness: 'Pre-recorded static videos, no live AI mock simulator', moatVsLumixora: 'Lumixora SpeakVerse real-time voice interview coach' }
  ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. CONTENT CREATION TOOLS STATE & DATA (Persistent)
  // ─────────────────────────────────────────────────────────────────────────────
  const [contentItems, setContentItems] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_real_content_items');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      { id: 'ct1', title: 'How to Crack DSA in 90 Days (Figma Carousel)', platform: 'LinkedIn', format: '1080x1350 Carousel', status: 'Ready for Review', due: 'Nov 29' },
      { id: 'ct2', title: '60s Cinema Walkthrough of Lumixora Code Arena', platform: 'Instagram Reels', format: '9:16 Vertical Video', status: 'In Production', due: 'Dec 01' },
      { id: 'ct3', title: 'AI Mock Interview Voice Coach Announcement', platform: 'Multi-Channel', format: 'Static Poster + Script', status: 'Approved', due: 'Dec 03' }
    ];
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. PRODUCT TESTING TOOLS STATE & DATA (Persistent & Interactive)
  // ─────────────────────────────────────────────────────────────────────────────
  const [bugs, setBugs] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_real_bugs');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      { id: 'BUG-101', title: 'Auth modal token expiry clears active tab without warning', module: 'Auth & Security', severity: 'S2 Critical', status: 'In Triage', reporter: session?.name || 'Batch 01 QA' },
      { id: 'BUG-102', title: 'Mobile viewport overflow on 375px in Code Arena editor', module: 'Code Arena', severity: 'S3 Major', status: 'Resolved', reporter: 'Bosle Tulasi' }
    ];
  });

  const [testCases, setTestCases] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_real_test_cases');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      { id: 'TC-01', feature: 'Google OAuth & Email Login Boundary Isolation', status: 'PASSED' },
      { id: 'TC-02', feature: 'Judge0 Cloud Execution Engine for C++/Java/Python', status: 'PASSED' },
      { id: 'TC-03', feature: 'SpeakVerse Web Audio API Mic Permissions & Stream', status: 'IN PROGRESS' },
      { id: 'TC-04', feature: 'Certificate Verifiable QR Link Redirection (lumixora.in/verify)', status: 'PASSED' },
      { id: 'TC-05', feature: 'Notes Platform Multi-page PDF Canvas Rendering', status: 'PASSED' }
    ];
  });

  // New Bug Log Modal State
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [bugForm, setBugForm] = useState({
    title: '',
    module: 'Auth & Security',
    severity: 'S2 Critical',
    steps: ''
  });

  const handleAddBug = (e) => {
    e.preventDefault();
    if (!bugForm.title.trim()) return;

    const newBug = {
      id: `BUG-${100 + bugs.length + 1}`,
      title: bugForm.title.trim(),
      module: bugForm.module,
      severity: bugForm.severity,
      status: 'In Triage',
      reporter: session?.name || 'Batch 01 QA'
    };

    const updated = [newBug, ...bugs];
    setBugs(updated);
    try {
      localStorage.setItem('lumixora_real_bugs', JSON.stringify(updated));
    } catch (_) {}

    setBugModalOpen(false);
    setBugForm({ title: '', module: 'Auth & Security', severity: 'S2 Critical', steps: '' });
  };

  const toggleTestCaseStatus = (id) => {
    setTestCases(prev => {
      const updated = prev.map(tc => {
        if (tc.id !== id) return tc;
        const next = tc.status === 'PASSED' ? 'FAILED' : tc.status === 'FAILED' ? 'BLOCKED' : 'PASSED';
        return { ...tc, status: next };
      });
      try {
        localStorage.setItem('lumixora_real_test_cases', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* ── TOP DEPARTMENT BANNER ── */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d1222] via-[#090d18] to-[#06080e] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-cyan-400">
              EXCLUSIVE DEPARTMENT WORKSPACE
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs font-bold text-slate-300">{activeRole?.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {activeRole?.shortTitle} Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            {activeRole?.summary || 'Collaborative production workspace with department-exclusive tooling, cohort teammates, and shared resources.'}
          </p>
        </div>

        {/* Lead Badge & Founder Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shrink-0">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300">
              SS
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Track Lead</span>
              <span className="text-xs font-bold text-white">Shaik Sowban</span>
              <span className="text-[10px] text-cyan-400 block font-semibold">Founder & Chief Architect</span>
            </div>
          </div>

          {/* Founder Quick Post Button */}
          {isFounder && (
            <button
              onClick={() => {
                setPostForm(p => ({ ...p, targetDept: activeRole?.id || 'all' }));
                setPostModalOpen(true);
              }}
              className="px-4 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-400/20 cursor-pointer transition-all"
              title="Post official directive for this department"
            >
              <Megaphone className="w-4 h-4" />
              <span>Post Directive</span>
            </button>
          )}
        </div>
      </div>

      {/* ── DEPARTMENT DIRECTIVES FROM FOUNDER SHAIK SOWBAN ── */}
      <div className="rounded-3xl bg-[#090d19] border border-cyan-500/30 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>Official Directives from Founder Shaik Sowban</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {activeRole?.shortTitle}
                </span>
              </h3>
              <p className="text-[11px] text-gray-400">Department-specific directives and strategic instructions</p>
            </div>
          </div>

          {isFounder && (
            <button
              onClick={() => {
                setPostForm(p => ({ ...p, targetDept: activeRole?.id || 'all' }));
                setPostModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-white/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Directive</span>
            </button>
          )}
        </div>

        {/* Directives Feed (Filtered specifically for this department + global broadcasts) */}
        <div className="space-y-3">
          {currentDeptAnnouncements.length > 0 ? (
            currentDeptAnnouncements.map((directive) => (
              <div
                key={directive.id}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 space-y-2 transition-all relative"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {directive.priority || 'Directive'}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {directive.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <span className="font-mono">{new Date(directive.createdAt).toLocaleDateString()}</span>
                    {isFounder && (
                      <button
                        onClick={() => handleDeleteDirective(directive.id)}
                        className="text-gray-500 hover:text-rose-400 p-1 rounded cursor-pointer"
                        title="Delete directive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {directive.content}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-gray-400 font-mono">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    Authorized by {directive.author} ({directive.authorRole})
                  </span>
                  <span className="text-purple-300">
                    Target: {directive.departmentLabel || (directive.department === 'all' ? 'All Cohort' : activeRole?.shortTitle)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-gray-400 border border-dashed border-white/10 rounded-2xl">
              No directives posted yet for this department. Check back soon for sprint updates.
            </div>
          )}
        </div>
      </div>

      {/* ── DEPARTMENT TEAM MEMBERS STRIP ── */}
      <div className="rounded-2xl bg-[#0a0e19] border border-white/10 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              {activeRole?.shortTitle} Team Members ({departmentMembers.length || activeRole?.count || 5})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Batch 01 Official Cohort</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(departmentMembers.length > 0 ? departmentMembers.slice(0, 8) : [
            { id: 'LMX-B01-4783', name: 'Lakshmi Kushala', roleTitle: 'Research Intern', college: 'GPREC' },
            { id: 'LMX-B01-1726', name: 'Bosle TulasiLakshmi', roleTitle: 'QA Intern', college: 'GPREC' },
            { id: 'LMX-B01-4734', name: 'Mohammed Nazia', roleTitle: 'Marketing Intern', college: 'GPREC' },
            { id: 'LMX-B01-5958', name: 'Sucharitha Reddy', roleTitle: 'Content Intern', college: 'GPREC' }
          ]).map((member, mIdx) => (
            <div key={mIdx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0">
                {(member.name || 'IN').substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{member.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{member.id} • {member.college || 'GPREC'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DEPARTMENT-SPECIFIC PROFESSIONAL TOOLS ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400">EXCLUSIVE SUITE TOOLS</span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {activeRole?.id === 'marketing' && 'Marketing Engine: Campaigns & Ambassador Referrals'}
              {activeRole?.id === 'research' && 'Research Hub: Moat Intelligence & Survey Studio'}
              {activeRole?.id === 'content_creation' && 'Creative Studio: Editorial Calendar & Asset Library'}
              {activeRole?.id === 'software_testing' && 'QA Command: S1-S4 Bug Tracking & Test Checklist'}
            </h2>
          </div>
        </div>

        {/* ══════ 1. MARKETING EXCLUSIVE VIEW ══════ */}
        {activeRole?.id === 'marketing' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-cyan-500/10 border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400 block">Your Official Ambassador Referral Link</span>
                <p className="text-xs font-mono text-white mt-0.5 truncate max-w-md">{myRefUrl}</p>
                <span className="text-[10px] text-slate-400">Share with student groups to earn verified growth credits.</span>
              </div>
              <button
                onClick={copyMyRefUrl}
                className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shrink-0"
              >
                {copiedMyRef ? <CheckCircle2 className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedMyRef ? 'Copied Link!' : 'Copy Referral URL'}</span>
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Active Campaign Planner</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {campaigns.map(c => (
                  <div key={c.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{c.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 font-mono">{c.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Channel: {c.channel}</p>
                    <p className="text-[11px] text-cyan-300 font-mono">Target: {c.reach}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════ 2. RESEARCH EXCLUSIVE VIEW ══════ */}
        {activeRole?.id === 'research' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Research Dossier & Competitive Moat Library</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {researchLibrary.map(r => (
                  <div key={r.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">{r.category}</span>
                    <h4 className="text-xs font-bold text-white">{r.title}</h4>
                    <p className="text-[11px] text-slate-400">Author: {r.author} • {r.date}</p>
                    <span className="text-[10px] text-emerald-400 font-bold block">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Competitor Moat Benchmarks (Live Intelligence)</span>
              </h3>
              <div className="space-y-2.5">
                {competitorIntel.map((ci, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{ci.name}</span>
                      <span className="text-[10px] text-rose-300 font-mono">Weakness: {ci.weakness}</span>
                    </div>
                    <p className="text-xs text-cyan-300 font-medium">⚡ Lumixora Moat: {ci.moatVsLumixora}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════ 3. CONTENT CREATION EXCLUSIVE VIEW ══════ */}
        {activeRole?.id === 'content_creation' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Editorial Content Calendar & Approval Pipeline</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {contentItems.map(item => (
                  <div key={item.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-cyan-400">{item.platform}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300 font-bold">{item.status}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[10px] text-slate-400">Format: {item.format}</p>
                    <span className="text-[10px] text-amber-300 font-semibold block">Due: {item.due}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════ 4. PRODUCT TESTING (QA) EXCLUSIVE VIEW ══════ */}
        {activeRole?.id === 'software_testing' && (
          <div className="space-y-6">
            {/* Interactive Feature Testing Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  <span>Production Feature Test Checklist (Interactive)</span>
                </h3>
                <span className="text-[11px] text-slate-400">Click row to toggle Pass / Fail</span>
              </div>
              <div className="space-y-2">
                {testCases.map(tc => (
                  <div
                    key={tc.id}
                    onClick={() => toggleTestCaseStatus(tc.id)}
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold text-slate-400">{tc.id}</span>
                      <span className="text-xs font-semibold text-white">{tc.feature}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                      tc.status === 'PASSED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      tc.status === 'FAILED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      tc.status === 'BLOCKED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {tc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* S1-S4 Severity Bug Registry & Log Button */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Bug className="w-4 h-4 text-rose-400" />
                  <span>S1-S4 Bug Tracking & Defect Matrix</span>
                </h3>
                <button
                  onClick={() => setBugModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Verified Defect</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 text-[11px] font-bold uppercase border-b border-white/10">
                    <tr>
                      <th className="p-3">Defect ID</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Module</th>
                      <th className="p-3">Severity</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {bugs.map(b => (
                      <tr key={b.id} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-mono text-cyan-400 font-bold">{b.id}</td>
                        <td className="p-3 font-semibold text-white">{b.title}</td>
                        <td className="p-3 text-slate-300">{b.module}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.severity.includes('S1') ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' :
                            b.severity.includes('S2') ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                            'bg-amber-500/20 text-amber-300'
                          }`}>
                            {b.severity}
                          </span>
                        </td>
                        <td className="p-3 text-emerald-400 font-semibold">{b.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FOUNDER POST DIRECTIVE MODAL ── */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0c101c] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Post Official Department Directive</h3>
                  <p className="text-[11px] text-gray-400">Executive Action by Shaik Sowban (Founder & Tech Lead)</p>
                </div>
              </div>
              <button
                onClick={() => setPostModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishDirective} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Target Department</label>
                <select
                  value={postForm.targetDept}
                  onChange={e => setPostForm(p => ({ ...p, targetDept: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-cyan-400 text-xs font-semibold cursor-pointer"
                >
                  <option value="all">🌐 All Departments (Global Broadcast)</option>
                  <option value="software_testing">🧪 Software Testing & QA</option>
                  <option value="marketing">📈 Growth Marketing</option>
                  <option value="research">🔬 Research & Product Intelligence</option>
                  <option value="content_creation">🎨 Content Creation</option>
                </select>
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  Directive will appear immediately in the selected department's workspace feed.
                </span>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Directive Title</label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={e => setPostForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Focus Week 01 on Auth Boundary Testing"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-cyan-400 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Priority / Category</label>
                <select
                  value={postForm.priority}
                  onChange={e => setPostForm(p => ({ ...p, priority: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-cyan-400 text-xs cursor-pointer"
                >
                  <option value="Executive Directive">Executive Directive</option>
                  <option value="Critical Sprint Priority">Critical Sprint Priority</option>
                  <option value="Technical Specification">Technical Specification</option>
                  <option value="Resource Drop">Resource Drop</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Directive Scope & Instructions</label>
                <textarea
                  value={postForm.content}
                  onChange={e => setPostForm(p => ({ ...p, content: e.target.value }))}
                  placeholder="Detail the technical expectations, deliverable criteria, and sprint targets for this department..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-cyan-400 text-xs leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-black text-xs shadow-lg shadow-cyan-400/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Department Directive</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LOG NEW DEFECT MODAL (QA Track) ── */}
      {bugModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0c101c] border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                  <Bug className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Log Verified Production Defect</h3>
                  <p className="text-[11px] text-gray-400">Document S1-S4 issue in Lumixora codebase</p>
                </div>
              </div>
              <button
                onClick={() => setBugModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBug} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Defect Title</label>
                <input
                  type="text"
                  value={bugForm.title}
                  onChange={e => setBugForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Session token clears on background tab switch"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-rose-400 text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Module</label>
                  <select
                    value={bugForm.module}
                    onChange={e => setBugForm(p => ({ ...p, module: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-rose-400 text-xs cursor-pointer"
                  >
                    <option value="Auth & Security">Auth & Security</option>
                    <option value="Code Arena">Code Arena</option>
                    <option value="Notes Platform">Notes Platform</option>
                    <option value="Placement Commander">Placement Commander</option>
                    <option value="SpeakVerse AI">SpeakVerse AI</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Severity</label>
                  <select
                    value={bugForm.severity}
                    onChange={e => setBugForm(p => ({ ...p, severity: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-rose-400 text-xs cursor-pointer font-bold"
                  >
                    <option value="S1 Blocker">S1 Blocker (Crash / Fatal)</option>
                    <option value="S2 Critical">S2 Critical (Core Broken)</option>
                    <option value="S3 Major">S3 Major (Layout / UI Defect)</option>
                    <option value="S4 Minor">S4 Minor (Cosmetic / Typo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Reproduction Steps & Expected Behavior</label>
                <textarea
                  value={bugForm.steps}
                  onChange={e => setBugForm(p => ({ ...p, steps: e.target.value }))}
                  placeholder="1. Navigate to ... 2. Click ... 3. Observed: ... Expected: ..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-rose-400 text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setBugModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs shadow-lg shadow-rose-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Bug className="w-4 h-4" />
                  <span>Log Defect</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
