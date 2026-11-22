# CAPITALE — Software-only expired fixture materialization retention (LIVE 2026-11-22)

## User scope
User explicitly requested that Software should **DELETE** aged fixtures (older than Istanbul yesterday), not merely hide them; they must not remain in **Software storage**, and no other area may be altered. Existing dated UI cutoff was already live in admin V26 and public widget V9. User gave no permission to bypass security/immutable reporting or delete SXF source history.

## Exact result and safety boundary
- Production **Software materialized public match JSON** `/app/betcapitale/dist/public/software/matches.json`: removed all 14 fixture records dated 2026-11-20; 93→**79** rows. Their raw/visual fields and IDs are no longer persisted in this active Software-facing JSON.
- Production private **Software sample ledger** `/var/lib/capitale-software-visual-ledger/ledger-v1.json`: removed exactly 14 expired sample keys; 93→**79**; retains file mode 0600 and directory mode 0700, atomic updates.
- Existing Software-only rollback match JSON copy `rollback-software-on-entry-materialized-20261122/matches.json` was similarly filtered 93→79. Two obsolete Software staging test data copies (`sandbox-output/matches.json` and `sandbox-ledger.json`) were deleted; no new backup containing old fixtures was created. All retained 79 Software fixture data and other paths untouched.
- **Important unremovable protected source:** The 14 expired Software **`capitale.research_runs` source records**, 14 related append-only SXF `capitale.agent_reports`, 18 evidence_items, 28 audit entries and 14 completed `capitale_private.agent_write_requests` still exist in the **protected Supabase research/audit store**. `capitale.agent_reports` has trigger `agent_reports_are_immutable BEFORE DELETE OR UPDATE`, and `capitale_private.agent_write_requests` FK `ON DELETE RESTRICT` to research_runs. Removing these underlying records would require overriding append-only audit protection and touching related agent evidence, violating the owner's explicit restriction on other areas. **No source DB deletes were performed**. After change, source query still reports 93 research_runs (no unexpected deletion); SXF base signal events and the reports remain. Do NOT claim complete physical removal of immutable source records.

## New automatic retention
- Existing active **one-minute** `capitale-public-software-feed.service`+timer was changed **only in its existing Software-specific ExecStart drop-in**, from publisher V2 to new `/opt/capitale-software-retention-only-v3-20261122/capitale-public-software-export-v3.py`. Original sync/SXF services, backend, migrations, site bundles, import maps, 629 logos, Match List V20 and other code untouched.
- The V3 Software-only worker reads the exact existing Software RPC read-only, derives each fixture's **Europe/Istanbul** date, computes `earliest_software_date=(now in TRT).date()-1 day`, filters expired fixtures out of active materialization *before* adding samples, and prunes their own `capitale-sample-v1|YYYY-MM-DD|home|away` ledger entries. Unknown sample key/schema aborts instead of accidentally deleting unrelated data. Atomically overwrites only active public `/software/matches.json` and private Software ledger. No date-independent retention cap and no deletion of source reports.
- On 22 November TRT, cutoff is **2026-11-21**, retains 46 Nov 21 + 28 Nov 22 + 5 Nov 23 = **79**. At Istanbul midnight on Nov 23, cutoff will roll to Nov 22; next one-minute export will remove Nov 21's 46 Software materializations, leaving 28+5=33, while retaining any new future runs that arrive. Physical DB source unaffected.

## QA / run evidence
- Python tests of 4 cutoff dates before/after midnight Istanbul and year change PASS.
- Isolated V3 run against a disposable copy of the *original* 93-item Software ledger verified `discarded_historical_rows=14`, `pruned_historical_samples=14`, retained 79+79, source untouched. Staging copies later deleted as explicitly requested.
- Production service output after install: `published_matches:79`, `source_runs:93`, `stored_fixture_samples:79`, `discarded_historical_rows:14`, `pruned_historical_samples:14`, `earliest_local_date:2026-11-21`. Re-run: `new_sampled_fixtures:0`, `pruned_historical_samples:0`; ledger SHA identical, 79 retained. One-minute Software timer confirmed **active+enabled**, no other schedules changed.
- Live public `/software/` browser final fetched one 79-row live JSON, renders `79 / 79 matches` and 20 cards on current page, no JavaScript page errors. Existing admin Software V26 date-filter display remains unchanged.
- Backend SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832` and `index.html` SHA `4ab088b0462dbecb6d27acdbc61d283c652eba4a5d2db3bfb3e92395ae2da249` unchanged. HTTP `/software/matches.json` 200; app's other routes and authenticated Software implementation not changed.
- This operation did NOT promise irrevocable deletion of protected source evidence. User should be told the Software-facing public list and private display cache were physically cleaned, but immutable audit/source still retains its original reports.

## Recovery
- Original V2 publisher remains at `/opt/capitale-software-on-entry-visual-v1-20261122/capitale-public-software-export-v2.py` (no deleted snapshot backup). Original service drop-in saved at `/opt/capitale-software-retention-only-v3-20261122/rollback-code-only/20-materialized-visual.conf`. To restore code, change only existing Software drop-in and `systemctl daemon-reload` after checking for concurrent deployments. **Do not restore old 93-item Software data** against owner's deletion request.

## GitHub artifacts
`deployments/betcapitale/software-retention-v3-20261122.py`
`deployments/betcapitale/software-retention-v2-to-v3-20261122.patch`
`deployments/betcapitale/software-retention-service-v3-20261122.patch`
`deployments/betcapitale/software-retention-only-live-20261122.md`
`tasarımcı-sohbet.md` updated.