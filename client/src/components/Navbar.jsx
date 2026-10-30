import React from 'react';
import { Sparkles, Search, ShieldCheck, FileText, RotateCcw } from 'lucide-react';
import { useApplication } from '../context/ApplicationContext';

export default function Navbar({ onOpenTrack, onToggleAdmin, isAdminView }) {
  const { resetForm, currentStep } = useApplication();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { if (isAdminView) onToggleAdmin(false); }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Lumixora
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Internships
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Recruitment & Talent Hub</p>
            </div>
          </div>

          {/* Action Links & Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {!isAdminView && (
              <>
                <button
                  type="button"
                  onClick={onOpenTrack}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                >
                  <Search className="w-4 h-4 text-slate-500" />
                  <span>Track Status</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Clear all unsaved form answers and reset to blank?')) {
                      resetForm();
                    }
                  }}
                  title="Reset form"
                  className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Form</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => onToggleAdmin(!isAdminView)}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                isAdminView
                  ? 'bg-slate-800 text-white hover:bg-slate-900'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAdminView ? '← Applicant Portal' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
