import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n';
import { getAllTools, getToolById } from '@/lib/tools';
import { generateToolMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// 정적 경로 생성
export async function generateStaticParams() {
  const tools = getAllTools();
  const paths: { locale: string; slug: string }[] = [];
  
  locales.forEach((locale) => {
    tools.forEach((tool) => {
      paths.push({ locale, slug: tool.id });
    });
  });
  
  return paths;
}

// 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const validLocale = locale as Locale;
  
  if (!locales.includes(validLocale)) {
    return { title: 'Page Not Found' };
  }

  const tool = getToolById(slug);
  if (!tool) {
    return { title: 'Tool Not Found' };
  }

  const messages = await getMessages();
  return generateToolMetadata(slug, validLocale, messages);
}

export default async function ToolPage({ params }: Props) {
  const { locale, slug } = await params;
  const validLocale = locale as Locale;

  if (!locales.includes(validLocale)) {
    notFound();
  }

  const tool = getToolById(slug);
  if (!tool) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {messages.tools?.[slug]?.name || tool.name[validLocale]}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {messages.tools?.[slug]?.description || tool.description[validLocale]}
              </p>
            </div>

            <div className="flex items-center justify-center text-6xl mb-8">
              {tool.emoji}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {validLocale === 'ko' ? '기능' : validLocale === 'en' ? 'Features' : '機能'}
                </h2>
                <ul className="space-y-2">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {validLocale === 'ko' ? '카테고리' : validLocale === 'en' ? 'Category' : 'カテゴリー'}
                </h2>
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  {tool.category}
                </span>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {validLocale === 'ko' ? '상태' : validLocale === 'en' ? 'Status' : 'ステータス'}
                  </h3>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      tool.isCompleted ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      {tool.isCompleted 
                        ? (validLocale === 'ko' ? '완료' : validLocale === 'en' ? 'Completed' : '完了')
                        : (validLocale === 'ko' ? '개발 중' : validLocale === 'en' ? 'In Development' : '開発中')
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {validLocale === 'ko' 
                    ? '이 도구는 현재 개발 중입니다. 곧 사용하실 수 있습니다!' 
                    : validLocale === 'en' 
                    ? 'This tool is currently under development. It will be available soon!' 
                    : 'このツールは現在開発中です。まもなく利用可能になります！'
                  }
                </p>
                <button 
                  disabled
                  className="bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                >
                  {validLocale === 'ko' ? '준비 중' : validLocale === 'en' ? 'Coming Soon' : '準備中'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}