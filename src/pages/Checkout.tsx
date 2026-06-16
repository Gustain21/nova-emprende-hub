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
import { selectPaymentProvider, type ProductLike } from "@/lib/payments/selectProvider";
import { useRegion } from "@/lib/region/RegionContext";

interface DbProduct extends ProductLike {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  currency: string | null;
}

const Checkout = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { user } = useAuth();

  const localProduct = productSlug ? getProductById(productSlug) : undefined;

  const { region } = useRegion();
  const autoCountry = region === "EU" ? "ES" : region === "LATAM" ? "MX" : "US";

  const [dbProduct, setDbProduct] = useState<DbProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const country = autoCountry;
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmail((e) => e || user?.email || "");
  }, [user]);

  const [wasCancelled, setWasCancelled] = useState(false);

  // Detectar payment=cancelled / _ptxn / ptxn y limpiar la URL para que el
  // siguiente click cree SIEMPRE una transacción nueva (no reutilizar la cancelada).
  useEffect(() => {
    const url = new URL(window.location.href);
    const hasCancelled = url.searchParams.get("payment") === "cancelled";
    const hasPtxn = url.searchParams.has("_ptxn") || url.searchParams.has("ptxn");
    if (hasCancelled || hasPtxn) {
      if (hasCancelled) setWasCancelled(true);
      url.searchParams.delete("payment");
      url.searchParams.delete("_ptxn");
      url.searchParams.delete("ptxn");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    }
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

  // TEMPORAL: forzamos Paddle para todos los países hasta que Stripe esté completamente configurado.
  // La selección automática por país queda preparada pero desactivada.
  // const selection = useMemo(
  //   () =>
  //     selectPaymentProvider(country, {
  //       stripe_price_id: dbProduct?.stripe_price_id,
  //       paddle_price_id: dbProduct?.paddle_price_id,
  //     }),
  //   [country, dbProduct],
  // );
  const selection= useMemo<ReturnType<typeof selectPaymentProvider>>(
    () =>
      dbProduct?.paddle_price_id
        ? { provider: "paddle", reason: "Paddle activo temporalmente para todos los países (modo test)." }
        : { provider: "none", reason: "Este producto aún no tiene paddle_price_id configurado." },
    [dbProduct],
  );

  const paymentStatus = wasCancelled ? "cancelled" : search.get("payment");

  const displayName = dbProduct?.name ?? localProduct?.title ?? "Producto";
  const displayDescription = dbProduct?.description ?? localProduct?.description ?? "";
  const displayPrice = dbProduct?.price ?? localProduct?.price ?? null;
  const displayCurrency = dbProduct?.currency ?? "EUR";

  const handleContinue = async () => {
    setError(null);

    if (!user) {
      navigate(`/login?next=/checkout/${productSlug}`);
      return;
    }
    if (!dbProduct) {
      setError("Producto no disponible en el catálogo de Lovable Cloud.");
      return;
    }
    if (selection.provider === "none") {
      setError(selection.reason);
      return;
    }

    setSubmitting(true);
    try {
      // TEMPORAL: usar siempre create-paddle-checkout hasta reactivar Stripe.
      const fnName = "create-paddle-checkout";
      const { data, error } = await supabase.functions.invoke(fnName, {
        body: {
          product_slug: dbProduct.slug,
          country,
          email,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url as string;
        return;
      }
      throw new Error(data?.error || "No se recibió URL de checkout.");
    } catch (e: any) {
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
              onClick={() => navigate(`/producto/${productSlug}`)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al producto
            </Button>
          </div>

          {paymentStatus === "cancelled" && (
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
                  {displayPrice != null ? `${Number(displayPrice).toFixed(2)} ${displayCurrency}` : "—"}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="text-sm text-foreground truncate">{email || "Inicia sesión"}</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">


              {!user && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Email del comprador</label>
                  <input
                    type="email"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                  />
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
            ) : !user ? (
              <Button variant="hero" size="xl" className="w-full" asChild>
                <Link to={`/login?next=/checkout/${productSlug}`}>Iniciar sesión para continuar</Link>
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
