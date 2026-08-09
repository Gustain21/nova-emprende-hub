// NOVA EMPRENDE — verify-paddle-prices
// Solo lectura. No modifica precios ni productos. Nunca registra credenciales.
//
// Live    : verifica paddle_price_id_eur y paddle_price_id_usd contra https://api.paddle.com
//           usando PADDLE_API_KEY_LIVE. Comprueba existencia y estado (status === "active").
// Sandbox : mantiene la comprobación anterior sobre paddle_price_id con la API y credencial
//           de Sandbox, comparando el importe con products.price_eur.

import { createClient } from "npm:@supabase/supabase-js@2";
import { paddleApiBase, paddleApiKey, paddleApiKeyName, paddleEnvironment } from "../_shared/currencyRule.ts";

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
    const paddleEnv = paddleEnvironment();
    const paddleBase = paddleApiBase(paddleEnv);
    const paddleKeyName = paddleApiKeyName(paddleEnv);
    const paddleKey = paddleApiKey(paddleEnv);
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!paddleKey) {
      return json(
        { error: "config_error", detail: `${paddleKeyName} missing para el entorno "${paddleEnv}"` },
        500,
      );
    }
    if (!supabaseUrl || !serviceKey) {
      return json({ error: "config_error", detail: "Supabase env missing" }, 500);
    }

    const supa = createClient(supabaseUrl, serviceKey);
    const authHeaders = { Authorization: `Bearer ${paddleKey}`, "Content-Type": "application/json" };

    // ---------------- LIVE: verificación individual de los Price IDs EUR/USD ----------------
    if (paddleEnv === "live") {
      const { data: products, error: dbErr } = await supa
        .from("products")
        .select("slug, name, paddle_price_id_eur, paddle_price_id_usd, active")
        .eq("active", true)
        .order("slug");
      if (dbErr) return json({ error: "db_error", detail: dbErr.message }, 500);

      const results: Array<Record<string, unknown>> = [];
      for (const p of products ?? []) {
        for (const currency of ["EUR", "USD"] as const) {
          const priceId = currency === "EUR" ? p.paddle_price_id_eur : p.paddle_price_id_usd;
          const row: Record<string, unknown> = {
            product: p.name,
            slug: p.slug,
            currency,
            price_id: priceId ?? null,
            exists: false,
            status: null,
            active: false,
            price_currency: null,
            amount: null,
            error: null,
          };
          if (!priceId) {
            row.error = "price_id ausente en la base de datos";
            results.push(row);
            continue;
          }
          try {
            const r = await fetch(`${paddleBase}/prices/${priceId}`, { headers: authHeaders });
            const body = await r.json().catch(() => ({}));
            if (!r.ok) {
              row.error = body?.error?.detail || body?.error?.code || `HTTP ${r.status}`;
            } else {
              const d = body?.data ?? {};
              row.exists = true;
              row.status = d?.status ?? null;
              row.active = d?.status === "active";
              row.price_currency = d?.unit_price?.currency_code ?? null;
              const amt = Number(d?.unit_price?.amount);
              row.amount = Number.isFinite(amt) ? amt / 100 : null;
              if (row.price_currency && row.price_currency !== currency) {
                row.error = `moneda Paddle (${row.price_currency}) distinta de la esperada (${currency})`;
              }
            }
          } catch (e) {
            row.error = (e as Error).message;
          }
          results.push(row);
        }
      }

      const okRows = results.filter((r) => r.exists && r.active && !r.error);
      return json({
        environment: paddleEnv,
        credential_used: paddleKeyName,
        api_base: paddleBase,
        products_checked: (products ?? []).length,
        total_price_ids: results.length,
        ok: okRows.length,
        failed: results.length - okRows.length,
        results,
      });
    }

    // ---------------- SANDBOX: comprobación previa sobre paddle_price_id ----------------
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
        const r = await fetch(`${paddleBase}/transactions/preview`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            items: [{ price_id: p.paddle_price_id, quantity: 1 }],
            currency_code: "EUR",
            address: { country_code: "ES" },
          }),
        });
        const body = await r.json();
        if (!r.ok) {
          row.error = body?.error?.detail || body?.error?.code || `HTTP ${r.status}`;
        } else {
          const data = body?.data ?? {};
          const item = (data?.details?.line_items ?? [])[0] ?? {};
          const totalCents = Number(item?.totals?.total ?? data?.details?.totals?.total ?? NaN);
          const currency = data?.currency_code ?? null;
          const amountEur = Number.isFinite(totalCents) ? totalCents / 100 : null;
          row.paddle_amount_eur = amountEur;
          row.paddle_currency = currency;
          row.paddle_status = "preview";
          row.match =
            currency === "EUR" &&
            amountEur !== null &&
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
      credential_used: paddleKeyName,
      api_base: paddleBase,
      total: results.length,
      ok: results.length - mismatches.length,
      mismatches: mismatches.length,
      results,
    });
  } catch (e) {
    return json({ error: "internal_error", detail: (e as Error).message }, 500);
  }
});
