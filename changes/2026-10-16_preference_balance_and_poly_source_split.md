# 2026-10-16 — Preference balance format + POLY source split

Status: CANONICAL CHANGE RECORD

## Preference-aware evidence format

When the user supplies a match together with a betting preference, evidence is presented as:

1. Tercihi destekleyen faktörler
2. Tercihi desteklemeyen faktörler
3. Nötr / belirsiz faktörler
4. Department balance

For NEWS, the final descriptive field is `NEWS dengesi` and remains a NEWS-only contextual balance, not a betting recommendation.

For POLY, the final descriptive field is `POLY dengesi`.

Missing information is NO EVIDENCE, not a neutral factor. Strong supporting and opposing evidence must both remain visible.

## POLY source rule — active

The previous active bettor-routing rule based on CAPITALE `poly.shortlist.v2` / the 24-wallet `POLY_FOOTBALL_TRACKED` pool is SUPERSEDED for active reports.

New active source split:

- **General match market:** direct/public Polymarket. Use it for price, implied probability, volume, liquidity, wallet participation and concentration.
- **Bettor/user evidence:** SmartXFlow **SXF POLY page only**. Use only users shown there for bettor-specific selections, amounts/exposures, timing and bettor-quality fields shown on the page.

A raw Polymarket wallet that is not present on SXF POLY may affect general market volume/concentration analysis but must not be promoted to bettor evidence.

The old 24-wallet pool remains historical/audit data only and must not be used as the active bettor universe.

SXF POLY bettor data is allowed inside POLY, but SXF-department flow conclusions such as Early Money, Concentration, Heavy, Surprise Team, Stable/Premium Over and BTTS engine signals remain prohibited inside POLY.

## Updated canonical files

- `AGENTS.md` -> v1.2
- `roles/news.md` -> v1.1
- `schemas/news_report.md` -> v1.1
- `roles/poly.md` -> v1.2
- `policies/poly_sources.md` -> v1.1
- `schemas/poly_report.md` -> v1.1
- `methods/poly_methodology.md` -> v1.1
