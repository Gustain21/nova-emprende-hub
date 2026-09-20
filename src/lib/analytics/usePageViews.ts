import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics/track";

/**
 * Registra page_view en cada cambio real de ruta (SPA).
 * La primera vista la mide la etiqueta de configuración de GA4 en GTM.
 */
export function usePageViews() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
}
