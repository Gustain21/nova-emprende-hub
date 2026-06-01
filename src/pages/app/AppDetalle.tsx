import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MOCK_APPS } from "@/data/privateResources";
import PurchaseGate from "@/components/app/PurchaseGate";

const AppDetalle = () => {
  const { appId = "" } = useParams();
  const app = MOCK_APPS.find((a) => a.id === appId);

  if (!app) {
    return (
      <div className="space-y-4">
        <Link to="/clientes/herramientas" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver
        </Link>
        <p className="text-muted-foreground">Herramienta no encontrada.</p>
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
            <p className="text-xs uppercase tracking-widest text-brand-orange font-bold mb-1">App</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{app.title}</h1>
            <p className="text-muted-foreground mt-2">{app.description}</p>
          </div>
          <div className="border border-border rounded-2xl p-8 bg-card/40 text-center text-muted-foreground">
            App embebida aquí en una fase posterior.
          </div>
        </div>
      </PurchaseGate>
    </div>
  );
};

export default AppDetalle;
