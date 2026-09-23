import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const hoisted = vi.hoisted(() => ({
  price: { formattedPrice: null as string | null, currencyCode: null, amount: null, loading: true, error: null as string | null },
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: vi.fn(async () => ({ data: { country: null } })) } },
}));
vi.mock("@/lib/pricing/useLocalizedPaddlePrices", async (orig) => {
  const actual = await orig<typeof import("@/lib/pricing/useLocalizedPaddlePrices")>();
  return { ...actual, useLocalizedPaddlePrice: () => hoisted.price };
});

import {
  resolveRegion,
  resolveRegionSync,
  resetResolvedRegion,
  setCountryOverride,
  countryFromTimeZone,
  countryFromNavigator,
  REGION_CACHE_KEY,
} from "@/lib/region/resolveCountry";
import { currencyForCountry } from "@/lib/pricing/currencyRule";
import { LocalizedPrice } from "@/lib/pricing/LocalizedPrice";

function mockNavigator(language: string | undefined, languages: string[] = []) {
  Object.defineProperty(window.navigator, "language", { value: language, configurable: true });
  Object.defineProperty(window.navigator, "languages", { value: languages, configurable: true });
}
function mockTimeZone(timeZone: string | undefined) {
  vi.spyOn(Intl, "DateTimeFormat").mockImplementation(
    () => ({ resolvedOptions: () => ({ timeZone }) }) as unknown as Intl.DateTimeFormat,
  );
}
const argentina = () => {
  mockTimeZone("America/Argentina/Buenos_Aires");
  mockNavigator("es-ES", ["es-ES", "es"]);
};

beforeEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  window.sessionStorage.clear();
  mockNavigator(undefined, []);
  mockTimeZone(undefined);
  resetResolvedRegion();
  hoisted.price = { formattedPrice: null, currencyCode: null, amount: null, loading: true, error: null };
});

describe("resolución de país y moneda", () => {
  it("es-AR resuelve Argentina y USD", () => {
    mockNavigator("es-AR", ["es-AR", "es"]);
    expect(resolveRegionSync()).toMatchObject({ country: "AR", currency: "USD" });
    expect(countryFromNavigator()).toBe("AR");
  });

  it("locale es-ES + zona Buenos Aires => USD (también es-419)", async () => {
    argentina();
    expect(resolveRegionSync()).toMatchObject({ country: "AR", currency: "USD", source: "timezone" });
    expect(await resolveRegion()).toMatchObject({ country: "AR", currency: "USD" }); // geo vacío
    resetResolvedRegion();
    mockNavigator("es-419", ["es-419", "es"]);
    expect(resolveRegionSync().currency).toBe("USD");
  });

  it("reconoce otras zonas horarias argentinas", () => {
    expect(countryFromTimeZone("America/Argentina/Cordoba")).toBe("AR");
    expect(countryFromTimeZone("America/Buenos_Aires")).toBe("AR");
  });

  it("nova_country_preference=ES heredado se ignora y se elimina en AUTO", () => {
    window.localStorage.setItem("nova_country_preference", "ES");
    argentina();
    expect(resolveRegionSync()).toMatchObject({ country: "AR", currency: "USD" });
    expect(window.localStorage.getItem("nova_country_preference")).toBeNull();
  });

  it("cache antigua nova_region_cache_v2=EU se ignora y se elimina", () => {
    window.localStorage.setItem("nova_region_cache_v2", JSON.stringify({ region: "EU", ts: Date.now() }));
    argentina();
    expect(resolveRegionSync()).toMatchObject({ country: "AR", currency: "USD" });
    expect(window.localStorage.getItem("nova_region_cache_v2")).toBeNull();
  });

  it("cache v3 de otra versión se ignora", () => {
    window.localStorage.setItem(REGION_CACHE_KEY, JSON.stringify({ v: 2, country: "ES", source: "geo", ts: Date.now() }));
    argentina();
    expect(resolveRegionSync().country).toBe("AR");
  });

  it("el override de pruebas manda; AUTO lo borra junto al estado heredado", () => {
    argentina();
    setCountryOverride("ES");
    expect(resolveRegionSync()).toMatchObject({ country: "ES", source: "override" });
    window.localStorage.setItem("nova_country_preference", "ES");
    window.localStorage.setItem("nova_region_cache_v2", "{}");
    window.localStorage.setItem(REGION_CACHE_KEY, JSON.stringify({ v: 3, country: "ES", source: "geo", ts: Date.now() }));
    setCountryOverride(null); // AUTO
    expect(window.sessionStorage.getItem("__lp_country")).toBeNull();
    expect(window.localStorage.getItem("nova_country_preference")).toBeNull();
    expect(window.localStorage.getItem("nova_region_cache_v2")).toBeNull();
    expect(window.localStorage.getItem(REGION_CACHE_KEY)).toBeNull();
    expect(resolveRegionSync()).toMatchObject({ country: "AR", currency: "USD" });
  });

  it("Europa sigue en EUR", () => {
    mockTimeZone("Europe/Madrid");
    mockNavigator("es-ES", ["es-ES"]);
    expect(resolveRegionSync()).toMatchObject({ country: "ES", currency: "EUR" });
    resetResolvedRegion();
    mockTimeZone("Europe/Paris");
    expect(resolveRegionSync()).toMatchObject({ country: "FR", currency: "EUR" });
  });

  it("sin ninguna señal usa el fallback España/EUR", () => {
    mockNavigator("es", ["es"]);
    expect(resolveRegionSync()).toMatchObject({ country: "ES", currency: "EUR", source: "fallback" });
  });

  it("regla de moneda coherente", () => {
    expect(currencyForCountry("AR")).toBe("USD");
    expect(currencyForCountry("ES")).toBe("EUR");
  });
});

describe("LocalizedPrice: fallback visual con la moneda efectiva", () => {
  it("en AR durante la carga muestra $ y nunca €", () => {
    argentina();
    render(<LocalizedPrice priceId="pri_x" fallbackEur={19.99} />);
    const t = screen.getByText(/19/).textContent || "";
    expect(t).toContain("$");
    expect(t).not.toContain("€");
  });

  it("en AR si PricePreview falla muestra $ y nunca €", () => {
    argentina();
    hoisted.price = { ...hoisted.price, loading: false, error: "paddle_price_error" };
    render(<LocalizedPrice priceId="pri_x" fallbackEur={19.99} />);
    const t = screen.getByText(/19/).textContent || "";
    expect(t).toBe("$19.99");
  });

  it("en ES el fallback sigue en €", () => {
    mockTimeZone("Europe/Madrid");
    hoisted.price = { ...hoisted.price, loading: false, error: "x" };
    render(<LocalizedPrice priceId="pri_x" fallbackEur={19.99} />);
    expect(screen.getByText(/19/).textContent).toContain("€");
  });
});
