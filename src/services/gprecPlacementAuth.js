/**
 * gprecPlacementAuth.js
 * Time-based Rolling 6-digit OTP (changes every 5 minutes / 300 seconds)
 * Dispatches via Cloudflare Worker SMTP using lumixora.team@gmail.com
 */

import { supabase } from '../config/supabase';

// Approved GPREC Roll Numbers for the placement pilot (STRICT)
export const GPREC_ALLOWED_ROLL_NUMBERS = [
  '249xa33106',
  '249xa33112',
  '249xa33096',
  '249xa33091'
];

export const PLACEMENT_SUPPORT_EMAIL = 'lumixora.team@gmail.com';

/**
 * Normalizes input roll number to lowercase trimmed string
 */
export function normalizeRollNumber(input = '') {
  if (!input || typeof input !== 'string') return '';
  return input.trim().toLowerCase().replace(/\s+/g, '');
}

/**
 * Validates if the given roll number is approved for the GPREC Placement Suite.
 */
export function isAllowedGprecRoll(rollNumber = '') {
  const normalized = normalizeRollNumber(rollNumber);
  if (!normalized) return false;
  return GPREC_ALLOWED_ROLL_NUMBERS.includes(normalized);
}

/**
 * Resolves the institutional email address from roll number
 */
export function getGprecEmailFromRoll(rollNumber = '') {
  const normalized = normalizeRollNumber(rollNumber);
  if (!normalized) return '';
  return `${normalized}@gprec.ac.in`;
}

/**
 * Generates a rolling 6-digit OTP that changes every 5 minutes (300,000 ms).
 * @param {string} rollNumber 
 * @param {number} timeOffsetStep - 0 for current 5-min window, -1 for previous window (grace period)
 */
export function getRolling5MinOtp(rollNumber = '', timeOffsetStep = 0) {
  const normalized = normalizeRollNumber(rollNumber);
  if (!normalized) return '000000';

  // 5 minutes in milliseconds = 300,000
  const STEP_MS = 5 * 60 * 1000;
  const currentStep = Math.floor(Date.now() / STEP_MS) + timeOffsetStep;

  const salt = `GPREC_5MIN_${normalized}_${currentStep}`;
  let hash = 0;
  for (let i = 0; i < salt.length; i++) {
    hash = ((hash << 5) - hash) + salt.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 900000 + 100000).toString();
}

/**
 * Sends rolling 5-minute OTP email directly from lumixora.team@gmail.com
 */
export async function sendGprecPlacementOtp(rollNumber) {
  const normalized = normalizeRollNumber(rollNumber);
  if (!isAllowedGprecRoll(normalized)) {
    throw new Error(`Roll number not in active cohort. Contact ${PLACEMENT_SUPPORT_EMAIL} for placement access.`);
  }

  const email = getGprecEmailFromRoll(normalized);
  const otpCode = getRolling5MinOtp(normalized, 0); // Fresh code for this 5-minute window

  // Dispatch via lumixora.team@gmail.com
  try {
    const res = await fetch('/api/send-gprec-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rollNumber: normalized,
        email,
        code: otpCode
      })
    });
    const result = await res.json().catch(() => ({}));
    if (res.ok) {
      return { success: true, email, code: otpCode };
    } else {
      console.warn('API send notice:', result.error);
    }
  } catch (err) {
    console.warn('Direct mail dispatch notice:', err);
  }

  return { 
    success: true, 
    email, 
    code: otpCode 
  };
}

/**
 * Verifies code against current 5-minute window or previous window (grace period for network/clock skew)
 */
export async function verifyGprecPlacementOtp(rollNumber, token) {
  const normalized = normalizeRollNumber(rollNumber);
  if (!isAllowedGprecRoll(normalized)) {
    throw new Error(`Unauthorized roll number. Contact ${PLACEMENT_SUPPORT_EMAIL}`);
  }

  const email = getGprecEmailFromRoll(normalized);
  const cleanToken = (token || '').trim();

  if (!cleanToken || cleanToken.length < 6) {
    throw new Error('Please enter the 6-digit OTP code.');
  }

  // Current 5-min window code & previous window code (grace period)
  const currentCode = getRolling5MinOtp(normalized, 0);
  const previousCode = getRolling5MinOtp(normalized, -1);

  const isValid = cleanToken === currentCode || cleanToken === previousCode;

  if (!isValid) {
    throw new Error('Invalid or expired OTP. The code expires every 5 minutes. Please request a new code.');
  }

  const rollUpper = normalized.toUpperCase();
  const scholarName = `GPREC Scholar (${rollUpper})`;

  // Construct verified user object (zero fee check, fully unlocked)
  const userProfile = {
    id: `gprec_${normalized}`,
    uid: `gprec_${normalized}`,
    email,
    name: scholarName,
    displayName: scholarName,
    rollNumber: rollUpper,
    role: 'student',
    college: 'G. Pulla Reddy Engineering College (Autonomous)',
    collegeCode: 'GPREC',
    department: 'CSM',
    emailVerified: true,
    is_approved: true,
    isApproved: true,
    oneTimeFeePaid: true, // 100% exempt - covered by institutional license
    isGprecPlacementVerified: true
  };

  return userProfile;
}
