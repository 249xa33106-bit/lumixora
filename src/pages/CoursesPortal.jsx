import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Award, CheckCircle2, PlayCircle, Clock, ShieldCheck, 
  Sparkles, Trophy, ChevronRight, FileText, Code2, ArrowLeft,
  Check, Lock, RotateCcw, Download, Share2, ExternalLink, Star,
  HelpCircle, AlertCircle, BarChart3, Layers, BookCheck, Monitor,
  Zap, CheckCheck, Play, ArrowRight, BookMarked, Copy, CheckSquare,
  XCircle, Info, ChevronLeft, Lightbulb, AlertTriangle, Building2,
  GraduationCap, Terminal, Type
} from 'lucide-react';
import { ALL_COURSES } from '../data/coursesData';
import { getTextbookForCourse } from '../data/textbooks';
import { 
  calculateStudentRealProgress, issueNewCertificate, resolveRealStudentInfo,
  generateLinkedInAddUrl, markCourseAsCompleted, markGrandTestAsPassed 
} from '../services/certificateService';
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
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5 border border-cyan-300/30"
                >
                  <BookOpen className="w-4 h-4 text-white" />
                  Open Full Textbook (30 Pages)
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
                <Layers className="w-5 h-5 text-cyan-400" />
                Digital Textbook Modules ({selectedCourse.modules.length} Modules • Complete Web Study Notes)
              </h3>
              <button
                onClick={() => handleOpenFullTextbook(selectedCourse)}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 transition-all cursor-pointer"
              >
                <BookMarked className="w-4 h-4" />
                Read 30-Page Volume
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
                                  onClick={() => {
                                    setSelectedLessonModal({ ...les, moduleTitle: mod.title });
                                    setActiveReaderTab('textbook');
                                    setSelfCheckAnswers({});
                                  }}
                                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-black flex items-center gap-1 cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-0.5 rounded-lg border border-cyan-400/30 transition-colors"
                                >
                                  <BookOpen className="w-3.5 h-3.5" /> Read Textbook Chapter
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setSelectedLessonModal({ ...les, moduleTitle: mod.title });
                                setActiveReaderTab('textbook');
                                setSelfCheckAnswers({});
                              }}
                              className="px-3 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <BookMarked className="w-3.5 h-3.5" /> Study
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
                          className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 font-bold text-xs border border-cyan-400/40 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          Open 30-Page Textbook
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

      {/* DEDICATED FULL-SCREEN DIGITAL TEXTBOOK VOLUME VIEWER (30+ PAGES / CHAPTERS) */}
      {selectedFullTextbook && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/95 backdrop-blur-2xl overflow-y-auto cursor-pointer animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedFullTextbook(null);
          }}
        >
          <div 
            className="w-full max-w-7xl h-[92vh] bg-[#090e1c] border border-cyan-500/50 rounded-3xl shadow-[0_25px_90px_rgba(6,182,212,0.2)] flex flex-col overflow-hidden my-auto cursor-default relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Textbook Top Header */}
            <div className="p-4 md:p-5 border-b border-white/10 bg-gradient-to-r from-[#0d1527] via-[#090f1d] to-[#060a14] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-2xl text-black font-black shadow-lg shadow-cyan-500/20 border border-cyan-200">
                  📖
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-300 font-black uppercase tracking-wider bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                      {selectedFullTextbook.textbook.edition || 'Academic Digital Edition'}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {selectedFullTextbook.textbook.chapters?.length || 30} Chapters • 30+ Pages
                    </span>
                  </div>
                  <h2 className="text-base md:text-lg font-black text-white mt-0.5 font-sora">
                    {selectedFullTextbook.textbook.title}
                  </h2>
                </div>
              </div>

              {/* Reader Controls: Font Size, Prev/Next & Close */}
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                {/* Font Size Selector */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    title="Normal Text"
                    onClick={() => setReaderFontSize('normal')}
                    className={'px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ' + (readerFontSize === 'normal' ? 'bg-cyan-400 text-black' : 'text-gray-400 hover:text-white')}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    title="Large Text"
                    onClick={() => setReaderFontSize('large')}
                    className={'px-2.5 py-1 rounded-lg text-sm font-mono font-bold transition-all cursor-pointer ' + (readerFontSize === 'large' ? 'bg-cyan-400 text-black' : 'text-gray-400 hover:text-white')}
                  >
                    A+
                  </button>
                  <button
                    type="button"
                    title="Huge Text"
                    onClick={() => setReaderFontSize('huge')}
                    className={'px-2.5 py-1 rounded-lg text-base font-mono font-bold transition-all cursor-pointer ' + (readerFontSize === 'huge' ? 'bg-cyan-400 text-black' : 'text-gray-400 hover:text-white')}
                  >
                    A++
                  </button>
                </div>

                {/* Page Navigation Shortcut Buttons */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    disabled={selectedFullTextbook.pageIndex <= 0}
                    onClick={() => setSelectedFullTextbook(prev => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) }))}
                    title="Previous Page (Left Arrow)"
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                  <span className="text-xs font-mono px-2 font-bold text-cyan-400">
                    Page {selectedFullTextbook.pageIndex + 1} of {selectedFullTextbook.textbook.chapters?.length || 30}
                  </span>
                  <button
                    disabled={selectedFullTextbook.pageIndex >= (selectedFullTextbook.textbook.chapters?.length || 30) - 1}
                    onClick={() => setSelectedFullTextbook(prev => ({ ...prev, pageIndex: Math.min((prev.textbook.chapters?.length || 30) - 1, prev.pageIndex + 1) }))}
                    title="Next Page (Right Arrow)"
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFullTextbook(null)}
                  title="Close Reader (ESC)"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500/30 text-gray-300 hover:text-red-300 border border-white/10 flex items-center justify-center cursor-pointer transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Main Textbook Studio Split View: Sidebar + Reading Pane */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              
              {/* LEFT SIDEBAR: Table of Contents & In-Book Search (4 Cols) */}
              <div className="md:col-span-4 bg-[#070b16] border-r border-white/10 flex flex-col h-full overflow-hidden">
                {/* Search Box */}
                <div className="p-3.5 border-b border-white/10 bg-[#0a0f1e] shrink-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="🔍 Search in all 30 chapters (e.g. V8, Raft, Monotonic)..."
                      value={selectedFullTextbook.searchQuery}
                      onChange={(e) => setSelectedFullTextbook(prev => ({ ...prev, searchQuery: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-sans"
                    />
                    {selectedFullTextbook.searchQuery && (
                      <button
                        onClick={() => setSelectedFullTextbook(prev => ({ ...prev, searchQuery: '' }))}
                        className="absolute right-2.5 top-2 text-gray-400 hover:text-white text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Chapter List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                  {(selectedFullTextbook.textbook.chapters || []).map((ch, idx) => {
                    const isSelected = selectedFullTextbook.pageIndex === idx;
                    const query = (selectedFullTextbook.searchQuery || '').toLowerCase();
                    const matches = !query || 
                      ch.title?.toLowerCase().includes(query) || 
                      ch.summary?.toLowerCase().includes(query) ||
                      ch.chapterNumber?.toLowerCase().includes(query) ||
                      ch.sections?.some(s => s.heading?.toLowerCase().includes(query) || s.content?.toLowerCase().includes(query));

                    if (!matches) return null;

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedFullTextbook(prev => ({ ...prev, pageIndex: idx }))}
                        className={'w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 border ' + (isSelected ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent border-cyan-400 text-white shadow-md' : 'bg-transparent border-transparent hover:bg-white/5 text-gray-400 hover:text-gray-200')}
                      >
                        <span className={'w-7 h-7 rounded-xl text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ' + (isSelected ? 'bg-cyan-400 text-black' : 'bg-white/5 text-gray-400')}>
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className={isSelected ? 'text-cyan-300 font-bold' : 'text-gray-500'}>
                              {ch.chapterNumber}
                            </span>
                            <span className="text-gray-500">{ch.readingTime}</span>
                          </div>
                          <p className={'text-xs font-bold truncate mt-0.5 ' + (isSelected ? 'text-white' : 'text-gray-300')}>
                            {ch.title}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate mt-0.5">
                            {ch.summary}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sidebar Footer Info */}
                <div className="p-3 border-t border-white/10 bg-[#090e1c] text-[11px] text-gray-400 flex items-center justify-between font-mono shrink-0">
                  <span>Author: Lumixora Faculty</span>
                  <span className="text-cyan-400 font-bold">120 Total Volume Pages</span>
                </div>
              </div>

              {/* RIGHT READING PANE: Selected Chapter Reader (8 Cols) */}
              {(() => {
                const currentChapter = selectedFullTextbook.textbook.chapters?.[selectedFullTextbook.pageIndex] || selectedFullTextbook.textbook.chapters?.[0];
                if (!currentChapter) {
                  return (
                    <div className="md:col-span-8 p-12 text-center text-gray-400 flex items-center justify-center">
                      <p>Select a chapter from the sidebar table of contents.</p>
                    </div>
                  );
                }

                return (
                  <div className="md:col-span-8 bg-[#090e1c] flex flex-col h-full overflow-hidden">
                    {/* Chapter Header Banner */}
                    <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#0d162a] via-[#09101f] to-[#070c17] shrink-0 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-400/30">
                            {currentChapter.chapterNumber} • Page {selectedFullTextbook.pageIndex + 1}
                          </span>
                          <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {currentChapter.readingTime}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                          {selectedFullTextbook.textbook.title.split('—')[0]}
                        </span>
                      </div>

                      <h1 className="text-xl md:text-2xl font-black text-white font-sora leading-tight">
                        {currentChapter.title}
                      </h1>
                      <p className="text-xs text-gray-300 leading-relaxed max-w-4xl">
                        {currentChapter.summary}
                      </p>
                    </div>

                    {/* Chapter Reading Content Body */}
                    <div className={'flex-1 overflow-y-auto p-6 md:p-8 space-y-8 text-gray-200 custom-scrollbar ' + fontSizeClass}>
                      
                      {/* Chapter Sections */}
                      {(currentChapter.sections || []).map((sec, sIdx) => (
                        <div key={sIdx} className="space-y-4 pt-4 border-t border-white/5 first:border-t-0 first:pt-0">
                          <h2 className="text-base md:text-lg font-bold text-cyan-300 flex items-center gap-2 font-sora">
                            <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-mono flex items-center justify-center font-bold">
                              {sIdx + 1}
                            </span>
                            {sec.heading}
                          </h2>

                          <p className="text-gray-300 leading-relaxed font-sans">
                            {sec.content}
                          </p>

                          {/* ASCII Architecture Flow / Memory Layout Diagram */}
                          {sec.asciiDiagram && (
                            <div className="p-4 rounded-2xl bg-[#04070f] border border-cyan-500/30 font-mono text-[11px] text-cyan-300 overflow-x-auto shadow-inner">
                              <pre className="leading-tight">
                                {sec.asciiDiagram}
                              </pre>
                            </div>
                          )}

                          {/* Mathematical / Asymptotic Formula Callout */}
                          {sec.formula && (
                            <div className="p-4 rounded-2xl bg-[#0c1424] border border-cyan-400/30 text-cyan-200 font-mono text-xs flex items-start gap-3 shadow-md">
                              <span className="text-2xl shrink-0">📐</span>
                              <div>
                                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Formula / Computational Law:</p>
                                <p className="mt-0.5 text-white font-semibold font-mono text-xs md:text-sm">{sec.formula}</p>
                              </div>
                            </div>
                          )}

                          {/* Code Snippet Box with Copy Button */}
                          {sec.code && (
                            <div className="rounded-2xl bg-[#04070f] border border-white/10 overflow-hidden shadow-lg">
                              <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
                                <span className="flex items-center gap-1.5 text-cyan-300 font-bold uppercase">
                                  <Code2 className="w-3.5 h-3.5" /> {sec.language || 'code'} implementation
                                </span>
                                <button
                                  onClick={() => handleCopyCode(sec.code, `tb_${selectedFullTextbook.pageIndex}_${sIdx}`)}
                                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                                >
                                  {copiedCodeSnippet === `tb_${selectedFullTextbook.pageIndex}_${sIdx}` ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-emerald-400 font-bold">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy Code</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="p-4 text-xs font-mono text-gray-200 overflow-x-auto leading-relaxed">
                                <code>{sec.code}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Industry Case Study */}
                      {currentChapter.caseStudy && (
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-[#0a121d] to-black border border-emerald-500/40 space-y-3 shadow-xl">
                          <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-xl text-emerald-300">
                              🏭
                            </div>
                            <div>
                              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                                Real-World Production Case Study
                              </span>
                              <h3 className="text-base font-bold text-white">
                                {currentChapter.caseStudy.title} ({currentChapter.caseStudy.company})
                              </h3>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Challenge & Scenario:</span>
                              <p className="text-gray-300 leading-relaxed">{currentChapter.caseStudy.scenario}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">Architectural Solution:</span>
                              <p className="text-gray-300 leading-relaxed">{currentChapter.caseStudy.architecture}</p>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs">
                            <span className="font-bold">Architectural Takeaway: </span>
                            <span>{currentChapter.caseStudy.takeaway}</span>
                          </div>
                        </div>
                      )}

                      {/* Senior/Staff Interview Pearls & Model Answers */}
                      {currentChapter.interviewPearls && currentChapter.interviewPearls.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-white/10">
                          <h3 className="text-base font-bold text-amber-300 flex items-center gap-2 font-sora">
                            <GraduationCap className="w-5 h-5 text-amber-400" />
                            Senior & Staff Engineer Interview Pearls (Model Answers)
                          </h3>

                          <div className="space-y-3">
                            {currentChapter.interviewPearls.map((pearl, pIdx) => (
                              <div key={pIdx} className="p-5 rounded-2xl bg-[#0e1424] border border-amber-500/30 space-y-2.5">
                                <p className="text-xs md:text-sm font-bold text-white flex items-start gap-2">
                                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px] shrink-0 mt-0.5">
                                    Q{pIdx + 1}
                                  </span>
                                  {pearl.question}
                                </p>
                                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300 leading-relaxed">
                                  <span className="font-bold text-cyan-400 block mb-1">Staff Engineer Architectural Answer:</span>
                                  {pearl.answer}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Reading Pane Bottom Controls */}
                    <div className="p-4 border-t border-white/10 bg-[#070b16] flex items-center justify-between gap-4 shrink-0">
                      <button
                        disabled={selectedFullTextbook.pageIndex <= 0}
                        onClick={() => setSelectedFullTextbook(prev => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) }))}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-gray-200 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous Chapter
                      </button>

                      <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-400">
                        <span>Navigate with keyboard <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-cyan-300">←</kbd> and <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-cyan-300">→</kbd></span>
                      </div>

                      <button
                        disabled={selectedFullTextbook.pageIndex >= (selectedFullTextbook.textbook.chapters?.length || 30) - 1}
                        onClick={() => setSelectedFullTextbook(prev => ({ ...prev, pageIndex: Math.min((prev.textbook.chapters?.length || 30) - 1, prev.pageIndex + 1) }))}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-black text-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                      >
                        Next Chapter <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })()}

            </div>

          </div>
        </div>
      )}

      {/* FULL-FEATURED DIGITAL TEXTBOOK READER MODAL WITH MULTI-TABS & DEEP ARCHITECTURE */}
      {selectedLessonModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto cursor-pointer animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLessonModal(null);
          }}
        >
          <div 
            className="w-full max-w-5xl bg-[#0a0f1d] border border-cyan-500/40 rounded-3xl shadow-[0_20px_80px_rgba(6,182,212,0.15)] flex flex-col max-h-[94vh] overflow-hidden my-auto cursor-default relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 md:p-6 border-b border-white/10 bg-gradient-to-r from-[#0f172a] via-[#0b1220] to-[#0a0f1d] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 flex items-center justify-center text-2xl text-cyan-300 shadow-md">
                  📖
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                      {selectedLessonModal.textbook?.chapterNumber || 'Chapter'}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {selectedLessonModal.moduleTitle}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white mt-1">
                    {selectedLessonModal.title}
                  </h3>
                </div>
              </div>

              {/* Reader Controls: Font Size & Close */}
              <div className="flex items-center gap-3">
                {/* Font Size Toggles */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    title="Normal Font Size"
                    onClick={() => setReaderFontSize('normal')}
                    className={'px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ' + (readerFontSize === 'normal' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white')}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    title="Large Font Size"
                    onClick={() => setReaderFontSize('large')}
                    className={'px-2 py-1 rounded-lg text-sm font-mono font-bold transition-all cursor-pointer ' + (readerFontSize === 'large' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white')}
                  >
                    A+
                  </button>
                  <button
                    type="button"
                    title="Huge Font Size"
                    onClick={() => setReaderFontSize('huge')}
                    className={'px-2 py-1 rounded-lg text-base font-mono font-bold transition-all cursor-pointer ' + (readerFontSize === 'huge' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white')}
                  >
                    A++
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLessonModal(null)}
                  title="Close (ESC)"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Reader Multi-Tab Bar */}
            <div className="flex items-center gap-1 px-6 pt-3 pb-2 bg-[#090d19] border-b border-white/5 overflow-x-auto text-xs shrink-0">
              <button
                type="button"
                onClick={() => setActiveReaderTab('textbook')}
                className={'px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ' + (activeReaderTab === 'textbook' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5')}
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                Textbook Theory & Architecture
              </button>

              {selectedLessonModal.textbook?.caseStudy && (
                <button
                  type="button"
                  onClick={() => setActiveReaderTab('casestudy')}
                  className={'px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ' + (activeReaderTab === 'casestudy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5')}
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  Industry Case Study ({selectedLessonModal.textbook.caseStudy.company})
                </button>
              )}

              {selectedLessonModal.textbook?.interviewPearls && (
                <button
                  type="button"
                  onClick={() => setActiveReaderTab('pearls')}
                  className={'px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ' + (activeReaderTab === 'pearls' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5')}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  Interview Pearls & Q&A
                </button>
              )}

              {selectedLessonModal.textbook?.selfCheck && selectedLessonModal.textbook.selfCheck.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveReaderTab('quiz')}
                  className={'px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ' + (activeReaderTab === 'quiz' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5')}
                >
                  <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                  Self-Check Knowledge Quiz
                </button>
              )}
            </div>

            {/* Modal Body - Tab Content */}
            <div className={'p-6 md:p-8 overflow-y-auto space-y-6 text-gray-200 leading-relaxed custom-scrollbar ' + fontSizeClass}>
              
              {/* TAB 1: TEXTBOOK THEORY */}
              {activeReaderTab === 'textbook' && (
                <div className="space-y-6">
                  {/* Reading Stats & Key Takeaways Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-black/40 to-blue-950/20 border border-cyan-500/30 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-cyan-400" /> Chapter Overview & Core Takeaways
                      </span>
                      <span className="text-gray-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {selectedLessonModal.textbook?.readingTime || selectedLessonModal.duration}
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs text-gray-300">
                      {(selectedLessonModal.textbook?.keyTakeaways || [selectedLessonModal.summary]).map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* In-Depth Textbook Sections */}
                  {(selectedLessonModal.textbook?.sections || []).map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-4 pt-3 border-t border-white/5 first:border-t-0">
                      <h4 className="text-sm md:text-base font-bold text-cyan-300 flex items-center gap-2 font-sora">
                        <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono flex items-center justify-center font-bold">
                          {sIdx + 1}
                        </span>
                        {sec.heading}
                      </h4>

                      <p className="text-gray-300 leading-relaxed font-sans">
                        {sec.content}
                      </p>

                      {/* ASCII Architecture Flow / Memory Layout Diagram */}
                      {sec.asciiDiagram && (
                        <div className="p-4 rounded-2xl bg-[#050811] border border-cyan-500/30 font-mono text-[11px] text-cyan-300 overflow-x-auto shadow-inner">
                          <pre className="leading-tight">
                            {sec.asciiDiagram}
                          </pre>
                        </div>
                      )}

                      {/* Mathematical / Asymptotic Formula Callout */}
                      {sec.formula && (
                        <div className="p-4 rounded-xl bg-[#0d1627] border border-cyan-400/30 text-cyan-200 font-mono text-xs flex items-start gap-3 shadow-sm">
                          <span className="text-xl shrink-0">📐</span>
                          <div>
                            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Formula / Computational Law:</p>
                            <p className="mt-0.5 text-white font-semibold font-mono text-xs md:text-sm">{sec.formula}</p>
                          </div>
                        </div>
                      )}

                      {/* Code Snippet Box with Copy Button */}
                      {sec.code && (
                        <div className="rounded-2xl bg-[#050811] border border-white/10 overflow-hidden shadow-md">
                          <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
                            <span className="flex items-center gap-1.5 text-cyan-300 font-bold uppercase">
                              <Code2 className="w-3.5 h-3.5" /> {sec.language || 'code'} implementation
                            </span>
                            <button
                              onClick={() => handleCopyCode(sec.code, sIdx)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                            >
                              {copiedCodeSnippet === sIdx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-4 text-xs font-mono text-gray-200 overflow-x-auto leading-relaxed">
                            <code>{sec.code}</code>
                          </pre>
                        </div>
                      )}

                      {/* Industry Pro Tip */}
                      {sec.proTip && (
                        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                          <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold uppercase tracking-wider text-[10px] block text-emerald-400">Industry Pro Tip:</span>
                            <p className="mt-0.5 text-gray-200">{sec.proTip}</p>
                          </div>
                        </div>
                      )}

                      {/* Common Pitfall / Exam Trap */}
                      {sec.commonTrap && (
                        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold uppercase tracking-wider text-[10px] block text-amber-400">Common Trap to Avoid:</span>
                            <p className="mt-0.5 text-gray-200">{sec.commonTrap}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: INDUSTRY CASE STUDY */}
              {activeReaderTab === 'casestudy' && selectedLessonModal.textbook?.caseStudy && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-[#0a121d] to-black border border-emerald-500/40 space-y-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl text-emerald-300">
                        🏭
                      </div>
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30">
                          {selectedLessonModal.textbook.caseStudy.company} Case Study
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">
                          {selectedLessonModal.textbook.caseStudy.title}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">The Scaling Challenge:</h4>
                        <p className="text-xs text-gray-300 leading-relaxed">{selectedLessonModal.textbook.caseStudy.scenario}</p>
                      </div>

                      <div className="space-y-1 pt-2 border-t border-white/5">
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Engineering Architecture & Resolution:</h4>
                        <p className="text-xs text-gray-300 leading-relaxed">{selectedLessonModal.textbook.caseStudy.architecture}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-amber-300 space-y-1">
                        <span className="font-bold text-[10px] uppercase text-amber-400 block">Core Architectural Takeaway:</span>
                        <p className="text-gray-200">{selectedLessonModal.textbook.caseStudy.takeaway}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INTERVIEW PEARLS & Q&A */}
              {activeReaderTab === 'pearls' && selectedLessonModal.textbook?.interviewPearls && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-amber-400" />
                      Top Technical Interview Questions & Model Answers
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {selectedLessonModal.textbook.interviewPearls.map((p, pIdx) => (
                      <div key={pIdx} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                        <div className="flex items-start gap-2.5">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold mt-0.5">
                            Q{pIdx + 1}
                          </span>
                          <p className="text-xs font-bold text-white">{p.question}</p>
                        </div>
                        <div className="pl-8 pt-1 text-xs text-gray-300 leading-relaxed border-l-2 border-amber-500/30 ml-2">
                          <p>{p.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SELF-CHECK MASTERY QUIZ */}
              {activeReaderTab === 'quiz' && selectedLessonModal.textbook?.selfCheck && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2 pb-2 border-b border-white/10">
                    <CheckSquare className="w-4 h-4 text-purple-400" />
                    Chapter Self-Check & Knowledge Mastery Quiz
                  </h4>
                  
                  {selectedLessonModal.textbook.selfCheck.map((sc, qIdx) => {
                    const selectedOpt = selfCheckAnswers[qIdx];
                    const isAnswered = selectedOpt !== undefined;

                    return (
                      <div key={qIdx} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                        <p className="text-xs font-bold text-white leading-relaxed">
                          <span className="text-purple-400 font-mono">Q{qIdx + 1}.</span> {sc.question}
                        </p>
                        <div className="space-y-2">
                          {sc.options.map((opt, oIdx) => {
                            let optStyle = 'bg-white/[0.03] border-white/5 hover:border-white/20 text-gray-300';
                            if (isAnswered) {
                              if (oIdx === sc.correct) {
                                optStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold';
                              } else if (oIdx === selectedOpt) {
                                optStyle = 'bg-red-500/20 border-red-400 text-red-300';
                              }
                            }
                            return (
                              <button
                                key={oIdx}
                                onClick={() => setSelfCheckAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                                className={'w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ' + optStyle}
                              >
                                <span>{opt}</span>
                                {isAnswered && oIdx === sc.correct && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Modal Footer with Chapter Navigation */}
            <div className="p-4 md:p-5 border-t border-white/10 bg-[#080d1a] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentLessonIndex <= 0}
                  onClick={() => handleNavigateLesson(-1)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-gray-300 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  type="button"
                  disabled={currentLessonIndex >= flatCourseLessons.length - 1}
                  onClick={() => handleNavigateLesson(1)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-gray-300 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleLesson(selectedLessonModal.id, selectedCourse);
                    setSelectedLessonModal(null);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-95 text-black font-black text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Chapter Completed & Close
                </button>
              </div>
            </div>

          </div>
        </div>
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