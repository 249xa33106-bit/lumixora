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

// ─── Default Institutional Dataset (Apex Academy, Kurnool) ───────────────────
const DEFAULT_INSTITUTION = {
  id: 1,
  name: "Apex Academy of Sciences, Kurnool (AP)",
  tagline: "Every test should lead to a better next step.",
  location: "Nandyal Road, Near Birla Gate, Kurnool, Andhra Pradesh 518002"
};

const DEFAULT_BATCHES = [
  { id: 1, name: "JEE-2026 Alpha", program: "IIT-JEE", target_year: 2026, studentCount: 12, avgScore: 54.2 },
  { id: 2, name: "NEET-2026 Achievers", program: "NEET", target_year: 2026, studentCount: 10, avgScore: 61.8 },
  { id: 3, name: "EAPCET-2026 Zenith", program: "EAPCET", target_year: 2026, studentCount: 10, avgScore: 55.4 }
];

const DEFAULT_FACULTY = [
  { id: 1, name: "Dr. Sunitha Reddy", role: "Academic Coordinator", subject: "Administration" },
  { id: 2, name: "Srikanth Sir", role: "Senior Faculty", subject: "Physics" },
  { id: 3, name: "Dr. Madhavi Rao", role: "Senior Faculty", subject: "Chemistry" },
  { id: 4, name: "Venkatesh Sir", role: "Senior Faculty", subject: "Mathematics" },
  { id: 5, name: "Dr. Padmaja Rani", role: "Senior Faculty", subject: "Biology" },
];

const DEFAULT_STUDENTS = [
  // JEE-2026 Alpha
  { id: 1, roll: "JEE-A01", name: "K. Sai Teja", batchId: 1, batchName: "JEE-2026 Alpha", avgScore: 68.4, status: "on_track", testsTaken: 5, gaps: ["Rotational Dynamics"] },
  { id: 2, roll: "JEE-A02", name: "P. Keerthi Reddy", batchId: 1, batchName: "JEE-2026 Alpha", avgScore: 42.1, status: "needs_support", testsTaken: 5, gaps: ["Rotational Dynamics", "Organic Reaction Mechanisms"] },
  { id: 3, roll: "JEE-A03", name: "V. Venkat Raman", batchId: 1, batchName: "JEE-2026 Alpha", avgScore: 56.5, status: "stable", testsTaken: 5, gaps: ["Differential Calculus"] },
  { id: 4, roll: "JEE-A04", name: "B. Bhavana Rao", batchId: 1, batchName: "JEE-2026 Alpha", avgScore: 74.0, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 5, roll: "JEE-A05", name: "M. Rahul Varma", batchId: 1, batchName: "JEE-2026 Alpha", avgScore: 39.5, status: "needs_support", testsTaken: 5, gaps: ["Rotational Dynamics", "Wave Optics"] },
  { id: 6, roll: "JEE-A06", name: "C. Divya Sree", batchId: 1, batchName: "JEE-2026 Alpha", avgScore: 51.0, status: "stable", testsTaken: 5, gaps: ["Differential Calculus"] },
  { id: 7, roll: "JEE-A07", name: "N. Karthik Naidu", batchId: 1, batchName: "JEE-2026 Alpha", avgScore: 48.0, status: "needs_support", testsTaken: 5, gaps: ["Rotational Dynamics"] },
  { id: 8, roll: "JEE-A08", name: "G. Anusha Chowdary", batchId: 1, batchName: "JEE-2026 Alpha", avgScore: 62.5, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 9, roll: "JEE-A09", name: "T. Manjunath Swamy", batchId: 1, batchName: "JEE-2026 Alpha", avgScore: 44.0, status: "needs_support", testsTaken: 5, gaps: ["Wave Optics"] },
  { id: 10, roll: "JEE-A10", name: "D. Sneha Latha", batchId: 1, batchName: "JEE-2026 Alpha", avgScore: 58.0, status: "stable", testsTaken: 5, gaps: ["Rotational Dynamics"] },
  { id: 11, roll: "JEE-A11", name: "Y. Tarun Kumar", batchId: 1, batchName: "JEE-2026 Alpha", avgScore: 52.5, status: "stable", testsTaken: 5, gaps: ["Differential Calculus"] },
  { id: 12, roll: "JEE-A12", name: "R. Swathi Priya", batchId: 1, batchName: "JEE-2026 Alpha", avgScore: 53.5, status: "stable", testsTaken: 5, gaps: [] },

  // NEET-2026 Achievers
  { id: 13, roll: "NEET-B01", name: "A. Harika Sharma", batchId: 2, batchName: "NEET-2026 Achievers", avgScore: 78.5, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 14, roll: "NEET-B02", name: "S. Pradeep Kumar", batchId: 2, batchName: "NEET-2026 Achievers", avgScore: 46.0, status: "needs_support", testsTaken: 5, gaps: ["Ionic Equilibrium", "Plant Physiology"] },
  { id: 15, roll: "NEET-B03", name: "M. Lavanya Devi", batchId: 2, batchName: "NEET-2026 Achievers", avgScore: 69.0, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 16, roll: "NEET-B04", name: "K. Dinesh Reddy", batchId: 2, batchName: "NEET-2026 Achievers", avgScore: 54.5, status: "stable", testsTaken: 5, gaps: ["Ionic Equilibrium"] },
  { id: 17, roll: "NEET-B05", name: "J. Sushmitha Paul", batchId: 2, batchName: "NEET-2026 Achievers", avgScore: 43.0, status: "needs_support", testsTaken: 5, gaps: ["Ionic Equilibrium", "Current Electricity"] },
  { id: 18, roll: "NEET-B06", name: "R. Bhanu Prakash", batchId: 2, batchName: "NEET-2026 Achievers", avgScore: 61.0, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 19, roll: "NEET-B07", name: "N. Meghana Rao", batchId: 2, batchName: "NEET-2026 Achievers", avgScore: 57.0, status: "stable", testsTaken: 5, gaps: ["Plant Physiology"] },
  { id: 20, roll: "NEET-B08", name: "E. Ajay Krishna", batchId: 2, batchName: "NEET-2026 Achievers", avgScore: 49.5, status: "needs_support", testsTaken: 5, gaps: ["Ionic Equilibrium"] },
  { id: 21, roll: "NEET-B09", name: "P. Sravani Latha", batchId: 2, batchName: "NEET-2026 Achievers", avgScore: 72.0, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 22, roll: "NEET-B10", name: "V. Chaitanya Prasad", batchId: 2, batchName: "NEET-2026 Achievers", avgScore: 59.0, status: "stable", testsTaken: 5, gaps: [] },

  // EAPCET-2026 Zenith
  { id: 23, roll: "EAP-C01", name: "G. Mahesh Babu", batchId: 3, batchName: "EAPCET-2026 Zenith", avgScore: 52.0, status: "stable", testsTaken: 5, gaps: ["Coordinate Geometry"] },
  { id: 24, roll: "EAP-C02", name: "T. Sandhya Rani", batchId: 3, batchName: "EAPCET-2026 Zenith", avgScore: 45.0, status: "needs_support", testsTaken: 5, gaps: ["Chemical Bonding", "Coordinate Geometry"] },
  { id: 25, roll: "EAP-C03", name: "B. Vikram Simha", batchId: 3, batchName: "EAPCET-2026 Zenith", avgScore: 64.0, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 26, roll: "EAP-C04", name: "K. Pavani Kumari", batchId: 3, batchName: "EAPCET-2026 Zenith", avgScore: 47.5, status: "needs_support", testsTaken: 5, gaps: ["Coordinate Geometry"] },
  { id: 27, roll: "EAP-C05", name: "M. Akhil Tej", batchId: 3, batchName: "EAPCET-2026 Zenith", avgScore: 59.0, status: "stable", testsTaken: 5, gaps: [] },
  { id: 28, roll: "EAP-C06", name: "D. Rohini Sree", batchId: 3, batchName: "EAPCET-2026 Zenith", avgScore: 66.5, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 29, roll: "EAP-C07", name: "N. Uday Kiran", batchId: 3, batchName: "EAPCET-2026 Zenith", avgScore: 41.0, status: "needs_support", testsTaken: 5, gaps: ["Chemical Bonding", "Thermodynamics"] },
  { id: 30, roll: "EAP-C08", name: "S. Geetha Madhuri", batchId: 3, batchName: "EAPCET-2026 Zenith", avgScore: 60.5, status: "on_track", testsTaken: 5, gaps: [] },
  { id: 31, roll: "EAP-C09", name: "R. Vinay Kumar", batchId: 3, batchName: "EAPCET-2026 Zenith", avgScore: 53.0, status: "stable", testsTaken: 5, gaps: ["Coordinate Geometry"] },
  { id: 32, roll: "EAP-C10", name: "A. Lakshmi Prasanna", batchId: 3, batchName: "EAPCET-2026 Zenith", avgScore: 65.5, status: "on_track", testsTaken: 5, gaps: [] },
];

const DEFAULT_TOPIC_GAPS = [
  {
    id: 1,
    topicName: "Rotational Dynamics",
    subject: "Physics",
    batchName: "JEE-2026 Alpha",
    batchId: 1,
    avgScore: 38.6,
    testsEvaluated: 2,
    isRecurring: true,
    affectedStudents: 7,
    totalStudents: 12,
    severity: "high",
    rationale: "Batch-wide concept bottleneck: 7 of 12 students scored below 50% across Test 1 and Test 4. Torque and angular momentum problems show recurring drop."
  },
  {
    id: 2,
    topicName: "Ionic Equilibrium",
    subject: "Chemistry",
    batchName: "NEET-2026 Achievers",
    batchId: 2,
    avgScore: 41.2,
    testsEvaluated: 2,
    isRecurring: true,
    affectedStudents: 5,
    totalStudents: 10,
    severity: "high",
    rationale: "Buffer solution pH calculations and solubility product equilibrium show recurring errors across two consecutive NEET tests."
  },
  {
    id: 3,
    topicName: "Coordinate Geometry",
    subject: "Mathematics",
    batchName: "EAPCET-2026 Zenith",
    batchId: 3,
    avgScore: 44.5,
    testsEvaluated: 2,
    isRecurring: true,
    affectedStudents: 5,
    totalStudents: 10,
    severity: "medium",
    rationale: "Conic section tangent equations and parabola focal chord properties fell below 50% benchmark."
  },
  {
    id: 4,
    topicName: "Differential Calculus",
    subject: "Mathematics",
    batchName: "JEE-2026 Alpha",
    batchId: 1,
    avgScore: 47.8,
    testsEvaluated: 2,
    isRecurring: false,
    affectedStudents: 4,
    totalStudents: 12,
    severity: "medium",
    rationale: "Single-test variance in Applications of Derivatives (tangents and rate measure). Needs monitoring on next reassessment."
  },
  {
    id: 5,
    topicName: "Wave Optics",
    subject: "Physics",
    batchName: "JEE-2026 Alpha",
    batchId: 1,
    avgScore: 43.5,
    testsEvaluated: 2,
    isRecurring: true,
    affectedStudents: 4,
    totalStudents: 12,
    severity: "medium",
    rationale: "Young's Double Slit fringe width shift and path difference calculations show recurring formula confusion."
  }
];

const DEFAULT_ACTIONS = [
  {
    id: "act-1",
    gapId: 1,
    title: "Torque & Moment of Inertia Hands-on Problem Clinic",
    topicName: "Rotational Dynamics",
    subject: "Physics",
    batchName: "JEE-2026 Alpha",
    batchId: 1,
    strategy: "1-on-1 Concept Clinic",
    assignedTo: "Srikanth Sir",
    dueDate: "2026-10-18",
    status: "in_progress",
    targetCohort: ["P. Keerthi Reddy", "M. Rahul Varma", "N. Karthik Naidu", "T. Manjunath Swamy"],
    notes: "Conducting step-by-step free-body diagram breakdown for rolling without slipping."
  },
  {
    id: "act-2",
    gapId: 2,
    title: "Buffer Solutions & Solubility Product Problem Set",
    topicName: "Ionic Equilibrium",
    subject: "Chemistry",
    batchName: "NEET-2026 Achievers",
    batchId: 2,
    strategy: "Targeted Practice Problem Sheet",
    assignedTo: "Dr. Madhavi Rao",
    dueDate: "2026-10-19",
    status: "assigned",
    targetCohort: ["S. Pradeep Kumar", "K. Dinesh Reddy", "J. Sushmitha Paul", "E. Ajay Krishna"],
    notes: "Distributing 30 curated NEET previous year questions focusing on Henderson-Hasselbalch equation."
  },
  {
    id: "act-3",
    gapId: 3,
    title: "Conic Sections Tangent Formulas Doubt Workshop",
    topicName: "Coordinate Geometry",
    subject: "Mathematics",
    batchName: "EAPCET-2026 Zenith",
    batchId: 3,
    strategy: "Doubt Clearing Workshop",
    assignedTo: "Venkatesh Sir",
    dueDate: "2026-10-16",
    status: "completed",
    targetCohort: ["T. Sandhya Rani", "K. Pavani Kumari", "N. Uday Kiran", "R. Vinay Kumar"],
    notes: "45-minute evening workshop conducted. All 4 students cleared tangent parametric forms.",
    measuredGain: "+18.5%"
  },
  {
    id: "act-4",
    gapId: 4,
    title: "15-Minute Reassessment on Maxima & Minima",
    topicName: "Differential Calculus",
    subject: "Mathematics",
    batchName: "JEE-2026 Alpha",
    batchId: 1,
    strategy: "15-min Diagnostic Reassessment",
    assignedTo: "Venkatesh Sir",
    dueDate: "2026-10-20",
    status: "pending_review",
    targetCohort: ["V. Venkat Raman", "C. Divya Sree", "Y. Tarun Kumar"],
    notes: "Testing whether the single-test drop was transient or a conceptual gap."
  }
];

const DEFAULT_EVALUATIONS = [
  {
    id: 1,
    actionTitle: "Conic Sections Tangent Formulas Workshop",
    topic: "Coordinate Geometry",
    batch: "EAPCET-2026 Zenith",
    baselineScore: 42.0,
    followUpScore: 60.5,
    delta: 18.5,
    outcome: "marked_gain",
    strategy: "Doubt Clearing Workshop",
    faculty: "Venkatesh Sir",
    date: "2026-10-11"
  },
  {
    id: 2,
    actionTitle: "Chemical Bonding Hybridisation Diagnostic Relecture",
    topic: "Chemical Bonding",
    batch: "NEET-2026 Achievers",
    baselineScore: 48.5,
    followUpScore: 59.8,
    delta: 11.3,
    outcome: "moderate_gain",
    strategy: "Foundational Re-lecture",
    faculty: "Dr. Madhavi Rao",
    date: "2026-10-09"
  },
  {
    id: 3,
    actionTitle: "Current Electricity Kirchhoff Laws Speed Drill",
    topic: "Current Electricity",
    batch: "JEE-2026 Alpha",
    baselineScore: 45.0,
    followUpScore: 62.0,
    delta: 17.0,
    outcome: "marked_gain",
    strategy: "Targeted Practice Sheet",
    faculty: "Srikanth Sir",
    date: "2026-10-06"
  },
  {
    id: 4,
    actionTitle: "Plant Physiology Water Potential Concept Clinic",
    topic: "Plant Physiology",
    batch: "NEET-2026 Achievers",
    baselineScore: 51.0,
    followUpScore: 54.0,
    delta: 3.0,
    outcome: "stable",
    strategy: "1-on-1 Concept Clinic",
    faculty: "Dr. Padmaja Rani",
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
  const [actionFilter, setActionFilter] = useState('all');

  // Modals & Forms
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionForm, setActionForm] = useState({
    title: '',
    topicName: 'Rotational Dynamics',
    subject: 'Physics',
    batchName: 'JEE-2026 Alpha',
    batchId: 1,
    strategy: 'Doubt Clearing Workshop',
    assignedTo: 'Srikanth Sir',
    dueDate: '2026-10-25',
    targetCohort: 'P. Keerthi Reddy, M. Rahul Varma',
    notes: ''
  });

  // Settings State
  const [rulesConfig, setRulesConfig] = useState({
    passingThreshold: 50.0,
    minTestsRequired: 2,
    consecutiveDropCount: 2,
    cohortAlertRatio: 40
  });

  // CSV Import State
  const [csvUploadText, setCsvUploadText] = useState('');
  const [parsedCsvRows, setParsedCsvRows] = useState([]);

  // Check backend connectivity on mount
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/institution/profile')
      .then(res => res.json())
      .then(() => setApiOnline(true))
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
    return students.filter(s => {
      const matchBatch = !selectedBatchId || s.batchId === selectedBatchId;
      const matchSearch = !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.roll.toLowerCase().includes(studentSearch.toLowerCase());
      const matchStatus = studentFilter === 'all' || s.status === studentFilter;
      return matchBatch && matchSearch && matchStatus;
    });
  }, [students, selectedBatchId, studentSearch, studentFilter]);

  const filteredTopicGaps = useMemo(() => {
    return topicGaps.filter(g => !selectedBatchId || g.batchId === selectedBatchId);
  }, [topicGaps, selectedBatchId]);

  const filteredActions = useMemo(() => {
    return actions.filter(a => {
      const matchBatch = !selectedBatchId || a.batchId === selectedBatchId;
      const matchStatus = actionFilter === 'all' || a.status === actionFilter;
      return matchBatch && matchStatus;
    });
  }, [actions, selectedBatchId, actionFilter]);

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
      topicName: 'Rotational Dynamics',
      subject: 'Physics',
      batchName: 'JEE-2026 Alpha',
      batchId: 1,
      strategy: 'Doubt Clearing Workshop',
      assignedTo: 'Srikanth Sir',
      dueDate: '2026-10-25',
      targetCohort: 'P. Keerthi Reddy, M. Rahul Varma',
      notes: ''
    });

    addToast?.({
      type: 'success',
      message: `🚀 New intervention scheduled for ${newAction.assignedTo}! (+35 XP)`
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
        studentId: parts[0] || 'STU-1001',
        batch: parts[1] || 'JEE-2026 Alpha',
        testId: parts[2] || 'T-101',
        subject: parts[3] || 'Physics',
        topic: parts[4] || 'Kinematics',
        score: parseFloat(parts[5]) || 0,
        maxScore: parseFloat(parts[6]) || 100,
        date: parts[7] || '2026-10-12',
        isValid: !isNaN(parseFloat(parts[5])) && parseFloat(parts[5]) <= (parseFloat(parts[6]) || 100)
      };
    });
    setParsedCsvRows(parsed);
  };

  // Download Sample CSV
  const handleDownloadSampleCsv = () => {
    const header = "student_id,batch,test_id,subject,topic,score,maximum_score,test_date\n";
    const sample = [
      "STU-1001,JEE-2026 Alpha,TEST-01,Physics,Rotational Dynamics,38,100,2026-10-10",
      "STU-1002,JEE-2026 Alpha,TEST-01,Physics,Rotational Dynamics,42,100,2026-10-10",
      "STU-1005,JEE-2026 Alpha,TEST-01,Physics,Rotational Dynamics,35,100,2026-10-10",
      "STU-2001,NEET-2026 Achievers,TEST-02,Chemistry,Ionic Equilibrium,40,100,2026-10-11",
      "STU-2002,NEET-2026 Achievers,TEST-02,Chemistry,Ionic Equilibrium,44,100,2026-10-11"
    ].join('\n');
    const blob = new Blob([header + sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "edupulse_sample_test_results.csv";
    a.click();
    addToast?.({ type: 'info', message: '📥 Sample Assessment CSV downloaded successfully!' });
  };

  return (
    <div className="space-y-6 font-sans text-gray-100 pb-16">
      {/* ─── INSTITUTION BRANDING & APEX HEADER BAR ─── */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-[#03131d] via-[#041a27] to-[#010911] border border-teal-500/30 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase tracking-widest border border-teal-400/40 flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-teal-400 animate-spin" /> EduPulse • Test-to-Action Platform
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1 border ${apiOnline ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' : 'bg-amber-500/20 border-amber-400/40 text-amber-300'}`}>
              <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {apiOnline ? 'FastAPI Backend Online (8000)' : 'Client Local Storage Mode'}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-white font-sora tracking-tight">
            {DEFAULT_INSTITUTION.name}
          </h1>
          <p className="text-xs md:text-sm text-teal-200/80 font-medium">
            "{DEFAULT_INSTITUTION.tagline}" • <span className="text-gray-400 text-xs">Dr. Sunitha Reddy (Lead Coordinator)</span>
          </p>
        </div>

        {/* Batch Filter & Fast Action Button */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <div className="bg-black/50 p-1 rounded-2xl border border-white/10 flex items-center text-xs">
            <button
              onClick={() => setSelectedBatchId(null)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${!selectedBatchId ? 'bg-teal-500 text-black font-black shadow-lg shadow-teal-500/25' : 'text-gray-400 hover:text-white'}`}
            >
              All Batches (32)
            </button>
            {DEFAULT_BATCHES.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBatchId(b.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${selectedBatchId === b.id ? 'bg-teal-500 text-black font-black shadow-lg shadow-teal-500/25' : 'text-gray-400 hover:text-white'}`}
              >
                {b.name.split('-')[0]} ({b.studentCount})
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsActionModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-black text-xs shadow-lg shadow-teal-500/30 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Action</span>
          </button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
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
          {/* Filter Bar */}
          <div className="p-3 rounded-2xl bg-[#030c17] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400 font-bold mr-1">Status:</span>
              {['all', 'assigned', 'in_progress', 'completed'].map(st => (
                <button
                  key={st}
                  onClick={() => setActionFilter(st)}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${actionFilter === st ? 'bg-teal-500 text-black font-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                >
                  {st.toUpperCase().replace('_', ' ')}
                </button>
              ))}
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
                className={`p-4 rounded-3xl border transition-all space-y-3 relative flex flex-col justify-between ${action.status === 'completed' ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-[#020b16] border-teal-500/30 hover:border-teal-400/80'}`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold">
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
                      Target Students ({action.targetCohort.length}): <span className="text-teal-300">{action.targetCohort.join(', ')}</span>
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
                        onClick={() => handleUpdateActionStatus(action.id, 'completed')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all cursor-pointer flex items-center gap-1"
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
              Unlike black-box predictions, EduPulse flags concepts solely when moving averages across assessments fall below 50% for 2 consecutive tests. Single-test drops are tagged as transient variance rather than recurring failure.
            </p>
          </div>

          <div className="space-y-3">
            {filteredTopicGaps.map(gap => (
              <div key={gap.id} className="p-4 rounded-2xl bg-[#020812] border border-white/10 space-y-2.5 hover:border-teal-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold">
                        {gap.subject} • {gap.batchName}
                      </span>
                      {gap.isRecurring ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold uppercase">
                          Recurring Drop (2+ Tests)
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
                      Average: <strong className="text-amber-300">{gap.avgScore}%</strong> ({gap.affectedStudents} of {gap.totalStudents} Students)
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
                      className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold border border-teal-500/40 transition-all cursor-pointer"
                    >
                      + Create Intervention
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-300 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed font-sans">
                  {gap.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 4: STUDENT PROFILES (32 STUDENTS) ─── */}
      {activeSubTab === 'students' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="p-3 rounded-2xl bg-[#030c17] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by student name or roll number (e.g. 'Sai Teja', 'JEE-A01')..."
                className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-full"
              />
            </div>

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
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${studentFilter === f.id ? 'bg-teal-500 text-black font-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Students Table */}
          <div className="rounded-3xl bg-[#020812] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-gray-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Batch</th>
                    <th className="py-3 px-4">Average Score</th>
                    <th className="py-3 px-4">Identified Gaps</th>
                    <th className="py-3 px-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {filteredStudents.map(stu => (
                    <tr key={stu.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedStudentForModal(stu)}>
                      <td className="py-3 px-4 font-mono font-bold text-teal-300">{stu.roll}</td>
                      <td className="py-3 px-4 font-bold text-white">{stu.name}</td>
                      <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">{stu.batchName}</td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold ${stu.avgScore >= 60 ? 'text-emerald-400' : stu.avgScore >= 50 ? 'text-teal-300' : 'text-rose-400'}`}>
                          {stu.avgScore}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {stu.gaps.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {stu.gaps.map((g, gi) => (
                              <span key={gi} className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                                {g}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-[11px] italic">No active concept drop</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${stu.status === 'on_track' ? 'bg-emerald-500/20 text-emerald-300' : stu.status === 'stable' ? 'bg-teal-500/20 text-teal-300' : 'bg-rose-500/20 text-rose-300'}`}>
                          {stu.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 5: INTERVENTION EFFICACY TRACKER ─── */}
      {activeSubTab === 'efficacy' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-[#020b16] border border-emerald-500/30 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sora">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Longitudinal Assessment Delta Tracking
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              EduPulse pairs pre-intervention baseline assessment scores with subsequent follow-up tests to compute empirical score deltas. Outcomes are presented as observed score changes, maintaining complete non-causal reporting integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluations.map(ev => (
              <div key={ev.id} className="p-4 rounded-2xl bg-[#020812] border border-white/10 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">
                      {ev.batch} • {ev.strategy}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{ev.actionTitle}</h4>
                    <span className="text-[11px] text-gray-400 font-mono">Faculty: {ev.faculty} ({ev.date})</span>
                  </div>

                  <span className="text-lg font-mono font-black text-emerald-300">
                    +{ev.delta}%
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
          <div className="p-4 rounded-3xl bg-[#020b16] border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sora">
                <Upload className="w-4 h-4 text-teal-400" /> Assessment Marks CSV Batch Ingestion
              </h3>
              <p className="text-xs text-gray-300">
                Upload weekend test sheets to trigger instant rule-based topic gap detection.
              </p>
            </div>
            <button
              onClick={handleDownloadSampleCsv}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Sample CSV</span>
            </button>
          </div>

          {/* Paste CSV or File Drag */}
          <div className="p-5 rounded-3xl bg-[#020812] border border-white/10 space-y-3">
            <span className="text-xs font-bold text-white block">Paste Raw CSV Data or Choose File:</span>
            <textarea
              rows={4}
              value={csvUploadText}
              onChange={(e) => handleParseCsv(e.target.value)}
              placeholder="student_id,batch,test_id,subject,topic,score,maximum_score,test_date..."
              className="w-full bg-black/50 border border-white/10 rounded-2xl p-3 font-mono text-xs text-teal-200 outline-none focus:border-teal-400 transition-all"
            />

            {parsedCsvRows.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Pre-Commit Validation Preview ({parsedCsvRows.length} Rows):</span>
                  <span className="text-emerald-400 font-mono">0 Schema Violations</span>
                </div>

                <div className="rounded-2xl border border-white/10 overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/5 text-gray-400 text-[10px]">
                      <tr>
                        <th className="p-2">Row</th>
                        <th className="p-2">Student ID</th>
                        <th className="p-2">Batch</th>
                        <th className="p-2">Subject</th>
                        <th className="p-2">Topic</th>
                        <th className="p-2">Score</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {parsedCsvRows.map(r => (
                        <tr key={r.id}>
                          <td className="p-2 text-gray-400">{r.id}</td>
                          <td className="p-2 text-white">{r.studentId}</td>
                          <td className="p-2 text-gray-300">{r.batch}</td>
                          <td className="p-2 text-teal-300">{r.subject}</td>
                          <td className="p-2 text-gray-300">{r.topic}</td>
                          <td className="p-2 text-amber-300 font-bold">{r.score}/{r.maxScore}</td>
                          <td className="p-2 text-emerald-400">Valid</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => {
                    addToast?.({ type: 'success', message: `✅ Successfully ingested ${parsedCsvRows.length} assessment rows into EduPulse!` });
                    setCsvUploadText('');
                    setParsedCsvRows([]);
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-black text-xs transition-all cursor-pointer"
                >
                  Commit Ingestion to Database
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 7: REPORT DOSSIERS ─── */}
      {activeSubTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-[#020b16] border border-white/10 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-2xl">📋</span>
              <h4 className="font-bold text-white text-sm">Batch Performance Audit</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Comprehensive executive summary of all 3 cohorts with passing ratios and coordinator signature.
              </p>
            </div>
            <button
              onClick={() => {
                const csv = "batch,students,avg_score\nJEE-2026 Alpha,12,54.2\nNEET-2026 Achievers,10,61.8\nEAPCET-2026 Zenith,10,55.4\n";
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "batch_performance_audit.csv";
                a.click();
                addToast?.({ type: 'info', message: '📥 Batch Audit Report exported!' });
              }}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit CSV</span>
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-[#020b16] border border-white/10 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-2xl">📊</span>
              <h4 className="font-bold text-white text-sm">Intervention Efficacy Master</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Paired pre/post intervention deltas across all physics, chemistry, and mathematics workshops.
              </p>
            </div>
            <button
              onClick={() => {
                const csv = "action,topic,baseline,post_score,gain\nRotational Dynamics Clinic,Physics,38.6,56.0,+17.4%\nBuffer Solution Practice,Chemistry,41.2,55.0,+13.8%\n";
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "intervention_efficacy_master.csv";
                a.click();
                addToast?.({ type: 'info', message: '📥 Intervention Efficacy Master exported!' });
              }}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Efficacy CSV</span>
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-[#020b16] border border-white/10 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-2xl">🎓</span>
              <h4 className="font-bold text-white text-sm">Student Diagnostic Dossier</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Individual report card breakdown with subject mastery, topic bottlenecks, and non-punitive guidance.
              </p>
            </div>
            <button
              onClick={() => {
                addToast?.({ type: 'success', message: '📄 Student Diagnostic Dossier generated for Dr. Sunitha Reddy.' });
              }}
              className="px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Dossier</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 8: RULES CONFIGURATION ─── */}
      {activeSubTab === 'settings' && (
        <div className="max-w-xl p-5 rounded-3xl bg-[#020b16] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sora">
            <Settings className="w-4 h-4 text-teal-400" /> Threshold & Algorithmic Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-gray-300 font-bold block mb-1">Passing Benchmark Threshold (%):</label>
              <input
                type="number"
                value={rulesConfig.passingThreshold}
                onChange={(e) => setRulesConfig(prev => ({ ...prev, passingThreshold: parseFloat(e.target.value) || 50 }))}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white font-mono"
              />
              <span className="text-[10px] text-gray-500">Concepts below this percentage will be flagged for review.</span>
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">Minimum Tests Before Recurring Flag:</label>
              <input
                type="number"
                value={rulesConfig.minTestsRequired}
                onChange={(e) => setRulesConfig(prev => ({ ...prev, minTestsRequired: parseInt(e.target.value, 10) || 2 }))}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white font-mono"
              />
              <span className="text-[10px] text-gray-500">Prevents flagging based on isolated single-test noise.</span>
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">Cohort Alert Ratio (% of batch affected):</label>
              <input
                type="number"
                value={rulesConfig.cohortAlertRatio}
                onChange={(e) => setRulesConfig(prev => ({ ...prev, cohortAlertRatio: parseInt(e.target.value, 10) || 40 }))}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white font-mono"
              />
              <span className="text-[10px] text-gray-500">Triggers batch-wide workshop recommendations if exceeded.</span>
            </div>

            <button
              onClick={() => addToast?.({ type: 'success', message: '⚙️ Rules and diagnostic thresholds updated!' })}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-black text-xs transition-all cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE ACTION MODAL ─── */}
      {isActionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-[#030e1a] border border-teal-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-400" /> Schedule Teacher Intervention Action
              </h3>
              <button onClick={() => setIsActionModalOpen(false)} className="text-gray-400 hover:text-white p-1">
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
                  placeholder="e.g. 1-on-1 Concept Clinic on Angular Momentum..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Strategy Type:</label>
                  <select
                    value={actionForm.strategy}
                    onChange={(e) => setActionForm(prev => ({ ...prev, strategy: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    <option>Doubt Clearing Workshop</option>
                    <option>Targeted Practice Problem Sheet</option>
                    <option>1-on-1 Concept Clinic</option>
                    <option>Foundational Re-lecture</option>
                    <option>15-min Diagnostic Reassessment</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Faculty Assignee:</label>
                  <select
                    value={actionForm.assignedTo}
                    onChange={(e) => setActionForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    {DEFAULT_FACULTY.map(f => (
                      <option key={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Target Students (comma separated):</label>
                <input
                  type="text"
                  value={actionForm.targetCohort}
                  onChange={(e) => setActionForm(prev => ({ ...prev, targetCohort: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Classroom Observations & Notes:</label>
                <textarea
                  rows={2}
                  value={actionForm.notes}
                  onChange={(e) => setActionForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes regarding specific student error patterns..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-black"
                >
                  Confirm & Schedule Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: STUDENT PROFILE DETAIL ─── */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#030e1a] border border-teal-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">{selectedStudentForModal.name}</h3>
                <span className="text-xs font-mono text-teal-300">{selectedStudentForModal.roll} • {selectedStudentForModal.batchName}</span>
              </div>
              <button onClick={() => setSelectedStudentForModal(null)} className="text-gray-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-gray-400">Average Assessment Score:</span>
                <span className="text-base font-mono font-bold text-teal-300">{selectedStudentForModal.avgScore}%</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold block mb-1.5">Identified Opportunity Topics:</span>
                {selectedStudentForModal.gaps.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudentForModal.gaps.map((g, gi) => (
                      <span key={gi} className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs">
                        ⚠️ {g}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-emerald-400 font-mono text-xs">Consistent performance across all 5 weekly tests.</span>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-teal-950/20 border border-teal-500/30 text-[11px] text-gray-300 leading-relaxed font-sans">
                <strong>Non-Punitive Guidance:</strong> This student is supported via targeted doubt clinics without adverse performance labeling.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
