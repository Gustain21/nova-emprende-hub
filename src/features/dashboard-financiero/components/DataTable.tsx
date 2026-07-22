import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { YearlyData } from '../hooks/useFinancialCalculations';

interface Props {
  data: YearlyData[];
  formatCurrency: (v: number) => string;
}

export const DataTable = ({ data, formatCurrency }: Props) => {
  const handleDownload = () => {
    const headers = ['Año', 'Ventas', 'Coste Ventas', 'Margen Bruto', 'Gastos Fijos', 'EBITDA', 'Amortización', 'Intereses', 'BAI', 'Impuestos', 'Beneficio Neto', 'Flujo Caja', 'Caja Acumulada'];
    const rows = data.map(d => [d.year, d.ventas, d.costeVentas, d.margenBruto, d.gastosFijos, d.ebitda, d.amortizacion, d.intereses, d.bai, d.impuestos, d.beneficioNeto, d.flujoCajaOperativo, d.cajaAcumulada].map((v, i) => i === 0 ? v : (v as number).toFixed(2)));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'dashboard_financiero.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Tabla de Datos Completa</h3>
        <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" /> Descargar CSV
        </Button>
      </div>
      <div className="rounded-xl border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-card">
              <TableHead className="font-semibold">Año</TableHead>
              <TableHead className="font-semibold text-right">Ventas</TableHead>
              <TableHead className="font-semibold text-right">EBITDA</TableHead>
              <TableHead className="font-semibold text-right">B. Neto</TableHead>
              <TableHead className="font-semibold text-right">Caja</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={row.year} className={i % 2 === 0 ? '' : 'bg-card/40'}>
                <TableCell className="font-medium">{row.year}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.ventas)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.ebitda)}</TableCell>
                <TableCell className={`text-right font-medium ${row.beneficioNeto >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>{formatCurrency(row.beneficioNeto)}</TableCell>
                <TableCell className={`text-right font-medium ${row.cajaAcumulada >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>{formatCurrency(row.cajaAcumulada)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
