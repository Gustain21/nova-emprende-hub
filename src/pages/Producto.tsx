import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clock, ExternalLink, ShieldCheck, BookOpen, Calendar, Lightbulb, PieChart, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getProductById } from "@/data/products";
import { getEffectivePricing, formatOfferDate } from "@/lib/offer";

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
  Lightbulb: <Lightbulb className="w-6 h-6" />,
  PieChart: <PieChart className="w-6 h-6" />,
  FileSpreadsheet: <FileSpreadsheet className="w-6 h-6" />,
};

const typeBadge: Record<string, { label: string; color: string }> = {
  ebook: { label: "PDF", color: "bg-brand-gold/20 text-brand-gold" },
  app: { label: "APP WEB", color: "bg-brand-orange/20 text-brand-orange" },
  excel: { label: "EXCEL", color: "bg-green-500/20 text-green-400" },
};

const Producto = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || "");

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="brand-container py-32 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Producto no encontrado</h1>
          <Button variant="cta" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const { price, originalPrice, offerActive } = getEffectivePricing(product);


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="brand-container">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" onClick={() => navigate("/#productos")} className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Volver a productos
            </Button>
          </motion.div>

          {/* Product Hero */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-brand-dark-elevated border border-border">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-auto object-contain"
                />
                <span className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-bold ${typeBadge[product.type].color}`}>
                  {typeBadge[product.type].label}
                </span>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col justify-center"
            >
              <div className="flex items-center gap-2 text-brand-sand mb-3">
                {iconMap[product.iconName]}
                <span className="text-sm font-medium">{product.subtitle}</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4 leading-tight">
                {product.title}
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {product.longDescription}
              </p>

              {/* Offer Badge */}
              {offerActive && product.offerEndDate && (
                <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/40">
                  <Clock className="w-5 h-5 text-red-400" />
                  <span className="text-base font-bold text-red-400">
                    ¡Oferta hasta el {formatOfferDate(product.offerEndDate)}! -30%
                  </span>
                </div>
              )}

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl md:text-5xl font-black text-brand-orange">
                  €{price.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    €{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>


              {/* CTA */}
              <Button variant="hero" size="xl" className="w-full sm:w-auto mb-6" asChild>
                <Link to={`/checkout/${product.id}`}>
                  Comprar ahora
                  <ExternalLink className="w-5 h-5" />
                </Link>
              </Button>

              {/* Trust signals */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                <span>Acceso inmediato tras la compra · Pago seguro</span>
              </div>
            </motion.div>
          </div>

          {/* Benefits & What You Get */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="brand-card bg-gradient-to-br from-brand-orange/10 to-transparent border-brand-orange/20"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                ¿Por qué necesitas este producto?
              </h2>
              <ul className="space-y-4">
                {product.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-brand-orange" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* What You Get */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="brand-card bg-gradient-to-br from-brand-gold/10 to-transparent border-brand-gold/20"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                ¿Qué incluye?
              </h2>
              <ul className="space-y-4">
                {product.whatYouGet.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-brand-gold" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center brand-card bg-gradient-to-r from-brand-orange/10 via-brand-gold/10 to-brand-orange/10 border-brand-orange/20"
          >
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">
              ¿Listo para dar el siguiente paso?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Empieza hoy con <span className="text-brand-orange font-semibold">{product.title}</span> y transforma tu manera de emprender.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to={`/checkout/${product.id}`}>
                  Comprar por €{product.price.toFixed(2)}
                  <ExternalLink className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/#packs">Ver Packs con descuento</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Producto;
