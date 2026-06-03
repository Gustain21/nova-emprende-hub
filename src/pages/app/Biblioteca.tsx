import { Link } from "react-router-dom";
import { ArrowRight, Library } from "lucide-react";
import { usePurchases } from "@/hooks/usePurchases";

const Biblioteca = () => {
  const { products, loading } = usePurchases();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Mis productos</h1>
        <p className="text-muted-foreground mt-1">Productos a los que tienes acceso.</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : products.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 bg-card/40 text-center space-y-3">
          <Library className="w-8 h-8 text-brand-orange mx-auto" />
          <h3 className="text-lg font-bold text-foreground">Aún no tienes productos</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Cuando adquieras un producto de NOVA EMPRENDE, aparecerá aquí con acceso a sus descargas y herramientas.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {products.map((p) => (
            <Link
              key={p.productUuid}
              to={`/clientes/mis-productos/${p.productId}`}
              className="border border-border rounded-2xl p-6 bg-card/40 hover:bg-card/70 transition-colors block"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-brand-orange font-bold mb-1">
                    Producto
                  </p>
                  <h3 className="text-lg font-bold text-foreground">{p.productTitle}</h3>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Biblioteca;
