
ALTER TABLE public.purchases ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS email text;
CREATE INDEX IF NOT EXISTS purchases_email_lower_idx ON public.purchases (lower(email));

DROP POLICY IF EXISTS "Users can view their own purchases" ON public.purchases;
CREATE POLICY "Users can view own or email-matched purchases"
ON public.purchases
FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR (user_id IS NULL AND email IS NOT NULL AND lower(email) = lower(coalesce(auth.jwt() ->> 'email','')))
);

CREATE OR REPLACE FUNCTION public.claim_purchases_by_email()
RETURNS TABLE(claimed_count integer, entitlements_granted integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
    WHERE status = 'paid'
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
$$;

GRANT EXECUTE ON FUNCTION public.claim_purchases_by_email() TO authenticated;
