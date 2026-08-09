// NOVA EMPRENDE — create-paddle-checkout (público, sandbox)
// Crea una transacción Paddle. No requiere sesión: el checkout es público.
// La activación de entitlements se hace exclusivamente desde paddle-webhook.

import { createClient } from "npm:@supabase/supabase-js@2";
import {
  countryFromHeaders,
  currencyForCountry,
  normalizeCountry,
  paddleApiBase,
  paddleApiKey,
  paddleApiKeyName,
  paddleEnvironment,
} from "../_shared/currencyRule.ts";

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

    const paddleEnv = paddleEnvironment();
    const paddleBase = paddleApiBase(paddleEnv);
    const paddleKeyName = paddleApiKeyName(paddleEnv);
    const paddleKey = paddleApiKey(paddleEnv);
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    console.log("env presence", {
      paddle_environment: paddleEnv,
      [paddleKeyName]: !!paddleKey,
      SUPABASE_URL: !!supabaseUrl,
      SUPABASE_SERVICE_ROLE_KEY: !!serviceKey,
    });

    if (!paddleKey) {
      return json(
        {
          error: "config_error",
          detail: `${paddleKeyName} missing para el entorno Paddle "${paddleEnv}"`,
        },
        500,
      );
    }
    if (!supabaseUrl || !serviceKey) {
      return json({ error: "config_error", detail: "Supabase env missing" }, 500);
    }

    const body = await req.json().catch(() => ({}));
    const slug = (body?.slug || body?.product_slug) as string | undefined;
    const rawEmail = (body?.email as string | undefined)?.trim().toLowerCase();
    // El país de headers de red (mismos que geo-detect) prevalece sobre el del cliente.
    const headerCountry = countryFromHeaders(req.headers);
    const clientCountry = normalizeCountry(body?.country);
    const country = headerCountry ?? clientCountry;
    const currency = currencyForCountry(country);
    console.log("Checkout buyer email:", rawEmail);
    console.log("Checkout product slug:", slug);

    if (!slug) return json({ error: "invalid_request", detail: "slug requerido" }, 400);
    if (!rawEmail || !EMAIL_RE.test(rawEmail)) {
      return json({ error: "invalid_request", detail: "email inválido" }, 400);
    }
    const email = rawEmail;

    // El consentimiento legal es obligatorio también en servidor.
    const consentIn = (body?.consent ?? {}) as Record<string, unknown>;
    if (consentIn.accept_terms !== true || consentIn.accept_immediate_access !== true) {
      return json(
        { error: "consent_required", detail: "Debes aceptar las casillas legales obligatorias." },
        400,
      );
    }


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
      .select("id, slug, name, price, currency, paddle_price_id, paddle_price_id_eur, paddle_price_id_usd, active")
      .eq("slug", slug)
      .maybeSingle();

    if (prodErr || !product) {
      return json({ error: "product_not_found", detail: "Producto no encontrado" }, 404);
    }
    if (!product.active) {
      return json({ error: "product_inactive", detail: "Producto no activo" }, 400);
    }
    // Selección de Price ID EN SERVIDOR (fuente de verdad: tabla products).
    const selectedPriceId =
      paddleEnv === "live"
        ? currency === "EUR"
          ? product.paddle_price_id_eur
          : product.paddle_price_id_usd
        : product.paddle_price_id;

    if (!selectedPriceId) {
      return json(
        { error: "missing_paddle_price_id", detail: `Producto sin price_id para ${paddleEnv}/${currency}` },
        400,
      );
    }
    console.log("product found", { id: product.id, slug: product.slug });
    console.log("price id selected", { env: paddleEnv, currency, country });

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
        items: [{ price_id: selectedPriceId, quantity: 1 }],
        customer: { email },
        checkout: { url: checkoutReturnUrl },
        custom_data: {
          product_id: product.id,
          product_slug: product.slug,
          buyer_email: email,
          user_id: userId,
          country: country ?? "",
          currency,
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

    // Registro de evidencia de consentimiento legal (servidor, service role).
    try {
      const c = (body?.consent ?? {}) as Record<string, unknown>;
      const consentText =
        "Términos y Condiciones + Política de Reembolsos aceptados; Política de Privacidad leída. " +
        "Solicito expresamente que el contenido digital adquirido esté disponible de forma inmediata, antes de que " +
        "finalice el plazo de desistimiento que pudiera corresponderme, y reconozco que, una vez iniciada la descarga, " +
        "el acceso o la utilización del contenido, puedo perder mi derecho de desistimiento cuando así lo establezca la " +
        "legislación aplicable.";

      const { error: consentErr } = await supabaseAdmin.from("legal_consents").insert({
        user_id: userId,
        email,
        product_id: product.id,
        product_slug: product.slug,
        paddle_transaction_id: transaction_id ?? null,
        legal_version: typeof c.legal_version === "string" ? c.legal_version : "2026-08-06",
        accept_terms: c.accept_terms === true,
        accept_refunds: c.accept_refunds === true,
        read_privacy: c.read_privacy === true,
        accept_immediate_access: c.accept_immediate_access === true,
        acknowledge_withdrawal_loss: c.acknowledge_withdrawal_loss === true,
        consent_text: consentText,
        country: country,
        user_agent: typeof c.user_agent === "string" ? c.user_agent.slice(0, 500) : null,
      });
      if (consentErr) console.error("consent insert error", consentErr);
    } catch (e) {
      console.error("consent insert fatal", e);
    }

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
