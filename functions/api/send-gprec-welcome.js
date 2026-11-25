/**
 * Official GPREC Placement Suite Welcome & Onboarding Dispatch Endpoint
 * Upgraded to Brevo Transactional Email API Engine with Apple-inspired template & automatic fallback.
 */

import { sendLumixoraEmail, EMAIL_PRIORITY } from './_emailCore.js';
import { renderWelcomeEmail } from './_emailTemplates.js';

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
    const { rollNumber, email, name, department } = body;

    if (!rollNumber || !email) {
      return new Response(JSON.stringify({ error: 'Missing required parameters (rollNumber, email)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    const { subject, html, textContent } = renderWelcomeEmail({
      name: name || 'GPREC Scholar',
      rollNumber,
      department: department || 'Engineering',
      collegeName: 'G. Pulla Reddy Engineering College (Autonomous)',
      portalUrl: 'https://gprec.lumixora.in'
    });

    const result = await sendLumixoraEmail({
      to: email,
      toName: name || `Scholar ${rollNumber.toUpperCase()}`,
      subject,
      html,
      textContent,
      senderType: 'welcome',
      priority: EMAIL_PRIORITY.P2_TRANSACTIONAL,
      tags: ['gprec-welcome', 'placement-clearance'],
      contextEnv: context.env || {}
    });

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Welcome email dispatched successfully.',
        provider: result.provider,
        messageId: result.messageId
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: result.error || 'Failed to dispatch welcome email.'
      }), {
        status: result.quotaExceeded ? 429 : 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Server error processing welcome email request'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }
}
