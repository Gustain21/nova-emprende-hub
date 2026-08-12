/**
 * URL única y centralizada del Diagnóstico Big Bang.
 * Sustituir aquí cuando el diagnóstico se integre en producción.
 */
export const DIAGNOSTIC_URL =
  "https://id-preview--d010bdde-8905-4f42-a742-37908d84ce20.lovable.app/diagnostico-big-bang";

export const DIAGNOSTIC_COPY = {
  title: "¿No sabes por dónde empezar con tu idea o negocio?",
  text: "Haz el Diagnóstico Big Bang y descubre en qué etapa se encuentra tu proyecto, qué bloqueos debes resolver y cuál puede ser tu próximo paso.",
  cta: "Haz el Diagnóstico Big Bang",
  trust: "Gratuito · 3 minutos · 12 preguntas · Resultado personalizado",
} as const;

export type DiagnosticSource = "inicio" | "ebook" | "ecosistema" | "footer";

/** Registra el evento solo si ya existe analítica en la página. */
export function trackDiagnosticClick(source: DiagnosticSource) {
  const payload = { source_page: source };
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    plausible?: (name: string, opts?: unknown) => void;
  };
  try {
    if (typeof w.gtag === "function") {
      w.gtag("event", "diagnostic_cta_clicked", payload);
    } else if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: "diagnostic_cta_clicked", ...payload });
    } else if (typeof w.plausible === "function") {
      w.plausible("diagnostic_cta_clicked", { props: payload });
    }
  } catch {
    /* noop */
  }
}
