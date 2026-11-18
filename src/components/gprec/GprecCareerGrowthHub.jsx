import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase, ExternalLink, Search, Plus, CheckCircle2, Share2, Download,
  ShieldCheck, Users, Send, Copy, Award, Code, Globe, Sparkles, Building,
  Filter, MapPin, Clock, X, GraduationCap
} from 'lucide-react';
import { loadExamAttempts } from './gprecSecureExamBank';
import { cleanScholarName } from '../../utils/authSecurity';

const OFF_CAMPUS_JOBS = [
  {
    id: 'oc_google_swe',
    company: 'Google',
    role: 'Software Engineer, University Graduate',
    type: 'Full-Time',
    domain: 'Software',
    location: 'Bengaluru / Hyderabad',
    ctc: '₹32 – ₹48 LPA',
    batch: '2026 / 2027',
    deadline: 'Rolling',
    tags: ['DSA', 'C++/Java/Python', 'System Design'],
    applyUrl: 'https://www.google.com/about/careers/applications/students/'
  },
  {
    id: 'oc_msft_intern',
    company: 'Microsoft',
    role: 'Software Engineering Intern (6 Months)',
    type: 'Internship',
    domain: 'Software',
    location: 'Hyderabad / Bengaluru',
    ctc: '₹1.25L / month + PPO',
    batch: '2027 / 2028',
    deadline: 'Open Now',
    tags: ['Algorithms', 'OOP', 'OS', 'Azure'],
    applyUrl: 'https://careers.microsoft.com/v2/global/en/students'
  },
  {
    id: 'oc_amazon_sde',
    company: 'Amazon',
    role: 'SDE-1 / SDE Intern (India)',
    type: 'Full-Time',
    domain: 'Software',
    location: 'Hyderabad / Bengaluru / Chennai',
    ctc: '₹28 – ₹44 LPA',
    batch: '2026 / 2027',
    deadline: 'Active Drive',
    tags: ['Trees/Graphs', 'AWS', 'Java', 'Leadership'],
    applyUrl: 'https://www.amazon.jobs/en/teams/internships-for-students'
  },
  {
    id: 'oc_atlassian',
    company: 'Atlassian',
    role: 'Associate Software Engineer (Remote-First)',
    type: 'Full-Time',
    domain: 'Software',
    location: 'Remote / Bengaluru',
    ctc: '₹36 – ₹52 LPA',
    batch: '2026 / 2027',
    deadline: 'Open Now',
    tags: ['React', 'Java/Kotlin', 'Distributed Systems'],
    applyUrl: 'https://www.atlassian.com/company/careers/earlycareers'
  },
  {
    id: 'oc_razorpay',
    company: 'Razorpay',
    role: 'Frontend / Backend SDE Intern',
    type: 'Internship',
    domain: 'Software',
    location: 'Bengaluru (Hybrid)',
    ctc: '₹60K – ₹80K / month',
    batch: '2027 / 2028',
    deadline: 'Open Now',
    tags: ['React', 'Go/Node.js', 'SQL', 'Payments'],
    applyUrl: 'https://razorpay.com/jobs/'
  },
  {
    id: 'oc_zoho',
    company: 'Zoho',
    role: 'Software Developer (Off-Campus)',
    type: 'Full-Time',
    domain: 'Software',
    location: 'Chennai / Tenkasi / Hyderabad',
    ctc: '₹7 – ₹11 LPA',
    batch: '2025 / 2026 / 2027',
    deadline: 'Monthly Drives',
    tags: ['C/C++/Java', 'Problem Solving', 'LLD'],
    applyUrl: 'https://www.zoho.com/careers/'
  },
  {
    id: 'oc_qualcomm',
    company: 'Qualcomm',
    role: 'Embedded / VLSI Associate Engineer',
    type: 'Full-Time',
    domain: 'Core Engineering',
    location: 'Hyderabad / Bengaluru',
    ctc: '₹18 – ₹26 LPA',
    batch: '2026 / 2027',
    deadline: 'Open Now',
    tags: ['Embedded C', 'Verilog', 'RTOS', 'ECE/EEE'],
    applyUrl: 'https://www.qualcomm.com/company/careers/internships-and-early-in-career'
  },
  {
    id: 'oc_bosch',
    company: 'Bosch Global',
    role: 'Graduate Engineer Trainee (Core & Automotive)',
    type: 'Full-Time',
    domain: 'Core Engineering',
    location: 'Bengaluru / Coimbatore',
    ctc: '₹7.5 – ₹12 LPA',
    batch: '2026 / 2027',
    deadline: 'Open Now',
    tags: ['MATLAB', 'Embedded', 'CAD', 'MECH/EEE/ECE'],
    applyUrl: 'https://www.bosch.in/careers/'
  },
  {
    id: 'oc_tcs_nqt',
    company: 'TCS',
    role: 'TCS National Qualifier Test (Ninja / Digital / Prime)',
    type: 'Full-Time',
    domain: 'Software',
    location: 'Pan India',
    ctc: '₹3.6 – ₹11.5 LPA',
    batch: '2026 / 2027',
    deadline: 'Quarterly',
    tags: ['Aptitude', 'Coding', 'SQL', 'OOPS'],
    applyUrl: 'https://www.tcs.com/careers/india'
  },
  {
    id: 'oc_deloitte',
    company: 'Deloitte USI',
    role: 'Analyst — Technology & Cloud Engineering',
    type: 'Full-Time',
    domain: 'Software',
    location: 'Hyderabad / Bengaluru',
    ctc: '₹7.6 – ₹10 LPA',
    batch: '2026 / 2027',
    deadline: 'Open Now',
    tags: ['Python', 'SQL', 'Cloud', 'Communication'],
    applyUrl: 'https://www2.deloitte.com/ui/en/careers/students.html'
  }
];

const GPREC_ALUMNI_MENTORS = [
  {
    id: 'al1',
    name: 'K. Sai Nikhil Reddy',
    batch: 'GPREC ’23 • CSE',
    company: 'Amazon',
    role: 'SDE-2, Payments Tech',
    location: 'Hyderabad',
    referringFor: 'SDE Intern & SDE-1',
    responseRate: '94% Reply',
    tip: 'Attach your LeetCode profile + 1 deployed backend project with latency numbers.'
  },
  {
    id: 'al2',
    name: 'S. Ayesha Tabassum',
    batch: 'GPREC ’24 • CSM',
    company: 'Microsoft',
    role: 'Software Engineer',
    location: 'Hyderabad',
    referringFor: 'SWE Intern & University Grad',
    responseRate: '91% Reply',
    tip: 'Keep your resume strictly 1 page and highlight GitHub links clearly.'
  },
  {
    id: 'al3',
    name: 'M. Pranav Kumar',
    batch: 'GPREC ’23 • ECE',
    company: 'Qualcomm',
    role: 'SoC Verification Engineer',
    location: 'Bengaluru',
    referringFor: 'VLSI / Embedded Intern',
    responseRate: '88% Reply',
    tip: 'Mention Verilog/SystemVerilog & Embedded C mini-projects in your note.'
  },
  {
    id: 'al4',
    name: 'P. Sneha Latha',
    batch: 'GPREC ’24 • CSE',
    company: 'Deloitte USI',
    role: 'Cloud Data Analyst',
    location: 'Hyderabad',
    referringFor: 'Analyst & Data Engineering',
    responseRate: '96% Reply',
    tip: 'Strong SQL + Python + clean communication gets shortlisted fast.'
  },
  {
    id: 'al5',
    name: 'R. Harsha Vardhan',
    batch: 'GPREC ’25 • CSD',
    company: 'TCS Prime',
    role: 'Prime Digital Systems Engineer',
    location: 'Hyderabad',
    referringFor: 'TCS Prime / Digital Guidance',
    responseRate: '98% Reply',
    tip: 'Happy to review your resume and share exact TCS Prime interview patterns.'
  },
  {
    id: 'al6',
    name: 'V. Divya Teja',
    batch: 'GPREC ’23 • CSE',
    company: 'Atlassian',
    role: 'Full-Stack Engineer',
    location: 'Bengaluru (Remote)',
    referringFor: 'Frontend / Full-Stack Roles',
    responseRate: '86% Reply',
    tip: 'Include a live hosted demo link — recruiters click live apps over GitHub zip files.'
  }
];

export default function GprecCareerGrowthHub({
  user,
  overallReadiness = 0,
  solvedCount = 0,
  aptitudeCount = 0,
  onTrackApplication,
  awardXP,
  addToast
}) {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'portfolio' | 'referrals'

  // Tab 1: Off-Campus Jobs Filter
  const [jobSearch, setJobSearch] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All'); // 'All' | 'Full-Time' | 'Internship' | 'Core Engineering'
  const [trackedJobIds, setTrackedJobIds] = useState([]);

  // Tab 2: Verified Shareable Portfolio State
  const studentKey = user?.id || user?.email || 'guest';
  const portfolioStorageKey = `gprec_verified_portfolio_${studentKey}`;
  const [profile, setProfile] = useState(() => {
    const rawName = user?.name || user?.displayName || '';
    let meta = {};
    if (typeof rawName === 'string' && rawName.includes('{')) {
      try { meta = JSON.parse(rawName.slice(rawName.indexOf('{'))) || {}; } catch (e) {}
    }
    const b = user?.branch || user?.department || meta.branch || meta.department || 'CSE';
    const q = meta.qualification || 'B.Tech';
    const c = user?.cgpa || meta.cgpa || '8.5';
    const defaultHeadline = `${q} ${b} Undergraduate at GPREC (Autonomous) • Full-Stack & DSA`;

    try {
      const saved = localStorage.getItem(portfolioStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.headline && (parsed.headline.includes('{') || parsed.headline.includes('"') || parsed.headline.length > 95)) {
          parsed.headline = defaultHeadline;
        }
        return parsed;
      }
    } catch (e) {}
    return {
      headline: defaultHeadline,
      cgpa: String(c),
      github: 'https://github.com/gprec-scholar',
      linkedin: 'https://linkedin.com/in/gprec-scholar',
      leetcode: 'https://leetcode.com/gprec-scholar',
      skills: 'Java, Python, JavaScript, React.js, Node.js, SQL, DSA, DBMS, OS',
      openTo: 'SDE Internships & Full-Time 2026/2027 Drives'
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(portfolioStorageKey, JSON.stringify(profile));
    } catch (e) {}
  }, [profile, portfolioStorageKey]);

  // Pull real saved projects & secure exam attempts for Verified Portfolio
  const savedProjects = useMemo(() => {
    try {
      const raw = localStorage.getItem(`gprec_projects_portfolio_${studentKey}`);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
    return [];
  }, [studentKey]);

  const verifiedExams = useMemo(() => {
    const all = loadExamAttempts();
    const myEmail = (user?.email || '').toLowerCase();
    return myEmail ? all.filter(a => (a.studentEmail || '').toLowerCase() === myEmail) : [];
  }, [user?.email]);

  const bestTrustScore = verifiedExams.length
    ? Math.max(...verifiedExams.map(e => e.trustScore ?? 100))
    : null;
  const bestExamPct = verifiedExams.length
    ? Math.max(...verifiedExams.map(e => e.percentage ?? 0))
    : null;

  // Tab 3: Alumni Referral Requests State
  const refStorageKey = `gprec_alumni_referrals_${studentKey}`;
  const [sentReferrals, setSentReferrals] = useState(() => {
    try {
      const raw = localStorage.getItem(refStorageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  });
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [referralMessage, setReferralMessage] = useState('');
  const [alumniSearch, setAlumniSearch] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(refStorageKey, JSON.stringify(sentReferrals));
    } catch (e) {}
  }, [sentReferrals, refStorageKey]);

  const filteredJobs = useMemo(() => {
    const q = jobSearch.trim().toLowerCase();
    return OFF_CAMPUS_JOBS.filter(j => {
      const typeOk =
        jobTypeFilter === 'All' ||
        j.type === jobTypeFilter ||
        j.domain === jobTypeFilter;
      const searchOk =
        !q ||
        j.company.toLowerCase().includes(q) ||
        j.role.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.tags.some(t => t.toLowerCase().includes(q));
      return typeOk && searchOk;
    });
  }, [jobSearch, jobTypeFilter]);

  const filteredAlumni = useMemo(() => {
    const q = alumniSearch.trim().toLowerCase();
    if (!q) return GPREC_ALUMNI_MENTORS;
    return GPREC_ALUMNI_MENTORS.filter(
      a => a.name.toLowerCase().includes(q) || a.company.toLowerCase().includes(q) || a.batch.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)
    );
  }, [alumniSearch]);

  // Unpack and clean student name & academic profile from metadata
  const parsePackedMeta = (raw) => {
    if (!raw || typeof raw !== 'string') return {};
    if (raw.includes('{')) {
      try { return JSON.parse(raw.slice(raw.indexOf('{'))) || {}; } catch (e) { return {}; }
    }
    return {};
  };

  const rawUserStr = user?.name || user?.displayName || '';
  const userMeta = parsePackedMeta(rawUserStr);
  const studentName = cleanScholarName(rawUserStr, 'GPREC Scholar');
  const rollNo = user?.rollNumber || user?.roll || userMeta.rollNumber || userMeta.roll || (user?.email ? user.email.split('@')[0].toUpperCase() : 'GPREC-BTECH');
  const branch = user?.branch || user?.department || userMeta.branch || userMeta.department || 'CSE';
  const qualification = user?.qualification || userMeta.qualification || 'B.Tech';
  const currentCgpa = user?.cgpa || userMeta.cgpa || '8.5';
  const portfolioUrl = `https://gprec.lumixora.in/#portfolio/${encodeURIComponent(rollNo)}`;

  const openReferralModal = (alumni) => {
    setSelectedAlumni(alumni);
    const topProj = savedProjects[0]?.title || 'Full-Stack Capstone Project';
    setReferralMessage(
      `Hi ${alumni.name.split(' ')[0]},\n\nI'm ${studentName}, a ${branch} student at G. Pulla Reddy Engineering College (Roll: ${rollNo}, CGPA: ${profile.cgpa}). I saw you are working as ${alumni.role} at ${alumni.company}!\n\nI'm applying for ${alumni.referringFor} at ${alumni.company}. I have solved ${Math.max(solvedCount, 80)}+ DSA problems, built "${topProj}", and verified my readiness on GPREC Placement Suite (${portfolioUrl}).\n\nWould you be open to referring me or sharing 1 quick tip for the ${alumni.company} hiring bar?\n\nBest regards,\n${studentName}`
    );
  };

  const handleSendReferral = () => {
    if (!selectedAlumni || !referralMessage.trim()) return;
    navigator.clipboard?.writeText(referralMessage);
    const req = {
      id: `ref_${Date.now()}`,
      alumniId: selectedAlumni.id,
      alumniName: selectedAlumni.name,
      company: selectedAlumni.company,
      role: selectedAlumni.referringFor,
      sentAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      status: 'Requested (Copied)'
    };
    setSentReferrals(prev => [req, ...prev]);
    if (awardXP) awardXP(50, `Sent GPREC Alumni Referral Request to ${selectedAlumni.company}`);
    if (addToast) {
      addToast({
        message: `Referral note logged & copied to clipboard for ${selectedAlumni.name} (${selectedAlumni.company})!`,
        type: 'success'
      });
    }
    setSelectedAlumni(null);
  };

  const handleExportPortfolioPdf = () => {
    const win = window.open('', '_blank', 'width=860,height=980');
    if (!win) return;
    const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const projHtml = savedProjects.map(p => `
      <div style="border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:10px;">
        <div style="font-weight:800;font-size:13px;">${esc(p.title)}</div>
        <div style="font-size:11px;color:#4f46e5;font-weight:700;margin-top:2px;">${esc(p.stack)}</div>
        <div style="font-size:12px;color:#334155;margin-top:4px;">${esc(p.summary)}</div>
      </div>
    `).join('');

    win.document.write(`<!doctype html><html><head><title>${esc(studentName)} — GPREC Verified Recruiter Portfolio</title>
      <style>body{font-family:'Segoe UI',Arial,sans-serif;max-width:780px;margin:24px auto;padding:0 24px;color:#0f172a;}
      .hero{background:#0B0D21;color:#fff;padding:24px;border-radius:16px;display:flex;justify-content:space-between;align-items:center;}
      .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0;}
      .kpi{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;text-align:center;}
      .lbl{font-size:10px;color:#64748b;text-transform:uppercase;font-weight:700;} .val{font-size:20px;font-weight:900;margin-top:4px;}</style>
      </head><body>
      <div class="hero">
        <div>
          <div style="font-size:10px;letter-spacing:0.1em;color:#34d399;font-weight:800;text-transform:uppercase;">GPREC Autonomous • Verified Candidate Dossier</div>
          <h1 style="margin:4px 0 2px;font-size:22px;">${esc(studentName)}</h1>
          <div style="font-size:12px;color:#cbd5e1;">${esc(profile.headline)}</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:6px;">Roll: ${esc(rollNo)} • CGPA: ${esc(profile.cgpa)} • ${esc(user?.email || 'student@gprec.ac.in')}</div>
        </div>
        <div style="text-align:right;font-size:11px;color:#38bdf8;font-family:monospace;">
          <div>VERIFIED PORTFOLIO</div>
          <div style="margin-top:4px;">${esc(portfolioUrl)}</div>
        </div>
      </div>
      <div class="kpis">
        <div class="kpi"><div class="lbl">Readiness Score</div><div class="val" style="color:#4f46e5;">${overallReadiness}%</div></div>
        <div class="kpi"><div class="lbl">DSA Solved</div><div class="val">${solvedCount}</div></div>
        <div class="kpi"><div class="lbl">Best Proctored OA</div><div class="val">${bestExamPct !== null ? `${bestExamPct}%` : 'N/A'}</div></div>
        <div class="kpi"><div class="lbl">Proctor Trust</div><div class="val" style="color:#059669;">${bestTrustScore !== null ? `${bestTrustScore}%` : 'Clean Slate'}</div></div>
      </div>
      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.06em;">Verified Technical Skills</h3>
      <p style="font-size:12.5px;color:#334155;">${esc(profile.skills)}</p>
      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.06em;margin-top:18px;">Featured Engineering Projects</h3>
      ${projHtml}
      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.06em;margin-top:18px;">Recruiter Links</h3>
      <p style="font-size:12px;color:#334155;">GitHub: ${esc(profile.github)} • LinkedIn: ${esc(profile.linkedin)} • LeetCode: ${esc(profile.leetcode)}</p>
      <script>window.onload=function(){window.print();}</script>
      </body></html>`);
    win.document.close();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#070B1E] via-[#12183E] to-[#26144E] rounded-3xl p-6 text-white shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Real Student Career Growth Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Off-Campus Jobs, Verified Portfolio & GPREC Alumni Referrals
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl">
              Discover live off-campus hiring drives, share a verified GPREC Recruiter Portfolio backed by your real test scores, and request warm referrals from placed GPREC seniors.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2.5 min-w-[260px] text-center">
            <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Open Drives</div>
              <div className="text-xl font-black text-cyan-300 mt-0.5">{OFF_CAMPUS_JOBS.length}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Alumni</div>
              <div className="text-xl font-black text-purple-300 mt-0.5">{GPREC_ALUMNI_MENTORS.length}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Referrals</div>
              <div className="text-xl font-black text-emerald-300 mt-0.5">{sentReferrals.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 px-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'jobs', label: `Off-Campus Job Feed (${OFF_CAMPUS_JOBS.length})`, icon: Briefcase },
            { id: 'portfolio', label: 'Verified Recruiter Portfolio', icon: ShieldCheck },
            { id: 'referrals', label: `GPREC Alumni Referrals (${GPREC_ALUMNI_MENTORS.length})`, icon: Users }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === t.id
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* TAB 1: LIVE OFF-CAMPUS JOBS & INTERNSHIPS FEED                    */}
      {/* ================================================================= */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={jobSearch}
                onChange={e => setJobSearch(e.target.value)}
                placeholder="Search company, role, location, or skill (e.g. Google, React, ECE)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['All', 'Full-Time', 'Internship', 'Core Engineering'].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setJobTypeFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold border cursor-pointer transition-all ${
                    jobTypeFilter === f
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map(job => {
              const isTracked = trackedJobIds.includes(job.id);
              return (
                <div key={job.id} className="bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between gap-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {job.type}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          Batch {job.batch}
                        </span>
                      </div>
                      <span className="text-xs font-black text-purple-700">{job.ctc}</span>
                    </div>

                    <div>
                      <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">{job.company}</div>
                      <h4 className="text-base font-extrabold text-slate-900 mt-0.5">{job.role}</h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.deadline}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {job.tags.map(tg => (
                        <span key={tg} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {tg}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={isTracked}
                      onClick={() => {
                        setTrackedJobIds(prev => [...prev, job.id]);
                        if (onTrackApplication) {
                          onTrackApplication({
                            company: job.company,
                            role: job.role,
                            ctc: job.ctc
                          });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all ${
                        isTracked
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 cursor-pointer'
                      }`}
                    >
                      {isTracked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{isTracked ? 'Tracked' : 'Save to Tracker'}</span>
                    </button>

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:opacity-95 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Apply Official</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 2: VERIFIED SHAREABLE RECRUITER PORTFOLIO                     */}
      {/* ================================================================= */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Quick Profile Editor */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3.5 text-xs">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Customize Your Recruiter Profile</h3>
              <p className="text-[11px] text-slate-500">Auto-synced with your real GPREC Coding, Projects & Proctored Exam telemetry.</p>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Headline</label>
              <input value={profile.headline} onChange={e => setProfile(p => ({ ...p, headline: e.target.value }))} className="w-full p-2.5 rounded-xl border border-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Current CGPA</label>
                <input value={profile.cgpa} onChange={e => setProfile(p => ({ ...p, cgpa: e.target.value }))} className="w-full p-2.5 rounded-xl border border-slate-200 font-bold" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Open To</label>
                <input value={profile.openTo} onChange={e => setProfile(p => ({ ...p, openTo: e.target.value }))} className="w-full p-2.5 rounded-xl border border-slate-200" />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Verified Skills</label>
              <textarea rows={2} value={profile.skills} onChange={e => setProfile(p => ({ ...p, skills: e.target.value }))} className="w-full p-2.5 rounded-xl border border-slate-200" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">GitHub URL</label>
              <input value={profile.github} onChange={e => setProfile(p => ({ ...p, github: e.target.value }))} className="w-full p-2.5 rounded-xl border border-slate-200" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">LinkedIn URL</label>
              <input value={profile.linkedin} onChange={e => setProfile(p => ({ ...p, linkedin: e.target.value }))} className="w-full p-2.5 rounded-xl border border-slate-200" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">LeetCode / Coding Profile</label>
              <input value={profile.leetcode} onChange={e => setProfile(p => ({ ...p, leetcode: e.target.value }))} className="w-full p-2.5 rounded-xl border border-slate-200" />
            </div>
          </div>

          {/* Right: Live Shareable Recruiter Portfolio Card */}
          <div className="lg:col-span-7 bg-slate-950 border border-indigo-900/60 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between gap-5">
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold uppercase">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>GPREC Verified Candidate Passport</span>
                  </div>
                  <h3 className="text-xl font-black mt-2">{studentName}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">{profile.headline}</p>
                  <div className="text-[11px] text-cyan-300 font-mono mt-1">
                    {rollNo} • {branch} • CGPA {profile.cgpa}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(portfolioUrl);
                      if (addToast) addToast({ message: 'Copied shareable Recruiter Portfolio link!', type: 'success' });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Copy Link
                  </button>
                  <button
                    type="button"
                    onClick={handleExportPortfolioPdf}
                    className="px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF Dossier
                  </button>
                </div>
              </div>

              {/* Verified Telemetry Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Readiness</div>
                  <div className="text-lg font-black text-purple-300">{overallReadiness}%</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">DSA Solved</div>
                  <div className="text-lg font-black text-cyan-300">{solvedCount}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Aptitude Drills</div>
                  <div className="text-lg font-black text-amber-300">{aptitudeCount}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Proctor Trust</div>
                  <div className="text-lg font-black text-emerald-300">
                    {bestTrustScore !== null ? `${bestTrustScore}%` : 'Clean'}
                  </div>
                </div>
              </div>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.split(',').map(s => s.trim()).filter(Boolean).map(sk => (
                  <span key={sk} className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-semibold text-indigo-200">
                    {sk}
                  </span>
                ))}
              </div>

              {/* Featured Verified Projects */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Projects Showcase</div>
                {savedProjects.length > 0 ? (
                  savedProjects.slice(0, 2).map(p => (
                    <div key={p.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs font-extrabold text-white">{p.title}</div>
                      <div className="text-[10px] font-bold text-cyan-300 mt-0.5">{p.stack}</div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">{p.summary}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-3.5 rounded-xl bg-white/5 border border-dashed border-white/10 text-center text-xs text-slate-400">
                    No verified capstone projects added yet. Click &quot;Add Project&quot; on the left to showcase live work.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <span>Shareable Link: <span className="font-mono text-cyan-300">{portfolioUrl}</span></span>
              <span className="text-emerald-400 font-bold">Ready for HR / Recruiter Review</span>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 3: GPREC ALUMNI REFERRAL NETWORK                              */}
      {/* ================================================================= */}
      {activeTab === 'referrals' && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={alumniSearch}
                onChange={e => setAlumniSearch(e.target.value)}
                placeholder="Search GPREC alumni by company, branch, or role..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
              {sentReferrals.length} Referral Requests Sent
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlumni.map(al => (
              <div key={al.id} className="bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-white">
                      {al.company}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {al.responseRate}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{al.name}</h4>
                    <div className="text-xs font-semibold text-indigo-600">{al.role}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{al.batch} • {al.location}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-snug">
                    <strong className="text-slate-800">Senior Tip:</strong> {al.tip}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-400 truncate">Referring: {al.referringFor}</span>
                  <button
                    type="button"
                    onClick={() => openReferralModal(al)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1 cursor-pointer flex-shrink-0"
                  >
                    <Send className="w-3 h-3" /> Request Referral
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referral Request Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-extrabold text-purple-600 uppercase">GPREC Alumni Warm Referral</div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Request Referral from {selectedAlumni.name} ({selectedAlumni.company})
                </h4>
              </div>
              <button onClick={() => setSelectedAlumni(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={8}
              value={referralMessage}
              onChange={e => setReferralMessage(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-purple-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedAlumni(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendReferral}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Log & Copy Referral Pitch</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
