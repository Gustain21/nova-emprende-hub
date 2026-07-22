import { Link } from 'react-router-dom';
import { ArrowLeft, List, Rocket, Printer, Loader2, Check, AlertCircle, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { usePurchases } from '@/hooks/usePurchases';
import { FinancialProvider, useFinancial, SaveStatus } from '@/features/dashboard-financiero/contexts/FinancialContext';
import { AssumptionsTab } from '@/features/dashboard-financiero/components/tabs/AssumptionsTab';
import { SalesForecastTab } from '@/features/dashboard-financiero/components/tabs/SalesForecastTab';
import { FixedCostsTab } from '@/features/dashboard-financiero/components/tabs/FixedCostsTab';
import { InvestmentTab } from '@/features/dashboard-financiero/components/tabs/InvestmentTab';
import { FinancingTab } from '@/features/dashboard-financiero/components/tabs/FinancingTab';
import { PLTab } from '@/features/dashboard-financiero/components/tabs/PLTab';
import { CashflowTab } from '@/features/dashboard-financiero/components/tabs/CashflowTab';
import { RatiosTab } from '@/features/dashboard-financiero/components/tabs/RatiosTab';
import { SummaryTab } from '@/features/dashboard-financiero/components/tabs/SummaryTab';

const SaveIndicator = ({ status }: { status: SaveStatus }) => {
  if (status === 'loading') return <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Cargando…</span>;
  if (status === 'saving') return <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Guardando</span>;
  if (status === 'saved') return <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500"><Check className="h-3 w-3" /> Guardado</span>;
  if (status === 'error') return <span className="inline-flex items-center gap-1 text-[11px] text-destructive"><AlertCircle className="h-3 w-3" /> Error al guardar</span>;
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

const Content = () => {
  const { status } = useFinancial();
  const handlePrint = () => setTimeout(() => window.print(), 300);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur print:hidden">
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
            <span className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-foreground"><Rocket className="w-4 h-4 text-brand-orange" /> Dashboard Financiero</span>
            <SaveIndicator status={status} />
            <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2 hidden sm:inline-flex">
              <Printer className="w-4 h-4" /> Imprimir
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2"><Rocket className="w-6 h-6 text-brand-orange" /> Dashboard Financiero</h1>
          <p className="text-muted-foreground text-sm mt-1">Herramienta profesional para diseñar y analizar planes financieros</p>
        </div>

        <Tabs defaultValue="resumen" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 p-2 h-auto print:hidden">
            <TabsTrigger value="supuestos">Supuestos</TabsTrigger>
            <TabsTrigger value="ventas">Ventas</TabsTrigger>
            <TabsTrigger value="gastos">Gastos Fijos</TabsTrigger>
            <TabsTrigger value="inversion">Inversión</TabsTrigger>
            <TabsTrigger value="financiacion">Financiación</TabsTrigger>
            <TabsTrigger value="pyg">PyG</TabsTrigger>
            <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
            <TabsTrigger value="ratios">Ratios</TabsTrigger>
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen"><SummaryTab /></TabsContent>
          <TabsContent value="supuestos"><AssumptionsTab /></TabsContent>
          <TabsContent value="ventas"><SalesForecastTab /></TabsContent>
          <TabsContent value="gastos"><FixedCostsTab /></TabsContent>
          <TabsContent value="inversion"><InvestmentTab /></TabsContent>
          <TabsContent value="financiacion"><FinancingTab /></TabsContent>
          <TabsContent value="pyg"><PLTab /></TabsContent>
          <TabsContent value="cashflow"><CashflowTab /></TabsContent>
          <TabsContent value="ratios"><RatiosTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const DashboardFinanciero = () => {
  const { owns, loading } = usePurchases();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Verificando acceso…</div>;
  if (!owns('dashboard-financiero')) return <NoAccess />;
  return (
    <FinancialProvider>
      <Content />
    </FinancialProvider>
  );
};

export default DashboardFinanciero;
