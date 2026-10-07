// NOVA EMPRENDE — paddle-webhook (compatible Sandbox y Live)
// El entorno lo determina PADDLE_ENVIRONMENT; el secret usado es PADDLE_WEBHOOK_SECRET.
// Procesa eventos Paddle: transaction.paid, transaction.completed,
// transaction.canceled, transaction.payment_failed, adjustment.created, adjustment.updated.
// Requiere PADDLE_WEBHOOK_SECRET configurada en Lovable Cloud secrets.

import { createClient } from "npm:@supabase/supabase-js@2";
import { handlePaddleEvent } from "./handler.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "paddle-signature, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Verificación oficial Paddle: header `paddle-signature: ts=<unix>;h1=<hex>`
// HMAC-SHA256 sobre `${ts}:${rawBody}` con el webhook secret, comparación
// en tiempo constante y validación de timestamp para evitar replay.
const MAX_SIGNATURE_AGE_SECONDS = 5;

const timingSafeEqualHex = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

async function verifyPaddleSignature(rawBody: string, header: string, secret: string) {
  const parts: Record<string, string> = {};
  for (const p of header.split(";")) {
    const idx = p.indexOf("=");
    if (idx === -1) continue;
    parts[p.slice(0, idx).trim()] = p.slice(idx + 1).trim();
  }
  const ts = parts["ts"];
  const h1 = (parts["h1"] || "").toLowerCase();
  if (!ts || !h1 || !/^\d+$/.test(ts) || !/^[0-9a-f]{64}$/.test(h1)) return false;

  // Anti-replay: rechaza marcas de tiempo demasiado antiguas o futuras.
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(ts));
  if (!Number.isFinite(age) || age > MAX_SIGNATURE_AGE_SECONDS) {
    console.warn("[paddle-webhook] timestamp fuera de ventana", { age });
    return false;
  }

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
  return timingSafeEqualHex(computed, h1);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const paddleEnv =
    (Deno.env.get("PADDLE_ENVIRONMENT") || "sandbox").toLowerCase() === "live" ? "live" : "sandbox";
  const secretName = paddleEnv === "live" ? "PADDLE_WEBHOOK_SECRET_LIVE" : "PADDLE_WEBHOOK_SECRET";
  const webhookSecret = Deno.env.get(secretName);
  if (!webhookSecret) {
    console.error("[paddle-webhook] secret ausente", { paddleEnv, secretName });
    return new Response(`${secretName} pendiente de configurar.`, { status: 503 });
  }

  const sigHeader = req.headers.get("paddle-signature");
  const rawBody = await req.text();
  if (!sigHeader || !(await verifyPaddleSignature(rawBody, sigHeader, webhookSecret))) {
    // Se rechaza ANTES de procesar cualquier evento.
    console.warn("[paddle-webhook] firma inválida, evento descartado");
    return new Response("Firma Paddle inválida", { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const result = await handlePaddleEvent(event, {
      rpc: (fn, args) => supabase.rpc(fn, args) as any,
      findProductIdBySlug: async (slug) => {
        const { data, error } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
        if (error) throw new Error(`products lookup: ${error.message}`);
        return (data?.id as string) ?? null;
      },
      log: (msg, meta) => console.log(`[paddle-webhook] ${msg}`, meta ?? {}),
    });
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    // 500 => Paddle reintenta. No se incluyen datos personales.
    console.error("[paddle-webhook] error, Paddle reintentará", {
      eventType: event?.event_type,
      message: err?.message,
    });
    return new Response("Handler error", { status: 500 });
  }
});
