import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  resolveRegionSync,
  resetResolvedRegion,
  setCountryPreference,
  countryFromTimeZone,
  countryFromNavigator,
  COUNTRY_PREFERENCE_KEY,
} from "@/lib/region/resolveCountry";
import { currencyForCountry } from "@/lib/pricing/currencyRule";

function mockNavigator(language: string | undefined, languages: string[] = []) {
  Object.defineProperty(window.navigator, "language", { value: language, configurable: true });
  Object.defineProperty(window.navigator, "languages", { value: languages, configurable: true });
}

function mockTimeZone(timeZone: string | undefined) {
  vi.spyOn(Intl, "DateTimeFormat").mockImplementation(
    () => ({ resolvedOptions: () => ({ timeZone }) }) as unknown as Intl.DateTimeFormat,
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  window.sessionStorage.clear();
  mockNavigator(undefined, []);
  mockTimeZone(undefined);
  resetResolvedRegion();
});

describe("resolución de país y moneda", () => {
  it("es-AR resuelve Argentina y USD", () => {
    mockNavigator("es-AR", ["es-AR", "es"]);
    const r = resolveRegionSync();
    expect(r.country).toBe("AR");
    expect(r.currency).toBe("USD");
    expect(countryFromNavigator()).toBe("AR");
  });

  it("la zona horaria de Argentina resuelve USD aunque el idioma sea es-ES o es-419", () => {
    mockTimeZone("America/Argentina/Buenos_Aires");
    mockNavigator("es-ES", ["es-ES", "es"]);
    const conEspanol = resolveRegionSync();
    expect(conEspanol.country).toBe("AR");
    expect(conEspanol.currency).toBe("USD");
    expect(conEspanol.source).toBe("timezone");

    resetResolvedRegion();
    mockNavigator("es-419", ["es-419", "es"]);
    const conLatam = resolveRegionSync();
    expect(conLatam.country).toBe("AR");
    expect(conLatam.currency).toBe("USD");
  });

  it("reconoce otras zonas horarias argentinas", () => {
    expect(countryFromTimeZone("America/Argentina/Cordoba")).toBe("AR");
    expect(countryFromTimeZone("America/Argentina/Mendoza")).toBe("AR");
    expect(countryFromTimeZone("America/Buenos_Aires")).toBe("AR");
  });

  it("la preferencia explícita del usuario manda sobre cualquier señal", () => {
    mockTimeZone("Europe/Madrid");
    mockNavigator("es-ES", ["es-ES"]);
    setCountryPreference("AR");
    const r = resolveRegionSync();
    expect(r.country).toBe("AR");
    expect(r.currency).toBe("USD");
    expect(r.source).toBe("preference");
    expect(window.localStorage.getItem(COUNTRY_PREFERENCE_KEY)).toBe("AR");

    setCountryPreference(null);
    expect(resolveRegionSync().country).toBe("ES");
  });

  it("Europa sigue en EUR", () => {
    mockTimeZone("Europe/Madrid");
    mockNavigator("es-ES", ["es-ES"]);
    expect(resolveRegionSync()).toMatchObject({ country: "ES", currency: "EUR" });

    resetResolvedRegion();
    mockTimeZone("Europe/Paris");
    mockNavigator("fr-FR", ["fr-FR"]);
    expect(resolveRegionSync()).toMatchObject({ country: "FR", currency: "EUR" });

    resetResolvedRegion();
    mockTimeZone(undefined);
    mockNavigator("it-IT", ["it-IT"]);
    expect(resolveRegionSync()).toMatchObject({ country: "IT", currency: "EUR" });
  });

  it("sin ninguna señal usa el fallback España/EUR", () => {
    mockNavigator("es", ["es"]);
    expect(resolveRegionSync()).toMatchObject({ country: "ES", currency: "EUR", source: "fallback" });
  });

  it("la regla de moneda es coherente para los países clave", () => {
    expect(currencyForCountry("AR")).toBe("USD");
    expect(currencyForCountry("MX")).toBe("USD");
    expect(currencyForCountry("ES")).toBe("EUR");
    expect(currencyForCountry("DE")).toBe("EUR");
  });
});
