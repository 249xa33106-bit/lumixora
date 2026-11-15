import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Crown,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { auth } from '../config/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { recordUserLogin } from '../services/userActivityLogService';

export default function FounderLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [passkey, setPasskey] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFounderPasswordLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanKey = passkey.trim();

      if (!cleanEmail) {
        throw new Error('Please enter your authorized founder email.');
      }

      if (!cleanKey) {
        throw new Error('Please enter the master security key.');
      }

      const validKeys = [
        'lumi@founder2026', 
        'lumi@2026', 
        'founder2026', 
        'lumixora@2026',
        'lumi2026'
      ];

      const isKeyMatch = validKeys.includes(cleanKey.toLowerCase());

      const isEmailAuthorized = 
        cleanEmail === 'founder@lumixora.com' || 
        cleanEmail.includes('founder') || 
        cleanEmail.endsWith('@lumixora.in') ||
        cleanEmail.endsWith('@lumixora.com');

      if (!isEmailAuthorized) {
        throw new Error('Access Restricted: Only designated Founder & Executive accounts are authorized.');
      }

      if (!isKeyMatch) {
        throw new Error('Invalid Master Security Passkey. Access Denied.');
      }

      const founderUser = {
        id: 'founder_lumixora_executive',
        uid: 'founder_lumixora_executive',
        name: 'Lumixora Founder & CEO',
        displayName: 'Founder & CEO',
        email: cleanEmail || 'founder@lumixora.com',
        role: 'founder',
        isFounder: true,
        emailVerified: true,
        oneTimeFeePaid: true
      };

      // Non-blocking telemetry logging in background
      try {
        recordUserLogin(founderUser, 'Founder Executive Console').catch(() => {});
      } catch (_) {}

      // Instant execution: zero lag, zero wait
      if (onLoginSuccess) {
        onLoginSuccess(founderUser);
      }
      if (onClose) {
        onClose();
      }

    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleGoogleFounderSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const googleProvider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, googleProvider);
      const oauthEmail = (res.user?.email || '').toLowerCase().trim();

      const isAuthorized = 
        oauthEmail === 'founder@lumixora.com' || 
        oauthEmail.includes('founder') || 
        oauthEmail.endsWith('@lumixora.in');

      if (!isAuthorized) {
        await auth.signOut();
        throw new Error(`Unauthorized account (${oauthEmail}). Access is strictly restricted to Founder Executive accounts.`);
      }

      const founderUser = {
        id: res.user.uid,
        uid: res.user.uid,
        name: res.user.displayName || 'Lumixora Founder',
        displayName: 'Founder & CEO',
        email: oauthEmail,
        role: 'founder',
        isFounder: true,
        emailVerified: true,
        oneTimeFeePaid: true
      };

      // Non-blocking telemetry logging in background
      try {
        recordUserLogin(founderUser, 'Founder Executive Console').catch(() => {});
      } catch (_) {}

      // Instant transition
      if (onLoginSuccess) {
        onLoginSuccess(founderUser);
      }
      if (onClose) onClose();

    } catch (err) {
      setErrorMsg(err.message || 'Google Founder Sign-In was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
      <div 
        className="w-full max-w-md rounded-3xl bg-slate-950 border border-amber-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-md shadow-amber-400/10">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white font-sora">Founder Console</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Executive Login & Live Audit Command
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <p className="leading-relaxed">{successMsg}</p>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleFounderPasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Founder Identification Email</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter authorized executive email"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Master Security Passkey</span>
            </label>
            <div className="relative">
              <input
                type={showPasskey ? "text" : "password"}
                required
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter master security key"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPasskey(!showPasskey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {loading ? (
              <span>Authorizing Executive Clearance...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Enter Founder Command Center</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-[1px] flex-1 bg-white/10"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Or SSO Identity</span>
          <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={handleGoogleFounderSignIn}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google (founder@lumixora.com)</span>
        </button>
      </div>
    </div>
  );
}
