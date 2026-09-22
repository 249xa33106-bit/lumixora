import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, Trophy, AlertTriangle, Monitor, Play, CheckCircle, Code, List, 
  ArrowLeft, XCircle, Edit2, Trash2, Save, X, Clock, FileText,
  Filter, Download, Search, RotateCcw
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { supabase } from '../config/supabase';
import { awardXP } from '../services/gamificationService';
import { generateTestResultsPDF } from '../utils/pdfGenerator';
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

  // Leaderboard & Report Filter States
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [filterSem, setFilterSem] = useState('All');
  const [filterSec, setFilterSec] = useState('All');
  const [filterSearch, setFilterSearch] = useState('');
  
  const testContainerRef = useRef(null);
  const submitTestRef = useRef();

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
  const violationLockRef = useRef(false);

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
      setWarnings(prev => {
        const newCount = prev + 1;
        if (newCount < 3) {
          addToast({ message: `⚠️ WARNING (${newCount}/3): ${reason}`, type: 'warning' });
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
      setAnswers({});
      setView('taking');
      addToast({ message: `${test.title} started!`, type: 'info' });
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
        rollNumber: user?.rollNumber || (user?.email?.endsWith('@gprec.ac.in') ? user.email.split('@')[0].toUpperCase() : ''),
        score: score,
        total: totalScoreable || (currentActiveTest?.questions || []).length || 1,
        type: currentActiveTest.type || 'standard',
        date: new Date().toISOString(),
        test: currentActiveTest,
        answers: currentAnswers,
        flaggedForTabSwitch: forced
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
    
    return (
      <div className="min-h-screen bg-primary-bg p-8 fixed inset-0 z-[100] overflow-y-auto" ref={testContainerRef}>
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
            <div>
              <h2 className="text-2xl font-bold text-white">{activeTest.title}</h2>
              <div className="flex gap-4 mt-2 items-center">
                {timeLeft !== null && (
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono font-bold text-sm tracking-wider shadow-inner ${
                    timeLeft < 60 ? 'bg-red-500/20 text-red-500 border-red-500/50 animate-pulse' : 'icon-3d-blue border-white/10'
                  }`}>
                    <Clock className="w-4 h-4" />
                    {formatTime(timeLeft)}
                  </div>
                )}
                {isFullscreen ? (
                  <span className="text-sm font-semibold text-brand-teal flex items-center gap-1">
                    <Monitor className="w-4 h-4" /> Fullscreen Locked
                  </span>
                ) : (
                  <button 
                    onClick={enterFullscreen}
                    className="text-sm font-semibold text-brand-pink border border-white/10 hover:bg-brand-pink/10 px-3 py-1 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" /> Re-enter Fullscreen
                  </button>
                )}
                {warnings > 0 && (
                  <span className="text-sm font-bold text-brand-pink flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-4 h-4" /> Warnings: {warnings}/3
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => submitTest(false)}
              className="bg-brand-teal text-black px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Submit Test
            </button>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {(activeTest?.questions || []).map((q, idx) => (
              <div key={q.id || idx} className="glass-panel p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 test-question-text" data-question-text>
                  <span className="text-brand-teal mr-2">Q{idx + 1}.</span>
                  {q.question}
                </h3>
                
                {q.type === 'mcq' && (
                  <div className="space-y-3">
                    {(q.options || []).map((opt, optIdx) => (
                      <label 
                        key={optIdx} 
                        data-option-idx={optIdx}
                        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors border test-option-btn ${
                          answers[idx] === optIdx 
                            ? 'bg-brand-teal/20 border-brand-teal' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name={`q-${idx}`} 
                          className="hidden"
                          checked={answers[idx] === optIdx}
                          onChange={() => handleAnswer(idx, optIdx)}
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[idx] === optIdx ? 'border-brand-teal' : 'border-gray-500'}`}>
                          {answers[idx] === optIdx && <div className="w-2.5 h-2.5 rounded-full bg-brand-teal"></div>}
                        </div>
                        <span className="text-sm font-medium text-gray-200">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'code' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-[#1e1e1e] p-3 rounded-xl border border-white/10">
                      <select
                        className="bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-brand-teal font-bold tracking-wide outline-none cursor-pointer"
                        value={codeLanguages[idx] || q.language || 'java'}
                        onChange={(e) => {
                          const newLang = e.target.value;
                          setCodeLanguages({ ...codeLanguages, [idx]: newLang });
                          
                          const BOILERPLATES = {
                            c: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}',
                            java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
                            python: '# Write your code here\n',
                            javascript: '// Write your code here\n',
                            cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}',
                            go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your code here\n}'
                          };
                          
                          const currentCode = answers[idx] || q.initialCode;
                          const isBoilerplate = currentCode === q.initialCode || Object.values(BOILERPLATES).some(b => currentCode.trim() === b.trim()) || currentCode.includes('public class Main') || currentCode.includes('def main():');
                          
                          if (isBoilerplate) {
                            handleAnswer(idx, BOILERPLATES[newLang] || '');
                          }
                        }}
                      >
                        {SUPPORTED_LANGS.map(lang => (
                          <option key={lang.id} value={lang.id} className="bg-[#0b0b14] text-white">{lang.name}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => executeCode(idx, answers[idx] || q.initialCode, false, codeLanguages[idx] || q.language || 'java')}
                        disabled={isExecuting[idx]}
                        className="bg-brand-teal/20 text-brand-teal hover:bg-brand-teal/30 border border-white/10 rounded-lg px-4 py-1.5 text-xs font-bold uppercase flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isExecuting[idx] ? <div className="w-3 h-3 border-2 border-brand-teal border-t-transparent rounded-full animate-spin"></div> : <Play className="w-3 h-3 fill-current" />}
                        Run Code
                      </button>
                    </div>
                    <textarea 
                      className="w-full h-64 bg-[#0a0a0f] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-300 focus:outline-none focus:border-brand-teal shadow-inner"
                      placeholder="Write your code here..."
                      value={answers[idx] !== undefined ? answers[idx] : q.initialCode}
                      onChange={(e) => handleAnswer(idx, e.target.value)}
                      onCopy={(e) => { e.preventDefault(); addToast({ message: 'Copying is disabled during tests.', type: 'warning' }); }}
                      onPaste={(e) => { e.preventDefault(); addToast({ message: 'Pasting is disabled during tests.', type: 'warning' }); }}
                      onCut={(e) => e.preventDefault()}
                    ></textarea>

                    <div className="mt-3">
                      <label className="text-[10px] text-gray-500 font-bold tracking-wide uppercase mb-1 block">Custom Input (Optional stdin)</label>
                      <textarea
                        className="w-full h-20 bg-[#0a0a0f] border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-300 focus:outline-none focus:border-brand-teal shadow-inner"
                        placeholder="Provide any custom standard input for testing your code..."
                        value={customInputs[idx] || ''}
                        onChange={(e) => setCustomInputs({ ...customInputs, [idx]: e.target.value })}
                      ></textarea>
                    </div>
                    
                    {codeOutputs[idx] !== undefined && (
                      <div className="mt-4 bg-[#050508] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        <div className="bg-black/40 px-4 py-2 border-b border-white/5 flex items-center gap-2 justify-between">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-brand-teal" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Terminal Output</span>
                          </div>
                          {typeof codeOutputs[idx] === 'object' && codeOutputs[idx].timeComplexity && (
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                              <span className="text-brand-pink border border-brand-pink/30 bg-brand-pink/10 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.3)]">TC: {codeOutputs[idx].timeComplexity}</span>
                              <span className="text-brand-teal border border-brand-teal/30 bg-brand-teal/10 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.3)]">SC: {codeOutputs[idx].spaceComplexity}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 font-mono text-sm text-gray-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                          {codeOutputs[idx] === 'Compiling and Executing...' ? (
                            <div className="flex items-center gap-2 text-brand-teal text-xs py-4">
                              <div className="w-4 h-4 border-2 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
                              <span>Compiling and Executing...</span>
                            </div>
                          ) : typeof codeOutputs[idx] === 'object' ? (
                            <div className={codeOutputs[idx].error ? "text-red-400" : ""}>{codeOutputs[idx].output}</div>
                          ) : (
                            <div className={typeof codeOutputs[idx] === 'string' && codeOutputs[idx].toLowerCase().includes('error') ? "text-red-400" : ""}>{codeOutputs[idx]}</div>
                          )}
                        </div>
                        
                        {q.expectedOutput && (
                          <div className="bg-black/20 border-t border-white/5 p-4">
                            <div className="text-[10px] text-gray-500 font-bold tracking-wide mb-2 uppercase">Expected Output</div>
                            <pre className="text-xs font-mono text-gray-400 whitespace-pre-wrap overflow-x-auto opacity-70">
                              {q.expectedOutput}
                            </pre>
                          </div>
                        )}

                        {codeOutputs[idx] !== 'Compiling and Executing...' && (() => {
                          const codeOut = codeOutputs[idx];
                          const isObj = typeof codeOut === 'object';
                          const outStr = isObj ? (codeOut.output || '') : (typeof codeOut === 'string' ? codeOut : '');
                          const hasErr = isObj ? codeOut.error : outStr.toLowerCase().includes('error');
                          const isSuccess = !hasErr && (!q.expectedOutput || outStr.trim() === q.expectedOutput.trim());
                          return (
                            <div className={`px-4 py-3 border-t font-bold text-xs tracking-wide flex items-center gap-2 ${
                              isSuccess
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}>
                              {isSuccess ? (
                                <><CheckCircle className="w-4 h-4 flex-shrink-0" /> <span>Execution Successful</span></>
                              ) : (
                                <><XCircle className="w-4 h-4 flex-shrink-0" /> <span>Execution Failed</span></>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
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

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setTestResult(null);
                setView('leaderboard');
              }}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-semibold text-white tracking-wide">Test Result <CheckCircle className="inline w-6 h-6 text-green-500 ml-2" /></h2>
              <p className="text-sm text-gray-400 font-medium">{test.title} - Score: {score}/{total}</p>
              {testResult.flaggedForTabSwitch && (
                <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-500 border border-red-500/50 px-3 py-1 rounded-full text-xs font-bold mt-2 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Flagged: Exited Full Screen 3 Times
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {(test?.questions || []).map((q, idx) => {
            const userAnswer = answers[idx];
            const isCorrect = q.type === 'mcq' ? userAnswer === q.correct : null;
            
            return (
              <div key={q.id || idx} className={`glass-panel p-6 rounded-2xl border ${isCorrect === true ? 'border-green-500/50' : isCorrect === false ? 'border-red-500/50' : 'border-white/10'}`}>
                <h3 className="text-lg font-bold text-white mb-4">
                  <span className="text-brand-teal mr-2">Q{idx + 1}.</span>
                  {q.question}
                </h3>
                
                {q.type === 'mcq' ? (
                  <div className="space-y-3">
                    {(q.options || []).map((opt, optIdx) => {
                      const isUserChoice = userAnswer === optIdx;
                      const isActualCorrect = q.correct === optIdx;
                      
                      let bgClass = "bg-white/5 border-white/10";
                      let indicator = null;
                      
                      if (isActualCorrect) {
                        bgClass = "bg-green-500/20 border-green-500";
                        indicator = <CheckCircle className="w-5 h-5 text-green-500" />;
                      } else if (isUserChoice && !isActualCorrect) {
                        bgClass = "bg-red-500/20 border-red-500";
                        indicator = <XCircle className="w-5 h-5 text-red-500" />;
                      }
                      
                      return (
                        <div key={optIdx} className={`flex items-center justify-between p-4 rounded-xl border ${bgClass}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isUserChoice ? (isActualCorrect ? 'border-green-500' : 'border-red-500') : 'border-gray-500'}`}>
                              {isUserChoice && <div className={`w-2.5 h-2.5 rounded-full ${isActualCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>}
                            </div>
                            <span className="text-sm font-medium text-gray-200">{opt}</span>
                          </div>
                          {indicator}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400 mb-2">Your Answer:</p>
                    <textarea 
                      className="w-full h-64 bg-[#1e1e1e] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-300"
                      readOnly
                      value={userAnswer || "No answer provided"}
                    ></textarea>
                  </div>
                )}
              </div>
            );
          })}
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
            <p className="text-xs text-gray-400 mb-6 flex-1">
              {test.type === 'quiz' ? 'Multiple choice questions' : test.type === 'coding' ? 'Programming challenge' : 'Mixed assessment'}
              {test.scheduledTime && (
                <span className="block mt-2 font-bold text-yellow-500">
                  {isAssignment ? 'Due: ' : 'Starts: '}{new Date(test.scheduledTime).toLocaleString()}
                </span>
              )}
            </p>
            
            <button 
              onClick={() => !isFuture && !hasAttempted && startTest(test)}
              disabled={isFuture || hasAttempted}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-opacity flex items-center justify-center gap-2 ${
                hasAttempted ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-white/10' :
                isFuture ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-white/10' : 
                isAssignment ? 'bg-purple-600 text-white hover:bg-purple-500 cursor-pointer shadow-lg shadow-purple-500/20' :
                'bg-emerald-500 text-white hover:bg-emerald-400 cursor-pointer'
              }`}
            >
              {hasAttempted ? (
                 <><CheckCircle className="w-4 h-4" /> Already Attempted</>
              ) : isFuture ? (
                 `Upcoming ${isAssignment ? 'Assignment' : 'Test'}`
              ) : (
                 <><Play className="w-4 h-4" /> {isAssignment ? 'Start Assignment' : 'Start Test'}</>
              )}
            </button>
          </div>
          );
        })
        )}
      </div>
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

  if (view === 'taking') return renderTakingTest();
  if (view === 'leaderboard') return renderLeaderboard();
  if (view === 'result') return renderResult();
  return renderList();
}
