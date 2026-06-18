import { useEffect, useMemo, useState } from "react";
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

interface DbProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  paddle_price_id?: string | null;
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
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cancelled state derives EXCLUSIVELY from current URL — no storage, no purchases.
  const cancelled = useMemo(() => {
    if (typeof window === "undefined") return false;
    const p = new URLSearchParams(window.location.search).get("payment");
    return p === "cancelled" || p === "canceled";
  }, []);

  useEffect(() => {
    setEmail((e) => e || user?.email || "");
  }, [user]);

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

  const displayName = dbProduct?.name ?? localProduct?.title ?? "Producto";
  const displayDescription = dbProduct?.description ?? localProduct?.description ?? "";
  const displayPrice = dbProduct?.price ?? localProduct?.price ?? null;
  const displayCurrency = dbProduct?.currency ?? "EUR";
  const hasPaddle = !!dbProduct?.paddle_price_id;

  const handleContinue = async () => {
    setError(null);
    if (!dbProduct) return setError("Producto no disponible.");
    if (!hasPaddle) return setError("Este producto no tiene Paddle configurado.");
    if (!user && !email) return setError("Introduce tu email para continuar.");

    setSubmitting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-paddle-checkout", {
        body: { product_slug: dbProduct.slug, country, email: user?.email ?? email },
      });
      if (fnError) throw fnError;

      const checkoutUrl: string | undefined = data?.url;
      const transactionId: string | undefined = data?.transaction_id;
      const paddleGlobal = (window as any).Paddle;
      if (transactionId && paddleGlobal?.Checkout?.open) {
        paddleGlobal.Checkout.open({ transactionId });
        setSubmitting(false);
        return;
      }
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }
      throw new Error(data?.error || "No se recibió checkout de Paddle.");
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
                <div className="text-2xl font-bold text-brand-orange">
                  {displayPrice != null ? `${Number(displayPrice).toFixed(2)} ${displayCurrency}` : "—"}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="text-sm text-foreground truncate">
                  {user?.email || email || "Introduce tu email"}
                </div>
              </div>
            </div>

            {!user && (
              <div className="mb-4">
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
                  <Link to={`/login?next=/pagar/${slug}`} className="text-brand-orange hover:underline">
                    Inicia sesión
                  </Link>
                </p>
              </div>
            )}

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
                    Redirigiendo…
                  </>
                ) : (
                  "Continuar al pago con paddle"
                )}
              </Button>
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
