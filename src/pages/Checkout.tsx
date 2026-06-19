import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, AlertTriangle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getProductById } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRegion, formatPrice } from "@/lib/region/RegionContext";

interface DbProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  stripe_price_id?: string | null;
  paddle_price_id?: string | null;
}

const STORAGE_KEY_HINTS = ["paddle", "checkout", "transaction", "ptxn", "payment", "purchase_pending"];

function purgeCheckoutStorage() {
  try {
    for (const storage of [window.localStorage, window.sessionStorage]) {
      const toDelete: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (!key) continue;
        const lk = key.toLowerCase();
        if (STORAGE_KEY_HINTS.some((h) => lk.includes(h))) toDelete.push(key);
      }
      toDelete.forEach((k) => storage.removeItem(k));
    }
  } catch {
    // ignore
  }
}

const Checkout = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { user } = useAuth();

  const localProduct = productSlug ? getProductById(productSlug) : undefined;

  const { region } = useRegion();
  const country = region === "EU" ? "ES" : region === "LATAM" ? "MX" : "US";

  const [dbProduct, setDbProduct] = useState<DbProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelledMessage, setCancelledMessage] = useState<boolean>(false);

  useEffect(() => {
    setEmail((e) => e || user?.email || "");
  }, [user]);

  // Init: decidir cancelledMessage SOLO desde los query params actuales,
  // limpiar la URL y purgar cualquier rastro de transacciones anteriores.
  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line no-console
    console.debug("[checkout] page loaded", { slug: productSlug, href: window.location.href });

    const params = new URLSearchParams(window.location.search);
    const paymentParam = params.get("payment");
    const isCancelled = paymentParam === "cancelled" || paymentParam === "canceled";

    // eslint-disable-next-line no-console
    console.debug("[checkout] query params detected", { payment: paymentParam });

    if (isCancelled) {
      setCancelledMessage(true);
      // eslint-disable-next-line no-console
      console.debug("[checkout] cancelled message set");
    } else {
      setCancelledMessage(false);
    }

    // Siempre purgar storage y limpiar la URL a su pathname.
    purgeCheckoutStorage();
    if (window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
    // eslint-disable-next-line no-console
    console.debug("[checkout] cancelled state cleared from storage/url");
  }, [productSlug]);

  useEffect(() => {
    if (!productSlug) return;
    setLoadingProduct(true);
    supabase
      .from("products")
      .select("id, slug, name, description, price, currency, stripe_price_id, paddle_price_id")
      .eq("slug", productSlug)
      .eq("active", true)
      .maybeSingle()
      .then(({ data }) => {
        setDbProduct((data as DbProduct) ?? null);
        setLoadingProduct(false);
      });
  }, [productSlug]);

  // TEMPORAL: Paddle siempre que el producto lo tenga configurado.
  const selection = useMemo(
    () =>
      dbProduct?.paddle_price_id
        ? { provider: "paddle" as const, reason: "Paddle activo temporalmente para todos los países (modo test)." }
        : { provider: "none" as const, reason: "Este producto aún no tiene paddle_price_id configurado." },
    [dbProduct],
  );

  const displayName = dbProduct?.name ?? localProduct?.title ?? "Producto";
  const displayDescription = dbProduct?.description ?? localProduct?.description ?? "";
  const displayPrice = dbProduct?.price ?? localProduct?.price ?? null;
  const displayCurrency = dbProduct?.currency ?? "EUR";

  const handleContinue = async () => {
    // Reset de estado anterior en cada click.
    setError(null);
    setCancelledMessage(false);
    purgeCheckoutStorage();

    if (!dbProduct) {
      setError("Producto no disponible en el catálogo.");
      return;
    }
    if (selection.provider === "none") {
      setError(selection.reason);
      return;
    }
    if (!user && !email) {
      setError("Introduce tu email para continuar.");
      return;
    }

    setSubmitting(true);
    try {
      // eslint-disable-next-line no-console
      console.debug("[checkout] creating new paddle transaction", { slug: dbProduct.slug });
      const { data, error: fnError } = await supabase.functions.invoke("create-paddle-checkout", {
        body: {
          product_slug: dbProduct.slug,
          country,
          email: user?.email ?? email,
        },
      });
      if (fnError) throw fnError;
      // eslint-disable-next-line no-console
      console.debug("[checkout] new paddle transaction received", data);

      const checkoutUrl: string | undefined = data?.url;
      const transactionId: string | undefined = data?.transaction_id;

      // Preferir Paddle.js si está disponible y tenemos transaction_id.
      const paddleGlobal = (window as any).Paddle;
      if (transactionId && paddleGlobal?.Checkout?.open) {
        // eslint-disable-next-line no-console
        console.debug("[checkout] opening paddle checkout via Paddle.js", { transactionId });
        paddleGlobal.Checkout.open({ transactionId });
        setSubmitting(false);
        return;
      }
      if (checkoutUrl) {
        // eslint-disable-next-line no-console
        console.debug("[checkout] opening paddle checkout via redirect", { checkoutUrl });
        window.location.href = checkoutUrl;
        return;
      }
      throw new Error(data?.error || "No se recibió URL ni transaction_id de checkout.");
    } catch (e: any) {
      setError(e?.message || "Error iniciando el checkout.");
      setSubmitting(false);
    }
  };

  // Solo mostrar mensaje cancelado si el state local lo marcó (proveniente exclusivamente de la URL actual).
  const showCancelled = cancelledMessage;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="brand-container max-w-3xl">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/producto/${productSlug}`)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al producto
            </Button>
          </div>

          {showCancelled && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
              <XCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="text-sm text-yellow-200">
                Pago cancelado. Puedes intentarlo nuevamente cuando quieras.
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="brand-card"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-brand-orange mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-orange" />
              Checkout · modo test / sandbox
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">{displayName}</h1>
            {displayDescription && (
              <p className="text-muted-foreground mb-6">{displayDescription}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="text-xs text-muted-foreground">Precio</div>
                <div className="text-2xl font-bold text-brand-orange">
                  {displayPrice != null ? formatPrice(Number(displayPrice), displayCurrency) : "—"}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="text-sm text-foreground truncate">
                  {user?.email || email || "Introduce tu email"}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {!user && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Email del comprador</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    ¿Ya tienes cuenta?{" "}
                    <Link to={`/login?next=/checkout/${productSlug}`} className="text-brand-orange hover:underline">
                      Inicia sesión
                    </Link>
                  </p>
                </div>
              )}

              <div className="p-3 rounded-lg border border-border bg-muted/20 text-sm">
                <div className="text-muted-foreground">Proveedor recomendado</div>
                <div className="flex items-center gap-2 text-foreground font-semibold capitalize">
                  {selection.provider === "none" ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      No disponible
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                      {selection.provider}
                    </>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{selection.reason}</div>
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
                disabled={submitting || selection.provider === "none"}
                onClick={handleContinue}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirigiendo…
                  </>
                ) : (
                  `Continuar al pago con ${selection.provider === "none" ? "—" : selection.provider}`
                )}
              </Button>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
              <ShieldCheck className="w-4 h-4 text-brand-orange" />
              Pago seguro · Paddle · modo test
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
