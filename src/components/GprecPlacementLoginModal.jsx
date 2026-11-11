import React, { useState } from 'react';
import Realistic3DLogo from './Realistic3DLogo';
import { 
  ShieldCheck, Mail, KeyRound, ArrowRight, CheckCircle2, 
  AlertCircle, RefreshCw, Lock, Sparkles, Building2, ChevronLeft, Eye, EyeOff
} from 'lucide-react';
import { 
  isAllowedGprecRoll, 
  normalizeRollNumber, 
  getGprecEmailFromRoll, 
  sendGprecPlacementOtp, 
  verifyGprecPlacementOtp,
  PLACEMENT_SUPPORT_EMAIL
} from '../services/gprecPlacementAuth';
import { 
  authenticatePlacementOfficer, 
  sendOfficerPasswordResetCode, 
  verifyAndResetOfficerPassword,
  GPREC_OFFICER_CONFIG 
} from '../services/gprecOfficerAuth';

export default function GprecPlacementLoginModal({ isOpen, onClose, onLoginSuccess }) {
  // Tabs: 'student' | 'officer'
  const [authRole, setAuthRole] = useState('student');

  // Scholar State
  const [scholarStep, setScholarStep] = useState('roll'); // 'roll' | 'otp'
  const [rollNumber, setRollNumber] = useState('');
  const [otp, setOtp] = useState('');

  // Officer / Dean State
  const [officerEmail, setOfficerEmail] = useState(GPREC_OFFICER_CONFIG.deanEmail);
  const [officerPassword, setOfficerPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [officerMode, setOfficerMode] = useState('login'); // 'login' | 'forgot' | 'verify_reset'
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Shared UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  if (!isOpen) return null;

  // --- SCHOLAR OTP FLOW ---
  const handleRollSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const clean = normalizeRollNumber(rollNumber);
    if (!clean) {
      setErrorMsg('Please enter your GPREC college roll number.');
      return;
    }

    if (!isAllowedGprecRoll(clean)) {
      setErrorMsg(`Roll number "${clean.toUpperCase()}" is not registered in this placement cohort. Contact ${PLACEMENT_SUPPORT_EMAIL} to request access.`);
      return;
    }

    setLoading(true);
    try {
      await sendGprecPlacementOtp(clean);
      setScholarStep('otp');
      startCooldown();
    } catch (err) {
      setErrorMsg(err.message || `Unable to send verification code. Please contact ${PLACEMENT_SUPPORT_EMAIL}`);
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = () => {
    setResendCooldown(45);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await sendGprecPlacementOtp(rollNumber);
      startCooldown();
      setSuccessMsg('A new OTP has been dispatched to your college email.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setErrorMsg('Please enter the 6-digit OTP sent to your email.');
      return;
    }

    setLoading(true);
    try {
      const userProfile = await verifyGprecPlacementOtp(rollNumber, cleanOtp);
      if (onLoginSuccess) {
        onLoginSuccess(userProfile);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired OTP. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- PLACEMENT OFFICER / DEAN PASSWORD FLOW ---
  const handleOfficerLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const officerUser = authenticatePlacementOfficer(officerEmail, officerPassword);
      if (onLoginSuccess) {
        onLoginSuccess(officerUser);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await sendOfficerPasswordResetCode(officerEmail);
      setOfficerMode('verify_reset');
      setSuccessMsg('Reset code dispatched to official mailbox: dean.placements@gprec.ac.in');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      verifyAndResetOfficerPassword(resetCode, newPassword);
      setOfficerPassword(newPassword);
      setOfficerMode('login');
      setSuccessMsg('Password successfully updated! You can now log in with your new password.');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const targetEmail = getGprecEmailFromRoll(rollNumber);

  return (
    <div className="fixed inset-0 z-[99999] bg-[#101A35]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#101A35]/10 shadow-2xl p-6 sm:p-8 space-y-5 relative overflow-hidden text-[#101A35] animate-in fade-in zoom-in-95 duration-200">
        {/* Decorative Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7553E8] via-[#08BFD0] to-[#00B987]" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Realistic3DLogo size="sm" />
            <img 
              src="/gprec-logo.png" 
              alt="GPREC Logo" 
              className="w-11 h-11 object-contain rounded-xl p-0.5 bg-white border border-slate-200 shadow-xs" 
            />
            <div>
              <h2 className="text-base font-black font-sora text-[#101A35]">
                {authRole === 'student' ? 'GPREC Scholar Login' : 'Placement Officer Login'}
              </h2>
              <p className="text-[11px] text-[#7553E8] font-bold uppercase tracking-wider">
                {authRole === 'student' ? 'Placement Suite Verification' : 'Dean & T&P Faculty Cell'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Role Selector Tabs (Scholar vs Placement Officer) */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-black">
          <button
            type="button"
            onClick={() => {
              setAuthRole('student');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authRole === 'student' 
                ? 'bg-white text-[#101A35] shadow-xs' 
                : 'text-slate-500 hover:text-[#101A35]'
            }`}
          >
            🎓 Scholar (OTP)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthRole('officer');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authRole === 'officer' 
                ? 'bg-white text-[#7553E8] shadow-xs' 
                : 'text-slate-500 hover:text-[#101A35]'
            }`}
          >
            🏛️ TPO / Dean Login
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="leading-relaxed font-medium">
              <p>{errorMsg}</p>
              {authRole === 'student' && (
                <a 
                  href={`mailto:${PLACEMENT_SUPPORT_EMAIL}`}
                  className="text-xs font-bold text-[#7553E8] underline block mt-1"
                >
                  Email Support: {PLACEMENT_SUPPORT_EMAIL}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <p className="leading-relaxed font-medium">{successMsg}</p>
          </div>
        )}

        {/* ================= VIEW 1: SCHOLAR LOGIN (OTP) ================= */}
        {authRole === 'student' && (
          scholarStep === 'roll' ? (
            <form onSubmit={handleRollSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                  Enter College Roll Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. 249XA33106"
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#7553E8] focus:bg-white text-sm font-mono font-bold tracking-wider uppercase outline-none transition-all"
                    autoFocus
                    required
                  />
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Only approved GPREC Placement cohort roll numbers are permitted.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 text-[11px] text-purple-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7553E8]" />
                  Institutional OTP Verification
                </div>
                <p className="text-purple-800/80 leading-relaxed font-normal">
                  A 6-digit OTP will be sent to your college email (<span className="font-mono font-semibold">roll@gprec.ac.in</span>) from <span className="font-mono font-bold">lumixora.team@gmail.com</span>.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#101A35] hover:bg-[#1E2E5D] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#08BFD0]" />
                    <span>Verifying Roll & Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="w-4 h-4 text-[#08BFD0]" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setScholarStep('roll'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-xs font-bold text-[#7553E8] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Change Roll Number
                </button>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  {rollNumber.toUpperCase()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-[#08BFD0]" />
                  <span>OTP Dispatched To:</span>
                </div>
                <p className="font-mono font-bold text-[#101A35] text-[13px] break-all">
                  {targetEmail}
                </p>
                <p className="text-[11px] text-slate-500 pt-0.5">
                  Sent from <span className="font-semibold text-purple-700">lumixora.team@gmail.com</span> (expires in 5 mins).
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                  Enter 6-Digit OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#08BFD0] focus:bg-white text-center font-mono font-black text-xl tracking-[0.5em] outline-none transition-all"
                    autoFocus
                    required
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Didn't receive the OTP?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="font-bold text-[#7553E8] hover:underline cursor-pointer disabled:text-slate-400 disabled:no-underline"
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#7553E8] to-[#08BFD0] hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Verify OTP & Enter Placement Suite</span>
                  </>
                )}
              </button>
            </form>
          )
        )}

        {/* ================= VIEW 2: PLACEMENT OFFICER / DEAN (PASSWORD) ================= */}
        {authRole === 'officer' && (
          officerMode === 'login' ? (
            <form onSubmit={handleOfficerLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                  Placement Officer Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={officerEmail}
                    onChange={(e) => setOfficerEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold outline-none"
                    required
                    readOnly
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                    Official Password / PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setOfficerMode('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-[11px] font-bold text-[#7553E8] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={officerPassword}
                    onChange={(e) => setOfficerPassword(e.target.value)}
                    placeholder="Enter official password"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#7553E8] focus:bg-white text-sm outline-none transition-all pr-11"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Default: <span className="font-mono font-bold text-slate-600">Lumi@2026</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#101A35] hover:bg-[#1E2E5D] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#08BFD0]" />
                <span>Enter Placement Officer Command Suite</span>
              </button>
            </form>
          ) : officerMode === 'forgot' ? (
            /* Forgot Password: Request Code */
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setOfficerMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-xs font-bold text-[#7553E8] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Back to Login
                </button>
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Account Recovery
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7553E8]" />
                  Secure Recovery Protocol
                </p>
                <p className="text-[11px] text-purple-800/80 leading-relaxed font-normal">
                  A 6-digit password reset authorization code will be sent to official mailbox: <br />
                  <span className="font-mono font-bold text-purple-950">dean.placements@gprec.ac.in</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#101A35] hover:bg-[#1E2E5D] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#08BFD0]" />
                    <span>Dispatching Reset Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Code to Dean Mailbox</span>
                    <ArrowRight className="w-4 h-4 text-[#08BFD0]" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Verify Code & Set New Password */
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setOfficerMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-xs font-bold text-[#7553E8] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Resend Code
                </button>
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Enter Reset Token
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                  6-Digit Recovery Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#7553E8] focus:bg-white text-center font-mono font-black text-xl tracking-[0.5em] outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                  New Official Password
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#7553E8] focus:bg-white text-sm outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#7553E8] to-[#08BFD0] hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Save New Password & Log In</span>
              </button>
            </form>
          )
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>GPREC Placement Cell • Kurnool</span>
          <span className="flex items-center gap-1 font-mono text-emerald-600 font-bold">
            <Lock className="w-3 h-3" /> Secure Auth
          </span>
        </div>
      </div>
    </div>
  );
}
