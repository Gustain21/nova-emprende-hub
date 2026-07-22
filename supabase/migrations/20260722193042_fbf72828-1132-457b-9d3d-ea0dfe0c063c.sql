
CREATE TABLE public.planner_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.planner_progress TO authenticated;
GRANT ALL ON public.planner_progress TO service_role;

ALTER TABLE public.planner_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their planner progress"
  ON public.planner_progress
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_planner_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER planner_progress_updated_at
  BEFORE UPDATE ON public.planner_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_planner_updated_at();
