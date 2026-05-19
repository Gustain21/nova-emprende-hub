import { motion } from "framer-motion";
import { BookOpen, Rocket, PieChart, Compass } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Método y claridad",
    text: "Contenido editorial práctico para ordenar ideas, enfoque y propuesta de negocio.",
  },
  {
    icon: Rocket,
    title: "Ejecución real",
    text: "Recursos creados para pasar de la intención a la acción, sin teoría vacía ni ruido.",
  },
  {
    icon: PieChart,
    title: "Control financiero",
    text: "Herramientas para entender números, márgenes, viabilidad y decisiones de crecimiento.",
  },
  {
    icon: Compass,
    title: "Sistema, no piezas sueltas",
    text: "Cada producto cumple una función concreta dentro de un ecosistema pensado para emprender mejor.",
  },
];

const WhatIsSection = () => {
  return (
    <section className="brand-section bg-background">
      <div className="brand-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-sm font-medium text-brand-orange mb-6">
            Qué es NOVA EMPRENDE
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Una estructura editorial para ayudarte a{" "}
            <span className="brand-gradient-text">emprender con criterio</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            NOVA EMPRENDE no nace como una simple tienda de recursos. Nace como un ecosistema práctico para convertir ideas en negocios reales, con una columna vertebral clara,{" "}
            <span className="font-semibold text-foreground">El Big Bang de los Negocios</span>, y herramientas diseñadas para ejecutar, ordenar y crecer.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-gradient-to-b from-brand-dark-card to-brand-dark p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center mb-5">
                <f.icon className="w-6 h-6 text-brand-orange" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIsSection;
