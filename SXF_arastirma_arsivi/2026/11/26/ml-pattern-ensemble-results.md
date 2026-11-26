# ML pattern ensemble — results
Protocol e5fe6a3c51c56704d086b2c8a45ab8c9af281a49. Same verified archive/live extract as prior study, cutoff 26 Nov 13:26 UTC. 6,284 normalized fixture identities; 5,787 development and 1,124 test market observations (not independent fixtures). Development 9 Oct–16 Nov inclusive, test 17–26 Nov partial. Oct12–17 invalid excluded. Historical holdout seen in earlier research, not prospective.
Research-only /tmp/sxf-pratik-research-U9pwcr/ml_libs: sklearn1.8.0 scipy1.17.0 lightgbm4.6.0 xgboost-cpu3.1.3 catboost1.2.10, pinned packages; no production dependency or rules changes. All four models completed. Inputs pre-T6 checkpoint trajectories T12–6, opposing selections, prior-date relative liquidity, synchronized cross-market observations, optional missing values. KNN median imputation + missing indicators + training-only standardization, k100. Fixed models, blends and ensemble. Raw archive contains checkpoint trajectories not all ticks.
## Pooled development validation Brier (lower is better)
Method | 1X2 | OU25 | BTTS
MARKET | .1867489 | .2396237 | .2503476
KNN | .1890649 | .2447218 | .2493760
KNN_BLEND | .1868541 | .2406532 | .2488381
LIGHTGBM | .1874218 | .2428301 | .2497176
LIGHTGBM_BLEND | .1866160 | .2402000 | .2479008
XGBOOST | .1876117 | .2439287 | .2497122
XGBOOST_BLEND | .1867345 | .2407113 | .2478685
CATBOOST | .1858735 | .2394450 | .2500806
CATBOOST_BLEND | .1860458 | .2391439 | .2493060
ENSEMBLE | .1867088 | .2414763 | .2480115
ENSEMBLE_BLEND | .1863666 | .2398633 | .2480508
Chosen primary models frozen before test: 1X2 CatBoost, OU25 CatBoost blend, BTTS XGBoost blend.
## Fixed test
1X2 548: Brier .1970207 -> .1977389; logloss .9897159 -> .9944405. Highest p among odds 1.4–2.1: 140/260=53.85%, avg1.731, ROI -8.30% both baseline/model. Positive edge subset 85/156=54.49%, avg1.732 ROI -8.18%. Prespecified secondary p>=.70 24/34=70.59%, avg1.46 ROI +3.68%; p>=.70 AND positive theoretical edge 24/33=72.73%, avg1.462 ROI +6.82%, predicted mean72.22%, Wilson 95% 55.78–84.93%. Baseline comparable rule 6/7=85.71%, avg1.421 ROI+22% (too small). This secondary test subset is not selected development precision policy and is not independent confirmation; cannot promote.
OU25 352: Brier .2417142 -> .2416941, logloss .6767439 -> .6765927. 180/316=56.96% avg1.726 ROI -2.07% vs 177/316=56.01%, avg1.721 ROI -4.14%. Positive edge 53/100=53% avg1.767 ROI -7.19%.
BTTS 224: Brier .2461012 -> .2464899, logloss .6850844 -> .6858302; 114/218=52.29%, avg1.746 ROI -9.89% vs 117/218=53.67%, avg1.737 ROI -7.62%. Positive edge 44/88=50%, avg1.802 ROI -11.78%. All daily improvement intervals include zero.
## Development-selected precision policy (frozen)
OU25 LightGBM p>=.65 and positive quote edge, 1.4–2.1. Nov1–8 41/62=66.13%, avg1.57 ROI+4.71%; Nov9–16 16/20=80%, avg1.517 ROI+18.95%. Combined 57/82=69.51%, avg1.557 ROI+8.18%, Wilson lower58.86%. Fixed test 23/42=54.76%, avg1.546 ROI -15.31%, predicted mean70.15%, market mean64.688%, Wilson 39.95–68.78%. Reject.
No robust market-beating performance demonstrated. No active changes. Scripts and full logs retained in /tmp/sxf-pratik-research-U9pwcr/ml_pattern_ensemble.{py,txt}. Odds are quote proxies not verified executable prices, ROI gross before fees; test subset selection and repeated research require genuinely future data before any promotion.