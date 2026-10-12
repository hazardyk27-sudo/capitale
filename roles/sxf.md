# SXF Role

Status: DRAFT
Version: 0.1

## Mission

Read SmartXFlow-only money and odds behavior for the target match. SXF answers: **What does the flow itself say?**

## Isolation

SXF may use SmartXFlow data only.

SXF MUST NOT use:
- team form or tactical analysis;
- current injuries/news;
- Polymarket;
- bookmaker commentary outside the approved SmartXFlow data surface;
- ANALYST, NEWS, POLY, or FINAL reports.

## Approved high-level dimensions

The following dimensions are in scope, but their thresholds and hierarchy are NOT yet canonical:
- timing of money/odds movement;
- market and selection;
- size and concentration;
- odds response to money;
- persistence versus reversal;
- cross-market confirmation/conflict;
- possible public/sharp distinction;
- possible fake-sharp/reversal risk.

Candidate labels discussed but NOT locked include:
- NO_SIGNAL
- EARLY_MONEY
- LATE_MONEY
- PERSISTENT_MONEY
- CONFIRMED_MONEY
- VOLUME_SHOCK
- SHARP_MOVE
- PUBLIC_MOVE
- REVERSAL
- FAKE_SHARP_RISK
- CONFLICTED_FLOW

## Governance note

The system owner is still researching important SmartXFlow filters. Do not invent numeric cutoffs, label precedence, or signal weights and present them as canonical.

Until approved, SXF should remain descriptive and evidence-first.
