import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Privacidad = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="brand-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Política de <span className="text-brand-orange">Privacidad</span>
            </h1>
            
            <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Última actualización: Enero 2026
              </p>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">1. Información que Recopilamos</h2>
                <p>
                  En Editorial Nova Emprende, recopilamos información que usted nos proporciona directamente cuando:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Crea una cuenta en nuestra plataforma</li>
                  <li>Realiza una compra de nuestros productos digitales</li>
                  <li>Se suscribe a nuestro boletín informativo</li>
                  <li>Se comunica con nosotros a través del formulario de contacto</li>
                  <li>Participa en encuestas o promociones</li>
                </ul>
                <p>
                  Esta información puede incluir: nombre, dirección de correo electrónico, información de pago, y cualquier otra información que decida proporcionarnos.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">2. Uso de la Información</h2>
                <p>
                  Utilizamos la información recopilada para:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Procesar sus pedidos y entregarle los productos digitales adquiridos</li>
                  <li>Gestionar su cuenta y proporcionarle acceso a nuestras plataformas</li>
                  <li>Enviarle comunicaciones relacionadas con su compra</li>
                  <li>Mejorar nuestros productos y servicios</li>
                  <li>Responder a sus consultas y solicitudes de soporte</li>
                  <li>Enviarle información promocional (solo si ha dado su consentimiento)</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">3. Protección de Datos</h2>
                <p>
                  Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso no autorizado, la alteración, divulgación o destrucción. Esto incluye:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cifrado SSL en todas las transmisiones de datos</li>
                  <li>Almacenamiento seguro de contraseñas mediante hash</li>
                  <li>Acceso restringido a datos personales solo al personal autorizado</li>
                  <li>Monitorización continua de nuestros sistemas</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">4. Cookies y Tecnologías Similares</h2>
                <p>
                  Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web. Las cookies nos permiten:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Recordar sus preferencias de navegación</li>
                  <li>Mantener su sesión activa mientras navega</li>
                  <li>Analizar el uso del sitio para mejorarlo</li>
                  <li>Personalizar el contenido que le mostramos</li>
                </ul>
                <p>
                  Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">5. Compartición de Datos</h2>
                <p>
                  No vendemos, alquilamos ni compartimos su información personal con terceros, excepto:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Con proveedores de servicios que nos ayudan a operar nuestro negocio (procesadores de pago, servicios de hosting)</li>
                  <li>Cuando sea requerido por ley o autoridades competentes</li>
                  <li>Para proteger nuestros derechos, propiedad o seguridad</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">6. Sus Derechos</h2>
                <p>
                  De acuerdo con el Reglamento General de Protección de Datos (RGPD), usted tiene derecho a:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Acceso:</strong> Solicitar una copia de sus datos personales</li>
                  <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                  <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos</li>
                  <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado</li>
                  <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos</li>
                  <li><strong>Limitación:</strong> Solicitar la restricción del tratamiento</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">7. Retención de Datos</h2>
                <p>
                  Conservamos sus datos personales durante el tiempo necesario para cumplir con los fines para los que fueron recopilados, incluyendo obligaciones legales, contables o de informes. Los datos de transacciones se conservan durante el período legalmente requerido.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">8. Contacto</h2>
                <p>
                  Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, puede contactarnos en:
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

export default Privacidad;
