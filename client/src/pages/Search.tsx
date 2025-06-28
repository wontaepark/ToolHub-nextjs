import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { type Tool } from '@/lib/searchData';
import SearchBox from '@/components/SearchBox';
import SearchResults from '@/components/SearchResults';
import AdSense from '@/components/AdSense';

export default function Search() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const currentLang = i18n.language as 'ko' | 'en' | 'ja';

  const handleSearchResults = (results: Tool[], query?: string) => {
    setSearchResults(results);
    if (query !== undefined) {
      setSearchQuery(query);
    }
  };

  // URL에서 검색어 읽기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [location]);

  // 검색어 변경 시 URL 업데이트
  useEffect(() => {
    if (searchQuery) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchQuery);
      url.searchParams.set('lang', currentLang);
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchQuery, currentLang]);

  const getPageTitle = () => {
    switch (currentLang) {
      case 'ko':
        return '도구 검색';
      case 'ja':
        return 'ツール検索';
      default:
        return 'Tool Search';
    }
  };

  const getPageDescription = () => {
    switch (currentLang) {
      case 'ko':
        return 'ToolHub.tools의 모든 유용한 도구들을 한 곳에서 검색하세요. 계산기, 포모도로 타이머, 비밀번호 생성기, 단위 변환기, MBTI 테스트 등 다양한 도구를 다국어로 검색할 수 있습니다.';
      case 'ja':
        return 'ToolHub.toolsのすべての便利なツールを一箇所で検索できます。電卓、ポモドーロタイマー、パスワード生成器、単位変換器、MBTIテストなど様々なツールを多言語で検索可能です。';
      default:
        return 'Search all useful tools from ToolHub.tools in one place. Find calculators, pomodoro timers, password generators, unit converters, MBTI tests and more in multiple languages.';
    }
  };

  const getSearchTips = () => {
    switch (currentLang) {
      case 'ko':
        return [
          '한국어, 영어, 일본어로 검색할 수 있습니다',
          '도구 이름이나 기능으로 검색해보세요',
          '예: "계산기", "Calculator", "電卓", "포모도로", "MBTI"'
        ];
      case 'ja':
        return [
          '韓国語、英語、日本語で検索できます',
          'ツール名や機能で検索してみてください',
          '例: "계산기", "Calculator", "電卓", "ポモドーロ", "MBTI"'
        ];
      default:
        return [
          'Search in Korean, English, or Japanese',
          'Try searching by tool name or function',
          'Examples: "계산기", "Calculator", "電卓", "pomodoro", "MBTI"'
        ];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* SEO Meta Tags */}
      <div className="hidden">
        <title>{getPageTitle()} | ToolHub.tools</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content="search, tools, calculator, timer, converter, MBTI, multilingual, 검색, 도구, 계산기, タイマー, ツール検索" />
        <meta property="og:title" content={`${getPageTitle()} | ToolHub.tools`} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:type" content="website" />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {getPageDescription()}
          </p>
        </div>

        {/* 검색 박스 */}
        <div className="mb-8">
          <SearchBox
            onResults={(results) => handleSearchResults(results, searchQuery)}
            className="mb-6"
          />
        </div>

        {/* AdSense */}
        <div className="mb-8 flex justify-center">
          <AdSense adSlot="1234567890" className="w-full max-w-4xl" />
        </div>

        {/* 검색 결과 또는 안내 정보 */}
        {searchQuery ? (
          <SearchResults 
            results={searchResults} 
            query={searchQuery}
            className="mb-8"
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* 검색 팁 */}
            <div className="bg-card rounded-xl p-6 border border-border mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {currentLang === 'ko' ? '검색 가이드' :
                 currentLang === 'ja' ? '検索ガイド' :
                 'Search Guide'}
              </h2>
              <div className="space-y-3">
                {getSearchTips().map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 인기 도구들 */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">
                {currentLang === 'ko' ? '인기 도구들' :
                 currentLang === 'ja' ? '人気ツール' :
                 'Popular Tools'}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { ko: '계산기', en: 'Calculator', ja: '電卓', url: '/calculator' },
                  { ko: '포모도로 타이머', en: 'Pomodoro Timer', ja: 'ポモドーロタイマー', url: '/pomodoro-timer' },
                  { ko: 'MBTI 테스트', en: 'MBTI Test', ja: 'MBTIテスト', url: '/mbti-test' },
                  { ko: '비밀번호 생성기', en: 'Password Generator', ja: 'パスワード生成器', url: '/password-generator' },
                  { ko: '단위 변환기', en: 'Unit Converter', ja: '単位変換器', url: '/unit-converter' },
                  { ko: '테토-에겐 테스트', en: 'Teto-Egen Test', ja: 'テト・エゲンテスト', url: '/teto-egen-test' }
                ].map((tool) => (
                  <a
                    key={tool.url}
                    href={tool.url}
                    className="block p-4 bg-secondary/10 hover:bg-secondary/20 rounded-lg border border-secondary/20 hover:border-secondary/40 transition-all duration-200"
                  >
                    <h3 className="font-semibold text-foreground">
                      {tool[currentLang]}
                    </h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      {(['ko', 'en', 'ja'] as const)
                        .filter(lang => lang !== currentLang)
                        .map(lang => tool[lang])
                        .join(' • ')}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AdSense */}
        <div className="mt-8 flex justify-center">
          <AdSense adSlot="1234567891" className="w-full max-w-4xl" />
        </div>
      </div>
    </div>
  );
}