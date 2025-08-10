import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';
import { getAllTools } from '@/lib/tools';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolhub.tools';
  const currentDate = new Date();
  
  const sitemap: MetadataRoute.Sitemap = [];

  // 각 언어별 홈페이지
  locales.forEach((locale) => {
    const url = locale === 'ko' ? baseUrl : `${baseUrl}/${locale}`;
    
    sitemap.push({
      url,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          ko: baseUrl,
          en: `${baseUrl}/en`,
          ja: `${baseUrl}/ja`,
        },
      },
    });
  });

  // 각 언어별 도구 페이지
  const tools = getAllTools();
  tools.forEach((tool) => {
    locales.forEach((locale) => {
      const url = locale === 'ko' 
        ? `${baseUrl}/tools/${tool.id}`
        : `${baseUrl}/${locale}/tools/${tool.id}`;
      
      sitemap.push({
        url,
        lastModified: currentDate,
        changeFrequency: tool.isCompleted ? 'weekly' : 'monthly',
        priority: tool.isCompleted ? 0.8 : 0.6,
        alternates: {
          languages: {
            ko: `${baseUrl}/tools/${tool.id}`,
            en: `${baseUrl}/en/tools/${tool.id}`,
            ja: `${baseUrl}/ja/tools/${tool.id}`,
          },
        },
      });
    });
  });

  // 각 언어별 정보 페이지
  const infoPages = ['sitemap', 'contact', 'test-i18n'];
  infoPages.forEach((page) => {
    locales.forEach((locale) => {
      const url = locale === 'ko' 
        ? `${baseUrl}/${page}`
        : `${baseUrl}/${locale}/${page}`;
      
      sitemap.push({
        url,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: page === 'sitemap' ? 0.7 : 0.5,
        alternates: {
          languages: {
            ko: `${baseUrl}/${page}`,
            en: `${baseUrl}/en/${page}`,
            ja: `${baseUrl}/ja/${page}`,
          },
        },
      });
    });
  });

  return sitemap;
}