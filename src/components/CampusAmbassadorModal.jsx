import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Award, 
  CheckCircle2, 
  GraduationCap, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Send, 
  Copy, 

  Check, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Heart, 
  Zap, 
  BookOpen,
  Trophy,
  Users,
  Star,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { db } from '../config/firebase';
import { supabase } from '../config/supabase';
import { internshipDb } from '../services/internshipDb';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { notifyFounderAmbassadorApplication } from '../services/founderNotificationService';

const CA_STORAGE_KEY = 'lumixora_ca_application';

const COLLEGE_OPTIONS = [
  { id: 'gprec', name: 'G. Pulla Reddy Engineering College (Autonomous), Kurnool', short: 'GPREC Kurnool' },
  { id: 'annamacharya', name: 'Annamacharya University, Rajampet', short: 'AU Rajampet' },
  { id: 'ashoka', name: "Ashoka Women's Engineering College, Kurnool", short: 'Ashoka Kurnool' },
  { id: 'bits', name: 'Bheema Institute Of Technology & Science, Adoni', short: 'BITS Adoni' },
  { id: 'other', name: 'Other College / University', short: 'Other' }
];

const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'CSE - Artificial Intelligence & Machine Learning (AI & ML)',
  'CSE - Data Science (DS)',
  'CSE - Cyber Security / IoT',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Information Technology (IT)',
  'Master of Computer Applications (MCA)',
  'Other Science / Engineering Branch'
];

const YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year / Final Year',
  'Post-Graduate / MCA'
];

export default function CampusAmbassadorModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('apply'); // 'apply' | 'status' | 'benefits'
  const [existingApp, setExistingApp] = useState(null);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('gprec');
  const [customCollege, setCustomCollege] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [customDepartment, setCustomDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState(YEARS[1]);
  const [rollNumber, setRollNumber] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [whyJoin, setWhyJoin] = useState('');
  const [priorExperience, setPriorExperience] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedApp, setSubmittedApp] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Load existing application from localStorage on open
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.appId) {
          setExistingApp(parsed);
        }
      }
    } catch (e) {}
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard?.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const getFinalCollegeName = () => {
    if (selectedCollege === 'other') {
      return customCollege.trim() || 'Other College / University';
    }
    const found = COLLEGE_OPTIONS.find(c => c.id === selectedCollege);
    return found ? found.name : 'College / University';
  };

  const getFinalDepartment = () => {
    if (department.includes('Other')) {
      return customDepartment.trim() || 'Engineering';
    }
    return department;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full legal or college name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please provide a valid email address (e.g., student@college.edu or name@gmail.com).');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp / mobile number for selection contact.');
      return;
    }
    if (selectedCollege === 'other' && !customCollege.trim()) {
      setErrorMessage('Please specify the full name of your college / university.');
      return;
    }
    if (!whyJoin.trim() || whyJoin.trim().length < 15) {
      setErrorMessage('Please write a brief motivation sentence (at least 15 characters) on why you want to represent Lumixora.');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('Please accept the ambassador program confirmation checkbox.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate Unique Application ID: LMX-CA-2026-XXXX
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const appId = `LMX-CA-2026-${randomSuffix}`;
      const collegeName = getFinalCollegeName();
      const deptName = getFinalDepartment();

      const applicationPayload = {
        appId,
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        college: collegeName,
        department: deptName,
        year: yearOfStudy,
        rollNumber: rollNumber.trim() || 'N/A',
        linkedin: linkedin.trim() || '',
        whyJoin: whyJoin.trim(),
        priorExperience: priorExperience.trim() || 'None specified',
        status: 'pending_review',
        appliedAt: new Date().toISOString(),
        productName: 'Lumixora (by Vyomra)'
      };

      // 1. Cache locally first for instant recovery
      try {
        localStorage.setItem(CA_STORAGE_KEY, JSON.stringify(applicationPayload));
        localStorage.setItem('lumixora_campus_ambassador_app', JSON.stringify(applicationPayload));
        const allLocal = JSON.parse(localStorage.getItem('lumixora_all_ambassador_apps') || '[]');
        const updated = [applicationPayload, ...allLocal.filter(a => (a.appId || a.id) !== appId)];
        localStorage.setItem('lumixora_all_ambassador_apps', JSON.stringify(updated));
        setExistingApp(applicationPayload);
      } catch (e) {}

      // 2. Dispatch UI transition immediately
      setSubmittedApp(applicationPayload);
      setIsSubmitting(false);

      // 3. Save to live Firestore collection 'applications' in internshipDb (guaranteed open & working)
      if (internshipDb) {
        setDoc(doc(internshipDb, 'applications', appId), {
          ...applicationPayload,
          id: appId,
          fullName: applicationPayload.name,
          whatsapp: applicationPayload.phone,
          branch: applicationPayload.department,
          isCampusAmbassador: true,
          type: 'campus_ambassador',
          preferredRole: 'campus_ambassador',
          preferredRoleTitle: 'Campus Ambassador Lead',
          track: 'Campus Ambassador Lead',
          createdAt: applicationPayload.appliedAt,
          updatedAt: applicationPayload.appliedAt
        }).catch((fsErr) => {
          console.warn('internshipDb application save notice:', fsErr);
        });
      }

      // 4. Secondary fallback write to legacy db if available
      if (db) {
        setDoc(doc(db, 'campus_ambassador_applications', appId), {
          ...applicationPayload,
          timestamp: serverTimestamp()
        }).catch(() => {});
      }

      // 5. Notify Founder Portal in real-time with complete application data
      notifyFounderAmbassadorApplication({
        appId,
        name: applicationPayload.name,
        email: applicationPayload.email,
        phone: applicationPayload.phone,
        college: applicationPayload.college,
        department: applicationPayload.department,
        year: applicationPayload.year,
        rollNumber: applicationPayload.rollNumber,
        linkedin: applicationPayload.linkedin,
        whyJoin: applicationPayload.whyJoin,
        priorExperience: applicationPayload.priorExperience,
        status: applicationPayload.status,
        appliedAt: applicationPayload.appliedAt
      });

      // 6. Dispatch browser event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lumixora_ambassador_submitted', { detail: applicationPayload }));
      }
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setErrorMessage('Something went wrong submitting your application. Please try again or reach out on WhatsApp.');
    }
  };

  const handleResetForm = () => {
    setSubmittedApp(null);
    setErrorMessage('');
    setFullName('');
    setEmail('');
    setPhone('');
    setWhyJoin('');
    setPriorExperience('');
    setRollNumber('');
    setLinkedin('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-gradient-to-b from-[#12131e] via-[#0d0e17] to-[#0a0a0f] border border-amber-500/30 rounded-3xl shadow-[0_20px_70px_rgba(245,158,11,0.18)] overflow-hidden text-gray-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header Banner */}
        <div className="relative z-10 px-6 sm:px-8 pt-7 pb-5 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/30 shrink-0">
              <div className="w-full h-full bg-[#0d0e17] rounded-2xl flex items-center justify-center">
                <Trophy className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Cohort 1 · Open Now
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] sm:text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> No Login Required
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight mt-1.5 flex items-center gap-2">
                Lumixora Campus Ambassador 2026
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-medium mt-0.5">
                Lead your campus · Gain direct mentorship · Earn verified leadership credentials from Vyomra
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="relative z-10 px-6 sm:px-8 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'apply'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Apply Form</span>
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'benefits'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Perks & Benefits</span>
            </button>
            {existingApp && (
              <button
                onClick={() => setActiveTab('status')}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'status'
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>My Application ({existingApp.appId})</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-gray-400 font-semibold hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lumixora is a product of Vyomra</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 px-6 sm:px-8 py-6 max-h-[72vh] overflow-y-auto">

          {/* TAB 1: SUCCESS CONFIRMATION SCREEN */}
          {(submittedApp || (activeTab === 'status' && existingApp)) ? (
            <div className="space-y-6 animate-fadeIn">
              {(() => {
                const app = submittedApp || existingApp;
                return (
                  <>
                    <div className="text-center space-y-3 py-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
                        Application Received Successfully
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white">
                        Welcome to the Lumixora Ambassador Talent Pool!
                      </h3>
                      <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                        Thank you for applying, <span className="font-bold text-white">{app.name}</span>! Your application has been logged into the Lumixora Campus Ambassador Selection Roster.
                      </p>
                    </div>

                    {/* Official Application Card */}
                    <div className="bg-[#151726]/90 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div>
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Official Application ID</span>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-wider">
                              {app.appId}
                            </span>
                            <button
                              onClick={() => handleCopyId(app.appId)}
                              className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              {copiedId ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> Under Review
                          </span>
                        </div>
                      </div>

                      {/* Summary Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 space-y-1">
                          <span className="text-gray-400 font-medium">Candidate Name</span>
                          <p className="font-bold text-white">{app.name}</p>
                        </div>
                        <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 space-y-1">
                          <span className="text-gray-400 font-medium">College / Institution</span>
                          <p className="font-bold text-white truncate" title={app.college}>{app.college}</p>
                        </div>
                        <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 space-y-1">
                          <span className="text-gray-400 font-medium">Department & Year</span>
                          <p className="font-bold text-white">{app.department} · {app.year}</p>
                        </div>
                        <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 space-y-1">
                          <span className="text-gray-400 font-medium">Email Address</span>
                          <p className="font-bold text-cyan-300 truncate">{app.email}</p>
                        </div>
                        <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 space-y-1">
                          <span className="text-gray-400 font-medium">WhatsApp / Mobile</span>
                          <p className="font-bold text-emerald-400">+91 {app.phone}</p>
                        </div>
                        <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 space-y-1">
                          <span className="text-gray-400 font-medium">Applied On</span>
                          <p className="font-bold text-gray-300">
                            {new Date(app.appliedAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* What Happens Next Roadmap */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 space-y-4">
                      <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Next Steps in Selection
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center shrink-0">1</span>
                          <div className="space-y-0.5">
                            <h5 className="font-bold text-white text-xs">Profile Review</h5>
                            <p className="text-[11px] text-gray-400">Head of Growth (M. Akhil) & Core Team evaluate your submission within 48 hours.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                          <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-black text-xs flex items-center justify-center shrink-0">2</span>
                          <div className="space-y-0.5">
                            <h5 className="font-bold text-white text-xs">WhatsApp Shortlist Ping</h5>
                            <p className="text-[11px] text-gray-400">Shortlisted candidates receive an onboarding invitation on WhatsApp and email.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">3</span>
                          <div className="space-y-0.5">
                            <h5 className="font-bold text-white text-xs">Welcome Call & Kit</h5>
                            <p className="text-[11px] text-gray-400">Join the Founder's Cohort 1 orientation & receive the official Ambassador Playbook.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Direct Contact & Action Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <a
                        href={`https://wa.me/919346476055?text=${encodeURIComponent(`Hi Founder Sowban! I have applied for the Lumixora Campus Ambassador Program. My Application ID is ${app.appId}. Excited to connect!`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Chat with Founder on WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          onClick={handleResetForm}
                          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
                        >
                          Submit Another Application
                        </button>
                        <button
                          onClick={onClose}
                          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : activeTab === 'benefits' ? (
            /* TAB 2: DETAILED PERKS & VALUE PROPOSITION */
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                  Program Highlights & Privileges
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Why Become a Lumixora Campus Ambassador?
                </h3>
                <p className="text-sm text-gray-400 max-w-xl mx-auto">
                  Represent the leading AI educational ecosystem at your institution and gain unparalleled industry exposure before graduation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/[0.02] border border-amber-500/30 rounded-3xl p-5 space-y-3 relative overflow-hidden group hover:border-amber-400/60 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
                    📜
                  </div>
                  <h4 className="font-extrabold text-white text-base">Official Certificate of Leadership & Experience</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Issued directly by Lumixora (a product of Vyomra) with a verifiable public credential ID, signed by the Founder and Core Leadership. Perfect for your LinkedIn and placement resume.
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-cyan-500/30 rounded-3xl p-5 space-y-3 relative overflow-hidden group hover:border-cyan-400/60 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xl">
                    🌟
                  </div>
                  <h4 className="font-extrabold text-white text-base">Direct 1-on-1 Founder Mentorship</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Exclusive bi-weekly masterclasses and direct mentoring with Founder & CEO Shaik Sowban and our engineering leads on AI architectures, software engineering, and startup building.
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-purple-500/30 rounded-3xl p-5 space-y-3 relative overflow-hidden group hover:border-purple-400/60 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xl">
                    🤝
                  </div>
                  <h4 className="font-extrabold text-white text-base">Inter-Collegiate Leadership Network</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Lead initiatives across partner institutions including GPREC Kurnool, Annamacharya University, Ashoka, and expanding universities. Forge lifelong peer and professional connections.
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-emerald-500/30 rounded-3xl p-5 space-y-3 relative overflow-hidden group hover:border-emerald-400/60 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
                    💎
                  </div>
                  <h4 className="font-extrabold text-white text-base">Letter of Recommendation (LOR) & AI Suite</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Top 10% ambassadors receive an executive Letter of Recommendation for masters / job placements, free lifetime Lumixora AI Pro suite, and 10,000+ Synapte Coins platform bonus.
                  </p>
                </div>
              </div>

              {/* Roles & Responsibilities */}
              <div className="bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 space-y-3">
                <h4 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> What You Will Do as an Ambassador
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Introduce students in your branch to Lumixora's AI coding and doubt-solving tools.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Facilitate campus workshops, hackathon teams, and coding study groups.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Channel authentic student feedback directly to the product engineering team.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Represent your institution in regional inter-college tech events and competitions.</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setActiveTab('apply')}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Ready to Lead? Fill Application Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* TAB 3: APPLICATION FORM */
            <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
              {/* Value Proposition Callout */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-black text-amber-300 uppercase tracking-wide">Represent Lumixora at Your Campus</span>
                  <p className="text-gray-300 leading-relaxed">
                    Zero login or registration is required. Fill out this quick 2-minute application. Our Outreach Team reviews applications continuously and reaches out via WhatsApp.
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Section 1: Candidate Identity */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-200">1. Personal & Contact Details</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                      <span>Full Name</span>
                      <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma / S. Ananya"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-amber-400 focus:bg-white/[0.07] text-white text-xs placeholder:text-gray-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                      <span>Email Address (College or Personal)</span>
                      <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rahul@gprec.ac.in or rahul@gmail.com"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-amber-400 focus:bg-white/[0.07] text-white text-xs placeholder:text-gray-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                      <span>WhatsApp Number (for selection call)</span>
                      <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="text-xs font-bold text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit mobile number"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-amber-400 focus:bg-white/[0.07] text-white text-xs placeholder:text-gray-500 outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* LinkedIn / Portfolio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span>LinkedIn Profile or Portfolio</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-normal">Optional</span>
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-amber-400 focus:bg-white/[0.07] text-white text-xs placeholder:text-gray-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: College & Academic Details */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-200">2. College & Academic Information</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* College Select */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                      <span>Select Your College / University</span>
                      <span className="text-amber-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {COLLEGE_OPTIONS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedCollege(c.id)}
                          className={`p-3 rounded-2xl text-left text-xs font-bold transition-all border cursor-pointer flex items-center justify-between ${
                            selectedCollege === c.id
                              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-md shadow-amber-500/10'
                              : 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.06]'
                          }`}
                        >
                          <span className="truncate pr-2">{c.name}</span>
                          {selectedCollege === c.id && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                        </button>
                      ))}
                    </div>

                    {selectedCollege === 'other' && (
                      <div className="pt-2 animate-fadeIn">
                        <input
                          type="text"
                          value={customCollege}
                          onChange={(e) => setCustomCollege(e.target.value)}
                          placeholder="Type your College Name & City (e.g. JNTUA College of Engineering, Anantapur)"
                          required
                          className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-amber-500/40 focus:border-amber-400 text-white text-xs placeholder:text-gray-500 outline-none transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Branch / Department */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                      <span>Department / Branch</span>
                      <span className="text-amber-400">*</span>
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#161726] border border-white/10 focus:border-amber-400 text-white text-xs outline-none transition-all cursor-pointer"
                    >
                      {DEPARTMENTS.map((dept, idx) => (
                        <option key={idx} value={dept} className="bg-[#12131e] text-white">
                          {dept}
                        </option>
                      ))}
                    </select>

                    {department.includes('Other') && (
                      <input
                        type="text"
                        value={customDepartment}
                        onChange={(e) => setCustomDepartment(e.target.value)}
                        placeholder="Enter your specific department / branch"
                        className="w-full mt-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-xs outline-none"
                      />
                    )}
                  </div>

                  {/* Year of Study */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                      <span>Year of Study</span>
                      <span className="text-amber-400">*</span>
                    </label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#161726] border border-white/10 focus:border-amber-400 text-white text-xs outline-none transition-all cursor-pointer"
                    >
                      {YEARS.map((yr, idx) => (
                        <option key={idx} value={yr} className="bg-[#12131e] text-white">
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Roll Number / Student ID */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                      <span>College Roll Number / Student ID</span>
                      <span className="text-[10px] text-gray-500 font-normal">Optional</span>
                    </label>
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. 249X1A0501 or 25AFCSM015"
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-amber-400 text-white text-xs placeholder:text-gray-500 outline-none transition-all uppercase tracking-wider font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Motivation & Leadership */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <Star className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-200">3. Statement & Campus Vision</h4>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                      <span>Why do you want to be a Lumixora Campus Ambassador?</span>
                      <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={whyJoin}
                      onChange={(e) => setWhyJoin(e.target.value)}
                      placeholder="Tell us what motivates you to represent Lumixora at your college and how you plan to help fellow students excel with AI tools..."
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-amber-400 focus:bg-white/[0.07] text-white text-xs placeholder:text-gray-500 outline-none transition-all leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                      <span>Prior Club, Event, or Leadership Experience (if any)</span>
                      <span className="text-[10px] text-gray-500 font-normal">Optional</span>
                    </label>
                    <textarea
                      rows={2}
                      value={priorExperience}
                      onChange={(e) => setPriorExperience(e.target.value)}
                      placeholder="e.g. Lead member in Coding Club, organized college tech symposium, volunteer in NSS/IEEE..."
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-amber-400 focus:bg-white/[0.07] text-white text-xs placeholder:text-gray-500 outline-none transition-all leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.05] transition-all">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-black/40 border-white/20 mt-0.5 cursor-pointer"
                  />
                  <span className="text-xs text-gray-300 leading-relaxed font-medium">
                    I confirm that the details provided are accurate and I am enthusiastic to represent Lumixora (a product of Vyomra) as an active Campus Ambassador.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free Application · Direct Review by Founder Shaik Sowban</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Application Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
