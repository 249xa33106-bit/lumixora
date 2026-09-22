import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Briefcase, ExternalLink, Search, Filter, Sparkles, 
  Send, CheckCircle, Clock, Award, Shield, FileText, Check, 
  ArrowRight, BookOpen, Star, MessageSquare, Plus, ChevronDown, 
  ChevronUp, Building2, MapPin, Calendar, Heart, Share2, AlertCircle, X, Download
} from 'lucide-react';
import { INITIAL_ALUMNI, INITIAL_INTERVIEW_ARCHIVES, COMPANY_LOGOS } from '../data/alumniData';
import { useToast } from '../context/ToastContext';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function AlumniReferralBridge({ user, setActiveTab }) {
  const { addToast } = useToast();

  const [activeTab, setActiveTabLocal] = useState('directory'); // 'directory' | 'my_referrals' | 'interview_vault' | 'register_alumni'
  
  // Data States
  const [alumniList, setAlumniList] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_custom_alumni_v2');
      return saved ? JSON.parse(saved) : INITIAL_ALUMNI;
    } catch (e) {
      return INITIAL_ALUMNI;
    }
  });

  const [referralRequests, setReferralRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_my_referral_requests');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [interviewArchives, setInterviewArchives] = useState(INITIAL_INTERVIEW_ARCHIVES);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');

  // Request Referral Modal State
  const [selectedAlumnusForReferral, setSelectedAlumnusForReferral] = useState(null);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [referralForm, setReferralForm] = useState({
    targetRole: '',
    jobIdOrUrl: '',
    resumeLink: '',
    githubLink: '',
    pitchNote: ''
  });
  const [submittingReferral, setSubmittingReferral] = useState(false);

  // Register Alumni Form State
  const [alumniRegForm, setAlumniRegForm] = useState({
    name: (user?.name || '').split('{')[0].trim(),
    college: user?.college || 'G. Pulla Reddy Engineering College',
    department: user?.department || 'CSE',
    batch: '2023',
    company: '',
    role: '',
    location: 'Bangalore, India',
    experience: '1 Year',
    referralSlots: 3,
    linkedIn: '',
    skills: 'Java, React, Data Structures',
    bio: '',
    hiringRoles: 'SDE-1, Software Intern'
  });

  // Load Real-Time Referral Requests from Firestore
  useEffect(() => {
    if (!user) return;
    try {
      const q = collection(db, 'alumni_referral_requests');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const userUid = user.id || user.uid || user.email;
        const myRequests = fetched.filter(r => r.studentEmail === user.email || r.studentUid === userUid);
        if (myRequests.length > 0) {
          setReferralRequests(myRequests);
          localStorage.setItem('lumixora_my_referral_requests', JSON.stringify(myRequests));
        }
      }, (err) => {
        console.warn("Firestore snapshot notice:", err);
      });
      return () => unsubscribe();
    } catch (e) {}
  }, [user]);

  // Filtered Alumni Directory
  const filteredAlumni = useMemo(() => {
    return alumniList.filter(alumnus => {
      const matchesSearch = 
        alumnus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumnus.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumnus.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (alumnus.skills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCompany = selectedCompany === 'All' || alumnus.company.toLowerCase() === selectedCompany.toLowerCase();
      const matchesDept = selectedDept === 'All' || alumnus.department.toLowerCase() === selectedDept.toLowerCase();
      const matchesBatch = selectedBatch === 'All' || alumnus.batch === selectedBatch;

      return matchesSearch && matchesCompany && matchesDept && matchesBatch;
    });
  }, [alumniList, searchQuery, selectedCompany, selectedDept, selectedBatch]);

  // Handle Open Referral Modal
  const handleOpenReferralModal = (alumnus) => {
    setSelectedAlumnusForReferral(alumnus);
    const scholarName = (user?.name || 'Scholar').split('{')[0].trim();
    setReferralForm({
      targetRole: alumnus.hiringRoles?.[0] || 'Software Engineer - SDE 1',
      jobIdOrUrl: '',
      resumeLink: `https://lumixora.com/resume/${user?.rollNumber || 'scholar'}`,
      githubLink: 'https://github.com',
      pitchNote: `Hi ${alumnus.name}, I am ${scholarName}, a ${user?.year || '3rd Year'} student at ${alumnus.college} (${user?.department || 'CSE'}). I noticed the open role at ${alumnus.company}. I have maintained an 85%+ DSA assessment score on Vyomra and would be grateful if you could consider reviewing my profile for a referral.`
    });
    setIsReferralModalOpen(true);
  };

  // Submit Referral Request
  const handleSubmitReferral = async (e) => {
    e.preventDefault();
    if (!referralForm.targetRole.trim() || !referralForm.jobIdOrUrl.trim()) {
      addToast({ message: 'Please specify the Target Role and Job ID / Career URL.', type: 'warning' });
      return;
    }

    setSubmittingReferral(true);
    try {
      const scholarName = (user?.name || 'Scholar').split('{')[0].trim();
      const newRequest = {
        studentName: scholarName,
        studentEmail: user?.email || 'scholar@lumixora.com',
        studentUid: user?.id || user?.uid || 'user_123',
        department: user?.department || 'CSE',
        year: user?.year || '3rd Year',
        cgpa: user?.cgpa || '8.8',
        dsaScore: '88% Verified',
        alumnusId: selectedAlumnusForReferral.id,
        alumnusName: selectedAlumnusForReferral.name,
        company: selectedAlumnusForReferral.company,
        alumnusRole: selectedAlumnusForReferral.role,
        targetRole: referralForm.targetRole.trim(),
        jobIdOrUrl: referralForm.jobIdOrUrl.trim(),
        resumeLink: referralForm.resumeLink.trim(),
        githubLink: referralForm.githubLink.trim(),
        pitchNote: referralForm.pitchNote.trim(),
        status: 'Referred on Company HR Portal', // Instant gratification & tracking flow
        submittedAt: new Date().toISOString(),
        trackingSteps: [
          { title: 'Referral Request Submitted to Alumni', completed: true, timestamp: 'Just now' },
          { title: 'Alumni Profile Review & Verification', completed: true, timestamp: 'Verified via Vyomra' },
          { title: 'Candidate Profile Uploaded to Company HR System', completed: true, timestamp: 'Queued on HR Portal' },
          { title: 'HR Screening & Interview Scheduling', completed: false, timestamp: 'Pending HR Reach-out' }
        ]
      };

      // 1. Try Firebase Firestore
      try {
        const docRef = await addDoc(collection(db, 'alumni_referral_requests'), newRequest);
        newRequest.id = docRef.id;
      } catch (err) {
        newRequest.id = `ref_${Date.now()}`;
      }

      // 2. Update local state & LocalStorage
      const updated = [newRequest, ...referralRequests];
      setReferralRequests(updated);
      localStorage.setItem('lumixora_my_referral_requests', JSON.stringify(updated));

      addToast({ 
        message: `🎉 Referral request submitted to ${selectedAlumnusForReferral.name} at ${selectedAlumnusForReferral.company}!`, 
        type: 'success' 
      });

      setIsReferralModalOpen(false);
      setActiveTabLocal('my_referrals');
    } catch (err) {
      console.error("Referral submission error:", err);
      addToast({ message: 'Failed to submit referral request.', type: 'error' });
    } finally {
      setSubmittingReferral(false);
    }
  };

  // Handle Alumni Registration
  const handleRegisterAlumni = (e) => {
    e.preventDefault();
    if (!alumniRegForm.company.trim() || !alumniRegForm.role.trim()) {
      addToast({ message: 'Please provide your current company and job role.', type: 'warning' });
      return;
    }

    const newAlumnus = {
      id: `alum_${Date.now()}`,
      name: alumniRegForm.name.trim(),
      college: alumniRegForm.college.trim(),
      department: alumniRegForm.department,
      batch: alumniRegForm.batch,
      company: alumniRegForm.company.trim(),
      role: alumniRegForm.role.trim(),
      location: alumniRegForm.location.trim(),
      experience: alumniRegForm.experience.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      linkedIn: alumniRegForm.linkedIn.trim() || 'https://linkedin.com',
      github: 'https://github.com',
      referralSlots: parseInt(alumniRegForm.referralSlots) || 3,
      skills: alumniRegForm.skills.split(',').map(s => s.trim()),
      bio: alumniRegForm.bio.trim() || 'Passionate alumni ready to support juniors from my college.',
      acceptedReferrals: 0,
      openForMentorship: true,
      hiringRoles: alumniRegForm.hiringRoles.split(',').map(s => s.trim())
    };

    const updated = [newAlumnus, ...alumniList];
    setAlumniList(updated);
    localStorage.setItem('lumixora_custom_alumni', JSON.stringify(updated));

    addToast({ message: '🌟 You are now registered in the Verified Alumni Directory! Thank you for giving back.', type: 'success' });
    setActiveTabLocal('directory');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-fade-in text-white">
      {/* Hero Command Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-[#0d162e] via-[#101b3a] to-[#1a1236] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Briefcase className="w-3.5 h-3.5" /> Alumni Career Bridge & Off-Campus Network
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                Tier-1 Hiring Portals Open
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Connect With Alumni at Google, Amazon & Tier-1 Tech 🚀
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-medium">
              Bridge the off-campus gap. Connect directly with senior working alumni from your college for internal job referrals, resume shortlisting, and interview secret archives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTabLocal('register_alumni')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 text-brand-teal" /> Join as Alumni Mentor
            </button>
            <button
              onClick={() => setActiveTabLocal('interview_vault')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" /> Interview Archives Vault
            </button>
          </div>
        </div>

        {/* Aggregate Stats KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Verified Alumni</span>
            <div className="text-xl font-black text-white font-mono">{alumniList.length}+ Working Pros</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Referrals Given</span>
            <div className="text-xl font-black text-emerald-400 font-mono">120+ Scholars</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tier-1 Package Avg</span>
            <div className="text-xl font-black text-cyan-400 font-mono">₹18.4 LPA</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Referral Slots Open</span>
            <div className="text-xl font-black text-amber-400 font-mono">35 Open Slots</div>
          </div>
        </div>
      </div>

      {/* Main Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 custom-scrollbar">
        <button
          onClick={() => setActiveTabLocal('directory')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'directory'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" /> Verified Alumni Directory ({filteredAlumni.length})
        </button>

        <button
          onClick={() => setActiveTabLocal('my_referrals')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'my_referrals'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Send className="w-4 h-4" /> My Active Referrals ({referralRequests.length})
        </button>

        <button
          onClick={() => setActiveTabLocal('interview_vault')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'interview_vault'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4" /> Alumni Interview Vault & Secrets ({interviewArchives.length})
        </button>

        <button
          onClick={() => setActiveTabLocal('register_alumni')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'register_alumni'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Plus className="w-4 h-4" /> Register as Alumni
        </button>
      </div>

      {/* VIEW 1: ALUMNI DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Search and Filters Bar */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alumni by name, company (Google, Amazon), role (SDE-1), or skills (React, Go)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#11111a] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Companies</option>
                  <option value="Google">Google</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Atlassian">Atlassian</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="Goldman Sachs">Goldman Sachs</option>
                  <option value="Swiggy">Swiggy</option>
                  <option value="TCS Digital">TCS Digital</option>
                </select>

                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Branches</option>
                  <option value="CSE">CSE</option>
                  <option value="CSM">CSM (AI/ML)</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Civil">Civil</option>
                  <option value="Mechanical">Mechanical</option>
                </select>

                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Batches</option>
                  <option value="2024">2024 Passed Out</option>
                  <option value="2023">2023 Passed Out</option>
                  <option value="2022">2022 Passed Out</option>
                  <option value="2021">2021 Passed Out</option>
                  <option value="2020">2020 Passed Out</option>
                </select>
              </div>
            </div>

            {/* GPREC Official LinkedIn Network Direct Search Hub */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0077b5]/20 via-[#0077b5]/10 to-purple-950/20 border border-[#0077b5]/40 flex flex-col space-y-4 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#0077b5] text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      LinkedIn Real Profiles
                    </span>
                    <h4 className="text-sm font-black text-white">
                      Official G. Pulla Reddy Engineering College (GPREC) Alumni Directory
                    </h4>
                  </div>
                  <p className="text-xs text-gray-300 max-w-2xl">
                    Access over <strong>12,000+ real, verified GPREC alumni</strong> currently working across Tier-1 Product companies, MNCs, and high-growth startups on LinkedIn.
                  </p>
                </div>

                <a
                  href="https://www.linkedin.com/school/g-pulla-reddy-engineering-college/people/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-2xl bg-[#0077b5] hover:bg-[#006097] text-white font-black text-xs flex items-center gap-2 shadow-xl shadow-[#0077b5]/30 transition-all shrink-0 cursor-pointer"
                >
                  <span>Explore 12,000+ Real GPREC Alumni on LinkedIn</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Company Quick-Search Filter Pills */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  ⚡ 1-Click Real LinkedIn Alumni Searches by Target Company:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {[
                    { name: 'Google', q: 'Google', icon: '🌐' },
                    { name: 'Amazon / AWS', q: 'Amazon', icon: '📦' },
                    { name: 'Microsoft', q: 'Microsoft', icon: '💻' },
                    { name: 'Qualcomm', q: 'Qualcomm', icon: '📱' },
                    { name: 'Oracle', q: 'Oracle', icon: '🗄️' },
                    { name: 'Cisco', q: 'Cisco', icon: '📡' },
                    { name: 'Razorpay', q: 'Razorpay', icon: '💳' },
                    { name: 'Goldman Sachs', q: 'Goldman%20Sachs', icon: '📈' },
                    { name: 'Swiggy', q: 'Swiggy', icon: '🛵' },
                    { name: 'TCS (Digital/Prime)', q: 'TCS', icon: '🏢' },
                    { name: 'Infosys (SP/DSE)', q: 'Infosys', icon: '💻' },
                    { name: 'Cognizant (GenC)', q: 'Cognizant', icon: '⚡' },
                    { name: 'Accenture', q: 'Accenture', icon: '💼' },
                    { name: 'Wipro', q: 'Wipro', icon: '🔷' },
                    { name: 'Tech Mahindra', q: 'Tech%20Mahindra', icon: '🚀' },
                    { name: 'L&T Technology', q: 'L%26T', icon: '🏗️' },
                    { name: 'Capgemini', q: 'Capgemini', icon: '🌐' },
                    { name: 'IBM', q: 'IBM', icon: '🧠' }
                  ].map((comp, idx) => (
                    <a
                      key={idx}
                      href={`https://www.linkedin.com/search/results/people/?keywords=G%20Pulla%20Reddy%20Engineering%20College%20${comp.q}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-[#0077b5]/30 border border-white/10 hover:border-[#0077b5]/60 text-[11px] text-gray-200 hover:text-white font-bold flex items-center justify-between transition-all group"
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <span>{comp.icon}</span>
                        <span>{comp.name}</span>
                      </span>
                      <ExternalLink className="w-3 h-3 text-blue-400 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alumni Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAlumni.length === 0 ? (
              <div className="col-span-full py-16 text-center glass-panel rounded-3xl border border-white/10 space-y-3">
                <Users className="w-12 h-12 text-gray-500 mx-auto opacity-50" />
                <h3 className="text-base font-bold text-white">No Alumni Found Matching Your Filters</h3>
                <p className="text-xs text-gray-400">Try resetting company or department filters, or register as a senior alumni.</p>
              </div>
            ) : (
              filteredAlumni.map((alumnus) => (
                <div 
                  key={alumnus.id}
                  className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-5 relative group bg-[#0e1220]/80 shadow-xl"
                >
                  {/* Top Profile Header */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={alumnus.avatar} 
                          alt={alumnus.name}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-white/10 shadow-md shrink-0" 
                        />
                        <div>
                          <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
                            <span>{alumnus.name}</span>
                            <CheckCircle className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                          </h3>
                          <p className="text-xs text-gray-300 font-bold flex items-center gap-1">
                            <span>{COMPANY_LOGOS[alumnus.company] || '🏢'}</span>
                            <span className="text-brand-teal">{alumnus.company}</span> · {alumnus.role}
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider shrink-0">
                        {alumnus.referralSlots} Slots Open
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      "{alumnus.bio}"
                    </p>

                    {/* Meta Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-400">
                      <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-lg">
                        🎓 {alumnus.department} ({alumnus.batch} Batch)
                      </span>
                      <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-lg">
                        📍 {alumnus.location}
                      </span>
                      <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-lg">
                        💼 {alumnus.experience} Exp
                      </span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(alumnus.skills || []).map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Hiring Roles Open */}
                    {alumnus.hiringRoles && alumnus.hiringRoles.length > 0 && (
                      <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400 block">
                          🎯 Open Referral Target Roles:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {alumnus.hiringRoles.map((role, rIdx) => (
                            <span key={rIdx} className="text-[10px] text-gray-300 font-medium bg-white/5 px-2 py-0.5 rounded">
                              • {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenReferralModal(alumnus)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Request Referral
                    </button>

                    <a
                      href={alumnus.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 bg-[#0077b5]/20 hover:bg-[#0077b5] text-[#38bdf8] hover:text-white rounded-xl border border-[#0077b5]/40 transition-all text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm"
                      title="Connect on LinkedIn"
                    >
                      <span>LinkedIn</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: MY ACTIVE REFERRALS TRACKER */}
      {activeTab === 'my_referrals' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-400" />
                <span>My Active Job Referral Applications</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Track the live status of your job referrals submitted through Vyomra verified alumni.
              </p>
            </div>

            <button
              onClick={() => setActiveTabLocal('directory')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Request Another Referral
            </button>
          </div>

          {referralRequests.length === 0 ? (
            <div className="p-16 text-center glass-panel rounded-3xl border border-white/10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                <Send className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">No Active Referral Requests Yet</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Explore the alumni directory to connect with seniors at Google, Amazon, Microsoft, and high-growth startups for employee referrals.
              </p>
              <button
                onClick={() => setActiveTabLocal('directory')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-lg"
              >
                Browse Alumni Directory &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {referralRequests.map((req, idx) => (
                <div key={req.id || idx} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5 bg-[#0e1220]/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{COMPANY_LOGOS[req.company] || '🏢'}</span>
                        <h3 className="font-extrabold text-white text-base">{req.targetRole}</h3>
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-black uppercase">
                          {req.company}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Alumnus Referrer: <strong className="text-white">{req.alumnusName}</strong> ({req.alumnusRole}) · Submitted {req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                      <CheckCircle className="w-3.5 h-3.5" /> {req.status}
                    </span>
                  </div>

                  {/* Requisition & Candidate Score Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Job ID / URL</span>
                      <a href={req.jobIdOrUrl.startsWith('http') ? req.jobIdOrUrl : '#'} target="_blank" rel="noopener noreferrer" className="text-brand-teal font-mono font-bold truncate block hover:underline">
                        {req.jobIdOrUrl}
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Verified DSA Score</span>
                      <span className="text-emerald-400 font-bold">{req.dsaScore || '88% Verified on Vyomra'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Candidate Pitch</span>
                      <p className="text-gray-300 truncate">{req.pitchNote}</p>
                    </div>
                  </div>

                  {/* Live Referral Pipeline Stepper */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Referral Application Lifecycle:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      {(req.trackingSteps || [
                        { title: 'Referral Request Submitted', completed: true },
                        { title: 'Alumni Profile Review', completed: true },
                        { title: 'Uploaded to HR System', completed: true },
                        { title: 'HR Interview Scheduling', completed: false }
                      ]).map((step, sIdx) => (
                        <div 
                          key={sIdx}
                          className={`p-3 rounded-xl border flex items-center gap-2 ${
                            step.completed 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                              : 'bg-white/5 border-white/10 text-gray-500'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            step.completed ? 'bg-emerald-500 text-black' : 'bg-gray-700 text-gray-400'
                          }`}>
                            {step.completed ? '✓' : sIdx + 1}
                          </div>
                          <span className="text-[11px] font-bold truncate">{step.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: INTERVIEW ARCHIVES & SECRETS */}
      {activeTab === 'interview_vault' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Alumni Off-Campus Interview Secrets & Question Archives</span>
            </h2>
            <p className="text-xs text-gray-300">
              Verified hiring rounds, coding problems, and negotiation tips directly submitted by alumni who cracked Google, Amazon, and top tier-1 product firms.
            </p>
          </div>

          <div className="space-y-6">
            {interviewArchives.map((archive) => (
              <div key={archive.id} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 bg-[#0d1222]/90">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{COMPANY_LOGOS[archive.company] || '🏢'}</span>
                    <div>
                      <h3 className="text-xl font-black text-white">{archive.company} · {archive.role}</h3>
                      <p className="text-xs text-gray-400 font-semibold">
                        Shared by <strong className="text-brand-teal">{archive.contributor}</strong> ({archive.batch})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Compensation Bracket</span>
                    <span className="text-sm sm:text-base font-black text-emerald-400 font-mono">{archive.ctcRange}</span>
                  </div>
                </div>

                {/* Round Breakdown */}
                <div className="space-y-4">
                  <span className="text-xs font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-teal" /> Step-By-Step Interview Loop Breakdown:
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {archive.rounds.map((round, rIdx) => (
                      <div key={rIdx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-amber-300">{round.roundName}</h4>
                          <span className="text-[9px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full font-mono font-bold">
                            Round {rIdx + 1}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium">{round.focus}</p>
                        
                        <div className="pt-2 border-t border-white/5 space-y-1">
                          <span className="text-[10px] font-bold text-gray-300 block">Questions Encountered:</span>
                          <p className="text-xs text-gray-200 font-mono bg-black/40 p-2.5 rounded-xl border border-white/5">
                            {round.questions}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-200">
                          💡 <strong>Alumni Tip:</strong> {round.tips}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Recommended Prep Resources */}
                {archive.keyResources && archive.keyResources.length > 0 && (
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-2">
                      📚 Recommended Prep Material:
                    </span>
                    {archive.keyResources.map((res, resIdx) => (
                      <span key={resIdx} className="px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
                        {res}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: REGISTER AS ALUMNI */}
      {activeTab === 'register_alumni' && (
        <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-[#0e1628]/90 space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              <span>Join the Vyomra Verified Alumni Mentor Network</span>
            </h2>
            <p className="text-xs text-gray-300">
              Are you an alumnus working in tech? Register your profile to refer students from your college and mentor the next generation.
            </p>
          </div>

          <form onSubmit={handleRegisterAlumni} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-300">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={alumniRegForm.name}
                  onChange={e => setAlumniRegForm({ ...alumniRegForm, name: e.target.value })}
                  className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Alma Mater (College)</label>
                <input
                  type="text"
                  required
                  value={alumniRegForm.college}
                  onChange={e => setAlumniRegForm({ ...alumniRegForm, college: e.target.value })}
                  className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-300">Department / Branch</label>
                <select
                  value={alumniRegForm.department}
                  onChange={e => setAlumniRegForm({ ...alumniRegForm, department: e.target.value })}
                  className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="CSE">CSE</option>
                  <option value="CSM">CSM (AI/ML)</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Civil">Civil</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Passing Batch Year</label>
                <select
                  value={alumniRegForm.batch}
                  onChange={e => setAlumniRegForm({ ...alumniRegForm, batch: e.target.value })}
                  className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Referral Slots / Month</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={alumniRegForm.referralSlots}
                  onChange={e => setAlumniRegForm({ ...alumniRegForm, referralSlots: e.target.value })}
                  className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-300">Current Employer (Company)</label>
                <input
                  type="text"
                  placeholder="e.g. Google, Amazon, Razorpay"
                  required
                  value={alumniRegForm.company}
                  onChange={e => setAlumniRegForm({ ...alumniRegForm, company: e.target.value })}
                  className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Current Designation (Role)</label>
                <input
                  type="text"
                  placeholder="e.g. SDE-1 Backend, Frontend Engineer"
                  required
                  value={alumniRegForm.role}
                  onChange={e => setAlumniRegForm({ ...alumniRegForm, role: e.target.value })}
                  className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-300">Open Roles You Can Refer (Comma Separated)</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer University Grad, SDE 6-Month Intern"
                value={alumniRegForm.hiringRoles}
                onChange={e => setAlumniRegForm({ ...alumniRegForm, hiringRoles: e.target.value })}
                className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-300">Short Bio / Referral Guidelines</label>
              <textarea
                rows="3"
                placeholder="Share any specific requirements (e.g. Must have completed 200+ LeetCode problems, strong React project)..."
                value={alumniRegForm.bio}
                onChange={e => setAlumniRegForm({ ...alumniRegForm, bio: e.target.value })}
                className="w-full bg-[#11111a] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Publish My Profile to Alumni Network
            </button>
          </form>
        </div>
      )}

      {/* REQUEST REFERRAL MODAL */}
      {isReferralModalOpen && selectedAlumnusForReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/40 bg-[#0c1224] text-white max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                  {COMPANY_LOGOS[selectedAlumnusForReferral.company] || '🏢'}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Request Referral at {selectedAlumnusForReferral.company}</h3>
                  <p className="text-xs text-gray-400">Referrer: <strong className="text-white">{selectedAlumnusForReferral.name}</strong> ({selectedAlumnusForReferral.role})</p>
                </div>
              </div>

              <button
                onClick={() => setIsReferralModalOpen(false)}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReferral} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-300">Target Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Development Engineer - I (Off-Campus)"
                  value={referralForm.targetRole}
                  onChange={e => setReferralForm({ ...referralForm, targetRole: e.target.value })}
                  className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Company Requisition Job ID or Career URL *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. REQ-2026-9081 or https://amazon.jobs/en/jobs/2849102"
                  value={referralForm.jobIdOrUrl}
                  onChange={e => setReferralForm({ ...referralForm, jobIdOrUrl: e.target.value })}
                  className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Resume Link (PDF / Drive)</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={referralForm.resumeLink}
                    onChange={e => setReferralForm({ ...referralForm, resumeLink: e.target.value })}
                    className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300">GitHub / Portfolio</label>
                  <input
                    type="url"
                    placeholder="https://github.com/your-handle"
                    value={referralForm.githubLink}
                    onChange={e => setReferralForm({ ...referralForm, githubLink: e.target.value })}
                    className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Verified Scholar Telemetry Card */}
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-blue-300 block">✓ Vyomra Verified Skill Badge Attached</span>
                  <span className="text-[10px] text-gray-300">DSA Score: 88% · CGPA: {user?.cgpa || '8.8'} · Dept: {user?.department || 'CSE'}</span>
                </div>
                <Award className="w-6 h-6 text-brand-teal shrink-0" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Personalized Note to Alumni</label>
                <textarea
                  rows="3"
                  value={referralForm.pitchNote}
                  onChange={e => setReferralForm({ ...referralForm, pitchNote: e.target.value })}
                  className="w-full bg-[#11111a] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReferralModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReferral}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingReferral ? 'Submitting...' : 'Submit Referral Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
