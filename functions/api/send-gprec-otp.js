/**
 * GPREC Student 5-Minute OTP Verification Endpoint
 * Upgraded to Brevo Transactional Email API Engine with Apple-inspired template & automatic fallback.
 */

import { sendLumixoraEmail, EMAIL_PRIORITY } from './_emailCore.js';
import { renderOtpEmail } from './_emailTemplates.js';

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
    const { rollNumber, email, code } = body;

    if (!rollNumber || !email || !code) {
      return new Response(JSON.stringify({ error: 'Missing required parameters (rollNumber, email, code)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    // Render Apple-inspired responsive HTML & RFC-compliant plaintext
    const { subject, html, textContent } = renderOtpEmail({
      rollNumber,
      code,
      collegeName: 'G. Pulla Reddy Engineering College (Autonomous)',
      expiryMinutes: 5
    });

    const result = await sendLumixoraEmail({
      to: email,
      toName: `Scholar ${rollNumber.toUpperCase()}`,
      subject,
      html,
      textContent,
      senderType: 'security',
      priority: EMAIL_PRIORITY.P1_URGENT_SECURITY,
      tags: ['gprec-otp', 'placement-suite'],
      contextEnv: context.env || {}
    });

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Security verification code dispatched successfully.',
        provider: result.provider,
        messageId: result.messageId
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: result.error || 'Failed to dispatch verification code.'
      }), {
        status: result.quotaExceeded ? 429 : 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Server error processing OTP request'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }
}
