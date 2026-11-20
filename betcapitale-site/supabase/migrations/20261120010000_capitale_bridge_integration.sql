
-- Bridge integration: fixture metadata only for agents, Admin-only preparation and reads.
create or replace function capitale_private.find_fixture_runs(p_query text, p_day date)
returns jsonb language sql security definer set search_path=pg_catalog,public,capitale as $$
 select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
 select f.fixture_uid,f.home_team,f.away_team,f.league,f.kickoff_utc,
 r.id as run_id,r.analysis_cutoff_at,r.run_revision
 from public.fixtures f left join capitale.research_runs r on r.fixture_uid=f.fixture_uid
 where (p_day is null or (f.kickoff_utc at time zone 'Europe/Istanbul')::date=p_day)
 and (coalesce(p_query,'')='' or position(lower(p_query) in lower(f.home_team||' '||f.away_team))>0)
 order by f.kickoff_utc desc,r.run_revision desc limit 50
 ) x;
$$;
revoke all on function capitale_private.find_fixture_runs(text,date) from public,anon,authenticated,service_role;

create or replace function public.capitale_agent_resolve_run(p_bearer_token text,p_query text,p_day date default null)
returns jsonb language plpgsql security definer set search_path=pg_catalog,capitale,capitale_private,extensions as $$
declare v_role text;
begin
 select agent_role into v_role from capitale_private.agent_tokens
 where enabled and token_hash=extensions.digest(convert_to(coalesce(p_bearer_token,''),'UTF8'),'sha256');
 if v_role is null then
  insert into capitale.audit_log(actor_role,event_type,details) values('unknown','agent_report_denied','{"reason":"invalid_resolver_token"}');
  return jsonb_build_object('ok',false,'error','unauthorized');
 end if;
 if length(btrim(coalesce(p_query,'')))<2 or length(p_query)>160 then
  return jsonb_build_object('ok',false,'error','invalid_query');
 end if;
 return jsonb_build_object('ok',true,'matches',capitale_private.find_fixture_runs(p_query,p_day));
end;
$$;

create or replace function public.capitale_admin_fixture_runs(p_query text,p_day date default null)
returns jsonb language sql security definer set search_path=pg_catalog,capitale_private as $$
 select jsonb_build_object('ok',true,'matches',capitale_private.find_fixture_runs(p_query,p_day));
$$;

create or replace function public.capitale_admin_prepare_run(p_fixture_uid uuid,p_as_of timestamptz)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,capitale as $$
declare v_kickoff timestamptz; v_id uuid; v_revision integer; v_fixture jsonb;
begin
 select kickoff_utc,jsonb_build_object('home_team',home_team,'away_team',away_team,'league',league,'kickoff_utc',kickoff_utc) into v_kickoff,v_fixture from public.fixtures where fixture_uid=p_fixture_uid;
 if not found then return jsonb_build_object('ok',false,'error','invalid_fixture'); end if;
 if p_as_of is null or p_as_of>now() or v_kickoff is null or p_as_of>=v_kickoff then
  return jsonb_build_object('ok',false,'error','invalid_as_of');
 end if;
 perform pg_advisory_xact_lock(hashtextextended(p_fixture_uid::text,17));
 select id,run_revision into v_id,v_revision from capitale.research_runs
 where fixture_uid=p_fixture_uid and analysis_cutoff_at=p_as_of order by run_revision desc limit 1;
 if not found then
  select coalesce(max(run_revision),0)+1 into v_revision from capitale.research_runs where fixture_uid=p_fixture_uid;
  insert into capitale.research_runs(fixture_uid,run_revision,status,analysis_cutoff_at,orchestrator_version,context)
  values(p_fixture_uid,v_revision,'collecting',p_as_of,'agent-bridge-v1',jsonb_build_object('fixture',v_fixture)) returning id into v_id;
  insert into capitale.audit_log(run_id,actor_role,event_type,details)
  values(v_id,'admin','research_run_prepared',jsonb_build_object('fixture_uid',p_fixture_uid));
 end if;
 return jsonb_build_object('ok',true,'run_id',v_id,'fixture_uid',p_fixture_uid,'run_revision',v_revision,'as_of',p_as_of);
end;
$$;

create or replace function public.capitale_admin_software_feed()
returns jsonb language sql security definer set search_path=pg_catalog,public,capitale as $$
 with recent as (
  select r.*,coalesce(f.home_team,r.context#>>'{fixture,home_team}') as home_team,coalesce(f.away_team,r.context#>>'{fixture,away_team}') as away_team,coalesce(f.league,r.context#>>'{fixture,league}') as league,coalesce(f.kickoff_utc,(r.context#>>'{fixture,kickoff_utc}')::timestamptz) as kickoff_utc
  from capitale.research_runs r left join public.fixtures f on f.fixture_uid=r.fixture_uid
  order by r.requested_at desc limit 200
 ), latest as (
  select distinct on (ar.run_id,ar.role) ar.*
  from capitale.agent_reports ar join recent r on r.id=ar.run_id
  where ar.role in ('analyst','news','sxf')
  order by ar.run_id,ar.role,ar.report_version desc
 )
 select jsonb_build_object('ok',true,'runs',coalesce(jsonb_agg(jsonb_build_object(
 'id',r.id,'fixture_uid',r.fixture_uid,'home_team',r.home_team,'away_team',r.away_team,
 'league',r.league,'kickoff_utc',r.kickoff_utc,'as_of',r.analysis_cutoff_at,
 'reports',coalesce((select jsonb_agg(jsonb_build_object(
 'role',a.role,'version',a.report_version,'as_of',a.as_of,
 'display',a.payload->'display',
 'analyst_score',a.payload#>'{conclusion,selection_support_score_0_100}',
 'news_scores',a.payload->'user_preference_news_support_scores_100'
 )) from latest a where a.run_id=r.id),'[]'::jsonb)
 ) order by r.requested_at desc),'[]'::jsonb)) from recent r;
$$;
revoke all on function public.capitale_agent_resolve_run(text,text,date) from public,anon,authenticated;
revoke all on function public.capitale_admin_fixture_runs(text,date) from public,anon,authenticated;
revoke all on function public.capitale_admin_prepare_run(uuid,timestamptz) from public,anon,authenticated;
revoke all on function public.capitale_admin_software_feed() from public,anon,authenticated;
grant execute on function public.capitale_agent_resolve_run(text,text,date) to service_role;
grant execute on function public.capitale_admin_fixture_runs(text,date) to service_role;
grant execute on function public.capitale_admin_prepare_run(uuid,timestamptz) to service_role;
grant execute on function public.capitale_admin_software_feed() to service_role;
