import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

const Reembolsos = () => {
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
              Política de reembolsos y <span className="text-brand-orange">desistimiento</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
              Última actualización: 6 de agosto de 2026
            </p>

            <div className="border border-border rounded-2xl p-8 md:p-12 space-y-10 text-muted-foreground">
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Compras realizadas a través de Paddle</h2>
                <p>
                  Los productos de Editorial Nova Emprende se adquieren mediante Paddle, que actúa como Merchant of Record y reseller autorizado en la transacción.
                </p>
                <p>
                  Paddle gestiona los pagos, los impuestos correspondientes a la transacción y los procedimientos de reembolso asociados a las compras procesadas por su plataforma.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">2. Derecho de desistimiento</h2>
                <p>Los derechos del comprador dependen de la legislación aplicable a su transacción.</p>
                <p>
                  En la Unión Europea y el Espacio Económico Europeo, los consumidores disponen con carácter general de un periodo de 14 días para desistir de determinadas compras a distancia, sujeto a las excepciones legalmente previstas.
                </p>
                <p>
                  En el caso de contenido digital que no se suministre en soporte material, el derecho de desistimiento puede perderse una vez comenzada la ejecución cuando el consumidor haya solicitado o consentido que el suministro comience durante el periodo de desistimiento, haya reconocido expresamente que como consecuencia pierde dicho derecho y se hayan cumplido los restantes requisitos legales aplicables.
                </p>
                <p>Nada de lo dispuesto en esta política limita los derechos imperativos reconocidos a los consumidores.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">3. Acceso inmediato al contenido digital</h2>
                <p>
                  Los productos de Editorial Nova Emprende pueden ponerse a disposición del comprador inmediatamente después de confirmarse la compra.
                </p>
                <p>
                  Cuando resulte legalmente necesario, el proceso de compra deberá obtener el consentimiento expreso correspondiente antes de iniciar el suministro y dejar constancia del reconocimiento por parte del comprador de las consecuencias que dicho acceso inmediato pueda tener sobre su derecho de desistimiento.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">4. Cómo solicitar un reembolso</h2>
                <p>
                  Las solicitudes correspondientes a una transacción procesada por Paddle pueden realizarse utilizando los canales de soporte para compradores habilitados por Paddle.
                </p>
                <a
                  href="https://paddle.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-brand-orange text-white text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  SOLICITAR REEMBOLSO EN PADDLE
                </a>
                <p>
                  Política de reembolsos de Paddle:{" "}
                  <a href="https://www.paddle.com/legal/refund-policy" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">
                    https://www.paddle.com/legal/refund-policy
                  </a>
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">5. Producto defectuoso o problemas de acceso</h2>
                <p>
                  Si existe un problema técnico persistente relacionado específicamente con un producto de Editorial Nova Emprende o el comprador no puede acceder correctamente a un producto adquirido, puede contactar con{" "}
                  <a href="mailto:hola@editorialnovaemprende.com" className="text-brand-orange hover:underline">hola@editorialnovaemprende.com</a>.
                </p>
                <p>
                  Editorial Nova Emprende revisará la incidencia y prestará la asistencia razonablemente necesaria, sin perjuicio de los derechos legales del comprador y de los procedimientos de Paddle relativos a la transacción.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">6. Efectos del reembolso</h2>
                <p>
                  Cuando una compra sea reembolsada, podrá finalizar el acceso al producto asociado a dicha compra de acuerdo con las condiciones aplicables.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">7. Derechos del consumidor</h2>
                <p>
                  Esta política no excluye ni limita ningún derecho que la legislación aplicable reconozca obligatoriamente a consumidores o usuarios.
                </p>
                <p>
                  Consulta también los{" "}
                  <Link to="/terminos" className="text-brand-orange hover:underline">Términos y Condiciones</Link>.
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

export default Reembolsos;
