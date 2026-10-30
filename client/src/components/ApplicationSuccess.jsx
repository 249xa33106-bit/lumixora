import React, { useEffect, useState } from 'react';
import { CheckCircle2, Copy, Check, Search, Calendar, FileText, ArrowRight, Printer, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApplication } from '../context/ApplicationContext';

export default function ApplicationSuccess({ onOpenTrack }) {
  const { submissionSuccess, resetForm } = useApplication();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  const appId = submissionSuccess?.applicationId || 'LMX-2026-00000';
  const applicant = submissionSuccess?.application || {};

  const copyAppId = () => {
    navigator.clipboard.writeText(appId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-center">
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-8 text-white relative">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Application Submitted Successfully!
          </h1>
          <p className="text-emerald-50 text-sm mt-2 max-w-md mx-auto">
            Thank you for applying to the Lumixora Internship Program. Your profile and portfolio credentials are now in review.
          </p>
        </div>

        {/* Application ID Card */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-lg mx-auto">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
              Your Official Lumixora Application ID
            </span>
            <div className="flex items-center justify-center space-x-3 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-indigo-950 font-mono tracking-wider">
                {appId}
              </span>
              <button
                type="button"
                onClick={copyAppId}
                title="Copy Application ID"
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-xs cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Please save this ID. You will need it along with your registered email (<strong>{applicant.email}</strong>) to track recruitment progress.
            </p>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto text-xs bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-medium">Applicant</span>
              <span className="font-bold text-slate-800">{applicant.fullName || 'Candidate'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Applied Track</span>
              <span className="font-bold text-indigo-700">{applicant.preferredDomain || 'Web Development'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Initial Status</span>
              <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-100">
                {applicant.status || 'Submitted'}
              </span>
            </div>
          </div>

          {/* Next Steps Recruitment Roadmap */}
          <div className="text-left max-w-lg mx-auto bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>What Happens Next?</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <div>
                  <strong className="text-slate-800 block">Confirmation Email Dispatched</strong>
                  An official application receipt has been sent to your registered email address.
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <div>
                  <strong className="text-slate-800 block">Talent Committee Screening (3–5 days)</strong>
                  Our engineering and design leaders evaluate your portfolio projects and background.
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <div>
                  <strong className="text-slate-800 block">Technical Evaluation & Interview</strong>
                  Shortlisted candidates will receive an invitation for an interactive discussion.
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenTrack(appId)}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Track Application Status</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold text-sm bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Application Receipt</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-500 hover:text-indigo-600 underline cursor-pointer"
            >
              Submit another application or start new session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
