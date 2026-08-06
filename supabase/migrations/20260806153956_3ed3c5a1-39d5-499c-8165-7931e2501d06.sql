CREATE TABLE public.legal_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  product_id uuid REFERENCES public.products(id),
  product_slug text,
  paddle_transaction_id text,
  legal_version text NOT NULL DEFAULT '2026-08-06',
  accept_terms boolean NOT NULL DEFAULT false,
  accept_refunds boolean NOT NULL DEFAULT false,
  read_privacy boolean NOT NULL DEFAULT false,
  accept_immediate_access boolean NOT NULL DEFAULT false,
  acknowledge_withdrawal_loss boolean NOT NULL DEFAULT false,
  consent_text text,
  country text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.legal_consents TO authenticated;
GRANT ALL ON public.legal_consents TO service_role;

ALTER TABLE public.legal_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own consents"
ON public.legal_consents FOR SELECT TO authenticated
USING (user_id = auth.uid() OR lower(email) = lower(COALESCE(auth.jwt() ->> 'email','')));

CREATE INDEX idx_legal_consents_email ON public.legal_consents (lower(email));
CREATE INDEX idx_legal_consents_txn ON public.legal_consents (paddle_transaction_id);