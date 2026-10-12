# FINAL Report Schema

Status: DRAFT
Version: 0.1

```yaml
role: FINAL
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
prompt_version: <version>
methodology_version: final-draft

input_reports:
  analyst:
    present: <true|false>
    version: <version>
    freshness_ok: <true|false>
  news:
    present: <true|false>
    version: <version>
    freshness_ok: <true|false>
  sxf:
    present: <true|false>
    version: <version>
    freshness_ok: <true|false>
  poly:
    present: <true|false>
    version: <version>
    freshness_ok: <true|false>

synthesis:
  analyst_view: <summary>
  news_view: <summary>
  sxf_view: <summary>
  poly_view: <summary>
  agreements: []
  conflicts: []
  duplicated_evidence_risks: []
  unresolved_uncertainties: []

final_decision:
  state: <BET|WATCH|NO_BET>
  market: <market|null>
  selection: <selection|null>
  confidence: <LOW|MEDIUM|HIGH>
  rationale: <report-only synthesis>
```

FINAL must not introduce new raw-source facts.

Exact weights, confidence mapping, conflict penalties, veto rules, and BET/WATCH/NO BET thresholds are intentionally left DRAFT until jointly approved and later calibrated by backtest.
