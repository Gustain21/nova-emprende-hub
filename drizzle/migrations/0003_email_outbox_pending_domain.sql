CREATE TABLE public.email_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('contact_notification','purchase_access')),
  idempotency_key text NOT NULL UNIQUE,
  recipient text NOT NULL,
  template_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending_email_domain'
    CHECK (status IN ('pending_email_domain','queued','sent','failed','suppressed','cancelled')),
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  queued_at timestamptz,
  sent_at timestamptz
);
GRANT ALL ON public.email_outbox TO service_role;
ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;
-- Sin políticas: privada, solo servidor.

-- Encola el aviso de acceso cuando una compra pasa a 'paid' por primera vez.
-- Solo eventos nuevos (no recorre compras antiguas). Clave única => un solo email aunque el webhook se repita.
CREATE OR REPLACE FUNCTION public.enqueue_purchase_access_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_name text;
BEGIN
  IF NEW.status = 'paid' AND NEW.provider = 'paddle' AND coalesce(NEW.email,'') <> ''
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'paid') THEN
    SELECT name INTO v_name FROM products WHERE id = NEW.product_id;
    INSERT INTO email_outbox (kind, idempotency_key, recipient, template_data)
    VALUES ('purchase_access', 'purchase-access-' || NEW.id, lower(NEW.email),
            jsonb_build_object('product_name', coalesce(v_name,''), 'purchase_id', NEW.id))
    ON CONFLICT (idempotency_key) DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.enqueue_purchase_access_email() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER purchases_enqueue_access_email
AFTER INSERT OR UPDATE OF status ON public.purchases
FOR EACH ROW EXECUTE FUNCTION public.enqueue_purchase_access_email();