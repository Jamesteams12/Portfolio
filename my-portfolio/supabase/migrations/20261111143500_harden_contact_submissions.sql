create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.contact_submission_rate_limits (
  ip_hash text primary key check (ip_hash ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null,
  request_count integer not null check (request_count between 1 and 6)
);

alter table private.contact_submission_rate_limits enable row level security;
revoke all on table private.contact_submission_rate_limits
  from public, anon, authenticated, service_role;

create index if not exists contact_submission_rate_limits_window_started_at_idx
  on private.contact_submission_rate_limits (window_started_at);

create or replace function public.consume_contact_submission(p_ip_hash text)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, private
as $$
declare
  v_now timestamptz := statement_timestamp();
  current_count integer;
begin
  if p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid contact rate-limit key.';
  end if;

  delete from private.contact_submission_rate_limits
  where window_started_at < v_now - interval '24 hours';

  insert into private.contact_submission_rate_limits as limits (
    ip_hash,
    window_started_at,
    request_count
  )
  values (p_ip_hash, v_now, 1)
  on conflict (ip_hash) do update
  set
    window_started_at = case
      when limits.window_started_at <= v_now - interval '15 minutes'
        then v_now
      else limits.window_started_at
    end,
    request_count = case
      when limits.window_started_at <= v_now - interval '15 minutes'
        then 1
      else least(limits.request_count + 1, 6)
    end
  returning request_count into current_count;

  return current_count <= 5;
end;
$$;

revoke all on function public.consume_contact_submission(text)
  from public, anon, authenticated;
grant execute on function public.consume_contact_submission(text) to service_role;

alter table public.contacts enable row level security;
revoke all on table public.contacts from public, anon, authenticated;
grant select, insert, update, delete on table public.contacts to service_role;

drop policy if exists "Anyone can submit a contact message"
  on public.contacts;
