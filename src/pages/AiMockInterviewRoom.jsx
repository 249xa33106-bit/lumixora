import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Send, RefreshCw, Award, 
  ChevronRight, CheckCircle2, AlertCircle, Clock, Zap, 
  Sparkles, ArrowLeft, Bot, User, Share2, Download, Building2,
  Terminal, ShieldCheck, Trophy, Play, Pause, CornerDownLeft
} from 'lucide-react';
import { 
  COMPANY_PRESETS, ROLE_TRACKS, 
  generateOpeningQuestion, evaluateAndAskFollowUp, generateInterviewScorecard 
} from '../services/interviewService';
import { saveMockInterviewScorecardToSupabase } from '../services/supabaseDataSyncService';
import { issueNewCertificate, generateLinkedInAddUrl } from '../services/certificateService';
import { useToast } from '../context/ToastContext';

export default function AiMockInterviewRoom({ user, setActiveTab }) {
  const { addToast } = useToast();
  
  // Selection States
  const [selectedCompany, setSelectedCompany] = useState(COMPANY_PRESETS[0]);
  const [selectedRole, setSelectedRole] = useState(ROLE_TRACKS[0]);
  const [experienceLevel, setExperienceLevel] = useState('Fresher (0-1 yrs)');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);
  
  // Interview Interaction States
  const [roundNumber, setRoundNumber] = useState(1);
  const totalRounds = 4;
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Voice & Audio States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  // Completion & Scorecard States
  const [isCompleted, setIsCompleted] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [claimedCert, setClaimedCert] = useState(null);

  const recognitionRef = useRef(null);
  const chatScrollRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setCandidateAnswer(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + currentText);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      addToast?.({ type: 'warning', message: 'Time limit reached for this round! Submit your answer.' });
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Auto-scroll chat transcript
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [transcript, isEvaluating]);

  // Speak text aloud using Web Speech API
  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang && v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural'))) || voices.find(v => v.lang && v.lang.startsWith('en'));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      addToast?.({ type: 'info', message: 'Speech-to-text is not supported in this browser. You can type your answer below!' });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start err:', err);
      }
    }
  };

  // Start Interview Session
  const handleStartInterview = async () => {
    setLoadingInitial(true);
    const candidateName = user?.name || user?.displayName || 'Scholar';
    
    try {
      const opening = await generateOpeningQuestion({
        company: selectedCompany,
        role: selectedRole,
        experienceLevel,
        candidateName
      });

      setCurrentQuestion(opening);
      setTranscript([
        { role: 'interviewer', message: opening, round: 1, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setSessionStarted(true);
      setRoundNumber(1);
      setTimeLeft(120);
      setTimerActive(true);
      speakText(opening);
    } catch (err) {
      console.error(err);
      addToast?.({ type: 'error', message: 'Failed to initialize AI interviewer. Please try again.' });
    } finally {
      setLoadingInitial(false);
    }
  };

  // Submit Answer & Request Next Round / Scorecard
  const handleSubmitAnswer = async () => {
    if (!candidateAnswer.trim() || isEvaluating) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    stopSpeaking();
    setTimerActive(false);

    const submittedAnswer = candidateAnswer.trim();
    setCandidateAnswer('');
    setIsEvaluating(true);

    const updatedTranscript = [
      ...transcript,
      { role: 'candidate', message: submittedAnswer, round: roundNumber, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    setTranscript(updatedTranscript);

    try {
      const evalResult = await evaluateAndAskFollowUp({
        company: selectedCompany,
        role: selectedRole,
        questionHistory: [
          ...transcript.filter(t => t.role === 'interviewer').map((q, idx) => ({
            question: q.message,
            answer: idx === roundNumber - 1 ? submittedAnswer : (transcript.find(a => a.role === 'candidate' && a.round === idx + 1)?.message || '')
          }))
        ],
        candidateAnswer: submittedAnswer,
        currentRound: roundNumber,
        totalRounds
      });

      if (evalResult.feedback) {
        updatedTranscript.push({
          role: 'feedback',
          message: evalResult.feedback,
          score: evalResult.scoreOutOfTen,
          isRelevant: evalResult.isRelevant !== false,
          category: evalResult.category,
          round: roundNumber,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      if (evalResult.isCompleted || roundNumber >= totalRounds) {
        const candidateName = user?.name || user?.displayName || 'Scholar';
        
        // Build accurate historical evaluation array for final scorecard
        const completeHistory = updatedTranscript
          .filter(t => t.role === 'interviewer')
          .map((q, idx) => {
            const roundNum = idx + 1;
            const ansObj = updatedTranscript.find(a => a.role === 'candidate' && a.round === roundNum);
            const fbObj = updatedTranscript.find(f => f.role === 'feedback' && f.round === roundNum);
            return {
              question: q.message,
              answer: ansObj?.message || '',
              score: fbObj?.score !== undefined ? fbObj.score : (roundNum === roundNumber ? (evalResult.scoreOutOfTen || 0) : 6),
              isRelevant: fbObj?.isRelevant !== undefined ? fbObj.isRelevant : (roundNum === roundNumber ? (evalResult.isRelevant !== false) : true),
              feedback: fbObj?.message || (roundNum === roundNumber ? evalResult.feedback : '')
            };
          });

        const finalScorecard = await generateInterviewScorecard({
          company: selectedCompany,
          role: selectedRole,
          experienceLevel,
          candidateName,
          history: completeHistory
        });

        setScorecard(finalScorecard);
        setIsCompleted(true);

        if (user) {
          saveMockInterviewScorecardToSupabase(user, finalScorecard, selectedCompany, selectedRole).catch(e => console.warn("Supabase interview sync:", e));
        }

        if (finalScorecard.overallScore >= 70 && finalScorecard.credentialEligible) {
          speakText(`Congratulations ${candidateName}, your mock placement interview with ${selectedCompany.name} is complete! You met the placement benchmark.`);
        } else {
          speakText(`${candidateName}, your mock interview with ${selectedCompany.name} is complete. Your diagnostic scorecard is ready with recommendations.`);
        }
      } else {
        const nextQ = evalResult.nextQuestion;
        setCurrentQuestion(nextQ);
        const nextRoundNum = roundNumber + 1;
        setRoundNumber(nextRoundNum);
        
        updatedTranscript.push({
          role: 'interviewer',
          message: nextQ,
          round: nextRoundNum,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        
        setTimeLeft(120);
        setTimerActive(true);
        speakText(nextQ);
      }

      setTranscript([...updatedTranscript]);
    } catch (err) {
      console.error(err);
      addToast?.({ type: 'error', message: 'Evaluation glitch, moving ahead...' });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleClaimCertificate = () => {
    if (!scorecard) return;
    const cert = issueNewCertificate({
      user,
      title: `${selectedCompany.name} ${selectedRole.name} Mock Interview Verified`,
      category: 'Placement Readiness',
      score: `${scorecard.overallScore}%`,
      grade: (scorecard.verdict && scorecard.verdict.includes('Selected')) ? 'Elite Distinction (A+)' : 'Competency Pass (B+)',
      skills: [selectedCompany.name, selectedRole.name, ...(scorecard.strengths ? scorecard.strengths.slice(0, 2) : ['DSA', 'System Design'])],
      badgeIcon: selectedCompany.logo,
      badgeColor: selectedCompany.color
    });

    setClaimedCert(cert);
    addToast?.({ type: 'success', message: 'Official verifiable certificate issued and added to your portfolio!' });
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-white p-4 md:p-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-black border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20 border border-white/15 animate-pulse">
            🎙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                AI Placement Mock Interview Room
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-500/30">
                Live Studio
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Real-time voice avatar technical & HR rounds tailored to top product & service companies.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('certificates')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            My Certificates & Badges
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold border border-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>

      {/* Main Container */}
      {!sessionStarted ? (
        /* Configuration Screen */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Target Company Selector */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  1. Select Target Company Hiring Standard
                </h2>
                <span className="text-[11px] text-gray-400">8 Presets Available</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {COMPANY_PRESETS.map((comp) => {
                  const isSelected = selectedCompany.id === comp.id;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedCompany(comp)}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-b from-cyan-950/60 to-black border-cyan-500 shadow-lg shadow-cyan-500/10' 
                          : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{comp.logo}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <div className="mt-3">
                        <p className="text-xs font-bold text-white">{comp.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{comp.focus}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role & Track Selector */}
            <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                2. Select Interview Domain / Track
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLE_TRACKS.map((role) => {
                  const isSelected = selectedRole.id === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-r from-purple-950/60 to-black border-purple-500 text-white shadow-md' 
                          : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">{role.category}</span>
                        <p className="text-xs font-semibold text-white mt-0.5">{role.name}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Setup Summary & Launch Card */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-950/40 via-black to-black border border-white/10 space-y-5">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Interview Parameters
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400">Target Candidate:</span>
                  <span className="font-bold text-white">{user?.name || 'Scholar'}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400">Company Benchmark:</span>
                  <span className="font-bold text-cyan-300">{selectedCompany.name}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400">Rounds / Questions:</span>
                  <span className="font-bold text-purple-300">{totalRounds} Rounds + Scorecard</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400">Speech Engine:</span>
                  <span className="font-bold text-emerald-400">Voice Avatar & Mic Enabled</span>
                </div>
              </div>

              {/* Experience Level Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Experience Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Fresher (0-1 yrs)', 'Mid (2-4 yrs)', 'Internship'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setExperienceLevel(lvl)}
                      className={`py-2 px-2 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                        experienceLevel === lvl 
                          ? 'bg-cyan-500 text-black border-cyan-400' 
                          : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartInterview}
                disabled={loadingInitial}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:opacity-95 text-black font-black text-sm tracking-wide transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loadingInitial ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    Initializing AI Interviewer...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black" />
                    Enter AI Interview Studio
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                Scoring 80%+ awards an official <span className="text-gray-300 font-bold">Vyomra Proof-of-Skill Certificate</span> with 1-click LinkedIn export.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Live Interview Arena */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Avatar & Voice Status Column */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-950/50 via-black to-black border border-white/10 relative overflow-hidden flex flex-col items-center text-center space-y-4 shadow-2xl">
              {/* Animated Avatar Sphere */}
              <div className="relative my-2">
                <div className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl border-2 transition-all duration-500 ${
                  isSpeaking 
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_40px_rgba(6,182,212,0.6)] scale-105' 
                    : isEvaluating
                    ? 'border-purple-400 bg-purple-950/60 shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-pulse'
                    : 'border-white/20 bg-black/60 shadow-lg'
                }`}>
                  {selectedCompany.logo}
                </div>
                
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full border border-cyan-400/50 animate-ping pointer-events-none"></div>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
                  AI Placement Interviewer
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </h3>
                <p className="text-xs text-cyan-300 font-mono mt-0.5">
                  {selectedCompany.name} • {selectedRole.name}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {isSpeaking ? (
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5 animate-pulse">
                    <Volume2 className="w-3.5 h-3.5" /> Speaking Question...
                  </span>
                ) : isEvaluating ? (
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1.5 animate-spin">
                    <RefreshCw className="w-3.5 h-3.5" /> Evaluating Answer...
                  </span>
                ) : isListening ? (
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30 flex items-center gap-1.5 animate-pulse">
                    <Mic className="w-3.5 h-3.5" /> Listening to you...
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for your response
                  </span>
                )}
              </div>

              {/* Controls Bar */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    else speakText(currentQuestion);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all cursor-pointer"
                  title="Repeat question audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setVoiceEnabled(v => !v)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    voiceEnabled ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-white/5 border-white/10 text-gray-500'
                  }`}
                  title={voiceEnabled ? 'Voice output enabled' : 'Voice output muted'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className={timeLeft < 30 ? 'text-red-400 font-bold animate-pulse' : 'text-gray-300'}>
                    {formatTimer(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* Round tracker */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Interview Progress</span>
                <span className="font-bold text-white">Round {roundNumber} of {totalRounds}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(roundNumber / totalRounds) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Transcript & Response Area */}
          <div className="lg:col-span-2 space-y-4 flex flex-col h-[640px]">
            {/* Live Chat Stream */}
            <div 
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 rounded-3xl bg-black/40 border border-white/10 space-y-4 custom-scrollbar"
            >
              {transcript.map((item, index) => {
                if (item.role === 'interviewer') {
                  return (
                    <div key={index} className="flex items-start gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-sm shrink-0">
                        {selectedCompany.logo}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <span className="font-bold text-cyan-300">{selectedCompany.name} Interviewer</span>
                          <span>• Round {item.round}</span>
                          <span>• {item.timestamp}</span>
                        </div>
                        <div className="p-4 rounded-2xl rounded-tl-none bg-gradient-to-br from-cyan-950/30 via-white/5 to-transparent border border-white/10 text-xs md:text-sm text-gray-100 leading-relaxed">
                          {item.message}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (item.role === 'candidate') {
                  return (
                    <div key={index} className="flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-300 shrink-0">
                        YOU
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="flex items-center justify-end gap-2 text-[10px] text-gray-400">
                          <span>{item.timestamp}</span>
                          <span className="font-bold text-purple-300">{user?.name || 'Candidate'}</span>
                        </div>
                        <div className="p-4 rounded-2xl rounded-tr-none bg-gradient-to-br from-purple-950/40 to-blue-950/30 border border-purple-500/20 text-xs md:text-sm text-gray-100 leading-relaxed text-left">
                          {item.message}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (item.role === 'feedback') {
                  const isOffTopic = item.isRelevant === false || (typeof item.score === 'number' && item.score <= 3);
                  return (
                    <div 
                      key={index} 
                      className={`mx-auto max-w-[90%] p-4 rounded-2xl border text-xs space-y-1.5 transition-all shadow-md ${
                        isOffTopic 
                          ? 'bg-red-950/30 border-red-500/40 text-red-200' 
                          : 'bg-gradient-to-r from-purple-950/30 via-emerald-950/20 to-black border-emerald-500/30 text-emerald-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          {isOffTopic ? (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <span className="text-red-300 font-extrabold uppercase tracking-wide">
                                ⚠️ Irrelevant / Off-Topic Answer Flagged
                              </span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-300 font-extrabold uppercase tracking-wide">
                                ✅ Technical Round Assessment & Critique
                              </span>
                            </>
                          )}
                        </span>
                        {item.score !== undefined && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black border ${
                            isOffTopic 
                              ? 'bg-red-500/20 border-red-500/40 text-red-300' 
                              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          }`}>
                            Score: {item.score}/10
                          </span>
                        )}
                      </div>
                      <p className="text-gray-200 leading-relaxed text-xs pl-5.5 font-medium">{item.message}</p>
                    </div>
                  );
                }

                return null;
              })}

              {isEvaluating && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-400 animate-pulse w-fit">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  Interviewer is analyzing your response and formulating the next question...
                </div>
              )}
            </div>

            {/* Answer Input Bar */}
            <div className="p-3 bg-black/60 border border-white/10 rounded-2xl space-y-2 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-center cursor-pointer shrink-0 ${
                    isListening 
                      ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg shadow-red-500/30' 
                      : 'bg-white/5 hover:bg-white/10 text-cyan-400 border-white/10'
                  }`}
                  title={isListening ? 'Stop recording voice' : 'Click to speak your answer'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <textarea
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitAnswer();
                    }
                  }}
                  placeholder={isListening ? "Listening to your voice... (you can also edit text here)" : "Type your technical response, code logic, or speak via mic..."}
                  rows={2}
                  className="flex-1 bg-transparent border-0 focus:ring-0 text-xs md:text-sm text-white placeholder-gray-500 resize-none outline-none"
                  disabled={isEvaluating}
                />

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!candidateAnswer.trim() || isEvaluating}
                  className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-md shadow-cyan-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-500 px-1">
                <span>{speechSupported ? '🎙️ Mic dictation supported' : '⌨️ Keyboard input ready'}</span>
                <span>Press Enter to Submit Answer • Shift + Enter for newline</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion & Diagnostic Scorecard Modal */}
      {isCompleted && scorecard && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 md:p-8 border border-white/15 bg-[#090910] relative space-y-6 shadow-2xl my-8">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-amber-500/20 animate-bounce">
                {scorecard.overallScore >= 70 ? '🏆' : '📋'}
              </div>
              <h2 className="text-2xl font-black text-white">
                Mock Interview Diagnostic Scorecard
              </h2>
              <p className="text-xs text-gray-400">
                {selectedCompany.name} • {selectedRole.name} ({experienceLevel})
              </p>
            </div>

            {/* Scores Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Overall Score</span>
                <p className={`text-2xl font-black mt-1 ${scorecard.overallScore >= 70 ? 'text-cyan-300' : 'text-red-400'}`}>
                  {scorecard.overallScore}%
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Technical</span>
                <p className="text-2xl font-black text-purple-300 mt-1">{scorecard.technicalAccuracy}%</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Communication</span>
                <p className="text-2xl font-black text-emerald-300 mt-1">{scorecard.communicationScore}%</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Verdict</span>
                <p className={`text-xs font-black mt-2 line-clamp-1 ${scorecard.overallScore >= 70 ? 'text-amber-300' : 'text-red-300'}`}>
                  {scorecard.verdict}
                </p>
              </div>
            </div>

            {/* Summary & Analysis */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs text-gray-300">
              <span className="text-[10px] text-cyan-400 uppercase font-extrabold tracking-wider">Evaluation Summary</span>
              <p className="leading-relaxed">{scorecard.summary}</p>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths
                </span>
                <ul className="space-y-1.5 text-gray-300">
                  {scorecard.strengths && scorecard.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Recommended Improvements
                </span>
                <ul className="space-y-1.5 text-gray-300">
                  {scorecard.improvements && scorecard.improvements.map((im, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400">•</span> {im}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons & Certificate Lock */}
            <div className="space-y-3 pt-2">
              {scorecard.overallScore >= 70 && scorecard.credentialEligible ? (
                !claimedCert ? (
                  <button
                    onClick={handleClaimCertificate}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 hover:opacity-95 text-black font-black text-xs md:text-sm tracking-wide transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    Claim Verifiable Proof-of-Skill Certificate
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
                    <p className="text-xs font-bold text-emerald-300">
                      🎉 Certificate Issued: <span className="font-mono text-white">{claimedCert.id}</span>
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <a
                        href={generateLinkedInAddUrl(claimedCert)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Add to LinkedIn Profile
                      </a>
                      <button
                        onClick={() => setActiveTab('certificates')}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer"
                      >
                        View in Certificate Hub →
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-red-300 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-red-400" />
                    <span>Placement Benchmark Not Met ({scorecard.overallScore}% • Min 70% Required)</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    To claim an official verified certificate, candidates must answer technical problems with high relevance and score 70% or higher.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsCompleted(false);
                    setSessionStarted(false);
                    setTranscript([]);
                    setScorecard(null);
                    setClaimedCert(null);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs border border-white/10 transition-colors cursor-pointer"
                >
                  New Mock Session
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
