// Hook único: precios localizados vía Paddle.PricePreview.
// - Batch: agrupa priceIds en una sola llamada por país.
// - Cache por (country, priceId) durante la sesión.
// - Fallback: si Paddle falla, devuelve error y el consumidor muestra precio EUR base.
// - Country override: ?country=AR o sessionStorage (solo para pruebas en Preview).

import { useEffect, useState } from "react";
import { initPaddle } from "@/lib/paddle/paddleClient";
import { supabase } from "@/integrations/supabase/client";
import { currencyForCountry, normalizeCountry, type PaddleCurrency } from "./currencyRule";

export type LocalizedPrice = {
  formattedPrice: string | null;
  currencyCode: string | null;
  amount: number | null; // major units (e.g. 19.99)
  loading: boolean;
  error: string | null;
};

const DEFAULT: LocalizedPrice = {
  formattedPrice: null,
  currencyCode: null,
  amount: null,
  loading: true,
  error: null,
};

const cache = new Map<string, LocalizedPrice>();
const pending = new Set<string>();
const listeners = new Set<() => void>();
let flushTimer: number | null = null;

const notify = () => listeners.forEach((l) => l());

// ---------- Country override (solo pruebas) ----------
export function getCountryOverride(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("country");
    if (q) {
      const cc = q.toUpperCase();
      window.sessionStorage.setItem("__lp_country", cc);
      return cc;
    }
    return window.sessionStorage.getItem("__lp_country");
  } catch {
    return null;
  }
}

export function setCountryOverride(cc: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (cc) window.sessionStorage.setItem("__lp_country", cc.toUpperCase());
    else window.sessionStorage.removeItem("__lp_country");
  } catch {
    /* ignore */
  }
  cache.clear();
  pending.clear();
  notify();
}

const keyFor = (priceId: string, country: string | null) => `${country || "auto"}::${priceId}`;

// ---------- País efectivo y moneda esperada ----------
// Sin address, Paddle.PricePreview resuelve el país por IP; si ese país no
// coincide con la moneda de los Price IDs enviados, la API responde 400.
// Por eso resolvemos SIEMPRE un país explícito y filtramos los IDs por moneda.
let resolvedCountry: string | null = null;
let resolvingCountry: Promise<string | null> | null = null;

async function effectiveCountry(): Promise<string | null> {
  const override = normalizeCountry(getCountryOverride());
  if (override) return override;
  if (resolvedCountry) return resolvedCountry;
  if (!resolvingCountry) {
    resolvingCountry = (async () => {
      try {
        const { data } = await supabase.functions.invoke("geo-detect");
        resolvedCountry = normalizeCountry((data as any)?.country);
      } catch {
        resolvedCountry = null;
      }
      return resolvedCountry;
    })();
  }
  return resolvingCountry;
}

// priceId -> moneda ("EUR" | "USD") según la tabla products (fuente de verdad).
let idCurrency: Record<string, PaddleCurrency> | null = null;
let idCurrencyPromise: Promise<Record<string, PaddleCurrency>> | null = null;

async function priceIdCurrencyMap(): Promise<Record<string, PaddleCurrency>> {
  if (idCurrency) return idCurrency;
  if (!idCurrencyPromise) {
    idCurrencyPromise = (async () => {
      const out: Record<string, PaddleCurrency> = {};
      try {
        const { data } = await supabase
          .from("products")
          .select("paddle_price_id_eur, paddle_price_id_usd")
          .eq("active", true);
        for (const r of (data || []) as any[]) {
          if (r.paddle_price_id_eur) out[r.paddle_price_id_eur] = "EUR";
          if (r.paddle_price_id_usd) out[r.paddle_price_id_usd] = "USD";
        }
      } catch {
        /* sin mapa: no filtramos */
      }
      idCurrency = out;
      return out;
    })();
  }
  return idCurrencyPromise;
}

async function flush() {
  flushTimer = null;
  const country = getCountryOverride();
  const ids = Array.from(pending);
  pending.clear();
  const toFetch = ids.filter((id) => !cache.has(keyFor(id, country)));
  if (!toFetch.length) return;

  for (const id of toFetch) cache.set(keyFor(id, country), { ...DEFAULT });
  notify();

  try {
    const [Paddle, cc, curMap] = await Promise.all([
      initPaddle(),
      effectiveCountry(),
      priceIdCurrencyMap(),
    ]);
    const expected = currencyForCountry(cc);

    // Sólo pedimos los Price IDs de la moneda esperada: mezclar monedas
    // (o pedir EUR con país USD) provoca el 400 de PricePreview.
    const known = Object.keys(curMap).length > 0;
    const requestIds = known ? toFetch.filter((id) => curMap[id] === expected) : toFetch;
    const skipped = toFetch.filter((id) => !requestIds.includes(id));
    for (const id of skipped) {
      cache.set(keyFor(id, country), {
        ...DEFAULT,
        loading: false,
        error: "currency_mismatch",
      });
    }
    if (!requestIds.length) {
      notify();
      return;
    }

    const body: any = {
      items: requestIds.map((priceId) => ({ priceId, quantity: 1 })),
    };
    if (cc) body.address = { countryCode: cc };
    const res = await Paddle.PricePreview(body);
    const lineItems: any[] = res?.data?.details?.lineItems || [];
    const currencyCode: string | null = res?.data?.currencyCode ?? expected;


    for (const li of lineItems) {
      const priceId = li?.price?.id;
      if (!priceId) continue;
      const rawAmount = li?.totals?.total;
      const amount = rawAmount != null ? Number(rawAmount) / 100 : null;
      // Presentación visual normalizada (Intl); el importe numérico es
      // exactamente el devuelto por Paddle.
      const formatted = amount != null ? formatByCurrency(amount, currencyCode) : null;
      cache.set(keyFor(priceId, country), {
        formattedPrice: formatted,
        currencyCode,
        amount,
        loading: false,
        error: null,
      });
    }
    for (const id of toFetch) {
      const k = keyFor(id, country);
      const v = cache.get(k);
      if (v && v.loading) {
        cache.set(k, { ...DEFAULT, loading: false, error: "price_not_returned" });
      }
    }
    console.debug("[paddle-prices] fetched", { country, count: toFetch.length, currencyCode });
  } catch (e: any) {
    for (const id of toFetch) {
      cache.set(keyFor(id, country), {
        ...DEFAULT,
        loading: false,
        error: e?.message || "paddle_price_error",
      });
    }
    console.error("[paddle-prices] error", e);
  }
  notify();
}

function enqueue(priceId: string) {
  const country = getCountryOverride();
  const k = keyFor(priceId, country);
  if (cache.has(k)) return;
  pending.add(priceId);
  if (flushTimer == null && typeof window !== "undefined") {
    flushTimer = window.setTimeout(flush, 30);
  }
}

export function useLocalizedPaddlePrices(priceIds: (string | null | undefined)[]): Record<string, LocalizedPrice> {
  const ids = priceIds.filter((x): x is string => !!x);
  const country = getCountryOverride();
  const [, force] = useState(0);

  useEffect(() => {
    const cb = () => force((n) => n + 1);
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);

  useEffect(() => {
    for (const id of ids) enqueue(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|"), country]);

  const out: Record<string, LocalizedPrice> = {};
  for (const id of ids) out[id] = cache.get(keyFor(id, country)) || { ...DEFAULT };
  return out;
}

export function useLocalizedPaddlePrice(priceId: string | null | undefined): LocalizedPrice {
  const map = useLocalizedPaddlePrices(priceId ? [priceId] : []);
  return priceId ? map[priceId] || { ...DEFAULT } : { ...DEFAULT, loading: false };
}

// Formato de respaldo por moneda cuando construimos el "precio tachado".
export function formatByCurrency(amount: number, code: string | null | undefined): string {
  const currency = (code || "EUR").toUpperCase();
  try {
    if (currency === "EUR") {
      return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
    if (currency === "USD") {
      // Formato exigido: "$55.99"
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}
