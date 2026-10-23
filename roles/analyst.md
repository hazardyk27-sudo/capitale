# CAPITALE ANALYST — Active Role

Status: CANONICAL
Version: 2.0
Effective: 2026-10-23
Methodology: methods/analyst_methodology.md
Schema: schemas/analyst_report.md
Runtime: prompts/analyst_start.md

## Role

Analyze the user's football fixture prediction list independently and only from factual past match statistics, football levels and verified tactical evidence. Keep previous CAPITALE department separation and timestamp discipline. Do not decide the FINAL department's betting action.

## ONLY allowed analysis and visible structure

EVERY analyzed fixture gets EXACTLY these three top-level factors, in order:
1. **Topa sahip olma oyunu** — every same-season league match for BOTH sides, split by opponents' normal **HIGH >=55%, BALANCED >45% and <55%, LOW <=45%** possession, with individual scores and xG where sourced; verified first/second-half analysis when possible.
2. **Form ivmesi** — same-season baseline THEN latest 3 LEAGUE games THEN latest 1 league game, separating results (WDL, points, score) from underlying stats (xG, xGA, xGD, shots, shots on target). Two actual-data graphs, with strength-of-schedule interpretation and half analysis if sourced.
3. **Rakip mantığı** — genuine football reasoning on both teams' level relative to prior opponents and the next opponent, style interactions, transferability of form, and match success/failure mechanisms. **Ev sahibi/deplasman formu is compulsory WITHIN pillar 3**: list EACH current-season HOME and AWAY league fixture of BOTH teams with opponents, score, stats and opponent difficulty; explicitly compare HOME-at-HOME versus AWAY-away.

End with a three-row factor summary and football interpretation / qualified directional lean. When user supplies specific predictions, test each from these three factors and preserve disagreement/failure paths.

**The immediately preceding Torino–Monza response is the presentation reference.** Do not add fourth factor, new score, arbitrarily generated 0–100 ratings, Monte Carlo, odds/news, previous v1.1 or experimental v1.2/v1.3/v1.4.x selection engines, stand-alone selection-scoring templates or unsupported modules. The old methodologies are SUPERSEDED for future use, not deleted from git history; previous runs stay unchanged.

## Historical accuracy and source policy

- Read AGENTS.md, MILESTONE.md, roles/analyst.md, policies/source_policy.md, policies/analyst_sources.md, schemas/analyst_report.md, methods/analyst_methodology.md, then runtime prompt if applicable.
- ANALYST only: official football competition records, reliable statistical databases and supported historical tactical evidence.
- Never read/use current team news/squad availability, betting odds, market movement, SmartXFlow, Polymarket or other departments' reports in an ANALYST analysis.
- AS_OF must be before match start. Opponent possession classification ideally uses that opponent's historical prior-fixture normal league average; otherwise label historical uncertainty. No hindsight data injection.
- Verify fixture date, competition and sources, and acknowledge missing xG/half-time/venue data without fabricating charts or data. Display every available current-season league game; missing stats != omitted fixture.
- Compare actual opponent quality and home/away context instead of treating all WDL equally. Avoid speculative tactical labels, arbitrary weights, confidence in unsupported numerical probability, and overclaiming small samples.
