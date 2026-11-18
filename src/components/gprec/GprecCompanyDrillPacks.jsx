import React, { useState, useMemo } from 'react';
import {
  Building2, Briefcase, Award, Clock, ArrowRight, ShieldCheck, Sparkles,
  Search, CheckCircle2, FileText, Download, ChevronRight, Zap, Target,
  ExternalLink, KeyRound, BookOpen
} from 'lucide-react';
import { GPREC_COMPANY_DRILL_METADATA } from './gprecSecureExamBank';

export default function GprecCompanyDrillPacks({
  onLaunchExam,
  onOpenSolvedPaper,
  onNavigateNav,
  addToast,
  user
}) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPacks = useMemo(() => {
    return GPREC_COMPANY_DRILL_METADATA.filter(c => {
      const matchCat = filterCategory === 'All'
        || (filterCategory === 'Super-Dream' && c.category.includes('Super-Dream'))
        || (filterCategory === 'Dream' && c.category.includes('Dream'))
        || (filterCategory === 'Product' && c.category.includes('Product'))
        || (filterCategory === 'Mass & Digital' && c.category.includes('Mass'));

      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q
        || c.name.toLowerCase().includes(q)
        || c.role.toLowerCase().includes(q)
        || c.keyTopics.some(t => t.toLowerCase().includes(q))
        || c.passcode.toLowerCase().includes(q);

      return matchCat && matchQuery;
    });
  }, [filterCategory, searchQuery]);

  const handleLaunchMockOA = (comp) => {
    if (onLaunchExam) {
      onLaunchExam(comp.examId, comp.passcode);
    } else if (onNavigateNav) {
      onNavigateNav('secure_exams');
    }
    if (addToast) {
      addToast({
        message: `Unlocked Proctored OA for ${comp.name}. Passcode: ${comp.passcode}`,
        type: 'success'
      });
    }
  };

  const handleOpenPaper = (comp) => {
    if (onOpenSolvedPaper) {
      onOpenSolvedPaper(comp.id);
    } else if (onNavigateNav) {
      onNavigateNav('company_papers');
    }
  };

  const handleExportBlueprintPdf = (comp) => {
    const win = window.open('', '_blank', 'width=880,height=980');
    if (!win) return;
    const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${esc(comp.name)} — GPREC Recruiter Blueprint 2026</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 36px; background: #fff; }
    .hero { background: #0B0D21; color: #fff; padding: 28px; border-radius: 16px; margin-bottom: 24px; }
    .tag { display: inline-block; padding: 4px 10px; border-radius: 999px; background: rgba(52, 211, 153, 0.2); color: #34d399; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid rgba(52, 211, 153, 0.4); }
    .title { font-size: 26px; font-weight: 900; margin: 10px 0 4px; }
    .sub { font-size: 13px; color: #94a3b8; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; text-align: center; }
    .lbl { font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; }
    .val { font-size: 18px; font-weight: 900; color: #0f172a; margin-top: 4px; }
    .section { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .sec-h { font-size: 15px; font-weight: 800; color: #1e293b; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .step { display: flex; gap: 12px; margin-bottom: 10px; align-items: flex-start; }
    .step-num { width: 24px; height: 24px; border-radius: 50%; background: #4f46e5; color: #fff; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .topic-pill { display: inline-block; padding: 5px 12px; margin: 4px; border-radius: 8px; background: #ede9fe; color: #5b21b6; font-size: 12px; font-weight: 700; }
    .footer { margin-top: 36px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
    @media print { body { padding: 12px; } }
  </style>
</head>
<body>
  <div class="hero">
    <div class="tag">GPREC AUTONOMOUS • CAMPUS RECRUITER BLUEPRINT</div>
    <div class="title">${esc(comp.name)}</div>
    <div class="sub">Target Role: <strong>${esc(comp.role)}</strong> • Target Batch: 2026 Batch</div>
    <div style="font-size: 12px; color: #cbd5e1; margin-top: 8px;">${esc(comp.description)}</div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="lbl">CTC Bracket</div>
      <div class="val" style="color: #059669;">${esc(comp.ctc)}</div>
    </div>
    <div class="card">
      <div class="lbl">Hiring Track</div>
      <div class="val" style="color: #6366f1;">${esc(comp.tier)}</div>
    </div>
    <div class="card">
      <div class="lbl">Assessment Duration</div>
      <div class="val">${comp.durationMinutes} Minutes</div>
    </div>
    <div class="card">
      <div class="lbl">Test Room Passcode</div>
      <div class="val" style="font-family: monospace; color: #d97706;">${esc(comp.passcode)}</div>
    </div>
  </div>

  <div class="section">
    <div class="sec-h">1. Eligibility Criteria & Campus Benchmark</div>
    <div style="font-size: 13px; color: #334155; line-height: 1.6;">
      <div>• <strong>Academic Requirement:</strong> ${esc(comp.eligibility)}</div>
      <div>• <strong>GPREC Historical Record:</strong> ${esc(comp.hiringStats)}</div>
      <div>• <strong>Autonomous Proctored Strictness:</strong> Zero-Trust Max Lockdown with Code Sandbox Verification</div>
    </div>
  </div>

  <div class="section">
    <div class="sec-h">2. Round-by-Round Selection Architecture</div>
    ${comp.selectionStages.map((st, i) => `
      <div class="step">
        <div class="step-num">${i + 1}</div>
        <div style="font-size: 13px; color: #1e293b; font-weight: 600; padding-top: 2px;">${esc(st)}</div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="sec-h">3. High-Yield Topic Weightage & Syllabus Checklist</div>
    <div>
      ${comp.keyTopics.map(t => `<span class="topic-pill">✓ ${esc(t)}</span>`).join('')}
    </div>
  </div>

  <div class="footer">
    <div>Issued by Training & Placement Cell (TPO) • G. Pulla Reddy Engineering College (Autonomous)</div>
    <div>GPREC Placement Commander • Blueprint ID: ${esc(comp.id).toUpperCase()}-2026</div>
  </div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Recruiter Drill Header Banner */}
      <div className="bg-gradient-to-br from-[#0B0D21] via-[#12163B] to-[#1E1442] border border-indigo-900/60 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GPREC Recruiter Hiring Blueprints & Assessment Packs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Company-Specific Placement Drill Packs
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Target exact test patterns, time boundaries, and algorithmic expectations calibrated for major recruiters visiting GPREC. Includes 1-click Proctored Mock OAs, curated problem sets, and downloadable hiring blueprints.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 min-w-[280px]">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Active Packs</div>
              <div className="text-2xl font-black text-cyan-300 mt-0.5">{GPREC_COMPANY_DRILL_METADATA.length}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Max CTC</div>
              <div className="text-2xl font-black text-emerald-300 mt-0.5">₹44L</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Mock OAs</div>
              <div className="text-2xl font-black text-purple-300 mt-0.5">100%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'All', label: `All Recruiters (${GPREC_COMPANY_DRILL_METADATA.length})` },
            { id: 'Super-Dream', label: 'Super-Dream (₹10+ LPA)' },
            { id: 'Dream', label: 'Dream Track (₹4.5 - ₹10 LPA)' },
            { id: 'Product', label: 'Product Engineering' },
            { id: 'Mass & Digital', label: 'Prime / NQT Track' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, tech or topic..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Drill Pack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPacks.map(comp => (
          <div
            key={comp.id}
            className="bg-white border border-slate-200/90 hover:border-indigo-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
          >
            <div className="space-y-3.5">
              {/* Card Top: Avatar & Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${comp.accent} text-white font-black text-sm flex items-center justify-center shadow-md flex-shrink-0 tracking-wider`}>
                    {comp.shortName.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                      {comp.name}
                    </h3>
                    <div className="text-xs font-semibold text-slate-500 mt-0.5 line-clamp-1">
                      {comp.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Package & Difficulty Metric Strip */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Package (CTC)</div>
                  <div className="text-sm font-black text-emerald-600">{comp.ctc}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">OA Duration</div>
                  <div className="text-sm font-black text-slate-800">{comp.durationMinutes} Mins</div>
                </div>
              </div>

              {/* Hiring Stats & Eligibility */}
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 font-semibold text-indigo-700">
                  <Award className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500" />
                  <span>{comp.hiringStats}</span>
                </div>
                <div className="text-slate-500 leading-relaxed line-clamp-2">
                  {comp.eligibility}
                </div>
              </div>

              {/* Syllabus Topic Chips */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">High-Yield Syllabus</div>
                <div className="flex flex-wrap gap-1">
                  {comp.keyTopics.slice(0, 4).map(top => (
                    <span
                      key={top}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700"
                    >
                      {top}
                    </span>
                  ))}
                  {comp.keyTopics.length > 4 && (
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-[10px] font-bold text-indigo-600">
                      +{comp.keyTopics.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Passcode Reminder Pill */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Room Passcode:</span>
                </span>
                <span className="tracking-widest uppercase text-amber-700">{comp.passcode}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLaunchMockOA(comp)}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Take Mock OA</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExportBlueprintPdf(comp)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 cursor-pointer transition-colors"
                  title="Download Recruiter Hiring Blueprint PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleOpenPaper(comp)}
                className="w-full py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-extrabold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>View Original Paper & Answers</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
