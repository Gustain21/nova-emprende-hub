// NOVA EMPRENDE — verify-paddle-prices
// Consulta cada price en Paddle y lo compara con products.price_eur.
// Solo lectura. No modifica nada.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const paddleKey = Deno.env.get("PADDLE_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!paddleKey) return json({ error: "config_error", detail: "PADDLE_API_KEY missing" }, 500);
    if (!supabaseUrl || !serviceKey) {
      return json({ error: "config_error", detail: "Supabase env missing" }, 500);
    }

    const paddleEnv = (Deno.env.get("PADDLE_ENVIRONMENT") || "sandbox").toLowerCase();
    const paddleBase =
      paddleEnv === "live" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";

    const supa = createClient(supabaseUrl, serviceKey);
    const { data: products, error: dbErr } = await supa
      .from("products")
      .select("slug, name, price_eur, paddle_price_id, active")
      .eq("active", true)
      .not("paddle_price_id", "is", null)
      .order("slug");

    if (dbErr) return json({ error: "db_error", detail: dbErr.message }, 500);

    const results: Array<Record<string, unknown>> = [];
    for (const p of products ?? []) {
      const row: Record<string, unknown> = {
        slug: p.slug,
        name: p.name,
        paddle_price_id: p.paddle_price_id,
        expected_eur: p.price_eur,
        paddle_amount_eur: null,
        paddle_currency: null,
        paddle_status: null,
        match: false,
        error: null,
      };
      try {
        const r = await fetch(`${paddleBase}/prices/${p.paddle_price_id}`, {
          headers: { Authorization: `Bearer ${paddleKey}` },
        });
        const body = await r.json();
        if (!r.ok) {
          row.error = body?.error?.detail || body?.error?.code || `HTTP ${r.status}`;
        } else {
          const price = body?.data ?? {};
          const cents = Number(price?.unit_price?.amount ?? NaN);
          const currency = price?.unit_price?.currency_code ?? null;
          const status = price?.status ?? null;
          const amountEur = Number.isFinite(cents) ? cents / 100 : null;
          row.paddle_amount_eur = amountEur;
          row.paddle_currency = currency;
          row.paddle_status = status;
          row.match =
            currency === "EUR" &&
            amountEur !== null &&
            Number(p.price_eur) !== null &&
            Math.abs(amountEur - Number(p.price_eur)) < 0.005;
        }
      } catch (e) {
        row.error = (e as Error).message;
      }
      results.push(row);
    }

    const mismatches = results.filter((r) => !r.match);
    return json({
      environment: paddleEnv,
      total: results.length,
      ok: results.length - mismatches.length,
      mismatches: mismatches.length,
      results,
    });
  } catch (e) {
    return json({ error: "internal_error", detail: (e as Error).message }, 500);
  }
});
