import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { markResendSent, resendCooldownLeft } from "@/lib/auth/authLinkError";

const GENERIC =
  "Si existe una cuenta pendiente de confirmar con ese email, te hemos enviado un nuevo enlace. Revisa también la carpeta de spam.";

const ResendConfirmation = () => {
  const [email, setEmail] = useState("");
  const [left, setLeft] = useState(() => resendCooldownLeft());
  const [msg, setMsg] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft(resendCooldownLeft()), 1000);
    return () => clearInterval(t);
  }, [left]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean || left > 0 || sending) return;
    setSending(true);
    // El resultado no se muestra: mismo mensaje exista o no la cuenta (anti-enumeración).
    await supabase.auth
      .resend({ type: "signup", email: clean, options: { emailRedirectTo: `${window.location.origin}/clientes` } })
      .catch(() => undefined);
    markResendSent();
    setLeft(resendCooldownLeft());
    setSending(false);
    setMsg(GENERIC);
  };

  const secs = Math.ceil(left / 1000);
  return (
    <form onSubmit={submit} className="space-y-3" aria-label="Reenviar email de confirmación">
      <label htmlFor="resend-email" className="text-sm font-bold text-foreground">
        Reenviar email de confirmación
      </label>
      <Input
        id="resend-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        className="bg-muted border-border h-11"
      />
      <Button type="submit" variant="outline" className="w-full" disabled={sending || left > 0}>
        {left > 0 ? `Podrás reenviar en ${secs} s` : sending ? "Enviando..." : "Reenviar confirmación"}
      </Button>
      {msg && (
        <p role="status" className="text-sm text-muted-foreground">
          {msg}
        </p>
      )}
    </form>
  );
};

export default ResendConfirmation;
