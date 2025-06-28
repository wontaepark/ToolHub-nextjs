export interface Tool {
  id: string;
  names: {
    ko: string;
    en: string;
    ja: string;
  };
  descriptions: {
    ko: string;
    en: string;
    ja: string;
  };
  keywords: {
    ko: string[];
    en: string[];
    ja: string[];
  };
  url: string;
}

export const toolsData: Tool[] = [
  {
    id: "calculator",
    names: {
      ko: "계산기",
      en: "Calculator",
      ja: "電卓"
    },
    descriptions: {
      ko: "기본 사칙연산과 과학적 계산을 수행하는 전문 계산기",
      en: "Professional calculator for basic arithmetic and scientific calculations",
      ja: "基本的な四則演算と科学計算を行う専門電卓"
    },
    keywords: {
      ko: ["계산", "사칙연산", "수학", "더하기", "빼기", "곱하기", "나누기", "공학용"],
      en: ["calculation", "arithmetic", "math", "add", "subtract", "multiply", "divide", "scientific"],
      ja: ["計算", "算数", "数学", "足し算", "引き算", "掛け算", "割り算", "科学"]
    },
    url: "/calculator"
  },
  {
    id: "pomodoro-timer",
    names: {
      ko: "포모도로 타이머",
      en: "Pomodoro Timer",
      ja: "ポモドーロタイマー"
    },
    descriptions: {
      ko: "집중력 향상과 생산성 극대화를 위한 포모도로 기법 타이머",
      en: "Pomodoro technique timer for enhanced focus and maximum productivity",
      ja: "集中力向上と生産性最大化のためのポモドーロ技法タイマー"
    },
    keywords: {
      ko: ["포모도로", "타이머", "집중", "시간관리", "생산성", "휴식", "작업", "효율"],
      en: ["pomodoro", "timer", "focus", "time management", "productivity", "break", "work", "efficiency"],
      ja: ["ポモドーロ", "タイマー", "集中", "時間管理", "生産性", "休憩", "作業", "効率"]
    },
    url: "/pomodoro-timer"
  },
  {
    id: "timer",
    names: {
      ko: "범위 타이머",
      en: "Range Timer",
      ja: "レンジタイマー"
    },
    descriptions: {
      ko: "다양한 용도로 사용할 수 있는 맞춤형 범위 타이머",
      en: "Customizable range timer for various purposes and activities",
      ja: "様々な用途に使える カスタマイズ可能なレンジタイマー"
    },
    keywords: {
      ko: ["타이머", "시간", "알람", "카운트다운", "스톱워치", "요리", "운동"],
      en: ["timer", "time", "alarm", "countdown", "stopwatch", "cooking", "exercise"],
      ja: ["タイマー", "時間", "アラーム", "カウントダウン", "ストップウォッチ", "料理", "運動"]
    },
    url: "/timer"
  },
  {
    id: "number-raffle",
    names: {
      ko: "번호 추첨기",
      en: "Number Raffle",
      ja: "番号抽選器"
    },
    descriptions: {
      ko: "공정하고 무작위적인 번호 추첨을 위한 전문 도구",
      en: "Professional tool for fair and random number drawing",
      ja: "公正で無作為な番号抽選のための専門ツール"
    },
    keywords: {
      ko: ["추첨", "번호", "랜덤", "무작위", "복권", "게임", "선택"],
      en: ["raffle", "number", "random", "lottery", "draw", "game", "selection"],
      ja: ["抽選", "番号", "ランダム", "無作為", "宝くじ", "ゲーム", "選択"]
    },
    url: "/number-raffle"
  },
  {
    id: "youtube-thumbnail",
    names: {
      ko: "유튜브 썸네일 다운로더",
      en: "YouTube Thumbnail Downloader",
      ja: "YouTubeサムネイルダウンローダー"
    },
    descriptions: {
      ko: "유튜브 동영상의 고화질 썸네일을 쉽게 다운로드하는 도구",
      en: "Easy tool to download high-quality thumbnails from YouTube videos",
      ja: "YouTube動画の高画質サムネイルを簡単にダウンロードするツール"
    },
    keywords: {
      ko: ["유튜브", "썸네일", "다운로드", "이미지", "동영상", "고화질"],
      en: ["youtube", "thumbnail", "download", "image", "video", "high quality"],
      ja: ["YouTube", "サムネイル", "ダウンロード", "画像", "動画", "高画質"]
    },
    url: "/thumbnail-downloader"
  },
  {
    id: "password-generator",
    names: {
      ko: "비밀번호 생성기",
      en: "Password Generator",
      ja: "パスワード生成器"
    },
    descriptions: {
      ko: "강력하고 안전한 비밀번호를 생성하는 보안 도구",
      en: "Security tool for generating strong and secure passwords",
      ja: "強力で安全なパスワードを生成するセキュリティツール"
    },
    keywords: {
      ko: ["비밀번호", "생성", "보안", "암호", "패스워드", "안전", "강력"],
      en: ["password", "generator", "security", "strong", "secure", "safe", "random"],
      ja: ["パスワード", "生成", "セキュリティ", "強力", "安全", "ランダム"]
    },
    url: "/password-generator"
  },
  {
    id: "unit-converter",
    names: {
      ko: "단위 변환기",
      en: "Unit Converter",
      ja: "単位変換器"
    },
    descriptions: {
      ko: "길이, 무게, 온도 등 다양한 단위를 정확하게 변환하는 도구",
      en: "Accurate tool for converting various units like length, weight, temperature",
      ja: "長さ、重さ、温度など様々な単位を正確に変換するツール"
    },
    keywords: {
      ko: ["단위", "변환", "길이", "무게", "온도", "부피", "면적", "압력"],
      en: ["unit", "converter", "length", "weight", "temperature", "volume", "area", "pressure"],
      ja: ["単位", "変換", "長さ", "重さ", "温度", "体積", "面積", "圧力"]
    },
    url: "/unit-converter"
  },
  {
    id: "date-calculator",
    names: {
      ko: "날짜 계산기",
      en: "Date Calculator",
      ja: "日付計算機"
    },
    descriptions: {
      ko: "두 날짜 간의 차이를 계산하고 날짜를 더하거나 빼는 도구",
      en: "Tool to calculate differences between dates and add or subtract dates",
      ja: "2つの日付間の差を計算し、日付を加算・減算するツール"
    },
    keywords: {
      ko: ["날짜", "계산", "차이", "기간", "달력", "일수", "년월일"],
      en: ["date", "calculator", "difference", "period", "calendar", "days", "duration"],
      ja: ["日付", "計算", "差", "期間", "カレンダー", "日数", "年月日"]
    },
    url: "/date-calculator"
  },
  {
    id: "mbti-test",
    names: {
      ko: "MBTI 성격유형 테스트",
      en: "MBTI Personality Test",
      ja: "MBTI性格タイプテスト"
    },
    descriptions: {
      ko: "16가지 성격 유형을 분석하는 과학적 MBTI 성격유형 테스트",
      en: "Scientific MBTI personality test analyzing 16 personality types",
      ja: "16の性格タイプを分析する科学的MBTI性格タイプテスト"
    },
    keywords: {
      ko: ["MBTI", "성격", "테스트", "유형", "심리", "분석", "16가지", "성향"],
      en: ["MBTI", "personality", "test", "type", "psychology", "analysis", "16types", "traits"],
      ja: ["MBTI", "性格", "テスト", "タイプ", "心理", "分析", "16種類", "性向"]
    },
    url: "/mbti-test"
  },
  {
    id: "teto-egen-test",
    names: {
      ko: "테토-에겐 성격유형 테스트",
      en: "Teto-Egen Personality Test",
      ja: "テト・エゲン性格タイプテスト"
    },
    descriptions: {
      ko: "화제의 테토-에겐 밈 기반 성격유형 테스트와 궁합 분석",
      en: "Trending Teto-Egen meme-based personality test with compatibility analysis",
      ja: "話題のテト・エゲンミームベース性格タイプテストと相性分析"
    },
    keywords: {
      ko: ["테토", "에겐", "성격", "테스트", "밈", "궁합", "연애", "유형"],
      en: ["teto", "egen", "personality", "test", "meme", "compatibility", "dating", "type"],
      ja: ["テト", "エゲン", "性格", "テスト", "ミーム", "相性", "恋愛", "タイプ"]
    },
    url: "/teto-egen-test"
  }
];

// 언어 감지 함수
export function detectLanguage(text: string): 'ko' | 'en' | 'ja' {
  // 한글 패턴
  if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)) return 'ko';
  
  // 일본어 패턴 (히라가나, 가타카나, 한자)
  if (/[ひらがな]|[カタカナ]|[一-龯]/.test(text)) return 'ja';
  
  // 기본값은 영어
  return 'en';
}

// 특정 언어에서 매치 확인
function checkLanguageMatch(tool: Tool, query: string, lang: 'ko' | 'en' | 'ja'): boolean {
  const name = tool.names[lang]?.toLowerCase() || '';
  const description = tool.descriptions[lang]?.toLowerCase() || '';
  const keywords = tool.keywords[lang] || [];
  
  // 이름에서 완전 매치
  if (name.includes(query)) return true;
  
  // 설명에서 매치
  if (description.includes(query)) return true;
  
  // 키워드에서 매치
  return keywords.some(keyword => 
    keyword.toLowerCase().includes(query) || 
    query.includes(keyword.toLowerCase())
  );
}

// 관련도 점수 계산
function calculateRelevanceScore(tool: Tool, query: string, primaryLang: 'ko' | 'en' | 'ja'): number {
  let score = 0;
  
  const name = tool.names[primaryLang]?.toLowerCase() || '';
  const description = tool.descriptions[primaryLang]?.toLowerCase() || '';
  const keywords = tool.keywords[primaryLang] || [];
  
  // 이름 완전 매치 (최고 점수)
  if (name === query) score += 100;
  else if (name.includes(query)) score += 50;
  else if (query.includes(name)) score += 30;
  
  // 키워드 매치
  keywords.forEach(keyword => {
    if (keyword.toLowerCase() === query) score += 80;
    else if (keyword.toLowerCase().includes(query)) score += 40;
    else if (query.includes(keyword.toLowerCase())) score += 20;
  });
  
  // 설명 매치
  if (description.includes(query)) score += 10;
  
  return score;
}

// 다국어 검색 함수
export function searchToolsMultiLanguage(query: string): Tool[] {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  const detectedLang = detectLanguage(query);
  
  const results = toolsData.filter(tool => {
    // 현재 감지된 언어로 검색
    const currentLangMatches = checkLanguageMatch(tool, normalizedQuery, detectedLang);
    
    // 모든 언어에서 검색 (fallback)
    const allLangMatches = (['ko', 'en', 'ja'] as const).some(lang => 
      checkLanguageMatch(tool, normalizedQuery, lang)
    );
    
    return currentLangMatches || allLangMatches;
  });
  
  // 관련도 점수로 정렬
  return results.sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, normalizedQuery, detectedLang);
    const scoreB = calculateRelevanceScore(b, normalizedQuery, detectedLang);
    return scoreB - scoreA;
  });
}

// 자동완성 제안 데이터
export const autocompleteSuggestions = {
  ko: ["계산기", "포모도로", "타이머", "비밀번호", "단위변환", "날짜계산", "MBTI", "테토에겐", "유튜브", "번호추첨"],
  en: ["calculator", "pomodoro", "timer", "password", "converter", "date", "MBTI", "teto-egen", "youtube", "raffle"],
  ja: ["電卓", "ポモドーロ", "タイマー", "パスワード", "変換器", "日付", "MBTI", "テトエゲン", "YouTube", "抽選"]
};

// 자동완성 제안 생성
export function getAutocompleteSuggestions(input: string): string[] {
  if (!input.trim()) return [];
  
  const detectedLang = detectLanguage(input);
  const currentLangSuggestions = autocompleteSuggestions[detectedLang] || [];
  
  // 현재 언어에서 매치되는 제안들 찾기
  const matchingSuggestions = currentLangSuggestions.filter(item => 
    item.toLowerCase().includes(input.toLowerCase())
  );
  
  // 도구 이름에서도 매치되는 것들 찾기
  const toolNameSuggestions = toolsData
    .filter(tool => tool.names[detectedLang].toLowerCase().includes(input.toLowerCase()))
    .map(tool => tool.names[detectedLang])
    .slice(0, 3);
  
  const combined = [...matchingSuggestions, ...toolNameSuggestions];
  const unique = combined.filter((item, index) => combined.indexOf(item) === index);
  return unique.slice(0, 6);
}