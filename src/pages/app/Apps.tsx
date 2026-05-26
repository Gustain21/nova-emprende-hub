import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_APPS } from "@/data/privateResources";
import { usePurchases } from "@/hooks/usePurchases";

const Apps = () => {
  const { owns } = usePurchases();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Apps</h1>
        <p className="text-muted-foreground mt-1">
          Herramientas web internas. Cada cliente solo accede a las apps de los productos que ha comprado.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {MOCK_APPS.map((a) => {
          const unlocked = owns(a.productId) && a.status === "ready";
          return (
            <div key={a.id} className="border border-border rounded-2xl p-6 bg-card/40">
              <div className="w-10 h-10 rounded-lg bg-brand-orange/15 flex items-center justify-center mb-3">
                <Rocket className="w-5 h-5 text-brand-orange" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{a.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
              <div className="mt-4">
                {a.status === "coming-soon" ? (
                  <span className="text-xs text-muted-foreground">Próximamente</span>
                ) : unlocked ? (
                  <Link to={a.route}>
                    <Button variant="cta" size="sm">Abrir app</Button>
                  </Link>
                ) : (
                  <Link to={`/producto/${a.productId}`}>
                    <Button variant="outline" size="sm">Desbloquear</Button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Apps;
