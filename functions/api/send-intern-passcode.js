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
    const body = await context.request.json();
    const { email, name, internId, roleTitle, passcode, accessPin, type = 'LOGIN_CONFIRMATION' } = body;

    if (!email || !passcode) {
      return new Response(JSON.stringify({ error: 'Missing email or passcode' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        }
      });
    }

    // Gmail SMTP credentials - Official lumixora.team@gmail.com
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

    // RCPT TO (Any domain, no restrictions)
    await send(`RCPT TO:<${email}>`);
    await readResponse();

    // DATA
    await send('DATA');
    await readResponse();

    const isLogin = type === 'LOGIN_CONFIRMATION';
    const subject = isLogin
      ? `🔐 Lumixora Intern Login & Access Passcode: ${internId || 'Batch 01'}`
      : `🔑 Your Lumixora Intern Access Passcode: ${internId || 'Batch 01'}`;

    const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0c0822; color: #ffffff; border: 1px solid rgba(255,255,255,0.12); border-radius: 24px;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 28px;">
    <div style="display: inline-block; padding: 6px 14px; background: rgba(139, 92, 246, 0.2); border: 1px solid rgba(139, 92, 246, 0.4); border-radius: 999px; font-size: 11px; font-weight: 700; color: #c4b5fd; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
      ✦ Lumixora Intern OS • Cohort Batch 01
    </div>
    <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
      ${isLogin ? 'Workspace Login Confirmation' : 'Intern Access Passcode'}
    </h1>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #94a3b8;">
      Official confidential credential for Lumixora Cohort Batch 01.
    </p>
  </div>

  <!-- Intern Card -->
  <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin-bottom: 24px;">
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Intern Name:</td>
        <td style="color: #ffffff; font-weight: 700; text-align: right; padding: 6px 0;">${name || 'Intern Scholar'}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Intern ID:</td>
        <td style="color: #38bdf8; font-family: monospace; font-weight: 700; text-align: right; padding: 6px 0;">${internId || 'LMX-B01'}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Track / Role:</td>
        <td style="color: #a78bfa; font-weight: 600; text-align: right; padding: 6px 0;">${roleTitle || 'Cohort Intern'}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Track Lead:</td>
        <td style="color: #34d399; font-weight: 700; text-align: right; padding: 6px 0;">Shaik Sowban</td>
      </tr>
    </table>
  </div>

  <!-- Passcode Box -->
  <div style="text-align: center; margin: 24px 0; padding: 24px 16px; background: linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(59, 130, 246, 0.2) 100%); border: 2px dashed rgba(167, 139, 250, 0.6); border-radius: 20px;">
    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #c4b5fd; margin-bottom: 8px;">
      Your Confidential Access Passcode
    </div>
    <div style="font-family: monospace; font-size: 32px; font-weight: 900; letter-spacing: 4px; color: #ffffff; text-shadow: 0 0 20px rgba(167, 139, 250, 0.8);">
      ${passcode}
    </div>
    ${accessPin ? `<div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">PIN: <span style="font-family: monospace; color: #38bdf8; font-weight: bold;">${accessPin}</span></div>` : ''}
  </div>

  <!-- Instructions -->
  <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6; margin: 0 0 24px 0;">
    Use this passcode along with your Intern ID (<strong style="color: #38bdf8;">${internId}</strong>) to access your sprint roadmaps, live AI audits, deliverable submissions, and verified credentials at <a href="https://lumixora.in/#intern-portal" style="color: #a78bfa; text-decoration: underline;">lumixora.in/#intern-portal</a>.
  </p>

  <!-- CTA Button -->
  <div style="text-align: center; margin-bottom: 24px;">
    <a href="https://lumixora.in/#intern-portal" style="display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff; font-weight: 800; font-size: 13px; text-decoration: none; border-radius: 12px; box-shadow: 0 10px 25px rgba(124, 58, 237, 0.4);">
      Launch Intern Workspace &rarr;
    </a>
  </div>

  <!-- Footer -->
  <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; color: #64748b; font-size: 11px; line-height: 1.5; text-align: center;">
    This is an automated confidential notification sent by Lumixora Official Team (&lt;lumixora.team@gmail.com&gt;) directly to ${email}.<br />
    Do not share your passcode with anyone outside your cohort.
  </div>
</div>
`;

    const mime = [
      `From: "Lumixora Team" <${user}>`,
      `To: <${email}>`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      html,
      '.\r\n'
    ].join('\r\n');

    await writer.write(encoder.encode(mime));
    await readResponse();

    await send('QUIT');
    reader.releaseLock();
    writer.releaseLock();
    await socket.close();

    return new Response(JSON.stringify({ success: true, message: 'Passcode sent successfully from lumixora.team@gmail.com' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      }
    });
  } catch (err) {
    console.error('Email dispatch error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      }
    });
  }
}
