import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://toolhub.tools';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '*.json',
          '/test-*',
        ],
      },
      // Google 봇 특별 설정
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      // AdSense 봇 최적화
      {
        userAgent: [
          'AdsBot-Google',
          'AdsBot-Google-Mobile',
          'AdsBot-Google-Mobile-Apps',
        ],
        allow: '/',
        crawlDelay: 0,
      },
      // 기타 검색엔진 봇
      {
        userAgent: ['Bingbot', 'DuckDuckBot', 'Slurp'],
        allow: '/',
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}