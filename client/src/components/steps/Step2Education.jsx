import React from 'react';
import { GraduationCap, Building2, BookOpen, Calendar, MapPin, Hash } from 'lucide-react';
import { useApplication } from '../../context/ApplicationContext';
import { DEGREES, YEARS_OF_STUDY, GRADUATION_YEARS } from '../../constants/domains';

export default function Step2Education() {
  const {
    formData,
    errors,
    updateEducation,
    nextStep,
    prevStep
  } = useApplication();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Educational Background
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Tell us about your university, current degree curriculum, and academic timeline.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* College / University Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            College / University Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.education.collegeName}
              onChange={(e) => updateEducation('collegeName', e.target.value)}
              placeholder="e.g. National Institute of Technology, Karnataka (NITK)"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.collegeName
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.collegeName && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.collegeName}</p>}
        </div>

        {/* Degree */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Degree <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <select
              value={formData.education.degree}
              onChange={(e) => updateEducation('degree', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {DEGREES.map((deg) => (
                <option key={deg} value={deg}>{deg}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Department / Branch */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Department / Major / Branch <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.education.department}
              onChange={(e) => updateEducation('department', e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.department
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.department && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.department}</p>}
        </div>

        {/* Current Year of Study */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Current Year of Study <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.education.currentYear}
            onChange={(e) => updateEducation('currentYear', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {YEARS_OF_STUDY.map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>

        {/* Current Semester (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Current Semester <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <select
            value={formData.education.currentSemester}
            onChange={(e) => updateEducation('currentSemester', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Not Applicable / Select</option>
            <option value="Sem 1">Semester 1</option>
            <option value="Sem 2">Semester 2</option>
            <option value="Sem 3">Semester 3</option>
            <option value="Sem 4">Semester 4</option>
            <option value="Sem 5">Semester 5</option>
            <option value="Sem 6">Semester 6</option>
            <option value="Sem 7">Semester 7</option>
            <option value="Sem 8">Semester 8</option>
          </select>
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Expected / Actual Graduation Year <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <select
              value={formData.education.graduationYear}
              onChange={(e) => updateEducation('graduationYear', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {GRADUATION_YEARS.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* College Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            College Location (City, State) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.education.collegeLocation}
              onChange={(e) => updateEducation('collegeLocation', e.target.value)}
              placeholder="e.g. Surathkal, Karnataka"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.collegeLocation
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.collegeLocation && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.collegeLocation}</p>}
        </div>

        {/* College Roll Number (Optional) */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            College Roll Number / Student ID <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Hash className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.education.rollNumber}
              onChange={(e) => updateEducation('rollNumber', e.target.value)}
              placeholder="e.g. 23CS108"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
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
          <span>Continue to Preferences</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
