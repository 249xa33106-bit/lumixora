export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { email, code, newPassword } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Verify authorized dean / officer email
    if (cleanEmail !== 'dean.placements@gprec.ac.in') {
      return new Response(JSON.stringify({ error: 'This recovery flow is only for authorized Placement Officers.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Gmail SMTP credentials
    const user = 'lumixora.team@gmail.com';
    const pass = 'kknllfqvupjeopii';

    // Cloudflare Workers direct TLS connect
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

    // Handshake
    await readResponse();
    await send('EHLO localhost');
    await readResponse();
    await send('AUTH LOGIN');
    await readResponse();
    await send(btoa(user));
    await readResponse();
    await send(btoa(pass));
    const authRes = await readResponse();
    if (!authRes.startsWith('235')) {
      throw new Error('Gmail SMTP Auth failed: ' + authRes);
    }

    await send(`MAIL FROM:<${user}>`);
    await readResponse();
    await send(`RCPT TO:<${cleanEmail}>`);
    await readResponse();
    await send('DATA');
    await readResponse();

    const subject = 'GPREC Placement Officer Password Reset Code: ' + code;
    const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px;">
  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
    <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #101a35;">GPREC Placement Administration</h2>
  </div>
  <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
    A password reset request was initiated for Placement Officer / Dean account <b>${cleanEmail}</b>.
  </p>
  <div style="text-align: center; margin: 24px 0; padding: 20px; background: #f8fafc; border: 2px dashed #7553e8; border-radius: 16px;">
    <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; font-weight: 800; color: #64748b; letter-spacing: 1px;">Password Reset Verification Code</p>
    <span style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #7553e8;">${code}</span>
  </div>
  <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 16px 0;">
    This code is valid for 10 minutes. Enter it along with your new password to restore access to the GPREC Placement Officer Suite.
  </p>
  <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; color: #94a3b8; font-size: 11px;">
    Sent by Lumixora Official Security Team (&lt;lumixora.team@gmail.com&gt;) for G. Pulla Reddy Engineering College (Autonomous), Kurnool.
  </div>
</div>
`;

    const mime = [
      `From: "Lumixora Security" <${user}>`,
      `To: <${cleanEmail}>`,
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

    return new Response(JSON.stringify({ success: true, message: 'Password reset code sent to official Dean mailbox' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
