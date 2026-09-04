alter table public.tile_timetable_shares
alter column owner_id drop not null;

alter table public.tile_timetable_shares
add column if not exists anonymous_key text,
add column if not exists expires_at timestamptz;

create index if not exists tile_timetable_shares_anonymous_rate_idx
on public.tile_timetable_shares (anonymous_key, created_at desc)
where owner_id is null;

create index if not exists tile_timetable_shares_expiry_idx
on public.tile_timetable_shares (expires_at)
where expires_at is not null;

comment on column public.tile_timetable_shares.anonymous_key is
'One-way server hash used only to rate-limit anonymous share creation.';

comment on column public.tile_timetable_shares.expires_at is
'Anonymous shares expire after 30 days; authenticated shares remain null.';
