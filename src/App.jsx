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
import { isValidInstitutionalEmail } from './data/collegesData';
import { signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import { checkAppUpdate, isVersionOutdated, CURRENT_VERSION } from './services/updateService';
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
import PlatformTourModal from './components/PlatformTourModal';
import CinematicIntro from './components/CinematicIntro';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    const savedUser = localStorage.getItem('lumixora_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        const email = (u?.email || '').toLowerCase().trim();
        const isF = u?.role === 'founder' || email === 'founder@lumixora.com' || email === '249xa33106@gmail.com';
        if (isF) return 'founder-portal';
        const isTeammate = u?.role === 'teammate' || u?.role === 'team' || u?.role === 'team_member' || email.endsWith('@lumixora.com');
        if (isTeammate) return 'team-portal';
        const isFaculty = u?.role === 'faculty' || u?.role === 'mentor';
        if (isFaculty) return 'faculty-portal';
      } catch (e) {}
    }
    return 'dashboard';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('lumixora_isAuthenticated') === 'true';
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lumixora_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        const email = (u?.email || '').toLowerCase().trim();
        const isFounderOrAdmin = email === 'founder@lumixora.com' || email === '249xa33106@gmail.com';
        const isExplicitlyUnblocked = u?.is_blocked === false && (u?.is_approved === true || u?.isApproved === true);
        const isAllowedDomain = isValidInstitutionalEmail(email) || isFounderOrAdmin || isExplicitlyUnblocked;
        
        if (u?.is_blocked === true || !isAllowedDomain) {
          localStorage.removeItem('lumixora_user');
          localStorage.removeItem('lumixora_isAuthenticated');
          signOut(auth).catch(() => {});
          return null;
        }

        // Enforce Email Verification across all non-founder sessions
        if (!isFounderOrAdmin && (u?.emailVerified === false || u?.email_verified === false)) {
          localStorage.removeItem('lumixora_user');
          localStorage.removeItem('lumixora_isAuthenticated');
          signOut(auth).catch(() => {});
          return null;
        }

        const isFaculty = u?.role === 'faculty' || u?.role === 'mentor';
        const isApproved = u?.isApproved === true || u?.is_approved === true;
        if (isFaculty && !isApproved && !isFounderOrAdmin) {
          localStorage.removeItem('lumixora_user');
          localStorage.removeItem('lumixora_isAuthenticated');
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

  // Allow re-opening tour on demand from Dashboard or Profile
  useEffect(() => {
    const handleOpenTourEvent = () => setShowTour(true);
    window.addEventListener('lumixora_open_tour', handleOpenTourEvent);
    return () => window.removeEventListener('lumixora_open_tour', handleOpenTourEvent);
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
        if (['dashboard', 'future-twin', 'coding-practice', 'code-editor', 'doubts', 'learning-hub', 'notes', 'tasks', 'contribute', 'contact', 'mentor', 'study-with-me', 'report-bug', 'life-replay', 'founder-portal', 'team-portal', 'faculty-portal', 'test-portal', 'attendance', 'marketplace', 'community', 'join-group', 'simulation', 'clubs'].includes(tab)) {
          setActiveTab(tab);
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
  };

  useEffect(() => {
    const checkUpdates = async () => {
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

  const renderUpdateModal = () => {
    if (!updateInfo || !updateInfo.show) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
        <div className="glass-panel w-full max-w-sm rounded-3xl p-6 border border-white/10 relative overflow-hidden bg-gradient-to-br from-brand-purple/10 to-transparent">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-pink/5 rounded-full blur-xl animate-pulse"></div>
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-pink/10 border border-white/10 flex items-center justify-center text-brand-pink text-3xl animate-bounce">
              🚀
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-gray-100 tracking-wide animate-pulse">New Update Available!</h2>
              <p className="text-xs text-gray-400 mt-1">
                A new version <span className="text-brand-teal font-extrabold">{updateInfo.latestVersion}</span> is ready for download.<br/>
                Currently running v{CURRENT_VERSION}.
              </p>
            </div>

            <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-xs text-gray-300 leading-relaxed text-left">
              <span className="text-[10px] text-brand-pink font-extrabold uppercase tracking-wide block mb-1">What's New:</span>
              • Performance improvements & brand updates.<br/>
              • Brand-new AI Personal Mentor interface & planner.
            </div>

            <div className="flex gap-3 w-full mt-2">
              {!updateInfo.mandatory && (
                <button 
                  onClick={() => {
                    setUpdateInfo(prev => ({ ...prev, show: false }));
                    sessionStorage.setItem('lumixora_update_dismissed', 'true');
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-2xl text-xs transition-colors border border-white/10 cursor-pointer"
                >
                  Later
                </button>
              )}
              <a 
                href={updateInfo.apkUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (!updateInfo.mandatory) {
                    setUpdateInfo(prev => ({ ...prev, show: false }));
                  }
                }}
                className="flex-1 bg-brand-teal hover:opacity-95 text-black font-extrabold py-3 rounded-2xl text-xs text-center transition-all block shadow-sm cursor-pointer"
              >
                Update Now
              </a>
            </div>
          </div>
        </div>
      </div>
    );
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
            <h2 className="text-base font-bold text-gray-100">Exit LUMIXORA App?</h2>
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

  useEffect(() => {
    if (user) {
      if (user.is_blocked === true || user.is_deleted === true) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('lumixora_user');
        localStorage.removeItem('lumixora_isAuthenticated');
        signOut(auth).catch(() => {});
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

  const handleLogin = (userData) => {
    const email = (userData?.email || '').toLowerCase().trim();
    const isF = userData?.role === 'founder' || email === 'founder@lumixora.com' || email === '249xa33106@gmail.com';
    const isTeammate = userData?.role === 'teammate' || userData?.role === 'team' || userData?.role === 'team_member' || email.endsWith('@lumixora.com');
                
    setUser(userData);
    setIsAuthenticated(true);
    setShowLogin(null);
    
    // Check if there was a pending join link
    const pendingJoin = sessionStorage.getItem('lumixora_pending_join');
    if (pendingJoin) {
      sessionStorage.removeItem('lumixora_pending_join');
      setActiveTab('join-group');
      window.location.hash = pendingJoin;
    } else {
      // Set default tab hash on login
      const defaultTab = isF ? 'founder-portal' : (isTeammate ? 'team-portal' : 'dashboard');
      setActiveTab(defaultTab);
      window.location.hash = defaultTab;
    }
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
      case 'ai-commander':
        return <AiPlacementCommander user={user} setActiveTab={handleTabChange} />;
      case 'future-twin':
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
        return <NotesPlatform user={user} />;
      case 'videos':
      case 'video-lectures':
      case 'video-portal':
        return <VideoPortal user={user} setActiveTab={handleTabChange} />;
      case 'tasks':
        return <TaskManager user={user} />;
      case 'learning-hub':
        return <LearningHub user={user} />;
      case 'career-roadmap':
        return <CareerRoadmap user={user} />;
      case 'simulation':
        return <SimulationPortal />;
      case 'contribute':
        return <ContributeNotes user={user} setActiveTab={handleTabChange} />;
      case 'contact':
        return <ContactUs user={user} />;
      case 'mentor':
        return <PersonalMentor user={user} />;
      case 'study-with-me':
        return <StudyWithMe user={user} />;
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
      case 'projects':
      case 'project-showcase':
        return <ProjectShowcase user={user} setActiveTab={handleTabChange} />;
      case 'resume':
      case 'resume-creator':
      case 'resume-builder':
        return <ResumeCreator user={user} setActiveTab={handleTabChange} />;
      case 'clubs':
        return <ClubsPortal user={user} />;
      case 'marketplace':
        return <Marketplace user={user} />;
      case 'community':
        return <CommunityPortal user={user} />;
      case 'join-group':
        const joinHash = window.location.hash.substring(1);
        const joinGroupId = joinHash.split('/')[1] || null;
        return <JoinGroup groupId={joinGroupId} user={user} setActiveTab={handleTabChange} />;
      case 'team-portal':
      case 'team':
        return <TeamPortal user={user} setActiveTab={handleTabChange} />;
      case 'faculty-portal':
        const isFacultyUser = user?.role === 'faculty' || user?.role === 'mentor' || user?.role === 'founder' || user?.email?.toLowerCase() === 'founder@lumixora.com';
        if (isFacultyUser) {
          return <FacultyPortal user={user} setActiveTab={handleTabChange} />;
        }
        return <Dashboard setActiveTab={setActiveTab} user={user} />;
      case 'founder-portal':
        const isF = user?.role === 'founder' || 
                    user?.email?.toLowerCase() === 'founder@lumixora.com';
        if (isF) {
          return <FounderPortal user={user} setActiveTab={handleTabChange} />;
        }
        return <Dashboard setActiveTab={setActiveTab} user={user} />;
      default:
        return <Dashboard setActiveTab={handleTabChange} user={user} />;
    }
  };

  if (!isAuthenticated) {
    if (showLogin) {
      return (
        <>
          <button 
            onClick={() => setShowLogin(null)} 
            className="fixed top-6 left-6 z-[99999] px-4 py-2 bg-black/50 hover:bg-black/70 text-white text-sm font-bold rounded-xl backdrop-blur-md transition-all border border-white/20"
          >
            ← Back to Home
          </button>
          <AuthPortal onLogin={handleLogin} mode={showLogin} />
          {renderUpdateModal()}
        </>
      );
    }
    return (
      <>
        <LandingPage onLoginClick={(type) => setShowLogin(type || 'student')} />
        {renderUpdateModal()}
      </>
    );
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <GamificationProvider user={user} activeTab={activeTab}>
          <DataProvider>
            {showIntro && (
              <CinematicIntro onComplete={() => setShowIntro(false)} />
            )}
            <MainLayout activeTab={activeTab} setActiveTab={handleTabChange} user={user} onUpdateUser={setUser} onLogout={handleLogout} onExitApp={() => setShowExitModal(true)}>
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

