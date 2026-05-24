import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const AvisoLegal = () => {
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
              Aviso <span className="text-brand-orange">legal</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
              Aquí se recoge la información general de titularidad, condiciones de uso, acceso al área privada y protección de los contenidos, recursos y herramientas digitales de NOVA EMPRENDE.
            </p>

            <div className="border border-border rounded-2xl p-8 md:p-12 space-y-10 text-muted-foreground">
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Titularidad del sitio web</h2>
                <p>
                  Este sitio web, sus subdominios, áreas privadas y entornos asociados son titularidad de <strong className="text-foreground">Editorial Nova Emprende SL</strong>, sociedad dedicada a la edición, comercialización y distribución de contenidos, recursos, herramientas y aplicaciones digitales para emprendedores.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Denominación social:</strong> Editorial Nova Emprende SL</li>
                  <li><strong className="text-foreground">Email de contacto:</strong> <span className="text-brand-orange">hola@editorialnovaemprende.com</span></li>
                  <li><strong className="text-foreground">Ámbito de actividad:</strong> contenidos editoriales, descargables, recursos digitales, apps web y productos formativos o prácticos vinculados al ecosistema NOVA EMPRENDE</li>
                  <li><strong className="text-foreground">Domicilio social:</strong> España</li>
                </ul>
                <p>
                  En esta versión de trabajo se ha optado por una presentación pública discreta de los datos identificativos, sin perjuicio de completar o adaptar la información formal exigible antes de la publicación operativa definitiva.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">2. Objeto y alcance</h2>
                <p>
                  El presente Aviso Legal regula el acceso, navegación y uso de esta web, así como la utilización de sus contenidos, formularios, recursos, servicios, áreas privadas y herramientas digitales asociadas a NOVA EMPRENDE.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">3. Condiciones de uso</h2>
                <p>
                  El usuario se compromete a utilizar el sitio de forma lícita, diligente y conforme a la buena fe. Queda prohibido el uso del sitio, del área privada o de las apps con fines ilícitos, fraudulentos, lesivos para terceros o que puedan perjudicar el funcionamiento normal del sistema.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">4. Propiedad intelectual e industrial</h2>
                <p>
                  Los textos, diseños, estructuras, logotipos, nombres comerciales, descargables, documentos, apps, materiales y demás contenidos de NOVA EMPRENDE están protegidos por la normativa aplicable en materia de propiedad intelectual e industrial.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>La compra de un producto no implica cesión de derechos de propiedad intelectual.</li>
                  <li>El usuario adquiere únicamente el derecho de acceso o la licencia de uso que se describa en cada producto, pack o condición de compra.</li>
                  <li>Queda prohibida la reproducción, distribución, comunicación pública, reventa, cesión a terceros o explotación no autorizada de los contenidos.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">5. Área privada y accesos</h2>
                <p>
                  Determinados recursos, descargas y herramientas están reservados a clientes autorizados. El usuario es responsable de custodiar sus credenciales de acceso y de no compartirlas con terceros. NOVA EMPRENDE podrá limitar, suspender o revisar accesos cuando detecte un uso anómalo, indebido o contrario a estas condiciones.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">6. Responsabilidad</h2>
                <p>
                  NOVA EMPRENDE adoptará medidas razonables para procurar la disponibilidad y el buen funcionamiento del sitio, pero no garantiza la ausencia absoluta de errores, interrupciones, incidencias técnicas o caídas temporales. Tampoco responderá de daños derivados del uso indebido del servicio, de accesos no autorizados atribuibles al usuario o de incidencias ajenas a su control razonable.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">7. Enlaces a terceros</h2>
                <p>
                  En caso de que la web incluya enlaces a servicios, herramientas o sitios de terceros, NOVA EMPRENDE no será responsable de sus contenidos, políticas, disponibilidad ni prácticas externas, sin perjuicio de retirar o revisar dichos enlaces cuando resulte conveniente.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">8. Protección de datos y cookies</h2>
                <p>
                  El tratamiento de datos personales y el uso de cookies se rigen por las políticas específicas de privacidad y cookies accesibles desde este sitio web, así como por la normativa que resulte aplicable en cada momento.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">9. Legislación aplicable y fuero</h2>
                <p>
                  Este Aviso Legal se regirá por la legislación española. En caso de conflicto o controversia, las partes se someterán a los juzgados y tribunales que resulten competentes conforme a la normativa aplicable, especialmente en materia de consumo cuando proceda.
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

export default AvisoLegal;
