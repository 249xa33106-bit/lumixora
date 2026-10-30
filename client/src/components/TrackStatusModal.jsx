import React, { useState } from 'react';
import { X, Search, Loader2, CheckCircle2, AlertCircle, Clock, Calendar, Laptop, Building2, User } from 'lucide-react';

const RECRUITMENT_STAGES = [
  'Submitted',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected'
];

export default function TrackStatusModal({ isOpen, onClose, initialAppId = '' }) {
  const [appId, setAppId] = useState(initialAppId);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!appId.trim() || !email.trim()) {
      setError('Please provide both Application ID and registered email.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/applications/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: appId.trim(),
          email: email.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'No application record found.');
      }

      setResult(data.application);
    } catch (err) {
      setError(err.message || 'Failed to retrieve application status.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Interview Scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Shortlisted':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Track Application Progress</h2>
              <p className="text-xs text-slate-500">Live recruitment pipeline status</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application ID
              </label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="e.g. LMX-2026-48192"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-indigo-500 uppercase tracking-wide font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching Records...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Check Current Status</span>
                </>
              )}
            </button>
          </form>

          {/* Results Display */}
          {result && (
            <div className="pt-4 border-t border-slate-200 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Candidate</span>
                  <span className="text-sm font-bold text-slate-900">{result.fullName}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(result.status)}`}>
                  {result.status}
                </span>
              </div>

              {/* Progress Steps */}
              {result.status !== 'Rejected' ? (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700">Recruitment Milestone:</div>
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {RECRUITMENT_STAGES.map((stg, i) => {
                      const currentIdx = RECRUITMENT_STAGES.indexOf(result.status);
                      const isPastOrCurrent = currentIdx >= i;
                      const isCurrent = result.status === stg;

                      return (
                        <div key={stg} className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                              : isPastOrCurrent
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-400'
                          }`}>
                            {isPastOrCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                          </div>
                          <span className={`text-[10px] mt-1.5 leading-tight ${isCurrent ? 'font-bold text-indigo-700' : 'text-slate-500'}`}>
                            {stg}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed">
                  Thank you for your interest in Lumixora. Due to competitive cohort quotas, this application was not selected for advancement. We warmly encourage you to apply for future cohorts.
                </div>
              )}

              {/* Application Details Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Applied Track</span>
                  <span className="font-semibold text-slate-800">{result.preferredDomain}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Arrangement</span>
                  <span className="font-semibold text-slate-800">{result.workingArrangement} ({result.duration})</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Submitted On</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(result.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Last Activity</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(result.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
