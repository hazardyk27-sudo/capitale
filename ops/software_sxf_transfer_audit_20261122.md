# CAPITALE Software — SXF Transfer Completeness Audit (2026-11-22)

## Verdict
**Not 100% complete.** Exact read-only reconciliation of original SmartXFlow `public.sxf_base_signal_events`, persisted `capitale.agent_reports` joined to `capitale.research_runs`, and the production `public.capitale_admin_software_feed()` RPC found missing historical fixtures and a new unsupported SXF engine.

| Fixture local date | Fixtures with FINAL_SIGNAL | Fixtures with SXF report in actual Software feed | Missing |
| --- | ---: | ---: | ---: |
| 2026-11-20 | 25 | 15 | 10 |
| 2026-11-21 | 53 | 48 | 5 |
| 2026-11-22 | 25 | 25 | 0 |
| **Total** | **103** | **88** | **15** |

All 15 missing fixtures have source `FINAL_SIGNAL` with `selection_status=ELIGIBLE`. 9 are standalone SURPRISE_TEAM watch signals on 20 November, the other 6 have active candidate engines. Missing examples: Manchester City–Fulham, Lazio–Lecce, Borussia Mönchengladbach–Dortmund, Aston Villa–Sunderland and Tottenham–Ipswich (21 November). Do not fabricate or retroactively write reports without source-time verification. The importer reads only upcoming fixtures and cannot directly recover past kickoffs.

## Event-level source trace
Source event matching was performed against both original `payload.engine_events[].event_id` and `payload.auxiliary_signals[].event_id`, for any SXF report on the same fixture.

| Fixture day | FINAL_SIGNAL events | Traced in stored Software reports | Untraced |
| --- | ---: | ---: | ---: |
| 2026-11-20 | 31 | 20 | 11 |
| 2026-11-21 | 101 | 83 | 18 |
| 2026-11-22 | 45 | 44 | 1 |
| **Total** | **177** | **147** | **30** |

For the current day, 25/25 match reports exist and all 25 display the highest recorded mapped priority family correctly: PRM > CRL > MOM > SLD. The single untraced 22 November event is `PREMIUM_OVER_MIN1_70` #19785 for PAOK–Kifisia. The match shows PRM-6 via other (PREMIUM_OVER_2_5 and STABLE_OVER_2_5) engine events, but #19785 is **not recorded in the report's engine_events or auxiliary_signals**.

## Unsupported new engine
`PREMIUM_OVER_MIN1_70` emits `FINAL_SIGNAL` but is absent from the importer's `ENGINE_GROUP` allowlist. Three source FINAL_SIGNAL instances were observed since 12 November:
- Sweden–Bosnia, 14 November: not transferred
- Cruzeiro MG–SE Palmeiras, 19 November: not transferred
- PAOK–Kifisia, 22 November: fixture exists in Software, but this new engine event is absent from the audit trace

A separate explicit owner decision is required on whether this engine should become PRM and whether it is independently actionable; do not silently treat it as `PREMIUM_OVER_2_5`.

## Other excluded signal types
Importer `/opt/capitale-sxf-software-sync.py` candidate query selects only `kind=FINAL_SIGNAL`, job checkpoint T-6 or T-8, and upcoming fixtures within default 18 hours. It ignores `EARLY_SIGNAL` from EARLY_MONEY_CORE / EARLY_MONEY_CORE_V2 and `PRELIMINARY_SIGNAL` at T-8. On 22 November there were 26 distinct T-8 preliminary fixtures, of which **7 had no T-6 final signal**. They are intentionally outside current final recommendation import scope.

The script is default dry-run, requires `--commit` to write, has limits of 1,000 fetched events and 80 grouped fixtures, and prevents transfers before checkpoint and after kickoff. Root crontab, named systemd timers and services did not show a job named for this script. Database history shows repeated writes at 12/42 minutes past the hour, so some external scheduler may exist; **its implementation and error monitoring are unverified**, not proven absent.

## Required action for full completeness
1. Define exact scope: FINAL_SIGNAL only vs watch/preliminary/early display. Keep experimental and SURPRISE watch-only states non-actionable.
2. Approve and add all valid FINAL_SIGNAL engine types to an explicit compatibility map, including the new `PREMIUM_OVER_MIN1_70` only once its semantics are confirmed.
3. Build a fixture/event-level reconciliation job with persistent sent/failed/skipped reasons, retries, stale event detection and an alert on mismatches; run it before kickoff.
4. Research historical 15 missing fixtures from original event and archived time-correct snapshots; avoid retroactive market predictions with hindsight.
5. Persist source event ids for all priority-losing signals, and verify the highest-priority visible code is computed from the full fixture event set rather than only the selected market.
6. Retain and migrate server hotfix into the maintained source/deploy pipeline.

**No database data or live code was modified during this audit.** Counts are a point-in-time snapshot of the production database. Validation used source event table, report tables and the Software feed RPC rather than mock browser rows.
