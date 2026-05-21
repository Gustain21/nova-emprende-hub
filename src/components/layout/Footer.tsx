import { Link } from "react-router-dom";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import logoNovaEmprende from "@/assets/logo-nova-emprende.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="brand-container py-16">
        {/* Logo destacado arriba */}
        <div className="mb-12 pb-10 border-b border-border">
          <Link to="/" className="inline-flex items-center group">
            <img src={logoNovaEmprende} alt="Nova Emprende" className="h-[72px] md:h-[96px] w-auto" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Editorial</h4>
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
            <a href="mailto:hola@editorialnovaemprende.com" className="block text-sm text-brand-orange hover:underline">
              hola@editorialnovaemprende.com
            </a>
            <div className="flex items-center gap-3 pt-1">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-brand-orange hover:border-brand-orange transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-brand-orange hover:border-brand-orange transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-brand-orange hover:border-brand-orange transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
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
