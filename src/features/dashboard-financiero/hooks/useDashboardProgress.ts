import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FinancialConfig, defaultConfig } from "./useFinancialCalculations";

export type SaveStatus = "idle" | "loading" | "saving" | "saved" | "error";

export const useDashboardProgress = () => {
  const [config, setConfigState] = useState<FinancialConfig>(defaultConfig);
  const [status, setStatus] = useState<SaveStatus>("loading");
  const [loaded, setLoaded] = useState(false);
  const timer = useRef<number | null>(null);

  // Carga inicial
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) { if (!cancelled) { setStatus("idle"); setLoaded(true); } return; }
      const { data, error } = await supabase
        .from("dashboard_fin_progress")
        .select("config")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) { console.error(error); setStatus("error"); setLoaded(true); return; }
      if (data?.config) {
        setConfigState({ ...defaultConfig, ...(data.config as Partial<FinancialConfig>) });
      }
      setStatus("idle");
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const persist = useCallback(async (next: FinancialConfig) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) { setStatus("error"); return; }
    setStatus("saving");
    const { error } = await supabase
      .from("dashboard_fin_progress")
      .upsert({ user_id: user.id, config: next as any }, { onConflict: "user_id" });
    if (error) { console.error(error); setStatus("error"); return; }
    setStatus("saved");
    window.setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 1500);
  }, []);

  const setConfig = useCallback((updater: FinancialConfig | ((prev: FinancialConfig) => FinancialConfig)) => {
    setConfigState((prev) => {
      const next = typeof updater === "function" ? (updater as any)(prev) : updater;
      if (loaded) {
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => persist(next), 700);
      }
      return next;
    });
  }, [loaded, persist]);

  return { config, setConfig, status, loaded };
};
