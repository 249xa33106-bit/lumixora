import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  Shield,
  Clock,
  Compass,
  X,
  MapPin,
  Building2,
  Users
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);
  const [demoSubmitted, setDemoSubmitted] = useState<boolean>(false);
  const [instName, setInstName] = useState<string>('Kurnool Elite IIT-JEE Academy');
  const [contactName, setContactName] = useState<string>('Academic Director');
  const [contactEmail, setContactEmail] = useState<string>('director@kurnoolacademy.edu.in');

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setShowDemoModal(false);
      setDemoSubmitted(false);
      onEnterApp();
    }, 1800);
  };

  const workflowSteps = [
    {
      num: '01',
      title: 'Import Assessment CSVs',
      desc: 'Seamlessly upload weekly test marks or OMR exports with instant duplicate and schema validation.',
      icon: FileSpreadsheet,
    },
    {
      num: '02',
      title: 'Algorithmic Gap Detection',
      desc: 'Transparent rules engine identifies recurring topic struggles vs. single poor tests with clear evidence.',
      icon: Layers,
    },
    {
      num: '03',
      title: 'Teacher Action Centre',
      desc: 'Platform hero: Turn test weaknesses into assigned remedial workshops, worksheets, and 1-on-1 clinics.',
      icon: Sparkles,
    },
    {
      num: '04',
      title: 'Measure Observed Change',
      desc: 'Re-assess and objectively quantify student score improvements post-intervention without unsupported claims.',
      icon: TrendingUp,
    },
  ];

  const teacherBenefits = [
    'Saves 4+ hours per week eliminating manual spreadsheet sorting.',
    'Automatic cohort grouping for targeted revision problem sets.',
    'Transparent reasons for every recommendation — no black-box AI.',
    'Ethical, supportive language: Never labels students as "weak" or "failures".',
    'Executive PDF dossiers ready for parent-teacher meetings and coordinators.',
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">EduPulse</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                SaaS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Every test should lead to a better next step.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDemoModal(true)}
            className="text-xs font-semibold px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block"
          >
            Request Kurnool Pilot
          </button>
          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all shadow-md shadow-teal-600/20"
          >
            <span>Launch Live MVP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-6 sm:px-12 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-teal-600" />
          <span>Piloting in Kurnool, Andhra Pradesh • IIT-JEE, NEET & EAPCET Cohorts</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
          Transform Exam Scores into <br className="hidden sm:block" />
          <span className="text-teal-600 bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
            Teacher Actions
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Coaching centres collect marks every weekend, but spreadsheets can't tell faculty what to do on Monday morning.
          <b className="font-semibold text-slate-800"> EduPulse</b> automatically diagnoses recurring topic gaps, assigns targeted interventions,
          and measures observed student progress.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-600/25"
          >
            <span>Explore Apex Academy Demo (Kurnool)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDemoModal(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm rounded-xl transition-colors shadow-2xs"
          >
            Schedule Institution Pilot Walkthrough
          </button>
        </div>

        {/* Fictional disclaimer notice */}
        <p className="text-xs text-slate-400 italic">
          * Demo features fictionalized data for “Apex Academy of Sciences, Kurnool (AP)” across 32 students and 15 competitive assessments.
        </p>
      </section>

      {/* The 4-Step Workflow */}
      <section className="py-16 bg-white border-y border-slate-200 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              End-to-End Execution
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              How EduPulse Drives Measurable Improvement
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow relative"
                >
                  <span className="text-3xl font-black text-slate-200 font-mono absolute top-4 right-4">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teachers & Academic Coordinators Section */}
      <section className="py-16 px-6 sm:px-12 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 to-navy text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Designed For Real Faculty Workflows
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Built to Empower Teachers, Not Overwhelm Them
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We know teachers in competitive-exam hubs like Kurnool already face intense pressure. 
              EduPulse doesn't add administrative burdens — it organizes test results into ready-to-execute remedial tasks.
            </p>

            <ul className="space-y-2.5 pt-2">
              {teacherBenefits.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                AP
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Apex Academy of Sciences</h4>
                <p className="text-xs text-slate-400">Kurnool Centre, Andhra Pradesh</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-900/60">
                <span className="text-slate-400">Students Tracked:</span>
                <span className="font-bold text-white">32 Aspirants</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900/60">
                <span className="text-slate-400">Observed Improvement:</span>
                <span className="font-bold text-emerald-400">+19.6% Avg Score Delta</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900/60">
                <span className="text-slate-400">Teacher Remedials:</span>
                <span className="font-bold text-teal-300">100% Post-Test Reassessed</span>
              </div>
            </div>

            <button
              onClick={onEnterApp}
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors text-center"
            >
              Open Pilot Workspace Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-slate-200 px-6 sm:px-12 text-center text-xs text-slate-500 space-y-2">
        <p className="font-bold text-slate-800">
          EduPulse — “Every test should lead to a better next step.”
        </p>
        <p>
          Target Market: Competitive-exam coaching centres & junior colleges in Kurnool, Andhra Pradesh, India.
        </p>
        <p className="text-[11px] text-slate-400">
          © 2026 EduPulse EdTech SaaS. Built with React, TypeScript, FastAPI, Pandas & ReportLab.
        </p>
      </footer>

      {/* Pilot Demo Request Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Request Kurnool Pilot Onboarding
              </h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {demoSubmitted ? (
              <div className="py-8 text-center space-y-2 text-emerald-800">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600 animate-bounce" />
                <h4 className="font-bold text-sm">Pilot Request Received!</h4>
                <p className="text-xs text-slate-600">
                  Launching your interactive demo session now...
                </p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Institution / Coaching Centre Name
                  </label>
                  <input
                    type="text"
                    required
                    value={instName}
                    onChange={(e) => setInstName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Coordinator / Director Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Official Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors shadow-xs"
                  >
                    Confirm & Open Interactive Sandbox
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
