import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookOpen, Rocket, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import ebookCover from "@/assets/ebook-cover.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden brand-hero-gradient">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-gold/10 rounded-full blur-[100px] animate-pulse animation-delay-400" />
      </div>

      <div className="brand-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-brand-orange" />
              <span className="text-sm font-medium text-brand-orange">Guía Práctica para Emprendedores</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-6">
              <span className="text-foreground">El </span>
              <span className="brand-gradient-text">Big Bang</span>
              <br />
              <span className="text-foreground">de los </span>
              <span className="text-brand-sand">Negocios</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Transforma tus ideas en negocios rentables. Una guía práctica con herramientas, plantillas y recursos para emprendedores que pasan de la teoría a la acción.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mb-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-orange">6+</div>
                <div className="text-sm text-muted-foreground">Productos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-sand">15</div>
                <div className="text-sm text-muted-foreground">Capítulos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-gold">100%</div>
                <div className="text-sm text-muted-foreground">Práctico</div>
              </div>
            </div>

            {/* Price & Offer */}
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-brand-orange">€19,99</span>
                <span className="text-xl text-muted-foreground line-through">€28,56</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/40">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-sm font-bold text-red-400">¡Oferta hasta el 31/03! -30%</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/producto/ebook">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <BookOpen className="w-5 h-5" />
                  Ver más
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#productos">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  <Rocket className="w-5 h-5" />
                  Explorar Productos
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Book Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/30 to-brand-gold/20 rounded-3xl blur-3xl transform scale-110" />
              
              {/* Book Image */}
              <div className="relative">
                <img
                  src={ebookCover}
                  alt="El Big Bang de los Negocios - Ebook"
                  className="relative w-full max-w-md rounded-2xl shadow-2xl animate-float"
                />
                
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
