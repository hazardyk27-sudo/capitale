import type { Express, Request, RequestHandler, Response } from "express";
import { z } from "zod";

const allowedRoles = ["analyst", "news", "sxf"] as const;
const evidenceSchema = z.object({
  source_kind: z.string().trim().min(1).max(80),
  source_name: z.string().trim().max(240).nullable().optional(),
  source_uri: z.string().url().max(2048).nullable().optional(),
  published_at: z.string().datetime({ offset: true }).nullable().optional(),
  claim_text: z.string().trim().min(1).max(8000),
  reliability_score: z.number().min(0).max(1).nullable().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
}).strict();

const reportSchema = z.object({
  status: z.literal("complete"),
  as_of: z.string().datetime({ offset: true }),
  confidence: z.number().min(0).max(1).nullable().optional(),
  signal_score: z.number().min(-1).max(1).nullable().optional(),
  data_quality: z.number().min(0).max(1).nullable().optional(),
  source_count: z.number().int().min(0).max(10000),
  summary: z.string().max(12000).nullable().optional(),
  recommended_market: z.string().max(160).nullable().optional(),
  recommended_selection: z.string().max(240).nullable().optional(),
  payload: z.record(z.string(), z.unknown()),
  prompt_version: z.string().trim().min(1).max(80),
  model_name: z.string().trim().max(120).nullable().optional(),
  input_snapshot_hash: z.string().regex(/^[a-f0-9]{64}$/i),
}).strict();

export const agentWriteRequestSchema = z.object({
  run_id: z.string().uuid(),
  idempotency_key: z.string().regex(/^[A-Za-z0-9._:-]{16,128}$/),
  report: reportSchema,
  evidence: z.array(evidenceSchema).max(100).default([]),
}).strict();

type SupabaseConfig = { url: string; serviceKey: string };

function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.CAPITALE_SUPABASE_URL?.trim();
  const serviceKey = process.env.CAPITALE_SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey || !/^https:\/\//i.test(url)) return null;
  return { url: url.replace(/\/+$/, ""), serviceKey };
}

function bearerToken(req: Request): string | null {
  const value = req.get("authorization") ?? "";
  const match = /^Bearer ([A-Za-z0-9._~+/-]{32,512})$/i.exec(value);
  return match?.[1] ?? null;
}

async function rpc<T>(config: SupabaseConfig, name: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${config.url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: config.serviceKey,
      Authorization: `Bearer ${config.serviceKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Content-Profile": "public",
      "Accept-Profile": "public",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    // Never propagate PostgREST details: they can contain SQL and request context.
    throw new Error(`Supabase RPC failed (${response.status})`);
  }
  return await response.json() as T;
}

async function recordDenial(req: Request, reason: string, token: string | null): Promise<void> {
  const config = getSupabaseConfig();
  if (!config) return;
  try {
    await rpc(config, "capitale_record_agent_denial", {
      p_bearer_token: token,
      p_reason: reason,
      p_run_id: typeof req.body?.run_id === "string" ? req.body.run_id.slice(0, 80) : null,
    });
  } catch {
    // A denied request remains denied even if the audit service is temporarily unavailable.
  }
}

function sendSafeError(res: Response, status: number, code: string) {
  return res.status(status).json({ ok: false, error: code });
}

export function registerAgentReportRoutes(app: Express, requireAdmin: RequestHandler) {
  app.post("/api/capitale/agent-bridge/reports", async (req, res) => {
    const token = bearerToken(req);
    if (!token) {
      await recordDenial(req, "missing_or_invalid_bearer", null);
      return sendSafeError(res, 401, "unauthorized");
    }
    const config = getSupabaseConfig();
    if (!config) return sendSafeError(res, 503, "agent_bridge_not_configured");

    let bodyBytes = 0;
    try {
      bodyBytes = Buffer.byteLength(JSON.stringify(req.body ?? {}), "utf8");
    } catch {
      await recordDenial(req, "invalid_json_body", token);
      return sendSafeError(res, 400, "invalid_request");
    }
    if (bodyBytes > 512 * 1024) {
      await recordDenial(req, "request_too_large", token);
      return sendSafeError(res, 413, "request_too_large");
    }

    const parsed = agentWriteRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      const hasRoleOverride = Boolean(req.body && typeof req.body === "object"
        && ["role", "agent_role", "actor_role", "department"].some((key) => key in req.body));
      await recordDenial(req, hasRoleOverride ? "caller_role_rejected" : "invalid_report_schema", token);
      return sendSafeError(res, 400, hasRoleOverride ? "role_is_server_derived" : "invalid_request");
    }

    try {
      const result = await rpc<{ ok: boolean; error?: string; duplicate?: boolean; report_id?: string; report_version?: number; fixture_uid?: string; actor_role?: string }>(
        config,
        "capitale_submit_agent_report",
        {
          p_bearer_token: token,
          p_run_id: parsed.data.run_id,
          p_idempotency_key: parsed.data.idempotency_key,
          p_report: parsed.data.report,
          p_evidence: parsed.data.evidence,
        },
      );

      if (!result?.ok) {
        const status = result?.error === "unauthorized" ? 401
          : result?.error === "idempotency_conflict" ? 409
          : result?.error === "invalid_fixture" ? 404
          : 422;
        return sendSafeError(res, status, result?.error ?? "report_rejected");
      }
      return res.status(result.duplicate ? 200 : 201).json({
        ok: true,
        duplicate: result.duplicate === true,
        report_id: result.report_id,
        report_version: result.report_version,
        fixture_uid: result.fixture_uid,
        actor_role: result.actor_role,
      });
    } catch {
      return sendSafeError(res, 503, "report_store_unavailable");
    }
  });

  // The browser sends no secret: tokens are provisioned from server-only env vars.
  app.post("/api/admin/capitale/agent-bridge/provision", requireAdmin, async (_req, res) => {
    const config = getSupabaseConfig();
    if (!config) return sendSafeError(res, 503, "agent_bridge_not_configured");

    const tokens = {
      analyst: process.env.CAPITALE_AGENT_ANALYST_TOKEN?.trim() ?? "",
      news: process.env.CAPITALE_AGENT_NEWS_TOKEN?.trim() ?? "",
      sxf: process.env.CAPITALE_AGENT_SXF_TOKEN?.trim() ?? "",
    };
    if (Object.values(tokens).some((token) => token.length < 32)
        || new Set(Object.values(tokens)).size !== allowedRoles.length) {
      return sendSafeError(res, 503, "agent_tokens_missing_or_not_unique");
    }

    try {
      const result = await rpc<{ ok: boolean; error?: string; roles?: string[] }>(
        config,
        "capitale_provision_agent_tokens",
        { p_tokens: tokens },
      );
      if (!result?.ok) return sendSafeError(res, 422, result?.error ?? "token_provisioning_rejected");
      return res.json({ ok: true, configured_roles: result.roles ?? [] });
    } catch {
      return sendSafeError(res, 503, "token_provisioning_unavailable");
    }
  });

  // Run metadata is Admin-only and deliberately excludes free-form context.
  app.get("/api/admin/capitale/research-runs", requireAdmin, async (req, res) => {
    const config = getSupabaseConfig();
    if (!config) return sendSafeError(res, 503, "agent_bridge_not_configured");
    const limitValue = Number(req.query.limit ?? 50);
    const limit = Number.isInteger(limitValue) ? Math.max(1, Math.min(limitValue, 100)) : 50;
    try {
      const url = new URL(`${config.url}/rest/v1/research_runs`);
      url.searchParams.set("select", "id,fixture_uid,run_revision,status,target_markets,analysis_cutoff_at,requested_at,orchestrator_version");
      url.searchParams.set("order", "requested_at.desc");
      url.searchParams.set("limit", String(limit));
      const response = await fetch(url, {
        headers: { apikey: config.serviceKey, Authorization: `Bearer ${config.serviceKey}`, Accept: "application/json", "Accept-Profile": "capitale" },
        signal: AbortSignal.timeout(12_000),
      });
      if (!response.ok) throw new Error("Run query failed");
      return res.json({ ok: true, runs: await response.json() });
    } catch {
      return sendSafeError(res, 503, "research_runs_unavailable");
    }
  });
  // Full report and evidence payloads are visible only behind the app's DB-backed admin session.
  app.get("/api/admin/capitale/agent-reports/:runId", requireAdmin, async (req, res) => {
    const runId = z.string().uuid().safeParse(req.params.runId);
    const config = getSupabaseConfig();
    if (!runId.success) return sendSafeError(res, 400, "invalid_run_id");
    if (!config) return sendSafeError(res, 503, "agent_bridge_not_configured");

    try {
      const headers = {
        apikey: config.serviceKey,
        Authorization: `Bearer ${config.serviceKey}`,
        Accept: "application/json",
        "Accept-Profile": "capitale",
      };
      const reportUrl = new URL(`${config.url}/rest/v1/agent_reports`);
      reportUrl.searchParams.set("select", "*");
      reportUrl.searchParams.set("run_id", `eq.${runId.data}`);
      reportUrl.searchParams.set("order", "role.asc,report_version.desc");
      const reportResponse = await fetch(reportUrl, { headers, signal: AbortSignal.timeout(12_000) });
      if (!reportResponse.ok) throw new Error("Report query failed");
      const reports = await reportResponse.json() as Array<Record<string, unknown>>;
      const reportIds = reports.map((row) => row.id).filter((id): id is string =>
        typeof id === "string" && /^[0-9a-f-]{36}$/i.test(id));
      let evidence: Array<Record<string, unknown>> = [];

      if (reportIds.length) {
        const evidenceUrl = new URL(`${config.url}/rest/v1/evidence_items`);
        evidenceUrl.searchParams.set("select", "*");
        evidenceUrl.searchParams.set("report_id", `in.(${reportIds.join(",")})`);
        evidenceUrl.searchParams.set("order", "observed_at.asc");
        const evidenceResponse = await fetch(evidenceUrl, { headers, signal: AbortSignal.timeout(12_000) });
        if (!evidenceResponse.ok) throw new Error("Evidence query failed");
        evidence = await evidenceResponse.json() as Array<Record<string, unknown>>;
      }
      return res.json({ ok: true, run_id: runId.data, reports, evidence });
    } catch {
      return sendSafeError(res, 503, "report_read_unavailable");
    }
  });
}
