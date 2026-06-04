// NOVA EMPRENDE — create-paddle-checkout (modo sandbox)
// Crea una transacción Paddle y devuelve la URL de checkout.
// Requiere PADDLE_API_KEY configurada en Lovable Cloud secrets.
// PADDLE_ENVIRONMENT por defecto: 'sandbox'.

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const paddleKey = Deno.env.get("PADDLE_API_KEY");
    if (!paddleKey) {
      return json(
        { error: "PADDLE_API_KEY pendiente de configurar en Lovable Cloud secrets." },
        503,
      );
    }
    const paddleEnv = (Deno.env.get("PADDLE_ENVIRONMENT") || "sandbox").toLowerCase();
    const paddleBase =
      paddleEnv === "live" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "No autenticado." }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await supabaseUser.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) return json({ error: "Sesión inválida." }, 401);
    const userId = claimsData.claims.sub as string;
    const userEmail = (claimsData.claims.email as string) ?? "";

    const body = await req.json().catch(() => ({}));
    const productSlug = body?.product_slug as string | undefined;
    const country = (body?.country as string | undefined)?.toUpperCase() ?? null;
    const buyerEmail = (body?.email as string | undefined) || userEmail;
    if (!productSlug) return json({ error: "product_slug requerido." }, 400);

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    const { data: product, error: prodErr } = await supabaseAdmin
      .from("products")
      .select("id, slug, name, price, currency, paddle_price_id, active")
      .eq("slug", productSlug)
      .eq("active", true)
      .maybeSingle();
    if (prodErr || !product) return json({ error: "Producto no encontrado." }, 404);
    if (!product.paddle_price_id) {
      return json({ error: "Este producto no tiene paddle_price_id configurado." }, 400);
    }

    const origin = req.headers.get("origin") || req.headers.get("referer") || "";
    const successUrl = `${origin}/clientes/compras-facturas?payment=success`;
    const cancelUrl = `${origin}/checkout/${product.slug}?payment=cancelled`;

    const { data: pending, error: pendErr } = await supabaseAdmin
      .from("purchases")
      .insert({
        user_id: userId,
        product_id: product.id,
        amount: product.price ?? 0,
        currency: product.currency ?? "EUR",
        status: "pending",
        provider: "paddle",
      })
      .select("id")
      .single();
    if (pendErr) console.error("[create-paddle-checkout] no se pudo registrar pending", pendErr);

    // Crear transacción Paddle (sandbox por defecto)
    const txRes = await fetch(`${paddleBase}/transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paddleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ price_id: product.paddle_price_id, quantity: 1 }],
        customer: buyerEmail ? { email: buyerEmail } : undefined,
        checkout: { url: cancelUrl },
        custom_data: {
          user_id: userId,
          product_id: product.id,
          product_slug: product.slug,
          country: country ?? "",
          purchase_id: pending?.id ?? "",
          success_url: successUrl,
        },
      }),
    });

    const txJson = await txRes.json();
    if (!txRes.ok) {
      console.error("[create-paddle-checkout] paddle error", txJson);
      return json(
        { error: txJson?.error?.detail || "Error creando transacción Paddle." },
        txRes.status,
      );
    }

    const checkoutUrl: string | undefined = txJson?.data?.checkout?.url;
    if (!checkoutUrl) {
      return json({ error: "Paddle no devolvió URL de checkout." }, 500);
    }

    return json({
      url: checkoutUrl,
      transaction_id: txJson?.data?.id,
      mode: paddleEnv,
    });
  } catch (err: any) {
    console.error("[create-paddle-checkout] error", err);
    return json({ error: err?.message || "Error interno." }, 500);
  }
});
