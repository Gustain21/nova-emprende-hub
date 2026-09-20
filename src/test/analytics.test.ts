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
