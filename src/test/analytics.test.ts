import { describe, it, expect, beforeEach } from "vitest";
import {
  trackEvent,
  trackEcommerce,
  trackPurchase,
  trackViewItem,
  trackPageView,
  trackFileDownload,
  hasAnalyticsConsent,
  __resetAnalyticsState,
} from "@/lib/analytics/track";
import { paddleMinorToMajor } from "@/lib/analytics/money";
import { CONSENT_COOKIE_NAME, CONSENT_VERSION } from "@/lib/consent/consent";

function setConsent(analytics: boolean, marketing = false) {
  const value = JSON.stringify({
    v: CONSENT_VERSION,
    analytics,
    marketing,
    ts: new Date().toISOString(),
  });
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(value)}; Path=/`;
}

function clearConsent() {
  document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0`;
}

const dl = () => (window.dataLayer ?? []) as Record<string, unknown>[];

beforeEach(() => {
  clearConsent();
  window.dataLayer = [];
  __resetAnalyticsState();
});

describe("analytics: bloqueo sin consentimiento", () => {
  it("no emite nada cuando no hay decisión", () => {
    expect(hasAnalyticsConsent()).toBe(false);
    expect(trackEvent("login")).toBe(false);
    expect(trackEcommerce("view_item", { items: [] })).toBe(false);
    expect(trackFileDownload({ fileName: "a.pdf" })).toBe(false);
    expect(trackPageView("/x")).toBe(false);
    expect(dl()).toHaveLength(0);
  });

  it("no emite nada cuando la analítica está rechazada", () => {
    setConsent(false, true);
    expect(trackEvent("login")).toBe(false);
    expect(dl()).toHaveLength(0);
  });
});

describe("analytics: emisión con consentimiento", () => {
  beforeEach(() => setConsent(true));

  it("emite eventos simples a dataLayer", () => {
    expect(trackEvent("login", { method: "password" })).toBe(true);
    expect(dl()[0]).toEqual({ event: "login", method: "password" });
  });

  it("limpia el objeto ecommerce anterior", () => {
    trackEcommerce("view_item", { currency: "EUR", items: [{ item_id: "a" }] });
    expect(dl()[0]).toEqual({ ecommerce: null });
    expect(dl()[1].event).toBe("view_item");
  });

  it("nunca envía datos personales", () => {
    trackEvent("sign_up", {
      method: "password",
      email: "x@y.com",
      user_id: "123",
      nested: { full_name: "Gustavo", ok: 1 },
    });
    expect(dl()[0]).toEqual({ event: "sign_up", method: "password", nested: { ok: 1 } });
  });

  it("no duplica purchase para la misma transacción", () => {
    expect(trackPurchase({ transactionId: "txn_1", currency: "EUR", value: 19.99 })).toBe(true);
    expect(trackPurchase({ transactionId: "txn_1", currency: "EUR", value: 19.99 })).toBe(false);
    expect(dl().filter((e) => e.event === "purchase")).toHaveLength(1);
  });

  it("no duplica view_item del mismo producto", () => {
    const item = { item_id: "ebook", item_name: "Ebook" };
    expect(trackViewItem({ item })).toBe(true);
    expect(trackViewItem({ item })).toBe(false);
  });

  it("omite la primera vista (ya medida por GA4) y mide los cambios de ruta", () => {
    expect(trackPageView("/")).toBe(false);
    expect(trackPageView("/")).toBe(false);
    expect(trackPageView("/packs")).toBe(true);
    expect(trackPageView("/packs")).toBe(false);
    expect(dl().filter((e) => e.event === "page_view")).toHaveLength(1);
  });
});

describe("analytics: page_view cuando el consentimiento llega después", () => {
  it("recuerda la ruta inicial sin consentimiento y mide el siguiente cambio de ruta", () => {
    expect(hasAnalyticsConsent()).toBe(false);
    expect(trackPageView("/")).toBe(false); // ruta inicial: la medirá GA4 al cargar GTM
    expect(dl()).toHaveLength(0);

    setConsent(true); // el usuario acepta la analítica

    expect(trackPageView("/packs")).toBe(true);
    const views = dl().filter((e) => e.event === "page_view");
    expect(views).toHaveLength(1);
    expect(views[0].page_path).toBe("/packs");
  });

  it("no pierde rutas si el usuario navega antes de aceptar", () => {
    trackPageView("/");
    expect(trackPageView("/producto/ebook")).toBe(false);
    setConsent(true);
    expect(trackPageView("/producto/ebook")).toBe(false); // ya es la ruta actual
    expect(trackPageView("/packs")).toBe(true);
    expect(dl().filter((e) => e.event === "page_view")).toHaveLength(1);
  });
});

describe("analytics: importes de Paddle en unidad mínima", () => {
  it("convierte 1999 en 19.99 igual que el webhook", () => {
    expect(paddleMinorToMajor(1999)).toBe(19.99);
    expect(paddleMinorToMajor("1999")).toBe(19.99);
    expect(paddleMinorToMajor(8999)).toBe(89.99);
    expect(paddleMinorToMajor(0)).toBe(0);
  });

  it("omite el importe cuando el payload no permite determinarlo", () => {
    expect(paddleMinorToMajor(null)).toBeNull();
    expect(paddleMinorToMajor(undefined)).toBeNull();
    expect(paddleMinorToMajor("")).toBeNull();
    expect(paddleMinorToMajor("abc")).toBeNull();
    expect(paddleMinorToMajor(19.99)).toBeNull();
    expect(paddleMinorToMajor({})).toBeNull();
  });

  it("el evento purchase viaja con el importe ya convertido", () => {
    setConsent(true);
    trackPurchase({
      transactionId: "txn_2",
      currency: "EUR",
      value: paddleMinorToMajor(1999),
      items: [{ item_id: "ebook", item_name: "Ebook", price: paddleMinorToMajor(1999) ?? undefined }],
    });
    const purchase = dl().find((e) => e.event === "purchase") as any;
    expect(purchase.ecommerce.value).toBe(19.99);
    expect(purchase.ecommerce.items[0].price).toBe(19.99);
  });
});
