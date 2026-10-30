import React from 'react';
import { Check, User, GraduationCap, Compass, Code, FileText, CheckCircle } from 'lucide-react';
import { useApplication } from '../context/ApplicationContext';

const STEPS = [
  { number: 1, title: 'Personal Details', short: 'Personal', icon: User },
  { number: 2, title: 'Education', short: 'Education', icon: GraduationCap },
  { number: 3, title: 'Internship Preferences', short: 'Preferences', icon: Compass },
  { number: 4, title: 'Skills & Experience', short: 'Skills', icon: Code },
  { number: 5, title: 'Documents', short: 'Documents', icon: FileText },
  { number: 6, title: 'Review & Submit', short: 'Review', icon: CheckCircle },
];

export default function StepIndicator() {
  const { currentStep, goToStep } = useApplication();

  return (
    <div className="w-full bg-white border-y border-slate-200 py-4 px-4 sm:px-6 shadow-xs">
      <div className="max-w-5xl mx-auto">
        {/* Desktop Step Bar */}
        <div className="hidden md:flex items-center justify-between">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const StepIcon = step.icon;

            return (
              <React.Fragment key={step.number}>
                <button
                  type="button"
                  onClick={() => {
                    if (step.number < currentStep) goToStep(step.number);
                  }}
                  disabled={step.number > currentStep}
                  className={`group flex items-center space-x-3 text-left transition-all ${
                    step.number < currentStep ? 'cursor-pointer' : step.number === currentStep ? 'cursor-default' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm transition-all duration-200 shadow-xs ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-emerald-100'
                        : isCurrent
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-indigo-100'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <StepIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Step 0{step.number}
                    </span>
                    <span
                      className={`block text-xs font-semibold ${
                        isCurrent ? 'text-indigo-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </button>

                {idx < STEPS.length - 1 && (
                  <div className="flex-1 mx-3 h-[2px] bg-slate-100 relative">
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-emerald-500 transition-all duration-300"
                      style={{
                        width: isCompleted ? '100%' : '0%'
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile Step Bar */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step {currentStep} of 6
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-800">
                {STEPS[currentStep - 1].title}
              </span>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {Math.round(((currentStep - 1) / 5) * 100)}% Completed
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>

          <div className="flex justify-between mt-2 text-[11px] text-slate-400 font-medium">
            <span>Personal</span>
            <span>Education</span>
            <span>Domain</span>
            <span>Skills</span>
            <span>Docs</span>
            <span>Review</span>
          </div>
        </div>
      </div>
    </div>
  );
}
