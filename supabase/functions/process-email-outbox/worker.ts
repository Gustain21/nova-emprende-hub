// Lógica del procesador de email_outbox (inyectable para pruebas). Nunca registra emails.
// - Fence: cada reserva lleva claim_token; payload y cierre solo los acepta el titular actual.
// - Snapshot: el cuerpo se construye UNA vez y se guarda; los reintentos reutilizan el mismo
//   cuerpo con la misma Idempotency-Key (Resend rechaza cuerpo distinto con la misma clave).
// - Pago y destinatario se revalidan en cada intento, aparte del snapshot.
import { CONTACT_INBOX, FROM, REPLY_TO, renderContact, renderPurchaseAccess } from "./render.ts";

export interface Payload { from: string; to: string; reply_to: string; subject: string; html: string; text: string }
export interface OutboxRow {
  id: string; kind: string; idempotency_key: string; recipient: string;
  template_data: Record<string, any>; attempts: number; claim_token: string; payload: Payload | null;
}
export type Outcome = "sent" | "retry" | "failed" | "skipped";
export interface SendResult { ok: boolean; status: number; id?: string; error?: string; retryAfter?: number }
export interface Deps {
  claim: (limit: number) => Promise<OutboxRow[]>;
  savePayload: (id: string, token: string, payload: Payload) => Promise<Payload | null>;
  finish: (id: string, token: string, outcome: Outcome, error: string | null, providerId: string | null, retrySeconds: number) => Promise<string>;
  getContact: (id: string) => Promise<{ name: string; email: string; subject: string; message: string; created_at: string } | null>;
  getPurchase: (id: string) => Promise<{ status: string; email: string | null; product_name: string | null } | null>;
  send: (msg: Payload, idempotencyKey: string) => Promise<SendResult>;
  log: (msg: string, meta?: Record<string, unknown>) => void;
}

export const PAID_STATES = new Set(["paid", "partially_refunded"]);
export const backoffSeconds = (attempt: number) => Math.min(60 * 2 ** Math.max(0, attempt - 1), 21600);

export function classify(r: SendResult): Outcome {
  if (r.ok) return "sent";
  if (r.status === 409) {
    // Resend: misma clave en vuelo => reintentar; misma clave con cuerpo distinto => permanente.
    return /concurrent_idempotent_requests/i.test(r.error ?? "") ? "retry" : "failed";
  }
  if (r.status === 0 || r.status === 408 || r.status === 429 || r.status >= 500) return "retry";
  return "failed";
}

/** Revalidación en cada intento (no depende del snapshot). */
async function check(row: OutboxRow, deps: Deps): Promise<{ skip?: string; purchase?: any; contact?: any }> {
  if (row.kind === "contact_notification") {
    if (row.recipient.toLowerCase() !== CONTACT_INBOX) return { skip: "destinatario no permitido" };
    if (row.payload) return {};
    const c = await deps.getContact(String(row.template_data?.contact_message_id ?? ""));
    return c ? { contact: c } : { skip: "mensaje de contacto inexistente" };
  }
  if (row.kind === "purchase_access") {
    const p = await deps.getPurchase(String(row.template_data?.purchase_id ?? ""));
    if (!p) return { skip: "compra inexistente" };
    if (!PAID_STATES.has(p.status)) return { skip: `compra no pagada (${p.status})` };
    if (!p.email || p.email.toLowerCase() !== row.recipient.toLowerCase()) return { skip: "email de la compra no coincide" };
    return { purchase: p };
  }
  return { skip: `tipo desconocido: ${row.kind}` };
}

function buildPayload(row: OutboxRow, c: { purchase?: any; contact?: any }): Payload {
  const r = row.kind === "contact_notification"
    ? renderContact({ ...c.contact, createdAt: c.contact.created_at })
    : renderPurchaseAccess({ productName: c.purchase.product_name ?? "" });
  return { from: FROM, to: row.recipient.toLowerCase(), reply_to: REPLY_TO, ...r };
}

export async function processBatch(deps: Deps, limit = 10) {
  const rows = await deps.claim(limit);
  const summary: Record<string, number> = { claimed: rows.length, sent: 0, retry: 0, failed: 0, skipped: 0, not_leased: 0, finish_error: 0 };
  for (const row of rows) {
    let outcome: Outcome; let err: string | null = null; let pid: string | null = null; let retry = backoffSeconds(row.attempts);
    try {
      const c = await check(row, deps);
      if (c.skip) { outcome = "skipped"; err = c.skip; }
      else {
        let payload = row.payload;
        if (!payload) payload = await deps.savePayload(row.id, row.claim_token, buildPayload(row, c));
        if (!payload) { summary.not_leased++; deps.log("lease perdido antes de enviar", { id: row.id }); continue; }
        if (payload.to.toLowerCase() !== row.recipient.toLowerCase()) { outcome = "failed"; err = "snapshot con destinatario distinto"; }
        else {
          const r = await deps.send(payload, row.idempotency_key);
          outcome = classify(r); pid = r.id ?? null;
          if (!r.ok) err = `resend ${r.status}: ${(r.error ?? "").slice(0, 300)}`;
          if (r.retryAfter) retry = Math.max(retry, r.retryAfter);
        }
      }
    } catch (e: any) {
      outcome = "retry"; err = `excepción: ${String(e?.message ?? e).slice(0, 300)}`;
    }
    let final: string;
    try { final = await deps.finish(row.id, row.claim_token, outcome, err, pid, retry); }
    catch (e: any) {
      // Fila queda 'sending'; al expirar el lease se reintenta con el mismo snapshot y clave.
      summary.finish_error++; deps.log("finish falló", { id: row.id, message: String(e?.message ?? e) }); continue;
    }
    if (final === "not_leased") summary.not_leased++;
    else summary[final] = (summary[final] ?? 0) + 1;
    deps.log("row", { id: row.id, kind: row.kind, attempt: row.attempts, outcome: final });
  }
  return summary;
}
