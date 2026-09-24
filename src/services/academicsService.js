import { db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { saveAcademicDataToSupabase } from './supabaseDataSyncService';

export const DEFAULT_SEMESTER_NAMES = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8'
];

export const getInitialAcademicData = () => {
  const defaultSemId = 'sem_1';
  return {
    overallCgpa: '',
    currentSemesterId: defaultSemId,
    semesters: [
      {
        id: defaultSemId,
        name: 'Semester 1',
        sgpa: '',
        subjects: []
      }
    ]
  };
};

/**
 * Load student academic data from LocalStorage and Firestore
 */
export const loadStudentAcademics = async (userId) => {
  const defaultData = getInitialAcademicData();
  if (!userId) return defaultData;

  const storageKey = `lumixora_my_academics_${userId}`;
  let localData = null;

  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      localData = JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Could not read cached academic data:', e);
  }

  // Try fetching latest from Firestore with timeout
  try {
    const docRef = doc(db, 'user_academics', userId);
    const getPromise = getDoc(docRef);
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 3000));
    
    const snap = await Promise.race([getPromise, timeoutPromise]);
    if (snap && snap.exists && snap.exists()) {
      const cloudData = snap.data();
      const mergedSemesters = Array.isArray(cloudData.semesters) && cloudData.semesters.length > 0
        ? cloudData.semesters
        : (localData?.semesters && localData.semesters.length > 0 ? localData.semesters : defaultData.semesters);

      const merged = {
        overallCgpa: cloudData.overallCgpa ?? localData?.overallCgpa ?? '',
        currentSemesterId: cloudData.currentSemesterId || localData?.currentSemesterId || mergedSemesters[0]?.id || 'sem_1',
        semesters: mergedSemesters
      };
      localStorage.setItem(storageKey, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Firestore academic data load notice, using local data:', err);
  }

  if (localData && Array.isArray(localData.semesters) && localData.semesters.length > 0) {
    return localData;
  }

  return defaultData;
};

/**
 * Save student academic data to LocalStorage and Firestore
 */
export const saveStudentAcademics = async (userId, academicData, studentName = 'Scholar') => {
  if (!userId) return false;

  const storageKey = `lumixora_my_academics_${userId}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(academicData));
  } catch (e) {
    console.warn('Local storage write error for academics:', e);
  }

  try {
    const docRef = doc(db, 'user_academics', userId);
    const setPromise = setDoc(docRef, {
      userId,
      studentName,
      overallCgpa: academicData.overallCgpa || '',
      currentSemesterId: academicData.currentSemesterId || '',
      semesters: academicData.semesters || [],
      updatedAt: serverTimestamp()
    }, { merge: true });

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore save timeout')), 4000));
    await Promise.race([setPromise, timeoutPromise]);

    // Sync to Supabase in background
    saveAcademicDataToSupabase({ id: userId, name: studentName }, academicData).catch(e => console.warn("Supabase academic sync notice:", e));

    return true;
  } catch (err) {
    console.warn('Firestore academics save notice:', err);
    saveAcademicDataToSupabase({ id: userId, name: studentName }, academicData).catch(() => {});
    return true; // Local storage save succeeded
  }
};

/**
 * Calculate attendance percentage for a subject
 */
export const calculateSubjectAttendance = (att) => {
  if (!att) return 0;
  if (att.type === 'percentage') {
    if (att.value === undefined || att.value === null || att.value === '') return 0;
    return Math.max(0, Math.min(100, parseFloat(att.value) || 0));
  }
  if (att.type === 'classes') {
    const total = parseFloat(att.total) || 0;
    const attended = parseFloat(att.attended) || 0;
    if (total <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((attended / total) * 1000) / 10));
  }
  return parseFloat(att.value) || 0;
};

/**
 * Calculate overall attendance for a semester
 */
export const calculateSemesterAttendance = (subjects = []) => {
  if (!subjects || subjects.length === 0) return 0;
  const validSubjects = subjects.filter(s => {
    if (!s || !s.attendance) return false;
    if (s.attendance.type === 'classes') {
      return (parseFloat(s.attendance.total) || 0) > 0;
    }
    return s.attendance.value !== undefined && s.attendance.value !== null && s.attendance.value !== '';
  });
  if (validSubjects.length === 0) return 0;

  const sum = validSubjects.reduce((acc, sub) => acc + calculateSubjectAttendance(sub.attendance), 0);
  return Math.round((sum / validSubjects.length) * 10) / 10;
};

/**
 * Calculate overall attendance across all semesters
 */
export const calculateOverallAttendance = (semesters = []) => {
  if (!semesters || semesters.length === 0) return 0;
  let totalPctSum = 0;
  let subjectCount = 0;

  semesters.forEach(sem => {
    (sem.subjects || []).forEach(sub => {
      if (sub && sub.attendance) {
        if (sub.attendance.type === 'classes') {
          if ((parseFloat(sub.attendance.total) || 0) > 0) {
            totalPctSum += calculateSubjectAttendance(sub.attendance);
            subjectCount += 1;
          }
        } else if (sub.attendance.value !== undefined && sub.attendance.value !== null && sub.attendance.value !== '') {
          totalPctSum += calculateSubjectAttendance(sub.attendance);
          subjectCount += 1;
        }
      }
    });
  });

  if (subjectCount === 0) return 0;
  return Math.round((totalPctSum / subjectCount) * 10) / 10;
};
