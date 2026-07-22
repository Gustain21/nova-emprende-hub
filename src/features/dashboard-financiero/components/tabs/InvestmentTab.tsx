import { useFinancial, CURRENCIES } from '@/features/dashboard-financiero/contexts/FinancialContext';
import { EditableTable } from '@/features/dashboard-financiero/components/EditableTable';
import { Card } from '@/components/ui/card';
import { KPICard } from '@/features/dashboard-financiero/components/KPICard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingDown } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

export const InvestmentTab = () => {
  const { investments, updateInvestments, assumptions } = useFinancial();
  const currency = CURRENCIES.find((c) => c.code === assumptions.currencyCode) || CURRENCIES[0];

  const columns = [
    { key: 'concept', label: 'Concepto', type: 'text' as const },
    { key: 'category', label: 'Categoría', type: 'text' as const },
    { key: 'amount', label: `Importe (${currency.symbol})`, type: 'number' as const },
    { key: 'month', label: 'Mes', type: 'number' as const },
    { key: 'usefulLifeYears', label: 'Vida Útil (años)', type: 'number' as const },
    { key: 'monthlyDepreciation', label: `Amort. Mensual (${currency.symbol})`, type: 'calculated' as const, format: (v: number) => formatNumber(v) },
  ];

  const dataWithDep = investments.map((inv) => ({ ...inv, monthlyDepreciation: inv.usefulLifeYears > 0 ? inv.amount / (inv.usefulLifeYears * 12) : 0 }));
  const handleAddRow = () => updateInvestments([...investments, { id: Date.now().toString(), concept: 'Nueva inversión', category: 'General', amount: 0, month: 1, usefulLifeYears: 3 }]);
  const handleDeleteRow = (i: number) => updateInvestments(investments.filter((_, x) => x !== i));

  const totalInvestment = investments.reduce((s, i) => s + i.amount, 0);
  const totalMonthlyDep = dataWithDep.reduce((s, i) => s + i.monthlyDepreciation, 0);

  const categoryTotals = investments.reduce((acc, inv) => { acc[inv.category] = (acc[inv.category] || 0) + inv.amount; return acc; }, {} as Record<string, number>);
  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({ category, amount }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Inversión Inicial</h2>
        <p className="text-muted-foreground">Define las inversiones iniciales (CapEx) necesarias.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPICard title="Inversión Total Inicial" value={formatCurrency(totalInvestment, currency.symbol)} icon={DollarSign} subtitle="Capital necesario al inicio" />
        <KPICard title="Amortización Mensual Total" value={formatCurrency(totalMonthlyDep, currency.symbol)} icon={TrendingDown} subtitle="Gasto contable mensual" />
      </div>

      <EditableTable columns={columns} data={dataWithDep} onDataChange={updateInvestments} onAddRow={handleAddRow} onDeleteRow={handleDeleteRow} />

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Inversión por Categoría</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="amount" fill="hsl(var(--primary))" name={`Inversión (${currency.symbol})`} radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
