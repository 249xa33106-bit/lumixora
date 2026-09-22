import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Award, CheckCircle2, PlayCircle, Clock, ShieldCheck, 
  Sparkles, Trophy, ChevronRight, FileText, Code2, ArrowLeft,
  Check, Lock, RotateCcw, Download, Share2, ExternalLink, Star,
  HelpCircle, AlertCircle, BarChart3, Layers, BookCheck, Monitor,
  Zap, CheckCheck, Play, ArrowRight, BookMarked
} from 'lucide-react';
import { ALL_COURSES } from '../data/coursesData';
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
  const [completedLessons, setCompletedLessons] = useState({});
  const [activeTestCourse, setActiveTestCourse] = useState(null);
  const [testAnswers, setTestAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testResult, setTestResult] = useState(null);
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

  // Global ESC key listener to smoothly close active course modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedLessonModal) {
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
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [selectedLessonModal, activeTestCourse, unlockedCertModal, selectedCourse]);

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
          message: '🎉 100% Course Complete: ' + course.title + '! Pass the Grand Test to claim your official certificate.'
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
      message: '🎉 All syllabus modules marked 100% complete for ' + course.title + '! Now take the Grand Test.'
    });
  };

  const handleStartGrandTest = (course) => {
    setActiveTestCourse(course);
    setTestAnswers({});
    setTestSubmitted(false);
    setTestResult(null);
  };

  const handleSubmitGrandTest = () => {
    if (!activeTestCourse) return;
    const questions = activeTestCourse.grandTest.questions;
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (testAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    const passed = scorePct >= (activeTestCourse.grandTest.passPercentage || 60);

    const resultObj = {
      score: correctCount,
      total: questions.length,
      scorePercentage: scorePct,
      passed,
      testTitle: activeTestCourse.grandTest.title
    };

    setTestResult(resultObj);
    setTestSubmitted(true);

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
        message: '🏆 PASSED! Official Certificate Generated: ' + newCert.id
      });
    } else {
      addToast?.({
        type: 'warning',
        message: 'Score: ' + scorePct + '% (Passing mark is ' + activeTestCourse.grandTest.passPercentage + '%). Please review the lessons and re-attempt!'
      });
    }
  };

  const filteredCourses = courses.filter(c => {
    if (activeCategoryFilter === 'all') return true;
    return (c.category || '').toLowerCase().includes(activeCategoryFilter.toLowerCase());
  });

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
                Curriculum Verified
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Complete 100% course modules, pass the Grand Assessment Test, and automatically generate your verifiable 16:9 Gold & Sapphire Diplomas.
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
                Course Progress: {getCourseProgress(selectedCourse)}%
              </span>
              <button
                onClick={() => handleCompleteAllModules(selectedCourse)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-bold text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Mark 100% Complete
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
                  <span className="text-gray-300">Syllabus Mastery Progress</span>
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
                  <p className="text-xs font-bold text-gray-300">Final Assessment Milestone</p>
                  <p className="text-[11px] font-mono mt-0.5">
                    {isGrandTestPassed(selectedCourse) ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Grand Test Passed (≥60%)
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold">
                        Grand Test Pending (≥60% Required)
                      </span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => handleStartGrandTest(selectedCourse)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:opacity-95 text-black font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trophy className="w-4 h-4" />
                  {isGrandTestPassed(selectedCourse) ? 'Re-take Grand Test' : 'Take Grand Test'}
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Modular Syllabus */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Course Syllabus Modules ({selectedCourse.modules.length} Modules)
            </h3>

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
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="inline-block text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-400/20">
                                  {les.duration}
                                </span>
                                <button
                                  onClick={() => setSelectedLessonModal({ ...les, moduleTitle: mod.title })}
                                  className="text-[10px] text-gray-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <BookMarked className="w-3 h-3" /> Read Lesson Notes
                                </button>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleToggleLesson(les.id, selectedCourse)}
                            className={'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ' + (isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10')}
                          >
                            {isDone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                            {isDone ? 'Completed' : 'Mark Complete'}
                          </button>
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
                        <p className="font-bold">1. Syllabus: {progress}%</p>
                        <p className="text-[9px] opacity-80">{progress >= 100 ? '✓ Complete' : 'In Progress'}</p>
                      </div>

                      <div className={'p-2 rounded-xl border ' + (testPassed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-black/30 border-white/5 text-gray-400')}>
                        <p className="font-bold">2. Grand Test</p>
                        <p className="text-[9px] opacity-80">{testPassed ? '✓ Passed (≥60%)' : 'Pending'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="flex-1 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        Course Modules
                      </button>
                      <button
                        onClick={() => handleStartGrandTest(course)}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:opacity-95 text-black font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Trophy className="w-4 h-4" />
                        Grand Test
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* INTERACTIVE LESSON CONTENT VIEWER MODAL */}
      {selectedLessonModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLessonModal(null);
          }}
        >
          <div 
            className="w-full max-w-2xl bg-[#0d1322] border border-cyan-500/40 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative my-8 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  {selectedLessonModal.moduleTitle}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedLessonModal.title}
                </h3>
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

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-gray-200 space-y-3 leading-relaxed">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Lesson Summary & Takeaways:</h4>
              <p>{selectedLessonModal.summary}</p>
              
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] space-y-1">
                <span className="font-bold flex items-center gap-1"><Code2 className="w-3.5 h-3.5" /> Key Architectural Tenet:</span>
                <p className="text-gray-300 text-xs font-sans">
                  Always optimize for cache spatial locality, minimize lock contention, and ensure strict state idempotency across concurrent boundaries.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-xs font-mono text-gray-400">Duration: {selectedLessonModal.duration}</span>
              <button
                type="button"
                onClick={() => {
                  handleToggleLesson(selectedLessonModal.id, selectedCourse);
                  setSelectedLessonModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-95 text-black font-black text-xs cursor-pointer shadow-md"
              >
                Mark Complete & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRAND TEST RUNNER MODAL */}
      {activeTestCourse && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveTestCourse(null);
          }}
        >
          <div 
            className="w-full max-w-2xl bg-[#0d1322] border border-cyan-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative my-8 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
                  🏆
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {activeTestCourse.grandTest.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    {activeTestCourse.grandTest.questions.length} Questions • {activeTestCourse.grandTest.durationMinutes} mins • Pass: {activeTestCourse.grandTest.passPercentage}%
                  </p>
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

            {testSubmitted && testResult ? (
              <div className="space-y-6 text-center py-4">
                <div className={'w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl shadow-xl ' + (testResult.passed ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400' : 'bg-red-500/20 border-2 border-red-400 text-red-400')}>
                  {testResult.passed ? '🏆' : '⚠️'}
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white font-sora">
                    {testResult.passed ? 'Grand Assessment Passed!' : 'Assessment Incomplete'}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Your Score: <span className="font-bold text-cyan-400">{testResult.scorePercentage}%</span> ({testResult.score}/{testResult.total} Correct)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto text-xs text-gray-300 leading-relaxed">
                  {testResult.passed ? (
                    <p className="text-emerald-300 font-medium">
                      🎉 Congratulations! You have satisfied the assessment requirement. Your verifiable 16:9 credential has been cryptographically generated and issued!
                    </p>
                  ) : (
                    <p className="text-amber-300 font-medium">
                      A score of at least {activeTestCourse.grandTest.passPercentage}% is required to earn the official verified credential. Review the course syllabus lessons and re-attempt.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setTestSubmitted(false);
                      setTestAnswers({});
                      setTestResult(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    Re-attempt Test
                  </button>
                  {testResult.passed && (
                    <button
                      onClick={() => {
                        setActiveTestCourse(null);
                        setActiveTab?.('certificates');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs shadow-lg transition-all cursor-pointer"
                    >
                      View Certificate in Credentials
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {activeTestCourse.grandTest.questions.map((q, qIdx) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                    <p className="text-sm font-bold text-white leading-relaxed">
                      <span className="text-cyan-400 font-mono">Q{qIdx + 1}.</span> {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => (
                        <label 
                          key={oIdx}
                          className={'flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ' + (testAnswers[qIdx] === oIdx ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-gray-300')}
                        >
                          <input
                            type="radio"
                            name={'q_' + qIdx}
                            checked={testAnswers[qIdx] === oIdx}
                            onChange={() => setTestAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            className="text-cyan-500 focus:ring-0 cursor-pointer"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs font-mono text-gray-400">
                    Answered: {Object.keys(testAnswers).length}/{activeTestCourse.grandTest.questions.length}
                  </span>

                  <button
                    onClick={handleSubmitGrandTest}
                    disabled={Object.keys(testAnswers).length === 0}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 disabled:opacity-50 text-black font-black text-xs shadow-lg transition-all cursor-pointer"
                  >
                    Submit Assessment
                  </button>
                </div>
              </div>
            )}

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