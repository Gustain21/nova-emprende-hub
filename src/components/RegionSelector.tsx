import { Globe } from "lucide-react";
import { useRegion, Region, REGION_LABEL } from "@/lib/region/RegionContext";

interface Props {
  className?: string;
  compact?: boolean;
}

const RegionSelector = ({ className = "", compact = false }: Props) => {
  const { region, setRegion } = useRegion();

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Globe className="w-3.5 h-3.5 text-muted-foreground" aria-hidden />
      {!compact && (
        <span className="text-xs text-muted-foreground hidden md:inline">Precios para:</span>
      )}
      <label className="sr-only" htmlFor="nova-region">Región y moneda</label>
      <select
        id="nova-region"
        value={region}
        onChange={(e) => setRegion(e.target.value as Region)}
        className="bg-transparent text-xs font-medium text-foreground border border-border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-orange"
      >
        <option value="EU">{REGION_LABEL.EU}</option>
        <option value="LATAM">{REGION_LABEL.LATAM}</option>
        <option value="INTL">{REGION_LABEL.INTL}</option>
      </select>
    </div>
  );
};

export default RegionSelector;
