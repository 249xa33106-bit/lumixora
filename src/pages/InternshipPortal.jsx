import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Mail, 
  Globe, 
  Download, 
  Star, 
  Send, 
  ExternalLink, 
  Lock, 
  Sparkles, 
  Users, 
  Copy, 
  Check, 
  RefreshCw, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { 
  INTERNSHIP_ROLES, 
  subscribeToApplications, 
  submitInternshipApplication, 
  updateApplicationStatus, 
  addReviewerNote, 
  lookupApplication 
} from '../services/internshipDb';
import { convertApplicationToIntern } from '../services/internDbService';
import InternWorkspacePortal from './InternWorkspacePortal';
import { isFounderEmail, cleanScholarName } from '../utils/authSecurity';
import { useToast } from '../context/ToastContext';

export default function InternshipPortal({ user, setActiveTab, initialView = 'overview' }) {
  // Reviewer Board and live admissions queue are strictly restricted to verified Founder accounts
  const isFounder = Boolean(isFounderEmail(user?.email));

  const [activeView, setActiveView] = useState(() => {
    if (initialView === 'submissions' && !isFounder) return 'overview';
    return initialView;
  });

  // Guard: Regular users must never view or stay on the Reviewer Board
  useEffect(() => {
    if (activeView === 'submissions' && !isFounder) {
      setActiveView('overview');
    }
  }, [activeView, isFounder]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);
  const toastContext = useToast();
  const addToast = toastContext?.addToast || (({ message }) => console.log(message));

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name ? cleanScholarName(user.name) : '',
    email: user?.email || '',
    phone: user?.phone || '',
    cityAndState: 'Kurnool, Andhra Pradesh',
    collegeName: user?.college || 'G. Pulla Reddy Engineering College',
    degreeAndBranch: user?.branch || 'B.Tech CSE',
    currentYearOfStudy: user?.year || '3rd Year',
    preferredRole: 'software_testing',
    whyJoinLumixora: '',
    relevantSkills: '',
    hopeToLearn: '',
    linkedinUrl: '',
    portfolioOrWorkUrl: '',
    hoursPerWeek: '15–20 hours/week',
    canCommitSixWeeks: true,
    confirmedAccurate: true,
    reviewedTerms: true,
    agreedToPrivacy: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  // Tracker State
  const [trackQuery, setTrackQuery] = useState(user?.email || '');
  const [trackedApp, setTrackedApp] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackSearched, setTrackSearched] = useState(false);

  // Admin / Submissions State
  const [searchFilter, setSearchFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [newRating, setNewRating] = useState(5);

  // Subscribe to real-time live applications
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToApplications(
      (data) => {
        setApplications(data);
        setLoading(false);
        setDbConnected(true);
      },
      (err) => {
        console.warn("Real-time subscription notice:", err);
        setDbConnected(false);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Filtered applications for reviewer
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      if (roleFilter !== 'all' && app.preferredRole !== roleFilter) return false;
      if (statusFilter !== 'all' && app.status !== statusFilter) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchName = (app.fullName || '').toLowerCase().includes(q);
        const matchEmail = (app.email || '').toLowerCase().includes(q);
        const matchCollege = (app.collegeName || '').toLowerCase().includes(q);
        const matchRef = (app.refId || '').toLowerCase().includes(q);
        const matchPhone = (app.phone || '').includes(q);
        if (!matchName && !matchEmail && !matchCollege && !matchRef && !matchPhone) return false;
      }
      return true;
    });
  }, [applications, roleFilter, statusFilter, searchFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === 'pending').length;
    const reviewing = applications.filter(a => a.status === 'reviewing').length;
    const shortlisted = applications.filter(a => a.status === 'shortlisted').length;
    const accepted = applications.filter(a => a.status === 'accepted').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;

    // Track counts
    const trackCounts = {
      software_testing: applications.filter(a => a.preferredRole === 'software_testing').length,
      research: applications.filter(a => a.preferredRole === 'research').length,
      marketing: applications.filter(a => a.preferredRole === 'marketing').length,
      content_creation: applications.filter(a => a.preferredRole === 'content_creation').length
    };

    return { total, pending, reviewing, shortlisted, accepted, rejected, trackCounts };
  }, [applications]);

  // Handle Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      addToast({ message: 'Please fill in all mandatory contact information.', type: 'error' });
      return;
    }
    if (!formData.whyJoinLumixora.trim() || !formData.relevantSkills.trim()) {
      addToast({ message: 'Please answer the motivation and skills questions.', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const newApp = await submitInternshipApplication(formData);
      setSubmittedRef(newApp);
      addToast({ message: `Application submitted successfully! Ref: ${newApp.refId}`, type: 'success' });
      setActiveView('submitted');
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to submit application. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Lookup
  const handleTrackSearch = async (e) => {
    e?.preventDefault();
    if (!trackQuery.trim()) return;
    setTrackingLoading(true);
    setTrackSearched(true);
    const result = await lookupApplication(trackQuery);
    setTrackedApp(result);
    setTrackingLoading(false);
  };

  // Status Change Handler
  const handleStatusChange = async (appId, nextStatus) => {
    try {
      const updated = await updateApplicationStatus(appId, nextStatus);
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(updated);
      }
      addToast({ message: `Applicant status updated to ${nextStatus.toUpperCase()}`, type: 'success' });
    } catch (e) {
      addToast({ message: 'Status update failed.', type: 'error' });
    }
  };

  // Add Note Handler
  const handleAddNote = async (appId) => {
    if (!newNoteText.trim()) return;
    try {
      const reviewerName = cleanScholarName(user?.name) || 'Founder Lead';
      const updated = await addReviewerNote(appId, {
        text: newNoteText.trim(),
        author: reviewerName,
        authorRole: isFounder ? 'Founder & Admissions Lead' : 'Admissions Reviewer',
        rating: Number(newRating)
      });
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(updated);
      }
      setNewNoteText('');
      addToast({ message: 'Reviewer evaluation recorded.', type: 'success' });
    } catch (e) {
      addToast({ message: 'Failed to record note.', type: 'error' });
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (applications.length === 0) {
      addToast({ message: 'No applications to export.', type: 'info' });
      return;
    }
    const headers = [
      'Ref ID', 'Full Name', 'Email', 'Phone', 'College', 'Degree & Branch', 
      'Year', 'Track', 'Status', 'Rating', 'Applied At', 'LinkedIn', 'Portfolio', 'Why Join'
    ];
    const rows = applications.map(a => [
      `"${a.refId || ''}"`,
      `"${(a.fullName || '').replace(/"/g, '""')}"`,
      `"${a.email || ''}"`,
      `"${a.phone || ''}"`,
      `"${(a.collegeName || '').replace(/"/g, '""')}"`,
      `"${(a.degreeAndBranch || '').replace(/"/g, '""')}"`,
      `"${a.currentYearOfStudy || ''}"`,
      `"${a.preferredRoleTitle || a.preferredRole || ''}"`,
      `"${a.status || 'pending'}"`,
      `"${a.rating || 0}"`,
      `"${a.createdAt || ''}"`,
      `"${a.linkedinUrl || ''}"`,
      `"${a.portfolioOrWorkUrl || ''}"`,
      `"${(a.whyJoinLumixora || '').replace(/"/g, '""').substring(0, 150)}..."`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lumixora_Batch01_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ message: 'CSV exported successfully!', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#17172B] p-3 md:p-6 space-y-6">
      {/* Top Header & Live Status */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C4DFF] via-[#3878FF] to-[#22C7D9] flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg md:text-xl font-black font-sora tracking-tight text-slate-900">
                LUMIXORA Internship Program
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-[#6C4DFF] border border-violet-200 text-[10px] font-black uppercase tracking-wider">
                Batch 01
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isFounder ? `${applications.length} Live Candidates` : 'Batch 01 Open'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              A product of <strong className="text-slate-800">VYOMRA</strong> • <span className="italic text-[#6C4DFF]">Connecting the Future.</span> 6-Week Remote Cohort
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('apply')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'apply' || activeView === 'submitted' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Apply Form
            </button>
            <button
              onClick={() => setActiveView('tracker')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'tracker' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Track Status
            </button>
            <button
              onClick={() => setActiveView('workspace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'workspace' 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md' 
                  : 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Intern Workspace</span>
            </button>
            {isFounder && (
              <button
                onClick={() => setActiveView('submissions')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'submissions' 
                    ? 'bg-gradient-to-r from-[#6C4DFF] to-[#3878FF] text-white shadow-md' 
                    : 'text-violet-700 hover:bg-violet-50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Reviewer Board</span>
                {stats.total > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${activeView === 'submissions' ? 'bg-white/20 text-white' : 'bg-violet-200 text-violet-800'}`}>
                    {stats.total}
                  </span>
                )}
              </button>
            )}
          </div>

          {setActiveTab && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* VIEW: INTERN WORKSPACE & SUBPORTAL */}
      {activeView === 'workspace' && (
        <div className="max-w-7xl mx-auto animate-fade-in">
          <InternWorkspacePortal user={user} setActiveTab={setActiveTab} />
        </div>
      )}

      {/* VIEW: OVERVIEW */}
      {activeView === 'overview' && (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#17172B] via-[#1f1f3a] to-[#2b2b52] text-white p-6 md:p-10 shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#6C4DFF]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#22C7D9]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                Applications Open for Batch 01
              </span>
              <h2 className="text-2xl md:text-4xl font-black font-sora leading-tight">
                Shape the Future of Student Operating Systems.
              </h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
                Join Lumixora’s 6-week elite remote internship. Build real-world features, conduct high-impact research, test production platforms, and drive viral growth with direct mentorship from the Founding team.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveView('apply')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#6C4DFF] to-[#3878FF] hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-violet-500/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Apply Now for Batch 01</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {isFounder ? (
                  <button
                    onClick={() => setActiveView('submissions')}
                    className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-cyan-300" />
                    <span>View Reviewer Queue ({stats.total} Applied)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveView('tracker')}
                    className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-cyan-300" />
                    <span>Track Your Application</span>
                  </button>
                )}
              </div>

              {/* Highlights strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Duration</p>
                  <p className="text-sm font-black text-white">6 Weeks Remote</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Total Openings</p>
                  <p className="text-sm font-black text-cyan-300">10 Exclusive Seats</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Certification</p>
                  <p className="text-sm font-black text-white">Verified Proof-of-Skill</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Eligibility</p>
                  <p className="text-sm font-black text-emerald-300">B.Tech / Degree</p>
                </div>
              </div>
            </div>
          </div>

          {/* Role Cards Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 font-sora">Available Internship Tracks</h3>
                <p className="text-xs text-slate-500">Choose the track where you can create the highest impact</p>
              </div>
              <span className="text-xs font-bold text-[#6C4DFF]">{INTERNSHIP_ROLES.length} Specialized Tracks</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INTERNSHIP_ROLES.map(role => (
                <div key={role.id} className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-violet-300 shadow-sm transition-all space-y-4 relative flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-50 text-[#6C4DFF] border border-violet-200">
                        {role.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        {role.positions} Openings
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{role.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{role.summary}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Key Focus Areas</p>
                      <div className="flex flex-wrap gap-1.5">
                        {role.focusAreas.map(fa => (
                          <span key={fa} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {fa}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                      <strong className="text-slate-800 font-bold">Ideal Candidate: </strong>
                      {role.idealCandidate}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-500">
                      {applications.filter(a => a.preferredRole === role.id).length} applicants currently
                    </span>
                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, preferredRole: role.id }));
                        setActiveView('apply');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#6C4DFF] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Apply for this Track</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: APPLY FORM */}
      {activeView === 'apply' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-[#6C4DFF] text-[10px] font-black uppercase tracking-wider">
                Batch 01 Application Form
              </span>
              <h2 className="text-xl md:text-2xl font-black font-sora text-slate-900 mt-1">
                Apply for Lumixora Internship
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All submissions are synced directly with the Admissions Database. You will receive an instant Reference ID upon submission.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Personal Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">1. Candidate Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mythri Poludasu"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C4DFF]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. 249xa04137@gprec.ac.in"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C4DFF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp / Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C4DFF]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">City & State</label>
                    <input
                      type="text"
                      placeholder="e.g. Kurnool, Andhra Pradesh"
                      value={formData.cityAndState}
                      onChange={e => setFormData({ ...formData, cityAndState: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C4DFF]"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Background */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">2. Academic Background</h4>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">College / University *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. G. Pulla Reddy Engineering College"
                    value={formData.collegeName}
                    onChange={e => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C4DFF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Degree & Branch *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B.Tech - Computer Science & AIML"
                      value={formData.degreeAndBranch}
                      onChange={e => setFormData({ ...formData, degreeAndBranch: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C4DFF]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Current Year of Study *</label>
                    <select
                      value={formData.currentYearOfStudy}
                      onChange={e => setFormData({ ...formData, currentYearOfStudy: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C4DFF]"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Recent Graduate">Recent Graduate</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">3. Preferred Internship Track</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {INTERNSHIP_ROLES.map(role => {
                    const isSelected = formData.preferredRole === role.id;
                    return (
                      <div
                        key={role.id}
                        onClick={() => setFormData({ ...formData, preferredRole: role.id })}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-[#6C4DFF] bg-violet-50/60 shadow-sm' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{role.title}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-[#6C4DFF] border-[#6C4DFF] text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{role.summary}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Motivation & Skills */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">4. Motivation & Impact</h4>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Why do you want to join Lumixora? *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us what excites you about Lumixora and why you are enthusiastic about this track..."
                    value={formData.whyJoinLumixora}
                    onChange={e => setFormData({ ...formData, whyJoinLumixora: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C4DFF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Relevant Skills & Experience *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Mention languages, tools, frameworks, manual testing, market research, or past projects..."
                    value={formData.relevantSkills}
                    onChange={e => setFormData({ ...formData, relevantSkills: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C4DFF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">What do you hope to learn / achieve?</label>
                  <textarea
                    rows={2}
                    placeholder="Specific skills, real-world product knowledge, team collaboration..."
                    value={formData.hopeToLearn}
                    onChange={e => setFormData({ ...formData, hopeToLearn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C4DFF]"
                  />
                </div>
              </div>

              {/* Links & Availability */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">5. Links & Commitment</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedinUrl}
                      onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C4DFF]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Portfolio / GitHub / Work Link</label>
                    <input
                      type="url"
                      placeholder="https://github.com/... or portfolio"
                      value={formData.portfolioOrWorkUrl}
                      onChange={e => setFormData({ ...formData, portfolioOrWorkUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C4DFF]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.canCommitSixWeeks}
                      onChange={e => setFormData({ ...formData, canCommitSixWeeks: e.target.checked })}
                      className="rounded text-[#6C4DFF]"
                    />
                    <span>I confirm I can commit 15–20 hours/week for the 6-week remote duration.</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.confirmedAccurate}
                      onChange={e => setFormData({ ...formData, confirmedAccurate: e.target.checked })}
                      className="rounded text-[#6C4DFF]"
                    />
                    <span>All submitted details are accurate and true to the best of my knowledge.</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6C4DFF] via-[#3878FF] to-[#22C7D9] hover:opacity-95 text-white font-black text-sm shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting to Database...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Batch 01 Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW: SUBMITTED SUCCESS */}
      {activeView === 'submitted' && submittedRef && (
        <div className="max-w-xl mx-auto p-6 md:p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-5 shadow-lg animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              Application Successfully Logged
            </span>
            <h2 className="text-xl md:text-2xl font-black font-sora text-slate-900 pt-2">
              Welcome to Batch 01 Admissions!
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your application has been received and stored in the Admissions Database for evaluation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 text-center space-y-1">
            <p className="text-[11px] font-bold text-violet-600 uppercase tracking-wider">Your Official Reference ID</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl font-black font-mono text-[#6C4DFF]">{submittedRef.refId}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(submittedRef.refId);
                  addToast({ message: 'Reference ID copied to clipboard!', type: 'success' });
                }}
                className="p-1 rounded-lg hover:bg-violet-100 text-violet-700 transition-colors cursor-pointer"
                title="Copy Reference ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500">Keep this ID safe to track your application review stage.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={() => {
                setTrackQuery(submittedRef.refId);
                setActiveView('tracker');
                setTimeout(() => handleTrackSearch(), 100);
              }}
              className="flex-1 py-3 rounded-xl bg-[#6C4DFF] text-white font-bold text-xs hover:bg-violet-700 transition-all cursor-pointer shadow-sm"
            >
              Track Application Status
            </button>
            <button
              onClick={() => setActiveView('overview')}
              className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
            >
              Return to Overview
            </button>
          </div>
        </div>
      )}

      {/* VIEW: TRACKER */}
      {activeView === 'tracker' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-[#6C4DFF] text-[10px] font-black uppercase tracking-wider">
                Live Status Tracker
              </span>
              <h2 className="text-xl font-black font-sora text-slate-900 mt-1">
                Track Your Batch 01 Application
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your Reference ID (e.g. <code>LMX-B01-4783</code>) or official email address.
              </p>
            </div>

            <form onSubmit={handleTrackSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter Reference ID (LMX-B01-XXXX) or Email..."
                  value={trackQuery}
                  onChange={e => setTrackQuery(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C4DFF]"
                />
              </div>
              <button
                type="submit"
                disabled={trackingLoading}
                className="px-5 py-2.5 rounded-xl bg-[#6C4DFF] hover:bg-violet-700 text-white font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {trackingLoading ? 'Checking...' : 'Check Status'}
              </button>
            </form>

            {/* Results display */}
            {trackSearched && !trackingLoading && (
              trackedApp ? (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{trackedApp.fullName}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{trackedApp.refId} • {trackedApp.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      trackedApp.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      trackedApp.status === 'shortlisted' ? 'bg-cyan-100 text-cyan-800 border border-cyan-300' :
                      trackedApp.status === 'reviewing' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      trackedApp.status === 'rejected' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {trackedApp.status || 'Pending'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Applied Track</span>
                      <strong className="text-slate-800">{trackedApp.preferredRoleTitle || trackedApp.preferredRole}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">College / Branch</span>
                      <strong className="text-slate-800">{trackedApp.collegeName} ({trackedApp.degreeAndBranch})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Submitted Date</span>
                      <strong className="text-slate-800 font-mono text-[11px]">
                        {trackedApp.createdAt ? new Date(trackedApp.createdAt).toLocaleDateString() : 'N/A'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Cohort</span>
                      <strong className="text-[#6C4DFF]">Batch 01 (6 Weeks)</strong>
                    </div>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="pt-2 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admissions Pipeline</p>
                    <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                        1. Submitted
                      </div>
                      <div className={`p-1.5 rounded-lg border ${
                        ['reviewing', 'shortlisted', 'accepted'].includes(trackedApp.status)
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        2. Under Review
                      </div>
                      <div className={`p-1.5 rounded-lg border ${
                        ['shortlisted', 'accepted'].includes(trackedApp.status)
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        3. Shortlisted
                      </div>
                      <div className={`p-1.5 rounded-lg border ${
                        trackedApp.status === 'accepted'
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : trackedApp.status === 'rejected'
                          ? 'bg-rose-100 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        4. {trackedApp.status === 'accepted' ? 'Accepted' : trackedApp.status === 'rejected' ? 'Declined' : 'Decision'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">No application found matching "{trackQuery}".</p>
                  <p className="text-[11px] text-slate-500">Please double check your Reference ID or email address.</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* VIEW: SUBMISSIONS / REVIEWER BOARD (FOUNDER ONLY) */}
      {activeView === 'submissions' && isFounder && (
        <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
          {/* Header & Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Applicants</span>
              <span className="text-2xl font-black font-sora text-slate-900">{stats.total}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">Pending</span>
              <span className="text-2xl font-black font-sora text-amber-600">{stats.pending}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block">Reviewing</span>
              <span className="text-2xl font-black font-sora text-blue-600">{stats.reviewing}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-cyan-500 uppercase tracking-wider block">Shortlisted</span>
              <span className="text-2xl font-black font-sora text-cyan-600">{stats.shortlisted}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider block">Accepted</span>
              <span className="text-2xl font-black font-sora text-emerald-600">{stats.accepted}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block">Declined</span>
              <span className="text-2xl font-black font-sora text-rose-600">{stats.rejected}</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 flex-1 w-full flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, refId, college..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-[#6C4DFF]"
                />
              </div>

              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700"
              >
                <option value="all">All Tracks ({stats.total})</option>
                <option value="software_testing">Software Testing ({stats.trackCounts.software_testing})</option>
                <option value="research">Research ({stats.trackCounts.research})</option>
                <option value="marketing">Marketing ({stats.trackCounts.marketing})</option>
                <option value="content_creation">Content Creation ({stats.trackCounts.content_creation})</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Applications Table */}
          <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-3">Track</th>
                    <th className="py-3 px-3">College & Degree</th>
                    <th className="py-3 px-3">Submitted</th>
                    <th className="py-3 px-3">Rating</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-medium">
                        No applications matching the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map(app => (
                      <tr key={app.id} className="hover:bg-violet-50/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-extrabold text-slate-900 block">{app.fullName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{app.refId} • {app.email}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded-lg bg-violet-100 text-[#6C4DFF] font-bold text-[10px] uppercase">
                            {app.preferredRoleTitle || app.preferredRole}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="max-w-[200px] truncate">
                            <span className="text-slate-800 font-medium block truncate">{app.collegeName}</span>
                            <span className="text-[11px] text-slate-400 truncate">{app.degreeAndBranch} ({app.currentYearOfStudy})</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-[11px] text-slate-500 font-mono">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map(st => (
                              <Star
                                key={st}
                                className={`w-3 h-3 ${st <= (app.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <select
                            value={app.status || 'pending'}
                            onChange={e => handleStatusChange(app.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase border cursor-pointer ${
                              app.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              app.status === 'shortlisted' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                              app.status === 'reviewing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              app.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#6C4DFF] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                            >
                              Inspect
                            </button>
                            <a
                              href={`mailto:${app.email}?subject=Lumixora%20Internship%20Batch%2001%20Application%20Update`}
                              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                              title="Send Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* INSPECT CANDIDATE MODAL */}
          {selectedApp && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  ✕
                </button>

                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-[#6C4DFF] text-[10px] font-black uppercase">
                    {selectedApp.refId}
                  </span>
                  <h3 className="text-xl font-black font-sora text-slate-900">{selectedApp.fullName}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedApp.email} • {selectedApp.phone} • {selectedApp.cityAndState}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Track</span>
                    <strong className="text-xs text-slate-800">{selectedApp.preferredRoleTitle || selectedApp.preferredRole}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">College</span>
                    <strong className="text-xs text-slate-800 truncate block">{selectedApp.collegeName}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Branch & Year</span>
                    <strong className="text-xs text-slate-800">{selectedApp.degreeAndBranch} ({selectedApp.currentYearOfStudy})</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Availability</span>
                    <strong className="text-xs text-slate-800">{selectedApp.hoursPerWeek}</strong>
                  </div>
                </div>

                {/* Candidate Answers */}
                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-700">Why Lumixora?</h5>
                    <p className="p-3 rounded-2xl bg-slate-50 text-slate-600 mt-1 leading-relaxed">
                      {selectedApp.whyJoinLumixora || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-700">Relevant Skills & Experience</h5>
                    <p className="p-3 rounded-2xl bg-slate-50 text-slate-600 mt-1 leading-relaxed">
                      {selectedApp.relevantSkills || 'Not specified'}
                    </p>
                  </div>

                  {selectedApp.hopeToLearn && (
                    <div>
                      <h5 className="font-bold text-slate-700">Hope to Learn / Goals</h5>
                      <p className="p-3 rounded-2xl bg-slate-50 text-slate-600 mt-1 leading-relaxed">
                        {selectedApp.hopeToLearn}
                      </p>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-2 pt-1 flex-wrap">
                    {selectedApp.linkedinUrl && (
                      <a
                        href={selectedApp.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.22a1.64 1.64 0 0 0-1.66 1.63 1.64 1.64 0 0 0 1.66 1.64 1.63 1.63 0 0 0 1.63-1.64c0-.9-.73-1.63-1.63-1.63z"/></svg>
                        <span>LinkedIn Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedApp.portfolioOrWorkUrl && (
                      <a
                        href={selectedApp.portfolioOrWorkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-violet-50 text-[#6C4DFF] hover:bg-violet-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Work / Portfolio</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Evaluator Notes & Rating */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 pt-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">Evaluator Assessment</h5>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setNewRating(st)}
                          className="cursor-pointer"
                        >
                          <Star className={`w-4 h-4 ${st <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an evaluation note or feedback..."
                      value={newNoteText}
                      onChange={e => setNewNoteText(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-[#6C4DFF]"
                    />
                    <button
                      onClick={() => handleAddNote(selectedApp.id)}
                      className="px-4 py-2 rounded-xl bg-[#6C4DFF] text-white text-xs font-bold hover:bg-violet-700 transition-all cursor-pointer"
                    >
                      Save Note
                    </button>
                  </div>

                  {selectedApp.reviewerNotes && selectedApp.reviewerNotes.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      {selectedApp.reviewerNotes.map(n => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex justify-between items-start">
                          <div>
                            <strong className="text-slate-800">{n.author} ({n.authorRole}): </strong>
                            <span className="text-slate-600">{n.text}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-500">Decision:</span>
                    <select
                      value={selectedApp.status || 'pending'}
                      onChange={e => handleStatusChange(selectedApp.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await convertApplicationToIntern(selectedApp);
                          handleStatusChange(selectedApp.id, 'accepted');
                          addToast({ message: `${selectedApp.fullName} successfully registered to Lumixora Interns Roster!`, type: 'success' });
                        } catch (err) {
                          addToast({ message: `Onboard notice: ${err.message}`, type: 'error' });
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Onboard to Interns Roster</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
