import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Quote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const testimonials = [
  {
    id: 1,
    name: "Martha Cragh",
    location: "Ibiza, España",
    content:
      "El Big Bang de los Negocios me ayudó a ordenar mi idea y entender qué decisiones debía tomar primero. Luego el Dashboard me sirvió para aterrizar números con mucha más claridad.",
    rating: 5,
    avatar: "MG",
  },
  {
    id: 2,
    name: "Jonás Rodríguez",
    location: "Puebla, México",
    content:
      "La Guía de Prompts y la lógica del ecosistema están muy bien pensadas. No sentí que compraba archivos sueltos, sino herramientas con una función clara.",
    rating: 5,
    avatar: "CR",
  },
  {
    id: 3,
    name: "Rossana Ben",
    location: "Mendoza, Argentina",
    content:
      "La Bitácora del Capitán me empujó a ejecutar. Fue el complemento perfecto al libro porque me obligó a moverme, no solo a leer.",
    rating: 5,
    avatar: "AM",
  },
];

const TestimonialsPreview = () => {
  return (
    <section id="testimonios" className="brand-section bg-background relative overflow-hidden">
      <div className="brand-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-sm font-medium text-brand-orange mb-6">
            Prueba social
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Claridad para comprar, confianza para{" "}
            <span className="brand-gradient-text">dar el siguiente paso</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Este bloque refuerza algo importante: cuando la oferta se entiende bien, la confianza sube y la conversión también.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-brand-dark-card/60 p-6"
            >
              <Quote className="w-8 h-8 text-brand-orange/40 mb-4" />
              <p className="text-foreground leading-relaxed mb-5 text-sm">"{t.content}"</p>
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-brand-orange text-brand-orange" />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange to-brand-sand flex items-center justify-center text-primary-foreground font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/testimonios">
            <Button variant="heroOutline" size="lg">
              Ver testimonios
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
