// Detecta errores de enlaces de email de auth (confirmación/recuperación) en la URL.
// Solo reacciona si hay parámetros de error; un callback válido (access_token, code)
// sin error nunca se toca, para no interferir con el flujo nativo de sesión.

export type AuthLinkErrorKind = "caducado" | "invalido";

export const parseAuthLinkError = (hash: string, search = ""): AuthLinkErrorKind | null => {
  const read = (s: string) => new URLSearchParams(s.replace(/^[#?]/, ""));
  for (const p of [read(hash), read(search)]) {
    const code = p.get("error_code");
    const err = p.get("error");
    if (!code && !err) continue;
    return code === "otp_expired" ? "caducado" : "invalido";
  }
  return null;
};

// Capturado al cargar el módulo, antes de que el cliente de auth procese la URL.
export const initialAuthLinkError: AuthLinkErrorKind | null =
  typeof window === "undefined"
    ? null
    : parseAuthLinkError(window.location.hash, window.location.search);

export const RESEND_COOLDOWN_MS = 60_000;
const KEY = "nova_resend_confirm_at";

export const resendCooldownLeft = (now = Date.now(), last?: number | null): number => {
  const prev = last ?? Number(globalThis.localStorage?.getItem(KEY) || 0);
  return Math.max(0, prev + RESEND_COOLDOWN_MS - now);
};

export const markResendSent = (now = Date.now()) => {
  try {
    localStorage.setItem(KEY, String(now));
  } catch {
    /* noop */
  }
};
