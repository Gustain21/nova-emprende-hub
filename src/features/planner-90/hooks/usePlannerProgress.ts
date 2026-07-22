import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LineItem = { desc: string; amount: string };
export type WeekStatus = "" | "green" | "yellow" | "red";

export interface PlannerConfig {
  goals: { revenue: string; profit: string; cash: string };
  months: Record<
    number,
    { payments: { date: string; text: string }[]; notes: string; days: string[] }
  >;
  weeks: Record<
    number,
    { inflows: LineItem[]; outflows: LineItem[]; status: WeekStatus; reflection: string }
  >;
}

export type SaveStatus = "idle" | "loading" | "saving" | "saved" | "error";

const emptyLines = (n: number): LineItem[] =>
  Array.from({ length: n }, () => ({ desc: "", amount: "" }));

const emptyPayments = (n: number) =>
  Array.from({ length: n }, () => ({ date: "", text: "" }));

export const defaultConfig = (): PlannerConfig => ({
  goals: { revenue: "", profit: "", cash: "" },
  months: {
    1: { payments: emptyPayments(10), notes: "", days: Array(35).fill("") },
    2: { payments: emptyPayments(10), notes: "", days: Array(35).fill("") },
    3: { payments: emptyPayments(10), notes: "", days: Array(35).fill("") },
  },
  weeks: Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [
      i + 1,
      { inflows: emptyLines(8), outflows: emptyLines(8), status: "" as WeekStatus, reflection: "" },
    ]),
  ) as PlannerConfig["weeks"],
});

const mergeConfig = (raw: any): PlannerConfig => {
  const base = defaultConfig();
  if (!raw || typeof raw !== "object") return base;
  return {
    goals: { ...base.goals, ...(raw.goals ?? {}) },
    months: { ...base.months, ...(raw.months ?? {}) },
    weeks: { ...base.weeks, ...(raw.weeks ?? {}) },
  };
};

export const usePlannerProgress = () => {
  const [config, setConfig] = useState<PlannerConfig>(defaultConfig);
  const [status, setStatus] = useState<SaveStatus>("loading");
  const loadedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        if (!cancelled) { setStatus("idle"); loadedRef.current = true; }
        return;
      }
      const { data, error } = await supabase
        .from("planner_progress")
        .select("config")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) { console.error(error); setStatus("error"); loadedRef.current = true; return; }
      if (data?.config) setConfig(mergeConfig(data.config));
      setStatus("idle");
      loadedRef.current = true;
    })();
    return () => { cancelled = true; };
  }, []);

  const persist = useCallback(async (payload: PlannerConfig) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) { setStatus("error"); return; }
    setStatus("saving");
    const { error } = await supabase
      .from("planner_progress")
      .upsert({ user_id: user.id, config: payload as any }, { onConflict: "user_id" });
    if (error) { console.error(error); setStatus("error"); return; }
    setStatus("saved");
    window.setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 1200);
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => persist(config), 700);
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [config, persist]);

  return { config, setConfig, status };
};
