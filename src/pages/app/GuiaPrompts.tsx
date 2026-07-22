import { Route, Routes, useLocation } from "react-router-dom";
import PurchaseGate from "@/components/app/PurchaseGate";
import GuiaShell from "@/features/guia-prompts/components/GuiaShell";
import GuiaIndex from "@/features/guia-prompts/components/GuiaIndex";
import GuiaModulo from "@/features/guia-prompts/components/GuiaModulo";
import { useGuiaProgress } from "@/features/guia-prompts/hooks/useGuiaProgress";

const GuiaInner = () => {
  const { status } = useGuiaProgress();
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  const inModulo = parts.length >= 4 && parts[2] === "guia-de-prompts";
  return (
    <GuiaShell status={status} showBackToIndex={inModulo}>
      <Routes>
        <Route index element={<GuiaIndex />} />
        <Route path=":slug" element={<GuiaModulo />} />
      </Routes>
    </GuiaShell>
  );
};

const GuiaPrompts = () => (
  <div className="min-h-screen w-full bg-background">
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <PurchaseGate productId="guia-de-prompts">
        <div className="-mx-4 -mt-6 sm:-mx-6">
          <GuiaInner />
        </div>
      </PurchaseGate>
    </div>
  </div>
);

export default GuiaPrompts;
