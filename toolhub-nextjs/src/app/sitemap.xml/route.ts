import { getAllTools, getAllPages } from '@/lib/tools';

export const dynamic = 'force-static';

export async function GET(): Promise<Response> {
  const baseUrl = 'https://toolhub.tools';
  
  const tools = getAllTools();
  const pages = getAllPages();
  
  const urls = [];
  
  // 홈페이지
  urls.push({
    url: baseUrl,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 1.0
  });
  
  // 도구 페이지들
  tools.forEach(tool => {
    if (tool.isCompleted) {
      urls.push({
        url: `${baseUrl}/tools/${tool.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8
      });
    }
  });
  
  // 정보 페이지들
  pages.forEach(page => {
    urls.push({
      url: `${baseUrl}/${page.id}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6
    });
  });
  
  // XML 생성
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}