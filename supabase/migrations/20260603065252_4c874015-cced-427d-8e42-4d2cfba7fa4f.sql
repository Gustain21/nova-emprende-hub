
-- =========================
-- PRODUCTS
-- =========================
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  product_type text NOT NULL CHECK (product_type IN ('ebook','pdf','excel','app','bundle')),
  price numeric,
  currency text DEFAULT 'EUR',
  active boolean NOT NULL DEFAULT true,
  stripe_price_id text,
  paddle_price_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view active products"
  ON public.products FOR SELECT
  TO authenticated
  USING (active = true);

-- =========================
-- PURCHASES
-- =========================
CREATE TABLE public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  provider text CHECK (provider IN ('stripe','paddle','manual','demo')),
  provider_payment_id text,
  amount numeric,
  currency text DEFAULT 'EUR',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded','cancelled')),
  purchased_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.purchases TO authenticated;
GRANT ALL ON public.purchases TO service_role;

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases"
  ON public.purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- =========================
-- ENTITLEMENTS
-- =========================
CREATE TABLE public.entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  source_purchase_id uuid REFERENCES public.purchases(id) ON DELETE SET NULL,
  access_type text NOT NULL DEFAULT 'lifetime' CHECK (access_type IN ('lifetime','subscription','trial','manual')),
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.entitlements TO authenticated;
GRANT ALL ON public.entitlements TO service_role;

ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own entitlements"
  ON public.entitlements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Helper function: does the current user have an active entitlement for a product?
CREATE OR REPLACE FUNCTION public.has_active_entitlement(_user_id uuid, _product_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.entitlements
    WHERE user_id = _user_id
      AND product_id = _product_id
      AND active = true
      AND (expires_at IS NULL OR expires_at > now())
  );
$$;

-- =========================
-- FILES
-- =========================
CREATE TABLE public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('pdf','xlsx','zip','other')),
  version text DEFAULT '1.0',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.files TO authenticated;
GRANT ALL ON public.files TO service_role;

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files for products they own"
  ON public.files FOR SELECT
  TO authenticated
  USING (active = true AND public.has_active_entitlement(auth.uid(), product_id));

-- =========================
-- APP_ACCESS
-- =========================
CREATE TABLE public.app_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  app_name text NOT NULL,
  app_slug text UNIQUE NOT NULL,
  app_route text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.app_access TO authenticated;
GRANT ALL ON public.app_access TO service_role;

ALTER TABLE public.app_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view apps for products they own"
  ON public.app_access FOR SELECT
  TO authenticated
  USING (active = true AND public.has_active_entitlement(auth.uid(), product_id));

-- =========================
-- DEMO PRODUCTS + APP_ACCESS rows
-- =========================
INSERT INTO public.products (slug, name, description, product_type, price, currency) VALUES
  ('ebook-big-bang', 'Ebook El Big Bang de los Negocios', 'Ebook fundacional de Nova Emprende.', 'ebook', 29.00, 'EUR'),
  ('plantilla-financiera-excel', 'Plantilla Financiera Excel', 'Plantilla Excel profesional para planificación financiera.', 'excel', 19.00, 'EUR'),
  ('dashboard-financiero-web', 'Dashboard Financiero Web', 'Herramienta web privada de planificación financiera.', 'app', 49.00, 'EUR'),
  ('pack-completo-nova', 'Pack Completo NOVA EMPRENDE', 'Acceso a todos los productos de Nova Emprende.', 'bundle', 79.00, 'EUR');

INSERT INTO public.app_access (product_id, app_name, app_slug, app_route)
SELECT id, 'Plan Financiero', 'plan-financiero', '/clientes/herramientas/plan-financiero'
FROM public.products WHERE slug = 'dashboard-financiero-web';
