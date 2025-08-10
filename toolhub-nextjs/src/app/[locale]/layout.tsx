import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locale as Locale;
  
  const titles: Record<Locale, string> = {
    ko: 'ToolHub.tools - 무료 웹 도구 모음',
    en: 'ToolHub.tools - Free Web Tools Collection', 
    ja: 'ToolHub.tools - 無料ウェブツール集'
  };
  
  const descriptions: Record<Locale, string> = {
    ko: '포모도로 타이머, MBTI 테스트, 비밀번호 생성기 등 일상과 업무에 필요한 다양한 도구들을 무료로 제공합니다.',
    en: 'Free online tools including Pomodoro Timer, MBTI Test, Password Generator and more utilities for daily use and work.',
    ja: 'ポモドーロタイマー、MBTI診断、パスワード生成器など、日常や仕事に必要な様々なツールを無料で提供します。'
  };

  return {
    title: titles[validLocale],
    description: descriptions[validLocale],
    openGraph: {
      title: titles[validLocale],
      description: descriptions[validLocale],
      url: `https://toolhub.tools${validLocale === 'ko' ? '' : '/' + validLocale}`,
      locale: validLocale === 'ko' ? 'ko_KR' : validLocale === 'en' ? 'en_US' : 'ja_JP',
    },
    alternates: {
      canonical: `https://toolhub.tools${validLocale === 'ko' ? '' : '/' + validLocale}`,
      languages: {
        'ko': 'https://toolhub.tools',
        'en': 'https://toolhub.tools/en',
        'ja': 'https://toolhub.tools/ja',
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div>{children}</div>
    </NextIntlClientProvider>
  );
}