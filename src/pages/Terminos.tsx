import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

const Terminos = () => {
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
              Términos y <span className="text-brand-orange">condiciones</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
              Última actualización: 6 de agosto de 2026
            </p>

            <div className="border border-border rounded-2xl p-8 md:p-12 space-y-10 text-muted-foreground">
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Titular y ámbito de aplicación</h2>
                <p>
                  Estos Términos y Condiciones regulan el acceso y utilización de los productos digitales ofrecidos bajo la marca Editorial Nova Emprende.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Titular:</strong> Gustavo Eduardo Romero</li>
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
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">2. Productos digitales</h2>
                <p>
                  Editorial Nova Emprende ofrece diferentes contenidos y herramientas digitales para emprendedores y profesionales. Entre los productos actualmente ofrecidos pueden encontrarse:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ebook “El Big Bang de los Negocios”.</li>
                  <li>La Bitácora del Capitán.</li>
                  <li>Guía de Prompts.</li>
                  <li>Dashboard Financiero.</li>
                  <li>Planner de Ejecución 90 días.</li>
                  <li>Plan Financiero Infoproducto.</li>
                  <li>Plan Financiero E-commerce.</li>
                </ul>
                <p>Los productos pueden ofrecerse individualmente o agrupados en packs.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">3. Contenido de los packs</h2>
                <p className="text-foreground font-bold">Pack Base:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ebook “El Big Bang de los Negocios”.</li>
                  <li>Guía de Prompts.</li>
                </ul>
                <p className="text-foreground font-bold">Pack Impulso:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ebook “El Big Bang de los Negocios”.</li>
                  <li>La Bitácora del Capitán.</li>
                  <li>Guía de Prompts.</li>
                </ul>
                <p className="text-foreground font-bold">Pack Dominio:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ebook “El Big Bang de los Negocios”.</li>
                  <li>La Bitácora del Capitán.</li>
                  <li>Guía de Prompts.</li>
                  <li>Dashboard Financiero.</li>
                  <li>Planner de Ejecución 90 días.</li>
                  <li>Plan Financiero Infoproducto.</li>
                  <li>Plan Financiero E-commerce.</li>
                </ul>
                <p>
                  El usuario adquiere exclusivamente los productos incluidos en el producto individual o pack seleccionado en el momento de la compra.
                </p>
                <p>Una compra no concede acceso automático al resto del catálogo.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">4. Precios y moneda</h2>
                <p>Los precios pueden mostrarse en EUR o USD según la región, configuración o proceso de compra aplicable.</p>
                <p>Antes de completar la transacción se mostrará al usuario el importe correspondiente.</p>
                <p>
                  Los impuestos aplicables a la transacción serán gestionados por Paddle de acuerdo con la ubicación y circunstancias de la compra y se mostrarán conforme corresponda dentro del proceso de checkout.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">5. Pago y Merchant of Record</h2>
                <p>Los pagos se procesan mediante Paddle.</p>
                <p>
                  Paddle actúa como Merchant of Record y reseller autorizado para la transacción. El comprador realiza el pago a través de Paddle de acuerdo con los términos aplicables de dicha plataforma.
                </p>
                <p>
                  Términos para compradores de Paddle:{" "}
                  <a href="https://www.paddle.com/legal/buyer-terms" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">
                    https://www.paddle.com/legal/buyer-terms
                  </a>
                </p>
                <p>
                  Política de reembolsos de Paddle:{" "}
                  <a href="https://www.paddle.com/legal/refund-policy" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">
                    https://www.paddle.com/legal/refund-policy
                  </a>
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">6. Cuenta del usuario</h2>
                <p>Cuando un producto requiera una cuenta, el usuario será responsable de mantener seguras sus credenciales.</p>
                <p>La cuenta es individual.</p>
                <p>No está permitido compartir las credenciales con otras personas ni facilitar el acceso a la cuenta a terceros.</p>
                <p>
                  Editorial Nova Emprende podrá adoptar medidas razonables para proteger las cuentas y prevenir accesos fraudulentos o no autorizados.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">7. Acceso a los productos</h2>
                <p>
                  Después de confirmarse correctamente una compra, se habilitará el acceso a los productos adquiridos de acuerdo con el formato correspondiente.
                </p>
                <p>
                  Los productos pueden consistir, según el caso, en archivos descargables, aplicaciones web, herramientas digitales o contenidos accesibles desde el área de cliente.
                </p>
                <p>El acceso se concede únicamente a los productos efectivamente adquiridos.</p>
                <p>
                  El acceso adquirido no tiene una fecha de vencimiento preestablecida, salvo que en la oferta concreta se indique expresamente otra modalidad.
                </p>
                <p>
                  Esto no supone una garantía de disponibilidad perpetua de una tecnología, plataforma o infraestructura concreta. Si fuese necesario modificar técnicamente la forma de acceso, se procurará preservar razonablemente el acceso al contenido adquirido, sin perjuicio de los derechos que legalmente correspondan al usuario.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">8. Licencia y uso profesional</h2>
                <p>La compra concede al usuario una licencia personal de utilización del producto adquirido.</p>
                <p>El comprador puede utilizar los conocimientos, metodologías, plantillas y herramientas adquiridas:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>para su propio negocio;</li>
                  <li>para sus propios proyectos;</li>
                  <li>en el ejercicio de su actividad profesional;</li>
                  <li>para realizar trabajos o prestar servicios a sus propios clientes.</li>
                </ul>
                <p>
                  Por ejemplo, el usuario puede utilizar una herramienta o metodología adquirida para analizar, planificar o desarrollar un trabajo destinado a un cliente.
                </p>
                <p>Sin embargo, la licencia no permite:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>copiar y entregar a terceros el producto original;</li>
                  <li>compartir archivos originales con clientes o terceros;</li>
                  <li>compartir las credenciales de acceso;</li>
                  <li>revender el producto;</li>
                  <li>redistribuirlo;</li>
                  <li>sublicenciarlo;</li>
                  <li>publicar copias;</li>
                  <li>ofrecer el producto original como propio;</li>
                  <li>poner los archivos o aplicaciones a disposición de terceros;</li>
                  <li>crear un repositorio, plataforma o sistema destinado a distribuir los productos originales.</li>
                </ul>
                <p>
                  El usuario puede comercializar el resultado de su propio trabajo realizado utilizando las herramientas, pero no comercializar ni redistribuir el producto original de Editorial Nova Emprende.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">9. Propiedad intelectual</h2>
                <p>La compra de un producto no transfiere su propiedad intelectual.</p>
                <p>
                  Los derechos sobre los contenidos, diseños, textos, metodologías, documentos, herramientas y demás materiales propios continuarán perteneciendo a sus respectivos titulares.
                </p>
                <p>La licencia concedida se limita a los usos expresamente permitidos en estas condiciones.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">10. Actualizaciones</h2>
                <p>
                  Salvo que la descripción concreta del producto establezca expresamente otra cosa, la compra no incluye futuras ampliaciones, nuevas ediciones, nuevos módulos ni nuevos productos.
                </p>
                <p>
                  Editorial Nova Emprende podrá realizar correcciones técnicas, correcciones de errores o ajustes necesarios para mantener el correcto funcionamiento del producto.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">11. Soporte</h2>
                <p>
                  Las consultas relacionadas con el acceso o funcionamiento de los productos pueden enviarse a{" "}
                  <a href="mailto:hola@editorialnovaemprende.com" className="text-brand-orange hover:underline">hola@editorialnovaemprende.com</a>.
                </p>
                <p>El plazo orientativo máximo de respuesta es de 72 horas laborables.</p>
                <p>
                  Este plazo se refiere a la respuesta de soporte y no implica necesariamente la resolución de cualquier incidencia dentro del mismo periodo cuando esta dependa de terceros o requiera una investigación técnica adicional.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">12. Desistimiento y reembolsos</h2>
                <p>
                  Las compras realizadas mediante Paddle se encuentran sujetas a los derechos legalmente aplicables y a las condiciones de compra y reembolso de Paddle.
                </p>
                <p>
                  En el caso de consumidores que dispongan legalmente de derecho de desistimiento, dicho derecho se aplicará de acuerdo con la legislación correspondiente.
                </p>
                <p>
                  En determinados contenidos digitales suministrados inmediatamente, el derecho de desistimiento puede dejar de resultar aplicable una vez iniciada la descarga, acceso o utilización cuando se hayan cumplido los requisitos legales de consentimiento y reconocimiento correspondientes.
                </p>
                <p>
                  Consultar la{" "}
                  <Link to="/reembolsos" className="text-brand-orange hover:underline">Política de Reembolsos</Link>{" "}
                  y{" "}
                  <a href="https://www.paddle.com/legal/refund-policy" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">
                    https://www.paddle.com/legal/refund-policy
                  </a>
                </p>
                <p>Nada en estos Términos pretende excluir derechos imperativos del consumidor.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">13. Uso indebido y suspensión</h2>
                <p>
                  Podrá limitarse o suspenderse una cuenta cuando existan indicios razonables de fraude, acceso no autorizado, compartición de credenciales, vulneración de derechos de propiedad intelectual o incumplimiento grave de estas condiciones.
                </p>
                <p>Siempre se respetarán los derechos que correspondan legalmente al usuario.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">14. Cambios en estas condiciones</h2>
                <p>Estas condiciones podrán actualizarse para reflejar modificaciones legales, técnicas o de funcionamiento.</p>
                <p>
                  Las modificaciones no reducirán retroactivamente derechos ya adquiridos cuando ello no esté permitido legalmente.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">15. Legislación aplicable</h2>
                <p>Estas condiciones se interpretarán conforme a la legislación que resulte aplicable.</p>
                <p>
                  Cuando el usuario actúe como consumidor, conservará los derechos y mecanismos de protección que le reconozcan las normas imperativas aplicables a su situación y residencia.
                </p>
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

export default Terminos;
