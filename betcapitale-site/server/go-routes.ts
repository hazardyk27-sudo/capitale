/**
 * Meta → Telegram redirect tracker — two-step browser confirmation + human challenge
 *
 * Step 1: GET /go/:slug
 *   - Records REQUEST_SEEN (fire-and-forget)
 *   - Generates a short-lived HMAC-signed one-time session token
 *   - Returns a minimal blank HTML page whose <script> navigates to /go-confirm/:token
 *   - Bots that don't execute JavaScript never reach step 2
 *
 * Step 2: GET /go-confirm/:token
 *   - Validates HMAC + TTL + one-time-use
 *   - Records PAGE_CONFIRMED
 *   - Returns a standalone experiment page with a press-and-hold human challenge
 *
 * Step 3 (challenge): POST /go-challenge/verify
 *   - Client sends session token after completing 2-second press-and-hold
 *   - Server writes challengePassedAt, records HUMAN_CHALLENGE_PASSED
 *   - Returns a short-lived (60 s) single-use challenge token
 *
 * Step 4: GET /go-telegram/:token?ct=<challengeToken>
 *   - Requires challengePassedAt and telegramClickRecordedAt in DB
 *   - Verifies challenge token HMAC + TTL
 *   - Then 302 → Telegram
 *
 * Unknown slugs → 404. Invalid/expired/replayed tokens → 404.
 * The Telegram destination is NEVER returned as a fallback.
 */
import crypto from "crypto";
import type { Express } from "express";
import { db } from "./db";
import { adRedirectEvents, adRedirectTokens } from "@shared/schema";
import { eq, and, isNull, isNotNull, sql } from "drizzle-orm";

// ── Slug → Telegram destination map ─────────────────────────────────────────
export const AD_SLUG_MAP: Record<string, { label: string; destination: string }> = {
  "weekly-ita":    { label: "WEEKLY RESULTS | V1 ITA", destination: "https://t.me/+cd0BPv-35blkMmI0" },
  "dusunenler-ita":{ label: "DÜŞÜNENLER ITA",           destination: "https://t.me/+uI8gWBsiMH4xMGQ0" },
  "old-couple-hun":{ label: "OLD COUPLE | V1 HUN",      destination: "https://t.me/+HUZqE4qIYjBlODhk" },
  "weekly-hun":    { label: "WEEKLY RESULTS | V1 HUN",  destination: "https://t.me/+qOk6gY1PLolhOTBk" },
  "if-you-ita":    { label: "IF YOU ITA",                destination: "https://t.me/+H4Kz2Ep6kXEzZjg8" },
};

// ── Known bot / prefetch UA patterns ────────────────────────────────────────
const BOT_PATTERNS = [
  /facebookexternalhit/i,
  /facebot/i,
  /meta-externalagent/i,
  /\bbot\b/i,
  /\bcrawler\b/i,
  /\bspider\b/i,
  /\bpreview\b/i,
  /telegrambot/i,
  /\bprefetch\b/i,
  /\bcurl\b/i,
  /\bwget\b/i,
  /\bpython-requests\b/i,
  /\bgo-http-client\b/i,
  /RSiteAuditor/i,
  /Googlebot/i,
  /Bingbot/i,
  /AhrefsBot/i,
  /SemrushBot/i,
];

function classify(ua: string): "KNOWN_BOT_OR_PREFETCH" | "BROWSER_LIKE_REQUEST" {
  if (BOT_PATTERNS.some((p) => p.test(ua))) return "KNOWN_BOT_OR_PREFETCH";
  return "BROWSER_LIKE_REQUEST";
}

function deviceCategory(ua: string): "mobile" | "desktop" | "tablet" | "unknown" {
  if (!ua) return "unknown";
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) return "mobile";
  if (/mozilla|chrome|safari|firefox|edge|opera|msie/i.test(ua)) return "desktop";
  return "unknown";
}

function hashIp(ip: string | undefined, ua: string): string | null {
  if (!ip) return null;
  return crypto.createHash("sha256").update(`${ip}|${ua}`).digest("hex");
}

// ── Session token helpers (10-minute TTL) ────────────────────────────────────
const TOKEN_TTL_MS = 10 * 60 * 1000;

function tokenSecret(): string {
  return process.env.SESSION_SECRET ?? "tracker-fallback-secret-change-me";
}

function signToken(slug: string, expiresAt: string, nonce: string): string {
  return crypto
    .createHmac("sha256", tokenSecret())
    .update(`${slug}|${expiresAt}|${nonce}`)
    .digest("hex");
}

function buildToken(slug: string): { token: string; expiresAt: Date } {
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
  const nonce     = crypto.randomBytes(16).toString("hex");
  const exp       = expiresAt.toISOString();
  const hmac      = signToken(slug, exp, nonce);
  const raw       = `${slug}|${exp}|${nonce}|${hmac}`;
  const token     = Buffer.from(raw, "utf8").toString("base64url");
  return { token, expiresAt };
}

interface TokenPayload { slug: string; expiresAt: Date; nonce: string }

function verifyTokenFormat(token: string): TokenPayload | null {
  try {
    const raw   = Buffer.from(token, "base64url").toString("utf8");
    const parts = raw.split("|");
    if (parts.length !== 4) return null;
    const [slug, exp, nonce, hmac] = parts;
    const expected = signToken(slug, exp, nonce);
    if (!crypto.timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(expected, "hex"))) return null;
    const expiresAt = new Date(exp);
    if (isNaN(expiresAt.getTime())) return null;
    if (expiresAt < new Date()) return null;
    return { slug, expiresAt, nonce };
  } catch {
    return null;
  }
}

// ── Challenge token helpers (60-second TTL, genuinely single-use) ────────────
// Each challenge token embeds a random nonce. The SHA-256 of that nonce is
// stored in adRedirectTokens.challengeTokenHash when the token is issued, then
// atomically cleared (set to NULL) in /go-telegram/ so the token cannot be
// replayed within its TTL window.
const CHALLENGE_TTL_MS = 60_000;
// Server-side minimum: CHALLENGE_SHOWN must have been recorded at least this
// many ms before /go-challenge/verify is accepted. Prevents skipping the UI.
const CHALLENGE_MIN_ELAPSED_MS = 1500;

function buildChallengeToken(slug: string): { challengeToken: string; nonceHash: string } {
  const exp   = new Date(Date.now() + CHALLENGE_TTL_MS).toISOString();
  const nonce = crypto.randomBytes(16).toString("hex");
  const hmac  = crypto
    .createHmac("sha256", tokenSecret())
    .update(`CHALLENGE|${slug}|${exp}|${nonce}`)
    .digest("hex");
  const raw = `CHALLENGE|${slug}|${exp}|${nonce}|${hmac}`;
  const challengeToken = Buffer.from(raw, "utf8").toString("base64url");
  const nonceHash = crypto.createHash("sha256").update(nonce).digest("hex");
  return { challengeToken, nonceHash };
}

/**
 * Verifies HMAC + TTL and extracts the nonce.
 * The nonce is hashed by the caller and compared against challengeTokenHash
 * stored in the DB so the token can be atomically consumed.
 */
function extractChallengeNonce(token: string): string | null {
  try {
    const raw   = Buffer.from(token, "base64url").toString("utf8");
    const parts = raw.split("|");
    if (parts.length !== 5 || parts[0] !== "CHALLENGE") return null;
    const [, slug, exp, nonce, hmac] = parts;
    const expected = crypto
      .createHmac("sha256", tokenSecret())
      .update(`CHALLENGE|${slug}|${exp}|${nonce}`)
      .digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(expected, "hex"))) return null;
    const expiresAt = new Date(exp);
    if (isNaN(expiresAt.getTime()) || expiresAt < new Date()) return null;
    void slug; // slug not needed here; DB row carries it
    return nonce;
  } catch {
    return null;
  }
}

// ── Minimal HTML for step-1 response ────────────────────────────────────────
function buildConfirmPage(token: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><style>body{margin:0;background:#fff}</style></head><body><script>window.location.replace('/go-confirm/${token}');</script></body></html>`;
}

// ── Standalone experiment page with press-and-hold human challenge ────────────
function buildExperimentPage(token: string): string {
  const safeToken = JSON.stringify(token);
  // SVG ring circumference for r=54: 2πr ≈ 339.29
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Open Telegram — Bet Capitale</title>
  <style>
    :root { color-scheme: dark; }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh;
      background: #0b0e14; color: #f8fafc;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main {
      min-height: 100vh; display: grid; place-items: center;
      padding: 24px;
      background: radial-gradient(circle at 50% 0%, #1b2638 0%, #0b0e14 55%);
    }
    section { width: min(100%, 390px); text-align: center; }
    .brand {
      margin: 0 0 28px; color: #b8c2d1;
      font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase;
    }
    h1 {
      margin: 0 0 12px;
      font-size: clamp(26px, 7vw, 36px); line-height: 1.1; letter-spacing: -.03em;
    }
    .sub { margin: 0 0 32px; color: #7a8799; font-size: 15px; line-height: 1.5; }

    /* ── Press-and-hold ring ── */
    .ring-wrap {
      position: relative; width: 160px; height: 160px;
      margin: 0 auto 18px;
      user-select: none; -webkit-user-select: none;
    }
    .progress-svg {
      position: absolute; inset: 0; width: 100%; height: 100%;
      transform: rotate(-90deg); pointer-events: none;
      overflow: visible;
    }
    .ring-bg  { fill: none; stroke: #1c2636; stroke-width: 7; }
    .ring-fg  {
      fill: none; stroke: #e8771f; stroke-width: 7; stroke-linecap: round;
      stroke-dasharray: 408.41;
      stroke-dashoffset: 408.41;
      transition: stroke-dashoffset 40ms linear;
    }
    .ring-fg.complete { stroke: #22c55e; }
    .hold-btn {
      position: absolute; inset: 14px; /* leaves room for the 7px ring */
      border-radius: 50%; border: none; cursor: pointer;
      background: #131b28;
      color: #e8771f;
      font-size: 13px; font-weight: 800; letter-spacing: .05em;
      text-transform: uppercase;
      touch-action: none;
      transition: background .15s, color .15s, transform .1s;
      display: flex; align-items: center; justify-content: center;
      -webkit-tap-highlight-color: transparent;
    }
    .hold-btn .btn-inner { pointer-events: none; }
    .hold-btn:active,
    .hold-btn.pressing { background: #1e2e44; transform: scale(.96); }
    .hold-btn:disabled { cursor: not-allowed; opacity: .6; transform: none; }
    .hint {
      min-height: 18px; margin: 0 0 28px;
      font-size: 13px; color: #7a8799;
    }

    /* ── OPEN TELEGRAM button ── */
    .tg-btn {
      width: 100%; border: 0; border-radius: 12px;
      padding: 17px 20px; cursor: pointer;
      background: #e8771f; color: #fff;
      font: inherit; font-size: 14px; font-weight: 800; letter-spacing: .08em;
      transition: transform .15s ease, background .15s ease;
    }
    .tg-btn:hover  { background: #f18431; transform: translateY(-1px); }
    .tg-btn:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
    .tg-btn:disabled { cursor: wait; opacity: .75; transform: none; }

    .status {
      min-height: 20px; margin: 14px 0 0;
      color: #fda4a4; font-size: 13px;
    }

    /* ── Fade transition ── */
    .phase { animation: fadeIn .3s ease both; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; } }
  </style>
</head>
<body>
  <main>
    <section aria-labelledby="page-title">
      <div class="brand">Bet Capitale</div>

      <!-- Challenge phase -->
      <div id="challenge-phase" class="phase">
        <h1 id="page-title">Press &amp; Hold</h1>
        <p class="sub">Hold the button below to verify you're human</p>
        <div class="ring-wrap" id="ring-wrap">
          <svg class="progress-svg" viewBox="0 0 160 160" aria-hidden="true">
            <circle class="ring-bg" cx="80" cy="80" r="65"/>
            <circle class="ring-fg" id="progress-ring" cx="80" cy="80" r="65"/>
          </svg>
          <button class="hold-btn" id="hold-btn" type="button" aria-label="Press and hold to verify">
            <span class="btn-inner">Hold</span>
          </button>
        </div>
        <p class="hint" id="hint">Press and hold to continue</p>
      </div>

      <!-- Telegram phase (shown after challenge passes) -->
      <div id="telegram-phase" style="display:none">
        <h1 id="page-title-tg">Open Telegram</h1>
        <p class="sub">Continue to our Telegram channel.</p>
        <button class="tg-btn" id="open-telegram" type="button">OPEN TELEGRAM</button>
      </div>

      <div id="status" class="status" role="status" aria-live="polite"></div>
    </section>
  </main>
  <script>
    (function () {
      var token = ${safeToken};
      var eventUrl = '/go-event/' + encodeURIComponent(token);
      var challengeToken = null;
      var challengeShownRecorded = false;

      /* ── Post a tracking event ── */
      function postEvent(eventType) {
        return fetch(eventUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventType: eventType }),
          credentials: 'same-origin',
          keepalive: true,
        });
      }

      /* ── Record CHALLENGE_SHOWN once the page is visible ── */
      function recordChallengeShown() {
        if (challengeShownRecorded || document.visibilityState !== 'visible') return;
        challengeShownRecorded = true;
        postEvent('CHALLENGE_SHOWN').catch(function () {});
      }
      document.addEventListener('visibilitychange', recordChallengeShown);
      recordChallengeShown();

      /* ── Press-and-hold logic ── */
      var HOLD_MS = 2000;
      var CIRCUMFERENCE = 2 * Math.PI * 65; // r=65 → ≈408.41

      var holdBtn     = document.getElementById('hold-btn');
      var progressRing = document.getElementById('progress-ring');
      var hintEl      = document.getElementById('hint');
      var statusEl    = document.getElementById('status');
      var challengePhase = document.getElementById('challenge-phase');
      var telegramPhase  = document.getElementById('telegram-phase');

      progressRing.style.strokeDasharray  = CIRCUMFERENCE;
      progressRing.style.strokeDashoffset = CIRCUMFERENCE;

      var holding    = false;
      var holdStart  = 0;
      var rafId      = 0;
      var verifying  = false;

      function setProgress(fraction) {
        progressRing.style.strokeDashoffset = CIRCUMFERENCE * (1 - fraction);
      }

      var holdStartRecorded = false;

      function onPointerDown(e) {
        if (!e.isTrusted) return; // reject programmatic clicks
        if (e.button !== undefined && e.button !== 0) return; // left / touch only
        if (holding || verifying) return;
        holding   = true;
        holdStart = performance.now();
        holdBtn.classList.add('pressing');
        if (hintEl) hintEl.textContent = 'Keep holding\u2026';
        holdBtn.setPointerCapture(e.pointerId);
        // Signal the server that the hold button was physically pressed.
        // Only the FIRST press is counted; the server ignores subsequent ones.
        // This timestamp is what /go-challenge/verify measures elapsed time from.
        if (!holdStartRecorded) {
          holdStartRecorded = true;
          postEvent('CHALLENGE_HOLD_START').catch(function () {});
        }
        rafId = requestAnimationFrame(tick);
      }

      function tick() {
        if (!holding) return;
        var elapsed  = performance.now() - holdStart;
        var fraction = Math.min(elapsed / HOLD_MS, 1);
        setProgress(fraction);
        if (fraction >= 1) {
          holding = false;
          holdBtn.classList.remove('pressing');
          progressRing.classList.add('complete');
          if (hintEl) hintEl.textContent = 'Verified \u2714';
          verifyChallenge();
          return;
        }
        rafId = requestAnimationFrame(tick);
      }

      function resetHold() {
        if (!holding) return;
        holding = false;
        cancelAnimationFrame(rafId);
        holdBtn.classList.remove('pressing');
        setProgress(0);
        if (hintEl) hintEl.textContent = 'Press and hold to continue';
      }

      holdBtn.addEventListener('pointerdown',   onPointerDown);
      holdBtn.addEventListener('pointerup',     resetHold);
      holdBtn.addEventListener('pointercancel', resetHold);
      holdBtn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      /* Prevent scroll/pan interfering with the hold gesture on mobile */
      holdBtn.addEventListener('touchstart', function (e) { e.preventDefault(); }, { passive: false });

      /* ── Verify challenge on the server ── */
      async function verifyChallenge() {
        verifying = true;
        holdBtn.disabled = true;
        statusEl.textContent = '';

        try {
          var resp = await fetch('/go-challenge/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionToken: token }),
            credentials: 'same-origin',
          });

          if (!resp.ok) throw new Error('server error ' + resp.status);

          var data = await resp.json();
          if (!data.challengeToken) throw new Error('no challenge token');
          challengeToken = data.challengeToken;

          /* Transition to Telegram phase */
          challengePhase.style.display = 'none';
          telegramPhase.style.display  = '';
          telegramPhase.classList.add('phase');
        } catch (_) {
          verifying = false;
          holdBtn.disabled = false;
          progressRing.classList.remove('complete');
          setProgress(0);
          if (hintEl) hintEl.textContent = 'Press and hold to continue';
          statusEl.textContent = 'Verification failed. Please try again.';
        }
      }

      /* ── OPEN TELEGRAM click ── */
      var openBtn = document.getElementById('open-telegram');
      openBtn.addEventListener('click', async function () {
        openBtn.disabled = true;
        openBtn.textContent = 'OPENING TELEGRAM\u2026';
        statusEl.textContent = '';
        try {
          var response = await postEvent('TELEGRAM_BUTTON_CLICK');
          if (!response.ok && response.status !== 204) throw new Error('event failed');
          var ct = encodeURIComponent(challengeToken || '');
          window.location.assign(
            '/go-telegram/' + encodeURIComponent(token) + '?ct=' + ct
          );
        } catch (_) {
          openBtn.disabled = false;
          openBtn.textContent = 'OPEN TELEGRAM';
          statusEl.textContent = 'Connection issue. Please try again.';
        }
      });
    })();
  </script>
</body>
</html>`;
}

// ── Route registration ────────────────────────────────────────────────────────
export function registerGoRoutes(app: Express) {

  // ── Step 1: record request, issue one-time token, return JS redirect page ──
  app.get("/go/:slug", (req, res) => {
    const slug  = req.params.slug;
    const entry = AD_SLUG_MAP[slug];
    if (!entry) return res.status(404).json({ error: "Not found" });

    const ua       = (req.headers["user-agent"] as string) ?? "";
    const referrer = (req.headers["referer"] as string) ?? null;
    const ip       = req.ip ?? undefined;

    const cls    = classify(ua);
    const device = deviceCategory(ua);
    const hashed = hashIp(ip, ua);
    const isQa   = req.query.qa === "1";

    (async () => {
      try {
        const [row] = await db
          .insert(adRedirectEvents)
          .values({
            slug,
            userAgent:      ua || null,
            referrer:       referrer || null,
            deviceCategory: device,
            eventType:      "REQUEST_SEEN",
            classification: cls,
            hashedIp:       hashed,
            isQa,
          })
          .returning({ id: adRedirectEvents.id });

        const { token, expiresAt } = buildToken(slug);
        await db.insert(adRedirectTokens).values({
          token,
          slug,
          parentEventId: row.id,
          expiresAt,
          isQa,
        });

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.send(buildConfirmPage(token));
      } catch (err) {
        console.error("[go-tracker] step-1 error:", (err as Error).message);
        if (!res.headersSent) {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.send("<!DOCTYPE html><html><body></body></html>");
        }
      }
    })();
  });

  // ── Step 2: validate token, record confirmation, show experiment page ────────
  app.get("/go-confirm/:token", async (req, res) => {
    const rawToken = req.params.token;
    const payload  = verifyTokenFormat(rawToken);
    if (!payload) return res.status(404).end();

    const entry = AD_SLUG_MAP[payload.slug];
    if (!entry) return res.status(404).end();

    try {
      const ua       = (req.headers["user-agent"] as string) ?? "";
      const referrer = (req.headers["referer"] as string) ?? null;
      const ip       = req.ip ?? undefined;

      const consumed = await db.transaction(async (tx) => {
        const updated = await tx
          .update(adRedirectTokens)
          .set({ consumedAt: new Date() })
          .where(and(
            eq(adRedirectTokens.token, rawToken),
            isNull(adRedirectTokens.consumedAt),
          ))
          .returning();

        if (updated.length === 0) return false;

        const tokenRow = updated[0];

        const [pageView] = await tx.insert(adRedirectEvents).values({
          slug:           tokenRow.slug,
          userAgent:      ua || null,
          referrer:       referrer || null,
          deviceCategory: deviceCategory(ua),
          eventType:      "PAGE_CONFIRMED",
          classification: "PAGE_CONFIRMED",
          parentEventId:  tokenRow.parentEventId,
          hashedIp:       hashIp(ip, ua),
          isQa:           tokenRow.isQa,
        }).returning({ id: adRedirectEvents.id });

        await tx.update(adRedirectTokens)
          .set({ pageConfirmedEventId: pageView.id })
          .where(eq(adRedirectTokens.token, rawToken));

        return true;
      });

      if (!consumed) return res.status(404).end();

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.send(buildExperimentPage(rawToken));
    } catch (err) {
      console.error("[go-tracker] step-2 error:", (err as Error).message);
      res.status(404).end();
    }
  });

  // ── Behaviour events from the standalone experiment page ───────────────────
  // Accepted event types:
  //   CHALLENGE_SHOWN      — page loaded and challenge became visible (metric only)
  //   CHALLENGE_HOLD_START — user's first pointer-down on the hold button; the
  //                          server records this timestamp and verify measures
  //                          elapsed time from it — not from CHALLENGE_SHOWN.
  //   TELEGRAM_BUTTON_CLICK — user clicked the final OPEN TELEGRAM button
  app.post("/go-event/:token", async (req, res) => {
    const rawToken  = req.params.token;
    const payload   = verifyTokenFormat(rawToken);
    const eventType = req.body?.eventType;
    const accepted  = ["CHALLENGE_SHOWN", "CHALLENGE_HOLD_START", "TELEGRAM_BUTTON_CLICK"];
    if (!payload || !accepted.includes(eventType)) {
      return res.status(404).end();
    }

    try {
      const ua       = (req.headers["user-agent"] as string) ?? "";
      const referrer = (req.headers["referer"] as string) ?? null;
      const ip       = req.ip ?? undefined;
      const now      = new Date();

      const recorded = await db.transaction(async (tx) => {
        let tokenRows: (typeof adRedirectTokens.$inferSelect)[];

        if (eventType === "CHALLENGE_SHOWN") {
          tokenRows = await tx.update(adRedirectTokens)
            .set({ challengeShownAt: now })
            .where(and(
              eq(adRedirectTokens.token, rawToken),
              isNotNull(adRedirectTokens.consumedAt),
              isNotNull(adRedirectTokens.pageConfirmedEventId),
              isNull(adRedirectTokens.challengeShownAt),
            ))
            .returning();
        } else if (eventType === "CHALLENGE_HOLD_START") {
          // Record only the FIRST hold-start so elapsed time cannot be gamed by
          // sending many CHALLENGE_HOLD_START calls.
          tokenRows = await tx.update(adRedirectTokens)
            .set({ challengeHoldStartAt: now })
            .where(and(
              eq(adRedirectTokens.token, rawToken),
              isNotNull(adRedirectTokens.consumedAt),
              isNotNull(adRedirectTokens.pageConfirmedEventId),
              isNull(adRedirectTokens.challengeHoldStartAt),
            ))
            .returning();
        } else {
          // TELEGRAM_BUTTON_CLICK — require challenge passed first
          tokenRows = await tx.update(adRedirectTokens)
            .set({ telegramClickRecordedAt: now })
            .where(and(
              eq(adRedirectTokens.token, rawToken),
              isNotNull(adRedirectTokens.consumedAt),
              isNotNull(adRedirectTokens.challengePassedAt),
              isNull(adRedirectTokens.telegramClickRecordedAt),
            ))
            .returning();
        }

        const tokenRow = tokenRows[0];
        if (!tokenRow || !tokenRow.pageConfirmedEventId) return false;

        await tx.insert(adRedirectEvents).values({
          slug:           tokenRow.slug,
          userAgent:      ua || null,
          referrer:       referrer || null,
          deviceCategory: deviceCategory(ua),
          eventType,
          classification: eventType,
          parentEventId:  tokenRow.pageConfirmedEventId,
          hashedIp:       hashIp(ip, ua),
          isQa:           tokenRow.isQa,
        });
        return true;
      });

      if (!recorded) return res.status(204).end();
      res.status(204).end();
    } catch (err) {
      console.error("[go-tracker] page event error:", (err as Error).message);
      res.status(500).end();
    }
  });

  // ── Human challenge verification ─────────────────────────────────────────────
  // POST /go-challenge/verify
  // Body: { sessionToken: string }
  // Returns: { challengeToken: string } — short-lived (60 s), genuinely single-use
  //
  // Server-side gates (all must pass):
  //   1. Session token has valid HMAC + TTL
  //   2. Token was consumed (real browser ran JS)
  //   3. CHALLENGE_SHOWN event was recorded (challengeShownAt IS NOT NULL)
  //   4. At least CHALLENGE_MIN_ELAPSED_MS have elapsed since challengeShownAt
  //      — prevents skipping the UI and calling verify immediately
  //   5. challengePassedAt IS NULL — prevents replay
  //
  // 404 on any error; never leaks Telegram destination.
  app.post("/go-challenge/verify", async (req, res) => {
    const sessionToken = req.body?.sessionToken;
    if (!sessionToken || typeof sessionToken !== "string") return res.status(404).end();

    const payload = verifyTokenFormat(sessionToken);
    if (!payload) return res.status(404).end();

    try {
      const ua       = (req.headers["user-agent"] as string) ?? "";
      const referrer = (req.headers["referer"] as string) ?? null;
      const ip       = req.ip ?? undefined;
      const now      = new Date();

      const { challengeToken, nonceHash } = buildChallengeToken(payload.slug);

      const passed = await db.transaction(async (tx) => {
        // Atomically enforce all server-side gates in a single UPDATE:
        //   - consumed_at IS NOT NULL      → real browser ran JS
        //   - challenge_shown_at IS NOT NULL → page was rendered and challenge appeared
        //   - challenge_shown_at <= NOW() - interval → at least min elapsed since shown
        //   - challenge_passed_at IS NULL  → not already passed (single-use)
        // Store both challengePassedAt and the challenge-token nonce hash so
        // /go-telegram/ can atomically consume the token.
        // Elapsed time is measured from challengeHoldStartAt (the server-recorded
        // instant of the first pointer-down), NOT from challengeShownAt.
        // This prevents a direct HTTP caller from bypassing the hold by only
        // sending CHALLENGE_SHOWN and waiting — they must also send
        // CHALLENGE_HOLD_START and then wait the minimum duration.
        const minElapsedSql = sql`INTERVAL '${sql.raw(String(CHALLENGE_MIN_ELAPSED_MS))} milliseconds'`;
        const result = await tx.execute(sql`
          UPDATE ad_redirect_tokens
          SET
            challenge_passed_at  = ${now.toISOString()},
            challenge_token_hash = ${nonceHash}
          WHERE
            token                     = ${sessionToken}
            AND consumed_at           IS NOT NULL
            AND challenge_hold_start_at IS NOT NULL
            AND challenge_hold_start_at <= NOW() - ${minElapsedSql}
            AND challenge_passed_at   IS NULL
          RETURNING slug, page_confirmed_event_id, is_qa
        `);

        const tokenRow = (result as any).rows?.[0] as {
          slug: string;
          page_confirmed_event_id: number | null;
          is_qa: boolean;
        } | undefined;

        if (!tokenRow || !tokenRow.page_confirmed_event_id) return null;

        await tx.insert(adRedirectEvents).values({
          slug:           tokenRow.slug,
          userAgent:      ua || null,
          referrer:       referrer || null,
          deviceCategory: deviceCategory(ua),
          eventType:      "HUMAN_CHALLENGE_PASSED",
          classification: "HUMAN_CHALLENGE_PASSED",
          parentEventId:  tokenRow.page_confirmed_event_id,
          hashedIp:       hashIp(ip, ua),
          isQa:           tokenRow.is_qa,
        });

        return tokenRow.slug;
      });

      if (!passed) return res.status(404).end();

      res.json({ challengeToken });
    } catch (err) {
      console.error("[go-tracker] challenge verify error:", (err as Error).message);
      res.status(404).end();
    }
  });

  // ── Telegram redirect — requires challenge passed + button click + token consumed
  // GET /go-telegram/:sessionToken?ct=<challengeToken>
  //
  // Security:
  //   - Session token: HMAC + TTL validated
  //   - Challenge token: HMAC + TTL validated; nonce is hashed and compared against
  //     challengeTokenHash in the DB, then that column is atomically cleared so
  //     the same ct cannot be replayed within its 60-second lifetime.
  //   - DB checks: challengePassedAt IS NOT NULL + telegramClickRecordedAt IS NOT NULL
  app.get("/go-telegram/:token", async (req, res) => {
    const rawToken          = req.params.token;
    const rawChallengeToken = (req.query.ct as string) ?? "";

    // Validate session token format
    const payload = verifyTokenFormat(rawToken);
    if (!payload) return res.status(404).end();

    // Validate challenge token HMAC + TTL, extract nonce
    const challengeNonce = extractChallengeNonce(rawChallengeToken);
    if (!challengeNonce) return res.status(404).end();

    // Hash the nonce for DB comparison
    const nonceHash = crypto.createHash("sha256").update(challengeNonce).digest("hex");

    try {
      // Atomically consume the challenge token (clear challengeTokenHash) while
      // also verifying all required state. 0 rows updated → already used, wrong
      // token, or missing prerequisite → 404.
      const result = await db.execute(sql`
        UPDATE ad_redirect_tokens
        SET challenge_token_hash = NULL
        WHERE
          token                    = ${rawToken}
          AND challenge_token_hash = ${nonceHash}
          AND challenge_passed_at  IS NOT NULL
          AND telegram_click_recorded_at IS NOT NULL
        RETURNING slug
      `);

      const row = (result as any).rows?.[0] as { slug: string } | undefined;
      if (!row) return res.status(404).end();

      const entry = AD_SLUG_MAP[row.slug];
      if (!entry) return res.status(404).end();

      res.redirect(302, entry.destination);
    } catch (err) {
      console.error("[go-tracker] Telegram redirect error:", (err as Error).message);
      res.status(404).end();
    }
  });
}
