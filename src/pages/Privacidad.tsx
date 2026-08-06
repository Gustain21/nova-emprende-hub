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
              Última actualización: 6 de agosto de 2026
            </p>

            <div className="border border-border rounded-2xl p-8 md:p-12 space-y-10 text-muted-foreground">
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Responsable del tratamiento</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Responsable:</strong> Gustavo Eduardo Romero</li>
                  <li><strong className="text-foreground">NIF:</strong> 60767754Y</li>
                  <li><strong className="text-foreground">Nombre comercial:</strong> Editorial Nova Emprende</li>
                  <li><strong className="text-foreground">Domicilio:</strong> Calle Joan Pereyra i Morante 6, 07800 Eivissa, Islas Baleares, España</li>
                  <li>
                    <strong className="text-foreground">Correo electrónico:</strong>{" "}
                    <a href="mailto:hola@editorialnovaemprende.com" className="text-brand-orange hover:underline">hola@editorialnovaemprende.com</a>
                  </li>
                  <li>
                    <strong className="text-foreground">Web:</strong>{" "}
                    <a href="https://www.editorialnovaemprende.com" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">www.editorialnovaemprende.com</a>
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">2. Qué datos podemos tratar</h2>
                <p>Dependiendo de la forma en que el usuario utilice la plataforma, podrán tratarse los datos necesarios para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>gestionar consultas enviadas mediante los formularios habilitados;</li>
                  <li>crear y administrar una cuenta de usuario;</li>
                  <li>autenticar al usuario y mantener la seguridad de su cuenta;</li>
                  <li>identificar los productos adquiridos;</li>
                  <li>habilitar el acceso a los productos correspondientes a cada compra;</li>
                  <li>prestar soporte;</li>
                  <li>gestionar incidencias;</li>
                  <li>mantener registros técnicos y de seguridad cuando sean necesarios;</li>
                  <li>cumplir las obligaciones legales aplicables.</li>
                </ul>
                <p>Los datos concretos tratados dependerán de las funciones que utilice el usuario.</p>
                <p>
                  Editorial Nova Emprende no solicita los datos completos de las tarjetas utilizadas para realizar una compra. El pago se realiza a través de Paddle.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">3. Finalidades y base jurídica</h2>
                <p>
                  <strong className="text-foreground">Gestión de consultas:</strong> para responder a las comunicaciones y solicitudes remitidas por el usuario. La base jurídica dependerá de la naturaleza de la consulta y podrá ser la aplicación de medidas precontractuales o el interés legítimo en atender las comunicaciones recibidas.
                </p>
                <p>
                  <strong className="text-foreground">Cuenta de usuario:</strong> para crear, autenticar, mantener y proteger la cuenta y proporcionar los servicios solicitados. La base jurídica es la ejecución de la relación con el usuario o la aplicación de medidas solicitadas por este antes de establecerla.
                </p>
                <p>
                  <strong className="text-foreground">Compras, licencias y acceso a productos:</strong> para identificar los productos adquiridos y permitir al usuario acceder a ellos. La base jurídica es la ejecución de la relación derivada de la adquisición y uso del producto.
                </p>
                <p>
                  <strong className="text-foreground">Cumplimiento de obligaciones legales:</strong> determinados datos podrán conservarse o tratarse cuando resulte necesario para cumplir obligaciones legales aplicables.
                </p>
                <p>
                  <strong className="text-foreground">Seguridad y prevención de usos indebidos:</strong> podrán tratarse los datos técnicos razonablemente necesarios para proteger la plataforma, las cuentas y los derechos de Editorial Nova Emprende y de sus usuarios.
                </p>
                <p>
                  Editorial Nova Emprende no utilizará el correo del usuario para enviar newsletters o comunicaciones comerciales periódicas simplemente por haberse registrado o realizado una compra, salvo que exista una base jurídica válida para hacerlo.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">4. Pagos a través de Paddle</h2>
                <p>
                  Los pagos se realizan mediante Paddle, que interviene en las transacciones como Merchant of Record y reseller autorizado.
                </p>
                <p>
                  Cuando el usuario inicia una compra, Paddle puede solicitar y tratar los datos necesarios para procesar la transacción, gestionar el pago, determinar los impuestos aplicables, prevenir el fraude y cumplir sus propias obligaciones legales.
                </p>
                <p>
                  El tratamiento realizado directamente por Paddle se rige también por sus propios términos y política de privacidad.
                </p>
                <p>
                  Política de privacidad de Paddle:{" "}
                  <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">
                    https://www.paddle.com/legal/privacy
                  </a>
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">5. Proveedores tecnológicos</h2>
                <p>
                  Para prestar sus servicios, Editorial Nova Emprende puede utilizar proveedores tecnológicos necesarios para funciones como alojamiento, infraestructura, autenticación, almacenamiento, correo electrónico, seguridad, soporte técnico y procesamiento de pagos.
                </p>
                <p>
                  Estos proveedores únicamente tendrán acceso a los datos en la medida necesaria para desarrollar la función correspondiente y de acuerdo con el marco jurídico que resulte aplicable.
                </p>
                <p>
                  Paddle se identifica expresamente debido a su intervención directa en las transacciones.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">6. Transferencias internacionales</h2>
                <p>
                  Cuando la utilización de un proveedor implique una transferencia internacional de datos personales, se aplicarán las garantías exigidas por la normativa de protección de datos que resulte aplicable.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">7. Conservación</h2>
                <p>
                  Los datos se conservarán únicamente durante el tiempo necesario para la finalidad para la que fueron recogidos y, posteriormente, durante los periodos que puedan resultar necesarios para cumplir obligaciones legales, atender responsabilidades o defender posibles reclamaciones.
                </p>
                <p>
                  Los datos asociados a una cuenta se conservarán mientras esta permanezca activa y posteriormente durante el periodo que resulte necesario conforme a las finalidades y obligaciones aplicables.
                </p>
                <p>
                  El usuario podrá solicitar la eliminación de su cuenta, sin perjuicio de aquellos datos cuya conservación resulte legalmente necesaria.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">8. Derechos del usuario</h2>
                <p>Cuando corresponda de acuerdo con la legislación aplicable, el usuario podrá ejercer sus derechos de:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>acceso;</li>
                  <li>rectificación;</li>
                  <li>supresión;</li>
                  <li>oposición;</li>
                  <li>limitación del tratamiento;</li>
                  <li>portabilidad.</li>
                </ul>
                <p>
                  También podrá retirar un consentimiento previamente otorgado cuando el tratamiento se base en dicho consentimiento, sin afectar a la licitud del tratamiento anterior a su retirada.
                </p>
                <p>
                  Para ejercer estos derechos puede escribir a{" "}
                  <a href="mailto:hola@editorialnovaemprende.com" className="text-brand-orange hover:underline">hola@editorialnovaemprende.com</a>.
                </p>
                <p>La solicitud deberá permitir identificar adecuadamente al solicitante y el derecho que desea ejercer.</p>
                <p>
                  El usuario también tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos:{" "}
                  <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">https://www.aepd.es</a>
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">9. Seguridad</h2>
                <p>
                  Editorial Nova Emprende aplicará medidas técnicas y organizativas razonables destinadas a proteger los datos personales frente a accesos no autorizados, pérdida, alteración o divulgación indebida, teniendo en cuenta la naturaleza de los datos y los riesgos del tratamiento.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">10. Cambios en esta política</h2>
                <p>
                  Esta Política de Privacidad podrá actualizarse cuando resulte necesario debido a cambios legales, técnicos o funcionales.
                </p>
                <p>La versión publicada en esta página indicará siempre su fecha de última actualización.</p>
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

export default Privacidad;
