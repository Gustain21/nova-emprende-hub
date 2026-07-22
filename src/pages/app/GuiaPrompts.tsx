import { Route, Routes, useParams } from "react-router-dom";
import PurchaseGate from "@/components/app/PurchaseGate";
import GuiaShell from "@/features/guia-prompts/components/GuiaShell";
import GuiaIndex from "@/features/guia-prompts/components/GuiaIndex";
import GuiaModulo from "@/features/guia-prompts/components/GuiaModulo";
import { useGuiaProgress } from "@/features/guia-prompts/hooks/useGuiaProgress";

const GuiaInner = () => {
  const { status } = useGuiaProgress();
  return (
    <GuiaShell status={status} showBackToIndex={useIsModuloRoute()}>
      <Routes>
        <Route index element={<GuiaIndex />} />
        <Route path=":slug" element={<GuiaModulo />} />
      </Routes>
    </GuiaShell>
  );
};

// Small helper: detects if we're in a nested :slug route via URL check.
const useIsModuloRoute = () => {
  if (typeof window === "undefined") return false;
  const parts = window.location.pathname.split("/").filter(Boolean);
  // /clientes/herramientas/guia-de-prompts/<slug>
  return parts.length >= 4 && parts[2] === "guia-de-prompts";
};

const GuiaPrompts = () => (
  <div className="min-h-screen w-full bg-background">
    <PurchaseGateWrapper />
  </div>
);

const PurchaseGateWrapper = () => (
  <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 [&>div]:m-0">
    <PurchaseGate productId="guia-de-prompts">
      <div className="-mx-4 -my-6 sm:-mx-6">
        <GuiaInner />
      </div>
    </PurchaseGate>
  </div>
);

export default GuiaPrompts;
