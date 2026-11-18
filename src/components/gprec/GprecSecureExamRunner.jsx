import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
import Editor from '@monaco-editor/react';
import {
  Shield, ShieldAlert, ShieldCheck, Lock, Eye, Video, VideoOff, Mic, MicOff,
  Clock, AlertTriangle, CheckCircle2, Play, Send, Maximize, Flag, RotateCcw,
  ChevronLeft, ChevronRight, Code, CheckSquare, Download, X, Terminal, Award
} from 'lucide-react';
import { ExamProctorBridge } from '../../services/examProctorService';
import {
  runCodingTestCases,
  generateIntegrityHash,
  openPrintableScorecardPdf
} from './gprecSecureExamBank';

const formatTime = (sec) => {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
};

export default function GprecSecureExamRunner({
  exam,
  user,
  onCompleteAttempt,
  onExit,
  addToast
}) {
  const studentName = user?.name || user?.displayName || 'GPREC Scholar';
  const studentEmail = user?.email || 'scholar@gprec.ac.in';
  const rollNumber = user?.rollNumber || user?.roll || 'GPREC-STUDENT';
  const department = user?.branch || user?.department || 'CSE';
  const studentIdentityLabel = studentName.toUpperCase().includes(String(rollNumber).toUpperCase())
    ? studentName
    : `${studentName} (${rollNumber})`;

  // Phase: 'preflight' | 'active' | 'result'
  const [phase, setPhase] = useState('preflight');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [agreedHonorCode, setAgreedHonorCode] = useState(false);

  // Hardware proctoring state
  const [camStatus, setCamStatus] = useState('idle'); // 'idle' | 'ready' | 'denied'
  const [allowNoCamFallback, setAllowNoCamFallback] = useState(false);
  const [audioDb, setAudioDb] = useState(0);
  const streamRef = useRef(null);
  const preflightVideoRef = useRef(null);
  const liveVideoRef = useRef(null);
  const audioCtxRef = useRef(null);
  const proctorBridgeRef = useRef(null);
  const sessionTokenRef = useRef(`SES-${Date.now().toString(36).toUpperCase()}`);

  // Security & Integrity state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [trustScore, setTrustScore] = useState(100);
  const [violations, setViolations] = useState([]);
  const [activeAlertBanner, setActiveAlertBanner] = useState(null);
  const [proctorMessage, setProctorMessage] = useState(null);
  const [visionStatus, setVisionStatus] = useState('verified'); // 'verified' | 'obstructed' | 'no_face' | 'multi_face'
  const [visionDetail, setVisionDetail] = useState('Face & Camera Verified');
  const submittedRef = useRef(false);
  const examStartedAtRef = useRef(0);
  const lastFocusStrikeAtRef = useRef(0);
  const lastVisionStrikeAtRef = useRef(0);
  const lastAudioStrikeAtRef = useRef(0);
  const visionAnomalyStreakRef = useRef(0);
  const audioSpikeStreakRef = useRef(0);

  // Exam Navigation & Timers
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState((exam.durationMinutes || 30) * 60);
  const [sectionTimers, setSectionTimers] = useState(() =>
    (exam.sections || []).map(s => (s.durationMinutes || 15) * 60)
  );

  // MCQ Answers & Review flags: { [questionId]: optionIndex }
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});

  // Coding Workspace state: { [problemId]: { language, code, result } }
  const [codingState, setCodingState] = useState(() => {
    const init = {};
    (exam.sections || []).forEach(sec => {
      if (sec.type === 'coding') {
        (sec.problems || []).forEach(p => {
          init[p.id] = {
            language: 'javascript',
            code: p.starterCode?.javascript || '',
            result: null
          };
        });
      }
    });
    return init;
  });

  // Final Graded Attempt Result
  const [finalAttempt, setFinalAttempt] = useState(null);

  // Per-candidate randomized copy when shuffleQuestions / shuffleOptions are enabled
  const preparedExam = useMemo(() => {
    const shouldShuffleQ = Boolean(exam.shuffleQuestions);
    const shouldShuffleO = Boolean(exam.shuffleOptions);
    if (!shouldShuffleQ && !shouldShuffleO) return exam;

    const mappedSections = (exam.sections || []).map(sec => {
      if (sec.type !== 'mcq') return sec;
      let qs = (sec.questions || []).map(q => {
        if (!shouldShuffleO || !Array.isArray(q.options)) return q;
        const tagged = q.options.map((text, origIdx) => ({ text, isCorrect: origIdx === q.correctIndex }));
        const mixed = shuffleArray(tagged);
        return {
          ...q,
          options: mixed.map(x => x.text),
          correctIndex: Math.max(0, mixed.findIndex(x => x.isCorrect))
        };
      });
      if (shouldShuffleQ) qs = shuffleArray(qs);
      return { ...sec, questions: qs };
    });

    return { ...exam, sections: mappedSections };
  }, [exam]);

  const currentSection = preparedExam.sections?.[activeSectionIdx] || preparedExam.sections?.[0];
  const sectionItems = currentSection?.type === 'coding'
    ? (currentSection.problems || [])
    : (currentSection?.questions || []);
  const currentItem = sectionItems[activeQuestionIdx] || sectionItems[0];

  // Clean up media tracks & proctor bridge on unmount
  const stopHardwareAndBridge = useCallback(() => {
    try {
      if (proctorBridgeRef.current?.leaveSession) {
        proctorBridgeRef.current.leaveSession();
      }
    } catch (e) {}
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    } catch (e) {}
    try {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {}
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    return () => stopHardwareAndBridge();
  }, [stopHardwareAndBridge]);

  // Attach media stream to active video element whenever phase changes
  useEffect(() => {
    const vid = phase === 'preflight' ? preflightVideoRef.current : liveVideoRef.current;
    if (vid && streamRef.current) {
      vid.srcObject = streamRef.current;
    }
  }, [phase, camStatus]);

  const requestCameraAndMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
        audio: true
      });
      streamRef.current = stream;
      setCamStatus('ready');
      if (preflightVideoRef.current) {
        preflightVideoRef.current.srcObject = stream;
      }
      // Ambient audio monitor
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;
          const src = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          src.connect(analyser);
          const buf = new Uint8Array(analyser.frequencyBinCount);
          const tick = () => {
            if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
            analyser.getByteFrequencyData(buf);
            const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
            setAudioDb(Math.min(100, Math.round((avg / 128) * 100)));
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      } catch (e) {}
    } catch (err) {
      setCamStatus('denied');
      if (addToast) {
        addToast({
          message: 'Camera/Mic permission unavailable. You can enable fallback mode (logged in audit).',
          type: 'warning'
        });
      }
    }
  };

  // Auto-grade & finalize attempt
  const finalizeExam = useCallback((terminationReason = 'Completed Normally', latestViolations = null, latestTrust = null) => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const finalViolations = latestViolations ?? violations;
    const finalTrust = latestTrust ?? trustScore;

    let earnedMarks = 0;
    let totalMarks = 0;
    const sectionBreakdown = [];

    (preparedExam.sections || []).forEach(sec => {
      let secEarned = 0;
      let secMax = 0;

      if (sec.type === 'mcq') {
        const pos = sec.marksPerQuestion || 2;
        const neg = sec.negativeMarks ?? (exam.negativeMarking || 0);
        (sec.questions || []).forEach(q => {
          secMax += pos;
          const ans = mcqAnswers[q.id];
          if (ans !== undefined && ans !== null) {
            if (ans === q.correctIndex) {
              secEarned += pos;
            } else if (neg > 0) {
              secEarned -= neg;
            }
          }
        });
      } else if (sec.type === 'coding') {
        (sec.problems || []).forEach(p => {
          const pMarks = p.marks || sec.marksPerQuestion || 15;
          secMax += pMarks;
          const st = codingState[p.id];
          const res = runCodingTestCases(p, st?.language || 'javascript', st?.code || '', true);
          const ratio = res.total > 0 ? res.passed / res.total : 0;
          secEarned += Math.round(pMarks * ratio * 10) / 10;
        });
      }

      secEarned = Math.max(0, Math.round(secEarned * 100) / 100);
      earnedMarks += secEarned;
      totalMarks += secMax;
      sectionBreakdown.push({
        id: sec.id,
        title: sec.title,
        type: sec.type,
        earned: secEarned,
        max: secMax
      });
    });

    earnedMarks = Math.round(earnedMarks * 100) / 100;
    const percentage = totalMarks > 0 ? Math.max(0, Math.round((earnedMarks / totalMarks) * 100)) : 0;
    const integrityVerdict =
      terminationReason.includes('Terminated') || finalTrust < 55
        ? 'High Risk — Audit Required'
        : finalTrust < 85 || finalViolations.length > 0
        ? 'Flagged — Minor Alerts'
        : 'Verified Clean';

    const submittedAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const receiptHash = generateIntegrityHash(
      `${exam.id}|${studentEmail}|${earnedMarks}/${totalMarks}|${finalTrust}|${submittedAt}`
    );

    const attempt = {
      id: `att-${Date.now()}`,
      receiptHash,
      examId: exam.id,
      examTitle: exam.title,
      company: exam.company,
      studentName,
      studentEmail,
      rollNumber,
      department,
      earnedMarks,
      totalMarks,
      percentage,
      trustScore: finalTrust,
      violationCount: finalViolations.length,
      violations: finalViolations,
      integrityVerdict,
      terminationReason,
      webcamVerified: camStatus === 'ready',
      sectionBreakdown,
      submittedAt
    };

    stopHardwareAndBridge();
    setFinalAttempt(attempt);
    setPhase('result');
    if (onCompleteAttempt) onCompleteAttempt(attempt);
  }, [
    exam, preparedExam, mcqAnswers, codingState, violations, trustScore,
    studentName, studentEmail, rollNumber, department, camStatus,
    stopHardwareAndBridge, onCompleteAttempt
  ]);

  // Record security violation & check auto-termination threshold
  const recordViolation = useCallback((type, detail, penalty = 12) => {
    if (phase !== 'active' || submittedRef.current) return;
    const entry = {
      id: Date.now() + Math.random(),
      type,
      detail,
      penalty,
      time: new Date().toLocaleTimeString('en-IN', { hour12: false })
    };
    setViolations(prev => {
      const next = [entry, ...prev];
      const nextTrust = Math.max(0, 100 - next.reduce((acc, v) => acc + v.penalty, 0));
      setTrustScore(nextTrust);
      setActiveAlertBanner(`${type}: ${detail} (Strike ${next.length}/${exam.maxViolations || 5})`);
      setTimeout(() => setActiveAlertBanner(null), 5000);

      if (next.length >= (exam.maxViolations || 5)) {
        setTimeout(() => {
          finalizeExam(`Auto-Terminated: Exceeded max security violations (${next.length})`, next, nextTrust);
        }, 400);
      }
      return next;
    });
  }, [phase, exam.maxViolations, finalizeExam]);

  // Enter Fullscreen & start exam
  const handleStartExam = async () => {
    if (exam.passcode && passcodeInput.trim().toUpperCase() !== exam.passcode.trim().toUpperCase()) {
      setPasscodeError(`Invalid access passcode. Hint for this GPREC mock: ${exam.passcode}`);
      return;
    }
    if (!agreedHonorCode) {
      setPasscodeError('Please accept the GPREC Zero-Trust Exam Honor Code to proceed.');
      return;
    }
    if (exam.requireWebcam && camStatus !== 'ready' && !allowNoCamFallback) {
      setPasscodeError('Please enable Webcam verification or check the desktop fallback option.');
      return;
    }

    setPasscodeError('');
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (e) {
      setIsFullscreen(false);
    }

    // Connect live proctor telemetry bridge
    try {
      proctorBridgeRef.current = ExamProctorBridge.joinStudentSession(
        exam.id,
        { email: studentEmail, name: studentName, roll: rollNumber, department },
        (payload) => {
          if (payload.action === 'warn') {
            setProctorMessage(payload.message || 'Live Proctor Warning: Keep your eyes on the exam screen.');
            recordViolation('Live Proctor Warning', payload.message || 'Manual flag issued by proctor', 10);
          } else if (payload.action === 'terminate') {
            finalizeExam('Force-Terminated by Live Exam Proctor');
          }
        }
      );
    } catch (e) {}

    examStartedAtRef.current = Date.now();
    setPhase('active');
    if (camStatus !== 'ready') {
      // Log camera fallback in audit trail cleanly (no strike penalty, informational 5% note)
      setViolations([{
        id: Date.now(),
        type: 'Camera Fallback Mode',
        detail: 'Candidate started session without hardware webcam feed',
        penalty: 5,
        time: new Date().toLocaleTimeString('en-IN', { hour12: false })
      }]);
      setTrustScore(95);
    }
  };

  // Active Security Lockdown Listeners (with 3s launch grace window + focus/tab deduplication)
  useEffect(() => {
    if (phase !== 'active') return;

    const withinLaunchGrace = () => Date.now() - examStartedAtRef.current < 3000;

    const handleVisibility = () => {
      if (withinLaunchGrace()) return;
      if (document.hidden) {
        const now = Date.now();
        if (now - lastFocusStrikeAtRef.current < 1500) return;
        lastFocusStrikeAtRef.current = now;
        recordViolation('Tab Switch Detected', 'Candidate navigated away from the secure exam tab', 15);
      }
    };
    const handleBlur = () => {
      if (withinLaunchGrace()) return;
      const now = Date.now();
      if (now - lastFocusStrikeAtRef.current < 1500) return;
      lastFocusStrikeAtRef.current = now;
      recordViolation('Window Focus Lost', 'Candidate clicked outside the locked exam window', 12);
    };
    const handleFullscreenChange = () => {
      const inFs = Boolean(document.fullscreenElement);
      setIsFullscreen(inFs);
      if (withinLaunchGrace()) return;
      if (!inFs && !submittedRef.current) {
        recordViolation('Fullscreen Exit', 'Candidate exited mandatory fullscreen lockdown', 15);
      }
    };
    const handleContextMenu = (e) => {
      e.preventDefault();
      recordViolation('Right-Click Blocked', 'Context menu inspection attempt blocked', 5);
    };
    const handleClipboard = (e) => {
      e.preventDefault();
      recordViolation('Clipboard Blocked', `Attempted ${e.type.toUpperCase()} during locked exam`, 10);
    };
    const handleKeyDown = (e) => {
      const key = e.key?.toLowerCase();
      const isDevTools = e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(key)) || (e.ctrlKey && key === 'u');
      const isCopyPaste = (e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'p', 's'].includes(key);
      const isPrintScreen = e.key === 'PrintScreen';

      if (isDevTools || isCopyPaste || isPrintScreen) {
        e.preventDefault();
        e.stopPropagation();
        recordViolation(
          isDevTools ? 'DevTools Shortcut Blocked' : isPrintScreen ? 'Screen Capture Blocked' : 'Shortcut Blocked',
          `Blocked restricted key combination (${e.key})`,
          isDevTools ? 20 : 10
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleClipboard);
    document.addEventListener('cut', handleClipboard);
    document.addEventListener('paste', handleClipboard);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleClipboard);
      document.removeEventListener('cut', handleClipboard);
      document.removeEventListener('paste', handleClipboard);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [phase, recordViolation]);

  // Countdown Timers
  useEffect(() => {
    if (phase !== 'active') return;
    const timer = setInterval(() => {
      setTotalTimeLeft(prev => {
        if (prev <= 1) {
          finalizeExam('Time Expired — Auto-Submitted');
          return 0;
        }
        return prev - 1;
      });
      setSectionTimers(prev =>
        prev.map((secT, idx) => (idx === activeSectionIdx ? Math.max(0, secT - 1) : secT))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, activeSectionIdx, finalizeExam]);

  // Real-Time AI Vision Analyzer: Detects Covered/Blocked Lens, Low Contrast, No-Face & Multiple Faces
  useEffect(() => {
    if (phase !== 'active' || camStatus !== 'ready') return;

    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 90;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let faceDetector = null;
    try {
      if (typeof window !== 'undefined' && 'FaceDetector' in window) {
        faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 3 });
      }
    } catch (e) {}

    const analyzeFrame = async () => {
      const vid = liveVideoRef.current;
      if (!vid || vid.readyState < 2 || vid.videoWidth === 0 || !ctx) return;
      if (Date.now() - examStartedAtRef.current < 3500) return;

      ctx.drawImage(vid, 0, 0, 120, 90);
      const imgData = ctx.getImageData(0, 0, 120, 90).data;

      // Compute luminance mean, spatial standard deviation & edge energy
      const n = 120 * 90;
      const lum = new Float32Array(n);
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const idx = i * 4;
        const y = 0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2];
        lum[i] = y;
        sum += y;
      }
      const mean = sum / n;
      let sqDiff = 0;
      for (let i = 0; i < n; i++) {
        const d = lum[i] - mean;
        sqDiff += d * d;
      }
      const stdDev = Math.sqrt(sqDiff / n);

      let edgeSum = 0;
      let edgeCount = 0;
      for (let r = 1; r < 89; r += 2) {
        for (let c = 1; c < 119; c += 2) {
          const p = r * 120 + c;
          edgeSum += Math.abs(lum[p] - lum[p - 1]) + Math.abs(lum[p] - lum[p - 120]);
          edgeCount++;
        }
      }
      const avgEdge = edgeCount > 0 ? edgeSum / edgeCount : 0;

      // Covered lens / finger / lens cap / pitch-dark detection
      const isObstructed = mean < 18 || stdDev < 18 || avgEdge < 4.5;

      let nextStatus = 'verified';
      let nextDetail = 'Face & Camera Verified';

      if (isObstructed) {
        nextStatus = 'obstructed';
        nextDetail = 'Camera Blocked / Lens Covered';
      } else if (faceDetector) {
        try {
          const faces = await faceDetector.detect(canvas);
          if (faces.length === 0) {
            nextStatus = 'no_face';
            nextDetail = 'No Face Detected in Frame';
          } else if (faces.length > 1) {
            nextStatus = 'multi_face';
            nextDetail = `Multiple Faces Detected (${faces.length})`;
          }
        } catch (e) {}
      }

      setVisionStatus(nextStatus);
      setVisionDetail(nextDetail);

      if (nextStatus !== 'verified') {
        visionAnomalyStreakRef.current += 1;
        const now = Date.now();
        if (visionAnomalyStreakRef.current >= 2 && now - lastVisionStrikeAtRef.current >= 12000) {
          lastVisionStrikeAtRef.current = now;
          visionAnomalyStreakRef.current = 0;
          const strikeLabel =
            nextStatus === 'obstructed'
              ? 'Camera Obstruction Detected'
              : nextStatus === 'multi_face'
              ? 'Multiple Faces Detected'
              : 'Face Not Visible';
          recordViolation(
            strikeLabel,
            `${nextDetail} — keep your webcam uncovered and face centered`,
            10
          );
        }
      } else {
        visionAnomalyStreakRef.current = 0;
      }
    };

    const timer = setInterval(analyzeFrame, 2500);
    return () => clearInterval(timer);
  }, [phase, camStatus, recordViolation]);

  // Ambient Speech / Noise Spike Monitor
  useEffect(() => {
    if (phase !== 'active' || camStatus !== 'ready') return;
    if (Date.now() - examStartedAtRef.current < 4000) return;

    if (audioDb >= 72) {
      audioSpikeStreakRef.current += 1;
      const now = Date.now();
      if (audioSpikeStreakRef.current >= 4 && now - lastAudioStrikeAtRef.current >= 15000) {
        lastAudioStrikeAtRef.current = now;
        audioSpikeStreakRef.current = 0;
        recordViolation('High Ambient Audio Detected', `Sustained background speech/noise (${audioDb} dB)`, 8);
      }
    } else {
      audioSpikeStreakRef.current = 0;
    }
  }, [audioDb, phase, camStatus, recordViolation]);

  // Periodic Live Proctor Telemetry Broadcast (every 6 seconds)
  useEffect(() => {
    if (phase !== 'active') return;
    const interval = setInterval(() => {
      if (!proctorBridgeRef.current?.sendLiveFrame) return;
      let frameData = null;
      try {
        if (liveVideoRef.current && liveVideoRef.current.videoWidth > 0) {
          const canvas = document.createElement('canvas');
          canvas.width = 200;
          canvas.height = 150;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(liveVideoRef.current, 0, 0, 200, 150);
          frameData = canvas.toDataURL('image/jpeg', 0.55);
        }
      } catch (e) {}

      const totalQs = (exam.sections || []).reduce(
        (acc, s) => acc + (s.type === 'coding' ? (s.problems?.length || 0) : (s.questions?.length || 0)),
        0
      );

      proctorBridgeRef.current.sendLiveFrame({
        frame: frameData,
        warnings: violations.length,
        trustScore,
        faceStatus: camStatus === 'ready' ? visionStatus : 'no-camera',
        audioDb,
        currentQuestion: activeQuestionIdx + 1,
        totalQuestions: totalQs
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [phase, violations.length, trustScore, camStatus, visionStatus, audioDb, activeQuestionIdx, exam.sections]);

  const handleRunCode = (includeHidden) => {
    if (!currentItem) return;
    const st = codingState[currentItem.id] || { language: 'javascript', code: '' };
    const result = runCodingTestCases(currentItem, st.language, st.code, includeHidden);
    setCodingState(prev => ({
      ...prev,
      [currentItem.id]: { ...st, result }
    }));
    if (addToast) {
      addToast({
        message: result.error
          ? result.error
          : `${includeHidden ? 'Hidden + Visible' : 'Visible'} Tests: ${result.passed}/${result.total} Passed (${result.runtimeMs}ms)`,
        type: result.error || result.passed < result.total ? 'warning' : 'success'
      });
    }
  };

  // =========================================================================
  // PHASE 1: PRE-FLIGHT ZERO-TRUST SYSTEM CHECK GATE
  // =========================================================================
  if (phase === 'preflight') {
    const totalMcqs = (exam.sections || []).reduce((acc, s) => acc + (s.type === 'mcq' ? (s.questions?.length || 0) : 0), 0);
    const totalCoding = (exam.sections || []).reduce((acc, s) => acc + (s.type === 'coding' ? (s.problems?.length || 0) : 0), 0);

    return (
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-[#0B0D21] via-[#171A3F] to-[#2E1065] p-6 text-white flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Trust Proctored Exam Gate</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">{exam.title}</h2>
            <p className="text-xs text-slate-300 mt-1">{exam.company} • {exam.strictness} Lockdown</p>
          </div>
          <button
            onClick={() => { stopHardwareAndBridge(); onExit(); }}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold cursor-pointer flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Rules & Access Passcode */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Duration</div>
                <div className="text-base font-black text-slate-900 mt-0.5">{exam.durationMinutes} min</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Questions</div>
                <div className="text-base font-black text-indigo-600 mt-0.5">{totalMcqs} MCQ • {totalCoding} Code</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Max Strikes</div>
                <div className="text-base font-black text-rose-600 mt-0.5">{exam.maxViolations} Alerts</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
              <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>Active Security Protocols Enforced</span>
              </div>
              <ul className="space-y-1 text-amber-900/90 text-[11px] list-disc pl-4">
                <li>Mandatory Fullscreen Lockdown — exiting fullscreen triggers an immediate strike.</li>
                <li>Tab-switch, window blur, DevTools (`F12`), Right-Click & Copy/Paste are blocked & logged.</li>
                <li>Dynamic forensic watermark stamps your identity ({rollNumber}) across the screen.</li>
                <li>Exceeding {exam.maxViolations} violations automatically terminates & submits your paper.</li>
              </ul>
            </div>

            {exam.passcode && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Room Access Passcode *</label>
                  <button
                    type="button"
                    onClick={() => setPasscodeInput(exam.passcode)}
                    className="text-[11px] font-bold text-purple-600 hover:underline cursor-pointer"
                  >
                    Use Demo Code ({exam.passcode})
                  </button>
                </div>
                <input
                  type="text"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter exam passcode..."
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-sm uppercase tracking-wider focus:outline-none focus:border-purple-600"
                />
              </div>
            )}

            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedHonorCode}
                onChange={(e) => setAgreedHonorCode(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-purple-600"
              />
              <span>
                I, <strong>{studentName}</strong> ({studentEmail}), agree to the GPREC Academic Integrity & Zero-Trust Proctoring Policy.
              </span>
            </label>

            {passcodeError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{passcodeError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleStartExam}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#9333ea] hover:opacity-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 cursor-pointer transition-all"
            >
              <Maximize className="w-4 h-4" />
              <span>Activate Fullscreen Lockdown & Launch Exam</span>
            </button>
          </div>

          {/* Right: Live Camera & Audio Proctoring Verification */}
          <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-4 text-white flex flex-col justify-between gap-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>AI Proctor Sensor Check</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                camStatus === 'ready'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {camStatus === 'ready' ? 'LIVE VERIFIED' : 'STANDBY'}
              </span>
            </div>

            <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
              {camStatus === 'ready' ? (
                <video ref={preflightVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <VideoOff className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-300">Camera Preview Offline</div>
                  <p className="text-[10px] text-slate-500 mt-1">Click below to verify webcam & ambient mic before starting.</p>
                </div>
              )}
              {camStatus === 'ready' && (
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/75 backdrop-blur-md rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 transition-all" style={{ width: `${Math.max(8, audioDb)}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300">{audioDb} dB</span>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={requestCameraAndMic}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Video className="w-4 h-4" />
                <span>{camStatus === 'ready' ? 'Re-Test Camera & Mic' : 'Verify Webcam & Microphone'}</span>
              </button>

              {camStatus !== 'ready' && (
                <label className="flex items-start gap-2 text-[11px] text-slate-400 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={allowNoCamFallback}
                    onChange={(e) => setAllowNoCamFallback(e.target.checked)}
                    className="mt-0.5 accent-cyan-400"
                  />
                  <span>Desktop without camera? Proceed in Strict Browser Lockdown Mode (noted in report).</span>
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PHASE 3: AUTO-GRADED SCORECARD & INTEGRITY VERIFICATION REPORT
  // =========================================================================
  if (phase === 'result' && finalAttempt) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-[#0B0D21] via-[#1B1F4B] to-[#3B1E6E] p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-300 text-[10px] font-bold uppercase mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Tamper-Evident Receipt: {finalAttempt.receiptHash}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">{finalAttempt.examTitle}</h2>
            <p className="text-xs text-slate-300 mt-1">
              {finalAttempt.studentName} • {finalAttempt.terminationReason} • {finalAttempt.submittedAt}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openPrintableScorecardPdf(finalAttempt)}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={onExit}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs cursor-pointer"
            >
              Back to Exam Hall
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Total Marks</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{finalAttempt.earnedMarks} / {finalAttempt.totalMarks}</div>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
              <div className="text-[10px] font-bold text-indigo-500 uppercase">Score %</div>
              <div className="text-2xl font-black text-indigo-700 mt-1">{finalAttempt.percentage}%</div>
            </div>
            <div className={`p-4 rounded-2xl border text-center ${
              finalAttempt.trustScore >= 80 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Trust Score</div>
              <div className={`text-2xl font-black mt-1 ${finalAttempt.trustScore >= 80 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {finalAttempt.trustScore}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Integrity Status</div>
              <div className="text-xs font-extrabold text-slate-900 mt-2">{finalAttempt.integrityVerdict}</div>
            </div>
          </div>

          {/* Section Breakdown */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-3">Section-Wise Score Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {finalAttempt.sectionBreakdown.map(sec => (
                <div key={sec.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="text-[10px] font-bold uppercase text-purple-600">{sec.type}</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{sec.title}</div>
                  <div className="text-lg font-black text-slate-900 mt-2">{sec.earned} <span className="text-xs font-semibold text-slate-400">/ {sec.max}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Violation Audit Log */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-2">
              Security & Proctor Audit Log ({finalAttempt.violations.length} Events)
            </h3>
            {finalAttempt.violations.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero security anomalies detected. Fullscreen & focus maintained throughout.</span>
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                {finalAttempt.violations.map(v => (
                  <div key={v.id} className="p-3 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 mr-2">[{v.time}]</span>
                      <span className="font-bold text-rose-700">{v.type}:</span>{' '}
                      <span className="text-slate-600">{v.detail}</span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-600 flex-shrink-0">-{v.penalty}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PHASE 2: ACTIVE FULLSCREEN LOCKDOWN EXAM WORKSPACE
  // =========================================================================
  const curCoding = currentSection?.type === 'coding' && currentItem
    ? (codingState[currentItem.id] || { language: 'javascript', code: '', result: null })
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-[#070917] text-slate-100 flex flex-col select-none overflow-hidden">
      {/* Subtle Anti-Leak Forensic Watermark Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-30 opacity-[0.045] overflow-hidden flex flex-wrap items-center justify-around gap-16 -rotate-12"
        aria-hidden="true"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="text-xs font-mono font-bold tracking-widest text-white whitespace-nowrap">
            {studentIdentityLabel} • {sessionTokenRef.current}
          </div>
        ))}
      </div>

      {/* Fullscreen Recovery Shield if user exited fullscreen */}
      {!isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-6">
          <div className="bg-[#0F132C] border border-rose-500/50 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Fullscreen Lockdown Required</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This GPREC Secure Exam must remain in Fullscreen mode. Exiting fullscreen has been recorded in your integrity log ({violations.length}/{exam.maxViolations} strikes).
            </p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await document.documentElement.requestFullscreen();
                  setIsFullscreen(true);
                } catch (e) {
                  setIsFullscreen(true);
                }
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Maximize className="w-4 h-4" />
              <span>Return to Locked Fullscreen</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Locked Security Header */}
      <header className="relative z-20 bg-[#0D1027] border-b border-indigo-950 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-extrabold text-white truncate">{exam.title}</div>
            <div className="text-[10px] text-slate-400 truncate">
              {studentIdentityLabel} • Session {sessionTokenRef.current}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Trust Score Badge */}
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 ${
            trustScore >= 80
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : trustScore >= 60
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Trust: {trustScore}%</span>
          </div>

          {/* Violations Counter */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <AlertTriangle className={`w-3.5 h-3.5 ${violations.length > 0 ? 'text-rose-400' : 'text-slate-400'}`} />
            <span>Strikes: {violations.length}/{exam.maxViolations}</span>
          </div>

          {/* Overall Countdown */}
          <div className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-black flex items-center gap-1.5 border ${
            totalTimeLeft < 300
              ? 'bg-rose-600/20 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(totalTimeLeft)}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Submit your exam now? This cannot be undone.')) {
                finalizeExam('Submitted by Candidate');
              }
            }}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs cursor-pointer transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* Live Security Violation / Proctor Alert Banner */}
      {(activeAlertBanner || proctorMessage) && (
        <div className="relative z-20 bg-rose-600/95 text-white px-4 py-2 text-xs font-bold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{proctorMessage || activeAlertBanner}</span>
          </div>
          {proctorMessage && (
            <button onClick={() => setProctorMessage(null)} className="text-white/80 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Section Switcher Bar */}
      <div className="relative z-20 bg-[#0B0E22] border-b border-slate-800/80 px-4 py-2 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          {(exam.sections || []).map((sec, idx) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => { setActiveSectionIdx(idx); setActiveQuestionIdx(0); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 cursor-pointer transition-all ${
                activeSectionIdx === idx
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sec.type === 'coding' ? <Code className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
              <span>{sec.title}</span>
              <span className="font-mono text-[10px] opacity-80">({formatTime(sectionTimers[idx] || 0)})</span>
            </button>
          ))}
        </div>
        <div className="text-[11px] text-slate-400 whitespace-nowrap hidden sm:block">
          {currentSection?.type === 'mcq'
            ? `Marking: +${currentSection.marksPerQuestion} / -${currentSection.negativeMarks ?? exam.negativeMarking ?? 0}`
            : `Coding Auto-Grader • Visible + Hidden Tests`}
        </div>
      </div>

      {/* Main Active Exam Body */}
      <div className="relative z-20 flex-1 overflow-y-auto p-4 lg:p-6">
        {currentSection?.type === 'mcq' && currentItem ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* MCQ Question Canvas */}
            <div className="lg:col-span-8 bg-[#10142D] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                    Question {activeQuestionIdx + 1} of {sectionItems.length} • {currentItem.topic || 'General'}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    +{currentSection.marksPerQuestion} / -{currentSection.negativeMarks ?? exam.negativeMarking ?? 0}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentItem.prompt}
                </h3>

                <div className="space-y-2.5 pt-2">
                  {currentItem.options.map((opt, optIdx) => {
                    const selected = mcqAnswers[currentItem.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => setMcqAnswers(prev => ({ ...prev, [currentItem.id]: optIdx }))}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                          selected
                            ? 'bg-purple-600/25 border-purple-400 text-white shadow-sm'
                            : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                          selected ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-sm font-medium">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMcqAnswers(prev => { const cp = { ...prev }; delete cp[currentItem.id]; return cp; })}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarkedForReview(prev => ({ ...prev, [currentItem.id]: !prev[currentItem.id] }))}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer flex items-center gap-1 ${
                      markedForReview[currentItem.id]
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" /> {markedForReview[currentItem.id] ? 'Marked' : 'Mark for Review'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={activeQuestionIdx === 0}
                    onClick={() => setActiveQuestionIdx(i => Math.max(0, i - 1))}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-xs font-bold text-white cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeQuestionIdx < sectionItems.length - 1) {
                        setActiveQuestionIdx(i => i + 1);
                      } else if (activeSectionIdx < exam.sections.length - 1) {
                        setActiveSectionIdx(s => s + 1);
                        setActiveQuestionIdx(0);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold text-white cursor-pointer flex items-center gap-1"
                  >
                    <span>{activeQuestionIdx < sectionItems.length - 1 ? 'Save & Next' : 'Next Section'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar: Question Palette + Live Webcam PiP */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-[#10142D] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-extrabold text-slate-200">Question Palette</div>
                <div className="grid grid-cols-5 gap-2">
                  {sectionItems.map((q, idx) => {
                    const answered = mcqAnswers[q.id] !== undefined;
                    const flagged = markedForReview[q.id];
                    const isCur = idx === activeQuestionIdx;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setActiveQuestionIdx(idx)}
                        className={`h-9 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
                          isCur
                            ? 'ring-2 ring-cyan-400 bg-indigo-600 border-indigo-400 text-white'
                            : flagged
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : answered
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-500" /> Answered</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/40 border border-amber-400" /> Review</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-700" /> Unanswered</span>
                </div>
              </div>

              {/* Live Webcam Proctoring PiP with Real-Time AI Obstruction & Face Presence Alerts */}
              <div className={`bg-[#10142D] border rounded-2xl p-3 space-y-2 transition-colors ${
                camStatus === 'ready' && visionStatus !== 'verified'
                  ? 'border-rose-500/80 shadow-lg shadow-rose-950/40'
                  : 'border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-[11px] gap-2">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      camStatus !== 'ready'
                        ? 'bg-amber-400'
                        : visionStatus === 'verified'
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-rose-500 animate-ping'
                    }`} />
                    <span className="truncate">Live AI Proctor Feed</span>
                  </span>
                  <span className={`font-mono text-[10px] font-bold ${audioDb >= 72 ? 'text-rose-400' : 'text-cyan-300'}`}>
                    {audioDb} dB
                  </span>
                </div>
                <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                  {camStatus === 'ready' ? (
                    <>
                      <video ref={liveVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                      {visionStatus !== 'verified' && (
                        <div className="absolute inset-0 bg-rose-950/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center">
                          <ShieldAlert className="w-6 h-6 text-rose-400 mb-1 animate-bounce" />
                          <div className="text-[11px] font-extrabold text-white uppercase tracking-wide">
                            {visionDetail}
                          </div>
                          <div className="text-[10px] text-rose-200 mt-0.5">
                            Uncover camera & center face immediately
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-[11px] text-slate-500">Browser Lockdown Mode Active</span>
                  )}
                </div>
                {camStatus === 'ready' && (
                  <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center justify-between ${
                    visionStatus === 'verified'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    <span>{visionDetail}</span>
                    <span>{visionStatus === 'verified' ? 'OK' : 'ALERT'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : currentSection?.type === 'coding' && currentItem && curCoding ? (
          /* LIVE CODING ASSESSMENT WORKSPACE */
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            {/* Left: Problem Statement & Constraints */}
            <div className="lg:col-span-5 bg-[#10142D] border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-170px)]">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {sectionItems.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveQuestionIdx(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        idx === activeQuestionIdx ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      Problem {idx + 1}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-extrabold text-emerald-400">{currentItem.marks || 15} Marks</span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-white">{currentItem.title}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                  {currentItem.difficulty}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{currentItem.statement}</p>

              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-200">Constraints</div>
                <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
                  {(currentItem.constraints || []).map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-200">Sample Visible Test Cases</div>
                {(currentItem.visibleTests || []).map((t, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
                    <div className="text-slate-400">Input: <span className="text-cyan-300">{JSON.stringify(t.args)}</span></div>
                    <div className="text-slate-400">Expected: <span className="text-emerald-300">{JSON.stringify(t.expected)}</span></div>
                  </div>
                ))}
                <div className="text-[11px] text-amber-300 font-semibold">
                  + {(currentItem.hiddenTests || []).length} Hidden Evaluator Test Cases verified on submit.
                </div>
              </div>
            </div>

            {/* Right: Locked Monaco IDE + Test Execution Console */}
            <div className="lg:col-span-7 flex flex-col gap-3 max-h-[calc(100vh-170px)]">
              <div className="bg-[#10142D] border border-slate-800 rounded-2xl overflow-hidden flex flex-col flex-1 min-h-[360px]">
                <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <select
                      value={curCoding.language}
                      onChange={(e) => {
                        const lang = e.target.value;
                        setCodingState(prev => ({
                          ...prev,
                          [currentItem.id]: {
                            ...curCoding,
                            language: lang,
                            code: currentItem.starterCode?.[lang] || curCoding.code
                          }
                        }));
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-white"
                    >
                      <option value="javascript">JavaScript (Live Sandbox)</option>
                      <option value="python">Python 3</option>
                      <option value="java">Java 21</option>
                      <option value="cpp">C++ 17</option>
                    </select>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Anti-Paste Locked
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRunCode(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Run Visible</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRunCode(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Verify Hidden Tests</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-[280px]">
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    language={curCoding.language === 'cpp' ? 'cpp' : curCoding.language}
                    value={curCoding.code}
                    onMount={(editor, monaco) => {
                      // Block paste commands directly inside Monaco IDE
                      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
                        recordViolation('IDE Paste Blocked', 'Blocked Ctrl+V paste attempt inside locked Coding IDE', 15);
                      });
                      editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Insert, () => {
                        recordViolation('IDE Paste Blocked', 'Blocked Shift+Insert paste inside locked Coding IDE', 15);
                      });
                    }}
                    onChange={(val) => {
                      const nextCode = val || '';
                      const prevCode = curCoding.code || '';
                      const delta = nextCode.length - prevCode.length;
                      if (exam.strictCodingLockdown !== false && delta > 45) {
                        recordViolation('Bulk Code Injection Blocked', `Blocked sudden +${delta} char insertion inside Coding IDE`, 15);
                        setCodingState(prev => ({
                          ...prev,
                          [currentItem.id]: { ...curCoding, code: prevCode }
                        }));
                        return;
                      }
                      setCodingState(prev => ({
                        ...prev,
                        [currentItem.id]: { ...curCoding, code: nextCode }
                      }));
                    }}
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      contextmenu: false,
                      dragAndDrop: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true
                    }}
                  />
                </div>
              </div>

              {/* Execution Test Output Drawer */}
              {curCoding.result && (
                <div className="bg-[#10142D] border border-slate-800 rounded-2xl p-4 max-h-48 overflow-y-auto space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">
                      Test Verification: {curCoding.result.passed}/{curCoding.result.total} Passed
                    </span>
                    <span className="text-[11px] font-mono text-cyan-300">{curCoding.result.runtimeMs} ms</span>
                  </div>
                  {curCoding.result.error && (
                    <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 font-mono">
                      {curCoding.result.error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {curCoding.result.cases.map(tc => (
                      <div
                        key={tc.index}
                        className={`p-2.5 rounded-xl border text-[11px] font-mono ${
                          tc.passed
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{tc.label}</span>
                          <span>{tc.passed ? 'PASS' : 'FAIL'}</span>
                        </div>
                        {!tc.hidden && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            Expected: {tc.expected} | Got: {tc.actual}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
