/**
 * Universal Email Dispatch Endpoint: POST /api/send-email
 * Cloudflare Pages Function
 */

import { sendLumixoraEmail, EMAIL_PRIORITY } from './_emailCore.js';
import { 
  renderOtpEmail, 
  renderWelcomeEmail, 
  renderPasswordResetEmail, 
  renderPlacementAlertEmail, 
  renderCertificateEmail, 
  renderInternshipPasscodeEmail, 
  renderAnnouncementEmail, 
  renderSecurityAlertEmail 
} from './_emailTemplates.js';

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
    const { 
      to, 
      toName, 
      templateKey, 
      templateData = {}, 
      customSubject, 
      customHtml, 
      customText,
      senderType = 'security', 
      priority = EMAIL_PRIORITY.P1_URGENT_SECURITY,
      isPromotional = false
    } = body;

    if (!to) {
      return new Response(JSON.stringify({ error: 'Recipient email ("to") is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    let resolvedSubject = customSubject || 'Notification from Lumixora';
    let resolvedHtml = customHtml || '';
    let resolvedText = customText || '';

    // If templateKey is provided, render using official Apple-inspired templates
    if (templateKey) {
      switch (templateKey) {
        case 'otp_verification': {
          const rendered = renderOtpEmail(templateData);
          resolvedSubject = customSubject || rendered.subject;
          resolvedHtml = rendered.html;
          resolvedText = rendered.textContent;
          break;
        }
        case 'welcome_scholar': {
          const rendered = renderWelcomeEmail(templateData);
          resolvedSubject = customSubject || rendered.subject;
          resolvedHtml = rendered.html;
          resolvedText = rendered.textContent;
          break;
        }
        case 'password_reset': {
          const rendered = renderPasswordResetEmail(templateData);
          resolvedSubject = customSubject || rendered.subject;
          resolvedHtml = rendered.html;
          resolvedText = rendered.textContent;
          break;
        }
        case 'placement_opportunity': {
          const rendered = renderPlacementAlertEmail(templateData);
          resolvedSubject = customSubject || rendered.subject;
          resolvedHtml = rendered.html;
          resolvedText = rendered.textContent;
          break;
        }
        case 'certificate_delivery': {
          const rendered = renderCertificateEmail(templateData);
          resolvedSubject = customSubject || rendered.subject;
          resolvedHtml = rendered.html;
          resolvedText = rendered.textContent;
          break;
        }
        case 'internship_passcode': {
          const rendered = renderInternshipPasscodeEmail(templateData);
          resolvedSubject = customSubject || rendered.subject;
          resolvedHtml = rendered.html;
          resolvedText = rendered.textContent;
          break;
        }
        case 'platform_announcement': {
          const rendered = renderAnnouncementEmail({ ...templateData, recipientEmail: to });
          resolvedSubject = customSubject || rendered.subject;
          resolvedHtml = rendered.html;
          resolvedText = rendered.textContent;
          break;
        }
        case 'admin_security_alert': {
          const rendered = renderSecurityAlertEmail(templateData);
          resolvedSubject = customSubject || rendered.subject;
          resolvedHtml = rendered.html;
          resolvedText = rendered.textContent;
          break;
        }
        default:
          break;
      }
    }

    if (!resolvedHtml) {
      resolvedHtml = `<div style="font-family: sans-serif; padding: 24px; color: #0F172A;">${resolvedText || 'Lumixora Notification'}</div>`;
    }

    const result = await sendLumixoraEmail({
      to,
      toName,
      subject: resolvedSubject,
      html: resolvedHtml,
      textContent: resolvedText,
      senderType,
      priority,
      isPromotional,
      tags: [templateKey || 'transactional'],
      contextEnv: context.env || {}
    });

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : (result.quotaExceeded ? 429 : 400),
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Server error dispatching email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }
}
