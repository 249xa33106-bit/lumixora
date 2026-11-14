/**
 * Cloudflare Pages Function: /api/check-payment
 * Checks whether a given scholar email has a verified ₹10 payment record
 * in Supabase users table or founder_notifications table.
 */

const SUPABASE_URL = 'https://ykuyzkhhnltjccyzduap.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';

// Whitelist of pre-verified paid emails
const KNOWN_PAID_SET = new Set([
  'dean.placements@gprec.ac.in',
  'srikanth.csm@gprec.ac.in',
  '249xa04050@gprec.ac.in',
  '249xa33112@gprec.ac.in',
  '259xa05010@gprec.ac.in',
  '259xa33230@gprec.ac.in',
  '259xa05269@gprec.ac.in',
  '259xa05089@gprec.ac.in',
  '249xa33005@gprec.ac.in',
  '259xa33022@gprec.ac.in',
  '259xa33320@gprec.ac.in',
  '259xa04138@gprec.ac.in',
  '259xa33079@gprec.ac.in',
  '269xa05526@gprec.ac.in'
]);

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const email = (url.searchParams.get('email') || '').toLowerCase().trim();

  if (!email) {
    return new Response(JSON.stringify({ paid: false, error: 'Email parameter required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  // 1. Check known paid email whitelist
  if (KNOWN_PAID_SET.has(email)) {
    return new Response(JSON.stringify({ 
      paid: true, 
      email, 
      txId: 'VERIFIED_WHITELIST',
      source: 'whitelist' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    // 2. Query Supabase users table
    const usersResp = await fetch(
      `${SUPABASE_URL}/rest/v1/users?email=ilike.${encodeURIComponent(email)}&select=id,name,email,is_approved`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    if (usersResp.ok) {
      const users = await usersResp.json();
      if (Array.isArray(users) && users.length > 0) {
        const u = users[0];
        const rawName = u.name || '';
        if (rawName.includes('{')) {
          try {
            const meta = JSON.parse(rawName.substring(rawName.indexOf('{')));
            if (meta.oneTimeFeePaid === true || meta.feePaid === true || meta.is_fee_paid === true) {
              return new Response(JSON.stringify({
                paid: true,
                email,
                txId: meta.feeTxId || 'RZP-VERIFIED',
                paymentMethod: meta.paymentMethod || 'Razorpay',
                paidAt: meta.feePaidAt || null,
                source: 'supabase_user'
              }), {
                status: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
              });
            }
          } catch (e) {}
        }
      }
    }

    // 3. Query founder_notifications for payment matching this email
    const notifResp = await fetch(
      `${SUPABASE_URL}/rest/v1/founder_notifications?type=eq.payment&order=created_at.desc&limit=100`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    if (notifResp.ok) {
      const notifs = await notifResp.json();
      if (Array.isArray(notifs)) {
        const match = notifs.find(n => {
          const metaEmail = (n.meta?.email || '').toLowerCase().trim();
          const msg = (n.message || '').toLowerCase();
          return metaEmail === email || msg.includes(email);
        });

        if (match) {
          return new Response(JSON.stringify({
            paid: true,
            email,
            txId: match.meta?.txId || `RZP-${match.meta?.paymentId || 'VERIFIED'}`,
            paymentMethod: match.meta?.paymentMethod || 'Razorpay',
            paidAt: match.created_at || null,
            source: 'founder_notifications'
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }
      }
    }

    // Not paid
    return new Response(JSON.stringify({
      paid: false,
      email,
      message: 'No verified ₹10 payment found. Please complete payment via Razorpay.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ paid: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
