import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="brand-section bg-background">
      <div className="brand-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-border bg-gradient-to-br from-brand-dark-card to-brand-dark p-10 md:p-16 overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-gold/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/40 text-xs font-bold text-brand-orange mb-6">
              Último empuje comercial
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Entra por el libro o acelera con el{" "}
              <span className="brand-gradient-text">ecosistema completo</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-10 leading-relaxed">
              La decisión está pensada para ser simple. Si quieres entender primero el método, empieza por El Big Bang de los Negocios. Si ya buscas una solución más amplia, entra por packs y gana profundidad desde el primer paso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/producto/ebook">
                <Button variant="cta" size="xl" className="w-full sm:w-auto">
                  <BookOpen className="w-5 h-5" />
                  Comprar El Big Bang
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#packs">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  <Package className="w-5 h-5" />
                  Ver packs
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
