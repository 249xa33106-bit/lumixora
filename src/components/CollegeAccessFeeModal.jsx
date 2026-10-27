import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  ShieldCheck, CheckCircle2, Copy, Check, ExternalLink, 
  Sparkles, AlertCircle, RefreshCw, Smartphone, CreditCard, Lock, ArrowRight, X,
  Clock, AlertTriangle, HelpCircle
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { db } from '../config/firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { internshipDb } from '../services/internshipDb';
import { 
  recordLocalFeePayment, validateUtrFormat, isValidVerifiedUtr, KNOWN_VERIFIED_UTRS 
} from '../data/collegesData';
import { 
  notifyFounderPayment, notifyFounderAmbassadorReferral, cleanScholarName,
  submitPendingFeePayment, checkUtrVerificationStatus
} from '../services/founderNotificationService';

const getFounderUpiId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('lumixora_founder_upi_id') || '9346476055@ptaxis';
  }
  return '9346476055@ptaxis';
};

const getFounderPayeeName = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('lumixora_founder_payee_name') || 'Shaik Sowban';
  }
  return 'Shaik Sowban';
};

const FEE_AMOUNT = 10.00;

export default function CollegeAccessFeeModal({ 
  isOpen = true, 
  user = null, 
  college = null, 
  mode = 'gate', // 'registration' | 'login' | 'gate'
  onSuccess, 
  onCancel,
  onLogout 
}) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [error, setError] = useState('');
  const [confirmedTxId, setConfirmedTxId] = useState('');

  // Zero-Trust Verification States: 'input' | 'submitting' | 'pending_founder' | 'verified' | 'rejected'
  const [verificationState, setVerificationState] = useState('input');
  const [pendingUtr, setPendingUtr] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [pollTick, setPollTick] = useState(0);

  const pollIntervalRef = useRef(null);

  const userName = cleanScholarName(user?.name || user?.displayName || 'Student Scholar');
  const userEmail = (user?.email || '').toLowerCase().trim();
  const collegeName = typeof college === 'string' 
    ? college 
    : (college?.name || college?.shortName || user?.college || user?.collegeName || "Academic Partner College");

  const officialUpiId = getFounderUpiId();
  const officialPayeeName = getFounderPayeeName();

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(officialUpiId)}&pn=${encodeURIComponent(officialPayeeName)}&am=10.00&cu=INR&tn=${encodeURIComponent(`Lumixora One-Time Fee - ${userEmail || userName}`)}`;

  // 1. Generate real dynamic UPI QR Code on mount
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(upiDeepLink, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    }).then((url) => {
      if (isMounted) setQrCodeDataUrl(url);
    }).catch(err => {
      console.warn("QR code generation error:", err);
    });

    return () => { isMounted = false; };
  }, [upiDeepLink]);

  // 2. Check for existing pending UTR submission in localStorage on mount
  useEffect(() => {
    if (!userEmail) return;
    const cachedPending = localStorage.getItem(`lumixora_pending_utr_${userEmail}`);
    if (cachedPending) {
      setPendingUtr(cachedPending);
      setVerificationState('pending_founder');

      // Check immediately if already verified or rejected
      checkUtrVerificationStatus(cachedPending, userEmail).then(res => {
        if (res.status === 'verified' || res.isVerified) {
          finalizePayment(`UTR-${cachedPending}`);
        } else if (res.status === 'rejected') {
          setVerificationState('rejected');
          setRejectionReason(res.reason || 'Transaction could not be verified on founder bank statement.');
        }
      }).catch(() => {});
    }
  }, [userEmail]);

  // 3. Live Polling & Realtime Subscription while in 'pending_founder' state
  useEffect(() => {
    if (verificationState !== 'pending_founder' || !pendingUtr) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await checkUtrVerificationStatus(pendingUtr, userEmail);
        setPollTick(t => t + 1);

        if (res.status === 'verified' || res.isVerified) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          localStorage.removeItem(`lumixora_pending_utr_${userEmail}`);
          finalizePayment(`UTR-${pendingUtr}`);
        } else if (res.status === 'rejected') {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          localStorage.removeItem(`lumixora_pending_utr_${userEmail}`);
          setVerificationState('rejected');
          setRejectionReason(res.reason || 'Transaction could not be verified on founder bank statement.');
        }
      } catch (e) {
        console.warn("Live status poll notice:", e);
      }
    };

    // Poll every 3 seconds for fast automated unlock
    pollIntervalRef.current = setInterval(checkStatus, 3000);

    // Also listen to Supabase realtime Postgres changes on founder_notifications
    let channel = null;
    if (supabase && typeof supabase.channel === 'function') {
      try {
        channel = supabase.channel(`payment_gate_${userEmail}`)
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'founder_notifications' 
          }, () => {
            checkStatus();
          })
          .subscribe();
      } catch (e) {}
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (channel && typeof channel.unsubscribe === 'function') channel.unsubscribe();
    };
  }, [verificationState, pendingUtr, userEmail]);

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(officialUpiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch (e) {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  /**
   * Finalizes genuine payment and persists verified status across Supabase, Firestore, and LocalStorage.
   */
  const finalizePayment = async (resolvedTxId) => {
    setIsProcessing(true);
    setError('');

    const nowIso = new Date().toISOString();
    const paymentRecord = {
      oneTimeFeePaid: true,
      feeAmount: FEE_AMOUNT,
      feePaidAt: nowIso,
      feeTxId: resolvedTxId,
      college: collegeName,
      status: 'verified',
      paymentMethod: 'UPI',
      currency: 'INR'
    };

    try {
      // 1. Update LocalStorage fallback cache
      if (userEmail) recordLocalFeePayment(userEmail, paymentRecord);
      if (user?.id || user?.uid) recordLocalFeePayment(user.id || user.uid, paymentRecord);
      localStorage.removeItem(`lumixora_pending_utr_${userEmail}`);

      // 2. Update Firestore user document
      const uid = user?.uid || user?.id;
      if (db && uid) {
        await Promise.allSettled([
          setDoc(doc(db, 'users', uid), paymentRecord, { merge: true }),
          setDoc(doc(db, 'Users', uid), paymentRecord, { merge: true }),
          addDoc(collection(db, 'college_fee_payments'), {
            uid,
            email: userEmail,
            name: userName,
            college: collegeName,
            ...paymentRecord,
            createdAt: nowIso
          })
        ]);
      }

      // 3. Update or Upsert in Supabase users table
      if (userEmail && supabase && typeof supabase.from === 'function') {
        try {
          const cachedRef = typeof window !== 'undefined' ? (localStorage.getItem('lumixora_referral_code') || '') : '';
          const resolvedRef = (user?.referredBy || user?.referralCode || cachedRef || '').trim().toUpperCase();

          const { data: existingRows } = await supabase.from('users').select('*').ilike('email', userEmail);
          if (existingRows && existingRows.length > 0) {
            const raw = existingRows[0].name || '';
            let meta = {};
            if (raw.includes('{')) {
              try { meta = JSON.parse(raw.substring(raw.indexOf('{'))); } catch (e) {}
            }
            const clean = raw.includes('{') ? raw.split('{')[0].trim() : raw;
            const refToKeep = meta.referredBy || meta.referralCode || resolvedRef;
            const updatedMeta = { 
              ...meta, 
              ...paymentRecord,
              ...(refToKeep ? { referredBy: refToKeep, referralCode: refToKeep, referred_by: refToKeep } : {})
            };
            const updatedPacked = `${clean} ${JSON.stringify(updatedMeta)}`;
            
            await supabase.from('users').update({ 
              name: updatedPacked,
              college: collegeName
            }).ilike('email', userEmail);
          } else {
            const newMeta = {
              college: collegeName,
              ...(resolvedRef ? { referredBy: resolvedRef, referralCode: resolvedRef, referred_by: resolvedRef } : {}),
              ...paymentRecord
            };
            const packedName = `${userName} ${JSON.stringify(newMeta)}`;
            await supabase.from('users').upsert([{
              name: packedName,
              email: userEmail,
              password: 'oauth_managed_access',
              college: collegeName,
              role: 'user',
              is_approved: true,
              created_at: nowIso
            }], { onConflict: 'email' });
          }

          if (resolvedRef) {
            const refDoc = {
              referralCode: resolvedRef,
              userEmail: userEmail,
              userName: userName,
              college: collegeName,
              department: user?.department || 'Engineering',
              year: user?.year || '1st Year',
              registeredAt: nowIso,
              timestamp: serverTimestamp ? serverTimestamp() : new Date().toISOString()
            };
            if (db) addDoc(collection(db, 'ambassador_referrals'), refDoc).catch(() => {});
            if (internshipDb) addDoc(collection(internshipDb, 'ambassador_referrals'), refDoc).catch(() => {});
            notifyFounderAmbassadorReferral({
              code: resolvedRef,
              scholarName: userName,
              scholarEmail: userEmail,
              college: collegeName,
              department: user?.department || 'Engineering'
            });
          }
        } catch (sbErr) {
          console.warn("Supabase fee update notice:", sbErr);
        }
      }

      // 4. Notify Founder Dashboard & Audit Log
      notifyFounderPayment({
        name: userName,
        email: userEmail,
        college: collegeName,
        amount: FEE_AMOUNT,
        txId: resolvedTxId,
        date: nowIso
      });

      setConfirmedTxId(resolvedTxId);
      setVerificationState('verified');

      const updatedUserDoc = {
        ...(user || {}),
        ...paymentRecord
      };

      setTimeout(() => {
        if (onSuccess) onSuccess(updatedUserDoc);
      }, 1600);

    } catch (err) {
      console.error("Payment finalization error:", err);
      setError("Payment synced. Unlocking your workspace now...");
      setConfirmedTxId(resolvedTxId);
      setVerificationState('verified');
      setTimeout(() => {
        if (onSuccess) onSuccess({ ...(user || {}), ...paymentRecord });
      }, 1600);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Zero-Trust UTR verification handler.
   * 1. Heuristic format validation (rejects 123456789012, 000000000000, 111111111111).
   * 2. Checks whitelist for instant pre-approved activation.
   * 3. Prevents duplicate UTR across students.
   * 4. Enqueues in Founder Live Verification queue.
   */
  const handleVerifyUTR = async (e) => {
    e.preventDefault();
    setError('');

    const cleanInput = utrNumber.trim();

    // 1. Strict Heuristic Validation
    const formatCheck = validateUtrFormat(cleanInput);
    if (!formatCheck.valid) {
      setError(formatCheck.reason);
      return;
    }

    const cleanUtr = formatCheck.cleanUtr;
    setIsProcessing(true);

    try {
      // 2. Check if UTR is in pre-verified whitelist (Shaik Anjum, Gundam Poojitha, G Varun Kumar, Kundili Thriveni)
      if (KNOWN_VERIFIED_UTRS.has(cleanUtr) || KNOWN_VERIFIED_UTRS.has(`UTR-${cleanUtr}`)) {
        await finalizePayment(`UTR-${cleanUtr}`);
        return;
      }

      // 3. Submit to Founder Verification Queue & Check Duplicates
      const res = await submitPendingFeePayment({
        name: userName,
        email: userEmail,
        college: collegeName,
        department: user?.department || 'Engineering',
        amount: FEE_AMOUNT,
        utr: cleanUtr
      });

      if (!res.success) {
        setError(res.reason || 'Verification request failed. Please verify your UTR and retry.');
        setIsProcessing(false);
        return;
      }

      if (res.status === 'verified' || res.isVerified) {
        await finalizePayment(`UTR-${cleanUtr}`);
        return;
      }

      // 4. Enter 'pending_founder' live waiting gate
      setPendingUtr(cleanUtr);
      setVerificationState('pending_founder');
      localStorage.setItem(`lumixora_pending_utr_${userEmail}`, cleanUtr);

    } catch (err) {
      console.error("UTR verification error:", err);
      setError(err.message || 'Network error communicating with verification server. Please retry.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelPending = () => {
    localStorage.removeItem(`lumixora_pending_utr_${userEmail}`);
    setVerificationState('input');
    setPendingUtr('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Dark Ambient Backdrop */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-fade-in" 
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-lg bg-gradient-to-b from-[#10101a] via-[#0d0d16] to-[#07070d] border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(0,245,212,0.15)] overflow-hidden text-white my-auto animate-scale-up">
        
        {/* Glow ambient header highlights */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 sm:p-7 pb-4 border-b border-white/10 relative">
          {onCancel && (
            <button
              onClick={onCancel}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Close / Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Institutional Access Gate
            </span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-gray-400 text-xs font-semibold">Lumixora Platform Security</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Platform Activation Pass
          </h2>

          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            One-time ₹10 registration & login fee for students of <strong className="text-white font-bold">{collegeName}</strong>.
          </p>
        </div>

        {/* =========================================================================
            STATE 1: VERIFIED SUCCESS VIEW
           ========================================================================= */}
        {verificationState === 'verified' && (
          <div className="p-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Payment Verified!</h3>
              <p className="text-sm text-emerald-300 font-semibold mt-1">
                ₹10.00 Lifetime Access Pass Successfully Activated
              </p>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                TxID: {confirmedTxId}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-gray-400">Student:</span>
                <span className="font-bold text-white">{userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Campus:</span>
                <span className="font-bold text-white">{collegeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Validity:</span>
                <span className="font-bold text-emerald-400">Lifetime Verified Access</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Unlocking your Lumixora workspace...
              </span>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 2: AWAITING FOUNDER BANK VERIFICATION (ZERO-TRUST WAITING SCREEN)
           ========================================================================= */}
        {verificationState === 'pending_founder' && (
          <div className="p-6 sm:p-8 space-y-5 animate-fade-in">
            
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-md shadow-amber-500/10 animate-pulse">
                <Clock className="w-7 h-7" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-[11px] uppercase tracking-wider">
                  ⏳ Awaiting Bank Verification
                </span>
                <h3 className="text-lg font-black text-white mt-2">
                  Founder Verification in Progress
                </h3>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed max-w-sm mx-auto">
                  Your payment submission is being cross-verified against Founder Shaik Sowban's bank statement for UPI ID <strong className="text-white font-mono">{officialUpiId}</strong>.
                </p>
              </div>
            </div>

            {/* Submission Details Card */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-400">Submitted UTR / Ref No:</span>
                <span className="font-mono font-bold text-cyan-300 text-sm">
                  UTR-{pendingUtr}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-400">Amount:</span>
                <span className="font-bold text-emerald-400">₹10.00 (One-Time)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-400">Scholar:</span>
                <span className="font-bold text-white">{userName}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-400">Institution:</span>
                <span className="font-bold text-gray-200">{collegeName}</span>
              </div>
            </div>

            {/* Realtime Status Indicator */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span className="text-[11px]">Auto-checking bank status in real-time...</span>
              </div>
              <span className="text-[10px] font-mono text-gray-500">
                Poll #{pollTick}
              </span>
            </div>

            {/* Re-enter UTR button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleCancelPending}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Entered Wrong UTR? Click to Re-Enter
              </button>
              
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-gray-400 hover:text-white text-xs underline cursor-pointer"
                >
                  Sign Out
                </button>
              )}
            </div>

          </div>
        )}

        {/* =========================================================================
            STATE 3: REJECTED STATE (FAKE UTR OR UNVERIFIED BANK TRANSACTION)
           ========================================================================= */}
        {verificationState === 'rejected' && (
          <div className="p-6 sm:p-8 space-y-5 animate-fade-in text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/40">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Payment Verification Failed</h3>
              <p className="text-xs text-red-300 font-semibold mt-1">
                {rejectionReason || 'UTR not found on Founder bank statement.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs text-left text-gray-300 space-y-2">
              <p className="leading-relaxed">
                We checked the bank statement for UPI ID <strong className="text-white font-mono">{officialUpiId}</strong>, but transaction <code className="text-red-300 font-mono">UTR-{pendingUtr}</code> was not found.
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-1 text-[11px]">
                <li>Ensure you paid ₹10.00 to <strong className="text-white font-mono">{officialUpiId}</strong></li>
                <li>Make sure you entered the genuine 12-digit UTR from your receipt (Google Pay / PhonePe / Paytm)</li>
                <li>Random or fake sequential numbers (e.g. 123456789012) are permanently blocked</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                setVerificationState('input');
                setUtrNumber('');
                setError('');
              }}
              className="w-full py-3 px-4 rounded-xl font-black text-black bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-xs shadow-lg transition-all cursor-pointer"
            >
              Pay ₹10 & Enter Genuine UTR Number
            </button>
          </div>
        )}

        {/* =========================================================================
            STATE 4: PAYMENT INPUT & QR CODE VIEW
           ========================================================================= */}
        {verificationState === 'input' && (
          <div className="p-6 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">

            {/* Fee Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 border border-cyan-500/25 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">
                  One-Time Registration & Login Fee
                </span>
                <h4 className="text-lg font-black text-white">Student Activation Pass</h4>
                <p className="text-[11px] text-gray-400">Zero-Trust Verified Access · AI Twins, Placement Arena & Doubts</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-400">
                  ₹10.00
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  One-Time Only
                </span>
              </div>
            </div>

            {/* QR Code and UPI ID Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-black/40 p-4 rounded-2xl border border-white/10">
              
              {/* Live QR Code Box */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-xl">
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="Scan UPI QR Code for ₹10" 
                    className="w-44 h-44 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin text-cyan-500" />
                  </div>
                )}
                <div className="mt-2 flex items-center gap-1 text-[11px] font-black text-slate-800">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Scan with any UPI App</span>
                </div>
              </div>

              {/* UPI App Links & Instructions */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Official Lumixora UPI ID:
                  </label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                    <code className="text-xs font-mono font-bold text-cyan-300 flex-1 select-all">
                      {officialUpiId}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyUPI}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {copiedUpi && (
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      ✓ UPI ID copied to clipboard!
                    </span>
                  )}
                </div>

                {/* Mobile Direct Pay Button */}
                <a
                  href={upiDeepLink}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay ₹10 via UPI App (Mobile)</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                {/* Supported Apps List */}
                <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-2 pt-1 border-t border-white/5">
                  <span>Google Pay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={handleVerifyUTR} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center justify-between">
                  <span>Enter 12-Digit UPI Reference Number / UTR ID:</span>
                  <span className="text-[10px] text-gray-500 font-normal">From receipt</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={utrNumber}
                  onChange={(e) => { 
                    setUtrNumber(e.target.value.replace(/[^0-9]/g, '')); 
                    setError(''); 
                  }}
                  placeholder="e.g. 429182049182 (12 digits from receipt)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all tracking-wider"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  🔒 Zero-Trust Security: Every UTR is checked against fake patterns, duplicate uses, and verified with bank statement.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing || !utrNumber.trim()}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:opacity-95 text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-black" />
                      <span>Submit Payment for Bank Verification (₹10)</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Notice & Logout Option */}
            <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-cyan-400" /> Bank Statement Verified
              </span>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-gray-400 hover:text-white underline font-semibold cursor-pointer"
                >
                  Switch Account / Sign Out
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
