// Herramienta temporal (Preview/Development) para simular países en Paddle.PricePreview.
// No se renderiza en producción.

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { getCountryOverride, setCountryOverride } from "@/lib/pricing/useLocalizedPaddlePrices";

const OPTIONS = ["AUTO", "ES", "AR", "MX", "CO", "CL", "US"];

function isPreviewEnv(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return (
    import.meta.env.DEV ||
    h.includes("lovable.app") ||
    h === "localhost" ||
    h.startsWith("127.")
  );
}

const DevCountrySwitcher = () => {
  const [current, setCurrent] = useState<string>("AUTO");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrent(getCountryOverride() || "AUTO");
  }, []);

  if (!mounted || !isPreviewEnv()) return null;

  const change = (cc: string) => {
    setCurrent(cc);
    setCountryOverride(cc === "AUTO" ? null : cc);
  };

  return (
    <div className="fixed bottom-3 right-3 z-[9999] flex items-center gap-2 px-3 py-2 rounded-full bg-black/80 border border-white/10 backdrop-blur text-xs text-white shadow-xl">
      <Globe className="w-3.5 h-3.5 text-brand-orange" />
      <span className="text-white/60">Preview país:</span>
      <select
        value={current}
        onChange={(e) => change(e.target.value)}
        className="bg-transparent text-white text-xs focus:outline-none"
      >
        {OPTIONS.map((o) => (
          <option key={o} value={o} className="bg-black">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DevCountrySwitcher;
