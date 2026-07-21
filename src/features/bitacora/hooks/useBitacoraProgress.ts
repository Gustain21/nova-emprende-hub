import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type BitacoraView = "cover" | "intro" | "day" | "conclusion";
export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface BitacoraState {
  answers: Record<string, string>;
  currentDay: number;
  currentView: BitacoraView;
  progress: number;
}

const DEFAULT_STATE: BitacoraState = {
  answers: {},
  currentDay: 1,
  currentView: "cover",
  progress: 0,
};

export const useBitacoraProgress = () => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [state, setState] = useState<BitacoraState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);
  const loadedUserRef = useRef<string | null>(null);

  // Load initial progress once we have an authenticated user.
  useEffect(() => {
    if (!userId) {
      // Wait for auth. Keep loading = true so save is blocked.
      return;
    }
    if (loadedUserRef.current === userId) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setIsInitialLoadComplete(false);
      console.log("[bitacora] loading progress for user", userId);
      const { data, error } = await supabase
        .from("bitacora_progress")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error("[bitacora] load error", error);
      }
      if (data) {
        console.log("[bitacora] progress recovered", data);
        setState({
          answers: (data.responses as Record<string, string>) ?? {},
          currentDay: data.current_day ?? 1,
          currentView: (data.current_view as BitacoraView) ?? "cover",
          progress: Number.isFinite(Number(data.progress)) ? Number(data.progress) : 0,
        });
      } else {
        console.log("[bitacora] no previous progress");
      }
      loadedUserRef.current = userId;
      setLoading(false);
      setIsInitialLoadComplete(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Debounced save — only after initial load is complete.
  useEffect(() => {
    if (!userId || !isInitialLoadComplete) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    setSaveError(null);
    debounceRef.current = window.setTimeout(async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      console.log("BITACORA AUTH USER:", authData.user?.id);
      if (authError || !authData.user?.id || authData.user.id !== userId) {
        setSaveError("Tu sesión ha caducado. Vuelve a iniciar sesión.");
        setSaveStatus("error");
        return;
      }

      const normalizedProgress = Number.isFinite(state.progress)
        ? state.progress
        : 0;
      const payload = {
        user_id: authData.user.id,
        responses: state.answers ?? {},
        current_day: Number.isInteger(state.currentDay) ? state.currentDay : null,
        current_view: state.currentView ?? null,
        progress: normalizedProgress,
        updated_at: new Date().toISOString(),
      };
      console.log("[bitacora] upsert payload", payload);
      const { error } = await supabase
        .from("bitacora_progress")
        .upsert(payload, { onConflict: "user_id" })
        .select()
        .single();
      if (error) {
        console.error("BITACORA SAVE ERROR FULL:", {
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          code: error?.code,
        });
        setSaveError(error.message);
        setSaveStatus("error");
      } else {
        console.log("[bitacora] saved at", new Date().toISOString());
        setSaveError(null);
        setSaveStatus("saved");
      }
    }, 700);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [state, userId, isInitialLoadComplete]);

  // Warn on unload while saving
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (saveStatus === "saving") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [saveStatus]);

  const setAnswer = useCallback((fieldId: string, value: string) => {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, [fieldId]: value } }));
  }, []);

  const setCurrentDay = useCallback((day: number) => {
    setState((prev) => ({
      ...prev,
      currentDay: day,
      progress: Number.isInteger(day) ? Math.min(100, Math.max(0, (day / 30) * 100)) : prev.progress,
    }));
  }, []);

  const setCurrentView = useCallback((view: BitacoraView) => {
    setState((prev) => ({ ...prev, currentView: view }));
  }, []);

  return {
    loading,
    saveStatus,
    saveError,
    answers: state.answers,
    currentDay: state.currentDay,
    currentView: state.currentView,
    setAnswer,
    setCurrentDay,
    setCurrentView,
  };
};
