import { Clock } from "lucide-react";
import { EBOOK_OFFER_END } from "@/data/products";
import { formatOfferDate, isOfferActive } from "@/lib/offer";

interface Props {
  compact?: boolean;
  className?: string;
}

const EbookOfferBadge = ({ compact = false, className = "" }: Props) => {
  if (!isOfferActive(EBOOK_OFFER_END, true)) return null;
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/40 ${className}`}
    >
      <Clock className="w-3.5 h-3.5 text-red-400 shrink-0" />
      <span className={`font-bold text-red-400 ${compact ? "text-[11px]" : "text-xs"}`}>
        Oferta de lanzamiento · 30% OFF hasta el {formatOfferDate(EBOOK_OFFER_END)}
      </span>
    </div>
  );
};

export default EbookOfferBadge;
