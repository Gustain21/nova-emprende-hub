import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePurchases } from "@/hooks/usePurchases";

const Apps = () => {
  const { apps, loading } = usePurchases();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Herramientas web</h1>
        <p className="text-muted-foreground mt-1">
          Herramientas web privadas asociadas a los productos que has adquirido.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : apps.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 bg-card/40 text-center space-y-2">
          <Rocket className="w-8 h-8 text-brand-orange mx-auto" />
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Aún no tienes herramientas web disponibles. Aparecerán aquí cuando adquieras un producto que las incluya.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {apps.map((a) => (
            <div key={a.id} className="border border-border rounded-2xl p-6 bg-card/40">
              <div className="w-10 h-10 rounded-lg bg-brand-orange/15 flex items-center justify-center mb-3">
                <Rocket className="w-5 h-5 text-brand-orange" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{a.title}</h3>
              <div className="mt-4">
                <Link to={a.route}>
                  <Button variant="cta" size="sm">Abrir herramienta</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Apps;
