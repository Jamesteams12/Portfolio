alter table public.projects
  add column if not exists github_url text,
  add column if not exists live_url text;

update public.projects
set live_url = url
where live_url is null
  and url is not null;
