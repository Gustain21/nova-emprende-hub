import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, BookOpen, Lightbulb, PieChart, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { products, type Product } from "@/data/products";

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Lightbulb: <Lightbulb className="w-4 h-4" />,
  PieChart: <PieChart className="w-4 h-4" />,
  FileSpreadsheet: <FileText className="w-4 h-4" />,
};

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const badge =
    product.type === "excel"
      ? { label: "EXCEL", color: "bg-brand-orange text-primary-foreground" }
      : { label: "APP WEB", color: "bg-brand-orange text-primary-foreground" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-2xl border border-border bg-brand-dark-card/60 p-4 flex flex-col"
    >
      <div className="relative mb-5">
        <div className="overflow-hidden rounded-xl bg-brand-dark-elevated aspect-[16/10]">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        </div>
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      <div className="flex items-center gap-2 text-brand-sand mb-2">
        {iconMap[product.iconName]}
        <span className="text-xs font-medium">{product.subtitle}</span>
      </div>

      <h3 className="font-sans text-xl font-extrabold tracking-tight text-foreground mb-2 leading-tight">{product.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{product.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-2xl font-black text-brand-orange">€{product.price.toFixed(2)}</span>
        <Link to={`/producto/${product.id}`}>
          <Button variant="cta" size="sm">
            Ver más
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

const ProductsSection = () => {
  const implementacion = products.filter((p) => ["bitacora", "prompts", "planner"].includes(p.id));
  const control = products.filter((p) => ["dashboard", "excel-infoproducto", "excel-ecomochilas"].includes(p.id));

  return (
    <section id="ecosistema" className="brand-section bg-background">
      <div className="brand-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-sm font-medium text-brand-orange mb-6">
            Ecosistema complementario
          </span>
          <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 leading-tight">
            Herramientas organizadas para{" "}
            <span className="brand-gradient-text">ejecutar mejor</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Después del ebook, cada producto cumple una función concreta. Así evitamos una tienda caótica y construimos una oferta que se entiende y se compra mejor.
          </p>
        </motion.div>

        {/* Implementación y foco */}
        <div className="mb-16">
          <div className="grid md:grid-cols-[1fr,1.5fr] gap-6 mb-8">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-brand-sand uppercase mb-2">
                Implementación y foco
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Herramientas para pasar a la acción
              </h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground self-end">
              Recursos pensados para ayudarte a aterrizar ideas, mantener foco y convertir teoría en ejecución diaria.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {implementacion.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>

        {/* Control y gestión */}
        <div>
          <div className="grid md:grid-cols-[1fr,1.5fr] gap-6 mb-8">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-brand-sand uppercase mb-2">
                Control y gestión
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Herramientas para decidir con números
              </h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground self-end">
              Productos dirigidos a emprendedores que necesitan ordenar márgenes, viabilidad, proyecciones y seguimiento financiero.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {control.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
