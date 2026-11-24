-- Serialize each anonymous identity's quota check and insert in one transaction.
create or replace function public.create_anonymous_tile_share(
  p_anonymous_key text,
  p_title text,
  p_description text,
  p_payload jsonb,
  p_scopes jsonb
)
returns public.tile_timetable_shares
language plpgsql
security invoker
set search_path = ''
as $$
declare
  recent_count integer;
  created public.tile_timetable_shares;
begin
  if p_anonymous_key is null or p_anonymous_key !~ '^[0-9a-f]{32}$' then
    raise exception 'invalid_anonymous_key' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_anonymous_key, 0));

  select count(*) into recent_count
  from public.tile_timetable_shares
  where owner_id is null
    and anonymous_key = p_anonymous_key
    and created_at >= pg_catalog.now() - interval '1 hour';

  if recent_count >= 5 then
    raise exception 'anonymous_share_rate_limit' using errcode = 'P0001';
  end if;

  insert into public.tile_timetable_shares
    (owner_id, anonymous_key, title, description, payload, scopes, expires_at, is_active)
  values
    (null, p_anonymous_key, p_title, p_description, p_payload, p_scopes,
     pg_catalog.now() + interval '30 days', true)
  returning * into created;

  return created;
end;
$$;

revoke all on function public.create_anonymous_tile_share(text, text, text, jsonb, jsonb)
from public, anon, authenticated;
grant execute on function public.create_anonymous_tile_share(text, text, text, jsonb, jsonb)
to service_role;
