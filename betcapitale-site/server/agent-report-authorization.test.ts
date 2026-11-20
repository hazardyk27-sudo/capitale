import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import express from "express";
import { test } from "node:test";
import { agentWriteRequestSchema, registerAgentReportRoutes } from "./agent-report-routes";

const validRequest = () => ({
  run_id: "10000000-0000-4000-8000-000000000001",
  idempotency_key: "test-request-00000001",
  report: {
    status: "complete" as const,
    as_of: "2026-11-20T11:00:00.000Z",
    source_count: 1,
    payload: { summary: "isolated report" },
    prompt_version: "analyst-v2.1",
    input_snapshot_hash: "a".repeat(64),
  },
  evidence: [{
    source_kind: "official",
    claim_text: "A source-grounded fact",
    payload: {},
  }],
});

test("the writer contract accepts report data without an identity field", () => {
  for (const payload of [validRequest(), validRequest(), validRequest()]) {
    assert.equal(agentWriteRequestSchema.safeParse(payload).success, true);
  }
});

test("caller-supplied role and department overrides are rejected", () => {
  const topLevelRole = { ...validRequest(), role: "news" };
  const nestedRole = validRequest();
  (nestedRole.report as Record<string, unknown>).role = "news";
  const department = { ...validRequest(), department: "SXF" };

  assert.equal(agentWriteRequestSchema.safeParse(topLevelRole).success, false);
  assert.equal(agentWriteRequestSchema.safeParse(nestedRole).success, false);
  assert.equal(agentWriteRequestSchema.safeParse(department).success, false);
});

test("invalid run identifiers, non-complete reports, and malformed evidence are rejected", () => {
  const invalidRun = { ...validRequest(), run_id: "not-a-uuid" };
  const incomplete = validRequest();
  (incomplete.report as Record<string, unknown>).status = "pending";
  const badEvidence = validRequest();
  badEvidence.evidence.push({ source_kind: "", claim_text: "bad", payload: {} });

  assert.equal(agentWriteRequestSchema.safeParse(invalidRun).success, false);
  assert.equal(agentWriteRequestSchema.safeParse(incomplete).success, false);
  assert.equal(agentWriteRequestSchema.safeParse(badEvidence).success, false);
});

test("direct API calls without agent/admin credentials are denied", async (t) => {
  const app = express();
  app.use(express.json());
  registerAgentReportRoutes(app, (_req, res, next) => {
    if (_req.header("x-test-admin") === "yes") return next();
    return res.status(401).json({ error: "admin_required" });
  });
  const server = createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => { server.close(); });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const root = `http://127.0.0.1:${address.port}`;

  const write = await fetch(`${root}/api/capitale/agent-bridge/reports`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(validRequest()),
  });
  assert.equal(write.status, 401);
  assert.deepEqual(await write.json(), { ok: false, error: "unauthorized" });

  const adminRead = await fetch(`${root}/api/admin/capitale/agent-reports/10000000-0000-4000-8000-000000000001`);
  assert.equal(adminRead.status, 401);
  const adminRuns = await fetch(`${root}/api/admin/capitale/research-runs`);
  assert.equal(adminRuns.status, 401);
  const authorizedButUnconfigured = await fetch(`${root}/api/admin/capitale/research-runs`, {
    headers: { "x-test-admin": "yes" },
  });
  assert.equal(authorizedButUnconfigured.status, 503);
});
