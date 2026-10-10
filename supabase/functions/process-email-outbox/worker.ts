// Lógica del procesador de email_outbox (inyectable para pruebas). Nunca registra emails.
import { CONTACT_INBOX, FROM, REPLY_TO, renderContact, renderPurchaseAccess } from "./render.ts";

export interface OutboxRow {
  id: string; kind: string; idempotency_key: string; recipient: string;
  template_data: Record<string, any>; attempts: number;
}
export type Outcome = "sent" | "retry" | "failed" | "skipped";
export interface SendResult { ok: boolean; status: number; id?: string; error?: string; retryAfter?: number }
export interface Deps {
  claim: (limit: number) => Promise<OutboxRow[]>;
  finish: (id: string, outcome: Outcome, error: string | null, providerId: string | null, retrySeconds: number) => Promise<string>;
  getContact: (id: string) => Promise<{ name: string; email: string; subject: string; message: string; created_at: string } | null>;
  getPurchase: (id: string) => Promise<{ status: string; email: string | null; product_name: string | null } | null>;
  send: (msg: { from: string; to: string; reply_to: string; subject: string; html: string; text: string }, idempotencyKey: string) => Promise<SendResult>;
  log: (msg: string, meta?: Record<string, unknown>) => void;
}

export const MAX_ATTEMPTS = 5;
export const PAID_STATES = new Set(["paid", "partially_refunded"]);
export const backoffSeconds = (attempt: number) => Math.min(60 * 2 ** Math.max(0, attempt - 1), 21600);

export function classify(r: SendResult): Outcome {
  if (r.ok) return "sent";
  if (r.status === 0 || r.status === 408 || r.status === 409 || r.status === 429 || r.status >= 500) return "retry";
  return "failed"; // 400/401/403/422: reintentar no lo arregla
}

async function build(row: OutboxRow, deps: Deps) {
  if (row.kind === "contact_notification") {
    if (row.recipient.toLowerCase() !== CONTACT_INBOX) return { skip: "destinatario no permitido" };
    const c = await deps.getContact(String(row.template_data?.contact_message_id ?? ""));
    if (!c) return { skip: "mensaje de contacto inexistente" };
    return { to: CONTACT_INBOX, ...renderContact({ ...c, createdAt: c.created_at }) };
  }
  if (row.kind === "purchase_access") {
    const p = await deps.getPurchase(String(row.template_data?.purchase_id ?? ""));
    if (!p) return { skip: "compra inexistente" };
    if (!PAID_STATES.has(p.status)) return { skip: `compra no pagada (${p.status})` };
    if (!p.email || p.email.toLowerCase() !== row.recipient.toLowerCase()) return { skip: "email de la compra no coincide" };
    return { to: p.email.toLowerCase(), ...renderPurchaseAccess({ productName: p.product_name ?? "" }) };
  }
  return { skip: `tipo desconocido: ${row.kind}` };
}

export async function processBatch(deps: Deps, limit = 10) {
  const rows = await deps.claim(limit);
  const summary: Record<string, number> = { claimed: rows.length, sent: 0, retry: 0, failed: 0, skipped: 0 };
  for (const row of rows) {
    let outcome: Outcome; let err: string | null = null; let pid: string | null = null; let retry = backoffSeconds(row.attempts);
    try {
      const b: any = await build(row, deps);
      if (b.skip) { outcome = "skipped"; err = b.skip; }
      else {
        const r = await deps.send({ from: FROM, to: b.to, reply_to: REPLY_TO, subject: b.subject, html: b.html, text: b.text }, row.idempotency_key);
        outcome = classify(r); pid = r.id ?? null;
        if (!r.ok) err = `resend ${r.status}: ${(r.error ?? "").slice(0, 300)}`;
        if (r.retryAfter) retry = Math.max(retry, r.retryAfter);
      }
    } catch (e: any) {
      outcome = "retry"; err = `excepción: ${String(e?.message ?? e).slice(0, 300)}`;
    }
    const final = await deps.finish(row.id, outcome, err, pid, retry);
    summary[final in summary ? final : outcome] = (summary[final in summary ? final : outcome] ?? 0) + 1;
    deps.log("row", { id: row.id, kind: row.kind, attempt: row.attempts, outcome: final });
  }
  return summary;
}
