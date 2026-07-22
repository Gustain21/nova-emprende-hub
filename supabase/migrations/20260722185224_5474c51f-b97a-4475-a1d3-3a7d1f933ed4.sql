
-- Persistencia del Dashboard Financiero (config por usuario)
CREATE TABLE IF NOT EXISTS public.dashboard_fin_progress (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.dashboard_fin_progress TO authenticated;
GRANT ALL ON public.dashboard_fin_progress TO service_role;

ALTER TABLE public.dashboard_fin_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_select" ON public.dashboard_fin_progress;
DROP POLICY IF EXISTS "own_insert" ON public.dashboard_fin_progress;
DROP POLICY IF EXISTS "own_update" ON public.dashboard_fin_progress;
DROP POLICY IF EXISTS "own_delete" ON public.dashboard_fin_progress;

CREATE POLICY "own_select" ON public.dashboard_fin_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own_insert" ON public.dashboard_fin_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_update" ON public.dashboard_fin_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_delete" ON public.dashboard_fin_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_dashboard_fin_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_dashboard_fin_updated ON public.dashboard_fin_progress;
CREATE TRIGGER trg_dashboard_fin_updated BEFORE UPDATE ON public.dashboard_fin_progress
FOR EACH ROW EXECUTE FUNCTION public.set_dashboard_fin_updated_at();

-- Actualizar ruta/slug de la app en app_access
UPDATE public.app_access
SET app_route = '/clientes/herramientas/dashboard-financiero',
    app_slug  = 'dashboard-financiero',
    app_name  = 'Dashboard Financiero'
WHERE app_slug = 'plan-financiero';
