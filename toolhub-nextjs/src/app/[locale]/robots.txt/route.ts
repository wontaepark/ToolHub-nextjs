export async function GET(): Promise<Response> {
  const baseUrl = 'https://toolhub.tools';
  
  const robots = `# Robots.txt for ToolHub.tools
# Generated: ${new Date().toISOString()}

# Allow all bots
User-agent: *
Allow: /

# Google Bots
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Googlebot-Image
Allow: /
Crawl-delay: 0

User-agent: Googlebot-Video
Allow: /
Crawl-delay: 0

User-agent: Googlebot-News
Allow: /
Crawl-delay: 0

# AdSense and Ads Bots
User-agent: AdsBot-Google
Allow: /
Crawl-delay: 0

User-agent: AdsBot-Google-Mobile
Allow: /
Crawl-delay: 0

User-agent: Mediapartners-Google
Allow: /
Crawl-delay: 0

# Other Search Engines
User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: YandexBot
Allow: /
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /
Crawl-delay: 0

User-agent: Twitterbot
Allow: /
Crawl-delay: 0

# Block development and sensitive files
Disallow: /api/
Disallow: /_next/
Disallow: /node_modules/
Disallow: /.git/
Disallow: /.env*
Disallow: /package*.json
Disallow: /tsconfig*.json
Disallow: /next.config.*
Disallow: /tailwind.config.*
Disallow: /postcss.config.*

# Allow media files
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.png$
Allow: /*.gif$
Allow: /*.svg$
Allow: /*.webp$
Allow: /*.ico$
Allow: /*.css$
Allow: /*.js$

# AdSense and monetization paths
Allow: /pagead/
Allow: /doubleclick/
Allow: /googleads/
Allow: /googlesyndication/
Allow: /googletagmanager/
Allow: /analytics/

# Sitemap location
Sitemap: ${baseUrl}/ko/sitemap.xml
Sitemap: ${baseUrl}/en/sitemap.xml
Sitemap: ${baseUrl}/ja/sitemap.xml

# Host preference
Host: ${baseUrl}`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}