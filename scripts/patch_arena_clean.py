# -*- coding: utf-8 -*-
import re

with open('src/components/internPortal/NexusInnovationArena.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the pitches map section
old_pattern = r'\{\s*/\*\s*── PITCHES LIST ──\s*\*/\s*\}\s*<div className="space-y-4">[\s\S]*?</div>\s*</div>\s*\);\s*\}'

new_section = """{/* ── PITCHES LIST ── */}
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
}"""

updated = re.sub(old_pattern, new_section, code)
with open('src/components/internPortal/NexusInnovationArena.jsx', 'w', encoding='utf-8') as f:
    f.write(updated)
print("Updated successfully!")
