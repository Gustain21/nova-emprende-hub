import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileSpreadsheet, BookOpen, Lightbulb, PieChart, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { products, type Product } from "@/data/products";

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Lightbulb: <Lightbulb className="w-5 h-5" />,
  PieChart: <PieChart className="w-5 h-5" />,
  FileSpreadsheet: <FileSpreadsheet className="w-5 h-5" />,
};

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const typeStyles = {
    ebook: "from-brand-gold/20 to-brand-orange/20 border-brand-gold/30",
    app: "from-brand-orange/20 to-brand-dark-elevated border-brand-orange/30",
    excel: "from-green-500/20 to-brand-dark-elevated border-green-500/30",
  };

  const typeBadge = {
    ebook: { label: "PDF", color: "bg-brand-gold/20 text-brand-gold" },
    app: { label: "APP WEB", color: "bg-brand-orange/20 text-brand-orange" },
    excel: { label: "EXCEL", color: "bg-green-500/20 text-green-400" },
  };

  return (
    <Link to={`/producto/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`brand-card brand-card-hover bg-gradient-to-br cursor-pointer ${typeStyles[product.type]} ${
          product.featured ? "md:col-span-2 lg:col-span-3" : ""
        }`}
      >
        <div className={`flex flex-col h-full ${product.featured ? "md:flex-row md:gap-8 md:items-center" : ""}`}>
          {/* Image */}
          <div className={`relative mb-4 ${product.featured ? "md:mb-0 md:w-2/5 lg:w-1/3" : ""}`}>
            <div className="overflow-hidden rounded-xl bg-brand-dark-elevated">
              <img
                src={product.image}
                alt={product.title}
                className={`w-full object-contain transition-transform duration-500 hover:scale-105 ${
                  product.featured ? "h-72 md:h-80 lg:h-96" : "h-56"
                }`}
              />
            </div>
            <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${typeBadge[product.type].color}`}>
              {typeBadge[product.type].label}
            </span>
          </div>

          {/* Content */}
          <div className={`flex flex-col flex-1 ${product.featured ? "md:w-3/5 lg:w-2/3 md:py-4" : ""}`}>
            <div className="flex items-center gap-2 text-brand-sand mb-2">
              {iconMap[product.iconName]}
              <span className="text-sm font-medium">{product.subtitle}</span>
            </div>

            <h3 className={`font-bold text-foreground mb-3 leading-tight ${product.featured ? "text-2xl md:text-3xl lg:text-4xl" : "text-lg"}`}>
              {product.title}
            </h3>

            <p className={`text-muted-foreground leading-relaxed mb-6 flex-1 ${product.featured ? "text-base md:text-lg" : "text-sm"}`}>
              {product.description}
            </p>

            {/* Offer Badge */}
            {product.offerEndDate && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/40">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-sm font-bold text-red-400">
                  ¡Oferta hasta el {product.offerEndDate}! -30%
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className={`font-bold text-brand-orange ${product.featured ? "text-3xl md:text-4xl" : "text-2xl"}`}>
                  €{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    €{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <Button variant={product.featured ? "hero" : "cta"} size={product.featured ? "lg" : "default"}>
                Ver más
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const ProductsSection = () => {
  return (
    <section id="productos" className="brand-section bg-background">
      <div className="brand-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-sm font-medium text-brand-orange mb-4">
            Catálogo de Productos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
            Todo lo que necesitas para{" "}
            <span className="brand-gradient-text">emprender</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Herramientas prácticas diseñadas para llevarte de la idea al negocio rentable
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
