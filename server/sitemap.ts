import { toolsSearchData } from '../client/src/lib/searchData';

export interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function generateDynamicSitemap(): string {
  const baseUrl = 'https://toolhub.tools';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls: SitemapURL[] = [];
  
  // 홈페이지
  urls.push({
    loc: baseUrl,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 1.0
  });
  
  // 도구 페이지들 (동적 생성)
  toolsSearchData.forEach(tool => {
    urls.push({
      loc: `${baseUrl}${tool.path}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    });
  });
  
  // 정적 페이지들
  const staticPages = [
    { path: '/sitemap', priority: 0.7 },
    { path: '/contact', priority: 0.6 },
    { path: '/privacy', priority: 0.5 },
    { path: '/terms', priority: 0.5 }
  ];
  
  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: page.priority
    });
  });
  
  // 카테고리 페이지들 (향후 확장 가능)
  const categories = ['productivity', 'utility', 'multimedia', 'fun'];
  categories.forEach(category => {
    urls.push({
      loc: `${baseUrl}/category/${category}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.6
    });
  });
  
  // XML 생성
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  return xmlContent;
}

export function generateHtmlSitemap(): string {
  const tools = toolsSearchData.map(tool => ({
    path: tool.path,
    title: tool.title.ko,
    description: tool.description.ko,
    category: tool.category.ko
  }));
  
  // 카테고리별 그룹화
  const categorizedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);
  
  const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>사이트맵 - ToolHub.tools</title>
  <meta name="description" content="ToolHub.tools의 모든 도구와 페이지를 한눈에 확인할 수 있는 사이트맵입니다.">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background-color: #f9fafb; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; }
    .header { text-align: center; margin-bottom: 2rem; }
    .category { margin-bottom: 2rem; }
    .category h2 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; }
    .tool-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
    .tool-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 1rem; }
    .tool-card h3 { margin: 0 0 0.5rem 0; color: #1e40af; }
    .tool-card p { margin: 0; color: #64748b; font-size: 0.875rem; }
    .tool-card a { text-decoration: none; color: inherit; }
    .tool-card:hover { border-color: #3b82f6; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .stat-card { background: #3b82f6; color: white; padding: 1rem; border-radius: 6px; text-align: center; }
    .static-pages { margin-top: 2rem; }
    .static-pages h2 { color: #1f2937; }
    .static-pages ul { list-style: none; padding: 0; }
    .static-pages li { padding: 0.5rem 0; border-bottom: 1px solid #e2e8f0; }
    .static-pages a { color: #3b82f6; text-decoration: none; }
    .static-pages a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ToolHub.tools 사이트맵</h1>
      <p>모든 도구와 페이지를 한눈에 확인하세요</p>
    </div>
    
    <div class="stats">
      <div class="stat-card">
        <div style="font-size: 2rem; font-weight: bold;">${tools.length}</div>
        <div>총 도구 개수</div>
      </div>
      <div class="stat-card">
        <div style="font-size: 2rem; font-weight: bold;">${Object.keys(categorizedTools).length}</div>
        <div>카테고리 수</div>
      </div>
      <div class="stat-card">
        <div style="font-size: 2rem; font-weight: bold;">3</div>
        <div>지원 언어</div>
      </div>
    </div>
    
    ${Object.entries(categorizedTools).map(([category, categoryTools]) => `
    <div class="category">
      <h2>${category}</h2>
      <div class="tool-grid">
        ${categoryTools.map(tool => `
        <div class="tool-card">
          <a href="${tool.path}">
            <h3>${tool.title}</h3>
            <p>${tool.description}</p>
          </a>
        </div>
        `).join('')}
      </div>
    </div>
    `).join('')}
    
    <div class="static-pages">
      <h2>기타 페이지</h2>
      <ul>
        <li><a href="/">홈페이지</a> - 모든 도구의 시작점</li>
        <li><a href="/sitemap">사이트맵</a> - 현재 페이지</li>
        <li><a href="/contact">문의하기</a> - 의견 및 문의사항</li>
        <li><a href="/privacy">개인정보처리방침</a> - 개인정보 보호 정책</li>
        <li><a href="/terms">이용약관</a> - 서비스 이용 약관</li>
      </ul>
    </div>
    
    <div style="margin-top: 2rem; text-align: center; color: #64748b; font-size: 0.875rem;">
      <p>마지막 업데이트: ${new Date().toLocaleDateString('ko-KR')}</p>
      <p><a href="/" style="color: #3b82f6;">← 홈으로 돌아가기</a></p>
    </div>
  </div>
</body>
</html>`;
  
  return htmlContent;
}