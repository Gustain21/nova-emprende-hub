import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Empiezo por el ebook o por un pack?",
    a: "Si quieres entender el método y validar primero, empieza por el ebook. Si ya tienes claro que vas a ejecutar, un pack te da más herramientas con descuento.",
  },
  {
    q: "¿Cómo se entrega lo que compro y dónde lo encuentro?",
    a: "Tras la compra recibirás un email con tus accesos. Los PDF y Excels se descargan desde tu área de cliente, y las app/webs se abren con el mismo usuario.",
  },
  {
    q: "¿A quién está dirigido EL BIG BANG DE LOS NEGOCIOS?",
    a: "A emprendedores y futuros emprendedores que quieren pasar de la idea al negocio con un método claro, sin teoría innecesaria.",
  },
  {
    q: "¿Se pueden comprar productos por separado?",
    a: "Sí. Cada producto se puede adquirir de forma individual o dentro de un pack con descuento. Tú eliges el formato que mejor encaja con tu momento.",
  },
  {
    q: "¿Qué función tienen las herramientas complementarias?",
    a: "Acompañan al ebook para ejecutar, ordenar y medir. Workbook para mentalidad, Prompts para IA, Dashboard y Excels para finanzas, Planner para los próximos 90 días.",
  },
];

const FaqSection = () => {
  return (
    <section className="brand-section bg-background">
      <div className="brand-container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-sm font-medium text-brand-orange mb-6">
            Preguntas frecuentes
          </span>
          <h2 className="font-sans text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6 leading-tight">
            Todo más claro antes de{" "}
            <span className="brand-gradient-text">tomar la decisión</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Este bloque está pensado para bajar objeciones, ordenar formatos y hacer más sencilla la elección entre producto individual o pack.
          </p>
        </motion.div>

        <div className="rounded-2xl border border-border bg-brand-dark-card/60 p-2 md:p-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left text-foreground hover:text-brand-orange px-4">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground px-4">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
