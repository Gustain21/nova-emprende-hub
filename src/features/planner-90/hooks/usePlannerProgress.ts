import { useCallback } from "react";
import { useGuardedProgress } from "@/lib/progress/useGuardedProgress";

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
  const { data: config, setData, loadState, saveState, retry } = useGuardedProgress<PlannerConfig>({
    table: "planner_progress",
    columns: "config",
    logTag: "planner",
    defaults: defaultConfig,
    fromRow: (row) => (row?.config ? mergeConfig(row.config) : defaultConfig()),
    toRow: (c) => ({ config: c as any }),
  });
  const setConfig = useCallback(
    (u: PlannerConfig | ((p: PlannerConfig) => PlannerConfig)) => setData(u),
    [setData],
  );
  const status: SaveStatus =
    loadState === "loading" ? "loading" : loadState === "error" ? "error" : saveState;
  return { config, setConfig, status, loadState, retry };
};
