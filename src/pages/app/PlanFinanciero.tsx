import { Link } from "react-router-dom";
import { ArrowLeft, Calculator } from "lucide-react";
import { useState } from "react";
import PurchaseGate from "@/components/app/PurchaseGate";
import { Input } from "@/components/ui/input";

// App privada de ejemplo asociada al producto "dashboard".
const PlanFinanciero = () => {
  const [ingresos, setIngresos] = useState(5000);
  const [costesFijos, setCostesFijos] = useState(1500);
  const [costesVariables, setCostesVariables] = useState(1200);

  const beneficio = ingresos - costesFijos - costesVariables;
  const margen = ingresos > 0 ? ((beneficio / ingresos) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <Link to="/clientes/herramientas" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver a herramientas
      </Link>

      <PurchaseGate productId="dashboard-financiero-web">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/15 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-brand-orange" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-orange font-bold mb-1">
                App privada · Demo
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Plan Financiero</h1>
              <p className="text-muted-foreground mt-1">
                Simulador mensual. Versión demo, los cálculos no se guardan.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-border rounded-2xl p-6 bg-card/40 space-y-4">
              <h2 className="font-bold text-foreground">Variables</h2>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Ingresos mensuales (€)</label>
                <Input
                  type="number"
                  value={ingresos}
                  onChange={(e) => setIngresos(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Costes fijos (€)</label>
                <Input
                  type="number"
                  value={costesFijos}
                  onChange={(e) => setCostesFijos(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Costes variables (€)</label>
                <Input
                  type="number"
                  value={costesVariables}
                  onChange={(e) => setCostesVariables(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="border border-border rounded-2xl p-6 bg-card/40 space-y-4">
              <h2 className="font-bold text-foreground">Resultados</h2>
              <div>
                <p className="text-sm text-muted-foreground">Beneficio mensual</p>
                <p className="text-3xl font-bold text-foreground">{beneficio.toFixed(2)} €</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Margen neto</p>
                <p className="text-3xl font-bold text-brand-orange">{margen}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Beneficio anual estimado</p>
                <p className="text-xl font-bold text-foreground">{(beneficio * 12).toFixed(2)} €</p>
              </div>
            </div>
          </div>
        </div>
      </PurchaseGate>
    </div>
  );
};

export default PlanFinanciero;
