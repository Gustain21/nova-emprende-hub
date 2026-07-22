import { Link } from "react-router-dom";
import { ArrowLeft, List, BarChart3, Wallet, FileSpreadsheet, Loader2, Check, AlertCircle, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useDashboardProgress, SaveStatus } from "@/features/dashboard-financiero/hooks/useDashboardProgress";
import { useFinancialCalculations } from "@/features/dashboard-financiero/hooks/useFinancialCalculations";
import { ConfigSidebar } from "@/features/dashboard-financiero/components/ConfigSidebar";
import { MetricCard } from "@/features/dashboard-financiero/components/MetricCard";
import { PLChart, CashFlowChart } from "@/features/dashboard-financiero/components/FinancialCharts";
import { DataTable } from "@/features/dashboard-financiero/components/DataTable";
import { RiskAnalysis } from "@/features/dashboard-financiero/components/RiskAnalysis";
import { usePurchases } from "@/hooks/usePurchases";

const SaveIndicator = ({ status }: { status: SaveStatus }) => {
  if (status === "loading") return <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Cargando datos…</span>;
  if (status === "saving") return <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Guardando</span>;
  if (status === "saved") return <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500"><Check className="h-3 w-3" /> Guardado</span>;
  if (status === "error") return <span className="inline-flex items-center gap-1 text-[11px] text-destructive"><AlertCircle className="h-3 w-3" /> Error al guardar</span>;
  return <span className="text-[11px] text-muted-foreground">Listo</span>;
};

const NoAccess = () => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-background">
    <div className="max-w-md text-center border border-border rounded-2xl p-10 bg-card/40 space-y-5">
      <div className="w-14 h-14 rounded-xl bg-brand-orange/15 flex items-center justify-center mx-auto"><Lock className="w-6 h-6 text-brand-orange" /></div>
      <h1 className="text-2xl font-bold text-foreground">No tienes acceso al Dashboard Financiero</h1>
      <p className="text-sm text-muted-foreground">Adquiere el Dashboard Financiero (o el Pack Impulso / Pack Dominio) para desbloquear esta herramienta.</p>
      <Link to="/"><Button variant="cta">Ver catálogo</Button></Link>
    </div>
  </div>
);

const DashboardFinanciero = () => {
  const { owns, loading: purchasesLoading } = usePurchases();
  const { config, setConfig, status } = useDashboardProgress();
  const results = useFinancialCalculations(config);

  const formatCurrency = (v: number) => new Intl.NumberFormat(results.country.locale, {
    style: 'currency', currency: results.country.currency, maximumFractionDigits: 0,
  }).format(v);

  if (purchasesLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Verificando acceso…</div>;
  }
  if (!owns("dashboard-financiero")) return <NoAccess />;

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="w-full flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/clientes" className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition hover:border-brand-orange hover:text-brand-orange">
              <ArrowLeft className="h-3 w-3" /> <span className="hidden sm:inline">Área de clientes</span><span className="sm:hidden">Clientes</span>
            </Link>
            <Link to="/clientes/herramientas" className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition hover:border-brand-orange hover:text-brand-orange">
              <List className="h-3 w-3" /> Herramientas
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm font-semibold text-foreground">Dashboard Financiero</span>
            <SaveIndicator status={status} />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row w-full">
        <ConfigSidebar config={config} onConfigChange={setConfig} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Financiero</h1>
            <p className="text-muted-foreground text-sm mt-1">Planes financieros estratégicos · Infoproductos & E-commerce</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard title="Beneficio Neto (Año 1)" value={formatCurrency(results.kpis.beneficioNetoY1)} />
            <MetricCard title="Caja Disponible (Fin Año 1)" value={formatCurrency(results.kpis.cajaY1)} />
            <MetricCard title="Rentabilidad (ROE A1)" value={`${results.kpis.roeY1.toFixed(1)}%`} />
            <MetricCard title="Break Even (Ventas)" value={formatCurrency(results.kpis.breakEven)} />
          </div>

          <Tabs defaultValue="pl">
            <TabsList className="mb-6">
              <TabsTrigger value="pl" className="gap-2"><BarChart3 className="w-4 h-4" /><span className="hidden sm:inline">Cuenta de Resultados</span><span className="sm:hidden">P&L</span></TabsTrigger>
              <TabsTrigger value="cash" className="gap-2"><Wallet className="w-4 h-4" /><span className="hidden sm:inline">Flujo de Caja</span><span className="sm:hidden">Cash</span></TabsTrigger>
              <TabsTrigger value="data" className="gap-2"><FileSpreadsheet className="w-4 h-4" /><span className="hidden sm:inline">Datos Detallados</span><span className="sm:hidden">Datos</span></TabsTrigger>
            </TabsList>

            <TabsContent value="pl"><PLChart data={results.data} formatCurrency={formatCurrency} /></TabsContent>
            <TabsContent value="cash">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><CashFlowChart data={results.data} formatCurrency={formatCurrency} /></div>
                <div><RiskAnalysis riskLevel={results.riskLevel} riskMessage={results.riskMessage} stockCongelado={results.stockCongelado} formatCurrency={formatCurrency} /></div>
              </div>
            </TabsContent>
            <TabsContent value="data"><DataTable data={results.data} formatCurrency={formatCurrency} /></TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default DashboardFinanciero;
