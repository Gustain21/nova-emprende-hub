import { assert, assertEquals, assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { backoffSeconds, classify, processBatch, type Deps, type OutboxRow } from "./worker.ts";
import { esc, renderContact, renderPurchaseAccess } from "./render.ts";

function mkDeps(rows: OutboxRow[], over: Partial<Deps> = {}) {
  const finished: any[] = []; const sent: any[] = [];
  const deps: Deps = {
    claim: async () => rows,
    finish: async (id, o, e, p, r) => { finished.push({ id, o, e, p, r }); return o; },
    getContact: async () => ({ name: "Ana", email: "ana@x.test", subject: "Hola", message: "<script>x</script>", created_at: "t" }),
    getPurchase: async () => ({ status: "paid", email: "buyer@x.test", product_name: "Ebook" }),
    send: async (m, k) => { sent.push({ m, k }); return { ok: true, status: 200, id: "re_1" }; },
    log: () => {},
    ...over,
  };
  return { deps, finished, sent };
}
const contactRow: OutboxRow = { id: "1", kind: "contact_notification", idempotency_key: "contact-notify-a", recipient: "hola@editorialnovaemprende.com", template_data: { contact_message_id: "a" }, attempts: 1 };
const purchaseRow: OutboxRow = { id: "2", kind: "purchase_access", idempotency_key: "purchase-access-b", recipient: "buyer@x.test", template_data: { purchase_id: "b" }, attempts: 1 };

Deno.test("contacto: envía con idempotency key estable, remitente y reply-to", async () => {
  const { deps, sent, finished } = mkDeps([contactRow]);
  await processBatch(deps);
  assertEquals(sent[0].k, "contact-notify-a");
  assertEquals(sent[0].m.from, "NOVA EMPRENDE <noreply@notify.editorialnovaemprende.com>");
  assertEquals(sent[0].m.reply_to, "hola@editorialnovaemprende.com");
  assertEquals(sent[0].m.to, "hola@editorialnovaemprende.com");
  assert(!sent[0].m.html.includes("<script>"));
  assertEquals(finished[0].o, "sent"); assertEquals(finished[0].p, "re_1");
});

Deno.test("compra reembolsada antes de enviar: se omite, no se envía", async () => {
  const { deps, sent, finished } = mkDeps([purchaseRow], { getPurchase: async () => ({ status: "refunded", email: "buyer@x.test", product_name: "E" }) });
  await processBatch(deps);
  assertEquals(sent.length, 0); assertEquals(finished[0].o, "skipped");
});

Deno.test("compra pending: se omite", async () => {
  const { deps, sent } = mkDeps([purchaseRow], { getPurchase: async () => ({ status: "pending", email: "buyer@x.test", product_name: "E" }) });
  await processBatch(deps); assertEquals(sent.length, 0);
});

Deno.test("compra pagada: enlaza al área de clientes, sin descargas", async () => {
  const { deps, sent } = mkDeps([purchaseRow]);
  await processBatch(deps);
  assertEquals(sent[0].m.to, "buyer@x.test");
  assertStringIncludes(sent[0].m.html, "https://editorialnovaemprende.com/clientes");
  assert(!/download|storage|token=/i.test(sent[0].m.html));
});

Deno.test("email de compra distinto del encolado: se omite", async () => {
  const { deps, sent } = mkDeps([purchaseRow], { getPurchase: async () => ({ status: "paid", email: "otro@x.test", product_name: "E" }) });
  await processBatch(deps); assertEquals(sent.length, 0);
});

Deno.test("contacto a destinatario no permitido: se omite", async () => {
  const { deps, sent } = mkDeps([{ ...contactRow, recipient: "evil@x.test" }]);
  await processBatch(deps); assertEquals(sent.length, 0);
});

Deno.test("429/5xx/red => retry con backoff; 422 => failed", async () => {
  assertEquals(classify({ ok: false, status: 429 }), "retry");
  assertEquals(classify({ ok: false, status: 503 }), "retry");
  assertEquals(classify({ ok: false, status: 0 }), "retry");
  assertEquals(classify({ ok: false, status: 422 }), "failed");
  assertEquals(classify({ ok: false, status: 403 }), "failed");
  assertEquals(backoffSeconds(1), 60); assertEquals(backoffSeconds(3), 240); assertEquals(backoffSeconds(20), 21600);
  const { deps, finished } = mkDeps([{ ...contactRow, attempts: 2 }], { send: async () => ({ ok: false, status: 500, error: "x", retryAfter: 900 }) });
  await processBatch(deps);
  assertEquals(finished[0].o, "retry"); assertEquals(finished[0].r, 900);
});

Deno.test("excepción en lectura => retry, no rompe el lote", async () => {
  const { deps, finished, sent } = mkDeps([contactRow, purchaseRow], { getContact: async () => { throw new Error("db"); } });
  await processBatch(deps);
  assertEquals(finished[0].o, "retry"); assertEquals(finished[1].o, "sent"); assertEquals(sent.length, 1);
});

Deno.test("escape HTML y asunto sin saltos de línea", () => {
  assertEquals(esc(`<a href="x">'&`), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;");
  const c = renderContact({ name: "<b>", email: "e", subject: "a\r\nBcc: x", message: "m" });
  assert(!c.subject.includes("\n")); assert(!c.html.includes("<b>"));
  assert(!renderPurchaseAccess({ productName: "<img src=x>" }).html.includes("<img"));
});
