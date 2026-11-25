// ============================================================================
// LUMIXORA SpeakVerse™ — 6 SPECIAL PRACTICE LABORATORIES
// Tagline: "From Hesitation to Communication. From Communication to Confidence."
// Laboratories: Debate Arena • Speech Arena • GD Arena • Corporate Arena
// Pitch Arena (Shark Tank) • Conversation Arena (Natural Spontaneous AI)
// ============================================================================

import React, { useState } from 'react';
import { 
  Target, Users, Brain, Briefcase, Flame, MessageCircle, 
  Play, Sparkles, Volume2, Mic, RotateCcw, ShieldCheck, 
  ChevronRight, Award, AlertCircle, CheckCircle2, Bot, Layers
} from 'lucide-react';
import { PRACTICE_LABS } from './SpeakVerseData';
import SpeakVerseEnvironments from './SpeakVerseEnvironments';

export default function SpeakVersePracticeLabs({ onLaunchVoiceModal = () => {} }) {
  const [activeLabId, setActiveLabId] = useState('debate-arena');
  const [selectedGdIndex, setSelectedGdIndex] = useState(0);
  const [showAmbientEnvironments, setShowAmbientEnvironments] = useState(false);
  const [speakingPeer, setSpeakingPeer] = useState(null);

  const handleSpeakPeerDialogue = (peerName, text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (speakingPeer === peerName) {
      setSpeakingPeer(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india'));
    if (indianVoice) utterance.voice = indianVoice;
    else utterance.lang = 'en-US';

    utterance.rate = 1.0;
    utterance.onstart = () => setSpeakingPeer(peerName);
    utterance.onend = () => setSpeakingPeer(null);
    utterance.onerror = () => setSpeakingPeer(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleShuffleGdTopic = (topicsLength) => {
    if (!topicsLength) return;
    const nextIdx = Math.floor(Math.random() * topicsLength);
    setSelectedGdIndex(nextIdx);
  };

  const currentLab = PRACTICE_LABS.find(l => l.id === activeLabId) || PRACTICE_LABS[0];

  return (
    <div className="space-y-6">
      {/* ─── 6 LAB NAVIGATION PILLS ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PRACTICE_LABS.map(lab => {
          const isActive = lab.id === activeLabId;
          return (
            <button
              key={lab.id}
              onClick={() => setActiveLabId(lab.id)}
              className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between h-24 ${
                isActive 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-[1.02]' 
                  : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {lab.badge}
                </span>
              </div>
              <span className="font-extrabold text-xs block font-sora mt-2 leading-tight">
                {lab.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── ACTIVE LABORATORY ARENA STAGE ───────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 font-mono border border-indigo-200">
                Special Laboratory
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Interactive Voice Simulation
              </span>
            </div>
            <h3 className="text-2xl font-black text-[#0F172A] font-sora">
              {currentLab.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium">
              {currentLab.desc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              Live Evaluation Ready
            </span>
          </div>
        </div>

        {/* ─── SPECIFIC ARENA CONTENT ─────────────────────────────────────── */}

        {/* 1. DEBATE ARENA */}
        {currentLab.id === 'debate-arena' && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-[#0F172A] font-sora">
              Select Debate Topic & Take Your Stance:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLab.topics.map((t, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-700 font-mono text-[10px]">Your Stance: {t.userRole}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{t.rounds} Debate Rounds</span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">
                      {t.topic}
                    </h5>
                    <div className="p-3 rounded-xl bg-white/80 border border-rose-200 text-xs text-slate-700 italic space-y-1">
                      <span className="text-[10px] font-bold text-rose-600 uppercase block font-mono">AI Opponent Opening:</span>
                      "{t.initialAiOpening}"
                    </div>
                  </div>

                  <button
                    onClick={() => onLaunchVoiceModal({
                      id: `debate-${idx}`,
                      title: `Debate Rebuttal: ${t.topic.slice(0, 30)}...`,
                      prompt: `Deliver your 90-second counter-rebuttal to the AI opponent: "${t.initialAiOpening}"`,
                      sampleResponse: "While the opposition raises valid fiscal points, empirical evidence from pilot programs proves that human safety nets stimulate consumer velocity...",
                      difficulty: "Debate Round 1"
                    })}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Enter Debate & Counter AI</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. SPEECH ARENA */}
        {currentLab.id === 'speech-arena' && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-[#0F172A] font-sora">
              Virtual Audience Speeches & Keynotes:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLab.scenarios.map((sc, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-700 font-mono text-[10px]">{sc.duration}</span>
                      <span className="text-slate-500 font-mono text-[10px]">Audience: {sc.audienceType}</span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">
                      {sc.title}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sc.prompt}
                    </p>
                  </div>

                  <button
                    onClick={() => onLaunchVoiceModal({
                      id: `speech-${idx}`,
                      title: sc.title,
                      prompt: sc.prompt,
                      sampleResponse: "Good morning esteemed faculty and brilliant peers! Today marks a milestone...",
                      difficulty: "Keynote Delivery"
                    })}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Step to Virtual Podium</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. GD ARENA (GROUP DISCUSSION) */}
        {currentLab.id === 'gd-arena' && (() => {
          const gdTopics = currentLab.topics || [
            {
              id: 'gd-default',
              title: currentLab.sampleTopic || "Is AI Automation Creating More High-Value Jobs or Driving Mass Unemployment in IT?",
              category: "Tech & Economy",
              difficulty: "Standard",
              starterPrompt: "Intervene in the discussion. Acknowledge both automated repetitive code generation and the rising demand for systems architects, security reviewers, and domain AI orchestrators.",
              openingAi: "Ananya: Automation boosts velocity, but Vikram insists junior roles will vanish. Moderator: Candidate, please share your perspective."
            }
          ];
          const activeTopic = gdTopics[selectedGdIndex % gdTopics.length];

          return (
            <div className="space-y-6">
              {/* Topic Selector Tabs / Carousel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Select Campus Placement GD Topic ({gdTopics.length} Topics):</span>
                  </span>

                  <button
                    onClick={() => handleShuffleGdTopic(gdTopics.length)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold font-mono border border-emerald-200 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    title="Pick random topic"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Shuffle Topic</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {gdTopics.map((t, idx) => {
                    const isSelected = selectedGdIndex === idx;
                    return (
                      <button
                        key={t.id || idx}
                        onClick={() => setSelectedGdIndex(idx)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.01]'
                            : 'bg-white hover:bg-emerald-50/50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 w-full text-[9px] font-mono font-bold mb-1.5">
                          <span className={`px-2 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {t.category || 'Placement GD'}
                          </span>
                          <span className={`${isSelected ? 'text-emerald-100' : 'text-emerald-700 font-extrabold'}`}>
                            {t.difficulty || 'High Yield'}
                          </span>
                        </div>
                        <p className="text-xs font-bold leading-snug line-clamp-2">
                          {t.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Selected GD Arena Hero Board */}
              <div className="p-5 sm:p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase font-mono bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        Active GD Arena Topic
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Topic #{selectedGdIndex + 1} of {gdTopics.length}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 font-sora">
                      "{activeTopic.title}"
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {activeTopic.starterPrompt}
                    </p>
                  </div>

                  <button
                    onClick={() => onLaunchVoiceModal({
                      id: `gd-session-${selectedGdIndex}`,
                      title: 'GD Turn Intervention',
                      prompt: `Topic: "${activeTopic.title}". ${activeTopic.starterPrompt}`,
                      sampleResponse: "If I may intervene here: while this disruption introduces challenges, historical industry shifts demonstrate that new high-leverage specializations rapidly emerge...",
                      difficulty: "Campus Placement GD"
                    })}
                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shrink-0 transition-all shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Intervene in Discussion Now</span>
                  </button>
                </div>

                {/* Multi-Agent GD Simulation: Live Active Debate */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-emerald-900 uppercase font-mono flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-emerald-600" />
                      Multi-Agent AI Debate In Progress:
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Listen to peers then interject politely
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Agent 1: Ananya (Optimist) */}
                    <div className="p-4 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Ananya (Tech Optimist)
                        </span>
                        <button
                          onClick={() => handleSpeakPeerDialogue('ananya', "Automation in software engineering accelerates high-velocity prototypes. Junior engineers who learn AI orchestration will become 10x more valuable architects rather than repetitive coders.")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{speakingPeer === 'ananya' ? 'Speaking...' : 'Listen to Ananya'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "Automation in software engineering accelerates high-velocity prototypes. Junior engineers who learn AI orchestration will become 10x more valuable architects rather than repetitive coders."
                      </p>
                    </div>

                    {/* Agent 2: Vikram (Skeptic) */}
                    <div className="p-4 rounded-2xl bg-white border border-rose-200/90 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          Vikram (Critical Pragmatist)
                        </span>
                        <button
                          onClick={() => handleSpeakPeerDialogue('vikram', "I respectfully disagree with Ananya. If boilerplate and entry-level scaffolding are automated, companies will slash junior hiring quotas by 40%, leaving new campus graduates with fewer initial pathways.")}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{speakingPeer === 'vikram' ? 'Speaking...' : 'Listen to Vikram'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "I respectfully disagree with Ananya. If boilerplate and entry-level scaffolding are automated, companies will slash junior hiring quotas by 40%, leaving new campus graduates with fewer initial pathways."
                      </p>
                    </div>
                  </div>

                  {/* 3 Polite Interjection Practice Options */}
                  <div className="p-4 rounded-2xl bg-emerald-100/60 border border-emerald-300/80 space-y-2">
                    <span className="text-[10px] font-black uppercase text-emerald-950 font-mono block">
                      Choose Your Interjection Strategy:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        onClick={() => onLaunchVoiceModal({
                          id: 'interject-ananya',
                          title: 'Interjection: Build on Ananya',
                          prompt: 'Deliver your interjection: "Building upon Ananya\'s valid point regarding velocity..."',
                          sampleResponse: "If I may build upon Ananya's point: while toolsets evolve, human domain intuition and system safety cannot be outsourced to generative models...",
                          difficulty: "Consensus Building"
                        })}
                        className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-left border border-emerald-200 text-xs text-slate-800 font-bold cursor-pointer transition-all shadow-2xs"
                      >
                        <span className="text-[10px] text-emerald-700 block font-mono">Strategy A:</span>
                        "Building on Ananya's point..."
                      </button>

                      <button
                        onClick={() => onLaunchVoiceModal({
                          id: 'interject-vikram',
                          title: 'Interjection: Polite Counter to Vikram',
                          prompt: 'Deliver your interjection: "While Vikram raises a valid concern regarding hiring quotas..."',
                          sampleResponse: "While Vikram raises an understandable concern about junior roles, historical transitions like cloud computing created entirely new disciplines like SRE and DevOps...",
                          difficulty: "Polite Rebuttal"
                        })}
                        className="p-2.5 rounded-xl bg-white hover:bg-rose-50 text-left border border-rose-200 text-xs text-slate-800 font-bold cursor-pointer transition-all shadow-2xs"
                      >
                        <span className="text-[10px] text-rose-700 block font-mono">Strategy B:</span>
                        "Countering Vikram with data..."
                      </button>

                      <button
                        onClick={() => onLaunchVoiceModal({
                          id: 'interject-moderator',
                          title: 'Interjection: Executive Consensus Summary',
                          prompt: 'Deliver your interjection: "Synthesizing both perspectives, the key lies in curriculum alignment..."',
                          sampleResponse: "Synthesizing both perspectives: Vikram correctly highlights entry barrier risks, while Ananya highlights upside. The strategic equilibrium is modernizing tier-2 engineering labs...",
                          difficulty: "Leadership Summary"
                        })}
                        className="p-2.5 rounded-xl bg-white hover:bg-indigo-50 text-left border border-indigo-200 text-xs text-slate-800 font-bold cursor-pointer transition-all shadow-2xs"
                      >
                        <span className="text-[10px] text-indigo-700 block font-mono">Strategy C:</span>
                        "Synthesizing both into consensus..."
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulated AI Cohort Members */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
                  Simulated AI Cohort Members:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentLab.participants.map((p, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                      <span className="text-xs font-bold text-slate-900 block">{p.name}</span>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold block">{p.role}</span>
                      <p className="text-[11px] text-slate-500 leading-snug">{p.bias}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 4. CORPORATE ARENA */}
        {currentLab.id === 'corporate-arena' && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-[#0F172A] font-sora">
              Workplace Simulations & Client Negotiations:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLab.scenarios.map((sc, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-bold text-blue-700 font-mono text-[10px]">Stakeholder: {sc.stakeholder}</span>
                    <h5 className="font-bold text-slate-900 text-sm">{sc.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{sc.prompt}</p>
                  </div>

                  <button
                    onClick={() => onLaunchVoiceModal({
                      id: `corp-${idx}`,
                      title: sc.title,
                      prompt: sc.prompt,
                      sampleResponse: "Good morning. To address the scope adjustments requested: our current sprint capacity is committed to foundational security...",
                      difficulty: "Corporate Ready"
                    })}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Enter Corporate Meeting</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. PITCH ARENA */}
        {currentLab.id === 'pitch-arena' && (
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 uppercase font-mono bg-amber-100 px-2 py-0.5 rounded-md">
                  Shark Tank Investor Pitch
                </span>
                <span className="text-xs text-amber-800 font-mono font-bold">Time Limit: 2 Minutes</span>
              </div>
              <h4 className="text-base font-black text-slate-900 font-sora">
                "Pitch your tech venture to Siddharth (FinTech VC) and Meera (DeepTech Angel)."
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {currentLab.pitchPrompt}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onLaunchVoiceModal({
                    id: 'pitch-session',
                    title: 'Shark Tank Startup Pitch',
                    prompt: currentLab.pitchPrompt,
                    sampleResponse: "Judges, over 1.5 million engineers graduate in India each year, yet campus recruitment is broken by manual spreadsheets. We built Lumixora...",
                    difficulty: "Investor Ready"
                  })}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Pitch to Investors Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. CONVERSATION ARENA */}
        {currentLab.id === 'conversation-arena' && (
          <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h4 className="text-lg font-black text-slate-900 font-sora">
                Natural Spontaneous AI Chat
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Have a warm, judgment-free voice dialogue with Lumixora AI. Talk about anything on your mind — movies, aspirations, campus memories, or tech ideas.
              </p>
            </div>

            <button
              onClick={() => onLaunchVoiceModal({
                id: 'convo-spontaneous',
                title: 'Casual Spontaneous Voice Chat',
                prompt: 'Say hello and tell your AI friend about one exciting project you worked on this month.',
                sampleResponse: "Hey there! This month I built a full-stack dashboard for tracking campus hackathons. Let me tell you about the database architecture...",
                difficulty: "Open Flow"
              })}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>Start Free-Flow Voice Conversation</span>
            </button>
          </div>
        )}
      </div>

      {/* ─── INTEGRATED IMMERSIVE ENVIRONMENTS SECTION ──────────────────── */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="text-sm font-black text-slate-900 font-sora flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Immersive Atmospheric Environments (8 Real-World Backdrops)</span>
            </h4>
            <p className="text-xs text-slate-500">
              Switch physical acoustics and high-stakes roleplay backdrops: Classroom, Group Discussion, Technical Interview, Boardroom Pitch.
            </p>
          </div>

          <button
            onClick={() => setShowAmbientEnvironments(prev => !prev)}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>{showAmbientEnvironments ? 'Hide Environments' : 'Explore 8 Environments'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAmbientEnvironments ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {showAmbientEnvironments && (
          <div className="pt-2 border-t border-slate-100 animate-fade-in">
            <SpeakVerseEnvironments onSelectScenario={(scenario) => onLaunchVoiceModal(scenario)} />
          </div>
        )}
      </div>
    </div>
  );
}
