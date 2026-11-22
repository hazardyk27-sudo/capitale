-- CAPITALE Software feed: keep each fixture visible exactly once.
-- Original service_role-only RPC retained as _raw; wrapper selects the highest
-- owner-approved SXF family when both early and final reports exist.
-- Never exposes the original raw RPC to anon/authenticated.
begin;

alter function public.capitale_admin_software_feed()
  rename to capitale_admin_software_feed_raw;

revoke execute on function public.capitale_admin_software_feed_raw()
  from public, anon, authenticated;

create function public.capitale_admin_software_feed()
returns jsonb
language sql
security definer
set search_path to 'pg_catalog','public','capitale'
as $function$
  with full_feed as (
    select public.capitale_admin_software_feed_raw() as body
  ),
  individual as (
    select item, pos
    from full_feed
    cross join lateral jsonb_array_elements(
      coalesce(full_feed.body->'runs','[]'::jsonb)
    ) with ordinality as records(item,pos)
  ),
  scored as (
    select i.item,i.pos,
      case
        when coalesce(report.data->'display'->'engine_tags','[]'::jsonb) ?|
              array['HEAVY_1X2_CONCENTRATION','HEAVY_1X2','PREMIUM_OVER_2_5','PREMIUM_OVER_MIN1_70']
          or split_part(coalesce(report.data->'display'->>'signal_code',''),'-',1)='PRM' then 4
        when coalesce(report.data->'display'->'engine_tags','[]'::jsonb) ?|
              array['1X2_CONCENTRATION_V2','BTTS_YES']
          or split_part(coalesce(report.data->'display'->>'signal_code',''),'-',1)='CRL' then 3
        when coalesce(report.data->'display'->'engine_tags','[]'::jsonb) ?|
              array['STABLE_OVER_2_5','1X2_CONCENTRATION_V1']
          or split_part(coalesce(report.data->'display'->>'signal_code',''),'-',1)='MOM' then 2
        when coalesce(report.data->'display'->'engine_tags','[]'::jsonb) ?|
              array['EARLY_MONEY_CORE','EARLY_MONEY_CORE_V2','SURPRISE_TEAM']
          or split_part(coalesce(report.data->'display'->>'signal_code',''),'-',1)='SLD' then 1
        else 0
      end as engine_priority,
      case
        when report.data->'display'->>'source_signal_kind'='EARLY_SIGNAL' then 0
        else 1
      end as final_priority
    from individual i
    left join lateral (
      select r.value as data
      from jsonb_array_elements(coalesce(i.item->'reports','[]'::jsonb)) r(value)
      where r.value->>'role'='sxf'
      order by nullif(r.value->>'version','')::integer desc nulls last
      limit 1
    ) report on true
  ),
  chosen as (
    select *,
      row_number() over (
        partition by item->>'fixture_uid'
        order by engine_priority desc, final_priority desc,
          (item->>'as_of')::timestamptz desc nulls last,
          pos asc
      ) as choice_rank
    from scored
  )
  select jsonb_build_object(
    'ok',coalesce((select (body->>'ok')::boolean from full_feed),false),
    'runs',coalesce(
      (select jsonb_agg(item order by pos) from chosen where choice_rank=1),
      '[]'::jsonb
    )
  );
$function$;

revoke execute on function public.capitale_admin_software_feed()
  from public, anon, authenticated;
grant execute on function public.capitale_admin_software_feed()
  to service_role;

commit;
notify pgrst, 'reload schema';
