/**
 * portalMapping.js
 * Intelligent Portal Recommender & Taxonomy Matrix
 * Analyzes multiple dimensions: Goal, Academic Branch & Year, Experience Level, and Target Focus.
 */

export const ALL_PORTALS = [
  // Academics
  { id: 'dashboard', label: 'Dashboard Home', category: 'academics', tags: ['all', 'foundation'] },
  { id: 'simulations', label: 'Simulation Portal', category: 'academics', tags: ['academics', 'ece', 'eee', 'mech', 'civil', 'visual', 'practical'] },
  { id: 'courses', label: 'All Courses & Diplomas', category: 'academics', tags: ['academics', 'skills', 'certification'] },
  { id: 'boloclass', label: 'BoloClass AI Classroom', category: 'academics', tags: ['academics', 'lectures', 'ai', 'visual'] },
  { id: 'my-academics', label: 'My Academics (SGPA/CGPA)', category: 'academics', tags: ['academics', 'grades', 'cgpa'] },
  { id: 'doubts', label: 'Doubt Solver (AI 24/7)', category: 'academics', tags: ['academics', 'exams', 'doubts', 'ai'] },
  { id: 'learning-hub', label: 'Learning & Video Hub', category: 'academics', tags: ['academics', 'notes', 'videos', 'study'] },
  { id: 'previous-papers', label: 'Previous Papers & ML Predictor', category: 'academics', tags: ['academics', 'exams', 'predictor', 'ml', 'previous-papers', 'papers', 'all'] },
  { id: 'test-portal', label: 'Tests & Assessment Hub', category: 'academics', tags: ['academics', 'exams', 'assessment', 'placement'] },
  { id: 'attendance', label: 'Attendance Tracker', category: 'academics', tags: ['academics', 'college', 'tracking'] },

  // Career & Placement
  { id: 'speakverse', label: 'SpeakVerse™ AI', category: 'career', tags: ['communication', 'english', 'interview', 'placement', 'soft-skills'] },
  { id: 'ai-commander', label: 'AI Placement Commander™', category: 'career', tags: ['placement', 'career', 'resume', 'jobs'] },
  { id: 'interview', label: 'AI Mock Interview Room', category: 'career', tags: ['interview', 'placement', 'communication', 'mock'] },
  { id: 'coding-practice', label: 'Code Arena & 30D Java', category: 'career', tags: ['coding', 'dsa', 'programming', 'placement', 'cse', 'csm', 'csd'] },
  { id: 'certificates', label: 'Proof-of-Skill Badges', category: 'career', tags: ['placement', 'certification', 'linkedin'] },
  { id: 'internships', label: 'Lumixora Internships', category: 'career', tags: ['internship', 'career', 'jobs'] },
  { id: 'alumni-referrals', label: 'Alumni & Off-Campus Jobs', category: 'career', tags: ['placement', 'referrals', 'jobs', 'career'] },
  { id: 'career-roadmap', label: 'Career Roadmap', category: 'career', tags: ['career', 'guidance', 'roadmap'] },

  // Campus & Opportunities
  { id: 'marketplace', label: 'Campus P2P Marketplace', category: 'social', tags: ['marketplace', 'store', 'buy', 'sell', 'drafter', 'calculator', 'books', 'p2p', 'campus', 'stationery', 'used'] },
  { id: 'student-offers', label: 'Student Perks & Pro Offers', category: 'social', tags: ['perks', 'offers', 'tools', 'free', 'github', 'discounts', 'software', 'developer-pack', 'student-offers'] },
  { id: 'clubs', label: 'Student Clubs & Societies', category: 'social', tags: ['clubs', 'cad', 'societies', 'student-body', 'events', 'activities', 'membership'] },
  { id: 'projects', label: 'Community Project Showcase', category: 'social', tags: ['projects', 'showcase', 'portfolio', 'build', 'github', 'community', 'web3', 'ai'] },
  { id: 'hackathons', label: 'Hackathons & Internships', category: 'social', tags: ['projects', 'coding', 'internship', 'competition'] },

  // Support & Connect
  { id: 'contribute', label: 'Contribute Notes', category: 'support', tags: ['all', 'notes'] },
  { id: 'contact', label: 'Connect with Founder', category: 'support', tags: ['all'] },
  { id: 'report-bug', label: 'Report Platform Issue', category: 'support', tags: ['all'] },
];

/**
 * Intelligent recommendation analyzing all student input dimensions
 */
export function analyzeAndRecommendPortals({
  careerGoal = '',
  interests = [],
  year = '',
  department = '',
  experienceLevel = '',
  studyMode = ''
} = {}) {
  const recommended = new Set();

  // 1. Core anchors for all students (always default enabled)
  recommended.add('dashboard');
  recommended.add('student-offers');
  recommended.add('community');
  recommended.add('contribute');
  recommended.add('contact');
  recommended.add('report-bug');

  const goalLower = (careerGoal || '').toLowerCase();
  const yearLower = (year || '').toLowerCase();
  const deptLower = (department || '').toLowerCase();
  const expLower = (experienceLevel || '').toLowerCase();
  const studyLower = (studyMode || '').toLowerCase();
  const interestsList = (Array.isArray(interests) ? interests : []).map(i => i.toLowerCase());

  // 2. Goal-Driven Portals
  if (goalLower.includes('placement') || goalLower.includes('job') || goalLower.includes('drive')) {
    recommended.add('ai-commander');
    recommended.add('interview');
    recommended.add('coding-practice');
    recommended.add('speakverse');
    recommended.add('certificates');
    recommended.add('alumni-referrals');
    recommended.add('career-roadmap');
    recommended.add('test-portal');
  }

  if (goalLower.includes('internship') || goalLower.includes('industry')) {
    recommended.add('internships');
    recommended.add('coding-practice');
    recommended.add('hackathons');
    recommended.add('certificates');
    recommended.add('interview');
  }

  if (goalLower.includes('coding') || goalLower.includes('dsa') || goalLower.includes('developer')) {
    recommended.add('coding-practice');
    recommended.add('hackathons');
    recommended.add('certificates');
    recommended.add('test-portal');
  }

  if (goalLower.includes('academic') || goalLower.includes('cgpa') || goalLower.includes('exam')) {
    recommended.add('my-academics');
    recommended.add('doubts');
    recommended.add('learning-hub');
    recommended.add('courses');
    recommended.add('boloclass');
    recommended.add('simulations');
    recommended.add('tasks');
    recommended.add('attendance');
  }

  if (goalLower.includes('communication') || goalLower.includes('english') || goalLower.includes('speaking')) {
    recommended.add('speakverse');
    recommended.add('interview');
  }

  // 3. Academic Year & Experience Adaptive Rules
  if (yearLower.includes('1st') || yearLower.includes('2nd') || expLower.includes('beginner')) {
    recommended.add('learning-hub');
    recommended.add('courses');
    recommended.add('doubts');
    recommended.add('my-academics');
  }

  if (yearLower.includes('3rd') || yearLower.includes('4th') || yearLower.includes('final') || expLower.includes('advanced')) {
    recommended.add('ai-commander');
    recommended.add('interview');
    recommended.add('alumni-referrals');
    recommended.add('certificates');
  }

  // 4. Branch Specific Rules
  if (['ece', 'eee', 'mech', 'civil'].some(d => deptLower.includes(d))) {
    recommended.add('simulations');
  }
  if (['cse', 'csm', 'csd', 'it', 'ai', 'ds'].some(d => deptLower.includes(d))) {
    recommended.add('coding-practice');
  }

  // 5. Interest-Driven Portals
  for (const item of interestsList) {
    if (item.includes('dsa') || item.includes('coding') || item.includes('web') || item.includes('dev')) {
      recommended.add('coding-practice');
      recommended.add('hackathons');
    }
    if (item.includes('ai') || item.includes('machine learning') || item.includes('data')) {
      recommended.add('coding-practice');
      recommended.add('courses');
    }
    if (item.includes('english') || item.includes('speaking') || item.includes('gd')) {
      recommended.add('speakverse');
      recommended.add('interview');
    }
    if (item.includes('exam') || item.includes('notes') || item.includes('syllabus')) {
      recommended.add('doubts');
      recommended.add('learning-hub');
      recommended.add('my-academics');
      recommended.add('tasks');
    }
    if (item.includes('internship') || item.includes('referral')) {
      recommended.add('internships');
      recommended.add('alumni-referrals');
      recommended.add('hackathons');
    }
    if (item.includes('study') || item.includes('focus') || item.includes('pomodoro')) {
      recommended.add('notes');
    }
  }

  // 6. Study Style
  if (studyLower.includes('exam') || studyLower.includes('focus')) {
    recommended.add('notes');
    recommended.add('test-portal');
  }

  recommended.add('contact');

  return Array.from(recommended);
}


export const GPREC_PORTALS = [
  { id: 'ai-commander', label: 'AI Placement Commander™', category: 'career', tags: ['placement', 'career', 'resume', 'jobs'] },
  { id: 'tech-pulse', label: 'Tech Pulse & Jobs Radar', category: 'career', tags: ['news', 'jobs', 'hiring', 'placement'] },
  { id: 'speakverse', label: 'SpeakVerse™ AI Communication', category: 'career', tags: ['communication', 'english', 'interview', 'placement', 'soft-skills'] },
  { id: 'interview', label: 'AI Mock Interview Room', category: 'career', tags: ['interview', 'placement', 'communication', 'mock'] },
  { id: 'coding-practice', label: 'Code Arena & 30D Java', category: 'career', tags: ['coding', 'dsa', 'programming', 'placement'] },
  { id: 'test-portal', label: 'Tests & Assessment Hub', category: 'academics', tags: ['exams', 'assessment', 'placement'] },
  { id: 'company-papers', label: 'Placement Papers (TCS/Amazon)', category: 'career', tags: ['placement', 'papers', 'companies'] },
  { id: 'aptitude-arena', label: 'Aptitude & Reasoning Arena', category: 'career', tags: ['aptitude', 'quant', 'reasoning', 'placement'] },
  { id: 'resume', label: 'AI Resume Builder & ATS', category: 'career', tags: ['resume', 'ats', 'placement'] },
  { id: 'certificates', label: 'Proof-of-Skill Badges', category: 'career', tags: ['placement', 'certification', 'linkedin'] },
  { id: 'alumni-referrals', label: 'Alumni Referral Bridge & Off-Campus Jobs', category: 'career', tags: ['placement', 'referrals', 'jobs', 'career'] },
  { id: 'career-roadmap', label: 'Career Roadmap & Target Roles', category: 'career', tags: ['career', 'guidance', 'roadmap'] },
  { id: 'internships', label: 'Lumixora Internships', category: 'career', tags: ['internship', 'career', 'jobs'] },
];
