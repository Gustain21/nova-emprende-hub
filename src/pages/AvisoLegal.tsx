import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

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
              Última actualización: 6 de agosto de 2026
            </p>

            <div className="border border-border rounded-2xl p-8 md:p-12 space-y-10 text-muted-foreground">
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Identificación del titular</h2>
                <p>
                  En cumplimiento de la normativa aplicable a los servicios de la sociedad de la información, se informa de los datos identificativos del responsable de este sitio web:
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
                    <strong className="text-foreground">Sitio web:</strong>{" "}
                    <a href="https://www.editorialnovaemprende.com" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">www.editorialnovaemprende.com</a>
                  </li>
                </ul>
                <p>
                  Editorial Nova Emprende es el nombre comercial bajo el que el titular desarrolla este proyecto editorial y digital.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">2. Objeto del sitio web</h2>
                <p>
                  Editorial Nova Emprende ofrece contenidos editoriales, recursos formativos y herramientas digitales orientados a emprendedores, profesionales independientes, autoempleados y pequeños negocios.
                </p>
                <p>
                  El sitio permite consultar información sobre los productos disponibles, adquirir productos digitales a través del sistema de compra habilitado y acceder, cuando corresponda, a los contenidos asociados a la cuenta del usuario.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">3. Condiciones de uso</h2>
                <p>
                  El acceso al sitio web implica el compromiso de utilizarlo de forma lícita y respetando la legislación aplicable, los derechos de terceros y las presentes condiciones.
                </p>
                <p>
                  El usuario se compromete a no utilizar el sitio para realizar actividades ilícitas, intentar acceder sin autorización a sistemas o cuentas de terceros, interferir en el funcionamiento de la plataforma o vulnerar las medidas de seguridad implementadas.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">4. Propiedad intelectual e industrial</h2>
                <p>
                  Salvo que se indique expresamente lo contrario, los textos, contenidos, diseños, materiales editoriales, metodologías, herramientas, documentos, recursos descargables y demás elementos propios publicados bajo Editorial Nova Emprende están protegidos por la normativa aplicable en materia de propiedad intelectual e industrial.
                </p>
                <p>
                  La adquisición de un producto no implica la cesión de los derechos de propiedad intelectual sobre el mismo.
                </p>
                <p>
                  Los usos permitidos de los productos adquiridos se especifican en los{" "}
                  <Link to="/terminos" className="text-brand-orange hover:underline">Términos y Condiciones</Link>.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">5. Enlaces externos</h2>
                <p>
                  El sitio puede contener enlaces a páginas, plataformas o servicios gestionados por terceros.
                </p>
                <p>
                  Editorial Nova Emprende no controla de forma general dichos servicios externos y no responde de sus contenidos, disponibilidad, políticas o prácticas, sin perjuicio de las responsabilidades que legalmente pudieran corresponder.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">6. Disponibilidad del sitio</h2>
                <p>
                  Se adoptarán medidas razonables para mantener el sitio y los productos digitales accesibles y operativos.
                </p>
                <p>
                  No obstante, pueden producirse interrupciones temporales debidas a mantenimiento, actualizaciones, incidencias técnicas, problemas de proveedores tecnológicos u otras circunstancias ajenas al control razonable del titular.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">7. Compras y pagos</h2>
                <p>Las compras de productos digitales se procesan mediante Paddle.</p>
                <p>
                  Paddle actúa como Merchant of Record y reseller autorizado en la transacción, por lo que gestiona el proceso de pago y los impuestos aplicables a la compra de acuerdo con sus propias condiciones.
                </p>
                <p>
                  Antes de finalizar una compra, el usuario podrá conocer el precio y los importes aplicables en el correspondiente proceso de compra.
                </p>
                <p>
                  Las condiciones específicas de utilización de los productos de Editorial Nova Emprende se encuentran en los{" "}
                  <Link to="/terminos" className="text-brand-orange hover:underline">Términos y Condiciones</Link>.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">8. Legislación y derechos del consumidor</h2>
                <p>El uso de este sitio se regirá por la normativa que resulte aplicable.</p>
                <p>
                  Cuando el usuario tenga la condición legal de consumidor, ninguna disposición de este Aviso Legal limitará los derechos imperativos que le reconozca la legislación de protección de consumidores correspondiente a su lugar de residencia.
                </p>
                <p>
                  Para cualquier consulta relacionada con Editorial Nova Emprende puede escribirse a{" "}
                  <a href="mailto:hola@editorialnovaemprende.com" className="text-brand-orange hover:underline">hola@editorialnovaemprende.com</a>.
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
