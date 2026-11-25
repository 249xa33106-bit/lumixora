/**
 * Email Telemetry & DNS Diagnostics API: GET /api/email-telemetry
 * Cloudflare Pages Function
 */

import { getEmailTelemetryState } from './_emailCore.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function onRequestGet(context) {
  try {
    const telemetry = getEmailTelemetryState();
    const hasBrevoKey = !!(context.env?.BREVO_API_KEY || context.env?.VITE_BREVO_API_KEY);

    // Official DNS Records for lumixora.in on Brevo
    const dnsRecords = [
      {
        type: 'TXT',
        host: '@ (or lumixora.in)',
        value: 'v=spf1 include:spf.brevo.com ~all',
        purpose: 'SPF (Sender Policy Framework) Alignment',
        status: 'Required for Deliverability',
        notes: 'Authorizes Brevo mail servers to deliver on behalf of lumixora.in. If you already have an SPF record, append `include:spf.brevo.com` before `~all`.'
      },
      {
        type: 'TXT',
        host: 'mail._domainkey',
        value: 'k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDeMkWByGxit4ArAhUkGoVYAUsoDHT6Jn+JuMzUMg...',
        purpose: 'DKIM (DomainKeys Identified Mail) Cryptographic Signature',
        status: 'Obtain exact key from Brevo Senders & IP dashboard',
        notes: 'Provides cryptographic proof that outgoing emails genuinely originated from Lumixora and were not tampered in transit.'
      },
      {
        type: 'TXT',
        host: '_dmarc',
        value: 'v=DMARC1; p=none; sp=none; rua=mailto:support@lumixora.in; pct=100; aspf=r;',
        purpose: 'DMARC (Domain-based Message Authentication, Reporting & Conformance)',
        status: 'Active Policy Recommended',
        notes: 'Mandatory standard enforced by Google & Yahoo since 2024 to prevent domain spoofing and guarantee inboxing.'
      },
      {
        type: 'TXT',
        host: 'brevo-code (or @)',
        value: 'Generated during Brevo Domain Verification (e.g. brevo-code: abc123xyz)',
        purpose: 'Brevo Domain Ownership Verification',
        status: 'One-Time Verification',
        notes: 'Proves ownership of lumixora.in in the Brevo console.'
      }
    ];

    const senderIdentities = [
      { identity: 'welcome@lumixora.in', name: 'Lumixora Welcome', purpose: 'Student Onboarding & Registration' },
      { identity: 'support@lumixora.in', name: 'Lumixora Support', purpose: 'Helpdesk & Institutional Inquiries' },
      { identity: 'notifications@lumixora.in', name: 'Lumixora Notifications', purpose: 'Campus Alerts & System Announcements' },
      { identity: 'careers@lumixora.in', name: 'Lumixora Careers & Placements', purpose: 'Recruitment Drives & Internships' },
      { identity: 'certificates@lumixora.in', name: 'Lumixora Credentials', purpose: 'Proof-of-Skill Certificate Delivery' },
      { identity: 'security@lumixora.in', name: 'Lumixora Security', purpose: 'High-Priority 5-Min Rolling OTPs & Password Resets' }
    ];

    return new Response(JSON.stringify({
      telemetry,
      provider: hasBrevoKey ? 'Brevo Transactional API (Active)' : 'Direct SMTP Socket (Pending BREVO_API_KEY)',
      hasBrevoKey,
      dnsRecords,
      senderIdentities,
      pricing: {
        plan: 'Brevo Free Tier',
        monthlyCost: '₹0.00 / month',
        dailyLimit: 300,
        quotaUsedToday: telemetry.sentToday,
        quotaRemainingToday: telemetry.remainingToday
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Error fetching telemetry' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }
}
