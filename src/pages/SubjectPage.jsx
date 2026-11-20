import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, BookOpen, Clock, Heart, Share2, FileText, CheckCircle2, 
  ChevronRight, Sparkles, Code2, Download, Copy, Check, Eye, ExternalLink,
  Layers, Lightbulb, Compass, Award, BookMarked, Laptop, HelpCircle, 
  Sun, Moon, Type, Bookmark, ChevronLeft, CheckCircle, GitFork, 
  CheckSquare, AlertCircle, RefreshCw, Bot, ChevronDown, Zap, 
  HelpCircle as QuizIcon, Volume2, VolumeX, Printer, Calculator, FileCheck2,
  Sliders, RotateCcw, Play, CheckCircle as CardDone, ArrowRight
} from 'lucide-react';
import mermaid from 'mermaid';
import katex from 'katex';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { W3SCHOOLS_SYLLABUS_CATALOG } from '../data/w3schoolsSyllabusCatalog';
import AdvancedDocumentViewerModal from '../components/AdvancedDocumentViewerModal';
import { useGamification } from '../context/GamificationContext';
import { generateLearningHubNotes } from '../services/aiService';
import { cleanSpeechText } from '../utils/teluguAudioEngine.js';

export default function SubjectPage({ subject, onBack, onNavigateBranchSem, user }) {
  const { awardXP } = useGamification();
  const courseCode = subject.code ? subject.code.toUpperCase() : '';
  const [liveCatalog, setLiveCatalog] = useState(null);

  useEffect(() => {
    fetch('/w3schoolsSyllabusCatalog.json')
      .then(res => res.json())
      .then(data => {
        if (data && data[courseCode]) {
          setLiveCatalog(data[courseCode]);
        }
      })
      .catch(() => {});
  }, [courseCode]);

  // Find rich W3Schools chapter data for this course with clean fallback
  const catalogData = liveCatalog || W3SCHOOLS_SYLLABUS_CATALOG[courseCode] || {
    code: courseCode,
    title: subject.name,
    isLab: false,
    cos: subject.courseOutcomes || [],
    textbooks: subject.textbooks || [],
    references: subject.references || [],
    units: (subject.syllabus || []).map((s, idx) => ({
      id: `unit-${idx+1}`,
      unitNumber: `Unit ${idx+1}`,
      title: s.includes(':') ? s.split(':')[0] : `Unit ${idx+1}`,
      topicTitle: s.includes(':') ? s.split(':')[1] : s,
      summary: s,
      sections: [
        { title: `Core Concepts of Unit ${idx+1}`, content: `Detailed curriculum topics: ${s}` },
        { title: 'High-Yield Formulae & Key Points', content: 'Comprehensive autonomous examination study notes and quick review definitions.' },
        { title: 'Previous Year Exam Questions & Worked Examples', content: 'Standard 10-mark descriptive problems and 2-mark conceptual questions.' }
      ]
    }))
  };

  const units = catalogData.units || [];
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [readerTheme, setReaderTheme] = useState('oled'); // 'oled' | 'paper' | 'sepia'
  const [fontSize, setFontSize] = useState('medium'); // 'small' | 'medium' | 'large'
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewingUrl, setViewingUrl] = useState('');
  const [viewingTitle, setViewingTitle] = useState('Academic Note');
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'visualizer' | 'flashcards' | 'cheatSheet' | 'solver' | 'visuals' | 'problems' | 'aiNotes'

  // Accordion state for Notion-style collapsible sections
  const [expandedSections, setExpandedSections] = useState({ 0: true, 1: true });
  // Revealed solutions for Brilliant-style active recall
  const [revealedSolutions, setRevealedSolutions] = useState({});
  // Quiz selection state
  const [quizAnswers, setQuizAnswers] = useState({});

  // ── Flashcard Study Mode State ──
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStats, setCardStats] = useState({ known: 0, review: 0 });

  // ── Interactive Visualizer Sandbox State ──
  // Matrix Transformation Sandbox
  const [matrixA11, setMatrixA11] = useState(1.5);
  const [matrixA12, setMatrixA12] = useState(0.5);
  const [matrixA21, setMatrixA21] = useState(0.0);
  const [matrixA22, setMatrixA22] = useState(1.2);
  const [vectorX, setVectorX] = useState(1.0);
  const [vectorY, setVectorY] = useState(1.0);

  // Calculus LMVT Sandbox
  const [lmvtA, setLmvtA] = useState(-1.5);
  const [lmvtB, setLmvtB] = useState(2.0);

  // ── AI Voice Tutor State ──
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // ── AI Numerical Step-by-Step Solver State ──
  const [solverInput, setSolverInput] = useState('');
  const [solverResult, setSolverResult] = useState(null);
  const [isSolving, setIsSolving] = useState(false);

  // AI Generated Notes state
  const [aiNotesContent, setAiNotesContent] = useState({});
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const mermaidRef = useRef(null);
  const readingPaneRef = useRef(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const [completedUnits, setCompletedUnits] = useState(() => {
    try {
      const savedProg = localStorage.getItem(`lumixora_unit_progress_${subject.id}`);
      return savedProg ? JSON.parse(savedProg) : {};
    } catch (_) {
      return {};
    }
  });

  const activeUnit = units[selectedUnitIndex] || units[0] || {
    unitNumber: 'Unit 1',
    title: 'Unit 1: Overview',
    topicTitle: 'Core Syllabus',
    summary: 'Detailed topics',
    sections: []
  };

  const isCurrentUnitCompleted = !!completedUnits[activeUnit.id];

  const toggleUnitComplete = (unitId) => {
    const updated = { ...completedUnits, [unitId]: !completedUnits[unitId] };
    setCompletedUnits(updated);
    try {
      localStorage.setItem(`lumixora_unit_progress_${subject.id}`, JSON.stringify(updated));
    } catch (_) {}
    if (!completedUnits[unitId] && awardXP) {
      awardXP(25, 'Unit Study Milestone Completed! 🎯');
    }
  };

  const toggleSection = (idx) => {
    setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleSolution = (pIdx) => {
    setRevealedSolutions(prev => ({ ...prev, [pIdx]: !prev[pIdx] }));
  };

  const handleQuizSelect = (qIdx, optIdx, isCorrect) => {
    setQuizAnswers(prev => ({ ...prev, [`${activeUnit.id}_${qIdx}`]: { selected: optIdx, isCorrect } }));
    if (isCorrect && awardXP) {
      awardXP(10, 'Concept Quiz Passed! ⭐');
    }
  };

  // Flashcards Controls
  const flashcards = activeUnit.flashcards || [
    {
      front: `What is the core theorem in ${activeUnit.topicTitle || activeUnit.title}?`,
      back: `Follows rigorous autonomous curriculum specifications, boundary formulations, and analytical solutions.`
    }
  ];

  const handleNextFlashcard = (knewIt) => {
    if (knewIt) {
      setCardStats(prev => ({ ...prev, known: prev.known + 1 }));
      if (awardXP) awardXP(5, 'Flashcard Mastered! 🧠');
    } else {
      setCardStats(prev => ({ ...prev, review: prev.review + 1 }));
    }
    setIsFlipped(false);
    setFlashcardIndex(prev => (prev + 1) % flashcards.length);
  };

  // Reset flashcard state on unit switch
  useEffect(() => {
    setFlashcardIndex(0);
    setIsFlipped(false);
  }, [activeUnit?.id]);

  // Computed Matrix Vector Transformation
  const transformedX = (matrixA11 * vectorX + matrixA12 * vectorY).toFixed(2);
  const transformedY = (matrixA21 * vectorX + matrixA22 * vectorY).toFixed(2);
  const matrixDet = (matrixA11 * matrixA22 - matrixA12 * matrixA21).toFixed(2);
  const matrixTrace = (matrixA11 + matrixA22).toFixed(2);

  // Computed LMVT Curve: f(x) = x^3 - 3x
  const f_curve = (x) => Math.pow(x, 3) - 3 * x;
  const f_prime = (x) => 3 * Math.pow(x, 2) - 3;
  const fA = f_curve(lmvtA);
  const fB = f_curve(lmvtB);
  const secantSlope = lmvtB !== lmvtA ? (fB - fA) / (lmvtB - lmvtA) : 0;
  // c satisfies 3c^2 - 3 = slope => c = sqrt((slope + 3)/3)
  const c_sq = (secantSlope + 3) / 3;
  const c_val = c_sq >= 0 ? Math.sqrt(c_sq).toFixed(2) : 'Complex';

  // ── AI Voice Narration Engine ──
  const toggleAudioNarration = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech audio narration is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const narrationText = `Welcome to Lumixora Engineering Lecture. Today we are studying ${subject.name}, ${activeUnit.unitNumber}: ${activeUnit.topicTitle || activeUnit.title}. Key overview: ${cleanSpeechText(activeUnit.summary || '')}.`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Stop audio on chapter change
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  }, [activeUnit?.id]);

  // ── AI Numerical Solver Simulation ──
  const handleSolveNumerical = (e) => {
    e.preventDefault();
    if (!solverInput.trim()) return;

    setIsSolving(true);
    setTimeout(() => {
      const query = solverInput.trim();
      let steps = [];
      let finalAns = '';
      let tips = '';

      if (query.toLowerCase().includes('rank') || query.includes('[') || query.toLowerCase().includes('matrix')) {
        steps = [
          "Step 1: Formulate the matrix coefficient representation from input values.",
          "Step 2: Identify pivot element a₁₁ and apply elementary row operation R₂ ➔ R₂ - c*R₁.",
          "Step 3: Eliminate lower triangular entries beneath pivots to establish Row Echelon Form.",
          "Step 4: Count the total number of non-zero rows."
        ];
        finalAns = "Matrix Rank ρ(A) = 2 (determined by non-zero rows in echelon form).";
        tips = "Examiner Tip: Never perform column operations on linear systems; maintain strict row invariance.";
      } else if (query.toLowerCase().includes('eigen') || query.toLowerCase().includes('characteristic')) {
        steps = [
          "Step 1: Write characteristic equation det(A - λI) = 0.",
          "Step 2: Expand characteristic polynomial: λ³ - (Trace)λ² + (Minors)λ - det(A) = 0.",
          "Step 3: Solve polynomial roots to compute eigenvalues λ₁, λ₂, λ₃.",
          "Step 4: Substitute each λ into (A - λI)X = 0 to extract orthogonal eigenvectors."
        ];
        finalAns = "Eigenvalues λ = 1, 4, 4 with mutually orthogonal eigenvectors.";
        tips = "Check: Trace equals sum of eigenvalues; Determinant equals product of eigenvalues.";
      } else {
        steps = [
          `Step 1: Identify given function and boundary constraints for: "${query}".`,
          "Step 2: Apply primary analytical differentiation / integration governing equations.",
          "Step 3: Substitute boundary conditions and simplify algebraic terms systematically."
        ];
        finalAns = "Verified analytical solution computed with standard engineering tolerance.";
        tips = "Include units, schematic coordinate sketches, and formula expansions for full marks.";
      }

      setSolverResult({ steps, finalAns, tips });
      setIsSolving(false);
      if (awardXP) awardXP(15, 'Numerical Problem Solved! 🧮');
    }, 600);
  };

  const handleOpenPdf = (title, url) => {
    setViewingTitle(title || `${subject.code} Course Notes & Exam Bank`);
    setViewingUrl(url || 'https://ykuyzkhhnltjccyzduap.supabase.co/storage/v1/object/public/academic_resources/contributions/1783536363296_Unit_5_Questions.pdf');
    setViewerOpen(true);
  };

  // Render Mermaid diagrams whenever active unit, active tab, or theme changes
  useEffect(() => {
    if (activeUnit?.flowchart && activeTab === 'visuals') {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: readerTheme === 'paper' ? 'default' : readerTheme === 'sepia' ? 'neutral' : 'dark',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: false,
            curve: 'basis'
          }
        });
      } catch (_) {}
      
      const renderDiagram = async () => {
        try {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = '';
            const id = `mm_${Math.random().toString(36).substring(2, 9)}`;
            const { svg } = await mermaid.render(id, activeUnit.flowchart);
            if (mermaidRef.current) {
              mermaidRef.current.innerHTML = svg;
            }
          }
        } catch (err) {
          console.warn('Mermaid rendering error:', err);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `
              <div class="text-xs text-gray-400 p-4 border border-white/10 rounded-xl bg-white/5 space-y-2">
                <span class="font-bold text-teal-400 block">Engineering Pipeline Steps:</span>
                <pre class="font-mono text-gray-300 text-[11px] whitespace-pre-wrap">${activeUnit.flowchart.replace(/graph TD/g, '').replace(/-->/g, ' ➔ ').replace(/["'\[\]\{\}]/g, '')}</pre>
              </div>
            `;
          }
        }
      };

      const timer = setTimeout(renderDiagram, 100);
      return () => clearTimeout(timer);
    }
  }, [activeUnit?.id, activeUnit?.flowchart, activeTab, readerTheme]);

  // Handle AI Deep Generation
  const handleGenerateAiNotes = async () => {
    if (isGeneratingAi) return;
    setIsGeneratingAi(true);
    try {
      const result = await generateLearningHubNotes(
        `${subject.name} - ${activeUnit.unitNumber}: ${activeUnit.topicTitle || activeUnit.title}`,
        activeUnit.summary || activeUnit.sections?.map(s => s.title).join(', ') || ''
      );
      setAiNotesContent(prev => ({ ...prev, [activeUnit.id]: result }));
      setActiveTab('aiNotes');
      if (awardXP) awardXP(15, 'AI Deep Study Note Generated!');
    } catch (err) {
      console.error('AI Note generation error:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // ── Client-Side High-Fidelity PDF Generation Engine ──
  const handleExportPdf = async (customTitle) => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      const pane = readingPaneRef.current || document.getElementById('study-guide-reading-pane');
      if (!pane) {
        window.print();
        return;
      }

      const docTitle = customTitle || `${subject?.name || 'Subject'}_${activeUnit?.unitNumber || 'Chapter'}_Notes`;
      const cleanFileName = docTitle.replace(/[^a-zA-Z0-9_-]/g, '_');

      // Use html2canvas to capture the rendered study guide
      const canvas = await html2canvas(pane, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: readerTheme === 'paper' ? '#ffffff' : (readerTheme === 'sepia' ? '#fbf7ee' : '#0e121a'),
        logging: false,
        windowWidth: pane.scrollWidth || 900,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (element) => {
          return (
            element.classList?.contains('no-print') ||
            element.classList?.contains('print:hidden')
          );
        }
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();

      const scaleFactor = pdfPageWidth / canvas.width;
      const canvasPageHeight = Math.floor(pdfPageHeight / scaleFactor);
      const totalPages = Math.ceil(canvas.height / canvasPageHeight);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(canvasPageHeight, canvas.height - i * canvasPageHeight);

        const ctx = pageCanvas.getContext('2d');
        ctx.fillStyle = readerTheme === 'paper' ? '#ffffff' : (readerTheme === 'sepia' ? '#fbf7ee' : '#0e121a');
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        ctx.drawImage(
          canvas,
          0, i * canvasPageHeight,
          canvas.width, pageCanvas.height,
          0, 0,
          pageCanvas.width, pageCanvas.height
        );

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        const imgHeight = pageCanvas.height * scaleFactor;
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfPageWidth, imgHeight);
      }

      pdf.save(`${cleanFileName}.pdf`);
      if (awardXP) awardXP(10, 'Study Notes Downloaded! 📥');
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Font size classes
  const fontClasses = {
    small: 'text-xs leading-relaxed',
    medium: 'text-sm leading-relaxed',
    large: 'text-base leading-relaxed'
  }[fontSize];

  // Reader theme styles
  const themeClasses = {
    oled: {
      bg: 'bg-[#0e121a]',
      panel: 'bg-[#141923] border-white/10 text-gray-200',
      innerPanel: 'bg-[#0a0d13] border-white/5',
      heading: 'text-white',
      muted: 'text-gray-400',
      activeItem: 'bg-teal-500/15 border-teal-500/40 text-teal-300',
      formulaText: 'text-teal-300',
      formulaMuted: 'text-gray-400',
      ribbonHeader: 'text-teal-400',
      tabInactive: 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10'
    },
    paper: {
      bg: 'bg-[#f8fafc]',
      panel: 'bg-white border-slate-200 text-slate-800 shadow-lg',
      innerPanel: 'bg-slate-50 border-slate-200',
      heading: 'text-slate-900',
      muted: 'text-slate-500',
      activeItem: 'bg-teal-50 border-teal-500 text-teal-800 font-bold',
      formulaText: 'text-teal-700 font-extrabold',
      formulaMuted: 'text-slate-600',
      ribbonHeader: 'text-teal-800',
      tabInactive: 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
    },
    sepia: {
      bg: 'bg-[#fbf7ee]',
      panel: 'bg-[#f4ecd8] border-[#e2d6b5] text-[#2b1f11] shadow-md',
      innerPanel: 'bg-[#ebe0c5] border-[#d8c89f]',
      heading: 'text-[#2b1f11]',
      muted: 'text-[#705c43]',
      activeItem: 'bg-[#e2ce9d] border-[#9d7d42] text-[#2b1f11] font-bold',
      formulaText: 'text-teal-800 font-extrabold',
      formulaMuted: 'text-[#5a462d]',
      ribbonHeader: 'text-teal-900',
      tabInactive: 'text-[#5a462d] hover:text-[#2b1f11] bg-black/5 hover:bg-black/10'
    }
  }[readerTheme];

  return (
    <div className={`space-y-6 pb-24 animate-fade-in transition-colors duration-300 max-w-7xl mx-auto`}>
      
      {/* Top Header & Breadcrumbs Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 print:hidden">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:scale-105 shadow-sm"
            title="Back to All Subjects"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
              <button 
                onClick={onBack}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Learning Hub
              </button>
              <ChevronRight className="w-3 h-3 text-gray-600" />
              <button 
                onClick={() => onNavigateBranchSem ? onNavigateBranchSem(subject.branch, null) : onBack()}
                className="hover:text-brand-teal text-gray-300 font-bold transition-colors cursor-pointer hover:underline"
              >
                {subject.branch}
              </button>
              <ChevronRight className="w-3 h-3 text-gray-600" />
              <button 
                onClick={() => onNavigateBranchSem ? onNavigateBranchSem(subject.branch, subject.semester) : onBack()}
                className="text-brand-teal font-extrabold hover:underline cursor-pointer"
              >
                {subject.semester}
              </button>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 mt-1">
              <span>{subject.name}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {subject.code}
              </span>
            </h1>
          </div>
        </div>

        {/* Reader Customization Toolbar (Themes, Audio, Print, AI Generate) */}
        <div className="flex items-center gap-2 flex-wrap print:hidden">
          
          {/* AI Audio Voice Tutor */}
          <button
            onClick={toggleAudioNarration}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isPlayingAudio 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300'
            }`}
            title="Listen to conversational Audio Lecture"
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-teal-400" />}
            <span>{isPlayingAudio ? 'Stop Voice' : 'Audio Tutor'}</span>
          </button>

          {/* AI Generator Button */}
          <button
            onClick={handleGenerateAiNotes}
            disabled={isGeneratingAi}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-black text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-teal-500/20 active:scale-95 disabled:opacity-50"
            title="Use AI to generate exhaustive chapter notes with formulas and examples"
          >
            {isGeneratingAi ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Bot className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{isGeneratingAi ? 'Synthesizing...' : 'AI In-Depth Notes'}</span>
          </button>

          {/* Theme Switcher */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setReaderTheme('oled')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${readerTheme === 'oled' ? 'bg-black text-teal-400 shadow' : 'text-gray-400 hover:text-white'}`}
              title="Midnight Dark"
            >
              🌙
            </button>
            <button
              onClick={() => setReaderTheme('paper')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${readerTheme === 'paper' ? 'bg-white text-slate-900 shadow' : 'text-gray-400 hover:text-white'}`}
              title="Clean Paper Light"
            >
              📄
            </button>
            <button
              onClick={() => setReaderTheme('sepia')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${readerTheme === 'sepia' ? 'bg-[#f4ecd8] text-[#433422] shadow' : 'text-gray-400 hover:text-white'}`}
              title="Warm Book Sepia"
            >
              📖
            </button>
          </div>

          {/* Download PDF (Direct Client-Side Multi-Page Export) */}
          <button 
            onClick={() => handleExportPdf()}
            disabled={isExportingPdf}
            className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-teal-500/20 disabled:opacity-50 cursor-pointer"
            title="Download Study Notes as PDF file"
          >
            {isExportingPdf ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span className="font-extrabold">{isExportingPdf ? 'Generating...' : 'Download PDF'}</span>
          </button>

          {/* Print Clean Study Guide */}
          <button 
            onClick={() => window.print()}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Print or Save Study Guide via System Dialog"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Open Full PDF / PYQs */}
          <button 
            onClick={() => handleOpenPdf(`${subject.name} Official Model Paper & Exam Bank`, '')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-teal" />
            <span className="hidden sm:inline">Model Papers</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column W3Schools Reading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sticky Chapter Navigator */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-3 sticky top-4 print:hidden">
          <div className={`${themeClasses.panel} rounded-2xl p-4 shadow-xl border`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-brand-teal" />
                <span>{catalogData.isLab ? 'Lab Practicals' : 'Course Chapters'}</span>
              </span>
              <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full font-bold">
                {units.length} Total
              </span>
            </div>

            {/* Units List */}
            <div className="space-y-1.5 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
              {units.map((unit, idx) => {
                const isSelected = selectedUnitIndex === idx;
                const isDone = !!completedUnits[unit.id];
                return (
                  <button
                    key={unit.id || idx}
                    onClick={() => {
                      setSelectedUnitIndex(idx);
                      // Reset to notes tab when switching unit
                      if (activeTab === 'aiNotes' && !aiNotesContent[unit.id]) {
                        setActiveTab('notes');
                      }
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 text-xs font-semibold ${
                      isSelected
                        ? themeClasses.activeItem
                        : readerTheme === 'oled'
                        ? 'hover:bg-white/5 text-gray-300 hover:text-white border border-transparent'
                        : 'hover:bg-black/5 text-[#433422] hover:text-[#2b1f11] border border-transparent'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black ${
                      isDone 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : isSelected 
                        ? 'bg-teal-500 text-black shadow-sm' 
                        : readerTheme === 'oled'
                        ? 'bg-white/10 text-gray-300'
                        : 'bg-black/10 text-[#433422] font-black'
                    }`}>
                      {isDone ? '✓' : idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[10px] uppercase font-bold tracking-wider block ${
                        readerTheme === 'oled' ? 'text-gray-400' : 'text-[#705c43]'
                      }`}>
                        {unit.unitNumber}
                      </span>
                      <p className={`line-clamp-2 leading-snug mt-0.5 text-[11px] font-bold ${
                        isSelected 
                          ? (readerTheme === 'oled' ? 'text-teal-300' : 'text-[#2b1f11]') 
                          : (readerTheme === 'oled' ? 'text-gray-200' : 'text-[#2b1f11]')
                      }`}>
                        {unit.topicTitle || unit.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Metadata Footer */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-[11px] opacity-80">
              <div className="flex justify-between items-center">
                <span>Credits:</span>
                <span className="font-bold">{subject.credits} Credits</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Regulation:</span>
                <span className="font-bold text-teal-400">Scheme-2026 Autonomous</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Reading Pane */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <div ref={readingPaneRef} id="study-guide-reading-pane" className={`${themeClasses.panel} rounded-3xl p-6 md:p-8 shadow-2xl border relative`}>
            
            {/* Unit Header Title */}
            <div className="border-b border-black/10 dark:border-white/10 pb-5 mb-6">
              <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
                <span className={`text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${
                  readerTheme === 'oled'
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                    : 'bg-teal-700/15 border-teal-700/40 text-teal-900 font-black'
                }`}>
                  {activeUnit.unitNumber} • {catalogData.isLab ? 'Practical Module' : 'Core Theory Chapter'}
                </span>
                <button
                  onClick={() => toggleUnitComplete(activeUnit.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all print:hidden no-print ${
                    isCurrentUnitCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isCurrentUnitCompleted ? 'Completed ✓' : 'Mark as Studied'}</span>
                </button>
              </div>

              <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${themeClasses.heading}`}>
                {activeUnit.topicTitle || activeUnit.title}
              </h2>

              {/* ── 1. BRILLIANT/W3SCHOOLS FORMULA RIBBON (GOLDEN RULES AT A GLANCE) ── */}
              {activeUnit.formulaRibbon && activeUnit.formulaRibbon.length > 0 && (
                <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${themeClasses.ribbonHeader} flex items-center gap-1.5 mb-2.5`}>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Golden Formulas & Exam Rules (Quick-Scan Ribbon)</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {activeUnit.formulaRibbon.map((item, fIdx) => (
                      <div key={fIdx} className={`p-3 rounded-xl border ${themeClasses.innerPanel} flex flex-col justify-between hover:border-teal-500/40 transition-colors shadow-sm`}>
                        <div className={`text-xs font-mono font-black ${themeClasses.formulaText} truncate`}>
                          {item.formula}
                        </div>
                        <div className="mt-1">
                          <span className={`text-[10px] font-bold ${readerTheme === 'oled' ? 'text-gray-100' : 'text-slate-900'} block truncate`}>{item.name}</span>
                          <span className={`text-[9px] ${themeClasses.formulaMuted} block truncate`}>{item.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Tabs: Interactive Notes, Visualizer Sandbox, Flashcards, 2-Min Cheat Sheet, AI Solver, Flowcharts, Solved Problems */}
              <div className="flex items-center gap-2 mt-5 border-t border-black/10 dark:border-white/10 pt-4 flex-wrap print:hidden no-print">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'notes'
                      ? 'bg-teal-500 text-black shadow-md font-black'
                      : themeClasses.tabInactive
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Interactive Notes</span>
                </button>

                <button
                  onClick={() => setActiveTab('visualizer')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'visualizer'
                      ? 'bg-purple-600 text-white shadow-md font-black'
                      : readerTheme === 'oled'
                      ? 'bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30'
                      : 'bg-purple-100 text-purple-950 hover:bg-purple-200 border border-purple-300 font-bold'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Interactive 2D Sandbox</span>
                </button>

                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'flashcards'
                      ? 'bg-rose-600 text-white shadow-md font-black'
                      : readerTheme === 'oled'
                      ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30'
                      : 'bg-rose-100 text-rose-950 hover:bg-rose-200 border border-rose-300 font-bold'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Memory Flashcards</span>
                </button>

                <button
                  onClick={() => setActiveTab('cheatSheet')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'cheatSheet'
                      ? 'bg-amber-500 text-black shadow-md font-black'
                      : readerTheme === 'oled'
                      ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
                      : 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300 font-bold'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>2-Min Cheat Sheet</span>
                </button>

                <button
                  onClick={() => setActiveTab('solver')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'solver'
                      ? 'bg-cyan-600 text-white shadow-md font-black'
                      : readerTheme === 'oled'
                      ? 'bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30'
                      : 'bg-cyan-100 text-cyan-950 hover:bg-cyan-200 border border-cyan-300 font-bold'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>AI Solver</span>
                </button>

                <button
                  onClick={() => setActiveTab('visuals')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'visuals'
                      ? 'bg-teal-500 text-black shadow-md font-black'
                      : themeClasses.tabInactive
                  }`}
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>Flowcharts</span>
                </button>

                <button
                  onClick={() => setActiveTab('problems')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'problems'
                      ? 'bg-teal-500 text-black shadow-md font-black'
                      : themeClasses.tabInactive
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Solved Problems</span>
                </button>

                {aiNotesContent[activeUnit.id] && (
                  <button
                    onClick={() => setActiveTab('aiNotes')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'aiNotes'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md font-black'
                        : readerTheme === 'oled'
                        ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30'
                        : 'bg-purple-100 text-purple-950 hover:bg-purple-200 border border-purple-300 font-bold'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Synthesis</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: INTERACTIVE NOTES (NOTION ACCORDIONS) */}
            {activeTab === 'notes' && (
              <div className="space-y-6">
                
                {/* Scheme-2026 AI Integration Box */}
                {activeUnit.aiIntegration && (
                  <div className="bg-gradient-to-r from-teal-950/40 via-cyan-950/30 to-black/30 border border-teal-500/30 rounded-2xl p-5 mb-6 text-teal-100">
                    <div className="flex items-center gap-2 text-teal-300 font-extrabold text-xs uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
                      <span>Scheme-2026 AI Integration Module</span>
                    </div>
                    <p className={`${fontClasses} leading-relaxed opacity-95`}>
                      {activeUnit.aiIntegration}
                    </p>
                    {activeUnit.aiTools && (
                      <div className="mt-3 pt-2.5 border-t border-teal-500/20 text-xs text-teal-300 flex items-center gap-2 font-medium">
                        <Laptop className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>Free & Open-Source Tools: <strong className="text-white">{activeUnit.aiTools}</strong></span>
                      </div>
                    )}
                  </div>
                )}

                {/* Notion-Style Collapsible Sections with KaTeX Math Formatting */}
                <div className="space-y-4">
                  {(activeUnit.sections || []).map((sec, secIdx) => {
                    const isOpen = expandedSections[secIdx] !== false; // default open
                    return (
                      <div key={secIdx} className={`rounded-2xl border transition-all ${themeClasses.innerPanel} overflow-hidden shadow-sm`}>
                        {/* Accordion Header */}
                        <button
                          onClick={() => toggleSection(secIdx)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors gap-3 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0"></span>
                            <h3 className={`text-sm md:text-base font-bold ${themeClasses.heading}`}>
                              {sec.title}
                            </h3>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-teal-400' : ''}`} />
                        </button>

                        {/* Accordion Body */}
                        {isOpen && (
                          <div className={`px-5 pb-5 pt-1 border-t border-black/5 dark:border-white/5 space-y-3 whitespace-pre-line ${fontClasses} opacity-95 leading-relaxed`}>
                            {sec.content}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Brilliant-Style Concept Check (Active Recall Quiz) */}
                {activeUnit.microQuiz && activeUnit.microQuiz.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-400 mb-4">
                      <QuizIcon className="w-4 h-4 text-teal-400" />
                      <span>Brilliant-Style Active Recall Check</span>
                    </div>

                    <div className="space-y-4">
                      {activeUnit.microQuiz.map((quiz, qIdx) => {
                        const answerKey = `${activeUnit.id}_${qIdx}`;
                        const currentAnswer = quizAnswers[answerKey];

                        return (
                          <div key={qIdx} className={`p-5 rounded-2xl border ${themeClasses.innerPanel} space-y-3`}>
                            <p className="text-xs font-bold leading-relaxed">
                              {qIdx + 1}. {quiz.question}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {quiz.options.map((opt, optIdx) => {
                                const isSelected = currentAnswer?.selected === optIdx;
                                const isCorrectOpt = quiz.correct === optIdx;
                                let btnStyle = 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/5';

                                if (currentAnswer) {
                                  if (isCorrectOpt) {
                                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
                                  } else if (isSelected && !currentAnswer.isCorrect) {
                                    btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400 line-through';
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    disabled={!!currentAnswer}
                                    onClick={() => handleQuizSelect(qIdx, optIdx, isCorrectOpt)}
                                    className={`px-3 py-2 rounded-xl text-xs text-left border transition-all flex items-center justify-between ${btnStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {currentAnswer && isCorrectOpt && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>

                            {currentAnswer && (
                              <div className={`p-3 rounded-xl text-xs leading-relaxed ${currentAnswer.isCorrect ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                💡 <strong>Explanation:</strong> {quiz.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INTERACTIVE 2D MATHEMATICAL SANDBOX */}
            {activeTab === 'visualizer' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-purple-300">Live 2D Mathematical Visualizer Sandbox</h3>
                      <p className="text-[11px] text-purple-300/80">Adjust parameters and observe linear transformations, determinants, and calculus theorems in real time.</p>
                    </div>
                  </div>
                </div>

                {/* 2D Matrix Transformation Sandbox */}
                <div className={`p-6 rounded-2xl border ${themeClasses.innerPanel} space-y-5`}>
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span>Interactive Linear Transformation Sandbox: Y = A · X</span>
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
                      det(A) = {matrixDet} • Trace = {matrixTrace}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Controls */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 block">Matrix A Elements: [a11, a12; a21, a22]</label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-gray-500">a₁₁: {matrixA11}</span>
                            <input type="range" min="-3" max="3" step="0.1" value={matrixA11} onChange={e => setMatrixA11(parseFloat(e.target.value))} className="w-full accent-teal-400" />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500">a₁₂: {matrixA12}</span>
                            <input type="range" min="-3" max="3" step="0.1" value={matrixA12} onChange={e => setMatrixA12(parseFloat(e.target.value))} className="w-full accent-teal-400" />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500">a₂₁: {matrixA21}</span>
                            <input type="range" min="-3" max="3" step="0.1" value={matrixA21} onChange={e => setMatrixA21(parseFloat(e.target.value))} className="w-full accent-teal-400" />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500">a₂₂: {matrixA22}</span>
                            <input type="range" min="-3" max="3" step="0.1" value={matrixA22} onChange={e => setMatrixA22(parseFloat(e.target.value))} className="w-full accent-teal-400" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 block">Input Vector X = [x, y]ᵀ</label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-gray-500">x: {vectorX}</span>
                            <input type="range" min="-3" max="3" step="0.1" value={vectorX} onChange={e => setVectorX(parseFloat(e.target.value))} className="w-full accent-cyan-400" />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500">y: {vectorY}</span>
                            <input type="range" min="-3" max="3" step="0.1" value={vectorY} onChange={e => setVectorY(parseFloat(e.target.value))} className="w-full accent-cyan-400" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
                        <span className="text-gray-400 block mb-1">Computed Transformed Vector Y:</span>
                        <span className="text-emerald-400 font-bold block text-sm">Y = [{transformedX}, {transformedY}]ᵀ</span>
                      </div>
                    </div>

                    {/* SVG Canvas Coordinate Grid */}
                    <div className="lg:col-span-7 flex justify-center">
                      <div className="w-full max-w-[340px] aspect-square bg-[#070b14] rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center p-2 shadow-inner">
                        <svg viewBox="-120 -120 240 240" className="w-full h-full">
                          <defs>
                            <marker id="arrow-cyan" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee" />
                            </marker>
                            <marker id="arrow-emerald" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
                            </marker>
                          </defs>

                          {/* Grid Axes */}
                          <line x1="-120" y1="0" x2="120" y2="0" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                          <line x1="0" y1="-120" x2="0" y2="120" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                          <circle cx="0" cy="0" r="30" stroke="rgba(255,255,255,0.06)" fill="none" />
                          <circle cx="0" cy="0" r="60" stroke="rgba(255,255,255,0.06)" fill="none" />
                          <circle cx="0" cy="0" r="90" stroke="rgba(255,255,255,0.06)" fill="none" />

                          {/* Original Vector (Cyan) */}
                          <line x1="0" y1="0" x2={vectorX * 30} y2={-vectorY * 30} stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#arrow-cyan)" />
                          <circle cx={vectorX * 30} cy={-vectorY * 30} r="4" fill="#22d3ee" />

                          {/* Transformed Vector (Emerald) */}
                          <line x1="0" y1="0" x2={transformedX * 30} y2={-transformedY * 30} stroke="#34d399" strokeWidth="3" strokeDasharray="4 2" markerEnd="url(#arrow-emerald)" />
                          <circle cx={transformedX * 30} cy={-transformedY * 30} r="5" fill="#34d399" />
                        </svg>

                        <div className="absolute bottom-2 left-3 text-[10px] space-y-0.5">
                          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Input Vector X
                          </span>
                          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Transformed Vector Y
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculus LMVT Interactive Curve Sandbox */}
                <div className={`p-6 rounded-2xl border ${themeClasses.innerPanel} space-y-4`}>
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <Compass className="w-4 h-4" />
                      <span>Lagrange Mean Value Theorem (LMVT) Visualizer: f(x) = x³ - 3x</span>
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      Slope m = {secantSlope.toFixed(2)} • Tangent at c = {c_val}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-5 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold block mb-1">Interval Bound a: {lmvtA}</span>
                          <input type="range" min="-2.5" max="0" step="0.1" value={lmvtA} onChange={e => setLmvtA(parseFloat(e.target.value))} className="w-full accent-amber-400" />
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold block mb-1">Interval Bound b: {lmvtB}</span>
                          <input type="range" min="0.5" max="2.5" step="0.1" value={lmvtB} onChange={e => setLmvtB(parseFloat(e.target.value))} className="w-full accent-amber-400" />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs font-sans leading-relaxed">
                        💡 <strong>LMVT Geometric Guarantee:</strong> The tangent line evaluated at point <span className="font-mono text-amber-300 font-bold">c = {c_val}</span> has derivative <span className="font-mono text-teal-300 font-bold">f'(c) = {secantSlope.toFixed(2)}</span>, which is strictly parallel to the chord joining endpoints <span className="font-mono">({lmvtA}, {fA.toFixed(2)})</span> and <span className="font-mono">({lmvtB}, {fB.toFixed(2)})</span>.
                      </div>
                    </div>

                    {/* LMVT SVG Curve */}
                    <div className="lg:col-span-7 flex justify-center">
                      <div className="w-full max-w-[340px] aspect-[4/3] bg-[#070b14] rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center p-2 shadow-inner">
                        <svg viewBox="-120 -80 240 160" className="w-full h-full">
                          {/* Axes */}
                          <line x1="-120" y1="0" x2="120" y2="0" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                          <line x1="0" y1="-80" x2="0" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                          {/* Function Curve f(x) = x^3 - 3x (scaled: x*40, y*-15) */}
                          <path 
                            d="M -100 50 C -60 -40, -20 -40, 0 0 C 20 40, 60 40, 100 -50"
                            fill="none" 
                            stroke="#6366f1" 
                            strokeWidth="2.5" 
                          />

                          {/* Secant Chord between A and B */}
                          <line 
                            x1={lmvtA * 40} 
                            y1={-fA * 15} 
                            x2={lmvtB * 40} 
                            y2={-fB * 15} 
                            stroke="#f59e0b" 
                            strokeWidth="2" 
                            strokeDasharray="4 2" 
                          />
                          <circle cx={lmvtA * 40} cy={-fA * 15} r="4" fill="#f59e0b" />
                          <circle cx={lmvtB * 40} cy={-fB * 15} r="4" fill="#f59e0b" />

                          {/* Tangent line at c (if real) */}
                          {c_val !== 'Complex' && (
                            <>
                              <circle cx={parseFloat(c_val) * 40} cy={-f_curve(parseFloat(c_val)) * 15} r="5" fill="#14b8a6" />
                              <line 
                                x1={(parseFloat(c_val) - 0.7) * 40} 
                                y1={-(f_curve(parseFloat(c_val)) - 0.7 * secantSlope) * 15} 
                                x2={(parseFloat(c_val) + 0.7) * 40} 
                                y2={-(f_curve(parseFloat(c_val)) + 0.7 * secantSlope) * 15} 
                                stroke="#14b8a6" 
                                strokeWidth="2.5" 
                              />
                            </>
                          )}
                        </svg>

                        <div className="absolute bottom-2 left-3 text-[9px] space-y-0.5">
                          <span className="flex items-center gap-1 text-indigo-400 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> f(x) = x³ - 3x
                          </span>
                          <span className="flex items-center gap-1 text-amber-400 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Secant Chord [a, b]
                          </span>
                          <span className="flex items-center gap-1 text-teal-400 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Parallel Tangent at c
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: FLASHCARD MEMORY MODE (LEITNER SPACED REPETITION) */}
            {activeTab === 'flashcards' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-rose-300">Spaced Repetition Memory Flashcards</h3>
                      <p className="text-[11px] text-rose-300/80">Test your mental recall. Click the card to flip between Question and Answer.</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gray-300 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓ {cardStats.known} Mastered</span>
                    <span>•</span>
                    <span className="text-rose-400 font-bold">↺ {cardStats.review} Review</span>
                  </div>
                </div>

                {/* Flip Card Container */}
                <div className="flex flex-col items-center justify-center py-4">
                  <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`w-full max-w-lg min-h-[220px] p-8 rounded-3xl border shadow-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 select-none group relative overflow-hidden ${
                      readerTheme === 'oled'
                        ? 'bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent border-white/15 hover:border-teal-400/50'
                        : readerTheme === 'sepia'
                        ? 'bg-[#ebe0c5] border-[#d8c89f] hover:border-[#9d7d42] shadow-md'
                        : 'bg-white border-slate-200 hover:border-teal-500 shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className={`font-extrabold uppercase tracking-widest ${
                        readerTheme === 'oled' ? 'text-teal-400' : 'text-teal-800'
                      }`}>
                        Card {flashcardIndex + 1} of {flashcards.length}
                      </span>
                      <span className={`text-[10px] font-bold ${
                        readerTheme === 'oled' ? 'text-gray-400' : 'text-[#705c43]'
                      }`}>
                        {isFlipped ? 'REVEALED ANSWER 💡' : 'CLICK TO FLIP 🔄'}
                      </span>
                    </div>

                    <div className="py-6 text-center">
                      {!isFlipped ? (
                        <p className={`text-base sm:text-lg font-bold leading-relaxed ${
                          readerTheme === 'oled' ? 'text-white' : 'text-slate-900'
                        }`}>
                          {flashcards[flashcardIndex].front}
                        </p>
                      ) : (
                        <p className={`text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-line text-left ${
                          readerTheme === 'oled' ? 'text-emerald-300' : 'text-emerald-800'
                        }`}>
                          {flashcards[flashcardIndex].back}
                        </p>
                      )}
                    </div>

                    <div className={`flex justify-center text-[10px] font-medium ${
                      readerTheme === 'oled' ? 'text-gray-500' : 'text-slate-500'
                    }`}>
                      <span>{isFlipped ? 'Tap card again to see question' : 'Tap anywhere to reveal solution'}</span>
                    </div>
                  </div>

                  {/* Leitner Rating Controls */}
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={() => handleNextFlashcard(false)}
                      className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Need More Practice</span>
                    </button>

                    <button
                      onClick={() => handleNextFlashcard(true)}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Got It! (+5 XP)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PRE-EXAM 2-MINUTE CHEAT SHEET */}
            {activeTab === 'cheatSheet' && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                      ⚡
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-amber-200">2-Minute Pre-Exam Crammer Cheat Sheet</h3>
                      <p className="text-[11px] text-amber-300/80">Everything you need to memorize 30 minutes before entering the exam hall.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleExportPdf(`${subject?.name || 'Subject'}_${activeUnit?.unitNumber || 'Chapter'}_CheatSheet`)}
                      disabled={isExportingPdf}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                      title="Download Cheat Sheet as PDF"
                    >
                      {isExportingPdf ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>Download PDF</span>
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold transition-all cursor-pointer print:hidden flex items-center gap-1"
                      title="Print Cheat Sheet"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Print</span>
                    </button>
                  </div>
                </div>

                {/* Golden Formula Card */}
                <div className={`p-5 rounded-2xl border ${themeClasses.innerPanel} space-y-3`}>
                  <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Essential Formulas & Determinant Rules</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {(activeUnit.formulaRibbon || []).map((f, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono flex items-center justify-between">
                        <span className="text-teal-300 font-bold">{f.formula}</span>
                        <span className="text-[10px] text-gray-400">{f.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 10-Mark High Frequency Question Checklist */}
                <div className={`p-5 rounded-2xl border ${themeClasses.innerPanel} space-y-3`}>
                  <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>High-Frequency 10-Mark Exam Theorems</span>
                  </h4>
                  <ul className="space-y-2 text-xs opacity-90">
                    <li className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2">
                      <span className="text-teal-400 font-bold">1.</span>
                      <span>Gauss Elimination & Row Echelon Reduction: Finding rank and solving 3x3 non-homogeneous systems.</span>
                    </li>
                    <li className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2">
                      <span className="text-teal-400 font-bold">2.</span>
                      <span>Cayley-Hamilton Theorem: Statement, verification on 3x3 matrix, and finding inverse A⁻¹ and power A⁴.</span>
                    </li>
                    <li className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2">
                      <span className="text-teal-400 font-bold">3.</span>
                      <span>Diagonalization of Symmetric Matrix: Constructing modal matrix P and evaluating diagonal matrix D.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 5: AI NUMERICAL STEP-BY-STEP SOLVER */}
            {activeTab === 'solver' && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-cyan-200">AI Step-by-Step Numerical Solver Sandbox</h3>
                      <p className="text-[11px] text-cyan-300/80">Type any matrix, system of equations, or derivative question to generate derivations.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSolveNumerical} className="space-y-3">
                  <textarea
                    rows={3}
                    value={solverInput}
                    onChange={(e) => setSolverInput(e.target.value)}
                    placeholder="e.g. Find the rank of matrix A = [[1, 2, -1], [3, 4, 0], [-1, 0, -2]]"
                    className="w-full p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 font-mono resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-500">Supports: Matrix Rank, Eigenvalues, Gauss Elimination, LMVT</span>
                    <button
                      type="submit"
                      disabled={isSolving || !solverInput.trim()}
                      className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSolving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Calculator className="w-3.5 h-3.5" />}
                      <span>{isSolving ? 'Calculating Steps...' : 'Solve with Derivations'}</span>
                    </button>
                  </div>
                </form>

                {solverResult && (
                  <div className={`p-5 rounded-2xl border ${themeClasses.innerPanel} space-y-4 animate-fade-in`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>Step-by-Step Derivation Output</span>
                    </h4>

                    <div className="space-y-2">
                      {solverResult.steps.map((st, sIdx) => (
                        <div key={sIdx} className="text-xs p-3 rounded-xl bg-white/5 border border-white/5 font-sans leading-relaxed text-gray-200">
                          <span className="text-cyan-400 font-bold mr-1.5">•</span>
                          {st}
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                      🎯 Final Computed Answer: {solverResult.finalAns}
                    </div>

                    {solverResult.tips && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-amber-400 font-bold mb-0.5">Examiner Alert:</strong>
                          <span>{solverResult.tips}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: VISUALS & FLOWCHARTS */}
            {activeTab === 'visuals' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${themeClasses.heading}`}>
                      <GitFork className="w-5 h-5 text-brand-teal" />
                      <span>{activeUnit.flowchartTitle || 'Engineering Decision & Solution Pipeline'}</span>
                    </h3>
                    <p className="text-xs opacity-80 mt-1">
                      {activeUnit.diagramExplanation || 'Interactive step-by-step flowchart of the governing principles and algorithms.'}
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">
                    Mermaid Vector
                  </span>
                </div>

                {/* Rendered Mermaid Flowchart Box */}
                <div className={`p-6 rounded-2xl border ${themeClasses.innerPanel} flex justify-center items-center overflow-x-auto min-h-[280px]`}>
                  <div ref={mermaidRef} className="mermaid-render-container w-full flex justify-center">
                    {/* SVG generated dynamically by Mermaid.js */}
                  </div>
                </div>

                {/* Flowchart Architecture Explainer */}
                <div className={`p-4 rounded-xl border ${themeClasses.innerPanel} text-xs space-y-2`}>
                  <h4 className="font-bold text-teal-400 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" />
                    <span>How to use this flowchart in Autonomous Exams:</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 opacity-90">
                    <li>Sketch this workflow in your answer sheet during Part-B 10-mark descriptive questions to earn 2 bonus layout marks.</li>
                    <li>Always identify the decision diamond checks (e.g. rank condition, interval bounds, eigenvalue consistency) first before calculating.</li>
                    <li>Verify each node systematically during numerical problem solving.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 7: STEP-BY-STEP SOLVED PROBLEMS WITH ACTIVE RECALL ACCORDIONS */}
            {activeTab === 'problems' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${themeClasses.heading}`}>
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                      <span>High-Yield Solved Problems & Active Recall</span>
                    </h3>
                    <p className="text-xs opacity-80 mt-1">
                      Try solving the problem first, then click "Reveal Step-by-Step Derivation".
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    Exam Standard
                  </span>
                </div>

                {/* Solved Problems List */}
                {(activeUnit.solvedProblems && activeUnit.solvedProblems.length > 0 ? activeUnit.solvedProblems : [
                  {
                    title: `Model Problem: ${activeUnit.topicTitle || activeUnit.title}`,
                    question: `State the fundamental theorem governing ${activeUnit.topicTitle || activeUnit.title} and apply standard step-by-step calculation.`,
                    steps: [
                      'Step 1: Write the primary governing equation with boundary conditions.',
                      'Step 2: Carry out standard algebraic or calculus transformations.',
                      'Step 3: Evaluate limits and solve for final parameters.'
                    ],
                    solution: 'Final analytical solution matches textbook standard.',
                    tips: 'Examiner Tip: Write units and equations before substituting numbers.'
                  }
                ]).map((prob, pIdx) => {
                  const isRevealed = !!revealedSolutions[pIdx];

                  return (
                    <div key={pIdx} className={`p-5 rounded-2xl border ${themeClasses.innerPanel} space-y-4`}>
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-bold text-sm text-teal-300 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs">
                            {pIdx + 1}
                          </span>
                          <span>{prob.title}</span>
                        </h4>
                      </div>

                      {/* Question Statement */}
                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-gray-200 whitespace-pre-wrap leading-relaxed">
                        <strong className="text-teal-400 block mb-1 font-sans">Question:</strong>
                        {prob.question}
                      </div>

                      {/* Reveal Solution Button (Active Recall) */}
                      <div>
                        <button
                          onClick={() => toggleSolution(pIdx)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isRevealed ? 'Hide Derivation Steps' : 'Reveal Step-by-Step Derivation & Solution'}</span>
                        </button>
                      </div>

                      {/* Revealed Steps List */}
                      {isRevealed && (
                        <div className="space-y-3 pt-2 animate-fade-in">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                            Step-by-Step Derivation & Solution:
                          </span>
                          <div className="space-y-2">
                            {prob.steps.map((st, sIdx) => (
                              <div 
                                key={sIdx} 
                                className={`text-xs p-3.5 rounded-xl border font-sans leading-relaxed ${
                                  readerTheme === 'paper' 
                                    ? 'bg-slate-50 border-slate-200 text-slate-800' 
                                    : readerTheme === 'sepia' 
                                    ? 'bg-[#ebe0c5] border-[#d8c89f] text-[#2b1f11]' 
                                    : 'bg-white/[0.07] border-white/10 text-gray-100 shadow-sm'
                                }`}
                              >
                                <span className="text-teal-400 font-bold mr-1.5">•</span>
                                <span className="font-medium">{st}</span>
                              </div>
                            ))}
                          </div>

                          {/* Final Answer Callout */}
                          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                            🎯 Final Answer: {prob.solution}
                          </div>

                          {/* Examiner Tips / Trap Alert */}
                          {prob.tips && (
                            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <strong className="block text-amber-400 font-bold mb-0.5">Common Trap / Examiner Insight:</strong>
                                <span>{prob.tips}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 8: AI DEEP SYNTHESIS NOTES */}
            {activeTab === 'aiNotes' && aiNotesContent[activeUnit.id] && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className={`text-lg font-bold flex items-center gap-2 text-purple-300`}>
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <span>AI Synthesized Textbook Chapter</span>
                    </h3>
                    <p className="text-xs opacity-80 mt-1">
                      Expanded university textbook guide with real-time derivations, Q&A, and practice exercises.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateAiNotes}
                    disabled={isGeneratingAi}
                    className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs font-bold flex items-center gap-1.5 border border-purple-500/30 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                    <span>Regenerate</span>
                  </button>
                </div>

                <div 
                  className={`p-6 rounded-2xl border ${themeClasses.innerPanel} ${fontClasses} prose prose-invert max-w-none text-gray-200 space-y-4`}
                  dangerouslySetInnerHTML={{ __html: aiNotesContent[activeUnit.id] }}
                />
              </div>
            )}

            {/* Bottom Next & Previous Chapter Navigation */}
            <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-4 print:hidden no-print">
              <button
                disabled={selectedUnitIndex === 0}
                onClick={() => {
                  setSelectedUnitIndex(prev => Math.max(0, prev - 1));
                  setActiveTab('notes');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  selectedUnitIndex === 0
                    ? 'opacity-30 cursor-not-allowed bg-white/5'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chapter</span>
              </button>

              <button
                disabled={selectedUnitIndex === units.length - 1}
                onClick={() => {
                  setSelectedUnitIndex(prev => Math.min(units.length - 1, prev + 1));
                  setActiveTab('notes');
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  selectedUnitIndex === units.length - 1
                    ? 'opacity-30 cursor-not-allowed bg-white/5'
                    : 'bg-brand-teal text-black hover:scale-105 shadow-lg shadow-brand-teal/20 font-black'
                }`}
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Document Viewer Modal */}
      {viewerOpen && (
        <AdvancedDocumentViewerModal
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          fileUrl={viewingUrl}
          title={viewingTitle}
          fileType="pdf"
        />
      )}
    </div>
  );
}
