import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSEOMetadata } from '../lib/seoMetadata';

interface SEOHeadProps {
  toolId?: string;
  customTitle?: string;
  customDescription?: string;
}

export default function SEOHead({ toolId, customTitle, customDescription }: SEOHeadProps) {
  const { i18n } = useTranslation();
  const language = i18n.language || 'ko';
  
  useEffect(() => {
    const metadata = getSEOMetadata(toolId, language);
    
    // 제목 설정
    const title = customTitle || metadata.title;
    document.title = title;
    
    // 메타 태그 업데이트
    updateMetaTag('description', customDescription || metadata.description);
    updateMetaTag('keywords', metadata.keywords.join(', '));
    
    // Open Graph 메타 태그
    updateMetaProperty('og:title', metadata.ogTitle);
    updateMetaProperty('og:description', metadata.ogDescription);
    updateMetaProperty('og:url', metadata.canonical);
    updateMetaProperty('og:type', 'website');
    updateMetaProperty('og:site_name', 'ToolHub.tools');
    updateMetaProperty('og:locale', getOGLocale(language));
    
    if (metadata.ogImage) {
      updateMetaProperty('og:image', metadata.ogImage);
    }
    
    // Twitter Card 메타 태그
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', metadata.ogTitle);
    updateMetaName('twitter:description', metadata.ogDescription);
    updateMetaName('twitter:site', '@ToolHubTools');
    
    if (metadata.ogImage) {
      updateMetaName('twitter:image', metadata.ogImage);
    }
    
    // Canonical URL
    updateCanonicalLink(metadata.canonical);
    
    // Hreflang 링크
    updateHreflangLinks(metadata.hreflang);
    
    // 구조화된 데이터
    if (metadata.structuredData) {
      updateStructuredData(metadata.structuredData);
    }
    
    // 추가 SEO 메타 태그
    updateMetaName('robots', 'index, follow');
    updateMetaName('author', 'ToolHub.tools');
    updateMetaName('generator', 'ToolHub.tools');
    updateMetaProperty('article:publisher', 'https://toolhub.tools');
    
    // 모바일 최적화
    updateMetaName('viewport', 'width=device-width, initial-scale=1.0');
    updateMetaName('format-detection', 'telephone=no');
    
    // PWA 메타 태그
    updateMetaName('theme-color', '#3B82F6');
    updateMetaName('apple-mobile-web-app-capable', 'yes');
    updateMetaName('apple-mobile-web-app-status-bar-style', 'default');
    updateMetaName('apple-mobile-web-app-title', 'ToolHub.tools');
    
  }, [toolId, language, customTitle, customDescription]);

  return null; // 이 컴포넌트는 헤드 메타데이터만 업데이트하므로 렌더링할 것이 없음
}

// 유틸리티 함수들
function updateMetaTag(name: string, content: string): void {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaProperty(property: string, content: string): void {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaName(name: string, content: string): void {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateCanonicalLink(href: string): void {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

function updateHreflangLinks(hreflangData: Array<{ lang: string; href: string }>): void {
  // 기존 hreflang 링크 제거
  const existingHreflangLinks = document.querySelectorAll('link[rel="alternate"][hreflang]');
  existingHreflangLinks.forEach(link => link.remove());
  
  // 새 hreflang 링크 추가
  hreflangData.forEach(({ lang, href }) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang;
    link.href = href;
    document.head.appendChild(link);
  });
  
  // x-default 추가 (한국어를 기본으로)
  const defaultLink = document.createElement('link');
  defaultLink.rel = 'alternate';
  defaultLink.hreflang = 'x-default';
  defaultLink.href = hreflangData.find(item => item.lang === 'ko')?.href || hreflangData[0]?.href;
  document.head.appendChild(defaultLink);
}

function updateStructuredData(data: any): void {
  // 기존 구조화된 데이터 제거
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // 새 구조화된 데이터 추가
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function getOGLocale(language: string): string {
  const localeMap: Record<string, string> = {
    'ko': 'ko_KR',
    'en': 'en_US',
    'ja': 'ja_JP',
    'zh': 'zh_CN',
    'es': 'es_ES',
    'fr': 'fr_FR',
    'de': 'de_DE',
    'ru': 'ru_RU'
  };
  
  return localeMap[language] || 'ko_KR';
}

// 동적 sitemap.xml 생성을 위한 함수 (서버 사이드에서 사용)
export function generateSitemapXML(): string {
  const baseUrl = 'https://toolhub.tools';
  const languages = ['ko', 'en', 'ja', 'zh', 'es', 'fr', 'de', 'ru'];
  const tools = ['calculator', 'pomodoro', 'timer', 'raffle', 'thumbnail', 'password', 'converter', 'date-calculator', 'mbti', 'teto-egen-test'];
  const staticPages = ['', 'contact', 'privacy', 'terms', 'sitemap'];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  // 정적 페이지들
  staticPages.forEach(page => {
    const url = page ? `${baseUrl}/${page}` : baseUrl;
    xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>`;
    
    // hreflang 추가
    languages.forEach(lang => {
      const hrefUrl = page ? `${baseUrl}/${page}?lang=${lang}` : `${baseUrl}?lang=${lang}`;
      xml += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${hrefUrl}" />`;
    });
    
    xml += `
  </url>`;
  });

  // 도구 페이지들
  tools.forEach(tool => {
    const url = `${baseUrl}/${tool}`;
    xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>`;
    
    // hreflang 추가
    languages.forEach(lang => {
      const hrefUrl = `${baseUrl}/${tool}?lang=${lang}`;
      xml += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${hrefUrl}" />`;
    });
    
    xml += `
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
}

// robots.txt 생성 함수
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://toolhub.tools/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# High-traffic bots
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Block specific paths if needed
# Disallow: /api/
# Disallow: /admin/

# Allow common crawlers
User-agent: facebookexternalhit/*
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /`;
}