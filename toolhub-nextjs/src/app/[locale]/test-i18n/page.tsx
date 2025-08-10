'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import Link from 'next/link';

export default function TestI18nPage() {
  const t = useTranslations();
  const locale = useLocale();

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
            
            <nav className="flex items-center space-x-6">
              <Link href={`/${locale}`} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                {t('common.home')}
              </Link>
              <div className="flex items-center space-x-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          다국어 테스트 페이지
        </h1>
        
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>현재 언어 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>현재 로케일:</strong> {locale}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>공통 메시지 테스트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>홈:</strong> {t('common.home')}</p>
              <p><strong>도구:</strong> {t('common.tools')}</p>
              <p><strong>문의하기:</strong> {t('common.contact')}</p>
              <p><strong>사이트맵:</strong> {t('common.sitemap')}</p>
              <p><strong>테마 변경:</strong> {t('common.toggleTheme')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>홈페이지 메시지 테스트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>제목:</strong> {t('home.title')}</p>
              <p><strong>설명:</strong> {t('home.description')}</p>
              <p><strong>히어로 제목:</strong> {t('home.hero.title')}</p>
              <p><strong>히어로 부제목:</strong> {t('home.hero.subtitle')}</p>
              <p><strong>CTA 버튼:</strong> {t('home.hero.cta')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>도구 메시지 테스트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>포모도로 타이머:</strong> {t('tools.pomodoro.name')}</p>
              <p><strong>MBTI 테스트:</strong> {t('tools.mbti.name')}</p>
              <p><strong>비밀번호 생성기:</strong> {t('tools.password-generator.name')}</p>
              <p><strong>단위 변환기:</strong> {t('tools.unit-converter.name')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>언어 변경 테스트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>아래 링크를 클릭하여 언어 변경을 테스트하세요:</p>
              <div className="space-x-4">
                <Link href="/ko/test-i18n">
                  <Button variant="outline">한국어</Button>
                </Link>
                <Link href="/en/test-i18n">
                  <Button variant="outline">English</Button>
                </Link>
                <Link href="/ja/test-i18n">
                  <Button variant="outline">日本語</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}