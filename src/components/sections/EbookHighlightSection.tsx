import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import ebookCoverAsset from "@/assets/ebook-cover-sin-autor.png.asset.json";
import { ebookProduct } from "@/data/products";
import { isOfferActive, compareAtPrice } from "@/lib/offer";
import EbookOfferBadge from "@/components/sections/EbookOfferBadge";
import { useLocalizedPaddlePrice, formatByCurrency, useDisplayCurrency } from "@/lib/pricing/useLocalizedPaddlePrices";
import { usePaddlePriceId } from "@/lib/pricing/paddlePriceIds";
import { LocalizedPrice } from "@/lib/pricing/LocalizedPrice";


const bullets = [
  "Metodología paso a paso para validar tu idea de negocio",
  "15 capítulos con ejercicios prácticos",
  "Ideas y ejercicios para definir cómo generar ingresos",
  "Herramientas para definir tu propuesta de valor única",
];

const EbookHighlightSection = () => {
  const ebookPriceId = usePaddlePriceId(ebookProduct.slug);
  const { currencyCode: paddleCurrency } = useLocalizedPaddlePrice(ebookPriceId);
  const currencyCode = useDisplayCurrency(paddleCurrency);
  const offerActive = isOfferActive(ebookProduct.offerEndDate, ebookProduct.saleActive);
  const originalPrice = compareAtPrice(ebookProduct, currencyCode);


  return (
    <section id="ebook" className="brand-section bg-background">
      <div className="brand-container">
        <div className="grid lg:grid-cols-[1.1fr,1fr] gap-10 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="min-w-0 rounded-2xl border border-border bg-brand-dark-card/60 p-6 sm:p-8 md:p-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/40 text-xs font-bold text-brand-orange mb-6">
              Libro principal
            </span>
            <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-5 leading-tight">
              Empieza por el método
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              <span className="font-semibold text-foreground">El Big Bang de los Negocios</span> te ayuda a pasar de una idea suelta a un plan: qué ofreces, a quién, cómo está tu mercado y por dónde empezar.
            </p>

            <EbookOfferBadge className="mb-6" />

            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {bullets.map((b) => (
                <div key={b} className="flex items-start gap-2 px-4 py-3 rounded-lg border border-border bg-brand-dark/60">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{b}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-3 mb-6">
              <Button
                variant="cta"
                size="lg"
                className="h-auto min-h-12 w-full max-w-full min-w-0 whitespace-normal break-words px-4 py-3 text-center leading-snug sm:px-6"
                asChild
              >
                <Link to="/producto/ebook">
                  <span className="min-w-0">Ver el libro</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-auto min-h-12 w-full max-w-full min-w-0 whitespace-normal break-words px-4 py-3 text-center leading-snug sm:px-6"
                asChild
              >
                <a href="#ecosistema">
                  <span className="min-w-0">Ver herramientas complementarias</span>
                </a>
              </Button>
            </div>

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
              <p>Las herramientas complementarias no están incluidas en el ebook: se compran por separado o en packs.</p>
            </div>
          </motion.div>

          {/* Right card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="min-w-0 rounded-2xl border border-border bg-brand-dark-card/80 p-5 md:p-6"
          >
            <img src={ebookCoverAsset.url} alt="El Big Bang de los Negocios" className="w-full rounded-xl shadow-2xl mb-6" />
            <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-1">
              Libro principal
            </p>
            <h3 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">El Big Bang de los Negocios</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Ebook en PDF con 15 capítulos y ejercicios para convertir tu idea en un plan de negocio.
            </p>

            <EbookOfferBadge className="mb-4" />

            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-border">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-1">
                  {offerActive ? "Precio lanzamiento" : "Precio"}
                </p>
                <LocalizedPrice
                  priceId={ebookPriceId}
                  fallbackEur={ebookProduct.price}
                  className="text-2xl font-black text-brand-orange"
                />
                {originalPrice != null && (
                  <p className="text-xs text-muted-foreground line-through">
                    antes {formatByCurrency(originalPrice, currencyCode)}
                  </p>
                )}

              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-1">
                  Incluye
                </p>
                <p className="text-xs text-foreground leading-snug">Ebook en PDF con 15 capítulos y ejercicios</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EbookHighlightSection;
