import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { runMigrations } from "./db";
import { reconcileAllActiveWhopMemberships } from "./whop-routes";
import path from "path";

const app = express();
const httpServer = createServer(app);

// Trust nginx reverse proxy (X-Forwarded-For, X-Forwarded-Proto)
app.set("trust proxy", 1);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Compress text responses (JS, CSS, JSON, HTML) before they reach the reverse proxy.
// Images such as the Promotion WebP are already compressed and are skipped by default.
app.use(compression());

app.use(
  express.json({
    limit: "10mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

const PgSession = connectPgSimple(session);
app.use(session({
  store: new PgSession({
    pool,
    tableName: "session",
    // createTableIfMissing is intentionally omitted — table is pre-created via migration.
    // connect-pg-simple reads a bundled table.sql that breaks in the compiled dist build.
  }),
  secret: process.env.SESSION_SECRET || "fallback-secret-change-me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // blocks the session cookie from being sent on cross-site POSTs (CSRF)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
  },
}));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await runMigrations();

  // Backup for missed/undelivered Whop webhooks (see reconcileAllActiveWhopMemberships
  // for why this exists): pull active memberships from Whop directly on a schedule so a
  // payment still activates even if its webhook never arrives. Runs shortly after boot,
  // then hourly.
  setTimeout(() => {
    reconcileAllActiveWhopMemberships().catch((err) => console.error("[whop-sync] startup reconciliation failed:", err));
  }, 30_000);
  setInterval(() => {
    reconcileAllActiveWhopMemberships().catch((err) => console.error("[whop-sync] scheduled reconciliation failed:", err));
  }, 60 * 60 * 1000);

  app.get("/logo.png", (_req, res) => {
    res.sendFile(path.resolve("attached_assets/bet-capitale-logo.png"));
  });

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
