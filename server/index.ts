import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// 301 리다이렉트 미들웨어 (www → non-www)
app.use((req, res, next) => {
  // www가 있으면 www 없는 도메인으로 리다이렉트
  if (req.headers.host === 'www.toolhub.tools') {
    return res.redirect(301, `https://toolhub.tools${req.url}`);
  }
  
  // HTTP로 접근하면 HTTPS로 리다이렉트 (프로덕션 환경에서만)
  if (req.headers['x-forwarded-proto'] !== 'https' && 
      req.headers.host !== 'localhost' && 
      !req.headers.host?.includes('replit.app') &&
      !req.headers.host?.includes('localhost:') &&
      process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CRITICAL: Force sitemap route BEFORE any other middleware
app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, notranslate, noimageindex');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>weekly</changefreq>
  <priority>1.0</priority>
</url>

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/pomodoro</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/password</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/mbti</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/teto-egen-test</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/timer</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/raffle</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/thumbnail</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/converter</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/date-calculator</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/sitemap</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/contact</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.6</priority>
</url>

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/privacy</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>yearly</changefreq>
  <priority>0.5</priority>
</url>

<url>
  <loc>https://tool-hub-central-wtpark10.replit.app/terms</loc>
  <lastmod>2025-07-12</lastmod>
  <changefreq>yearly</changefreq>
  <priority>0.5</priority>
</url>

</urlset>`;
  
  res.send(sitemap);
});

// Set proper encoding for Korean characters
app.use((req, res, next) => {
  req.setEncoding = req.setEncoding || (() => {});
  next();
});

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

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    // For production, we need to ensure SSR routes are handled before static files
    // The serveStatic function is called within registerRoutes for production
    // to maintain proper route precedence
  }

  // Use environment port for production deployment, fallback to 5000 for development
  const port = process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
