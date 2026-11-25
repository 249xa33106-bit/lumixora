import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, AlertTriangle, User, Loader2, Plus, CheckCircle2, XCircle, 
  RefreshCw, Trash2, BookOpen, Clock, Calendar, Zap, ShieldAlert, 
  Sparkles, TrendingUp, BarChart3, ChevronRight, Edit3, Save, Check,
  Calculator, Undo2, Award, Info, FileDown, Sliders, ShieldCheck,
  CalendarCheck, HelpCircle, CheckSquare, ArrowUpRight, GraduationCap, ChevronLeft
} from 'lucide-react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';
import { generateClassAttendanceCondonationPDF } from '../utils/pdfGenerator';

// ─── 📚 1-CLICK CURRICULUM PRESETS ACROSS ENGINEERING BRANCHES ────────────────
export const CURRICULUM_PRESETS = {
  cse: {
    name: 'Computer Science & Engineering (CSE)',
    semesters: {
      '3-1': [
        { code: 'CS501', name: 'Operating Systems', attended: 24, total: 28, odCount: 1, mlCount: 0 },
        { code: 'CS502', name: 'Compiler Design', attended: 21, total: 28, odCount: 0, mlCount: 0 },
        { code: 'CS503', name: 'Database Management Systems', attended: 25, total: 28, odCount: 1, mlCount: 0 },
        { code: 'CS504', name: 'Computer Networks', attended: 22, total: 28, odCount: 0, mlCount: 0 },
        { code: 'CS505', name: 'Software Engineering & Agile', attended: 26, total: 28, odCount: 0, mlCount: 0 },
        { code: 'CS506L', name: 'DBMS & OS Simulation Lab', attended: 12, total: 14, odCount: 0, mlCount: 0 },
        { code: 'CS507L', name: 'Computer Networks Lab', attended: 13, total: 14, odCount: 0, mlCount: 0 }
      ],
      '3-2': [
        { code: 'CS601', name: 'Machine Learning', attended: 25, total: 30, odCount: 1, mlCount: 0 },
        { code: 'CS602', name: 'Cloud Computing & DevOps', attended: 27, total: 30, odCount: 0, mlCount: 0 },
        { code: 'CS603', name: 'Cryptography & Network Security', attended: 22, total: 30, odCount: 0, mlCount: 0 },
        { code: 'CS604', name: 'Full Stack Web Development', attended: 28, total: 30, odCount: 1, mlCount: 0 },
        { code: 'CS605L', name: 'Machine Learning Lab', attended: 14, total: 15, odCount: 0, mlCount: 0 },
        { code: 'CS606L', name: 'Cloud & Full Stack Lab', attended: 15, total: 15, odCount: 0, mlCount: 0 }
      ]
    }
  },
  aids: {
    name: 'AI & Data Science (AI&DS / AIML)',
    semesters: {
      '3-1': [
        { code: 'AD501', name: 'Deep Learning & Neural Networks', attended: 26, total: 30, odCount: 1, mlCount: 0 },
        { code: 'AD502', name: 'Natural Language Processing', attended: 24, total: 30, odCount: 0, mlCount: 0 },
        { code: 'AD503', name: 'Big Data Analytics & Spark', attended: 22, total: 30, odCount: 0, mlCount: 0 },
        { code: 'AD504', name: 'Computer Vision & OpenCV', attended: 25, total: 30, odCount: 1, mlCount: 0 },
        { code: 'AD505L', name: 'Deep Learning Lab', attended: 14, total: 15, odCount: 0, mlCount: 0 },
        { code: 'AD506L', name: 'NLP & Computer Vision Lab', attended: 13, total: 15, odCount: 0, mlCount: 0 }
      ]
    }
  },
  ece: {
    name: 'Electronics & Communication (ECE)',
    semesters: {
      '3-1': [
        { code: 'EC501', name: 'Digital Signal Processing', attended: 23, total: 28, odCount: 1, mlCount: 0 },
        { code: 'EC502', name: 'Microprocessors & Microcontrollers', attended: 25, total: 28, odCount: 0, mlCount: 0 },
        { code: 'EC503', name: 'VLSI Design & Technology', attended: 20, total: 28, odCount: 0, mlCount: 0 },
        { code: 'EC504', name: 'Antennas & Wave Propagation', attended: 22, total: 28, odCount: 1, mlCount: 0 },
        { code: 'EC505L', name: 'DSP & Microcontroller Lab', attended: 13, total: 14, odCount: 0, mlCount: 0 },
        { code: 'EC506L', name: 'VLSI Design Lab', attended: 14, total: 14, odCount: 0, mlCount: 0 }
      ]
    }
  },
  eee: {
    name: 'Electrical & Electronics (EEE)',
    semesters: {
      '3-1': [
        { code: 'EE501', name: 'Power Systems - II', attended: 24, total: 28, odCount: 0, mlCount: 0 },
        { code: 'EE502', name: 'Control Systems Engineering', attended: 22, total: 28, odCount: 0, mlCount: 0 },
        { code: 'EE503', name: 'Power Electronics', attended: 21, total: 28, odCount: 1, mlCount: 0 },
        { code: 'EE504', name: 'Electrical Machines - III', attended: 25, total: 28, odCount: 0, mlCount: 0 },
        { code: 'EE505L', name: 'Power Electronics Lab', attended: 13, total: 14, odCount: 0, mlCount: 0 }
      ]
    }
  },
  mech: {
    name: 'Mechanical Engineering (MECH)',
    semesters: {
      '3-1': [
        { code: 'ME501', name: 'Design of Machine Elements', attended: 23, total: 28, odCount: 0, mlCount: 0 },
        { code: 'ME502', name: 'Thermal Engineering - II', attended: 22, total: 28, odCount: 0, mlCount: 0 },
        { code: 'ME503', name: 'Dynamics of Machinery', attended: 25, total: 28, odCount: 1, mlCount: 0 },
        { code: 'ME504', name: 'Manufacturing Technology', attended: 26, total: 28, odCount: 0, mlCount: 0 },
        { code: 'ME505L', name: 'CAD/CAM & FEA Lab', attended: 13, total: 14, odCount: 0, mlCount: 0 }
      ]
    }
  },
  civil: {
    name: 'Civil Engineering (CIVIL)',
    semesters: {
      '3-1': [
        { code: 'CE501', name: 'Structural Analysis - II', attended: 24, total: 28, odCount: 0, mlCount: 0 },
        { code: 'CE502', name: 'Design of Reinforced Concrete', attended: 22, total: 28, odCount: 0, mlCount: 0 },
        { code: 'CE503', name: 'Geotechnical Engineering', attended: 21, total: 28, odCount: 0, mlCount: 0 },
        { code: 'CE504', name: 'Hydrology & Water Resources', attended: 25, total: 28, odCount: 0, mlCount: 0 },
        { code: 'CE505L', name: 'Concrete & Soil Lab', attended: 14, total: 14, odCount: 0, mlCount: 0 }
      ]
    }
  }
};

// ─── 📅 DEFAULT WEEKLY PERIOD TIMETABLE MATRIX ─────────────────────────────────
export const DEFAULT_WEEKLY_TIMETABLE = {
  1: [ // Monday
    { period: 1, time: '09:15 - 10:10', subject: 'Operating Systems', code: 'CS501' },
    { period: 2, time: '10:10 - 11:05', subject: 'Database Management Systems', code: 'CS503' },
    { period: 3, time: '11:20 - 12:15', subject: 'Compiler Design', code: 'CS502' },
    { period: 4, time: '01:15 - 02:10', subject: 'Computer Networks', code: 'CS504' },
    { period: 5, time: '02:10 - 04:00', subject: 'DBMS & OS Simulation Lab', code: 'CS506L', isLab: true }
  ],
  2: [ // Tuesday
    { period: 1, time: '09:15 - 10:10', subject: 'Computer Networks', code: 'CS504' },
    { period: 2, time: '10:10 - 11:05', subject: 'Operating Systems', code: 'CS501' },
    { period: 3, time: '11:20 - 12:15', subject: 'Database Management Systems', code: 'CS503' },
    { period: 4, time: '01:15 - 02:10', subject: 'Software Engineering & Agile', code: 'CS505' },
    { period: 5, time: '02:10 - 03:05', subject: 'Compiler Design', code: 'CS502' }
  ],
  3: [ // Wednesday
    { period: 1, time: '09:15 - 10:10', subject: 'Compiler Design', code: 'CS502' },
    { period: 2, time: '10:10 - 11:05', subject: 'Computer Networks', code: 'CS504' },
    { period: 3, time: '11:20 - 12:15', subject: 'Operating Systems', code: 'CS501' },
    { period: 4, time: '01:15 - 04:00', subject: 'Computer Networks Lab', code: 'CS507L', isLab: true }
  ],
  4: [ // Thursday
    { period: 1, time: '09:15 - 10:10', subject: 'Database Management Systems', code: 'CS503' },
    { period: 2, time: '10:10 - 11:05', subject: 'Software Engineering & Agile', code: 'CS505' },
    { period: 3, time: '11:20 - 12:15', subject: 'Operating Systems', code: 'CS501' },
    { period: 4, time: '01:15 - 02:10', subject: 'Compiler Design', code: 'CS502' },
    { period: 5, time: '02:10 - 03:05', subject: 'Computer Networks', code: 'CS504' }
  ],
  5: [ // Friday
    { period: 1, time: '09:15 - 10:10', subject: 'Software Engineering & Agile', code: 'CS505' },
    { period: 2, time: '10:10 - 11:05', subject: 'Compiler Design', code: 'CS502' },
    { period: 3, time: '11:20 - 12:15', subject: 'Computer Networks', code: 'CS504' },
    { period: 4, time: '01:15 - 02:10', subject: 'Operating Systems', code: 'CS501' },
    { period: 5, time: '02:10 - 03:05', subject: 'Database Management Systems', code: 'CS503' }
  ],
  6: [ // Saturday
    { period: 1, time: '09:15 - 10:10', subject: 'Database Management Systems', code: 'CS503' },
    { period: 2, time: '10:10 - 11:05', subject: 'Software Engineering & Agile', code: 'CS505' },
    { period: 3, time: '11:20 - 12:15', subject: 'Operating Systems', code: 'CS501' },
    { period: 4, time: '01:15 - 03:00', subject: 'Coding Lab Mentorship', code: 'EXTRA', isLab: true }
  ]
};

export default function AttendancePortal({ user }) {
  const { addToast } = useToast();
  const userId = user?.uid || user?.email || 'guest_student';

  // Mode Switcher: 'class_tracker' | 'timetable' | 'forecaster' | 'official_records'
  const [activeView, setActiveView] = useState('class_tracker');

  // ──────────────────────────────────────────────────────────────────────────
  // 1. CLASS-WISE ATTENDANCE TRACKER & BUNK CALCULATOR STATE
  // ──────────────────────────────────────────────────────────────────────────
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem(`lumixora_class_attendance_${userId}`);
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    // Default initial subjects (CSE 3-1)
    return CURRICULUM_PRESETS.cse.semesters['3-1'].map(s => ({ ...s, id: `sub_${Date.now()}_${s.code}` }));
  });

  const [targetPercentage, setTargetPercentage] = useState(75);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [selectedBranchPreset, setSelectedBranchPreset] = useState('cse');
  const [selectedSemPreset, setSelectedSemPreset] = useState('3-1');

  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubAttended, setNewSubAttended] = useState('0');
  const [newSubTotal, setNewSubTotal] = useState('0');
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // ──────────────────────────────────────────────────────────────────────────
  // 2. TIMETABLE STATE (Monday=1 ... Saturday=6)
  // ──────────────────────────────────────────────────────────────────────────
  const currentDayOfWeek = useMemo(() => {
    const day = new Date().getDay();
    return day === 0 ? 1 : day; // Default Sunday to Monday view
  }, []);
  const [activeTimetableDay, setActiveTimetableDay] = useState(currentDayOfWeek);
  const [weeklyTimetable, setWeeklyTimetable] = useState(() => {
    const saved = localStorage.getItem(`lumixora_timetable_${userId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_WEEKLY_TIMETABLE;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3. WHAT-IF BUNK & LEAVE FORECASTER STATE
  // ──────────────────────────────────────────────────────────────────────────
  const [forecastSubjectId, setForecastSubjectId] = useState('all');
  const [forecastPlannedBunks, setForecastPlannedBunks] = useState(3);
  const [forecastPlannedAttended, setForecastPlannedAttended] = useState(12);

  // Sync subjects to local storage
  useEffect(() => {
    localStorage.setItem(`lumixora_class_attendance_${userId}`, JSON.stringify(subjects));
  }, [subjects, userId]);

  // Load from Firestore on mount
  useEffect(() => {
    const loadCloudTracker = async () => {
      if (!user?.uid && !user?.email) return;
      try {
        const docRef = doc(db, 'user_attendance_tracker', userId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.subjects) && data.subjects.length > 0) {
            setSubjects(data.subjects);
            if (data.targetPercentage) setTargetPercentage(data.targetPercentage);
            if (Array.isArray(data.history)) setAttendanceHistory(data.history);
          }
        }
      } catch (err) {
        console.warn('Error loading cloud attendance tracker:', err);
      }
    };
    loadCloudTracker();
  }, [userId, user?.uid, user?.email]);

  // Save to Firestore
  const saveTrackerToCloud = async (updatedSubjects = subjects, updatedHistory = attendanceHistory) => {
    if (!user?.uid && !user?.email) return;
    setIsSavingToCloud(true);
    try {
      const docRef = doc(db, 'user_attendance_tracker', userId);
      await setDoc(docRef, {
        userId,
        studentName: user?.name || user?.displayName || 'Scholar',
        subjects: updatedSubjects,
        history: updatedHistory.slice(0, 50),
        targetPercentage,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore attendance tracker save error:', err);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // Mark Attendance: 'present' | 'absent' | 'od' | 'undo'
  const handleMarkClass = (subjectId, action) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    setSubjects(prev => {
      const updated = prev.map(sub => {
        if (sub.id !== subjectId) return sub;

        let newAttended = sub.attended || 0;
        let newOD = sub.odCount || 0;
        let newTotal = sub.total || 0;

        if (action === 'present') {
          newAttended += 1;
          newTotal += 1;
        } else if (action === 'absent') {
          newTotal += 1;
        } else if (action === 'od') {
          newOD += 1;
          newTotal += 1;
        } else if (action === 'undo') {
          if (newTotal > 0) {
            if (newOD > 0 && newAttended + newOD >= newTotal) {
              newOD = Math.max(0, newOD - 1);
            } else if (newAttended > 0) {
              newAttended = Math.max(0, newAttended - 1);
            }
            newTotal = Math.max(0, newTotal - 1);
          }
        }

        return { ...sub, attended: newAttended, odCount: newOD, total: newTotal };
      });

      const subObj = prev.find(s => s.id === subjectId);
      const actionText = 
        action === 'present' ? '✅ Marked Present' : 
        action === 'absent' ? '❌ Marked Absent' : 
        action === 'od' ? '🛡️ Marked OD / Medical' : '↩️ Undone Class';
      
      const newHistoryItem = {
        id: Date.now(),
        subjectName: subObj?.name || 'Subject',
        subjectCode: subObj?.code || '',
        action: actionText,
        time: `${dateStr}, ${timestamp}`
      };

      const newHistory = [newHistoryItem, ...attendanceHistory];
      setAttendanceHistory(newHistory);
      saveTrackerToCloud(updated, newHistory);

      return updated;
    });

    if (action === 'present') {
      addToast({ message: 'Marked Present (+1 class attended)', type: 'success' });
    } else if (action === 'absent') {
      addToast({ message: 'Marked Absent (+1 class missed)', type: 'warning' });
    } else if (action === 'od') {
      addToast({ message: '🛡️ Marked On-Duty / Medical Leave (+1 covered)', type: 'info' });
    } else {
      addToast({ message: 'Last class count reverted', type: 'info' });
    }
  };

  // Add Custom Subject
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const attendedNum = Math.max(0, parseInt(newSubAttended) || 0);
    const totalNum = Math.max(attendedNum, parseInt(newSubTotal) || 0);

    const newSub = {
      id: `sub_${Date.now()}`,
      name: newSubName.trim(),
      code: newSubCode.trim().toUpperCase() || `SUB${subjects.length + 1}`,
      attended: attendedNum,
      odCount: 0,
      mlCount: 0,
      total: totalNum,
      target: targetPercentage
    };

    const updated = [...subjects, newSub];
    setSubjects(updated);
    saveTrackerToCloud(updated);

    setNewSubName('');
    setNewSubCode('');
    setNewSubAttended('0');
    setNewSubTotal('0');
    setIsAddingSubject(false);
    addToast({ message: `Added "${newSub.name}" to your tracker!`, type: 'success' });
  };

  // 1-Click Curriculum Importer
  const handleApplyCurriculumPreset = (replace = true) => {
    const preset = CURRICULUM_PRESETS[selectedBranchPreset]?.semesters?.[selectedSemPreset];
    if (!preset) return;

    const formatted = preset.map(s => ({
      ...s,
      id: `sub_${Date.now()}_${s.code}`
    }));

    const finalSubjects = replace ? formatted : [...subjects, ...formatted];
    setSubjects(finalSubjects);
    saveTrackerToCloud(finalSubjects);
    setShowCurriculumModal(false);
    addToast({
      message: `⚡ Imported ${formatted.length} subjects for ${CURRICULUM_PRESETS[selectedBranchPreset].name} (${selectedSemPreset})!`,
      type: 'success'
    });
  };

  // Delete Subject
  const handleDeleteSubject = (id, name) => {
    if (confirm(`Remove "${name}" from your attendance tracker?`)) {
      const updated = subjects.filter(s => s.id !== id);
      setSubjects(updated);
      saveTrackerToCloud(updated);
      addToast({ message: `Removed "${name}"`, type: 'info' });
    }
  };

  // 1-Click Mark Today's All Scheduled Classes Present
  const handleMarkAllToday = (action = 'present') => {
    const todayPeriods = weeklyTimetable[activeTimetableDay] || [];
    if (todayPeriods.length === 0) {
      addToast({ message: 'No classes scheduled on this day.', type: 'info' });
      return;
    }

    const scheduledCodes = todayPeriods.map(p => p.code).filter(Boolean);
    const scheduledNames = todayPeriods.map(p => p.subject.toLowerCase());

    let markedCount = 0;
    const updated = subjects.map(sub => {
      const match = scheduledCodes.includes(sub.code) || scheduledNames.some(n => sub.name.toLowerCase().includes(n));
      if (!match) return sub;

      markedCount++;
      let newAttended = sub.attended || 0;
      let newOD = sub.odCount || 0;
      let newTotal = (sub.total || 0) + 1;

      if (action === 'present') {
        newAttended += 1;
      } else if (action === 'od') {
        newOD += 1;
      }

      return { ...sub, attended: newAttended, odCount: newOD, total: newTotal };
    });

    setSubjects(updated);
    saveTrackerToCloud(updated);

    const label = action === 'present' ? 'Present' : action === 'od' ? 'OD / Medical' : 'Absent';
    addToast({
      message: `📅 Marked ${markedCount} scheduled classes as ${label} for today!`,
      type: action === 'present' ? 'success' : 'warning'
    });
  };

  // Calculate Cumulative Overall Stats & Bottleneck Subject
  const overallStats = useMemo(() => {
    let totalAttended = 0;
    let totalOD = 0;
    let totalClasses = 0;
    let subjectsAtRisk = 0;
    let subjectsSafe = 0;
    let lowestPct = 101;
    let bottleneck = null;

    subjects.forEach(sub => {
      const att = sub.attended || 0;
      const od = (sub.odCount || 0) + (sub.mlCount || 0);
      const tot = sub.total || 0;

      totalAttended += att;
      totalOD += od;
      totalClasses += tot;

      const effectivePct = tot > 0 ? Math.round(((att + od) / tot) * 100) : 100;
      if (effectivePct < targetPercentage) {
        subjectsAtRisk++;
      } else {
        subjectsSafe++;
      }

      if (effectivePct < lowestPct) {
        lowestPct = effectivePct;
        bottleneck = { ...sub, effectivePct };
      }
    });

    const overallRawPct = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 100;
    const overallEffectivePct = totalClasses > 0 ? Math.min(100, Math.round(((totalAttended + totalOD) / totalClasses) * 100)) : 100;
    
    // Overall safe bunks or required classes
    let safeBunksTotal = 0;
    let classesRequiredTotal = 0;

    const effectiveAttendedTotal = totalAttended + totalOD;
    if (overallEffectivePct >= targetPercentage) {
      safeBunksTotal = Math.floor((100 * effectiveAttendedTotal - targetPercentage * totalClasses) / targetPercentage);
    } else {
      classesRequiredTotal = Math.ceil((targetPercentage * totalClasses - 100 * effectiveAttendedTotal) / (100 - targetPercentage));
    }

    return {
      totalAttended,
      totalOD,
      totalClasses,
      totalAbsents: Math.max(0, totalClasses - (totalAttended + totalOD)),
      overallRawPct,
      overallEffectivePct,
      overallPct: overallEffectivePct,
      subjectsAtRisk,
      subjectsSafe,
      bottleneckSubject: bottleneck,
      safeBunksTotal: Math.max(0, safeBunksTotal),
      classesRequiredTotal: Math.max(0, classesRequiredTotal)
    };
  }, [subjects, targetPercentage]);

  // Helper for single subject bunk analysis
  const getBunkAnalysis = (attended, total, target, odCount = 0) => {
    const effectiveAttended = attended + odCount;
    if (total === 0) return { status: 'safe', text: 'No classes logged yet', count: 0 };
    const pct = (effectiveAttended / total) * 100;

    if (pct >= target) {
      const safeBunks = Math.floor((100 * effectiveAttended - target * total) / target);
      return {
        status: 'safe',
        text: safeBunks > 0 
          ? `You can safely bunk ${safeBunks} more ${safeBunks === 1 ? 'class' : 'classes'}!` 
          : 'Borderline safe! Attend your next class to stay safe.',
        count: safeBunks
      };
    } else {
      const needed = Math.ceil((target * total - 100 * effectiveAttended) / (100 - target));
      return {
        status: 'critical',
        text: `Attend next ${needed} consecutive ${needed === 1 ? 'class' : 'classes'} to reach ${target}%!`,
        count: needed
      };
    }
  };

  // What-If Simulator Calculation
  const simulationResult = useMemo(() => {
    let baseAttended = 0;
    let baseTotal = 0;

    if (forecastSubjectId === 'all') {
      baseAttended = overallStats.totalAttended + overallStats.totalOD;
      baseTotal = overallStats.totalClasses;
    } else {
      const s = subjects.find(sub => sub.id === forecastSubjectId);
      if (s) {
        baseAttended = (s.attended || 0) + (s.odCount || 0);
        baseTotal = s.total || 0;
      }
    }

    const simAttended = baseAttended + forecastPlannedAttended;
    const simTotal = baseTotal + forecastPlannedAttended + forecastPlannedBunks;
    const currentPct = baseTotal > 0 ? Math.round((baseAttended / baseTotal) * 100) : 100;
    const projectedPct = simTotal > 0 ? Math.round((simAttended / simTotal) * 100) : 100;
    const delta = projectedPct - currentPct;

    return {
      currentPct,
      projectedPct,
      delta,
      isSafe: projectedPct >= targetPercentage,
      isCondonation: projectedPct >= 65 && projectedPct < targetPercentage,
      isDetention: projectedPct < 65
    };
  }, [forecastSubjectId, forecastPlannedBunks, forecastPlannedAttended, subjects, overallStats, targetPercentage]);

  // Handle PDF Export
  const handleDownloadCondonationPDF = () => {
    setIsGeneratingPdf(true);
    try {
      generateClassAttendanceCondonationPDF({
        studentName: user?.name || user?.displayName || 'Scholar',
        rollNumber: user?.rollNumber || localStorage.getItem('lumixora_student_roll') || '219X1A0501',
        branch: CURRICULUM_PRESETS[selectedBranchPreset]?.name || 'Engineering',
        semester: selectedSemPreset,
        subjects,
        targetPercentage,
        overallStats
      });
      addToast({ message: '📄 Downloaded official attendance condonation PDF!', type: 'success' });
    } catch (err) {
      console.error('PDF error:', err);
      addToast({ message: 'Failed to generate PDF report', type: 'error' });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 4. OFFICIAL UNIVERSITY ATTENDANCE (ROLL NUMBER / ITCA LOOKUP)
  // ──────────────────────────────────────────────────────────────────────────
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || '');
  const [loadingOfficial, setLoadingOfficial] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [officialError, setOfficialError] = useState('');

  useEffect(() => {
    const searchRoll = user?.rollNumber || localStorage.getItem('lumixora_student_roll');
    if (searchRoll) {
      setRollNumber(searchRoll);
      fetchOfficialAttendance(searchRoll);
    }
  }, [user?.rollNumber]);

  const handleOfficialSearch = (e) => {
    e.preventDefault();
    if (!rollNumber.trim()) return;
    fetchOfficialAttendance(rollNumber.trim().toUpperCase());
  };

  const fetchOfficialAttendance = async (searchRoll) => {
    setLoadingOfficial(true);
    setOfficialError('');
    setAttendanceData(null);

    try {
      const docRef = doc(db, 'attendance', searchRoll);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAttendanceData(docSnap.data());
        localStorage.setItem('lumixora_student_roll', searchRoll);
      } else {
        let foundInCache = false;
        try {
          const cache = JSON.parse(localStorage.getItem('lumixora_attendance_master_records') || '{}');
          if (cache[searchRoll]) {
            const cachedData = cache[searchRoll];
            setAttendanceData(cachedData);
            localStorage.setItem('lumixora_student_roll', searchRoll);
            foundInCache = true;
            setDoc(doc(db, 'attendance', searchRoll), { ...cachedData, lastUpdated: new Date().toISOString() }, { merge: true })
              .catch(err => console.warn('Background Firestore push notice:', err));
          }
        } catch (cacheErr) {}

        if (!foundInCache) {
          setOfficialError(`No official attendance records found for Roll Number: ${searchRoll}.`);
        }
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setOfficialError(`Failed to fetch attendance: ${err.message || 'Network error'}.`);
    } finally {
      setLoadingOfficial(false);
    }
  };

  let totalOfficialDays = 0;
  let presentOfficialDays = 0;
  
  if (attendanceData) {
    Object.entries(attendanceData).forEach(([key, value]) => {
      const normalized = key.replace(/\s+/g, '').toLowerCase();
      const isStatic = ['lastupdated', 'name', 'studentname', 'branch', 'department', 'dept', 'rollno', 'rollnumber', 'section', 'year', 'no', 'sno', 'slno', 'category', 'percentage', '%', 'totalclasses', 'noofclassespresent', 'noofabsent', 'gender', 'dob', 'phone', 'email', 'batch'].includes(normalized) || normalized.includes('itca') || normalized.includes('batch');
      const hasNumber = /\d/.test(key);
      const isExactFNAN = key.toUpperCase() === 'FN' || key.toUpperCase() === 'AN';
      if ((hasNumber || isExactFNAN) && !isStatic && !key.includes('__EMPTY') && !normalized.startsWith('column_')) {
        const v = String(value || '').trim().toUpperCase();
        if (['P', '1', 'TRUE', 'PRESENT', 'OD', 'ON DUTY'].includes(v)) {
          totalOfficialDays++;
          presentOfficialDays++;
        } else if (['A', '0', 'FALSE', 'ABSENT', 'AB', 'L', 'LEAVE'].includes(v)) {
          totalOfficialDays++;
        }
      }
    });
  }
  let officialPercentage = totalOfficialDays > 0 ? Math.round((presentOfficialDays / totalOfficialDays) * 100) : 0;

  const getItcaField = (data) => {
    if (!data) return null;
    for (const [key, value] of Object.entries(data)) {
      if (key.replace(/\s+/g, '').toLowerCase().includes('itca')) {
        return { title: key.trim(), value: value };
      }
    }
    return null;
  };
  const itcaField = getItcaField(attendanceData);

  return (
    <div className="flex-1 min-h-screen p-4 sm:p-8 ml-0 lg:ml-64 bg-primary-bg text-white">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pt-16 lg:pt-0">
        
        {/* ─── HERO HEADER & 4-VIEW SWITCHER ─────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-white/10 bg-gradient-to-br from-teal-950/40 via-slate-950/60 to-black/90 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00f5d4]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] text-xs font-black uppercase tracking-widest">
                <Calculator className="w-3.5 h-3.5 animate-pulse" /> Advanced Academic Attendance Suite
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sora">
                Attendance <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5d4] via-teal-300 to-cyan-400">Command Center</span>
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Log period-wise classes, forecast future leaves with What-If simulations, track On-Duty (OD) exemptions, and download official condonation reports.
              </p>
            </div>

            {/* Quick Aggregate Gauge */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-4 shrink-0 shadow-lg">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="50" cy="50" r="42" 
                    stroke={overallStats.overallEffectivePct < 65 ? "#ef4444" : overallStats.overallEffectivePct < 75 ? "#f59e0b" : "#00f5d4"} 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="263.89" 
                    strokeDashoffset={263.89 - (263.89 * Math.min(100, overallStats.overallEffectivePct)) / 100}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute font-black text-sm text-white">{overallStats.overallEffectivePct}%</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Effective Attendance</span>
                <span className="text-xs font-black text-white">
                  {overallStats.totalAttended + overallStats.totalOD} / {overallStats.totalClasses} Classes
                </span>
                <span className={`text-[10px] font-bold block mt-0.5 ${
                  overallStats.overallEffectivePct >= 75 
                    ? 'text-emerald-400' 
                    : overallStats.overallEffectivePct >= 65 
                    ? 'text-amber-400' 
                    : 'text-rose-400'
                }`}>
                  {overallStats.overallEffectivePct >= 75 
                    ? '✅ Safe Zone (Eligible)' 
                    : overallStats.overallEffectivePct >= 65 
                    ? '⚠️ Condonation Required' 
                    : '🚨 Critical Detention Risk'}
                </span>
              </div>
            </div>
          </div>

          {/* 4-View Switcher Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => setActiveView('class_tracker')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === 'class_tracker'
                  ? 'bg-gradient-to-r from-[#00f5d4] to-[#00b4d8] text-black shadow-lg scale-[1.02]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calculator className="w-4 h-4" /> 📱 Subject Tracker & Bunks
            </button>

            <button
              onClick={() => setActiveView('timetable')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === 'timetable'
                  ? 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-lg scale-[1.02]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <CalendarCheck className="w-4 h-4" /> 📅 Daily Timetable & Quick-Log
            </button>

            <button
              onClick={() => setActiveView('forecaster')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === 'forecaster'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg scale-[1.02]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sliders className="w-4 h-4" /> 🔮 What-If Leave Forecaster
            </button>

            <button
              onClick={() => setActiveView('official_records')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === 'official_records'
                  ? 'bg-gradient-to-r from-teal-400 to-[#00f5d4] text-black shadow-lg scale-[1.02]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Award className="w-4 h-4" /> 🏛️ Official College Records
            </button>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* VIEW 1: SUBJECT TRACKER & BUNK CALCULATOR                          */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {activeView === 'class_tracker' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* ─── OVERALL AGGREGATE ATTENDANCE HERO CARD ─── */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#141424] via-black/80 to-slate-950/80 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f5d4]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                
                {/* Left Side: Circular Percentage Gauge */}
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="transparent" />
                      <circle 
                        cx="50" cy="50" r="42" 
                        stroke={overallStats.totalClasses === 0 ? "#4b5563" : overallStats.overallEffectivePct < 65 ? "#ef4444" : overallStats.overallEffectivePct < 75 ? "#f59e0b" : "#00f5d4"} 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray="263.89" 
                        strokeDashoffset={263.89 - (263.89 * (overallStats.totalClasses === 0 ? 0 : Math.min(100, overallStats.overallEffectivePct))) / 100}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        {overallStats.totalClasses === 0 ? '0%' : `${overallStats.overallEffectivePct}%`}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">EFFECTIVE</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300 uppercase">
                      <Calculator className="w-3 h-3 text-[#00f5d4]" /> Cumulative Semester Attendance
                    </div>
                    <h2 className="text-2xl font-black text-white">
                      {overallStats.totalClasses === 0 
                        ? 'No Classes Logged Yet' 
                        : `${overallStats.totalAttended + overallStats.totalOD} of ${overallStats.totalClasses} Classes Accounted`}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                        overallStats.totalClasses === 0
                          ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                          : overallStats.overallEffectivePct >= 75
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : overallStats.overallEffectivePct >= 65
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {overallStats.totalClasses === 0 ? (
                          <><span>ℹ️ Add subjects below</span></>
                        ) : overallStats.overallEffectivePct >= 75 ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> Examination Safe Zone (Eligible)</>
                        ) : overallStats.overallEffectivePct >= 65 ? (
                          <><AlertTriangle className="w-3.5 h-3.5" /> Condonation Zone (65% - 74% Medical / OD)</>
                        ) : (
                          <><ShieldAlert className="w-3.5 h-3.5" /> Critical Detention Risk (&lt; 65%)</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Key Numbers Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto shrink-0">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Attended</span>
                    <span className="text-xl font-black text-emerald-400">{overallStats.totalAttended}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">OD / Medical</span>
                    <span className="text-xl font-black text-cyan-400">{overallStats.totalOD}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Missed</span>
                    <span className="text-xl font-black text-rose-400">{overallStats.totalAbsents}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Target Goal</span>
                    <select
                      value={targetPercentage}
                      onChange={(e) => setTargetPercentage(Number(e.target.value))}
                      className="bg-transparent text-sm font-black text-[#00f5d4] focus:outline-none cursor-pointer mt-0.5"
                    >
                      <option value="65" className="bg-[#141424]">65%</option>
                      <option value="75" className="bg-[#141424]">75%</option>
                      <option value="80" className="bg-[#141424]">80%</option>
                      <option value="85" className="bg-[#141424]">85%</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Bunk / Recovery Guidance Bar */}
              {overallStats.totalClasses > 0 && (
                <div className={`mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                  overallStats.overallEffectivePct >= targetPercentage ? 'text-emerald-300' : 'text-rose-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {overallStats.overallEffectivePct >= targetPercentage ? <Sparkles className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                    <span className="font-bold">
                      {overallStats.overallEffectivePct >= targetPercentage
                        ? `Safe buffer: You can safely miss up to ${overallStats.safeBunksTotal} classes overall without falling below ${targetPercentage}%.`
                        : `Action needed: You need to attend the next ${overallStats.classesRequiredTotal} consecutive classes to reach ${targetPercentage}%.`}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Subjects: <strong className="text-white">{overallStats.subjectsSafe} safe</strong>, <strong className="text-amber-400">{overallStats.subjectsAtRisk} at risk</strong>
                  </span>
                </div>
              )}
            </div>

            {/* ─── 🚨 BOTTLENECK SUBJECT EARLY WARNING RADAR ─── */}
            {overallStats.bottleneckSubject && overallStats.bottleneckSubject.effectivePct < targetPercentage && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-red-950/30 to-black border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                        Bottleneck Subject Alert
                      </span>
                      <span className="text-xs font-bold text-white">
                        {overallStats.bottleneckSubject.name} ({overallStats.bottleneckSubject.code})
                      </span>
                    </div>
                    <p className="text-xs text-rose-200 mt-0.5">
                      Current: <strong>{overallStats.bottleneckSubject.effectivePct}%</strong>. This subject is dragging your eligibility down. Attend the next consecutive classes in this subject to clear the detention threshold!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleMarkClass(overallStats.bottleneckSubject.id, 'present')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md"
                >
                  <Check className="w-3.5 h-3.5" /> Quick Mark Present (+1)
                </button>
              </div>
            )}

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsAddingSubject(!isAddingSubject)}
                  className="px-4 py-2.5 rounded-xl bg-[#00f5d4] hover:bg-[#00f5d4]/90 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Custom Subject
                </button>
                <button
                  onClick={() => setShowCurriculumModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-purple-200 border border-purple-400/40 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-purple-400" /> ⚡ 1-Click Curriculum Presets
                </button>
                <button
                  onClick={handleDownloadCondonationPDF}
                  disabled={isGeneratingPdf || subjects.length === 0}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Generate official institutional attendance condonation application PDF"
                >
                  {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                  <span>Download Condonation PDF</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                {subjects.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Clear all subjects from your attendance tracker?')) {
                        setSubjects([]);
                        saveTrackerToCloud([], []);
                        setAttendanceHistory([]);
                        addToast({ message: 'Cleared attendance tracker.', type: 'info' });
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Add Subject Inline Form */}
            {isAddingSubject && (
              <form onSubmit={handleAddSubject} className="p-6 rounded-3xl bg-black/60 border border-[#00f5d4]/40 space-y-4 animate-scale-in shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#00f5d4]" /> Add New Subject to Tracker
                  </h3>
                  <button type="button" onClick={() => setIsAddingSubject(false)} className="text-xs text-gray-400 hover:text-white">
                    ✕ Close
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 mb-1">Subject Name *</label>
                    <input
                      type="text"
                      required
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      placeholder="e.g. Operating Systems, Compiler Design, Machine Learning"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-[#00f5d4]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Course Code</label>
                    <input
                      type="text"
                      value={newSubCode}
                      onChange={(e) => setNewSubCode(e.target.value)}
                      placeholder="e.g. CS501"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-[#00f5d4]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Initial Classes Attended</label>
                    <input
                      type="number"
                      min="0"
                      value={newSubAttended}
                      onChange={(e) => setNewSubAttended(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00f5d4]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Initial Total Classes Conducted</label>
                    <input
                      type="number"
                      min="0"
                      value={newSubTotal}
                      onChange={(e) => setNewSubTotal(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00f5d4]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingSubject(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 text-xs font-bold hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#00f5d4] text-black font-extrabold text-xs shadow-md cursor-pointer hover:opacity-95"
                  >
                    Save Subject
                  </button>
                </div>
              </form>
            )}

            {/* 1-Click Curriculum Presets Modal */}
            {showCurriculumModal && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-[#0a0f1d] border border-purple-500/40 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl font-bold">
                        🎓
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">1-Click Engineering Curriculum Ingestion</h3>
                        <p className="text-xs text-gray-400">Select branch and semester to load subjects instantly</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCurriculumModal(false)}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Branch & Semester Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Engineering Discipline</label>
                      <select
                        value={selectedBranchPreset}
                        onChange={(e) => setSelectedBranchPreset(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141424] border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-purple-400"
                      >
                        {Object.entries(CURRICULUM_PRESETS).map(([key, item]) => (
                          <option key={key} value={key} className="bg-[#0a0f1d]">{item.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Academic Semester</label>
                      <select
                        value={selectedSemPreset}
                        onChange={(e) => setSelectedSemPreset(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141424] border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-purple-400"
                      >
                        {Object.keys(CURRICULUM_PRESETS[selectedBranchPreset]?.semesters || {}).map(sem => (
                          <option key={sem} value={sem} className="bg-[#0a0f1d]">Semester {sem}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subject Preview */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-gray-400 uppercase font-bold block">
                      Subjects in this Curriculum ({CURRICULUM_PRESETS[selectedBranchPreset]?.semesters?.[selectedSemPreset]?.length || 0}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {CURRICULUM_PRESETS[selectedBranchPreset]?.semesters?.[selectedSemPreset]?.map((s, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] font-mono text-purple-400 font-bold block">{s.code}</span>
                            <span className="font-bold text-white">{s.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {s.attended}/{s.total} Classes
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleApplyCurriculumPreset(false)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs cursor-pointer transition-all"
                    >
                      Merge with Existing
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCurriculumPreset(true)}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer transition-all shadow-lg shadow-purple-600/30"
                    >
                      Replace All Subjects
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Subject Cards Grid */}
            {subjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {subjects.map((sub) => {
                  const attended = sub.attended || 0;
                  const od = (sub.odCount || 0) + (sub.mlCount || 0);
                  const total = sub.total || 0;
                  const rawPct = total > 0 ? Math.round((attended / total) * 100) : 100;
                  const effectivePct = total > 0 ? Math.min(100, Math.round(((attended + od) / total) * 100)) : 100;
                  const bunkInfo = getBunkAnalysis(attended, total, targetPercentage, od);
                  const isCritical = effectivePct < targetPercentage;

                  return (
                    <div
                      key={sub.id}
                      className={`glass-panel p-5 sm:p-6 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between space-y-4 hover:border-white/20 shadow-xl ${
                        isCritical ? 'bg-rose-950/20 border-rose-500/30' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      {/* Top Row: Subject Title, Code & Delete */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-cyan-300 border border-white/10 font-bold">
                            {sub.code || 'CORE'}
                          </span>
                          <h3 className="text-base font-black text-white leading-snug mt-1">
                            {sub.name}
                          </h3>
                        </div>

                        <button
                          onClick={() => handleDeleteSubject(sub.id, sub.name)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Progress Gauge & Stats */}
                      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Attendance Breakdown</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className={`text-2xl font-black ${isCritical ? 'text-rose-400' : 'text-[#00f5d4]'}`}>
                              {attended + od}
                            </span>
                            <span className="text-xs text-gray-400">/ {total} classes</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <span>Att: <strong className="text-white">{attended}</strong></span>
                            {od > 0 && <span className="text-cyan-400">OD: <strong>+{od}</strong></span>}
                            <span>Missed: <strong className="text-rose-300">{Math.max(0, total - (attended + od))}</strong></span>
                          </div>
                        </div>

                        {/* Percentage Ring */}
                        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.06)" strokeWidth="9" fill="transparent" />
                            <circle 
                              cx="50" cy="50" r="40" 
                              stroke={isCritical ? "#ef4444" : "#00f5d4"} 
                              strokeWidth="9" 
                              fill="transparent" 
                              strokeDasharray="251.32" 
                              strokeDashoffset={251.32 - (251.32 * Math.min(100, effectivePct)) / 100}
                              className="transition-all duration-700 ease-out"
                            />
                          </svg>
                          <div className="absolute text-center">
                            <span className="font-black text-xs text-white">{effectivePct}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Smart Bunk / Recovery Guidance Pill */}
                      <div className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                        bunkInfo.status === 'safe'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}>
                        {bunkInfo.status === 'safe' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />}
                        <span className="leading-tight text-[11px]">{bunkInfo.text}</span>
                      </div>

                      {/* 1-Click Action Buttons with OD Tracker */}
                      <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-white/5 font-mono text-[11px]">
                        <button
                          onClick={() => handleMarkClass(sub.id, 'present')}
                          className="py-2 px-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-black flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                          title="Mark Present (+1 class)"
                        >
                          <Check className="w-3 h-3" /> P (+1)
                        </button>

                        <button
                          onClick={() => handleMarkClass(sub.id, 'absent')}
                          className="py-2 px-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-black flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                          title="Mark Absent (+1 missed)"
                        >
                          <XCircle className="w-3 h-3" /> A (+1)
                        </button>

                        <button
                          onClick={() => handleMarkClass(sub.id, 'od')}
                          className="py-2 px-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-black flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                          title="Mark On-Duty / Medical Leave (+1 covered)"
                        >
                          <ShieldCheck className="w-3 h-3" /> OD (+1)
                        </button>

                        <button
                          onClick={() => handleMarkClass(sub.id, 'undo')}
                          className="py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                          title="Undo last class mark"
                        >
                          <Undo2 className="w-3 h-3" /> Undo
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Attendance Activity History Timeline */}
            {attendanceHistory.length > 0 && (
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#00f5d4]" /> Recent Attendance Activity Log
                  </h3>
                  <button
                    onClick={() => setAttendanceHistory([])}
                    className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
                  >
                    Clear History
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {attendanceHistory.slice(0, 15).map(item => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs flex items-center gap-2">
                      <span className="font-bold text-white">{item.subjectName}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                        item.action.includes('Present') ? 'bg-emerald-500/20 text-emerald-300' :
                        item.action.includes('OD') ? 'bg-cyan-500/20 text-cyan-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {item.action}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* VIEW 2: DAILY PERIOD TIMETABLE & 1-CLICK TODAY LOGGER              */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {activeView === 'timetable' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-black/80 to-slate-950/80 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase">
                    <CalendarCheck className="w-3.5 h-3.5" /> Day Schedule & Batch Logger
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">
                    Weekly Class Timetable & Quick Actions
                  </h2>
                  <p className="text-xs text-gray-400">
                    Mark your entire daily batch of periods in 1 click or inspect individual slots.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMarkAllToday('present')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Mark All Today Present
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkAllToday('absent')}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" /> Mark Day Absent
                  </button>
                </div>
              </div>

              {/* Day Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar border-t border-white/10 pt-4">
                {[
                  { id: 1, name: 'Monday', short: 'Mon' },
                  { id: 2, name: 'Tuesday', short: 'Tue' },
                  { id: 3, name: 'Wednesday', short: 'Wed' },
                  { id: 4, name: 'Thursday', short: 'Thu' },
                  { id: 5, name: 'Friday', short: 'Fri' },
                  { id: 6, name: 'Saturday', short: 'Sat' }
                ].map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setActiveTimetableDay(d.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      activeTimetableDay === d.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{d.short}</span>
                    {d.id === currentDayOfWeek && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Timetable Period Schedule Grid */}
            <div className="space-y-3">
              {(weeklyTimetable[activeTimetableDay] || []).map((slot, pIdx) => {
                const matchedSub = subjects.find(s => s.code === slot.code || s.name.toLowerCase().includes(slot.subject.toLowerCase()));
                const pct = matchedSub && matchedSub.total > 0 
                  ? Math.round(((matchedSub.attended + (matchedSub.odCount || 0)) / matchedSub.total) * 100) 
                  : null;

                return (
                  <div
                    key={pIdx}
                    className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono font-bold flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] text-gray-500 uppercase">P{slot.period}</span>
                        <span className="text-xs">{slot.period}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-cyan-400 font-bold">{slot.time}</span>
                          {slot.isLab && (
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                              Lab Session
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-white mt-0.5">{slot.subject}</h4>
                        <span className="text-[11px] font-mono text-gray-400">Course Code: {slot.code}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {pct !== null ? (
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Current Attendance</span>
                          <span className={`text-xs font-bold font-mono ${pct >= targetPercentage ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {pct}% ({matchedSub.attended + (matchedSub.odCount || 0)}/{matchedSub.total})
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-500 italic">Not tracked</span>
                      )}

                      {matchedSub && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleMarkClass(matchedSub.id, 'present')}
                            className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
                            title="Mark Present"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkClass(matchedSub.id, 'absent')}
                            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer"
                            title="Mark Absent"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* VIEW 3: WHAT-IF BUNK & LEAVE FORECASTER (SEMESTER SIMULATOR)        */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {activeView === 'forecaster' && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-black/80 to-slate-950/80 shadow-2xl space-y-6">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase">
                    <Sliders className="w-3.5 h-3.5" /> Predictive Semester Forecaster
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">
                    What-If Bunk & Leave Forecaster
                  </h2>
                  <p className="text-xs text-gray-400">
                    Simulate how missing upcoming lectures or attending extra classes will impact your final examination eligibility.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-gray-400 font-bold">Scope:</label>
                  <select
                    value={forecastSubjectId}
                    onChange={(e) => setForecastSubjectId(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-[#141424] border border-white/15 text-xs text-white font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="all">Cumulative (All Subjects)</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code || 'CORE'})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Simulation Controls & Dynamic Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Planned Bunks Slider */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-300 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-400" /> Planned Bunks / Leaves
                    </span>
                    <span className="text-lg font-black text-rose-400 font-mono">{forecastPlannedBunks} Classes</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={forecastPlannedBunks}
                    onChange={(e) => setForecastPlannedBunks(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>0 classes</span>
                    <span>12 classes</span>
                    <span>25 classes</span>
                  </div>
                </div>

                {/* Additional Classes Attended Slider */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Additional Classes to Attend
                    </span>
                    <span className="text-lg font-black text-emerald-400 font-mono">{forecastPlannedAttended} Classes</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={forecastPlannedAttended}
                    onChange={(e) => setForecastPlannedAttended(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>0 classes</span>
                    <span>25 classes</span>
                    <span>50 classes</span>
                  </div>
                </div>
              </div>

              {/* Real-Time Forecast Comparison Card */}
              <div className="p-6 rounded-3xl bg-black/60 border border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
                <div className="flex items-center gap-6">
                  {/* Current */}
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block">Current Attendance</span>
                    <span className="text-3xl font-black text-white">{simulationResult.currentPct}%</span>
                  </div>

                  <div className="text-2xl text-gray-500 font-mono">➔</div>

                  {/* Projected */}
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block">Projected Attendance</span>
                    <span className={`text-4xl font-black ${
                      simulationResult.isSafe ? 'text-emerald-400' : simulationResult.isCondonation ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {simulationResult.projectedPct}%
                    </span>
                  </div>
                </div>

                {/* Delta Badge & Guidance */}
                <div className="space-y-2 text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold font-mono border">
                    <span>Net Delta:</span>
                    <span className={simulationResult.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {simulationResult.delta >= 0 ? `+${simulationResult.delta}%` : `${simulationResult.delta}%`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 max-w-md">
                    {simulationResult.isSafe ? (
                      <span className="text-emerald-300 font-bold">
                        ✅ Safe Zone: You remain above the {targetPercentage}% requirement. Hall ticket will be granted without condonation.
                      </span>
                    ) : simulationResult.isCondonation ? (
                      <span className="text-amber-300 font-bold">
                        ⚠️ Condonation Alert: Drops to {simulationResult.projectedPct}%. You will need approved medical certificates or OD documentation to avoid detention.
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold">
                        🚨 Critical Detention Danger: Drops below 65%. You risk semester detention under university academic regulations!
                      </span>
                    )}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* VIEW 4: OFFICIAL UNIVERSITY ATTENDANCE (ROLL NUMBER / ITCA LOOKUP) */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {activeView === 'official_records' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Search Box */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00f5d4]/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <form onSubmit={handleOfficialSearch} className="relative z-10">
                <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
                  Enter your Roll Number to fetch official campus records
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                      placeholder="e.g., 219X1A0501"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-bold tracking-widest uppercase focus:outline-none focus:border-[#00f5d4]/50 transition-colors shadow-inner"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                  <button 
                    type="submit"
                    disabled={loadingOfficial || !rollNumber.trim()}
                    className="py-4 px-8 bg-gradient-to-r from-[#00f5d4] to-[#00b4d8] text-black font-extrabold rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,245,212,0.3)] cursor-pointer shrink-0"
                  >
                    {loadingOfficial ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    {loadingOfficial ? 'Searching...' : 'Find Records'}
                  </button>
                </div>
              </form>

              {officialError && (
                <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 relative z-10">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300 font-semibold">{officialError}</p>
                </div>
              )}
            </div>

            {loadingOfficial && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-[#00f5d4] animate-spin mb-4" />
                <p className="text-gray-400 font-semibold">Loading official university attendance records...</p>
              </div>
            )}

            {/* Official Results Dashboard */}
            {attendanceData && !loadingOfficial && (
              <div className="space-y-6 animate-scale-in">
                
                <div className="mb-6 pl-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-8 rounded-full bg-[#00f5d4]"></div>
                    <h2 className="text-xl font-bold text-white">University Record Overview</h2>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-gray-300 flex items-center gap-2">
                      <User className="w-4 h-4 text-brand-blue" />
                      ID: {rollNumber}
                    </span>
                    
                    {(() => {
                      let nameVal = attendanceData.NAME || attendanceData.Name || attendanceData.name;
                      if (!nameVal) {
                        const nameKey = Object.keys(attendanceData).find(k => k.toUpperCase().includes('NAME'));
                        if (nameKey) nameVal = attendanceData[nameKey];
                      }
                      if (nameVal) {
                        return (
                          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-gray-300 flex items-center gap-2">
                            <User className="w-4 h-4 text-[#00f5d4]" />
                            {nameVal}
                          </span>
                        );
                      }
                      return null;
                    })()}
                    
                    {itcaField && (
                      <span className="px-3 py-1.5 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-sm font-bold text-brand-purple flex items-center gap-2">
                        {itcaField.title}: {itcaField.value}
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary Row */}
                <div className={`grid grid-cols-2 ${itcaField ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-4 mb-6`}>
                  <div className={`glass-panel p-5 rounded-2xl border flex flex-col justify-center items-center text-center ${officialPercentage < 80 && totalOfficialDays > 0 ? 'border-red-500/30 bg-red-500/10' : 'border-[#00f5d4]/20 bg-[#00f5d4]/5'}`}>
                    <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${officialPercentage < 80 && totalOfficialDays > 0 ? 'text-red-400' : 'text-[#00f5d4]'}`}>Percentage</span>
                    <span className={`text-3xl font-black ${officialPercentage < 80 && totalOfficialDays > 0 ? 'text-red-500' : 'text-white'}`}>{officialPercentage}%</span>
                  </div>
                  
                  {itcaField && (
                    <div className="glass-panel p-5 rounded-2xl border border-brand-purple/20 bg-brand-purple/5 flex flex-col justify-center items-center text-center">
                      <span className="text-[10px] sm:text-xs font-bold text-brand-purple uppercase tracking-wider mb-1 px-1 text-center truncate max-w-full">{itcaField.title}</span>
                      <span className="text-xl sm:text-2xl font-black text-white truncate max-w-full px-2">{itcaField.value}</span>
                    </div>
                  )}

                  <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-center items-center text-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Present Days</span>
                    <span className="text-3xl font-black text-brand-teal">{presentOfficialDays}</span>
                  </div>

                  <div className={`glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-center items-center text-center ${itcaField ? '' : 'col-span-2 sm:col-span-1'}`}>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Days</span>
                    <span className="text-3xl font-black text-white">{totalOfficialDays}</span>
                  </div>
                </div>

                {/* Caution Alert Banner for Low Attendance */}
                {totalOfficialDays > 0 && officialPercentage < 75 && (
                  <div className="mb-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-rose-950/80 via-red-950/60 to-black border-2 border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.25)] relative overflow-hidden animate-pulse">
                    <div className="absolute top-0 left-0 w-2 h-full bg-red-500 shadow-[0_0_15px_#ef4444]"></div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 shrink-0 mt-0.5">
                          <ShieldAlert className="w-8 h-8 text-red-500 animate-bounce" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono text-[10px] font-black uppercase tracking-widest border border-red-500/30">
                            ⚠️ ATTENDANCE SHORTAGE CAUTION
                          </div>
                          <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                            {officialPercentage < 65 
                              ? `🚨 Critical Shortage Alert: ${officialPercentage}% (Detention Risk)`
                              : `⚠️ Low Attendance Caution: ${officialPercentage}% (Below 75% Minimum)`}
                          </h3>
                          <p className="text-xs sm:text-sm text-red-200 leading-relaxed max-w-2xl">
                            {(() => {
                              const req = Math.ceil((0.75 * totalOfficialDays - presentOfficialDays) / 0.25);
                              return (
                                <>
                                  You must attend the next <strong className="text-white underline font-black">{Math.max(1, req)} consecutive classes / working days</strong> without taking any leave to restore your attendance to the mandatory <strong>75%</strong> requirement.
                                </>
                              );
                            })()}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-black/60 border border-red-500/30 text-center shrink-0 w-full sm:w-auto">
                        <span className="text-[10px] text-red-300 font-extrabold uppercase tracking-wider block">Recovery Target</span>
                        <span className="text-2xl font-black text-white">75% Req.</span>
                        <span className="text-[10px] text-red-400 font-bold block mt-0.5">
                          {officialPercentage < 65 ? 'Detention Danger' : 'Condonation Zone'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
