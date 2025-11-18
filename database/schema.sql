-- Supabase setup for Royal Academy app
-- Run this entire script in the Supabase SQL editor

-- 1) Extensions (for UUIDs)
create extension if not exists pgcrypto;

-- 2) Public app-wide key/value storage (backing for localStorage replacement)
create table if not exists public.app_state (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on updates
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists app_state_set_updated_at on public.app_state;
create trigger app_state_set_updated_at
before update on public.app_state
for each row execute function public.set_updated_at();

-- 3) Enable Row Level Security and permissive policies (public demo)
-- NOTE: This makes the table writable by anyone with the anon key.
-- Lock down for production by scoping policies to authenticated users or custom rules.
alter table public.app_state enable row level security;

-- Policies
drop policy if exists "app_state_read_all" on public.app_state;
create policy "app_state_read_all"
  on public.app_state for select
  using (true);

drop policy if exists "app_state_insert_all" on public.app_state;
create policy "app_state_insert_all"
  on public.app_state for insert
  with check (true);

drop policy if exists "app_state_update_all" on public.app_state;
create policy "app_state_update_all"
  on public.app_state for update
  using (true)
  with check (true);

drop policy if exists "app_state_delete_all" on public.app_state;
create policy "app_state_delete_all"
  on public.app_state for delete
  using (true);

-- Grants (ensure anon/authenticated can use the table via RLS)
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.app_state to anon, authenticated;

-- 4) Enable realtime on this table
-- (Supabase creates publication supabase_realtime by default. If it exists, we add our table.)
-- If the publication doesn't exist in your project, create it: CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
-- If this fails with "publication \"supabase_realtime\" does not exist",
-- first run: CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
alter publication supabase_realtime add table public.app_state;

-- 5) Public storage bucket for assets (gallery, etc.)
insert into storage.buckets (id, name, public)
values ('public-assets', 'public-assets', true)
on conflict (id) do nothing;

-- RLS Policies for public bucket (open demo)
-- Read by anyone
drop policy if exists "storage_public_read" on storage.objects;
create policy "storage_public_read"
  on storage.objects for select
  using (bucket_id = 'public-assets');

-- Insert by anyone
drop policy if exists "storage_public_insert" on storage.objects;
create policy "storage_public_insert"
  on storage.objects for insert
  with check (bucket_id = 'public-assets');

-- Update by anyone
drop policy if exists "storage_public_update" on storage.objects;
create policy "storage_public_update"
  on storage.objects for update
  using (bucket_id = 'public-assets')
  with check (bucket_id = 'public-assets');

-- Delete by anyone
drop policy if exists "storage_public_delete" on storage.objects;
create policy "storage_public_delete"
  on storage.objects for delete
  using (bucket_id = 'public-assets');

-- 6) Helpful indexes
create index if not exists app_state_updated_at_idx on public.app_state (updated_at desc);

-- 7) Seed some well-known keys (optional)
-- Uncomment if you want initial values present immediately
-- insert into public.app_state(key, value) values
--   ('royal-academy-about', '{}'::text),
--   ('royal-academy-homepage', '{}'::text),
--   ('royal-academy-teachers', '[]'::text),
--   ('royal-academy-auth-teachers', '[]'::text),
--   ('royal-academy-students', '[]'::text),
--   ('royal-academy-auth-students', '[]'::text),
--   ('royal-academy-announcements', '[]'::text),
--   ('royal-academy-gallery', '[]'::text),
--   ('royal-academy-courses', '[]'::text),
--   ('royal-academy-admissions', '[]'::text),
--   ('royal-academy-pricing', '{}'::text)
-- on conflict (key) do nothing;