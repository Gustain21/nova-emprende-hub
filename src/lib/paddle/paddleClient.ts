// Cliente Paddle.js compartido: carga script, obtiene client token vía edge
// function, inicializa entorno (sandbox/live) y expone helpers de checkout.

import { supabase } from "@/integrations/supabase/client";

const PADDLE_JS_SRC = "https://cdn.paddle.com/paddle/v2/paddle.js";

let paddleClientConfig: { token: string; environment: string } | null = null;
let paddleClientConfigPromise: Promise<{ token: string; environment: string }> | null = null;

export async function fetchPaddleClientConfig() {
  if (paddleClientConfig) return paddleClientConfig;
  if (paddleClientConfigPromise) return paddleClientConfigPromise;
  paddleClientConfigPromise = (async () => {
    const { data, error } = await supabase.functions.invoke("get-paddle-client-token", { body: {} });
    if (error) throw error;
    if (!data?.token) throw new Error(data?.detail || "No se pudo obtener el token de Paddle.");
    paddleClientConfig = { token: data.token, environment: data.environment || "sandbox" };
    return paddleClientConfig;
  })();
  return paddleClientConfigPromise;
}

let paddleLoaderPromise: Promise<any> | null = null;
export function loadPaddle(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  const w = window as any;
  if (w.Paddle) return Promise.resolve(w.Paddle);
  if (paddleLoaderPromise) return paddleLoaderPromise;
  paddleLoaderPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${PADDLE_JS_SRC}"]`) as HTMLScriptElement | null;
    const onReady = () =>
      w.Paddle ? resolve(w.Paddle) : reject(new Error("Paddle.js cargado pero objeto Paddle no disponible"));
    if (existing) {
      existing.addEventListener("load", onReady);
      existing.addEventListener("error", () => reject(new Error("No se pudo cargar Paddle.js")));
      if (w.Paddle) resolve(w.Paddle);
      return;
    }
    const s = document.createElement("script");
    s.src = PADDLE_JS_SRC;
    s.async = true;
    s.onload = onReady;
    s.onerror = () => reject(new Error("No se pudo cargar Paddle.js"));
    document.head.appendChild(s);
  });
  return paddleLoaderPromise;
}

let paddleInitialized = false;
export async function initPaddle(): Promise<any> {
  const Paddle = await loadPaddle();
  if (paddleInitialized) return Paddle;
  const { token, environment } = await fetchPaddleClientConfig();
  if (!token) throw new Error("Falta el client-side token de Paddle.");
  if (environment === "sandbox" && typeof Paddle.Environment?.set === "function") {
    Paddle.Environment.set("sandbox");
  }
  Paddle.Initialize({ token });
  paddleInitialized = true;
  return Paddle;
}

export async function openPaddleCheckout(transactionId: string) {
  const Paddle = await initPaddle();
  Paddle.Checkout.open({
    transactionId,
    settings: { displayMode: "overlay", theme: "dark", locale: "es" },
  });
}
