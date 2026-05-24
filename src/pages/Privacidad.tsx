import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Privacidad = () => {
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
              Política de <span className="text-brand-orange">privacidad</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
              Esta política explica cómo se tratan los datos personales en la web, el checkout, el área privada y las herramientas digitales de NOVA EMPRENDE.
            </p>

            <div className="border border-border rounded-2xl p-8 md:p-12 space-y-10 text-muted-foreground">
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Responsable del tratamiento</h2>
                <p>
                  El responsable del tratamiento de los datos personales recabados a través de este sitio web, sus formularios, checkout, área privada y servicios asociados es <strong className="text-foreground">Editorial Nova Emprende SL</strong>.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">2. Qué datos pueden recopilarse</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Datos identificativos, como nombre y apellidos.</li>
                  <li>Datos de contacto, como email.</li>
                  <li>Datos de facturación y compra, cuando proceda.</li>
                  <li>Datos de acceso al área privada.</li>
                  <li>Información básica relacionada con el uso del servicio contratado.</li>
                  <li>Comunicaciones mantenidas con soporte.</li>
                </ul>
                <p>
                  Si alguna app guarda información adicional del usuario, por ejemplo datos financieros, notas o planificación, ese tratamiento se detallará de forma específica en la política correspondiente.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">3. Finalidades del tratamiento</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Gestionar el acceso, navegación y uso del sitio web.</li>
                  <li>Tramitar compras, pagos y entregas digitales.</li>
                  <li>Activar recursos, descargas, accesos y apps contratadas.</li>
                  <li>Gestionar el área privada del cliente.</li>
                  <li>Atender consultas, incidencias o soporte.</li>
                  <li>Cumplir obligaciones legales, fiscales y contables.</li>
                  <li>Enviar comunicaciones comerciales solo cuando exista base legal suficiente.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">4. Base jurídica</h2>
                <p>
                  Según el caso, la base jurídica podrá ser la ejecución de la relación contractual o precontractual, el cumplimiento de obligaciones legales, el interés legítimo en garantizar la seguridad y operativa del sistema o el consentimiento del usuario cuando resulte necesario.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">5. Conservación</h2>
                <p>
                  Los datos se conservarán durante el tiempo necesario para cumplir la finalidad para la que fueron recogidos y, posteriormente, durante los plazos exigidos por la normativa legal o mientras puedan derivarse responsabilidades.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">6. Destinatarios y proveedores</h2>
                <p>
                  Los datos podrán ser tratados por proveedores que ayuden a operar el servicio, por ejemplo hosting, plataformas de pago, email transaccional, herramientas de acceso o asesoría profesional, siempre dentro de la base jurídica correspondiente y con las garantías exigibles.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">7. Derechos del usuario</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Acceso</li>
                  <li>Rectificación</li>
                  <li>Supresión</li>
                  <li>Oposición</li>
                  <li>Limitación del tratamiento</li>
                  <li>Portabilidad, cuando proceda</li>
                  <li>Retirada del consentimiento, cuando aplique</li>
                </ul>
                <p>
                  Para ejercer estos derechos, el usuario podrá dirigirse a <strong className="text-foreground">hola@editorialnovaemprende.com</strong>.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">8. Seguridad</h2>
                <p>
                  NOVA EMPRENDE adoptará medidas técnicas y organizativas razonables para proteger los datos frente a pérdida, alteración, acceso no autorizado o tratamiento indebido. El acceso al área privada y a las apps deberá realizarse siempre bajo conexión segura.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">9. Comunicaciones comerciales</h2>
                <p>
                  Las comunicaciones comerciales no deben quedar mezcladas con el consentimiento necesario para la compra. Si se quieren enviar novedades o promociones, el consentimiento deberá recabarse de forma separada cuando sea legalmente exigible.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">10. Menores y actualizaciones</h2>
                <p>
                  Los servicios de NOVA EMPRENDE no están dirigidos específicamente a menores de edad. Esta política podrá actualizarse para adaptarse a cambios normativos, técnicos u operativos.
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

export default Privacidad;
