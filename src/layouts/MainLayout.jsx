import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import GlobalSearchModal from '../components/GlobalSearchModal';
import { 
  Search, Bell, Sparkles, AlertCircle, Menu, Camera, Save, X, Flame, 
  Coins, Sun, Moon, ArrowLeft, ArrowRight, GraduationCap, LogOut, Code, Users, Home, Power,
  Bot, Award, HelpCircle, BookOpen, CheckSquare, UserCheck, Rocket, FileText,
  Building2, Check, Plus, Layers, Trophy, CheckCircle2, TrendingUp, Download, 
  FileSpreadsheet, Activity, ChevronRight, Terminal, Star, Target, Code2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { auth, db, storage } from '../config/firebase';
import { supabase } from '../config/supabase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, collection, onSnapshot, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';
import { useTheme } from '../context/ThemeContext';
import { FRAMES } from '../services/gamificationService';
import { DEFAULT_COLLEGES } from '../data/collegesData';

const QUICK_FEATURES = [
  { id: 'dashboard', label: '🌌 Omiverse Hub', icon: Home, highlight: true },
  { id: 'coding-practice', label: '💻 Codeverse', icon: Code, highlight: true },
  { id: 'learning-hub', label: '📚 Learnverse', icon: BookOpen },
  { id: 'projects', label: '🛠️ Buildverse', icon: Rocket },
  { id: 'community', label: '🌐 Connectverse', icon: Users },
  { id: 'future-twin', label: '🎯 Careerverse', icon: Bot },
  { id: 'assigned-tasks', label: '🌟 Talentverse', icon: Award },
  { id: 'resume', label: 'AI Resume PDF', icon: FileText },
  { id: 'test-portal', label: 'Tests Hub', icon: Award },
  { id: 'doubts', label: 'Doubt Solver', icon: HelpCircle },
  { id: 'attendance', label: 'Attendance', icon: UserCheck },
];

export default function MainLayout({ children, activeTab, setActiveTab, user, onUpdateUser, onLogout, onExitApp }) {
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cursorGlowEnabled, setCursorGlowEnabled] = useState(() => {
    try {
      return localStorage.getItem('lumixora_cursor_glow') !== 'false';
    } catch (e) {
      return true;
    }
  });

  const [cursorStyle, setCursorStyle] = useState(() => {
    try {
      return localStorage.getItem('lumixora_cursor_mode') || 'tom_and_jerry';
    } catch (e) {
      return 'tom_and_jerry';
    }
  });

  const [showCursorMenu, setShowCursorMenu] = useState(false);

  const ALL_CURSOR_STYLES = [
    { id: 'tom_and_jerry', name: '🐱🐭 Tom & Jerry Cartoon Chase', desc: 'Tom & Jerry chase across screen with cartoon sparks' },
    { id: 'pikachu', name: '⚡ Pikachu Electrical Surge', desc: 'Pikachu runs beside cursor with yellow electrical sparks' },
    { id: 'doraemon', name: '🌀 Doraemon Magic Gadgets', desc: 'Doraemon flies on Bamboo Copter emitting magic sparkles' },
    { id: 'shinchan', name: '🕶️ Shinchan Mischief Runner', desc: 'Shinchan scurries emitting Action Kamen laser beams' },
    { id: 'ben10', name: '🛸 Ben 10 Omnitrix Matrix', desc: 'Ben 10 with glowing green Omnitrix pulse aura' },
    { id: 'bheem', name: '🦾 Chhota Bheem Power Ladoo', desc: 'Chhota Bheem with golden Ladoo energy rings' },
    { id: 'matrix_rain', name: '🌌 Cyberpunk Matrix Rain', desc: 'Falling green digital matrix code stream' },
    { id: 'neon_spotlight', name: '✨ Cosmic Fluid Spotlight', desc: 'Fluid multi-color ambient lighting' },
    { id: 'fluid_comet', name: '⚡ Fluid Neon Comet Trail', desc: 'Silky glowing laser ribbon with stardust' },
    { id: 'magnetic_ring', name: '🎯 Minimal Magnetic Ring', desc: 'Clean dot with elastic glass follower ring' }
  ];

  const handleSelectCursorStyle = (styleId) => {
    if (styleId === 'off') {
      setCursorGlowEnabled(false);
      try { localStorage.setItem('lumixora_cursor_glow', 'false'); } catch(e){}
      window.dispatchEvent(new CustomEvent('lumixora_cursor_glow_toggle', { detail: { enabled: false } }));
      addToast({ message: 'Visual effects turned OFF', type: 'info' });
    } else {
      setCursorGlowEnabled(true);
      setCursorStyle(styleId);
      try {
        localStorage.setItem('lumixora_cursor_glow', 'true');
        localStorage.setItem('lumixora_cursor_mode', styleId);
      } catch(e){}
      window.dispatchEvent(new CustomEvent('lumixora_cursor_glow_toggle', { detail: { enabled: true, mode: styleId } }));
      const found = ALL_CURSOR_STYLES.find(s => s.id === styleId);
      addToast({ message: `Effect Activated: ${found?.name || styleId}`, type: 'success' });
    }
    setShowCursorMenu(false);
  };

  const toggleCursorGlow = () => {
    setShowCursorMenu(prev => !prev);
  };

  // Multi-Campus B2B Switcher State for Super Admin / Founder
  const [showCampusMenu, setShowCampusMenu] = useState(false);
  const [campusesList, setCampusesList] = useState(DEFAULT_COLLEGES);
  const [activeCampusId, setActiveCampusId] = useState(() => localStorage.getItem('lumixora_active_campus_id') || 'all');
  const [activeCampusName, setActiveCampusName] = useState(() => localStorage.getItem('lumixora_active_campus_name') || 'All Campuses (HQ)');

  // Sync campuses in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'college_tenants'), (snap) => {
      const fetched = [];
      snap.forEach(d => {
        if (d.id === 'init') return;
        const data = d.data();
        if (!data.is_deleted && !data.isDeleted) {
          fetched.push({ id: d.id, ...data });
        }
      });
      const existingIds = new Set(fetched.map(c => c.id));
      const missing = DEFAULT_COLLEGES.filter(c => !existingIds.has(c.id));
      setCampusesList([...missing, ...fetched]);
    }, () => {});

    const handleCampusEvt = (e) => {
      if (e.detail) {
        setActiveCampusId(e.detail.campusId || 'all');
        setActiveCampusName(e.detail.campusName || 'All Campuses (HQ)');
      }
    };
    window.addEventListener('lumixora_campus_changed', handleCampusEvt);

    return () => {
      unsub();
      window.removeEventListener('lumixora_campus_changed', handleCampusEvt);
    };
  }, []);

  // Global Ctrl+K / Cmd+K Search trigger
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setShowGlobalSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectCampus = (campusId, campusName) => {
    setActiveCampusId(campusId);
    setActiveCampusName(campusName);
    localStorage.setItem('lumixora_active_campus_id', campusId);
    localStorage.setItem('lumixora_active_campus_name', campusName);
    window.dispatchEvent(new CustomEvent('lumixora_campus_changed', { detail: { campusId, campusName } }));
    setShowCampusMenu(false);
    addToast({ message: `Campus context switched to: ${campusName}`, type: 'success' });
  };

  // Sync notifications from local storage and handle real-time events
  React.useEffect(() => {
    const loadNotifications = () => {
      try {
        const saved = localStorage.getItem('lumixora_notifications');
        let list = saved ? JSON.parse(saved) : [];
        if (!list.some(n => n.id === 'profile-audit-alert')) {
          list = [
            {
              id: 'profile-audit-alert',
              text: '📢 Action Required: Please review & verify your profile details (Roll No, Branch, Year, Semester, Section, Mobile) for accurate placement dossiers.',
              time: 'Important',
              unread: true,
              action: 'open_profile_settings'
            },
            ...list
          ];
        }
        setNotifications(list);
      } catch (e) {
        console.error("Failed to load notifications:", e);
      }
    };

    loadNotifications();

    const handleNotificationsUpdate = () => {
      loadNotifications();
    };

    const handleAppNotification = (e) => {
      addToast({ message: e.detail.message, type: e.detail.type || 'info' });
    };

    window.addEventListener('lumixora_notifications_updated', handleNotificationsUpdate);
    window.addEventListener('lumixora_app_notification', handleAppNotification);
    return () => {
      window.removeEventListener('lumixora_notifications_updated', handleNotificationsUpdate);
      window.removeEventListener('lumixora_app_notification', handleAppNotification);
    };
  }, []);

  const markAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    setNotifications(updated);
    try {
      localStorage.setItem('lumixora_notifications', JSON.stringify(updated));
    } catch (e) {}
  };

  // Profile Edit & Progress states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState('progress'); // 'progress' | 'history' | 'settings'
  const [showAuditBanner, setShowAuditBanner] = useState(() => !localStorage.getItem('lumixora_audit_banner_dismissed'));
  
  // Comprehensive Registration & Profile Fields
  const [editName, setEditName] = useState('');
  const [editRollNumber, setEditRollNumber] = useState('');
  const [editDepartment, setEditDepartment] = useState('CSE');
  const [editCollege, setEditCollege] = useState('');
  const [editYear, setEditYear] = useState('1st Year');
  const [editSemester, setEditSemester] = useState('1');
  const [editSection, setEditSection] = useState('A');
  const [editQualification, setEditQualification] = useState('B.Tech');
  const [editPlace, setEditPlace] = useState('Kurnool');
  const [editMobileNumber, setEditMobileNumber] = useState('');
  const [editCgpa, setEditCgpa] = useState('9.0');
  const [editCareerGoal, setEditCareerGoal] = useState('Placement');
  const [editLearningStyle, setEditLearningStyle] = useState('Practical');
  const [editWeakSubjects, setEditWeakSubjects] = useState('None');
  const [editLeetcode, setEditLeetcode] = useState('');
  const [editHackerrank, setEditHackerrank] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);
  const [myProgressStats, setMyProgressStats] = useState({
    tasksCount: 0,
    javaTasksCount: 0,
    testsCount: 0,
    avgAccuracy: 0,
    placementScore: 0,
    tasksList: [],
    testsList: []
  });

  const cleanScholarName = (str) => {
    if (!str || typeof str !== 'string') return 'Scholar';
    let cleaned = str;
    if (cleaned.includes('{')) {
      cleaned = cleaned.split('{')[0].trim();
    }
    cleaned = cleaned.replace(/[\{\}":;]/g, '').trim();
    return cleaned || 'Scholar';
  };

  // Mandatory Profile Name/Roll Prompt if user is named 'Scholar'
  const [showNameUpdatePrompt, setShowNameUpdatePrompt] = useState(false);
  const [newNameInput, setNewNameInput] = useState('');
  const [newRollInput, setNewRollInput] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'founder') {
      const clean = cleanScholarName(user.name);
      const isDefault = !clean || clean.toLowerCase() === 'scholar' || clean.toLowerCase() === 'student';
      if (isDefault) {
        setShowNameUpdatePrompt(true);
        if (user.email && user.email.endsWith('@gprec.ac.in')) {
          setNewRollInput(user.email.split('@')[0].toUpperCase());
        }
      }
    }
  }, [user]);

  const handleQuickNameUpdate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newNameInput.trim()) {
      addToast({ message: 'Please enter your official full name.', type: 'warning' });
      return;
    }

    setIsUpdatingName(true);
    try {
      const cleanName = newNameInput.trim();
      const cleanRoll = (newRollInput.trim() || (user?.email && user.email.endsWith('@gprec.ac.in') ? user.email.split('@')[0] : '')).toUpperCase();
      const uid = user?.id || user?.uid || user?.email;

      const updatedFields = {
        name: cleanName,
        cleanName: cleanName,
        displayName: cleanName,
        rollNumber: cleanRoll,
        roll_number: cleanRoll
      };

      // 1. Update Supabase
      if (supabase && typeof supabase.from === 'function') {
        await supabase.from('users').update(updatedFields).match(user?.id ? { id: user.id } : { email: user?.email }).catch(() => {});
      }

      // 2. Update Firestore
      if (db && uid) {
        await Promise.allSettled([
          setDoc(doc(db, 'users', uid), updatedFields, { merge: true }),
          setDoc(doc(db, 'Users', uid), updatedFields, { merge: true })
        ]);
      }

      // 3. Update localStorage & Active User State
      const updatedUser = {
        ...user,
        ...updatedFields
      };
      localStorage.setItem('lumixora_user', JSON.stringify(updatedUser));
      if (onUpdateUser) onUpdateUser(updatedUser);

      setShowNameUpdatePrompt(false);
      addToast({ message: `Welcome, ${cleanName}! Official profile updated successfully.`, type: 'success' });
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to update name. Please try again.', type: 'error' });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const getScholarInitials = (nameStr) => {
    const clean = cleanScholarName(nameStr);
    if (!clean || clean === 'Scholar' || clean === 'Student') return 'S';
    const parts = clean.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const parseUserProfile = (fullName) => {
    let rawStr = fullName || '';
    let name = cleanScholarName(rawStr);
    let metadata = { 
      qualification: 'B.Tech', 
      college: 'GPREC', 
      department: 'CSE',
      branch: 'CSE',
      place: 'Kurnool, AP', 
      year: '1st Year', 
      sem: '1',
      sec: 'A',
      rollNumber: '',
      mobileNumber: '',
      cgpa: '9.0',
      careerGoal: 'Placement',
      learningStyle: 'Practical',
      weakSubjects: 'None',
      avatarUrl: '',
      leetcodeUser: localStorage.getItem('lumixora_leetcode_user') || '',
      hackerrankUser: localStorage.getItem('lumixora_hackerrank_user') || '',
      githubUser: localStorage.getItem('lumixora_github_user') || '',
      linkedinUser: localStorage.getItem('lumixora_linkedin_user') || ''
    };

    if (rawStr.includes('{')) {
      const idx = rawStr.indexOf('{');
      const jsonStr = rawStr.substring(idx).trim();
      try {
        const rawJson = JSON.parse(jsonStr);
        if (rawJson && typeof rawJson === 'object') {
          Object.keys(rawJson).forEach(k => {
            const lowerK = k.toLowerCase();
            if (lowerK === 'qualification') metadata.qualification = rawJson[k];
            if (lowerK === 'college') metadata.college = rawJson[k];
            if (lowerK === 'department') metadata.department = rawJson[k];
            if (lowerK === 'branch') metadata.branch = rawJson[k];
            if (lowerK === 'place') metadata.place = rawJson[k];
            if (lowerK === 'year') metadata.year = rawJson[k];
            if (lowerK === 'sem' || lowerK === 'semester') metadata.sem = rawJson[k];
            if (lowerK === 'sec' || lowerK === 'section') metadata.sec = rawJson[k];
            if (lowerK === 'rollnumber' || lowerK === 'roll_number') metadata.rollNumber = rawJson[k];
            if (lowerK === 'mobilenumber' || lowerK === 'phone') metadata.mobileNumber = rawJson[k];
            if (lowerK === 'cgpa') metadata.cgpa = rawJson[k];
            if (lowerK === 'careergoal') metadata.careerGoal = rawJson[k];
            if (lowerK === 'learningstyle') metadata.learningStyle = rawJson[k];
            if (lowerK === 'weaksubjects') metadata.weakSubjects = rawJson[k];
            if (lowerK === 'avatarurl' || lowerK === 'photourl') metadata.avatarUrl = rawJson[k];
            if (lowerK === 'leetcodeuser') metadata.leetcodeUser = rawJson[k];
            if (lowerK === 'hackerrankuser') metadata.hackerrankUser = rawJson[k];
            if (lowerK === 'githubuser') metadata.githubUser = rawJson[k];
            if (lowerK === 'linkedinuser') metadata.linkedinUser = rawJson[k];
          });
        }
      } catch (e) {}
    }

    // Direct properties on user object always take highest priority!
    if (user) {
      if (user.department) { metadata.department = user.department; metadata.branch = user.department; }
      else if (user.branch) { metadata.branch = user.branch; metadata.department = user.branch; }
      if (user.college || user.collegeName) metadata.college = user.college || user.collegeName;
      if (user.rollNumber || user.roll_number) metadata.rollNumber = user.rollNumber || user.roll_number;
      if (user.year || user.yearOfStudy) metadata.year = user.year || user.yearOfStudy;
      if (user.sem || user.semester) metadata.sem = user.sem || user.semester;
      if (user.sec || user.section) metadata.sec = user.sec || user.section;
      if (user.qualification) metadata.qualification = user.qualification;
      if (user.place) metadata.place = user.place;
      if (user.mobileNumber || user.phone) metadata.mobileNumber = user.mobileNumber || user.phone;
      if (user.cgpa) metadata.cgpa = user.cgpa;
      if (user.careerGoal) metadata.careerGoal = user.careerGoal;
      if (user.learningStyle) metadata.learningStyle = user.learningStyle;
      if (user.weakSubjects) metadata.weakSubjects = user.weakSubjects;
      if (user.avatarUrl || user.photoURL) metadata.avatarUrl = user.avatarUrl || user.photoURL;
    }

    return { name: name || 'Scholar', ...metadata };
  };

  const { profile: gamifyProfile } = useGamification() || {};
  const profile = parseUserProfile(user?.name);
  const frameConfig = FRAMES.find(f => f.id === (gamifyProfile?.currentFrame || 'none')) || FRAMES[0];
  const avatarSrc = gamifyProfile?.avatarUrl || profile.avatarUrl;

  const openProfileModal = async () => {
    const prof = parseUserProfile(user?.name);
    setEditName(prof.name);
    setEditRollNumber(prof.rollNumber || user?.rollNumber || user?.roll_number || '');
    setEditDepartment(prof.department || prof.branch || user?.department || user?.branch || 'CSE');
    setEditCollege(prof.college || user?.college || 'GPREC');
    setEditYear(prof.year || user?.year || '1st Year');
    setEditSemester(prof.sem || user?.sem || user?.semester || '1');
    setEditSection(prof.sec || user?.sec || user?.section || 'A');
    setEditQualification(prof.qualification || user?.qualification || 'B.Tech');
    setEditPlace(prof.place || user?.place || 'Kurnool');
    setEditMobileNumber(prof.mobileNumber || user?.mobileNumber || user?.phone || '');
    setEditCgpa(prof.cgpa || user?.cgpa || '9.0');
    setEditCareerGoal(prof.careerGoal || user?.careerGoal || 'Placement');
    setEditLearningStyle(prof.learningStyle || user?.learningStyle || 'Practical');
    setEditWeakSubjects(prof.weakSubjects || user?.weakSubjects || 'None');
    setEditLeetcode(localStorage.getItem('lumixora_leetcode_user') || prof.leetcodeUser || '');
    setEditHackerrank(localStorage.getItem('lumixora_hackerrank_user') || prof.hackerrankUser || '');
    setEditGithub(localStorage.getItem('lumixora_github_user') || prof.githubUser || '');
    setEditLinkedin(localStorage.getItem('lumixora_linkedin_user') || prof.linkedinUser || '');
    setAvatarUrl(prof.avatarUrl || '');
    setImageFile(null);
    setShowProfileModal(true);
    setProfileModalTab('progress');

    // Fetch user progress live
    setProgressLoading(true);
    try {
      const uId = user?.uid || user?.id || user?.email || 'default';
      const uEmail = (user?.email || '').toLowerCase().trim();
      const uName = cleanScholarName(user?.name || '').toLowerCase().trim();

      // 1. Fetch completed tasks & solved coding problems
      let completed = [];

      // A. Load from Local Browser Storage (localStorage)
      try {
        const localKeys = [
          `lumixora_submissions_${uId}`,
          `lumixora_submissions_${user?.id}`,
          `lumixora_submissions_${user?.uid}`
        ];
        localKeys.forEach(k => {
          if (!k) return;
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              parsed.forEach(sub => {
                if ((sub.status === 'Accepted' || sub.status === 'Passed' || sub.passed) && !completed.some(c => c.problemId === sub.problemId || c.id === sub.id)) {
                  completed.push({
                    id: sub.id || sub.problemId || Date.now(),
                    subject: 'Code Arena',
                    dayLabel: sub.problemTitle || sub.title || 'Coding Challenge',
                    taskId: `Solved (${(sub.language || 'Code').toUpperCase()})`,
                    problemId: sub.problemId,
                    status: 'Accepted'
                  });
                }
              });
            }
          }
        });
      } catch (e) {}

      // B. Load from Packed User Metadata JSON
      try {
        if (user?.name && user.name.includes('{')) {
          const meta = JSON.parse(user.name.slice(user.name.indexOf('{')));
          if (Array.isArray(meta.submissions)) {
            meta.submissions.forEach(sub => {
              if ((sub.status === 'Accepted' || sub.status === 'Passed' || sub.passed) && !completed.some(c => c.problemId === sub.problemId || c.id === sub.id)) {
                completed.push({
                  id: sub.id || sub.problemId || Date.now(),
                  subject: 'Code Arena',
                  dayLabel: sub.problemTitle || sub.title || 'Coding Challenge',
                  taskId: `Solved (${(sub.language || 'Code').toUpperCase()})`,
                  problemId: sub.problemId,
                  status: 'Accepted'
                });
              }
            });
          }
        }
      } catch (e) {}

      // C. Load from Supabase coding_submissions table
      if (supabase && typeof supabase.from === 'function') {
        try {
          const { data: sbSubs } = await supabase
            .from('coding_submissions')
            .select('*')
            .or(`user_email.eq.${uEmail},user_id.eq.${uId}`);
          
          if (sbSubs && Array.isArray(sbSubs)) {
            sbSubs.forEach(sub => {
              if ((sub.status === 'Accepted' || sub.status === 'Passed' || sub.passed) && !completed.some(c => c.problemId === sub.problem_id || c.id === sub.id)) {
                completed.push({
                  id: sub.id || sub.problem_id || Date.now(),
                  subject: 'Code Arena',
                  dayLabel: sub.problem_title || sub.problemTitle || 'Coding Challenge',
                  taskId: `Solved (${(sub.language || 'Code').toUpperCase()})`,
                  problemId: sub.problem_id,
                  status: 'Accepted'
                });
              }
            });
          }
        } catch (sbErr) {}
      }

      // D. Load from Firestore completed_tasks
      if (db) {
        try {
          const compSnap = await getDocs(collection(db, 'completed_tasks'));
          compSnap.forEach(d => {
            const data = d.data();
            const taskUser = (data.userId || '').toLowerCase().trim();
            const taskName = (data.userName || '').toLowerCase().trim();
            if (taskUser === uId.toLowerCase() || taskUser === uEmail || (uName && taskName.includes(uName))) {
              if (!completed.some(c => c.id === d.id)) {
                completed.push({ id: d.id, ...data });
              }
            }
          });
        } catch (e) {}
      }

      // 2. Fetch test submissions
      let tests = [];
      if (db) {
        try {
          const testSnap = await getDocs(collection(db, 'test_results'));
          testSnap.forEach(d => {
            const data = d.data();
            const sEmail = (data.user_email || data.email || data.userId || '').toLowerCase().trim();
            const sName = (data.user_name || data.user || data.name || '').toLowerCase().trim();
            if (sEmail === uEmail || sEmail === uId.toLowerCase() || (uName && sName.includes(uName))) {
              tests.push({ id: d.id, ...data });
            }
          });
        } catch (e) {}
      }

      const javaCount = completed.filter(t => (t.subject || '').toLowerCase().includes('java')).length;
      let totalScore = 0;
      let maxScore = 0;
      tests.forEach(t => {
        totalScore += parseInt(t.score || 0, 10) || 0;
        maxScore += parseInt(t.total_marks || t.totalQuestions || 10, 10) || 10;
      });

      const avgAccuracy = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : (tests.length > 0 ? 80 : 0);

      // Placement Readiness starts strictly at 0% when no work is done
      let placementScore = 0;
      if (completed.length > 0 || tests.length > 0 || (user?.xp && user.xp > 100)) {
        const codingScore = Math.min(45, (completed.length * 4) + (javaCount * 3));
        const testScore = Math.min(35, (tests.length * 8) + (maxScore > 0 ? (totalScore / maxScore) * 15 : 0));
        const auraScore = Math.min(20, Math.round(((user?.xp || 0) + (user?.coins || 0)) / 120));
        placementScore = Math.min(100, Math.round(codingScore + testScore + auraScore));
      }

      setMyProgressStats({
        tasksCount: completed.length,
        javaTasksCount: javaCount,
        testsCount: tests.length,
        avgAccuracy,
        placementScore,
        tasksList: completed,
        testsList: tests
      });
    } catch (err) {
      console.warn("Failed to fetch scholar progress:", err);
    } finally {
      setProgressLoading(false);
    }
  };

  const handleExportMyPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const prof = parseUserProfile(user?.name);
      
      // Background Header
      doc.setFillColor(7, 10, 19);
      doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
      
      doc.setTextColor(45, 212, 191);
      doc.setFontSize(18);
      doc.text("VYOMRA STUDENT OS - VERIFIED SCHOLAR DOSSIER", 40, 45);
      
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.text(`Scholar: ${prof.name} | Email: ${user?.email || 'N/A'} | Generated: ${new Date().toLocaleDateString()}`, 40, 65);
      doc.text(`Institution: ${prof.college || 'GPREC'} | Year: ${prof.year} | Placement Readiness: ${myProgressStats.placementScore}%`, 40, 80);

      // Section 1: Progress Metrics
      const metricsData = [
        ['Assigned Tasks & Codes Completed', `${myProgressStats.tasksCount} Tasks (${myProgressStats.javaTasksCount} Java Track Days)`],
        ['Tests & Assessments Attempted', `${myProgressStats.testsCount} Assessments`],
        ['Average Assessment Accuracy', `${myProgressStats.avgAccuracy}%`],
        ['Placement Readiness Index', `${myProgressStats.placementScore}%`],
        ['Global Aura (AP) / Synaptic Energy (SC)', `${user?.xp || 100} AP • ${user?.coins || 100} SC`],
        ['Verification Status', 'ACTIVE & VERIFIED']
      ];

      autoTable(doc, {
        startY: 100,
        head: [['Performance Dimension', 'Verified Achievement Metric']],
        body: metricsData,
        theme: 'striped',
        headStyles: { fillColor: [20, 184, 166], textColor: 0, fontSize: 8.5, fontStyle: 'bold' },
        styles: { fontSize: 8, textColor: [229, 231, 235], fillColor: [15, 23, 42] },
        alternateRowStyles: { fillColor: [30, 41, 59] },
        margin: { left: 40, right: 40 }
      });

      // Section 2: Solved Tasks
      if (myProgressStats.tasksList.length > 0) {
        const tasksTable = myProgressStats.tasksList.slice(0, 50).map((t, i) => [
          i + 1,
          t.subject || 'Java Core & Advanced',
          t.dayLabel || 'Day 1',
          t.taskId || 'Task',
          'COMPLETED'
        ]);

        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 25,
          head: [['#', 'Subject / Track', 'Day / Module', 'Task Title / ID', 'Status']],
          body: tasksTable,
          theme: 'striped',
          headStyles: { fillColor: [147, 51, 234], textColor: 255, fontSize: 8, fontStyle: 'bold' },
          styles: { fontSize: 7.5, textColor: [229, 231, 235], fillColor: [15, 23, 42] },
          alternateRowStyles: { fillColor: [30, 41, 59] },
          margin: { left: 40, right: 40 }
        });
      }

      doc.save(`Vyomra_${prof.name.replace(/\s+/g, '_')}_Progress_Transcript.pdf`);
      addToast({ message: 'Downloaded your Verified Scholar Transcript PDF!', type: 'success' });
    } catch (e) {
      console.error(e);
      addToast({ message: 'Failed to generate PDF.', type: 'error' });
    }
  };

  const handleExportMyExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      const prof = parseUserProfile(user?.name);

      const summary = [{
        'Scholar Name': prof.name,
        'Email': user?.email || 'N/A',
        'College': prof.college || 'GPREC',
        'Year': prof.year,
        'Tasks Completed': myProgressStats.tasksCount,
        'Java Track Days': myProgressStats.javaTasksCount,
        'Tests Attempted': myProgressStats.testsCount,
        'Average Accuracy': `${myProgressStats.avgAccuracy}%`,
        'Placement Readiness': `${myProgressStats.placementScore}%`,
        'Global Aura (AP)': user?.xp || 100,
        'Synaptic Energy (SC)': user?.coins || 100
      }];
      const wsSum = XLSX.utils.json_to_sheet(summary);
      XLSX.utils.book_append_sheet(wb, wsSum, 'Scholar Profile');

      const tasksRows = myProgressStats.tasksList.map((t, i) => ({
        '#': i + 1,
        'Subject': t.subject || 'Java Core & Advanced',
        'Day / Timeline': t.dayLabel || 'Day 1',
        'Task ID': t.taskId || 'Task',
        'Status': 'COMPLETED'
      }));
      const wsTasks = XLSX.utils.json_to_sheet(tasksRows.length > 0 ? tasksRows : [{ 'Status': 'No tasks yet' }]);
      XLSX.utils.book_append_sheet(wb, wsTasks, 'Solved Tasks & Codes');

      const testsRows = myProgressStats.testsList.map((t, i) => ({
        '#': i + 1,
        'Test Title': t.test_title || t.testTitle || 'Assessment',
        'Score': t.score || 0,
        'Total': t.total_marks || t.totalQuestions || 10,
        'Accuracy': t.accuracy ? `${t.accuracy}%` : 'N/A'
      }));
      const wsTests = XLSX.utils.json_to_sheet(testsRows.length > 0 ? testsRows : [{ 'Status': 'No test attempts yet' }]);
      XLSX.utils.book_append_sheet(wb, wsTests, 'Test Submissions');

      XLSX.writeFile(wb, `Vyomra_${prof.name.replace(/\s+/g, '_')}_Activity_Log.xlsx`);
      addToast({ message: 'Exported your complete Activity Log to Excel!', type: 'success' });
    } catch (e) {
      console.error(e);
      addToast({ message: 'Failed to generate Excel file.', type: 'error' });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      addToast({ message: 'Name cannot be empty.', type: 'warning' });
      return;
    }

    setIsSaving(true);
    try {
      let finalAvatarUrl = avatarUrl;

      // 1. Upload profile image to Firebase Storage if a new file is chosen
      if (imageFile) {
        try {
          const storageRef = ref(storage, `avatars/${user?.id || user?.uid || Date.now()}_${imageFile.name}`);
          await uploadBytes(storageRef, imageFile);
          finalAvatarUrl = await getDownloadURL(storageRef);
        } catch (uploadErr) {
          console.warn("Avatar upload warning:", uploadErr);
        }
      }

      // Save platform handles to localStorage for 100% persistent retention on refresh
      localStorage.setItem('lumixora_leetcode_user', editLeetcode.trim());
      localStorage.setItem('lumixora_hackerrank_user', editHackerrank.trim());
      localStorage.setItem('lumixora_github_user', editGithub.trim());
      localStorage.setItem('lumixora_linkedin_user', editLinkedin.trim());

      const cleanName = editName.trim();
      const cleanRollNumber = editRollNumber.trim().toUpperCase();
      const cleanDept = editDepartment.trim() || 'CSE';
      const cleanCollege = editCollege.trim() || 'GPREC';
      const cleanQualification = editQualification.trim() || 'B.Tech';
      const cleanPlace = editPlace.trim() || 'Kurnool';
      const cleanMobile = editMobileNumber.trim();
      const cleanCgpa = editCgpa.trim() || '9.0';
      const cleanGoal = editCareerGoal || 'Placement';
      const cleanLearning = editLearningStyle || 'Practical';
      const cleanWeak = editWeakSubjects.trim() || 'None';

      const packedMetadata = {
        qualification: cleanQualification,
        college: cleanCollege,
        department: cleanDept,
        branch: cleanDept,
        place: cleanPlace,
        year: editYear,
        sem: editSemester,
        sec: editSection,
        rollNumber: cleanRollNumber,
        mobileNumber: cleanMobile,
        cgpa: cleanCgpa,
        careerGoal: cleanGoal,
        learningStyle: cleanLearning,
        weakSubjects: cleanWeak,
        avatarUrl: finalAvatarUrl || user?.avatarUrl,
        leetcodeUser: editLeetcode.trim(),
        hackerrankUser: editHackerrank.trim(),
        githubUser: editGithub.trim(),
        linkedinUser: editLinkedin.trim()
      };

      const updatedUser = {
        ...user,
        name: cleanName,
        displayName: cleanName,
        full_name: cleanName,
        rollNumber: cleanRollNumber,
        roll_number: cleanRollNumber,
        department: cleanDept,
        branch: cleanDept,
        college: cleanCollege,
        collegeName: cleanCollege,
        year: editYear,
        yearOfStudy: editYear,
        sem: editSemester,
        semester: editSemester,
        sec: editSection,
        section: editSection,
        qualification: cleanQualification,
        place: cleanPlace,
        mobileNumber: cleanMobile,
        phone: cleanMobile,
        cgpa: cleanCgpa,
        careerGoal: cleanGoal,
        learningStyle: cleanLearning,
        weakSubjects: cleanWeak,
        leetcodeUser: editLeetcode.trim(),
        hackerrankUser: editHackerrank.trim(),
        githubUser: editGithub.trim(),
        linkedinUser: editLinkedin.trim(),
        avatarUrl: finalAvatarUrl || user?.avatarUrl,
        photoURL: finalAvatarUrl || user?.photoURL
      };

      // 2. Persist to localStorage immediately
      localStorage.setItem('lumixora_user', JSON.stringify(updatedUser));

      // 3. Update Firebase Auth
      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, {
            displayName: cleanName,
            photoURL: finalAvatarUrl || auth.currentUser.photoURL
          });
        } catch (authErr) {
          console.warn("Auth update warning:", authErr);
        }
      }

      // 4. Update Supabase database
      if (supabase && typeof supabase.from === 'function') {
        try {
          const userEmail = (user?.email || '').toLowerCase().trim();
          if (userEmail) {
            await supabase.from('users').update({
              name: cleanName,
              full_name: cleanName,
              college: cleanCollege,
              year: editYear,
              department: cleanDept,
              branch: cleanDept,
              roll_number: cleanRollNumber,
              avatar_url: finalAvatarUrl || null
            }).eq('email', userEmail);
          }
        } catch (sbErr) {
          console.warn("Supabase profile sync warning:", sbErr);
        }
      }

      // 5. Update Firestore database
      const uIds = [user?.id, user?.uid, auth.currentUser?.uid, user?.email].filter(Boolean);
      for (const uid of uIds) {
        try {
          await setDoc(doc(db, 'users', String(uid)), { 
            name: cleanName,
            displayName: cleanName,
            ...packedMetadata
          }, { merge: true });

          await setDoc(doc(db, 'Users', String(uid)), { 
            name: cleanName,
            displayName: cleanName,
            ...packedMetadata
          }, { merge: true });
        } catch (dbErr) {
          console.warn("Firestore sync warning:", dbErr);
        }
      }

      // 6. Update React parent state & notify components
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      window.dispatchEvent(new CustomEvent('lumixora_user_updated', { detail: updatedUser }));

      addToast({ message: 'All profile and academic details saved successfully!', type: 'success' });
      setShowProfileModal(false);
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex pb-16 lg:pb-0">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
        onExitApp={onExitApp}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full lg:pl-[250px] bg-[var(--bg-main)]">
        {/* Top Header Bar (Fixed & pinned at top on all scrolls) */}
        <header className="fixed top-0 right-0 left-0 lg:left-[250px] h-16 lg:h-20 bg-[var(--bg-sidebar)]/95 backdrop-blur-xl text-[var(--text-main)] border-b border-[var(--border-color)] px-4 lg:px-6 flex items-center justify-between z-40 shadow-sm transition-all">
          {/* Left: Hamburger + Back Button + Welcome */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Hamburger */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-brand-primary hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Native App Back Button */}
            {activeTab !== 'dashboard' && activeTab !== 'founder-portal' && (
              <button
                onClick={() => setActiveTab(user?.role === 'founder' ? 'founder-portal' : 'dashboard')}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs tracking-wide flex items-center gap-1.5 border border-white/10 cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-brand-teal" />
                <span>Back</span>
              </button>
            )}

            <div className="hidden xl:block">
              <h2 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-1.5 tracking-wide">
                Welcome back, {profile.name ? profile.name.split(' ')[0].charAt(0).toUpperCase() + profile.name.split(' ')[0].slice(1).toLowerCase() : 'Student'} <span className="animate-bounce">👋</span>
              </h2>
              <p className="text-[10px] text-[var(--text-secondary)] font-semibold tracking-wide mt-0.5">Explore your personalized academic portal</p>
            </div>
          </div>

          {/* Middle: Sleek Global Spotlight Search Bar (Ctrl+K) */}
          <div className="flex-1 max-w-xl mx-2 md:mx-6 min-w-0">
            <button
              onClick={() => setShowGlobalSearch(true)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-[var(--text-secondary)] hover:text-white transition-all shadow-inner group cursor-pointer"
              title="Search portals, notes, doubts, and tracks (Ctrl+K)"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-xs font-medium truncate text-gray-300">
                  Search portals, notes, doubts, career tracks...
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold bg-white/10 text-cyan-300 rounded-lg border border-white/10">
                  Ctrl+K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Super Admin B2B Campus Switcher */}
            {(user?.role === 'founder' || user?.email?.toLowerCase() === 'founder@lumixora.com' || user?.email?.toLowerCase() === '249xa33106@gprec.ac.in' || user?.email?.toLowerCase() === '249xa33106@gmail.com') && (
              <div className="relative">
                <button
                  onClick={() => setShowCampusMenu(!showCampusMenu)}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400/10 via-brand-teal/10 to-purple-600/10 hover:from-amber-400/20 hover:to-brand-teal/20 border border-amber-400/40 text-xs font-extrabold text-amber-300 flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                  title="Switch Active Licensed Campus"
                >
                  <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="hidden md:inline max-w-[130px] truncate">{activeCampusName}</span>
                  <span className="text-[9px] bg-amber-400/20 text-amber-400 border border-amber-400/30 px-1.5 py-0.5 rounded font-black uppercase">
                    B2B
                  </span>
                </button>

                {showCampusMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCampusMenu(false)} />
                    <div className="absolute right-0 mt-2 w-76 max-w-[calc(100vw-2rem)] glass-panel bg-[#12121e] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-1 backdrop-blur-xl">
                      <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-amber-400" /> Switch Campus View
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                          {campusesList.length} Campuses
                        </span>
                      </div>

                      <button
                        onClick={() => handleSelectCampus('all', 'All Campuses (Enterprise HQ)')}
                        className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                          activeCampusId === 'all'
                            ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                            : 'text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">🌐</span>
                          <div>
                            <p className="font-extrabold text-white text-xs">All Campuses (Global HQ)</p>
                            <p className="text-[10px] text-gray-400">Enterprise Overview</p>
                          </div>
                        </div>
                        {activeCampusId === 'all' && <Check className="w-4 h-4 text-amber-400" />}
                      </button>

                      {campusesList.map(c => (
                        <button
                          key={c.id}
                          onClick={() => handleSelectCampus(c.id, c.shortName || c.name)}
                          className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                            activeCampusId === c.id
                              ? 'bg-brand-teal/20 text-brand-teal border border-brand-teal/30'
                              : 'text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{c.logo || '🏛️'}</span>
                            <div className="max-w-[170px] truncate">
                              <p className="font-extrabold text-white text-xs truncate">{c.shortName || c.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{c.code || c.id} · {c.licenseTier || 'Pro'}</p>
                            </div>
                          </div>
                          {activeCampusId === c.id && <Check className="w-4 h-4 text-brand-teal" />}
                        </button>
                      ))}

                      <div className="pt-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            setShowCampusMenu(false);
                            setActiveTab('founder-portal');
                          }}
                          className="w-full py-2 bg-gradient-to-r from-brand-pink/20 to-purple-600/20 hover:from-brand-pink/30 hover:to-purple-600/30 border border-brand-pink/30 text-brand-pink text-xs font-extrabold rounded-xl text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Onboard / License New College
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Visual Effects & Mascot Themes Selector */}
            <div className="relative">
              <button
                onClick={toggleCursorGlow}
                title="Select Visual Effects & Mascot Themes"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  cursorGlowEnabled
                    ? 'bg-gradient-to-br from-emerald-500/20 via-purple-500/20 to-pink-500/20 border-emerald-400/50 text-[#00f5d4] shadow-[0_0_15px_rgba(0,245,212,0.3)]'
                    : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-brand-primary hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${cursorGlowEnabled ? 'text-[#00f5d4] animate-pulse' : ''}`} />
              </button>

              {showCursorMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowCursorMenu(false)} />
                  <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] glass-panel bg-[#12121e] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 p-2.5 space-y-1 backdrop-blur-xl">
                    <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-black text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Choose Visual Effect Theme
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                        {cursorGlowEnabled ? 'Active' : 'OFF'}
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                      <button
                        onClick={() => handleSelectCursorStyle('off')}
                        className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                          !cursorGlowEnabled
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'text-gray-400 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🚫</span>
                          <div>
                            <p className="font-extrabold text-xs">Disable Visual Effects</p>
                            <p className="text-[10px] text-gray-500">Standard clean cursor</p>
                          </div>
                        </div>
                        {!cursorGlowEnabled && <Check className="w-4 h-4 text-red-400" />}
                      </button>

                      {ALL_CURSOR_STYLES.map(style => (
                        <button
                          key={style.id}
                          onClick={() => handleSelectCursorStyle(style.id)}
                          className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                            cursorGlowEnabled && cursorStyle === style.id
                              ? 'bg-gradient-to-r from-brand-pink/20 to-purple-600/20 text-brand-pink border border-brand-pink/40 shadow-sm'
                              : 'text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="text-base mt-0.5">{style.name.split(' ')[0]}</span>
                            <div>
                              <p className="font-extrabold text-white text-xs leading-snug">{style.name.split(' ').slice(1).join(' ')}</p>
                              <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{style.desc}</p>
                            </div>
                          </div>
                          {cursorGlowEnabled && cursorStyle === style.id && <Check className="w-4 h-4 text-brand-pink shrink-0 ml-1" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-brand-primary hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer"
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4" />
                : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-brand-primary hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-orange shadow-sm"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-panel border border-border-glass rounded-2xl shadow-xl overflow-hidden z-30">
                  <div className="p-4 border-b border-border-glass flex items-center justify-between bg-white/5">
                    <span className="text-xs font-bold text-gray-200">Recent Notifications</span>
                    <button 
                      onClick={markAllNotificationsRead} 
                      className="text-[10px] text-brand-teal font-semibold hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-500">
                        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            if (n.action === 'open_profile_settings' || (n.text && n.text.toLowerCase().includes('profile'))) {
                              setShowNotifications(false);
                              openProfileModal();
                              setProfileModalTab('settings');
                            }
                          }}
                          className="p-3 border-b border-border-glass hover:bg-white/5 flex items-start gap-3 transition-colors cursor-pointer"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-brand-teal animate-pulse' : 'bg-gray-600'}`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-gray-300 leading-snug">{n.text}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[9px] text-gray-500 block">{n.time}</span>
                              {n.action === 'open_profile_settings' && (
                                <span className="text-[9px] text-brand-teal font-extrabold hover:underline">Update Now &rarr;</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar trigger */}
            <button 
              onClick={openProfileModal}
              className="flex items-center gap-3 p-1 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-brand-teal transition-all cursor-pointer"
            >
              <div className={`w-9 h-9 rounded-xl overflow-hidden border ${frameConfig.border || 'border-white/10'} shadow-sm relative shrink-0`}>
                {profile.avatarUrl && profile.avatarUrl !== '/lumixora_logo.jpg' ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-brand-teal via-[#0d9488] to-brand-blue flex items-center justify-center font-black text-white text-xs shadow-inner">
                    {getScholarInitials(user?.name || user?.displayName)}
                  </div>
                )}
              </div>
            </button>
          </div>
        </header>

        {/* Fixed Header Height Spacer */}
        <div className="h-16 lg:h-20 shrink-0 w-full" aria-hidden="true" />

        {/* Main Body View */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Profile Audit & Correction Banner for all users */}
          {showAuditBanner && (
            <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-brand-teal/15 to-purple-600/15 border border-amber-400/30 text-white shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex items-start sm:items-center gap-3.5 relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-xl shadow-md">
                  📢
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-white text-sm md:text-base">Official Scholar Profile Verification & Audit</h4>
                    <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-400/40">Action Required</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed max-w-3xl">
                    Please review and correct your details (Roll Number, Branch/Dept, Year of Study, Semester, Section, Mobile, Placement Target, LeetCode handles) to ensure verified college transcripts and recruiter dossiers stay 100% accurate.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto relative z-10">
                <button
                  onClick={() => {
                    openProfileModal();
                    setProfileModalTab('settings');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-blue text-black font-extrabold text-xs shadow-lg hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Review & Update Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setShowAuditBanner(false);
                    localStorage.setItem('lumixora_audit_banner_dismissed', 'true');
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer border border-white/10"
                  title="Dismiss notice"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Mobile App Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0b14]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex justify-around items-center text-white shadow-2xl">
        <button
          onClick={() => setActiveTab(user?.role === 'founder' ? 'founder-portal' : 'dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold cursor-pointer ${activeTab === 'dashboard' || activeTab === 'founder-portal' ? 'text-brand-pink' : 'text-gray-400'}`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('coding-practice')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold cursor-pointer ${activeTab === 'coding-practice' || activeTab === 'code-editor' ? 'text-brand-teal' : 'text-gray-400'}`}
        >
          <Code className="w-4 h-4" />
          <span>Arena</span>
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold cursor-pointer ${activeTab === 'community' ? 'text-brand-purple' : 'text-gray-400'}`}
        >
          <Users className="w-4 h-4" />
          <span>Network</span>
        </button>

        <button
          onClick={() => setActiveTab('future-twin')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold cursor-pointer ${activeTab === 'future-twin' ? 'text-brand-pink' : 'text-gray-400'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Twin</span>
        </button>

        <button
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[9px] font-bold text-gray-400 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </div>

      {/* Scholar Profile & Verified Progress Center Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-5 sm:p-7 border border-white/15 relative overflow-hidden bg-[#0a0b12] text-white shadow-2xl animate-fade-in my-8 max-h-[90vh] flex flex-col">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10 relative z-10 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-brand-teal/50 shadow-md shrink-0">
                  {avatarUrl || (profile.avatarUrl && profile.avatarUrl !== '/lumixora_logo.jpg') ? (
                    <img src={avatarUrl || profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-brand-teal via-[#0d9488] to-brand-blue flex items-center justify-center font-black text-white text-lg shadow-inner">
                      {getScholarInitials(editName || user?.name || user?.displayName)}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    {cleanScholarName(user?.name || user?.displayName)}
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal text-[10px] font-black uppercase tracking-wider border border-brand-teal/30">
                      Verified Scholar
                    </span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">
                    {user?.email || 'N/A'} • <span className="text-gray-300 font-semibold">{editCollege || 'GPREC'} ({editYear || '1st Year'})</span>
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowProfileModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 pt-4 pb-3 relative z-10 shrink-0 border-b border-white/5">
              <button
                onClick={() => setProfileModalTab('progress')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  profileModalTab === 'progress'
                    ? 'bg-brand-teal text-black shadow-md font-black'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                My Progress & Analytics
              </button>
              <button
                onClick={() => setProfileModalTab('history')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  profileModalTab === 'history'
                    ? 'bg-brand-purple text-white shadow-md font-black'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Solved Codes & History ({myProgressStats.tasksCount + myProgressStats.testsCount})
              </button>
              <button
                onClick={() => setProfileModalTab('settings')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  profileModalTab === 'settings'
                    ? 'bg-white/20 text-white shadow-md font-black'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto pt-4 space-y-6 relative z-10 pr-1">
              {profileModalTab === 'progress' && (
                <div className="space-y-6 animate-fade-in">
                  {/* 4 Core Progress Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-brand-teal/5 border border-brand-teal/20 relative overflow-hidden">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Placement Readiness</span>
                      <span className="text-2xl font-black text-brand-teal mt-1 block">{myProgressStats.placementScore}%</span>
                      <span className={`text-[9px] font-semibold mt-1 block ${
                        myProgressStats.placementScore >= 75 
                          ? 'text-emerald-400' 
                          : myProgressStats.placementScore >= 55 
                            ? 'text-teal-300' 
                            : 'text-amber-300'
                      }`}>
                        {myProgressStats.placementScore >= 75 
                          ? '🚀 Drive Ready' 
                          : myProgressStats.placementScore >= 55 
                            ? '⚡ Advancing' 
                            : '📈 Foundation'}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 relative overflow-hidden">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Codes Solved</span>
                      <span className="text-2xl font-black text-brand-purple mt-1 block">{myProgressStats.tasksCount}</span>
                      <span className="text-[9px] text-purple-300 font-semibold mt-1 block">{myProgressStats.javaTasksCount} Java Days</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 relative overflow-hidden">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Tests Attempted</span>
                      <span className="text-2xl font-black text-amber-400 mt-1 block">{myProgressStats.testsCount}</span>
                      <span className="text-[9px] text-amber-300 font-semibold mt-1 block">Avg: {myProgressStats.avgAccuracy}%</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 relative overflow-hidden">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Global Aura (AP)</span>
                      <span className="text-2xl font-black text-blue-400 mt-1 block">{user?.xp || 100}</span>
                      <span className="text-[9px] text-blue-300 font-semibold mt-1 block">{user?.coins || 100} SC Energy</span>
                    </div>
                  </div>

                  {/* Tracks & Progress Bars */}
                  <div className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-brand-teal" /> Curriculum Tracks Progress
                    </h3>

                    {/* Java 30-Day Master Track */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-200">☕ 30-Day Java Master Track (Basic to Advance)</span>
                        <span className="text-brand-teal font-mono font-bold">{myProgressStats.javaTasksCount} / 30 Days ({Math.min(100, Math.round((myProgressStats.javaTasksCount / 30) * 100))}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-black/50 border border-white/5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-brand-teal to-brand-blue rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, Math.min(100, (myProgressStats.javaTasksCount / 30) * 100))}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Placement Readiness Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-200">🎯 Campus Placement & Aptitude Readiness</span>
                        <span className="text-brand-pink font-mono font-bold">{myProgressStats.placementScore}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-black/50 border border-white/5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-brand-pink to-brand-purple rounded-full transition-all duration-500"
                          style={{ width: `${myProgressStats.placementScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Export Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={handleExportMyPDF}
                      className="flex-1 py-3 px-4 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Download My Verified Transcript (.pdf)
                    </button>
                    <button
                      onClick={handleExportMyExcel}
                      className="flex-1 py-3 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <FileSpreadsheet className="w-4 h-4" /> Export Activity Log (.xlsx)
                    </button>
                  </div>
                </div>
              )}

              {profileModalTab === 'history' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Completed Daily Tasks & Coding</h3>
                  {myProgressStats.tasksList.length === 0 ? (
                    <div className="p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl text-xs text-gray-500">
                      No daily tasks marked completed yet. Visit <span className="text-brand-teal font-bold">Assigned Tasks</span> to complete your Java 30-day track!
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {myProgressStats.tasksList.map((t, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-brand-teal/20 text-brand-teal text-xs font-bold flex items-center justify-center">
                              #{idx + 1}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-white">{t.subject || 'Java Track'} • <span className="text-brand-teal">{t.dayLabel || 'Day 1'}</span></p>
                              <p className="text-[10px] text-gray-400">{t.taskId || 'Task Complete'}</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                            COMPLETED
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest pt-3">Test Submissions & Scores</h3>
                  {myProgressStats.testsList.length === 0 ? (
                    <div className="p-6 text-center bg-white/[0.02] border border-white/5 rounded-2xl text-xs text-gray-500">
                      No test attempts recorded yet.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {myProgressStats.testsList.map((ts, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-white">{ts.test_title || ts.testTitle || 'Exam Assessment'}</p>
                            <p className="text-[10px] text-gray-400">Score: {ts.score || 0} / {ts.total_marks || ts.totalQuestions || 10}</p>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                            {ts.accuracy ? `${ts.accuracy}%` : 'Attempted'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {profileModalTab === 'settings' && (
                <form onSubmit={handleSaveProfile} className="space-y-4 animate-fade-in">
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-brand-teal group shadow-lg">
                      {avatarUrl || (profile.avatarUrl && profile.avatarUrl !== '/lumixora_logo.jpg') ? (
                        <img src={avatarUrl || profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-brand-teal via-[#0d9488] to-brand-blue flex items-center justify-center font-black text-white text-2xl shadow-inner select-none">
                          {getScholarInitials(editName || user?.name || user?.displayName)}
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                        <Camera className="w-6 h-6 text-white" />
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-gray-300 hover:text-white cursor-pointer flex items-center gap-1.5 transition-all">
                        <Camera className="w-3.5 h-3.5 text-brand-teal" />
                        <span>Upload Photo</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      {(avatarUrl || (profile.avatarUrl && profile.avatarUrl !== '/lumixora_logo.jpg')) && (
                        <button
                          type="button"
                          onClick={() => { setAvatarUrl(''); setImageFile(null); }}
                          className="px-3 py-1.5 rounded-xl bg-brand-teal/15 hover:bg-brand-teal/25 border border-brand-teal/30 text-[10px] font-bold text-brand-teal cursor-pointer flex items-center gap-1.5 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Use Name Avatar ({getScholarInitials(editName || user?.name)})</span>
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">Personalized initial avatar automatically generates from your name</span>
                  </div>

                  {/* Section 1: Basic Identity */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-white/5">
                      <GraduationCap className="w-3.5 h-3.5 text-brand-teal" />
                      <span className="text-[11px] font-black text-white uppercase tracking-wider">Academic Identity</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          required
                          placeholder="e.g. Mohammed Sowban"
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-teal transition-all font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-teal block mb-1">Roll Number / Student ID</label>
                        <input
                          type="text"
                          value={editRollNumber}
                          onChange={(e) => setEditRollNumber(e.target.value)}
                          placeholder="e.g. 249XA33106"
                          className="w-full bg-[#111118] border border-brand-teal/30 rounded-xl px-3.5 py-2 text-xs text-brand-teal font-mono uppercase focus:outline-none focus:border-brand-teal transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Branch / Department</label>
                        <input
                          type="text"
                          value={editDepartment}
                          onChange={(e) => setEditDepartment(e.target.value)}
                          placeholder="e.g. CSE (AI & ML), ECE, MECH"
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-teal transition-all font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">College / Institution</label>
                        <input
                          type="text"
                          value={editCollege}
                          onChange={(e) => setEditCollege(e.target.value)}
                          placeholder="e.g. G. Pulla Reddy Engineering College"
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-purple transition-all font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Year</label>
                        <select
                          value={editYear}
                          onChange={(e) => setEditYear(e.target.value)}
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-white/20 transition-all cursor-pointer font-medium"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Semester</label>
                        <select
                          value={editSemester}
                          onChange={(e) => setEditSemester(e.target.value)}
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-white/20 transition-all cursor-pointer font-medium"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                            <option key={s} value={String(s)}>Sem {s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Section</label>
                        <input
                          type="text"
                          value={editSection}
                          onChange={(e) => setEditSection(e.target.value)}
                          placeholder="e.g. A"
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-gray-200 uppercase text-center focus:outline-none focus:border-brand-teal transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Degree / Qualification</label>
                        <input
                          type="text"
                          value={editQualification}
                          onChange={(e) => setEditQualification(e.target.value)}
                          placeholder="e.g. B.Tech, M.Tech, MCA"
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-purple transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Place / City</label>
                        <input
                          type="text"
                          value={editPlace}
                          onChange={(e) => setEditPlace(e.target.value)}
                          placeholder="e.g. Kurnool, AP"
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-blue transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Contact & Career Targets */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 pb-1 border-b border-white/5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                      <span className="text-[11px] font-black text-white uppercase tracking-wider">Contact & Career Roadmap</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Mobile / WhatsApp Number</label>
                        <input
                          type="text"
                          value={editMobileNumber}
                          onChange={(e) => setEditMobileNumber(e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-teal transition-all font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Target CGPA</label>
                        <input
                          type="text"
                          value={editCgpa}
                          onChange={(e) => setEditCgpa(e.target.value)}
                          placeholder="e.g. 9.0"
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-teal transition-all font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Career Goal</label>
                        <select
                          value={editCareerGoal}
                          onChange={(e) => setEditCareerGoal(e.target.value)}
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-purple transition-all cursor-pointer"
                        >
                          <option value="Placement">Campus Placement (Software Engineer)</option>
                          <option value="Higher Studies">Higher Studies (MS / M.Tech)</option>
                          <option value="GATE / PSU">GATE / PSU Examination</option>
                          <option value="Tech Startup">Tech Startup Founder</option>
                          <option value="AI / ML Research">AI / ML Research</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Learning Style</label>
                        <select
                          value={editLearningStyle}
                          onChange={(e) => setEditLearningStyle(e.target.value)}
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-blue transition-all cursor-pointer"
                        >
                          <option value="Practical">Practical / Hands-on Coding</option>
                          <option value="Theory First">Theory & Core Concepts First</option>
                          <option value="Project Driven">Project-Driven Building</option>
                          <option value="Competitive">Competitive Coding</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Focus / Weak Subjects (For AI Twin)</label>
                      <input
                        type="text"
                        value={editWeakSubjects}
                        onChange={(e) => setEditWeakSubjects(e.target.value)}
                        placeholder="e.g. Data Structures, Operating Systems, DBMS"
                        className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-purple transition-all"
                      />
                    </div>
                  </div>

                  {/* Section 3: Developer & Coding Profiles */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 pb-1 border-b border-white/5">
                      <Code className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-black text-white uppercase tracking-wider">Coding & Tech Handles</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">LeetCode Username</label>
                        <input
                          type="text"
                          value={editLeetcode}
                          onChange={(e) => setEditLeetcode(e.target.value)}
                          placeholder="e.g. leet_coder"
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-amber-400 transition-all font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">HackerRank Username</label>
                        <input
                          type="text"
                          value={editHackerrank}
                          onChange={(e) => setEditHackerrank(e.target.value)}
                          placeholder="e.g. hr_coder"
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-emerald-400 transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-300 block mb-1">GitHub Profile Username</label>
                        <input
                          type="text"
                          value={editGithub}
                          onChange={(e) => setEditGithub(e.target.value)}
                          placeholder="e.g. github_scholar"
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-white/30 transition-all font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-blue block mb-1">LinkedIn Profile Username</label>
                        <input
                          type="text"
                          value={editLinkedin}
                          onChange={(e) => setEditLinkedin(e.target.value)}
                          placeholder="e.g. in/scholar-name"
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-blue transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3.5 rounded-xl font-bold text-xs tracking-wide bg-gradient-to-r from-brand-teal to-brand-blue text-black hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
                  >
                    {isSaving ? <span>Saving Verified Details...</span> : <span>Save All Profile Changes</span>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Official Student Name & Roll Update Modal */}
      {showNameUpdatePrompt && (
        <div className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel bg-[#0e0e1a] border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/50 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-amber-400/20">
              🎓
            </div>
            <div className="text-center space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Action Required
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white font-sora pt-1">
                Enter Official Student Details
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Your account is currently named <span className="text-amber-300 font-bold font-mono">"Scholar"</span>. Please enter your official full name and college roll number for placement dossiers & verified exam records.
              </p>
            </div>

            <form onSubmit={handleQuickNameUpdate} className="space-y-4 pt-1">
              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Full Name (As per College Records) *
                </label>
                <input
                  type="text"
                  required
                  value={newNameInput}
                  onChange={(e) => setNewNameInput(e.target.value)}
                  placeholder="e.g. Bugulu Akshaya / Rahul Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  College Roll Number *
                </label>
                <input
                  type="text"
                  required
                  value={newRollInput}
                  onChange={(e) => setNewRollInput(e.target.value.toUpperCase())}
                  placeholder="e.g. 249XA33106"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none uppercase font-mono transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingName || !newNameInput.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-orange-500/25 mt-2"
              >
                {isUpdatingName ? (
                  <span>Saving Official Records...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save & Continue to Platform</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Command / Spotlight Search Modal */}
      <GlobalSearchModal 
        isOpen={showGlobalSearch} 
        onClose={() => setShowGlobalSearch(false)} 
        onSelectTab={(tab) => setActiveTab(tab)} 
      />
    </div>
  );
}
