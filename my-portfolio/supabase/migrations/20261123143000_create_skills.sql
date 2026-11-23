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
