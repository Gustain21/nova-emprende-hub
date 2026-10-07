import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { handlePaddleEvent, type Deps } from "./handler.ts";

const mk = (over: Partial<Record<string, any>> = {}) => {
  const calls: { fn: string; args: any }[] = [];
  const deps: Deps = {
    rpc: async (fn, args) => {
      calls.push({ fn, args });
      if (over[fn]) return over[fn](args);
      if (fn === "find_auth_user_id_by_email") return { data: "user-1", error: null };
      if (fn === "record_paddle_payment")
        return { data: [{ purchase_id: "pur-1", purchase_status: "paid", purchase_user_id: "user-1", purchase_product_id: "prod-1", granted: true }], error: null };
      return { data: null, error: null };
    },
    findProductIdBySlug: async () => "prod-1",
  };
  return { deps, calls };
};

const paid = (type = "transaction.paid") => ({
  event_type: type,
  data: { id: "txn_1", currency_code: "USD", details: { totals: { total: "5599" } },
    custom_data: { product_slug: "pack-impulso", buyer_email: "A@B.com" } },
});

Deno.test("pago: usuario por RPC, importe convertido, atribución saneada, sin grant separado", async () => {
  const { deps, calls } = mk();
  const ev = paid();
  (ev.data.custom_data as any).origen = "diagnostico-big-bang";
  (ev.data.custom_data as any).utm_source = "a@b.com"; // PII => descartado
  const res = await handlePaddleEvent(ev, deps);
  const rec = calls.find((c) => c.fn === "record_paddle_payment")!;
  assertEquals(rec.args.p_amount, 55.99);
  assertEquals(rec.args.p_email, "a@b.com");
  assertEquals(rec.args.p_user_id, "user-1");
  assertEquals(rec.args.p_attribution, { origen: "diagnostico-big-bang" });
  assertEquals(calls.some((c) => c.fn === "grant_purchase_entitlements"), false);
  assertEquals(res.granted, true);
});

Deno.test("sin producto => dead-letter persistido (no se pierde)", async () => {
  const { deps, calls } = mk();
  deps.findProductIdBySlug = async () => null;
  const res = await handlePaddleEvent(paid(), deps);
  assertEquals(calls.some((c) => c.fn === "record_paddle_deadletter"), true);
  assertEquals(res.deadletter, "missing_product");
});

Deno.test("sin producto y fallo al guardar dead-letter => lanza (500)", async () => {
  const { deps } = mk({ record_paddle_deadletter: () => ({ data: null, error: { message: "x" } }) });
  deps.findProductIdBySlug = async () => null;
  await assertRejects(() => handlePaddleEvent(paid(), deps));
});

Deno.test("duplicado paid+completed usa el mismo registro idempotente", async () => {
  const { deps, calls } = mk();
  await handlePaddleEvent(paid(), deps);
  await handlePaddleEvent(paid("transaction.completed"), deps);
  const recs = calls.filter((c) => c.fn === "record_paddle_payment");
  assertEquals(recs.length, 2);
  assertEquals(recs[0].args.p_transaction_id, recs[1].args.p_transaction_id);
});

Deno.test("fallo BD en registro => lanza (500)", async () => {
  const { deps } = mk({ record_paddle_payment: () => ({ data: null, error: { message: "db down" } }) });
  await assertRejects(() => handlePaddleEvent(paid(), deps));
});

Deno.test("invitado sin cuenta: se registra sin conceder (reclamación al iniciar sesión)", async () => {
  const { deps, calls } = mk({ find_auth_user_id_by_email: () => ({ data: null, error: null }) });
  await handlePaddleEvent(paid(), deps);
  assertEquals(calls.some((c) => c.fn === "grant_purchase_entitlements"), false);
});

Deno.test("reembolso parcial y total pasan tipo e importe", async () => {
  const { deps, calls } = mk();
  for (const type of ["partial", "full"]) {
    await handlePaddleEvent({ event_type: "adjustment.updated", data: { id: `adj_${type}`, action: "refund",
      status: "approved", type, transaction_id: "txn_1", currency_code: "EUR", totals: { total: "500" } } }, deps);
  }
  const r = calls.filter((c) => c.fn === "apply_paddle_refund");
  assertEquals(r.map((c) => c.args.p_adjustment_type), ["partial", "full"]);
  assertEquals(r[0].args.p_amount, 5);
});

Deno.test("ajuste pendiente de aprobación se ignora", async () => {
  const { deps, calls } = mk();
  await handlePaddleEvent({ event_type: "adjustment.created", data: { id: "a", action: "refund", status: "pending_approval" } }, deps);
  assertEquals(calls.length, 0);
});

Deno.test("reembolso con fallo BD => lanza (500)", async () => {
  const { deps } = mk({ apply_paddle_refund: () => ({ data: null, error: { message: "no purchase" } }) });
  await assertRejects(() => handlePaddleEvent({ event_type: "adjustment.updated", data: { id: "a", action: "refund",
    status: "approved", type: "full", transaction_id: "txn_x", totals: { total: "100" } } }, deps));
});

Deno.test("ajuste con tipo desconocido => dead-letter, no se aplica", async () => {
  const { deps, calls } = mk();
  const res = await handlePaddleEvent({ event_id: "e1", event_type: "adjustment.updated", data: { id: "a", action: "refund",
    status: "approved", type: "weird", transaction_id: "txn_1", currency_code: "EUR", totals: { total: "100" } } }, deps);
  assertEquals(calls.some((c) => c.fn === "apply_paddle_refund"), false);
  assertEquals(res.deadletter, "invalid_adjustment");
});
