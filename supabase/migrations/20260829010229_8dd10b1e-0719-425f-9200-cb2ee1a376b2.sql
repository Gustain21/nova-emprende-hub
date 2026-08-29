CREATE OR REPLACE FUNCTION public.has_active_entitlement(
  _user_id uuid,
  _product_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NOT NULL AND _user_id <> v_uid THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.entitlements AS e
    WHERE e.user_id = _user_id
      AND e.product_id = _product_id
      AND e.active = true
      AND (
        e.expires_at IS NULL
        OR e.expires_at > pg_catalog.now()
      )
  );
END;
$function$;