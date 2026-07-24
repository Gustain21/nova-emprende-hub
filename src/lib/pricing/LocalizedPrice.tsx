// Componente auxiliar: renderiza un precio localizado desde Paddle.PricePreview
// con skeleton discreto durante la carga y fallback EUR si falla la consulta.

import { useLocalizedPaddlePrice } from "./useLocalizedPaddlePrices";
import { formatPriceEUR } from "@/lib/region/RegionContext";

interface Props {
  priceId?: string | null;
  fallbackEur: number;
  className?: string;
  skeletonClassName?: string;
}

export const LocalizedPrice = ({ priceId, fallbackEur, className, skeletonClassName }: Props) => {
  const { formattedPrice, loading, error } = useLocalizedPaddlePrice(priceId);

  if (!priceId || error) {
    return <span className={className}>{formatPriceEUR(fallbackEur)}</span>;
  }
  if (loading || !formattedPrice) {
    return (
      <span
        className={`${className || ""} ${skeletonClassName || "opacity-60"} inline-block`}
        aria-busy="true"
      >
        {formatPriceEUR(fallbackEur)}
      </span>
    );
  }
  return <span className={className}>{formattedPrice}</span>;
};
