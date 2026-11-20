-- CAPITALE Agent Report Authorization v1
-- Applied only after reviewed deployment. Never run against production from this change.
create schema if not exists capitale_private authorization postgres;

create table if not exists capitale_private.agent_tokens (
  agent_role text primary key check (agent_role in ('analyst', 'news', 'sxf')),
  token_hash bytea not null unique,
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table capitale_private.agent_tokens enable row level security;
revoke all on schema capitale_private from public, anon, authenticated, service_role;
revoke all on capitale_private.agent_tokens from public, anon, authenticated, service_role;

create table if not exists capitale_private.agent_write_requests (
  agent_role text not null check (agent_role in ('analyst', 'news', 'sxf')),
  run_id uuid not null references capitale.research_runs(id) on delete restrict,
  idempotency_key text not null,
  payload_hash bytea not null,
  report_id uuid references capitale.agent_reports(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (agent_role, run_id, idempotency_key)
);
alter table capitale_private.agent_write_requests enable row level security;
revoke all on capitale_private.agent_write_requests from public, anon, authenticated, service_role;

-- A single authenticated bridge RPC is the only supported writer path.
-- Identity is derived from a SHA-256 digest of the bearer token held by the DB,
-- never from a caller-supplied role.
create or replace function public.capitale_provision_agent_tokens(p_tokens jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, capitale, capitale_private, extensions
as $$
declare
  v_role text;
  v_token text;
  v_hash bytea;
begin
  if jsonb_typeof(p_tokens) <> 'object'
     or p_tokens - array['analyst', 'news', 'sxf'] <> '{}'::jsonb
     or not (p_tokens ? 'analyst' and p_tokens ? 'news' and p_tokens ? 'sxf') then
    return jsonb_build_object('ok', false, 'error', 'invalid_token_set');
  end if;

  if exists (
    select 1 from jsonb_each(p_tokens) e
    where jsonb_typeof(e.value) <> 'string'
       or length(btrim(e.value #>> '{}')) < 32
  ) then
    return jsonb_build_object('ok', false, 'error', 'token_too_short');
  end if;

  if (
    select count(distinct e.value #>> '{}') from jsonb_each(p_tokens) e
  ) <> 3 then
    return jsonb_build_object('ok', false, 'error', 'tokens_must_be_unique');
  end if;

  for v_role, v_token in
    select key, value #>> '{}' from jsonb_each(p_tokens)
  loop
    v_hash := extensions.digest(convert_to(v_token, 'UTF8'), 'sha256');
    insert into capitale_private.agent_tokens(agent_role, token_hash, enabled, updated_at)
    values (v_role, v_hash, true, now())
    on conflict (agent_role) do update
      set token_hash = excluded.token_hash, enabled = true, updated_at = now();

    insert into capitale.audit_log(actor_role, event_type, details)
    values ('admin', 'agent_token_provisioned', jsonb_build_object('agent_role', v_role));
  end loop;

  return jsonb_build_object('ok', true, 'roles', jsonb_build_array('analyst', 'news', 'sxf'));
end;
$$;

create or replace function public.capitale_record_agent_denial(
  p_bearer_token text,
  p_reason text,
  p_run_id text default null
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, capitale, capitale_private, extensions
as $$
declare
  v_actor_role text := 'unknown';
  v_run_id uuid;
begin
  if p_bearer_token is not null then
    select agent_role into v_actor_role
    from capitale_private.agent_tokens
    where enabled
      and token_hash = extensions.digest(convert_to(p_bearer_token, 'UTF8'), 'sha256')
    limit 1;
    v_actor_role := coalesce(v_actor_role, 'unknown');
  end if;

  if p_run_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    v_run_id := p_run_id::uuid;
    if not exists (select 1 from capitale.research_runs where id = v_run_id) then
      v_run_id := null;
    end if;
  end if;

  insert into capitale.audit_log(run_id, actor_role, event_type, details)
  values (
    v_run_id,
    v_actor_role,
    'agent_report_denied',
    jsonb_build_object('reason', left(coalesce(p_reason, 'invalid_request'), 80),
                       'attempted_run_id', left(coalesce(p_run_id, ''), 80))
  );
end;
$$;

create or replace function public.capitale_submit_agent_report(
  p_bearer_token text,
  p_run_id uuid,
  p_idempotency_key text,
  p_report jsonb,
  p_evidence jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, capitale, capitale_private, extensions
as $$
declare
  v_actor_role text;
  v_fixture_uid uuid;
  v_cutoff timestamptz;
  v_as_of timestamptz;
  v_hash bytea;
  v_existing_hash bytea;
  v_report_id uuid;
  v_report_version integer;
  v_item jsonb;
  v_evidence_count integer;
  v_allowed_keys text[] := array[
    'status', 'as_of', 'confidence', 'signal_score', 'data_quality',
    'source_count', 'summary', 'recommended_market', 'recommended_selection',
    'payload', 'prompt_version', 'model_name', 'input_snapshot_hash'
  ];
  v_evidence_keys text[] := array[
    'source_kind', 'source_name', 'source_uri', 'published_at',
    'claim_text', 'reliability_score', 'payload'
  ];
begin
  select agent_role into v_actor_role
  from capitale_private.agent_tokens
  where enabled
    and token_hash = extensions.digest(convert_to(coalesce(p_bearer_token, ''), 'UTF8'), 'sha256')
  limit 1;

  if v_actor_role is null then
    insert into capitale.audit_log(actor_role, event_type, details)
    values ('unknown', 'agent_report_denied', jsonb_build_object('reason', 'invalid_token'));
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if p_run_id is null or p_idempotency_key is null
     or length(p_idempotency_key) < 16 or length(p_idempotency_key) > 128
     or p_idempotency_key !~ '^[A-Za-z0-9._:-]+$' then
    insert into capitale.audit_log(actor_role, event_type, details)
    values (v_actor_role, 'agent_report_denied',
            jsonb_build_object('reason', 'invalid_idempotency_or_run_id'));
    return jsonb_build_object('ok', false, 'error', 'invalid_request');
  end if;

  if jsonb_typeof(p_report) <> 'object'
     or p_report ?| array['role', 'agent_role', 'actor_role', 'department']
     or exists (select 1 from jsonb_object_keys(p_report) k where not (k = any(v_allowed_keys)))
     or jsonb_typeof(p_report->'payload') <> 'object'
     or coalesce(p_report->>'status', '') <> 'complete'
     or nullif(p_report->>'as_of', '') is null
     or nullif(p_report->>'prompt_version', '') is null
     or nullif(p_report->>'input_snapshot_hash', '') is null
     or coalesce(p_report->>'input_snapshot_hash', '') !~* '^[0-9a-f]{64}$'
     or coalesce(p_report->>'source_count', '') !~ '^[0-9]{1,5}$'
     or jsonb_typeof(p_evidence) <> 'array'
     or jsonb_array_length(p_evidence) > 100 then
    insert into capitale.audit_log(actor_role, event_type, details)
    values (v_actor_role, 'agent_report_denied',
            jsonb_build_object('reason', 'report_schema_invalid', 'run_id', p_run_id));
    return jsonb_build_object('ok', false, 'error', 'invalid_report');
  end if;

  v_as_of := (p_report->>'as_of')::timestamptz;
  if v_as_of > now() then
    insert into capitale.audit_log(actor_role, event_type, details)
    values (v_actor_role, 'agent_report_denied',
            jsonb_build_object('reason', 'future_as_of', 'run_id', p_run_id));
    return jsonb_build_object('ok', false, 'error', 'invalid_as_of');
  end if;

  if exists (
    select 1 from jsonb_array_elements(p_evidence) e
    where jsonb_typeof(e) <> 'object'
       or exists (select 1 from jsonb_object_keys(e) k where not (k = any(v_evidence_keys)))
       or nullif(e->>'source_kind', '') is null
       or nullif(e->>'claim_text', '') is null
  ) then
    insert into capitale.audit_log(actor_role, event_type, details)
    values (v_actor_role, 'agent_report_denied',
            jsonb_build_object('reason', 'evidence_schema_invalid', 'run_id', p_run_id));
    return jsonb_build_object('ok', false, 'error', 'invalid_evidence');
  end if;

  select fixture_uid, analysis_cutoff_at into v_fixture_uid, v_cutoff
  from capitale.research_runs where id = p_run_id for key share;
  if not found then
    insert into capitale.audit_log(actor_role, event_type, details)
    values (v_actor_role, 'agent_report_denied',
            jsonb_build_object('reason', 'unknown_run', 'attempted_run_id', p_run_id));
    return jsonb_build_object('ok', false, 'error', 'invalid_fixture');
  end if;

  if v_cutoff is not null and v_as_of <> v_cutoff then
    insert into capitale.audit_log(run_id, actor_role, event_type, details)
    values (p_run_id, v_actor_role, 'agent_report_denied',
            jsonb_build_object('reason', 'as_of_mismatch', 'fixture_uid', v_fixture_uid));
    return jsonb_build_object('ok', false, 'error', 'as_of_mismatch');
  end if;

  v_hash := extensions.digest(
    convert_to(jsonb_build_object('run_id', p_run_id, 'report', p_report, 'evidence', p_evidence)::text, 'UTF8'),
    'sha256'
  );

  perform pg_advisory_xact_lock(hashtextextended(p_run_id::text || ':' || v_actor_role, 0));
  select payload_hash, report_id into v_existing_hash, v_report_id
  from capitale_private.agent_write_requests
  where agent_role = v_actor_role and run_id = p_run_id and idempotency_key = p_idempotency_key;

  if found then
    if v_existing_hash = v_hash then
      return jsonb_build_object('ok', true, 'duplicate', true, 'report_id', v_report_id);
    end if;
    insert into capitale.audit_log(run_id, actor_role, event_type, details)
    values (p_run_id, v_actor_role, 'agent_report_denied',
            jsonb_build_object('reason', 'idempotency_conflict'));
    return jsonb_build_object('ok', false, 'error', 'idempotency_conflict');
  end if;

  select coalesce(max(report_version), 0) + 1 into v_report_version
  from capitale.agent_reports where run_id = p_run_id and role = v_actor_role;

  insert into capitale.agent_reports(
    run_id, role, report_version, status, as_of, confidence, signal_score,
    data_quality, source_count, summary, recommended_market,
    recommended_selection, payload, prompt_version, model_name, input_snapshot_hash
  ) values (
    p_run_id, v_actor_role, v_report_version, 'complete', v_as_of,
    nullif(p_report->>'confidence', '')::numeric,
    nullif(p_report->>'signal_score', '')::numeric,
    nullif(p_report->>'data_quality', '')::numeric,
    (p_report->>'source_count')::integer,
    nullif(p_report->>'summary', ''),
    nullif(p_report->>'recommended_market', ''),
    nullif(p_report->>'recommended_selection', ''),
    p_report->'payload',
    p_report->>'prompt_version',
    nullif(p_report->>'model_name', ''),
    p_report->>'input_snapshot_hash'
  ) returning id into v_report_id;

  for v_item in select value from jsonb_array_elements(p_evidence)
  loop
    insert into capitale.evidence_items(
      report_id, source_kind, source_name, source_uri, published_at,
      observed_at, claim_text, reliability_score, payload
    ) values (
      v_report_id,
      v_item->>'source_kind',
      nullif(v_item->>'source_name', ''),
      nullif(v_item->>'source_uri', ''),
      nullif(v_item->>'published_at', '')::timestamptz,
      now(),
      v_item->>'claim_text',
      nullif(v_item->>'reliability_score', '')::numeric,
      coalesce(v_item->'payload', '{}'::jsonb)
    );
  end loop;

  insert into capitale_private.agent_write_requests(
    agent_role, run_id, idempotency_key, payload_hash, report_id
  ) values (v_actor_role, p_run_id, p_idempotency_key, v_hash, v_report_id);

  insert into capitale.audit_log(run_id, actor_role, event_type, details)
  values (
    p_run_id, v_actor_role, 'agent_report_saved',
    jsonb_build_object('report_id', v_report_id, 'report_version', v_report_version,
                       'fixture_uid', v_fixture_uid, 'evidence_count', jsonb_array_length(p_evidence))
  );

  return jsonb_build_object(
    'ok', true, 'duplicate', false, 'report_id', v_report_id,
    'report_version', v_report_version, 'fixture_uid', v_fixture_uid,
    'actor_role', v_actor_role
  );
end;
$$;

-- No browser role can invoke the privileged bridge or read/write the CAPITALE tables.
revoke all on function public.capitale_provision_agent_tokens(jsonb) from public, anon, authenticated;
revoke all on function public.capitale_record_agent_denial(text, text, text) from public, anon, authenticated;
revoke all on function public.capitale_submit_agent_report(text, uuid, text, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.capitale_provision_agent_tokens(jsonb) to service_role;
grant execute on function public.capitale_record_agent_denial(text, text, text) to service_role;
grant execute on function public.capitale_submit_agent_report(text, uuid, text, jsonb, jsonb) to service_role;

alter table capitale.research_runs enable row level security;
alter table capitale.agent_reports enable row level security;
alter table capitale.evidence_items enable row level security;
alter table capitale.audit_log enable row level security;
revoke all on capitale.research_runs, capitale.agent_reports, capitale.evidence_items, capitale.audit_log from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on capitale.research_runs, capitale.agent_reports, capitale.evidence_items, capitale.audit_log from service_role;
grant select on capitale.agent_reports, capitale.evidence_items to service_role;

alter table capitale.agent_reports drop constraint if exists agent_reports_role_check;
alter table capitale.agent_reports add constraint agent_reports_role_check
  check (role = any (array['analyst'::text, 'news'::text, 'sxf'::text));

create or replace function capitale_private.deny_immutable_change()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  raise exception 'CAPITALE historical records are append-only';
end;
$$;

drop trigger if exists agent_reports_are_immutable on capitale.agent_reports;
create trigger agent_reports_are_immutable before update or delete on capitale.agent_reports
for each row execute function capitale_private.deny_immutable_change();
drop trigger if exists evidence_items_are_immutable on capitale.evidence_items;
create trigger evidence_items_are_immutable before update or delete on capitale.evidence_items
for each row execute function capitale_private.deny_immutable_change();
drop trigger if exists audit_log_is_immutable on capitale.audit_log;
create trigger audit_log_is_immutable before update or delete on capitale.audit_log
for each row execute function capitale_private.deny_immutable_change();
