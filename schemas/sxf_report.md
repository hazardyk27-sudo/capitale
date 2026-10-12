# SXF Report Schema

Status: DRAFT
Version: 0.1

This schema is intentionally descriptive until SmartXFlow signal filters and thresholds are approved.

```yaml
role: SXF
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
prompt_version: <version>
methodology_version: sxf-draft

scope_check:
  smartxflow_only: true
  team_form_used: false
  current_news_used: false
  polymarket_used: false
  other_department_reports_used: false

flow_observations:
  - market: <market>
    selection: <selection>
    observed_at: <timestamp>
    money_size: <number|null>
    odds_before: <number|null>
    odds_after: <number|null>
    persistence: <description>
    reversal: <description>
    cross_market_context: <description>
    raw_alarm_label: <source label|null>

summary:
  descriptive_direction: <selection/market or NO_CLEAR_DIRECTION>
  confidence: <LOW|MEDIUM|HIGH>
  candidate_labels: []
  conflicts: []
  caveats: []
```

Numeric thresholds, label hierarchy, and final SXF signal grading remain non-canonical until approved.
