import type { Product } from "@/data/products";

export const isOfferActive = (offerEndDate?: string): boolean => {
  if (!offerEndDate) return false;
  const end = new Date(`${offerEndDate}T23:59:59`);
  if (isNaN(end.getTime())) return false;
  return Date.now() <= end.getTime();
};

export const formatOfferDate = (offerEndDate: string): string => {
  const d = new Date(`${offerEndDate}T23:59:59`);
  if (isNaN(d.getTime())) return offerEndDate;
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const getEffectivePricing = (product: Pick<Product, "price" | "originalPrice" | "offerEndDate">) => {
  const active = isOfferActive(product.offerEndDate);
  if (active && product.originalPrice) {
    return { price: product.price, originalPrice: product.originalPrice, offerActive: true };
  }
  return { price: product.originalPrice ?? product.price, originalPrice: undefined, offerActive: false };
};
