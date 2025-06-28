export interface AdvancedSearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  relevanceScore: number;
  matchedLanguage: string;
  matchedFields: string[];
  category: string;
  keywords: string[];
}

export type SupportedLanguage = 'ko' | 'en' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'ru';

// 확장된 언어 감지 함수
export function detectLanguageAdvanced(text: string): SupportedLanguage | 'auto' {
  // 한국어 (가-힣)
  if (/[가-힣]/.test(text)) return 'ko';
  
  // 일본어 (히라가나, 가타카나)
  if (/[ひらがなカタカナ]/.test(text)) return 'ja';
  
  // 중국어 (간체/번체)
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
  
  // 러시아어 (키릴 문자)
  if (/[а-яё]/i.test(text)) return 'ru';
  
  // 독일어 특수문자
  if (/[äöüßÄÖÜ]/.test(text)) return 'de';
  
  // 프랑스어 특수문자
  if (/[àâäæçéèêëïîôùûüÿñ]/i.test(text)) return 'fr';
  
  // 스페인어 특수문자
  if (/[ñáéíóúü]/i.test(text)) return 'es';
  
  // 영어 (라틴 문자만)
  if (/^[a-zA-Z\s\-_.,!?]+$/.test(text)) return 'en';
  
  return 'auto';
}

// 텍스트 정규화 함수 (언어별)
export function normalizeText(text: string, language: SupportedLanguage): string {
  let normalized = text.toLowerCase().trim();
  
  // 언어별 특수 정규화
  switch (language) {
    case 'de':
      // 독일어 움라우트 정규화
      normalized = normalized
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss');
      break;
    
    case 'fr':
      // 프랑스어 악센트 제거
      normalized = normalized
        .replace(/[àâä]/g, 'a')
        .replace(/[éèêë]/g, 'e')
        .replace(/[îï]/g, 'i')
        .replace(/[ôö]/g, 'o')
        .replace(/[ùûü]/g, 'u')
        .replace(/[ÿ]/g, 'y')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n');
      break;
    
    case 'es':
      // 스페인어 악센트 제거
      normalized = normalized
        .replace(/[áà]/g, 'a')
        .replace(/[éè]/g, 'e')
        .replace(/[íì]/g, 'i')
        .replace(/[óò]/g, 'o')
        .replace(/[úù]/g, 'u')
        .replace(/[ñ]/g, 'n');
      break;
  }
  
  return normalized;
}

// 관련성 점수 계산 함수
export function calculateRelevanceScore(
  query: string,
  title: string,
  description: string,
  keywords: string[],
  language: SupportedLanguage
): { score: number; matchedFields: string[] } {
  const normalizedQuery = normalizeText(query, language);
  const normalizedTitle = normalizeText(title, language);
  const normalizedDescription = normalizeText(description, language);
  const normalizedKeywords = keywords.map(k => normalizeText(k, language));
  
  let score = 0;
  const matchedFields: string[] = [];
  
  // 완전 일치 점수 (가장 높음)
  if (normalizedTitle === normalizedQuery) {
    score += 100;
    matchedFields.push('exact_title');
  }
  
  if (normalizedKeywords.includes(normalizedQuery)) {
    score += 80;
    matchedFields.push('exact_keyword');
  }
  
  // 부분 일치 점수
  if (normalizedTitle.includes(normalizedQuery)) {
    score += 50;
    matchedFields.push('partial_title');
  }
  
  if (normalizedDescription.includes(normalizedQuery)) {
    score += 30;
    matchedFields.push('partial_description');
  }
  
  // 키워드 부분 일치
  for (const keyword of normalizedKeywords) {
    if (keyword.includes(normalizedQuery)) {
      score += 25;
      matchedFields.push('partial_keyword');
      break;
    }
  }
  
  // 단어 시작 일치 (추가 점수)
  if (normalizedTitle.startsWith(normalizedQuery)) {
    score += 20;
    matchedFields.push('title_start');
  }
  
  // 퍼지 매칭 (편집 거리 기반)
  const fuzzyScore = calculateFuzzyScore(normalizedQuery, normalizedTitle);
  if (fuzzyScore > 0.7) {
    score += Math.floor(fuzzyScore * 15);
    matchedFields.push('fuzzy_match');
  }
  
  return { score, matchedFields };
}

// 편집 거리 기반 퍼지 매칭
function calculateFuzzyScore(query: string, target: string): number {
  const distance = levenshteinDistance(query, target);
  const maxLength = Math.max(query.length, target.length);
  return maxLength > 0 ? 1 - (distance / maxLength) : 0;
}

// 레벤슈타인 거리 계산
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,      // deletion
        matrix[j - 1][i] + 1,      // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// 검색 쿼리 캐시
class SearchCache {
  private cache = new Map<string, AdvancedSearchResult[]>();
  private maxSize = 100;
  
  get(key: string): AdvancedSearchResult[] | undefined {
    return this.cache.get(key);
  }
  
  set(key: string, results: AdvancedSearchResult[]): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, results);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

export const searchCache = new SearchCache();

// 디바운스 유틸리티
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// URL 파라미터 업데이트
export function updateSearchURL(query: string, language: string): void {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    
    if (query) {
      url.searchParams.set('q', query);
      url.searchParams.set('lang', language);
    } else {
      url.searchParams.delete('q');
      url.searchParams.delete('lang');
    }
    
    window.history.replaceState({}, '', url.toString());
  }
}

// 검색 쿼리를 URL에서 읽기
export function getSearchFromURL(): { query: string; language: string } | null {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const query = url.searchParams.get('q');
    const language = url.searchParams.get('lang');
    
    if (query) {
      return { query, language: language || 'auto' };
    }
  }
  return null;
}

// 번역 제안 생성 (미래 확장용)
export function generateTranslationSuggestions(
  query: string,
  fromLang: SupportedLanguage
): Array<{ language: SupportedLanguage; suggestion: string }> {
  // 기본적인 번역 매핑 (실제로는 번역 API를 사용)
  const commonTranslations: Record<string, Partial<Record<SupportedLanguage, string>>> = {
    'calculator': {
      ko: '계산기',
      ja: '電卓',
      zh: '计算器',
      es: 'calculadora',
      fr: 'calculatrice',
      de: 'Rechner',
      ru: 'калькулятор'
    },
    'timer': {
      ko: '타이머',
      ja: 'タイマー',
      zh: '计时器',
      es: 'temporizador',
      fr: 'minuteur',
      de: 'Timer',
      ru: 'таймер'
    },
    'password': {
      ko: '비밀번호',
      ja: 'パスワード',
      zh: '密码',
      es: 'contraseña',
      fr: 'mot de passe',
      de: 'Passwort',
      ru: 'пароль'
    }
  };
  
  const suggestions: Array<{ language: SupportedLanguage; suggestion: string }> = [];
  const lowerQuery = query.toLowerCase();
  
  // 일반적인 번역 찾기
  for (const [english, translations] of Object.entries(commonTranslations)) {
    if (lowerQuery.includes(english) || Object.values(translations).some(t => t && lowerQuery.includes(t.toLowerCase()))) {
      for (const [lang, translation] of Object.entries(translations)) {
        if (lang !== fromLang && translation) {
          suggestions.push({
            language: lang as SupportedLanguage,
            suggestion: translation
          });
        }
      }
      break;
    }
  }
  
  return suggestions.slice(0, 3); // 최대 3개 제안
}