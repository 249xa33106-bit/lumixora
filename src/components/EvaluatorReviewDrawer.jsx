import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, Award, AlertCircle, ExternalLink, FileText, 
  Sparkles, Check, CheckCheck, Send, Star, User, Clock, 
  Sliders, ShieldCheck, ChevronRight, RotateCcw, MessageSquare,
  ThumbsUp, ShieldAlert, BookOpen, Layers, CheckSquare
} from 'lucide-react';
import { notifyFounder } from '../services/founderNotificationService';

const LEAD_SIGNATORIES = [
  { name: 'Shaik Sowban', role: 'Founder & CEO', org: 'Lumixora Engineering Council' },
  { name: 'Usha Eswari', role: 'Product Testing & QA Lead', org: 'Lumixora QA Lab' },
  { name: 'C. Manasa', role: 'Feature Strategy & Architecture Lead', org: 'Lumixora Product Group' },
  { name: 'Bandi Meghana', role: 'UI/UX Design Lead', org: 'Lumixora Design Studio' },
  { name: 'M. Akhil', role: 'Head of Campus Outreach & Growth', org: 'Lumixora Growth Team' },
  { name: 'Y. Usha Sree', role: 'AI & Innovation Lead', org: 'Lumixora AI Research' }
];

const QUICK_FEEDBACK_PRESETS = [
  "Outstanding boundary value analysis on authentication flows. Edge cases for session timeouts well documented.",
  "Exceptional competitive intelligence breakdown with clear moat and positioning matrix.",
  "High-polish UI/UX execution with strong responsive hierarchy and clean asset delivery.",
  "Solid test architecture. Recommend adding automated regression scripts for edge failure modes.",
  "Great technical storytelling in the walkthrough video. Clear presentation of student value proposition."
];

export default function EvaluatorReviewDrawer({
  isOpen,
  onClose,
  deliverable,
  intern,
  role,
  onSaveEvaluation,
  allInterns = []
}) {
  const [selectedInternId, setSelectedInternId] = useState(intern?.id || '');
  const [selectedDeliverableId, setSelectedDeliverableId] = useState(deliverable?.id || '');
  const [reviewStatus, setReviewStatus] = useState('approved'); // 'approved' | 'revisions' | 'rejected'
  const [reviewScore, setReviewScore] = useState(95);
  const [leadFeedback, setLeadFeedback] = useState('');
  const [leadSignatory, setLeadSignatory] = useState(role?.leadName?.split('&')[0]?.trim() || 'Shaik Sowban');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Active target intern
  const activeIntern = (allInterns.length > 0 && selectedInternId) 
    ? (allInterns.find(i => i.id === selectedInternId || i.refId === selectedInternId) || intern)
    : intern;

  // Active target deliverable
  const activeDeliverable = deliverable || (role?.deliverables?.find(d => d.id === selectedDeliverableId) || role?.deliverables?.[0]);

  // Load existing submission for this intern + deliverable
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    if (activeIntern?.id && activeDeliverable?.id) {
      try {
        const saved = localStorage.getItem(`lumixora_intern_submissions_${activeIntern.id}`);
        if (saved) {
          const list = JSON.parse(saved);
          const found = list.find(s => s.deliverableId === activeDeliverable.id);
          setSubmission(found || null);
          if (found) {
            if (found.status === 'approved' || found.status === 'revisions' || found.status === 'rejected') {
              setReviewStatus(found.status);
            }
            if (found.numericScore || typeof found.score === 'number') {
              setReviewScore(found.numericScore || found.score);
            } else if (typeof found.score === 'string' && found.score.includes('/')) {
              const num = parseInt(found.score.split('/')[0], 10);
              if (!isNaN(num)) setReviewScore(num);
            }
            if (found.feedback) {
              setLeadFeedback(found.feedback);
            }
            if (found.leadSignatory) {
              setLeadSignatory(found.leadSignatory);
            }
          }
        } else {
          setSubmission(null);
        }
      } catch (_) {}
    }
  }, [activeIntern?.id, activeDeliverable?.id, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!activeIntern?.id || !activeDeliverable?.id) return;

    const updatedSub = {
      id: submission?.id || `sub-${Date.now()}`,
      deliverableId: activeDeliverable.id,
      deliverableTitle: activeDeliverable.title,
      prUrl: submission?.prUrl || '',
      demoUrl: submission?.demoUrl || '',
      loomUrl: submission?.loomUrl || '',
      notes: submission?.notes || '',
      score: `${reviewScore}/100`,
      numericScore: Number(reviewScore),
      status: reviewStatus,
      submittedAt: submission?.submittedAt || new Date().toISOString().split('T')[0],
      reviewedAt: new Date().toISOString().split('T')[0],
      feedback: leadFeedback.trim() || 'Approved & Signed by Track Lead.',
      leadSignatory: leadSignatory,
      leadRole: LEAD_SIGNATORIES.find(l => l.name.includes(leadSignatory))?.role || 'Track Lead'
    };

    // 1. Update in intern's personal store
    try {
      const saved = localStorage.getItem(`lumixora_intern_submissions_${activeIntern.id}`);
      const list = saved ? JSON.parse(saved) : [];
      const updatedList = [...list.filter(s => s.deliverableId !== activeDeliverable.id), updatedSub];
      localStorage.setItem(`lumixora_intern_submissions_${activeIntern.id}`, JSON.stringify(updatedList));
    } catch (_) {}

    // 2. Notify Parent
    if (onSaveEvaluation) {
      onSaveEvaluation(updatedSub, activeIntern);
    }

    // 3. Instant Mobile Alert to Founder
    notifyFounder({
      type: 'LEAD_EVALUATION',
      userName: activeIntern.name,
      userEmail: activeIntern.email || activeIntern.id,
      role: activeIntern.roleTitle || role?.title || 'Intern',
      meta: `${activeDeliverable.title} -> ${reviewStatus.toUpperCase()} (${reviewScore}/100) by ${leadSignatory}`
    });

    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in font-sans">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
      />

      {/* Slide-out Drawer Container */}
      <div className="relative w-full max-w-xl bg-[#090d18] border-l border-white/15 h-full shadow-[0_0_80px_rgba(0,0,0,0.85)] z-10 flex flex-col text-slate-100 overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0c1122] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">Evaluator & Lead Review Desk</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                  OFFICIAL SIGN-OFF
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Review deliverables, assign grades, and issue verified attestation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer border border-white/10"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          
          {/* Success Banner */}
          {isSavedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Deliverable evaluated and officially signed off! Notification pushed to founder.</span>
            </div>
          )}

          {/* Intern Target Profile Card */}
          <div className="p-4 rounded-2xl bg-[#0e1428] border border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400 block">
              Candidate Telemetry
            </span>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-white">{activeIntern?.name || 'Intern Candidate'}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                    {activeIntern?.id || activeIntern?.refId || 'LMX-B01'}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {activeIntern?.branch || 'B.Tech CSE'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {role?.shortTitle || activeIntern?.roleTitle || 'Internship Track'}
                </span>
                <p className="text-[10px] text-gray-400 mt-1">{activeIntern?.college?.split('(')[0]}</p>
              </div>
            </div>
          </div>

          {/* Milestone Deliverable Selector / Summary */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Milestone Deliverable Under Review</span>
            </label>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  {activeDeliverable?.sprint || 'Sprint 1'}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  Due: {activeDeliverable?.dueDate || '2026-11-25'}
                </span>
              </div>
              <h5 className="text-xs font-black text-white mt-1">{activeDeliverable?.title}</h5>
            </div>
          </div>

          {/* Submitted Artifacts & Proof-of-Work Verification */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Submitted Proof of Work</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                submission ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {submission ? `Submitted on ${submission.submittedAt}` : 'No Submission Yet (Pre-Grading)'}
              </span>
            </label>

            <div className="space-y-2">
              {/* GitHub Link */}
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs font-bold text-gray-300 shrink-0">GitHub / Repo:</span>
                  {submission?.prUrl ? (
                    <a 
                      href={submission.prUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs text-cyan-400 underline font-mono truncate hover:text-cyan-300"
                    >
                      {submission.prUrl}
                    </a>
                  ) : (
                    <span className="text-xs text-gray-500 italic">Not attached</span>
                  )}
                </div>
                {submission?.prUrl && (
                  <a 
                    href={submission.prUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-cyan-300 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Demo / Live URL */}
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs font-bold text-gray-300 shrink-0">Live Demo / Figma:</span>
                  {submission?.demoUrl ? (
                    <a 
                      href={submission.demoUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs text-emerald-400 underline font-mono truncate hover:text-emerald-300"
                    >
                      {submission.demoUrl}
                    </a>
                  ) : (
                    <span className="text-xs text-gray-500 italic">Not attached</span>
                  )}
                </div>
                {submission?.demoUrl && (
                  <a 
                    href={submission.demoUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-emerald-300 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Loom Walkthrough Video */}
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs font-bold text-gray-300 shrink-0">Loom / Video:</span>
                  {submission?.loomUrl ? (
                    <a 
                      href={submission.loomUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs text-purple-400 underline font-mono truncate hover:text-purple-300"
                    >
                      {submission.loomUrl}
                    </a>
                  ) : (
                    <span className="text-xs text-gray-500 italic">Not attached</span>
                  )}
                </div>
                {submission?.loomUrl && (
                  <a 
                    href={submission.loomUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-purple-300 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Candidate Technical Notes */}
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Intern Implementation Notes:
                </span>
                <p className="text-xs text-gray-200 leading-relaxed italic">
                  {submission?.notes || 'No technical notes recorded for this deliverable.'}
                </p>
              </div>
            </div>
          </div>

          {/* Form: Evaluator Grading & Sign-Off Controls */}
          <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-white/10">
            
            {/* 1. Review Decision Status */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                Evaluation Decision
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setReviewStatus('approved')}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    reviewStatus === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Approved & Signed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewStatus('revisions')}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    reviewStatus === 'revisions'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Revisions Needed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewStatus('rejected')}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    reviewStatus === 'rejected'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/10'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <X className="w-3.5 h-3.5 text-rose-400" />
                  <span>Rejected</span>
                </button>
              </div>
            </div>

            {/* 2. Score Slider + Presets */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span>Evaluator Score (0–100)</span>
                </label>
                <span className="text-base font-black text-amber-400 font-mono bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                  {reviewScore} / 100
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={reviewScore}
                onChange={e => setReviewScore(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-gray-400 font-bold">Quick Presets:</span>
                {[100, 98, 95, 90, 85, 75].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setReviewScore(val)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      reviewScore === val 
                        ? 'bg-amber-400 text-black' 
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Official Mentor Feedback */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Official Mentor Feedback & Commendation</span>
                </label>
              </div>

              {/* Feedback Presets */}
              <div className="space-y-1 pb-1">
                <span className="text-[10px] text-gray-400 font-bold block">1-Click Commendations:</span>
                <div className="space-y-1">
                  {QUICK_FEEDBACK_PRESETS.slice(0, 3).map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setLeadFeedback(preset)}
                      className="w-full text-left p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-gray-300 hover:text-white truncate transition-all cursor-pointer block"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={3}
                required
                placeholder="Write official commendation or required revision details for the intern..."
                value={leadFeedback}
                onChange={e => setLeadFeedback(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* 4. Lead Signatory Selection */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Authorized Lead Signatory
              </label>
              <select
                value={leadSignatory}
                onChange={e => setLeadSignatory(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              >
                {LEAD_SIGNATORIES.map((lead, idx) => (
                  <option key={idx} value={lead.name}>
                    {lead.name} — {lead.role}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:opacity-95 text-black font-black text-xs shadow-xl shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>Save Grade & Issue Lead Sign-Off</span>
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
