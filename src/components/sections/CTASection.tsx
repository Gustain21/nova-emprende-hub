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
              Siguiente paso
            </span>
            <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Empieza por el libro o elige un{" "}
              <span className="brand-gradient-text">pack</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-10 leading-relaxed">
              Si quieres ordenar tu idea, empieza por El Big Bang de los Negocios. Si además quieres herramientas para ejecutar, revisa los packs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pagar/el-big-bang-de-los-negocios">
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
