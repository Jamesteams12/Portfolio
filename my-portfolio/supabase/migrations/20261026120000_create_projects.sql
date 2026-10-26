create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  slug text not null unique,
  url text,
  image_url text,
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
