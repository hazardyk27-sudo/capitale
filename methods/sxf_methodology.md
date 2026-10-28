# SXF Methodology

Status: DRAFT
Version: 0.4.3

## Objective

Interpret SmartXFlow-only money and odds behavior without contamination from team analysis, current news, Polymarket, or other CAPITALE departments.

The DEFAULT daily operational decision is T-6 for each match/market when reached and valid, otherwise T-8 fallback when available; dynamic AS_OF remains an explicit-request alternate mode.

## Owner-approved SXF DAILY scan policy — T-6 primary / T-8 fallback (2026-10-28)

**Default for every new daily scan request:** `CHECKPOINT_DAILY_T6_FALLBACK_T8` (user approved 2026-10-28). Calculate the two checkpoints separately for EVERY fixture: `t6_utc = kickoff_utc - 6 hours`, `t8_utc = kickoff_utc - 8 hours`. The overall scan time is `run_at_utc`, **not** the per-fixture signal decision timestamp.

1. If the T-6 checkpoint has occurred by `run_at_utc` **and** has an eligible, verifiable same-fixture market snapshot at/before T-6, analyze and report T-6. **Do not also substitute T-8 simply because T-6 has no triggered signal.**
2. If T-6 has NOT yet occurred OR its market observation is unavailable/invalid, check T-8. When T-8 occurred and its own eligible source observation exists, analyze T-8 and label it `T-8 FALLBACK` with its reason (`T6_NOT_REACHED` / `T6_MARKET_MISSING` / `T6_INVALID`). A future T-6 snapshot is forbidden.
3. If neither point provides eligible data, report `CHECKPOINT_PENDING` or `NO_VALID_CHECKPOINT` for that fixture/market; fabricate no signal.
4. A previously triggered checkpoint signal **must still appear** in the daily scan even if the more recent market share/odds changed and no longer meet that engine. Show present-day market state only in a clearly **separate informational field**, never silently discard or rerate the checkpoint signal.
5. Apply all core engine price/money/share/retention/persistence conditions **as of the chosen checkpoint**, using only observations at/before that checkpoint. A market may be T-6 while another market in the same fixture requires T-8 fallback; preserve the market-specific source and timestamp. Exclude or warn on stale/incomplete data according to documented data-quality conditions, not an invented global 10-minute limit.
6. Each displayed selection carries `checkpoint_used`, `checkpoint_target_at_utc` (= `decision_as_of_utc`), `source_snapshot_at_utc`, `source_lag_minutes`, `fallback_reason`, `run_at_utc` and actual hours-to-kickoff **at decision**. The same fixture/market/selection is counted once, with engine overlaps as tags.
7. `DYNAMIC_AS_OF_V04` remains available **only if explicitly requested** and must be labelled separately; legacy dynamic reports and historical research archives are never retroactively reclassified or overwritten. `CHECKPOINT_RESEARCH_T6_FALLBACK_T8` remains a retrospective-research provenance mode and must not be confused with a newly frozen pre-match daily scan.
8. `EARLY_T12` remains retired. EARLY CORE v2, OVER_STRONG and EKOL 3 remain experimental/shadow unless explicitly promoted; if studied at T-8, their look-back checkpoints must be causally shifted and labelled `T8_ADAPTED`, not mislabeled as the canonical T-6 research definition. Do not use any future checkpoint for a motor.

**Example (Parma–Udinese, 2026-10-28 20:30 TSİ):** T-6 target 14:30 TSİ, source 14:27, BTTS YES at T-6 odds 1.84, £1,996.3, selected share 62.4% = triggered. At 16:00 TSİ share was 51.4%: this can be a separate current-state warning, NOT a reason to omit the T-6 signal.

## Optional alternate rule: dynamic per-match as-of analysis (explicit request only)

For explicitly requested `DYNAMIC_AS_OF_V04` only, each match independently computes:

`hours_to_kickoff = kickoff_utc - as_of_utc`

There is no single batch-level T-6/T-5/T-4/T-3 horizon.

If several matches are analyzed at the same clock time, one may be T-3, another T-4.5, another T-6. SXF must use each match's own kickoff and the same real analysis timestamp to derive its own horizon.

T-6 / T-5 / T-4 / T-3 are reference/control points and research buckets only. They are not separate filters and they do not authorize future data.

At every match-specific report timestamp:
- only observations available at or before `as_of_utc` may be used;
- if no snapshot exists exactly at `as_of_utc`, use the latest eligible snapshot at or before it;
- later money, later odds, final volume, closing odds, and later alarms are forbidden;
- an earlier signal may be re-checked at the exact current horizon using only data available by then;
- if the exact remaining time is between reference points, record the exact remaining time rather than pretending the match is at a later control point.

This optional dynamic rule applies only to explicitly selected dynamic runs and their matching backtests. For ordinary daily scans apply the T-6/T-8 owner-approved rule above.

## Core engine set (v0.4.2: EARLY_T12 recommendation retired)

### 1. EARLY MONEY

Purpose: detect serious team-side money before normal match-day market density develops.

Eligible selection: HOME or AWAY only.

Initial trigger conditions:

| Observation | Trigger |
| --- | --- |
| T-72 | top-money TEAM + money >= £5,000 + share >= 50% |
| T-60 | top-money TEAM + money >= £5,000 + share >= 50% |
| T-40 | top-money TEAM + money >= £10,000 + share >= 50% |
| T-24 | top-money TEAM + money >= £10,000 + share >= 50% |
| T-12 | **OBSERVATION ONLY / independent EARLY_T12 retired on 2026-10-28**. Historical trigger: top-money TEAM + money >= £1,000 + share >= 80%; do not produce a new EARLY_T12 recommendation |

#### EARLY CORE 1X2 decision-odds ceiling (owner-approved 2026-10-27)

For an EARLY CORE label whose first trigger is T-72/T-60/T-40/T-24, require the selected HOME/AWAY team's current SmartXFlow 1X2 decimal odds at the **exact match-specific decision `as_of_utc`** to be **`<= 2.35` inclusive**. An absent, stale or higher-than-2.35 quote is not a valid EARLY CORE recommendation. The early-origin money/share and Retention-55 rules still apply unchanged. This is **not** a retrospective rewriting of earlier v0.4 signals and does not require odds <=2.35 at the original early checkpoint.

EARLY_T12 was historically a separate label, but by explicit owner instruction on **2026-10-28 it is retired as an independent engine**. T-12 market readings may be collected as research/checkpoint observations; **no new EARLY_T12-only picks, engine tags, bet recommendations, or duplicate votes**. Other engine conditions (V1/V2/HEAVY/SURPRISE and all non-1X2 markets) are unchanged. Archived historical EARLY_T12, EARLY CORE and other results remain frozen. Research comparisons based on retroactively applied price caps must stay separately versioned.

#### Retention 55

Retention applies to Early Money signals first formed at T-72, T-60, T-40, or T-24.

From the origin onward, inspect later observations only up to the exact current match-specific `as_of_utc`.

If selected-side money share is `< 55%` at any eligible later observation:
- set `RETENTION_BREAK = true`;
- cancel the EARLY MONEY recommendation;
- do NOT automatically PASS the whole match;
- other engines remain independently eligible.

T-12 remains a **non-triggering observation/checkpoint**: it neither initiates EARLY CORE nor receives its own Retention-55 origin, and it must never independently generate new EARLY_T12 selections. T-12 observations still inform active EARLY CORE retention tracking (only if after the original early origin and available by `as_of_utc`). A selection that qualifies under V1/V2/HEAVY may still be reported through those independent active rules. Historical EARLY_T12 signals and performance reports are retained unchanged.

The 55% threshold is an approved operational candidate for prospective testing, not a calibrated optimum.

### 2. 1X2 CONCENTRATION V1

Purpose: identify abnormal current concentration of SmartXFlow money on one team.

All conditions must hold at the current match-specific decision snapshot:
- selection = HOME or AWAY;
- selection is top-money in 1X2;
- money >= £1,000;
- money share >= 80%;
- decimal odds 1.40-2.50.

V1 is a core production-candidate engine inside the DRAFT methodology.

### 3. 1X2 CONCENTRATION V2

Purpose: stricter quality filter on top of V1.

First satisfy every V1 condition.

Then require over the prior 3-hour window ending exactly at the current match-specific `as_of_utc`:
- selected-side share never below 70%;
- adverse odds rise not greater than 3%.

V2 does not replace V1. It qualifies the same underlying directional case and must not be counted as a second independent signal.

### 4. HEAVY 1X2

Purpose: premium-strength tag inside the Concentration family.

Conditions:
- Concentration-family team case;
- money >= £10,000;
- money share >= 80%.

HEAVY 1X2 is a premium tag, not an independent vote.

### 5. SURPRISE TEAM

Purpose: detect unusual money on a non-favorite team.

Conditions:
- selection = HOME or AWAY;
- decimal odds 2.90-4.49;
- money share >= 50%.

There is no fixed £10k minimum.

Interpretation:
- upset risk;
- resistance to the favorite;
- non-loss support.

Do not automatically translate SURPRISE TEAM into a direct team-win recommendation.

### 6. STABLE OVER 2.5

Conditions:
- market = O/U 2.5;
- selection = OVER;
- money >= £1,500;
- money share >= 65%;
- decimal odds 1.40-1.80.

### 7. PREMIUM OVER 2.5

Conditions:
- market = O/U 2.5;
- selection = OVER;
- money >= £2,500;
- money share >= 75%;
- decimal odds 1.40-1.80.

If both STABLE and PREMIUM trigger on the same match/selection:
- report PREMIUM as the stronger state;
- mark STABLE as superseded;
- do not count them independently.

### 8. BTTS YES

Conditions:
- market = BTTS;
- selection = YES;
- money >= £750;
- money share >= 60%;
- decimal odds 1.60-1.90.

BTTS YES remains independent from Over 2.5. Simultaneous BTTS and Over triggers do not receive an automatic confidence bonus.

## Supporting observations, not core engines

The following may be recorded but must not independently trigger a core recommendation in v0.4:
- gradual odds decline;
- abnormal money versus league/team baseline;
- BTTS YES + OVER overlap;
- EARLY MONEY + 1X2 CONCENTRATION overlap.

The first two remain useful research directions. The latter two are confluence tags only until larger samples justify a bonus.

## Engine relationship rules

1. `PREMIUM_OVER_2_5` supersedes `STABLE_OVER_2_5` on the same selection.
2. `CONCENTRATION_V2` qualifies `CONCENTRATION_V1`; it is not a second vote.
3. `HEAVY_1X2` is a premium tag on the same Concentration family case.
4. `EARLY_MONEY` may coexist with later Concentration, but overlap alone adds no automatic confidence bonus.
5. `RETENTION_BREAK` cancels only the Early Money engine instance.
6. `SURPRISE_TEAM` is interpreted as upset/non-loss risk, not an automatic 1X2 win call.
7. BTTS and Over are separate engines; overlap itself adds no bonus.

## Research evidence currently supporting the rules

Observed 9-12 October research included:
- unique first-strong Early Money group around 18/22 = 81.8%;
- Concentration V1 around 73-80% across T-6 to T-3 controls;
- Concentration V2 historically stronger than V1 in the small sample;
- Heavy 1X2 approximately 77-89% depending control point, with small N;
- Surprise Team non-loss materially stronger than direct win rate;
- Stable Over approximately 70-78%;
- Premium Over strongest around T-5/T-4 in a small sample;
- BTTS YES approximately 76-83% in the studied control points.

These figures are descriptive research priors only. They MUST NOT be emitted as calibrated probabilities.

## Required backtest fields

For every engine opportunity, store at minimum:
- match/event identifier;
- engine name/version;
- exact `as_of_utc`;
- `kickoff_utc`;
- exact `hours_to_kickoff`;
- optional reference horizon bucket for research grouping;
- selection;
- money amount;
- money share;
- odds;
- top-money status where relevant;
- prior-3h share minimum for V2;
- prior-3h adverse odds movement for V2;
- Early Money origin time;
- retention status and first break timestamp;
- result;
- decimal odds at decision snapshot;
- ROI where settlement is reliable;
- source snapshot identifiers sufficient for reproducibility.

## Still open

The following are not approved and must not be invented:
- numeric engine scoring;
- production confidence mapping;
- league/team normalized-money formula;
- league-specific thresholds;
- cross-engine precedence beyond the explicit relationships above;
- sharp/public classification thresholds;
- generic reversal veto outside the explicit Early Money retention rule;
- final recommendation ranking logic beyond reporting triggered core engines.


## Owner retirement decision — EARLY_T12 (2026-10-28)

The owner explicitly decided to **remove standalone EARLY_T12 from future SXF recommendations**, leaving existing EARLY CORE T-72/T-60/T-40/T-24, Retention-55, V1, V2, HEAVY and other active engines unchanged. **Do not delete/overwrite historical archives or original outcome labels.** T-12 remains available as an observation point, not as an engine. Any implementation/deployment/scheduler/Telegram configuration must be independently checked before claiming runtime deactivation. The proposed EARLY CORE v2 research odds<2.00 and origin share<95% limits have NOT been formally promoted to the active core rules by this retirement decision.
