import React, { useState, useMemo } from 'react';
import {
  FileText, CheckCircle2, ChevronDown, ChevronUp, Copy, Check,
  Download, Zap, Search, BookOpen, Layers, Award, Sparkles,
  Code, HelpCircle, Eye, EyeOff, Building2, Play
} from 'lucide-react';
import { GPREC_ORIGINAL_COMPANY_PAPERS, getCompanyPaperById } from './gprecCompanyPapersBank';

export default function GprecCompanyPapersPortal({
  initialCompanyId = 'all',
  onLaunchExam,
  addToast
}) {
  const [selectedCompanyId, setSelectedCompanyId] = useState(initialCompanyId);
  const [activePaperId, setActivePaperId] = useState(() => {
    if (initialCompanyId !== 'all') {
      const match = GPREC_ORIGINAL_COMPANY_PAPERS.find(p => p.companyId === initialCompanyId);
      if (match) return match.id;
    }
    return GPREC_ORIGINAL_COMPANY_PAPERS[0]?.id || '';
  });

  const [activeSectionId, setActiveSectionId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('python'); // 'python' | 'javascript' | 'java' | 'cpp'
  const [copiedId, setCopiedId] = useState(null);
  const [showAllExplanations, setShowAllExplanations] = useState(true);
  const [expandedExplanations, setExpandedExplanations] = useState({});

  const currentPaper = useMemo(() => {
    return getCompanyPaperById(activePaperId) || GPREC_ORIGINAL_COMPANY_PAPERS[0];
  }, [activePaperId]);

  const companyList = useMemo(() => {
    return [
      { id: 'all', name: 'All Companies' },
      { id: 'tcs', name: 'TCS NQT' },
      { id: 'cognizant', name: 'Cognizant' },
      { id: 'infosys', name: 'Infosys SP' },
      { id: 'accenture', name: 'Accenture' },
      { id: 'amazon', name: 'Amazon SDE' },
      { id: 'zoho', name: 'Zoho' }
    ];
  }, []);

  const availablePapers = useMemo(() => {
    if (selectedCompanyId === 'all') return GPREC_ORIGINAL_COMPANY_PAPERS;
    return GPREC_ORIGINAL_COMPANY_PAPERS.filter(p => p.companyId === selectedCompanyId);
  }, [selectedCompanyId]);

  const toggleExplanation = (qId) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleCopyCode = (codeText, id) => {
    navigator.clipboard?.writeText(codeText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    if (addToast) addToast({ message: 'Code solution copied to clipboard!', type: 'success' });
  };

  const handleExportSolvedPaperPdf = (paper) => {
    const win = window.open('', '_blank', 'width=900,height=980');
    if (!win) return;
    const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${esc(paper.paperTitle)} — GPREC Solved Paper Archive</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 36px; background: #fff; }
    .header { background: #0B0D21; color: #fff; padding: 28px; border-radius: 16px; margin-bottom: 24px; }
    .tag { display: inline-block; padding: 4px 10px; border-radius: 999px; background: rgba(52, 211, 153, 0.2); color: #34d399; font-size: 11px; font-weight: 800; text-transform: uppercase; border: 1px solid rgba(52, 211, 153, 0.4); }
    .title { font-size: 24px; font-weight: 900; margin: 8px 0 4px; }
    .sub { font-size: 12px; color: #94a3b8; }
    .sec-block { margin-top: 24px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; page-break-inside: avoid; }
    .sec-title { font-size: 16px; font-weight: 800; color: #1e1b4b; border-bottom: 2px solid #ede9fe; padding-bottom: 8px; margin-bottom: 16px; }
    .q-card { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px dashed #e2e8f0; }
    .q-prompt { font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 10px; line-height: 1.5; }
    .opt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
    .opt-box { padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px; background: #f8fafc; }
    .opt-correct { border-color: #10b981; background: #ecfdf5; color: #065f46; font-weight: 800; }
    .exp-box { background: #f1f5f9; border-left: 4px solid #4f46e5; border-radius: 4px; padding: 12px; font-size: 11.5px; color: #334155; line-height: 1.6; white-space: pre-wrap; margin-top: 8px; }
    .code-box { background: #0f172a; color: #f8fafc; border-radius: 8px; padding: 14px; font-family: monospace; font-size: 11px; overflow-x: auto; white-space: pre-wrap; margin-top: 10px; }
    .footer { margin-top: 36px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="tag">GPREC AUTONOMOUS • OFFICIAL PLACEMENT PAPER ARCHIVE</div>
    <div class="title">${esc(paper.paperTitle)}</div>
    <div class="sub">Company: <strong>${esc(paper.companyName)}</strong> • Shift: ${esc(paper.shift)} • Target: ${esc(paper.roles)}</div>
  </div>

  ${paper.sections.map(sec => `
    <div class="sec-block">
      <div class="sec-title">${esc(sec.title)}</div>
      ${sec.type === 'mcq' ? (sec.questions || []).map((q, idx) => `
        <div class="q-card">
          <div class="q-prompt">Q${idx + 1}. ${esc(q.prompt)}</div>
          <div class="opt-grid">
            ${q.options.map((opt, i) => `
              <div class="opt-box ${i === q.correctIndex ? 'opt-correct' : ''}">
                ${String.fromCharCode(65 + i)}. ${esc(opt)} ${i === q.correctIndex ? '✓ [Correct Answer]' : ''}
              </div>
            `).join('')}
          </div>
          <div class="exp-box"><strong>Step-by-Step Solution:</strong>\n${esc(q.explanation)}</div>
        </div>
      `).join('') : ''}

      ${sec.type === 'coding' ? (sec.problems || []).map((p, idx) => `
        <div class="q-card">
          <div class="q-prompt">Coding Challenge ${idx + 1}: ${esc(p.title)} (${p.marks} Marks)</div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 8px;">${esc(p.statement)}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;"><strong>Sample Input:</strong> ${esc(p.sampleInput)} | <strong>Sample Output:</strong> ${esc(p.sampleOutput)}</div>
          <div style="font-size: 11px; font-weight: 700; color: #4338ca;">Complexity: ${esc(p.complexityAnalysis)}</div>
          <div class="code-box"><strong>Python 3 Solution:</strong>\n${esc(p.solutions?.python || '')}</div>
        </div>
      `).join('') : ''}
    </div>
  `).join('')}

  <div class="footer">
    <div>GPREC Placement Commander • Training & Placement Cell (Autonomous)</div>
    <div>Archive Reference: ${esc(paper.id).toUpperCase()}</div>
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
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0B0D21] via-[#12163B] to-[#1E1442] border border-indigo-900/60 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>GPREC Placement Suite • Solved Papers Archive</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Original Company Placement Papers & Solved Solutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Study authentic placement papers asked in recent campus drives (2024-2025) for TCS, Cognizant, Infosys, Accenture, Amazon, and Zoho with step-by-step arithmetic deductions, dry-runs, and verified multi-language code solutions.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExportSolvedPaperPdf(currentPaper)}
              className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-md active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Download Solved PDF</span>
            </button>
            {currentPaper.linkedExamId && onLaunchExam && (
              <button
                type="button"
                onClick={() => onLaunchExam(currentPaper.linkedExamId, currentPaper.passcode)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-md active:scale-98"
              >
                <Zap className="w-4 h-4" />
                <span>Take Mock OA</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Company Filter & Paper Selector Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Company Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {companyList.map(comp => (
            <button
              key={comp.id}
              onClick={() => {
                setSelectedCompanyId(comp.id);
                if (comp.id !== 'all') {
                  const first = GPREC_ORIGINAL_COMPANY_PAPERS.find(p => p.companyId === comp.id);
                  if (first) setActivePaperId(first.id);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCompanyId === comp.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {comp.name}
            </button>
          ))}
        </div>

        {/* Paper Selector dropdown if multiple */}
        <div className="flex items-center gap-2">
          <select
            value={activePaperId}
            onChange={(e) => setActivePaperId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            {availablePapers.map(p => (
              <option key={p.id} value={p.id}>
                {p.companyName} — {p.shift}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowAllExplanations(!showAllExplanations)}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
          >
            {showAllExplanations ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showAllExplanations ? 'Hide Solutions' : 'Show All Solutions'}</span>
          </button>
        </div>
      </div>

      {/* Paper Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
            <span>{currentPaper.companyName}</span>
            <span>•</span>
            <span>{currentPaper.batch}</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            {currentPaper.paperTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Target: <strong className="text-slate-700">{currentPaper.roles}</strong> • Shift: {currentPaper.shift} • Duration: {currentPaper.durationMinutes} mins
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            Verified Answer Keys Included
          </span>
        </div>
      </div>

      {/* Sections and Questions */}
      <div className="space-y-6">
        {currentPaper.sections.map((sec, secIdx) => (
          <div
            key={sec.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5"
          >
            {/* Section Title */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                  {secIdx + 1}
                </span>
                <h4 className="text-base font-extrabold text-slate-900">{sec.title}</h4>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {sec.type === 'mcq' ? `${sec.questions?.length || 0} Questions` : `${sec.problems?.length || 0} Challenges`}
              </span>
            </div>

            {/* MCQ Questions Render */}
            {sec.type === 'mcq' && (
              <div className="space-y-5">
                {(sec.questions || []).map((q, qIdx) => {
                  const isExpanded = showAllExplanations || expandedExplanations[q.id];
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3"
                    >
                      {/* Question Top */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[11px] font-black mt-0.5">
                            Q{qIdx + 1}
                          </span>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed whitespace-pre-wrap">
                              {q.prompt}
                            </div>
                            {q.topic && (
                              <span className="inline-block mt-1 text-[10px] font-bold text-slate-400">
                                Topic: {q.topic}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = optIdx === q.correctIndex;
                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                              {isCorrect && (
                                <span className="text-[10px] font-extrabold uppercase text-emerald-600 flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5 stroke-3" /> Correct
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation Toggle */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => toggleExplanation(q.id)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          <span>{isExpanded ? 'Hide Step-by-Step Solution' : 'View Step-by-Step Solution & Formula'}</span>
                        </button>

                        {isExpanded && (
                          <div className="mt-2 p-3.5 rounded-xl bg-white border border-indigo-100 text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap shadow-2xs">
                            <div className="font-sans font-bold text-indigo-900 mb-1 flex items-center gap-1.5 text-xs">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Step-by-Step Mathematical & Logical Solution:</span>
                            </div>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Coding Problems Render */}
            {sec.type === 'coding' && (
              <div className="space-y-6">
                {(sec.problems || []).map((prob, pIdx) => {
                  const solutionCode = prob.solutions?.[selectedLang] || prob.solutions?.python || '';
                  return (
                    <div
                      key={prob.id}
                      className="p-5 rounded-2xl bg-slate-900 text-white border border-indigo-950 space-y-4"
                    >
                      {/* Problem Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                        <div>
                          <div className="inline-flex items-center gap-2 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                            <span>Challenge #{pIdx + 1}</span>
                            <span>•</span>
                            <span>{prob.marks} Marks</span>
                            <span>•</span>
                            <span>{prob.difficulty}</span>
                          </div>
                          <h5 className="text-base font-extrabold text-white mt-0.5">{prob.title}</h5>
                        </div>

                        {/* Language Selector */}
                        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                          {['python', 'javascript', 'java', 'cpp'].map(lang => (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => setSelectedLang(lang)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                                selectedLang === lang
                                  ? 'bg-cyan-400 text-slate-950 shadow-xs'
                                  : 'text-slate-300 hover:text-white'
                              }`}
                            >
                              {lang === 'cpp' ? 'C++' : lang}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Statement & Samples */}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {prob.statement}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase">Sample Input:</span>
                          <span className="text-cyan-300">{prob.sampleInput}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase">Sample Output:</span>
                          <span className="text-emerald-300">{prob.sampleOutput}</span>
                        </div>
                      </div>

                      <div className="text-[11px] font-semibold text-purple-300">
                        ⚡ {prob.complexityAnalysis}
                      </div>

                      {/* Solution Code Area */}
                      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-950">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10 text-[10px] text-slate-400 font-mono">
                          <span>{selectedLang.toUpperCase()} Verified Solution</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(solutionCode, prob.id)}
                            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {copiedId === prob.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === prob.id ? 'Copied!' : 'Copy Code'}</span>
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed custom-scrollbar">
                          {solutionCode}
                        </pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
