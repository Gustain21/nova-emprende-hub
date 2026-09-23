// Contexto de región/moneda. Deriva EXCLUSIVAMENTE de resolveCountry.ts
// (fuente única): sin detección propia, sin caché propia.

import { createContext, useContext, useMemo, ReactNode } from "react";
import { EUR_COUNTRIES } from "@/lib/pricing/currencyRule";
import { setCountryOverride } from "./resolveCountry";
import { useResolvedRegion } from "./useResolvedRegion";

export type Region = "EU" | "LATAM" | "INTL";
export type Currency = "EUR" | "USD";

const LATAM_COUNTRIES = new Set([
  "AR","BO","CL","CO","CR","EC","SV","GT","HN","MX","NI","PA","PY","PE","DO","UY","VE",
]);

const countryToRegion = (cc: string): Region =>
  EUR_COUNTRIES.has(cc) ? "EU" : LATAM_COUNTRIES.has(cc) ? "LATAM" : "INTL";

interface RegionContextValue {
  region: Region;
  country: string;
  currency: Currency;
  /** Compatibilidad: fija un override de pruebas representativo. */
  setRegion: (r: Region) => void;
}

const RegionContext = createContext<RegionContextValue | undefined>(undefined);

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const resolved = useResolvedRegion();
  const value = useMemo<RegionContextValue>(
    () => ({
      region: countryToRegion(resolved.country),
      country: resolved.country,
      currency: resolved.currency,
      setRegion: (r) => setCountryOverride(r === "EU" ? "ES" : r === "LATAM" ? "AR" : "US"),
    }),
    [resolved.country, resolved.currency],
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

export const formatPriceEUR = (amount: number | string | null | undefined) => {
  const num = typeof amount === "number" ? amount : Number(amount);
  const value = Number.isFinite(num) ? num : 0;
  try {
    return eurFormatter.format(value);
  } catch {
    return `${value.toFixed(2).replace(".", ",")} €`;
  }
};

export const formatPrice = (
  amount: number,
  _currency: Currency | string = "EUR",
  _locale?: string,
) => formatPriceEUR(amount);
