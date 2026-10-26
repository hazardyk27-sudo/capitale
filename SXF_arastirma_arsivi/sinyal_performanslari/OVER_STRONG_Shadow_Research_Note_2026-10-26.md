# SXF Üst 2.5 — OVER_STRONG deneysel araştırma notu

**Tarih:** 2026-10-26  
**Karar:** Sahip tarafından ileriye dönük araştırma için NOT ALINDI; SXF v0.4 kanonik STABLE/PREMIUM eşikleri DEĞİŞMEDİ. Bu bir üretim motoru aktivasyonu veya isabet garantisi DEĞİLDİR.  
**Temel araştırma:** [SXF_OVER25_Filter_Research_2026-10-09_25_v1.md](SXF_OVER25_Filter_Research_2026-10-09_25_v1.md)

## Korunan asıl üretim şartları
- STABLE OVER2.5: GBP >= 1,500; selected money share >= 65%; SXF odds 1.40–1.80.
- PREMIUM OVER2.5: GBP >= 2,500; share >= 75%; SXF odds 1.40–1.80; same selection's STABLE superseded.
- Both continue unchanged. Historical runs/reports never rewritten.

## Proposed new OVER_STRONG research-only tag
Eligible existing STABLE or PREMIUM Over 2.5 case, at a **genuine same-fixture original pre-match decision AS_OF**, must satisfy ALL:
1. **BTTS YES SXF decimal odds > 1.60** at eligible, source-consistent same-fixture snapshot not later than the decision time.
2. **OVER 2.5 selected money >= GBP 2,500** at original decision snapshot.
3. **OVER share T-6 minus OVER share T-8 > -2.00 percentage points**, using only valid snapshots available as of that exact T-6 decision, and checking source provenance and snapshot freshness.
4. Existing STABLE/PREMIUM engine conditions also fulfilled.

Do not retroactively impose T-6/T-8 observations on a different LIVE dynamic AS_OF or allow a post-AS_OF snapshot. The T-8/T-6 momentum test is currently defined **only for the historical T-6 checkpoint-research cohort**. For real-time variable horizons, design and validate an equivalent strictly historical look-back before any live shadow tag can be emitted.

If BTTS/T8 snapshots are missing, stale, or source-inconsistent, use CROSSMARKET_UNVERIFIED, preserve original signal, do not assign OVER_STRONG.

## Observed retrospective 9–25 Oct 2026 T-6 research results
- Original 66 OVER signals: 48 wins/18 losses = **72.7%**, STABLE 24/33 and PREMIUM 24/33.
- After excluding one material crossmarket source mismatch, 65 clean signals: 47 wins/18 losses = **72.3%**.
- BTTS YES SXF odds >1.60: 31/37 = **83.8%**, mean OVER SXF price **1.622**.
- BTTS YES >1.60 + OVER GBP >=2,500 (C2): 20/22 = **90.9%**, mean OVER SXF **1.611**.
- BTTS YES >1.60 + OVER share T-8→T-6 decline <2pp (C3): 24/27 = **88.9%**, mean OVER SXF **1.630**.
- **C2 AND C3 intersection**: 16/17 = **94.1%**, mean OVER SXF **1.609**; sole loss West Ham–QPR 1-1 on 9 Oct.
- Group sizes are **NOT disjoint**. C2 retains 22/65 and removes 27 historical winners as well as 16 losers; combined C2+C3 retains just 17/65.
- The retrospective thresholds were selected using this same sample: multiple comparisons / overfitting risk, and NOT a calibrated prospective success probability. Results use source-recorded FT; all match results have not been externally independently audited. No verified executable bookmaker ROI is established.

## Next steps
- Shadow-only tagging; never silently drop STABLE/PREMIUM or change a canonical engine.
- Freeze each new candidate's full source, fixture UID, odds, money, share, fresh snapshot timestamps, AS_OF and horizon **before** kickoff.
- Test on at least 50 NEW decisions, independently of training sample; measure hit, coverage loss, ROI using real executable odds, Wilson interval, STABLE/PREMIUM subgroups and per-day stability.
- Compare C1, C2, C3, and C2+C3, each against identical-cohort baseline, using chronological walk-forward; separate historical checkpoint model from genuine live dynamic AS_OF.
- Promotion would require an explicit later owner approval and versioned GitHub methodology / role / schema / MILESTONE changes.

**Status: EXPERIMENTAL NOTE ONLY / NO CANONICAL CHANGES**
