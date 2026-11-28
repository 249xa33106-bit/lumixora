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
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_department_announcements');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
  });

  // Filter announcements for current department
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

  // Founder Post Directive Modal
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postForm, setPostForm] = useState({
    targetDept: activeRole?.id || 'all',
    title: '',
    content: '',
    priority: 'Sprint Directive'
  });

  const handlePostDirective = (e) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) return;

    const newDirective = {
      id: `dir-${Date.now()}`,
      department: postForm.targetDept,
      departmentLabel: postForm.targetDept === 'all' 
        ? 'All Departments (Global)' 
        : (postForm.targetDept === 'software_testing' ? 'Software Testing & QA' :
           postForm.targetDept === 'marketing' ? 'Growth Marketing' :
           postForm.targetDept === 'research' ? 'Research & Intelligence' : 'Content Creation'),
      author: 'Shaik Sowban',
      authorRole: 'Founder & Tech Lead',
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
      priority: 'Sprint Directive'
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
    return [];
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
    return [];
  });

  const competitorIntel = [
    { name: 'Unstop (Dare2Compete)', strength: 'Broad hackathon volume', weakness: 'Generic UI, zero 3D classroom coaching', moatVsLumixora: 'Lumixora has AI Placement Commander + 3D Lumina Classroom' },
    { name: 'LeetCode / HackerRank', strength: 'Massive problem bank', weakness: 'High barrier to entry for tier-2/3 college scholars', moatVsLumixora: 'Lumixora provides real company previous papers + syllabus-matched ML' },
    { name: 'PrepInsta Prime', strength: 'Indian campus placement focus', weakness: 'Pre-recorded static videos, no live AI mock simulator', moatVsLumixora: 'Lumixora SpeakVerse real-time voice interview coach' }
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. CONTENT CREATION TOOLS STATE & DATA (Persistent)
  // ─────────────────────────────────────────────────────────────────────────────
  const [contentItems, setContentItems] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_real_content_items');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. PRODUCT TESTING TOOLS STATE & DATA (Persistent & Interactive)
  // ─────────────────────────────────────────────────────────────────────────────
  const [bugs, setBugs] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_real_bugs');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
  });

  const [testCases, setTestCases] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_real_test_cases');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
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

  const [testCaseModalOpen, setTestCaseModalOpen] = useState(false);
  const [testCaseInput, setTestCaseInput] = useState('');

  const handleAddTestCase = (e) => {
    e.preventDefault();
    if (!testCaseInput.trim()) return;
    const newTC = {
      id: `TC-${String(testCases.length + 1).padStart(2, '0')}`,
      feature: testCaseInput.trim(),
      status: 'IN PROGRESS'
    };
    const updated = [...testCases, newTC];
    setTestCases(updated);
    try {
      localStorage.setItem('lumixora_real_test_cases', JSON.stringify(updated));
    } catch (_) {}
    setTestCaseInput('');
    setTestCaseModalOpen(false);
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
              onClick={() => setPostModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer shrink-0"
            >
              <Megaphone className="w-4 h-4" />
              <span>Post Directive</span>
            </button>
          )}
        </div>
      </div>

      {/* ── DEPARTMENT DIRECTIVES & NOTICES STRIP ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-white">
              Department Directives & Founder Announcements
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {currentDeptAnnouncements.length} Active {currentDeptAnnouncements.length === 1 ? 'Directive' : 'Directives'}
          </span>
        </div>

        {currentDeptAnnouncements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentDeptAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="p-5 rounded-3xl bg-[#0a0f1d] border border-cyan-500/20 shadow-lg space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {ann.departmentLabel || 'Directive'}
                    </span>
                    <span className="text-[10px] text-purple-300 font-mono font-bold">
                      {ann.priority}
                    </span>
                  </div>
                  {isFounder && (
                    <button
                      onClick={() => handleDeleteDirective(ann.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete directive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                  <span>Author: {ann.author} ({ann.authorRole})</span>
                  <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400">
            No departmental directives posted yet. Directives posted by Founder Shaik Sowban will appear here.
          </div>
        )}
      </div>

      {/* ── COHORT TEAMMATES LIST ── */}
      <div className="rounded-3xl bg-[#0a0e18] border border-white/10 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-white">
              {activeRole?.shortTitle} Cohort Teammates
            </h2>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            {departmentMembers.length} Selected Interns
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {departmentMembers.map(member => (
            <div
              key={member.id}
              className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 hover:border-white/15 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">{member.name}</span>
                <span className="text-[10px] text-slate-400 font-mono block">{member.id}</span>
                <span className="text-[10px] text-slate-500 block truncate">{member.college || 'GPREC'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DEPARTMENT-SPECIFIC INTERACTIVE SUITE ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
              Exclusive Suite Tools
            </span>
            <h2 className="text-base font-black text-white">
              {activeRole?.shortTitle} Production Engine
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
              {campaigns.length > 0 ? (
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
              ) : (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400">
                  No active marketing campaigns scheduled yet. Interns can submit growth proposals in the Innovation Arena.
                </div>
              )}
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
              {researchLibrary.length > 0 ? (
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
              ) : (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400">
                  No research dossiers uploaded yet. Research papers and student surveys submitted by interns will be archived here.
                </div>
              )}
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
              {contentItems.length > 0 ? (
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
              ) : (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400">
                  No editorial assets in production yet. Video storyboards, Figma carousels, and scripts will appear here once submitted.
                </div>
              )}
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
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Click row to toggle Pass / Fail</span>
                  <button
                    onClick={() => setTestCaseModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold flex items-center gap-1 border border-white/10"
                  >
                    <Plus className="w-3 h-3 text-cyan-400" />
                    <span>Add Test Case</span>
                  </button>
                </div>
              </div>

              {testCases.length > 0 ? (
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
              ) : (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400">
                  No test cases in the active checklist yet. QA interns can add test cases as they verify features.
                </div>
              )}
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
                    {bugs.length > 0 ? (
                      bugs.map(b => (
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-6 text-center text-slate-400 text-xs">
                          No production defects logged yet. QA interns can report bugs using "+ Log Verified Defect".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS: ADD TEST CASE ── */}
      {testCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0c101c] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white">Add New Test Case</h3>
              <button onClick={() => setTestCaseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddTestCase} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Feature / Scenario Name</label>
                <input
                  type="text"
                  required
                  value={testCaseInput}
                  onChange={e => setTestCaseInput(e.target.value)}
                  placeholder="e.g. Google OAuth redirect & session token storage"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 font-medium"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setTestCaseModalOpen(false)} className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black">
                  Add Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <h3 className="text-sm font-black text-white">Post Department Directive</h3>
                  <p className="text-[11px] text-slate-400">Broadcast official instruction to intern workspace</p>
                </div>
              </div>
              <button
                onClick={() => setPostModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostDirective} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Target Department</label>
                <select
                  value={postForm.targetDept}
                  onChange={e => setPostForm({ ...postForm, targetDept: e.target.value })}
                  className="w-full bg-[#121829] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 font-medium"
                >
                  <option value="software_testing">Software Testing & QA</option>
                  <option value="marketing">Growth Marketing</option>
                  <option value="research">Research & Competitive Intelligence</option>
                  <option value="content_creation">Content Creation & Visual Media</option>
                  <option value="all">All Departments (Global Broadcast)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Directive Headline</label>
                <input
                  type="text"
                  required
                  value={postForm.title}
                  onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                  placeholder="e.g. Week 01 Priority: Auth Token Boundary Testing"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Directive Instructions & Scope</label>
                <textarea
                  rows={4}
                  required
                  value={postForm.content}
                  onChange={e => setPostForm({ ...postForm, content: e.target.value })}
                  placeholder="Detail the sprint expectations, boundary conditions, and acceptance criteria..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Priority Level</label>
                <select
                  value={postForm.priority}
                  onChange={e => setPostForm({ ...postForm, priority: e.target.value })}
                  className="w-full bg-[#121829] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono"
                >
                  <option value="Sprint Priority">Sprint Priority</option>
                  <option value="Critical Sprint Directive">Critical Sprint Directive</option>
                  <option value="Executive Broadcast">Executive Broadcast</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-md cursor-pointer transition-all"
                >
                  Broadcast Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODALS: LOG BUG ── */}
      {bugModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0c101c] border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                  <Bug className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Log Production Defect</h3>
                  <p className="text-[11px] text-slate-400">Record reproducible anomaly for engineering triage</p>
                </div>
              </div>
              <button
                onClick={() => setBugModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBug} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Defect Title</label>
                <input
                  type="text"
                  required
                  value={bugForm.title}
                  onChange={e => setBugForm({ ...bugForm, title: e.target.value })}
                  placeholder="e.g. Session token expiry unmounts active editor"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-rose-400 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Module</label>
                  <select
                    value={bugForm.module}
                    onChange={e => setBugForm({ ...bugForm, module: e.target.value })}
                    className="w-full bg-[#121829] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-rose-400"
                  >
                    <option value="Auth & Security">Auth & Security</option>
                    <option value="Notes Platform">Notes Platform</option>
                    <option value="Code Arena">Code Arena</option>
                    <option value="SpeakVerse Voice">SpeakVerse Voice</option>
                    <option value="Placement Commander">Placement Commander</option>
                    <option value="Intern Portal">Intern Portal</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Severity</label>
                  <select
                    value={bugForm.severity}
                    onChange={e => setBugForm({ ...bugForm, severity: e.target.value })}
                    className="w-full bg-[#121829] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-rose-400 font-mono"
                  >
                    <option value="S1 Blocker">S1 Blocker (Crash/Data Loss)</option>
                    <option value="S2 Critical">S2 Critical (Core Broken)</option>
                    <option value="S3 Major">S3 Major (Layout/Feature Gap)</option>
                    <option value="S4 Minor">S4 Minor (Cosmetic/Polish)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Steps to Reproduce & Expected Behavior</label>
                <textarea
                  rows={3}
                  value={bugForm.steps}
                  onChange={e => setBugForm({ ...bugForm, steps: e.target.value })}
                  placeholder="1. Open Code Arena... 2. Throttle network to Slow 3G... 3. Click Run..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-rose-400 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setBugModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black shadow-md cursor-pointer transition-all"
                >
                  Record Defect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
