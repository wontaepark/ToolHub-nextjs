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
  
  routine: [
    {
      id: 1,
      text: {
        ko: "🌅 아침에 일어나자마자 가장 먼저 하는 일은?",
        en: "🌅 What's the first thing you do when you wake up?",
        ja: "🌅 朝起きてすぐに最初にすることは？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 2,
      text: {
        ko: "☕ 아침 커피/차를 마시며 보내는 시간?",
        en: "☕ How do you spend time with your morning coffee/tea?",
        ja: "☕ 朝のコーヒー・お茶の時間の過ごし方は？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 3,
      text: {
        ko: "📱 하루 일정을 확인하는 방식은?",
        en: "📱 How do you check your daily schedule?",
        ja: "📱 一日のスケジュールを確認する方法は？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 4,
      text: {
        ko: "🚗 출근/등교 시간에 주로 하는 활동은?",
        en: "🚗 What do you usually do during commute time?",
        ja: "🚗 通勤・通学時間に主にする活動は？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 5,
      text: {
        ko: "🍽️ 점심 식사 시간의 선호는?",
        en: "🍽️ Your preference for lunch time?",
        ja: "🍽️ 昼食時間の好みは？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 6,
      text: {
        ko: "⏰ 예상치 못한 일정 변경이 생겼을 때?",
        en: "⏰ When unexpected schedule changes occur?",
        ja: "⏰ 予想外のスケジュール変更が生じた時？"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 7,
      text: {
        ko: "📚 새로운 정보를 접할 때의 반응은?",
        en: "📚 Your reaction when encountering new information?",
        ja: "📚 新しい情報に接する時の反応は？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 8,
      text: {
        ko: "🌆 퇴근/하교 후 첫 번째 활동은?",
        en: "🌆 First activity after work/school?",
        ja: "🌆 退勤・下校後の最初の活動は？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 9,
      text: {
        ko: "🍽️ 저녁 식사 시간의 스타일은?",
        en: "🍽️ Your dinner time style?",
        ja: "🍽️ 夕食時間のスタイルは？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 10,
      text: {
        ko: "📺 저녁 시간 활동 선택 기준은?",
        en: "📺 Criteria for choosing evening activities?",
        ja: "📺 夜の時間の活動選択基準は？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 11,
      text: {
        ko: "🛀 잠들기 전 루틴은?",
        en: "🛀 Your bedtime routine?",
        ja: "🛀 就寝前のルーティンは？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 12,
      text: {
        ko: "💭 잠들기 전 생각하는 것들은?",
        en: "💭 What do you think about before sleep?",
        ja: "💭 眠る前に考えることは？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 13,
      text: {
        ko: "📞 친구/가족과의 연락 방식은?",
        en: "📞 How do you keep in touch with friends/family?",
        ja: "📞 友達・家族との連絡方式は？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 14,
      text: {
        ko: "🎯 하루의 목표 설정 방식은?",
        en: "🎯 How do you set daily goals?",
        ja: "🎯 一日の目標設定方式は？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 15,
      text: {
        ko: "⭐ 하루를 마무리하는 방식은?",
        en: "⭐ How do you end your day?",
        ja: "⭐ 一日を終える方式は？"
      },
      dimension: 'JP',
      weight: 'P'
    }
  ],
  
  lifestyle: [
    {
      id: 1,
      text: {
        ko: "🏠 주말 오후를 보내는 이상적인 방법은?",
        en: "🏠 What's your ideal way to spend weekend afternoons?",
        ja: "🏠 週末の午後を過ごす理想的な方法は？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 2,
      text: {
        ko: "🛒 장보기를 할 때의 스타일은?",
        en: "🛒 Your style when grocery shopping?",
        ja: "🛒 買い物をする時のスタイルは？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 3,
      text: {
        ko: "🎬 영화/드라마 선택 기준은?",
        en: "🎬 Your criteria for choosing movies/dramas?",
        ja: "🎬 映画・ドラマ選択基準は？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 4,
      text: {
        ko: "🍳 요리를 할 때의 접근 방식은?",
        en: "🍳 Your approach to cooking?",
        ja: "🍳 料理をする時のアプローチは？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 5,
      text: {
        ko: "🎵 음악을 듣는 환경과 방식은?",
        en: "🎵 Your environment and style for listening to music?",
        ja: "🎵 音楽を聴く環境と方式は？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 6,
      text: {
        ko: "📱 스마트폰 사용 패턴은?",
        en: "📱 Your smartphone usage pattern?",
        ja: "📱 スマートフォン使用パターンは？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 7,
      text: {
        ko: "🧹 집 정리정돈 방식은?",
        en: "🧹 Your way of organizing your home?",
        ja: "🧹 家の整理整頓方式は？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 8,
      text: {
        ko: "💰 돈을 쓸 때의 기준은?",
        en: "💰 Your criteria when spending money?",
        ja: "💰 お金を使う時の基準は？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 9,
      text: {
        ko: "🎨 취미 활동 선택 기준은?",
        en: "🎨 Your criteria for choosing hobby activities?",
        ja: "🎨 趣味活動選択基準は？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 10,
      text: {
        ko: "👥 친구들과의 만남 주선 방식은?",
        en: "👥 How do you arrange meetings with friends?",
        ja: "👥 友達との出会いの手配方式は？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 11,
      text: {
        ko: "📖 독서할 때의 환경과 방식은?",
        en: "📖 Your environment and style for reading?",
        ja: "📖 読書する時の環境と方式は？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 12,
      text: {
        ko: "🛏️ 수면 패턴과 환경 관리는?",
        en: "🛏️ How do you manage sleep patterns and environment?",
        ja: "🛏️ 睡眠パターンと環境管理は？"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 13,
      text: {
        ko: "🎁 선물을 주고받을 때의 마음가짐은?",
        en: "🎁 Your mindset when giving and receiving gifts?",
        ja: "🎁 プレゼントをあげたりもらったりする時の心構えは？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 14,
      text: {
        ko: "🌿 자연과 함께하는 시간의 의미는?",
        en: "🌿 What does time with nature mean to you?",
        ja: "🌿 自然と過ごす時間の意味は？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 15,
      text: {
        ko: "💡 새로운 아이디어가 떠올랐을 때의 행동은?",
        en: "💡 Your action when new ideas come to mind?",
        ja: "💡 新しいアイデアが浮かんだ時の行動は？"
      },
      dimension: 'TF',
      weight: 'T'
    }
  ],
  
  romance: [
    {
      id: 1,
      text: {
        ko: "💕 첫 데이트 장소로 선호하는 곳은?",
        en: "💕 What's your preferred first date location?",
        ja: "💕 初デートの場所として好むのは？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 2,
      text: {
        ko: "💌 상대방에게 마음을 표현하는 방식은?",
        en: "💌 How do you express your feelings to someone?",
        ja: "💌 相手に気持ちを表現する方式は？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 3,
      text: {
        ko: "🎭 연인과의 갈등 상황에서의 대처법은?",
        en: "🎭 How do you handle conflicts with your partner?",
        ja: "🎭 恋人との対立状況での対処法は？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 4,
      text: {
        ko: "📱 연인과의 연락 빈도와 방식은?",
        en: "📱 Frequency and style of communication with your partner?",
        ja: "📱 恋人との連絡頻度と方式は？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 5,
      text: {
        ko: "🎊 기념일을 챙기는 방식은?",
        en: "🎊 How do you celebrate anniversaries?",
        ja: "🎊 記念日を祝う方式は？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 6,
      text: {
        ko: "💝 선물을 선택할 때의 기준은?",
        en: "💝 Your criteria when choosing gifts?",
        ja: "💝 プレゼントを選ぶ時の基準は？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 7,
      text: {
        ko: "🌹 로맨틱한 순간을 만드는 방법은?",
        en: "🌹 How do you create romantic moments?",
        ja: "🌹 ロマンチックな瞬間を作る方法は？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 8,
      text: {
        ko: "👥 연인의 친구들과의 관계 형성 방식은?",
        en: "👥 How do you build relationships with your partner's friends?",
        ja: "👥 恋人の友達との関係形成方式は？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 9,
      text: {
        ko: "💭 연애에서 가장 중요하게 생각하는 가치는?",
        en: "💭 What values do you consider most important in relationships?",
        ja: "💭 恋愛で最も重要に考える価値は？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 10,
      text: {
        ko: "🎯 연애 관계의 미래를 계획하는 방식은?",
        en: "🎯 How do you plan the future of your relationship?",
        ja: "🎯 恋愛関係の未来を計画する方式は？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 11,
      text: {
        ko: "🤔 연인과의 의견 차이가 생겼을 때?",
        en: "🤔 When you have differences of opinion with your partner?",
        ja: "🤔 恋人と意見の違いが生じた時？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 12,
      text: {
        ko: "🏡 함께 보내는 집에서의 시간은?",
        en: "🏡 Time spent together at home?",
        ja: "🏡 一緒に過ごす家での時間は？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 13,
      text: {
        ko: "💪 연인을 응원하고 지지하는 방법은?",
        en: "💪 How do you support and encourage your partner?",
        ja: "💪 恋人を応援し支持する方法は？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 14,
      text: {
        ko: "🎪 연인과 함께하는 새로운 경험에 대한 태도는?",
        en: "🎪 Your attitude toward new experiences with your partner?",
        ja: "🎪 恋人と一緒にする新しい経験に対する態度は？"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 15,
      text: {
        ko: "💍 연애에서의 약속과 commitment에 대한 생각은?",
        en: "💍 Your thoughts on promises and commitment in relationships?",
        ja: "💍 恋愛での約束とコミットメントに対する考えは？"
      },
      dimension: 'SN',
      weight: 'N'
    }
  ],
  
  professional: [
    {
      id: 1,
      text: {
        ko: "💼 중요한 프레젠테이션 준비 방식은?",
        en: "💼 How do you prepare for important presentations?",
        ja: "💼 重要なプレゼンテーションの準備方法は？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 2,
      text: {
        ko: "🤝 클라이언트와의 첫 미팅에서의 접근 방식은?",
        en: "🤝 Your approach in first meetings with clients?",
        ja: "🤝 クライアントとの初回ミーティングでのアプローチは？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 3,
      text: {
        ko: "📊 업무 성과를 평가할 때의 기준은?",
        en: "📊 Your criteria when evaluating work performance?",
        ja: "📊 業務成果を評価する時の基準は？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 4,
      text: {
        ko: "🎯 새로운 프로젝트 접근 방식은?",
        en: "🎯 Your approach to new projects?",
        ja: "🎯 新しいプロジェクトのアプローチは？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 5,
      text: {
        ko: "💡 창의적 아이디어 개발 과정은?",
        en: "💡 Your process for developing creative ideas?",
        ja: "💡 創造的アイデア開発過程は？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 6,
      text: {
        ko: "⏰ 마감 압박 상황에서의 대처법은?",
        en: "⏰ How do you handle deadline pressure?",
        ja: "⏰ 締切プレッシャー状況での対処法は？"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 7,
      text: {
        ko: "👔 비즈니스 네트워킹 이벤트에서의 행동은?",
        en: "👔 Your behavior at business networking events?",
        ja: "👔 ビジネスネットワーキングイベントでの行動は？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 8,
      text: {
        ko: "📈 목표 설정과 달성 전략은?",
        en: "📈 Your goal setting and achievement strategy?",
        ja: "📈 目標設定と達成戦略は？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 9,
      text: {
        ko: "🤲 팀원들의 의견을 수렴하는 방식은?",
        en: "🤲 How do you gather team members' opinions?",
        ja: "🤲 チームメンバーの意見を集める方式は？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 10,
      text: {
        ko: "🔍 문제 해결 시 중요하게 생각하는 요소는?",
        en: "🔍 What factors do you consider important in problem-solving?",
        ja: "🔍 問題解決時に重要に考える要素は？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 11,
      text: {
        ko: "💻 업무 환경 설정에 대한 선호는?",
        en: "💻 Your preferences for work environment setup?",
        ja: "💻 業務環境設定に対する好みは？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 12,
      text: {
        ko: "📋 업무 우선순위 결정 방식은?",
        en: "📋 How do you determine work priorities?",
        ja: "📋 業務優先順位決定方式は？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 13,
      text: {
        ko: "🎨 혁신적 솔루션 개발에 대한 접근법은?",
        en: "🎨 Your approach to developing innovative solutions?",
        ja: "🎨 革新的ソリューション開発に対するアプローチは？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 14,
      text: {
        ko: "🏆 성공적인 프로젝트 완료 후의 행동은?",
        en: "🏆 Your actions after successful project completion?",
        ja: "🏆 成功的なプロジェクト完了後の行動は？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 15,
      text: {
        ko: "🌟 전문성 향상을 위한 학습 방식은?",
        en: "🌟 Your learning approach for professional development?",
        ja: "🌟 専門性向上のための学習方式は？"
      },
      dimension: 'JP',
      weight: 'P'
    }
  ],
  
  social: [
    {
      id: 1,
      text: {
        ko: "📱 SNS에 가장 자주 올리는 컨텐츠는?",
        en: "📱 What content do you post most on social media?",
        ja: "📱 SNSに最も頻繁に投稿するコンテンツは？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 2,
      text: {
        ko: "👍 다른 사람의 게시물에 반응하는 방식은?",
        en: "👍 How do you react to other people's posts?",
        ja: "👍 他の人の投稿に反応する方式は？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 3,
      text: {
        ko: "📸 사진을 찍고 공유할 때의 기준은?",
        en: "📸 Your criteria when taking and sharing photos?",
        ja: "📸 写真を撮って共有する時の基準は？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 4,
      text: {
        ko: "💬 온라인 댓글과 토론 참여 방식은?",
        en: "💬 How do you participate in online comments and discussions?",
        ja: "💬 オンラインコメントと討論参加方式は？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 5,
      text: {
        ko: "🎥 스토리나 실시간 방송 활용 방식은?",
        en: "🎥 How do you use stories or live broadcasts?",
        ja: "🎥 ストーリーやライブ配信活用方式は？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 6,
      text: {
        ko: "🔔 SNS 알림 관리 방식은?",
        en: "🔔 How do you manage social media notifications?",
        ja: "🔔 SNS通知管理方式は？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 7,
      text: {
        ko: "👥 새로운 팔로워나 친구 요청에 대한 태도는?",
        en: "👥 Your attitude toward new follower or friend requests?",
        ja: "👥 新しいフォロワーや友達リクエストに対する態度は？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 8,
      text: {
        ko: "🌐 온라인에서 개인 정보 공개 수준은?",
        en: "🌐 Your level of personal information disclosure online?",
        ja: "🌐 オンラインでの個人情報公開レベルは？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 9,
      text: {
        ko: "🎨 창작물이나 취미 공유 방식은?",
        en: "🎨 How do you share creative works or hobbies?",
        ja: "🎨 創作物や趣味共有方式は？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 10,
      text: {
        ko: "📈 SNS 트렌드나 이슈에 대한 반응은?",
        en: "📈 Your reaction to social media trends or issues?",
        ja: "📈 SNSトレンドやイシューに対する反応は？"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 11,
      text: {
        ko: "💔 온라인 갈등이나 논란 상황에서의 대처는?",
        en: "💔 How do you handle online conflicts or controversies?",
        ja: "💔 オンライン対立や論争状況での対処は？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 12,
      text: {
        ko: "🎯 SNS 사용 목적과 가치관은?",
        en: "🎯 Your purpose and values for using social media?",
        ja: "🎯 SNS使用目的と価値観は？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 13,
      text: {
        ko: "🤝 온라인에서 만난 사람과의 오프라인 만남에 대한 생각은?",
        en: "🤝 Your thoughts on offline meetings with people met online?",
        ja: "🤝 オンラインで出会った人とのオフライン出会いに対する考えは？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 14,
      text: {
        ko: "🔄 SNS 피드 관리와 정리 방식은?",
        en: "🔄 How do you manage and organize your social media feed?",
        ja: "🔄 SNSフィード管理と整理方式は？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 15,
      text: {
        ko: "🌟 SNS를 통한 자기표현 방식은?",
        en: "🌟 How do you express yourself through social media?",
        ja: "🌟 SNSを通じた自己表現方式は？"
      },
      dimension: 'SN',
      weight: 'N'
    }
  ],
  
  travel: [
    {
      id: 1,
      text: {
        ko: "✈️ 여행지에서 가장 중요한 것은?",
        en: "✈️ What's most important at a travel destination?",
        ja: "✈️ 旅行先で最も重要なことは？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 2,
      text: {
        ko: "🗺️ 여행 계획을 세우는 방식은?",
        en: "🗺️ How do you plan your travels?",
        ja: "🗺️ 旅行計画を立てる方式は？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 3,
      text: {
        ko: "🎒 여행 짐을 싸는 스타일은?",
        en: "🎒 Your style of packing for travel?",
        ja: "🎒 旅行荷物を詰めるスタイルは？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 4,
      text: {
        ko: "🏨 숙소 선택 기준은?",
        en: "🏨 Your criteria for choosing accommodation?",
        ja: "🏨 宿泊施設選択基準は？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 5,
      text: {
        ko: "🍽️ 현지 음식 도전에 대한 태도는?",
        en: "🍽️ Your attitude toward trying local food?",
        ja: "🍽️ 現地料理挑戦に対する態度は？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 6,
      text: {
        ko: "📷 여행 중 사진 촬영과 기록 방식은?",
        en: "📷 How do you take photos and record during travel?",
        ja: "📷 旅行中の写真撮影と記録方式は？"
      },
      dimension: 'SN',
      weight: 'S'
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
        ko: "🎯 학습 목표를 설정하는 방식은?",
        en: "🎯 How do you set learning goals?",
        ja: "🎯 学習目標を設定する方式は？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 3,
      text: {
        ko: "📝 노트 정리와 기록 방식은?",
        en: "📝 How do you organize notes and records?",
        ja: "📝 ノート整理と記録方式は？"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 4,
      text: {
        ko: "👥 그룹 스터디에 대한 선호도는?",
        en: "👥 Your preference for group study?",
        ja: "👥 グループスタディに対する好みは？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 5,
      text: {
        ko: "🕐 학습 시간 배분과 관리 방식은?",
        en: "🕐 How do you allocate and manage study time?",
        ja: "🕐 学習時間配分と管理方式は？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 6,
      text: {
        ko: "💡 복잡한 개념을 이해하는 접근법은?",
        en: "💡 Your approach to understanding complex concepts?",
        ja: "💡 複雑な概念を理解するアプローチは？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 7,
      text: {
        ko: "📖 교재와 자료 선택 기준은?",
        en: "📖 Your criteria for choosing textbooks and materials?",
        ja: "📖 教材と資料選択基準は？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 8,
      text: {
        ko: "🎪 학습 환경 설정에 대한 선호는?",
        en: "🎪 Your preferences for learning environment setup?",
        ja: "🎪 学習環境設定に対する好みは？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 9,
      text: {
        ko: "🔄 복습과 반복 학습 방식은?",
        en: "🔄 Your approach to review and repetitive learning?",
        ja: "🔄 復習と反復学習方式は？"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 10,
      text: {
        ko: "❓ 질문하고 답을 구하는 방식은?",
        en: "❓ How do you ask questions and seek answers?",
        ja: "❓ 質問して答えを求める方式は？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 11,
      text: {
        ko: "🎨 창의적 학습법 활용에 대한 태도는?",
        en: "🎨 Your attitude toward using creative learning methods?",
        ja: "🎨 創造的学習法活用に対する態度は？"
      },
      dimension: 'SN',
      weight: 'N'
    },
    {
      id: 12,
      text: {
        ko: "📊 학습 성과를 평가하는 방식은?",
        en: "📊 How do you evaluate learning outcomes?",
        ja: "📊 学習成果を評価する方式は？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 13,
      text: {
        ko: "🌟 동기부여와 집중력 유지 방법은?",
        en: "🌟 How do you maintain motivation and concentration?",
        ja: "🌟 動機付けと集中力維持方法は？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 14,
      text: {
        ko: "🔮 새로운 학습 기회에 대한 접근 방식은?",
        en: "🔮 Your approach to new learning opportunities?",
        ja: "🔮 新しい学習機会に対するアプローチは？"
      },
      dimension: 'JP',
      weight: 'P'
    },
    {
      id: 15,
      text: {
        ko: "🏆 학습한 내용을 활용하고 적용하는 방식은?",
        en: "🏆 How do you utilize and apply what you've learned?",
        ja: "🏆 学習した内容を活用し適用する方式は？"
      },
      dimension: 'SN',
      weight: 'S'
    }
  ],
  
  crisis: [
    {
      id: 1,
      text: {
        ko: "🚨 갑작스러운 문제가 생겼을 때?",
        en: "🚨 When a sudden problem arises?",
        ja: "🚨 突然の問題が発生した時？"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 2,
      text: {
        ko: "⚡ 긴급 상황에서의 첫 번째 반응은?",
        en: "⚡ Your first reaction in emergency situations?",
        ja: "⚡ 緊急状況での最初の反応は？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 3,
      text: {
        ko: "🔥 스트레스가 극심할 때의 대처법은?",
        en: "🔥 How do you cope when stress is extreme?",
        ja: "🔥 ストレスが極度の時の対処法は？"
      },
      dimension: 'EI',
      weight: 'I'
    },
    {
      id: 4,
      text: {
        ko: "💔 예상치 못한 실패나 좌절 상황에서?",
        en: "💔 In unexpected failure or frustration situations?",
        ja: "💔 予想外の失敗や挫折状況で？"
      },
      dimension: 'TF',
      weight: 'F'
    },
    {
      id: 5,
      text: {
        ko: "🆘 도움이 필요한 상황에서의 행동은?",
        en: "🆘 Your actions when you need help?",
        ja: "🆘 助けが必要な状況での行動は？"
      },
      dimension: 'EI',
      weight: 'E'
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

  const options = styleAnswers[style] || styleAnswers.professional;
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