import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Sparkles, RotateCcw, 
  Send, User, Bot, AlertTriangle, CheckCircle2, Trophy, 
  Activity, Clock, Flame, Brain, Play
} from 'lucide-react';
import { callAICompletion } from '../../services/aiService';
import { analyzeFillerWords, calculateWpm, classifyWpm } from './SpeakVerseData';

export default function SpeakVerseCoach({ user = null, onRecordSessionScore = () => {} }) {
  const [selectedPersona, setSelectedPersona] = useState('hr');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AI Placement Coach. We will have a natural spoken conversation. Tell me about an engineering project you built recently and why you are proud of it."
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [isSpeakingAi, setIsSpeakingAi] = useState(false);
  const [turnCount, setTurnCount] = useState(0);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const chatBottomRef = useRef(null);

  const personas = [
    { id: 'hr', name: 'HR Recruiter', desc: 'Behavioral rounds, culture fit, STAR method', badge: 'Placement' },
    { id: 'tech', name: 'Tech Interviewer', desc: 'System design, algorithm trade-offs, code thinking', badge: 'Technical' },
    { id: 'prof', name: 'University Professor', desc: 'Academic theory, research doubts, formal seminar', badge: 'Academic' },
    { id: 'client', name: 'Corporate Client', desc: 'Requirements sync, milestone delivery, budget diplomacy', badge: 'Enterprise' },
    { id: 'colleague', name: 'Agile Teammate', desc: 'Standup updates, pair-programming debates, casual sync', badge: 'Peer' }
  ];

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Web Speech Setup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      let current = '';
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript + ' ';
      }
      setTranscript(current.trim());
    };

    rec.onerror = (e) => {
      console.warn('Speech rec notice:', e.error);
      setIsRecording(false);
    };

    rec.onend = () => {
      if (isRecording) {
        try { rec.start(); } catch (_) {}
      }
    };

    recognitionRef.current = rec;
    return () => {
      try { rec.stop(); } catch (_) {}
    };
  }, [isRecording]);

  // Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setDurationSeconds(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startListening = () => {
    setTranscript('');
    setDurationSeconds(0);
    setIsRecording(true);
    try {
      if (recognitionRef.current) recognitionRef.current.start();
    } catch (_) {}
  };

  const stopListening = () => {
    setIsRecording(false);
    try {
      if (recognitionRef.current) recognitionRef.current.stop();
    } catch (_) {}
  };

  // Text-to-speech for AI speech
  const speakAiResponse = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeakingAi(true);
    utterance.onend = () => setIsSpeakingAi(false);
    utterance.onerror = () => setIsSpeakingAi(false);

    synthRef.current.speak(utterance);
  };

  // Handle Send Spoken Turn
  const handleSendTurn = async () => {
    stopListening();
    if (!transcript.trim()) return;

    const userText = transcript.trim();
    const fillers = analyzeFillerWords(userText);
    const wpm = calculateWpm(fillers.totalWords, durationSeconds);

    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setTranscript('');
    setIsThinking(true);
    setTurnCount(prev => prev + 1);

    try {
      const activePersonaObj = personas.find(p => p.id === selectedPersona) || personas[0];
      const conversationHistory = newMessages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');

      const systemPrompt = `You are a professional ${activePersonaObj.name} conducting an interactive verbal communication training session on SpeakVerse™.
Your role: ${activePersonaObj.desc}.
Analyze the user's spoken response, provide a natural spoken conversational reply (1-3 sentences), AND evaluate their spoken performance.

Return ONLY JSON:
{
  "replyText": "Your spoken conversational reply to keep the dialogue going.",
  "fluency": 82,
  "pronunciation": 85,
  "grammar": 88,
  "vocabulary": 80,
  "sentenceStructure": 84,
  "fillerWordCount": ${fillers.count},
  "feedbackTip": "1 concise sentence tip on how to sharpen this specific response."
}`;

      const aiRaw = await callAICompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Conversation History:\n${conversationHistory}\n\nLatest User Turn:\n"${userText}"\nSpeaking duration: ${durationSeconds}s, Word count: ${fillers.totalWords}` }
        ],
        temperature: 0.5,
        maxTokens: 500
      });

      let parsed = null;
      try {
        const jsonMatch = aiRaw.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      } catch (e) {}

      const reply = parsed?.replyText || "That was a well-articulated point. Could you elaborate on what specific trade-offs you considered?";
      setMessages([...newMessages, { sender: 'ai', text: reply }]);
      setLastFeedback(parsed || {
        fluency: 80,
        pronunciation: 82,
        grammar: 85,
        vocabulary: 78,
        sentenceStructure: 80,
        feedbackTip: fillers.count > 0 ? "Watch out for filler words; steady pauses make you sound more confident." : "Good pace! Expand your answer with measurable metrics."
      });

      speakAiResponse(reply);
      onRecordSessionScore(parsed || { overallScore: 82 });
    } catch (err) {
      console.error('Coach sync error:', err);
      const fallbackReply = "Thank you for sharing that. How did your team react when you delivered that outcome?";
      setMessages([...newMessages, { sender: 'ai', text: fallbackReply }]);
      speakAiResponse(fallbackReply);
    } finally {
      setIsThinking(false);
      setDurationSeconds(0);
    }
  };

  const currentFillers = analyzeFillerWords(transcript);
  const liveWpm = calculateWpm(currentFillers.totalWords, durationSeconds);
  const wpmRating = classifyWpm(liveWpm);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ─── LEFT COLUMN: CHAT INTERACTION & LIVE MIC ──────────────────────── */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[650px] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black font-sora shadow-sm shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-[#0F172A] font-sora">
                  AI Speaking Coach
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-500">
                Persona: {personas.find(p => p.id === selectedPersona)?.name} • Natural Spoken Dialogue
              </p>
            </div>
          </div>

          {/* Persona Switcher Dropdown */}
          <select
            value={selectedPersona}
            onChange={(e) => {
              setSelectedPersona(e.target.value);
              const p = personas.find(item => item.id === e.target.value);
              setMessages([{
                sender: 'ai',
                text: `Switched mode to ${p?.name}. ${p?.desc}. Ready when you are—introduce your context or ask a question!`
              }]);
            }}
            className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 cursor-pointer shadow-2xs focus:outline-indigo-600"
          >
            {personas.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.badge})
              </option>
            ))}
          </select>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/30">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                m.sender === 'user' 
                  ? 'bg-slate-900 text-white font-bold' 
                  : 'bg-indigo-100 text-indigo-700 font-black'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl max-w-lg text-xs sm:text-sm leading-relaxed shadow-2xs ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
              }`}>
                <p>{m.text}</p>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono italic p-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
              <span>Coach is analyzing spoken turn & formulating reply...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Spoken Input & Live Controls */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-3">
          {/* Live Transcript Preview */}
          {transcript && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Live Voice Captured:</span>
              "{transcript}"
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={isRecording ? stopListening : startListening}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md ${
                isRecording 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20 scale-105 animate-pulse' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 active:scale-95'
              }`}
              title={isRecording ? 'Stop Recording' : 'Start Speaking'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <div className="flex-1">
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={isRecording ? "Listening... Speak naturally in English" : "Click microphone to speak or type here..."}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-indigo-600 font-medium"
              />
            </div>

            <button
              onClick={handleSendTurn}
              disabled={!transcript.trim() || isThinking}
              className="py-3 px-5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Turn</span>
            </button>
          </div>

          {/* Live Telemetry Pill */}
          {isRecording && (
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-600" /> {durationSeconds}s
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-600" /> {liveWpm} WPM ({wpmRating.label})
              </span>
              {currentFillers.count > 0 && (
                <span className="text-rose-600 font-bold">
                  {currentFillers.count} Filler Words
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── RIGHT COLUMN: REAL-TIME COACH EVALUATION SCORECARD ────────────── */}
      <div className="space-y-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-black text-[#0F172A] font-sora">
                Live Turn Intelligence
              </h4>
              <p className="text-[11px] text-slate-500">Evaluates every spoken exchange.</p>
            </div>
            <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
              Turn #{turnCount}
            </span>
          </div>

          {lastFeedback ? (
            <div className="space-y-4 animate-fade-in font-mono text-xs">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase">Fluency</span>
                  <span className="text-lg font-black text-indigo-600">{lastFeedback.fluency}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase">Pronunciation</span>
                  <span className="text-lg font-black text-cyan-600">{lastFeedback.pronunciation}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase">Grammar</span>
                  <span className="text-lg font-black text-emerald-600">{lastFeedback.grammar}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase">Vocabulary</span>
                  <span className="text-lg font-black text-violet-600">{lastFeedback.vocabulary}%</span>
                </div>
              </div>

              {lastFeedback.feedbackTip && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 font-sans leading-relaxed">
                  <span className="font-bold text-indigo-700 block mb-0.5">Coach Tip:</span>
                  {lastFeedback.feedbackTip}
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Activity className="w-8 h-8 mx-auto text-slate-300" />
              <p>Speak your first answer to generate live diagnostic telemetry.</p>
            </div>
          )}
        </div>

        {/* Practice Tip Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50/50 border border-indigo-100 shadow-2xs space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Placement Principle
          </span>
          <h5 className="text-xs font-black text-[#0F172A] font-sora">
            The 3-Second Golden Rule
          </h5>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            When asked a question, take a slow 2-second breath before speaking. Pauses convey authority, while instantaneous 'um/uh' filler sounds convey panic.
          </p>
        </div>
      </div>
    </div>
  );
}
