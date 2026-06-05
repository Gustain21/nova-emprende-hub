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

export const isOfferActive = (offerEndDate?: string, saleActive?: boolean): boolean => {
  if (saleActive === false) return false;
  if (!offerEndDate) return !!saleActive;
  const end = new Date(`${offerEndDate}T23:59:59`);
  if (isNaN(end.getTime())) return false;
  return Date.now() <= end.getTime();
};

export const formatOfferDate = (offerEndDate: string): string => {
  const d = new Date(`${offerEndDate}T23:59:59`);
  if (isNaN(d.getTime())) return offerEndDate;
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
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
