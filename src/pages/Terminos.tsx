import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-8">
              Términos y <span className="text-brand-orange">condiciones</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
              Última actualización: Enero 2026
            </p>

            <div className="border border-border rounded-2xl p-8 md:p-12 space-y-10 text-muted-foreground">
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Aceptación de los Términos</h2>
                <p>
                  Al acceder y utilizar el sitio web de Editorial Nova Emprende (www.editorialnovaemprende.com) y adquirir nuestros productos, usted acepta cumplir y estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le rogamos que no utilice nuestros servicios.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">2. Descripción de los Servicios</h2>
                <p>
                  Editorial Nova Emprende ofrece productos digitales educativos para emprendedores, incluyendo:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ebooks en formato PDF</li>
                  <li>Workbooks y guías de trabajo</li>
                  <li>Plantillas Excel para planificación financiera</li>
                  <li>Aplicaciones web interactivas (dashboards, planners, etc.)</li>
                  <li>Guías de prompts para inteligencia artificial</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">3. Registro y Cuenta de Usuario</h2>
                <p>
                  Para acceder a los productos adquiridos, deberá crear una cuenta proporcionando información veraz y actualizada. Usted es responsable de:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                  <li>Todas las actividades que ocurran bajo su cuenta</li>
                  <li>Notificarnos inmediatamente cualquier uso no autorizado</li>
                </ul>
                <p>
                  Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">4. Proceso de Compra y Pagos</h2>
                <p>
                  Todos los precios se muestran en euros (€) e incluyen los impuestos aplicables. Al realizar una compra:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Garantiza que la información de pago proporcionada es correcta</li>
                  <li>Autoriza el cargo en su método de pago seleccionado</li>
                  <li>Recibirá confirmación de compra por correo electrónico</li>
                  <li>Tendrá acceso inmediato a los productos digitales tras confirmar el pago</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">5. Entrega de Productos Digitales</h2>
                <p>
                  Los productos digitales se entregan de forma electrónica inmediatamente después de la confirmación del pago:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>PDFs y Excel:</strong> Disponibles para descarga desde su área de cliente</li>
                  <li><strong>Aplicaciones web:</strong> Acceso mediante las credenciales de su cuenta</li>
                </ul>
                <p>
                  Los enlaces de descarga y accesos permanecerán disponibles en su cuenta de forma indefinida mientras mantenga una cuenta activa.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">6. Política de Devoluciones</h2>
                <p>
                  Debido a la naturaleza de los productos digitales, que pueden ser descargados o accedidos inmediatamente:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Una vez realizada la compra y accedido al contenido, no se admiten devoluciones</li>
                  <li>Antes de comprar, le recomendamos revisar detalladamente la descripción de cada producto</li>
                  <li>En caso de problemas técnicos que impidan el acceso, contacte con soporte para resolverlos</li>
                </ul>
                <p>
                  Excepcionalmente, podremos considerar reembolsos en casos justificados a nuestra discreción.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">7. Propiedad Intelectual</h2>
                <p>
                  Todos los contenidos de Editorial Nova Emprende están protegidos por derechos de autor:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Los productos adquiridos son para uso personal y profesional del comprador</li>
                  <li>Queda prohibida la reproducción, distribución o reventa de los materiales</li>
                  <li>No está permitido compartir credenciales de acceso con terceros</li>
                  <li>Las marcas, logos y nombres comerciales son propiedad exclusiva de Editorial Nova Emprende</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">8. Limitación de Responsabilidad</h2>
                <p>
                  Nuestros productos son herramientas educativas y de apoyo empresarial:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>No garantizamos resultados específicos de negocio</li>
                  <li>El éxito depende de la aplicación individual de los conocimientos</li>
                  <li>No somos responsables de decisiones empresariales tomadas basándose en nuestros materiales</li>
                  <li>La información proporcionada no constituye asesoramiento legal, fiscal o financiero profesional</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">9. Uso Aceptable</h2>
                <p>
                  Al utilizar nuestros servicios, se compromete a:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>No utilizar los servicios para fines ilegales</li>
                  <li>No intentar acceder a cuentas de otros usuarios</li>
                  <li>No interferir con el funcionamiento de nuestras plataformas</li>
                  <li>No realizar ingeniería inversa de nuestras aplicaciones</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">10. Modificaciones</h2>
                <p>
                  Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor desde su publicación en el sitio web. Le recomendamos revisar esta página periódicamente.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">11. Ley Aplicable</h2>
                <p>
                  Estos términos se rigen por la legislación española. Cualquier disputa se someterá a los tribunales competentes de España.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">12. Contacto</h2>
                <p>
                  Para cualquier consulta relacionada con estos Términos y Condiciones:
                </p>
                <p className="text-brand-orange font-medium">
                  hola@editorialnovaemprende.com
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
