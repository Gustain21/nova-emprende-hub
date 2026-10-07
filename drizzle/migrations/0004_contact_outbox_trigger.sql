CREATE OR REPLACE FUNCTION public.enqueue_contact_notification_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  -- Misma transacción que el mensaje: si esto falla, el mensaje no se guarda.
  INSERT INTO email_outbox (kind, idempotency_key, recipient, template_data)
  VALUES ('contact_notification', 'contact-notify-' || NEW.id,
          'hola@editorialnovaemprende.com', jsonb_build_object('contact_message_id', NEW.id))
  ON CONFLICT (idempotency_key) DO NOTHING;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.enqueue_contact_notification_email() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER contact_messages_enqueue_notification
AFTER INSERT ON public.contact_messages
FOR EACH ROW EXECUTE FUNCTION public.enqueue_contact_notification_email();