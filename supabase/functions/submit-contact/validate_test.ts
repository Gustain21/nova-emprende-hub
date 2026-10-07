import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { validateContact } from "./validate.ts";

const now = 1_000_000;
const base = { name: "Ana", email: "Ana@Test.com ", subject: "Duda", message: "Hola, tengo una pregunta.", startedAt: now - 10_000 };

Deno.test("válido y normalizado", () => {
  const r = validateContact(base, now);
  assertEquals(r.ok, true);
  if (r.ok) assertEquals(r.data.email, "ana@test.com");
});
Deno.test("honeypot => spam", () => assertEquals(validateContact({ ...base, website: "x" }, now).ok, false));
Deno.test("envío demasiado rápido => spam", () => assertEquals(validateContact({ ...base, startedAt: now - 500 }, now).ok, false));
Deno.test("email inválido", () => assertEquals(validateContact({ ...base, email: "no" }, now).ok, false));
Deno.test("mensaje corto", () => assertEquals(validateContact({ ...base, message: "hi" }, now).ok, false));
