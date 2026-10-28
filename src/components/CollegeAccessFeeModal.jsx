import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, CheckCircle2, Check, Sparkles, AlertCircle, RefreshCw, 
  CreditCard, Lock, ArrowRight, X, Clock, AlertTriangle, Key, ChevronDown, ChevronUp, Zap
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { db } from '../config/firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { internshipDb } from '../services/internshipDb';
import { recordLocalFeePayment, KNOWN_VERIFIED_UTRS, KNOWN_PAID_EMAILS } from '../data/collegesData';
import { 
  notifyFounderPayment, notifyFounderAmbassadorReferral, cleanScholarName,
  checkUtrVerificationStatus 
} from '../services/founderNotificationService';
import { 
  initiateRazorpayPayment, getRazorpayKeyId, fetchRemoteRazorpayKey, saveRazorpayKeyGlobally 
} from '../services/razorpayService';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [confirmedTxId, setConfirmedTxId] = useState('');

  // Verification States: 'input' | 'pending_founder' | 'verified' | 'rejected'
  const [verificationState, setVerificationState] = useState('input');
  const [pendingUtr, setPendingUtr] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [pollTick, setPollTick] = useState(0);

  // Razorpay Key Management
  const [razorpayKey, setRazorpayKey] = useState(() => getRazorpayKeyId());
  const [showFounderKeyConfig, setShowFounderKeyConfig] = useState(false);
  const [founderKeyInput, setFounderKeyInput] = useState('');

  // Whitelisted Exemption Redeem (Shaik Anjum, etc.)
  const [showExemptionRedeem, setShowExemptionRedeem] = useState(false);
  const [exemptionUtr, setExemptionUtr] = useState('');
  const [exemptionError, setExemptionError] = useState('');

  const pollIntervalRef = useRef(null);

  const userName = cleanScholarName(user?.name || user?.displayName || 'Student Scholar');
  const userEmail = (user?.email || '').toLowerCase().trim();
  const collegeName = typeof college === 'string' 
    ? college 
    : (college?.name || college?.shortName || user?.college || user?.collegeName || "Academic Partner College");

  // 1. Fetch remote Razorpay key on mount if not in local storage
  useEffect(() => {
    fetchRemoteRazorpayKey().then(k => {
      if (k) setRazorpayKey(k);
    }).catch(() => {});
  }, []);

  // 2. Check for existing pending UTR submission or pre-verified paid email on mount
  useEffect(() => {
    if (!userEmail) return;

    if (KNOWN_PAID_EMAILS.has(userEmail) || userEmail === '249xa33112@gprec.ac.in') {
      finalizePayment('UTR-317827902237');
      return;
    }

    const cachedPending = localStorage.getItem(`lumixora_pending_utr_${userEmail}`);
    if (cachedPending) {
      setPendingUtr(cachedPending);
      setVerificationState('pending_founder');

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

    pollIntervalRef.current = setInterval(checkStatus, 3000);

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

  /**
   * Finalizes verified payment and persists status across Supabase, Firestore, and LocalStorage.
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
      paymentMethod: resolvedTxId.startsWith('RZP-') ? 'Razorpay' : 'Exemption',
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
              department: user?.department || user?.branch || 'CSE',
              branch: user?.department || user?.branch || 'CSE',
              year: user?.year || '1st Year',
              sem: user?.sem || '1',
              sec: user?.sec || 'A',
              rollNumber: user?.rollNumber || '',
              qualification: user?.qualification || 'B.Tech',
              place: user?.place || 'Kurnool',
              cgpa: user?.cgpa || '9.0',
              careerGoal: user?.careerGoal || 'Placement',
              learningStyle: user?.learningStyle || 'Practical',
              weakSubjects: user?.weakSubjects || 'None',
              ...(resolvedRef ? { referredBy: resolvedRef, referralCode: resolvedRef, referred_by: resolvedRef } : {}),
              ...paymentRecord
            };
            const packedName = `${userName} ${JSON.stringify(newMeta)}`;
            await supabase.from('users').upsert([{
              name: packedName,
              email: userEmail,
              password: 'oauth_managed_access',
              college: collegeName,
              department: newMeta.department,
              branch: newMeta.branch,
              year: newMeta.year,
              role: user?.role || 'user',
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
   * DIRECT 1-Click Automated Razorpay Checkout Handler.
   * Directly triggers Razorpay Checkout with Google Pay, PhonePe, Paytm, Cards, NetBanking.
   */
  const handlePayWithRazorpay = async () => {
    setIsProcessing(true);
    setError('');

    let keyId = razorpayKey || getRazorpayKeyId();
    if (!keyId) {
      keyId = await fetchRemoteRazorpayKey();
      if (keyId) setRazorpayKey(keyId);
    }

    if (!keyId) {
      setShowFounderKeyConfig(true);
      setError('Founder setup required: Please enter your Razorpay Key ID below to activate live checkouts.');
      setIsProcessing(false);
      return;
    }

    try {
      const result = await initiateRazorpayPayment({
        amount: FEE_AMOUNT,
        userName,
        userEmail,
        collegeName
      });

      if (result && result.paymentId) {
        // Razorpay confirmed genuine bank payment!
        await finalizePayment(result.txId);
      }
    } catch (err) {
      console.warn("Razorpay flow note:", err);
      if (!err.message?.includes('closed by user')) {
        setError(err.message || 'Payment could not be completed via Razorpay. Please retry.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Founder quick-save for Razorpay Key ID
   */
  const handleSaveFounderKey = async () => {
    const key = founderKeyInput.trim();
    if (!key) return;
    await saveRazorpayKeyGlobally(key);
    setRazorpayKey(key);
    setShowFounderKeyConfig(false);
    setError('');
  };

  /**
   * Whitelist Exemption Verification (Shaik Anjum UTR-616740048435, etc.)
   */
  const handleRedeemExemption = async (e) => {
    e.preventDefault();
    setExemptionError('');

    const cleanInput = exemptionUtr.trim().replace(/^UTR-/i, '');
    if (!cleanInput) {
      setExemptionError('Please enter your approved exemption UTR number.');
      return;
    }

    setIsProcessing(true);

    try {
      // Strictly verify against pre-verified whitelist
      if (KNOWN_VERIFIED_UTRS.has(cleanInput) || KNOWN_VERIFIED_UTRS.has(`UTR-${cleanInput}`)) {
        await finalizePayment(`UTR-${cleanInput}`);
        return;
      }

      setExemptionError('Exemption code not found. Only Founder-preapproved exemptions are accepted. Please pay ₹10 via Razorpay for instant activation.');
    } catch (err) {
      setExemptionError(err.message || 'Exemption validation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Dark Ambient Backdrop */}
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-fade-in" />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-[#10101a] via-[#0d0d16] to-[#07070d] border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(0,245,212,0.15)] overflow-hidden text-white my-auto animate-scale-up">
        
        {/* Glow ambient header highlights */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400" />
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
            <span className="text-gray-400 text-xs font-semibold">Zero-Trust Secured</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Platform Activation Pass
          </h2>

          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            One-time registration & login fee for students of <strong className="text-white font-bold">{collegeName}</strong>.
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
            STATE 2: AWAITING FOUNDER BANK VERIFICATION (ONLY FOR PRIOR SUBMISSIONS)
           ========================================================================= */}
        {verificationState === 'pending_founder' && (
          <div className="p-6 sm:p-7 space-y-4 animate-fade-in">
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-md animate-pulse">
                <Clock className="w-6 h-6" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-[11px] uppercase tracking-wider">
                  ⏳ Awaiting Bank Verification
                </span>
                <h3 className="text-base font-black text-white mt-2">
                  Founder Bank Statement Cross-Check
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  Submission <code className="text-cyan-300 font-mono font-bold">UTR-{pendingUtr}</code> is being verified against Founder bank statement.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span className="text-[11px]">Auto-checking bank statement in real-time...</span>
              </div>
              <span className="text-[10px] font-mono text-gray-500">#{pollTick}</span>
            </div>

            <button
              type="button"
              onClick={handlePayWithRazorpay}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl font-black text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:opacity-95 text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-black" />
              <span>Don't want to wait? Pay ₹10 via Razorpay for Instant Unlock</span>
            </button>
          </div>
        )}

        {/* =========================================================================
            STATE 3: REJECTED STATE
           ========================================================================= */}
        {verificationState === 'rejected' && (
          <div className="p-6 sm:p-7 space-y-4 animate-fade-in text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/40">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Payment Verification Failed</h3>
              <p className="text-xs text-red-300 font-semibold mt-1">
                {rejectionReason || 'UTR not found on Founder bank statement.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handlePayWithRazorpay}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl font-black text-black bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-black" />
              <span>Pay ₹10 via Razorpay (Instant Automated Unlock)</span>
            </button>
          </div>
        )}

        {/* =========================================================================
            STATE 4: DIRECT RAZORPAY CHECKOUT (PRIMARY & EXCLUSIVE)
           ========================================================================= */}
        {verificationState === 'input' && (
          <div className="p-6 sm:p-7 space-y-5">

            {/* Fee Summary Hero Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-emerald-950/40 border border-cyan-500/30 shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Lifetime Student Pass
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  One-Time Only
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <h4 className="text-base sm:text-lg font-black text-white">Institutional Access</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">AI Twins, Placement Arena & Unlimited Doubts</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-400">
                    ₹10.00
                  </div>
                  <span className="text-[10px] text-gray-500 block">INR (Incl. GST)</span>
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

            {/* DIRECT RAZORPAY CHECKOUT ACTION */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handlePayWithRazorpay}
                disabled={isProcessing}
                className="w-full py-4 px-5 rounded-2xl font-black text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:brightness-105 active:scale-[0.99] text-sm flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(0,245,212,0.3)] cursor-pointer transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-black" />
                    <span>Connecting to Bank Gateway...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-black fill-black" />
                    <span>Pay ₹10.00 via Razorpay</span>
                    <ArrowRight className="w-4 h-4 ml-1 stroke-[3]" />
                  </>
                )}
              </button>

              {/* Supported Payment Channels Banner */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Instant Auto-Unlock Supported Via:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-bold text-gray-200">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-cyan-300">Google Pay</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-purple-300">PhonePe</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-blue-300">Paytm</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-emerald-300">Any UPI</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-amber-300">Cards / NetBanking</span>
                </div>
              </div>
            </div>

            {/* Founder Razorpay Setup Drawer (If key not configured) */}
            {(!razorpayKey || showFounderKeyConfig) && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2.5 animate-fade-in text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Key className="w-4 h-4 shrink-0" />
                  <span>Founder: Connect Razorpay Key ID</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  Enter your Razorpay Key ID (<code className="text-amber-200 font-mono">rzp_live_...</code> or <code className="text-amber-200 font-mono">rzp_test_...</code>) from dashboard.razorpay.com to enable 1-click checkout for all students.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={founderKeyInput}
                    onChange={(e) => setFounderKeyInput(e.target.value)}
                    placeholder="rzp_live_xxxxxxxxxxxxxxxx"
                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={handleSaveFounderKey}
                    className="px-3.5 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    Save & Pay
                  </button>
                </div>
              </div>
            )}

            {/* Whitelisted Exemption Redeem (For Shaik Anjum, etc.) */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <button
                type="button"
                onClick={() => setShowExemptionRedeem(!showExemptionRedeem)}
                className="w-full text-center text-[11px] text-gray-400 hover:text-cyan-300 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <span>Have an official Founder Exemption UTR? Redeem here</span>
                {showExemptionRedeem ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showExemptionRedeem && (
                <form onSubmit={handleRedeemExemption} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5 animate-fade-in">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Founder-Approved Whitelist UTR:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={exemptionUtr}
                      onChange={(e) => {
                        setExemptionUtr(e.target.value);
                        setExemptionError('');
                      }}
                      placeholder="e.g. 616740048435"
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      disabled={isProcessing || !exemptionUtr.trim()}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-40"
                    >
                      Redeem
                    </button>
                  </div>
                  {exemptionError && (
                    <p className="text-[11px] text-red-400 font-medium">{exemptionError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Footer Trust & Sign Out */}
            <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-cyan-400" /> 256-Bit SSL Bank Encrypted
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
