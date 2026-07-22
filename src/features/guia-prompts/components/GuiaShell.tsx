import { Link } from "react-router-dom";
import { ArrowLeft, List, Loader2, Check, AlertCircle } from "lucide-react";
import type { SaveStatus } from "../hooks/useGuiaProgress";

interface Props {
  children: React.ReactNode;
  status: SaveStatus;
  showBackToIndex?: boolean;
}

const GuiaShell = ({ children, status, showBackToIndex = false }: Props) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/clientes"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition hover:border-brand-orange hover:text-brand-orange"
            >
              <ArrowLeft className="h-3 w-3" /> <span className="hidden sm:inline">Área de clientes</span><span className="sm:hidden">Clientes</span>
            </Link>
            <Link
              to="/clientes/herramientas"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition hover:border-brand-orange hover:text-brand-orange"
            >
              <List className="h-3 w-3" /> Herramientas
            </Link>
            {showBackToIndex && (
              <Link
                to="/clientes/herramientas/guia-de-prompts"
                className="hidden md:inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition hover:border-brand-orange hover:text-brand-orange"
              >
                Índice
              </Link>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm font-semibold text-foreground">La Guía de Prompts</span>
            <SaveIndicator status={status} />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
};

const SaveIndicator = ({ status }: { status: SaveStatus }) => {
  if (status === "idle") return <span className="text-[11px] text-muted-foreground">Listo</span>;
  if (status === "saving")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> Guardando
      </span>
    );
  if (status === "saved")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500">
        <Check className="h-3 w-3" /> Guardado
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-destructive">
      <AlertCircle className="h-3 w-3" /> Error al guardar
    </span>
  );
};

export default GuiaShell;
