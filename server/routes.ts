import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateStaticHTML } from "./ssr";
import { serveStatic } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // CRITICAL: Sitemap routes MUST be registered first
  app.get('/sitemap.xml', (req, res) => {
    const timestamp = Date.now();
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('ETag', `"${timestamp}"`);
    res.setHeader('Last-Modified', new Date().toUTCString());
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, notranslate, noimageindex');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated at ${timestamp} -->
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

  app.get('/sitemap-new.xml', (req, res) => {
    const timestamp = Date.now();
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('ETag', `"${timestamp}"`);
    res.setHeader('Last-Modified', new Date().toUTCString());
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, notranslate, noimageindex');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated at ${timestamp} -->
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

  // SSR 라우트들 - 크롤러 봇 감지 및 정적 HTML 제공
  const botUserAgents = [
    // Google 봇들 (AdSense 포함)
    'googlebot',
    'adsbot-google',
    'adsbot-google-mobile',
    'adsbot-google-mobile-apps',
    'googlebot-image',
    'googlebot-news',
    'googlebot-video',
    'google-site-verification',
    'chrome-lighthouse',
    'google page speed',
    'developers.google.com/+/web/snippet',
    
    // 기타 검색엔진 봇들
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'sogou',
    
    // 소셜 미디어 크롤러들
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'telegrambot',
    'discordbot',
    'slackbot',
    'skypeuripreview',
    
    // 콘텐츠 크롤러들
    'rogerbot',
    'embedly',
    'quora link preview',
    'showyoubot',
    'outbrain',
    'pinterest/0.',
    'pinterestbot',
    'flipboard',
    'tumblr',
    'bitlybot',
    'nuzzel',
    'redditbot',
    'applebot',
    'vkShare',
    'W3C_Validator',
    'bitrix link preview',
    'xing-contenttabreceiver'
  ];

  // 크롤러 봇 감지 함수
  const isBotRequest = (userAgent: string): boolean => {
    if (!userAgent) return false;
    const ua = userAgent.toLowerCase();
    return botUserAgents.some(bot => ua.includes(bot));
  };

  // SSR 라우트들
  const ssrRoutes = [
    '/',
    '/pomodoro',
    '/timer', 
    '/raffle',
    '/thumbnail',
    '/password',
    '/converter',
    '/date-calculator',
    '/mbti',
    '/teto-egen-test',
    '/sitemap',
    '/contact',
    '/privacy',
    '/terms'
  ];

  // 각 SSR 라우트에 대한 핸들러 등록
  ssrRoutes.forEach(route => {
    app.get(route, (req, res, next) => {
      const userAgent = req.get('User-Agent') || '';
      
      // 크롤러 봇이거나 특정 조건일 때만 SSR HTML 제공
      if (isBotRequest(userAgent) || req.query.ssr === 'true') {
        const lang = req.query.lang as string || 'ko';
        const staticHTML = generateStaticHTML(route, lang);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(staticHTML);
        return;
      }
      
      // 일반 사용자는 기본 처리로 넘김 (React 앱 제공)
      next();
    });
  });



  app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile('robots.txt', { root: '.' });
  });

  // Set up static file serving for development and production
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    // Development: serve static files from public directory
    app.use(express.static('public'));
  }

  const httpServer = createServer(app);
  return httpServer;
}
