import { supabase } from '../config/supabase';

/**
 * Supabase Unified Activity & Data Sync Service
 * Stores all student coding submissions, problems solved, scores, 
 * mock interviews, academics, and portal telemetry into Supabase.
 */

// Helper to safely parse packed JSON metadata in Supabase users table
function parseUserPackedMeta(rawName) {
  if (!rawName) return {};
  if (typeof rawName !== 'string') return {};
  if (rawName.includes('{')) {
    try {
      const jsonStr = rawName.slice(rawName.indexOf('{'));
      return JSON.parse(jsonStr) || {};
    } catch (e) {
      return {};
    }
  }
  return {};
}

// Helper to pack metadata into Supabase user record
function packUserMeta(baseName, meta) {
  const cleanBase = (baseName || 'Scholar').split('{')[0].trim() || 'Scholar';
  return `${cleanBase} ${JSON.stringify(meta)}`;
}

/**
 * 1. Save Coding Problem Submission & Solved State to Supabase
 */
export async function saveCodingSubmissionToSupabase(user, submission) {
  if (!user || (!user.id && !user.email)) return null;

  try {
    const uEmail = (user.email || '').toLowerCase().trim();
    const uId = user.id || user.uid;

    // Fetch latest user data from Supabase
    let query = supabase.from('users').select('*');
    if (uId) query = query.eq('id', uId);
    else query = query.eq('email', uEmail);

    const { data: dbUser } = await query.maybeSingle();

    let meta = {};
    let baseName = user.name || 'Scholar';

    if (dbUser) {
      baseName = dbUser.name ? dbUser.name.split('{')[0].trim() : (user.name || 'Scholar');
      meta = parseUserPackedMeta(dbUser.name);
    }

    // Update submissions & solved array
    const existingSubs = Array.isArray(meta.submissions) ? meta.submissions : [];
    const updatedSubs = [
      {
        id: submission.id || Date.now(),
        problemId: submission.problemId,
        problemTitle: submission.problemTitle || submission.title,
        language: submission.language,
        status: submission.status,
        runtime: submission.runtime,
        memory: submission.memory,
        timestamp: submission.timestamp || new Date().toISOString()
      },
      ...existingSubs.slice(0, 49) // Keep last 50 submissions in JSON
    ];

    const existingSolved = Array.isArray(meta.solvedProblems) ? meta.solvedProblems : [];
    if (submission.status === 'Accepted' && !existingSolved.includes(submission.problemId)) {
      existingSolved.push(submission.problemId);
    }

    // Update packed metadata
    meta.submissions = updatedSubs;
    meta.solvedProblems = existingSolved;
    meta.solvedCount = existingSolved.length;
    meta.lastCodingActivity = new Date().toISOString();

    const newPackedName = packUserMeta(baseName, meta);

    // Persist to Supabase users table
    if (uId) {
      await supabase.from('users').update({ name: newPackedName }).eq('id', uId);
    } else {
      await supabase.from('users').update({ name: newPackedName }).eq('email', uEmail);
    }

    // Also update local cache for instantaneous UI responsiveness
    try {
      localStorage.setItem(`lumixora_submissions_${uId}`, JSON.stringify(updatedSubs));
      localStorage.setItem(`lumixora_solved_${uId}`, JSON.stringify(existingSolved));
    } catch (e) {}

    return { success: true, solvedCount: existingSolved.length };
  } catch (err) {
    console.warn('Supabase coding submission sync notice:', err);
    return null;
  }
}

/**
 * 2. Save Mock Placement Interview Scorecard to Supabase
 */
export async function saveMockInterviewScorecardToSupabase(user, scorecard, company, role) {
  if (!user || (!user.id && !user.email)) return null;

  try {
    const uEmail = (user.email || '').toLowerCase().trim();
    const uId = user.id || user.uid;

    let query = supabase.from('users').select('*');
    if (uId) query = query.eq('id', uId);
    else query = query.eq('email', uEmail);

    const { data: dbUser } = await query.maybeSingle();
    let meta = {};
    let baseName = user.name || 'Scholar';

    if (dbUser) {
      baseName = dbUser.name ? dbUser.name.split('{')[0].trim() : (user.name || 'Scholar');
      meta = parseUserPackedMeta(dbUser.name);
    }

    const existingInterviews = Array.isArray(meta.mockInterviews) ? meta.mockInterviews : [];
    const interviewRecord = {
      id: Date.now(),
      company: company?.name || 'Tech Company',
      role: role?.name || 'Software Engineer',
      overallScore: scorecard.overallScore,
      technicalScore: scorecard.technicalAccuracy,
      communicationScore: scorecard.communicationScore,
      verdict: scorecard.verdict,
      timestamp: new Date().toISOString()
    };

    meta.mockInterviews = [interviewRecord, ...existingInterviews.slice(0, 19)];
    meta.lastInterviewScore = scorecard.overallScore;

    const newPackedName = packUserMeta(baseName, meta);

    if (uId) {
      await supabase.from('users').update({ name: newPackedName }).eq('id', uId);
    } else {
      await supabase.from('users').update({ name: newPackedName }).eq('email', uEmail);
    }

    return { success: true };
  } catch (err) {
    console.warn('Supabase interview scorecard sync notice:', err);
    return null;
  }
}

/**
 * 3. Save Academic Tracker & SGPA/CGPA to Supabase
 */
export async function saveAcademicDataToSupabase(user, academicData) {
  if (!user || (!user.id && !user.email)) return null;

  try {
    const uEmail = (user.email || '').toLowerCase().trim();
    const uId = user.id || user.uid;

    let query = supabase.from('users').select('*');
    if (uId) query = query.eq('id', uId);
    else query = query.eq('email', uEmail);

    const { data: dbUser } = await query.maybeSingle();
    let meta = {};
    let baseName = user.name || 'Scholar';

    if (dbUser) {
      baseName = dbUser.name ? dbUser.name.split('{')[0].trim() : (user.name || 'Scholar');
      meta = parseUserPackedMeta(dbUser.name);
    }

    meta.academics = {
      cgpa: academicData.cgpa || meta.academics?.cgpa || 0,
      semesters: academicData.semesters || meta.academics?.semesters || {},
      attendancePct: academicData.attendancePct || meta.academics?.attendancePct || 85,
      updatedAt: new Date().toISOString()
    };

    const newPackedName = packUserMeta(baseName, meta);

    if (uId) {
      await supabase.from('users').update({ name: newPackedName }).eq('id', uId);
    } else {
      await supabase.from('users').update({ name: newPackedName }).eq('email', uEmail);
    }

    return { success: true };
  } catch (err) {
    console.warn('Supabase academic data sync notice:', err);
    return null;
  }
}

/**
 * 4. Save Quiz / Classroom Checkpoint Scores to Supabase
 */
export async function saveQuizScoreToSupabase(user, quizResult) {
  if (!user || (!user.id && !user.email)) return null;

  try {
    const uEmail = (user.email || '').toLowerCase().trim();
    const uId = user.id || user.uid;

    let query = supabase.from('users').select('*');
    if (uId) query = query.eq('id', uId);
    else query = query.eq('email', uEmail);

    const { data: dbUser } = await query.maybeSingle();
    let meta = {};
    let baseName = user.name || 'Scholar';

    if (dbUser) {
      baseName = dbUser.name ? dbUser.name.split('{')[0].trim() : (user.name || 'Scholar');
      meta = parseUserPackedMeta(dbUser.name);
    }

    const existingQuizzes = Array.isArray(meta.quizHistory) ? meta.quizHistory : [];
    meta.quizHistory = [
      {
        id: Date.now(),
        topic: quizResult.topic || 'General Assessment',
        score: quizResult.score,
        total: quizResult.total,
        timestamp: new Date().toISOString()
      },
      ...existingQuizzes.slice(0, 29)
    ];

    const newPackedName = packUserMeta(baseName, meta);

    if (uId) {
      await supabase.from('users').update({ name: newPackedName }).eq('id', uId);
    } else {
      await supabase.from('users').update({ name: newPackedName }).eq('email', uEmail);
    }

    return { success: true };
  } catch (err) {
    console.warn('Supabase quiz sync notice:', err);
    return null;
  }
}

/**
 * 5. Fetch Full Student Progress from Supabase on Login / Refresh
 */
export async function fetchFullStudentProgressFromSupabase(user) {
  if (!user || (!user.id && !user.email)) return null;

  try {
    const uEmail = (user.email || '').toLowerCase().trim();
    const uId = user.id || user.uid;

    let query = supabase.from('users').select('*');
    if (uId) query = query.eq('id', uId);
    else query = query.eq('email', uEmail);

    const { data: dbUser, error } = await query.maybeSingle();
    if (error || !dbUser) return null;

    const meta = parseUserPackedMeta(dbUser.name);

    // Rehydrate local storage cache for offline resilience
    if (meta.submissions && uId) {
      localStorage.setItem(`lumixora_submissions_${uId}`, JSON.stringify(meta.submissions));
    }
    if (meta.solvedProblems && uId) {
      localStorage.setItem(`lumixora_solved_${uId}`, JSON.stringify(meta.solvedProblems));
    }

    return {
      name: dbUser.name ? dbUser.name.split('{')[0].trim() : user.name,
      xp: dbUser.xp || meta.xp || 0,
      coins: dbUser.coins || meta.coins || 0,
      level: meta.level || 1,
      streak: meta.streak || 0,
      submissions: meta.submissions || [],
      solvedProblems: meta.solvedProblems || [],
      solvedCount: meta.solvedCount || (meta.solvedProblems ? meta.solvedProblems.length : 0),
      mockInterviews: meta.mockInterviews || [],
      academics: meta.academics || null,
      quizHistory: meta.quizHistory || []
    };
  } catch (err) {
    console.warn('Supabase fetch user progress notice:', err);
    return null;
  }
}
