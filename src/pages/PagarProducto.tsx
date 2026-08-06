import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, AlertTriangle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getProductById } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRegion } from "@/lib/region/RegionContext";
import { LocalizedPrice } from "@/lib/pricing/LocalizedPrice";
import { PADDLE_PRICE_IDS } from "@/lib/pricing/paddlePriceIds";


interface DbProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  paddle_price_id?: string | null;
}

const PADDLE_JS_SRC = "https://cdn.paddle.com/paddle/v2/paddle.js";

let paddleClientConfig: { token: string; environment: string } | null = null;
let paddleClientConfigPromise: Promise<{ token: string; environment: string }> | null = null;
async function fetchPaddleClientConfig() {
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

function extractPtxnFromUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url, window.location.origin);
    return u.searchParams.get("_ptxn") || u.searchParams.get("ptxn");
  } catch {
    return null;
  }
}

let paddleLoaderPromise: Promise<any> | null = null;
function loadPaddle(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  const w = window as any;
  if (w.Paddle) return Promise.resolve(w.Paddle);
  if (paddleLoaderPromise) return paddleLoaderPromise;
  console.log("[pagar] Paddle.js loading");
  paddleLoaderPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${PADDLE_JS_SRC}"]`) as HTMLScriptElement | null;
    const onReady = () => (w.Paddle ? resolve(w.Paddle) : reject(new Error("Paddle.js cargado pero objeto Paddle no disponible")));
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
async function initPaddle(): Promise<any> {
  const Paddle = await loadPaddle();
  if (paddleInitialized) return Paddle;
  const { token, environment } = await fetchPaddleClientConfig();
  if (!token) {
    throw new Error("Falta el client-side token de Paddle (PADDLE_CLIENT_TOKEN).");
  }
  try {
    if (environment === "sandbox" && typeof Paddle.Environment?.set === "function") {
      Paddle.Environment.set("sandbox");
    }
    Paddle.Initialize({ token });
    paddleInitialized = true;
    console.log("[pagar] Paddle initialized", { env: environment });
    return Paddle;
  } catch (e) {
    paddleInitialized = false;
    throw e;
  }
}

async function openPaddleCheckout(transactionId: string) {
  const Paddle = await initPaddle();
  console.log("[pagar] opening Paddle checkout with transactionId", transactionId);
  Paddle.Checkout.open({
    transactionId,
    settings: {
      displayMode: "overlay",
      theme: "dark",
      locale: "es",
    },
  });
}

const PagarProducto = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { region } = useRegion();
  const country = region === "EU" ? "ES" : region === "LATAM" ? "MX" : "US";

  const localProduct = slug ? getProductById(slug) : undefined;
  const [dbProduct, setDbProduct] = useState<DbProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  // IMPORTANT: never prefill from user/session/localStorage. The buyer email
  // must be exactly what is typed in the form for this transaction.
  const [buyerEmail, setBuyerEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [acceptLegal, setAcceptLegal] = useState(false);
  const [acceptDigital, setAcceptDigital] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugBuyerEmail, setDebugBuyerEmail] = useState<string | null>(null);
  const autoOpenedRef = useRef(false);

  // Cancelled / success derive EXCLUSIVELY from current URL
  const { cancelled, success, urlPtxn } = useMemo(() => {
    if (typeof window === "undefined") return { cancelled: false, success: false, urlPtxn: null as string | null };
    const sp = new URLSearchParams(window.location.search);
    const p = sp.get("payment");
    return {
      cancelled: p === "cancelled" || p === "canceled",
      success: p === "success",
      urlPtxn: sp.get("_ptxn") || sp.get("ptxn"),
    };
  }, []);

  // No prefill: buyerEmail must come exclusively from manual input.


  useEffect(() => {
    if (!slug) return;
    setLoadingProduct(true);
    supabase
      .from("products")
      .select("id, slug, name, description, price, currency, paddle_price_id")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle()
      .then(({ data }) => {
        setDbProduct((data as DbProduct) ?? null);
        setLoadingProduct(false);
      });
  }, [slug]);

  // Auto-open Paddle if URL contains _ptxn and is not a cancelled/success return
  useEffect(() => {
    if (autoOpenedRef.current) return;
    if (!urlPtxn) return;
    if (cancelled || success) return;
    autoOpenedRef.current = true;
    console.log("[pagar] _ptxn detected in URL", urlPtxn);
    (async () => {
      try {
        console.log("[pagar] opening Paddle checkout from _ptxn");
        await openPaddleCheckout(urlPtxn);
      } catch (e: any) {
        console.error("[pagar] error opening from _ptxn", e);
        setError(e?.message || "Error abriendo Paddle Checkout.");
      }
    })();
  }, [urlPtxn, cancelled, success]);

  const displayName = dbProduct?.name ?? localProduct?.title ?? "Producto";
  const displayDescription = dbProduct?.description ?? localProduct?.description ?? "";
  const displayPrice = dbProduct?.price ?? localProduct?.price ?? null;
  const displayCurrency = dbProduct?.currency ?? "EUR";
  const hasPaddle = !!dbProduct?.paddle_price_id;

  const handleContinue = async () => {
    setError(null);
    setDebugBuyerEmail(null);
    if (!dbProduct) return setError("Producto no disponible.");
    if (!hasPaddle) return setError("Este producto no tiene Paddle configurado.");
    if (!acceptLegal) return setError("Debes aceptar los Términos y Condiciones y la Política de Reembolsos, y declarar haber leído la Política de Privacidad.");
    if (!acceptDigital) return setError("Debes confirmar el consentimiento de acceso inmediato al contenido digital.");



    // SOURCE OF TRUTH: only the manually-typed input. No session/localStorage fallback.
    const emailToSend = buyerEmail.trim().toLowerCase();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailToSend || !emailRe.test(emailToSend)) {
      return setError("Introduce un email válido para continuar.");
    }
    console.log("[pagar] buyer email to send to Paddle:", emailToSend);

    setSubmitting(true);
    try {
      // Pre-init Paddle.js in parallel so it's ready when transaction arrives
      initPaddle().catch((e) => console.warn("[pagar] paddle preinit warn", e));

      const { data, error: fnError } = await supabase.functions.invoke("create-paddle-checkout", {
        body: {
          slug: dbProduct.slug,
          email: emailToSend,
          country,
          consent: {
            accept_terms: true,
            accept_refunds: true,
            read_privacy: true,
            accept_immediate_access: true,
            acknowledge_withdrawal_loss: true,
            legal_version: "2026-08-06",
            user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
          },
        },
      });

      if (fnError) throw fnError;


      if (data?.error) {
        const code = data.code ? ` [${data.code}]` : "";
        throw new Error(`${data.detail || data.error}${code}`);
      }

      if (data?.debug_buyer_email) {
        setDebugBuyerEmail(data.debug_buyer_email);
        console.log("[pagar] debug_buyer_email returned by edge fn:", data.debug_buyer_email);
      }

      let transactionId: string | undefined = data?.transaction_id;
      const checkoutUrl: string | undefined = data?.checkout_url || data?.url;


      if (transactionId) {
        console.log("[pagar] transaction_id received", transactionId);
      } else if (checkoutUrl) {
        console.log("[pagar] checkout_url received", checkoutUrl);
        const fromUrl = extractPtxnFromUrl(checkoutUrl);
        if (fromUrl) transactionId = fromUrl;
      }

      if (transactionId) {
        await openPaddleCheckout(transactionId);
        setSubmitting(false);
        return;
      }

      // Only redirect if checkout_url is an external Paddle URL (not our own domain)
      if (checkoutUrl) {
        try {
          const u = new URL(checkoutUrl);
          const ownHost = window.location.hostname;
          if (u.hostname !== ownHost && !u.hostname.endsWith("lovable.app")) {
            window.location.href = checkoutUrl;
            return;
          }
        } catch {
          /* ignore */
        }
      }

      throw new Error("No se recibió transaction_id de Paddle.");
    } catch (e: any) {
      console.error("[pagar] checkout error", e);
      setError(e?.message || "Error iniciando el checkout.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="brand-container max-w-3xl">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/producto/${slug}`)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al producto
            </Button>
          </div>

          {cancelled && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
              <XCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="text-sm text-yellow-200">
                Pago cancelado. Puedes intentarlo nuevamente cuando quieras.
              </div>
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="brand-card">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-brand-orange mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-orange" />
              Pago seguro · Paddle
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">{displayName}</h1>
            {displayDescription && <p className="text-muted-foreground mb-6">{displayDescription}</p>}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="text-xs text-muted-foreground">Precio</div>
                <LocalizedPrice
                  priceId={dbProduct?.paddle_price_id || (slug ? PADDLE_PRICE_IDS[slug] : null)}
                  fallbackEur={Number(displayPrice ?? 0)}
                  className="text-2xl font-bold text-brand-orange"
                />
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="text-xs text-muted-foreground">Email comprador</div>
                <div className="text-sm text-foreground truncate">
                  {buyerEmail || "Introduce tu email"}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-muted-foreground mb-1">Email del comprador</label>
              <input
                type="email"
                required
                autoComplete="off"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="tu@email.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                El recibo y el acceso se enviarán exactamente a este email.
                {!user && (
                  <>
                    {" "}¿Ya tienes cuenta?{" "}
                    <Link to={`/login?next=/pagar/${slug}`} className="text-brand-orange hover:underline">
                      Inicia sesión
                    </Link>
                  </>
                )}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptLegal}
                  onChange={(e) => setAcceptLegal(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--brand-orange))]"
                />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  He leído y acepto los{" "}
                  <Link to="/terminos" className="text-brand-orange hover:underline">Términos y Condiciones</Link>{" "}
                  y la <Link to="/reembolsos" className="text-brand-orange hover:underline">Política de Reembolsos</Link>,
                  y declaro haber leído la{" "}
                  <Link to="/privacidad" className="text-brand-orange hover:underline">Política de Privacidad</Link>.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptDigital}
                  onChange={(e) => setAcceptDigital(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--brand-orange))]"
                />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  Solicito expresamente que el contenido digital adquirido esté disponible de forma inmediata, antes de que
                  finalice el plazo de desistimiento que pudiera corresponderme, y reconozco que, una vez iniciada la descarga,
                  el acceso o la utilización del contenido, puedo perder mi derecho de desistimiento cuando así lo establezca
                  la legislación aplicable.
                </span>

              </label>
            </div>


            <div className="p-3 rounded-lg border border-border bg-muted/20 text-sm mb-6">
              <div className="text-muted-foreground">Proveedor de pago</div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                {hasPaddle ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                    Paddle
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    No disponible
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {loadingProduct ? (
              <Button variant="hero" size="xl" disabled className="w-full">
                <Loader2 className="w-5 h-5 animate-spin" />
                Cargando producto…
              </Button>
            ) : (
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                disabled={submitting || !hasPaddle}
                onClick={handleContinue}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Abriendo Paddle…
                  </>
                ) : (
                  "Continuar al pago con paddle"
                )}
              </Button>
            )}

            {debugBuyerEmail && (
              <div className="mt-3 text-xs text-muted-foreground">
                Email enviado a Paddle: <span className="text-brand-orange font-mono">{debugBuyerEmail}</span>
              </div>
            )}


            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
              <ShieldCheck className="w-4 h-4 text-brand-orange" />
              Pago seguro · Paddle
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PagarProducto;
