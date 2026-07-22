import { useFinancial, CURRENCIES } from '@/features/dashboard-financiero/contexts/FinancialContext';
import { KPICard } from '@/features/dashboard-financiero/components/KPICard';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Target, DollarSign, Clock, Percent, Shield } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

export const RatiosTab = () => {
  const { assumptions, salesForecast, fixedCosts, investments, financing } = useFinancial();
  const currency = CURRENCIES.find((c) => c.code === assumptions.currencyCode) || CURRENCIES[0];

  let totalRevenue = 0, totalVariableCosts = 0, totalFixedCosts = 0, totalDepreciation = 0, totalInterest = 0, cumulativeProfit = 0, paybackMonth = 0;
  let remaining = financing.loanAmount;
  const monthlyRate = financing.interestRate / 100 / 12;
  const monthlyPayment = financing.loanAmount > 0 && monthlyRate > 0
    ? (financing.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, financing.loanTermMonths))) / (Math.pow(1 + monthlyRate, financing.loanTermMonths) - 1)
    : 0;
  const totalInvestment = investments.reduce((s, i) => s + i.amount, 0);

  for (let month = 1; month <= assumptions.timeHorizonMonths; month++) {
    const s = salesForecast.find((x) => x.month === month) || { units: 0, unitPrice: 0 };
    const revenue = s.units * s.unitPrice;
    const variableCosts = s.units * assumptions.variableCostPerUnit;
    const fcm = fixedCosts.reduce((sum, c) => {
      const active = month >= c.startMonth && (c.endMonth === null || month <= c.endMonth);
      return sum + (active ? c.monthlyAmount : 0);
    }, 0);
    const dep = investments.reduce((sum, inv) => sum + (inv.usefulLifeYears > 0 ? inv.amount / (inv.usefulLifeYears * 12) : 0), 0);
    const interest = month <= financing.loanTermMonths ? remaining * monthlyRate : 0;
    if (month <= financing.loanTermMonths) remaining -= (monthlyPayment - interest);
    const ebit = revenue - variableCosts - fcm - dep - interest;
    const taxes = ebit > 0 ? ebit * (assumptions.profitTaxRate / 100) : 0;
    const netProfit = ebit - taxes;
    totalRevenue += revenue; totalVariableCosts += variableCosts; totalFixedCosts += fcm; totalDepreciation += dep; totalInterest += interest; cumulativeProfit += netProfit;
    if (paybackMonth === 0 && cumulativeProfit >= totalInvestment) paybackMonth = month;
  }

  const totalCosts = totalVariableCosts + totalFixedCosts + totalDepreciation + totalInterest;
  const grossMargin = totalRevenue - totalVariableCosts;
  const grossMarginPct = totalRevenue > 0 ? (grossMargin / totalRevenue) * 100 : 0;
  const netMarginPct = totalRevenue > 0 ? (cumulativeProfit / totalRevenue) * 100 : 0;
  const roi = totalInvestment > 0 ? (cumulativeProfit / totalInvestment) * 100 : 0;
  const debtToEquity = financing.ownCapital > 0 ? financing.loanAmount / financing.ownCapital : 0;
  const avgFC = totalFixedCosts / assumptions.timeHorizonMonths;
  const cm = assumptions.basePrice - assumptions.variableCostPerUnit;
  const breakEvenUnits = cm > 0 ? avgFC / cm : 0;
  const breakEvenRevenue = breakEvenUnits * assumptions.basePrice;
  const first = (salesForecast[0]?.units || 0) * (salesForecast[0]?.unitPrice || 1) || 1;
  const last = (salesForecast[assumptions.timeHorizonMonths - 1]?.units || 0) * (salesForecast[assumptions.timeHorizonMonths - 1]?.unitPrice || 1) || 1;
  const avgMonthlyGrowth = assumptions.timeHorizonMonths > 1 ? (Math.pow(last / first, 1 / (assumptions.timeHorizonMonths - 1)) - 1) * 100 : 0;

  const chartData = [
    { name: 'Ventas', value: totalRevenue },
    { name: 'Costes', value: totalCosts },
    { name: 'Beneficio', value: cumulativeProfit },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Ratios y KPIs</h2>
        <p className="text-muted-foreground">Indicadores clave para evaluar la viabilidad y rentabilidad de tu negocio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard title="Punto de Equilibrio" value={`${formatNumber(Math.round(breakEvenUnits), 0)} unidades`} subtitle={`${formatCurrency(breakEvenRevenue, currency.symbol)} en ingresos`} icon={Target} />
        <KPICard title="Margen Bruto" value={`${formatNumber(grossMarginPct, 1)}%`} subtitle="Sobre ingresos totales" icon={Percent} trend={grossMarginPct > 50 ? 'up' : 'neutral'} trendValue={grossMarginPct > 50 ? 'Excelente' : 'Aceptable'} />
        <KPICard title="Margen Neto" value={`${formatNumber(netMarginPct, 1)}%`} subtitle="Beneficio sobre ventas" icon={Percent} trend={netMarginPct > 0 ? 'up' : 'down'} trendValue={netMarginPct > 0 ? 'Positivo' : 'Negativo'} />
        <KPICard title="ROI" value={`${formatNumber(roi, 1)}%`} subtitle="Retorno sobre inversión" icon={TrendingUp} trend={roi > 50 ? 'up' : 'neutral'} trendValue={roi > 50 ? 'Alto' : 'Moderado'} />
        <KPICard title="Payback" value={paybackMonth > 0 ? `${paybackMonth} meses` : 'No alcanzado'} subtitle="Recuperación de la inversión" icon={Clock} trend={paybackMonth > 0 && paybackMonth < 24 ? 'up' : 'neutral'} />
        <KPICard title="Ratio Deuda/Capital" value={formatNumber(debtToEquity)} subtitle="Apalancamiento financiero" icon={Shield} trend={debtToEquity < 1 ? 'up' : 'down'} trendValue={debtToEquity < 1 ? 'Bajo riesgo' : 'Alto apalancamiento'} />
        <KPICard title="Crecimiento Mensual" value={`${formatNumber(avgMonthlyGrowth, 1)}%`} subtitle="Media de ingresos mes a mes" icon={TrendingUp} trend={avgMonthlyGrowth > 0 ? 'up' : 'down'} />
        <KPICard title="Ingresos Acumulados" value={formatCurrency(totalRevenue, currency.symbol)} subtitle={`${assumptions.timeHorizonMonths} meses`} icon={DollarSign} />
        <KPICard title="Beneficio Acumulado" value={formatCurrency(cumulativeProfit, currency.symbol)} subtitle="Beneficio neto total" icon={DollarSign} trend={cumulativeProfit > 0 ? 'up' : 'down'} />
      </div>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Resumen Financiero</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="value" fill="hsl(var(--primary))" name={currency.symbol} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
