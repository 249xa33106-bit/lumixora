// Authentication & Account Security Verification Utilities
// Ensures strict enforcement for blocked users and unapproved faculty registrations

export const isFounderEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const lower = email.toLowerCase().trim();
  return lower === 'founder@lumixora.com' || 
         lower === '249xa33106@gmail.com' || 
         lower === '249xa33106@gprec.ac.in';
};

export const cleanScholarName = (str, fallback = 'Scholar') => {
  if (!str || typeof str !== 'string') return fallback;
  let cleaned = str;
  if (cleaned.includes('{')) cleaned = cleaned.split('{')[0].trim();
  cleaned = cleaned.replace(/[{}":;]/g, '').trim();
  return cleaned || fallback;
};

/**
 * Validates whether an authenticated user object is permitted to access the platform.
 * Enforces:
 * 1. Founder accounts always bypass restrictions.
 * 2. Explicitly blocked or deleted accounts are rejected immediately.
 * 3. Accounts with is_approved === false or isApproved === false are REJECTED.
 * 4. Faculty / Mentor accounts whose is_approved !== true are LOCKED pending Founder approval.
 * 5. Non-institutional personal accounts require explicit Founder approval.
 * 
 * @param {object} u - User profile object from Supabase, Firebase, or LocalStorage
 * @returns {{ allowed: boolean, reason?: string, message?: string, isFounder?: boolean }}
 */
export const checkUserAccessStatus = (u) => {
  if (!u) return { allowed: false, reason: 'no_user', message: 'No active session found.' };

  const email = (u.email || '').toLowerCase().trim();
  const isFounder = u.role === 'founder' || isFounderEmail(email);
  if (isFounder) return { allowed: true, isFounder: true };

  // 1. Explicitly Blocked, Suspended, or Deleted
  const isBlocked = u.is_blocked === true || 
                    u.is_blocked === 'true' || 
                    u.is_blocked === 1 || 
                    u.isBlocked === true || 
                    u.isBlocked === 'true' || 
                    u.is_deleted === true || 
                    u.is_deleted === 'true' || 
                    u.isDeleted === true ||
                    u.status === 'blocked' ||
                    u.blocked === true;
                    
  if (isBlocked) {
    return {
      allowed: false,
      reason: 'blocked',
      message: 'Account Suspended: Your access has been locked or suspended by the Founder/Security Administrator.'
    };
  }

  // 2. Explicitly Unapproved / Revoked Check
  if (u.is_approved === false || u.isApproved === false) {
    return {
      allowed: false,
      reason: 'unapproved',
      message: 'Access Restricted: Your account access has been revoked or requires Founder authorization.'
    };
  }

  // 3. Faculty / Mentor Pending Approval Check
  const isFaculty = u.role === 'faculty' || 
                    u.role === 'mentor' || 
                    u.role === 'teacher' || 
                    u.mode === 'faculty' || 
                    !!u.designation;
                    
  const isApproved = u.isApproved === true || u.is_approved === true;

  if (isFaculty && !isApproved) {
    return {
      allowed: false,
      reason: 'faculty_pending',
      message: 'Faculty Access Locked: Your account is pending Founder approval. Access will be activated once approved in the Founder Security Approval Queue.'
    };
  }

  // 4. Institutional Domain Enforcement & Intern Role Check
  // Personal email domains (@gmail.com, @yahoo.com, etc.) are strictly disallowed unless explicitly approved by Founder or registered as Intern
  const isTeammate = u.role === 'teammate' || u.role === 'team' || email.endsWith('@lumixora.com') || email.endsWith('@lumixora.in');
  const isInstitutional = email.endsWith('@gprec.ac.in') || email.includes('.ac.in') || email.includes('.edu');
  const isIntern = u.role === 'intern' || email.includes('.intern@') || email.includes('intern@');

  if (!isTeammate && !isInstitutional && !isIntern && !isApproved) {
    return {
      allowed: false,
      reason: 'unauthorized_domain',
      message: 'Access Restricted: Non-institutional personal accounts require explicit Founder approval.'
    };
  }

  return { allowed: true };
};
