# CAPITALE Software — SXF Signal Code Mapping and Fixture-Level Precedence

**Owner approval:** 2026-11-21 (Europe/Istanbul). **Status:** implemented in the production SXF import mapping and in the Software feed's derived display projection.

## Display mapping

| Source SXF engine tag | Software family |
| --- | --- |
| `STABLE_OVER_2_5` | **MOM** |
| `1X2_CONCENTRATION_V1` | **MOM** |
| `1X2_CONCENTRATION_V2` | **CRL** |
| `BTTS_YES` | **CRL** |
| `HEAVY_1X2_CONCENTRATION` (or `HEAVY_1X2`) | **PRM** |
| `PREMIUM_OVER_2_5` | **PRM** |
| `EARLY_MONEY_CORE` | **SLD** |
| `EARLY_MONEY_CORE_V2` | **SLD** |
| `SURPRISE_TEAM` | **SLD** |

## One badge per match

`PRM > CRL > MOM > SLD`. Compare all verified eligible SXF engine events for the **same fixture** regardless of market/selection and across T-6 and T-8. Show only the strongest family code on the main Software match row. For equal family level, prefer verified T-6 over T-8, then deterministic source event order. The suffix (`-6`/`-8`) belongs to the **selected** highest-priority event. Examples:

- Over 2.5 STABLE (MOM) plus Over 2.5 PREMIUM (PRM) → **PRM**
- Concentration V1 (MOM) plus V2 (CRL) → **CRL**
- V2 (CRL) plus HEAVY 1X2 (PRM) → **PRM**
- Over 2.5 MOM plus BTTS YES CRL (different selections on same fixture) → **CRL**
- PRM T-8 plus MOM T-6 → **PRM-8** (stronger code wins; do not mislabel the horizon)

Do not delete source events for losing priorities; keep the original signal evidence and audit trail.

## Scope and boundaries

- Mapping a motor to a display family does **not** authorize it to emit a new signal. Early Money Core and V2 currently appear as `EARLY_SIGNAL` source events; importer only accepts `FINAL_SIGNAL`. V2 remains experimental/shadow unless separately promoted by the owner.
- A standalone `SURPRISE_TEAM` record remains **WATCH_ONLY_SURPRISE** — the new SLD badge does not turn it into an actionable 1X2 win selection.
- Verified T-6 / T-8 source timestamps are preserved. Source report payloads are immutable; only the Software feed's projected `display.signal_code` is recalculated for older reports.
- LIVE front-end builds may cache old JavaScript filenames; source feed projection rather than a cosmetic label-only override ensures older reports show the approved family after API refresh.

## Implementation and verification (2026-11-21)

- Server importer: `/opt/capitale-sxf-software-sync.py`, with immutable backup `/opt/capitale-sxf-software-sync.py.bak-before-priority-20261121`.
- Production Supabase RPC: `public.capitale_admin_software_feed()`, retaining its original response shape and access grants. For role `sxf` only, its `display.signal_code` is derived from all `display.engine_tags`, with the original checkpoint suffix. Stored reports are not overwritten.
- Importer unit test: 7/7 cases passed, including different-market overlap, different-checkpoint overlap, surprise watch-only and exclusion of `EARLY_SIGNAL` experimental data.
- Non-mutating importer dry-run and SQL feed query passed.
- At the time of the check, the existing SXF feed had 23 CRL-6, 12 PRM-6, 5 MOM-6, 22 SLD-6 codes. These counts are a snapshot, not a persistent statistic.
- Chrome smoke test: `/`, `/giris`, `/admin/software` returned HTTP 200 and rendered without JavaScript exceptions. A controlled four-family badge UI test passed.

**Caveat:** The currently visible Software row is a verified report run, not independent validation of an unpromoted motor. Browser render tests used an isolated mock admin API; production feed codes were verified directly through Supabase read-only checks. Permanent migration tracking and source-control integration of the running server script remain technical debt.
