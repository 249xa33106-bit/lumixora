import { db } from '../config/firebase';
import { collection, doc, getDocs, setDoc, addDoc, query, where, getDoc } from 'firebase/firestore';
import { supabase } from '../config/supabase';

// Safe timeout wrapper to guarantee network calls never hang the application
export const withTimeout = (promise, ms = 800, fallbackVal = null) => {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(fallbackVal), ms))
  ]).catch(() => fallbackVal);
};

// Initial Subjects registry
const INITIAL_SUBJECTS = [
  { id: 'ds101', name: 'Data Structures & Algorithms', code: 'CS301', credits: 4, targetMarks: 90 },
  { id: 'db102', name: 'Database Management Systems', code: 'CS302', credits: 3, targetMarks: 85 },
  { id: 'ml103', name: 'Introduction to Machine Learning', code: 'AI301', credits: 4, targetMarks: 88 },
  { id: 'cn104', name: 'Computer Networks', code: 'CS303', credits: 3, targetMarks: 80 }
];

// Save the user's past academic baseline to Supabase & localStorage
export async function saveAcademicBaseline(userId, data) {
  if (!userId) userId = 'default_user';
  localStorage.setItem(`lumixora_baseline_${userId}`, JSON.stringify(data));
  localStorage.setItem('lumixora_baseline_default_user', JSON.stringify(data));

  try {
    const sbUpsert = supabase.from('student_baselines').upsert({
      user_id: userId,
      cgpa: data.cgpa || 8.0,
      target_cgpa: data.target_cgpa || 9.0,
      attendance: data.attendance || 85,
      semester: data.semester || 'Sem 3',
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    
    await withTimeout(sbUpsert, 800);
  } catch (err) {
    console.warn('Supabase baseline sync notice:', err);
  }

  // Non-blocking Firestore save attempt with tight timeout
  try {
    if (db) {
      const safeDocId = String(userId).replace(/[^a-zA-Z0-9_-]/g, '_');
      const baselineRef = doc(db, 'Users', safeDocId, 'Baselines', 'academic');
      await withTimeout(setDoc(baselineRef, {
        cgpa: Number(data.cgpa) || 0,
        target_cgpa: Number(data.target_cgpa) || 0,
        attendance: Number(data.attendance) || 0,
        semester: data.semester || 'Sem 3',
        updated_at: new Date().toISOString()
      }, { merge: true }), 500);
    }
  } catch (fbErr) {}

  return true;
}

export async function checkAndSeedTwinData(userId) {
  try {
    if (!db) return false;
    const seedOp = async () => {
      const userDocRef = doc(db, 'Users', userId);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, { initialized: true, createdAt: new Date().toISOString() });
      }

      const subjectsRef = collection(db, 'Users', userId, 'Subjects');
      const subjectsSnap = await getDocs(subjectsRef);
      
      if (subjectsSnap.empty) {
        for (const sub of INITIAL_SUBJECTS) {
          await setDoc(doc(db, 'Users', userId, 'Subjects', sub.id), sub);
        }
        return true;
      }
      return false;
    };

    return await withTimeout(seedOp(), 500, false);
  } catch (err) {
    return false;
  }
}

export async function fetchFullStudentHistory(userId) {
  try {
    const safeGetDocs = async (collRef) => {
      try {
        if (!db) return { docs: [] };
        const snap = await withTimeout(getDocs(collRef), 600, { docs: [] });
        return snap || { docs: [] };
      } catch (e) {
        return { docs: [] };
      }
    };

    // 1. Fetch from Firestore collections with strict timeouts
    const [
      subjectsSnap,
      firestoreSessionsSnap,
      firestoreQuizzesSnap,
      firestorePyqsSnap,
      firestoreAssignmentsSnap,
      attendanceSnap,
      notesSnap,
      goalsSnap
    ] = await Promise.all([
      safeGetDocs(collection(db, 'Users', userId, 'Subjects')),
      safeGetDocs(collection(db, 'Users', userId, 'StudySessions')),
      safeGetDocs(collection(db, 'Users', userId, 'QuizResults')),
      safeGetDocs(collection(db, 'Users', userId, 'PYQAttempts')),
      safeGetDocs(collection(db, 'Users', userId, 'Assignments')),
      safeGetDocs(collection(db, 'Users', userId, 'Attendance')),
      safeGetDocs(collection(db, 'Users', userId, 'NotesRead')),
      safeGetDocs(collection(db, 'Users', userId, 'Goals'))
    ]);

    let subjects = (subjectsSnap && subjectsSnap.docs) ? subjectsSnap.docs.map(d => ({ id: d.id, ...d.data() })) : [];
    if (!subjects || subjects.length === 0) {
      subjects = INITIAL_SUBJECTS;
    }

    let sessions = (firestoreSessionsSnap && firestoreSessionsSnap.docs) ? firestoreSessionsSnap.docs.map(d => ({ id: d.id, ...d.data() })) : [];
    let quizzes = (firestoreQuizzesSnap && firestoreQuizzesSnap.docs) ? firestoreQuizzesSnap.docs.map(d => ({ id: d.id, ...d.data() })) : [];
    let pyqs = (firestorePyqsSnap && firestorePyqsSnap.docs) ? firestorePyqsSnap.docs.map(d => ({ id: d.id, ...d.data() })) : [];
    let assignments = (firestoreAssignmentsSnap && firestoreAssignmentsSnap.docs) ? firestoreAssignmentsSnap.docs.map(d => ({ id: d.id, ...d.data() })) : [];
    const attendance = (attendanceSnap && attendanceSnap.docs) ? attendanceSnap.docs.map(d => ({ id: d.id, ...d.data() })) : [];
    const notesRead = (notesSnap && notesSnap.docs) ? notesSnap.docs.map(d => ({ id: d.id, ...d.data() })) : [];

    // 2. Query Real Tasks from Supabase Database with strict timeout
    try {
      const { data: supabaseTasks, error: taskErr } = (await withTimeout(supabase.from('tasks').select('*'), 600, { data: [], error: null })) || {};
      if (!taskErr && supabaseTasks && Array.isArray(supabaseTasks)) {
        const mappedTasks = supabaseTasks.map(t => ({
          id: t.id,
          subjectId: 'ds101',
          title: t.title,
          dueDate: t.dueDate || '',
          status: t.status === 'Done' ? 'Completed' : 'Pending'
        }));
        assignments = [...assignments, ...mappedTasks];
      }
    } catch (e) {}

    // 3. Query Doubts from Supabase with strict timeout
    let doubtsCount = 0;
    try {
      const { data: supabaseDoubts, error: doubtErr } = (await withTimeout(supabase.from('doubts').select('*'), 600, { data: [], error: null })) || {};
      if (!doubtErr && supabaseDoubts && Array.isArray(supabaseDoubts)) {
        doubtsCount = supabaseDoubts.length;
      }
    } catch (e) {}

    // 4. Fetch baseline from localStorage, Supabase and Firestore and merge
    let mergedGoals = {
      targetCGPA: 9.0,
      previousCGPA: 8.2,
      overallAttendance: 85,
      studyHoursGoal: 4,
      semester: 'Sem 3'
    };

    // Check localStorage baseline
    try {
      const localBaseStr = localStorage.getItem(`lumixora_baseline_${userId}`) || localStorage.getItem('lumixora_baseline_default_user');
      if (localBaseStr) {
        const parsed = JSON.parse(localBaseStr);
        if (parsed) {
          if (parsed.cgpa) mergedGoals.previousCGPA = Number(parsed.cgpa);
          if (parsed.target_cgpa) mergedGoals.targetCGPA = Number(parsed.target_cgpa);
          if (parsed.attendance) mergedGoals.overallAttendance = Number(parsed.attendance);
          if (parsed.semester) mergedGoals.semester = parsed.semester;
        }
      }
    } catch (e) {}

    // Check Supabase student_baselines with strict timeout
    try {
      const sbBaseQuery = supabase
        .from('student_baselines')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      const { data: baselineData, error: baseErr } = (await withTimeout(sbBaseQuery, 600, { data: null, error: null })) || {};
      if (!baseErr && baselineData) {
        if (baselineData.cgpa) mergedGoals.previousCGPA = Number(baselineData.cgpa);
        if (baselineData.target_cgpa) mergedGoals.targetCGPA = Number(baselineData.target_cgpa);
        if (baselineData.attendance) mergedGoals.overallAttendance = Number(baselineData.attendance);
        if (baselineData.semester) mergedGoals.semester = baselineData.semester;
      }
    } catch (e) {}

    // Check Firestore baseline with strict timeout
    try {
      if (db) {
        const baselineRef = doc(db, 'Users', userId, 'Baselines', 'academic');
        const baselineSnap = await withTimeout(getDoc(baselineRef), 500, null);
        if (baselineSnap && baselineSnap.exists && baselineSnap.exists()) {
          const fbBaseline = baselineSnap.data();
          if (fbBaseline.cgpa) mergedGoals.previousCGPA = Number(fbBaseline.cgpa);
          if (fbBaseline.target_cgpa) mergedGoals.targetCGPA = Number(fbBaseline.target_cgpa);
          if (fbBaseline.attendance) mergedGoals.overallAttendance = Number(fbBaseline.attendance);
          if (fbBaseline.semester) mergedGoals.semester = fbBaseline.semester;
        }
      }
    } catch (e) {}

    return { 
      subjects, 
      sessions, 
      quizzes, 
      pyqs, 
      assignments, 
      attendance, 
      notesRead, 
      goals: mergedGoals,
      doubtsCount,
      syllabusProgress: {}
    };
  } catch (err) {
    console.error('Error in fetchFullStudentHistory, providing resilient fallback:', err);
    return {
      subjects: INITIAL_SUBJECTS,
      sessions: [],
      quizzes: [],
      pyqs: [],
      assignments: [],
      attendance: [],
      notesRead: [],
      goals: { targetCGPA: 9.0, previousCGPA: 8.2, overallAttendance: 85, studyHoursGoal: 4, semester: 'Sem 3' },
      doubtsCount: 0,
      syllabusProgress: {}
    };
  }
}

// Generate prediction weights and details deterministically as a fallback or hybrid base
export function calculateDeterministicTwinPredictions(history) {
  const safeHistory = history || {};
  const subjects = safeHistory.subjects && safeHistory.subjects.length > 0 ? safeHistory.subjects : INITIAL_SUBJECTS;
  const sessions = safeHistory.sessions || [];
  const quizzes = safeHistory.quizzes || [];
  const pyqs = safeHistory.pyqs || [];
  const assignments = safeHistory.assignments || [];
  const attendance = safeHistory.attendance || [];
  const notesRead = safeHistory.notesRead || [];
  const goals = safeHistory.goals || { targetCGPA: 9.0, previousCGPA: 8.2, overallAttendance: 85, studyHoursGoal: 4 };
  const doubtsCount = safeHistory.doubtsCount || 0;
  const syllabusProgress = safeHistory.syllabusProgress || {};

  // 1. Core aggregates
  const totalStudyMinutes = sessions.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
  const avgFocus = sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + (s.focusScore || 70), 0) / sessions.length) : 80;
  const quizAccuracy = quizzes.length > 0 ? Math.round((quizzes.reduce((sum, q) => sum + (q.score / q.total), 0) / quizzes.length) * 100) : 82;
  
  const totalClasses = attendance.reduce((sum, a) => sum + (a.total || 0), 0);
  const attendedClasses = attendance.reduce((sum, a) => sum + (a.attended || 0), 0);
  const overallAttendance = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : (Number(goals.overallAttendance) || 85);

  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'Completed').length;
  const assignmentCompletionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 80;

  // Fix: safely define solvedPyqs and dsaSessions
  const solvedPyqs = pyqs.filter(p => (Number(p.score) > 0) || p.completed).length;
  const dsaSessions = sessions.filter(s => s.subjectId === 'ds101' || (s.subject && s.subject.toLowerCase().includes('data structure'))).length;

  // Calculate average syllabus completion
  let totalUnits = 0;
  let completedUnits = 0;
  if (syllabusProgress) {
    Object.values(syllabusProgress).forEach(units => {
      if (units && typeof units === 'object') {
        Object.values(units).forEach(isCompleted => {
          totalUnits += 1;
          if (isCompleted === true) completedUnits += 1;
        });
      }
    });
  }
  const syllabusCoverage = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  // 2. Calculations
  // Focus consistency multiplier
  const studyHoursPerWeek = totalStudyMinutes > 0 ? (totalStudyMinutes / 60) * (7 / 14) : 3.5;
  const consistencyScore = Math.min(100, Math.round((studyHoursPerWeek / (goals.studyHoursGoal || 4)) * 70 + (avgFocus * 0.3)));
  
  // Placement Readiness (Unified Multi-Factor Engine)
  let placementReadiness = 0;
  if (solvedPyqs > 0 || dsaSessions > 0 || quizzes.length > 0 || completedAssignments > 0) {
    const codingBonus = Math.min(45, (solvedPyqs * 8) + (dsaSessions * 6) + (completedAssignments * 5));
    const testBonus = Math.min(35, quizAccuracy > 0 ? Math.round((quizAccuracy / 100) * 25) : (quizzes.length > 0 ? 15 : 0));
    const consistencyBonus = Math.min(20, Math.round(consistencyScore * 0.2));
    placementReadiness = Math.min(100, Math.round(codingBonus + testBonus + consistencyBonus));
  } else {
    const baseVal = Number(goals.previousCGPA) || 8.2;
    placementReadiness = Math.min(92, Math.max(55, Math.round((baseVal * 7.5) + (overallAttendance * 0.15))));
  }

  // Burnout Risk
  const burnoutRisk = Math.min(100, Math.max(10, Math.round((studyHoursPerWeek * 6) - (overallAttendance * 0.15) + 12)));

  // Backlog Risk
  const attendanceDeficit = Math.max(0, 75 - overallAttendance);
  const assignmentDeficit = Math.max(0, 100 - assignmentCompletionRate);
  const backlogRisk = Math.min(100, Math.max(4, Math.round((attendanceDeficit * 2.5) + (assignmentDeficit * 0.3) + ((100 - quizAccuracy) * 0.2))));

  // Subject-wise Passing Probability
  const subjectPassingProbabilities = subjects.map(sub => {
    const subSessions = sessions.filter(s => s.subjectId === sub.id);
    const subQuizzes = quizzes.filter(q => q.subjectId === sub.id);
    const subAttendance = attendance.find(a => a.subjectId === sub.id) || { attended: 0, total: 0 };
    
    const attRate = subAttendance.total > 0 ? (subAttendance.attended / subAttendance.total) : (overallAttendance / 100);
    const sessionCount = subSessions.length;
    const subQuizAcc = subQuizzes.length > 0 ? (subQuizzes.reduce((sum, q) => sum + (q.score / q.total), 0) / subQuizzes.length) : (quizAccuracy / 100);

    let subSyllabusCoverage = 65;
    if (syllabusProgress) {
      const matchedKey = Object.keys(syllabusProgress).find(k => 
        k.toLowerCase().includes(sub.name.toLowerCase()) || 
        sub.name.toLowerCase().includes(k.toLowerCase()) ||
        (sub.id === 'ds101' && k.toLowerCase().includes('structures')) ||
        (sub.id === 'db102' && k.toLowerCase().includes('database')) ||
        (sub.id === 'cn104' && k.toLowerCase().includes('networks'))
      );
      if (matchedKey) {
        const units = syllabusProgress[matchedKey];
        const unitsArr = Object.values(units);
        const completed = unitsArr.filter(u => u === true).length;
        const total = unitsArr.length || 5;
        subSyllabusCoverage = Math.round((completed / total) * 100);
      }
    }

    const prob = Math.min(99, Math.max(68, Math.round((attRate * 35) + (sessionCount * 4) + (subQuizAcc * 35) + (subSyllabusCoverage * 0.2))));
    return {
      subjectId: sub.id,
      name: sub.name,
      code: sub.code,
      probability: prob,
      status: prob > 85 ? 'Safe' : prob > 70 ? 'Moderate' : 'High Risk'
    };
  });

  // Expected CGPA and Semester Percentage
  const baseCGPA = Number(goals.previousCGPA) || 8.2;
  const attDiff = goals.overallAttendance ? (overallAttendance - goals.overallAttendance) : (overallAttendance - 75);
  
  const accuracyMod = quizAccuracy > 0 ? (quizAccuracy - 70) * 0.03 : 0.2; 
  const attMod = overallAttendance > 0 ? attDiff * 0.02 : 0.1;
  const consistencyMod = consistencyScore > 0 ? (consistencyScore - 60) * 0.015 : 0.15;
  const syllabusMod = syllabusCoverage > 0 ? (syllabusCoverage - 50) * 0.01 : 0.1;
  
  const predictedCGPA = Math.min(10.0, Math.max(6.0, Number((baseCGPA + accuracyMod + attMod + consistencyMod + syllabusMod).toFixed(2))));
  const predictedSemesterPercentage = Math.min(100, Math.max(60, Math.round(predictedCGPA * 9.5)));

  return {
    metrics: {
      totalStudyMinutes,
      avgFocus,
      quizAccuracy,
      overallAttendance,
      consistencyScore,
      placementReadiness,
      burnoutRisk,
      backlogRisk,
      predictedCGPA,
      predictedSemesterPercentage
    },
    subjectPassingProbabilities,
    lastUpdated: new Date().toISOString()
  };
}

export async function generateAIPredictions(userId, history) {
  let fallback;
  try {
    fallback = calculateDeterministicTwinPredictions(history);
  } catch (err) {
    console.error("Twin deterministic calculation error:", err);
    fallback = {
      metrics: {
        totalStudyMinutes: 180,
        avgFocus: 80,
        quizAccuracy: 85,
        overallAttendance: 88,
        consistencyScore: 82,
        placementReadiness: 74,
        burnoutRisk: 18,
        backlogRisk: 6,
        predictedCGPA: 8.75,
        predictedSemesterPercentage: 84
      },
      subjectPassingProbabilities: INITIAL_SUBJECTS.map(sub => ({
        subjectId: sub.id,
        name: sub.name,
        code: sub.code,
        probability: 92,
        status: 'Safe'
      })),
      lastUpdated: new Date().toISOString()
    };
  }

  const baseCGPA = history?.goals?.previousCGPA || fallback.metrics.predictedCGPA || 8.2;
  const placementScore = fallback.metrics.placementReadiness || 74;
  const burnoutScore = fallback.metrics.burnoutRisk || 18;
  const attendanceVal = history?.goals?.overallAttendance || fallback.metrics.overallAttendance || 85;

  const enrichedFallback = {
    ...fallback,
    reasoning: {
      cgpa: `Predicted CGPA of ${fallback.metrics.predictedCGPA} is synthesized from baseline GPA (${baseCGPA}), consistency index (${fallback.metrics.consistencyScore}%), and attendance (${attendanceVal}%).`,
      burnout: burnoutScore > 35 ? "Elevated cognitive load detected. Recommended to introduce 15-minute breaks between deep work intervals." : "Workload pacing is balanced with sustainable study habits.",
      placement: `Placement Readiness index is at ${placementScore}%, driven by active problem solving in core engineering subjects and quiz accuracy.`
    },
    recommendations: [
      { priority: 'High', subject: 'Data Structures & Algorithms', task: 'Practice Tree traversals & Dynamic Programming patterns', estTime: '1.5h', expectedIncrease: '+0.15 CGPA' },
      { priority: 'High', subject: 'Database Management Systems', task: 'Revise B+ tree indexing and 3NF normalization proofs', estTime: '1.5h', expectedIncrease: '+0.10 CGPA' },
      { priority: 'Medium', subject: 'System Design & Web', task: 'Simulate microservices caching architecture in placement track', estTime: '1.0h', expectedIncrease: '+3.5% Placement' }
    ],
    risks: [
      { level: attendanceVal < 78 ? 'Medium' : 'Low', type: 'Academic Defense', message: attendanceVal < 78 ? `Overall attendance is ${attendanceVal}%, close to the 75% examination threshold. Maintain regular lecture attendance.` : 'Strong academic trajectory with zero backlog risks detected.' }
    ]
  };

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey.startsWith('gsk_4ZMglidj')) {
    return enrichedFallback;
  }

  try {
    const systemPrompt = `You are Vyomra Future Twin™ Engine. Analyze the student's historical academic data and output a structured analysis.
You MUST output ONLY a valid JSON object matching this structure exactly. No markdown, no ticks.
{
  "predictedCGPA": 8.75,
  "predictedSemesterPercentage": 83.2,
  "burnoutRisk": 24,
  "backlogRisk": 12,
  "placementReadiness": 72,
  "passingProbabilities": [
    { "code": "CS301", "probability": 94, "reasoning": "Explain why" }
  ],
  "reasoning": {
    "cgpa": "Detailed data-driven reason",
    "burnout": "Reasoning for burnout risk",
    "placement": "Why the placement readiness score was assigned"
  },
  "recommendations": [
    { "priority": "High", "subject": "Data Structures", "task": "Practice AVL Trees", "estTime": "1.5h", "expectedIncrease": "+0.15 CGPA" }
  ],
  "risks": [
    { "level": "Medium", "type": "Attendance", "message": "Attendance in CN is 75%, near threshold" }
  ]
}`;

    const userPayload = {
      subjects: history.subjects,
      recentStudySessions: (history.sessions || []).slice(-10),
      quizzes: history.quizzes,
      assignments: history.assignments,
      attendance: history.attendance,
      pyqs: history.pyqs,
      goals: history.goals,
      doubtsSolvedCount: history.doubtsCount,
      syllabusProgress: history.syllabusProgress
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      signal: controller.signal,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Student Data:\n${JSON.stringify(userPayload, null, 2)}` }
        ],
        temperature: 0.1
      })
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("API call failed");

    const resData = await response.json();
    let text = resData.choices[0].message.content;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(text);
    
    return {
      metrics: {
        totalStudyMinutes: fallback.metrics.totalStudyMinutes,
        avgFocus: fallback.metrics.avgFocus,
        quizAccuracy: fallback.metrics.quizAccuracy,
        overallAttendance: fallback.metrics.overallAttendance,
        consistencyScore: fallback.metrics.consistencyScore,
        placementReadiness: parsed.placementReadiness || fallback.metrics.placementReadiness,
        burnoutRisk: parsed.burnoutRisk || fallback.metrics.burnoutRisk,
        backlogRisk: parsed.backlogRisk || fallback.metrics.backlogRisk,
        predictedCGPA: parsed.predictedCGPA || fallback.metrics.predictedCGPA,
        predictedSemesterPercentage: parsed.predictedSemesterPercentage || fallback.metrics.predictedSemesterPercentage
      },
      subjectPassingProbabilities: fallback.subjectPassingProbabilities.map(sub => {
        const aiProb = (parsed.passingProbabilities || []).find(p => p.code === sub.code);
        return {
          ...sub,
          probability: aiProb ? aiProb.probability : sub.probability,
          reasoning: aiProb ? aiProb.reasoning : `Based on attendance of ${sub.probability}% and study hours.`
        };
      }),
      reasoning: parsed.reasoning || enrichedFallback.reasoning,
      recommendations: parsed.recommendations || enrichedFallback.recommendations,
      risks: parsed.risks || enrichedFallback.risks,
      lastUpdated: new Date().toISOString()
    };
  } catch (err) {
    return enrichedFallback;
  }
}
