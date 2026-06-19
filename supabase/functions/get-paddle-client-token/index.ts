import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve((req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const token = Deno.env.get('PADDLE_CLIENT_TOKEN') || '';
  const environment = Deno.env.get('PADDLE_ENVIRONMENT') || 'sandbox';
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'missing_token', detail: 'PADDLE_CLIENT_TOKEN is not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
  return new Response(JSON.stringify({ token, environment }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
