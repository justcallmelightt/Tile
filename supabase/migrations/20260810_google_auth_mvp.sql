create table if not exists public.tile_backups (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.tile_backups enable row level security;
grant select, insert, update, delete on public.tile_backups to authenticated;

drop policy if exists "Users can read their Tile backup" on public.tile_backups;
create policy "Users can read their Tile backup" on public.tile_backups
for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their Tile backup" on public.tile_backups;
create policy "Users can create their Tile backup" on public.tile_backups
for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their Tile backup" on public.tile_backups;
create policy "Users can update their Tile backup" on public.tile_backups
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their Tile backup" on public.tile_backups;
create policy "Users can delete their Tile backup" on public.tile_backups
for delete to authenticated using ((select auth.uid()) = user_id);
