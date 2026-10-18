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
