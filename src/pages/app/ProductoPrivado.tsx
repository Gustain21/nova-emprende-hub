import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import PurchaseGate from "@/components/app/PurchaseGate";
import { usePurchases, getSignedDownloadUrl } from "@/hooks/usePurchases";
import { toast } from "sonner";

const ProductoPrivado = () => {
  const { productId = "" } = useParams();
  const { products, resources, apps, loading } = usePurchases();
  const product = products.find((p) => p.productId === productId);
  const productResources = resources.filter((r) => r.productId === productId);
  const productApps = apps.filter((a) => a.productId === productId);

  const handleDownload = async (storagePath: string, fileName: string) => {
    try {
      const url = await getSignedDownloadUrl(storagePath);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      toast.error("No se pudo generar la descarga", { description: err?.message });
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/clientes/mis-productos" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver a mis productos
      </Link>

      <PurchaseGate productId={productId}>
        <div className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-orange font-bold mb-1">
              Producto
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {product?.productTitle ?? productId}
            </h1>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Descargas</h2>
            <div className="space-y-2">
              {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
              {!loading && productResources.length === 0 && (
                <p className="text-sm text-muted-foreground">Sin descargas todavía.</p>
              )}
              {productResources.map((r) => (
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
          </section>

          {productApps.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">Herramientas web</h2>
              <div className="space-y-2">
                {productApps.map((a) => (
                  <div
                    key={a.id}
                    className="border border-border rounded-xl p-4 bg-card/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{a.title}</p>
                    </div>
                    <Link to={a.route}>
                      <Button variant="cta" size="sm">
                        <Rocket className="w-4 h-4" /> Abrir
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </PurchaseGate>
    </div>
  );
};

export default ProductoPrivado;
