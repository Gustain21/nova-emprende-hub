import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, User, Rocket, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PasswordField, isPasswordValid } from "@/components/auth/PasswordField";

const Registro = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/clientes", { replace: true });
  }, [loading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error, needsConfirmation } = await signUp(formData.email, formData.password, formData.fullName);
    setSubmitting(false);
    if (error) {
      toast.error("No se pudo crear la cuenta", { description: error });
      return;
    }
    if (needsConfirmation) {
      toast.success("Cuenta creada", {
        description: "Revisa tu email para confirmar tu cuenta antes de acceder.",
      });
      navigate("/login");
    } else {
      toast.success("¡Bienvenido!", { description: "Tu cuenta ya está activa." });
      navigate("/clientes");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="brand-container py-10">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border rounded-2xl p-8 md:p-10 bg-card/40"
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-14 h-14 rounded-xl bg-brand-orange flex items-center justify-center mb-5">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Crear cuenta
                </h1>
                <p className="text-muted-foreground text-sm">
                  Regístrate para acceder a tu área privada de clientes.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-bold text-foreground">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className="bg-muted border-border pl-11 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="bg-muted border-border pl-11 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-bold text-foreground">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      className="bg-muted border-border pl-11 h-12"
                    />
                  </div>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? "Creando cuenta..." : "Crear cuenta"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-border text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                  <Link to="/login" className="text-brand-orange hover:underline font-medium">
                    Acceder
                  </Link>
                </p>
                <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
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

export default Registro;
