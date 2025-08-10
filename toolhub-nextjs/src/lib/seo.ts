import { Metadata } from 'next';
import { locales, type Locale } from '@/lib/i18n';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  locale: Locale;
  ogImage?: string;
}

export function generateSEOMetadata(config: SEOConfig): Metadata {
  const { title, description, keywords, path = '', locale, ogImage } = config;
  
  const baseUrl = 'https://toolhub.tools';
  const canonicalUrl = `${baseUrl}${locale === 'ko' ? '' : '/' + locale}${path}`;
  
  // hreflang URLs
  const alternateLanguages: Record<string, string> = {};
  locales.forEach((loc) => {
    alternateLanguages[loc] = `${baseUrl}${loc === 'ko' ? '' : '/' + loc}${path}`;
  });
  alternateLanguages['x-default'] = `${baseUrl}/en${path}`;

  // 언어별 locale 코드
  const localeCode = locale === 'ko' ? 'ko_KR' : locale === 'en' ? 'en_US' : 'ja_JP';
  
  // OG 이미지 설정
  const ogImageUrl = ogImage || `/og/${locale}.png`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ToolHub.tools',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: localeCode,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'google-site-verification': 'your-verification-code-here',
    },
  };
}

// 도구별 메타데이터 생성 헬퍼
export function generateToolMetadata(
  toolId: string,
  locale: Locale,
  messages: any
): Metadata {
  const toolName = messages.tools?.[toolId]?.name || toolId;
  const toolDescription = messages.tools?.[toolId]?.description || '';
  
  const title = `${toolName} | ToolHub.tools`;
  const description = toolDescription || messages.tools?.[toolId]?.shortDesc || '';
  
  return generateSEOMetadata({
    title,
    description,
    path: `/tools/${toolId}`,
    locale,
    ogImage: `/og/tools/${toolId}-${locale}.png`,
  });
}

// 홈페이지 메타데이터 생성
export function generateHomeMetadata(locale: Locale, messages: any): Metadata {
  const title = messages.meta?.title || messages.home?.title || 'ToolHub.tools';
  const description = messages.meta?.description || messages.home?.description || '';
  const keywords = messages.meta?.keywords || '';

  return generateSEOMetadata({
    title,
    description,
    keywords,
    locale,
  });
}

// 구조화된 데이터 생성
export function generateStructuredData(config: {
  type: 'WebSite' | 'WebPage' | 'SoftwareApplication';
  name: string;
  description: string;
  url: string;
  locale: Locale;
  additionalData?: Record<string, any>;
}) {
  const { type, name, description, url, locale, additionalData = {} } = config;
  
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url,
    inLanguage: locale,
    ...additionalData,
  };

  if (type === 'WebSite') {
    return {
      ...baseStructuredData,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }

  return baseStructuredData;
}