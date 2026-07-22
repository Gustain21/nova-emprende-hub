import { useFinancial, CURRENCIES } from '@/features/dashboard-financiero/contexts/FinancialContext';
import { EditableTable } from '@/features/dashboard-financiero/components/EditableTable';
import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils';

export const SalesForecastTab = () => {
  const { salesForecast, updateSalesForecast, assumptions } = useFinancial();
  const currency = CURRENCIES.find((c) => c.code === assumptions.currencyCode) || CURRENCIES[0];

  const columns = [
    { key: 'month', label: 'Mes', type: 'number' as const },
    { key: 'description', label: 'Descripción', type: 'text' as const },
    { key: 'units', label: 'Unidades', type: 'number' as const },
    { key: 'unitPrice', label: `Precio (${currency.symbol})`, type: 'number' as const },
    { key: 'revenue', label: `Ingresos (${currency.symbol})`, type: 'calculated' as const, format: (v: number) => formatNumber(v) },
  ];

  const dataWithRevenue = salesForecast.map((row) => ({ ...row, revenue: row.units * row.unitPrice }));
  const totalRevenue = dataWithRevenue.reduce((s, r) => s + r.revenue, 0);
  const totalUnits = dataWithRevenue.reduce((s, r) => s + r.units, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Previsión de Ventas</h2>
        <p className="text-muted-foreground">Planifica las ventas mensuales de tu proyecto. Los valores son completamente editables.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-primary/10 border-primary/20">
          <p className="text-sm font-medium text-muted-foreground mb-1">Ingresos Totales</p>
          <h3 className="text-3xl font-bold text-foreground">{formatCurrency(totalRevenue, currency.symbol)}</h3>
          <p className="text-sm text-muted-foreground mt-1">{assumptions.timeHorizonMonths} meses</p>
        </Card>
        <Card className="p-6 bg-card">
          <p className="text-sm font-medium text-muted-foreground mb-1">Unidades Totales</p>
          <h3 className="text-3xl font-bold text-foreground">{formatNumber(Math.round(totalUnits), 0)}</h3>
        </Card>
        <Card className="p-6 bg-card">
          <p className="text-sm font-medium text-muted-foreground mb-1">Ticket Medio</p>
          <h3 className="text-3xl font-bold text-foreground">{formatCurrency(totalUnits > 0 ? totalRevenue / totalUnits : 0, currency.symbol)}</h3>
        </Card>
      </div>

      <EditableTable columns={columns} data={dataWithRevenue} onDataChange={updateSalesForecast} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Evolución de Ingresos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataWithRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} name={`Ingresos (${currency.symbol})`} dot={{ fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Unidades Vendidas por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataWithRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="units" fill="hsl(var(--secondary))" name="Unidades" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
