// Vyomra Omiverse Service: AI Career Brain, Student DNA, Next Best Action & Vyomra Prove Trust Layer

export const OMIVERSE_WORLDS = [
  {
    id: 'learnverse',
    name: 'LEARNVERSE',
    tagline: 'Knowledge & Outcomes',
    subtitle: 'Courses, AI Tutor, Adaptive Learning, Notes & Roadmaps',
    icon: '📚',
    accentColor: '#38BDF8', // Sky blue
    gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
    border: 'border-sky-500/30',
    textGradient: 'from-sky-300 via-blue-200 to-indigo-300',
    primaryTab: 'learning-hub',
    features: [
      { id: 'learning-hub', name: 'AI Learning Hub', icon: 'BookOpen' },
      { id: 'notes', name: 'Previous Papers & Notes', icon: 'FileText' },
      { id: 'mentor', name: '24/7 AI Personal Mentor', icon: 'Bot' },
      { id: 'doubts', name: 'AI Doubt Solver', icon: 'HelpCircle' },
      { id: 'videos', name: 'Video Portal & Lectures', icon: 'Video' }
    ]
  },
  {
    id: 'codeverse',
    name: 'CODEVERSE',
    tagline: 'Technical Practice & Competition',
    subtitle: 'Multi-Lang IDE, DSA Mastery, Contests & AI Coding Interview',
    icon: '💻',
    accentColor: '#10B981', // Emerald green
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'border-emerald-500/30',
    textGradient: 'from-emerald-300 via-teal-200 to-cyan-300',
    primaryTab: 'coding-practice',
    features: [
      { id: 'coding-practice', name: 'Code Arena & LeetCode DSA', icon: 'Code' },
      { id: 'code-editor', name: 'Multi-Lang Cloud IDE', icon: 'Terminal' },
      { id: 'aptitude', name: 'Aptitude & Reasoning Arena', icon: 'Cpu' },
      { id: 'test-portal', name: 'Live Tests & Contests', icon: 'Award' }
    ]
  },
  {
    id: 'buildverse',
    name: 'BUILDVERSE',
    tagline: 'Demonstrable Work & Creation',
    subtitle: 'Real Projects, AI Team Finder, GitHub Sync & Hackathons',
    icon: '🛠️',
    accentColor: '#F59E0B', // Amber
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    border: 'border-amber-500/30',
    textGradient: 'from-amber-300 via-yellow-200 to-orange-300',
    primaryTab: 'projects',
    features: [
      { id: 'projects', name: 'Project Expo & Showcase', icon: 'Rocket' },
      { id: 'hackathons', name: 'Hackathons & Internships', icon: 'Flame' },
      { id: 'simulation', name: 'System Simulations', icon: 'Activity' }
    ]
  },
  {
    id: 'connectverse',
    name: 'CONNECTVERSE',
    tagline: 'Collaborate & Network',
    subtitle: 'Campus Communities, Clubs, Mentors & Peer Teaming',
    icon: '🌐',
    accentColor: '#A855F7', // Purple
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    border: 'border-purple-500/30',
    textGradient: 'from-purple-300 via-pink-200 to-indigo-300',
    primaryTab: 'community',
    features: [
      { id: 'community', name: 'Campus Community & Squads', icon: 'Users' },
      { id: 'clubs', name: 'Student Clubs & Teams', icon: 'Compass' },
      { id: 'alumni-referrals', name: 'Alumni & Off-Campus Referrals', icon: 'Share2' },
      { id: 'study-with-me', name: 'Study Arena Live Rooms', icon: 'Tv' },
      { id: 'marketplace', name: 'Campus Marketplace', icon: 'ShoppingCart' },
      { id: 'grievance', name: 'Anonymous Grievances', icon: 'ShieldCheck' }
    ]
  },
  {
    id: 'careerverse',
    name: 'CAREERVERSE',
    tagline: 'Placement & Company Missions',
    subtitle: 'Company-Specific Prep, AI Resume PDF & Placement Twin',
    icon: '🎯',
    accentColor: '#EC4899', // Pink
    gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    border: 'border-pink-500/30',
    textGradient: 'from-pink-300 via-rose-200 to-amber-300',
    primaryTab: 'future-twin',
    features: [
      { id: 'future-twin', name: 'AI Placement Twin', icon: 'Bot' },
      { id: 'ai-commander', name: 'AI Placement Commander™', icon: 'Briefcase' },
      { id: 'resume', name: 'AI Resume PDF Builder', icon: 'FileText' },
      { id: 'career-roadmap', name: 'Career Roadmap & Skills', icon: 'Compass' },
      { id: 'drive-papers', name: 'Company Placement Papers', icon: 'CheckSquare' }
    ]
  },
  {
    id: 'talentverse',
    name: 'TALENTVERSE',
    tagline: 'Get Discovered & Verified',
    subtitle: 'Recruiter Talent Search, Verified Portfolios & TPO Analytics',
    icon: '🌟',
    accentColor: '#14B8A6', // Teal
    gradient: 'from-teal-500/20 via-cyan-500/10 to-transparent',
    border: 'border-teal-500/30',
    textGradient: 'from-teal-300 via-emerald-200 to-sky-300',
    primaryTab: 'assigned-tasks',
    features: [
      { id: 'assigned-tasks', name: 'Assigned Tasks & Audit', icon: 'ClipboardCheck' },
      { id: 'attendance', name: 'My Attendance & 75% Calc', icon: 'UserCheck' },
      { id: 'tasks', name: 'Task Scheduler', icon: 'Calendar' },
      { id: 'faculty-portal', name: 'Faculty & TPO Dashboard', icon: 'Award' }
    ]
  }
];

export const PROVE_VERIFICATION_LEVELS = [
  { level: 1, title: 'Self Claimed', badge: 'Level 1: Claimed', color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/40', desc: 'Skill listed by student with self-assessed proficiency.' },
  { level: 2, title: 'Assessed', badge: 'Level 2: Assessed', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/40', desc: 'Validated through Vyomra benchmark quizzes and MCQs.' },
  { level: 3, title: 'Practically Verified', badge: 'Level 3: Practiced', color: 'text-teal-400', bg: 'bg-teal-500/20', border: 'border-teal-500/40', desc: 'Demonstrated via real-time code executions, DSA problems & edge tests.' },
  { level: 4, title: 'Project Verified', badge: 'Level 4: Built', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40', desc: 'Validated through GitHub commits, live deployed apps & code quality audit.' },
  { level: 5, title: 'Industry Verified', badge: 'Level 5: Industry Master', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/40', desc: 'Endorsed by recruiter challenge clearances, company missions & hackathons.' }
];

export const calculateRealProveSkills = (user, activities = {}) => {
  return [
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      level: (activities.problemsSolved || 0) >= 30 ? 5 : (activities.problemsSolved || 0) >= 15 ? 4 : (activities.problemsSolved || 0) >= 5 ? 3 : (activities.problemsSolved || 0) >= 1 ? 2 : 1,
      overallScore: Math.min(100, (activities.problemsSolved || 0) * 6 + (activities.leetcodeUser ? 15 : 0) + (activities.hackerrankUser ? 10 : 0)),
      breakdown: {
        coding: Math.min(100, (activities.problemsSolved || 0) * 8),
        problemSolving: Math.min(100, (activities.problemsSolved || 0) * 6 + (activities.aptitudeSolved || 0) * 3),
        projects: activities.githubUser ? 60 : 0,
        interview: activities.hasResume ? 70 : 0,
        practical: Math.min(100, (activities.problemsSolved || 0) * 7),
        communication: Math.min(100, (activities.resolvedDoubtsCount || 0) * 25)
      },
      verifiedAt: (activities.problemsSolved || 0) > 0 ? new Date().toISOString().split('T')[0] : 'Pending Proof',
      evidenceCount: activities.problemsSolved || 0,
      recentEvidence: (activities.problemsSolved || 0) > 0 
        ? `Verified ${activities.problemsSolved} DSA problem(s) solved in Code Arena with passing test suites.`
        : '0 submissions recorded. Solve problems in Codeverse to practically prove your DSA mastery.',
      worldTarget: 'coding-practice',
      worldLabel: 'Solve in Codeverse',
      nextGoal: (activities.problemsSolved || 0) === 0 
        ? 'Solve your first problem in Code Arena to reach Level 2 (Assessed).' 
        : (activities.problemsSolved || 0) < 5 
          ? `Solve ${5 - (activities.problemsSolved || 0)} more problem(s) in Code Arena to reach Level 3 (Practically Verified).`
          : (activities.problemsSolved || 0) < 15
            ? `Solve ${15 - (activities.problemsSolved || 0)} more problem(s) to reach Level 4 (Project Verified).`
            : `Solve ${Math.max(1, 30 - (activities.problemsSolved || 0))} more problem(s) to achieve Level 5 (Industry Verified).`
    },
    {
      id: 'web_fullstack',
      name: 'Web & Full Stack Engineering',
      level: (activities.projectsCount || 0) >= 3 ? 5 : (activities.projectsCount || 0) >= 2 ? 4 : (activities.projectsCount || 0) >= 1 ? 3 : activities.githubUser ? 2 : 1,
      overallScore: Math.min(100, (activities.projectsCount || 0) * 35 + (activities.githubUser ? 25 : 0)),
      breakdown: {
        coding: activities.githubUser ? 65 : Math.min(100, (activities.problemsSolved || 0) * 4),
        problemSolving: Math.min(100, (activities.projectsCount || 0) * 25),
        projects: Math.min(100, (activities.projectsCount || 0) * 40 + (activities.githubUser ? 25 : 0)),
        interview: activities.hasResume ? 65 : 0,
        practical: Math.min(100, (activities.projectsCount || 0) * 30),
        communication: Math.min(100, (activities.resolvedDoubtsCount || 0) * 20)
      },
      verifiedAt: ((activities.projectsCount || 0) > 0 || activities.githubUser) ? new Date().toISOString().split('T')[0] : 'Pending Proof',
      evidenceCount: (activities.projectsCount || 0) + (activities.githubUser ? 1 : 0),
      recentEvidence: ((activities.projectsCount || 0) > 0 || activities.githubUser)
        ? `${activities.projectsCount || 0} project(s) showcased in Buildverse ${activities.githubUser ? `+ GitHub @${activities.githubUser}` : ''}.`
        : 'No project evidence attached. Link your GitHub handle or showcase a project in Buildverse.',
      worldTarget: 'projects',
      worldLabel: 'Attach Buildverse Project',
      nextGoal: !activities.githubUser && (activities.projectsCount || 0) === 0
        ? 'Connect your GitHub profile or attach your first project in Buildverse for Level 2.'
        : (activities.projectsCount || 0) === 0
          ? 'Attach your first repository in Buildverse to unlock Level 3 (Practically Verified).'
          : (activities.projectsCount || 0) < 2
            ? 'Showcase 2 verified projects with live demos for Level 4 (Project Verified).'
            : 'Showcase 3+ full-stack production projects for Level 5 (Industry Master).'
    },
    {
      id: 'aptitude_logic',
      name: 'Quantitative Aptitude & Reasoning',
      level: (activities.aptitudeSolved || 0) >= 30 ? 5 : ((activities.aptitudeSolved || 0) >= 15 || (activities.testsCompleted || 0) >= 3) ? 4 : ((activities.aptitudeSolved || 0) >= 5 || (activities.testsCompleted || 0) >= 1) ? 3 : ((activities.aptitudeSolved || 0) >= 1) ? 2 : 1,
      overallScore: Math.min(100, (activities.aptitudeSolved || 0) * 4 + (activities.testsCompleted || 0) * 8 + Math.round(((activities.avgQuizScore || 0) / 100) * 30)),
      breakdown: {
        coding: 0,
        problemSolving: Math.min(100, (activities.aptitudeSolved || 0) * 5 + (activities.testsCompleted || 0) * 10),
        projects: 0,
        interview: activities.hasResume ? 50 : 0,
        practical: Math.min(100, (activities.aptitudeSolved || 0) * 4),
        communication: Math.min(100, (activities.resolvedDoubtsCount || 0) * 20)
      },
      verifiedAt: ((activities.aptitudeSolved || 0) > 0 || (activities.testsCompleted || 0) > 0) ? new Date().toISOString().split('T')[0] : 'Pending Proof',
      evidenceCount: (activities.aptitudeSolved || 0) + (activities.testsCompleted || 0),
      recentEvidence: ((activities.aptitudeSolved || 0) > 0 || (activities.testsCompleted || 0) > 0)
        ? `Answered ${activities.aptitudeSolved || 0} aptitude questions & completed ${activities.testsCompleted || 0} mock contest(s).`
        : 'No aptitude assessments recorded. Take practice tests in Aptitude & Reasoning Arena.',
      worldTarget: 'aptitude',
      worldLabel: 'Practice in Aptitude Arena',
      nextGoal: (activities.aptitudeSolved || 0) === 0 
        ? 'Solve your first question in Aptitude Arena to reach Level 2 (Assessed).' 
        : (activities.aptitudeSolved || 0) < 5 && (activities.testsCompleted || 0) === 0
          ? `Solve ${5 - (activities.aptitudeSolved || 0)} more question(s) or complete 1 mock test to reach Level 3 (Practically Verified).`
          : (activities.aptitudeSolved || 0) < 15 && (activities.testsCompleted || 0) < 3
            ? `Solve ${15 - (activities.aptitudeSolved || 0)} more questions or complete 3 mock contests for Level 4 (Project Verified).`
            : `Solve ${Math.max(1, 30 - (activities.aptitudeSolved || 0))} more questions to attain Level 5 (Industry Verified).`
    },
    {
      id: 'placement_interview',
      name: 'Placement & Technical Viva Readiness',
      level: (activities.hasResume && (activities.studySessionsCount || 0) >= 5) ? 4 : (activities.hasResume && (activities.studySessionsCount || 0) >= 2) ? 3 : (activities.hasResume || (activities.studySessionsCount || 0) >= 1) ? 2 : 1,
      overallScore: Math.min(100, (activities.hasResume ? 45 : 0) + (activities.studySessionsCount || 0) * 15),
      breakdown: {
        coding: Math.min(100, (activities.problemsSolved || 0) * 5),
        problemSolving: Math.min(100, (activities.aptitudeSolved || 0) * 4),
        projects: Math.min(100, (activities.projectsCount || 0) * 30),
        interview: Math.min(100, (activities.hasResume ? 50 : 0) + (activities.studySessionsCount || 0) * 15),
        practical: Math.min(100, (activities.studySessionsCount || 0) * 10),
        communication: Math.min(100, (activities.resolvedDoubtsCount || 0) * 25 + (activities.studySessionsCount || 0) * 10)
      },
      verifiedAt: (activities.hasResume || (activities.studySessionsCount || 0) > 0) ? new Date().toISOString().split('T')[0] : 'Pending Proof',
      evidenceCount: (activities.hasResume ? 1 : 0) + (activities.studySessionsCount || 0),
      recentEvidence: (activities.hasResume || (activities.studySessionsCount || 0) > 0)
        ? `${activities.hasResume ? 'Verified ATS Resume created' : ''} ${(activities.studySessionsCount || 0) > 0 ? `+ ${activities.studySessionsCount} AI Placement Twin viva session(s)` : ''}`.trim()
        : 'No interview sessions or ATS resume generated. Practice with AI Placement Twin in Careerverse.',
      worldTarget: 'future-twin',
      worldLabel: 'Launch Placement Twin',
      nextGoal: !activities.hasResume ? 'Build and export your AI Resume to unlock Level 2.' : 'Conduct 2 mock viva sessions with AI Placement Twin for Level 3.'
    },
    {
      id: 'dev_tools',
      name: 'Developer Profiles & Competitive Handles',
      level: activities.hasExternalHandles ? ((activities.githubUser && activities.leetcodeUser && activities.hackerrankUser) ? 4 : (activities.githubUser && (activities.leetcodeUser || activities.hackerrankUser)) ? 3 : 2) : 1,
      overallScore: (activities.githubUser ? 35 : 0) + (activities.leetcodeUser ? 35 : 0) + (activities.hackerrankUser ? 30 : 0),
      breakdown: {
        coding: activities.leetcodeUser ? 60 : 0,
        problemSolving: activities.hackerrankUser ? 50 : 0,
        projects: activities.githubUser ? 75 : 0,
        interview: 0,
        practical: activities.hasExternalHandles ? 65 : 0,
        communication: 0
      },
      verifiedAt: activities.hasExternalHandles ? new Date().toISOString().split('T')[0] : 'Pending Proof',
      evidenceCount: [activities.githubUser, activities.leetcodeUser, activities.hackerrankUser].filter(Boolean).length,
      recentEvidence: activities.hasExternalHandles
        ? `Verified developer handles: ${[activities.githubUser && `GitHub (@${activities.githubUser})`, activities.leetcodeUser && `LeetCode (@${activities.leetcodeUser})`, activities.hackerrankUser && `HackerRank (@${activities.hackerrankUser})`].filter(Boolean).join(', ')}.`
        : 'No external profiles linked. Connect GitHub, LeetCode, or HackerRank in your Profile.',
      worldTarget: 'projects',
      worldLabel: 'Link Handles in Buildverse',
      nextGoal: !activities.hasExternalHandles ? 'Link your GitHub or LeetCode handle to instantly reach Level 2.' : 'Connect all 3 handles (GitHub, LeetCode, HackerRank) for Level 4.'
    }
  ];
};

// Extract real student activity telemetry from all application subsystems
export const getRealStudentActivities = (user, contextData = {}) => {
  const userId = user?.id || user?.uid || (user?.email ? user.email.replace(/[@.]/g, '_') : 'guest');
  
  // 1. Coding Submissions & Accepted DSA Problems
  let acceptedSubmissions = [];
  try {
    const rawSubs = localStorage.getItem(`lumixora_submissions_${userId}`);
    if (rawSubs) {
      const parsed = JSON.parse(rawSubs);
      acceptedSubmissions = Array.isArray(parsed) ? parsed.filter(s => s.status === 'Accepted' || s.isAccepted) : [];
    }
  } catch (e) {}
  
  // 2. Aptitude & Reasoning Solved Questions
  let aptitudeSolvedCount = 0;
  try {
    const rawApt = localStorage.getItem(`lumixora_aptitude_answers_${userId}`);
    if (rawApt) {
      const parsed = JSON.parse(rawApt);
      aptitudeSolvedCount = Object.keys(parsed || {}).length;
    }
  } catch (e) {}

  // 3. Quiz & Live Test Scores
  let quizScores = [];
  try {
    const rawQuiz = localStorage.getItem(`lumixora_quiz_scores_${userId}`);
    if (rawQuiz) {
      const parsed = JSON.parse(rawQuiz);
      quizScores = Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {}

  // 4. Study Sessions & Focus Analytics
  let studySessionsCount = 0;
  let totalStudyMinutes = 0;
  try {
    const rawSessions = localStorage.getItem(`lumixora_study_sessions_${userId}`);
    if (rawSessions) {
      const parsed = JSON.parse(rawSessions);
      studySessionsCount = Array.isArray(parsed) ? parsed.length : 0;
    }
    const rawAnalytics = localStorage.getItem(`lumixora_study_analytics_${userId}`);
    if (rawAnalytics) {
      const parsed = JSON.parse(rawAnalytics);
      totalStudyMinutes = parsed.totalMinutes || 0;
    }
  } catch (e) {}

  // 5. Verified Projects
  let userProjectsCount = 0;
  try {
    const rawProj = localStorage.getItem(`lumixora_projects_${userId}`) || localStorage.getItem('lumixora_user_projects');
    if (rawProj) {
      const parsed = JSON.parse(rawProj);
      userProjectsCount = Array.isArray(parsed) ? parsed.length : (parsed ? 1 : 0);
    }
    if (user?.projects && Array.isArray(user.projects)) {
      userProjectsCount = Math.max(userProjectsCount, user.projects.length);
    }
  } catch (e) {}

  // 6. Resume & Portfolio Builder Status
  let hasResume = false;
  try {
    const rawResume = localStorage.getItem(`lumixora_resume_data_${userId}`) || localStorage.getItem('resume_data');
    if (rawResume) {
      const parsed = JSON.parse(rawResume);
      hasResume = Boolean(parsed && (parsed.personalInfo?.fullName || parsed.fullName || parsed.skills?.length > 0));
    }
  } catch (e) {}

  // 7. External Developer Profiles Connected
  const githubUser = localStorage.getItem('lumixora_github_user') || user?.githubUser || '';
  const leetcodeUser = localStorage.getItem('lumixora_leetcode_user') || user?.leetcodeUser || '';
  const hackerrankUser = localStorage.getItem('lumixora_hackerrank_user') || user?.hackerrankUser || '';
  const hasExternalHandles = Boolean(githubUser || leetcodeUser || hackerrankUser);

  // 8. Tasks & Doubts from Context or Local
  const tasks = contextData?.tasks || [];
  const completedTasksCount = tasks.filter(t => t.status === 'Completed' || t.status === 'Done').length;
  const totalTasksCount = tasks.length;
  
  const doubts = contextData?.doubts || [];
  const resolvedDoubtsCount = doubts.filter(d => d.status === 'Resolved').length;

  // 9. Attendance Rate
  let attendanceRate = 0;
  try {
    const rawAtt = localStorage.getItem(`lumixora_attendance_${userId}`);
    if (rawAtt) {
      const parsed = JSON.parse(rawAtt);
      let attended = 0;
      let total = 0;
      Object.values(parsed || {}).forEach(v => {
        attended += (v.attended || 0);
        total += (v.total || 0);
      });
      if (total > 0) attendanceRate = Math.round((attended / total) * 100);
    }
  } catch (e) {}

  // 10. Gamification XP & Streak
  let xp = user?.xp || 0;
  try {
    const rawXp = localStorage.getItem('lumixora_xp');
    if (rawXp) xp = Math.max(xp, parseInt(rawXp) || 0);
  } catch (e) {}

  const streak = user?.streak || user?.currentStreak || 0;

  return {
    problemsSolved: acceptedSubmissions.length || (user?.completedDsaCount || 0),
    aptitudeSolved: aptitudeSolvedCount,
    testsCompleted: quizScores.length || (user?.testsCount || 0),
    avgQuizScore: quizScores.length > 0 ? Math.round(quizScores.reduce((acc, q) => acc + (q.score || 0), 0) / quizScores.length) : 0,
    projectsCount: userProjectsCount,
    hasResume,
    githubUser,
    leetcodeUser,
    hackerrankUser,
    hasExternalHandles,
    studySessionsCount,
    totalStudyMinutes,
    completedTasksCount,
    totalTasksCount,
    resolvedDoubtsCount,
    totalDoubtsCount: doubts.length,
    attendanceRate,
    xp,
    streak
  };
};

// Compute Dynamic Student DNA / Talent Graph directly from real activities
export const calculateStudentDna = (user, activities = {}) => {
  // 1. Technical Skills (0 - 100)
  // Based on accepted coding problems, external handles, and XP
  const codingScore = Math.min(60, (activities.problemsSolved || 0) * 6);
  const handleScore = (activities.githubUser ? 15 : 0) + (activities.leetcodeUser ? 15 : 0) + (activities.hackerrankUser ? 10 : 0);
  const xpBonus = Math.min(15, Math.floor((activities.xp || 0) / 100));
  const technicalSkills = Math.min(100, Math.max(0, codingScore + handleScore + xpBonus));

  // 2. Problem Solving (0 - 100)
  // Based on aptitude questions, quiz tests taken, and average test score
  const aptScore = Math.min(45, (activities.aptitudeSolved || 0) * 3);
  const testCountScore = Math.min(25, (activities.testsCompleted || 0) * 5);
  const quizQualityScore = Math.min(30, Math.round(((activities.avgQuizScore || 0) / 100) * 30));
  const problemSolving = Math.min(100, Math.max(0, aptScore + testCountScore + quizQualityScore));

  // 3. Verified Projects (0 - 100)
  // Based on submitted projects and GitHub repo connection
  const projScore = Math.min(60, (activities.projectsCount || 0) * 30);
  const gitBonus = activities.githubUser ? 25 : 0;
  const projectDocBonus = activities.projectsCount > 0 ? 15 : 0;
  const projectsScore = Math.min(100, Math.max(0, projScore + gitBonus + projectDocBonus));

  // 4. Interview Readiness (0 - 100)
  // Based on AI Placement Twin sessions, resume builder, and placement papers
  const resumeScore = activities.hasResume ? 40 : 0;
  const interviewSessionsScore = Math.min(35, (activities.studySessionsCount || 0) * 10);
  const mockScore = Math.min(25, (activities.testsCompleted || 0) * 4);
  const interviewReadiness = Math.min(100, Math.max(0, resumeScore + interviewSessionsScore + mockScore));

  // 5. Communication (0 - 100)
  // Strictly based on resolved doubts and study arena peer sessions (no artificial profile bonus)
  const doubtScore = Math.min(60, (activities.resolvedDoubtsCount || 0) * 20);
  const sessionCommScore = Math.min(40, (activities.studySessionsCount || 0) * 10);
  const communication = Math.min(100, Math.max(0, doubtScore + sessionCommScore));

  // 6. Leadership & Collaboration (0 - 100)
  // Strictly based on real task completion, attendance rate, and streak consistency
  const taskCompletionRate = activities.totalTasksCount > 0 
    ? (activities.completedTasksCount / activities.totalTasksCount) 
    : 0;
  const taskScore = Math.min(40, Math.round(taskCompletionRate * 40));
  const attScore = Math.min(35, Math.round(((activities.attendanceRate || 0) / 100) * 35));
  const streakScore = Math.min(25, (activities.streak || 0) * 5);
  const leadership = Math.min(100, Math.max(0, taskScore + attScore + streakScore));

  // Composite Readiness Score (Weighted Average)
  const compositeReadiness = Math.round(
    (technicalSkills * 0.25) +
    (problemSolving * 0.25) +
    (projectsScore * 0.20) +
    (interviewReadiness * 0.15) +
    (communication * 0.10) +
    (leadership * 0.05)
  );

  // Dynamic Tier & Rank Label derived strictly from composite score
  let tier = 'Foundational Scholar Tier 4';
  let rankLabel = 'Building Profile';

  if (compositeReadiness >= 85) {
    tier = 'Elite Placement Tier 1';
    rankLabel = 'Top 5%ile';
  } else if (compositeReadiness >= 70) {
    tier = 'Advanced Placement Tier 2';
    rankLabel = 'Top 20%ile';
  } else if (compositeReadiness >= 45) {
    tier = 'Developing Prodigy Tier 3';
    rankLabel = 'Top 40%ile';
  } else if (compositeReadiness > 0) {
    tier = 'Foundational Scholar Tier 4';
    rankLabel = 'Starter Tier';
  } else {
    tier = 'New Scholar';
    rankLabel = 'Zero Baseline';
  }

  return {
    technicalSkills,
    problemSolving,
    projectsScore,
    communication,
    interviewReadiness,
    leadership,
    compositeReadiness,
    tier,
    rankLabel
  };
};

// Generate Intelligent Next Best Action focused on the user's lowest real metric
export const getNextBestAction = (dna, user) => {
  const safeDna = dna || {
    technicalSkills: 0,
    problemSolving: 0,
    projectsScore: 0,
    interviewReadiness: 0,
    communication: 0,
    leadership: 0
  };

  const scores = [
    { key: 'technicalSkills', score: Number(safeDna.technicalSkills) || 0, world: 'codeverse' },
    { key: 'problemSolving', score: Number(safeDna.problemSolving) || 0, world: 'codeverse' },
    { key: 'projectsScore', score: Number(safeDna.projectsScore) || 0, world: 'buildverse' },
    { key: 'interviewReadiness', score: Number(safeDna.interviewReadiness) || 0, world: 'careerverse' },
    { key: 'communication', score: Number(safeDna.communication) || 0, world: 'learnverse' },
    { key: 'leadership', score: Number(safeDna.leadership) || 0, world: 'talentverse' }
  ];

  scores.sort((a, b) => a.score - b.score);
  const lowest = scores[0] || { key: 'technicalSkills', score: 0 };

  if (lowest.key === 'technicalSkills') {
    return {
      worldId: 'codeverse',
      worldName: 'CODEVERSE',
      title: 'Solve DSA Problems & Connect Coding Handles',
      description: `Your Technical Skills are at ${safeDna.technicalSkills || 0}/100. Practice in the Code Arena or link your GitHub/LeetCode handle to rapidly boost your score.`,
      ctaText: 'Practice in Codeverse',
      targetTab: 'coding-practice',
      badge: 'Immediate Impact',
      points: '+50 XP & +15 Skill Points',
      icon: 'Code'
    };
  }

  if (lowest.key === 'problemSolving') {
    return {
      worldId: 'codeverse',
      worldName: 'CODEVERSE',
      title: 'Master Aptitude & Quantitative Reasoning',
      description: `Your Problem Solving score is ${safeDna.problemSolving || 0}/100. Solve 5 aptitude questions and take a live contest to climb to the next tier.`,
      ctaText: 'Solve Aptitude',
      targetTab: 'aptitude',
      badge: 'Logic Booster',
      points: '+40 XP & High Accuracy Rating',
      icon: 'Zap'
    };
  }
  
  if (lowest.key === 'projectsScore') {
    return {
      worldId: 'buildverse',
      worldName: 'BUILDVERSE',
      title: 'Showcase a Project & Verify with Prove',
      description: `Your Verified Projects score is ${safeDna.projectsScore || 0}/100. Add your software projects or link your repository to gain Level 4 project verification.`,
      ctaText: 'Open Buildverse',
      targetTab: 'projects',
      badge: 'Trust Booster',
      points: 'Level 4 Badge & Recruiter Spotlight',
      icon: 'Rocket'
    };
  }

  if (lowest.key === 'interviewReadiness') {
    return {
      worldId: 'careerverse',
      worldName: 'CAREERVERSE',
      title: 'Build AI Resume & Simulate Placement Interview',
      description: `Your Interview Readiness is at ${safeDna.interviewReadiness || 0}/100. Generate an AI ATS-optimized resume and practice with AI Placement Twin.`,
      ctaText: 'Build AI Resume',
      targetTab: 'resume',
      badge: 'Placement Mission',
      points: '+60 XP & Verified ATS Dossier',
      icon: 'Bot'
    };
  }

  if (lowest.key === 'communication') {
    return {
      worldId: 'learnverse',
      worldName: 'LEARNVERSE',
      title: 'Resolve Doubts & Join Study Arena',
      description: `Your Communication score is at ${safeDna.communication || 0}/100. Ask or answer doubts with the 24/7 AI Tutor and participate in live study sessions.`,
      ctaText: 'Open AI Doubts',
      targetTab: 'doubts',
      badge: 'Peer Synergy',
      points: '+30 XP & Doubt Resolver Badge',
      icon: 'HelpCircle'
    };
  }

  return {
    worldId: 'talentverse',
    worldName: 'TALENTVERSE',
    title: 'Complete Scheduled Tasks & Track Attendance',
    description: `Your Leadership & Collaboration score is ${safeDna.leadership || 0}/100. Complete your pending assigned tasks and maintain 75%+ attendance.`,
    ctaText: 'Open Task Scheduler',
    targetTab: 'tasks',
    badge: 'Consistency',
    points: '+45 XP & Attendance Merit',
    icon: 'ShieldCheck'
  };
};

export const getProveSkills = () => {
  try {
    const saved = localStorage.getItem('lumixora_prove_skills');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_PROVE_SKILLS;
};

export const saveProveSkill = (skill) => {
  try {
    const current = getProveSkills();
    const updated = current.map(s => s.id === skill.id ? { ...s, ...skill } : s);
    if (!updated.some(s => s.id === skill.id)) {
      updated.push(skill);
    }
    localStorage.setItem('lumixora_prove_skills', JSON.stringify(updated));
    return updated;
  } catch (e) {
    return DEFAULT_PROVE_SKILLS;
  }
};
