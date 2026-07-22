import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  riskLevel: 'success' | 'warning' | 'danger';
  riskMessage: string;
  stockCongelado: number;
  formatCurrency: (v: number) => string;
}

export const RiskAnalysis = ({ riskLevel, riskMessage, stockCongelado, formatCurrency }: Props) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    danger: <AlertCircle className="w-5 h-5" />,
  };
  const styles = {
    success: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300',
    warning: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-300',
    danger: 'bg-red-500/10 border-red-500/40 text-red-300',
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">⚠️ Análisis de Riesgo</h3>
      <div className={cn('p-4 rounded-lg border flex items-start gap-3', styles[riskLevel])}>
        {icons[riskLevel]}
        <p className="text-sm font-medium">{riskMessage}</p>
      </div>
      {stockCongelado > 0 && (
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Impacto del Stock:</strong> Tienes aproximadamente{' '}
            <span className="font-semibold text-brand-orange">{formatCurrency(stockCongelado)}</span> congelados en el almacén.
          </p>
        </div>
      )}
    </div>
  );
};
