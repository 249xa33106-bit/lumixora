/**
 * Lumixora Centralized Client Email Service
 * Interfaces with /api/send-email, /api/email-telemetry, and manages offline queue & deliverability.
 */

import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, setDoc, query, orderBy, limit } from 'firebase/firestore';

const QUEUE_STORAGE_KEY = 'lumixora_offline_email_queue_v1';
const SUPPRESSION_STORAGE_KEY = 'lumixora_email_suppression_v1';

/**
 * Reads suppressed emails locally
 */
export function getLocalSuppressedEmails() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SUPPRESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Saves suppressed email locally
 */
export function addLocalSuppressedEmail(email, reason = 'user_unsubscribe') {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalSuppressedEmails();
    const clean = String(email).trim().toLowerCase();
    if (clean && !current.some(c => c.email === clean)) {
      current.push({ email: clean, reason, date: new Date().toISOString() });
      localStorage.setItem(SUPPRESSION_STORAGE_KEY, JSON.stringify(current));
    }
  } catch (e) {}
}

/**
 * Reads offline queued emails
 */
export function getOfflineQueuedEmails() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Queues an email for later retry
 */
export function enqueueEmail(payload) {
  if (typeof window === 'undefined') return;
  try {
    const queue = getOfflineQueuedEmails();
    // Guard: Do not queue OTPs that will expire
    if (payload.templateKey === 'otp_verification' || payload.priority === 'P1_URGENT_SECURITY') {
      console.warn('Security OTPs are time-sensitive and cannot be delayed in queue.');
      return;
    }

    queue.push({
      id: 'q_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      queuedAt: Date.now(),
      attempts: 0,
      payload
    });

    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue.slice(-50)));
  } catch (e) {}
}

/**
 * Flushes eligible queued emails when back online
 */
export async function flushEmailQueue() {
  if (typeof window === 'undefined' || !navigator.onLine) return;
  const queue = getOfflineQueuedEmails();
  if (queue.length === 0) return;

  const remaining = [];
  for (const item of queue) {
    const ageMinutes = (Date.now() - item.queuedAt) / (1000 * 60);
    // Discard any queue item older than 24 hours
    if (ageMinutes > 1440) continue;

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload)
      });
      if (!res.ok) {
        item.attempts = (item.attempts || 0) + 1;
        if (item.attempts < 3) remaining.push(item);
      }
    } catch (e) {
      item.attempts = (item.attempts || 0) + 1;
      if (item.attempts < 3) remaining.push(item);
    }
  }

  localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(remaining));
}

// Auto-flush on online event
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushEmailQueue().catch(() => {});
  });
}

/**
 * Core Universal Dispatcher
 */
export async function sendEmail({
  to,
  toName = '',
  templateKey,
  templateData = {},
  customSubject,
  customHtml,
  customText,
  senderType = 'security',
  priority = 'P1_URGENT_SECURITY',
  isPromotional = false
}) {
  const cleanTo = String(to).trim().toLowerCase();
  if (!cleanTo || !cleanTo.includes('@')) {
    throw new Error('Please specify a valid recipient email.');
  }

  // Check local suppression
  const suppressed = getLocalSuppressedEmails();
  if (suppressed.some(s => s.email === cleanTo)) {
    return {
      success: false,
      suppressed: true,
      error: 'Recipient has unsubscribed or previously bounced.'
    };
  }

  const payload = {
    to: cleanTo,
    toName,
    templateKey,
    templateData,
    customSubject,
    customHtml,
    customText,
    senderType,
    priority,
    isPromotional
  };

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      // Record telemetry in Firestore if db is active
      try {
        if (db) {
          const col = collection(db, 'lumixora_email_telemetry');
          await addDoc(col, {
            to: cleanTo,
            templateKey: templateKey || 'custom',
            senderType,
            priority,
            provider: data.provider || 'Brevo API v3',
            messageId: data.messageId || 'unknown',
            sentAt: new Date().toISOString()
          });
        }
      } catch (err) {}

      return {
        success: true,
        provider: data.provider,
        messageId: data.messageId,
        message: 'Email delivered successfully.'
      };
    } else {
      if (res.status === 429 || data.quotaExceeded) {
        enqueueEmail(payload);
        return {
          success: false,
          quotaExceeded: true,
          queued: true,
          error: data.error || 'Daily sending limit reached (300/day). Queued for next delivery window.'
        };
      }
      return {
        success: false,
        error: data.error || 'Failed to dispatch email.'
      };
    }
  } catch (err) {
    if (!navigator.onLine) {
      enqueueEmail(payload);
      return {
        success: false,
        offline: true,
        queued: true,
        error: 'Network offline. Email queued for automatic dispatch upon reconnection.'
      };
    }
    return {
      success: false,
      error: err.message || 'Network error dispatching email'
    };
  }
}

/**
 * 1. Send OTP Verification Code
 */
export async function sendOtpVerificationEmail({ to, rollNumber, code, collegeName }) {
  return sendEmail({
    to,
    toName: `Scholar ${(rollNumber || '').toUpperCase()}`,
    templateKey: 'otp_verification',
    templateData: {
      rollNumber,
      code,
      collegeName: collegeName || 'G. Pulla Reddy Engineering College',
      expiryMinutes: 5
    },
    senderType: 'security',
    priority: 'P1_URGENT_SECURITY'
  });
}

/**
 * 2. Send Scholar Welcome Email
 */
export async function sendScholarWelcomeEmail({ to, name, rollNumber, department, collegeName, portalUrl }) {
  return sendEmail({
    to,
    toName: name || 'Scholar',
    templateKey: 'welcome_scholar',
    templateData: {
      name,
      rollNumber,
      department,
      collegeName,
      portalUrl: portalUrl || 'https://gprec.lumixora.in'
    },
    senderType: 'welcome',
    priority: 'P2_TRANSACTIONAL'
  });
}

/**
 * 3. Send Placement Opportunity Notification
 */
export async function sendPlacementDriveEmail({ to, name, company, ctc, roleTitle, driveDate, deadline, driveUrl, eligibility }) {
  return sendEmail({
    to,
    toName: name || 'Scholar',
    templateKey: 'placement_opportunity',
    templateData: {
      name,
      company,
      ctc,
      roleTitle,
      driveDate,
      deadline,
      driveUrl,
      eligibility
    },
    senderType: 'careers',
    priority: 'P3_ANNOUNCEMENT',
    isPromotional: true
  });
}

/**
 * 4. Send Certificate Credential
 */
export async function sendCertificateCredentialEmail({ to, name, certificateTitle, certificateId, issueDate, verificationUrl }) {
  return sendEmail({
    to,
    toName: name || 'Scholar',
    templateKey: 'certificate_delivery',
    templateData: {
      name,
      certificateTitle,
      certificateId,
      issueDate,
      verificationUrl
    },
    senderType: 'certificates',
    priority: 'P2_TRANSACTIONAL'
  });
}

/**
 * 5. Send Internship Passcode
 */
export async function sendInternPasscodeEmail({ to, name, roleTitle, internId, passcode, accessPin }) {
  return sendEmail({
    to,
    toName: name || 'Intern',
    templateKey: 'internship_passcode',
    templateData: {
      name,
      roleTitle,
      internId,
      passcode,
      accessPin
    },
    senderType: 'careers',
    priority: 'P1_URGENT_SECURITY'
  });
}

/**
 * 6. Send Academic Announcement
 */
export async function sendPlatformAnnouncementEmail({ to, name, titleText, bodyMarkdown, actionUrl, actionText }) {
  return sendEmail({
    to,
    toName: name || 'Scholar',
    templateKey: 'platform_announcement',
    templateData: {
      name,
      titleText,
      bodyMarkdown,
      actionUrl,
      actionText
    },
    senderType: 'notifications',
    priority: 'P3_ANNOUNCEMENT',
    isPromotional: true
  });
}

/**
 * 7. Fetch Live Email Telemetry & DNS Diagnostics
 */
export async function fetchEmailTelemetry() {
  try {
    const res = await fetch('/api/email-telemetry');
    if (!res.ok) throw new Error('Failed to load telemetry API');
    return await res.json();
  } catch (err) {
    // Return sensible fallback structure if offline / direct dev
    return {
      telemetry: {
        date: new Date().toISOString().slice(0, 10),
        dailyLimit: 300,
        sentToday: 0,
        remainingToday: 300,
        securityBuffer: 50,
        deliveredCount: 0,
        failedCount: 0,
        bouncedCount: 0,
        suppressionCount: getLocalSuppressedEmails().length,
        estimatedMonthlyCost: '₹0.00 (Brevo Free Tier)',
        recentLogs: []
      },
      provider: 'Direct SMTP / Brevo API',
      hasBrevoKey: false,
      dnsRecords: [
        {
          type: 'TXT',
          host: '@ (or lumixora.in)',
          value: 'v=spf1 include:spf.brevo.com ~all',
          purpose: 'SPF (Sender Policy Framework)',
          status: 'Required for Deliverability'
        },
        {
          type: 'TXT',
          host: 'mail._domainkey',
          value: 'k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...',
          purpose: 'DKIM Cryptographic Signature',
          status: 'Required for Authenticity'
        },
        {
          type: 'TXT',
          host: '_dmarc',
          value: 'v=DMARC1; p=none; sp=none; rua=mailto:support@lumixora.in; pct=100; aspf=r;',
          purpose: 'DMARC Enforcement Policy',
          status: 'Active Policy Recommended'
        }
      ],
      senderIdentities: [
        { identity: 'welcome@lumixora.in', name: 'Lumixora Welcome' },
        { identity: 'support@lumixora.in', name: 'Lumixora Support' },
        { identity: 'notifications@lumixora.in', name: 'Lumixora Notifications' },
        { identity: 'careers@lumixora.in', name: 'Lumixora Careers & Placements' },
        { identity: 'certificates@lumixora.in', name: 'Lumixora Credentials' },
        { identity: 'security@lumixora.in', name: 'Lumixora Security' }
      ],
      pricing: {
        plan: 'Brevo Free Tier',
        monthlyCost: '₹0.00 / month',
        dailyLimit: 300,
        quotaUsedToday: 0,
        quotaRemainingToday: 300
      }
    };
  }
}
