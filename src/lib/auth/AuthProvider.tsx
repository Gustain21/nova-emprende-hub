// AuthProvider — Fase 2: Supabase Auth real.
// Mantiene la misma API pública que la fase mock para no romper componentes.

import { createContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/account";

interface AuthContextValue {
  user: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const toProfile = (u: User | null | undefined): Profile | null => {
  if (!u) return null;
  return {
    id: u.id,
    email: u.email ?? "",
    fullName: (u.user_metadata?.full_name as string) || (u.email?.split("@")[0] ?? "Cliente"),
    avatarUrl: (u.user_metadata?.avatar_url as string) || undefined,
    createdAt: u.created_at ?? new Date().toISOString(),
  };
};

const AUTH_ERROR_KEYS = ["error", "error_code", "error_description", "access_denied", "otp_expired"];

const cleanAuthErrorParams = () => {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    let changed = false;
    AUTH_ERROR_KEYS.forEach((k) => {
      if (url.searchParams.has(k)) {
        url.searchParams.delete(k);
        changed = true;
      }
    });
    const hash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
    if (hash) {
      const hp = new URLSearchParams(hash);
      let hashChanged = false;
      AUTH_ERROR_KEYS.forEach((k) => {
        if (hp.has(k)) {
          hp.delete(k);
          hashChanged = true;
        }
      });
      if (hashChanged) {
        const rest = hp.toString();
        url.hash = rest ? `#${rest}` : "";
        changed = true;
      }
    }
    if (changed) {
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
  } catch {
    /* noop */
  }
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Listener primero (síncrono) para evitar perder eventos
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(toProfile(newSession?.user));
      if (newSession) cleanAuthErrorParams();
    });

    // 2) Luego hidratación inicial
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(toProfile(data.session?.user));
      setLoading(false);
      if (data.session) cleanAuthErrorParams();
    });

    return () => sub.subscription.unsubscribe();
  }, []);


  const signIn: AuthContextValue["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signUp: AuthContextValue["signUp"] = async (email, password, fullName) => {
    const redirectUrl = `${window.location.origin}/clientes`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName },
      },
    });
    if (error) return { error: error.message };
    // Si auto-confirm está activo, session existe. Si no, requiere confirmación por email.
    return { needsConfirmation: !data.session };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword: AuthContextValue["resetPassword"] = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { error: error.message };
    return {};
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
