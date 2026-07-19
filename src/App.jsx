import React, { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import DoubtSolving from './pages/DoubtSolving';
import NotesPlatform from './pages/NotesPlatform';
import TaskManager from './pages/TaskManager';
import AuthPortal from './pages/AuthPortal';
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
import { signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import { checkAppUpdate, isVersionOutdated, CURRENT_VERSION } from './services/updateService';
import FaceVerificationPortal from './pages/FaceVerificationPortal';
import StudyWithMe from './pages/StudyWithMe';
import ReportBug from './pages/ReportBug';
import LifeReplay from './pages/LifeReplay';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('lumixora_isAuthenticated') === 'true';
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('lumixora_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [isVerified, setIsVerified] = useState(() => {
    return sessionStorage.getItem('lumixora_isVerified') === 'true';
  });

  // Self-healing Capgo default channel configuration on native platforms
  useEffect(() => {
    const initCapgo = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (Capacitor.isNativePlatform()) {
          const { CapacitorUpdater } = await import('@capgo/capacitor-updater');
          await CapacitorUpdater.setChannel({ name: 'production' });
          console.log("Capgo default channel set to production programmatically.");
        }
      } catch (e) {
        console.warn("Failed to set Capgo channel programmatically:", e);
      }
    };
    initCapgo();
  }, []);

  // SPA hash history router for native feeling & back button support
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // remove '#'
      if (hash) {
        const parts = hash.split('/');
        const tab = parts[0];
        if (['dashboard', 'future-twin', 'coding-practice', 'code-editor', 'doubts', 'learning-hub', 'notes', 'tasks', 'contribute', 'contact', 'mentor', 'study-with-me', 'report-bug', 'life-replay'].includes(tab)) {
          setActiveTab(tab);
        }
      } else {
        setActiveTab('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Initial check on load
    if (!window.location.hash) {
      window.location.hash = 'dashboard';
    } else {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

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
            <div className="w-16 h-16 rounded-full bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center text-brand-pink text-3xl animate-bounce">
              🚀
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-gray-100 uppercase tracking-wider animate-pulse">New Update Available!</h2>
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
                className="flex-1 bg-brand-teal hover:opacity-95 text-black font-extrabold py-3 rounded-2xl text-xs text-center transition-all block shadow-[0_0_15px_rgba(0,245,212,0.3)] cursor-pointer"
              >
                Update Now
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('lumixora_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lumixora_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lumixora_isAuthenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsVerified(false);
    sessionStorage.removeItem('lumixora_isVerified');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsVerified(false);
    sessionStorage.removeItem('lumixora_isVerified');
    signOut(auth).catch((err) => console.warn("Firebase signout error:", err));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} user={user} />;
      case 'future-twin':
        return <AiFutureTwin user={user} setActiveTab={handleTabChange} />;
      case 'coding-practice':
        return <CodingPractice setSelectedProblem={setSelectedProblem} setActiveTab={setActiveTab} user={user} />;
      case 'code-editor':
        return <CodeEditorPage problem={selectedProblem} setActiveTab={setActiveTab} user={user} />;
      case 'doubts':
        return <DoubtSolving user={user} />;
      case 'notes':
        return <NotesPlatform user={user} />;
      case 'tasks':
        return <TaskManager user={user} />;
      case 'learning-hub':
        return <LearningHub user={user} />;
      case 'contribute':
        return <ContributeNotes user={user} setActiveTab={handleTabChange} />;
      case 'contact':
        return <ContactUs user={user} />;
      case 'mentor':
        return <PersonalMentor user={user} />;
      case 'study-with-me':
        return <StudyWithMe user={user} />;
      case 'report-bug':
        return <ReportBug user={user} />;
      case 'life-replay':
        return <LifeReplay user={user} />;
      default:
        return <Dashboard setActiveTab={handleTabChange} user={user} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <AuthPortal onLogin={handleLogin} />
        {renderUpdateModal()}
      </>
    );
  }

  if (!isVerified) {
    return (
      <>
        <FaceVerificationPortal 
          user={user} 
          onUpdateUser={setUser}
          onVerified={() => {
            setIsVerified(true);
            sessionStorage.setItem('lumixora_isVerified', 'true');
          }} 
          onLogout={handleLogout} 
        />
        {renderUpdateModal()}
      </>
    );
  }



  return (
    <ThemeProvider>
      <ToastProvider>
        <GamificationProvider user={user} activeTab={activeTab}>
          <DataProvider>
            <MainLayout activeTab={activeTab} setActiveTab={handleTabChange} user={user} onUpdateUser={setUser} onLogout={handleLogout}>
              {renderContent()}
            </MainLayout>
            {renderUpdateModal()}
          </DataProvider>
        </GamificationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
