import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePurchases } from "@/hooks/usePurchases";
import { downloadProtectedFile } from "@/lib/downloads";

const Descargas = () => {
  const { resources, loading } = usePurchases();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleDownload = async (fileId: string, fileName: string) => {
    setPendingId(fileId);
    try {
      await downloadProtectedFile(fileId, fileName);
    } catch {
      // toast ya mostrado
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Descargas</h1>
        <p className="text-muted-foreground mt-1">
          Archivos privados asociados a tus productos. Cada descarga usa un enlace temporal seguro.
        </p>
      </div>

      <div className="space-y-2">
        {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
        {!loading && resources.length === 0 && (
          <div className="border border-border rounded-2xl p-10 bg-card/40 text-center">
            <p className="text-sm text-muted-foreground">
              No hay descargas disponibles todavía. Los archivos de tus productos aparecerán aquí en cuanto se publiquen.
            </p>
          </div>
        )}
        {resources.map((r) => (
          <div
            key={r.id}
            className="border border-border rounded-xl p-4 bg-card/40 flex items-center justify-between gap-3"
          >
            <div>
              <p className="font-medium text-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.type.toUpperCase()}</p>
            </div>
            {r.available ? (
              <Button
                variant="cta"
                size="sm"
                onClick={() => handleDownload(r.id, r.title)}
                disabled={pendingId === r.id}
              >
                {pendingId === r.id ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Preparando descarga…</>
                ) : (
                  <><Download className="w-4 h-4" /> Descargar</>
                )}
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Archivo pendiente de carga
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Descargas;
