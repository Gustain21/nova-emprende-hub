// Resolución ÚNICA de país y moneda para toda la web pública.
// La usan: selección de Price IDs, Paddle.PricePreview, formato del precio
// visible y el país enviado a create-paddle-checkout.
//
// Orden de resolución (estricto):
//  1. Override explícito ?country=XX (o sessionStorage) — SOLO pruebas.
//  2. País válido devuelto por la edge function geo-detect.
//  3. Código regional EXACTO de navigator.language / navigator.languages
//     (es-ES → ES, es-AR → AR, es-MX → MX, en-US → US). Nunca se convierte
//     "es" a España: sin región explícita el idioma se ignora.
//  4. Fallback comercial único de Nova Emprende: ES (EUR). Mercado principal
//     y editorial con sede en España.
//
// No se usan servicios externos de geolocalización ni cf-connecting-ip.
// No se registran IPs ni datos personales.

import { supabase } from "@/integrations/supabase/client";
import { currencyForCountry, normalizeCountry, type PaddleCurrency } from "@/lib/pricing/currencyRule";
import { getCountryOverride } from "@/lib/pricing/useLocalizedPaddlePrices";

/** Fallback comercial único (documentado): España → EUR. */
export const FALLBACK_COUNTRY = "ES";

export type ResolvedRegion = {
  country: string;
  currency: PaddleCurrency;
  source: "override" | "geo" | "navigator" | "fallback";
};

/** Región exacta del idioma del navegador; null si el idioma no lleva país. */
export function countryFromNavigator(): string | null {
  try {
    if (typeof navigator === "undefined") return null;
    const langs = [navigator.language, ...(navigator.languages || [])];
    for (const l of langs) {
      if (!l) continue;
      const parts = l.split("-");
      // Sólo aceptamos un código de región alpha-2 explícito (es-ES, es-AR...).
      const region = normalizeCountry(parts[parts.length - 1]);
      if (region && parts.length > 1) return region;
    }
  } catch {
    /* ignore */
  }
  return null;
}

let cached: ResolvedRegion | null = null;
let inflight: Promise<ResolvedRegion> | null = null;

export function resetResolvedRegion() {
  cached = null;
  inflight = null;
}

/** Resolución asíncrona completa (incluye geo-detect). Cacheada por sesión. */
export async function resolveRegion(): Promise<ResolvedRegion> {
  const override = normalizeCountry(getCountryOverride());
  if (override) return { country: override, currency: currencyForCountry(override), source: "override" };

  if (cached) return cached;
  if (!inflight) {
    inflight = (async () => {
      let country: string | null = null;
      let source: ResolvedRegion["source"] = "fallback";
      try {
        const { data } = await supabase.functions.invoke("geo-detect");
        country = normalizeCountry((data as any)?.country);
        if (country) source = "geo";
      } catch {
        /* silencioso */
      }
      if (!country) {
        country = countryFromNavigator();
        if (country) source = "navigator";
      }
      if (!country) country = FALLBACK_COUNTRY;
      const resolved: ResolvedRegion = { country, currency: currencyForCountry(country), source };
      cached = resolved;
      return resolved;
    })();
  }
  return inflight;
}

/** Resolución sincrónica (sin geo-detect) para el primer render. */
export function resolveRegionSync(): ResolvedRegion {
  const override = normalizeCountry(getCountryOverride());
  if (override) return { country: override, currency: currencyForCountry(override), source: "override" };
  if (cached) return cached;
  const nav = countryFromNavigator();
  if (nav) return { country: nav, currency: currencyForCountry(nav), source: "navigator" };
  return { country: FALLBACK_COUNTRY, currency: currencyForCountry(FALLBACK_COUNTRY), source: "fallback" };
}
