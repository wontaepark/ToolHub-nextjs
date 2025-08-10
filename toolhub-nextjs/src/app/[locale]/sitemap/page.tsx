import { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n';
import { getAllTools, getAllPages } from '@/lib/tools';
import { generateSEOMetadata } from '@/lib/seo';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locale as Locale;
  const messages = await getMessages();

  const title = `${messages.common?.sitemap || 'Sitemap'} | ToolHub.tools`;
  const description = validLocale === 'ko' 
    ? '사이트의 모든 페이지와 도구들을 한 눈에 확인하세요.'
    : validLocale === 'en'
    ? 'Browse all pages and tools available on our site.'
    : 'サイトのすべてのページとツールを一覧で確認できます。';

  return generateSEOMetadata({
    title,
    description,
    path: '/sitemap',
    locale: validLocale,
  });
}

export default async function SitemapPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = locale as Locale;
  const messages = await getMessages();
  
  const tools = getAllTools();
  const pages = getAllPages();

  const completedTools = tools.filter(tool => tool.isCompleted);
  const inDevelopmentTools = tools.filter(tool => !tool.isCompleted);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {messages.common?.sitemap || 'Sitemap'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {validLocale === 'ko' 
                ? '사이트의 모든 페이지와 도구들을 한 눈에 확인하세요.'
                : validLocale === 'en'
                ? 'Browse all pages and tools available on our site.'
                : 'サイトのすべてのページとツールを一覧で確認できます。'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 완료된 도구들 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                {validLocale === 'ko' ? '사용 가능한 도구' : validLocale === 'en' ? 'Available Tools' : '利用可能なツール'}
                <span className="ml-2 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                  {completedTools.length}
                </span>
              </h2>
              <div className="space-y-3">
                {completedTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/${validLocale}/tools/${tool.id}`}
                    className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{tool.emoji}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {messages.tools?.[tool.id]?.name || tool.name[validLocale]}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {messages.tools?.[tool.id]?.shortDesc || tool.description[validLocale]}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 개발 중인 도구들 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
                {validLocale === 'ko' ? '개발 중인 도구' : validLocale === 'en' ? 'Tools in Development' : '開発中のツール'}
                <span className="ml-2 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                  {inDevelopmentTools.length}
                </span>
              </h2>
              <div className="space-y-3">
                {inDevelopmentTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-700 opacity-75"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3 grayscale">{tool.emoji}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {tool.name[validLocale]}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {tool.description[validLocale]}
                        </p>
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">
                          {validLocale === 'ko' ? '곧 출시 예정' : validLocale === 'en' ? 'Coming Soon' : '近日公開'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 정보 페이지 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                {validLocale === 'ko' ? '정보 페이지' : validLocale === 'en' ? 'Information Pages' : '情報ページ'}
              </h2>
              <div className="space-y-3">
                <Link
                  href={`/${validLocale}`}
                  className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {messages.common?.home || 'Home'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {validLocale === 'ko' ? '메인 페이지' : validLocale === 'en' ? 'Main page' : 'メインページ'}
                  </p>
                </Link>
                
                <Link
                  href={`/${validLocale}/contact`}
                  className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {messages.common?.contact || 'Contact'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {validLocale === 'ko' ? '문의하기' : validLocale === 'en' ? 'Contact us' : 'お問い合わせ'}
                  </p>
                </Link>

                <Link
                  href={`/${validLocale}/test-i18n`}
                  className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {validLocale === 'ko' ? '다국어 테스트' : validLocale === 'en' ? 'I18n Test' : '多言語テスト'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {validLocale === 'ko' ? '다국어 기능 테스트 페이지' : validLocale === 'en' ? 'Multilingual feature test page' : '多言語機能テストページ'}
                  </p>
                </Link>
              </div>
            </div>

            {/* 언어 버전 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                {validLocale === 'ko' ? '언어 버전' : validLocale === 'en' ? 'Language Versions' : '言語バージョン'}
              </h2>
              <div className="space-y-3">
                {locales.map((loc) => (
                  <Link
                    key={loc}
                    href={loc === 'ko' ? '/' : `/${loc}`}
                    className={`block p-3 rounded-lg transition-colors ${
                      loc === validLocale 
                        ? 'bg-purple-100 dark:bg-purple-900 border-2 border-purple-500' 
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {loc === 'ko' ? '한국어' : loc === 'en' ? 'English' : '日本語'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {loc === 'ko' ? 'Korean' : loc === 'en' ? 'English' : 'Japanese'}
                        </p>
                      </div>
                      {loc === validLocale && (
                        <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                          {validLocale === 'ko' ? '현재' : validLocale === 'en' ? 'Current' : '現在'}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 통계 */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              {validLocale === 'ko' ? '사이트 통계' : validLocale === 'en' ? 'Site Statistics' : 'サイト統計'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {tools.length}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {validLocale === 'ko' ? '총 도구' : validLocale === 'en' ? 'Total Tools' : '総ツール'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {completedTools.length}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {validLocale === 'ko' ? '완료된 도구' : validLocale === 'en' ? 'Completed' : '完了'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {inDevelopmentTools.length}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {validLocale === 'ko' ? '개발 중' : validLocale === 'en' ? 'In Development' : '開発中'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {locales.length}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {validLocale === 'ko' ? '지원 언어' : validLocale === 'en' ? 'Languages' : '対応言語'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}