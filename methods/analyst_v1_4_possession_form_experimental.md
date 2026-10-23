# ANALYST v1.4 — Opponent Possession Type and Three-Match Form

Status: EXPERIMENTAL
Version: 1.4
Owner-approved research focus: 2026-10-23
Scope: New ANALYST analyses, without modifying old v1.1/v1.2/v1.3 pre-match reports.
Related: `methods/analyst_v1_3_experimental.md` remains the selection-specific interpretation and risk layer; v1.1 canonical source/isolation remains active.

## Primary goal

Answer two measurable questions about BOTH teams:
1. "Against opponents who normally possess the ball frequently versus rarely, how does the team perform this season?"
2. "In the last three matches, and especially the last match, is the team improving or deteriorating both in results and underlying match statistics?"

These two components are the headline analysis, NOT optional side notes. Do not replace them with unrelated simulation, discretionary 0–100 ratings, generic team reputation or just a recent-results streak.

## Evidence and AS_OF

- Use only official matches and football-performance sources permitted to ANALYST, available as of the exact pre-match AS_OF.
- Default to same-season league matches; show cups/continental matches separately rather than silently combining incomparable competition levels. For last-match form, disclose if latest game came from a different competition.
- Every historical opponent's NORMAL possession rate must be based on matches available **BEFORE that specific historical fixture**; exclude the current Stuttgart-vs-opponent fixture itself, future games, and the match being predicted. Calculate prior completed league-game possession average from source data where feasible. If this historic snapshot cannot be recovered, clearly tag `POSSESSION_PROFILE_HISTORICAL_UNVERIFIED`: season-to-date/current season aggregates must not be falsely labelled historic pre-game data. Use explicitly retrospective descriptive analysis only, never claim leakage-free prospective backtest.
- A team's possession in the head-to-head game is a separate match observation and NOT a substitute for the opponent's habitual style.
- If possession rates are missing, mark UNKNOWN; do not guess and do not assign "neutral".
- Flag small samples, structural/coach era changes, red cards, unusual game-state, score-driven possession, opposing-team strength and venue. Strong opponents can also have high possession: do NOT claim that possession itself caused differences without quality controls.

## Possession-type grouping (transparent provisional bins)

Based on each opponent's habitual prior-fixture average possession:
- HIGH_POSSESSION: >=53%.
- BALANCED_POSSESSION: >47% and <53%.
- LOW_POSSESSION: <=47%.
- UNKNOWN: no defensible comparable prior-fixture possession.
- 47/53 are DESCRIPTIVE exploratory boundaries, not optimized thresholds. Show exact opponent possession percentages; if near boundaries, state sensitivity and compare also a continuous possession-versus-xGD relationship when sample permits.
- Optional opponent-strength stratification or matching using public allowed historical strength metrics (e.g., a well-grounded historic strength rating), but not betting odds or market estimates. Do not let strength confounding masquerade as style.
- Record each opponent identity, match date, location, possession reference window and numeric rate, score and performance stats, group, opponent strength where independently available.

For EACH analyzed team group, compute:
- N matches, W-D-L, points/match, goals for/against, goal difference/match.
- xG, xGA, xGD per match; shots for/against and shots-on-target for/against where available.
- Optional own observed possession IN those matches, clearly distinct from opponents' habitual pre-game possession.
- home/away split and opponent-strength context when sample sufficient.
- for N <=2 mark descriptive only; for empty or missing, NO_DATA. Never rank tiny group means as confirmed predictive effect.
- Group difference: `Delta_xGD = mean(xGD vs LOW) - mean(xGD vs HIGH)` when both groups have valid xG. This is association, not the causal effect of possession style. Opponent-strength- and venue-matched results are a separate check.

For the UPCOMING opponent, obtain its pre-match habitual possession from available matches; classify its group, with the limitation shown. Describe how the team performed against this type AND the reverse check for the other team's usual opponent type.

## Dynamic form: results AND stats, latest 3 / latest 1

Build a per-team chronological match ledger at least latest three comparable official matches; optionally latest six when available to separate 3-vs-prior-3:
- fixture/date/opponent/venue/result, goals for and against, W/D/L, points (3/1/0);
- xG/xGA/xGD, shots, shots on target, and actual possession where available;
- opponents' strength and unusual game-state flag to avoid falsely interpreting harder schedule as deterioration.
- Plot **real sourced match observations**, not fabricated/inferred points. Graph 1: chronological xGD (or xG and xGA as two series) for both teams, with transparent league/competition definitions. Graph 2: results such as points 0/1/3 and optionally goal difference; NEVER place points and xG on one misleading shared scale.
- Per team: last-3 means `xGD_3 = (xGD[-3]+xGD[-2]+xGD[-1])/3`, goals scored/conceded, total points and points/match; separately latest match exact xGD, score and key shot stats.
- Trend direction for three xGD observations (chronological): simple slope `(xGD_last - xGD_first)/2` per match step; also inspect the middle match, opponent strength, changes in xG versus xGA to avoid a false direction from outliers. With >=6 eligible matches, compare `mean(last 3 xGD)-mean(previous 3 xGD)` and likewise `points/match last3 - prior3`. These are *different* questions: trend within last 3 vs level change from previous 3.
- "Last-match impulse": `xGD_last - mean(xGD_prev_2)`, with N>=3; record whether latest game was a reversal, continuation or one-off. Use also goals and result separately. One match alone NEVER establishes acceleration.
- Optional finite second difference `xGD_last-2*xGD_middle+xGD_first` may be shown as a descriptive *acceleration proxy*, NEVER as a reliable trend from just 3 noisy games.
- Labels: `RESULTS_UP / RESULTS_DOWN / RESULTS_FLAT / MIXED` and separate `STATS_UP / STATS_DOWN / STATS_FLAT / MIXED`. Unless a validated noise band exists, label based on observed sign with cautious wording rather than invented significance threshold. Highlight divergence: wins with falling xGD = scoreboard improving / play deteriorating; losses with rising xGD = scoreboard worsening / play improving.
- Compare both teams symmetrically. No extrapolating linear slopes blindly into a next-match goal prediction.

## User-facing report — REQUIRED order for all new analyses

1. **Rakibin topa sahip olma profili** — exact habitual possession for both teams with AS_OF, data coverage.
2. **Rakip tipine göre geçmiş maçlar** — list opponents with possessions, scores, xG and xGA; separate HIGH/BALANCED/LOW; aggregate and explain venue/opponent strength confounding.
3. **Son 3 + son maç form grafikleri** — both sides, two distinct graphs for (A) results and (B) underlying stats. For each, state last 3 trend and last match versus the previous two; do not mix them.
4. **Eşleşme yorumu ve sıradaki maç** — explain what the possession-style evidence AND two teams' form trajectories imply; clear win/draw/loss or user selection support/oppose pathways with stronger evidence and credible failure path.
5. **Sayısal özet** — at minimum group WDL, xGD means, last-three xGD trend and most recent match change; any optional 0–100 ordinal support score explicitly uncalibrated and subject to existing v1.3 high-score gates. Do not invent simulation percentages or exact probabilities without a separately validated model.

When data insufficient, show the known portion and explicitly say "BU KARŞILAŞTIRMA ÖLÇÜLEMEDİ", listing missing match/stat columns. Do NOT quietly substitute a different prediction method.

## Worked small example — synthetic ONLY

Opponent possession HIGH 57% / LOW 43%, with equal-venue/equal-strength hypothetically comparable fixtures. Team sample: HIGH: 3 games, W0-D1-L2, mean xGD -0.50; LOW: 3 games W2-D1-L0, mean xGD +0.40. Difference LOW-HIGH = +0.90 xGD per match, but still too small to assert causality. If next opponent is 44%, say the historically observed LOW group is directionally more favorable, with sample warning.

Last-3 xGD chronologically -0.40, +0.10, +0.50 => slope (+0.50 - -0.40)/2=+0.45 xGD per game step; last game impulse +0.50 - (-0.15)=+0.65. Last-3 results L-W-L mean 1.0 points per match: improving underlying stats DOES NOT mean improving results. Mark STATS_UP / RESULTS_MIXED.

These numbers are illustrative only and MUST NOT be presented as any real team's metrics.

## Quality and validation

Prospective snapshots must include exact fixture cutoff, team/opponent historic pre-game possession windows and stats source URLs. Historical scores/results verified independently before settlement. Use walk-forward time splits, measure predictive usefulness of possession grouping against strength/venue-controlled baseline, and test whether recent-form changes add out-of-sample improvement. Keep all v1.3 risk gating; experiments do not become canonical without validation.
