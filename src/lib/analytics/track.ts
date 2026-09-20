/**
 * Capa central de analítica comercial de Nova Emprende.
 *
 * Reglas invariables:
 *  - El sistema de consentimiento (src/lib/consent/consent.ts) es la ÚNICA fuente
 *    de verdad. Sin consentimiento analítico válido NO se emite ningún evento.
 *  - Nunca se envían datos personales (email, nombre, user_id, IP, teléfono…).
 *  - No se carga GA4 ni gtag.js aquí; solo se empuja a dataLayer. La etiqueta GA4
 *    vive dentro de GTM (GTM-WT6XCL29 → G-DT26CG2QB1).
 */

import { readConsent } from "@/lib/consent/consent";

export type EventParams = Record<string, unknown>;

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price?: number;
  quantity?: number;
  index?: number;
}

/** Claves prohibidas: si aparecen, se descartan antes del push. */
const PII_KEYS = new Set([
  "email",
  "e_mail",
  "mail",
  "user_id",
  "userid",
  "uid",
  "name",
  "full_name",
  "fullname",
  "first_name",
  "last_name",
  "phone",
  "telephone",
  "address",
  "ip",
  "ip_address",
  "password",
  "customer_email",
  "buyer_email",
]);

function stripPII<T>(value: T): T {
  if (Array.isArray(value)) return value.map((v) => stripPII(v)) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (PII_KEYS.has(k.toLowerCase())) continue;
      out[k] = stripPII(v);
    }
    return out as unknown as T;
  }
  return value;
}

/** Elimina claves con valor undefined/null para no ensuciar GA4. */
function compact(params: EventParams): EventParams {
  const out: EventParams = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    out[k] = v;
  }
  return out;
}

export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true;
}

function dataLayer(): unknown[] | null {
  if (typeof window === "undefined") return null;
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

/**
 * Emite un evento a dataLayer. Devuelve true si se ha emitido realmente.
 * Cualquier llamada sin consentimiento analítico se descarta silenciosamente.
 */
export function trackEvent(event: string, params: EventParams = {}): boolean {
  if (!event) return false;
  if (!hasAnalyticsConsent()) return false;
  const dl = dataLayer();
  if (!dl) return false;
  dl.push({ event, ...compact(stripPII(params)) });
  return true;
}

/**
 * Evento de ecommerce GA4: limpia el objeto `ecommerce` previo antes de empujar,
 * tal como recomienda Google para evitar la mezcla de datos entre eventos.
 */
export function trackEcommerce(
  event: string,
  ecommerce: EventParams,
  extra: EventParams = {},
): boolean {
  if (!hasAnalyticsConsent()) return false;
  const dl = dataLayer();
  if (!dl) return false;
  dl.push({ ecommerce: null });
  dl.push({ event, ...compact(stripPII(extra)), ecommerce: compact(stripPII(ecommerce)) });
  return true;
}

/* ------------------------------------------------------------- deduplicación */

const emitted = new Set<string>();

/** Ejecuta `fn` una sola vez por clave durante la vida de la página. */
export function trackOnce(key: string, fn: () => boolean): boolean {
  if (emitted.has(key)) return false;
  // Si no hay consentimiento el evento no se marca como emitido: podrá emitirse
  // más tarde si el usuario acepta y la vista se vuelve a renderizar.
  const sent = fn();
  if (sent) emitted.add(key);
  return sent;
}

/** Solo para pruebas. */
export function __resetAnalyticsState() {
  emitted.clear();
  lastPageViewPath = null;
  initialPageViewSkipped = false;
}

/* --------------------------------------------------------------- page_view */

let lastPageViewPath: string | null = null;
let initialPageViewSkipped = false;

/**
 * page_view en SPA.
 *
 * La primera ruta de la sesión ya la mide la etiqueta de configuración de GA4
 * cuando GTM se carga, así que aquí se omite. Esa primera ruta se recuerda
 * SIEMPRE, incluso sin consentimiento: si el usuario acepta más tarde, GTM mide
 * la ruta en la que está en ese momento y el siguiente cambio real de ruta debe
 * emitir su page_view sin perderse por el mecanismo de omisión inicial.
 */
export function trackPageView(path: string, title?: string): boolean {
  const consented = hasAnalyticsConsent();

  if (!initialPageViewSkipped) {
    initialPageViewSkipped = true;
    lastPageViewPath = path;
    return false;
  }
  if (path === lastPageViewPath) return false;

  // Sin consentimiento no se emite nada, pero se sigue recordando la ruta
  // actual: es la que GTM/GA4 medirán automáticamente si se acepta después.
  lastPageViewPath = path;
  if (!consented) return false;

  return trackEvent("page_view", {
    page_path: path,
    page_title: title ?? (typeof document !== "undefined" ? document.title : undefined),
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
  });
}


/* ------------------------------------------------------- eventos de negocio */

export function trackViewItemList(params: {
  listId: string;
  listName: string;
  items: AnalyticsItem[];
  currency?: string | null;
}) {
  const { listId, listName, items, currency } = params;
  if (!items.length) return false;
  return trackOnce(`view_item_list:${listId}`, () =>
    trackEcommerce("view_item_list", {
      item_list_id: listId,
      item_list_name: listName,
      currency: currency ?? undefined,
      items: items.map((i, index) => ({ index, item_list_id: listId, item_list_name: listName, ...i })),
    }),
  );
}

export function trackSelectItem(params: {
  listId?: string;
  listName?: string;
  item: AnalyticsItem;
  currency?: string | null;
}) {
  const { listId, listName, item, currency } = params;
  return trackEcommerce("select_item", {
    item_list_id: listId,
    item_list_name: listName,
    currency: currency ?? undefined,
    items: [{ ...item, item_list_id: listId, item_list_name: listName }],
  });
}

export function trackViewItem(params: {
  item: AnalyticsItem;
  currency?: string | null;
  value?: number | null;
}) {
  const { item, currency, value } = params;
  return trackOnce(`view_item:${item.item_id}`, () =>
    trackEcommerce("view_item", {
      currency: currency ?? undefined,
      value: value ?? undefined,
      items: [item],
    }),
  );
}

export function trackBeginCheckout(params: {
  item: AnalyticsItem;
  currency?: string | null;
  value?: number | null;
}) {
  const { item, currency, value } = params;
  return trackEcommerce("begin_checkout", {
    currency: currency ?? undefined,
    value: value ?? undefined,
    items: [item],
  });
}

export function trackPurchase(params: {
  transactionId: string;
  currency?: string | null;
  value?: number | null;
  items?: AnalyticsItem[];
}) {
  const { transactionId, currency, value, items } = params;
  if (!transactionId) return false;
  return trackOnce(`purchase:${transactionId}`, () =>
    trackEcommerce("purchase", {
      transaction_id: transactionId,
      currency: currency ?? undefined,
      value: value ?? undefined,
      items: items && items.length ? items : undefined,
    }),
  );
}

export function trackSignUp(method = "password") {
  return trackEvent("sign_up", { method });
}

export function trackLogin(method = "password") {
  return trackEvent("login", { method });
}

export function trackFileDownload(params: {
  fileName: string;
  fileExtension?: string | null;
  productSlug?: string | null;
}) {
  const { fileName, fileExtension, productSlug } = params;
  return trackEvent("file_download", {
    file_name: fileName,
    file_extension: fileExtension ?? undefined,
    product_slug: productSlug ?? undefined,
  });
}
