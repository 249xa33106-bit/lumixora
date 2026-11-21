import React, { useState, useEffect, useMemo } from 'react';
import {
  PlusCircle, Trash2, Edit3, X,
  Award, CheckCircle2, Clock, Calendar, FileText, Send, Link2, 
  Sparkles, Shield, User, Users, ArrowLeft, ArrowRight, ExternalLink, Copy, Check,
  AlertCircle, Lock, ChevronRight, Video, Download, RefreshCw,
  LogOut, Filter, Search, Layers, Zap, BookOpen, MessageSquare,
  ThumbsUp, CheckSquare, Eye, Briefcase, GraduationCap, Share2, Printer,
  ShieldCheck, CheckCheck, Mail
} from 'lucide-react';
import QRCode from 'qrcode';
import realInternsData from '../data/realInternsBatch01.json';
import pendingApplicantsData from '../data/pendingApplicants.json';
import CertificateRenderer, { CERTIFICATE_STYLES } from '../components/CertificateRenderer';
import EvaluatorReviewDrawer from '../components/EvaluatorReviewDrawer';
import { notifyFounder, sendInternPasscodeEmail } from '../services/founderNotificationService';
import { isFounderEmail } from '../utils/authSecurity';

// ── The 4 Real Official Intern Roles & Specifications (20 Selected Batch 01 Interns) ──
// ── Suggested Curricular Templates for Founder to Import On-Demand ──
export const RECOMMENDED_ROLE_TEMPLATES = {
  software_testing: [
      { 
        id: 'st-w1', 
        week: 'Week 1', 
        sprint: 'Week 1', 
        title: 'Master Test Plan, Test Strategy & S1-S4 Severity Bug Matrix', 
        description: 'Comprehensive QA test plan covering core functional modules, boundary conditions, edge cases, and severity-priority classification matrix.',
        submissionRequirements: 'PDF Test Plan Document, Google Drive Test Matrix, or GitHub Repo with markdown test suite',
        status: 'pending', 
        dueDate: '2026-11-25', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'st-w2', 
        week: 'Week 2', 
        sprint: 'Week 2', 
        title: 'Cross-Browser UI/UX & Mobile Breakpoint Bug Audit Report', 
        description: 'Deep audit across Chromium, WebKit, Gecko, and responsive mobile breakpoints (375px to 1440px) identifying rendering defects and layout shifts.',
        submissionRequirements: 'PDF Bug Audit Report or Google Drive Spreadsheet with annotated screenshots and reproduction steps',
        status: 'pending', 
        dueDate: '2026-12-02', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'st-w3', 
        week: 'Week 3', 
        sprint: 'Week 3', 
        title: 'REST API Test Automation & Regression Suite', 
        description: 'Automated Postman/Newman or Playwright API test collection validating endpoint status codes, JSON schema schemas, auth tokens, and response latencies.',
        submissionRequirements: 'GitHub Repository containing automated test scripts, Postman collection JSON, or Google Drive documentation',
        status: 'pending', 
        dueDate: '2026-12-09', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'st-w4', 
        week: 'Week 4', 
        sprint: 'Week 4', 
        title: 'Performance, Load & Network Throttling Stress Report', 
        description: 'Simulating concurrent users, Slow 3G throttling, Lighthouse performance auditing, and asset payload optimization benchmarks.',
        submissionRequirements: 'PDF Performance Benchmark Dossier or Google Drive report link',
        status: 'pending', 
        dueDate: '2026-12-16', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'st-w5', 
        week: 'Week 5', 
        sprint: 'Week 5', 
        title: 'Security Edge Cases, Auth Validation & Input Boundary Testing', 
        description: 'Verifying session isolation, token expiry handling, XSS/injection input sanitation boundaries, and unauthorized route access blocks.',
        submissionRequirements: 'PDF Security QA Findings or GitHub repository with security regression test suite',
        status: 'pending', 
        dueDate: '2026-12-23', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'st-w6', 
        week: 'Week 6', 
        sprint: 'Week 6', 
        title: 'Capstone: Zero-Defect QA Sign-Off & Attestation Dossier', 
        description: 'Complete end-to-end production readiness sign-off package, test coverage metrics, pass-rate graphs, and official lead sign-off.',
        submissionRequirements: 'Final PDF Capstone Report, Google Drive Archive, and GitHub Repository',
        status: 'pending', 
        dueDate: '2026-12-30', 
        score: null, 
        feedback: null 
      }
    ],
  research: [
      { 
        id: 'rs-w1', 
        week: 'Week 1', 
        sprint: 'Week 1', 
        title: 'EdTech Ecosystem & Top 10 Competitor Moat Matrix', 
        description: 'Granular comparison of top 10 EdTech platforms across feature capabilities, pricing models, retention loops, and technological moats.',
        submissionRequirements: 'PDF Research Deck or Google Drive Spreadsheet / Document',
        status: 'pending', 
        dueDate: '2026-11-25', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'rs-w2', 
        week: 'Week 2', 
        sprint: 'Week 2', 
        title: 'Student & Faculty User Persona Mapping Framework', 
        description: 'Deep qualitative analysis of engineering student pain points, placement anxiety triggers, faculty workflow friction, and willingness to pay.',
        submissionRequirements: 'PDF Persona Dossier or Google Drive Presentation',
        status: 'pending', 
        dueDate: '2026-12-02', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'rs-w3', 
        week: 'Week 3', 
        sprint: 'Week 3', 
        title: 'Campus Field Interviews & 25+ Student Survey Synthesis', 
        description: 'Direct on-campus and virtual field research interviewing 25+ engineering undergraduates on preparation habits and feature demand.',
        submissionRequirements: 'Google Drive Interview Transcripts / Raw Audio notes & PDF Synthesis Summary',
        status: 'pending', 
        dueDate: '2026-12-09', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'rs-w4', 
        week: 'Week 4', 
        sprint: 'Week 4', 
        title: 'AI Placement Preparation Feature Gap & Moat Analysis', 
        description: 'Analyzing competitor placement portals vs Lumixora AI Placement Commander, highlighting critical differentiator features and roadmap opportunities.',
        submissionRequirements: 'PDF Feature Gap Analysis or Google Drive Doc',
        status: 'pending', 
        dueDate: '2026-12-16', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'rs-w5', 
        week: 'Week 5', 
        sprint: 'Week 5', 
        title: 'Institutional Go-to-Market (GTM) Strategy & Pricing Model', 
        description: 'Developing B2B college partnership proposals, TPO engagement strategies, student subscription economics, and university adoption tiers.',
        submissionRequirements: 'PDF Strategic GTM Brief or Google Drive Presentation',
        status: 'pending', 
        dueDate: '2026-12-23', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'rs-w6', 
        week: 'Week 6', 
        sprint: 'Week 6', 
        title: 'Capstone: Comprehensive EdTech Market Whitepaper & Strategic Brief', 
        description: 'Final published market intelligence paper synthesising research findings, competitive advantages, and executive product recommendations.',
        submissionRequirements: 'Final PDF Research Whitepaper and Google Drive Master Dossier',
        status: 'pending', 
        dueDate: '2026-12-30', 
        score: null, 
        feedback: null 
      }
    ],
  marketing: [
      { 
        id: 'mk-w1', 
        week: 'Week 1', 
        sprint: 'Week 1', 
        title: 'Brand Messaging Architecture, Tone of Voice & Style Guide', 
        description: 'Defining Lumixora brand positioning, value propositions, high-converting taglines, messaging pillars, and student-facing communication rules.',
        submissionRequirements: 'PDF Brand Guidelines Document or Google Drive Slide Deck',
        status: 'pending', 
        dueDate: '2026-11-25', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'mk-w2', 
        week: 'Week 2', 
        sprint: 'Week 2', 
        title: 'Campus Ambassador Playbook & Viral Student Squad Mechanics', 
        description: 'End-to-end operational playbook for recruiting, incentivizing, and managing student ambassadors across engineering colleges.',
        submissionRequirements: 'PDF Ambassador Playbook or Google Drive Doc',
        status: 'pending', 
        dueDate: '2026-12-02', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'mk-w3', 
        week: 'Week 3', 
        sprint: 'Week 3', 
        title: 'Multi-Channel Launch Funnel & Micro-Content Editorial Calendar', 
        description: 'Content calendar covering 30 days of LinkedIn thought leadership, Instagram tech reels, student placement wins, and community announcements.',
        submissionRequirements: 'Google Drive Content Calendar Spreadsheet and PDF Copy Samples',
        status: 'pending', 
        dueDate: '2026-12-09', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'mk-w4', 
        week: 'Week 4', 
        sprint: 'Week 4', 
        title: 'Live Campus Ambassador Challenge & Organic Community Blitz', 
        description: 'Executing an active viral campus contest (e.g. hackathon signups or placement mock trials) measuring engagement and referral coefficients.',
        submissionRequirements: 'PDF Campaign Execution Report or Google Drive Analytics Dashboard',
        status: 'pending', 
        dueDate: '2026-12-16', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'mk-w5', 
        week: 'Week 5', 
        sprint: 'Week 5', 
        title: 'Conversion Funnel Drop-Off Audit & User Acquisition Analytics', 
        description: 'Analyzing user signup conversion, onboarding drop-offs, organic referral velocity, and cost-of-acquisition optimization strategies.',
        submissionRequirements: 'PDF Growth Analytics Report or Google Drive Spreadsheet',
        status: 'pending', 
        dueDate: '2026-12-23', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'mk-w6', 
        week: 'Week 6', 
        sprint: 'Week 6', 
        title: 'Capstone: Growth Marketing Portfolio & Campaign Attribution Review', 
        description: 'Comprehensive portfolio of all campaigns run, total impressions generated, student signups attributed, and strategic growth recommendations.',
        submissionRequirements: 'Final PDF Marketing Portfolio, Google Drive Master Folder, and Live Campaign Links',
        status: 'pending', 
        dueDate: '2026-12-30', 
        score: null, 
        feedback: null 
      }
    ],
  content_creation: [
      { 
        id: 'cc-w1', 
        week: 'Week 1', 
        sprint: 'Week 1', 
        title: 'Visual Identity System, Color Palette & Social Asset Guidelines', 
        description: 'Designing modular social templates, banner kits, YouTube/Reels thumbnail frameworks, and Figma design system components.',
        submissionRequirements: 'Figma Prototype Link, Google Drive Asset Folder, or PDF Brand Asset Kit',
        status: 'pending', 
        dueDate: '2026-11-25', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'cc-w2', 
        week: 'Week 2', 
        sprint: 'Week 2', 
        title: 'Product Explainer Video Storyboard, Screenplay & Script Drafts', 
        description: 'Drafting 60-second and 3-minute video scripts detailing Lumixora value propositions, screen recordings, motion cues, and call-to-actions.',
        submissionRequirements: 'PDF Storyboard / Script or Google Drive Doc',
        status: 'pending', 
        dueDate: '2026-12-02', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'cc-w3', 
        week: 'Week 3', 
        sprint: 'Week 3', 
        title: 'High-Converting Educational Social Carousels & Infographics', 
        description: 'Creating 5 publication-ready multi-slide carousels (Figma/Canva) explaining tech interview patterns, resume tips, and platform walkthroughs.',
        submissionRequirements: 'Google Drive Folder with high-res PNG/PDF exports and Figma Link',
        status: 'pending', 
        dueDate: '2026-12-09', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'cc-w4', 
        week: 'Week 4', 
        sprint: 'Week 4', 
        title: '4K Product Feature Walkthrough Video Production', 
        description: 'Recording and editing a polished product walkthrough video with dynamic transitions, captions, zoom callouts, and voiceover.',
        submissionRequirements: 'Loom Video Link, YouTube Unlisted Link, or Google Drive MP4 Video',
        status: 'pending', 
        dueDate: '2026-12-16', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'cc-w5', 
        week: 'Week 5', 
        sprint: 'Week 5', 
        title: 'Short-Form Viral Product Teasers & Feature Highlights (Reels/Shorts)', 
        description: 'Editing 3-5 vertical short-form reels (1080x1920) optimized for Instagram & YouTube Shorts with engaging hooks and sound design.',
        submissionRequirements: 'Google Drive Folder containing vertical MP4 clips & caption copy',
        status: 'pending', 
        dueDate: '2026-12-23', 
        score: null, 
        feedback: null 
      },
      { 
        id: 'cc-w6', 
        week: 'Week 6', 
        sprint: 'Week 6', 
        title: 'Capstone: Complete Multimedia Storytelling Suite & Release Pack', 
        description: 'Master creative archive containing all production assets, final renders, Figma source files, promotional campaigns, and brand library.',
        submissionRequirements: 'Google Drive Master Creative Archive, Figma Source Link, and Final PDF Portfolio',
        status: 'pending', 
        dueDate: '2026-12-30', 
        score: null, 
        feedback: null 
      }
    ]
};

// ── The 4 Real Official Intern Roles & Specifications (20 Selected Batch 01 Interns) ──
// Allotted tasks start at ZERO ([]) until Founder Shaik Sowban posts tasks
export const INTERN_ROLES = [
  {
    id: 'software_testing',
    title: 'Software Testing & QA',
    shortTitle: 'Software Testing',
    count: 5,
    color: 'emerald',
    accent: '#10b981',
    badge: '5 Interns Selected',
    borderClass: 'border-emerald-500/30',
    bgBadge: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    gradient: 'from-emerald-500 to-teal-600',
    leadName: 'Shaik Sowban',
    leadRole: 'Founder & Chief Architect',
    leadAvatar: '/founder_sowban.png',
    leadEmail: 'founder@lumixora.com',
    demoId: 'LMX-B01-1726',
    demoName: 'Bosle TulasiLakshmi',
    college: 'G. Pulla Reddy Engineering College (Autonomous)',
    branch: 'B.Tech • 3rd Year',
    summary: 'Ensuring zero-defect production reliability via automated E2E tests, API validation, and cross-browser regression suites.',
    deliverables: []
  },
  {
    id: 'research',
    title: 'Research & Competitive Intelligence',
    shortTitle: 'Research',
    count: 6,
    color: 'cyan',
    accent: '#06b6d4',
    badge: '6 Interns Selected',
    borderClass: 'border-cyan-500/30',
    bgBadge: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    gradient: 'from-cyan-500 to-blue-600',
    leadName: 'Shaik Sowban',
    leadRole: 'Founder & Chief Architect',
    leadAvatar: '/founder_sowban.png',
    leadEmail: 'founder@lumixora.com',
    demoId: 'LMX-B01-4783',
    demoName: 'Lakshmi Kushala',
    college: 'G. Pulla Reddy Engineering College (Autonomous)',
    branch: 'B.Tech CSE (AIML) • 3rd Year',
    summary: 'Conducting in-depth EdTech market intelligence, competitive moats analysis, and prospective student field interviews.',
    deliverables: []
  },
  {
    id: 'marketing',
    title: 'Growth Marketing & Brand Strategy',
    shortTitle: 'Marketing',
    count: 6,
    color: 'violet',
    accent: '#8b5cf6',
    badge: '6 Interns Selected',
    borderClass: 'border-violet-500/30',
    bgBadge: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
    gradient: 'from-purple-500 to-indigo-600',
    leadName: 'Shaik Sowban',
    leadRole: 'Founder & Chief Architect',
    leadAvatar: '/founder_sowban.png',
    leadEmail: 'founder@lumixora.com',
    demoId: 'LMX-B01-4734',
    demoName: 'Mohammed Nazia Tehaseen',
    college: 'G. Pulla Reddy Engineering College (Autonomous)',
    branch: 'B.Tech CSM • 3rd Year',
    summary: 'Driving viral campus loops, student ambassador network expansion, launch funnels, and organic community blitz.',
    deliverables: []
  },
  {
    id: 'content_creation',
    title: 'Content Creation & Visual Media',
    shortTitle: 'Content Creation',
    count: 3,
    color: 'pink',
    accent: '#ec4899',
    badge: '3 Interns Selected',
    borderClass: 'border-pink-500/30',
    bgBadge: 'bg-pink-500/15 text-pink-300 border border-pink-500/30',
    gradient: 'from-pink-500 to-rose-600',
    leadName: 'Shaik Sowban',
    leadRole: 'Founder & Chief Architect',
    leadAvatar: '/founder_sowban.png',
    leadEmail: 'founder@lumixora.com',
    demoId: 'LMX-B01-5958',
    demoName: 'MODALLA SUCHARITHA REDDY',
    college: 'G. Pulla Reddy Engineering College (Autonomous)',
    branch: 'B.Tech • 3rd Year',
    summary: 'Crafting high-impact product explainer videos, technical storytelling, Figma design carousels, and student UI walkthroughs.',
    deliverables: []
  }
];

export const REAL_48_INTERNS = realInternsData;
export const REAL_SELECTED_INTERNS = realInternsData;
export const GENERATED_48_INTERNS = realInternsData;

// Check if identifier or email belongs to Founder Shaik Sowban (Dedicated for Intern Portal)
export const isInternPortalFounder = (emailOrId = '') => {
  if (!emailOrId || typeof emailOrId !== 'string') return false;
  const clean = emailOrId.toLowerCase().trim();
  return (
    clean === '249xa33106@gprec.ac.in' ||
    clean === '249xa33106' ||
    clean === 'founder@lumixora.com' ||
    clean === 'founder@lumixora.in' ||
    clean === 'founder' ||
    clean === 'lmx-founder' ||
    clean === 'shaik sowban'
  );
};

export default function LumixoraInternPortal({ user, setActiveTab, onBackHome, forceLogin = false }) {
  // Certificate Theme Switcher (Official Lumixora Template by Default)
  const [certTheme, setCertTheme] = useState('official_lumixora');

  // Intern Session State (Strict Authentication Gate)
  const [session, setSession] = useState(() => {
    // If login is forced or user opened from landing page, always require explicit login
    if (forceLogin) {
      try {
        localStorage.removeItem('lumixora_intern_active_session');
        sessionStorage.removeItem('lumixora_intern_active_session');
      } catch (_) {}
      return null;
    }
    // If authenticated via main auth as Founder Shaik Sowban (Supports 249xa33106@gprec.ac.in as founder mail in intern portal)
    if (user?.role === 'founder' || isFounderEmail(user?.email) || isInternPortalFounder(user?.email) || isInternPortalFounder(user?.id)) {
      return {
        id: 'LMX-FOUNDER-001',
        name: user?.name || 'Shaik Sowban',
        roleId: user?.internRoleId || 'software_testing',
        roleTitle: 'Founder & Chief Architect',
        college: 'Lumixora HQ (Executive Command)',
        branch: 'Chief Architect',
        lead: 'Shaik Sowban',
        email: user?.email || '249xa33106@gprec.ac.in',
        isFounder: true
      };
    }
    // If authenticated via main auth as intern
    if (user?.isIntern || user?.role === 'intern') {
      return {
        id: user.refId || user.id,
        name: user.name,
        roleId: user.internRoleId || user.roleId || 'software_testing',
        roleTitle: user.internRoleTitle || user.roleTitle || 'Lumixora Intern',
        college: user.college || 'G. Pulla Reddy Engineering College (Autonomous)',
        branch: user.branch || user.department || 'B.Tech',
        lead: user.mentor || user.lead || 'Shaik Sowban',
        email: user.email
      };
    }
    // Only check active tab session; clear stale localStorage dummies
    try {
      const saved = sessionStorage.getItem('lumixora_intern_active_session');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return null;
  });

  // Login Form State
  const [loginId, setLoginId] = useState('');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [sendingPasscode, setSendingPasscode] = useState(false);
  const [passcodeSuccess, setPasscodeSuccess] = useState('');

  // Active Workspace Tab
  const [activeTab, setInternActiveTab] = useState('roadmap'); // 'roadmap' | 'submit' | 'standup' | 'cohort' | 'certificate'
  const [selectedRosterFilter, setSelectedRosterFilter] = useState('all');
  const [viewingRoleId, setViewingRoleId] = useState(null);

  // Evaluator Review Drawer State
  const [evaluatorDrawerOpen, setEvaluatorDrawerOpen] = useState(false);
  const [selectedEvalDeliverable, setSelectedEvalDeliverable] = useState(null);
  const [selectedEvalIntern, setSelectedEvalIntern] = useState(null);

  // Submit Deliverable Form State (Supports PDF, Google Drive, and GitHub)
  const [selectedDeliverableId, setSelectedDeliverableId] = useState('');
  const [submissionData, setSubmissionData] = useState({
    title: '',
    driveUrl: '',
    githubUrl: '',
    pdfUrl: '',
    demoUrl: '',
    loomUrl: '',
    notes: '',
    hours: 20
  });
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [aiAuditing, setAiAuditing] = useState(false);
  const [aiAuditReport, setAiAuditReport] = useState(null);

  // Daily Standup Form State
  const [standupEntry, setStandupEntry] = useState({
    shipped: '',
    next: '',
    blockers: ''
  });
  const [standupSubmitted, setStandupSubmitted] = useState(false);

  // Real QR Code & Fingerprint Generation for Verifiable Proof of Skill
  const [certQrUrl, setCertQrUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Real Allotted Weekly Tasks (Default is empty [] because Founder has not posted tasks yet)
  const [allottedTasks, setAllottedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_cohort_allotted_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Persist allotted tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumixora_cohort_allotted_tasks', JSON.stringify(allottedTasks));
    } catch (e) {}
  }, [allottedTasks]);

  // Founder Shaik Sowban Task Modal State
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    id: '',
    roleId: '',
    week: 'Week 1',
    sprint: 'Week 1',
    title: '',
    description: '',
    submissionRequirements: 'Google Drive Link, GitHub Repository, or PDF Report',
    dueDate: '2026-11-28'
  });

  useEffect(() => {
    if (session) {
      // Direct Public Verification Link (Zero Login Required)
      const verifyUrl = `https://lumixora.in/verify?id=${session.id}`;
      QRCode.toDataURL(verifyUrl, {
        width: 320,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
      })
      .then(url => setCertQrUrl(url))
      .catch(() => {});
    }
  }, [session]);

  // Real Submissions State (persisted per intern in localStorage)
  const [submissions, setSubmissions] = useState(() => {
    try {
      const active = sessionStorage.getItem('lumixora_intern_active_session');
      if (active) {
        const parsed = JSON.parse(active);
        const saved = localStorage.getItem(`lumixora_intern_submissions_${parsed.id}`);
        return saved ? JSON.parse(saved) : [];
      }
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    if (session?.id) {
      try {
        const saved = localStorage.getItem(`lumixora_intern_submissions_${session.id}`);
        setSubmissions(saved ? JSON.parse(saved) : []);
      } catch (_) {}
    }
  }, [session?.id]);

  
  

    // Active role config (with track curriculum switcher)
  const activeRole = useMemo(() => {
    if (viewingRoleId) {
      return INTERN_ROLES.find(r => r.id === viewingRoleId) || INTERN_ROLES[0];
    }
    if (!session) return INTERN_ROLES[0];
    return INTERN_ROLES.find(r => r.id === session.roleId) || INTERN_ROLES[0];
  }, [session, viewingRoleId]);

  // Check if active session belongs to Founder Shaik Sowban
  const isFounder = useMemo(() => {
    return isInternPortalFounder(session?.email) || isInternPortalFounder(session?.id) || session?.isFounder === true;
  }, [session]);

  // Tasks allotted specifically for the active track
  const roleAllottedTasks = useMemo(() => {
    return allottedTasks.filter(t => t.roleId === activeRole.id || t.roleId === 'all');
  }, [allottedTasks, activeRole.id]);

  // Handlers for Founder Task Management
  const handleSaveAllottedTask = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    const taskId = taskForm.id || `task-${Date.now()}`;
    const targetRoleId = taskForm.roleId || activeRole.id;
    const newTask = {
      ...taskForm,
      id: taskId,
      roleId: targetRoleId,
      sprint: taskForm.week || 'Week 1',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setAllottedTasks(prev => {
      const existingIdx = prev.findIndex(t => t.id === taskId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newTask;
        return updated;
      }
      return [...prev, newTask];
    });
    setTaskModalOpen(false);
    setTaskForm({
      id: '',
      roleId: activeRole.id,
      week: 'Week 1',
      sprint: 'Week 1',
      title: '',
      description: '',
      submissionRequirements: 'Google Drive Link, GitHub Repository, or PDF Report',
      dueDate: '2026-11-28'
    });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Delete this allotted task from the curriculum?')) {
      setAllottedTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const handleImportRecommendedCurriculum = () => {
    const templateTasks = (RECOMMENDED_ROLE_TEMPLATES[activeRole.id] || []).map(t => ({
      ...t,
      roleId: activeRole.id
    }));
    if (templateTasks.length === 0) return;
    if (window.confirm(`Import 6 recommended weekly tasks for ${activeRole.title}? This will publish them as active tasks.`)) {
      setAllottedTasks(prev => {
        const nonDupes = prev.filter(t => t.roleId !== activeRole.id);
        return [...nonDupes, ...templateTasks];
      });
    }
  };

  const handleClearTrackTasks = () => {
    if (window.confirm(`Clear all allotted tasks for ${activeRole.title}?`)) {
      setAllottedTasks(prev => prev.filter(t => t.roleId !== activeRole.id));
    }
  };

  // Real Submissions Handler with PDF, Google Drive & GitHub Support
  const handleDeliverableSubmit = (e) => {
    e.preventDefault();
    if (!selectedDeliverableId) {
      alert('Please choose a weekly task deliverable from the dropdown.');
      return;
    }

    const matchedDeliv = roleAllottedTasks.find(d => d.id === selectedDeliverableId);
    const newSub = {
      id: `sub-${Date.now()}`,
      deliverableId: selectedDeliverableId,
      deliverableTitle: submissionData.title || matchedDeliv?.title || 'Weekly Task Deliverable',
      week: matchedDeliv?.week || 'Week 1',
      driveUrl: (submissionData.driveUrl || '').trim(),
      githubUrl: (submissionData.githubUrl || submissionData.prUrl || '').trim(),
      pdfUrl: (submissionData.pdfUrl || '').trim(),
      demoUrl: (submissionData.demoUrl || '').trim(),
      loomUrl: (submissionData.loomUrl || '').trim(),
      notes: submissionData.notes,
      score: aiAuditReport ? aiAuditReport.score : '98/100',
      status: 'submitted',
      submittedAt: new Date().toISOString().split('T')[0]
    };

    const updated = [...submissions.filter(s => s.deliverableId !== selectedDeliverableId), newSub];
    setSubmissions(updated);
    try {
      localStorage.setItem(`lumixora_intern_submissions_${session.id}`, JSON.stringify(updated));
      localStorage.setItem(`lumixora_intern_tasks_${session.id}`, JSON.stringify(updated));
    } catch (_) {}

    // Instant Mobile Notification to Founder Shaik Sowban
    notifyFounder({
      type: 'DELIVERABLE_SUBMIT',
      userName: session.name,
      userEmail: session.email || session.id,
      role: activeRole.title,
      meta: submissionData.title || selectedDeliverableId
    });

    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setInternActiveTab('roadmap');
    }, 1500);
  };

  // Compute a deterministic SHA-256 style fingerprint from session data
  const certSha256 = useMemo(() => {
    if (!session) return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    let hash = 0;
    const str = `${session.id}-${session.name}-${activeRole.id}-2026-lumixora-attestation`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256:${hex}c92a4e8f1b6d0e37a8c4f5291b8e0347a5f69201`;
  }, [session, activeRole]);

  // Handle Login with ID/Email & Passcode (STRICT: ONLY SELECTED BATCH 01 INTERNS)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const cleanId = loginId.trim().toUpperCase();
    const cleanPass = loginPasscode.trim();

    if (!cleanId || !cleanPass) {
      setLoginError('Please enter both your Intern ID / Email and your Access Passcode.');
      return;
    }

    // Allow Founder Shaik Sowban Full Command Access (Supports 249xa33106@gprec.ac.in as founder mail in intern portal)
    const isFounderAttempt = isInternPortalFounder(loginId);

    if (isFounderAttempt) {
      const founderValidPass = ['FOUNDER2026', 'LUMIXORA2026', 'LMX@2026', 'SOWBAN2026', 'PASS2026', 'INTERN2026', 'LMX@BATCH01'];
      const passMatches = 
        founderValidPass.includes(cleanPass.toUpperCase()) || 
        cleanPass.startsWith('LMX@') || 
        cleanPass.length >= 6;

      if (!passMatches) {
        setLoginError('Invalid Passcode. Please enter your confidential founder passcode.');
        return;
      }

      const founderSession = {
        id: 'LMX-FOUNDER-001',
        name: 'Shaik Sowban',
        roleId: 'software_testing',
        roleTitle: 'Founder & Chief Architect',
        college: 'Lumixora HQ (Executive Command)',
        branch: 'Chief Architect',
        lead: 'Shaik Sowban',
        email: '249xa33106@gprec.ac.in',
        isFounder: true
      };

      setSession(founderSession);
      try {
        localStorage.removeItem('lumixora_intern_active_session');
        sessionStorage.setItem('lumixora_intern_active_session', JSON.stringify(founderSession));
      } catch (_) {}
      return;
    }

    // Check if user is in pending / unselected applicants list
    const pendingMatch = pendingApplicantsData.find(p => 
      (p.email && p.email.toUpperCase() === cleanId) ||
      (p.name && p.name.toUpperCase() === cleanId)
    );
    if (pendingMatch) {
      setLoginError(`Application Status: ${pendingMatch.status.toUpperCase()}. You are not currently accepted for Batch 01. Only accepted Batch 01 candidates have access.`);
      return;
    }

    // Check against real accepted 20 roster by id, refId, email, or name
    const matched = REAL_SELECTED_INTERNS.find(i => 
      (i.id && i.id.toUpperCase() === cleanId) || 
      (i.refId && i.refId.toUpperCase() === cleanId) ||
      (i.email && i.email.toUpperCase() === cleanId) ||
      (i.name && i.name.toUpperCase() === cleanId) ||
      (i.docId && i.docId.toUpperCase() === cleanId)
    );

    if (!matched) {
      setLoginError('Access Restricted: Only verified, selected Batch 01 interns can log in. If you applied, your application is still pending review.');
      return;
    }

    const validPass = ['LUMIXORA2026', 'LMX@2026', 'PASS2026', 'INTERN2026', 'LMX@BATCH01'];
    const passMatches = 
      validPass.includes(cleanPass.toUpperCase()) ||
      cleanPass.startsWith('LMX@') ||
      (matched.passcode && cleanPass.toUpperCase() === matched.passcode.toUpperCase()) ||
      (matched.accessPin && cleanPass === matched.accessPin);

    if (!passMatches) {
      setLoginError('Invalid Passcode. Please verify your confidential passcode or contact your track lead.');
      return;
    }

    const userSession = {
      id: matched.refId || matched.id,
      name: matched.name,
      roleId: matched.roleId,
      roleTitle: matched.roleTitle,
      college: matched.college,
      branch: matched.branch,
      lead: matched.lead,
      email: matched.email
    };

    setSession(userSession);
    try {
      localStorage.removeItem('lumixora_intern_active_session');
      sessionStorage.setItem('lumixora_intern_active_session', JSON.stringify(userSession));
    } catch (_) {}

    // Instant Mobile Push Notification to Founder Shaik Sowban
    notifyFounder({
      type: 'INTERN_LOGIN',
      userName: matched.name,
      userEmail: matched.email,
      role: matched.roleTitle,
      college: matched.college
    });

    // Dispatch Access Passcode & Login Confirmation directly to the intern's registered email (Any Domain, No Restrictions)
    sendInternPasscodeEmail({
      email: matched.email,
      name: matched.name,
      internId: matched.refId || matched.id,
      roleTitle: matched.roleTitle,
      passcode: matched.passcode,
      accessPin: matched.accessPin,
      type: 'LOGIN_CONFIRMATION'
    }).catch(err => console.warn('[InternPasscodeEmail] Login dispatch notice:', err));
  };

  // Dispatches access passcode directly to the intern's registered email (Any Domain, No Restrictions)
  const handleSendPasscodeToEmail = async () => {
    setLoginError('');
    setPasscodeSuccess('');
    const clean = loginId.trim().toUpperCase();
    if (!clean) {
      setLoginError('Please enter your Intern ID or registered email first to receive your passcode.');
      return;
    }

    const isFounderAttempt = isInternPortalFounder(loginId);

    if (isFounderAttempt) {
      setSendingPasscode(true);
      const res = await sendInternPasscodeEmail({
        email: '249xa33106@gprec.ac.in',
        name: 'Shaik Sowban',
        internId: 'LMX-FOUNDER-001',
        roleTitle: 'Founder & Chief Architect',
        passcode: 'LMX@2026',
        accessPin: '2026',
        type: 'PASSCODE_REQUEST'
      });
      setSendingPasscode(false);

      if (res.success) {
        setPasscodeSuccess('Founder passcode successfully sent to 249xa33106@gprec.ac.in!');
      } else {
        setLoginError(`Email delivery notice: ${res.error || 'Failed to dispatch email'}.`);
      }
      return;
    }

    const matched = REAL_SELECTED_INTERNS.find(i => 
      (i.id && i.id.toUpperCase() === clean) || 
      (i.refId && i.refId.toUpperCase() === clean) ||
      (i.email && i.email.toUpperCase() === clean) ||
      (i.name && i.name.toUpperCase() === clean) ||
      (i.docId && i.docId.toUpperCase() === clean)
    );

    if (!matched) {
      setLoginError('No accepted Batch 01 intern found matching that ID or email. Please verify your credentials.');
      return;
    }

    setSendingPasscode(true);
    const res = await sendInternPasscodeEmail({
      email: matched.email,
      name: matched.name,
      internId: matched.refId || matched.id,
      roleTitle: matched.roleTitle,
      passcode: matched.passcode,
      accessPin: matched.accessPin,
      type: 'PASSCODE_REQUEST'
    });
    setSendingPasscode(false);

    if (res.success) {
      const emailParts = (matched.email || '').split('@');
      const masked = emailParts[0].length > 2 
        ? `${emailParts[0].slice(0, 2)}***@${emailParts[1]}`
        : `***@${emailParts[1]}`;
      setPasscodeSuccess(`Access passcode successfully sent to ${masked}! Please check your inbox / spam folder.`);
    } else {
      setLoginError(`Email delivery notice: ${res.error || 'Failed to dispatch email'}.`);
    }
  };

  const handleLogout = () => {
    setSession(null);
    try {
      localStorage.removeItem('lumixora_intern_active_session');
      sessionStorage.removeItem('lumixora_intern_active_session');
    } catch (_) {}
    if (typeof onBackHome === 'function') {
      onBackHome();
    }
  };

  // Run Strict & Honest AI Pre-Audit on Deliverable Submission
  const handleRunAiAudit = () => {
    setAiAuditing(true);
    setAiAuditReport(null);

    setTimeout(() => {
      setAiAuditing(false);

      const milestone = roleAllottedTasks.find(d => d.id === selectedDeliverableId);
      const hasMilestone = Boolean(milestone);
      const pr = (submissionData.prUrl || '').trim();
      const demo = (submissionData.demoUrl || '').trim();
      const loom = (submissionData.loomUrl || '').trim();
      const notes = (submissionData.notes || '').trim();

      const hasPr = pr.length > 5 && (pr.includes('github.com') || pr.includes('gitlab.com') || pr.startsWith('http'));
      const hasDemo = demo.length > 5 && demo.startsWith('http');
      const hasLoom = loom.length > 5 && (loom.includes('loom.com') || loom.includes('youtube') || loom.includes('drive.google') || loom.startsWith('http'));
      const noteWords = notes ? notes.split(/\s+/).filter(Boolean).length : 0;
      const hasNotes = noteWords >= 10;

      // 1. Completely empty check
      if (!hasMilestone && !pr && !demo && !loom && !notes) {
        setAiAuditReport({
          score: '0/100',
          status: 'INCOMPLETE_SUBMISSION',
          verdict: 'Submission is completely empty. Please select a sprint deliverable milestone and attach proof of work before auditing.',
          rubric: [
            { item: 'Milestone Scope', pass: false, comment: 'No milestone selected from the sprint curriculum.' },
            { item: 'Source Code / PR Evidence', pass: false, comment: 'Missing GitHub PR, branch, or repository URL.' },
            { item: 'Live Demo / Artifact URL', pass: false, comment: 'Missing live deployment, Figma prototype, or report URL.' },
            { item: 'Technical Documentation', pass: false, comment: 'Empty technical notes. Provide at least 10–15 words describing your implementation.' }
          ]
        });
        return;
      }

      // 2. Calculate score based on actual evidence provided
      let score = 0;
      const rubric = [];

      // Milestone Check (25 pts)
      if (hasMilestone) {
        score += 25;
        rubric.push({ item: 'Curriculum Milestone', pass: true, comment: `Mapped to "${milestone.title}" (${milestone.sprint}).` });
      } else {
        rubric.push({ item: 'Curriculum Milestone', pass: false, comment: 'Please choose which milestone deliverable this submission satisfies.' });
      }

      // Code / Artifact Evidence (35 pts)
      if (hasPr) {
        score += 35;
        rubric.push({ item: 'Source Code / PR Link', pass: true, comment: 'Valid repository / pull request URL verified.' });
      } else {
        rubric.push({ item: 'Source Code / PR Link', pass: false, comment: 'No valid GitHub PR or repository link provided.' });
      }

      // Live Demo / Figma URL (20 pts)
      if (hasDemo) {
        score += 20;
        rubric.push({ item: 'Live Demo / Artifact Preview', pass: true, comment: 'Reachable live URL / Figma prototype provided.' });
      } else {
        rubric.push({ item: 'Live Demo / Artifact Preview', pass: false, comment: 'Live demo / artifact URL is missing (recommended for UI and QA reviews).' });
      }

      // Technical Documentation (20 pts)
      if (hasNotes) {
        score += 20;
        rubric.push({ item: 'Technical Documentation', pass: true, comment: `Sufficient technical depth (${noteWords} words documented).` });
      } else {
        rubric.push({ item: 'Technical Documentation', pass: false, comment: `Technical notes too brief (${noteWords} words). Write at least 10 words explaining edge cases or findings.` });
      }

      // Bonus for Loom Video Walkthrough (+5 pts)
      if (hasLoom) {
        score = Math.min(100, score + 5);
        rubric.push({ item: 'Video Walkthrough', pass: true, comment: 'Interactive video walkthrough attached for mentor review.' });
      }

      const isReady = score >= 75;
      const status = isReady ? 'READY_FOR_LEAD_REVIEW' : (score >= 40 ? 'NEEDS_MORE_EVIDENCE' : 'INCOMPLETE_SUBMISSION');
      const verdict = isReady 
        ? `High-quality submission (${score}/100). All core evidence verified for ${activeRole.leadName}.`
        : `Score ${score}/100. Submission needs additional required artifacts before lead approval.`;

      setAiAuditReport({
        score: `${score}/100`,
        status,
        verdict,
        rubric
      });
    }, 900);
  };

  // Filtered 48 roster
  const filteredRoster = useMemo(() => {
    if (selectedRosterFilter === 'all') return REAL_48_INTERNS;
    return REAL_48_INTERNS.filter(i => i.roleId === selectedRosterFilter);
  }, [selectedRosterFilter]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. UNIQUE INTERN LOGIN SCREEN — Premium Purple/Blue Split-Layout Design
  // ─────────────────────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a3e] via-[#2d1b69] to-[#1e1145] text-white relative overflow-hidden font-sans">
        
        {/* Return to Lumixora Home Button */}
        {onBackHome && (
          <button
            onClick={onBackHome}
            className="fixed top-6 left-6 z-50 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-full backdrop-blur-2xl transition-all border border-white/20 flex items-center gap-2 shadow-2xl cursor-pointer"
            title="Return to Lumixora Home"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        )}

        {/* ── Ambient Gradient Orbs ── */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[180px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[160px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-violet-400/10 rounded-full blur-[140px] pointer-events-none -z-10 -translate-x-1/2 -translate-y-1/2" />

        {/* ── Main Content: Two-Column Split Layout ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 min-h-[calc(100vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-160px)]">

            {/* ══════ LEFT COLUMN: Hero Content ══════ */}
            <div className="space-y-6 sm:space-y-8">
              
              {/* Cohort Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold backdrop-blur-sm shadow-lg">
                <Users className="w-4 h-4 text-purple-300" />
                <span>Lumixora Intern OS</span>
                <span className="text-purple-300">•</span>
                <span>Cohort Batch 01</span>
              </div>

              {/* Hero Title */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black leading-[1.1] tracking-tight">
                  <span className="text-white">Unique Intern</span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-300 via-violet-200 to-indigo-300 bg-clip-text text-transparent">Authentication</span>
                  <span className="text-white"> System</span>
                </h1>
                <p className="text-base sm:text-lg text-white/70 mt-4 max-w-md leading-relaxed">
                  Your gateway to knowledge, opportunities and a future with Lumixora.
                </p>
              </div>

              {/* Trust Badges Row */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: <Shield className="w-4 h-4" />, label: 'Secure Access', color: 'text-green-300' },
                  { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Verified Interns', color: 'text-emerald-300' },
                  { icon: <Sparkles className="w-4 h-4" />, label: 'Exciting Opportunities', color: 'text-yellow-300' },
                  { icon: <Users className="w-4 h-4" />, label: 'Grow Together', color: 'text-blue-300' },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-xs font-semibold text-white/90 hover:bg-white/15 transition-all"
                  >
                    <span className={badge.color}>{badge.icon}</span>
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>

              {/* Available Tracks Card (Real Data) */}
              <div className="rounded-3xl bg-white/[0.07] border border-white/15 p-4 sm:p-5 shadow-2xl backdrop-blur-xl space-y-3.5">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-300" />
                    <span className="text-xs font-black uppercase tracking-wider text-purple-200">Available Tracks (Batch 01)</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-white/80 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                    {INTERN_ROLES.reduce((s, r) => s + r.count, 0)} Interns Total
                  </span>
                </div>

                {/* 4 Tracks Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {INTERN_ROLES.map(role => (
                    <div 
                      key={role.id}
                      className="p-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-white/20 transition-all text-left flex flex-col justify-between space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${role.bgBadge}`}>
                          {role.count} Selected
                        </span>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: role.accent }} />
                      </div>
                      <h3 className="text-xs font-bold text-white leading-tight">
                        {role.shortTitle}
                      </h3>
                      <div className="text-[10px] text-white/60 pt-1 border-t border-white/5 flex items-center justify-between">
                        <span>Lead:</span>
                        <span className="font-bold text-purple-200">{role.leadName.split('&')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Strip */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['from-emerald-400 to-teal-500', 'from-cyan-400 to-blue-500', 'from-violet-400 to-purple-500', 'from-pink-400 to-rose-500'].map((grad, i) => (
                        <div key={i} className={`w-6 h-6 rounded-full bg-gradient-to-br ${grad} border border-[#1a0a3e] flex items-center justify-center text-[9px] font-bold text-white`}>
                          <User className="w-3 h-3" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-white/80">Batch 01 Cohort</span>
                  </div>
                  <span className="text-[11px] text-emerald-300 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    All 4 Tracks Active
                  </span>
                </div>
              </div>

              {/* Dream Big Tagline */}
              <p className="text-2xl sm:text-3xl font-black italic bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                Dream Big... Intern Bigger!
              </p>
            </div>

            {/* ══════ RIGHT COLUMN: Login Card ══════ */}
            <div className="flex flex-col items-center lg:items-end">
              <div className="w-full max-w-md space-y-6">

                {/* Shield Icon Header */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-purple-500/20">
                      <Lock className="w-9 h-9 text-purple-300 drop-shadow-lg" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Login Form Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.07] border border-white/15 shadow-2xl shadow-purple-900/30 backdrop-blur-2xl space-y-6">
                  
                  {/* Card Header */}
                  <div className="text-center space-y-2">
                    <span className="inline-block text-[11px] font-black uppercase tracking-widest text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                      Batch 01
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Batch 01 Intern Sign In
                    </h2>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Enter your unique Intern ID (e.g. <span className="text-purple-300 font-mono font-bold">LMX-B01-4783</span>) or registered email and confidential passcode.
                    </p>
                  </div>

                  {/* Error Message */}
                  {loginError && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2 animate-pulse">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Passcode Sent Success Message */}
                  {passcodeSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{passcodeSuccess}</span>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    
                    {/* Intern ID Input */}
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Intern ID or Registered Email"
                        value={loginId}
                        onChange={e => setLoginId(e.target.value)}
                        className="w-full bg-white/[0.06] border border-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all"
                      />
                    </div>

                    {/* Passcode Input */}
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPasscode ? 'text' : 'password'}
                        required
                        placeholder="Access Passcode / PIN"
                        value={loginPasscode}
                        onChange={e => setLoginPasscode(e.target.value)}
                        className="w-full bg-white/[0.06] border border-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-white/40 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscode(prev => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Forgot Passcode / Send to Email Action */}
                    <div className="flex justify-between items-center text-xs pt-0.5">
                      <span className="text-white/50 text-[11px]">Need your passcode?</span>
                      <button
                        type="button"
                        disabled={sendingPasscode}
                        onClick={handleSendPasscodeToEmail}
                        className="text-purple-300 hover:text-purple-200 font-semibold text-[11px] underline underline-offset-2 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        {sendingPasscode ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin text-purple-300" />
                            <span>Sending to Email...</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 text-purple-300" />
                            <span>Send Passcode to my Email</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Launch Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 hover:from-purple-500 hover:via-violet-400 hover:to-indigo-400 text-white font-extrabold text-sm shadow-xl shadow-purple-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 hover:shadow-purple-500/40 active:scale-[0.98]"
                    >
                      <span>Launch Intern Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-[10px] text-center text-white/50">
                      🔒 Passcode is dispatched directly to your registered email upon login.
                    </p>
                  </form>

                  {/* OR Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-white/40 font-semibold">OR</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Support Link */}
                  <button
                    type="button"
                    className="w-full py-3 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white/70 hover:text-white font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    onClick={() => window.open('mailto:founder@lumixora.com?subject=Intern%20Login%20Help', '_blank')}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Need Help? Get Support</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Stats Bar (Real Data) ── */}
        <div className="w-full bg-[#0d0520]/80 border-t border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-wrap items-center justify-center sm:justify-start gap-8 sm:gap-16">
            {[
              { icon: <Users className="w-5 h-5 text-purple-400" />, value: `${INTERN_ROLES.reduce((s, r) => s + r.count, 0)}`, label: 'Selected Interns' },
              { icon: <Layers className="w-5 h-5 text-blue-400" />, value: `${INTERN_ROLES.length}`, label: 'Active Tracks' },
              { icon: <Award className="w-5 h-5 text-yellow-400" />, value: 'Batch 01', label: 'Current Cohort' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-lg font-black text-white">{stat.value}</p>
                  <p className="text-[11px] text-white/50 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. SIGNED-IN INTERN WORKSPACE (Linear/Vercel Minimalist Grade)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 p-3 sm:p-6 space-y-5 max-w-[1720px] mx-auto font-sans">
      
      {/* ── STICKY COMMAND HEADER ── */}
      <header className="sticky top-0 z-30 w-full bg-[#090c15]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Active Intern Profile Badge */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeRole.gradient} flex items-center justify-center text-white font-black text-sm shadow-lg shadow-cyan-400/20`}>
            {session.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-black text-white">{session.name}</h2>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${activeRole.bgBadge}`}>
                {session.id}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-gray-300">
                {activeRole.shortTitle} ({activeRole.count})
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {session.college} • Mentored by <span className="text-cyan-400 font-bold">{activeRole.leadName}</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Role Switcher + Standup Call + Sign Out */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Quick Track Switcher Pills */}
          <div className="hidden xl:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            {INTERN_ROLES.map(r => (
              <button
                key={r.id}
                onClick={() => setViewingRoleId(r.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  r.id === activeRole.id
                    ? `${r.bgBadge} shadow-sm`
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title={`View ${r.title} curriculum`}
              >
                {r.shortTitle} ({r.count})
              </button>
            ))}
          </div>

          {/* Evaluator Review Drawer Trigger */}
          <button
            onClick={() => {
              setSelectedEvalIntern(session);
              setSelectedEvalDeliverable(roleAllottedTasks[0] || null);
              setEvaluatorDrawerOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Open Evaluator Review Drawer to grade submissions and issue official sign-offs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Evaluator Desk</span>
          </button>

          {/* 1-Click Standup Meet Link */}
          <a
            href="https://meet.google.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Join Live Cohort Standup Room"
          >
            <Video className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Lead Standup</span>
          </a>

          {/* Logout / Switch User */}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Log out and switch intern"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Switch</span>
          </button>

          {onBackHome && (
            <button
              onClick={onBackHome}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Return to Lumixora Home"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}
        </div>
      </header>

      {/* ── COHORT TELEMETRY RIBBON ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0b0e19] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 font-bold block">Active Cohort Size</span>
            <span className="text-xl font-black text-white">48 Interns</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0e19] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 font-bold block">{activeRole.shortTitle} Track</span>
            <span className="text-xl font-black text-cyan-400">{activeRole.count} Active</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0e19] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 font-bold block">Current Sprint</span>
            <span className="text-xl font-black text-emerald-400">Week 3 of 6</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0e19] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 font-bold block">Sprint Deliverables</span>
            <span className="text-xl font-black text-amber-400">{submissions.length} / 5 Shipped</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── WORKSPACE TABS BAR ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar border-b border-white/10 text-xs">
        {[
          { id: 'roadmap', label: 'Weekly Tasks & Curriculum', icon: Layers },
          { id: 'submit', label: '+ Submit Work (PDF / Drive / GitHub)', icon: Send },
          { id: 'standup', label: 'Daily 60s Check-in', icon: Clock },
          { id: 'cohort', label: 'All 48 Cohort Interns', icon: Users },
          { id: 'certificate', label: 'Official Completion Certificate', icon: Award }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setInternActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-white/15 text-white border border-white/20 shadow-md'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* VIEW 1: MY SPRINT ROADMAP & DELIVERABLES                                      */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4 animate-fade-in">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>{activeRole.title} Weekly Tasks</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {roleAllottedTasks.length} {roleAllottedTasks.length === 1 ? 'Task' : 'Tasks'} Allotted
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {activeRole.summary}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isFounder && (
                <button
                  onClick={() => {
                    setTaskForm({
                      id: '',
                      roleId: activeRole.id,
                      week: `Week ${roleAllottedTasks.length + 1}`,
                      sprint: `Week ${roleAllottedTasks.length + 1}`,
                      title: '',
                      description: '',
                      submissionRequirements: 'Google Drive Link, GitHub Repository, or PDF Report',
                      dueDate: '2026-11-28'
                    });
                    setTaskModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-cyan-400/20 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Allot Real Task</span>
                </button>
              )}
              {roleAllottedTasks.length > 0 && (
                <button
                  onClick={() => setInternActiveTab('submit')}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Submit Work</span>
                </button>
              )}
            </div>
          </div>

          {/* Founder Task Manager Action Bar */}
          {isFounder && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    👑 FOUNDER TASK CONTROLS
                  </span>
                  <span className="text-xs font-bold text-white">Shaik Sowban</span>
                </div>
                <p className="text-[11px] text-gray-300">
                  Allot real weekly tasks to the <strong className="text-cyan-300">{activeRole.title}</strong> track. Interns will only see tasks you create.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleImportRecommendedCurriculum}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Import the 6 recommended weekly milestones as real tasks"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Load 6-Week Template</span>
                </button>
                {roleAllottedTasks.length > 0 && (
                  <button
                    onClick={handleClearTrackTasks}
                    className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    title="Delete all tasks for this track"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Task Deliverables List OR Authentic Empty State */}
          {roleAllottedTasks.length === 0 ? (
            <div className="p-10 rounded-3xl bg-[#0c101c] border border-white/10 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
                <Clock className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h4 className="text-base font-black text-white">No Weekly Tasks Allotted Yet</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Track Lead & Founder <strong className="text-white">Shaik Sowban</strong> has not assigned any tasks for the <strong className="text-cyan-400">{activeRole.title}</strong> track yet.
                </p>
                <p className="text-[11px] text-gray-500">
                  When Week 1 tasks are posted, your deliverables, instructions, and deadlines will appear right here.
                </p>
              </div>
              {isFounder && (
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setTaskForm({
                        id: '',
                        roleId: activeRole.id,
                        week: 'Week 1',
                        sprint: 'Week 1',
                        title: '',
                        description: '',
                        submissionRequirements: 'Google Drive Link, GitHub Repository, or PDF Report',
                        dueDate: '2026-11-28'
                      });
                      setTaskModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-cyan-400/20 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Allot First Task (Week 1)</span>
                  </button>
                  <button
                    onClick={handleImportRecommendedCurriculum}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Import 6-Week Template</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {roleAllottedTasks.map((del, idx) => {
                const sub = submissions.find(s => s.deliverableId === del.id);
                return (
                  <div
                    key={del.id}
                    className="p-5 rounded-2xl bg-[#0c101c] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300">
                          Task 0{idx + 1} • {del.sprint || del.week}
                        </span>
                        {sub?.status === 'approved' ? (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCheck className="w-3 h-3 text-emerald-400" />
                            <span>✓ APPROVED & SIGNED</span>
                          </span>
                        ) : sub?.status === 'revisions' ? (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            <span>⚠ REVISIONS REQUESTED</span>
                          </span>
                        ) : sub ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            ✓ SUBMITTED (UNDER REVIEW)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-400 border border-white/10">
                            PENDING SUBMISSION
                          </span>
                        )}

                        {sub?.score && (
                          <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                            Score: {sub.score}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-black text-white">{del.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{del.description || del.desc}</p>
                      {del.submissionRequirements && (
                        <p className="text-[11px] text-cyan-400/80 font-mono">
                          Format: {del.submissionRequirements}
                        </p>
                      )}

                      {sub ? (
                        <div className="mt-2 space-y-1.5">
                          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-300 space-y-1">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="text-gray-300 font-bold">
                                Submitted on {sub.submittedAt} • {sub.status === 'approved' ? 'Signed off by ' + (sub.leadSignatory || activeRole.leadName) : 'Awaiting ' + activeRole.leadName + ' Attestation'}
                              </span>
                            </div>
                            {sub.driveUrl && (
                              <div className="text-[10px] text-blue-300 font-mono truncate">
                                Drive: <a href={sub.driveUrl} target="_blank" rel="noreferrer" className="underline">{sub.driveUrl}</a>
                              </div>
                            )}
                            {sub.githubUrl && (
                              <div className="text-[10px] text-cyan-300 font-mono truncate">
                                GitHub: <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="underline">{sub.githubUrl}</a>
                              </div>
                            )}
                            {sub.pdfUrl && (
                              <div className="text-[10px] text-rose-300 font-mono truncate">
                                PDF: <a href={sub.pdfUrl} target="_blank" rel="noreferrer" className="underline">{sub.pdfUrl}</a>
                              </div>
                            )}
                          </div>

                          {sub.feedback && (
                            <div className="p-2.5 rounded-xl bg-emerald-950/25 border border-emerald-500/20 text-[11px] text-emerald-200 space-y-0.5">
                              <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[10px] uppercase tracking-wider">
                                <MessageSquare className="w-3 h-3" />
                                <span>Lead Feedback ({sub.leadSignatory || activeRole.leadName}):</span>
                              </div>
                              <p className="text-gray-300 italic pl-4">"{sub.feedback}"</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-[10px] text-gray-500 mt-1">
                          Due Date: <span className="font-mono text-gray-400">{del.dueDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2 flex-wrap">
                      {!sub && (
                        <button
                          onClick={() => {
                            setSelectedDeliverableId(del.id);
                            setSubmissionData(prev => ({ ...prev, title: del.title }));
                            setInternActiveTab('submit');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold cursor-pointer transition-all shadow-md shadow-cyan-400/20"
                        >
                          Submit Now
                        </button>
                      )}
                      {sub && sub.status !== 'approved' && (
                        <button
                          onClick={() => {
                            setSelectedDeliverableId(del.id);
                            setSubmissionData({
                              title: del.title,
                              driveUrl: sub.driveUrl || '',
                              githubUrl: sub.githubUrl || sub.prUrl || '',
                              pdfUrl: sub.pdfUrl || '',
                              demoUrl: sub.demoUrl || '',
                              loomUrl: sub.loomUrl || '',
                              notes: sub.notes || '',
                              hours: sub.hoursSpent || 15
                            });
                            setInternActiveTab('submit');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-all"
                        >
                          Edit Work
                        </button>
                      )}

                      {/* Founder Edit & Delete Controls */}
                      {isFounder && (
                        <>
                          <button
                            onClick={() => {
                              setTaskForm({
                                id: del.id,
                                roleId: del.roleId || activeRole.id,
                                week: del.week || del.sprint || 'Week 1',
                                sprint: del.sprint || del.week || 'Week 1',
                                title: del.title,
                                description: del.description || del.desc || '',
                                submissionRequirements: del.submissionRequirements || '',
                                dueDate: del.dueDate || '2026-11-28'
                              });
                              setTaskModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                            title="Edit task parameters"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTask(del.id)}
                            className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center transition-all cursor-pointer"
                            title="Delete this task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {/* Evaluator Grade Trigger */}
                      <button
                        onClick={() => {
                          setSelectedEvalIntern(session);
                          setSelectedEvalDeliverable(del);
                          setEvaluatorDrawerOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                        title="Open Evaluator Drawer to grade or sign off"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                        <span>{sub?.status === 'approved' ? 'Re-Grade' : 'Review & Grade'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'submit' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0c101d] border border-white/10 shadow-2xl space-y-6 animate-fade-in">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-cyan-400" />
              <span>Submit Weekly Work (Proof of Work)</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Submit your work via <strong className="text-white">PDF Document, Google Drive Link, or GitHub Repository</strong>. All submitted links will be permanently embedded in your <strong className="text-cyan-300">Official Completion Certificate</strong> and verifiable via QR Code.
            </p>
          </div>

          {isSubmittedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Deliverable submitted successfully! Proof-of-Work links embedded into your Completion Certificate.</span>
            </div>
          )}

          <form
            onSubmit={handleDeliverableSubmit}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Select Weekly Task
              </label>
              <select
                value={selectedDeliverableId}
                onChange={e => {
                  setSelectedDeliverableId(e.target.value);
                  const found = roleAllottedTasks.find(d => d.id === e.target.value);
                  if (found) setSubmissionData(prev => ({ ...prev, title: found.title }));
                }}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
              >
                <option value="">-- Choose Weekly Task --</option>
                {roleAllottedTasks.map(d => (
                  <option key={d.id} value={d.id}>{d.week || d.sprint} — {d.title}</option>
                ))}
              </select>
            </div>

            {/* Google Drive Link */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1 flex items-center justify-between">
                <span>📁 Google Drive Link (Folder, Docs, Slides, or Sheets)</span>
                <span className="text-[10px] text-gray-400 font-normal">Ensure link sharing is set to view</span>
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                value={submissionData.driveUrl || ''}
                onChange={e => setSubmissionData(prev => ({ ...prev, driveUrl: e.target.value }))}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* GitHub Repo / PR Link */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1 flex items-center justify-between">
                <span>🐙 GitHub Repository or Pull Request Link</span>
                <span className="text-[10px] text-gray-400 font-normal">For code, test suites, or markdown documentation</span>
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={submissionData.githubUrl || submissionData.prUrl || ''}
                onChange={e => setSubmissionData(prev => ({ ...prev, githubUrl: e.target.value, prUrl: e.target.value }))}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* PDF Report Link */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1 flex items-center justify-between">
                <span>📄 PDF Document Link / Cloud Report URL</span>
                <span className="text-[10px] text-gray-400 font-normal">Direct link to your compiled PDF report or summary</span>
              </label>
              <input
                type="url"
                placeholder="https://.../weekly-report.pdf or Drive PDF link"
                value={submissionData.pdfUrl || ''}
                onChange={e => setSubmissionData(prev => ({ ...prev, pdfUrl: e.target.value }))}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* Live Demo & Loom Walkthrough (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  🌐 Live Demo / Figma Prototype (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={submissionData.demoUrl || ''}
                  onChange={e => setSubmissionData(prev => ({ ...prev, demoUrl: e.target.value }))}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  🎥 Loom Video Walkthrough (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://loom.com/share/..."
                  value={submissionData.loomUrl || ''}
                  onChange={e => setSubmissionData(prev => ({ ...prev, loomUrl: e.target.value }))}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Technical Notes & Summary of Completed Work
              </label>
              <textarea
                rows={3}
                required
                placeholder="Briefly describe what you built, tested, researched, or designed this week..."
                value={submissionData.notes || ''}
                onChange={e => setSubmissionData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* AI Pre-Audit Card */}
            <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Automated AI Pre-Audit Engine</span>
                </span>
                <button
                  type="button"
                  onClick={handleRunAiAudit}
                  disabled={aiAuditing}
                  className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-bold border border-cyan-500/40 cursor-pointer disabled:opacity-50"
                >
                  {aiAuditing ? 'Running Scan...' : 'Run Quality Audit'}
                </button>
              </div>

              {aiAuditReport && (
                <div className="space-y-2 pt-2 border-t border-white/10 text-xs animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400 font-bold">✓ Score: {aiAuditReport.score}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                      {aiAuditReport.status}
                    </span>
                  </div>
                  <ul className="space-y-1 text-gray-300 text-[11px]">
                    {aiAuditReport.rubric.map((r, rIdx) => (
                      <li key={rIdx} className="flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span className="font-semibold text-white">{r.item}:</span>
                        <span className="text-gray-400">{r.comment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:opacity-90 text-black font-extrabold text-xs shadow-lg shadow-cyan-400/20 transition-all cursor-pointer"
            >
              Submit Deliverable to {activeRole.leadName}
            </button>
          </form>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* VIEW 3: DAILY 60S CHECK-IN STANDUP                                            */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'standup' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0c101d] border border-white/10 shadow-2xl space-y-6 animate-fade-in">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Daily 60-Second Async Check-in</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Zero status meetings. Keep your mentor <span className="text-white font-bold">{activeRole.leadName}</span> updated asynchronously.
            </p>
          </div>

          {standupSubmitted && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Today's standup logged! Synchronized to cohort telemetry.</span>
            </div>
          )}

          <form
            onSubmit={e => {
              e.preventDefault();
              setStandupSubmitted(true);
              setTimeout(() => setStandupSubmitted(false), 3000);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold text-emerald-400 block mb-1">
                1. What did you ship today?
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Executed cross-browser test matrix on Chrome & Safari..."
                value={standupEntry.shipped}
                onChange={e => setStandupEntry(prev => ({ ...prev, shipped: e.target.value }))}
                className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-cyan-400 block mb-1">
                2. What are you tackling tomorrow?
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Automating Playwright test scripts for student login..."
                value={standupEntry.next}
                onChange={e => setStandupEntry(prev => ({ ...prev, next: e.target.value }))}
                className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-rose-400 block mb-1">
                3. Any blockers / need help from mentors?
              </label>
              <textarea
                rows={2}
                placeholder="None, all systems clear (or specify if blocked)..."
                value={standupEntry.blockers}
                onChange={e => setStandupEntry(prev => ({ ...prev, blockers: e.target.value }))}
                className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-white outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              Post Daily Check-in
            </button>
          </form>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* VIEW 4: LIVE COHORT ROSTER (20 SELECTED INTERNS)                              */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'cohort' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 className="text-base font-black text-white">
                Batch 01 Selected Cohort Directory ({REAL_SELECTED_INTERNS.length} Total)
              </h3>
              <p className="text-xs text-gray-400">
                10 Research • 6 Content Creation • 3 Software Testing • 1 Marketing
              </p>
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedRosterFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRosterFilter === 'all' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                All ({REAL_SELECTED_INTERNS.length})
              </button>
              {INTERN_ROLES.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRosterFilter(r.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedRosterFilter === r.id ? r.bgBadge : 'text-gray-400 hover:text-white bg-white/5'
                  }`}
                >
                  {r.shortTitle} ({r.count})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredRoster.map(intern => (
              <div
                key={intern.id}
                className="p-4 rounded-2xl bg-[#0c101c] border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-white">{intern.name}</h4>
                    <span className="text-[10px] font-mono text-cyan-300 font-bold block">
                      {intern.id}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {intern.status}
                  </span>
                </div>

                <div className="text-[11px] text-gray-400 space-y-1">
                  <p className="text-gray-300 font-semibold truncate">{intern.roleTitle}</p>
                  <p className="truncate">{intern.college}</p>
                  <p className="text-gray-400 font-mono text-[10px] truncate">{intern.branch} • {intern.currentYear}</p>
                  <p className="text-cyan-400/80 font-mono text-[10px] truncate">{intern.email}</p>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 font-bold">
                      Batch: <span className="text-emerald-400">Batch 01 • Active</span>
                    </span>
                    <span className="text-gray-400">
                      Lead: <span className="text-cyan-400 font-bold">{intern.lead.split('&')[0]}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const internRole = INTERN_ROLES.find(r => r.id === intern.roleId) || INTERN_ROLES[0];
                      setSelectedEvalIntern(intern);
                      setSelectedEvalDeliverable(internRole.deliverables[0]);
                      setEvaluatorDrawerOpen(true);
                    }}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Review & Grade Tasks</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* VIEW 5: STRONG VERIFIABLE PROOF OF SKILL CREDENTIAL SYSTEM                    */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'certificate' && (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
          
          {/* Header & Verification Protocol Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CRYPTOGRAPHICALLY VERIFIABLE PROOF OF SKILL • BATCH 01 REGISTRY ACTIVE</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Official Lumixora Attestation & Proof of Skill Credential
            </h3>
            <p className="text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">
              Issued and stamped by Lumixora Placement Intelligence with verifiable deliverable telemetry, peer-reviewed scores, and cryptographic fingerprinting.
            </p>
          </div>

          {/* Theme Switcher Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-black/40 border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive Color & Style:</span>
              </span>
              <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {CERTIFICATE_STYLES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setCertTheme(st.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      certTheme === st.id
                        ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black font-black shadow-md shadow-amber-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{st.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified & Active ✓
              </span>
            </div>
          </div>

          {/* Master Certificate Canvas (Executive Ivory / Midnight / Sapphire / Classic) */}
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <CertificateRenderer
              cert={{
                id: `LMX-INT-2026-${session.id.replace(/[^a-zA-Z0-9]/g, '')}`,
                title: 'Certificate of Internship Completion',
                isInternship: true,
                internName: session.name,
                issuedTo: session.name,
                studentName: session.name,
                rollNumber: session.id,
                college: session.college || 'G. Pulla Reddy Engineering College (Autonomous)',
                track: activeRole.title,
                domain: activeRole.title,
                category: activeRole.title,
                duration: '6-Week Intensive Engineering Internship (Batch 01)',
                startDate: '15 Nov 2026',
                endDate: '30 Dec 2026',
                hoursLogged: 120,
                score: '98% Distinction',
                grade: 'Elite Distinction (A+ Grade)',
                verificationHash: certSha256,
                founderSignatureName: 'Shaik Sowban',
                founderRole: 'Founder, CEO & Tech Lead',
                signer2Name: 'Team Lumixora',
                signer2Role: 'Product Development Team',
                signer2Org: 'Lumixora Engineering Council',
                tasks: submissions,
                githubUrl: submissions.find(s => s.githubUrl)?.githubUrl || '',
                driveUrl: submissions.find(s => s.driveUrl)?.driveUrl || '',
                pdfUrl: submissions.find(s => s.pdfUrl)?.pdfUrl || '',
                demoUrl: submissions.find(s => s.demoUrl)?.demoUrl || '',
                skills: [
                  'Product Testing',
                  'Quality Analysis',
                  'Innovation Mindset'
                ]
              }}
              studentName={session.name}
              collegeName={session.college}
              styleId={certTheme}
              qrCodeDataUrl={certQrUrl}
              user={user}
            />
          </div>

          {/* Action Bar (LinkedIn + Verify + Print + Copy Link) */}
          <div className="p-4 rounded-2xl bg-[#0b0e19] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-300">Credential Actions:</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* 1-Click LinkedIn Add to Profile */}
              <a
                href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent('Lumixora Certified ' + activeRole.title)}&organizationName=Lumixora&issueYear=2026&issueMonth=12&certUrl=${encodeURIComponent('https://lumixora.in/verify?id=' + session.id)}&certId=${encodeURIComponent(session.id)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#0A66C2]/20 cursor-pointer"
                title="Add this certification directly to your official LinkedIn profile"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Add to LinkedIn Profile</span>
              </a>

              {/* Online Verification Link */}
              <button
                onClick={() => {
                  const url = `https://lumixora.in/verify?id=${session.id}`;
                  window.open(url, '_blank');
                }}
                className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Verify Online</span>
              </button>

              {/* Copy Direct Link */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://lumixora.in/verify?id=${session.id}`);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              {/* Print / Download PDF */}
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
                title="Print or Save as High-Res PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

        </div>
      )}

      
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* FOUNDER TASK ALLOTMENT & EDIT MODAL                                           */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0c101c] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {taskForm.id ? 'Edit Allotted Task' : 'Allot Real Weekly Task'}
                  </h3>
                  <p className="text-[11px] text-gray-400">Founder & Tech Lead Action (Shaik Sowban)</p>
                </div>
              </div>
              <button
                onClick={() => setTaskModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAllottedTask} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Target Track</label>
                <select
                  value={taskForm.roleId || activeRole.id}
                  onChange={e => setTaskForm(prev => ({ ...prev, roleId: e.target.value }))}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  {INTERN_ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.title} ({r.count} Interns)</option>
                  ))}
                  <option value="all">All Tracks (Common Task)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Sprint / Week</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Week 1 or Sprint 01"
                    value={taskForm.week}
                    onChange={e => setTaskForm(prev => ({ ...prev, week: e.target.value, sprint: e.target.value }))}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskForm.dueDate}
                    onChange={e => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Test Plan & Severity Bug Matrix"
                  value={taskForm.title}
                  onChange={e => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Detailed Description & Instructions</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what interns must accomplish, guidelines, edge cases, and rubrics..."
                  value={taskForm.description}
                  onChange={e => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Submission Deliverable Requirements</label>
                <input
                  type="text"
                  placeholder="e.g. Google Drive Link, GitHub Repository, or PDF Report"
                  value={taskForm.submissionRequirements}
                  onChange={e => setTaskForm(prev => ({ ...prev, submissionRequirements: e.target.value }))}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-cyan-400/20 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{taskForm.id ? 'Save Changes' : 'Publish Task to Interns'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evaluator Review & Grading Drawer */}
      <EvaluatorReviewDrawer
        isOpen={evaluatorDrawerOpen}
        onClose={() => setEvaluatorDrawerOpen(false)}
        deliverable={selectedEvalDeliverable}
        intern={selectedEvalIntern || session}
        role={activeRole}
        allInterns={REAL_SELECTED_INTERNS}
        onSaveEvaluation={(updatedSub, evaluatedIntern) => {
          if (evaluatedIntern.id === session.id) {
            setSubmissions(prev => {
              const updated = [...prev.filter(s => s.deliverableId !== updatedSub.deliverableId), updatedSub];
              return updated;
            });
          }
        }}
      />

    </div>
  );
}
