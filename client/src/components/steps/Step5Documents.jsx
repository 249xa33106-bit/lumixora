import React, { useRef } from 'react';
import { FileText, Upload, CheckCircle2, Trash2, AlertCircle, ShieldAlert, Award, Briefcase, FilePlus } from 'lucide-react';
import { useApplication } from '../../context/ApplicationContext';

export default function Step5Documents() {
  const {
    files,
    errors,
    handleDocSelect,
    removeDoc,
    nextStep,
    prevStep
  } = useApplication();

  const resumeInputRef = useRef(null);
  const certInputRef = useRef(null);
  const portInputRef = useRef(null);
  const addInputRef = useRef(null);

  const documentSlots = [
    {
      id: 'resume',
      title: 'Resume / Curriculum Vitae',
      description: 'Your up-to-date resume highlighting education, technical skills, and project experience.',
      mandatory: true,
      file: files.resume,
      info: files.resumeInfo,
      inputRef: resumeInputRef,
      icon: FileText
    },
    {
      id: 'certificates',
      title: 'Certificates & Academic Accreditations',
      description: 'Course completion, cloud certifications (AWS, GCP), or hackathon achievement awards.',
      mandatory: false,
      file: files.certificates,
      info: files.certificatesInfo,
      inputRef: certInputRef,
      icon: Award
    },
    {
      id: 'portfolioDoc',
      title: 'Project Portfolio Document / Case Studies',
      description: 'Curated design portfolio PDF, architecture diagrams, or product requirement write-ups.',
      mandatory: false,
      file: files.portfolioDoc,
      info: files.portfolioDocInfo,
      inputRef: portInputRef,
      icon: Briefcase
    },
    {
      id: 'additionalDoc',
      title: 'Additional Supporting Document',
      description: 'College recommendation letter, transcripts, or campus organization credentials.',
      mandatory: false,
      file: files.additionalDoc,
      info: files.additionalDocInfo,
      inputRef: addInputRef,
      icon: FilePlus
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Resume & Supporting Documents
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload your resume and any optional certifications. All documents must be in <strong>PDF format</strong> (Max 5 MB each).
        </p>
      </div>

      {/* Security callout */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong>Secure Document Vault:</strong> Your uploaded documents are stored in an encrypted filesystem and are strictly restricted to authorized Lumixora recruitment evaluators. Never upload sensitive identity cards (like Aadhaar or PAN).
        </div>
      </div>

      {/* Upload Cards Grid */}
      <div className="space-y-4">
        {documentSlots.map((slot) => {
          const SlotIcon = slot.icon;
          const hasError = errors[slot.id];

          return (
            <div
              key={slot.id}
              className={`p-5 rounded-2xl border transition-all ${
                hasError
                  ? 'border-rose-400 bg-rose-50/30'
                  : slot.file
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    slot.file
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {slot.file ? <CheckCircle2 className="w-5 h-5" /> : <SlotIcon className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {slot.title}
                      </h3>
                      {slot.mandatory ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {slot.description}
                    </p>

                    {slot.file && (
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{slot.file.name}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({slot.info?.size || (slot.file.size / (1024 * 1024)).toFixed(2) + ' MB'})
                        </span>
                      </div>
                    )}

                    {hasError && (
                      <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{hasError}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Upload Action */}
                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <input
                    ref={slot.inputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleDocSelect(slot.id, f);
                    }}
                    className="hidden"
                  />

                  {slot.file ? (
                    <button
                      type="button"
                      onClick={() => removeDoc(slot.id)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => slot.inputRef.current?.click()}
                      className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        slot.mandatory
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload PDF</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={prevStep}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={nextStep}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all cursor-pointer"
        >
          <span>Continue to Review & Submit</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
