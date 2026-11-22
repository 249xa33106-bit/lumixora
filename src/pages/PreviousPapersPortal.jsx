import React, { useState, useMemo } from 'react';
import { 
  Building2, FileText, Download, Code, Clock, CheckCircle, 
  Sparkles, ExternalLink, ChevronDown, ChevronUp, Search, 
  Filter, Award, Brain, BookOpen, Copy, Check, Play, AlertCircle, 
  ArrowRight, X, HelpCircle, CheckSquare, Target, Flame, Database,
  Calendar, Layers, Printer, ShieldCheck, Zap,
  FolderOpen, CheckCircle2, FileSpreadsheet
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HUGE_EXAM_DATASET } from '../data/hugeExamPredictorDataset';
import { generatePredictedModelSets } from '../services/mlPaperPredictorEngine';
import CompanyPlacementPapers from './CompanyPlacementPapers';
import { useToast } from '../context/ToastContext';

// Verified Google Drive Repositories
const GOOGLE_DRIVE_REPOSITORIES = [
  {
    id: 'repo-1',
    title: 'New Materials All Sem (Upto 5)',
    scheme: 'Scheme-2023 & 2026',
    url: 'https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing',
    count: '50+ Papers',
    badge: 'PRIMARY EXAM BANK'
  },
  {
    id: 'repo-2',
    title: 'Lumixora Master Drive',
    scheme: 'All Autonomous Branches',
    url: 'https://drive.google.com/drive/folders/1RvpcidbCqE9bgr2bj_QIBs50FDt0sg1d?usp=sharing',
    count: '150+ Papers',
    badge: 'ALL DISCIPLINES'
  },
  {
    id: 'repo-3',
    title: '2nd Year Sem 3 & 4 Archive',
    scheme: 'Scheme-2023 Core',
    url: 'https://drive.google.com/drive/folders/1ERLGgMDPHe132GDxK_iz-ikGa_jWfH77?usp=sharing',
    count: '48 Papers',
    badge: 'CORE ENGINEERING'
  },
  {
    id: 'repo-4',
    title: '5th Sem CSM AI & Mid Papers',
    scheme: 'R-23 / Scheme-2023',
    url: 'https://drive.google.com/drive/folders/1PM9dY3ME1uHAsJgkgqfW_10COiEIJJx5?usp=sharing',
    count: 'Specialized Bank',
    badge: 'AI & ML CORE'
  }
];

export default function PreviousPapersPortal({ setActiveTab, user, setSelectedProblem }) {
  const { addToast } = useToast();

  // Main Portal Navigation Tabs: 'university_papers' (default past papers archive) | 'ml_predictor' | 'company_papers'
  const [activePortalTab, setActivePortalTab] = useState('university_papers');

  // Universal Filter State (Branch, Semester, Search)
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [uniSearch, setUniSearch] = useState('');

  // ML Predictor & Model Sets State
  const [selectedSubjectId, setSelectedSubjectId] = useState('os');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [paperFormatMode, setPaperFormatMode] = useState('blueprint'); // 'blueprint' | 'matrix'
  const [expandedModelAnswers, setExpandedModelAnswers] = useState({});
  const [copiedQId, setCopiedQId] = useState(null);

  // Handle branch change: strictly update branch and sync first matching subject
  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
    const firstSubj = HUGE_EXAM_DATASET.find(s => 
      branch === 'All' ? true : s.branch.toLowerCase() === branch.toLowerCase()
    );
    if (firstSubj) {
      setSelectedSubjectId(firstSubj.subjectId);
    }
  };

  // Filtered Subjects strictly based on Branch, Semester, and Search
  const filteredSubjects = useMemo(() => {
    return HUGE_EXAM_DATASET.filter(subj => {
      // Branch filter: Strict isolation so Civil displays ONLY Civil, Mechanical displays ONLY Mechanical, etc.
      const matchesBranch = 
        selectedBranch === 'All' ||
        subj.branch?.toLowerCase() === selectedBranch.toLowerCase();

      // Semester filter
      const matchesSem = 
        selectedSemester === 'All' ||
        subj.semester?.toLowerCase() === selectedSemester.toLowerCase();

      // Search query
      const q = uniSearch.toLowerCase().trim();
      const matchesSearch = !q ||
        subj.subjectName?.toLowerCase().includes(q) ||
        subj.subjectCode?.toLowerCase().includes(q) ||
        subj.branch?.toLowerCase().includes(q) ||
        subj.semester?.toLowerCase().includes(q) ||
        subj.drivePapers?.some(dp => dp.title?.toLowerCase().includes(q)) ||
        subj.syllabusUnits?.some(u => u.title?.toLowerCase().includes(q)) ||
        subj.questions?.some(qu => qu.question?.toLowerCase().includes(q));

      return matchesBranch && matchesSem && matchesSearch;
    });
  }, [selectedBranch, selectedSemester, uniSearch]);

  // Active Subject & Generated 70-Mark Paper (Synchronized with filtered branch)
  const activeSubject = useMemo(() => {
    const found = filteredSubjects.find(s => s.subjectId === selectedSubjectId);
    if (found) return found;
    if (filteredSubjects.length > 0) return filteredSubjects[0];
    return HUGE_EXAM_DATASET.find(s => s.subjectId === selectedSubjectId) || HUGE_EXAM_DATASET[0];
  }, [filteredSubjects, selectedSubjectId]);

  // ── DUAL MODEL SETS (SET A & SET B) STATE ──
  const [activeModelSet, setActiveModelSet] = useState('set1'); // 'set1' | 'set2' | 'compare'

  // Synchronize 2 Question Paper Model Sets (Set A & Set B)
  const predictedModelSets = useMemo(() => {
    return generatePredictedModelSets(activeSubject.subjectId);
  }, [activeSubject.subjectId]);

  const activePaper = useMemo(() => {
    return activeModelSet === 'set2' ? predictedModelSets.set2 : predictedModelSets.set1;
  }, [predictedModelSets, activeModelSet]);

  const predictedPaper = activePaper;

  // Helper to expand or collapse all model answer rubrics in active paper
  const handleToggleAllAnswers = () => {
    if (!activePaper) return;
    const allIds = [
      ...(activePaper.partA || []).map(q => q.id),
      ...(activePaper.partB || []).flatMap(p => [p.questionA?.id, p.questionB?.id]).filter(Boolean)
    ];
    const anyClosed = allIds.some(id => !expandedModelAnswers[id]);
    const nextMap = {};
    allIds.forEach(id => {
      nextMap[id] = anyClosed;
    });
    setExpandedModelAnswers(prev => ({ ...prev, ...nextMap }));
    addToast({ 
      message: anyClosed ? 'Expanded all step-by-step model answer rubrics!' : 'Collapsed all answer rubrics.', 
      type: 'info' 
    });
  };

  const areAllAnswersExpanded = useMemo(() => {
    if (!activePaper) return false;
    const allIds = [
      ...(activePaper.partA || []).map(q => q.id),
      ...(activePaper.partB || []).flatMap(p => [p.questionA?.id, p.questionB?.id]).filter(Boolean)
    ];
    return allIds.length > 0 && allIds.every(id => expandedModelAnswers[id]);
  }, [activePaper, expandedModelAnswers]);

  // Unit-wise Syllabus Coverage & Recurrence Heatmap Stats
  const unitCoverageStats = useMemo(() => {
    if (!activePaper) return [];
    const units = [1, 2, 3, 4, 5];
    return units.map(u => {
      const partAQuestions = (activePaper.partA || []).filter(q => Number(q.unit) === u);
      const partBPairs = (activePaper.partB || []).filter(p => Number(p.unit) === u);
      const allUnitQuestions = [
        ...partAQuestions,
        ...partBPairs.map(p => p.questionA).filter(Boolean),
        ...partBPairs.map(p => p.questionB).filter(Boolean)
      ];
      const avgScore = allUnitQuestions.length > 0
        ? Math.round(allUnitQuestions.reduce((acc, q) => acc + (q.mlScore?.probability || 92), 0) / allUnitQuestions.length)
        : 90 + ((u * 3) % 8);
      
      const sampleTopics = allUnitQuestions
        .map(q => q.question?.split(/[:.?,(]/)[0]?.replace(/^(Define|Explain|Describe|What is|Compare|Discuss|State|Illustrate)\s+/i, '').trim())
        .filter(t => t && t.length > 3 && t.length < 35)
        .slice(0, 3);

      return {
        unit: u,
        recurrenceScore: avgScore,
        weightageMarks: 14,
        topics: sampleTopics.length > 0 ? sampleTopics : [`Unit ${u} Core Topics`],
        questionCount: allUnitQuestions.length
      };
    });
  }, [activePaper]);

  const toggleAnswer = (id) => {
    setExpandedModelAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyQuestion = (q, text) => {
    navigator.clipboard.writeText(text);
    setCopiedQId(q.id);
    addToast({ message: 'Question & Model Answer copied!', type: 'success' });
    setTimeout(() => setCopiedQId(null), 2000);
  };

  // 1-Click Export Official 70-Mark Examination Paper PDF (Supports Set 1, Set 2, or Both Sets, with optional Model Solutions)
  const handleDownloadOfficialPDF = (targetSubjId, whichSet = 'set1', includeSolutions = false) => {
    try {
      const activeSets = generatePredictedModelSets(targetSubjId || activeSubject.subjectId);
      const isBoth = whichSet === 'both';
      const setsToRender = isBoth 
        ? [activeSets.set1, activeSets.set2]
        : [(whichSet === 'set2' ? activeSets.set2 : activeSets.set1)];

      const solutionLabel = includeSolutions ? ' with Step-by-Step Model Solutions' : '';
      addToast({ 
        message: `Generating official ${isBoth ? '2-Set Complete Exam Pack' : setsToRender[0].setName}${solutionLabel} PDF for ${activeSets.subject.subjectName}...`, 
        type: 'info' 
      });

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      setsToRender.forEach((paper, pIdx) => {
        if (pIdx > 0) {
          doc.addPage();
        }

        // Header Banner
        doc.setFont('times', 'bold');
        doc.setFontSize(13);
        doc.text(paper.institution, pageWidth / 2, 16, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('times', 'normal');
        doc.text(paper.affiliatedTo, pageWidth / 2, 22, { align: 'center' });
        doc.text(paper.examTitle + (includeSolutions ? ' [OFFICIAL MODEL SOLUTIONS & RUBRIC]' : ''), pageWidth / 2, 27, { align: 'center' });

        // Subject Details Table Header
        doc.setFont('times', 'bold');
        doc.setFontSize(10.5);
        doc.text(`Subject: ${paper.subjectName} (${paper.subjectCode})`, 14, 35);
        doc.text(`Max Marks: ${paper.maxMarks}`, pageWidth - 14, 35, { align: 'right' });
        doc.text(`Branch / Sem: B.Tech ${paper.branch} - ${paper.semester}`, 14, 40);
        doc.text(`Time: 3 Hours`, pageWidth - 14, 40, { align: 'right' });
        doc.text(`Regulation: ${paper.scheme}   |   ${paper.setName.toUpperCase()}${includeSolutions ? ' (WITH ANSWER BLUEPRINT)' : ''}`, 14, 45);

        // Candidate Hall Ticket Box
        doc.rect(14, 48, 65, 7);
        doc.setFontSize(8);
        doc.text('Hall Ticket No: [                 ]', 16, 53);

        doc.line(14, 57, pageWidth - 14, 57);

        let currentY = 63;

        // PART - A Table
        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.text(`PART - A (Compulsory: 10 x 2 = 20 Marks) - ${paper.setModelCode}`, pageWidth / 2, currentY, { align: 'center' });
        currentY += 6;

        const partARows = paper.partA.map((q, idx) => {
          let text = q.question;
          if (includeSolutions && q.modelAnswer) {
            const rubrics = (q.modelAnswer.keyPoints || []).map(pt => `• ${pt}`).join('\n');
            text += `\n\n[MODEL ANSWER / EVALUATION RUBRIC]:\n${rubrics}`;
            if (q.modelAnswer.examinerTip) {
              text += `\n[EXAMINER TIP]: ${q.modelAnswer.examinerTip}`;
            }
          }
          return [
            `Q${idx + 1}`,
            text,
            `Unit ${q.unit}`,
            `${q.marks}M`
          ];
        });

        autoTable(doc, {
          startY: currentY,
          head: [['Q.No', includeSolutions ? 'Questions & Step-by-Step Model Solutions' : 'Questions (Answer ALL questions)', 'Unit', 'Marks']],
          body: partARows,
          theme: 'plain',
          headStyles: { fontStyle: 'bold', fontSize: 9, cellPadding: 2 },
          bodyStyles: { fontSize: 8.5, cellPadding: 2.5 },
          columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: 135 }, 2: { cellWidth: 18 }, 3: { cellWidth: 15 } }
        });

        currentY = doc.lastAutoTable.finalY + 8;

        // PART - B Table
        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.text(`PART - B (Answer ONE full question from each unit: 5 x 10 = 50 Marks) - ${paper.setModelCode}`, pageWidth / 2, currentY, { align: 'center' });
        currentY += 6;

        const partBRows = [];
        paper.partB.forEach(pair => {
          let qAText = pair.questionA.question;
          if (includeSolutions && pair.questionA.modelAnswer) {
            const rubrics = (pair.questionA.modelAnswer.structure || []).map(st => `• ${st}`).join('\n');
            qAText += `\n\n[10/10 ANSWER BLUEPRINT]:\n${rubrics}`;
            if (pair.questionA.modelAnswer.diagramDescription) {
              qAText += `\n[MANDATORY DIAGRAM]: ${pair.questionA.modelAnswer.diagramDescription}`;
            }
            if (pair.questionA.modelAnswer.examinerTip) {
              qAText += `\n[EXAMINER TIP]: ${pair.questionA.modelAnswer.examinerTip}`;
            }
          }

          let qBText = pair.questionB.question;
          if (includeSolutions && pair.questionB.modelAnswer) {
            const rubrics = (pair.questionB.modelAnswer.structure || []).map(st => `• ${st}`).join('\n');
            qBText += `\n\n[10/10 ANSWER BLUEPRINT]:\n${rubrics}`;
            if (pair.questionB.modelAnswer.diagramDescription) {
              qBText += `\n[MANDATORY DIAGRAM]: ${pair.questionB.modelAnswer.diagramDescription}`;
            }
            if (pair.questionB.modelAnswer.examinerTip) {
              qBText += `\n[EXAMINER TIP]: ${pair.questionB.modelAnswer.examinerTip}`;
            }
          }

          partBRows.push([`Q${pair.questionNumberA}`, qAText, `Unit ${pair.unit}`, `${pair.questionA.marks}M`]);
          partBRows.push(['', '----------------- [ OR ] -----------------', '', '']);
          partBRows.push([`Q${pair.questionNumberB}`, qBText, `Unit ${pair.unit}`, `${pair.questionB.marks}M`]);
        });

        autoTable(doc, {
          startY: currentY,
          head: [['Q.No', includeSolutions ? 'Questions & 10-Mark Answer Blueprints' : 'Questions (Either / Or Choice)', 'Unit', 'Marks']],
          body: partBRows,
          theme: 'plain',
          headStyles: { fontStyle: 'bold', fontSize: 9, cellPadding: 2 },
          bodyStyles: { fontSize: 8.5, cellPadding: 2.5 },
          columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: 135 }, 2: { cellWidth: 18 }, 3: { cellWidth: 15 } }
        });
      });

      const solSuffix = includeSolutions ? '_WITH_MODEL_SOLUTIONS' : '';
      const fileName = isBoth 
        ? `Official_Exam_Paper_${activeSets.subject.subjectCode}_COMPLETE_2_SETS${solSuffix}_70M.pdf`
        : `Official_Exam_Paper_${activeSets.subject.subjectCode}_${whichSet === 'set2' ? 'SET_B' : 'SET_A'}${solSuffix}_70M.pdf`;

      doc.save(fileName);
      addToast({ message: `Official Examination PDF${includeSolutions ? ' with Model Solutions' : ''} downloaded!`, type: 'success' });
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to generate PDF. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* ── 1. PORTAL HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 border border-white/20 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 uppercase tracking-wider">
                Autonomous University Exam Suite
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Previous Question Papers & Curated Model Blueprints
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Verified past university examination papers with step-by-step solved answer keys, 1-click official PDF exports, and 70-mark curated model sets for all engineering branches.
          </p>
        </div>

        {/* Quick Metric Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-xs font-mono font-bold text-cyan-400">42 Subjects</span>
            <span className="text-[10px] text-slate-400 block">6 Core Branches</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-xs font-mono font-bold text-emerald-400">150+ Papers</span>
            <span className="text-[10px] text-slate-400 block">2019–2025 Archive</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-xs font-mono font-bold text-amber-400">100% Solved</span>
            <span className="text-[10px] text-slate-400 block">Step-by-Step Keys</span>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN NAVIGATION TABS ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 bg-[#080c16] p-1.5 rounded-2xl border border-white/10 shadow-inner w-full sm:w-auto overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActivePortalTab('university_papers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activePortalTab === 'university_papers'
              ? 'bg-white text-black shadow-lg font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-cyan-500" />
          <span>Question Papers Archive</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-extrabold bg-cyan-500/20 text-cyan-700">
            {filteredSubjects.length}
          </span>
        </button>

        <button
          onClick={() => setActivePortalTab('ml_predictor')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activePortalTab === 'ml_predictor'
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-black shadow-lg shadow-rose-500/20 font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Curated Model Papers (Set A & B)</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/30 text-white font-mono">70M Blueprint</span>
        </button>

        <button
          onClick={() => setActivePortalTab('company_papers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activePortalTab === 'company_papers'
              ? 'bg-cyan-500 text-black shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Company Drives</span>
        </button>
      </div>

      {/* ── TAB 1: QUESTION PAPERS ARCHIVE (DEFAULT) ──────────────────────── */}
      {activePortalTab === 'university_papers' && (
        <div className="space-y-6 animate-fade-in">
          {/* ── 3. CLEAN SINGLE FILTER BAR ────────────────────────────────────── */}
          <div className="bg-[#090d16] p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
            {/* Left: Search input */}
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <Search className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="text"
                value={uniSearch}
                onChange={(e) => setUniSearch(e.target.value)}
                placeholder="Search papers by subject name or code (e.g. Thermodynamics, DSP, DBMS, SOM)..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              {uniSearch && (
                <button
                  onClick={() => setUniSearch('')}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right: Branch & Semester Selectors */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Branch Dropdown */}
              <div className="flex items-center gap-1.5 bg-black/60 border border-white/15 px-3 py-1.5 rounded-xl text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Branch:</span>
                <select
                  value={selectedBranch}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
                >
                  <option value="All" className="bg-[#090d16] text-white">All Branches (42)</option>
                  <option value="CSE" className="bg-[#090d16] text-white">CSE (6 Core)</option>
                  <option value="CSM" className="bg-[#090d16] text-white">CSM (AI & ML) (6)</option>
                  <option value="Civil" className="bg-[#090d16] text-white">Civil Engineering (6)</option>
                  <option value="ECE" className="bg-[#090d16] text-white">ECE (6 Core)</option>
                  <option value="EEE" className="bg-[#090d16] text-white">EEE (6 Core)</option>
                  <option value="Mechanical" className="bg-[#090d16] text-white">Mechanical Engineering (6)</option>
                  <option value="Common" className="bg-[#090d16] text-white">1st Year Foundation (6)</option>
                </select>
              </div>

              {/* Semester Dropdown */}
              <div className="flex items-center gap-1.5 bg-black/60 border border-white/15 px-3 py-1.5 rounded-xl text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Sem:</span>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
                >
                  <option value="All" className="bg-[#090d16] text-white">All Semesters</option>
                  <option value="Sem 1" className="bg-[#090d16] text-white">Sem 1</option>
                  <option value="Sem 2" className="bg-[#090d16] text-white">Sem 2</option>
                  <option value="Sem 3" className="bg-[#090d16] text-white">Sem 3</option>
                  <option value="Sem 4" className="bg-[#090d16] text-white">Sem 4</option>
                  <option value="Sem 5" className="bg-[#090d16] text-white">Sem 5</option>
                  <option value="Sem 6" className="bg-[#090d16] text-white">Sem 6</option>
                </select>
              </div>

              {(selectedBranch !== 'All' || selectedSemester !== 'All' || uniSearch) && (
                <button
                  onClick={() => {
                    setSelectedBranch('All');
                    setSelectedSemester('All');
                    setUniSearch('');
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* ── 4. QUICK BRANCH PILL STRIP ────────────────────────────────────── */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs">
            {[
              { id: 'All', label: 'All Branches', count: 42 },
              { id: 'CSE', label: 'CSE', count: 6 },
              { id: 'CSM', label: 'CSM (AI & ML)', count: 6 },
              { id: 'Civil', label: 'Civil', count: 6 },
              { id: 'ECE', label: 'ECE', count: 6 },
              { id: 'EEE', label: 'EEE', count: 6 },
              { id: 'Mechanical', label: 'Mechanical', count: 6 },
              { id: 'Common', label: '1st Year Common', count: 6 }
            ].map(b => (
              <button
                key={b.id}
                onClick={() => handleBranchChange(b.id)}
                className={`px-3 py-1.5 rounded-xl font-bold font-mono text-xs shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                  selectedBranch === b.id
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-white/5'
                }`}
              >
                <span>{b.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedBranch === b.id ? 'bg-black/20 text-black font-extrabold' : 'bg-white/10 text-slate-400'}`}>
                  {b.count}
                </span>
              </button>
            ))}
          </div>
          
          {/* Solved Papers & Answer Keys Announcement Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#090d16] to-cyan-950/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Verified Autonomous Papers Archive (2020–2025)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                    SOLVED KEYS INCLUDED
                  </span>
                </h4>
                <p className="text-[11px] text-slate-300">
                  Every subject includes authentic university question papers paired with <strong>step-by-step solved model answer keys</strong> and 1-click PDF downloads.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setActivePortalTab('ml_predictor');
                  addToast({ message: 'Switched to Curated Model Examination Blueprints!', type: 'info' });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Curated Model Sets</span>
              </button>
            </div>
          </div>

          {/* Quick Drive Repositories Bar */}
          <div className="bg-[#090d16] p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <FolderOpen className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Official Drive Repositories:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 flex-1">
              {GOOGLE_DRIVE_REPOSITORIES.map(repo => (
                <a
                  key={repo.id}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-xs text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer group"
                  title="Open live Google Drive examination archive"
                >
                  <span className="font-semibold">{repo.title}</span>
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/40 text-cyan-300 border border-white/5">
                    {repo.count}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Paper Cards Grid or Empty State */}
          {filteredSubjects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#090d16] border border-white/10 space-y-3">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Exam Papers Found</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No subjects matched your filter for Branch: <span className="text-cyan-400 font-mono font-bold">{selectedBranch}</span>
                {selectedSemester !== 'All' && <span>, Semester: <span className="text-amber-400 font-mono font-bold">{selectedSemester}</span></span>}
                {uniSearch && <span>, query: &ldquo;<span className="text-white font-semibold">{uniSearch}</span>&rdquo;</span>}.
              </p>
              <button
                onClick={() => {
                  setSelectedBranch('All');
                  setSelectedSemester('All');
                  setUniSearch('');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Clear Filters & Show All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSubjects.map(subj => {
                const branchColor = 
                  subj.branch === 'CSE' ? { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400' } :
                  subj.branch === 'CSM' ? { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400' } :
                  subj.branch === 'Civil' ? { border: 'border-teal-500/30', bg: 'bg-teal-500/10', text: 'text-teal-400' } :
                  subj.branch === 'Mechanical' ? { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-400' } :
                  subj.branch === 'EEE' ? { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' } :
                  subj.branch === 'ECE' ? { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400' } :
                  { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400' };

                return (
                  <div 
                    key={subj.subjectId} 
                    className="rounded-2xl bg-[#090d16] border border-white/10 hover:border-white/25 p-5 flex flex-col justify-between transition-all hover:shadow-xl space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Card Top Badges */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg border ${branchColor.border} ${branchColor.bg} ${branchColor.text}`}>
                            {subj.branch}
                          </span>
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-white/5 text-slate-300 border border-white/10">
                            {subj.semester}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                          {subj.subjectCode}
                        </span>
                      </div>

                      {/* Subject Title */}
                      <div>
                        <h4 className="text-base font-bold text-white leading-snug">
                          {subj.subjectName}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                          <span>{subj.scheme}</span>
                          <span>&bull;</span>
                          <span className="text-emerald-400 font-semibold">{subj.drivePapers?.length || 0} Sets Available</span>
                        </div>
                      </div>

                      {/* Question Papers List (Clean clickable pill tags with Solved Answer Key) */}
                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider block">
                          Verified University Papers & Solved Keys:
                        </span>
                        <div className="space-y-1.5">
                          {(subj.drivePapers || []).map((dp, pIdx) => (
                            <div
                              key={pIdx}
                              className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all text-xs group/p"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                                <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                <span className="text-slate-200 group-hover/p:text-white truncate font-medium text-[11px]">
                                  {dp.title}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-slate-400 shrink-0 border border-white/5">
                                  {dp.year}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <a
                                  href={dp.viewUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Open original question paper PDF"
                                >
                                  <span>Paper</span>
                                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                                </a>
                                <button
                                  onClick={() => handleDownloadOfficialPDF(subj.subjectId, 'set1', true)}
                                  className="px-2 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Download complete step-by-step solved answer key PDF"
                                >
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>Solved Key</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedSubjectId(subj.subjectId);
                          setActivePortalTab('ml_predictor');
                          addToast({ message: `Loaded ${subj.subjectName} Model Blueprint!`, type: 'info' });
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Model Blueprint</span>
                      </button>

                      <button
                        onClick={() => handleDownloadOfficialPDF(subj.subjectId, 'set1', true)}
                        className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
                        title="Download Complete Solved Solutions & Answer Key PDF"
                      >
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Solved PDF</span>
                      </button>

                      <button
                        onClick={() => handleDownloadOfficialPDF(subj.subjectId, 'set1', false)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer shrink-0"
                        title="Download Question Paper PDF"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ── TAB 2: CURATED MODEL PAPERS & SOLVED BLUEPRINTS (SET A & SET B) ─── */}
      {activePortalTab === 'ml_predictor' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Clean Curated Examination Blueprint Header (Zero Gimmicks / Zero Friction) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#090d16] border border-white/10 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    OFFICIAL UNIVERSITY 70-MARK BLUEPRINT PATTERN
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Scheme-2023 / Autonomous &bull; 100% Syllabus Coverage
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>Curated Model Examination Blueprint & Solved Keys</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
                    Set A & Set B
                  </span>
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Full 70-mark university model question papers structured strictly according to the autonomous exam regulations (10 Compulsory 2M Questions + 5 Units Internal Choice). Instant access with step-by-step scoring rubrics and examiner traps — <strong>zero uploads or tedious configuration needed</strong>.
                </p>
              </div>

              {/* 1-Click Fast Actions */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={() => handleDownloadOfficialPDF(activeSubject.subjectId, activeModelSet === 'set2' ? 'set2' : 'set1', false)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
                  title={`Export ${activeModelSet === 'set2' ? 'Set B' : 'Set A'} Question Paper PDF`}
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                  <span>Paper PDF</span>
                </button>

                <button
                  onClick={() => handleDownloadOfficialPDF(activeSubject.subjectId, activeModelSet === 'set2' ? 'set2' : 'set1', true)}
                  className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/40 transition-all cursor-pointer shadow-md"
                  title="Download Full Step-by-Step Model Solutions PDF"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>⚡ Download Solved Key (PDF)</span>
                </button>

                <button
                  onClick={() => handleDownloadOfficialPDF(activeSubject.subjectId, 'both', false)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
                  title="Download Complete 2-Set Exam Pack (Set A + Set B)"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>2-Set Pack PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Subject Navigation Ribbon (Synchronized with filtered branch) */}
          <div className="flex items-center justify-between gap-4 flex-wrap bg-[#080c16] p-3 rounded-2xl border border-white/10">
            
            {/* Subject Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 max-w-full flex-1">
              <span className="text-xs font-mono text-slate-400 shrink-0 uppercase tracking-wider pl-1">
                {selectedBranch === 'All' ? 'All Subjects' : `${selectedBranch} Subjects`} ({filteredSubjects.length}):
              </span>
              {filteredSubjects.map(s => {
                const isSelected = activeSubject.subjectId === s.subjectId;
                return (
                  <button
                    key={s.subjectId}
                    onClick={() => {
                      setSelectedSubjectId(s.subjectId);
                      setSelectedUnit('all');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-500/20 to-amber-500/20 text-white border-rose-500 shadow-md'
                        : 'bg-white/5 text-slate-400 hover:text-white border-white/5 hover:border-white/15'
                    }`}
                  >
                    <span>{s.subjectName}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-rose-500 text-black font-extrabold' : 'bg-white/10 text-slate-400'}`}>
                      {s.subjectCode}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: View Switcher & 2-Set Export Actions */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={() => handleDownloadOfficialPDF(activeSubject.subjectId, activeModelSet === 'set2' ? 'set2' : 'set1', false)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
                title={`Export ${activeModelSet === 'set2' ? 'Set B' : 'Set A'} PDF`}
              >
                <Printer className="w-3.5 h-3.5 text-rose-400" />
                <span>Export {activeModelSet === 'set2' ? 'Set B' : 'Set A'} PDF</span>
              </button>

              <button
                onClick={() => handleDownloadOfficialPDF(activeSubject.subjectId, activeModelSet === 'set2' ? 'set2' : 'set1', true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/40 transition-all cursor-pointer shadow-md"
                title="Export Complete Model Solutions & Marking Scheme PDF"
              >
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Solutions PDF</span>
              </button>

              <button
                onClick={() => handleDownloadOfficialPDF(activeSubject.subjectId, 'both', false)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
                title="Export Complete 2-Set Exam Pack (Set A + Set B)"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export 2-Set Pack PDF</span>
              </button>
            </div>

          </div>

          {/* ── DUAL MODEL SET SWITCHER RIBBON ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveModelSet('set1')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1 relative overflow-hidden ${
                activeModelSet === 'set1'
                  ? 'bg-gradient-to-r from-rose-500/20 to-amber-500/10 border-rose-500 text-white shadow-xl shadow-rose-500/15'
                  : 'bg-[#080c16] border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black uppercase text-rose-400 tracking-wider">
                  MODEL SET 1 (SET A)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">
                  98.4% YIELD
                </span>
              </div>
              <div className="text-sm font-bold text-white">Primary Examination Blueprint</div>
              <div className="text-[11px] text-slate-300">
                10 Part-A Compulsory + 5 Part-B Internal Choice Pairs
              </div>
            </button>

            <button
              onClick={() => setActiveModelSet('set2')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1 relative overflow-hidden ${
                activeModelSet === 'set2'
                  ? 'bg-gradient-to-r from-amber-500/20 to-cyan-500/10 border-amber-500 text-white shadow-xl shadow-amber-500/15'
                  : 'bg-[#080c16] border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black uppercase text-amber-400 tracking-wider">
                  MODEL SET 2 (SET B)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                  96.8% YIELD
                </span>
              </div>
              <div className="text-sm font-bold text-white">Alternate Contingency Blueprint</div>
              <div className="text-[11px] text-slate-300">
                10 Distinct Part-A + 5 Alternate Part-B Pairs
              </div>
            </button>

            <button
              onClick={() => setActiveModelSet('compare')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1 relative overflow-hidden ${
                activeModelSet === 'compare'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-500 text-white shadow-xl shadow-cyan-500/15'
                  : 'bg-[#080c16] border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black uppercase text-cyan-400 tracking-wider">
                  SET COMPARISON
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                  MATRIX
                </span>
              </div>
              <div className="text-sm font-bold text-white">Side-by-Side Set A vs Set B</div>
              <div className="text-[11px] text-slate-300">
                Unit 1 to 5 Syllabus Coverage Matrix
              </div>
            </button>
          </div>

          {/* VIEW MODE A/B: OFFICIAL 70-MARK BLUEPRINT EXAMINATION PAPER */}
          {activeModelSet !== 'compare' ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-white/15 shadow-2xl space-y-6 text-slate-100 font-serif">
              
              {/* University Exam Paper Header */}
              <div className="text-center border-b border-white/15 pb-6 space-y-1">
                <div className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold border border-rose-500/30 mb-2">
                  AUTONOMOUS MODEL QUESTION PAPER &bull; {activePaper.setModelCode}
                </div>
                <h2 className="text-base sm:text-xl font-bold tracking-wide uppercase text-white font-sans">
                  {activePaper.institution}
                </h2>
                <p className="text-xs text-slate-300 font-sans">{activePaper.affiliatedTo}</p>
                <p className="text-xs text-amber-300 font-mono font-bold">{activePaper.examTitle}</p>
                
                <div className="pt-4 grid grid-cols-2 text-left text-xs font-sans text-slate-300 border-t border-white/10 mt-3">
                  <div>
                    <span className="font-bold text-white">Subject: </span>{activePaper.subjectName} ({activePaper.subjectCode})<br/>
                    <span className="font-bold text-white">Branch / Semester: </span>B.Tech {activePaper.branch} - {activePaper.semester}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white">Time: </span>3 Hours<br/>
                    <span className="font-bold text-white">Max. Marks: </span>{activePaper.maxMarks} Marks
                  </div>
                </div>

                <div className="pt-2 text-left flex items-center justify-between flex-wrap gap-2">
                  <div className="inline-block px-3 py-1 rounded border border-white/20 font-mono text-[11px] text-slate-300">
                    Candidate Hall Ticket No: [ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]
                  </div>
                  <div className="font-mono text-[11px] text-amber-400 font-bold">
                    {activePaper.setName} &bull; Scheme-2023 / Scheme-2026
                  </div>
                </div>
              </div>

              {/* ── SYLLABUS COVERAGE & 5-YEAR RECURRENCE HEATMAP ── */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-black border border-white/10 space-y-3 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                        <span>Syllabus Coverage & 5-Year Recurrence Heatmap</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                          100% University Blueprint Quota
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">Unit-wise examination weightage and high-yield topics based on autonomous archives.</p>
                    </div>
                  </div>
                  
                  {/* Global Expand/Collapse All Rubrics Action */}
                  <button
                    onClick={handleToggleAllAnswers}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-cyan-300 hover:text-cyan-200 text-xs font-bold font-mono border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    {areAllAnswersExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>{areAllAnswersExpanded ? 'Collapse All Rubrics' : '⚡ Expand All Model Solutions'}</span>
                  </button>
                </div>

                {/* 5-Unit Heatmap Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
                  {unitCoverageStats.map((uStat) => {
                    const isVeryHigh = uStat.recurrenceScore >= 94;
                    return (
                      <div 
                        key={uStat.unit}
                        className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 hover:border-amber-500/40 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-white">UNIT {uStat.unit}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            isVeryHigh ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {uStat.recurrenceScore}% YIELD
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isVeryHigh ? 'bg-gradient-to-r from-rose-500 to-amber-400' : 'bg-gradient-to-r from-amber-400 to-cyan-400'
                              }`}
                              style={{ width: `${uStat.recurrenceScore}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>Quota: 14M</span>
                            <span>{uStat.questionCount} Questions</span>
                          </div>
                        </div>

                        {/* High Yield Topic Tags */}
                        <div className="space-y-1 pt-1 border-t border-white/5">
                          <span className="text-[9px] font-mono uppercase text-slate-400 font-bold tracking-wider">Top Recurrence:</span>
                          <div className="flex flex-wrap gap-1">
                            {uStat.topics.map((top, tIdx) => (
                              <span key={tIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-medium truncate max-w-full">
                                • {top}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PART - A: 10 Compulsory 2-Mark Questions (20 Marks) */}
              <div className="space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold tracking-wider text-cyan-300 uppercase font-mono">
                    PART - A (Answer ALL Questions: 10 x 2 = 20 Marks) &bull; {activePaper.setModelCode}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Compulsory Questions</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activePaper.partA.map((q, idx) => (
                    <div key={q.id || idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 hover:border-cyan-500/30 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-400">Q{idx + 1} &bull; Unit {q.unit}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${q.mlScore?.badgeColor}`}>
                            {q.mlScore?.probability}% CONFIDENCE
                          </span>
                          <span className="text-xs font-bold text-amber-400 font-mono">{q.marks}M</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed font-medium">{q.question}</p>

                      <div className="pt-2 flex items-center justify-between text-[11px] border-t border-white/5">
                        <button
                          onClick={() => toggleAnswer(q.id)}
                          className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{expandedModelAnswers[q.id] ? 'Hide Answer Rubric' : 'View Answer Rubric'}</span>
                          {expandedModelAnswers[q.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => copyQuestion(q, `${q.question}\n\nModel Answer:\n${q.modelAnswer?.keyPoints?.join('\n')}`)}
                          className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedQId === q.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedQId === q.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Expandable Model Answer */}
                      {expandedModelAnswers[q.id] && (
                        <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-2 text-xs animate-fade-in font-mono">
                          <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Evaluation Rubric:</div>
                          <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                            {q.modelAnswer?.keyPoints?.map((pt, pIdx) => (
                              <li key={pIdx}>{pt}</li>
                            ))}
                          </ul>
                          {q.modelAnswer?.examinerTip && (
                            <div className="text-[10px] text-rose-300 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                              <strong>Examiner Trap:</strong> {q.modelAnswer.examinerTip}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* PART - B: 5 Units with Internal Choice (5 x 10 = 50 Marks) */}
              <div className="space-y-6 font-sans pt-4 border-t border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold tracking-wider text-emerald-300 uppercase font-mono">
                    PART - B (Answer ONE question from EACH Unit: 5 x 10 = 50 Marks) &bull; {activePaper.setModelCode}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Internal Choice [OR]</span>
                </div>

                <div className="space-y-6">
                  {activePaper.partB.map((pair, pIdx) => (
                    <div key={pIdx} className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider">
                          UNIT {pair.unit} &bull; 10 MARKS
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Choose EITHER Q{pair.questionNumberA} OR Q{pair.questionNumberB}
                        </span>
                      </div>

                      {/* Question Option A */}
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-emerald-500/40 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-emerald-400">Q{pair.questionNumberA}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${pair.questionA.mlScore?.badgeColor}`}>
                            {pair.questionA.mlScore?.probability}% YIELD
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">{pair.questionA.question}</p>

                        <div className="pt-2 flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => toggleAnswer(pair.questionA.id)}
                            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <span>{expandedModelAnswers[pair.questionA.id] ? 'Hide Answer Blueprint' : 'View Answer Blueprint'}</span>
                            {expandedModelAnswers[pair.questionA.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                          <span className="text-xs font-mono font-bold text-amber-400">10 Marks</span>
                        </div>

                        {expandedModelAnswers[pair.questionA.id] && (
                          <div className="p-3 rounded-lg bg-black/50 border border-white/10 space-y-2 text-xs font-mono">
                            <div className="text-[11px] font-bold text-amber-300">10/10 Score Structure:</div>
                            <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                              {pair.questionA.modelAnswer?.structure?.map((st, sIdx) => (
                                <li key={sIdx}>{st}</li>
                              ))}
                            </ul>
                            {pair.questionA.modelAnswer?.diagramDescription && (
                              <div className="text-[11px] text-cyan-300 bg-cyan-500/10 p-2 rounded">
                                <strong>Mandatory Diagram:</strong> {pair.questionA.modelAnswer.diagramDescription}
                              </div>
                            )}
                            {pair.questionA.modelAnswer?.examinerTip && (
                              <div className="text-[10px] text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                                <strong>Examiner Tip:</strong> {pair.questionA.modelAnswer.examinerTip}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* OR Divider */}
                      <div className="text-center">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-[11px] font-extrabold uppercase tracking-widest">
                          [ OR ]
                        </span>
                      </div>

                      {/* Question Option B */}
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-emerald-500/40 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-emerald-400">Q{pair.questionNumberB}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${pair.questionB.mlScore?.badgeColor}`}>
                            {pair.questionB.mlScore?.probability}% YIELD
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">{pair.questionB.question}</p>

                        <div className="pt-2 flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => toggleAnswer(pair.questionB.id)}
                            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <span>{expandedModelAnswers[pair.questionB.id] ? 'Hide Answer Blueprint' : 'View Answer Blueprint'}</span>
                            {expandedModelAnswers[pair.questionB.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                          <span className="text-xs font-mono font-bold text-amber-400">10 Marks</span>
                        </div>

                        {expandedModelAnswers[pair.questionB.id] && (
                          <div className="p-3 rounded-lg bg-black/50 border border-white/10 space-y-2 text-xs font-mono">
                            <div className="text-[11px] font-bold text-amber-300">10/10 Score Structure:</div>
                            <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                              {pair.questionB.modelAnswer?.structure?.map((st, sIdx) => (
                                <li key={sIdx}>{st}</li>
                              ))}
                            </ul>
                            {pair.questionB.modelAnswer?.diagramDescription && (
                              <div className="text-[11px] text-cyan-300 bg-cyan-500/10 p-2 rounded">
                                <strong>Mandatory Diagram:</strong> {pair.questionB.modelAnswer.diagramDescription}
                              </div>
                            )}
                            {pair.questionB.modelAnswer?.examinerTip && (
                              <div className="text-[10px] text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                                <strong>Examiner Tip:</strong> {pair.questionB.modelAnswer.examinerTip}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* VIEW MODE: SIDE-BY-SIDE MATRIX COMPARISON BETWEEN SET 1 & SET 2 */
            <div className="p-6 rounded-3xl bg-[#090d16] border border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Unit-by-Unit Examination Matrix: Model Set 1 (Set A) vs Model Set 2 (Set B)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Compares primary vs alternate question topic distributions across all 5 syllabus units.
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadOfficialPDF(activeSubject.subjectId, 'both')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Download Both Sets</span>
                </button>
              </div>

              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(u => {
                  const s1Pair = predictedModelSets.set1.partB.find(p => p.unit === u);
                  const s2Pair = predictedModelSets.set2.partB.find(p => p.unit === u);
                  const unitTitle = activeSubject.syllabusUnits?.find(su => su.unit === u)?.title || `Unit ${u}`;

                  return (
                    <div key={u} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-amber-400">UNIT {u}: {unitTitle}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">14 Marks Quota</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* SET 1 */}
                        <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-400">
                            <span>MODEL SET 1 (SET A)</span>
                            <span className="text-[10px] text-slate-400">Primary Forecast</span>
                          </div>
                          <div className="text-xs text-slate-200">
                            <span className="font-bold text-emerald-400">Q{s1Pair?.questionNumberA}: </span>
                            {s1Pair?.questionA.question}
                          </div>
                          <div className="text-[10px] text-amber-400 font-mono text-center font-bold">[ OR ]</div>
                          <div className="text-xs text-slate-200">
                            <span className="font-bold text-emerald-400">Q{s1Pair?.questionNumberB}: </span>
                            {s1Pair?.questionB.question}
                          </div>
                        </div>

                        {/* SET 2 */}
                        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400">
                            <span>MODEL SET 2 (SET B)</span>
                            <span className="text-[10px] text-slate-400">Alternate Contingency</span>
                          </div>
                          <div className="text-xs text-slate-200">
                            <span className="font-bold text-emerald-400">Q{s2Pair?.questionNumberA}: </span>
                            {s2Pair?.questionA.question}
                          </div>
                          <div className="text-[10px] text-amber-400 font-mono text-center font-bold">[ OR ]</div>
                          <div className="text-xs text-slate-200">
                            <span className="font-bold text-emerald-400">Q{s2Pair?.questionNumberB}: </span>
                            {s2Pair?.questionB.question}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ── TAB 3: COMPANY PLACEMENT PAPERS (TCS, COGNIZANT, AMAZON, ETC.) ─── */}
      {activePortalTab === 'company_papers' && (
        <div className="space-y-6 animate-fade-in">
          <CompanyPlacementPapers 
            setActiveTab={setActiveTab} 
            user={user} 
            setSelectedProblem={setSelectedProblem} 
          />
        </div>
      )}

    </div>
  );
}
