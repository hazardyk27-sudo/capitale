# ANALYST Methodology v1.2

Status: EXPERIMENTAL
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

For HOME or AWAY win preferences, analyze in this order:

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
   - identify the strongest reason the preferred side can fail;
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

BTTS must be decomposed into two goal legs before any overall verdict.

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

The overall BTTS support level may not exceed the weaker goal leg.

Examples:
- home goal = STRONG, away goal = WEAK -> BTTS cannot be STRONG;
- home goal = STRONG, away goal = BALANCED -> BTTS maximum BALANCED/SUPPORT depending evidence quality;
- both goal legs need independent, sustainable support before BTTS can receive STRONG_SUPPORT.

### BTTS anti-overfitting rules

- `Last 5 BTTS = 5/5` is not independent proof by itself.
- A recent BTTS streak must be decomposed into whether both teams repeatedly created/conceded real chances.
- Zero-goal frequency is a first-class risk variable.
- Clean-sheet strength is a first-class opposing variable.
- A team's overall scoring average must not replace its away/home-specific scoring floor.
- Extreme finishing overperformance is not treated as sustainable positive evidence.

## C. Combination preferences

For multi-leg preferences, each leg is analyzed with the relevant engine first. The combined support level cannot exceed the weakest material leg.

## Experimental qualitative labels

Use the existing user-facing labels:
- STRONG_SUPPORT
- SUPPORT
- BALANCED
- WEAK_SUPPORT
- NOT_SUPPORTED

These remain qualitative and uncalibrated. v1.2 does not introduce numeric probabilities or betting-value language.

## Shadow-run protocol

For each new user preference during validation:

1. Preserve the normal v1.1 assessment.
2. Run v1.2 as an experimental shadow assessment using only information available at the same AS_OF.
3. Store both outputs separately.
4. Do not change v1.1 after the result is known.
5. Settle the result only after independent result verification.
6. Compare v1.1 and v1.2 by selection type.

## Promotion criteria

v1.2 must not become CANONICAL merely because of a small winning sample.

Promotion requires evidence that it improves at least the following:
- false-STRONG rate;
- calibration ordering (STRONG should outperform SUPPORT; SUPPORT should outperform WEAK/BALANCED when sample permits);
- BTTS accuracy and especially weaker-leg error rate;
- side-selection accuracy or calibration without materially collapsing useful coverage;
- reproducibility under walk-forward testing.

Exact numeric promotion thresholds are intentionally uncalibrated until the backtest sample is large enough.
