import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { PlannerConfig, WeekStatus } from "../hooks/usePlannerProgress";

interface Props {
  weekNumber: number;
  config: PlannerConfig;
  setConfig: React.Dispatch<React.SetStateAction<PlannerConfig>>;
}

const sumLines = (lines: { amount: string }[]) =>
  lines.reduce((s, l) => s + (parseFloat(String(l.amount).replace(",", ".")) || 0), 0);

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const lightsMeta: { key: WeekStatus; label: string; emoji: string; bg: string; ring: string }[] = [
  { key: "green", label: "Verde (Sana)", emoji: "✅", bg: "bg-emerald-500", ring: "ring-emerald-500" },
  { key: "yellow", label: "Amarillo (Justa)", emoji: "⚠️", bg: "bg-amber-500", ring: "ring-amber-500" },
  { key: "red", label: "Rojo (Peligro)", emoji: "🚨", bg: "bg-rose-500", ring: "ring-rose-500" },
];

const WeeklyTreasuryView = ({ weekNumber, config, setConfig }: Props) => {
  const week = config.weeks[weekNumber];

  const updateLine = (type: "inflows" | "outflows", idx: number, field: "desc" | "amount", v: string) =>
    setConfig((c) => {
      const arr = c.weeks[weekNumber][type].map((l, i) => (i === idx ? { ...l, [field]: v } : l));
      return { ...c, weeks: { ...c.weeks, [weekNumber]: { ...c.weeks[weekNumber], [type]: arr } } };
    });

  const setStatus = (s: WeekStatus) =>
    setConfig((c) => ({ ...c, weeks: { ...c.weeks, [weekNumber]: { ...c.weeks[weekNumber], status: s } } }));

  const setReflection = (v: string) =>
    setConfig((c) => ({ ...c, weeks: { ...c.weeks, [weekNumber]: { ...c.weeks[weekNumber], reflection: v } } }));

  const totalIn = sumLines(week.inflows);
  const totalOut = sumLines(week.outflows);
  const balance = totalIn - totalOut;

  return (
    <section className="min-h-screen py-16 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/15 rounded-full mb-4">
            <span className="text-sm font-bold text-brand-orange tracking-wider">SEMANA {weekNumber} DE 12</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">CONTROL SEMANAL DE CAJA 💰</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {(["inflows", "outflows"] as const).map((type) => {
            const isIn = type === "inflows";
            return (
              <div key={type} className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
                <div className={`px-6 py-4 flex items-center gap-3 border-b ${isIn ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"}`}>
                  <div className={`p-2 rounded-lg ${isIn ? "bg-emerald-500/20" : "bg-rose-500/20"}`}>
                    {isIn ? <ArrowDownLeft className="w-6 h-6 text-emerald-500" /> : <ArrowUpRight className="w-6 h-6 text-rose-500" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground tracking-wide">{isIn ? "ENTRADAS" : "SALIDAS"}</h3>
                    <span className="text-sm text-muted-foreground">{isIn ? "Lo que espero cobrar 💵" : "Lo que debo pagar 💸"}</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {week[type].map((l, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={l.desc}
                        onChange={(e) => updateLine(type, i, "desc", e.target.value)}
                        placeholder={isIn ? "Cliente / concepto" : "Proveedor / concepto"}
                        className="flex-1 h-9 rounded-lg bg-transparent border border-border px-2 text-sm focus:border-brand-orange outline-none"
                      />
                      <div className="flex items-center gap-1 w-28">
                        <input
                          inputMode="decimal"
                          value={l.amount}
                          onChange={(e) => updateLine(type, i, "amount", e.target.value)}
                          placeholder="0"
                          className="w-full h-9 rounded-lg bg-transparent border border-border px-2 text-sm text-right focus:border-brand-orange outline-none"
                        />
                        <span className="text-xs text-muted-foreground">€</span>
                      </div>
                    </div>
                  ))}
                  <div className={`mt-4 pt-3 border-t-2 flex items-center justify-between ${isIn ? "border-emerald-500" : "border-rose-500"}`}>
                    <span className="font-bold text-foreground">TOTAL {isIn ? "ENTRADAS" : "SALIDAS"}</span>
                    <div className={`px-3 h-10 rounded-xl border-2 flex items-center font-bold ${isIn ? "border-emerald-500 text-emerald-500 bg-emerald-500/5" : "border-rose-500 text-rose-500 bg-rose-500/5"}`}>
                      {fmt(isIn ? totalIn : totalOut)} €
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`mt-6 rounded-2xl p-4 border-2 flex items-center justify-between ${balance >= 0 ? "border-emerald-500/40 bg-emerald-500/10" : "border-rose-500/40 bg-rose-500/10"}`}>
          <span className="font-bold text-foreground">BALANCE DE LA SEMANA</span>
          <span className={`text-xl font-black ${balance >= 0 ? "text-emerald-500" : "text-rose-500"}`}>{fmt(balance)} €</span>
        </div>

        <div className="mt-8 bg-card rounded-2xl p-6 shadow-lg border border-border">
          <h4 className="font-bold text-brand-orange mb-6 text-center">🚦 ESTADO DE SALUD FINANCIERA</h4>
          <div className="flex justify-center gap-8 md:gap-16">
            {lightsMeta.map((light) => {
              const active = week.status === light.key;
              return (
                <button key={light.key} onClick={() => setStatus(active ? "" : light.key)} className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center transition-all ${active ? `${light.bg} border-transparent scale-105 shadow-lg` : "bg-muted border-border hover:scale-105"}`} />
                  <span className="text-xs md:text-sm font-medium text-muted-foreground text-center">{light.emoji} {light.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground italic">💡 Marca el círculo que representa tu situación esta semana. Sé honesto contigo mismo.</p>
        </div>

        <div className="mt-6 bg-brand-orange/5 rounded-2xl p-6 border border-brand-orange/20">
          <h4 className="font-bold text-brand-orange mb-3 flex items-center gap-2">✍️ Reflexión de la semana</h4>
          <textarea
            value={week.reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={5}
            placeholder="¿Qué aprendiste? ¿Qué ajustarás la próxima semana?"
            className="w-full bg-transparent border border-border rounded-xl p-3 text-sm focus:border-brand-orange outline-none resize-y"
          />
        </div>
      </div>
    </section>
  );
};

export default WeeklyTreasuryView;
