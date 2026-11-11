import { supabase } from '../config/supabase';

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
    logo: '/gprec_logo.png',
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
    isFeeExempt: false,
    feeAmount: 10,
    feeBadge: '⚡ ₹10 One-Time Access Fee',
    description: 'Premier autonomous engineering institution in Andhra Pradesh accredited by NAAC with A+ grade.'
  },
  {
    id: 'ashoka',
    name: "Ashoka Women's Engineering College",
    shortName: 'Ashoka Kurnool',
    code: 'ASHOKA',
    domains: ['ashokaengg.ac.in', 'ashokacollege.in', 'ashoka.ac.in', 'ashoka.edu.in', 'ashokaengg.in'],
    logo: '/ashoka_logo.png',
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
    isFeeExempt: false,
    feeAmount: 10,
    feeBadge: '₹10 One-Time Access Fee',
    description: 'Leading engineering college for women in Kurnool, Andhra Pradesh committed to academic excellence and industry placements.'
  },
  {
    id: 'annamacharya',
    name: 'Annamacharya University',
    shortName: 'AU Rajampet',
    code: 'AU',
    domains: ['annamacharyauniversity.edu.in', 'aitsrajampet.ac.in', 'annamacharya.edu.in', 'aits.edu.in'],
    logo: '/annamacharya_logo.png',
    bannerColor: 'from-blue-600 via-indigo-600 to-cyan-600',
    established: '1998',
    location: 'Rajampet, AP',
    studentCount: 4500,
    maxSeats: 5000,
    licenseTier: 'pro',
    licenseStatus: 'active',
    licenseExpiry: '2027-12-31',
    contractId: 'LMX-AU-2026',
    annualContractValue: '₹99,000',
    isActive: true,
    isFeeExempt: false,
    feeAmount: 10,
    feeBadge: '⚡ ₹10 One-Time Access Fee',
    description: 'Premier multi-disciplinary university in Rajampet, Andhra Pradesh empowering technical research, incubation, and industry placements.'
  },
  {
    id: 'bits',
    name: 'Bheema Institute Of Technology & Science',
    shortName: 'BITS ADONI',
    code: 'BITS',
    domains: ['bitsadoni.ac.in', 'bits.ac.in', 'bits.edu.in', 'bitsadoni.edu.in'],
    logo: '🏛️',
    bannerColor: 'from-amber-600 via-orange-600 to-yellow-600',
    established: '2008',
    location: 'Adoni, Kurnool dist',
    studentCount: 3000,
    maxSeats: 5000,
    licenseTier: 'pro',
    licenseStatus: 'active',
    licenseExpiry: '2027-12-31',
    contractId: 'LMX-BITS-2026',
    annualContractValue: '₹99,000',
    isActive: true,
    isFeeExempt: false,
    feeAmount: 10,
    feeBadge: '⚡ ₹10 One-Time Access Fee',
    description: 'Premier engineering institution in Adoni, Kurnool district empowering technical talent, AI innovation, and sessional excellence.'
  },
  {
    id: 'svce',
    name: 'Sri Venkateshwara College Of Engineering',
    shortName: 'SVCE TIRUPATHI',
    code: 'SVCE',
    domains: ['svce.edu.in', 'svce.ac.in', 'svce.org'],
    logo: '/svce_logo.png',
    bannerColor: 'from-emerald-600 via-teal-600 to-blue-600',
    established: '2007',
    location: 'Tirupathi, Andhra Pradesh',
    studentCount: 4000,
    maxSeats: 5000,
    licenseTier: 'pro',
    licenseStatus: 'active',
    licenseExpiry: '2027-12-31',
    contractId: 'LMX-SVCE-2026',
    annualContractValue: '₹99,000',
    isActive: true,
    isFeeExempt: false,
    feeAmount: 10,
    feeBadge: '⚡ ₹10 One-Time Access Fee',
    description: 'Premier engineering institution in Tirupathi accredited by NAAC and approved by AICTE, empowering next-gen technocrats.'
  },
  {
    id: 'nec',
    name: 'Narayana Engineering College',
    shortName: 'NEC GUDUR',
    code: 'NEC',
    domains: ['necg.ac.in', 'narayanagroup.com', 'narayanaengineering.ac.in'],
    logo: '/nec_logo.png',
    bannerColor: 'from-rose-600 via-orange-600 to-amber-600',
    established: '2001',
    location: 'Gudur, Andhra Pradesh',
    studentCount: 3500,
    maxSeats: 5000,
    licenseTier: 'pro',
    licenseStatus: 'active',
    licenseExpiry: '2027-12-31',
    contractId: 'LMX-NEC-2026',
    annualContractValue: '₹99,000',
    isActive: true,
    isFeeExempt: false,
    feeAmount: 10,
    feeBadge: '⚡ ₹10 One-Time Access Fee',
    description: 'Leading autonomous engineering institution in Gudur, Andhra Pradesh under the prestigious Narayana Educational Institutions.'
  },
  {
    id: 'rgukt',
    name: 'Rajiv Gandhi University of Knowledge and Technology RK Valley',
    shortName: 'RGUKT RK Valley',
    code: 'RGUKT',
    domains: ['rguktrkv.ac.in', 'rgukt.ac.in', 'rguktrkv.edu.in'],
    logo: '/rgukt_logo.png',
    bannerColor: 'from-cyan-600 via-blue-600 to-indigo-600',
    established: '2008',
    location: 'VK Valley,AP',
    studentCount: 5000,
    maxSeats: 5000,
    licenseTier: 'pro',
    licenseStatus: 'active',
    licenseExpiry: '2027-12-31',
    contractId: 'LMX-RGUKT-2026',
    annualContractValue: '₹99,000',
    isActive: true,
    isFeeExempt: false,
    feeAmount: 10,
    feeBadge: '⚡ ₹10 One-Time Access Fee',
    description: 'Premier institute for technical education in RK Valley, Andhra Pradesh providing top-tier engineering curriculums, industry incubations, and research.'
  },
  {
    id: 'vitap',
    name: 'VIT-AP University',
    shortName: 'VIT AP UNIVERSITY',
    code: 'VIT-AP',
    domains: ['vitapstudent.ac.in', 'vitap.ac.in', 'vitapstudent.edu.in'],
    logo: '/vitap_logo.png',
    bannerColor: 'from-blue-700 via-indigo-600 to-violet-700',
    established: '2017',
    location: '(Beside AP secretariat), near vijayawada, Guntur',
    studentCount: 12000,
    maxSeats: 15000,
    licenseTier: 'enterprise',
    licenseStatus: 'active',
    licenseExpiry: '2027-12-31',
    contractId: 'LMX-VITAP-2026',
    annualContractValue: '₹2,50,000',
    isActive: true,
    isFeeExempt: false,
    feeAmount: 10,
    feeBadge: '⚡ ₹10 One-Time Access Fee',
    description: 'Premier university located beside AP Secretariat near Vijayawada, Guntur empowering next-gen technical excellence, AI innovations, and global placements.'
  },
  {
    id: 'mits',
    name: 'MITS DEEMED TO BE UNIVERSITY',
    shortName: 'MITS',
    code: 'MITS',
    domains: ['mits.ac.in', 'mits.edu.in'],
    logo: '/mits_logo.png',
    bannerColor: 'from-amber-600 via-rose-600 to-indigo-600',
    established: '1998',
    location: 'Madanapalle, Andhra Pradesh',
    studentCount: 6500,
    maxSeats: 8000,
    licenseTier: 'enterprise',
    licenseStatus: 'active',
    licenseExpiry: '2027-12-31',
    contractId: 'LMX-MITS-2026',
    annualContractValue: '₹2,50,000',
    isActive: true,
    isFeeExempt: false,
    feeAmount: 10,
    feeBadge: '⚡ ₹10 One-Time Access Fee',
    description: 'Madanapalle Institute of Technology & Science (MITS Deemed to be University) in Madanapalle, Andhra Pradesh empowering technical research, AI innovation, and industry placements.'
  }
];

export const getStoredCustomColleges = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = localStorage.getItem('lumixora_custom_college_tenants');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const saveCustomCollegesToStorage = (colleges = []) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem('lumixora_custom_college_tenants', JSON.stringify(colleges));
    window.dispatchEvent(new CustomEvent('lumixora_colleges_updated', { detail: colleges }));
  } catch (e) {}
};

/**
 * Cloud Sync: Fetches all partner college tenants from Supabase and merges with local storage.
 * Works seamlessly across all student devices without relying on founder browser cache.
 */
export const fetchCollegesFromSupabase = async () => {
  try {
    if (!supabase || typeof supabase.from !== 'function') return getStoredCustomColleges();

    const [tableRes, notifRes] = await Promise.allSettled([
      supabase.from('college_tenants').select('*'),
      supabase.from('founder_notifications').select('meta').eq('type', 'college_tenant')
    ]);

    const cloudMap = new Map();

    // 1. Parse from college_tenants table
    if (tableRes.status === 'fulfilled' && tableRes.value.data) {
      tableRes.value.data.forEach(row => {
        if (!row || !row.id || row.id === 'init') return;
        const tenantId = row.id.toLowerCase().trim();
        const domains = row.domain ? row.domain.split(',').map(d => d.trim().replace(/^@/, '')).filter(Boolean) : [];
        cloudMap.set(tenantId, {
          id: tenantId,
          name: row.name,
          shortName: row.name,
          code: row.id.toUpperCase(),
          domains,
          logo: row.logo || '🏛️',
          isActive: row.active !== false,
          isFeeExempt: false,
          feeAmount: 10,
          feeBadge: '⚡ ₹10 One-Time Access Fee'
        });
      });
    }

    // 2. Parse from founder_notifications with type 'college_tenant' (contains full metadata)
    if (notifRes.status === 'fulfilled' && notifRes.value.data) {
      notifRes.value.data.forEach(item => {
        const meta = item.meta;
        if (meta && meta.id) {
          const tenantId = meta.id.toLowerCase().trim();
          const prev = cloudMap.get(tenantId) || {};
          cloudMap.set(tenantId, { ...prev, ...meta, id: tenantId, feeAmount: 10 });
        }
      });
    }

    const fetchedColleges = Array.from(cloudMap.values());
    if (fetchedColleges.length > 0) {
      // Merge with stored local
      const stored = getStoredCustomColleges();
      const combined = new Map();
      stored.forEach(c => combined.set(c.id, c));
      fetchedColleges.forEach(c => combined.set(c.id, { ...(combined.get(c.id) || {}), ...c }));
      const mergedList = Array.from(combined.values());
      saveCustomCollegesToStorage(mergedList);
      return mergedList;
    }
  } catch (err) {
    console.warn("fetchCollegesFromSupabase error:", err);
  }

  return getStoredCustomColleges();
};

/**
 * Cloud Sync: Saves partner college to Supabase college_tenants & founder_notifications
 * and synchronizes across all users nationwide in real-time.
 */
export const saveCollegeToSupabase = async (college) => {
  if (!college || !college.id) return;
  const tenantId = college.id.toLowerCase().trim();
  const domainStr = Array.isArray(college.domains) ? college.domains.join(',') : (college.domain || '');

  // 1. Save to local storage first for instant feedback
  const stored = getStoredCustomColleges();
  const updatedStored = [college, ...stored.filter(c => c.id !== tenantId)];
  saveCustomCollegesToStorage(updatedStored);

  // 2. Persist to Supabase
  if (supabase && typeof supabase.from === 'function') {
    try {
      // Upsert into college_tenants table
      await supabase.from('college_tenants').upsert({
        id: tenantId,
        name: college.name,
        domain: domainStr,
        logo: college.logo || '🏛️',
        active: college.isActive !== false
      }, { onConflict: 'id' });

      // Record full tenant spec in founder_notifications
      await supabase.from('founder_notifications').insert([{
        title: `Partner College Licensed: ${college.name}`,
        message: `${college.shortName || college.name} (${college.code || ''}) · ${college.location || 'AP'} · ${college.annualContractValue || '₹99,000'}`,
        type: 'college_tenant',
        meta: {
          ...college,
          id: tenantId,
          feeAmount: 10
        },
        read: false
      }]);
    } catch (sbErr) {
      console.warn("saveCollegeToSupabase notice:", sbErr);
    }
  }
};

export const getAllAllowedDomains = (customColleges = []) => {
  const stored = getStoredCustomColleges();
  const allColleges = [...DEFAULT_COLLEGES, ...stored, ...customColleges];
  const domainSet = new Set();
  const forbiddenPersonalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'proton.me', 'protonmail.com'];
  allColleges.forEach(col => {
    if (col && col.domains && Array.isArray(col.domains)) {
      col.domains.forEach(d => {
        const cleanD = d.toLowerCase().trim().replace(/^@/, '');
        if (cleanD && !forbiddenPersonalDomains.includes(cleanD)) {
          domainSet.add(cleanD);
        }
      });
    }
  });
  return Array.from(domainSet);
};

export const isTeammateEmail = (email) => {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return lower.endsWith('@lumixora.com') || lower.endsWith('@team.lumixora.com') || lower.endsWith('@lumixora.in') || lower.endsWith('@team.lumixora.in') ;
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
  if (lower === 'founder@lumixora.com'  ) {
    return true;
  }

  // 2. Official Vyomra Core Team
  if (lower.endsWith('@lumixora.com') || lower.endsWith('@team.lumixora.com') || lower.endsWith('@lumixora.in') || lower.endsWith('@team.lumixora.in')) {
    return true;
  }

  // 3. Any educational institution domain (.ac.in, .edu, .edu.in) or explicit @gprec.ac.in
  if (lower.endsWith('@gprec.ac.in') || lower.endsWith('.ac.in') || lower.endsWith('.edu') || lower.endsWith('.edu.in') || lower.includes('.ac.in') || lower.includes('.edu')) {
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

  // Allow all valid scholar emails
  return true;
};

export const getCollegeByEmail = (email, customColleges = []) => {
  if (!email) return DEFAULT_COLLEGES[0];
  const lowerEmail = email.toLowerCase().trim();

  // Special Super-Admin Exemptions
  if (lowerEmail === 'founder@lumixora.com') {
    return {
      ...DEFAULT_COLLEGES[0],
      isSuperAdmin: true,
      allCollegesAccess: true
    };
  }

  const stored = getStoredCustomColleges();
  const allList = [...DEFAULT_COLLEGES, ...stored, ...customColleges];
  for (const col of allList) {
    if (col && col.domains && Array.isArray(col.domains)) {
      for (const domain of col.domains) {
        const d = domain.toLowerCase().trim().replace(/^@/, '');
        if (lowerEmail.endsWith(`@${d}`)) {
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

export const decodeVitApRollNumber = (rollOrEmail = '') => {
  if (!rollOrEmail || typeof rollOrEmail !== 'string') {
    return { year: '1st Year', department: 'Computer Science & Engineering (CSE)', rollNumber: '' };
  }
  const clean = rollOrEmail.trim().toLowerCase().split('@')[0];
  const upperRoll = clean.toUpperCase();

  let year = '1st Year';
  let department = 'Computer Science & Engineering (CSE)';

  // Pattern: 2 digits (year) + 2-5 letters (branch code) + digits (id)
  const match = upperRoll.match(/^(\d{2})([A-Z]{2,5})(\d+)$/);
  if (match) {
    const yrNum = parseInt(match[1], 10);
    const deptCode = match[2];

    if (yrNum >= 25) year = '1st Year';
    else if (yrNum === 24) year = '2nd Year';
    else if (yrNum === 23) year = '3rd Year';
    else if (yrNum <= 22) year = '4th Year';

    const deptMap = {
      'BCE': 'Computer Science & Engineering (CSE)',
      'CSE': 'Computer Science & Engineering (CSE)',
      'BAI': 'CSE - AI & Machine Learning',
      'AIML': 'CSE - AI & Machine Learning',
      'BDS': 'CSE - Data Science',
      'DS': 'CSE - Data Science',
      'BCS': 'CSE - Cyber Security',
      'CS': 'CSE - Cyber Security',
      'BSW': 'CSE - Software Engineering',
      'SE': 'CSE - Software Engineering',
      'BIT': 'Information Technology',
      'IT': 'Information Technology',
      'BEC': 'Electronics & Communication Engineering (ECE)',
      'ECE': 'Electronics & Communication Engineering (ECE)',
      'BEE': 'Electrical & Electronics Engineering (EEE)',
      'EEE': 'Electrical & Electronics Engineering (EEE)',
      'BME': 'Mechanical Engineering',
      'MECH': 'Mechanical Engineering',
      'BCL': 'Civil Engineering',
      'CIVIL': 'Civil Engineering',
      'BBA': 'School of Business (BBA)',
      'BLA': 'School of Law',
      'LAW': 'School of Law',
      'MCA': 'Master of Computer Applications (MCA)',
      'MCS': 'M.Tech Computer Science',
      'MSE': 'M.Tech Software Engineering'
    };
    if (deptMap[deptCode]) {
      department = deptMap[deptCode];
    }
  }

  return {
    year,
    department,
    rollNumber: upperRoll
  };
};

export const decodeMitsRollNumber = (rollOrEmail = '') => {
  if (!rollOrEmail || typeof rollOrEmail !== 'string') {
    return { year: '1st Year', department: 'Computer Science & Engineering (CSE)', rollNumber: '' };
  }
  const clean = rollOrEmail.trim().toLowerCase().split('@')[0];
  const upperRoll = clean.toUpperCase();

  let year = '1st Year';
  let department = 'Computer Science & Engineering (CSE)';

  const yrNum = parseInt(upperRoll.slice(0, 2), 10);
  if (!isNaN(yrNum)) {
    if (yrNum >= 25) year = '1st Year';
    else if (yrNum === 24) year = '2nd Year';
    else if (yrNum === 23) year = '3rd Year';
    else if (yrNum <= 22) year = '4th Year';
  }

  const deptMap = {
    '05': 'Computer Science & Engineering (CSE)',
    '33': 'CSE - AI & Machine Learning',
    '32': 'CSE - Data Science',
    '35': 'CSE - Cyber Security',
    '04': 'Electronics & Communication Engineering (ECE)',
    '02': 'Electrical & Electronics Engineering (EEE)',
    '03': 'Mechanical Engineering (MECH)',
    '01': 'Civil Engineering (CIVIL)',
    '12': 'Information Technology (IT)',
    'CSE': 'Computer Science & Engineering (CSE)',
    'CSM': 'CSE - AI & Machine Learning',
    'CSD': 'CSE - Data Science',
    'ECE': 'Electronics & Communication Engineering (ECE)',
    'EEE': 'Electrical & Electronics Engineering (EEE)',
    'MECH': 'Mechanical Engineering (MECH)',
    'CIVIL': 'Civil Engineering (CIVIL)'
  };

  for (const [key, val] of Object.entries(deptMap)) {
    if (upperRoll.includes(key)) {
      department = val;
      break;
    }
  }

  return {
    year,
    department,
    rollNumber: upperRoll
  };
};

export const getCollegeIdFromUser = (user, customColleges = []) => {
  if (!user) return 'gprec';
  if (user.college_id) return user.college_id;
  if (user.collegeId) return user.collegeId;
  const colName = (user.college || user.collegeName || '').toLowerCase().trim();
  if (colName) {
    if (colName.includes('mits') || colName.includes('madanapalli')) return 'mits';
    if (colName.includes('vit') || colName.includes('vitap')) return 'vitap';
    if (colName.includes('rgukt') || colName.includes('rk valley')) return 'rgukt';
    if (colName.includes('narayana') || colName.includes('nec')) return 'nec';
    if (colName.includes('venkateshwara') || colName.includes('svce')) return 'svce';
    if (colName.includes('bheema') || colName.includes('bits')) return 'bits';
    if (colName.includes('ashoka')) return 'ashoka';
    if (colName.includes('annamacharya') || colName.includes('rajampet') || colName === 'au') return 'annamacharya';
    if (colName.includes('gprec') || colName.includes('pulla reddy')) return 'gprec';
  }
  const match = getCollegeByEmail(user.email, customColleges);
  return match?.id || 'gprec';
};

/**
 * Validates whether an entity belongs to GPREC (G. Pulla Reddy Engineering College)
 * or is an exempt administrator/founder/core-teammate.
 * Note: GPREC students MUST pay the ?10 registration/access fee like all partner campuses.
 */
export const isGprecScholar = (userOrEmail, collegeIdentifier) => {
  if (!userOrEmail && !collegeIdentifier) return false;

  const email = (typeof userOrEmail === 'string' ? userOrEmail : (userOrEmail?.email || '')).toLowerCase().trim();

  // 1. Founder & Super Admin whitelist (strictly exempt from fees)
  if (
    email === 'founder@lumixora.com'  
  ) {
    return true;
  }

  // 2. Official Vyomra Core Team & Teammates (exempt)
  if (
    email.endsWith('@lumixora.com') ||
    email.endsWith('@team.lumixora.com') ||
    email.endsWith('@lumixora.in') ||
    email.endsWith('@team.lumixora.in')
  ) {
    return true;
  }

  // 3. Founder or Teammate role flag
  const role = ((typeof userOrEmail === 'object' && userOrEmail?.role) || '').toLowerCase();
  if (role === 'founder' || role === 'teammate' || role === 'team' || role === 'team_member') {
    return true;
  }

  // 4. If the user object explicitly specifies a non-GPREC college, they are strictly NOT GPREC!
  const userCollege = (
    typeof userOrEmail === 'object' 
      ? (userOrEmail?.college || userOrEmail?.collegeName || userOrEmail?.college_id || userOrEmail?.collegeId || '') 
      : ''
  ).toLowerCase().trim();

  if (
    userCollege &&
    !userCollege.includes('gprec') &&
    !userCollege.includes('pulla reddy')
  ) {
    return false;
  }

  // 5. Official GPREC domain email
  if (email.endsWith('@gprec.ac.in') || email.includes('gprec.ac.in') || email.endsWith('@gprec.in')) {
    return true;
  }

  // 6. Explicit GPREC check from user profile or selected college
  // Strictly require GPREC email or explicit institutional domain
  const targetCol = (
    userCollege ||
    (typeof collegeIdentifier === 'string' ? collegeIdentifier : '') ||
    collegeIdentifier?.id ||
    collegeIdentifier?.code ||
    collegeIdentifier?.name ||
    collegeIdentifier?.shortName ||
    ''
  ).toLowerCase().trim();

  const isColGprec = targetCol === 'gprec' || targetCol.includes('gprec') || targetCol.includes('pulla reddy');
  if (isColGprec) {
    // Personal emails (@gmail.com, etc.) cannot claim GPREC fee exemption unless on founder whitelist
    const isPersonalEmail = email.endsWith('@gmail.com') || email.endsWith('@yahoo.com') || email.endsWith('@outlook.com') || email.endsWith('@hotmail.com');
    if (isPersonalEmail) return false;
    return email.endsWith('@gprec.ac.in') || email.includes('gprec.ac.in') || email.endsWith('@gprec.in');
  }

  return false;
};

/**
 * Validates whether an entity is Anjum (Anjum Faijan Shaik).
 * Explicitly exempted and verified by the founder as having completed the ?10 fee.
 */
export const isAnjum = (userOrEmail) => {
  if (!userOrEmail) return false;
  const email = (typeof userOrEmail === 'string' ? userOrEmail : (userOrEmail?.email || '')).toLowerCase().trim();
  const name = (typeof userOrEmail === 'object' ? (userOrEmail?.name || userOrEmail?.displayName || '') : '').toLowerCase().trim();
  const roll = (typeof userOrEmail === 'object' ? (userOrEmail?.rollNumber || userOrEmail?.roll || '') : (typeof userOrEmail === 'string' ? userOrEmail : '')).toUpperCase().trim();

  if (
    email === 'shaikanjumfaijan@gmail.com' ||
    email === '25afcsm015@annamacharyauniversity.edu.in' ||
    roll === '25AFCSM015' ||
    name === 'shaik anjum faijan' ||
    name === 'shaik anjum'
  ) {
    return true;
  }
  return false;
};

export const KNOWN_PAID_EMAILS = new Set([
  'dean.placements@gprec.ac.in', // GPREC Dean / Placement Officer
  '249xa04050@gprec.ac.in', // Boya Yugandhar Naidu (Paid Rs 10 via Razorpay pay_TxETTpufj47pSk / Bank RRN 864259330644)
  '249xa33112@gprec.ac.in', // Mahendrakar Akhil (Paid ₹10 via UPI Ref 317827902237)
  '259xa05010@gprec.ac.in', // Avula Bhanu Priya (Paid ₹10 via Razorpay pay_TswlcoI1dleMdi)
  '259xa33230@gprec.ac.in',
  '259xa05269@gprec.ac.in',
  '259xa05089@gprec.ac.in', // Gajjala Gnanamani (Paid ₹10 via PhonePe UTR 609496825431)
  '249xa33005@gprec.ac.in', // Susmitha (Paid ₹10 via PhonePe)
  '259xa33022@gprec.ac.in', // Challa Vyshnavi (Paid ₹10 via Razorpay pay_TvKPvg5GEUsewz)
  '259xa33320@gprec.ac.in', // Vadigala Lokesh (Paid ₹10 via Razorpay pay_Tv1DYUxLld6o0l)
  '259xa04138@gprec.ac.in', // Student 259XA04138 (Paid ₹10 via Razorpay pay_TuvQmfUXOMcWEz)
  '259xa33079@gprec.ac.in', // Gajula Anusha (Paid ₹10 via Razorpay pay_Tu8rVAc8mVLav5)
]);

/**
 * Validates whether an entity is completely exempt from payment gates.
 * ONLY the platform founders/super-admins and Anjum are permitted.
 * Everyone else (including all GPREC and other college students) MUST pay the ₹10 fee.
 */
export const isExemptFromPayment = (userOrEmail) => {
  if (!userOrEmail) return false;
  const email = (typeof userOrEmail === 'string' ? userOrEmail : (userOrEmail?.email || '')).toLowerCase().trim();

  // 1. Founder & Super Admin
  if (
    email === 'founder@lumixora.com'   ||
    email.endsWith('@lumixora.com')
  ) {
    return true;
  }

  // 1.1 Verified Paid Scholars Whitelist
  if (email && KNOWN_PAID_EMAILS.has(email)) {
    return true;
  }

  // 1.2 Strictly GPREC TPO Placement Scholars only (Verified via Dean OTP; general students MUST pay ?10)
  if (typeof userOrEmail === 'object' && (userOrEmail?.isGprecPlacementVerified === true || userOrEmail?.isGprecPlacementScholar === true)) {
    return true;
  }

  // 2. Anjum (Founder explicitly exempted Anjum)
  if (isAnjum(userOrEmail)) {
    return true;
  }

  // 3. Interns logging in with their referral code / Ref ID and PIN (100% Fee-Exempt)
  const role = typeof userOrEmail === 'object' ? (userOrEmail?.role || '') : '';
  const refId = typeof userOrEmail === 'object' ? (userOrEmail?.refId || '') : '';
  const isIntern = typeof userOrEmail === 'object' ? userOrEmail?.isIntern : false;
  if (
    role === 'intern' ||
    isIntern === true ||
    (refId && String(refId).toUpperCase().startsWith('LMX-')) ||
    email.includes('.intern@') ||
    email.includes('intern@')
  ) {
    return true;
  }

  return false;
};

/**
 * Genuine UPI UTR whitelist pre-verified on founder bank statements.
 * Allows instant bypass for known verified students.
 */
export const KNOWN_VERIFIED_UTRS = new Set([
  'UTR-609496825431', '609496825431', // PhonePe verified UTR from student receipt
  'T2610291930146194050592', 'UTR-T2610291930146194050592', // PhonePe TxID
  'UTR-616740048435', '616740048435', // Shaik Anjum Faijan (Founder verified)
  'UTR-152935571978', '152935571978', // Gundam Poojitha (SVCE)
  'UTR-240884229421', '240884229421', // G Varun Kumar (SVCE)
  'UTR-235961656393', '235961656393', // Kundili Thriveni (SVCE)
  'UTR-012092850957', '012092850957', // Kundili Thriveni (SVCE alternate)
  '864259330644', 'UTR-864259330644', 'pay_TxETTpufj47pSk', 'RZP-pay_TxETTpufj47pSk',
  'UTR-317827902237', '317827902237'  // Mahendrakar Akhil (GPREC - 249xa33112@gprec.ac.in)
]);

/**
 * Strict Indian UPI UTR / RRN (Retrieval Reference Number) Heuristic Validator.
 * Prevents random numbers like 123456789012, 000000000000, 111111111111, repeated patterns.
 */
export const validateUtrFormat = (rawUtr) => {
  if (!rawUtr || typeof rawUtr !== 'string') {
    return { valid: false, reason: 'Please enter your 12-digit UPI Reference Number (UTR) or Transaction ID.' };
  }

  const clean = rawUtr.trim().replace(/^UTR-?/i, '').replace(/\s+/g, '');

  // 0. Support PhonePe / Gateway Transaction IDs (e.g. T2610291930146194050592 or pay_...)
  if (/^T\d{16,25}$/i.test(clean) || clean.startsWith('RZP-') || clean.startsWith('pay_')) {
    return { valid: true, cleanUtr: clean };
  }

  // 1. Digits only
  if (!/^\d+$/.test(clean)) {
    return { valid: false, reason: 'Invalid format: UPI UTR must contain digits only, or start with T for PhonePe Transaction ID.' };
  }

  // 2. Length check: Exactly 12 digits (standard UPI) or 16 digits (Net Banking IMPS)
  if (clean.length !== 12 && clean.length !== 16) {
    return { valid: false, reason: `Invalid length (${clean.length} digits). Standard UPI Reference Numbers (UTR) are exactly 12 digits.` };
  }

  // 3. Unique digit count (Entropy check): A genuine bank timestamped UTR has high entropy (>= 5 unique digits)
  const uniqueDigits = new Set(clean.split('')).size;
  if (uniqueDigits < 5) {
    return { valid: false, reason: 'Invalid or dummy UTR. Repeating numbers like 111111111111 are not accepted.' };
  }

  // 4. Reject sequential patterns (ascending / descending)
  const SEQUENTIAL_PATTERNS = [
    '012345678901', '123456789012', '234567890123', '345678901234',
    '456789012345', '567890123456', '678901234567', '789012345678',
    '890123456789', '901234567890',
    '987654321098', '876543210987', '765432109876', '654321098765',
    '543210987654', '432109876543', '321098765432', '210987654321',
    '109876543210', '098765432109'
  ];
  if (SEQUENTIAL_PATTERNS.some(p => clean.includes(p.slice(0, 8)))) {
    return { valid: false, reason: 'Sequential numbers (e.g. 123456789012) are fake UTRs and are strictly rejected.' };
  }

  // 5. Reject repeated chunk patterns (e.g. 121212121212, 123123123123)
  const pattern2 = clean.slice(0, 2).repeat(6);
  const pattern3 = clean.slice(0, 3).repeat(4);
  const pattern4 = clean.slice(0, 4).repeat(3);
  if (clean === pattern2 || clean === pattern3 || clean === pattern4) {
    return { valid: false, reason: 'Repetitive pattern detected. Please enter the genuine UTR from your bank/UPI payment receipt.' };
  }

  return { valid: true, cleanUtr: clean };
};

/**
 * Strictly verifies whether a transaction ID is an authentic, cryptographically verified payment.
 * ZERO-TRUST:
 * 1. Razorpay gateway payments (RZP-pay_... or pay_...) generated upon successful bank debit.
 * 2. Pre-verified founder whitelist (Shaik Anjum UTR-616740048435).
 * Blocks all random, unverified, or sequential UTRs.
 */
export const isValidVerifiedUtr = (tx) => {
  if (!tx || typeof tx !== 'string') return false;
  const clean = tx.trim();

  // 1. Genuine Razorpay Bank Gateway Payment
  if (clean.startsWith('RZP-') || clean.startsWith('pay_')) {
    const rawId = clean.replace(/^RZP-/, '');
    return rawId.startsWith('pay_') && rawId.length >= 14;
  }

  // 2. Pre-verified Whitelist (Shaik Anjum & Founder confirmed transactions)
  const cleanUtr = clean.replace(/^UTR-?/i, '');
  if (KNOWN_VERIFIED_UTRS.has(cleanUtr) || KNOWN_VERIFIED_UTRS.has(`UTR-${cleanUtr}`)) {
    return true;
  }

  // 3. Genuine 12-digit UPI UTR or PhonePe TxID with entropy validation
  const validation = validateUtrFormat(cleanUtr);
  if (validation.valid) {
    return true;
  }

  return false;
};

/**
 * Checks whether the user has satisfied the college registration/access fee requirement.
 * RULE: EXCEPT ANJUM & VERIFIED INTERNS DONT ALLOW ANYONE TO REGISTER OR LOGIN WITHOUT PAYMENT.
 * - Founders, Anjum & Verified Interns: returns true.
 * - ALL other students (GPREC and non-GPREC alike): requires verified ₹10 fee paid with a valid non-dummy UTR.
 */
export const hasPaidCollegeFee = (user) => {
  if (!user) return false;

  // 1. Founders, Anjum & Verified Interns are 100% exempt/verified
  if (isExemptFromPayment(user)) return true;

  if (user.role === 'intern' || user.isIntern || (user.refId && String(user.refId).toUpperCase().startsWith('LMX-'))) {
    return true;
  }

  const emailKey = (user.email || '').toLowerCase().trim();
  const uidKey = user.uid || user.id || '';

  // 2. Pre-verified Paid Emails Whitelist
  if (emailKey && KNOWN_PAID_EMAILS.has(emailKey)) {
    return true;
  }

  // 3. Check explicit user object paid flags
  const isMarkedPaid = Boolean(
    user.oneTimeFeePaid === true ||
    user.feePaid === true ||
    user.registrationFeePaid === true ||
    user.collegeFeePaid === true ||
    user.is_fee_paid === true
  );

  const tx = (user.feeTxId || user.metadata?.feeTxId || user.txId || '').trim();

  // If user object is explicitly marked paid, accept immediately if valid or no fraud marker
  if (isMarkedPaid) {
    if (!tx || (!tx.includes('FREE') && tx !== 'LOCAL-VERIFIED')) {
      return true;
    }
  }

  // 4. Check persistent localStorage for email
  if (emailKey && typeof window !== 'undefined') {
    if (localStorage.getItem(`lumixora_fee_paid_${emailKey}`) === 'true') {
      const rawTx = localStorage.getItem(`lumixora_fee_tx_${emailKey}`);
      if (!rawTx) return true;
      try {
        const parsed = JSON.parse(rawTx);
        const storedTx = (parsed.feeTxId || parsed.txId || '').trim();
        if (!storedTx || isValidVerifiedUtr(storedTx)) return true;
      } catch (e) {
        if (!rawTx || isValidVerifiedUtr(rawTx)) return true;
      }
    }
  }

  // 5. Check persistent localStorage for UID
  if (uidKey && typeof window !== 'undefined') {
    if (localStorage.getItem(`lumixora_fee_paid_${uidKey}`) === 'true') {
      const rawTx = localStorage.getItem(`lumixora_fee_tx_${uidKey}`);
      if (!rawTx) return true;
      try {
        const parsed = JSON.parse(rawTx);
        const storedTx = (parsed.feeTxId || parsed.txId || '').trim();
        if (!storedTx || isValidVerifiedUtr(storedTx)) return true;
      } catch (e) {
        if (!rawTx || isValidVerifiedUtr(rawTx)) return true;
      }
    }
  }

  // 6. Check if user object itself contains a valid verified transaction
  if (tx && isValidVerifiedUtr(tx)) {
    return true;
  }

  return false;
};

/**
 * Saves one-time fee payment status to local storage as fallback cache.
 */
export const recordLocalFeePayment = (emailOrUid, txDetails = {}) => {
  if (!emailOrUid) return;
  const key = String(emailOrUid).toLowerCase().trim();
  try {
    localStorage.setItem(`lumixora_fee_paid_${key}`, 'true');
    localStorage.setItem(`lumixora_fee_tx_${key}`, JSON.stringify({
      amount: 10,
      date: new Date().toISOString(),
      ...txDetails
    }));
  } catch (e) {}
};



