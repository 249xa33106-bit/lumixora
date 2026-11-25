/**
 * campusDbService.js
 * Dedicated Supabase & Cloud Database Engine for campus.lumixora.in
 * Strictly isolated tables:
 *  - `campus_scholars`
 *  - `campus_payments`
 *  - `campus_readiness`
 */

import { supabase } from '../config/supabase';

const LOCAL_SCHOLAR_PREFIX = 'lumixora_campus_profile_';
const LOCAL_PAYMENT_PREFIX = 'lumixora_campus_payment_';
const LOCAL_READINESS_PREFIX = 'lumixora_campus_readiness_';

/**
 * Normalizes email address
 */
export function normalizeEmail(email = '') {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * ── 1. CAMPUS SCHOLARS TABLE (campus_scholars) ──
 */

export async function upsertCampusScholar(scholarData) {
  const email = normalizeEmail(scholarData.email);
  if (!email) throw new Error('Scholar email is required');

  const record = {
    id: scholarData.id || `campus_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email,
    name: scholarData.name?.trim() || email.split('@')[0],
    college_name: scholarData.collegeName?.trim() || scholarData.college_name?.trim() || 'Autonomous Institution',
    roll_number: (scholarData.rollNumber || scholarData.roll_number || '').trim().toUpperCase(),
    department: scholarData.department || scholarData.branch || 'Computer Science',
    branch: scholarData.branch || scholarData.department || 'Computer Science',
    batch: scholarData.batch || '2026',
    auth_provider: scholarData.authProvider || scholarData.auth_provider || 'otp',
    avatar: scholarData.avatar || scholarData.photoURL || null,
    is_campus_verified: true,
    is_fee_paid: scholarData.is_fee_paid === true || scholarData.oneTimeFeePaid === true || false,
    fee_amount: scholarData.fee_amount || (scholarData.is_fee_paid ? 10.00 : null),
    fee_tx_id: scholarData.fee_tx_id || null,
    fee_paid_at: scholarData.fee_paid_at || null,
    created_at: scholarData.created_at || new Date().toISOString(),
    last_login_at: new Date().toISOString()
  };

  // Local fallback cache
  try {
    localStorage.setItem(LOCAL_SCHOLAR_PREFIX + email, JSON.stringify(record));
    localStorage.setItem('lumixora_campus_student_profile', JSON.stringify(record));
  } catch (_) {}

  // Supabase cloud persistence
  if (supabase && typeof supabase.from === 'function') {
    try {
      const { data, error } = await supabase
        .from('campus_scholars')
        .upsert([record], { onConflict: 'email' })
        .select();

      if (!error && data && data.length > 0) {
        return data[0];
      }
    } catch (err) {
      console.warn('Notice: `campus_scholars` table sync status:', err.message || err);
    }
  }

  return record;
}

export async function fetchCampusScholar(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) return null;

  // Check Supabase first
  if (supabase && typeof supabase.from === 'function') {
    try {
      const { data, error } = await supabase
        .from('campus_scholars')
        .select('*')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Notice: fetching from `campus_scholars`:', err.message || err);
    }
  }

  // Local fallback
  try {
    const raw = localStorage.getItem(LOCAL_SCHOLAR_PREFIX + cleanEmail) ||
                localStorage.getItem('lumixora_campus_student_profile');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

/**
 * ── 2. CAMPUS PAYMENTS TABLE (campus_payments) ──
 */

export async function recordCampusPayment({
  email,
  name,
  collegeName,
  rollNumber,
  amount = 10.00,
  currency = 'INR',
  paymentMethod = 'Razorpay',
  txId,
  utr,
  status = 'verified'
}) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) throw new Error('Scholar email is required for payment record');

  const resolvedTxId = txId || (utr ? `UTR-${utr}` : `PAY-${Date.now()}`);
  const nowIso = new Date().toISOString();

  const paymentRecord = {
    id: `camp_pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    scholar_email: cleanEmail,
    scholar_name: name || cleanEmail.split('@')[0],
    college_name: collegeName || 'Autonomous Institution',
    roll_number: rollNumber || '',
    amount: Number(amount) || 10.00,
    currency,
    payment_method: paymentMethod,
    tx_id: resolvedTxId,
    utr_number: utr || (resolvedTxId.startsWith('UTR-') ? resolvedTxId.replace('UTR-', '') : ''),
    status,
    created_at: nowIso
  };

  // Local cache
  try {
    localStorage.setItem(LOCAL_PAYMENT_PREFIX + cleanEmail, JSON.stringify(paymentRecord));
    localStorage.setItem(`lumixora_campus_paid_${cleanEmail}`, 'true');
  } catch (_) {}

  // 1. Insert into dedicated `campus_payments` table
  if (supabase && typeof supabase.from === 'function') {
    try {
      await supabase.from('campus_payments').insert([paymentRecord]);
    } catch (err) {
      console.warn('Notice: `campus_payments` insert status:', err.message || err);
    }

    // 2. Mark payment in `campus_scholars` table
    try {
      await supabase.from('campus_scholars').update({
        is_fee_paid: true,
        fee_amount: Number(amount) || 10.00,
        fee_tx_id: resolvedTxId,
        fee_paid_at: nowIso
      }).ilike('email', cleanEmail);
    } catch (err) {
      console.warn('Notice: `campus_scholars` fee update status:', err.message || err);
    }
  }

  return paymentRecord;
}

export async function checkCampusPaymentStatus(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) return false;

  // Check local cache first
  try {
    if (localStorage.getItem(`lumixora_campus_paid_${cleanEmail}`) === 'true') {
      return true;
    }
  } catch (_) {}

  // Check Supabase `campus_payments` table
  if (supabase && typeof supabase.from === 'function') {
    try {
      const { data: payments } = await supabase
        .from('campus_payments')
        .select('id, status, tx_id')
        .ilike('scholar_email', cleanEmail)
        .eq('status', 'verified')
        .limit(1);

      if (payments && payments.length > 0) {
        try {
          localStorage.setItem(`lumixora_campus_paid_${cleanEmail}`, 'true');
        } catch (_) {}
        return true;
      }

      // Fallback: check `campus_scholars`
      const { data: scholar } = await supabase
        .from('campus_scholars')
        .select('is_fee_paid')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (scholar?.is_fee_paid) {
        try {
          localStorage.setItem(`lumixora_campus_paid_${cleanEmail}`, 'true');
        } catch (_) {}
        return true;
      }
    } catch (err) {
      console.warn('Notice: payment verification lookup:', err.message || err);
    }
  }

  return false;
}

/**
 * ── 3. CAMPUS READINESS TABLE (campus_readiness) ──
 */

export async function saveCampusReadiness(email, metrics) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) return null;

  const record = {
    scholar_email: cleanEmail,
    target_company: metrics.targetCompany || metrics.target_company || 'tcs',
    total_score: metrics.totalScore || 74,
    tier: metrics.tier || 'Tier-1 Ready',
    aptitude_score: metrics.aptitudeScore || 78,
    coding_score: metrics.codingScore || 72,
    interview_score: metrics.interviewScore || 68,
    resume_score: metrics.resumeScore || 85,
    streak_days: metrics.streakDays || 3,
    updated_at: new Date().toISOString()
  };

  try {
    localStorage.setItem(LOCAL_READINESS_PREFIX + cleanEmail, JSON.stringify(record));
  } catch (_) {}

  if (supabase && typeof supabase.from === 'function') {
    try {
      await supabase.from('campus_readiness').upsert([record], { onConflict: 'scholar_email' });
    } catch (err) {
      console.warn('Notice: `campus_readiness` update status:', err.message || err);
    }
  }

  return record;
}

export async function fetchCampusReadiness(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) return null;

  if (supabase && typeof supabase.from === 'function') {
    try {
      const { data, error } = await supabase
        .from('campus_readiness')
        .select('*')
        .ilike('scholar_email', cleanEmail)
        .maybeSingle();

      if (!error && data) return data;
    } catch (_) {}
  }

  try {
    const raw = localStorage.getItem(LOCAL_READINESS_PREFIX + cleanEmail);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}
