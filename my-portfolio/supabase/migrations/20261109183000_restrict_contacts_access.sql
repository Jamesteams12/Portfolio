alter table public.contacts enable row level security;

revoke all on table public.contacts from public, anon, authenticated;
grant insert on table public.contacts to anon, authenticated;
grant select, insert, update, delete on table public.contacts to service_role;

drop policy if exists "Anyone can submit a contact message"
  on public.contacts;

create policy "Anyone can submit a contact message"
  on public.contacts
  for insert
  to anon, authenticated
  with check (true);
