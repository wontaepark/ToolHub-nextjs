import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateStaticHTML } from "./ssr";

export async function registerRoutes(app: Express): Promise<Server> {
  // SSR 라우트들 - 크롤러 봇 감지 및 정적 HTML 제공
  const botUserAgents = [
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'sogou',
    'facebookexternalhit',
    'twitterbot',
    'rogerbot',
    'linkedinbot',
    'embedly',
    'quora link preview',
    'showyoubot',
    'outbrain',
    'pinterest/0.',
    'developers.google.com/+/web/snippet',
    'slackbot',
    'vkShare',
    'W3C_Validator',
    'redditbot',
    'applebot',
    'whatsapp',
    'flipboard',
    'tumblr',
    'bitlybot',
    'skypeuripreview',
    'nuzzel',
    'discordbot',
    'google page speed',
    'qwantify',
    'pinterestbot',
    'bitrix link preview',
    'xing-contenttabreceiver',
    'chrome-lighthouse',
    'telegrambot'
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
      
      // 크롤러 봇이거나 특정 조건일 때 SSR HTML 제공
      if (isBotRequest(userAgent) || req.query.ssr === 'true') {
        const lang = req.query.lang as string || 'ko';
        const staticHTML = generateStaticHTML(route, lang);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(staticHTML);
        return;
      }
      
      // 일반 사용자는 기본 Vite 처리로 넘김
      next();
    });
  });

  // Serve static files for SEO
  app.get('/sitemap.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile('sitemap.xml', { root: '.' });
  });

  app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile('robots.txt', { root: '.' });
  });

  const httpServer = createServer(app);
  return httpServer;
}
