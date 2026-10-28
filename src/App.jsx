import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import DoubtSolving from './pages/DoubtSolving';
import NotesPlatform from './pages/NotesPlatform';
import TaskManager from './pages/TaskManager';
import AuthPortal from './pages/AuthPortal';
import LandingPage from './pages/LandingPage';
import AiFutureTwin from './pages/AiFutureTwin';
import LearningHub from './pages/LearningHub';
import ContributeNotes from './pages/ContributeNotes';
import ContactUs from './pages/ContactUs';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { GamificationProvider } from './context/GamificationContext';
import { ThemeProvider } from './context/ThemeContext';
import CodingPractice from './pages/CodingPractice';
import CodeEditorPage from './pages/CodeEditorPage';
import PersonalMentor from './pages/PersonalMentor';
import MyAcademics from './pages/MyAcademics';
import { isValidInstitutionalEmail, isGprecScholar, hasPaidCollegeFee, isAnjum, isExemptFromPayment } from './data/collegesData';
import CollegeAccessFeeModal from './components/CollegeAccessFeeModal';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import { supabase } from './config/supabase';
import { checkAppUpdate, isVersionOutdated, CURRENT_VERSION } from './services/updateService';
import { Lock, RefreshCw, LogOut, ShieldCheck, AlertTriangle } from 'lucide-react';
import { checkUserAccessStatus, cleanScholarName, isFounderEmail } from './utils/authSecurity';
import StudyWithMe from './pages/StudyWithMe';
import ReportBug from './pages/ReportBug';
import LifeReplay from './pages/LifeReplay';
import FounderPortal from './pages/FounderPortal';
import TestPortal from './pages/TestPortal';
import AssignedTasksPortal from './pages/AssignedTasksPortal';
import AttendancePortal from './pages/AttendancePortal';
import Marketplace from './pages/Marketplace';
import CommunityPortal from './pages/CommunityPortal';
import JoinGroup from './pages/JoinGroup';
import CareerRoadmap from './pages/CareerRoadmap';
import SimulationPortal from './pages/SimulationPortal';
import AiPlacementCommander from './pages/AiPlacementCommander';
import ClubsPortal from './pages/ClubsPortal';
import FacultyPortal from './pages/FacultyPortal';
import HackathonPortal from './pages/HackathonPortal';
import GrievancePortal from './pages/GrievancePortal';
import ProjectShowcase from './pages/ProjectShowcase';
import ResumeCreator from './pages/ResumeCreator';
import VideoPortal from './pages/VideoPortal';
import TeamPortal from './pages/TeamPortal';
import OurTeamPortal from './pages/OurTeamPortal';
import AlumniReferralBridge from './pages/AlumniReferralBridge';
import CompanyPlacementPapers from './pages/CompanyPlacementPapers';
import AptitudeArena from './components/AptitudeArena';
import PlatformTourModal from './components/PlatformTourModal';
import CinematicIntro from './components/CinematicIntro';
import TomAndJerryIntro from './components/TomAndJerryIntro';
import CursorGlow from './components/CursorGlow';
import CadEnglishClubPortal from './components/CadEnglishClubPortal';
import PublicCadMemberPass from './pages/PublicCadMemberPass';
import AiMockInterviewRoom from './pages/AiMockInterviewRoom';
import ProofOfSkillCertificates from './pages/ProofOfSkillCertificates';
import PublicCertificateVerification from './pages/PublicCertificateVerification';
import CoursesPortal from './pages/CoursesPortal';
import BoloClassPortal from './pages/BoloClassPortal';
import EduPulsePortal from './pages/EduPulsePortal';
import RelayPortal from './pages/RelayPortal';
import InternshipPortal from './pages/InternshipPortal';
import InternWorkspacePortal from './pages/InternWorkspacePortal';
import ProjectVerse from './pages/ProjectVerse';

function App() {
  const [showIntro, setShowIntro] = useState(false);
  const [showTomAndJerryIntro, setShowTomAndJerryIntro] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.toLowerCase();
      if (pathname === '/verify' || pathname.startsWith('/verify/')) return 'verify';
      if (window.location.hash) {
        const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase().split('/')[0];
        if (['verify', 'verify-cert', 'cert-verify', 'credential-verify'].includes(hash)) return 'verify';
      }
    }
    return 'dashboard';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('lumixora_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        const access = checkUserAccessStatus(u);
        if (!access.allowed) return false;
      } catch (e) {
        return false;
      }
    } else {
      return false;
    }
    return localStorage.getItem('lumixora_isAuthenticated') === 'true';
  });
  const [currentHash, setCurrentHash] = useState(() => typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '');

  useEffect(() => {
    const handleHashSync = () => {
      if (typeof window !== 'undefined') {
        setCurrentHash(window.location.hash.toLowerCase());
      }
    };
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);
  const [lockedAccountInfo, setLockedAccountInfo] = useState(() => {
    const saved = localStorage.getItem('lumixora_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        const access = checkUserAccessStatus(u);
        if (!access.allowed) {
          return {
            email: u.email,
            name: cleanScholarName(u.name || u.displayName),
            role: u.role || 'faculty',
            department: u.department || u.branch || 'CSE',
            reason: access.reason,
            message: access.message
          };
        }
      } catch (e) {}
    }
    return null;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lumixora_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        const access = checkUserAccessStatus(u);
        if (!access.allowed) {
          localStorage.removeItem('lumixora_user');
          localStorage.removeItem('lumixora_isAuthenticated');
          signOut(auth).catch(() => {});
          supabase.auth.signOut().catch(() => {});
          return null;
        }
        return u;
      } catch (e) {}
    }
    return null;
  });
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showLogin, setShowLogin] = useState(null); // null, 'student', or 'faculty'

  const [showExitModal, setShowExitModal] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Trigger guided platform tour on first login
  useEffect(() => {
    if (isAuthenticated && user) {
      const userId = user.id || user.uid || user.email;
      const tourKey = `lumixora_tour_completed_${userId}`;
      const tourDone = localStorage.getItem(tourKey);
      const isFounder = user.role === 'founder' || user.email?.toLowerCase() === 'founder@lumixora.com';
      
      // If student/scholar and haven't completed the tour yet
      if (!tourDone && !isFounder) {
        const timer = setTimeout(() => {
          setShowTour(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user]);

  const handleCloseTour = () => {
    if (user) {
      const userId = user.id || user.uid || user.email;
      localStorage.setItem(`lumixora_tour_completed_${userId}`, 'true');
    }
    setShowTour(false);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem('lumixora_user', JSON.stringify(updatedUser));
    }
  };

  // Sync real-time profile updates
  useEffect(() => {
    const handleUserUpdateEvent = (e) => {
      if (e.detail) {
        setUser(e.detail);
        localStorage.setItem('lumixora_user', JSON.stringify(e.detail));
      }
    };
    window.addEventListener('lumixora_user_updated', handleUserUpdateEvent);
    return () => window.removeEventListener('lumixora_user_updated', handleUserUpdateEvent);
  }, []);

  // Hydrate and sync latest profile from Supabase & Firestore on app refresh
  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;

    const hydrateLatestProfile = async () => {
      try {
        const uEmail = (user.email || '').toLowerCase().trim();
        const uidsToTry = [user.id, user.uid, auth.currentUser?.uid, uEmail].filter(Boolean);

        // 1. Fetch latest from Firestore across candidate UIDs
        let remoteDoc = null;
        if (db) {
          for (const targetUid of uidsToTry) {
            try {
              const [s1, s2] = await Promise.allSettled([
                getDoc(doc(db, 'users', String(targetUid))),
                getDoc(doc(db, 'Users', String(targetUid)))
              ]);
              if (s1.status === 'fulfilled' && s1.value.exists()) {
                remoteDoc = s1.value.data();
                break;
              } else if (s2.status === 'fulfilled' && s2.value.exists()) {
                remoteDoc = s2.value.data();
                break;
              }
            } catch (e) {}
          }
        }

        // 2. Fetch latest from Supabase
        let sbDoc = null;
        if (supabase && typeof supabase.from === 'function') {
          try {
            const { data } = await supabase.from('users').select('*').eq('email', uEmail).maybeSingle();
            if (data) sbDoc = data;
          } catch (e) {}
        }

        let parsedSb = {};
        if (sbDoc?.name && sbDoc.name.includes('{')) {
          try {
            parsedSb = JSON.parse(sbDoc.name.slice(sbDoc.name.indexOf('{')));
          } catch (e) {}
        }

        // Safe helper: prioritize local user edits over empty/stale remote values
        const pickVal = (localVal, remoteVal, defaultVal = '') => {
          const lStr = String(localVal || '').trim();
          const rStr = String(remoteVal || '').trim();
          if (lStr && lStr !== 'Scholar' && lStr !== 'Student') {
            return localVal;
          }
          if (rStr && rStr !== 'Scholar' && rStr !== 'Student') {
            return remoteVal;
          }
          return localVal || remoteVal || defaultVal;
        };

        const resolvedName = pickVal(user.name || user.displayName, remoteDoc?.name || remoteDoc?.displayName || (sbDoc?.name && !sbDoc.name.includes('{') ? sbDoc.name : null), 'Scholar');
        const resolvedRoll = pickVal(user.rollNumber || user.roll_number, remoteDoc?.rollNumber || sbDoc?.roll_number || parsedSb.rollNumber, '');
        const resolvedDept = pickVal(user.department || user.branch, remoteDoc?.department || remoteDoc?.branch || sbDoc?.department || sbDoc?.branch || parsedSb.department || parsedSb.branch, 'CSM');
        const resolvedCollege = pickVal(user.college || user.collegeName, remoteDoc?.college || sbDoc?.college || parsedSb.college, 'GPREC');
        const resolvedYear = pickVal(user.year || user.yearOfStudy, remoteDoc?.year || sbDoc?.year || parsedSb.year, '1st Year');
        const resolvedSem = pickVal(user.sem || user.semester, remoteDoc?.sem || parsedSb.sem, '1');
        const resolvedSec = pickVal(user.sec || user.section, remoteDoc?.sec || parsedSb.sec, 'A');
        const resolvedQual = pickVal(user.qualification, remoteDoc?.qualification || parsedSb.qualification, 'B.Tech');
        const resolvedPlace = pickVal(user.place, remoteDoc?.place || parsedSb.place, 'Kurnool');
        const resolvedMobile = pickVal(user.mobileNumber || user.phone, remoteDoc?.mobileNumber || parsedSb.mobileNumber, '');
        const resolvedCgpa = pickVal(user.cgpa, remoteDoc?.cgpa || parsedSb.cgpa, '9.0');
        const resolvedLeetcode = pickVal(user.leetcodeUser, localStorage.getItem('lumixora_leetcode_user') || remoteDoc?.leetcodeUser || parsedSb.leetcodeUser, '');
        const resolvedHackerrank = pickVal(user.hackerrankUser, localStorage.getItem('lumixora_hackerrank_user') || remoteDoc?.hackerrankUser || parsedSb.hackerrankUser, '');
        const resolvedGithub = pickVal(user.githubUser, localStorage.getItem('lumixora_github_user') || remoteDoc?.githubUser || parsedSb.githubUser, '');
        const isPaidUser = Boolean(
          user.oneTimeFeePaid ||
          user.feePaid ||
          parsedSb.oneTimeFeePaid ||
          parsedSb.feePaid ||
          remoteDoc?.oneTimeFeePaid ||
          remoteDoc?.feePaid ||
          (uEmail === '249xa33112@gprec.ac.in')
        );

        const resolvedFeeTx = user.feeTxId || parsedSb.feeTxId || remoteDoc?.feeTxId || (isPaidUser ? 'UTR-317827902237' : '');

        const freshUser = {
          ...user,
          ...(parsedSb || {}),
          ...(remoteDoc || {}),
          oneTimeFeePaid: isPaidUser,
          feePaid: isPaidUser,
          feeTxId: resolvedFeeTx,
          name: resolvedName,
          displayName: resolvedName,
          full_name: resolvedName,
          rollNumber: resolvedRoll,
          roll_number: resolvedRoll,
          department: resolvedDept,
          branch: resolvedDept,
          college: resolvedCollege,
          collegeName: resolvedCollege,
          year: resolvedYear,
          yearOfStudy: resolvedYear,
          sem: resolvedSem,
          semester: resolvedSem,
          sec: resolvedSec,
          section: resolvedSec,
          qualification: resolvedQual,
          place: resolvedPlace,
          mobileNumber: resolvedMobile,
          phone: resolvedMobile,
          cgpa: resolvedCgpa,
          leetcodeUser: resolvedLeetcode,
          hackerrankUser: resolvedHackerrank,
          githubUser: resolvedGithub,
          linkedinUser: resolvedLinkedin,
          avatarUrl: user.avatarUrl || remoteDoc?.avatarUrl || sbDoc?.avatar_url || ''
        };

        // Rehydrate local storage cache for offline/instant UI rendering
        const uid = user.id || user.uid || uEmail;
        if (uid) {
          if (Array.isArray(parsedSb.submissions)) {
            localStorage.setItem(`lumixora_submissions_${uid}`, JSON.stringify(parsedSb.submissions));
          }
          if (Array.isArray(parsedSb.solvedProblems)) {
            localStorage.setItem(`lumixora_solved_${uid}`, JSON.stringify(parsedSb.solvedProblems));
          }
        }

        const accessCheck = checkUserAccessStatus(freshUser);
        if (!accessCheck.allowed) {
          console.warn("[Security Gate] hydrateLatestProfile rejected unauthorized user:", freshUser.email, accessCheck.reason);
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('lumixora_user');
          localStorage.removeItem('lumixora_isAuthenticated');
          signOut(auth).catch(() => {});
          supabase.auth.signOut().catch(() => {});
          setLockedAccountInfo({
            email: freshUser.email,
            name: cleanScholarName(freshUser.name),
            role: freshUser.role || 'faculty',
            department: freshUser.department || freshUser.branch || 'CSE',
            reason: accessCheck.reason,
            message: accessCheck.message
          });
          return;
        }

        setUser(freshUser);
        localStorage.setItem('lumixora_user', JSON.stringify(freshUser));
      } catch (err) {
        console.warn('Profile hydration notice:', err);
      }
    };

    hydrateLatestProfile();
  }, [isAuthenticated]);

  // Allow re-opening tour on demand from Dashboard or Profile
  useEffect(() => {
    const handleOpenTourEvent = () => setShowTour(true);
    const handleOpenTjEvent = () => setShowTomAndJerryIntro(true);
    window.addEventListener('lumixora_open_tour', handleOpenTourEvent);
    window.addEventListener('lumixora_open_tom_and_jerry_intro', handleOpenTjEvent);
    return () => {
      window.removeEventListener('lumixora_open_tour', handleOpenTourEvent);
      window.removeEventListener('lumixora_open_tom_and_jerry_intro', handleOpenTjEvent);
    };
  }, []);

  // Self-healing Capgo default channel configuration on native platforms
  useEffect(() => {
    const initCapgo = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          const { CapacitorUpdater } = await import('@capgo/capacitor-updater');
          await CapacitorUpdater.notifyAppReady();
          await CapacitorUpdater.setChannel({ name: 'production' });
          console.log("Capgo default channel set to production programmatically and notified ready.");
        }
      } catch (e) {
        console.warn("Failed to set Capgo channel programmatically:", e);
      }
    };
    initCapgo();
  }, []);

  // Native Android hardware back button handler
  useEffect(() => {
    let listener = null;
    const setupBackButton = async () => {
      try {
        const { App: CapApp } = await import('@capacitor/app');
        listener = await CapApp.addListener('backButton', () => {
          const email = (user?.email || '').toLowerCase().trim();
          const isF = user?.role === 'founder' || email === 'founder@lumixora.com' || email === '249xa33106@gmail.com';
          const isTeammate = user?.role === 'teammate' || user?.role === 'team' || user?.role === 'team_member' || email.endsWith('@lumixora.com');
          const rootTab = isF ? 'founder-portal' : (isTeammate ? 'team-portal' : 'dashboard');

          if (activeTab !== rootTab) {
            handleTabChange(rootTab);
          } else {
            setShowExitModal(true);
          }
        });
      } catch (e) {
        // Fallback for browser back navigation
      }
    };

    setupBackButton();

    return () => {
      if (listener && listener.remove) {
        listener.remove();
      }
    };
  }, [activeTab, user]);

  const handleConfirmExitApp = async () => {
    try {
      const { App: CapApp } = await import('@capacitor/app');
      await CapApp.exitApp();
    } catch (e) {
      setShowExitModal(false);
    }
  };

  // Save pending join link intent for unauthenticated users
    useEffect(() => {
    if (!isAuthenticated) {
      const hash = window.location.hash.substring(1);
      if (hash.startsWith('join-group/')) {
        sessionStorage.setItem('lumixora_pending_join', hash);
        setShowLogin('student'); // Auto-open login if they followed a join link
      }
    }
  }, [isAuthenticated]);

  // SPA hash history router for native feeling & back button support
  useEffect(() => {
    if (!isAuthenticated) return;

    const email = (user?.email || '').toLowerCase().trim();
    const isF = user?.role === 'founder' || email === 'founder@lumixora.com' || email === '249xa33106@gmail.com';
    const isTeammate = user?.role === 'teammate' || user?.role === 'team' || user?.role === 'team_member' || email.endsWith('@lumixora.com');
    const defaultHomeTab = isF ? 'founder-portal' : (isTeammate ? 'team-portal' : 'dashboard');

    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // remove '#'
      if (hash) {
        const parts = hash.split('/');
        const tab = parts[0];
        if (['dashboard', 'courses', 'courses-portal', 'all-courses', 'boloclass', 'bolo-class', 'openmaic', 'openmaic-classroom', 'ai-classroom', 'interactive-classroom', 'my-academics', 'academics', 'academic-tracker', 'marks', 'interview', 'mock-interview', 'certificates', 'proof-of-skill', 'badges', 'verify-cert', 'cert-verify', 'alumni-referrals', 'ai-commander', 'future-twin', 'twin', 'ai-twin', 'ai-future-twin', 'careerverse', 'coding-practice', 'code-editor', 'doubts', 'learning-hub', 'notes', 'tasks', 'contribute', 'contact', 'mentor', 'study-with-me', 'report-bug', 'life-replay', 'founder-portal', 'team-portal', 'faculty-portal', 'test-portal', 'attendance', 'marketplace', 'community', 'join-group', 'simulation', 'internships', 'internship', 'internship-portal', 'apply-internship', 'intern-portal', 'interns', 'intern-workspace', 'relay'].includes(tab)) {
          if (['internship', 'internship-portal', 'apply-internship'].includes(tab)) {
            setActiveTab('internships');
          } else if (['intern-portal', 'interns', 'intern-workspace'].includes(tab)) {
            setActiveTab('intern-portal');
          } else if (['twin', 'ai-twin', 'ai-future-twin', 'careerverse'].includes(tab)) {
            setActiveTab('future-twin');
          } else {
            setActiveTab(tab);
          }
        }
      } else {
        setActiveTab(defaultHomeTab);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Initial check on load
    if (!window.location.hash) {
      window.location.hash = defaultHomeTab;
    } else {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated, user]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    window.location.hash = newTab;
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const checkUpdates = async () => {
      // Do NOT show update popup on web platform
      if (!Capacitor.isNativePlatform()) return;
      const dismissed = sessionStorage.getItem('lumixora_update_dismissed');
      const info = await checkAppUpdate();
      if (isVersionOutdated(CURRENT_VERSION, info.latestVersion)) {
        if (!dismissed || info.mandatory) {
          setUpdateInfo({ ...info, show: true });
        }
      }
    };
    checkUpdates();
  }, []);

  const handleWebUpdateRefresh = async () => {
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      localStorage.setItem('lumixora_active_ver', updateInfo?.latestVersion || CURRENT_VERSION);
    } catch (e) {}
    window.location.reload(true);
  };

  const renderUpdateModal = () => {
    return null;
  };

  const renderExitModal = () => {
    if (!showExitModal) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
        <div className="glass-panel w-full max-w-xs rounded-3xl p-6 border border-white/10 relative overflow-hidden bg-gradient-to-br from-red-500/10 via-black to-transparent text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-2xl mx-auto animate-pulse">
            📱
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-100">Exit VYOMRA App?</h2>
            <p className="text-xs text-gray-400 mt-1">Are you sure you want to close the application?</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowExitModal(false)}
              className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-2.5 rounded-xl text-xs transition-colors border border-white/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmExitApp}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              Exit App
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLockedAccountModal = () => {
    if (!lockedAccountInfo) return null;

    const isPendingApproval = lockedAccountInfo.reason === 'faculty_pending';

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[999999] flex items-center justify-center p-4 animate-fade-in">
        <div className="glass-panel w-full max-w-md rounded-3xl p-6 md:p-8 border border-orange-500/30 bg-[#0d1117] text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 mx-auto shadow-lg shadow-orange-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
              {isPendingApproval ? 'LOCKED / PENDING APPROVAL' : 'ACCOUNT ACCESS SUSPENDED'}
            </span>
            <h2 className="text-lg md:text-xl font-black text-white font-sora pt-1">
              {isPendingApproval ? 'Faculty Account Pending Founder Approval' : 'Account Access Blocked'}
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
              {lockedAccountInfo.message || (isPendingApproval 
                ? 'Your registration has been submitted and is currently in the Founder Security Approval Queue.'
                : 'Your access has been suspended by the administrator.')
              }
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-1.5 font-mono text-xs text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <strong className="text-white font-bold">{lockedAccountInfo.name || 'Faculty Member'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="text-orange-400 font-bold truncate max-w-[200px]">{lockedAccountInfo.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Role:</span>
              <span className="text-gray-300 uppercase">{lockedAccountInfo.role || 'Faculty'}</span>
            </div>
            {lockedAccountInfo.department && (
              <div className="flex justify-between">
                <span className="text-gray-500">Department:</span>
                <span className="text-gray-300">{lockedAccountInfo.department}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-white/5">
              <span className="text-gray-500">Security Status:</span>
              <span className="text-orange-400 font-bold uppercase">{isPendingApproval ? 'Awaiting Approval' : 'Locked'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            {isPendingApproval && (
              <button
                onClick={async () => {
                  try {
                    const { data } = await supabase.from('users').select('*').ilike('email', lockedAccountInfo.email);
                    if (data && data.length > 0 && (data[0].is_approved === true || data[0].isApproved === true)) {
                      setLockedAccountInfo(null);
                      handleLogin({ ...data[0], role: data[0].role || 'faculty' });
                    } else {
                      alert('Account checked: Your faculty access is still in the Pending Approval Queue. Please wait for Founder sign-off.');
                    }
                  } catch (e) {
                    alert('Unable to reach verification service. Please try again.');
                  }
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Check Approval Status</span>
              </button>
            )}

            <button
              onClick={() => {
                setLockedAccountInfo(null);
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('lumixora_user');
                localStorage.removeItem('lumixora_isAuthenticated');
                signOut(auth).catch(() => {});
                supabase.auth.signOut().catch(() => {});
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (user) {
      const access = checkUserAccessStatus(user);
      if (!access.allowed) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('lumixora_user');
        localStorage.removeItem('lumixora_isAuthenticated');
        signOut(auth).catch(() => {});
        supabase.auth.signOut().catch(() => {});
        setLockedAccountInfo({
          email: user.email,
          name: cleanScholarName(user.name || user.displayName),
          role: user.role || 'faculty',
          department: user.department || user.branch || 'CSE',
          reason: access.reason,
          message: access.message
        });
        return;
      }
      localStorage.setItem('lumixora_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lumixora_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lumixora_isAuthenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // Listen for Firebase Auth changes (handles Google OAuth redirect on page load seamlessly)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const email = (fbUser.email || '').toLowerCase().trim();
        const isF = email === 'founder@lumixora.com' || email === '249xa33106@gmail.com' || email === '249xa33106@gprec.ac.in';
        
        // Strict domain access verification: Only allow @gprec.ac.in, partner colleges, and founder whitelist
        if (!isF && !isValidInstitutionalEmail(email)) {
          console.warn(`Blocked unauthorized non-institutional email login: ${email}`);
          try { await signOut(auth); } catch (e) {}
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('lumixora_user');
          localStorage.removeItem('lumixora_isAuthenticated');
          return;
        }

        const cleanName = fbUser.displayName || email.split('@')[0];

        // ⚡ STRICT DB ACCESS CHECK BEFORE LOGGING IN:
        let dbUser = null;
        try {
          const { data: sbUsers } = await supabase.from('users').select('*').ilike('email', email);
          if (sbUsers && sbUsers.length > 0) {
            let unpackedData = {};
            const rawName = sbUsers[0].name || '';
            if (rawName.includes('{')) {
              try {
                unpackedData = JSON.parse(rawName.substring(rawName.indexOf('{')));
              } catch (e) {}
            }
            dbUser = { ...unpackedData, ...sbUsers[0] };
          }
        } catch (syncErr) {
          console.warn("Supabase user query notice:", syncErr);
        }

        if (!dbUser && db) {
          try {
            const [s1, s2] = await Promise.allSettled([
              getDoc(doc(db, 'users', fbUser.uid)),
              getDoc(doc(db, 'Users', fbUser.uid))
            ]);
            if (s1.status === 'fulfilled' && s1.value.exists()) {
              dbUser = s1.value.data();
            } else if (s2.status === 'fulfilled' && s2.value.exists()) {
              dbUser = s2.value.data();
            }
          } catch (fsErr) {
            console.warn("Firestore user query notice:", fsErr);
          }
        }

        const candidateUser = dbUser || {
          id: fbUser.uid,
          uid: fbUser.uid,
          name: cleanName,
          email: email,
          role: isF ? 'founder' : 'user',
          is_approved: true,
          isApproved: true
        };

        const accessStatus = checkUserAccessStatus(candidateUser);
        if (!accessStatus.allowed) {
          console.warn(`[Security Gate] Access denied for ${email}: ${accessStatus.reason}`);
          try { await signOut(auth); } catch (e) {}
          try { await supabase.auth.signOut(); } catch (e) {}
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('lumixora_user');
          localStorage.removeItem('lumixora_isAuthenticated');
          setLockedAccountInfo({
            email,
            name: cleanScholarName(candidateUser.name || cleanName),
            role: candidateUser.role || 'faculty',
            department: candidateUser.department || candidateUser.branch || 'CSE',
            reason: accessStatus.reason,
            message: accessStatus.message
          });
          return;
        }

        // Access is granted!
        setLockedAccountInfo(null);
        const resolvedProfile = {
          id: fbUser.uid,
          uid: fbUser.uid,
          name: cleanScholarName(candidateUser.name || cleanName),
          email: email,
          ...candidateUser,
          role: isF ? 'founder' : (candidateUser.role || 'user'),
          emailVerified: true
        };

        handleLogin(resolvedProfile);

        if (!dbUser) {
          if (isExemptFromPayment(resolvedProfile) || hasPaidCollegeFee(resolvedProfile)) {
            supabase.from('users').upsert([resolvedProfile], { onConflict: 'email' }).catch(() => {});
          }
        }
      }
    });

    // Also listen for Supabase OAuth events
    const { data: sbAuthListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const sbEmail = (session.user.email || '').toLowerCase().trim();
        if (!sbEmail) return;

        const isF = sbEmail === 'founder@lumixora.com' || sbEmail === '249xa33106@gmail.com' || sbEmail === '249xa33106@gprec.ac.in';
        if (!isF && !isValidInstitutionalEmail(sbEmail)) {
          console.warn(`Blocked unauthorized non-institutional email login: ${sbEmail}`);
          await supabase.auth.signOut().catch(() => {});
          return;
        }

        const rawName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || sbEmail.split('@')[0];
        const cleanName = rawName.includes('{') ? rawName.split('{')[0].trim() : rawName;

        try {
          const { data: existing } = await supabase.from('users').select('*').ilike('email', sbEmail);
          let userProfile;
          if (existing && existing.length > 0) {
            let unpackedData = {};
            const dbName = existing[0].name || '';
            if (dbName.includes('{')) {
              try {
                unpackedData = JSON.parse(dbName.substring(dbName.indexOf('{')));
              } catch (e) {}
            }
            userProfile = {
              ...unpackedData,
              ...existing[0],
              id: session.user.id,
              uid: session.user.id,
              name: (dbName.includes('{') ? dbName.split('{')[0].trim() : dbName) || cleanName,
              emailVerified: true,
              role: isF ? 'founder' : (existing[0].role || 'user')
            };
          } else {
            userProfile = {
              id: session.user.id,
              uid: session.user.id,
              name: cleanName,
              email: sbEmail,
              password: 'google_oauth_managed',
              qualification: 'B.Tech',
              college: 'GPREC',
              place: 'Kurnool',
              year: '1st Year',
              cgpa: '9.0',
              targetCGPA: '9.0',
              careerGoal: 'Placement',
              department: 'CSE',
              sem: '1',
              sec: 'A',
              learningStyle: 'Practical',
              weakSubjects: 'None',
              strongSubjects: 'None',
              subjects: 'Computer Science',
              xp: 50,
              coins: 100,
              level: 1,
              streak: 1,
              longestStreak: 1,
              streakFreezeCount: 1,
              badges: ['first_login', 'institutional_verified'],
              purchasedThemes: ['default'],
              purchasedFrames: ['none'],
              currentTheme: 'default',
              currentFrame: 'none',
              created_at: new Date().toISOString(),
              role: isF ? 'founder' : 'user',
              emailVerified: true,
              is_approved: true,
              isApproved: true
            };
            if (isExemptFromPayment(userProfile) || hasPaidCollegeFee(userProfile)) {
              await supabase.from('users').upsert([userProfile], { onConflict: 'email' });
            }
          }

          const accessStatus = checkUserAccessStatus(userProfile);
          if (!accessStatus.allowed) {
            console.warn(`[Security Gate] Access denied for ${sbEmail}: ${accessStatus.reason}`);
            await supabase.auth.signOut().catch(() => {});
            try { await signOut(auth); } catch (e) {}
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('lumixora_user');
            localStorage.removeItem('lumixora_isAuthenticated');
            setLockedAccountInfo({
              email: sbEmail,
              name: cleanScholarName(userProfile.name || cleanName),
              role: userProfile.role || 'faculty',
              department: userProfile.department || userProfile.branch || 'CSE',
              reason: accessStatus.reason,
              message: accessStatus.message
            });
            return;
          }

          setLockedAccountInfo(null);
          handleLogin(userProfile);
        } catch (e) {
          console.warn("Supabase auth session sync notice:", e);
        }
      }
    });

    return () => {
      unsubscribe();
      sbAuthListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = (userData) => {
    if (!userData) return;

    const accessStatus = checkUserAccessStatus(userData);
    if (!accessStatus.allowed) {
      console.warn("[Security Gate] handleLogin rejected unauthorized user:", userData.email, accessStatus.reason);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('lumixora_user');
      localStorage.removeItem('lumixora_isAuthenticated');
      try { signOut(auth); } catch (e) {}
      try { supabase.auth.signOut(); } catch (e) {}
      setLockedAccountInfo({
        email: userData.email,
        name: cleanScholarName(userData.name || userData.displayName),
        role: userData.role || 'faculty',
        department: userData.department || userData.branch || 'CSE',
        reason: accessStatus.reason,
        message: accessStatus.message
      });
      return;
    }

    const email = (userData?.email || '').toLowerCase().trim();
    const isF = userData?.role === 'founder' || isFounderEmail(email);
    const isTeammate = userData?.role === 'teammate' || userData?.role === 'team' || userData?.role === 'team_member' || email.endsWith('@lumixora.com');
    const isFeeSatisfied = isExemptFromPayment(userData) || hasPaidCollegeFee(userData) || userData?.role === 'intern' || userData?.isIntern;
                
    const finalizedUser = {
      ...userData,
      role: isF ? 'founder' : (userData.role || 'user'),
      emailVerified: true,
      oneTimeFeePaid: isFeeSatisfied
    };

    setUser(finalizedUser);
    setIsAuthenticated(true);
    setShowLogin(null);
    localStorage.setItem('lumixora_user', JSON.stringify(finalizedUser));
    localStorage.setItem('lumixora_isAuthenticated', 'true');
    if (isFeeSatisfied && finalizedUser.email) {
      try {
        localStorage.setItem(`lumixora_fee_paid_${finalizedUser.email.toLowerCase().trim()}`, 'true');
      } catch (e) {}
    }
    
    // Whenever ANY user logs in or registers into website, ALWAYS open Dashboard directly. Never open other portals randomly.
    setActiveTab('dashboard');
    try {
      window.location.hash = 'dashboard';
    } catch (e) {}
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    signOut(auth).catch((err) => console.warn("Firebase signout error:", err));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} user={user} />;
      case 'my-academics':
      case 'academics':
      case 'academic-tracker':
      case 'marks':
      case 'my-marks':
        return <MyAcademics user={user} />;
      case 'interview':
      case 'mock-interview':
      case 'ai-interview':
      case 'interview-room':
        return <AiMockInterviewRoom user={user} setActiveTab={handleTabChange} />;
      case 'certificates':
      case 'proof-of-skill':
      case 'badges':
      case 'credentials':
        return <ProofOfSkillCertificates user={user} setActiveTab={handleTabChange} />;
      case 'alumni':
      case 'alumni-referrals':
      case 'alumni-bridge':
      case 'referrals':
        return <AlumniReferralBridge user={user} setActiveTab={handleTabChange} />;
      case 'ai-commander':
      case 'placement-commander':
        return <AiPlacementCommander user={user} setActiveTab={handleTabChange} />;
      case 'future-twin':
      case 'twin':
      case 'ai-twin':
      case 'ai-future-twin':
      case 'careerverse':
        return <AiFutureTwin user={user} setActiveTab={handleTabChange} />;
      case 'coding-practice':
        return <CodingPractice setSelectedProblem={setSelectedProblem} setActiveTab={setActiveTab} user={user} />;
      case 'code-editor':
        return <CodeEditorPage problem={selectedProblem} setActiveTab={setActiveTab} user={user} />;
      case 'hackathons':
        return <HackathonPortal user={user} setActiveTab={handleTabChange} />;
      case 'doubts':
        return <DoubtSolving user={user} />;
      case 'notes':
        return <NotesPlatform user={user} setActiveTab={handleTabChange} />;
      case 'drive-papers':
      case 'placement-papers':
      case 'company-papers':
        return <CompanyPlacementPapers user={user} setActiveTab={handleTabChange} setSelectedProblem={setSelectedProblem} />;
      case 'videos':
      case 'video-lectures':
      case 'video-portal':
        return <LearningHub user={user} setActiveTab={handleTabChange} initialTab="videos" />;
      case 'tasks':
        return <TaskManager user={user} />;
      case 'courses':
      case 'courses-portal':
      case 'all-courses':
      case 'curriculum-portal':
        return <CoursesPortal user={user} setActiveTab={handleTabChange} />;
      case 'boloclass':
      case 'openmaic':
      case 'openmaic-classroom':
      case 'ai-classroom':
      case 'interactive-classroom':
        return <BoloClassPortal user={user} setActiveTab={handleTabChange} />;
      case 'edupulse':
      case 'eduplus':
      case 'test-to-action':
        return <EduPulsePortal user={user} setActiveTab={handleTabChange} />;
      case 'projectverse':
      case 'project-verse':
      case 'projects-hub':
        return <ProjectVerse user={user} setActiveTab={handleTabChange} />;
      case 'relay':
      case 'lumixora-relay':
      case 'fusion':
      case 'project-dna':
        return <RelayPortal user={user} setActiveTab={handleTabChange} />;
      case 'internship':
      case 'internships':
      case 'internship-portal':
      case 'apply-internship':
        return <InternshipPortal user={user} setActiveTab={handleTabChange} />;
      case 'intern-portal':
      case 'interns':
      case 'intern-workspace':
        return <InternWorkspacePortal user={user} setActiveTab={handleTabChange} onLogin={handleLogin} />;
      case 'learning-hub':
      case 'learning':
      case 'resource-academy':
      case 'subjects':
      case 'curriculum':
        return <LearningHub user={user} setActiveTab={handleTabChange} initialTab="resources" />;
      case 'career-roadmap':
        return <CareerRoadmap user={user} />;
      case 'aptitude':
      case 'aptitude-arena':
        return <AptitudeArena user={user} isFounder={user?.role === 'founder'} />;
      case 'simulations':
      case 'simulation':
        return <SimulationPortal />;
      case 'contribute':
        return <ContributeNotes user={user} setActiveTab={handleTabChange} />;
      case 'contact':
        return <ContactUs user={user} />;
      case 'mentor':
      case 'personal-mentor':
        return <PersonalMentor user={user} />;
      case 'study-with-me':
      case 'study-room':
        return <StudyWithMe user={user} />;
      case 'portfolio':
      case 'scholar-portfolio':
      case 'projects':
      case 'project-showcase':
        return <ProjectShowcase user={user} setActiveTab={handleTabChange} />;
      case 'grievance':
      case 'grievances':
        return <GrievancePortal user={user} setActiveTab={handleTabChange} />;
      case 'report-bug':
        return <ReportBug user={user} />;
      case 'life-replay':
        return <LifeReplay user={user} />;
      case 'test-portal':
        return <TestPortal user={user} setActiveTab={handleTabChange} />;
      case 'assigned-tasks':
        return <AssignedTasksPortal user={user} setActiveTab={handleTabChange} />;
      case 'attendance':
        return <AttendancePortal user={user} />;
      case 'resume':
      case 'resume-creator':
      case 'resume-builder':
        return <ResumeCreator user={user} setActiveTab={handleTabChange} />;
      case 'clubs':
      case 'clubs-portal':
      case 'all-clubs':
        return <ClubsPortal user={user} />;
      case 'cad':
      case 'cad-club':
      case 'cad-english-club':
      case 'cad&englishclub':
      case 'cadenglishclub':
        return <CadEnglishClubPortal user={user} isFounder={user?.role === 'founder'} onClose={() => handleTabChange('dashboard')} />;
      case 'marketplace':
        return <Marketplace user={user} />;
      case 'community':
        return <CommunityPortal user={user} />;
      case 'verify':
      case 'verify-cert':
      case 'cert-verify':
      case 'credential-verify':
        const certHash = window.location.hash.substring(1);
        const certIdFromHash = certHash.split('/')[1] || '';
        return <PublicCertificateVerification certId={certIdFromHash} onBack={() => handleTabChange('dashboard')} />;
      case 'join-group':
        const joinHash = window.location.hash.substring(1);
        const joinGroupId = joinHash.split('/')[1] || null;
        return <JoinGroup groupId={joinGroupId} user={user} setActiveTab={handleTabChange} />;
      case 'our-team':
      case 'team':
      case 'team-leads':
      case 'lumixora-team':
      case 'team-members':
      case 'core-team':
        return <OurTeamPortal user={user} setActiveTab={handleTabChange} />;
      case 'team-portal':
      case 'teammate-portal':
        return <TeamPortal user={user} setActiveTab={handleTabChange} />;
      case 'faculty-portal':
        const isFacultyUser = user?.role === 'faculty' || user?.role === 'mentor' || user?.role === 'founder' || user?.email?.toLowerCase() === 'founder@lumixora.com';
        if (isFacultyUser) {
          return <FacultyPortal user={user} setActiveTab={handleTabChange} />;
        }
        return <Dashboard setActiveTab={setActiveTab} user={user} />;
      case 'founder-portal':
        const isF = user?.role === 'founder' || 
                    user?.email?.toLowerCase() === 'founder@lumixora.com' ||
                    user?.email?.toLowerCase() === '249xa33106@gmail.com' ||
                    user?.email?.toLowerCase() === '249xa33106@gprec.ac.in';
        if (isF) {
          return <FounderPortal user={user} setActiveTab={handleTabChange} />;
        }
        return <Dashboard setActiveTab={setActiveTab} user={user} />;
      default:
        return <Dashboard setActiveTab={handleTabChange} user={user} />;
    }
  };

  if (lockedAccountInfo) {
    return (
      <ThemeProvider>
        <ToastProvider>
          <CursorGlow />
          {renderLockedAccountModal()}
        </ToastProvider>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    const lowerHash = currentHash;
    
    // Public Lumixora Credential Verification URL (lumixora.in/verify, #verify, #verify-cert/...)
    const isVerifyPath = typeof window !== 'undefined' && (
      window.location.pathname.toLowerCase() === '/verify' ||
      window.location.pathname.toLowerCase().startsWith('/verify/')
    );
    if (isVerifyPath || lowerHash.includes('verify') || lowerHash.includes('cert-verify')) {
      return (
        <ThemeProvider>
          <ToastProvider>
            <CursorGlow />
            <PublicCertificateVerification onBack={() => { 
              if (typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/verify')) {
                window.location.href = '/';
              } else {
                window.location.hash = ''; 
              }
            }} />
          </ToastProvider>
        </ThemeProvider>
      );
    }

    // Direct standalone access to BoloClass AI Classroom or boloclass subdomain
    const isBoloClassSubdomain = typeof window !== 'undefined' && window.location.hostname.toLowerCase().includes('boloclass');
    if (isBoloClassSubdomain || lowerHash.includes('boloclass') || lowerHash.includes('openmaic') || lowerHash.includes('ai-classroom')) {
      return (
        <ThemeProvider>
          <ToastProvider>
            <CursorGlow />
            <div className="min-h-screen bg-[#06070c] text-white p-2 md:p-6 space-y-4">
              <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <img src="/lumixora_logo_icon.png" alt="Lumixora Logo" className="w-9 h-9 rounded-2xl object-cover" />
                  <div>
                    <span className="text-sm font-black text-white font-sora">Lumixora BoloClass</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-black border border-purple-500/30 uppercase">
                      AI Classroom
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href="https://lumixora.in"
                    className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl transition-all border border-white/10 cursor-pointer flex items-center gap-1"
                  >
                    ← Lumixora Main
                  </a>
                  <button 
                    onClick={() => setShowLogin('student')} 
                    className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-95 text-white text-xs font-black rounded-xl transition-all shadow-lg cursor-pointer"
                  >
                    Student Login
                  </button>
                </div>
              </div>
              <BoloClassPortal user={user || { name: 'Scholar Guest', email: 'guest_scholar' }} setActiveTab={handleTabChange} />
            </div>
            {renderUpdateModal()}
          </ToastProvider>
        </ThemeProvider>
      );
    }

    // Direct standalone access to All Courses & Diplomas
    if (lowerHash.includes('courses') || lowerHash.includes('all-courses')) {
      return (
        <ThemeProvider>
          <ToastProvider>
            <CursorGlow />
            <div className="min-h-screen bg-[#030712] text-white p-2 md:p-6 space-y-4">
              <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <img src="/lumixora_logo_icon.png" alt="Lumixora Logo" className="w-9 h-9 rounded-2xl object-cover" />
                  <div>
                    <span className="text-sm font-black text-white font-sora">Lumixora Courses</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-black border border-cyan-500/30 uppercase">
                      Curricula & Diplomas
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { window.location.hash = ''; }} 
                    className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl transition-all border border-white/10 cursor-pointer"
                  >
                    ← Home
                  </button>
                  <button 
                    onClick={() => setShowLogin('student')} 
                    className="px-4 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-600 hover:opacity-95 text-black text-xs font-black rounded-xl transition-all shadow-lg cursor-pointer"
                  >
                    Student Login
                  </button>
                </div>
              </div>
              <CoursesPortal user={user || { name: 'Scholar Guest', email: 'guest_scholar' }} setActiveTab={handleTabChange} />
            </div>
            {renderUpdateModal()}
          </ToastProvider>
        </ThemeProvider>
      );
    }

    // Direct standalone access to Proof-of-Skill Certificates
    if (lowerHash.includes('certificates') || lowerHash.includes('proof-of-skill')) {
      return (
        <ThemeProvider>
          <ToastProvider>
            <CursorGlow />
            <div className="min-h-screen bg-[#030712] text-white p-2 md:p-6 space-y-4">
              <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <img src="/lumixora_logo_icon.png" alt="Lumixora Logo" className="w-9 h-9 rounded-2xl object-cover" />
                  <div>
                    <span className="text-sm font-black text-white font-sora">Lumixora Certificates</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30 uppercase">
                      Proof-of-Skill
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { window.location.hash = ''; }} 
                    className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl transition-all border border-white/10 cursor-pointer"
                  >
                    ← Home
                  </button>
                  <button 
                    onClick={() => setShowLogin('student')} 
                    className="px-4 py-1.5 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-95 text-black text-xs font-black rounded-xl transition-all shadow-lg cursor-pointer"
                  >
                    Student Login
                  </button>
                </div>
              </div>
              <ProofOfSkillCertificates user={user || { name: 'Scholar Guest', email: 'guest_scholar' }} setActiveTab={handleTabChange} />
            </div>
            {renderUpdateModal()}
          </ToastProvider>
        </ThemeProvider>
      );
    }

    // Direct standalone access to My Academics without requiring initial login
    if (lowerHash.includes('my-academics') || lowerHash === '#academics' || lowerHash.includes('academics')) {
      return (
        <ThemeProvider>
          <ToastProvider>
            <CursorGlow />
            <div className="min-h-screen bg-[#030712] text-white p-4 md:p-8">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center gap-3">
                    <img src="/lumixora_logo_icon.png" alt="Lumixora Logo" className="w-10 h-10 rounded-2xl object-cover border border-cyan-500/30" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">Lumixora by VYOMRA</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30 uppercase">
                          Academic Performance Tracker
                        </span>
                      </div>
                      <p className="text-[11px] text-cyan-300 font-mono">lumixora.in#my-academics</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => { window.location.hash = ''; }} 
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold rounded-xl transition-all border border-white/10 cursor-pointer"
                    >
                      ← Home
                    </button>
                    <button 
                      onClick={() => setShowLogin('student')} 
                      className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 hover:opacity-95 text-black text-xs font-black rounded-xl transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                    >
                      Student Login
                    </button>
                  </div>
                </div>

                <MyAcademics user={user || { name: 'Student Scholar', email: 'guest_student' }} />
              </div>
            </div>
            {renderUpdateModal()}
          </ToastProvider>
        </ThemeProvider>
      );
    }

    // Direct standalone access to EduPulse Test-to-Action Platform without requiring initial login
    if (lowerHash.includes('edupulse') || lowerHash.includes('eduplus') || lowerHash.includes('test-to-action')) {
      return (
        <ThemeProvider>
          <ToastProvider>
            <CursorGlow />
            <div className="min-h-screen bg-[#060a12] text-white p-2 md:p-6 space-y-4">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center gap-3">
                    <img src="/lumixora_logo_icon.png" alt="Lumixora Logo" className="w-10 h-10 rounded-2xl object-cover border border-teal-500/30" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white font-sora">Lumixora EduPulse</span>
                        <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-black border border-teal-500/30 uppercase tracking-wider">
                          Test-to-Action Platform
                        </span>
                      </div>
                      <p className="text-[11px] text-teal-300 font-mono">G. Pulla Reddy Engineering College (Autonomous) • Lumixora Student OS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => { window.location.hash = ''; }} 
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold rounded-xl transition-all border border-white/10 cursor-pointer"
                    >
                      ← Home
                    </button>
                    <button 
                      onClick={() => setShowLogin('student')} 
                      className="px-4 py-2 bg-gradient-to-r from-teal-400 to-emerald-500 hover:opacity-95 text-black text-xs font-black rounded-xl transition-all shadow-lg shadow-teal-500/20 cursor-pointer"
                    >
                      Login
                    </button>
                  </div>
                </div>

                <EduPulsePortal user={user || { name: 'Faculty Lead', email: 'faculty@gprec.ac.in', role: 'faculty', college: 'GPREC' }} setActiveTab={handleTabChange} />
              </div>
            </div>
            {renderUpdateModal()}
          </ToastProvider>
        </ThemeProvider>
      );
    }

    // Direct standalone access to LUMIXORA RELAY (Component Intelligence & Fusion)
    if (lowerHash.includes('relay') || lowerHash.includes('fusion') || lowerHash.includes('project-dna')) {
      return (
        <ThemeProvider>
          <ToastProvider>
            <div className="min-h-screen bg-[#F7F8FC] text-[#17172B] p-2 md:p-6 space-y-4">
              <div className="max-w-7xl mx-auto space-y-4">
                <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src="/lumixora_logo_icon.png" alt="Lumixora Logo" className="w-10 h-10 rounded-2xl object-cover border border-violet-200" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#17172B] font-sora">LUMIXORA RELAY™</span>
                        <span className="px-2 py-0.5 rounded bg-violet-100 text-[#6C4DFF] text-[10px] font-black border border-violet-200 uppercase tracking-wider">
                          Project Intelligence & Component Fusion
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">Transform Unfinished Projects into Opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => { window.location.hash = ''; setActiveTab('dashboard'); }} 
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      ← Home
                    </button>
                    <button 
                      onClick={() => setShowLogin('student')} 
                      className="px-4 py-2 bg-gradient-to-r from-[#6C4DFF] to-[#3878FF] hover:opacity-95 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-violet-500/20 cursor-pointer"
                    >
                      Login
                    </button>
                  </div>
                </div>

                <RelayPortal user={user || { name: 'Innovation Architect', email: 'architect@lumixora.com', role: 'student' }} setActiveTab={handleTabChange} />
              </div>
            </div>
            {renderUpdateModal()}
          </ToastProvider>
        </ThemeProvider>
      );
    }

    // Direct standalone public access to LUMIXORA INTERN WORKSPACE & SUBPORTAL
    if (lowerHash.includes('intern-portal') || lowerHash.includes('intern-workspace') || lowerHash.includes('interns')) {
      return (
        <ThemeProvider>
          <ToastProvider>
            <div className="min-h-screen bg-[#070913] text-slate-100 p-2 md:p-6 space-y-4">
              <div className="max-w-7xl mx-auto space-y-4">
                <InternWorkspacePortal 
                  user={user || { name: 'Lumixora Intern', email: 'intern@lumixora.in', role: 'intern' }} 
                  setActiveTab={handleTabChange} 
                  onLogin={handleLogin}
                />
              </div>
            </div>
            {renderUpdateModal()}
          </ToastProvider>
        </ThemeProvider>
      );
    }

    // Direct standalone public access to LUMIXORA INTERNSHIP PORTAL (Batch 01)
    if (lowerHash.includes('internship') || lowerHash.includes('apply-internship')) {
      return (
        <ThemeProvider>
          <ToastProvider>
            <div className="min-h-screen bg-[#F7F8FC] text-[#17172B] p-2 md:p-6 space-y-4">
              <div className="max-w-7xl mx-auto space-y-4">
                <InternshipPortal user={user || { name: 'Guest Candidate', email: 'applicant@lumixora.in', role: 'student' }} setActiveTab={handleTabChange} />
              </div>
            </div>
            {renderUpdateModal()}
          </ToastProvider>
        </ThemeProvider>
      );
    }

    // Direct standalone public access to LUMIXORA PROJECTVERSE™
    if (lowerHash.includes('projectverse') || lowerHash.includes('project-verse') || lowerHash.includes('projects-hub')) {
      return (
        <ThemeProvider>
          <ToastProvider>
            <div className="min-h-screen bg-slate-50 text-slate-900 p-2 md:p-6">
              <div className="max-w-7xl mx-auto">
                <ProjectVerse user={user || { name: 'Guest Explorer', email: 'student@lumixora.in', role: 'student', branch: 'CSE', year: '2nd Year' }} />
              </div>
            </div>
            {renderUpdateModal()}
          </ToastProvider>
        </ThemeProvider>
      );
    }

    if (showLogin) {
      return (
        <ThemeProvider>
          <ToastProvider>
            <CursorGlow />
            <button 
              onClick={() => setShowLogin(null)} 
              className="fixed top-6 left-6 z-[99999] px-4 py-2 bg-black/50 hover:bg-black/70 text-white text-sm font-bold rounded-xl backdrop-blur-md transition-all border border-white/20"
            >
              ← Back to Home
            </button>
            <AuthPortal onLogin={handleLogin} mode={showLogin} />
            {renderUpdateModal()}
          </ToastProvider>
        </ThemeProvider>
      );
    }
    return (
      <ThemeProvider>
        <ToastProvider>
          <CursorGlow />
          <LandingPage onLoginClick={(type) => setShowLogin(type || 'student')} />
          {renderUpdateModal()}
        </ToastProvider>
      </ThemeProvider>
    );
  }

  // ZERO-TOLERANCE SECURITY GATE: Completely block mounting or rendering of any workspace/data if unpaid
  if (user && !isExemptFromPayment(user) && !hasPaidCollegeFee(user) && user?.role !== 'intern' && !user?.isIntern) {
    return (
      <ThemeProvider>
        <ToastProvider>
          <CursorGlow />
          {renderLockedAccountModal()}
          <div className="fixed inset-0 bg-[#07070d] flex items-center justify-center p-4 z-[999999]">
            <CollegeAccessFeeModal
              isOpen={true}
              user={user}
              college={user.college || user.collegeName}
              mode="gate"
              onSuccess={(updatedUser) => {
                const finalized = { ...user, ...updatedUser, oneTimeFeePaid: true };
                setUser(finalized);
                localStorage.setItem('lumixora_user', JSON.stringify(finalized));
                if (finalized.email) {
                  try {
                    localStorage.setItem(`lumixora_fee_paid_${finalized.email.toLowerCase().trim()}`, 'true');
                  } catch (e) {}
                }
              }}
              onLogout={handleLogout}
            />
          </div>
        </ToastProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <CursorGlow />
        {renderLockedAccountModal()}
        <GamificationProvider user={user} activeTab={activeTab}>
          <DataProvider>
            {showIntro && (
              <CinematicIntro onComplete={() => setShowIntro(false)} />
            )}
            {showTomAndJerryIntro && (
              <TomAndJerryIntro onClose={() => setShowTomAndJerryIntro(false)} onComplete={() => setShowTomAndJerryIntro(false)} />
            )}
            <MainLayout activeTab={activeTab} setActiveTab={handleTabChange} user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} onExitApp={() => setShowExitModal(true)}>
              {renderContent()}
            </MainLayout>
            {renderUpdateModal()}
            {renderExitModal()}
            <PlatformTourModal 
              isOpen={showTour} 
              onClose={handleCloseTour} 
              onNavigateTab={handleTabChange} 
            />
          </DataProvider>
        </GamificationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

