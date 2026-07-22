import { ChevronLeft, ChevronRight, Home, Target, Calendar, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { SaveStatus } from "../hooks/usePlannerProgress";

interface Props {
  currentSection: string;
  onNavigate: (s: string) => void;
  currentWeek: number;
  currentMonth: number;
  onWeekChange: (n: number) => void;
  onMonthChange: (n: number) => void;
  status: SaveStatus;
}

const StatusPill = ({ status }: { status: SaveStatus }) => {
  const label = status === "saving" ? "Guardando…" : status === "saved" ? "Guardado" : status === "error" ? "Error al guardar" : status === "loading" ? "Cargando…" : "Sincronizado";
  const cls = status === "error" ? "text-red-500" : status === "saved" ? "text-emerald-500" : "text-muted-foreground";
  return <span className={`text-xs ${cls}`}>{label}</span>;
};

const Navigation = ({ currentSection, onNavigate, currentWeek, currentMonth, onWeekChange, onMonthChange, status }: Props) => {
  const items = [
    { id: "cover", label: "Portada", icon: Home },
    { id: "quarterly", label: "Visión Macro", icon: Target },
    { id: "monthly", label: "Mensual", icon: Calendar },
    { id: "weekly", label: "Semanal", icon: Wallet },
  ];
  const monthNames = ["Mes 1", "Mes 2", "Mes 3"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link to="/clientes/herramientas" className="text-xs text-muted-foreground hover:text-foreground">← Salir</Link>
            <span className="font-bold text-brand-orange text-sm md:text-base">🚀 PLANNER 90 DÍAS</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => onNavigate(it.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                  currentSection === it.id ? "bg-brand-orange text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <it.icon className="w-4 h-4" /> {it.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {currentSection === "monthly" && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => onMonthChange(Math.max(1, currentMonth - 1))} disabled={currentMonth === 1}><ChevronLeft className="w-4 h-4" /></Button>
                <span className="text-sm font-medium min-w-[60px] text-center">{monthNames[currentMonth - 1]}</span>
                <Button variant="ghost" size="sm" onClick={() => onMonthChange(Math.min(3, currentMonth + 1))} disabled={currentMonth === 3}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            )}
            {currentSection === "weekly" && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => onWeekChange(Math.max(1, currentWeek - 1))} disabled={currentWeek === 1}><ChevronLeft className="w-4 h-4" /></Button>
                <span className="text-sm font-medium min-w-[86px] text-center">Semana {currentWeek}/12</span>
                <Button variant="ghost" size="sm" onClick={() => onWeekChange(Math.min(12, currentWeek + 1))} disabled={currentWeek === 12}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            )}
            <StatusPill status={status} />
          </div>
        </div>
        <div className="flex md:hidden items-center justify-center gap-1 mt-2 pt-2 border-t border-border">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => onNavigate(it.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs ${
                currentSection === it.id ? "bg-brand-orange text-white" : "text-muted-foreground"
              }`}
            >
              <it.icon className="w-4 h-4" /> {it.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
