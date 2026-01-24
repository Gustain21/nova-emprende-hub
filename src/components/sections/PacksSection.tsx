import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star, Rocket, Zap, Crown } from "lucide-react";

interface Pack {
  id: string;
  name: string;
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
    id: "starter",
    name: "Pack Starter",
    description: "Perfecto para comenzar tu viaje emprendedor con los fundamentos esenciales.",
    originalPrice: 34.98,
    price: 27.99,
    products: [
      "El Big Bang de los Negocios (Ebook)",
      "La Bitácora del Capitán (Workbook)",
    ],
    icon: <Rocket className="w-6 h-6" />,
  },
  {
    id: "pro",
    name: "Pack Pro",
    description: "La combinación perfecta de teoría, práctica y herramientas digitales.",
    originalPrice: 69.96,
    price: 49.99,
    products: [
      "El Big Bang de los Negocios (Ebook)",
      "La Bitácora del Capitán (Workbook)",
      "La Guía de Prompts",
      "Dashboard Financiero",
    ],
    icon: <Zap className="w-6 h-6" />,
    featured: true,
    badge: "Más Popular",
  },
  {
    id: "complete",
    name: "Pack Completo",
    description: "Todo el ecosistema Nova Emprende. Acceso a todos los productos sin excepción.",
    originalPrice: 109.94,
    price: 79.99,
    products: [
      "El Big Bang de los Negocios (Ebook)",
      "La Bitácora del Capitán (Workbook)",
      "La Guía de Prompts",
      "Dashboard Financiero",
      "Planner de Ejecución 90 Días",
      "Plan Financiero Infoproducto (Excel)",
      "Plan Financiero E-commerce (Excel)",
    ],
    icon: <Crown className="w-6 h-6" />,
    badge: "Mejor Valor",
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
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`relative brand-card brand-card-hover flex flex-col ${
        pack.featured
          ? "border-brand-orange/50 bg-gradient-to-br from-brand-orange/10 to-brand-gold/5 scale-105 z-10"
          : ""
      }`}
    >
      {/* Badge */}
      {pack.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-orange to-brand-gold text-sm font-bold text-primary-foreground shadow-lg">
            <Star className="w-4 h-4" />
            {pack.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-2">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          pack.featured 
            ? "bg-gradient-to-br from-brand-orange to-brand-gold text-primary-foreground" 
            : "bg-brand-dark-elevated text-brand-sand"
        }`}>
          {pack.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{pack.name}</h3>
          <p className="text-sm text-muted-foreground">{pack.products.length} productos</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm mb-6">{pack.description}</p>

      {/* Products List */}
      <div className="flex-1 mb-6">
        <ul className="space-y-3">
          {pack.products.map((product, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{product}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing */}
      <div className="border-t border-border pt-6">
        <div className="flex items-end gap-3 mb-2">
          <span className="text-3xl font-black text-foreground">€{pack.price.toFixed(2)}</span>
          <span className="text-lg text-muted-foreground line-through">€{pack.originalPrice.toFixed(2)}</span>
        </div>
        <div className="text-sm text-brand-orange font-medium mb-4">
          Ahorras €{savings.toFixed(2)} ({savingsPercent}% descuento)
        </div>
        <Button 
          variant={pack.featured ? "hero" : "cta"} 
          size="lg" 
          className="w-full"
        >
          {pack.featured ? "Elegir Pack Pro" : `Elegir ${pack.name}`}
        </Button>
      </div>
    </motion.div>
  );
};

const PacksSection = () => {
  return (
    <section id="packs" className="brand-section bg-card">
      <div className="brand-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-sm font-medium text-brand-gold mb-4">
            Ofertas Especiales
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
            Packs con{" "}
            <span className="brand-gradient-text">descuento exclusivo</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ahorra combinando productos y obtén acceso a todo el ecosistema Nova Emprende
          </p>
        </motion.div>

        {/* Packs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {packs.map((pack, index) => (
            <PackCard key={pack.id} pack={pack} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PacksSection;
