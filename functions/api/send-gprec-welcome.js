export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { rollNumber, email, name, department } = body;

    if (!rollNumber || !email) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const scholarName = name || 'GPREC Scholar';
    const scholarDept = department || 'Engineering';
    const rollUpper = rollNumber.toUpperCase();

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

    const subject = `Welcome to GPREC Placement Suite, ${scholarName}!`;
    const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; background: #0B132B; border: 1px solid #C5A059; border-radius: 20px; color: #ffffff;">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #C5A059; background: rgba(197, 160, 89, 0.15); padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(197, 160, 89, 0.3);">OFFICIAL PLACEMENT CLEARANCE</span>
    <h1 style="margin: 14px 0 6px 0; font-size: 22px; font-weight: 900; color: #ffffff;">G. Pulla Reddy Engineering College</h1>
    <p style="margin: 0; font-size: 13px; color: #94a3b8;">Autonomous Institution · Approved by AICTE · Accredited by NAAC (A+) & NBA</p>
  </div>

  <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; margin-bottom: 24px;">
    <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 800; color: #38bdf8;">🎉 Welcome, ${scholarName}!</h3>
    <p style="margin: 0 0 16px 0; font-size: 13px; color: #cbd5e1; line-height: 1.6;">
      Your official access to the <strong>GPREC AI Placement Suite</strong> has been whitelisted and approved by the Placement Cell.
    </p>

    <div style="background: #111C44; border-radius: 12px; padding: 14px 18px; margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px;">
        <span style="color: #94a3b8;">Roll Number:</span>
        <strong style="color: #fbbf24; font-family: monospace;">${rollUpper}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px;">
        <span style="color: #94a3b8;">Department:</span>
        <strong style="color: #ffffff;">${scholarDept}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 12px;">
        <span style="color: #94a3b8;">Portal URL:</span>
        <strong style="color: #38bdf8;">https://gprec.lumixora.in/</strong>
      </div>
    </div>

    <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
      ⚡ <strong>How to Login:</strong> Open the portal, enter your roll number (<code>${rollUpper}</code>), and a 5-minute rolling security code will be sent to your institutional email: <code>${email}</code>.
    </p>
  </div>

  <div style="text-align: center; margin-bottom: 24px;">
    <a href="https://gprec.lumixora.in/" style="display: inline-block; background: linear-gradient(135deg, #C5A059, #E5C158); color: #0B132B; font-weight: 900; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 12px; box-shadow: 0 4px 14px rgba(197, 160, 89, 0.4);">
      Launch GPREC Placement Suite ↗
    </a>
  </div>

  <div style="text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 16px; font-size: 11px; color: #64748b;">
    GPREC Placement Cell & Lumixora Educational Systems · Kurnool, Andhra Pradesh<br />
    Support: lumixora.team@gmail.com
  </div>
</div>
`;

    const rawMessage = [
      `From: GPREC Placement Cell <${user}>`,
      `To: <${email}>`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      html,
      '.'
    ].join('\r\n');

    await send(rawMessage);
    const dataRes = await readResponse();

    await send('QUIT');
    try { await socket.close(); } catch (_) {}

    if (dataRes.startsWith('250')) {
      return new Response(JSON.stringify({ success: true, message: 'Welcome email sent successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error('DATA send rejected: ' + dataRes);
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
