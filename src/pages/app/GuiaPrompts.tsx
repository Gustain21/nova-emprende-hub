import { Route, Routes, useLocation } from "react-router-dom";
import PurchaseGate from "@/components/app/PurchaseGate";
import GuiaShell from "@/features/guia-prompts/components/GuiaShell";
import GuiaIndex from "@/features/guia-prompts/components/GuiaIndex";
import GuiaModulo from "@/features/guia-prompts/components/GuiaModulo";
import { GuiaProgressProvider, useGuiaProgress } from "@/features/guia-prompts/hooks/useGuiaProgress";
import ProgressLoadGate from "@/components/app/ProgressLoadGate";

const GuiaInner = () => {
  const { status, loadState, retry } = useGuiaProgress();
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  const inModulo = parts.length >= 4 && parts[2] === "guia-de-prompts";
  return (
    <GuiaShell status={status} loadFailed={loadState === "error"} showBackToIndex={inModulo}>
      <ProgressLoadGate loadState={loadState} onRetry={retry}>
      <Routes>
        <Route index element={<GuiaIndex />} />
        <Route path=":slug" element={<GuiaModulo />} />
      </Routes>
      </ProgressLoadGate>
    </GuiaShell>
  );
};

const GuiaPrompts = () => (
  <div className="min-h-screen w-full bg-background">
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <PurchaseGate productId="guia-de-prompts">
        <div className="-mx-4 -mt-6 sm:-mx-6">
          <GuiaProgressProvider>
            <GuiaInner />
          </GuiaProgressProvider>
        </div>
      </PurchaseGate>
    </div>
  </div>
);

export default GuiaPrompts;
