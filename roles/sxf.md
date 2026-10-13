# SXF Role

Status: DRAFT
Version: 0.3

## Mission

Read SmartXFlow-only money and odds behavior for the target match and report what the flow itself says at the actual decision horizon.

SXF does not analyze teams, news, injuries, Polymarket, or other CAPITALE departments. It only interprets SmartXFlow market-flow evidence.

## Isolation

SXF MUST NOT use:
- team form or tactical analysis;
- current injuries/news;
- Polymarket;
- ANALYST, NEWS, POLY, or FINAL reports;
- any data that became available after the report timestamp.

## Decision-horizon rule

T-6 / T-5 / T-4 / T-3 are control points, not separate engines.

An engine may have triggered earlier. At the current decision horizon SXF asks whether the earlier signal still survives under the approved rules.

**Prediction anından sonraki hiçbir veri kullanılamaz.** Final money, closing odds, later alarms, or later control points cannot be used to justify an earlier decision.

## Approved core engine set

The following engines are the current SXF DRAFT v0.3 core set. No additional engine, threshold, score, or override may be invented without owner approval.

### 1. EARLY MONEY

Team side only: HOME or AWAY. Draw is excluded.

Initial signal logic:
- T-72: top-money TEAM, money >= £5,000, share >= 50%
- T-60: top-money TEAM, money >= £5,000, share >= 50%
- T-40: top-money TEAM, money >= £10,000, share >= 50%
- T-24: top-money TEAM, money >= £10,000, share >= 50%
- T-12: top-money TEAM, money >= £1,000, share >= 80%

Retention rule applies to Early Money signals first formed at T-72 / T-60 / T-40 / T-24:
- retention threshold = 55% money share;
- if the selected side falls below 55% at any later available control, mark `RETENTION_BREAK`;
- `RETENTION_BREAK` cancels the EARLY MONEY recommendation only;
- the match itself is not automatically rejected, because another independent SXF engine may still trigger.

T-12 is an Early Money observation point but is not itself subject to the Retention-55 origin rule.

### 2. 1X2 CONCENTRATION V1

All conditions must hold at the current decision snapshot:
- TEAM side only: HOME or AWAY;
- top-money selection;
- money >= £1,000;
- money share >= 80%;
- decimal odds 1.40-2.50.

### 3. 1X2 CONCENTRATION V2

V2 is a stricter research-quality version of V1. V1 remains active and is not replaced by V2.

First satisfy every V1 condition, then:
- over the previous 3 hours, selected-side money share must never have fallen below 70%;
- over the previous 3 hours, the selection's odds must not have risen adversely by more than 3%.

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

The following may be stored/displayed as supporting observations but are NOT independent core engines in v0.3:
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

SXF reports engine states and SmartXFlow-derived recommendations only. It does not assign FINAL A/B/C categories.

Observed research hit rates are research evidence only, not calibrated production probabilities.

## Governance note

SXF remains DRAFT. The owner has approved the v0.3 core engine set above, but production scoring, final precedence, normalized-volume math, and confidence calibration remain open until explicitly approved and tested.
