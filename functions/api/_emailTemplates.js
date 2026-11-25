/**
 * Lumixora Professional Apple-Inspired Email Templates Engine
 * Pure semantic HTML + CSS tables for bulletproof rendering in Gmail, Outlook, Apple Mail, and Institutional Clients.
 * Generates both responsive HTML and clean textContent for strict spam score compliance.
 */

const LUMIXORA_ASSETS = {
  logoUrl: 'https://lumixora.in/lumixora-emblem-tight.png',
  websiteUrl: 'https://lumixora.in',
  portalUrl: 'https://gprec.lumixora.in',
  brandName: 'Lumixora',
  brandParent: 'Vyomra',
  supportEmail: 'support@lumixora.in',
  complianceAddress: 'Lumixora Campus Technology, Kurnool, Andhra Pradesh 518002, India'
};

/**
 * Universal Master Email Shell (Apple-inspired clean aesthetic)
 */
function buildMasterShell({ title, preheader, bodyHtml, senderIdentity, isPromotional = false, unsubscribeEmail = '' }) {
  const unsubscribeSection = isPromotional
    ? `
      <tr>
        <td style="padding: 16px 32px 0; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #94A3B8; line-height: 1.5;">
            You are receiving this academic update because your institution is partnered with Lumixora.
            <br />
            <a href="${LUMIXORA_ASSETS.websiteUrl}/unsubscribe?email=${encodeURIComponent(unsubscribeEmail)}" style="color: #64748B; text-decoration: underline;">Unsubscribe from platform announcements</a> · 
            <a href="${LUMIXORA_ASSETS.websiteUrl}/preferences" style="color: #64748B; text-decoration: underline;">Manage Preferences</a>
          </p>
        </td>
      </tr>
    `
    : `
      <tr>
        <td style="padding: 12px 32px 0; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #94A3B8; line-height: 1.5;">
            This is an essential security and transactional communication regarding your Lumixora account.
          </p>
        </td>
      </tr>
    `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F8FAFC; }
    @media screen and (max-width: 600px) {
      .container-table { width: 100% !important; border-radius: 0 !important; }
      .mobile-p-24 { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 22px !important; line-height: 28px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
  <!-- Preheader text (invisible preview text) -->
  <div style="display: none; font-size: 1px; color: #F8FAFC; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table class="container-table" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px -2px rgba(15, 23, 42, 0.06);">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 32px 32px 20px; border-bottom: 1px solid #F1F5F9; background-color: #FFFFFF;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" vertical-align="middle">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -0.5px; color: #0F172A;">
                        Lumixora<span style="color: #6366F1;">.</span>
                      </span>
                    </div>
                  </td>
                  <td align="right" vertical-align="middle">
                    <span style="display: inline-block; padding: 4px 10px; background-color: #F1F5F9; border-radius: 6px; font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.5px; text-transform: uppercase;">
                      ${senderIdentity || 'Official Verification'}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
          <tr>
            <td class="mobile-p-24" style="padding: 36px 32px 28px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Brand Footer -->
          <tr>
            <td style="padding: 24px 32px 32px; background-color: #FAFAFC; border-top: 1px solid #F1F5F9;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 6px; font-size: 12px; font-weight: 600; color: #475569; letter-spacing: -0.2px;">
                      Lumixora — A Product of Vyomra
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #94A3B8; line-height: 1.5;">
                      Empowering campus talent, career intelligence & enterprise placements.
                    </p>
                    <p style="margin: 8px 0 0; font-size: 11px; color: #94A3B8;">
                      ${LUMIXORA_ASSETS.complianceAddress}
                    </p>
                  </td>
                </tr>
                ${unsubscribeSection}
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 1. OTP Verification Template (P1 Urgent Security)
 */
export function renderOtpEmail({ rollNumber, code, collegeName = 'G. Pulla Reddy Engineering College', expiryMinutes = 5 }) {
  const title = `Verification Code: ${code} — Lumixora`;
  const preheader = `Your 6-digit placement authentication code is ${code}. Valid for ${expiryMinutes} minutes.`;
  
  const bodyHtml = `
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px;">
      Security Verification
    </h1>
    <p style="margin: 0 0 24px; font-size: 14px; color: #475569; line-height: 1.6;">
      Use the one-time verification code below to complete your secure academic authentication for scholar <strong style="color: #0F172A; font-family: monospace;">${(rollNumber || 'SCHOLAR').toUpperCase()}</strong> at <strong>${collegeName}</strong>.
    </p>

    <!-- Code Display Box -->
    <div style="margin: 28px 0; padding: 24px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; text-align: center;">
      <span style="font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #0F172A; display: inline-block;">
        ${code}
      </span>
    </div>

    <!-- Security Metadata -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0 0; padding: 14px 16px; background: #F1F5F9; border-radius: 10px;">
      <tr>
        <td style="font-size: 12px; color: #475569; line-height: 1.5;">
          ⏱ <strong>Valid for ${expiryMinutes} minutes.</strong> Never share this code with anyone. Lumixora staff will never request your code via phone or email.
        </td>
      </tr>
    </table>
  `;

  const textContent = `
LUMIXORA SECURITY VERIFICATION
==============================

Your 6-digit placement authentication code is: ${code}

Scholar: ${(rollNumber || 'SCHOLAR').toUpperCase()}
Institution: ${collegeName}
Validity: ${expiryMinutes} minutes

This code is single-use and will expire automatically. If you did not request this verification, please ignore this email or contact support@lumixora.in.

--
Lumixora — A Product of Vyomra
${LUMIXORA_ASSETS.complianceAddress}
  `.trim();

  return {
    subject: `Your Lumixora Verification Code: ${code}`,
    html: buildMasterShell({ title, preheader, bodyHtml, senderIdentity: 'Security Code' }),
    textContent
  };
}

/**
 * 2. Welcome & Onboarding Template (P2 Transactional)
 */
export function renderWelcomeEmail({ name, rollNumber, department = 'Engineering', collegeName = 'G. Pulla Reddy Engineering College', portalUrl = 'https://gprec.lumixora.in' }) {
  const cleanName = name || 'Scholar';
  const title = `Welcome to Lumixora, ${cleanName}`;
  const preheader = `Your institutional placement account has been approved and activated.`;

  const bodyHtml = `
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px;">
      Welcome to Lumixora, ${cleanName}
    </h1>
    <p style="margin: 0 0 24px; font-size: 14px; color: #475569; line-height: 1.6;">
      Your profile has been whitelisted on the <strong>${collegeName}</strong> Placement Suite. You now have full access to AI mock interviews, live OA simulators, and corporate drive screening.
    </p>

    <!-- Credentials Card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0 28px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 18px 20px;">
      <tr>
        <td style="padding-bottom: 8px; font-size: 12px; color: #64748B;">Registered Scholar:</td>
        <td style="padding-bottom: 8px; font-size: 13px; font-weight: 600; color: #0F172A; text-align: right;">${cleanName}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 8px; font-size: 12px; color: #64748B;">Roll Number:</td>
        <td style="padding-bottom: 8px; font-size: 13px; font-weight: 700; color: #4F46E5; font-family: monospace; text-align: right;">${(rollNumber || 'GPREC').toUpperCase()}</td>
      </tr>
      <tr>
        <td style="font-size: 12px; color: #64748B;">Department:</td>
        <td style="font-size: 13px; font-weight: 600; color: #0F172A; text-align: right;">${department}</td>
      </tr>
    </table>

    <!-- Call to action button -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 10px;">
      <tr>
        <td align="center">
          <a href="${portalUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #0F172A; color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 10px; letter-spacing: 0.2px;">
            Enter Placement Suite &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  const textContent = `
WELCOME TO LUMIXORA
===================

Hello ${cleanName},

Your profile has been whitelisted on the ${collegeName} Placement Suite.

Scholar: ${cleanName}
Roll Number: ${(rollNumber || 'GPREC').toUpperCase()}
Department: ${department}
Portal URL: ${portalUrl}

Sign in anytime using your official roll number to access coding simulators, mock interview rooms, and verified drive schedules.

--
Lumixora — A Product of Vyomra
${LUMIXORA_ASSETS.complianceAddress}
  `.trim();

  return {
    subject: `Welcome to Lumixora Campus Suite, ${cleanName}`,
    html: buildMasterShell({ title, preheader, bodyHtml, senderIdentity: 'Welcome' }),
    textContent
  };
}

/**
 * 3. Password Reset & Recovery Template (P1 Urgent Security)
 */
export function renderPasswordResetEmail({ email, code, role = 'Placement Officer', resetUrl = '' }) {
  const title = `Password Reset Verification — Lumixora`;
  const preheader = `Your password reset code is ${code}. Valid for 10 minutes.`;

  const bodyHtml = `
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px;">
      Password Recovery Request
    </h1>
    <p style="margin: 0 0 24px; font-size: 14px; color: #475569; line-height: 1.6;">
      We received a request to reset the password associated with your <strong>${role}</strong> portal account (${email}).
    </p>

    <!-- Code Display Box -->
    <div style="margin: 24px 0; padding: 20px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; text-align: center;">
      <span style="font-family: SFMono-Regular, Consolas, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0F172A;">
        ${code}
      </span>
    </div>

    <p style="margin: 0 0 16px; font-size: 13px; color: #64748B; line-height: 1.5;">
      Enter this 6-digit security code on the password reset screen to create your new password. This code expires in 10 minutes.
    </p>

    <div style="margin-top: 24px; padding: 12px 16px; background-color: #FEF2F2; border: 1px solid #FEE2E2; border-radius: 8px; font-size: 12px; color: #991B1B;">
      If you did not initiate this request, your account remains secure and no changes were made. Please contact security@lumixora.in immediately.
    </div>
  `;

  const textContent = `
PASSWORD RECOVERY REQUEST
=========================

Your 6-digit password reset code is: ${code}
Account: ${email}
Role: ${role}
Validity: 10 minutes

If you did not initiate this request, your password has not been changed. Please inform security@lumixora.in.

--
Lumixora — A Product of Vyomra
${LUMIXORA_ASSETS.complianceAddress}
  `.trim();

  return {
    subject: `Lumixora Password Reset Code: ${code}`,
    html: buildMasterShell({ title, preheader, bodyHtml, senderIdentity: 'Account Security' }),
    textContent
  };
}

/**
 * 4. Placement Opportunity & Drive Alert (P3 Announcement / Careers)
 */
export function renderPlacementAlertEmail({ name, company, ctc, roleTitle, driveDate, deadline, driveUrl, eligibility }) {
  const cleanName = name || 'Scholar';
  const title = `Recruitment Drive Alert: ${company}`;
  const preheader = `${company} is recruiting for ${roleTitle} (${ctc}). Application deadline: ${deadline}.`;

  const bodyHtml = `
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px;">
      New Placement Opportunity
    </h1>
    <p style="margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.6;">
      Dear ${cleanName}, a new campus recruitment drive has been scheduled by the Corporate Relations & Placement Cell.
    </p>

    <!-- Company Badge & Overview -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 24px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px;">
      <tr>
        <td style="padding-bottom: 10px; font-size: 18px; font-weight: 800; color: #0F172A;" colspan="2">
          ${company}
        </td>
      </tr>
      <tr>
        <td style="padding-bottom: 6px; font-size: 12px; color: #64748B;">Role:</td>
        <td style="padding-bottom: 6px; font-size: 13px; font-weight: 600; color: #0F172A; text-align: right;">${roleTitle}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 6px; font-size: 12px; color: #64748B;">Package (CTC):</td>
        <td style="padding-bottom: 6px; font-size: 13px; font-weight: 700; color: #059669; text-align: right;">${ctc}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 6px; font-size: 12px; color: #64748B;">Eligibility Criteria:</td>
        <td style="padding-bottom: 6px; font-size: 12px; font-weight: 500; color: #334155; text-align: right;">${eligibility || 'B.Tech CSE/CSM/ECE — CGPA >= 7.5'}</td>
      </tr>
      <tr>
        <td style="font-size: 12px; color: #64748B;">Drive / OA Date:</td>
        <td style="font-size: 13px; font-weight: 600; color: #0F172A; text-align: right;">${driveDate || 'To be announced'}</td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
      <tr>
        <td align="center">
          <a href="${driveUrl || 'https://gprec.lumixora.in'}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #0F172A; color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 10px;">
            View Drive Details & Apply &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  const textContent = `
NEW RECRUITMENT DRIVE ALERT
===========================

Company: ${company}
Role: ${roleTitle}
CTC: ${ctc}
Eligibility: ${eligibility || 'B.Tech CSE/CSM/ECE'}
Drive Date: ${driveDate || 'To be announced'}
Deadline: ${deadline || 'Check portal'}

View complete details on the Placement Suite: ${driveUrl || 'https://gprec.lumixora.in'}

--
Lumixora — A Product of Vyomra
${LUMIXORA_ASSETS.complianceAddress}
  `.trim();

  return {
    subject: `Placement Opportunity: ${company} (${ctc}) — Apply by ${deadline || 'soon'}`,
    html: buildMasterShell({ title, preheader, bodyHtml, senderIdentity: 'Placement Drive', isPromotional: true, unsubscribeEmail: '' }),
    textContent
  };
}

/**
 * 5. Proof-of-Skill Certificate Delivery (P2 Transactional / Certificates)
 */
export function renderCertificateEmail({ name, certificateTitle, certificateId, issueDate, verificationUrl }) {
  const cleanName = name || 'Scholar';
  const title = `Your Verified Credential: ${certificateTitle}`;
  const preheader = `Congratulations ${cleanName}! Your official proof-of-skill certificate is ready.`;

  const bodyHtml = `
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px;">
      Certificate of Achievement
    </h1>
    <p style="margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.6;">
      Dear ${cleanName}, you have successfully demonstrated mastery and earned an institutional credential.
    </p>

    <!-- Certificate Metadata Box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 24px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px;">
      <tr>
        <td style="padding-bottom: 8px; font-size: 12px; color: #64748B;">Credential Title:</td>
        <td style="padding-bottom: 8px; font-size: 14px; font-weight: 700; color: #0F172A; text-align: right;">${certificateTitle}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 8px; font-size: 12px; color: #64748B;">Certificate ID:</td>
        <td style="padding-bottom: 8px; font-size: 13px; font-weight: 700; color: #4F46E5; font-family: monospace; text-align: right;">${certificateId || 'LMX-CERT-2026'}</td>
      </tr>
      <tr>
        <td style="font-size: 12px; color: #64748B;">Issued On:</td>
        <td style="font-size: 13px; font-weight: 600; color: #0F172A; text-align: right;">${issueDate || new Date().toISOString().slice(0, 10)}</td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
      <tr>
        <td align="center">
          <a href="${verificationUrl || `${LUMIXORA_ASSETS.websiteUrl}/verify-certificate?id=${certificateId}`}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #0F172A; color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 10px;">
            View & Download Certificate &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  const textContent = `
CERTIFICATE OF ACHIEVEMENT
==========================

Congratulations ${cleanName}!

Credential: ${certificateTitle}
Certificate ID: ${certificateId || 'LMX-CERT-2026'}
Issue Date: ${issueDate || new Date().toISOString().slice(0, 10)}

Verify your credential online:
${verificationUrl || `${LUMIXORA_ASSETS.websiteUrl}/verify-certificate?id=${certificateId}`}

--
Lumixora — A Product of Vyomra
${LUMIXORA_ASSETS.complianceAddress}
  `.trim();

  return {
    subject: `Your Verified Certificate: ${certificateTitle} — ${certificateId || 'Lumixora'}`,
    html: buildMasterShell({ title, preheader, bodyHtml, senderIdentity: 'Credential' }),
    textContent
  };
}

/**
 * 6. Internship Passcode & Access Notice (P1 Urgent / Careers)
 */
export function renderInternshipPasscodeEmail({ name, roleTitle, internId, passcode, accessPin }) {
  const cleanName = name || 'Intern';
  const title = `Lumixora Internship Passcode`;
  const preheader = `Your workspace passcode is ${passcode}.`;

  const bodyHtml = `
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px;">
      Workspace Security Passcode
    </h1>
    <p style="margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.6;">
      Dear ${cleanName}, your access to the <strong>${roleTitle || 'Product Engineering'}</strong> workspace has been provisioned.
    </p>

    <!-- Passcode Display Box -->
    <div style="margin: 20px 0; padding: 22px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; text-align: center;">
      <span style="font-family: SFMono-Regular, Consolas, monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0F172A;">
        ${passcode}
      </span>
      ${accessPin ? `<div style="margin-top: 8px; font-size: 12px; color: #64748B;">PIN: <strong style="color: #0F172A;">${accessPin}</strong></div>` : ''}
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 20px; background: #F1F5F9; border-radius: 10px; padding: 14px;">
      <tr>
        <td style="font-size: 12px; color: #475569;">
          <strong>Intern ID:</strong> <span style="font-family: monospace;">${internId || 'LMX-INT-2026'}</span> · 
          <strong>Role:</strong> ${roleTitle || 'Developer'}
        </td>
      </tr>
    </table>
  `;

  const textContent = `
LUMIXORA WORKSPACE PASSCODE
===========================

Hello ${cleanName},

Your workspace passcode is: ${passcode}
${accessPin ? `Access PIN: ${accessPin}` : ''}
Intern ID: ${internId || 'LMX-INT-2026'}
Role: ${roleTitle || 'Developer'}

Sign in at https://lumixora.in/intern-portal

--
Lumixora — A Product of Vyomra
${LUMIXORA_ASSETS.complianceAddress}
  `.trim();

  return {
    subject: `Your Lumixora Workspace Passcode: ${passcode}`,
    html: buildMasterShell({ title, preheader, bodyHtml, senderIdentity: 'Intern Workspace' }),
    textContent
  };
}

/**
 * 7. Platform Announcement & Student Perks (P3 Promotional)
 */
export function renderAnnouncementEmail({ name, titleText, bodyMarkdown, actionUrl, actionText, recipientEmail }) {
  const cleanName = name || 'Scholar';
  const title = titleText || 'Important Update from Lumixora';
  const preheader = `New platform capabilities and campus intelligence available on Lumixora.`;

  const bodyHtml = `
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px;">
      ${titleText || 'Academic Update'}
    </h1>
    <p style="margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.6;">
      Dear ${cleanName},
    </p>
    <div style="font-size: 14px; color: #334155; line-height: 1.7; margin: 0 0 24px;">
      ${bodyMarkdown ? bodyMarkdown.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>') : 'We have released new AI mock interview rounds, real institutional exam prediction datasets, and upgraded company hiring tracks.'}
    </div>

    ${actionUrl ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 10px;">
      <tr>
        <td align="center">
          <a href="${actionUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #0F172A; color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 10px;">
            ${actionText || 'Explore Now &rarr;'}
          </a>
        </td>
      </tr>
    </table>
    ` : ''}
  `;

  const textContent = `
${titleText.toUpperCase()}
===========================

Dear ${cleanName},

${bodyMarkdown || 'We have released new updates on the Lumixora platform.'}

${actionUrl ? `Explore now: ${actionUrl}` : ''}

--
To unsubscribe: ${LUMIXORA_ASSETS.websiteUrl}/unsubscribe?email=${encodeURIComponent(recipientEmail || '')}
Lumixora — A Product of Vyomra
${LUMIXORA_ASSETS.complianceAddress}
  `.trim();

  return {
    subject: titleText,
    html: buildMasterShell({ title, preheader, bodyHtml, senderIdentity: 'Announcements', isPromotional: true, unsubscribeEmail: recipientEmail }),
    textContent
  };
}

/**
 * 8. Admin Security & Telemetry Alert (P1 Urgent Security)
 */
export function renderSecurityAlertEmail({ adminName, alertTitle, details, ipAddress, timestamp }) {
  const title = `Security Alert: ${alertTitle}`;
  const preheader = `Lumixora Security Alert: ${alertTitle}`;

  const bodyHtml = `
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 700; color: #991B1B; letter-spacing: -0.5px;">
      ⚠️ Security Notification
    </h1>
    <p style="margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.6;">
      Dear ${adminName || 'Founder'}, an automated security event was triggered on the Lumixora infrastructure.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 24px; background: #FEF2F2; border: 1px solid #FEE2E2; border-radius: 14px; padding: 18px;">
      <tr>
        <td style="padding-bottom: 6px; font-size: 12px; color: #991B1B;">Event:</td>
        <td style="padding-bottom: 6px; font-size: 13px; font-weight: 700; color: #7F1D1D; text-align: right;">${alertTitle}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 6px; font-size: 12px; color: #991B1B;">Timestamp:</td>
        <td style="padding-bottom: 6px; font-size: 12px; font-mono; color: #7F1D1D; text-align: right;">${timestamp || new Date().toISOString()}</td>
      </tr>
      <tr>
        <td style="font-size: 12px; color: #991B1B;">Origin IP:</td>
        <td style="font-size: 12px; font-mono; color: #7F1D1D; text-align: right;">${ipAddress || 'Authenticated Cloudflare Gateway'}</td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
      ${details || 'Please inspect the Founder Portal security audit logs if this action was unexpected.'}
    </p>
  `;

  const textContent = `
LUMIXORA SECURITY ALERT
=======================

Event: ${alertTitle}
Timestamp: ${timestamp || new Date().toISOString()}
Origin IP: ${ipAddress || 'Cloudflare Gateway'}

Details:
${details || 'Please inspect the Founder Portal.'}

--
Lumixora — A Product of Vyomra
${LUMIXORA_ASSETS.complianceAddress}
  `.trim();

  return {
    subject: `🚨 Lumixora Security Alert: ${alertTitle}`,
    html: buildMasterShell({ title, preheader, bodyHtml, senderIdentity: 'Security Alert' }),
    textContent
  };
}
