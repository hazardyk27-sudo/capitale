# ANALYST v1.4 — Three Pillars: Possession, Form Momentum, Opponent Logic

> **HISTORICAL / SUPERSEDED as of 2026-10-23.** The owner has deactivated this methodology for ALL NEW ANALYST runs. The ONLY active CANONICAL workflow and output is `methods/analyst_methodology.md` v2.0 + `schemas/analyst_report.md` v2.0. This file is retained solely for historical audit and reproduction of originally frozen decisions; do not apply its scoring rules, routing, simulation, optional modules or report template in new analyses.

Status: SUPERSEDED (historical EXPERIMENTAL only)
Version: 1.4.2
Owner-approved research focus: 2026-10-23
Scope: New ANALYST analyses, without modifying old v1.1/v1.2/v1.3 pre-match reports.
Related: `methods/analyst_v1_3_experimental.md` remains the selection-specific interpretation and risk layer; v1.1 canonical source/isolation remains active.

## Primary goal

Answer THREE owner-mandated questions about BOTH teams, in this exact order:
1. **POSSESSION GAME (TOPA SAHIP OLMA OYUNU):** Against opponents habitually controlling a lot, moderate or little possession, how did the team perform across ALL current-season league fixtures? If available contrast first and second halves separately. Use the owner-approved HIGH >=55%, BALANCED >45% and <55%, LOW <=45% classification with pre-fixture opponent tendencies.
2. **FORM MOMENTUM (FORM IVMESI):** Across current-season league fixtures, how did results AND actual play trend over last three league matches, especially latest one versus previous two? Report both score/points and xG/xGA/shots/sot; adjust interpretation for opponent difficulty, location and available 1H/2H evidence.
3. **OPPONENT LOGIC (RAKIP MANTIGI):** In plain football reasoning, how strong and difficult is the UPCOMING opponent relative to teams this side has already played; which opponent strengths and vulnerabilities actually matter against this side's own strengths and weaknesses? Could a good result versus an easy opponent be less impressive than a draw against a strong opponent? Would this side plausibly replicate its recent tactics and chance creation against the upcoming opponent? Explicitly examine BOTH teams' game plans and how each might succeed or fail. This is a DISTINCT interpretive section after statistical observations, not a third number or fabricated coefficient.

All three components are mandatory headline pillars. Do NOT collapse opponent logic into a mathematical score or let recent form mechanically overrule underlying team level. These components are the headline analysis, NOT optional side notes. Do not replace them with unrelated simulation, discretionary 0–100 ratings, generic team reputation or just a recent-results streak.

## Evidence and AS_OF

- Use only official matches and football-performance sources permitted to ANALYST, available as of the exact pre-match AS_OF.
- Default to same-season league matches; show cups/continental matches separately rather than silently combining incomparable competition levels. For last-match form, disclose if latest game came from a different competition.
- Every historical opponent's NORMAL possession rate must be based on matches available **BEFORE that specific historical fixture**; exclude the current Stuttgart-vs-opponent fixture itself, future games, and the match being predicted. Calculate prior completed league-game possession average from source data where feasible. If this historic snapshot cannot be recovered, clearly tag `POSSESSION_PROFILE_HISTORICAL_UNVERIFIED`: season-to-date/current season aggregates must not be falsely labelled historic pre-game data. Use explicitly retrospective descriptive analysis only, never claim leakage-free prospective backtest.
- A team's possession in the head-to-head game is a separate match observation and NOT a substitute for the opponent's habitual style.
- If possession rates are missing, mark UNKNOWN; do not guess and do not assign "neutral".
- Flag small samples, structural/coach era changes, red cards, unusual game-state, score-driven possession, opposing-team strength and venue. Strong opponents can also have high possession: do NOT claim that possession itself caused differences without quality controls.

## Possession-type grouping (transparent provisional bins)

Based on each opponent's habitual prior-fixture average possession:
- HIGH_POSSESSION: >=55%.
- BALANCED_POSSESSION: >45% and <55%.
- LOW_POSSESSION: <=45%.
- UNKNOWN: no defensible comparable prior-fixture possession.
- 45/55 are OWNER-SELECTED DESCRIPTIVE exploratory boundaries, not optimized thresholds. Show exact opponent possession percentages; if near boundaries, state sensitivity and compare also a continuous possession-versus-xGD relationship when sample permits.
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

## Mandatory analysis order and opponent-strength normalization (v1.4.1)

The owner specified the following order for **both teams, not one team only**:

A. **FULL CURRENT LEAGUE SEASON:** enumerate every league match through AS_OF; show opposition's *prior-game habitual possession group*, opponent strength at that historical cutoff (if available), home/away venue, score/result, xG/xGA, shots and shots on target where available. Aggregate HIGH/BALANCED/LOW/UNKNOWN. Only then form a season baseline. Never use only last-3 results as the season baseline. Cup/European fixtures are a separate labelled appendix and never silently merge into league sample.
B. **LATEST 3 LEAGUE MATCHES:** chronological results and statistics for exactly the latest three league fixtures; calculate both raw and opponent-strength-adjusted changes. If fewer than three, report insufficiency.
C. **LATEST 1 LEAGUE MATCH:** compare latest game with the two preceding league games using result metrics and xG/xGA/shots/sot; explain why any apparent surge/dip may be explained by a stronger/weaker opponent, home/away or match-state. Do not label a one-game jump as a confirmed accelerating trend.

**Opponent difficulty is essential, not optional.** Obtain a verifiable PRE-FIXTURE opponent-strength rating if possible (Opta Power Rankings if its as-of historic value actually exists and may be used; an independently derived historical football-only performance strength is also permitted). A *current* rating is not the historical match-day rating. Tag STRENGTH_RATING_HISTORICAL_UNVERIFIED if only current values are available. For cross-league fixtures, no ungrounded tier equivalence.

To measure form fairly, estimate a pre-match expected xG difference conditioned on opponent strength, own pre-match strength, venue and same-era evidence, from an actually trained/validated historical reference model **when one exists**. Then:
`opponent_adjusted_xGD = observed_xGD - prematch_expected_xGD`.
A positive residual means better performance than that reference model expected; negative means worse. **Do not fabricate** expected xGD values or use hindsight ratings. If no defensible model exists, leave adjusted_xGD null and compare difficulty qualitatively with explicit provenance. Example of the logic (hypothetical only): xGD +0.30 versus a weak opponent with expected +1.20 is -0.90 residual; xGD +0.10 against a strong opponent with expected -0.70 is +0.80 residual. Strength-normalized scores, stats and style comparisons must not be conflated with empirical win-probabilities or proof of causality.

**Possession style vs strength:** show both opponent strength and habitual possession together; verify whether apparent performance versus HIGH-possession opponents is merely because they are stronger. Compare teams of approximately similar strength and venue first when sample supports it; otherwise explicitly qualify. Do not infer "the strong opponent would now lose" solely because the strong club lost several games and the underdog won several; long-run strength and dynamically adjusted form are separate pieces of evidence.

### First-half / second-half extension where actual data exist

- For EACH historical fixture, if sourced: 1H and 2H scores, 1H/2H observed ball possession, xG/xGA, shots and shots on target, each half separately. The same applies to current league-season aggregates and last-three form trend.
- When source offers *habitual opponent possession specifically by half from matches prior to that fixture*, optionally classify opponent's 1H and 2H tendency independently using the same >=55 / <=45 bins. Do not substitute opponent's possession against this team for its usual 1H/2H style.
- Opponent overall habitual possession remains the primary match classification; half-specific classification is supplemental, NEVER inferred from full-time possession or half-time score.
- If half-level xG or possession missing, explicitly mark HALF_DATA_UNAVAILABLE; show actual verified half-time score if present, never invent 45-minute splits or assume an even division.
- Do not mix halves with different available source samples without disclosing denominators. A team's second-half possession falling after taking a lead may be driven by score state, not a natural tactical identity.

## Dynamic form: results AND stats, latest 3 / latest 1

Build a per-team chronological match ledger of the latest three **league** matches (last six league fixtures when available for a prior-three comparison). Label nonleague competitions separately rather than mixing them:
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

## Third pillar: opponent logic — qualitative football judgement

This section is mandatory for EVERY new ANALYST match request and must appear visibly as **3. Rakip mantığı** after the possession-game and form-momentum pillars.

For BOTH clubs, reason in explicit ordinary-language football terms:
- **How difficult is this match compared with their recent actual fixtures?** Identify which recent opponents were clearly stronger/weaker/comparable to the upcoming opponent based on real pre-match team-strength context; never give a Levante-level and Real-Madrid-level fixture the same credit merely for the scoreboard.
- **How would the football be played?** Contrast possession profiles, pressing, build-up, pace, transitions, shot production and defensive weaknesses ONLY when genuinely supported by match statistics. Explain the interaction rather than reciting independent team descriptors.
- **What evidence transfers?** Identify whether success against earlier opponents should transfer to this particular matchup, and why or why not. A team that attacks well against low blocks may still struggle to exit a top side's press; the reverse may also hold. Avoid declaring specific pressing/high-block characteristics without source support.
- **Base strength vs present form:** Treat structural/team quality and form acceleration separately. If Sociedad wins three matches vs weak teams and Madrid loses three vs elite teams, don't automatically predict Sociedad to beat Madrid. Conversely, if Madrid struggles even against weaker opponents and Sociedad has shown repeatable chances against high-level opponents, articulate why the gap may actually have narrowed. These are illustrative, not claims about real fixtures.
- **Football-specific paths and counterarguments:** Say the credible paths to home win, draw, away win, including when the user's preference fails. Give a conditional, well-reasoned likely match dynamic or say NO_CLEAR_LEAN when evidence is inconclusive.
- **Evidence versus interpretation:** Ground each key assertion in a match, source or observable pattern. Label unsupported tactical inferences UNKNOWN and do not invent current squad/news, odds, goal probabilities, arbitrary numeric weighting or untrained expected-performance coefficients.

The third pillar is QUALITATIVE: no formula, no required 0-100 score, no math-based result extrapolation. Descriptive statistics and sourced opponent strength may support the explanation, but **reasoning should be clear enough that a reader understands WHY a strong/weak opponent and particular matchup changes how past form is interpreted**. Do not double count the same match evidence as three independent proofs just because it appears in all three pillars.

## User-facing report — REQUIRED order for all new analyses

1. **TOPA SAHIP OLMA OYUNU** — both teams' ALL current-season league fixtures grouped by the historical habitual possession of their respective opponents (HIGH >=55%, BALANCED >45% and <55%, LOW <=45%). Show opponent strength, venue, real score/xG/shots, group summaries and verified 1H/2H observations if available.
2. **FORM IVMESI** — each team's latest three league games and latest one, with two distinct sourced chronological graphics: (A) scoreboard/points and (B) underlying xG/xGA/xGD/shots/sot. Explain whether apparent improvement is supported by real play and opponent difficulty.
3. **RAKIP MANTIGI** — separate, clearly labelled FOOTBALL-LOGIC section evaluating the upcoming opponent's actual level versus the teams already faced, whether earlier success/failure transfers, the interaction of play styles and the plausible win/draw/loss pathways. This is human-readable reasoning, not a mathematical adjustment or automatic form-based pick.
4. **MAC YORUMU / DENGE** — synthesize all three pillars, preserve evidence for and against the exact user preference and the main plausible failure mechanism; where evidence is insufficient, state it rather than forcing a direction. The existing v1.3 selection gates still apply for any optional experimental ordinal score.

When data insufficient, show the known portion and explicitly say "BU KARŞILAŞTIRMA ÖLÇÜLEMEDİ", listing missing match/stat columns. Do NOT quietly substitute a different prediction method.

## Worked small example — synthetic ONLY

Opponent possession HIGH 57% / LOW 43%, with equal-venue/equal-strength hypothetically comparable fixtures. Team sample: HIGH: 3 games, W0-D1-L2, mean xGD -0.50; LOW: 3 games W2-D1-L0, mean xGD +0.40. Difference LOW-HIGH = +0.90 xGD per match, but still too small to assert causality. If next opponent is 44%, say the historically observed LOW group is directionally more favorable, with sample warning.

Last-3 xGD chronologically -0.40, +0.10, +0.50 => slope (+0.50 - -0.40)/2=+0.45 xGD per game step; last game impulse +0.50 - (-0.15)=+0.65. Last-3 results L-W-L mean 1.0 points per match: improving underlying stats DOES NOT mean improving results. Mark STATS_UP / RESULTS_MIXED.

These numbers are illustrative only and MUST NOT be presented as any real team's metrics.

## Quality and validation

Prospective snapshots must include exact fixture cutoff, team/opponent historic pre-game possession windows and stats source URLs. Historical scores/results verified independently before settlement. Use walk-forward time splits, measure predictive usefulness of possession grouping against strength/venue-controlled baseline, and test whether recent-form changes add out-of-sample improvement. Keep all v1.3 risk gating; experiments do not become canonical without validation.
