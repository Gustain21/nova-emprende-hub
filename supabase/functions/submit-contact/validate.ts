export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Valida y normaliza. Devuelve error legible o los datos limpios. Antispam: honeypot + tiempo mínimo. */
export function validateContact(body: any, nowMs = Date.now()):
  { ok: true; data: ContactInput } | { ok: false; error: string; spam?: boolean } {
  if (!body || typeof body !== "object") return { ok: false, error: "Solicitud inválida" };
  if (typeof body.website === "string" && body.website.trim() !== "") return { ok: false, error: "spam", spam: true };
  const started = Number(body.startedAt);
  if (!Number.isFinite(started) || nowMs - started < 3000) return { ok: false, error: "spam", spam: true };

  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const data = { name: s(body.name), email: s(body.email).toLowerCase(), subject: s(body.subject), message: s(body.message) };
  if (data.name.length < 2 || data.name.length > 100) return { ok: false, error: "Nombre no válido" };
  if (!EMAIL_RE.test(data.email) || data.email.length > 255) return { ok: false, error: "Email no válido" };
  if (data.subject.length < 2 || data.subject.length > 150) return { ok: false, error: "Asunto no válido" };
  if (data.message.length < 10 || data.message.length > 5000) return { ok: false, error: "El mensaje debe tener entre 10 y 5000 caracteres" };
  return { ok: true, data };
}
