-- CAPITALE SXF v3 concentrated checkpoint chunk. SQL SELECT ONLY.
-- Replace placeholders __DAY__ (ISO kickoff-local date), __LIMIT__, __OFFSET__.
-- Every fixture is crossed with 3 markets and T-{72,60,40,24,12,8,6,3,1}.
-- PRESENT is the last source row at or before the checkpoint; otherwise MISSING.
-- Rows after a checkpoint are NEVER used, and raw source tables are never modified.
WITH f AS MATERIALIZED (
  SELECT source_internal_id, fixture_uid, match_id_hash, kickoff_utc
  FROM research_archive.fixtures
  WHERE local_date = DATE '__DAY__'
  ORDER BY source_internal_id
  LIMIT __LIMIT__ OFFSET __OFFSET__
),
h0 AS (
  SELECT f.source_internal_id AS fid, '1X2'::text AS market,
         z.id::bigint AS sid,
         z.scraped_at::timestamptz AS observed_at,
         f.kickoff_utc,
         to_jsonb(z) AS payload,
         z.source_fingerprint,
         encode(digest(convert_to(to_jsonb(z)::text, 'UTF8'), 'sha256'), 'hex') AS source_row_sha256
    FROM research_archive.moneyway_1x2_history z
    JOIN f ON z.local_date = DATE '__DAY__'
          AND ((f.fixture_uid IS NOT NULL AND z.fixture_uid = f.fixture_uid)
            OR (z.fixture_uid IS NULL AND f.match_id_hash IS NOT NULL AND z.match_id_hash = f.match_id_hash))
          AND z.scraped_at::timestamptz <= f.kickoff_utc - interval '1 hour'
  UNION ALL
  SELECT f.source_internal_id AS fid, 'OU2.5'::text AS market,
         z.id::bigint AS sid,
         z.scraped_at::timestamptz AS observed_at,
         f.kickoff_utc,
         to_jsonb(z) AS payload,
         z.source_fingerprint,
         encode(digest(convert_to(to_jsonb(z)::text, 'UTF8'), 'sha256'), 'hex') AS source_row_sha256
    FROM research_archive.moneyway_ou25_history z
    JOIN f ON z.local_date = DATE '__DAY__'
          AND ((f.fixture_uid IS NOT NULL AND z.fixture_uid = f.fixture_uid)
            OR (z.fixture_uid IS NULL AND f.match_id_hash IS NOT NULL AND z.match_id_hash = f.match_id_hash))
          AND z.scraped_at::timestamptz <= f.kickoff_utc - interval '1 hour'
  UNION ALL
  SELECT f.source_internal_id AS fid, 'BTTS'::text AS market,
         z.id::bigint AS sid,
         z.scraped_at::timestamptz AS observed_at,
         f.kickoff_utc,
         to_jsonb(z) AS payload,
         z.source_fingerprint,
         encode(digest(convert_to(to_jsonb(z)::text, 'UTF8'), 'sha256'), 'hex') AS source_row_sha256
    FROM research_archive.moneyway_btts_history z
    JOIN f ON z.local_date = DATE '__DAY__'
          AND ((f.fixture_uid IS NOT NULL AND z.fixture_uid = f.fixture_uid)
            OR (z.fixture_uid IS NULL AND f.match_id_hash IS NOT NULL AND z.match_id_hash = f.match_id_hash))
          AND z.scraped_at::timestamptz <= f.kickoff_utc - interval '1 hour'
),
h AS MATERIALIZED (
  SELECT DISTINCT ON (fid, market, observed_at) *
  FROM h0 ORDER BY fid, market, observed_at, sid DESC
),
agg AS (
  SELECT fid, market,
    max(observed_at) FILTER (WHERE observed_at <= kickoff_utc - make_interval(hours => 72)) AS t72,
    max(observed_at) FILTER (WHERE observed_at <= kickoff_utc - make_interval(hours => 60)) AS t60,
    max(observed_at) FILTER (WHERE observed_at <= kickoff_utc - make_interval(hours => 40)) AS t40,
    max(observed_at) FILTER (WHERE observed_at <= kickoff_utc - make_interval(hours => 24)) AS t24,
    max(observed_at) FILTER (WHERE observed_at <= kickoff_utc - make_interval(hours => 12)) AS t12,
    max(observed_at) FILTER (WHERE observed_at <= kickoff_utc - make_interval(hours => 8)) AS t8,
    max(observed_at) FILTER (WHERE observed_at <= kickoff_utc - make_interval(hours => 6)) AS t6,
    max(observed_at) FILTER (WHERE observed_at <= kickoff_utc - make_interval(hours => 3)) AS t3,
    max(observed_at) FILTER (WHERE observed_at <= kickoff_utc - make_interval(hours => 1)) AS t1
  FROM h GROUP BY fid, market
),
t(hours) AS (VALUES (72),(60),(40),(24),(12),(8),(6),(3),(1)),
m(market, ord) AS (VALUES ('1X2',1),('OU2.5',2),('BTTS',3)),
grid AS (
  SELECT f.source_internal_id, f.fixture_uid, f.match_id_hash,
         f.kickoff_utc, m.market, m.ord, t.hours,
         f.kickoff_utc - make_interval(hours => t.hours) AS target_at,
         h.observed_at, h.source_fingerprint, h.payload, h.source_row_sha256
  FROM f CROSS JOIN m CROSS JOIN t
  LEFT JOIN agg ON agg.fid = f.source_internal_id AND agg.market = m.market
  LEFT JOIN h ON h.fid = f.source_internal_id AND h.market = m.market
             AND h.observed_at = CASE t.hours WHEN 72 THEN agg.t72
        WHEN 60 THEN agg.t60
        WHEN 40 THEN agg.t40
        WHEN 24 THEN agg.t24
        WHEN 12 THEN agg.t12
        WHEN 8 THEN agg.t8
        WHEN 6 THEN agg.t6
        WHEN 3 THEN agg.t3
        WHEN 1 THEN agg.t1 END
),
lines AS (
  SELECT source_internal_id, ord, hours, payload IS NOT NULL AS present,
         jsonb_build_object(
           'date_tr','__DAY__',
           'source_internal_id',source_internal_id,
           'fixture_uid',fixture_uid,
           'match_id_hash',match_id_hash,
           'kickoff_utc',kickoff_utc,
           'market',market,
           'checkpoint','T-'||hours,
           'target_at_utc',target_at,
           'status',CASE WHEN payload IS NULL THEN 'MISSING' ELSE 'PRESENT' END,
           'actual_snapshot_at_utc',observed_at,
           'source_fingerprint',source_fingerprint,
           'source_row_sha256',source_row_sha256,
           'source_payload',payload
         )::text AS jsonline
  FROM grid
),
x AS (
  SELECT count(*) AS n, count(*) FILTER (WHERE present) AS present,
         string_agg(jsonline, E'\n' ORDER BY source_internal_id, ord, hours DESC) || E'\n' AS jsonl
  FROM lines
)
SELECT n, present, octet_length(jsonl) AS bytes,
       encode(digest(convert_to(jsonl,'UTF8'),'sha256'),'hex') AS sha256_jsonl,
       jsonl
FROM x;
