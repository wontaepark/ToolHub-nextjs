'use client';

import Head from 'next/head';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  schemaType?: 'WebApplication' | 'WebPage' | 'Tool';
  schemaData?: Record<string, unknown>;
}

export function Seo({
  title = "ToolHub.tools - 무료 웹 도구 모음",
  description = "포모도로 타이머, MBTI 테스트, 테토-에겐 테스트 등 일상과 업무에 필요한 웹 도구를 한 곳에 모은 무료 서비스입니다.",
  keywords = "웹 도구, 포모도로 타이머, MBTI 테스트, 테토-에겐 테스트, 무료 유틸리티, 온라인 도구",
  ogImage = "https://toolhub.tools/og-image.png",
  canonicalUrl = "https://toolhub.tools",
  schemaType = 'WebApplication',
  schemaData = {}
}: SeoProps) {
  // 기본 Schema.org 구조화된 데이터
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: title,
    description: description,
    url: canonicalUrl,
    ...(schemaType === 'WebApplication' && {
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web Browser',
      publisher: {
        '@type': 'Organization',
        name: 'Toolhub Team',
        url: 'https://toolhub.tools'
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      author: {
        '@type': 'Organization',
        name: 'Toolhub Team',
        url: 'https://toolhub.tools'
      }
    }),
    ...schemaData
  };

  return (
    <Head>
      {/* 기본 메타 태그 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Toolhub Team" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ToolHub.tools" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@toolhub" />
      
      {/* 구조화된 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(defaultSchema)
        }}
      />
    </Head>
  );
}

// 페이지별 SEO 프리셋
export const SeoPresets = {
  home: {
    title: "ToolHub.tools - 무료 웹 도구 모음",
    description: "포모도로 타이머, MBTI 테스트, 테토-에겐 테스트 등 일상과 업무에 필요한 웹 도구를 한 곳에서 무료로 제공합니다.",
    keywords: "웹 도구, 포모도로 타이머, MBTI 테스트, 테토-에겐 테스트, 무료 유틸리티, 온라인 도구, toolhub",
    canonicalUrl: "https://toolhub.tools",
    schemaType: 'WebApplication' as const
  },
  
  pomodoro: {
    title: "포모도로 타이머 - 집중력 향상을 위한 시간 관리 도구 | ToolHub.tools",
    description: "25분 집중 + 5분 휴식의 포모도로 기법으로 생산성을 높이세요. 커스터마이징 가능한 무료 온라인 포모도로 타이머입니다.",
    keywords: "포모도로 타이머, 뽀모도로, 집중력, 생산성, 시간관리, 온라인 타이머, 무료 타이머",
    canonicalUrl: "https://toolhub.tools/tools/pomodoro",
    schemaType: 'Tool' as const,
    schemaData: {
      applicationSubCategory: 'Productivity Timer',
      featureList: ['25분 작업 타이머', '5분 휴식 타이머', '커스터마이징', '알림 소리']
    }
  },
  
  mbti: {
    title: "MBTI 성격유형 테스트 - 나의 성격 유형 알아보기 | ToolHub.tools",
    description: "16가지 MBTI 성격유형 중 나는 어떤 타입일까요? 정확한 질문으로 구성된 무료 MBTI 테스트로 자신의 성격을 알아보세요.",
    keywords: "MBTI 테스트, 성격유형 테스트, 16가지 성격, 무료 MBTI, 성격 검사, 심리테스트",
    canonicalUrl: "https://toolhub.tools/tools/mbti",
    schemaType: 'Tool' as const,
    schemaData: {
      applicationSubCategory: 'Personality Test',
      featureList: ['16가지 성격유형', '정확한 결과', '상세한 분석', '소셜 공유']
    }
  },
  
  tetoEgen: {
    title: "테토-에겐 성격유형 테스트 - 나는 테토? 에겐? | ToolHub.tools",
    description: "화제의 테토-에겐 성격유형 테스트! 10개 질문으로 알아보는 나의 성향. 테토남, 테토녀, 에겐남, 에겐녀 중 어떤 타입인지 확인하세요.",
    keywords: "테토 에겐 테스트, 테토에겐, 성격테스트, 바이럴 테스트, 재미있는 테스트, 무료 심리테스트",
    canonicalUrl: "https://toolhub.tools/tools/teto-egen",
    schemaType: 'Tool' as const,
    schemaData: {
      applicationSubCategory: 'Personality Test',
      featureList: ['4가지 결과 유형', '궁합 분석', '소셜 공유', '바이럴 콘텐츠']
    }
  }
};