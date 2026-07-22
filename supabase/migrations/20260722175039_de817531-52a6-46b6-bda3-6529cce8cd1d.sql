CREATE TABLE IF NOT EXISTS public.guia_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  favorites JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.guia_progress TO authenticated;
GRANT ALL ON public.guia_progress TO service_role;

ALTER TABLE public.guia_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own guia progress"
  ON public.guia_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_guia_progress_updated_at
  BEFORE UPDATE ON public.guia_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_bitacora_updated_at();
