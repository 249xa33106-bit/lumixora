export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { rollNumber, email, code } = body;

    if (!rollNumber || !email || !code) {
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
    await readResponse();

    // DATA
    await send('DATA');
    await readResponse();

    const subject = 'GPREC Placement Verification Code: ' + code;
    const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px;">
  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
    <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #101a35;">GPREC Placement Suite</h2>
  </div>
  <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
    Your official 6-digit placement login verification code for scholar <b>${rollNumber.toUpperCase()}</b> is:
  </p>
  <div style="text-align: center; margin: 28px 0; padding: 20px; background: #f8fafc; border: 2px dashed #7553e8; border-radius: 16px;">
    <span style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #7553e8;">${code}</span>
  </div>
  <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 16px 0;">
    This code is valid for your current login session. Enter it on the GPREC Placement portal to access the AI Commander, Mock Interview Room, and Code Arena.
  </p>
  <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; color: #94a3b8; font-size: 11px;">
    Sent automatically by Lumixora Official Team (&lt;lumixora.team@gmail.com&gt;) for G. Pulla Reddy Engineering College (Autonomous), Kurnool.
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

    return new Response(JSON.stringify({ success: true, message: 'OTP sent from lumixora.team@gmail.com' }), {
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
