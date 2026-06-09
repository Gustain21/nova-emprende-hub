import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePurchases, getSignedDownloadUrl } from "@/hooks/usePurchases";
import { toast } from "sonner";

const Descargas = () => {
  const { resources, loading } = usePurchases();

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const url = await getSignedDownloadUrl(fileId);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      toast.error("No se pudo generar el enlace de descarga", { description: err?.message });
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
              <Button variant="cta" size="sm" onClick={() => handleDownload(r.storagePath, r.title)}>
                <Download className="w-4 h-4" /> Descargar
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
