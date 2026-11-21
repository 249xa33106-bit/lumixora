// Lumixora Founder Mobile Notification Engine
// Dispatches instant mobile push notifications and telemetry alerts to Founder Shaik Sowban
// Whenever any user or intern registers, signs in, or accesses secure portals.

import { internshipDb } from './internshipDb';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Default private push channel for founder alerts (Powered by ntfy protocol)
const NTFY_TOPIC = import.meta.env.VITE_FOUNDER_ALERT_TOPIC || 'lumixora-founder-alerts-secure';

/**
 * Send an instant notification to the Founder's mobile device
 * @param {Object} payload 
 * @param {'USER_REGISTER' | 'USER_LOGIN' | 'INTERN_LOGIN' | 'GPREC_LOGIN' | 'DELIVERABLE_SUBMIT' | 'PAYMENT'} payload.type
 * @param {string} payload.userName
 * @param {string} payload.userEmail
 * @param {string} [payload.role]
 * @param {string} [payload.college]
 * @param {string} [payload.meta]
 */
export async function notifyFounder({ type, userName, userEmail, role, college, meta }) {
  try {
    const timestampStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

    let title = 'Lumixora Activity Alert';
    let message = '';
    let tags = 'bell';
    let clickUrl = 'https://lumixora.in/';

    switch (type) {
      case 'INTERN_LOGIN':
        title = `Batch 01 Intern Login: ${userName || userEmail}`;
        message = `Intern: ${userName || 'Active Intern'}\nEmail: ${userEmail}\nTrack: ${role || 'Batch 01 Intern'}\nCollege: ${college || 'GPREC'}\nTime: ${timestampStr} (${dateStr})`;
        tags = 'mortarboard,key,zap';
        clickUrl = 'https://lumixora.in/#intern-portal';
        break;

      case 'USER_REGISTER':
        title = `New User Registered: ${userName || userEmail}`;
        message = `New User: ${userName || 'New Scholar'}\nEmail: ${userEmail}\nCollege: ${college || 'N/A'}\nTime: ${timestampStr} (${dateStr})`;
        tags = 'tada,user,sparkles';
        clickUrl = 'https://lumixora.in/#dashboard';
        break;

      case 'USER_LOGIN':
        title = `User Signed In: ${userName || userEmail}`;
        message = `User: ${userName || 'Student'}\nEmail: ${userEmail}\nRole: ${role || 'student'}\nTime: ${timestampStr} (${dateStr})`;
        tags = 'door,wave';
        clickUrl = 'https://lumixora.in/#dashboard';
        break;

      case 'GPREC_LOGIN':
        title = `GPREC Student Login: ${userName || userEmail}`;
        message = `Student: ${userName || 'Scholar'}\nRoll/Email: ${userEmail}\nTime: ${timestampStr} (${dateStr})`;
        tags = 'classical_building,shield';
        clickUrl = 'https://gprec.lumixora.in/';
        break;

      case 'DELIVERABLE_SUBMIT':
        title = `Intern Shipped Deliverable: ${userName}`;
        message = `Intern: ${userName} (${role || 'Intern'})\nMilestone: ${meta || 'Sprint Deliverable'}\nTime: ${timestampStr}`;
        tags = 'rocket,package';
        clickUrl = 'https://lumixora.in/#intern-portal';
        break;

      case 'LEAD_EVALUATION':
        title = `Lead Evaluated: ${userName}`;
        message = `Candidate: ${userName} (${role || 'Intern'})\nEvaluation: ${meta || 'Evaluated'}\nTime: ${timestampStr}`;
        tags = 'star,award,check';
        clickUrl = 'https://lumixora.in/#intern-portal';
        break;

      case 'PAYMENT':
        title = `Fee Payment Received: Rs ${meta || '399'}`;
        message = `User: ${userName}\nEmail: ${userEmail}\nAmount: Rs ${meta || '399'}\nTime: ${timestampStr}`;
        tags = 'moneybag,gem';
        clickUrl = 'https://lumixora.in/#founder-portal';
        break;

      default:
        title = `Lumixora Security Event`;
        message = `${userName || userEmail} performed action: ${type}\nTime: ${timestampStr}`;
        tags = 'bell';
    }

    // Strip non-ASCII characters from HTTP headers to avoid ByteString errors
    const safeHeaderTitle = title.replace(/[^\x00-\x7F]/g, '');

    // 1. Instant Mobile Push Notification via ntfy.sh (Sends directly to founder's phone)
    const ntfyPromise = fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: {
        'Title': safeHeaderTitle,
        'Priority': 'urgent',
        'Tags': tags,
        'Click': clickUrl
      },
      body: message
    }).catch(err => {
      console.warn('[FounderAlert] Push dispatch notice:', err.message);
    });

    // 2. Browser Native Notification (if granted on Founder's device)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/lumixora_logo_icon.png'
        });
      } catch (_) {}
    }

    // 3. Log into Firestore for real-time admin audit trail
    let dbPromise = Promise.resolve();
    if (internshipDb) {
      dbPromise = addDoc(collection(internshipDb, 'founder_mobile_notifications'), {
        type,
        userName: userName || 'Unknown',
        userEmail: userEmail || 'unknown@lumixora.in',
        role: role || 'Student',
        college: college || 'GPREC',
        meta: meta || '',
        createdAt: serverTimestamp(),
        timestampFormatted: `${dateStr} ${timestampStr}`
      }).catch(err => {
        console.warn('[FounderAlert] Firestore log notice:', err.message);
      });
    }

    await Promise.race([
      Promise.all([ntfyPromise, dbPromise]),
      new Promise(resolve => setTimeout(resolve, 2000)) // Non-blocking: max 2s
    ]);

    return { success: true, topic: NTFY_TOPIC };
  } catch (err) {
    console.warn('[FounderNotificationService] Handled notice:', err);
    return { success: false, error: err.message };
  }
}

// ── Specific Named Callers (Backwards-Compatible with AuthPortal.jsx & Other Portals) ──

export async function notifyFounderLogin(userInfo = {}) {
  const isIntern = userInfo.role === 'intern' || userInfo.isIntern || userInfo.id?.startsWith('LMX-B01') || userInfo.roleId;
  return notifyFounder({
    type: isIntern ? 'INTERN_LOGIN' : 'USER_LOGIN',
    userName: userInfo.name || userInfo.fullName || userInfo.displayName || userInfo.email?.split('@')[0],
    userEmail: userInfo.email || userInfo.id,
    role: userInfo.roleTitle || userInfo.role || (isIntern ? 'Intern' : 'Student'),
    college: userInfo.college || 'GPREC',
    meta: userInfo.loginMethod || 'Email/Passcode'
  });
}

export async function notifyFounderRegister(userInfo = {}) {
  return notifyFounder({
    type: 'USER_REGISTER',
    userName: userInfo.name || userInfo.fullName || userInfo.displayName || userInfo.email?.split('@')[0],
    userEmail: userInfo.email,
    role: userInfo.role || 'Student',
    college: userInfo.college || 'GPREC',
    meta: userInfo.branch || ''
  });
}

export async function notifyFounderPayment(paymentInfo = {}) {
  return notifyFounder({
    type: 'PAYMENT',
    userName: paymentInfo.name || paymentInfo.userName || 'Scholar',
    userEmail: paymentInfo.email || paymentInfo.userEmail || '',
    meta: String(paymentInfo.amount || '399')
  });
}

export async function notifyFounderAmbassadorReferral(info = {}) {
  return notifyFounder({
    type: 'USER_REGISTER',
    userName: `${info.name} (Referred by ${info.ambassadorName || 'Ambassador'})`,
    userEmail: info.email || '',
    college: info.college || '',
    meta: `Referral Code: ${info.referralCode || 'CAMPUS'}`
  });
}

export async function recordFounderNotification(info = {}) {
  return notifyFounder({
    type: info.type || 'SECURITY_EVENT',
    userName: info.name || info.userName || 'Unknown',
    userEmail: info.email || info.userEmail || '',
    role: info.role || '',
    meta: info.meta || JSON.stringify(info)
  });
}

export function cleanScholarName(str, email = '') {
  if (str && typeof str === 'string') {
    let cleaned = str.trim();
    if (cleaned.includes('{')) {
      try {
        const parsed = JSON.parse(cleaned.slice(cleaned.indexOf('{')));
        if (parsed.name && parsed.name.trim() && parsed.name.toLowerCase() !== 'scholar') {
          return parsed.name.trim();
        }
      } catch (e) {}
      cleaned = cleaned.split('{')[0].trim();
    }
    cleaned = cleaned.replace(/[{}:;"]/g, '').trim();
    if (cleaned && cleaned.toLowerCase() !== 'scholar') return cleaned;
  }
  if (email && typeof email === 'string') {
    return email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  return 'Scholar';
}

export function checkUtrVerificationStatus(utr) {
  try {
    const raw = localStorage.getItem('lumixora_verified_utrs_v1');
    if (!raw) return { verified: false };
    const list = JSON.parse(raw);
    const match = list.find(item => item.utr === utr);
    return match ? { verified: true, status: match.status } : { verified: false };
  } catch (_) {
    return { verified: false };
  }
}

export function getStoredTestSubmissions() {
  try {
    const raw = localStorage.getItem('lumixora_test_submissions_v1');
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function saveStoredTestSubmissions(submissions) {
  try {
    localStorage.setItem('lumixora_test_submissions_v1', JSON.stringify(submissions || []));
  } catch (_) {}
}

export async function approveFeePayment(utr, details = {}) {
  try {
    const existing = getStoredTestSubmissions();
    const updated = existing.map(item => item.utr === utr ? { ...item, status: 'approved', approvedAt: new Date().toISOString() } : item);
    saveStoredTestSubmissions(updated);
    notifyFounder({
      type: 'PAYMENT',
      userName: details.name || 'Scholar',
      userEmail: details.email || '',
      meta: 'UTR Approved'
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export async function rejectFeePayment(utr, reason = '') {
  try {
    const existing = getStoredTestSubmissions();
    const updated = existing.map(item => item.utr === utr ? { ...item, status: 'rejected', rejectReason: reason } : item);
    saveStoredTestSubmissions(updated);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export async function sendFounderMobileAlert(message, title = 'Lumixora Mobile Alert') {
  return notifyFounder({
    type: 'SECURITY_EVENT',
    userName: title,
    userEmail: 'founder@lumixora.in',
    meta: message
  });
}

export async function notifyFounderAmbassadorApplication(app = {}) {
  return notifyFounder({
    type: 'USER_REGISTER',
    userName: `Ambassador Applicant: ${app.name || app.fullName}`,
    userEmail: app.email,
    college: app.college,
    meta: `Campus Ambassador Application: ${app.year || ''} ${app.branch || ''}`
  });
}

export async function notifyFounderTestSubmission(sub = {}) {
  return notifyFounder({
    type: 'DELIVERABLE_SUBMIT',
    userName: sub.name || sub.userName || 'Scholar',
    userEmail: sub.email || '',
    meta: `Test Completed: ${sub.testTitle || 'Grand Assessment'} (Score: ${sub.score}%)`
  });
}

export function buildAggregatedNotifications() {
  try {
    const raw = localStorage.getItem('lumixora_founder_notifications_log');
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function markNotificationsAsRead() {
  try {
    localStorage.setItem('lumixora_founder_notifications_unread_count', '0');
  } catch (_) {}
}

export function clearNotificationsStorage() {
  try {
    localStorage.removeItem('lumixora_founder_notifications_log');
  } catch (_) {}
}

export function markSingleNotificationRead(id) {
  try {
    const notifs = buildAggregatedNotifications();
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('lumixora_founder_notifications_log', JSON.stringify(updated));
  } catch (_) {}
}

export function dismissSingleNotification(id) {
  try {
    const notifs = buildAggregatedNotifications();
    const updated = notifs.filter(n => n.id !== id);
    localStorage.setItem('lumixora_founder_notifications_log', JSON.stringify(updated));
  } catch (_) {}
}

export function formatNotificationTime(isoStr) {
  if (!isoStr) return 'Just now';
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch (_) {
    return 'Just now';
  }
}

/**
 * Request browser push notification permission on founder's mobile or laptop
 */
export async function requestMobileNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (_) {
    return false;
  }
}
