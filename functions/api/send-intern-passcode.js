/**
 * Lumixora Intern & Workspace Security Passcode Dispatch Endpoint
 * Upgraded to Brevo Transactional Email API Engine with Apple-inspired template & automatic fallback.
 */

import { sendLumixoraEmail, EMAIL_PRIORITY } from './_emailCore.js';
import { renderInternshipPasscodeEmail } from './_emailTemplates.js';

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
    const { email, name, internId, roleTitle, passcode, accessPin } = body;

    if (!email || !passcode) {
      return new Response(JSON.stringify({ error: 'Missing required parameters (email, passcode)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    const { subject, html, textContent } = renderInternshipPasscodeEmail({
      name: name || 'Intern',
      roleTitle: roleTitle || 'Product Engineering',
      internId: internId || 'LMX-INT-2026',
      passcode,
      accessPin
    });

    const result = await sendLumixoraEmail({
      to: email,
      toName: name || 'Intern',
      subject,
      html,
      textContent,
      senderType: 'careers',
      priority: EMAIL_PRIORITY.P1_URGENT_SECURITY,
      tags: ['intern-passcode', 'workspace-access'],
      contextEnv: context.env || {}
    });

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Passcode sent successfully.',
        provider: result.provider,
        messageId: result.messageId
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: result.error || 'Failed to dispatch passcode email.'
      }), {
        status: result.quotaExceeded ? 429 : 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Server error processing intern passcode'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }
}
