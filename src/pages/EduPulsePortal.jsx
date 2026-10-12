import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, FileCheck2, TrendingUp, AlertTriangle, Clock, Sparkles,
  ArrowUpRight, ChevronRight, Award, Plus, Check, CheckCircle2,
  XCircle, Search, Filter, Download, Upload, FileText, Settings,
  ShieldAlert, BookOpen, Layers, Edit3, Trash2, Calendar, UserCheck,
  RefreshCw, BarChart2, HelpCircle, X, ChevronDown, CheckSquare,
  Activity, ArrowDownRight, Compass, ShieldCheck, Zap
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── Default Institutional Dataset (Lumixora Autonomous Campus - GPREC Kurnool) ───────
const DEFAULT_INSTITUTION = {
  id: 'gprec',
  name: "G. Pulla Reddy Engineering College (Autonomous)",
  shortName: "GPREC Kurnool",
  tagline: "Every diagnostic assessment creates a targeted micro-action path for placement readiness and academic mastery.",
  location: "G. Pulla Reddy Nagar, Nandyal Road, Kurnool, Andhra Pradesh 518007",
  accreditation: "NAAC A+ Autonomous • Affiliated to JNTUA",
  platform: "Lumixora Student OS by VYOMRA"
};

const DEFAULT_BATCHES = [
  { id: 1, name: "B.Tech CSE - 2026 Alpha", program: "Computer Science & Engineering", target_year: 2026, studentCount: 12, avgScore: 68.5, department: "CSE" },
  { id: 2, name: "B.Tech AI&ML - 2026 Sigma", program: "Artificial Intelligence & ML", target_year: 2026, studentCount: 10, avgScore: 64.2, department: "AI&ML" },
  { id: 3, name: "B.Tech ECE - 2026 Zenith", program: "Electronics & Communication", target_year: 2026, studentCount: 10, avgScore: 59.8, department: "ECE" }
];

const DEFAULT_FACULTY = [
  { id: 1, name: "Dr. K. Govardhan Reddy", role: "HOD & Academic Lead", subject: "Computer Science & Engineering" },
  { id: 2, name: "Prof. S. Ramesh Sir", role: "Senior Faculty", subject: "Data Structures & Java" },
  { id: 3, name: "Dr. M. Lakshmi Devi", role: "Senior Faculty", subject: "DBMS & Operating Systems" },
  { id: 4, name: "Prof. V. Suresh Sir", role: "Faculty Mentor", subject: "Algorithms & Competitive Coding" },
  { id: 5, name: "Dr. P. Sreedhar Sir", role: "Faculty Mentor", subject: "Computer Networks & Cloud" },
];

const DEFAULT_STUDENTS = [
  // B.Tech CSE - 2026 Alpha
  { id: 1, roll: "249X1A0501", name: "K. Sai Teja", batchId: 1, batchName: "B.Tech CSE - 2026 Alpha", avgScore: 78.4, status: "on_track", testsTaken: 5, gaps: ["Graph Traversal & Trees"] },
  { id: 2, roll: "249X1A0502", name: "P. Keerthi Reddy", batchId: 1, batchName: "B.Tech CSE - 2026 Alpha", avgScore: 48.1, status: "needs_support", testsTaken: 5, gaps: ["Graph Traversal & Trees", "SQL Indexing & Normalization"] },
  { id: 3, roll: "249X1A0503", name: "V. Venkat Raman", batchId: 1, batchName: "B.Tech CSE - 2026 Alpha", avgScore: 62.5, status: "stable", testsTaken: 5, gaps: ["Dynamic Programming"] },
  { id: 4, roll: "249X1A0504", name: "B. Bhavana Rao", batchId: 1, batchName: "B.Tech CSE - 2026 Alpha", avgScore: 84.0, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 5, roll: "249X1A0505", name: "M. Rahul Varma", batchId: 1, batchName: "B.Tech CSE - 2026 Alpha", avgScore: 42.5, status: "needs_support", testsTaken: 5, gaps: ["Graph Traversal & Trees", "Cache Memory & Paging"] },
  { id: 6, roll: "249X1A0506", name: "C. Divya Sree", batchId: 1, batchName: "B.Tech CSE - 2026 Alpha", avgScore: 56.0, status: "stable", testsTaken: 5, gaps: ["Dynamic Programming"] },
  { id: 7, roll: "249X1A0507", name: "N. Karthik Naidu", batchId: 1, batchName: "B.Tech CSE - 2026 Alpha", avgScore: 49.0, status: "needs_support", testsTaken: 5, gaps: ["Graph Traversal & Trees"] },
  { id: 8, roll: "249X1A0508", name: "G. Anusha Chowdary", batchId: 1, batchName: "B.Tech CSE - 2026 Alpha", avgScore: 72.5, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 9, roll: "249X1A0509", name: "T. Manjunath Swamy", batchId: 1, batchName: "B.Tech CSE - 2026 Alpha", avgScore: 46.0, status: "needs_support", testsTaken: 5, gaps: ["Cache Memory & Paging"] },
  { id: 10, roll: "249X1A0510", name: "D. Sneha Latha", batchId: 1, batchName: "B.Tech CSE - 2026 Alpha", avgScore: 68.0, status: "stable", testsTaken: 5, gaps: ["Graph Traversal & Trees"] },
  { id: 11, roll: "249X1A0511", name: "Y. Tarun Kumar", batchId: 1, batchName: "B.Tech CSE - 2026 Alpha", avgScore: 58.5, status: "stable", testsTaken: 5, gaps: ["Dynamic Programming"] },
  { id: 12, roll: "249X1A0512", name: "R. Swathi Priya", batchId: 1, batchName: "B.Tech CSE - 2026 Alpha", avgScore: 65.5, status: "stable", testsTaken: 5, gaps: [] },

  // B.Tech AI&ML - 2026 Sigma
  { id: 13, roll: "249X1A3301", name: "A. Harika Sharma", batchId: 2, batchName: "B.Tech AI&ML - 2026 Sigma", avgScore: 82.5, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 14, roll: "249X1A3302", name: "S. Pradeep Kumar", batchId: 2, batchName: "B.Tech AI&ML - 2026 Sigma", avgScore: 49.0, status: "needs_support", testsTaken: 5, gaps: ["Neural Net Backprop", "Matrix Factorization"] },
  { id: 15, roll: "249X1A3303", name: "M. Lavanya Devi", batchId: 2, batchName: "B.Tech AI&ML - 2026 Sigma", avgScore: 76.0, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 16, roll: "249X1A3304", name: "K. Dinesh Reddy", batchId: 2, batchName: "B.Tech AI&ML - 2026 Sigma", avgScore: 59.5, status: "stable", testsTaken: 5, gaps: ["Neural Net Backprop"] },
  { id: 17, roll: "249X1A3305", name: "J. Sushmitha Paul", batchId: 2, batchName: "B.Tech AI&ML - 2026 Sigma", avgScore: 45.0, status: "needs_support", testsTaken: 5, gaps: ["Neural Net Backprop", "Probability & Bayes Models"] },
  { id: 18, roll: "249X1A3306", name: "R. Bhanu Prakash", batchId: 2, batchName: "B.Tech AI&ML - 2026 Sigma", avgScore: 67.0, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 19, roll: "249X1A3307", name: "N. Meghana Rao", batchId: 2, batchName: "B.Tech AI&ML - 2026 Sigma", avgScore: 61.0, status: "stable", testsTaken: 5, gaps: ["Matrix Factorization"] },
  { id: 20, roll: "249X1A3308", name: "E. Ajay Krishna", batchId: 2, batchName: "B.Tech AI&ML - 2026 Sigma", avgScore: 51.5, status: "needs_support", testsTaken: 5, gaps: ["Neural Net Backprop"] },
  { id: 21, roll: "249X1A3309", name: "P. Sravani Latha", batchId: 2, batchName: "B.Tech AI&ML - 2026 Sigma", avgScore: 79.0, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 22, roll: "249X1A3310", name: "V. Chaitanya Prasad", batchId: 2, batchName: "B.Tech AI&ML - 2026 Sigma", avgScore: 63.0, status: "stable", testsTaken: 5, gaps: [] },

  // B.Tech ECE - 2026 Zenith
  { id: 23, roll: "249X1A0401", name: "G. Mahesh Babu", batchId: 3, batchName: "B.Tech ECE - 2026 Zenith", avgScore: 58.0, status: "stable", testsTaken: 5, gaps: ["Digital Signal Processing & DFT"] },
  { id: 24, roll: "249X1A0402", name: "T. Sandhya Rani", batchId: 3, batchName: "B.Tech ECE - 2026 Zenith", avgScore: 47.0, status: "needs_support", testsTaken: 5, gaps: ["VLSI CMOS Inverter Sizing", "Digital Signal Processing & DFT"] },
  { id: 25, roll: "249X1A0403", name: "B. Vikram Simha", batchId: 3, batchName: "B.Tech ECE - 2026 Zenith", avgScore: 71.0, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 26, roll: "249X1A0404", name: "K. Pavani Kumari", batchId: 3, batchName: "B.Tech ECE - 2026 Zenith", avgScore: 50.5, status: "needs_support", testsTaken: 5, gaps: ["Digital Signal Processing & DFT"] },
  { id: 27, roll: "249X1A0405", name: "M. Akhil Tej", batchId: 3, batchName: "B.Tech ECE - 2026 Zenith", avgScore: 62.0, status: "stable", testsTaken: 5, gaps: [] },
  { id: 28, roll: "249X1A0406", name: "D. Rohini Sree", batchId: 3, batchName: "B.Tech ECE - 2026 Zenith", avgScore: 72.5, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 29, roll: "249X1A0407", name: "N. Uday Kiran", batchId: 3, batchName: "B.Tech ECE - 2026 Zenith", avgScore: 43.0, status: "needs_support", testsTaken: 5, gaps: ["VLSI CMOS Inverter Sizing", "Microcontroller Interrupts"] },
  { id: 30, roll: "249X1A0408", name: "S. Geetha Madhuri", batchId: 3, batchName: "B.Tech ECE - 2026 Zenith", avgScore: 65.5, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 31, roll: "249X1A0409", name: "R. Vinay Kumar", batchId: 3, batchName: "B.Tech ECE - 2026 Zenith", avgScore: 56.0, status: "stable", testsTaken: 5, gaps: ["Digital Signal Processing & DFT"] },
  { id: 32, roll: "249X1A0410", name: "A. Lakshmi Prasanna", batchId: 3, batchName: "B.Tech ECE - 2026 Zenith", avgScore: 70.5, status: "on_track", testsTaken: 5, gaps: [] },
];

const DEFAULT_TOPIC_GAPS = [
  {
    id: 1,
    topicName: "Graph Traversal & Trees",
    subject: "Data Structures & Algorithms",
    batchName: "B.Tech CSE - 2026 Alpha",
    batchId: 1,
    avgScore: 41.5,
    testsEvaluated: 2,
    isRecurring: true,
    affectedStudents: 7,
    totalStudents: 12,
    severity: "high",
    rationale: "Batch-wide concept bottleneck: 7 of 12 scholars scored below 50% across Dijkstra shortest paths and topological sort. Recursive DFS back-tracking shows recurring confusion."
  },
  {
    id: 2,
    topicName: "Neural Net Backprop",
    subject: "Artificial Intelligence & ML",
    batchName: "B.Tech AI&ML - 2026 Sigma",
    batchId: 2,
    avgScore: 43.8,
    testsEvaluated: 2,
    isRecurring: true,
    affectedStudents: 5,
    totalStudents: 10,
    severity: "high",
    rationale: "Matrix gradient derivatives and cross-entropy error minimization show recurring drop across two consecutive assessments."
  },
  {
    id: 3,
    topicName: "Digital Signal Processing & DFT",
    subject: "Signals & Systems",
    batchName: "B.Tech ECE - 2026 Zenith",
    batchId: 3,
    avgScore: 44.5,
    testsEvaluated: 2,
    isRecurring: true,
    affectedStudents: 5,
    totalStudents: 10,
    severity: "medium",
    rationale: "Fast Fourier Transform butterfly stages and Z-transform ROC pole-zero cancellation fell below 50% benchmark."
  },
  {
    id: 4,
    topicName: "SQL Indexing & Normalization",
    subject: "DBMS & Systems",
    batchName: "B.Tech CSE - 2026 Alpha",
    batchId: 1,
    avgScore: 47.8,
    testsEvaluated: 2,
    isRecurring: false,
    affectedStudents: 4,
    totalStudents: 12,
    severity: "medium",
    rationale: "Single-test variance in B+ Tree leaf lookups and BCNF functional dependencies. Needs monitoring on next reassessment."
  },
  {
    id: 5,
    topicName: "Cache Memory & Paging",
    subject: "Operating Systems",
    batchName: "B.Tech CSE - 2026 Alpha",
    batchId: 1,
    avgScore: 43.5,
    testsEvaluated: 2,
    isRecurring: true,
    affectedStudents: 4,
    totalStudents: 12,
    severity: "medium",
    rationale: "Virtual memory address translation, TLB miss penalty calculations, and LRU eviction show recurring formula confusion."
  }
];

const DEFAULT_ACTIONS = [
  {
    id: "act-1",
    gapId: 1,
    title: "Dijkstra & BFS Step-by-Step Problem Clinic",
    topicName: "Graph Traversal & Trees",
    subject: "Data Structures & Algorithms",
    batchName: "B.Tech CSE - 2026 Alpha",
    batchId: 1,
    strategy: "1-on-1 Concept Clinic",
    assignedTo: "Prof. S. Ramesh Sir",
    dueDate: "2026-10-18",
    status: "in_progress",
    targetCohort: ["P. Keerthi Reddy", "M. Rahul Varma", "N. Karthik Naidu", "T. Manjunath Swamy"],
    notes: "Conducting step-by-step priority queue trace and adjacency list representations."
  },
  {
    id: "act-2",
    gapId: 2,
    title: "Gradient Vectors & Matrix Chain Rule Practice Sheet",
    topicName: "Neural Net Backprop",
    subject: "Artificial Intelligence & ML",
    batchName: "B.Tech AI&ML - 2026 Sigma",
    batchId: 2,
    strategy: "Targeted Practice Problem Sheet",
    assignedTo: "Dr. K. Govardhan Reddy",
    dueDate: "2026-10-19",
    status: "assigned",
    targetCohort: ["S. Pradeep Kumar", "K. Dinesh Reddy", "J. Sushmitha Paul", "E. Ajay Krishna"],
    notes: "Distributing 25 curated computational practice questions with step-by-step weight updates."
  },
  {
    id: "act-3",
    gapId: 3,
    title: "FFT Butterfly Structures & ROC Doubt Workshop",
    topicName: "Digital Signal Processing & DFT",
    subject: "Signals & Systems",
    batchName: "B.Tech ECE - 2026 Zenith",
    batchId: 3,
    strategy: "Doubt Clearing Workshop",
    assignedTo: "Prof. V. Suresh Sir",
    dueDate: "2026-10-16",
    status: "completed",
    targetCohort: ["T. Sandhya Rani", "K. Pavani Kumari", "N. Uday Kiran", "R. Vinay Kumar"],
    notes: "45-minute lab workshop conducted. All 4 scholars demonstrated full mastery on twiddle factors.",
    measuredGain: "+18.5%"
  },
  {
    id: "act-4",
    gapId: 4,
    title: "15-Minute Reassessment on B-Tree Query Execution",
    topicName: "SQL Indexing & Normalization",
    subject: "DBMS & Systems",
    batchName: "B.Tech CSE - 2026 Alpha",
    batchId: 1,
    strategy: "15-min Diagnostic Reassessment",
    assignedTo: "Dr. M. Lakshmi Devi",
    dueDate: "2026-10-20",
    status: "pending_review",
    targetCohort: ["V. Venkat Raman", "C. Divya Sree", "Y. Tarun Kumar"],
    notes: "Validating whether query cost drop was transient or a conceptual bottleneck."
  }
];

const DEFAULT_EVALUATIONS = [
  {
    id: 1,
    actionTitle: "FFT Butterfly Structures Workshop",
    topic: "Digital Signal Processing & DFT",
    batch: "B.Tech ECE - 2026 Zenith",
    baselineScore: 42.0,
    followUpScore: 60.5,
    delta: 18.5,
    outcome: "marked_gain",
    strategy: "Doubt Clearing Workshop",
    faculty: "Prof. V. Suresh Sir",
    date: "2026-10-11"
  },
  {
    id: 2,
    actionTitle: "BCNF Functional Dependencies Diagnostic Relecture",
    topic: "SQL Indexing & Normalization",
    batch: "B.Tech CSE - 2026 Alpha",
    baselineScore: 48.5,
    followUpScore: 59.8,
    delta: 11.3,
    outcome: "moderate_gain",
    strategy: "Foundational Re-lecture",
    faculty: "Dr. M. Lakshmi Devi",
    date: "2026-10-09"
  },
  {
    id: 3,
    actionTitle: "Graph Shortest Path Dijkstra Speed Drill",
    topic: "Graph Traversal & Trees",
    batch: "B.Tech CSE - 2026 Alpha",
    baselineScore: 45.0,
    followUpScore: 62.0,
    delta: 17.0,
    outcome: "marked_gain",
    strategy: "Targeted Practice Sheet",
    faculty: "Prof. S. Ramesh Sir",
    date: "2026-10-06"
  },
  {
    id: 4,
    actionTitle: "Virtual Paging & TLB Concept Clinic",
    topic: "Cache Memory & Paging",
    batch: "B.Tech CSE - 2026 Alpha",
    baselineScore: 51.0,
    followUpScore: 54.0,
    delta: 3.0,
    outcome: "stable",
    strategy: "1-on-1 Concept Clinic",
    faculty: "Dr. P. Sreedhar Sir",
    date: "2026-10-04"
  }
];

export default function EduPulsePortal({ user: propUser, setActiveTab }) {
  const { addToast } = useToast?.() || {};
  const { user: gamifiedUser, addXP } = useGamification?.() || {};
  const user = propUser || gamifiedUser;

  // Active Sub-Tab
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'actions' | 'gaps' | 'students' | 'efficacy' | 'import' | 'reports' | 'settings'
  const [selectedBatchId, setSelectedBatchId] = useState(null); // null = all batches
  const [apiOnline, setApiOnline] = useState(false);

  // Core State
  const [actions, setActions] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_edupulse_actions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_ACTIONS;
  });

  const [topicGaps, setTopicGaps] = useState(DEFAULT_TOPIC_GAPS);
  const [students, setStudents] = useState(DEFAULT_STUDENTS);
  const [evaluations, setEvaluations] = useState(DEFAULT_EVALUATIONS);

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState('all');
  const [studentSortBy, setStudentSortBy] = useState('score_desc');
  const [actionFilter, setActionFilter] = useState('all');
  const [actionSearch, setActionSearch] = useState('');
  const [gapSearch, setGapSearch] = useState('');
  const [gapSubjectFilter, setGapSubjectFilter] = useState('all');

  // Modals & Forms
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);
  const [selectedGapForAnalysis, setSelectedGapForAnalysis] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [completingAction, setCompletingAction] = useState(null);
  const [completionGainInput, setCompletionGainInput] = useState('+18.5%');
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [evaluationForm, setEvaluationForm] = useState({
    actionTitle: 'Dijkstra & BFS Visual Problem Clinic',
    topic: 'Graph Traversal & Trees',
    batch: 'B.Tech CSE - 2026 Alpha',
    baselineScore: 42.0,
    followUpScore: 61.5,
    strategy: 'Doubt Clearing Workshop',
    faculty: 'Prof. S. Ramesh Sir'
  });

  const [actionForm, setActionForm] = useState({
    title: '',
    topicName: 'Graph Traversal & Trees',
    subject: 'Data Structures & Algorithms',
    batchName: 'B.Tech CSE - 2026 Alpha',
    batchId: 1,
    strategy: '1-on-1 Concept Clinic',
    assignedTo: 'Prof. S. Ramesh Sir',
    dueDate: '2026-10-25',
    targetCohort: 'P. Keerthi Reddy, M. Rahul Varma',
    notes: ''
  });

  // Settings State
  const [rulesConfig, setRulesConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_edupulse_rules');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      passingThreshold: 50.0,
      minTestsRequired: 2,
      consecutiveDropCount: 2,
      cohortAlertRatio: 40
    };
  });

  // CSV Import State & Ref
  const fileInputRef = React.useRef(null);
  const [csvUploadText, setCsvUploadText] = useState('');
  const [parsedCsvRows, setParsedCsvRows] = useState([]);

  // Check backend connectivity on mount
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/health')
      .then(res => res.json())
      .then(data => {
        if (data?.status === 'healthy') setApiOnline(true);
      })
      .catch(() => setApiOnline(false));
  }, []);

  // Save actions to local storage
  useEffect(() => {
    try {
      localStorage.setItem('lumixora_edupulse_actions', JSON.stringify(actions));
    } catch (e) {}
  }, [actions]);

  // Filtered dataset helpers
  const currentBatch = useMemo(() => {
    if (!selectedBatchId) return null;
    return DEFAULT_BATCHES.find(b => b.id === selectedBatchId);
  }, [selectedBatchId]);

  const filteredStudents = useMemo(() => {
    let list = students.filter(s => {
      const matchBatch = !selectedBatchId || s.batchId === selectedBatchId;
      const matchSearch = !studentSearch || 
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
        s.roll.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.gaps.some(g => g.toLowerCase().includes(studentSearch.toLowerCase()));
      const matchStatus = studentFilter === 'all' || s.status === studentFilter;
      return matchBatch && matchSearch && matchStatus;
    });

    if (studentSortBy === 'score_desc') list.sort((a, b) => b.avgScore - a.avgScore);
    else if (studentSortBy === 'score_asc') list.sort((a, b) => a.avgScore - b.avgScore);
    else if (studentSortBy === 'name_asc') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [students, selectedBatchId, studentSearch, studentFilter, studentSortBy]);

  const filteredTopicGaps = useMemo(() => {
    return topicGaps.filter(g => {
      const matchBatch = !selectedBatchId || g.batchId === selectedBatchId;
      const matchSubject = gapSubjectFilter === 'all' || g.subject === gapSubjectFilter;
      const matchSearch = !gapSearch || 
        g.topicName.toLowerCase().includes(gapSearch.toLowerCase()) || 
        g.subject.toLowerCase().includes(gapSearch.toLowerCase());
      return matchBatch && matchSubject && matchSearch;
    });
  }, [topicGaps, selectedBatchId, gapSubjectFilter, gapSearch]);

  const filteredActions = useMemo(() => {
    return actions.filter(a => {
      const matchBatch = !selectedBatchId || a.batchId === selectedBatchId;
      const matchStatus = actionFilter === 'all' || a.status === actionFilter;
      const matchSearch = !actionSearch || 
        a.title.toLowerCase().includes(actionSearch.toLowerCase()) || 
        a.topicName.toLowerCase().includes(actionSearch.toLowerCase()) || 
        a.assignedTo.toLowerCase().includes(actionSearch.toLowerCase());
      return matchBatch && matchStatus && matchSearch;
    });
  }, [actions, selectedBatchId, actionFilter, actionSearch]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalStudents = filteredStudents.length;
    const avgScore = (filteredStudents.reduce((acc, s) => acc + s.avgScore, 0) / (totalStudents || 1)).toFixed(1);
    const recurringGapsCount = filteredTopicGaps.filter(g => g.isRecurring).length;
    const pendingActionsCount = actions.filter(a => a.status === 'assigned' || a.status === 'in_progress').length;
    const avgGain = (evaluations.reduce((acc, e) => acc + e.delta, 0) / (evaluations.length || 1)).toFixed(1);
    return { totalStudents, avgScore, recurringGapsCount, pendingActionsCount, avgGain };
  }, [filteredStudents, filteredTopicGaps, actions, evaluations]);

  // Handle action status progression
  const handleUpdateActionStatus = (actionId, newStatus) => {
    setActions(prev => prev.map(a => {
      if (a.id === actionId) {
        return {
          ...a,
          status: newStatus,
          measuredGain: newStatus === 'completed' ? (a.measuredGain || '+15.2%') : a.measuredGain
        };
      }
      return a;
    }));
    addToast?.({
      type: 'success',
      message: `Action updated to: ${newStatus.toUpperCase().replace('_', ' ')}!`
    });
    if (newStatus === 'completed' && addXP) addXP(30);
  };

  const handleOpenCompleteModal = (action) => {
    setCompletingAction(action);
    setCompletionGainInput('+18.5%');
  };

  const handleConfirmCompleteAction = () => {
    if (!completingAction) return;
    const gainStr = completionGainInput.startsWith('+') ? completionGainInput : `+${completionGainInput}`;
    const gainNum = parseFloat(gainStr.replace(/[^0-9.-]/g, '')) || 15.0;

    setActions(prev => prev.map(a => {
      if (a.id === completingAction.id) {
        return {
          ...a,
          status: 'completed',
          measuredGain: gainStr
        };
      }
      return a;
    }));

    const newEval = {
      id: Date.now(),
      actionTitle: completingAction.title,
      topic: completingAction.topicName,
      batch: completingAction.batchName,
      baselineScore: 45.0,
      followUpScore: parseFloat((45.0 + gainNum).toFixed(1)),
      delta: gainNum,
      outcome: gainNum >= 15 ? 'marked_gain' : 'moderate_gain',
      strategy: completingAction.strategy,
      faculty: completingAction.assignedTo,
      date: new Date().toISOString().split('T')[0]
    };
    setEvaluations(prev => [newEval, ...prev]);

    addToast?.({
      type: 'success',
      message: `🎉 Intervention verified with ${gainStr} measured gain! (+50 AP)`
    });
    if (addXP) addXP(50);
    setCompletingAction(null);
  };

  const handleDeleteAction = (actionId) => {
    setActions(prev => prev.filter(a => a.id !== actionId));
    addToast?.({
      type: 'info',
      message: '🗑️ Action removed from schedule.'
    });
  };

  // Handle Creating New Action
  const handleCreateAction = (e) => {
    e?.preventDefault();
    if (!actionForm.title.trim()) return;

    const newAction = {
      id: 'act-' + Date.now(),
      gapId: Date.now(),
      title: actionForm.title.trim(),
      topicName: actionForm.topicName,
      subject: actionForm.subject,
      batchName: actionForm.batchName,
      batchId: actionForm.batchId,
      strategy: actionForm.strategy,
      assignedTo: actionForm.assignedTo,
      dueDate: actionForm.dueDate,
      status: 'assigned',
      targetCohort: actionForm.targetCohort.split(',').map(s => s.trim()).filter(Boolean),
      notes: actionForm.notes.trim()
    };

    setActions(prev => [newAction, ...prev]);
    setIsActionModalOpen(false);
    setActionForm({
      title: '',
      topicName: 'Graph Traversal & Trees',
      subject: 'Data Structures & Algorithms',
      batchName: 'B.Tech CSE - 2026 Alpha',
      batchId: 1,
      strategy: '1-on-1 Concept Clinic',
      assignedTo: 'Prof. S. Ramesh Sir',
      dueDate: '2026-10-25',
      targetCohort: 'P. Keerthi Reddy, M. Rahul Varma',
      notes: ''
    });

    addToast?.({
      type: 'success',
      message: `🚀 New intervention scheduled for ${newAction.assignedTo}! (+35 AP)`
    });
    if (addXP) addXP(35);
  };

  // Log Post-Test Result Form Handler
  const handleLogEvaluation = (e) => {
    e?.preventDefault();
    const base = parseFloat(evaluationForm.baselineScore) || 45;
    const post = parseFloat(evaluationForm.followUpScore) || 60;
    const delta = parseFloat((post - base).toFixed(1));

    const newEval = {
      id: Date.now(),
      actionTitle: evaluationForm.actionTitle || `${evaluationForm.topic} Post-Test Assessment`,
      topic: evaluationForm.topic,
      batch: evaluationForm.batch,
      baselineScore: base,
      followUpScore: post,
      delta: delta,
      outcome: delta >= 15 ? 'marked_gain' : delta >= 5 ? 'moderate_gain' : 'stable',
      strategy: evaluationForm.strategy,
      faculty: evaluationForm.faculty,
      date: new Date().toISOString().split('T')[0]
    };

    setEvaluations(prev => [newEval, ...prev]);
    setIsEvaluationModalOpen(false);
    addToast?.({
      type: 'success',
      message: `📈 Post-test result logged! Delta: ${delta >= 0 ? '+' : ''}${delta}% (+35 AP)`
    });
    if (addXP) addXP(35);
  };

  // Handle CSV parser preview
  const handleParseCsv = (content) => {
    setCsvUploadText(content);
    const lines = content.trim().split('\n');
    if (lines.length < 2) return;
    const parsed = lines.slice(1).map((line, idx) => {
      const parts = line.split(',').map(p => p.trim());
      return {
        id: idx + 1,
        studentId: parts[0] || '249X1A0501',
        batch: parts[1] || 'B.Tech CSE - 2026 Alpha',
        testId: parts[2] || 'T-101',
        subject: parts[3] || 'Data Structures & Algorithms',
        topic: parts[4] || 'Graph Traversal & Trees',
        score: parseFloat(parts[5]) || 0,
        maxScore: parseFloat(parts[6]) || 100,
        date: parts[7] || '2026-10-12',
        isValid: !isNaN(parseFloat(parts[5])) && parseFloat(parts[5]) <= (parseFloat(parts[6]) || 100)
      };
    });
    setParsedCsvRows(parsed);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      if (text) handleParseCsv(text);
    };
    reader.readAsText(file);
  };

  const handleCommitIngestion = () => {
    if (!parsedCsvRows.length) return;
    
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        const studentRows = parsedCsvRows.filter(r => 
          r.studentId.toLowerCase() === student.roll.toLowerCase() || 
          r.studentId.toLowerCase() === student.name.toLowerCase()
        );
        if (studentRows.length > 0) {
          const totalNewScore = studentRows.reduce((acc, r) => acc + (r.score / r.maxScore) * 100, 0);
          const newAvg = parseFloat(((student.avgScore * student.testsTaken + totalNewScore) / (student.testsTaken + studentRows.length)).toFixed(1));
          
          const newGaps = [...student.gaps];
          studentRows.forEach(r => {
            const pct = (r.score / r.maxScore) * 100;
            if (pct < rulesConfig.passingThreshold && !newGaps.includes(r.topic)) {
              newGaps.push(r.topic);
            }
          });

          return {
            ...student,
            testsTaken: student.testsTaken + studentRows.length,
            avgScore: newAvg,
            status: newAvg >= 60 ? 'on_track' : newAvg >= 50 ? 'stable' : 'needs_support',
            gaps: newGaps
          };
        }
        return student;
      });
    });

    addToast?.({
      type: 'success',
      message: `✅ Successfully ingested ${parsedCsvRows.length} assessment records! Class analytics updated.`
    });
    if (addXP) addXP(50);
    setCsvUploadText('');
    setParsedCsvRows([]);
    setActiveSubTab('overview');
  };

  // Download Sample CSV
  const handleDownloadSampleCsv = () => {
    const header = "student_id,batch,test_id,subject,topic,score,maximum_score,test_date\n";
    const sample = [
      "249X1A0501,B.Tech CSE - 2026 Alpha,TEST-01,Data Structures & Algorithms,Graph Traversal & Trees,42,100,2026-10-10",
      "249X1A0502,B.Tech CSE - 2026 Alpha,TEST-01,Data Structures & Algorithms,Graph Traversal & Trees,38,100,2026-10-10",
      "249X1A0505,B.Tech CSE - 2026 Alpha,TEST-01,Data Structures & Algorithms,Graph Traversal & Trees,35,100,2026-10-10",
      "249X1A3302,B.Tech AI&ML - 2026 Sigma,TEST-02,Artificial Intelligence & ML,Neural Net Backprop,44,100,2026-10-11",
      "249X1A0402,B.Tech ECE - 2026 Zenith,TEST-03,Signals & Systems,Digital Signal Processing & DFT,40,100,2026-10-11"
    ].join('\n');
    const blob = new Blob([header + sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "lumixora_edupulse_sample_assessments.csv";
    a.click();
    addToast?.({ type: 'info', message: '📥 Sample Assessment CSV downloaded successfully!' });
  };

  // Download Individual Scholar Dossier PDF
  const handleDownloadScholarDossier = (stu) => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const inst = user?.college || DEFAULT_INSTITUTION.name;
      
      doc.setFillColor(5, 11, 23);
      doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
      
      doc.setTextColor(34, 211, 238);
      doc.setFontSize(16);
      doc.text("LUMIXORA STUDENT OS • VERIFIED SCHOLAR DIAGNOSTIC DOSSIER", 40, 50);
      
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(`Institution: ${inst} | Generated: ${new Date().toLocaleDateString()}`, 40, 70);
      doc.text(`Lead Coordinator: Dr. K. Govardhan Reddy (HOD - CSE) | Platform: Lumixora EduPulse™`, 40, 85);

      const scholarTable = [
        ['Scholar Name', stu.name],
        ['Roll Number', stu.roll],
        ['Cohort & Department', stu.batchName],
        ['Cumulative Diagnostic Average', `${stu.avgScore}%`],
        ['Diagnostic Tests Attempted', `${stu.testsTaken} Assessments`],
        ['Academic Performance Status', stu.status.toUpperCase().replace('_', ' ')],
        ['Identified Opportunity Gaps', stu.gaps.length > 0 ? stu.gaps.join(', ') : 'None (Mastery Demonstrated)'],
        ['Pedagogical Policy', 'Transparent Non-Punitive Remediation Active']
      ];

      autoTable(doc, {
        startY: 105,
        head: [['Profile Attribute', 'Verified Diagnostic Assessment']],
        body: scholarTable,
        theme: 'grid',
        headStyles: { fillColor: [8, 145, 178], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { fillColor: [15, 23, 42], textColor: [226, 232, 240] },
        alternateRowStyles: { fillColor: [30, 41, 59] },
        styles: { fontSize: 10, cellPadding: 6 }
      });

      const finalY = doc.lastAutoTable.finalY + 25;
      doc.setTextColor(34, 211, 238);
      doc.setFontSize(12);
      doc.text("FACULTY MENTOR ACTION PLAN & GUIDANCE", 40, finalY);

      doc.setTextColor(203, 213, 225);
      doc.setFontSize(9);
      const noteText = stu.gaps.length > 0 
        ? `This scholar has been scheduled for targeted 1-on-1 concept clinics and practice sets on ${stu.gaps.join(' and ')}. Our autonomous diagnostics isolate topic-specific friction without adverse performance labeling.`
        : `This scholar maintains strong conceptual mastery across all evaluated topics. Recommended for advanced competitive programming problems and placement mock interviews.`;
      
      const splitText = doc.splitTextToSize(noteText, 515);
      doc.text(splitText, 40, finalY + 18);

      doc.setDrawColor(51, 65, 85);
      doc.line(40, finalY + 60, doc.internal.pageSize.width - 40, finalY + 60);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Lumixora Verified Academic Audit • Digitally Signed by GPREC Academic Lead", 40, finalY + 75);

      doc.save(`Lumixora_Scholar_${stu.roll}_Diagnostic_Dossier.pdf`);
      addToast?.({ type: 'success', message: `📄 Verified Dossier downloaded for ${stu.name}!` });
    } catch (err) {
      console.error(err);
      addToast?.({ type: 'error', message: 'Failed to generate PDF.' });
    }
  };

  // Download Executive Cohort Audit PDF
  const handleDownloadCohortAuditPdf = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const inst = user?.college || DEFAULT_INSTITUTION.name;
      
      doc.setFillColor(5, 11, 23);
      doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
      
      doc.setTextColor(34, 211, 238);
      doc.setFontSize(16);
      doc.text("LUMIXORA EDUPULSE • COHORT BENCHMARK AUDIT", 40, 50);
      
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(`Institution: ${inst} | Date: ${new Date().toLocaleDateString()}`, 40, 70);

      const auditRows = DEFAULT_BATCHES.map(b => [
        b.name,
        b.program,
        b.department,
        `${b.studentCount} Scholars`,
        `${b.avgScore}%`,
        b.avgScore >= 60 ? 'Exceeding' : 'Benchmark Met'
      ]);

      autoTable(doc, {
        startY: 90,
        head: [['Cohort', 'Degree Program', 'Dept', 'Scholars', 'Avg Mastery', 'Benchmark Status']],
        body: auditRows,
        theme: 'grid',
        headStyles: { fillColor: [8, 145, 178], textColor: 255 },
        bodyStyles: { fillColor: [15, 23, 42], textColor: [226, 232, 240] },
        styles: { fontSize: 9 }
      });

      doc.save("Lumixora_Cohort_Benchmark_Audit.pdf");
      addToast?.({ type: 'success', message: '📥 Cohort Audit PDF downloaded!' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRules = () => {
    try {
      localStorage.setItem('lumixora_edupulse_rules', JSON.stringify(rulesConfig));
    } catch(e) {}
    
    setTopicGaps(prev => prev.map(g => ({
      ...g,
      severity: g.avgScore < (rulesConfig.passingThreshold - 5) ? 'high' : 'medium'
    })));

    addToast?.({
      type: 'success',
      message: `⚙️ Diagnostic thresholds updated! Passing benchmark set to ${rulesConfig.passingThreshold}%.`
    });
  };

  const handleResetRules = () => {
    const defaults = {
      passingThreshold: 50.0,
      minTestsRequired: 2,
      consecutiveDropCount: 2,
      cohortAlertRatio: 40
    };
    setRulesConfig(defaults);
    try {
      localStorage.setItem('lumixora_edupulse_rules', JSON.stringify(defaults));
    } catch(e) {}
    addToast?.({
      type: 'info',
      message: '🔄 Rules restored to Lumixora standard defaults.'
    });
  };

  const institutionName = user?.college || DEFAULT_INSTITUTION.name;

  return (
    <div className="space-y-6 font-sans text-gray-100 pb-16">
      {/* ─── INSTITUTION BRANDING & LUMIXORA HEADER BAR ─── */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-[#050b17] via-[#09152b] to-[#040813] border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-widest border border-cyan-400/40 flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-cyan-400 animate-spin" /> Lumixora EduPulse™ • Test-to-Action Platform
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1 border ${apiOnline ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'}`}>
              <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
              {apiOnline ? 'FastAPI Diagnostic Engine Online (8000)' : 'Client Local Storage Mode'}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-white font-sora tracking-tight flex items-center gap-2">
            <span>{institutionName}</span>
          </h1>
          <p className="text-xs md:text-sm text-cyan-200/80 font-medium">
            "{DEFAULT_INSTITUTION.tagline}" • <span className="text-gray-400 text-xs font-mono">Dr. K. Govardhan Reddy (Academic Lead & HOD - CSE)</span>
          </p>
        </div>

        {/* Batch Filter & Fast Action Button */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <div className="bg-black/50 p-1 rounded-2xl border border-white/10 flex items-center text-xs">
            <button
              onClick={() => setSelectedBatchId(null)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${!selectedBatchId ? 'bg-cyan-400 text-black font-black shadow-lg shadow-cyan-500/25' : 'text-gray-400 hover:text-white'}`}
            >
              All Cohorts (32)
            </button>
            {DEFAULT_BATCHES.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBatchId(b.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${selectedBatchId === b.id ? 'bg-cyan-400 text-black font-black shadow-lg shadow-cyan-500/25' : 'text-gray-400 hover:text-white'}`}
              >
                {b.name.split('-')[0].replace('B.Tech ', '')} ({b.studentCount})
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsActionModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-black font-black text-xs shadow-lg shadow-cyan-500/30 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Action</span>
          </button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ─── NAVIGATION TABS STRIP ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 text-xs font-bold scrollbar-thin">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: BarChart2 },
          { id: 'actions', label: `Teacher Action Centre (${filteredActions.length})`, icon: Zap, badge: 'Hero' },
          { id: 'gaps', label: `Topic Gaps (${filteredTopicGaps.length})`, icon: AlertTriangle },
          { id: 'students', label: `Student Profiles (${filteredStudents.length})`, icon: Users },
          { id: 'efficacy', label: 'Intervention Efficacy', icon: TrendingUp },
          { id: 'import', label: 'CSV Assessment Import', icon: Upload },
          { id: 'reports', label: 'Report Dossiers', icon: FileText },
          { id: 'settings', label: 'Rules & Thresholds', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border ${isActive ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-md shadow-teal-500/20' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full bg-teal-400 text-black text-[9px] font-black uppercase">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── SUB-TAB 1: OVERVIEW & INSTITUTION KPIS ─── */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* 5 Hero Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#030d17] border border-blue-500/30 space-y-1">
              <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider font-bold">Enrolled Students</span>
              <div className="text-2xl font-black text-white">{summaryMetrics.totalStudents}</div>
              <span className="text-[11px] text-gray-400 block">{currentBatch ? currentBatch.name : 'Across 3 Batches'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#030d17] border border-teal-500/30 space-y-1">
              <span className="text-[10px] text-teal-400 font-mono uppercase tracking-wider font-bold">Average Score</span>
              <div className="text-2xl font-black text-white">{summaryMetrics.avgScore}%</div>
              <span className="text-[11px] text-emerald-400 block">Benchmark Passing: 50.0%</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#030d17] border border-amber-500/30 space-y-1">
              <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider font-bold">Recurring Topic Gaps</span>
              <div className="text-2xl font-black text-white">{summaryMetrics.recurringGapsCount}</div>
              <span className="text-[11px] text-amber-300 block">Needs targeted remediation</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#030d17] border border-purple-500/30 space-y-1">
              <span className="text-[10px] text-purple-400 font-mono uppercase tracking-wider font-bold">Pending Actions</span>
              <div className="text-2xl font-black text-white">{summaryMetrics.pendingActionsCount}</div>
              <span className="text-[11px] text-gray-400 block">Assigned to faculty</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#030d17] border border-emerald-500/30 space-y-1">
              <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider font-bold">Observed Gain</span>
              <div className="text-2xl font-black text-emerald-300">+{summaryMetrics.avgGain}%</div>
              <span className="text-[11px] text-gray-400 block">Post-intervention delta</span>
            </div>
          </div>

          {/* Batch Comparison Bars & Topic Warning Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Batch Benchmark Comparison */}
            <div className="p-5 rounded-3xl bg-[#020912] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-sora">
                    <Award className="w-4 h-4 text-teal-400" /> Cohort Performance Benchmarks
                  </h3>
                  <span className="text-[11px] text-gray-400">Average assessment scores vs 50% passing threshold</span>
                </div>
              </div>

              <div className="space-y-3">
                {DEFAULT_BATCHES.map(b => (
                  <div key={b.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white">{b.name}</strong>
                        <span className="text-[10px] text-gray-400 ml-2">({b.program} • {b.studentCount} Students)</span>
                      </div>
                      <span className="font-mono font-bold text-teal-300">{b.avgScore}%</span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden relative">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${b.avgScore}%` }}
                      />
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-rose-500" title="50% Threshold" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Concept Weaknesses Stream */}
            <div className="p-5 rounded-3xl bg-[#020912] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-sora">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Active Concept Bottlenecks
                  </h3>
                  <span className="text-[11px] text-gray-400">Identified by transparent 2-test recurring drop rules</span>
                </div>
                <button
                  onClick={() => setActiveSubTab('gaps')}
                  className="text-[11px] text-teal-400 hover:underline flex items-center gap-0.5"
                >
                  <span>View All Gaps</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {filteredTopicGaps.slice(0, 3).map(g => (
                  <div key={g.id} className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-200">{g.topicName}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                        Avg: {g.avgScore}% ({g.affectedStudents}/{g.totalStudents} Students)
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                      {g.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 2: TEACHER ACTION CENTRE (HERO) ─── */}
      {activeSubTab === 'actions' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="p-3.5 rounded-2xl bg-[#030c17] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-gray-400 font-bold mr-1">Status:</span>
              {['all', 'assigned', 'in_progress', 'completed'].map(st => (
                <button
                  key={st}
                  onClick={() => setActionFilter(st)}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${actionFilter === st ? 'bg-cyan-400 text-black font-black shadow-md shadow-cyan-500/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                >
                  {st.toUpperCase().replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-xs min-w-[200px] bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={actionSearch}
                onChange={(e) => setActionSearch(e.target.value)}
                placeholder="Search actions by topic, mentor, title..."
                className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-full"
              />
              {actionSearch && (
                <button onClick={() => setActionSearch('')} className="text-gray-400 hover:text-white text-xs">×</button>
              )}
            </div>

            <span className="text-[11px] text-gray-400 font-mono">
              Showing {filteredActions.length} Actions
            </span>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredActions.map(action => (
              <div
                key={action.id}
                className={`p-4 rounded-3xl border transition-all space-y-3 relative flex flex-col justify-between ${action.status === 'completed' ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/20' : 'bg-[#020b16] border-cyan-500/30 hover:border-cyan-400/80'}`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                          {action.subject} • {action.batchName}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${action.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                          {action.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1">{action.title}</h4>
                      <span className="text-[11px] text-gray-400 block font-mono">Topic: {action.topicName}</span>
                    </div>

                    <span className="text-2xl shrink-0">
                      {action.strategy.includes('Workshop') ? '🛠️' : action.strategy.includes('Clinic') ? '🩺' : action.strategy.includes('Sheet') ? '📝' : '⚡'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>Assignee: <strong className="text-white">{action.assignedTo}</strong></span>
                      <span>Due: <strong className="text-white font-mono">{action.dueDate}</strong></span>
                    </div>
                    <div className="text-[11px] text-gray-300">
                      Target Scholars ({action.targetCohort.length}):{' '}
                      {action.targetCohort.map((name, ni) => (
                        <button
                          key={ni}
                          onClick={() => {
                            const found = students.find(s => s.name.toLowerCase() === name.toLowerCase());
                            if (found) setSelectedStudentForModal(found);
                            else setSelectedStudentForModal({ id: Date.now(), name, roll: '249X1A05' + (10 + ni), batchName: action.batchName, avgScore: 54.0, status: 'stable', gaps: [action.topicName], testsTaken: 5 });
                          }}
                          className="text-cyan-300 hover:text-white underline cursor-pointer inline-block mr-1 font-semibold"
                          title="Click to view scholar profile"
                        >
                          {name}{ni < action.targetCohort.length - 1 ? ',' : ''}
                        </button>
                      ))}
                    </div>
                    {action.notes && (
                      <p className="text-[11px] text-gray-400 italic pt-1 border-t border-white/5">
                        "{action.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] font-mono">
                    {action.measuredGain ? (
                      <span className="text-emerald-300 font-bold">Observed Delta: {action.measuredGain}</span>
                    ) : (
                      <span className="text-gray-500">Post-test pending</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {action.status !== 'completed' && (
                      <button
                        onClick={() => handleOpenCompleteModal(action)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-emerald-500/20"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Complete Action</span>
                      </button>
                    )}
                    {action.status === 'assigned' && (
                      <button
                        onClick={() => handleUpdateActionStatus(action.id, 'in_progress')}
                        className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Start
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAction(action.id)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 transition-all cursor-pointer"
                      title="Delete this action"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 3: TOPIC GAPS ENGINE ─── */}
      {activeSubTab === 'gaps' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-[#020b16] border border-amber-500/30 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sora">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Transparent Topic Gap Diagnostic Rules
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Unlike black-box predictions, EduPulse flags concepts solely when moving averages across assessments fall below {rulesConfig.passingThreshold}% for {rulesConfig.minTestsRequired} consecutive tests. Single-test drops are tagged as transient variance rather than recurring failure.
            </p>
          </div>

          {/* Filter & Search Bar for Topic Gaps */}
          <div className="p-3 rounded-2xl bg-[#030c17] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-gray-400 font-bold mr-1">Subject:</span>
              {['all', 'Data Structures & Algorithms', 'Artificial Intelligence & ML', 'Signals & Systems', 'DBMS & Systems', 'Operating Systems'].map(subj => (
                <button
                  key={subj}
                  onClick={() => setGapSubjectFilter(subj)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${gapSubjectFilter === subj ? 'bg-cyan-400 text-black font-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                >
                  {subj === 'all' ? 'All Subjects' : subj.split('&')[0]}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={gapSearch}
                onChange={(e) => setGapSearch(e.target.value)}
                placeholder="Search concept bottlenecks..."
                className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-full"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredTopicGaps.map(gap => (
              <div key={gap.id} className="p-4 rounded-2xl bg-[#020812] border border-white/10 space-y-2.5 hover:border-cyan-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                        {gap.subject} • {gap.batchName}
                      </span>
                      {gap.isRecurring ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold uppercase">
                          Recurring Drop ({rulesConfig.minTestsRequired}+ Tests)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase">
                          Single Drop (Monitoring)
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-base mt-1">{gap.topicName}</h4>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <span className="text-xs font-mono text-gray-400">
                      Average: <strong className="text-amber-300">{gap.avgScore}%</strong> ({gap.affectedStudents} of {gap.totalStudents} Scholars)
                    </span>
                    <button
                      onClick={() => {
                        setActionForm(prev => ({
                          ...prev,
                          topicName: gap.topicName,
                          subject: gap.subject,
                          batchName: gap.batchName,
                          title: `Targeted Revision Clinic: ${gap.topicName}`
                        }));
                        setIsActionModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-all cursor-pointer"
                    >
                      + Create Intervention
                    </button>
                    <button
                      onClick={() => setSelectedGapForAnalysis(selectedGapForAnalysis === gap.id ? null : gap.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      {selectedGapForAnalysis === gap.id ? 'Hide Details' : 'Analyze Scholars'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-300 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed font-sans">
                  {gap.rationale}
                </p>

                {/* Expandable Affected Scholars Analysis */}
                {selectedGapForAnalysis === gap.id && (
                  <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-cyan-300 font-bold">Identified Scholars Bottlenecked on "{gap.topicName}":</span>
                      <button
                        onClick={() => {
                          const affectedNames = students.filter(s => s.gaps.includes(gap.topicName)).map(s => s.name);
                          setActionForm(prev => ({
                            ...prev,
                            topicName: gap.topicName,
                            subject: gap.subject,
                            batchName: gap.batchName,
                            title: `Cohort Workshop: ${gap.topicName} Mastery`,
                            strategy: 'Doubt Clearing Workshop',
                            targetCohort: affectedNames.join(', ') || 'All Affected Scholars'
                          }));
                          setIsActionModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-400 text-black font-black text-[11px] hover:bg-cyan-300 transition-all cursor-pointer"
                      >
                        ⚡ 1-Click Cohort Workshop
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {students.filter(s => s.gaps.includes(gap.topicName)).map(stu => (
                        <button
                          key={stu.id}
                          onClick={() => setSelectedStudentForModal(stu)}
                          className="px-2 py-1 rounded-lg bg-black/60 border border-cyan-500/30 text-white font-mono text-[11px] hover:border-cyan-400 cursor-pointer flex items-center gap-1"
                        >
                          <span>{stu.roll}</span>
                          <span className="text-gray-400">({stu.name})</span>
                          <span className="text-rose-400 font-bold ml-1">{stu.avgScore}%</span>
                        </button>
                      ))}
                      {students.filter(s => s.gaps.includes(gap.topicName)).length === 0 && (
                        <span className="text-gray-400 text-xs italic">Scholars recorded in previous batch run.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 4: STUDENT PROFILES (32 SCHOLARS) ─── */}
      {activeSubTab === 'students' && (
        <div className="space-y-4">
          {/* Search, Sort & Filters */}
          <div className="p-3.5 rounded-2xl bg-[#030c17] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[220px] bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search scholars by name, roll (e.g. '249X1A0501'), or gap..."
                className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-full"
              />
              {studentSearch && (
                <button onClick={() => setStudentSearch('')} className="text-gray-400 hover:text-white text-xs">×</button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 font-bold mr-1">Status:</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'on_track', label: 'On Track (>60%)' },
                  { id: 'stable', label: 'Stable (50-60%)' },
                  { id: 'needs_support', label: 'Needs Support (<50%)' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setStudentFilter(f.id)}
                    className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${studentFilter === f.id ? 'bg-cyan-400 text-black font-black shadow-md shadow-cyan-500/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-xl border border-white/10">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={studentSortBy}
                  onChange={(e) => setStudentSortBy(e.target.value)}
                  className="bg-transparent text-gray-300 text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="score_desc" className="bg-[#0b1329] text-white">Score (High to Low)</option>
                  <option value="score_asc" className="bg-[#0b1329] text-white">Score (Low to High)</option>
                  <option value="name_asc" className="bg-[#0b1329] text-white">Name (A to Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="rounded-3xl bg-[#020812] border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-gray-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-4">Roll Number</th>
                    <th className="py-3.5 px-4">Scholar Name</th>
                    <th className="py-3.5 px-4">Cohort</th>
                    <th className="py-3.5 px-4">Average Mastery</th>
                    <th className="py-3.5 px-4">Opportunity Gaps</th>
                    <th className="py-3.5 px-4">Status & Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {filteredStudents.map(stu => (
                    <tr 
                      key={stu.id} 
                      className="hover:bg-cyan-500/5 transition-colors cursor-pointer group"
                      onClick={() => setSelectedStudentForModal(stu)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">{stu.roll}</td>
                      <td className="py-3.5 px-4 font-bold text-white group-hover:text-cyan-200 transition-colors">{stu.name}</td>
                      <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">{stu.batchName}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold ${stu.avgScore >= 60 ? 'text-emerald-400' : stu.avgScore >= 50 ? 'text-cyan-300' : 'text-rose-400'}`}>
                            {stu.avgScore}%
                          </span>
                          <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden hidden sm:block">
                            <div 
                              className={`h-full rounded-full ${stu.avgScore >= 60 ? 'bg-emerald-400' : stu.avgScore >= 50 ? 'bg-cyan-400' : 'bg-rose-400'}`} 
                              style={{ width: `${Math.min(100, stu.avgScore)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {stu.gaps.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {stu.gaps.map((g, gi) => (
                              <span key={gi} className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                                {g}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Full Mastery
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${stu.status === 'on_track' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : stu.status === 'stable' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                            {stu.status.replace('_', ' ')}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadScholarDossier(stu);
                            }}
                            className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-cyan-300 transition-all cursor-pointer"
                            title="Download Verified Dossier PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400 text-xs">
                        No scholars match your current search or filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 5: INTERVENTION EFFICACY TRACKER ─── */}
      {activeSubTab === 'efficacy' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-[#020b16] border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sora">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Longitudinal Assessment Delta Tracking
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans mt-1">
                EduPulse pairs pre-intervention baseline assessment scores with subsequent follow-up tests to compute empirical score deltas. Outcomes are presented as verified score changes maintaining non-causal reporting integrity.
              </p>
            </div>
            <button
              onClick={() => setIsEvaluationModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Log Post-Test Result</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluations.map(ev => (
              <div key={ev.id} className="p-4 rounded-2xl bg-[#020812] border border-white/10 space-y-3 hover:border-emerald-500/40 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      {ev.batch} • {ev.strategy}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{ev.actionTitle}</h4>
                    <span className="text-[11px] text-gray-400 font-mono">Faculty Mentor: {ev.faculty} ({ev.date})</span>
                  </div>

                  <span className={`text-lg font-mono font-black ${ev.delta >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                    {ev.delta >= 0 ? '+' : ''}{ev.delta}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Pre-Intervention Baseline</span>
                    <strong className="text-amber-300">{ev.baselineScore}%</strong>
                  </div>
                  <span className="text-gray-500">─── ➔ ───</span>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px]">Post-Intervention Result</span>
                    <strong className="text-emerald-300">{ev.followUpScore}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 6: ASSESSMENT CSV IMPORT & VALIDATION ─── */}
      {activeSubTab === 'import' && (
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,text/csv"
            className="hidden"
          />

          <div className="p-4 rounded-3xl bg-[#020b16] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sora">
                <Upload className="w-4 h-4 text-cyan-400" /> Assessment Marks CSV Batch Ingestion
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Upload weekend test sheets or assignment marks to trigger instant rule-based topic gap detection.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md shadow-cyan-500/20"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Browse CSV File</span>
              </button>
              <button
                onClick={handleDownloadSampleCsv}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV</span>
              </button>
            </div>
          </div>

          {/* Paste CSV or File Drag Area */}
          <div className="p-5 rounded-3xl bg-[#020812] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white block">Or Paste Raw CSV Data Below:</span>
              <span className="text-[11px] text-gray-400 font-mono">Format: student_id, batch, test_id, subject, topic, score, max_score, date</span>
            </div>
            <textarea
              rows={4}
              value={csvUploadText}
              onChange={(e) => handleParseCsv(e.target.value)}
              placeholder="student_id,batch,test_id,subject,topic,score,maximum_score,test_date..."
              className="w-full bg-black/50 border border-white/10 rounded-2xl p-3 font-mono text-xs text-cyan-200 outline-none focus:border-cyan-400 transition-all"
            />

            {parsedCsvRows.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Pre-Commit Validation Preview ({parsedCsvRows.length} Rows):</span>
                  <span className="text-emerald-400 font-mono">✓ 0 Schema Violations</span>
                </div>

                <div className="rounded-2xl border border-white/10 overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/5 text-gray-400 text-[10px]">
                      <tr>
                        <th className="p-2.5">Row</th>
                        <th className="p-2.5">Scholar Roll/ID</th>
                        <th className="p-2.5">Cohort</th>
                        <th className="p-2.5">Subject</th>
                        <th className="p-2.5">Topic</th>
                        <th className="p-2.5">Score</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {parsedCsvRows.map(r => (
                        <tr key={r.id}>
                          <td className="p-2.5 text-gray-400">{r.id}</td>
                          <td className="p-2.5 text-white font-bold">{r.studentId}</td>
                          <td className="p-2.5 text-gray-300">{r.batch}</td>
                          <td className="p-2.5 text-cyan-300">{r.subject}</td>
                          <td className="p-2.5 text-gray-300">{r.topic}</td>
                          <td className="p-2.5 text-amber-300 font-bold">{r.score}/{r.maxScore}</td>
                          <td className="p-2.5 text-emerald-400">Valid</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={handleCommitIngestion}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-black font-black text-xs transition-all cursor-pointer shadow-lg shadow-cyan-500/25 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Commit Ingestion to Database & Recalculate Gaps</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 7: REPORT DOSSIERS ─── */}
      {activeSubTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-[#020b16] border border-white/10 space-y-3 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
            <div className="space-y-1.5">
              <span className="text-2xl">📋</span>
              <h4 className="font-bold text-white text-sm">Cohort Benchmark Audit</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Comprehensive executive summary of all 3 cohorts with passing ratios and academic lead signature.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  const csv = "cohort,program,scholars,avg_score\nB.Tech CSE - 2026 Alpha,Computer Science & Engineering,12,68.5\nB.Tech AI&ML - 2026 Sigma,Artificial Intelligence & ML,10,64.2\nB.Tech ECE - 2026 Zenith,Electronics & Communication,10,59.8\n";
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = "lumixora_cohort_performance_audit.csv";
                  a.click();
                  addToast?.({ type: 'info', message: '📥 Cohort Audit CSV exported!' });
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
              <button
                onClick={handleDownloadCohortAuditPdf}
                className="flex-1 px-3 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF Audit</span>
              </button>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#020b16] border border-white/10 space-y-3 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
            <div className="space-y-1.5">
              <span className="text-2xl">📊</span>
              <h4 className="font-bold text-white text-sm">Intervention Efficacy Master</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Longitudinal pre/post diagnostic deltas across Data Structures, AI, Database, and Signals labs.
              </p>
            </div>
            <button
              onClick={() => {
                const csvHeader = "action_title,topic,batch,strategy,faculty,baseline_score,follow_up_score,delta_gain,date\n";
                const rows = evaluations.map(e => `"${e.actionTitle}","${e.topic}","${e.batch}","${e.strategy}","${e.faculty}",${e.baselineScore},${e.followUpScore},+${e.delta}%,"${e.date}"`).join('\n');
                const blob = new Blob([csvHeader + rows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "lumixora_intervention_efficacy_master.csv";
                a.click();
                addToast?.({ type: 'info', message: '📥 Intervention Efficacy Master exported!' });
              }}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Efficacy CSV</span>
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-[#020b16] border border-white/10 space-y-3 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
            <div className="space-y-1.5">
              <span className="text-2xl">🎓</span>
              <h4 className="font-bold text-white text-sm">Scholar Diagnostic Dossier</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Generate verified high-resolution PDF dossier breakdown with subject mastery, bottlenecks, and guidance.
              </p>
            </div>
            <button
              onClick={() => {
                if (students.length > 0) handleDownloadScholarDossier(students[0]);
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-black font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Sample Scholar PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 8: RULES CONFIGURATION ─── */}
      {activeSubTab === 'settings' && (
        <div className="max-w-xl p-5 rounded-3xl bg-[#020b16] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sora">
            <Settings className="w-4 h-4 text-cyan-400" /> Threshold & Algorithmic Parameters
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gray-300 font-bold">Passing Benchmark Threshold (%):</label>
                <span className="font-mono text-cyan-300 font-bold">{rulesConfig.passingThreshold}%</span>
              </div>
              <input
                type="number"
                min={30}
                max={90}
                value={rulesConfig.passingThreshold}
                onChange={(e) => setRulesConfig(prev => ({ ...prev, passingThreshold: parseFloat(e.target.value) || 50 }))}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white font-mono outline-none focus:border-cyan-400 transition-all"
              />
              <span className="text-[10px] text-gray-500 block mt-0.5">Concepts below this percentage will be flagged for remedial attention.</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gray-300 font-bold">Minimum Tests Before Recurring Flag:</label>
                <span className="font-mono text-cyan-300 font-bold">{rulesConfig.minTestsRequired} Tests</span>
              </div>
              <input
                type="number"
                min={1}
                max={5}
                value={rulesConfig.minTestsRequired}
                onChange={(e) => setRulesConfig(prev => ({ ...prev, minTestsRequired: parseInt(e.target.value, 10) || 2 }))}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white font-mono outline-none focus:border-cyan-400 transition-all"
              />
              <span className="text-[10px] text-gray-500 block mt-0.5">Prevents flagging based on isolated single-test noise.</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gray-300 font-bold">Cohort Alert Ratio (% of batch affected):</label>
                <span className="font-mono text-cyan-300 font-bold">{rulesConfig.cohortAlertRatio}%</span>
              </div>
              <input
                type="number"
                min={10}
                max={90}
                value={rulesConfig.cohortAlertRatio}
                onChange={(e) => setRulesConfig(prev => ({ ...prev, cohortAlertRatio: parseInt(e.target.value, 10) || 40 }))}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white font-mono outline-none focus:border-cyan-400 transition-all"
              />
              <span className="text-[10px] text-gray-500 block mt-0.5">Triggers batch-wide workshop recommendations if exceeded.</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSaveRules}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                Save Configuration
              </button>
              <button
                onClick={handleResetRules}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-xs transition-all cursor-pointer"
              >
                Reset to Recommended Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: CREATE ACTION MODAL ─── */}
      {isActionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-[#030e1a] border border-cyan-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sora">
                <Zap className="w-4 h-4 text-cyan-400" /> Schedule Pedagogical Intervention Action
              </h3>
              <button onClick={() => setIsActionModalOpen(false)} className="text-gray-400 hover:text-white p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAction} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Intervention Title:</label>
                <input
                  type="text"
                  required
                  value={actionForm.title}
                  onChange={(e) => setActionForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. 1-on-1 Code Clinic on Graph Traversal & Dijkstra..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Strategy Type:</label>
                  <select
                    value={actionForm.strategy}
                    onChange={(e) => setActionForm(prev => ({ ...prev, strategy: e.target.value }))}
                    className="w-full bg-[#0b1329] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400"
                  >
                    <option>1-on-1 Concept Clinic</option>
                    <option>Doubt Clearing Workshop</option>
                    <option>Targeted Practice Problem Sheet</option>
                    <option>Foundational Re-lecture</option>
                    <option>15-min Diagnostic Reassessment</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Faculty Mentor Assignee:</label>
                  <select
                    value={actionForm.assignedTo}
                    onChange={(e) => setActionForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full bg-[#0b1329] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400"
                  >
                    {DEFAULT_FACULTY.map(f => (
                      <option key={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Target Scholars (comma separated):</label>
                <input
                  type="text"
                  value={actionForm.targetCohort}
                  onChange={(e) => setActionForm(prev => ({ ...prev, targetCohort: e.target.value }))}
                  placeholder="e.g. K. Sai Teja, P. Keerthi Reddy"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Classroom Observations & Notes:</label>
                <textarea
                  rows={2}
                  value={actionForm.notes}
                  onChange={(e) => setActionForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes regarding specific student error patterns..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  Confirm & Schedule Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: COMPLETE ACTION CONFIRMATION MODAL ─── */}
      {completingAction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#030e1a] border border-emerald-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sora">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Complete Remedial Intervention
              </h3>
              <button onClick={() => setCompletingAction(null)} className="text-gray-400 hover:text-white p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[11px] text-gray-400 block font-mono">{completingAction.subject} • {completingAction.batchName}</span>
                <strong className="text-white text-sm block">{completingAction.title}</strong>
                <span className="text-cyan-300 text-[11px]">Topic: {completingAction.topicName}</span>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Measured Post-Test Gain Delta (%):</label>
                <input
                  type="text"
                  value={completionGainInput}
                  onChange={(e) => setCompletionGainInput(e.target.value)}
                  placeholder="e.g. +18.5%"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-emerald-300 font-mono text-sm font-bold outline-none focus:border-emerald-400"
                />
                <span className="text-[10px] text-gray-500 block mt-0.5">This delta will be recorded in the Longitudinal Efficacy Ledger.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCompletingAction(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCompleteAction}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Confirm Completion (+50 AP)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: LOG POST-TEST EVALUATION MODAL ─── */}
      {isEvaluationModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#030e1a] border border-emerald-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sora">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Log Longitudinal Assessment Result
              </h3>
              <button onClick={() => setIsEvaluationModalOpen(false)} className="text-gray-400 hover:text-white p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogEvaluation} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Assessment / Clinic Title:</label>
                <input
                  type="text"
                  required
                  value={evaluationForm.actionTitle}
                  onChange={(e) => setEvaluationForm(prev => ({ ...prev, actionTitle: e.target.value }))}
                  placeholder="e.g. Graph Shortest Path Dijkstra Speed Drill"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Pre-Test Baseline (%):</label>
                  <input
                    type="number"
                    required
                    value={evaluationForm.baselineScore}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, baselineScore: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-amber-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Post-Test Result (%):</label>
                  <input
                    type="number"
                    required
                    value={evaluationForm.followUpScore}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, followUpScore: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-emerald-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Concept Topic:</label>
                <input
                  type="text"
                  required
                  value={evaluationForm.topic}
                  onChange={(e) => setEvaluationForm(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEvaluationModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black shadow-md shadow-emerald-500/20"
                >
                  Save Result (+35 AP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: STUDENT PROFILE DETAIL ─── */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#030e1a] border border-cyan-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white font-sora">{selectedStudentForModal.name}</h3>
                <span className="text-xs font-mono text-cyan-300">{selectedStudentForModal.roll} • {selectedStudentForModal.batchName}</span>
              </div>
              <button onClick={() => setSelectedStudentForModal(null)} className="text-gray-400 hover:text-white p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 block text-[11px]">Cumulative Diagnostic Average:</span>
                  <span className="text-lg font-mono font-bold text-cyan-300">{selectedStudentForModal.avgScore}%</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block text-[11px]">Evaluations Attempted:</span>
                  <span className="text-sm font-mono font-bold text-white">{selectedStudentForModal.testsTaken} Assessments</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 font-bold block mb-1.5">Identified Opportunity Topics:</span>
                {selectedStudentForModal.gaps && selectedStudentForModal.gaps.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudentForModal.gaps.map((g, gi) => (
                      <span key={gi} className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs border border-amber-500/30">
                        ⚠️ {g}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-emerald-400 font-mono text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Full conceptual mastery across all evaluated topics.
                  </span>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-[11px] text-gray-300 leading-relaxed font-sans">
                <strong>Non-Punitive Guidance Policy:</strong> This scholar is scheduled for targeted micro-workshops and doubt clinics without lowering platform placement readiness or peer standing.
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    setActionForm(prev => ({
                      ...prev,
                      title: `1-on-1 Clinic: ${selectedStudentForModal.gaps?.[0] || 'Core Revision'}`,
                      topicName: selectedStudentForModal.gaps?.[0] || 'Graph Traversal & Trees',
                      targetCohort: selectedStudentForModal.name,
                      batchName: selectedStudentForModal.batchName
                    }));
                    setSelectedStudentForModal(null);
                    setIsActionModalOpen(true);
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Schedule Remedial Action</span>
                </button>
                <button
                  onClick={() => handleDownloadScholarDossier(selectedStudentForModal)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Dossier</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
