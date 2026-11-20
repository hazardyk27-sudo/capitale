import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Client } from "pg";
import { test } from "node:test";

const connectionString = process.env.CAPITALE_TEST_DATABASE_URL;
const here = dirname(fileURLToPath(import.meta.url));

test("CAPITALE database authorization enforces role isolation, append-only history, and RLS", {
  skip: !connectionString,
}, async () => {
  const dbName = new URL(connectionString).pathname.replace(/^\//, "");
  assert.equal(dbName, "capitale_agent_auth_test", "refusing to reset a non-test database");
  const client = new Client({ connectionString });
  await client.connect();
  try {
    await client.query(`
      create schema if not exists extensions;
      create extension if not exists pgcrypto with schema extensions;
      do $$ begin
        if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
        if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
        if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
      end $$;
      alter role service_role bypassrls;
      drop function if exists public.capitale_submit_agent_report(text, uuid, text, jsonb, jsonb);
      drop function if exists public.capitale_record_agent_denial(text, text, text);
      drop function if exists public.capitale_provision_agent_tokens(jsonb);
      drop schema if exists capitale_private cascade;
      drop schema if exists capitale cascade;
      create schema capitale;
      create table capitale.research_runs (
        id uuid primary key,
        fixture_uid uuid not null,
        analysis_cutoff_at timestamptz,
        status text not null default 'collecting'
      );
      create table capitale.agent_reports (
        id uuid primary key default gen_random_uuid(),
        run_id uuid not null references capitale.research_runs(id) on delete cascade,
        role text not null check (role = any (array['analyst','news','sxf','poly'])),
        report_version integer not null default 1,
        status text not null default 'complete',
        as_of timestamptz not null default now(),
        confidence numeric,
        signal_score numeric,
        data_quality numeric,
        source_count integer not null default 0,
        summary text,
        recommended_market text,
        recommended_selection text,
        payload jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        prompt_version text,
        model_name text,
        input_snapshot_hash text,
        unique (run_id, role, report_version)
      );
      create table capitale.evidence_items (
        id uuid primary key default gen_random_uuid(),
        report_id uuid not null references capitale.agent_reports(id) on delete cascade,
        source_kind text not null,
        source_name text,
        source_uri text,
        published_at timestamptz,
        observed_at timestamptz not null default now(),
        claim_text text not null,
        reliability_score numeric,
        payload jsonb not null default '{}'::jsonb
      );
      create table capitale.audit_log (
        id bigserial primary key,
        run_id uuid references capitale.research_runs(id) on delete cascade,
        actor_role text not null,
        event_type text not null,
        details jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now()
      );
    `);

    const migration = await readFile(resolve(here, "../supabase/migrations/20261120000000_capitale_agent_report_authorization.sql"), "utf8");
    await client.query(migration);
    await client.query("grant usage on schema capitale to authenticated");
    await client.query("grant select, insert on capitale.agent_reports to authenticated");

    const runId = "10000000-0000-4000-8000-000000000001";
    const fixtureUid = "20000000-0000-4000-8000-000000000002";
    const cutoff = "2026-11-20T11:00:00.000Z";
    await client.query(
      "insert into capitale.research_runs(id, fixture_uid, analysis_cutoff_at) values ($1, $2, $3)",
      [runId, fixtureUid, cutoff],
    );

    const tokens = {
      analyst: "analyst-test-token-" + "a".repeat(48),
      news: "news-test-token-" + "b".repeat(48),
      sxf: "sxf-test-token-" + "c".repeat(48),
    };
    await client.query("set role service_role");
    const provisioned = await client.query("select public.capitale_provision_agent_tokens($1::jsonb) as value", [JSON.stringify(tokens)]);
    assert.equal(provisioned.rows[0].value.ok, true);

    const baseReport = {
      status: "complete",
      as_of: cutoff,
      confidence: 0.61,
      signal_score: 0.2,
      data_quality: 0.9,
      source_count: 1,
      summary: "version one",
      recommended_market: null,
      recommended_selection: null,
      payload: { methodology_version: "test-v1" },
      prompt_version: "test-v1",
      model_name: "test-model",
      input_snapshot_hash: "a".repeat(64),
    };
    const evidence = [{
      source_kind: "official",
      source_name: "Test source",
      source_uri: "https://example.invalid/source",
      published_at: cutoff,
      claim_text: "Verified test evidence",
      reliability_score: 0.9,
      payload: {},
    }];
    const submit = async (token, idempotencyKey, report = baseReport, targetRun = runId, items = evidence) => {
      const result = await client.query(
        "select public.capitale_submit_agent_report($1, $2::uuid, $3, $4::jsonb, $5::jsonb) as value",
        [token, targetRun, idempotencyKey, JSON.stringify(report), JSON.stringify(items)],
      );
      return result.rows[0].value;
    };

    const analyst = await submit(tokens.analyst, "analyst-write-000001");
    const news = await submit(tokens.news, "news-write-00000001");
    const sxf = await submit(tokens.sxf, "sxf-write-000000001");
    assert.equal(analyst.actor_role, "analyst");
    assert.equal(news.actor_role, "news");
    assert.equal(sxf.actor_role, "sxf");
    assert.equal(analyst.report_version, 1);
    assert.equal(news.report_version, 1);
    assert.equal(sxf.report_version, 1);

    const duplicate = await submit(tokens.analyst, "analyst-write-000001");
    assert.equal(duplicate.duplicate, true);
    assert.equal(duplicate.report_id, analyst.report_id);
    const conflict = await submit(tokens.analyst, "analyst-write-000001", { ...baseReport, summary: "changed" });
    assert.equal(conflict.error, "idempotency_conflict");

    const attemptedCrossWrite = await submit(tokens.analyst, "cross-write-00000001", { ...baseReport, role: "news" });
    assert.equal(attemptedCrossWrite.error, "invalid_report");
    const unknownFixture = await submit(tokens.analyst, "invalid-run-000000001", baseReport, "30000000-0000-4000-8000-000000000003");
    assert.equal(unknownFixture.error, "invalid_fixture");
    const invalidToken = await submit("not-a-valid-agent-token", "invalid-token-00001");
    assert.equal(invalidToken.error, "unauthorized");

    const newer = await submit(tokens.analyst, "analyst-write-000002", { ...baseReport, summary: "version two" });
    assert.equal(newer.report_version, 2);

    const adminRuns = await client.query("select public.capitale_admin_list_runs(10) as value");
    assert.equal(adminRuns.rows[0].value.runs.length, 1);
    assert.equal(adminRuns.rows[0].value.runs[0].fixture_uid, fixtureUid);
    const adminReports = await client.query("select public.capitale_admin_get_agent_reports($1::uuid) as value", [runId]);
    assert.equal(adminReports.rows[0].value.reports.length, 4);
    assert.equal(adminReports.rows[0].value.evidence.length, 4);
    await assert.rejects(client.query("select * from capitale.agent_reports"));
    await client.query("reset role");

    assert.equal((await client.query("select count(*)::int as count from capitale.agent_reports where role = 'poly'")).rows[0].count, 0);
    await assert.rejects(client.query("insert into capitale.agent_reports(run_id,role) values ($1, 'poly')", [runId]));

    const reports = await client.query(
      "select role, report_version, summary from capitale.agent_reports where run_id=$1 order by role,report_version",
      [runId],
    );
    assert.deepEqual(reports.rows, [
      { role: "analyst", report_version: 1, summary: "version one" },
      { role: "analyst", report_version: 2, summary: "version two" },
      { role: "news", report_version: 1, summary: "version one" },
      { role: "sxf", report_version: 1, summary: "version one" },
    ]);
    const evidenceCount = await client.query(
      "select count(*)::int as count from capitale.evidence_items where report_id=$1",
      [analyst.report_id],
    );
    assert.equal(evidenceCount.rows[0].count, 1);

    await client.query("set role authenticated");
    const hiddenReports = await client.query("select * from capitale.agent_reports");
    assert.equal(hiddenReports.rowCount, 0);
    await assert.rejects(
      client.query("select public.capitale_submit_agent_report('x', $1::uuid, 'some-idempotency-key', '{}'::jsonb, '[]'::jsonb)", [runId]),
    );
    await assert.rejects(
      client.query("insert into capitale.agent_reports(run_id,role) values ($1,'analyst')", [runId]),
    );
    await client.query("reset role");

    await client.query("set role service_role");
    await assert.rejects(
      client.query("insert into capitale.agent_reports(run_id,role) values ($1,'analyst')", [runId]),
    );
    await client.query("reset role");

    await assert.rejects(
      client.query("update capitale.agent_reports set summary='mutated' where id=$1", [analyst.report_id]),
    );
    await assert.rejects(client.query("delete from capitale.agent_reports where id=$1", [analyst.report_id]));
    const denialCount = await client.query(
      "select count(*)::int as count from capitale.audit_log where event_type='agent_report_denied'",
    );
    assert.ok(denialCount.rows[0].count >= 4);
  } finally {
    await client.end();
  }
});
