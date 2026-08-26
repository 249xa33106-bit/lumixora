export const DEFAULT_COLLEGES = [
  {
    id: 'gprec',
    name: 'G. Pulla Reddy Engineering College (Autonomous)',
    shortName: 'GPREC Kurnool',
    code: 'GPREC',
    domains: ['gprec.ac.in'],
    logo: '🏛️',
    bannerColor: 'from-purple-600 via-indigo-600 to-blue-600',
    established: '1985',
    location: 'Kurnool, Andhra Pradesh',
    studentCount: 4200,
    isActive: true,
    description: 'Premier autonomous engineering institution in Andhra Pradesh accredited by NAAC with A+ grade.'
  },
  {
    id: 'ashoka',
    name: "Ashoka Women's Engineering College",
    shortName: 'Ashoka Kurnool',
    code: 'ASHOKA',
    domains: ['ashokaengg.ac.in', 'ashokacollege.in', 'ashoka.ac.in', 'ashoka.edu.in', 'ashokaengg.in'],
    logo: '🎓',
    bannerColor: 'from-pink-600 via-purple-600 to-indigo-600',
    established: '2008',
    location: 'Kurnool, Andhra Pradesh',
    studentCount: 3500,
    isActive: true,
    description: 'Leading engineering college for women in Kurnool, Andhra Pradesh committed to academic excellence and industry placements.'
  }
];

export const getAllAllowedDomains = (customColleges = []) => {
  const allColleges = [...DEFAULT_COLLEGES, ...customColleges];
  const domainSet = new Set();
  allColleges.forEach(col => {
    if (col.domains && Array.isArray(col.domains)) {
      col.domains.forEach(d => domainSet.add(d.toLowerCase().trim()));
    }
  });
  return Array.from(domainSet);
};

export const isTeammateEmail = (email) => {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return lower.endsWith('@lumixora.com') || lower.endsWith('@team.lumixora.com') || lower === '249xa33106@gmail.com';
};

export const isTeammateUser = (user) => {
  if (!user) return false;
  const role = (user.role || '').toLowerCase();
  // Explicitly treat client role as non‑teammate even if email matches @lumixora.com
  if (role === 'client') return false;
  const isTeamRole = role === 'teammate' || role === 'team' || role === 'team_member' || role === 'contributor' || role === 'founder';
  return isTeamRole || isTeammateEmail(user.email);
};

export const isValidInstitutionalEmail = (email, customColleges = []) => {
  if (!email || typeof email !== 'string') return false;
  const lower = email.toLowerCase().trim();
  if (!lower.includes('@') || lower.length < 5) return false;
  return true;
};

export const getCollegeByEmail = (email, customColleges = []) => {
  if (!email) return DEFAULT_COLLEGES[0];
  const lowerEmail = email.toLowerCase().trim();

  // Special Super-Admin Exemptions
  if (lowerEmail === 'founder@lumixora.com' || lowerEmail === '249xa33106@gmail.com') {
    return {
      ...DEFAULT_COLLEGES[0],
      isSuperAdmin: true,
      allCollegesAccess: true
    };
  }

  const allList = [...DEFAULT_COLLEGES, ...customColleges];
  for (const col of allList) {
    if (col.domains && Array.isArray(col.domains)) {
      for (const domain of col.domains) {
        if (lowerEmail.endsWith(`@${domain}`)) {
          return col;
        }
      }
    }
  }

  // Fallback if domain match fails
  return DEFAULT_COLLEGES[0];
};

export const getCollegeIdFromUser = (user, customColleges = []) => {
  if (!user) return 'gprec';
  if (user.college_id) return user.college_id;
  if (user.collegeId) return user.collegeId;
  const match = getCollegeByEmail(user.email, customColleges);
  return match?.id || 'gprec';
};
