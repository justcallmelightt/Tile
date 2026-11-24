-- Only the server-side metrics endpoint writes to this table. No timetable or account content is stored.
create table if not exists public.tile_usage_events (
  id bigint generated always as identity primary key,
  recorded_at timestamptz not null default now(),
  visitor_id uuid not null,
  session_id uuid not null,
  event_name text not null check (event_name in (
    'visit', 'intro_view', 'intro_skipped', 'intro_start_clicked',
    'start_choices_view', 'school_setup_view', 'school_search_empty',
    'school_search_error', 'school_selected', 'class_entered', 'school_times_view',
    'school_preview_ready', 'school_setup_complete', 'school_setup_error',
    'school_setup_closed', 'manual_setup_complete', 'manual_setup_error',
    'school_times_complete', 'timetable_edit_complete', 'after_school_add_complete', 'auth_google_start', 'auth_email_start',
    'auth_signup_requested', 'auth_complete', 'auth_session_seen', 'auth_error', 'backup_error'
  )),
  failure_reason text check (failure_reason is null or failure_reason in
    ('validation', 'network', 'provider', 'storage', 'unknown'))
);

create index if not exists tile_usage_events_recorded_at_idx on public.tile_usage_events (recorded_at);
create index if not exists tile_usage_events_visitor_time_idx on public.tile_usage_events (visitor_id, recorded_at);
alter table public.tile_usage_events enable row level security;
revoke all on public.tile_usage_events from anon, authenticated;
revoke all on sequence public.tile_usage_events_id_seq from anon, authenticated;

-- Supabase Cron removes old pseudonymous events every day at 03:15 UTC.
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule(
  'tile-usage-events-retention-90d',
  '15 3 * * *',
  $$delete from public.tile_usage_events where recorded_at < now() - interval '90 days'$$
);
