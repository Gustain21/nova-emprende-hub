import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue }: KPICardProps) => (
  <Card className="p-6 bg-card border-border hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        {trend && trendValue && (
          <div className="flex items-center mt-2 gap-1">
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
            }`}>{trendValue}</span>
          </div>
        )}
      </div>
      {Icon && (
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      )}
    </div>
  </Card>
);
