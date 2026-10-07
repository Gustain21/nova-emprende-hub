import { sanitizeAttribution } from "../_shared/attribution.ts";

// Lógica del webhook de Paddle, separada para poder probarla sin red.
// Regla: cualquier fallo de escritura o RPC lanza error => el webhook responde 500
// y Paddle reintenta (no hay cola durable propia). Nunca se registran emails.

export type Rpc = (fn: string, args: Record<string, unknown>) => Promise<{ data: any; error: any }>;

export interface Deps {
  rpc: Rpc;
  findProductIdBySlug: (slug: string) => Promise<string | null>;
  log?: (msg: string, meta?: Record<string, unknown>) => void;
}

export class WebhookError extends Error {}

const call = async (deps: Deps, fn: string, args: Record<string, unknown>) => {
  const { data, error } = await deps.rpc(fn, args);
  if (error) throw new WebhookError(`${fn} falló: ${error.message ?? String(error)}`);
  return data;
};

/** Paddle envía importes en unidad mínima. Solo EUR/USD (2 decimales) en este proyecto. */
export const minorToMajor = (raw: unknown): number | null => {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n / 100 : null;
};

export async function handlePaddleEvent(event: any, deps: Deps): Promise<Record<string, unknown>> {
  const log = deps.log ?? (() => {});
  const eventType: string = event?.event_type ?? "";
  const data: any = event?.data ?? {};
  const custom = data?.custom_data ?? {};

  if (eventType === "transaction.paid" || eventType === "transaction.completed") {
    const transactionId: string | undefined = data?.id;
    let productId: string | null = custom?.product_id || null;
    if (!productId && custom?.product_slug) productId = await deps.findProductIdBySlug(custom.product_slug);
    if (!transactionId || !productId) {
      // No se pierde: se guarda en la cola privada de reconciliación. Si esa escritura falla => 500.
      await call(deps, "record_paddle_deadletter", {
        p_event_id: event?.event_id ?? null,
        p_event_type: eventType,
        p_transaction_id: transactionId ?? null,
        p_reason: "missing_product",
        p_payload: event,
      });
      log("transacción sin producto, enviada a reconciliación", { eventType });
      return { received: true, deadletter: "missing_product" };
    }

    const email = String(custom?.buyer_email || data?.customer?.email || data?.billing_details?.email || "")
      .trim().toLowerCase() || null;

    let userId: string | null = custom?.user_id || null;
    if (!userId && email) {
      userId = (await call(deps, "find_auth_user_id_by_email", { p_email: email })) ?? null;
    }

    const attribution = sanitizeAttribution(custom);
    const totals = data?.details?.totals ?? {};
    const amount = minorToMajor(totals?.total ?? totals?.grand_total);
    const currency = data?.currency_code ?? totals?.currency_code ?? null;

    // Registro + concesión atómicos en la BD (mismo bloqueo de fila que el reembolso).
    const rows = await call(deps, "record_paddle_payment", {
      p_transaction_id: transactionId,
      p_product_id: productId,
      p_user_id: userId,
      p_email: email,
      p_amount: amount,
      p_currency: currency,
      p_purchase_id: custom?.purchase_id || null,
      p_attribution: Object.keys(attribution).length ? attribution : null,
      p_event_id: event?.event_id ?? null,
    });
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row?.purchase_id) throw new WebhookError("record_paddle_payment sin purchase_id");
    log("pago registrado", { eventType, status: row.purchase_status, granted: !!row.granted });
    return { received: true, purchase_status: row.purchase_status, granted: !!row.granted };
  }

  if (eventType === "transaction.canceled" || eventType === "transaction.payment_failed") {
    await call(deps, "mark_paddle_payment_failed", {
      p_transaction_id: data?.id ?? null,
      p_purchase_id: custom?.purchase_id || null,
    });
    return { received: true };
  }

  if (eventType === "adjustment.created" || eventType === "adjustment.updated") {
    if (data?.action !== "refund" || data?.status !== "approved") {
      log("ajuste ignorado", { action: data?.action, status: data?.status });
      return { received: true, ignored: true };
    }
    if (!data?.id || !data?.transaction_id) throw new WebhookError("ajuste sin id/transaction_id");
    const rows = await call(deps, "apply_paddle_refund", {
      p_adjustment_id: data.id,
      p_transaction_id: data.transaction_id,
      p_adjustment_type: data?.type ?? null, // 'full' | 'partial'
      p_amount: minorToMajor(data?.totals?.total),
      p_currency: data?.currency_code ?? data?.totals?.currency_code ?? null,
    });
    const row = Array.isArray(rows) ? rows[0] : rows;
    log("reembolso procesado", { result: row?.result, status: row?.new_status });
    return { received: true, refund: row?.result };
  }

  return { received: true, ignored: true };
}
