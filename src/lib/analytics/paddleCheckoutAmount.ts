/**
 * Importes del evento `checkout.completed` de Paddle.js (SDK de navegador).
 *
 * Según la documentación oficial
 * (https://developer.paddle.com/paddle-js/events/checkout-completed/), en este
 * evento `data.totals.total` y `data.items[].totals.total` son `number` en
 * UNIDAD MAYOR (p. ej. 32.66), y el producto está en `items[].product.{id,name}`.
 *
 * Es distinto de la API/webhooks de Paddle, que envían strings en unidad mínima
 * ("1999"): esos siguen usando `paddleMinorToMajor` (money.ts). No se mezclan.
 *
 * Si un importe no es determinable con seguridad se devuelve null y el evento
 * omite `value`/`price` en lugar de inventarlo.
 */
import type { AnalyticsItem } from "./track";

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Importe del SDK en unidad mayor: solo `number` finito y >= 0. */
export function paddleSdkMajorAmount(raw: unknown): number | null {
  if (typeof raw !== "number" || !Number.isFinite(raw) || raw < 0) return null;
  return round2(raw);
}

function validQuantity(raw: unknown): number | null {
  return typeof raw === "number" && Number.isInteger(raw) && raw >= 1 ? raw : null;
}

export interface PaddleCheckoutPurchase {
  transactionId: string;
  currency: string | null;
  value: number | null;
  items: AnalyticsItem[];
}

/** Extrae los datos de compra de `event.data` de checkout.completed. */
export function parsePaddleCheckoutCompleted(data: unknown): PaddleCheckoutPurchase | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, any>;
  const transactionId = d.transaction_id;
  if (typeof transactionId !== "string" || !transactionId) return null;

  const items: AnalyticsItem[] = Array.isArray(d.items)
    ? d.items.flatMap((it: any): AnalyticsItem[] => {
        const itemId = it?.product?.id || it?.price_id;
        if (!itemId) return [];
        const quantity = validQuantity(it?.quantity);
        const lineTotal = paddleSdkMajorAmount(it?.totals?.total);
        const price = quantity != null && lineTotal != null ? round2(lineTotal / quantity) : null;
        return [
          {
            item_id: String(itemId),
            item_name: String(it?.product?.name || it?.price_name || itemId),
            quantity: quantity ?? 1,
            ...(price == null ? {} : { price }),
          },
        ];
      })
    : [];

  return {
    transactionId,
    currency: typeof d.currency_code === "string" ? d.currency_code : null,
    value: paddleSdkMajorAmount(d.totals?.total),
    items,
  };
}
