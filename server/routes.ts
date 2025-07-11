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
    'apache-httpclient'
  ];

  // 크롤러 봇 감지 함수 (완전한 SSR을 위해 매우 포괄적)
  const isBotRequest = (userAgent: string): boolean => {
    if (!userAgent) return true; // User-Agent가 없으면 봇으로 간주
    const ua = userAgent.toLowerCase();
    
    // 명시적 봇 목록
    const isKnownBot = botUserAgents.some(bot => ua.includes(bot));
    
    // 일반적인 봇 패턴 감지 (매우 포괄적)
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'fetch', 'curl', 'wget',
      'python-requests', 'node-fetch', 'axios', 'okhttp', 'httpclient',
      'java/', 'php/', 'ruby/', 'go-http-client', 'requests/',
      'urllib', 'apache-httpclient', 'jetty', 'reactor-netty',
      'mozilla/5.0 (compatible;', // 많은 봇들이 사용하는 패턴
      'headless', 'phantomjs', 'selenium', 'puppeteer', 'playwright',
      'postman', 'insomnia', 'test', 'monitor', 'check', 'validator',
      'lighthouse', 'pagespeed', 'gtmetrix', 'pingdom', 'uptime',
      'facebook', 'twitter', 'whatsapp', 'telegram', 'discord',
      'libwww', 'libcurl', 'winhttp', 'nsurlsession', 'urlsession'
    ];
    
    const hasGeneralBotPattern = botPatterns.some(pattern => ua.includes(pattern));
    
    // 의심스러운 패턴 (매우 짧은 User-Agent 등)
    const isSuspiciousPattern = ua.length < 15 || 
                               (!ua.includes('mozilla') && !ua.includes('webkit') && !ua.includes('chrome') && !ua.includes('safari') && !ua.includes('firefox'));
    
    // 일반적인 브라우저 패턴이 아닌 경우
    const isNotTypicalBrowser = !ua.includes('chrome') && !ua.includes('firefox') && !ua.includes('safari') && !ua.includes('edge') && !ua.includes('opera');
    
    return isKnownBot || hasGeneralBotPattern || isSuspiciousPattern || isNotTypicalBrowser;
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

  // 각 SSR 라우트에 대한 핸들러 등록 (완전한 SSR)
  ssrRoutes.forEach(route => {
    app.get(route, (req, res, next) => {
      const userAgent = req.get('User-Agent') || '';
      
      // 🔥 모든 봇과 의심스러운 요청에 완전한 SSR 제공
      if (isBotRequest(userAgent) || req.query.ssr === 'true') {
        const lang = req.query.lang as string || 'ko';
        const staticHTML = generateStaticHTML(route, lang);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // 1시간 캐시
        return res.send(staticHTML);
      }
      
      // 추가 안전장치: 일반 사용자도 의심스러운 패턴이면 SSR 제공
      const referer = req.get('Referer') || '';
      const acceptHeader = req.get('Accept') || '';
      const xForwardedFor = req.get('X-Forwarded-For') || '';
      
      // AdSense 검증 도구나 알려지지 않은 크롤러 감지
      const isSuspiciousRequest = 
        !referer || // 직접 접근
        !acceptHeader.includes('text/html') || // HTML 요청이 아님
        userAgent.length < 20 || // 매우 짧은 User-Agent
        !userAgent.includes('Mozilla') || // 브라우저 패턴 없음
        acceptHeader.includes('*/*') || // 모든 타입 허용 (봇의 특징)
        xForwardedFor.includes('bot') || // 프록시에서 봇 감지
        req.path.includes('bot') || // URL에 봇 관련 키워드
        req.query.bot; // 쿼리에 봇 파라미터
      
      if (isSuspiciousRequest) {
        const lang = req.query.lang as string || 'ko';
        const staticHTML = generateStaticHTML(route, lang);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=1800'); // 30분 캐시
        return res.send(staticHTML);
      }
      
      // 일반 사용자는 기본 처리로 넘김 (React 앱 제공)
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
