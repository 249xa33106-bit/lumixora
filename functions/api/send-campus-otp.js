export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { email, code, name, collegeName } = body;

    if (!email || !code) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Gmail SMTP credentials
    const user = 'lumixora.team@gmail.com';
    const pass = 'kknllfqvupjeopii';

    // Cloudflare Workers connect directly via TCP/TLS socket
    const { connect } = await import('cloudflare:sockets');
    const socket = connect('smtp.gmail.com:465', { secureTransport: 'on' });

    const writer = socket.writable.getWriter();
    const reader = socket.readable.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    async function send(cmd) {
      await writer.write(encoder.encode(cmd + '\r\n'));
    }

    async function readResponse() {
      const { value, done } = await reader.read();
      if (done) return '';
      return decoder.decode(value);
    }

    // Initial 220 banner
    await readResponse();

    // EHLO
    await send('EHLO localhost');
    await readResponse();

    // AUTH LOGIN
    await send('AUTH LOGIN');
    await readResponse();

    // Base64 user
    await send(btoa(user));
    await readResponse();

    // Base64 pass
    await send(btoa(pass));
    const authRes = await readResponse();
    if (!authRes.startsWith('235')) {
      throw new Error('Gmail SMTP Auth failed: ' + authRes);
    }

    // MAIL FROM
    await send(`MAIL FROM:<${user}>`);
    await readResponse();

    // RCPT TO
    await send(`RCPT TO:<${email}>`);
    const rcptRes = await readResponse();
    if (!rcptRes.startsWith('250')) {
      throw new Error('Recipient rejected: ' + rcptRes);
    }

    // DATA
    await send('DATA');
    await readResponse();

    const subject = `Your Lumixora Campus Security Code: ${code}`;
    const studentGreeting = name ? `Dear ${name},` : 'Dear Scholar,';
    const institutionNotice = collegeName ? `<p style="margin: 0 0 12px; font-size: 13px; color: #64748B;">Registered Institution: <strong style="color: #0F172A;">${collegeName}</strong></p>` : '';

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #070B19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #070B19; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #0E172E; border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; background: linear-gradient(135deg, #070B19 0%, #0E172E 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <div style="display: inline-block; padding: 6px 14px; border-radius: 9999px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); font-size: 11px; font-weight: 700; color: #10B981; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">
                🔐 Lumixora Campus • Secure Gateway
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
                Universal Academic Gateway
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #94A3B8;">
                High-Security Verification for Higher Education Scholars
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 15px; color: #E2E8F0; line-height: 1.6;">
                ${studentGreeting}
              </p>
              ${institutionNotice}
              <p style="margin: 0 0 24px; font-size: 14px; color: #94A3B8; line-height: 1.6;">
                Use the following 6-digit cryptographic verification code to authenticate your session on <strong style="color: #10B981;">campus.lumixora.in</strong>. This code is unique and expires in <strong>5 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background: rgba(16, 185, 129, 0.06); border: 1.5px dashed rgba(16, 185, 129, 0.4); border-radius: 12px; padding: 22px; text-align: center; margin: 24px 0;">
                <div style="font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                  Your Single-Use Verification Code
                </div>
                <div style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #10B981; font-family: monospace;">
                  ${code}
                </div>
                <div style="font-size: 11px; color: #64748B; margin-top: 8px;">
                  Valid for 5 minutes • Do not share this code with anyone
                </div>
              </div>

              <!-- Security Details -->
              <div style="background: rgba(15, 23, 42, 0.6); border-radius: 10px; padding: 14px 18px; border: 1px solid rgba(255, 255, 255, 0.05); margin-top: 24px;">
                <div style="font-size: 12px; font-weight: 600; color: #CBD5E1; margin-bottom: 4px;">
                  🛡️ Security Safeguard Active
                </div>
                <div style="font-size: 12px; color: #64748B; line-height: 1.5;">
                  If you did not request this login code, no action is needed. Your profile is safe and protected by rate-limiting and anti-bot defenses.
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background: rgba(7, 11, 25, 0.6); border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #475569; line-height: 1.5;">
                Lumixora Campus Gateway • End-to-End Encrypted Session<br>
                For technical support, contact <a href="mailto:lumixora.team@gmail.com" style="color: #10B981; text-decoration: none;">lumixora.team@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const emailContent = [
      `From: "Lumixora Campus Security" <${user}>`,
      `To: <${email}>`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      htmlBody,
      '.'
    ].join('\r\n');

    await send(emailContent);
    const finalRes = await readResponse();

    await send('QUIT');
    try { socket.close(); } catch (_) {}

    if (!finalRes.startsWith('250')) {
      throw new Error('Message sending failed: ' + finalRes);
    }

    return new Response(JSON.stringify({ success: true, message: 'Campus security code dispatched successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Campus OTP Email Error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
