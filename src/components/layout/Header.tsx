import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logoNovaEmprende from "@/assets/logo-nova-emprende.png";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const clientesHref = user ? "/clientes" : "/login";

  const navItems = [
    { label: "Inicio", href: "/#inicio" },
    { label: "Ebook", href: "/#ebook" },
    { label: "Ecosistema", href: "/#ecosistema" },
    { label: "Packs", href: "/#packs" },
    { label: "Testimonios", href: "/#testimonios" },
    { label: "Contacto", href: "/contacto" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="brand-container">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link to="/" className="flex items-center group">
            <img
              src={logoNovaEmprende}
              alt="Nova Emprende"
              className="h-[60px] md:h-[72px] w-auto group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to={clientesHref} className="text-sm font-medium text-foreground hover:text-brand-orange transition-colors">
              Acceso clientes
            </Link>
            <Link to="/producto/ebook">
              <Button variant="cta" size="sm">
                Ver producto principal
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-b border-border"
          >
            <nav className="brand-container py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Link to={clientesHref} onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Acceso clientes</Button>
                </Link>
                <Link to="/producto/ebook" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="cta" className="w-full">Ver producto principal</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
