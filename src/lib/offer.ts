// Cálculo de oferta activa y precios efectivos según región (EUR/USD).

import type { Currency } from "@/lib/region/RegionContext";

export interface PricingProduct {
  price?: number;
  originalPrice?: number;
  priceUsd?: number;
  originalPriceUsd?: number;
  offerEndDate?: string;
  saleActive?: boolean;
}

const OFFER_TZ = "Europe/Madrid";

/** Instante exacto de las 23:59:59 del día dado en Europe/Madrid (gestiona CET/CEST). */
export const madridEndOfDay = (date: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  for (const offset of ["+01:00", "+02:00"]) {
    const d = new Date(`${date}T23:59:59${offset}`);
    const hh = new Intl.DateTimeFormat("en-GB", { timeZone: OFFER_TZ, hour: "2-digit", hourCycle: "h23" }).format(d);
    if (hh === "23") return d;
  }
  return null;
};

export const isOfferActive = (offerEndDate?: string, saleActive?: boolean, now: number = Date.now()): boolean => {
  if (saleActive === false) return false;
  if (!offerEndDate) return !!saleActive;
  const end = madridEndOfDay(offerEndDate);
  if (!end) return false;
  return now <= end.getTime();
};

export const formatOfferDate = (offerEndDate: string): string => {
  const end = madridEndOfDay(offerEndDate);
  if (!end) return offerEndDate;
  return end.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: OFFER_TZ });
};

export interface EffectivePricing {
  price: number;
  originalPrice?: number;
  offerActive: boolean;
  currency: Currency;
}

export const getEffectivePricing = (
  product: PricingProduct,
  currency: Currency = "EUR",
): EffectivePricing => {
  const active = isOfferActive(product.offerEndDate, product.saleActive);

  if (currency === "USD") {
    const base = product.priceUsd ?? product.originalPriceUsd ?? 0;
    if (active && product.originalPriceUsd && product.priceUsd != null) {
      return { price: product.priceUsd, originalPrice: product.originalPriceUsd, offerActive: true, currency };
    }
    return { price: base, originalPrice: undefined, offerActive: false, currency };
  }

  const eurBase = product.price ?? product.originalPrice ?? 0;
  if (active && product.originalPrice && product.price != null) {
    return { price: product.price, originalPrice: product.originalPrice, offerActive: true, currency };
  }
  return { price: eurBase, originalPrice: undefined, offerActive: false, currency };
};
