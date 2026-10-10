alter table public.email_outbox drop constraint email_outbox_status_check;
alter table public.email_outbox add constraint email_outbox_status_check check (status = any (array[
  'pending_email_domain','queued','sending','retry','sent','failed','skipped','suppressed','cancelled']));