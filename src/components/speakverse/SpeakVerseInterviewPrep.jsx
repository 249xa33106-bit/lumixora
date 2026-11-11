// ============================================================================
// LUMIXORA SpeakVerse™ — CAREER & CAMPUS PLACEMENT COMMUNICATION
// Tagline: "From Hesitation to Communication. From Communication to Confidence."
// Specialized Placement Modules for Engineering Students:
// AI HR Interview • Technical Thinking-Aloud • Final-Year Project Explainer
// ============================================================================

import React, { useState } from 'react';
import { 
  Briefcase, Mic, Play, Award, CheckCircle2, Target, 
  Sparkles, Code, Users, FileText, ChevronRight, Brain
} from 'lucide-react';

export const PLACEMENT_DRILLS = [
  {
    id: "prep-hr-star",
    category: "HR Behavioral Round",
    title: "The STAR Framework Mastery",
    desc: "Answer classic recruiter behavioral prompts by breaking down Situation, Task, Action, and Result without rambling.",
    prompt: "Tell me about a time you handled a critical bug under tight deadline when a team member dropped out.",
    sampleResponse: "[Situation] In our third-year DBMS project, our lead dropped out 48 hours before submission. [Task] I took ownership of the SQL optimization. [Action] I refactored the indexing and ran query profiling. [Result] We achieved zero query timeouts and earned an 'A' grade.",
    tips: ["Spend 70% of your time on Action & Result", "Quantify metrics whenever possible"]
  },
  {
    id: "prep-tech-aloud",
    category: "Technical Round",
    title: "Thinking Aloud During Coding",
    desc: "Recruiters evaluate how you communicate your thought process before writing code. Practice explaining time complexity and trade-offs.",
    prompt: "Explain how you would find the median of two sorted arrays of different sizes in O(log(min(n, m))) time.",
    sampleResponse: "I would use a binary search partition approach. Rather than merging the arrays which costs O(n+m), we partition both arrays such that all elements on the left are smaller than elements on the right...",
    tips: ["State the brute-force approach first", "Explicitly state Big-O Space and Time complexity"]
  },
  {
    id: "prep-final-year-project",
    category: "Project Presentation",
    title: "Final-Year Engineering Project Pitch",
    desc: "The 2-minute project pitch: Problem Statement, Tech Stack, Your Individual Contribution, and Quantifiable Impact.",
    prompt: "Deliver a compelling 90-second explanation of your final-year major engineering project to an interview panel.",
    sampleResponse: "Our project addressed cold-chain agricultural storage losses using IoT sensors and machine learning. As frontend and API lead, I built the real-time telemetry dashboard in React and WebSockets, reducing notification latency by 45%...",
    tips: ["Clearly separate team effort from your individual contribution", "Focus on technical architecture decisions"]
  },
  {
    id: "prep-strengths-weaknesses",
    category: "HR Behavioral Round",
    title: "Genuine Strengths & Self-Correction",
    desc: "Avoid clichés like 'I work too hard'. Present a genuine challenge and the concrete system you built to overcome it.",
    prompt: "What is your greatest weakness, and what specific steps are you taking to address it?",
    sampleResponse: "Early on, I struggled with asking for help when stuck on a bug, often losing hours trying to solve it alone. Now, I enforce a strict 45-minute rule: if I cannot make progress after consulting documentation, I formulate a clear question and consult my mentor...",
    tips: ["Show growth mindset", "Highlight personal systems and accountability"]
  },
  {
    id: "prep-salary-negotiation",
    category: "Offer Discussion",
    title: "Offer & Compensation Etiquette",
    desc: "Express genuine enthusiasm for the company while professionally advocating for fair industry compensation.",
    prompt: "How do you respond when the HR offers a CTC 15% below your target based on off-campus benchmarks?",
    sampleResponse: "Thank you so much for this offer. I am genuinely thrilled about the team's distributed systems vision. Given my specialized certifications and two production internships, is there flexibility on the base component to align closer to industry benchmark?",
    tips: ["Never sound confrontational", "Anchor your request in tangible skills and past internships"]
  }
];

export default function SpeakVerseInterviewPrep({ onLaunchVoiceModal = () => {} }) {
  const [selectedDrill, setSelectedDrill] = useState(PLACEMENT_DRILLS[0]);

  return (
    <div className="space-y-6">
      {/* ─── BANNER ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-50/90 via-white to-teal-50/60 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white font-mono">
              Placement Command
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Engineered for Top Engineering Campus Drives
            </span>
          </div>
          <h3 className="text-2xl font-black text-[#0F172A] font-sora">
            Campus Placement & Technical Interview Communication
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Transform technical competence into compelling recruiter communication. Master behavioral rounds, technical thought articulation, and final-year project pitches.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm text-center shrink-0 min-w-[140px]">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Recruiter Ready</span>
          <span className="text-2xl font-black text-emerald-600 font-sora">STAR Ready</span>
        </div>
      </div>

      {/* ─── 2-COL WORKSPACE: DRILL SELECTOR & ACTIVE STAGE ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Drill Menu */}
        <div className="lg:col-span-5 space-y-3">
          {PLACEMENT_DRILLS.map(drill => {
            const isSelected = drill.id === selectedDrill.id;
            return (
              <div
                key={drill.id}
                onClick={() => setSelectedDrill(drill)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  isSelected 
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-sm scale-[1.01]' 
                    : 'bg-white hover:bg-slate-50 border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700 font-mono text-[10px] uppercase">
                    {drill.category}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <h4 className="font-black text-slate-900 text-sm font-sora">
                  {drill.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {drill.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Active Drill Simulator */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase font-mono px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700">
                {selectedDrill.category}
              </span>
              <span className="text-xs font-mono text-slate-400">
                AI Evaluated
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 font-sora">
              {selectedDrill.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {selectedDrill.desc}
            </p>

            {/* Recruiter Question Prompt */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Recruiter Question:</span>
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                "{selectedDrill.prompt}"
              </p>
            </div>

            {/* Benchmarked Sample Answer */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-700 uppercase font-mono block">Benchmarked Sample Response:</span>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{selectedDrill.sampleResponse}"
              </p>
            </div>

            {/* Placement Tips */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block font-mono">Panel Evaluation Tips:</span>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                {selectedDrill.tips.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onLaunchVoiceModal({
                id: selectedDrill.id,
                title: selectedDrill.title,
                prompt: selectedDrill.prompt,
                sampleResponse: selectedDrill.sampleResponse,
                difficulty: "Placement Round"
              })}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-95 shadow-emerald-600/20"
            >
              <Mic className="w-4 h-4" />
              <span>Record & Evaluate Answer with AI Panel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
