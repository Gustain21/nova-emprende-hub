import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, KeyRound, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PasswordField, isPasswordValid } from "@/components/auth/PasswordField";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  // Modo "recovery": el usuario llegó desde el email con type=recovery → mostramos form para fijar nueva contraseña
  const [isRecovery, setIsRecovery] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const hash = window.location.hash || "";
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await resetPassword(email);
    setSubmitting(false);
    if (error) {
      toast.error("No se pudo enviar el email", { description: error });
      return;
    }
    toast.success("Email enviado", {
      description: "Revisa tu bandeja para restablecer la contraseña.",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid(newPassword)) {
      toast.error("Tu contraseña todavía no cumple los requisitos mínimos de seguridad.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSubmitting(false);
    if (error) {
      toast.error("No se pudo actualizar la contraseña", { description: error.message });
      return;
    }
    toast.success("Contraseña actualizada");
    navigate("/clientes", { replace: true });
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
                  <KeyRound className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {isRecovery ? "Nueva contraseña" : "Recuperar contraseña"}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {isRecovery
                    ? "Introduce tu nueva contraseña para acceder a tu cuenta."
                    : "Te enviaremos un email para restablecer tu acceso."}
                </p>
              </div>

              {isRecovery ? (
                <form onSubmit={handleUpdate} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-bold text-foreground">
                      Nueva contraseña
                    </label>
                    <PasswordField
                      id="newPassword"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Crea una contraseña segura"
                      showRequirements
                    />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? "Actualizando..." : "Guardar nueva contraseña"}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRequest} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-foreground">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="bg-muted border-border pl-11 h-12"
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? "Enviando..." : "Enviar email de recuperación"}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>
              )}

              <div className="mt-8 pt-6 border-t border-border text-center space-y-3">
                <Link to="/login" className="block text-sm text-brand-orange hover:underline">
                  ← Volver al login
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

export default ResetPassword;
