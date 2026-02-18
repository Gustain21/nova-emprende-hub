import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileSpreadsheet, BookOpen, Lightbulb, PieChart, Calendar, Clock } from "lucide-react";
import ebookCover from "@/assets/ebook-cover.jpg";
import workbookCover from "@/assets/workbook-cover.png";
import promptsCover from "@/assets/prompts-cover.png";
import dashboardCover from "@/assets/dashboard-cover.png";
import plannerCover from "@/assets/planner-cover.png";
import excelInfproducto from "@/assets/excel-infoproducto.png";
import excelEcomochilas from "@/assets/excel-ecomochilas.png";

interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  type: "ebook" | "app" | "excel";
  icon: React.ReactNode;
  featured?: boolean;
  offerEndDate?: string;
}

const products: Product[] = [
  {
    id: "ebook",
    title: "El Big Bang de los Negocios",
    subtitle: "Ebook Principal",
    description: "Guía práctica para transformar tus ideas en negocios rentables. 15 capítulos con metodología paso a paso.",
    originalPrice: 28.56,
    price: 19.99,
    image: ebookCover,
    type: "ebook",
    icon: <BookOpen className="w-5 h-5" />,
    featured: true,
    offerEndDate: "31/03",
  },
  {
    id: "bitacora",
    title: "La Bitácora del Capitán",
    subtitle: "Workbook Interactivo",
    description: "30 días para detonar tu mentalidad emprendedora. El cuaderno de trabajo oficial del ebook.",
    price: 19.99,
    image: workbookCover,
    type: "app",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    id: "prompts",
    title: "La Guía de Prompts",
    subtitle: "Para Emprendedores",
    description: "Tu copiloto de IA para pasar de la lectura a la acción. Prompts optimizados para cada etapa.",
    price: 9.99,
    image: promptsCover,
    type: "app",
    icon: <Lightbulb className="w-5 h-5" />,
  },
  {
    id: "dashboard",
    title: "Dashboard Financiero",
    subtitle: "App Web",
    description: "Gestiona gastos fijos, ventas, inversiones y analiza tu rentabilidad en tiempo real.",
    price: 27.99,
    image: dashboardCover,
    type: "app",
    icon: <PieChart className="w-5 h-5" />,
  },
  {
    id: "planner",
    title: "Planner de Ejecución 90 Días",
    subtitle: "App Web",
    description: "Transforma tu negocio en 90 días con un plan de ejecución estructurado y seguimiento.",
    price: 14.99,
    image: plannerCover,
    type: "app",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    id: "excel-infoproducto",
    title: "Plan Financiero Infoproducto",
    subtitle: "Plantilla Excel",
    description: "Análisis de rentabilidad, punto muerto y márgenes comerciales para tu infoproducto.",
    price: 15.99,
    image: excelInfproducto,
    type: "excel",
    icon: <FileSpreadsheet className="w-5 h-5" />,
  },
  {
    id: "excel-ecomochilas",
    title: "Plan Financiero E-commerce",
    subtitle: "Plantilla Excel",
    description: "Inversión, amortización y análisis financiero completo para negocios de productos físicos.",
    price: 15.99,
    image: excelEcomochilas,
    type: "excel",
    icon: <FileSpreadsheet className="w-5 h-5" />,
  },
];

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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`brand-card brand-card-hover bg-gradient-to-br ${typeStyles[product.type]} ${
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
            {product.icon}
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
              Comprar
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
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
