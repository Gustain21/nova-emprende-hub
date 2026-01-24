import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Star, Quote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const allTestimonials = [
  {
    id: 1,
    name: "María García",
    role: "Fundadora de EcoModa",
    content: "El Big Bang de los Negocios me dio la estructura que necesitaba para organizar mis ideas. En 3 meses lancé mi tienda online con un plan financiero sólido gracias al Dashboard. Las plantillas de Excel fueron fundamentales para proyectar mis finanzas.",
    rating: 5,
    avatar: "MG",
    product: "Pack Completo",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    role: "Consultor Digital",
    content: "La Guía de Prompts transformó mi forma de usar la IA en mi día a día. Ahora creo contenido en la mitad de tiempo y con mejor calidad. El ROI de esta inversión fue inmediato.",
    rating: 5,
    avatar: "CR",
    product: "Guía de Prompts",
  },
  {
    id: 3,
    name: "Ana Martínez",
    role: "Emprendedora Serial",
    content: "La Bitácora del Capitán me ayudó a desarrollar la mentalidad correcta. Los 30 días de ejercicios fueron reveladores y me permitieron identificar bloqueos que ni sabía que tenía.",
    rating: 5,
    avatar: "AM",
    product: "Pack Starter",
  },
  {
    id: 4,
    name: "David López",
    role: "CEO de TechStartup",
    content: "El Dashboard Financiero es exactamente lo que necesitaba para tener claridad sobre mis números. La visualización de datos me permite tomar decisiones informadas cada semana.",
    rating: 5,
    avatar: "DL",
    product: "Dashboard Financiero",
  },
  {
    id: 5,
    name: "Laura Sánchez",
    role: "Creadora de Contenido",
    content: "Compré el Pack Pro y fue la mejor inversión en mi carrera. El ebook me dio la visión general y las herramientas me ayudaron a ejecutar paso a paso. ¡Muy recomendado!",
    rating: 5,
    avatar: "LS",
    product: "Pack Pro",
  },
  {
    id: 6,
    name: "Roberto Fernández",
    role: "Freelancer",
    content: "El Planner de 90 días cambió mi forma de trabajar. Ahora tengo objetivos claros y un sistema de seguimiento que me mantiene enfocado en lo que realmente importa.",
    rating: 5,
    avatar: "RF",
    product: "Planner 90 Días",
  },
  {
    id: 7,
    name: "Carmen Ruiz",
    role: "Diseñadora Independiente",
    content: "Las plantillas Excel de planes financieros me ahorraron semanas de trabajo. Están muy bien estructuradas y me permitieron presentar un proyecto sólido a inversores.",
    rating: 5,
    avatar: "CR",
    product: "Plan Financiero Excel",
  },
  {
    id: 8,
    name: "Miguel Ángel Torres",
    role: "Emprendedor E-commerce",
    content: "El ecosistema completo de Nova Emprende me acompañó desde la idea hasta el lanzamiento. La combinación de teoría y herramientas prácticas es perfecta.",
    rating: 5,
    avatar: "MT",
    product: "Pack Completo",
  },
];

const Testimonios = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="brand-section brand-hero-gradient">
          <div className="brand-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-brand-sand/10 border border-brand-sand/30 text-sm font-medium text-brand-sand mb-6">
                Historias reales
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
                Lo que dicen nuestros{" "}
                <span className="brand-gradient-text">clientes</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Emprendedores de toda España y Latinoamérica que transformaron sus ideas en negocios rentables con el ecosistema Nova Emprende.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-card border-y border-border">
          <div className="brand-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-brand-orange mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Clientes satisfechos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-brand-sand mb-2">4.9</div>
                <div className="text-sm text-muted-foreground">Valoración media</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-brand-gold mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Países alcanzados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-brand-orange mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Recomendarían</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="brand-section">
          <div className="brand-container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTestimonials.map((testimonial, index) => (
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

                  {/* Product Badge */}
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-orange/10 text-xs font-medium text-brand-orange mb-4">
                    {testimonial.product}
                  </span>

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
          </div>
        </section>

        {/* CTA */}
        <section className="brand-section bg-card">
          <div className="brand-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                ¿Listo para ser el próximo caso de éxito?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Únete a cientos de emprendedores que ya transformaron sus ideas en negocios rentables.
              </p>
              <Link to="/#productos">
                <Button variant="hero" size="xl">
                  Explorar Productos
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonios;
