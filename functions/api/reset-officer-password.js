/**
 * Placement Officer / Dean Password Reset & Verification Endpoint
 * Upgraded to Brevo Transactional Email API Engine with Apple-inspired template & automatic fallback.
 */

import { sendLumixoraEmail, EMAIL_PRIORITY } from './_emailCore.js';
import { renderPasswordResetEmail } from './_emailTemplates.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json().catch(() => ({}));
    const { email, code } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Verify authorized dean / officer email
    if (cleanEmail !== 'dean.placements@gprec.ac.in') {
      return new Response(JSON.stringify({ error: 'This recovery flow is only for authorized Placement Officers.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    if (!code) {
      return new Response(JSON.stringify({ error: 'Missing reset verification code' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    const { subject, html, textContent } = renderPasswordResetEmail({
      email: cleanEmail,
      code,
      role: 'Dean / Corporate Relations & Placements (GPREC)'
    });

    const result = await sendLumixoraEmail({
      to: cleanEmail,
      toName: 'Dean Placements',
      subject,
      html,
      textContent,
      senderType: 'security',
      priority: EMAIL_PRIORITY.P1_URGENT_SECURITY,
      tags: ['officer-reset', 'security'],
      contextEnv: context.env || {}
    });

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Password reset authorization code dispatched.',
        provider: result.provider,
        messageId: result.messageId
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: result.error || 'Failed to dispatch reset code.'
      }), {
        status: result.quotaExceeded ? 429 : 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Server error processing password reset'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }
}
