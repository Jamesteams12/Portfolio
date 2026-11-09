create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

grant insert on table public.contacts to anon, authenticated;

create policy "Anyone can submit a contact message"
  on public.contacts
  for insert
  to anon, authenticated
  with check (true);
