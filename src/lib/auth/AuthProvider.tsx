// AuthProvider — Fase 1: sesión simulada en memoria/localStorage.
// Fase 2: reemplazar el cuerpo por supabase.auth (signIn/signUp/signOut/onAuthStateChange).
// La API pública del context se mantendrá estable.

import { createContext, useEffect, useState, ReactNode } from "react";
import type { Profile } from "@/types/account";
import { MOCK_PROFILE } from "@/data/privateResources";

interface AuthContextValue {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "nova_mock_session";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MOCK: rehidrata sesión desde localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (profile: Profile | null) => {
    if (profile) localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    else localStorage.removeItem(STORAGE_KEY);
    setUser(profile);
  };

  const signIn: AuthContextValue["signIn"] = async (email) => {
    // MOCK: cualquier email/password válidos entran como MOCK_PROFILE
    if (!email) return { error: "Email requerido" };
    persist({ ...MOCK_PROFILE, email });
    return {};
  };

  const signUp: AuthContextValue["signUp"] = async (email, _password, fullName) => {
    if (!email) return { error: "Email requerido" };
    persist({ ...MOCK_PROFILE, email, fullName: fullName || MOCK_PROFILE.fullName });
    return {};
  };

  const signOut = async () => persist(null);

  const resetPassword: AuthContextValue["resetPassword"] = async () => {
    // MOCK: simula envío de email
    return {};
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
