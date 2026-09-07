/**
 * Sistema de consentimiento propio de Nova Emprende (Etapa 1).
 *
 * Cookie: nova_consent
 *   Dominio: .editorialnovaemprende.com (en producción) / host-only en preview
 *   Secure; SameSite=Lax; Max-Age = 180 días
 *   Valor (URL-encoded JSON): {"v":1,"analytics":false,"marketing":false,"ts":"2026-09-07T00:00:00.000Z"}
 *
 * No almacena email, identidad, IP ni respuestas del diagnóstico.
 */

export const CONSENT_COOKIE_NAME = "nova_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 180;
export const GTM_CONTAINER_ID = "GTM-WT6XCL29";
/** GA4 medido en una etapa posterior. No se carga gtag.js ni se crea etiqueta en GTM. */
export const GA4_MEASUREMENT_ID = "G-DT26CG2QB1";

const ROOT_DOMAIN = "editorialnovaemprende.com";

export type ConsentState = {
  v: number;
  analytics: boolean;
  marketing: boolean;
  ts: string;
};

export const CONSENT_EVENT = "nova:consent-change";

declare global {
  interface Window {
    dataLayer?: unknown[];
    __novaGtmLoaded?: boolean;
  }
}

/* ------------------------------------------------------------------ cookie */

function cookieDomain(): string | null {
  if (typeof window === "undefined") return null;
  const host = window.location.hostname;
  if (host === ROOT_DOMAIN || host.endsWith(`.${ROOT_DOMAIN}`)) return `.${ROOT_DOMAIN}`;
  // Preview / localhost: cookie host-only (no se puede fijar un dominio raíz ajeno).
  return null;
}

export function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE_NAME}=`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match.slice(CONSENT_COOKIE_NAME.length + 1)));
    if (!parsed || parsed.v !== CONSENT_VERSION) return null;
    return {
      v: CONSENT_VERSION,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      ts: typeof parsed.ts === "string" ? parsed.ts : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean, marketing: boolean): ConsentState {
  const state: ConsentState = {
    v: CONSENT_VERSION,
    analytics,
    marketing,
    ts: new Date().toISOString(),
  };
  const domain = cookieDomain();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(state))}` +
    `; Path=/${domain ? `; Domain=${domain}` : ""}` +
    `; Max-Age=${CONSENT_MAX_AGE_DAYS * 24 * 60 * 60}; SameSite=Lax${secure}`;
  return state;
}

/* --------------------------------------------------------- consent signals */

function pushDataLayer(args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

/** Estado inicial denegado. Se ejecuta antes de cargar cualquier herramienta. */
export function initConsentDefaults() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  pushDataLayer([
    "consent",
    "default",
    {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      security_storage: "granted",
      wait_for_update: 500,
    },
  ]);
}

function updateConsentSignals(state: ConsentState) {
  pushDataLayer([
    "consent",
    "update",
    {
      analytics_storage: state.analytics ? "granted" : "denied",
      ad_storage: state.marketing ? "granted" : "denied",
      ad_user_data: state.marketing ? "granted" : "denied",
      ad_personalization: state.marketing ? "granted" : "denied",
    },
  ]);
}

/* ------------------------------------------------------------- GTM loading */

/** Única función centralizada de carga del contenedor. Sin gtag.js, sin noscript. */
function loadGtm() {
  if (typeof document === "undefined") return;
  if (window.__novaGtmLoaded) return;
  window.__novaGtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
  document.head.appendChild(s);
}

/** Borra cookies de primera parte creadas por las herramientas desactivadas. */
function clearVendorCookies(state: ConsentState) {
  if (typeof document === "undefined") return;
  const prefixes: string[] = [];
  if (!state.analytics) prefixes.push("_ga", "_gid", "_gat");
  if (!state.marketing) prefixes.push("_gcl", "_fbp", "_fbc", "IDE", "test_cookie");
  if (prefixes.length === 0) return;

  const host = window.location.hostname;
  const domains = [undefined, host, `.${host}`];
  if (host.endsWith(ROOT_DOMAIN)) domains.push(`.${ROOT_DOMAIN}`);

  document.cookie.split("; ").forEach((c) => {
    const name = c.split("=")[0];
    if (!prefixes.some((p) => name === p || name.startsWith(p))) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; Path=/; Max-Age=0${d ? `; Domain=${d}` : ""}`;
    });
  });
}

/**
 * Aplica un estado de consentimiento: actualiza señales, carga GTM si procede
 * y limpia cookies de categorías retiradas.
 */
export function applyConsent(state: ConsentState) {
  updateConsentSignals(state);
  clearVendorCookies(state);
  if (state.analytics || state.marketing) loadGtm();
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

/** Arranque de la app: defaults denegados + aplicar preferencia guardada si existe. */
export function bootstrapConsent(): ConsentState | null {
  initConsentDefaults();
  const saved = readConsent();
  if (saved) applyConsent(saved);
  return saved;
}

export function saveConsent(analytics: boolean, marketing: boolean): ConsentState {
  const state = writeConsent(analytics, marketing);
  applyConsent(state);
  return state;
}

/** Abre el panel de preferencias desde cualquier parte (footer). */
export const OPEN_PREFERENCES_EVENT = "nova:open-cookie-preferences";
export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
