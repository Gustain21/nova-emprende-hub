import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  bootstrapConsent,
  readConsent,
  saveConsent,
  OPEN_PREFERENCES_EVENT,
} from "@/lib/consent/consent";

const BANNER_TEXT =
  "Usamos cookies necesarias para que la web funcione. Con tu permiso, también utilizaremos cookies de analítica para comprender cómo se utiliza Nova Emprende y cookies de marketing para medir y mejorar nuestras campañas. Puedes aceptar, rechazar o configurar tus preferencias.";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = bootstrapConsent();
    if (!saved) {
      setShowBanner(true);
    } else {
      setAnalytics(saved.analytics);
      setMarketing(saved.marketing);
    }
  }, []);

  useEffect(() => {
    const onOpen = () => {
      const saved = readConsent();
      setAnalytics(saved?.analytics ?? false);
      setMarketing(saved?.marketing ?? false);
      setPanelOpen(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpen);
  }, []);

  const persist = (a: boolean, m: boolean) => {
    saveConsent(a, m);
    setAnalytics(a);
    setMarketing(m);
    setShowBanner(false);
    setPanelOpen(false);
  };

  return (
    <>
      {showBanner && !panelOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Preferencias de cookies"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/98 backdrop-blur supports-[backdrop-filter]:bg-card/95"
        >
          <div className="brand-container py-5 md:py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl space-y-2">
                <p className="text-sm leading-relaxed text-muted-foreground">{BANNER_TEXT}</p>
                <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <Link to="/cookies" className="text-brand-orange underline underline-offset-2">
                    Política de Cookies
                  </Link>
                  <Link to="/privacidad" className="text-brand-orange underline underline-offset-2">
                    Política de Privacidad
                  </Link>
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto lg:shrink-0">
                <Button
                  variant="outline"
                  className="w-full sm:w-40"
                  onClick={() => persist(true, true)}
                >
                  Aceptar todas
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-40"
                  onClick={() => persist(false, false)}
                >
                  Rechazar
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-40"
                  onClick={() => setPanelOpen(true)}
                >
                  Configurar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={panelOpen} onOpenChange={setPanelOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Configurar cookies</DialogTitle>
            <DialogDescription>
              Elige qué categorías quieres permitir. Puedes cambiar tu decisión en cualquier momento
              desde el enlace «Configurar cookies» del pie de página.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Necesarias</p>
                <p className="text-xs text-muted-foreground">
                  Imprescindibles para el funcionamiento técnico, la seguridad, la sesión, el acceso
                  de clientes, el pago con Paddle y la conservación de tus preferencias esenciales.
                  Siempre activas.
                </p>
              </div>
              <Switch checked disabled aria-label="Cookies necesarias (siempre activas)" />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Analítica</p>
                <p className="text-xs text-muted-foreground">
                  Nos permiten comprender cómo se utiliza la web (Google Analytics 4 a través de
                  Google Tag Manager). Desactivadas por defecto.
                </p>
              </div>
              <Switch checked={analytics} onCheckedChange={setAnalytics} aria-label="Cookies de analítica" />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Marketing</p>
                <p className="text-xs text-muted-foreground">
                  Nos permitirían medir y mejorar nuestras campañas publicitarias. Desactivadas por
                  defecto.
                </p>
              </div>
              <Switch checked={marketing} onCheckedChange={setMarketing} aria-label="Cookies de marketing" />
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            <Button variant="ghost" onClick={() => setPanelOpen(false)}>
              Volver sin aceptar
            </Button>
            <Button onClick={() => persist(analytics, marketing)}>Guardar preferencias</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;
