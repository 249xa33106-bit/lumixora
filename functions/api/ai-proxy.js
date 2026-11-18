/**
 * Cloudflare Pages Function: /api/ai-proxy
 * Secure Edge AI Gateway: Keeps API keys 100% secret from client bundles.
 */

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const body = await context.request.json().catch(() => ({}));
    const { messages = [], prompt = '', systemInstruction = '', temperature = 0.7, maxTokens = 2048 } = body;

    // Resolve credentials from server environment secrets (never exposed to browser)
    const geminiKey = context.env?.GEMINI_API_KEY || context.env?.VITE_GEMINI_API_KEY || '';
    const groqKey = context.env?.GROQ_API_KEY || context.env?.VITE_GROQ_API_KEY || '';
    const openRouterKey = context.env?.OPENROUTER_API_KEY || context.env?.VITE_OPENROUTER_API_KEY || '';

    // If no keys configured on Cloudflare env, return fallback hint to client
    if (!geminiKey && !groqKey && !openRouterKey) {
      return new Response(
        JSON.stringify({ ok: false, error: 'No server keys configured in Cloudflare environment', fallback: true }),
        { status: 200, headers: corsHeaders }
      );
    }

    // Prepare unified messages array
    const chatMessages = messages.length > 0 ? messages : [{ role: 'user', content: prompt }];
    if (systemInstruction && !chatMessages.some(m => m.role === 'system')) {
      chatMessages.unshift({ role: 'system', content: systemInstruction });
    }

    // 1. Primary Edge Engine: Groq Ultra-Low Latency
    if (groqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: chatMessages.map(m => ({
              role: m.role === 'ai' ? 'assistant' : m.role,
              content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
            })),
            temperature,
            max_tokens: Math.min(maxTokens, 4096),
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const content = data.choices?.[0]?.message?.content?.trim();
          if (content) {
            return new Response(JSON.stringify({ ok: true, content, engine: 'groq-llama-3.3' }), {
              status: 200,
              headers: corsHeaders,
            });
          }
        }
      } catch (err) {
        // Fallback to Gemini
      }
    }

    // 2. Secondary Edge Engine: Gemini 1.5 Flash
    if (geminiKey) {
      try {
        const promptText = chatMessages
          .map(m => `${m.role.toUpperCase()}: ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`)
          .join('\n\n');

        const gRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: {
                temperature,
                maxOutputTokens: Math.min(maxTokens, 4096),
              },
            }),
          }
        );

        if (gRes.ok) {
          const data = await gRes.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (content) {
            return new Response(JSON.stringify({ ok: true, content, engine: 'gemini-1.5-flash' }), {
              status: 200,
              headers: corsHeaders,
            });
          }
        }
      } catch (err) {
        // Fallback to OpenRouter
      }
    }

    // 3. Fallback Edge Engine: OpenRouter
    if (openRouterKey) {
      try {
        const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: chatMessages,
            temperature,
            max_tokens: Math.min(maxTokens, 4096),
          }),
        });

        if (orRes.ok) {
          const data = await orRes.json();
          const content = data.choices?.[0]?.message?.content?.trim();
          if (content) {
            return new Response(JSON.stringify({ ok: true, content, engine: 'openrouter' }), {
              status: 200,
              headers: corsHeaders,
            });
          }
        }
      } catch (err) {
        // Failed
      }
    }

    return new Response(
      JSON.stringify({ ok: false, error: 'All edge AI providers were unavailable', fallback: true }),
      { status: 502, headers: corsHeaders }
    );
  } catch (globalErr) {
    return new Response(
      JSON.stringify({ ok: false, error: globalErr.message || 'Server error', fallback: true }),
      { status: 500, headers: corsHeaders }
    );
  }
}
