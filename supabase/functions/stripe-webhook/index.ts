// NOVA EMPRENDE — stripe-webhook (scaffold, modo test)
// Procesa eventos de Stripe: checkout.session.completed, payment_intent.succeeded,
// payment_intent.payment_failed, charge.refunded.
// Requiere STRIPE_SECRET_KEY y STRIPE_WEBHOOK_SECRET en Lovable Cloud secrets.

import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "stripe-signature, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey) {
    return new Response("STRIPE_SECRET_KEY pendiente de configurar.", { status: 503 });
  }
  if (!webhookSecret) {
    return new Response("STRIPE_WEBHOOK_SECRET pendiente de configurar.", { status: 503 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("[stripe-webhook] firma inválida", err?.message);
    return new Response(`Webhook signature error: ${err.message}`, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "payment_intent.succeeded": {
        const obj: any = event.data.object;
        const metadata =
          (event.type === "checkout.session.completed" ? obj.metadata : obj.metadata) ?? {};
        const userId = metadata.user_id as string | undefined;
        const productId = metadata.product_id as string | undefined;
        const purchaseId = metadata.purchase_id as string | undefined;
        const providerPaymentId =
          event.type === "checkout.session.completed"
            ? (obj.payment_intent as string) || obj.id
            : obj.id;

        if (!userId || !productId) {
          console.warn("[stripe-webhook] metadata incompleta", metadata);
          break;
        }

        if (purchaseId) {
          await supabase
            .from("purchases")
            .update({
              status: "paid",
              provider: "stripe",
              provider_payment_id: providerPaymentId,
            })
            .eq("id", purchaseId);
        } else {
          await supabase.from("purchases").insert({
            user_id: userId,
            product_id: productId,
            status: "paid",
            provider: "stripe",
            provider_payment_id: providerPaymentId,
          });
        }

        // Concede entitlements expandiendo bundles si corresponde.
        const { error: grantErr } = await supabase.rpc("grant_purchase_entitlements", {
          p_user_id: userId,
          p_product_id: productId,
          p_purchase_id: purchaseId ?? null,
        });
        if (grantErr) console.error("[stripe-webhook] grant rpc error", grantErr);
        break;
      }

      case "payment_intent.payment_failed": {
        const obj: any = event.data.object;
        const purchaseId = obj?.metadata?.purchase_id as string | undefined;
        if (purchaseId) {
          await supabase.from("purchases").update({ status: "failed" }).eq("id", purchaseId);
        }
        break;
      }

      case "charge.refunded": {
        const obj: any = event.data.object;
        const paymentIntent = obj.payment_intent as string | undefined;
        if (paymentIntent) {
          const { data: purchase } = await supabase
            .from("purchases")
            .select("id, user_id, product_id")
            .eq("provider_payment_id", paymentIntent)
            .maybeSingle();
          if (purchase) {
            await supabase.from("purchases").update({ status: "refunded" }).eq("id", purchase.id);
            const { error: revErr } = await supabase.rpc("revoke_purchase_entitlements", {
              p_user_id: purchase.user_id,
              p_product_id: purchase.product_id,
            });
            if (revErr) console.error("[stripe-webhook] revoke rpc error", revErr);
          }
        }
        break;
      }

      default:
        // Otros eventos ignorados en esta fase
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[stripe-webhook] handler error", err);
    return new Response(`Handler error: ${err.message}`, { status: 500 });
  }
});
