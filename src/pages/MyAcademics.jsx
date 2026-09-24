import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, Plus, Edit3, Trash2, Award, TrendingUp, CheckCircle2, 
  AlertTriangle, BookOpen, Calendar, ChevronRight, X, Save, RefreshCw, 
  Sparkles, Check, ArrowUpRight, BarChart2, ShieldCheck, HelpCircle, Layers,
  Calculator, Target, ArrowRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { 
  loadStudentAcademics, 
  saveStudentAcademics, 
  calculateSubjectAttendance, 
  calculateSemesterAttendance, 
  calculateOverallAttendance,
  DEFAULT_SEMESTER_NAMES,
  getInitialAcademicData 
} from '../services/academicsService';

const POPULAR_SUBJECT_PRESETS = [
  'Data Structures & Algorithms',
  'Operating Systems',
  'Database Management Systems',
  'Computer Networks',
  'Machine Learning',
  'Software Engineering',
  'Artificial Intelligence',
  'Engineering Mathematics',
  'Web Technologies',
  'Object Oriented Programming'
];

export default function MyAcademics({ user }) {
  const { addToast } = useToast();
  const userId = user?.uid || user?.email || 'guest_student';
  const studentName = user?.name || user?.displayName || 'Scholar';

  // Core State
  const [academicData, setAcademicData] = useState(() => getInitialAcademicData());
  const [activeSemesterId, setActiveSemesterId] = useState('sem_1');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modals & Dialogs
  const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);
  const [newSemesterName, setNewSemesterName] = useState('');
  const [newSemesterSgpa, setNewSemesterSgpa] = useState('');

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null); // null when adding
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    mid1Obtained: '',
    mid1Max: '40',
    mid2Obtained: '',
    mid2Max: '30',
    semObtained: '',
    semMax: '100',
    attendanceMode: 'percentage', // 'percentage' | 'classes'
    attendancePercentage: '',
    classesAttended: '',
    classesTotal: ''
  });
  const [formError, setFormError] = useState('');

  const [showCgpaModal, setShowCgpaModal] = useState(false);
  const [tempCgpa, setTempCgpa] = useState('');

  const [showSgpaModal, setShowSgpaModal] = useState(false);
  const [tempSgpa, setTempSgpa] = useState('');

  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    type: '', // 'semester' | 'subject'
    targetId: null,
    targetName: ''
  });

  // Target CGPA Calculator Drawer / State
  const [showTargetCalculator, setShowTargetCalculator] = useState(false);
  const [targetCgpaGoal, setTargetCgpaGoal] = useState('9.0');
  const [remainingSemesters, setRemainingSemesters] = useState('4');

  // 1. Initial Load
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await loadStudentAcademics(userId);
        if (isMounted && data) {
          const semList = (Array.isArray(data.semesters) && data.semesters.length > 0)
            ? data.semesters
            : [
                {
                  id: 'sem_1',
                  name: 'Semester 1',
                  sgpa: '',
                  subjects: []
                }
              ];
          const activeId = (data.currentSemesterId && semList.some(s => s.id === data.currentSemesterId))
            ? data.currentSemesterId
            : semList[0].id;

          const completeData = {
            overallCgpa: data.overallCgpa || '',
            currentSemesterId: activeId,
            semesters: semList
          };

          setAcademicData(completeData);
          setActiveSemesterId(activeId);
        }
      } catch (err) {
        console.warn('Error loading student academics:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [userId]);

  // 2. Active Semester (Guaranteed fallback)
  const activeSemester = useMemo(() => {
    if (!academicData.semesters || academicData.semesters.length === 0) return null;
    const found = academicData.semesters.find(s => s.id === activeSemesterId);
    return found || academicData.semesters[0];
  }, [academicData.semesters, activeSemesterId]);

  // 3. Calculated Metrics
  const currentSemesterSgpa = activeSemester?.sgpa || '—';
  const overallCgpa = academicData.overallCgpa || '—';
  
  const currentSemesterAttendance = useMemo(() => {
    return activeSemester ? calculateSemesterAttendance(activeSemester.subjects) : 0;
  }, [activeSemester]);

  const overallAttendance = useMemo(() => {
    return calculateOverallAttendance(academicData.semesters);
  }, [academicData.semesters]);

  // 4. Persistence Helper (Optimistic with background cloud sync)
  const persistChanges = async (newData) => {
    setAcademicData(newData);
    setIsSaving(true);
    try {
      await saveStudentAcademics(userId, newData, studentName);
    } catch (e) {
      console.warn('Async sync notice:', e);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── SEMESTER ACTIONS ────────────────────────────────────────────────────────
  const handleAddSemester = (presetName = null) => {
    const name = (typeof presetName === 'string' && presetName.trim() ? presetName : newSemesterName).trim();
    if (!name) {
      addToast({ message: 'Please provide a semester name', type: 'warning' });
      return;
    }

    // Check duplicate
    if (academicData.semesters.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      addToast({ message: `"${name}" already exists.`, type: 'warning' });
      return;
    }

    const newSem = {
      id: 'sem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name,
      sgpa: newSemesterSgpa.trim() || '',
      subjects: []
    };

    const updatedSemesters = [...academicData.semesters, newSem];
    const updatedData = {
      ...academicData,
      currentSemesterId: newSem.id,
      semesters: updatedSemesters
    };

    // Instant optimistic UI updates
    setActiveSemesterId(newSem.id);
    setShowAddSemesterModal(false);
    setNewSemesterName('');
    setNewSemesterSgpa('');
    addToast({ message: `✨ ${name} created successfully!`, type: 'success' });

    persistChanges(updatedData);
  };

  const handleUpdateSemesterSgpa = () => {
    if (!activeSemester) return;
    const val = tempSgpa.trim();
    if (val && (isNaN(val) || parseFloat(val) < 0 || parseFloat(val) > 10)) {
      addToast({ message: 'Please enter a valid SGPA between 0.00 and 10.00', type: 'error' });
      return;
    }

    const updatedSemesters = academicData.semesters.map(s => {
      if (s.id === activeSemester.id) {
        return { ...s, sgpa: val };
      }
      return s;
    });

    const updatedData = { ...academicData, semesters: updatedSemesters };
    
    // Instant optimistic UI update
    setShowSgpaModal(false);
    addToast({ message: `✨ ${activeSemester.name} SGPA updated to ${val || '—'}!`, type: 'success' });

    persistChanges(updatedData);
  };

  const handleUpdateOverallCgpa = () => {
    const val = tempCgpa.trim();
    if (val && (isNaN(val) || parseFloat(val) < 0 || parseFloat(val) > 10)) {
      addToast({ message: 'Please enter a valid CGPA between 0.00 and 10.00', type: 'error' });
      return;
    }

    const updatedData = { ...academicData, overallCgpa: val };
    
    // Instant optimistic UI update
    setShowCgpaModal(false);
    addToast({ message: `✨ Overall CGPA updated to ${val || '—'}!`, type: 'success' });

    persistChanges(updatedData);
  };

  const executeDeleteSemester = () => {
    const semId = confirmDelete.targetId;
    const remaining = academicData.semesters.filter(s => s.id !== semId);
    
    // If all deleted, recreate Semester 1 fallback
    const finalSemesters = remaining.length > 0 ? remaining : [
      { id: 'sem_1', name: 'Semester 1', sgpa: '', subjects: [] }
    ];
    const newActiveId = finalSemesters[0].id;

    const updatedData = {
      ...academicData,
      currentSemesterId: newActiveId,
      semesters: finalSemesters
    };

    // Instant optimistic UI update
    setActiveSemesterId(newActiveId);
    setConfirmDelete({ isOpen: false, type: '', targetId: null, targetName: '' });
    addToast({ message: 'Semester deleted.', type: 'info' });

    persistChanges(updatedData);
  };

  // ─── SUBJECT ACTIONS ─────────────────────────────────────────────────────────
  const openAddSubjectModal = (presetName = '') => {
    // If no semesters exist yet, auto-create Semester 1
    if (!academicData.semesters || academicData.semesters.length === 0) {
      const defaultSem = {
        id: 'sem_1',
        name: 'Semester 1',
        sgpa: '',
        subjects: []
      };
      const initData = {
        ...academicData,
        currentSemesterId: defaultSem.id,
        semesters: [defaultSem]
      };
      persistChanges(initData);
      setActiveSemesterId(defaultSem.id);
    } else if (!activeSemesterId && academicData.semesters.length > 0) {
      setActiveSemesterId(academicData.semesters[0].id);
    }

    setEditingSubject(null);
    setSubjectForm({
      name: typeof presetName === 'string' ? presetName : '',
      mid1Obtained: '',
      mid1Max: '40',
      mid2Obtained: '',
      mid2Max: '30',
      semObtained: '',
      semMax: '100',
      attendanceMode: 'percentage',
      attendancePercentage: '',
      classesAttended: '',
      classesTotal: ''
    });
    setFormError('');
    setShowSubjectModal(true);
  };

  const openEditSubjectModal = (sub) => {
    setEditingSubject(sub);
    const isClasses = sub.attendance?.type === 'classes';
    setSubjectForm({
      name: sub.name || '',
      mid1Obtained: sub.mid1?.obtained !== undefined && sub.mid1?.obtained !== null ? String(sub.mid1.obtained) : '',
      mid1Max: sub.mid1?.max !== undefined && sub.mid1?.max !== null ? String(sub.mid1.max) : '40',
      mid2Obtained: sub.mid2?.obtained !== undefined && sub.mid2?.obtained !== null ? String(sub.mid2.obtained) : '',
      mid2Max: sub.mid2?.max !== undefined && sub.mid2?.max !== null ? String(sub.mid2.max) : '30',
      semObtained: sub.semMarks?.obtained !== undefined && sub.semMarks?.obtained !== null ? String(sub.semMarks.obtained) : '',
      semMax: sub.semMarks?.max !== undefined && sub.semMarks?.max !== null ? String(sub.semMarks.max) : '100',
      attendanceMode: isClasses ? 'classes' : 'percentage',
      attendancePercentage: sub.attendance?.value !== undefined && sub.attendance?.value !== null && sub.attendance?.type === 'percentage' ? String(sub.attendance.value) : '',
      classesAttended: sub.attendance?.attended !== undefined && sub.attendance?.attended !== null ? String(sub.attendance.attended) : '',
      classesTotal: sub.attendance?.total !== undefined && sub.attendance?.total !== null ? String(sub.attendance.total) : ''
    });
    setFormError('');
    setShowSubjectModal(true);
  };

  const validateSubjectForm = () => {
    if (!subjectForm.name || !subjectForm.name.trim()) {
      return 'Subject Name is required.';
    }

    const checkMarks = (obtainedStr, maxStr, label) => {
      if (obtainedStr && String(obtainedStr).trim() !== '') {
        const obt = parseFloat(obtainedStr);
        const max = parseFloat(maxStr) || (label === 'Mid-1' ? 40 : label === 'Mid-2' ? 30 : 100);
        if (isNaN(obt) || obt < 0) return `${label} obtained marks cannot be negative.`;
        if (isNaN(max) || max <= 0) return `${label} maximum marks must be greater than 0.`;
        if (obt > max) return `${label} marks (${obt}) cannot exceed maximum marks (${max}).`;
      }
      return null;
    };

    const mid1Err = checkMarks(subjectForm.mid1Obtained, subjectForm.mid1Max, 'Mid-1');
    if (mid1Err) return mid1Err;

    const mid2Err = checkMarks(subjectForm.mid2Obtained, subjectForm.mid2Max, 'Mid-2');
    if (mid2Err) return mid2Err;

    const semErr = checkMarks(subjectForm.semObtained, subjectForm.semMax, 'Semester');
    if (semErr) return semErr;

    if (subjectForm.attendanceMode === 'percentage') {
      if (subjectForm.attendancePercentage && String(subjectForm.attendancePercentage).trim() !== '') {
        const p = parseFloat(subjectForm.attendancePercentage);
        if (isNaN(p) || p < 0 || p > 100) return 'Attendance percentage must be between 0 and 100%.';
      }
    } else {
      if (
        (subjectForm.classesTotal && String(subjectForm.classesTotal).trim() !== '') ||
        (subjectForm.classesAttended && String(subjectForm.classesAttended).trim() !== '')
      ) {
        const att = parseFloat(subjectForm.classesAttended) || 0;
        const tot = parseFloat(subjectForm.classesTotal) || 0;
        if (att < 0 || tot < 0) return 'Class numbers cannot be negative.';
        if (att > tot && tot > 0) return 'Attended classes cannot exceed total classes.';
      }
    }

    return null;
  };

  const handleSaveSubject = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const err = validateSubjectForm();
    if (err) {
      setFormError(err);
      addToast?.({ message: err, type: 'error' });
      return;
    }

    // Ensure active semester exists
    let currentSem = activeSemester;
    let allSemesters = [...(academicData.semesters || [])];

    if (!currentSem) {
      if (allSemesters.length === 0) {
        currentSem = {
          id: 'sem_1',
          name: 'Semester 1',
          sgpa: '',
          subjects: []
        };
        allSemesters = [currentSem];
      } else {
        currentSem = allSemesters[0];
      }
      setActiveSemesterId(currentSem.id);
    }

    // Construct subject payload
    const formatMarkObj = (obtainedStr, maxStr, defaultMax = 100) => {
      if (!obtainedStr || String(obtainedStr).trim() === '') return null;
      return {
        obtained: parseFloat(obtainedStr),
        max: parseFloat(maxStr) || defaultMax
      };
    };

    let attendanceObj = null;
    if (subjectForm.attendanceMode === 'percentage') {
      if (subjectForm.attendancePercentage && String(subjectForm.attendancePercentage).trim() !== '') {
        const p = parseFloat(subjectForm.attendancePercentage);
        if (!isNaN(p)) {
          attendanceObj = {
            type: 'percentage',
            value: p
          };
        }
      }
    } else {
      const hasAtt = subjectForm.classesAttended && String(subjectForm.classesAttended).trim() !== '';
      const hasTot = subjectForm.classesTotal && String(subjectForm.classesTotal).trim() !== '';
      if (hasAtt || hasTot) {
        const att = parseFloat(subjectForm.classesAttended) || 0;
        const tot = parseFloat(subjectForm.classesTotal) || 0;
        const calculatedPct = tot > 0 ? Math.round((att / tot) * 1000) / 10 : 0;
        attendanceObj = {
          type: 'classes',
          attended: att,
          total: tot,
          value: calculatedPct
        };
      }
    }

    const subjectPayload = {
      id: editingSubject ? editingSubject.id : 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: subjectForm.name.trim(),
      mid1: formatMarkObj(subjectForm.mid1Obtained, subjectForm.mid1Max, 40),
      mid2: formatMarkObj(subjectForm.mid2Obtained, subjectForm.mid2Max, 30),
      semMarks: formatMarkObj(subjectForm.semObtained, subjectForm.semMax, 100),
      attendance: attendanceObj
    };

    let updatedSubjects = [];
    if (editingSubject) {
      updatedSubjects = (currentSem.subjects || []).map(s => s.id === editingSubject.id ? subjectPayload : s);
    } else {
      updatedSubjects = [...(currentSem.subjects || []), subjectPayload];
    }

    const updatedSemesters = allSemesters.map(s => {
      if (s.id === currentSem.id) {
        return { ...s, subjects: updatedSubjects };
      }
      return s;
    });

    const updatedData = { 
      ...academicData, 
      currentSemesterId: currentSem.id,
      semesters: updatedSemesters 
    };

    // Instant optimistic UI updates
    setShowSubjectModal(false);
    setEditingSubject(null);
    setFormError('');
    addToast?.({
      message: editingSubject ? `✨ ${subjectPayload.name} updated successfully!` : `✨ ${subjectPayload.name} added to ${currentSem.name}!`,
      type: 'success'
    });

    persistChanges(updatedData);
  };

  const executeDeleteSubject = () => {
    if (!activeSemester) return;
    const subId = confirmDelete.targetId;
    const updatedSubjects = (activeSemester.subjects || []).filter(s => s.id !== subId);

    const updatedSemesters = academicData.semesters.map(s => {
      if (s.id === activeSemester.id) {
        return { ...s, subjects: updatedSubjects };
      }
      return s;
    });

    const updatedData = { ...academicData, semesters: updatedSemesters };
    
    // Instant optimistic UI update
    setConfirmDelete({ isOpen: false, type: '', targetId: null, targetName: '' });
    addToast({ message: 'Subject removed.', type: 'info' });

    persistChanges(updatedData);
  };

  // Target CGPA calculation
  const targetRequiredSgpa = useMemo(() => {
    const goal = parseFloat(targetCgpaGoal) || 0;
    const rem = parseInt(remainingSemesters, 10) || 0;
    const current = parseFloat(academicData.overallCgpa) || 0;
    const completed = Math.max(1, academicData.semesters.filter(s => parseFloat(s.sgpa) > 0).length);

    if (rem <= 0 || goal <= 0) return null;
    const totalSemesters = completed + rem;
    const requiredTotalPoints = goal * totalSemesters;
    const currentTotalPoints = current * completed;
    const needed = (requiredTotalPoints - currentTotalPoints) / rem;

    return Math.round(needed * 100) / 100;
  }, [targetCgpaGoal, remainingSemesters, academicData.overallCgpa, academicData.semesters]);

  // ─── HELPER FORMATTERS ───────────────────────────────────────────────────────
  const getAttendanceBadge = (pct) => {
    if (pct >= 75) {
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        ring: '#10b981',
        label: 'Safe (≥75%)'
      };
    } else if (pct >= 65) {
      return {
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        ring: '#f59e0b',
        label: 'Warning (65-74%)'
      };
    } else {
      return {
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        ring: '#f43f5e',
        label: 'Shortage (<65%)'
      };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-teal/20 border border-brand-teal/40 flex items-center justify-center animate-spin">
          <RefreshCw className="w-6 h-6 text-brand-teal" />
        </div>
        <p className="text-sm font-bold text-gray-400 tracking-wide">Loading Your Academic Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* ─── HEADER / HERO BANNER ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d1527] via-[#090e1b] to-[#120f29] border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-black tracking-widest uppercase">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Performance Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              My Academics
            </h1>
            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
              Track your semester-wise marks, mid-term tests, overall CGPA, and subject attendance in one unified dashboard.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowTargetCalculator(!showTargetCalculator)}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-cyan-300 hover:text-white transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>CGPA Calculator</span>
            </button>
            <button
              onClick={() => {
                setTempCgpa(academicData.overallCgpa || '');
                setShowCgpaModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 hover:text-white transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Award className="w-4 h-4 text-brand-purple" />
              <span>Update CGPA</span>
            </button>
            <button
              onClick={() => setShowAddSemesterModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-teal to-emerald-500 hover:opacity-90 text-xs font-black text-[#030712] transition-all flex items-center gap-2 shadow-lg shadow-brand-teal/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Semester</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── TARGET CGPA CALCULATOR WIDGET ──────────────────────────────────── */}
      {showTargetCalculator && (
        <div className="glass-panel border border-cyan-500/30 rounded-3xl p-6 relative overflow-hidden bg-[#0c1222]/90 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Target CGPA Planner</h3>
                <p className="text-[11px] text-gray-400">Calculate the average SGPA you must score in upcoming semesters.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowTargetCalculator(false)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target CGPA</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={targetCgpaGoal}
                onChange={(e) => setTargetCgpaGoal(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-black text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Remaining Semesters</label>
              <input
                type="number"
                min="1"
                max="8"
                value={remainingSemesters}
                onChange={(e) => setRemainingSemesters(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-black text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col justify-between text-center sm:text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">Required Average SGPA</span>
              <div className="text-2xl font-black text-cyan-400">
                {targetRequiredSgpa !== null ? (
                  targetRequiredSgpa > 10 ? (
                    <span className="text-rose-400 text-lg">⚠️ &gt;10.0 (Unreachable)</span>
                  ) : targetRequiredSgpa <= 0 ? (
                    <span className="text-emerald-400 text-lg">✅ Goal Already Met!</span>
                  ) : (
                    <span>{targetRequiredSgpa} / 10.0</span>
                  )
                ) : '—'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── EMPTY STATE (If semesters empty) ─────────────────────────────────── */}
      {academicData.semesters.length === 0 ? (
        <div className="glass-panel border border-white/10 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-teal/20 to-brand-purple/20 border border-white/15 flex items-center justify-center mx-auto shadow-inner">
            <GraduationCap className="w-10 h-10 text-brand-teal animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Your academic journey starts here.</h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              Add your first semester and start tracking your marks, attendance and academic progress.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleAddSemester('Semester 1')}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-teal to-emerald-500 hover:from-brand-teal/90 hover:to-emerald-400 text-sm font-black text-[#030712] transition-all inline-flex items-center gap-2 shadow-xl shadow-brand-teal/20 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>+ Quick Start Semester 1</span>
            </button>
          </div>

          {/* Quick preset semester pills */}
          <div className="pt-4 border-t border-white/5 space-y-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Or quick-start with:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {DEFAULT_SEMESTER_NAMES.slice(0, 4).map(sem => (
                <button
                  key={sem}
                  onClick={() => handleAddSemester(sem)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-brand-teal transition-colors cursor-pointer"
                >
                  + {sem}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ─── 1. TOP SUMMARY CARDS ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Current SGPA */}
            <div className="glass-panel border border-white/10 rounded-3xl p-5 relative overflow-hidden group hover:border-brand-teal/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">Current SGPA</span>
                <button
                  onClick={() => {
                    setTempSgpa(activeSemester?.sgpa || '');
                    setShowSgpaModal(true);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Edit SGPA"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tight">
                  {currentSemesterSgpa}
                </span>
                {currentSemesterSgpa !== '—' && <span className="text-xs font-bold text-gray-500">/ 10.0</span>}
              </div>
              <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
                <span>{activeSemester?.name || 'Selected Semester'}</span>
              </p>
            </div>

            {/* Card 2: Overall CGPA */}
            <div className="glass-panel border border-white/10 rounded-3xl p-5 relative overflow-hidden group hover:border-brand-purple/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">Overall CGPA</span>
                <button
                  onClick={() => {
                    setTempCgpa(academicData.overallCgpa || '');
                    setShowCgpaModal(true);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Edit CGPA"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tight">
                  {overallCgpa}
                </span>
                {overallCgpa !== '—' && <span className="text-xs font-bold text-gray-500">/ 10.0</span>}
              </div>
              <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-purple" />
                <span>Cumulative Performance</span>
              </p>
            </div>

            {/* Card 3: Overall Attendance */}
            <div className="glass-panel border border-white/10 rounded-3xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">Overall Attendance</span>
                <div className={'px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ' + getAttendanceBadge(overallAttendance).bg}>
                  {overallAttendance >= 75 ? 'Safe' : overallAttendance >= 65 ? 'Warning' : overallAttendance > 0 ? 'Low' : 'No Data'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-black text-white tracking-tight">
                    {overallAttendance > 0 ? overallAttendance + '%' : '—'}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1">Across all recorded semesters</p>
                </div>
                {/* Visual Circular Progress Ring */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      strokeDasharray={overallAttendance + ', 100'}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke={getAttendanceBadge(overallAttendance).ring}
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-gray-300">
                    {overallAttendance > 0 ? Math.round(overallAttendance) + '%' : '0%'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Current Active Semester */}
            <div className="glass-panel border border-white/10 rounded-3xl p-5 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">Current Semester</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-400">
                  {academicData.semesters.length} Semesters Total
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white tracking-tight truncate">
                  {activeSemester?.name || 'None'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>{(activeSemester?.subjects || []).length} Subjects Tracked</span>
              </p>
            </div>

          </div>

          {/* ─── 2. ACADEMIC HISTORY & PROGRESSION CHART ────────────────────── */}
          {academicData.semesters.length > 0 && (
            <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-teal" />
                    <span>Academic Progression History</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Semester-wise SGPA trajectory and performance trends. Click any bar to switch semesters.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <span className="w-3 h-3 rounded-md bg-brand-teal inline-block"></span>
                  <span>Semester SGPA</span>
                </div>
              </div>

              {/* Responsive SVG Progression Chart */}
              <div className="w-full pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                  {academicData.semesters.map((sem) => {
                    const sgpaNum = parseFloat(sem.sgpa) || 0;
                    const heightPct = sgpaNum > 0 ? Math.min(100, Math.max(15, (sgpaNum / 10) * 100)) : 10;
                    const isActive = sem.id === activeSemester?.id;

                    return (
                      <div
                        key={sem.id}
                        onClick={() => setActiveSemesterId(sem.id)}
                        className={'p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-center relative group ' + (
                          isActive 
                            ? 'bg-brand-teal/10 border-brand-teal/40 shadow-lg shadow-brand-teal/10' 
                            : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
                        )}
                      >
                        <span className="text-[11px] font-black text-gray-400 group-hover:text-white transition-colors truncate">
                          {sem.name}
                        </span>

                        {/* Bar Visualizer */}
                        <div className="h-24 w-full flex items-end justify-center py-2">
                          <div
                            style={{ height: heightPct + '%' }}
                            className={'w-8 rounded-xl transition-all duration-500 relative flex items-center justify-center ' + (
                              sgpaNum > 0 
                                ? isActive ? 'bg-gradient-to-t from-brand-teal to-cyan-400' : 'bg-gradient-to-t from-brand-teal/40 to-cyan-400/70'
                                : 'bg-white/10'
                            )}
                          >
                            {sgpaNum > 0 && (
                              <span className="text-[10px] font-black text-[#030712] tracking-tighter">
                                {sgpaNum.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5">
                          <span className={'text-xs font-black ' + (sgpaNum > 0 ? 'text-white' : 'text-gray-500')}>
                            {sem.sgpa ? 'SGPA: ' + sem.sgpa : 'No SGPA'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ─── 3. SEMESTER MANAGEMENT & TABS ──────────────────────────────── */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Semester Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
                {academicData.semesters.map(sem => {
                  const isActive = sem.id === activeSemester?.id;
                  const count = (sem.subjects || []).length;
                  return (
                    <button
                      key={sem.id}
                      onClick={() => setActiveSemesterId(sem.id)}
                      className={'px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ' + (
                        isActive 
                          ? 'bg-brand-teal text-[#030712] border-brand-teal shadow-lg shadow-brand-teal/20' 
                          : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
                      )}
                    >
                      <span>{sem.name}</span>
                      <span className={'px-1.5 py-0.5 rounded-md text-[10px] font-black ' + (
                        isActive ? 'bg-black/20 text-[#030712]' : 'bg-white/10 text-gray-400'
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}

                <button
                  onClick={() => setShowAddSemesterModal(true)}
                  className="px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-400 hover:text-brand-teal bg-white/5 hover:bg-white/10 border border-dashed border-white/15 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Sem</span>
                </button>
              </div>

              {/* Add Subject CTA inside active semester */}
              {activeSemester && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setConfirmDelete({
                        isOpen: true,
                        type: 'semester',
                        targetId: activeSemester.id,
                        targetName: activeSemester.name
                      });
                    }}
                    className="p-2.5 rounded-2xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title={'Delete ' + activeSemester.name}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openAddSubjectModal()}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-teal to-cyan-500 hover:opacity-90 text-xs font-black text-[#030712] transition-all flex items-center gap-2 shadow-lg shadow-brand-teal/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ Add Subject</span>
                  </button>
                </div>
              )}
            </div>

            {/* ─── 4. SEMESTER OVERVIEW & SUBJECT CARDS ─────────────────────── */}
            {activeSemester && (
              <div className="space-y-6">
                
                {/* Semester Overview Banner */}
                <div className="glass-panel border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0d18]/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        {activeSemester.name}
                      </h2>
                      <button
                        onClick={() => {
                          setTempSgpa(activeSemester.sgpa || '');
                          setShowSgpaModal(true);
                        }}
                        className="text-xs text-brand-teal hover:underline font-bold flex items-center gap-1 bg-brand-teal/10 px-2.5 py-1 rounded-lg border border-brand-teal/20 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{activeSemester.sgpa ? 'SGPA: ' + activeSemester.sgpa : 'Set SGPA'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">
                      Overview of all marks and attendance in this semester.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Subjects</span>
                      <span className="text-base font-black text-white">{(activeSemester.subjects || []).length}</span>
                    </div>

                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Semester SGPA</span>
                      <span className="text-base font-black text-white">{activeSemester.sgpa || '—'}</span>
                    </div>

                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Attendance</span>
                      <span className={'text-base font-black ' + (
                        currentSemesterAttendance >= 75 ? 'text-emerald-400' : currentSemesterAttendance >= 65 ? 'text-amber-400' : currentSemesterAttendance > 0 ? 'text-rose-400' : 'text-gray-400'
                      )}>
                        {currentSemesterAttendance > 0 ? currentSemesterAttendance + '%' : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subject Cards Grid */}
                {(!activeSemester.subjects || activeSemester.subjects.length === 0) ? (
                  <div className="glass-panel border border-dashed border-white/15 rounded-3xl p-8 sm:p-12 text-center space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">No subjects added to {activeSemester.name} yet</h4>
                      <p className="text-xs text-gray-400 max-w-sm mx-auto">
                        Add subjects to track your Mid-1, Mid-2, End-Semester marks and attendance.
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => openAddSubjectModal()}
                        className="px-6 py-2.5 rounded-2xl bg-brand-teal text-[#030712] font-black text-xs hover:bg-brand-teal/90 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-brand-teal/20"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>+ Add Subject</span>
                      </button>
                    </div>

                    {/* Quick Subject Suggestions */}
                    <div className="pt-4 border-t border-white/5 space-y-2 max-w-lg mx-auto">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Or quick-add common subject:</span>
                      <div className="flex flex-wrap justify-center gap-2">
                        {POPULAR_SUBJECT_PRESETS.slice(0, 6).map(subName => (
                          <button
                            key={subName}
                            onClick={() => openAddSubjectModal(subName)}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-cyan-300 transition-colors cursor-pointer"
                          >
                            + {subName}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {activeSemester.subjects.map(sub => {
                        const attPct = calculateSubjectAttendance(sub.attendance);
                        const hasAttendance = sub.attendance && (
                          (sub.attendance.type === 'percentage' && sub.attendance.value !== undefined && sub.attendance.value !== null && sub.attendance.value !== '') ||
                          (sub.attendance.type === 'classes' && (parseFloat(sub.attendance.total) || 0) > 0)
                        );
                        const attBadge = getAttendanceBadge(attPct);

                        return (
                          <div
                            key={sub.id}
                            className="glass-panel border border-white/10 rounded-3xl p-5 space-y-4 hover:border-brand-teal/30 transition-all flex flex-col justify-between relative group shadow-lg"
                          >
                            {/* Subject Card Header */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <h3 className="text-lg font-black text-white leading-tight">
                                  {sub.name}
                                </h3>
                                <span className="text-[10px] font-bold text-gray-400 block">
                                  Subject Record
                                </span>
                              </div>

                              {/* Quick Actions */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => openEditSubjectModal(sub)}
                                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                  title="Edit Subject"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmDelete({
                                      isOpen: true,
                                      type: 'subject',
                                      targetId: sub.id,
                                      targetName: sub.name
                                    });
                                  }}
                                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                                  title="Delete Subject"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Marks Grid */}
                            <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5 bg-white/[0.01] rounded-2xl px-2">
                              {/* Mid 1 */}
                              <div className="text-center p-2 rounded-xl bg-white/5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Mid-1</span>
                                {sub.mid1 ? (
                                  <span className="text-sm font-black text-white">
                                    {sub.mid1.obtained} <span className="text-[10px] font-bold text-gray-400">/{sub.mid1.max}</span>
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold text-gray-500">—</span>
                                )}
                              </div>

                              {/* Mid 2 */}
                              <div className="text-center p-2 rounded-xl bg-white/5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Mid-2</span>
                                {sub.mid2 ? (
                                  <span className="text-sm font-black text-white">
                                    {sub.mid2.obtained} <span className="text-[10px] font-bold text-gray-400">/{sub.mid2.max}</span>
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold text-gray-500">—</span>
                                )}
                              </div>

                              {/* End Sem */}
                              <div className="text-center p-2 rounded-xl bg-white/5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Semester</span>
                                {sub.semMarks ? (
                                  <span className="text-sm font-black text-emerald-400">
                                    {sub.semMarks.obtained} <span className="text-[10px] font-bold text-gray-400">/{sub.semMarks.max}</span>
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold text-gray-500">—</span>
                                )}
                              </div>
                            </div>

                            {/* Attendance Footer */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Attendance</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-black text-white">
                                    {hasAttendance ? `${attPct}%` : 'Not recorded'}
                                  </span>
                                  {sub.attendance?.type === 'classes' && (parseFloat(sub.attendance?.total) || 0) > 0 && (
                                    <span className="text-[10px] font-bold text-gray-400">
                                      ({sub.attendance.attended}/{sub.attendance.total} classes)
                                    </span>
                                  )}
                                </div>
                              </div>

                              {hasAttendance && (
                                <span className={'px-2.5 py-1 rounded-xl text-[10px] font-black uppercase border ' + attBadge.bg}>
                                  {attBadge.label}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </>
      )}

      {/* ─── MODAL 1: ADD / EDIT SUBJECT ──────────────────────────────────────── */}
      {showSubjectModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setShowSubjectModal(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-[#0e1017] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-teal" />
                  <span>{editingSubject ? 'Edit Subject Details' : 'Add New Subject'}</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Enter marks and attendance for {activeSemester?.name}
                </p>
              </div>
              <button 
                onClick={() => setShowSubjectModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSubject} className="space-y-5">
              
              {/* Subject Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-300 block">
                  Subject Name <span className="text-brand-teal">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subjectForm.name}
                  onChange={(e) => {
                    setSubjectForm({ ...subjectForm, name: e.target.value });
                    setFormError('');
                  }}
                  placeholder="e.g. Data Structures, Operating Systems, Math III"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-brand-teal transition-all placeholder:text-gray-500"
                />

                {/* Preset Suggestions */}
                {!editingSubject && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {POPULAR_SUBJECT_PRESETS.slice(0, 4).map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setSubjectForm({ ...subjectForm, name: preset });
                          setFormError('');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-brand-teal/20 border border-white/10 hover:border-brand-teal/30 text-[11px] font-bold text-gray-400 hover:text-brand-teal transition-colors cursor-pointer"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mid-1 Marks */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-300 block">
                  Mid-1 Marks
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={subjectForm.mid1Obtained}
                      onChange={(e) => setSubjectForm({ ...subjectForm, mid1Obtained: e.target.value })}
                      placeholder="Obtained (e.g. 24)"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-brand-teal transition-all"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={subjectForm.mid1Max}
                      onChange={(e) => setSubjectForm({ ...subjectForm, mid1Max: e.target.value })}
                      placeholder="Max (e.g. 40)"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-400 focus:outline-none focus:border-brand-teal transition-all"
                    />
                    <span className="absolute right-3 top-3.5 text-xs text-gray-500 font-bold">Max</span>
                  </div>
                </div>
              </div>

              {/* Mid-2 Marks */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-300 block">
                  Mid-2 Marks
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={subjectForm.mid2Obtained}
                      onChange={(e) => setSubjectForm({ ...subjectForm, mid2Obtained: e.target.value })}
                      placeholder="Obtained (e.g. 27)"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-brand-teal transition-all"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={subjectForm.mid2Max}
                      onChange={(e) => setSubjectForm({ ...subjectForm, mid2Max: e.target.value })}
                      placeholder="Max (e.g. 30)"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-400 focus:outline-none focus:border-brand-teal transition-all"
                    />
                    <span className="absolute right-3 top-3.5 text-xs text-gray-500 font-bold">Max</span>
                  </div>
                </div>
              </div>

              {/* Semester / End-Sem Marks */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-300 block">
                  Semester / End-Sem Marks
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={subjectForm.semObtained}
                      onChange={(e) => setSubjectForm({ ...subjectForm, semObtained: e.target.value })}
                      placeholder="Obtained (e.g. 72)"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-brand-teal transition-all"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={subjectForm.semMax}
                      onChange={(e) => setSubjectForm({ ...subjectForm, semMax: e.target.value })}
                      placeholder="Max (e.g. 100)"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-400 focus:outline-none focus:border-brand-teal transition-all"
                    />
                    <span className="absolute right-3 top-3.5 text-xs text-gray-500 font-bold">Max</span>
                  </div>
                </div>
              </div>

              {/* Attendance Section */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-300">
                    Subject Attendance (Optional)
                  </label>
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setSubjectForm({ ...subjectForm, attendanceMode: 'percentage' })}
                      className={'px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors cursor-pointer ' + (
                        subjectForm.attendanceMode === 'percentage' 
                          ? 'bg-brand-teal text-[#030712]' 
                          : 'text-gray-400 hover:text-white'
                      )}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubjectForm({ ...subjectForm, attendanceMode: 'classes' })}
                      className={'px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors cursor-pointer ' + (
                        subjectForm.attendanceMode === 'classes' 
                          ? 'bg-brand-teal text-[#030712]' 
                          : 'text-gray-400 hover:text-white'
                      )}
                    >
                      Classes (38/42)
                    </button>
                  </div>
                </div>

                {subjectForm.attendanceMode === 'percentage' ? (
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={subjectForm.attendancePercentage}
                      onChange={(e) => setSubjectForm({ ...subjectForm, attendancePercentage: e.target.value })}
                      placeholder="e.g. 91"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-brand-teal transition-all"
                    />
                    <span className="absolute right-4 top-3.5 text-sm font-black text-brand-teal">%</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={subjectForm.classesAttended}
                        onChange={(e) => setSubjectForm({ ...subjectForm, classesAttended: e.target.value })}
                        placeholder="Attended (e.g. 38)"
                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-brand-teal transition-all"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={subjectForm.classesTotal}
                        onChange={(e) => setSubjectForm({ ...subjectForm, classesTotal: e.target.value })}
                        placeholder="Total (e.g. 42)"
                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-brand-teal transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-brand-teal hover:bg-brand-teal/90 text-xs font-black text-[#030712] transition-all flex items-center gap-2 shadow-lg shadow-brand-teal/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSubject ? 'Update Subject' : 'Add Subject'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: ADD SEMESTER ────────────────────────────────────────────── */}
      {showAddSemesterModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setShowAddSemesterModal(false)}
        >
          <div 
            className="relative w-full max-w-md bg-[#0e1017] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-teal" />
                  <span>Add Semester</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Select a semester preset or type a custom name.
                </p>
              </div>
              <button 
                onClick={() => setShowAddSemesterModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400 block">Quick Presets:</span>
              <div className="grid grid-cols-2 gap-2">
                {DEFAULT_SEMESTER_NAMES.map(name => {
                  const alreadyExists = academicData.semesters.some(s => s.name.toLowerCase() === name.toLowerCase());
                  return (
                    <button
                      key={name}
                      type="button"
                      disabled={alreadyExists}
                      onClick={() => handleAddSemester(name)}
                      className={'p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ' + (
                        alreadyExists 
                          ? 'opacity-40 border-white/5 bg-white/[0.01] text-gray-500 cursor-not-allowed' 
                          : 'bg-white/5 border-white/10 hover:border-brand-teal/40 hover:bg-brand-teal/10 text-gray-300 hover:text-brand-teal'
                      )}
                    >
                      <span>{name}</span>
                      {alreadyExists && <span className="text-[10px] text-gray-500">Added</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Name Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleAddSemester(); }} className="space-y-3 pt-3 border-t border-white/5">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-400 block">Or Custom Name</label>
                <input
                  type="text"
                  value={newSemesterName}
                  onChange={(e) => setNewSemesterName(e.target.value)}
                  placeholder="e.g. Semester 9, Summer Term 2026"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-brand-teal transition-all placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-400 block">SGPA (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={newSemesterSgpa}
                  onChange={(e) => setNewSemesterSgpa(e.target.value)}
                  placeholder="e.g. 8.42"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-brand-teal transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={!newSemesterName.trim()}
                className="w-full py-3 rounded-2xl bg-brand-teal hover:bg-brand-teal/90 disabled:opacity-40 text-xs font-black text-[#030712] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-teal/20 mt-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create Custom Semester</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: UPDATE OVERALL CGPA ─────────────────────────────────────── */}
      {showCgpaModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setShowCgpaModal(false)}
        >
          <div 
            className="relative w-full max-w-sm bg-[#0e1017] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-purple" />
                  <span>Update Overall CGPA</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Manually set your official cumulative grade point average.
                </p>
              </div>
              <button 
                onClick={() => setShowCgpaModal(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleUpdateOverallCgpa(); }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-300 block">
                  Overall CGPA (0.00 - 10.00)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={tempCgpa}
                  onChange={(e) => setTempCgpa(e.target.value)}
                  placeholder="e.g. 8.31"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-base font-black text-white focus:outline-none focus:border-brand-purple transition-all"
                />
                <p className="text-[11px] text-gray-500">
                  You can update this anytime official semester results are released by your college.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCgpaModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-purple hover:opacity-90 text-xs font-black text-white shadow-lg shadow-brand-purple/20 cursor-pointer"
                >
                  Save CGPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: UPDATE SEMESTER SGPA ────────────────────────────────────── */}
      {showSgpaModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setShowSgpaModal(false)}
        >
          <div 
            className="relative w-full max-w-sm bg-[#0e1017] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-teal" />
                  <span>Update {activeSemester?.name} SGPA</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Manually set your semester grade point average.
                </p>
              </div>
              <button 
                onClick={() => setShowSgpaModal(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleUpdateSemesterSgpa(); }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-300 block">
                  Semester SGPA (0.00 - 10.00)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={tempSgpa}
                  onChange={(e) => setTempSgpa(e.target.value)}
                  placeholder="e.g. 8.42"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-base font-black text-white focus:outline-none focus:border-brand-teal transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSgpaModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-teal hover:opacity-90 text-xs font-black text-[#030712] shadow-lg shadow-brand-teal/20 cursor-pointer"
                >
                  Save SGPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 5: CONFIRM DELETE DIALOG ──────────────────────────────────── */}
      {confirmDelete.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setConfirmDelete({ isOpen: false, type: '', targetId: null, targetName: '' })}
        >
          <div 
            className="relative w-full max-w-sm bg-[#0e1017] border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-white">
                Delete {confirmDelete.type === 'semester' ? 'Semester' : 'Subject'}?
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-white">"{confirmDelete.targetName}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete({ isOpen: false, type: '', targetId: null, targetName: '' })}
                className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete.type === 'semester' ? executeDeleteSemester : executeDeleteSubject}
                className="py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-black text-white shadow-lg shadow-rose-500/20 transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
