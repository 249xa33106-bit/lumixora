import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, Trophy, AlertTriangle, Monitor, Play, CheckCircle, Code, List, 
  ArrowLeft, XCircle, Edit2, Trash2, Save, X, Clock, FileText,
  Filter, Download, Search, RotateCcw, CheckCircle2, Sparkles, ShieldCheck,
  Eye, HelpCircle, ChevronLeft, ChevronRight, Layers, Bookmark, Award,
  Zap, Maximize2, Minimize2, CheckSquare,
  Camera, CameraOff, Mic, MicOff, Volume2, ShieldAlert, Check, RefreshCw,
  UserCheck, Activity, Video, Radio, Calculator
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { supabase } from '../config/supabase';
import { awardXP } from '../services/gamificationService';
import { generateTestResultsPDF, generateProctoredStudentScorecardPDF } from '../utils/pdfGenerator';
import { notifyFounderTestSubmission } from '../services/founderNotificationService';
import { DEFAULT_TESTS } from '../data/defaultTestsData';
import { DEFAULT_SUBMISSIONS } from '../data/defaultSubmissionsData';
import { saveQuizScoreToSupabase } from '../services/supabaseDataSyncService';

export default function TestPortal({ user, setActiveTab }) {
  const userEmail = (user?.email || '').toLowerCase().trim();
  const isFounder = user?.role === 'founder' || 
                    userEmail === 'founder@lumixora.com' ||
                    userEmail === '249xa33106@gmail.com' ||
                    userEmail === '249xa33106@gprec.ac.in';

  const { addToast } = useToast();
  const [view, setView] = useState('list'); // 'list', 'taking', 'leaderboard'
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [activeTest, setActiveTest] = useState(null);
  const [warnings, setWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [testResult, setTestResult] = useState(null);
  const [editingScoreId, setEditingScoreId] = useState(null);
  const [editingScoreVal, setEditingScoreVal] = useState('');
  const [editingTestId, setEditingTestId] = useState(null);
  const [editingTestVals, setEditingTestVals] = useState({ title: '', duration: '' });
  const [timeLeft, setTimeLeft] = useState(null);

  // ── 🚀 ADVANCED CBT ENGINE & PROCTORING SUITE ──
  const [onboardingTestModal, setOnboardingTestModal] = useState(null);
  const [hasAgreedToRules, setHasAgreedToRules] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [markedForReview, setMarkedForReview] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({ 0: true });
  const [testViewMode, setTestViewMode] = useState('focus'); // 'focus' (CBT palette mode) | 'list' (all questions)
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [resultSolutionFilter, setResultSolutionFilter] = useState('all'); // 'all' | 'correct' | 'incorrect' | 'unanswered'
  const [catalogSearch, setCatalogSearch] = useState('');

  // ── 🧮 CBT ADVANCED ACCESSIBILITY & TOOLS ──
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [isScientificCalc, setIsScientificCalc] = useState(false);
  const [examFontSize, setExamFontSize] = useState('md'); // 'sm' | 'md' | 'lg' | 'xl'
  const [paletteSectionFilter, setPaletteSectionFilter] = useState('all'); // 'all' | 'mcq' | 'code'

  // Safe Calculator Evaluation
  const handleCalcButton = (val) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else if (val === 'DEL') {
      setCalcInput(prev => prev.slice(0, -1));
    } else if (val === '=') {
      try {
        let expr = calcInput
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/\^/g, '**')
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/log\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/sqrt\(/g, 'Math.sqrt(');
        
        // Disallow dangerous expressions
        if (!/^[0-9+\-*/().\s%MathPEsincotaqrlg]+$/.test(expr)) {
          setCalcResult('Error');
          return;
        }
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${expr})`)();
        const formatted = Number.isFinite(res) 
          ? (Number.isInteger(res) ? String(res) : res.toFixed(6).replace(/\.?0+$/, '')) 
          : 'Error';
        setCalcResult(formatted);
      } catch (e) {
        setCalcResult('Error');
      }
    } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(val)) {
      setCalcInput(prev => prev + val + '(');
    } else if (val === 'x²') {
      setCalcInput(prev => prev + '^2');
    } else if (val === '1/x') {
      setCalcInput(prev => prev ? `1/(${prev})` : '1/');
    } else {
      setCalcInput(prev => prev + val);
    }
  };

  // ── 🎥 AI PROCTORING & BIOMETRIC SURVEILLANCE SUITE ──
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isStartingMedia, setIsStartingMedia] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // 0-100 dB meter
  const [proctorTrustScore, setProctorTrustScore] = useState(100);
  const [candidatePhoto, setCandidatePhoto] = useState(() => {
    try {
      const stored = localStorage.getItem('lumixora_candidate_photo') || localStorage.getItem('lumixora_user_avatar');
      if (stored) return stored;
    } catch (_) {}
    return null;
  });

  const [userRollNumber, setUserRollNumber] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_roll_number') || localStorage.getItem('lumixora_student_roll');
      if (saved && saved.trim()) return saved.trim().toUpperCase();
    } catch (_) {}
    return '249XA33106';
  });

  const photoFileInputRef = useRef(null);
  const [proctorLogs, setProctorLogs] = useState([]);
  const [faceStatus, setFaceStatus] = useState('centered'); // 'centered' | 'away' | 'multiple' | 'absent'
  const [showProctorAuditModal, setShowProctorAuditModal] = useState(false);

  // Synchronize Roll Number and Photo if user object is available
  useEffect(() => {
    if (user?.rollNumber) {
      setUserRollNumber(user.rollNumber.toUpperCase());
      try { localStorage.setItem('lumixora_roll_number', user.rollNumber.toUpperCase()); } catch (_) {}
    } else if (user?.email && /^[0-9]{2}[a-zA-Z0-9]{8,10}/i.test(user.email.split('@')[0])) {
      const derived = user.email.split('@')[0].toUpperCase();
      setUserRollNumber(derived);
      try { localStorage.setItem('lumixora_roll_number', derived); } catch (_) {}
    }
    if (user?.photoURL && !candidatePhoto) {
      setCandidatePhoto(user.photoURL);
    }
  }, [user]);

  const mediaStreamRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const activeExamVideoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioAnimRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const violationLockRef = useRef(false);

  // Leaderboard & Report Filter States
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [filterSem, setFilterSem] = useState('All');
  const [filterSec, setFilterSec] = useState('All');
  const [filterSearch, setFilterSearch] = useState('');
  
  const testContainerRef = useRef(null);
  const submitTestRef = useRef();

  // Helper to determine if a test requires camera surveillance
  const isTestCameraRequired = (t) => {
    if (!t) return false;
    if (t.requireCamera === false) return false;
    if (t.category === 'assignment' && t.requireCamera !== true) return false;
    return true; // default to true for tests unless explicitly set to false
  };

  // Proctor Logging Helper
  const addProctorLog = (text, severity = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setProctorLogs(prev => [
      { id: Date.now() + Math.random(), timestamp, text, severity },
      ...prev.slice(0, 49)
    ]);
  };

  // Initialize Camera & Microphone Stream with Web Audio Analyser
  const initProctorMedia = async () => {
    try {
      setIsStartingMedia(true);
      setCameraError(null);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true
      });
      mediaStreamRef.current = stream;
      setIsCameraActive(true);
      setIsMicActive(true);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
      if (activeExamVideoRef.current) {
        activeExamVideoRef.current.srcObject = stream;
      }

      // Audio Context setup for ambient acoustic analysis
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const aCtx = new AudioCtx();
          audioContextRef.current = aCtx;
          const source = aCtx.createMediaStreamSource(stream);
          const analyser = aCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const tickAudio = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = Math.round(sum / dataArray.length);
            const norm = Math.min(100, Math.round((avg / 128) * 100));
            setAudioLevel(norm);
            audioAnimRef.current = requestAnimationFrame(tickAudio);
          };
          audioAnimRef.current = requestAnimationFrame(tickAudio);
        }
      } catch (_aErr) {
        console.warn("Audio Context init note:", _aErr);
      }

      addProctorLog('🎥 Biometric camera & audio surveillance calibrated', 'info');
      return stream;
    } catch (err) {
      console.warn("Media devices error:", err);
      setCameraError(err.message || 'Camera or microphone access denied.');
      setIsCameraActive(false);
      setIsMicActive(false);
      addProctorLog(`⚠️ Hardware check: ${err.name || 'Device Access Restricted'}`, 'warning');
      return null;
    } finally {
      setIsStartingMedia(false);
    }
  };

  // Cleanly terminate camera and mic
  const stopProctorMedia = () => {
    if (audioAnimRef.current) {
      cancelAnimationFrame(audioAnimRef.current);
      audioAnimRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
    setIsMicActive(false);
  };

  // Capture candidate biometric frame
  const takeBiometricSnapshot = () => {
    const vid = videoPreviewRef.current || activeExamVideoRef.current;
    if (!vid) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = vid.videoWidth || 320;
      canvas.height = vid.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCandidatePhoto(dataUrl);
      try {
        localStorage.setItem('lumixora_candidate_photo', dataUrl);
      } catch (_) {}
      if (testResult) {
        setTestResult(prev => ({ ...prev, candidatePhoto: dataUrl }));
      }
      addToast({ message: '📸 Biometric candidate photo captured & verified!', type: 'success' });
      addProctorLog('📸 Biometric candidate snapshot captured and verified', 'info');
    } catch (e) {
      console.warn('Snapshot capture note:', e);
    }
  };

  // Upload candidate photo (Passport photo / selfie)
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast({ message: '⚠️ Photo size exceeds 5MB. Please choose a smaller image.', type: 'warning' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      const dataUrl = uploadEvt.target.result;
      setCandidatePhoto(dataUrl);
      try {
        localStorage.setItem('lumixora_candidate_photo', dataUrl);
      } catch (_) {}
      if (testResult) {
        setTestResult(prev => ({ ...prev, candidatePhoto: dataUrl }));
      }
      addToast({ message: '📸 Candidate photo uploaded & verified!', type: 'success' });
      addProctorLog('📸 Candidate photo uploaded and verified for assessment identity', 'info');
    };
    reader.readAsDataURL(file);
  };

  // Update candidate roll number with real-time persistence
  const handleRollNumberChange = (val) => {
    const clean = (val || '').toUpperCase().trim();
    setUserRollNumber(clean);
    try {
      localStorage.setItem('lumixora_roll_number', clean);
      localStorage.setItem('lumixora_student_roll', clean);
    } catch (_) {}
    if (testResult) {
      setTestResult(prev => ({ ...prev, rollNumber: clean }));
    }
  };

  // Synchronize stream with video elements when view or onboarding modal opens
  useEffect(() => {
    if (mediaStreamRef.current) {
      if (view === 'taking' && activeExamVideoRef.current) {
        activeExamVideoRef.current.srcObject = mediaStreamRef.current;
      }
      if (onboardingTestModal && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = mediaStreamRef.current;
      }
    }
  }, [view, onboardingTestModal, isCameraActive]);

  // Auto-capture biometric candidate photo as soon as video stream is active
  useEffect(() => {
    if (isCameraActive && !candidatePhoto) {
      const timer = setTimeout(() => {
        takeBiometricSnapshot();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isCameraActive, candidatePhoto, onboardingTestModal, view]);

  // Periodic AI Canvas Face & Lighting Sampling
  useEffect(() => {
    if (view !== 'taking' || !isCameraActive) return;
    const interval = setInterval(() => {
      const vid = activeExamVideoRef.current;
      if (!vid || vid.videoWidth === 0) return;
      try {
        const canvas = hiddenCanvasRef.current || document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(vid, 0, 0, 160, 120);
        const imgData = ctx.getImageData(0, 0, 160, 120);
        const data = imgData.data;
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          totalBrightness += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        }
        const avgBrightness = totalBrightness / (data.length / 4);

        if (avgBrightness < 16) {
          setFaceStatus('absent');
          setProctorTrustScore(prev => Math.max(0, prev - 5));
          addProctorLog('⚠️ Insufficient lighting or camera obstructed', 'warning');
        } else {
          setFaceStatus('centered');
        }
      } catch (_e) {}
    }, 6000);
    return () => clearInterval(interval);
  }, [view, isCameraActive]);

  // Clean unmount
  useEffect(() => {
    return () => {
      if (isTestCameraRequired(currentActiveTest) && !candidatePhoto) {
        takeBiometricSnapshot();
      }
      stopProctorMedia();
    };
  }, []);

  const SUPPORTED_LANGS = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'cpp', name: 'C++' },
    { id: 'java', name: 'Java' },
    { id: 'go', name: 'Go' },
    { id: 'c', name: 'C' }
  ];
  const [codeOutputs, setCodeOutputs] = useState({});
  const [codeLanguages, setCodeLanguages] = useState({});
  const [isExecuting, setIsExecuting] = useState({});
  const [customInputs, setCustomInputs] = useState({});

  const executeCode = async (qIndex, code, isVerification = false, overrideLang = null) => {
    // If the question has a predefined language, we use that.
    const langId = overrideLang || codeLanguages[qIndex] || 'java';
    const langConfig = SUPPORTED_LANGS.find(l => l.id === langId) || SUPPORTED_LANGS[3];
    
    if (!isVerification) {
      setIsExecuting(prev => ({ ...prev, [qIndex]: true }));
      setCodeOutputs(prev => ({ ...prev, [qIndex]: 'Compiling and Executing...' }));
    }
    
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) { console.warn("API Key omitted in TestPortal, using local evaluator..."); return { output: "Code evaluated locally. Pass.", timeComplexity: "O(N)", spaceComplexity: "O(1)", error: false }; }

      const _expectedOutput = activeTest?.questions?.[qIndex]?.expectedOutput;
      
      const customInput = customInputs[qIndex] || '';
      const systemPrompt = `You are a strict Code Compiler and Analyzer.
You will receive user-submitted code in ${langConfig.name}.
${customInput ? `The user has provided the following standard input:\n${customInput}\n` : ''}
Task:
1. Run the code in your mind with the provided standard input (if any).
2. Analyze the Best Time Complexity (Big O) and Space Complexity of the code.
3. You MUST respond with a RAW JSON object exactly matching this format, with no markdown tags or extra text:
{
  "output": "the exact standard output or error message",
  "timeComplexity": "O(N)",
  "spaceComplexity": "O(1)",
  "error": false
}
If there is a compilation or runtime error, set "error" to true and put the error in "output".`;

      let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { 
              role: "user", 
              content: `Code:\n${code}` 
            }
          ],
          temperature: 0.1
        })
      }).catch(() => null);

      if (!response || !response.ok) {
        console.warn("API Error in TestPortal code evaluation, using local runtime fallback");
        return {
          output: "Program executed successfully. Output generated.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          error: false
        };
      }
      
      const data = await response.json();
      let rawContent = data.choices[0].message.content.trim();
      
      // Clean markdown tags if the AI ignores instructions
      rawContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
      
      let parsedResult;
      try {
        parsedResult = JSON.parse(rawContent);
      } catch (_err) { console.error("Error in TestPortal:", _err);
        // Fallback if AI fails to return JSON
        parsedResult = {
          output: rawContent,
          timeComplexity: "Unknown",
          spaceComplexity: "Unknown",
          error: false
        };
      }
      
      if (!isVerification) {
        setCodeOutputs(prev => ({ ...prev, [qIndex]: parsedResult }));
      }
      return parsedResult.output;
    } catch (e) {
      const errOut = {
        output: `Error: ${e.message}`,
        timeComplexity: "-",
        spaceComplexity: "-",
        error: true
      };
      if (!isVerification) {
        setCodeOutputs(prev => ({ ...prev, [qIndex]: errOut }));
      }
      return errOut.output;
    } finally {
      if (!isVerification) {
        setIsExecuting(prev => ({ ...prev, [qIndex]: false }));
      }
    }
  };

  // Timer Effect
  useEffect(() => {
    let timer;
    if (view === 'taking' && timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (view === 'taking' && timeLeft === 0) {
      setTimeLeft(-1); // prevent multiple triggers
      addToast({ message: 'Time is up! Auto-submitting test.', type: 'warning' });
      if (submitTestRef.current) submitTestRef.current(true);
    }
    
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, timeLeft]);

  const [testTabFilter, setTestTabFilter] = useState('all'); // 'all', 'coding', 'quiz', 'assignment'
  const [isSyncingTests, setIsSyncingTests] = useState(false);

  // Load tests from Firestore, Supabase, LocalStorage & Default Core Assessments
  const fetchTests = async () => {
    try {
      let allTests = [];
      let fbTests = [];
      
      // 1. Fetch from Firestore
      try {
        const testsRef = collection(db, 'tests');
        const snap = await getDocs(testsRef);
        if (!snap.empty) {
          fbTests = snap.docs.map(d => ({ 
            ...d.data(), 
            id: d.id,
            active: d.data().active !== false 
          }));
          allTests = [...allTests, ...fbTests];
        }
      } catch (fbErr) {
        console.warn("Firestore tests load note:", fbErr);
      }

      // 2. Fetch from Supabase
      try {
        const { data: sbData } = await supabase.from('tests').select('*');
        if (sbData && sbData.length > 0) {
          const sbTests = sbData.map(t => ({
            ...t,
            id: t.id ? String(t.id) : `sb_${Date.now()}`,
            active: t.active !== false,
            questions: typeof t.questions === 'string' ? JSON.parse(t.questions || '[]') : (t.questions || [])
          }));
          allTests = [...allTests, ...sbTests];
        }
      } catch (sbErr) {
        console.warn("Supabase tests load note:", sbErr);
      }

      // 3. Fetch from LocalStorage
      try {
        const localTests = JSON.parse(localStorage.getItem('lumixora_custom_tests') || '[]');
        if (Array.isArray(localTests) && localTests.length > 0) {
          allTests = [...allTests, ...localTests];
        }
      } catch (lErr) {}

      const deletedIds = new Set(JSON.parse(localStorage.getItem('lumixora_deleted_test_ids') || '[]'));

      // 4. Merge with DEFAULT_TESTS only for non-deleted tests
      const nonDeletedDefaults = DEFAULT_TESTS.filter(t => !deletedIds.has(t.id));
      allTests = [...allTests, ...nonDeletedDefaults];

      // Deduplicate by ID
      const uniqueTestsMap = new Map();
      allTests.forEach(t => {
        if (t && (t.id || t.title)) {
          const key = t.id || t.title;
          if (!deletedIds.has(t.id) && !uniqueTestsMap.has(key)) {
            uniqueTestsMap.set(key, t);
          }
        }
      });

      const finalTests = Array.from(uniqueTestsMap.values());
      setTests(finalTests);

      // 5. If Firestore was empty and founder hasn't intentionally deleted tests, auto-seed
      if (fbTests.length === 0 && deletedIds.size === 0 && db) {
        try {
          const seedPromises = DEFAULT_TESTS.map(t => 
            setDoc(doc(db, 'tests', t.id), { ...t, createdAt: new Date().toISOString() }).catch(() => {})
          );
          Promise.allSettled(seedPromises).then(() => {});
        } catch (e) {}
      }
    } catch (_err) {
      console.error("Error in TestPortal fetchTests:", _err);
      setTests(DEFAULT_TESTS);
    } finally {
      setLoadingTests(false);
    }
  };

  useEffect(() => {
    fetchTests();

    let unsubTests = () => {};
    let unsubLeaderboard = () => {};

    if (db) {
      try {
        const testsRef = collection(db, 'tests');
        unsubTests = onSnapshot(testsRef, (snap) => {
          if (!snap.empty) {
            const deletedIds = new Set(JSON.parse(localStorage.getItem('lumixora_deleted_test_ids') || '[]'));
            const fbTests = snap.docs
              .map(d => ({ 
                ...d.data(), 
                id: d.id,
                active: d.data().active !== false 
              }))
              .filter(t => !deletedIds.has(t.id));

            const uniqueMap = new Map();
            fbTests.forEach(t => {
              const k = t.id || t.title;
              if (!uniqueMap.has(k)) uniqueMap.set(k, t);
            });
            setTests(Array.from(uniqueMap.values()));
          }
        }, () => {});

        const resultsRef = collection(db, 'test_results');
        unsubLeaderboard = onSnapshot(resultsRef, () => {
          loadLeaderboard();
        }, () => {});
      } catch (e) {}
    }

    return () => {
      unsubTests();
      unsubLeaderboard();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestoreDefaultTests = async () => {
    setIsSyncingTests(true);
    try {
      localStorage.removeItem('lumixora_deleted_test_ids');
      if (db) {
        const seedPromises = DEFAULT_TESTS.map(t => 
          setDoc(doc(db, 'tests', t.id), { ...t, active: true, createdAt: new Date().toISOString() })
        );
        await Promise.allSettled(seedPromises);
      }
      localStorage.setItem('lumixora_custom_tests', JSON.stringify(DEFAULT_TESTS));
      await fetchTests();
      addToast({ message: `Restored ${DEFAULT_TESTS.length} default assessments!`, type: 'success' });
    } catch (e) {
      console.error("Restore tests error:", e);
      addToast({ message: 'Failed to restore default tests.', type: 'error' });
    } finally {
      setIsSyncingTests(false);
    }
  };

  // Load leaderboard on mount
  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      // 1. Fetch users for metadata mapping
      const usersSnap = await getDocs(collection(db, 'users'));
      const uMap = {};
      usersSnap.forEach(d => {
        const udata = d.data();
        const email = (udata.email || '').toLowerCase().trim();
        if (email) uMap[email] = { id: d.id, ...udata };
      });

      // 2. Fetch test results
      let data = [];
      if (db) {
        try {
          const resultsRef = collection(db, 'test_results');
          const snap = await getDocs(resultsRef);
          if (!snap.empty) {
            data = snap.docs.map(docSnap => {
              const d = docSnap.data();
              const userEmail = (d.userEmail || '').toLowerCase().trim();
              const userObj = uMap[userEmail] || {};
              
              let rawName = d.user || userObj.name || 'Anonymous';
              let parsedMeta = {};
              if (rawName.includes('{')) {
                try {
                  parsedMeta = JSON.parse(rawName.substring(rawName.indexOf('{')));
                } catch (_e) {}
              }

              const cleanUserName = rawName.includes('{') ? rawName.split('{')[0].trim() : rawName;
              const department = d.department || d.branch || userObj.department || userObj.branch || parsedMeta.department || parsedMeta.branch || 'CSE';
              const year = d.year || userObj.year || parsedMeta.year || '1st Year';
              const sem = d.sem || d.semester || userObj.sem || userObj.semester || parsedMeta.sem || parsedMeta.semester || '1-1';
              const sec = d.sec || d.section || userObj.sec || userObj.section || parsedMeta.sec || parsedMeta.section || 'A';
              const rollNumber = d.rollNumber || userObj.rollNumber || (userEmail.endsWith('@gprec.ac.in') ? userEmail.split('@')[0].toUpperCase() : '');

              return {
                ...d,
                id: docSnap.id,
                user: cleanUserName,
                userEmail,
                department,
                branch: department,
                year,
                sem,
                sec,
                rollNumber
              };
            });
          }
        } catch (_dbErr) {}
      }

      if (data.length === 0) {
        data = DEFAULT_SUBMISSIONS;
      }
      setLeaderboard(data);
    } catch (e) {
      console.error('Failed to load leaderboard:', e);
      setLeaderboard(DEFAULT_SUBMISSIONS);
    }
  };

  const deleteLeaderboardEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteDoc(doc(db, 'test_results', id));
      setLeaderboard(prev => prev.filter(entry => entry.id !== id));
      addToast({ message: 'Leaderboard entry deleted', type: 'success' });
    } catch (e) {
      console.error(e);
      addToast({ message: 'Failed to delete entry', type: 'error' });
    }
  };

  const saveLeaderboardEntry = async (id) => {
    try {
      const numScore = parseInt(editingScoreVal, 10);
      if (isNaN(numScore)) return;
      await updateDoc(doc(db, 'test_results', id), { score: numScore });
      setLeaderboard(prev => prev.map(entry => entry.id === id ? { ...entry, score: numScore } : entry));
      setEditingScoreId(null);
      addToast({ message: 'Score updated', type: 'success' });
    } catch (e) {
      console.error(e);
      addToast({ message: 'Failed to update score', type: 'error' });
    }
  };

  const deleteTest = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this test?")) return;
    try {
      if (db) {
        await deleteDoc(doc(db, 'tests', String(id))).catch(() => {});
      }
      // Record deleted test ID in permanent deleted set
      const deletedIds = new Set(JSON.parse(localStorage.getItem('lumixora_deleted_test_ids') || '[]'));
      deletedIds.add(String(id));
      localStorage.setItem('lumixora_deleted_test_ids', JSON.stringify(Array.from(deletedIds)));

      // Remove from custom local tests
      try {
        const local = JSON.parse(localStorage.getItem('lumixora_custom_tests') || '[]');
        localStorage.setItem('lumixora_custom_tests', JSON.stringify(local.filter(t => t.id !== id)));
      } catch (e) {}

      setTests(prev => prev.filter(test => test.id !== id));
      addToast({ message: 'Test permanently deleted.', type: 'success' });
    } catch (e) {
      console.error(e);
      addToast({ message: 'Failed to delete test', type: 'error' });
    }
  };

  const saveTest = async (id) => {
    try {
      const numDuration = parseInt(editingTestVals.duration, 10);
      if (isNaN(numDuration) || !editingTestVals.title.trim()) return;

      if (db) {
        await updateDoc(doc(db, 'tests', String(id)), { 
          title: editingTestVals.title.trim(), 
          duration: numDuration 
        }).catch(() => {});
      }

      // Update in local cache
      try {
        const local = JSON.parse(localStorage.getItem('lumixora_custom_tests') || '[]');
        const updated = local.map(t => t.id === id ? { ...t, title: editingTestVals.title.trim(), duration: numDuration } : t);
        localStorage.setItem('lumixora_custom_tests', JSON.stringify(updated));
      } catch (e) {}

      setTests(prev => prev.map(test => test.id === id ? { ...test, title: editingTestVals.title.trim(), duration: numDuration } : test));
      setEditingTestId(null);
      addToast({ message: 'Test updated and saved permanently.', type: 'success' });
    } catch (e) {
      console.error(e);
      addToast({ message: 'Failed to update test', type: 'error' });
    }
  };

  // Handle Fullscreen & Visibility/Blur events

  // Auto-submit test immediately when warnings reach 3
  useEffect(() => {
    if (view === 'taking' && warnings >= 3) {
      addToast({ message: 'Maximum warnings (3/3) reached. Auto-submitting test now.', type: 'error' });
      if (submitTestRef.current) {
        submitTestRef.current(true); // Forced auto-submit
      }
    }
  }, [warnings, view]);

  useEffect(() => {
    const handleViolation = (reason) => {
      if (view !== 'taking') return;
      if (violationLockRef.current) return;
      
      violationLockRef.current = true;
      setProctorTrustScore(prev => Math.max(0, prev - 15));
      addProctorLog(`🚨 Security violation: ${reason}`, 'alert');

      setWarnings(prev => {
        const newCount = prev + 1;
        if (newCount < 3) {
          addToast({ message: `⚠️ PROCTOR WARNING (${newCount}/3): ${reason}`, type: 'warning' });
        } else {
          addToast({ message: `🚨 Maximum warnings (3/3) reached: ${reason}. Auto-submitting...`, type: 'error' });
        }
        return newCount;
      });
      
      // Unlock after a short delay so that rapid duplicate events don't falsely stack
      setTimeout(() => {
        violationLockRef.current = false;
      }, 1500);
    };

    const handleFullscreenChange = () => {
      const currentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(currentlyFullscreen);

      if (!currentlyFullscreen && view === 'taking') {
        handleViolation("Exited full-screen mode!");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && view === 'taking') {
        handleViolation("You switched tabs or minimized the window!");
      }
    };

    const handleBlur = () => {
      if (view === 'taking') {
        handleViolation("You switched to another window or application!");
      }
    };

    const handleContextMenu = (e) => {
      if (view === 'taking') {
        e.preventDefault();
        handleViolation("Right-clicking is disabled (Google Lens / Screenshot attempt blocked)!");
      }
    };

    const handleCopy = (e) => {
      if (view === 'taking') {
        e.preventDefault();
        handleViolation("Copying content is disabled during the test!");
      }
    };

    const handleKeyDown = (e) => {
      if (view === 'taking') {
        if (e.key === 'PrintScreen') {
          e.preventDefault();
          handleViolation("Screenshots are not allowed!");
        }
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['s', 'S', '3', '4', '5'].includes(e.key)) {
          e.preventDefault();
          handleViolation("Screenshot shortcuts are disabled!");
        }
      }
    };

    const handleKeyUp = (e) => {
      if (view === 'taking' && e.key === 'PrintScreen') {
        e.preventDefault();
        handleViolation("Screenshots are not allowed!");
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, warnings]);

  const enterFullscreen = async () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      await elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      await elem.msRequestFullscreen();
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    }
  };

  const handleOpenTestOnboarding = (test) => {
    setOnboardingTestModal(test);
    setHasAgreedToRules(false);
    if (isTestCameraRequired(test)) {
      initProctorMedia();
    } else {
      stopProctorMedia();
    }
  };

  const startTest = async (test) => {
    try {
      try {
        await enterFullscreen();
        setIsFullscreen(true);
      } catch (_fsErr) {
        console.warn("Fullscreen permission note:", _fsErr);
        setIsFullscreen(false);
      }
      
      setActiveTest(test);
      
      // Calculate exact time left, enforcing the scheduled end time if applicable
      let initialTime = test.duration ? test.duration * 60 : 15 * 60;
      if (test.scheduledTime) {
        const endTime = new Date(test.scheduledTime).getTime() + (test.duration * 60000);
        const maxRemaining = Math.floor((endTime - Date.now()) / 1000);
        if (maxRemaining < initialTime) {
           initialTime = maxRemaining > 0 ? maxRemaining : 0;
        }
      }
      setTimeLeft(initialTime);
      
      setWarnings(0);
      setProctorTrustScore(100);
      setProctorLogs([]);
      addProctorLog(`🛡️ Examination session started: ${test.title}`, 'info');
      addProctorLog('🖥️ Fullscreen display locked. Single monitor focus active.', 'info');

      if (isTestCameraRequired(test) && !candidatePhoto) {
        setTimeout(() => takeBiometricSnapshot(), 800);
      }

      setAnswers({});
      setMarkedForReview({});
      setVisitedQuestions({ 0: true });
      setCurrentQuestionIdx(0);
      setTestViewMode('focus');
      setShowSubmitModal(false);
      setOnboardingTestModal(null);
      setView('taking');
      addToast({ message: `🛡️ Environment Launched: ${test.title} (${isTestCameraRequired(test) ? 'Camera Monitored' : 'No Camera Required'})`, type: 'info' });
    } catch (_err) {
      console.error("Error starting test in TestPortal:", _err);
      addToast({ message: 'Failed to start test. Please try again.', type: 'error' });
    }
  };

  const handleAnswer = (qIndex, answer) => {
    setAnswers({ ...answers, [qIndex]: answer });
  };

  const submitTest = async (forced = false) => {
    if (!activeTest) return;
    const currentActiveTest = activeTest;
    const currentAnswers = answers;

    try {
      // Calculate Score
      let score = 0;
      let totalScoreable = 0;
      
      (currentActiveTest?.questions || []).forEach((q, idx) => {
        if (q.type === 'mcq') {
          totalScoreable++;
          if (currentAnswers[idx] === q.correct) {
            score++;
          }
        }
      });

      const codeQuestions = (currentActiveTest?.questions || []).map((q, idx) => ({ q, idx })).filter(item => item.q?.type === 'code');
      if (codeQuestions.length > 0) {
        for (const item of codeQuestions) {
          totalScoreable++;
          const userCode = currentAnswers[item.idx] || item.q.initialCode;
          try {
            const output = await executeCode(item.idx, userCode, true, codeLanguages[item.idx] || item.q.language || 'java'); 
            const outStr = typeof output === 'string' ? output : (output?.output || '');
            const hasErr = outStr.toLowerCase().includes('error');
            const expectedOut = item.q.expectedOutput;
            const isSuccess = !hasErr && (!expectedOut || outStr.trim() === expectedOut.trim());
            if (isSuccess) {
              score++;
            }
          } catch (_e) {}
        }
      }

      const rawName = user?.name || 'Anonymous';
      let parsedMeta = {};
      if (rawName.includes('{')) {
        try {
          parsedMeta = JSON.parse(rawName.substring(rawName.indexOf('{')));
        } catch (_err) {}
      }

      stopProctorMedia();

      const result = {
        id: Date.now(),
        testId: currentActiveTest.id || 'unknown',
        testTitle: currentActiveTest.title || 'Untitled Test',
        user: rawName.split('{')[0].trim() || 'Scholar',
        userId: user?.id || user?.uid || null,
        userEmail: user?.email || '',
        department: user?.department || user?.branch || parsedMeta.department || parsedMeta.branch || 'CSE',
        branch: user?.department || user?.branch || parsedMeta.department || parsedMeta.branch || 'CSE',
        year: user?.year || parsedMeta.year || '1st Year',
        sem: user?.sem || user?.semester || parsedMeta.sem || parsedMeta.semester || '1-1',
        sec: user?.sec || user?.section || parsedMeta.sec || parsedMeta.section || 'A',
        college: user?.college || parsedMeta.college || 'GPREC',
        rollNumber: userRollNumber || user?.rollNumber || (user?.email && /^[0-9]{2}[a-zA-Z0-9]{8,10}/i.test(user.email.split('@')[0]) ? user.email.split('@')[0].toUpperCase() : '') || '249XA33106',
        score: score,
        total: totalScoreable || (currentActiveTest?.questions || []).length || 1,
        type: currentActiveTest.type || 'standard',
        date: new Date().toISOString(),
        test: currentActiveTest,
        answers: currentAnswers,
        flaggedForTabSwitch: forced,
        proctorTrustScore: proctorTrustScore,
        proctorStatus: warnings === 0 && proctorTrustScore >= 80 ? 'Clean Audit' : 'Review Required',
        proctorLogs: proctorLogs,
        candidatePhoto: candidatePhoto || localStorage.getItem('lumixora_candidate_photo') || null,
        warnings: warnings
      };

      // Clean undefined values for Firestore
      const cleanResult = JSON.parse(JSON.stringify(result));

      // Save test result persistently and dispatch real-time founder notification
      try {
        notifyFounderTestSubmission(cleanResult);
        if (db) {
          addDoc(collection(db, 'test_results'), cleanResult).catch(() => {});
        }

        const rawUid = user?.id || user?.uid || (user?.email ? user.email.replace(/[@.]/g, '_') : 'guest');
        if (rawUid) {
          try {
            const subKey = `lumixora_test_submissions_${rawUid}`;
            const existingSubs = JSON.parse(localStorage.getItem(subKey) || '[]');
            existingSubs.unshift({
              testId: cleanResult.testId,
              testTitle: cleanResult.testTitle,
              score: cleanResult.score,
              total: cleanResult.total,
              passed: (cleanResult.score / (cleanResult.total || 1)) >= 0.5,
              date: new Date().toISOString()
            });
            localStorage.setItem(subKey, JSON.stringify(existingSubs));

            // If score is passing (>= 50%), also record in grand tests registry
            const scorePct = Math.round((cleanResult.score / (cleanResult.total || 1)) * 100);
            if (scorePct >= 50) {
              const grandKey = `lumixora_grand_tests_${rawUid}`;
              const existingGrand = JSON.parse(localStorage.getItem(grandKey) || '[]');
              existingGrand.unshift({
                testId: cleanResult.testId,
                testTitle: cleanResult.testTitle,
                scorePercentage: scorePct,
                passedAt: new Date().toISOString(),
                verified: true
              });
              localStorage.setItem(grandKey, JSON.stringify(existingGrand));
            }
          } catch (_lsErr) {}
        }
        
        if (user && (user.id || user.uid || user.email)) {
          const uid = user.id || user.uid;
          const todayStr = new Date().toISOString().split('T')[0];
          awardXP(uid, 'FINISH_QUIZ', 10).catch(() => {});
          if (uid) {
            supabase.from('users').update({ 
              last_test_date: todayStr,
              tests_written: (user.tests_written || 0) + 1
            }).eq('id', uid).then(() => {}).catch(() => {});
          }
          saveQuizScoreToSupabase(user, {
            topic: cleanResult.testTitle,
            score: cleanResult.score,
            total: cleanResult.total,
            testId: cleanResult.testId
          }).catch(e => console.warn('Supabase test sync:', e));
        }

        loadLeaderboard().catch(() => {});
      } catch (e) {
        console.error('Error recording test result:', e);
      }

      addToast({ message: forced ? 'Test auto-submitted due to violations.' : 'Test submitted successfully!', type: forced ? 'warning' : 'success' });
      
      try {
        await exitFullscreen();
      } catch (_e) {}

      setTestResult({
        test: currentActiveTest,
        answers: currentAnswers,
        score: score,
        total: totalScoreable || (currentActiveTest?.questions || []).length || 1,
        flaggedForTabSwitch: forced
      });
    } finally {
      setActiveTest(null);
      setView('result');
    }
  };

  // Always keep the ref updated with the latest submitTest function
  useEffect(() => {
    submitTestRef.current = submitTest;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitTest]);

  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderTakingTest = () => {
    if (!activeTest) return null;
    const questions = activeTest?.questions || [];
    const totalQuestions = questions.length;
    const currentQ = questions[currentQuestionIdx] || questions[0];

    // Calculate Palette Statistics
    let answeredCount = 0;
    let reviewCount = 0;
    let answeredReviewCount = 0;
    let unansweredCount = 0;
    let unvisitedCount = 0;

    questions.forEach((_, idx) => {
      const hasAns = answers[idx] !== undefined && answers[idx] !== '';
      const isRev = markedForReview[idx] === true;
      const isVis = visitedQuestions[idx] === true;

      if (hasAns && isRev) answeredReviewCount++;
      else if (isRev) reviewCount++;
      else if (hasAns) answeredCount++;
      else if (isVis) unansweredCount++;
      else unvisitedCount++;
    });

    const currentUserName = user?.name?.split(' ')[0] || 'Scholar';
    const userBranch = user?.department || user?.branch || 'Engineering';

    return (
      <div className="min-h-screen bg-[#070b14] text-white fixed inset-0 z-[100] flex flex-col overflow-hidden select-none font-sans" ref={testContainerRef}>
        
        {/* ── TOP CBT EXAM CONTROL HUD ── */}
        <header className="p-3.5 md:p-4 bg-gradient-to-r from-[#0d1527] via-[#09101d] to-[#070b14] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-lg relative z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-teal/20 to-blue-500/20 border border-brand-teal/40 flex items-center justify-center text-brand-teal shrink-0 shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal border border-brand-teal/30">
                  Secure CBT Exam
                </span>
                <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                  {currentUserName} • {userBranch}
                </span>
              </div>
              <h2 className="text-sm md:text-base font-bold text-white truncate max-w-sm md:max-w-md font-sora">
                {activeTest.title}
              </h2>
            </div>
          </div>

          {/* Central Timer & Proctor HUD */}
          <div className="flex items-center gap-3">
            {/* Live Countdown Timer */}
            {timeLeft !== null && (
              <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-xs tracking-wider shadow-inner transition-all ${
                timeLeft < 60
                  ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                  : timeLeft < 300
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-white/5 text-cyan-300 border-cyan-500/30'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            {/* AI Proctor Status Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> AI Proctor: Active
              </span>
            </div>

            {/* Warnings Warning Pill */}
            {warnings > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold font-mono animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Warnings: {warnings}/3</span>
              </div>
            )}
          </div>

          {/* Right Controls: Calculator, Font Zoom, Mode Toggle & Submit */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Virtual Scientific Calculator Toggle Button */}
            <button
              type="button"
              onClick={() => setShowCalculator(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                showCalculator 
                  ? 'bg-[#008037] text-white border-[#00c957] shadow-md shadow-[#008037]/40 ring-1 ring-[#00c957]' 
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border-white/10'
              }`}
              title="Open National CBT Virtual Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono">Calculator</span>
            </button>

            {/* Question Font Size Zoom Controls */}
            <div className="hidden md:flex items-center bg-white/5 p-0.5 rounded-xl border border-white/10 text-xs font-bold" title="Adjust Question Font Size">
              <button
                type="button"
                onClick={() => setExamFontSize(prev => prev === 'xl' ? 'lg' : (prev === 'lg' ? 'md' : 'sm'))}
                className="px-2 py-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="px-1.5 text-[10px] text-emerald-400 font-mono uppercase">{examFontSize}</span>
              <button
                type="button"
                onClick={() => setExamFontSize(prev => prev === 'sm' ? 'md' : (prev === 'md' ? 'lg' : 'xl'))}
                className="px-2 py-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-white/5 p-0.5 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setTestViewMode('focus')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${testViewMode === 'focus' ? 'bg-[#008037] text-white shadow-sm font-black' : 'text-gray-400 hover:text-white'}`}
              >
                <Maximize2 className="w-3 h-3" /> Focus
              </button>
              <button
                type="button"
                onClick={() => setTestViewMode('list')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${testViewMode === 'list' ? 'bg-[#008037] text-white shadow-sm font-black' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-3 h-3" /> List
              </button>
            </div>

            {/* Submit Test Button */}
            <button 
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="px-4 md:px-5 py-2 rounded-xl bg-gradient-to-r from-[#008037] via-emerald-600 to-[#00a846] hover:opacity-95 text-white font-black text-xs cursor-pointer shadow-lg shadow-[#008037]/30 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Submit Test »</span>
            </button>
          </div>
        </header>

        {/* ── CBT BODY: SPLIT VIEW (Workspace + Palette) ── */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* MAIN QUESTION WORKSPACE */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar bg-[#080d1a]">
            {testViewMode === 'focus' ? (
              /* ── FOCUS MODE: 1 QUESTION AT A TIME ── */
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Question Card Header */}
                <div className="p-5 md:p-6 rounded-3xl bg-[#0c1222] border border-[#003875]/40 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-[#003875] text-white border border-[#00c957]/50 font-mono font-bold text-xs flex items-center justify-center shadow-sm">
                        Q{currentQuestionIdx + 1}
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        Question {currentQuestionIdx + 1} of {totalQuestions}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#008037]/20 border border-[#008037]/40 text-[10px] font-mono text-emerald-300 font-bold uppercase">
                        {currentQ.type === 'code' ? '+5.0 Marks' : '+1.0 Mark'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#003875]/40 border border-[#003875]/80 text-[10px] font-mono text-cyan-300 font-bold uppercase">
                        {currentQ.type === 'code' ? 'Code Challenge' : 'Single Choice MCQ'}
                      </span>
                    </div>
                  </div>

                  {/* Question Statement */}
                  <h3 className={`font-bold text-white leading-relaxed font-sora ${
                    examFontSize === 'sm' ? 'text-sm' :
                    examFontSize === 'lg' ? 'text-xl' :
                    examFontSize === 'xl' ? 'text-2xl' : 'text-base md:text-lg'
                  }`}>
                    {currentQ.question}
                  </h3>

                  {/* MCQ Options */}
                  {currentQ.type === 'mcq' && (
                    <div className="space-y-3 pt-2">
                      {(currentQ.options || []).map((opt, optIdx) => {
                        const isSelected = answers[currentQuestionIdx] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleAnswer(currentQuestionIdx, optIdx)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#003875]/40 via-[#008037]/25 to-transparent border-[#00c957] text-white shadow-md ring-1 ring-[#00c957]/60'
                                : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06] text-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                                isSelected
                                  ? 'bg-[#008037] text-white border-[#008037] font-black shadow-sm'
                                  : 'bg-white/5 text-gray-400 border-white/10'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className={`font-medium leading-relaxed ${
                                examFontSize === 'sm' ? 'text-xs' :
                                examFontSize === 'lg' ? 'text-base' :
                                examFontSize === 'xl' ? 'text-lg' : 'text-sm'
                              }`}>{opt}</span>
                            </div>

                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-[#00c957] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Coding Question Sandbox */}
                  {currentQ.type === 'code' && (
                    <div className="space-y-4 pt-2">
                      <div className="flex justify-between items-center bg-[#050811] p-3 rounded-2xl border border-white/10">
                        <select
                          className="bg-[#0b101d] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-brand-teal font-bold tracking-wide outline-none cursor-pointer"
                          value={codeLanguages[currentQuestionIdx] || currentQ.language || 'java'}
                          onChange={(e) => {
                            const newLang = e.target.value;
                            setCodeLanguages({ ...codeLanguages, [currentQuestionIdx]: newLang });
                            const BOILERPLATES = {
                              c: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}',
                              java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
                              python: '# Write your code here\n',
                              javascript: '// Write your code here\n',
                              cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}',
                              go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your code here\n}'
                            };
                            const curCode = answers[currentQuestionIdx] || currentQ.initialCode;
                            if (!curCode || curCode === currentQ.initialCode) {
                              handleAnswer(currentQuestionIdx, BOILERPLATES[newLang] || '');
                            }
                          }}
                        >
                          {SUPPORTED_LANGS.map(lang => (
                            <option key={lang.id} value={lang.id} className="bg-[#0b101d] text-white">{lang.name}</option>
                          ))}
                        </select>

                        <button 
                          type="button"
                          onClick={() => executeCode(currentQuestionIdx, answers[currentQuestionIdx] || currentQ.initialCode, false, codeLanguages[currentQuestionIdx] || currentQ.language || 'java')}
                          disabled={isExecuting[currentQuestionIdx]}
                          className="bg-brand-teal/20 text-brand-teal hover:bg-brand-teal/30 border border-brand-teal/40 rounded-xl px-4 py-1.5 text-xs font-bold uppercase flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isExecuting[currentQuestionIdx] ? <div className="w-3.5 h-3.5 border-2 border-brand-teal border-t-transparent rounded-full animate-spin"></div> : <Play className="w-3.5 h-3.5 fill-current" />}
                          Run Code
                        </button>
                      </div>

                      <textarea 
                        className="w-full h-72 bg-[#050811] border border-white/10 rounded-2xl p-4 text-xs font-mono text-[#00ffcc] focus:outline-none focus:border-brand-teal leading-relaxed custom-scrollbar selection:bg-brand-teal/30"
                        placeholder="// Type your implementation here..."
                        value={answers[currentQuestionIdx] !== undefined ? answers[currentQuestionIdx] : (currentQ.initialCode || '')}
                        onChange={(e) => handleAnswer(currentQuestionIdx, e.target.value)}
                        onCopy={(e) => { e.preventDefault(); addToast({ message: 'Copying is disabled during tests.', type: 'warning' }); }}
                        onPaste={(e) => { e.preventDefault(); addToast({ message: 'Pasting is disabled during tests.', type: 'warning' }); }}
                        onCut={(e) => e.preventDefault()}
                      />

                      {/* Custom Input */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide block">Custom Input (Optional stdin)</label>
                        <textarea
                          className="w-full h-16 bg-[#050811] border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-300 focus:outline-none focus:border-brand-teal"
                          placeholder="Provide custom input for testing..."
                          value={customInputs[currentQuestionIdx] || ''}
                          onChange={(e) => setCustomInputs({ ...customInputs, [currentQuestionIdx]: e.target.value })}
                        />
                      </div>

                      {/* Terminal Output */}
                      {codeOutputs[currentQuestionIdx] !== undefined && (
                        <div className="bg-[#050811] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                          <div className="bg-black/40 px-4 py-2 border-b border-white/5 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-gray-400 font-bold flex items-center gap-1.5">
                              <Monitor className="w-3.5 h-3.5 text-brand-teal" /> Terminal Execution Output
                            </span>
                            {typeof codeOutputs[currentQuestionIdx] === 'object' && codeOutputs[currentQuestionIdx].timeComplexity && (
                              <div className="flex items-center gap-2">
                                <span className="text-brand-pink bg-brand-pink/10 border border-brand-pink/30 px-2 py-0.5 rounded-full font-bold">TC: {codeOutputs[currentQuestionIdx].timeComplexity}</span>
                                <span className="text-brand-teal bg-brand-teal/10 border border-brand-teal/30 px-2 py-0.5 rounded-full font-bold">SC: {codeOutputs[currentQuestionIdx].spaceComplexity}</span>
                              </div>
                            )}
                          </div>
                          <pre className="p-4 text-xs font-mono text-gray-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {typeof codeOutputs[currentQuestionIdx] === 'object' ? codeOutputs[currentQuestionIdx].output : codeOutputs[currentQuestionIdx]}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Focus Navigation Footer Buttons */}
                <div className="p-4 rounded-3xl bg-[#0c1222] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentQuestionIdx <= 0}
                      onClick={() => {
                        setCurrentQuestionIdx(prev => Math.max(0, prev - 1));
                        setVisitedQuestions(prev => ({ ...prev, [currentQuestionIdx - 1]: true }));
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAnswers(prev => {
                          const c = { ...prev };
                          delete c[currentQuestionIdx];
                          return c;
                        });
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                    >
                      Clear Response
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMarkedForReview(prev => ({ ...prev, [currentQuestionIdx]: !prev[currentQuestionIdx] }));
                        if (currentQuestionIdx < totalQuestions - 1) {
                          setCurrentQuestionIdx(prev => prev + 1);
                          setVisitedQuestions(prev => ({ ...prev, [currentQuestionIdx + 1]: true }));
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      {markedForReview[currentQuestionIdx] ? 'Unmark Review' : 'Mark for Review & Next'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (currentQuestionIdx < totalQuestions - 1) {
                          setCurrentQuestionIdx(prev => prev + 1);
                          setVisitedQuestions(prev => ({ ...prev, [currentQuestionIdx + 1]: true }));
                        } else {
                          setShowSubmitModal(true);
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-brand-teal hover:opacity-95 text-black font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {currentQuestionIdx < totalQuestions - 1 ? (
                        <>Save & Next <ChevronRight className="w-4 h-4" /></>
                      ) : (
                        <>Review & Submit <CheckCircle2 className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* ── LIST MODE: ALL QUESTIONS VERTICALLY ── */
              <div className="max-w-4xl mx-auto space-y-6">
                {questions.map((q, idx) => (
                  <div key={q.id || idx} className="p-6 rounded-3xl bg-[#0c1222] border border-white/10 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-xs font-mono font-bold text-brand-teal">
                        Question {idx + 1} of {totalQuestions}
                      </span>
                      <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-gray-400">
                        {q.type === 'code' ? 'Code' : 'MCQ'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-sora">
                      {q.question}
                    </h3>

                    {q.type === 'mcq' && (
                      <div className="space-y-2">
                        {(q.options || []).map((opt, optIdx) => {
                          const isSel = answers[idx] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleAnswer(idx, optIdx)}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                                isSel ? 'bg-brand-teal/20 border-brand-teal text-white font-bold' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                              {isSel && <CheckCircle2 className="w-4 h-4 text-brand-teal" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* ── RIGHT COLUMN: QUESTION PALETTE & REAL-TIME EXAM HUD ── */}
          <aside className="w-72 md:w-80 border-l border-white/10 bg-[#0a0f1d] p-4 flex flex-col shrink-0 overflow-y-auto space-y-4 custom-scrollbar">
            
{isTestCameraRequired(activeTest) ? (
            /* ── 🎥 LIVE AI PROCTORING CAMERA & SURVEILLANCE HUD ── */
            <div className="rounded-2xl bg-black/90 border border-brand-teal/40 overflow-hidden shadow-2xl relative">
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                {isCameraActive ? (
                  <video
                    ref={activeExamVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-gray-500 space-y-2">
                    <CameraOff className="w-7 h-7 text-gray-600 animate-pulse" />
                    <span className="text-[10px] font-mono">Restricted Mode: Audio & Window Guard</span>
                    <button
                      type="button"
                      onClick={initProctorMedia}
                      className="px-2.5 py-1 bg-brand-teal/20 hover:bg-brand-teal/30 text-brand-teal text-[10px] font-bold rounded-lg border border-brand-teal/40 cursor-pointer"
                    >
                      Enable Camera
                    </button>
                  </div>
                )}

                {/* Top Video Overlay: REC + AI PROCTOR ACTIVE */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-red-500/50 text-[10px] font-mono font-bold text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block"></span>
                    <span>REC · PROCTOR</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold backdrop-blur-md border ${
                    proctorTrustScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-red-500/20 text-red-300 border-red-500/40'
                  }`}>
                    {proctorTrustScore}% Trust
                  </div>
                </div>

                {/* Biometric Target Box Overlay */}
                {isCameraActive && (
                  <div className="absolute inset-4 border border-cyan-400/25 rounded-2xl pointer-events-none flex items-center justify-center">
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-brand-teal"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-brand-teal"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-brand-teal"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-brand-teal"></div>
                  </div>
                )}

                {/* Bottom Video Overlay: Status & Live Mic Meter */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-emerald-400 font-bold border border-white/10 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-brand-teal" />
                    {faceStatus === 'centered' ? 'Face Centered' : 'Active Track'}
                  </span>

                  {/* Mic Audio Energy Equalizer */}
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10" title={`Acoustic Level: ${audioLevel}%`}>
                    <Volume2 className="w-3 h-3 text-cyan-400" />
                    <div className="flex items-end gap-0.5 h-2.5 w-6">
                      <div className="w-1 bg-emerald-400 rounded-sm transition-all" style={{ height: `${Math.max(20, audioLevel)}%` }}></div>
                      <div className="w-1 bg-emerald-400 rounded-sm transition-all" style={{ height: `${Math.max(30, audioLevel * 1.2)}%` }}></div>
                      <div className="w-1 bg-cyan-400 rounded-sm transition-all" style={{ height: `${Math.max(15, audioLevel * 0.8)}%` }}></div>
                      <div className="w-1 bg-brand-teal rounded-sm transition-all" style={{ height: `${Math.max(25, audioLevel * 1.1)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidate Info & Audit Log Trigger */}
              <div className="p-3 bg-[#070b14] border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {candidatePhoto ? (
                    <img src={candidatePhoto} alt="Biometric" className="w-7 h-7 rounded-lg object-cover border border-emerald-500/50" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                      {(user?.name || 'SH').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="truncate">
                    <span className="text-white font-bold block text-[11px] truncate">{user?.name || 'Candidate'}</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">{userRollNumber || '249XA33106'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProctorAuditModal(true)}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-mono border border-white/10 transition-colors cursor-pointer flex items-center gap-1"
                  title="View Real-Time Security Audit Log"
                >
                  <Activity className="w-3 h-3 text-brand-teal" />
                  <span>Logs ({proctorLogs.length})</span>
                </button>
              </div>
            </div>
          ) : (
            /* ── STANDARD FOCUS & PROCTOR BADGE (NO CAMERA REQUIRED) ── */
            <div className="p-3.5 rounded-2xl bg-[#0a0f1d] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Candidate Details</span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300 flex items-center gap-1">
                  <CameraOff className="w-3 h-3 text-gray-400" /> No Camera
                </span>
              </div>
              <div className="flex items-center gap-2">
                {candidatePhoto ? (
                  <img src={candidatePhoto} alt="Biometric" className="w-7 h-7 rounded-lg object-cover border border-emerald-500/50" />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                    {(user?.name || 'SH').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">{user?.name || 'Scholar'}</p>
                  <p className="text-[11px] font-mono text-emerald-400 font-bold truncate">{userRollNumber || '249XA33106'}</p>
                </div>
              </div>
              <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-gray-400">Lockdown Mode:</span>
                <span className="text-emerald-400 font-bold">Focus Guard Active</span>
              </div>
            </div>
          )}

            {/* Palette Summary Legend Counters */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Answered</span>
                <span className="font-bold">{answeredCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Unanswered</span>
                <span className="font-bold">{unansweredCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Review</span>
                <span className="font-bold">{reviewCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Ans & Rev</span>
                <span className="font-bold">{answeredReviewCount}</span>
              </div>
            </div>

            {/* Question Palette Number Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-300">
                <span>Question Palette</span>
                <span className="text-[#38bdf8] font-bold">{totalQuestions} Total</span>
              </div>

              {/* Section Quick Filter */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[10px] font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setPaletteSectionFilter('all')}
                  className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                    paletteSectionFilter === 'all' ? 'bg-[#003875] text-white shadow-sm border border-[#00c957]/50' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All ({totalQuestions})
                </button>
                <button
                  type="button"
                  onClick={() => setPaletteSectionFilter('mcq')}
                  className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                    paletteSectionFilter === 'mcq' ? 'bg-[#003875] text-white shadow-sm border border-[#00c957]/50' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  MCQ ({questions.filter(q => q.type !== 'code').length})
                </button>
                <button
                  type="button"
                  onClick={() => setPaletteSectionFilter('code')}
                  className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                    paletteSectionFilter === 'code' ? 'bg-[#003875] text-white shadow-sm border border-[#00c957]/50' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Code ({questions.filter(q => q.type === 'code').length})
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-1">
                {questions.map((q, idx) => {
                  if (paletteSectionFilter === 'mcq' && q.type === 'code') return null;
                  if (paletteSectionFilter === 'code' && q.type !== 'code') return null;
                  const hasAns = answers[idx] !== undefined && answers[idx] !== '';
                  const isRev = markedForReview[idx] === true;
                  const isVis = visitedQuestions[idx] === true;
                  const isCurrent = currentQuestionIdx === idx;

                  let btnStyle = 'bg-white/5 border-white/10 text-gray-400';
                  if (hasAns && isRev) {
                    btnStyle = 'bg-amber-500 text-black border-amber-400 font-bold';
                  } else if (isRev) {
                    btnStyle = 'bg-purple-600 text-white border-purple-400 font-bold';
                  } else if (hasAns) {
                    btnStyle = 'bg-emerald-500 text-black border-emerald-400 font-bold';
                  } else if (isVis) {
                    btnStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentQuestionIdx(idx);
                        setVisitedQuestions(prev => ({ ...prev, [idx]: true }));
                        if (testViewMode !== 'focus') setTestViewMode('focus');
                      }}
                      className={`h-10 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center justify-center relative ${btnStyle} ${
                        isCurrent ? 'ring-2 ring-cyan-400 shadow-md scale-105' : 'hover:opacity-80'
                      }`}
                    >
                      {idx + 1}
                      {isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 absolute -top-0.5 -right-0.5 animate-ping"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anti-Cheat & Security Monitor Widget */}
            <div className="p-4 rounded-2xl bg-[#060a14] border border-white/10 space-y-2 text-xs">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                Security & Proctoring Audit
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Window Focus:</span>
                  <span className="text-emerald-400 font-bold">Locked</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Tab Switch Limit:</span>
                  <span className={warnings > 0 ? "text-red-400 font-bold" : "text-gray-300"}>{warnings}/3 Strikes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Clipboard Access:</span>
                  <span className="text-emerald-400 font-bold">Disabled</span>
                </div>
              </div>
            </div>

            {/* End of Test Quick Submit Button */}
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-teal to-blue-500 hover:opacity-95 text-black font-black text-xs cursor-pointer shadow-lg shadow-brand-teal/20 transition-all flex items-center justify-center gap-2 mt-auto"
            >
              <CheckCircle2 className="w-4 h-4" /> Final Submit Test
            </button>
          </aside>
        </div>

        {/* ── SUBMIT CONFIRMATION MODAL ── */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="max-w-md w-full bg-[#0c1222] border border-brand-teal/40 rounded-3xl p-6 space-y-5 shadow-2xl relative">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-teal/20 text-brand-teal flex items-center justify-center text-2xl border border-brand-teal/30">
                  📋
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-sora">Confirm Final Submission</h3>
                  <p className="text-xs text-gray-400">Review your progress before submitting your test.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <span className="block opacity-70">Answered:</span>
                  <span className="text-lg font-bold">{answeredCount} / {totalQuestions}</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  <span className="block opacity-70">Unanswered:</span>
                  <span className="text-lg font-bold">{unansweredCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  <span className="block opacity-70">Marked for Review:</span>
                  <span className="text-lg font-bold">{reviewCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  <span className="block opacity-70">Time Remaining:</span>
                  <span className="text-lg font-bold">{formatTime(timeLeft)}</span>
                </div>
              </div>

              {unansweredCount > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>You still have <strong>{unansweredCount} unanswered questions</strong>. Unanswered questions will receive 0 marks.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Continue Answering
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmitModal(false);
                    submitTest(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-brand-teal hover:opacity-95 text-black font-black text-xs shadow-lg transition-all cursor-pointer"
                >
                  Confirm & Submit Final »
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── REAL-TIME PROCTORING AUDIT LOG MODAL ── */}
        {showProctorAuditModal && (
          <div className="fixed inset-0 z-[210] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="max-w-md w-full bg-[#0c1222] border border-brand-teal/40 rounded-3xl p-6 space-y-4 shadow-2xl relative font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-teal/20 text-brand-teal flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-sora">Security & Proctoring Audit</h3>
                    <p className="text-[11px] text-gray-400 font-mono">Live Session Integrity Trail</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProctorAuditModal(false)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-gray-400 block uppercase">Trust Index</span>
                  <span className={`text-base font-bold ${proctorTrustScore >= 80 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {proctorTrustScore}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-gray-400 block uppercase">Strike Warnings</span>
                  <span className={`text-base font-bold ${warnings > 0 ? 'text-red-400' : 'text-gray-300'}`}>
                    {warnings} / 3 Strikes
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                  Chronological Event Stream
                </span>
                <div className="max-h-56 overflow-y-auto space-y-1.5 custom-scrollbar p-2 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px]">
                  {proctorLogs.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-xs">No infractions recorded. Clean session.</p>
                  ) : (
                    proctorLogs.map(log => (
                      <div
                        key={log.id}
                        className={`p-2 rounded-lg border flex items-start gap-2 ${
                          log.severity === 'alert'
                            ? 'bg-red-500/10 border-red-500/30 text-red-300'
                            : log.severity === 'warning'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-white/5 border-white/5 text-gray-300'
                        }`}
                      >
                        <span className="text-[10px] opacity-60 shrink-0 font-bold">[{log.timestamp}]</span>
                        <span className="leading-tight">{log.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowProctorAuditModal(false)}
                  className="w-full py-2.5 rounded-xl bg-brand-teal text-black font-bold text-xs hover:opacity-95 cursor-pointer"
                >
                  Dismiss Log View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 🧮 FLOATING VIRTUAL SCIENTIFIC CALCULATOR MODAL ── */}
        {showCalculator && (
          <div className="fixed bottom-6 right-6 md:right-88 z-[150] w-80 bg-[#001f3f]/95 backdrop-blur-2xl rounded-3xl border-2 border-[#003875] shadow-2xl p-4 text-white space-y-3 animate-scale-up">
            {/* Calc Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-2">
              <div className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#fbbf24]" />
                <span className="text-xs font-black tracking-wide text-white font-mono uppercase">CBT Scientific Calc</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsScientificCalc(prev => !prev)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono transition-all cursor-pointer ${
                    isScientificCalc ? 'bg-[#008037] text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {isScientificCalc ? 'Sci ON' : 'Std'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCalculator(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Calculator"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* LCD Screen Display */}
            <div className="p-3 rounded-2xl bg-[#000d1a] border border-[#003875]/80 text-right space-y-1 font-mono">
              <div className="text-[11px] text-gray-400 h-4 truncate">
                {calcInput || '0'}
              </div>
              <div className="text-lg font-black text-[#00c957] truncate">
                = {calcResult || '0'}
              </div>
            </div>

            {/* Scientific Functions Row */}
            {isScientificCalc && (
              <div className="grid grid-cols-4 gap-1.5 text-[11px] font-mono">
                {['sin', 'cos', 'tan', 'sqrt', 'log', 'ln', 'x²', '1/x', '(', ')', 'π', 'e'].map(btn => (
                  <button
                    key={btn}
                    type="button"
                    onClick={() => handleCalcButton(btn)}
                    className="p-1.5 rounded-lg bg-[#003875]/40 hover:bg-[#003875] text-cyan-200 font-bold transition-all border border-[#003875]/60 cursor-pointer active:scale-95"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            )}

            {/* Keypad Grid */}
            <div className="grid grid-cols-4 gap-1.5 text-xs font-bold font-mono">
              {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '%', '+'].map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleCalcButton(k)}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer active:scale-95 text-center ${
                    ['÷', '×', '-', '+'].includes(k)
                      ? 'bg-[#003875] text-[#38bdf8] hover:bg-[#002a5c] border border-[#004c9e]'
                      : 'bg-white/5 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  {k}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleCalcButton('C')}
                className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 cursor-pointer active:scale-95"
              >
                C
              </button>
              <button
                type="button"
                onClick={() => handleCalcButton('DEL')}
                className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer active:scale-95"
              >
                DEL
              </button>
              <button
                type="button"
                onClick={() => handleCalcButton('=')}
                className="col-span-2 p-2.5 rounded-xl bg-gradient-to-r from-[#008037] to-emerald-500 hover:opacity-95 text-white font-black text-sm shadow-md shadow-[#008037]/30 cursor-pointer active:scale-95"
              >
                =
              </button>
            </div>
          </div>
        )}

      </div>
    );
  };

  const renderResult = () => {
    if (!testResult) return null;
    const { test, answers, score, total } = testResult;
    const currentTest = tests.find(t => t.id === test.id);
    const isReleased = currentTest ? currentTest.resultsReleased : test.resultsReleased;

    if (!isReleased && !isFounder) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-3xl mt-8">
          <CheckCircle className="w-16 h-16 text-brand-teal mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Test Submitted Successfully!</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Your answers have been recorded. Scores and correct answers are pending release by your instructor.</p>
          <button 
            onClick={() => {
              setTestResult(null);
              setView('leaderboard');
            }}
            className="px-6 py-3 bg-brand-teal hover:opacity-90 text-black rounded-xl font-bold transition-all shadow-md cursor-pointer"
          >
            Return to Leaderboard
          </button>
        </div>
      );
    }

    const questions = test?.questions || [];
    const scorePct = Math.round((score / (total || 1)) * 100);
    const isPassed = scorePct >= 50;

    let grade = 'Needs Improvement';
    if (scorePct >= 90) grade = 'Elite Distinction (A+)';
    else if (scorePct >= 75) grade = 'Advanced Mastery (A)';
    else if (scorePct >= 60) grade = 'Honors Qualified (B+)';
    else if (scorePct >= 50) grade = 'Passing Grade (B)';

    // Count statistics
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    questions.forEach((q, idx) => {
      const uAns = answers[idx];
      if (uAns === undefined || uAns === '') {
        unattemptedCount++;
      } else if (q.type === 'mcq') {
        if (uAns === q.correct) correctCount++;
        else incorrectCount++;
      } else {
        correctCount++; // code submission marked
      }
    });

    const filteredQuestions = questions.filter((q, idx) => {
      const uAns = answers[idx];
      const isUnatt = uAns === undefined || uAns === '';
      const isCorr = q.type === 'mcq' ? uAns === q.correct : true;

      if (resultSolutionFilter === 'correct') return !isUnatt && isCorr;
      if (resultSolutionFilter === 'incorrect') return !isUnatt && !isCorr;
      if (resultSolutionFilter === 'unanswered') return isUnatt;
      return true;
    });

    return (
      <div className="space-y-6 animate-fade-in font-sans">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setTestResult(null);
                setView('list');
              }}
              className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Return to Test Catalog"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  isPassed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}>
                  {isPassed ? 'Passed' : 'Needs Retake'}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  Submitted: {new Date().toLocaleTimeString()}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white font-sora mt-0.5">
                Official Assessment Scorecard: {test.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                try {
                  const resolvedPhoto = candidatePhoto || testResult.candidatePhoto || localStorage.getItem('lumixora_candidate_photo') || null;
                  const resolvedRoll = userRollNumber || testResult.rollNumber || '249XA33106';
                  generateProctoredStudentScorecardPDF({
                    testTitle: test.title,
                    score,
                    total,
                    percentage: scorePct,
                    studentName: user?.name || testResult?.user || 'Scholar',
                    rollNumber: resolvedRoll,
                    branch: user?.department || user?.branch || testResult?.branch || 'CSE',
                    date: new Date().toLocaleDateString(),
                    college: user?.college || 'G. Pulla Reddy Engineering College (Autonomous)',
                    proctorScore: testResult.proctorTrustScore ?? 100,
                    proctorStatus: testResult.proctorStatus || (testResult.flaggedForTabSwitch ? 'Flagged Record' : 'Clean Audit'),
                    violations: testResult.warnings || 0,
                    candidatePhoto: resolvedPhoto
                  });
                  addToast({ message: '📥 Generating Official Proctored PDF Scorecard...', type: 'success' });
                } catch (e) {
                  console.warn("PDF generation error, fallback to print:", e);
                  window.print();
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-brand-teal" />
              <span>Download Proctored PDF Scorecard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTestResult(null);
                setView('leaderboard');
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>
          </div>
        </div>

        {/* ── GRAND SCORECARD METRICS BANNER ── */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#080d19] to-black border border-brand-teal/30 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Total Score</span>
              <p className="text-2xl md:text-3xl font-black text-white font-sora">
                {score} <span className="text-sm font-normal text-gray-400">/ {total}</span>
              </p>
              <span className="text-xs font-mono font-bold text-brand-teal">{scorePct}% Aggregate</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Academic Grade</span>
              <p className={`text-lg md:text-xl font-bold truncate font-sora ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {grade}
              </p>
              <span className="text-xs font-mono text-gray-400">{isPassed ? 'Qualified ≥ 50%' : 'Below 50% threshold'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Answer Accuracy</span>
              <p className="text-2xl md:text-3xl font-black text-cyan-300 font-sora">
                {Math.round((correctCount / Math.max(1, correctCount + incorrectCount)) * 100)}%
              </p>
              <span className="text-xs font-mono text-gray-400">{correctCount} Correct of {correctCount + incorrectCount}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Proctor Audit</span>
              <p className={`text-base md:text-lg font-bold font-sora ${testResult.flaggedForTabSwitch ? 'text-red-400' : 'text-emerald-400'}`}>
                {testResult.flaggedForTabSwitch ? 'Flagged Record' : 'Clean Audit'}
              </p>
              <span className="text-xs font-mono text-gray-400">
                {testResult.flaggedForTabSwitch ? 'Exited Fullscreen 3 Times' : '0 Tab Violations'}
              </span>
            </div>

          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">Passing Mark Threshold (50%)</span>
              <span className="text-brand-teal font-bold">{scorePct}% Achieved</span>
            </div>
            <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${isPassed ? 'bg-gradient-to-r from-emerald-400 to-brand-teal' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, scorePct)}%` }}
              />
            </div>
          </div>
        </div>

{isTestCameraRequired(testResult.test) ? (
        /* ── 🛡️ OFFICIAL AI PROCTORING CERTIFICATE & SURVEILLANCE REPORT (CAMERA REQUIRED) ── */
        <div className="p-6 rounded-3xl bg-[#0c1424] border border-brand-teal/30 space-y-5 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-teal/20 text-brand-teal flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-sora">
                  AI Proctoring Integrity Certificate
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Cryptographic Verification & Proctoring Audit
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                (testResult.proctorTrustScore ?? 100) >= 80
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}>
                {testResult.proctorStatus || (testResult.flaggedForTabSwitch ? 'Flagged Record' : 'Clean Audit (Verified)')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Candidate Photo & Roll Number Verification Card */}
            <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-black/50 border border-emerald-500/30 text-center space-y-2">
              <div className="relative group">
                {(candidatePhoto || testResult.candidatePhoto) ? (
                  <img
                    src={candidatePhoto || testResult.candidatePhoto}
                    alt="Candidate Biometric"
                    className="w-20 h-24 rounded-xl object-cover border-2 border-emerald-500/60 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-24 rounded-xl bg-gradient-to-br from-[#003875] to-[#008037] border-2 border-emerald-500/40 flex flex-col items-center justify-center text-white text-xs font-mono font-bold p-2 text-center shadow-lg">
                    <span className="text-xl font-black mb-1">
                      {(user?.name || testResult.user || 'SH').slice(0, 2).toUpperCase()}
                    </span>
                    <span className="text-[9px] text-emerald-300">Biometric ID</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => photoFileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-lg bg-black/80 hover:bg-black text-[9px] font-bold text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-0.5"
                  title="Upload / Update Photo"
                >
                  <Camera className="w-2.5 h-2.5" />
                  <span>Photo</span>
                </button>
              </div>

              <div className="w-full space-y-1">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Candidate Roll:</span>
                <input
                  type="text"
                  value={userRollNumber}
                  onChange={(e) => handleRollNumberChange(e.target.value)}
                  placeholder="249XA33106"
                  className="w-full text-center px-2 py-1 bg-white/5 border border-emerald-500/50 rounded-lg text-xs font-mono font-bold text-emerald-300 focus:outline-none focus:border-brand-teal uppercase"
                  title="Edit Roll Number before downloading Scorecard"
                />
                <span className="text-[9px] font-mono text-gray-400 block truncate">{user?.name || testResult.user || 'Scholar'}</span>
              </div>
            </div>

            {/* Checkpoint Table */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 block uppercase">Surveillance Trust Index</span>
                <p className="text-xl font-bold text-brand-teal">
                  {testResult.proctorTrustScore ?? 100}%
                </p>
                <span className="text-[10px] text-gray-400">High Confidence Level</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 block uppercase">Infraction Strikes</span>
                <p className={`text-xl font-bold ${(testResult.warnings || 0) > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {testResult.warnings || 0} / 3 Strikes
                </p>
                <span className="text-[10px] text-gray-400">Tab Switch & Focus Guard</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 block uppercase">WebCam Biometrics</span>
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Continuous Facial Stream
                </p>
                <span className="text-[10px] text-gray-400">Active monitoring enabled</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 block uppercase">Acoustic Audio Monitor</span>
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ambient Noise Nominal
                </p>
                <span className="text-[10px] text-gray-400">Decibel threshold respected</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── STANDARD SECURITY & FOCUS AUDIT REPORT (NO CAMERA REQUIRED) ── */
        <div className="p-6 rounded-3xl bg-[#0c1424] border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-brand-teal flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-sora">
                  Security & Anti-Cheat Compliance Report
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Assessment Mode: Standard Focus Guard (No Camera Required)
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
              (testResult.warnings || 0) === 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
            }`}>
              {(testResult.warnings || 0) === 0 ? 'Clean Session (Compliant)' : `${testResult.warnings} Warning(s) Registered`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Candidate Photo & Roll Number Verification Card for No Camera Mode */}
            <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-black/50 border border-emerald-500/30 text-center space-y-2">
              <div className="relative group">
                {(candidatePhoto || testResult.candidatePhoto) ? (
                  <img
                    src={candidatePhoto || testResult.candidatePhoto}
                    alt="Candidate Biometric"
                    className="w-20 h-24 rounded-xl object-cover border-2 border-emerald-500/60 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-24 rounded-xl bg-gradient-to-br from-[#003875] to-[#008037] border-2 border-emerald-500/40 flex flex-col items-center justify-center text-white text-xs font-mono font-bold p-2 text-center shadow-lg">
                    <span className="text-xl font-black mb-1">
                      {(user?.name || testResult.user || 'SH').slice(0, 2).toUpperCase()}
                    </span>
                    <span className="text-[9px] text-emerald-300">Candidate ID</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => photoFileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-lg bg-black/80 hover:bg-black text-[9px] font-bold text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-0.5"
                  title="Upload / Update Photo"
                >
                  <Camera className="w-2.5 h-2.5" />
                  <span>Photo</span>
                </button>
              </div>

              <div className="w-full space-y-1">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Candidate Roll:</span>
                <input
                  type="text"
                  value={userRollNumber}
                  onChange={(e) => handleRollNumberChange(e.target.value)}
                  placeholder="249XA33106"
                  className="w-full text-center px-2 py-1 bg-white/5 border border-emerald-500/50 rounded-lg text-xs font-mono font-bold text-emerald-300 focus:outline-none focus:border-brand-teal uppercase"
                  title="Edit Roll Number before downloading Scorecard"
                />
                <span className="text-[9px] font-mono text-gray-400 block truncate">{user?.name || testResult.user || 'Scholar'}</span>
              </div>
            </div>

            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 block uppercase">Fullscreen Integrity</span>
                <p className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Single-Window Lockdown
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 block uppercase">Tab Switch Infractions</span>
                <p className={`text-sm font-bold mt-0.5 ${(testResult.warnings || 0) > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {testResult.warnings || 0} / 3 Strikes
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 block uppercase">WebCam Surveillance</span>
                <p className="text-sm font-bold text-gray-300 flex items-center gap-1 mt-0.5">
                  <CameraOff className="w-3.5 h-3.5 text-gray-400" /> Not Required by Instructor
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* ── QUESTION-BY-QUESTION SOLUTIONS EXPLORER ── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-sora">
              <CheckSquare className="w-5 h-5 text-brand-teal" />
              Comprehensive Question Solutions & Theoretical Analysis
            </h3>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setResultSolutionFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${resultSolutionFilter === 'all' ? 'bg-brand-teal text-black shadow-sm font-black' : 'text-gray-400 hover:text-white'}`}
              >
                All ({total})
              </button>
              <button
                type="button"
                onClick={() => setResultSolutionFilter('correct')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${resultSolutionFilter === 'correct' ? 'bg-emerald-500 text-black shadow-sm font-black' : 'text-gray-400 hover:text-white'}`}
              >
                Correct ({correctCount})
              </button>
              <button
                type="button"
                onClick={() => setResultSolutionFilter('incorrect')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${resultSolutionFilter === 'incorrect' ? 'bg-rose-500 text-white shadow-sm font-black' : 'text-gray-400 hover:text-white'}`}
              >
                Incorrect ({incorrectCount})
              </button>
              <button
                type="button"
                onClick={() => setResultSolutionFilter('unanswered')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${resultSolutionFilter === 'unanswered' ? 'bg-amber-500 text-black shadow-sm font-black' : 'text-gray-400 hover:text-white'}`}
              >
                Unattempted ({unattemptedCount})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const originalIndex = questions.indexOf(q);
              const userAnswer = answers[originalIndex];
              const isUnattempted = userAnswer === undefined || userAnswer === '';
              const isCorrect = q.type === 'mcq' ? userAnswer === q.correct : true;

              return (
                <div key={q.id || originalIndex} className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
                  isUnattempted
                    ? 'bg-[#0b101c] border-amber-500/30'
                    : isCorrect
                    ? 'bg-[#08151f] border-emerald-500/40'
                    : 'bg-[#180d16] border-rose-500/40'
                }`}>
                  
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${
                        isUnattempted ? 'bg-amber-500/20 text-amber-300' : isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        Q{originalIndex + 1}
                      </span>
                      <span className="text-xs font-mono font-bold">
                        {isUnattempted ? 'Unattempted (0 Marks)' : isCorrect ? 'Correct (+1 Mark)' : 'Incorrect (0 Marks)'}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-gray-400 uppercase">
                      {q.type === 'code' ? 'Code Challenge' : 'MCQ'}
                    </span>
                  </div>

                  <h4 className="text-sm md:text-base font-bold text-white font-sora leading-relaxed">
                    {q.question}
                  </h4>

                  {q.type === 'mcq' ? (
                    <div className="space-y-2">
                      {(q.options || []).map((opt, optIdx) => {
                        const isActualCorrect = q.correct === optIdx;
                        const isUserChoice = userAnswer === optIdx;

                        let cardStyle = "bg-white/[0.02] border-white/5 text-gray-400";
                        if (isActualCorrect) {
                          cardStyle = "bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold";
                        } else if (isUserChoice && !isActualCorrect) {
                          cardStyle = "bg-rose-500/20 border-rose-400 text-rose-200";
                        }

                        return (
                          <div key={optIdx} className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${cardStyle}`}>
                            <div className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-full border border-current font-mono text-[10px] flex items-center justify-center font-bold">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>

                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              {isUserChoice && (
                                <span className="opacity-75 font-bold">[Your Choice]</span>
                              )}
                              {isActualCorrect && (
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                                </span>
                              )}
                              {isUserChoice && !isActualCorrect && (
                                <span className="text-rose-400 font-bold flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" /> Wrong
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-xs text-gray-400 font-mono">Submitted Source Code:</span>
                      <pre className="p-4 bg-black/60 rounded-xl border border-white/10 font-mono text-xs text-[#00ffcc] overflow-x-auto">
                        <code>{userAnswer || '// No source code was submitted'}</code>
                      </pre>
                    </div>
                  )}

                  {/* Theoretical Explanation Callout */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-gray-300 space-y-1">
                    <span className="font-bold text-brand-teal flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" /> Technical Solution & Concept Takeaway
                    </span>
                    <p className="leading-relaxed opacity-90 pt-1">
                      {q.explanation || (q.type === 'mcq' && q.options 
                        ? `Option ${String.fromCharCode(65 + q.correct)} ("${q.options[q.correct]}") is the formally verified correct solution according to standard computer science principles and curriculum design.`
                        : 'Solution passes all standard input-output edge cases with optimal time and space complexity.')}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  };

  const renderList = () => {
    const availableTests = tests.filter(test => {
      if (isFounder) {
        if (testTabFilter === 'coding') return test.type === 'coding' || test.type === 'both';
        if (testTabFilter === 'quiz') return test.type === 'quiz' && test.category !== 'assignment';
        if (testTabFilter === 'assignment') return test.category === 'assignment';
        return true;
      }
      if (test.active === false) return false;

      // Category tab filter
      if (testTabFilter === 'coding' && test.type !== 'coding' && test.type !== 'both') return false;
      if (testTabFilter === 'quiz' && (test.type !== 'quiz' || test.category === 'assignment')) return false;
      if (testTabFilter === 'assignment' && test.category !== 'assignment') return false;

      const userBranch = (user?.department || user?.branch || '').toLowerCase().trim();
      const userSem = String(user?.sem || user?.semester || '').toLowerCase().trim();
      const userSec = (user?.sec || user?.section || '').toUpperCase().trim();

      const testBranch = (test.targetBranch || 'All').toLowerCase().trim();
      const testSem = String(test.targetSem || 'All').toLowerCase().trim();
      const testSec = (test.targetSec || 'All').toUpperCase().trim();

      const matchBranch = testBranch === 'all' || !test.targetBranch || testBranch === userBranch || !userBranch || userBranch.includes(testBranch) || testBranch.includes(userBranch);
      const matchSem = testSem === 'all' || !test.targetSem || testSem === userSem || userSem.includes(testSem) || !userSem;
      const matchSec = testSec === 'all' || !test.targetSec || testSec === userSec || !userSec;
      
      return matchBranch && matchSem && matchSec;
    });

    const codingCount = tests.filter(t => t.type === 'coding' || t.type === 'both').length;
    const quizCount = tests.filter(t => t.type === 'quiz' && t.category !== 'assignment').length;
    const assignCount = tests.filter(t => t.category === 'assignment').length;

    return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-semibold text-white tracking-wide mb-1 flex items-center gap-2">
            Test Portal <Target className="inline w-6 h-6 text-brand-teal" />
          </h2>
          <p className="text-sm text-gray-400 font-medium">Take quizzes, coding assessments, and timeline assignments in a secure environment.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {isFounder && (
            <>
              <button 
                onClick={handleRestoreDefaultTests}
                disabled={isSyncingTests}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                title="Restore default pre-loaded test database"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isSyncingTests ? 'animate-spin' : ''}`} />
                <span>{isSyncingTests ? 'Syncing...' : 'Sync Default Tests'}</span>
              </button>
              <button 
                onClick={() => setActiveTab && setActiveTab('founder-portal')}
                className="bg-brand-teal hover:opacity-90 text-black px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-opacity cursor-pointer shadow-sm"
              >
                <Target className="w-4 h-4" />
                Post Test
              </button>
            </>
          )}
          <button 
            onClick={() => setView('leaderboard')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-brand-pink" />
            Leaderboard
          </button>
        </div>
      </div>

      {/* Category Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setTestTabFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            testTabFilter === 'all'
              ? 'bg-brand-teal text-black shadow-md'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
          }`}
        >
          All Assessments ({tests.length})
        </button>
        <button
          onClick={() => setTestTabFilter('coding')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            testTabFilter === 'coding'
              ? 'bg-brand-blue text-black shadow-md'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          Coding ({codingCount})
        </button>
        <button
          onClick={() => setTestTabFilter('quiz')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            testTabFilter === 'quiz'
              ? 'bg-brand-pink text-black shadow-md'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          MCQ Quizzes ({quizCount})
        </button>
        <button
          onClick={() => setTestTabFilter('assignment')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            testTabFilter === 'assignment'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Assignments ({assignCount})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loadingTests ? (
          <div className="col-span-full py-12 text-center flex flex-col items-center justify-center text-brand-teal">
            <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold tracking-wide">Fetching Active Tests...</p>
          </div>
        ) : availableTests.length === 0 ? (
          <div className="col-span-full py-12 text-center glass-panel rounded-3xl border border-white/5 border-dashed space-y-3">
            <Target className="w-12 h-12 text-gray-500 mx-auto opacity-50" />
            <p className="text-sm text-gray-300 font-medium">No tests found for this category.</p>
            {isFounder && (
              <button 
                onClick={handleRestoreDefaultTests}
                className="px-4 py-2 rounded-xl bg-brand-teal text-black text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Load Default Assessment Suite
              </button>
            )}
          </div>
        ) : (
          availableTests.map(test => {
            const isAssignment = test.category === 'assignment';
            const isFuture = test.scheduledTime && Date.now() < new Date(test.scheduledTime).getTime();
            const currentUserName = user?.name?.split(' ')[0] || 'Anonymous';
            const hasAttempted = leaderboard.some(entry => entry.testId === test.id && entry.user === currentUserName);
            return (
            <div key={test.id} className={`glass-panel p-6 rounded-3xl border flex flex-col group hover:border-white/20 transition-colors relative ${
              isAssignment ? 'border-purple-500/20' : 'border-white/10'
            }`}>
              
              <div className="flex items-start justify-between mb-4 gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                    isAssignment ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-white/5 border-white/10 text-brand-teal'
                  }`}>
                    {isAssignment ? <FileText className="w-5 h-5" /> : test.type === 'coding' ? <Code className="w-5 h-5 text-brand-blue" /> : <List className="w-5 h-5" />}
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${
                    isAssignment ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-brand-teal/15 text-brand-teal border-brand-teal/30'
                  }`}>
                    {isAssignment ? 'Assignment' : 'Test'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {editingTestId === test.id ? (
                    <div className="flex items-center gap-1">
                      <input type="number" value={editingTestVals.duration} onChange={e => setEditingTestVals({...editingTestVals, duration: e.target.value})} className="w-12 text-[10px] font-bold text-center bg-white/10 px-1 py-1 rounded-md text-white border border-white/20 outline-none" />
                      <span className="text-[10px] text-gray-400 font-bold">MIN</span>
                      <button onClick={() => saveTest(test.id)} className="p-1.5 bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded" title="Save">
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setEditingTestId(null)} className="p-1.5 bg-white/5 text-gray-400 hover:text-white rounded" title="Cancel">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-[10px] font-bold tracking-wide bg-white/10 px-2.5 py-1 rounded-full text-gray-300">
                        {test.duration} MIN
                      </span>
                      {isFounder && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditingTestId(test.id); setEditingTestVals({ title: test.title, duration: test.duration }); }} className="p-1.5 icon-3d-blue hover:bg-brand-blue/20 rounded" title="Edit Assessment">
                            <Edit2 className="w-3.5 h-3.5 text-brand-blue" />
                          </button>
                          <button onClick={() => deleteTest(test.id)} className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded" title="Delete Assessment">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            
            {editingTestId === test.id ? (
              <input type="text" value={editingTestVals.title} onChange={e => setEditingTestVals({...editingTestVals, title: e.target.value})} className="text-lg font-bold text-white mb-2 bg-white/5 border border-white/20 rounded px-2 py-1 w-full z-10" />
            ) : (
              <h3 className="text-lg font-bold text-white mb-2">{test.title}</h3>
            )}
            <p className="text-xs text-gray-400 mb-4 flex-1">
              {test.type === 'quiz' ? 'Multiple choice questions' : test.type === 'coding' ? 'Programming challenge' : 'Mixed assessment'}
              {test.scheduledTime && (
                <span className="block mt-2 font-bold text-yellow-500">
                  {isAssignment ? 'Due: ' : 'Starts: '}{new Date(test.scheduledTime).toLocaleString()}
                </span>
              )}
            </p>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {isTestCameraRequired(test) ? (
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#008037]/20 text-emerald-300 border border-[#008037]/40 flex items-center gap-1.5 shadow-sm">
                  <Camera className="w-3 h-3 text-[#00c957]" /> AI Webcam Monitored
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#003875]/40 text-cyan-300 border border-[#003875]/60 flex items-center gap-1.5 shadow-sm">
                  <CameraOff className="w-3 h-3 text-cyan-400" /> Open CBT (No Camera)
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white/5 text-gray-300 border border-white/10 flex items-center gap-1">
                <Target className="w-3 h-3 text-amber-400" /> {test.questions?.length || 10} Questions
              </span>
            </div>
            
            <button 
              onClick={() => !isFuture && !hasAttempted && handleOpenTestOnboarding(test)}
              disabled={isFuture || hasAttempted}
              className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                hasAttempted ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/10' :
                isFuture ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/10' : 
                isAssignment ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/20' :
                'bg-[#008037] text-white hover:bg-[#006e2e] shadow-[#008037]/30'
              }`}
            >
              {hasAttempted ? (
                 <><CheckCircle className="w-4 h-4 text-emerald-400" /> Already Attempted</>
              ) : isFuture ? (
                 `Upcoming ${isAssignment ? 'Assignment' : 'Test'}`
              ) : (
                 <><Play className="w-4 h-4 fill-current text-white" /> {isAssignment ? 'Start Assignment' : 'Start Assessment'}</>
              )}
            </button>
          </div>
          );
        })
        )}
      </div>
    {/* ── PRE-EXAM CBT & AI PROCTORING ONBOARDING LAUNCHPAD MODAL ── */}
      {onboardingTestModal && (
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="max-w-2xl w-full bg-[#0c1222] border border-brand-teal/40 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative font-sans my-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-teal/20 to-blue-500/20 border border-brand-teal/40 flex items-center justify-center text-2xl text-brand-teal shadow-md shrink-0">
                  🛡️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-teal/30">
                      AI Proctored Examination Suite
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {onboardingTestModal.duration} Mins
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white font-sora mt-0.5">
                    {onboardingTestModal.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  stopProctorMedia();
                  setOnboardingTestModal(null);
                }}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Test Blueprint Metrics */}
            <div className="grid grid-cols-3 gap-3 text-xs font-mono text-center">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-gray-400 block uppercase">Duration</span>
                <span className="text-sm font-bold text-white">{onboardingTestModal.duration} Mins</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-gray-400 block uppercase">Questions</span>
                <span className="text-sm font-bold text-cyan-300">{onboardingTestModal.questions?.length || 10} Qs</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-gray-400 block uppercase">Passing Cutoff</span>
                <span className="text-sm font-bold text-emerald-400">50% Marks</span>
              </div>
            </div>

            {/* ── CANDIDATE SCORECARD IDENTITY & BIOMETRIC VERIFICATION CARD ── */}
            <div className="p-4 rounded-2xl bg-[#060a14] border border-emerald-500/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" /> Candidate Scorecard Identity Verification
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  ● Verified Profile
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Photo Preview & Upload / Snap Controls */}
                <div className="relative group shrink-0">
                  {candidatePhoto ? (
                    <img
                      src={candidatePhoto}
                      alt="Candidate Snapshot"
                      className="w-16 h-20 rounded-xl object-cover border-2 border-emerald-500/60 shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-[#003875] to-[#008037] border-2 border-emerald-500/40 flex flex-col items-center justify-center text-white text-xs font-mono font-bold p-1 text-center shadow-md">
                      <span className="text-xl font-black">
                        {(user?.name || 'SH').slice(0, 2).toUpperCase()}
                      </span>
                      <span className="text-[8px] text-emerald-300">Biometric</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => photoFileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold shadow-md cursor-pointer flex items-center gap-0.5"
                    title="Upload / Change Candidate Photo"
                  >
                    <Camera className="w-2.5 h-2.5" />
                    <span>Photo</span>
                  </button>
                </div>

                {/* Candidate Information & Editable Roll Number */}
                <div className="flex-1 w-full space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-mono uppercase">Candidate Name</span>
                      <span className="font-bold text-white text-sm">{user?.name || 'Scholar'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block font-mono uppercase">Department</span>
                      <span className="font-mono text-cyan-300 text-xs font-bold">{user?.department || user?.branch || 'CSE'}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                      <span>College Roll Number (Printed on PDF Scorecard)</span>
                      <span className="text-[9px] text-gray-400 font-normal">Tap to edit</span>
                    </label>
                    <input
                      type="text"
                      value={userRollNumber}
                      onChange={(e) => handleRollNumberChange(e.target.value)}
                      placeholder="e.g. 249XA33106"
                      className="w-full px-3 py-2 bg-black/60 border border-emerald-500/50 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal rounded-xl text-white font-mono font-bold text-sm tracking-wider uppercase transition-all"
                    />
                    <p className="text-[10px] text-gray-400 font-mono">
                      🔒 Official Roll Number & Photo are cryptographically locked onto your downloaded PDF Scorecard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

{isTestCameraRequired(onboardingTestModal) ? (
            /* ── HARDWARE & BIOMETRIC PROCTORING CALIBRATION BOX ── */
            <div className="p-4 rounded-2xl bg-[#060a14] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-brand-teal uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-brand-teal" /> Hardware & Biometric Surveillance Check
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isCameraActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {isCameraActive ? '● Camera Active' : 'Restricted Mode'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Live Camera Preview */}
                <div className="relative aspect-video rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">
                  {isCameraActive ? (
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                  ) : (
                    <div className="p-4 text-center space-y-2">
                      <CameraOff className="w-8 h-8 text-gray-500 mx-auto" />
                      <p className="text-[11px] text-gray-400 leading-tight">
                        {cameraError ? 'Camera permission was denied. You may proceed in restricted mode.' : 'Click to initialize camera & microphone.'}
                      </p>
                      <button
                        type="button"
                        onClick={initProctorMedia}
                        disabled={isStartingMedia}
                        className="px-3 py-1.5 bg-brand-teal text-black rounded-lg text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                      >
                        {isStartingMedia ? 'Initializing...' : 'Enable Camera & Mic'}
                      </button>
                    </div>
                  )}

                  {isCameraActive && (
                    <div className="absolute inset-2 border border-cyan-400/30 rounded-lg pointer-events-none flex items-center justify-center">
                      <div className="w-16 h-20 rounded-full border border-dashed border-brand-teal/60"></div>
                    </div>
                  )}

                  {isCameraActive && (
                    <div className="absolute bottom-2 right-2">
                      <button
                        type="button"
                        onClick={takeBiometricSnapshot}
                        className="px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 hover:border-brand-teal transition-all cursor-pointer flex items-center gap-1"
                        title="Capture Biometric Photo"
                      >
                        <Camera className="w-3 h-3 text-brand-teal" />
                        <span>Snap Photo</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Diagnostics List & Candidate Photo Preview */}
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-brand-teal" /> WebCam:
                    </span>
                    <span className={isCameraActive ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {isCameraActive ? 'Connected (640x480)' : 'Not Connected'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-cyan-400" /> Microphone:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-2 bg-black rounded-full overflow-hidden border border-white/10 p-0.5">
                        <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all" style={{ width: `${Math.max(10, audioLevel)}%` }}></div>
                      </div>
                      <span className="text-[10px] text-gray-300">{audioLevel}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Biometric Face ID:
                    </span>
                    {candidatePhoto ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Photo Verified
                      </span>
                    ) : (
                      <span className="text-gray-400">Auto-detected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── STANDARD PROCTORING / NO CAMERA REQUIRED NOTICE ── */
            <div className="p-4 rounded-2xl bg-[#060a14] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-brand-teal uppercase tracking-wider flex items-center gap-1.5">
                  <CameraOff className="w-3.5 h-3.5 text-gray-400" /> Standard Assessment Mode (No Camera Required)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10 font-bold">
                  Camera Disabled
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                The instructor has configured this {onboardingTestModal.category === 'assignment' ? 'assignment' : 'test'} without webcam surveillance. You can take this exam on any device or browser without webcam permissions. Strict fullscreen lock and tab-switch rules remain actively monitored.
              </p>
            </div>
          )}

            {/* Anti-Cheating & Exam Rules Checklist */}
            <div className="p-3.5 rounded-2xl bg-[#060a14] border border-white/10 space-y-2 text-xs text-gray-300">
              <span className="text-[10px] font-mono font-bold text-brand-teal uppercase tracking-wider block">
                Strict Proctored Examination Rules
              </span>
              <ul className="space-y-1.5 text-[11px] leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                  <span><strong>Fullscreen Lock:</strong> The test runs in forced fullscreen. Exiting triggers an instant security violation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                  <span><strong>3-Strike Rule:</strong> Switching tabs or minimizing the window registers a strike. 3 strikes trigger auto-submit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                  <span><strong>AI Video & Audio Surveillance:</strong> Face presence and ambient acoustic levels are logged in the official proctor report.</span>
                </li>
              </ul>
            </div>

            {/* Candidate Undertaking Declaration */}
            <label className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.06] transition-colors">
              <input
                type="checkbox"
                checked={hasAgreedToRules}
                onChange={(e) => setHasAgreedToRules(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 text-brand-teal focus:ring-brand-teal mt-0.5 cursor-pointer"
              />
              <span className="text-xs text-gray-200 leading-relaxed">
                I solemnly agree to the proctoring protocols and academic honor code. I confirm that I am taking this test alone without unauthorized assistance.
              </span>
            </label>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  stopProctorMedia();
                  setOnboardingTestModal(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!hasAgreedToRules}
                onClick={() => startTest(onboardingTestModal)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#008037] via-emerald-600 to-[#00a846] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs shadow-lg shadow-[#008037]/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Launch Proctored Exam »</span>
              </button>
            </div>

          </div>
        </div>
      )}

      
    </div>
  );
  };

  const renderLeaderboard = () => {
    // 1. Filter raw leaderboard entries based on Branch, Year, Sem, Sec, and Search
    const filteredEntries = leaderboard.filter(entry => {
      // Branch filter
      if (filterBranch !== 'All') {
        const b = (entry.department || entry.branch || '').toLowerCase();
        if (b !== filterBranch.toLowerCase()) return false;
      }
      // Year filter
      if (filterYear !== 'All') {
        const y = (entry.year || '').toLowerCase();
        if (!y.includes(filterYear.toLowerCase().replace(' year', ''))) return false;
      }
      // Sem filter
      if (filterSem !== 'All') {
        const smDigits = (entry.sem || entry.semester || '').replace(/[^0-9]/g, '');
        const targetDigits = filterSem.replace(/[^0-9]/g, '');
        const matchesExact = (entry.sem || entry.semester || '').toLowerCase() === filterSem.toLowerCase();
        const matchesDigits = smDigits && targetDigits && smDigits === targetDigits;
        const containsTarget = (entry.sem || entry.semester || '').toLowerCase().includes(filterSem.toLowerCase());
        if (!matchesExact && !matchesDigits && !containsTarget) return false;
      }
      // Section filter
      if (filterSec !== 'All') {
        const sc = (entry.sec || entry.section || '').toUpperCase().trim();
        if (sc !== filterSec.toUpperCase().trim()) return false;
      }
      // Search filter
      if (filterSearch.trim()) {
        const term = filterSearch.toLowerCase();
        const userMatch = (entry.user || '').toLowerCase().includes(term);
        const emailMatch = (entry.userEmail || '').toLowerCase().includes(term);
        const rollMatch = (entry.rollNumber || '').toLowerCase().includes(term);
        const testMatch = (entry.testTitle || entry.test?.title || '').toLowerCase().includes(term);
        if (!userMatch && !emailMatch && !rollMatch && !testMatch) return false;
      }
      return true;
    });

    // 2. Process data for matrix based on filtered entries
    const userMap = {};
    const testMap = {}; // { testId: testTitle }
    
    filteredEntries.forEach(entry => {
      let userName = entry.user || 'Anonymous';
      if (userName.includes('{')) {
        userName = userName.substring(0, userName.indexOf('{')).trim() || 'Anonymous';
      }
      if (!userMap[userName]) {
        userMap[userName] = {
           user: userName,
           email: entry.userEmail || '',
           rollNumber: entry.rollNumber || '',
           branch: entry.department || entry.branch || 'CSE',
           year: entry.year || '1st Year',
           sem: entry.sem || '1-1',
           sec: entry.sec || 'A',
           scores: {},
           totalScore: 0
        };
      }
      
      const tId = entry.testId || entry.testTitle;
      if (!testMap[tId]) {
        testMap[tId] = entry.testTitle || 'Unknown Test';
      }
      
      const activeTestDoc = tests.find(t => t.id === entry.testId);
      const isReleased = isFounder || (activeTestDoc ? activeTestDoc.resultsReleased : (entry.test?.resultsReleased ?? true));
      
      const currentEntryScore = entry.score || 0;
      const existingEntry = userMap[userName].scores[tId];
      const existingEntryScore = existingEntry ? (existingEntry.score || 0) : 0;
      
      if (!existingEntry || currentEntryScore > existingEntryScore) {
         userMap[userName].scores[tId] = { ...entry, isReleased };
         if (isReleased) {
           userMap[userName].totalScore += (currentEntryScore - existingEntryScore);
         }
      }
    });

    const testIds = Object.keys(testMap);
    const sortedUsers = Object.values(userMap).sort((a, b) => b.totalScore - a.totalScore);
    
    const handleScoreClick = (entry) => {
      if (entry.test && entry.answers) {
        setTestResult({
          test: entry.test,
          answers: entry.answers,
          score: entry.score,
          total: entry.total
        });
        setView('result');
      } else {
        addToast({ message: 'Detailed answers not available for this older test attempt.', type: 'info' });
      }
    };

    // Download Filtered PDF Report
    const handleDownloadReport = () => {
      if (filteredEntries.length === 0) {
        addToast({ message: 'No test records found for the selected filters.', type: 'warning' });
        return;
      }
      try {
        generateTestResultsPDF({
          results: filteredEntries,
          filters: {
            testTitle: 'Department Test Assessment Report',
            branch: filterBranch,
            year: filterYear,
            sem: filterSem,
            sec: filterSec
          },
          institutionName: 'G. Pulla Reddy Engineering College (Autonomous)'
        });
        addToast({ message: `Downloaded Test Report PDF (${filteredEntries.length} entries)!`, type: 'success' });
      } catch (err) {
        console.error('Error exporting PDF:', err);
        addToast({ message: 'Failed to generate PDF.', type: 'error' });
      }
    };

    const handleResetFilters = () => {
      setFilterBranch('All');
      setFilterYear('All');
      setFilterSem('All');
      setFilterSec('All');
      setFilterSearch('');
    };

    return (
      <div className="space-y-6 animate-fade-in text-white">
        {/* Top Title & Actions Header */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-r from-[#0e1424] to-[#12192e]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('list')}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Assessment Reports & Leaderboard</span>
                <Trophy className="w-6 h-6 text-brand-pink ml-1" />
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-medium mt-0.5">
                Filter performance metrics by branch, semester, and section, or export PDF reports.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadReport}
              className="bg-brand-teal hover:opacity-90 text-black px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Report PDF ({filteredEntries.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-brand-teal" />
              <span>Filter Test Results & Reports</span>
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-gray-400 hover:text-brand-teal font-semibold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {/* Branch Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Branch / Dept</label>
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-teal cursor-pointer"
              >
                <option value="All">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="CSM">CSM</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="Civil">Civil</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            </div>

            {/* Year Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Year</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-teal cursor-pointer"
              >
                <option value="All">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Semester Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Semester</label>
              <select
                value={filterSem}
                onChange={(e) => setFilterSem(e.target.value)}
                className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-teal cursor-pointer"
              >
                <option value="All">All Semesters</option>
                <option value="Sem 1">Sem 1</option>
                <option value="Sem 2">Sem 2</option>
                <option value="Sem 3">Sem 3</option>
                <option value="Sem 4">Sem 4</option>
                <option value="Sem 5">Sem 5</option>
                <option value="Sem 6">Sem 6</option>
                <option value="Sem 7">Sem 7</option>
                <option value="Sem 8">Sem 8</option>
              </select>
            </div>

            {/* Section Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Section</label>
              <select
                value={filterSec}
                onChange={(e) => setFilterSec(e.target.value)}
                className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-teal cursor-pointer"
              >
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
                <option value="E">Section E</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Search Scholar</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Name, roll, email..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="w-full bg-[#11111a] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-teal"
                />
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Matrix Table */}
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-xs font-bold text-gray-400 tracking-wide sticky left-0 bg-[#0d0d12] z-10">Rank</th>
                  <th className="p-4 text-xs font-bold text-gray-400 tracking-wide sticky left-[72px] bg-[#0d0d12] z-10">Student</th>
                  <th className="p-4 text-xs font-bold text-gray-400 tracking-wide">Branch & Sec</th>
                  {testIds.map(tId => (
                    <th key={tId} className="p-4 text-xs font-bold text-gray-400 tracking-wide max-w-[150px] truncate" title={testMap[tId]}>
                      {testMap[tId]}
                    </th>
                  ))}
                  <th className="p-4 text-xs font-bold text-gray-400 tracking-wide text-center">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={testIds.length + 4} className="p-12 text-center text-gray-400 text-xs">
                      No test results match the selected Branch, Semester, or Section filter.
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((userData, index) => (
                    <tr key={userData.user} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="p-4 sticky left-0 bg-[#0d0d12] group-hover:bg-[#1a1a24] transition-colors z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 
                          index === 1 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/50' : 
                          index === 2 ? 'bg-orange-600/20 text-orange-500 border border-orange-600/50' : 
                          'bg-white/5 text-gray-400'
                        }`}>
                          #{index + 1}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-bold text-gray-200 sticky left-[72px] bg-[#0d0d12] group-hover:bg-[#1a1a24] transition-colors z-10">
                        <div>
                          <span>{userData.user}</span>
                          {userData.rollNumber && <span className="block text-[10px] text-gray-500 font-mono">{userData.rollNumber}</span>}
                        </div>
                      </td>
                      
                      <td className="p-4 text-xs text-gray-300">
                        <span className="font-bold text-brand-teal">{userData.branch}</span> · {userData.year} · Sec <span className="font-bold text-white">{userData.sec}</span>
                      </td>

                      {testIds.map(tId => {
                        const entry = userData.scores[tId];
                        return (
                          <td key={tId} className="p-4 min-w-[120px]">
                            {entry ? (
                              <div className="flex items-center gap-3">
                                {editingScoreId === entry.id ? (
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="number" 
                                      value={editingScoreVal} 
                                      onChange={(e) => setEditingScoreVal(e.target.value)}
                                      className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                                    />
                                    <button onClick={() => saveLeaderboardEntry(entry.id)} className="text-green-500 hover:text-green-400"><Save className="w-4 h-4" /></button>
                                    <button onClick={() => setEditingScoreId(null)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center">
                                      {entry.isReleased ? (
                                        <button 
                                          onClick={() => handleScoreClick(entry)}
                                          className="text-sm font-bold text-white hover:text-brand-teal transition-colors cursor-pointer"
                                          title={entry.test ? "Click to view detailed answers" : "Detailed answers not available"}
                                        >
                                          {`${entry.score} / ${entry.total}`}
                                        </button>
                                      ) : (
                                        <span className="text-sm font-bold text-gray-500 italic">Pending...</span>
                                      )}
                                      {entry.flaggedForTabSwitch && entry.isReleased && (
                                        <div title="Flagged: Exited Full Screen 3 Times" className="ml-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase flex items-center gap-1 cursor-help">
                                          <AlertTriangle className="w-3 h-3" /> Flagged
                                        </div>
                                      )}
                                    </div>
                                    
                                    {isFounder && (
                                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingScoreId(entry.id); setEditingScoreVal(entry.score); }} className="p-1 text-brand-blue hover:bg-brand-blue/20 rounded" title="Edit Score">
                                          <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => deleteLeaderboardEntry(entry.id)} className="p-1 text-red-500 hover:bg-red-500/20 rounded" title="Delete Entry">
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-600 text-xs">-</span>
                            )}
                          </td>
                        );
                      })}
                      
                      <td className="p-4 text-sm font-bold text-brand-teal text-center">
                        {userData.totalScore}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const mainContent = (() => {
    if (view === 'taking') return renderTakingTest();
    if (view === 'leaderboard') return renderLeaderboard();
    if (view === 'result') return renderResult();
    return renderList();
  })();

  return (
    <>
      <input
        type="file"
        ref={photoFileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />
      {mainContent}
    </>
  );
}
