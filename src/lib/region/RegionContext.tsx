// Detección automática de región/moneda.
// Orden: país real del request (edge function geo-detect basada en headers tipo cf-ipcountry)
// → navigator.language/languages → fallback EU/EUR.
// No hay selector visible. No se pide geolocalización. No se guardan datos personales.

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Region = "EU" | "LATAM" | "INTL";
export type Currency = "EUR" | "USD";

const EU_COUNTRIES = new Set([
  "ES","DE","AT","BE","BG","CY","HR","DK","SK","SI","EE","FI","FR","GR","HU",
  "IE","IT","LV","LT","LU","MT","NL","PL","PT","CZ","RO","SE",
]);
const LATAM_COUNTRIES = new Set([
  "AR","BO","CL","CO","CR","EC","SV","GT","HN","MX","NI","PA","PY","PE","DO","UY","VE",
]);

const CACHE_KEY = "nova_region_cache_v2";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 h

const regionToCurrency = (r: Region): Currency => (r === "EU" ? "EUR" : "USD");

const countryToRegion = (cc: string | null | undefined): Region | null => {
  if (!cc) return null;
  const c = cc.toUpperCase();
  if (EU_COUNTRIES.has(c)) return "EU";
  if (LATAM_COUNTRIES.has(c)) return "LATAM";
  return "INTL";
};

const detectFromLocale = (): Region | null => {
  try {
    if (typeof navigator === "undefined") return null;
    const langs = [navigator.language, ...(navigator.languages || [])];
    for (const l of langs) {
      if (!l) continue;
      const parts = l.split("-");
      const region = (parts[1] || "").toUpperCase();
      const fromCountry = countryToRegion(region);
      if (fromCountry) return fromCountry;
      const lang = parts[0]?.toLowerCase();
      if (lang === "es") return "EU";
    }
  } catch { /* ignore */ }
  return null;
};

interface RegionContextValue {
  region: Region;
  currency: Currency;
  /** Sin selector visible: setter expuesto solo por compatibilidad interna. */
  setRegion: (r: Region) => void;
}

const RegionContext = createContext<RegionContextValue | undefined>(undefined);

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  // Estado inicial sincrónico: cache reciente → locale → EU.
  const initial = (() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { region: Region; ts: number };
          if (parsed?.region && Date.now() - parsed.ts < CACHE_TTL_MS) return parsed.region;
        }
      }
    } catch { /* ignore */ }
    return detectFromLocale() ?? "EU";
  })();

  const [region, setRegionState] = useState<Region>(initial);

  // Detección autoritativa por país real (edge function basada en headers de red).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("geo-detect");
        if (cancelled || error || !data) return;
        const r = countryToRegion((data as any).country);
        if (r) {
          setRegionState(r);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ region: r, ts: Date.now() }));
          } catch { /* ignore */ }
        }
      } catch { /* silencioso: ya tenemos fallback de locale */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const setRegion = (r: Region) => {
    setRegionState(r);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ region: r, ts: Date.now() }));
    } catch { /* ignore */ }
  };



  const value = useMemo<RegionContextValue>(
    () => ({ region, currency: regionToCurrency(region), setRegion }),
    [region],
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
};

export const useRegion = () => {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegion must be used within RegionProvider");
  return ctx;
};

export const REGION_LABEL: Record<Region, string> = {
  EU: "España / UE · EUR",
  LATAM: "Latinoamérica · USD",
  INTL: "Internacional · USD",
};

// Formato único de precios para toda la web: es-ES + EUR → "19,99 €".
const eurFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatPrice = (
  amount: number,
  _currency: Currency | string = "EUR",
  _locale?: string,
) => {
  const value = Number.isFinite(amount) ? amount : 0;
  try {
    return eurFormatter.format(value);
  } catch {
    return `${value.toFixed(2).replace(".", ",")} €`;
  }
};
