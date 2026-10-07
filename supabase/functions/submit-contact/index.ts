// Recepción de mensajes de contacto. Guarda en contact_messages (privada, solo servidor).
// No hay proveedor de email configurado: el aviso a hola@editorialnovaemprende.com queda
// pendiente (notification_status = 'pending_no_provider'). No se envía ningún correo.
import { createClient } from "npm:@supabase/supabase-js@2";
import { validateContact } from "./validate.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

const MAX_PER_HOUR = 5;

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "Solicitud inválida" }, 400); }

  const v = validateContact(body);
  if (!v.ok) return json({ error: v.spam ? "No se pudo procesar el mensaje" : v.error }, 400);

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const ipHash = ip ? await sha256(`contact:${ip}`) : null;

  if (ipHash) {
    const since = new Date(Date.now() - 3600_000).toISOString();
    const { count, error } = await supabase.from("contact_messages")
      .select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
    if (error) { console.error("[submit-contact] rate check", error.message); return json({ error: "Error del servidor" }, 500); }
    if ((count ?? 0) >= MAX_PER_HOUR) return json({ error: "Demasiados mensajes. Inténtalo más tarde." }, 429);
  }

  const { error } = await supabase.from("contact_messages").insert({
    ...v.data,
    ip_hash: ipHash,
    user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300),
  });
  if (error) { console.error("[submit-contact] insert", error.message); return json({ error: "Error del servidor" }, 500); }

  return json({ received: true, email_notification: "pending" });
});
