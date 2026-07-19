/**
 * Harvesting and aggregation engine for Lumixora AI Academic Twin™
 */

export function harvestStudentIntelligence(userId, tasks = [], timetable = []) {
  // 1. Profile metadata
  let profile = {
    name: 'Student',
    college: 'G. Pulla Reddy Engineering College',
    department: 'Computer Science & Engineering',
    year: '3rd Year / 6th Semester',
    university: 'JNTUA',
    learningStyle: 'Practical',
    dailyHours: '4',
    targetCGPA: '9.0',
    careerGoal: 'Placement',
    weakSubjects: 'Computer Networks',
    strongSubjects: 'Data Structures, Algorithms'
  };

  const savedProfile = localStorage.getItem(`lumixora_mentor_profile_${userId}`);
  if (savedProfile) {
    try {
      profile = { ...profile, ...JSON.parse(savedProfile) };
    } catch (e) {}
  }

  // 2. Study Session Analytics (Focus tracking)
  let studyAnalytics = {
    totalSessions: 0,
    totalMinutes: 0,
    totalXP: 0,
    avgFocusScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    subjects: {}
  };

  const savedAnalytics = localStorage.getItem(`lumixora_study_analytics_${userId}`);
  if (savedAnalytics) {
    try {
      studyAnalytics = { ...studyAnalytics, ...JSON.parse(savedAnalytics) };
    } catch (e) {}
  }

  // 3. Task Performance metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done' || t.completed === true).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 4. Timetable stats
  const totalClasses = timetable.length;
  const missedClasses = timetable.filter(c => c.status === 'missed').length;
  const attendanceRate = totalClasses > 0 ? Math.round(((totalClasses - missedClasses) / totalClasses) * 100) : 100;

  // 5. Composite Student Intelligence / Synergy Score
  // Weighted: Streak (15%), Task Rate (35%), Avg Focus Score (35%), Attendance (15%)
  const streakWeight = Math.min((studyAnalytics.currentStreak || 0) * 10, 15); // max 15% for 1.5 week streak
  const taskWeight = taskCompletionRate * 0.35;
  const focusWeight = (studyAnalytics.avgFocusScore || 70) * 0.35;
  const attendanceWeight = attendanceRate * 0.15;
  
  const synergyScore = Math.max(10, Math.min(100, Math.round(streakWeight + taskWeight + focusWeight + attendanceWeight)));

  // Calculate learning productivity metrics
  const productivityScore = Math.round(
    Math.min(((studyAnalytics.totalMinutes || 0) / ((Number(profile.dailyHours) || 4) * 60 * 7)) * 100, 100)
  ) || 0; // Productivity score relative to target hours per week

  return {
    profile,
    studyAnalytics,
    tasksStats: {
      total: totalTasks,
      completed: completedTasks,
      completionRate: taskCompletionRate
    },
    attendance: {
      total: totalClasses,
      missed: missedClasses,
      rate: attendanceRate
    },
    metrics: {
      synergyScore,
      productivityScore,
      consistencyScore: Math.round(Math.min(100, ((studyAnalytics.totalSessions || 0) > 0 ? 60 : 0) + ((studyAnalytics.currentStreak || 0) * 8))),
      focusScore: studyAnalytics.avgFocusScore || 75
    }
  };
}
