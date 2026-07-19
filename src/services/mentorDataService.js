// Real-Time Student Data Fetcher Service for Lumixora Intelligent Mentor
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// ─── Default Feed Databases ──────────────────────────────────────────────────

export const DEFAULT_ANNOUNCEMENTS = [
  { id: 'ann-1', date: 'July 12, 2026', title: 'Mid-Semester Lab Examinations', content: 'External viva dates and schedules for 3rd Year CSE labs have been released. Vivas start on July 20, 2026.' },
  { id: 'ann-2', date: 'July 15, 2026', title: 'TCS Campus Recruitment 2026', content: 'TCS recruitment registration portal is now active for final/pre-final year. Eligible branches: CSE, ECE, EEE. CGPA cut-off: 7.0.' },
  { id: 'ann-3', date: 'July 18, 2026', title: 'Google STEP Internship Program', content: 'STEP internship applications for 2027 grads are now open. Technical interviews will focus heavily on Data Structures and Algorithms.' },
  { id: 'ann-4', date: 'July 24, 2026', title: 'AI/ML Guest Lecture by Industry Experts', content: 'Join the guest lecture on "Large Language Models & Transformers" on July 28, 2026, at 2:00 PM in Seminar Hall-II.' }
];

export const DEFAULT_PLACEMENTS = [
  { id: 'place-1', company: 'TCS Ninja & Digital', role: 'System Engineer / Digital Developer', ctc: '3.6 LPA - 7.0 LPA', deadline: '2026-07-25', eligibility: 'CGPA > 7.0, No active backlogs', status: 'Registering' },
  { id: 'place-2', company: 'Accenture ASE', role: 'Associate Software Engineer', ctc: '4.5 LPA', deadline: '2026-08-05', eligibility: 'CGPA > 6.5, CSE/ECE/EEE', status: 'Upcoming' },
  { id: 'place-3', company: 'Cognizant GenC Pro', role: 'Software Engineer Specialist', ctc: '5.4 LPA', deadline: '2026-08-12', eligibility: 'CGPA > 6.0, All B.Tech branches', status: 'Upcoming' }
];

export const DEFAULT_INTERNSHIPS = [
  { id: 'int-1', company: 'Google India', role: 'Software Engineering Intern', stipend: '₹50,000 / month', duration: '2 Months (Summer)', deadline: '2026-07-28', status: 'Open' },
  { id: 'int-2', company: 'Microsoft India', role: 'SDE Intern', stipend: '₹80,000 / month', duration: '3 Months', deadline: '2026-08-10', status: 'Open' },
  { id: 'int-3', company: 'Nexora Solutions', role: 'Frontend React Intern', stipend: '₹15,000 / month', duration: '6 Months (Remote)', deadline: '2026-07-20', status: 'Registering' }
];

export const DEFAULT_SCHOLARSHIPS = [
  { id: 'schol-1', name: 'Reliance Foundation Scholarship', grant: 'Up to ₹2,00,000', deadline: '2026-08-31', eligibility: 'Undergrad students with family income < ₹15 LPA', status: 'Active' },
  { id: 'schol-2', name: 'JNTUA Merit-cum-Means Grant', grant: 'Full Tuition Fee Waiver', deadline: '2026-07-30', eligibility: 'CGPA > 8.0, JNTUA affiliated colleges', status: 'Registering' },
  { id: 'schol-3', name: 'Siemens Scholarship Program', grant: 'Full tuition fee + laptop allowance', deadline: '2026-08-15', eligibility: 'First-year engineering students from economically weak sections', status: 'Active' }
];

export const PYQ_DATABASE = {
  'Computer Networks': [
    { year: 'Nov 2025', question: 'Explain TCP congestion control mechanism with congestion window size graph.', marks: 10 },
    { year: 'June 2025', question: 'Compare distance vector routing with link state routing. Explain Dijkstra\'s routing steps.', marks: 12 },
    { year: 'Dec 2024', question: 'What is subnetting? Divide network 192.168.1.0/24 into 4 subnets and find range.', marks: 8 },
    { year: 'June 2024', question: 'Explain the working of DNS protocol and trace recursive vs iterative queries.', marks: 10 }
  ],
  'Data Structures': [
    { year: 'June 2025', question: 'Write a C++/Java program to reverse a Singly Linked List without using extra memory.', marks: 10 },
    { year: 'Nov 2024', question: 'Construct AVL Tree for keys: 10, 20, 30, 40, 50, 25. Explain rotations applied.', marks: 12 },
    { year: 'Dec 2024', question: 'Differentiate between BFS and DFS. Write algorithms and state their complexity.', marks: 8 }
  ],
  'Database Systems': [
    { year: 'Dec 2025', question: 'What is normalization? Explain 1NF, 2NF, 3NF and BCNF with a functional dependency example.', marks: 12 },
    { year: 'Nov 2025', question: 'Write SQL queries for: (a) 2nd highest salary, (b) duplicate rows deletion, (c) self joins.', marks: 10 },
    { year: 'June 2024', question: 'State ACID properties of transactions. Explain serializability vs recoverability.', marks: 8 }
  ],
  'Design and Analysis of Algorithms': [
    { year: 'Dec 2025', question: 'Solve 0/1 Knapsack problem using dynamic programming (DP table method).', marks: 12 },
    { year: 'June 2025', question: 'Explain N-Queens backtracking algorithm. Draw state space tree for 4-Queens.', marks: 10 },
    { year: 'Nov 2024', question: 'Discuss master theorem for solving recurrence relations. Solve T(n) = 2T(n/2) + n.', marks: 8 }
  ]
};

// ─── Default Syllabus Outline ────────────────────────────────────────────────

export const DEFAULT_SYLLABUS = {
  'Computer Networks': [
    { unit: 'Unit 1', name: 'Physical Layer & Models', topics: 'OSI Model, TCP/IP Suite, Transmission Media, Line Coding' },
    { unit: 'Unit 2', name: 'Data Link Layer', topics: 'Framing, Error Detection/Correction, Flow Control, Sliding Window Protocols' },
    { unit: 'Unit 3', name: 'Network Layer', topics: 'IPv4/IPv6 Addressing, Subnetting, Routing Algorithms (Dijkstra, Distance Vector)' },
    { unit: 'Unit 4', name: 'Transport Layer', topics: 'TCP vs UDP, Connection Establishment, Congestion Control, Quality of Service' },
    { unit: 'Unit 5', name: 'Application Layer', topics: 'DNS, HTTP, SMTP, FTP, Network Security Essentials' }
  ],
  'Database Systems': [
    { unit: 'Unit 1', name: 'Introduction & ER Model', topics: 'DBMS Architecture, Schema, ER Diagram, Keys, Generalization/Specialization' },
    { unit: 'Unit 2', name: 'Relational Model & SQL', topics: 'Relational Algebra, SQL Queries, Joins, Triggers, Views' },
    { unit: 'Unit 3', name: 'Normalization', topics: 'Functional Dependencies, 1NF, 2NF, 3NF, BCNF, Multi-valued Dependencies' },
    { unit: 'Unit 4', name: 'Transactions & Concurrency', topics: 'ACID Properties, Serializability, Concurrency Control (Two-Phase Locking)' },
    { unit: 'Unit 5', name: 'Storage & Indexing', topics: 'B-Trees, B+ Trees, Hashing, Query Processing & Optimization' }
  ],
  'Data Structures': [
    { unit: 'Unit 1', name: 'Arrays & Recursion', topics: 'Sparse Matrices, Time Complexity Analysis, Recursion, Stack Overflow' },
    { unit: 'Unit 2', name: 'Stacks & Queues', topics: 'Linked Lists implementation, Double Linked Lists, Circular Queues, Deque' },
    { unit: 'Unit 3', name: 'Trees', topics: 'Binary Search Trees, AVL Trees, Threaded Binary Trees, Tree Traversals' },
    { unit: 'Unit 4', name: 'Graphs', topics: 'Adjacency Matrix/List, BFS, DFS, MST (Prim, Kruskal), Shortest Path (Dijkstra)' },
    { unit: 'Unit 5', name: 'Sorting & Hashing', topics: 'QuickSort, MergeSort, Collision Resolution, Chaining, Open Addressing' }
  ],
  'Design and Analysis of Algorithms': [
    { unit: 'Unit 1', name: 'Introduction & Divide & Conquer', topics: 'Asymptotic Notations, Recurrence Relations, Binary Search, Merge/Quick Analysis' },
    { unit: 'Unit 2', name: 'Greedy Method', topics: 'Fractional Knapsack, Huffman Codes, Job Sequencing, Prim/Kruskal MST' },
    { unit: 'Unit 3', name: 'Dynamic Programming', topics: '0/1 Knapsack, Matrix Chain Multiplication, Floyd-Warshall, TSP' },
    { unit: 'Unit 4', name: 'Backtracking & Branch & Bound', topics: 'N-Queens, Graph Coloring, Hamiltonian Cycle, LC Branch & Bound' },
    { unit: 'Unit 5', name: 'NP-Hard & NP-Complete', topics: 'P vs NP class, Cook\'s Theorem, Vertex Cover, Approximation Algorithms' }
  ]
};

// ─── Data Retrieve Functions ─────────────────────────────────────────────────

/**
 * Get comprehensive, real-time snapshot of the student's metrics.
 */
export function getLiveMentorData(userId, supabaseTasks = [], supabaseNotes = [], supabaseDoubts = [], userDoc = null) {
  const profileKey = `lumixora_mentor_profile_${userId}`;
  const goalsKey = `lumixora_mentor_goals_${userId}`;
  const timetableKey = 'lumixora_timetable';
  const examDateKey = 'lumixora_targetExamDate';
  const analyticsKey = `lumixora_study_analytics_${userId}`;
  const sessionsKey = `lumixora_study_sessions_${userId}`;
  const submissionsKey = `lumixora_submissions_${userId}`;
  const quizScoresKey = `lumixora_quiz_scores_${userId}`;
  const attendanceKey = `lumixora_attendance_${userId}`;
  const syllabusKey = `lumixora_syllabus_completion_${userId}`;
  const calendarKey = `lumixora_calendar_events_${userId}`;

  // 1. Fetch Profile
  let profile = {
    name: 'Scholar',
    college: 'G. Pulla Reddy Engineering College',
    department: 'Computer Science & Engineering',
    year: '3rd Year / 6th Semester',
    university: 'JNTUA',
    subjects: 'Data Structures, Design and Analysis of Algorithms, Database Systems, Computer Networks',
    learningStyle: 'Practical',
    dailyHours: '4',
    targetCGPA: '9.0',
    careerGoal: 'Placement',
    preferredTime: 'Night Owl (9 PM - 12 AM)',
    weakSubjects: 'Computer Networks',
    strongSubjects: 'Data Structures, Algorithms'
  };

  try {
    const saved = localStorage.getItem(profileKey);
    if (saved) profile = { ...profile, ...JSON.parse(saved) };
  } catch (e) {}

  if (userDoc) {
    profile = { ...profile, ...userDoc };
  }

  // 2. Fetch Goals
  let studyGoals = [];
  try {
    const saved = localStorage.getItem(goalsKey);
    if (saved) studyGoals = JSON.parse(saved);
  } catch (e) {}

  // 3. Fetch Timetable
  let timetable = [];
  try {
    const saved = localStorage.getItem(timetableKey);
    if (saved) timetable = JSON.parse(saved);
  } catch (e) {}

  // 4. Fetch Target Exam Date
  const targetExamDate = localStorage.getItem(examDateKey) || null;

  // 5. Fetch Study Analytics
  let analytics = {
    totalSessions: 0,
    totalMinutes: 0,
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    avgFocusScore: 0,
    daily: {},
    weekly: {},
    subjects: {}
  };
  try {
    const saved = localStorage.getItem(analyticsKey);
    if (saved) analytics = { ...analytics, ...JSON.parse(saved) };
  } catch (e) {}

  if (userDoc) {
    if (userDoc.studyAnalytics) {
      analytics = { ...analytics, ...userDoc.studyAnalytics };
    }
    if (userDoc.streak !== undefined) analytics.currentStreak = userDoc.streak;
    if (userDoc.longestStreak !== undefined) analytics.longestStreak = userDoc.longestStreak;
    if (userDoc.studyHours !== undefined) analytics.totalMinutes = Math.round(userDoc.studyHours * 60);
  }

  // 6. Fetch Study Sessions
  let studySessions = [];
  try {
    const saved = localStorage.getItem(sessionsKey);
    if (saved) studySessions = JSON.parse(saved);
  } catch (e) {}

  if (userDoc && userDoc.studySessions) {
    studySessions = userDoc.studySessions;
  }

  // 7. Fetch Coding Submissions
  let codingSubmissions = [];
  try {
    const saved = localStorage.getItem(submissionsKey);
    if (saved) codingSubmissions = JSON.parse(saved);
  } catch (e) {}

  // 8. Fetch Quiz Scores
  let quizScores = [];
  try {
    const saved = localStorage.getItem(quizScoresKey);
    if (saved) quizScores = JSON.parse(saved);
  } catch (e) {}

  // 9. Fetch Attendance
  // Parse JNTUA core courses from profile or use default subjects
  const subjectList = profile.subjects ? profile.subjects.split(',').map(s => s.trim()) : [];
  let attendance = {};
  subjectList.forEach(sub => {
    // Default initial attendance: 0 attended, 0 total
    attendance[sub] = { attended: 0, total: 0 };
  });
  try {
    const saved = localStorage.getItem(attendanceKey);
    if (saved) attendance = { ...attendance, ...JSON.parse(saved) };
  } catch (e) {}

  if (userDoc && userDoc.attendance) {
    attendance = { ...attendance, ...userDoc.attendance };
  }

  // 10. Fetch Syllabus Completion
  let syllabusProgress = {};
  subjectList.forEach(sub => {
    // Default initial chapters checklist (Unit 1 to 5) all false
    syllabusProgress[sub] = {
      'Unit 1': false,
      'Unit 2': false,
      'Unit 3': false,
      'Unit 4': false,
      'Unit 5': false
    };
  });
  try {
    const saved = localStorage.getItem(syllabusKey);
    if (saved) syllabusProgress = { ...syllabusProgress, ...JSON.parse(saved) };
  } catch (e) {}

  // 11. Fetch Calendar Events
  let calendarEvents = [
    { id: 'ev-1', title: 'Mid-term Lab Internal Viva', date: '2026-07-20', category: 'Viva' },
    { id: 'ev-2', title: 'TCS Placement Registration Deadline', date: '2026-07-25', category: 'Deadline' }
  ];
  if (targetExamDate) {
    calendarEvents.push({ id: 'ev-exam', title: 'Semester Final Examinations', date: targetExamDate, category: 'Exam' });
  }
  try {
    const saved = localStorage.getItem(calendarKey);
    if (saved) calendarEvents = JSON.parse(saved);
  } catch (e) {}

  // 12. Fetch PYQs for these subjects
  const pyqs = {};
  subjectList.forEach(sub => {
    pyqs[sub] = PYQ_DATABASE[sub] || PYQ_DATABASE['Data Structures'] || [];
  });

  // 13. Fetch Syllabus Detail Info
  const syllabusDetails = {};
  subjectList.forEach(sub => {
    syllabusDetails[sub] = DEFAULT_SYLLABUS[sub] || DEFAULT_SYLLABUS['Data Structures'] || [];
  });

  // Calculate composite metrics in real time
  const totalCompletedTasks = supabaseTasks.filter(t => t.status === 'Completed' || t.status === 'Done').length;
  const totalTasksCount = supabaseTasks.length;
  const taskProgressPct = totalTasksCount > 0 ? Math.round((totalCompletedTasks / totalTasksCount) * 100) : 0;

  // Real-time Attendance Average
  let totalAttended = 0;
  let totalClasses = 0;
  Object.values(attendance).forEach(val => {
    totalAttended += val.attended;
    totalClasses += val.total;
  });
  const avgAttendanceRate = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  // Real-time Syllabus Completion Average
  let totalChapters = 0;
  let completedChapters = 0;
  Object.values(syllabusProgress).forEach(units => {
    Object.values(units).forEach(isCompleted => {
      totalChapters += 1;
      if (isCompleted) completedChapters += 1;
    });
  });
  const avgSyllabusProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  // Average Quiz Marks
  const avgQuizScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, b) => a + b.score, 0) / quizScores.length)
    : 0;

  // Real-time composite readiness score
  // syllabusCoverage (30%), papersSolved (20%), quizScore (20%), tasksProgress (15%), studyConsistency (15%)
  const papersSolvedCount = (supabaseNotes || []).filter(n => n.title && (n.title.toLowerCase().includes('pyq') || n.title.toLowerCase().includes('paper') || n.title.toLowerCase().includes('previous'))).length;
  const streak = analytics.currentStreak || userDoc?.streak || 0;
  const consistencyScore = Math.min(100, (streak * 12) + (analytics.totalSessions * 5));
  const compositeReadiness = Math.round(
    (avgSyllabusProgress * 0.3) +
    (Math.min(papersSolvedCount * 15, 100) * 0.2) +
    (avgQuizScore * 0.2) +
    (taskProgressPct * 0.15) +
    (consistencyScore * 0.15)
  );

  return {
    profile,
    studyGoals,
    timetable,
    targetExamDate,
    analytics,
    studySessions,
    codingSubmissions,
    quizScores,
    attendance,
    syllabusProgress,
    syllabusDetails,
    calendarEvents,
    pyqs,
    collegeAnnouncements: DEFAULT_ANNOUNCEMENTS,
    placements: DEFAULT_PLACEMENTS,
    internships: DEFAULT_INTERNSHIPS,
    scholarships: DEFAULT_SCHOLARSHIPS,
    notesCount: supabaseNotes.length,
    uploadedPDFsCount: supabaseNotes.filter(n => n.type === 'Uploaded File').length,
    doubtsCount: supabaseDoubts.length,
    resolvedDoubtsCount: supabaseDoubts.filter(d => d.status === 'Resolved').length,
    metrics: {
      taskProgressPct,
      avgAttendanceRate,
      avgSyllabusProgress,
      avgQuizScore,
      papersSolvedCount,
      compositeReadiness,
      streak: analytics.currentStreak || userDoc?.streak || 0
    }
  };
}

// ─── Data Save Helper Functions ──────────────────────────────────────────────

export async function saveSyllabusCompletion(userId, syllabusData) {
  localStorage.setItem(`lumixora_syllabus_completion_${userId}`, JSON.stringify(syllabusData));
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { syllabusProgress: syllabusData });
  } catch (e) {
    console.warn("Firestore sync error for syllabus:", e);
  }
}

export async function saveAttendance(userId, attendanceData) {
  localStorage.setItem(`lumixora_attendance_${userId}`, JSON.stringify(attendanceData));
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { attendance: attendanceData });
  } catch (e) {
    console.warn("Firestore sync error for attendance:", e);
  }
}

export function saveCalendarEvents(userId, eventsData) {
  localStorage.setItem(`lumixora_calendar_events_${userId}`, JSON.stringify(eventsData));
}

export function saveQuizScore(userId, quizScoreData) {
  const key = `lumixora_quiz_scores_${userId}`;
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push({ ...quizScoreData, timestamp: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(existing));
}
