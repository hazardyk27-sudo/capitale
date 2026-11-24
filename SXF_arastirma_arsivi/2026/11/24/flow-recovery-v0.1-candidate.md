# FLOW RECOVERY v0.1 — 1X2 aday motoru
Status: EXPERIMENTAL / CANDIDATE (not active, not promoted)
Date: 2026-11-24
Owner request: name and retain the candidate; investigate T-10 and earlier recognition. No production change approved.

## Frozen candidate definition (T-6)
- At T-8 the same home/away selection passes production V1 (top team money, amount >= GBP 1,000, share >=80%); initial decimal odds 1.40–2.10 inclusive.
- At T-6 valid same-fixture/side snapshot: share <80%, odds <= T-8 odds, selected-side GBP amount strictly > T-8 amount.
- T-6 is the decision time. Never use future data. Falling relative share is not an absolute-money outflow. V2 and HEAVY are overlapping subgroup tags, not independent votes.
- No extra thresholds, no live signals, no auto-promotion. Keep T-8 history and active motor criteria unchanged.

## Retrospective evidence
9 Oct–24 Nov 2026, as available during research. Pratik Archive source commit f8407fce27ff1529a51c02e98e77273a06a01e78 (45 dated packages, 9 Oct–22 Nov; 12–17 Oct checkpoint data damaged/unusable); production kernel smartxflow a738ae83a591884b24718d3a58a00e5c0b3e47f9. Archive snapshots at/before cutoff within 59 min as in kernel; source SHA-256 checked against manifests. Recent 23–24 Nov raw Supabase 1X2 checkpoints read-only; exact fixture identity. Result sources archive FT, exact live or verified overlay; previously externally filled unverified results excluded, not treated as losses. Archive replay is not originally emitted live history. 
- V1: 29 candidates, 27 scored (23 wins, 4 losses, 85.19%, mean T6 odds 1.750); 2 unverified scores. Oct 11/13; Nov 12/14. V2 subgroup 20/24 (83.33%); HEAVY 10/12 (83.33%). Overlapping cohorts. T8 1.40–1.79 V1 13/13; 1.80–2.10 10/14. Small exploratory sample, no independent validation.
- T10→T8 net share fell in 14/29 candidates (13/14 wins); unchanged in 1/29 (1/1); rose in 14/29 (9/12 wins, 2 unknown). Not a necessary early signature.
- On full T8 V1 cohort with valid T6 coverage, early T10→T8 share down + odds nonrise + amount up occurs 116 times, 114 scored, 69 wins (60.53%); only 11 of these subsequently meet FLOW RECOVERY T6 definition, 10/11 win. This conditional 10/11 is NOT a usable T8 prediction rate. Recall 11/29, precision 11/116. Future T6 cannot be used at T8.
- Separate earlier analogue: qualify V1 at T10 within 1.40–2.10, T8 share<80, T8 odds<=T10 and amount>T10. Archive: 11 candidates, 8 scored, 4 wins (50%); 3 unverified. No reliable early shift.
- T7 exploratory candidate, checked without conditioning on future T6: T8 qualifies as above, T7 share<80, odds<=T8 and amount>T8. 9 candidates, 8 scored, 8 wins, 1 unknown; all 9 subsequently met T6 candidate in observed data. Oct 2/2 scored, Nov 6/6. T7 captures 9/29 T6 candidates, not validated; preserve as an early-warning research hypothesis, not new production rule.
- Examples 21 Nov Middlesbrough–Bristol City: T10 1.44/82.7%/GBP4575.49; T8 1.45/81.6%/4664.82; T7 1.43/79.3%/4782.67; T6 1.44/78.2%/5078.68; recorded FT 2–0. Napoli–Torino: T10 1.55/87.4%/18688; T8 1.56/80.6%/20828.30; T7 1.57/79.9%/21861.70; T6 1.56/79.4%/22184.10; FT 1–0. Ceuta–Almeria selected away: T10 2.06/78.9%/11652.88; T9 2.04/80.1%/13409.13; T8 2.08/80.9%/15896.42; T7 2.04/76.3%/17063.07; T6 2.04/76.3%/19475.68; FT 2–3.
 
## Next validation
Freeze candidate and test chronologically on new data, including all no-signal and same-price/league baselines; distinguish T6 versus T7 execution price and actual observed snapshot time. Compare share, price and absolute amount independently; verify source settlement, check coverage, uncertainty and ROI using only executable odds available at decision. Avoid choosing thresholds from winners. Do not silently modify or relabel existing signals.
