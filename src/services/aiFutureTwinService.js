import { db } from '../config/firebase';
import { collection, doc, getDocs, setDoc, addDoc, query, where, getDoc } from 'firebase/firestore';
import { supabase } from '../config/supabase';

// Initial Subjects registry
const INITIAL_SUBJECTS = [
  { id: 'ds101', name: 'Data Structures & Algorithms', code: 'CS301', credits: 4, targetMarks: 90 },
  { id: 'db102', name: 'Database Management Systems', code: 'CS302', credits: 3, targetMarks: 85 },
  { id: 'ml103', name: 'Introduction to Machine Learning', code: 'AI301', credits: 4, targetMarks: 88 },
  { id: 'cn104', name: 'Computer Networks', code: 'CS303', credits: 3, targetMarks: 80 }
];

// Save the user's past academic baseline to Supabase
export async function saveAcademicBaseline(userId, data) {
  if (!userId) userId = 'default_user';
  localStorage.setItem(`lumixora_baseline_${userId}`, JSON.stringify(data));

  try {
    const { error } = await supabase.from('student_baselines').upsert({
      user_id: userId,
      cgpa: data.cgpa || 8.0,
      target_cgpa: data.target_cgpa || 9.0,
      attendance: data.attendance || 85,
      semester: data.semester || 'Sem 3',
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    
    if (!error) return true;
  } catch (err) {
    console.warn('Supabase baseline sync warning, writing to Firestore & local storage:', err);
  }

  try {
    const safeDocId = String(userId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const baselineRef = doc(db, 'Users', safeDocId, 'Baselines', 'academic');
    await setDoc(baselineRef, {
      cgpa: Number(data.cgpa) || 0,
      target_cgpa: Number(data.target_cgpa) || 0,
      attendance: Number(data.attendance) || 0,
      semester: data.semester || 'Sem 3',
      updated_at: new Date().toISOString()
    }, { merge: true });
  } catch (fbErr) {
    console.warn('Firestore baseline save warning:', fbErr);
  }

  return true; // Always return true as local storage backup is saved
}

export async function checkAndSeedTwinData(userId) {
  try {
    const userDocRef = doc(db, 'Users', userId);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, { initialized: true, createdAt: new Date().toISOString() });
    }

    const subjectsRef = collection(db, 'Users', userId, 'Subjects');
    const subjectsSnap = await getDocs(subjectsRef);
    
    if (subjectsSnap.empty) {
      console.log('Seeding initial subjects configuration for AI Twin...');
      for (const sub of INITIAL_SUBJECTS) {
        await setDoc(doc(db, 'Users', userId, 'Subjects', sub.id), sub);
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error seeding twin configuration:', err);
    return false;
  }
}

export async function fetchFullStudentHistory(userId) {
  try {
    // 1. Fetch from Firestore configuration
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
      getDocs(collection(db, 'Users', userId, 'Subjects')),
      getDocs(collection(db, 'Users', userId, 'StudySessions')),
      getDocs(collection(db, 'Users', userId, 'QuizResults')),
      getDocs(collection(db, 'Users', userId, 'PYQAttempts')),
      getDocs(collection(db, 'Users', userId, 'Assignments')),
      getDocs(collection(db, 'Users', userId, 'Attendance')),
      getDocs(collection(db, 'Users', userId, 'NotesRead')),
      getDocs(collection(db, 'Users', userId, 'Goals'))
    ]);

    const subjects = subjectsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    let sessions = firestoreSessionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    let quizzes = firestoreQuizzesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    let pyqs = firestorePyqsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    let assignments = firestoreAssignmentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const attendance = attendanceSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const notesRead = notesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const goals = goalsSnap.docs.map(d => ({ id: d.id, ...d.data() }))[0] || { targetCGPA: 9.0, studyHoursGoal: 4 };

    // No local storage merging for study sessions or coding submissions - rely entirely on Firestore and Supabase
    // 4. Query Real Tasks from Supabase Database
    try {
      const { data: supabaseTasks, error: taskErr } = await supabase.from('tasks').select('*');
      if (!taskErr && supabaseTasks) {
        const mappedTasks = supabaseTasks.map(t => ({
          id: t.id,
          subjectId: 'ds101', // default subject
          title: t.title,
          dueDate: t.dueDate || '',
          status: t.status === 'Done' ? 'Completed' : 'Pending'
        }));
        assignments = [...assignments, ...mappedTasks];
      }
    } catch (e) {
      console.warn("Failed to query tasks from Supabase:", e);
    }

    // 5. Query Doubts solved counts from Supabase to influence recommendations
    let doubtsCount = 0;
    try {
      const { data: supabaseDoubts, error: doubtErr } = await supabase.from('doubts').select('*');
      if (!doubtErr && supabaseDoubts) {
        doubtsCount = supabaseDoubts.length;
      }
    } catch (e) {
      console.warn("Failed to query doubts:", e);
    }

    // No local storage merging for attendance, quizzes or syllabus - rely entirely on databases
    // 9. Fetch baseline from both Supabase and Firestore (Cloud Databases) and merge
    let mergedGoals = { targetCGPA: 0, previousCGPA: 0, overallAttendance: 0, studyHoursGoal: 4 };
    try {
      let sbBaseline = null;
      try {
        const { data: baselineData, error: baseErr } = await supabase
          .from('student_baselines')
          .select('*')
          .eq('user_id', userId)
          .single();
        if (!baseErr && baselineData) sbBaseline = baselineData;
      } catch (e) { console.warn("Fallback fetch failed", e); }

      let fbBaseline = null;
      try {
        const baselineRef = doc(db, 'Users', userId, 'Baselines', 'academic');
        const baselineSnap = await getDoc(baselineRef);
        if (baselineSnap.exists()) {
          fbBaseline = baselineSnap.data();
        }
      } catch (e) { console.warn("Fallback fetch failed", e); }

      // Prefer Firestore (since fallback writes go there) or the one with actual non-zero data
      const bestBaseline = (fbBaseline && fbBaseline.cgpa > 0) ? fbBaseline : (sbBaseline || fbBaseline);
      
      if (bestBaseline) {
        mergedGoals.targetCGPA = Number(bestBaseline.target_cgpa) || 0;
        mergedGoals.previousCGPA = Number(bestBaseline.cgpa) || 0;
        mergedGoals.overallAttendance = Number(bestBaseline.attendance) || 0;
      }
    } catch (e) {
      console.warn("Failed to fetch baselines:", e);
    }

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
    console.error('Error fetching student history:', err);
    return null;
  }
}

// Generate prediction weights and details deterministically as a fallback or hybrid base
export function calculateDeterministicTwinPredictions(history) {
  const { subjects, sessions, quizzes, pyqs, assignments, attendance, notesRead, goals, doubtsCount = 0, syllabusProgress = {} } = history;

  // 1. Core aggregates
  const totalStudyMinutes = sessions.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
  const avgFocus = sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + (s.focusScore || 70), 0) / sessions.length) : 0;
  const quizAccuracy = quizzes.length > 0 ? Math.round((quizzes.reduce((sum, q) => sum + (q.score / q.total), 0) / quizzes.length) * 100) : 0;
  
  const totalClasses = attendance.reduce((sum, a) => sum + (a.total || 0), 0);
  const attendedClasses = attendance.reduce((sum, a) => sum + (a.attended || 0), 0);
  const overallAttendance = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'Completed').length;
  const assignmentCompletionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

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
  const studyHoursPerWeek = (totalStudyMinutes / 60) * (7 / 14); // relative to 2 weeks
  const consistencyScore = Math.min(100, Math.round((studyHoursPerWeek / (goals.studyHoursGoal || 4)) * 70 + (avgFocus * 0.3)));
  
  // Placement Readiness
  // Based on coding questions (PYQs solved + DSA sessions)
  const dsaSessions = sessions.filter(s => s.subjectId === 'ds101').length;
  const solvedPyqs = pyqs.filter(p => p.status === 'Solved').length;
  const placementReadiness = Math.min(100, Math.round((solvedPyqs * 15) + (dsaSessions * 8) + (quizAccuracy * 0.2)));

  // Burnout Risk
  // High study hours + high focus score - low sleep / notes ratio
  const burnoutRisk = Math.min(100, Math.max(10, Math.round((studyHoursPerWeek * 8) - (overallAttendance * 0.2))));

  // Backlog Risk
  // Low attendance + low assignments completed + low quiz accuracy
  const attendanceDeficit = Math.max(0, 75 - overallAttendance);
  const assignmentDeficit = Math.max(0, 100 - assignmentCompletionRate);
  const backlogRisk = Math.min(100, Math.round((attendanceDeficit * 2.5) + (assignmentDeficit * 0.5) + (100 - quizAccuracy) * 0.3));

  // Subject-wise Passing Probability
  const subjectPassingProbabilities = subjects.map(sub => {
    const subSessions = sessions.filter(s => s.subjectId === sub.id);
    const subQuizzes = quizzes.filter(q => q.subjectId === sub.id);
    const subAttendance = attendance.find(a => a.subjectId === sub.id) || { attended: 0, total: 0 };
    
    const attRate = subAttendance.total > 0 ? (subAttendance.attended / subAttendance.total) : 0;
    const sessionCount = subSessions.length;
    const subQuizAcc = subQuizzes.length > 0 ? (subQuizzes.reduce((sum, q) => sum + (q.score / q.total), 0) / subQuizzes.length) : 0;

    // Retrieve syllabus coverage for this specific subject
    let subSyllabusCoverage = 0;
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

    const prob = Math.min(99, Math.max(0, Math.round((attRate * 35) + (sessionCount * 5) + (subQuizAcc * 35) + (subSyllabusCoverage * 0.25))));
    return {
      subjectId: sub.id,
      name: sub.name,
      code: sub.code,
      probability: prob,
      status: prob > 85 ? 'Safe' : prob > 70 ? 'Moderate' : 'High Risk'
    };
  });

  // Expected CGPA and Semester Percentage
  // CGPA baseline uses dynamic user baseline if available, otherwise 0
  const baseCGPA = goals.previousCGPA || 0;
  const attDiff = goals.overallAttendance ? (overallAttendance - goals.overallAttendance) : (overallAttendance - 75);
  
  const accuracyMod = quizAccuracy > 0 ? (quizAccuracy - 70) * 0.03 : 0; 
  const attMod = overallAttendance > 0 ? attDiff * 0.02 : 0;
  const consistencyMod = consistencyScore > 0 ? (consistencyScore - 60) * 0.015 : 0;
  const syllabusMod = syllabusCoverage > 0 ? (syllabusCoverage - 50) * 0.01 : 0;
  
  let predictedCGPA = 0;
  if (baseCGPA > 0 || totalStudyMinutes > 0 || totalClasses > 0 || quizzes.length > 0 || pyqs.length > 0) {
    predictedCGPA = Math.min(10.0, Math.max(0.0, Number((baseCGPA + accuracyMod + attMod + consistencyMod + syllabusMod).toFixed(2))));
  }
  
  const predictedSemesterPercentage = predictedCGPA > 0 ? Math.min(100, Math.max(0, Math.round(predictedCGPA * 9.5))) : 0;

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
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const fallback = calculateDeterministicTwinPredictions(history);

  if (!apiKey) {
    console.warn("No Groq API Key, utilizing high-fidelity deterministic calculations.");
    return fallback;
  }

  try {
    const systemPrompt = `You are Lumixora Future Twin™ Engine. Analyze the student's historical academic data and output a structured analysis.
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
      recentStudySessions: history.sessions.slice(-10),
      quizzes: history.quizzes,
      assignments: history.assignments,
      attendance: history.attendance,
      pyqs: history.pyqs,
      goals: history.goals,
      doubtsSolvedCount: history.doubtsCount,
      syllabusProgress: history.syllabusProgress
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
      reasoning: parsed.reasoning || {
        cgpa: "Calculated based on study regularity, focus metrics, and quiz scores.",
        burnout: "Balanced workload with moderate daily study hours.",
        placement: "Strong performance in coding quizzes & concepts."
      },
      recommendations: parsed.recommendations || [
        { priority: 'High', subject: 'DBMS', task: 'Revise Unit 3 normalizations', estTime: '1.5h', expectedIncrease: '+0.1 CGPA' },
        { priority: 'Medium', subject: 'DSA', task: 'Complete PYQ Set 2', estTime: '2h', expectedIncrease: '+0.08 CGPA' }
      ],
      risks: parsed.risks || [
        { level: 'Low', type: 'Workload', message: 'Steady progress. Keep reviewing weekly.' }
      ],
      lastUpdated: new Date().toISOString()
    };
  } catch (err) {
    console.error("AI twin generation error, using fallback:", err);
    return fallback;
  }
}
