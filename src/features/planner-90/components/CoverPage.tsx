import { motion } from "framer-motion";
import { Rocket, Target, TrendingUp } from "lucide-react";

const CoverPage = () => (
  <section className="relative min-h-[calc(100vh-140px)] flex items-center justify-center overflow-hidden bg-background">
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-[380px] h-[380px] md:w-[520px] md:h-[520px] rounded-full bg-brand-orange/15 blur-2xl"
      />
    </div>
    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex justify-center gap-6 mb-6"
      >
        {[Rocket, Target, TrendingUp].map((Icon, i) => (
          <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}>
            <Icon className="w-10 h-10 text-brand-orange" strokeWidth={1.5} />
          </motion.div>
        ))}
      </motion.div>
      <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2" style={{ color: "#F97316" }}>EL BIG BANG</h1>
      <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6" style={{ color: "#E0A12B" }}>DE LOS NEGOCIOS</h2>
      <div className="w-24 h-1 bg-brand-orange mx-auto mb-6 rounded-full" />
      <p className="text-lg md:text-xl font-medium text-foreground/80 tracking-wide">PLANNER DE EJECUCIÓN</p>
      <p className="text-2xl md:text-3xl font-bold text-brand-orange mt-1">90 DÍAS</p>
      <div className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white rounded-full font-semibold text-sm tracking-wider">
        🚀 TRANSFORMA TU NEGOCIO
      </div>
    </div>
  </section>
);

export default CoverPage;
