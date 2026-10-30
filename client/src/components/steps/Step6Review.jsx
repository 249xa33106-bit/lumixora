import React from 'react';
import { CheckCircle, Edit3, AlertCircle, FileText, Lock, Loader2, Sparkles, User, GraduationCap, Compass, Code } from 'lucide-react';
import { useApplication } from '../../context/ApplicationContext';

export default function Step6Review({ onOpenPrivacy, onOpenTerms }) {
  const {
    formData,
    files,
    errors,
    updateConsent,
    goToStep,
    prevStep,
    submitApplication,
    isSubmitting,
    submitError
  } = useApplication();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Review Application & Candidate Consent
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Please carefully inspect your details before official submission. You can click "Edit" on any section to revise information.
        </p>
      </div>

      {submitError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold block">Submission Blocked:</span>
            <span>{submitError}</span>
          </div>
        </div>
      )}

      {/* Review Section 1: Personal & Photo */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <User className="w-4 h-4 text-indigo-600" />
            <span>1. Personal Information & Photo</span>
          </div>
          <button
            type="button"
            onClick={() => goToStep(1)}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {files.photoPreviewUrl ? (
            <img
              src={files.photoPreviewUrl}
              alt="Applicant"
              className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-xs text-rose-600 font-semibold shrink-0">
              No Photo
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs flex-1">
            <div>
              <span className="text-slate-400 block font-medium">Full Legal Name</span>
              <span className="font-semibold text-slate-900">{formData.personal.fullName || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Date of Birth</span>
              <span className="font-semibold text-slate-900">{formData.personal.dob || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Gender</span>
              <span className="font-semibold text-slate-900">{formData.personal.gender || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Email Address</span>
              <span className="font-semibold text-slate-900">{formData.personal.email || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Mobile Phone</span>
              <span className="font-semibold text-slate-900">{formData.personal.mobileNumber || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Location</span>
              <span className="font-semibold text-slate-900">
                {[formData.personal.city, formData.personal.state, formData.personal.country].filter(Boolean).join(', ') || '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section 2: Education */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>2. Educational Background</span>
          </div>
          <button
            type="button"
            onClick={() => goToStep(2)}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs">
          <div className="sm:col-span-2">
            <span className="text-slate-400 block font-medium">College / University</span>
            <span className="font-semibold text-slate-900">{formData.education.collegeName || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">College Location</span>
            <span className="font-semibold text-slate-900">{formData.education.collegeLocation || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Degree & Branch</span>
            <span className="font-semibold text-slate-900">{formData.education.degree} in {formData.education.department || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Year of Study & Semester</span>
            <span className="font-semibold text-slate-900">{formData.education.currentYear} {formData.education.currentSemester ? `(${formData.education.currentSemester})` : ''}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Graduation Year</span>
            <span className="font-semibold text-slate-900">{formData.education.graduationYear || '—'}</span>
          </div>
        </div>
      </div>

      {/* Review Section 3: Preferences */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>3. Internship Preferences</span>
          </div>
          <button
            type="button"
            onClick={() => goToStep(3)}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Preferred Domain</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
              {formData.preferences.preferredDomain}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Secondary Domain</span>
            <span className="font-semibold text-slate-900">{formData.preferences.secondaryDomain}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Arrangement & Duration</span>
            <span className="font-semibold text-slate-900">{formData.preferences.workingArrangement} • {formData.preferences.duration}</span>
          </div>
          <div className="sm:col-span-3 mt-1">
            <span className="text-slate-400 block font-medium">Why Lumixora?</span>
            <p className="text-slate-700 font-medium italic mt-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              "{formData.preferences.whyJoin}"
            </p>
          </div>
        </div>
      </div>

      {/* Review Section 4: Skills & Documents */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Code className="w-4 h-4 text-indigo-600" />
            <span>4. Skills & Uploaded Documents</span>
          </div>
          <button
            type="button"
            onClick={() => goToStep(5)}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-400 block font-medium mb-1">Technical Skills</span>
            <div className="flex flex-wrap gap-1.5">
              {formData.skills.technicalSkills.map(s => (
                <span key={s} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <span className="text-slate-400 block font-medium">Resume File:</span>
              {files.resume ? (
                <span className="font-bold text-emerald-700 flex items-center space-x-1 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{files.resume.name}</span>
                </span>
              ) : (
                <span className="text-rose-600 font-bold">Missing Resume</span>
              )}
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Additional Certificates:</span>
              <span className="font-medium text-slate-700">
                {files.certificates ? files.certificates.name : 'None attached'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Declaration & Consent (Mandatory Checkboxes) */}
      <div className="p-6 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-4">
        <div className="flex items-center space-x-2 text-indigo-950 font-bold text-sm">
          <Lock className="w-4 h-4 text-indigo-600" />
          <span>Declaration & Recruitment Consent (Mandatory)</span>
        </div>
        <p className="text-xs text-slate-600">
          Please read and acknowledge each declaration item below. All three checkboxes are strictly required before submitting.
        </p>

        <div className="space-y-3 pt-1">
          {/* Checkbox 1 */}
          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.consent.accuracyConfirmed}
              onChange={(e) => updateConsent('accuracyConfirmed', e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-xs text-slate-700 group-hover:text-slate-900 font-medium leading-relaxed">
              I confirm that all information provided in this application is accurate, truthful, and complete to the best of my knowledge.
            </span>
          </label>
          {errors.accuracyConfirmed && (
            <p className="text-xs text-rose-600 font-medium pl-7">{errors.accuracyConfirmed}</p>
          )}

          {/* Checkbox 2 */}
          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.consent.recruitmentConsent}
              onChange={(e) => updateConsent('recruitmentConsent', e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-xs text-slate-700 group-hover:text-slate-900 font-medium leading-relaxed">
              I agree to the processing and evaluation of my application information and submitted files by Lumixora recruitment and technical evaluators.
            </span>
          </label>
          {errors.recruitmentConsent && (
            <p className="text-xs text-rose-600 font-medium pl-7">{errors.recruitmentConsent}</p>
          )}

          {/* Checkbox 3 */}
          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.consent.termsAndPrivacyConsent}
              onChange={(e) => updateConsent('termsAndPrivacyConsent', e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-xs text-slate-700 group-hover:text-slate-900 font-medium leading-relaxed">
              I have read and agree to Lumixora's{' '}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); onOpenTerms(); }}
                className="text-indigo-600 hover:text-indigo-800 underline font-semibold"
              >
                Internship Program Terms
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); onOpenPrivacy(); }}
                className="text-indigo-600 hover:text-indigo-800 underline font-semibold"
              >
                Privacy Policy
              </button>
              .
            </span>
          </label>
          {errors.termsAndPrivacyConsent && (
            <p className="text-xs text-rose-600 font-medium pl-7">{errors.termsAndPrivacyConsent}</p>
          )}
        </div>
      </div>

      {/* Submission Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={submitApplication}
          disabled={isSubmitting}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:brightness-105 transition-all cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Submit Internship Application</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
