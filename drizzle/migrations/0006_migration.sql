-- Envío real de app emails vía Resend desde email_outbox, con corte de activación.
create extension if not exists pg_cron;
create extension if not exists pg_net;

create table public.email_delivery_config (
  id boolean primary key default true check (id),
  provider text not null default 'resend',
  activated_at timestamptz,          -- corte: solo filas creadas >= activated_at se envían
  worker_token text not null default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  updated_at timestamptz not null default now()
);
alter table public.email_delivery_config enable row level security;
revoke all on public.email_delivery_config from anon, authenticated;
insert into public.email_delivery_config (id) values (true);

alter table public.email_outbox
  add column if not exists next_attempt_at timestamptz,
  add column if not exists lease_until timestamptz,
  add column if not exists provider_message_id text;
create index if not exists email_outbox_claim_idx on public.email_outbox (status, next_attempt_at);

create or replace function public.email_outbox_set_initial_status()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if NEW.status = 'pending_email_domain'
     and exists (select 1 from email_delivery_config where id and activated_at is not null and activated_at <= now()) then
    NEW.status := 'queued';
    NEW.queued_at := now();
    NEW.next_attempt_at := now();
  end if;
  return NEW;
end $$;
create trigger email_outbox_initial_status before insert on public.email_outbox
  for each row execute function public.email_outbox_set_initial_status();

create or replace function public.claim_email_outbox(p_limit int default 10, p_lease_seconds int default 300)
returns setof public.email_outbox language plpgsql security definer set search_path = public as $$
declare v_act timestamptz;
begin
  select activated_at into v_act from email_delivery_config where id;
  if v_act is null then return; end if;

  update email_outbox set status = 'failed', lease_until = null,
         last_error = 'lease expirado tras el máximo de intentos'
   where status = 'sending' and lease_until < now() and attempts >= 5;

  return query
  update email_outbox o
     set status = 'sending',
         lease_until = now() + make_interval(secs => greatest(60, least(p_lease_seconds, 900))),
         attempts = o.attempts + 1
   where o.id in (
     select e.id from email_outbox e
      where e.created_at >= v_act and e.attempts < 5
        and ((e.status in ('queued','retry') and coalesce(e.next_attempt_at, e.created_at) <= now())
             or (e.status = 'sending' and e.lease_until < now()))
      order by e.created_at
      for update skip locked
      limit greatest(1, least(p_limit, 50)))
  returning o.*;
end $$;

create or replace function public.finish_email_outbox(
  p_id uuid, p_outcome text, p_error text default null,
  p_provider_message_id text default null, p_retry_seconds int default 60)
returns text language plpgsql security definer set search_path = public as $$
declare v_attempts int; v_status text;
begin
  if p_outcome not in ('sent','retry','failed','skipped') then
    raise exception 'outcome inválido: %', p_outcome;
  end if;
  select attempts into v_attempts from email_outbox where id = p_id and status = 'sending' for update;
  if not found then return 'not_leased'; end if;
  v_status := case when p_outcome = 'retry' and v_attempts >= 5 then 'failed' else p_outcome end;
  update email_outbox set
    status = v_status,
    lease_until = null,
    last_error = left(p_error, 500),
    provider_message_id = coalesce(p_provider_message_id, provider_message_id),
    sent_at = case when v_status = 'sent' then now() else sent_at end,
    next_attempt_at = case when v_status = 'retry' then now() + make_interval(secs => greatest(30, least(p_retry_seconds, 21600))) else null end
  where id = p_id;
  return v_status;
end $$;

create or replace function public.verify_email_worker_token(p_token text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(length(p_token), 0) >= 32 and exists (
    select 1 from email_delivery_config where id and worker_token = p_token);
$$;

revoke all on function public.email_outbox_set_initial_status() from public, anon, authenticated;
revoke all on function public.claim_email_outbox(int, int) from public, anon, authenticated;
revoke all on function public.finish_email_outbox(uuid, text, text, text, int) from public, anon, authenticated;
revoke all on function public.verify_email_worker_token(text) from public, anon, authenticated;
grant execute on function public.claim_email_outbox(int, int) to service_role;
grant execute on function public.finish_email_outbox(uuid, text, text, text, int) to service_role;
grant execute on function public.verify_email_worker_token(text) to service_role;