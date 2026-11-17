import { type Express } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { storage } from "./storage";
import { CURRENT_TERMS_VERSION, CURRENT_TERMS_EFFECTIVE_DATE } from "@shared/terms";
import { clientIp, isSameOriginRequest } from "./terms-routes";
import { reconcilePendingWhopGrants } from "./whop-routes";

function buildResetEmail(resetUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F2F5;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F2F5;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(14,23,38,0.10);">

      <!-- HEADER -->
      <tr>
        <td style="background:#0E1726;padding:32px 48px 28px;text-align:center;">
          <p style="margin:0;font-size:22px;font-weight:800;letter-spacing:0.12em;color:#FFFFFF;text-transform:uppercase;">BET <span style="color:#E8771F;">&#9650;</span> CAPITALE</p>
          <p style="margin:10px 0 0;color:#8A97A8;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">Smart Betting. Consistent Profits.</p>
        </td>
      </tr>

      <!-- ORANGE ACCENT BAR -->
      <tr><td style="height:4px;background:linear-gradient(90deg,#E8771F 0%,#F5A623 100%);"></td></tr>

      <!-- BODY -->
      <tr>
        <td style="padding:48px 48px 36px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#E8771F;">Password Reset</p>
          <h1 style="margin:0 0 20px;font-size:30px;font-weight:800;color:#0E1726;line-height:1.15;letter-spacing:-0.02em;">Reset your<br>password.</h1>
          <p style="margin:0 0 32px;font-size:15px;color:#5D6B7A;line-height:1.7;">
            We received a request to reset the password for your Bet Capitale account. Click the button below to choose a new password.<br><br>
            This link expires in <strong style="color:#0E1726;">1 hour</strong>. If you didn't request a reset, you can safely ignore this email.
          </p>

          <!-- CTA BUTTON -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
            <tr>
              <td style="background:#E8771F;border-radius:10px;box-shadow:0 4px 14px rgba(232,119,31,0.35);">
                <a href="${resetUrl}" style="display:inline-block;padding:16px 40px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;letter-spacing:0.01em;white-space:nowrap;">
                  Reset My Password &rarr;
                </a>
              </td>
            </tr>
          </table>

          <!-- DIVIDER -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="border-top:1px solid #E8EDF2;"></td>
            </tr>
          </table>

          <!-- FALLBACK LINK -->
          <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.7;">
            Button not working? Copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color:#E8771F;word-break:break-all;font-size:11px;">${resetUrl}</a>
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#0E1726;padding:24px 48px;text-align:center;">
          <p style="margin:0 0 6px;color:#8A97A8;font-size:11px;line-height:1.6;">
            &copy; 2026 Bet Capitale &nbsp;&middot;&nbsp; betcapitale.com
          </p>
          <p style="margin:0;color:#4A5568;font-size:10px;line-height:1.6;">
            You received this email because a password reset was requested for your Bet Capitale account.<br>
            If you didn't request this, you can safely ignore this email.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function buildVerificationEmail(verifyUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F2F5;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F2F5;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(14,23,38,0.10);">

      <!-- HEADER -->
      <tr>
        <td style="background:#0E1726;padding:32px 48px 28px;text-align:center;">
          <p style="margin:0;font-size:22px;font-weight:800;letter-spacing:0.12em;color:#FFFFFF;text-transform:uppercase;">BET <span style="color:#E8771F;">&#9650;</span> CAPITALE</p>
          <p style="margin:10px 0 0;color:#8A97A8;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">Smart Betting. Consistent Profits.</p>
        </td>
      </tr>

      <!-- ORANGE ACCENT BAR -->
      <tr><td style="height:4px;background:linear-gradient(90deg,#E8771F 0%,#F5A623 100%);"></td></tr>

      <!-- BODY -->
      <tr>
        <td style="padding:48px 48px 36px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#E8771F;">One last step</p>
          <h1 style="margin:0 0 20px;font-size:30px;font-weight:800;color:#0E1726;line-height:1.15;letter-spacing:-0.02em;">Confirm your<br>email address.</h1>
          <p style="margin:0 0 32px;font-size:15px;color:#5D6B7A;line-height:1.7;">
            You're almost in. Click the button below to verify your email and activate your Bet Capitale account.<br>
            This link expires in <strong style="color:#0E1726;">1 hour</strong>.
          </p>

          <!-- CTA BUTTON -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
            <tr>
              <td style="background:#E8771F;border-radius:10px;box-shadow:0 4px 14px rgba(232,119,31,0.35);">
                <a href="${verifyUrl}" style="display:inline-block;padding:16px 40px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;letter-spacing:0.01em;white-space:nowrap;">
                  Verify My Email &rarr;
                </a>
              </td>
            </tr>
          </table>

          <!-- DIVIDER -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="border-top:1px solid #E8EDF2;"></td>
            </tr>
          </table>

          <!-- SOCIAL PROOF -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr>
              <td style="background:#F7F9FB;border-radius:10px;border:1px solid #E4EAEE;padding:16px 20px;">
                <p style="margin:0;font-size:13px;color:#5D6B7A;line-height:1.6;">
                  <strong style="color:#0E1726;">Join 1,200+ members</strong> already tracking their bets with Bet Capitale — the platform built for disciplined, long-term profit.
                </p>
              </td>
            </tr>
          </table>

          <!-- FALLBACK LINK -->
          <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.7;">
            Button not working? Copy and paste this link into your browser:<br>
            <a href="${verifyUrl}" style="color:#E8771F;word-break:break-all;font-size:11px;">${verifyUrl}</a>
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#0E1726;padding:24px 48px;text-align:center;">
          <p style="margin:0 0 6px;color:#8A97A8;font-size:11px;line-height:1.6;">
            &copy; 2026 Bet Capitale &nbsp;&middot;&nbsp; betcapitale.com
          </p>
          <p style="margin:0;color:#4A5568;font-size:10px;line-height:1.6;">
            You received this email because you created an account at Bet Capitale.<br>
            If you didn't sign up, you can safely ignore this email.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const resend = new Resend(process.env.RESEND_API);

declare module "express-session" {
  interface SessionData {
    userId: number;
    userEmail: string;
  }
}

function getBaseUrl(req: Express["request"]): string {
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  const host  = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

/**
 * The Resend SDK does NOT throw on application-level send failures — it
 * resolves with `{ data, error }` even when the API rejected the request.
 * These helpers check that `error` field explicitly and throw, so a failed
 * send can never be mistaken for a successful one by the caller.
 */
async function sendVerificationEmail(email: string, verifyUrl: string): Promise<void> {
  const { error } = await resend.emails.send({
    from: "Bet Capitale <no-reply@betcapitale.com>",
    to: email,
    subject: "Confirm your email — Bet Capitale",
    html: buildVerificationEmail(verifyUrl),
  });
  if (error) {
    throw new Error(`Resend rejected verification email to ${email}: ${JSON.stringify(error)}`);
  }
}

async function sendResetEmail(email: string, resetUrl: string): Promise<void> {
  const { error } = await resend.emails.send({
    from: "Bet Capitale <no-reply@betcapitale.com>",
    to: email,
    subject: "Reset your password — Bet Capitale",
    html: buildResetEmail(resetUrl),
  });
  if (error) {
    throw new Error(`Resend rejected password-reset email to ${email}: ${JSON.stringify(error)}`);
  }
}

/**
 * Issues a fresh verification token for an existing user and (re)sends the
 * verification email. Used by the admin "resend verification" action for
 * accounts whose original email never actually arrived.
 */
export async function resendVerificationEmail(userId: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return { ok: false, error: "User not found." };
  if (user.emailVerified) return { ok: false, error: "This account is already verified." };

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiresAt    = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.update(users)
    .set({ verificationToken, tokenExpiresAt })
    .where(eq(users.id, user.id));

  const verifyUrl = `${getTrustedOrigin()}/email-verification?token=${verificationToken}`;

  try {
    await sendVerificationEmail(user.email, verifyUrl);
    return { ok: true };
  } catch (err) {
    console.error("Resend verification (admin-triggered) failed:", user.email, err);
    return { ok: false, error: "Failed to send the verification email. Please try again." };
  }
}

/**
 * Returns a trusted, server-controlled origin for constructing reset links.
 * Uses APP_URL env var (set this in production), or falls back to
 * https://betcapitale.com. Never uses client-supplied Host headers.
 */
function getTrustedOrigin(): string {
  return (process.env.APP_URL || "https://betcapitale.com").replace(/\/$/, "");
}

export function registerAuthRoutes(app: Express) {
  /* ── POST /api/auth/register ── */
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, termsAccepted } = req.body as { email?: string; password?: string; termsAccepted?: boolean };

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Please enter a valid email address." });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters." });
      }
      // Server-side enforcement mirrors the checkout terms gate: acceptance is
      // evidence of an affirmative user action, so it must never be trusted from
      // the client alone, and a cross-site request forging it must be rejected.
      if (termsAccepted !== true) {
        return res.status(400).json({ error: "You must agree to the Terms of Use, Membership and Service to create an account." });
      }
      if (!isSameOriginRequest(req)) {
        return res.status(403).json({ error: "Invalid request origin." });
      }

      const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
      if (existing.length > 0) {
        return res.status(409).json({ error: "An account with this email already exists." });
      }

      const passwordHash      = await bcrypt.hash(password, 12);
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const tokenExpiresAt    = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

      const [newUser] = await db.insert(users).values({
        email: email.toLowerCase(),
        passwordHash,
        emailVerified: false,
        verificationToken,
        tokenExpiresAt,
      }).returning();

      const verifyUrl = `${getBaseUrl(req)}/email-verification?token=${verificationToken}`;

      try {
        await sendVerificationEmail(email, verifyUrl);
      } catch (sendErr) {
        console.error("Register: verification email send failed, rolling back account:", email, sendErr);
        // The account row was already inserted, but the user will never be able to
        // verify it if the email never went out. Roll it back so they get an honest
        // error and can simply try registering again, instead of being stuck with
        // an unverifiable "zombie" account. No terms_acceptances row has been
        // written yet at this point, so there is no FK to clean up first.
        await db.delete(users).where(eq(users.email, email.toLowerCase()));
        return res.status(502).json({
          error: "We couldn't send your verification email right now. Please try registering again in a moment.",
        });
      }

      // Record the acceptance only once the account is confirmed durable
      // (verification email sent successfully) — mirrors the checkout gate's
      // append-only, server-recorded acceptance evidence.
      await storage.createTermsAcceptance({
        userId: newUser.id,
        termsVersion: CURRENT_TERMS_VERSION,
        termsEffectiveDate: CURRENT_TERMS_EFFECTIVE_DATE,
        orderId: null,
        ipAddress: clientIp(req),
        userAgent: (req.headers["user-agent"] as string | undefined) ?? null,
      });

      // If a Whop payment came in for this email before the account existed
      // (e.g. paid first, registered after), activate it now instead of leaving
      // the member stuck on "no active membership" until support intervenes.
      await reconcilePendingWhopGrants(newUser.id, newUser.email).catch((err: unknown) => {
        console.error("Register: reconcilePendingWhopGrants failed:", err);
      });

      return res.status(201).json({ message: "Registration successful. A verification link has been sent to your email." });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ error: "An error occurred during registration. Please try again." });
    }
  });

  /* ── GET /api/auth/verify-email?token=xxx ── */
  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.query as { token?: string };
      if (!token) return res.status(400).json({ error: "Verification token is required." });

      const [user] = await db.select().from(users).where(eq(users.verificationToken, token)).limit(1);

      if (!user) return res.status(400).json({ error: "Invalid or expired verification token." });
      if (user.tokenExpiresAt && user.tokenExpiresAt < new Date()) {
        return res.status(400).json({ error: "Verification link has expired. Please register again." });
      }

      await db.update(users)
        .set({ emailVerified: true, verificationToken: null, tokenExpiresAt: null })
        .where(eq(users.id, user.id));

      return res.json({ message: "Email verified successfully. You can now sign in." });
    } catch (err) {
      console.error("Verify email error:", err);
      return res.status(500).json({ error: "An error occurred during verification. Please try again." });
    }
  });

  /* ── POST /api/auth/login ── */
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string };
      if (!email || !password) return res.status(400).json({ error: "Email and password are required." });

      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
      if (!user) return res.status(401).json({ error: "Incorrect email or password." });

      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) return res.status(401).json({ error: "Incorrect email or password." });

      if (!user.emailVerified) {
        return res.status(403).json({ error: "Please verify your email address before signing in." });
      }

      req.session.userId    = user.id;
      req.session.userEmail = user.email;

      // Reconcile any Whop payment that arrived under this email before it could
      // be matched to this account (e.g. a mismatched checkout email since fixed).
      await reconcilePendingWhopGrants(user.id, user.email).catch((err: unknown) => {
        console.error("Login: reconcilePendingWhopGrants failed:", err);
      });
      const freshUser = await storage.getUser(user.id);

      return res.json({
        id: user.id,
        email: user.email,
        memberTier: freshUser?.memberTier ?? user.memberTier ?? null,
        membershipExpiresAt: freshUser?.membershipExpiresAt ?? user.membershipExpiresAt ?? null,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "An error occurred during sign in. Please try again." });
    }
  });

  /* ── POST /api/auth/logout ── */
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "You have been signed out." });
    });
  });

  /* ── GET /api/auth/me ── */
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Not authenticated." });
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      emailVerified: users.emailVerified,
      memberTier: users.memberTier,
      membershipExpiresAt: users.membershipExpiresAt,
    })
      .from(users).where(eq(users.id, req.session.userId)).limit(1);
    if (!user) return res.status(401).json({ error: "User not found." });
    return res.json(user);
  });

  /* ── POST /api/auth/forgot-password ── */
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body as { email?: string };
      if (!email) return res.status(400).json({ error: "Email is required." });

      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

      // Always return success to avoid user enumeration
      if (!user) {
        return res.json({ message: "If an account with that address exists, you'll receive a reset link shortly." });
      }

      // Store a hashed token in the DB; the raw token goes in the email link only
      const rawToken        = crypto.randomBytes(32).toString("hex");
      const hashedToken     = crypto.createHash("sha256").update(rawToken).digest("hex");
      const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.update(users)
        .set({ resetToken: hashedToken, resetTokenExpiresAt })
        .where(eq(users.id, user.id));

      // Build the link from a server-controlled trusted origin — never from request headers
      const resetUrl = `${getTrustedOrigin()}/reset-password?token=${rawToken}`;

      try {
        await sendResetEmail(user.email, resetUrl);
      } catch (sendErr) {
        // Log the failure distinctly so it's debuggable, but keep the generic
        // response below — revealing send failures here would leak which
        // addresses have an account (user enumeration).
        console.error("Forgot password: reset email send failed:", user.email, sendErr);
      }

      return res.json({ message: "If an account with that address exists, you'll receive a reset link shortly." });
    } catch (err) {
      console.error("Forgot password error:", err);
      return res.status(500).json({ error: "An error occurred. Please try again." });
    }
  });

  /* ── POST /api/auth/reset-password ── */
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body as { token?: string; newPassword?: string };
      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required." });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters." });
      }

      // Hash the incoming raw token and look it up — never store or compare raw tokens
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
      const [user] = await db.select().from(users).where(eq(users.resetToken, hashedToken)).limit(1);

      if (!user) return res.status(400).json({ error: "Invalid or expired reset link. Please request a new one." });
      if (user.resetTokenExpiresAt && user.resetTokenExpiresAt < new Date()) {
        return res.status(400).json({ error: "This reset link has expired. Please request a new one." });
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);
      // Clear the reset token and also mark email verified — presenting a valid
      // emailed token is sufficient proof of email ownership.
      await db.update(users)
        .set({
          passwordHash,
          resetToken: null,
          resetTokenExpiresAt: null,
          emailVerified: true,
        })
        .where(eq(users.id, user.id));

      return res.json({ message: "Password reset successfully. You can now sign in with your new password." });
    } catch (err) {
      console.error("Reset password error:", err);
      return res.status(500).json({ error: "An error occurred. Please try again." });
    }
  });

  /* ── POST /api/auth/update-email ── */
  app.post("/api/auth/update-email", async (req, res) => {
    try {
      if (!req.session.userId) return res.status(401).json({ error: "Not authenticated." });

      const { newEmail, currentPassword } = req.body as { newEmail?: string; currentPassword?: string };
      if (!newEmail || !currentPassword) {
        return res.status(400).json({ error: "New email and current password are required." });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        return res.status(400).json({ error: "Please enter a valid email address." });
      }

      const [user] = await db.select().from(users).where(eq(users.id, req.session.userId)).limit(1);
      if (!user) return res.status(401).json({ error: "User not found." });

      const match = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!match) return res.status(401).json({ error: "Current password is incorrect." });

      const normalizedEmail = newEmail.toLowerCase();
      if (normalizedEmail === user.email) {
        return res.status(400).json({ error: "This is already your current email address." });
      }

      const existing = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
      if (existing.length > 0) {
        return res.status(409).json({ error: "An account with this email already exists." });
      }

      // Whop links memberships to the email used at checkout. If we let an active
      // member change their email, future Whop webhooks (renewals/cancellations) for
      // their old address would silently stop matching this account.
      const activeTier = await storage.getUserMemberTier(user.id);
      if (activeTier) {
        return res.status(409).json({
          error: "You have an active membership linked to this email. Please contact support to change your email while your membership is active.",
        });
      }

      await db.update(users)
        .set({ email: normalizedEmail })
        .where(eq(users.id, user.id));

      req.session.userEmail = normalizedEmail;

      return res.json({ message: "Email address updated successfully.", email: normalizedEmail });
    } catch (err) {
      console.error("Update email error:", err);
      return res.status(500).json({ error: "An error occurred while updating your email. Please try again." });
    }
  });

  /* ── POST /api/auth/update-password ── */
  app.post("/api/auth/update-password", async (req, res) => {
    try {
      if (!req.session.userId) return res.status(401).json({ error: "Not authenticated." });

      const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current password and new password are required." });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: "New password must be at least 8 characters." });
      }

      const [user] = await db.select().from(users).where(eq(users.id, req.session.userId)).limit(1);
      if (!user) return res.status(401).json({ error: "User not found." });

      const match = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!match) return res.status(401).json({ error: "Current password is incorrect." });

      const newPasswordHash = await bcrypt.hash(newPassword, 12);
      await db.update(users)
        .set({ passwordHash: newPasswordHash })
        .where(eq(users.id, user.id));

      return res.json({ message: "Password updated successfully." });
    } catch (err) {
      console.error("Update password error:", err);
      return res.status(500).json({ error: "An error occurred while updating your password. Please try again." });
    }
  });
}
