REVOKE EXECUTE ON FUNCTION public.has_bitacora_access(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_bitacora_updated_at() FROM anon, authenticated, public;