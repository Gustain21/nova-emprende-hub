import { Link } from "react-router-dom";
import logoNovaEmprende from "@/assets/logo-nova-emprende.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="brand-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center group">
              <img src={logoNovaEmprende} alt="Nova Emprende" className="h-12 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              NOVA EMPRENDE acompaña a emprendedores y futuros emprendedores con contenidos, herramientas y recursos pensados para convertir ideas en proyectos mejor estructurados, más accionables y más rentables.
            </p>
          </div>

          {/* Productos */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Productos</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/producto/ebook" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                El Big Bang de los Negocios
              </Link>
              <a href="/#ecosistema" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                Herramientas de implementación
              </a>
              <a href="/#ecosistema" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                Herramientas financieras
              </a>
              <a href="/#packs" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                Packs NOVA EMPRENDE
              </a>
            </nav>
          </div>

          {/* Enlaces */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Enlaces</h4>
            <nav className="flex flex-col gap-2">
              <a href="/#testimonios" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                Testimonios
              </a>
              <Link to="/contacto" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                Contacto
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                Acceso clientes
              </Link>
              <a href="/#packs" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                Ver packs
              </a>
            </nav>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Contacto</h4>
            <nav className="flex flex-col gap-2">
              <a href="mailto:hola@editorialnovaemprende.com" className="text-sm text-brand-orange hover:underline">
                hola@editorialnovaemprende.com
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">Instagram</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">LinkedIn</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">YouTube</a>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Editorial Nova Emprende. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/privacidad" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Aviso legal
            </Link>
            <Link to="/privacidad" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Política de Privacidad
            </Link>
            <Link to="/privacidad" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Política de Cookies
            </Link>
            <Link to="/terminos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Términos y Condiciones
            </Link>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground leading-relaxed max-w-4xl">
          Los productos digitales, descargas y accesos privados de NOVA EMPRENDE están sujetos a condiciones de compra, política de privacidad y licencia de uso para cliente autorizado.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
