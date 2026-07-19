import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type BitacoraView = "cover" | "intro" | "day" | "conclusion";
export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface BitacoraState {
  answers: Record<string, string>;
  currentDay: number;
  currentView: BitacoraView;
}

const DEFAULT_STATE: BitacoraState = {
  answers: {},
  currentDay: 1,
  currentView: "cover",
};

export const useBitacoraProgress = () => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [state, setState] = useState<BitacoraState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
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
        .select("answers, current_day, current_view")
        .eq("user_id", userId)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error("[bitacora] load error", error);
      }
      if (data) {
        console.log("[bitacora] progress recovered", data);
        setState({
          answers: (data.answers as Record<string, string>) ?? {},
          currentDay: data.current_day ?? 1,
          currentView: (data.current_view as BitacoraView) ?? "cover",
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
    debounceRef.current = window.setTimeout(async () => {
      const payload = {
        user_id: userId,
        answers: state.answers,
        current_day: state.currentDay,
        current_view: state.currentView,
      };
      console.log("[bitacora] upsert payload", payload);
      const { error } = await supabase
        .from("bitacora_progress")
        .upsert(payload, { onConflict: "user_id" });
      if (error) {
        console.error("[bitacora] save error", error);
        setSaveStatus("error");
      } else {
        console.log("[bitacora] saved at", new Date().toISOString());
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
    setState((prev) => ({ ...prev, currentDay: day }));
  }, []);

  const setCurrentView = useCallback((view: BitacoraView) => {
    setState((prev) => ({ ...prev, currentView: view }));
  }, []);

  return {
    loading,
    saveStatus,
    answers: state.answers,
    currentDay: state.currentDay,
    currentView: state.currentView,
    setAnswer,
    setCurrentDay,
    setCurrentView,
  };
};
