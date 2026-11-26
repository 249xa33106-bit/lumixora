import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck, Mail, KeyRound, ArrowRight, CheckCircle2,
  AlertCircle, RefreshCw, Lock, Sparkles, Building2, ChevronLeft,
  GraduationCap, UserCheck, Shield, Search, Check, ExternalLink,
  CreditCard, Copy, QrCode, CheckCircle, Zap
} from 'lucide-react';
import {
  sendCampusOtp,
  verifyCampusOtp,
  signInWithGoogleCampus,
  saveCampusScholarProfile,
  getStoredCampusProfile,
  resolveCollegeFromEmail,
  POPULAR_CAMPUS_COLLEGES,
  POPULAR_CAMPUS_BRANCHES
} from '../services/campusAuthService';
import {
  recordCampusPayment,
  checkCampusPaymentStatus,
  fetchCampusScholar
} from '../services/campusDbService';
import { initiateRazorpayPayment, fetchRemoteRazorpayKey } from '../services/razorpayService';
import { validateUtrFormat } from '../data/collegesData';
import Realistic3DLogo from './Realistic3DLogo';

export default function CampusPlacementLoginModal({
  isOpen,
  onClose,
  onLoginSuccess
}) {
  // Steps: 'auth' (email/google) | 'otp' (enter code) | 'profile' (college & roll details) | 'payment' (₹10 fee)
  const [step, setStep] = useState('auth');
  const [authMode, setAuthMode] = useState('otp'); // 'otp' | 'google'

  // Input states
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [honeypot, setHoneypot] = useState('');

  // Auto-detected college info from email domain
  const detectedInstitution = useMemo(() => {
    return resolveCollegeFromEmail(email);
  }, [email]);

  // Profile binding states
  const [studentName, setStudentName] = useState('');
  const [collegeSearch, setCollegeSearch] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [isCollegeCustom, setIsCollegeCustom] = useState(false);
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState(POPULAR_CAMPUS_BRANCHES[0]);
  const [customBranch, setCustomBranch] = useState('');
  const [batch, setBatch] = useState('2026');

  // Payment states
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [utrInput, setUtrInput] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showUtrBox, setShowUtrBox] = useState(false);

  // Status & loading
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Filtered colleges for combobox
  const filteredColleges = useMemo(() => {
    if (!collegeSearch) return POPULAR_CAMPUS_COLLEGES.slice(0, 8);
    const q = collegeSearch.toLowerCase().trim();
    return POPULAR_CAMPUS_COLLEGES.filter(c => c.toLowerCase().includes(q));
  }, [collegeSearch]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Reset inputs when opening
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      const cached = getStoredCampusProfile();
      if (cached) {
        setEmail(cached.email || '');
        setStudentName(cached.name || '');
        setCollegeName(cached.college_name || '');
        setRollNumber(cached.roll_number || '');
        setBranch(cached.branch || POPULAR_CAMPUS_BRANCHES[0]);
        setBatch(cached.batch || '2026');
      }
      fetchRemoteRazorpayKey().catch(() => {});
    }
  }, [isOpen]);

  // Apply auto-detected college if available
  useEffect(() => {
    if (detectedInstitution?.college && !collegeName) {
      setCollegeName(detectedInstitution.college);
    }
  }, [detectedInstitution]);

  if (!isOpen) return null;

  // ─── 1. SEND OTP ────────────────────────────────────────────────────────
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid institutional or personal email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendCampusOtp({
        email,
        name: studentName,
        collegeName: detectedInstitution?.college || collegeName,
        honeypot
      });
      setSuccessMsg(res.message);
      setStep('otp');
      setCooldown(60);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch security code. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // ─── 2. VERIFY OTP ──────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const isValid = verifyCampusOtp(email, otpCode);
      if (!isValid) {
        setErrorMsg('Invalid or expired verification code. Please check your inbox or request a new one.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Security verification successful! Complete your institutional profile.');
      setStep('profile');
      if (detectedInstitution?.college) {
        setCollegeName(detectedInstitution.college);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // ─── 3. GOOGLE ONE-CLICK OAUTH ──────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setGoogleLoading(true);
    try {
      const gUser = await signInWithGoogleCampus();
      setEmail(gUser.email);
      setStudentName(gUser.name);
      setAuthMode('google');
      setSuccessMsg('Google identity verified! Complete your academic details.');
      setStep('profile');
      const det = resolveCollegeFromEmail(gUser.email);
      if (det?.college) {
        setCollegeName(det.college);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Google sign-in was cancelled or failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // ─── 4. COMPLETE PROFILE & CHECK PAYMENT ────────────────────────────────
  const handleCompleteProfile = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const finalCollege = (isCollegeCustom ? collegeSearch : collegeName).trim();
    const finalBranch = (branch === 'Other' ? customBranch : branch).trim();
    const finalRoll = rollNumber.trim().toUpperCase();

    if (!studentName.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    if (!finalCollege) {
      setErrorMsg('Please specify or select your College / University name.');
      return;
    }
    if (!finalRoll) {
      setErrorMsg('Please enter your College Roll Number / USN / Hall Ticket No.');
      return;
    }

    setLoading(true);
    try {
      const profile = await saveCampusScholarProfile({
        email,
        name: studentName,
        collegeName: finalCollege,
        rollNumber: finalRoll,
        department: finalBranch,
        branch: finalBranch,
        batch,
        authProvider: authMode
      });

      // Check if this student already paid ₹10
      const isPaid = await checkCampusPaymentStatus(email);
      if (isPaid) {
        setSuccessMsg('Identity & verification verified! Launching portal...');
        setTimeout(() => {
          onLoginSuccess({
            email: profile.email,
            name: profile.name,
            roll_number: profile.roll_number,
            college: profile.college_name,
            college_name: profile.college_name,
            department: profile.department,
            branch: profile.branch,
            batch: profile.batch,
            isCampusScholar: true,
            is_approved: true,
            is_fee_paid: true
          });
          onClose();
        }, 700);
      } else {
        // Proceed to ₹10 verification fee step
        setStep('payment');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save student profile.');
    } finally {
      setLoading(false);
    }
  };

  // ─── 5. RAZORPAY PAYMENT (₹10) ──────────────────────────────────────────
  const handleRazorpayPay = async () => {
    setErrorMsg('');
    setPaymentProcessing(true);
    const finalCollege = (isCollegeCustom ? collegeSearch : collegeName).trim();
    const finalRoll = rollNumber.trim().toUpperCase();

    try {
      const result = await initiateRazorpayPayment({
        amount: 10.00,
        email,
        name: studentName || 'Campus Scholar',
        description: 'Lumixora Campus Academic Placement Suite Unlock'
      });

      if (result && result.razorpay_payment_id) {
        await recordCampusPayment({
          email,
          name: studentName,
          collegeName: finalCollege,
          rollNumber: finalRoll,
          amount: 10.00,
          paymentMethod: 'Razorpay',
          txId: result.razorpay_payment_id,
          status: 'verified'
        });

        setSuccessMsg('Verification payment of ₹10 successful! Launching Lumixora Campus...');
        setTimeout(() => {
          onLoginSuccess({
            email,
            name: studentName,
            roll_number: finalRoll,
            college: finalCollege,
            college_name: finalCollege,
            department: branch,
            branch,
            batch,
            isCampusScholar: true,
            is_approved: true,
            is_fee_paid: true,
            fee_tx_id: result.razorpay_payment_id
          });
          onClose();
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Payment could not be completed. Please retry or use UPI.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // ─── 6. MANUAL UPI UTR SUBMISSION ───────────────────────────────────────
  const handleUtrSubmit = async (e) => {
    e?.preventDefault();
    setErrorMsg('');

    const raw = utrInput.trim();
    if (!raw) {
      setErrorMsg('Please enter your 12-digit UPI UTR or PhonePe Transaction ID.');
      return;
    }

    const validation = validateUtrFormat(raw);
    if (!validation.valid) {
      setErrorMsg(validation.reason || 'Invalid UTR format. Please check your payment receipt.');
      return;
    }

    const cleanUtr = validation.cleanUtr;
    setPaymentProcessing(true);

    try {
      const finalCollege = (isCollegeCustom ? collegeSearch : collegeName).trim();
      const finalRoll = rollNumber.trim().toUpperCase();

      await recordCampusPayment({
        email,
        name: studentName,
        collegeName: finalCollege,
        rollNumber: finalRoll,
        amount: 10.00,
        paymentMethod: 'UPI_UTR',
        txId: `UTR-${cleanUtr}`,
        utr: cleanUtr,
        status: 'verified'
      });

      setSuccessMsg(`UTR ${cleanUtr} verified! Full access unlocked.`);
      setTimeout(() => {
        onLoginSuccess({
          email,
          name: studentName,
          roll_number: finalRoll,
          college: finalCollege,
          college_name: finalCollege,
          department: branch,
          branch,
          batch,
          isCampusScholar: true,
          is_approved: true,
          is_fee_paid: true,
          fee_tx_id: `UTR-${cleanUtr}`
        });
        onClose();
      }, 800);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to verify UTR. Please retry.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleCopyUpi = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('lumixora.team@gmail.com');
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#020709] border border-amber-500/35 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden text-slate-100"
        style={{ fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif' }}
      >
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="relative p-5 pb-3 border-b border-amber-500/20 bg-gradient-to-r from-[#031510] via-[#060D12] to-[#120B03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Realistic3DLogo size="sm" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight text-white font-sora">
                    LUMIXORA <span className="text-emerald-400">CAMPUS</span>
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    High-Security
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Universal Academic & Placement Gateway
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/60 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* 4-Step Visual Progress Breadcrumb */}
          <div className="mt-4 grid grid-cols-4 gap-1.5 text-center text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
            <div className={`py-1 rounded-md border transition ${
              step === 'auth' 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}>
              1. Security Check
            </div>
            <div className={`py-1 rounded-md border transition ${
              step === 'otp' 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}>
              2. Verify Code
            </div>
            <div className={`py-1 rounded-md border transition ${
              step === 'profile' 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}>
              3. College ID
            </div>
            <div className={`py-1 rounded-md border transition ${
              step === 'payment' 
                ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 font-black' 
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}>
              4. Fee (₹10)
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Honeypot field (anti-bot trap) */}
          <input
            type="text"
            name="hp_field"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ── STEP 1: AUTH METHOD SELECTION ── */}
          {step === 'auth' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-white">
                  Select Your Verification Method
                </h4>
                <p className="text-xs text-slate-400">
                  Sign in with your academic, institutional, or personal email
                </p>
              </div>

              {/* Google Fast-Track Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center gap-3 transition shadow-lg shadow-white/5 active:scale-[0.98] border border-slate-200"
              >
                {googleLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-700" />
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-[#070B19] px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  or use 6-digit email code
                </span>
                <div className="border-t border-slate-800 w-full" />
              </div>

              {/* Email Form */}
              <form onSubmit={handleRequestOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Institutional or Personal Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. scholar@vit.ac.in or student@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-emerald-500 text-sm text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                  {detectedInstitution?.college && (
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>Detected: {detectedInstitution.college}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/25 active:scale-[0.98]"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send 6-Digit Security Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ── STEP 2: OTP VERIFICATION ── */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-white">
                  Enter 6-Digit Code
                </h4>
                <p className="text-xs text-slate-400">
                  Security code dispatched to <strong className="text-emerald-400">{email}</strong>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center py-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-xl font-mono tracking-[0.5em] text-emerald-300 outline-none focus:border-emerald-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/25 active:scale-[0.98]"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Verify Code & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('auth')}
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back to email
                </button>
                <button
                  type="button"
                  disabled={cooldown > 0}
                  onClick={handleRequestOtp}
                  className="text-emerald-400 hover:underline disabled:text-slate-600 disabled:no-underline font-medium"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3: INSTITUTIONAL IDENTITY BINDING ── */}
          {step === 'profile' && (
            <form onSubmit={handleCompleteProfile} className="space-y-3.5">
              <div className="pb-1 border-b border-slate-800">
                <p className="text-sm font-semibold text-slate-200">
                  Academic Identity Binding
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your credentials will be bound to your verified Lumixora Campus profile
                </p>
              </div>

              {/* Full Legal Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Student Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sravani K"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-emerald-500 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>

              {/* Searchable College Combobox */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    College / University
                  </label>
                  {collegeName && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Selected
                    </span>
                  )}
                </div>

                {/* Selected College Card or Search Input */}
                {collegeName ? (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-bold text-white truncate">{collegeName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCollegeName('');
                        setCollegeSearch('');
                      }}
                      className="text-[11px] text-slate-400 hover:text-rose-400 px-2 py-0.5 rounded hover:bg-slate-800 shrink-0 transition"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search college (e.g. VIT, CBIT, JNTUA, RGMCET, SRIT)..."
                        value={collegeSearch}
                        onChange={(e) => {
                          setCollegeSearch(e.target.value);
                          setIsCollegeCustom(false);
                        }}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-emerald-500 text-xs text-white placeholder-slate-500 outline-none transition"
                      />
                    </div>

                    {/* Suggestions Dropdown */}
                    <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/90 divide-y divide-slate-800/60 no-scrollbar">
                      {filteredColleges.map((col) => (
                        <div
                          key={col}
                          onClick={() => {
                            setCollegeName(col);
                            setIsCollegeCustom(false);
                          }}
                          className="p-2 hover:bg-emerald-500/10 text-xs text-slate-300 hover:text-white cursor-pointer transition flex items-center justify-between"
                        >
                          <span className="truncate">{col}</span>
                          <span className="text-[10px] text-emerald-400 opacity-60">Select</span>
                        </div>
                      ))}
                      <div
                        onClick={() => {
                          if (collegeSearch.trim()) {
                            setCollegeName(collegeSearch.trim());
                            setIsCollegeCustom(true);
                          }
                        }}
                        className="p-2 bg-slate-900/80 hover:bg-slate-800 text-[11px] text-cyan-400 cursor-pointer font-semibold flex items-center gap-1.5"
                      >
                        <span>➕ Use custom name: "{collegeSearch || 'Enter name'}"</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Roll Number / USN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    College Roll No / USN
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 22BCE1045"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-emerald-500 text-xs font-mono uppercase text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Passing Year / Cohort
                  </label>
                  <select
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 text-xs text-white outline-none transition"
                  >
                    <option value="2025">Class of 2025</option>
                    <option value="2026">Class of 2026</option>
                    <option value="2027">Class of 2027</option>
                    <option value="2028">Class of 2028</option>
                    <option value="2029">Class of 2029</option>
                  </select>
                </div>
              </div>

              {/* Branch / Department */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department / Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 text-xs text-white outline-none transition"
                >
                  {POPULAR_CAMPUS_BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                  <option value="Other">Other Branch</option>
                </select>
                {branch === 'Other' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter branch name"
                    value={customBranch}
                    onChange={(e) => setCustomBranch(e.target.value)}
                    className="w-full mt-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-emerald-500 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/25 active:scale-[0.98] mt-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Proceed to Access Verification (₹10)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── STEP 4: VERIFICATION FEE (₹10) ── */}
          {step === 'payment' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Fee Header Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#061614] via-slate-900 to-[#120B03] border border-amber-500/35 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Lifetime Scholar Access
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">
                      Academic Verification Fee
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-amber-300">₹10</div>
                    <span className="text-[10px] text-slate-400">One-Time Fee</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>100+ Previous Company Exam Question Papers (TCS, Infosys, Accenture, Zoho)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>AI Mock Interview Simulator with grading & feedback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>National TechPulse Off-Campus Hiring Radar & 1-Click Dossier</span>
                  </div>
                </div>
              </div>

              {/* Scholar summary pill */}
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span className="truncate"><strong>{studentName}</strong> • {rollNumber}</span>
                <span className="text-amber-400 font-semibold truncate max-w-[150px]">{collegeName}</span>
              </div>

              {/* Razorpay Online Instant Payment Button */}
              <button
                type="button"
                onClick={handleRazorpayPay}
                disabled={paymentProcessing}
                className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 hover:from-emerald-400 hover:to-amber-200 text-slate-950 flex items-center justify-center gap-2 transition shadow-xl shadow-amber-500/15 active:scale-[0.98] border border-amber-400/40"
              >
                {paymentProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-slate-950" />
                    <span>Pay ₹10 via UPI / Cards / NetBanking</span>
                  </>
                )}
              </button>

              {/* Divider for Manual UPI / PhonePe / GPay */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setShowUtrBox(!showUtrBox)}
                  className="text-xs text-amber-300/90 hover:text-amber-200 underline font-medium transition"
                >
                  {showUtrBox ? '▲ Hide Direct UPI Options' : '▼ Already Paid or Pay via Direct UPI (PhonePe / GPay)?'}
                </button>
              </div>

              {/* Collapsible Direct UPI Section */}
              {showUtrBox && (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/25 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Direct UPI ID:</span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="flex items-center gap-1 text-amber-300 hover:underline font-mono font-bold"
                    >
                      <span>lumixora.team@gmail.com</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  {copiedUpi && (
                    <p className="text-[10px] text-amber-400 text-right">UPI ID copied to clipboard!</p>
                  )}

                  <div className="flex gap-2">
                    <a
                      href="upi://pay?pa=lumixora.team@gmail.com&pn=Lumixora%20Campus&am=10.00&cu=INR&tn=Campus%20Verification"
                      className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-center text-xs font-bold text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 transition"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Open UPI App (₹10)</span>
                    </a>
                  </div>

                  <form onSubmit={handleUtrSubmit} className="space-y-2 pt-1 border-t border-slate-800">
                    <label className="block text-[11px] font-semibold text-slate-300">
                      Enter 12-Digit UTR or PhonePe Transaction ID:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 402819284719 or T240118..."
                      value={utrInput}
                      onChange={(e) => setUtrInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-amber-400 text-xs font-mono text-white placeholder-slate-600 outline-none transition"
                    />
                    <button
                      type="submit"
                      disabled={paymentProcessing}
                      className="w-full py-2.5 rounded-lg font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center justify-center gap-1.5 transition"
                    >
                      {paymentProcessing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify UTR & Unlock Access</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('profile')}
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Edit Profile
                </button>
                <span className="text-[10px]">🔒 256-Bit SSL Encrypted</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 text-center text-[11px] text-slate-500 flex items-center justify-between px-5">
          <span>End-to-End Encrypted Session</span>
          <span className="text-emerald-400/80 font-medium">All Higher Education Scholars Welcome</span>
        </div>
      </div>
    </div>
  );
}
