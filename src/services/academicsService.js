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
  return {
    overallCgpa: '',
    currentSemesterId: '',
    semesters: []
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

  // Try fetching latest from Firestore
  try {
    const docRef = doc(db, 'user_academics', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const cloudData = snap.data();
      const merged = {
        overallCgpa: cloudData.overallCgpa ?? localData?.overallCgpa ?? '',
        currentSemesterId: cloudData.currentSemesterId || localData?.currentSemesterId || (cloudData.semesters?.[0]?.id ?? ''),
        semesters: Array.isArray(cloudData.semesters) ? cloudData.semesters : (localData?.semesters || [])
      };
      localStorage.setItem(storageKey, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Firestore academic data load error, using local data:', err);
  }

  return localData || defaultData;
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
    await setDoc(docRef, {
      userId,
      studentName,
      overallCgpa: academicData.overallCgpa || '',
      currentSemesterId: academicData.currentSemesterId || '',
      semesters: academicData.semesters || [],
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Sync to Supabase in parallel
    saveAcademicDataToSupabase({ id: userId, name: studentName }, academicData).catch(e => console.warn("Supabase academic sync notice:", e));

    return true;
  } catch (err) {
    console.warn('Firestore academics save error:', err);
    // Even if Firestore errors, try saving to Supabase
    saveAcademicDataToSupabase({ id: userId, name: studentName }, academicData).catch(() => {});
    return false;
  }
};

/**
 * Calculate attendance percentage for a subject
 */
export const calculateSubjectAttendance = (att) => {
  if (!att) return 0;
  if (att.type === 'percentage') {
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
  const validSubjects = subjects.filter(s => s && s.attendance);
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
        totalPctSum += calculateSubjectAttendance(sub.attendance);
        subjectCount += 1;
      }
    });
  });

  if (subjectCount === 0) return 0;
  return Math.round((totalPctSum / subjectCount) * 10) / 10;
};
