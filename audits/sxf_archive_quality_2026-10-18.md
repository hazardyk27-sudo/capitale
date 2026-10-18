# SXF Archive Quality — 2026-10-18

Status: ENGINEER IMPLEMENTED / PARTIAL REPAIR, NON-DESTRUCTIVE

## Purpose

Audit SmartXFlow historical 9–18 October 2026 without modifying market snapshots, fixtures, settlement scores, or any prior SXF decisions. T-6 checkpoint: latest valid SmartXFlow snapshot within the 30 minutes ending exactly 6 hours before each fixture kickoff; compare time in Europe/Istanbul. Do not infer missing data from T-5/T-4/T-3.

## Implemented on Supabase project pswdvnmqjjnjodwzkmkp

1. `capitale.sxf_archive_canonical_fixtures_v1` — SECURITY INVOKER view. Returns one logical fixture for identical home, away, kickoff; prefers fixture with a matching settled/result row, then fixture with recorded 1X2 history, then latest created. Includes `physical_row_count` to expose duplicates. Does **not delete** existing fixtures.
2. `capitale.sxf_archive_daily_quality_v1(start_date, end_date)` — SECURITY INVOKER read-only function. Reports fixture count, duplicated rows, exact-FT results, unmatched/non-final results, T-6 market presence, absent markets, and both-sided completeness.
3. `capitale.sxf_archive_daily_quality_log_v1` — append-only in operational use, captures timestamped metrics/status. Historical rows are not automatically replaced.
4. `capitale.sxf_archive_quality_capture_v1(start_date, end_date)` — captures a bounded date range into audit log.
5. pg_cron job `capitale-sxf-archive-quality-daily-v1` (job_id 1) scheduled `30 5 * * *` GMT = 08:30 Turkey; captures the previous Turkey calendar day.

Applied migrations: `sxf_archive_canonical_fixture_and_daily_quality_v1`, `sxf_archive_daily_quality_immutable_log_v1`.

Sample queries:

```sql
SELECT * FROM capitale.sxf_archive_daily_quality_v1('2026-10-15','2026-10-15');
SELECT * FROM capitale.sxf_archive_canonical_fixtures_v1 WHERE kickoff_utc >= '2026-10-14 21:00+00' AND kickoff_utc < '2026-10-15 21:00+00';
SELECT audited_day, checked_at, severity, metrics
  FROM capitale.sxf_archive_daily_quality_log_v1 ORDER BY checked_at DESC LIMIT 20;
SELECT jobid, jobname, schedule, active FROM cron.job WHERE jobname='capitale-sxf-archive-quality-daily-v1';
```

## Measured archive gaps

* 9 October: 260 different fixtures, zero `live_fixtures` FT settlements, zero BTTS T-6 snapshots. 1X2 T-6 available for 245/260; OU for 258/260. BTTS history begins only at 2026-10-10 00:02:27 Europe/Istanbul.
* 13 October: 192 fixtures, only 27 T-6 snapshots in each moneyway market. **All three history tables** show last timestamp on 12 October 23:58:15 and first on 13 October 15:45:24 Europe/Istanbul. A shared ingestion/write pipeline outage or pause is strongly indicated; specific cause has not been confirmed from server logs. **Never synthesize missing T-6 data from later checkpoints**.
* 15 October: 160 fixture physical records vs 142 logical matches. The extra 18 copies are older, empty IDs; canonical view selects the populated record for all 18. Independent confirmation: 138/142 exact FT matches and 142/142 matches with market history in canonical view.
* Remaining unmatched scores 10–17 Oct total 66 (32 Oct 10, 5 Oct 11, 0 Oct 12, 14 Oct 13, 0 Oct 14, 4 Oct 15, 8 Oct 16, 3 Oct 17). Exclude from settled backtests.
* For 17 October, 425 OU and 422 BTTS T-6 snapshots, but one side's fields may be blank: treat partial market records as lower-quality evidence, not as 100% real concentration.

## Pending recovery tasks (NOT yet done)

* Backfill 9 October match results from authoritative, timestamped sources; match to fixture UID/hash, home/away and **Turkey-local fixture day**; stage source identifier/URL and independent confirmation before any settlement insert. Existing 260 scores are **not recovered**.
* Inspect scraper/collector host logs around 2026-10-12 23:58–2026-10-13 15:45 TSİ to determine specific outage cause; remote Desktop Commander device `smartxflow` was offline during the attempted inspection. Do not blame any individual worker without proof.
* Reconcile missing result rows for other dates with event IDs from `public.fixture_source_ids` (source: betwatch), verified outcomes, and immutable provenance.
* Validate the daily cron's first actual run in `cron.job_run_details`; schedule creation is confirmed, first execution still pending.
* Do not delete 15 October duplicate records until all downstream FKs/queries are audited; the view is the non-destructive resolution.

## Data-integrity rules

* Market snapshots cannot be retroactively invented or rewritten for historical AS_OF. No future-data leakage.
* Distinguish absent snapshot from incomplete opposing-side data and from missing FT scores.
* Backfill settlement in a separate verified ledger first; never overwrite raw live source blindly.
* Canonicalization does not mean scores were recovered. Approval is required before destructive changes.
* No SXF prediction thresholds were modified.

---

## 2026-10-18 — Remediation round 2 (ordered, non-destructive)

### 1. 9 October settlement recovery

- Created `capitale.sxf_result_recovery_staging_v1` with fixture UID, hash, exact kickoff, Istanbul-local date, team names, proposed FT score, external source URLs and explicit provenance status.
- Staged **20** fixtures from cross-referenced public 9 October score lists (ScoutingStats, BetExplorer, FootballDatabase); **20** independently corroborated by two or more independently published score lists, **0** remain provisional.
- `capitale.sxf_verified_settlement_overlay_v1` exposes the 20 verified scores **without altering `public.live_fixtures`**, excluding reused hashes and requiring exact fixture UID/kickoff/day. The other 240 9 October fixtures do NOT have verified recovered scores yet. Backtests must explicitly opt in to the overlay; raw settlement history remains unchanged.
- Sources: https://scoutingstats.ai/fixtures/2026-10-09 , https://www.betexplorer.com/?day=09&month=10&year=2026 , https://footballdatabase.com/scores/2026-10-09 . Verification scope is score and team match; historical kickoff quality requires continued review on difficult fixtures.
- Raw `live_fixtures` has **0** exact 9 October FT results, including those represented in the overlay. No bulk automatic score copying was performed.

### 2. Two-sided market quality

- `capitale.sxf_t6_market_evidence_quality_v1(day)` emits separate quality per fixture and market: OVER_2_5, UNDER_2_5, BTTS_YES, BTTS_NO.
- States: NO_SNAPSHOT, INCOMPLETE_ODDS, ONE_SIDED_MONEY, INCOMPLETE_SHARE, PERCENT_100_REVIEW, TWO_SIDED_PRESENT.
- 17 October: OU 425 snapshots but only 187 with both odds and money nonempty; BTTS 422 snapshots but only 123 with both sides. **238 OU** and **299 BTTS** snapshots have one or more missing opposing-side price and monetary values, not merely missing money.
- Quality labels do **not** alter existing engine thresholds; callers should explicitly qualify evidence before interpreting 100% share as reliable market consensus.

### 3. Hash/kickoff conflict and canonicalization

- `capitale.sxf_result_identity_audit_v1(start,end)` flags exact final settlement, no result, time mismatch, and hash re-use.
- Found 7 reused `match_id_hash` groups across different fixture kickoffs **inside 9–17 October**, involving 14 logical fixture records. A further global source-identity audit detects 15 hashes reused across all archived dates, affecting 22 fixtures within 9–17 October.
- No automatic mapping by hash alone. A matching hash paired with a wrong kickoff is **not** a verified final result.
- 15 October's 18 duplicate same-match-and-kickoff rows remain non-destructively resolved by the canonical fixture view.

### 4. Other missing results

- `capitale.sxf_missing_result_queue_v1(start,end)` inventories missing settlement and possible identity collisions with source_event_id and validation decision.
- 10–17 October queue: 55 with no result hash; 12 kickoff mismatches (8 blocked due to reused hash, 2 needing a source check for <=30 minutes discrepancy, 2 blocked due to larger mismatch).
- **Not yet restored**: these require external authoritative FT sources and independent ID/time verification.

### 5. T-6 checkpoint gap triage

- `capitale.sxf_t6_gap_triage_v1(start,end)` classifies true missing T-6 records without synthesizing evidence from T-5/T-4/T-3.
- 13 October: 165 missing checkpoints tagged as KNOWN_EXTERNAL_API_GAP_OCT13. Owner confirmed the upstream API was responsible.
- Other dates 10–17 October: 77 fixtures with no T-6 for any market:
  - 31 FIXTURE_DISCOVERED_AFTER_T6
  - 40 T6_ABSENT_WHILE_OTHER_HISTORY_EXISTS
  - 6 NO_1X2_PREGAME_HISTORY
- The last two are **diagnostic categories**, not proven technical causes. Missing true historical snapshots cannot be recreated.

### 6. Scraper and learning archive monitoring

- `capitale.sxf_ingestion_heartbeat_health_v1`: reports stale current/non-primary heartbeat, main scraper liveness, idle/current worker state.
- `capitale.sxf_learning_archive_watch_v1`: distinguishes unfinished queue from REVIEW_NO_NEW_EVENTS. No new learning archive events since 12 October observed, not yet proof of ingestion failure.
- `capitale.sxf_pipeline_health_log_v1` and `capitale.sxf_pipeline_health_capture_v1()`: tested with **7** event rows; replit and replit-live CURRENT, replit-preview WARNING_STALE_NONPRIMARY, signal/alarm workers CURRENT_IDLE; both learning queues REVIEW_NO_NEW_EVENTS.
- New active pg_cron job `capitale-sxf-pipeline-health-daily-v1` (id 2) schedule `35 5 * * *` GMT = 08:35 Turkey, in addition to existing archive audit at 08:30.
- Scheduling confirmed, but first **scheduled** run not yet observed. No push/pager notification is configured; statuses are recorded in Supabase only.

Applied additional migrations: `sxf_20261009_external_results_staging_v1`, `sxf_20261009_verified_external_settlement_overlay_v1`, `sxf_t6_two_sided_market_quality_v1`, `sxf_result_identity_hash_conflict_audit_v1`, `sxf_missing_result_source_verification_queue_v1`, `sxf_t6_missing_checkpoint_triage_v1`, `sxf_pipeline_health_and_archive_event_monitors_v1`.

### Remaining blockers and cautions

- Recover and independently verify the other **240** 9 October scores (all unstaged). Finish reconciling 10–17 October **67** missing/mismatched settlement records.
- Never fill missing T-6 snapshot by extrapolating later T-3 or closing odds.
- Partial-market data flags are available, but the established SXF engines and reports have **not yet been integrated** with this quality view. Maintain NO DATA = NO EVIDENCE for any analysis.
- A dedicated signed authoritative results feed would make bulk backfill feasible without guessing event identity. The Desktop Commander host remained offline on prior attempt.
- Confirm future health cron execution using `cron.job_run_details`; changing a schedule is not proof that execution already happened.

### Source-event identity follow-up

- Added `capitale.sxf_source_event_identity_v1` (migration `sxf_source_event_identity_collision_quality_v1`). Distinguishes a source's `source_event_id` from the locally derived `match_id_hash`, reports `canonical_source_key` and `identity_quality`.
- All seven pairs of same-hash/different-kickoff fixtures in 9–17 October have **different Betwatch source_event_id values**. This is a real hash reuse/collision problem, **not** evidence that these records are the same postponed match.
- Globally 15 hashes are reused across more than one source event; 22 fixture rows in the 9–17 October slice have the global collision flag.
- This has **not** altered `public.live_fixtures` uniqueness constraints or scraper UPSERT behavior. A change to event-level uniqueness must be coordinated with the collector and dependent code.
