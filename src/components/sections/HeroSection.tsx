import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Compass, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ebookCover from "@/assets/ebook-cover.jpg";
import { ebookProduct } from "@/data/products";
import { getEffectivePricing } from "@/lib/offer";
import { useRegion, formatPrice } from "@/lib/region/RegionContext";
import EbookOfferBadge from "@/components/sections/EbookOfferBadge";

const stats = [
  { num: "1", text: "guía principal para empezar con claridad" },
  { num: "6+", text: "recursos para ejecutar, planificar y decidir mejor" },
  { num: "3", text: "formas de compra según la etapa de cada emprendedor" },
];

const bullets = [
  "Transforma una idea en un plan más claro y accionable",
  "Apóyate en herramientas prácticas para pasar de la teoría a la acción",
  "Elige la ruta que mejor encaje con tu momento como emprendedor",
];

const HeroSection = () => {
  const { currency } = useRegion();
  const { price, originalPrice, offerActive } = getEffectivePricing(ebookProduct, currency);

  return (
    <section id="inicio" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden brand-hero-gradient">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-gold/10 rounded-full blur-[100px]" />
      </div>

      <div className="brand-container relative z-10">
        <div className="grid lg:grid-cols-[1.1fr,1fr] gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 mb-8">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              <span className="text-sm font-medium text-brand-orange">
                Guía práctica, herramientas útiles y recursos pensados para emprendedores
              </span>
            </div>

            <p className="text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase mb-4">
              Nova Emprende
            </p>

            <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 tracking-tight">
              <span className="text-white">El </span>
              <span className="text-[#F97316]">Big Bang</span>
              <br />
              <span className="text-white">de los </span>
              <span className="text-[#E0A12B]">Negocios</span>
            </h1>

            <p className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              Transforma tus ideas en negocios rentables.
            </p>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Una guía práctica con herramientas, plantillas y recursos para emprendedores que quieren pasar de la teoría a la acción con más claridad, foco y criterio.
            </p>

            <EbookOfferBadge className="mb-8" />

            {/* Stats grid */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.num} className="rounded-xl border border-border bg-brand-dark-card/60 p-4">
                  <div className="text-3xl font-black text-brand-orange mb-1">{s.num}</div>
                  <div className="text-xs text-muted-foreground leading-snug">{s.text}</div>
                </div>
              ))}
            </div>

            {/* Bullets */}
            <ul className="space-y-3 mb-10">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-brand-dark-card/40">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0" />
                  <span className="text-sm md:text-base text-foreground">{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/producto/ebook">
                <Button variant="cta" size="xl" className="w-full sm:w-auto">
                  <BookOpen className="w-5 h-5" />
                  Ver el ebook principal
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#ecosistema">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  <Compass className="w-5 h-5" />
                  Explorar el ecosistema
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right: ebook card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-brand-orange/20 to-brand-gold/10 rounded-3xl blur-3xl" />
            <div className="relative rounded-2xl border border-border bg-brand-dark-card/80 p-5 md:p-6 backdrop-blur">
              <img src={ebookCover} alt="El Big Bang de los Negocios" className="w-full rounded-xl shadow-2xl" />

              <div className="mt-5">
                <EbookOfferBadge />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 pt-5 border-t border-border">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-1">
                    Producto héroe
                  </p>
                  <p className="text-lg font-bold text-foreground">El Big Bang</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-1">
                    {offerActive ? "Precio lanzamiento" : "Precio"}
                  </p>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="text-2xl font-black text-brand-orange">{formatPrice(price, currency)}</p>
                    {originalPrice != null && (
                      <p className="text-sm text-muted-foreground line-through">
                        antes {formatPrice(originalPrice, currency)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-muted-foreground text-center">
                Los impuestos y moneda final pueden ajustarse en el checkout según tu país.
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
