import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Star, Quote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const allTestimonials = [
  {
    id: 1,
    name: "Martha Cragh",
    location: "Ibiza, España",
    content:
      "El Big Bang de los Negocios me ayudó a ordenar lo que tenía en la cabeza. Dejé de dar vueltas y pude estructurar una propuesta con lógica, números y pasos claros.",
    rating: 5,
    avatar: "MC",
    product: "Ebook + Dashboard",
  },
  {
    id: 2,
    name: "Jonás Rodríguez",
    location: "Puebla, México",
    content:
      "La Guía de Prompts me ahorró muchísimo tiempo. Lo mejor no fue solo la IA, sino tener un sistema para usarla con intención comercial y no como un juguete más.",
    rating: 5,
    avatar: "JR",
    product: "Guía de Prompts",
  },
  {
    id: 3,
    name: "Rossana Ben",
    location: "Mendoza, Argentina",
    content:
      "La Bitácora del Capitán fue el empujón que necesitaba para ejecutar. Me obligó a aterrizar ideas y convertir lectura en movimiento real.",
    rating: 5,
    avatar: "RB",
    product: "Pack Starter",
  },
  {
    id: 4,
    name: "Cristián Herrera",
    location: "Buenos Aires, Argentina",
    content:
      "El Dashboard Financiero me dio una visión mucho más clara de márgenes, costes y decisiones. Para mí fue el producto que convirtió intuición en criterio.",
    rating: 5,
    avatar: "CH",
    product: "Dashboard Financiero",
  },
  {
    id: 5,
    name: "Laura Rossa",
    location: "Barranquilla, Colombia",
    content:
      "Entré por el ebook y terminé llevándome un pack. La lógica del ecosistema está bien pensada, porque cada producto amplía el anterior y no sientes que compras piezas sueltas.",
    rating: 5,
    avatar: "LR",
    product: "Pack Pro",
  },
  {
    id: 6,
    name: "Claudio Di Césare",
    location: "Florida, Uruguay",
    content:
      "El planner de 90 días me ayudó a poner foco. Dejé de improvisar y empecé a trabajar con un ritmo más medido y más orientado a resultados.",
    rating: 5,
    avatar: "CD",
    product: "Planner 90 Días",
  },
];

const Testimonios = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="brand-section bg-background">
          <div className="brand-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-sm font-medium text-brand-orange mb-6">
                Confianza y validación
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                Lo que pasa cuando una idea encuentra{" "}
                <span className="brand-gradient-text">método y ejecución</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                NOVA EMPRENDE no vende solo recursos. Vende claridad, estructura y herramientas para moverse mejor. Estos testimonios ayudan a entender esa experiencia.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-y border-border">
          <div className="brand-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-orange mb-2">500+</div>
                <div className="text-sm text-muted-foreground">lectores y compradores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-orange mb-2">4.9/5</div>
                <div className="text-sm text-muted-foreground">valoración media</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-orange mb-2">15+</div>
                <div className="text-sm text-muted-foreground">países alcanzados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-orange mb-2">98%</div>
                <div className="text-sm text-muted-foreground">volvería a recomendarlo</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="brand-section">
          <div className="brand-container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {allTestimonials.map((t, index) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl border border-border bg-brand-dark-card/60 p-6"
                >
                  <Quote className="w-8 h-8 text-brand-orange/40 mb-4" />
                  <span className="inline-block text-xs font-medium text-brand-orange mb-3">
                    {t.product}
                  </span>
                  <p className="text-foreground leading-relaxed mb-5 text-sm">
                    "{t.content}"
                  </p>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-orange text-brand-orange" />
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
          </div>
        </section>

        {/* CTA */}
        <section className="brand-section bg-background">
          <div className="brand-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4 leading-tight">
                Empieza por el producto que mejor encaje con tu momento
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
                Puedes entrar por el ebook, ir directo a una herramienta concreta o aprovechar la lógica de packs si ya tienes claro que necesitas una solución más completa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/#ebook">
                  <Button variant="hero" size="lg">
                    Ver el ebook principal
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/#packs">
                  <Button variant="heroOutline" size="lg">
                    Explorar packs
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonios;
