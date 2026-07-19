CREATE TABLE public.bitacora_progress (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_day integer NOT NULL DEFAULT 1,
  current_view text NOT NULL DEFAULT 'cover',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bitacora_progress TO authenticated;
GRANT ALL ON public.bitacora_progress TO service_role;

ALTER TABLE public.bitacora_progress ENABLE ROW LEVEL SECURITY;

-- Sólo el propio usuario y sólo si tiene entitlement activo al producto bitacora-del-capitan
CREATE OR REPLACE FUNCTION public.has_bitacora_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.entitlements e
    JOIN public.products p ON p.id = e.product_id
    WHERE e.user_id = _user_id
      AND e.active = true
      AND (e.expires_at IS NULL OR e.expires_at > now())
      AND p.slug = 'bitacora-del-capitan'
  );
$$;

CREATE POLICY "Bitacora: own progress select"
  ON public.bitacora_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND public.has_bitacora_access(auth.uid()));

CREATE POLICY "Bitacora: own progress insert"
  ON public.bitacora_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.has_bitacora_access(auth.uid()));

CREATE POLICY "Bitacora: own progress update"
  ON public.bitacora_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND public.has_bitacora_access(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND public.has_bitacora_access(auth.uid()));

CREATE POLICY "Bitacora: own progress delete"
  ON public.bitacora_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_bitacora_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER bitacora_progress_set_updated_at
  BEFORE UPDATE ON public.bitacora_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_bitacora_updated_at();