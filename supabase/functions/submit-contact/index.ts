// Recepción de mensajes de contacto. Guarda en contact_messages (privada, solo servidor).
// No hay proveedor de email configurado: el aviso a hola@editorialnovaemprende.com queda
// pendiente (notification_status = 'pending_no_provider'). No se envía ningún correo.
import { createClient } from "npm:@supabase/supabase-js@2";
import { clientIp, validateContact } from "./validate.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

const MAX_PER_HOUR = 5;

const MAX_GLOBAL_PER_HOUR = 60; // tope global: frena abusos aunque se falsee la IP

/** HMAC-SHA256 con sal secreta: es un hash (no cifrado), irreversible sin la sal. */
async function hmacHex(key: string, msg: string) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}



Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "Solicitud inválida" }, 400); }

  const v = validateContact(body);
  if (!v.ok) return json({ error: v.spam ? "No se pudo procesar el mensaje" : v.error }, 400);

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const salt = Deno.env.get("CONTACT_IP_SALT");
  if (!salt) { console.error("[submit-contact] CONTACT_IP_SALT ausente"); return json({ error: "Error del servidor" }, 500); }
  const ip = clientIp(req.headers);
  const ipHash = ip ? await hmacHex(salt, `contact:${ip}`) : null;
  const sinceGlobal = new Date(Date.now() - 3600_000).toISOString();
  {
    const { count, error } = await supabase.from("contact_messages")
      .select("id", { count: "exact", head: true }).gte("created_at", sinceGlobal);
    if (error) { console.error("[submit-contact] global rate", error.message); return json({ error: "Error del servidor" }, 500); }
    if ((count ?? 0) >= MAX_GLOBAL_PER_HOUR) return json({ error: "Demasiados mensajes. Inténtalo más tarde." }, 429);
  }

  if (ipHash) {
    const since = new Date(Date.now() - 3600_000).toISOString();
    const { count, error } = await supabase.from("contact_messages")
      .select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
    if (error) { console.error("[submit-contact] rate check", error.message); return json({ error: "Error del servidor" }, 500); }
    if ((count ?? 0) >= MAX_PER_HOUR) return json({ error: "Demasiados mensajes. Inténtalo más tarde." }, 429);
  }

  const { data: msg, error } = await supabase.from("contact_messages").insert({
    ...v.data,
    ip_hash: ipHash,
    user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300),
  }).select("id").single();
  if (error || !msg) { console.error("[submit-contact] insert", error?.message); return json({ error: "Error del servidor" }, 500); }

  // Aviso interno en cola persistente (idempotente por id del mensaje). Queda en
  // 'pending_email_domain' hasta que exista dominio de correo verificado; no se envía nada aún.
  const { error: qErr } = await supabase.from("email_outbox").insert({
    kind: "contact_notification",
    idempotency_key: `contact-notify-${msg.id}`,
    recipient: "hola@editorialnovaemprende.com",
    template_data: { contact_message_id: msg.id },
  });
  if (qErr) console.error("[submit-contact] outbox", qErr.message); // el mensaje ya está guardado

  return json({ received: true, email_notification: "pending" });
});
