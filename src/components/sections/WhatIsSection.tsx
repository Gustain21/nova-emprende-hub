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
    text: "Recursos para pasar de la intención a la acción con ejercicios y planificación.",
  },
  {
    icon: PieChart,
    title: "Control financiero",
    text: "Herramientas para revisar números, márgenes y viabilidad.",
  },
  {
    icon: Compass,
    title: "Sistema, no piezas sueltas",
    text: "Cada herramienta cumple una función concreta. Eliges solo las que necesitas.",
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
          <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Una estructura editorial para ayudarte a{" "}
            <span className="brand-gradient-text">emprender con criterio</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Empiezas por{" "}
            <span className="font-semibold text-foreground">El Big Bang de los Negocios</span> para ordenar tu idea. Si lo necesitas, añades herramientas para pasar a la acción, planificar y revisar tus números.
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
              <h3 className="font-sans text-xl font-bold tracking-tight text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIsSection;
