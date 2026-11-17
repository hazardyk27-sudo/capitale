import type { Express } from "express";
import { storage } from "./storage";
import { CURRENT_TERMS_VERSION, CURRENT_TERMS_EFFECTIVE_DATE } from "@shared/terms";

// Shared helper — used by whop-routes.ts to gate checkout on terms acceptance
// (defense-in-depth: the client also redirects to /terms before ever reaching
// checkout, but the server never trusts that alone).
export async function hasAcceptedCurrentTerms(userId: number): Promise<boolean> {
  return storage.hasAcceptedTermsVersion(userId, CURRENT_TERMS_VERSION);
}

// Express's req.ip already resolves the real client IP correctly because
// "trust proxy" is configured in server/index.ts — do not re-parse
// X-Forwarded-For manually, a client can freely spoof extra hops in that header.
// Exported for reuse by any other endpoint that records terms acceptance (e.g. registration).
export function clientIp(req: any): string | null {
  return req.ip ?? null;
}

// Same-origin check for any endpoint that records consent — this is evidence of an
// affirmative user action, so a cross-site request forging it (CSRF) must be
// rejected even though SameSite=Lax cookies already block the common case.
// Exported for reuse by any other endpoint that records terms acceptance (e.g. registration).
export function isSameOriginRequest(req: any): boolean {
  const origin = req.headers["origin"] as string | undefined;
  const referer = req.headers["referer"] as string | undefined;
  const host = req.headers["host"] as string | undefined;
  if (!host) return false;
  const candidate = origin || referer;
  if (!candidate) return false; // no browser omits both on a same-origin fetch/form POST
  try {
    const candidateHost = new URL(candidate).host;
    return candidateHost === host;
  } catch {
    return false;
  }
}

export function registerTermsRoutes(app: Express) {
  // GET /api/terms/status — has the current user accepted the current version?
  app.get("/api/terms/status", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Not authenticated." });
    try {
      const accepted = await hasAcceptedCurrentTerms(req.session.userId);
      res.json({ accepted, version: CURRENT_TERMS_VERSION });
    } catch (err) {
      console.error("GET /api/terms/status error:", err);
      res.status(500).json({ error: "Durum kontrol edilirken bir hata oluştu." });
    }
  });

  // POST /api/terms/accept — records an append-only acceptance row.
  // Never updates/overwrites a previous acceptance; each call adds a new row.
  app.post("/api/terms/accept", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Kabul edebilmek için giriş yapmalısınız." });
    if (!isSameOriginRequest(req)) {
      return res.status(403).json({ error: "Geçersiz istek kaynağı." });
    }
    try {
      const { orderId } = (req.body ?? {}) as { orderId?: string };
      await storage.createTermsAcceptance({
        userId: req.session.userId,
        termsVersion: CURRENT_TERMS_VERSION,
        termsEffectiveDate: CURRENT_TERMS_EFFECTIVE_DATE,
        orderId: orderId && orderId.trim().length > 0 ? orderId.trim() : null,
        ipAddress: clientIp(req),
        userAgent: (req.headers["user-agent"] as string | undefined) ?? null,
      });
      res.json({ ok: true, version: CURRENT_TERMS_VERSION });
    } catch (err) {
      console.error("POST /api/terms/accept error:", err);
      res.status(500).json({ error: "Kabul kaydedilirken bir hata oluştu. Lütfen tekrar deneyin." });
    }
  });
}
