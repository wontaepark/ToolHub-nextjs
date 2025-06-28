import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { searchToolsMultiLanguage, getAutocompleteSuggestions, detectLanguage, type Tool } from '@/lib/searchData';
import { cn } from '@/lib/utils';

interface SearchBoxProps {
  onResults?: (results: Tool[]) => void;
  className?: string;
  placeholder?: string;
}

export default function SearchBox({ onResults, className, placeholder }: SearchBoxProps) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [detectedLang, setDetectedLang] = useState<'ko' | 'en' | 'ja'>('ko');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentLang = i18n.language as 'ko' | 'en' | 'ja';

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    switch (currentLang) {
      case 'ko':
        return '도구 검색... (한국어, English, 日本語)';
      case 'ja':
        return 'ツール検索... (한국어, English, 日本語)';
      default:
        return 'Search tools... (한국어, English, 日本語)';
    }
  };

  const getLanguageFlag = (lang: 'ko' | 'en' | 'ja') => {
    const flags = { ko: '🇰🇷', en: '🇺🇸', ja: '🇯🇵' };
    return flags[lang];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      const detected = detectLanguage(value);
      setDetectedLang(detected);
      
      const autoSuggestions = getAutocompleteSuggestions(value);
      setSuggestions(autoSuggestions);
      setShowSuggestions(autoSuggestions.length > 0);
      
      // 실시간 검색 결과
      const results = searchToolsMultiLanguage(value);
      onResults?.(results);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      onResults?.([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        } else {
          performSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    const results = searchToolsMultiLanguage(suggestion);
    onResults?.(results);
    
    inputRef.current?.focus();
  };

  const performSearch = () => {
    if (query.trim()) {
      const results = searchToolsMultiLanguage(query);
      onResults?.(results);
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onResults?.([]);
    inputRef.current?.focus();
  };

  // 외부 클릭 시 자동완성 숨김
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 키보드 선택된 항목 스크롤
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
      {/* 검색 입력창 */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={getPlaceholder()}
          className="w-full pl-10 pr-16 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          autoComplete="off"
          spellCheck="false"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {/* 언어 표시기 */}
          {query && (
            <span className="text-sm" title={`Detected: ${detectedLang}`}>
              {getLanguageFlag(detectedLang)}
            </span>
          )}
          
          {/* 클리어 버튼 */}
          {query && (
            <button
              onClick={clearSearch}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 자동완성 드롭다운 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                ref={el => suggestionRefs.current[index] = el}
                onClick={() => selectSuggestion(suggestion)}
                className={cn(
                  "px-4 py-2 cursor-pointer transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  selectedIndex === index && "bg-accent text-accent-foreground"
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{suggestion}</span>
                  <Search className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색 예시 */}
      {!query && (
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            {currentLang === 'ko' 
              ? '예시: "계산기", "Calculator", "電卓", "포모도로", "MBTI"'
              : currentLang === 'ja'
              ? '例: "계산기", "Calculator", "電卓", "ポモドーロ", "MBTI"'
              : 'Examples: "계산기", "Calculator", "電卓", "pomodoro", "MBTI"'
            }
          </p>
        </div>
      )}
    </div>
  );
}