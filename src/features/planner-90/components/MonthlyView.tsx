import { Calendar, AlertCircle } from "lucide-react";
import type { PlannerConfig } from "../hooks/usePlannerProgress";

interface Props {
  monthNumber: number;
  monthName: string;
  config: PlannerConfig;
  setConfig: React.Dispatch<React.SetStateAction<PlannerConfig>>;
}

const DAYS_OF_WEEK = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

const MonthlyView = ({ monthNumber, monthName, config, setConfig }: Props) => {
  const month = config.months[monthNumber];

  const updateDay = (idx: number, v: string) =>
    setConfig((c) => {
      const days = [...c.months[monthNumber].days];
      days[idx] = v;
      return { ...c, months: { ...c.months, [monthNumber]: { ...c.months[monthNumber], days } } };
    });

  const updatePayment = (idx: number, field: "date" | "text", v: string) =>
    setConfig((c) => {
      const payments = c.months[monthNumber].payments.map((p, i) => (i === idx ? { ...p, [field]: v } : p));
      return { ...c, months: { ...c.months, [monthNumber]: { ...c.months[monthNumber], payments } } };
    });

  const updateNotes = (v: string) =>
    setConfig((c) => ({ ...c, months: { ...c.months, [monthNumber]: { ...c.months[monthNumber], notes: v } } }));

  return (
    <section className="min-h-screen py-16 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-brand-orange rounded-2xl px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl"><Calendar className="w-8 h-8 text-white" /></div>
            <div>
              <span className="text-white/80 text-sm font-medium tracking-wider">PLANIFICACIÓN MENSUAL</span>
              <h2 className="text-3xl font-black text-white tracking-tight">MES {monthNumber}: {monthName}</h2>
            </div>
          </div>
          <span className="text-5xl">📅</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="grid grid-cols-7 bg-muted">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="py-3 text-center text-sm font-bold text-brand-orange tracking-wider border-r last:border-r-0 border-border">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {month.days.map((val, i) => (
                <textarea
                  key={i}
                  value={val}
                  onChange={(e) => updateDay(i, e.target.value)}
                  placeholder={`${i + 1}`}
                  className="min-h-[90px] resize-none border-r border-b last:border-r-0 border-border p-2 text-xs bg-transparent focus:bg-muted/50 outline-none placeholder:text-muted-foreground/50"
                />
              ))}
            </div>
          </div>

          <div className="bg-brand-orange/10 rounded-2xl shadow-lg border border-brand-orange/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-orange/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-brand-orange" />
                <h3 className="font-bold text-foreground tracking-wide">FECHAS CLAVE DE PAGO</h3>
              </div>
              <span className="text-2xl mt-2 block">💳</span>
            </div>
            <div className="p-4 space-y-2">
              {month.payments.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={p.date}
                    onChange={(e) => updatePayment(i, "date", e.target.value)}
                    placeholder="dd/mm"
                    className="w-16 h-8 rounded-lg bg-card border border-border text-center text-xs focus:border-brand-orange outline-none"
                  />
                  <input
                    value={p.text}
                    onChange={(e) => updatePayment(i, "text", e.target.value)}
                    placeholder="Concepto…"
                    className="flex-1 h-8 rounded-lg bg-card border border-border px-2 text-sm focus:border-brand-orange outline-none"
                  />
                </div>
              ))}
              <div className="bg-card/80 rounded-xl p-3 mt-3">
                <p className="text-xs text-muted-foreground italic">💡 Anota vencimientos de impuestos, nóminas, proveedores y cuotas de préstamos.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-card rounded-2xl p-6 shadow-md border border-border">
          <h4 className="font-bold text-brand-orange mb-3 flex items-center gap-2">📝 Notas del mes</h4>
          <textarea
            value={month.notes}
            onChange={(e) => updateNotes(e.target.value)}
            rows={5}
            placeholder="Reflexiones, prioridades y aprendizajes del mes…"
            className="w-full bg-transparent border border-border rounded-xl p-3 text-sm focus:border-brand-orange outline-none resize-y"
          />
        </div>
      </div>
    </section>
  );
};

export default MonthlyView;
