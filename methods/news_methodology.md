# NEWS Methodology

Status: CANONICAL
Version: 1.0

## Objective

Measure what is materially different today from each team's normal football baseline, using current-context evidence only.

## Workflow

1. Confirm match date/time/venue context.
2. Build player-availability list.
3. For every material absence/uncertainty, score separately:
   - ABSENCE_IMPORTANCE
   - ABSENCE_EFFECT
4. Identify likely replacement(s) and confidence in replacement expectation.
5. Check manager change/statements only for match-relevant current information.
6. Check motivation only when concrete competition circumstances support it.
7. Check off-field disruption when preparation/selection impact is plausible.
8. Check rest, congestion, travel, and unusual logistics.
9. Check material weather/pitch conditions.
10. Reconcile source conflicts and mark confidence.
11. Produce NEWS-only impact summary without odds/market information.

## Absence framework

ABSENCE_IMPORTANCE asks how important the player normally is.

ABSENCE_EFFECT asks how much the absence is expected to change this specific match after considering:
- replacement quality;
- replacement role fit;
- alternative tactical solution;
- depth at the position;
- whether multiple absences interact;
- certainty of the status/replacement information.

Use qualitative bands unless a later approved version introduces calibrated numeric scales:
- LOW
- MODERATE
- HIGH
- VERY_HIGH

Do not equate fame with effect.

## Motivation rule

Generic claims such as 'must win', 'will be motivated', or 'derby intensity' are insufficient by themselves. Motivation becomes material only when tied to concrete incentives, rotation incentives, qualification/relegation scenarios, fixture priorities, or credible direct statements.

## Weather/pitch rule

Only report conditions likely to affect play materially. Ordinary weather is not a signal.

## Output

Internally, preserve the canonical NEWS report structure and evidence trace for reproducibility.

For the user-facing report, default to simple natural-language Turkish rather than schema/YAML/code-like output. For a multi-match run, prefer a compact table with columns such as:
- Maç
- Önemli güncel haberler
- Bunun takıma olası etkisi
- Bilginin gücü / belirsizlik

Then, only where necessary, add a short plain-language explanation under the table.

Do not show raw labels such as `home`, `away`, `net_news_impact`, `NEUTRAL`, `POSITIVE`, `NEGATIVE`, `QUESTIONABLE`, or other schema keys unless the user explicitly requests the raw structured report.

If reliable current news is missing, write it directly in ordinary language, for example: `Bu takım için güvenilir, maçı değiştirecek güncel bir haber bulamadım.` Missing information is not a neutral signal and must not be presented as one.

For every material item, tell the user both:
1. what happened;
2. why it may matter in this match.

Uncertainty should also be explained naturally: `son fitness testi bekleniyor`, `oynama durumu belirsiz`, `kaynaklar birbiriyle çelişiyor`, etc.

The final NEWS conclusion must remain descriptive and must not be converted into a betting recommendation.