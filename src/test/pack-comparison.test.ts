import { describe, it, expect } from "vitest";
import { computePackComparison, type PriceQuote } from "@/lib/pricing/packComparison";

const q = (amount: number | null, currencyCode: string | null = "EUR", extra: Partial<PriceQuote> = {}): PriceQuote => ({
  amount, currencyCode, loading: false, error: null, ...extra,
});

describe("comparación de packs con precios Paddle actuales", () => {
  it("EUR: Pack Base = ebook 19.99 + Bitácora 19.99 frente a 31.99", () => {
    expect(computePackComparison([q(19.99), q(19.99)], q(31.99))).toEqual({
      currency: "EUR", separateCents: 3998, packCents: 3199, savingsCents: 799, savingsPercent: 19,
    });
  });
  it("USD con importes distintos de EUR (p. ej. con impuestos) se calcula en USD", () => {
    const r = computePackComparison([q(24.19, "USD"), q(24.19, "USD")], q(38.71, "USD"));
    expect(r).toMatchObject({ currency: "USD", separateCents: 4838, packCents: 3871, savingsCents: 967 });
  });
  it("oculta si falta un importe, hay error o sigue cargando", () => {
    expect(computePackComparison([q(19.99), q(null)], q(31.99))).toBeNull();
    expect(computePackComparison([q(19.99), undefined], q(31.99))).toBeNull();
    expect(computePackComparison([q(19.99), q(19.99, "EUR", { error: "x" })], q(31.99))).toBeNull();
    expect(computePackComparison([q(19.99), q(19.99, "EUR", { loading: true })], q(31.99))).toBeNull();
    expect(computePackComparison([q(19.99), q(19.99)], q(null))).toBeNull();
  });
  it("oculta si hay monedas mezcladas o no EUR/USD", () => {
    expect(computePackComparison([q(19.99, "EUR"), q(19.99, "USD")], q(31.99, "EUR"))).toBeNull();
    expect(computePackComparison([q(19.99, "USD"), q(19.99, "USD")], q(31.99, "EUR"))).toBeNull();
    expect(computePackComparison([q(19.99, "GBP"), q(19.99, "GBP")], q(31.99, "GBP"))).toBeNull();
  });
  it("oculta si el ahorro es cero o negativo", () => {
    expect(computePackComparison([q(15), q(15)], q(30))).toBeNull();
    expect(computePackComparison([q(15), q(15)], q(31))).toBeNull();
  });
});
