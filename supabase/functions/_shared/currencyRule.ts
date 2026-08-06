// Regla única EUR/USD (servidor). Debe coincidir con src/lib/pricing/currencyRule.ts.
// EUR: UE + Reino Unido (GB). USD: Hispanoamérica y resto del mundo (CH y NO incluidos).

export type PaddleCurrency = "EUR" | "USD";

export const EUR_COUNTRIES = new Set([
  "ES", "DE", "AT", "BE", "BG", "CY", "HR", "DK", "SK", "SI", "EE", "FI", "FR",
  "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "CZ", "RO",
  "SE",
  "GB",
]);

export const normalizeCountry = (cc: unknown): string | null => {
  if (typeof cc !== "string") return null;
  const c = cc.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(c) ? c : null;
};

export const currencyForCountry = (cc: unknown): PaddleCurrency => {
  const c = normalizeCountry(cc);
  if (!c) return "USD";
  return EUR_COUNTRIES.has(c) ? "EUR" : "USD";
};

/** País detectado por headers de red fiables (mismos que usa geo-detect). */
export const countryFromHeaders = (h: Headers): string | null =>
  normalizeCountry(
    h.get("cf-ipcountry") ||
      h.get("x-vercel-ip-country") ||
      h.get("x-country-code") ||
      h.get("x-geo-country"),
  );

/** Entorno Paddle y base de API correspondiente. */
export const paddleEnvironment = (): "sandbox" | "live" =>
  (Deno.env.get("PADDLE_ENVIRONMENT") || "sandbox").toLowerCase() === "live" ? "live" : "sandbox";

export const paddleApiBase = (env = paddleEnvironment()) =>
  env === "live" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";
