// Renderiza un precio localizado desde Paddle.PricePreview. Durante la carga o
// si la consulta falla, muestra el importe base con la MONEDA EFECTIVA de la
// región resuelta (USD para AR, EUR para UE). No convierte importes.

import { formatByCurrency, useLocalizedPaddlePrice } from "./useLocalizedPaddlePrices";
import { useResolvedRegion } from "@/lib/region/useResolvedRegion";

interface Props {
  priceId?: string | null;
  /** Importe base (numéricamente igual en EUR y USD según la configuración). */
  fallbackEur: number;
  className?: string;
  skeletonClassName?: string;
}

export const LocalizedPrice = ({ priceId, fallbackEur, className, skeletonClassName }: Props) => {
  const { formattedPrice, loading, error } = useLocalizedPaddlePrice(priceId);
  const { currency } = useResolvedRegion();
  const fallback = formatByCurrency(fallbackEur, currency);

  if (!priceId || error) {
    return <span className={className}>{fallback}</span>;
  }
  if (loading || !formattedPrice) {
    return (
      <span
        className={`${className || ""} ${skeletonClassName || "opacity-60"} inline-block`}
        aria-busy="true"
      >
        {fallback}
      </span>
    );
  }
  return <span className={className}>{formattedPrice}</span>;
};
