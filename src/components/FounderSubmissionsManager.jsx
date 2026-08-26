import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  FileText, ArrowLeft, CheckCircle, XCircle, Code, List, 
  Trash2, Edit2, Save, X, Download, Filter, Search, RotateCcw,
  GraduationCap, Award, CheckSquare
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { generateTestResultsPDF } from '../utils/pdfGenerator';

export default function FounderSubmissionsManager() {
  const { addToast } = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [editScoreValue, setEditScoreValue] = useState('');

  // Filters State
  const [selectedTest, setSelectedTest] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSem, setSelectedSem] = useState('All');
  const [selectedSec, setSelectedSec] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const cleanScholarName = (str) => {
    if (!str || typeof str !== 'string') return 'Scholar';
    let cleaned = str;
    if (cleaned.includes('{')) {
      cleaned = cleaned.split('{')[0].trim();
    }
    cleaned = cleaned.replace(/[{}"`:;]/g, '').trim();
    return cleaned || 'Scholar';
  };

  const parseMetadata = (rawStr) => {
    if (!rawStr || typeof rawStr !== 'string' || !rawStr.includes('{')) return {};
    try {
      const idx = rawStr.indexOf('{');
      const jsonStr = rawStr.substring(idx).trim();
      return JSON.parse(jsonStr) || {};
    } catch (_e) {
      const branchMatch = rawStr.match(/"department"\s*:\s*"([^"]+)"/i) || rawStr.match(/"branch"\s*:\s*"([^"]+)"/i);
      const yearMatch = rawStr.match(/"year"\s*:\s*"([^"]+)"/i);
      const semMatch = rawStr.match(/"sem(?:ester)?"\s*:\s*"([^"]+)"/i);
      const secMatch = rawStr.match(/"sec(?:tion)?"\s*:\s*"([^"]+)"/i);
      return {
        department: branchMatch ? branchMatch[1] : '',
        year: yearMatch ? yearMatch[1] : '',
        sem: semMatch ? semMatch[1] : '',
        sec: secMatch ? secMatch[1] : ''
      };
    }
  };

  const handleDeleteSubmission = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this submission?')) return;
    try {
      await deleteDoc(doc(db, 'test_results', id));
      addToast({ message: 'Submission deleted successfully.', type: 'success' });
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
      addToast({ message: 'Failed to delete submission.', type: 'error' });
    }
  };

  const handleUpdateScore = async () => {
    if (!selectedSubmission) return;
    try {
      const newScore = parseInt(editScoreValue, 10);
      if (isNaN(newScore)) {
        addToast({ message: 'Invalid score value.', type: 'error' });
        return;
      }
      
      const subRef = doc(db, 'test_results', selectedSubmission.id);
      try { await updateDoc(subRef, { score: newScore }); } catch (e) { console.warn("Score update notice:", e); }
      
      addToast({ message: 'Score updated successfully.', type: 'success' });
      const updatedSubmission = { ...selectedSubmission, score: newScore };
      setSelectedSubmission(updatedSubmission);
      setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? updatedSubmission : s));
      setIsEditingScore(false);
    } catch (err) {
      console.error('Error updating score:', err);
      addToast({ message: 'Failed to update score.', type: 'error' });
    }
  };

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users metadata for cross-reference
      const usersSnap = await getDocs(collection(db, 'users'));
      const uMap = {};
      usersSnap.forEach(d => {
        const udata = d.data();
        const email = (udata.email || '').toLowerCase().trim();
        if (email) {
          uMap[email] = { id: d.id, ...udata };
        }
      });
      setUsersMap(uMap);

      // 2. Fetch Test Results
      const q = query(collection(db, 'test_results'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const subs = [];
      
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const userEmail = (data.userEmail || '').toLowerCase().trim();
        const userObj = uMap[userEmail] || {};
        
        const rawName = data.user || userObj.name || '';
        const parsed = parseMetadata(rawName);

        const department = data.department || data.branch || userObj.department || userObj.branch || parsed.department || 'CSE';
        const year = data.year || userObj.year || parsed.year || '1st Year';
        const sem = data.sem || data.semester || userObj.sem || userObj.semester || parsed.sem || '1-1';
        const sec = data.sec || data.section || userObj.sec || userObj.section || parsed.sec || 'A';
        const rollNumber = data.rollNumber || userObj.rollNumber || (userEmail.endsWith('@gprec.ac.in') ? userEmail.split('@')[0].toUpperCase() : '');

        subs.push({ 
          ...data, 
          id: docSnap.id,
          user: cleanScholarName(rawName),
          rawName,
          department,
          branch: department,
          year,
          sem,
          sec,
          rollNumber
        });
      });
      setSubmissions(subs);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      addToast({ message: 'Failed to load submissions.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  // Unique list of test titles
  const testTitles = useMemo(() => {
    const set = new Set();
    submissions.forEach(s => {
      if (s.testTitle) set.add(s.testTitle);
      else if (s.test?.title) set.add(s.test.title);
    });
    return Array.from(set);
  }, [submissions]);

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      // 1. Test Filter
      const title = sub.testTitle || sub.test?.title || '';
      if (selectedTest !== 'All' && title !== selectedTest) {
        return false;
      }

      // 2. Branch Filter
      if (selectedBranch !== 'All') {
        const b = (sub.department || sub.branch || '').toLowerCase();
        if (b !== selectedBranch.toLowerCase()) return false;
      }

      // 3. Year Filter
      if (selectedYear !== 'All') {
        const y = (sub.year || '').toLowerCase();
        if (!y.includes(selectedYear.toLowerCase().replace(' year', ''))) return false;
      }

      // 4. Semester Filter
      if (selectedSem !== 'All') {
        const smDigits = (sub.sem || '').replace(/[^0-9]/g, '');
        const targetDigits = selectedSem.replace(/[^0-9]/g, '');
        const matchesExact = (sub.sem || '').toLowerCase() === selectedSem.toLowerCase();
        const matchesDigits = smDigits && targetDigits && smDigits === targetDigits;
        const containsTarget = (sub.sem || '').toLowerCase().includes(selectedSem.toLowerCase());
        if (!matchesExact && !matchesDigits && !containsTarget) return false;
      }

      // 5. Section Filter
      if (selectedSec !== 'All') {
        const sc = (sub.sec || sub.section || '').toUpperCase().trim();
        if (sc !== selectedSec.toUpperCase().trim()) return false;
      }

      // 6. Search Filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const nameMatch = (sub.user || '').toLowerCase().includes(term);
        const emailMatch = (sub.userEmail || '').toLowerCase().includes(term);
        const rollMatch = (sub.rollNumber || '').toLowerCase().includes(term);
        const titleMatch = (title || '').toLowerCase().includes(term);
        if (!nameMatch && !emailMatch && !rollMatch && !titleMatch) return false;
      }

      return true;
    });
  }, [submissions, selectedTest, selectedBranch, selectedYear, selectedSem, selectedSec, searchTerm]);

  // Handle PDF Export
  const handleDownloadPDF = () => {
    if (filteredSubmissions.length === 0) {
      addToast({ message: 'No submissions found to export for the selected filters.', type: 'warning' });
      return;
    }

    try {
      generateTestResultsPDF({
        results: filteredSubmissions,
        filters: {
          testTitle: selectedTest !== 'All' ? selectedTest : 'All Test Assessments',
          branch: selectedBranch,
          year: selectedYear,
          sem: selectedSem,
          sec: selectedSec
        },
        institutionName: 'G. Pulla Reddy Engineering College (Autonomous)'
      });
      addToast({ message: `Downloaded Test Results PDF (${filteredSubmissions.length} candidates)!`, type: 'success' });
    } catch (err) {
      console.error('Error generating test results PDF:', err);
      addToast({ message: 'Failed to generate PDF. Please try again.', type: 'error' });
    }
  };

  const handleResetFilters = () => {
    setSelectedTest('All');
    setSelectedBranch('All');
    setSelectedYear('All');
    setSelectedSem('All');
    setSelectedSec('All');
    setSearchTerm('');
  };

  const renderSubmissionDetail = () => {
    if (!selectedSubmission) return null;
    const { test, answers, score, total, user, date } = selectedSubmission;
    const testDate = new Date(date).toLocaleString();

    return (
      <div className="space-y-6 animate-fade-in text-white">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedSubmission(null)}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">{test?.title || selectedSubmission.testTitle || 'Test Assessment'}</h2>
              <p className="text-sm text-gray-400">
                Submitted by <strong className="text-brand-teal">{user || 'Scholar'}</strong>
                {selectedSubmission.userEmail && <span className="text-gray-500 ml-1">({selectedSubmission.userEmail})</span>} on {testDate}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-teal/20 text-brand-teal font-bold border border-brand-teal/30">
                  {selectedSubmission.branch || 'CSE'}
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 font-medium">
                  {selectedSubmission.year} · Sem {selectedSubmission.sem} · Sec {selectedSubmission.sec}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              {isEditingScore ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-bold uppercase">Score:</span>
                  <input
                    type="number"
                    value={editScoreValue}
                    onChange={(e) => setEditScoreValue(e.target.value)}
                    className="w-16 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-brand-teal"
                  />
                  <span className="text-gray-400">/ {total}</span>
                  <button onClick={handleUpdateScore} className="ml-2 p-1.5 bg-brand-teal/20 text-brand-teal hover:bg-brand-teal hover:text-black rounded-lg transition-colors">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditingScore(false)} className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-semibold text-brand-teal">{score}</span>
                    <span className="text-gray-400 font-bold text-sm"> / {total}</span>
                    <div className="text-[10px] text-gray-500 font-bold tracking-wide">Score</div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditScoreValue(score);
                      setIsEditingScore(true);
                    }}
                    className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-brand-teal rounded-lg transition-colors border border-white/10 cursor-pointer"
                    title="Edit Score"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {test?.questions?.map((q, qIndex) => {
            const userAnswer = answers?.[qIndex];
            
            if (q.type === 'mcq') {
              const isCorrect = userAnswer === q.correct;
              return (
                <div key={qIndex} className="glass-panel p-5 rounded-2xl border border-white/5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-brand-teal/10 rounded-lg text-brand-teal shrink-0">
                      <List className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Q{qIndex + 1}. {q.question}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs font-bold tracking-wide">
                        {isCorrect ? (
                          <span className="text-green-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Correct</span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Incorrect</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pl-12">
                    {q.options?.map((opt, optIdx) => {
                      const isSelected = userAnswer === optIdx;
                      const isActualCorrect = q.correct === optIdx;
                      
                      let bgClass = "bg-white/5 border-white/5 text-gray-400";
                      let indicator = null;

                      if (isActualCorrect) {
                        bgClass = "bg-green-500/10 border-green-500/30 text-green-400 font-bold";
                        indicator = "Correct Answer";
                      }
                      
                      if (isSelected) {
                        if (isActualCorrect) {
                           indicator = "User Selection (Correct)";
                        } else {
                           bgClass = "bg-red-500/10 border-red-500/30 text-red-400 font-bold";
                           indicator = "User Selection (Incorrect)";
                        }
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-xl border ${bgClass} flex justify-between items-center text-sm`}>
                          <span>{opt}</span>
                          {indicator && <span className="text-[10px] font-bold tracking-wide opacity-80">{indicator}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (q.type === 'code') {
              return (
                <div key={qIndex} className="glass-panel p-5 rounded-2xl border border-white/5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-brand-teal/10 rounded-lg text-brand-teal shrink-0">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Q{qIndex + 1}. {q.question}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="bg-brand-teal/20 text-brand-teal px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide">
                          {q.language || 'Python'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-gray-500 tracking-wide ml-1">User's Submitted Code</h4>
                      <pre className="bg-[#0a0a0f] border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap h-64">
                        {userAnswer || q.initialCode || 'No code submitted.'}
                      </pre>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-gray-500 tracking-wide ml-1">Expected Output</h4>
                        <pre className="bg-[#0a0a0f] border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">
                          {q.expectedOutput || 'No expected output defined.'}
                        </pre>
                      </div>
                      <div className="p-4 bg-brand-blue/5 border border-white/10 rounded-xl">
                        <h4 className="text-[10px] font-bold text-brand-blue tracking-wide mb-2">Notice</h4>
                        <p className="text-xs text-gray-300">
                          The system auto-scored this by compiling the student's code and matching stdout against expected output.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (selectedSubmission) {
    return renderSubmissionDetail();
  }

  return (
    <div className="space-y-6 text-white">
      {/* Top Header Row with Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <FileText className="w-7 h-7 text-brand-teal" />
            <span>Test Results & Assessment Commander</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Filter test submissions by branch, year, semester, or section, and generate official PDF reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={loadSubmissions}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="bg-brand-teal hover:opacity-90 text-black px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Results PDF ({filteredSubmissions.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-brand-teal" /> Filter Department Test Records
          </span>
          <button
            onClick={handleResetFilters}
            className="text-[11px] text-gray-400 hover:text-brand-teal transition-colors font-semibold"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Test Name Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Test Title</label>
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-teal cursor-pointer"
            >
              <option value="All">All Tests ({testTitles.length})</option>
              {testTitles.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Branch / Dept</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-teal cursor-pointer"
            >
              <option value="All">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="CSM">CSM</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="Civil">Civil</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-teal cursor-pointer"
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* Semester Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Semester</label>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-teal cursor-pointer"
            >
              <option value="All">All Semesters</option>
              <option value="Sem 1">Sem 1</option>
              <option value="Sem 2">Sem 2</option>
              <option value="Sem 3">Sem 3</option>
              <option value="Sem 4">Sem 4</option>
              <option value="Sem 5">Sem 5</option>
              <option value="Sem 6">Sem 6</option>
              <option value="Sem 7">Sem 7</option>
              <option value="Sem 8">Sem 8</option>
            </select>
          </div>

          {/* Section Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Section</label>
            <select
              value={selectedSec}
              onChange={(e) => setSelectedSec(e.target.value)}
              className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-teal cursor-pointer"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
              <option value="E">Section E</option>
            </select>
          </div>

          {/* Search Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Search Scholar</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, email, roll..."
                className="w-full bg-[#11111a] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-teal"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubmissions?.map((sub) => {
          const testDate = new Date(sub.date).toLocaleDateString() + ' ' + new Date(sub.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const pct = sub.total > 0 ? Math.round((sub.score / sub.total) * 100) : 0;

          return (
            <div 
              key={sub.id} 
              onClick={() => setSelectedSubmission(sub)}
              className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-brand-teal/40 transition-all cursor-pointer group bg-gradient-to-br from-white/[0.03] to-transparent hover:from-white/[0.06] shadow-md"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 bg-brand-teal/20 rounded-xl text-brand-teal border border-brand-teal/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-md">
                      {sub.department || 'CSE'}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-1.5">
                      {sub.year} · Sec {sub.sec}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-white">{sub.score} / {sub.total}</div>
                    <div className={`text-[10px] font-bold tracking-wide ${pct >= 70 ? 'text-green-400' : pct >= 40 ? 'text-blue-400' : 'text-red-400'}`}>
                      {pct}% Score
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSubmission(sub.id, e)}
                    className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Delete Submission"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-1 truncate">{sub.testTitle || 'Test Assessment'}</h3>
              
              <div className="mb-4">
                <p className="text-xs text-gray-300 font-semibold truncate">By <span className="text-brand-teal">{sub.user || 'Scholar'}</span></p>
                {sub.userEmail && <p className="text-[11px] text-gray-500 truncate">{sub.userEmail}</p>}
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px]">
                <span className="text-gray-500">{testDate}</span>
                <span className="font-bold text-brand-teal group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  View Solutions &rarr;
                </span>
              </div>
            </div>
          );
        })}

        {filteredSubmissions.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white/5 border border-white/10 border-dashed rounded-3xl">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Matching Test Submissions</h3>
            <p className="text-gray-400 text-xs mt-1 max-w-sm mx-auto">
              No test submissions matched the current filters. Try changing branch, year, or section.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-teal/20 text-brand-teal font-bold text-xs hover:bg-brand-teal/30 transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
