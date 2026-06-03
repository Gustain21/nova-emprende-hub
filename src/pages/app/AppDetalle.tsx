import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePurchases } from "@/hooks/usePurchases";
import PurchaseGate from "@/components/app/PurchaseGate";

const AppDetalle = () => {
  const { appId = "" } = useParams();
  const { apps } = usePurchases();
  const app = apps.find((a) => a.route.endsWith(`/${appId}`) || a.id === appId);

  if (!app) {
    return (
      <div className="space-y-4">
        <Link to="/clientes/herramientas" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver
        </Link>
        <p className="text-muted-foreground">Herramienta no encontrada o sin acceso.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/clientes/herramientas" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver a herramientas
      </Link>

      <PurchaseGate productId={app.productId}>
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-orange font-bold mb-1">Herramienta</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{app.title}</h1>
          </div>
          <div className="border border-border rounded-2xl p-8 bg-card/40 text-center text-muted-foreground">
            Esta herramienta se cargará aquí en una fase posterior.
          </div>
        </div>
      </PurchaseGate>
    </div>
  );
};

export default AppDetalle;
