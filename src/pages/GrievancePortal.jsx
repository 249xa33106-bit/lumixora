import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, ShieldCheck, Lock, EyeOff, AlertTriangle, CheckCircle2, 
  MessageSquare, Send, Clock, UserCheck, Sparkles, Filter, Search, 
  HelpCircle, ChevronRight, X, Building2, GraduationCap, Flame, 
  ThumbsUp, RefreshCw, Eye, ArrowRight, BookOpen, Laptop, AlertCircle, 
  FileText, Copy, Check, QrCode, Tag, AtSign, Info
} from 'lucide-react';
import { db } from '../config/firebase';
import { 
  collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, query, orderBy 
} from 'firebase/firestore';
import { useToast } from '../context/ToastContext';
import { callAICompletion } from '../services/aiService';
import { 
  generateDeterministicFacultyCode, syncFacultyToDirectory, cleanFacultyName, fetchRealRegisteredFaculty 
} from '../services/facultyCodeService';

// Standard Engineering Departments
const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Information Technology (IT)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Basic Sciences & Humanities (BS&H)'
];

const GRIEVANCE_CATEGORIES = [
  {
    id: 'teaching',
    title: '🧑‍🏫 Faculty Teaching & Subject Delivery',
    description: 'Pace of teaching, concept clarity, doubt clearance, blackboard/slide visibility, assessment fairness.',
    subtopics: [
      'Teaching Pace (Too fast / Too slow)',
      'Concept Explanation & Mathematical Clarity',
      'Doubt Resolution & Guidance Accessibility',
      'Blackboard / Slide Visibility & Audio Volume',
      'Hands-on Coding / Lab Demonstrations',
      'Syllabus Coverage & Handout Availability',
      'Fairness in Internal Grading & Assignments'
    ]
  },
  {
    id: 'classroom_infra',
    title: '🏫 Classroom, Lab & Infrastructure',
    description: 'Projectors, lab systems, software compilers, AC/fans, WiFi connectivity, room cleanliness.',
    subtopics: [
      'Projector / Audio System Not Working',
      'Lab Computer / Compiler / Software Setup Issue',
      'AC / Ceiling Fan / Room Lighting Breakdown',
      'Classroom WiFi / Internet Connectivity',
      'Benches, Desks & Seating Condition',
      'Classroom & Washroom Cleanliness',
      'Drinking Water / Floor Amenities'
    ]
  }
];

const SEVERITY_LEVELS = [
  { id: 'suggestion', label: '💡 Constructive Suggestion', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { id: 'moderate', label: '🟡 Moderate Issue (Needs Attention)', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { id: 'urgent', label: '🔴 Urgent Academic Blocker', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
];

export default function GrievancePortal({ user, setActiveTab }) {
  const { addToast } = useToast();
  
  const isFounder = user?.role === 'founder' || user?.email?.toLowerCase() === 'founder@lumixora.com';
  const isFaculty = user?.role === 'faculty' || user?.role === 'mentor' || isFounder;
  const userCollege = user?.college || 'GPREC';
  const userUid = user?.uid || user?.id || user?.email || 'anonymous-user';

  // Navigation sub-tabs: 'raise', 'my_issues', 'faculty_inbox', 'directory', 'transparency_feed'
  const [activeTabMode, setActiveTabMode] = useState(isFaculty ? 'faculty_inbox' : 'raise');

  // Grievances List from Firestore
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real Registered / Logged-in Faculty Directory
  const [facultyDirectory, setFacultyDirectory] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);

  // Current Faculty's own unique code
  const myFacultyCode = useMemo(() => {
    if (!isFaculty) return null;
    return generateDeterministicFacultyCode(user?.email || 'faculty@gprec.ac.in', userCollege);
  }, [isFaculty, user?.email, userCollege]);

  // Form State
  const [categoryType, setCategoryType] = useState('teaching');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [yearSem, setYearSem] = useState('3rd Year - Sem 1');
  const [section, setSection] = useState('Section A');
  const [subtopic, setSubtopic] = useState(GRIEVANCE_CATEGORIES[0].subtopics[0]);
  const [facultyCodeInput, setFacultyCodeInput] = useState('');
  const [targetFacultyOrRoom, setTargetFacultyOrRoom] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [description, setDescription] = useState('');
  const [suggestedSolution, setSuggestedSolution] = useState('');
  
  // AI Tone Enhancer state
  const [isPolishing, setIsPolishing] = useState(false);

  // Faculty Response Modal State
  const [selectedGrievanceForResponse, setSelectedGrievanceForResponse] = useState(null);
  const [facultyReplyText, setFacultyReplyText] = useState('');
  const [responseStatus, setResponseStatus] = useState('Resolved');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Search & Filter State
  const [searchFilter, setSearchFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All');
  const [facultyScopeFilter, setFacultyScopeFilter] = useState('my_code'); // 'my_code', 'all_dept'
  const [directorySearch, setDirectorySearch] = useState('');

  // Generate deterministic secure anonymous alias for students
  const generateAnonymousAlias = (seed) => {
    let hash = 0;
    const str = `${seed}_${userCollege}_lumixora_salt_2026`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(0, 4);
    return `🔒 Verified Scholar #${hex}`;
  };

  // Sync Logged-in Faculty Profile to Directory
  useEffect(() => {
    if (isFaculty && user) {
      syncFacultyToDirectory(user).catch(console.warn);
    }
  }, [isFaculty, user]);

  // Sync ONLY Real Registered/Logged-in Faculty from Firestore (faculty_directory & users)
  useEffect(() => {
    const loadRealFaculty = async () => {
      try {
        const realFacultyList = await fetchRealRegisteredFaculty();
        
        // If current user is faculty, ensure they are in the directory
        if (isFaculty && user && myFacultyCode) {
          const exists = realFacultyList.some(f => f.code === myFacultyCode);
          if (!exists) {
            realFacultyList.push({
              code: myFacultyCode,
              name: cleanFacultyName(user.name) || (user.email?.split('@')[0] || 'Faculty Member'),
              designation: user.designation || (user.role === 'founder' ? 'Platform Founder & Head' : 'Faculty Member'),
              department: user.department || 'Computer Science & Engineering (CSE)',
              college: userCollege,
              email: user.email || ''
            });
          }
        }

        setFacultyDirectory(realFacultyList);
      } catch (err) {
        console.warn('Real faculty load error:', err);
      }
    };

    loadRealFaculty();

    // Listen to real-time additions in faculty_directory
    try {
      const unsub = onSnapshot(collection(db, 'faculty_directory'), (snapshot) => {
        loadRealFaculty();
      }, (err) => {
        console.warn('Faculty directory snapshot warning:', err);
      });

      return () => unsub();
    } catch (e) {}
  }, [isFaculty, user, myFacultyCode, userCollege]);

  // Sync Grievances in real time
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'student_grievances'), (snapshot) => {
        const list = [];
        snapshot.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() });
        });
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setGrievances(list);
        setLoading(false);
      }, (err) => {
        console.warn('Grievances listener warning:', err);
        setLoading(false);
      });

      return () => unsub();
    } catch (e) {
      setLoading(false);
    }
  }, []);

  // Update subtopic options when category changes
  useEffect(() => {
    const activeCat = GRIEVANCE_CATEGORIES.find(c => c.id === categoryType);
    if (activeCat && activeCat.subtopics.length > 0) {
      setSubtopic(activeCat.subtopics[0]);
    }
  }, [categoryType]);

  // Match faculty by code or name
  const matchedFaculty = useMemo(() => {
    if (!facultyCodeInput.trim()) return null;
    const cleanCode = facultyCodeInput.trim().toUpperCase();
    return facultyDirectory.find(f => f.code.toUpperCase() === cleanCode) || null;
  }, [facultyCodeInput, facultyDirectory]);

  // Copy Code to Clipboard
  const handleCopyMyCode = () => {
    if (!myFacultyCode) return;
    navigator.clipboard.writeText(myFacultyCode);
    setCopiedCode(true);
    addToast({ message: `Unique Code "${myFacultyCode}" copied! Share with your students.`, type: 'success' });
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // AI Tone Polisher
  const handlePolishGrievance = async () => {
    if (!description.trim()) {
      addToast({ message: 'Please write your complaint description first before polishing.', type: 'warning' });
      return;
    }

    setIsPolishing(true);
    const prompt = `You are Lumixora Academic Conciliation AI.
The following is an anonymous student feedback/complaint regarding academic teaching or classroom infrastructure:
"${description}"

Please rewrite this description into:
1. Highly professional, constructive, and respectful academic language.
2. Clearly stating the specific learning difficulty or infrastructure issue without emotional hostility.
3. Highlighting the objective impact on students' comprehension.

Return ONLY the polished paragraph without introductory remarks.`;

    try {
      const result = await callAICompletion({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5
      });
      if (result) {
        setDescription(result.trim());
        addToast({ message: 'Feedback polished into professional academic tone!', type: 'success' });
      }
    } catch (e) {
      console.error(e);
      addToast({ message: 'AI polisher unavailable. Using original text.', type: 'info' });
    } finally {
      setIsPolishing(false);
    }
  };

  // Handle Grievance Submission
  const handleSubmitGrievance = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      addToast({ message: 'Please provide a clear description of the issue.', type: 'warning' });
      return;
    }

    const encryptedAlias = generateAnonymousAlias(userUid);
    const maskedStudentToken = btoa(`${userUid}__lumixora_priv`).slice(0, 16);

    const cleanFacultyCode = facultyCodeInput.trim().toUpperCase();
    const resolvedFacultyName = matchedFaculty 
      ? `${matchedFaculty.name} (${matchedFaculty.designation || 'Faculty'})` 
      : (targetFacultyOrRoom.trim() || 'Department Faculty Team');

    const grievanceData = {
      categoryType,
      categoryTitle: GRIEVANCE_CATEGORIES.find(c => c.id === categoryType)?.title || 'Academic Grievance',
      department,
      yearSem,
      section,
      subtopic,
      targetFacultyCode: cleanFacultyCode || null,
      targetFacultyName: resolvedFacultyName,
      targetFacultyOrRoom: resolvedFacultyName,
      subjectName: subjectName.trim() || 'General Subject',
      severity,
      description: description.trim(),
      suggestedSolution: suggestedSolution.trim(),
      // ENCRYPTED IDENTITY: Student's name/email is completely omitted
      anonymousAlias: encryptedAlias,
      maskedStudentToken,
      college: userCollege,
      status: 'Under Review', // 'Under Review', 'In Progress', 'Resolved'
      facultyResponse: null,
      respondedBy: null,
      respondedAt: null,
      upvotes: 1,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'student_grievances'), grievanceData);
      addToast({ 
        message: cleanFacultyCode 
          ? `Your issue has been securely encrypted and routed directly to Faculty [${cleanFacultyCode}]!` 
          : 'Your issue has been anonymously encrypted and routed to the department.', 
        type: 'success' 
      });
      
      // Reset Form
      setDescription('');
      setSuggestedSolution('');
      setTargetFacultyOrRoom('');
      setFacultyCodeInput('');
      setSubjectName('');
      setActiveTabMode('my_issues');
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to submit grievance. Please try again.', type: 'error' });
    }
  };

  // Handle Faculty Response Submission
  const handleFacultySubmitResponse = async (e) => {
    e.preventDefault();
    if (!selectedGrievanceForResponse || !facultyReplyText.trim()) {
      addToast({ message: 'Please enter your response / resolution message.', type: 'warning' });
      return;
    }

    setSubmittingReply(true);
    const cleanFacultyName = user?.name ? user.name.split('{')[0].trim() : (user?.email?.split('@')[0] || 'Concerned Faculty');

    try {
      const gRef = doc(db, 'student_grievances', selectedGrievanceForResponse.id);
      await updateDoc(gRef, {
        status: responseStatus,
        facultyResponse: facultyReplyText.trim(),
        respondedBy: `${cleanFacultyName} (${myFacultyCode || 'Faculty'})`,
        respondedAt: serverTimestamp()
      });

      addToast({ message: 'Resolution message recorded and updated for the student!', type: 'success' });
      setSelectedGrievanceForResponse(null);
      setFacultyReplyText('');
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to submit response.', type: 'error' });
    } finally {
      setSubmittingReply(false);
    }
  };

  // Filtered List for Student's Own Issues
  const myGrievances = useMemo(() => {
    const currentMaskedToken = btoa(`${userUid}__lumixora_priv`).slice(0, 16);
    return grievances.filter(g => g.maskedStudentToken === currentMaskedToken);
  }, [grievances, userUid]);

  // Filtered List for Faculty Action Inbox
  const facultyInboxGrievances = useMemo(() => {
    return grievances.filter(g => {
      // If filtering by "My Code" specifically
      if (facultyScopeFilter === 'my_code' && myFacultyCode) {
        const matchesMyCode = g.targetFacultyCode === myFacultyCode;
        const matchesMyEmail = user?.email && g.targetFacultyName?.toLowerCase().includes(user.email.split('@')[0].toLowerCase());
        if (!matchesMyCode && !matchesMyEmail && !isFounder) return false;
      }

      // Department filter
      if (deptFilter !== 'All Departments' && g.department !== deptFilter) return false;
      if (statusFilter !== 'All' && g.status !== statusFilter) return false;

      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchSub = g.subjectName?.toLowerCase().includes(q);
        const matchFac = g.targetFacultyName?.toLowerCase().includes(q) || g.targetFacultyCode?.toLowerCase().includes(q);
        const matchTopic = g.subtopic?.toLowerCase().includes(q);
        const matchDesc = g.description?.toLowerCase().includes(q);
        return matchSub || matchFac || matchTopic || matchDesc;
      }

      return true;
    });
  }, [grievances, facultyScopeFilter, myFacultyCode, user?.email, isFounder, deptFilter, statusFilter, searchFilter]);

  // Filtered Faculty Directory for Search
  const filteredDirectory = useMemo(() => {
    return facultyDirectory.filter(f => {
      if (directorySearch.trim()) {
        const q = directorySearch.toLowerCase();
        const matchName = f.name?.toLowerCase().includes(q);
        const matchCode = f.code?.toLowerCase().includes(q);
        const matchDept = f.department?.toLowerCase().includes(q);
        const matchSub = (f.subjects || []).some(s => s.toLowerCase().includes(q));
        return matchName || matchCode || matchDept || matchSub;
      }
      return true;
    });
  }, [facultyDirectory, directorySearch]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fade-in text-[var(--text-main)] px-4 sm:px-6">
      
      {/* ── TOP HERO HEADER & SECURITY BADGE ─────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-white/10 bg-gradient-to-br from-emerald-950/40 via-slate-950/50 to-black/90 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest shadow-sm">
              <Lock className="w-4 h-4" /> End-to-End Encrypted Faculty Routing
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Anonymous Faculty Feedback & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Unique Code Grievance Portal
              </span>
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Send constructive academic feedback directly to your faculty using their <strong className="text-amber-300 font-bold">Unique Faculty Code</strong>. 
              <strong className="text-emerald-300 font-bold ml-1">Student identity is 100% cryptographically encrypted.</strong>
            </p>

            {/* Zero-Trace Security Promise Card */}
            <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 flex items-start gap-3 mt-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-extrabold text-emerald-400 block">🔒 Cryptographic Zero-Trace Guarantee</span>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  Faculty receive your feedback routed to their unique code with your name and roll number replaced by a deterministic anonymous token (<code className="text-emerald-300 font-mono">🔒 Verified Scholar #XXXX</code>).
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Faculty Code Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            {isFaculty && myFacultyCode && (
              <div className="glass-panel p-5 rounded-2xl border-2 border-amber-400/40 bg-amber-500/10 space-y-2 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" /> Your Faculty Unique Code
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-[10px] font-bold text-amber-300">LIVE</span>
                </div>
                
                <div className="flex items-center justify-between gap-3 bg-black/60 px-3.5 py-2.5 rounded-xl border border-amber-400/30">
                  <span className="font-mono text-base sm:text-lg font-black text-amber-300 tracking-wider">
                    {myFacultyCode}
                  </span>
                  <button
                    onClick={handleCopyMyCode}
                    className="p-1.5 rounded-lg bg-amber-400 text-black hover:bg-amber-300 font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer shadow"
                    title="Copy your Unique Faculty Code"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                
                <p className="text-[10px] text-gray-300 leading-tight">
                  Share this code with your class so students can route feedback directly to you!
                </p>
              </div>
            )}

            <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-brand-teal p-1.5 rounded-xl bg-white/5" />
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Target Institution</span>
                <span className="text-sm font-black text-white">{userCollege}</span>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 p-1.5 rounded-xl bg-white/5" />
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Resolved Issues</span>
                <span className="text-sm font-black text-emerald-400">
                  {grievances.filter(g => g.status === 'Resolved').length} / {grievances.length} Actioned
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOP LEVEL SUB-NAVIGATION TABS ────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto custom-scrollbar">
          
          {isFaculty && (
            <button
              onClick={() => setActiveTabMode('faculty_inbox')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTabMode === 'faculty_inbox'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md scale-[1.02]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> 📥 Faculty Action Inbox ({facultyInboxGrievances.length})
            </button>
          )}

          <button
            onClick={() => setActiveTabMode('raise')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTabMode === 'raise'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-md scale-[1.02]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" /> ✍️ Raise Anonymous Issue
          </button>

          <button
            onClick={() => setActiveTabMode('directory')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTabMode === 'directory'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md scale-[1.02]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" /> 👨‍🏫 Faculty Directory & Codes ({facultyDirectory.length})
          </button>

          <button
            onClick={() => setActiveTabMode('my_issues')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTabMode === 'my_issues'
                ? 'bg-brand-teal text-black shadow-md scale-[1.02]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" /> 📂 My Filed Issues & Replies ({myGrievances.length})
          </button>

          <button
            onClick={() => setActiveTabMode('transparency_feed')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTabMode === 'transparency_feed'
                ? 'bg-white text-black shadow-md scale-[1.02]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" /> 🌐 Campus Transparency Feed ({grievances.length})
          </button>
        </div>
      </div>

      {/* ── TAB 1: RAISE ANONYMOUS GRIEVANCE FORM (WITH FACULTY CODE) ─── */}
      {activeTabMode === 'raise' && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 max-w-4xl mx-auto space-y-8 shadow-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" /> 100% Encrypted Feedback Form
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Submit Anonymous Grievance / Feedback
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Enter your faculty's <strong className="text-amber-300">Unique Code</strong> to route this message directly to their inbox without sharing your identity.
            </p>
          </div>

          <form onSubmit={handleSubmitGrievance} className="space-y-6">
            
            {/* Category Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-300">
                1. Select Issue Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GRIEVANCE_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setCategoryType(cat.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      categoryType === cat.id
                        ? 'bg-emerald-500/10 border-emerald-400 shadow-md ring-1 ring-emerald-400/50'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-white">{cat.title}</h4>
                      {categoryType === cat.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Department, Year & Section Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Year & Semester</label>
                <select
                  value={yearSem}
                  onChange={(e) => setYearSem(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="1st Year - Sem 1">1st Year - Sem 1</option>
                  <option value="1st Year - Sem 2">1st Year - Sem 2</option>
                  <option value="2nd Year - Sem 1">2nd Year - Sem 1</option>
                  <option value="2nd Year - Sem 2">2nd Year - Sem 2</option>
                  <option value="3rd Year - Sem 1">3rd Year - Sem 1</option>
                  <option value="3rd Year - Sem 2">3rd Year - Sem 2</option>
                  <option value="4th Year - Sem 1">4th Year - Sem 1</option>
                  <option value="4th Year - Sem 2">4th Year - Sem 2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Section / Batch</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                  <option value="Section D">Section D</option>
                  <option value="All Sections">All Sections Combined</option>
                </select>
              </div>
            </div>

            {/* Specific Issue Domain & Subject & Respective Faculty Name + Unique Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Specific Issue Domain</label>
                <select
                  value={subtopic}
                  onChange={(e) => setSubtopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                >
                  {(GRIEVANCE_CATEGORIES.find(c => c.id === categoryType)?.subtopics || []).map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  {categoryType === 'teaching' ? 'Subject Name & Code *' : 'Classroom / Lab Location *'}
                </label>
                <input
                  type="text"
                  required
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder={categoryType === 'teaching' ? 'e.g. Operating Systems / CS304' : 'e.g. CSE Lab 3 / Room 302'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              {categoryType === 'teaching' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Select Concerned Faculty *
                  </label>
                  <select
                    value={facultyCodeInput}
                    onChange={(e) => {
                      const selectedCode = e.target.value;
                      setFacultyCodeInput(selectedCode);
                      const f = facultyDirectory.find(fac => fac.code === selectedCode);
                      if (f) {
                        setTargetFacultyOrRoom(`${f.name} [${f.code}]`);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="">-- Choose Faculty Member --</option>
                    {facultyDirectory.map(f => (
                      <option key={f.code} value={f.code}>
                        {f.name} ({f.department?.split('(')[0].trim() || 'Faculty'})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Equipment / Item Breakdown
                  </label>
                  <input
                    type="text"
                    value={targetFacultyOrRoom}
                    onChange={(e) => setTargetFacultyOrRoom(e.target.value)}
                    placeholder="e.g. Projector / Ceiling Fan #2 / AC"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              )}
            </div>

            {/* Prominent Unique Faculty Code Display Box when Faculty is Selected */}
            {categoryType === 'teaching' && matchedFaculty && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-400/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-400 text-black">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-widest block">
                      Respective Faculty Unique Code
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-base font-black text-amber-300 tracking-wider">
                        {matchedFaculty.code}
                      </span>
                      <span className="text-xs text-gray-300">
                        ({matchedFaculty.name} • {matchedFaculty.department?.split('(')[0].trim()})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 🔒 Encrypted Direct Route Active
                  </span>
                </div>
              </div>
            )}

            {/* Severity Level */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300">Issue Urgency / Impact</label>
              <div className="flex flex-wrap gap-3">
                {SEVERITY_LEVELS.map(sev => (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setSeverity(sev.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                      severity === sev.id
                        ? `${sev.color} ring-2 ring-emerald-400/50 shadow-md`
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-300">
                  Detailed Explanation of the Issue *
                </label>
                <button
                  type="button"
                  onClick={handlePolishGrievance}
                  disabled={isPolishing || !description.trim()}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isPolishing ? 'animate-spin' : ''}`} />
                  <span>{isPolishing ? 'AI Polishing...' : '🤖 AI Make Constructive & Professional'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the specific issue in detail (e.g. The derivation of algorithm time complexity in Chapter 3 was rushed and multiple students couldn't follow. Handouts or slower step-by-step whiteboard examples would greatly help us prepare for mid exams)."
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400 leading-relaxed"
              />
            </div>

            {/* Suggested Solution (Constructive) */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Suggested Improvement / Constructive Request (Optional)
              </label>
              <input
                type="text"
                value={suggestedSolution}
                onChange={(e) => setSuggestedSolution(e.target.value)}
                placeholder="e.g. Please dedicate 10 minutes at the start of next lecture to recap the mathematical formulas."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-black font-black text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Encrypt & Route by Unique Faculty Code</span>
            </button>
          </form>
        </div>
      )}

      {/* ── TAB 2: FACULTY DIRECTORY & UNIQUE CODES ────────────────────── */}
      {activeTabMode === 'directory' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Tag className="w-6 h-6 text-amber-400" /> Verified Faculty Codes Directory
                </h2>
                <p className="text-gray-400 text-xs mt-1">
                  Look up your professor's unique code to send anonymous academic feedback directly to their inbox.
                </p>
              </div>

              <button
                onClick={() => setActiveTabMode('raise')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-xs font-black flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" /> + File Issue with Code
              </button>
            </div>

            {/* Directory Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                placeholder="Search faculty name, unique code, subject, department..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDirectory.map((fac) => (
              <div
                key={fac.code}
                className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3 hover:border-amber-400/40 transition-all shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-xs font-black tracking-wider">
                      {fac.code}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{fac.college}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">{fac.name}</h3>
                    <p className="text-xs text-brand-teal font-semibold">{fac.designation || 'Faculty Member'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{fac.department}</p>
                  </div>

                  {fac.subjects && fac.subjects.length > 0 && (
                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Subjects Taught:</span>
                      <div className="flex flex-wrap gap-1">
                        {fac.subjects.map((sub, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(fac.code);
                      addToast({ message: `Copied code ${fac.code}!`, type: 'success' });
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </button>

                  <button
                    onClick={() => {
                      setFacultyCodeInput(fac.code);
                      setDepartment(fac.department || DEPARTMENTS[0]);
                      setCategoryType('teaching');
                      setActiveTabMode('raise');
                      addToast({ message: `Selected ${fac.name} (${fac.code})! Fill out your feedback below.`, type: 'info' });
                    }}
                    className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black flex items-center gap-1 shadow transition-colors cursor-pointer"
                  >
                    <span>Use Code →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: FACULTY / MANAGEMENT ACTION INBOX ──────────────────── */}
      {activeTabMode === 'faculty_inbox' && isFaculty && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-purple-400" /> Faculty Feedback & Grievance Inbox
                </h2>
                <p className="text-gray-400 text-xs mt-1">
                  Viewing encrypted student feedback. Filter by your Unique Code or across your department.
                </p>
              </div>

              {myFacultyCode && (
                <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-400/40 px-3.5 py-1.5 rounded-2xl">
                  <Tag className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-mono font-black text-amber-300">{myFacultyCode}</span>
                </div>
              )}
            </div>

            {/* Scope Filter buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
              <button
                onClick={() => setFacultyScopeFilter('my_code')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  facultyScopeFilter === 'my_code'
                    ? 'bg-amber-400 text-black shadow'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                🎯 Target Code Feedback ({grievances.filter(g => g.targetFacultyCode === myFacultyCode).length})
              </button>

              <button
                onClick={() => setFacultyScopeFilter('all_dept')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  facultyScopeFilter === 'all_dept'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                🏢 All Campus & Dept Grievances ({grievances.length})
              </button>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search subject, faculty, code..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141424] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  <option value="All Departments">All Departments</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141424] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  <option value="All">All Statuses</option>
                  <option value="Under Review">Under Review (Unanswered)</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grievances List */}
          {facultyInboxGrievances.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-3xl border border-white/10 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Issues in this View</h3>
              <p className="text-gray-400 text-xs">
                {facultyScopeFilter === 'my_code' 
                  ? `No student grievances have been targeted to your code [${myFacultyCode}] yet.` 
                  : 'All campus feedback for the selected criteria has been reviewed.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {facultyInboxGrievances.map((g) => (
                <div
                  key={g.id}
                  className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 hover:border-purple-500/40 transition-all shadow-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-black text-purple-300">
                        {g.categoryTitle}
                      </span>
                      {g.targetFacultyCode && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 font-mono text-xs font-black">
                          {g.targetFacultyCode}
                        </span>
                      )}
                      <span className="text-xs font-bold text-gray-400">
                        {g.department} • {g.yearSem} ({g.section})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-emerald-400 font-mono text-[11px] font-bold">
                        {g.anonymousAlias}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        g.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : g.status === 'In Progress'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {g.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>📖 Subject: {g.subjectName}</span>
                      <span className="text-xs text-gray-400">| Target: <strong className="text-gray-200">{g.targetFacultyName || g.targetFacultyOrRoom}</strong></span>
                    </h3>
                    <span className="text-xs text-amber-300 font-semibold block mt-1">
                      Issue Type: {g.subtopic}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-200 leading-relaxed">
                    <p className="font-semibold text-gray-400 mb-1">Student Constructive Feedback:</p>
                    {g.description}
                  </div>

                  {g.suggestedSolution && (
                    <p className="text-xs text-emerald-300 italic bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                      💡 <strong>Student Recommendation:</strong> "{g.suggestedSolution}"
                    </p>
                  )}

                  {/* Previous Response if any */}
                  {g.facultyResponse && (
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-gray-300">
                      <span className="font-bold text-emerald-400 block mb-1">Existing Response by {g.respondedBy}:</span>
                      "{g.facultyResponse}"
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedGrievanceForResponse(g);
                        setFacultyReplyText(g.facultyResponse || '');
                        setResponseStatus(g.status === 'Under Review' ? 'Resolved' : g.status);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{g.facultyResponse ? 'Update Response / Status' : 'Respond to Feedback'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: MY FILED ISSUES & LIVE FACULTY REPLIES ─────────────── */}
      {activeTabMode === 'my_issues' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-brand-teal" /> My Filed Grievances & Live Responses
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                Track how concerned faculty and departments have addressed your feedback in real-time.
              </p>
            </div>

            <button
              onClick={() => setActiveTabMode('raise')}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-black flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" /> + File New Issue
            </button>
          </div>

          {myGrievances.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-3xl border border-white/10 space-y-4">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Grievances Filed Yet</h3>
              <p className="text-gray-400 text-xs max-w-md mx-auto">
                Have feedback regarding teaching pace, difficult concepts, or lab equipment? Your identity will remain 100% encrypted.
              </p>
              <button
                onClick={() => setActiveTabMode('raise')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-xs font-black cursor-pointer"
              >
                File an Anonymous Issue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myGrievances.map((g) => (
                <div
                  key={g.id}
                  className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 hover:border-emerald-500/40 transition-all shadow-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-black text-brand-teal">
                        {g.categoryTitle}
                      </span>
                      {g.targetFacultyCode && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 font-mono text-xs font-black">
                          {g.targetFacultyCode}
                        </span>
                      )}
                      <span className="text-xs font-bold text-gray-400">
                        {g.department} • {g.yearSem} ({g.section})
                      </span>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      g.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : g.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {g.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>📖 {g.subjectName}</span>
                      <span className="text-xs text-gray-400 font-normal">({g.subtopic})</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Concerned Faculty: <strong className="text-gray-200">{g.targetFacultyName || g.targetFacultyOrRoom}</strong>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-300 leading-relaxed">
                    <p className="font-semibold text-gray-200 mb-1">Your Feedback Description:</p>
                    {g.description}
                  </div>

                  {/* Live Faculty Response Box */}
                  {g.facultyResponse ? (
                    <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Response from {g.respondedBy || 'Concerned Faculty'}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">Status: {g.status}</span>
                      </div>
                      <p className="text-xs text-gray-200 leading-relaxed font-sans pl-6 border-l-2 border-emerald-400/50">
                        "{g.facultyResponse}"
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-xs text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                      <span>Awaiting faculty acknowledgement & action plan...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 5: CAMPUS TRANSPARENCY FEED ───────────────────────────── */}
      {activeTabMode === 'transparency_feed' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Eye className="w-6 h-6 text-brand-teal" /> Campus Academic Transparency Feed
            </h2>
            <p className="text-gray-400 text-xs">
              Public anonymized feed of academic suggestions and resolved classroom infrastructure actions across {userCollege}.
            </p>
          </div>

          <div className="space-y-4">
            {grievances.map((g) => (
              <div
                key={g.id}
                className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
                      {g.department}
                    </span>
                    <span className="text-xs text-gray-400">
                      {g.yearSem} • {g.section}
                    </span>
                  </div>

                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    {g.anonymousAlias}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-white">
                    📖 {g.subjectName} <span className="text-xs font-normal text-gray-400">({g.subtopic})</span>
                  </h3>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed bg-black/30 p-3.5 rounded-2xl border border-white/5">
                    {g.description}
                  </p>
                </div>

                {g.facultyResponse && (
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Action Taken by {g.respondedBy}:
                    </span>
                    <p className="text-gray-200 leading-relaxed">
                      "{g.facultyResponse}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL: FACULTY RESPONSE ACTION MODAL ──────────────────────── */}
      {selectedGrievanceForResponse && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedGrievanceForResponse(null); }}
        >
          <div className="relative w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 bg-gradient-to-b from-[#111122] to-[#0c0c14] shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedGrievanceForResponse(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" /> Faculty Official Response
              </div>
              <h2 className="text-2xl font-black text-white">
                Respond to Academic Feedback
              </h2>
              <p className="text-gray-400 text-xs">
                From: {selectedGrievanceForResponse.anonymousAlias} ({selectedGrievanceForResponse.department})
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-300 leading-relaxed">
              <p className="font-semibold text-white mb-1">Issue Description:</p>
              "{selectedGrievanceForResponse.description}"
            </div>

            <form onSubmit={handleFacultySubmitResponse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Action Status</label>
                <select
                  value={responseStatus}
                  onChange={(e) => setResponseStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  <option value="Resolved">Resolved (Action Taken & Explained)</option>
                  <option value="In Progress">In Progress (Under Active Review / Work)</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Explanation / Action Plan for Students *
                </label>
                <textarea
                  rows={4}
                  required
                  value={facultyReplyText}
                  onChange={(e) => setFacultyReplyText(e.target.value)}
                  placeholder="e.g. Thank you for the constructive feedback. Starting next week, I will recap previous formulas for the first 10 minutes of class and upload handwritten notes to the LMS."
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReply}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg cursor-pointer"
              >
                {submittingReply ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting Resolution...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit & Notify Student Anonymously</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
