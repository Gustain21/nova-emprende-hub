import { useFinancial, CURRENCIES } from '@/features/dashboard-financiero/contexts/FinancialContext';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils';

export const PLTab = () => {
  const { assumptions, salesForecast, fixedCosts, investments, financing } = useFinancial();
  const currency = CURRENCIES.find((c) => c.code === assumptions.currencyCode) || CURRENCIES[0];

  const monthlyRate = financing.interestRate / 100 / 12;
  const monthlyPayment = financing.loanAmount > 0 && monthlyRate > 0
    ? (financing.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, financing.loanTermMonths))) / (Math.pow(1 + monthlyRate, financing.loanTermMonths) - 1)
    : 0;

  const pl: any[] = [];
  let remaining = financing.loanAmount;
  for (let month = 1; month <= assumptions.timeHorizonMonths; month++) {
    const s = salesForecast.find((x) => x.month === month) || { units: 0, unitPrice: 0 };
    const revenue = s.units * s.unitPrice;
    const variableCosts = s.units * assumptions.variableCostPerUnit;
    const grossMargin = revenue - variableCosts;
    const fixedCostsMonth = fixedCosts.reduce((sum, c) => {
      const active = month >= c.startMonth && (c.endMonth === null || month <= c.endMonth);
      return sum + (active ? c.monthlyAmount : 0);
    }, 0);
    const depreciation = investments.reduce((sum, inv) => sum + (inv.usefulLifeYears > 0 ? inv.amount / (inv.usefulLifeYears * 12) : 0), 0);
    const interest = month <= financing.loanTermMonths ? remaining * monthlyRate : 0;
    if (month <= financing.loanTermMonths) remaining -= (monthlyPayment - interest);
    const ebit = grossMargin - fixedCostsMonth - depreciation - interest;
    const taxes = ebit > 0 ? ebit * (assumptions.profitTaxRate / 100) : 0;
    const netProfit = ebit - taxes;
    pl.push({ month, revenue, variableCosts, grossMargin, fixedCosts: fixedCostsMonth, depreciation, interest, ebit, taxes, netProfit });
  }

  const totalRevenue = pl.reduce((s, r) => s + r.revenue, 0);
  const totalCosts = pl.reduce((s, r) => s + r.variableCosts + r.fixedCosts + r.depreciation + r.interest, 0);
  const totalNet = pl.reduce((s, r) => s + r.netProfit, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Cuenta de Pérdidas y Ganancias</h2>
        <p className="text-muted-foreground">Análisis detallado de ingresos, gastos y beneficios mensuales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-card"><p className="text-sm font-medium text-muted-foreground mb-1">Ingresos Totales</p><h3 className="text-3xl font-bold text-foreground">{formatCurrency(totalRevenue, currency.symbol)}</h3></Card>
        <Card className="p-6 bg-card"><p className="text-sm font-medium text-muted-foreground mb-1">Gastos Totales</p><h3 className="text-3xl font-bold text-foreground">{formatCurrency(totalCosts, currency.symbol)}</h3></Card>
        <Card className={`p-6 ${totalNet >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'} border-border`}>
          <p className="text-sm font-medium text-muted-foreground mb-1">Beneficio Neto</p>
          <h3 className={`text-3xl font-bold ${totalNet >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatCurrency(totalNet, currency.symbol)}</h3>
        </Card>
      </div>

      <Card className="p-6 bg-card overflow-x-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Detalle Mensual</h3>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Mes</TableHead><TableHead>Ingresos</TableHead><TableHead>C. Variables</TableHead><TableHead>Margen Bruto</TableHead>
              <TableHead>Gastos Fijos</TableHead><TableHead>Amortización</TableHead><TableHead>Intereses</TableHead>
              <TableHead>BAI</TableHead><TableHead>Impuestos</TableHead><TableHead>Beneficio Neto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pl.slice(0, 12).map((r) => (
              <TableRow key={r.month}>
                <TableCell className="font-medium">{r.month}</TableCell>
                <TableCell>{formatNumber(r.revenue)}</TableCell>
                <TableCell className="text-red-500">-{formatNumber(r.variableCosts)}</TableCell>
                <TableCell className="font-medium">{formatNumber(r.grossMargin)}</TableCell>
                <TableCell className="text-red-500">-{formatNumber(r.fixedCosts)}</TableCell>
                <TableCell className="text-red-500">-{formatNumber(r.depreciation)}</TableCell>
                <TableCell className="text-red-500">-{formatNumber(r.interest)}</TableCell>
                <TableCell className="font-medium">{formatNumber(r.ebit)}</TableCell>
                <TableCell className="text-red-500">-{formatNumber(r.taxes)}</TableCell>
                <TableCell className={`font-bold ${r.netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatNumber(r.netProfit)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {pl.length > 12 && <p className="text-sm text-muted-foreground mt-4 text-center">Mostrando primeros 12 meses de {pl.length}</p>}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Evolución del Beneficio Neto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pl}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="netProfit" stroke="hsl(var(--primary))" strokeWidth={3} name={`Beneficio Neto (${currency.symbol})`} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Ingresos vs Gastos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pl}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Ingresos" radius={[8, 8, 0, 0]} />
              <Bar dataKey="variableCosts" fill="hsl(var(--chart-2))" name="Costes" stackId="costs" />
              <Bar dataKey="fixedCosts" fill="hsl(var(--chart-3))" name="Gastos Fijos" stackId="costs" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
