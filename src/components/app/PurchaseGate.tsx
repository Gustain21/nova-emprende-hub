import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePurchases } from "@/hooks/usePurchases";

interface Props {
  productId: string; // slug del producto
  children: React.ReactNode;
}

const PurchaseGate = ({ productId, children }: Props) => {
  const { owns, loading } = usePurchases();

  if (loading) {
    return <p className="text-sm text-muted-foreground">Verificando acceso…</p>;
  }

  if (owns(productId)) return <>{children}</>;

  return (
    <div className="border border-border rounded-2xl p-10 bg-card/40 text-center space-y-5">
      <div className="w-14 h-14 rounded-xl bg-brand-orange/15 flex items-center justify-center mx-auto">
        <Lock className="w-6 h-6 text-brand-orange" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">No tienes acceso a esta herramienta</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Puedes adquirirla desde la página del producto para desbloquear esta herramienta y sus descargas.
        </p>
      </div>
      <Link to="/">
        <Button variant="cta">Ver productos</Button>
      </Link>
    </div>
  );
};

export default PurchaseGate;
