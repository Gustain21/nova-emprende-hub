
REVOKE EXECUTE ON FUNCTION public.has_active_entitlement(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_active_entitlement(uuid, uuid) TO authenticated, service_role;
