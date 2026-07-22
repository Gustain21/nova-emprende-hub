
CREATE OR REPLACE FUNCTION public.set_planner_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
REVOKE ALL ON FUNCTION public.set_planner_updated_at() FROM PUBLIC, anon, authenticated;
