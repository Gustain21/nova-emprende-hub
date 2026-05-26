import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePurchases } from "@/hooks/usePurchases";

interface Props {
  productId: string;
  children: React.ReactNode;
}

const PurchaseGate = ({ productId, children }: Props) => {
  const { owns } = usePurchases();

  if (owns(productId)) return <>{children}</>;

  return (
    <div className="border border-border rounded-2xl p-8 bg-card/40 text-center space-y-5">
      <div className="w-14 h-14 rounded-xl bg-brand-orange/15 flex items-center justify-center mx-auto">
        <Lock className="w-6 h-6 text-brand-orange" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">Acceso bloqueado</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Este recurso forma parte de un producto que aún no has comprado.
        </p>
      </div>
      <Link to={`/producto/${productId}`}>
        <Button variant="cta">Ver producto</Button>
      </Link>
    </div>
  );
};

export default PurchaseGate;
