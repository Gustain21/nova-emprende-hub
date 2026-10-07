import { describe, it, expect } from "vitest";
import { isOfferActive, madridEndOfDay, formatOfferDate } from "@/lib/offer";
import { EBOOK_OFFER_END, ebookProduct } from "@/data/products";

describe("promoción ebook (fuente única, Europe/Madrid)", () => {
  it("termina el 31/12/2026 23:59:59 en Madrid (22:59:59 UTC)", () => {
    expect(EBOOK_OFFER_END).toBe("2026-12-31");
    expect(madridEndOfDay(EBOOK_OFFER_END)!.toISOString()).toBe("2026-12-31T22:59:59.000Z");
  });
  it("activa justo antes del cierre y desactivada justo después", () => {
    const end = Date.parse("2026-12-31T22:59:59Z");
    expect(isOfferActive(EBOOK_OFFER_END, true, end)).toBe(true);
    expect(isOfferActive(EBOOK_OFFER_END, true, end + 1000)).toBe(false);
  });
  it("gestiona horario de verano (CEST)", () => {
    expect(madridEndOfDay("2026-08-31")!.toISOString()).toBe("2026-08-31T21:59:59.000Z");
  });
  it("formato es-ES y precios sin cambios", () => {
    expect(formatOfferDate(EBOOK_OFFER_END)).toBe("31/12/2026");
    expect(ebookProduct.price).toBe(19.99);
    expect(ebookProduct.originalPrice).toBe(29.99);
    expect(ebookProduct.offerEndDate).toBe(EBOOK_OFFER_END);
  });
});
