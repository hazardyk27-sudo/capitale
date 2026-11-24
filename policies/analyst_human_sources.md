# CAPITALE — ANALYST Human Editorial Source Registry

Status: DRAFT — source shortlist approved for retention by owner on 2026-11-24; live use and methodology change not yet approved.
Version: 0.1
Scope: candidate supplementary human-authored prematch research, not a predictive authority.

## Saved source shortlist

| Source | Public entry | Candidate research value |
| --- | --- | --- |
| Sports Mole | https://www.sportsmole.co.uk/football/ | Editorial previews, form and matchup context |
| Sportsgambler | https://www.sportsgambler.com/betting-tips/ | Statistical matchup evidence and editorial reasoning |
| SportyTrader | https://www.sportytrader.com/en/betting-tips/football/ | Match previews and explanatory historical statistics |
| Betfair Blog | https://betting.betfair.com/football/ | Named editorial contributors and contextual reasoning |

Access, authorship, original provenance, publication time, coverage, and usage terms must be checked per article. Inclusion here is not an assertion of universal free access, accuracy, independence or predictive skill.

## Proposed anti-anchoring protocol — DRAFT, not active

1. Independent baseline: ANALYST completes and freezes its own allowed statistical and tactical evidence and initial factual interpretation before receiving editorial extracts. Record as_of and baseline hash.
2. Separate extraction boundary: an upstream extractor, not the same ANALYST context, supplies structured claim-only extracts. Remove explicit and implicit betting recommendations, predicted scores, betting odds, model probabilities, confidence, betting market statistics, ranking of selections, and promotional calls to action. If filtering cannot be established, do not pass the article to ANALYST. Prompt instructions alone do not guarantee blindness.
3. Source separation: current news, injuries, squad availability and rumors must not enter ANALYST; any such material is reserved for NEWS, subject to its own independent approved policy. No SXF or POLY material. Preserve source isolation.
4. For each claim record source URL, author if available, publication/update time, claim type (observed fact or editorial interpretation), supporting data, underlying provenance and uncertainty. Reject future/post-kickoff information. Check usage terms; no paywall bypass.
5. Independently verify factual claims from allowed football sources. Treat unverified tactical interpretation as a hypothesis, not a verified fact. Seek counterevidence and explain limitations. No automatic agreement with the author.
6. Deduplicate repeated claims and shared data sources. Multiple publishers repeating one fact are not independent confirmations. Never use publisher vote counts or recommendation consensus.
7. Log baseline versus post-extract changes and the concrete evidence that justified each change; retain disagreements and rejected claims. No directional change solely due to editorial authority.
8. FINAL receives verified findings, clearly marked interpretations, limitations and contradictions, not third-party picks or scores. Any wider changes to ANALYST/NEWS/FINAL output contracts require owner approval.
9. Test baseline-only versus blinded editorial augmentation on timestamped historical matches, with frozen outputs and separate settlement; measure incremental value, contamination, coverage and reproducibility before promotion.

This registry does not supersede AGENTS.md, policies/analyst_sources.md, the active ANALYST v2.1 methodology, or existing source boundaries. Do not enable new live source access or change existing report scoring until the owner approves a versioned method and corresponding policy/schema changes.
