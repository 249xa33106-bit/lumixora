// ============================================================================
// LUMIXORA PROJECTVERSE™ — Flagship AI Project Discovery & Resume-Impact Engine
// "Build the right projects. Prove your skills. Stand out."
// A Product of VYOMRA Networks · Global Innovation Division
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Rocket, 
  Sparkles, 
  Target, 
  Award, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Search, 
  Filter, 
  BookOpen, 
  Code, 
  Terminal, 
  Layers, 
  Cpu, 
  GitBranch, 
  Check, 
  Copy, 
  Share2, 
  Printer, 
  ChevronRight, 
  AlertCircle, 
  Flame, 
  FileText, 
  Upload, 
  BarChart3, 
  ShieldCheck, 
  Globe, 
  HelpCircle,
  FolderGit2,
  ListTodo,
  TrendingUp,
  Sliders,
  X,
  Play,
  Zap,
  ArrowUpRight,
  Eye,
  Info
} from 'lucide-react';
import QRCode from 'qrcode';
import { 
  PROJECTVERSE_META, 
  TARGET_CAREER_ROLES, 
  SCORING_RUBRIC, 
  PROJECT_CATALOGUE, 
  calculateResumeImpactScore, 
  getPersonalizedRecommendations, 
  analyzeSkillGap 
} from '../data/projectVerseData';
import { useToast } from '../context/ToastContext';

export default function ProjectVerse({ user = null, setActiveTab = () => {} }) {
  const { addToast } = useToast ? useToast() : { addToast: (m) => console.log(m) };

  // ──────────────────────────────────────────────────────────────────────────
  // 1. PERSISTENT STATE MANAGEMENT (Local Storage + Reactive Sync)
  // ──────────────────────────────────────────────────────────────────────────
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'recommendations' | 'explorer' | 'details' | 'studio' | 'impact' | 'portfolio'
  
  // Student Profile Onboarding State
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_projectverse_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: user?.name || 'Student Scholar',
      email: user?.email || '',
      college: user?.college || 'G. Pulla Reddy Engineering College',
      branch: user?.department || 'Computer Science & Engineering (CSE)',
      year: user?.year || '2nd Year',
      experienceLevel: 'Intermediate',
      targetRole: 'ai_engineer',
      availableHours: 12,
      budget: '₹0 (Free Tier)',
      skills: ['Python', 'SQL', 'React', 'Git', 'FastAPI'],
      interests: 'Generative AI, Large Language Models, Distributed Systems',
      githubProfile: 'https://github.com/scholar',
      resumeText: ''
    };
  });

  // Active Selected Project for Studio & Details
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    try {
      return localStorage.getItem('lumixora_projectverse_active_proj') || 'pv-ai-eval-hallucination';
    } catch (e) {
      return 'pv-ai-eval-hallucination';
    }
  });

  // Milestone Task Checklists State: { [projectId]: { [taskId]: boolean } }
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_projectverse_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      'pv-ai-eval-hallucination': {
        'Define evaluation metrics: Faithfulness, Answer Relevance, Context Recall': true,
        'Assemble test dataset of 30 passage-answer pairs with known synthetic hallucinations': true
      }
    };
  });

  // Proof-of-Work Submitted Evidence: { [projectId]: { githubUrl, liveDemoUrl, testSuiteResults, ... } }
  const [evidenceData, setEvidenceData] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_projectverse_evidence');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      'pv-ai-eval-hallucination': {
        githubUrl: 'https://github.com/scholar/lumixora-rag-eval-lab',
        liveDemoUrl: 'https://rag-eval-lab.preview.lumixora.in',
        demoVideoUrl: 'https://loom.com/share/demo-eval-lab-1234',
        architectureDiagramUrl: 'https://raw.githubusercontent.com/scholar/lumixora-rag-eval-lab/main/architecture.png',
        measuredMetricValue: 'Evaluated 50 synthetic hallucination cases with 94.2% precision and <160ms latency.',
        individualContributions: 'Architected FastAPI endpoints, ChromaDB retriever pipeline, and sentence-level NLI contradiction scoring algorithm.',
        testSuiteResults: { testsCount: 18, passedCount: 18, coverage: '92%' },
        differentiatedFeatures: [
          'Evaluates grounding token-by-token rather than relying on OpenAI output wrappers',
          'Includes benchmark suite with 50 synthetic adversarial hallucinations'
        ]
      }
    };
  });

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumixora_projectverse_profile', JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('lumixora_projectverse_active_proj', selectedProjectId);
    } catch (e) {}
  }, [selectedProjectId]);

  useEffect(() => {
    try {
      localStorage.setItem('lumixora_projectverse_tasks', JSON.stringify(completedTasks));
    } catch (e) {}
  }, [completedTasks]);

  useEffect(() => {
    try {
      localStorage.setItem('lumixora_projectverse_evidence', JSON.stringify(evidenceData));
    } catch (e) {}
  }, [evidenceData]);

  // Derived Selected Project Object
  const currentProject = useMemo(() => {
    return PROJECT_CATALOGUE.find(p => p.id === selectedProjectId) || PROJECT_CATALOGUE[0];
  }, [selectedProjectId]);

  // Derived Skill Gap Analysis
  const skillGap = useMemo(() => {
    return analyzeSkillGap(profile.skills, profile.targetRole);
  }, [profile.skills, profile.targetRole]);

  // Derived 3 Personalized Recommendations (Starter, Recommended, Ambitious)
  const recommendations = useMemo(() => {
    return getPersonalizedRecommendations(profile, PROJECT_CATALOGUE);
  }, [profile]);

  // Derived Resume Impact Score for current project
  const currentEvidence = useMemo(() => {
    return evidenceData[selectedProjectId] || {};
  }, [evidenceData, selectedProjectId]);

  const scoreResult = useMemo(() => {
    return calculateResumeImpactScore(currentProject, currentEvidence);
  }, [currentProject, currentEvidence]);

  // QR Code for Proof-of-Work Verification Card
  const [portfolioQr, setPortfolioQr] = useState('');
  useEffect(() => {
    const verificationUrl = `${window.location.origin}/#projectverse?verify=${selectedProjectId}&scholar=${encodeURIComponent(profile.name)}`;
    QRCode.toDataURL(verificationUrl, { width: 220, margin: 1, color: { dark: '#0f172a', light: '#ffffff' } })
      .then(url => setPortfolioQr(url))
      .catch(() => {});
  }, [selectedProjectId, profile.name]);

  // Filter state for Project Explorer
  const [explorerSearch, setExplorerSearch] = useState('');
  const [explorerDomain, setExplorerDomain] = useState('ALL');
  const [explorerDifficulty, setExplorerDifficulty] = useState('ALL');

  const filteredCatalogue = useMemo(() => {
    return PROJECT_CATALOGUE.filter(p => {
      const matchesSearch = 
        p.title.toLowerCase().includes(explorerSearch.toLowerCase()) ||
        p.tagline.toLowerCase().includes(explorerSearch.toLowerCase()) ||
        p.skillsDemonstrated.some(s => s.toLowerCase().includes(explorerSearch.toLowerCase()));
      const matchesDomain = explorerDomain === 'ALL' || p.domain === explorerDomain;
      const matchesDiff = explorerDifficulty === 'ALL' || p.difficulty.toLowerCase().includes(explorerDifficulty.toLowerCase());
      return matchesSearch && matchesDomain && matchesDiff;
    });
  }, [explorerSearch, explorerDomain, explorerDifficulty]);

  // Skills Editor input state
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAddSkill = (e) => {
    e?.preventDefault();
    if (!newSkillInput.trim()) return;
    const clean = newSkillInput.trim();
    if (!profile.skills.includes(clean)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, clean] }));
      setNewSkillInput('');
      addToast({ message: `Added "${clean}" to your skill inventory.`, type: 'success' });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Toggle Task Completion in Build Studio
  const handleToggleTask = (projectId, taskTitle) => {
    setCompletedTasks(prev => {
      const projTasks = prev[projectId] || {};
      const updated = { ...projTasks, [taskTitle]: !projTasks[taskTitle] };
      return { ...prev, [projectId]: updated };
    });
  };

  // Milestone Progress percentage calculation
  const studioProgress = useMemo(() => {
    if (!currentProject || !currentProject.milestones) return 0;
    const allTasks = currentProject.milestones.flatMap(m => m.tasks);
    if (allTasks.length === 0) return 0;
    const projCompleted = completedTasks[currentProject.id] || {};
    const doneCount = allTasks.filter(t => projCompleted[t]).length;
    return Math.round((doneCount / allTasks.length) * 100);
  }, [currentProject, completedTasks]);

  // Handle select project for Studio/Details
  const handleSelectProject = (projectId, targetTab = 'details') => {
    setSelectedProjectId(projectId);
    setActiveView(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast({ message: 'Loaded project roadmap.', type: 'info' });
  };

  // Handle Evidence Form Update
  const handleEvidenceChange = (field, value) => {
    setEvidenceData(prev => ({
      ...prev,
      [selectedProjectId]: {
        ...(prev[selectedProjectId] || {}),
        [field]: value
      }
    }));
  };

  // Copy Bullet point
  const [copiedBulletIdx, setCopiedBulletIdx] = useState(null);
  const handleCopyBullet = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
    addToast({ message: 'Resume bullet copied to clipboard!', type: 'success' });
  };

  // Quick Resume Text Extraction Parser Simulation
  const [resumeAnalyzing, setResumeAnalyzing] = useState(false);
  const handleSimulateResumeScan = () => {
    if (!profile.resumeText.trim()) {
      addToast({ message: 'Please paste some resume text first.', type: 'warning' });
      return;
    }
    setResumeAnalyzing(true);
    setTimeout(() => {
      const text = profile.resumeText.toLowerCase();
      const detected = [];
      const commonSkills = ['python', 'react', 'sql', 'docker', 'fastapi', 'pytorch', 'machine learning', 'git', 'c++', 'java', 'redis', 'aws', 'kubernetes', 'typescript', 'mongodb', 'node.js'];
      commonSkills.forEach(s => {
        if (text.includes(s)) detected.push(s.toUpperCase());
      });
      if (detected.length > 0) {
        setProfile(prev => ({
          ...prev,
          skills: Array.from(new Set([...prev.skills, ...detected]))
        }));
        addToast({ message: `Analyzed resume! Extracted ${detected.length} verified technical skills.`, type: 'success' });
      } else {
        addToast({ message: 'Resume parsed. No new technical keywords detected.', type: 'info' });
      }
      setResumeAnalyzing(false);
    }, 800);
  };

  // Handle Print Credential
  const handlePrintCredential = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('print-projectverse-credential');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('print-projectverse-credential');
      }, 1000);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER COMPONENT
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      
      {/* ── TOP EXECUTIVE BANNER (LIGHT THEME) ── */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-slate-950 tracking-tight font-sora">
                  LUMIXORA PROJECTVERSE™
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase tracking-wider border border-blue-200">
                  Proof-of-Skill Engine
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  by VYOMRA
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {PROJECTVERSE_META.tagline} • <strong className="text-slate-700">{PROJECTVERSE_META.centralPromise}</strong>
              </p>
            </div>
          </div>

          {/* Quick Stats Pill Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-1.5 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-slate-500">Target Role:</span>
              <strong className="text-xs font-black text-slate-900">
                {TARGET_CAREER_ROLES.find(r => r.id === profile.targetRole)?.title.split(' ')[0] || 'AI/ML'}
              </strong>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-3.5 py-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase text-emerald-800">Role Readiness:</span>
              <strong className="text-xs font-black text-emerald-700">{skillGap.readinessPercent}%</strong>
            </div>

            <button
              onClick={() => setActiveView('portfolio')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>My Portfolio Card</span>
            </button>
          </div>
        </div>

        {/* ── NAVIGATION TABS ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-slate-100 py-1.5 scrollbar-none">
          {[
            { id: 'overview', label: '01. AI Student Profile', icon: Target },
            { id: 'recommendations', label: '02. AI Recommendations', icon: Sparkles, badge: '3 Tiers' },
            { id: 'explorer', label: '03. Project Explorer', icon: Search, badge: `${PROJECT_CATALOGUE.length}` },
            { id: 'details', label: '04. Architecture Blueprint', icon: Layers },
            { id: 'studio', label: '05. Build Studio', icon: Terminal, badge: `${studioProgress}%` },
            { id: 'impact', label: '06. Resume Impact Engine', icon: BarChart3, badge: '100 pts' },
            { id: 'portfolio', label: '07. Proof-of-Work Portfolio', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        {/* ================================================================ */}
        {/* TAB 1: AI STUDENT PROFILE & SKILL-GAP ENGINE                     */}
        {/* ================================================================ */}
        {activeView === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Mission Hero Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="max-w-3xl space-y-3 relative z-10">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-wider border border-blue-200 inline-block">
                  Personalized Engineering Career Roadmap
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                  Stop building tutorial clones. Build what employers actually look for.
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  ProjectVerse audits your current branch, year, target role, and technical skills to compute an objective <strong>Skill-Gap Map</strong>. We then recommend three tailored project tiers that demonstrate real technical depth, test suites, and deployed architecture on your resume.
                </p>
                <div className="pt-2 flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setActiveView('recommendations')}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-md shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View 3 Personalized Options</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveView('explorer')}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all border border-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Browse Project Catalogue ({PROJECT_CATALOGUE.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2-Column: Profile Onboarding + Live Skill-Gap Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Student Context Form */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span>Student Profile & Career Goals</span>
                    </h3>
                    <p className="text-xs text-slate-500">Fine-tune your details to calibrate recommendation difficulty and timelines.</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    Auto-Saved
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Target Engineering Role *</label>
                    <select
                      value={profile.targetRole}
                      onChange={(e) => setProfile(prev => ({ ...prev, targetRole: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {TARGET_CAREER_ROLES.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.title} ({role.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Current Experience Level</label>
                    <select
                      value={profile.experienceLevel}
                      onChange={(e) => setProfile(prev => ({ ...prev, experienceLevel: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Beginner">Beginner (1st–2nd Year / Learning Fundamentals)</option>
                      <option value="Intermediate">Intermediate (Has built simple web/Python apps)</option>
                      <option value="Advanced">Advanced (Comfortable with Docker, APIs & DBs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Academic Branch & Year</label>
                    <input
                      type="text"
                      value={`${profile.branch} • ${profile.year}`}
                      onChange={(e) => setProfile(prev => ({ ...prev, branch: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Available Building Time</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="5"
                        max="30"
                        step="1"
                        value={profile.availableHours}
                        onChange={(e) => setProfile(prev => ({ ...prev, availableHours: e.target.value }))}
                        className="flex-1 accent-blue-600 cursor-pointer"
                      />
                      <span className="font-mono font-black text-blue-700 text-xs w-16 text-right">
                        {profile.availableHours} hrs/wk
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills Inventory Chips */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Current Skills Inventory ({profile.skills.length})
                    </label>
                    <span className="text-[10px] text-slate-400">Click × to remove or add below</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 min-h-[50px]">
                    {profile.skills.map(s => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs"
                      >
                        <span>{s}</span>
                        <button
                          onClick={() => handleRemoveSkill(s)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddSkill} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Type a skill (e.g. Docker, PyTorch, Go, Redis)..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-all"
                    >
                      + Add
                    </button>
                  </form>
                </div>

                {/* Optional Resume Scanner Box */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-950 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      Optional: Paste Resume / LinkedIn Summary
                    </span>
                    <span className="text-[10px] text-blue-700 font-bold">Fast Skill Ingestion</span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Paste technical skills section from your resume to automatically extract keywords..."
                    value={profile.resumeText}
                    onChange={(e) => setProfile(prev => ({ ...prev, resumeText: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-white border border-blue-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 placeholder:text-slate-400 font-mono"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSimulateResumeScan}
                      disabled={resumeAnalyzing}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{resumeAnalyzing ? 'Extracting...' : 'Scan & Ingest Skills'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Skill-Gap Radar & Target Role Fit */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Readiness Gauge Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Career Alignment</span>
                      <h3 className="text-lg font-black text-slate-900 mt-0.5">
                        {skillGap.targetRole}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-blue-600 font-mono">
                        {skillGap.readinessPercent}%
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">Core Match</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-500"
                      style={{ width: `${skillGap.readinessPercent}%` }}
                    />
                  </div>

                  {/* Acquired vs Missing Skills Split */}
                  <div className="space-y-3 pt-2 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1 mb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Demonstrated Skills ({skillGap.acquiredSkills.length})</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {skillGap.acquiredSkills.map(s => (
                          <span key={s} className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[11px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-rose-800 uppercase flex items-center gap-1 mb-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>High-Priority Skill Gaps ({skillGap.missingSkills.length})</span>
                      </span>
                      <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                        Employers specifically test these skills for {skillGap.targetRole}. Your recommended projects are designed to prove these:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {skillGap.missingSkills.map(s => (
                          <span key={s} className="px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-800 font-bold border border-rose-200 text-[11px] flex items-center gap-1">
                            <span>{s}</span>
                            <span className="text-[9px] text-rose-400">Needs Proof</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA to jump to tailored projects */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setActiveView('recommendations')}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>View Projects that close these gaps</span>
                    </button>
                  </div>
                </div>

                {/* Quick Advice Callout */}
                <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-2">
                  <div className="flex items-center gap-2 font-black text-amber-900">
                    <Info className="w-4 h-4 text-amber-600" />
                    <span>The Lumixora Anti-Clone Guarantee</span>
                  </div>
                  <p className="leading-relaxed text-amber-900/90">
                    Every project in ProjectVerse includes explicit <strong>uniqueness requirements</strong> (like automated evaluation benchmarks, cgroup container isolation, or CRDT state merging) that separate your work from 1,000 generic candidates on recruiter screens.
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: AI PROJECT RECOMMENDER (3 PERSONALIZED TIERS)             */}
        {/* ================================================================ */}
        {activeView === 'recommendations' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Calibrated for {skillGap.targetRole}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                  Three Personalized Project Blueprints
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a tier based on your current semester timeline and available hours ({profile.availableHours} hrs/week).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('explorer')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Browse Full Catalogue</span>
                </button>
              </div>
            </div>

            {/* 3 Tier Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* TIER 1: STARTER */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider border border-blue-200">
                      Starter Tier
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {recommendations.starter.dynamicDuration}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-950 leading-snug group-hover:text-blue-600 transition-colors">
                      {recommendations.starter.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {recommendations.starter.tagline}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Why this matters:</span>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      {recommendations.starter.problemStatement.substring(0, 140)}...
                    </p>
                  </div>

                  {/* Skills Demonstrated */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skills Demonstrated:</span>
                    <div className="flex flex-wrap gap-1">
                      {recommendations.starter.skillsDemonstrated.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Score & Cost meta */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span>Potential Impact: <strong className="text-slate-950 font-mono font-bold">{recommendations.starter.potentialImpactScore}/100</strong></span>
                    <span>Cost: <strong className="text-emerald-700">{recommendations.starter.estimatedCost.split('(')[0]}</strong></span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleSelectProject(recommendations.starter.id, 'studio')}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-md shadow-blue-500/20 cursor-pointer text-center"
                  >
                    Start in Studio
                  </button>
                  <button
                    onClick={() => handleSelectProject(recommendations.starter.id, 'details')}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    title="View Blueprint"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* TIER 2: RECOMMENDED (BEST FIT) */}
              <div className="bg-gradient-to-b from-white via-indigo-50/20 to-white rounded-3xl border-2 border-blue-500/60 p-6 flex flex-col justify-between space-y-5 shadow-md shadow-blue-500/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-2xl shadow-sm">
                  ⭐ Best Career Fit
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-xs">
                      Recommended Tier
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      {recommendations.recommended.dynamicDuration}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-950 leading-snug group-hover:text-blue-600 transition-colors">
                      {recommendations.recommended.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {recommendations.recommended.tagline}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/60 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">Key Differentiator:</span>
                    <p className="text-blue-950 text-[11px] leading-relaxed">
                      {recommendations.recommended.differentiation[0]}
                    </p>
                  </div>

                  {/* Skills Demonstrated */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skills Demonstrated:</span>
                    <div className="flex flex-wrap gap-1">
                      {recommendations.recommended.skillsDemonstrated.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 text-[10px] font-bold border border-indigo-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Score & Cost meta */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span>Potential Impact: <strong className="text-blue-700 font-mono font-black text-sm">{recommendations.recommended.potentialImpactScore}/100</strong></span>
                    <span>Difficulty: <strong className="text-amber-700">{recommendations.recommended.difficulty}</strong></span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleSelectProject(recommendations.recommended.id, 'studio')}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs transition-all shadow-md shadow-blue-500/25 cursor-pointer text-center"
                  >
                    Start in Studio (Recommended)
                  </button>
                  <button
                    onClick={() => handleSelectProject(recommendations.recommended.id, 'details')}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    title="View Blueprint"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* TIER 3: AMBITIOUS */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-extrabold uppercase tracking-wider border border-rose-200">
                      Ambitious Tier
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {recommendations.ambitious.dynamicDuration}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-950 leading-snug group-hover:text-rose-600 transition-colors">
                      {recommendations.ambitious.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {recommendations.ambitious.tagline}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">High Complexity Scope:</span>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      {recommendations.ambitious.problemStatement.substring(0, 140)}...
                    </p>
                  </div>

                  {/* Skills Demonstrated */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skills Demonstrated:</span>
                    <div className="flex flex-wrap gap-1">
                      {recommendations.ambitious.skillsDemonstrated.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-800 text-[10px] font-bold border border-rose-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Score & Cost meta */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span>Potential Impact: <strong className="text-slate-950 font-mono font-bold">{recommendations.ambitious.potentialImpactScore}/100</strong></span>
                    <span>Difficulty: <strong className="text-rose-700 font-bold">{recommendations.ambitious.difficulty}</strong></span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleSelectProject(recommendations.ambitious.id, 'studio')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all shadow-md cursor-pointer text-center"
                  >
                    Start in Studio
                  </button>
                  <button
                    onClick={() => handleSelectProject(recommendations.ambitious.id, 'details')}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    title="View Blueprint"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: PROJECT EXPLORER & CATALOGUE                              */}
        {/* ================================================================ */}
        {activeView === 'explorer' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Domain Filter Bar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search by project name, tech stack (e.g. Docker, Redis, RAG, CRDTs)..."
                    value={explorerSearch}
                    onChange={(e) => setExplorerSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={explorerDifficulty}
                    onChange={(e) => setExplorerDifficulty(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="ALL">All Difficulties</option>
                    <option value="Beginner">Beginner Tier</option>
                    <option value="Intermediate">Intermediate Tier</option>
                    <option value="Advanced">Advanced Tier</option>
                  </select>
                </div>
              </div>

              {/* Domain Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
                {[
                  { id: 'ALL', label: 'All Disciplines' },
                  { id: 'ai_ml', label: 'AI / ML & LLMs' },
                  { id: 'fullstack', label: 'Full-Stack & Backend' },
                  { id: 'cloud_devops', label: 'Cloud & DevOps' },
                  { id: 'data_engineering', label: 'Data Engineering' },
                  { id: 'security', label: 'Cybersecurity' },
                  { id: 'mobile', label: 'Mobile Apps' }
                ].map(dom => (
                  <button
                    key={dom.id}
                    onClick={() => setExplorerDomain(dom.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      explorerDomain === dom.id
                        ? 'bg-blue-600 text-white font-black shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {dom.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalogue.map(project => (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {project.domainLabel}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${project.difficultyColor}`}>
                        {project.difficulty}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {project.skillsDemonstrated.slice(0, 4).map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {s}
                        </span>
                      ))}
                      {project.skillsDemonstrated.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[9px] text-slate-400 font-bold">
                          +{project.skillsDemonstrated.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span>Potential Score: <strong className="text-blue-700 font-mono font-black">{project.potentialImpactScore}/100</strong></span>
                      <span>{project.estimatedWeeks}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelectProject(project.id, 'studio')}
                        className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-all cursor-pointer text-center"
                      >
                        Start Studio
                      </button>
                      <button
                        onClick={() => handleSelectProject(project.id, 'details')}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        title="View Architecture"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: PROJECT ARCHITECTURE & DETAILED BLUEPRINT                 */}
        {/* ================================================================ */}
        {activeView === 'details' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Toolbar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {currentProject.domainLabel} • {currentProject.difficulty}
                </span>
                <h2 className="text-2xl font-black text-slate-950 mt-1">
                  {currentProject.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentProject.tagline}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('studio')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-md shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Open Build Studio</span>
                </button>
                <button
                  onClick={() => setActiveView('impact')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Score Rubric</span>
                </button>
              </div>
            </div>

            {/* 3-Column Architectural Spec */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (8 cols): Problem, Solution & Uniqueness */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Problem vs Solution Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-2">
                      01. Problem Statement
                    </h3>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                      {currentProject.problemStatement}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-2">
                      02. Proposed Architectural Solution
                    </h3>
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 text-xs text-blue-950 leading-relaxed font-medium">
                      {currentProject.solutionOverview}
                    </div>
                  </div>

                  {/* Differentiation Callouts */}
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>03. Anti-Clone Differentiation Strategies</span>
                    </h3>
                    <div className="space-y-2">
                      {currentProject.differentiation.map((diff, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-950 flex items-start gap-2.5 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{diff}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Architecture Visual Diagram Block */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>04. System Component Architecture</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {Object.entries(currentProject.architecture).map(([layer, desc]) => (
                      <div key={layer} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] font-mono uppercase font-black text-blue-700 block">
                          {layer.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <p className="text-slate-800 font-bold leading-snug">
                          {desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5-Phase Roadmap Preview */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <ListTodo className="w-4 h-4 text-blue-600" />
                      <span>05. Phase-by-Phase Roadmap</span>
                    </h3>
                    <span className="text-xs text-slate-500 font-bold">5 Strategic Milestones</span>
                  </div>

                  <div className="space-y-3">
                    {currentProject.milestones.map((m, idx) => (
                      <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <strong className="text-slate-950 font-bold block text-sm">
                          {m.title}
                        </strong>
                        <ul className="list-disc pl-5 space-y-1 text-slate-600">
                          {m.tasks.map((t, tidx) => (
                            <li key={tidx}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column (4 cols): Meta, Score, Tech Stack */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Metric Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Project Specifications</span>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Estimated Duration:</span>
                      <strong className="text-slate-900 font-bold">{currentProject.estimatedWeeks}</strong>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Effort Investment:</span>
                      <strong className="text-slate-900 font-bold">{currentProject.estimatedHours}</strong>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Infrastructure Cost:</span>
                      <strong className="text-emerald-700 font-bold">{currentProject.estimatedCost}</strong>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Potential Resume Score:</span>
                      <strong className="text-blue-700 font-black font-mono text-sm">{currentProject.potentialImpactScore}/100</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectProject(currentProject.id, 'studio')}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Build This Project</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Resume Bullets Preview */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                    Resume Ready
                  </span>
                  <h4 className="text-sm font-black text-slate-900">
                    What you will add to your Resume:
                  </h4>
                  <div className="space-y-2 text-[11px] text-slate-700">
                    {currentProject.resumeBullets.map((bullet, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed font-mono text-[10.5px]">
                        • {bullet}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 5: PROJECT BUILD STUDIO (INTERACTIVE WORKSPACE)              */}
        {/* ================================================================ */}
        {activeView === 'studio' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Progress Status */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider border border-blue-200">
                    Active Workspace
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Ref: {currentProject.id}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                  Build Studio: {currentProject.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track your milestones step-by-step. Each checked item updates your verified proof index.
                </p>
              </div>

              {/* Progress Ring / Bar */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Milestone Progress</span>
                  <span className="text-lg font-black text-blue-700 font-mono">{studioProgress}% Completed</span>
                </div>
                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${studioProgress}%` }} />
                </div>
              </div>
            </div>

            {/* Studio Workspace Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Task Checklist (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {currentProject.milestones.map((milestone, mIdx) => (
                  <div key={milestone.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 text-xs font-black flex items-center justify-center border border-blue-200">
                          {mIdx + 1}
                        </span>
                        <span>{milestone.title}</span>
                      </h3>
                      <span className="text-[11px] font-bold text-slate-400 font-mono">
                        {milestone.tasks.filter(t => (completedTasks[currentProject.id] || {})[t]).length} / {milestone.tasks.length} Done
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {milestone.tasks.map((task, tIdx) => {
                        const isDone = Boolean((completedTasks[currentProject.id] || {})[task]);
                        return (
                          <div
                            key={tIdx}
                            onClick={() => handleToggleTask(currentProject.id, task)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 text-xs ${
                              isDone
                                ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950 font-medium'
                                : 'bg-slate-50/70 border-slate-200/70 text-slate-800 hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}}
                              className="mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer w-4 h-4 accent-blue-600 shrink-0"
                            />
                            <span className={isDone ? 'line-through text-slate-500' : 'font-medium'}>
                              {task}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side: Tools & Quick Runbooks (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Suggested Tools & Commands */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
                  <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 inline-block">
                    Suggested Toolchain
                  </span>
                  
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <strong className="text-slate-900 block font-bold">1. Local Setup</strong>
                      <code className="text-[11px] font-mono text-blue-700 block bg-white p-1.5 rounded border border-slate-200">
                        git init && npm init -y
                      </code>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <strong className="text-slate-900 block font-bold">2. Test Execution Command</strong>
                      <code className="text-[11px] font-mono text-blue-700 block bg-white p-1.5 rounded border border-slate-200">
                        pytest --cov=src tests/
                      </code>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <strong className="text-slate-900 block font-bold">3. Containerization Build</strong>
                      <code className="text-[11px] font-mono text-blue-700 block bg-white p-1.5 rounded border border-slate-200">
                        docker compose up --build
                      </code>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setActiveView('impact')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Proof & Check Score</span>
                    </button>
                  </div>
                </div>

                {/* Anti-Clone Check */}
                <div className="bg-amber-50/70 border border-amber-200/80 p-5 rounded-3xl text-xs text-amber-950 space-y-2">
                  <strong className="font-black text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>How to earn 100% Verified Score</span>
                  </strong>
                  <p className="leading-relaxed text-[11.5px]">
                    Do not just tick milestones! To achieve an authentic verified score, provide your <strong>GitHub Repository</strong>, <strong>Passing Test Results</strong>, and a <strong>Live Deployment Link</strong> on the Resume Impact tab.
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 6: RESUME IMPACT ENGINE (THE 100-POINT TRANSPARENT RUBRIC)    */}
        {/* ================================================================ */}
        {activeView === 'impact' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Score Summary Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Objective Proof Rubric v{PROJECTVERSE_META.rubricVersion}
                  </span>
                  <h2 className="text-2xl font-black text-slate-950 mt-1">
                    Resume Impact Score Analysis
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    We separate <strong className="text-slate-800">Potential Score</strong> (what the project could earn) from <strong className="text-slate-800">Verified Score</strong> (what you have actually proven with code, tests, and deployment).
                  </p>
                </div>

                {/* Twin Scores Display */}
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                  <div className="text-center px-3 border-r border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Potential Score</span>
                    <strong className="text-2xl font-black text-blue-700 font-mono">
                      {scoreResult.potentialScore}
                    </strong>
                    <span className="text-[10px] text-slate-400 block">/ 100 pts</span>
                  </div>

                  <div className="text-center px-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Verified Score</span>
                    <strong className="text-2xl font-black text-emerald-600 font-mono">
                      {scoreResult.verifiedScore}
                    </strong>
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      {scoreResult.verifiedScore >= 70 ? 'Authentic' : 'Provisional'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Official Transparency Notice */}
              <div className="p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Transparency Notice:</strong> {PROJECTVERSE_META.disclaimer}
                </span>
              </div>
            </div>

            {/* 6 Category Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(SCORING_RUBRIC).map(([catKey, rubricItem]) => {
                const potentialVal = scoreResult.potentialBreakdown[catKey] || 0;
                const verifiedVal = scoreResult.verifiedBreakdown[catKey] || 0;
                const weightPct = rubricItem.percentage;

                return (
                  <div key={catKey} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider border border-blue-200">
                          Weight: {weightPct}%
                        </span>
                        <div className="text-right font-mono text-xs">
                          <span className="text-slate-400 font-medium">Earned: </span>
                          <strong className="text-emerald-700 font-black">{verifiedVal}</strong>
                          <span className="text-slate-400"> / {potentialVal}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-black text-slate-950">
                        {rubricItem.title}
                      </h3>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {rubricItem.description}
                      </p>

                      {/* Criteria Checklist */}
                      <div className="space-y-1.5 pt-1">
                        {rubricItem.criteria.map(crit => (
                          <div key={crit.id} className="text-[11px] text-slate-700 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                            <span>{crit.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.round((verifiedVal / potentialVal) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Evidence Submission Hub */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Proof-of-Work Verification Inputs</span>
                  </h3>
                  <p className="text-xs text-slate-500">Provide verifiable evidence links to unlock your full verified project score.</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Live Calculator
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">GitHub Repository URL *</label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/project-repo"
                    value={currentEvidence.githubUrl || ''}
                    onChange={(e) => handleEvidenceChange('githubUrl', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Unlocks Proof & Documentation score (+50 pts).</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Live Deployment / Demo URL *</label>
                  <input
                    type="url"
                    placeholder="https://my-app.render.com or Vercel URL"
                    value={currentEvidence.liveDemoUrl || ''}
                    onChange={(e) => handleEvidenceChange('liveDemoUrl', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Unlocks Working Implementation score (+50 pts).</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Demo Video / Loom Walkthrough URL</label>
                  <input
                    type="url"
                    placeholder="https://loom.com/share/..."
                    value={currentEvidence.demoVideoUrl || ''}
                    onChange={(e) => handleEvidenceChange('demoVideoUrl', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Architecture Diagram URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/.../architecture.png"
                    value={currentEvidence.architectureDiagramUrl || ''}
                    onChange={(e) => handleEvidenceChange('architectureDiagramUrl', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs">Measured Performance Metrics (Observed Numbers)</label>
                <input
                  type="text"
                  placeholder="e.g. Evaluated 50 hallucination cases with <180ms latency and 94% precision across test sets."
                  value={currentEvidence.measuredMetricValue || ''}
                  onChange={(e) => handleEvidenceChange('measuredMetricValue', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Unlocks Measurable Impact category (+90 pts).</span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 7: PROOF-OF-WORK PORTFOLIO & ATS RESUME BUILDER              */}
        {/* ================================================================ */}
        {activeView === 'portfolio' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Public Proof-of-Work Credential
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                  Shareable Portfolio & Resume Bullets
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Factual, evidence-grounded project summaries ready to paste on your Resume and LinkedIn.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintCredential}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Credential PDF</span>
                </button>
              </div>
            </div>

            {/* 2-Column: Printable Credential Card + ATS Bullet Generator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Official Proof Card (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div 
                  id="printable-projectverse-credential"
                  className="bg-white rounded-3xl border-2 border-blue-600/30 p-6 sm:p-8 space-y-5 shadow-lg relative overflow-hidden"
                >
                  {/* Subtle seal watermark */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md">
                        <Rocket className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-950 uppercase tracking-tight">LUMIXORA PROJECTVERSE</h4>
                        <span className="text-[9px] text-blue-700 font-extrabold uppercase tracking-widest block">Vyomra Networks</span>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 uppercase">
                      VERIFIED PROOF
                    </span>
                  </div>

                  {/* Scholar Info */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Credential Recipient:</span>
                    <h3 className="text-lg font-black text-slate-950 leading-tight">
                      {profile.name}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {profile.college} ({profile.branch})
                    </p>
                  </div>

                  {/* Project Info & Score Badge */}
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-blue-800">Featured Capstone</span>
                      <strong className="text-sm font-black text-blue-900 font-mono">
                        {scoreResult.verifiedScore} / 100 Verified
                      </strong>
                    </div>
                    <h4 className="text-sm font-black text-slate-950 leading-snug">
                      {currentProject.title}
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      {currentProject.tagline}
                    </p>
                  </div>

                  {/* Verified Evidence Links */}
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Auditable Evidence Links:</span>
                    
                    <div className="space-y-1 text-[11px] font-mono text-slate-800">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <span>GitHub Repository:</span>
                        <strong className="text-blue-700 truncate max-w-[160px]">
                          {currentEvidence.githubUrl ? 'Verified Link' : 'Not Linked'}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <span>Live Deployment:</span>
                        <strong className="text-emerald-700 truncate max-w-[160px]">
                          {currentEvidence.liveDemoUrl ? 'Active Endpoint' : 'Not Deployed'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Verification QR Code */}
                  {portfolioQr && (
                    <div className="pt-2 flex items-center gap-3 border-t border-slate-200">
                      <img src={portfolioQr} alt="QR" className="w-14 h-14 rounded-xl border border-slate-200 p-1 shrink-0" />
                      <div>
                        <span className="text-[9px] text-slate-500 font-medium block leading-tight">
                          Scan to verify independent proof on Lumixora Registry
                        </span>
                        <span className="text-[9px] font-mono text-blue-700 font-bold block mt-0.5">
                          HASH: {currentProject.id.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Footer Seal */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
                    <span>Issued by Vyomra Networks</span>
                    <span className="font-mono">VALIDATED 2026</span>
                  </div>
                </div>
              </div>

              {/* Right Column: ATS Resume Bullets Generator (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Google XYZ Format
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    ATS-Friendly Resume Project Bullets
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Synthesized from your confirmed technical decisions, architecture, and observed metrics.
                  </p>
                </div>

                <div className="space-y-4">
                  {currentProject.resumeBullets.map((bullet, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          Bullet Point #{idx + 1}
                        </span>
                        <button
                          onClick={() => handleCopyBullet(bullet, idx)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                        >
                          {copiedBulletIdx === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed font-sans font-medium">
                        • {bullet}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Interview Talking Points */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2 text-xs">
                  <strong className="text-blue-950 font-black flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>How to speak about this project in technical interviews:</span>
                  </strong>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11.5px] leading-relaxed">
                    <li>Lead with the <strong>architectural tradeoff</strong> (e.g. why you chose Docker isolation over naive process execution).</li>
                    <li>Highlight the <strong>measurable metrics</strong> you benchmarked (latency, faithfulness ratio, error rates).</li>
                    <li>Offer to pull up your <strong>live deployment link</strong> on screen during the interview!</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}
