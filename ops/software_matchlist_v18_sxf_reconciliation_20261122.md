# CAPITALE Software — Match List V2 visual integration and SXF reconciliation (2026-11-22)

## Live releases
- Software: https://betcapitale.com/admin/software?v=18
- Frontend chunk: `/app/betcapitale/dist/public/assets/admin-software-v18-matchlist-v2-20261122.js`
- Previous live HTML rollback: `/app/betcapitale/dist/public/index.html.before-software-v18-matchlist-v2-20261122.bak`
- UI backup/source diff: `/srv/capitale-ops/software-matchlist-v18-20261122/`
- SXF reconciliation script: `/opt/capitale-software-sxf-reconcile.py`
- Existing source-verified importer: `/opt/capitale-sxf-software-sync.py` (extended only with `PREMIUM_OVER_MIN1_70` => PRM)
- Systemd units: `capitale-sxf-software-sync.timer`, `capitale-sxf-software-sync.service`, and failure alert service
- Operational backups: `/srv/capitale-ops/sxf-sync-reconcile-20261122/`
- Durable sync status and run history: `/var/lib/capitale-sxf-software-sync/latest.json` and `history.jsonl`

## Match List V2 design

The **actual current production** Match List V2 source was inspected from `/app/betcapitale/dist/public/assets/admin-social-media-v15-clean-header-20261122.js`, rather than recreating the design from memory. Its visual pattern was adapted to the original Software route, without importing social-media sample data:

- White elevated row cards, rounded borders, orange left accent and two club badges.
- Home/away club names once, numbered rows, signal-color badges.
- One consolidated A / V / N / B / O metric console with proportional indicator bars.
- Orange local kick-off time pill, time zone Europe/Istanbul.
- Responsive layout with mobile wrapping and no horizontal document overflow.
- Main signal code priority remains PRM > CRL > MOM > SLD.
- O displays signed **odds percentage change only**, never raw odds.
- Preserves team logo resolver for existing 170 teams; V16 English-only dark "Behind the signal" animation still expands below a clicked match.
- Retains filters, sort control, pagination, agent-role isolation and original saved report editors.
- Missing actual A/N specialist scores still use previously implemented deterministic **display-only example values** and must not be confused with real research results; backend reports are unchanged.

Preview and live Chrome tests (real fixture names in isolated API test response): 85 fixtures across five pages 20+20+20+20+5; 170/170 verified logos; all five metrics, time and main signal fields; click to open real inline analysis; no JS errors. At 390px mobile width, document scroll width was also 390px. Independent ANALYST-mode browser test confirmed the specialist editor remains, no new cards appear in that mode and other department private notes are not displayed. The live `/`, `/giris`, `/admin/software` pages returned HTTP 200 and rendered without browser JS error. Authenticated individual admin account was not separately tested.

## SXF→Software five-minute reconciliation

A root-owned, locked oneshot service is triggered by an **enabled active 5-minute systemd calendar timer** and compares verified `FINAL_SIGNAL` source events for upcoming fixtures within 18 hours with actual persisted SXF agent reports (identified by original event IDs, fixture UID, checkpoint and market/selection). Only missing or outdated eligible groups are submitted using the pre-existing secured SXF report RPC. Successful writes require mandatory report ID/version/hash readback. No automatic fabricated analyses and no post-kickoff backfill. Output includes total source events, currently eligible fixtures, already synchronized groups, missing groups, saves, failures, unmapped engines and precise skip reasons; JSON log is stored persistently.

- Source checkpoint validation: T-6 or T-8, corresponding original source checkpoint; only `FINAL_SIGNAL` and `selection_status=ELIGIBLE`.
- Same-match prioritization: PRM > CRL > MOM > SLD across market selections; non-winning eligible signals retained as auxiliary event IDs.
- `PREMIUM_OVER_MIN1_70` was found to emit the same premium Over 2.5 market `FINAL_SIGNAL` with the same source snapshots as `PREMIUM_OVER_2_5` on its known fixtures; classified under existing PRM family for traceability. No new SXF generator or selection rule was created.
- `EKOL_3` also emits `FINAL_SIGNAL` but has no owner-approved Software family. When another approved signal exists for the same fixture, EKOL_3 is saved as **audit-only auxiliary**, never given an independent badge or synthetic recommendation. Standalone unmapped engines cause attention/failure status; require explicit classification before creating a separate Software selection.
- On 22 November, PAOK–Kifisia PRM-6 and LDU–Aucas CRL-6 were updated (report versions 2) with their original missing event IDs, verified by the report RPC; next read-only audit found **15/15 currently eligible fixture groups fully synchronized**. SQL cross-check over the day's source table found **54/54 FINAL_SIGNAL event IDs traced** to Software reports, 0 untraced.
- After enabling the timer, the first systemd triggered run returned `status=ok`, zero missing/outdated and `Result=success`.
- Source `EARLY_SIGNAL` and T-8 `PRELIMINARY_SIGNAL` are intentionally excluded from actionable reports; historical 20–21 November's **15 missing fixtures** have **not been retroactively backfilled** due to source-time correctness, and must not be represented as live historical recommendations.

## Operations and rollback

```bash
systemctl status capitale-sxf-software-sync.timer
systemctl status capitale-sxf-software-sync.service
cat /var/lib/capitale-sxf-software-sync/latest.json
journalctl -u capitale-sxf-software-sync.service --since 'today'
```

Disable future service with `systemctl disable --now capitale-sxf-software-sync.timer`; recover UI by restoring its backed-up `index.html` after checking concurrent changes. The V18 changes are deployed as an immutable named compiled asset + importmap redirect, not yet ported to the canonical source/CI pipeline. Changes made to public HTML are limited to the three Software module mappings; social-media V15, landing, user login and the original report backend were not modified for UI work.
