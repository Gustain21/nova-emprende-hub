import { useFinancial, CURRENCIES } from '@/features/dashboard-financiero/contexts/FinancialContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { NumberInput } from '@/features/dashboard-financiero/components/NumberInput';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))'];

export const FinancingTab = () => {
  const { financing, updateFinancing, assumptions } = useFinancial();
  const currency = CURRENCIES.find((c) => c.code === assumptions.currencyCode) || CURRENCIES[0];

  const monthlyRate = financing.interestRate / 100 / 12;
  const monthlyPayment = financing.loanAmount > 0 && monthlyRate > 0 && financing.loanTermMonths > 0
    ? (financing.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, financing.loanTermMonths))) / (Math.pow(1 + monthlyRate, financing.loanTermMonths) - 1)
    : 0;

  const schedule: { month: number; payment: number; interest: number; principal: number; remainingPrincipal: number }[] = [];
  let remaining = financing.loanAmount;
  for (let m = 1; m <= financing.loanTermMonths; m++) {
    const interest = remaining * monthlyRate;
    const principal = monthlyPayment - interest;
    remaining -= principal;
    schedule.push({ month: m, payment: monthlyPayment, interest, principal, remainingPrincipal: Math.max(0, remaining) });
  }

  const totalFinancing = financing.ownCapital + financing.loanAmount;
  const ownPct = totalFinancing > 0 ? (financing.ownCapital / totalFinancing) * 100 : 0;
  const debtPct = totalFinancing > 0 ? (financing.loanAmount / totalFinancing) * 100 : 0;
  const pieData = [{ name: 'Capital Propio', value: financing.ownCapital }, { name: 'Deuda', value: financing.loanAmount }];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Financiación</h2>
        <p className="text-muted-foreground">Define la estructura de financiación de tu proyecto.</p>
      </div>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Estructura de Financiación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Capital Propio ({currency.symbol})</Label><NumberInput value={financing.ownCapital} onChange={(v) => updateFinancing({ ownCapital: v })} decimals={2} className="mt-1" /></div>
          <div><Label>Préstamo Bancario ({currency.symbol})</Label><NumberInput value={financing.loanAmount} onChange={(v) => updateFinancing({ loanAmount: v })} decimals={2} className="mt-1" /></div>
          <div><Label>Tipo de Interés Anual (%)</Label><NumberInput value={financing.interestRate} onChange={(v) => updateFinancing({ interestRate: v })} decimals={2} className="mt-1" /></div>
          <div><Label>Plazo del Préstamo (meses)</Label><NumberInput value={financing.loanTermMonths} onChange={(v) => updateFinancing({ loanTermMonths: v })} decimals={0} className="mt-1" /></div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Resumen de Financiación</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg"><span>Total Financiación</span><span className="text-xl font-bold">{formatCurrency(totalFinancing, currency.symbol)}</span></div>
            <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg"><span>Capital Propio</span><span className="font-bold">{formatCurrency(financing.ownCapital, currency.symbol)} ({formatPercent(ownPct)})</span></div>
            <div className="flex justify-between items-center p-4 bg-secondary/10 rounded-lg"><span>Deuda</span><span className="font-bold">{formatCurrency(financing.loanAmount, currency.symbol)} ({formatPercent(debtPct)})</span></div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg"><span>Cuota Mensual</span><span className="font-bold">{formatCurrency(schedule[0]?.payment || 0, currency.symbol)}</span></div>
          </div>
        </Card>
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Estructura de Capital</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${formatPercent((percent || 0) * 100)}`} outerRadius={100} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Cuadro de Amortización del Préstamo</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Mes</TableHead>
                <TableHead>Cuota ({currency.symbol})</TableHead>
                <TableHead>Intereses ({currency.symbol})</TableHead>
                <TableHead>Amort. Capital ({currency.symbol})</TableHead>
                <TableHead>Capital Pendiente ({currency.symbol})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.slice(0, 12).map((r) => (
                <TableRow key={r.month}>
                  <TableCell className="font-medium">{r.month}</TableCell>
                  <TableCell>{formatNumber(r.payment)}</TableCell>
                  <TableCell>{formatNumber(r.interest)}</TableCell>
                  <TableCell>{formatNumber(r.principal)}</TableCell>
                  <TableCell className="font-medium">{formatNumber(r.remainingPrincipal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {schedule.length > 12 && <p className="text-sm text-muted-foreground mt-4 text-center">Mostrando primeros 12 meses de {schedule.length}</p>}
      </Card>
    </div>
  );
};
