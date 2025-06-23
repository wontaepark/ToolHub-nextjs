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
  // Ready for new questions
};
    {
      id: 4,
      text: {
        ko: "현실적 vs 이상적",
        en: "Realistic vs Idealistic",
        ja: "現実的 vs 理想的"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 5,
      text: {
        ko: "구체적 사실 vs 추상적 개념",
        en: "Concrete facts vs Abstract concepts",
        ja: "具体的な事実 vs 抽象的な概念"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 6,
      text: {
        ko: "전통적 방법 vs 혁신적 방법",
        en: "Traditional methods vs Innovative methods",
        ja: "伝統的な方法 vs 革新的な方法"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 7,
      text: {
        ko: "논리적 분석 vs 감정적 공감",
        en: "Logical analysis vs Emotional empathy",
        ja: "論理的分析 vs 感情的共感"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 8,
      text: {
        ko: "객관적 판단 vs 개인적 가치",
        en: "Objective judgment vs Personal values",
        ja: "客観的判断 vs 個人的価値"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 9,
      text: {
        ko: "공정함 vs 배려",
        en: "Fairness vs Consideration",
        ja: "公正さ vs 配慮"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 10,
      text: {
        ko: "미리 계획하기 vs 즉흥적 행동",
        en: "Planning ahead vs Spontaneous action",
        ja: "事前計画 vs 即興的行動"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 11,
      text: {
        ko: "체계적 정리 vs 자유로운 정리",
        en: "Systematic organization vs Free organization",
        ja: "体系的整理 vs 自由な整理"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 12,
      text: {
        ko: "확실한 결정 vs 열린 선택",
        en: "Definite decisions vs Open choices",
        ja: "確実な決定 vs 開かれた選択"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 13,
      text: {
        ko: "규칙 준수 vs 유연성",
        en: "Rule compliance vs Flexibility",
        ja: "ルール遵守 vs 柔軟性"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 14,
      text: {
        ko: "완벽주의 vs 만족주의",
        en: "Perfectionism vs Satisficing",
        ja: "完璧主義 vs 満足主義"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 15,
      text: {
        ko: "안정성 vs 변화",
        en: "Stability vs Change",
        ja: "安定性 vs 変化"
      },
      dimension: 'SN',
      weight: 'S'
    }
  ],
  
  workplace: [
    {
      id: 1,
      text: {
        ko: "회사 회식에서 나는 주로...",
        en: "At company dinners, I usually...",
        ja: "会社の飲み会で私は主に..."
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 2,
      text: {
        ko: "업무 중 혼자 집중할 수 있는 시간이 필요하다.",
        en: "I need time to concentrate alone during work.",
        ja: "業務中に一人で集中できる時間が必要だ。"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 3,
      text: {
        ko: "동료들과 브레인스토밍을 할 때 더 좋은 아이디어가 나온다.",
        en: "Better ideas come when brainstorming with colleagues.",
        ja: "同僚とブレインストーミングをする時により良いアイデアが出る。"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 4,
      text: {
        ko: "업무 지시를 받을 때 구체적인 방법과 절차를 선호한다.",
        en: "I prefer specific methods and procedures when receiving work instructions.",
        ja: "業務指示を受ける時、具体的な方法と手順を好む。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 5,
      text: {
        ko: "기존 방식보다는 새로운 접근법을 시도해보고 싶다.",
        en: "I prefer trying new approaches rather than existing methods.",
        ja: "既存の方式よりも新しいアプローチを試してみたい。"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 6,
      text: {
        ko: "업무를 할 때 세부사항까지 꼼꼼히 확인하는 편이다.",
        en: "I tend to check details thoroughly when working.",
        ja: "業務をする時、詳細まで丁寧に確認する方だ。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 7,
      text: {
        ko: "갈등 상황에서는 논리적으로 문제를 해결하려고 한다.",
        en: "In conflict situations, I try to solve problems logically.",
        ja: "対立状況では論理的に問題を解決しようとする。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 8,
      text: {
        ko: "동료의 감정과 입장을 먼저 이해하려고 노력한다.",
        en: "I try to understand colleagues' feelings and positions first.",
        ja: "同僚の感情と立場をまず理解しようと努力する。"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 9,
      text: {
        ko: "업무 결정을 할 때 객관적인 데이터를 중요하게 생각한다.",
        en: "I consider objective data important when making work decisions.",
        ja: "業務決定をする時、客観的なデータを重要に考える。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 10,
      text: {
        ko: "업무 계획을 미리 세우고 일정에 맞춰 진행하는 것을 선호한다.",
        en: "I prefer making work plans in advance and proceeding according to schedule.",
        ja: "業務計画を事前に立てて日程に合わせて進めることを好む。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 11,
      text: {
        ko: "상황에 따라 유연하게 업무 방식을 조정하는 것이 좋다.",
        en: "It's good to flexibly adjust work methods according to the situation.",
        ja: "状況に応じて柔軟に業務方式を調整することが良い。"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 12,
      text: {
        ko: "일의 마감일은 꼭 지켜야 한다고 생각한다.",
        en: "I think work deadlines must be met.",
        ja: "仕事の締切は必ず守らなければならないと思う。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 13,
      text: {
        ko: "업무 환경이 예측 가능하고 안정적인 것을 선호한다.",
        en: "I prefer a work environment that is predictable and stable.",
        ja: "業務環境が予測可能で安定的なことを好む。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 14,
      text: {
        ko: "급작스러운 업무 변경이나 추가 요청에도 잘 대응할 수 있다.",
        en: "I can handle sudden work changes or additional requests well.",
        ja: "急な業務変更や追加要請にもよく対応できる。"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 15,
      text: {
        ko: "업무를 마칠 때까지 집중해서 끝내는 것을 선호한다.",
        en: "I prefer to focus and finish until the work is complete.",
        ja: "業務を終えるまで集中して終わらせることを好む。"
      },
      dimension: 'JP',
      weight: 'J'
    }
  ],
  
  routine: [
    {
      id: 1,
      text: {
        ko: "아침에 일어나자마자 다른 사람과 대화하는 것을 좋아한다.",
        en: "I like talking to others as soon as I wake up.",
        ja: "朝起きてすぐに他の人と話すことが好きだ。"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 2,
      text: {
        ko: "아침 시간은 조용히 혼자 생각할 수 있는 시간으로 활용한다.",
        en: "I use morning time for quiet thinking alone.",
        ja: "朝の時間は静かに一人で考えられる時間として活用する。"
    },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 3,
      text: {
        ko: "새로운 하루의 가능성에 대해 생각하며 하루를 시작한다.",
        en: "I start the day thinking about new possibilities.",
        ja: "新しい一日の可能性について考えながら一日を始める。"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 4,
      text: {
        ko: "할 일 목록을 만들어 체계적으로 하루를 준비한다.",
        en: "I make a to-do list to systematically prepare for the day.",
        ja: "やることリストを作って体系的に一日を準備する。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 5,
      text: {
        ko: "매일 비슷한 시간에 같은 루틴을 반복하는 것을 선호한다.",
        en: "I prefer repeating the same routine at similar times daily.",
        ja: "毎日似た時間に同じルーティンを繰り返すことを好む。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 6,
      text: {
        ko: "그날그날의 기분에 따라 일정을 조정하는 것을 좋아한다.",
        en: "I like adjusting my schedule according to daily mood.",
        ja: "その日その日の気分に応じてスケジュールを調整することが好きだ。"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 7,
      text: {
        ko: "점심시간에는 동료들과 함께 식사하며 대화하는 것을 즐긴다.",
        en: "I enjoy eating and talking with colleagues during lunch.",
        ja: "昼食時間には同僚と一緒に食事しながら会話することを楽しむ。"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 8,
      text: {
        ko: "점심시간에는 혼자만의 시간을 가지며 재충전한다.",
        en: "I spend lunch time alone to recharge.",
        ja: "昼食時間には一人だけの時間を持って再充電する。"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 9,
      text: {
        ko: "새로운 경험이나 활동을 계획하는 것을 즐긴다.",
        en: "I enjoy planning new experiences or activities.",
        ja: "新しい経験や活動を計画することを楽しむ。"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 10,
      text: {
        ko: "검증된 방법과 익숙한 활동을 선호한다.",
        en: "I prefer proven methods and familiar activities.",
        ja: "検証された方法と慣れ親しんだ活動を好む。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 11,
      text: {
        ko: "하루의 성과를 객관적으로 평가하고 분석한다.",
        en: "I objectively evaluate and analyze daily achievements.",
        ja: "一日の成果を客観的に評価し分析する。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 12,
      text: {
        ko: "하루 동안 만난 사람들과의 관계를 생각하며 마무리한다.",
        en: "I end the day thinking about relationships with people I met.",
        ja: "一日の間に出会った人々との関係を考えながら終える。"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 13,
      text: {
        ko: "내일 할 일을 미리 계획하고 준비한다.",
        en: "I plan and prepare for tomorrow's tasks in advance.",
        ja: "明日することを事前に計画し準備する。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 14,
      text: {
        ko: "내일은 오늘과 다른 새로운 가능성으로 가득할 것이라 생각한다.",
        en: "I think tomorrow will be full of new possibilities different from today.",
        ja: "明日は今日とは違う新しい可能性でいっぱいだろうと思う。"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 15,
      text: {
        ko: "잠들기 전 일정한 시간에 정해진 활동을 하는 것을 좋아한다.",
        en: "I like doing scheduled activities at set times before sleep.",
        ja: "眠る前の一定時間に決められた活動をすることが好きだ。"
      },
      dimension: 'JP',
      weight: 'J'
    }
  ],
  
  lifestyle: [
    {
      id: 1,
      text: {
        ko: "주말에는 친구들과 함께 활동적인 시간을 보내는 것을 선호한다.",
        en: "I prefer spending active time with friends on weekends.",
        ja: "週末には友達と一緒に活動的な時間を過ごすことを好む。"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 2,
      text: {
        ko: "주말에는 집에서 혼자만의 시간을 보내며 휴식하는 것을 선호한다.",
        en: "I prefer spending weekends at home alone, resting.",
        ja: "週末には家で一人だけの時間を過ごし休息することを好む。"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 3,
      text: {
        ko: "일상생활에서 새로운 경험을 추구하고 변화를 즐긴다.",
        en: "I pursue new experiences and enjoy change in daily life.",
        ja: "日常生活で新しい経験を追求し変化を楽しむ。"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 4,
      text: {
        ko: "검증되고 안전한 방법을 선택하는 것을 선호한다.",
        en: "I prefer choosing verified and safe methods.",
        ja: "検証された安全な方法を選択することを好む。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 5,
      text: {
        ko: "쇼핑할 때 실용성과 기능을 먼저 고려한다.",
        en: "I consider practicality and function first when shopping.",
        ja: "買い物する時、実用性と機能をまず考慮する。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 6,
      text: {
        ko: "물건을 살 때 그것이 나와 주변 사람들에게 미칠 영향을 생각한다.",
        en: "When buying things, I think about the impact on me and people around me.",
        ja: "物を買う時、それが私と周りの人々に与える影響を考える。"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 7,
      text: {
        ko: "생활 공간을 체계적으로 정리하고 유지하는 것을 좋아한다.",
        en: "I like organizing and maintaining living spaces systematically.",
        ja: "生活空間を体系的に整理し維持することが好きだ。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 8,
      text: {
        ko: "상황에 따라 유연하게 생활환경을 변경하는 것을 즐긴다.",
        en: "I enjoy flexibly changing my living environment according to situations.",
        ja: "状況に応じて柔軟に生活環境を変更することを楽しむ。"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 9,
      text: {
        ko: "여러 사람과 함께하는 활동에 적극적으로 참여한다.",
        en: "I actively participate in activities with multiple people.",
        ja: "複数の人と一緒にする活動に積極的に参加する。"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 10,
      text: {
        ko: "혼자서 할 수 있는 활동을 통해 에너지를 충전한다.",
        en: "I recharge energy through activities I can do alone.",
        ja: "一人でできる活動を通じてエネルギーを充電する。"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 11,
      text: {
        ko: "미래의 가능성과 잠재력에 대해 자주 생각한다.",
        en: "I often think about future possibilities and potential.",
        ja: "未来の可能性と潜在力についてよく考える。"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 12,
      text: {
        ko: "현재 상황에 집중하고 현실적인 접근을 선호한다.",
        en: "I focus on current situations and prefer realistic approaches.",
        ja: "現在の状況に集中し現実的なアプローチを好む。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 13,
      text: {
        ko: "감정보다는 논리와 사실에 기반해서 결정을 내린다.",
        en: "I make decisions based on logic and facts rather than emotions.",
        ja: "感情よりも論理と事実に基づいて決定を下す。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 14,
      text: {
        ko: "다른 사람들의 감정과 필요를 우선적으로 고려한다.",
        en: "I prioritize others' emotions and needs.",
        ja: "他の人々の感情とニーズを優先的に考慮する。"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 15,
      text: {
        ko: "계획을 세우고 그것을 차근차근 실행하는 것을 선호한다.",
        en: "I prefer making plans and executing them step by step.",
        ja: "計画を立ててそれを着実に実行することを好む。"
      },
      dimension: 'JP',
      weight: 'J'
    }
  ],
  
  romance: [
    {
      id: 1,
      text: {
        ko: "연애할 때 많은 사람들과 함께하는 데이트를 선호한다.",
        en: "I prefer dates with many people when in a relationship.",
        ja: "恋愛する時、多くの人と一緒にするデートを好む。"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 2,
      text: {
        ko: "연인과는 둘만의 조용한 시간을 보내는 것을 더 좋아한다.",
        en: "I prefer spending quiet time alone with my partner.",
        ja: "恋人とは二人だけの静かな時間を過ごすことをより好む。"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 3,
      text: {
        ko: "연애에서 새로운 경험과 모험을 함께 하는 것을 중요하게 생각한다.",
        en: "I value sharing new experiences and adventures together in relationships.",
        ja: "恋愛で新しい経験と冒険を一緒にすることを重要に考える。"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 4,
      text: {
        ko: "연인과의 관계에서 현실적이고 실용적인 측면을 중시한다.",
        en: "I value realistic and practical aspects in relationships.",
        ja: "恋人との関係で現実的で実用的な側面を重視する。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 5,
      text: {
        ko: "연애 문제를 해결할 때 논리적으로 접근하려고 한다.",
        en: "I try to approach relationship problems logically.",
        ja: "恋愛問題を解決する時、論理的にアプローチしようとする。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 6,
      text: {
        ko: "연인의 감정과 기분을 우선적으로 배려한다.",
        en: "I prioritize considering my partner's emotions and feelings.",
        ja: "恋人の感情と気分を優先的に配慮する。"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 7,
      text: {
        ko: "연애 관계에서 계획적이고 안정적인 발전을 선호한다.",
        en: "I prefer planned and stable development in relationships.",
        ja: "恋愛関係で計画的で安定的な発展を好む。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 8,
      text: {
        ko: "연애에서 자연스럽고 즉흥적인 발전을 즐긴다.",
        en: "I enjoy natural and spontaneous development in relationships.",
        ja: "恋愛で自然で即興的な発展を楽しむ。"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 9,
      text: {
        ko: "연인과 함께 사교적인 활동에 참여하는 것을 즐긴다.",
        en: "I enjoy participating in social activities with my partner.",
        ja: "恋人と一緒に社交的な活動に参加することを楽しむ。"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 10,
      text: {
        ko: "연인과의 깊고 의미 있는 대화를 중요하게 생각한다.",
        en: "I value deep and meaningful conversations with my partner.",
        ja: "恋人との深く意味のある会話を重要に考える。"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 11,
      text: {
        ko: "연애에서 창의적이고 독특한 표현 방식을 선호한다.",
        en: "I prefer creative and unique ways of expression in relationships.",
        ja: "恋愛で創造的でユニークな表現方式を好む。"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 12,
      text: {
        ko: "연인에게 실질적이고 유용한 도움을 주는 것을 좋아한다.",
        en: "I like giving practical and useful help to my partner.",
        ja: "恋人に実質的で有用な助けを与えることが好きだ。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 13,
      text: {
        ko: "연애에서 객관적이고 합리적인 판단을 중시한다.",
        en: "I value objective and rational judgment in relationships.",
        ja: "恋愛で客観的で合理的な判断を重視する。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 14,
      text: {
        ko: "연인과의 감정적 연결과 공감을 가장 중요하게 생각한다.",
        en: "I consider emotional connection and empathy with my partner most important.",
        ja: "恋人との感情的つながりと共感を最も重要に考える。"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 15,
      text: {
        ko: "연애에서 명확한 약속과 계획을 정하는 것을 선호한다.",
        en: "I prefer setting clear promises and plans in relationships.",
        ja: "恋愛で明確な約束と計画を決めることを好む。"
      },
      dimension: 'JP',
      weight: 'J'
    }
  ],
  
  professional: [
    {
      id: 1,
      text: {
        ko: "비즈니스 미팅에서 적극적으로 의견을 제시하고 토론에 참여한다.",
        en: "I actively present opinions and participate in discussions during business meetings.",
        ja: "ビジネスミーティングで積極的に意見を提示し討論に参加する。"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 2,
      text: {
        ko: "업무 관련 토론보다는 혼자 집중해서 업무를 처리하는 것을 선호한다.",
        en: "I prefer working alone with focus rather than work-related discussions.",
        ja: "業務関連の討論よりも一人で集中して業務を処理することを好む。"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 3,
      text: {
        ko: "업무에서 혁신적이고 창의적인 접근을 시도하는 것을 좋아한다.",
        en: "I like trying innovative and creative approaches in work.",
        ja: "業務で革新的で創造的なアプローチを試すことが好きだ。"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 4,
      text: {
        ko: "업무에서 검증된 방법과 구체적인 데이터에 의존하는 것을 선호한다.",
        en: "I prefer relying on proven methods and concrete data in work.",
        ja: "業務で検証された方法と具体的なデータに依存することを好む。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 5,
      text: {
        ko: "업무 결정을 할 때 논리와 효율성을 우선적으로 고려한다.",
        en: "I prioritize logic and efficiency when making work decisions.",
        ja: "業務決定をする時、論理と効率性を優先的に考慮する。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 6,
      text: {
        ko: "업무에서 팀원들과의 관계와 분위기를 중요하게 생각한다.",
        en: "I value relationships and atmosphere with team members in work.",
        ja: "業務でチームメンバーとの関係と雰囲気を重要に考える。"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 7,
      text: {
        ko: "업무 계획을 체계적으로 세우고 단계적으로 실행하는 것을 선호한다.",
        en: "I prefer making systematic work plans and executing them step by step.",
        ja: "業務計画を体系的に立てて段階的に実行することを好む。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 8,
      text: {
        ko: "업무에서 유연하게 변화에 적응하고 즉흥적으로 대응하는 것을 좋아한다.",
        en: "I like adapting flexibly to changes and responding spontaneously in work.",
        ja: "業務で柔軟に変化に適応し即興的に対応することが好きだ。"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 9,
      text: {
        ko: "프레젠테이션이나 회의에서 발표하는 것을 즐긴다.",
        en: "I enjoy presenting in presentations or meetings.",
        ja: "プレゼンテーションや会議で発表することを楽しむ。"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 10,
      text: {
        ko: "업무에서 조용한 환경에서 혼자 작업하는 것이 더 효율적이다.",
        en: "Working alone in a quiet environment is more efficient for me in work.",
        ja: "業務で静かな環境で一人で作業することがより効率的だ。"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 11,
      text: {
        ko: "업무에서 미래의 가능성과 잠재적 기회를 탐색하는 것을 즐긴다.",
        en: "I enjoy exploring future possibilities and potential opportunities in work.",
        ja: "業務で未来の可能性と潜在的機会を探索することを楽しむ。"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 12,
      text: {
        ko: "업무에서 현재 상황과 실제적인 제약을 중시한다.",
        en: "I value current situations and practical constraints in work.",
        ja: "業務で現在の状況と実際的な制約を重視する。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 13,
      text: {
        ko: "업무에서 객관적인 분석과 논리적 사고를 중시한다.",
        en: "I value objective analysis and logical thinking in work.",
        ja: "業務で客観的な分析と論理的思考を重視する。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 14,
      text: {
        ko: "업무에서 인간관계와 팀워크를 우선적으로 고려한다.",
        en: "I prioritize human relationships and teamwork in work.",
        ja: "業務で人間関係とチームワークを優先的に考慮する。"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 15,
      text: {
        ko: "업무에서 일정과 마감일을 엄격하게 준수하는 것을 중요하게 생각한다.",
        en: "I consider strictly adhering to schedules and deadlines important in work.",
        ja: "業務でスケジュールと締切を厳格に遵守することを重要に考える。"
      },
      dimension: 'JP',
      weight: 'J'
    }
  ],
  
  social: [
    {
      id: 1,
      text: {
        ko: "SNS에서 많은 사람들과 활발하게 소통하는 것을 즐긴다.",
        en: "I enjoy actively communicating with many people on social media.",
        ja: "SNSで多くの人と活発にコミュニケーションすることを楽しむ。"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 2,
      text: {
        ko: "SNS에서는 소수의 친한 사람들과만 소통하는 것을 선호한다.",
        en: "I prefer communicating only with a few close people on social media.",
        ja: "SNSでは少数の親しい人とだけコミュニケーションすることを好む。"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 3,
      text: {
        ko: "SNS에서 새롭고 창의적인 콘텐츠를 만들어 공유하는 것을 즐긴다.",
        en: "I enjoy creating and sharing new and creative content on social media.",
        ja: "SNSで新しく創造的なコンテンツを作って共有することを楽しむ。"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 4,
      text: {
        ko: "SNS에서는 일상적이고 실용적인 정보를 주로 공유한다.",
        en: "I mainly share daily and practical information on social media.",
        ja: "SNSでは日常的で実用的な情報を主に共有する。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 5,
      text: {
        ko: "SNS에서 논리적이고 객관적인 정보 공유를 중시한다.",
        en: "I value sharing logical and objective information on social media.",
        ja: "SNSで論理的で客観的な情報共有を重視する。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 6,
      text: {
        ko: "SNS에서 감정적 공감과 개인적 경험 공유를 중요하게 생각한다.",
        en: "I value emotional empathy and sharing personal experiences on social media.",
        ja: "SNSで感情的共感と個人的経験共有を重要に考える。"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 7,
      text: {
        ko: "SNS 활동을 체계적으로 계획하고 관리하는 것을 선호한다.",
        en: "I prefer planning and managing social media activities systematically.",
        ja: "SNS活動を体系的に計画し管理することを好む。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 8,
      text: {
        ko: "SNS에서 즉흥적이고 자유로운 소통을 즐긴다.",
        en: "I enjoy spontaneous and free communication on social media.",
        ja: "SNSで即興的で自由なコミュニケーションを楽しむ。"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 9,
      text: {
        ko: "SNS를 통해 많은 사람들과 네트워킹하는 것을 좋아한다.",
        en: "I like networking with many people through social media.",
        ja: "SNSを通じて多くの人とネットワーキングすることが好きだ。"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 10,
      text: {
        ko: "SNS에서는 개인적이고 깊이 있는 내용을 선별적으로 공유한다.",
        en: "I selectively share personal and in-depth content on social media.",
        ja: "SNSでは個人的で深みのある内容を選別的に共有する。"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 11,
      text: {
        ko: "SNS에서 미래 지향적이고 혁신적인 아이디어를 탐구한다.",
        en: "I explore future-oriented and innovative ideas on social media.",
        ja: "SNSで未来志向的で革新的なアイデアを探求する。"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 12,
      text: {
        ko: "SNS에서는 현실적이고 검증된 정보를 중시한다.",
        en: "I value realistic and verified information on social media.",
        ja: "SNSでは現実的で検証された情報を重視する。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 13,
      text: {
        ko: "SNS에서 합리적 판단과 사실 확인을 중요하게 생각한다.",
        en: "I consider rational judgment and fact-checking important on social media.",
        ja: "SNSで合理的判断と事実確認を重要に考える。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 14,
      text: {
        ko: "SNS에서 다른 사람들의 감정과 관점을 배려한다.",
        en: "I consider others' emotions and perspectives on social media.",
        ja: "SNSで他の人々の感情と観点を配慮する。"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 15,
      text: {
        ko: "SNS 사용에서 일정한 규칙과 원칙을 유지한다.",
        en: "I maintain consistent rules and principles in social media use.",
        ja: "SNS使用で一定のルールと原則を維持する。"
      },
      dimension: 'JP',
      weight: 'J'
    }
  ],
  
  travel: [
    {
      id: 1,
      text: {
        ko: "여행 일정을 철저히 사전 계획하는 편이다.",
        en: "I tend to thoroughly plan travel itineraries in advance.",
        ja: "旅行日程を徹底的に事前計画する方だ。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 2,
      text: {
        ko: "여행 목적은 명소와 맛집 리스트를 완성하는 것이다.",
        en: "My travel purpose is to complete lists of attractions and restaurants.",
        ja: "旅行の目的は名所とグルメリストを完成させることだ。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 3,
      text: {
        ko: "출발 전 가방을 미리 챙기고 체크한다.",
        en: "I pack and check my luggage in advance before departure.",
        ja: "出発前にバッグを事前に準備してチェックする。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 4,
      text: {
        ko: "공항에는 일찍 도착해서 여유있게 움직인다.",
        en: "I arrive at the airport early and move leisurely.",
        ja: "空港には早く到着して余裕を持って動く。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 5,
      text: {
        ko: "여행 중 길을 잃으면 지도를 보고 빠르게 해결한다.",
        en: "When I get lost during travel, I quickly solve it by looking at a map.",
        ja: "旅行中道に迷ったら地図を見て素早く解決する。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 6,
      text: {
        ko: "동행자와 갈등이 생기면 원인을 분석하고 조정한다.",
        en: "When conflicts arise with travel companions, I analyze causes and coordinate.",
        ja: "同行者と対立が生じたら原因を分析し調整する。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 7,
      text: {
        ko: "👥 여행 동반자 선택과 역할 분담은?",
        en: "👥 How do you choose travel companions and divide roles?",
        ja: "👥 旅行同伴者選択と役割分担は？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 8,
      text: {
        ko: "🚇 현지 교통수단 이용 방식은?",
        en: "🚇 How do you use local transportation?",
        ja: "🚇 現地交通手段利用方式は？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 9,
      text: {
        ko: "🎭 현지 문화 체험에 대한 접근법은?",
        en: "🎭 Your approach to experiencing local culture?",
        ja: "🎭 現地文化体験に対するアプローチは？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 10,
      text: {
        ko: "💰 여행 예산 관리 방식은?",
        en: "💰 How do you manage travel budget?",
        ja: "💰 旅行予算管理方式は？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 11,
      text: {
        ko: "🌅 여행 중 하루 일정 관리는?",
        en: "🌅 How do you manage daily schedules while traveling?",
        ja: "🌅 旅行中の一日スケジュール管理は？"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 12,
      text: {
        ko: "🛍️ 여행지에서의 쇼핑 스타일은?",
        en: "🛍️ Your shopping style while traveling?",
        ja: "🛍️ 旅行先でのショッピングスタイルは？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 13,
      text: {
        ko: "🌄 여행 중 예상치 못한 상황에 대한 대처는?",
        en: "🌄 How do you handle unexpected situations while traveling?",
        ja: "🌄 旅行中の予想外の状況に対する対処は？"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 14,
      text: {
        ko: "🏖️ 여행에서 휴식과 활동의 균형은?",
        en: "🏖️ How do you balance rest and activities while traveling?",
        ja: "🏖️ 旅行での休息と活動のバランスは？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 15,
      text: {
        ko: "🎁 여행 후 기념품과 추억 정리 방식은?",
        en: "🎁 How do you organize souvenirs and memories after travel?",
        ja: "🎁 旅行後のお土産と思い出整理方式は？"
      },
      dimension: 'SN',
      weight: 'S'
    }
  ],
  
  study: [
    {
      id: 1,
      text: {
        ko: "📚 새로운 것을 배울 때 선호하는 방법은?",
        en: "📚 What's your preferred way to learn something new?",
        ja: "📚 新しいことを学ぶ時の好む方法は？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 2,
      text: {
        ko: "자료 정리를 위해 노트로 정리하고 요약한다.",
        en: "I organize and summarize materials in notes.",
        ja: "資料整理のためノートで整理し要約する。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 3,
      text: {
        ko: "문제를 틀렸을 때 원인을 분석하고 해결한다.",
        en: "When I get problems wrong, I analyze causes and solve them.",
        ja: "問題を間違えた時、原因を分析し解決する。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 4,
      text: {
        ko: "강의를 들을 때 필기 정리를 철저히 한다.",
        en: "I take thorough notes when attending lectures.",
        ja: "講義を聞く時、筆記整理を徹底的にする。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 5,
      text: {
        ko: "암기법은 논리적인 구조를 우선시한다.",
        en: "I prioritize logical structure in memorization methods.",
        ja: "暗記法は論理的な構造を優先する。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 6,
      text: {
        ko: "질문이 생기면 바로 질문하거나 검색한다.",
        en: "When questions arise, I immediately ask or search for answers.",
        ja: "質問が生じたらすぐ質問したり検索する。"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 7,
      text: {
        ko: "그룹 스터디는 협업으로 효율이 상승한다고 생각한다.",
        en: "I believe group study increases efficiency through collaboration.",
        ja: "グループスタディは協業で効率が上昇すると思う。"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 8,
      text: {
        ko: "시험 전날에는 복습 루틴을 철저히 한다.",
        en: "I thoroughly follow review routines the day before exams.",
        ja: "試験前日には復習ルーチンを徹底的にする。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 9,
      text: {
        ko: "피드백을 받을 때 냉정하게 수용한다.",
        en: "I accept feedback objectively when receiving it.",
        ja: "フィードバックを受ける時、冷静に受け入れる。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 10,
      text: {
        ko: "공부할 때 시각적 도표나 그래프를 선호한다.",
        en: "I prefer visual charts and graphs when studying.",
        ja: "勉強する時、視覚的図表やグラフを好む。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 11,
      text: {
        ko: "새로운 개념은 구조부터 먼저 이해한다.",
        en: "I understand the structure first when learning new concepts.",
        ja: "新しい概念は構造からまず理解する。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 12,
      text: {
        ko: "긴 공부 시간에는 중간중간 계획적으로 휴식한다.",
        en: "During long study sessions, I take planned breaks in between.",
        ja: "長い勉強時間には途中で計画的に休息する。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 13,
      text: {
        ko: "공부 장소는 항상 같은 공간을 선호한다.",
        en: "I prefer studying in the same space consistently.",
        ja: "勉強場所はいつも同じ空間を好む。"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 14,
      text: {
        ko: "실전 모의고사는 계획된 루틴에 포함시킨다.",
        en: "I include practice tests in my planned routine.",
        ja: "実戦模擬試験は計画されたルーチンに含める。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 15,
      text: {
        ko: "공부 마무리는 피드백과 정리까지 완료한다.",
        en: "I complete study sessions with feedback and organization.",
        ja: "勉強の仕上げはフィードバックと整理まで完了する。"
      },
      dimension: 'JP',
      weight: 'J'
    }
  ],
  
  crisis: [
    {
      id: 1,
      text: {
        ko: "예상 못한 일정 변경이 생기면 바로 대처 플랜을 만든다.",
        en: "When unexpected schedule changes occur, I immediately create a response plan.",
        ja: "予想できないスケジュール変更が生じたらすぐ対処プランを作る。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 2,
      text: {
        ko: "마감 1시간 전 상황에서 우선순위를 정해서 진행한다.",
        en: "I set priorities and proceed when there's 1 hour left before deadline.",
        ja: "締切1時間前の状況で優先順位を決めて進行する。"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 3,
      text: {
        ko: "실수했을 때 문제 원인부터 분석한다.",
        en: "When I make mistakes, I analyze the cause of the problem first.",
        ja: "実失した時、問題原因から分析する。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 4,
      text: {
        ko: "사람과 갈등이 생기면 사실과 논리로 해결하려 한다.",
        en: "When conflicts arise with people, I try to resolve them with facts and logic.",
        ja: "人と対立が生じたら事実と論理で解決しようとする。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 5,
      text: {
        ko: "갑작스러운 질병이나 사고가 생기면 병원이나 약국 등으로 빠르게 수습한다.",
        en: "When sudden illness or accidents occur, I quickly handle them by going to hospitals or pharmacies.",
        ja: "突然の病気や事故が生じたら病院や薬局などで素早く収束する。"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 6,
      text: {
        ko: "⏰ 시간이 부족한 압박 상황에서?",
        en: "⏰ In time-pressured situations?",
        ja: "⏰ 時間が不足した圧迫状況で？"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 7,
      text: {
        ko: "🎯 중요한 결정을 빠르게 내려야 할 때?",
        en: "🎯 When you need to make important decisions quickly?",
        ja: "🎯 重要な決定を早く下さなければならない時？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 8,
      text: {
        ko: "🌊 통제할 수 없는 상황에 직면했을 때?",
        en: "🌊 When facing uncontrollable situations?",
        ja: "🌊 制御できない状況に直面した時？"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 9,
      text: {
        ko: "💥 갈등이나 충돌 상황에서의 중재 방식은?",
        en: "💥 Your mediation style in conflict situations?",
        ja: "💥 対立や衝突状況での仲裁方式は？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 10,
      text: {
        ko: "🔍 정보가 부족한 상황에서의 판단 기준은?",
        en: "🔍 Your judgment criteria when information is insufficient?",
        ja: "🔍 情報が不足した状況での判断基準は？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 11,
      text: {
        ko: "🎪 예상과 다른 결과가 나왔을 때?",
        en: "🎪 When results differ from expectations?",
        ja: "🎪 予想と違う結果が出た時？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 12,
      text: {
        ko: "🛡️ 다른 사람이 위기에 처했을 때의 지원 방식은?",
        en: "🛡️ How do you support others in crisis?",
        ja: "🛡️ 他の人が危機に陥った時の支援方式は？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 13,
      text: {
        ko: "📉 실수나 잘못을 인정해야 할 때?",
        en: "📉 When you need to admit mistakes or wrongs?",
        ja: "📉 ミスや間違いを認めなければならない時？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 14,
      text: {
        ko: "🌪️ 위기 이후 회복과 재건 과정에서?",
        en: "🌪️ In recovery and rebuilding process after crisis?",
        ja: "🌪️ 危機後の回復と再建過程で？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 15,
      text: {
        ko: "💪 위기를 통해 얻은 교훈을 활용하는 방식은?",
        en: "💪 How do you utilize lessons learned from crisis?",
        ja: "💪 危機を通じて得た教訓を活用する方式は？"
      },
      dimension: 'SN',
      weight: 'N'
    }
  ]
};

// Function to get style-specific answer options
const getAnswerOptions = (questionId: number, style: string, lang: 'ko' | 'en' | 'ja') => {
  const styleAnswers: Record<string, { value: number; label: Record<'ko' | 'en' | 'ja', string> }[]> = {
    balance: [
      { value: 1, label: { ko: "완전히 첫 번째", en: "Completely first option", ja: "完全に最初の選択" } },
      { value: 2, label: { ko: "첫 번째에 가까움", en: "Closer to first", ja: "最初に近い" } },
      { value: 3, label: { ko: "중간/상황에 따라", en: "Middle/Depends", ja: "中間・状況次第" } },
      { value: 4, label: { ko: "두 번째에 가까움", en: "Closer to second", ja: "二番目に近い" } },
      { value: 5, label: { ko: "완전히 두 번째", en: "Completely second option", ja: "完全に二番目の選択" } }
    ],
    
    workplace: [
      { value: 1, label: { ko: "전혀 하지 않는다", en: "Never do this", ja: "全くしない" } },
      { value: 2, label: { ko: "거의 하지 않는다", en: "Rarely do this", ja: "ほとんどしない" } },
      { value: 3, label: { ko: "때때로 한다", en: "Sometimes do this", ja: "時々する" } },
      { value: 4, label: { ko: "자주 한다", en: "Often do this", ja: "よくする" } },
      { value: 5, label: { ko: "항상 한다", en: "Always do this", ja: "いつもする" } }
    ],
    
    routine: [
      { value: 1, label: { ko: "전혀 해당 없음", en: "Not at all", ja: "全く当てはまらない" } },
      { value: 2, label: { ko: "거의 해당 없음", en: "Rarely applies", ja: "ほとんど当てはまらない" } },
      { value: 3, label: { ko: "보통", en: "Sometimes", ja: "普通" } },
      { value: 4, label: { ko: "대체로 그렇다", en: "Usually true", ja: "だいたいそうだ" } },
      { value: 5, label: { ko: "정확히 맞다", en: "Exactly right", ja: "正確に合う" } }
    ],
    
    lifestyle: [
      { value: 1, label: { ko: "전혀 선호하지 않음", en: "Don't prefer at all", ja: "全く好まない" } },
      { value: 2, label: { ko: "별로 선호하지 않음", en: "Don't really prefer", ja: "あまり好まない" } },
      { value: 3, label: { ko: "상관없음", en: "Don't mind either way", ja: "どちらでも良い" } },
      { value: 4, label: { ko: "어느 정도 선호함", en: "Somewhat prefer", ja: "ある程度好む" } },
      { value: 5, label: { ko: "매우 선호함", en: "Strongly prefer", ja: "非常に好む" } }
    ],
    
    romance: [
      { value: 1, label: { ko: "절대 그렇지 않음", en: "Absolutely not", ja: "絶対にそうではない" } },
      { value: 2, label: { ko: "그렇지 않음", en: "Not really", ja: "そうではない" } },
      { value: 3, label: { ko: "상황에 따라", en: "Depends on situation", ja: "状況による" } },
      { value: 4, label: { ko: "대체로 그렇다", en: "Generally yes", ja: "だいたいそうだ" } },
      { value: 5, label: { ko: "완전히 그렇다", en: "Completely true", ja: "完全にそうだ" } }
    ],
    
    professional: [
      { value: 1, label: { ko: "전혀 동의하지 않음", en: "Strongly disagree", ja: "全く同意しない" } },
      { value: 2, label: { ko: "동의하지 않음", en: "Disagree", ja: "同意しない" } },
      { value: 3, label: { ko: "중립", en: "Neutral", ja: "中立" } },
      { value: 4, label: { ko: "동의함", en: "Agree", ja: "同意する" } },
      { value: 5, label: { ko: "강하게 동의함", en: "Strongly agree", ja: "強く同意する" } }
    ],
    
    social: [
      { value: 1, label: { ko: "전혀 하지 않음", en: "Never do", ja: "全くしない" } },
      { value: 2, label: { ko: "가끔 함", en: "Rarely do", ja: "たまにする" } },
      { value: 3, label: { ko: "보통 수준", en: "Moderately", ja: "普通レベル" } },
      { value: 4, label: { ko: "자주 함", en: "Frequently do", ja: "よくする" } },
      { value: 5, label: { ko: "매우 자주 함", en: "Very frequently", ja: "非常によくする" } }
    ],
    
    travel: [
      { value: 1, label: { ko: "전혀 중요하지 않음", en: "Not important at all", ja: "全く重要でない" } },
      { value: 2, label: { ko: "별로 중요하지 않음", en: "Not very important", ja: "あまり重要でない" } },
      { value: 3, label: { ko: "보통 중요", en: "Moderately important", ja: "普通に重要" } },
      { value: 4, label: { ko: "중요함", en: "Important", ja: "重要" } },
      { value: 5, label: { ko: "매우 중요함", en: "Very important", ja: "非常に重要" } }
    ],
    
    study: [
      { value: 1, label: { ko: "전혀 효과적이지 않음", en: "Not effective at all", ja: "全く効果的でない" } },
      { value: 2, label: { ko: "별로 효과적이지 않음", en: "Not very effective", ja: "あまり効果的でない" } },
      { value: 3, label: { ko: "보통", en: "Somewhat effective", ja: "普通" } },
      { value: 4, label: { ko: "효과적임", en: "Effective", ja: "効果的" } },
      { value: 5, label: { ko: "매우 효과적임", en: "Very effective", ja: "非常に効果的" } }
    ],
    
    crisis: [
      { value: 1, label: { ko: "전혀 그렇게 행동하지 않음", en: "Never act this way", ja: "全くそのように行動しない" } },
      { value: 2, label: { ko: "거의 그렇게 하지 않음", en: "Rarely act this way", ja: "ほとんどそうしない" } },
      { value: 3, label: { ko: "때때로 그렇게 함", en: "Sometimes act this way", ja: "時々そうする" } },
      { value: 4, label: { ko: "보통 그렇게 함", en: "Usually act this way", ja: "普通そうする" } },
      { value: 5, label: { ko: "항상 그렇게 함", en: "Always act this way", ja: "いつもそうする" } }
    ]
  };

  const defaultOptions = [
    { value: 1, label: { ko: "전혀 그렇지 않다", en: "Strongly disagree", ja: "全くそうではない" } },
    { value: 2, label: { ko: "그렇지 않다", en: "Disagree", ja: "そうではない" } },
    { value: 3, label: { ko: "보통이다", en: "Neutral", ja: "普通だ" } },
    { value: 4, label: { ko: "그렇다", en: "Agree", ja: "そうだ" } },
    { value: 5, label: { ko: "매우 그렇다", en: "Strongly agree", ja: "非常にそうだ" } }
  ];
  const options = styleAnswers[style] || defaultOptions;
  return options.map(option => ({
    value: option.value,
    label: option.label[lang]
  }));
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