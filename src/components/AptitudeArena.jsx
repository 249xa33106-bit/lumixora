import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Brain, Calculator, Cpu, BookOpen, Code, CheckCircle2, XCircle, 
  HelpCircle, ChevronDown, ChevronUp, Clock, RotateCcw, Award, 
  Sparkles, Filter, Briefcase, Plus, Send, Zap, Check, Edit2, Eraser, 
  BookMarked, Flame, Lightbulb, Activity, BarChart2, Play, Upload, Download 
} from 'lucide-react';
import { APTITUDE_CATEGORIES, APTITUDE_COMPANIES, INITIAL_APTITUDE_QUESTIONS, APTITUDE_FORMULAS, COMPANY_TEST_PRESETS } from '../data/aptitudeData';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';
import { callAICompletion } from '../services/aiService';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function AptitudeArena({ user, isFounder }) {
  const { addToast } = useToast();
  const { awardXP } = useGamification();

  // Mode: 'practice', 'test', or 'formulas'
  const [mode, setMode] = useState('practice');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubTopic, setSelectedSubTopic] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk Import State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkJsonText, setBulkJsonText] = useState('');
  const bulkFileInputRef = useRef(null);

  // Helper: Download Sample JSON Template
  const handleDownloadSampleTemplate = () => {
    const sampleTemplate = [
      {
        category: "Quantitative",
        subTopic: "Time and Work",
        company: "TCS NQT",
        difficulty: "Easy",
        question: "A can complete a piece of work in 10 days and B in 15 days. Working together, how many days will they take?",
        options: ["6 days", "5 days", "7.5 days", "8 days"],
        correctAnswer: 0,
        explanation: "A's 1 day work = 1/10, B's 1 day work = 1/15. Combined = 1/10 + 1/15 = 5/30 = 1/6. Total = 6 days."
      },
      {
        category: "Logical",
        subTopic: "Blood Relations",
        company: "Accenture ASE",
        difficulty: "Medium",
        question: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
        options: ["Mother", "Sister", "Aunt", "Daughter"],
        correctAnswer: 0,
        explanation: "Only daughter of woman's mother is the woman herself. So the woman is his mother."
      },
      {
        category: "Technical Output",
        subTopic: "C Pointers",
        company: "Amazon",
        difficulty: "Hard",
        question: "What is the output of: int a = 10; int *p = &a; printf(\"%d\", *p + 5);",
        options: ["15", "10", "Error", "Address of a"],
        correctAnswer: 0,
        explanation: "*p dereferences pointer to 10, then 10 + 5 = 15."
      }
    ];

    const blob = new Blob([JSON.stringify(sampleTemplate, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lumixora_aptitude_bulk_template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast({ message: 'Sample Bulk Aptitude JSON template downloaded!', type: 'success' });
  };

  // Helper: Process and validate array of question objects
  const processBulkQuestions = (questionsArray) => {
    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      throw new Error('JSON content must be a non-empty array of question objects.');
    }

    const validated = questionsArray.map((q, idx) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
        throw new Error(`Item #${idx + 1} is missing a question statement or options array.`);
      }

      return {
        id: `bulk-apt-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        category: q.category || 'Quantitative',
        subTopic: q.subTopic || 'General Aptitude',
        company: q.company || 'TCS NQT',
        difficulty: q.difficulty || 'Easy',
        question: String(q.question).trim(),
        options: q.options.map(opt => String(opt).trim()),
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        explanation: q.explanation || 'Verified by Lumixora Aptitude Faculty.'
      };
    });

    const updated = [...validated, ...customQuestions];
    setCustomQuestions(updated);
    localStorage.setItem('lumixora_custom_aptitude', JSON.stringify(updated));
    addToast({ message: `Successfully imported ${validated.length} aptitude questions!`, type: 'success' });
    setShowBulkModal(false);
    setBulkJsonText('');
  };

  // Handler: JSON File Upload
  const handleBulkFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        processBulkQuestions(parsed);
      } catch (err) {
        console.error(err);
        addToast({ message: `Invalid JSON File: ${err.message}`, type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handler: Load 1,000+ Questions JSON Dataset directly
  const handleLoad1000Questions = async () => {
    try {
      addToast({ message: 'Loading 1,000+ Aptitude Questions dataset...', type: 'info' });
      const res = await fetch('/aptitude_1000_questions.json');
      if (!res.ok) throw new Error('Failed to fetch 1000 questions dataset');
      const data = await res.json();
      processBulkQuestions(data);
    } catch (err) {
      console.error(err);
      addToast({ message: `Failed to load 1000 questions dataset: ${err.message}`, type: 'error' });
    }
  };

  // Handler: Raw JSON Paste Submit
  const handleBulkTextSubmit = (e) => {
    e.preventDefault();
    if (!bulkJsonText.trim()) {
      addToast({ message: 'Please paste JSON array content.', type: 'error' });
      return;
    }

    try {
      const parsed = JSON.parse(bulkJsonText);
      processBulkQuestions(parsed);
    } catch (err) {
      console.error(err);
      addToast({ message: `JSON Syntax Error: ${err.message}`, type: 'error' });
    }
  };

  // User Responses State for Practice Mode: { [qId]: optionIndex }
  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = localStorage.getItem(`lumixora_aptitude_answers_${user?.id || 'guest'}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Toggled Explanation Drawers: { [qId]: boolean }
  const [showExplanations, setShowExplanations] = useState({});

  // AI Copilot Explanations: { [qId]: { loading: boolean, text: string } }
  const [aiCoachResponses, setAiCoachResponses] = useState({});

  // Timed Test State
  const [testActive, setTestActive] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);
  const [testAnswers, setTestAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // seconds
  const [activePreset, setActivePreset] = useState(null);

  // Digital Scratchpad Modal State
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [activeScratchQuestion, setActiveScratchQuestion] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#00dfc4');

  // Custom Aptitude Questions from localStorage/Supabase
  const [customQuestions, setCustomQuestions] = useState(() => {
    const saved = localStorage.getItem('lumixora_custom_aptitude');
    return saved ? JSON.parse(saved) : [];
  });

  // Formula Handbook Modal State
  const [showFormulaHandbook, setShowFormulaHandbook] = useState(false);

  // Add Question Modal State (for Founder/Mentor)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQForm, setNewQForm] = useState({
    category: 'Quantitative',
    subTopic: 'General Aptitude',
    company: 'TCS NQT',
    difficulty: 'Easy',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 0,
    explanation: ''
  });

  // Combined Questions list
  const allQuestions = useMemo(() => {
    return [...INITIAL_APTITUDE_QUESTIONS, ...customQuestions];
  }, [customQuestions]);

  // Derived available Sub-Topics for selected category
  const availableSubTopics = useMemo(() => {
    const topics = new Set();
    allQuestions.forEach(q => {
      if (selectedCategory === 'All' || q.category === selectedCategory) {
        if (q.subTopic) topics.add(q.subTopic);
      }
    });
    return ['All', ...Array.from(topics)];
  }, [allQuestions, selectedCategory]);

  // Filtered Questions list
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
      const matchSubTopic = selectedSubTopic === 'All' || q.subTopic === selectedSubTopic;
      const matchComp = selectedCompany === 'All' || q.company === selectedCompany;
      const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      const matchSearch = !searchQuery.trim() || 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (q.subTopic && q.subTopic.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSubTopic && matchComp && matchDiff && matchSearch;
    });
  }, [allQuestions, selectedCategory, selectedSubTopic, selectedCompany, selectedDifficulty, searchQuery]);

  // Telemetry Weakness Analytics
  const telemetry = useMemo(() => {
    const categoriesStats = {};
    APTITUDE_CATEGORIES.filter(c => c.id !== 'All').forEach(cat => {
      const catQs = allQuestions.filter(q => q.category === cat.id);
      const answeredQs = catQs.filter(q => userAnswers[q.id] !== undefined);
      const correctQs = catQs.filter(q => userAnswers[q.id] === q.correctAnswer);

      categoriesStats[cat.id] = {
        total: catQs.length,
        answered: answeredQs.length,
        correct: correctQs.length,
        pct: answeredQs.length > 0 ? Math.round((correctQs.length / answeredQs.length) * 100) : 0
      };
    });
    return categoriesStats;
  }, [allQuestions, userAnswers]);

  // Save answers to local storage
  useEffect(() => {
    localStorage.setItem(`lumixora_aptitude_answers_${user?.id || 'guest'}`, JSON.stringify(userAnswers));
  }, [userAnswers, user]);

  // Timed Test Countdown Timer
  useEffect(() => {
    let timer = null;
    if (testActive && !testFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && testActive && !testFinished) {
      handleFinishTest();
    }
    return () => clearInterval(timer);
  }, [testActive, testFinished, timeLeft]);

  // Canvas Drawing Handlers for Scratchpad
  useEffect(() => {
    if (showScratchpad && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;
    }
  }, [showScratchpad]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = penColor;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearScratchpad = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // AI Copilot Coach Trigger
  const handleAskAiCoach = async (q) => {
    if (aiCoachResponses[q.id]?.text) return; // Already fetched

    setAiCoachResponses(prev => ({ ...prev, [q.id]: { loading: true, text: '' } }));
    addToast({ message: 'Lumixora AI Aptitude Coach is analyzing shortcuts...', type: 'info' });

    try {
      const systemPrompt = `You are Lumixora's Master AI Aptitude Coach for ${q.company} campus placement drives.
Explain this ${q.category} problem concisely:
Problem: "${q.question}"
Correct Answer Option: "${q.options[q.correctAnswer]}"

Provide:
1. ⚡ **Vedic / Mental Math Shortcut** (How to solve in under 30 seconds).
2. ⚠️ **Common Traps & Pitfalls** (Where students make mistakes).
3. 🎯 **Exam Formula Mnemonic**.
Keep response structured, concise, and engaging.`;

      const aiText = await callAICompletion({
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.4
      });

      setAiCoachResponses(prev => ({
        ...prev,
        [q.id]: {
          loading: false,
          text: aiText || `**Pro-Tip Shortcut**: Identify key variable relationships first. For ${q.subTopic}, use standard reciprocal shortcuts to solve in <30s.`
        }
      }));
    } catch (err) {
      console.error(err);
      setAiCoachResponses(prev => ({
        ...prev,
        [q.id]: {
          loading: false,
          text: `**Pro-Tip Shortcut**: Identify key variable relationships first. For ${q.subTopic}, use standard reciprocal shortcuts to solve in <30s.`
        }
      }));
    }
  };

  // Handle Practice Option Selection
  const handleSelectOption = (qId, optionIdx, isCorrect) => {
    if (userAnswers[qId] !== undefined) return;

    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    if (isCorrect) {
      addToast({ message: 'Correct Answer! +15 XP Earned', type: 'success' });
      if (awardXP) awardXP('SOLVE_APTITUDE');
    } else {
      addToast({ message: 'Incorrect option. Review solution breakdown below.', type: 'warning' });
    }
  };

  const toggleExplanation = (qId) => {
    setShowExplanations(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Timed Test Controller
  const handleStartPresetTest = (preset) => {
    setActivePreset(preset);
    const companyQs = allQuestions.filter(q => q.company === preset.company || preset.company === 'All');
    const pool = companyQs.length >= preset.questionCount ? companyQs : allQuestions;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(preset.questionCount, shuffled.length));

    setTestQuestions(selected);
    setTestAnswers({});
    setTimeLeft(preset.duration * 60);
    setTestFinished(false);
    setTestActive(true);
    setMode('test');
  };

  const handleFinishTest = () => {
    setTestFinished(true);
    setTestActive(false);
    let score = 0;
    testQuestions.forEach(q => {
      if (testAnswers[q.id] === q.correctAnswer) score++;
    });
    const pct = testQuestions.length > 0 ? Math.round((score / testQuestions.length) * 100) : 0;
    addToast({ message: `Test Finished! Score: ${score}/${testQuestions.length} (${pct}%)`, type: 'success' });
    if (awardXP) awardXP('COMPLETE_TEST');

    // Update real-time Placement Twin Aptitude Score
    if (user?.id) {
      const userDocRef = doc(db, 'users', user.id);
      updateDoc(userDocRef, {
        'careerDna.aptitude': Math.min(100, pct)
      }).catch(e => console.log(e));
    }
  };

  // Save custom question
  const handleAddQuestionSubmit = (e) => {
    e.preventDefault();
    if (!newQForm.question.trim() || !newQForm.optionA.trim() || !newQForm.optionB.trim()) {
      addToast({ message: 'Please fill in question and options A & B.', type: 'error' });
      return;
    }

    const newQuestion = {
      id: `custom-apt-${Date.now()}`,
      category: newQForm.category,
      subTopic: newQForm.subTopic || 'Custom Problem',
      company: newQForm.company,
      difficulty: newQForm.difficulty,
      question: newQForm.question.trim(),
      options: [newQForm.optionA.trim(), newQForm.optionB.trim(), newQForm.optionC.trim() || 'None of these', newQForm.optionD.trim() || 'All of these'],
      correctAnswer: Number(newQForm.correctAnswer),
      explanation: newQForm.explanation.trim() || 'Correct answer verified by Lumixora Faculty.'
    };

    const updated = [newQuestion, ...customQuestions];
    setCustomQuestions(updated);
    localStorage.setItem('lumixora_custom_aptitude', JSON.stringify(updated));
    setShowAddModal(false);
    addToast({ message: 'Custom Aptitude Question added successfully!', type: 'success' });
  };

  // Category Icon Resolver
  const getCategoryIcon = (catName) => {
    switch (catName) {
      case 'Quantitative': return Calculator;
      case 'Logical': return Cpu;
      case 'Verbal': return BookOpen;
      case 'Technical Output': return Code;
      default: return Brain;
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      
      {/* Top Banner Widget */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-br from-brand-purple/20 via-brand-teal/10 to-transparent border border-white/10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-white/10 text-brand-purple text-xs font-bold tracking-wide">
              <Brain className="w-4 h-4" />
              <span>Campus Placement Aptitude Sub-Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Aptitude & Technical Reasoning Arena
            </h1>
            <p className="text-xs md:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Master Quantitative Aptitude, Logical Reasoning, Verbal Ability, and C/C++ Code Output questions for IT placement drives (TCS NQT, Accenture, Wipro, Infosys, and Amazon).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Formula Handbook Button */}
            <button
              onClick={() => setShowFormulaHandbook(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <BookMarked className="w-4 h-4 text-brand-teal" />
              <span>Formula Handbook</span>
            </button>

            {/* Mode Switcher */}
            <div className="bg-black/40 p-1 rounded-2xl border border-white/10 flex items-center gap-1">
              <button
                onClick={() => { setMode('practice'); setTestActive(false); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === 'practice' ? 'bg-brand-purple text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                Self-Paced Practice
              </button>
              <button
                onClick={() => setMode('test')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  mode === 'test' ? 'bg-brand-teal text-black shadow-sm font-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Timed Placement Test</span>
              </button>
            </div>

            {/* Admin/Founder Action Buttons */}
            {isFounder && (
              <>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-brand-teal/20 hover:bg-brand-teal border border-brand-teal/30 text-brand-teal hover:text-black font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>

                <button
                  onClick={() => setShowBulkModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-brand-purple/20 hover:bg-brand-purple border border-brand-purple/30 text-brand-purple hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Bulk import 50+ Aptitude Questions via JSON"
                >
                  <Upload className="w-4 h-4" />
                  <span>Bulk Import JSON</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── WEAKNESS TELEMETRY HEATMAP ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(telemetry).map(([catName, stats]) => {
          const Icon = getCategoryIcon(catName);
          return (
            <div key={catName} className="glass-panel p-4 rounded-2xl border border-white/5 space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 truncate">
                  <Icon className="w-3 h-3 text-brand-teal" />
                  <span>{catName}</span>
                </span>
                <span className={`text-[10px] font-extrabold ${stats.pct >= 75 ? 'text-green-400' : stats.pct >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {stats.pct}% Accuracy
                </span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full transition-all duration-500 ${stats.pct >= 75 ? 'bg-green-500' : stats.pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${stats.pct}%` }}
                ></div>
              </div>
              <span className="text-[9px] text-gray-500 font-semibold block">
                {stats.correct} / {stats.answered} Correct ({stats.total} total)
              </span>
            </div>
          );
        })}
      </div>

      {/* ─── MODE 1: SELF-PACED PRACTICE MODE ─── */}
      {mode === 'practice' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {APTITUDE_CATEGORIES.map(cat => {
                const Icon = getCategoryIcon(cat.id);
                const count = cat.id === 'All' 
                  ? allQuestions.length 
                  : allQuestions.filter(q => q.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shrink-0 flex items-center gap-2 cursor-pointer border ${
                      selectedCategory === cat.id 
                        ? 'bg-brand-purple/20 border-brand-purple text-brand-purple shadow-sm' 
                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                    <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full text-gray-300 font-semibold">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Dropdown Filters & Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-white/5">
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search questions or topics..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-purple"
                />
              </div>

              {/* Sub-Topic Filter Dropdown */}
              <div>
                <select
                  value={selectedSubTopic}
                  onChange={e => setSelectedSubTopic(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-brand-purple cursor-pointer"
                >
                  <option value="All">All Sub-Topics ({availableSubTopics.length - 1})</option>
                  {availableSubTopics.filter(st => st !== 'All').map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedCompany}
                  onChange={e => setSelectedCompany(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-brand-purple cursor-pointer"
                >
                  <option value="All">All Companies (TCS, Accenture...)</option>
                  {APTITUDE_COMPANIES.filter(c => c !== 'All').map(comp => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedDifficulty}
                  onChange={e => setSelectedDifficulty(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-brand-purple cursor-pointer"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <button
                onClick={() => { setSelectedCategory('All'); setSelectedSubTopic('All'); setSelectedCompany('All'); setSelectedDifficulty('All'); setSearchQuery(''); }}
                className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>

            {/* Active Sub-Topic Indicator Bar */}
            {selectedSubTopic !== 'All' && (
              <div className="flex items-center justify-between bg-brand-purple/15 border border-brand-purple/30 px-4 py-2 rounded-xl text-xs text-brand-purple font-bold animate-fade-in">
                <span>🎯 Filtered by Sub-Topic: "{selectedSubTopic}" ({filteredQuestions.length} Questions Found)</span>
                <button 
                  onClick={() => setSelectedSubTopic('All')}
                  className="px-2.5 py-1 bg-brand-purple/30 hover:bg-brand-purple hover:text-white text-brand-purple rounded-lg text-[10px] uppercase font-bold cursor-pointer transition-all"
                >
                  Clear Filter ✕
                </button>
              </div>
            )}
          </div>

          {/* Question Cards Feed */}
          {filteredQuestions.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center space-y-3">
              <Brain className="w-12 h-12 text-gray-600 mx-auto" />
              <p className="text-sm font-semibold text-gray-400">No aptitude questions match your selected filters.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSelectedSubTopic('All'); setSelectedCompany('All'); setSelectedDifficulty('All'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-xl bg-brand-purple/20 text-brand-purple font-bold text-xs border border-brand-purple/30 cursor-pointer"
              >
                View All Aptitude Questions
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredQuestions.map((q, qIndex) => {
                const userAns = userAnswers[q.id];
                const isAnswered = userAns !== undefined;
                const isCorrect = userAns === q.correctAnswer;
                const isExplanationOpen = showExplanations[q.id];
                const aiState = aiCoachResponses[q.id];

                return (
                  <div 
                    key={q.id}
                    className={`glass-panel p-6 rounded-3xl border transition-all text-left space-y-4 ${
                      isAnswered 
                        ? (isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5')
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    {/* Header Badges & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold bg-brand-purple/20 text-brand-purple border border-brand-purple/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {q.category}
                        </span>
                        
                        {/* Clickable Sub-Topic Badge */}
                        <button
                          onClick={() => setSelectedSubTopic(q.subTopic)}
                          className={`text-[10px] font-semibold border px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                            selectedSubTopic === q.subTopic 
                              ? 'bg-brand-purple text-white border-brand-purple font-bold shadow-sm' 
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-brand-purple/20 hover:text-brand-purple'
                          }`}
                          title={`Click to filter all questions for "${q.subTopic}"`}
                        >
                          {q.subTopic}
                        </button>

                        <span className="text-[10px] font-bold bg-brand-teal/10 text-brand-teal border border-brand-teal/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          <span>{q.company}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Open Scratchpad Canvas */}
                        <button
                          onClick={() => { setActiveScratchQuestion(q); setShowScratchpad(true); }}
                          className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-gray-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                          title="Open rough scribble pad for calculations"
                        >
                          <Edit2 className="w-3 h-3 text-brand-teal" />
                          <span>Rough Scratchpad</span>
                        </button>

                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                          q.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          q.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {q.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">Q{qIndex + 1}</span>
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="space-y-3">
                      <p className="text-sm md:text-base font-semibold text-gray-100 leading-relaxed whitespace-pre-wrap">
                        {q.question}
                      </p>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {q.options.map((optText, optIdx) => {
                        let btnStyle = "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10";
                        if (isAnswered) {
                          if (optIdx === q.correctAnswer) {
                            btnStyle = "bg-green-500/20 border-green-500 text-green-300 font-bold";
                          } else if (userAns === optIdx) {
                            btnStyle = "bg-red-500/20 border-red-500 text-red-300 font-bold";
                          } else {
                            btnStyle = "bg-white/5 border-white/5 text-gray-500 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isAnswered}
                            onClick={() => handleSelectOption(q.id, optIdx, optIdx === q.correctAnswer)}
                            className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-black/40 border border-white/10 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1 font-medium leading-relaxed">{optText}</span>
                            {isAnswered && optIdx === q.correctAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                            )}
                            {isAnswered && userAns === optIdx && optIdx !== q.correctAnswer && (
                              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Action buttons row: Explanation & AI Copilot Coach */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                      {isAnswered ? (
                        <button
                          onClick={() => toggleExplanation(q.id)}
                          className="text-xs text-brand-teal hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{isExplanationOpen ? 'Hide Solution Breakdown' : 'View Step-by-Step Solution Breakdown'}</span>
                          {isExplanationOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-500 italic">Select an option to unlock detailed explanation and AI tricks.</span>
                      )}

                      {/* Ask AI Aptitude Coach Button */}
                      <button
                        onClick={() => handleAskAiCoach(q)}
                        disabled={aiState?.loading}
                        className="px-3.5 py-1.5 rounded-xl bg-brand-purple/20 hover:bg-brand-purple/30 border border-brand-purple/30 text-brand-purple font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${aiState?.loading ? 'animate-spin' : ''}`} />
                        <span>{aiState?.text ? 'View AI Coach Shortcut' : aiState?.loading ? 'Analyzing Shortcut...' : '🤖 Ask AI Copilot for Trick'}</span>
                      </button>
                    </div>

                    {/* Explanation Drawer */}
                    {isAnswered && isExplanationOpen && (
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs text-gray-300 font-normal leading-relaxed animate-fade-in">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal block">
                          Step-by-Step Derivation & Logic:
                        </span>
                        <p className="whitespace-pre-wrap">{q.explanation}</p>
                      </div>
                    )}

                    {/* AI Coach Response Card */}
                    {aiState?.text && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-purple/10 to-transparent border border-brand-purple/30 space-y-2 text-xs text-gray-200 leading-relaxed animate-fade-in">
                        <div className="flex items-center gap-2 text-brand-purple font-bold text-[10px] uppercase tracking-wider">
                          <Lightbulb className="w-4 h-4" />
                          <span>Lumixora AI Aptitude Coach Pro-Tip</span>
                        </div>
                        <div className="prose prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap">
                          {aiState.text}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── MODE 2: TIMED PLACEMENT TEST MODE & PRESETS ─── */}
      {mode === 'test' && (
        <div className="space-y-6">
          
          {!testActive && !testFinished && (
            <div className="space-y-8">
              
              {/* Placement Test Presets Grid */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 text-left">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-teal" />
                  <span>Company Placement Test Presets</span>
                </h3>
                <p className="text-xs text-gray-400">Select a company drive preset to simulate actual online exam environments.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {COMPANY_TEST_PRESETS.map(preset => (
                    <div 
                      key={preset.id}
                      className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-brand-teal/40 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded uppercase">
                          {preset.company}
                        </span>
                        <h4 className="text-xs font-extrabold text-white mt-1">{preset.name}</h4>
                        <span className="text-[10px] text-gray-400 block">{preset.questionCount} Questions • {preset.duration} Mins</span>
                      </div>

                      <button
                        onClick={() => handleStartPresetTest(preset)}
                        className="w-full py-2 rounded-xl bg-brand-teal hover:bg-brand-teal/80 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Test</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Test Screen */}
          {testActive && !testFinished && (
            <div className="space-y-6">
              
              {/* Sticky Timer Header */}
              <div className="sticky top-4 z-20 glass-panel p-4 rounded-2xl border border-brand-teal/30 bg-black/80 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-xs font-bold text-gray-300">
                    {activePreset ? activePreset.name : 'Placement Mock Test'}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-xl border border-white/10 text-brand-teal font-mono font-bold text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>

                  <button
                    onClick={handleFinishTest}
                    className="px-4 py-1.5 rounded-xl bg-brand-pink text-white font-bold text-xs cursor-pointer hover:opacity-90"
                  >
                    Submit Test
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {testQuestions.map((q, idx) => (
                  <div key={q.id} className="glass-panel p-6 rounded-3xl border border-white/10 text-left space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs font-bold text-brand-purple uppercase">Question {idx + 1} of {testQuestions.length}</span>
                      <span className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded">{q.category}</span>
                    </div>

                    <p className="text-sm font-semibold text-gray-100">{q.question}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((optText, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => setTestAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 cursor-pointer ${
                            testAnswers[q.id] === optIdx
                              ? 'bg-brand-purple/20 border-brand-purple text-white font-bold'
                              : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-black/40 border border-white/10 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{optText}</span>
                          {testAnswers[q.id] === optIdx && <Check className="w-4 h-4 text-brand-purple" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Finished Scorecard */}
          {testFinished && (
            <div className="glass-panel p-8 rounded-3xl border border-white/10 max-w-xl mx-auto space-y-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              
              <div>
                <h2 className="text-2xl font-black text-white">Test Completed!</h2>
                <p className="text-xs text-gray-400 mt-1">Here is your performance summary for this mock placement attempt.</p>
              </div>

              {(() => {
                let score = 0;
                testQuestions.forEach(q => {
                  if (testAnswers[q.id] === q.correctAnswer) score++;
                });
                const pct = Math.round((score / testQuestions.length) * 100);

                return (
                  <div className="bg-black/30 p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="text-4xl font-black text-brand-teal">{score} / {testQuestions.length}</div>
                    <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">Accuracy: {pct}%</div>
                    
                    <button
                      onClick={() => { setMode('practice'); setTestFinished(false); }}
                      className="w-full py-3 rounded-xl bg-brand-purple hover:bg-brand-pink text-white font-bold text-xs tracking-wide transition-all cursor-pointer"
                    >
                      Return to Practice Arena
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

        </div>
      )}

      {/* ─── DIGITAL SCRATCHPAD MODAL ─── */}
      {showScratchpad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101018] border border-white/10 p-6 rounded-3xl w-full max-w-3xl shadow-2xl space-y-4 text-left relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-brand-teal" />
                  <span>Digital Rough Scratchpad</span>
                </h3>
                <p className="text-[10px] text-gray-400">Scribble equations, draw Venn diagrams, or trace recursion steps.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                  {['#00dfc4', '#c084fc', '#f472b6', '#ffffff', '#fbbf24'].map(color => (
                    <button
                      key={color}
                      onClick={() => setPenColor(color)}
                      className={`w-5 h-5 rounded-full border ${penColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <button
                  onClick={clearScratchpad}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>

                <button
                  onClick={() => setShowScratchpad(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 text-gray-300 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="bg-black/60 rounded-2xl overflow-hidden border border-white/10 relative">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-[400px] cursor-crosshair touch-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── FORMULA HANDBOOK DRAWER MODAL ─── */}
      {showFormulaHandbook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12121a] border border-white/10 p-6 rounded-3xl w-full max-w-2xl shadow-2xl space-y-4 text-left max-h-[85vh] overflow-y-auto relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-brand-teal" />
                <span>Placement Formula & Shortcut Handbook</span>
              </h3>
              <button
                onClick={() => setShowFormulaHandbook(false)}
                className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1 bg-white/5 rounded-xl"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {APTITUDE_FORMULAS.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-brand-teal uppercase">{item.category}</span>
                    <span className="text-xs font-bold text-white">{item.title}</span>
                  </div>
                  <p className="text-xs text-gray-200 font-mono bg-black/40 p-2.5 rounded-xl border border-white/5">{item.formula}</p>
                  <p className="text-[11px] text-brand-purple font-medium">⚡ Pro-Tip: {item.trick}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD QUESTION MODAL (ADMIN / FOUNDER) ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12121a] border border-white/10 p-6 rounded-3xl w-full max-w-lg shadow-2xl relative space-y-4 text-left max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">Add Aptitude Question</h3>
            <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Category</label>
                  <select
                    value={newQForm.category}
                    onChange={e => setNewQForm({ ...newQForm, category: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Quantitative">Quantitative</option>
                    <option value="Logical">Logical Reasoning</option>
                    <option value="Verbal">Verbal Ability</option>
                    <option value="Technical Output">C/C++ Output</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Target Company</label>
                  <select
                    value={newQForm.company}
                    onChange={e => setNewQForm({ ...newQForm, company: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    {APTITUDE_COMPANIES.filter(c => c !== 'All').map(comp => (
                      <option key={comp} value={comp}>{comp}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Question Text / Code</label>
                <textarea
                  required
                  rows={3}
                  value={newQForm.question}
                  onChange={e => setNewQForm({ ...newQForm, question: e.target.value })}
                  placeholder="Enter problem statement or C code snippet..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Option A"
                  value={newQForm.optionA}
                  onChange={e => setNewQForm({ ...newQForm, optionA: e.target.value })}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Option B"
                  value={newQForm.optionB}
                  onChange={e => setNewQForm({ ...newQForm, optionB: e.target.value })}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Option C"
                  value={newQForm.optionC}
                  onChange={e => setNewQForm({ ...newQForm, optionC: e.target.value })}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Option D"
                  value={newQForm.optionD}
                  onChange={e => setNewQForm({ ...newQForm, optionD: e.target.value })}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Correct Option</label>
                  <select
                    value={newQForm.correctAnswer}
                    onChange={e => setNewQForm({ ...newQForm, correctAnswer: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Difficulty</label>
                  <select
                    value={newQForm.difficulty}
                    onChange={e => setNewQForm({ ...newQForm, difficulty: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Step-by-Step Explanation</label>
                <textarea
                  rows={2}
                  value={newQForm.explanation}
                  onChange={e => setNewQForm({ ...newQForm, explanation: e.target.value })}
                  placeholder="Explain formula and steps to solve..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-pink text-xs font-bold text-white shadow-sm"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── BULK IMPORT APTITUDE QUESTIONS MODAL ─── */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12121a] border border-white/10 p-6 rounded-3xl w-full max-w-2xl shadow-2xl relative space-y-5 text-left max-h-[90vh] overflow-y-auto">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-brand-purple" />
                  <span>Bulk Import Aptitude Questions</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Upload a `.json` file or paste a JSON array of questions.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* One-Click Load 1000+ Dataset */}
                <button
                  onClick={handleLoad1000Questions}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>⚡ Load 1,000+ Questions Dataset</span>
                </button>

                {/* Download Sample JSON Template Button */}
                <button
                  onClick={handleDownloadSampleTemplate}
                  className="px-3.5 py-2 rounded-xl bg-brand-teal/15 hover:bg-brand-teal/30 border border-brand-teal/30 text-brand-teal font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Sample JSON</span>
                </button>
              </div>
            </div>

            {/* Option 1: File Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Option 1: Upload JSON File
              </label>
              
              <input 
                type="file"
                accept=".json"
                ref={bulkFileInputRef}
                onChange={handleBulkFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => bulkFileInputRef.current?.click()}
                className="w-full p-5 rounded-2xl border-2 border-dashed border-white/20 hover:border-brand-purple bg-black/40 hover:bg-black/60 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
              >
                <Upload className="w-7 h-7 text-gray-400 group-hover:text-brand-purple transition-all" />
                <span className="text-xs font-bold text-gray-200">Click to Select & Upload `.json` File</span>
                <span className="text-[10px] text-gray-500">Supports arrays of Aptitude Question objects</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 text-xs text-gray-500 font-bold uppercase my-2">
              <div className="flex-1 h-px bg-white/10"></div>
              <span>OR</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* Option 2: Raw JSON Paste Form */}
            <form onSubmit={handleBulkTextSubmit} className="space-y-3">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Option 2: Paste Raw JSON Array
              </label>

              <textarea
                rows={7}
                value={bulkJsonText}
                onChange={e => setBulkJsonText(e.target.value)}
                placeholder={`[\n  {\n    "category": "Quantitative",\n    "subTopic": "Time and Work",\n    "company": "TCS NQT",\n    "difficulty": "Easy",\n    "question": "A can do a work in 10 days...",\n    "options": ["6 days", "5 days", "7.5 days", "8 days"],\n    "correctAnswer": 0,\n    "explanation": "Step by step solution..."\n  }\n]`}
                className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-xs font-mono text-gray-200 outline-none focus:border-brand-purple leading-relaxed"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-pink text-xs font-bold text-white shadow-lg cursor-pointer transition-all"
                >
                  Import Questions from JSON
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
