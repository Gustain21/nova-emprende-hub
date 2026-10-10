-- lovable-cron-fallback-reviewed: retry job is armed only while failed sends await retry and unschedules itself once the queue drains; new emails wake the worker on enqueue
alter table public.email_delivery_config add column if not exists worker_url text;

create or replace function public.email_outbox_wake()
returns void language plpgsql security definer set search_path = public, extensions as $$
declare c record;
begin
  select worker_url, worker_token, activated_at into c from email_delivery_config where id;
  if c.activated_at is null or c.worker_url is null then return; end if;
  perform net.http_post(url := c.worker_url,
    headers := jsonb_build_object('Content-Type','application/json','x-worker-token', c.worker_token),
    body := '{}'::jsonb);
end $$;

create or replace function public.email_outbox_retry_tick()
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if exists (select 1 from email_outbox where status in ('queued','retry','sending')) then
    if exists (select 1 from email_outbox where (status in ('queued','retry') and coalesce(next_attempt_at, created_at) <= now())
                                           or (status = 'sending' and lease_until < now())) then
      perform email_outbox_wake();
    end if;
  else
    perform cron.unschedule('email-outbox-retry');
  end if;
end $$;

create or replace function public.email_outbox_after_change()
returns trigger language plpgsql security definer set search_path = public, extensions as $$
begin
  if NEW.status = 'queued' and (TG_OP = 'INSERT' or OLD.status is distinct from 'queued') then
    perform email_outbox_wake();
  elsif NEW.status = 'retry' and OLD.status is distinct from 'retry' then
    perform cron.schedule('email-outbox-retry', '*/5 * * * *', 'select public.email_outbox_retry_tick()');
  end if;
  return NEW;
end $$;
create trigger email_outbox_after_change after insert or update of status on public.email_outbox
  for each row execute function public.email_outbox_after_change();

revoke all on function public.email_outbox_wake() from public, anon, authenticated;
revoke all on function public.email_outbox_retry_tick() from public, anon, authenticated;
revoke all on function public.email_outbox_after_change() from public, anon, authenticated;