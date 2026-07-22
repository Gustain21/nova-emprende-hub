import { ChevronDown, Globe, Building } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FinancialConfig, businessPresets, countries } from '../hooks/useFinancialCalculations';
import { useState } from 'react';

interface Props {
  config: FinancialConfig;
  onConfigChange: (config: FinancialConfig) => void;
}

export const ConfigSidebar = ({ config, onConfigChange }: Props) => {
  const [openSections, setOpenSections] = useState({ pais: true, inversion: true, prestamo: false, ventas: false, operativa: false });
  const selectedCountry = countries.find(c => c.code === config.countryCode) || countries[0];

  const handlePresetChange = (preset: string) => {
    const p = businessPresets[preset];
    if (p) onConfigChange({ ...config, ...p, countryCode: config.countryCode, interesPrestamo: config.interesPrestamo, crecimientoAnual: config.crecimientoAnual, anosPrestamo: config.anosPrestamo });
  };
  const update = (key: keyof FinancialConfig, value: number | string) => onConfigChange({ ...config, [key]: value });

  return (
    <aside className="w-full lg:w-80 xl:w-96 bg-card/40 border-r border-border p-5 space-y-5 overflow-y-auto lg:h-[calc(100vh-56px)]">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">⚙️ Configuración</h2>
        <p className="text-xs text-muted-foreground">Ajusta los parámetros del proyecto</p>
      </div>

      <Collapsible open={openSections.pais} onOpenChange={(o) => setOpenSections(s => ({ ...s, pais: o }))}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-card rounded-lg hover:bg-card/80">
          <span className="font-medium text-sm flex items-center gap-2"><Globe className="w-4 h-4" /> País y Moneda</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.pais ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-card/40 rounded-lg p-4 mt-2 space-y-3">
          <div>
            <Label className="text-xs">Seleccionar País</Label>
            <Select value={config.countryCode} onValueChange={(v) => update('countryCode', v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {countries.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.currencySymbol} {c.currency})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1">
            <p><strong>Moneda:</strong> {selectedCountry.currency} ({selectedCountry.currencySymbol})</p>
            <p><strong>Tasa Impositiva:</strong> {(selectedCountry.taxRate * 100).toFixed(0)}%</p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Cargar Ejemplo Base</Label>
        <Select onValueChange={handlePresetChange} defaultValue="custom">
          <SelectTrigger><SelectValue placeholder="Selecciona tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Personalizado</SelectItem>
            <SelectItem value="infoproducto">Infoproducto (eBook)</SelectItem>
            <SelectItem value="fisico">Producto Físico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Collapsible open={openSections.inversion} onOpenChange={(o) => setOpenSections(s => ({ ...s, inversion: o }))}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-card rounded-lg hover:bg-card/80">
          <span className="font-medium text-sm">1. Inversión y Capital</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.inversion ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-card/40 rounded-lg p-4 mt-2 space-y-3">
          <div><Label className="text-xs">Inversión Inicial (Activos) {selectedCountry.currencySymbol}</Label>
            <Input type="number" value={config.inversionInicial} onChange={(e) => update('inversionInicial', Number(e.target.value))} className="mt-1" /></div>
          <div><Label className="text-xs">Capital Propio {selectedCountry.currencySymbol}</Label>
            <Input type="number" value={config.capitalPropio} onChange={(e) => update('capitalPropio', Number(e.target.value))} className="mt-1" /></div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={openSections.prestamo} onOpenChange={(o) => setOpenSections(s => ({ ...s, prestamo: o }))}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-card rounded-lg hover:bg-card/80">
          <span className="font-medium text-sm flex items-center gap-2"><Building className="w-4 h-4" /> 2. Préstamo Bancario</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.prestamo ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-card/40 rounded-lg p-4 mt-2 space-y-3">
          <div><Label className="text-xs">Monto del Préstamo {selectedCountry.currencySymbol}</Label>
            <Input type="number" value={config.prestamo} onChange={(e) => update('prestamo', Number(e.target.value))} className="mt-1" /></div>
          <div><Label className="text-xs">Años del Préstamo: {config.anosPrestamo} años</Label>
            <Slider value={[config.anosPrestamo]} onValueChange={([v]) => update('anosPrestamo', v)} min={1} max={10} step={1} className="mt-2" /></div>
          <div><Label className="text-xs">Interés Anual: {(config.interesPrestamo * 100).toFixed(1)}%</Label>
            <Slider value={[config.interesPrestamo * 100]} onValueChange={([v]) => update('interesPrestamo', v / 100)} min={0} max={25} step={0.5} className="mt-2" /></div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={openSections.ventas} onOpenChange={(o) => setOpenSections(s => ({ ...s, ventas: o }))}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-card rounded-lg hover:bg-card/80">
          <span className="font-medium text-sm">3. Ventas y Costes (Año 1)</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.ventas ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-card/40 rounded-lg p-4 mt-2 space-y-3">
          <div><Label className="text-xs">Unidades Vendidas (Año 1)</Label>
            <Input type="number" value={config.unidadesVendidas} onChange={(e) => update('unidadesVendidas', Number(e.target.value))} className="mt-1" /></div>
          <div><Label className="text-xs">Precio Venta Medio ({selectedCountry.currencySymbol})</Label>
            <Input type="number" value={config.precioMedio} onChange={(e) => update('precioMedio', Number(e.target.value))} className="mt-1" /></div>
          <div><Label className="text-xs">Coste Directo Medio ({selectedCountry.currencySymbol})</Label>
            <Input type="number" value={config.costeMedio} onChange={(e) => update('costeMedio', Number(e.target.value))} className="mt-1" /></div>
          <div><Label className="text-xs">Crecimiento Ventas Anual: {(config.crecimientoAnual * 100).toFixed(0)}%</Label>
            <Slider value={[config.crecimientoAnual * 100]} onValueChange={([v]) => update('crecimientoAnual', v / 100)} min={0} max={100} step={5} className="mt-2" /></div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={openSections.operativa} onOpenChange={(o) => setOpenSections(s => ({ ...s, operativa: o }))}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-card rounded-lg hover:bg-card/80">
          <span className="font-medium text-sm">4. Operativa y Stocks</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.operativa ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-card/40 rounded-lg p-4 mt-2 space-y-3">
          <div><Label className="text-xs">Gastos Fijos Anuales ({selectedCountry.currencySymbol})</Label>
            <Input type="number" value={config.gastosFijos} onChange={(e) => update('gastosFijos', Number(e.target.value))} className="mt-1" /></div>
          <div><Label className="text-xs">Marketing y Logística Anual ({selectedCountry.currencySymbol})</Label>
            <Input type="number" value={config.marketingLogistica} onChange={(e) => update('marketingLogistica', Number(e.target.value))} className="mt-1" /></div>
          <div><Label className="text-xs">% Stock sobre Ventas: {(config.stockPct * 100).toFixed(0)}%</Label>
            <Slider value={[config.stockPct * 100]} onValueChange={([v]) => update('stockPct', v / 100)} min={0} max={50} step={1} className="mt-2" /></div>
          <div><Label className="text-xs">Días Pago a Proveedores</Label>
            <Input type="number" value={config.diasPagoProveedores} onChange={(e) => update('diasPagoProveedores', Number(e.target.value))} className="mt-1" /></div>
          <div><Label className="text-xs">Días Cobro a Clientes</Label>
            <Input type="number" value={config.diasCobroClientes} onChange={(e) => update('diasCobroClientes', Number(e.target.value))} className="mt-1" /></div>
        </CollapsibleContent>
      </Collapsible>
    </aside>
  );
};
