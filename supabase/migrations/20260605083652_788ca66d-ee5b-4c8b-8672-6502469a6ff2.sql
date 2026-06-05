
-- ===========================================================
-- NOVA EMPRENDE — Fase comercial: regiones EUR/USD, packs, bundles, impuestos
-- ===========================================================

-- 1) Ampliar tabla products con regiones, oferta, impuestos
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS price_eur numeric,
  ADD COLUMN IF NOT EXISTS price_usd numeric,
  ADD COLUMN IF NOT EXISTS regular_price_eur numeric,
  ADD COLUMN IF NOT EXISTS regular_price_usd numeric,
  ADD COLUMN IF NOT EXISTS sale_price_eur numeric,
  ADD COLUMN IF NOT EXISTS sale_price_usd numeric,
  ADD COLUMN IF NOT EXISTS display_currency text,
  ADD COLUMN IF NOT EXISTS default_region text,
  ADD COLUMN IF NOT EXISTS sale_active boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sale_discount_percent numeric,
  ADD COLUMN IF NOT EXISTS sale_ends_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS payment_provider_eu text DEFAULT 'stripe',
  ADD COLUMN IF NOT EXISTS payment_provider_latam text DEFAULT 'paddle',
  ADD COLUMN IF NOT EXISTS payment_provider_intl text DEFAULT 'paddle',
  ADD COLUMN IF NOT EXISTS tax_category text,
  ADD COLUMN IF NOT EXISTS tax_behavior text DEFAULT 'inclusive',
  ADD COLUMN IF NOT EXISTS tax_rate_hint numeric,
  ADD COLUMN IF NOT EXISTS stripe_tax_code text,
  ADD COLUMN IF NOT EXISTS paddle_tax_category text,
  ADD COLUMN IF NOT EXISTS short_value_text text,
  ADD COLUMN IF NOT EXISTS cross_sell_text text;

-- 2) Ampliar tabla purchases con desglose fiscal + datos del comprador
ALTER TABLE public.purchases
  ADD COLUMN IF NOT EXISTS subtotal_amount numeric,
  ADD COLUMN IF NOT EXISTS tax_amount numeric,
  ADD COLUMN IF NOT EXISTS total_amount numeric,
  ADD COLUMN IF NOT EXISTS tax_country text,
  ADD COLUMN IF NOT EXISTS tax_rate numeric,
  ADD COLUMN IF NOT EXISTS tax_provider text,
  ADD COLUMN IF NOT EXISTS tax_status text,
  ADD COLUMN IF NOT EXISTS buyer_country text,
  ADD COLUMN IF NOT EXISTS buyer_region text,
  ADD COLUMN IF NOT EXISTS buyer_currency text;

-- 3) Crear tabla bundle_items
CREATE TABLE IF NOT EXISTS public.bundle_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  included_product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (bundle_product_id, included_product_id)
);

GRANT SELECT ON public.bundle_items TO authenticated;
GRANT SELECT ON public.bundle_items TO anon;
GRANT ALL ON public.bundle_items TO service_role;

ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bundle items"
  ON public.bundle_items
  FOR SELECT
  USING (true);

-- 4) Permitir lectura pública (anon) del catálogo activo
DROP POLICY IF EXISTS "Authenticated users can view active products" ON public.products;
CREATE POLICY "Anyone can view active products"
  ON public.products
  FOR SELECT
  USING (active = true);
GRANT SELECT ON public.products TO anon;

-- 5) Renombrar slugs existentes para alinearlos con la nueva nomenclatura
UPDATE public.products SET slug = 'el-big-bang-de-los-negocios' WHERE slug = 'ebook-big-bang';
UPDATE public.products SET slug = 'dashboard-financiero'        WHERE slug = 'dashboard-financiero-web';
UPDATE public.products SET slug = 'plan-financiero-infoproducto' WHERE slug = 'plantilla-financiera-excel';
UPDATE public.products SET active = false                       WHERE slug = 'pack-completo-nova';

-- 6) Upsert del catálogo definitivo (productos individuales)
INSERT INTO public.products (slug, name, description, product_type, price, currency,
  price_eur, price_usd, regular_price_eur, regular_price_usd,
  sale_price_eur, sale_price_usd, sale_active, sale_discount_percent, sale_ends_at,
  tax_category, tax_behavior, tax_rate_hint, active)
VALUES
  ('el-big-bang-de-los-negocios', 'El Big Bang de los Negocios',
   'Guía práctica para transformar tus ideas en negocios rentables. 15 capítulos con metodología paso a paso.',
   'ebook', 19.99, 'EUR', 19.99, 19, 29.99, 29, 19.99, 19,
   true, 30, '2026-08-31 23:59:59+00',
   'ebook', 'inclusive', 4, true),
  ('bitacora-del-capitan', 'La Bitácora del Capitán',
   'Cuaderno de trabajo oficial para aplicar paso a paso el método del ebook.',
   'pdf', 19.99, 'EUR', 19.99, 19, 19.99, 19, NULL, NULL,
   false, NULL, NULL,
   'digital_publication', 'inclusive', 4, true),
  ('guia-de-prompts', 'La Guía de Prompts',
   'Guía práctica para usar inteligencia artificial como apoyo en la creación, planificación y mejora de tu proyecto emprendedor.',
   'pdf', 9.99, 'EUR', 9.99, 9, 9.99, 9, NULL, NULL,
   false, NULL, NULL,
   'digital_publication', 'inclusive', 4, true),
  ('dashboard-financiero', 'Dashboard Financiero',
   'Herramienta web para visualizar la salud financiera de tu proyecto, analizar gastos, ventas, márgenes y tomar decisiones con más claridad.',
   'app', 27.99, 'EUR', 27.99, 29, 27.99, 29, NULL, NULL,
   false, NULL, NULL,
   'digital_service', 'inclusive', 21, true),
  ('planner-ejecucion-90-dias', 'Planner de Ejecución 90 Días',
   'Sistema de planificación para transformar objetivos en acciones concretas durante los próximos 90 días.',
   'app', 14.99, 'EUR', 14.99, 15, 14.99, 15, NULL, NULL,
   false, NULL, NULL,
   'digital_service', 'inclusive', 21, true),
  ('plan-financiero-infoproducto', 'Plan Financiero Infoproducto',
   'Plantilla financiera pensada específicamente para infoproductos, cursos, ebooks, plantillas digitales y productos online.',
   'excel', 15.99, 'EUR', 15.99, 16, 15.99, 16, NULL, NULL,
   false, NULL, NULL,
   'digital_tool', 'inclusive', 21, true),
  ('plan-financiero-ecommerce', 'Plan Financiero E-commerce',
   'Plantilla financiera pensada para e-commerce, venta de productos físicos, control de costes, márgenes, inversión y rentabilidad.',
   'excel', 15.99, 'EUR', 15.99, 16, 15.99, 16, NULL, NULL,
   false, NULL, NULL,
   'digital_tool', 'inclusive', 21, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  product_type = EXCLUDED.product_type,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  price_eur = EXCLUDED.price_eur,
  price_usd = EXCLUDED.price_usd,
  regular_price_eur = EXCLUDED.regular_price_eur,
  regular_price_usd = EXCLUDED.regular_price_usd,
  sale_price_eur = EXCLUDED.sale_price_eur,
  sale_price_usd = EXCLUDED.sale_price_usd,
  sale_active = EXCLUDED.sale_active,
  sale_discount_percent = EXCLUDED.sale_discount_percent,
  sale_ends_at = EXCLUDED.sale_ends_at,
  tax_category = EXCLUDED.tax_category,
  tax_behavior = EXCLUDED.tax_behavior,
  tax_rate_hint = EXCLUDED.tax_rate_hint,
  active = true;

-- 7) Upsert de los packs (bundles)
INSERT INTO public.products (slug, name, description, product_type, price, currency,
  price_eur, price_usd, regular_price_eur, regular_price_usd,
  sale_active, tax_category, tax_behavior, active)
VALUES
  ('pack-base', 'Pack Base',
   'El punto de partida ideal para comprender el método y comenzar a aplicarlo con una guía práctica de trabajo.',
   'bundle', 31.99, 'EUR', 31.99, 32, 39.98, 38, false, 'mixed_bundle', 'inclusive', true),
  ('pack-impulso', 'Pack Impulso',
   'El pack ideal para emprendedores que quieren avanzar con más claridad: método, acción, IA práctica y control financiero en una misma compra.',
   'bundle', 55.99, 'EUR', 55.99, 59, 77.96, 76, false, 'mixed_bundle', 'inclusive', true),
  ('pack-dominio', 'Pack Dominio',
   'La opción más completa para quien quiere apoyarse desde el inicio en contenidos, ejecución, planificación, IA y control financiero.',
   'bundle', 89.99, 'EUR', 89.99, 89, 124.93, 126, false, 'mixed_bundle', 'inclusive', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  product_type = EXCLUDED.product_type,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  price_eur = EXCLUDED.price_eur,
  price_usd = EXCLUDED.price_usd,
  regular_price_eur = EXCLUDED.regular_price_eur,
  regular_price_usd = EXCLUDED.regular_price_usd,
  tax_category = EXCLUDED.tax_category,
  tax_behavior = EXCLUDED.tax_behavior,
  active = true;

-- 8) Relaciones bundle_items (idempotentes)
WITH p AS (
  SELECT slug, id FROM public.products
)
INSERT INTO public.bundle_items (bundle_product_id, included_product_id)
SELECT b.id, i.id
FROM (VALUES
  ('pack-base','el-big-bang-de-los-negocios'),
  ('pack-base','bitacora-del-capitan'),
  ('pack-impulso','el-big-bang-de-los-negocios'),
  ('pack-impulso','bitacora-del-capitan'),
  ('pack-impulso','guia-de-prompts'),
  ('pack-impulso','dashboard-financiero'),
  ('pack-dominio','el-big-bang-de-los-negocios'),
  ('pack-dominio','bitacora-del-capitan'),
  ('pack-dominio','guia-de-prompts'),
  ('pack-dominio','dashboard-financiero'),
  ('pack-dominio','planner-ejecucion-90-dias'),
  ('pack-dominio','plan-financiero-infoproducto'),
  ('pack-dominio','plan-financiero-ecommerce')
) AS rel(bundle_slug, included_slug)
JOIN p b ON b.slug = rel.bundle_slug
JOIN p i ON i.slug = rel.included_slug
ON CONFLICT (bundle_product_id, included_product_id) DO NOTHING;
