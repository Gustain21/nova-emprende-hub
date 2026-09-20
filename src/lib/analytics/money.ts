/**
 * Conversión de importes de Paddle.
 *
 * Paddle envía los importes en unidad mínima (céntimos), tanto en el webhook
 * (supabase/functions/paddle-webhook: `Number(rawTotal) / 100`) como en el
 * callback de Paddle.js. Se aplica exactamente la misma regla para que GA4 y la
 * base de datos nunca discrepen.
 *
 * Si el valor no permite determinar el importe con seguridad se devuelve null,
 * y quien llama debe omitir `value`/`price` en lugar de inventarlo.
 */
export function paddleMinorToMajor(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === "" || typeof raw === "boolean") return null;
  if (typeof raw !== "number" && typeof raw !== "string") return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  // Los importes en unidad mínima son enteros. Un decimal indica un payload
  // inesperado: no se asume nada y se omite el importe.
  if (!Number.isInteger(n)) return null;
  return Math.round(n) / 100;
}
