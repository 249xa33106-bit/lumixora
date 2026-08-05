import React, { useState, useEffect, useRef } from 'react';
import { Target, Trophy, AlertTriangle, Monitor, Play, CheckCircle, Code, List, ArrowLeft, XCircle, Edit2, Trash2, Save, X, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { supabase } from '../config/supabase';
import { awardXP } from '../services/gamificationService';

export default function TestPortal({ user, setActiveTab }) {
  const isFounder = user?.role === 'founder' || 
                    user?.email?.toLowerCase().includes('founder') || 
                    user?.email?.toLowerCase().includes('admin') || 
                    user?.email?.toLowerCase() === 'admin@lumixora.com';

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
  
  const testContainerRef = useRef(null);

  const SUPPORTED_LANGS = [
    { id: 'c', name: 'C', judge0Id: 50 }, // GCC 9.2.0
    { id: 'java', name: 'Java', judge0Id: 62 }, // OpenJDK 13.0.1
    { id: 'python', name: 'Python', judge0Id: 71 } // Python 3.8.1
  ];
  const [codeOutputs, setCodeOutputs] = useState({});
  const [codeLanguages, setCodeLanguages] = useState({});
  const [isExecuting, setIsExecuting] = useState({});

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
      if (!apiKey) throw new Error("Groq API Key is missing!");

      const systemPrompt = `You are a virtual code execution engine. 
You will receive user-submitted code in a specific language. 
Run the code and provide ONLY the standard output (stdout) or standard error (stderr). 
Do not explain anything. Do not use markdown blocks or backticks. Output exactly what a console would print.`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            { 
              role: "user", 
              content: `Language: ${langConfig.name}\nCode:\n${code}` 
            }
          ],
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API Error (${response.status})`);
      }
      
      const data = await response.json();
      let output = data.choices[0].message.content.trim();
      
      // Clean markdown tags if the AI ignores instructions
      output = output.replace(/```/g, '').trim();
      
      if (!isVerification) {
        setCodeOutputs(prev => ({ ...prev, [qIndex]: output || 'Program finished with no output.' }));
      }
      return output;
    } catch (e) {
      const errOut = `Error: ${e.message}`;
      if (!isVerification) {
        setCodeOutputs(prev => ({ ...prev, [qIndex]: errOut }));
      }
      return errOut;
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
      addToast({ message: 'Time is up! Auto-submitting test.', type: 'warning' });
      submitTest(true);
    }
    
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  // Load tests from Firestore
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const testsRef = collection(db, 'tests');
        // Only fetch active tests
        const q = query(testsRef, where('active', '==', true));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        
        let filteredTests = fetched;
        if (!isFounder) {
          filteredTests = fetched.filter(test => {
            const matchBranch = !test.targetBranch || test.targetBranch === 'All' || test.targetBranch === user?.department;
            const matchSem = !test.targetSem || test.targetSem === 'All' || test.targetSem === String(user?.sem);
            const matchSec = !test.targetSec || test.targetSec === 'All' || test.targetSec === user?.sec;
            
            let isExpired = false;
            if (test.scheduledTime && test.duration) {
              const start = new Date(test.scheduledTime).getTime();
              const end = start + test.duration * 60000;
              if (Date.now() > end) {
                isExpired = true;
              }
            }
            
            return matchBranch && matchSem && matchSec && !isExpired;
          });
        }
        
        setTests(filteredTests);
      } catch (err) {
        console.error("Failed to fetch tests:", err);
      } finally {
        setLoadingTests(false);
      }
    };
    fetchTests();
  }, []);

  // Load leaderboard on mount
  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const resultsRef = collection(db, 'test_results');
      const snap = await getDocs(resultsRef);
      const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setLeaderboard(data);
    } catch (e) {
      console.error('Failed to load leaderboard:', e);
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
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await deleteDoc(doc(db, 'tests', id));
      setTests(prev => prev.filter(test => test.id !== id));
      addToast({ message: 'Test deleted', type: 'success' });
    } catch (e) {
      console.error(e);
      addToast({ message: 'Failed to delete test', type: 'error' });
    }
  };

  const saveTest = async (id) => {
    try {
      const numDuration = parseInt(editingTestVals.duration, 10);
      if (isNaN(numDuration) || !editingTestVals.title.trim()) return;
      await updateDoc(doc(db, 'tests', id), { title: editingTestVals.title, duration: numDuration });
      setTests(prev => prev.map(test => test.id === id ? { ...test, title: editingTestVals.title, duration: numDuration } : test));
      setEditingTestId(null);
      addToast({ message: 'Test updated', type: 'success' });
    } catch (e) {
      console.error(e);
      addToast({ message: 'Failed to update test', type: 'error' });
    }
  };

  // Handle Fullscreen events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const currentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(currentlyFullscreen);

      if (!currentlyFullscreen && view === 'taking') {
        // User exited fullscreen
        const newWarnings = warnings + 1;
        setWarnings(newWarnings);
        
        if (newWarnings >= 3) {
          addToast({ message: 'Maximum warnings reached. Auto-submitting test.', type: 'error' });
          submitTest(true); // Forced submit
        } else {
          addToast({ message: `WARNING: You exited full-screen mode! (${newWarnings}/3 warnings)`, type: 'warning' });
          alert(`WARNING: You have exited full-screen mode!\n\nThis is warning ${newWarnings} of 3. If you exit full-screen mode 3 times, your test will be automatically submitted.`);
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
    if (!confirm(`Are you ready to start the ${test.title}? You MUST remain in full-screen mode.`)) return;
    
    try {
      await enterFullscreen();
      setIsFullscreen(true);
      setActiveTest(test);
      setTimeLeft(test.duration ? test.duration * 60 : 15 * 60); // Convert minutes to seconds
      setWarnings(0);
      setAnswers({});
      setView('taking');
      addToast({ message: 'Test started! Do not exit full-screen mode.', type: 'info' });
    } catch (err) {
      addToast({ message: 'Failed to enter full-screen mode. Please try again.', type: 'error' });
    }
  };

  const handleAnswer = (qIndex, answer) => {
    setAnswers({ ...answers, [qIndex]: answer });
  };

  const submitTest = async (forced = false) => {
    // Removed confirm() because it gets blocked by the browser in fullscreen mode
    
    // Calculate Score
    let score = 0;
    let totalScoreable = 0;
    
    activeTest.questions.forEach((q, idx) => {
      if (q.type === 'mcq') {
        totalScoreable++;
        if (answers[idx] === q.correct) {
          score++;
        }
      }
    });

    const codeQuestions = activeTest.questions.map((q, idx) => ({ q, idx })).filter(item => item.q.type === 'code' && item.q.expectedOutput);
    if (codeQuestions.length > 0) {
      addToast({ message: 'Evaluating coding solutions...', type: 'info' });
      for (const item of codeQuestions) {
        totalScoreable++;
        const userCode = answers[item.idx] || item.q.initialCode;
        const output = await executeCode(item.idx, userCode, true, codeLanguages[item.idx] || item.q.language || 'java'); 
        if (output && output.trim() === item.q.expectedOutput.trim()) {
          score++;
        }
      }
    }

    const result = {
      id: Date.now(),
      testId: activeTest.id,
      testTitle: activeTest.title,
      user: user?.name || 'Anonymous',
      userId: user?.id || user?.uid || null,
      userEmail: user?.email || '',
      score: score,
      total: totalScoreable,
      type: activeTest.type,
      date: new Date().toISOString(),
      test: activeTest,
      answers: answers
    };

    // Save to Firestore and Supabase
    try {
      await addDoc(collection(db, 'test_results'), result);
      
      if (user && (user.id || user.uid)) {
        const uid = user.id || user.uid;
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Award 10 XP for writing a test
        try {
          await awardXP(uid, 'FINISH_QUIZ', 10);
        } catch (xpErr) {
          console.warn('Error awarding XP:', xpErr);
        }

        try {
          const { data: userData } = await supabase.from('users').select('tests_written').eq('id', uid).single();
          const currentTestsWritten = userData?.tests_written || 0;
          await supabase.from('users').update({ 
            last_test_date: todayStr,
            tests_written: currentTestsWritten + 1
          }).eq('id', uid);
        } catch (sbErr) {
          console.warn('Error updating last_test_date in Supabase:', sbErr);
        }
      }

      await loadLeaderboard();
    } catch (e) {
      console.error('Error saving test result:', e);
      addToast({ message: 'Failed to save test result.', type: 'error' });
    }

    addToast({ message: `Test submitted! Score: ${score}/${totalScoreable}`, type: 'success' });
    
    await exitFullscreen();
    setTestResult({
      test: activeTest,
      answers: answers,
      score: score,
      total: totalScoreable
    });
    setActiveTest(null);
    setView('result');
  };

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
            {activeTest.questions.map((q, idx) => (
              <div key={q.id} className="glass-panel p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">
                  <span className="text-brand-teal mr-2">Q{idx + 1}.</span>
                  {q.question}
                </h3>
                
                {q.type === 'mcq' && (
                  <div className="space-y-3">
                    {q.options.map((opt, optIdx) => (
                      <label 
                        key={optIdx} 
                        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors border ${
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
                            python: '# Write your code here\n'
                          };
                          
                          const currentCode = answers[idx] || q.initialCode;
                          const isBoilerplate = currentCode === q.initialCode || Object.values(BOILERPLATES).some(b => currentCode.trim() === b.trim()) || currentCode.includes('public class Main') || currentCode.includes('def main():');
                          
                          if (isBoilerplate) {
                            handleAnswer(idx, BOILERPLATES[newLang]);
                          }
                        }}
                      >
                        {SUPPORTED_LANGS.map(lang => (
                          <option key={lang.id} value={lang.id}>{lang.name}</option>
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
                    ></textarea>
                    
                    {codeOutputs[idx] !== undefined && (
                      <div className="mt-4 space-y-4">
                        <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-4 shadow-inner">
                          <div className="text-[10px] text-gray-500 font-bold tracking-wide mb-2">
                            Execution Output
                          </div>
                          <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-x-auto">
                            {codeOutputs[idx]}
                          </pre>
                        </div>
                        
                        {q.expectedOutput && (
                          <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-4 shadow-inner">
                            <div className="text-[10px] text-gray-500 font-bold tracking-wide mb-2">
                              Expected Output
                            </div>
                            <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-x-auto">
                              {q.expectedOutput}
                            </pre>
                          </div>
                        )}
                        
                        {q.expectedOutput && codeOutputs[idx] !== 'Compiling and Executing...' && (
                          <div className={`p-4 rounded-xl flex items-center gap-3 border font-bold text-sm ${
                            codeOutputs[idx].trim() === q.expectedOutput.trim()
                              ? 'bg-green-500/10 border-green-500/30 text-green-500 shadow-sm'
                              : 'bg-red-500/10 border-red-500/30 text-red-500 shadow-sm'
                          }`}>
                            {codeOutputs[idx].trim() === q.expectedOutput.trim() ? (
                              <><CheckCircle className="w-5 h-5 flex-shrink-0" /> <span className="tracking-wide">Test Case Passed!</span></>
                            ) : (
                              <><XCircle className="w-5 h-5 flex-shrink-0" /> <span className="tracking-wide">Test Case Failed.</span></>
                            )}
                          </div>
                        )}
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
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {test.questions.map((q, idx) => {
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
                    {q.options.map((opt, optIdx) => {
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

  const renderList = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-semibold text-white tracking-wide mb-2">Test Portal <Target className="inline w-6 h-6 text-brand-teal ml-2" /></h2>
          <p className="text-sm text-gray-400 font-medium">Take quizzes and coding assessments in a secure environment.</p>
        </div>
        <div className="flex gap-3">
          {isFounder && (
            <button 
              onClick={() => setActiveTab && setActiveTab('founder-portal')}
              className="bg-brand-teal hover:opacity-90 text-black px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-opacity cursor-pointer shadow-sm"
            >
              <Target className="w-4 h-4" />
              Post Test
            </button>
          )}
          <button 
            onClick={() => setView('leaderboard')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-brand-pink" />
            View Leaderboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loadingTests ? (
          <div className="col-span-full py-12 text-center flex flex-col items-center justify-center text-brand-teal">
            <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold tracking-wide">Fetching Active Tests...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="col-span-full py-12 text-center glass-panel rounded-3xl border border-white/5 border-dashed">
            <Target className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
            <p className="text-sm text-gray-400 font-medium">No tests are currently active. Check back later!</p>
          </div>
        ) : (
          tests.map(test => {
            const isFuture = test.scheduledTime && Date.now() < new Date(test.scheduledTime).getTime();
            const currentUserName = user?.name?.split(' ')[0] || 'Anonymous';
            const hasAttempted = leaderboard.some(entry => entry.testId === test.id && entry.user === currentUserName);
            return (
            <div key={test.id} className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col group hover:border-white/10 transition-colors relative">
              
              {/* Founder Actions */}
              {isFounder && (
                <div className="absolute top-4 right-1/2 translate-x-1/2 sm:right-4 sm:translate-x-0 flex gap-2">
                  {editingTestId === test.id ? (
                    <>
                      <button onClick={() => saveTest(test.id)} className="p-1.5 bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded z-10" title="Save">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingTestId(null)} className="p-1.5 bg-white/5 text-gray-400 hover:text-white rounded z-10" title="Cancel">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditingTestId(test.id); setEditingTestVals({ title: test.title, duration: test.duration }); }} className="p-1.5 icon-3d-blue hover:bg-brand-blue/20 rounded z-10" title="Edit Test">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteTest(test.id)} className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded z-10" title="Delete Test">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {test.type === 'coding' ? <Code className="w-6 h-6 text-brand-blue" /> : <List className="w-6 h-6 text-brand-teal" />}
                </div>
              {editingTestId === test.id ? (
                <div className="flex items-center gap-1 z-10">
                  <input type="number" value={editingTestVals.duration} onChange={e => setEditingTestVals({...editingTestVals, duration: e.target.value})} className="w-12 text-[10px] font-bold text-center bg-white/10 px-1 py-1 rounded-md text-white border border-white/20 outline-none" />
                  <span className="text-[10px] text-gray-400 font-bold">MIN</span>
                </div>
              ) : (
                <span className="text-[10px] font-bold tracking-wide bg-white/10 px-2.5 py-1 rounded-full text-gray-300">
                  {test.duration} MIN
                </span>
              )}
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
                  Starts: {new Date(test.scheduledTime).toLocaleString()}
                </span>
              )}
            </p>
            
            <button 
              onClick={() => !isFuture && !hasAttempted && startTest(test)}
              disabled={isFuture || hasAttempted}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-opacity flex items-center justify-center gap-2 ${
                hasAttempted ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-white/10' :
                isFuture ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-white/10' : 
                'bg-gradient-to-r from-brand-teal to-brand-blue text-black hover:opacity-90 cursor-pointer'
              }`}
            >
              {hasAttempted ? (
                 <><CheckCircle className="w-4 h-4" /> Already Attempted</>
              ) : isFuture ? (
                 'Upcoming Test'
              ) : (
                 <><Play className="w-4 h-4" /> Start Test</>
              )}
            </button>
          </div>
          );
        })
        )}
      </div>
    </div>
  );

  const renderLeaderboard = () => {
    // Process data for matrix
    const userMap = {};
    const testMap = {}; // { testId: testTitle }
    
    leaderboard.forEach(entry => {
      // Use user identifier, fallback to anonymous
      const userName = entry.user || 'Anonymous';
      if (!userMap[userName]) {
        userMap[userName] = {
           user: userName,
           scores: {},
           totalScore: 0
        };
      }
      
      const tId = entry.testId || entry.testTitle; // fallback if testId missing in old data
      if (!testMap[tId]) {
        testMap[tId] = entry.testTitle || 'Unknown Test';
      }
      
      // Save entry per test (assuming 1 submission per user per test. If multiple, it overwrites with the latest processed)
      userMap[userName].scores[tId] = entry;
      userMap[userName].totalScore += (entry.score || 0);
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

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('list')}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-semibold text-white tracking-wide">Global Leaderboard <Trophy className="inline w-6 h-6 text-brand-pink ml-2" /></h2>
              <p className="text-sm text-gray-400 font-medium">See how you rank across all tests.</p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-xs font-bold text-gray-400 tracking-wide sticky left-0 bg-[#0d0d12] z-10">Rank</th>
                  <th className="p-4 text-xs font-bold text-gray-400 tracking-wide sticky left-[72px] bg-[#0d0d12] z-10">Student</th>
                  {testIds.map(tId => (
                    <th key={tId} className="p-4 text-xs font-bold text-gray-400 tracking-wide max-w-[150px] truncate" title={testMap[tId]}>
                      {testMap[tId]}
                    </th>
                  ))}
                  <th className="p-4 text-xs font-bold text-gray-400 tracking-wide">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={testIds.length + 3} className="p-8 text-center text-gray-500 text-sm">
                      No tests have been completed yet. Be the first!
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
                        {userData.user}
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
                                    <button 
                                      onClick={() => handleScoreClick(entry)}
                                      className="text-sm font-bold text-white hover:text-brand-teal transition-colors cursor-pointer"
                                      title={entry.test ? "Click to view detailed answers" : "Detailed answers not available"}
                                    >
                                      {`${entry.score} / ${entry.total}`}
                                    </button>
                                    
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
                      
                      <td className="p-4 text-sm font-bold text-brand-teal">
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
