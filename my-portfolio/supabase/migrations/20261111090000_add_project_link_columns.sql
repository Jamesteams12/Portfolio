alter table public.projects
  add column if not exists url text,
  add column if not exists image_url text;
