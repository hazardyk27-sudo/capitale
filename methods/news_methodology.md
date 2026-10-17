# NEWS Methodology

Status: CANONICAL
Version: 1.2

## Objective

Measure what is materially different today from each team's normal/current football baseline using current-context evidence only, then translate that change into a preference-specific NEWS effect through an explicit causal chain.

NEWS remains isolated from ANALYST, SXF, POLY and FINAL. It must never use odds, market flow or another department's conclusions.

## Core workflow

1. Confirm match date, kickoff time and venue context.
2. If the user supplied a selection, classify it as SIDE or GOALS/BTTS for NEWS interpretation.
3. Research both teams symmetrically across availability, manager context, motivation, off-field issues, schedule/rest/travel and material weather/pitch.
4. Build the player-availability list.
5. For every material absence/uncertainty/return, establish:
   - status certainty;
   - normal usage/importance;
   - NEW / RECENT / LONG-TERM-ALREADY-ABSORBED status;
   - likely replacement(s);
   - replacement confidence;
   - replacement role/quality fit;
   - specific football mechanism created by the change.
6. Detect interacting absence chains rather than counting absences independently.
7. Filter manager statements for operational information only.
8. Check whether schedule, congestion, travel or logistics amplify squad/role problems.
9. Check material weather/pitch only when it can plausibly change play.
10. Reconcile source conflicts and preserve uncertainty.
11. For each directional preference factor, require a causal chain:
   `current fact -> lineup/role/preparation change -> football mechanism -> preference effect`.
12. Preserve supporting, opposing and neutral/uncertain factors separately.
13. Compute NEWS confidence score 0-100 using the canonical v1.2 bootstrap rubric.
14. Produce a NEWS-only descriptive conclusion. Do not issue FINAL categories or a betting recommendation.

## Selection-family interpretation

### SIDE

Use current-context information to judge whether a team is more or less capable than its normal/current baseline of controlling, resisting or solving the match over 90 minutes.

Prioritize:
- central spine availability;
- goalkeeper/centre-back/holding-midfielder interaction;
- buildup and pressing role losses;
- creator/ball-progression losses;
- replacement quality and positional fit;
- bench depth and in-game correction options;
- fatigue/congestion interacting with squad depth;
- manager-confirmed rotation or role changes.

Do not import team-form or historical tactical statistics from ANALYST.

### GOALS / BTTS

Interpret the two scoring/defending legs separately where useful.

Prioritize:
- striker/creator availability;
- goalkeeper and defensive-line availability;
- multiple current absences in one attacking or defensive unit;
- replacement scoring/creation profile;
- replacement defensive fit;
- manager-confirmed attacking/defensive rotation;
- fatigue that plausibly changes pressing, transition defence or attacking freshness;
- unusual weather/pitch only when materially relevant.

A general team absence must not automatically be treated as a goal-market signal. State the mechanism.

## Absence framework

### ABSENCE_IMPORTANCE

How important the player normally is to the team.

### ABSENCE_EFFECT

How much the absence is expected to change this specific match after considering:
- replacement quality;
- replacement role fit;
- alternative tactical solution;
- depth at the position;
- interaction with other absences;
- certainty of status/replacement information;
- recency;
- prior adaptation.

Use qualitative bands:
- LOW
- MODERATE
- HIGH
- VERY_HIGH

Do not equate fame with effect.

## Recency and adaptation

Classify important absences as:
- NEW ABSENCE — fresh change to the current lineup/structure;
- RECENT ABSENCE — limited evidence of adaptation;
- LONG-TERM / ALREADY ABSORBED — the player may be important in absolute terms, but today's marginal NEWS impact may be smaller because the team has already been playing without them.

If a long-term absence has a stable replacement solution, do not repeatedly score it like a new injury.

## Replacement-first evaluation

For every important absence, identify the most likely replacement when credible evidence allows it.

Evaluate:
- whether the replacement is natural or makeshift;
- whether the role changes;
- whether shape, buildup, pressing, defensive coverage, set pieces or chance creation change;
- how certain the expected replacement is;
- whether the team has already used this solution.

If no credible replacement can be established, write:
`yerine kimin oynayacağı henüz net değil`.

Never omit the replacement question merely to keep the report short.

## Absence-chain framework

Related absences should be evaluated as a functional chain rather than simple arithmetic.

Examples:
- two central midfield starters missing;
- goalkeeper plus weakened centre-back line;
- creator plus striker missing;
- multiple players from the same flank/position group missing;
- several absences combined with congestion and thin bench depth.

For each chain, identify:
1. the affected functional unit;
2. whether there is a credible replacement structure;
3. whether the chain amplifies one another;
4. whether the same root cause is being double-counted.

## Manager-statement filter

Material statements include:
- confirmed/likely absences or returns;
- rotation intentions;
- minutes/fitness restrictions;
- freshness/rest plans;
- shape/role changes caused by availability;
- concrete fixture priority;
- confidence in a specific replacement/young player;
- a specific preparation or logistical issue.

Ignore generic motivation language such as:
- `we want to win`;
- `we are ready`;
- `it is an important match`;
- `the derby means a lot`.

Generic press-conference language is not evidence.

## Motivation rule

Motivation is material only when tied to concrete circumstances such as:
- qualification/relegation scenarios;
- fixture priority;
- rotation incentives;
- cup/league tradeoffs;
- credible direct statements revealing a real selection or effort decision.

`Must win` alone is insufficient.

## Schedule, congestion and travel

Schedule burden is not automatically negative.

It becomes material when it plausibly interacts with:
- limited squad depth;
- new injuries/suspensions;
- manager-confirmed rotation;
- short recovery;
- unusual travel/logistical burden;
- specific fitness restrictions.

The report should state the interaction mechanism, not just the number of days between matches.

## Weather/pitch rule

Only report weather or pitch conditions likely to affect play materially. Ordinary conditions are not a signal.

Use authoritative/direct weather or venue information when possible.

## Causal-chain test

A preference factor is directional only when the following can be stated credibly:

`FACT -> CHANGE -> MECHANISM -> PREFERENCE EFFECT`

If one link is unsupported, downgrade the factor to neutral/uncertain or omit it from directional evidence.

Do not transform a true but irrelevant news item into preference support.

## Source reconciliation

Use the NEWS source policy:
- N1 primary/direct evidence;
- N2 reliable direct reporting;
- N3 contextual role evidence;
- N4 clue only.

Material claims should prefer N1/N2. When credible sources conflict:
- preserve the conflict;
- explain what is disputed;
- reduce the relevant score component;
- never silently choose the version that better fits the user's preference.

## NEWS confidence score 0-100

The score measures NEWS evidence quality, not win probability.

### 1. Source reliability and verification — 0 to 25

Guide:
- 22-25: core claims primarily N1, or multiple strong N1/N2 confirmations;
- 17-21: mostly N1/N2 with limited unresolved items;
- 10-16: meaningful reliance on N3 or source conflict;
- 0-9: weak/unverified evidence dominates.

### 2. Freshness / match-time relevance — 0 to 20

Guide:
- 18-20: current match-week / latest direct status with clear as-of relevance;
- 14-17: recent and still applicable;
- 8-13: partly stale or adaptation status uncertain;
- 0-7: stale/current applicability unclear.

Freshness must be judged relative to kickoff and the decision timestamp.

### 3. Causal connection to supplied selection — 0 to 25

Guide:
- 22-25: several clear fact->change->mechanism->selection chains;
- 17-21: one or more strong direct mechanisms with minor uncertainty;
- 10-16: plausible but partially indirect mechanisms;
- 0-9: mostly narrative association rather than causal connection.

### 4. Structural impact — 0 to 20

Guide:
- 18-20: major interacting absence/context chain affecting a core functional unit;
- 14-17: material current lineup/role/preparation effect;
- 8-13: moderate isolated effect;
- 0-7: low marginal effect or already absorbed condition.

### 5. Resistance to opposing evidence and unresolved uncertainty — 0 to 10

This component is higher when the directional NEWS case remains strong after accounting for credible opposing facts.

Guide:
- 9-10: little material opposing evidence and low unresolved uncertainty;
- 7-8: manageable counter-evidence;
- 4-6: meaningful counter-evidence or uncertainty;
- 0-3: strong contradiction or major unresolved items.

### Total and bands

`NEWS confidence score = component 1 + 2 + 3 + 4 + 5`

Bands:
- 90-100: VERY_STRONG_NEWS_EVIDENCE
- 80-89: STRONG_NEWS_EVIDENCE
- 70-79: MODERATE_STRONG_NEWS_EVIDENCE
- 60-69: MODERATE_NEWS_EVIDENCE
- 50-59: WEAK_MIXED_NEWS_EVIDENCE
- 0-49: INSUFFICIENT_OR_UNRELIABLE_NEWS_EVIDENCE

These are v1.2 bootstrap operational bands. They are not calibrated probabilities and must later be validated against out-of-sample results.

Do not say `86/100 means 86% chance`. Correct interpretation: `NEWS evidence for this preference is strong, fresh and causally coherent.`

## NEWS balance

When a preference is supplied, classify the descriptive NEWS direction as:
- TERCİHİ DESTEKLİYOR
- HAFİF DESTEKLİYOR
- DENGELİ / KARIŞIK
- HAFİF KARŞI
- TERCİHİ DESTEKLEMİYOR
- YETERLİ NEWS KANITI YOK

Direction and confidence score are separate fields. A direction can be positive but have a mediocre score because sources are weak or causal links are uncertain.

Missing information is no evidence, not neutral evidence.

## User-facing detailed output

Default single-match order:
1. Important availability/context for Team A.
2. Important availability/context for Team B.
3. Material manager statements.
4. `Maç öncesi en önemli gelişmeler` including absence chains and congestion interactions.
5. If preference supplied: `Tercihi destekleyen faktörler`.
6. `Tercihi desteklemeyen faktörler`.
7. `Nötr / belirsiz faktörler`.
8. `NEWS dengesi`.
9. `NEWS güven puanı: X/100` with the five component scores.
10. `NEWS failure modes` — the main reasons the current news interpretation could overstate the actual match effect.

Use natural Turkish. Do not expose raw schema labels unless requested.

For each important absence include, when reliably available:
- player;
- exact status;
- current-season minutes or starts/appearances;
- consecutive missed matches / recency;
- new/recent/already absorbed status;
- team importance;
- likely replacement;
- replacement confidence and fit;
- match-specific effect.

Never invent minute totals.

## Failure-mode discipline

Before kickoff, state the most relevant ways the NEWS thesis could fail, for example:
- replacement performs at starter level;
- reported absence effect is already absorbed;
- expected rotation does not occur;
- opposing team has its own offsetting absence chain;
- a source conflict resolves against the initial interpretation;
- the causal link is weaker in practice than expected.

These are not reasons to force a lower score automatically; they are explicit counter-cases that improve auditability.

## Post-match learning protocol

Historical pre-match NEWS reports are immutable.

After settlement, evaluate separately:
1. result hit/miss;
2. whether the predicted NEWS mechanism occurred;
3. whether the expected structural advantage/disadvantage appeared on the field when observable;
4. whether failure was NEWS interpretation error or match/outcome variance.

Recommended review tags:
- REPLACEMENT_EFFECT_UNDERESTIMATED
- REPLACEMENT_EFFECT_OVERESTIMATED
- ABSENCE_ALREADY_ABSORBED
- ABSENCE_CHAIN_MISREAD
- ROTATION_MISREAD
- SOURCE_UNCERTAINTY
- CAUSAL_LINK_TOO_WEAK
- OPPOSING_NEWS_UNDERWEIGHTED
- MATCH_STATE_VARIANCE
- FINISHING_VARIANCE

Track score-band calibration over time. At minimum, compare hit rate and mechanism-confirmation rate for 90-100, 80-89, 70-79, 60-69, 50-59 and below-50 groups.

Do not tune thresholds on the same chronological sample used to claim improvement. Use walk-forward or other out-of-sample validation before changing canonical weights/bands.

## Final boundary

NEWS outputs current-context evidence, NEWS direction, uncertainty, evidence-confidence score and failure modes.

NEWS does not output FINAL A/B/C, stake size, value assessment or a betting recommendation.