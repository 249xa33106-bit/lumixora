/**
 * campusSubdomain.js
 * Central detector for the Universal Campus Placement Subdomain (campus.lumixora.in)
 * Dedicated to all other college & university students outside GPREC.
 * 
 * Matches:
 *  - campus.lumixora.in
 *  - campus.lumixora.pages.dev
 *  - ?subdomain=campus or ?portal=campus or ?mode=campus
 *  - /campus or /campus/
 *  - #campus or #campus/
 */

export function isCampusSubdomain() {
  if (typeof window === 'undefined') return false;

  const hostname = (window.location.hostname || '').toLowerCase();
  const pathname = (window.location.pathname || '').toLowerCase();
  const search = (window.location.search || '').toLowerCase();
  const hash = (window.location.hash || '').toLowerCase();

  // Strict domain isolation: GPREC & TPO subdomains can NEVER be treated as Campus
  if (
    hostname.startsWith('gprec.') ||
    hostname.includes('gprec.lumixora') ||
    hostname.startsWith('tpo.') ||
    hostname.includes('tpo.lumixora')
  ) {
    return false;
  }

  // 1. Hostname detection (e.g. campus.lumixora.in, campus.lumixora.pages.dev)
  if (
    hostname.startsWith('campus.') ||
    hostname.includes('campus.lumixora') ||
    hostname.includes('campus-lumixora')
  ) {
    return true;
  }

  // 2. Query param detection (e.g. lumixora.in/?subdomain=campus or ?portal=campus)
  if (
    search.includes('subdomain=campus') ||
    search.includes('portal=campus') ||
    search.includes('view=campus') ||
    search.includes('mode=campus')
  ) {
    return true;
  }

  // 3. Pathname detection (e.g. /campus or /campus/dashboard)
  if (
    pathname === '/campus' ||
    pathname.startsWith('/campus/')
  ) {
    return true;
  }

  // 4. Hash detection (e.g. #campus or #campus-portal)
  if (
    hash === '#campus' ||
    hash.startsWith('#campus/') ||
    hash === '#campus-portal' ||
    hash === '#campus-placement'
  ) {
    return true;
  }

  return false;
}

export const CAMPUS_ALLOWED_TABS = [
  'campus-commander', 'campus-home',
  'company-papers', 'placement-papers',
  'interview', 'mock-interview', 'ai-interview',
  'coding-practice', 'code-editor', 'code-cinema',
  'aptitude-arena', 'aptitude',
  'resume', 'ai-resume',
  'tech-pulse', 'tech-news', 'jobs-radar',
  'certificates', 'proof-of-skill', 'badges', 'verify',
  'career-roadmap', 'career-roles',
  'internships', 'student-offers',
  'speakverse',
  'contact', 'report-bug'
];

export function isAllowedCampusTab(tab) {
  if (!tab || typeof tab !== 'string') return false;
  const t = tab.toLowerCase().trim();
  return CAMPUS_ALLOWED_TABS.includes(t);
}

export default isCampusSubdomain;
