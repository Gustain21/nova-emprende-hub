import { Link } from "react-router-dom";
import { Rocket, Mail, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="brand-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">Nova</span>
                <span className="text-lg font-bold text-brand-orange">Emprende</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transformamos ideas en negocios rentables. Herramientas prácticas para emprendedores que quieren pasar de la teoría a la acción.
            </p>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Productos</h4>
            <nav className="flex flex-col gap-2">
              <a href="/#productos" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                El Big Bang de los Negocios
              </a>
              <a href="/#productos" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                La Bitácora del Capitán
              </a>
              <a href="/#productos" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                Guía de Prompts
              </a>
              <a href="/#productos" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                Dashboard Financiero
              </a>
            </nav>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Enlaces</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/testimonios" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                Testimonios
              </Link>
              <Link to="/contacto" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                Contacto
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-brand-orange transition-colors">
                Área de Clientes
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Contacto</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 text-brand-orange" />
              <a href="mailto:hola@editorialnovaemprende.com" className="hover:text-brand-orange transition-colors">
                hola@editorialnovaemprende.com
              </a>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-brand-orange transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-brand-orange transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-brand-orange transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 Editorial Nova Emprende. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
