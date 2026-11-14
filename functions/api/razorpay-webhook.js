/**
 * Cloudflare Pages Function: /api/razorpay-webhook
 * Receives Razorpay webhook events (e.g. payment.captured).
 * Automatically updates Supabase users table and founder_notifications
 * so that any student who pays via Razorpay is instantly granted access.
 */

const SUPABASE_URL = 'https://ykuyzkhhnltjccyzduap.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';

export async function onRequestPost(context) {
  try {
    const event = await context.request.json();
    console.log('[Razorpay Webhook] Received event:', event?.event);

    const payment = event?.payload?.payment?.entity;
    if (!payment) {
      return new Response(JSON.stringify({ status: 'ignored', reason: 'No payment entity' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const paymentId = payment.id;
    const status = payment.status; // 'captured'
    const amount = (payment.amount || 1000) / 100; // in rupees
    const email = (payment.notes?.scholarEmail || payment.email || '').toLowerCase().trim();
    const name = payment.notes?.scholarName || payment.notes?.name || 'Student Scholar';
    const college = payment.notes?.college || 'G. Pulla Reddy Engineering College (Autonomous)';
    const bankRrn = payment.acquirer_data?.rrn || payment.acquirer_data?.bank_transaction_id || payment.bank_transaction_id || '';
    const nowIso = new Date().toISOString();

    if (!email) {
      console.warn('[Razorpay Webhook] No email found in payment:', paymentId);
      return new Response(JSON.stringify({ status: 'ok', warning: 'No email in payment' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Update Supabase users table if user exists
    const userQueryResp = await fetch(
      `${SUPABASE_URL}/rest/v1/users?email=ilike.${encodeURIComponent(email)}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    if (userQueryResp.ok) {
      const users = await userQueryResp.json();
      if (Array.isArray(users) && users.length > 0) {
        const u = users[0];
        const rawName = u.name || '';
        let meta = {};
        if (rawName.includes('{')) {
          try { meta = JSON.parse(rawName.substring(rawName.indexOf('{'))); } catch (e) {}
        }
        const cleanName = rawName.includes('{') ? rawName.split('{')[0].trim() : rawName;

        const updatedMeta = {
          ...meta,
          oneTimeFeePaid: true,
          feePaid: true,
          registrationFeePaid: true,
          is_fee_paid: true,
          feeAmount: amount,
          feePaidAt: nowIso,
          feeTxId: `RZP-${paymentId}`,
          paymentMethod: 'Razorpay UPI',
          bankRrn: bankRrn || '',
          status: 'verified'
        };

        const updatedPacked = `${cleanName || name} ${JSON.stringify(updatedMeta)}`;

        await fetch(
          `${SUPABASE_URL}/rest/v1/users?id=eq.${u.id}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              name: updatedPacked,
              is_approved: true
            })
          }
        );
        console.log(`[Razorpay Webhook] Updated user record for ${email}`);
      }
    }

    // 2. Insert notification into founder_notifications
    const notifBody = {
      title: `College Fee Received: ${name}`,
      message: `${name} · (GPREC) · Tx: RZP-${paymentId} (RRN: ${bankRrn || 'N/A'})`,
      type: 'payment',
      created_at: nowIso,
      meta: {
        name,
        email,
        college,
        amount,
        txId: `RZP-${paymentId}`,
        paymentId,
        bankRrn,
        paidAt: nowIso,
        status: 'verified'
      }
    };

    await fetch(
      `${SUPABASE_URL}/rest/v1/founder_notifications`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(notifBody)
      }
    );

    return new Response(JSON.stringify({ 
      status: 'success', 
      email, 
      paymentId, 
      message: 'Payment verified and recorded successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('[Razorpay Webhook] Error processing webhook:', err);
    return new Response(JSON.stringify({ status: 'error', error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
