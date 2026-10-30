import React, { useState, useEffect } from 'react';
import { ApplicationProvider, useApplication } from './context/ApplicationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StepIndicator from './components/StepIndicator';
import Step1Personal from './components/steps/Step1Personal';
import Step2Education from './components/steps/Step2Education';
import Step3Preferences from './components/steps/Step3Preferences';
import Step4Skills from './components/steps/Step4Skills';
import Step5Documents from './components/steps/Step5Documents';
import Step6Review from './components/steps/Step6Review';
import ApplicationSuccess from './components/ApplicationSuccess';
import TrackStatusModal from './components/TrackStatusModal';
import PrivacyModal from './components/PrivacyModal';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Star, Users } from 'lucide-react';

function MainPortalContent({
  onOpenTrack,
  onOpenPrivacy,
  onOpenTerms,
  isAdminView,
  onToggleAdmin
}) {
  const { currentStep, submissionSuccess } = useApplication();

  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('lumixora_admin_token'));
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const u = localStorage.getItem('lumixora_admin_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  });

  const handleAdminLoginSuccess = (token, user) => {
    setAdminToken(token);
    setAdminUser(user);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('lumixora_admin_token');
    localStorage.removeItem('lumixora_admin_user');
    setAdminToken(null);
    setAdminUser(null);
  };

  if (isAdminView) {
    if (!adminToken) {
      return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
    }
    return <AdminDashboard token={adminToken} user={adminUser} onLogout={handleAdminLogout} />;
  }

  if (submissionSuccess) {
    return <ApplicationSuccess onOpenTrack={onOpenTrack} />;
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-indigo-50/50 via-white to-transparent">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>2026 Academic Internship Cohort • Applications Open</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Build Tomorrow’s Technologies with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
              Lumixora
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Join our immersive engineering, design, and product cohorts. Work side-by-side with industry mentors on production-grade systems and AI applications.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>8 Specialized Domains</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Remote / Hybrid Flexibility</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Industry Mentorship & Stipend</span>
            </span>
          </div>
        </div>
      </section>

      {/* Step Indicator */}
      <StepIndicator />

      {/* Main Multi-Step Form Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl shadow-slate-100">
          {currentStep === 1 && <Step1Personal />}
          {currentStep === 2 && <Step2Education />}
          {currentStep === 3 && <Step3Preferences />}
          {currentStep === 4 && <Step4Skills />}
          {currentStep === 5 && <Step5Documents />}
          {currentStep === 6 && (
            <Step6Review
              onOpenPrivacy={onOpenPrivacy}
              onOpenTerms={onOpenTerms}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [trackInitialId, setTrackInitialId] = useState('');
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('privacy');

  const openTrack = (initialId = '') => {
    setTrackInitialId(initialId);
    setTrackModalOpen(true);
  };

  const openPrivacy = () => {
    setModalMode('privacy');
    setPrivacyModalOpen(true);
  };

  const openTerms = () => {
    setModalMode('terms');
    setPrivacyModalOpen(true);
  };

  return (
    <ApplicationProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Navbar
          onOpenTrack={() => openTrack('')}
          onToggleAdmin={setIsAdminView}
          isAdminView={isAdminView}
        />

        <div className="flex-1">
          <MainPortalContent
            onOpenTrack={openTrack}
            onOpenPrivacy={openPrivacy}
            onOpenTerms={openTerms}
            isAdminView={isAdminView}
            onToggleAdmin={setIsAdminView}
          />
        </div>

        <Footer
          onOpenPrivacy={openPrivacy}
          onOpenTerms={openTerms}
        />

        {/* Status Tracker Modal */}
        <TrackStatusModal
          isOpen={trackModalOpen}
          initialAppId={trackInitialId}
          onClose={() => setTrackModalOpen(false)}
        />

        {/* Privacy Policy & Terms Modal */}
        <PrivacyModal
          isOpen={privacyModalOpen}
          mode={modalMode}
          onClose={() => setPrivacyModalOpen(false)}
        />
      </div>
    </ApplicationProvider>
  );
}
