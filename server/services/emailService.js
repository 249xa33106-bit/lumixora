const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config/config');

const EMAIL_LOG_FILE = path.join(DATA_DIR, 'emails_sent.json');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isReady = false;
    this.outbox = [];
    this.init();
  }

  async init() {
    try {
      // Load previous logged emails if file exists
      if (fs.existsSync(EMAIL_LOG_FILE)) {
        try {
          this.outbox = JSON.parse(fs.readFileSync(EMAIL_LOG_FILE, 'utf8'));
        } catch (e) {
          this.outbox = [];
        }
      }

      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        this.isReady = true;
        console.log('[EmailService] Configured with live SMTP:', process.env.SMTP_HOST);
      } else {
        // Fallback test/local logger transporter
        this.transporter = nodemailer.createTransport({
          jsonTransport: true
        });
        this.isReady = true;
        console.log('[EmailService] Local mock transporter active (All emails safely logged and previewable).');
      }
    } catch (err) {
      console.error('[EmailService] Initialization warning:', err.message);
      this.isReady = false;
    }
  }

  saveOutbox() {
    try {
      fs.writeFileSync(EMAIL_LOG_FILE, JSON.stringify(this.outbox.slice(-100), null, 2), 'utf8');
    } catch (err) {
      console.error('[EmailService] Failed to persist outbox:', err);
    }
  }

  async sendApplicationConfirmation(applicant) {
    const { id, personal, preferences } = applicant;
    const recipientEmail = personal.email;
    const recipientName = personal.fullName;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px 24px; color: #ffffff; text-align: center; }
    .header h1 { margin: 0 0 8px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 14px; opacity: 0.9; }
    .body { padding: 32px 28px; }
    .greeting { font-size: 16px; margin-bottom: 20px; line-height: 1.6; }
    .app-box { background: #f1f5f9; border-left: 4px solid #4f46e5; padding: 16px 20px; border-radius: 6px; margin: 24px 0; }
    .app-id-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600; }
    .app-id-value { font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 4px; font-family: monospace; }
    .details-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .details-table td { padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .details-table td.label { color: #64748b; width: 40%; }
    .details-table td.val { font-weight: 500; color: #0f172a; }
    .timeline { margin: 24px 0; padding: 16px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; }
    .timeline-title { font-weight: 600; color: #6b21a8; font-size: 14px; margin-bottom: 8px; }
    .timeline ol { margin: 0; padding-left: 20px; font-size: 13px; color: #581c87; line-height: 1.6; }
    .footer { padding: 20px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Lumixora Internship Portal</h1>
      <p>Official Application Acknowledgment</p>
    </div>
    <div class="body">
      <div class="greeting">
        Dear <strong>${recipientName}</strong>,<br><br>
        Thank you for applying for the <strong>Lumixora Internship Program</strong>! We have successfully received your application and profile credentials.
      </div>

      <div class="app-box">
        <div class="app-id-label">Your Unique Application ID</div>
        <div class="app-id-value">${id}</div>
      </div>

      <table class="details-table">
        <tr>
          <td class="label">Preferred Domain:</td>
          <td class="val">${preferences.preferredDomain}</td>
        </tr>
        <tr>
          <td class="label">Working Arrangement:</td>
          <td class="val">${preferences.workingArrangement}</td>
        </tr>
        <tr>
          <td class="label">Preferred Duration:</td>
          <td class="val">${preferences.duration}</td>
        </tr>
        <tr>
          <td class="label">Submitted On:</td>
          <td class="val">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
        </tr>
      </table>

      <div class="timeline">
        <div class="timeline-title">What Happens Next?</div>
        <ol>
          <li><strong>Application Screening:</strong> Our talent committee reviews your submitted portfolio and background (3–5 business days).</li>
          <li><strong>Domain Assessment:</strong> Shortlisted candidates receive a technical / problem-solving brief.</li>
          <li><strong>Interview:</strong> Online conversation with Lumixora engineering and design leads.</li>
        </ol>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
        You can check your application progress anytime on the Lumixora Portal using your <strong>Application ID</strong> and registered email address.
      </p>
    </div>
    <div class="footer">
      Lumixora Technologies Inc. • Talent & Internship Recruitment Operations<br>
      This is an automated notification. Please keep your Application ID confidential.
    </div>
  </div>
</body>
</html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Lumixora Recruitment" <internships@lumixora.com>',
      to: recipientEmail,
      subject: `Application Received: ${preferences.preferredDomain} [${id}] - Lumixora`,
      html: htmlContent
    };

    try {
      if (this.transporter) {
        const info = await this.transporter.sendMail(mailOptions);
        const logEntry = {
          id: `email_${Date.now()}`,
          applicationId: id,
          to: recipientEmail,
          subject: mailOptions.subject,
          timestamp: new Date().toISOString(),
          status: 'SENT',
          messageId: info.messageId || 'local-msg-id'
        };

        this.outbox.unshift(logEntry);
        this.saveOutbox();
        console.log(`[EmailService] Application confirmation sent to ${recipientEmail} for application ${id}`);
        return { success: true, logEntry };
      }
    } catch (err) {
      console.error('[EmailService] Error dispatching email:', err.message);
      const logEntry = {
        id: `email_${Date.now()}`,
        applicationId: id,
        to: recipientEmail,
        subject: mailOptions.subject,
        timestamp: new Date().toISOString(),
        status: 'FAILED',
        error: err.message
      };
      this.outbox.unshift(logEntry);
      this.saveOutbox();
      return { success: false, error: err.message };
    }
  }

  getOutbox() {
    return this.outbox;
  }
}

const emailService = new EmailService();

module.exports = emailService;
