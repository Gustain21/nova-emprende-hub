import { trackEvent } from "@/lib/analytics/track";

/**
 * URL única y centralizada del Diagnóstico Big Bang.
 * Sustituir aquí cuando el diagnóstico se integre en producción.
 */
export const DIAGNOSTIC_URL =
  "https://diagnostico.editorialnovaemprende.com/propuesta-diagnostico";

export const DIAGNOSTIC_COPY = {
  title: "¿No sabes por dónde empezar con tu idea o negocio?",
  text: "Haz el Diagnóstico Big Bang y descubre en qué etapa se encuentra tu proyecto, qué bloqueos debes resolver y cuál puede ser tu próximo paso.",
  cta: "Haz el Diagnóstico Big Bang",
  trust: "Gratuito · 3 minutos · 12 preguntas · Resultado personalizado",
} as const;

export type DiagnosticSource = "inicio" | "ebook" | "ecosistema" | "footer";

/** Registra el evento mediante la utilidad central (respeta el consentimiento). */
export function trackDiagnosticClick(source: DiagnosticSource) {
  trackEvent("diagnostic_cta_clicked", { source_page: source });
}
