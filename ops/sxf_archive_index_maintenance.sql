-- CAPITALE SXF archive index maintenance (manual, privileged DBA connection only)
-- CAUTION: These statements intentionally DO NOT run from GitHub's read-only archive role.
-- Run with psql AUTOCOMMIT ON, one statement at a time, off peak.
-- Never use the legacy Supabase SELECT-only export connection to create an index.
-- Existing local_date correlation verified 2026-10-24:
-- moneyway_1x2_history 0.999169; moneyway_btts_history 0.999937.
-- BRIN is compact for this physically date-ordered data.
-- NEVER run within BEGIN / COMMIT / Supabase migration transaction.
-- Supabase API SQL execution may impose a separate 60s request timeout;
-- if timed out, inspect pg_index.indisvalid and clean invalid index before retrying.
--
-- Step 1: in a privileged dedicated AUTOCOMMIT connection
SET statement_timeout = '20min';
SET lock_timeout = '30s';
CREATE INDEX CONCURRENTLY IF NOT EXISTS sxf_mw1x2_localdate_brin_idx
  ON research_archive.moneyway_1x2_history USING BRIN (local_date)
  WITH (pages_per_range = 32);
--
-- Step 2: only after step 1 finishes and is valid
CREATE INDEX CONCURRENTLY IF NOT EXISTS sxf_mwbtts_localdate_brin_idx
  ON research_archive.moneyway_btts_history USING BRIN (local_date)
  WITH (pages_per_range = 32);
--
-- Step 3: verify validity before any new export
SELECT ic.relname AS index_name, i.indisvalid, i.indisready,
       pg_size_pretty(pg_relation_size(i.indexrelid)) AS size,
       pg_get_indexdef(i.indexrelid) AS definition
FROM pg_index i
JOIN pg_class ic ON ic.oid = i.indexrelid
WHERE ic.relname IN ('sxf_mw1x2_localdate_brin_idx',
                     'sxf_mwbtts_localdate_brin_idx');
-- Both indexes must show indisvalid=true AND indisready=true.
--
-- If a concurrent build fails and leaves an invalid index, run from
-- a separate AUTOCOMMIT connection:
-- DROP INDEX CONCURRENTLY IF EXISTS research_archive.sxf_mw1x2_localdate_brin_idx;
-- DROP INDEX CONCURRENTLY IF EXISTS research_archive.sxf_mwbtts_localdate_brin_idx;
-- Then diagnose the timeout before attempting again. IF NOT EXISTS by itself
-- does not repair an invalid index.
