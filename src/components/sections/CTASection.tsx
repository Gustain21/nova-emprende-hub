import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="brand-section bg-card relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[150px]" />
      </div>

      <div className="brand-container relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative p-8 md:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-brand-dark-elevated to-brand-dark border border-border overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-orange/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-brand-gold/20 to-transparent rounded-full blur-3xl" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/20 border border-brand-orange/40 mb-6"
            >
              <Sparkles className="w-4 h-4 text-brand-orange" />
              <span className="text-sm font-medium text-brand-orange">Comienza tu transformación hoy</span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-6"
            >
              ¿Listo para convertir tu idea en un{" "}
              <span className="brand-gradient-text">negocio rentable</span>?
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Únete a cientos de emprendedores que ya están transformando sus ideas en negocios exitosos con el ecosistema Nova Emprende.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a href="#productos">
                <Button variant="hero" size="xl" className="w-full sm:w-auto animate-glow-pulse">
                  <Rocket className="w-5 h-5" />
                  Explorar Productos
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a href="#packs">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  Ver Packs con Descuento
                </Button>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
