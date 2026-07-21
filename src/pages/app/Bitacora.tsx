import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Menu, X, Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import PurchaseGate from "@/components/app/PurchaseGate";
import CoverPage from "@/features/bitacora/components/CoverPage";
import IntroPage from "@/features/bitacora/components/IntroPage";
import DayPage from "@/features/bitacora/components/DayPage";
import ConclusionPage from "@/features/bitacora/components/ConclusionPage";
import NavigationSidebar from "@/features/bitacora/components/NavigationSidebar";
import { phases } from "@/features/bitacora/data/bitacoraContent";
import { generatePDF } from "@/features/bitacora/utils/pdfGenerator";
import { useBitacoraProgress } from "@/features/bitacora/hooks/useBitacoraProgress";

const SaveIndicator = ({ status }: { status: ReturnType<typeof useBitacoraProgress>["saveStatus"] }) => {
  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando…
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500">
        <CheckCircle2 className="w-3.5 h-3.5" /> Guardado
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-destructive">
        <AlertCircle className="w-3.5 h-3.5" /> Error al guardar
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Save className="w-3.5 h-3.5" /> Autoguardado activo
    </span>
  );
};

const BitacoraApp = () => {
  const {
    loading,
    saveStatus,
    answers,
    currentDay,
    currentView,
    setAnswer,
    setCurrentDay,
    setCurrentView,
  } = useBitacoraProgress();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dayData = useMemo(() => {
    for (const phaseData of phases) {
      const d = phaseData.days.find((x) => x.day === currentDay);
      if (d) return { day: d, phase: phaseData.phase };
    }
    return null;
  }, [currentDay]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const showSidebar = currentView !== "cover";
  const totalDays = 30;

  return (
    <div className="bitacora-app relative">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <Link
          to="/clientes/herramientas"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver a herramientas
        </Link>
        <div className="flex items-center gap-3">
          <SaveIndicator status={saveStatus} />
          {currentView !== "cover" && (
            <button
              onClick={() => setCurrentView("day")}
              className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90"
            >
              Continuar donde lo dejé (Día {currentDay})
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Tu progreso se guarda automáticamente en tu cuenta. Puedes salir y continuar cuando quieras.
      </p>

      <div className="relative rounded-2xl overflow-hidden border border-border bg-background">
        {showSidebar && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-4 left-4 z-50 lg:hidden p-2 bg-card border border-border rounded-lg text-foreground"
            aria-label="Abrir navegación"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        {showSidebar && (
          <NavigationSidebar
            currentDay={currentDay}
            onSelectDay={(day) => {
              setCurrentDay(day);
              setCurrentView("day");
            }}
            onGoToIntro={() => setCurrentView("intro")}
            onGoToConclusion={() => setCurrentView("conclusion")}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <main className={showSidebar ? "lg:ml-72" : ""}>
          {currentView === "cover" && <CoverPage onStart={() => setCurrentView("intro")} />}
          {currentView === "intro" && (
            <IntroPage
              onContinue={() => {
                setCurrentView("day");
                if (!currentDay || currentDay < 1) setCurrentDay(1);
              }}
            />
          )}
          {currentView === "day" && dayData && (
            <DayPage
              day={dayData.day}
              phase={dayData.phase}
              onPrevious={() => {
                if (currentDay === 1) setCurrentView("intro");
                else setCurrentDay(currentDay - 1);
              }}
              onNext={() => {
                if (currentDay === 30) setCurrentView("conclusion");
                else setCurrentDay(currentDay + 1);
              }}
              isFirst={currentDay === 1}
              isLast={currentDay === 30}
              answers={answers}
              onAnswerChange={setAnswer}
            />
          )}
          {currentView === "conclusion" && (
            <ConclusionPage
              onRestart={() => {
                setCurrentView("cover");
                setCurrentDay(1);
              }}
              onDownloadPDF={() => generatePDF(answers)}
            />
          )}
        </main>

        {showSidebar && currentView === "day" && (
          <div className="absolute bottom-0 left-0 right-0 lg:left-72 h-1 bg-secondary/20">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentDay / totalDays) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Bitacora = () => (
  <div className="min-h-screen w-full bg-background">
    <div className="w-full px-4 md:px-6 py-4 border-b border-border flex items-center justify-between gap-3">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-brand-orange font-bold">Herramienta</p>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">La Bitácora del Capitán</h1>
      </div>
      <Link
        to="/clientes/herramientas"
        className="inline-flex items-center text-sm px-3 py-1.5 rounded-md border border-border hover:bg-secondary"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver al área de clientes
      </Link>
    </div>
    <div className="w-full px-4 md:px-6 py-6">
      <PurchaseGate productId="bitacora-del-capitan">
        <BitacoraApp />
      </PurchaseGate>
    </div>
  </div>
);

export default Bitacora;

