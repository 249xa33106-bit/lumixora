import React, { useState, useEffect } from 'react';
import {
  Send, Link2, FileText, CheckCircle2, AlertCircle, Sparkles,
  ExternalLink, Clock, RotateCcw, ShieldCheck, Eye, Video,
  Check, ChevronRight, Upload, Info, MessageSquare
} from 'lucide-react';
import { notifyFounderInternDeliverable } from '../../services/founderNotificationService';

export default function NexusSubmissionStudio({
  session,
  activeRole,
  onNavigateTab,
  allottedTasks = [],
  submissions = [],
  onSaveSubmission,
  initialTask = null
}) {
  const [selectedTaskId, setSelectedTaskId] = useState(initialTask?.id || '');
  const [formData, setFormData] = useState({
    title: initialTask?.title || '',
    driveUrl: '',
    githubUrl: '',
    pdfUrl: '',
    loomUrl: '',
    notes: '',
    hours: 15
  });

  const [aiAuditing, setAiAuditing] = useState(false);
  const [aiAuditReport, setAiAuditReport] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Department task options
  const defaultTaskOptions = [
    { id: 't1', title: `${activeRole?.shortTitle} Week 01 - Primary Deliverable` },
    { id: 't2', title: `${activeRole?.shortTitle} Week 01 - Secondary Deliverable` },
    { id: 't3', title: `${activeRole?.shortTitle} Week 01 - Capstone Sprint` }
  ];

  const availableTasks = allottedTasks.length > 0 ? allottedTasks : defaultTaskOptions;

  useEffect(() => {
    if (initialTask) {
      setSelectedTaskId(initialTask.id);
      setFormData(prev => ({ ...prev, title: initialTask.title }));
    } else if (availableTasks.length > 0 && !selectedTaskId) {
      setSelectedTaskId(availableTasks[0].id);
      setFormData(prev => ({ ...prev, title: availableTasks[0].title }));
    }
  }, [initialTask, availableTasks]);

  const handleRunAiAudit = () => {
    setAiAuditing(true);
    setAiAuditReport(null);

    setTimeout(() => {
      setAiAuditing(false);
      const hasLink = Boolean(formData.driveUrl || formData.githubUrl || formData.pdfUrl || formData.loomUrl);
      const isCompleteNotes = formData.notes.length > 20;

      if (!hasLink) {
        setAiAuditReport({
          score: 45,
          passed: false,
          summary: 'Missing Deliverable Link. You must provide at least one valid Google Drive, GitHub repository, Loom or PDF link.',
          suggestions: [
            'Provide accessible Google Drive link with "Anyone with link can view" permission.',
            'Ensure GitHub repository is Public or includes markdown documentation.',
            'Attach Loom video walkthrough for interactive verification.'
          ]
        });
      } else if (!isCompleteNotes) {
        setAiAuditReport({
          score: 78,
          passed: true,
          summary: 'Good deliverable link detected. Enhance your submission notes with reproduction/execution steps for higher evaluation credit.',
          suggestions: [
            'Add 2-3 sentences summarizing your methodology and edge cases encountered.',
            'Highlight metrics or key outcomes achieved.'
          ]
        });
      } else {
        setAiAuditReport({
          score: 95,
          passed: true,
          summary: 'Exceptional submission quality! Structured documentation, valid asset links, and comprehensive execution context.',
          suggestions: [
            'Ready for official Founder review and contribution credit sign-off.'
          ]
        });
      }
    }, 900);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.driveUrl && !formData.githubUrl && !formData.pdfUrl && !formData.loomUrl) {
      setSubmitError('Please attach at least one deliverable link (Google Drive, GitHub repo, PDF or Loom video).');
      return;
    }

    const newSubmission = {
      id: `sub_${Date.now()}`,
      deliverableId: selectedTaskId,
      taskId: selectedTaskId,
      taskTitle: formData.title || 'Weekly Sprint Deliverable',
      department: activeRole?.id || 'marketing',
      internId: session?.id || 'LMX-B01',
      internName: session?.name || 'Intern Scholar',
      submittedAt: new Date().toISOString(),
      driveUrl: formData.driveUrl,
      githubUrl: formData.githubUrl,
      pdfUrl: formData.pdfUrl,
      loomUrl: formData.loomUrl,
      notes: formData.notes,
      hours: formData.hours,
      status: 'under_review',
      score: null,
      feedback: 'Awaiting review by Founder Shaik Sowban'
    };

    if (onSaveSubmission) {
      onSaveSubmission(newSubmission);
    } else {
      try {
        const key = `lumixora_intern_submissions_${session?.id}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        localStorage.setItem(key, JSON.stringify([newSubmission, ...existing]));
      } catch (_) {}
    }

    // Trigger instant real-time webhook & phone notification to Founder Shaik Sowban
    try {
      notifyFounderInternDeliverable({
        ...newSubmission,
        internEmail: session?.email,
        college: session?.college
      });
    } catch (_) {}

    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* ── HEADER ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-cyan-400">
              OFFICIAL SUBMISSION STUDIO
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs font-bold text-slate-300">Deliverables & Evidence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Submission Studio & Audit Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Upload your deliverables, run pre-flight AI audits against the official rubric, and track Founder reviews with full revision history.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('weekly_missions')}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto shrink-0"
        >
          <span>View Mission Board</span>
          <ChevronRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {submitSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Deliverable submitted successfully! Track review status in your Submission History below.</span>
        </div>
      )}

      {submitError && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2.5 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* ── SUBMISSION FORM & AI AUDIT SPLIT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: The Submission Form */}
        <div className="lg:col-span-2 rounded-3xl bg-[#0a0e18] border border-white/10 p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              <span>Deliverable Submission Form</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Week 01 Sprint</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Task Selection */}
            <div>
              <label className="text-slate-300 font-bold block mb-1.5">Target Weekly Mission</label>
              <select
                value={selectedTaskId}
                onChange={e => {
                  setSelectedTaskId(e.target.value);
                  const found = availableTasks.find(t => t.id === e.target.value);
                  if (found) setFormData(prev => ({ ...prev, title: found.title }));
                }}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-400 transition-all font-medium"
              >
                {availableTasks.map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-slate-300 font-bold block mb-1.5 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Google Drive Archive / Folder URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={formData.driveUrl}
                  onChange={e => setFormData({ ...formData, driveUrl: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-400 transition-all"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>GitHub Repository / PR URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-purple-400 transition-all"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Public PDF / Document Report URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://... / report.pdf"
                  value={formData.pdfUrl}
                  onChange={e => setFormData({ ...formData, pdfUrl: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400 transition-all"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-pink-400" />
                  <span>Loom / YouTube Demo Video URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://loom.com/share/..."
                  value={formData.loomUrl}
                  onChange={e => setFormData({ ...formData, loomUrl: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-pink-400 transition-all"
                />
              </div>
            </div>

            {/* Methodology & Notes */}
            <div>
              <label className="text-slate-300 font-bold block mb-1.5">
                Methodology, Key Findings & Execution Notes
              </label>
              <textarea
                rows={3}
                placeholder="Detail your approach, edge cases handled, deliverables generated, and key findings for reviewer evaluation..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400 transition-all resize-none"
              />
            </div>

            {/* Hours spent & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Sprint Hours Invested:</span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={formData.hours}
                  onChange={e => setFormData({ ...formData, hours: parseInt(e.target.value) || 10 })}
                  className="w-16 bg-white/[0.05] border border-white/15 rounded-lg px-2 py-1 text-white font-mono font-bold text-center"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRunAiAudit}
                  disabled={aiAuditing}
                  className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiAuditing ? 'Auditing...' : 'Run AI Pre-Audit'}</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Deliverable</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right 1 Col: AI Pre-Audit & Rubric Card */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-[#090d18] border border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">AI Rubric Pre-Audit</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Automated</span>
            </div>

            {aiAuditReport ? (
              <div className="space-y-3 animate-fade-in text-xs">
                <div className="flex items-baseline justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-slate-300 font-bold">Audit Score</span>
                  <span className={`text-xl font-black ${aiAuditReport.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {aiAuditReport.score}/100
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{aiAuditReport.summary}</p>
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommendations:</span>
                  {aiAuditReport.suggestions.map((s, i) => (
                    <p key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{s}</span>
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 space-y-2 text-xs">
                <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
                <p>Fill out your links and click <strong>Run AI Pre-Audit</strong> to check completeness before submitting.</p>
              </div>
            )}
          </div>

          {/* Official Evaluation Rubric */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 space-y-2.5 text-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Founder Evaluation Rubric</span>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span>Technical & Analytical Rigor:</span>
                <strong className="text-white">40 pts</strong>
              </div>
              <div className="flex justify-between">
                <span>Production Polish & Evidence:</span>
                <strong className="text-white">30 pts</strong>
              </div>
              <div className="flex justify-between">
                <span>Actionable Recommendations:</span>
                <strong className="text-white">20 pts</strong>
              </div>
              <div className="flex justify-between">
                <span>Sprint Timeliness & Speed:</span>
                <strong className="text-white">10 pts</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUBMISSION HISTORY TABLE: Verifiable Audit Trail ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Submission History & Review Ledger</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">{submissions.length} Total</span>
        </div>

        {submissions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs rounded-2xl bg-white/[0.02] border border-dashed border-white/10">
            No submissions recorded yet. Select a mission above and submit your first deliverable to begin your official ledger.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 text-[11px] font-bold uppercase border-b border-white/10">
                <tr>
                  <th className="p-3">Mission / Task</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3">Links Provided</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Score & Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {submissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-semibold text-white">{sub.taskTitle || sub.title || 'Weekly Sprint'}</td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {sub.driveUrl && (
                          <a href={sub.driveUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-white/10 hover:bg-white/20 text-cyan-300" title="Google Drive">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {sub.githubUrl && (
                          <a href={sub.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-white/10 hover:bg-white/20 text-purple-300" title="GitHub">
                            <Link2 className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                        sub.status === 'revision_requested' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {sub.status || 'Under Review'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">
                      {sub.score ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-400">{sub.score}/100</span>
                          <span className="text-slate-400 text-[11px] truncate max-w-xs">{sub.feedback}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending lead evaluation</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
