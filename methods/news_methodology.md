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
4. Identify likely replacement(s) and confidence in replacement expectation. For every important absence, this step is mandatory: state who is most likely to replace the player, how certain that expectation is, and what changes in role, quality, shape, buildup, pressing, defensive coverage, set pieces, or chance creation may follow. If a credible replacement cannot be established, explicitly state that the replacement is not yet known.
5. Establish recency and adaptation status for every important absence: is this the first missed match, a recent multi-match absence, or a long-term absence the team has already adapted to?
6. When reliable data is available, collect current-season usage: minutes, starts/appearances, and meaningful goal/assist or role evidence where relevant. Do not fabricate precision when reliable usage data is unavailable.
7. Check manager change/statements only for match-relevant current information.
8. Check motivation only when concrete competition circumstances support it.
9. Check off-field disruption when preparation/selection impact is plausible.
10. Check rest, congestion, travel, and unusual logistics.
11. Check material weather/pitch conditions.
12. Reconcile source conflicts and mark confidence.
13. Produce NEWS-only impact summary without odds/market information.

## Absence framework

ABSENCE_IMPORTANCE asks how important the player normally is.

ABSENCE_EFFECT asks how much the absence is expected to change this specific match after considering:
- replacement quality;
- replacement role fit;
- alternative tactical solution;
- depth at the position;
- whether multiple absences interact;
- certainty of the status/replacement information;
- how recently the player became unavailable;
- whether the team has already demonstrated an adaptation to the absence.

Use qualitative bands unless a later approved version introduces calibrated numeric scales:
- LOW
- MODERATE
- HIGH
- VERY_HIGH

Do not equate fame with effect.

A long-term absence should not automatically receive the same match-specific effect as a newly missing regular starter. Distinguish:
- NEW ABSENCE — fresh change to the normal/current lineup;
- RECENT ABSENCE — team has limited evidence of adaptation;
- LONG-TERM / ALREADY ABSORBED — player may be important in absolute terms, but today's marginal NEWS effect can be lower because the team has already been playing without them.

## Motivation rule

Generic claims such as 'must win', 'will be motivated', or 'derby intensity' are insufficient by themselves. Motivation becomes material only when tied to concrete incentives, rotation incentives, qualification/relegation scenarios, fixture priorities, or credible direct statements.

## Weather/pitch rule

Only report conditions likely to affect play materially. Ordinary weather is not a signal.

## Output

Internally, preserve the canonical NEWS report structure and evidence trace for reproducibility.

For the user-facing report, default to simple natural-language Turkish rather than schema/YAML/code-like output.

### Default single-match detailed presentation

For a detailed single-match request, present in this order:

1. Team A absences table.
2. Team B absences table.
3. Manager statements, grouped by team.
4. Important pre-match developments.
5. A short NEWS-only synthesis.

The default absence table should use human-readable columns such as:
- Oyuncu
- Durum
- Bu sezon oynadığı süre / başlangıç sayısı
- Kaç maçtır yok?
- Yeni mi, uzun süredir mi yok?
- Takım için önemi
- Yerine kim oynayabilir?
- Oyuna/takıma etkisi

For every material absence, tell the user all of the following:
1. who is missing or doubtful;
2. whether the status is definitely out, doubtful, or available again;
3. how much the player has actually been used this season, when reliable data exists;
4. how many matches they have already missed consecutively, or whether this is the first missed match;
5. whether the absence is new/recent or already absorbed;
6. why that player matters;
7. who is most likely to replace them;
8. how strong/reliable that replacement is for the role;
9. how the team's play may change because of the replacement.

If exact minutes are not reliably verified, use verified starts/appearances instead or explicitly say exact minute data could not be confirmed. Never invent numbers.

If the replacement is uncertain, write `yerine kimin oynayacağı henüz net değil` and explain plausible options only when supported by credible sources. Never omit the replacement question merely to keep the table short.

### Manager statements

Manager statements should be clearly separated from general reporting. Extract only match-relevant statements about:
- confirmed or likely absences/returns;
- rotation intentions;
- freshness/rest management;
- tactical or formation changes caused by availability;
- motivation/fixture priority when concrete;
- recent performance concerns that the manager explicitly identifies;
- confidence in a specific replacement or young player.

Summarize the substance in plain Turkish. Do not flood the user with generic press-conference quotes.

### Important developments

End with a compact section titled `Maç öncesi en önemli gelişmeler` containing only the few pieces of information that materially change today's baseline. Prefer comparisons such as:
- `new absence vs long-term absence`;
- `regular starter out, direct replacement known`;
- `two players from same position group out`;
- `manager explicitly planning rotation`;
- `key player returns after missing X matches`;
- `travel/weather/pitch factor is genuinely unusual`.

Do not show raw labels such as `home`, `away`, `net_news_impact`, `NEUTRAL`, `POSITIVE`, `NEGATIVE`, `QUESTIONABLE`, or other schema keys unless the user explicitly requests the raw structured report.

If reliable current news is missing, write it directly in ordinary language, for example: `Bu takım için güvenilir, maçı değiştirecek güncel bir haber bulamadım.` Missing information is not a neutral signal and must not be presented as one.

Uncertainty should also be explained naturally: `son fitness testi bekleniyor`, `oynama durumu belirsiz`, `kaynaklar birbiriyle çelişiyor`, etc.

The final NEWS conclusion must remain descriptive and must not be converted into a betting recommendation.