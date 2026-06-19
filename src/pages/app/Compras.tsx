import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { usePurchases, type PurchaseRow } from "@/hooks/usePurchases";
import { formatPrice } from "@/lib/region/RegionContext";

const CONFIRMED_STATUSES = new Set(["completed", "paid", "succeeded"]);
const PENDING_STATUSES = new Set(["pending", "pending_payment", "draft", "ready", "created"]);

const statusLabel = (s: string) => {
  const k = s.toLowerCase();
  if (CONFIRMED_STATUSES.has(k)) return "Confirmada";
  if (PENDING_STATUSES.has(k)) return "Pendiente";
  if (k === "cancelled" || k === "canceled") return "Cancelada";
  if (k === "failed") return "Fallida";
  return s;
};

const Compras = () => {
  const { purchases, loading } = usePurchases();
  const [search] = useSearchParams();
  const payment = search.get("payment");

  const { confirmed, pending } = useMemo(() => {
    const confirmed: PurchaseRow[] = [];
    const pendingAll: PurchaseRow[] = [];
    for (const p of purchases) {
      const s = (p.status || "").toLowerCase();
      if (CONFIRMED_STATUSES.has(s)) confirmed.push(p);
      else if (PENDING_STATUSES.has(s)) pendingAll.push(p);
    }
    // dedupe pendientes: mismo producto y mismo día → conservar el más reciente
    const seen = new Map<string, PurchaseRow>();
    for (const p of pendingAll) {
      const day = new Date(p.purchasedAt).toISOString().slice(0, 10);
      const key = `${p.productUuid}|${day}`;
      const prev = seen.get(key);
      if (!prev || new Date(p.purchasedAt) > new Date(prev.purchasedAt)) {
        seen.set(key, p);
      }
    }
    return { confirmed, pending: Array.from(seen.values()) };
  }, [purchases]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Compras y facturas</h1>
        <p className="text-muted-foreground mt-1">
          Historial de tus compras confirmadas. Los recibos los envía automáticamente el proveedor de pago.
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
      ) : confirmed.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 bg-card/40 text-center">
          <p className="text-sm text-muted-foreground">Aún no tienes compras confirmadas.</p>
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
                <th className="px-4 py-3 font-medium">Factura / Recibo</th>
              </tr>
            </thead>
            <tbody>
              {confirmed.map((p) => {
                const isPaddle = (p.provider ?? "").toLowerCase() === "paddle";
                return (
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
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-400">
                        {statusLabel(p.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {isPaddle ? "Recibo enviado por Paddle" : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pending.length > 0 && (
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Intentos de pago pendientes</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Intentos iniciados que aún no se han confirmado. No suponen un cobro.
            </p>
          </div>
          <div className="border border-border rounded-2xl overflow-hidden bg-card/20">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Producto</th>
                  <th className="px-4 py-3 font-medium">Importe</th>
                  <th className="px-4 py-3 font-medium">Proveedor</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(p.purchasedAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.productTitle}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatPrice(p.amount, p.currency)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{p.provider ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-yellow-500/15 text-yellow-300">
                        {statusLabel(p.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compras;
