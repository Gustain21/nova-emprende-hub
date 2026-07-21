ALTER TABLE public.bitacora_progress
  RENAME COLUMN answers TO responses;

ALTER TABLE public.bitacora_progress
  ADD COLUMN IF NOT EXISTS progress numeric NOT NULL DEFAULT 0;

ALTER TABLE public.bitacora_progress
  ALTER COLUMN responses SET DEFAULT '{}'::jsonb,
  ALTER COLUMN responses SET NOT NULL,
  ALTER COLUMN current_day DROP NOT NULL,
  ALTER COLUMN current_view DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.bitacora_progress'::regclass
      AND contype IN ('p', 'u')
      AND conkey = ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid = 'public.bitacora_progress'::regclass AND attname = 'user_id')]
  ) THEN
    ALTER TABLE public.bitacora_progress
      ADD CONSTRAINT bitacora_progress_user_id_key UNIQUE (user_id);
  END IF;
END
$$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bitacora_progress TO authenticated;
GRANT ALL ON public.bitacora_progress TO service_role;
REVOKE ALL ON public.bitacora_progress FROM anon;

ALTER TABLE public.bitacora_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Bitacora: own progress select" ON public.bitacora_progress;
DROP POLICY IF EXISTS "Bitacora: own progress insert" ON public.bitacora_progress;
DROP POLICY IF EXISTS "Bitacora: own progress update" ON public.bitacora_progress;
DROP POLICY IF EXISTS "Bitacora: own progress delete" ON public.bitacora_progress;

CREATE POLICY "Users can view own bitacora progress"
  ON public.bitacora_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bitacora progress"
  ON public.bitacora_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bitacora progress"
  ON public.bitacora_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bitacora progress"
  ON public.bitacora_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_bitacora_progress_updated_at ON public.bitacora_progress;
CREATE TRIGGER set_bitacora_progress_updated_at
  BEFORE UPDATE ON public.bitacora_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.set_bitacora_updated_at();