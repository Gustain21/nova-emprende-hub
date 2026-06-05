// Detección y selección de región/moneda del visitante.
// EU → EUR, LATAM/INTL → USD. Selector manual con persistencia en localStorage.

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Region = "EU" | "LATAM" | "INTL";
export type Currency = "EUR" | "USD";

const EU_COUNTRIES = new Set([
  "ES","DE","AT","BE","BG","CY","HR","DK","SK","SI","EE","FI","FR","GR","HU",
  "IE","IT","LV","LT","LU","MT","NL","PL","PT","CZ","RO","SE",
]);
const LATAM_COUNTRIES = new Set([
  "AR","BO","CL","CO","CR","EC","SV","GT","HN","MX","NI","PA","PY","PE","DO","UY","VE",
]);

const STORAGE_KEY = "nova_region";

const regionToCurrency = (r: Region): Currency => (r === "EU" ? "EUR" : "USD");

const detectRegion = (): Region => {
  try {
    // 1) Preferencia guardada
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved === "EU" || saved === "LATAM" || saved === "INTL") return saved;

    // 2) Detección por locale del navegador
    if (typeof navigator !== "undefined") {
      const langs = [navigator.language, ...(navigator.languages || [])];
      for (const l of langs) {
        if (!l) continue;
        // formato es-ES, es-MX, en-US, ...
        const parts = l.split("-");
        const region = (parts[1] || "").toUpperCase();
        if (region) {
          if (EU_COUNTRIES.has(region)) return "EU";
          if (LATAM_COUNTRIES.has(region)) return "LATAM";
          return "INTL";
        }
        // fallback solo con idioma
        const lang = parts[0]?.toLowerCase();
        if (lang === "es") return "EU"; // por defecto, español → EU; el usuario puede cambiar
      }
    }
  } catch {
    /* ignore */
  }
  return "EU";
};

interface RegionContextValue {
  region: Region;
  currency: Currency;
  setRegion: (r: Region) => void;
}

const RegionContext = createContext<RegionContextValue | undefined>(undefined);

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegionState] = useState<Region>("EU");

  useEffect(() => {
    setRegionState(detectRegion());
  }, []);

  const setRegion = (r: Region) => {
    setRegionState(r);
    try {
      localStorage.setItem(STORAGE_KEY, r);
    } catch {
      /* ignore */
    }
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

export const formatPrice = (amount: number, currency: Currency) => {
  if (currency === "EUR") {
    // 19,99 €
    return `${amount.toFixed(2).replace(".", ",")} €`;
  }
  // USD 19
  const isInt = Math.abs(amount - Math.round(amount)) < 0.005;
  return `USD ${isInt ? Math.round(amount) : amount.toFixed(2)}`;
};
