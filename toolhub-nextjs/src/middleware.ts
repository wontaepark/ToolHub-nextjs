import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n';

export default createMiddleware({
  // 모든 지원 로케일 목록
  locales,
  
  // 기본 로케일 (prefix 없이 사용)
  defaultLocale,
  
  // 로케일 감지 설정
  localeDetection: true,
  
  // 로케일 prefix 설정 (기본값: as-needed)
  localePrefix: 'as-needed'
});

export const config = {
  // 국제화가 적용될 경로 매처
  matcher: [
    // 모든 경로에 적용하되 api, _next/static, _next/image, favicon.ico는 제외
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
};