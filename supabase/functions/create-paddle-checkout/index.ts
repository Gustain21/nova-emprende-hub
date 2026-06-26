// NOVA EMPRENDE — create-paddle-checkout (público, sandbox)
// Crea una transacción Paddle. No requiere sesión: el checkout es público.
// La activación de entitlements se hace exclusivamente desde paddle-webhook.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    console.log("create-paddle-checkout called");

    const paddleKey = Deno.env.get("PADDLE_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    console.log("env presence", {
      PADDLE_API_KEY: !!paddleKey,
      SUPABASE_URL: !!supabaseUrl,
      SUPABASE_SERVICE_ROLE_KEY: !!serviceKey,
    });

    if (!paddleKey) return json({ error: "config_error", detail: "PADDLE_API_KEY missing" }, 500);
    if (!supabaseUrl || !serviceKey) {
      return json({ error: "config_error", detail: "Supabase env missing" }, 500);
    }

    const paddleEnv = (Deno.env.get("PADDLE_ENVIRONMENT") || "sandbox").toLowerCase();
    const paddleBase =
      paddleEnv === "live" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";

    const body = await req.json().catch(() => ({}));
    const slug = (body?.slug || body?.product_slug) as string | undefined;
    const rawEmail = (body?.email as string | undefined)?.trim().toLowerCase();
    const country = (body?.country as string | undefined)?.toUpperCase() ?? null;
    console.log("Checkout buyer email:", rawEmail);
    console.log("Checkout product slug:", slug);

    if (!slug) return json({ error: "invalid_request", detail: "slug requerido" }, 400);
    if (!rawEmail || !EMAIL_RE.test(rawEmail)) {
      return json({ error: "invalid_request", detail: "email inválido" }, 400);
    }
    const email = rawEmail;

    // Optional auth (user_id si hay sesión)
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ") && anonKey) {
      try {
        const supaUser = createClient(supabaseUrl, anonKey, {
          global: { headers: { Authorization: authHeader } },
        });
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supaUser.auth.getClaims(token);
        userId = (data?.claims?.sub as string) ?? null;
      } catch (_) {
        userId = null;
      }
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    const { data: product, error: prodErr } = await supabaseAdmin
      .from("products")
      .select("id, slug, name, price, currency, paddle_price_id, active")
      .eq("slug", slug)
      .maybeSingle();

    if (prodErr || !product) {
      return json({ error: "product_not_found", detail: "Producto no encontrado" }, 404);
    }
    if (!product.active) {
      return json({ error: "product_inactive", detail: "Producto no activo" }, 400);
    }
    if (!product.paddle_price_id) {
      return json({ error: "missing_paddle_price_id", detail: "Producto sin paddle_price_id" }, 400);
    }
    console.log("product found", { id: product.id, slug: product.slug });
    console.log("paddle_price_id found");

    const origin =
      req.headers.get("origin") ||
      (req.headers.get("referer") ? new URL(req.headers.get("referer")!).origin : "") ||
      "https://bigbang-business-suite.lovable.app";
    const checkoutReturnUrl = `${origin}/pagar/${product.slug}`;

    console.log("creating paddle transaction");
    const txRes = await fetch(`${paddleBase}/transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paddleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ price_id: product.paddle_price_id, quantity: 1 }],
        customer: { email },
        checkout: { url: checkoutReturnUrl },
        custom_data: {
          product_id: product.id,
          product_slug: product.slug,
          buyer_email: email,
          user_id: userId,
          country: country ?? "",
          source: "public_pagar_checkout",
        },
      }),
    });

    const txJson = await txRes.json().catch(() => ({}));
    if (!txRes.ok) {
      const err = txJson?.error ?? {};
      console.log("paddle error", { code: err?.code, detail: err?.detail });
      return json(
        {
          error: "paddle_error",
          code: err?.code ?? `http_${txRes.status}`,
          detail: err?.detail ?? "Paddle rechazó la transacción",
          documentation_url: err?.documentation_url ?? null,
          rawPaddleError: {
            type: err?.type,
            errors: err?.errors,
          },
        },
        200, // 200 para que el frontend reciba el body legible en supabase.functions.invoke
      );
    }

    const transaction_id: string | undefined = txJson?.data?.id;
    const checkout_url: string | undefined = txJson?.data?.checkout?.url;
    console.log("paddle transaction created", { transaction_id });

    return json({
      transaction_id,
      checkout_url,
      url: checkout_url, // compat
      mode: paddleEnv,
      debug_buyer_email: email,
    });
  } catch (err: any) {
    console.error("create-paddle-checkout fatal", err);
    return json({ error: "internal_error", detail: err?.message || "Error interno" }, 500);
  }
});
