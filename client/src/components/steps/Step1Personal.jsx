import React, { useRef } from 'react';
import { Camera, Upload, Trash2, RefreshCw, AlertCircle, CheckCircle2, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useApplication } from '../../context/ApplicationContext';

export default function Step1Personal() {
  const {
    formData,
    files,
    errors,
    updatePersonal,
    handlePhotoSelect,
    removePhoto,
    nextStep
  } = useApplication();

  const fileInputRef = useRef(null);

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoSelect(file);
    }
  };

  const copyMobileToWhatsapp = () => {
    if (formData.personal.mobileNumber) {
      updatePersonal('whatsappNumber', formData.personal.mobileNumber);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Personal Information & Profile Photo</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Please provide your legal contact details and an official profile photo for identity verification.
        </p>
      </div>

      {/* Profile Photo Section (Mandatory Requirement) */}
      <div className="bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Preview Box */}
          <div className="relative group shrink-0">
            <div className={`w-36 h-36 rounded-2xl overflow-hidden border-2 flex items-center justify-center transition-all bg-white shadow-sm ${
              errors.photo
                ? 'border-rose-400 ring-4 ring-rose-50'
                : files.photoPreviewUrl
                ? 'border-indigo-500 ring-4 ring-indigo-50'
                : 'border-dashed border-slate-300'
            }`}>
              {files.photoPreviewUrl ? (
                <img
                  src={files.photoPreviewUrl}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    No photo selected
                  </span>
                </div>
              )}
            </div>

            {files.photoPreviewUrl && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
          </div>

          {/* Photo Upload Controls */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h3 className="text-base font-semibold text-slate-900">
                  Applicant Profile Photo <span className="text-rose-500 font-bold">*</span>
                </h3>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                  Mandatory
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Upload a clear front-facing portrait. Accepted formats: <strong>JPG, JPEG, PNG, WEBP</strong>. Max size: <strong>5 MB</strong>.
              </p>
            </div>

            {errors.photo && (
              <div className="inline-flex items-center space-x-1.5 text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.photo}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={onFileInputChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
              >
                {files.photo ? <RefreshCw className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                <span>{files.photo ? 'Change Photo' : 'Upload Profile Photo'}</span>
              </button>

              {files.photo && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {files.photo && (
              <p className="text-[11px] text-slate-500">
                Selected: <strong className="text-slate-700">{files.photo.name}</strong> ({(files.photo.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Personal Contact Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Full Legal Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.personal.fullName}
              onChange={(e) => updatePersonal('fullName', e.target.value)}
              placeholder="e.g. Vikramaditya Roy"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.fullName && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.fullName}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Date of Birth <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              value={formData.personal.dob}
              onChange={(e) => updatePersonal('dob', e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all bg-white text-slate-900 focus:outline-none focus:ring-2 ${
                errors.dob
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.dob && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.dob}</p>}
        </div>

        {/* Gender (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Gender <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <select
            value={formData.personal.gender}
            onChange={(e) => updatePersonal('gender', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={formData.personal.email}
              onChange={(e) => updatePersonal('email', e.target.value)}
              placeholder="applicant@university.edu"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Application confirmation & updates will be dispatched here.</p>
          {errors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Mobile Number with Country Code <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              value={formData.personal.mobileNumber}
              onChange={(e) => updatePersonal('mobileNumber', e.target.value)}
              placeholder="+91 98765 43210"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.mobileNumber
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.mobileNumber && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.mobileNumber}</p>}
        </div>

        {/* WhatsApp Number (Optional) */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              WhatsApp Number <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <button
              type="button"
              onClick={copyMobileToWhatsapp}
              className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
            >
              Same as Mobile Number
            </button>
          </div>
          <input
            type="tel"
            value={formData.personal.whatsappNumber}
            onChange={(e) => updatePersonal('whatsappNumber', e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Current City */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Current City <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.personal.city}
              onChange={(e) => updatePersonal('city', e.target.value)}
              placeholder="e.g. Bengaluru"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.city
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.city && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.city}</p>}
        </div>

        {/* State */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            State / Province <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.personal.state}
            onChange={(e) => updatePersonal('state', e.target.value)}
            placeholder="e.g. Karnataka"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
              errors.state
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.state && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.state}</p>}
        </div>

        {/* Country */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Country <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.personal.country}
            onChange={(e) => updatePersonal('country', e.target.value)}
            placeholder="India"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Next Step Action Button */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={nextStep}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all cursor-pointer"
        >
          <span>Continue to Education</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
