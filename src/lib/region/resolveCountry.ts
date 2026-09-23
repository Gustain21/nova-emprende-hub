// Resolución ÚNICA de país y moneda para toda la web pública.
// La usan: RegionContext, selección de Price IDs, Paddle.PricePreview, el
// precio de respaldo visible, la analítica y el país enviado al checkout.
//
// Orden de resolución (estricto):
//  1. Override explícito de pruebas: ?country=XX o sessionStorage __lp_country.
//  2. País válido devuelto por geo-detect (señal de red), cacheado en v3.
//  3. Señales del dispositivo: zona horaria IANA primero
//     (America/Argentina/* → AR) y después región exacta del idioma
//     (es-AR → AR). "es" sin región nunca se convierte en España.
//  4. Fallback comercial único: ES (EUR).
//
// Estado heredado: nova_country_preference y nova_region_cache_v2 se eliminan
// y nunca se leen. No existe selector público, así que ningún valor antiguo
// invisible puede prevalecer sobre la ubicación actual.

import { supabase } from "@/integrations/supabase/client";
import { currencyForCountry, normalizeCountry, type PaddleCurrency } from "@/lib/pricing/currencyRule";

export const FALLBACK_COUNTRY = "ES";
export const OVERRIDE_KEY = "__lp_country";
export const LEGACY_KEYS = ["nova_country_preference", "nova_region_cache_v2"] as const;
export const REGION_CACHE_KEY = "nova_region_v3";
const REGION_CACHE_VERSION = 3;
const REGION_CACHE_TTL_MS = 1000 * 60 * 60 * 24;

export type RegionSource = "override" | "geo" | "timezone" | "navigator" | "fallback";

export type ResolvedRegion = {
  country: string;
  currency: PaddleCurrency;
  source: RegionSource;
};

const make = (country: string, source: RegionSource): ResolvedRegion => ({
  country,
  currency: currencyForCountry(country),
  source,
});

/* ------------------------------------------------------------ estado heredado */

/** Elimina preferencias/cachés antiguas invisibles. */
export function purgeLegacyRegionState() {
  if (typeof window === "undefined") return;
  try {
    for (const k of LEGACY_KEYS) window.localStorage.removeItem(k);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------ override de pruebas */

export function getCountryOverride(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const q = normalizeCountry(new URLSearchParams(window.location.search).get("country"));
    if (q) {
      window.sessionStorage.setItem(OVERRIDE_KEY, q);
      return q;
    }
    return normalizeCountry(window.sessionStorage.getItem(OVERRIDE_KEY));
  } catch {
    return null;
  }
}

/* --------------------------------------------------------- cache versionada */

type CacheEntry = { v: number; country: string; source: RegionSource; ts: number };

function readCache(): ResolvedRegion | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(REGION_CACHE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<CacheEntry>;
    const cc = normalizeCountry(p?.country);
    if (p?.v !== REGION_CACHE_VERSION || !cc || p.source !== "geo" || typeof p.ts !== "number") return null;
    if (Date.now() - p.ts > REGION_CACHE_TTL_MS) return null;
    return make(cc, "geo");
  } catch {
    return null;
  }
}

function writeCache(r: ResolvedRegion) {
  if (typeof window === "undefined" || r.source !== "geo") return;
  try {
    const entry: CacheEntry = { v: REGION_CACHE_VERSION, country: r.country, source: r.source, ts: Date.now() };
    window.localStorage.setItem(REGION_CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------ señales del navegador */

export function countryFromNavigator(): string | null {
  try {
    if (typeof navigator === "undefined") return null;
    const langs = [navigator.language, ...(navigator.languages || [])];
    for (const l of langs) {
      if (!l) continue;
      const parts = l.split("-");
      const region = normalizeCountry(parts[parts.length - 1]);
      if (region && parts.length > 1) return region;
    }
  } catch {
    /* ignore */
  }
  return null;
}

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
  "europe/madrid": "ES", "atlantic/canary": "ES", "africa/ceuta": "ES",
  "europe/lisbon": "PT", "atlantic/madeira": "PT", "europe/paris": "FR",
  "europe/berlin": "DE", "europe/rome": "IT", "europe/amsterdam": "NL",
  "europe/brussels": "BE", "europe/dublin": "IE", "europe/vienna": "AT",
  "europe/london": "GB", "america/montevideo": "UY", "america/santiago": "CL",
  "america/asuncion": "PY", "america/la_paz": "BO", "america/lima": "PE",
  "america/bogota": "CO", "america/caracas": "VE", "america/guayaquil": "EC",
  "america/mexico_city": "MX", "america/monterrey": "MX", "america/cancun": "MX",
  "america/tijuana": "MX", "america/guatemala": "GT", "america/costa_rica": "CR",
  "america/panama": "PA", "america/santo_domingo": "DO", "america/sao_paulo": "BR",
  "america/new_york": "US", "america/chicago": "US", "america/denver": "US",
  "america/los_angeles": "US",
};

export function countryFromTimeZone(tz?: string | null): string | null {
  try {
    const zone = (tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "").toLowerCase();
    if (!zone) return null;
    for (const [prefix, cc] of TIMEZONE_PREFIX_COUNTRY) if (zone.startsWith(prefix)) return cc;
    return TIMEZONE_COUNTRY[zone] ?? null;
  } catch {
    return null;
  }
}

function fromDevice(): ResolvedRegion {
  const tz = countryFromTimeZone();
  if (tz) return make(tz, "timezone");
  const nav = countryFromNavigator();
  if (nav) return make(nav, "navigator");
  return make(FALLBACK_COUNTRY, "fallback");
}

/* ------------------------------------------------------------- resolución */

let cached: ResolvedRegion | null = null;
let inflight: Promise<ResolvedRegion> | null = null;
const listeners = new Set<(r: ResolvedRegion) => void>();

export function subscribeRegion(cb: (r: ResolvedRegion) => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function emit(r: ResolvedRegion) {
  listeners.forEach((l) => l(r));
}

/** Reinicia la resolución en memoria (no toca almacenamiento). */
export function resetResolvedRegion() {
  cached = null;
  inflight = null;
}

/**
 * Reset completo de región (AUTO): borra override, caché v3 y estado heredado,
 * reinicia la resolución y notifica para volver a resolver.
 */
export function resetRegionState({ keepOverride = false } = {}) {
  purgeLegacyRegionState();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(REGION_CACHE_KEY);
      if (!keepOverride) window.sessionStorage.removeItem(OVERRIDE_KEY);
    } catch {
      /* ignore */
    }
  }
  resetResolvedRegion();
  emit(resolveRegionSync());
}

/** Fija (o borra con null) el override de pruebas y reinicia la resolución. */
export function setCountryOverride(cc: string | null) {
  const c = normalizeCountry(cc);
  if (typeof window !== "undefined") {
    try {
      if (c) window.sessionStorage.setItem(OVERRIDE_KEY, c);
      else window.sessionStorage.removeItem(OVERRIDE_KEY);
    } catch {
      /* ignore */
    }
  }
  if (c) {
    resetResolvedRegion();
    emit(make(c, "override"));
  } else {
    resetRegionState();
  }
}

export async function resolveRegion(): Promise<ResolvedRegion> {
  purgeLegacyRegionState();
  const override = getCountryOverride();
  if (override) return make(override, "override");
  if (cached) return cached;
  const fromCache = readCache();
  if (fromCache) {
    cached = fromCache;
    return fromCache;
  }
  if (!inflight) {
    const p = (async () => {
      let resolved: ResolvedRegion | null = null;
      try {
        const { data } = await supabase.functions.invoke("geo-detect");
        const cc = normalizeCountry((data as { country?: unknown } | null)?.country);
        if (cc) resolved = make(cc, "geo");
      } catch {
        /* silencioso */
      }
      if (!resolved) resolved = fromDevice();
      if (inflight !== p) return resolved; // se reinició mientras tanto
      cached = resolved;
      writeCache(resolved);
      emit(resolved);
      return resolved;
    })();
    inflight = p;
  }
  return inflight;
}

/** Resolución sincrónica (sin red) para el primer render. */
export function resolveRegionSync(): ResolvedRegion {
  purgeLegacyRegionState();
  const override = getCountryOverride();
  if (override) return make(override, "override");
  if (cached) return cached;
  return readCache() ?? fromDevice();
}
