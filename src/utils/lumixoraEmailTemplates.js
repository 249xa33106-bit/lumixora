/**
 * Lumixora Client-Side Email Template Visualizer & Previews
 * Used by the Admin Email Command Center to preview templates before dispatching.
 */

export const AVAILABLE_TEMPLATES = [
  {
    key: 'otp_verification',
    name: '1. Student OTP Security Verification',
    badge: 'P1 URGENT',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    sender: 'security@lumixora.in',
    sampleSubject: 'Your Lumixora Verification Code: 489210',
    description: 'High-security 6-digit rolling code with expiration window and institutional metadata.'
  },
  {
    key: 'welcome_scholar',
    name: '2. Scholar Welcome & Onboarding',
    badge: 'P2 TRANSACTIONAL',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    sender: 'welcome@lumixora.in',
    sampleSubject: 'Welcome to Lumixora Campus Suite, Scholar',
    description: 'Formal clearance certificate welcoming whitelisted students with department and portal credentials.'
  },
  {
    key: 'password_reset',
    name: '3. Password Reset & Recovery',
    badge: 'P1 URGENT',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    sender: 'security@lumixora.in',
    sampleSubject: 'Lumixora Password Reset Code: 839120',
    description: 'Recovery code for authorized officers, faculty coordinators, and student accounts.'
  },
  {
    key: 'placement_opportunity',
    name: '4. Placement Drive & Opportunity Alert',
    badge: 'P3 ANNOUNCEMENT',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    sender: 'careers@lumixora.in',
    sampleSubject: 'Placement Opportunity: Google (18.5 LPA) — Apply by Oct 24',
    description: 'Company hiring notification with role, package, eligibility criteria, and 1-click portal link.'
  },
  {
    key: 'certificate_delivery',
    name: '5. Proof-of-Skill Certificate Delivery',
    badge: 'P2 TRANSACTIONAL',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    sender: 'certificates@lumixora.in',
    sampleSubject: 'Your Verified Certificate: Full Stack AI Engineer — LMX-CERT-2026',
    description: 'Achievement delivery with official credential ID, verification URL, and digital transcript link.'
  },
  {
    key: 'internship_passcode',
    name: '6. Internship Workspace Security Passcode',
    badge: 'P1 URGENT',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    sender: 'careers@lumixora.in',
    sampleSubject: 'Your Lumixora Workspace Passcode: LMX-789021',
    description: 'Provisioning passcode for product engineering, research, and campus ambassador interns.'
  },
  {
    key: 'platform_announcement',
    name: '7. Campus Intelligence & Feature Announcement',
    badge: 'P3 PROMOTIONAL',
    badgeColor: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    sender: 'notifications@lumixora.in',
    sampleSubject: 'New on Lumixora: AI Mock Interview Rooms & Exam Radar',
    description: 'Academic updates and student perks with compliant One-Click Unsubscribe headers.'
  },
  {
    key: 'admin_security_alert',
    name: '8. Founder / Admin Security Telemetry Alert',
    badge: 'P1 CRITICAL',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    sender: 'security@lumixora.in',
    sampleSubject: '🚨 Lumixora Security Alert: Unusual Login Velocity',
    description: 'Automated administrative telemetry notification for login spikes, IP anomalies, and system audits.'
  }
];
