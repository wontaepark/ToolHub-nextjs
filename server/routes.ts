import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateStaticHTML } from "./ssr";
import { generateDynamicSitemap, generateHtmlSitemap } from "./sitemap";

export async function registerRoutes(app: Express): Promise<Server> {
  // SSR 라우트들 - Progressive Enhancement 방식으로 모든 요청에 기본 HTML 제공
  // 프로덕션 환경에서도 동일한 SSR 동작 보장

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
  // 프로덕션 환경에서 catch-all 라우트보다 우선 처리되도록 엄격한 매칭 사용
  ssrRoutes.forEach(route => {
    // 정확한 경로 매칭을 위한 정규표현식 사용
    const exactRoute = route === '/' ? /^\/$/ : new RegExp(`^${route}$`);
    
    app.get(exactRoute, (req, res) => {
      const lang = req.query.lang as string || 'ko';
      
      // 모든 요청에 기본 HTML 콘텐츠 제공 (Progressive Enhancement)
      // 프로덕션/개발 환경 구분 없이 동일한 SSR 처리
      const staticHTML = generateStaticHTML(route, lang);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5분 캐시
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

  // 프로덕션 환경 추가 보장: 마지막 fallback으로 홈페이지 SSR 제공
  // 다른 라우트에서 처리되지 않은 경우에만 실행됨
  app.get('*', (req, res, next) => {
    // 정적 파일 요청은 제외 (css, js, images 등)
    if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      return next();
    }
    
    // API 요청은 제외
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    // 다른 특수 경로들 제외
    if (req.path.match(/^\/(?:sitemap\.xml|sitemap-html|robots\.txt)$/)) {
      return next();
    }
    
    // 알려지지 않은 경로는 홈페이지로 리다이렉트하여 SSR 처리
    const lang = req.query.lang as string || 'ko';
    const staticHTML = generateStaticHTML('/', lang);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(staticHTML);
  });

  const httpServer = createServer(app);
  return httpServer;
}
