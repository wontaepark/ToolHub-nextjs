'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { 
  Clock, 
  Brain, 
  Key, 
  Calculator,
  Calendar,
  Youtube,
  Shuffle,
  ArrowRight,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';
import { getCompletedTools } from '@/lib/tools';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const tools = getCompletedTools();

  const toolIcons = {
    'pomodoro': Clock,
    'mbti': Brain,
    'password-generator': Key,
    'unit-converter': Calculator,
    'date-calculator': Calendar,
    'thumbnail-downloader': Youtube,
    'number-raffle': Shuffle,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                🛠️ ToolHub.tools
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href={`/${locale}`} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                {t('common.home')}
              </Link>
              <Link href={`/${locale}/contact`} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                {t('common.contact')}
              </Link>
              <Link href={`/${locale}/sitemap`} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                {t('common.sitemap')}
              </Link>
              <div className="flex items-center space-x-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </nav>
            
            <div className="md:hidden flex items-center space-x-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          {t('home.hero.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          {t('home.hero.subtitle')}
        </p>
        <Button size="lg" className="text-lg px-8 py-3" onClick={() => {
          document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          {t('home.hero.cta')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">10,000+</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{t('home.stats.users')}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">50,000+</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{t('home.stats.monthlyUsage')}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-8 w-8 text-yellow-500 mr-2" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">98%</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{t('home.stats.satisfaction')}</p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools-section" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          인기 도구들
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.slice(0, 6).map((tool) => {
            const IconComponent = toolIcons[tool.id as keyof typeof toolIcons] || Clock;
            return (
              <Card key={tool.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <Link href={`/${locale}/tools/${tool.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                          <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {t(`tools.${tool.id}.name`) || tool.name.ko}
                          </CardTitle>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {tool.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {t(`tools.${tool.id}.shortDesc`) || tool.description.ko}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href={`/${locale}/tools`}>
            <Button variant="outline" size="lg">
              모든 도구 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>{t('footer.copyright')}</p>
            <div className="mt-4 space-x-4">
              <Link href={`/${locale}/privacy`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t('common.privacy')}
              </Link>
              <Link href={`/${locale}/terms`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t('common.terms')}
              </Link>
              <Link href={`/${locale}/contact`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t('common.contact')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}