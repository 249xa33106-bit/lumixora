import React, { useState } from 'react';
import {
  Lightbulb, Send, CheckCircle2, TrendingUp, ThumbsUp,
  Sparkles, MessageSquare, Plus, Clock, Rocket, Shield
} from 'lucide-react';

export default function NexusInnovationArena({
  session,
  activeRole
}) {
  const [pitches, setPitches] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_innovation_pitches');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
  });

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Product Feature',
    problem: '',
    solution: '',
    impact: ''
  });
  const [pitchSuccess, setPitchSuccess] = useState(false);

  const handleUpvote = (pitchId) => {
    setPitches(prev => {
      const updated = prev.map(p => p.id === pitchId ? { ...p, upvotes: p.upvotes + 1 } : p);
      try {
        localStorage.setItem('lumixora_innovation_pitches', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const handleSubmitPitch = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.solution) return;

    const newPitch = {
      id: `pitch-${Date.now()}`,
      title: formData.title,
      author: `${session?.name || 'Intern Scholar'} (${activeRole?.shortTitle})`,
      category: formData.category,
      problem: formData.problem,
      solution: formData.solution,
      impact: formData.impact,
      upvotes: 1,
      status: 'Under Review',
      founderFeedback: 'Submitted directly to Founder Shaik Sowban. Evaluation scheduled.'
    };

    const updated = [newPitch, ...pitches];
    setPitches(updated);
    try {
      localStorage.setItem('lumixora_innovation_pitches', JSON.stringify(updated));
    } catch (_) {}

    setFormData({
      title: '',
      category: 'Product Feature',
      problem: '',
      solution: '',
      impact: ''
    });
    setFormOpen(false);
    setPitchSuccess(true);
    setTimeout(() => setPitchSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* ── HEADER ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-amber-400">
              FOUNDER PITCH DECK
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs font-bold text-slate-300">Direct Founder Channel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Innovation Arena
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Pitch new product features, growth strategies, or architectural improvements directly to Founder Shaik Sowban. Approved ideas become live Lumixora production features.
          </p>
        </div>

        <button
          onClick={() => setFormOpen(!formOpen)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{formOpen ? 'Close Pitch Form' : 'Pitch New Idea'}</span>
        </button>
      </div>

      {pitchSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Your innovation pitch has been submitted directly to Founder Shaik Sowban!</span>
        </div>
      )}

      {/* ── PITCH FORM MODAL / COLLAPSIBLE ── */}
      {formOpen && (
        <div className="rounded-3xl bg-[#0a0e19] border border-amber-500/30 p-6 sm:p-7 shadow-2xl space-y-4 animate-fade-in">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Submit Innovation Proposal to Founder Shaik Sowban</span>
          </h3>

          <form onSubmit={handleSubmitPitch} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Proposal Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Real-Time Voice Tone Analyzer for SpeakVerse Mock Interviews"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400 transition-all"
                >
                  <option value="Product Feature" className="bg-slate-900">Product Feature</option>
                  <option value="B2B College Partnership" className="bg-slate-900">B2B College Partnership</option>
                  <option value="Engineering & UX" className="bg-slate-900">Engineering & UX</option>
                  <option value="Growth & Community" className="bg-slate-900">Growth & Community</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Expected Impact / Metric</label>
                <input
                  type="text"
                  placeholder="e.g. +30% student engagement in Tier-2 colleges"
                  value={formData.impact}
                  onChange={e => setFormData({ ...formData, impact: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Problem Statement</label>
              <textarea
                rows={2}
                placeholder="What friction or bottleneck does this solve for students or colleges?"
                value={formData.problem}
                onChange={e => setFormData({ ...formData, problem: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-amber-400 transition-all resize-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Proposed Solution & Implementation Sketch</label>
              <textarea
                rows={3}
                required
                placeholder="Explain the proposed feature architecture, user flow, and implementation approach..."
                value={formData.solution}
                onChange={e => setFormData({ ...formData, solution: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-amber-400 transition-all resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Founder</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── PITCHES LIST ── */}
      <div className="space-y-4">
        {pitches.length > 0 ? (
          pitches.map(p => (
            <div key={p.id} className="rounded-3xl bg-[#0a0e19] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      {p.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      p.status.includes('Approved') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-slate-400">Pitched by <span className="text-slate-200 font-semibold">{p.author}</span></p>
                </div>

                {/* Upvote Button */}
                <button
                  onClick={() => handleUpvote(p.id)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 self-start"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{p.upvotes} Upvotes</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-white/5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Problem Identified:</span>
                  <p className="text-slate-300 leading-relaxed">{p.problem}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Proposed Solution:</span>
                  <p className="text-slate-300 leading-relaxed">{p.solution}</p>
                </div>
              </div>

              {/* Founder Evaluation Feedback Strip */}
              {p.founderFeedback && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">Founder Feedback (Shaik Sowban):</span>
                    <p className="text-slate-300 mt-0.5">{p.founderFeedback}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 rounded-3xl bg-[#0a0e19] border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">No Innovation Proposals Pitched Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Have an architectural idea, B2B college partnership proposal, or performance optimization? Click "+ Submit Proposal" to pitch directly to Founder Shaik Sowban.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
