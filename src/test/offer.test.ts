import { describe, it, expect } from "vitest";
import { isOfferActive, madridEndOfDay, formatOfferDate, compareAtPrice } from "@/lib/offer";
import { EBOOK_OFFER_END, ebookProduct } from "@/data/products";

describe("promoción ebook (fuente única, Europe/Madrid)", () => {
  it("termina el 31/01/2027 23:59:59 en Madrid (22:59:59 UTC)", () => {
    expect(EBOOK_OFFER_END).toBe("2027-01-31");
    expect(madridEndOfDay(EBOOK_OFFER_END)!.toISOString()).toBe("2027-01-31T22:59:59.000Z");
  });
  it("activa justo antes del cierre y desactivada justo después", () => {
    const end = Date.parse("2027-01-31T22:59:59Z");
    expect(isOfferActive(EBOOK_OFFER_END, true, end)).toBe(true);
    expect(isOfferActive(EBOOK_OFFER_END, true, end + 1000)).toBe(false);
  });
  it("gestiona horario de verano (CEST)", () => {
    expect(madridEndOfDay("2026-08-31")!.toISOString()).toBe("2026-08-31T21:59:59.000Z");
  });
  it("formato es-ES y precios sin cambios", () => {
    expect(formatOfferDate(EBOOK_OFFER_END)).toBe("31/01/2027");
    expect(ebookProduct.price).toBe(19.99);
    expect(ebookProduct.originalPrice).toBe(29.99);
    expect(ebookProduct.offerEndDate).toBe(EBOOK_OFFER_END);
  });
});

describe("precio 'antes' del ebook por moneda", () => {
  const end = Date.parse("2027-01-31T22:59:59Z");
  it("EUR usa originalPrice 29.99 y USD originalPriceUsd 29", () => {
    expect(compareAtPrice(ebookProduct, "EUR", end)).toBe(29.99);
    expect(compareAtPrice(ebookProduct, "USD", end)).toBe(29);
    expect(ebookProduct.priceUsd).toBe(19.99);
  });
  it("sin precio 'antes' tras el cierre", () => {
    expect(compareAtPrice(ebookProduct, "EUR", end + 1000)).toBeUndefined();
    expect(compareAtPrice(ebookProduct, "USD", end + 1000)).toBeUndefined();
  });
});
