import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, Line, ComposedChart, ReferenceLine } from 'recharts';
import { YearlyData } from '../hooks/useFinancialCalculations';

interface ChartProps {
  data: YearlyData[];
  formatCurrency: (v: number) => string;
}

export const PLChart = ({ data, formatCurrency }: ChartProps) => {
  const chartData = data.map(d => ({
    year: d.year, Facturación: d.ventas, EBITDA: d.ebitda, 'Beneficio Neto': d.beneficioNeto,
  }));
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Evolución de Ingresos y Beneficios</h3>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
          <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
          <Legend />
          <Bar dataKey="Facturación" fill="#E0A12B" radius={[4, 4, 0, 0]} />
          <Bar dataKey="EBITDA" fill="#F97316" radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="Beneficio Neto" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CashFlowChart = ({ data, formatCurrency }: ChartProps) => {
  const chartData = data.map(d => ({ year: d.year, 'Caja Acumulada': d.cajaAcumulada }));
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Evolución del Dinero en el Banco</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
          <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
          <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label={{ value: 'Bancarrota', position: 'insideTopRight', fill: 'hsl(var(--destructive))', fontSize: 11 }} />
          <Area type="monotone" dataKey="Caja Acumulada" stroke="#F97316" fill="rgba(249,115,22,0.25)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
