// Atribución de campaña (UTM / origen) para el checkout.
// - Solo claves permitidas y valores cortos [a-z0-9._-]; se descarta lo que contenga "@".
//   Este filtro reduce el riesgo pero NO garantiza que un valor no contenga datos personales.
// - Las UTM solo se leen y envían si el visitante ha aceptado analítica o marketing en el
//   módulo de consentimiento existente (readConsent). Sin ese consentimiento no se envían.
// - `origen` es técnico y se limita a valores fijos permitidos (ORIGEN_ALLOWED), sin
//   identificadores personales; se envía siempre para saber qué CTA interno llevó al pago.
// - El parámetro `currency` de la URL se IGNORA a propósito: la moneda cobrada la decide
//   el servidor con la regla geográfica.
// El saneado del servidor (supabase/functions/_shared/attribution.ts) acepta las mismas claves.
import { readConsent, type ConsentState } from "@/lib/consent/consent";

export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "origen"] as const;
export type Attribution = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>>;

export const ORIGEN_ALLOWED = ["diagnostico-big-bang"] as const;

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

export function readAttribution(search: string, consent: ConsentState | null = readConsent()): Attribution {
  const p = new URLSearchParams(search);
  const all = sanitizeAttribution(Object.fromEntries(ATTRIBUTION_KEYS.map((k) => [k, p.get(k)])));
  const out: Attribution = {};
  if (all.origen && (ORIGEN_ALLOWED as readonly string[]).includes(all.origen)) out.origen = all.origen;
  const allowUtm = !!consent && (consent.analytics || consent.marketing);
  if (allowUtm) {
    for (const k of ATTRIBUTION_KEYS) if (k !== "origen" && all[k]) out[k] = all[k];
  }
  return out;
}
