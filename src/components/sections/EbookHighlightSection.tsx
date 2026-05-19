import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import ebookCover from "@/assets/ebook-cover.jpg";

const bullets = [
  "Metodología paso a paso para validar tu idea de negocio",
  "15 capítulos con ejercicios prácticos aplicables desde el día 1",
  "Estrategias de monetización probadas en negocios reales",
  "Herramientas para definir tu propuesta de valor única",
];

const EbookHighlightSection = () => {
  return (
    <section id="ebook" className="brand-section bg-background">
      <div className="brand-container">
        <div className="grid lg:grid-cols-[1.1fr,1fr] gap-10 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-brand-dark-card/60 p-8 md:p-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/40 text-xs font-bold text-brand-orange mb-6">
              Producto principal
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-tight">
              El libro que debe abrir la experiencia NOVA EMPRENDE
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              <span className="font-semibold text-foreground">El Big Bang de los Negocios</span> no es un extra dentro del catálogo. Es el punto de partida del método. Desde ahí se entienden mejor la ejecución, la planificación y el control financiero del resto del ecosistema.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {bullets.map((b) => (
                <div key={b} className="flex items-start gap-2 px-4 py-3 rounded-lg border border-border bg-brand-dark/60">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{b}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link to="/producto/ebook">
                <Button variant="cta" size="lg" className="w-full sm:w-auto">
                  Ver el ebook
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#ecosistema">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Ver herramientas complementarias
                </Button>
              </a>
            </div>

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
              <p>Producto de entrada recomendado para entender el método y activar el resto del ecosistema.</p>
            </div>
          </motion.div>

          {/* Right card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border bg-brand-dark-card/80 p-5 md:p-6"
          >
            <img src={ebookCover} alt="El Big Bang de los Negocios" className="w-full rounded-xl shadow-2xl mb-6" />
            <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-1">
              Ebook principal
            </p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">El Big Bang de los Negocios</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Guía práctica para transformar tus ideas en negocios rentables. 15 capítulos con metodología paso a paso.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-border">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-1">
                  Precio actual
                </p>
                <p className="text-2xl font-black text-brand-orange">€19,99</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-1">
                  Incluye
                </p>
                <p className="text-xs text-foreground leading-snug">PDF, metodología, ejercicios y acceso permanente</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EbookHighlightSection;
