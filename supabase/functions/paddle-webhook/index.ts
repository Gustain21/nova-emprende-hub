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
  const userId = custom?.user_id as string | undefined;
  const productId = custom?.product_id as string | undefined;
  const purchaseId = custom?.purchase_id as string | undefined;
  const transactionId = data?.id as string | undefined;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    if (eventType === "transaction.paid" || eventType === "transaction.completed") {
      if (!userId || !productId) {
        console.warn("[paddle-webhook] custom_data incompleto", custom);
      } else {
        if (purchaseId) {
          await supabase
            .from("purchases")
            .update({
              status: "paid",
              provider: "paddle",
              provider_payment_id: transactionId ?? null,
            })
            .eq("id", purchaseId);
        } else {
          await supabase.from("purchases").insert({
            user_id: userId,
            product_id: productId,
            status: "paid",
            provider: "paddle",
            provider_payment_id: transactionId ?? null,
          });
        }

        const { data: existing } = await supabase
          .from("entitlements")
          .select("id")
          .eq("user_id", userId)
          .eq("product_id", productId)
          .eq("active", true)
          .maybeSingle();
        if (!existing) {
          await supabase.from("entitlements").insert({
            user_id: userId,
            product_id: productId,
            active: true,
            access_type: "lifetime",
            source_purchase_id: purchaseId ?? null,
          });
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
        await supabase
          .from("entitlements")
          .update({ active: false })
          .eq("user_id", userId)
          .eq("product_id", productId);
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
