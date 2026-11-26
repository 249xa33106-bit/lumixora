import React, { useState } from 'react';
import {
  Sparkles, Send, Bot, User, HelpCircle, CheckCircle2,
  Lightbulb, ShieldAlert, Compass, MessageSquare
} from 'lucide-react';

export default function NexusAiMentor({
  session,
  activeRole
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello ${session?.name ? session.name.split(' ')[0] : 'Scholar'}! I am Lumina, your AI Internship Mentor for the ${activeRole?.title || 'Engineering'} Department.\n\nI am here to help you unpack complex sprint briefs, navigate rubrics, and brainstorm methodology—without solving assignments for you. What are you working on today?`
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Quick suggestion chips customized by department
  const SUGGESTION_PROMPTS = {
    software_testing: [
      'How do I structure my S1 to S4 severity criteria for web applications?',
      'What boundary conditions should I test in authentication and session expiry?',
      'How to document reproduction steps in cross-browser audits?'
    ],
    research: [
      'What are the key technological moats distinguishing Lumixora in EdTech?',
      'How should I structure a 25-scholar qualitative interview synthesis?',
      'What metrics do college TPOs look for when evaluating placement software?'
    ],
    marketing: [
      'Give me high-converting hooks for engineering students facing placement season.',
      'How do I calculate viral referral coefficients for campus ambassador squads?',
      'What are the core messaging pillars of Lumixora Student OS?'
    ],
    content_creation: [
      'What visual pacing works best for a 60-second tech product explainer reel?',
      'Tips for designing 1080x1350 LinkedIn carousel slides that retain attention.',
      'How should I showcase Lumixora AI 3D Classroom in graphic assets?'
    ]
  };

  const chips = SUGGESTION_PROMPTS[activeRole?.id] || SUGGESTION_PROMPTS.software_testing;

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = '';
      const lower = query.toLowerCase();

      if (lower.includes('s1') || lower.includes('severity') || lower.includes('bug')) {
        reply = `For an S1-S4 Severity Classification:\n\n• **S1 (Blocker):** Total system failure with no workaround (e.g., student unable to log in, payment crash, data loss).\n• **S2 (Critical):** Core functional module broken with an awkward workaround (e.g., Code editor not executing Python, ML predictor timeout).\n• **S3 (Major):** Non-blocking functional glitch or noticeable rendering defect (e.g., broken layout on 375px mobile breakpoint).\n• **S4 (Minor / Cosmetic):** Typo, misaligned badge, slight color mismatch with brand guidelines.\n\nMake sure your audit report includes exact environment details (browser, OS, viewport) and clean reproduction steps!`;
      } else if (lower.includes('moat') || lower.includes('competitor') || lower.includes('edtech')) {
        reply = `When analyzing Lumixora's competitive moats, focus on three proprietary pillars:\n\n1. **Integrated Student OS vs Isolated Tools:** Competitors offer isolated coding or static MCQs; Lumixora synthesizes Notes, 3D Classrooms, AI Mock Interviews, and TPO verified databases into a unified graph.\n2. **Curriculum-Matched ML Predictors:** Instead of generic LeetCode problems, Lumixora maps real university past papers and company placement syllabi.\n3. **Real-time Voice & 3D Interactive Pedagogies:** SpeakVerse voice coach and 3D Lumina Classroom create engagement loops static video platforms cannot replicate.`;
      } else if (lower.includes('hook') || lower.includes('marketing') || lower.includes('ambassador')) {
        reply = `For high-converting campus hooks:\n\n• **The Fear-to-Clarity Hook:** "90% of students prepare for placements the wrong way. Here is the 3-step technical roadmap used by Tier-1 finalists."\n• **The Proof Hook:** "From 0 code submissions to clearing Amazon Technical Rounds: What real interviewers actually evaluate."\n\nEnsure your content always drives students toward a clear, low-friction action (e.g., checking their personalized Placement Readiness Score on Lumixora).`;
      } else if (lower.includes('reel') || lower.includes('carousel') || lower.includes('video')) {
        reply = `For a 60-second high-energy product reel:\n\n• **0–3s (The Hook):** Dynamic problem statement with kinetic typography and subtle glitch sound.\n• **4–20s (The Hero UI):** Smooth screen capture of the 3D Classroom or Code Arena with cursor glow.\n• **21–45s (Key Capabilities):** Fast cuts showing AI Doubt Solver, Placement Commander, and instant certificates.\n• **46–60s (Outro & CTA):** Lumixora emblem pulse with clear link in bio callout.\n\nKeep cuts under 2.5 seconds to maintain high viewer velocity!`;
      } else {
        reply = `That is an excellent direction to explore for your ${activeRole?.shortTitle} sprint. To maintain startup production rigor, I recommend:\n\n1. Ground your work in observable evidence (screenshots, metrics, user quotes, or runnable code).\n2. Structure your deliverable with an Executive Summary, Methodology, Execution Evidence, and Future Recommendations.\n3. Keep your Google Drive or GitHub repo public and well-organized for the Founder review desk.`;
      }

      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      setIsThinking(false);
    }, 850);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* ── HEADER ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-amber-400">
              INTEGRATED AI ASSIGNMENT GUIDE
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs font-bold text-slate-300">Lumina 3D Pedagogy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI Internship Mentor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Lumina guides you through weekly assignments, rubric standards, and methodology without doing the work for you.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold self-start md:self-auto">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Active Mentor Engine</span>
        </div>
      </div>

      {/* ── CHAT CONTAINER ── */}
      <div className="rounded-3xl bg-[#0a0e19] border border-white/10 shadow-xl overflow-hidden flex flex-col h-[520px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              )}
              <div
                className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-xs'
                    : 'bg-white/[0.04] border border-white/10 text-slate-200 rounded-tl-xs'
                }`}
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {session?.name ? session.name.substring(0, 2).toUpperCase() : 'ME'}
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 w-fit">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Lumina is thinking...</span>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-black/40 border-t border-white/5 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {chips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs whitespace-nowrap transition-all cursor-pointer shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Prompt Input Box */}
        <div className="p-4 bg-black/60 border-t border-white/10">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage(inputPrompt);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Lumina for guidance on your weekly tasks, rubrics or methodology..."
              value={inputPrompt}
              onChange={e => setInputPrompt(e.target.value)}
              className="flex-1 bg-white/[0.05] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-all"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
