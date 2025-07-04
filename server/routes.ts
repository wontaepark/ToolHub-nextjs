import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateStaticHTML } from "./ssr";
import { generateDynamicSitemap, generateHtmlSitemap } from "./sitemap";

export async function registerRoutes(app: Express): Promise<Server> {
  // SSR 라우트들 - Progressive Enhancement 방식으로 모든 요청에 기본 HTML 제공

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

  // 각 SSR 라우트에 대한 핸들러 등록 - Progressive Enhancement 방식
  ssrRoutes.forEach(route => {
    app.get(route, (req, res) => {
      const lang = req.query.lang as string || 'ko';
      
      // 모든 요청에 기본 HTML 콘텐츠 제공 (Progressive Enhancement)
      const staticHTML = generateStaticHTML(route, lang);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(staticHTML);
    });
  });

  // 동적 사이트맵 제공
  app.get('/sitemap.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    const dynamicSitemap = generateDynamicSitemap();
    res.send(dynamicSitemap);
  });

  // HTML 사이트맵 페이지 제공
  app.get('/sitemap-html', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const htmlSitemap = generateHtmlSitemap();
    res.send(htmlSitemap);
  });

  app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile('robots.txt', { root: '.' });
  });

  const httpServer = createServer(app);
  return httpServer;
}
