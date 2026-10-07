-- 1) Estados de compra: añade 'partially_refunded' (reembolso parcial, acceso conservado).
ALTER TABLE public.purchases DROP CONSTRAINT purchases_status_check;
ALTER TABLE public.purchases ADD CONSTRAINT purchases_status_check
  CHECK (status = ANY (ARRAY['pending','paid','partially_refunded','failed','refunded','cancelled']));

ALTER TABLE public.purchases
  ADD COLUMN IF NOT EXISTS refunded_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_provider_event_at timestamptz;

-- 2) Ajustes de Paddle (reembolsos) — idempotencia por id de ajuste.
CREATE TABLE IF NOT EXISTS public.payment_adjustments (
  id text PRIMARY KEY,
  provider text NOT NULL DEFAULT 'paddle',
  purchase_id uuid NOT NULL REFERENCES public.purchases(id),
  provider_payment_id text NOT NULL,
  action text NOT NULL,
  adjustment_type text NOT NULL,
  amount numeric,
  currency text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.payment_adjustments TO service_role;
ALTER TABLE public.payment_adjustments ENABLE ROW LEVEL SECURITY;
-- Sin políticas: solo el servidor (service_role) accede.

-- 3) Búsqueda de usuario por email en auth (identidad fiable, sin límite de 200).
CREATE OR REPLACE FUNCTION public.find_auth_user_id_by_email(p_email text)
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT u.id FROM auth.users u
  WHERE lower(u.email) = lower(trim(p_email))
  ORDER BY (u.email_confirmed_at IS NOT NULL) DESC, u.created_at ASC
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.find_auth_user_id_by_email(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.find_auth_user_id_by_email(text) TO service_role;

-- 4) Registro idempotente de pago. Nunca retrocede estados (refunded/partially_refunded/paid).
CREATE OR REPLACE FUNCTION public.record_paddle_payment(
  p_transaction_id text, p_product_id uuid, p_user_id uuid, p_email text,
  p_amount numeric, p_currency text, p_purchase_id uuid DEFAULT NULL)
RETURNS TABLE(purchase_id uuid, purchase_status text, purchase_user_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_id uuid; v_status text; v_user uuid;
BEGIN
  IF p_transaction_id IS NULL OR p_product_id IS NULL THEN
    RAISE EXCEPTION 'record_paddle_payment: transaction_id y product_id requeridos';
  END IF;

  SELECT id INTO v_id FROM purchases WHERE provider_payment_id = p_transaction_id FOR UPDATE;

  IF v_id IS NULL AND p_purchase_id IS NOT NULL THEN
    SELECT id INTO v_id FROM purchases
    WHERE id = p_purchase_id AND provider_payment_id IS NULL FOR UPDATE;
  END IF;

  IF v_id IS NULL THEN
    INSERT INTO purchases (user_id, product_id, status, provider, provider_payment_id, email,
                           amount, total_amount, currency, buyer_currency, last_provider_event_at)
    VALUES (p_user_id, p_product_id, 'paid', 'paddle', p_transaction_id, p_email,
            p_amount, p_amount, coalesce(p_currency,'EUR'), p_currency, now())
    ON CONFLICT (provider_payment_id) WHERE provider_payment_id IS NOT NULL DO NOTHING
    RETURNING id INTO v_id;
    IF v_id IS NULL THEN
      SELECT id INTO v_id FROM purchases WHERE provider_payment_id = p_transaction_id FOR UPDATE;
    END IF;
  END IF;

  UPDATE purchases SET
    provider = 'paddle',
    provider_payment_id = p_transaction_id,
    status = CASE WHEN status IN ('refunded','partially_refunded') THEN status ELSE 'paid' END,
    user_id = coalesce(user_id, p_user_id),
    email = coalesce(email, p_email),
    amount = coalesce(amount, p_amount),
    total_amount = coalesce(total_amount, p_amount),
    buyer_currency = coalesce(buyer_currency, p_currency),
    last_provider_event_at = now()
  WHERE id = v_id
  RETURNING id, status, user_id INTO v_id, v_status, v_user;

  purchase_id := v_id; purchase_status := v_status; purchase_user_id := v_user;
  RETURN NEXT;
END;
$$;
REVOKE ALL ON FUNCTION public.record_paddle_payment(text, uuid, uuid, text, numeric, text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_paddle_payment(text, uuid, uuid, text, numeric, text, uuid) TO service_role;

-- 5) Fallo/cancelación: solo afecta a compras aún pendientes.
CREATE OR REPLACE FUNCTION public.mark_paddle_payment_failed(p_transaction_id text, p_purchase_id uuid DEFAULT NULL)
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE n integer;
BEGIN
  UPDATE purchases SET status = 'failed', last_provider_event_at = now()
  WHERE status = 'pending'
    AND ((p_transaction_id IS NOT NULL AND provider_payment_id = p_transaction_id)
         OR (p_purchase_id IS NOT NULL AND id = p_purchase_id));
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END;
$$;
REVOKE ALL ON FUNCTION public.mark_paddle_payment_failed(text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_paddle_payment_failed(text, uuid) TO service_role;

-- 6) Recalcula derechos de los productos afectados por una compra, a partir de TODAS
--    las compras vigentes del usuario (individuales y packs vía bundle_items).
--    Solo toca entitlements 'lifetime'; nunca concesiones manuales.
CREATE OR REPLACE FUNCTION public.recompute_entitlements_for_purchase(p_purchase_id uuid)
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_user uuid; v_product uuid; v_aff uuid; v_cover uuid; n integer := 0;
BEGIN
  SELECT user_id, product_id INTO v_user, v_product FROM purchases WHERE id = p_purchase_id;
  IF v_user IS NULL THEN RETURN 0; END IF;

  FOR v_aff IN
    SELECT v_product
    UNION SELECT included_product_id FROM bundle_items WHERE bundle_product_id = v_product
  LOOP
    -- ¿Otra compra vigente sigue cubriendo este producto (directa o por pack)?
    SELECT p.id INTO v_cover FROM purchases p
    WHERE p.user_id = v_user AND p.status IN ('paid','partially_refunded')
      AND (p.product_id = v_aff OR EXISTS (
            SELECT 1 FROM bundle_items b WHERE b.bundle_product_id = p.product_id AND b.included_product_id = v_aff))
    ORDER BY p.purchased_at ASC LIMIT 1;

    IF v_cover IS NULL THEN
      UPDATE entitlements SET active = false
      WHERE user_id = v_user AND product_id = v_aff AND active = true AND access_type = 'lifetime';
      n := n + 1;
    ELSE
      UPDATE entitlements SET source_purchase_id = v_cover
      WHERE user_id = v_user AND product_id = v_aff AND active = true AND access_type = 'lifetime'
        AND (source_purchase_id IS NULL OR source_purchase_id = p_purchase_id);
    END IF;
  END LOOP;
  RETURN n;
END;
$$;
REVOKE ALL ON FUNCTION public.recompute_entitlements_for_purchase(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recompute_entitlements_for_purchase(uuid) TO service_role;

-- 7) Reembolso idempotente. Total => 'refunded' + recálculo; parcial => 'partially_refunded', acceso conservado.
CREATE OR REPLACE FUNCTION public.apply_paddle_refund(
  p_adjustment_id text, p_transaction_id text, p_adjustment_type text,
  p_amount numeric, p_currency text)
RETURNS TABLE(result text, purchase_id uuid, new_status text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_id uuid; v_total numeric; v_refunded numeric; v_status text; v_full boolean; v_inserted text;
BEGIN
  SELECT id, total_amount, refunded_amount, status INTO v_id, v_total, v_refunded, v_status
  FROM purchases WHERE provider_payment_id = p_transaction_id FOR UPDATE;
  IF v_id IS NULL THEN
    RAISE EXCEPTION 'apply_paddle_refund: compra no encontrada para la transacción';
  END IF;

  INSERT INTO payment_adjustments (id, purchase_id, provider_payment_id, action, adjustment_type, amount, currency)
  VALUES (p_adjustment_id, v_id, p_transaction_id, 'refund', coalesce(p_adjustment_type,'unknown'), p_amount, p_currency)
  ON CONFLICT (id) DO NOTHING
  RETURNING id INTO v_inserted;

  IF v_inserted IS NULL THEN
    result := 'duplicate'; purchase_id := v_id; new_status := v_status; RETURN NEXT; RETURN;
  END IF;

  v_refunded := coalesce(v_refunded,0) + coalesce(p_amount,0);
  v_full := lower(coalesce(p_adjustment_type,'')) = 'full'
            OR (v_total IS NOT NULL AND v_total > 0 AND v_refunded >= v_total);

  UPDATE purchases SET
    refunded_amount = v_refunded,
    status = CASE WHEN v_full THEN 'refunded' ELSE (CASE WHEN status = 'refunded' THEN status ELSE 'partially_refunded' END) END,
    last_provider_event_at = now()
  WHERE id = v_id
  RETURNING status INTO v_status;

  IF v_status = 'refunded' THEN
    PERFORM public.recompute_entitlements_for_purchase(v_id);
  END IF;

  result := CASE WHEN v_status = 'refunded' THEN 'refunded' ELSE 'partial' END;
  purchase_id := v_id; new_status := v_status; RETURN NEXT;
END;
$$;
REVOKE ALL ON FUNCTION public.apply_paddle_refund(text, text, text, numeric, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_paddle_refund(text, text, text, numeric, text) TO service_role;

-- 8) Reclamación de invitado: también compras con reembolso parcial (conservan acceso).
CREATE OR REPLACE FUNCTION public.claim_purchases_by_email()
 RETURNS TABLE(claimed_count integer, entitlements_granted integer)
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_email text := lower(coalesce(auth.jwt() ->> 'email',''));
  v_claimed integer := 0;
  v_granted integer := 0;
  r record;
BEGIN
  IF v_uid IS NULL OR v_email = '' THEN
    claimed_count := 0; entitlements_granted := 0;
    RETURN NEXT; RETURN;
  END IF;

  FOR r IN
    SELECT id, product_id, user_id FROM public.purchases
    WHERE status IN ('paid','partially_refunded')
      AND lower(coalesce(email,'')) = v_email
      AND (user_id IS NULL OR user_id = v_uid)
  LOOP
    IF r.user_id IS NULL THEN
      UPDATE public.purchases SET user_id = v_uid WHERE id = r.id;
      v_claimed := v_claimed + 1;
    END IF;
    PERFORM public.grant_purchase_entitlements(v_uid, r.product_id, r.id);
    v_granted := v_granted + 1;
  END LOOP;

  claimed_count := v_claimed;
  entitlements_granted := v_granted;
  RETURN NEXT;
END;
$function$;

-- 9) Mensajes de contacto: privados, solo el servidor escribe/lee.
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  ip_hash text,
  user_agent text,
  notification_status text NOT NULL DEFAULT 'pending_no_provider',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS contact_messages_ip_created_idx ON public.contact_messages (ip_hash, created_at);
