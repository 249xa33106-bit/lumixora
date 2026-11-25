import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, FileText, CheckCircle, BarChart3, Sparkles, 
  RefreshCcw, Award, Clock, Users, ShieldAlert, TrendingUp, Download,
  Target, Layers, Zap, Check, AlertCircle, Search, Filter, Calendar,
  FileSpreadsheet, ArrowUpRight
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { db } from '../config/firebase';
import { supabase } from '../config/supabase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';
import FounderTestManager from '../components/FounderTestManager';
import FounderSubmissionsManager from '../components/FounderSubmissionsManager';
import FounderAttendanceManager from '../components/FounderAttendanceManager';
import { isGprecPlacementSubdomain } from '../utils/placementSubdomain';

export default function FacultyPortal({ user, setActiveTab }) {
  const { addToast } = useToast();
  const isGprec = isGprecPlacementSubdomain();

  // Mode switcher: 'tests' | 'submissions' | 'analytics' | (optional 'attendance' only on GPREC)
  const [activeView, setActiveView] = useState('tests');

  useEffect(() => {
    if (!isGprec && activeView === 'attendance') {
      setActiveView('tests');
    }
  }, [isGprec, activeView]);

  // Real-time Test Metrics
  const [submissionsData, setSubmissionsData] = useState([]);
  const [testsCount, setTestsCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(false);
  const [gradebookSearch, setGradebookSearch] = useState('');

  // College & Faculty metadata
  const [activeFacultyCollege, setActiveFacultyCollege] = useState(() => {
    const activeName = localStorage.getItem('lumixora_active_campus_name');
    return (user?.role === 'founder' && activeName && activeName !== 'All Campuses (HQ)') 
      ? activeName 
      : (user?.college || 'GPREC');
  });

  useEffect(() => {
    const handleCampusEvt = (e) => {
      if (e.detail?.campusName) {
        setActiveFacultyCollege(e.detail.campusName);
      }
    };
    window.addEventListener('lumixora_campus_changed', handleCampusEvt);
    return () => window.removeEventListener('lumixora_campus_changed', handleCampusEvt);
  }, []);

  const facultyCollege = user?.role === 'founder' ? activeFacultyCollege : (user?.college || 'GPREC');

  const cleanName = (str) => {
    if (!str || typeof str !== 'string') return 'Faculty Member';
    let cleaned = str;
    if (cleaned.includes('{')) cleaned = cleaned.split('{')[0].trim();
    cleaned = cleaned.replace(/[{}":;]/g, '').trim();
    return cleaned || 'Faculty Member';
  };
  const displayName = cleanName(user?.name);

  // Load Real Test Submissions strictly from live Database (Zero synthetic numbers)
  const loadAnalyticsData = async () => {
    setLoadingStats(true);
    try {
      const subsMap = new Map();

      // 1. Fetch from Supabase test_results
      if (supabase && typeof supabase.from === 'function') {
        try {
          const { data: sbResults } = await supabase
            .from('test_results')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(2000);
          if (Array.isArray(sbResults)) {
            sbResults.forEach(r => {
              subsMap.set(String(r.id), {
                id: String(r.id),
                ...r,
                score: Number(r.score) || 0,
                testTitle: r.test_title || r.testTitle || 'Standard Assessment',
                submittedAt: r.created_at || r.date || r.submittedAt
              });
            });
          }
        } catch (_sbErr) {
          console.warn('Supabase test_results fetch notice:', _sbErr);
        }
      }

      // 2. Fetch from Firestore test_results
      if (db) {
        try {
          const subSnap = await getDocs(collection(db, 'test_results'));
          subSnap.forEach(d => {
            const data = d.data();
            subsMap.set(String(d.id), {
              id: String(d.id),
              ...data,
              score: Number(data.score) || 0,
              testTitle: data.testTitle || data.test_title || 'Standard Assessment',
              submittedAt: data.date || data.submittedAt || data.completedAt
            });
          });
        } catch (_fsErr) {
          console.warn('Firestore test_results fetch notice:', _fsErr);
        }

        // 3. Count Real Active Tests
        try {
          const testsSnap = await getDocs(collection(db, 'tests'));
          const deletedIds = new Set(JSON.parse(localStorage.getItem('lumixora_deleted_test_ids') || '[]'));
          const realTests = testsSnap.docs.filter(d => !deletedIds.has(d.id) && d.data().active !== false);
          setTestsCount(realTests.length);
        } catch (_testsErr) {
          console.warn('Firestore tests fetch notice:', _testsErr);
        }
      }

      setSubmissionsData(Array.from(subsMap.values()));
    } catch (err) {
      console.warn('Analytics telemetry notice:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  // Compute Advanced Analytics Metrics
  const analyticsSummary = useMemo(() => {
    const totalSubs = submissionsData.length;
    if (totalSubs === 0) {
      return {
        totalSubmissions: 0,
        averageScore: 0,
        passRate: 0,
        topScore: 0,
        testsBreakdown: []
      };
    }

    let totalScore = 0;
    let passCount = 0;
    let topScore = 0;
    const testMap = {};

    submissionsData.forEach(s => {
      const score = Number(s.score) || 0;
      totalScore += score;
      if (score >= 60) passCount++;
      if (score > topScore) topScore = score;

      const testTitle = s.testTitle || s.testName || 'Standard Assessment';
      if (!testMap[testTitle]) {
        testMap[testTitle] = { title: testTitle, count: 0, totalScore: 0, maxScore: 0, passCount: 0 };
      }
      testMap[testTitle].count++;
      testMap[testTitle].totalScore += score;
      if (score > testMap[testTitle].maxScore) testMap[testTitle].maxScore = score;
      if (score >= 60) testMap[testTitle].passCount++;
    });

    const averageScore = Math.round(totalScore / totalSubs);
    const passRate = Math.round((passCount / totalSubs) * 100);

    const testsBreakdown = Object.values(testMap).map(t => ({
      ...t,
      avg: Math.round(t.totalScore / t.count),
      passRate: Math.round((t.passCount / t.count) * 100)
    }));

    return {
      totalSubmissions: totalSubs,
      averageScore,
      passRate,
      topScore,
      testsBreakdown
    };
  }, [submissionsData]);

  // Export Master Gradebook as Official Institutional Excel (.xlsx)
  const handleExportGradebookExcel = () => {
    if (submissionsData.length === 0) {
      addToast({ message: 'No student submissions available to export.', type: 'warning' });
      return;
    }

    try {
      const exportRows = submissionsData.map((s, idx) => {
        const scoreVal = Number(s.score) || 0;
        const roll = s.rollNumber || s.roll_number || (s.userEmail ? s.userEmail.split('@')[0] : (s.userId || '-'));
        const isPass = scoreVal >= 60;

        return {
          'S.No': idx + 1,
          'Submission ID': s.id || `SUB-${idx + 1}`,
          'Roll Number': String(roll).toUpperCase(),
          'Student Name / Email': s.userName || s.name || s.userEmail || '-',
          'Department / Branch': s.department || s.branch || 'General',
          'Assessment Title': s.testTitle || s.testName || 'Standard Assessment',
          'Score (%)': `${scoreVal}%`,
          'Result': isPass ? 'PASS (≥60%)' : 'NEEDS IMPROVEMENT',
          'Submitted Date': s.completedAt || s.submittedAt || s.createdAt || '-'
        };
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportRows);

      ws['!cols'] = [
        { wch: 6 },
        { wch: 18 },
        { wch: 16 },
        { wch: 28 },
        { wch: 18 },
        { wch: 30 },
        { wch: 12 },
        { wch: 20 },
        { wch: 22 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Faculty_Gradebook');
      XLSX.writeFile(wb, `GPREC_Master_Gradebook_${facultyCollege}_${new Date().toISOString().split('T')[0]}.xlsx`);
      addToast({ message: 'Official Master Gradebook (.xlsx) exported successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to export gradebook spreadsheet.', type: 'error' });
    }
  };

  // Export Master Gradebook as CSV fallback
  const handleExportGradebookCSV = () => {
    if (submissionsData.length === 0) {
      addToast({ message: 'No student submissions available to export.', type: 'warning' });
      return;
    }

    const headers = ['S.No', 'Roll Number', 'Student Name / Email', 'Assessment Title', 'Score (%)', 'Result', 'Submitted At'];
    const rows = submissionsData.map((s, idx) => {
      const scoreVal = Number(s.score) || 0;
      const roll = s.rollNumber || s.roll_number || (s.userEmail ? s.userEmail.split('@')[0] : (s.userId || '-'));
      const isPass = scoreVal >= 60;
      return [
        idx + 1,
        `"${String(roll).toUpperCase()}"`,
        `"${(s.userName || s.name || s.userEmail || '-').replace(/"/g, '""')}"`,
        `"${(s.testTitle || s.testName || 'Assessment').replace(/"/g, '""')}"`,
        `${scoreVal}%`,
        `"${isPass ? 'PASS' : 'FAIL'}"`,
        `"${s.completedAt || s.submittedAt || s.createdAt || '-'}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Gradebook_${facultyCollege}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ message: 'Master gradebook (.csv) exported successfully!', type: 'success' });
  };

  // Filtered breakdown based on search
  const filteredTestsBreakdown = useMemo(() => {
    if (!gradebookSearch.trim()) return analyticsSummary.testsBreakdown;
    const q = gradebookSearch.toLowerCase().trim();
    return analyticsSummary.testsBreakdown.filter(t => t.title.toLowerCase().includes(q));
  }, [analyticsSummary.testsBreakdown, gradebookSearch]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-fade-in text-white">
      {/* ─── COMMAND HERO HEADER (ELEGANT INSTITUTIONAL NAVY & GOLD) ───────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#111C44] to-[#0B132B] border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm font-sora">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                T&P Faculty • Assessment & Examination Command
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-amber-300 font-black text-xs uppercase tracking-wider shadow-sm font-mono">
                {facultyCollege}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Proctoring Online
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-sora">
              Welcome, Prof. {displayName} 🎓
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              Design AI-powered coding tests, enforce anti-cheat proctoring, inspect live student submissions, and auto-generate accredited grade reports.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadAnalyticsData}
              disabled={loadingStats}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 text-xs font-bold flex items-center gap-1.5"
              title="Refresh Assessment Telemetry"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin text-amber-400' : ''}`} />
              <span>{loadingStats ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Assessment KPI Metrics (Strictly Real Data, Zero Fake Fallbacks) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div 
            onClick={() => setActiveView('tests')}
            className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Active Assessments</span>
              <FileText className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-2xl font-black font-sora text-amber-300 block">
              {loadingStats ? '...' : `${testsCount} Active`}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
              Coding & MCQ Tests
            </span>
          </div>

          <div 
            onClick={() => setActiveView('submissions')}
            className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Evaluated Submissions</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-2xl font-black font-sora text-emerald-300 block">
              {loadingStats ? '...' : `${analyticsSummary.totalSubmissions} Records`}
            </span>
            <span className="text-[10px] text-emerald-400/80 font-semibold block mt-0.5">
              Live Database Evaluations
            </span>
          </div>

          <div 
            onClick={() => setActiveView('analytics')}
            className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Department Pass Rate</span>
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-2xl font-black font-sora text-cyan-300 block">
              {loadingStats ? '...' : (analyticsSummary.totalSubmissions > 0 ? `${analyticsSummary.passRate}%` : 'N/A')}
            </span>
            <span className="text-[10px] text-cyan-400/80 font-semibold block mt-0.5">
              {analyticsSummary.totalSubmissions > 0 ? 'Qualifying Scores ≥ 60%' : 'No Submissions Yet'}
            </span>
          </div>

          <div 
            onClick={() => setActiveView('analytics')}
            className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Class Average Score</span>
              <Award className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-2xl font-black font-sora text-amber-300 block">
              {loadingStats ? '...' : (analyticsSummary.totalSubmissions > 0 ? `${analyticsSummary.averageScore}%` : 'N/A')}
            </span>
            <span className="text-[10px] text-amber-400/80 font-semibold block mt-0.5">
              {analyticsSummary.totalSubmissions > 0 ? `Top Score: ${analyticsSummary.topScore}%` : 'Awaiting Student Tests'}
            </span>
          </div>
        </div>

        {/* ─── NAVIGATION TABS ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-6 border-t border-white/10 pt-4 custom-scrollbar">
          <button
            onClick={() => setActiveView('tests')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-sm ${
              activeView === 'tests' 
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Tests & Assignments</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeView === 'tests' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
            }`}>
              {testsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveView('submissions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-sm ${
              activeView === 'submissions' 
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Student Submissions & Scorecards</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeView === 'submissions' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
            }`}>
              {analyticsSummary.totalSubmissions}
            </span>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-sm ${
              activeView === 'analytics' 
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Performance Analytics & Gradebook</span>
          </button>

          {isGprec && (
            <button
              onClick={() => setActiveView('attendance')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-sm ${
                activeView === 'attendance' 
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>ITCA Attendance</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeView === 'attendance' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-400/20 text-amber-300'
              }`}>
                OFFICIAL 📋
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ─── TAB 1: TESTS & ASSIGNMENTS ──────────────────────────────────────── */}
      {activeView === 'tests' && (
        <div className="animate-fade-in">
          <FounderTestManager />
        </div>
      )}

      {/* ─── TAB 2: STUDENT SUBMISSIONS & CODE INSPECTOR ──────────────────────── */}
      {activeView === 'submissions' && (
        <div className="animate-fade-in">
          <FounderSubmissionsManager />
        </div>
      )}

      {/* ─── TAB 3: PERFORMANCE ANALYTICS & MASTER GRADEBOOK ─────────────────── */}
      {activeView === 'analytics' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Gradebook Controls Bar */}
          <div className="p-5 rounded-2xl bg-[#0B132B] border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <h2 className="text-base font-bold font-sora text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Department Examination Analytics & Master Gradebook</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Accredited scorecard metrics, student marks breakdown, and exportable grade registers.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportGradebookExcel}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Excel (.xlsx)</span>
              </button>

              <button
                onClick={handleExportGradebookCSV}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Assessment Breakdown Matrix */}
          <div className="p-6 rounded-3xl bg-[#0B132B] border border-white/10 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Assessment Breakdown Matrix</span>
              </h3>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={gradebookSearch}
                  onChange={(e) => setGradebookSearch(e.target.value)}
                  placeholder="Filter assessments..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {analyticsSummary.testsBreakdown.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-white/[0.02] border border-white/5 rounded-2xl">
                <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-200">No Assessment Records Found</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  No submissions have been evaluated yet. When students complete assessments in the Tests portal, automated scorecard analytics will render here in real time.
                </p>
              </div>
            ) : filteredTestsBreakdown.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white/[0.02] border border-white/5 rounded-2xl text-xs">
                No assessments matching "{gradebookSearch}".
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="pb-3 font-bold">Assessment Title</th>
                      <th className="pb-3 font-bold">Submissions</th>
                      <th className="pb-3 font-bold">Class Average</th>
                      <th className="pb-3 font-bold">Highest Score</th>
                      <th className="pb-3 font-bold">Pass Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTestsBreakdown.map((t, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 font-bold text-white flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{t.title}</span>
                        </td>
                        <td className="py-3 font-mono text-slate-300">{t.count} scholars</td>
                        <td className="py-3 font-mono font-bold text-cyan-300">{t.avg}%</td>
                        <td className="py-3 font-mono font-bold text-emerald-400">{t.maxScore}%</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            t.passRate >= 75 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                            t.passRate >= 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                            'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                          }`}>
                            {t.passRate}% Pass
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 4: OFFICIAL ITCA ATTENDANCE MANAGEMENT (GPREC EXCLUSIVE) ────── */}
      {isGprec && activeView === 'attendance' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-[#0B132B] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold shrink-0">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2 font-sora">
                  Official ITCA Attendance Hub • G. Pulla Reddy Engineering College
                </h4>
                <p className="text-xs text-slate-300">
                  Manage student course attendance, batch uploads, real-time roll number audits, and official university thresholds (75% mandatory).
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase font-mono bg-amber-500/20 border border-amber-400/40 text-amber-300 self-start sm:self-center">
              ITCA VERIFIED
            </span>
          </div>
          <FounderAttendanceManager />
        </div>
      )}
    </div>
  );
}
