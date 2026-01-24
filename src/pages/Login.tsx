import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Rocket, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Sistema de autenticación", {
      description: "Conecta Lovable Cloud para habilitar login/registro.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 min-h-screen flex items-center brand-hero-gradient">
        <div className="brand-container py-20">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="brand-card"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {isLogin ? "Bienvenido de vuelta" : "Crear cuenta"}
                </h1>
                <p className="text-muted-foreground">
                  {isLogin
                    ? "Accede a tus productos y recursos"
                    : "Únete al ecosistema Nova Emprende"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Nombre completo
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className="bg-muted border-border"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="bg-muted border-border pl-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="bg-muted border-border pl-11"
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="text-right">
                    <a href="#" className="text-sm text-brand-orange hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                )}

                <Button type="submit" variant="hero" size="lg" className="w-full">
                  {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>

              {/* Toggle */}
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-brand-orange font-medium hover:underline"
                  >
                    {isLogin ? "Regístrate" : "Inicia Sesión"}
                  </button>
                </p>
              </div>

              {/* Back to home */}
              <div className="mt-4 text-center">
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  ← Volver al inicio
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
