/**
 * placementSubdomain.js
 * Central detector for GPREC Institutional Placement Suite & TPO Subdomains
 * Matches:
 *  - gprec.lumixora.in (Scholar & Placement Suite)
 *  - tpo.lumixora.in (Dedicated TPO & Faculty Portal)
 */

/**
 * Detects whether the current session is on the dedicated TPO portal:
 * Matches:
 *  - Hostname containing "tpo." or "tpo.lumixora"
 *  - Query param ?subdomain=tpo or ?portal=tpo or ?view=tpo
 *  - Pathname /tpo or /tpo/
 *  - Hash #tpo or #tpo-portal
 */
export function isTpoSubdomain() {
  if (typeof window === 'undefined') return false;

  const hostname = (window.location.hostname || '').toLowerCase();
  const pathname = (window.location.pathname || '').toLowerCase();
  const search = (window.location.search || '').toLowerCase();
  const hash = (window.location.hash || '').toLowerCase();

  // 1. Hostname detection (e.g. tpo.lumixora.in, tpo.lumixora.pages.dev)
  if (
    hostname.startsWith('tpo.') ||
    hostname.includes('tpo.lumixora') ||
    hostname.includes('tpo-lumixora')
  ) {
    return true;
  }

  // 2. Query param detection (e.g. lumixora.in/?subdomain=tpo or ?portal=tpo)
  if (
    search.includes('subdomain=tpo') ||
    search.includes('portal=tpo') ||
    search.includes('view=tpo') ||
    search.includes('mode=tpo')
  ) {
    return true;
  }

  // 3. Pathname detection (e.g. /tpo or /tpo/dashboard)
  if (
    pathname === '/tpo' ||
    pathname.startsWith('/tpo/')
  ) {
    return true;
  }

  // 4. Hash detection (e.g. #tpo or #tpo-portal)
  if (
    hash === '#tpo' ||
    hash === '#tpo-portal' ||
    hash.startsWith('#tpo/')
  ) {
    return true;
  }

  return false;
}

export function isGprecPlacementSubdomain() {
  if (typeof window === 'undefined') return false;

  // If on tpo.lumixora.in, it is inherently part of the institutional placement ecosystem
  if (isTpoSubdomain()) return true;

  const hostname = (window.location.hostname || '').toLowerCase();
  const pathname = (window.location.pathname || '').toLowerCase();
  const search = (window.location.search || '').toLowerCase();
  const hash = (window.location.hash || '').toLowerCase();

  // 1. Hostname detection (e.g. gprec.lumixora.in, gprec.lumixora.pages.dev, gprec-placement.lumixora.in)
  if (
    hostname.startsWith('gprec.') ||
    hostname.includes('gprec.lumixora') ||
    hostname.includes('gprec-placement') ||
    hostname.startsWith('placement.gprec')
  ) {
    return true;
  }

  // 2. Query param detection (e.g. lumixora.pages.dev/?subdomain=gprec or ?portal=gprec)
  if (
    search.includes('subdomain=gprec') ||
    search.includes('portal=gprec') ||
    search.includes('portal=placement') ||
    search.includes('view=gprec')
  ) {
    return true;
  }

  // 3. Pathname detection (e.g. /gprec or /gprec/placements)
  if (
    pathname === '/gprec' ||
    pathname.startsWith('/gprec/') ||
    pathname === '/placement' ||
    pathname === '/placements'
  ) {
    return true;
  }

  // 4. Hash-based detection (e.g. #gprec or #gprec-placement)
  if (
    hash === '#gprec' ||
    hash.startsWith('#gprec/') ||
    hash === '#gprec-placement' ||
    hash === '#placement-portal'
  ) {
    return true;
  }

  return false;
}

/**
 * Detects whether the current session is specifically on the GPREC Scholar Placement Portal
 * (e.g. gprec.lumixora.in, ?subdomain=gprec, /gprec) and NOT on the dedicated TPO Portal (tpo.lumixora.in).
 */
export function isGprecOnlySubdomain() {
  if (typeof window === 'undefined') return false;
  return isGprecPlacementSubdomain() && !isTpoSubdomain();
}

/**
 * Portals exclusively permitted on the GPREC Placement Suite & TPO Command Suite
 */
export const TPO_FACULTY_ONLY_PORTALS = [
  'tpo-dashboard',
  'tpo-analytics',
  'tpo-command-center',
  'student-database',
  'student-placement-db',
  'placement-database',
  'faculty-portal',
  'contact',
  'report-bug'
];

export const GPREC_PLACEMENT_PORTALS = [
  'tpo-dashboard',      // Placement Officer Command Center
  'tpo-command-center',
  'student-database',   // Student Placement Database (HRMS Candidate Profile System)
  'student-placement-db',
  'placement-database',
  'company-management', // Company & Recruiter Management
  'recruitment-drives', // Recruitment Drive Manager
  'placement-shortlisting', // Eligibility & Shortlisting
  'interview-tracker',  // Selection & Interview Tracker
  'offer-verification', // Offer & Placement Verification
  'placement-training', // Placement Training Management (CRT)
  'placement-announcements', // Announcements & Notifications
  'faculty-portal',     // T&P Faculty Portal
  'test-portal',        // Tests & Assessment Hub / Coding Assessments
  'tests',
  'assignments',
  'tpo-analytics',      // Placement Cohort Analytics
  'ai-commander',       // AI Placement Commander™
  'tech-pulse',         // TechPulse™ Live Tech News, Jobs, Hikes & Trends Radar
  'speakverse',         // LUMIXORA SpeakVerse™ 2.0 (Interview, GD, Extempore)
  'interview',          // AI Mock Interview Room
  'coding-practice',    // Code Arena & 30D Java / DSA
  'company-papers',     // Company Placement Papers
  'aptitude-arena',     // Aptitude & Reasoning Arena
  'resume',             // AI Resume Creator & ATS Scanner
  'certificates',       // Proof-of-Skill Badges & Verified Certificates
  'alumni-referrals',   // Alumni Referral Bridge & Off-Campus Drives
  'internships',        // Placement Internships
  'career-roadmap'      // Role-Specific Placement Roadmaps
];


/**
 * Strict validator for allowed placement portals on gprec.lumixora.in
 */
export function isAllowedGprecPlacementTab(tab) {
  if (!tab || typeof tab !== 'string') return false;
  const t = tab.toLowerCase().trim();
  const allowed = [
    'ai-commander', 'placement-commander',
    'tech-pulse', 'tech-news', 'jobs-radar', 'tech-radar',
    'speakverse',
    'interview', 'mock-interview', 'ai-interview', 'interview-room',
    'coding-practice', 'code-editor',
    'test-portal', 'tests', 'assignments', 'tests-assignments',
    'company-papers', 'placement-papers',
    'aptitude-arena', 'aptitude',
    'resume', 'ai-resume',
    'certificates', 'proof-of-skill', 'badges', 'credentials', 'verify', 'verify-cert', 'cert-verify',
    'alumni', 'alumni-referrals', 'alumni-bridge', 'referrals',
    'career-roadmap', 'career-roles',
    'internships', 'internship',
    'future-twin', 'twin', 'ai-twin', 'ai-future-twin',
    'contact', 'report-bug',
    'tpo-dashboard', 'tpo-command-center', 'tpo-analytics',
    'student-database', 'student-placement-db', 'placement-database', 'faculty-portal'
  ];
  return allowed.includes(t);
}
