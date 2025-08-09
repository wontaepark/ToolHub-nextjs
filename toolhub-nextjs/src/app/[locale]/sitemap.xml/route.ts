import { getAllTools, getAllPages } from '@/lib/tools';

export async function GET(): Promise<Response> {
  const baseUrl = 'https://toolhub.tools';
  const locales = ['ko', 'en', 'ja'];
  
  const tools = getAllTools();
  const pages = getAllPages();
  
  const urls = [];
  
  // 홈페이지
  locales.forEach(locale => {
    urls.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: locales.reduce((acc, lang) => {
          acc[lang] = `${baseUrl}/${lang}`;
          return acc;
        }, {} as Record<string, string>)
      }
    });
  });
  
  // 도구 페이지들
  tools.forEach(tool => {
    if (tool.isCompleted) {
      locales.forEach(locale => {
        urls.push({
          url: `${baseUrl}/${locale}/tools/${tool.id}`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: locales.reduce((acc, lang) => {
              acc[lang] = `${baseUrl}/${lang}/tools/${tool.id}`;
              return acc;
            }, {} as Record<string, string>)
          }
        });
      });
    }
  });
  
  // 정보 페이지들
  pages.forEach(page => {
    locales.forEach(locale => {
      urls.push({
        url: `${baseUrl}/${locale}/${page.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: locales.reduce((acc, lang) => {
            acc[lang] = `${baseUrl}/${lang}/${page.id}`;
            return acc;
          }, {} as Record<string, string>)
        }
      });
    });
  });
  
  // XML 생성
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>${Object.entries(url.alternates.languages).map(([lang, href]) => 
    `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`).join('')}
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}