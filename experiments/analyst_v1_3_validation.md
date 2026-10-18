# ANALYST v1.3 — Pre-registered validation and audit

Status: EXPERIMENTAL
Started: 2026-10-19
Previous: experiments/analyst_v1_2_backtest.md (retained).

## Claim to test

v1.3 game-state reasoning and high-score review gates reduce false 75+ SIDE scores, especially draw losses, without causing unacceptable coverage collapse. This is a hypothesis, not a result.

## First: settlement quality audit

- Locate each original user supplied preference, fixed support score and AS_OF. Do not infer missing original scores from later descriptions.
- Confirm exact date, league/cup, home/away identity and match status.
- Require official result + independent reputable result OR two genuinely independent reputable sources.
- Cup settlement must specify regular time / extra time / penalties and applicable user-selection rules; do not mark a normal-time win from an extra-time win.
- Mark VERIFIED_WIN, VERIFIED_LOSS, VOID, DISPUTED or UNSETTLED and retain verification URLs and timestamp.
- Earlier conversation claims about 18 Oct 2026 outcomes (SIDE 12/21, 75+ SIDE 2/7, GOALS 8/10, all picks 20/31) have status **UNVERIFIED_CONVERSATION_SUMMARY** pending re-audit. Never tune rules to these unconfirmed labels.

## Immutable chronological experiment

- Freeze original v1.1, v1.2 snapshots. Record method version and snapshot hash for each.
- Run v1.3 on the same strictly pre-match information available at exact AS_OF, preserving input/provenance.
- Train or choose calibration mappings using *only earlier fixtures*; freeze before later test windows. Group all selections from one fixture together in splits and uncertainty estimation.
- Do not use final score, postgame xG, later team form, NEWS, SXF or odds for a historical pre-match feature.

## Validation metrics

For each of SIDE_WIN, DOUBLE_CHANCE, OVER_2_5, BTTS, CUP and CROSS_LEAGUE and by home/away:
- N fixtures and N selections, verification rate, market coverage, score availability.
- hit rate per pre-registered score band with uncertainty intervals; avoid tiny subgroup claims.
- false-high-score share among scored >=75, draw-vs-loss failure breakdown; compare v1.2 vs v1.3.
- rank correlation/ordinal discrimination (e.g. score bins ordering); leave probabilities uncalibrated until enough out-of-sample records.
- Brier/log loss ONLY if a separate probability model is actually fitted and prospectively validated, never by substituting 0-100 ordinal support scores as probabilities.
- inter-analyst reproducibility of band, explanation and high-score gates.
- ablation for draw-resistance, away sample, goal production floor, opponent strength, cup comparability and explicit failure-mode gate.
- selection concentration; one game with multiple bets is not multiple independent match outcomes.

## Worked hypothetical audit cases (not historical facts)

A. A favorite has +1.0 xGD but poor away goals, compact home opponent, repeated 0-0/1-1 scenarios. A SINGLE_WIN high score fails until reliable evidence counters draw risk. Same facts can support X2 more than away WIN because draw is counted as success.
B. 3.2 estimated total xG driven by one hot-finishing team; other side often 0 goals, opponent controls tempo. OVER_2_5 must consider 2-0/0-2 paths; model total alone does not grant 75+.
C. League-tier cup favorite has a large raw goal difference but no league-strength bridge or venue-comparable evidence. Flag UNNORMALIZED_CROSS_LEAGUE. Do not assign 76 from league rank alone.

## Promotion

v1.3 stays EXPERIMENTAL until enough independently VERIFIED, chronological out-of-sample comparisons show repeatable improvement in false-high-score rate, score-ordering and useful coverage. Record negative or ambiguous findings; retain rather than silently edit old versions.
