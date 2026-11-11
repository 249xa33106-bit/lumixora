/**
 * placementSubdomain.js
 * Central detector for GPREC Institutional Placement Suite
 * Matches:
 *  - Hostname containing "gprec." or "gprec-placement" or "gprec.lumixora"
 *  - Pathname starting with /gprec or /placement or /placements
 *  - Query param ?portal=gprec or ?portal=placement or ?subdomain=gprec
 *  - Hash starting with #gprec or #placement or #placements
 */

export function isGprecPlacementSubdomain() {
  if (typeof window === 'undefined') return false;

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
 * Portals exclusively permitted on the GPREC Placement Suite
 */
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
