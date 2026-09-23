import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { openCookiePreferences } from "@/lib/consent/consent";

const necessaryRows = [
  {
    name: "nova_consent",
    provider: "Editorial Nova Emprende",
    purpose:
      "Guardar tu decisión sobre las categorías de cookies (analítica y marketing). Contiene únicamente la versión de la política y si has aceptado o rechazado cada categoría, junto con la fecha de la decisión.",
    type: "Cookie propia · Estrictamente necesaria (conservación de la preferencia)",
    duration: "180 días.",
  },
  {
    name: "sb-<proyecto>-auth-token",
    provider: "Editorial Nova Emprende (infraestructura de autenticación propia)",
    purpose: "Mantener iniciada la sesión del usuario en el área de clientes y autenticar sus peticiones.",
    type: "Almacenamiento local (localStorage) · Estrictamente necesaria",
    duration: "Hasta que el usuario cierra sesión o borra el almacenamiento del navegador.",
  },
  {
    name: "nova_region_v3",
    provider: "Editorial Nova Emprende",
    purpose:
      "Recordar el país detectado por la conexión del visitante para mostrar el precio y la moneda correspondientes sin repetir la detección en cada visita.",
    type: "Almacenamiento local (localStorage) · Estrictamente necesaria para la funcionalidad solicitada",
    duration: "24 horas.",
  },
  {
    name: "__lp_country",
    provider: "Editorial Nova Emprende",
    purpose:
      "Simular un país concreto para comprobar la visualización de precios en entornos de prueba. Solo se crea si se utiliza expresamente esa función.",
    type: "Almacenamiento de sesión (sessionStorage) · Técnica",
    duration: "Hasta cerrar la pestaña o el navegador.",
  },
  {
    name: "sidebar:state",
    provider: "Editorial Nova Emprende",
    purpose: "Recordar si el menú lateral del área de clientes está desplegado o plegado.",
    type: "Cookie propia · Preferencia de interfaz solicitada por el usuario",
    duration: "7 días.",
  },
];

const Table = ({ rows }: { rows: typeof necessaryRows }) => (
  <div className="overflow-x-auto rounded-xl border border-border">
    <table className="w-full min-w-[720px] text-sm">
      <thead>
        <tr className="bg-muted/40 text-foreground text-left">
          <th className="p-3 font-bold">Nombre</th>
          <th className="p-3 font-bold">Proveedor</th>
          <th className="p-3 font-bold">Finalidad</th>
          <th className="p-3 font-bold">Tipo</th>
          <th className="p-3 font-bold">Duración</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name} className="border-t border-border align-top">
            <td className="p-3 font-mono text-xs text-foreground">{r.name}</td>
            <td className="p-3">{r.provider}</td>
            <td className="p-3">{r.purpose}</td>
            <td className="p-3">{r.type}</td>
            <td className="p-3">{r.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="brand-container">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block bg-brand-orange text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              Base legal de la plataforma
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-8">
              Política de <span className="text-brand-orange">cookies</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
              Última actualización: 7 de septiembre de 2026
            </p>

            <div className="border border-border rounded-2xl p-8 md:p-12 space-y-10 text-muted-foreground">
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Qué son las cookies</h2>
                <p>
                  Las cookies son pequeños archivos que un sitio web guarda en tu navegador. Junto a ellas,
                  una web puede utilizar tecnologías similares, como el almacenamiento local o el
                  almacenamiento de sesión, con finalidades equivalentes.
                </p>
                <p>
                  En Editorial Nova Emprende clasificamos estas tecnologías en tres categorías: necesarias,
                  analítica y marketing.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">2. Cookies necesarias</h2>
                <p>
                  Permiten funciones esenciales como la seguridad, la autenticación, el mantenimiento de la
                  sesión en el área de clientes, el procesamiento del pago y la conservación de las
                  preferencias imprescindibles. No requieren consentimiento y no pueden desactivarse desde
                  el panel, porque sin ellas la web no funciona.
                </p>
                <Table rows={necessaryRows} />
                <p>
                  Además, en las páginas de pago se carga el script de checkout de Paddle, necesario para
                  procesar la transacción. Paddle puede utilizar sus propias tecnologías de almacenamiento
                  con finalidades de funcionamiento del pago, seguridad y prevención del fraude, cuyos
                  nombres y duraciones son determinados por Paddle y no por Editorial Nova Emprende.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">3. Cookies de analítica</h2>
                <p>
                  Su finalidad es comprender de forma agregada cómo se utiliza la web para mejorarla. Están
                  <strong className="text-foreground"> desactivadas por defecto</strong> y solo se activan si
                  prestas tu consentimiento.
                </p>
                <p>
                  Para esta categoría está prevista la utilización de{" "}
                  <strong className="text-foreground">Google Analytics 4</strong> cargado mediante{" "}
                  <strong className="text-foreground">Google Tag Manager</strong> (Google Ireland Limited).
                  En este momento{" "}
                  <strong className="text-foreground">
                    Google Analytics 4 todavía no está activo y no recoge ningún dato
                  </strong>
                  : la etiqueta correspondiente aún no ha sido configurada. Cuando se active, actualizaremos
                  esta política con los nombres y duraciones exactos de las cookies que se creen
                  (habitualmente <span className="font-mono text-xs">_ga</span> y{" "}
                  <span className="font-mono text-xs">_ga_&lt;id&gt;</span>) antes de su puesta en marcha.
                </p>
                <p>
                  Mientras no aceptes esta categoría, el contenedor de Google Tag Manager no se carga y no se
                  envía ninguna petición a Google.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">4. Cookies de marketing</h2>
                <p>
                  Su finalidad es medir y mejorar nuestras campañas publicitarias. Están{" "}
                  <strong className="text-foreground">desactivadas por defecto</strong> y solo se activan si
                  prestas tu consentimiento.
                </p>
                <p>
                  Actualmente{" "}
                  <strong className="text-foreground">
                    no hay ninguna herramienta publicitaria instalada ni activa
                  </strong>
                  . Si en el futuro se incorpora alguna, se detallará en esta política antes de su
                  activación.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  5. Cómo aceptar, rechazar o configurar
                </h2>
                <p>
                  En tu primera visita se muestra un aviso con tres opciones equivalentes:{" "}
                  <strong className="text-foreground">Aceptar todas</strong>,{" "}
                  <strong className="text-foreground">Rechazar</strong> y{" "}
                  <strong className="text-foreground">Configurar</strong>. Ninguna categoría opcional está
                  premarcada. Desde «Configurar» puedes activar de forma independiente la analítica, el
                  marketing, ambas o ninguna, y guardar tus preferencias.
                </p>
                <p>
                  Hasta que tomes una decisión, las señales de consentimiento permanecen denegadas
                  (analítica, almacenamiento publicitario, datos de usuario publicitarios y personalización
                  publicitaria) y no se carga ninguna herramienta no esencial.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  6. Cómo retirar el consentimiento
                </h2>
                <p>
                  Puedes cambiar o retirar tu decisión en cualquier momento, con la misma facilidad con la
                  que la concediste, mediante el enlace{" "}
                  <strong className="text-foreground">«Configurar cookies»</strong> disponible de forma
                  permanente en el pie de página.
                </p>
                <p>
                  Al retirar una categoría se actualiza inmediatamente el estado de consentimiento, se
                  impiden nuevas cargas de esa categoría y se eliminan, cuando técnicamente es posible, las
                  cookies de primera parte creadas por las herramientas desactivadas. Tu sesión y las
                  cookies estrictamente necesarias no se ven afectadas.
                </p>
                <div>
                  <Button variant="outline" onClick={openCookiePreferences}>
                    Configurar cookies
                  </Button>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  7. Conservación de tu preferencia
                </h2>
                <p>
                  Tu decisión se guarda exclusivamente en la cookie propia{" "}
                  <span className="font-mono text-xs text-foreground">nova_consent</span>, en el dominio{" "}
                  <span className="font-mono text-xs text-foreground">.editorialnovaemprende.com</span>, con
                  los atributos <span className="font-mono text-xs">Secure</span> y{" "}
                  <span className="font-mono text-xs">SameSite=Lax</span> y una duración máxima de{" "}
                  <strong className="text-foreground">180 días</strong>.
                </p>
                <p>
                  Contiene únicamente la versión de la política y el estado de cada categoría, por ejemplo:{" "}
                  <span className="font-mono text-xs text-foreground">
                    {'{"v":1,"analytics":false,"marketing":false,"ts":"2026-09-07T10:00:00.000Z"}'}
                  </span>
                  . No almacena tu correo electrónico, tu identidad, tu dirección IP ni ninguna respuesta del
                  diagnóstico.
                </p>
                <p>
                  Si cambian las categorías o esta política, la versión de la cookie se incrementa y se te
                  volverá a solicitar el consentimiento.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">8. Actualizaciones</h2>
                <p>
                  Esta Política de Cookies podrá modificarse cuando cambien las tecnologías utilizadas en el
                  sitio o la normativa aplicable. La fecha de la última modificación figura al principio de
                  esta página.
                </p>
                <p>
                  Puedes consultar también nuestra{" "}
                  <Link to="/privacidad" className="text-brand-orange hover:underline">
                    Política de Privacidad
                  </Link>{" "}
                  y la{" "}
                  <a
                    href="https://www.paddle.com/legal/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-orange hover:underline"
                  >
                    política de privacidad de Paddle
                  </a>
                  .
                </p>
                <p>
                  Contacto:{" "}
                  <a href="mailto:hola@editorialnovaemprende.com" className="text-brand-orange hover:underline">
                    hola@editorialnovaemprende.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cookies;
