export interface ToolSearchData {
  id: string;
  path: string;
  title: {
    ko: string;
    en: string;
    ja: string;
  };
  description: {
    ko: string;
    en: string;
    ja: string;
  };
  keywords: {
    ko: string[];
    en: string[];
    ja: string[];
  };
  category: {
    ko: string;
    en: string;
    ja: string;
  };
  tags: string[];
  popularity: number;
}

export const toolsSearchData: ToolSearchData[] = [
  {
    id: 'calculator',
    path: '/calculator',
    title: {
      ko: '계산기',
      en: 'Calculator',
      ja: '電卓'
    },
    description: {
      ko: '기본적인 사칙연산과 고급 계산 기능을 제공하는 온라인 계산기',
      en: 'Online calculator with basic arithmetic and advanced calculation features',
      ja: '基本的な四則演算と高度な計算機能を提供するオンライン電卓'
    },
    keywords: {
      ko: ['계산기', '계산', '수학', '덧셈', '뺄셈', '곱셈', '나눗셈', '사칙연산', '수치계산'],
      en: ['calculator', 'calculate', 'math', 'addition', 'subtraction', 'multiplication', 'division', 'arithmetic', 'computation'],
      ja: ['電卓', '計算', '数学', '足し算', '引き算', '掛け算', '割り算', '四則演算', '計算機']
    },
    category: {
      ko: '계산 도구',
      en: 'Calculation Tools',
      ja: '計算ツール'
    },
    tags: ['math', 'basic', 'utility'],
    popularity: 95
  },
  {
    id: 'pomodoro',
    path: '/pomodoro',
    title: {
      ko: '포모도로 타이머',
      en: 'Pomodoro Timer',
      ja: 'ポモドーロタイマー'
    },
    description: {
      ko: '생산성 향상을 위한 포모도로 기법 타이머. 집중시간과 휴식시간을 관리합니다.',
      en: 'Pomodoro technique timer for productivity enhancement. Manages focus time and break time.',
      ja: '生産性向上のためのポモドーロテクニックタイマー。集中時間と休憩時間を管理します。'
    },
    keywords: {
      ko: ['포모도로', '타이머', '집중', '생산성', '시간관리', '공부', '업무', '휴식', '집중력'],
      en: ['pomodoro', 'timer', 'focus', 'productivity', 'time management', 'study', 'work', 'break', 'concentration'],
      ja: ['ポモドーロ', 'タイマー', '集中', '生産性', '時間管理', '勉強', '仕事', '休憩', '集中力']
    },
    category: {
      ko: '생산성 도구',
      en: 'Productivity Tools',
      ja: '生産性ツール'
    },
    tags: ['productivity', 'timer', 'focus'],
    popularity: 90
  },
  {
    id: 'timer',
    path: '/timer',
    title: {
      ko: '범용 타이머',
      en: 'Universal Timer',
      ja: '汎用タイマー'
    },
    description: {
      ko: '다양한 용도로 사용할 수 있는 범용 타이머. 요리, 운동, 회의 등에 활용하세요.',
      en: 'Universal timer for various purposes. Use for cooking, exercise, meetings, and more.',
      ja: '様々な用途に使える汎用タイマー。料理、運動、会議などに活用してください。'
    },
    keywords: {
      ko: ['타이머', '시간', '알람', '요리', '운동', '회의', '스톱워치', '카운트다운'],
      en: ['timer', 'time', 'alarm', 'cooking', 'exercise', 'meeting', 'stopwatch', 'countdown'],
      ja: ['タイマー', '時間', 'アラーム', '料理', '運動', '会議', 'ストップウォッチ', 'カウントダウン']
    },
    category: {
      ko: '시간 도구',
      en: 'Time Tools',
      ja: '時間ツール'
    },
    tags: ['timer', 'utility', 'alarm'],
    popularity: 85
  },
  {
    id: 'raffle',
    path: '/raffle',
    title: {
      ko: '번호 추첨기',
      en: 'Number Raffle',
      ja: '番号抽選器'
    },
    description: {
      ko: '공정한 랜덤 번호 생성기. 추첨, 게임, 순서 정하기 등에 사용하세요.',
      en: 'Fair random number generator. Use for raffles, games, ordering, and more.',
      ja: '公正なランダム番号生成器。抽選、ゲーム、順序決めなどにご使用ください。'
    },
    keywords: {
      ko: ['추첨', '랜덤', '번호', '뽑기', '임의', '선택', '게임', '순서'],
      en: ['raffle', 'random', 'number', 'draw', 'selection', 'game', 'order', 'lottery'],
      ja: ['抽選', 'ランダム', '番号', '抽出', '選択', 'ゲーム', '順序', '宝くじ']
    },
    category: {
      ko: '유틸리티',
      en: 'Utilities',
      ja: 'ユーティリティ'
    },
    tags: ['random', 'game', 'utility'],
    popularity: 75
  },
  {
    id: 'thumbnail',
    path: '/thumbnail',
    title: {
      ko: '유튜브 썸네일 다운로더',
      en: 'YouTube Thumbnail Downloader',
      ja: 'YouTube サムネイルダウンローダー'
    },
    description: {
      ko: '유튜브 동영상의 썸네일을 고화질로 다운로드할 수 있는 도구입니다.',
      en: 'Tool to download YouTube video thumbnails in high quality.',
      ja: 'YouTube動画のサムネイルを高画質でダウンロードできるツールです。'
    },
    keywords: {
      ko: ['유튜브', '썸네일', '다운로드', '이미지', '동영상', '유투브'],
      en: ['youtube', 'thumbnail', 'download', 'image', 'video', 'picture'],
      ja: ['YouTube', 'サムネイル', 'ダウンロード', '画像', '動画', '写真']
    },
    category: {
      ko: '미디어 도구',
      en: 'Media Tools',
      ja: 'メディアツール'
    },
    tags: ['youtube', 'download', 'media'],
    popularity: 80
  },
  {
    id: 'password',
    path: '/password',
    title: {
      ko: '비밀번호 생성기',
      en: 'Password Generator',
      ja: 'パスワード生成器'
    },
    description: {
      ko: '안전하고 강력한 비밀번호를 생성하는 도구. 다양한 옵션으로 커스터마이징 가능합니다.',
      en: 'Tool to generate secure and strong passwords. Customizable with various options.',
      ja: '安全で強力なパスワードを生成するツール。様々なオプションでカスタマイズ可能です。'
    },
    keywords: {
      ko: ['비밀번호', '패스워드', '생성', '보안', '암호', '랜덤', '안전'],
      en: ['password', 'generate', 'security', 'secure', 'random', 'strong', 'safe'],
      ja: ['パスワード', '生成', 'セキュリティ', '安全', 'ランダム', '強力', '暗号']
    },
    category: {
      ko: '보안 도구',
      en: 'Security Tools',
      ja: 'セキュリティツール'
    },
    tags: ['security', 'password', 'generator'],
    popularity: 88
  },
  {
    id: 'converter',
    path: '/converter',
    title: {
      ko: '단위 변환기',
      en: 'Unit Converter',
      ja: '単位変換器'
    },
    description: {
      ko: '길이, 무게, 온도, 부피 등 다양한 단위를 변환하는 도구입니다.',
      en: 'Tool to convert various units including length, weight, temperature, and volume.',
      ja: '長さ、重さ、温度、体積など様々な単位を変換するツールです。'
    },
    keywords: {
      ko: ['단위', '변환', '길이', '무게', '온도', '부피', '미터', '킬로그램', '섭씨'],
      en: ['unit', 'convert', 'length', 'weight', 'temperature', 'volume', 'meter', 'kilogram', 'celsius'],
      ja: ['単位', '変換', '長さ', '重さ', '温度', '体積', 'メートル', 'キログラム', '摂氏']
    },
    category: {
      ko: '계산 도구',
      en: 'Calculation Tools',
      ja: '計算ツール'
    },
    tags: ['conversion', 'unit', 'measurement'],
    popularity: 82
  },
  {
    id: 'date-calculator',
    path: '/date-calculator',
    title: {
      ko: '날짜 계산기',
      en: 'Date Calculator',
      ja: '日付計算機'
    },
    description: {
      ko: '두 날짜 사이의 차이를 계산하거나 특정 날짜에서 일수를 더하고 빼는 계산기입니다.',
      en: 'Calculator to find the difference between two dates or add/subtract days from a specific date.',
      ja: '二つの日付の差を計算したり、特定の日付から日数を足し引きする計算機です。'
    },
    keywords: {
      ko: ['날짜', '계산', '차이', '일수', '기간', '달력', '디데이'],
      en: ['date', 'calculate', 'difference', 'days', 'period', 'calendar', 'd-day'],
      ja: ['日付', '計算', '差', '日数', '期間', 'カレンダー', 'D-DAY']
    },
    category: {
      ko: '계산 도구',
      en: 'Calculation Tools',
      ja: '計算ツール'
    },
    tags: ['date', 'calculator', 'time'],
    popularity: 78
  },
  {
    id: 'mbti',
    path: '/mbti',
    title: {
      ko: 'MBTI 성격유형 테스트',
      en: 'MBTI Personality Test',
      ja: 'MBTI性格タイプテスト'
    },
    description: {
      ko: '16가지 MBTI 성격유형을 알아보는 테스트. 10가지 스타일로 테스트할 수 있습니다.',
      en: 'Test to discover your MBTI personality type among 16 types. Available in 10 different styles.',
      ja: '16種類のMBTI性格タイプを調べるテスト。10種類のスタイルでテストできます。'
    },
    keywords: {
      ko: ['MBTI', '성격', '심리', '테스트', '유형', '분석', '심리테스트', '성격유형'],
      en: ['MBTI', 'personality', 'psychology', 'test', 'type', 'analysis', 'psychological test', 'personality type'],
      ja: ['MBTI', '性格', '心理', 'テスト', 'タイプ', '分析', '心理テスト', '性格タイプ']
    },
    category: {
      ko: '성격 테스트',
      en: 'Personality Tests',
      ja: '性格テスト'
    },
    tags: ['personality', 'test', 'psychology'],
    popularity: 92
  },
  {
    id: 'teto-egen',
    path: '/teto-egen-test',
    title: {
      ko: '테토-에겐 성격유형 테스트',
      en: 'Teto-Egen Personality Test',
      ja: 'テト-エゲン性格タイプテスト'
    },
    description: {
      ko: '화제의 테토-에겐 성격유형 테스트! 당신은 테토형인가요, 에겐형인가요?',
      en: 'Trending Teto-Egen personality test! Are you a Teto type or Egen type?',
      ja: '話題のテト-エゲン性格タイプテスト！あなたはテトタイプ？エゲンタイプ？'
    },
    keywords: {
      ko: ['테토', '에겐', '성격', '테스트', '밈', '바이럴', '성격유형', '궁합'],
      en: ['teto', 'egen', 'personality', 'test', 'meme', 'viral', 'personality type', 'compatibility'],
      ja: ['テト', 'エゲン', '性格', 'テスト', 'ミーム', 'バイラル', '性格タイプ', '相性']
    },
    category: {
      ko: '성격 테스트',
      en: 'Personality Tests',
      ja: '性格テスト'
    },
    tags: ['personality', 'test', 'viral', 'meme'],
    popularity: 98
  }
];

// 언어 감지 함수
export function detectLanguage(query: string): 'ko' | 'en' | 'ja' | 'auto' {
  const koreanRegex = /[가-힣]/;
  const japaneseRegex = /[ひらがなカタカナ]/;
  const englishRegex = /^[a-zA-Z\s\-_]+$/;

  if (koreanRegex.test(query)) return 'ko';
  if (japaneseRegex.test(query)) return 'ja';
  if (englishRegex.test(query)) return 'en';
  return 'auto';
}

// 다국어 검색 함수
export function searchTools(query: string, currentLanguage: string = 'ko'): ToolSearchData[] {
  if (!query.trim()) return toolsSearchData;

  const normalizedQuery = query.toLowerCase().trim();
  const detectedLang = detectLanguage(query);
  
  // 검색할 언어 우선순위 설정
  const currentLang = (currentLanguage as 'ko' | 'en' | 'ja') || 'ko';
  let searchLanguages: Array<'ko' | 'en' | 'ja'>;
  
  if (detectedLang === 'auto') {
    const langSet = new Set<'ko' | 'en' | 'ja'>([currentLang, 'ko', 'en', 'ja']);
    searchLanguages = Array.from(langSet);
  } else {
    const langSet = new Set<'ko' | 'en' | 'ja'>([detectedLang, currentLang, 'ko', 'en', 'ja']);
    searchLanguages = Array.from(langSet);
  }

  const results = toolsSearchData.map(tool => {
    let score = 0;
    let matchedFields: string[] = [];

    // 각 언어에서 검색
    for (const lang of searchLanguages) {
      // 제목 검색 (가중치: 10)
      if (tool.title[lang].toLowerCase().includes(normalizedQuery)) {
        score += 10;
        matchedFields.push(`title_${lang}`);
      }

      // 설명 검색 (가중치: 5)
      if (tool.description[lang].toLowerCase().includes(normalizedQuery)) {
        score += 5;
        matchedFields.push(`description_${lang}`);
      }

      // 키워드 검색 (가중치: 8)
      for (const keyword of tool.keywords[lang]) {
        if (keyword.toLowerCase().includes(normalizedQuery)) {
          score += 8;
          matchedFields.push(`keyword_${lang}`);
          break;
        }
      }

      // 카테고리 검색 (가중치: 6)
      if (tool.category[lang].toLowerCase().includes(normalizedQuery)) {
        score += 6;
        matchedFields.push(`category_${lang}`);
      }
    }

    // 태그 검색 (가중치: 4)
    for (const tag of tool.tags) {
      if (tag.toLowerCase().includes(normalizedQuery)) {
        score += 4;
        matchedFields.push('tag');
        break;
      }
    }

    // 정확한 일치에 보너스 점수
    for (const lang of searchLanguages) {
      if (tool.title[lang].toLowerCase() === normalizedQuery) {
        score += 20;
      }
      if (tool.keywords[lang].some(keyword => keyword.toLowerCase() === normalizedQuery)) {
        score += 15;
      }
    }

    // 인기도 점수 반영 (최대 2점)
    score += (tool.popularity / 100) * 2;

    return {
      ...tool,
      searchScore: score,
      matchedFields
    };
  })
  .filter(tool => tool.searchScore > 0)
  .sort((a, b) => b.searchScore - a.searchScore);

  return results;
}

// 자동완성을 위한 제안 함수
export function getSearchSuggestions(query: string, currentLanguage: string = 'ko', limit: number = 5): string[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const detectedLang = detectLanguage(query);
  const searchLang = detectedLang === 'auto' ? currentLanguage as 'ko' | 'en' | 'ja' : detectedLang;

  const suggestions = new Set<string>();

  toolsSearchData.forEach(tool => {
    // 제목에서 제안
    if (tool.title[searchLang].toLowerCase().includes(normalizedQuery)) {
      suggestions.add(tool.title[searchLang]);
    }

    // 키워드에서 제안
    tool.keywords[searchLang].forEach(keyword => {
      if (keyword.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(keyword);
      }
    });

    // 카테고리에서 제안
    if (tool.category[searchLang].toLowerCase().includes(normalizedQuery)) {
      suggestions.add(tool.category[searchLang]);
    }
  });

  return Array.from(suggestions).slice(0, limit);
}

// 인기 검색어 함수
export function getPopularSearchTerms(currentLanguage: string = 'ko'): string[] {
  const lang = currentLanguage as 'ko' | 'en' | 'ja';
  
  return toolsSearchData
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8)
    .map(tool => tool.title[lang]);
}

// 카테고리별 도구 함수
export function getToolsByCategory(currentLanguage: string = 'ko'): Record<string, ToolSearchData[]> {
  const lang = currentLanguage as 'ko' | 'en' | 'ja';
  const categories: Record<string, ToolSearchData[]> = {};

  toolsSearchData.forEach(tool => {
    const category = tool.category[lang];
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(tool);
  });

  // 각 카테고리 내에서 인기도순으로 정렬
  Object.keys(categories).forEach(category => {
    categories[category].sort((a, b) => b.popularity - a.popularity);
  });

  return categories;
}