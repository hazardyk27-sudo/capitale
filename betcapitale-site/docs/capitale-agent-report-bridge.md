# CAPITALE Agent Report Bridge

Release procedure: apply both dated migrations, configure the three server tokens, provision their hashes, then deploy the app. Deployment status must be verified separately.

## Purpose and allowed writers

This bridge accepts completed reports for exactly three independent departments:

- `analyst`
- `news`
- `sxf`

It gives no write permission to `poly` or `final`. Agents can only resolve fixture/run metadata; they cannot read reports. Full report and evidence reads are behind the site's database-backed Admin session.

## Security boundary

1. Each department gets a different high-entropy bearer token. Store tokens only in the corresponding agent's secure secret store and the Hetzner environment.
2. The browser never receives tokens. The Admin provisioning endpoint reads only server environment variables.
3. The request cannot choose its role. The database hashes the bearer token and resolves the role from its private token map.
4. The bridge writes by calling the database RPC. It does not insert or update report tables directly.
5. The RPC accepts only an existing `research_runs.id`; the database derives the associated `fixture_uid`. Unknown run IDs are rejected and audited.
6. Each accepted save appends a new report version. Repeating the same idempotency key and content returns the original report; reusing that key for different content is rejected.
7. RLS stays enabled with no browser policies. Browser reads/writes remain denied. Historical reports, evidence, and audit rows are append-only.
8. No source secrets, report content, or raw bearer tokens are written to logs. Denials store only a short reason and attempted run identifier.

## Server-only configuration

Configure these variables in the Hetzner service environment:

- `CAPITALE_SUPABASE_URL`
- `CAPITALE_SUPABASE_SERVICE_ROLE_KEY`
- `CAPITALE_AGENT_ANALYST_TOKEN`
- `CAPITALE_AGENT_NEWS_TOKEN`
- `CAPITALE_AGENT_SXF_TOKEN`

Use three unique random tokens of at least 32 characters. Never put them in source, GitHub Actions variables, client source code, or a report. The Supabase service-role key is server-only.

After the database migration is applied and the server is running with those variables, an authenticated Admin calls:

`POST /api/admin/capitale/agent-bridge/provision`

The endpoint reads tokens from the server environment, stores only SHA-256 hashes in the private database schema, and returns configured role names only. It accepts no token values from the browser.

## Agent write contract

An authorized agent calls:

`POST /api/capitale/agent-bridge/reports`

Headers:

```http
Authorization: Bearer <the secret for this agent only>
Content-Type: application/json
```

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

`role`, `agent_role`, `actor_role`, and `department` are forbidden in the request. The report must be complete, have a reproducibility hash and prompt version, and use the run's exact analysis cutoff when one is present. Evidence is capped at 100 items and the request at 512 KiB.

The caller must resolve the exact existing run before submitting. The bridge does not create a run from free-form team names. It rejects an unknown run instead of guessing a match.

## Admin reads

- `GET /api/admin/capitale/research-runs?limit=50` lists run identifiers and safe metadata (it omits free-form context). Admin session required.
- `GET /api/admin/capitale/agent-reports/:runId` returns the reports and evidence for one run. Admin session required.
- Reports include all allowed departments; no agent bearer token can use this endpoint.

## Rollout order

1. Review and merge the pull request.
2. Apply `supabase/migrations/20261120000000_capitale_agent_report_authorization.sql` to the intended Supabase project after a backup and schema review.
3. Add the server-only environment variables in Hetzner.
4. Deploy the app and call the Admin provisioning endpoint.
5. Connect each agent to the write endpoint using only that agent's token. Send `Siteye aktar` only after the report is complete and run ID is verified.

This change does not deploy or apply the migration by itself. The current Supabase inspection found the four target tables empty, RLS enabled, and no policies. The database already allowed `poly` in the report-role check; the migration narrows that constraint to ANALYST, NEWS, and SXF.


## Existing-report transfer and Admin integration
Agents only transfer existing reports, never research, invent missing values or change conclusions. Admin prepares the canonical fixture and original AS_OF at `/admin/software`. `POST /api/capitale/agent-bridge/resolve` accepts `{ "query": "team name", "day": "YYYY-MM-DD" }` with the department bearer token and returns fixture/run metadata only. If several matches or cutoffs remain possible, ask rather than guessing. No run means Admin must prepare it first.

The report's full original structured data remains in `payload`. An optional `payload.display` projection may copy **existing** values for the table. Do not generate absent fields:
- All roles: `market`, `selection` identify exactly the same selection (e.g. `1X2`, `1`).
- ANALYST and NEWS: `support_score` (0..100), only if explicitly present in their own report.
- SXF: `signal_code`, `volume_share_pct`, `draw_share_pct`, `current_odds`, `reference_odds`, `current_odds_at`, `reference_odds_at`, `source`.
A/N appear only when their market and selection match SXF. Wrong-owner values are ignored by the projection. Missing values remain dashes. Full reports remain readable separately and append-only.

The second migration `20261120010000_capitale_bridge_integration.sql` adds safe fixture resolution and Admin preparation/feed. Fixture metadata is captured when a run is prepared so retention does not erase the match name. Report response bodies are excluded from HTTP logs.

## Connection boundary
Publishing the API does not install a tool into an existing ChatGPT conversation. Configure a supported API client/custom action with the published OpenAPI schema and **only its department bearer credential** in its secret authentication setting. Never paste the server service-role key or agent tokens into report prompts. A live end-to-end transfer is complete only when the API returns an accepted report ID and the Admin page shows that same report.
