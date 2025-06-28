import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { ExternalLink, Search, Globe } from 'lucide-react';
import { type Tool } from '@/lib/searchData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchResultsProps {
  results: Tool[];
  query: string;
  className?: string;
}

export default function SearchResults({ results, query, className }: SearchResultsProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'ko' | 'en' | 'ja';

  const getLanguageName = (lang: 'ko' | 'en' | 'ja') => {
    const names = {
      ko: { ko: '한국어', en: '한국어', ja: '한国語' },
      en: { ko: 'English', en: 'English', ja: 'English' },
      ja: { ko: '일본어', en: 'Japanese', ja: '日本語' }
    };
    return names[lang][currentLang];
  };

  const getNoResultsMessage = () => {
    switch (currentLang) {
      case 'ko':
        return {
          title: '검색 결과가 없습니다',
          description: `"${query}"에 대한 도구를 찾을 수 없습니다.`,
          suggestion: '다른 키워드로 검색해보세요.'
        };
      case 'ja':
        return {
          title: '検索結果がありません',
          description: `"${query}"に関するツールが見つかりませんでした。`,
          suggestion: '他のキーワードで検索してみてください。'
        };
      default:
        return {
          title: 'No Results Found',
          description: `No tools found for "${query}".`,
          suggestion: 'Try searching with different keywords.'
        };
    }
  };

  const getResultsInfo = () => {
    switch (currentLang) {
      case 'ko':
        return `"${query}" 검색 결과 - ${results.length}개 도구 발견`;
      case 'ja':
        return `"${query}" 検索結果 - ${results.length}個のツールが見つかりました`;
      default:
        return `Search results for "${query}" - ${results.length} tools found`;
    }
  };

  if (!query) return null;

  if (results.length === 0) {
    const noResults = getNoResultsMessage();
    return (
      <div className={className}>
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Search className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">{noResults.title}</h3>
                <p className="text-muted-foreground mb-2">{noResults.description}</p>
                <p className="text-sm text-muted-foreground">{noResults.suggestion}</p>
              </div>
              
              {/* 검색 제안 */}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {currentLang === 'ko' ? '추천 검색어:' :
                   currentLang === 'ja' ? '推奨検索ワード:' :
                   'Suggested searches:'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['계산기', 'Calculator', '電卓', '포모도로', 'MBTI'].map(suggestion => (
                    <Badge key={suggestion} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 검색 결과 정보 */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">{getResultsInfo()}</p>
      </div>

      {/* 검색 결과 목록 */}
      <div className="space-y-4">
        {results.map((tool) => (
          <Card key={tool.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">
                  <Link 
                    href={tool.url}
                    className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                  >
                    {tool.names[currentLang]}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </CardTitle>
                
                {/* 언어 표시 */}
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {currentLang === 'ko' ? '다국어' :
                     currentLang === 'ja' ? '多言語' :
                     'Multilingual'}
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* 도구 설명 */}
              <p className="text-muted-foreground mb-4">
                {tool.descriptions[currentLang]}
              </p>

              {/* 다른 언어 이름들 */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {currentLang === 'ko' ? '다른 언어:' :
                   currentLang === 'ja' ? '他の言語:' :
                   'Other languages:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['ko', 'en', 'ja'] as const)
                    .filter(lang => lang !== currentLang)
                    .map(lang => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        <span className="font-medium">{tool.names[lang]}</span>
                        <span className="ml-1 text-muted-foreground">
                          ({getLanguageName(lang)})
                        </span>
                      </Badge>
                    ))}
                </div>
              </div>

              {/* 키워드 */}
              <div className="mt-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {currentLang === 'ko' ? '관련 키워드:' :
                   currentLang === 'ja' ? '関連キーワード:' :
                   'Related keywords:'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {tool.keywords[currentLang].slice(0, 5).map(keyword => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 더 많은 결과가 있을 때 */}
      {results.length > 5 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {currentLang === 'ko' ? 
              `총 ${results.length}개의 도구가 검색되었습니다.` :
             currentLang === 'ja' ? 
              `合計${results.length}個のツールが検索されました。` :
              `Total of ${results.length} tools found.`}
          </p>
        </div>
      )}
    </div>
  );
}