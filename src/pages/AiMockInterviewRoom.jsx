import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Send, RefreshCw, Award, 
  ChevronRight, CheckCircle2, AlertCircle, Clock, Zap, 
  Sparkles, ArrowLeft, Bot, User, Share2, Download, Building2,
  Terminal, ShieldCheck, Trophy, Play, Pause, CornerDownLeft,
  FileText, Upload, Check, AlertTriangle, ChevronDown, ChevronUp, 
  Printer, SkipForward, ArrowRight, Eye, Code2, X
} from 'lucide-react';
import { 
  COMPANY_PRESETS, ROLE_TRACKS, INTERVIEW_STAGES, TOTAL_INTERVIEW_MARKS,
  generateOpeningQuestion, evaluateAndAskFollowUp, generateInterviewScorecard, parseResumeText,
  getUniqueStageQuestion, isQuestionDuplicate
} from '../services/interviewService';
import { saveMockInterviewScorecardToSupabase } from '../services/supabaseDataSyncService';
import { issueNewCertificate, generateLinkedInAddUrl } from '../services/certificateService';
import { generateMockInterviewDiagnosticPDF } from '../utils/pdfGenerator';
import { useToast } from '../context/ToastContext';

export default function AiMockInterviewRoom({ user, setActiveTab }) {
  const { addToast } = useToast();
  
  // Setup & Selection States
  const [selectedCompany, setSelectedCompany] = useState(COMPANY_PRESETS[0]);
  const [selectedRole, setSelectedRole] = useState(ROLE_TRACKS[0]);
  const [experienceLevel, setExperienceLevel] = useState('Fresher (0-1 yrs)');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);

  // Resume States
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeTab, setResumeTab] = useState('upload'); // 'upload' | 'paste' | 'saved' | 'profile'
  const [isParsingResume, setIsParsingResume] = useState(false);
  const fileInputRef = useRef(null);

  // Interview Progression States
  const [roundNumber, setRoundNumber] = useState(1);
  const totalRounds = 5; // 5 Progressive Rounds totaling 100 Marks
  const [questionsPerRound, setQuestionsPerRound] = useState(2); // Default: 2 questions per round (10 questions total)
  const [questionIndexInRound, setQuestionIndexInRound] = useState(1);
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
  const [activeReportTab, setActiveReportTab] = useState('all'); // 'all' | 'unanswered' | 'strengths'

  const recognitionRef = useRef(null);
  const chatScrollRef = useRef(null);
  const reportPrintRef = useRef(null);
  const lastSpokenRef = useRef('');

  // Check for existing saved resume on mount
  useEffect(() => {
    try {
      const savedResume = localStorage.getItem('lumixora_resume_data');
      if (savedResume) {
        const parsed = JSON.parse(savedResume);
        const parts = [];
        if (parsed.personalInfo?.fullName) parts.push(`Candidate: ${parsed.personalInfo.fullName}`);
        if (parsed.personalInfo?.headline) parts.push(`Headline: ${parsed.personalInfo.headline}`);
        if (parsed.personalInfo?.summary) parts.push(`Summary: ${parsed.personalInfo.summary}`);
        if (parsed.skills?.languages) parts.push(`Languages: ${parsed.skills.languages}`);
        if (parsed.skills?.frameworks) parts.push(`Frameworks: ${parsed.skills.frameworks}`);
        if (parsed.skills?.databases) parts.push(`Databases: ${parsed.skills.databases}`);
        if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
          parts.push(`Projects:\n` + parsed.projects.map(p => `- ${p.title}: ${p.description || p.points?.join(' ')}`).join('\n'));
        }
        if (parts.length > 0) {
          setResumeText(parts.join('\n\n'));
          setResumeFileName('Lumixora Saved Resume');
        }
      }
    } catch (e) {}
  }, []);

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
      addToast?.({ type: 'warning', message: 'Time limit reached for this round! Submitting answer.' });
      handleSubmitAnswer(false, true); // Auto-submit on timeout
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Auto-scroll chat transcript
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [transcript, isEvaluating]);

  // Text-to-Speech Aloud (with de-duplication guard)
  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis || !text) return;
    
    // Prevent repeating identical speech immediately if already active
    if (lastSpokenRef.current === text && isSpeaking) return;
    lastSpokenRef.current = text;

    window.speechSynthesis.cancel();

    // Clean asterisks or markdown symbols from speech
    const cleanSpeech = text.replace(/[*_#`]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
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

  // PDF & Resume Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingResume(true);
    setResumeFileName(file.name);

    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const [pdfjsLib, { default: pdfjsWorker }] = await Promise.all([
          import('pdfjs-dist'),
          import('pdfjs-dist/build/pdf.worker.mjs?url')
        ]);
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extractedText = '';
        for (let i = 1; i <= Math.min(pdf.numPages, 4); i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          extractedText += content.items.map(item => item.str).join(' ') + '\n';
        }
        setResumeText(extractedText.trim());
        addToast?.({ type: 'success', message: `Resume parsed! (${pdf.numPages} pages, ${extractedText.length} characters)` });
      } else {
        // Text / Markdown / DOCX fallback reader
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target.result || '');
          addToast?.({ type: 'success', message: `Resume file loaded! (${file.name})` });
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error("Resume parse error:", err);
      addToast?.({ type: 'warning', message: 'Could not extract text from file. Please paste your resume text in the box below.' });
    } finally {
      setIsParsingResume(false);
    }
  };

  // Populate from Student Profile
  const handleUseProfile = () => {
    const profileParts = [
      `Candidate Name: ${user?.name || user?.displayName || 'Student Scholar'}`,
      `College: ${user?.college || user?.collegeName || 'Engineering Institution'}`,
      `Department: ${user?.department || user?.branch || 'Computer Science & Engineering'}`,
      `Year of Study: ${user?.year || 'Final Year'}`,
      `Career Goal: ${user?.careerGoal || 'Software Engineer / Full Stack Developer'}`,
      `Core Competencies: React, JavaScript, Node.js, Python, SQL, Git, Data Structures`,
      `Projects: Campus Management Portal, E-Commerce API Microservices, AI Doubt Solver`
    ];
    setResumeText(profileParts.join('\n'));
    setResumeFileName('Lumixora Scholar Profile');
    addToast?.({ type: 'info', message: 'Populated interview context from your verified scholar profile!' });
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
        candidateName,
        resumeText
      });

      const firstStage = INTERVIEW_STAGES[0];
      const maxMarks = Math.round(firstStage.maxMarks / questionsPerRound) || 10;
      setCurrentQuestion(opening);
      setTranscript([
        { 
          role: 'interviewer', 
          message: opening, 
          round: 1, 
          questionIndexInRound: 1,
          stageTitle: firstStage.title,
          difficulty: firstStage.difficulty,
          maxMarks: maxMarks,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
      setSessionStarted(true);
      setRoundNumber(1);
      setQuestionIndexInRound(1);
      setTimeLeft(firstStage.timeLimit);
      setTimerActive(true);
      speakText(opening);
    } catch (err) {
      console.error(err);
      addToast?.({ type: 'error', message: 'Failed to initialize AI interviewer. Please try again.' });
    } finally {
      setLoadingInitial(false);
    }
  };

  // Submit Answer or Skip Question
  const handleSubmitAnswer = async (isSkipped = false, isTimeout = false) => {
    if (isEvaluating) return;
    if (!isSkipped && !candidateAnswer.trim() && !isTimeout) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    stopSpeaking();
    setTimerActive(false);

    const submittedAnswer = isSkipped 
      ? "(Skipped / Unanswered)" 
      : (isTimeout && !candidateAnswer.trim() ? "(Timed Out / No Answer)" : candidateAnswer.trim());
    
    setCandidateAnswer('');
    setIsEvaluating(true);

    const isLastQuestionInRound = questionIndexInRound >= questionsPerRound;
    const isFinalInterviewQuestion = roundNumber >= totalRounds && isLastQuestionInRound;
    const currentStage = INTERVIEW_STAGES[roundNumber - 1] || INTERVIEW_STAGES[0];
    const maxMarks = Math.round(currentStage.maxMarks / questionsPerRound) || 10;

    const updatedTranscript = [
      ...transcript,
      { 
        role: 'candidate', 
        message: submittedAnswer, 
        round: roundNumber, 
        questionIndexInRound: questionIndexInRound,
        isSkipped,
        isTimeout,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ];
    setTranscript(updatedTranscript);

    try {
      const interviewerQuestions = updatedTranscript.filter(t => t.role === 'interviewer');
      const candidateAnswers = updatedTranscript.filter(t => t.role === 'candidate');

      const evalResult = await evaluateAndAskFollowUp({
        company: selectedCompany,
        role: selectedRole,
        questionHistory: interviewerQuestions.map((q, idx) => ({
          question: q.message,
          round: q.round,
          questionIndexInRound: q.questionIndexInRound || 1,
          answer: candidateAnswers[idx]?.message || ''
        })),
        candidateAnswer: submittedAnswer,
        currentRound: roundNumber,
        totalRounds,
        questionIndexInRound,
        questionsPerRound,
        resumeText,
        isSkipped: isSkipped || isTimeout
      });

      // Append detailed feedback & AI model answer for this specific question
      updatedTranscript.push({
        role: 'feedback',
        message: evalResult.feedback,
        marksAwarded: evalResult.marksAwarded,
        maxMarks: evalResult.maxMarks || maxMarks,
        aiModelAnswer: evalResult.aiModelAnswer,
        comparisonAnalysis: evalResult.comparisonAnalysis,
        isRelevant: evalResult.isRelevant !== false,
        isUnanswered: evalResult.isUnanswered === true,
        round: roundNumber,
        questionIndexInRound: questionIndexInRound,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Check if entire interview completed
      if (evalResult.isCompleted || isFinalInterviewQuestion) {
        const candidateName = user?.name || user?.displayName || 'Scholar';
        
        // Build detailed historical array for final 100-mark report (1-to-1 matching)
        const finalQuestions = updatedTranscript.filter(t => t.role === 'interviewer');
        const finalAnswers = updatedTranscript.filter(t => t.role === 'candidate');
        const finalFeedbacks = updatedTranscript.filter(t => t.role === 'feedback');

        const completeHistory = finalQuestions.map((q, idx) => {
          const ansObj = finalAnswers[idx];
          const fbObj = finalFeedbacks[idx];
          return {
            round: q.round,
            questionIndexInRound: q.questionIndexInRound || 1,
            stageTitle: q.stageTitle,
            difficulty: q.difficulty,
            question: q.message,
            answer: ansObj?.message || '',
            isUnanswered: ansObj?.isSkipped || ansObj?.isTimeout || fbObj?.isUnanswered || false,
            marksAwarded: fbObj?.marksAwarded !== undefined ? fbObj.marksAwarded : 0,
            maxMarks: q.maxMarks || maxMarks,
            feedback: fbObj?.message || '',
            aiModelAnswer: fbObj?.aiModelAnswer || '',
            comparisonAnalysis: fbObj?.comparisonAnalysis || ''
          };
        });

        const finalScorecard = await generateInterviewScorecard({
          company: selectedCompany,
          role: selectedRole,
          experienceLevel,
          candidateName,
          resumeText,
          history: completeHistory
        });

        setScorecard(finalScorecard);
        setIsCompleted(true);

        if (user) {
          saveMockInterviewScorecardToSupabase(user, finalScorecard, selectedCompany, selectedRole).catch(e => console.warn("Supabase interview sync:", e));
        }

        if (finalScorecard.isPassing) {
          speakText(`Congratulations ${candidateName}, you scored ${finalScorecard.totalScore} out of 100 marks! You met the placement benchmark for ${selectedCompany.name}.`);
        } else {
          speakText(`${candidateName}, you scored ${finalScorecard.totalScore} out of 100 marks. Your detailed diagnostic analysis and AI model answers are ready.`);
        }
      } else {
        // Proceed to next question: either next question in current round or start next round
        let nextRoundNum = roundNumber;
        let nextQuestionIndex = questionIndexInRound + 1;
        if (nextQuestionIndex > questionsPerRound) {
          nextRoundNum = roundNumber + 1;
          nextQuestionIndex = 1;
        }

        const nextStage = INTERVIEW_STAGES[nextRoundNum - 1] || INTERVIEW_STAGES[roundNumber];
        const nextMaxMarks = Math.round(nextStage.maxMarks / questionsPerRound) || 10;
        const candidateName = user?.name || user?.displayName || 'Candidate';

        let nextQ = evalResult.nextQuestion;
        const previousQuestions = updatedTranscript.filter(t => t.role === 'interviewer').map(q => q.message);
        if (!nextQ || nextQ.trim().length < 15 || isQuestionDuplicate(nextQ, previousQuestions)) {
          nextQ = getUniqueStageQuestion(nextRoundNum, selectedCompany, selectedRole, candidateName, resumeText, previousQuestions, nextQuestionIndex);
        }

        setCurrentQuestion(nextQ);
        setRoundNumber(nextRoundNum);
        setQuestionIndexInRound(nextQuestionIndex);
        
        updatedTranscript.push({
          role: 'interviewer',
          message: nextQ,
          round: nextRoundNum,
          questionIndexInRound: nextQuestionIndex,
          stageTitle: nextStage.title,
          difficulty: nextStage.difficulty,
          maxMarks: nextMaxMarks,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        
        setTimeLeft(nextStage.timeLimit);
        setTimerActive(true);
        speakText(nextQ);
      }

      setTranscript([...updatedTranscript]);
    } catch (err) {
      console.error("Interview submit error:", err);
      const candidateName = user?.name || user?.displayName || 'Candidate';
      if (isFinalInterviewQuestion) {
        setIsCompleted(true);
      } else {
        let nextRoundNum = roundNumber;
        let nextQuestionIndex = questionIndexInRound + 1;
        if (nextQuestionIndex > questionsPerRound) {
          nextRoundNum = roundNumber + 1;
          nextQuestionIndex = 1;
        }

        const nextStage = INTERVIEW_STAGES[nextRoundNum - 1] || INTERVIEW_STAGES[roundNumber];
        const nextMaxMarks = Math.round(nextStage.maxMarks / questionsPerRound) || 10;
        const previousQuestions = transcript.filter(t => t.role === 'interviewer').map(q => q.message);
        const fallbackQ = getUniqueStageQuestion(nextRoundNum, selectedCompany, selectedRole, candidateName, resumeText, previousQuestions, nextQuestionIndex);

        setCurrentQuestion(fallbackQ);
        setRoundNumber(nextRoundNum);
        setQuestionIndexInRound(nextQuestionIndex);
        setTimeLeft(nextStage.timeLimit);
        setTimerActive(true);

        const safeTranscript = [
          ...updatedTranscript,
          {
            role: 'interviewer',
            message: fallbackQ,
            round: nextRoundNum,
            questionIndexInRound: nextQuestionIndex,
            stageTitle: nextStage.title,
            difficulty: nextStage.difficulty,
            maxMarks: nextMaxMarks,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
        setTranscript(safeTranscript);
        speakText(fallbackQ);
      }
      addToast?.({ type: 'warning', message: 'Proceeding to next question.' });
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
      score: `${scorecard.totalScore}/100 Marks`,
      grade: scorecard.totalScore >= 90 ? 'Elite Distinction (A+)' : (scorecard.totalScore >= 75 ? 'Placement Ready (A)' : 'Competency Pass (B+)'),
      skills: [selectedCompany.name, selectedRole.name, ...(scorecard.strengths ? scorecard.strengths.slice(0, 2) : ['DSA', 'System Design'])],
      badgeIcon: selectedCompany.logo,
      badgeColor: selectedCompany.color
    });

    setClaimedCert(cert);
    addToast?.({ type: 'success', message: 'Official verifiable certificate issued and added to your portfolio!' });
  };

  // Manage print class on document.body when diagnostic scorecard modal is open
  useEffect(() => {
    if (isCompleted && scorecard) {
      document.body.classList.add('mock-interview-report-open');
    } else {
      document.body.classList.remove('mock-interview-report-open');
    }
    return () => {
      document.body.classList.remove('mock-interview-report-open');
    };
  }, [isCompleted, scorecard]);

  const handleDownloadPDF = () => {
    if (!scorecard) return;
    try {
      generateMockInterviewDiagnosticPDF({
        scorecard,
        candidateName: user?.name || user?.displayName || 'Scholar',
        company: selectedCompany,
        role: selectedRole,
        experienceLevel
      });
      addToast?.({ type: 'success', message: 'Diagnostic Report PDF generated and downloaded!' });
    } catch (err) {
      console.error('PDF generation error:', err);
      addToast?.({ type: 'error', message: 'Could not generate vector PDF. You can use Browser Print.' });
    }
  };

  const handlePrintReport = () => {
    if (typeof window !== 'undefined') {
      document.body.classList.add('print-mock-interview-report');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('print-mock-interview-report');
      }, 1000);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentStageInfo = INTERVIEW_STAGES[roundNumber - 1] || INTERVIEW_STAGES[0];

  return (
    <div className="min-h-screen bg-[#07070b] text-white p-4 md:p-8 space-y-6 interview-room-content">
      
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
                Resume-Based AI Placement Interview Studio
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-500/30">
                100 Marks Evaluation
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Progressive Easy-to-Hard Rounds • Starts with Self-Introduction • AI vs Candidate Answer Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('certificates')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Certificates & Badges
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

      {/* =========================================================================
          SETUP & CONFIGURATION VIEW (BEFORE INTERVIEW STARTS)
         ========================================================================= */}
      {!sessionStarted ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. RESUME INTEGRATION SECTION (CORE REQUIREMENT) */}
            <div className="p-6 rounded-3xl bg-black/40 border border-cyan-500/30 shadow-lg shadow-cyan-500/5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Attach Resume for Personalized Questions
                  </h2>
                </div>
                {resumeText && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" /> Resume Grounded ({resumeText.length} chars)
                  </span>
                )}
              </div>

              {/* Resume Source Tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setResumeTab('upload')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    resumeTab === 'upload' ? 'bg-cyan-500 text-black shadow-md' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Resume (PDF / TXT)
                </button>
                <button
                  type="button"
                  onClick={() => setResumeTab('paste')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    resumeTab === 'paste' ? 'bg-cyan-500 text-black shadow-md' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" /> Paste Text / Projects
                </button>
                <button
                  type="button"
                  onClick={handleUseProfile}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-purple-400" /> Use Scholar Profile
                </button>
              </div>

              {/* Upload Tab */}
              {resumeTab === 'upload' && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 bg-cyan-950/10 hover:bg-cyan-950/20 transition-all text-center cursor-pointer space-y-2"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                    {isParsingResume ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {isParsingResume ? "Extracting text from PDF..." : "Click to Upload Resume (PDF or TXT)"}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      The AI interviewer will analyze your actual projects, frameworks, and tools.
                    </p>
                  </div>
                  {resumeFileName && (
                    <span className="inline-block mt-2 px-3 py-1 bg-black/60 border border-white/10 rounded-lg text-xs font-mono text-cyan-300">
                      📄 {resumeFileName}
                    </span>
                  )}
                </div>
              )}

              {/* Paste Tab */}
              {resumeTab === 'paste' && (
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume highlights here: e.g. Projects: Hospital Management System (React, Node, MongoDB); Skills: Java, Python, SQL, REST APIs..."
                    className="w-full bg-[#10101b] border border-white/10 rounded-2xl p-3 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[10px] text-gray-400">
                    💡 Tip: Include your top 2 projects, technologies used, and core engineering skills.
                  </span>
                </div>
              )}
            </div>

            {/* 2. TARGET COMPANY HIRING BENCHMARK */}
            <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-400" />
                    Target Company Hiring Standard
                  </h2>
                </div>
                <span className="text-[11px] text-gray-400">8 Presets</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {COMPANY_PRESETS.map((comp) => {
                  const isSelected = selectedCompany.id === comp.id;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedCompany(comp)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-b from-cyan-950/60 to-black border-cyan-500 shadow-lg shadow-cyan-500/10' 
                          : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{comp.logo}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <div className="mt-2.5">
                        <p className="text-xs font-bold text-white">{comp.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{comp.focus}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. INTERVIEW DOMAIN TRACK */}
            <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  Engineering Track & Role
                </h2>
              </div>

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

          {/* 4. PROGRESSIVE DIFFICULTY & 100-MARK STRUCTURE SIDEBAR */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-950/40 via-black to-black border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Progressive 100-Mark Ladder
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black">
                  Total: 100 Marks • {questionsPerRound * totalRounds} Qs
                </span>
              </div>

              {/* 5-Stage Stepper Preview */}
              <div className="space-y-2.5">
                {INTERVIEW_STAGES.map((stg) => (
                  <div key={stg.round} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                          stg.difficulty.includes('Easy') ? 'bg-emerald-500/20 text-emerald-300' : (stg.difficulty === 'Medium' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300')
                        }`}>
                          {stg.difficulty}
                        </span>
                        <strong className="text-xs text-white">Round {stg.round}</strong>
                      </div>
                      <p className="text-[11px] text-gray-400">{stg.title}</p>
                      <p className="text-[10px] text-cyan-400 font-bold">{questionsPerRound} Questions • {stg.maxMarks} Marks</p>
                    </div>
                    <span className="text-xs font-black text-cyan-300 shrink-0">
                      {stg.maxMarks} M
                    </span>
                  </div>
                ))}
              </div>

              {/* Questions per Round Selector */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Questions per Round</label>
                  <span className="text-[10px] text-cyan-400 font-bold">{questionsPerRound * totalRounds} Questions Total</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { q: 2, label: '2 Questions', sub: '10 Qs (Recommended)' },
                    { q: 3, label: '3 Questions', sub: '15 Qs (Intensive)' },
                    { q: 1, label: '1 Question', sub: '5 Qs (Fast)' }
                  ].map((opt) => (
                    <button
                      key={opt.q}
                      onClick={() => setQuestionsPerRound(opt.q)}
                      className={`py-2 px-1 text-[10px] font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        questionsPerRound === opt.q 
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-sm' 
                          : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <div>{opt.label}</div>
                      <div className={`text-[8px] ${questionsPerRound === opt.q ? 'text-black/80 font-semibold' : 'text-gray-500'}`}>{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level Selector */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Candidate Experience</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Fresher (0-1 yrs)', 'Mid (2-4 yrs)', 'Internship'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setExperienceLevel(lvl)}
                      className={`py-2 px-1 text-[10px] font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        experienceLevel === lvl 
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-sm' 
                          : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {lvl.split(' ')[0]}
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
                    Synthesizing Resume Questions...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black" />
                    Enter AI Mock Interview Studio
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                Starts with Easy (Introduce Yourself), probes your resume projects, and generates a full 100-mark report comparing your answers with model AI solutions.
              </p>
            </div>
          </div>

        </div>
      ) : null}

      {/* =========================================================================
          LIVE INTERVIEW STUDIO VIEW
         ========================================================================= */}
      {sessionStarted && !isCompleted && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
          
          {/* Left Column: Progress Ladder & Avatar */}
          <div className="space-y-5">
            
            {/* Live Voice Avatar Box */}
            <div className="p-5 rounded-3xl bg-black/50 border border-white/10 text-center space-y-4 relative overflow-hidden shadow-2xl">
              <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 border border-cyan-500/50 flex items-center justify-center">
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75"></div>
                )}
                <div className="text-4xl animate-pulse">
                  {selectedCompany.logo}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{selectedCompany.name} Senior AI Interviewer</h3>
                <p className="text-[11px] text-cyan-300 font-medium mt-0.5">{selectedRole.name}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSpeaking ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-white/10 text-gray-400'}`}>
                    {isSpeaking ? 'Speaking...' : 'Listening to Candidate'}
                  </span>
                  <button
                    onClick={() => {
                      if (voiceEnabled) stopSpeaking();
                      setVoiceEnabled(!voiceEnabled);
                    }}
                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    title={voiceEnabled ? 'Mute AI voice' : 'Enable AI voice'}
                  >
                    {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
                  </button>
                </div>
              </div>
            </div>

            {/* 5-Stage Progressive Difficulty Ladder */}
            <div className="p-4 rounded-3xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 border-b border-white/10 pb-2">
                <span>Progressive Stages</span>
                <span className="text-cyan-400">Total 100 Marks</span>
              </div>

              <div className="space-y-2">
                {INTERVIEW_STAGES.map((stg) => {
                  const isCurrent = roundNumber === stg.round;
                  const isDone = roundNumber > stg.round;

                  return (
                    <div 
                      key={stg.round}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        isCurrent 
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-md' 
                          : (isDone ? 'bg-emerald-500/5 border-emerald-500/20 text-gray-400' : 'bg-white/[0.02] border-white/5 text-gray-500')
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          isDone ? 'bg-emerald-500 text-black' : (isCurrent ? 'bg-cyan-400 text-black animate-pulse' : 'bg-white/10 text-gray-400')
                        }`}>
                          {isDone ? '✓' : stg.round}
                        </span>
                        <div>
                          <p className="font-bold leading-tight">{stg.title.split(' ')[0]} {stg.title.split(' ')[1] || ''}</p>
                          <span className={`text-[9px] font-bold ${stg.difficulty.includes('Easy') ? 'text-emerald-400' : (stg.difficulty === 'Medium' ? 'text-blue-400' : 'text-red-400')}`}>
                            {stg.difficulty} • {questionsPerRound} Qs
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-cyan-300 text-[11px]">{stg.maxMarks}M</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resume Info Badge */}
            {resumeText && (
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] text-gray-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">Resume Active: {resumeFileName || 'Custom Text'}</span>
              </div>
            )}

          </div>

          {/* Right Column: Live Chat & Interaction Arena */}
          <div className="lg:col-span-3 flex flex-col h-[700px] bg-black/40 border border-white/10 rounded-3xl p-5 space-y-4 backdrop-blur-md relative overflow-hidden">
            
            {/* Top Bar: Current Round Banner & Timer */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase">
                  Round {roundNumber} of {totalRounds} • Q{questionIndexInRound} of {questionsPerRound}
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">{currentStageInfo.title}</h3>
                  <span className={`text-[10px] font-bold ${currentStageInfo.difficulty.includes('Easy') ? 'text-emerald-400' : (currentStageInfo.difficulty === 'Medium' ? 'text-blue-400' : 'text-red-400')}`}>
                    Difficulty: {currentStageInfo.difficulty} • Question {((roundNumber - 1) * questionsPerRound) + questionIndexInRound} of {totalRounds * questionsPerRound}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono font-bold ${
                  timeLeft <= 30 ? 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse' : 'bg-white/5 text-gray-300 border-white/10'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(timeLeft)}</span>
                </div>
              </div>
            </div>

            {/* Transcript Chat Body */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {transcript.map((item, idx) => (
                <div key={idx} className="space-y-1.5 animate-fade-in">
                  
                  {/* Interviewer Question */}
                  {item.role === 'interviewer' && (
                    <div className="flex items-start gap-3 max-w-3xl">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-sm shrink-0 shadow-md">
                        🤖
                      </div>
                      <div className="p-4 rounded-2xl rounded-tl-sm bg-[#12121f] border border-cyan-500/20 text-white text-xs sm:text-sm leading-relaxed space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold">
                          <span>{selectedCompany.name} Interviewer • Round {item.round} Q{item.questionIndexInRound || 1} ({item.difficulty || 'Technical'})</span>
                          <span className="text-gray-500">{item.timestamp}</span>
                        </div>
                        <p className="font-medium whitespace-pre-wrap">{item.message}</p>
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            onClick={() => speakText(item.message)}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer text-[10px] flex items-center gap-1"
                          >
                            <Volume2 className="w-3 h-3" /> Replay Voice
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Candidate Answer */}
                  {item.role === 'candidate' && (
                    <div className="flex items-start justify-end gap-3 max-w-3xl ml-auto">
                      <div className="p-4 rounded-2xl rounded-tr-sm bg-cyan-950/40 border border-cyan-500/30 text-white text-xs sm:text-sm leading-relaxed space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-gray-400">
                          <span className="text-gray-500">{item.timestamp}</span>
                          <span className="font-bold text-cyan-300">Your Response • Round {item.round} Q{item.questionIndexInRound || 1}</span>
                        </div>
                        <p className={`whitespace-pre-wrap ${item.isSkipped ? 'italic text-amber-300 font-semibold' : ''}`}>
                          {item.message}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-sm shrink-0">
                        👨‍🎓
                      </div>
                    </div>
                  )}

                  {/* Round Feedback & Score Pill */}
                  {item.role === 'feedback' && (
                    <div className="max-w-2xl mx-auto my-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Round {item.round} Q{item.questionIndexInRound || 1} Evaluation
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          item.marksAwarded >= (item.maxMarks * 0.7) 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : (item.marksAwarded === 0 ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30')
                        }`}>
                          Score: {item.marksAwarded} / {item.maxMarks} Marks
                        </span>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">{item.message}</p>
                    </div>
                  )}

                </div>
              ))}

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
                  title={isListening ? 'Stop recording voice' : 'Click to speak your answer via microphone'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <textarea
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitAnswer(false);
                    }
                  }}
                  placeholder={isListening ? "Listening to your voice... (you can also edit text here)" : "Type your technical response, code logic, or speak via mic..."}
                  rows={2}
                  className="flex-1 bg-transparent border-0 focus:ring-0 text-xs md:text-sm text-white placeholder-gray-500 resize-none outline-none"
                  disabled={isEvaluating}
                />

                {/* Skip Question Button (Direct user requirement) */}
                <button
                  type="button"
                  onClick={() => handleSubmitAnswer(true)}
                  disabled={isEvaluating}
                  className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 text-xs font-bold border border-white/10 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  title="Skip this question if unfamiliar (recorded in report with model answer)"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Skip</span>
                </button>

                {/* Submit Button */}
                <button
                  onClick={() => handleSubmitAnswer(false)}
                  disabled={!candidateAnswer.trim() || isEvaluating}
                  className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-md shadow-cyan-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-500 px-1">
                <span>{speechSupported ? '🎙️ Microphone dictation active' : '⌨️ Keyboard input ready'}</span>
                <span>Press Enter to Submit • Use "Skip" if unfamiliar</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          COMPREHENSIVE 100-MARK DIAGNOSTIC REPORT MODAL
         ========================================================================= */}
      {isCompleted && scorecard && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto mock-interview-report-backdrop">
          <div ref={reportPrintRef} className="w-full max-w-4xl rounded-3xl p-6 md:p-8 border border-white/15 bg-[#090912] relative space-y-6 shadow-2xl my-auto animate-scale-up text-white max-h-[92vh] overflow-y-auto custom-scrollbar mock-interview-report-modal">
            
            {/* Close Button (no-print) */}
            <button
              onClick={() => {
                setIsCompleted(false);
                setSessionStarted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all cursor-pointer no-print"
              title="Close Report"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Total 100-Mark Diagnostic Scorecard */}
            <div className="text-center space-y-2 border-b border-white/10 pb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-cyan-500/20">
                {scorecard.isPassing ? '🏆' : '📋'}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Placement Mock Interview Diagnostic Report
              </h2>
              <p className="text-xs text-gray-400">
                {selectedCompany.name} • {selectedRole.name} ({experienceLevel}) • Evaluated out of 100 Marks
              </p>
            </div>

            {/* Score Overview Hero */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
                <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">Total Score</span>
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-400 mt-1">
                  {scorecard.totalScore} / 100
                </p>
                <span className="text-[10px] text-gray-400">Marks Scored</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Passing Cutoff</span>
                <p className="text-3xl font-black text-white mt-1">70 / 100</p>
                <span className="text-[10px] text-gray-400">Placement Benchmark</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Unanswered / Skipped</span>
                <p className={`text-3xl font-black mt-1 ${scorecard.skippedCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {scorecard.skippedCount}
                </p>
                <span className="text-[10px] text-gray-400">{scorecard.skippedCount === 0 ? 'All Answered!' : 'Questions Missed'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Hiring Verdict</span>
                <p className={`text-xs font-black mt-3 leading-tight ${scorecard.isPassing ? 'text-emerald-400' : 'text-red-400'}`}>
                  {scorecard.verdict}
                </p>
              </div>
            </div>

            {/* Diagnostic Summary */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 text-xs text-gray-300">
              <span className="text-[10px] text-cyan-400 uppercase font-black tracking-wider block">Executive Diagnostic Summary</span>
              <p className="leading-relaxed">{scorecard.summary}</p>
            </div>

            {/* STRENGTHS & WEAKNESSES (CORE USER REQUIREMENT) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Strengths */}
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <span className="text-emerald-400 font-extrabold flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Candidate Strengths
                </span>
                <ul className="space-y-2 text-gray-300">
                  {scorecard.strengths && scorecard.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses to be improved */}
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <span className="text-amber-400 font-extrabold flex items-center gap-1.5 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-400" /> Weaknesses & Areas to Improve
                </span>
                <ul className="space-y-2 text-gray-300">
                  {scorecard.weaknesses && scorecard.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-400 font-bold shrink-0">⚠️</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* QUESTION-BY-QUESTION ANALYSIS: USER ANSWER COMPARED WITH AI MODEL ANSWER */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Question-by-Question Deep Analysis & AI Model Answers
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Comparing your response with ideal placement answers. Unanswered questions feature full study answers.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {scorecard.questionBreakdown && scorecard.questionBreakdown.map((item, idx) => {
                  return (
                    <div 
                      key={idx}
                      className={`p-5 rounded-2xl border transition-all space-y-3 question-analysis-card ${
                        item.isUnanswered 
                          ? 'bg-red-950/15 border-red-500/30' 
                          : 'bg-white/[0.02] border-white/10'
                      }`}
                    >
                      {/* Round Header & Score */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white text-[11px] font-bold">
                            Round {item.round} • Q{item.questionIndexInRound || 1}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            item.difficulty.includes('Easy') ? 'bg-emerald-500/20 text-emerald-300' : (item.difficulty === 'Medium' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300')
                          }`}>
                            {item.difficulty}
                          </span>
                          <span className="text-xs font-semibold text-gray-300">{item.title}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.isUnanswered ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-black uppercase">
                              ⚠️ Unanswered (0 Marks)
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-black">
                              {item.marksAwarded} / {item.maxMarks} Marks
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="text-xs text-white">
                        <span className="text-cyan-400 font-bold block mb-1">Interviewer Question:</span>
                        <p className="font-semibold text-gray-100 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
                          {item.question}
                        </p>
                      </div>

                      {/* User's Answer vs AI Model Answer Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        
                        {/* Candidate Answer */}
                        <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                          item.isUnanswered ? 'bg-red-950/20 border-red-500/30' : 'bg-white/5 border-white/5'
                        }`}>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                            Your Response:
                          </span>
                          <p className={`leading-relaxed text-xs ${item.isUnanswered ? 'text-red-300 font-bold italic' : 'text-gray-200'}`}>
                            {item.userAnswer}
                          </p>
                          {item.isUnanswered && (
                            <p className="text-[10px] text-amber-400 mt-1">
                              Notice: You passed or left this question blank. Study the ideal model answer to the right!
                            </p>
                          )}
                        </div>

                        {/* AI Ideal / Model Answer */}
                        <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI Ideal / Model Answer:
                          </span>
                          <p className="leading-relaxed text-xs text-gray-200 whitespace-pre-wrap">
                            {item.aiModelAnswer}
                          </p>
                        </div>

                      </div>

                      {/* Comparative Analysis */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] space-y-1">
                        <span className="text-purple-400 font-bold">Comparative Diagnostic Analysis:</span>
                        <p className="text-gray-300 leading-relaxed">{item.comparisonAnalysis}</p>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons & Certificate Lock */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              
              {scorecard.isPassing ? (
                !claimedCert ? (
                  <button
                    onClick={handleClaimCertificate}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 hover:opacity-95 text-black font-black text-sm tracking-wide transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Award className="w-5 h-5" />
                    Claim Verifiable Proof-of-Skill Certificate ({scorecard.totalScore}/100 Marks)
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
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
                    </div>
                  </div>
                )
              ) : (
                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-2 text-red-300 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-red-400" />
                    <span>Placement Benchmark Not Met ({scorecard.totalScore} / 100 Marks • Minimum 70 Required)</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Review the AI model answers above for the questions you missed or skipped, revise your core concepts, and re-attempt to earn your verifiable certificate.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 no-print">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 min-w-[210px] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Official PDF Report
                </button>

                <button
                  onClick={handlePrintReport}
                  className="flex-1 min-w-[170px] py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4 text-cyan-400" />
                  Print / Save as PDF (Ctrl+P)
                </button>

                <button
                  onClick={() => {
                    setIsCompleted(false);
                    setSessionStarted(false);
                    setTranscript([]);
                    setScorecard(null);
                    setClaimedCert(null);
                  }}
                  className="flex-1 min-w-[140px] py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs border border-white/10 cursor-pointer transition-colors"
                >
                  Start New Interview
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex-1 min-w-[140px] py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs border border-white/10 cursor-pointer transition-colors"
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
