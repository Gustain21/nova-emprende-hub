import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Quote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const testimonials = [
  {
    id: 1,
    name: "María García",
    role: "Fundadora de EcoModa",
    content: "El Big Bang de los Negocios me dio la estructura que necesitaba. En 3 meses lancé mi tienda online con un plan financiero sólido gracias al Dashboard.",
    rating: 5,
    avatar: "MG",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    role: "Consultor Digital",
    content: "La Guía de Prompts transformó mi forma de usar la IA. Ahora creo contenido en la mitad de tiempo y con mejor calidad.",
    rating: 5,
    avatar: "CR",
  },
  {
    id: 3,
    name: "Ana Martínez",
    role: "Emprendedora Serial",
    content: "La Bitácora del Capitán me ayudó a desarrollar la mentalidad correcta. Los 30 días de ejercicios fueron reveladores.",
    rating: 5,
    avatar: "AM",
  },
];

const TestimonialsPreview = () => {
  return (
    <section className="brand-section bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-orange/5 to-transparent" />

      <div className="brand-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-brand-sand/10 border border-brand-sand/30 text-sm font-medium text-brand-sand mb-4">
            Lo que dicen nuestros clientes
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
            Historias de{" "}
            <span className="brand-gradient-text">éxito real</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Emprendedores como tú que transformaron sus ideas en negocios rentables
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="brand-card brand-card-hover"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-10 h-10 text-brand-orange/30" />
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-orange to-brand-sand flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/testimonios">
            <Button variant="heroOutline" size="lg">
              Ver todos los testimonios
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
