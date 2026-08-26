import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, AlertTriangle, User, Loader2, Plus, CheckCircle2, XCircle, 
  RefreshCw, Trash2, BookOpen, Clock, Calendar, Zap, ShieldAlert, 
  Sparkles, TrendingUp, BarChart3, ChevronRight, Edit3, Save, Check,
  Calculator, Undo2, Award, Info
} from 'lucide-react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

export default function AttendancePortal({ user }) {
  const { addToast } = useToast();
  const userId = user?.uid || user?.email || 'guest_student';

  // Mode Switcher: 'class_tracker' (Personal Subject-wise Calculator) vs 'official_records' (Roll No / ITCA lookup)
  const [activeView, setActiveView] = useState('class_tracker');

  // ──────────────────────────────────────────────────────────────────────────
  // 1. CLASS-WISE ATTENDANCE TRACKER & BUNK CALCULATOR STATE (REAL DATA ONLY)
  // ──────────────────────────────────────────────────────────────────────────
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem(`lumixora_class_attendance_${userId}`);
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        // Filter out any leftover legacy mock subjects
        const isLegacyMock = parsed.some(s => s.faculty?.includes('Govardhan') || s.name === 'Operating Systems' && s.attended === 22);
        if (!isLegacyMock && Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  const [targetPercentage, setTargetPercentage] = useState(75);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubFaculty, setNewSubFaculty] = useState('');
  const [newSubAttended, setNewSubAttended] = useState('0');
  const [newSubTotal, setNewSubTotal] = useState('0');
  const [editingSubId, setEditingSubId] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);

  // Sync to local storage & Firestore
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
        history: updatedHistory.slice(0, 50), // keep latest 50 logs
        targetPercentage,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore attendance tracker save error:', err);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // Mark Attendance: 'present' | 'absent' | 'undo'
  const handleMarkClass = (subjectId, action) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    setSubjects(prev => {
      const updated = prev.map(sub => {
        if (sub.id !== subjectId) return sub;

        let newAttended = sub.attended;
        let newTotal = sub.total;

        if (action === 'present') {
          newAttended += 1;
          newTotal += 1;
        } else if (action === 'absent') {
          newTotal += 1;
        } else if (action === 'undo') {
          if (newTotal > 0) {
            // Undo last action logic: if attended was > 0, assume we reduce total by 1
            if (newAttended === newTotal) {
              newAttended = Math.max(0, newAttended - 1);
            }
            newTotal = Math.max(0, newTotal - 1);
          }
        }

        return { ...sub, attended: newAttended, total: newTotal };
      });

      const subObj = prev.find(s => s.id === subjectId);
      const actionText = action === 'present' ? '✅ Marked Present' : action === 'absent' ? '❌ Marked Absent' : '↩️ Undone Class';
      
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
    } else {
      addToast({ message: 'Last class count reverted', type: 'info' });
    }
  };

  // Add Subject
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const attendedNum = Math.max(0, parseInt(newSubAttended) || 0);
    const totalNum = Math.max(attendedNum, parseInt(newSubTotal) || 0);

    const newSub = {
      id: `sub_${Date.now()}`,
      name: newSubName.trim(),
      attended: attendedNum,
      total: totalNum,
      target: targetPercentage
    };

    const updated = [...subjects, newSub];
    setSubjects(updated);
    saveTrackerToCloud(updated);

    // Reset Form
    setNewSubName('');
    setNewSubAttended('0');
    setNewSubTotal('0');
    setIsAddingSubject(false);
    addToast({ message: `Added "${newSub.name}" to your tracker!`, type: 'success' });
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

  // Reset to Defaults
  const handleResetToDefaults = () => {
    if (confirm('Reset your subject list to default engineering semester subjects?')) {
      setSubjects(DEFAULT_STUDENT_SUBJECTS);
      saveTrackerToCloud(DEFAULT_STUDENT_SUBJECTS, []);
      setAttendanceHistory([]);
      addToast({ message: 'Reset tracker to default subjects.', type: 'info' });
    }
  };

  // Calculate Overall Stats
  const overallStats = useMemo(() => {
    let totalAttended = 0;
    let totalClasses = 0;
    let subjectsAtRisk = 0;
    let subjectsSafe = 0;

    subjects.forEach(sub => {
      totalAttended += sub.attended;
      totalClasses += sub.total;
      const pct = sub.total > 0 ? (sub.attended / sub.total) * 100 : 100;
      if (pct < targetPercentage) {
        subjectsAtRisk++;
      } else {
        subjectsSafe++;
      }
    });

    const overallPct = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 100;
    
    // Overall safe bunks or required classes
    let safeBunksTotal = 0;
    let classesRequiredTotal = 0;

    if (overallPct >= targetPercentage) {
      safeBunksTotal = Math.floor((100 * totalAttended - targetPercentage * totalClasses) / targetPercentage);
    } else {
      classesRequiredTotal = Math.ceil((targetPercentage * totalClasses - 100 * totalAttended) / (100 - targetPercentage));
    }

    return {
      totalAttended,
      totalClasses,
      totalAbsents: totalClasses - totalAttended,
      overallPct,
      subjectsAtRisk,
      subjectsSafe,
      safeBunksTotal: Math.max(0, safeBunksTotal),
      classesRequiredTotal: Math.max(0, classesRequiredTotal)
    };
  }, [subjects, targetPercentage]);

  // Helper for single subject bunk analysis
  const getBunkAnalysis = (attended, total, target) => {
    if (total === 0) return { status: 'safe', text: 'No classes logged yet', count: 0 };
    const pct = (attended / total) * 100;

    if (pct >= target) {
      // How many classes can be bunked while keeping >= target?
      // (attended) / (total + x) >= target / 100
      // 100 * attended >= target * total + target * x
      // target * x <= 100 * attended - target * total
      // x <= (100 * attended - target * total) / target
      const safeBunks = Math.floor((100 * attended - target * total) / target);
      return {
        status: 'safe',
        text: safeBunks > 0 
          ? `You can safely bunk ${safeBunks} more ${safeBunks === 1 ? 'class' : 'classes'}!` 
          : 'You are on the boundary. Attend next class!',
        count: safeBunks
      };
    } else {
      // How many consecutive classes need to be attended to reach >= target?
      // (attended + y) / (total + y) >= target / 100
      // 100 * attended + 100 * y >= target * total + target * y
      // (100 - target) * y >= target * total - 100 * attended
      // y >= (target * total - 100 * attended) / (100 - target)
      const needed = Math.ceil((target * total - 100 * attended) / (100 - target));
      return {
        status: 'critical',
        text: `Need to attend next ${needed} consecutive ${needed === 1 ? 'class' : 'classes'} to reach ${target}%!`,
        count: needed
      };
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 2. OFFICIAL COLLEGE ATTENDANCE (ROLL NUMBER / ITCA LOOKUP)
  // ──────────────────────────────────────────────────────────────────────────
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || '');
  const [loadingOfficial, setLoadingOfficial] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [officialError, setOfficialError] = useState('');

  // Auto-load if saved locally or available in user profile
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
        setOfficialError(`No official attendance records found for Roll Number: ${searchRoll}.`);
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
  
  if (totalOfficialDays === 0 && attendanceData) {
     let foundPercent = null;
     let foundTotal = null;
     let foundPresent = null;
     Object.keys(attendanceData).forEach(k => {
       const norm = k.replace(/\s+/g, '').toLowerCase();
       if (norm === 'percentage' || norm === '%' || norm === 'attendance%' || norm === 'att%') {
          const val = parseFloat(attendanceData[k]);
          if (!isNaN(val)) foundPercent = val;
       }
       if (norm.includes('totalclasses') || norm === 'total') {
          const val = parseFloat(attendanceData[k]);
          if (!isNaN(val)) foundTotal = val;
       }
       if (norm.includes('classespresent') || norm === 'present' || norm.includes('attended')) {
          const val = parseFloat(attendanceData[k]);
          if (!isNaN(val)) foundPresent = val;
       }
     });
     
     if (foundPercent !== null) {
       officialPercentage = Math.round(foundPercent);
     } else if (foundTotal > 0 && foundPresent !== null) {
       officialPercentage = Math.round((foundPresent / foundTotal) * 100);
     }
  }
  
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
        
        {/* ─── HERO HEADER & VIEW SWITCHER ───────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-white/10 bg-gradient-to-br from-teal-950/40 via-slate-950/60 to-black/90 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00f5d4]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] text-xs font-black uppercase tracking-widest">
                <Calculator className="w-3.5 h-3.5 animate-pulse" /> Class Attendance & Bunk Predictor
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Attendance <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5d4] via-teal-300 to-cyan-400">Command Center</span>
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Mark your live period-wise attendance, calculate safe bunks, forecast 75% thresholds, and view official university records.
              </p>
            </div>

            {/* Quick Overall Attendance Badge */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-4 shrink-0 shadow-lg">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="50" cy="50" r="42" 
                    stroke={overallStats.overallPct < 75 ? "#ef4444" : "#00f5d4"} 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="263.89" 
                    strokeDashoffset={263.89 - (263.89 * Math.min(100, overallStats.overallPct)) / 100}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute font-black text-sm text-white">{overallStats.overallPct}%</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Aggregate Attendance</span>
                <span className="text-xs font-black text-white">
                  {overallStats.totalAttended} / {overallStats.totalClasses} Classes
                </span>
                <span className={`text-[10px] font-bold block mt-0.5 ${overallStats.overallPct < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {overallStats.overallPct < 75 ? '⚠️ Below 75% Threshold' : '✅ Safe Attendance Zone'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tab Switcher */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => setActiveView('official_records')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === 'official_records'
                  ? 'bg-gradient-to-r from-teal-400 to-[#00f5d4] text-black shadow-lg scale-[1.02]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Award className="w-4 h-4" /> 🏛️ Official College Attendance
            </button>

            <button
              onClick={() => setActiveView('class_tracker')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === 'class_tracker'
                  ? 'bg-gradient-to-r from-[#00f5d4] to-[#00b4d8] text-black shadow-lg scale-[1.02]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calculator className="w-4 h-4" /> 📱 Class-Wise Tracker & Bunk Calc
            </button>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* VIEW 1: CLASS-WISE ATTENDANCE TRACKER & BUNK CALCULATOR           */}
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
                        stroke={overallStats.totalClasses === 0 ? "#4b5563" : overallStats.overallPct < 65 ? "#ef4444" : overallStats.overallPct < 75 ? "#f59e0b" : "#00f5d4"} 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray="263.89" 
                        strokeDashoffset={263.89 - (263.89 * (overallStats.totalClasses === 0 ? 0 : Math.min(100, overallStats.overallPct))) / 100}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        {overallStats.totalClasses === 0 ? '0%' : `${overallStats.overallPct}%`}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">OVERALL</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300 uppercase">
                      <Calculator className="w-3 h-3 text-[#00f5d4]" /> Cumulative Semester Attendance
                    </div>
                    <h2 className="text-2xl font-black text-white">
                      {overallStats.totalClasses === 0 
                        ? 'No Classes Logged Yet' 
                        : `${overallStats.totalAttended} of ${overallStats.totalClasses} Classes Attended`}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                        overallStats.totalClasses === 0
                          ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                          : overallStats.overallPct >= 75
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : overallStats.overallPct >= 65
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {overallStats.totalClasses === 0 ? (
                          <><span>ℹ️ Add subjects below</span></>
                        ) : overallStats.overallPct >= 75 ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> Eligible for Semester Exams (Safe Zone)</>
                        ) : overallStats.overallPct >= 65 ? (
                          <><AlertTriangle className="w-3.5 h-3.5" /> Condonation Required (65% - 74%)</>
                        ) : (
                          <><ShieldAlert className="w-3.5 h-3.5" /> Critical Detention Risk (&lt; 65%)</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Key Numbers Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto shrink-0">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Attended</span>
                    <span className="text-xl font-black text-emerald-400">{overallStats.totalAttended}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Missed</span>
                    <span className="text-xl font-black text-rose-400">{overallStats.totalAbsents}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center col-span-2 sm:col-span-1">
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
                  overallStats.overallPct >= targetPercentage ? 'text-emerald-300' : 'text-rose-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {overallStats.overallPct >= targetPercentage ? <Sparkles className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                    <span className="font-bold">
                      {overallStats.overallPct >= targetPercentage
                        ? `Safe buffer: You can miss up to ${overallStats.safeBunksTotal} classes overall without falling below ${targetPercentage}%.`
                        : `Action needed: You need to attend the next ${overallStats.classesRequiredTotal} consecutive classes to reach ${targetPercentage}%.`}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Subjects: <strong className="text-white">{overallStats.subjectsSafe} safe</strong>, <strong className="text-amber-400">{overallStats.subjectsAtRisk} at risk</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingSubject(!isAddingSubject)}
                  className="px-4 py-2.5 rounded-xl bg-[#00f5d4] hover:bg-[#00f5d4]/90 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Subject / Class
                </button>
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
                    className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                )}
              </div>

              <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-teal" /> 1-Click: Mark Present (+1) or Absent (+1)
              </span>
            </div>

            {/* Add Subject Modal / Inline Drawer */}
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

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    placeholder="e.g. Operating Systems, Compiler Design, Machine Learning"
                    className="w-full px-4 py-3 rounded-2xl bg-[#141424] border border-white/10 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-[#00f5d4] shadow-inner"
                  />
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

            {/* Empty State when no real subjects are added yet */}
            {subjects.length === 0 && !isAddingSubject && (
              <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-white/10 text-center space-y-4 max-w-xl mx-auto my-6 shadow-2xl">
                <div className="w-16 h-16 rounded-3xl bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] flex items-center justify-center mx-auto shadow-inner">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">No Subjects in Your Tracker Yet</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                    Add your current semester subjects and start logging your daily classes to accurately calculate your real attendance, safe bunks, and 75% thresholds.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingSubject(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00f5d4] to-[#00b4d8] text-black font-extrabold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> + Add Your First Subject
                </button>
              </div>
            )}

            {/* Subject Cards Grid */}
            {subjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {subjects.map((sub) => {
                const percentage = sub.total > 0 ? Math.round((sub.attended / sub.total) * 100) : 100;
                const bunkInfo = getBunkAnalysis(sub.attended, sub.total, targetPercentage);
                const isCritical = percentage < targetPercentage;

                return (
                  <div
                    key={sub.id}
                    className={`glass-panel p-5 sm:p-6 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between space-y-4 hover:border-white/20 shadow-xl ${
                      isCritical ? 'bg-rose-950/20 border-rose-500/30' : 'bg-white/5 border-white/10'
                    }`}
                  >
                    {/* Top Row: Subject Title & Delete */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                          {sub.name}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleDeleteSubject(sub.id, sub.name)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Gauge & Stats */}
                    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Attendance</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-2xl font-black ${isCritical ? 'text-rose-400' : 'text-[#00f5d4]'}`}>
                            {sub.attended}
                          </span>
                          <span className="text-xs text-gray-400">/ {sub.total} classes</span>
                        </div>
                        <span className="text-[10px] text-gray-500 block">
                          Missed: <strong className="text-gray-300">{sub.total - sub.attended}</strong>
                        </span>
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
                            strokeDashoffset={251.32 - (251.32 * Math.min(100, percentage)) / 100}
                            className="transition-all duration-700 ease-out"
                          />
                        </svg>
                        <span className="absolute font-black text-xs text-white">{percentage}%</span>
                      </div>
                    </div>

                    {/* Smart Bunk / Recovery Guidance Pill */}
                    <div className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                      bunkInfo.status === 'safe'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}>
                      {bunkInfo.status === 'safe' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                      <span className="leading-tight text-[11px]">{bunkInfo.text}</span>
                    </div>

                    {/* 1-Click Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleMarkClass(sub.id, 'present')}
                        className="py-2.5 px-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Present (+1)
                      </button>

                      <button
                        onClick={() => handleMarkClass(sub.id, 'absent')}
                        className="py-2.5 px-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-black flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Absent (+1)
                      </button>

                      <button
                        onClick={() => handleMarkClass(sub.id, 'undo')}
                        className="py-2.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                        title="Undo last class mark"
                      >
                        <Undo2 className="w-3.5 h-3.5" /> Undo
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
                    className="text-[11px] text-gray-400 hover:text-white underline"
                  >
                    Clear History
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
                  {attendanceHistory.slice(0, 15).map(item => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs flex items-center gap-2">
                      <span className="font-bold text-white">{item.subjectName}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${item.action.includes('Present') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {item.action}
                      </span>
                      <span className="text-[10px] text-gray-500">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* VIEW 2: OFFICIAL UNIVERSITY ATTENDANCE (ROLL NUMBER / ITCA LOOKUP)*/}
        {/* ────────────────────────────────────────────────────────────────── */}
        {activeView === 'official_records' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Search Box - Only show if user doesn't have a roll number linked */}
            {!user?.rollNumber && (
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
            )}
            
            {/* Error message for users with pre-filled roll number */}
            {user?.rollNumber && officialError && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 relative z-10">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300 font-semibold">{officialError}</p>
              </div>
            )}

            {user?.rollNumber && loadingOfficial && (
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

                {/* Buffer Caution (Between 75% and 80%) */}
                {totalOfficialDays > 0 && officialPercentage >= 75 && officialPercentage < 80 && (
                  <div className="mb-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                    <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                    <div className="text-xs sm:text-sm text-amber-200">
                      <strong className="text-white font-bold block mb-0.5">⚡ Attendance Warning Buffer ({officialPercentage}%):</strong>
                      Your attendance is just above the 75% cut-off. Maintain regular attendance to avoid slipping into condonation shortage.
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
