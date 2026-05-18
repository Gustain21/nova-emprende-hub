import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star, Rocket, Zap, Crown } from "lucide-react";

interface Pack {
  id: string;
  name: string;
  tagline: string;
  description: string;
  originalPrice: number;
  price: number;
  products: string[];
  icon: React.ReactNode;
  featured?: boolean;
  badge?: string;
}

const packs: Pack[] = [
  {
    id: "base",
    name: "Pack Base",
    tagline: "Para empezar con foco",
    description: "Ideal si quieres ordenar tu idea, entender el método y empezar a moverte con una primera herramienta práctica.",
    originalPrice: 39.98,
    price: 31.99,
    products: ["El Big Bang de los Negocios", "La Bitácora del Capitán"],
    icon: <Rocket className="w-6 h-6" />,
  },
  {
    id: "impulso",
    name: "Pack Impulso",
    tagline: "Para avanzar con más claridad",
    description: "Pensado para emprendedores que quieren combinar visión, ejecución e inteligencia práctica en una misma compra.",
    originalPrice: 77.96,
    price: 55.99,
    products: [
      "El Big Bang de los Negocios",
      "La Bitácora del Capitán",
      "La Guía de Prompts",
      "Dashboard Financiero",
    ],
    icon: <Zap className="w-6 h-6" />,
    featured: true,
    badge: "Más recomendable",
  },
  {
    id: "dominio",
    name: "Pack Dominio",
    tagline: "Para entrar con todo",
    description: "La opción más completa para quien quiere apoyarse desde el inicio en contenidos, ejecución y control financiero.",
    originalPrice: 124.93,
    price: 89.99,
    products: [
      "El Big Bang de los Negocios",
      "La Bitácora del Capitán",
      "La Guía de Prompts",
      "Dashboard Financiero",
      "Planner de Ejecución 90 Días",
      "Plan Financiero Infoproducto",
      "Plan Financiero E-commerce",
    ],
    icon: <Crown className="w-6 h-6" />,
    badge: "Mayor profundidad",
  },
];

const PackCard = ({ pack, index }: { pack: Pack; index: number }) => {
  const savings = pack.originalPrice - pack.price;
  const savingsPercent = Math.round((savings / pack.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className={`relative rounded-2xl border p-7 flex flex-col ${
        pack.featured
          ? "border-brand-orange/60 bg-gradient-to-b from-brand-orange/10 to-brand-dark-card"
          : "border-border bg-brand-dark-card/60"
      }`}
    >
      {pack.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange text-primary-foreground text-xs font-bold shadow-lg whitespace-nowrap">
            <Star className="w-3.5 h-3.5 fill-current" />
            {pack.badge}
          </span>
        </div>
      )}

      <div className="flex items-start gap-3 mb-5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
          pack.featured
            ? "bg-brand-orange text-primary-foreground"
            : "bg-brand-dark-elevated text-brand-sand"
        }`}>
          {pack.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground leading-tight">{pack.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{pack.tagline}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{pack.description}</p>

      <div className="rounded-xl border border-border bg-brand-dark/60 p-4 mb-6">
        <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-3">
          Incluye
        </p>
        <ul className="space-y-2">
          {pack.products.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-foreground">
              <Check className="w-4 h-4 text-brand-orange shrink-0" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-black text-foreground">€{pack.price.toFixed(2)}</span>
          <span className="text-base text-muted-foreground line-through">€{pack.originalPrice.toFixed(2)}</span>
        </div>
        <div className="text-xs text-brand-orange font-semibold mb-4">
          Ahorras €{savings.toFixed(2)} ({savingsPercent}% descuento)
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Acceso inmediato y recorrido pensado para tu etapa.
        </p>
        <Button variant={pack.featured ? "hero" : "cta"} size="lg" className="w-full">
          Elegir {pack.name}
        </Button>
      </div>
    </motion.div>
  );
};

const PacksSection = () => {
  return (
    <section id="packs" className="brand-section bg-background">
      <div className="brand-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-sm font-medium text-brand-orange mb-6">
            Packs pensados para el emprendedor
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Elige la forma de empezar que mejor{" "}
            <span className="brand-gradient-text">encaje contigo</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            No todos los emprendedores están en el mismo punto. Por eso la oferta se organiza en tres opciones, para que puedas entrar con una solución más simple, más completa o más profunda según tu momento.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start max-w-6xl mx-auto">
          {packs.map((pack, index) => <PackCard key={pack.id} pack={pack} index={index} />)}
        </div>
      </div>
    </section>
  );
};

export default PacksSection;
