# NEWS Methodology

Status: CANONICAL
Version: 1.3

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
13. Perform three separate qualitative assessments: fact verification, effect confidence after replacement/adaptation, and selection-specific NEWS relevance. No uncalibrated numeric total.
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

## v1.3 evidence workflow

### 1. Fact confidence
VERIFIED / PROBABLE / CONFLICTED / INSUFFICIENT. For every material claim: direct source, published/fetched times, availability at AS_OF, correct player/team/fixture, and N1/N2 corroboration when possible. Credible sources prove stated facts, not implied match consequences.

### 2. Incremental effect confidence
HIGH / MEDIUM / LOW / INSUFFICIENT. For each important absence/return assess NEW/RECENT/ALREADY_ABSORBED; evidence-backed replacement(s), role fit, prior usage of the replacement, manager's adjustment, bench depth and plausible tactical mitigation. If replacement is unknown, its quality and effect are UNKNOWN. Do not assume weakness and do not issue a strong negative on that basis. Genuine interacting absence chains need a demonstrated interaction, not just a list of unavailable players.

### 3. Preference-specific impact
Only when a complete chain exists: FACT -> incremental lineup/preparation change -> COMPENSATED football mechanism -> impact on user's SIDE/GOALS_BTTS selection. Preserve both directions and a credible counter-case. A favorite weakened by an injury can remain favored and win; NEWS does not infer overall match strength or absolute selection likelihood. Missing evidence -> YETERLİ NEWS KANITI YOK; real offsetting evidence -> DENGELİ / KARIŞIK. For BTTS split both scoring legs; for totals evaluate both attack/defense sides.

## Deprecated scores

The v1.2 25/20/25/20/10 0–100 score and bands, plus noncalibrated 0–100 preference support figures, are SUPERSEDED for new v1.3 output. Numeric fields must be null, scoring_status NOT_CALIBRATED. Qualitative assessments are not probabilities. Future quantitative revival requires untouched chronological out-of-sample calibration and owner approval.

## User-facing reporting

Use plain Turkish. Provide credible match-specific facts for both clubs, missing/returning players, when available reliable usage, age of absence, expected replacement and adaptation evidence. Present preference-supporting/opposing/uncertain factors, NEWS balance, fact verification, effect confidence, preference relevance and strongest compensation counter-case. If credible replacement cannot be established: `yerine kimin oynayacağı henüz net değil`. If information insufficient: `Yeterli güncel bilgi yok`.

Before claiming negative impact, ask: "Even if this team loses a regular starter, why would the actual replacement fail to compensate? Could it still meet the user selection?" If there is no credible answer, do not oppose strongly.

## Validation

Pre-match reports frozen by AS_OF. Settle match outcomes separately and audit source claim accuracy, predicted lineup/replacement, and presence of the predicted game mechanism YES/PARTIAL/NO/UNKNOWN. NEWS accuracy is NOT the same as a selection's hit rate. Cluster multiple selection outcomes from one match, report coverage/abstention and unknown process evidence, and validate v1.3 against v1.2 on the same time-cutoff with walk-forward held-out data. The 17–18 October 2026 reviews are diagnostics only, not a held-out test.

## Role limits

Use only NEWS sources; no odds, SmartXFlow, Polymarket or other departmental evidence. NEWS does not issue a betting recommendation, stake, confidence probability or FINAL A/B/C category.
