// Comparación "Por separado / Ahorras" de un pack a partir de precios
// localizados de Paddle (mismo país, misma base fiscal). Todo en céntimos.
// Devuelve null si falta algún importe, hay error, carga pendiente, monedas
// mezcladas o distintas de EUR/USD, o el ahorro no es positivo.

export interface PriceQuote {
  amount: number | null; // unidad mayor (19.99)
  currencyCode: string | null;
  loading: boolean;
  error: string | null;
}

export interface PackComparison {
  currency: "EUR" | "USD";
  separateCents: number;
  packCents: number;
  savingsCents: number;
  savingsPercent: number;
}

const toCents = (q: PriceQuote | undefined): { cents: number; cur: string } | null => {
  if (!q || q.loading || q.error || q.amount == null) return null;
  if (!Number.isFinite(q.amount) || q.amount <= 0) return null;
  const cur = (q.currencyCode || "").toUpperCase();
  if (cur !== "EUR" && cur !== "USD") return null;
  return { cents: Math.round(q.amount * 100), cur };
};

export function computePackComparison(
  units: (PriceQuote | undefined)[],
  pack: PriceQuote | undefined,
): PackComparison | null {
  if (!units.length) return null;
  const p = toCents(pack);
  if (!p) return null;
  let separateCents = 0;
  for (const u of units) {
    const c = toCents(u);
    if (!c || c.cur !== p.cur) return null;
    separateCents += c.cents;
  }
  const savingsCents = separateCents - p.cents;
  if (savingsCents <= 0) return null;
  return {
    currency: p.cur as "EUR" | "USD",
    separateCents,
    packCents: p.cents,
    savingsCents,
    savingsPercent: Math.floor((savingsCents / separateCents) * 100),
  };
}
