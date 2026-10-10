// Procesa email_outbox y envía por Resend (conexión "Gustavo's Resend") vía el gateway de conectores.
// Lo llama pg_cron cada minuto con el token interno (x-worker-token). Si el envío no está
// activado (email_delivery_config.activated_at nulo), claim_email_outbox no devuelve filas.
import { createClient } from "npm:@supabase/supabase-js@2";
import { processBatch, type SendResult } from "./worker.ts";
import { CONTACT_INBOX, renderContact, renderPurchaseAccess, FROM, REPLY_TO } from "./render.ts";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json" } });

async function resendSend(msg: Record<string, unknown>, idempotencyKey: string): Promise<SendResult> {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!lovableKey || !resendKey) return { ok: false, status: 0, error: "credenciales de servidor ausentes" };
  try {
    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({ ...msg, to: [msg.to] }),
    });
    const body = await res.text();
    if (!res.ok) {
      const ra = Number(res.headers.get("retry-after"));
      return { ok: false, status: res.status, error: body.slice(0, 300), retryAfter: Number.isFinite(ra) && ra > 0 ? ra : undefined };
    }
    let id: string | undefined;
    try { id = JSON.parse(body)?.id; } catch { /* sin id */ }
    return { ok: true, status: res.status, id };
  } catch (e: any) {
    return { ok: false, status: 0, error: String(e?.message ?? e) };
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const token = req.headers.get("x-worker-token") ?? "";
  const { data: okToken, error: tokErr } = await supabase.rpc("verify_email_worker_token", { p_token: token });
  if (tokErr) { console.error("[email-outbox] token check", tokErr.message); return json({ error: "server" }, 500); }
  if (okToken !== true) return json({ error: "unauthorized" }, 401);

  let body: any = {};
  try { body = await req.json(); } catch { /* vacío */ }

  // Prueba manual controlada: solo al buzón interno, nunca a compradores.
  if (body?.test_send) {
    const kind = body.test_send === "purchase" ? "purchase" : "contact";
    const r = kind === "contact"
      ? renderContact({ name: "Prueba interna", email: "prueba@example.test", subject: "Prueba de envío", message: "Mensaje de prueba <b>escapado</b> & seguro." })
      : renderPurchaseAccess({ productName: "El Big Bang de los Negocios (prueba)" });
    const res = await resendSend({ from: FROM, to: CONTACT_INBOX, reply_to: REPLY_TO, ...r }, `test-${kind}-${body.nonce ?? "1"}`);
    return json({ test: kind, ok: res.ok, status: res.status, id: res.id ?? null, error: res.ok ? null : res.error }, res.ok ? 200 : 502);
  }

  try {
    const summary = await processBatch({
      claim: async (limit) => {
        const { data, error } = await supabase.rpc("claim_email_outbox", { p_limit: limit, p_lease_seconds: 300 });
        if (error) throw new Error(`claim: ${error.message}`);
        return (data ?? []) as any;
      },
      savePayload: async (id, token, payload) => {
        const { data, error } = await supabase.rpc("set_email_outbox_payload", { p_id: id, p_claim_token: token, p_payload: payload });
        if (error) throw new Error(`payload: ${error.message}`);
        return (data ?? null) as any;
      },
      finish: async (id, token, outcome, err, pid, retry) => {
        const { data, error } = await supabase.rpc("finish_email_outbox", {
          p_id: id, p_claim_token: token, p_outcome: outcome, p_error: err, p_provider_message_id: pid, p_retry_seconds: retry,
        });
        if (error) throw new Error(`finish: ${error.message}`);
        return data as string;
      },
      getContact: async (id) => {
        const { data, error } = await supabase.from("contact_messages")
          .select("name,email,subject,message,created_at").eq("id", id).maybeSingle();
        if (error) throw new Error(`contact: ${error.message}`);
        return data as any;
      },
      getPurchase: async (id) => {
        const { data, error } = await supabase.from("purchases")
          .select("status,email,products(name)").eq("id", id).maybeSingle();
        if (error) throw new Error(`purchase: ${error.message}`);
        return data ? { status: data.status, email: data.email, product_name: (data as any).products?.name ?? null } : null;
      },
      send: resendSend,
      log: (m, meta) => console.log(`[email-outbox] ${m}`, meta ?? {}),
    });
    return json(summary);
  } catch (e: any) {
    console.error("[email-outbox] error", e?.message);
    return json({ error: "server" }, 500);
  }
});
