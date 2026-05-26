import { usePurchases } from "@/hooks/usePurchases";

const Compras = () => {
  const { purchases } = usePurchases();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Compras y facturas</h1>
        <p className="text-muted-foreground mt-1">
          Historial demo. La facturación real se generará al conectar Stripe.
        </p>
      </div>

      <div className="border border-border rounded-2xl overflow-hidden bg-card/40">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Importe</th>
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
                  {p.amount.toFixed(2)} {p.currency}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-brand-orange/15 text-brand-orange">
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-brand-orange hover:underline text-xs" disabled>
                    Descargar PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compras;
