import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import PurchaseGate from "@/components/app/PurchaseGate";
import { MOCK_RESOURCES, MOCK_APPS, MOCK_PURCHASES } from "@/data/privateResources";

const ProductoPrivado = () => {
  const { productId = "" } = useParams();
  const purchase = MOCK_PURCHASES.find((p) => p.productId === productId);
  const resources = MOCK_RESOURCES.filter((r) => r.productId === productId);
  const apps = MOCK_APPS.filter((a) => a.productId === productId);

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
              {purchase?.productTitle ?? productId}
            </h1>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Descargas</h2>
            <div className="space-y-2">
              {resources.length === 0 && (
                <p className="text-sm text-muted-foreground">Sin recursos asociados.</p>
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
          </section>

          {apps.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">Apps asociadas</h2>
              <div className="space-y-2">
                {apps.map((a) => (
                  <div
                    key={a.id}
                    className="border border-border rounded-xl p-4 bg-card/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.description}</p>
                    </div>
                    {a.status === "ready" ? (
                      <Link to={a.route}>
                        <Button variant="cta" size="sm">
                          <Rocket className="w-4 h-4" /> Abrir
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">Próximamente</span>
                    )}
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
