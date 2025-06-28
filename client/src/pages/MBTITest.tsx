import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
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
      ko: '밸런스 게임',
      en: 'Balance Game',
      ja: 'バランスゲーム'
    },
    description: {
      ko: '선택의 딜레마로 성격 파악',
      en: 'Understand personality through choice dilemmas',
      ja: '選択のジレンマで性格把握'
    },
    emoji: '⚖️'
  },
  {
    id: 'workplace',
    name: {
      ko: '회사 생활',
      en: 'Office Life',
      ja: '会社生活'
    },
    description: {
      ko: '직장에서의 행동 패턴 분석',
      en: 'Analyze behavior patterns at work',
      ja: '職場での行動パターン分析'
    },
    emoji: '🏢'
  },
  {
    id: 'routine',
    name: {
      ko: '하루 루틴',
      en: 'Daily Routine',
      ja: '一日のルーチン'
    },
    description: {
      ko: '일상 습관으로 성격 분석',
      en: 'Analyze personality through daily habits',
      ja: '日常習慣で性格分析'
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
      ko: '생활 방식으로 성격 파악',
      en: 'Understand personality through lifestyle',
      ja: '生活方式で性格把握'
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
      ko: '공부 방법으로 성격 분석',
      en: 'Analyze personality through study methods',
      ja: '勉強方法で性格分析'
    },
    emoji: '📚'
  },
  {
    id: 'crisis',
    name: {
      ko: '위기 상황',
      en: 'Crisis Situation',
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

// Ready for new questions
const questionSets: Record<string, Question[]> = {
  balance: [
    {
      id: 1,
      text: {
        ko: "주말이면?",
        en: "On weekends?",
        ja: "週末といえば？"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 2,
      text: {
        ko: "여행 스타일",
        en: "Travel style",
        ja: "旅行スタイル"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 3,
      text: {
        ko: "대화 스타일",
        en: "Communication style",
        ja: "会話スタイル"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 4,
      text: {
        ko: "정보 얻기",
        en: "Getting information",
        ja: "情報収集"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 5,
      text: {
        ko: "새로운 사람과 만남",
        en: "Meeting new people",
        ja: "新しい人との出会い"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 6,
      text: {
        ko: "시간 관리",
        en: "Time management",
        ja: "時間管理"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 7,
      text: {
        ko: "결정할 때",
        en: "When making decisions",
        ja: "決定する時"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 8,
      text: {
        ko: "직감 vs 사실",
        en: "Intuition vs Facts",
        ja: "直感 vs 事実"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 9,
      text: {
        ko: "모임 참여",
        en: "Group participation",
        ja: "集まりへの参加"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 10,
      text: {
        ko: "할 일 리스트",
        en: "To-do list",
        ja: "やることリスト"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 11,
      text: {
        ko: "친구 고민 상담",
        en: "Friend's problem consultation",
        ja: "友人の悩み相談"
      },
      dimension: 'TF',
      weight: 'T'
    },
    {
      id: 12,
      text: {
        ko: "관찰 스타일",
        en: "Observation style",
        ja: "観察スタイル"
      },
      dimension: 'SN',
      weight: 'S'
    },
    {
      id: 13,
      text: {
        ko: "회식에서의 나",
        en: "Me at company dinner",
        ja: "会食での私"
      },
      dimension: 'EI',
      weight: 'E'
    },
    {
      id: 14,
      text: {
        ko: "문제 상황",
        en: "Problem situations",
        ja: "問題状況"
      },
      dimension: 'JP',
      weight: 'J'
    },
    {
      id: 15,
      text: {
        ko: "팀 프로젝트",
        en: "Team projects",
        ja: "チームプロジェクト"
      },
      dimension: 'TF',
      weight: 'T'
    }
  ]
};

// Balance game choice functions
const getBalanceChoiceA = (questionId: number): string => {
  const choices = [
    "친구들과 바쁘게 놀기", "계획 꼼꼼히 세우고 출발", "핵심 요점부터 말함", "실제 경험, 사례 위주",
    "어색해도 금방 친해짐", "스케줄표 필수", "논리적 기준 우선", "팩트 중시",
    "적극적으로 분위기 이끔", "계획대로 안 되면 불안", "해결책 먼저 제시", "세부 정보에 민감함",
    "중심에 서서 리드", "미리 계획해 방지", "목표 중심, 효율 우선"
  ];
  return choices[questionId - 1] || "";
};

const getBalanceChoiceB = (questionId: number): string => {
  const choices = [
    "혼자만의 휴식이 최고", "가서 정하자, 즉흥이 좋아", "분위기·감정 중심으로 말함", "전체 흐름과 상상 위주",
    "천천히 적응하며 거리 둠", "느긋하게 유동적으로", "내 감정이 더 중요함", "직관과 영감이 더 와닿음",
    "조용히 듣고 관찰함", "상황 따라 유연하게 대처", "감정적으로 공감해줌", "큰 흐름과 분위기를 먼저 느낌",
    "조용히 참여하며 대화 집중", "닥치면 잘 해결하면 됨", "팀워크와 분위기 중시"
  ];
  return choices[questionId - 1] || "";
};

// Choice functions for all styles
const getChoiceA = (style: string, questionId: number): string => {
  const styleChoices: Record<string, string[]> = {
    workplace: [
      "의견을 먼저 내는 편", "할 일 리스트를 미리 작성", "수치와 사실 위주로 작성", "개선점부터 명확하게 전달",
      "모두와 이야기하며 분위기 메이커", "계획대로 순서대로 진행", "현실 가능한 아이디어 중심", "사실 중심으로 바로 피드백",
      "여러 동료들과 함께 먹음", "이미 완료했거나 거의 끝남", "실현 가능성 먼저 따짐", "논리로 설득하려 함",
      "동료와 수다로 푼다", "과거 사례와 통계 중심", "결과와 성과 위주로 결정"
    ],
    routine: [
      "알람 전에 일어나 준비 철저", "오늘 할 일을 정리함", "꼭 챙겨먹는 편", "사람 많은 곳도 괜찮음",
      "주변 사람과 쉽게 대화함", "늘 가는 익숙한 메뉴", "캘린더, 플래너 활용", "여러 사람과 대화하며 쉼",
      "시간과 장소 미리 정함", "논리적으로 정리해 해소", "정해진 루틴 안에서 집중", "즉시 표현하고 나누는 편",
      "꾸준히 계획적으로 함", "하루를 정리하며 기록", "내일 계획을 정리함"
    ],
    lifestyle: [
      "필요한 걸 미리 메모해두고 감", "자주 마시는 메뉴 고정", "바로 받는 편", "바로 OK",
      "꼼꼼히 기억하고 준비함", "지도나 앱으로 정확히 확인", "팩트 중심의 기사 선호", "원인·해결 먼저 생각",
      "하루 일정 미리 짜둠", "평점과 후기 중요", "먼저 말 걸기도 함", "정해진 방식으로 깔끔하게",
      "꾸준히 기록하며 정리", "이성적으로 해답 제시", "친구와 어울리기"
    ],
    romance: [
      "먼저 연락을 자주 함", "미리 꼼꼼히 계획함", "구체적인 말이 더 신뢰감", "현실적인 해결책 제시",
      "자주 표현하고 직접적으로", "이벤트 준비 철저히 함", "원인과 해결을 찾음", "자주 확인하고 소통함",
      "익숙한 장소 선호", "주도적으로 리드", "안정적이고 계획적인 관계", "논리적으로 정리하려 함",
      "직접 행동으로 표현", "말 그대로 받아들임", "솔직함과 합리성"
    ],
    professional: [
      "하루 계획을 세우고 시작", "문서화, 정리된 방식 선호", "의견을 활발히 제시함", "큰 그림을 먼저 그린다",
      "미리 처리해 여유 확보", "객관적 원인을 분석", "주도적으로 조율하는 편", "단계별 체크리스트 활용",
      "명확한 근거와 데이터 중심", "개선점을 중심으로 듣는다", "냉정하게 판단 후 수용", "먼저 분위기를 이끔",
      "미리 준비하고 적극 참여", "변화에 적극적으로 적응", "업무 정리하며 복기"
    ],
    social: [
      "바로 글/사진 올림", "적극적으로 참여", "진짜 공감될 때만 누름", "먼저 걸기도 함",
      "잘 정리된 콘셉트 중심", "정보 전달에 초점", "참여하고 질문도 함", "주기적으로 전체 정비",
      "바로 따라하는 편", "미리 메모하고 챙김", "정보 수집·공유", "자주 참여함",
      "글/사진 꼼꼼히 고침", "주제별로 정리함", "짧고 명확하게 전달"
    ],
    travel: [
      "철저히 사전 계획", "명소, 맛집 리스트 완성", "가방 미리 챙기고 체크", "일찍 도착해 여유 있게",
      "지도 보고 빠르게 해결", "원인 분석하고 조정", "사진 정리, 기록 꼼꼼", "재밌어 보여서 바로 OK",
      "할 일 중심으로 움직임", "후기, 평점 등 데이터 기반", "가보면 좋지! 적극적", "루트별로 철저히 최적화",
      "새로운 사람과 쉽게 어울림", "실용적인 것 위주", "사진 정리와 후기 작성"
    ],
    study: [
      "계획표부터 작성", "노트로 정리하고 요약", "원인 분석하고 해결", "필기 정리 철저히",
      "논리적인 구조 우선", "바로 질문하거나 검색", "협업으로 효율 상승", "복습 루틴 철저히",
      "냉정하게 수용", "시각적 도표/그래프", "구조부터 먼저 이해", "중간중간 계획적으로 휴식",
      "항상 같은 공간 선호", "계획된 루틴에 포함", "피드백과 정리까지 완료"
    ],
    crisis: [
      "바로 대처 플랜을 만듦", "우선순위 정해 진행", "문제 원인부터 분석", "사실·논리로 해결",
      "병원, 약국 등 빠르게 수습", "전략 문제부터 되짚음", "최대한 바로 연락·조율", "즉시 입장 정리 후 대응",
      "분석적 시선으로 파악", "대안 계획 실행", "침착하게 단계별 대응", "논리적 근거 제시",
      "먼저 주변 사람 챙김", "빠르게 결정하고 실행"
    ]
  };
  
  const choices = styleChoices[style] || [];
  return choices[questionId - 1] || "";
};

const getChoiceB = (style: string, questionId: number): string => {
  const styleChoices: Record<string, string[]> = {
    workplace: [
      "다른 사람 얘기를 듣고 말함", "중요한 것만 기억해두고 시작", "느낌과 흐름 위주로 설명", "기분을 배려하며 말함",
      "친한 몇 명과 조용히 대화", "우선순위 바꿔가며 유연하게", "독창적이고 새로운 접근 우선", "감정 상하지 않게 에둘러 표현",
      "혼자 혹은 소수와 먹는 게 편함", "마지막 날 집중해서 처리", "참신함, 창의성이 먼저", "서로 감정을 먼저 이해하려 함",
      "혼자 정리하는 시간으로 푼다", "새로운 트렌드와 개념 우선", "동료 관계와 분위기도 고려"
    ],
    routine: [
      "알람 여러 번, 여유롭게 시작", "생각나는 대로 하루 시작", "안 먹거나 상황에 따라 다름", "혼자 있는 게 더 편함",
      "이어폰 끼고 조용히 있음", "새로운 메뉴 시도도 좋아함", "머릿속으로만 대략 정리", "혼자 조용히 쉬는 편",
      "즉흥적으로 만나도 OK", "감정을 털어내며 해소", "유동적인 상황에서 몰입", "혼자 곱씹고 정리한 후 표현",
      "하고 싶을 때만 하는 편", "피곤하면 바로 취침", "오늘 있었던 감정을 되새김"
    ],
    lifestyle: [
      "매장 돌며 눈에 띄는 걸 고름", "매번 새로운 메뉴 도전", "잠깐 고민하거나 문자로 돌림", "일정 조정이 필요함",
      "당일에 생각나면 챙김", "방향 감으로 움직임", "인사이트나 스토리 중심 선호", "감정의 흐름을 우선 고려",
      "느긋하게 흘러가는 대로", "끌리는 제목이나 포스터", "기다리며 분위기 살핌", "내가 보기 편하면 OK",
      "하고 싶을 때만 작성", "공감 먼저, 조용히 들어줌", "혼자 영화·책·산책"
    ],
    romance: [
      "상대가 먼저 오길 기다림", "당일 기분 따라 결정", "분위기와 뉘앙스를 중시", "공감하며 마음을 나눔",
      "눈빛, 행동 등으로 표현", "마음 가는 대로 준비", "감정을 먼저 나눔", "별로 신경 안 씀",
      "새로운 장소 시도", "조심스럽게 반응", "자유롭고 유동적인 관계", "감정에 크게 흔들림",
      "글, 선물 등 간접 표현", "의도나 감정을 먼저 파악", "감정적 공감과 배려"
    ],
    professional: [
      "그날 상황에 따라 시작", "말로 전달하며 유동적으로", "듣고 정리한 후 말함", "작은 실무부터 접근",
      "벼락치기 집중력 발휘", "사람의 감정을 먼저 고려", "흐름에 따라 맞추는 편", "흐름 따라 유동적으로 처리",
      "핵심만 요약하고 전달", "감정적 표현이 먼저 다가온다", "정서적 뉘앙스를 고려", "조용히 참석해 맞춰줌",
      "상황 봐서 유동적으로 대처", "기존 방식 선호", "끝나면 바로 퇴근"
    ],
    social: [
      "구경만 하다가 나중에 업로드", "눈팅만 하는 편", "웬만하면 눌러주는 편", "요청 올 때만 수락",
      "그날 기분 따라 자유롭게", "감정·일상 공유 중심", "보기만 하고 조용히 빠짐", "가끔 생각나면 일부만 삭제",
      "조용히 지켜보다가 반응", "SNS 알림 뜰 때만 기억", "감정 표현·교류", "불편하면 피함",
      "즉흥적으로 올림", "감성/재미 위주로 사용", "길고 따뜻한 말투 선호"
    ],
    travel: [
      "현지 가서 유동적으로", "분위기 따라 움직임", "전날 밤에 급히 챙김", "시간 딱 맞춰 움직임",
      "주변에 물어보거나 경험 의존", "감정 위로 먼저 함", "마음에 드는 것만 남김", "계획 없어 불편함",
      "하고 싶은 것부터 즐김", "직감과 감정으로 선택", "사람 많으면 피하고 싶음", "되는 대로 흘러가는 여행",
      "동행 외엔 조용히 즐김", "감성적이거나 특이한 것", "추억만 간직하고 넘어감"
    ],
    study: [
      "일단 시작하며 조정", "머릿속으로만 정리", "그냥 넘어가고 다음 문제", "이해만 되면 패스",
      "감정·이야기로 연결", "나중에 혼자 고민", "혼자 하는 게 더 집중됨", "벼락치기로 몰입",
      "위로 먼저 받고 조정", "감각적 키워드/이미지", "사례/비유로 접근", "피곤하면 즉시 쉬는 편",
      "카페, 도서관 등 다양하게", "필요할 때만 보는 편", "진도 끝나면 종료"
    ],
    crisis: [
      "당황하고 일단 멈춤", "일단 시작하며 조정", "감정적으로 먼저 반응", "감정과 공감으로 접근",
      "주변 위로부터 받음", "분위기와 팀워크 점검", "일단 걱정되며 망설임", "조용히 지나가길 바람",
      "감정적으로 깊게 반응", "감정 소모가 커짐", "긴장해 실수할 수도", "분위기 먼저 고려",
      "본인 상황 먼저 파악", "시간을 두고 고민"
    ]
  };
  
  const choices = styleChoices[style] || [];
  return choices[questionId - 1] || "";
};

const getBalanceChoiceAEn = (questionId: number): string => {
  const choices = [
    "Busy hanging out with friends", "Plan meticulously before departure", "Start with key points", "Focus on actual experience and examples",
    "Quick to befriend despite awkwardness", "Schedule is essential", "Logical criteria first", "Facts are important",
    "Actively lead the atmosphere", "Anxious when plans don't work", "Offer solutions first", "Sensitive to details",
    "Stand in center and lead", "Plan ahead to prevent problems", "Goal-oriented, efficiency first"
  ];
  return choices[questionId - 1] || "";
};

const getBalanceChoiceBEn = (questionId: number): string => {
  const choices = [
    "Solo relaxation is the best", "Let's decide when we get there, spontaneity is good", "Focus on atmosphere and emotions", "Overall flow and imagination",
    "Slowly adapt while keeping distance", "Relaxed and flexible", "My emotions are more important", "Intuition and inspiration resonate more",
    "Listen and observe quietly", "Flexibly adapt to situations", "Emotionally empathize", "Feel the big picture and atmosphere first",
    "Participate quietly and focus on conversation", "Deal with it when it comes", "Teamwork and atmosphere are important"
  ];
  return choices[questionId - 1] || "";
};

const getBalanceChoiceAJa = (questionId: number): string => {
  const choices = [
    "友達と忙しく遊ぶ", "計画をしっかり立てて出発", "要点から話す", "実際の経験、事例中心",
    "気まずくてもすぐ仲良くなる", "スケジュール表必須", "論理的基準優先", "事実重視",
    "積極的に雰囲気をリード", "計画通りにいかないと不安", "解決策をまず提示", "詳細情報に敏感",
    "中心に立ってリード", "事前に計画して防止", "目標中心、効率優先"
  ];
  return choices[questionId - 1] || "";
};

const getBalanceChoiceBJa = (questionId: number): string => {
  const choices = [
    "一人の休息が最高", "行ってから決めよう、即興がいい", "雰囲気・感情中心で話す", "全体の流れと想像中心",
    "ゆっくり適応しながら距離を置く", "のんびり柔軟に", "自分の感情がより重要", "直感とインスピレーションがより響く",
    "静かに聞いて観察", "状況に応じて柔軟に対処", "感情的に共感", "大きな流れと雰囲気をまず感じる",
    "静かに参加して会話に集中", "来たらうまく解決すればいい", "チームワークと雰囲気重視"
  ];
  return choices[questionId - 1] || "";
};

// Function to get style-specific answer options
const getAnswerOptions = (questionId: number, style: string, lang: 'ko' | 'en' | 'ja') => {
  const styleAnswers: Record<string, { value: number; label: Record<'ko' | 'en' | 'ja', string> }[]> = {
    balance: [
      { 
        value: 1, 
        label: { 
          ko: getBalanceChoiceA(questionId), 
          en: getBalanceChoiceAEn(questionId), 
          ja: getBalanceChoiceAJa(questionId) 
        } 
      },
      { 
        value: 2, 
        label: { 
          ko: getBalanceChoiceB(questionId), 
          en: getBalanceChoiceBEn(questionId), 
          ja: getBalanceChoiceBJa(questionId) 
        } 
      }
    ],
    // All other styles use A/B choice format
    default: [
      { 
        value: 1, 
        label: { 
          ko: getChoiceA(style, questionId), 
          en: getChoiceA(style, questionId), 
          ja: getChoiceA(style, questionId) 
        } 
      },
      { 
        value: 2, 
        label: { 
          ko: getChoiceB(style, questionId), 
          en: getChoiceB(style, questionId), 
          ja: getChoiceB(style, questionId) 
        } 
      }
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
  INTP: {
    type: "INTP",
    name: { ko: "사색가", en: "The Thinker", ja: "思想家" },
    description: {
      ko: "논리적 사고와 창의적 아이디어로 새로운 가능성을 탐구하는 사람입니다.",
      en: "A person who explores new possibilities with logical thinking and creative ideas.",
      ja: "論理的思考と創造的アイデアで新しい可能性を探求する人です。"
    },
    traits: {
      ko: ["논리적", "창의적", "독립적", "분석적"],
      en: ["Logical", "Creative", "Independent", "Analytical"],
      ja: ["論理的", "創造的", "独立的", "分析的"]
    },
    careers: {
      ko: ["연구원", "프로그래머", "철학자", "작가"],
      en: ["Researcher", "Programmer", "Philosopher", "Writer"],
      ja: ["研究者", "プログラマー", "哲学者", "作家"]
    },
    famous: {
      ko: ["알베르트 아인슈타인", "빌 게이츠", "찰스 다윈"],
      en: ["Albert Einstein", "Bill Gates", "Charles Darwin"],
      ja: ["アルベルト・アインシュタイン", "ビル・ゲイツ", "チャールズ・ダーウィン"]
    }
  },
  ENTJ: {
    type: "ENTJ",
    name: { ko: "지휘관", en: "The Commander", ja: "指揮官" },
    description: {
      ko: "타고난 리더십으로 목표를 달성하는 카리스마 있는 지도자입니다.",
      en: "A charismatic leader who achieves goals with natural leadership.",
      ja: "生まれながらのリーダーシップで目標を達成するカリスマ的指導者です。"
    },
    traits: {
      ko: ["리더십", "결단력", "자신감", "야심"],
      en: ["Leadership", "Decisiveness", "Confidence", "Ambition"],
      ja: ["リーダーシップ", "決断力", "自信", "野心"]
    },
    careers: {
      ko: ["CEO", "정치가", "변호사", "사업가"],
      en: ["CEO", "Politician", "Lawyer", "Entrepreneur"],
      ja: ["CEO", "政治家", "弁護士", "起業家"]
    },
    famous: {
      ko: ["스티브 잡스", "나폴레옹", "마가렛 대처"],
      en: ["Steve Jobs", "Napoleon", "Margaret Thatcher"],
      ja: ["スティーブ・ジョブズ", "ナポレオン", "マーガレット・サッチャー"]
    }
  },
  ENTP: {
    type: "ENTP",
    name: { ko: "발명가", en: "The Innovator", ja: "発明家" },
    description: {
      ko: "새로운 아이디어와 가능성을 추구하는 혁신적인 사고의 소유자입니다.",
      en: "An owner of innovative thinking who pursues new ideas and possibilities.",
      ja: "新しいアイデアと可能性を追求する革新的思考の持ち主です。"
    },
    traits: {
      ko: ["창의적", "열정적", "독창적", "유연함"],
      en: ["Creative", "Enthusiastic", "Original", "Flexible"],
      ja: ["創造的", "情熱的", "独創的", "柔軟"]
    },
    careers: {
      ko: ["기업가", "발명가", "컨설턴트", "마케터"],
      en: ["Entrepreneur", "Inventor", "Consultant", "Marketer"],
      ja: ["起業家", "発明家", "コンサルタント", "マーケター"]
    },
    famous: {
      ko: ["토마스 에디슨", "레오나르도 다빈치", "월트 디즈니"],
      en: ["Thomas Edison", "Leonardo da Vinci", "Walt Disney"],
      ja: ["トーマス・エジソン", "レオナルド・ダ・ヴィンチ", "ウォルト・ディズニー"]
    }
  },
  INFJ: {
    type: "INFJ",
    name: { ko: "옹호자", en: "The Advocate", ja: "提唱者" },
    description: {
      ko: "깊은 통찰력과 강한 신념으로 세상을 변화시키려는 이상주의자입니다.",
      en: "An idealist who seeks to change the world with deep insight and strong convictions.",
      ja: "深い洞察力と強い信念で世界を変えようとする理想主義者です。"
    },
    traits: {
      ko: ["이상주의", "창의적", "결단력", "원칙주의"],
      en: ["Idealistic", "Creative", "Decisive", "Principled"],
      ja: ["理想主義", "創造的", "決断力", "原則主義"]
    },
    careers: {
      ko: ["상담사", "작가", "교사", "사회복지사"],
      en: ["Counselor", "Writer", "Teacher", "Social Worker"],
      ja: ["カウンセラー", "作家", "教師", "社会福祉士"]
    },
    famous: {
      ko: ["마틴 루터 킹", "마더 테레사", "넬슨 만델라"],
      en: ["Martin Luther King Jr.", "Mother Teresa", "Nelson Mandela"],
      ja: ["マーティン・ルーサー・キング", "マザー・テレサ", "ネルソン・マンデラ"]
    }
  },
  INFP: {
    type: "INFP",
    name: { ko: "중재자", en: "The Mediator", ja: "仲裁者" },
    description: {
      ko: "깊은 가치관과 이상을 바탕으로 진정성 있는 삶을 추구하는 사람입니다.",
      en: "A person who pursues an authentic life based on deep values and ideals.",
      ja: "深い価値観と理想に基づいて真正性のある人生を追求する人です。"
    },
    traits: {
      ko: ["이상주의", "충실함", "개방적", "창의적"],
      en: ["Idealistic", "Loyal", "Open-minded", "Creative"],
      ja: ["理想主義", "忠実", "開放的", "創造的"]
    },
    careers: {
      ko: ["작가", "예술가", "심리학자", "사회복지사"],
      en: ["Writer", "Artist", "Psychologist", "Social Worker"],
      ja: ["作家", "芸術家", "心理学者", "社会福祉士"]
    },
    famous: {
      ko: ["윌리엄 셰익스피어", "조니 뎁", "프린세스 다이애나"],
      en: ["William Shakespeare", "Johnny Depp", "Princess Diana"],
      ja: ["ウィリアム・シェイクスピア", "ジョニー・デップ", "プリンセス・ダイアナ"]
    }
  },
  ENFJ: {
    type: "ENFJ",
    name: { ko: "선도자", en: "The Protagonist", ja: "主人公" },
    description: {
      ko: "타인을 이해하고 도우며 긍정적인 변화를 이끄는 카리스마 있는 리더입니다.",
      en: "A charismatic leader who understands and helps others while leading positive change.",
      ja: "他人を理解し助けながら肯定的変化を導くカリスマ的リーダーです。"
    },
    traits: {
      ko: ["카리스마", "이타적", "신뢰성", "관용"],
      en: ["Charismatic", "Altruistic", "Reliable", "Tolerant"],
      ja: ["カリスマ", "利他的", "信頼性", "寛容"]
    },
    careers: {
      ko: ["교사", "코치", "정치가", "상담사"],
      en: ["Teacher", "Coach", "Politician", "Counselor"],
      ja: ["教師", "コーチ", "政治家", "カウンセラー"]
    },
    famous: {
      ko: ["오프라 윈프리", "버락 오바마", "마야 안젤루"],
      en: ["Oprah Winfrey", "Barack Obama", "Maya Angelou"],
      ja: ["オプラ・ウィンフリー", "バラク・オバマ", "マヤ・アンジェロウ"]
    }
  },
  ENFP: {
    type: "ENFP",
    name: { ko: "활동가", en: "The Campaigner", ja: "活動家" },
    description: {
      ko: "열정적이고 창의적인 에너지로 새로운 가능성을 탐구하는 자유로운 영혼입니다.",
      en: "A free spirit who explores new possibilities with passionate and creative energy.",
      ja: "情熱的で創造的なエネルギーで新しい可能性を探求する自由な魂です。"
    },
    traits: {
      ko: ["열정적", "창의적", "사교적", "독립적"],
      en: ["Enthusiastic", "Creative", "Sociable", "Independent"],
      ja: ["情熱的", "創造的", "社交的", "独立的"]
    },
    careers: {
      ko: ["기자", "상담사", "배우", "기업가"],
      en: ["Journalist", "Counselor", "Actor", "Entrepreneur"],
      ja: ["記者", "カウンセラー", "俳優", "起業家"]
    },
    famous: {
      ko: ["로빈 윌리엄스", "엘런 드제너러스", "윌 스미스"],
      en: ["Robin Williams", "Ellen DeGeneres", "Will Smith"],
      ja: ["ロビン・ウィリアムズ", "エレン・デジェネレス", "ウィル・スミス"]
    }
  },
  ISTJ: {
    type: "ISTJ",
    name: { ko: "물류관리자", en: "The Logistician", ja: "管理者" },
    description: {
      ko: "책임감 있고 신뢰할 수 있는 성격으로 안정적인 질서를 추구합니다.",
      en: "Pursues stable order with a responsible and reliable personality.",
      ja: "責任感があり信頼できる性格で安定した秩序を追求します。"
    },
    traits: {
      ko: ["책임감", "신뢰성", "실용적", "체계적"],
      en: ["Responsible", "Reliable", "Practical", "Systematic"],
      ja: ["責任感", "信頼性", "実用的", "体系的"]
    },
    careers: {
      ko: ["회계사", "의사", "변호사", "관리자"],
      en: ["Accountant", "Doctor", "Lawyer", "Manager"],
      ja: ["会計士", "医師", "弁護士", "管理者"]
    },
    famous: {
      ko: ["조지 워싱턴", "워렌 버핏", "안젤라 메르켈"],
      en: ["George Washington", "Warren Buffett", "Angela Merkel"],
      ja: ["ジョージ・ワシントン", "ウォーレン・バフェット", "アンゲラ・メルケル"]
    }
  },
  ISFJ: {
    type: "ISFJ",
    name: { ko: "수호자", en: "The Protector", ja: "擁護者" },
    description: {
      ko: "따뜻한 마음과 강한 책임감으로 다른 사람을 보호하고 도우려는 성향입니다.",
      en: "A tendency to protect and help others with a warm heart and strong sense of responsibility.",
      ja: "温かい心と強い責任感で他人を守り助けようとする性向です。"
    },
    traits: {
      ko: ["따뜻함", "배려심", "충성심", "겸손함"],
      en: ["Warm", "Considerate", "Loyal", "Humble"],
      ja: ["温かさ", "思いやり", "忠誠心", "謙虚"]
    },
    careers: {
      ko: ["간호사", "교사", "상담사", "사회복지사"],
      en: ["Nurse", "Teacher", "Counselor", "Social Worker"],
      ja: ["看護師", "教師", "カウンセラー", "社会福祉士"]
    },
    famous: {
      ko: ["마더 테레사", "케이트 미들턴", "로사 파크스"],
      en: ["Mother Teresa", "Kate Middleton", "Rosa Parks"],
      ja: ["マザー・テレサ", "ケイト・ミドルトン", "ローザ・パークス"]
    }
  },
  ESTJ: {
    type: "ESTJ",
    name: { ko: "경영자", en: "The Executive", ja: "幹部" },
    description: {
      ko: "뛰어난 관리 능력과 리더십으로 조직을 이끌어가는 타고난 경영자입니다.",
      en: "A natural manager who leads organizations with excellent management skills and leadership.",
      ja: "優れた管理能力とリーダーシップで組織を導く生まれながらの経営者です。"
    },
    traits: {
      ko: ["관리능력", "리더십", "조직력", "현실적"],
      en: ["Management", "Leadership", "Organization", "Realistic"],
      ja: ["管理能力", "リーダーシップ", "組織力", "現実的"]
    },
    careers: {
      ko: ["CEO", "관리자", "판사", "군인"],
      en: ["CEO", "Manager", "Judge", "Military Officer"],
      ja: ["CEO", "管理者", "裁判官", "軍人"]
    },
    famous: {
      ko: ["윈스턴 처칠", "프랭클린 루즈벨트", "존 록펠러"],
      en: ["Winston Churchill", "Franklin D. Roosevelt", "John D. Rockefeller"],
      ja: ["ウィンストン・チャーチル", "フランクリン・ルーズベルト", "ジョン・ロックフェラー"]
    }
  },
  ESFJ: {
    type: "ESFJ",
    name: { ko: "집정관", en: "The Consul", ja: "領事" },
    description: {
      ko: "따뜻한 마음으로 사람들을 도우며 조화로운 환경을 만드는 사교적인 성격입니다.",
      en: "A sociable personality that helps people with a warm heart and creates a harmonious environment.",
      ja: "温かい心で人々を助け調和のとれた環境を作る社交的な性格です。"
    },
    traits: {
      ko: ["친근함", "협력적", "배려심", "책임감"],
      en: ["Friendly", "Cooperative", "Caring", "Responsible"],
      ja: ["親しみやすさ", "協力的", "思いやり", "責任感"]
    },
    careers: {
      ko: ["간호사", "교사", "상담사", "접객업"],
      en: ["Nurse", "Teacher", "Counselor", "Hospitality"],
      ja: ["看護師", "教師", "カウンセラー", "接客業"]
    },
    famous: {
      ko: ["테일러 스위프트", "휴 잭맨", "엘튼 존"],
      en: ["Taylor Swift", "Hugh Jackman", "Elton John"],
      ja: ["テイラー・スウィフト", "ヒュー・ジャックマン", "エルトン・ジョン"]
    }
  },
  ISTP: {
    type: "ISTP",
    name: { ko: "만능재주꾼", en: "The Virtuoso", ja: "巨匠" },
    description: {
      ko: "실용적이고 현실적인 접근으로 문제를 해결하는 유연하고 관용적인 성격입니다.",
      en: "A flexible and tolerant personality that solves problems with practical and realistic approaches.",
      ja: "実用的で現実的なアプローチで問題を解決する柔軟で寛容な性格です。"
    },
    traits: {
      ko: ["실용적", "유연함", "관용적", "현실적"],
      en: ["Practical", "Flexible", "Tolerant", "Realistic"],
      ja: ["実用的", "柔軟", "寛容", "現実的"]
    },
    careers: {
      ko: ["엔지니어", "기계기술자", "파일럿", "운동선수"],
      en: ["Engineer", "Mechanic", "Pilot", "Athlete"],
      ja: ["エンジニア", "機械技術者", "パイロット", "アスリート"]
    },
    famous: {
      ko: ["브루스 리", "클린트 이스트우드", "마이클 조던"],
      en: ["Bruce Lee", "Clint Eastwood", "Michael Jordan"],
      ja: ["ブルース・リー", "クリント・イーストウッド", "マイケル・ジョーダン"]
    }
  },
  ISFP: {
    type: "ISFP",
    name: { ko: "모험가", en: "The Adventurer", ja: "冒険家" },
    description: {
      ko: "개방적이고 유연한 사고로 새로운 가능성을 탐구하는 예술적 감성의 소유자입니다.",
      en: "An owner of artistic sensibility who explores new possibilities with open and flexible thinking.",
      ja: "開放的で柔軟な思考で新しい可能性を探求する芸術的感性の持ち主です。"
    },
    traits: {
      ko: ["예술적", "유연함", "개방적", "민감함"],
      en: ["Artistic", "Flexible", "Open-minded", "Sensitive"],
      ja: ["芸術的", "柔軟", "開放的", "敏感"]
    },
    careers: {
      ko: ["예술가", "음악가", "디자이너", "사진작가"],
      en: ["Artist", "Musician", "Designer", "Photographer"],
      ja: ["芸術家", "音楽家", "デザイナー", "写真家"]
    },
    famous: {
      ko: ["밥 딜런", "마이클 잭슨", "프리다 칼로"],
      en: ["Bob Dylan", "Michael Jackson", "Frida Kahlo"],
      ja: ["ボブ・ディラン", "マイケル・ジャクソン", "フリーダ・カーロ"]
    }
  },
  ESTP: {
    type: "ESTP",
    name: { ko: "사업가", en: "The Entrepreneur", ja: "起業家" },
    description: {
      ko: "에너지 넘치고 활동적인 성격으로 현재 순간을 즐기며 살아가는 사람입니다.",
      en: "A person who lives enjoying the present moment with an energetic and active personality.",
      ja: "エネルギッシュで活動的な性格で現在の瞬間を楽しみながら生きる人です。"
    },
    traits: {
      ko: ["활동적", "실용적", "관찰력", "에너지"],
      en: ["Active", "Practical", "Observant", "Energetic"],
      ja: ["活動的", "実用的", "観察力", "エネルギッシュ"]
    },
    careers: {
      ko: ["영업사원", "연예인", "기업가", "스포츠선수"],
      en: ["Salesperson", "Entertainer", "Entrepreneur", "Athlete"],
      ja: ["営業員", "芸能人", "起業家", "スポーツ選手"]
    },
    famous: {
      ko: ["도널드 트럼프", "마돈나", "어니스트 헤밍웨이"],
      en: ["Donald Trump", "Madonna", "Ernest Hemingway"],
      ja: ["ドナルド・トランプ", "マドンナ", "アーネスト・ヘミングウェイ"]
    }
  },
  ESFP: {
    type: "ESFP",
    name: { ko: "연예인", en: "The Entertainer", ja: "エンターテイナー" },
    description: {
      ko: "자유로운 영혼으로 삶을 즐기며 다른 사람들에게 즐거움을 주는 성격입니다.",
      en: "A free spirit who enjoys life and brings joy to others.",
      ja: "自由な魂で人生を楽しみ他の人に楽しさを与える性格です。"
    },
    traits: {
      ko: ["자유로움", "친근함", "실용적", "수용적"],
      en: ["Free-spirited", "Friendly", "Practical", "Accepting"],
      ja: ["自由", "親しみやすさ", "実用的", "受容的"]
    },
    careers: {
      ko: ["배우", "음악가", "상담사", "교사"],
      en: ["Actor", "Musician", "Counselor", "Teacher"],
      ja: ["俳優", "音楽家", "カウンセラー", "教師"]
    },
    famous: {
      ko: ["마릴린 먼로", "엘비스 프레슬리", "로날드 레이건"],
      en: ["Marilyn Monroe", "Elvis Presley", "Ronald Reagan"],
      ja: ["マリリン・モンロー", "エルビス・プレスリー", "ロナルド・レーガン"]
    }
  }
};

export default function MBTITest() {
  const [, setLocation] = useLocation();
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'ko' | 'en' | 'ja';
  
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [scores, setScores] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });

  const questions = questionSets[selectedStyle] || [];

  const calculateResult = () => {
    const newScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        // For A/B choice styles: 1 = Choice A (question weight), 2 = Choice B (opposite weight)
        if (['balance', 'workplace', 'routine', 'lifestyle', 'romance', 'professional', 'social', 'travel', 'study', 'crisis'].includes(selectedStyle)) {
          if (answer === 1) {
            newScores[question.weight]++;
          } else if (answer === 2) {
            const opposite = question.weight === 'E' ? 'I' : 
                            question.weight === 'I' ? 'E' :
                            question.weight === 'S' ? 'N' :
                            question.weight === 'N' ? 'S' :
                            question.weight === 'T' ? 'F' :
                            question.weight === 'F' ? 'T' :
                            question.weight === 'J' ? 'P' : 'J';
            newScores[opposite]++;
          }
        } else {
          // For other A/B choice styles (workplace, routine, etc.)
          if (answer === 1) {
            newScores[question.weight]++;
          } else if (answer === 2) {
            const opposite = question.weight === 'E' ? 'I' : 
                            question.weight === 'I' ? 'E' :
                            question.weight === 'S' ? 'N' :
                            question.weight === 'N' ? 'S' :
                            question.weight === 'T' ? 'F' :
                            question.weight === 'F' ? 'T' :
                            question.weight === 'J' ? 'P' : 'J';
            newScores[opposite]++;
          }
        }
      }
    });
    
    setScores(newScores);
    setShowResult(true);
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetTest = () => {
    setSelectedStyle('');
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
  };

  if (!selectedStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              {currentLang === 'ko' ? 'MBTI 성격유형 테스트' : 
               currentLang === 'ja' ? 'MBTI性格タイプテスト' : 
               'MBTI Personality Test'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {currentLang === 'ko' ? '10가지 스타일로 나만의 성격을 알아보세요!' :
               currentLang === 'ja' ? '10種類のスタイルで自分だけの性格を知ろう！' :
               'Discover your unique personality with 10 different styles!'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {testStyles.map((style) => (
              <Card
                key={style.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-purple-300"
                onClick={() => setSelectedStyle(style.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{style.emoji}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    {style.name[currentLang]}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {style.description[currentLang]}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <AdSense adSlot="1234567894" className="w-full max-w-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const mbtiType = 
      (scores.E > scores.I ? 'E' : 'I') +
      (scores.S > scores.N ? 'S' : 'N') +
      (scores.T > scores.F ? 'T' : 'F') +
      (scores.J > scores.P ? 'J' : 'P');

    const result = mbtiResults[mbtiType];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-purple-600 dark:text-purple-400">
                {currentLang === 'ko' ? '테스트 결과' : 
                 currentLang === 'ja' ? 'テスト結果' : 
                 'Test Result'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {mbtiType}
              </div>
              {result && (
                <>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    {result.name[currentLang]}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    {result.description[currentLang]}
                  </p>
                </>
              )}
              
              <div className="flex justify-center gap-4 mb-8">
                <Button
                  onClick={resetTest}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  {currentLang === 'ko' ? '다시 테스트' : 
                   currentLang === 'ja' ? '再テスト' : 
                   'Test Again'}
                </Button>
                <Button
                  onClick={() => setLocation('/')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {currentLang === 'ko' ? '홈으로' : 
                   currentLang === 'ja' ? 'ホームへ' : 
                   'Go Home'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <AdSense adSlot="1234567894" className="w-full max-w-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">
                {currentLang === 'ko' ? '질문을 준비 중입니다...' :
                 currentLang === 'ja' ? '質問を準備中です...' :
                 'Preparing questions...'}
              </h2>
              <Button onClick={resetTest}>
                {currentLang === 'ko' ? '돌아가기' :
                 currentLang === 'ja' ? '戻る' :
                 'Go Back'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              onClick={resetTest}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← {currentLang === 'ko' ? '스타일 선택으로' : 
                  currentLang === 'ja' ? 'スタイル選択へ' : 
                  'Back to Style Selection'}
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-gray-800 dark:text-gray-200">
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

        {/* Detailed Content Section */}
        <div className="space-y-12 mt-16 max-w-4xl mx-auto">
          {/* MBTI 테스트 소개 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">MBTI 성격유형 테스트란?</h2>
            <p className="text-muted-foreground leading-relaxed">
              MBTI(Myers-Briggs Type Indicator)는 개인의 성격을 16가지 유형으로 분류하는 세계적으로 인정받는 성격 검사입니다. 
              캐서린 쿡 브릭스와 이사벨 브릭스 마이어스가 칼 융의 심리학 이론을 바탕으로 개발했으며, 
              자신의 성격을 객관적으로 이해하고 타인과의 관계 개선, 진로 선택, 팀워크 향상에 도움을 줍니다. 
              ToolHub.tools의 MBTI 테스트는 정확하고 신뢰할 수 있는 결과를 제공하여 자기 이해와 성장에 기여합니다.
            </p>
          </section>

          {/* 주요 기능 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">주요 기능</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">4가지 성격 차원</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 외향(E) vs 내향(I): 에너지 방향</li>
                  <li>• 감각(S) vs 직관(N): 정보 수집</li>
                  <li>• 사고(T) vs 감정(F): 의사 결정</li>
                  <li>• 판단(J) vs 인식(P): 생활 양식</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">테스트 특징</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 과학적 근거 기반 질문</li>
                  <li>• 16가지 상세한 성격 유형</li>
                  <li>• 직업 적성 및 연애 궁합</li>
                  <li>• 다국어 지원 (한국어, 영어, 일본어)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 상세 사용법 가이드 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">상세 사용법 가이드</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. 테스트 진행 방법</h3>
                <p className="text-muted-foreground">
                  60개의 질문에 솔직하고 직관적으로 답변해주세요. 정답은 없으며, 
                  평소 자신의 모습과 가장 가까운 선택지를 고르는 것이 중요합니다. 
                  너무 오래 고민하지 말고 첫 번째 직감을 따라 선택하시기 바랍니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2. 정확한 결과를 위한 팁</h3>
                <p className="text-muted-foreground">
                  이상적인 모습보다는 현재의 자신을 기준으로 답변하세요. 
                  사회적으로 바람직하다고 여겨지는 답변보다는 솔직한 자신의 모습을 선택하는 것이 
                  더 정확한 성격 유형을 도출할 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">3. 결과 해석 및 활용</h3>
                <p className="text-muted-foreground">
                  테스트 완료 후 나타나는 16가지 성격 유형 중 하나의 결과를 받게 됩니다. 
                  각 유형의 특성, 강점, 개선점, 적합한 직업, 연애 스타일 등의 
                  상세한 정보를 확인하여 자기 이해와 성장에 활용하세요.
                </p>
              </div>
            </div>
          </section>

          {/* 16가지 성격 유형 개요 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">16가지 MBTI 성격 유형</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 text-center">
                <div className="font-bold text-primary mb-1">INTJ</div>
                <div className="text-xs text-muted-foreground">건축가</div>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 text-center">
                <div className="font-bold text-primary mb-1">INTP</div>
                <div className="text-xs text-muted-foreground">논리술사</div>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 text-center">
                <div className="font-bold text-primary mb-1">ENTJ</div>
                <div className="text-xs text-muted-foreground">통솔자</div>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 text-center">
                <div className="font-bold text-primary mb-1">ENTP</div>
                <div className="text-xs text-muted-foreground">토론가</div>
              </div>
              <div className="bg-secondary/5 rounded-lg p-3 border border-secondary/20 text-center">
                <div className="font-bold text-secondary mb-1">INFJ</div>
                <div className="text-xs text-muted-foreground">옹호자</div>
              </div>
              <div className="bg-secondary/5 rounded-lg p-3 border border-secondary/20 text-center">
                <div className="font-bold text-secondary mb-1">INFP</div>
                <div className="text-xs text-muted-foreground">중재자</div>
              </div>
              <div className="bg-secondary/5 rounded-lg p-3 border border-secondary/20 text-center">
                <div className="font-bold text-secondary mb-1">ENFJ</div>
                <div className="text-xs text-muted-foreground">선도자</div>
              </div>
              <div className="bg-secondary/5 rounded-lg p-3 border border-secondary/20 text-center">
                <div className="font-bold text-secondary mb-1">ENFP</div>
                <div className="text-xs text-muted-foreground">활동가</div>
              </div>
              <div className="bg-accent/5 rounded-lg p-3 border border-accent/20 text-center">
                <div className="font-bold text-accent mb-1">ISTJ</div>
                <div className="text-xs text-muted-foreground">물류관리사</div>
              </div>
              <div className="bg-accent/5 rounded-lg p-3 border border-accent/20 text-center">
                <div className="font-bold text-accent mb-1">ISFJ</div>
                <div className="text-xs text-muted-foreground">수호자</div>
              </div>
              <div className="bg-accent/5 rounded-lg p-3 border border-accent/20 text-center">
                <div className="font-bold text-accent mb-1">ESTJ</div>
                <div className="text-xs text-muted-foreground">경영자</div>
              </div>
              <div className="bg-accent/5 rounded-lg p-3 border border-accent/20 text-center">
                <div className="font-bold text-accent mb-1">ESFJ</div>
                <div className="text-xs text-muted-foreground">집정관</div>
              </div>
              <div className="bg-muted/20 rounded-lg p-3 border border-muted text-center">
                <div className="font-bold mb-1">ISTP</div>
                <div className="text-xs text-muted-foreground">만능재주꾼</div>
              </div>
              <div className="bg-muted/20 rounded-lg p-3 border border-muted text-center">
                <div className="font-bold mb-1">ISFP</div>
                <div className="text-xs text-muted-foreground">모험가</div>
              </div>
              <div className="bg-muted/20 rounded-lg p-3 border border-muted text-center">
                <div className="font-bold mb-1">ESTP</div>
                <div className="text-xs text-muted-foreground">사업가</div>
              </div>
              <div className="bg-muted/20 rounded-lg p-3 border border-muted text-center">
                <div className="font-bold mb-1">ESFP</div>
                <div className="text-xs text-muted-foreground">연예인</div>
              </div>
            </div>
          </section>

          {/* 자주 묻는 질문 FAQ */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">자주 묻는 질문 (FAQ)</h2>
            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <h3 className="font-semibold mb-2">Q. MBTI 결과가 바뀔 수 있나요?</h3>
                <p className="text-muted-foreground text-sm">
                  A. 네, 개인의 성장과 경험에 따라 성격이 변화할 수 있습니다. 
                  일반적으로는 핵심 성향이 유지되지만, 환경과 노력에 따라 
                  일부 특성은 변화할 수 있어 정기적인 재검사를 권장합니다.
                </p>
              </div>
              <div className="border-b border-border pb-4">
                <h3 className="font-semibold mb-2">Q. 어떤 유형이 가장 좋은가요?</h3>
                <p className="text-muted-foreground text-sm">
                  A. 모든 MBTI 유형은 고유한 강점과 가치를 가지고 있습니다. 
                  '좋은' 유형은 없으며, 각 유형의 특성을 이해하고 
                  개인의 강점을 발전시키는 것이 중요합니다.
                </p>
              </div>
              <div className="border-b border-border pb-4">
                <h3 className="font-semibold mb-2">Q. 연애 궁합은 얼마나 정확한가요?</h3>
                <p className="text-muted-foreground text-sm">
                  A. MBTI 궁합은 참고 자료일 뿐이며, 실제 관계에서는 
                  소통, 이해, 노력이 더 중요합니다. 다른 유형이라도 
                  서로를 이해하고 존중한다면 좋은 관계를 만들 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Q. 직업 선택에 얼마나 참고해야 하나요?</h3>
                <p className="text-muted-foreground text-sm">
                  A. MBTI는 직업 선택의 한 가지 참고 자료입니다. 
                  개인의 관심사, 능력, 가치관, 시장 상황 등을 
                  종합적으로 고려하여 진로를 결정하시기 바랍니다.
                </p>
              </div>
            </div>
          </section>

          {/* 사용 팁과 요령 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? 'MBTI 활용 팁' : 
               currentLang === 'ja' ? 'MBTI活用ヒント' : 
               'MBTI Usage Tips'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">자기 이해</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 강점과 약점 객관적 파악</li>
                  <li>• 스트레스 요인 및 대처법 이해</li>
                  <li>• 성장 방향 설정</li>
                  <li>• 의사결정 패턴 분석</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">관계 개선</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 타인과의 소통 방식 개선</li>
                  <li>• 팀워크 향상</li>
                  <li>• 갈등 해결 능력 증진</li>
                  <li>• 리더십 스타일 개발</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}