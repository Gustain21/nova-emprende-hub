import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Shared load/save guard for the per-user progress stores of the private apps.
 *
 * Invariants (see AGENTS.md):
 * - Nothing is written until the initial read for the CURRENT user succeeded
 *   ("ready"). A read error, a rejected promise or a pending read keeps the
 *   store blocked; setters are no-ops while blocked.
 * - "No row" is a valid read (new customer) and starts from defaults.
 * - Only user edits made after a valid load are persisted (no automatic
 *   re-write of the loaded or default state).
 * - Responses for an older request / another user are ignored; pending saves
 *   are cancelled on unmount and on user change, and a save is dropped if the
 *   session no longer matches the user it was scheduled for.
 * - Logs never include progress contents.
 */

export type LoadState = "loading" | "ready" | "error";
export type SaveState = "idle" | "saving" | "saved" | "error";

export interface GuardedProgressOptions<T> {
  table: "bitacora_progress" | "guia_progress" | "planner_progress" | "dashboard_fin_progress";
  columns: string;
  defaults: () => T;
  /** Convert an existing row into state. */
  fromRow: (row: any) => T;
  /** Convert state into the columns to upsert (user_id is added). */
  toRow: (state: T) => Record<string, unknown>;
  debounceMs?: number;
  logTag: string;
}

export function useGuardedProgress<T>(opts: GuardedProgressOptions<T>) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const optsRef = useRef(opts);
  optsRef.current = opts;

  const [data, setDataState] = useState<T>(() => opts.defaults());
  // The load result is tagged with the user it belongs to; a result for another
  // user is never exposed (covers the first render after an account change).
  const [load, setLoad] = useState<{ owner: string | null; state: LoadState }>({ owner: null, state: "loading" });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [dirtyTick, setDirtyTick] = useState(0);

  const mountedRef = useRef(true);
  const requestRef = useRef(0);
  const readyForRef = useRef<string | null>(null);
  const currentUserRef = useRef<string | null>(userId);
  const dataRef = useRef<T>(data);
  const timerRef = useRef<number | null>(null);
  // Write serialization: at most one upsert in flight per store; edits made
  // meanwhile are coalesced into a single follow-up write of the latest state.
  const inFlightRef = useRef(false);
  const pendingRef = useRef(false);
  const defaultsRef = useRef<T | null>(null);
  if (defaultsRef.current === null) defaultsRef.current = opts.defaults();
  currentUserRef.current = userId;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, []);

  // Initial load (and retry) for the current user.
  useEffect(() => {
    const reqId = ++requestRef.current;
    readyForRef.current = null;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    pendingRef.current = false;
    const fresh = optsRef.current.defaults();
    dataRef.current = fresh;
    setDataState(fresh);
    setLoad({ owner: userId, state: "loading" });
    setSaveState("idle");
    setSaveError(null);
    if (!userId) return;

    const isCurrent = () =>
      mountedRef.current && requestRef.current === reqId && currentUserRef.current === userId;

    (async () => {
      try {
        const { table, columns, fromRow } = optsRef.current;
        const { data: row, error } = await supabase
          .from(table)
          .select(columns)
          .eq("user_id", userId)
          .maybeSingle();
        if (!isCurrent()) return;
        if (error) throw error;
        const next = row ? fromRow(row) : optsRef.current.defaults();
        dataRef.current = next;
        setDataState(next);
        readyForRef.current = userId;
        setLoad({ owner: userId, state: "ready" });
      } catch (e: any) {
        if (!isCurrent()) return;
        console.error(`[${optsRef.current.logTag}] load failed`, e?.code ?? "", e?.message ?? "");
        setLoad({ owner: userId, state: "error" });
      }
    })();
  }, [userId, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  const setData = useCallback((updater: T | ((prev: T) => T)) => {
    const uid = currentUserRef.current;
    if (!uid || readyForRef.current !== uid) return; // blocked: not validly loaded
    const prev = dataRef.current;
    const next = typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
    if (Object.is(next, prev)) return;
    dataRef.current = next;
    setDataState(next);
    setDirtyTick((t) => t + 1);
  }, []);

  // Writes the latest state; never overlaps with another write of this store.
  const flush = useCallback(async (uid: string, reqId: number): Promise<void> => {
    const stillValid = () =>
      mountedRef.current &&
      requestRef.current === reqId &&
      currentUserRef.current === uid &&
      readyForRef.current === uid;
    if (!stillValid()) return;
    if (inFlightRef.current) {
      pendingRef.current = true; // coalesce: the running write will follow up
      return;
    }
    inFlightRef.current = true;
    pendingRef.current = false;
    let failed = false;
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!stillValid()) return;
      if (authError || authData?.user?.id !== uid) {
        failed = true;
        setSaveError("Tu sesión ha caducado. Vuelve a iniciar sesión.");
        setSaveState("error");
        return;
      }
      const { table, toRow } = optsRef.current;
      const { error } = await supabase
        .from(table)
        .upsert({ user_id: uid, ...toRow(dataRef.current) } as any, { onConflict: "user_id" });
      if (error) throw error;
    } catch (e: any) {
      failed = true;
      if (stillValid()) {
        console.error(`[${optsRef.current.logTag}] save failed`, e?.code ?? "", e?.message ?? "");
        setSaveError(e?.message ?? "Error desconocido");
        setSaveState("error");
      }
    } finally {
      inFlightRef.current = false;
    }
    if (!stillValid()) return;
    // An edit arrived while writing: write the latest state once (also after an
    // error, since it is a newer user edit — never an automatic retry loop).
    if (pendingRef.current) {
      void flush(uid, reqId);
      return;
    }
    if (!failed) setSaveState("saved");
  }, []);

  // Debounced save, only after a user edit on a validly loaded store.
  useEffect(() => {
    if (dirtyTick === 0) return;
    const uid = currentUserRef.current;
    if (!uid || readyForRef.current !== uid) return;
    const reqId = requestRef.current;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setSaveState("saving");
    setSaveError(null);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      void flush(uid, reqId);
    }, optsRef.current.debounceMs ?? 700);
  }, [dirtyTick, flush]);

  // Warn on unload while a save is pending.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (saveState === "saving") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [saveState]);

  const owned = userId !== null && load.owner === userId;
  const loadState: LoadState = owned ? load.state : "loading";
  const visibleData = owned ? data : (defaultsRef.current as T);
  return {
    data: visibleData,
    setData,
    loadState,
    saveState: owned ? saveState : "idle",
    saveError: owned ? saveError : null,
    retry,
    ready: loadState === "ready",
  };
}
