import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateStaticHTML } from "./ssr";

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
    'xing-contenttabreceiver',
    
    // HTTP 클라이언트 및 도구들 (AdSense 검증 도구 포함)
    'python-requests',
    'requests',
    'curl',
    'wget',
    'postman',
    'insomnia',
    'httpclient',
    'http_request',
    'urlopen',
    'fetch',
    'axios',
    'node-fetch',
    'urllib',
    'libcurl',
    'okhttp',
    'apache-httpclient',
    
    // AI 도구들 및 web_fetch 도구
    'claude',
    'anthropic',
    'web_fetch',
    'web-fetch',
    'openai',
    'gpt',
    'chatgpt',
    'replit',
    'codesandbox',
    'codepen',
    'jsfiddle',
    'stackblitz'
  ];



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

  // 각 SSR 라우트에 대한 핸들러 등록 (완전한 SSR 우선 접근)
  ssrRoutes.forEach(route => {
    app.get(route, (req, res, next) => {
      const userAgent = req.get('User-Agent') || '';
      
      // 🔥 강력한 SSR 우선 접근: 명확한 브라우저가 아니면 모두 SSR 제공
      const isDefinitelyRealBrowser = (
        userAgent.includes('Chrome/') && 
        userAgent.includes('Mozilla/') && 
        userAgent.includes('Safari/') &&
        !userAgent.includes('compatible;') &&
        !userAgent.includes('bot') &&
        !userAgent.includes('crawler') &&
        !userAgent.includes('spider') &&
        userAgent.length > 50 &&
        req.get('Accept')?.includes('text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
      );
      
      // 명확한 브라우저가 아니면 모두 SSR 제공 (AdSense 승인 보장)
      if (!isDefinitelyRealBrowser || req.query.ssr === 'true') {
        const lang = req.query.lang as string || 'ko';
        const staticHTML = generateStaticHTML(route, lang);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // 1시간 캐시
        return res.send(staticHTML);
      }
      
      // 오직 명확한 브라우저만 React 앱 제공
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
