-- lovable-cron-fallback-reviewed: recovery job is armed only while cohort rows are queued/sending/retry and unschedules itself once drained; new rows also wake the worker immediately on enqueue
alter table public.email_outbox
  add column if not exists claim_token uuid,
  add column if not exists payload jsonb,
  add column if not exists first_attempt_at timestamptz;

drop function if exists public.finish_email_outbox(uuid, text, text, text, int);
drop function if exists public.claim_email_outbox(int, int);

create function public.claim_email_outbox(p_limit int default 10, p_lease_seconds int default 300)
returns setof public.email_outbox language plpgsql security definer set search_path = public as $$
declare v_act timestamptz;
begin
  select activated_at into v_act from email_delivery_config where id;
  if v_act is null then return; end if;

  -- Cohorte post-corte únicamente. Sin reintento posible tras 5 intentos o fuera de la ventana de 23 h.
  update email_outbox set status = 'failed', lease_until = null, claim_token = null,
         last_error = case when attempts >= 5 then 'lease expirado tras el máximo de intentos'
                           else 'ventana de idempotencia (23 h) superada con resultado incierto' end
   where created_at >= v_act and status = 'sending' and lease_until < now()
     and (attempts >= 5 or first_attempt_at < now() - interval '23 hours');

  return query
  update email_outbox o
     set status = 'sending',
         claim_token = gen_random_uuid(),
         lease_until = now() + make_interval(secs => greatest(60, least(p_lease_seconds, 900))),
         attempts = o.attempts + 1,
         first_attempt_at = coalesce(o.first_attempt_at, now())
   where o.id in (
     select e.id from email_outbox e
      where e.created_at >= v_act and e.attempts < 5
        and (e.first_attempt_at is null or e.first_attempt_at >= now() - interval '23 hours')
        and ((e.status in ('queued','retry') and coalesce(e.next_attempt_at, e.created_at) <= now())
             or (e.status = 'sending' and e.lease_until < now()))
      order by e.created_at
      for update skip locked
      limit greatest(1, least(p_limit, 50)))
  returning o.*;
end $$;

-- Guarda el payload inmutable una sola vez (solo el titular del lease).
create function public.set_email_outbox_payload(p_id uuid, p_claim_token uuid, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v jsonb;
begin
  update email_outbox set payload = coalesce(payload, p_payload)
   where id = p_id and status = 'sending' and claim_token = p_claim_token
  returning payload into v;
  return v; -- null => lease perdido
end $$;

create function public.finish_email_outbox(
  p_id uuid, p_claim_token uuid, p_outcome text, p_error text default null,
  p_provider_message_id text default null, p_retry_seconds int default 60)
returns text language plpgsql security definer set search_path = public as $$
declare r record; v_status text; v_next timestamptz;
begin
  if p_outcome not in ('sent','retry','failed','skipped') then
    raise exception 'outcome inválido: %', p_outcome;
  end if;
  select attempts, first_attempt_at into r from email_outbox
   where id = p_id and status = 'sending' and claim_token = p_claim_token for update;
  if not found then return 'not_leased'; end if;
  v_next := now() + make_interval(secs => greatest(30, least(p_retry_seconds, 21600)));
  v_status := case
    when p_outcome <> 'retry' then p_outcome
    when r.attempts >= 5 then 'failed'
    when v_next > r.first_attempt_at + interval '23 hours' then 'failed'
    else 'retry' end;
  update email_outbox set
    status = v_status, lease_until = null, claim_token = null,
    last_error = left(case when p_outcome = 'retry' and v_status = 'failed'
                           then coalesce(p_error,'') || ' | sin más reintentos (máximo o ventana 23 h)' else p_error end, 500),
    provider_message_id = coalesce(p_provider_message_id, provider_message_id),
    sent_at = case when v_status = 'sent' then now() else sent_at end,
    next_attempt_at = case when v_status = 'retry' then v_next else null end
  where id = p_id;
  return v_status;
end $$;

create or replace function public.email_outbox_retry_tick()
returns void language plpgsql security definer set search_path = public, extensions as $$
declare v_act timestamptz;
begin
  select activated_at into v_act from email_delivery_config where id;
  if v_act is not null and exists (select 1 from email_outbox
       where created_at >= v_act and status in ('queued','retry','sending')) then
    if exists (select 1 from email_outbox where created_at >= v_act and (
                 (status in ('queued','retry') and coalesce(next_attempt_at, created_at) <= now())
                 or (status = 'sending' and lease_until < now()))) then
      perform email_outbox_wake();
    end if;
  elsif exists (select 1 from cron.job where jobname = 'email-outbox-retry') then
    perform cron.unschedule('email-outbox-retry');
  end if;
end $$;

-- Armado al encolar (cubre crash en el primer 'sending') y al pasar a retry.
create or replace function public.email_outbox_after_change()
returns trigger language plpgsql security definer set search_path = public, extensions as $$
begin
  if NEW.status in ('queued','retry') and (TG_OP = 'INSERT' or OLD.status is distinct from NEW.status) then
    if not exists (select 1 from cron.job where jobname = 'email-outbox-retry') then
      perform cron.schedule('email-outbox-retry', '*/5 * * * *', 'select public.email_outbox_retry_tick()');
    end if;
    if NEW.status = 'queued' then perform email_outbox_wake(); end if;
  end if;
  return NEW;
end $$;

revoke all on function public.claim_email_outbox(int, int) from public, anon, authenticated;
revoke all on function public.set_email_outbox_payload(uuid, uuid, jsonb) from public, anon, authenticated;
revoke all on function public.finish_email_outbox(uuid, uuid, text, text, text, int) from public, anon, authenticated;
grant execute on function public.claim_email_outbox(int, int) to service_role;
grant execute on function public.set_email_outbox_payload(uuid, uuid, jsonb) to service_role;
grant execute on function public.finish_email_outbox(uuid, uuid, text, text, text, int) to service_role;