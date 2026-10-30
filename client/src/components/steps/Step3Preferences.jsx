import React from 'react';
import { Compass, Calendar, Clock, Laptop, Building, Globe, Check } from 'lucide-react';
import { useApplication } from '../../context/ApplicationContext';
import { DOMAINS, DURATIONS, WORKING_ARRANGEMENTS } from '../../constants/domains';

export default function Step3Preferences() {
  const {
    formData,
    errors,
    updatePreferences,
    nextStep,
    prevStep
  } = useApplication();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Internship Preferences & Motivation
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Select your primary technical or business focus area and tell us what drives you.
        </p>
      </div>

      {/* Preferred Internship Domain (8 approved domains) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700">
            Preferred Internship Domain <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs text-slate-500 font-medium">8 Approved Tracks</span>
        </div>

        {errors.preferredDomain && (
          <p className="text-xs text-rose-600 font-medium">{errors.preferredDomain}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DOMAINS.map((domain) => {
            const isSelected = formData.preferences.preferredDomain === domain.id;
            return (
              <div
                key={domain.id}
                onClick={() => updatePreferences('preferredDomain', domain.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all text-left relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-slate-900">
                      {domain.title}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {domain.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {domain.popularSkills.slice(0, 3).map(skill => (
                    <span key={skill} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      {skill}
                    </span>
                  ))}
                  <span className="text-[10px] text-slate-400 self-center">+{domain.popularSkills.length - 3} more</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Preferred Domain (Optional) */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Secondary Preferred Domain <span className="text-slate-400 font-normal">(Optional alternate choice)</span>
        </label>
        <select
          value={formData.preferences.secondaryDomain}
          onChange={(e) => updatePreferences('secondaryDomain', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="None">None (Only consider primary domain)</option>
          {DOMAINS.filter(d => d.id !== formData.preferences.preferredDomain).map(d => (
            <option key={d.id} value={d.id}>{d.title}</option>
          ))}
        </select>
      </div>

      {/* Why do you want to join Lumixora? */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Why do you want to join Lumixora? <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-slate-400">
            {formData.preferences.whyJoin.length} / min 20 chars
          </span>
        </div>
        <textarea
          rows={3}
          value={formData.preferences.whyJoin}
          onChange={(e) => updatePreferences('whyJoin', e.target.value)}
          placeholder="Share what attracts you to Lumixora's mission, technology culture, and product initiatives..."
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
            errors.whyJoin
              ? 'border-rose-400 focus:ring-rose-200'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
          }`}
        />
        {errors.whyJoin && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.whyJoin}</p>}
      </div>

      {/* What do you expect to learn? */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700">
            What do you expect to learn during this internship? <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-slate-400">
            {formData.preferences.expectationsToLearn.length} / min 20 chars
          </span>
        </div>
        <textarea
          rows={3}
          value={formData.preferences.expectationsToLearn}
          onChange={(e) => updatePreferences('expectationsToLearn', e.target.value)}
          placeholder="Specific engineering principles, tools, soft skills, or leadership capabilities you aim to build..."
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
            errors.expectationsToLearn
              ? 'border-rose-400 focus:ring-rose-200'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
          }`}
        />
        {errors.expectationsToLearn && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.expectationsToLearn}</p>}
      </div>

      {/* Duration, Joining Date & Working Arrangement */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Preferred Duration */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Preferred Duration <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Clock className="w-4 h-4" />
            </div>
            <select
              value={formData.preferences.duration}
              onChange={(e) => updatePreferences('duration', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {DURATIONS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Expected Joining Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Expected Joining Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              value={formData.preferences.expectedJoiningDate}
              onChange={(e) => updatePreferences('expectedJoiningDate', e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all bg-white text-slate-900 focus:outline-none focus:ring-2 ${
                errors.expectedJoiningDate
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.expectedJoiningDate && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.expectedJoiningDate}</p>}
        </div>

        {/* Working Arrangement */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Working Arrangement <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Laptop className="w-4 h-4" />
            </div>
            <select
              value={formData.preferences.workingArrangement}
              onChange={(e) => updatePreferences('workingArrangement', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {WORKING_ARRANGEMENTS.map(arr => (
                <option key={arr} value={arr}>{arr}</option>
              ))}
            </select>
          </div>
        </div>
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
          <span>Continue to Skills & Experience</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
