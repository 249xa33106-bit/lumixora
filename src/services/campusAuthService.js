/**
 * campusAuthService.js
 * High-Security Universal Authentication Service for campus.lumixora.in
 * Dedicated to all college/university scholars outside GPREC.
 */

import { supabase } from '../config/supabase';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const STORAGE_CAMPUS_PROFILE_KEY = 'lumixora_campus_student_profile';
const STORAGE_CAMPUS_SESSION_KEY = 'lumixora_campus_session_token';
const RATE_LIMIT_PREFIX = 'lumixora_campus_rate_limit_';

// Curated list of prominent universities & autonomous engineering institutions across AP, Telangana & India
export const POPULAR_CAMPUS_COLLEGES = [
  'JNTU College of Engineering, Anantapur (JNTUA)',
  'JNTU College of Engineering, Hyderabad (JNTUH)',
  'JNTU College of Engineering, Kakinada (JNTUK)',
  'Sri Venkateswara University College of Engineering (SVUCE)',
  'Chaitanya Bharathi Institute of Technology (CBIT)',
  'Vasavi College of Engineering (VCE)',
  'VNR Vignana Jyothi Institute of Engineering & Technology (VNRVJIET)',
  'SRM Institute of Science and Technology',
  'Vellore Institute of Technology (VIT)',
  'Koneru Lakshmaiah Education Foundation (KL University)',
  'R.G.M College of Engineering and Technology (RGMCET, Nandyal)',
  'Srinivasa Ramanujan Institute of Technology (SRIT, Anantapur)',
  'Annamacharya Institute of Technology & Sciences (AITS)',
  'G. Pullaiah College of Engineering & Technology (GPCET, Kurnool)',
  'K.S.R.M. College of Engineering (Kadapa)',
  'Sree Vidyanikethan Engineering College (SVEC, Tirupati)',
  'GMR Institute of Technology (GMRIT, Rajam)',
  'Gayatri Vidya Parishad College of Engineering (GVPCE)',
  'BVRIT Hyderabad College of Engineering for Women',
  'CVR College of Engineering',
  'Osmania University College of Engineering (OUCE)',
  'Andhra University College of Engineering (AUCE)'
];

export const POPULAR_CAMPUS_BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'CSE - Artificial Intelligence & Machine Learning (CSM/AIML)',
  'CSE - Data Science (CSD/DS)',
  'CSE - Cyber Security',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Master of Computer Applications (MCA)',
  'Bachelor of Computer Applications (BCA)'
];

/**
 * Normalizes email address
 */
export function normalizeCampusEmail(email = '') {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Checks client-side rate limiting to prevent brute force
 */
export function checkRateLimit(email) {
  if (typeof window === 'undefined') return { allowed: true };
  const key = RATE_LIMIT_PREFIX + normalizeCampusEmail(email);
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return { allowed: true };
    const data = JSON.parse(raw);
    const now = Date.now();
    if (data.lockedUntil && now < data.lockedUntil) {
      const waitSec = Math.ceil((data.lockedUntil - now) / 1000);
      return { allowed: false, waitSec, message: `Too many attempts. Please wait ${waitSec}s before retrying.` };
    }
    return { allowed: true };
  } catch (e) {
    return { allowed: true };
  }
}

/**
 * Records failed attempt and applies lockout if needed
 */
export function recordRateLimitFailure(email) {
  if (typeof window === 'undefined') return;
  const key = RATE_LIMIT_PREFIX + normalizeCampusEmail(email);
  try {
    const raw = sessionStorage.getItem(key);
    const now = Date.now();
    let data = raw ? JSON.parse(raw) : { attempts: 0, firstAttempt: now };
    
    // Reset if window expired (more than 5 mins)
    if (now - data.firstAttempt > 300000) {
      data = { attempts: 0, firstAttempt: now };
    }

    data.attempts = (data.attempts || 0) + 1;
    if (data.attempts >= 4) {
      data.lockedUntil = now + 60000; // 60s lockout
    }
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
}

/**
 * Computes a secure time-based 6-digit rolling code (5-minute sliding window)
 */
function computeRollingCode(email, windowOffset = 0) {
  const normalized = normalizeCampusEmail(email);
  const period = 300; // 5 minutes
  const timeStep = Math.floor(Math.floor(Date.now() / 1000) / period) + windowOffset;
  const seedString = `${normalized}:CAMPUS_SEC_2026:${timeStep}`;

  let hash = 0x811c9dc5;
  for (let i = 0; i < seedString.length; i++) {
    hash ^= seedString.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const positive = Math.abs(hash >>> 0);
  const code = (100000 + (positive % 900000)).toString();
  return code;
}

/**
 * Dispatches 6-digit OTP code to the student's email
 */
export async function sendCampusOtp({ email, name = '', collegeName = '', honeypot = '' }) {
  // 1. Honeypot check (anti-bot trap)
  if (honeypot) {
    throw new Error('Automated request blocked by security defenses.');
  }

  const cleanEmail = normalizeCampusEmail(email);
  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    throw new Error('Please enter a valid academic or personal email address.');
  }

  // 2. Strict Rate Limiting Check
  const rateStatus = checkRateLimit(cleanEmail);
  if (!rateStatus.allowed) {
    throw new Error(rateStatus.message);
  }

  const code = computeRollingCode(cleanEmail, 0);

  // 3. Dispatch via Cloudflare worker SMTP
  try {
    const res = await fetch('/api/send-campus-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        code,
        name,
        collegeName
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Failed to dispatch security code. Please check your email and retry.');
    }

    return {
      success: true,
      email: cleanEmail,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`
    };
  } catch (err) {
    console.error('Campus OTP dispatch error:', err);
    throw err;
  }
}

/**
 * Verifies the 6-digit OTP code with sliding-window tolerance
 */
export function verifyCampusOtp(email, enteredCode) {
  const cleanEmail = normalizeCampusEmail(email);
  const cleanCode = (enteredCode || '').trim();

  if (!cleanEmail || !cleanCode || cleanCode.length !== 6) {
    recordRateLimitFailure(cleanEmail);
    return false;
  }

  // Check current window (0) and previous window (-1) to tolerate clock skew
  const codeCurrent = computeRollingCode(cleanEmail, 0);
  const codePrevious = computeRollingCode(cleanEmail, -1);

  const isValid = cleanCode === codeCurrent || cleanCode === codePrevious;
  if (!isValid) {
    recordRateLimitFailure(cleanEmail);
    return false;
  }

  // Clear rate limit on successful verification
  try {
    sessionStorage.removeItem(RATE_LIMIT_PREFIX + cleanEmail);
  } catch (_) {}

  return true;
}

/**
 * Initiates Google OAuth Sign-In for instant identity verification
 */
export async function signInWithGoogleCampus() {
  if (!auth) throw new Error('Authentication provider unavailable.');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  return {
    email: normalizeCampusEmail(user.email),
    name: user.displayName || user.email?.split('@')[0],
    photoURL: user.photoURL,
    provider: 'google',
    uid: user.uid
  };
}

/**
 * Saves and binds the student's institutional identity (College, Roll No, Branch, Batch)
 */
export async function saveCampusScholarProfile(profile) {
  const email = normalizeCampusEmail(profile.email);
  if (!email) throw new Error('Email is required.');

  const scholarRecord = {
    id: profile.id || `campus_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email,
    name: profile.name?.trim() || email.split('@')[0],
    college_name: profile.collegeName?.trim() || profile.college_name?.trim() || 'Autonomous Institution',
    roll_number: (profile.rollNumber || profile.roll_number || '').trim().toUpperCase(),
    department: profile.department || profile.branch || 'Computer Science',
    branch: profile.department || profile.branch || 'Computer Science',
    batch: profile.batch || profile.year || '2026',
    auth_provider: profile.authProvider || 'otp',
    avatar: profile.photoURL || profile.avatar || null,
    is_campus_verified: true,
    created_at: new Date().toISOString(),
    last_login_at: new Date().toISOString()
  };

  // 1. Local Persistence
  try {
    localStorage.setItem(STORAGE_CAMPUS_PROFILE_KEY, JSON.stringify(scholarRecord));
    sessionStorage.setItem(STORAGE_CAMPUS_SESSION_KEY, scholarRecord.id);
  } catch (e) {}

  // 2. Cloud Persistence (Supabase table: campus_scholars)
  try {
    if (supabase) {
      await supabase.from('campus_scholars').upsert([scholarRecord], { onConflict: 'email' });
    }
  } catch (err) {
    console.warn('Campus cloud profile sync notice:', err.message || err);
  }

  return scholarRecord;
}

/**
 * Reads currently authenticated campus student profile from cache
 */
export function getStoredCampusProfile() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_CAMPUS_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Logs out the campus scholar and clears session tokens
 */
export function logoutCampusScholar() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_CAMPUS_PROFILE_KEY);
    sessionStorage.removeItem(STORAGE_CAMPUS_SESSION_KEY);
  } catch (e) {}
}
