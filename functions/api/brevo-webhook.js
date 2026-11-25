/**
 * Brevo Event Webhook Endpoint: POST /api/brevo-webhook
 * Cloudflare Pages Function
 * Ingests real-time delivery telemetry (delivered, bounce, spam, unsubscribe)
 */

import { suppressEmail } from './_emailCore.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Brevo-Signature',
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
    const payload = await context.request.json().catch(() => ({}));
    const event = payload.event || payload['event-type'];
    const email = payload.email || payload.recipient;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email in webhook payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    // Handle Event Types
    switch (event) {
      case 'hard_bounce':
      case 'soft_bounce':
        suppressEmail(email, 'bounce');
        break;
      case 'spam':
      case 'complaint':
        suppressEmail(email, 'spam_complaint');
        break;
      case 'unsubscribed':
      case 'unsubscribe':
        suppressEmail(email, 'unsubscribed');
        break;
      case 'delivered':
      case 'opened':
      case 'click':
      default:
        break;
    }

    return new Response(JSON.stringify({
      received: true,
      event,
      email,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Webhook processing error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }
}
