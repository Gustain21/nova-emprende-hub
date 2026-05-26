import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePurchases } from "@/hooks/usePurchases";

const Descargas = () => {
  const { resources } = usePurchases();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Descargas</h1>
        <p className="text-muted-foreground mt-1">
          Recursos asociados a tus compras. Descargas reales se habilitarán al conectar Storage.
        </p>
      </div>

      <div className="space-y-2">
        {resources.length === 0 && (
          <p className="text-sm text-muted-foreground">Sin descargas disponibles.</p>
        )}
        {resources.map((r) => (
          <div
            key={r.id}
            className="border border-border rounded-xl p-4 bg-card/40 flex items-center justify-between gap-3"
          >
            <div>
              <p className="font-medium text-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground">
                {r.type.toUpperCase()} · {r.sizeLabel}
              </p>
            </div>
            <Button variant="cta" size="sm" disabled>
              <Download className="w-4 h-4" /> Descargar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Descargas;
