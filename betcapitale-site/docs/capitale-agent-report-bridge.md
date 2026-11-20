# CAPITALE Agent Report Bridge

Current deployment: tokenless department-specific transfer routes are live on Betcapitale.

## Purpose and allowed writers

This bridge accepts completed reports for exactly three independent departments:

- `analyst`
- `news`
- `sxf`

It gives no write permission to `poly` or `final`. Agents can only resolve fixture/run metadata; they cannot read reports. Full report and evidence reads are behind the site's database-backed Admin session.

## Security boundary

1. Agents use no token or authorization header. Each department has a distinct public route; the server derives the recorded role from that route.
2. The public route does not prove the sender identity; anyone who knows a run ID can attempt a submission. This is the owner-approved tokenless trial mode.
3. The database still validates report structure, run binding, AS_OF, size, and idempotency, and appends versioned history.
4. The bridge writes by calling the database RPC. It does not insert or update report tables directly.
5. The RPC accepts only an existing `research_runs.id`; the database derives the associated `fixture_uid`. Unknown run IDs are rejected and audited.
6. Each accepted save appends a new report version. Repeating the same idempotency key and content returns the original report; reusing that key for different content is rejected.
7. RLS stays enabled with no browser policies. Browser reads/writes remain denied. Historical reports, evidence, and audit rows are append-only.
8. No source secrets, report content, or raw bearer tokens are written to logs. Denials store only a short reason and attempted run identifier.

## Server-only configuration

Hetzner keeps Supabase service credentials server-side. Agents do not receive those credentials or any agent token.

## Agent write contract

Use the role-specific public route with JSON content type and no Authorization header:

- ANALYST: `POST /api/capitale/agent-bridge/reports/analyst`
- NEWS: `POST /api/capitale/agent-bridge/reports/news`
- SXF: `POST /api/capitale/agent-bridge/reports/sxf`

Body:

```json
{
  "run_id": "UUID of an existing CAPITALE research run",
  "idempotency_key": "a stable unique key of 16-128 characters",
  "report": {
    "status": "complete",
    "as_of": "2026-11-20T11:00:00.000Z",
    "confidence": 0.61,
    "signal_score": 0.2,
    "data_quality": 0.9,
    "source_count": 3,
    "summary": "Short report summary",
    "recommended_market": null,
    "recommended_selection": null,
    "payload": {"methodology_version": "analyst-v2.1"},
    "prompt_version": "analyst-v2.1",
    "model_name": "model name",
    "input_snapshot_hash": "64 hexadecimal characters"
  },
  "evidence": [
    {
      "source_kind": "official",
      "source_name": "Source name",
      "source_uri": "https://example.org/source",
      "published_at": "2026-11-20T10:00:00.000Z",
      "claim_text": "Specific sourced claim",
      "reliability_score": 0.9,
      "payload": {}
    }
  ]
}
```

`role`, `agent_role`, `actor_role`, and `department` should be omitted from the request; the route assigns the department. The report must be complete, have a reproducibility hash and prompt version, and use the run's exact analysis cutoff when one is present. Evidence is capped at 100 items and the request at 512 KiB.

The caller must resolve the exact existing run before submitting. The bridge does not create a run from free-form team names. It rejects an unknown run instead of guessing a match.

## Admin reads

- `GET /api/admin/capitale/research-runs?limit=50` lists run identifiers and safe metadata (it omits free-form context). Admin session required.
- `GET /api/admin/capitale/agent-reports/:runId` returns the reports and evidence for one run. Admin session required.
- Reports include all allowed departments; no agent bearer token can use this endpoint.

## Rollout order

1. Confirm the exact match and existing run in Admin > Software.
2. Send the completed existing report to the matching department URL above.
3. Confirm the response is 201 or an idempotent 200 and verify the report appears in Admin > Software.

This change does not deploy or apply the migration by itself. The current Supabase inspection found the four target tables empty, RLS enabled, and no policies. The database already allowed `poly` in the report-role check; the migration narrows that constraint to ANALYST, NEWS, and SXF.


## Existing-report transfer and Admin integration
Agents only transfer existing reports, never research, invent missing values or change conclusions. Admin prepares the canonical fixture and original AS_OF at `/admin/software`. `POST /api/capitale/agent-bridge/resolve-match` accepts `{ "query": "team name", "day": "YYYY-MM-DD" }` without a token and returns fixture/run metadata only. If several matches or cutoffs remain possible, ask rather than guessing. No run means Admin must prepare it first.

The report's full original structured data remains in `payload`. An optional `payload.display` projection may copy **existing** values for the table. Do not generate absent fields:
- All roles: `market`, `selection` identify exactly the same selection (e.g. `1X2`, `1`).
- ANALYST and NEWS: `support_score` (0..100), only if explicitly present in their own report.
- SXF: `signal_code`, `volume_share_pct`, `draw_share_pct`, `current_odds`, `reference_odds`, `current_odds_at`, `reference_odds_at`, `source`.
A/N appear only when their market and selection match SXF. Wrong-owner values are ignored by the projection. Missing values remain dashes. Full reports remain readable separately and append-only.

The second migration `20261120010000_capitale_bridge_integration.sql` adds safe fixture resolution and Admin preparation/feed. Fixture metadata is captured when a run is prepared so retention does not erase the match name. Report response bodies are excluded from HTTP logs.

## Connection boundary
Publishing the API does not install a tool into an existing ChatGPT conversation. Configure a supported API client/custom action with the published OpenAPI schema. No API credential is needed in the agent connector. Never expose the server-side Supabase service-role key. A live end-to-end transfer is complete only when the API returns an accepted report ID and the Admin page shows that same report.
