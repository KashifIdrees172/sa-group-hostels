-- Run this once in the Supabase SQL editor.
-- Lets admins override hostel (branch) locations, same pattern as hotels.location.
-- Until a row exists for a branch id, the site keeps showing the default
-- location from src/data/branches.js.

create table if not exists public.branches (
  id text primary key,
  location text,
  updated_at timestamptz not null default now()
);

alter table public.branches enable row level security;

drop policy if exists "Public can read branch locations" on public.branches;
create policy "Public can read branch locations"
  on public.branches
  for select
  using (true);

drop policy if exists "Admins can insert branch locations" on public.branches;
create policy "Admins can insert branch locations"
  on public.branches
  for insert
  with check (
    exists (
      select 1 from public.admin_profiles
      where admin_profiles.user_id = auth.uid()
    )
  );

drop policy if exists "Admins can update branch locations" on public.branches;
create policy "Admins can update branch locations"
  on public.branches
  for update
  using (
    exists (
      select 1 from public.admin_profiles
      where admin_profiles.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.admin_profiles
      where admin_profiles.user_id = auth.uid()
    )
  );
