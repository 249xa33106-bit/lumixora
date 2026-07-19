import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Play, Send, RefreshCw, Cpu, Sparkles, BookOpen, Clock, Award, HelpCircle, LayoutGrid, CheckCircle2, XCircle, Terminal, Minimize2, Maximize2, Download, Upload, Copy, BookOpenCheck } from 'lucide-react';
import { executeCode } from '../services/compilerService';
import { getAICodingAssistantHelp, getPostSubmissionFeedback } from '../services/aiCodingService';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';

export default function CodeEditorPage({ problem, setActiveTab, user }) {
  const { awardXP } = useGamification();
  const { addToast } = useToast();

  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark'); // 'vs-dark' or 'light'
  const [fontSize, setFontSize] = useState(14);
  const [code, setCode] = useState('');
  
  // Left Panel Tab: 'description', 'editorial', 'submissions'
  const [leftTab, setLeftTab] = useState('description');
  // Right Panel Tab: 'console', 'ai-feedback'
  const [rightTab, setRightTab] = useState('console');

  // Execution States
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  
  // AI Assistant Drawer states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [showAiDrawer, setShowAiDrawer] = useState(false);

  // Post Submission Feedback States
  const [submissionFeedback, setSubmissionFeedback] = useState(null);
  
  // Submission logs
  const [submissions, setSubmissions] = useState([]);
  
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Code template on language or problem change
  useEffect(() => {
    if (problem && problem.starterTemplates) {
      setCode(problem.starterTemplates[language] || '');
    }
  }, [problem, language]);

  // Load submissions from localStorage
  useEffect(() => {
    if (user && problem) {
      const logs = JSON.parse(localStorage.getItem(`lumixora_submissions_${user.id}`) || '[]');
      const filtered = logs.filter(s => s.problemId === problem.id).sort((a, b) => b.id - a.id);
      setSubmissions(filtered);
    }
  }, [user, problem]);

  const handleRunCode = async () => {
    setRunning(true);
    setRunResult(null);
    setRightTab('console');
    
    try {
      const res = await executeCode(problem, code, language, false);
      setRunResult(res);
      if (res.success) {
        addToast({ message: 'All sample test cases passed!', type: 'success' });
      } else {
        addToast({ message: `Run Failed: ${res.status}`, type: 'error' });
      }
    } catch (err) {
      console.error(err);
      addToast({ message: 'Sandbox compilation failure.', type: 'error' });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    setSubmitting(true);
    setRunResult(null);
    setSubmissionFeedback(null);
    setRightTab('console');

    try {
      const res = await executeCode(problem, code, language, true);
      setRunResult(res);

      if (res.success) {
        addToast({ message: 'Accepted! All test cases passed! 🎉', type: 'success' });
        
        // Award XP via Gamification Context:
        let xpGained = 50;
        let coinsGained = 10;
        if (problem.difficulty === 'Medium') {
          xpGained = 75;
          coinsGained = 20;
        } else if (problem.difficulty === 'Hard') {
          xpGained = 100;
          coinsGained = 35;
        }
        
        // Trigger automated gamification hooks
        if (awardXP) {
          await awardXP('FINISH_QUIZ', xpGained); // Reward points dynamically
        }

        // Fetch post-submission AI review details
        setRightTab('ai-feedback');
        setAiLoading(true);
        try {
          const aiFeedback = await getPostSubmissionFeedback(problem, code, language, res.status, res.runtime, res.memory);
          setSubmissionFeedback(aiFeedback);
          
          // Save submission history log
          const newSub = {
            id: Date.now(),
            problemId: problem.id,
            problemTitle: problem.title,
            language,
            code,
            status: res.status,
            runtime: res.runtime,
            memory: res.memory,
            timestamp: new Date().toLocaleString(),
            aiFeedback: aiFeedback
          };

          const oldLogs = JSON.parse(localStorage.getItem(`lumixora_submissions_${user.id}`) || '[]');
          const updatedLogs = [newSub, ...oldLogs];
          localStorage.setItem(`lumixora_submissions_${user.id}`, JSON.stringify(updatedLogs));
          setSubmissions(prev => [newSub, ...prev]);

        } catch (aiErr) {
          console.error(aiErr);
        } finally {
          setAiLoading(false);
        }

      } else {
        addToast({ message: `Wrong Answer: Failed ${res.totalCount - res.passedCount} test cases`, type: 'error' });
      }
    } catch (err) {
      console.error(err);
      addToast({ message: 'Submission execution error.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const triggerAICopilot = async (actionType) => {
    setShowAiDrawer(true);
    setAiLoading(true);
    setAiResponse('');
    
    try {
      const response = await getAICodingAssistantHelp(actionType, problem, code, language);
      setAiResponse(response);
    } catch (err) {
      setAiResponse(`### AI Copilot Error\n\nFailed to invoke assistant: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(code);
    addToast({ message: 'Code copied to clipboard!', type: 'success' });
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileExt = language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : language === 'go' ? 'go' : 'c';
    link.download = `${problem.id}_solution.${fileExt}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast({ message: 'Source code downloaded!', type: 'success' });
  };

  const resetCode = () => {
    if (window.confirm('Reset code to default template? This will erase your current draft.')) {
      setCode(problem.starterTemplates[language] || '');
      addToast({ message: 'Code reset successful.', type: 'success' });
    }
  };

  const restoreSubmission = (sub) => {
    if (window.confirm(`Restore code snapshot from submission on ${sub.timestamp}?`)) {
      setCode(sub.code);
      setLanguage(sub.language);
      setLeftTab('description');
      addToast({ message: 'Code snapshot restored!', type: 'success' });
    }
  };

  return (
    <div className={`flex flex-col text-white font-sans ${isFullscreen ? 'fixed inset-0 z-50 bg-[#06060a] p-4' : 'space-y-6 pb-12'}`}>
      
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('coding-practice')}
            className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gray-300" />
          </button>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>{problem.title}</span>
              <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded leading-none ${
                problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {problem.difficulty}
              </span>
            </h2>
            <span className="text-[10px] text-gray-500 font-bold uppercase">{problem.category}</span>
          </div>
        </div>

        {/* Editor Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-black/45 p-1 rounded-2xl border border-white/5">
          {/* Language Selector */}
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-xs font-semibold px-3 py-1.5 outline-none cursor-pointer border-r border-white/5 appearance-none"
          >
            <option value="javascript" className="bg-[#0b0b14] text-white">JavaScript</option>
            <option value="python" className="bg-[#0b0b14] text-white">Python 3</option>
            <option value="cpp" className="bg-[#0b0b14] text-white">C++ (GCC)</option>
            <option value="java" className="bg-[#0b0b14] text-white">Java 17</option>
            <option value="go" className="bg-[#0b0b14] text-white">Go (Golang)</option>
            <option value="c" className="bg-[#0b0b14] text-white">C (GCC)</option>
          </select>

          {/* Theme Selector */}
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-transparent text-xs font-semibold px-3 py-1.5 outline-none cursor-pointer border-r border-white/5 appearance-none"
          >
            <option value="vs-dark" className="bg-[#0b0b14] text-white">Dark Theme</option>
            <option value="light" className="bg-[#0b0b14] text-white">Light Theme</option>
          </select>

          {/* Font Size Selector */}
          <select 
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="bg-transparent text-xs font-semibold px-3 py-1.5 outline-none cursor-pointer appearance-none"
          >
            <option value={12} className="bg-[#0b0b14] text-white">12px</option>
            <option value={14} className="bg-[#0b0b14] text-white">14px</option>
            <option value={16} className="bg-[#0b0b14] text-white">16px</option>
            <option value={18} className="bg-[#0b0b14] text-white">18px</option>
          </select>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button onClick={copyCodeToClipboard} className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all" title="Copy Code"><Copy className="w-4 h-4 text-gray-400" /></button>
          <button onClick={downloadCode} className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all" title="Download Code"><Download className="w-4 h-4 text-gray-400" /></button>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all" title="Toggle Fullscreen">
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-gray-400" /> : <Maximize2 className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Split Panels */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${isFullscreen ? 'h-[calc(100vh-100px)]' : 'min-h-[70vh]'}`}>
        
        {/* Left Column: Problem description tabs */}
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-full">
          {/* Tabs header */}
          <div className="flex border-b border-white/5 bg-black/25">
            {[
              { id: 'description', label: 'Description', icon: HelpCircle },
              { id: 'editorial', label: 'Editorial Solution', icon: BookOpen },
              { id: 'submissions', label: 'My Submissions', icon: Clock }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setLeftTab(tab.id)}
                  className={`flex items-center gap-1.5 px-6 py-4.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    leftTab === tab.id 
                      ? 'border-brand-teal text-brand-teal bg-white/[0.01]' 
                      : 'border-transparent text-gray-500 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Body */}
          <div className="p-6 overflow-y-auto flex-1 leading-relaxed text-xs text-gray-300 space-y-6 max-h-[550px] custom-scrollbar">
            
            {/* Tab: DESCRIPTION */}
            {leftTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wide">Problem Statement</h3>
                  <div className="whitespace-pre-wrap leading-relaxed font-normal text-gray-300">
                    {problem.statement}
                  </div>
                </div>

                {/* Constraints */}
                <div className="bg-[#030712]/40 rounded-2xl border border-white/5 p-4 space-y-2">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Constraints</span>
                  <ul className="list-disc pl-4 space-y-1 text-gray-400">
                    {problem.constraints?.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                    <li>Time Limit: {problem.timeLimit}</li>
                    <li>Memory Limit: {problem.memoryLimit}</li>
                  </ul>
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Examples</span>
                  {problem.examples?.map((ex, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
                      <span className="text-[10px] font-bold text-brand-teal uppercase">Example {idx + 1}:</span>
                      <div className="font-mono text-[11px] space-y-1">
                        <div><span className="text-gray-500">Input:</span> <span className="text-gray-300">{ex.input}</span></div>
                        <div><span className="text-gray-500">Output:</span> <span className="text-gray-300">{ex.output}</span></div>
                        {ex.explanation && (
                          <div className="mt-2 text-gray-400 font-sans italic text-xs leading-relaxed">
                            <span className="font-bold text-gray-500 not-italic">Explanation:</span> {ex.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hints dropdown */}
                {problem.hints && problem.hints.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Need a nudge? (Hints)</span>
                    <div className="space-y-2">
                      {problem.hints.map((hint, idx) => (
                        <details key={idx} className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs cursor-pointer group">
                          <summary className="font-bold text-brand-blue flex items-center justify-between list-none">
                            <span>Hint {idx + 1}</span>
                            <span className="text-[10px] text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                          </summary>
                          <p className="mt-2 text-gray-300 leading-relaxed pl-1">{hint}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* Companies list */}
                {problem.companies && (
                  <div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Company Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {problem.companies.map((c, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/5 text-[9px] font-semibold text-gray-400 uppercase tracking-wider">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: EDITORIAL */}
            {leftTab === 'editorial' && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wide">AI Editorial Walkthrough</h3>
                <div className="whitespace-pre-wrap leading-relaxed text-gray-300 prose prose-invert max-w-none text-xs">
                  {problem.editorial}
                </div>
              </div>
            )}

            {/* Tab: SUBMISSIONS */}
            {leftTab === 'submissions' && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wide">Your Submission History</h3>
                
                {submissions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 italic">No submissions recorded for this problem yet. Submit your draft to audit!</div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((sub) => (
                      <div 
                        key={sub.id}
                        onClick={() => restoreSubmission(sub)}
                        className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-teal/20 rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              sub.status === 'Accepted' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {sub.status}
                            </span>
                            <span className="text-[10px] text-gray-400 font-semibold">{sub.language}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 block">Submitted {sub.timestamp}</span>
                        </div>
                        <div className="text-right space-y-0.5">
                          <span className="text-[10px] font-bold text-gray-400 block">Runtime: {sub.runtime}</span>
                          <span className="text-[10px] font-bold text-gray-400 block">Memory: {sub.memory}</span>
                          {sub.aiFeedback?.qualityScore && (
                            <span className="text-[10px] text-brand-teal font-extrabold block">AI Score: {sub.aiFeedback.qualityScore}/100</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Code Editor + Compilation Pane */}
        <div className="flex flex-col gap-6 h-full">
          {/* Editor Sandbox Container */}
          <div className="glass-panel rounded-3xl overflow-hidden flex-1 relative min-h-[300px] flex flex-col">
            
            {/* Editor Workspace Frame */}
            <div className="flex-1 min-h-[280px]">
              <Editor
                height="100%"
                language={language}
                theme={theme}
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  bracketPairColorization: { enabled: true },
                  autoClosingBrackets: 'always',
                  autoClosingQuotes: 'always',
                  cursorBlinking: 'smooth',
                  formatOnType: true,
                  lineNumbers: 'on',
                  folding: true,
                  suggestOnTriggerCharacters: true
                }}
              />
            </div>
            
            {/* Inline Editor Shortcuts Overlay */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10 bg-[#090910]/85 border border-white/5 p-1 rounded-xl">
              <button 
                onClick={resetCode}
                className="px-2 py-1 text-[9px] font-bold text-gray-400 hover:text-white uppercase transition-all"
              >
                Reset
              </button>
              <button 
                onClick={() => triggerAICopilot('hint')}
                className="px-2 py-1 text-[9px] font-bold text-brand-teal hover:brightness-110 uppercase transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 fill-current" />
                <span>AI Hint</span>
              </button>
            </div>
          </div>

          {/* Console Outputs / AI Feedback Lower Pane */}
          <div className="glass-panel rounded-3xl overflow-hidden h-64 flex flex-col shrink-0">
            {/* Tabs Header */}
            <div className="flex border-b border-white/5 bg-black/25 shrink-0">
              <button
                onClick={() => setRightTab('console')}
                className={`flex items-center gap-1.5 px-5 py-3 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  rightTab === 'console' 
                    ? 'border-brand-teal text-brand-teal bg-white/[0.01]' 
                    : 'border-transparent text-gray-500 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console Output</span>
              </button>
              
              <button
                onClick={() => setRightTab('ai-feedback')}
                className={`flex items-center gap-1.5 px-5 py-3 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  rightTab === 'ai-feedback' 
                    ? 'border-brand-pink text-brand-pink bg-white/[0.01]' 
                    : 'border-transparent text-gray-500 hover:text-white'
                }`}
              >
                <BookOpenCheck className="w-3.5 h-3.5" />
                <span>AI Submit Feedback</span>
              </button>
            </div>

            {/* Tab Body console */}
            <div className="p-4 overflow-y-auto flex-1 font-mono text-[11px] text-gray-400 leading-relaxed bg-[#050508] custom-scrollbar">
              
              {/* CONSOLE OUTPUT TAB */}
              {rightTab === 'console' && (
                <div>
                  {!runResult && !running && !submitting && (
                    <div className="h-full flex items-center justify-center text-gray-600 py-12 text-xs italic">
                      Click "Run Code" to compile and execute against standard inputs.
                    </div>
                  )}

                  {(running || submitting) && (
                    <div className="flex flex-col items-center justify-center py-10 gap-3 text-xs">
                      <RefreshCw className="w-6 h-6 text-brand-teal animate-spin" />
                      <span>{submitting ? 'Submitting & running against hidden test cases...' : 'Compiling & executing sandboxed code...'}</span>
                    </div>
                  )}

                  {runResult && !running && !submitting && (
                    <div className="space-y-4">
                      {/* Overall Status Banner */}
                      <div className={`p-3 rounded-xl border flex items-center justify-between gap-4 ${
                        runResult.success 
                          ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs uppercase tracking-wider">{runResult.status}</span>
                          <span className="text-[10px] text-gray-400">
                            ({runResult.passedCount}/{runResult.totalCount} Test Cases Passed)
                          </span>
                        </div>
                        <div className="text-right text-[10px] text-gray-400">
                          <span>Runtime: {runResult.runtime}</span>
                          <span className="mx-1.5">•</span>
                          <span>Memory: {runResult.memory}</span>
                        </div>
                      </div>

                      {/* Compiler Error logs if any */}
                      {runResult.compilerError && (
                        <div className="bg-red-950/20 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs whitespace-pre-wrap leading-normal font-sans">
                          <h4 className="font-extrabold uppercase mb-1 tracking-wider text-[10px] text-red-500">Compilation Logs:</h4>
                          {runResult.compilerError}
                        </div>
                      )}

                      {/* Individual Test Cases Results */}
                      {runResult.results && runResult.results.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Execution Log details</span>
                          {runResult.results.map((r, i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-semibold">
                                <span className="text-gray-400">Test Case #{i + 1}</span>
                                <span className={r.passed ? 'text-green-400 font-extrabold' : 'text-red-400 font-extrabold'}>{r.status}</span>
                              </div>
                              <div className="text-[10px] space-y-0.5">
                                <div><span className="text-gray-500">Input:</span> <span className="text-gray-300 font-mono">{r.input.replace(/\n/g, ' ')}</span></div>
                                <div><span className="text-gray-500">Expected:</span> <span className="text-gray-300 font-mono">{r.expected}</span></div>
                                <div><span className="text-gray-500">Actual:</span> <span className="text-gray-300 font-mono">{r.actual}</span></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* AI SUBMIT FEEDBACK TAB */}
              {rightTab === 'ai-feedback' && (
                <div className="space-y-4 font-sans text-xs">
                  {aiLoading && (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <Sparkles className="w-6 h-6 text-brand-pink animate-pulse" />
                      <span>Reviewing code semantics, complexity & performance metrics...</span>
                    </div>
                  )}

                  {!aiLoading && !submissionFeedback && (
                    <div className="h-full flex items-center justify-center text-gray-600 py-12 text-xs italic text-center">
                      AI audits are triggered automatically after a successful submission. Correctly solve this problem to view metrics!
                    </div>
                  )}

                  {submissionFeedback && !aiLoading && (
                    <div className="space-y-4 animate-fade-in text-gray-300">
                      {/* Metric Scores Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#f72585]/5 border border-[#f72585]/10 p-3 rounded-xl text-center">
                          <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">Quality Grade</span>
                          <span className="text-xl font-black text-brand-pink block mt-1">{submissionFeedback.qualityScore}/100</span>
                        </div>
                        <div className="bg-brand-teal/5 border border-brand-teal/10 p-3 rounded-xl text-center">
                          <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">Readability Grade</span>
                          <span className="text-xl font-black text-brand-teal block mt-1">{submissionFeedback.readabilityScore}/100</span>
                        </div>
                      </div>

                      {/* Correctness Analysis */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Semantic Analysis</span>
                        <p className="leading-relaxed bg-white/[0.01] p-3 rounded-xl border border-white/5 font-normal">{submissionFeedback.correctnessAnalysis}</p>
                      </div>

                      {/* Refactoring suggestions */}
                      {submissionFeedback.suggestions && submissionFeedback.suggestions.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Refactoring Tips</span>
                          <ul className="list-disc pl-4 space-y-1 text-gray-400 leading-relaxed font-normal">
                            {submissionFeedback.suggestions.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Better algorithms */}
                      {submissionFeedback.betterAlgorithms && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Algorithmic Optimizations</span>
                          <p className="leading-relaxed bg-white/[0.01] p-3 rounded-xl border border-white/5 font-normal">{submissionFeedback.betterAlgorithms}</p>
                        </div>
                      )}

                      {/* Personalized Learning Tip */}
                      {submissionFeedback.learningTip && (
                        <div className="bg-brand-teal/10 border border-brand-teal/20 p-3 rounded-xl text-brand-teal">
                          <span className="text-[9px] font-black uppercase block mb-1">Personalized Learning Tip:</span>
                          <p className="font-normal font-sans leading-relaxed text-xs">{submissionFeedback.learningTip}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 shrink-0">
            {/* AI Assistant Triggers */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => triggerAICopilot('explain')} 
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-brand-teal/30 hover:text-brand-teal text-xs font-semibold text-gray-300 transition-all cursor-pointer"
              >
                <span>Explain Code</span>
              </button>
              <button 
                onClick={() => triggerAICopilot('optimize')} 
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-brand-pink/30 hover:text-brand-pink text-xs font-semibold text-gray-300 transition-all cursor-pointer"
              >
                <span>Optimize Code</span>
              </button>
              <button 
                onClick={() => triggerAICopilot('dry-run')} 
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-brand-blue/30 hover:text-brand-blue text-xs font-semibold text-gray-300 transition-all cursor-pointer"
              >
                <span>Dry Run Trace</span>
              </button>
            </div>

            {/* Run / Submit execution buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRunCode}
                disabled={running || submitting}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-3.5 h-3.5 fill-current text-brand-teal" />
                <span>Run Code</span>
              </button>
              
              {problem.id === 'sandbox' ? (
                <button
                  onClick={() => triggerAICopilot('explain')}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple hover:brightness-110 text-white text-xs font-black transition-all shadow-[0_0_15px_rgba(247,37,133,0.3)] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>AI Code Review</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmitSolution}
                  disabled={running || submitting}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-teal hover:brightness-115 text-black text-xs font-black transition-all shadow-[0_0_15px_rgba(0,245,212,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Solution</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* AI Assistant Drawer Modal Overlay */}
      {showAiDrawer && (
        <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#06060a]/95 border-l border-white/10 shadow-2xl z-50 flex flex-col animate-slide-in-right backdrop-blur-md">
          {/* Drawer Header */}
          <div className="p-5 border-b border-white/5 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-pink/20 flex items-center justify-center text-brand-pink animate-pulse">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-gray-200">AI Coding Assistant</h3>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Interactive Learning Mode</span>
              </div>
            </div>
            <button 
              onClick={() => setShowAiDrawer(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body content */}
          <div className="p-6 overflow-y-auto flex-1 text-xs leading-relaxed text-gray-300 custom-scrollbar whitespace-pre-wrap">
            {aiLoading ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                <RefreshCw className="w-8 h-8 text-brand-pink animate-spin" />
                <div>
                  <h4 className="font-bold text-gray-200 animate-pulse">AI Copilot is reviewing code...</h4>
                  <p className="text-[10px] text-gray-500 mt-1 max-w-[280px]">Analyzing logical traces, complexity benchmarks and dry-run outputs.</p>
                </div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none prose-xs font-sans leading-relaxed text-gray-300 font-normal">
                {/* Parse Markdown representation natively */}
                {aiResponse}
              </div>
            )}
          </div>
          
          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end">
            <button 
              onClick={() => setShowAiDrawer(false)}
              className="px-5 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Close Copilot
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
