/**
 * Regression tests: the four private apps must never overwrite saved progress
 * when their initial load fails, is pending, is stale or belongs to another session.
 * Supabase and auth are fully mocked; no network.
 */
import React, { Fragment } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

type Read = () => Promise<{ data: any; error: any }>;
const h = vi.hoisted(() => ({
  user: { id: "u1" } as { id: string } | null,
  authUser: "u1" as string | null,
  reads: [] as Array<() => Promise<{ data: any; error: any }>>,
  readDefault: (() => Promise.resolve({ data: null, error: null })) as () => Promise<{ data: any; error: any }>,
  upserts: [] as Array<{ table: string; row: any }>,
  /** Optional per-call upsert result (lets a test defer or fail a write). */
  upsertImpl: null as null | ((row: any) => Promise<{ error: any }>),
  /** Rows in the order the mocked server committed them. */
  committed: [] as any[],
}));

vi.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ user: h.user }) }));
vi.mock("@/hooks/usePurchases", () => ({ usePurchases: () => ({ owns: () => true, loading: false }) }));
vi.mock("@/components/app/PurchaseGate", () => ({ default: ({ children }: any) => <>{children}</> }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: async () => ({ data: { user: h.authUser ? { id: h.authUser } : null }, error: null }),
    },
    from: (table: string) => ({
      select: () => ({ eq: () => ({ maybeSingle: () => (h.reads.shift() ?? h.readDefault)() }) }),
      upsert: (row: any) => {
        h.upserts.push({ table, row });
        const base = h.upsertImpl ? h.upsertImpl(row) : Promise.resolve({ error: null });
        const p = base.then((r) => {
          if (!r.error) h.committed.push(row);
          return r;
        });
        return Object.assign(p, {
          select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }),
        });
      },
    }),
  },
}));

import * as bitacoraMod from "@/features/bitacora/hooks/useBitacoraProgress";
import * as plannerMod from "@/features/planner-90/hooks/usePlannerProgress";
import * as guiaMod from "@/features/guia-prompts/hooks/useGuiaProgress";
import * as finMod from "@/features/dashboard-financiero/contexts/FinancialContext";

const wait = (ms: number) => act(() => new Promise((r) => setTimeout(r, ms)));
const AFTER_DEBOUNCE = 900;
const fail: Read = () => Promise.resolve({ data: null, error: { message: "boom", code: "500" } });
const reject: Read = () => Promise.reject(new Error("network down"));
const pending: Read = () => new Promise(() => {});
const ok = (row: any): Read => () => Promise.resolve({ data: row, error: null });

interface Adapter {
  name: string;
  table: string;
  hook: () => any;
  wrapper: React.FC<{ children: React.ReactNode }>;
  row: any;
  edit: (r: any) => void;
  hasPrevious: (r: any) => boolean;
  rowKeepsPrevious: (row: any) => boolean;
}

const GuiaWrapper = ((guiaMod as any).GuiaProgressProvider ?? Fragment) as React.FC<{ children: React.ReactNode }>;
const FinWrapper = finMod.FinancialProvider as React.FC<{ children: React.ReactNode }>;

const adapters: Adapter[] = [
  {
    name: "Bitácora",
    table: "bitacora_progress",
    hook: () => bitacoraMod.useBitacoraProgress(),
    wrapper: Fragment as any,
    row: { responses: { "d1-q1": "previo" }, current_day: 5, current_view: "day", progress: 16 },
    edit: (r) => r.setAnswer("d2-q1", "nuevo"),
    hasPrevious: (r) => r.answers["d1-q1"] === "previo" && r.currentDay === 5,
    rowKeepsPrevious: (row) => row.responses?.["d1-q1"] === "previo" && row.current_day === 5,
  },
  {
    name: "Guía de Prompts",
    table: "guia_progress",
    hook: () => guiaMod.useGuiaProgress(),
    wrapper: GuiaWrapper,
    row: { favorites: ["m1"], completed: ["m3"] },
    edit: (r) => r.toggleFavorite("m2"),
    hasPrevious: (r) => r.favorites.includes("m1") && r.completed.includes("m3"),
    rowKeepsPrevious: (row) => row.favorites?.includes("m1") && row.completed?.includes("m3"),
  },
  {
    name: "Planner",
    table: "planner_progress",
    hook: () => plannerMod.usePlannerProgress(),
    wrapper: Fragment as any,
    row: { config: { goals: { revenue: "1000", profit: "", cash: "" } } },
    edit: (r) => r.setConfig((c: any) => ({ ...c, goals: { ...c.goals, profit: "5" } })),
    hasPrevious: (r) => r.config.goals.revenue === "1000",
    rowKeepsPrevious: (row) => row.config?.goals?.revenue === "1000",
  },
  {
    name: "Dashboard Financiero",
    table: "dashboard_fin_progress",
    hook: () => finMod.useFinancial(),
    wrapper: FinWrapper,
    row: { config: { assumptions: { projectName: "Proyecto previo" }, financing: { interestRate: 9 } } },
    edit: (r) => r.updateFinancing({ loanAmount: 1234 }),
    hasPrevious: (r) => r.assumptions.projectName === "Proyecto previo" && r.financing.interestRate === 9,
    rowKeepsPrevious: (row) =>
      row.config?.assumptions?.projectName === "Proyecto previo" && row.config?.financing?.interestRate === 9,
  },
];

beforeEach(() => {
  h.user = { id: "u1" };
  h.authUser = "u1";
  h.reads = [];
  h.readDefault = () => Promise.resolve({ data: null, error: null });
  h.upserts = [];
  h.upsertImpl = null;
  h.committed = [];
});

describe.each(adapters)("$name: guarded progress", (a) => {
  const mount = () => renderHook(() => a.hook(), { wrapper: a.wrapper });
  const tryEdit = (r: any) => act(() => a.edit(r.current));

  it("failed read (returned error) => 0 writes, even after editing", async () => {
    h.reads = [fail];
    const { result } = mount();
    await wait(50);
    tryEdit(result);
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(0);
  });

  it("failed read (rejected promise) => 0 writes, even after editing", async () => {
    h.reads = [reject];
    const { result } = mount();
    await wait(50);
    tryEdit(result);
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(0);
    expect(result.current.loadState).toBe("error");
  });

  it("pending read => 0 writes and stays loading", async () => {
    h.reads = [pending];
    const { result } = mount();
    tryEdit(result);
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(0);
    expect(result.current.loadState).toBe("loading");
  });

  it("retry after failure recovers previous data and then saves without blanks", async () => {
    h.reads = [fail, ok(a.row)];
    const { result } = mount();
    await waitFor(() => expect(result.current.loadState).toBe("error"));
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    expect(a.hasPrevious(result.current)).toBe(true);
    tryEdit(result);
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(1);
    expect(h.upserts[0].row.user_id).toBe("u1");
    expect(a.rowKeepsPrevious(h.upserts[0].row)).toBe(true);
  });

  it("retry that fails again => still blocked, 0 writes", async () => {
    h.reads = [fail, reject];
    const { result } = mount();
    await waitFor(() => expect(result.current.loadState).toBe("error"));
    act(() => result.current.retry());
    await wait(50);
    expect(result.current.loadState).toBe("error");
    tryEdit(result);
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(0);
  });

  it("valid load + edit keeps previous data in the single write", async () => {
    h.reads = [ok(a.row)];
    const { result } = mount();
    await waitFor(() => expect(a.hasPrevious(result.current)).toBe(true));
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(0); // no automatic re-write after load
    tryEdit(result);
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(1);
    expect(h.upserts[0].table).toBe(a.table);
    expect(a.rowKeepsPrevious(h.upserts[0].row)).toBe(true);
  });

  it("no existing row is a valid load for a new customer", async () => {
    h.reads = [ok(null)];
    const { result } = mount();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    tryEdit(result);
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(1);
    expect(h.upserts[0].row.user_id).toBe("u1");
  });

  it("unmount before the debounce fires => no late write", async () => {
    h.reads = [ok(a.row)];
    const { result, unmount } = mount();
    await waitFor(() => expect(a.hasPrevious(result.current)).toBe(true));
    tryEdit(result);
    unmount();
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(0);
  });

  it("session change before the debounce => nothing written to either account", async () => {
    h.reads = [ok(a.row), pending];
    const { result, rerender } = mount();
    await waitFor(() => expect(a.hasPrevious(result.current)).toBe(true));
    tryEdit(result);
    h.user = { id: "u2" };
    h.authUser = "u2";
    rerender();
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(0);
    expect(a.hasPrevious(result.current)).toBe(false);
  });

  it("stale response from the previous account is ignored", async () => {
    let resolveOld: (v: any) => void = () => {};
    h.reads = [() => new Promise((r) => (resolveOld = r)), ok(null)];
    const { result, rerender } = mount();
    h.user = { id: "u2" };
    h.authUser = "u2";
    rerender();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    await act(async () => resolveOld({ data: a.row, error: null }));
    await wait(20);
    expect(a.hasPrevious(result.current)).toBe(false);
    tryEdit(result);
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(1);
    expect(h.upserts[0].row.user_id).toBe("u2");
    expect(a.rowKeepsPrevious(h.upserts[0].row)).toBe(false);
  });

  it("signed out => blocked, 0 writes", async () => {
    h.user = null;
    h.authUser = null;
    const { result } = mount();
    tryEdit(result);
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(0);
  });
});

describe("Guía de Prompts: one shared store for shell, index and module", () => {
  it("all consumers see the same state and only one write happens", async () => {
    h.readDefault = ok({ favorites: ["m1"], completed: [] });
    let reads = 0;
    const base = h.readDefault;
    h.readDefault = () => { reads++; return base(); };
    const { result } = renderHook(
      () => ({ shell: guiaMod.useGuiaProgress(), index: guiaMod.useGuiaProgress(), modulo: guiaMod.useGuiaProgress() }),
      { wrapper: GuiaWrapper },
    );
    await waitFor(() => expect(result.current.index.favorites).toContain("m1"));
    act(() => result.current.modulo.toggleCompleted("m4"));
    expect(result.current.index.completed).toContain("m4");
    expect(result.current.shell.completed).toContain("m4");
    await wait(AFTER_DEBOUNCE);
    expect(reads).toBe(1);
    expect(h.upserts).toHaveLength(1);
    expect(h.upserts[0].row.favorites).toEqual(["m1"]);
    expect(h.upserts[0].row.completed).toEqual(["m4"]);
  });

  it("retry from the shell controls the progress the index edits", async () => {
    h.reads = [fail, ok({ favorites: ["m1"], completed: [] })];
    const { result } = renderHook(
      () => ({ shell: guiaMod.useGuiaProgress(), index: guiaMod.useGuiaProgress() }),
      { wrapper: GuiaWrapper },
    );
    await waitFor(() => expect(result.current.shell.loadState).toBe("error"));
    act(() => result.current.index.toggleFavorite("m2"));
    act(() => result.current.shell.retry());
    await waitFor(() => expect(result.current.index.loadState).toBe("ready"));
    expect(result.current.index.favorites).toEqual(["m1"]);
  });
});

describe("Load error UI with Reintentar", () => {
  const pages: Array<[string, () => Promise<any>, string]> = [
    ["Bitácora", () => import("@/pages/app/Bitacora"), "/clientes/herramientas/bitacora"],
    ["Guía", () => import("@/pages/app/GuiaPrompts"), "/clientes/herramientas/guia-de-prompts"],
    ["Planner", () => import("@/pages/app/Planner"), "/clientes/herramientas/planner"],
    ["Dashboard", () => import("@/pages/app/DashboardFinanciero"), "/clientes/herramientas/dashboard"],
  ];

  it.each(pages)("%s: blocks editing on failure, retry restores it, failed retry stays blocked", async (_n, load, path) => {
    const Page = (await load()).default;
    h.reads = [fail, reject, ok(null)];
    render(
      <MemoryRouter initialEntries={[path]}>
        <Page />
      </MemoryRouter>,
    );
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("No hemos podido cargar tu progreso");
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: /reintentar/i }));
    await wait(50);
    expect(screen.getByRole("alert")).toBeInTheDocument(); // second failure
    fireEvent.click(screen.getByRole("button", { name: /reintentar/i }));
    await waitFor(() => expect(screen.queryByText("No hemos podido cargar tu progreso")).not.toBeInTheDocument());
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Write ordering, write errors and immediate gating on account change.
// ---------------------------------------------------------------------------
const deferred = () => {
  let resolve!: (v: { error: any }) => void;
  const promise = new Promise<{ error: any }>((r) => (resolve = r));
  return { promise, resolve };
};

describe.each(adapters)("$name: write ordering and account gating", (a) => {
  const mount = () => renderHook(() => a.hook(), { wrapper: a.wrapper });

  it("slow write + later edit: writes never overlap and the newest state is committed last", async () => {
    h.reads = [ok(a.row)];
    const gates: Array<ReturnType<typeof deferred>> = [];
    let inFlight = 0;
    let maxInFlight = 0;
    h.upsertImpl = () => {
      const d = deferred();
      gates.push(d);
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      return d.promise.then((r) => { inFlight--; return r; });
    };
    const { result } = mount();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    act(() => a.edit(result.current)); // edit #1
    await wait(AFTER_DEBOUNCE); // write #1 in flight (not resolved)
    expect(h.upserts).toHaveLength(1);
    const first = h.upserts[0].row;
    act(() => a.edit(result.current)); // edit #2 (toggles / changes again)
    await wait(AFTER_DEBOUNCE);
    // Resolve whatever is in flight, newest first, to provoke reordering.
    for (let i = gates.length - 1; i >= 0; i--) await act(async () => gates[i].resolve({ error: null }));
    await wait(50);
    for (let i = 0; i < gates.length; i++) await act(async () => gates[i].resolve({ error: null }));
    await wait(AFTER_DEBOUNCE);
    for (const g of gates) await act(async () => g.resolve({ error: null }));
    await wait(50);
    expect(maxInFlight).toBe(1);
    expect(h.upserts.length).toBe(2);
    const last = h.committed[h.committed.length - 1];
    expect(last).not.toBe(first);
    expect(last).toBe(h.upserts[h.upserts.length - 1].row);
    expect(a.rowKeepsPrevious(last)).toBe(true);
    expect(result.current.saveState ?? result.current.saveStatus ?? result.current.status).toBe("saved");
  });

  it("several edits during a slow write are coalesced into one follow-up write", async () => {
    h.reads = [ok(a.row)];
    const gates: Array<ReturnType<typeof deferred>> = [];
    h.upsertImpl = () => { const d = deferred(); gates.push(d); return d.promise; };
    const { result } = mount();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    act(() => a.edit(result.current));
    await wait(AFTER_DEBOUNCE);
    for (let i = 0; i < 3; i++) { act(() => a.edit(result.current)); await wait(AFTER_DEBOUNCE); }
    expect(h.upserts).toHaveLength(1);
    await act(async () => gates[0].resolve({ error: null }));
    await wait(50);
    expect(h.upserts).toHaveLength(2);
    await act(async () => gates[1].resolve({ error: null }));
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(2);
  });

  it("write error shows error, no automatic retry; a later edit saves again", async () => {
    h.reads = [ok(a.row)];
    let calls = 0;
    h.upsertImpl = () => Promise.resolve({ error: calls++ === 0 ? { message: "write failed", code: "500" } : null });
    const { result } = mount();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    const status = () => result.current.saveState ?? result.current.saveStatus ?? result.current.status;
    act(() => a.edit(result.current));
    await wait(AFTER_DEBOUNCE);
    expect(status()).toBe("error");
    await wait(AFTER_DEBOUNCE * 2);
    expect(h.upserts).toHaveLength(1); // no retry loop
    act(() => a.edit(result.current));
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(2);
    expect(status()).toBe("saved");
    expect(a.rowKeepsPrevious(h.committed[0])).toBe(true);
  });

  it("account change while a write is in flight: no follow-up write, new account not marked saved", async () => {
    h.reads = [ok(a.row), ok(null)];
    const gates: Array<ReturnType<typeof deferred>> = [];
    h.upsertImpl = () => { const d = deferred(); gates.push(d); return d.promise; };
    const { result, rerender } = mount();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    act(() => a.edit(result.current));
    await wait(AFTER_DEBOUNCE);
    act(() => a.edit(result.current)); // pending edit queued behind the in-flight write
    await wait(AFTER_DEBOUNCE);
    h.user = { id: "u2" };
    h.authUser = "u2";
    rerender();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    await act(async () => gates[0].resolve({ error: null }));
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(1);
    expect(h.upserts.every((u) => u.row.user_id === "u1")).toBe(true);
    const status = result.current.saveState ?? result.current.saveStatus ?? result.current.status;
    expect(status).not.toBe("saved");
    expect(a.hasPrevious(result.current)).toBe(false);
  });

  it("logout while a write is pending in the debounce: nothing written", async () => {
    h.reads = [ok(a.row)];
    const { result, rerender } = mount();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    act(() => a.edit(result.current));
    h.user = null;
    h.authUser = null;
    rerender();
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(0);
    expect(result.current.loadState).toBe("loading");
  });

  it("the very first render after an account change is already gated (no previous data shown)", async () => {
    h.reads = [ok(a.row), pending];
    const seen: Array<{ uid: string | null; loadState: string; prev: boolean }> = [];
    const { result, rerender } = renderHook(
      () => {
        const r = a.hook();
        seen.push({ uid: h.user?.id ?? null, loadState: r.loadState, prev: a.hasPrevious(r) });
        return r;
      },
      { wrapper: a.wrapper },
    );
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    seen.length = 0;
    h.user = { id: "u2" };
    h.authUser = "u2";
    rerender();
    const u2 = seen.filter((s) => s.uid === "u2");
    expect(u2.length).toBeGreaterThan(0);
    expect(u2.some((s) => s.loadState === "ready")).toBe(false);
    expect(u2.some((s) => s.prev)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Queued work must survive the end of a write that belongs to an old session.
// ---------------------------------------------------------------------------
describe.each(adapters)("$name: queue drained across sessions", (a) => {
  const mount = () => renderHook(() => a.hook(), { wrapper: a.wrapper });
  const status = (r: any) => r.saveState ?? r.saveStatus ?? r.status;
  const slowWrites = () => {
    const gates: Array<ReturnType<typeof deferred>> = [];
    h.upsertImpl = () => { const d = deferred(); gates.push(d); return d.promise; };
    return gates;
  };

  it("A write in flight, switch to B, B edits: after A resolves, B's edit is saved automatically", async () => {
    h.reads = [ok(a.row), ok(null)];
    const gates = slowWrites();
    const { result, rerender } = mount();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    act(() => a.edit(result.current));
    await wait(AFTER_DEBOUNCE); // A in flight
    h.user = { id: "u2" };
    h.authUser = "u2";
    rerender();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    act(() => a.edit(result.current));
    await wait(AFTER_DEBOUNCE); // B queued behind A
    expect(h.upserts).toHaveLength(1);
    await act(async () => gates[0].resolve({ error: null }));
    await wait(50);
    expect(h.upserts).toHaveLength(2); // no extra edit needed
    const b = h.upserts[1].row;
    expect(b.user_id).toBe("u2");
    expect(a.rowKeepsPrevious(b)).toBe(false); // B's own data, not A's
    await act(async () => gates[1].resolve({ error: null }));
    await wait(50);
    expect(h.committed[h.committed.length - 1]).toBe(b);
    expect(status(result.current)).toBe("saved");
  });

  it("A write in flight, logout: nothing else is written when A resolves", async () => {
    h.reads = [ok(a.row)];
    const gates = slowWrites();
    const { result, rerender } = mount();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    act(() => a.edit(result.current));
    await wait(AFTER_DEBOUNCE);
    act(() => a.edit(result.current)); // queued for A
    await wait(AFTER_DEBOUNCE);
    h.user = null;
    h.authUser = null;
    rerender();
    await act(async () => gates[0].resolve({ error: null }));
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(1);
  });

  it("A -> B -> A while the old A write resolves: B's queue is dropped, the new A edit is saved", async () => {
    h.reads = [ok(a.row), ok(null), ok(a.row)];
    const gates = slowWrites();
    const { result, rerender } = mount();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    act(() => a.edit(result.current));
    await wait(AFTER_DEBOUNCE); // old A in flight
    h.user = { id: "u2" }; h.authUser = "u2"; rerender();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    act(() => a.edit(result.current));
    await wait(AFTER_DEBOUNCE); // B queued
    h.user = { id: "u1" }; h.authUser = "u1"; rerender();
    await waitFor(() => expect(a.hasPrevious(result.current)).toBe(true));
    act(() => a.edit(result.current));
    await wait(AFTER_DEBOUNCE); // new A queued
    await act(async () => gates[0].resolve({ error: null }));
    await wait(50);
    expect(h.upserts).toHaveLength(2);
    expect(h.upserts.some((u) => u.row.user_id === "u2")).toBe(false);
    expect(h.upserts[1].row.user_id).toBe("u1");
    expect(a.rowKeepsPrevious(h.upserts[1].row)).toBe(true);
    await act(async () => gates[1].resolve({ error: null }));
    await wait(50);
    expect(status(result.current)).toBe("saved");
  });

  it("an older write finishing while a newer edit waits in debounce does not mark 'saved'", async () => {
    h.reads = [ok(a.row)];
    const gates = slowWrites();
    const { result } = mount();
    await waitFor(() => expect(result.current.loadState).toBe("ready"));
    act(() => a.edit(result.current));
    await wait(AFTER_DEBOUNCE); // write #1 in flight
    act(() => a.edit(result.current)); // edit #2, debounce not yet fired
    await act(async () => gates[0].resolve({ error: null }));
    await wait(20);
    expect(status(result.current)).toBe("saving");
    await wait(AFTER_DEBOUNCE);
    expect(h.upserts).toHaveLength(2);
    expect(status(result.current)).toBe("saving");
    await act(async () => gates[1].resolve({ error: null }));
    await wait(20);
    expect(status(result.current)).toBe("saved");
  });
});
