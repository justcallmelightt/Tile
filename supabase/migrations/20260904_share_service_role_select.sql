-- The public share endpoint reads active records with the server-only service role.
-- RLS continues to protect browser clients; only this server role gets table access.
grant select on table public.tile_timetable_shares to service_role;
