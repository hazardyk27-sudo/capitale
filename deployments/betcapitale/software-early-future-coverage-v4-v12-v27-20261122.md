# CAPITALE — Software future EARLY coverage (2026-11-22)

## User request / scope
Keep future SXF signals visible in Software, including 24 November. Do not change other areas. The approved FINAL_SIGNAL import (T-6/T-8), protected reports, SXF signal engine, Match List and backend stay unchanged.

## Finding
At the beginning of inspection the public Software feed had 79 rows, 0 dated 2026-11-24, and its source RPC had 93 runs. The 24-Nov SXF source already contained 5 eligible EARLY_SIGNAL observations for 3 fixtures at T-72 (Como–AEK Athens, RB Leipzig–Lens, Man City–Napoli), but the production 5-minute reconcile importer only handled FINAL_SIGNAL checkpoints T-6/T-8 and its search window was 18 hours. During investigation a separate source update populated the Software RPC and public feed; subsequent feed had 100 records, including 3 on Nov 24 and 4 on Nov 25. We did not perform that source update and cannot attribute it to this change.

## Software-only change
- The 1-minute Software-only publisher now runs `/opt/capitale-software-retention-only-v3-20261122/capitale-public-software-export-v4.py` and imports the pure read-only `early_software_preview.py`. It retains the Nov 21+ Software retention rule and all original `items`/visual fields.
- The publisher adds a new, separate `earlyPreviews` array to `/software/matches.json`, containing ONLY validated future `EARLY_SIGNAL` source metadata: date, teams, kickoff, market/selection, checkpoint and `PRELIMINARY_NOT_FINAL`. No fake specialist report, prediction, score, FINAL_SIGNAL, Supabase row or backfill is created. Previews are suppressed when the same fixture+market+selection has already appeared in Software; expired events disappear.
- Public Software: `/assets/capitale-software-widget-v12-early-preview-20261122.js`, `capitale-software-page-v12-early-preview-20261122.js` and `index-capitale-software-spa-v12-early-preview-20261122.js`. Read-only EARLY rows have an explicit `EARLY T-72 · NOT FINAL` label and are separate from standard match cards and their counts.
- Admin Software: `/assets/admin-software-v27-future-early-preview-20261122.js`. Equivalent separate EARLY preview is visible to the default admin and SXF view; hidden from ANALYST/NEWS/FINAL isolated views. Existing admin match/report/editing UI is unchanged.
- Production `index.html` changes only three admin Software import aliases and two public Software SPA entry references. No change to backend, main home entry, social cards, other routes, or data source.

## Verification
- Read-only direct SXF source query found 3 Nov 24 EARLY fixtures and 5 eligible T-72 events. With an empty Software run set the preview builder produced 8 legitimate distinct upcoming early previews. With the live Software run set (all already present), it produced 0 duplicates.
- V4 isolated exporter against a disposable copy of the active, protected Software-only ledger: all 100 pre-existing Software JSON `items` compared equal; no changed values, no duplicate rows. The staged temporary copy was deleted automatically.
- Production Software publisher V4 succeeded: 100 existing rows, 0 new early previews due to full source matching; 0 expired Software rows. Timer enabled + active; HTTPS `/software/matches.json` returns 200 and the `earlyPreviews` array is present.
- JavaScript syntax checks pass for all new Software assets. All four new immutable assets HTTPS 200. `/, /software/, /admin/software, /today, /admin/social-media` HTTP 200. Unauthenticated admin API HTTP 401. The previous production HTML reconstructed exactly from the new HTML by replacing only the five Software aliases.
- **Limit:** No authenticated browser UI end-to-end test was possible here because the authorized server has no browser runner. Runtime success is verified through source, static syntax, service logs and HTTP. Also, existing Software source records for the Nov 24 EARLY T-72 group have an inconsistent raw `signal_code=SLD-6` while `checkpoint_used=T-72`. This task does not rewrite protected source reports or claim that those source badges have been corrected; the separate preview explicitly labels only newly missing EARLY candidates.

## Rollback
- HTML backup: `/app/betcapitale/rollback-software-future-early-preview-20261122/index.html`; preserve any concurrent subsequent deploys before rollback.
- Existing service drop-in backup: `/opt/capitale-software-retention-only-v3-20261122/rollback-code-only/20-materialized-visual-before-v4.conf`.
- Previous exporter V3 and previous immutable JS assets remain on server. Restore original service drop-in, daemon-reload, and point ONLY Software imports back to V26/V11 if needed.
