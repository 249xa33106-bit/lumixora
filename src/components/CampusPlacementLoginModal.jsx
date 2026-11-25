import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Mail, KeyRound, ArrowRight, CheckCircle2,
  AlertCircle, RefreshCw, Lock, Sparkles, Building2, ChevronLeft,
  GraduationCap, UserCheck, Shield, ExternalLink
} from 'lucide-react';
import {
  sendCampusOtp,
  verifyCampusOtp,
  signInWithGoogleCampus,
  saveCampusScholarProfile,
  getStoredCampusProfile,
  POPULAR_CAMPUS_COLLEGES,
  POPULAR_CAMPUS_BRANCHES
} from '../services/campusAuthService';

export default function CampusPlacementLoginModal({
  isOpen,
  onClose,
  onLoginSuccess
}) {
  // Steps: 'auth' (email/google) | 'otp' (enter code) | 'profile' (college & roll details)
  const [step, setStep] = useState('auth');
  const [authMode, setAuthMode] = useState('otp'); // 'otp' | 'google'

  // Input states
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [honeypot, setHoneypot] = useState('');

  // Profile binding states
  const [studentName, setStudentName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [customCollege, setCustomCollege] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState(POPULAR_CAMPUS_BRANCHES[0]);
  const [customBranch, setCustomBranch] = useState('');
  const [batch, setBatch] = useState('2026');

  // Status & loading
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);

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
    }
  }, [isOpen]);

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
        collegeName,
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
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Google sign-in was cancelled or failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // ─── 4. COMPLETE PROFILE & LAUNCH ───────────────────────────────────────
  const handleCompleteProfile = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const finalCollege = (collegeName === 'Other' ? customCollege : collegeName).trim();
    const finalBranch = (branch === 'Other' ? customBranch : branch).trim();
    const finalRoll = rollNumber.trim().toUpperCase();

    if (!studentName.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    if (!finalCollege) {
      setErrorMsg('Please specify your College or University name.');
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

      setSuccessMsg('Identity verified and bound to Lumixora Campus! Launching...');
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
          is_approved: true
        });
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save student profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#070B19] border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-950/50 overflow-hidden text-slate-100"
        style={{ fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif' }}
      >
        {/* Subtle Cyber Grid & Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="relative p-6 pb-4 border-b border-emerald-500/15 bg-gradient-to-r from-emerald-950/30 via-slate-900/40 to-cyan-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/40">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight text-white">
                    LUMIXORA <span className="text-emerald-400">CAMPUS</span>
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
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

          {/* Security Safeguards Banner */}
          <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
              <Shield className="w-3.5 h-3.5" /> 256-Bit SSL
            </span>
            <span className="flex items-center gap-1 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> All Colleges Allowed
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Anti-Bot Shield
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Honeypot field (hidden from real users, traps bots) */}
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

          {/* ── STEP 1: AUTHENTICATION (EMAIL OR GOOGLE) ── */}
          {step === 'auth' && (
            <div className="space-y-4">
              <div className="text-center pb-1">
                <p className="text-sm font-semibold text-slate-200">
                  Select Your Verification Method
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sign in with your academic, institutional, or personal email
                </p>
              </div>

              {/* Google 1-Click Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center gap-3 transition shadow-md shadow-white/5 active:scale-[0.98]"
              >
                {googleLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-700" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-[#070B19] px-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Or use 6-Digit Email Code
                </span>
                <div className="border-t border-slate-800 w-full" />
              </div>

              {/* Email Form */}
              <form onSubmit={handleRequestOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Institutional or Personal Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@college.edu or scholar@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 transition outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
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

          {/* ── STEP 2: VERIFY OTP CODE ── */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center pb-1">
                <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
                  <KeyRound className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Enter 6-Digit Code
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dispatched to <span className="text-emerald-400 font-semibold">{email}</span>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full text-center text-2xl font-black tracking-[0.5em] py-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-emerald-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
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
                  Institutional Identity Verification
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bind your verified academic credentials to access the Placement Suite
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
                  placeholder="e.g. Ananya Reddy"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-emerald-500 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>

              {/* College / University Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  College / University
                </label>
                <select
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 text-xs text-white outline-none transition"
                >
                  <option value="">-- Select Your College or University --</option>
                  {POPULAR_CAMPUS_COLLEGES.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                  <option value="Other">Other (Type Custom Name Below)</option>
                </select>
                {collegeName === 'Other' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter complete college name & city"
                    value={customCollege}
                    onChange={(e) => setCustomCollege(e.target.value)}
                    className="w-full mt-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-emerald-500 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
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
                    <span>Complete Verification & Launch Portal</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 text-center text-[11px] text-slate-500">
          Universal higher education access powered by Lumixora Campus • Zero-Trust Cloud Architecture
        </div>
      </div>
    </div>
  );
}
