import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Rocket, ArrowRight, LayoutGrid, FileText, KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    icon: LayoutGrid,
    title: "Tus apps y herramientas",
    description: "Accede a las aplicaciones web y recursos que hayas comprado dentro de NOVA EMPRENDE.",
  },
  {
    icon: FileText,
    title: "Tus materiales y recursos",
    description: "Centraliza tus ebooks, plantillas y contenidos en un mismo espacio privado.",
  },
  {
    icon: KeyRound,
    title: "Tu acceso como cliente",
    description: "El acceso se habilita después de la compra, según los productos o packs que correspondan.",
  },
];

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  // Si ya hay sesión, redirige a /clientes
  useEffect(() => {
    if (!loading && user) navigate("/clientes", { replace: true });
  }, [loading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(formData.email, formData.password);
    if (error) {
      toast.error("No se pudo acceder", { description: error });
      return;
    }
    toast.success("Acceso correcto", {
      description: "Bienvenido a tu área de clientes.",
    });
    navigate("/clientes");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="brand-container py-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="w-14 h-14 rounded-xl bg-brand-orange flex items-center justify-center">
                <Rocket className="w-7 h-7 text-white" />
              </div>

              <div className="space-y-5">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  Acceso clientes
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                  Entra a tu espacio privado para acceder a las apps, herramientas y recursos que hayas comprado dentro de NOVA EMPRENDE.
                </p>
              </div>

              <div className="space-y-4">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="border border-border rounded-xl p-5 bg-card/40"
                  >
                    <div className="flex items-start gap-3">
                      <feature.icon className="w-5 h-5 text-brand-orange mt-1 shrink-0" />
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right column - form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-border rounded-2xl p-8 md:p-10 bg-card/40"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Entrar a mi área privada
                </h2>
                <p className="text-muted-foreground text-sm">
                  Si ya compraste, aquí encontrarás tu acceso a herramientas y recursos.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="bg-muted border-border pl-11 h-12"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <Link to="/reset-password" className="text-sm text-brand-orange hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Acceder a mis herramientas
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-border space-y-5 text-center">
                <p className="text-sm text-foreground">
                  ¿No tienes cuenta?{" "}
                  <Link to="/registro" className="text-brand-orange hover:underline font-medium">
                    Crear cuenta
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Si todavía no tienes acceso, este espacio se activará después de la compra de las apps, herramientas o packs correspondientes.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Al acceder a tu espacio privado, el uso de tus recursos y herramientas sigue sujeto a nuestras{" "}
                  <Link to="/terminos" className="text-brand-orange hover:underline">
                    condiciones de compra
                  </Link>{" "}
                  y{" "}
                  <Link to="/privacidad" className="text-brand-orange hover:underline">
                    política de privacidad
                  </Link>
                  .
                </p>
                <Link to="/contacto" className="block text-sm text-brand-orange hover:underline">
                  ¿Necesitas ayuda con tu acceso?
                </Link>
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

export default Login;
