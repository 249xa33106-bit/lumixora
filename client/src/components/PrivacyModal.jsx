import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, FileText } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose, mode = 'privacy' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              {mode === 'privacy' ? <ShieldCheck className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {mode === 'privacy' ? 'Lumixora Recruitment Privacy Policy & Data Retention' : 'Lumixora Internship Program Terms & Conditions'}
              </h2>
              <p className="text-xs text-slate-500">Effective for 2026 Academic Recruitment Cohort</p>
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
        <div className="p-6 space-y-5 text-xs text-slate-600 leading-relaxed">
          {mode === 'privacy' ? (
            <>
              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-indigo-900 space-y-1">
                <span className="font-bold block">Recruitment Privacy Commitment</span>
                <p>
                  Lumixora Technologies Inc. is committed to protecting candidate personal data. We collect strictly the information necessary to evaluate your candidacy for our internship cohorts.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">1. Information We Collect</h4>
                <p>
                  We collect your full name, contact details (email, phone, city, country), educational background, technical competencies, portfolio/project links, profile photo, and uploaded resumes/certificates.
                </p>
                <p className="mt-1 font-semibold text-slate-700">
                  Strict Security Exclusion: We never solicit or store government identification numbers (such as Aadhaar, PAN, SSN), bank credentials, account passwords, or unnecessary sensitive personal records.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">2. Secure Storage & Non-Public Access</h4>
                <p>
                  All uploaded profile photos and PDF documents are stored in dedicated access-controlled storage directories on our servers. File references in the database store file metadata only—never raw Base64 payloads. Private applicant documents are never exposed through public search engine indices or unauthenticated links.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">3. Use of Personal Data</h4>
                <p>
                  Your information is utilized solely for recruitment evaluation, technical skill assessments, interview scheduling, and internship onboarding communications. We do not sell or rent candidate information to third parties.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">4. Data Retention & Deletion Rights</h4>
                <p>
                  Recruitment data is retained for a maximum of 12 months following cohort conclusion for audit and talent re-engagement. Applicants may request deletion or anonymization of their application profile anytime by emailing <span className="font-mono text-indigo-600">privacy@lumixora.com</span> with their Application ID.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-1">
                <span className="font-bold block">Internship Program Guidelines</span>
                <p>
                  By submitting an application to Lumixora, you agree to comply with our academic internship code of conduct, intellectual integrity policies, and technical collaboration terms.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">1. Candidacy & Single Application Rule</h4>
                <p>
                  Each applicant may submit one application per recruitment cycle. Submitting duplicate entries under multiple email aliases is prohibited and may result in disqualification.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">2. Original Work & Authorship</h4>
                <p>
                  Submitted portfolio projects, code repositories, and design artifacts must reflect your genuine contributions. Plagiarism or misrepresenting open-source projects as sole creations is grounds for immediate rejection.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">3. Internship Offers & Verification</h4>
                <p>
                  Internship selections are conditional upon verification of student enrollment status with your accredited college or university. Lumixora offers flexible working arrangements (Remote, Hybrid, On-site) subject to project role specifications.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
