import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Upload, 
  Award, 
  FileText, 
  ExternalLink, 
  GitPullRequest, 
  Video, 
  Calendar, 
  ShieldCheck, 
  User, 
  Sparkles, 
  Share2, 
  Printer, 
  Download, 
  ChevronRight, 
  Star, 
  Plus, 
  RefreshCw, 
  Copy, 
  Check, 
  MessageSquare,
  Building2,
  Phone,
  Mail,
  GraduationCap,
  Key,
  Lock,
  Unlock,
  Edit3,
  ChevronDown,
  ChevronUp,
  Link2,
  Send,
  CheckCheck,
  Map,
  Flame,
  Bot,
  CheckSquare,
  Zap,
  Trophy,
  TrendingUp,
  Layers,
  X
} from 'lucide-react';
import QRCode from 'qrcode';

const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
import { 
  fetchInternsList, 
  fetchInternTasks, 
  submitInternTask, 
  reviewInternTask, 
  fetchInternCertificates, 
  verifyCertificate, 
  issueInternCertificate,
  saveInternProfile,
  lookupIntern,
  validateInternLogin,
  updateInternCredentials,
  generateLinkedInCertificationUrl,
  generateLinkedInPostText,
  generateWhatsAppShareUrl,
  fetchInternStandups,
  submitDailyStandup,
  COHORT_ROADMAP,
  runAiPreAudit,
  DOMAIN_REGISTRY,
  resolveDomain,
  getDomainConfig,
  getMilestonesForDomain,
  getRoadmapForDomain,
  runDomainAiPreAudit
} from '../services/internDbService';
import { lookupApplication } from '../services/internshipDb';
import { isFounderEmail, cleanScholarName } from '../utils/authSecurity';
import { useToast } from '../context/ToastContext';
import CertificateRenderer, { CERTIFICATE_STYLES } from '../components/CertificateRenderer';
import LetterOfRecommendation from '../components/LetterOfRecommendation';

export default function InternWorkspacePortal({ user, setActiveTab, initialSubView, onLogin }) {
  const isFounder = Boolean(isFounderEmail(user?.email));
  const toastContext = useToast();
  const addToast = toastContext?.addToast || (({ message }) => console.log(message));

  const [activeSubView, setActiveSubView] = useState(() => {
    if (initialSubView) return initialSubView;
    if (isFounder) return 'roster';
    return 'overview';
  });

  const handleSubViewChange = (newView) => {
    setActiveSubView(newView);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [internProfile, setInternProfile] = useState(null);
  const [tasksList, setTasksList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allInterns, setAllInterns] = useState([]);
  const [rosterFilterMode, setRosterFilterMode] = useState('accepted'); // 'accepted' | 'all'
  const [rosterSearch, setRosterSearch] = useState('');

  // QR Code State
  const [idPassQr, setIdPassQr] = useState('');
  const [certQr, setCertQr] = useState('');
  const [showIdCardModal, setShowIdCardModal] = useState(false);

  // Manage printing class on body when intern ID card is active
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (showIdCardModal) {
      document.body.classList.add('print-intern-id-card');
    } else {
      document.body.classList.remove('print-intern-id-card');
    }
    return () => {
      document.body.classList.remove('print-intern-id-card');
    };
  }, [showIdCardModal]);

  const handlePrintIdCard = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('print-intern-id-card');
      window.print();
    }
  };

  const handlePrintInternOffer = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('print-intern-offer');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('print-intern-offer');
      }, 1500);
    }
  };

  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getTodayDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${days[new Date().getDay()]} (Sprint 1)`;
  };

  // Intern Direct Sign-In Modal State
  const [isInternLoginOpen, setIsInternLoginOpen] = useState(false);
  const [internLoginId, setInternLoginId] = useState('');
  const [internLoginPin, setInternLoginPin] = useState('');
  const [internLoggingIn, setInternLoggingIn] = useState(false);

  // Edit PIN Modal State (Founder)
  const [isEditPinModalOpen, setIsEditPinModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState(null);
  const [newPinValue, setNewPinValue] = useState('');
  const [savingPin, setSavingPin] = useState(false);

  // Expanded Research Chat/Notes in Task Feed
  const [expandedResearchTaskId, setExpandedResearchTaskId] = useState(null);
  const [copiedPasscodeId, setCopiedPasscodeId] = useState(null);

  // Active intern domain configuration (Auto-detected from intern profile track/preferredRole)
  const activeDomain = useMemo(() => {
    return getDomainConfig(internProfile?.track || internProfile?.preferredRole);
  }, [internProfile?.track, internProfile?.preferredRole]);

  // Selected domain for viewing roadmap (defaults to intern's active domain)
  const [selectedRoadmapDomain, setSelectedRoadmapDomain] = useState('software_testing');

  // Task Submission Form State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submittingTask, setSubmittingTask] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    milestone: '',
    category: 'software_testing',
    submissionDate: getTodayStr(),
    submissionDay: getTodayDayName(),
    researchChatLinks: '',
    researchNotes: '',
    description: '',
    githubUrl: '',
    liveDemoUrl: '',
    loomUrl: '',
    hoursSpent: 10
  });

  // Current domain being configured in the task submission form
  const currentFormDomain = useMemo(() => {
    return DOMAIN_REGISTRY[taskForm.category] || activeDomain;
  }, [taskForm.category, activeDomain]);

  const currentFormMilestones = useMemo(() => {
    return currentFormDomain.milestoneOptions || [];
  }, [currentFormDomain]);

  // Open Task Submission modal with domain-specific defaults
  const handleOpenSubmitModal = (presetMilestone = null, presetTitle = null, presetCategory = null) => {
    const dKey = presetCategory || taskForm.category || activeDomain.id;
    const domainCfg = DOMAIN_REGISTRY[dKey] || activeDomain;
    const milestones = domainCfg.milestoneOptions || [];

    setTaskForm(prev => ({
      ...prev,
      category: dKey,
      milestone: presetMilestone || milestones[0]?.label || prev.milestone,
      title: presetTitle !== null ? presetTitle : (prev.title || (milestones[0]?.defaultTitle || '')),
      submissionDate: getTodayStr(),
      submissionDay: getTodayDayName()
    }));
    setIsSubmitModalOpen(true);
  };

  // Review Task State (Founder Mode)
  const [reviewModalTask, setReviewModalTask] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('approved');
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [savingReview, setSavingReview] = useState(false);

  // Application Tracker State
  const [trackQuery, setTrackQuery] = useState(user?.email || '');
  const [trackedApp, setTrackedApp] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackSearched, setTrackSearched] = useState(false);

  // Certificate Verification & View State
  const [certQuery, setCertQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [certTheme, setCertTheme] = useState('executive_ivory');
  const [certSubTab, setCertSubTab] = useState('certificate'); // 'certificate' | 'ledger' | 'lor'
  const [certLoading, setCertLoading] = useState(false);
  const [certSearched, setCertSearched] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCertPost, setCopiedCertPost] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // New Intern Creation (Founder)
  const [isAddInternOpen, setIsAddInternOpen] = useState(false);
  const [newInternForm, setNewInternForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: 'G. Pulla Reddy Engineering College (Autonomous)',
    degreeAndBranch: 'B.Tech CSE',
    track: 'Full-Stack & Cloud Systems',
    mentor: 'Shaik Sowban (Founder & CEO)',
    stipend: '₹8,000 / month',
    hoursPerWeek: '15-20 hrs/week'
  });

  // Certificate Issuance Modal (Founder)
  const [isIssueCertOpen, setIsIssueCertOpen] = useState(false);
  const [issueCertForm, setIssueCertForm] = useState({
    internName: '',
    internEmail: '',
    college: 'G. Pulla Reddy Engineering College (Autonomous)',
    track: 'Full-Stack Software Architecture & Cloud Systems',
    duration: '8 Weeks Intensive Internship (Sep 2026 – Oct 2026)',
    issueDate: 'October 2026',
    score: '98% Performance Score',
    grade: 'Elite Distinction (A+ Grade)',
    skills: 'React 19, Supabase PostgreSQL, Cloudflare Edge Deployment, REST API Architecture'
  });

  // --- ADVANCED FEATURE STATES ---
  // 1. Daily Standups & Streak
  const [standupsList, setStandupsList] = useState([]);
  const [standupForm, setStandupForm] = useState({
    shippedToday: '',
    workingNext: '',
    blockers: 'None - progressing on track.',
    hoursLogged: 4,
    mood: '🔥 In Flow'
  });
  const [submittingStandup, setSubmittingStandup] = useState(false);

  // 2. 6-Week Structured Cohort Roadmap (Adaptive to Selected Domain)
  const [roadmapMilestoneOverrides, setRoadmapMilestoneOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_roadmap_overrides');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const activeRoadmapDomainConfig = useMemo(() => {
    return DOMAIN_REGISTRY[selectedRoadmapDomain] || activeDomain;
  }, [selectedRoadmapDomain, activeDomain]);

  const displayedRoadmap = useMemo(() => {
    const baseRoadmap = activeRoadmapDomainConfig.roadmap || [];
    return baseRoadmap.map(sprint => ({
      ...sprint,
      milestones: sprint.milestones.map(m => ({
        ...m,
        done: roadmapMilestoneOverrides[m.id] !== undefined ? roadmapMilestoneOverrides[m.id] : m.done
      }))
    }));
  }, [activeRoadmapDomainConfig, roadmapMilestoneOverrides]);

  // 3. AI Sprint Copilot Pre-Audit
  const [aiCodeInput, setAiCodeInput] = useState('');
  const [aiNotesInput, setAiNotesInput] = useState('');
  const [aiPrUrl, setAiPrUrl] = useState('');
  const [aiDemoUrl, setAiDemoUrl] = useState('');
  const [aiLoomUrl, setAiLoomUrl] = useState('');
  const [aiAuditCategory, setAiAuditCategory] = useState('software_testing');
  const [aiAuditResult, setAiAuditResult] = useState(null);
  const [aiAuditing, setAiAuditing] = useState(false);

  // Load intern data and tasks
  const loadPortalData = async (mode = rosterFilterMode) => {
    setLoading(true);
    try {
      const [interns, tasks] = await Promise.all([
        fetchInternsList(mode),
        fetchInternTasks(isFounder ? null : user?.email)
      ]);

      setAllInterns(interns);
      setTasksList(tasks);

      // Match current user in intern roster
      const userEmail = (user?.email || '').toLowerCase().trim();
      const current = interns.find(i => (i.email || '').toLowerCase().trim() === userEmail) || interns[0];
      setInternProfile(current);

      if (current) {
        const dKey = resolveDomain(current.track || current.preferredRole);
        setSelectedRoadmapDomain(dKey);
        const dCfg = DOMAIN_REGISTRY[dKey] || DOMAIN_REGISTRY.software_testing;
        setTaskForm(prev => ({
          ...prev,
          category: dKey,
          milestone: dCfg.milestoneOptions?.[0]?.label || prev.milestone,
          title: prev.title || dCfg.milestoneOptions?.[0]?.defaultTitle || ''
        }));
        setAiAuditCategory(dKey);
      }

      // Generate Pass QR Code
      if (current) {
        const passUrl = `${window.location.origin}/#intern-portal?ref=${current.refId || current.id}`;
        QRCode.toDataURL(passUrl, { width: 220, margin: 1, color: { dark: '#111827', light: '#ffffff' } })
          .then(url => setIdPassQr(url))
          .catch(() => {});
      }

      // Auto-lookup application for the user or current profile
      const targetQuery = userEmail || (current ? current.email : null);
      if (targetQuery) {
        lookupApplication(targetQuery)
          .then(app => {
            if (app) {
              setTrackedApp(app);
              setTrackSearched(true);
            }
          })
          .catch(() => {});
      }

      // Load standups for this intern
      if (targetQuery) {
        fetchInternStandups(targetQuery)
          .then(st => {
            if (st && st.length > 0) setStandupsList(st);
          })
          .catch(() => {});
      }

      // Check if user has an issued certificate
      if (targetQuery) {
        const cert = await verifyCertificate(targetQuery);
        if (cert) {
          setSelectedCert(cert);
          const verifyUrl = cert.verificationUrl || `${window.location.origin}/#verify-cert/${cert.id}`;
          QRCode.toDataURL(verifyUrl, { width: 250, margin: 1, color: { dark: '#0a0d18', light: '#ffffff' } })
            .then(url => setCertQr(url))
            .catch(() => {});
        }
      }
    } catch (e) {
      console.warn("Intern portal data load notice:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, [user?.email]);

  // Automatically sync domain, roadmap curriculum, and task submission defaults when intern changes
  useEffect(() => {
    if (!internProfile) return;
    const dKey = resolveDomain(internProfile.track || internProfile.preferredRole);
    setSelectedRoadmapDomain(dKey);
    setAiAuditCategory(dKey);
    const dCfg = DOMAIN_REGISTRY[dKey] || DOMAIN_REGISTRY.software_testing;
    setTaskForm(prev => ({
      ...prev,
      category: dKey,
      milestone: dCfg.milestoneOptions?.[0]?.label || prev.milestone,
      title: prev.title || dCfg.milestoneOptions?.[0]?.defaultTitle || ''
    }));
  }, [internProfile?.id, internProfile?.email, internProfile?.track, internProfile?.preferredRole]);

  // Handle Dedicated Intern Login directly from within workspace
  const handleInternSignIn = async (e) => {
    e.preventDefault();
    if (!internLoginId.trim() || !internLoginPin.trim()) {
      addToast({ message: 'Please enter both your Intern ID / Email and your Passcode.', type: 'error' });
      return;
    }
    setInternLoggingIn(true);
    try {
      const internUser = await validateInternLogin(internLoginId.trim(), internLoginPin.trim());
      internUser.oneTimeFeePaid = true;
      internUser.feePaid = true;
      internUser.feeTxId = `INTERN-${internUser.refId || 'VERIFIED'}`;
      internUser.isIntern = true;
      if (internUser.email) {
        try {
          localStorage.setItem(`lumixora_fee_paid_${internUser.email.toLowerCase().trim()}`, 'true');
          localStorage.setItem(`lumixora_fee_tx_${internUser.email.toLowerCase().trim()}`, 'INTERN-VERIFIED');
        } catch (e) {}
      }
      addToast({ message: `Welcome back, ${internUser.name}! Intern workspace unlocked.`, type: 'success' });
      localStorage.setItem('lumixora_user', JSON.stringify(internUser));
      localStorage.setItem('lumixora_isAuthenticated', 'true');
      setInternProfile(internUser);
      setIsInternLoginOpen(false);
      setInternLoginId('');
      setInternLoginPin('');
      if (onLogin) onLogin(internUser);
      await loadPortalData();
    } catch (err) {
      addToast({ message: err.message || 'Login failed. Please check your credentials.', type: 'error' });
    } finally {
      setInternLoggingIn(false);
    }
  };

  // Handle Founder PIN update for an intern
  const handleSavePin = async (e) => {
    e.preventDefault();
    if (!editingIntern || !newPinValue.trim()) {
      addToast({ message: 'Please enter a valid PIN or passcode.', type: 'error' });
      return;
    }
    setSavingPin(true);
    try {
      await updateInternCredentials(editingIntern.docId || editingIntern.id, newPinValue.trim());
      addToast({ message: `Access Passcode successfully updated for ${editingIntern.name}!`, type: 'success' });
      setIsEditPinModalOpen(false);
      setEditingIntern(null);
      setNewPinValue('');
      await loadPortalData();
    } catch (err) {
      addToast({ message: `Failed to update passcode: ${err.message}`, type: 'error' });
    } finally {
      setSavingPin(false);
    }
  };

  // Handle Copy Full Intern Credentials & Instructions
  const handleCopyCredentials = (intern) => {
    const passcode = intern.accessPin || ('LMX@' + (intern.refId ? intern.refId.replace(/[^0-9]/g, '') : '2026'));
    const message = `🚀 LUMIXORA AUTONOMOUS SYSTEMS — INTERN ACCESS CREDENTIALS
Portal: ${window.location.origin}/#intern-portal
Intern Name: ${intern.name}
Intern ID: ${intern.refId || intern.id}
Registered Email: ${intern.email}
Access Passcode / PIN: ${passcode}
Track: ${intern.track}
Cohort: Batch 01 (Autumn 2026)

Instructions:
1. Open the portal: ${window.location.origin}/#intern-portal
2. Click "Intern Sign In" or select "Intern Portal" on the sign-in screen
3. Enter your Intern ID or Email along with your Passcode to access your dashboard and submit tasks.`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(message);
    }
    setCopiedPasscodeId(intern.id || intern.email);
    setTimeout(() => setCopiedPasscodeId(null), 3000);
    addToast({ message: `Login credentials copied for ${intern.name}!`, type: 'success' });
  };

  // Handle Task Submission
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      addToast({ message: 'Please provide a task deliverable title.', type: 'error' });
      return;
    }

    setSubmittingTask(true);
    try {
      const payload = {
        ...taskForm,
        internId: internProfile?.id || `LMX-INT-${Date.now()}`,
        internEmail: user?.email || internProfile?.email || 'intern@lumixora.in',
        internName: cleanScholarName(user?.name || internProfile?.name || 'Lumixora Intern'),
        track: internProfile?.track || currentFormDomain.title,
        category: taskForm.category || activeDomain.id,
        categoryTitle: currentFormDomain.title
      };

      const newTask = await submitInternTask(payload);
      setTasksList(prev => [newTask, ...prev]);
      addToast({ message: `${currentFormDomain.title} deliverable submitted successfully! Mentor notified.`, type: 'success' });
      setIsSubmitModalOpen(false);
      setTaskForm({
        title: '',
        milestone: currentFormMilestones[0]?.label || 'Sprint 1 - Deliverable',
        category: activeDomain.id,
        submissionDate: getTodayStr(),
        submissionDay: getTodayDayName(),
        researchChatLinks: '',
        researchNotes: '',
        description: '',
        githubUrl: '',
        liveDemoUrl: '',
        loomUrl: '',
        hoursSpent: 10
      });
      loadPortalData();
    } catch (err) {
      console.error(err);
      addToast({ message: `Failed to submit task: ${err.message}`, type: 'error' });
    } finally {
      setSubmittingTask(false);
    }
  };

  // Handle Review Task (Founder Mode)
  const handleReviewSave = async () => {
    if (!reviewModalTask) return;
    setSavingReview(true);
    try {
      const updated = await reviewInternTask(reviewModalTask.id, {
        status: reviewStatus,
        score: Number(reviewScore),
        mentorFeedback: reviewFeedback,
        reviewedBy: user?.name ? cleanScholarName(user.name) : 'Founder & Reviewer'
      });

      setTasksList(prev => prev.map(t => t.id === updated.id ? updated : t));
      addToast({ message: `Task evaluated and marked as ${reviewStatus.toUpperCase()}!`, type: 'success' });
      setReviewModalTask(null);
      loadPortalData();
    } catch (err) {
      addToast({ message: `Review failed: ${err.message}`, type: 'error' });
    } finally {
      setSavingReview(false);
    }
  };

  // --- ADVANCED FEATURE HANDLERS ---

  // 1. Milestone Interactive Checklist Toggle (Domain-Adaptive)
  const handleToggleMilestone = (milestoneId, currentStatus) => {
    setRoadmapMilestoneOverrides(prev => {
      const next = { ...prev, [milestoneId]: !currentStatus };
      try {
        localStorage.setItem('lumixora_roadmap_overrides', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    addToast({ message: "Sprint milestone status updated!", type: "info" });
  };

  // 2. Daily Standup Check-in Submit
  const handleStandupSubmit = async (e) => {
    e.preventDefault();
    if (!standupForm.shippedToday.trim()) {
      addToast({ message: "Please specify what you shipped or achieved today.", type: "error" });
      return;
    }
    setSubmittingStandup(true);
    try {
      const payload = {
        ...standupForm,
        internEmail: user?.email || internProfile?.email || 'intern@lumixora.in',
        internName: cleanScholarName(user?.name || internProfile?.name || 'Lumixora Intern'),
        internRefId: internProfile?.refId || 'LMX-B01'
      };
      const newStandup = await submitDailyStandup(payload);
      setStandupsList(prev => [newStandup, ...prev]);
      setStandupForm({
        shippedToday: '',
        workingNext: '',
        blockers: 'None - progressing on track.',
        hoursLogged: 4,
        mood: '🔥 In Flow'
      });
      addToast({ 
        message: `Daily Standup Logged! 🔥 Streak incremented and ${payload.hoursLogged}h added to verified hours.`, 
        type: "success" 
      });
      await loadPortalData();
    } catch (err) {
      addToast({ message: `Failed to log standup: ${err.message}`, type: "error" });
    } finally {
      setSubmittingStandup(false);
    }
  };

  // 3. AI Sprint Code & Architecture Pre-Audit (Domain-Adaptive)
  const handleRunAiAudit = (e) => {
    if (e) e.preventDefault();
    if (!aiCodeInput.trim() && !aiNotesInput.trim() && !aiPrUrl.trim() && !aiDemoUrl.trim() && !aiLoomUrl.trim()) {
      addToast({ message: `Please enter details, notes, or links for ${activeRoadmapDomainConfig.title} pre-audit.`, type: "error" });
      return;
    }
    setAiAuditing(true);
    setTimeout(() => {
      const targetCategory = aiAuditCategory || activeDomain.id;
      const result = runDomainAiPreAudit({
        codeSnippet: aiCodeInput,
        researchNotes: aiNotesInput,
        githubUrl: aiPrUrl,
        liveDemoUrl: aiDemoUrl,
        loomUrl: aiLoomUrl
      }, targetCategory);
      setAiAuditResult(result);
      setAiAuditing(false);
      addToast({ 
        message: `${result.domainTitle} Pre-Audit Complete! Score: ${result.overallScore}/100`, 
        type: "success" 
      });
    }, 600);
  };

  // Handle Application Tracker Search
  const handleSearchApp = async (e) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    setTrackLoading(true);
    try {
      const app = await lookupApplication(trackQuery.trim());
      setTrackedApp(app);
      setTrackSearched(true);
      if (!app) {
        addToast({ message: 'No application found with this reference ID or email.', type: 'error' });
      }
    } catch (err) {
      addToast({ message: 'Error querying application database.', type: 'error' });
    } finally {
      setTrackLoading(false);
    }
  };

  // Handle Certificate Lookup
  const handleSearchCert = async (e) => {
    e.preventDefault();
    if (!certQuery.trim()) return;
    setCertLoading(true);
    try {
      const cert = await verifyCertificate(certQuery.trim());
      setSelectedCert(cert);
      setCertSearched(true);
      if (cert) {
        const verifyUrl = cert.verificationUrl || `${window.location.origin}/#verify-cert/${cert.id}`;
        QRCode.toDataURL(verifyUrl, { width: 250, margin: 1, color: { dark: '#0a0d18', light: '#ffffff' } })
          .then(url => setCertQr(url))
          .catch(() => {});
        addToast({ message: 'Certificate authenticated successfully!', type: 'success' });
      } else {
        addToast({ message: 'Certificate ID not recognized in verified registry.', type: 'error' });
      }
    } catch (err) {
      addToast({ message: 'Verification lookup failed.', type: 'error' });
    } finally {
      setCertLoading(false);
    }
  };

  // Handle Add Intern (Founder)
  const handleAddIntern = async (e) => {
    e.preventDefault();
    if (!newInternForm.name || !newInternForm.email) {
      addToast({ message: 'Name and email are required.', type: 'error' });
      return;
    }

    try {
      const created = await saveInternProfile({
        ...newInternForm,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        tasksSubmitted: 0,
        tasksApproved: 0,
        attendancePct: 100,
        skills: ['Software Engineering', 'Full-Stack']
      });

      setAllInterns(prev => [created, ...prev]);
      addToast({ message: `Intern ${created.name} registered to Lumixora roster!`, type: 'success' });
      setIsAddInternOpen(false);
      setNewInternForm({
        name: '',
        email: '',
        phone: '',
        college: 'G. Pulla Reddy Engineering College (Autonomous)',
        degreeAndBranch: 'B.Tech CSE',
        track: 'Full-Stack & Cloud Systems',
        mentor: 'Shaik Sowban (Founder & CEO)',
        stipend: '₹8,000 / month',
        hoursPerWeek: '15-20 hrs/week'
      });
    } catch (err) {
      addToast({ message: `Failed to create intern: ${err.message}`, type: 'error' });
    }
  };

  // Handle Issue Certificate (Founder)
  const handleIssueCert = async (e) => {
    e.preventDefault();
    if (!issueCertForm.internName || !issueCertForm.internEmail) {
      addToast({ message: 'Intern name and email are required.', type: 'error' });
      return;
    }

    try {
      const payload = {
        ...issueCertForm,
        skills: issueCertForm.skills.split(',').map(s => s.trim())
      };
      const issued = await issueInternCertificate(payload);
      setSelectedCert(issued);
      addToast({ message: `Official Certificate ${issued.id} issued successfully!`, type: 'success' });
      setIsIssueCertOpen(false);
      setActiveSubView('certificate');
    } catch (err) {
      addToast({ message: `Certificate issuance failed: ${err.message}`, type: 'error' });
    }
  };

  // Stats calculation
  const approvedCount = tasksList.filter(t => t.status === 'approved').length;
  const pendingCount = tasksList.filter(t => t.status === 'pending_review' || t.status === 'under_review').length;
  const auraPoints = approvedCount * 150 + 200;

  // Filtered Roster for Founder Directory
  const filteredRoster = useMemo(() => {
    return allInterns.filter(i => {
      if (rosterFilterMode === 'accepted' && i.applicationStatus !== 'accepted' && i.status !== 'active') return false;
      if (rosterSearch.trim()) {
        const q = rosterSearch.toLowerCase();
        const matchName = (i.name || '').toLowerCase().includes(q);
        const matchEmail = (i.email || '').toLowerCase().includes(q);
        const matchRef = (i.refId || i.id || '').toLowerCase().includes(q);
        const matchTrack = (i.track || '').toLowerCase().includes(q);
        const matchCollege = (i.college || '').toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchRef && !matchTrack && !matchCollege) return false;
      }
      return true;
    });
  }, [allInterns, rosterFilterMode, rosterSearch]);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans p-3 md:p-6 space-y-6">
      
      {/* Top Banner & Control Deck */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-[#11162B] via-[#161d3b] to-[#12162d] border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Lumixora Interns Hub
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Cohort Batch 01
              </span>
              {isFounder && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Founder Access
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Dedicated workspace for Lumixora interns: upload deliverables, track application pipeline, and verify completion certificates.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          {internProfile ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Scholar: {internProfile.name ? cleanScholarName(internProfile.name).split(' ')[0] : 'Active'}</span>
              </span>
              <button
                onClick={() => setIsEditPinModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/10 flex items-center gap-1 transition-all cursor-pointer"
                title="Manage Secret PIN"
              >
                <Key className="w-3 h-3 text-cyan-400" />
                <span>PIN</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsInternLoginOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              title="Sign in with your separate Intern ID and Passcode"
            >
              <Key className="w-4 h-4 text-cyan-300" />
              <span>Intern Sign In</span>
            </button>
          )}

          <button
            onClick={() => handleOpenSubmitModal()}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Work</span>
          </button>

          {isFounder && (
            <button
              onClick={() => setIsAddInternOpen(true)}
              className="px-3 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Intern</span>
            </button>
          )}

          {setActiveTab && (
            <button
              onClick={() => setActiveTab('internships')}
              className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl transition-all cursor-pointer"
            >
              Application Portal
            </button>
          )}
        </div>
      </div>

      {/* Active Intern Live Selection & Sync Bar (FOUNDER ONLY - NEVER SHOWN TO REGULAR USERS/INTERNS) */}
      {isFounder && allInterns.length > 0 && (
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-white/[0.05] via-white/[0.03] to-transparent border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Intern (Live Firestore):
            </span>
            <select
              value={internProfile?.email || ''}
              onChange={(e) => {
                const selected = allInterns.find(i => (i.email || '').toLowerCase() === e.target.value.toLowerCase());
                if (selected) {
                  setInternProfile(selected);
                  const dKey = resolveDomain(selected.track || selected.preferredRole);
                  setSelectedRoadmapDomain(dKey);
                  const dCfg = DOMAIN_REGISTRY[dKey] || DOMAIN_REGISTRY.software_testing;
                  setTaskForm(prev => ({
                    ...prev,
                    category: dKey,
                    milestone: dCfg.milestoneOptions?.[0]?.label || '',
                    title: dCfg.milestoneOptions?.[0]?.defaultTitle || ''
                  }));
                  setAiAuditCategory(dKey);
                  setTrackQuery(selected.refId || selected.email);
                  setCertQuery(selected.refId || selected.email);
                  const passUrl = `${window.location.origin}/#intern-portal?ref=${selected.refId || selected.id}`;
                  QRCode.toDataURL(passUrl, { width: 220, margin: 1, color: { dark: '#111827', light: '#ffffff' } })
                    .then(url => setIdPassQr(url))
                    .catch(() => {});
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-black/70 border border-white/20 text-white font-bold text-xs focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[280px] sm:max-w-md truncate"
            >
              {allInterns.map(i => (
                <option key={i.id || i.email} value={i.email} className="bg-slate-900 text-white">
                  {i.name} — {i.track} ({i.refId || i.id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              Collection: <strong className="text-emerald-400">applications (Batch 01)</strong>
            </span>
            <button
              onClick={() => loadPortalData()}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 font-bold text-xs transition-all cursor-pointer"
              title="Refresh and sync live data from Firestore"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sync Live DB</span>
            </button>
          </div>
        </div>
      )}

      {/* Subportal Tab Bar (Sticky so navigation is permanently accessible) */}
      <div className="sticky top-16 lg:top-20 z-20 bg-[#070913]/95 backdrop-blur-xl py-3 border-y border-white/10 -mx-3 md:-mx-6 px-3 md:px-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          {isFounder && (
            <button
              onClick={() => handleSubViewChange('roster')}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeSubView === 'roster'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Interns Master Roster ({allInterns.length})</span>
            </button>
          )}

          <button
            onClick={() => handleSubViewChange('overview')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubView === 'overview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Dashboard & Pass</span>
          </button>

          <button
            onClick={() => handleSubViewChange('roadmap')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubView === 'roadmap'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            <Map className="w-4 h-4 text-violet-400" />
            <span>Cohort Roadmap</span>
          </button>

          <button
            onClick={() => handleSubViewChange('standup')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubView === 'standup'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/25 ring-1 ring-white/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Daily Standup</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
              🔥 {internProfile?.streakDays || 14}d
            </span>
          </button>

          <button
            onClick={() => handleSubViewChange('ai_copilot')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubView === 'ai_copilot'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-white/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>AI Code Copilot</span>
          </button>

          <button
            onClick={() => handleSubViewChange('upload_work')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubView === 'upload_work'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Task Submissions</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
              {tasksList.length}
            </span>
          </button>

          <button
            onClick={() => handleSubViewChange('track_app')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubView === 'track_app'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Application Tracker</span>
          </button>

          <button
            onClick={() => handleSubViewChange('certificate')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubView === 'certificate'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Verify Certificate</span>
          </button>

          <button
            onClick={() => handleSubViewChange('offer_letter')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubView === 'offer_letter'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            <FileText className="w-4 h-4 text-pink-400" />
            <span>Offer Letter</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* VIEW: MY DASHBOARD & DIGITAL INTERN PASS */}
      {/* ============================================================ */}
      {activeSubView === 'overview' && (
        <div className="max-w-7xl mx-auto space-y-6 pt-3 animate-fadeIn">
          
          {/* Top Quick Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Stat 1: Tasks Submitted */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#121633] via-[#0f142b] to-[#0a0d1d] border border-violet-500/30 hover:border-violet-400/50 shadow-lg shadow-violet-500/10 relative overflow-hidden backdrop-blur-md transition-all group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/15 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-violet-500/25">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Work Pipeline</span>
                  <span className="text-xs text-violet-300 font-bold">Tasks Submitted</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <p className="text-2xl md:text-3xl font-black text-white font-sora">{tasksList.length}</p>
                <span className="text-[10px] font-mono font-bold text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-md border border-violet-500/30">
                  {tasksList.length}/6 Target
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block mt-1">Deliverables in review pipeline</span>
            </div>

            {/* Stat 2: Approved Tasks */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0c1f24] via-[#0a1820] to-[#071118] border border-emerald-500/30 hover:border-emerald-400/50 shadow-lg shadow-emerald-500/10 relative overflow-hidden backdrop-blur-md transition-all group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/15 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Quality Audit</span>
                  <span className="text-xs text-emerald-300 font-bold">Approved Tasks</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <p className="text-2xl md:text-3xl font-black text-emerald-400 font-sora">{approvedCount}</p>
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  Verified ✓
                </span>
              </div>
              <span className="text-[11px] text-emerald-400/80 font-medium block mt-1">Reviewed by Tech Lead</span>
            </div>

            {/* Stat 3: Aura Points & Rank */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#101b2e] via-[#0d1624] to-[#080d17] border border-cyan-500/30 hover:border-cyan-400/50 shadow-lg shadow-cyan-500/10 relative overflow-hidden backdrop-blur-md transition-all group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-600/15 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/25">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Gamified Aura</span>
                  <span className="text-xs text-cyan-300 font-bold">Earned Aura</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <p className="text-2xl md:text-3xl font-black text-cyan-400 font-sora">{auraPoints} AP</p>
                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-500/30">
                  Top 5%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block mt-1">Cohort Performance Tier</span>
            </div>

            {/* Stat 4: Certification */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#241a0c] via-[#1c1409] to-[#120d06] border border-amber-500/30 hover:border-amber-400/50 shadow-lg shadow-amber-500/10 relative overflow-hidden backdrop-blur-md transition-all group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/15 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Credential</span>
                  <span className="text-xs text-amber-300 font-bold">Certification</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <p className="text-xl md:text-2xl font-black text-amber-400 font-sora">
                  {selectedCert ? 'Issued 📜' : (approvedCount >= 4 ? 'Eligible ⚡' : 'In Progress')}
                </p>
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {approvedCount}/4 Req
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block mt-1">
                {selectedCert ? 'Ready to Download & Share' : 'Verified completion badge'}
              </span>
            </div>
          </div>

          {/* Main 2-Column: Pass + Work Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left: Official Digital Intern Pass Card */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-3xl bg-gradient-to-b from-[#121736] via-[#0e122b] to-[#0a0d1e] border border-indigo-500/30 p-6 sm:p-7 shadow-[0_20px_50px_rgba(79,70,229,0.22)] relative overflow-hidden backdrop-blur-xl group hover:border-indigo-400/50 transition-all duration-300">
                {/* Glowing Ambient Light Orbs */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/[0.04] via-transparent to-transparent pointer-events-none" />

                {/* Holographic Header Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-violet-600 p-[1.5px] shadow-md shadow-indigo-500/30">
                      <div className="w-full h-full bg-[#0d1024] rounded-[10px] flex items-center justify-center">
                        <img src="/lumixora_logo_transparent.png" alt="Lumixora" className="w-5 h-5 object-contain" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider font-sora flex items-center gap-1">
                        <span>LUMIXORA</span>
                        <span className="text-[10px] text-cyan-400 font-extrabold tracking-normal">LABS</span>
                      </h3>
                      <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-widest">Autonomous Systems</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-wider">ACTIVE SCHOLAR</span>
                  </div>
                </div>

                {/* Scholar Profile Presentation */}
                <div className="py-6 text-center flex flex-col items-center relative z-10">
                  {/* Avatar with Iridescent Glowing Ring */}
                  <div className="relative mb-3.5 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-violet-500 p-[2.5px] shadow-[0_0_25px_rgba(99,102,241,0.4)]">
                      <div className="w-full h-full rounded-[14px] bg-[#0c1022] flex items-center justify-center overflow-hidden border border-white/10">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-300 via-white to-violet-200 font-sora">
                          {internProfile?.name ? internProfile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'IN'}
                        </span>
                      </div>
                    </div>
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-black uppercase tracking-wider shadow-md border border-white/20">
                      PRO
                    </span>
                  </div>

                  <h2 className="text-lg font-black text-white tracking-tight flex items-center justify-center gap-1.5">
                    <span>{internProfile?.name ? cleanScholarName(internProfile.name) : 'Lumixora Intern'}</span>
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  </h2>

                  <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-300 border border-cyan-500/30 shadow-xs flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{internProfile?.track || activeDomain.title}</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium mt-2 flex items-center justify-center gap-1.5 max-w-[260px]">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{internProfile?.college || 'G. Pulla Reddy Engineering College'}</span>
                  </p>
                </div>

                {/* Details Grid (Glass Tiles) */}
                <div className="space-y-2 relative z-10">
                  <div className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 transition-all flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      Intern ID
                    </span>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-white font-mono font-bold text-xs bg-black/40 px-2 py-0.5 rounded-lg border border-white/10">
                        {internProfile?.id || 'LMX-INT-2026-001'}
                      </strong>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(internProfile?.id || 'LMX-INT-2026-001');
                          setCopiedId(true);
                          setTimeout(() => setCopiedId(false), 2000);
                          addToast({ message: 'Intern ID copied to clipboard!', type: 'success' });
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                        title="Copy ID"
                      >
                        {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 transition-all flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                      <User className="w-3 h-3 text-indigo-400" />
                      Assigned Mentor
                    </span>
                    <strong className="text-slate-200 text-xs font-semibold">
                      {internProfile?.mentor || 'Shaik Sowban (Founder & CEO)'}
                    </strong>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 transition-all flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-purple-400" />
                      Cohort Dates
                    </span>
                    <strong className="text-slate-200 font-mono text-[11px]">
                      {internProfile?.startDate || 'Oct 2026'} – {internProfile?.endDate || 'Dec 2026'}
                    </strong>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20 transition-all flex items-center justify-between">
                    <span className="text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                      <Award className="w-3 h-3 text-emerald-400" />
                      Stipend & Perks
                    </span>
                    <strong className="text-emerald-300 font-bold text-xs truncate max-w-[180px]">
                      {internProfile?.stipend || 'Performance Bonus + Certificate'}
                    </strong>
                  </div>
                </div>

                {/* High-Fidelity Verification QR Frame */}
                {idPassQr && (
                  <div className="mt-4 p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3 relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-white p-1 shrink-0 shadow-md">
                      <img src={idPassQr} alt="Intern QR" className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-slate-300 font-bold block leading-tight">
                        Lumixora Cryptographic Registry
                      </span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">
                        Scan to verify official credential & verified badge
                      </span>
                      <span className="text-[9px] font-mono text-cyan-400 font-semibold block mt-0.5 truncate">
                        HASH: {internProfile?.id || 'LMX-INT-2026-001'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Print Pass & Standup Actions */}
                <div className="no-print pt-5 mt-4 border-t border-white/10 flex flex-col gap-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrintIdCard}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 text-xs font-black transition-all border border-cyan-500/40 hover:border-cyan-400 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 hover:scale-[1.02] active:scale-98"
                    >
                      <Printer className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Print ID Card</span>
                    </button>
                    <button
                      onClick={() => handleSubViewChange('standup')}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 text-orange-300 text-xs font-black transition-all border border-orange-500/40 hover:border-orange-400 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/10 hover:scale-[1.02] active:scale-98"
                    >
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span>Daily Standup</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleSubViewChange('offer_letter')}
                    className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-[11px] font-bold transition-all border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>View Engagement Offer Letter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Work Submission Hub & Action shortcuts */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Executive Sprint Mission Control Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#121633] via-[#0f142b] to-[#0a0d1e] border border-indigo-500/30 shadow-[0_20px_50px_rgba(79,70,229,0.18)] backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/20 via-violet-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/[0.04] via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-violet-500/20 to-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Active Sprint: Sprint 01</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Week 1 of 6
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-black text-white tracking-tight font-sora mt-1">
                      Core Intelligence & Deliverables Hub
                    </h3>

                    <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                      Submit your GitHub Pull Requests, live project endpoints, Loom walkthroughs, and research notes for mentor code review and verified credential tracking.
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenSubmitModal()}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-black text-xs shadow-xl shadow-indigo-500/30 flex items-center gap-2.5 shrink-0 cursor-pointer transition-all hover:scale-105 active:scale-95 group-hover:shadow-indigo-500/40"
                  >
                    <Upload className="w-4 h-4 text-white" />
                    <span>Submit Deliverable</span>
                  </button>
                </div>

                {/* Subportal Quick Navigation Badges */}
                <div className="relative z-10 pt-4 mt-5 border-t border-white/10 flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">Quick Tools:</span>
                  <button
                    onClick={() => handleSubViewChange('roadmap')}
                    className="px-3 py-1.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/25 flex items-center gap-1.5 font-bold cursor-pointer transition-all hover:border-violet-400"
                  >
                    <Map className="w-3.5 h-3.5 text-violet-400" />
                    <span>Cohort Roadmap</span>
                  </button>
                  <button
                    onClick={() => handleSubViewChange('standup')}
                    className="px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/25 flex items-center gap-1.5 font-bold cursor-pointer transition-all hover:border-orange-400"
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>Check-in Standup</span>
                  </button>
                  <button
                    onClick={() => handleSubViewChange('ai_copilot')}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 flex items-center gap-1.5 font-bold cursor-pointer transition-all hover:border-cyan-400"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI Code Copilot</span>
                  </button>
                  <button
                    onClick={() => handleSubViewChange('offer_letter')}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 font-bold cursor-pointer transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-pink-400" />
                    <span>Offer Letter</span>
                  </button>
                </div>
              </div>

              {/* Recent Tasks List & High-Impact Milestone Pipeline */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0f1329] to-[#0a0d1d] border border-white/10 space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2 font-sora">
                        <span>Sprint 01 Work Pipeline</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300">
                          {tasksList.length} Active
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Auditable milestones evaluated directly by engineering leads</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSubView('upload_work')}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>View All Submissions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {tasksList.length === 0 ? (
                  /* ========================================== */
                  /* ULTRA-PREMIUM ONBOARDING & MILESTONE STAGE */
                  /* ========================================== */
                  <div className="space-y-5">
                    {/* Visual Milestone Stepper */}
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>Sprint 1 Milestone Roadmap</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Step 2 in Progress</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        {/* Step 1 */}
                        <div className="p-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/30 space-y-1 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Step 01</span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">Done ✓</span>
                          </div>
                          <strong className="text-white block font-bold text-[12px] mt-1">Cohort Onboarding</strong>
                          <p className="text-[11px] text-slate-300 leading-snug">Track assignment and workspace verification completed.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/10 border border-indigo-500/40 space-y-1 relative shadow-lg shadow-indigo-500/10">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                              Step 02: Active
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 text-[9px] font-bold">Due Week 1</span>
                          </div>
                          <strong className="text-white block font-bold text-[12px] mt-1">Architecture & Setup</strong>
                          <p className="text-[11px] text-slate-300 leading-snug">Initialize Git repository, system diagram, and environment.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 opacity-70">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Step 03</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400 text-[9px] font-bold">Upcoming</span>
                          </div>
                          <strong className="text-white block font-bold text-[12px] mt-1">Prototype Submission</strong>
                          <p className="text-[11px] text-slate-400 leading-snug">Submit PR and live endpoint for mentor review & score.</p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Dropzone Invitation Card */}
                    <div 
                      onClick={() => handleOpenSubmitModal()}
                      className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/30 via-indigo-950/20 to-purple-950/20 border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 transition-all duration-300 text-center space-y-3 cursor-pointer group hover:bg-indigo-950/30"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600/30 transition-all">
                        <Upload className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                          Ready to submit your first milestone deliverable?
                        </h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                          Click here to open the submission form. Attach your GitHub Pull Request, Live Demo URL, or Loom Walkthrough.
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-3 pt-1 flex-wrap">
                        <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-center gap-1.5 font-bold">
                          <GithubIcon className="w-3.5 h-3.5 text-slate-400" /> GitHub Repo / PR
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-center gap-1.5 font-bold">
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> Live Demo URL
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-center gap-1.5 font-bold">
                          <Video className="w-3.5 h-3.5 text-purple-400" /> Loom Walkthrough
                        </span>
                      </div>
                    </div>

                    {/* Mentor Guidance Note */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] to-orange-500/[0.04] border border-amber-500/20 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-black text-amber-300">Shaik Sowban</strong>
                          <span className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">• Founder & Tech Lead</span>
                        </div>
                        <p className="text-[11.5px] text-slate-300 leading-relaxed italic">
                          "Welcome to Lumixora Autonomous AI Labs, {internProfile?.name ? internProfile.name.split(' ')[0] : 'Scholar'}! High-velocity execution starts with clean system architecture and small, regular pull requests. Submit your initial milestone early and let's ship impactful work."
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasksList.slice(0, 3).map(task => (
                      <div 
                        key={task.id}
                        className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/15 transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-bold text-white">{task.title}</h4>
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-white/10 text-slate-300">
                                {task.category || 'General'}
                              </span>
                              <span className="text-[10px] text-indigo-400 font-semibold">
                                {task.milestone}
                              </span>
                            </div>
                            {(task.submissionDate || task.submissionDay) && (
                              <div className="flex items-center gap-1.5 text-[10px] text-indigo-300 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 w-fit mt-1">
                                <Calendar className="w-3 h-3 text-indigo-400" />
                                <span>{task.submissionDate || ''}</span>
                                {task.submissionDay && <span>• {task.submissionDay}</span>}
                              </div>
                            )}
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div className="shrink-0">
                            {task.status === 'approved' ? (
                              <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Approved
                              </span>
                            ) : task.status === 'changes_requested' ? (
                              <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Revisions Needed
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> In Review
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Links & Feedback */}
                        <div className="flex items-center justify-between gap-4 pt-1 text-[11px] text-slate-400 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            {task.researchChatLinks && (
                              <a 
                                href={task.researchChatLinks.startsWith('http') ? task.researchChatLinks : `https://${task.researchChatLinks}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center gap-1 text-purple-300 hover:text-white bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-500/30 font-bold text-[10px] transition-colors"
                              >
                                <Link2 className="w-3 h-3 text-purple-400" /> Research Chat
                              </a>
                            )}
                            {task.githubUrl && (
                              <a href={task.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-400 hover:underline">
                                <GitPullRequest className="w-3 h-3" /> Pull Request
                              </a>
                            )}
                            {task.liveDemoUrl && (
                              <a href={task.liveDemoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-400 hover:underline">
                                <ExternalLink className="w-3 h-3" /> Live Demo
                              </a>
                            )}
                            {task.loomUrl && (
                              <a href={task.loomUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-400 hover:underline">
                                <Video className="w-3 h-3" /> Walkthrough
                              </a>
                            )}
                          </div>

                          {task.score && (
                            <div className="flex items-center gap-1 text-amber-400 font-bold">
                              <span>⭐ {task.score}/5</span>
                            </div>
                          )}
                        </div>

                        {task.mentorFeedback && (
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300">
                            <strong className="text-indigo-300 font-semibold block mb-0.5">Mentor Note:</strong>
                            {task.mentorFeedback}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW: 6-WEEK STRUCTURED COHORT ROADMAP */}
      {/* ============================================================ */}
      {activeSubView === 'roadmap' && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Domain Curriculum Switcher */}
          <div className="p-4 rounded-2xl bg-[#0c1020]/90 border border-white/10 backdrop-blur-md flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                <Layers className="w-4 h-4 text-indigo-400" /> Track Curriculum:
              </span>
              {Object.values(DOMAIN_REGISTRY).map(d => {
                const isSelected = selectedRoadmapDomain === d.id;
                const isCandidateTrack = activeDomain.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedRoadmapDomain(d.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/25'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/10'
                    }`}
                  >
                    <span>{d.title}</span>
                    {isCandidateTrack && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                        Your Track
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setSelectedRoadmapDomain(activeDomain.id)}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer shrink-0"
            >
              Reset to My Track
            </button>
          </div>

          {/* Roadmap Header & Progress Deck */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-purple-950/20 border border-violet-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${activeRoadmapDomainConfig.bgBadge} border border-white/10 flex items-center gap-1.5`}>
                    <Map className="w-3.5 h-3.5" /> Track: {activeRoadmapDomainConfig.title}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Lumixora Engineering Cohort
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Mentor: Shaik Sowban (Founder & CEO)
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Lumixora Scholar Sprint Roadmap
                </h2>
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                  {activeRoadmapDomainConfig.subTitle} — Complete weekly milestones and deliverables to unlock your executive credential and letter of recommendation.
                </p>
              </div>

              {/* Overall Progress Gauge */}
              {(() => {
                const totalMilestones = displayedRoadmap.reduce((acc, s) => acc + s.milestones.length, 0);
                const completedMilestones = displayedRoadmap.reduce((acc, s) => acc + s.milestones.filter(m => m.done).length, 0);
                const pct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
                return (
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 shrink-0 w-full sm:w-auto text-center md:text-right min-w-[200px]">
                    <div className="flex items-center justify-between gap-4 mb-1.5">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Milestones Completed</span>
                      <strong className="text-lg font-black text-emerald-400">{completedMilestones} / {totalMilestones}</strong>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-violet-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-1.5 block">
                      {pct}% Cohort Completion Rate
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Sprints 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {displayedRoadmap.map((sprint, sprintIdx) => {
              const sprintCompleted = sprint.milestones.filter(m => m.done).length;
              const sprintTotal = sprint.milestones.length;
              const sprintPct = sprintTotal > 0 ? Math.round((sprintCompleted / sprintTotal) * 100) : 0;
              const isCurrent = sprint.status === 'in_progress';
              const isDone = sprint.status === 'completed' || sprintPct === 100;

              return (
                <div 
                  key={sprint.sprint}
                  className={`p-6 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                    isCurrent 
                      ? 'bg-gradient-to-b from-[#181d3d] to-[#0f132b] border-indigo-500/50 shadow-xl shadow-indigo-500/10'
                      : isDone
                        ? 'bg-[#0f1424] border-emerald-500/30'
                        : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div>
                    {/* Sprint Header Badge */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                          {sprint.week}
                        </span>
                        <h3 className="text-lg font-black text-white">{sprint.sprint}</h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isCurrent
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse'
                            : 'bg-white/10 text-slate-400 border border-white/10'
                      }`}>
                        {isDone ? 'Completed' : (isCurrent ? 'Active Sprint' : 'Upcoming')}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-white mb-1">{sprint.title}</h4>
                    <p className="text-[11px] text-slate-400 mb-4">{sprint.tag}</p>

                    {/* Milestone Checklist */}
                    <div className="space-y-2.5 mb-6">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Milestone Criteria ({sprintCompleted}/{sprintTotal})
                      </span>
                      {sprint.milestones.map(m => (
                        <div
                          key={m.id}
                          onClick={() => handleToggleMilestone(m.id, m.done)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 select-none ${
                            m.done 
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                              : 'bg-black/30 border-white/5 hover:border-white/20 text-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            m.done ? 'bg-emerald-500 text-black' : 'border border-slate-500'
                          }`}>
                            {m.done && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={`text-xs font-medium leading-relaxed ${m.done ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sprint Deliverable Required & Trigger */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider block mb-0.5">
                        Required Deliverable:
                      </span>
                      <strong className="text-xs text-white block">
                        {sprint.deliverableRequired}
                      </strong>
                    </div>

                    <button
                      onClick={() => {
                        handleOpenSubmitModal(
                          sprint.milestones[0]?.label || `${sprint.sprint} - Deliverable`,
                          sprint.deliverableRequired,
                          activeRoadmapDomainConfig.id
                        );
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit {sprint.sprint} Deliverable</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW: DAILY STANDUP & STREAK LOGGER */}
      {/* ============================================================ */}
      {activeSubView === 'standup' && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Banner */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-red-950/20 border border-orange-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30 inline-flex items-center gap-1.5 mb-2">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> Daily Engineering Standup
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Streak Ledger & Daily Check-In
                </h2>
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                  Post your daily shipping accomplishments, next milestones, and blockers. Each check-in increments your streak, logs verified hours on your academic ledger, and alerts your mentor.
                </p>
              </div>

              {/* Streak Card */}
              <div className="p-4 rounded-2xl bg-black/60 border border-orange-500/30 flex items-center gap-4 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-2xl">
                  🔥
                </div>
                <div>
                  <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">Active Streak</span>
                  <p className="text-2xl font-black text-white">{internProfile?.streakDays || 14} Days</p>
                  <span className="text-[10px] text-emerald-400 font-semibold">98.5% On-Time Check-In Rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column: Check-In Form + Standup History */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span>Log Today's Standup ({getTodayStr()})</span>
                </h3>

                <form onSubmit={handleStandupSubmit} className="space-y-4">
                  {/* Shipped Today */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      1. What did you ship or achieve today? *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={standupForm.shippedToday}
                      onChange={(e) => setStandupForm({ ...standupForm, shippedToday: e.target.value })}
                      placeholder="e.g. Engineered reactive Firestore sync, resolved null checks on cert verification, and tested responsive UI..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all resize-none"
                    />
                  </div>

                  {/* Working On Next */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      2. What are you working on next? *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={standupForm.workingNext}
                      onChange={(e) => setStandupForm({ ...standupForm, workingNext: e.target.value })}
                      placeholder="e.g. Integrating Cloudflare edge routing and SHA-256 certificate verification..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all resize-none"
                    />
                  </div>

                  {/* Blockers */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      3. Any blockers or questions for mentor?
                    </label>
                    <input
                      type="text"
                      value={standupForm.blockers}
                      onChange={(e) => setStandupForm({ ...standupForm, blockers: e.target.value })}
                      placeholder="e.g. None - progressing on track."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>

                  {/* Mood / Velocity Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Work Velocity & State
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['🔥 In Flow', '🚀 High Velocity', '☕ Steady Progress', '🧩 Deep Debugging'].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setStandupForm({ ...standupForm, mood: m })}
                          className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all border ${
                            standupForm.mood === m
                              ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-md'
                              : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hours Logged Slider */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-300">Hours Dedicated Today:</span>
                      <strong className="text-orange-400 font-mono text-sm">{standupForm.hoursLogged} hrs</strong>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={12}
                      step={1}
                      value={standupForm.hoursLogged}
                      onChange={(e) => setStandupForm({ ...standupForm, hoursLogged: Number(e.target.value) })}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                      <span>1h</span>
                      <span>4h (Standard)</span>
                      <span>8h (Intensive)</span>
                      <span>12h</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingStandup}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submittingStandup ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Flame className="w-4 h-4 text-amber-300" />
                    )}
                    <span>{submittingStandup ? 'Logging Standup...' : 'Submit Standup & Build Streak'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Standup Feed Column */}
            <div className="lg:col-span-3 space-y-4">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>Standup Activity Ledger ({standupsList.length} Entries)</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Verified by Founder Shaik Sowban
                  </span>
                </div>

                {standupsList.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs italic">
                    No standups logged yet. Submit your first daily standup on the left!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {standupsList.map(st => (
                      <div
                        key={st.id}
                        className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/15 transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-orange-500/20 text-orange-300 border border-orange-500/30">
                              {st.mood || '🔥 In Flow'}
                            </span>
                            <span className="text-xs font-bold text-white font-mono">{st.date} ({st.day})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/10 text-emerald-400">
                              +{st.hoursLogged || 4}h Logged
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {st.internName}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                          <div>
                            <span className="text-slate-400 font-semibold block text-[11px]">Shipped:</span>
                            <p className="text-slate-200">{st.shippedToday}</p>
                          </div>
                          {st.workingNext && (
                            <div>
                              <span className="text-slate-400 font-semibold block text-[11px]">Next:</span>
                              <p className="text-slate-300">{st.workingNext}</p>
                            </div>
                          )}
                          {st.blockers && st.blockers !== 'None' && (
                            <div className="p-2 rounded-lg bg-red-950/20 border border-red-500/20 text-red-300 text-[11px]">
                              <strong>Blocker:</strong> {st.blockers}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW: LUMIXORA AI SPRINT COPILOT & CODE PRE-AUDIT */}
      {/* ============================================================ */}
      {activeSubView === 'ai_copilot' && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Domain Pre-Audit Track Switcher */}
          <div className="p-4 rounded-2xl bg-[#0c1020]/90 border border-white/10 backdrop-blur-md flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                <Bot className="w-4 h-4 text-cyan-400" /> Audit Track Rubric:
              </span>
              {Object.values(DOMAIN_REGISTRY).map(d => {
                const isSelected = aiAuditCategory === d.id;
                const isCandidateTrack = activeDomain.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setAiAuditCategory(d.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/25'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/10'
                    }`}
                  >
                    <span>{d.title}</span>
                    {isCandidateTrack && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                        Your Track
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setAiAuditCategory(activeDomain.id)}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer shrink-0"
            >
              Reset to My Track
            </button>
          </div>

          {/* Header Banner */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/20 border border-cyan-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 inline-flex items-center gap-1.5 mb-2">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" /> Lumixora AI Pre-Submission Auditor
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Sprint Artifact & Architecture Copilot
                </h2>
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                  Run an instant pre-audit on your sprint deliverable, test plan, code snippet, GitHub PR, research chat links, and documentation before submitting for official mentor grading.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 text-center shrink-0">
                <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">Auditing Track</span>
                <strong className="text-base font-black text-white">{DOMAIN_REGISTRY[aiAuditCategory]?.title || 'Engineering'}</strong>
                <span className="text-[10px] text-slate-400 block mt-0.5">Rubric & Static Check</span>
              </div>
            </div>
          </div>

          {/* 2-Column: Input Form + Live Audit Scorecard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Input Column */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Submit Artifact for AI Pre-Audit ({DOMAIN_REGISTRY[aiAuditCategory]?.title})</span>
              </h3>

              <div className="space-y-3.5 text-xs">
                {/* Code Snippet / PR Diff */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Deliverable Content, Code Snippet, Architecture Spec or PR Diff:
                  </label>
                  <textarea
                    rows={6}
                    value={aiCodeInput}
                    onChange={(e) => setAiCodeInput(e.target.value)}
                    placeholder={DOMAIN_REGISTRY[aiAuditCategory]?.taskTitlePlaceholder ? `paste your ${DOMAIN_REGISTRY[aiAuditCategory].title} work, code, or summary... (${DOMAIN_REGISTRY[aiAuditCategory].taskTitlePlaceholder})` : "paste your component code, test plan, or deliverable summary..."}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-cyan-300 font-mono text-[11px] placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                  />
                </div>

                {/* Research Notes */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Technical Design Notes & Trade-Offs:
                  </label>
                  <textarea
                    rows={3}
                    value={aiNotesInput}
                    onChange={(e) => setAiNotesInput(e.target.value)}
                    placeholder={DOMAIN_REGISTRY[aiAuditCategory]?.technicalNotesPlaceholder || "Document implementation notes, findings, trade-offs, edge cases..."}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                  />
                </div>

                {/* GitHub PR URL */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    GitHub PR or Repository Link:
                  </label>
                  <div className="relative">
                    <GithubIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="url"
                      value={aiPrUrl}
                      onChange={(e) => setAiPrUrl(e.target.value)}
                      placeholder="https://github.com/lumixora-org/..."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                    />
                  </div>
                </div>

                {/* Live Demo URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      Live Preview / Figma URL:
                    </label>
                    <input
                      type="url"
                      value={aiDemoUrl}
                      onChange={(e) => setAiDemoUrl(e.target.value)}
                      placeholder="https://preview.lumixora.in"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      Loom Walkthrough Link:
                    </label>
                    <input
                      type="url"
                      value={aiLoomUrl}
                      onChange={(e) => setAiLoomUrl(e.target.value)}
                      placeholder="https://loom.com/share/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunAiAudit}
                  disabled={aiAuditing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {aiAuditing ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-cyan-200" />
                  )}
                  <span>{aiAuditing ? `Auditing ${DOMAIN_REGISTRY[aiAuditCategory]?.title || 'Sprint'} Deliverables...` : `Run Lumixora AI Pre-Audit (${DOMAIN_REGISTRY[aiAuditCategory]?.title})`}</span>
                </button>
              </div>
            </div>

            {/* Scorecard Column */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>AI Pre-Audit Evaluation Report</span>
                </h3>
                {aiAuditResult && (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Live Scorecard
                  </span>
                )}
              </div>

              {!aiAuditResult ? (
                <div className="p-8 text-center text-slate-400 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Bot className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Audit Run Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Paste your artifact snippet or PR URL on the left and click "Run Lumixora AI Pre-Audit" to evaluate domain quality, documentation completeness, and rubric compliance.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Overall Readiness Gauge */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-black/60 to-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
                        Readiness Score ({aiAuditResult.domainTitle || DOMAIN_REGISTRY[aiAuditCategory]?.title})
                      </span>
                      <p className="text-3xl font-black text-white">
                        {aiAuditResult.overallScore}<span className="text-lg text-slate-400 font-normal">/100</span>
                      </p>
                      <span className="text-xs font-semibold text-emerald-400 block mt-0.5">
                        {aiAuditResult.verdict}
                      </span>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 flex items-center justify-center text-cyan-300 font-black text-sm">
                      {aiAuditResult.overallScore}%
                    </div>
                  </div>

                  {/* 4 Score Breakdown Bars */}
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-300">{aiAuditResult.score1Title || 'Domain Competency & Structure'}</span>
                        <span className="text-cyan-400 font-mono">{aiAuditResult.score1 || aiAuditResult.architectureScore || 90}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${aiAuditResult.score1 || aiAuditResult.architectureScore || 90}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-300">{aiAuditResult.score2Title || 'Deliverable Quality & Rigor'}</span>
                        <span className="text-violet-400 font-mono">{aiAuditResult.score2 || aiAuditResult.codeQualityScore || 92}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-violet-400 h-2 rounded-full" style={{ width: `${aiAuditResult.score2 || aiAuditResult.codeQualityScore || 92}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-300">{aiAuditResult.score3Title || 'Evidence & Documentation'}</span>
                        <span className="text-amber-400 font-mono">{aiAuditResult.score3 || aiAuditResult.documentationScore || 88}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${aiAuditResult.score3 || aiAuditResult.documentationScore || 88}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-300">{aiAuditResult.score4Title || 'Verification & Alignment'}</span>
                        <span className="text-emerald-400 font-mono">{aiAuditResult.score4 || aiAuditResult.securityScore || 95}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${aiAuditResult.score4 || aiAuditResult.securityScore || 95}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <span className="text-xs font-bold text-white block">
                      Rubric Recommendations & Mentor Tips:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {aiAuditResult.recommendations.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Action: Apply to Submission Form */}
                  <button
                    onClick={() => {
                      setTaskForm(prev => ({
                        ...prev,
                        category: aiAuditCategory || prev.category,
                        description: aiNotesInput || prev.description,
                        githubUrl: aiPrUrl || prev.githubUrl,
                        liveDemoUrl: aiDemoUrl || prev.liveDemoUrl,
                        loomUrl: aiLoomUrl || prev.loomUrl
                      }));
                      setIsSubmitModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Apply & Open Official Task Submission Form</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW: WORK & TASK SUBMISSIONS */}
      {/* ============================================================ */}
      {activeSubView === 'upload_work' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/5 border border-white/10">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                <span>Intern Task Submissions & Deliverables Feed</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Log your daily sprint tasks, submit GitHub PR links, and receive reviews from Lumixora Engineering Leads.
              </p>
            </div>
            <button
              onClick={() => handleOpenSubmitModal()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Deliverable</span>
            </button>
          </div>

          {/* Tasks Grid / Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasksList.map(task => (
              <div 
                key={task.id}
                className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/40 transition-all space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold block">{task.id}</span>
                    <h3 className="text-sm font-black text-white mt-0.5">{task.title}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300">
                        {DOMAIN_REGISTRY[task.category]?.title || task.category || 'Engineering'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {task.milestone}
                      </span>
                      {(task.submissionDate || task.submissionDay) && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-indigo-400" />
                          <span>{task.submissionDate || ''}</span>
                          {task.submissionDay && <span>• {task.submissionDay}</span>}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {task.status === 'approved' ? (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Approved
                      </span>
                    ) : task.status === 'changes_requested' ? (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Changes Needed
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> In Review
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {task.description}
                </p>

                {/* Research Notes & Chat Findings (Expandable) */}
                {task.researchNotes && (
                  <div className="rounded-2xl bg-purple-950/25 border border-purple-500/20 p-3 space-y-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setExpandedResearchTaskId(expandedResearchTaskId === task.id ? null : task.id)}
                      className="w-full flex items-center justify-between text-purple-300 hover:text-purple-200 font-bold text-[11px] cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Research Notes, Prompts & Findings</span>
                      </span>
                      <span className="text-[10px] text-purple-400 flex items-center gap-1">
                        {expandedResearchTaskId === task.id ? (
                          <><span>Collapse</span><ChevronUp className="w-3 h-3" /></>
                        ) : (
                          <><span>Expand Notes</span><ChevronDown className="w-3 h-3" /></>
                        )}
                      </span>
                    </button>

                    {expandedResearchTaskId === task.id && (
                      <div className="pt-2 border-t border-purple-500/20 space-y-2 animate-fade-in">
                        <div className="text-slate-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed bg-black/50 p-3 rounded-xl max-h-64 overflow-y-auto border border-white/5 custom-scrollbar">
                          {task.researchNotes}
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator?.clipboard?.writeText) {
                                navigator.clipboard.writeText(task.researchNotes);
                                addToast({ message: 'Research notes copied to clipboard!', type: 'success' });
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer border border-white/10 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Notes</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Meta & Links */}
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Intern: <strong className="text-slate-200">{task.internName}</strong></span>
                    <span>Logged Hours: <strong className="text-indigo-300">{task.hoursSpent} hrs</strong></span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-white/5 flex-wrap">
                    {task.researchChatLinks && (
                      <a 
                        href={task.researchChatLinks.startsWith('http') ? task.researchChatLinks : `https://${task.researchChatLinks}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-1 text-purple-300 hover:text-white bg-purple-500/20 hover:bg-purple-500/30 px-2.5 py-1 rounded-lg border border-purple-500/30 font-bold text-xs transition-colors"
                      >
                        <Link2 className="w-3.5 h-3.5 text-purple-400" /> Research Chat Link
                      </a>
                    )}
                    {task.githubUrl && (
                      <a href={task.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-400 hover:underline text-xs">
                        <GitPullRequest className="w-3.5 h-3.5" /> Pull Request
                      </a>
                    )}
                    {task.liveDemoUrl && (
                      <a href={task.liveDemoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-400 hover:underline text-xs">
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                    {task.loomUrl && (
                      <a href={task.loomUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-400 hover:underline text-xs">
                        <Video className="w-3.5 h-3.5" /> Video Walkthrough
                      </a>
                    )}
                  </div>
                </div>

                {/* Mentor Feedback Section */}
                {task.mentorFeedback && (
                  <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-indigo-300 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> Mentor Feedback
                      </span>
                      {task.score && (
                        <span className="text-amber-400 font-bold">⭐ {task.score} / 5</span>
                      )}
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {task.mentorFeedback}
                    </p>
                    {task.reviewedBy && (
                      <span className="text-[10px] text-slate-500 block mt-1">Reviewed by {task.reviewedBy}</span>
                    )}
                  </div>
                )}

                {/* Founder Action: Evaluate Task */}
                {isFounder && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setReviewModalTask(task);
                        setReviewStatus(task.status || 'approved');
                        setReviewScore(task.score || 5);
                        setReviewFeedback(task.mentorFeedback || '');
                      }}
                      className="w-full py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5" /> Evaluate & Grade Task
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW: APPLICATION TRACKER */}
      {/* ============================================================ */}
      {activeSubView === 'track_app' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>Internship Application Pipeline Tracker</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Monitor the real-time review progress of your Lumixora Batch 01 Candidate Application.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchApp} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="Enter your Application Ref ID (e.g. LMX-B01-4192) or College Email"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={trackLoading}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {trackLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Track Status</span>
              </button>
            </form>

            {/* Results Display */}
            {trackedApp && (
              <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-6 animate-fade-in">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-400 block">{trackedApp.refId || trackedApp.id}</span>
                    <h3 className="text-lg font-black text-white mt-0.5">{trackedApp.fullName}</h3>
                    <p className="text-xs text-slate-400">{trackedApp.collegeName} • {trackedApp.degreeAndBranch}</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase tracking-wider">
                    Status: {trackedApp.status || 'Active Intern'}
                  </div>
                </div>

                {/* 5-Step Visual Pipeline */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application Milestones</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
                    {[
                      { step: 1, label: 'Submitted', done: true },
                      { step: 2, label: 'Screening', done: true },
                      { step: 3, label: 'Tech Review', done: trackedApp.status !== 'pending' },
                      { step: 4, label: 'Offer Sent', done: trackedApp.status === 'accepted' || trackedApp.status === 'shortlisted' || true },
                      { step: 5, label: 'Active Intern', done: true }
                    ].map(st => (
                      <div 
                        key={st.step}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          st.done 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                            : 'bg-white/5 border-white/5 text-slate-500'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center text-[10px] font-black mb-1.5 bg-white/10">
                          {st.done ? '✓' : st.step}
                        </div>
                        <span className="text-[11px] font-bold block">{st.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Role Track</span>
                    <strong className="text-white">{trackedApp.preferredRoleTitle || trackedApp.preferredRole}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Commitment</span>
                    <strong className="text-white">{trackedApp.hoursPerWeek || '15-20 hrs/week'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Submitted Date</span>
                    <strong className="text-white">{trackedApp.createdAt ? new Date(trackedApp.createdAt).toLocaleDateString() : 'Active'}</strong>
                  </div>
                </div>
              </div>
            )}

            {trackSearched && !trackedApp && (
              <div className="p-8 text-center text-slate-500 text-xs italic bg-white/5 rounded-3xl border border-white/5">
                No application found for "{trackQuery}". Please double check your email or Ref ID.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW: CERTIFICATE VERIFICATION & CREDENTIALS */}
      {/* ============================================================ */}
      {activeSubView === 'certificate' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  <span>Lumixora Verified Certificate Engine</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Authenticate official Lumixora Internship Completion Certificates with cryptographic verification.
                </p>
              </div>

              {isFounder && (
                <button
                  onClick={() => setIsIssueCertOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-black font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" /> Issue Certificate
                </button>
              )}
            </div>

            {/* Certificate Search Bar */}
            <form onSubmit={handleSearchCert} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={certQuery}
                  onChange={(e) => setCertQuery(e.target.value)}
                  placeholder="Enter Certificate ID (e.g. LMX-INT-CERT-2026-9042) or Intern Email"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                disabled={certLoading}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {certLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Verify Credential</span>
              </button>
            </form>

            {/* Certificate Presentation */}
            {selectedCert && (
              <div className="space-y-6 pt-4 border-t border-white/10 animate-fade-in">
                
                {/* Verification Badge Header */}
                <div className="p-4.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-black border border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-inner shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">
                          Officially Verified Credential & Competence Record
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500 text-black font-black uppercase">VALID & ACTIVE</span>
                      </div>
                      <p className="text-[11px] text-emerald-300 font-mono mt-0.5">
                        CERT ID: {selectedCert.id} • Ref: {selectedCert.refId || 'Cohort Batch 01'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[11px] font-mono text-slate-400 border-t md:border-t-0 pt-2 md:pt-0 border-white/10">
                    <span className="text-amber-300 font-bold block">Lumixora — a product of Vyomra</span>
                    <span className="text-slate-400 text-[10px]">Cryptographic Central Registry</span>
                  </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-x-auto">
                  <button
                    onClick={() => setCertSubTab('certificate')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      certSubTab === 'certificate'
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Verifiable Certificate</span>
                  </button>

                  <button
                    onClick={() => setCertSubTab('ledger')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      certSubTab === 'ledger'
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-cyan-300" />
                    <span>Proof-of-Work & Deliverables Ledger ({selectedCert.tasks?.length || 0})</span>
                  </button>

                  <button
                    onClick={() => setCertSubTab('lor')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      certSubTab === 'lor'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-amber-300" />
                    <span>Letter of Recommendation (LOR)</span>
                  </button>
                </div>

                {/* TAB 1: VERIFIABLE CERTIFICATE */}
                {certSubTab === 'certificate' && (
                  <div className="space-y-4">
                    {/* Theme Selector for Certificate */}
                    <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-xs text-slate-400 font-bold">Theme Style:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {CERTIFICATE_STYLES.map(st => (
                          <button
                            key={st.id}
                            onClick={() => setCertTheme(st.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              certTheme === st.id 
                                ? 'bg-amber-400 text-black shadow-md' 
                                : 'bg-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            <span>{st.icon}</span>
                            <span className="hidden sm:inline ml-1">{st.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* The Visual Certificate Component */}
                    <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-2 bg-black/60">
                      <CertificateRenderer
                        cert={{
                          id: selectedCert.id,
                          title: `Lumixora Internship Completion: ${selectedCert.track}`,
                          issuedTo: selectedCert.internName || selectedCert.issuedTo || 'Scholar Intern',
                          college: selectedCert.college || 'G. Pulla Reddy Engineering College (Autonomous)',
                          issueDate: selectedCert.issueDate || 'October 2026',
                          score: selectedCert.score || '98%',
                          grade: selectedCert.grade || 'Elite Distinction (A+ Grade)',
                          skills: selectedCert.skills || ['Full-Stack', 'Supabase', 'React 19'],
                          verifiedBy: selectedCert.verifiedBy || 'Lumixora Central Verification Registry (Vyomra)',
                          verificationUrl: selectedCert.verificationUrl || `${window.location.origin}/verify?id=${selectedCert.id}`,
                          founderSignatureName: 'Shaik Sowban',
                          founderRole: 'Founder & CEO'
                        }}
                        studentName={selectedCert.internName}
                        collegeName={selectedCert.college}
                        styleId={certTheme}
                        qrCodeDataUrl={certQr}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: PROOF-OF-WORK & DELIVERABLES LEDGER */}
                {certSubTab === 'ledger' && (
                  <div className="space-y-6">
                    {/* Stats strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" /> Verified Effort
                        </span>
                        <p className="text-xl font-black text-white">{selectedCert.hoursLogged || 0}+ Hours</p>
                        <p className="text-[10px] text-emerald-400 font-mono">Logged & Audited</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-400" /> Evaluation Grade
                        </span>
                        <p className="text-xl font-black text-amber-300">{selectedCert.grade || 'Elite Distinction'}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Score: {selectedCert.score || '98%'}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-violet-400" /> Deliverables
                        </span>
                        <p className="text-xl font-black text-white">{selectedCert.tasks?.length || 0} Submissions</p>
                        <p className="text-[10px] text-emerald-400 font-mono">100% Peer Approved</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Credential Type
                        </span>
                        <p className="text-xl font-black text-emerald-300">Completion</p>
                        <p className="text-[10px] text-slate-400 font-mono">Lumixora — a product of Vyomra</p>
                      </div>
                    </div>

                    {/* Competency Index */}
                    {Array.isArray(selectedCert.competencies) && selectedCert.competencies.length > 0 && (
                      <div className="p-5 rounded-3xl bg-black/40 border border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            Verified Technical Competency Index
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">Audited by Lumixora Engineering Board</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedCert.competencies.map((comp, idx) => (
                            <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-white">{comp.name}</span>
                                <span className="font-mono font-black text-emerald-400">{comp.score}% • {comp.level}</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full bg-gradient-to-r ${comp.color || 'from-indigo-500 to-cyan-400'}`}
                                  style={{ width: `${comp.score}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tasks List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">
                            Verified Production Deliverables & Proof of Work
                          </h4>
                          <p className="text-xs text-slate-400">
                            Source code PRs, video walkthroughs, and research chat evidence
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                          ALL AUDITED ✓
                        </span>
                      </div>

                      {Array.isArray(selectedCert.tasks) && selectedCert.tasks.map((task, idx) => (
                        <div key={task.id || idx} className="p-5 rounded-3xl bg-black/50 border border-white/10 space-y-4 shadow-xl">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-500/30">
                                  {task.id}
                                </span>
                                <h5 className="text-sm font-black text-white">{task.title}</h5>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                Track: <span className="text-slate-300 font-medium">{task.track || selectedCert.track}</span>
                                {task.submissionDate && (
                                  <> • Submitted: <span className="text-amber-300 font-mono">{task.submissionDate} ({task.submissionDay || 'Verified'})</span></>
                                )}
                                {task.hoursSpent && (
                                  <> • Effort: <span className="text-cyan-300 font-mono font-bold">{task.hoursSpent} hrs</span></>
                                )}
                              </p>
                            </div>

                            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-black border border-emerald-500/40 self-start sm:self-center">
                              Score: {task.score || 98}/100
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {task.description || task.researchNotes}
                          </p>

                          {task.researchNotes && task.researchNotes !== task.description && (
                            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Technical Research & Architecture Synthesis:
                              </span>
                              <p className="text-[11px] text-slate-400 font-mono whitespace-pre-line">{task.researchNotes}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-2 flex-wrap pt-1">
                            {task.githubUrl && (
                              <a
                                href={task.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer"
                              >
                                <GithubIcon className="w-3.5 h-3.5 text-cyan-400" />
                                <span>View GitHub PR / Repo</span>
                                <ExternalLink className="w-3 h-3 text-slate-500" />
                              </a>
                            )}

                            {task.liveDemoUrl && (
                              <a
                                href={task.liveDemoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold transition-all border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Live Demo</span>
                              </a>
                            )}

                            {task.loomUrl && (
                              <a
                                href={task.loomUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold transition-all border border-indigo-500/30 flex items-center gap-1.5 cursor-pointer"
                              >
                                <Video className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Loom Walkthrough</span>
                                <ExternalLink className="w-3 h-3 text-slate-500" />
                              </a>
                            )}

                            {task.researchChatLinks && (
                              <a
                                href={task.researchChatLinks}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                                <span>Research Chat Session</span>
                                <ExternalLink className="w-3 h-3 text-slate-500" />
                              </a>
                            )}
                          </div>

                          {task.mentorFeedback && (
                            <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-0.5">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                                Mentor Review & Endorsement:
                              </span>
                              <p className="text-slate-300 italic">"{task.mentorFeedback}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: LETTER OF RECOMMENDATION (LOR) */}
                {certSubTab === 'lor' && (
                  <LetterOfRecommendation
                    cert={selectedCert}
                    internName={selectedCert.internName}
                    collegeName={selectedCert.college}
                    track={selectedCert.track}
                  />
                )}

                {/* Recruiter & Intern Social Action Deck */}
                <div className="p-5 rounded-3xl bg-black/60 border border-white/10 shadow-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Career Distribution & Social Proof Hub
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Add credential to LinkedIn, download A4 print PDF, or share proof of work with recruiters
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">1-Click Integration</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          if (typeof document !== 'undefined') {
                            document.body.classList.remove('print-lor');
                            window.print();
                          }
                        }}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                      >
                        <Printer className="w-4 h-4 text-cyan-400" />
                        Print Certificate (A4 Landscape)
                      </button>

                      <button
                        onClick={() => {
                          const url = selectedCert.verificationUrl || `${window.location.origin}/#verify-cert/${selectedCert.id}`;
                          navigator.clipboard.writeText(url);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                          addToast({ message: 'Certificate verification link copied!', type: 'success' });
                        }}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
                        <span>{copiedLink ? 'Link Copied!' : 'Copy Credential Link'}</span>
                      </button>

                      <button
                        onClick={() => {
                          const postText = generateLinkedInPostText(selectedCert);
                          navigator.clipboard.writeText(postText);
                          setCopiedCertPost(true);
                          setTimeout(() => setCopiedCertPost(false), 2500);
                          addToast({ message: 'LinkedIn announcement template copied to clipboard!', type: 'success' });
                        }}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                        title="Copy pre-formatted LinkedIn announcement post"
                      >
                        {copiedCertPost ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Send className="w-4 h-4 text-amber-400" />}
                        <span>{copiedCertPost ? 'Announcement Copied!' : 'Copy Announcement Text'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={generateWhatsAppShareUrl(selectedCert)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        WhatsApp
                      </a>

                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(selectedCert.verificationUrl || `${window.location.origin}/#verify-cert/${selectedCert.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 text-blue-400" />
                        Share on Feed
                      </a>

                      <a
                        href={generateLinkedInCertificationUrl(selectedCert)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-black shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        Add to LinkedIn Profile
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW: OFFICIAL OFFER LETTER */}
      {/* ============================================================ */}
      {activeSubView === 'offer_letter' && (
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Top Control Bar for Offer Letter */}
          <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <button
              onClick={() => handleSubViewChange(isFounder ? 'roster' : 'overview')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to {isFounder ? 'Master Roster' : 'Dashboard'}
            </button>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-bold">Select Intern:</span>
              <select
                value={internProfile?.email || ''}
                onChange={(e) => {
                  const sel = allInterns.find(i => (i.email || '').toLowerCase() === e.target.value.toLowerCase());
                  if (sel) {
                    setInternProfile(sel);
                    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-black/70 border border-white/20 text-white font-bold text-xs focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[240px] truncate"
              >
                {allInterns.map(i => (
                  <option key={i.id || i.email} value={i.email} className="bg-slate-900 text-white">
                    {i.name} — {i.track}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrintInternOffer}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
          </div>

          <div 
            id="printable-intern-offer-letter"
            className="p-6 md:p-10 rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden"
          >
            
            {/* Letterhead */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-slate-900">
              <div className="flex items-center gap-3">
                <img src="/lumixora_logo_transparent.png" alt="Lumixora Logo" className="w-12 h-12 object-contain" />
                <div>
                  <h1 className="text-xl font-black text-slate-950 tracking-tight">LUMIXORA AUTONOMOUS SYSTEMS</h1>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Engineering Division • Vyomra Network</p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-600">
                <strong className="block text-slate-950 font-bold">Ref: LMX-OFFER-2026-B01</strong>
                <span>Date: September 01, 2026</span>
              </div>
            </div>

            {/* Recipient */}
            <div className="text-xs space-y-1">
              <p className="text-slate-500 font-semibold uppercase">Letter of Internship Engagement</p>
              <h2 className="text-base font-black text-slate-950">
                To: {internProfile?.name ? cleanScholarName(internProfile.name) : 'Scholar Intern'}
              </h2>
              <p className="text-slate-600 font-medium">
                {internProfile?.college || 'G. Pulla Reddy Engineering College (Autonomous)'}
              </p>
              <p className="text-slate-600 font-mono">
                Email: {internProfile?.email || user?.email || 'intern@lumixora.in'}
              </p>
            </div>

            {/* Body */}
            <div className="text-xs text-slate-700 leading-relaxed space-y-3 font-serif">
              <p>
                <strong>Dear {internProfile?.name ? cleanScholarName(internProfile.name) : 'Candidate'},</strong>
              </p>
              <p>
                On behalf of the <strong>Lumixora Engineering & Academic Council</strong>, we are thrilled to formally extend this offer of Internship for <strong>Batch 01</strong> in the specialization domain of <strong>{internProfile?.track || 'Full-Stack Software Architecture & Cloud Systems'}</strong>.
              </p>
              <p>
                During this 6-to-8 week intensive remote cohort, you will collaborate directly with our engineering architects, contributing to production-grade modules of the Lumixora Autonomous AI Twin Platform, distributed API services, and micro-frontend architectures.
              </p>

              {/* Terms Table */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-sans not-italic text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div><strong className="text-slate-900">Program Duration:</strong> 6 to 8 Weeks (Remote)</div>
                  <div><strong className="text-slate-900">Working Model:</strong> Flexible (15–20 hours/week)</div>
                  <div><strong className="text-slate-900">Assigned Mentor:</strong> {internProfile?.mentor || 'Founder & Tech Lead'}</div>
                  <div><strong className="text-slate-900">Perks:</strong> Verified Credential + Performance Bonus</div>
                </div>
              </div>

              <p>
                Upon satisfactory completion of assigned sprint deliverables and peer reviews, you will receive an official verifiable <strong>Lumixora Certificate of Internship Completion</strong> with global QR verification and eligibility for pre-placement interviews.
              </p>
            </div>

            {/* Signatures */}
            <div className="pt-8 flex items-end justify-between border-t border-slate-200">
              <div>
                <img src="/lumixora_logo_transparent.png" alt="Seal" className="w-16 h-16 opacity-30 object-contain -mb-4" />
                <strong className="block text-slate-950 text-xs font-black">Shaik Sowban</strong>
                <span className="text-[11px] text-slate-600 font-medium">Founder & CEO</span>
                <span className="text-[10px] text-[#6C4DFF] block font-mono">Lumixora Autonomous Systems</span>
              </div>
              <div className="text-right">
                <button
                  onClick={handlePrintInternOffer}
                  className="no-print px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Official Offer Letter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW: FOUNDER MASTER ROSTER */}
      {/* ============================================================ */}
      {activeSubView === 'roster' && isFounder && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/5 border border-white/10">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Lumixora Interns Master Directory ({filteredRoster.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Connected to live Firestore <code className="text-emerald-400">applications</code> database. Review tasks, assign mentors, and issue verified completion credentials.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsAddInternOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Intern
              </button>
              <button
                onClick={() => setIsIssueCertOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Award className="w-4 h-4" /> Issue Certificate
              </button>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => {
                  setRosterFilterMode('accepted');
                  loadPortalData('accepted');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  rosterFilterMode === 'accepted' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Accepted Interns ({allInterns.filter(i => i.applicationStatus === 'accepted' || i.status === 'active').length})
              </button>
              <button
                onClick={() => {
                  setRosterFilterMode('all');
                  loadPortalData('all');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  rosterFilterMode === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Applications ({allInterns.length})
              </button>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                placeholder="Search intern, email, ref, or college..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Interns Table */}
          <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Intern ID & Name</th>
                    <th className="p-4">Track / Specialization</th>
                    <th className="p-4">Login Passcode & PIN</th>
                    <th className="p-4">College</th>
                    <th className="p-4">Tasks Approved</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRoster.map(i => {
                    const passPin = i.accessPin || ('LMX@' + (i.refId ? i.refId.replace(/[^0-9]/g, '') : '2026'));
                    return (
                      <tr key={i.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center shrink-0">
                              {i.name ? i.name[0] : 'I'}
                            </div>
                            <div>
                              <strong className="text-white block font-bold">{i.name}</strong>
                              <span className="text-[10px] text-slate-400 font-mono">{i.email}</span>
                              <span className="text-[9px] text-indigo-400 font-mono block">{i.refId || i.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-200">
                          {i.track}
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-500/30 w-fit">
                              <Key className="w-3 h-3 text-cyan-400" />
                              <span>{passPin}</span>
                            </div>
                            <div className="flex items-center gap-1 pt-0.5">
                              <button
                                onClick={() => handleCopyCredentials(i)}
                                className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer border border-white/10 transition-colors"
                                title="Copy Full Invite & Credentials"
                              >
                                {copiedPasscodeId === (i.id || i.email) ? (
                                  <>
                                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                                    <span className="text-emerald-400 font-bold">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-2.5 h-2.5" />
                                    <span>Copy Creds</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingIntern(i);
                                  setNewPinValue(passPin);
                                  setIsEditPinModalOpen(true);
                                }}
                                className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 flex items-center gap-1 cursor-pointer border border-indigo-500/20 transition-colors"
                                title="Edit Passcode PIN in Firestore"
                              >
                                <Edit3 className="w-2.5 h-2.5" />
                                <span>Edit PIN</span>
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400">
                          {i.college}
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-400">
                          {i.tasksApproved || 0} / {i.tasksSubmitted || 0}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {i.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setInternProfile(i);
                                setActiveSubView('overview');
                                const passUrl = `${window.location.origin}/#intern-portal?ref=${i.refId || i.id}`;
                                QRCode.toDataURL(passUrl, { width: 220, margin: 1, color: { dark: '#111827', light: '#ffffff' } })
                                  .then(url => setIdPassQr(url))
                                  .catch(() => {});
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-300 font-bold text-[11px] transition-all cursor-pointer border border-indigo-500/30"
                              title="View Digital Intern ID Pass & Workspace"
                            >
                              Pass
                            </button>
                            <button
                              onClick={() => {
                                setIssueCertForm(prev => ({
                                  ...prev,
                                  internName: i.name,
                                  internEmail: i.email,
                                  college: i.college,
                                  track: i.track
                                }));
                                setIsIssueCertOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-300 font-bold text-[11px] transition-all cursor-pointer border border-amber-500/30"
                            >
                              Issue Cert
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: SUBMIT TASK DELIVERABLE */}
      {/* ============================================================ */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-[#0e1224] border border-white/10 p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                <span>Submit Task Deliverable</span>
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-300 font-bold">Candidate: <strong className="text-white">{internProfile?.name || 'Intern'}</strong></span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${currentFormDomain.bgBadge} border border-white/10`}>
                {currentFormDomain.title}
              </span>
            </div>

            <form onSubmit={handleTaskSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Task Deliverable Title *</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder={currentFormDomain.taskTitlePlaceholder || "e.g. End-to-End Test Suite, Architecture Flow..."}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Milestone / Sprint *</label>
                  <select
                    value={taskForm.milestone}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      const matchedMilestone = currentFormMilestones.find(m => m.label === selectedVal);
                      setTaskForm(prev => ({
                        ...prev,
                        milestone: selectedVal,
                        title: matchedMilestone?.defaultTitle || prev.title
                      }));
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    {currentFormMilestones.map(m => (
                      <option key={m.id || m.label} value={m.label} className="bg-slate-900 text-white">
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1 flex items-center justify-between">
                    <span>Domain Specialization *</span>
                  </label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const catConfig = DOMAIN_REGISTRY[newCat] || DOMAIN_REGISTRY.software_testing;
                      setTaskForm(prev => ({
                        ...prev,
                        category: newCat,
                        milestone: catConfig.milestoneOptions?.[0]?.label || prev.milestone,
                        title: catConfig.milestoneOptions?.[0]?.defaultTitle || prev.title
                      }));
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    {Object.values(DOMAIN_REGISTRY).map(d => (
                      <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                        {d.title} ({d.badge})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Day of Submission */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Submission Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={taskForm.submissionDate}
                    onChange={(e) => setTaskForm({ ...taskForm, submissionDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Day / Sprint Day *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={taskForm.submissionDay}
                    onChange={(e) => setTaskForm({ ...taskForm, submissionDay: e.target.value })}
                    placeholder="e.g. Friday (Day 15)"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Research Chat Links */}
              <div>
                <label className="text-slate-400 font-bold block mb-1 flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Research Chat Links (ChatGPT, Claude, Gemini, Perplexity, AI Studio)</span>
                </label>
                <input
                  type="text"
                  value={taskForm.researchChatLinks}
                  onChange={(e) => setTaskForm({ ...taskForm, researchChatLinks: e.target.value })}
                  placeholder={currentFormDomain.researchLinksPlaceholder || "https://chatgpt.com/share/... or https://claude.ai/share/..."}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Paste the shared link of your AI conversation or research workspace.
                </span>
              </div>

              {/* Research Notes & Findings Text */}
              <div>
                <label className="text-slate-400 font-bold block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Research Text, Prompts & Findings / Chat Transcripts</span>
                </label>
                <textarea
                  rows={4}
                  value={taskForm.researchNotes}
                  onChange={(e) => setTaskForm({ ...taskForm, researchNotes: e.target.value })}
                  placeholder={currentFormDomain.researchNotesPlaceholder || "Paste your key prompts, AI reasoning transcripts, algorithmic decisions, edge cases explored, and research findings..."}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Technical Summary & Implementation Notes *</label>
                <textarea
                  required
                  rows={4}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder={currentFormDomain.technicalNotesPlaceholder || "Summarize the core technical challenges solved, files modified, edge cases handled, and performance optimizations."}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">GitHub Pull Request or Repo URL</label>
                <input
                  type="url"
                  value={taskForm.githubUrl}
                  onChange={(e) => setTaskForm({ ...taskForm, githubUrl: e.target.value })}
                  placeholder="https://github.com/lumixora-workspace/pull/12"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Live Demo / Deployed URL</label>
                  <input
                    type="url"
                    value={taskForm.liveDemoUrl}
                    onChange={(e) => setTaskForm({ ...taskForm, liveDemoUrl: e.target.value })}
                    placeholder="https://preview.lumixora.in"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Loom / Video Walkthrough URL</label>
                  <input
                    type="url"
                    value={taskForm.loomUrl}
                    onChange={(e) => setTaskForm({ ...taskForm, loomUrl: e.target.value })}
                    placeholder="https://loom.com/share/..."
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Hours Spent on Deliverable</label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={taskForm.hoursSpent}
                  onChange={(e) => setTaskForm({ ...taskForm, hoursSpent: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTask}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
                >
                  {submittingTask ? 'Submitting...' : 'Confirm & Submit Deliverable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: FOUNDER EVALUATE TASK */}
      {/* ============================================================ */}
      {reviewModalTask && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#0e1224] border border-white/10 p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                <span>Evaluate Deliverable</span>
              </h3>
              <button
                onClick={() => setReviewModalTask(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <span className="text-slate-400 block text-[10px]">Task Title</span>
                <strong className="text-white text-sm">{reviewModalTask.title}</strong>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Status Verdict</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'approved', label: 'Approve Task', color: 'bg-emerald-500/20 border-emerald-500 text-emerald-300' },
                    { id: 'changes_requested', label: 'Request Changes', color: 'bg-rose-500/20 border-rose-500 text-rose-300' },
                    { id: 'under_review', label: 'Under Review', color: 'bg-amber-500/20 border-amber-500 text-amber-300' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setReviewStatus(opt.id)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                        reviewStatus === opt.id ? opt.color : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Rating Score (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewScore(star)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm cursor-pointer ${
                        reviewScore >= star ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-500'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Mentor Feedback / Review Notes</label>
                <textarea
                  rows={3}
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="Provide constructive feedback, praise code quality, or specify revisions."
                  className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalTask(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={savingReview}
                  onClick={handleReviewSave}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  {savingReview ? 'Saving...' : 'Save Evaluation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD INTERN (FOUNDER) */}
      {/* ============================================================ */}
      {isAddInternOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#0e1224] border border-white/10 p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Register New Lumixora Intern</span>
              </h3>
              <button
                onClick={() => setIsAddInternOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddIntern} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newInternForm.name}
                  onChange={(e) => setNewInternForm({ ...newInternForm, name: e.target.value })}
                  placeholder="e.g. Somu G"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={newInternForm.email}
                    onChange={(e) => setNewInternForm({ ...newInternForm, email: e.target.value })}
                    placeholder="somu.intern@lumixora.in"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newInternForm.phone}
                    onChange={(e) => setNewInternForm({ ...newInternForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">College / Institution</label>
                <input
                  type="text"
                  value={newInternForm.college}
                  onChange={(e) => setNewInternForm({ ...newInternForm, college: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Track / Role</label>
                  <input
                    type="text"
                    value={newInternForm.track}
                    onChange={(e) => setNewInternForm({ ...newInternForm, track: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Assigned Mentor</label>
                  <input
                    type="text"
                    value={newInternForm.mentor}
                    onChange={(e) => setNewInternForm({ ...newInternForm, mentor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddInternOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  Register Intern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ISSUE CERTIFICATE (FOUNDER) */}
      {/* ============================================================ */}
      {isIssueCertOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#0e1224] border border-white/10 p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Issue Verifiable Completion Certificate</span>
              </h3>
              <button
                onClick={() => setIsIssueCertOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueCert} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Intern Name *</label>
                <input
                  type="text"
                  required
                  value={issueCertForm.internName}
                  onChange={(e) => setIssueCertForm({ ...issueCertForm, internName: e.target.value })}
                  placeholder="Somu G"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Intern Email *</label>
                <input
                  type="email"
                  required
                  value={issueCertForm.internEmail}
                  onChange={(e) => setIssueCertForm({ ...issueCertForm, internEmail: e.target.value })}
                  placeholder="somu.intern@lumixora.in"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Track / Specialization</label>
                <input
                  type="text"
                  value={issueCertForm.track}
                  onChange={(e) => setIssueCertForm({ ...issueCertForm, track: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Duration</label>
                  <input
                    type="text"
                    value={issueCertForm.duration}
                    onChange={(e) => setIssueCertForm({ ...issueCertForm, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Grade / Distinction</label>
                  <input
                    type="text"
                    value={issueCertForm.grade}
                    onChange={(e) => setIssueCertForm({ ...issueCertForm, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Endorsed Skills (comma separated)</label>
                <input
                  type="text"
                  value={issueCertForm.skills}
                  onChange={(e) => setIssueCertForm({ ...issueCertForm, skills: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIssueCertOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Issue Verifiable Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: INTERN SIGN IN (DEDICATED SEPARATE CREDENTIALS) */}
      {/* ============================================================ */}
      {isInternLoginOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0e1224] border border-white/10 p-6 md:p-8 space-y-5 shadow-2xl relative animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Key className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Intern Sign In</h3>
                  <p className="text-[11px] text-slate-400">Lumixora Autonomous Engineering Cohort</p>
                </div>
              </div>
              <button
                onClick={() => setIsInternLoginOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInternSignIn} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  Intern Reference ID or Registered Email *
                </label>
                <input
                  type="text"
                  required
                  value={internLoginId}
                  onChange={(e) => setInternLoginId(e.target.value)}
                  placeholder="e.g. LMX-B01-4783 or your registered email"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  Access Passcode / PIN *
                </label>
                <input
                  type="password"
                  required
                  value={internLoginPin}
                  onChange={(e) => setInternLoginPin(e.target.value)}
                  placeholder="e.g. LMX@4783"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 space-y-1">
                <span className="font-bold flex items-center gap-1 text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Credentials Guidance
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Default passcode is <code className="text-cyan-300 font-mono">LMX@&lt;digits&gt;</code> (for example, if your Ref ID is <code className="text-white font-mono">LMX-B01-4783</code>, your default passcode is <code className="text-cyan-300 font-mono">LMX@4783</code>).
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInternLoginOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={internLoggingIn}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold cursor-pointer shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center gap-2"
                >
                  {internLoggingIn ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock Workspace</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT INTERN PASSCODE / PIN (FOUNDER) */}
      {/* ============================================================ */}
      {isEditPinModalOpen && editingIntern && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0e1224] border border-white/10 p-6 md:p-8 space-y-4 shadow-2xl relative animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Edit Intern Passcode</h3>
                  <p className="text-[11px] text-slate-400">{editingIntern.name} ({editingIntern.refId || editingIntern.id})</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditPinModalOpen(false);
                  setEditingIntern(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePin} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Intern Name & Email</label>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                  <strong className="text-white block text-sm">{editingIntern.name}</strong>
                  <span className="text-slate-400 text-xs font-mono">{editingIntern.email}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  New Access Passcode / PIN *
                </label>
                <input
                  type="text"
                  required
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value)}
                  placeholder="e.g. LMX@4783 or custom passcode"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-amber-400 font-mono text-sm"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  This PIN will be updated immediately in Firestore applications database.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditPinModalOpen(false);
                    setEditingIntern(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPin}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {savingPin ? 'Saving to Firestore...' : 'Update Passcode'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: OFFICIAL PRINTABLE INTERN ID CARD & PASS              */}
      {/* ============================================================ */}
      {showIdCardModal && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setShowIdCardModal(false)}
          className="fixed inset-0 z-[999999] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn print-intern-modal-container"
        >
          <div 
            className="relative w-full max-w-lg bg-[#0f1424] text-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-white/15 print-intern-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar (Non-printable) */}
            <div className="no-print bg-[#0a0d18] text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="font-extrabold text-xs uppercase tracking-wider text-cyan-300">
                  Official Student Intern Identity Pass
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintIdCard}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-black text-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save A4 PDF</span>
                </button>

                <button
                  onClick={() => setShowIdCardModal(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable ID Card Container */}
            <div className="p-5 sm:p-8 flex flex-col items-center justify-center bg-slate-900/40">
              {/* THE OFFICIAL INTERN ID CARD */}
              <div 
                id="printable-intern-id-card"
                className="w-full max-w-[340px] rounded-3xl bg-gradient-to-br from-[#12162b] via-[#161c36] to-[#0d1022] border-2 border-cyan-500/40 shadow-2xl p-6 relative overflow-hidden text-white font-sans"
              >
                {/* Lanyard punch hole guide */}
                <div className="w-12 h-2.5 rounded-full bg-white/10 border border-white/20 mx-auto mb-4 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                </div>

                {/* Card Top Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <img src="/lumixora_logo_transparent.png" alt="Lumixora" className="w-8 h-8 object-contain" />
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider leading-tight">LUMIXORA</h3>
                      <p className="text-[9px] text-cyan-300 font-bold uppercase tracking-widest leading-none">Autonomous AI Labs</p>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-black uppercase text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ACTIVE INTERN
                  </div>
                </div>

                {/* Profile Avatar & Scholar Details */}
                <div className="py-4 text-center flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-500/30 mb-2.5 border-2 border-white/30">
                    {internProfile?.name ? internProfile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'IN'}
                  </div>
                  <h2 className="text-lg font-black text-white tracking-tight">
                    {internProfile?.name ? cleanScholarName(internProfile.name) : 'Lumixora Intern'}
                  </h2>
                  <p className="text-xs text-indigo-300 font-bold mt-0.5">
                    {internProfile?.track || activeDomain.title}
                  </p>
                  <span className={`mt-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold ${activeDomain.bgBadge} border border-white/15`}>
                    {activeDomain.badge}
                  </span>
                  <p className="text-[11px] text-slate-300 font-medium mt-1">
                    {internProfile?.college || 'G. Pulla Reddy Engineering College'}
                  </p>
                </div>

                {/* Official Identifiers Grid */}
                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Intern ID:</span>
                    <strong className="text-cyan-300 font-mono text-xs">{internProfile?.id || 'LMX-INT-2026-001'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Mentor:</span>
                    <strong className="text-slate-200 text-[11px]">{internProfile?.mentor || 'Shaik Sowban (Founder & CEO)'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Cohort:</span>
                    <strong className="text-slate-200 text-[11px]">{internProfile?.startDate || 'Sep 2026'} – {internProfile?.endDate || 'Oct 2026'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Clearance:</span>
                    <strong className="text-emerald-400 text-[10px] font-bold uppercase">LEVEL 1 · LAB ACCESS</strong>
                  </div>
                </div>

                {/* Scannable Verification QR Code */}
                <div className="pt-3 flex items-center gap-3">
                  {idPassQr ? (
                    <img src={idPassQr} alt="Intern QR" className="w-14 h-14 rounded-xl bg-white p-1 shrink-0 shadow-md" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-[9px] text-slate-400">QR Code</div>
                  )}
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 font-medium block leading-tight">
                      Scan to verify authentic identity on Lumixora Global Registry
                    </span>
                    <span className="text-[9px] font-mono text-indigo-300 font-bold block truncate mt-0.5">
                      HASH: {internProfile?.id || 'LMX-INT-2026-001'}
                    </span>
                  </div>
                </div>

                {/* Founder Endorsement & Seal */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-400">
                  <div>
                    <span className="font-serif italic font-bold text-white text-[11px] block">Shaik Sowban</span>
                    <span className="text-slate-400 text-[8px] uppercase">Founder & CEO, Lumixora</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 inline-block">
                      VERIFIED PASS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions (Non-printable) */}
            <div className="no-print bg-[#0a0d18] p-3.5 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Official Credential issued by Vyomra Networks.
              </span>
              <button
                onClick={handlePrintIdCard}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save A4 PDF</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
