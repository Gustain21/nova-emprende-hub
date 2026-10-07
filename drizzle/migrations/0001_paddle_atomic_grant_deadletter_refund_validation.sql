-- A) Un único acceso ACTIVO por usuario+producto (verificado: no hay duplicados actuales).
CREATE UNIQUE INDEX IF NOT EXISTS entitlements_one_active_per_user_product
  ON public.entitlements (user_id, product_id) WHERE active = true;

-- B) Concesión idempotente. Si ya hay un acceso activo (aunque su source_purchase_id sea NULL
--    o de otra compra) se deja intacto: no se reescriben históricos. Si no lo hay (p.ej. revocado),
--    se inserta una fila NUEVA activa, conservando la fila revocada como historial.
CREATE OR REPLACE FUNCTION public.grant_purchase_entitlements(p_user_id uuid, p_product_id uuid, p_purchase_id uuid DEFAULT NULL::uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_type text; v_included uuid;
BEGIN
  SELECT product_type INTO v_type FROM public.products WHERE id = p_product_id;

  INSERT INTO public.entitlements (user_id, product_id, active, access_type, source_purchase_id)
  VALUES (p_user_id, p_product_id, true, 'lifetime', p_purchase_id)
  ON CONFLICT (user_id, product_id) WHERE active = true DO NOTHING;

  IF v_type = 'bundle' THEN
    FOR v_included IN SELECT included_product_id FROM public.bundle_items WHERE bundle_product_id = p_product_id LOOP
      INSERT INTO public.entitlements (user_id, product_id, active, access_type, source_purchase_id)
      VALUES (p_user_id, v_included, true, 'lifetime', p_purchase_id)
      ON CONFLICT (user_id, product_id) WHERE active = true DO NOTHING;
    END LOOP;
  END IF;
END;
$function$;

-- C) Atribución y cola de reconciliación privada.
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS attribution jsonb;

CREATE TABLE IF NOT EXISTS public.payment_webhook_deadletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'paddle',
  event_id text,
  event_type text,
  provider_payment_id text,
  reason text NOT NULL,
  payload jsonb NOT NULL,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.payment_webhook_deadletters TO service_role;
ALTER TABLE public.payment_webhook_deadletters ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX IF NOT EXISTS payment_webhook_deadletters_event_reason
  ON public.payment_webhook_deadletters (event_id, reason) WHERE event_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.record_paddle_deadletter(
  p_event_id text, p_event_type text, p_transaction_id text, p_reason text, p_payload jsonb)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  INSERT INTO payment_webhook_deadletters (event_id, event_type, provider_payment_id, reason, payload)
  VALUES (p_event_id, p_event_type, p_transaction_id, p_reason, p_payload)
  ON CONFLICT (event_id, reason) WHERE event_id IS NOT NULL DO NOTHING;
$$;
REVOKE ALL ON FUNCTION public.record_paddle_deadletter(text, text, text, text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_paddle_deadletter(text, text, text, text, jsonb) TO service_role;

-- D) Registro + concesión ATÓMICOS bajo el mismo bloqueo de fila que usa el reembolso.
DROP FUNCTION IF EXISTS public.record_paddle_payment(text, uuid, uuid, text, numeric, text, uuid);
CREATE OR REPLACE FUNCTION public.record_paddle_payment(
  p_transaction_id text, p_product_id uuid, p_user_id uuid, p_email text,
  p_amount numeric, p_currency text, p_purchase_id uuid DEFAULT NULL,
  p_attribution jsonb DEFAULT NULL, p_event_id text DEFAULT NULL)
RETURNS TABLE(purchase_id uuid, purchase_status text, purchase_user_id uuid, purchase_product_id uuid, granted boolean)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_id uuid; v_status text; v_user uuid; v_product uuid;
BEGIN
  IF p_transaction_id IS NULL OR p_product_id IS NULL THEN
    RAISE EXCEPTION 'record_paddle_payment: transaction_id y product_id requeridos';
  END IF;

  SELECT id INTO v_id FROM purchases WHERE provider_payment_id = p_transaction_id FOR UPDATE;
  IF v_id IS NULL AND p_purchase_id IS NOT NULL THEN
    SELECT id INTO v_id FROM purchases WHERE id = p_purchase_id AND provider_payment_id IS NULL FOR UPDATE;
  END IF;
  IF v_id IS NULL THEN
    INSERT INTO purchases (user_id, product_id, status, provider, provider_payment_id, email,
                           amount, total_amount, currency, buyer_currency, attribution, last_provider_event_at)
    VALUES (p_user_id, p_product_id, 'paid', 'paddle', p_transaction_id, p_email,
            p_amount, p_amount, coalesce(p_currency,'EUR'), p_currency, p_attribution, now())
    ON CONFLICT (provider_payment_id) WHERE provider_payment_id IS NOT NULL DO NOTHING
    RETURNING id INTO v_id;
    IF v_id IS NULL THEN
      SELECT id INTO v_id FROM purchases WHERE provider_payment_id = p_transaction_id FOR UPDATE;
    END IF;
  END IF;

  SELECT product_id INTO v_product FROM purchases WHERE id = v_id;
  IF v_product IS DISTINCT FROM p_product_id THEN
    -- El producto persistido manda; un evento con otro producto se bloquea y va a reconciliación.
    PERFORM record_paddle_deadletter(p_event_id, 'transaction', p_transaction_id, 'product_mismatch',
      jsonb_build_object('purchase_id', v_id, 'persisted_product_id', v_product, 'event_product_id', p_product_id));
    SELECT status, user_id INTO v_status, v_user FROM purchases WHERE id = v_id;
    purchase_id := v_id; purchase_status := 'blocked_product_mismatch'; purchase_user_id := v_user;
    purchase_product_id := v_product; granted := false;
    RETURN NEXT; RETURN;
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
    attribution = coalesce(attribution, p_attribution),
    last_provider_event_at = now()
  WHERE id = v_id
  RETURNING status, user_id INTO v_status, v_user;

  granted := false;
  IF v_user IS NOT NULL AND v_status IN ('paid','partially_refunded') THEN
    PERFORM grant_purchase_entitlements(v_user, v_product, v_id);
    granted := true;
  END IF;

  purchase_id := v_id; purchase_status := v_status; purchase_user_id := v_user; purchase_product_id := v_product;
  RETURN NEXT;
END;
$$;
REVOKE ALL ON FUNCTION public.record_paddle_payment(text, uuid, uuid, text, numeric, text, uuid, jsonb, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_paddle_payment(text, uuid, uuid, text, numeric, text, uuid, jsonb, text) TO service_role;

-- E) Reembolso con validación estricta (tipo, importe, moneda).
CREATE OR REPLACE FUNCTION public.apply_paddle_refund(
  p_adjustment_id text, p_transaction_id text, p_adjustment_type text,
  p_amount numeric, p_currency text)
RETURNS TABLE(result text, purchase_id uuid, new_status text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_id uuid; v_total numeric; v_refunded numeric; v_status text; v_cur text; v_full boolean; v_inserted text;
        v_type text := lower(coalesce(p_adjustment_type,''));
BEGIN
  IF v_type NOT IN ('full','partial') THEN
    RAISE EXCEPTION 'apply_paddle_refund: tipo de ajuste no válido (%)', coalesce(p_adjustment_type,'null');
  END IF;
  IF p_amount IS NULL OR p_amount < 0 THEN
    RAISE EXCEPTION 'apply_paddle_refund: importe no válido';
  END IF;

  SELECT id, total_amount, refunded_amount, status, upper(coalesce(buyer_currency, currency))
    INTO v_id, v_total, v_refunded, v_status, v_cur
  FROM purchases WHERE provider_payment_id = p_transaction_id FOR UPDATE;
  IF v_id IS NULL THEN
    RAISE EXCEPTION 'apply_paddle_refund: compra no encontrada para la transacción';
  END IF;
  IF p_currency IS NULL OR v_cur IS NULL OR upper(p_currency) <> v_cur THEN
    RAISE EXCEPTION 'apply_paddle_refund: moneda distinta a la de la compra';
  END IF;

  INSERT INTO payment_adjustments (id, purchase_id, provider_payment_id, action, adjustment_type, amount, currency)
  VALUES (p_adjustment_id, v_id, p_transaction_id, 'refund', v_type, p_amount, upper(p_currency))
  ON CONFLICT (id) DO NOTHING
  RETURNING id INTO v_inserted;
  IF v_inserted IS NULL THEN
    result := 'duplicate'; purchase_id := v_id; new_status := v_status; RETURN NEXT; RETURN;
  END IF;

  v_refunded := coalesce(v_refunded,0) + p_amount;
  v_full := v_type = 'full' OR (v_total IS NOT NULL AND v_total > 0 AND v_refunded >= v_total);

  UPDATE purchases SET
    refunded_amount = v_refunded,
    status = CASE WHEN v_full OR status = 'refunded' THEN 'refunded' ELSE 'partially_refunded' END,
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

-- F) Reclamación de invitado con bloqueo de fila: el WHERE se reevalúa tras el bloqueo,
--    así un reembolso concurrente ya confirmado excluye la compra.
CREATE OR REPLACE FUNCTION public.claim_purchases_by_email()
 RETURNS TABLE(claimed_count integer, entitlements_granted integer)
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_email text := lower(coalesce(auth.jwt() ->> 'email',''));
  v_claimed integer := 0; v_granted integer := 0; r record;
BEGIN
  IF v_uid IS NULL OR v_email = '' THEN
    claimed_count := 0; entitlements_granted := 0; RETURN NEXT; RETURN;
  END IF;

  FOR r IN
    SELECT id, product_id, user_id FROM public.purchases
    WHERE status IN ('paid','partially_refunded')
      AND lower(coalesce(email,'')) = v_email
      AND (user_id IS NULL OR user_id = v_uid)
    ORDER BY id
    FOR UPDATE
  LOOP
    IF r.user_id IS NULL THEN
      UPDATE public.purchases SET user_id = v_uid WHERE id = r.id;
      v_claimed := v_claimed + 1;
    END IF;
    PERFORM public.grant_purchase_entitlements(v_uid, r.product_id, r.id);
    v_granted := v_granted + 1;
  END LOOP;

  claimed_count := v_claimed; entitlements_granted := v_granted; RETURN NEXT;
END;
$function$;

COMMENT ON FUNCTION public.recompute_entitlements_for_purchase(uuid) IS
  'Solo desactiva entitlements access_type=lifetime (los que crean las compras). manual/subscription/trial nunca se tocan: el tipo manda, no source_purchase_id NULL.';
