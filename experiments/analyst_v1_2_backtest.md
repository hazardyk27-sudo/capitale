# ANALYST v1.2 Backtest Plan

Status: EXPERIMENTAL
Date started: 2026-10-17

## Goal

Determine whether the v1.2 split-engine design improves decision quality over ANALYST v1.1, especially for BTTS/KG VAR and false high-confidence selections.

## Frozen baseline

ANALYST v1.1 is the frozen canonical baseline.

Historical v1.1 decisions must never be rewritten after match outcomes are known. If the original decision text or AS_OF evidence cannot be reconstructed reliably, exclude the sample from strict backtest statistics and mark it as non-auditable.

## Test design

### 1. Separate by selection type

Evaluate at minimum:
- SIDE / 1X2
- BTTS / KG VAR
- COMBINATION

Do not aggregate them into one headline accuracy number without also showing market-type results.

### 2. Pre-match-only reconstruction

For every historical reconstruction:
- set an exact `as_of_utc`;
- use only data available at or before that timestamp;
- exclude current news and all other prohibited ANALYST sources;
- exclude the final score and post-match reports from feature construction.

### 3. Settlement verification

A result may enter the learning ledger only after verification by either:
- one official competition/club source plus one independent reputable results source; or
- two independent reputable results sources when no practical official source is available.

Conflicting results remain UNSETTLED until resolved.

### 4. v1.1 vs v1.2 shadow comparison

For every auditable sample store:
- original v1.1 verdict and confidence;
- v1.2 experimental verdict and confidence;
- whether v1.2 changed the verdict;
- the reason for the change;
- verified outcome.

## Primary metrics

Track separately for SIDE and BTTS:

1. **Hit rate by verdict**
   - STRONG_SUPPORT
   - SUPPORT
   - BALANCED
   - WEAK_SUPPORT
   - NOT_SUPPORTED
2. **False-STRONG rate**
   - percentage of STRONG_SUPPORT selections that lose.
3. **Calibration ordering**
   - higher support classes should outperform lower support classes as sample grows.
4. **Coverage**
   - number and share of selections that receive actionable support labels.
5. **BTTS weak-leg failure rate**
   - when BTTS loses, identify whether the home or away goal leg failed;
   - test whether v1.2 had identified that leg as the limiting leg.
6. **Side-selection upset profile**
   - identify whether losses cluster around away favorites, weak home/away splits, finishing overperformance, or strong contrary opponent-adjusted evidence.

## Ablation tests

Test whether each feature actually improves out-of-sample decisions by removing it and comparing performance:

- opponent-adjusted form;
- home/away split;
- zero-goal frequency;
- clean-sheet frequency;
- finishing/goalkeeping variance;
- H2H;
- raw last-5 result sequence;
- tactical matchup layer.

A feature that sounds plausible but does not improve walk-forward performance should not receive permanent high weight.

## Walk-forward validation

Do not optimize on the same matches used for evaluation.

Preferred process:
1. use an earlier chronological block to learn/tune qualitative rules;
2. freeze the rules;
3. test on the next chronological block;
4. roll forward and repeat.

Future matches must never influence earlier rule decisions.

## BTTS-specific hypotheses to test

H1: Splitting BTTS into home-goal and away-goal legs reduces false STRONG_SUPPORT calls.

H2: Away/home zero-goal frequency and opponent clean-sheet strength improve BTTS discrimination beyond raw recent BTTS percentage.

H3: Raw `last 5 BTTS` adds little or no value after underlying chance data and goal-leg variables are known.

## SIDE-specific hypotheses to test

H4: Opponent-adjusted xG/xGD plus meaningful home/away splits outperform raw recent W/D/L sequences.

H5: H2H adds little value unless the tactical/managerial era remains comparable.

H6: Explicit finishing/goalkeeping regression flags reduce overconfidence in teams with scorelines materially better than underlying performance.

## Promotion rule

ANALYST v1.2 remains EXPERIMENTAL until there is enough prospective/walk-forward evidence to show a repeatable improvement over v1.1.

Do not promote based on a handful of recent wins. Promotion must be documented in MILESTONE.md and must state which metrics improved, which did not, and the sample size by selection type.
