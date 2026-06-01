import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePurchases } from "@/hooks/usePurchases";

const Biblioteca = () => {
  const { purchases } = usePurchases();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Mis productos</h1>
        <p className="text-muted-foreground mt-1">Tus productos comprados.</p>
      </div>

      {purchases.length === 0 ? (
        <p className="text-muted-foreground">Aún no tienes productos.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {purchases.map((p) => (
            <Link
              key={p.id}
              to={`/clientes/mis-productos/${p.productId}`}
              className="border border-border rounded-2xl p-6 bg-card/40 hover:bg-card/70 transition-colors block"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-brand-orange font-bold mb-1">
                    Producto
                  </p>
                  <h3 className="text-lg font-bold text-foreground">{p.productTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comprado el {new Date(p.purchasedAt).toLocaleDateString("es-ES")}
                  </p>
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
