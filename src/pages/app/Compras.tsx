import { useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { usePurchases } from "@/hooks/usePurchases";
import { formatPrice } from "@/lib/region/RegionContext";

const Compras = () => {
  const { purchases, loading } = usePurchases();
  const [search] = useSearchParams();
  const payment = search.get("payment");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Compras y facturas</h1>
        <p className="text-muted-foreground mt-1">
          Historial de tus compras. Las facturas se generarán automáticamente al integrar Stripe y Paddle.
        </p>
      </div>

      {payment === "success" && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-brand-orange/30 bg-brand-orange/10">
          <CheckCircle2 className="w-5 h-5 text-brand-orange mt-0.5" />
          <div className="text-sm text-foreground">
            Compra confirmada. Tu acceso ya está disponible en el Área de clientes.
          </div>
        </div>
      )}
      {payment === "cancelled" && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
          <XCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="text-sm text-yellow-200">
            Pago cancelado. Puedes intentarlo nuevamente cuando quieras.
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : purchases.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 bg-card/40 text-center">
          <p className="text-sm text-muted-foreground">Aún no tienes compras registradas.</p>
        </div>
      ) : (
        <div className="border border-border rounded-2xl overflow-hidden bg-card/40">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Importe</th>
                <th className="px-4 py-3 font-medium">Proveedor</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Factura</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">
                    {new Date(p.purchasedAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-4 py-3 text-foreground">{p.productTitle}</td>
                  <td className="px-4 py-3 text-foreground">
                    {formatPrice(p.amount, p.currency)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{p.provider ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-brand-orange/15 text-brand-orange capitalize">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-muted-foreground text-xs" disabled>
                      Pendiente
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Compras;
