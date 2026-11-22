import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  HelpCircle, Upload, Send, Sparkles, User, CheckCircle2, 
  ChevronRight, Image as ImageIcon, X, MessageCircle,
  Mic, MicOff, Calculator, Code, BookOpen, RefreshCw,
  Search, ArrowRight, Zap, Check, FileDown, Lightbulb, 
  SlidersHorizontal, History, PlusCircle, ArrowLeft, Eye
} from 'lucide-react';
import katex from 'katex';
import { generateDoubtResolution } from '../services/aiService';
import { useData } from '../context/DataContext';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import AcademicSolutionRenderer, { renderMarkdownWithKaTeX } from '../components/AcademicSolutionRenderer';

const MATH_QUICK_SYMBOLS = [
  { label: '√x', insert: '\\sqrt{x}' },
  { label: '∫', insert: '\\int_{a}^{b} f(x)\\,dx' },
  { label: 'd/dx', insert: '\\frac{d}{dx}[f(x)]' },
  { label: '∑', insert: '\\sum_{i=1}^{n}' },
  { label: 'Fraction', insert: '\\frac{a}{b}' },
  { label: 'x²', insert: 'x^2' },
  { label: 'lim', insert: '\\lim_{x \\to 0}' },
  { label: 'π', insert: '\\pi' },
  { label: 'θ', insert: '\\theta' },
  { label: 'α', insert: '\\alpha' },
  { label: '±', insert: '\\pm' },
  { label: '≈', insert: '\\approx' },
  { label: '≠', insert: '\\neq' },
  { label: 'Matrix', insert: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { label: 'Python Block', insert: '```python\n# write code here\n```' }
];

const DOMAINS = [
  'All Subjects',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Electronics',
  'Aptitude'
];

export default function DoubtSolving() {
  const { doubts = [], addDoubt, updateDoubt } = useData();
  const { awardXP } = useGamification();
  const { addToast } = useToast();

  const [solverMode, setSolverMode] = useState('ai'); // 'ai' | 'mentor'
  const [tutorStyle, setTutorStyle] = useState('full'); // 'full' | 'socratic'
  const [doubtText, setDoubtText] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [showMathBar, setShowMathBar] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  
  const [activeDoubt, setActiveDoubt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [isFollowUpSubmitting, setIsFollowUpSubmitting] = useState(false);

  const textareaRef = useRef(null);
  const chatScrollRef = useRef(null);

  // Auto-scroll chat to bottom when activeDoubt thread updates
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeDoubt?.thread, isFollowUpSubmitting]);

  // Real-Time KaTeX Math Live Preview calculation
  const liveMathPreviewHtml = useMemo(() => {
    if (!doubtText) return null;
    const hasLatex = doubtText.includes('$') || 
      doubtText.includes('\\frac') || 
      doubtText.includes('\\int') || 
      doubtText.includes('\\sqrt') || 
      doubtText.includes('\\sum') || 
      doubtText.includes('\\lim');
    
    if (!hasLatex) return null;

    try {
      let mathExpr = doubtText;
      const match = doubtText.match(/\$\$([\s\S]*?)\$\$/) || doubtText.match(/\$([^\$]+)\$/);
      if (match) {
        mathExpr = match[1];
      }
      return katex.renderToString(mathExpr, { throwOnError: false, displayMode: true });
    } catch {
      return null;
    }
  }, [doubtText]);

  // Voice speech-to-text
  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (addToast) addToast({ message: "Voice input is not supported in this browser. Please use Chrome/Edge.", type: "warning" });
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setDoubtText(prev => prev ? `${prev} ${transcript}` : transcript);
          if (addToast) addToast({ message: "Voice captured into question box!", type: "success" });
        }
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  // Direct Clipboard Image Paste Handler (Ctrl + V)
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          setUploadedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageBase64(reader.result);
          };
          reader.readAsDataURL(file);
          if (addToast) addToast({ message: "📋 Screenshot attached from clipboard!", type: "success" });
          e.preventDefault();
          break;
        }
      }
    }
  };

  // Drag and Drop Image Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
      if (addToast) addToast({ message: "📁 Problem image attached!", type: "success" });
    }
  };

  const handleInsertSymbol = (symText) => {
    if (!textareaRef.current) {
      setDoubtText(prev => prev + ' ' + symText);
      return;
    }
    const elem = textareaRef.current;
    const start = elem.selectionStart || 0;
    const end = elem.selectionEnd || 0;
    const newText = doubtText.substring(0, start) + symText + doubtText.substring(end);
    setDoubtText(newText);
    setTimeout(() => {
      elem.focus();
      elem.setSelectionRange(start + symText.length, start + symText.length);
    }, 50);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setImageBase64('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const getPlaceholder = () => {
    if (solverMode === 'mentor') return "Explain your question or concept in detail for human mentors...";
    switch (subject) {
      case 'Computer Science': return "Paste code, compiler error, or algorithms question... (Supports Ctrl+V for screenshots)";
      case 'Mathematics': return "Type problem, calculus question, or equation e.g. \\int x^2 dx... (Supports Ctrl+V screenshots)";
      case 'Physics': return "Describe the physics law, circuit, or mechanics problem...";
      case 'Chemistry': return "Enter reaction mechanism, stoichiometry, or concept...";
      default: return "Paste your problem, equation, or screenshot (Press Ctrl+V to attach images directly)...";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doubtText.trim() && !imageBase64) return;

    setIsSubmitting(true);
    
    try {
      let thread = [];
      let status = 'Pending Review';

      const promptPayload = tutorStyle === 'socratic' 
        ? `${doubtText}\n\n[Instruction: Present this explanation in clear, numbered steps starting with Step 1: Core Concept, Step 2: Formula, Step 3: Derivation, so I can learn interactively.]`
        : doubtText;

      if (solverMode === 'ai') {
        const aiResponse = await generateDoubtResolution(promptPayload, subject, false, imageBase64);
        thread = [
          {
            author: 'Vyomra AI Master Tutor',
            isAI: true,
            content: aiResponse,
            timestamp: new Date().toISOString()
          }
        ];
        status = 'Resolved';
      }

      const newDoubt = {
        id: `doubt_${Date.now()}`,
        topic: doubtText || 'Attached textbook problem image',
        tag: subject,
        status: status,
        date: 'Just now',
        hasImage: !!imageBase64,
        imageUrl: imageBase64,
        isHumanRequest: solverMode === 'mentor',
        thread: thread,
        initialSocratic: tutorStyle === 'socratic'
      };

      // Display doubt resolution immediately
      setActiveDoubt(newDoubt);

      try {
        if (addDoubt) {
          const added = await addDoubt(newDoubt);
          if (added && added.id) setActiveDoubt(added);
        }
      } catch (dbErr) {
        console.warn("Database doubt save note:", dbErr);
      }
      
      try {
        if (awardXP) await awardXP('HELP_STUDENT');
      } catch (e) {}
      
      setDoubtText('');
      clearFile();

      if (solverMode === 'mentor') {
        if (addToast) addToast({ message: "Doubt sent to faculty mentors! They will reply soon.", type: "success" });
      } else {
        if (addToast) addToast({ message: "Step-by-step textbook resolution generated!", type: "success" });
      }
    } catch (err) {
      console.error(err);
      if (addToast) addToast({ message: "Error generating resolution.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick follow up handler
  const handleQuickFollowUp = async (customPrompt) => {
    if (!customPrompt || !activeDoubt || isFollowUpSubmitting) return;

    setIsFollowUpSubmitting(true);
    const userMessage = {
      author: 'Scholar',
      isAI: false,
      content: customPrompt,
      timestamp: new Date().toISOString()
    };

    const updatedThread = [...(activeDoubt.thread || []), userMessage];
    setActiveDoubt(prev => ({ ...prev, thread: updatedThread }));

    try {
      const chatContext = updatedThread.map(msg => ({
        role: msg.isAI ? "assistant" : "user",
        content: msg.content
      }));

      const aiResponse = await generateDoubtResolution(chatContext, activeDoubt.tag || 'Academic', true, null);
      
      const aiMessage = {
        author: 'Vyomra AI Master Tutor',
        isAI: true,
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      const finalThread = [...updatedThread, aiMessage];
      const finalActiveDoubt = { ...activeDoubt, thread: finalThread };
      
      setActiveDoubt(finalActiveDoubt);
      if (updateDoubt) {
        await updateDoubt(activeDoubt.id, { thread: finalThread });
      }
    } catch (err) {
      console.error(err);
      if (addToast) addToast({ message: "Error retrieving explanation.", type: "error" });
    } finally {
      setIsFollowUpSubmitting(false);
    }
  };

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    if (!followUpText.trim() || !activeDoubt) return;

    const query = followUpText.trim();
    setFollowUpText('');
    await handleQuickFollowUp(query);
  };

  // Printable Exam Note PDF Export
  const handleExportExamNote = (doubt) => {
    if (!doubt) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      if (addToast) addToast({ message: "Please allow popups to export exam note", type: "warning" });
      return;
    }

    const solutionText = doubt.thread?.find(m => m.isAI)?.content || doubt.topic;
    const renderedContent = renderMarkdownWithKaTeX(solutionText);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lumixora Exam Note - ${doubt.tag || 'Academic'}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; max-width: 800px; margin: 0 auto; background: #ffffff; }
            .header { border-bottom: 2px solid #06b6d4; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
            .brand { font-size: 20px; font-weight: 900; color: #0891b2; letter-spacing: -0.5px; }
            .domain { font-size: 11px; font-weight: 800; background: #ecfeff; color: #0e7490; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; border: 1px solid #cffafe; }
            .question-box { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #06b6d4; padding: 16px; border-radius: 12px; margin-bottom: 24px; font-weight: 600; font-size: 14px; }
            .solution-content { font-size: 13.5px; color: #1e293b; }
            .katex-display { margin: 16px 0; padding: 12px; background: #f8fafc; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0; }
            code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 12px; }
            pre { background: #0b0f19; color: #f8fafc; padding: 16px; border-radius: 12px; overflow-x: auto; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
            th { background: #f8fafc; font-weight: 700; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">LUMIXORA ACADEMIC DERIVATION STUDIO</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Textbook-Grade Step-by-Step Verified Solution</div>
            </div>
            <div class="domain">${doubt.tag || 'Academic Doubt'}</div>
          </div>
          <div class="question-box">
            <div style="font-size: 10px; text-transform: uppercase; color: #64748b; margin-bottom: 4px; font-weight: 800;">Problem Statement:</div>
            ${doubt.topic}
          </div>
          <div class="solution-content">
            ${renderedContent}
          </div>
          <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center;">
            Generated via Lumixora AI Academic Master Tutor • Verified for University Exams
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filtered doubts history
  const filteredDoubts = (doubts || []).filter(d => {
    const q = searchHistoryQuery.toLowerCase().trim();
    if (!q) return true;
    return (d.topic && d.topic.toLowerCase().includes(q)) || (d.tag && d.tag.toLowerCase().includes(q));
  });

  return (
    <div className="w-full min-h-screen text-slate-100 animate-fade-in relative z-10 pb-16 font-sans">
      
      {/* ─── 1. TOP CONTROL BAR (SLEEK OBSIDIAN BANNER) ─── */}
      <div className="w-full rounded-2xl md:rounded-3xl bg-[#0b0f19] border border-slate-800/80 p-4 sm:p-5 mb-5 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
        {/* Ambient Subtle Glow */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Title & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-wide">
                Academic Doubt & Derivation Studio
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-[10px] font-bold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                KaTeX Live
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Textbook-grade step-by-step derivations, code & exam proofs</p>
          </div>
        </div>

        {/* Mode Selector & Knowledge Drawer Toggle */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-between md:justify-end">
          {/* Solver Mode Toggle */}
          <div className="inline-flex bg-slate-950/90 p-1 rounded-xl border border-slate-800 gap-1">
            <button
              type="button"
              onClick={() => setSolverMode('ai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                solverMode === 'ai'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Master Tutor</span>
            </button>
            <button
              type="button"
              onClick={() => setSolverMode('mentor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                solverMode === 'mentor'
                  ? 'bg-purple-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Faculty Mentor</span>
            </button>
          </div>

          {/* Doubt History Library Drawer Button */}
          <button
            type="button"
            onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showHistoryDrawer 
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60 shadow-sm' 
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border-slate-800'
            }`}
            title="Toggle previous doubts history"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Library ({doubts.length})</span>
          </button>

          {/* New Doubt Button */}
          {activeDoubt && (
            <button
              type="button"
              onClick={() => {
                setActiveDoubt(null);
                setDoubtText('');
                clearFile();
              }}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/30 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ New Doubt</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── 2. MAIN LAYOUT (WORKSPACE STUDIO + COLLAPSIBLE DRAWER) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* COLLAPSIBLE HISTORY DRAWER (WHEN OPENED) */}
        {showHistoryDrawer && (
          <div className="lg:col-span-4 rounded-3xl bg-[#0b0f19] border border-slate-800/80 p-4 shadow-xl space-y-3 text-left animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>My Resolved Library ({filteredDoubts.length})</span>
              </span>
              <button 
                onClick={() => setShowHistoryDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search History */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchHistoryQuery}
                onChange={(e) => setSearchHistoryQuery(e.target.value)}
                placeholder="Search past questions or formulas..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Doubt Cards List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredDoubts.slice().reverse().map(d => {
                const isSelected = activeDoubt?.id === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      setActiveDoubt(d);
                      setShowHistoryDrawer(false);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                        d.isHumanRequest ? 'bg-purple-950 text-purple-300 border border-purple-800/40' : 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                      }`}>
                        {d.tag || 'Academic'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        d.status === 'Resolved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' : 'bg-amber-950 text-amber-300 border border-amber-800/40'
                      }`}>
                        {d.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-semibold line-clamp-2 leading-snug">{d.topic}</p>
                    <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-slate-500" />
                        {d.thread?.length || 0} answers
                      </span>
                      <span>{d.date || 'Active'}</span>
                    </div>
                  </div>
                );
              })}

              {filteredDoubts.length === 0 && (
                <div className="p-8 text-center text-slate-500 rounded-2xl bg-slate-950/40 border border-slate-800/40">
                  <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  <p className="text-xs">No previous doubts found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MAIN STUDIO AREA */}
        <div className={`${showHistoryDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-5 transition-all text-left`}>
          
          {/* ─── WHEN NO DOUBT IS ACTIVE: FOCUSED QUESTION STUDIO ─── */}
          {!activeDoubt && (
            <div className="rounded-3xl bg-[#0b0f19] border border-slate-800/80 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. Domain Selector Bar & Tutor Style Switcher */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase tracking-wider">Domain:</span>
                    {DOMAINS.map((sub) => (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => setSubject(sub)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                          subject === sub 
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold' 
                            : 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>

                  {/* Socratic vs Full Solution Toggle */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                    <button
                      type="button"
                      onClick={() => setTutorStyle('full')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        tutorStyle === 'full' 
                          ? 'bg-slate-800 text-cyan-300 shadow-sm' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Full Derivation
                    </button>
                    <button
                      type="button"
                      onClick={() => setTutorStyle('socratic')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        tutorStyle === 'socratic' 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Progressively reveals step-by-step so you learn actively"
                    >
                      <Lightbulb className="w-3 h-3 text-amber-400" />
                      <span>Socratic Tutor</span>
                    </button>
                  </div>
                </div>

                {/* 2. Math & Code Toolbar Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span>Ask Your Doubt</span>
                    <span className="text-[11px] text-slate-500 font-normal">(Drag & drop or Ctrl+V to attach screenshots)</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowMathBar(!showMathBar)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      showMathBar
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-950 hover:bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{showMathBar ? 'Hide Math Bar' : 'Math & Code Toolbar'}</span>
                  </button>
                </div>

                {/* Quick Math Symbols Insert Drawer */}
                {showMathBar && (
                  <div className="p-3 bg-slate-950 border border-cyan-500/30 rounded-2xl space-y-2 animate-fade-in shadow-inner">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase block">
                      Click symbol to insert LaTeX equation or code:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {MATH_QUICK_SYMBOLS.map((sym, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleInsertSymbol(sym.insert)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-cyan-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer active:scale-95"
                        >
                          {sym.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Textarea with Direct Clipboard Paste & Drag-and-Drop */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative rounded-2xl border transition-all ${
                    isDragging ? 'border-cyan-400 bg-cyan-950/20 ring-2 ring-cyan-500/30' : 'border-slate-800 bg-slate-950/70 focus-within:border-cyan-500/70'
                  }`}
                >
                  <textarea
                    ref={textareaRef}
                    value={doubtText}
                    onPaste={handlePaste}
                    onChange={(e) => setDoubtText(e.target.value)}
                    placeholder={getPlaceholder()}
                    rows="5"
                    className="w-full p-4 rounded-2xl bg-transparent text-sm text-slate-100 placeholder-slate-500 resize-none focus:outline-none font-sans"
                  />

                  {/* Mic Voice Dictation Button */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`p-2 rounded-xl transition-all cursor-pointer border ${
                        isListening 
                          ? 'bg-rose-500 text-white border-rose-400 animate-ping' 
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border-slate-800'
                      }`}
                      title={isListening ? 'Listening... click to stop' : 'Click to dictate doubt with voice'}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Attached Image Preview Pill */}
                  {previewUrl && (
                    <div className="m-3 p-2 rounded-xl bg-slate-900 border border-cyan-800/40 flex items-center justify-between gap-3 max-w-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={previewUrl} alt="Attached" className="w-9 h-9 object-cover rounded-lg border border-slate-700 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] text-cyan-400 font-bold block">Attached Problem Screenshot</span>
                          <span className="text-xs text-slate-300 truncate block">{uploadedFile?.name || 'Clipboard-Screenshot.png'}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearFile}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Real-Time KaTeX Math Live Preview Pill (Upgrade 4) */}
                {liveMathPreviewHtml && (
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 animate-fade-in text-center shadow-lg">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider block mb-1">
                      ⚡ Live Math Formula Preview:
                    </span>
                    <div 
                      className="overflow-x-auto text-cyan-200 text-sm sm:text-base font-serif"
                      dangerouslySetInnerHTML={{ __html: liveMathPreviewHtml }}
                    />
                  </div>
                )}

                {/* 5. Quick Starter Prompt Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Quick prompts:</span>
                  <button
                    type="button"
                    onClick={() => setDoubtText(prev => prev ? `${prev} - derive step-by-step with formulas` : 'Derive step-by-step with formulas: ')}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 text-[11px] transition-all cursor-pointer"
                  >
                    ⚡ Step-by-step Proof
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoubtText(prev => prev ? `${prev} - explain intuition simply with real-world analogy` : 'Explain the intuition simply with a real-world analogy: ')}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 text-[11px] transition-all cursor-pointer"
                  >
                    🧠 Intuitive Analogy
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoubtText(prev => prev ? `${prev} - find bug in this code and provide corrected implementation` : 'Find the bug in this code and provide corrected implementation: \n```\n\n```')}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 text-[11px] transition-all cursor-pointer"
                  >
                    🐞 Debug Code Error
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoubtText(prev => prev ? `${prev} - provide 10-mark university exam essay answer` : 'Provide standard 10-mark university exam answer for: ')}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 text-[11px] transition-all cursor-pointer"
                  >
                    📝 10-Mark Exam Model
                  </button>
                </div>

                {/* 6. Footer Actions: File Upload & Submit */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div>
                    <input
                      type="file"
                      id="problem-image-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="problem-image-upload"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{previewUrl ? 'Change Image' : 'Attach Textbook Image'}</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {(doubtText || previewUrl) && (
                      <button
                        type="button"
                        onClick={() => {
                          setDoubtText('');
                          clearFile();
                        }}
                        className="px-3 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white transition-all cursor-pointer"
                      >
                        Clear
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || (!doubtText.trim() && !imageBase64)}
                      className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSubmitting || (!doubtText.trim() && !imageBase64)
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                          : solverMode === 'ai'
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30 font-black active:scale-95'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 font-black active:scale-95'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin text-black" />
                          <span>Solving Step-by-Step...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{solverMode === 'ai' ? 'Solve Academic Doubt' : 'Send to Faculty'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            </div>
          )}

          {/* ─── WHEN A DOUBT IS ACTIVE: INTERACTIVE LIVE RESOLUTION CANVAS ─── */}
          {activeDoubt && (
            <div className="rounded-3xl bg-[#0b0f19] border border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col h-[750px] relative backdrop-blur-2xl">
              
              {/* Canvas Header */}
              <div className="p-4 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDoubt(null);
                      setDoubtText('');
                      clearFile();
                    }}
                    className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer mr-1"
                    title="Return to Question Studio"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                    activeDoubt.isHumanRequest ? 'bg-purple-950 text-purple-300 border border-purple-800/40' : 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                  }`}>
                    {activeDoubt.tag || 'Academic'}
                  </span>

                  <span className="text-xs font-bold text-white truncate">
                    {activeDoubt.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    activeDoubt.status === 'Resolved' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' 
                      : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                  }`}>
                    {activeDoubt.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleExportExamNote(activeDoubt)}
                    className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Save or Print as Exam Note PDF"
                  >
                    <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Exam Note</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Thread Body */}
              <div ref={chatScrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin">
                
                {/* 1. Original Question Card */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-black text-[11px] text-cyan-300">
                      Q
                    </div>
                    <span className="text-xs font-bold text-white">Problem Statement</span>
                    <span className="text-[10px] text-slate-500">• {activeDoubt.date || 'Today'}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed">
                    {activeDoubt.topic}
                  </p>

                  {/* Attached Image Thumbnail */}
                  {activeDoubt.hasImage && activeDoubt.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 mt-2 bg-black/40 max-h-[200px] flex items-center justify-center">
                      <img 
                        src={activeDoubt.imageUrl} 
                        alt="Attached problem" 
                        className="max-h-[200px] w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* 2. Resolutions and AI Answers with KaTeX & Socratic Reveal */}
                {activeDoubt.thread && activeDoubt.thread.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`p-5 rounded-2xl border space-y-3.5 shadow-lg ${
                      msg.isAI 
                        ? 'bg-gradient-to-b from-[#091122] via-[#09101d] to-[#070c17] border-cyan-500/30' 
                        : msg.isMentor
                          ? 'bg-purple-950/20 border-purple-500/30'
                          : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                          msg.isAI ? 'bg-cyan-500 text-slate-950 font-bold' : msg.isMentor ? 'bg-purple-500 text-white' : 'bg-slate-700 text-white'
                        }`}>
                          {msg.isAI ? 'AI' : msg.isMentor ? 'M' : 'S'}
                        </div>
                        <span className="text-xs font-bold text-white">{msg.author}</span>
                        {msg.isAI && (
                          <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800/40 px-2 py-0.5 rounded-full font-bold uppercase ml-1">
                            Verified Derivation
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Academic Markdown + KaTeX Renderer with Progressive Socratic Steps */}
                    {(msg.isAI || msg.author?.toLowerCase().includes('ai') || msg.author?.toLowerCase().includes('vyomra')) ? (
                      <AcademicSolutionRenderer 
                        content={msg.content} 
                        onAskFollowUp={handleQuickFollowUp}
                        onExportPdf={() => handleExportExamNote(activeDoubt)}
                        author={msg.author}
                        initialSocratic={activeDoubt.initialSocratic || false}
                      />
                    ) : (
                      <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                        {msg.content}
                      </div>
                    )}
                  </div>
                ))}

                {/* Computing Follow Up Animation */}
                {isFollowUpSubmitting && (
                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-3 animate-pulse">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="text-xs text-cyan-300 font-bold">Computing textbook derivation & formulas...</span>
                  </div>
                )}

                {activeDoubt.isHumanRequest && activeDoubt.status === 'Pending Review' && (!activeDoubt.thread || activeDoubt.thread.length === 0) && (
                  <div className="text-center p-8 bg-slate-950/40 border border-slate-800 rounded-2xl border-dashed space-y-2">
                    <User className="w-8 h-8 text-purple-400/60 mx-auto" />
                    <p className="text-xs text-slate-300 font-bold">A verified academic faculty member will review your query soon.</p>
                  </div>
                )}

              </div>

              {/* Interactive Follow-Up Input Footer */}
              <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 space-y-2.5">
                {/* Quick Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Follow-up:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickFollowUp("Can you generate 1 similar university exam practice question based on this topic with a hidden solution so I can test myself?")}
                    className="px-2 py-0.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/40 text-emerald-300 text-[10px] font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <BookOpen className="w-3 h-3 text-emerald-400" />
                    <span>Practice Similar Problem</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFollowUp("Can you explain this simpler in plain English with an intuitive real-world analogy?")}
                    className="px-2 py-0.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/40 text-cyan-300 text-[10px] font-bold shrink-0 transition-all cursor-pointer"
                  >
                    Explain Simpler
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFollowUp("Can you show an alternative formula or derivation method?")}
                    className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-bold shrink-0 transition-all cursor-pointer"
                  >
                    Alternative Method
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFollowUp("Please provide a runnable Python implementation of this algorithm with comments.")}
                    className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-bold shrink-0 transition-all cursor-pointer"
                  >
                    Python Code
                  </button>
                </div>

                {/* Follow-up Query Form */}
                <form onSubmit={handleFollowUpSubmit} className="relative">
                  <input
                    type="text"
                    value={followUpText}
                    onChange={(e) => setFollowUpText(e.target.value)}
                    placeholder={activeDoubt.isHumanRequest ? "Send follow-up query to your mentor..." : "Ask follow-up question, request simpler breakdown, or alternative proof..."}
                    disabled={isFollowUpSubmitting}
                    className="w-full py-2.5 pl-4 pr-12 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
                  />
                  <button 
                    type="submit"
                    disabled={isFollowUpSubmitting || !followUpText.trim()}
                    className={`absolute right-1.5 top-1.5 h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                      activeDoubt.isHumanRequest ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {isFollowUpSubmitting ? (
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
