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

/** Último domingo de un mes (UTC), día del mes. */
const lastSunday = (y: number, m: number) => {
  const last = new Date(Date.UTC(y, m + 1, 0));
  return last.getUTCDate() - last.getUTCDay();
};

/**
 * Instante exacto de las 23:59:59 del día dado en Europe/Madrid.
 * Regla UE de horario de verano (CEST, UTC+2) desde el último domingo de marzo
 * hasta el último domingo de octubre; resto del año CET (UTC+1). Sin depender de Intl.
 */
export const madridEndOfDay = (date: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]) - 1, Number(m[3])];
  const probe = Date.UTC(y, mo, d, 22, 0, 0);
  const dstStart = Date.UTC(y, 2, lastSunday(y, 2), 1);
  const dstEnd = Date.UTC(y, 9, lastSunday(y, 9), 1);
  const offsetH = probe >= dstStart && probe < dstEnd ? 2 : 1;
  const res = new Date(Date.UTC(y, mo, d, 23 - offsetH, 59, 59));
  return isNaN(res.getTime()) ? null : res;
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
  const [y, mo, d] = offerEndDate.split("-");
  return `${d}/${mo}/${y}`;
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
