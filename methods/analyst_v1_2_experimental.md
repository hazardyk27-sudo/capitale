# ANALYST Methodology v1.2

> **HISTORICAL / SUPERSEDED as of 2026-10-23.** The owner has deactivated this methodology for ALL NEW ANALYST runs. The ONLY active CANONICAL workflow and output is `methods/analyst_methodology.md` v2.0 + `schemas/analyst_report.md` v2.0. This file is retained solely for historical audit and reproduction of originally frozen decisions; do not apply its scoring rules, routing, simulation, optional modules or report template in new analyses.

Status: SUPERSEDED (historical EXPERIMENTAL only)
Version: 1.2

## Purpose

Test whether ANALYST performance improves when selection types are evaluated with market-specific football logic instead of one generic preference framework.

ANALYST v1.1 remains CANONICAL until v1.2 passes prospective/backtest validation. v1.2 must run in shadow/experimental mode and must not rewrite historical v1.1 decisions.

## Core principles

- Preserve ANALYST source isolation: no current news, odds, market flow, SmartXFlow, Polymarket, or other department reports.
- Use exact AS_OF discipline; no post-match information may enter a pre-match reconstruction.
- Same-season official matches are the default evidence base.
- Missing data is NO EVIDENCE.
- Factor counts are never votes.
- Opponent strength, sample size, structural comparability, home/away context, and underlying performance matter more than raw W/D/L streaks.
- Recent scoreline patterns are descriptive only unless supported by underlying performance.
- H2H is low-weight by default and becomes material only when the tactical/managerial structure is still comparable.

## Experimental engine split

### A. 1X2 / side-selection engine

For HOME, AWAY or double-chance side preferences, analyze in this order:

1. **Baseline team strength**
   - same-season xG, xGA, xGD, xPts when reliable;
   - wider 10/20-match evidence when current-era and structurally comparable.
2. **Opponent-adjusted form**
   - distinguish performance versus strong, comparable and weak opponents;
   - do not carry production against weak opposition unchanged into stronger matchups.
3. **Home/away structural split**
   - home xG/xGA/xGD for the home team;
   - away xG/xGA/xGD for the away team;
   - use only when the sample is not trivially small.
4. **Result-versus-underlying variance**
   - goals minus xG;
   - goals conceded minus xGA;
   - points versus xPts where available;
   - identify hot/cold finishing and goalkeeper variance.
5. **Matchup mechanisms**
   - press/build-up interaction;
   - transition exposure;
   - territorial/box control;
   - chance-quality mismatch;
   - set-piece or width/central-channel mismatch where supported.
6. **Stability and failure mode**
   - identify the strongest reason the supplied preference can fail;
   - downgrade support when one major contrary mechanism remains unresolved.

### 1X2 evidence hierarchy

Higher default weight:
- stable xGD/team-strength difference;
- opponent-adjusted performance;
- meaningful home/away split;
- repeated underlying superiority against comparable opponents.

Medium default weight:
- current underlying trend;
- tactical matchup evidence;
- chance-quality edge;
- sustainable set-piece/transition edge.

Low default weight unless corroborated:
- raw last-5 W/D/L;
- single scoreline blowouts;
- H2H;
- league position alone;
- recent finishing streaks without xG support.

## B. BTTS / KG VAR engine

BTTS must be decomposed into two goal legs before any overall score.

### Goal Leg H — home team to score

Assess:
- home-team home xG and chance quality;
- away-team away xGA and chance quality conceded;
- home-team zero-goal frequency;
- away-team clean-sheet frequency;
- home-team scoring versus comparable/strong opponents;
- away-team defensive performance versus comparable attacking teams;
- finishing variance and whether recent goals exceed underlying production;
- matchup mechanisms directly affecting home scoring.

### Goal Leg A — away team to score

Assess:
- away-team away xG and chance quality;
- home-team home xGA and chance quality conceded;
- away-team zero-goal frequency;
- home-team clean-sheet frequency;
- away-team scoring versus comparable/strong opponents;
- home-team defensive performance versus comparable attacking teams;
- finishing variance and whether recent goals exceed underlying production;
- matchup mechanisms directly affecting away scoring.

### BTTS limiting-leg rule

The overall BTTS support score may not exceed the weaker goal-leg score.

Examples:
- home-goal score 86, away-goal score 48 -> BTTS score cannot exceed 48;
- home-goal score 82, away-goal score 61 -> BTTS score cannot exceed 61;
- both goal legs need independently strong, sustainable support before BTTS can receive a high overall score.

### BTTS anti-overfitting rules

- `Last 5 BTTS = 5/5` is not independent proof by itself.
- A recent BTTS streak must be decomposed into whether both teams repeatedly created/conceded real chances.
- Zero-goal frequency is a first-class risk variable.
- Clean-sheet strength is a first-class opposing variable.
- A team's overall scoring average must not replace its away/home-specific scoring floor.
- Extreme finishing overperformance is not treated as sustainable positive evidence.

## C. Combination preferences

For multi-leg preferences, each leg is analyzed with the relevant engine first. The combined support score cannot exceed the weakest material leg's support score.

## User-facing support score — 0 to 100

For user-supplied preferences, v1.2 uses a **0-100 ANALYST SUPPORT SCORE** instead of the old supported/not-supported wording.

This score is:
- an ordinal summary of how strongly permitted football evidence supports the user's supplied preference;
- produced from weighted evidence quality, not from counting positive and negative bullets;
- **NOT a win probability**;
- **NOT an implied probability**;
- **NOT a betting-value score**;
- **NOT a stake recommendation**;
- **NOT a FINAL A/B/C category**.

Operational interpretation bands:
- **85-100** — very strong football support;
- **75-84** — strong support;
- **65-74** — positive support;
- **55-64** — slight positive support;
- **45-54** — balanced / close to neutral;
- **35-44** — weak support; opposing evidence is heavier;
- **0-34** — strong opposing football evidence.

These bands are presentation anchors, not empirically calibrated probabilities. They must be recalibrated later if backtesting shows poor ordering.

### Score construction discipline

Do not calculate the score by simple bullet arithmetic.

The score must reflect, in descending importance where relevant:
- source/data reliability;
- stable baseline strength;
- opponent-adjusted performance;
- meaningful home/away evidence;
- sample size;
- structural comparability/current era;
- exact relevance to the supplied preference;
- tactical matchup plausibility;
- finishing/goalkeeper variance;
- independence of evidence;
- strength of the main failure mode.

A single high-quality contrary signal may outweigh several weak supportive observations.

## Default user-facing presentation

When the user supplies a match + preference, present in this order:

1. **Tercihi destekleyen faktörler**
2. **Tercihi desteklemeyen faktörler**
3. **Nötr / çift yönlü faktörler** when genuinely present
4. **Maç yorumu / v1.2 dengesi** — explain how the match is likely to be played, which game states help the preference, which game states break it, and why the heavier evidence matters more. Do not reduce this section to raw metric comparison.
5. **ANALYST v1.2 PUANI: XX/100**
6. One short sentence explaining the primary reason for the score and the main failure mode.

For BTTS, show or explain the two goal legs separately when useful, because the weaker scoring leg caps the overall score.

## Shadow-run protocol

For each new user preference during validation:

1. Preserve the normal v1.1 assessment.
2. Run v1.2 as an experimental shadow assessment using only information available at the same AS_OF.
3. Store both outputs separately.
4. Do not change v1.1 after the result is known.
5. Settle the result only after independent result verification.
6. Compare v1.1 and v1.2 by selection type and by score band.

## Promotion criteria

v1.2 must not become CANONICAL merely because of a small winning sample.

Promotion requires evidence that it improves at least the following:
- false-high-score rate;
- calibration ordering (higher support-score bands should outperform lower bands when sample permits);
- BTTS accuracy and especially weaker-leg error rate;
- side-selection accuracy or calibration without materially collapsing useful coverage;
- reproducibility under walk-forward testing.

Exact numeric promotion thresholds are intentionally uncalibrated until the backtest sample is large enough.
