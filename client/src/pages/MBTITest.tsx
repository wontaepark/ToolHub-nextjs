import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Share2, RefreshCw, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdSense from '@/components/AdSense';

interface Question {
  id: number;
  text: {
    ko: string;
    en: string;
    ja: string;
  };
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  weight: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}

interface TestStyle {
  id: string;
  name: {
    ko: string;
    en: string;
    ja: string;
  };
  description: {
    ko: string;
    en: string;
    ja: string;
  };
  emoji: string;
}

interface MBTIResult {
  type: string;
  name: {
    ko: string;
    en: string;
    ja: string;
  };
  description: {
    ko: string;
    en: string;
    ja: string;
  };
  traits: {
    ko: string[];
    en: string[];
    ja: string[];
  };
  careers: {
    ko: string[];
    en: string[];
    ja: string[];
  };
  famous: {
    ko: string[];
    en: string[];
    ja: string[];
  };
}

const testStyles: TestStyle[] = [
  {
    id: 'balance',
    name: {
      ko: '밸런스 게임 스타일',
      en: 'Balance Game Style',
      ja: 'バランスゲームスタイル'
    },
    description: {
      ko: '선택의 딜레마로 성격을 알아보세요',
      en: 'Discover your personality through choice dilemmas',
      ja: '選択のジレンマで性格を知る'
    },
    emoji: '⚖️'
  },
  {
    id: 'workplace',
    name: {
      ko: '회사 생활 유형',
      en: 'Workplace Personality',
      ja: '会社生活タイプ'
    },
    description: {
      ko: '직장에서의 행동 패턴으로 분석',
      en: 'Analyze through workplace behavior patterns',
      ja: '職場での行動パターンで分析'
    },
    emoji: '🏢'
  },
  {
    id: 'routine',
    name: {
      ko: '하루 루틴',
      en: 'Daily Routine',
      ja: '一日のルーティン'
    },
    description: {
      ko: '일상 습관으로 성격 파악',
      en: 'Understand personality through daily habits',
      ja: '日常習慣で性格把握'
    },
    emoji: '🌅'
  },
  {
    id: 'lifestyle',
    name: {
      ko: '일상 기반',
      en: 'Lifestyle Based',
      ja: '日常ベース'
    },
    description: {
      ko: '평범한 일상 속 선택들',
      en: 'Choices in ordinary daily life',
      ja: '平凡な日常の中の選択'
    },
    emoji: '🏠'
  },
  {
    id: 'romance',
    name: {
      ko: '연애 기반',
      en: 'Romance Based',
      ja: '恋愛ベース'
    },
    description: {
      ko: '연애 상황에서의 성향 분석',
      en: 'Analyze tendencies in romantic situations',
      ja: '恋愛状況での性向分析'
    },
    emoji: '💕'
  },
  {
    id: 'professional',
    name: {
      ko: '직장인 컨셉',
      en: 'Professional Concept',
      ja: 'ビジネスマンコンセプト'
    },
    description: {
      ko: '업무 환경에서의 성격 유형',
      en: 'Personality types in work environment',
      ja: '業務環境での性格タイプ'
    },
    emoji: '💼'
  },
  {
    id: 'social',
    name: {
      ko: '소셜 미디어',
      en: 'Social Media',
      ja: 'ソーシャルメディア'
    },
    description: {
      ko: 'SNS 활동으로 보는 성격',
      en: 'Personality through SNS activities',
      ja: 'SNS活動で見る性格'
    },
    emoji: '📱'
  },
  {
    id: 'travel',
    name: {
      ko: '여행 스타일',
      en: 'Travel Style',
      ja: '旅行スタイル'
    },
    description: {
      ko: '여행 패턴으로 알아보는 성격',
      en: 'Personality through travel patterns',
      ja: '旅行パターンで知る性格'
    },
    emoji: '✈️'
  },
  {
    id: 'study',
    name: {
      ko: '학습 방식',
      en: 'Learning Style',
      ja: '学習方式'
    },
    description: {
      ko: '공부하는 방법으로 성격 분석',
      en: 'Personality analysis through study methods',
      ja: '勉強方法で性格分析'
    },
    emoji: '📚'
  },
  {
    id: 'crisis',
    name: {
      ko: '위기 상황',
      en: 'Crisis Situations',
      ja: '危機状況'
    },
    description: {
      ko: '문제 해결 방식으로 성격 파악',
      en: 'Understand personality through problem-solving approaches',
      ja: '問題解決方式で性格把握'
    },
    emoji: '🚨'
  }
];

const questionSets: Record<string, Question[]> = {
  balance: [
    {
      id: 1,
      text: {
        ko: "⚖️ 친구와 영화 vs 집에서 휴식, 당신의 선택은?",
        en: "⚖️ Movie with friends vs Rest at home, your choice?",
        ja: "⚖️ 友達と映画 vs 家で休息、あなたの選択は？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 2,
      text: {
        ko: "⚖️ 새로운 도전 vs 안정적인 현재, 어떤 것을 선택하시겠습니까?",
        en: "⚖️ New challenge vs Stable present, which would you choose?",
        ja: "⚖️ 新しい挑戦 vs 安定した現在、どちらを選びますか？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 3,
      text: {
        ko: "⚖️ 논리적 판단 vs 감정적 공감, 더 중요한 것은?",
        en: "⚖️ Logical judgment vs Emotional empathy, which is more important?",
        ja: "⚖️ 論理的判断 vs 感情的共感、より重要なのは？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 4,
      text: {
        ko: "⚖️ 계획된 여행 vs 즉흥 여행, 당신의 스타일은?",
        en: "⚖️ Planned trip vs Spontaneous trip, what's your style?",
        ja: "⚖️ 計画された旅行 vs 即興旅行、あなたのスタイルは？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 5,
      text: {
        ko: "⚖️ 큰 파티 vs 소규모 모임, 어디가 더 편하신가요?",
        en: "⚖️ Big party vs Small gathering, where are you more comfortable?",
        ja: "⚖️ 大きなパーティー vs 小規模な集まり、どちらがより快適ですか？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 6,
      text: {
        ko: "⚖️ 구체적인 사실 vs 추상적 아이디어, 더 흥미로운 것은?",
        en: "⚖️ Concrete facts vs Abstract ideas, which is more interesting?",
        ja: "⚖️ 具体的な事実 vs 抽象的なアイデア、より興味深いのは？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 7,
      text: {
        ko: "⚖️ 객관적 분석 vs 개인적 가치, 결정할 때 더 중시하는 것은?",
        en: "⚖️ Objective analysis vs Personal values, what do you prioritize when deciding?",
        ja: "⚖️ 客観的分析 vs 個人的価値、決定する時により重視するのは？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 8,
      text: {
        ko: "⚖️ 미리 준비 vs 그때그때 대응, 당신의 방식은?",
        en: "⚖️ Prepare in advance vs Deal with it when it comes, your approach?",
        ja: "⚖️ 事前準備 vs その時その時対応、あなたの方式は？"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 9,
      text: {
        ko: "⚖️ 에너지 충전: 사람들과 함께 vs 혼자 시간",
        en: "⚖️ Energy recharge: With people vs Alone time",
        ja: "⚖️ エネルギー充電：人々と一緒 vs 一人の時間"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 10,
      text: {
        ko: "⚖️ 현실적 해결책 vs 창의적 아이디어, 더 선호하는 것은?",
        en: "⚖️ Realistic solutions vs Creative ideas, which do you prefer?",
        ja: "⚖️ 現実的解決策 vs 創造的アイデア、より好むのは？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 11,
      text: {
        ko: "⚖️ 공정한 규칙 vs 개별 상황 고려, 더 중요한 것은?",
        en: "⚖️ Fair rules vs Individual situation consideration, which is more important?",
        ja: "⚖️ 公正なルール vs 個別状況考慮、より重要なのは？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 12,
      text: {
        ko: "⚖️ 체계적 계획 vs 유연한 적응, 당신의 스타일은?",
        en: "⚖️ Systematic planning vs Flexible adaptation, your style?",
        ja: "⚖️ 体系的計画 vs 柔軟な適応、あなたのスタイルは？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 13,
      text: {
        ko: "⚖️ 많은 사람과 넓은 관계 vs 소수와 깊은 관계",
        en: "⚖️ Wide relationships with many vs Deep relationships with few",
        ja: "⚖️ 多くの人と広い関係 vs 少数と深い関係"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 14,
      text: {
        ko: "⚖️ 검증된 방법 vs 새로운 시도, 더 신뢰하는 것은?",
        en: "⚖️ Proven methods vs New attempts, which do you trust more?",
        ja: "⚖️ 検証された方法 vs 新しい試み、より信頼するのは？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 15,
      text: {
        ko: "⚖️ 논리적 일관성 vs 감정적 조화, 더 추구하는 것은?",
        en: "⚖️ Logical consistency vs Emotional harmony, which do you pursue more?",
        ja: "⚖️ 論理的一貫性 vs 感情的調和、より追求するのは？"
      },
      dimension: 'TF',
      weight: 'F'
    }
  ],
  
  workplace: [
    {
      id: 1,
      text: {
        ko: "🏢 회사 회식 자리에서 당신은?",
        en: "🏢 At a company dinner, you:",
        ja: "🏢 会社の飲み会で、あなたは？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 2,
      text: {
        ko: "🏢 새로운 프로젝트를 시작할 때 먼저 하는 일은?",
        en: "🏢 When starting a new project, what do you do first?",
        ja: "🏢 新しいプロジェクトを始める時、まず何をしますか？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 3,
      text: {
        ko: "🏢 동료와 의견 충돌이 생겼을 때?",
        en: "🏢 When you have a disagreement with a colleague?",
        ja: "🏢 同僚と意見が対立した時？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 4,
      text: {
        ko: "🏢 업무 스케줄 관리 방식은?",
        en: "🏢 How do you manage your work schedule?",
        ja: "🏢 業務スケジュール管理方式は？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 5,
      text: {
        ko: "🏢 점심시간에 선호하는 활동은?",
        en: "🏢 What do you prefer to do during lunch break?",
        ja: "🏢 昼休みに好む活動は？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 6,
      text: {
        ko: "🏢 새로운 업무 도구를 배울 때?",
        en: "🏢 When learning new work tools?",
        ja: "🏢 新しい業務ツールを学ぶ時？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 7,
      text: {
        ko: "🏢 팀 회의에서 당신의 역할은?",
        en: "🏢 Your role in team meetings?",
        ja: "🏢 チーム会議でのあなたの役割は？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 8,
      text: {
        ko: "🏢 마감 임박한 업무에 대한 접근법은?",
        en: "🏢 Your approach to urgent deadlines?",
        ja: "🏢 締切間近の業務に対するアプローチは？"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 9,
      text: {
        ko: "🏢 네트워킹 이벤트에서?",
        en: "🏢 At networking events?",
        ja: "🏢 ネットワーキングイベントで？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 10,
      text: {
        ko: "🏢 문제 해결 시 중요하게 생각하는 것은?",
        en: "🏢 What's important when solving problems?",
        ja: "🏢 問題解決時に重要に思うことは？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 11,
      text: {
        ko: "🏢 동료에게 피드백을 줄 때?",
        en: "🏢 When giving feedback to colleagues?",
        ja: "🏢 同僚にフィードバックをする時？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 12,
      text: {
        ko: "🏢 업무 계획을 세울 때?",
        en: "🏢 When making work plans?",
        ja: "🏢 業務計画を立てる時？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 13,
      text: {
        ko: "🏢 업무 후 동료들과의 시간?",
        en: "🏢 Time with colleagues after work?",
        ja: "🏢 業務後の同僚との時間？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 14,
      text: {
        ko: "🏢 혁신적인 아이디어를 제안할 때?",
        en: "🏢 When proposing innovative ideas?",
        ja: "🏢 革新的なアイデアを提案する時？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 15,
      text: {
        ko: "🏢 성과 평가에서 중시하는 것은?",
        en: "🏢 What you value in performance reviews?",
        ja: "🏢 成果評価で重視することは？"
      },
      dimension: 'TF',
      weight: 'F'
    }
  ],
  
  // Add other question sets with placeholder questions for now
  routine: [
    { id: 1, text: { ko: "🌅 아침 첫 시간", en: "🌅 First morning hour", ja: "🌅 朝の最初の時間" }, dimension: 'EI' as const, weight: 'I' as const }
  ],
  lifestyle: [
    { id: 1, text: { ko: "🏠 일상 선택", en: "🏠 Daily choices", ja: "🏠 日常の選択" }, dimension: 'EI' as const, weight: 'I' as const }
  ],
  romance: [
    { id: 1, text: { ko: "💕 연애 스타일", en: "💕 Dating style", ja: "💕 恋愛スタイル" }, dimension: 'EI' as const, weight: 'E' as const }
  ],
  professional: [
    { id: 1, text: { ko: "💼 전문성", en: "💼 Professionalism", ja: "💼 プロフェッショナリズム" }, dimension: 'JP' as const, weight: 'J' as const }
  ],
  social: [
    { id: 1, text: { ko: "📱 소셜 활동", en: "📱 Social activities", ja: "📱 ソーシャル活動" }, dimension: 'EI' as const, weight: 'E' as const }
  ],
  travel: [
    { id: 1, text: { ko: "✈️ 여행 방식", en: "✈️ Travel style", ja: "✈️ 旅行方式" }, dimension: 'SN' as const, weight: 'S' as const }
  ],
  study: [
    { id: 1, text: { ko: "📚 학습법", en: "📚 Learning method", ja: "📚 学習法" }, dimension: 'SN' as const, weight: 'S' as const }
  ],
  crisis: [
    { id: 1, text: { ko: "🚨 위기 대응", en: "🚨 Crisis response", ja: "🚨 危機対応" }, dimension: 'TF' as const, weight: 'T' as const }
  ]
};

// Function to get style-specific answer options
const getAnswerOptions = (questionId: number, style: string, lang: 'ko' | 'en' | 'ja') => {
  if (style === 'balance') {
    return [
      { value: 1, label: { ko: "첫 번째 선택", en: "First choice", ja: "最初の選択" }[lang] },
      { value: 2, label: { ko: "첫 번째에 가까움", en: "Closer to first", ja: "最初に近い" }[lang] },
      { value: 3, label: { ko: "중간", en: "Middle", ja: "中間" }[lang] },
      { value: 4, label: { ko: "두 번째에 가까움", en: "Closer to second", ja: "二番目に近い" }[lang] },
      { value: 5, label: { ko: "두 번째 선택", en: "Second choice", ja: "二番目の選択" }[lang] }
    ];
  }
  
  // Default options for other styles
  return [
    { value: 1, label: { ko: "전혀 그렇지 않다", en: "Strongly Disagree", ja: "全くそうではない" }[lang] },
    { value: 2, label: { ko: "그렇지 않다", en: "Disagree", ja: "そうではない" }[lang] },
    { value: 3, label: { ko: "보통이다", en: "Neutral", ja: "普通" }[lang] },
    { value: 4, label: { ko: "그렇다", en: "Agree", ja: "そうだ" }[lang] },
    { value: 5, label: { ko: "매우 그렇다", en: "Strongly Agree", ja: "非常にそうだ" }[lang] }
  ];
};

const mbtiResults: Record<string, MBTIResult> = {
  INTJ: {
    type: "INTJ",
    name: { ko: "전략가", en: "The Architect", ja: "建築家" },
    description: {
      ko: "혁신적인 아이디어와 뛰어난 실행력을 가진 완벽주의자입니다.",
      en: "A perfectionist with innovative ideas and excellent execution.",
      ja: "革新的なアイデアと優れた実行力を持つ完璧主義者です。"
    },
    traits: {
      ko: ["독립적", "전략적", "완벽주의", "미래지향적"],
      en: ["Independent", "Strategic", "Perfectionist", "Future-oriented"],
      ja: ["独立的", "戦略的", "完璧主義", "未来志向"]
    },
    careers: {
      ko: ["과학자", "엔지니어", "건축가", "전략기획자"],
      en: ["Scientist", "Engineer", "Architect", "Strategic Planner"],
      ja: ["科学者", "エンジニア", "建築家", "戦略企画者"]
    },
    famous: {
      ko: ["일론 머스크", "스티븐 호킹", "니콜라 테슬라"],
      en: ["Elon Musk", "Stephen Hawking", "Nikola Tesla"],
      ja: ["イーロン・マスク", "スティーブン・ホーキング", "ニコラ・テスラ"]
    }
  },
  // Add other MBTI results with similar structure...
  INTP: {
    type: "INTP",
    name: { ko: "사색가", en: "The Thinker", ja: "思想家" },
    description: { ko: "호기심 많은 이론가", en: "Curious theorist", ja: "好奇心旺盛な理論家" },
    traits: { ko: ["분석적"], en: ["Analytical"], ja: ["分析的"] },
    careers: { ko: ["연구원"], en: ["Researcher"], ja: ["研究者"] },
    famous: { ko: ["아인슈타인"], en: ["Einstein"], ja: ["アインシュタイン"] }
  }
};

export default function MBTITest() {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [mbtiType, setMbtiType] = useState<string>('');

  const currentLang = i18n.language as 'ko' | 'en' | 'ja';
  const questions = selectedStyle ? questionSets[selectedStyle] : [];

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setMbtiType('');
  };

  const handleAnswer = (questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const calculateMBTI = () => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        if (answer > 3) {
          scores[question.weight] += answer - 3;
        } else if (answer < 3) {
          const oppositeWeight = question.weight === 'E' ? 'I' : 
                                question.weight === 'I' ? 'E' :
                                question.weight === 'S' ? 'N' :
                                question.weight === 'N' ? 'S' :
                                question.weight === 'T' ? 'F' :
                                question.weight === 'F' ? 'T' :
                                question.weight === 'J' ? 'P' : 'J';
          scores[oppositeWeight] += 3 - answer;
        }
      }
    });

    const type = (scores.E > scores.I ? 'E' : 'I') +
                 (scores.S > scores.N ? 'S' : 'N') +
                 (scores.T > scores.F ? 'T' : 'F') +
                 (scores.J > scores.P ? 'J' : 'P');
    
    setMbtiType(type);
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateMBTI();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetTest = () => {
    setSelectedStyle(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setMbtiType('');
  };

  const shareResult = () => {
    const result = mbtiResults[mbtiType] || mbtiResults.INTJ;
    const shareText = `내 MBTI는 ${result.type} - ${result.name[currentLang]}입니다! ToolHub.tools에서 확인해보세요!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'MBTI 성격유형 테스트 결과',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText + ' ' + window.location.href);
    }
  };

  // Style Selection Screen
  if (!selectedStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {currentLang === 'ko' ? 'MBTI 성격유형 테스트' : 
               currentLang === 'ja' ? 'MBTI性格タイプテスト' : 'MBTI Personality Test'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {currentLang === 'ko' ? '테스트 스타일을 선택해주세요' : 
               currentLang === 'ja' ? 'テストスタイルを選択してください' : 
               'Choose your test style'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testStyles.map((style) => (
              <Card 
                key={style.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => handleStyleSelect(style.id)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{style.emoji}</div>
                  <CardTitle className="text-lg">{style.name[currentLang]}</CardTitle>
                  <CardDescription>{style.description[currentLang]}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <AdSense adSlot="1234567894" className="w-full max-w-4xl" />
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (showResult && mbtiType && mbtiResults[mbtiType]) {
    const result = mbtiResults[mbtiType];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {currentLang === 'ko' ? 'MBTI 테스트 결과' : 
               currentLang === 'ja' ? 'MBTIテスト結果' : 'MBTI Test Result'}
            </h1>
          </div>

          <Card className="shadow-2xl mb-8">
            <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <div className="text-6xl font-bold mb-4">{result.type}</div>
              <CardTitle className="text-2xl mb-2">{result.name[currentLang]}</CardTitle>
              <CardDescription className="text-purple-100 text-lg">
                {result.description[currentLang]}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex gap-4 mt-8">
                <Button onClick={shareResult} className="flex-1" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  {currentLang === 'ko' ? '결과 공유' : 
                   currentLang === 'ja' ? '結果をシェア' : 'Share Result'}
                </Button>
                <Button onClick={resetTest} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {currentLang === 'ko' ? '다시 테스트' : 
                   currentLang === 'ja' ? '再テスト' : 'Retake Test'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mb-8">
            <AdSense adSlot="1234567893" className="w-full max-w-4xl" />
          </div>
        </div>
      </div>
    );
  }

  // Question Screen
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const selectedStyleInfo = testStyles.find(s => s.id === selectedStyle);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedStyle(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentLang === 'ko' ? '스타일 변경' : 
             currentLang === 'ja' ? 'スタイル変更' : 'Change Style'}
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {selectedStyleInfo?.emoji} {selectedStyleInfo?.name[currentLang]}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedStyleInfo?.description[currentLang]}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentLang === 'ko' ? '진행상황' : 
               currentLang === 'ja' ? '進行状況' : 'Progress'}
            </span>
            <span className="text-sm text-gray-500">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentLang === 'ko' ? `질문 ${currentQuestion + 1}` : 
               currentLang === 'ja' ? `質問 ${currentQuestion + 1}` : 
               `Question ${currentQuestion + 1}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                {questions[currentQuestion]?.text[currentLang]}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {getAnswerOptions(questions[currentQuestion]?.id, selectedStyle, currentLang).map((option) => (
                <Button
                  key={option.value}
                  variant={answers[questions[currentQuestion]?.id] === option.value ? "default" : "outline"}
                  className="w-full justify-start p-4 h-auto text-left"
                  onClick={() => handleAnswer(questions[currentQuestion]?.id, option.value)}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-current mr-3 flex items-center justify-center flex-shrink-0">
                    {answers[questions[currentQuestion]?.id] === option.value && (
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                    )}
                  </div>
                  <span className="text-sm leading-relaxed">{option.label}</span>
                </Button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {currentLang === 'ko' ? '이전' : currentLang === 'ja' ? '前へ' : 'Previous'}
              </Button>
              
              <Button
                onClick={nextQuestion}
                disabled={answers[questions[currentQuestion]?.id] === undefined}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {currentQuestion === questions.length - 1 ? (
                  currentLang === 'ko' ? '결과 보기' : currentLang === 'ja' ? '結果を見る' : 'See Results'
                ) : (
                  <>
                    {currentLang === 'ko' ? '다음' : currentLang === 'ja' ? '次へ' : 'Next'}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <AdSense adSlot="1234567894" className="w-full max-w-2xl" />
        </div>
      </div>
    </div>
  );
}