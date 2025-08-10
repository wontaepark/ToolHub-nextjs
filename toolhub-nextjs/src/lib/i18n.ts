import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// 지원하는 로케일 목록
export const locales = ['ko', 'en', 'ja'] as const;
export type Locale = typeof locales[number];

// 기본 로케일
export const defaultLocale: Locale = 'ko';

// 로케일 유효성 검사
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// next-intl 설정
export default getRequestConfig(async ({ locale }) => {
  // 유효하지 않은 로케일 체크
  if (!isValidLocale(locale)) notFound();

  return {
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});

// 메시지 타입 정의 (타입 안전성 확보)
export type Messages = {
  common: {
    home: string;
    tools: string;
    about: string;
    contact: string;
    sitemap: string;
    privacy: string;
    terms: string;
    darkMode: string;
    lightMode: string;
    systemMode: string;
    toggleTheme: string;
  };
  home: {
    title: string;
    description: string;
    hero: {
      title: string;
      subtitle: string;
      cta: string;
    };
    stats: {
      users: string;
      monthlyUsage: string;
      satisfaction: string;
    };
    toolCategories: {
      productivity: string;
      personality: string;
      utilities: string;
      entertainment: string;
    };
  };
  tools: {
    [key: string]: {
      name: string;
      description: string;
      shortDesc: string;
    };
  };
  footer: {
    copyright: string;
    popularTools: string;
  };
};