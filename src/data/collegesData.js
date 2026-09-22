export const B2B_LICENSING_TIERS = [
  { 
    id: 'trial', 
    name: 'Campus Pilot Trial', 
    price: 'Free (14 Days)', 
    maxSeats: 500, 
    badge: 'Pilot',
    features: ['Core Student AI Twin', 'Doubt Resolution Engine', 'Basic Faculty Roster'] 
  },
  { 
    id: 'pro', 
    name: 'Institutional Pro', 
    price: '₹99,000 / Year', 
    maxSeats: 2500, 
    badge: 'Popular',
    features: ['Full AI Placement Commander', 'Custom Domain Integration', 'Faculty Attendance & Task Analytics', 'Campus Leaderboard'] 
  },
  { 
    id: 'enterprise', 
    name: 'Enterprise Elite', 
    price: '₹2,50,000 / Year', 
    maxSeats: 10000, 
    badge: 'Enterprise',
    features: ['Unlimited Student Seats', 'White-Labeled Institution Branding', 'Custom Department Curriculums', 'Priority 24/7 SLA', 'Automated Exam & Test Generator'] 
  }
];

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
    maxSeats: 5000,
    licenseTier: 'enterprise',
    licenseStatus: 'active',
    licenseExpiry: '2027-12-31',
    contractId: 'LMX-GPREC-2026',
    annualContractValue: '₹2,50,000',
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
    maxSeats: 4000,
    licenseTier: 'pro',
    licenseStatus: 'active',
    licenseExpiry: '2027-08-30',
    contractId: 'LMX-ASHOKA-2026',
    annualContractValue: '₹99,000',
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
  return lower.endsWith('@lumixora.com') || lower.endsWith('@team.lumixora.com') || lower.endsWith('@lumixora.in') || lower.endsWith('@team.lumixora.in') || lower === '249xa33106@gmail.com';
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

  // 1. Founder & Super Admin whitelist (case-insensitive)
  if (lower === 'founder@lumixora.com' || lower === '249xa33106@gmail.com' || lower === '249xa33106@gprec.ac.in') {
    return true;
  }

  // 2. Official Vyomra Core Team
  if (lower.endsWith('@lumixora.com') || lower.endsWith('@team.lumixora.com') || lower.endsWith('@lumixora.in') || lower.endsWith('@team.lumixora.in')) {
    return true;
  }

  // 3. Any educational institution domain (.ac.in, .edu, .edu.in, .org, .in)
  if (lower.includes('.ac.in') || lower.includes('.edu') || lower.includes('.org') || lower.endsWith('@gprec.ac.in')) {
    return true;
  }

  // 4. Authorized Institutional Partner Domains
  const allAllowed = getAllAllowedDomains(customColleges);
  if (allAllowed.some(domain => {
    if (!domain) return false;
    const d = domain.toLowerCase().trim().replace(/^@/, '');
    return lower.endsWith(`@${d}`);
  })) {
    return true;
  }

  // 5. Universal pilot onboarding: allow valid standard email domains for evaluator sign-in
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

export const decodeGprecRollNumber = (rollOrEmail = '') => {
  if (!rollOrEmail || typeof rollOrEmail !== 'string') {
    return { year: '1st Year', department: 'CSM', rollNumber: '' };
  }
  const clean = rollOrEmail.trim().toLowerCase().split('@')[0];
  const upperRoll = clean.toUpperCase();

  let year = '1st Year';
  let department = '';

  // 1. Year Rules: 249XA starts with 249XA -> 3rd Year
  if (clean.startsWith('249xa')) {
    year = '3rd Year';
  } else if (clean.startsWith('259xa')) {
    year = '2nd Year';
  } else if (clean.startsWith('239xa')) {
    year = '4th Year';
  } else if (clean.startsWith('229xa')) {
    year = '4th Year';
  } else {
    const yDigits = clean.slice(0, 2);
    if (yDigits === '24') year = '2nd Year';
    else if (yDigits === '25') year = '1st Year';
    else if (yDigits === '23') year = '3rd Year';
    else if (yDigits === '22') year = '4th Year';
  }

  // 2. Branch Rules after 'XA'
  const xaIdx = clean.indexOf('xa');
  if (xaIdx !== -1) {
    const code = clean.slice(xaIdx + 2, xaIdx + 4);
    if (code === '33') {
      department = 'CSM';
    } else if (code === '05') {
      department = 'CSE';
    } else if (code === '04') {
      department = 'ECE';
    } else if (code === '02') {
      department = 'EEE';
    } else if (code === '03') {
      department = 'MECH';
    } else if (code === '01') {
      department = 'CIVIL';
    } else if (code === '32' || code === '31') {
      department = 'CSD';
    }
  } else {
    if (clean.includes('33') || clean.includes('csm')) department = 'CSM';
    else if (clean.includes('05') || clean.includes('cse')) department = 'CSE';
    else if (clean.includes('04') || clean.includes('ece')) department = 'ECE';
    else if (clean.includes('02') || clean.includes('eee')) department = 'EEE';
  }

  return {
    year,
    department: department || 'CSM', // fallback if known or prompt
    isPromptRequired: !department,
    rollNumber: upperRoll
  };
};

export const getCollegeIdFromUser = (user, customColleges = []) => {
  if (!user) return 'gprec';
  if (user.college_id) return user.college_id;
  if (user.collegeId) return user.collegeId;
  const match = getCollegeByEmail(user.email, customColleges);
  return match?.id || 'gprec';
};
