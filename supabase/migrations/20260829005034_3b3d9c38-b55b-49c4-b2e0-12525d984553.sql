REVOKE EXECUTE ON FUNCTION public.claim_purchases_by_email() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.claim_purchases_by_email() FROM anon;
GRANT EXECUTE ON FUNCTION public.claim_purchases_by_email() TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_purchases_by_email() TO service_role;