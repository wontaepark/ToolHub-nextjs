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

  // 메시지에서 메타데이터 가져오기 
  const messages = await getMessages();
  const title = messages.meta?.title || titles[validLocale];
  const description = messages.meta?.description || descriptions[validLocale];
  const keywords = messages.meta?.keywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://toolhub.tools${validLocale === 'ko' ? '' : '/' + validLocale}`,
      siteName: 'ToolHub.tools',
      images: [
        {
          url: `/og/${validLocale}.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: validLocale === 'ko' ? 'ko_KR' : validLocale === 'en' ? 'en_US' : 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/og/${validLocale}.png`],
    },
    alternates: {
      canonical: `https://toolhub.tools${validLocale === 'ko' ? '' : '/' + validLocale}`,
      languages: {
        'ko': 'https://toolhub.tools',
        'en': 'https://toolhub.tools/en',
        'ja': 'https://toolhub.tools/ja',
        'x-default': 'https://toolhub.tools/en',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
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