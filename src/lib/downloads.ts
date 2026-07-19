// Descarga segura de archivos protegidos.
// - Solicita signed URL a la Edge Function (valida JWT + entitlement).
// - En navegadores desktop intenta forzar descarga con <a download>.
// - En Safari iOS/Android hace fallback a window.location.assign para
//   evitar el bloqueo del atributo `download` tras un await.

import { getSignedDownloadUrl } from "@/hooks/usePurchases";
import { toast } from "sonner";

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  // iPad on iPadOS reports as Macintosh with touch
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && "ontouchend" in document);
}

function isSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
}

export async function downloadProtectedFile(fileId: string, fileName: string): Promise<void> {
  let url: string;
  try {
    url = await getSignedDownloadUrl(fileId, 120);
  } catch (err: any) {
    const raw = err?.message || err?.error || "";
    console.error("[download] signed url error", raw);
    let msg = "No pudimos preparar la descarga. Inténtalo nuevamente.";
    if (/permiso|acceso|403/i.test(raw)) msg = "No tienes permiso para descargar este producto.";
    else if (/no disponible|404|not found|no encontr/i.test(raw)) msg = "No se encontró el archivo.";
    toast.error(msg);
    throw err;
  }

  // Safari (iPhone/iPad/desktop): navegación directa — la signed URL viene con
  // Content-Disposition: attachment por la opción `download` en createSignedUrl.
  if (isIOS() || isSafari()) {
    window.location.assign(url);
    return;
  }

  // Resto de navegadores: anchor click con atributo download.
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (e) {
    console.warn("[download] anchor click failed, navigating", e);
    window.location.assign(url);
  }
}
