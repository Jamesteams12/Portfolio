begin;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  slug text not null unique,
  url text,
  image_url text,
  github_url text,
  live_url text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
grant select on table public.projects to anon, authenticated;

create policy "Anyone can view published projects"
  on public.projects
  for select
  to anon, authenticated
  using (published = true);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;
revoke all on table public.contacts from public, anon, authenticated;
grant select, insert, update, delete on table public.contacts to service_role;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.contact_submission_rate_limits (
  ip_hash text primary key check (ip_hash ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null,
  request_count integer not null check (request_count between 1 and 6)
);

alter table private.contact_submission_rate_limits enable row level security;
revoke all on table private.contact_submission_rate_limits
  from public, anon, authenticated, service_role;

create index contact_submission_rate_limits_window_started_at_idx
  on private.contact_submission_rate_limits (window_started_at);

create function public.consume_contact_submission(p_ip_hash text)
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

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  url text,
  self_taught boolean not null default false,
  created_at timestamptz not null default now(),
  constraint skills_evidence_check check (
    (self_taught and url is null) or (not self_taught and url is not null)
  )
);

alter table public.skills enable row level security;
grant select on table public.skills to anon, authenticated;

create policy "Anyone can view skills"
  on public.skills
  for select
  to anon, authenticated
  using (true);

commit;