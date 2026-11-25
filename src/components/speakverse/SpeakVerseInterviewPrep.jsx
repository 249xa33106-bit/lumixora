// ============================================================================
// LUMIXORA SpeakVerse™ — CAREER & CAMPUS PLACEMENT COMMUNICATION
// Tagline: "From Hesitation to Communication. From Communication to Confidence."
// Specialized Placement Modules for Engineering Students:
// AI HR Interview • Technical Thinking-Aloud • Final-Year Project Explainer
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Mic, MicOff, Play, Award, CheckCircle2, Target, 
  Sparkles, Code, Users, FileText, ChevronRight, Brain, Clock,
  ArrowRight, RotateCcw, AlertTriangle, Layers, Send
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
  const [activeSubTab, setActiveSubTab] = useState('modules'); // 'modules' | 'star-sequencer'
  const [selectedDrill, setSelectedDrill] = useState(PLACEMENT_DRILLS[0]);

  // STAR Audio Sequencer State
  const [activeStarStep, setActiveStarStep] = useState(0); // 0: S, 1: T, 2: A, 3: R
  const [starSegments, setStarSegments] = useState({
    situation: '',
    task: '',
    action: '',
    result: ''
  });
  const [isRecordingStep, setIsRecordingStep] = useState(false);
  const [stepTimer, setStepTimer] = useState(0);
  const recognitionRef = useRef(null);
  const stepTimerRef = useRef(null);

  const starStepsMeta = [
    {
      key: 'situation',
      name: '1. Situation',
      allocatedSec: 15,
      goal: 'Set the context, engineering project, team size, and deadline in 2 sharp sentences.',
      sample: 'In our 6th semester microservices project, our authentication service experienced intermittent 504 gateway timeouts 3 days before internal evaluation.',
      tip: 'Do not over-explain backstory. Maximum 15 seconds.'
    },
    {
      key: 'task',
      name: '2. Task',
      allocatedSec: 15,
      goal: 'Define your personal ownership, explicit role, or engineering bottleneck you had to overcome.',
      sample: 'As the backend engineer responsible for JWT validation, my mandate was to eliminate connection pooling leaks and restore p99 latency to under 80ms.',
      tip: 'Use "I", not "We". Recruiters need to know YOUR exact responsibility.'
    },
    {
      key: 'action',
      name: '3. Action (Crucial 70% Weight)',
      allocatedSec: 45,
      goal: 'Detail the concrete architectural solutions, algorithmic trade-offs, debugging steps, and collaboration.',
      sample: 'First, I ran distributed tracing with Prometheus and isolated that unindexed foreign key lookups were exhausting the connection pool. I restructured the SQL queries, added Redis caching for validated tokens with a 5-minute TTL, and enacted circuit breaker policies using resilience4j.',
      tip: 'This is the heart of your response. Highlight technical decision making.'
    },
    {
      key: 'result',
      name: '4. Result (Metrics Required)',
      allocatedSec: 15,
      goal: 'Deliver quantifiable business or technical outcomes, test coverage, or grade achieved.',
      sample: 'The refactoring dropped p99 latency from 1.8 seconds down to 42 milliseconds, handled 5,000 concurrent virtual users during stress testing without a single dropped packet, and earned us the top grade in our department.',
      tip: 'Always provide numbers, percentages, or concrete project outcomes.'
    }
  ];

  const currentStepObj = starStepsMeta[activeStarStep];

  // Speech Recognition for Sequencer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const rec = new SpeechRec();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + ' ';
      }
      setStarSegments(prev => ({
        ...prev,
        [currentStepObj.key]: text.trim()
      }));
    };

    rec.onerror = () => setIsRecordingStep(false);
    rec.onend = () => {
      if (isRecordingStep) {
        try { rec.start(); } catch (_) {}
      }
    };

    recognitionRef.current = rec;
    return () => {
      try { rec.stop(); } catch (_) {}
    };
  }, [isRecordingStep, currentStepObj.key]);

  // Step Timer
  useEffect(() => {
    if (isRecordingStep) {
      stepTimerRef.current = setInterval(() => setStepTimer(prev => prev + 1), 1000);
    } else {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    }
    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [isRecordingStep]);

  const toggleRecordStep = () => {
    if (isRecordingStep) {
      setIsRecordingStep(false);
      try { recognitionRef.current?.stop(); } catch (_) {}
    } else {
      setStepTimer(0);
      setIsRecordingStep(true);
      try { recognitionRef.current?.start(); } catch (_) {}
    }
  };

  const handleApplySampleForStep = () => {
    setStarSegments(prev => ({
      ...prev,
      [currentStepObj.key]: currentStepObj.sample
    }));
  };

  // Stitched 90s response
  const stitchedResponse = `[Situation] ${starSegments.situation || '(Not recorded)'} \n\n[Task] ${starSegments.task || '(Not recorded)'} \n\n[Action] ${starSegments.action || '(Not recorded)'} \n\n[Result] ${starSegments.result || '(Not recorded)'}`;
  const totalWords = (starSegments.situation + ' ' + starSegments.task + ' ' + starSegments.action + ' ' + starSegments.result).trim().split(/\s+/).filter(Boolean).length;
  const isAllFilled = starSegments.situation && starSegments.task && starSegments.action && starSegments.result;

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
            Transform technical competence into compelling recruiter communication. Master behavioral rounds, technical thought articulation, and the 4-step STAR audio sequencer.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm text-center shrink-0 min-w-[140px]">
          <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Framework</span>
          <span className="text-2xl font-black text-emerald-600 font-sora">STAR 90s</span>
          <span className="text-[10px] text-slate-500 font-mono block">Executive Ready</span>
        </div>
      </div>

      {/* ─── SUB-HUB TABS ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveSubTab('modules')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'modules'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Placement Round Modules ({PLACEMENT_DRILLS.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('star-sequencer')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'star-sequencer'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          <span>Multi-Step STAR Audio Sequencer (4-Step Pipeline)</span>
          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${activeSubTab === 'star-sequencer' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>90s PIPELINE</span>
        </button>
      </div>

      {/* ─── MODE 1: STANDARD PLACEMENT DRILL MODULES ─────────────────────── */}
      {activeSubTab === 'modules' && (
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
      )}

      {/* ─── MODE 2: MULTI-STEP STAR AUDIO SEQUENCER ──────────────────────── */}
      {activeSubTab === 'star-sequencer' && (
        <div className="space-y-6 animate-fade-in">
          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {starStepsMeta.map((s, idx) => {
              const isActive = activeStarStep === idx;
              const hasContent = Boolean(starSegments[s.key]);
              return (
                <button
                  key={s.key}
                  onClick={() => {
                    if (isRecordingStep) toggleRecordStep();
                    setActiveStarStep(idx);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                      : (hasContent 
                          ? 'bg-emerald-50/70 text-slate-800 border-emerald-200' 
                          : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200')
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold uppercase ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {s.allocatedSec}s Goal
                    </span>
                    {hasContent && (
                      <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                    )}
                  </div>
                  <span className="text-sm font-black font-sora mt-2 block">
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Recording Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Active Step Guidance & Recording */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase font-mono px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700">
                  Step {activeStarStep + 1} of 4 • {currentStepObj.allocatedSec}s Target
                </span>
                <h4 className="text-xl font-black text-slate-900 font-sora pt-1">
                  {currentStepObj.name}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {currentStepObj.goal}
                </p>
              </div>

              {/* Tips & Benchmark */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Executive Tip: {currentStepObj.tip}</span>
              </div>

              {/* Spoken Recording Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600 font-mono text-[11px] uppercase">
                    Your Spoken Transcript ({starSegments[currentStepObj.key] ? starSegments[currentStepObj.key].split(/\s+/).length : 0} words)
                  </span>
                  {isRecordingStep && (
                    <span className="text-emerald-600 font-mono font-bold flex items-center gap-1 animate-pulse">
                      <Clock className="w-3.5 h-3.5" /> {stepTimer}s / {currentStepObj.allocatedSec}s
                    </span>
                  )}
                </div>

                <textarea
                  rows={4}
                  value={starSegments[currentStepObj.key]}
                  onChange={(e) => setStarSegments(prev => ({ ...prev, [currentStepObj.key]: e.target.value }))}
                  placeholder={`Speak or type your ${currentStepObj.name}...`}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500 font-sans leading-relaxed"
                />
              </div>

              {/* Action Buttons for Step */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleRecordStep}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                      isRecordingStep
                        ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isRecordingStep ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isRecordingStep ? 'Stop Segment' : 'Record Segment Aloud'}</span>
                  </button>

                  <button
                    onClick={handleApplySampleForStep}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Paste Benchmark Model
                  </button>
                </div>

                {activeStarStep < 3 ? (
                  <button
                    onClick={() => {
                      if (isRecordingStep) toggleRecordStep();
                      setActiveStarStep(prev => prev + 1);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: {starStepsMeta[activeStarStep + 1].name.split('.')[1]}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    All 4 Steps Ready!
                  </span>
                )}
              </div>
            </div>

            {/* Right: Assembled 90-Second Executive Response */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-black text-slate-900 font-sora flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Stitched 90s Response
                  </h4>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {totalWords} Words
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-sans max-h-72 overflow-y-auto custom-scrollbar whitespace-pre-line">
                  {stitchedResponse}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onLaunchVoiceModal({
                    id: 'star-sequencer-eval',
                    title: 'Executive STAR Panel Evaluation',
                    prompt: `Deliver your complete 90-second stitched STAR response smoothly without filler words:\n\n${stitchedResponse}`,
                    sampleResponse: stitchedResponse,
                    difficulty: "Executive 90s STAR"
                  })}
                  disabled={!isAllFilled}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Evaluate Stitched 90s Answer with AI Panel</span>
                </button>

                {!isAllFilled && (
                  <p className="text-[10px] text-center text-slate-400 font-mono">
                    Complete all 4 segments (Situation, Task, Action, Result) to unlock full panel evaluation.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
