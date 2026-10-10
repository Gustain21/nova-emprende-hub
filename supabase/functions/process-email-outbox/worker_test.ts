import { assert, assertEquals, assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { backoffSeconds, classify, processBatch, type Deps, type OutboxRow, type Payload } from "./worker.ts";
import { esc, renderContact, renderPurchaseAccess } from "./render.ts";

function mkDeps(rows: OutboxRow[], over: Partial<Deps> = {}) {
  const finished: any[] = []; const sent: any[] = []; const saved: Record<string, Payload> = {};
  const deps: Deps = {
    claim: async () => rows,
    savePayload: async (id, _t, p) => (saved[id] ??= p),
    finish: async (id, t, o, e, p, r) => { finished.push({ id, t, o, e, p, r }); return o; },
    getContact: async () => ({ name: "Ana", email: "ana@x.test", subject: "Hola", message: "<script>x</script>", created_at: "t" }),
    getPurchase: async () => ({ status: "paid", email: "buyer@x.test", product_name: "Ebook" }),
    send: async (m, k) => { sent.push({ m, k }); return { ok: true, status: 200, id: "re_1" }; },
    log: () => {},
    ...over,
  };
  return { deps, finished, sent, saved };
}
const contactRow = (): OutboxRow => ({ id: "1", kind: "contact_notification", idempotency_key: "contact-notify-a", recipient: "hola@editorialnovaemprende.com", template_data: { contact_message_id: "a" }, attempts: 1, claim_token: "tok1", payload: null });
const purchaseRow = (): OutboxRow => ({ id: "2", kind: "purchase_access", idempotency_key: "purchase-access-b", recipient: "buyer@x.test", template_data: { purchase_id: "b" }, attempts: 1, claim_token: "tok2", payload: null });

Deno.test("contacto: clave estable, remitente, reply-to, token de reserva en el cierre", async () => {
  const { deps, sent, finished } = mkDeps([contactRow()]);
  const s = await processBatch(deps);
  assertEquals(sent[0].k, "contact-notify-a");
  assertEquals(sent[0].m.from, "NOVA EMPRENDE <noreply@notify.editorialnovaemprende.com>");
  assertEquals(sent[0].m.reply_to, "hola@editorialnovaemprende.com");
  assert(!sent[0].m.html.includes("<script>"));
  assertEquals(finished[0].t, "tok1"); assertEquals(s.sent, 1);
});

Deno.test("reintento reutiliza el snapshot aunque cambien los datos", async () => {
  let name = "Ebook";
  const { deps, sent, saved } = mkDeps([], { getPurchase: async () => ({ status: "paid", email: "buyer@x.test", product_name: name }) });
  deps.claim = async () => [purchaseRow()];
  deps.send = async (m, k) => { sent.push({ m, k }); return { ok: false, status: 503 }; };
  await processBatch(deps);
  name = "Producto renombrado";
  deps.claim = async () => [{ ...purchaseRow(), attempts: 2, claim_token: "tok3", payload: saved["2"] }];
  await processBatch(deps);
  assertEquals(sent.length, 2);
  assertEquals(sent[0].m, sent[1].m); assertEquals(sent[0].k, sent[1].k);
  assert(!sent[1].m.html.includes("renombrado"));
});

Deno.test("snapshot existente pero compra reembolsada: no se envía", async () => {
  const snap = { from: "f", to: "buyer@x.test", reply_to: "r", subject: "s", html: "h", text: "t" };
  const { deps, sent, finished } = mkDeps([{ ...purchaseRow(), payload: snap }], { getPurchase: async () => ({ status: "refunded", email: "buyer@x.test", product_name: "E" }) });
  await processBatch(deps);
  assertEquals(sent.length, 0); assertEquals(finished[0].o, "skipped");
});

Deno.test("compra pagada: enlace al área de clientes, sin descargas", async () => {
  const { deps, sent } = mkDeps([purchaseRow()]);
  await processBatch(deps);
  assertStringIncludes(sent[0].m.html, "https://editorialnovaemprende.com/clientes");
  assert(!/download|storage|token=/i.test(sent[0].m.html));
});

Deno.test("email de compra distinto o contacto a otro destinatario: no se envía", async () => {
  const a = mkDeps([purchaseRow()], { getPurchase: async () => ({ status: "paid", email: "otro@x.test", product_name: "E" }) });
  await processBatch(a.deps); assertEquals(a.sent.length, 0);
  const b = mkDeps([{ ...contactRow(), recipient: "evil@x.test" }]);
  await processBatch(b.deps); assertEquals(b.sent.length, 0);
});

Deno.test("trabajador viejo: lease perdido antes de enviar => no envía ni cierra", async () => {
  const { deps, sent, finished } = mkDeps([contactRow()], { savePayload: async () => null });
  const s = await processBatch(deps);
  assertEquals(sent.length, 0); assertEquals(finished.length, 0); assertEquals(s.not_leased, 1);
});

Deno.test("trabajador viejo: cierre rechazado (not_leased) no cuenta como enviado", async () => {
  const { deps } = mkDeps([contactRow()], { finish: async () => "not_leased" });
  const s = await processBatch(deps);
  assertEquals(s.sent, 0); assertEquals(s.not_leased, 1);
});

Deno.test("Resend aceptó pero finish falla: no cuenta como enviado, sigue el lote", async () => {
  let n = 0;
  const { deps, sent } = mkDeps([contactRow(), purchaseRow()], {
    finish: async (_i, _t, o) => { if (n++ === 0) throw new Error("db caída"); return o; },
  });
  const s = await processBatch(deps);
  assertEquals(sent.length, 2); assertEquals(s.finish_error, 1); assertEquals(s.sent, 1);
});

Deno.test("clasificación: 409 concurrente => retry; 409 cuerpo distinto => failed", () => {
  assertEquals(classify({ ok: false, status: 409, error: '{"name":"concurrent_idempotent_requests"}' }), "retry");
  assertEquals(classify({ ok: false, status: 409, error: '{"name":"invalid_idempotent_request"}' }), "failed");
  assertEquals(classify({ ok: false, status: 429 }), "retry");
  assertEquals(classify({ ok: false, status: 503 }), "retry");
  assertEquals(classify({ ok: false, status: 0 }), "retry");
  assertEquals(classify({ ok: false, status: 422 }), "failed");
  assertEquals(backoffSeconds(1), 60); assertEquals(backoffSeconds(4), 480);
});

Deno.test("excepción en lectura => retry sin romper el lote", async () => {
  const { deps, finished } = mkDeps([contactRow(), purchaseRow()], { getContact: async () => { throw new Error("db"); } });
  await processBatch(deps);
  assertEquals(finished[0].o, "retry"); assertEquals(finished[1].o, "sent");
});

Deno.test("escape HTML y asunto sin saltos", () => {
  assertEquals(esc(`<a href="x">'&`), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;");
  const c = renderContact({ name: "<b>", email: "e", subject: "a\r\nBcc: x", message: "m" });
  assert(!c.subject.includes("\n")); assert(!c.html.includes("<b>"));
  assert(!renderPurchaseAccess({ productName: "<img src=x>" }).html.includes("<img"));
});
