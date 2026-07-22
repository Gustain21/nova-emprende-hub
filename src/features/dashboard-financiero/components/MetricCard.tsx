import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  className?: string;
}

export const MetricCard = ({ title, value, subtitle, className }: MetricCardProps) => (
  <div className={cn("bg-card p-5 rounded-xl border border-border border-l-4 border-l-brand-orange shadow-sm transition-all hover:-translate-y-0.5", className)}>
    <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
    <h2 className="text-2xl md:text-3xl font-bold text-foreground">{value}</h2>
    {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
  </div>
);
