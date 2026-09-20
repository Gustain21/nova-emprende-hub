// Resolución ÚNICA de país y moneda para toda la web pública.
// La usan: selección de Price IDs, Paddle.PricePreview, formato del precio
// visible y el país enviado a create-paddle-checkout.
//
// Orden de resolución (estricto):
//  1. Preferencia explícita del usuario: ?country=XX, sessionStorage de pruebas
//     o preferencia guardada (localStorage).
//  2. País válido devuelto por la edge function geo-detect (señal fiable de red).
//  3. Señales del navegador:
//     3a. Código regional EXACTO de navigator.language / navigator.languages
//         (es-ES → ES, es-AR → AR, en-US → US). Nunca se convierte "es" a
//         España: sin región explícita el idioma se ignora.
//     3b. Zona horaria IANA (America/Argentina/* → AR, Europe/Madrid → ES…).
//         Imprescindible porque muchos navegadores de Hispanoamérica informan
//         "es", "es-419" o "es-ES" aunque el usuario esté en Argentina.
//  4. Fallback comercial único de Nova Emprende: ES (EUR).
//
// No se usan servicios externos de geolocalización ni cf-connecting-ip.
// No se registran IPs ni datos personales.

import { supabase } from "@/integrations/supabase/client";
import { currencyForCountry, normalizeCountry, type PaddleCurrency } from "@/lib/pricing/currencyRule";
import { getCountryOverride } from "@/lib/pricing/useLocalizedPaddlePrices";

/** Fallback comercial único (documentado): España → EUR. */
export const FALLBACK_COUNTRY = "ES";

/** Preferencia de país elegida explícitamente por el usuario (persistente). */
export const COUNTRY_PREFERENCE_KEY = "nova_country_preference";

export type RegionSource = "preference" | "override" | "geo" | "navigator" | "timezone" | "fallback";

export type ResolvedRegion = {
  country: string;
  currency: PaddleCurrency;
  source: RegionSource;
};

/** Preferencia explícita guardada por el usuario; null si no existe. */
export function getCountryPreference(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return normalizeCountry(window.localStorage.getItem(COUNTRY_PREFERENCE_KEY));
  } catch {
    return null;
  }
}

/** Guarda (o borra con null) la preferencia explícita de país del usuario. */
export function setCountryPreference(cc: string | null) {
  if (typeof window === "undefined") return;
  try {
    const c = normalizeCountry(cc);
    if (c) window.localStorage.setItem(COUNTRY_PREFERENCE_KEY, c);
    else window.localStorage.removeItem(COUNTRY_PREFERENCE_KEY);
  } catch {
    /* ignore */
  }
  resetResolvedRegion();
}

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

// Zonas horarias IANA → país. Se cubren los mercados relevantes de Nova
// Emprende; cualquier zona no listada simplemente no aporta señal.
const TIMEZONE_PREFIX_COUNTRY: Array<[string, string]> = [
  ["america/argentina/", "AR"],
  ["america/buenos_aires", "AR"],
  ["america/cordoba", "AR"],
  ["america/mendoza", "AR"],
  ["america/rosario", "AR"],
  ["america/catamarca", "AR"],
  ["america/jujuy", "AR"],
];

const TIMEZONE_COUNTRY: Record<string, string> = {
  "europe/madrid": "ES",
  "atlantic/canary": "ES",
  "africa/ceuta": "ES",
  "europe/lisbon": "PT",
  "atlantic/madeira": "PT",
  "europe/paris": "FR",
  "europe/berlin": "DE",
  "europe/rome": "IT",
  "europe/amsterdam": "NL",
  "europe/brussels": "BE",
  "europe/dublin": "IE",
  "europe/vienna": "AT",
  "europe/london": "GB",
  "america/montevideo": "UY",
  "america/santiago": "CL",
  "america/asuncion": "PY",
  "america/la_paz": "BO",
  "america/lima": "PE",
  "america/bogota": "CO",
  "america/caracas": "VE",
  "america/guayaquil": "EC",
  "america/mexico_city": "MX",
  "america/monterrey": "MX",
  "america/cancun": "MX",
  "america/tijuana": "MX",
  "america/guatemala": "GT",
  "america/costa_rica": "CR",
  "america/panama": "PA",
  "america/santo_domingo": "DO",
  "america/sao_paulo": "BR",
  "america/new_york": "US",
  "america/chicago": "US",
  "america/denver": "US",
  "america/los_angeles": "US",
};

/** País deducido de la zona horaria del dispositivo; null si no se reconoce. */
export function countryFromTimeZone(tz?: string | null): string | null {
  try {
    const zone = (tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "").toLowerCase();
    if (!zone) return null;
    for (const [prefix, cc] of TIMEZONE_PREFIX_COUNTRY) {
      if (zone.startsWith(prefix)) return cc;
    }
    return TIMEZONE_COUNTRY[zone] ?? null;
  } catch {
    return null;
  }
}

/**
 * Señales locales del dispositivo. La zona horaria va primero porque indica
 * dónde está el usuario, mientras que el idioma solo indica en qué lengua
 * prefiere navegar (un navegador en "es-ES" o "es-419" desde Argentina debe
 * resolver AR).
 */
function countryFromBrowser(): { country: string; source: RegionSource } | null {
  const tz = countryFromTimeZone();
  if (tz) return { country: tz, source: "timezone" };
  const nav = countryFromNavigator();
  if (nav) return { country: nav, source: "navigator" };
  return null;
}


let cached: ResolvedRegion | null = null;
let inflight: Promise<ResolvedRegion> | null = null;

export function resetResolvedRegion() {
  cached = null;
  inflight = null;
}

function explicitChoice(): ResolvedRegion | null {
  const preference = getCountryPreference();
  if (preference) {
    return { country: preference, currency: currencyForCountry(preference), source: "preference" };
  }
  const override = normalizeCountry(getCountryOverride());
  if (override) {
    return { country: override, currency: currencyForCountry(override), source: "override" };
  }
  return null;
}

/** Resolución asíncrona completa (incluye geo-detect). Cacheada por sesión. */
export async function resolveRegion(): Promise<ResolvedRegion> {
  const explicit = explicitChoice();
  if (explicit) return explicit;

  if (cached) return cached;
  if (!inflight) {
    inflight = (async () => {
      let country: string | null = null;
      let source: RegionSource = "fallback";
      try {
        const { data } = await supabase.functions.invoke("geo-detect");
        country = normalizeCountry((data as { country?: unknown } | null)?.country);
        if (country) source = "geo";
      } catch {
        /* silencioso */
      }
      if (!country) {
        const browser = countryFromBrowser();
        if (browser) {
          country = browser.country;
          source = browser.source;
        }
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
  const explicit = explicitChoice();
  if (explicit) return explicit;
  if (cached) return cached;
  const browser = countryFromBrowser();
  if (browser) {
    return { country: browser.country, currency: currencyForCountry(browser.country), source: browser.source };
  }
  return { country: FALLBACK_COUNTRY, currency: currencyForCountry(FALLBACK_COUNTRY), source: "fallback" };
}
