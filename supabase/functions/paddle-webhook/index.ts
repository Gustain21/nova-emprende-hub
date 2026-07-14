// NOVA EMPRENDE — paddle-webhook (scaffold, modo sandbox)
// Procesa eventos Paddle: transaction.paid, transaction.completed,
// transaction.canceled, transaction.payment_failed, transaction.refunded.
// Requiere PADDLE_WEBHOOK_SECRET configurada en Lovable Cloud secrets.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "paddle-signature, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Verifica la firma HMAC-SHA256 del webhook Paddle.
// Header: paddle-signature: ts=...;h1=...
async function verifyPaddleSignature(rawBody: string, header: string, secret: string) {
  const parts = Object.fromEntries(
    header.split(";").map((p) => {
      const [k, v] = p.split("=");
      return [k.trim(), v?.trim() ?? ""];
    }),
  );
  const ts = parts["ts"];
  const h1 = parts["h1"];
  if (!ts || !h1) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${ts}:${rawBody}`));
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computed === h1;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const webhookSecret = Deno.env.get("PADDLE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    return new Response("PADDLE_WEBHOOK_SECRET pendiente de configurar.", { status: 503 });
  }

  const sigHeader = req.headers.get("paddle-signature");
  const rawBody = await req.text();
  if (!sigHeader || !(await verifyPaddleSignature(rawBody, sigHeader, webhookSecret))) {
    return new Response("Firma Paddle inválida", { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const eventType: string = event?.event_type ?? "";
  const data: any = event?.data ?? {};
  const custom = data?.custom_data ?? {};
  let userId = (custom?.user_id as string | undefined) || undefined;
  let productId = (custom?.product_id as string | undefined) || undefined;
  const productSlug = (custom?.product_slug as string | undefined) || undefined;
  const purchaseId = custom?.purchase_id as string | undefined;
  const transactionId = data?.id as string | undefined;
  const buyerEmailRaw =
    (custom?.buyer_email as string | undefined) ||
    (data?.customer?.email as string | undefined) ||
    (data?.billing_details?.email as string | undefined) ||
    "";
  const buyerEmail = buyerEmailRaw.trim().toLowerCase() || null;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Resuelve product_id por slug si viene sólo el slug
  if (!productId && productSlug) {
    const { data: prod } = await supabase
      .from("products")
      .select("id")
      .eq("slug", productSlug)
      .maybeSingle();
    if (prod?.id) productId = prod.id as string;
  }

  // Intenta resolver user_id por email si el comprador ya tiene cuenta
  if (!userId && buyerEmail) {
    try {
      const { data: list } = await (supabase as any).auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      const match = list?.users?.find(
        (u: any) => (u.email ?? "").toLowerCase() === buyerEmail,
      );
      if (match?.id) userId = match.id as string;
    } catch (e) {
      console.warn("[paddle-webhook] listUsers failed", e);
    }
  }

  console.log("[paddle-webhook] event", {
    eventType,
    hasUserId: !!userId,
    productId,
    productSlug,
    buyerEmail,
    transactionId,
  });

  try {
    if (eventType === "transaction.paid" || eventType === "transaction.completed") {
      if (!productId) {
        console.warn("[paddle-webhook] sin product_id/product_slug, no puedo registrar", custom);
      } else {
        if (purchaseId) {
          await supabase
            .from("purchases")
            .update({
              status: "paid",
              provider: "paddle",
              provider_payment_id: transactionId ?? null,
              email: buyerEmail,
              ...(userId ? { user_id: userId } : {}),
            })
            .eq("id", purchaseId);
        } else {
          await supabase.from("purchases").insert({
            user_id: userId ?? null,
            product_id: productId,
            status: "paid",
            provider: "paddle",
            provider_payment_id: transactionId ?? null,
            email: buyerEmail,
          });
        }

        // Concede entitlements sólo si ya conocemos al usuario.
        // Si no, la compra queda pendiente de reclamar (claim_purchases_by_email al iniciar sesión).
        if (userId) {
          const { error: grantErr } = await supabase.rpc("grant_purchase_entitlements", {
            p_user_id: userId,
            p_product_id: productId,
            p_purchase_id: purchaseId ?? null,
          });
          if (grantErr) console.error("[paddle-webhook] grant rpc error", grantErr);
        } else {
          console.log("[paddle-webhook] compra registrada como invitada, pendiente de reclamar");
        }
      }
    } else if (
      eventType === "transaction.canceled" ||
      eventType === "transaction.payment_failed"
    ) {
      if (purchaseId) {
        await supabase.from("purchases").update({ status: "failed" }).eq("id", purchaseId);
      }
    } else if (eventType === "transaction.refunded") {
      if (purchaseId) {
        await supabase.from("purchases").update({ status: "refunded" }).eq("id", purchaseId);
      }
      if (userId && productId) {
        const { error: revErr } = await supabase.rpc("revoke_purchase_entitlements", {
          p_user_id: userId,
          p_product_id: productId,
        });
        if (revErr) console.error("[paddle-webhook] revoke rpc error", revErr);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[paddle-webhook] handler error", err);
    return new Response(`Handler error: ${err.message}`, { status: 500 });
  }
});
