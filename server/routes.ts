import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateStaticHTML } from "./ssr";
import { serveStatic } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
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
