import { Target, TrendingUp, Wallet } from "lucide-react";
import type { PlannerConfig } from "../hooks/usePlannerProgress";

interface Props {
  config: PlannerConfig;
  setConfig: React.Dispatch<React.SetStateAction<PlannerConfig>>;
}

const goals = [
  { key: "revenue" as const, title: "META FACTURACIÓN", icon: TrendingUp, emoji: "💰" },
  { key: "profit" as const, title: "META BENEFICIO", icon: Target, emoji: "📈" },
  { key: "cash" as const, title: "META CAJA", icon: Wallet, emoji: "🏦" },
];

const QuarterlyView = ({ config, setConfig }: Props) => {
  const update = (k: keyof PlannerConfig["goals"], v: string) =>
    setConfig((c) => ({ ...c, goals: { ...c.goals, [k]: v } }));

  return (
    <section className="min-h-screen py-16 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/15 rounded-full mb-4">
            <span className="text-sm font-semibold text-brand-orange tracking-wider">VISIÓN GENERAL</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">VISIÓN MACRO</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Define tus objetivos financieros para los próximos 90 días. Estas metas guiarán todas tus decisiones estratégicas. 🎯
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {goals.map((g) => (
            <div key={g.key} className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border">
              <div className="bg-brand-orange px-6 py-4 flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg"><g.icon className="w-5 h-5 text-white" /></div>
                <h3 className="text-lg font-bold text-white tracking-wide">{g.title}</h3>
                <span className="ml-auto text-2xl">{g.emoji}</span>
              </div>
              <div className="p-6 min-h-[180px] flex flex-col">
                <div className="flex-1 border-2 border-dashed border-border rounded-xl p-4 flex items-center justify-center">
                  <div className="flex items-baseline gap-2 w-full justify-center">
                    <span className="text-3xl font-black text-muted-foreground">€</span>
                    <input
                      inputMode="decimal"
                      value={config.goals[g.key]}
                      onChange={(e) => update(g.key, e.target.value)}
                      placeholder="0"
                      className="w-full max-w-[220px] text-3xl md:text-4xl font-black text-foreground bg-transparent border-b-2 border-border focus:border-brand-orange outline-none text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-card rounded-2xl p-6 shadow-md border border-border">
          <h4 className="font-bold text-brand-orange mb-2 flex items-center gap-2">💡 Chispa de Ignición</h4>
          <p className="text-muted-foreground italic leading-relaxed">
            "Las metas sin plazos son solo deseos. Escribe números específicos y comprométete con ellos. Recuerda: lo que se mide, se mejora."
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuarterlyView;
