import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, Award, CheckCircle2, PlayCircle, Clock, ShieldCheck, 
  Sparkles, Trophy, ChevronRight, FileText, Code2, ArrowLeft,
  Check, Lock, RotateCcw, Download, Share2, ExternalLink, Star,
  HelpCircle, AlertCircle, BarChart3, Layers, BookCheck, Monitor,
  Zap, CheckCheck, Play, ArrowRight, BookMarked, Copy, CheckSquare,
  XCircle, Info, ChevronLeft, Lightbulb, AlertTriangle, Building2,
  GraduationCap, Terminal, Type, Volume2, VolumeX, Maximize2, Minimize2,
  PanelLeftClose, PanelLeft, Sun, Moon, Coffee, Mic, Square
} from 'lucide-react';
import { ALL_COURSES } from '../data/coursesData';
import { getTextbookForCourse } from '../data/textbooks';
import InteractiveNotesReader from '../components/InteractiveNotesReader';
import { 
  calculateStudentRealProgress, issueNewCertificate, resolveRealStudentInfo,
  generateLinkedInAddUrl, markCourseAsCompleted, markGrandTestAsPassed 
} from '../services/certificateService';
import { resolveVoiceAndSpeech, playSynthesizedNarration } from '../utils/teluguAudioEngine';
import { useToast } from '../context/ToastContext';

export default function CoursesPortal({ user, setActiveTab }) {
  const { addToast } = useToast();
  const userId = user?.id || user?.uid || (user?.email ? user.email.replace(/[@.]/g, '_') : 'guest');
  const realInfo = resolveRealStudentInfo(user);

  const [courses, setCourses] = useState(ALL_COURSES);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLessonModal, setSelectedLessonModal] = useState(null);
  const [selectedFullTextbook, setSelectedFullTextbook] = useState(null); // { course, textbook, pageIndex, searchQuery }
  const [activeReaderTab, setActiveReaderTab] = useState('textbook');
  const [readerFontSize, setReaderFontSize] = useState('normal'); // 'normal' | 'large' | 'huge'
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState(null);
  const [selfCheckAnswers, setSelfCheckAnswers] = useState({});
  const [completedLessons, setCompletedLessons] = useState({});

  // 📖 Digital Textbook Reader Customization (Themes, Fullscreen, Bolo Class Voice)
  const [readerTheme, setReaderTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_reader_theme');
      if (saved) return saved;
      if (typeof document !== 'undefined') {
        const isAppLight = document.documentElement.classList.contains('light') || 
                           document.body.classList.contains('light') ||
                           localStorage.getItem('lumixora_theme') === 'light';
        return isAppLight ? 'light' : 'dark';
      }
    } catch (e) {}
    return 'light'; // Default to clean academic paper theme for high readability!
  });
  const [isTextbookMaximized, setIsTextbookMaximized] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isBoloVoiceSpeaking, setIsBoloVoiceSpeaking] = useState(false);
  const [boloVoiceSpeed, setBoloVoiceSpeed] = useState(1.0);
  const [boloVoiceLang, setBoloVoiceLang] = useState('bilingual'); // Default to bilingual Telugu/Eng
  const activeBoloAudioRef = useRef(null);
  
  // Grand Test State
  const [activeTestCourse, setActiveTestCourse] = useState(null);
  const [testAnswers, setTestAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [activeTestLevelFilter, setActiveTestLevelFilter] = useState('all');
  const [currentTestQuestionIdx, setCurrentTestQuestionIdx] = useState(0);
  const [showReviewExplanations, setShowReviewExplanations] = useState(false);

  const [unlockedCertModal, setUnlockedCertModal] = useState(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  const loadProgress = () => {
    try {
      const lessonKey = 'lumixora_lessons_' + userId;
      const savedLessons = JSON.parse(localStorage.getItem(lessonKey) || '{}');
      setCompletedLessons(savedLessons);
    } catch (e) {}
  };

  useEffect(() => {
    loadProgress();
  }, [userId]);

  // Global ESC and Arrow Key listener for modals and page flips
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedFullTextbook) {
          e.preventDefault();
          e.stopPropagation();
          setSelectedFullTextbook(null);
        } else if (selectedLessonModal) {
          e.preventDefault();
          e.stopPropagation();
          setSelectedLessonModal(null);
        } else if (activeTestCourse) {
          e.preventDefault();
          e.stopPropagation();
          setActiveTestCourse(null);
        } else if (unlockedCertModal) {
          e.preventDefault();
          e.stopPropagation();
          setUnlockedCertModal(null);
        } else if (selectedCourse) {
          e.preventDefault();
          e.stopPropagation();
          setSelectedCourse(null);
        }
      } else if (selectedFullTextbook && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          if (e.key === 'ArrowRight') {
            setSelectedFullTextbook(prev => {
              if (!prev) return null;
              const maxP = (prev.textbook?.chapters?.length || 1) - 1;
              return { ...prev, pageIndex: Math.min(maxP, prev.pageIndex + 1) };
            });
          } else if (e.key === 'ArrowLeft') {
            setSelectedFullTextbook(prev => {
              if (!prev) return null;
              return { ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) };
            });
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [selectedFullTextbook, selectedLessonModal, activeTestCourse, unlockedCertModal, selectedCourse]);

  const handleOpenFullTextbook = (course, pageIndex = 0) => {
    const tb = getTextbookForCourse(course.id);
    if (!tb) {
      addToast?.({
        type: 'warning',
        message: 'Digital Textbook volume is initializing...'
      });
      return;
    }
    const maxIdx = (tb.chapters?.length || 1) - 1;
    setSelectedFullTextbook({
      course,
      textbook: tb,
      pageIndex: Math.max(0, Math.min(pageIndex, maxIdx)),
      searchQuery: ''
    });
  };

  const handleOpenLessonInNotesReader = (lesson, course) => {
    const activeCourse = course || selectedCourse;
    if (!activeCourse) return;
    const tb = getTextbookForCourse(activeCourse.id);
    if (!tb) {
      addToast?.({
        type: 'warning',
        message: 'Tutorial notes are loading...'
      });
      return;
    }
    let pageIdx = 0;
    if (tb.chapters && tb.chapters.length > 0) {
      const matchIdx = tb.chapters.findIndex(ch => 
        (lesson.title && ch.title?.toLowerCase() === lesson.title?.toLowerCase()) ||
        (lesson.textbook?.chapterNumber && ch.chapterNumber === lesson.textbook.chapterNumber) ||
        (lesson.title && ch.title?.toLowerCase().includes(lesson.title.toLowerCase().slice(0, 15)))
      );
      if (matchIdx !== -1) pageIdx = matchIdx;
    }
    setSelectedFullTextbook({
      course: activeCourse,
      textbook: tb,
      pageIndex: pageIdx,
      searchQuery: ''
    });
  };

  // ── 🎙️ Bolo Class Chapter Voice Controller (Telugu & Bilingual) ──
  const handlePlayBoloChapterVoice = (chapter) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      addToast?.({ message: 'Audio synthesis is not supported on this device/browser.', type: 'warning' });
      return;
    }

    if (isBoloVoiceSpeaking) {
      if (activeBoloAudioRef.current) {
        activeBoloAudioRef.current.stop();
        activeBoloAudioRef.current = null;
      } else {
        window.speechSynthesis.cancel();
      }
      setIsBoloVoiceSpeaking(false);
      return;
    }

    if (!chapter) return;

    const resolved = resolveVoiceAndSpeech({
      chapter,
      courseTitle: selectedFullTextbook?.course?.title || '',
      voiceLang: boloVoiceLang
    });

    const controller = playSynthesizedNarration({
      text: resolved.text,
      voice: resolved.voice,
      langCode: resolved.langCode,
      rate: boloVoiceSpeed || 1.0,
      pitch: 1.0,
      onStart: () => {
        setIsBoloVoiceSpeaking(true);
        addToast?.({ message: `🎙️ ${resolved.modeLabel} is explaining this chapter...`, type: 'info' });
      },
      onEnd: () => {
        setIsBoloVoiceSpeaking(false);
        activeBoloAudioRef.current = null;
      },
      onError: (err) => {
        console.warn('Voice speech error:', err);
        setIsBoloVoiceSpeaking(false);
        activeBoloAudioRef.current = null;
      }
    });

    activeBoloAudioRef.current = controller;
  };

  const handleStopBoloVoice = () => {
    if (activeBoloAudioRef.current) {
      activeBoloAudioRef.current.stop();
      activeBoloAudioRef.current = null;
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsBoloVoiceSpeaking(false);
  };

  // Stop audio whenever modal closes or chapter switches
  useEffect(() => {
    handleStopBoloVoice();
  }, [selectedFullTextbook?.pageIndex, selectedLessonModal]);

  // Clean reader theme styling tokens
  const readerThemeClasses = useMemo(() => {
    if (readerTheme === 'light') {
      return {
        overlay: 'bg-slate-900/50 backdrop-blur-md',
        card: 'bg-[#ffffff] text-slate-800 border-slate-200 shadow-2xl',
        header: 'bg-gradient-to-r from-slate-100 via-white to-slate-50 border-b border-slate-200 text-slate-900',
        sidebar: 'bg-slate-50 border-r border-slate-200 text-slate-800',
        sidebarSearch: 'bg-white border-slate-200 text-slate-900 placeholder-slate-400',
        sidebarItemActive: 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-sm',
        sidebarItemInactive: 'hover:bg-slate-100 text-slate-600',
        sidebarFooter: 'bg-slate-100 border-t border-slate-200 text-slate-500',
        readingPane: 'bg-[#ffffff] text-slate-800',
        banner: 'bg-gradient-to-r from-slate-100 via-white to-slate-50 border-b border-slate-200',
        title: 'text-slate-950',
        summary: 'text-slate-600',
        sectionHeading: 'text-cyan-950',
        paragraph: 'text-slate-700 font-sans',
        ascii: 'bg-slate-900 text-cyan-300 border-slate-700',
        formula: 'bg-amber-50 border-amber-300 text-amber-950 shadow-sm',
        codeWrap: 'bg-slate-900 border-slate-800 text-slate-100',
        caseStudy: 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-sm',
        pearlCard: 'bg-indigo-50/60 border-indigo-200 text-indigo-950 shadow-sm',
        pearlAnswer: 'bg-white border border-indigo-100 text-slate-700',
        bottomBar: 'bg-slate-100 border-t border-slate-200 text-slate-700',
        boloBar: 'bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-purple-200 text-purple-950'
      };
    }
    if (readerTheme === 'sepia') {
      return {
        overlay: 'bg-black/60 backdrop-blur-md',
        card: 'bg-[#fbf0d9] text-[#2c1d11] border-[#e2cca4] shadow-2xl',
        header: 'bg-gradient-to-r from-[#f5e6c8] via-[#fbf0d9] to-[#f0ddb8] border-b border-[#e2cca4] text-[#2c1d11]',
        sidebar: 'bg-[#f5e6c8] border-r border-[#e2cca4] text-[#2c1d11]',
        sidebarSearch: 'bg-[#fffaf0] border-[#d8be97] text-[#3b2413] placeholder-[#9c7857]',
        sidebarItemActive: 'bg-[#ecd3a3] border-[#a06830] text-[#4a2608] font-bold shadow-sm',
        sidebarItemInactive: 'hover:bg-[#efe0be] text-[#5c3e23]',
        sidebarFooter: 'bg-[#efe0be] border-t border-[#e2cca4] text-[#7a5735]',
        readingPane: 'bg-[#fbf0d9] text-[#2c1d11]',
        banner: 'bg-gradient-to-r from-[#f5e6c8] via-[#fbf0d9] to-[#f0ddb8] border-b border-[#e2cca4]',
        title: 'text-[#381f0b]',
        summary: 'text-[#5c3e23]',
        sectionHeading: 'text-[#844b16]',
        paragraph: 'text-[#2c1d11] font-serif',
        ascii: 'bg-[#3b2818] text-[#f7dfb0] border-[#6b4728]',
        formula: 'bg-[#faebd0] border-[#d4aa70] text-[#4a280c] shadow-sm',
        codeWrap: 'bg-[#2b1b10] border-[#5e381b] text-[#fdf4e3]',
        caseStudy: 'bg-[#eef3dc] border-[#a9bf72] text-[#2e400c] shadow-sm',
        pearlCard: 'bg-[#faecd9] border-[#d19a62] text-[#42220b] shadow-sm',
        pearlAnswer: 'bg-[#fffaf0] border-[#e2cca4] text-[#3b2413]',
        bottomBar: 'bg-[#f5e6c8] border-t border-[#e2cca4] text-[#4a2b10]',
        boloBar: 'bg-gradient-to-r from-[#edd3bc] via-[#faebd9] to-[#ebd0b5] border-[#c99a6d] text-[#4a280c]'
      };
    }
    // 'dark' (Midnight Obsidian)
    return {
      overlay: 'bg-black/95 backdrop-blur-2xl',
      card: 'bg-[#090e1c] text-white border-cyan-500/50 shadow-[0_25px_90px_rgba(6,182,212,0.2)]',
      header: 'bg-gradient-to-r from-[#0d1527] via-[#090f1d] to-[#060a14] border-b border-white/10 text-white',
      sidebar: 'bg-[#070b16] border-r border-white/10 text-gray-400',
      sidebarSearch: 'bg-white/5 border-white/10 text-white placeholder-gray-500',
      sidebarItemActive: 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent border-cyan-400 text-white shadow-md',
      sidebarItemInactive: 'hover:bg-white/5 text-gray-400 hover:text-gray-200',
      sidebarFooter: 'bg-[#090e1c] border-t border-white/10 text-gray-400',
      readingPane: 'bg-[#090e1c] text-gray-200',
      banner: 'bg-gradient-to-r from-[#0d162a] via-[#09101f] to-[#070c17] border-b border-white/10',
      title: 'text-white',
      summary: 'text-gray-300',
      sectionHeading: 'text-cyan-300',
      paragraph: 'text-gray-300 font-sans',
      ascii: 'bg-[#04070f] text-cyan-300 border-cyan-500/30 shadow-inner',
      formula: 'bg-[#0c1424] border-cyan-400/30 text-cyan-200 shadow-md',
      codeWrap: 'bg-[#04070f] border-white/10 text-gray-200 shadow-lg',
      caseStudy: 'bg-gradient-to-br from-emerald-950/30 via-[#0a121d] to-black border-emerald-500/40 text-emerald-200 shadow-xl',
      pearlCard: 'bg-[#0e1424] border-amber-500/30 text-white',
      pearlAnswer: 'bg-black/40 border-white/5 text-gray-300',
      bottomBar: 'bg-[#070b16] border-t border-white/10 text-gray-400',
      boloBar: 'bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/40 border-purple-500/30 text-purple-200'
    };
  }, [readerTheme]);

  const getCourseProgress = (course) => {
    const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    if (allLessonIds.length === 0) return 0;
    const completedCount = allLessonIds.filter(id => completedLessons[id]).length;
    return Math.round((completedCount / allLessonIds.length) * 100);
  };

  const isGrandTestPassed = (course) => {
    try {
      const grandKey = 'lumixora_grand_tests_' + userId;
      const gTests = JSON.parse(localStorage.getItem(grandKey) || '[]');
      return gTests.some(t => t.testTitle === course.grandTest.title || t.testId === course.grandTest.id);
    } catch (e) {
      return false;
    }
  };

  const handleToggleLesson = (lessonId, course) => {
    const newCompleted = { ...completedLessons, [lessonId]: !completedLessons[lessonId] };
    setCompletedLessons(newCompleted);
    try {
      localStorage.setItem('lumixora_lessons_' + userId, JSON.stringify(newCompleted));
    } catch (e) {}

    const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    const completedCount = allLessonIds.filter(id => newCompleted[id]).length;
    const pct = Math.round((completedCount / allLessonIds.length) * 100);

    try {
      const progKey = 'lumixora_course_progress_' + userId;
      const curProg = JSON.parse(localStorage.getItem(progKey) || '{}');
      curProg[course.id] = pct;
      localStorage.setItem(progKey, JSON.stringify(curProg));

      if (pct >= 100) {
        const compKey = 'lumixora_completed_courses_' + userId;
        const compList = JSON.parse(localStorage.getItem(compKey) || '[]');
        if (!compList.includes(course.id)) compList.push(course.id);
        localStorage.setItem(compKey, JSON.stringify(compList));
        addToast?.({
          type: 'success',
          message: '🎉 100% Textbook Modules Complete: ' + course.title + '! Take the 30-Question Grand Test to claim your official certificate.'
        });
      }
    } catch (e) {}
  };

  const handleCompleteAllModules = (course) => {
    const newCompleted = { ...completedLessons };
    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        newCompleted[l.id] = true;
      });
    });
    setCompletedLessons(newCompleted);
    try {
      localStorage.setItem('lumixora_lessons_' + userId, JSON.stringify(newCompleted));
      const progKey = 'lumixora_course_progress_' + userId;
      const curProg = JSON.parse(localStorage.getItem(progKey) || '{}');
      curProg[course.id] = 100;
      localStorage.setItem(progKey, JSON.stringify(curProg));

      const compKey = 'lumixora_completed_courses_' + userId;
      const compList = JSON.parse(localStorage.getItem(compKey) || '[]');
      if (!compList.includes(course.id)) compList.push(course.id);
      localStorage.setItem(compKey, JSON.stringify(compList));
    } catch (e) {}

    addToast?.({
      type: 'success',
      message: '🎉 All syllabus modules marked 100% complete for ' + course.title + '! Ready for Grand Assessment.'
    });
  };

  const handleStartGrandTest = (course) => {
    setActiveTestCourse(course);
    setTestAnswers({});
    setTestSubmitted(false);
    setTestResult(null);
    setActiveTestLevelFilter('all');
    setCurrentTestQuestionIdx(0);
    setShowReviewExplanations(false);
  };

  const handleSubmitGrandTest = () => {
    if (!activeTestCourse) return;
    const questions = activeTestCourse.grandTest.questions;
    let correctCount = 0;
    
    // Level-wise score trackers
    const levelStats = {
      'Level 1: Fundamentals': { total: 0, correct: 0 },
      'Level 2: Intermediate': { total: 0, correct: 0 },
      'Level 3: Advanced': { total: 0, correct: 0 }
    };

    questions.forEach((q, idx) => {
      const qLevel = q.level || 'Level 1: Fundamentals';
      if (!levelStats[qLevel]) {
        levelStats[qLevel] = { total: 0, correct: 0 };
      }
      levelStats[qLevel].total++;

      if (testAnswers[idx] === q.correct) {
        correctCount++;
        levelStats[qLevel].correct++;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    const passed = scorePct >= (activeTestCourse.grandTest.passPercentage || 60);

    const resultObj = {
      score: correctCount,
      total: questions.length,
      scorePercentage: scorePct,
      passed,
      levelStats,
      testTitle: activeTestCourse.grandTest.title
    };

    setTestResult(resultObj);
    setTestSubmitted(true);
    setShowReviewExplanations(true);

    if (passed) {
      markGrandTestAsPassed(user, activeTestCourse.grandTest.title, scorePct);

      const newCert = issueNewCertificate({
        user,
        title: activeTestCourse.certTitle || activeTestCourse.title,
        category: activeTestCourse.certCategory || 'Courses',
        score: scorePct + '%',
        grade: scorePct >= 90 ? 'Elite Distinction (A+)' : 'Honors Distinction (A)',
        skills: activeTestCourse.skills || ['Core Engineering', 'Problem Solving'],
        badgeIcon: activeTestCourse.badgeIcon || '🎓',
        badgeColor: activeTestCourse.badgeColor || 'from-blue-500 to-indigo-600'
      });

      setUnlockedCertModal(newCert);

      addToast?.({
        type: 'success',
        message: '🏆 PASSED WITH ' + scorePct + '%! Official 16:9 Certificate Generated: ' + newCert.id
      });
    } else {
      addToast?.({
        type: 'warning',
        message: 'Score: ' + scorePct + '% (Passing mark is ' + activeTestCourse.grandTest.passPercentage + '%). Review explanations and re-attempt!'
      });
    }
  };

  const handleCopyCode = (code, snippetKey) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeSnippet(snippetKey);
    setTimeout(() => setCopiedCodeSnippet(null), 2000);
  };

  // Find all lessons flattened for prev/next chapter navigation
  const flatCourseLessons = useMemo(() => {
    if (!selectedCourse) return [];
    return selectedCourse.modules.flatMap(m => 
      m.lessons.map(l => ({ ...l, moduleTitle: m.title, moduleId: m.id }))
    );
  }, [selectedCourse]);

  const currentLessonIndex = useMemo(() => {
    if (!selectedLessonModal || !flatCourseLessons.length) return -1;
    return flatCourseLessons.findIndex(l => l.id === selectedLessonModal.id);
  }, [selectedLessonModal, flatCourseLessons]);

  const handleNavigateLesson = (direction) => {
    if (currentLessonIndex === -1) return;
    const nextIdx = currentLessonIndex + direction;
    if (nextIdx >= 0 && nextIdx < flatCourseLessons.length) {
      setSelectedLessonModal(flatCourseLessons[nextIdx]);
      setSelfCheckAnswers({});
      setActiveReaderTab('textbook');
    }
  };

  const filteredCourses = courses.filter(c => {
    if (activeCategoryFilter === 'all') return true;
    return (c.category || '').toLowerCase().includes(activeCategoryFilter.toLowerCase());
  });

  // Dynamic font size classes for comfortable textbook reading
  const fontSizeClass = readerFontSize === 'huge' ? 'text-base leading-relaxed' : readerFontSize === 'large' ? 'text-sm leading-relaxed' : 'text-xs leading-relaxed';

  return (
    <div className="min-h-screen bg-[#06070c] text-white p-4 md:p-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0d1424] via-[#09101d] to-[#06070c] border border-cyan-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-3xl shadow-xl shadow-cyan-500/20 border border-cyan-300/40">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white font-sora">
                Official Courses Portal & Autonomous Certifications
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-400/40">
                Digital Textbook + 30-Q Grand Test
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Read exhaustive, textbook-grade chapters on the web, examine industry case studies, copy production code, and pass the 30-Question Level-Wise Grand Assessments to claim your diplomas.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab?.('certificates')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:opacity-95 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Award className="w-4 h-4" />
          View My Credentials
        </button>
      </div>

      {/* Main Course Details or Catalog Grid */}
      {selectedCourse ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedCourse(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Courses
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 font-bold">
                Textbook Progress: {getCourseProgress(selectedCourse)}%
              </span>
              <button
                onClick={() => handleCompleteAllModules(selectedCourse)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-bold text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Mark 100% Read
              </button>
            </div>
          </div>

          {/* Course Banner */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#10192e] to-[#0b101b] border border-white/10 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                {selectedCourse.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                {selectedCourse.level}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> {selectedCourse.duration}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white font-sora">
              {selectedCourse.title}
            </h2>

            <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
              {selectedCourse.shortDescription}
            </p>

            {/* Progress & Grand Test Bar */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                  <span className="text-gray-300">Digital Textbook Syllabus Progress</span>
                  <span className="text-cyan-400 font-mono">{getCourseProgress(selectedCourse)}%</span>
                </div>
                <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: getCourseProgress(selectedCourse) + '%' }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-300">Grand Assessment (30 Questions)</p>
                  <p className="text-[11px] font-mono mt-0.5">
                    {isGrandTestPassed(selectedCourse) ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 30-Q Grand Test Passed (≥60%)
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold">
                        30-Q Grand Test Pending (≥60% Required)
                      </span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenFullTextbook(selectedCourse)}
                  className="px-5 py-2.5 rounded-2xl bg-[#008037] hover:bg-[#00682b] text-white font-black text-xs shadow-lg shadow-[#008037]/25 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-white" />
                  Lumixora Notes & Tutorials (30 Topics)
                </button>

                <button
                  onClick={() => handleStartGrandTest(selectedCourse)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:opacity-95 text-black font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trophy className="w-4 h-4" />
                  {isGrandTestPassed(selectedCourse) ? 'Re-take Grand Test (30 Qs)' : 'Take Grand Test (30 Qs)'}
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Modular Syllabus */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#008037]" />
                Digital Curriculum Modules ({selectedCourse.modules.length} Modules • Complete Lumixora Study Notes)
              </h3>
              <button
                onClick={() => handleOpenFullTextbook(selectedCourse)}
                className="text-xs font-bold text-[#008037] hover:text-[#00682b] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#008037]/15 border border-[#008037]/30 hover:bg-[#008037]/25 transition-all cursor-pointer"
              >
                <BookMarked className="w-4 h-4 text-[#008037]" />
                Open 30 Topics Notes
              </button>
            </div>

            <div className="space-y-3">
              {selectedCourse.modules.map((mod, mIdx) => (
                <div key={mod.id} className="p-5 rounded-3xl bg-[#0c1220] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center">
                        {mIdx + 1}
                      </span>
                      {mod.title}
                    </h4>
                    <span className="text-xs text-gray-400 font-mono">{mod.duration}</span>
                  </div>

                  <div className="space-y-2">
                    {mod.lessons.map((les) => {
                      const isDone = completedLessons[les.id] === true;
                      return (
                        <div 
                          key={les.id}
                          className={'p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-all ' + (isDone ? 'bg-emerald-950/15 border-emerald-500/30' : 'bg-black/30 border-white/5 hover:border-white/15')}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => handleToggleLesson(les.id, selectedCourse)}
                              className={'w-6 h-6 rounded-lg border mt-0.5 flex items-center justify-center cursor-pointer transition-all ' + (isDone ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-white/5 border-white/20 hover:border-cyan-400')}
                            >
                              {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                            </button>
                            <div>
                              <p className={'text-xs font-bold ' + (isDone ? 'text-gray-300' : 'text-white')}>
                                {les.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                {les.summary}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className="inline-block text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-400/20">
                                  {les.duration}
                                </span>
                                {les.textbook?.readingTime && (
                                  <span className="inline-block text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20">
                                    📖 {les.textbook.readingTime}
                                  </span>
                                )}
                                {les.textbook?.caseStudy && (
                                  <span className="inline-block text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-400/20">
                                    🏭 Case Study: {les.textbook.caseStudy.company}
                                  </span>
                                )}
                                <button
                                  onClick={() => handleOpenLessonInNotesReader(les, selectedCourse)}
                                  className="text-[11px] text-[#008037] hover:text-[#00682b] font-black flex items-center gap-1 cursor-pointer bg-[#008037]/15 hover:bg-[#008037]/25 px-2.5 py-0.5 rounded-lg border border-[#008037]/30 transition-colors"
                                >
                                  <BookOpen className="w-3.5 h-3.5 text-[#008037]" /> Study Notes
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleOpenLessonInNotesReader(les, selectedCourse)}
                              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#008037]/20 hover:bg-[#008037]/30 text-[#008037] border border-[#008037]/40 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <BookMarked className="w-3.5 h-3.5" /> Read Notes
                            </button>
                            <button
                              onClick={() => handleToggleLesson(les.id, selectedCourse)}
                              className={'px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ' + (isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10')}
                            >
                              {isDone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                              {isDone ? 'Read' : 'Mark Read'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Courses' },
              { id: 'courses', label: 'Core Engineering' },
              { id: 'languages', label: 'Programming Languages' },
              { id: 'problems', label: 'DSA & Algorithms' },
              { id: 'weekly', label: 'Arena Championships' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveCategoryFilter(f.id)}
                className={'px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ' + (activeCategoryFilter === f.id ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg font-black' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5')}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              const progress = getCourseProgress(course);
              const testPassed = isGrandTestPassed(course);
              const isFullyCertified = progress >= 100 && testPassed;

              return (
                <div 
                  key={course.id}
                  className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1220] via-[#090e18] to-black border border-white/10 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={'w-12 h-12 rounded-2xl bg-gradient-to-tr ' + course.badgeColor + ' flex items-center justify-center text-2xl shadow-md border border-white/20'}>
                        {course.badgeIcon}
                      </div>

                      <div className="flex items-center gap-2">
                        {isFullyCertified ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            {progress}% Syllabus
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {course.shortDescription}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.skills.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-md bg-white/5 text-gray-300 text-[10px] font-medium border border-white/5">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    {/* Dual Milestone Progress */}
                    <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                      <div className={'p-2 rounded-xl border ' + (progress >= 100 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-black/30 border-white/5 text-gray-400')}>
                        <p className="font-bold">1. Textbook: {progress}%</p>
                        <p className="text-[9px] opacity-80">{progress >= 100 ? '✓ Fully Read' : 'In Progress'}</p>
                      </div>

                      <div className={'p-2 rounded-xl border ' + (testPassed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-black/30 border-white/5 text-gray-400')}>
                        <p className="font-bold">2. Grand Test (30 Qs)</p>
                        <p className="text-[9px] opacity-80">{testPassed ? '✓ Passed (≥60%)' : 'Pending (30 Qs)'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenFullTextbook(course)}
                          className="flex-1 py-2.5 rounded-2xl bg-[#008037] hover:bg-[#00682b] text-white font-bold text-xs shadow-md shadow-[#008037]/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <BookOpen className="w-4 h-4 text-white" />
                          Lumixora Notes (30 Topics)
                        </button>
                        <button
                          onClick={() => handleStartGrandTest(course)}
                          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:opacity-95 text-black font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Trophy className="w-4 h-4" />
                          Grand Test (30 Qs)
                        </button>
                      </div>
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-[11px] border border-white/5 transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Layers className="w-3.5 h-3.5 text-gray-400" />
                        View Syllabus Modules & Practice
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 📖 LUMIXORA-STYLE COMPREHENSIVE NOTES & TUTORIALS PORTAL ── */}
      {selectedFullTextbook && (
        <InteractiveNotesReader
          course={selectedFullTextbook.course}
          textbook={selectedFullTextbook.textbook}
          initialPageIndex={selectedFullTextbook.pageIndex || 0}
          completedLessons={completedLessons}
          onToggleLesson={(chId, crs) => handleToggleLesson(chId, crs || selectedCourse)}
          onClose={() => setSelectedFullTextbook(null)}
          allCourses={courses}
          onSelectCourse={(newCourse) => {
            const tb = getTextbookForCourse(newCourse.id);
            setSelectedCourse(newCourse);
            setSelectedFullTextbook({
              course: newCourse,
              textbook: tb,
              pageIndex: 0,
              searchQuery: ''
            });
          }}
        />
      )}

      {/* GRAND ASSESSMENT TEST RUNNER MODAL (30 LEVEL-WISE QUESTIONS) */}
      {activeTestCourse && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto cursor-pointer animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveTestCourse(null);
          }}
        >
          <div 
            className="w-full max-w-4xl bg-[#0a0f1d] border border-cyan-500/40 rounded-3xl shadow-[0_20px_80px_rgba(6,182,212,0.2)] flex flex-col max-h-[92vh] overflow-hidden my-auto cursor-default relative"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Test Header Banner */}
            <div className="p-5 md:p-6 border-b border-white/10 bg-gradient-to-r from-[#141b2d] via-[#0d1322] to-[#0a0f1d] flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-lg">
                  🏆
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-white font-sora">
                    {activeTestCourse.grandTest.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
                    <span className="text-cyan-300 font-bold">{activeTestCourse.grandTest.questions.length} Questions</span>
                    <span>•</span>
                    <span>{activeTestCourse.grandTest.durationMinutes} mins</span>
                    <span>•</span>
                    <span className="text-amber-300">Passing Grade: {activeTestCourse.grandTest.passPercentage}%</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTestCourse(null)}
                title="Close (ESC)"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
              >
                ✕
              </button>
            </div>

            {/* Test Content / Results Area */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar">

              {testSubmitted && testResult ? (
                /* DETAILED TEST RESULTS & LEVEL-WISE BREAKDOWN */
                <div className="space-y-6 text-center py-2">
                  <div className={'w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl shadow-xl ' + (testResult.passed ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400' : 'bg-red-500/20 border-2 border-red-400 text-red-400')}>
                    {testResult.passed ? '🏆' : '⚠️'}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white font-sora">
                      {testResult.passed ? 'Grand Assessment Passed!' : 'Assessment Retake Recommended'}
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">
                      Overall Score: <span className="font-bold text-cyan-400 font-mono">{testResult.scorePercentage}%</span> ({testResult.score}/{testResult.total} Correct)
                    </p>
                  </div>

                  {/* Level-Wise Performance Breakdown Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
                    {Object.entries(testResult.levelStats || {}).map(([lvlName, stats], idx) => {
                      const lvlPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                      return (
                        <div key={idx} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">{lvlName}</p>
                          <div className="flex items-baseline justify-between">
                            <span className="text-lg font-black text-white font-sora">{stats.correct}/{stats.total}</span>
                            <span className={'text-xs font-mono font-bold ' + (lvlPct >= 60 ? 'text-emerald-400' : 'text-amber-400')}>{lvlPct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={'h-full rounded-full ' + (lvlPct >= 60 ? 'bg-emerald-400' : 'bg-amber-400')}
                              style={{ width: lvlPct + '%' }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation & Review Section */}
                  <div className="pt-4 border-t border-white/10 text-left space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <BookCheck className="w-4 h-4 text-cyan-400" />
                        Comprehensive Question Review & Explanations ({activeTestCourse.grandTest.questions.length} Questions)
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {activeTestCourse.grandTest.questions.map((q, qIdx) => {
                        const userAns = testAnswers[qIdx];
                        const isCorrect = userAns === q.correct;

                        return (
                          <div 
                            key={q.id || qIdx}
                            className={'p-4 rounded-2xl border space-y-3 ' + (isCorrect ? 'bg-emerald-950/10 border-emerald-500/30' : 'bg-red-950/10 border-red-500/30')}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-cyan-400">Q{qIdx + 1}.</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-gray-300 border border-white/10">
                                  {q.level || 'Level 1'}
                                </span>
                                {q.topic && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                                    {q.topic}
                                  </span>
                                )}
                              </div>

                              <span className={'text-xs font-bold font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1 ' + (isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300')}>
                                {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                {isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                            </div>

                            <p className="text-xs font-bold text-white leading-relaxed">{q.question}</p>

                            <div className="space-y-1.5 text-xs">
                              {q.options.map((opt, oIdx) => {
                                let style = 'bg-white/[0.02] border-white/5 text-gray-400';
                                if (oIdx === q.correct) {
                                  style = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold';
                                } else if (oIdx === userAns) {
                                  style = 'bg-red-500/20 border-red-400 text-red-300 font-medium';
                                }
                                return (
                                  <div key={oIdx} className={'p-2.5 rounded-xl border flex items-center justify-between ' + style}>
                                    <span>{opt}</span>
                                    {oIdx === q.correct && <span className="text-[10px] uppercase font-bold text-emerald-400">Correct Answer</span>}
                                    {oIdx === userAns && oIdx !== q.correct && <span className="text-[10px] uppercase font-bold text-red-400">Your Selection</span>}
                                  </div>
                                );
                              })}
                            </div>

                            {q.explanation && (
                              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed space-y-1">
                                <span className="font-bold text-[10px] uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                                  <Info className="w-3.5 h-3.5" /> Solution & Concept Explanation:
                                </span>
                                <p className="text-gray-300 text-xs">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        setTestSubmitted(false);
                        setTestAnswers({});
                        setTestResult(null);
                        setCurrentTestQuestionIdx(0);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" /> Re-attempt Test
                    </button>
                    {testResult.passed && (
                      <button
                        onClick={() => {
                          setActiveTestCourse(null);
                          setActiveTab?.('certificates');
                        }}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Award className="w-4 h-4" /> View Verifiable Certificate
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* LIVE TEST RUNNER (LEVEL FILTER & 30 QUESTIONS) */
                <div className="space-y-6">
                  
                  {/* Level Quick-Filter Selector */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-black/40 border border-white/10">
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: 'all', label: 'All 30 Questions' },
                        { id: 'Level 1: Fundamentals', label: 'Level 1: Fundamentals (1-10)' },
                        { id: 'Level 2: Intermediate', label: 'Level 2: Intermediate (11-20)' },
                        { id: 'Level 3: Advanced', label: 'Level 3: Advanced (21-30)' }
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setActiveTestLevelFilter(lvl.id)}
                          className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' + (activeTestLevelFilter === lvl.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400' : 'bg-white/5 text-gray-400 hover:text-white border border-white/5')}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>

                    <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-1 bg-cyan-500/10 rounded-lg border border-cyan-400/20">
                      Answered: {Object.keys(testAnswers).length}/30
                    </span>
                  </div>

                  {/* 1-30 Quick Jump Palette */}
                  <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1.5 p-3 rounded-2xl bg-black/30 border border-white/5">
                    {activeTestCourse.grandTest.questions.map((q, idx) => {
                      const isAnswered = testAnswers[idx] !== undefined;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('test_q_' + idx);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          className={'h-7 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center ' + (isAnswered ? 'bg-cyan-500 text-black shadow-sm' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5')}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Questions List */}
                  <div className="space-y-4">
                    {activeTestCourse.grandTest.questions
                      .map((q, qIdx) => ({ ...q, originalIndex: qIdx }))
                      .filter(q => activeTestLevelFilter === 'all' || q.level === activeTestLevelFilter)
                      .map((q) => {
                        const qIdx = q.originalIndex;
                        const isAnswered = testAnswers[qIdx] !== undefined;

                        return (
                          <div 
                            id={'test_q_' + qIdx}
                            key={q.id || qIdx} 
                            className={'p-5 rounded-2xl border space-y-3 transition-all ' + (isAnswered ? 'bg-[#0d1424] border-cyan-500/40 shadow-sm' : 'bg-black/40 border-white/10')}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
                                  {qIdx + 1}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                  {q.level || 'Level 1: Fundamentals'}
                                </span>
                                {q.topic && (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                                    {q.topic}
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs md:text-sm font-bold text-white leading-relaxed">
                              {q.question}
                            </p>

                            <div className="space-y-2 pt-1">
                              {q.options.map((opt, oIdx) => (
                                <label 
                                  key={oIdx}
                                  className={'flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ' + (testAnswers[qIdx] === oIdx ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-gray-300')}
                                >
                                  <input
                                    type="radio"
                                    name={'grand_q_' + qIdx}
                                    checked={testAnswers[qIdx] === oIdx}
                                    onChange={() => setTestAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                                    className="text-cyan-500 focus:ring-0 cursor-pointer"
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Submission Bottom Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 sticky bottom-0 bg-[#0a0f1d]/95 backdrop-blur-md p-3 rounded-2xl">
                    <div className="text-xs font-mono text-gray-300">
                      Progress: <span className="text-cyan-400 font-bold">{Object.keys(testAnswers).length}/30</span> Answered
                    </div>

                    <button
                      onClick={handleSubmitGrandTest}
                      disabled={Object.keys(testAnswers).length === 0}
                      className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 disabled:opacity-50 text-black font-black text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Trophy className="w-4 h-4" />
                      Submit Grand Assessment (30 Qs)
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* INSTANT CERTIFICATE UNLOCKED CELEBRATION MODAL */}
      {unlockedCertModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg overflow-y-auto animate-fadeIn cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setUnlockedCertModal(null);
          }}
        >
          <div 
            className="w-full max-w-xl bg-gradient-to-b from-[#141d33] to-[#0a0f1d] border-2 border-amber-400/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_20px_80px_rgba(245,158,11,0.3)] text-center relative my-8 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setUnlockedCertModal(null)}
              title="Close (ESC)"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
            >
              ✕
            </button>
            
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#0a0f1d] flex items-center justify-center text-3xl">
                🏆
              </div>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] font-black uppercase tracking-wider border border-amber-400/40">
                OFFICIAL VERIFIED CREDENTIAL
              </span>
              <h3 className="text-2xl font-black text-white mt-2 font-sora">
                Certificate of Mastery Generated!
              </h3>
              <p className="text-xs text-gray-300 mt-1 max-w-md mx-auto">
                Issued to <span className="font-bold text-amber-300">{unlockedCertModal.issuedTo || realInfo.name}</span> for achieving {unlockedCertModal.score} with {unlockedCertModal.grade}.
              </p>
            </div>

            {/* Certificate Micro-Plaque */}
            <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/30 text-left space-y-1">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-amber-400">ID: {unlockedCertModal.id}</span>
                <span className="text-emerald-400">100% IMMUTABLE LEDGER</span>
              </div>
              <p className="text-sm font-bold text-white">{unlockedCertModal.title}</p>
              <p className="text-xs text-gray-400">{unlockedCertModal.verifiedBy}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setUnlockedCertModal(null);
                  setActiveTestCourse(null);
                  setActiveTab?.('certificates');
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black font-black text-xs shadow-xl shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                View & Print 16:9 Official Certificate
              </button>
              
              <button
                onClick={() => setUnlockedCertModal(null)}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all cursor-pointer"
              >
                Continue Learning
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}