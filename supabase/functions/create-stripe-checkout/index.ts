// NOVA EMPRENDE — create-stripe-checkout (modo test)
// Crea una Stripe Checkout Session a partir del slug del producto.
// Requiere STRIPE_SECRET_KEY (sk_test_...) configurada en Lovable Cloud secrets.

import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

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
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return json(
        { error: "STRIPE_SECRET_KEY pendiente de configurar en Lovable Cloud secrets." },
        503,
      );
    }
    if (!stripeKey.startsWith("sk_test_")) {
      console.warn("[create-stripe-checkout] STRIPE_SECRET_KEY no es de modo test.");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "No autenticado." }, 401);
    }

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
      .select("id, slug, name, price, currency, stripe_price_id, active")
      .eq("slug", productSlug)
      .eq("active", true)
      .maybeSingle();

    if (prodErr || !product) return json({ error: "Producto no encontrado." }, 404);
    if (!product.stripe_price_id) {
      return json({ error: "Este producto no tiene stripe_price_id configurado." }, 400);
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });

    const origin = req.headers.get("origin") || req.headers.get("referer") || "";
    const successUrl = `${origin}/clientes/compras-facturas?payment=success`;
    const cancelUrl = `${origin}/checkout/${product.slug}?payment=cancelled`;

    // Registro de compra "pending" antes de redirigir
    const { data: pending, error: pendErr } = await supabaseAdmin
      .from("purchases")
      .insert({
        user_id: userId,
        product_id: product.id,
        amount: product.price ?? 0,
        currency: product.currency ?? "EUR",
        status: "pending",
        provider: "stripe",
      })
      .select("id")
      .single();
    if (pendErr) console.error("[create-stripe-checkout] no se pudo registrar pending", pendErr);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: product.stripe_price_id, quantity: 1 }],
      customer_email: buyerEmail || undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        product_id: product.id,
        product_slug: product.slug,
        country: country ?? "",
        purchase_id: pending?.id ?? "",
      },
      // Preparado para Stripe Tax en fases posteriores:
      // automatic_tax: { enabled: true },
    });

    return json({ url: session.url, session_id: session.id, mode: "test" });
  } catch (err: any) {
    console.error("[create-stripe-checkout] error", err);
    return json({ error: err?.message || "Error interno." }, 500);
  }
});
