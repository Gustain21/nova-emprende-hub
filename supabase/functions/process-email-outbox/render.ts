// Plantillas HTML de app emails. Todo dato dinámico pasa por esc(). Sin enlaces de descarga:
// el acceso al comprador siempre va al área de clientes autenticada.
export const FROM = "NOVA EMPRENDE <noreply@notify.editorialnovaemprende.com>";
export const REPLY_TO = "hola@editorialnovaemprende.com";
export const CONTACT_INBOX = "hola@editorialnovaemprende.com";
export const CUSTOMER_AREA_URL = "https://editorialnovaemprende.com/clientes";

export function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const shell = (title: string, inner: string) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(title)}</title></head>
<body style="margin:0;background:#ffffff;font-family:Montserrat,Arial,sans-serif;color:#1a1a1a">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
<p style="font-family:'Playfair Display',Georgia,serif;font-size:20px;color:#E8733C;margin:0 0 24px">NOVA EMPRENDE</p>
${inner}
<p style="font-size:12px;color:#777;margin-top:32px">Editorial Nova Emprende · ${esc(REPLY_TO)}</p>
</div></body></html>`;

export interface ContactData { name: string; email: string; subject: string; message: string; createdAt?: string }

export function renderContact(d: ContactData) {
  const subject = `Nuevo mensaje de contacto: ${d.subject}`.slice(0, 180).replace(/[\r\n]+/g, " ");
  const html = shell(subject, `
<h1 style="font-size:18px;margin:0 0 16px">Nuevo mensaje desde el formulario de contacto</h1>
<p style="margin:4px 0"><strong>Nombre:</strong> ${esc(d.name)}</p>
<p style="margin:4px 0"><strong>Email:</strong> ${esc(d.email)}</p>
<p style="margin:4px 0"><strong>Asunto:</strong> ${esc(d.subject)}</p>
${d.createdAt ? `<p style="margin:4px 0"><strong>Recibido:</strong> ${esc(d.createdAt)}</p>` : ""}
<div style="margin-top:16px;padding:16px;background:#f6f2ee;border-radius:8px;white-space:pre-wrap">${esc(d.message)}</div>`);
  const text = `Nuevo mensaje de contacto\nNombre: ${d.name}\nEmail: ${d.email}\nAsunto: ${d.subject}\n\n${d.message}`;
  return { subject, html, text };
}

export function renderPurchaseAccess(d: { productName: string }) {
  const product = d.productName || "tu compra";
  const subject = `Tu acceso a ${product} está listo`.slice(0, 180).replace(/[\r\n]+/g, " ");
  const html = shell(subject, `
<h1 style="font-size:20px;margin:0 0 16px">¡Gracias por tu compra!</h1>
<p style="line-height:1.6">Tu acceso a <strong>${esc(product)}</strong> ya está disponible en tu área de clientes.</p>
<p style="line-height:1.6">Inicia sesión con este mismo correo electrónico para verlo.</p>
<p style="margin:28px 0"><a href="${CUSTOMER_AREA_URL}" style="background:#E8733C;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;display:inline-block">Ir a mi área de clientes</a></p>
<p style="font-size:13px;color:#555">Si tienes cualquier duda, responde a este correo.</p>`);
  const text = `¡Gracias por tu compra!\nTu acceso a ${product} ya está disponible.\nInicia sesión con este correo en ${CUSTOMER_AREA_URL}`;
  return { subject, html, text };
}
