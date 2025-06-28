import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  Filter,
  ArrowRight 
} from 'lucide-react';
import {
  searchTools,
  getSearchSuggestions,
  getPopularSearchTerms,
  getToolsByCategory,
  type ToolSearchData
} from '../lib/searchData';

interface SearchBoxProps {
  onClose?: () => void;
  autoFocus?: boolean;
  showCategories?: boolean;
}

export default function SearchBox({ onClose, autoFocus = false, showCategories = true }: SearchBoxProps) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToolSearchData[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [popularTerms] = useState(() => getPopularSearchTerms(i18n.language));
  const [categories] = useState(() => getToolsByCategory(i18n.language));
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchTools(query, i18n.language);
      setResults(searchResults);
      
      if (query.length > 1) {
        const searchSuggestions = getSearchSuggestions(query, i18n.language);
        setSuggestions(searchSuggestions);
      }
      setIsOpen(true);
    } else {
      setResults([]);
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, i18n.language]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      // Navigate to the first result
      window.location.href = results[0].path;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      onClose?.();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={t('common.searchPlaceholder', '도구 검색...')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10 h-12 text-base border-2 border-muted-foreground/20 focus:border-primary"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-muted-foreground/20 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {/* Search Results */}
          {results.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {t('search.results', '검색 결과')} ({results.length})
                </span>
              </div>
              <div className="space-y-2">
                {results.slice(0, 6).map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className="block p-3 rounded-md hover:bg-muted/50 transition-colors group"
                    onClick={() => {
                      setIsOpen(false);
                      onClose?.();
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {tool.title[i18n.language as 'ko' | 'en' | 'ja']}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {tool.description[i18n.language as 'ko' | 'en' | 'ja']}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {tool.category[i18n.language as 'ko' | 'en' | 'ja']}
                          </Badge>
                          {tool.popularity > 90 && (
                            <Badge variant="outline" className="text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              인기
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && query.length > 1 && (
            <div className="border-t border-muted-foreground/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {t('search.suggestions', '추천 검색어')}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs h-7"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Terms */}
          {!query && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {t('search.popular', '인기 도구')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {popularTerms.map((term, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSuggestionClick(term)}
                    className="justify-start text-xs h-8"
                  >
                    <Clock className="h-3 w-3 mr-2" />
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query && results.length === 0 && (
            <div className="p-6 text-center">
              <div className="text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  "{query}"에 대한 검색 결과가 없습니다.
                </p>
                <p className="text-xs mt-1">
                  다른 검색어를 시도해보세요.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Categories (optional) */}
      {showCategories && !query && !isOpen && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {t('search.categories', '카테고리별 도구')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categories).map(([category, tools]) => (
              <div
                key={category}
                className="p-4 border border-muted-foreground/20 rounded-lg hover:border-primary/30 transition-colors"
              >
                <h4 className="font-medium text-foreground mb-2">{category}</h4>
                <div className="space-y-1">
                  {tools.slice(0, 3).map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {tool.title[i18n.language as 'ko' | 'en' | 'ja']}
                    </Link>
                  ))}
                  {tools.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{tools.length - 3}개 더
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            onClose?.();
          }}
        />
      )}
    </div>
  );
}