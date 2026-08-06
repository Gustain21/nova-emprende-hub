// Regla única EUR/USD (frontend). Debe coincidir exactamente con
// supabase/functions/_shared/currencyRule.ts usada en servidor.
//
// EUR: países UE + Reino Unido (GB).
// USD: Hispanoamérica y todos los demás países (incluidos CH y NO).

export type PaddleCurrency = "EUR" | "USD";

export const EUR_COUNTRIES = new Set([
  "ES", "DE", "AT", "BE", "BG", "CY", "HR", "DK", "SK", "SI", "EE", "FI", "FR",
  "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "CZ", "RO",
  "SE",
  "GB", // Reino Unido recibe EUR expresamente.
]);

/** Normaliza a ISO-3166-1 alpha-2 en mayúsculas; null si no es válido. */
export const normalizeCountry = (cc: unknown): string | null => {
  if (typeof cc !== "string") return null;
  const c = cc.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(c) ? c : null;
};

/** EUR sólo para UE + GB. Cualquier otro país (o desconocido) → USD. */
export const currencyForCountry = (cc: unknown): PaddleCurrency => {
  const c = normalizeCountry(cc);
  if (!c) return "USD";
  return EUR_COUNTRIES.has(c) ? "EUR" : "USD";
};
