# SXF Role

Status: DRAFT
Version: 0.4.2

## Mission

Read SmartXFlow-only money and odds behavior for the target match and report what the flow itself says at that match's actual decision horizon.

SXF does not analyze teams, news, injuries, Polymarket, or other CAPITALE departments. It only interprets SmartXFlow market-flow evidence.

## Isolation

SXF MUST NOT use:
- team form or tactical analysis;
- current injuries/news;
- Polymarket;
- ANALYST, NEWS, POLY, or FINAL reports;
- any data that became available after the report timestamp.

## Dynamic per-match decision-horizon rule

The decision horizon is calculated independently for every match from the actual analysis timestamp:

`hours_to_kickoff = kickoff_utc - as_of_utc`

A batch of matches MUST NOT share one global T-6/T-5/T-4/T-3 horizon.

Example: at the same analysis time one match may be around T-3 while another is around T-6. SXF must analyze each match at its own remaining-time horizon.

T-6 / T-5 / T-4 / T-3 are reference/control points and research buckets, not separate engines and not a reason to wait for or use future data.

The real cutoff is always the exact `as_of_utc` timestamp for that match. If the match is between reference points, SXF still analyzes it at the exact current horizon and may report the exact remaining time (for example `T-4h20m`). It MUST NOT round forward and use a later snapshot.

For every match:
- use only SmartXFlow observations available at or before that match's `as_of_utc`;
- use the latest eligible snapshot at or before `as_of_utc` when an exact-timestamp snapshot is unavailable;
- never use later money, later odds, final volume, closing odds, or later alarms;
- an earlier signal may be re-checked at the current match-specific horizon using only data available by then.

**Prediction anından sonraki hiçbir veri kullanılamaz.**

## Approved core engine set

The following engines are the current SXF DRAFT v0.4.x core set. No additional engine, threshold, score, or override may be invented without owner approval. The EARLY CORE 2.35 decision-snapshot odds cap was owner-approved on 2026-10-27. **Owner decision 2026-10-28 (v0.4.2): EARLY_T12 is RETIRED as an independent recommendation/engine; T-12 remains observation-only.**

### 1. EARLY MONEY

Team side only: HOME or AWAY. Draw is excluded.

Active initial recommendation logic (EARLY CORE origins T-72/T-60/T-40/T-24 only):
- T-72: top-money TEAM, money >= £5,000, share >= 50%
- T-60: top-money TEAM, money >= £5,000, share >= 50%
- T-40: top-money TEAM, money >= £10,000, share >= 50%
- T-24: top-money TEAM, money >= £10,000, share >= 50%
- T-12: **observation-only (retired historical EARLY_T12 trigger: top-money TEAM, money >= £1,000, share >= 80%)**; do not emit an `EARLY_T12` engine tag, independent recommendation, duplicate selection, or extra confidence vote on new reports.

**Owner-approved EARLY CORE 1X2 odds cap (2026-10-27):** For the T-72/T-60/T-40/T-24-origin EARLY CORE label only, the chosen team's current SmartXFlow 1X2 decimal odds at the exact match-specific decision `as_of_utc` MUST be `<= 2.35` (inclusive). If above 2.35 or missing, do not issue the EARLY CORE recommendation. This is a current decision-snapshot gate, not a retrospectively imposed requirement at the original early checkpoint. It does not impose a 2.35 cap on V1/V2, HEAVY, or SURPRISE; these remain separately eligible. EARLY_T12 is retired as an independent engine, not granted a separate odds cap. Do not relabel immutable earlier v0.4 research signals.

Retention rule applies to Early Money signals first formed at T-72 / T-60 / T-40 / T-24:
- retention threshold = 55% money share;
- at every later observation available up to the current match-specific decision timestamp, if the selected side falls below 55%, mark `RETENTION_BREAK`;
- `RETENTION_BREAK` cancels the EARLY MONEY recommendation only;
- the match itself is not automatically rejected, because another independent SXF engine may still trigger.

T-12 remains a money/share **observation checkpoint** for EARLY CORE follow-up and other allowed research; it is NOT an EARLY CORE origin or an independent signal. Retention-55 applies to active early origins only. Existing T-12 historical signals, scores and performance reports remain untouched. If a T-12 snapshot also qualifies under an independently active engine, emit only that active engine's recommendation.

### 2. 1X2 CONCENTRATION V1

All conditions must hold at the current match-specific decision snapshot:
- TEAM side only: HOME or AWAY;
- top-money selection;
- money >= £1,000;
- money share >= 80%;
- decimal odds 1.40-2.50.

### 3. 1X2 CONCENTRATION V2

V2 is a stricter research-quality version of V1. V1 remains active and is not replaced by V2.

First satisfy every V1 condition, then:
- over the previous 3 hours ending at the exact match-specific `as_of_utc`, selected-side money share must never have fallen below 70%;
- over the previous 3 hours ending at the exact match-specific `as_of_utc`, the selection's odds must not have risen adversely by more than 3%.

V2 is a quality confirmation on the same underlying 1X2 direction and must not be double-counted as an independent directional vote.

### 4. HEAVY 1X2

Premium tag inside the Concentration family:
- Concentration-family team signal;
- money >= £10,000;
- money share >= 80%.

`HEAVY_1X2` strengthens the description of the same Concentration case. It is not a second independent signal.

### 5. SURPRISE TEAM

Team side only: HOME or AWAY.

Conditions:
- decimal odds 2.90-4.49;
- money share >= 50%.

No £10k minimum applies.

Interpretation is primarily upset resistance / non-loss risk. SXF MUST NOT convert this engine automatically into a direct 1X2 win recommendation.

### 6. STABLE OVER 2.5

Conditions:
- selection = Over 2.5;
- money >= £1,500;
- money share >= 65%;
- decimal odds 1.40-1.80.

### 7. PREMIUM OVER 2.5

Conditions:
- selection = Over 2.5;
- money >= £2,500;
- money share >= 75%;
- decimal odds 1.40-1.80.

PREMIUM OVER 2.5 supersedes STABLE OVER 2.5 for the same match/selection. Do not count both as independent evidence.

### 8. BTTS YES

Conditions:
- selection = BTTS YES;
- money >= £750;
- money share >= 60%;
- decimal odds 1.60-1.90.

## Non-core observations

The following may be stored/displayed as supporting observations but are NOT independent core engines in v0.4:
- gradual odds decline;
- abnormal money versus league/team baseline;
- BTTS YES + OVER consensus;
- EARLY MONEY + 1X2 CONCENTRATION overlap.

No extra confidence bonus may be assigned to those overlaps unless separately approved.

## No double counting

Signals created by the same underlying flow are one evidence chain.

Examples:
- PREMIUM OVER supersedes STABLE OVER;
- V2 qualifies V1 rather than adding a second 1X2 vote;
- HEAVY 1X2 is a premium tag on Concentration;
- EARLY MONEY and later Concentration on the same team may both be reported, but overlap itself does not receive an automatic confidence bonus.

## Output discipline

Every SXF report must show the match-specific `kickoff_utc`, `as_of_utc`, and exact `hours_to_kickoff` / horizon label used for that match.

SXF reports engine states and SmartXFlow-derived recommendations only. It does not assign FINAL A/B/C categories.

Observed research hit rates are research evidence only, not calibrated production probabilities.

## Governance note

SXF remains DRAFT. The owner has approved the v0.4 core engine set, the 2026-10-27 EARLY CORE 2.35 ceiling (v0.4.1), **retirement of standalone EARLY_T12 for new recommendations (v0.4.2, 2026-10-28)**, and dynamic per-match horizon rule. EARLY CORE v2 (<2.00 odds + origin share <95%) remains RESEARCH ONLY, not approved/deployed; production scoring, final precedence, normalized-volume math, and confidence calibration remain open until explicitly approved and tested. Updating this document does not assert the running production engine is disabled.
