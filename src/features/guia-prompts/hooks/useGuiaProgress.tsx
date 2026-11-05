import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useGuardedProgress, type LoadState } from "@/lib/progress/useGuardedProgress";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface State {
  favorites: string[];
  completed: string[];
}

const EMPTY = (): State => ({ favorites: [], completed: [] });

const useGuiaProgressStore = () => {
  const { data: state, setData: setState, loadState, saveState, retry } = useGuardedProgress<State>({
    table: "guia_progress",
    columns: "favorites, completed",
    logTag: "guia_progress",
    debounceMs: 600,
    defaults: EMPTY,
    fromRow: (data) => ({
      favorites: Array.isArray(data.favorites) ? (data.favorites as string[]) : [],
      completed: Array.isArray(data.completed) ? (data.completed as string[]) : [],
    }),
    toRow: (s) => ({ favorites: s.favorites, completed: s.completed }),
  });

  const toggleFavorite = useCallback((slug: string) => {
    setState((s) => {
      const has = s.favorites.includes(slug);
      return { ...s, favorites: has ? s.favorites.filter((x) => x !== slug) : [...s.favorites, slug] };
    });
  }, [setState]);

  const toggleCompleted = useCallback((slug: string) => {
    setState((s) => {
      const has = s.completed.includes(slug);
      return { ...s, completed: has ? s.completed.filter((x) => x !== slug) : [...s.completed, slug] };
    });
  }, [setState]);

  return {
    favorites: state.favorites,
    completed: state.completed,
    loaded: loadState === "ready",
    loadState: loadState as LoadState,
    retry,
    status: saveState as SaveStatus,
    toggleFavorite,
    toggleCompleted,
    isFavorite: (slug: string) => state.favorites.includes(slug),
    isCompleted: (slug: string) => state.completed.includes(slug),
  };
};

type GuiaProgress = ReturnType<typeof useGuiaProgressStore>;
const GuiaProgressContext = createContext<GuiaProgress | null>(null);

/** Single progress store shared by GuiaInner, GuiaIndex and GuiaModulo. */
export const GuiaProgressProvider = ({ children }: { children: ReactNode }) => {
  const value = useGuiaProgressStore();
  return <GuiaProgressContext.Provider value={value}>{children}</GuiaProgressContext.Provider>;
};

export const useGuiaProgress = (): GuiaProgress => {
  const ctx = useContext(GuiaProgressContext);
  if (!ctx) throw new Error("useGuiaProgress debe usarse dentro de <GuiaProgressProvider>");
  return ctx;
};
