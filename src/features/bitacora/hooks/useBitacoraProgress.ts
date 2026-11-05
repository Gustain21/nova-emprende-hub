import { useCallback } from "react";
import { useGuardedProgress } from "@/lib/progress/useGuardedProgress";

export type BitacoraView = "cover" | "intro" | "day" | "conclusion";
export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface BitacoraState {
  answers: Record<string, string>;
  currentDay: number;
  currentView: BitacoraView;
  progress: number;
}

const DEFAULT_STATE = (): BitacoraState => ({
  answers: {},
  currentDay: 1,
  currentView: "cover",
  progress: 0,
});

export const useBitacoraProgress = () => {
  const { data: state, setData: setState, loadState, saveState, saveError, retry } =
    useGuardedProgress<BitacoraState>({
      table: "bitacora_progress",
      columns: "*",
      logTag: "bitacora",
      defaults: DEFAULT_STATE,
      fromRow: (data) => ({
        answers: (data.responses as Record<string, string>) ?? {},
        currentDay: data.current_day ?? 1,
        currentView: (data.current_view as BitacoraView) ?? "cover",
        progress: Number.isFinite(Number(data.progress)) ? Number(data.progress) : 0,
      }),
      toRow: (s) => ({
        responses: s.answers ?? {},
        current_day: Number.isInteger(s.currentDay) ? s.currentDay : null,
        current_view: s.currentView ?? null,
        progress: Number.isFinite(s.progress) ? s.progress : 0,
        updated_at: new Date().toISOString(),
      }),
    });

  const setAnswer = useCallback((fieldId: string, value: string) => {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, [fieldId]: value } }));
  }, [setState]);

  const setCurrentDay = useCallback((day: number) => {
    setState((prev) => ({
      ...prev,
      currentDay: day,
      progress: Number.isInteger(day) ? Math.min(100, Math.max(0, (day / 30) * 100)) : prev.progress,
    }));
  }, [setState]);

  const setCurrentView = useCallback((view: BitacoraView) => {
    setState((prev) => ({ ...prev, currentView: view }));
  }, [setState]);

  return {
    loading: loadState === "loading",
    loadState,
    retry,
    saveStatus: saveState as SaveStatus,
    saveError,
    answers: state.answers,
    currentDay: state.currentDay,
    currentView: state.currentView,
    setAnswer,
    setCurrentDay,
    setCurrentView,
  };
};
