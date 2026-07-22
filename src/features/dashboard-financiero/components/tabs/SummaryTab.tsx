import { useFinancial, CURRENCIES } from '@/features/dashboard-financiero/contexts/FinancialContext';
import { KPICard } from '@/features/dashboard-financiero/components/KPICard';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { TrendingUp, DollarSign, Calendar, Building2, Wallet, PiggyBank, CreditCard, BarChart3, Target } from 'lucide-react';

export const SummaryTab = () => {
  const { assumptions, salesForecast, fixedCosts, investments, financing } = useFinancial();
  const currency = CURRENCIES.find((c) => c.code === assumptions.currencyCode) || CURRENCIES[0];

  const totalInvestment = investments.reduce((s, i) => s + i.amount, 0);
  const totalSales = salesForecast.reduce((s, r) => s + r.units * r.unitPrice, 0);
  const totalUnits = salesForecast.reduce((s, r) => s + r.units, 0);
  const monthlyFixedCosts = fixedCosts.reduce((s, c) => s + c.monthlyAmount, 0);
  const totalFixedCosts = monthlyFixedCosts * assumptions.timeHorizonMonths;
  const totalVariableCosts = totalUnits * assumptions.variableCostPerUnit;
  const grossMargin = totalSales - totalVariableCosts;
  const operatingProfit = grossMargin - totalFixedCosts;
  const profitMarginPct = totalSales > 0 ? (operatingProfit / totalSales) * 100 : 0;
  const totalCapital = financing.ownCapital + financing.loanAmount;
  const ownCapitalPct = totalCapital > 0 ? (financing.ownCapital / totalCapital) * 100 : 0;
  const roi = totalInvestment > 0 ? (operatingProfit / totalInvestment) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Resumen del Plan Financiero</h2>
        <p className="text-muted-foreground">Vista consolidada de los principales indicadores del proyecto "{assumptions.projectName}"</p>
      </div>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Building2 className="w-5 h-5" /> Información del Proyecto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-muted p-4 rounded-lg"><p className="text-sm text-muted-foreground">Nombre del Proyecto</p><p className="text-lg font-semibold text-foreground">{assumptions.projectName}</p></div>
          <div className="bg-muted p-4 rounded-lg"><p className="text-sm text-muted-foreground">Tipo de Negocio</p><p className="text-lg font-semibold text-foreground">{assumptions.businessType}</p></div>
          <div className="bg-muted p-4 rounded-lg"><p className="text-sm text-muted-foreground">Moneda</p><p className="text-lg font-semibold text-foreground">{currency.name}</p></div>
          <div className="bg-muted p-4 rounded-lg"><p className="text-sm text-muted-foreground">Horizonte Temporal</p><p className="text-lg font-semibold text-foreground">{assumptions.timeHorizonMonths} meses desde {assumptions.startMonth}</p></div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Inversión Total" value={formatCurrency(totalInvestment, currency.symbol)} icon={DollarSign} subtitle={`${investments.length} conceptos`} />
        <KPICard title="Ventas Proyectadas" value={formatCurrency(totalSales, currency.symbol)} icon={TrendingUp} subtitle={`${formatNumber(totalUnits, 0)} unidades en ${assumptions.timeHorizonMonths} meses`} />
        <KPICard title="Beneficio Operativo" value={formatCurrency(operatingProfit, currency.symbol)} icon={BarChart3} subtitle={`Margen: ${formatPercent(profitMarginPct)}`} />
        <KPICard title="ROI Estimado" value={formatPercent(roi)} icon={Target} subtitle="Retorno sobre inversión" />
      </div>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Wallet className="w-5 h-5" /> Estructura de Costos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Costos Fijos Mensuales:</span><span className="font-semibold">{formatCurrency(monthlyFixedCosts, currency.symbol)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Costos Fijos Totales:</span><span className="font-semibold">{formatCurrency(totalFixedCosts, currency.symbol)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Partidas de Costos:</span><span className="font-semibold">{fixedCosts.length}</span></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Costo Variable Unitario:</span><span className="font-semibold">{formatCurrency(assumptions.variableCostPerUnit, currency.symbol)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Costos Variables Totales:</span><span className="font-semibold">{formatCurrency(totalVariableCosts, currency.symbol)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Margen Bruto:</span><span className="font-semibold">{formatCurrency(grossMargin, currency.symbol)}</span></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Precio Base:</span><span className="font-semibold">{formatCurrency(assumptions.basePrice, currency.symbol)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">IVA/Impuestos:</span><span className="font-semibold">{assumptions.taxRate}%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Impuesto s/Beneficios:</span><span className="font-semibold">{assumptions.profitTaxRate}%</span></div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><PiggyBank className="w-5 h-5" /> Estructura de Financiación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3"><Wallet className="w-8 h-8 text-primary" /><div><p className="text-sm text-muted-foreground">Capital Propio</p><p className="text-xl font-bold text-foreground">{formatCurrency(financing.ownCapital, currency.symbol)}</p></div></div>
              <span className="text-lg font-semibold text-primary">{formatPercent(ownCapitalPct, 0)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3"><CreditCard className="w-8 h-8 text-secondary" /><div><p className="text-sm text-muted-foreground">Financiación Externa</p><p className="text-xl font-bold text-foreground">{formatCurrency(financing.loanAmount, currency.symbol)}</p></div></div>
              <span className="text-lg font-semibold text-secondary">{formatPercent(100 - ownCapitalPct, 0)}</span>
            </div>
          </div>
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-foreground mb-3">Condiciones del Préstamo</h4>
            <div className="flex justify-between"><span className="text-muted-foreground">Importe:</span><span className="font-semibold">{formatCurrency(financing.loanAmount, currency.symbol)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Interés:</span><span className="font-semibold">{financing.interestRate}% anual</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Plazo:</span><span className="font-semibold">{financing.loanTermMonths} meses</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span className="text-muted-foreground">Capital Total:</span><span className="font-bold text-foreground">{formatCurrency(totalCapital, currency.symbol)}</span></div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" /> Proyección de Crecimiento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted p-4 rounded-lg text-center"><p className="text-sm text-muted-foreground mb-1">Crecimiento Mensual Esperado</p><p className="text-2xl font-bold text-primary">{assumptions.expectedGrowthRate}%</p></div>
          <div className="bg-muted p-4 rounded-lg text-center"><p className="text-sm text-muted-foreground mb-1">Unidades Primer Mes</p><p className="text-2xl font-bold text-foreground">{formatNumber(salesForecast[0]?.units || 0, 0)}</p></div>
          <div className="bg-muted p-4 rounded-lg text-center"><p className="text-sm text-muted-foreground mb-1">Unidades Último Mes</p><p className="text-2xl font-bold text-foreground">{formatNumber(salesForecast[salesForecast.length - 1]?.units || 0, 0)}</p></div>
        </div>
      </Card>
    </div>
  );
};
