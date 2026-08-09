import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Devuelve SOLO el client-side token público de Paddle.js (nunca API keys ni
// webhook secrets). Sandbox es el valor seguro por defecto.
Deno.serve((req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const environment =
    (Deno.env.get('PADDLE_ENVIRONMENT') || 'sandbox').toLowerCase() === 'live' ? 'live' : 'sandbox';
  const tokenName = environment === 'live' ? 'PADDLE_CLIENT_TOKEN_LIVE' : 'PADDLE_CLIENT_TOKEN';
  const token = Deno.env.get(tokenName) || '';

  if (!token) {
    return new Response(
      JSON.stringify({
        error: 'missing_token',
        detail: `${tokenName} is not configured for environment "${environment}"`,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify({ token, environment }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
