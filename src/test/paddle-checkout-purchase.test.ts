import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  paddleSdkMajorAmount,
  parsePaddleCheckoutCompleted,
} from "@/lib/analytics/paddleCheckoutAmount";
import { paddleMinorToMajor } from "@/lib/analytics/money";
import { trackPurchase, trackViewItem, __resetAnalyticsState } from "@/lib/analytics/track";
import { CONSENT_COOKIE_NAME, CONSENT_VERSION } from "@/lib/consent/consent";

function setConsent(analytics: boolean) {
  const value = JSON.stringify({ v: CONSENT_VERSION, analytics, marketing: false, ts: new Date().toISOString() });
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(value)}; Path=/`;
}
const purchases = () => ((window.dataLayer ?? []) as any[]).filter((e) => e.event === "purchase");

/** Payload con la forma documentada de checkout.completed (Paddle.js). */
function sdkEvent(total: unknown, opts: { quantity?: unknown; lineTotal?: unknown } = {}) {
  return {
    transaction_id: "txn_test_1",
    currency_code: "EUR",
    items: [
      {
        price_id: "pri_x",
        price_name: "Precio",
        product: { id: "pro_ebook", name: "El Big Bang de los Negocios" },
        quantity: opts.quantity ?? 1,
        totals: { subtotal: 0, tax: 0, total: opts.lineTotal ?? total },
      },
    ],
    totals: { subtotal: 0, tax: 0, total },
  };
}

beforeEach(() => {
  document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0`;
  window.dataLayer = [];
  window.sessionStorage.clear();
  __resetAnalyticsState();
});
afterEach(() => vi.restoreAllMocks());

describe("checkout.completed (SDK): importes en unidad mayor", () => {
  it.each([
    [19.99, 19.99],
    [15.99, 15.99],
    [89.99, 89.99],
    [20, 20],
    [0, 0],
  ])("total %s → value %s", (raw, expected) => {
    expect(parsePaddleCheckoutCompleted(sdkEvent(raw))?.value).toBe(expected);
  });

  it("total ausente o no válido se omite (no se inventa)", () => {
    for (const raw of [undefined, null, "1999", "19.99", NaN, -5, {}]) {
      const p = parsePaddleCheckoutCompleted(sdkEvent(raw))!;
      expect(p.value).toBeNull();
      expect(p.items[0].price).toBeUndefined();
    }
    expect(paddleSdkMajorAmount(Infinity)).toBeNull();
  });

  it("quantity > 1: price es el unitario (total de línea / cantidad)", () => {
    const p = parsePaddleCheckoutCompleted(sdkEvent(59.97, { quantity: 3 }))!;
    expect(p.items[0]).toMatchObject({ quantity: 3, price: 19.99 });
    expect(p.value).toBe(59.97);
  });

  it("usa la identidad del producto del SDK (product.id / product.name)", () => {
    const p = parsePaddleCheckoutCompleted(sdkEvent(19.99))!;
    expect(p.items[0]).toMatchObject({ item_id: "pro_ebook", item_name: "El Big Bang de los Negocios" });
    expect(p.currency).toBe("EUR");
    expect(p.transactionId).toBe("txn_test_1");
  });

  it("sin transaction_id no hay compra", () => {
    expect(parsePaddleCheckoutCompleted({ ...sdkEvent(19.99), transaction_id: undefined })).toBeNull();
  });
});

describe("API/webhooks: siguen en unidad mínima", () => {
  it("1999 → 19.99 y 8999 → 89.99", () => {
    expect(paddleMinorToMajor("1999")).toBe(19.99);
    expect(paddleMinorToMajor(8999)).toBe(89.99);
  });
});

describe("purchase: deduplicación persistente con consentimiento", () => {
  it("compra repetida y recarga de la página no duplican el evento", () => {
    setConsent(true);
    const p = parsePaddleCheckoutCompleted(sdkEvent(19.99))!;
    expect(trackPurchase(p)).toBe(true);
    expect(trackPurchase(p)).toBe(false);
    __resetAnalyticsState(); // simula recarga: se pierde la memoria, no la sesión
    expect(trackPurchase(p)).toBe(false);
    expect(purchases()).toHaveLength(1);
    expect(purchases()[0].ecommerce).toMatchObject({
      value: 19.99,
      currency: "EUR",
      items: [{ item_id: "pro_ebook", price: 19.99, quantity: 1 }],
    });
  });

  it("sin consentimiento: ni emisión ni uso de storage", () => {
    const get = vi.spyOn(Storage.prototype, "getItem");
    const set = vi.spyOn(Storage.prototype, "setItem");
    expect(trackPurchase(parsePaddleCheckoutCompleted(sdkEvent(19.99))!)).toBe(false);
    expect(purchases()).toHaveLength(0);
    expect(get).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
  });

  it("si el storage falla, el evento se emite igualmente sin lanzar error", () => {
    setConsent(true);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const p = parsePaddleCheckoutCompleted(sdkEvent(19.99))!;
    expect(() => trackPurchase(p)).not.toThrow();
    expect(trackPurchase(p)).toBe(false); // memoria sigue deduplicando
    expect(purchases()).toHaveLength(1);
  });

  it("view_item no se persiste: tras recarga vuelve a medirse", () => {
    setConsent(true);
    const item = { item_id: "ebook", item_name: "Ebook" };
    expect(trackViewItem({ item, currency: "EUR", value: 19.99 })).toBe(true);
    __resetAnalyticsState();
    expect(trackViewItem({ item, currency: "EUR", value: 19.99 })).toBe(true);
    expect(window.sessionStorage.length).toBe(0);
  });
});
