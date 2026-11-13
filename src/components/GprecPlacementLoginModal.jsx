import React, { useState } from 'react';
import { 
  ShieldCheck, Mail, KeyRound, ArrowRight, CheckCircle2, 
  AlertCircle, RefreshCw, Lock, Sparkles, Building2, ChevronLeft, Eye, EyeOff,
  Check, Shield
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
  const [targetEmail, setTargetEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Officer / Dean State
  const [officerEmail, setOfficerEmail] = useState(GPREC_OFFICER_CONFIG.deanEmail);
  const [officerPassword, setOfficerPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [officerMode, setOfficerMode] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // ─── 1. SCHOLAR: SUBMIT ROLL & SEND OTP ──────────────────────────────────
  const handleRollSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanRoll = normalizeRollNumber(rollNumber);
    if (!cleanRoll) {
      setErrorMsg('Please enter a valid GPREC roll number.');
      return;
    }

    if (!isAllowedGprecRoll(cleanRoll)) {
      setErrorMsg(`Roll number "${cleanRoll}" is not verified for the GPREC Placement Suite. Only verified GPREC scholars are permitted.`);
      return;
    }

    const email = getGprecEmailFromRoll(cleanRoll);
    setTargetEmail(email);
    setLoading(true);

    try {
      const res = await sendGprecPlacementOtp(cleanRoll);
      if (res.success) {
        setScholarStep('otp');
        setSuccessMsg(`6-digit OTP dispatched to ${email}. Check inbox & spam folder.`);
        startResendTimer();
      } else {
        setErrorMsg(res.error || 'Failed to dispatch OTP. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error while dispatching OTP. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // ─── 2. SCHOLAR: VERIFY OTP ──────────────────────────────────────────────
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otp || otp.trim().length < 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyGprecPlacementOtp(rollNumber, otp.trim());
      if (res.success) {
        setSuccessMsg('Identity verified. Entering GPREC Placement Suite...');
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(res.user);
          }
          onClose();
        }, 600);
      } else {
        setErrorMsg(res.error || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setErrorMsg('Verification failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // ─── 3. SCHOLAR: RESEND OTP ──────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await sendGprecPlacementOtp(rollNumber);
      if (res.success) {
        setSuccessMsg(`New OTP dispatched to ${targetEmail}.`);
        startResendTimer();
      } else {
        setErrorMsg(res.error || 'Failed to resend OTP.');
      }
    } catch (err) {
      setErrorMsg('Could not resend OTP. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendCooldown(60);
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

  // ─── 4. OFFICER: PASSWORD LOGIN ─────────────────────────────────────────
  const handleOfficerLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!officerPassword) {
      setErrorMsg('Please enter the official TPO administration password.');
      return;
    }

    try {
      const res = authenticatePlacementOfficer(officerEmail, officerPassword);
      const userObj = res.user || res;
      if (res.success || userObj.isOfficer || userObj.isDean) {
        setSuccessMsg('Placement Officer authenticated. Loading operations suite...');
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(userObj);
          }
          onClose();
        }, 500);
      } else {
        setErrorMsg(res.error || 'Incorrect official password.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Incorrect official password.');
    }
  };

  // ─── 5. OFFICER: FORGOT PASSWORD (REQUEST CODE) ──────────────────────────
  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await sendOfficerPasswordResetCode(officerEmail);
      if (res.success) {
        setOfficerMode('reset');
        setSuccessMsg('6-digit reset code dispatched to official mailbox: dean.placements@gprec.ac.in');
      } else {
        setErrorMsg(res.error || 'Failed to dispatch reset code.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error requesting reset code.');
    } finally {
      setLoading(false);
    }
  };

  // ─── 6. OFFICER: VERIFY CODE & SET NEW PASSWORD ─────────────────────────
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!resetCode || resetCode.length < 6) {
      setErrorMsg('Please enter the full 6-digit recovery code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    try {
      const res = verifyAndResetOfficerPassword(resetCode, newPassword, officerEmail);
      const userObj = res.user || res;
      if (res.success) {
        setSuccessMsg('Official password successfully reset. You are now logged in.');
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(userObj);
          }
          onClose();
        }, 800);
      } else {
        setErrorMsg(res.error || 'Invalid or expired recovery code.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-[#0B132B]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-[#E2E8F0] shadow-xl p-6 sm:p-7 space-y-5 relative overflow-hidden text-[#0B132B] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Subtle Gold Hairline Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#C5A059]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <img 
              src="/gprec_logo.png" 
              alt="GPREC Crest" 
              className="w-10 h-10 object-contain rounded p-0.5 bg-white border border-[#E2E8F0] shrink-0" 
            />
            <div>
              <h2 className="text-base font-bold text-[#0B132B] tracking-tight">
                {authRole === 'student' ? 'GPREC Scholar Verification' : 'TPO Administration Login'}
              </h2>
              <p className="text-[10px] text-[#9A7328] font-semibold uppercase tracking-wider">
                {authRole === 'student' ? 'Placement Suite Access' : 'Training & Placement Cell'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0B132B] font-bold text-xs cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Swiss Segmented Role Selector */}
        <div className="grid grid-cols-2 p-1 bg-[#F1F5F9] rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthRole('student');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 rounded-md transition-all cursor-pointer ${
              authRole === 'student' 
                ? 'bg-white text-[#0B132B] shadow-xs border border-[#E2E8F0]' 
                : 'text-[#64748B] hover:text-[#0B132B]'
            }`}
          >
            Scholar (OTP Auth)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthRole('officer');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 rounded-md transition-all cursor-pointer ${
              authRole === 'officer' 
                ? 'bg-white text-[#0B132B] shadow-xs border border-[#E2E8F0]' 
                : 'text-[#64748B] hover:text-[#0B132B]'
            }`}
          >
            TPO / Dean Office
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="leading-relaxed font-normal">
              <p>{errorMsg}</p>
              {authRole === 'student' && (
                <a 
                  href={`mailto:${PLACEMENT_SUPPORT_EMAIL}`}
                  className="text-xs font-semibold text-[#0B132B] underline block mt-1"
                >
                  Contact Support: {PLACEMENT_SUPPORT_EMAIL}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <p className="leading-relaxed font-normal">{successMsg}</p>
          </div>
        )}

        {/* ================= VIEW 1: SCHOLAR LOGIN (OTP) ================= */}
        {authRole === 'student' && (
          scholarStep === 'roll' ? (
            <form onSubmit={handleRollSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#475569] block">
                  College Roll Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. 249XA33106"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B] text-sm font-mono font-bold tracking-wider uppercase outline-none transition-all"
                    autoFocus
                    required
                  />
                  <ShieldCheck className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-[#64748B] leading-normal">
                  Registered GPREC placement candidate roll numbers only.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#475569] space-y-1">
                <div className="font-semibold text-[#0B132B] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
                  Institutional OTP Verification
                </div>
                <p className="text-[#475569] leading-relaxed font-normal">
                  A 6-digit authorization token will be dispatched to your official student webmail (<span className="font-mono font-bold text-[#0B132B]">roll@gprec.ac.in</span>).
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#0B132B] hover:bg-[#152042] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                    <span>Verifying Roll Number...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
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
                  className="text-xs font-semibold text-[#0B132B] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Change Roll Number
                </button>
                <span className="text-[11px] font-mono font-bold text-[#0B132B]">
                  {rollNumber.toUpperCase()}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
                <div className="flex items-center gap-2 font-semibold text-[#0B132B]">
                  <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>OTP Dispatched To:</span>
                </div>
                <p className="font-mono font-bold text-[#0B132B] text-[12px] break-all">
                  {targetEmail}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  Official GPREC Student Mailbox • Valid for 5 minutes.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#475569] block">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B] text-center font-mono font-bold text-lg tracking-[0.4em] outline-none transition-all"
                    autoFocus
                    required
                  />
                  <KeyRound className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#64748B]">Didn't receive the token?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="font-semibold text-[#0B132B] hover:underline cursor-pointer disabled:text-[#94A3B8] disabled:no-underline"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#0B132B] hover:bg-[#152042] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#C5A059]" />
                    <span>Authorize & Enter Placement Suite</span>
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
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#475569] block">
                  Placement Officer / Coordinator Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={officerEmail}
                    onChange={(e) => setOfficerEmail(e.target.value)}
                    placeholder="e.g. srikanth.csm@gprec.ac.in"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B] text-xs font-mono font-semibold text-[#0B132B] outline-none transition-all pr-10"
                    required
                  />
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {/* Fast Select Options */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] text-[#64748B]">Quick select:</span>
                  <button
                    type="button"
                    onClick={() => { setOfficerEmail('srikanth.csm@gprec.ac.in'); setErrorMsg(''); }}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      officerEmail.toLowerCase() === 'srikanth.csm@gprec.ac.in'
                        ? 'bg-[#0B132B] text-white border-[#0B132B] font-bold'
                        : 'bg-[#F8FAFC] text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    srikanth.csm@gprec.ac.in
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOfficerEmail('dean.placements@gprec.ac.in'); setErrorMsg(''); }}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      officerEmail.toLowerCase() === 'dean.placements@gprec.ac.in'
                        ? 'bg-[#0B132B] text-white border-[#0B132B] font-bold'
                        : 'bg-[#F8FAFC] text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    dean.placements@gprec.ac.in
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#475569] block">
                    Administrative Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setOfficerMode('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-[11px] font-semibold text-[#9A7328] hover:underline cursor-pointer"
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
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B] text-xs outline-none transition-all pr-10"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0B132B] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-[#64748B]">
                  Default Access Token: <span className="font-mono font-bold text-[#0B132B]">LUMI@2026</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#0B132B] hover:bg-[#152042] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#C5A059]" />
                <span>Enter TPO Operations Suite</span>
              </button>
            </form>
          ) : officerMode === 'forgot' ? (
            /* Forgot Password: Request Code */
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setOfficerMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-xs font-semibold text-[#0B132B] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Back to Login
                </button>
                <span className="text-[10px] font-semibold text-[#64748B] uppercase font-mono">
                  Recovery
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569] space-y-1">
                <p className="font-semibold text-[#0B132B] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  Secure Recovery Protocol
                </p>
                <p className="text-[11px] leading-relaxed">
                  A 6-digit password reset authorization token will be dispatched to: <br />
                  <span className="font-mono font-bold text-[#0B132B]">{officerEmail || "dean.placements@gprec.ac.in"}</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#0B132B] hover:bg-[#152042] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                    <span>Dispatching Token...</span>
                  </>
                ) : (
                  <>
                    <span>Dispatch Reset Token to Dean Mailbox</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
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
                  className="text-xs font-semibold text-[#0B132B] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Resend Token
                </button>
                <span className="text-[10px] font-semibold text-[#64748B] uppercase font-mono">
                  Token Verification
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#475569] block">
                  6-Digit Recovery Token
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B] text-center font-mono font-bold text-lg tracking-[0.4em] outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#475569] block">
                  New Administrative Password
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B] text-xs outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#0B132B] hover:bg-[#152042] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#C5A059]" />
                <span>Save New Password & Enter Suite</span>
              </button>
            </form>
          )
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
          <span>GPREC Training & Placement Cell</span>
          <span className="flex items-center gap-1 font-mono text-[#0B132B] font-semibold">
            <Lock className="w-3 h-3 text-[#C5A059]" /> Verified Encryption
          </span>
        </div>
      </div>
    </div>
  );
}
