import React, { useState } from 'react';
import {
  Users, Layers, Sparkles, TrendingUp, Search, Plus, CheckCircle2,
  AlertCircle, Bug, FileText, Video, Eye, Shield, Tag, Calendar,
  BarChart3, CheckSquare, Clock, ArrowRight, Share2, Filter, ExternalLink
} from 'lucide-react';
import realInternsData from '../../data/realInternsBatch01.json';

export default function NexusDepartmentWorkspace({
  session,
  activeRole,
  onNavigateTab
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
  // 4. PRODUCT TESTING TOOLS STATE & DATA (Persistent)
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

        {/* Lead Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md self-start md:self-auto shrink-0">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300">
            SS
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Track Lead</span>
            <span className="text-xs font-bold text-white">Shaik Sowban</span>
            <span className="text-[10px] text-cyan-400 block font-semibold">Founder & Chief Architect</span>
          </div>
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
            {/* Real Personal Referral Link Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-cyan-500/10 border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400 block">Your Official Ambassador Referral Link</span>
                <p className="text-xs font-mono text-white mt-0.5 truncate max-w-md">{myRefUrl}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Share with campus peers to track signups directly credited to your intern profile.</p>
              </div>
              <button
                onClick={copyMyRefUrl}
                className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
              >
                {copiedMyRef ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedMyRef ? 'Copied Link!' : 'Copy Referral URL'}</span>
              </button>
            </div>

            {/* Live Campaigns Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                  <span>Active Outreach Campaigns</span>
                </h3>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 text-[11px] font-bold uppercase border-b border-white/10">
                    <tr>
                      <th className="p-3">Campaign Name</th>
                      <th className="p-3">Channel</th>
                      <th className="p-3">Estimated Reach</th>
                      <th className="p-3">Conversion</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {campaigns.map(c => (
                      <tr key={c.id} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-semibold text-white">{c.name}</td>
                        <td className="p-3 text-slate-300">{c.channel}</td>
                        <td className="p-3 font-mono">{c.reach}</td>
                        <td className="p-3 text-emerald-400 font-bold">{c.conversion}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'Live' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-300'}`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Campus Referral Tracking Grid */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Ambassador Referral Tracking</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {referrals.map((r, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">
                        {r.code}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                        {r.tier}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white">{r.ambassador}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Clicks: <strong className="text-slate-200">{r.clicks}</strong></span>
                      <span>Signups: <strong className="text-emerald-400">{r.signups}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════ 2. RESEARCH EXCLUSIVE VIEW ══════ */}
        {activeRole?.id === 'research' && (
          <div className="space-y-6">
            {/* Research Papers & Whitepapers */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Research Library & Whitepapers</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {researchLibrary.map(r => (
                  <div key={r.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300">
                      {r.category}
                    </span>
                    <h4 className="text-xs font-bold text-white leading-snug">{r.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                      <span>{r.author}</span>
                      <span className="text-emerald-400 font-semibold">{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Moats Matrix */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span>Competitor Moat & Differentiator Matrix</span>
              </h3>
              <div className="space-y-2.5">
                {competitorIntel.map((c, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Strength: {c.strength}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">Market Vulnerability</span>
                      <p className="text-[11px] text-slate-300 mt-0.5">{c.weakness}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Lumixora Moat</span>
                      <p className="text-[11px] text-slate-200 font-semibold mt-0.5">{c.moatVsLumixora}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════ 3. CONTENT CREATION EXCLUSIVE VIEW ══════ */}
        {activeRole?.id === 'content_creation' && (
          <div className="space-y-6">
            {/* Content Pipeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-400" />
                <span>Editorial Pipeline & Production Schedule</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {contentItems.map(item => (
                  <div key={item.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">
                        {item.platform}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Due {item.due}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">{item.format}</p>
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-cyan-400">{item.status}</span>
                      <button className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 font-semibold">
                        <span>Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset Library Highlights */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-white">Lumixora Brand Figma & Media Kit</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Access official SVG emblems, 3D classroom renders, and carousel typography templates.</p>
              </div>
              <button 
                onClick={() => onNavigateTab('resources')}
                className="px-3.5 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
              >
                <span>Open Asset Hub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
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

            {/* S1-S4 Severity Bug Registry */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Bug className="w-4 h-4 text-rose-400" />
                <span>S1-S4 Bug Tracking & Defect Matrix</span>
              </h3>
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
    </div>
  );
}
