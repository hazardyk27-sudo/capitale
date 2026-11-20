# CAPITALE — 100 Italy adult male synthetic personas (v1)

**Status:** EXPERIMENTAL audience-critique fixture, built 2026-11-20. **Not a sample of real Instagram users, Italian men, sports bettors, or CAPITALE followers.** All 100 male identities and finances are invented and designed to test *varied* responses, not to estimate Italian consumer percentages.

## Files
- `founder/italy_male_personas_100.json`: frozen full persona records, IDs P001–P100.
- `founder/italy_male_personas_100.csv`: convenience spreadsheet view (one row per persona).
- `scripts/gemini_italy_panel.py`: reads the frozen JSON. For 100, uses all records; for 10/20, draws a reproducible random subset **without rewriting** the person. Every record has its own API request.
- `tests/test_gemini_italy_panel.py`: verifies male, Italian, adult, uniqueness, budget consistency, region/job/behavior variety and the same persona identities across runs.

## Deliberate diversity — NOT actual prevalence
- Male Italian adults, ages 18–55; family/living situations, education proxy through occupation, support from family, employment, professions, cities across north, center and south/islands.
- Region quota: North 38, Center 25, South and Islands 37; **purposefully chosen**, not weighted against a national Instagram dataset.
- Content interests: Serie A fans 28, statistics/data 22, football-only 18, Telegram communities 14, pick readers 10, verification skeptics 8.
- 100 separate identities with different mobile attention patterns, engagement styles, preferred teams, football interests, trust requirements, objections, privacy concerns, Italian/English comfort, and Telegram use.
- Betting history: never 57, former 8, rare 21, occasional 10, frequent 4. **Intentionally not representative of Italian sports betting participation.** These traits can occur alongside various interests; football fans are not automatically bettors.

## EUR budget fields
Each record has a `budget` object with:
- `personal_monthly_net_resources_eur`: fictional monthly money available to the individual, including family support where relevant, NOT Italy's individual median wage.
- `monthly_essential_costs_eur`: estimated monthly necessary expenses allocated to that individual.
- `monthly_planned_savings_eur`: fictional planned saving.
- `monthly_optional_spending_eur`: **resources – essential costs – savings**, must be non-negative.
- `monthly_sports_betting_self_limit_eur`: fictional personal MAXIMUM spending limit if the persona currently bets, otherwise **€0**; **not** predicted amount wagered or a conversion propensity.

No model should infer willingness to follow/join or gamble mechanically from income, location, age or a budget. Zero-limit users and former bettors must not be treated as prospects to persuade into gambling. The model is told to judge the same pitch freely, including rejection.

## Anchors and limits
The following public sources were consulted to choose broad income variation, social-media context and an explicit non-bettor cohort. **They DO NOT provide the exact numbers for this set of 100 fictional persons**:

1. ISTAT, *Living conditions and household income – Year 2024-2025*: https://www.istat.it/en/press-release/living-conditions-and-household-income-year-2025/ — for 2024 the **household** median was €31,704 per year (€2,642/month), with significant regional and household-type differences. This is NOT the median income of each adult man and should **not** be presented as one.
2. ISTAT, *Giochi, un’attività abituale per la maggioranza dei cittadini – Anno 2024*: https://www.istat.it/comunicato-stampa/giochi-unattivita-abituale-per-la-maggioranza-dei-cittadini/ — among men aged 14+ 37.8% reported **any** money-prize gambling during the prior year; sports-based games were reported by 8.2%. Figures include some under-18s; this panel excludes under-18s. The broader gambling figure is NOT a sports-betting rate and the figures do NOT describe male football-analysis followers.
3. DataReportal, *Digital 2026: Italy*: https://datareportal.com/reports/digital-2026-italy — reach estimates for Instagram and social platforms, not a verified profile of CAPITALE viewers.

**Age, region, job, budget, preferences, and gambling behavior of each record are synthetic scenarios, not directly observed or statistically fitted to these sources.** The male-only panel intentionally excludes other genders and cannot be used to claim population representativeness.

## How to evaluate
Run the existing manual GitHub Action: `CAPITALE Gemini Italy Panel`. Pick 10 first (dry_run=true to verify **zero API requests**; then false for genuine calls), then 20 or 100.

For a 100-run the report must show **100 separately validated responses**, otherwise inspect `manifest.json` and `errors.json`. Gemini free-tier limits vary; never make up missing results.

Use the panel to compare **specific creative ideas with identical stimuli**, not to predict performance, revenues, virality or follower conversion. If testing multiple pitches, preserve a stable persona panel and identical question template; use actual platform analytics for real validation. No Reel/video is currently provided to the API runner; it evaluates `founder/pitch.md`.

## Legal and ethical context
The system does not verify legality of sports betting promotion in Italy or Instagram policy compliance. No fictional persona may be used as a real testimonial. Avoid high-pressure profit claims, spending-based inducements, or directing former/non-bettors into gambling.
