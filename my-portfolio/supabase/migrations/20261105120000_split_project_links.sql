alter table public.projects
  rename column url to live_url;

alter table public.projects
  add column github_url text;
