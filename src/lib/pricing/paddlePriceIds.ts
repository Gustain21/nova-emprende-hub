// Fuente única de verdad de Price IDs de Paddle: la tabla `products`.
// No existe ninguna lista hardcodeada en el frontend.
//
// Selección:
//  - environment === "sandbox"  -> products.paddle_price_id (Sandbox)
//  - environment === "live"     -> paddle_price_id_eur | paddle_price_id_usd
//    según la regla EUR/USD compartida (UE + GB -> EUR; resto -> USD).

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchPaddleClientConfig } from "@/lib/paddle/paddleClient";
import { currencyForCountry, normalizeCountry, type PaddleCurrency } from "./currencyRule";
import { getCountryOverride } from "./useLocalizedPaddlePrices";

type Row = {
  slug: string;
  paddle_price_id: string | null;
  paddle_price_id_eur: string | null;
  paddle_price_id_usd: string | null;
};

let map: Record<string, string> = {};
let currency: PaddleCurrency = "EUR";
let loadPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

async function detectCountry(): Promise<string | null> {
  const override = normalizeCountry(getCountryOverride());
  if (override) return override;
  try {
    const { data } = await supabase.functions.invoke("geo-detect");
    return normalizeCountry((data as any)?.country);
  } catch {
    return null;
  }
}

async function load() {
  const [{ data: rows }, config, country] = await Promise.all([
    supabase
      .from("products")
      .select("slug, paddle_price_id, paddle_price_id_eur, paddle_price_id_usd")
      .eq("active", true),
    fetchPaddleClientConfig().catch(() => ({ token: "", environment: "sandbox" })),
    detectCountry(),
  ]);

  const environment = (config?.environment || "sandbox").toLowerCase();
  currency = currencyForCountry(country);

  const next: Record<string, string> = {};
  for (const r of (rows || []) as Row[]) {
    const id =
      environment === "live"
        ? currency === "EUR"
          ? r.paddle_price_id_eur
          : r.paddle_price_id_usd
        : r.paddle_price_id;
    if (id) next[r.slug] = id;
  }
  map = next;
  notify();
}

function ensureLoaded() {
  if (!loadPromise) loadPromise = load().catch((e) => console.error("[paddle-price-ids]", e));
  return loadPromise;
}

/** Mapa slug -> price_id vigente (vacío en el primer render, se rellena al cargar). */
export function usePaddlePriceIds(): Record<string, string> {
  const [, force] = useState(0);
  useEffect(() => {
    const cb = () => force((n) => n + 1);
    listeners.add(cb);
    ensureLoaded();
    return () => {
      listeners.delete(cb);
    };
  }, []);
  return map;
}

export function usePaddlePriceId(slug: string | undefined | null): string | null {
  const ids = usePaddlePriceIds();
  return slug ? ids[slug] ?? null : null;
}

/** Acceso puntual fuera de React. */
export async function getPaddlePriceIdBySlug(slug: string | undefined | null): Promise<string | null> {
  if (!slug) return null;
  await ensureLoaded();
  return map[slug] ?? null;
}

export const getActiveCurrency = () => currency;
