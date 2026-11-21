import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, Lock, Play, Clock, Code, CheckSquare, Award, Download,
  Search, KeyRound, Sliders, Radio, FileText, AlertTriangle, CheckCircle2, Sparkles
} from 'lucide-react';
import {
  loadAllSecureExams,
  saveCustomSecureExam,
  deleteCustomSecureExam,
  loadExamAttempts,
  saveExamAttempt,
  openPrintableScorecardPdf
} from './gprecSecureExamBank';
import GprecSecureExamRunner from './GprecSecureExamRunner';
import GprecExamConductorPanel from './GprecExamConductorPanel';

export default function GprecSecureExamsPortal({ user, awardXP, addToast }) {
  const [exams, setExams] = useState(() => loadAllSecureExams());
  const [attempts, setAttempts] = useState(() => loadExamAttempts());
  
  // Role checks: Only Faculty, TPO, Admins & Founders can access the Conductor Studio & War Room
  const userRole = (user?.role || '').toLowerCase();
  const userEmail = (user?.email || '').toLowerCase();
  const isFacultyOrAdmin = Boolean(
    userRole === 'faculty' ||
    userRole === 'mentor' ||
    userRole === 'teacher' ||
    userRole === 'founder' ||
    userRole === 'admin' ||
    userRole === 'tpo' ||
    user?.isFounder ||
    user?.isOfficer ||
    user?.isDean ||
    user?.designation ||
    userEmail === 'founder@lumixora.com' ||
    userEmail === 'dean.placements@gprec.ac.in' ||
    userEmail === 'srikanth.csm@gprec.ac.in' ||
    userEmail === '249xa33106@gprec.ac.in'
  );

  const [activeTab, setActiveTab] = useState('hall'); // 'hall' | 'scorecards' | 'conductor'
  const [activeExam, setActiveExam] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [quickPasscode, setQuickPasscode] = useState('');

  const avgScore = useMemo(() => {
    if (attempts.length === 0) return 0;
    return Math.round(attempts.reduce((s, a) => s + (a.percentage || 0), 0) / attempts.length);
  }, [attempts]);

  const avgTrust = useMemo(() => {
    if (attempts.length === 0) return 100;
    return Math.round(attempts.reduce((s, a) => s + (a.trustScore ?? 100), 0) / attempts.length);
  }, [attempts]);

  const filteredExams = useMemo(() => {
    if (categoryFilter === 'All') return exams;
    return exams.filter(e => e.category === categoryFilter);
  }, [exams, categoryFilter]);

  const handleJoinByPasscode = (e) => {
    e.preventDefault();
    const code = quickPasscode.trim().toUpperCase();
    if (!code) return;
    const match = exams.find(ex => (ex.passcode || '').toUpperCase() === code);
    if (match) {
      const studentEmailNorm = (user?.email || 'scholar@gprec.ac.in').toLowerCase();
      const alreadyDone = match.singleAttemptOnly && attempts.some(
        a => a.examId === match.id && (a.studentEmail || '').toLowerCase() === studentEmailNorm
      );
      if (alreadyDone) {
        if (addToast) addToast({ message: `Single-Attempt Lock: You have already submitted "${match.title}".`, type: 'error' });
        return;
      }
      setQuickPasscode('');
      setActiveExam(match);
    } else if (addToast) {
      addToast({ message: `No scheduled exam found for passcode "${code}". Try GPREC2026 or SDE2026.`, type: 'warning' });
    }
  };

  const handleCompleteAttempt = (attempt) => {
    const next = saveExamAttempt(attempt);
    setAttempts(next);
    if (awardXP) {
      awardXP(Math.max(50, Math.round(attempt.percentage * 2)), `Completed Proctored Exam: ${attempt.examTitle}`);
    }
    if (addToast) {
      addToast({
        message: `Exam submitted! Score: ${attempt.percentage}% • Trust: ${attempt.trustScore}% (${attempt.receiptHash})`,
        type: 'success'
      });
    }
  };

  const handlePublishExam = (newExam) => {
    saveCustomSecureExam(newExam);
    setExams(loadAllSecureExams());
  };

  const handleDeleteExam = (examId) => {
    deleteCustomSecureExam(examId);
    setExams(loadAllSecureExams());
    if (addToast) addToast({ message: 'Removed custom exam.', type: 'info' });
  };

  // If user launched an exam, render the Pre-Flight Gate -> Fullscreen Lockdown Runner -> Result Screen
  if (activeExam) {
    return (
      <GprecSecureExamRunner
        exam={activeExam}
        user={user}
        onCompleteAttempt={handleCompleteAttempt}
        onExit={() => setActiveExam(null)}
        addToast={addToast}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Zero-Trust Hero Banner */}
      <div className="bg-gradient-to-br from-[#070A1F] via-[#12163B] to-[#281353] rounded-3xl p-6 text-white shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GPREC Zero-Trust Proctored Assessment Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Secure Exams & Live AI Proctoring Suite
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Conduct and take high-stakes campus placement tests with Fullscreen Lockdown, Tab-Switch & DevTools Detection, Anti-Paste Coding IDE, Webcam/Audio Telemetry, and Tamper-Evident Scorecards.
            </p>

            {/* Quick Passcode Join */}
            <form onSubmit={handleJoinByPasscode} className="pt-2 flex flex-wrap items-center gap-2 max-w-md">
              <div className="relative flex-1 min-w-[200px]">
                <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quickPasscode}
                  onChange={e => setQuickPasscode(e.target.value.toUpperCase())}
                  placeholder="Enter Room Passcode (e.g. GPREC2026)"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-mono uppercase text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs cursor-pointer transition-colors"
              >
                Unlock Room
              </button>
            </form>
          </div>

          {/* 4 Security & Performance KPIs */}
          <div className="grid grid-cols-2 gap-3 min-w-[250px]">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Scheduled Tests</div>
              <div className="text-2xl font-black text-white mt-0.5">{exams.length}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Attempts</div>
              <div className="text-2xl font-black text-cyan-300 mt-0.5">{attempts.length}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Avg Score</div>
              <div className="text-2xl font-black text-purple-300 mt-0.5">{avgScore}%</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Avg Trust</div>
              <div className="text-2xl font-black text-emerald-300 mt-0.5">{avgTrust}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 px-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'hall', label: 'Exam Hall (Take Test)', icon: Lock },
            { id: 'scorecards', label: `My Scorecards (${attempts.length})`, icon: Award },
            ...(isFacultyOrAdmin
              ? [{ id: 'conductor', label: 'Conductor Studio & Live War Room', icon: Radio, facultyOnly: true }]
              : [])
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === t.id
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.facultyOnly && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                    Faculty
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'hall' && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Placement OA', 'Super-Dream OA', 'Aptitude & CS'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer border transition-all ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: SECURE EXAM HALL */}
      {activeTab === 'hall' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredExams.map(ex => {
            const mcqCount = (ex.sections || []).reduce((a, s) => a + (s.type === 'mcq' ? (s.questions?.length || 0) : 0), 0);
            const codeCount = (ex.sections || []).reduce((a, s) => a + (s.type === 'coding' ? (s.problems?.length || 0) : 0), 0);
            const studentEmailNorm = (user?.email || 'scholar@gprec.ac.in').toLowerCase();
            const isLockedSingleAttempt = Boolean(ex.singleAttemptOnly) && attempts.some(
              a => a.examId === ex.id && (a.studentEmail || '').toLowerCase() === studentEmailNorm
            );
            return (
              <div
                key={ex.id}
                className="bg-white border border-slate-200/80 hover:border-purple-400 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 uppercase">
                        {ex.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ex.strictness}
                      </span>
                      {ex.isCustom && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          Custom Scheduled
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] font-bold text-slate-500">
                      Code: <strong className="text-slate-900">{ex.passcode}</strong>
                    </span>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-indigo-600">{ex.company}</div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{ex.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ex.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" /> {ex.durationMinutes} mins
                    </span>
                    {mcqCount > 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> {mcqCount} MCQs (-{ex.negativeMarking || 0})
                      </span>
                    )}
                    {codeCount > 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-1">
                        <Code className="w-3.5 h-3.5 text-purple-500" /> {codeCount} Live Coding
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Max {ex.maxViolations} Strikes
                    </span>
                    {ex.shuffleQuestions && (
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700">
                        Shuffled
                      </span>
                    )}
                    {ex.singleAttemptOnly && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                        1-Attempt Lock
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Fullscreen • AI Vision • Anti-Paste IDE
                  </span>
                  <button
                    type="button"
                    disabled={isLockedSingleAttempt}
                    onClick={() => setActiveExam(ex)}
                    className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all ${
                      isLockedSingleAttempt
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:opacity-95 text-white cursor-pointer'
                    }`}
                  >
                    {isLockedSingleAttempt ? <Lock className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isLockedSingleAttempt ? 'Attempt Locked' : 'Launch Secure Exam'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: MY SCORECARDS & INTEGRITY REPORTS */}
      {activeTab === 'scorecards' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Verified Exam Scorecards & Integrity Reports</h3>
            <p className="text-xs text-slate-500">Every completed proctored test generates a tamper-evident receipt and full violation audit.</p>
          </div>

          {attempts.length === 0 ? (
            <div className="py-12 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Award className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No proctored exams completed yet</div>
              <p className="text-xs text-slate-500">Start any assessment from the Exam Hall to generate your verified placement scorecard.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map(att => (
                <div key={att.id} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40 flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-900 text-cyan-300">
                          {att.receiptHash}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          att.integrityVerdict.includes('Clean')
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {att.integrityVerdict}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-1">{att.examTitle}</h4>
                      <div className="text-[11px] text-slate-500">{att.submittedAt} • {att.terminationReason}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-black text-indigo-700">{att.percentage}%</div>
                        <div className="text-[10px] font-bold text-slate-500">
                          {att.earnedMarks}/{att.totalMarks} • Trust {att.trustScore}%
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openPrintableScorecardPdf(att)}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF Report</span>
                      </button>
                    </div>
                  </div>

                  {att.sectionBreakdown?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/70">
                      {att.sectionBreakdown.map(sb => (
                        <div key={sb.id} className="p-2.5 rounded-xl bg-white border border-slate-200/70 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 truncate pr-2">{sb.title}</span>
                          <span className="font-extrabold text-slate-900 flex-shrink-0">{sb.earned}/{sb.max}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CONDUCTOR STUDIO & LIVE WAR ROOM (FACULTY / TPO / ADMINS ONLY) */}
      {activeTab === 'conductor' && (
        isFacultyOrAdmin ? (
          <GprecExamConductorPanel
            exams={exams}
            attempts={attempts}
            onPublishExam={handlePublishExam}
            onDeleteExam={handleDeleteExam}
            addToast={addToast}
          />
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-sora">Faculty & Conductor Access Restricted</h3>
            <p className="text-xs text-slate-500 max-w-md">
              The Conductor Studio & Live War Room is strictly restricted to Faculty Coordinators, TPO Officers, and Institution Admins. Students cannot access exam authoring or live invigilation.
            </p>
            <button
              onClick={() => setActiveTab('hall')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
            >
              Return to Exam Hall
            </button>
          </div>
        )
      )}
    </div>
  );
}
