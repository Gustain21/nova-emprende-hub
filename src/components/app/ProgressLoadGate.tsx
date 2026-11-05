import type { ReactNode } from "react";
import { AlertCircle, Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LoadState } from "@/lib/progress/useGuardedProgress";

interface Props {
  loadState: LoadState;
  onRetry: () => void;
  children: ReactNode;
}

/** Renders the editable app only after a valid load; otherwise loader or retryable error. */
const ProgressLoadGate = ({ loadState, onRetry, children }: Props) => {
  if (loadState === "ready") return <>{children}</>;
  if (loadState === "loading") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Cargando tu progreso…</span>
      </div>
    );
  }
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 py-10">
      <div
        role="alert"
        className="w-full max-w-md rounded-2xl border border-destructive/40 bg-card p-6 sm:p-8 text-center space-y-4"
      >
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-foreground">No hemos podido cargar tu progreso</h2>
        <p className="text-sm text-muted-foreground">
          Para proteger lo que ya tenías guardado, la edición está bloqueada hasta que la carga funcione.
          Comprueba tu conexión e inténtalo de nuevo.
        </p>
        <Button onClick={onRetry} variant="cta" className="w-full sm:w-auto gap-2">
          <RotateCw className="h-4 w-4" aria-hidden="true" /> Reintentar
        </Button>
      </div>
    </div>
  );
};

export default ProgressLoadGate;
