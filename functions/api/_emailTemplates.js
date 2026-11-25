/**
 * Lumixora Luxury Midnight Obsidian & Imperial Gold Email Templates Engine
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
 * Universal Master Email Shell (Midnight Obsidian & Imperial Gold Luxury Theme)
 */
function buildMasterShell({ title, preheader, bodyHtml, senderIdentity, isPromotional = false, unsubscribeEmail = '' }) {
  const unsubscribeSection = isPromotional
    ? `
      <tr>
        <td style="padding: 16px 32px 0; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #64748B; line-height: 1.5;">
            You are receiving this academic update because your institution is partnered with Lumixora.
            <br />
            <a href="${LUMIXORA_ASSETS.websiteUrl}/unsubscribe?email=${encodeURIComponent(unsubscribeEmail)}" style="color: #C5A059; text-decoration: underline;">Unsubscribe from platform announcements</a> · 
            <a href="${LUMIXORA_ASSETS.websiteUrl}/preferences" style="color: #C5A059; text-decoration: underline;">Manage Preferences</a>
          </p>
        </td>
      </tr>
    `
    : `
      <tr>
        <td style="padding: 12px 32px 0; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #64748B; line-height: 1.5;">
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
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #060A17; }
    @media screen and (max-width: 600px) {
      .container-table { width: 100% !important; border-radius: 0 !important; }
      .mobile-p-24 { padding: 26px 20px !important; }
      .mobile-h1 { font-size: 22px !important; line-height: 28px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #060A17; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F1F5F9;">
  <!-- Preheader text (invisible preview text) -->
  <div style="display: none; font-size: 1px; color: #060A17; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #060A17; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table class="container-table" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; background-color: #0B132B; border: 1px solid rgba(197, 160, 89, 0.35); border-radius: 20px; overflow: hidden; box-shadow: 0 12px 48px -4px rgba(0, 0, 0, 0.65);">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 28px 32px 22px; border-bottom: 1px solid rgba(197, 160, 89, 0.22); background: linear-gradient(180deg, #111C44 0%, #0B132B 100%);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" vertical-align="middle">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #FFFFFF;">
                        Lumixora<span style="color: #E5C158;">.</span>
                      </span>
                      <span style="display: block; font-size: 9px; font-weight: 700; color: #C5A059; letter-spacing: 1.4px; text-transform: uppercase; margin-top: 2px;">
                        Campus Placement Suite
                      </span>
                    </div>
                  </td>
                  <td align="right" vertical-align="middle">
                    <span style="display: inline-block; padding: 4px 12px; background-color: rgba(197, 160, 89, 0.12); border: 1px solid rgba(197, 160, 89, 0.35); border-radius: 20px; font-size: 10px; font-weight: 700; color: #E5C158; letter-spacing: 0.8px; text-transform: uppercase;">
                      ${senderIdentity || 'Official Verification'}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
          <tr>
            <td class="mobile-p-24" style="padding: 36px 32px 30px; background-color: #0B132B;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Brand Footer -->
          <tr>
            <td style="padding: 26px 32px 32px; background-color: #080E21; border-top: 1px solid rgba(197, 160, 89, 0.2);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 6px; font-size: 12px; font-weight: 700; color: #E5C158; letter-spacing: 0.3px;">
                      Lumixora — A Product of Vyomra
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #64748B; line-height: 1.5;">
                      Empowering campus talent, career intelligence & enterprise placements.
                    </p>
                    <p style="margin: 8px 0 0; font-size: 10px; color: #475569;">
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
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
      Security Verification
    </h1>
    <p style="margin: 0 0 24px; font-size: 14px; color: #94A3B8; line-height: 1.6;">
      Use the one-time verification code below to complete your secure academic authentication for scholar <strong style="color: #E5C158; font-family: monospace;">${(rollNumber || 'SCHOLAR').toUpperCase()}</strong> at <strong style="color: #F1F5F9;">${collegeName}</strong>.
    </p>

    <!-- Code Display Box -->
    <div style="margin: 28px 0; padding: 26px; background: #111C44; border: 1px solid rgba(197, 160, 89, 0.4); border-radius: 14px; text-align: center; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
      <span style="font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #E5C158; display: inline-block;">
        ${code}
      </span>
    </div>

    <!-- Security Metadata -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0 0; padding: 14px 18px; background: rgba(197, 160, 89, 0.08); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 10px;">
      <tr>
        <td style="font-size: 12px; color: #CBD5E1; line-height: 1.5;">
          ⏱ <strong style="color: #E5C158;">Valid for ${expiryMinutes} minutes.</strong> Never share this code with anyone. Lumixora staff will never request your code via phone or email.
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
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
      Welcome to Lumixora, <span style="color: #E5C158;">${cleanName}</span>
    </h1>
    <p style="margin: 0 0 24px; font-size: 14px; color: #94A3B8; line-height: 1.6;">
      Your profile has been whitelisted on the <strong style="color: #F1F5F9;">${collegeName} (Autonomous)</strong> Placement Suite. You now have full clearance to access AI mock interviews, live OA simulators, and corporate recruitment drives.
    </p>

    <!-- Credentials Card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0 28px; background: #111C44; border: 1px solid rgba(197, 160, 89, 0.35); border-radius: 14px; padding: 18px 22px;">
      <tr>
        <td style="padding-bottom: 10px; font-size: 12px; color: #94A3B8;">Registered Scholar:</td>
        <td style="padding-bottom: 10px; font-size: 13px; font-weight: 700; color: #FFFFFF; text-align: right;">${cleanName}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 10px; font-size: 12px; color: #94A3B8;">Roll Number:</td>
        <td style="padding-bottom: 10px; font-size: 13px; font-weight: 800; color: #E5C158; font-family: monospace, Courier, sans-serif; text-align: right; letter-spacing: 0.5px;">${(rollNumber || 'GPREC').toUpperCase()}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 10px; font-size: 12px; color: #94A3B8;">Department:</td>
        <td style="padding-bottom: 10px; font-size: 13px; font-weight: 600; color: #38BDF8; text-align: right;">${department}</td>
      </tr>
      <tr>
        <td style="font-size: 12px; color: #94A3B8;">Clearance Status:</td>
        <td style="font-size: 12px; font-weight: 700; color: #34D399; text-align: right;">● Enrolled & Ready</td>
      </tr>
    </table>

    <!-- Call to action button -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0 10px;">
      <tr>
        <td align="center">
          <a href="${portalUrl}" target="_blank" data-brevo-no-track="true" style="display: inline-block; padding: 15px 36px; background: linear-gradient(135deg, #C5A059 0%, #E5C158 100%); color: #080C1A; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 12px; letter-spacing: 0.3px; box-shadow: 0 4px 24px rgba(197, 160, 89, 0.35);">
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
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
      Password Recovery Request
    </h1>
    <p style="margin: 0 0 24px; font-size: 14px; color: #94A3B8; line-height: 1.6;">
      We received a request to reset the password associated with your <strong style="color: #F1F5F9;">${role}</strong> portal account (${email}).
    </p>

    <!-- Code Display Box -->
    <div style="margin: 24px 0; padding: 24px; background: #111C44; border: 1px solid rgba(197, 160, 89, 0.4); border-radius: 14px; text-align: center;">
      <span style="font-family: SFMono-Regular, Consolas, monospace; font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #E5C158;">
        ${code}
      </span>
    </div>

    <p style="margin: 0 0 16px; font-size: 13px; color: #94A3B8; line-height: 1.5;">
      Enter this 6-digit security code on the password reset screen to create your new password. This code expires in 10 minutes.
    </p>

    <div style="margin-top: 24px; padding: 14px 18px; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; font-size: 12px; color: #FCA5A5;">
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
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
      New Placement Opportunity
    </h1>
    <p style="margin: 0 0 20px; font-size: 14px; color: #94A3B8; line-height: 1.6;">
      Dear ${cleanName}, a new campus recruitment drive has been scheduled by the Corporate Relations & Placement Cell.
    </p>

    <!-- Company Badge & Overview -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 24px; background: #111C44; border: 1px solid rgba(197, 160, 89, 0.35); border-radius: 14px; padding: 20px;">
      <tr>
        <td style="padding-bottom: 10px; font-size: 18px; font-weight: 800; color: #E5C158;" colspan="2">
          ${company}
        </td>
      </tr>
      <tr>
        <td style="padding-bottom: 8px; font-size: 12px; color: #94A3B8;">Role:</td>
        <td style="padding-bottom: 8px; font-size: 13px; font-weight: 600; color: #FFFFFF; text-align: right;">${roleTitle}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 8px; font-size: 12px; color: #94A3B8;">Package (CTC):</td>
        <td style="padding-bottom: 8px; font-size: 13px; font-weight: 800; color: #34D399; text-align: right;">${ctc}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 8px; font-size: 12px; color: #94A3B8;">Eligibility Criteria:</td>
        <td style="padding-bottom: 8px; font-size: 12px; font-weight: 500; color: #CBD5E1; text-align: right;">${eligibility || 'B.Tech CSE/CSM/ECE — CGPA >= 7.5'}</td>
      </tr>
      <tr>
        <td style="font-size: 12px; color: #94A3B8;">Drive / OA Date:</td>
        <td style="font-size: 13px; font-weight: 600; color: #38BDF8; text-align: right;">${driveDate || 'To be announced'}</td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 10px;">
      <tr>
        <td align="center">
          <a href="${driveUrl || 'https://gprec.lumixora.in'}" target="_blank" data-brevo-no-track="true" style="display: inline-block; padding: 15px 36px; background: linear-gradient(135deg, #C5A059 0%, #E5C158 100%); color: #080C1A; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(197, 160, 89, 0.35);">
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
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
      Certificate of Achievement
    </h1>
    <p style="margin: 0 0 20px; font-size: 14px; color: #94A3B8; line-height: 1.6;">
      Dear ${cleanName}, you have successfully demonstrated mastery and earned an institutional credential.
    </p>

    <!-- Certificate Metadata Box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 24px; background: #111C44; border: 1px solid rgba(197, 160, 89, 0.35); border-radius: 14px; padding: 20px;">
      <tr>
        <td style="padding-bottom: 8px; font-size: 12px; color: #94A3B8;">Credential Title:</td>
        <td style="padding-bottom: 8px; font-size: 14px; font-weight: 700; color: #FFFFFF; text-align: right;">${certificateTitle}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 8px; font-size: 12px; color: #94A3B8;">Certificate ID:</td>
        <td style="padding-bottom: 8px; font-size: 13px; font-weight: 800; color: #E5C158; font-family: monospace; text-align: right;">${certificateId || 'LMX-CERT-2026'}</td>
      </tr>
      <tr>
        <td style="font-size: 12px; color: #94A3B8;">Issued On:</td>
        <td style="font-size: 13px; font-weight: 600; color: #CBD5E1; text-align: right;">${issueDate || new Date().toISOString().slice(0, 10)}</td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 10px;">
      <tr>
        <td align="center">
          <a href="${verificationUrl || `${LUMIXORA_ASSETS.websiteUrl}/verify-certificate?id=${certificateId}`}" target="_blank" data-brevo-no-track="true" style="display: inline-block; padding: 15px 36px; background: linear-gradient(135deg, #C5A059 0%, #E5C158 100%); color: #080C1A; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(197, 160, 89, 0.35);">
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
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
      Workspace Security Passcode
    </h1>
    <p style="margin: 0 0 20px; font-size: 14px; color: #94A3B8; line-height: 1.6;">
      Dear ${cleanName}, your access to the <strong style="color: #F1F5F9;">${roleTitle || 'Product Engineering'}</strong> workspace has been provisioned.
    </p>

    <!-- Passcode Display Box -->
    <div style="margin: 20px 0; padding: 24px; background: #111C44; border: 1px solid rgba(197, 160, 89, 0.4); border-radius: 14px; text-align: center;">
      <span style="font-family: SFMono-Regular, Consolas, monospace; font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #E5C158;">
        ${passcode}
      </span>
    </div>

    <!-- Credentials Metadata -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0; background: #111C44; border: 1px solid rgba(197, 160, 89, 0.25); border-radius: 10px; padding: 14px 18px;">
      <tr>
        <td style="font-size: 12px; color: #94A3B8;">Intern ID:</td>
        <td style="font-size: 13px; font-weight: 700; color: #FFFFFF; text-align: right;">${internId || 'LMX-INTERN-2026'}</td>
      </tr>
      ${accessPin ? `
      <tr>
        <td style="padding-top: 6px; font-size: 12px; color: #94A3B8;">Access PIN:</td>
        <td style="padding-top: 6px; font-size: 13px; font-weight: 800; color: #E5C158; text-align: right;">${accessPin}</td>
      </tr>
      ` : ''}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 10px;">
      <tr>
        <td align="center">
          <a href="${LUMIXORA_ASSETS.websiteUrl}/intern-portal" target="_blank" data-brevo-no-track="true" style="display: inline-block; padding: 15px 36px; background: linear-gradient(135deg, #C5A059 0%, #E5C158 100%); color: #080C1A; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(197, 160, 89, 0.35);">
            Enter Workspace &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  const textContent = `
LUMIXORA WORKSPACE PASSCODE
===========================

Intern: ${cleanName}
Role: ${roleTitle || 'Product Engineering'}
Intern ID: ${internId || 'LMX-INTERN-2026'}
Passcode: ${passcode}
${accessPin ? `Access PIN: ${accessPin}\n` : ''}

Log in at: ${LUMIXORA_ASSETS.websiteUrl}/intern-portal

--
Lumixora — A Product of Vyomra
${LUMIXORA_ASSETS.complianceAddress}
  `.trim();

  return {
    subject: `Your Lumixora Workspace Passcode: ${passcode}`,
    html: buildMasterShell({ title, preheader, bodyHtml, senderIdentity: 'Workspace Security' }),
    textContent
  };
}

/**
 * 7. Hackathon & Challenge Notification (P3 Promotional / Contests)
 */
export function renderHackathonEmail({ name, title: contestTitle, prizePool, contestDate, contestUrl, problemTheme }) {
  const cleanName = name || 'Innovator';
  const title = `Challenge Invitation: ${contestTitle}`;
  const preheader = `Compete in ${contestTitle} with ${prizePool} in prizes & recognition.`;

  const bodyHtml = `
    <h1 class="mobile-h1" style="margin: 0 0 10px; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
      Hackathon Invitation
    </h1>
    <p style="margin: 0 0 20px; font-size: 14px; color: #94A3B8; line-height: 1.6;">
      Dear ${cleanName}, you have been invited to participate in the upcoming campus engineering challenge.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 24px; background: #111C44; border: 1px solid rgba(197, 160, 89, 0.35); border-radius: 14px; padding: 20px;">
      <tr>
        <td style="padding-bottom: 8px; font-size: 16px; font-weight: 800; color: #E5C158;" colspan="2">
          ${contestTitle}
        </td>
      </tr>
      <tr>
        <td style="padding-bottom: 8px; font-size: 12px; color: #94A3B8;">Prize Pool:</td>
        <td style="padding-bottom: 8px; font-size: 13px; font-weight: 800; color: #34D399; text-align: right;">${prizePool || '₹50,000 + Internship Fast-Tracks'}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 8px; font-size: 12px; color: #94A3B8;">Theme:</td>
        <td style="padding-bottom: 8px; font-size: 12px; font-weight: 600; color: #FFFFFF; text-align: right;">${problemTheme || 'AI & Full Stack Systems'}</td>
      </tr>
      <tr>
        <td style="font-size: 12px; color: #94A3B8;">Date & Time:</td>
        <td style="font-size: 13px; font-weight: 600; color: #38BDF8; text-align: right;">${contestDate || 'This Weekend'}</td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 10px;">
      <tr>
        <td align="center">
          <a href="${contestUrl || `${LUMIXORA_ASSETS.websiteUrl}/hackathons`}" target="_blank" data-brevo-no-track="true" style="display: inline-block; padding: 15px 36px; background: linear-gradient(135deg, #C5A059 0%, #E5C158 100%); color: #080C1A; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(197, 160, 89, 0.35);">
            Register Free Squad &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  const textContent = `
HACKATHON INVITATION: ${contestTitle}
===================================

Dear ${cleanName},

Prize Pool: ${prizePool || '₹50,000'}
Theme: ${problemTheme || 'AI & Full Stack Systems'}
Date: ${contestDate || 'This Weekend'}

Register free at: ${contestUrl || `${LUMIXORA_ASSETS.websiteUrl}/hackathons`}

--
Lumixora — A Product of Vyomra
${LUMIXORA_ASSETS.complianceAddress}
  `.trim();

  return {
    subject: `Hackathon Invitation: ${contestTitle} (${prizePool || 'Cash Prizes + Offers'})`,
    html: buildMasterShell({ title, preheader, bodyHtml, senderIdentity: 'Innovation Contest', isPromotional: true, unsubscribeEmail: '' }),
    textContent
  };
}

/**
 * 8. Administrative Announcement & Broadcast (P2 / Notifications)
 */
export function renderBroadcastEmail({ headline, message, actionLabel = 'Open Platform', actionUrl = 'https://lumixora.in', category = 'Important Notice' }) {
  const title = headline || 'Lumixora Institutional Announcement';
  const preheader = message ? message.slice(0, 100) : 'Important platform update from Lumixora.';

  const bodyHtml = `
    <h1 class="mobile-h1" style="margin: 0 0 12px; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
      ${headline}
    </h1>
    <div style="margin: 16px 0 24px; font-size: 14px; color: #CBD5E1; line-height: 1.7;">
      ${message}
    </div>

    ${actionUrl ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 10px;">
      <tr>
        <td align="center">
          <a href="${actionUrl}" target="_blank" data-brevo-no-track="true" style="display: inline-block; padding: 15px 36px; background: linear-gradient(135deg, #C5A059 0%, #E5C158 100%); color: #080C1A; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(197, 160, 89, 0.35);">
            ${actionLabel} &rarr;
          </a>
        </td>
      </tr>
    </table>
    ` : ''}
  `;

  const textContent = `
${headline.toUpperCase()}
========================

${message}

Access Portal: ${actionUrl}

--
Lumixora — A Product of Vyomra
${LUMIXORA_ASSETS.complianceAddress}
  `.trim();

  return {
    subject: headline,
    html: buildMasterShell({ title, preheader, bodyHtml, senderIdentity: category }),
    textContent
  };
}

// Aliases for backwards compatibility with send-email.js
export const renderAnnouncementEmail = renderBroadcastEmail;
export const renderSecurityAlertEmail = renderBroadcastEmail;

