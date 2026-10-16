# ANALYST Methodology

Status: CANONICAL
Version: 1.1

## Objective

Build an independent football baseline and matchup view before any current-news or market information is considered. When the user supplies a specific preference/selection, test that exact preference with football-performance evidence instead of replacing it with a generic match prediction.

## Workflow

1. Define the current football era for each team. Detect manager, system, competition, or structural breaks that make older data incomparable.
2. Gather same-season official-match evidence.
3. Review windows of 1 / 5 / 10 / 20 matches where available, without treating each window as equally reliable.
4. Compare raw results with underlying performance and contextual distortions.
5. Separate stable team identity from short-term variance.
6. Adjust interpretation for opponent strength: distinguish strong, comparable and weak opposition rather than treating every result equally.
7. Build the matchup: how Team A's mechanisms interact with Team B's mechanisms.
8. Record uncertainties and distortions.
9. If the user supplied a preference, map the evidence specifically to that selection as supporting, opposing, or genuinely neutral/two-sided.
10. Produce the structured ANALYST report without referencing current news or markets.

## Distortion checklist

Flag when material:
- red cards or long numerical imbalance;
- penalties or highly unusual set-piece concentration;
- extreme finishing or goalkeeper variance;
- early game-state effects;
- unusually weak/strong opposition clusters;
- major rotation visible from historical match records;
- schedule congestion that is part of historical match context only, not current NEWS research;
- promoted/relegated-level transitions;
- tactical or managerial era break.

## Form interpretation

Do not reduce form to W/D/L sequences.

When evidence permits, separate:
- **result form** — what scorelines and points say;
- **underlying form** — xG/xGA, shot/chance quality, territorial or box control and other permitted performance evidence;
- **finishing/goalkeeping variance** — whether goals and points materially exceed or trail underlying performance;
- **opponent-adjusted form** — whether the same performance survives against strong/comparable opponents or is concentrated against weak opposition;
- **home/away form** — only when sample size is meaningful;
- **trend versus noise** — whether the last 1/5 matches are supported by wider 10/20-match evidence.

A team may therefore be labelled in interpretation as genuinely in form, results-hot/overperforming, results-cold/underperforming, or mixed, but these labels must be supported by evidence and never treated as certainty.

## Matchup dimensions

Assess only when evidence supports them:
- build-up versus press;
- press resistance;
- transition attack/defense;
- territorial control;
- box entries/chance creation;
- shot/chance quality and concession profile;
- wide/crossing versus central creation;
- set-piece strength/vulnerability;
- possession-state dependence;
- home/away structural differences;
- likely game-state sensitivity.

## Preference test framework

When the user provides an explicit preference, ANALYST tests that exact selection.

### 1. Tercihi destekleyen faktörler
Include only material football-performance evidence that directly raises the plausibility of the supplied selection. Examples may include:
- stable underlying superiority relevant to the selection;
- opponent-adjusted form;
- sustainable attacking or defensive profile;
- a tactical matchup mechanism that directly favors the selection;
- home/away evidence when the sample is meaningful;
- a result pattern supported by underlying data rather than scoreline alone.

### 2. Tercihi desteklemeyen faktörler
Include material contrary evidence and explicit failure modes, such as:
- the opposing team's strong underlying profile;
- unsustainable finishing in the preferred direction;
- poor performance against comparable/strong opposition;
- a tactical matchup that blocks the preferred mechanism;
- game-state dependence that can break the selection;
- a combination leg that is materially weaker than the other leg.

### 3. Nötr / çift yönlü faktörler
Use only for evidence that is genuinely conditional or has plausible effects in both directions. Do not place missing data here. Missing data is no evidence.

### 4. Denge
Do not count bullets. Weigh evidence qualitatively by:
- reliability/data quality;
- sample size;
- opponent strength;
- structural comparability;
- recency within the same era;
- relevance to the exact selection;
- independence from other evidence.

Correlated observations from the same underlying cause must not be double-counted.

### 5. Sonuç
Provide a concise ANALYST-only assessment such as strong support, support, balanced, weak support, or not supported, plus LOW/MEDIUM/HIGH confidence. These are qualitative presentation labels, not calibrated probabilities, odds/value assessments, stakes, or FINAL categories.

## Combination preferences

If the supplied preference contains multiple legs, test each leg separately first. A combination cannot be described as strongly supported when one material leg has weak or contradictory football evidence. Explain which leg is the limiting factor.

## Interpretation rules

Do not equate recent results with true level.
Do not treat a 1-match observation as a trend without support.
Do not aggregate incompatible eras.
Do not turn tactical plausibility into certainty.
Do not use missing evidence as neutral confirmation.
Do not use factor counts as a voting system.

## Output

For a generic match-analysis request, conclude with:
- BASELINE: each team's normal current level/identity;
- MATCHUP: mechanisms favoring each side;
- STABILITY: what evidence is strong versus noisy;
- KEY RISKS: reasons the baseline may fail;
- ANALYST LEAN: football-only directional interpretation if justified, with confidence and no betting language.

For a user-supplied preference, default instead to the readable order:
1. Tercihi destekleyen faktörler
2. Tercihi desteklemeyen faktörler
3. Nötr / çift yönlü faktörler
4. Denge
5. Sonuç + confidence

The preference-aware conclusion remains an ANALYST evidence assessment only; it is not a FINAL betting recommendation.
