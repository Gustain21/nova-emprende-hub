import { useFinancial, CURRENCIES } from '@/features/dashboard-financiero/contexts/FinancialContext';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils';

export const CashflowTab = () => {
  const { assumptions, salesForecast, fixedCosts, investments, financing } = useFinancial();
  const currency = CURRENCIES.find((c) => c.code === assumptions.currencyCode) || CURRENCIES[0];

  const monthlyRate = financing.interestRate / 100 / 12;
  const monthlyPayment = financing.loanAmount > 0 && monthlyRate > 0
    ? (financing.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, financing.loanTermMonths))) / (Math.pow(1 + monthlyRate, financing.loanTermMonths) - 1)
    : 0;

  const cashflow: any[] = [];
  let cashBalance = 0;
  for (let month = 1; month <= assumptions.timeHorizonMonths; month++) {
    const s = salesForecast.find((x) => x.month === month) || { units: 0, unitPrice: 0 };
    const collections = s.units * s.unitPrice;
    const variableCosts = s.units * assumptions.variableCostPerUnit;
    const fixedCostsMonth = fixedCosts.reduce((sum, c) => {
      const active = month >= c.startMonth && (c.endMonth === null || month <= c.endMonth);
      return sum + (active ? c.monthlyAmount : 0);
    }, 0);
    const operationalPayments = variableCosts + fixedCostsMonth;
    const investmentPayments = investments.filter((inv) => inv.month === month).reduce((sum, inv) => sum + inv.amount, 0);
    const loanPayment = month <= financing.loanTermMonths ? monthlyPayment : 0;
    const capitalContributions = month === 1 ? financing.ownCapital : 0;
    const loanCollections = month === 1 ? financing.loanAmount : 0;
    const netCashflow = collections - operationalPayments - investmentPayments - loanPayment + capitalContributions + loanCollections;
    cashBalance += netCashflow;
    cashflow.push({
      month,
      openingBalance: month === 1 ? 0 : cashflow[month - 2].closingBalance,
      collections, operationalPayments, investmentPayments, loanPayment, capitalContributions, loanCollections,
      netCashflow, closingBalance: cashBalance,
    });
  }

  const minBalance = Math.min(...cashflow.map((r) => r.closingBalance));
  const maxBalance = Math.max(...cashflow.map((r) => r.closingBalance));
  const finalBalance = cashflow[cashflow.length - 1]?.closingBalance || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Flujo de Caja (Cashflow)</h2>
        <p className="text-muted-foreground">Análisis del flujo de caja mensual para garantizar la liquidez del negocio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-card"><p className="text-sm font-medium text-muted-foreground mb-1">Saldo Final</p><h3 className={`text-3xl font-bold ${finalBalance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatCurrency(finalBalance, currency.symbol)}</h3></Card>
        <Card className="p-6 bg-card"><p className="text-sm font-medium text-muted-foreground mb-1">Saldo Mínimo</p><h3 className={`text-3xl font-bold ${minBalance >= 0 ? 'text-foreground' : 'text-red-500'}`}>{formatCurrency(minBalance, currency.symbol)}</h3></Card>
        <Card className="p-6 bg-primary/10 border-primary/20"><p className="text-sm font-medium text-muted-foreground mb-1">Saldo Máximo</p><h3 className="text-3xl font-bold text-foreground">{formatCurrency(maxBalance, currency.symbol)}</h3></Card>
      </div>

      <Card className="p-6 bg-card overflow-x-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Detalle Mensual</h3>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Mes</TableHead><TableHead>Saldo Inicial</TableHead><TableHead>Cobros</TableHead><TableHead>Pagos Op.</TableHead>
              <TableHead>Inversiones</TableHead><TableHead>Cuota Préstamo</TableHead><TableHead>Aportaciones</TableHead>
              <TableHead>Cobro Préstamo</TableHead><TableHead>Flujo Neto</TableHead><TableHead>Saldo Final</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashflow.slice(0, 12).map((r) => (
              <TableRow key={r.month}>
                <TableCell className="font-medium">{r.month}</TableCell>
                <TableCell>{formatNumber(r.openingBalance)}</TableCell>
                <TableCell className="text-emerald-500">+{formatNumber(r.collections)}</TableCell>
                <TableCell className="text-red-500">-{formatNumber(r.operationalPayments)}</TableCell>
                <TableCell className="text-red-500">-{formatNumber(r.investmentPayments)}</TableCell>
                <TableCell className="text-red-500">-{formatNumber(r.loanPayment)}</TableCell>
                <TableCell className="text-emerald-500">+{formatNumber(r.capitalContributions)}</TableCell>
                <TableCell className="text-emerald-500">+{formatNumber(r.loanCollections)}</TableCell>
                <TableCell className={`font-medium ${r.netCashflow >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatNumber(r.netCashflow)}</TableCell>
                <TableCell className={`font-bold ${r.closingBalance >= 0 ? 'text-foreground' : 'text-red-500'}`}>{formatNumber(r.closingBalance)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {cashflow.length > 12 && <p className="text-sm text-muted-foreground mt-4 text-center">Mostrando primeros 12 meses de {cashflow.length}</p>}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Evolución del Saldo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashflow}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="closingBalance" stroke="hsl(var(--primary))" strokeWidth={3} name={`Saldo (${currency.symbol})`} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Cobros vs Pagos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashflow}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="collections" fill="hsl(var(--chart-1))" name="Cobros" radius={[8, 8, 0, 0]} />
              <Bar dataKey="operationalPayments" fill="hsl(var(--chart-2))" name="Pagos Operación" stackId="payments" />
              <Bar dataKey="investmentPayments" fill="hsl(var(--chart-3))" name="Inversiones" stackId="payments" />
              <Bar dataKey="loanPayment" fill="hsl(var(--chart-4))" name="Préstamo" stackId="payments" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
