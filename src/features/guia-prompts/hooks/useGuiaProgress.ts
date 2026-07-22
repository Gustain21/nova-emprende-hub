import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface State {
  favorites: string[];
  completed: string[];
}

const EMPTY: State = { favorites: [], completed: [] };

export const useGuiaProgress = () => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [state, setState] = useState<State>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const saveTimer = useRef<number | null>(null);

  // Initial load
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("guia_progress")
        .select("favorites, completed")
        .eq("user_id", userId)
        .maybeSingle();
      if (cancelled) return;
      if (!error && data) {
        setState({
          favorites: Array.isArray(data.favorites) ? (data.favorites as string[]) : [],
          completed: Array.isArray(data.completed) ? (data.completed as string[]) : [],
        });
      }
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Debounced upsert after initial load
  useEffect(() => {
    if (!userId || !loaded) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    setStatus("saving");
    saveTimer.current = window.setTimeout(async () => {
      const { error } = await supabase
        .from("guia_progress")
        .upsert(
          { user_id: userId, favorites: state.favorites, completed: state.completed },
          { onConflict: "user_id" },
        );
      setStatus(error ? "error" : "saved");
      if (error) console.error("[guia_progress] save", error);
    }, 600);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [userId, loaded, state]);

  const toggleFavorite = useCallback((slug: string) => {
    setState((s) => {
      const has = s.favorites.includes(slug);
      return { ...s, favorites: has ? s.favorites.filter((x) => x !== slug) : [...s.favorites, slug] };
    });
  }, []);

  const toggleCompleted = useCallback((slug: string) => {
    setState((s) => {
      const has = s.completed.includes(slug);
      return { ...s, completed: has ? s.completed.filter((x) => x !== slug) : [...s.completed, slug] };
    });
  }, []);

  return {
    favorites: state.favorites,
    completed: state.completed,
    loaded,
    status,
    toggleFavorite,
    toggleCompleted,
    isFavorite: (slug: string) => state.favorites.includes(slug),
    isCompleted: (slug: string) => state.completed.includes(slug),
  };
};
