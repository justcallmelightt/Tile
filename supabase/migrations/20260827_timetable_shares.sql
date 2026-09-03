create extension if not exists pgcrypto;

create table if not exists public.tile_timetable_shares (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 60),
  description text not null default '' check (char_length(description) <= 240),
  payload jsonb not null,
  scopes jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tile_timetable_shares
add column if not exists description text not null default '';

create index if not exists tile_timetable_shares_owner_created_idx
on public.tile_timetable_shares (owner_id, created_at desc);

alter table public.tile_timetable_shares enable row level security;
grant select, insert, update, delete on public.tile_timetable_shares to authenticated;

drop policy if exists "Users can read their timetable shares" on public.tile_timetable_shares;
create policy "Users can read their timetable shares" on public.tile_timetable_shares
for select to authenticated using ((select auth.uid()) = owner_id);

drop policy if exists "Users can create timetable shares" on public.tile_timetable_shares;
create policy "Users can create timetable shares" on public.tile_timetable_shares
for insert to authenticated with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can update their timetable shares" on public.tile_timetable_shares;
create policy "Users can update their timetable shares" on public.tile_timetable_shares
for update to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can delete their timetable shares" on public.tile_timetable_shares;
create policy "Users can delete their timetable shares" on public.tile_timetable_shares
for delete to authenticated using ((select auth.uid()) = owner_id);
