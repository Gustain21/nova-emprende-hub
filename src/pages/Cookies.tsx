import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const rows = [
  {
    name: "sb-<proyecto>-auth-token",
    provider: "Editorial Nova Emprende (infraestructura de autenticación propia)",
    purpose: "Mantener iniciada la sesión del usuario en el área de clientes y autenticar sus peticiones.",
    type: "Almacenamiento local (localStorage) · Estrictamente necesaria",
    duration: "Hasta que el usuario cierra sesión o borra el almacenamiento del navegador.",
  },
  {
    name: "nova_region_cache_v2",
    provider: "Editorial Nova Emprende",
    purpose: "Recordar la región detectada del visitante para mostrar el precio y la moneda correspondientes sin repetir la detección en cada visita.",
    type: "Almacenamiento local (localStorage) · Estrictamente necesaria para la funcionalidad solicitada",
    duration: "24 horas.",
  },
  {
    name: "__lp_country",
    provider: "Editorial Nova Emprende",
    purpose: "Simular un país concreto para comprobar la visualización de precios en entornos de prueba. Solo se crea si se utiliza expresamente esa función.",
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
              Última actualización: 6 de agosto de 2026
            </p>

            <div className="border border-border rounded-2xl p-8 md:p-12 space-y-10 text-muted-foreground">
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Qué son las cookies y tecnologías similares</h2>
                <p>
                  Las cookies son pequeños archivos o mecanismos de almacenamiento que pueden utilizarse para permitir determinadas funciones de un sitio web.
                </p>
                <p>
                  Una plataforma también puede emplear tecnologías similares, como almacenamiento local o almacenamiento de sesión, para determinadas funciones técnicas.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">2. Tecnologías utilizadas en Editorial Nova Emprende</h2>
                <p>
                  Editorial Nova Emprende utiliza las tecnologías necesarias para el funcionamiento efectivo de la plataforma. Esta web no utiliza herramientas de analítica, publicidad, marketing ni seguimiento de terceros.
                </p>

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

                <p>
                  Además, en las páginas de pago se carga el script de checkout de Paddle, necesario para procesar la transacción. Paddle puede utilizar sus propias tecnologías de almacenamiento con finalidades de funcionamiento del pago, seguridad y prevención del fraude, cuyos nombres y duraciones son determinados por Paddle y no por Editorial Nova Emprende.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">3. Tecnologías estrictamente necesarias</h2>
                <p>
                  Las tecnologías estrictamente necesarias permiten funciones esenciales como la seguridad, la autenticación, el mantenimiento de la sesión, las preferencias necesarias y otras funciones solicitadas expresamente por el usuario.
                </p>
                <p>
                  Cuando una tecnología sea estrictamente necesaria para prestar un servicio solicitado por el usuario, no se utilizará con finalidades publicitarias por el mero hecho de estar instalada.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">4. Cómo cambiar las preferencias</h2>
                <p>
                  Al no utilizarse cookies ni tecnologías sujetas a consentimiento, esta web no muestra un banner de cookies. El usuario puede, en cualquier caso, eliminar o bloquear el almacenamiento del navegador desde la configuración de su propio navegador, teniendo en cuenta que ello puede impedir el correcto funcionamiento del área de clientes.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">5. Cookies de terceros</h2>
                <p>
                  El único tercero que interviene con tecnologías de almacenamiento propias es Paddle, y únicamente en el proceso de pago, tal y como se indica en el apartado 2.
                </p>
                <p>
                  Política de privacidad de Paddle:{" "}
                  <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">
                    https://www.paddle.com/legal/privacy
                  </a>
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">6. Actualizaciones</h2>
                <p>
                  Esta Política de Cookies podrá modificarse cuando cambien las tecnologías utilizadas en el sitio o la normativa aplicable.
                </p>
                <p>La fecha de la última modificación figura al principio de esta página.</p>
                <p>
                  Contacto:{" "}
                  <a href="mailto:hola@editorialnovaemprende.com" className="text-brand-orange hover:underline">hola@editorialnovaemprende.com</a>
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
