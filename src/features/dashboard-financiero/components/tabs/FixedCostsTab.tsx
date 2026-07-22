import { useFinancial, CURRENCIES } from '@/features/dashboard-financiero/contexts/FinancialContext';
import { EditableTable } from '@/features/dashboard-financiero/components/EditableTable';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, formatPercent } from '@/lib/utils';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const FixedCostsTab = () => {
  const { fixedCosts, updateFixedCosts, assumptions } = useFinancial();
  const currency = CURRENCIES.find((c) => c.code === assumptions.currencyCode) || CURRENCIES[0];

  const columns = [
    { key: 'category', label: 'Categoría', type: 'text' as const },
    { key: 'description', label: 'Descripción', type: 'text' as const },
    { key: 'monthlyAmount', label: `Importe (${currency.symbol})`, type: 'number' as const },
    { key: 'startMonth', label: 'Mes Inicio', type: 'number' as const },
    { key: 'endMonth', label: 'Mes Fin', type: 'number' as const },
  ];

  const handleAddRow = () => {
    updateFixedCosts([...fixedCosts, { id: Date.now().toString(), category: 'Nueva categoría', description: '', monthlyAmount: 0, startMonth: 1, endMonth: null }]);
  };
  const handleDeleteRow = (index: number) => updateFixedCosts(fixedCosts.filter((_, i) => i !== index));

  const totalMonthly = fixedCosts.reduce((s, c) => s + c.monthlyAmount, 0);
  const categoryTotals = fixedCosts.reduce((acc, cost) => {
    acc[cost.category] = (acc[cost.category] || 0) + cost.monthlyAmount;
    return acc;
  }, {} as Record<string, number>);
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  const monthlyData = Array.from({ length: assumptions.timeHorizonMonths }, (_, i) => {
    const month = i + 1;
    const total = fixedCosts.reduce((s, c) => {
      const active = month >= c.startMonth && (c.endMonth === null || month <= c.endMonth);
      return s + (active ? c.monthlyAmount : 0);
    }, 0);
    return { month, total };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Gastos Fijos</h2>
        <p className="text-muted-foreground">Define los gastos fijos mensuales de tu negocio.</p>
      </div>

      <Card className="p-6 bg-primary/10 border-primary/20">
        <p className="text-sm font-medium text-muted-foreground mb-1">Gastos Fijos Mensuales</p>
        <h3 className="text-3xl font-bold text-foreground">{formatCurrency(totalMonthly, currency.symbol)}</h3>
        <p className="text-sm text-muted-foreground mt-1">Total anual: {formatCurrency(totalMonthly * 12, currency.symbol)}</p>
      </Card>

      <EditableTable columns={columns} data={fixedCosts} onDataChange={updateFixedCosts} onAddRow={handleAddRow} onDeleteRow={handleDeleteRow} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Distribución por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${formatPercent((percent || 0) * 100, 0)}`} outerRadius={100} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Evolución Mensual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="total" fill="hsl(var(--secondary))" name={`Gastos (${currency.symbol})`} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
