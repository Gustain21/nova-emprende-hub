
-- 1) Funciones para conceder/revocar entitlements, expandiendo packs (bundle_items).
CREATE OR REPLACE FUNCTION public.grant_purchase_entitlements(
  p_user_id uuid,
  p_product_id uuid,
  p_purchase_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_type text;
  v_included uuid;
BEGIN
  SELECT product_type INTO v_type FROM public.products WHERE id = p_product_id;

  -- Entitlement para el propio producto comprado (incluido el bundle).
  IF NOT EXISTS (
    SELECT 1 FROM public.entitlements
    WHERE user_id = p_user_id AND product_id = p_product_id AND active = true
  ) THEN
    INSERT INTO public.entitlements (user_id, product_id, active, access_type, source_purchase_id)
    VALUES (p_user_id, p_product_id, true, 'lifetime', p_purchase_id);
  END IF;

  -- Si es bundle, expandir a productos incluidos.
  IF v_type = 'bundle' THEN
    FOR v_included IN
      SELECT included_product_id FROM public.bundle_items WHERE bundle_product_id = p_product_id
    LOOP
      IF NOT EXISTS (
        SELECT 1 FROM public.entitlements
        WHERE user_id = p_user_id AND product_id = v_included AND active = true
      ) THEN
        INSERT INTO public.entitlements (user_id, product_id, active, access_type, source_purchase_id)
        VALUES (p_user_id, v_included, true, 'lifetime', p_purchase_id);
      END IF;
    END LOOP;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_purchase_entitlements(
  p_user_id uuid,
  p_product_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_type text;
BEGIN
  SELECT product_type INTO v_type FROM public.products WHERE id = p_product_id;

  UPDATE public.entitlements SET active = false
  WHERE user_id = p_user_id AND product_id = p_product_id;

  IF v_type = 'bundle' THEN
    UPDATE public.entitlements SET active = false
    WHERE user_id = p_user_id
      AND product_id IN (
        SELECT included_product_id FROM public.bundle_items WHERE bundle_product_id = p_product_id
      );
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.grant_purchase_entitlements(uuid, uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.revoke_purchase_entitlements(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_purchase_entitlements(uuid, uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.revoke_purchase_entitlements(uuid, uuid) TO service_role;

-- 2) Reclasificar tipo de producto: bitácora y guía de prompts son apps/web, no PDFs.
UPDATE public.products SET product_type = 'app'
WHERE slug IN ('bitacora-del-capitan', 'guia-de-prompts');

-- 3) Backfill: para cada compra ya pagada, asegurar entitlements (expandiendo packs).
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT id, user_id, product_id FROM public.purchases WHERE status = 'paid' LOOP
    PERFORM public.grant_purchase_entitlements(r.user_id, r.product_id, r.id);
  END LOOP;
END $$;
