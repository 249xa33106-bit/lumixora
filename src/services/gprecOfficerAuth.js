/**
 * gprecOfficerAuth.js
 * Authentication & Password Management for Placement Officer (Dean) & T&P Faculty
 */

export const GPREC_OFFICER_CONFIG = {
  deanEmail: 'dean.placements@gprec.ac.in',
  defaultPassword: 'Lumi@2026',
  storageKey: 'gprec_officer_pwd_hash',
  resetCodeKey: 'gprec_officer_reset_code'
};

/**
 * Gets currently saved password (or fallback to Lumi@2026)
 */
export function getSavedOfficerPassword() {
  if (typeof window === 'undefined') return GPREC_OFFICER_CONFIG.defaultPassword;
  try {
    const saved = localStorage.getItem(GPREC_OFFICER_CONFIG.storageKey);
    return saved || GPREC_OFFICER_CONFIG.defaultPassword;
  } catch (e) {
    return GPREC_OFFICER_CONFIG.defaultPassword;
  }
}

/**
 * Validates officer login credentials
 */
export function authenticatePlacementOfficer(email, password) {
  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanPwd = (password || '').trim();

  if (cleanEmail !== GPREC_OFFICER_CONFIG.deanEmail) {
    throw new Error(`Unauthorized. Only official Dean Placements (${GPREC_OFFICER_CONFIG.deanEmail}) can access this portal.`);
  }

  const validPassword = getSavedOfficerPassword();
  if (cleanPwd !== validPassword) {
    throw new Error('Incorrect password. Please verify your credentials or click "Forgot Password" to reset.');
  }

  return {
    id: 'gprec_dean_placements',
    uid: 'gprec_dean_placements',
    name: 'Dean of Placements & Training (GPREC)',
    displayName: 'Dean Placements',
    email: cleanEmail,
    role: 'faculty', // Grants full access to faculty/placement suite and student monitoring
    isOfficer: true,
    isDean: true,
    college: 'G. Pulla Reddy Engineering College (Autonomous)',
    collegeCode: 'GPREC',
    department: 'T&P Cell',
    designation: 'Dean - Corporate Relations & Placements',
    emailVerified: true,
    is_approved: true,
    isApproved: true,
    oneTimeFeePaid: true
  };
}

/**
 * Dispatches 6-digit password reset code to dean.placements@gprec.ac.in
 */
export async function sendOfficerPasswordResetCode(email) {
  const cleanEmail = (email || '').toLowerCase().trim();
  if (cleanEmail !== GPREC_OFFICER_CONFIG.deanEmail) {
    throw new Error(`Invalid recovery email. Only ${GPREC_OFFICER_CONFIG.deanEmail} is registered.`);
  }

  // Generate random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Save in local storage with 10-minute expiry
  const payload = {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000
  };
  localStorage.setItem(GPREC_OFFICER_CONFIG.resetCodeKey, JSON.stringify(payload));

  // Dispatch via Cloudflare Function
  const res = await fetch('/api/reset-officer-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: cleanEmail,
      code
    })
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to dispatch reset code.');
  }

  return { success: true, email: cleanEmail };
}

/**
 * Verifies code and saves the new password
 */
export function verifyAndResetOfficerPassword(code, newPassword) {
  const cleanCode = (code || '').trim();
  const cleanPwd = (newPassword || '').trim();

  if (!cleanPwd || cleanPwd.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const raw = localStorage.getItem(GPREC_OFFICER_CONFIG.resetCodeKey);
  if (!raw) {
    throw new Error('No password reset request found. Please request a new code.');
  }

  try {
    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiresAt) {
      throw new Error('Verification code has expired. Please request a new code.');
    }
    if (parsed.code !== cleanCode) {
      throw new Error('Incorrect verification code. Please check your email.');
    }

    // Save updated password
    localStorage.setItem(GPREC_OFFICER_CONFIG.storageKey, cleanPwd);
    localStorage.removeItem(GPREC_OFFICER_CONFIG.resetCodeKey);
    return { success: true };
  } catch (err) {
    throw new Error(err.message || 'Verification failed.');
  }
}
