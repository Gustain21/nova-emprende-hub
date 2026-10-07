// Atribución de campaña (UTM / origen) para el checkout.
// - Solo claves permitidas y valores cortos [a-z0-9._-]; se descarta cualquier cosa con "@" (sin PII).
// - Se lee de la URL actual y se envía al servidor para guardarla en la transacción de Paddle;
//   no se almacena en el navegador ni se envía a analítica, por lo que no requiere consentimiento.
// - El parámetro `currency` de la URL se IGNORA a propósito: la moneda cobrada la decide
//   el servidor con la regla geográfica.
// Mantener idéntico a supabase/functions/_shared/attribution.ts.

export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "origen"] as const;
export type Attribution = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>>;

const VALUE_RE = /^[a-z0-9._-]{1,64}$/;

export function sanitizeAttribution(input: unknown): Attribution {
  const out: Attribution = {};
  if (!input || typeof input !== "object") return out;
  for (const k of ATTRIBUTION_KEYS) {
    const raw = (input as Record<string, unknown>)[k];
    if (typeof raw !== "string") continue;
    const v = raw.trim().toLowerCase();
    if (VALUE_RE.test(v)) out[k] = v;
  }
  return out;
}

export function readAttribution(search: string): Attribution {
  const p = new URLSearchParams(search);
  const obj: Record<string, string> = {};
  for (const k of ATTRIBUTION_KEYS) {
    const v = p.get(k);
    if (v != null) obj[k] = v;
  }
  return sanitizeAttribution(obj);
}
