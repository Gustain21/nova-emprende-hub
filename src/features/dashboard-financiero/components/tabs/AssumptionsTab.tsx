import { useFinancial, CURRENCIES } from '@/features/dashboard-financiero/contexts/FinancialContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { NumberInput } from '@/features/dashboard-financiero/components/NumberInput';

export const AssumptionsTab = () => {
  const { assumptions, updateAssumptions } = useFinancial();
  const currency = CURRENCIES.find((c) => c.code === assumptions.currencyCode) || CURRENCIES[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Supuestos del Proyecto</h2>
        <p className="text-muted-foreground">Define los parámetros básicos de tu proyecto. Estos datos se usarán en todos los cálculos.</p>
      </div>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Información General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="projectName">Nombre del Proyecto</Label>
            <Input id="projectName" value={assumptions.projectName} onChange={(e) => updateAssumptions({ projectName: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="currency">Moneda</Label>
            <Select value={assumptions.currencyCode} onValueChange={(value) => updateAssumptions({ currencyCode: value })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>{curr.name} ({curr.symbol})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="timeHorizon">Horizonte Temporal</Label>
            <Select value={assumptions.timeHorizonMonths.toString()} onValueChange={(value) => updateAssumptions({ timeHorizonMonths: parseInt(value) })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 meses</SelectItem>
                <SelectItem value="24">24 meses</SelectItem>
                <SelectItem value="36">36 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="businessType">Tipo de Negocio</Label>
            <Input id="businessType" value={assumptions.businessType} onChange={(e) => updateAssumptions({ businessType: e.target.value })} className="mt-1" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">1. Inversión</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><Label>Inversión Inicial ({currency.symbol})</Label><NumberInput value={assumptions.initialInvestment} onChange={(v) => updateAssumptions({ initialInvestment: v })} decimals={2} className="mt-1" /></div>
          <div><Label>Capital Propio ({currency.symbol})</Label><NumberInput value={assumptions.ownCapital} onChange={(v) => updateAssumptions({ ownCapital: v })} decimals={2} className="mt-1" /></div>
          <div><Label>Préstamo Bancario ({currency.symbol})</Label><NumberInput value={assumptions.loanAmount} onChange={(v) => updateAssumptions({ loanAmount: v })} decimals={2} className="mt-1" /></div>
          <div><Label>Interés (%)</Label><NumberInput value={assumptions.interestRate} onChange={(v) => updateAssumptions({ interestRate: v })} decimals={2} className="mt-1" /></div>
          <div><Label>Años del Préstamo</Label><NumberInput value={assumptions.loanTermYears} onChange={(v) => updateAssumptions({ loanTermYears: v })} decimals={0} min={1} className="mt-1" /></div>
          <div>
            <Label>Plazo Amortización</Label>
            <Select value={assumptions.amortizationType} onValueChange={(value) => updateAssumptions({ amortizationType: value })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Francés">Francés (cuota fija)</SelectItem>
                <SelectItem value="Alemán">Alemán (amortización fija)</SelectItem>
                <SelectItem value="Americano">Americano (bullet)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-muted-foreground">Total Financiación:</span><p className="font-semibold">{formatCurrency(assumptions.ownCapital + assumptions.loanAmount, currency.symbol)}</p></div>
            <div><span className="text-muted-foreground">% Capital Propio:</span><p className="font-semibold">{formatPercent((assumptions.ownCapital / (assumptions.ownCapital + assumptions.loanAmount || 1)) * 100)}</p></div>
            <div><span className="text-muted-foreground">% Préstamo:</span><p className="font-semibold">{formatPercent((assumptions.loanAmount / (assumptions.ownCapital + assumptions.loanAmount || 1)) * 100)}</p></div>
            <div><span className="text-muted-foreground">Cuotas Totales:</span><p className="font-semibold">{assumptions.loanTermYears * 12} meses</p></div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">2. Ventas (Año 1)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div><Label>Unidades Vendidas</Label><NumberInput value={assumptions.unitsSoldYear1} onChange={(v) => updateAssumptions({ unitsSoldYear1: v })} decimals={0} className="mt-1" /></div>
          <div><Label>Precio Medio ({currency.symbol})</Label><NumberInput value={assumptions.averagePrice} onChange={(v) => updateAssumptions({ averagePrice: v, basePrice: v })} decimals={2} className="mt-1" /></div>
          <div><Label>Coste Directo ({currency.symbol})</Label><NumberInput value={assumptions.directCost} onChange={(v) => updateAssumptions({ directCost: v, variableCostPerUnit: v })} decimals={2} className="mt-1" /></div>
          <div><Label>Crecimiento Anual (%)</Label><NumberInput value={assumptions.annualGrowthRate} onChange={(v) => updateAssumptions({ annualGrowthRate: v })} decimals={2} className="mt-1" /></div>
        </div>
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-muted-foreground">Facturación Año 1:</span><p className="font-semibold">{formatCurrency(assumptions.unitsSoldYear1 * assumptions.averagePrice, currency.symbol)}</p></div>
            <div><span className="text-muted-foreground">Margen Unitario:</span><p className="font-semibold">{formatCurrency(assumptions.averagePrice - assumptions.directCost, currency.symbol)}</p></div>
            <div><span className="text-muted-foreground">% Margen:</span><p className="font-semibold">{assumptions.averagePrice > 0 ? formatPercent(((assumptions.averagePrice - assumptions.directCost) / assumptions.averagePrice) * 100) : '0%'}</p></div>
            <div><span className="text-muted-foreground">Margen Bruto Año 1:</span><p className="font-semibold">{formatCurrency(assumptions.unitsSoldYear1 * (assumptions.averagePrice - assumptions.directCost), currency.symbol)}</p></div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">3. Operativa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div><Label>Gastos Fijos Anuales ({currency.symbol})</Label><NumberInput value={assumptions.fixedCostsAnnual} onChange={(v) => updateAssumptions({ fixedCostsAnnual: v })} decimals={2} className="mt-1" /></div>
          <div><Label>Marketing & Logística ({currency.symbol})</Label><NumberInput value={assumptions.marketingLogistics} onChange={(v) => updateAssumptions({ marketingLogistics: v })} decimals={2} className="mt-1" /></div>
          <div><Label>% Stock s/Ventas</Label><NumberInput value={assumptions.stockPercentage} onChange={(v) => updateAssumptions({ stockPercentage: v })} decimals={2} min={0} max={100} className="mt-1" /></div>
          <div><Label>Días Pago</Label><NumberInput value={assumptions.paymentDays} onChange={(v) => updateAssumptions({ paymentDays: v })} decimals={0} min={0} className="mt-1" /></div>
          <div><Label>Días Cobro</Label><NumberInput value={assumptions.collectionDays} onChange={(v) => updateAssumptions({ collectionDays: v })} decimals={0} min={0} className="mt-1" /></div>
        </div>
      </Card>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">4. Fiscalidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><Label>IVA / Impuesto ventas (%)</Label><NumberInput value={assumptions.taxRate} onChange={(v) => updateAssumptions({ taxRate: v })} decimals={2} className="mt-1" /></div>
          <div><Label>Impuesto sobre Beneficios (%)</Label><NumberInput value={assumptions.profitTaxRate} onChange={(v) => updateAssumptions({ profitTaxRate: v })} decimals={2} className="mt-1" /></div>
        </div>
      </Card>
    </div>
  );
};
