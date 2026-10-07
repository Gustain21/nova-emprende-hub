// Copia servidor de src/lib/attribution.ts (mantener idénticas). Allowlist, longitud y sin PII.
export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "origen"] as const;
const VALUE_RE = /^[a-z0-9._-]{1,64}$/;

export function sanitizeAttribution(input: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!input || typeof input !== "object") return out;
  for (const k of ATTRIBUTION_KEYS) {
    const raw = (input as Record<string, unknown>)[k];
    if (typeof raw !== "string") continue;
    const v = raw.trim().toLowerCase();
    if (VALUE_RE.test(v)) out[k] = v;
  }
  return out;
}
