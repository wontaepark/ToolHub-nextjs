import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Share2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
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

const questions: Question[] = [
  // E vs I questions (situation-based)
  {
    id: 1,
    text: {
      ko: "🎉 회사 워크샵에서 즉석 발표를 하게 되었습니다. 당신은?",
      en: "🎉 You're asked to give an impromptu presentation at a company workshop. You:",
      ja: "🎉 会社のワークショップで即席発表をすることになりました。あなたは？"
    },
    dimension: 'EI',
    weight: 'E'
  },
  {
    id: 2,
    text: {
      ko: "📱 SNS에 새로운 게시물을 올릴 때, 주로 어떤 내용을 선택하시나요?",
      en: "📱 When posting on social media, what type of content do you usually choose?",
      ja: "📱 SNSに新しい投稿をする時、主にどんな内容を選びますか？"
    },
    dimension: 'EI',
    weight: 'E'
  },
  {
    id: 3,
    text: {
      ko: "🏠 완벽한 주말을 보내는 방법은?",
      en: "🏠 What's your idea of a perfect weekend?",
      ja: "🏠 完璧な週末の過ごし方は？"
    },
    dimension: 'EI',
    weight: 'I'
  },
  
  // S vs N questions (image-based scenarios)
  {
    id: 4,
    text: {
      ko: "🎨 새로운 취미를 배울 때, 어떤 방식을 선호하시나요?",
      en: "🎨 When learning a new hobby, which approach do you prefer?",
      ja: "🎨 新しい趣味を学ぶ時、どの方法を好みますか？"
    },
    dimension: 'SN',
    weight: 'S'
  },
  {
    id: 5,
    text: {
      ko: "📚 책을 읽을 때, 어떤 장르에 더 끌리시나요?",
      en: "📚 When reading books, which genre attracts you more?",
      ja: "📚 本を読む時、どのジャンルにより惹かれますか？"
    },
    dimension: 'SN',
    weight: 'N'
  },
  {
    id: 6,
    text: {
      ko: "🏢 새로운 업무를 맡게 되었을 때, 첫 번째 행동은?",
      en: "🏢 When assigned a new task at work, your first action is:",
      ja: "🏢 新しい業務を任された時、最初の行動は？"
    },
    dimension: 'SN',
    weight: 'S'
  },
  {
    id: 7,
    text: {
      ko: "💡 아이디어가 떠올랐을 때, 어떻게 발전시키시나요?",
      en: "💡 When you have an idea, how do you develop it?",
      ja: "💡 アイデアが浮かんだ時、どのように発展させますか？"
    },
    dimension: 'SN',
    weight: 'N'
  },

  // T vs F questions (decision scenarios)
  {
    id: 8,
    text: {
      ko: "👥 팀에서 갈등이 생겼을 때, 당신의 해결 방식은?",
      en: "👥 When conflict arises in your team, your approach to resolution is:",
      ja: "👥 チームで対立が生じた時、あなたの解決方法は？"
    },
    dimension: 'TF',
    weight: 'T'
  },
  {
    id: 9,
    text: {
      ko: "🤝 친구가 중요한 결정으로 고민할 때, 어떤 조언을 해주시나요?",
      en: "🤝 When a friend is struggling with an important decision, what advice do you give?",
      ja: "🤝 友達が重要な決定で悩んでいる時、どんなアドバイスをしますか？"
    },
    dimension: 'TF',
    weight: 'F'
  },
  {
    id: 10,
    text: {
      ko: "⚖️ 영화를 평가할 때, 무엇을 가장 중요하게 생각하시나요?",
      en: "⚖️ When evaluating a movie, what do you consider most important?",
      ja: "⚖️ 映画を評価する時、何を最も重要に考えますか？"
    },
    dimension: 'TF',
    weight: 'T'
  },
  {
    id: 11,
    text: {
      ko: "💝 선물을 고를 때, 가장 신경 쓰는 부분은?",
      en: "💝 When choosing a gift, what do you care about most?",
      ja: "💝 プレゼントを選ぶ時、最も気にする部分は？"
    },
    dimension: 'TF',
    weight: 'F'
  },

  // J vs P questions (lifestyle scenarios)
  {
    id: 12,
    text: {
      ko: "✈️ 여행을 계획할 때, 당신의 스타일은?",
      en: "✈️ When planning a trip, your style is:",
      ja: "✈️ 旅行を計画する時、あなたのスタイルは？"
    },
    dimension: 'JP',
    weight: 'J'
  },
  {
    id: 13,
    text: {
      ko: "🎯 목표를 설정하고 달성하는 방식은?",
      en: "🎯 Your approach to setting and achieving goals:",
      ja: "🎯 目標を設定して達成する方法は？"
    },
    dimension: 'JP',
    weight: 'J'
  },
  {
    id: 14,
    text: {
      ko: "🌟 새로운 기회가 갑자기 생겼을 때의 반응은?",
      en: "🌟 Your reaction when a new opportunity suddenly arises:",
      ja: "🌟 新しい機会が突然生まれた時の反応は？"
    },
    dimension: 'JP',
    weight: 'P'
  },
  {
    id: 15,
    text: {
      ko: "📅 일정 관리에 대한 당신의 철학은?",
      en: "📅 Your philosophy about schedule management:",
      ja: "📅 スケジュール管理に対するあなたの哲学は？"
    },
    dimension: 'JP',
    weight: 'P'
  }
];

// Function to get situation-specific answer options for each question
const getAnswerOptions = (questionId: number, lang: 'ko' | 'en' | 'ja') => {
  const optionSets: Record<number, { value: number; label: Record<'ko' | 'en' | 'ja', string> }[]> = {
    1: [ // 즉석 발표
      { value: 1, label: { ko: "😰 긴장되지만 최선을 다해 발표한다", en: "😰 Feel nervous but do my best", ja: "😰 緊張するが最善を尽くして発表する" } },
      { value: 2, label: { ko: "🤔 준비 시간을 요청한다", en: "🤔 Ask for preparation time", ja: "🤔 準備時間を要請する" } },
      { value: 3, label: { ko: "😊 차분하게 준비해서 발표한다", en: "😊 Stay calm and prepare", ja: "😊 落ち着いて準備して発表する" } },
      { value: 4, label: { ko: "😎 자신감 있게 즉석에서 발표한다", en: "😎 Confidently present on the spot", ja: "😎 自信を持って即席で発表する" } },
      { value: 5, label: { ko: "🎯 흥미롭게 여기고 적극적으로 참여한다", en: "🎯 Get excited and actively participate", ja: "🎯 面白がって積極的に参加する" } }
    ],
    2: [ // SNS 게시물
      { value: 1, label: { ko: "📝 개인적인 일상과 감정을 공유", en: "📝 Share personal daily life and emotions", ja: "📝 個人的な日常と感情を共有" } },
      { value: 2, label: { ko: "📸 취미나 관심사에 대한 내용", en: "📸 Content about hobbies and interests", ja: "📸 趣味や関心事についての内容" } },
      { value: 3, label: { ko: "🎨 창작물이나 예술적 표현", en: "🎨 Creative works or artistic expression", ja: "🎨 創作物や芸術的表現" } },
      { value: 4, label: { ko: "🌍 사회 이슈나 유용한 정보", en: "🌍 Social issues or useful information", ja: "🌍 社会問題や有用な情報" } },
      { value: 5, label: { ko: "🎉 친구들과의 활동이나 모임 사진", en: "🎉 Activities or gatherings with friends", ja: "🎉 友達との活動や集まりの写真" } }
    ],
    3: [ // 완벽한 주말
      { value: 1, label: { ko: "📚 혼자서 책을 읽거나 영화 감상", en: "📚 Reading books or watching movies alone", ja: "📚 一人で本を読んだり映画鑑賞" } },
      { value: 2, label: { ko: "🏡 집에서 휴식하며 에너지 충전", en: "🏡 Resting at home and recharging", ja: "🏡 家で休息してエネルギー充電" } },
      { value: 3, label: { ko: "🚶 가벼운 산책이나 조용한 활동", en: "🚶 Light walks or quiet activities", ja: "🚶 軽い散歩や静かな活動" } },
      { value: 4, label: { ko: "👥 소수의 친한 친구들과 만남", en: "👥 Meeting with a few close friends", ja: "👥 少数の親しい友達との出会い" } },
      { value: 5, label: { ko: "🎪 다양한 사람들과 활발한 활동", en: "🎪 Active activities with various people", ja: "🎪 様々な人との活発な活動" } }
    ]
  };

  // Default options for questions not specifically defined
  const defaultOptions = [
    { value: 1, label: { ko: "전혀 그렇지 않다", en: "Strongly Disagree", ja: "全くそうではない" } },
    { value: 2, label: { ko: "그렇지 않다", en: "Disagree", ja: "そうではない" } },
    { value: 3, label: { ko: "보통이다", en: "Neutral", ja: "普通" } },
    { value: 4, label: { ko: "그렇다", en: "Agree", ja: "そうだ" } },
    { value: 5, label: { ko: "매우 그렇다", en: "Strongly Agree", ja: "非常にそうだ" } }
  ];

  const options = optionSets[questionId] || defaultOptions;
  return options.map(option => ({
    value: option.value,
    label: option.label[lang]
  }));
};

const mbtiResults: Record<string, MBTIResult> = {
  INTJ: {
    type: "INTJ",
    name: {
      ko: "전략가",
      en: "The Architect",
      ja: "建築家"
    },
    description: {
      ko: "혁신적인 아이디어와 뛰어난 실행력을 가진 완벽주의자입니다. 독립적이며 미래지향적인 사고를 하는 당신은 복잡한 문제를 체계적으로 해결하는 능력이 뛰어납니다.",
      en: "A perfectionist with innovative ideas and excellent execution. You're independent with future-oriented thinking and excel at systematically solving complex problems.",
      ja: "革新的なアイデアと優れた実行力を持つ完璧主義者です。独立的で未来志向的な思考を持つあなたは、複雑な問題を体系的に解決する能力に優れています。"
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
    name: {
      ko: "사색가",
      en: "The Thinker",
      ja: "思想家"
    },
    description: {
      ko: "호기심이 많고 창의적인 사고를 하는 이론가입니다. 복잡한 개념을 이해하고 새로운 아이디어를 탐구하는 것을 즐기며, 논리적 사고력이 뛰어납니다.",
      en: "A curious and creative theoretical thinker. You enjoy understanding complex concepts and exploring new ideas, with excellent logical thinking abilities.",
      ja: "好奇心旺盛で創造的な思考をする理論家です。複雑な概念を理解し新しいアイデアを探求することを楽しみ、論理的思考力に優れています。"
    },
    traits: {
      ko: ["분석적", "창의적", "호기심", "논리적"],
      en: ["Analytical", "Creative", "Curious", "Logical"],
      ja: ["分析的", "創造的", "好奇心", "論理的"]
    },
    careers: {
      ko: ["연구원", "프로그래머", "수학자", "철학자"],
      en: ["Researcher", "Programmer", "Mathematician", "Philosopher"],
      ja: ["研究者", "プログラマー", "数学者", "哲学者"]
    },
    famous: {
      ko: ["알버트 아인슈타인", "빌 게이츠", "찰스 다윈"],
      en: ["Albert Einstein", "Bill Gates", "Charles Darwin"],
      ja: ["アルベルト・アインシュタイン", "ビル・ゲイツ", "チャールズ・ダーウィン"]
    }
  },
  ENTJ: {
    type: "ENTJ",
    name: {
      ko: "리더",
      en: "The Commander",
      ja: "指揮官"
    },
    description: {
      ko: "타고난 리더십과 강한 의지력을 가진 지휘관입니다. 목표 달성을 위해 체계적으로 계획을 세우고 실행하며, 다른 사람들에게 동기를 부여하는 능력이 뛰어납니다.",
      en: "A natural leader with strong willpower and commanding presence. You systematically plan and execute to achieve goals, excelling at motivating others.",
      ja: "生まれながらのリーダーシップと強い意志力を持つ指揮官です。目標達成のために体系的に計画を立てて実行し、他の人にモチベーションを与える能力に優れています。"
    },
    traits: {
      ko: ["리더십", "결단력", "효율성", "목표지향적"],
      en: ["Leadership", "Decisive", "Efficient", "Goal-oriented"],
      ja: ["リーダーシップ", "決断力", "効率性", "目標志向"]
    },
    careers: {
      ko: ["CEO", "경영컨설턴트", "변호사", "정치인"],
      en: ["CEO", "Management Consultant", "Lawyer", "Politician"],
      ja: ["CEO", "経営コンサルタント", "弁護士", "政治家"]
    },
    famous: {
      ko: ["스티브 잡스", "마가렛 대처", "나폴레옹"],
      en: ["Steve Jobs", "Margaret Thatcher", "Napoleon"],
      ja: ["スティーブ・ジョブズ", "マーガレット・サッチャー", "ナポレオン"]
    }
  },
  ENTP: {
    type: "ENTP",
    name: {
      ko: "혁신가",
      en: "The Debater",
      ja: "革新者"
    },
    description: {
      ko: "창의적이고 열정적인 혁신가입니다. 새로운 가능성을 탐구하고 다양한 관점에서 문제를 바라보며, 변화를 주도하는 것을 즐깁니다.",
      en: "A creative and passionate innovator. You explore new possibilities, view problems from various perspectives, and enjoy leading change.",
      ja: "創造的で情熱的な革新者です。新しい可能性を探求し様々な観点から問題を見つめ、変化を主導することを楽しみます。"
    },
    traits: {
      ko: ["창의적", "열정적", "다재다능", "적응적"],
      en: ["Creative", "Enthusiastic", "Versatile", "Adaptable"],
      ja: ["創造的", "情熱的", "多才多能", "適応的"]
    },
    careers: {
      ko: ["기업가", "발명가", "마케터", "저널리스트"],
      en: ["Entrepreneur", "Inventor", "Marketer", "Journalist"],
      ja: ["起業家", "発明家", "マーケター", "ジャーナリスト"]
    },
    famous: {
      ko: ["토마스 에디슨", "마크 트웨인", "월트 디즈니"],
      en: ["Thomas Edison", "Mark Twain", "Walt Disney"],
      ja: ["トーマス・エジソン", "マーク・トウェイン", "ウォルト・ディズニー"]
    }
  },
  INFJ: {
    type: "INFJ",
    name: {
      ko: "상담가",
      en: "The Advocate",
      ja: "提唱者"
    },
    description: {
      ko: "깊은 통찰력과 강한 신념을 가진 이상주의자입니다. 다른 사람을 돕고 세상을 더 나은 곳으로 만들고자 하는 열망이 강하며, 창의적이고 결단력이 있습니다.",
      en: "An idealist with deep insight and strong convictions. You have a strong desire to help others and make the world a better place, being both creative and decisive.",
      ja: "深い洞察力と強い信念を持つ理想主義者です。他の人を助け世界をより良い場所にしたいという熱望が強く、創造的で決断力があります。"
    },
    traits: {
      ko: ["통찰력", "이상주의", "공감능력", "창의적"],
      en: ["Insightful", "Idealistic", "Empathetic", "Creative"],
      ja: ["洞察力", "理想主義", "共感能力", "創造的"]
    },
    careers: {
      ko: ["상담사", "작가", "교사", "사회활동가"],
      en: ["Counselor", "Writer", "Teacher", "Social Activist"],
      ja: ["カウンセラー", "作家", "教師", "社会活動家"]
    },
    famous: {
      ko: ["넬슨 만델라", "마틴 루터 킹", "마더 테레사"],
      en: ["Nelson Mandela", "Martin Luther King Jr.", "Mother Teresa"],
      ja: ["ネルソン・マンデラ", "マーティン・ルーサー・キング", "マザー・テレサ"]
    }
  },
  INFP: {
    type: "INFP",
    name: {
      ko: "예술가",
      en: "The Mediator",
      ja: "芸術家"
    },
    description: {
      ko: "순수하고 열정적인 예술가 영혼을 가진 사람입니다. 자신만의 가치관을 중시하며, 진정성 있는 삶을 추구하고 창의적 표현을 통해 자신을 드러냅니다.",
      en: "A person with a pure and passionate artistic soul. You value your own principles, pursue an authentic life, and express yourself through creative means.",
      ja: "純粋で情熱的な芸術家の魂を持つ人です。自分だけの価値観を重視し、真正性のある人生を追求し創造的表現を通じて自分を表現します。"
    },
    traits: {
      ko: ["공감능력", "창의성", "진정성", "유연성"],
      en: ["Empathetic", "Creative", "Authentic", "Flexible"],
      ja: ["共感能力", "創造性", "真正性", "柔軟性"]
    },
    careers: {
      ko: ["예술가", "심리학자", "작가", "음악가"],
      en: ["Artist", "Psychologist", "Writer", "Musician"],
      ja: ["芸術家", "心理学者", "作家", "音楽家"]
    },
    famous: {
      ko: ["윌리엄 셰익스피어", "존 레논", "반 고흐"],
      en: ["William Shakespeare", "John Lennon", "Van Gogh"],
      ja: ["ウィリアム・シェイクスピア", "ジョン・レノン", "ファン・ゴッホ"]
    }
  },
  ENFJ: {
    type: "ENFJ",
    name: {
      ko: "교육자",
      en: "The Protagonist",
      ja: "教育者"
    },
    description: {
      ko: "따뜻하고 카리스마 있는 교육자입니다. 다른 사람의 잠재력을 발견하고 성장시키는 것을 좋아하며, 강한 공감능력과 의사소통 능력을 가지고 있습니다.",
      en: "A warm and charismatic educator. You enjoy discovering and nurturing others' potential, possessing strong empathy and communication skills.",
      ja: "温かくカリスマ性のある教育者です。他の人の潜在能力を発見し成長させることを好み、強い共感能力とコミュニケーション能力を持っています。"
    },
    traits: {
      ko: ["카리스마", "이타주의", "소통능력", "영감적"],
      en: ["Charismatic", "Altruistic", "Communicative", "Inspiring"],
      ja: ["カリスマ", "利他主義", "コミュニケーション能力", "インスピレーション"]
    },
    careers: {
      ko: ["교사", "코치", "상담사", "정치인"],
      en: ["Teacher", "Coach", "Counselor", "Politician"],
      ja: ["教師", "コーチ", "カウンセラー", "政治家"]
    },
    famous: {
      ko: ["오프라 윈프리", "버락 오바마", "존 F. 케네디"],
      en: ["Oprah Winfrey", "Barack Obama", "John F. Kennedy"],
      ja: ["オプラ・ウィンフリー", "バラク・オバマ", "ジョン・F・ケネディ"]
    }
  },
  ENFP: {
    type: "ENFP",
    name: {
      ko: "활동가",
      en: "The Campaigner",
      ja: "活動家"
    },
    description: {
      ko: "열정적이고 창의적인 자유로운 영혼입니다. 새로운 사람들과의 만남을 즐기고, 무한한 가능성을 보며 다른 사람들에게 영감을 주는 능력이 있습니다.",
      en: "A passionate and creative free spirit. You enjoy meeting new people, see endless possibilities, and have the ability to inspire others.",
      ja: "情熱的で創造的な自由な魂です。新しい人との出会いを楽しみ、無限の可能性を見て他の人にインスピレーションを与える能力があります。"
    },
    traits: {
      ko: ["열정적", "창의적", "사교적", "낙관적"],
      en: ["Enthusiastic", "Creative", "Sociable", "Optimistic"],
      ja: ["情熱的", "創造的", "社交的", "楽観的"]
    },
    careers: {
      ko: ["마케터", "배우", "기자", "심리학자"],
      en: ["Marketer", "Actor", "Journalist", "Psychologist"],
      ja: ["マーケター", "俳優", "記者", "心理学者"]
    },
    famous: {
      ko: ["로빈 윌리엄스", "엘런 드제너러스", "윌 스미스"],
      en: ["Robin Williams", "Ellen DeGeneres", "Will Smith"],
      ja: ["ロビン・ウィリアムズ", "エレン・デジェネレス", "ウィル・スミス"]
    }
  },
  ISTJ: {
    type: "ISTJ",
    name: {
      ko: "관리자",
      en: "The Logistician",
      ja: "管理者"
    },
    description: {
      ko: "믿을 수 있고 책임감 강한 실무자입니다. 체계적이고 논리적으로 일을 처리하며, 전통과 질서를 중시하고 맡은 바 역할을 성실히 수행합니다.",
      en: "A reliable and responsible practitioner. You handle tasks systematically and logically, value tradition and order, and faithfully perform your duties.",
      ja: "信頼できて責任感の強い実務者です。体系的で論理的に仕事を処理し、伝統と秩序を重視し任された役割を誠実に遂行します。"
    },
    traits: {
      ko: ["책임감", "성실함", "체계적", "신뢰성"],
      en: ["Responsible", "Diligent", "Systematic", "Reliable"],
      ja: ["責任感", "誠実", "体系的", "信頼性"]
    },
    careers: {
      ko: ["회계사", "관리자", "은행원", "공무원"],
      en: ["Accountant", "Manager", "Banker", "Civil Servant"],
      ja: ["会計士", "管理者", "銀行員", "公務員"]
    },
    famous: {
      ko: ["조지 워싱턴", "워렌 버핏", "안젤라 메르켈"],
      en: ["George Washington", "Warren Buffett", "Angela Merkel"],
      ja: ["ジョージ・ワシントン", "ウォーレン・バフェット", "アンゲラ・メルケル"]
    }
  },
  ISFJ: {
    type: "ISFJ",
    name: {
      ko: "보호자",
      en: "The Protector",
      ja: "保護者"
    },
    description: {
      ko: "따뜻하고 헌신적인 보호자입니다. 다른 사람의 필요를 민감하게 파악하고 도움을 주는 것을 좋아하며, 조화로운 환경을 만들기 위해 노력합니다.",
      en: "A warm and dedicated protector. You sensitively understand others' needs and enjoy helping them, working to create harmonious environments.",
      ja: "温かく献身的な保護者です。他の人のニーズを敏感に把握し助けることを好み、調和のとれた環境を作るために努力します。"
    },
    traits: {
      ko: ["배려심", "협조적", "겸손함", "인내심"],
      en: ["Caring", "Cooperative", "Humble", "Patient"],
      ja: ["思いやり", "協力的", "謙遜", "忍耐力"]
    },
    careers: {
      ko: ["간호사", "교사", "사회복지사", "상담사"],
      en: ["Nurse", "Teacher", "Social Worker", "Counselor"],
      ja: ["看護師", "教師", "ソーシャルワーカー", "カウンセラー"]
    },
    famous: {
      ko: ["마더 테레사", "케이트 미들턴", "로사 파크스"],
      en: ["Mother Teresa", "Kate Middleton", "Rosa Parks"],
      ja: ["マザー・テレサ", "ケイト・ミドルトン", "ローザ・パークス"]
    }
  },
  ESTJ: {
    type: "ESTJ",
    name: {
      ko: "경영자",
      en: "The Executive",
      ja: "経営者"
    },
    description: {
      ko: "실용적이고 효율적인 경영자입니다. 목표 달성을 위해 체계적으로 계획을 세우고 실행하며, 팀을 이끌고 결과를 만들어내는 능력이 뛰어납니다.",
      en: "A practical and efficient executive. You systematically plan and execute to achieve goals, excelling at leading teams and producing results.",
      ja: "実用的で効率的な経営者です。目標達成のために体系的に計画を立てて実行し、チームを率いて結果を出す能力に優れています。"
    },
    traits: {
      ko: ["조직력", "실용성", "결단력", "효율성"],
      en: ["Organized", "Practical", "Decisive", "Efficient"],
      ja: ["組織力", "実用性", "決断力", "効率性"]
    },
    careers: {
      ko: ["CEO", "관리자", "판사", "군인"],
      en: ["CEO", "Manager", "Judge", "Military Officer"],
      ja: ["CEO", "管理者", "裁判官", "軍人"]
    },
    famous: {
      ko: ["힐러리 클린턴", "프랭클린 루즈벨트", "고든 램지"],
      en: ["Hillary Clinton", "Franklin Roosevelt", "Gordon Ramsay"],
      ja: ["ヒラリー・クリントン", "フランクリン・ルーズベルト", "ゴードン・ラムゼイ"]
    }
  },
  ESFJ: {
    type: "ESFJ",
    name: {
      ko: "사교가",
      en: "The Consul",
      ja: "社交家"
    },
    description: {
      ko: "따뜻하고 사교적인 협력자입니다. 다른 사람과의 관계를 중시하며 조화로운 분위기를 만들어가고, 팀워크를 통해 목표를 달성하는 것을 선호합니다.",
      en: "A warm and sociable collaborator. You value relationships with others, create harmonious atmospheres, and prefer achieving goals through teamwork.",
      ja: "温かく社交的な協力者です。他の人との関係を重視し調和のとれた雰囲気を作り、チームワークを通じて目標を達成することを好みます。"
    },
    traits: {
      ko: ["사교적", "배려심", "협력적", "성실함"],
      en: ["Sociable", "Caring", "Cooperative", "Conscientious"],
      ja: ["社交的", "思いやり", "協力的", "誠実"]
    },
    careers: {
      ko: ["교사", "간호사", "이벤트플래너", "인사담당자"],
      en: ["Teacher", "Nurse", "Event Planner", "HR Specialist"],
      ja: ["教師", "看護師", "イベントプランナー", "人事担当者"]
    },
    famous: {
      ko: ["테일러 스위프트", "휴 잭맨", "엘튼 존"],
      en: ["Taylor Swift", "Hugh Jackman", "Elton John"],
      ja: ["テイラー・スウィフト", "ヒュー・ジャックマン", "エルトン・ジョン"]
    }
  },
  ISTP: {
    type: "ISTP",
    name: {
      ko: "장인",
      en: "The Virtuoso",
      ja: "職人"
    },
    description: {
      ko: "실용적이고 유연한 문제 해결사입니다. 손으로 직접 작업하는 것을 좋아하며, 논리적 사고와 실용적 접근으로 효율적인 해결책을 찾아냅니다.",
      en: "A practical and flexible problem solver. You enjoy hands-on work and find efficient solutions through logical thinking and practical approaches.",
      ja: "実用的で柔軟な問題解決者です。手で直接作業することを好み、論理的思考と実用的アプローチで効率的な解決策を見つけ出します。"
    },
    traits: {
      ko: ["실용적", "유연성", "논리적", "독립적"],
      en: ["Practical", "Flexible", "Logical", "Independent"],
      ja: ["実用的", "柔軟性", "論理的", "独立的"]
    },
    careers: {
      ko: ["엔지니어", "기계공", "파일럿", "프로그래머"],
      en: ["Engineer", "Mechanic", "Pilot", "Programmer"],
      ja: ["エンジニア", "機械工", "パイロット", "プログラマー"]
    },
    famous: {
      ko: ["마이클 조던", "브루스 리", "클린트 이스트우드"],
      en: ["Michael Jordan", "Bruce Lee", "Clint Eastwood"],
      ja: ["マイケル・ジョーダン", "ブルース・リー", "クリント・イーストウッド"]
    }
  },
  ISFP: {
    type: "ISFP",
    name: {
      ko: "모험가",
      en: "The Adventurer",
      ja: "冒険家"
    },
    description: {
      ko: "자유롭고 창의적인 모험가입니다. 자신만의 가치관을 중시하며 예술적 감성이 풍부하고, 새로운 경험과 아름다움을 추구합니다.",
      en: "A free and creative adventurer. You value your own principles, have rich artistic sensibilities, and pursue new experiences and beauty.",
      ja: "自由で創造的な冒険家です。自分だけの価値観を重視し芸術的感性が豊かで、新しい経験と美しさを追求します。"
    },
    traits: {
      ko: ["예술적", "유연성", "민감함", "진정성"],
      en: ["Artistic", "Flexible", "Sensitive", "Authentic"],
      ja: ["芸術的", "柔軟性", "敏感", "真正性"]
    },
    careers: {
      ko: ["예술가", "디자이너", "음악가", "사진작가"],
      en: ["Artist", "Designer", "Musician", "Photographer"],
      ja: ["芸術家", "デザイナー", "音楽家", "写真家"]
    },
    famous: {
      ko: ["마이클 잭슨", "프린스", "모차르트"],
      en: ["Michael Jackson", "Prince", "Mozart"],
      ja: ["マイケル・ジャクソン", "プリンス", "モーツァルト"]
    }
  },
  ESTP: {
    type: "ESTP",
    name: {
      ko: "사업가",
      en: "The Entrepreneur",
      ja: "起業家"
    },
    description: {
      ko: "에너지 넘치고 현실적인 행동가입니다. 순간의 기회를 포착하는 능력이 뛰어나며, 사람들과의 교류를 통해 활력을 얻고 실용적인 해결책을 찾습니다.",
      en: "An energetic and realistic action-taker. You excel at seizing opportunities in the moment, gain vitality through interactions with people, and find practical solutions.",
      ja: "エネルギッシュで現実的な行動家です。瞬間の機会を捉える能力に優れ、人々との交流を通じて活力を得て実用的な解決策を見つけます。"
    },
    traits: {
      ko: ["에너지", "실용성", "사교적", "적응력"],
      en: ["Energetic", "Practical", "Sociable", "Adaptable"],
      ja: ["エネルギッシュ", "実用性", "社交的", "適応力"]
    },
    careers: {
      ko: ["영업사원", "기업가", "운동선수", "연예인"],
      en: ["Salesperson", "Entrepreneur", "Athlete", "Entertainer"],
      ja: ["営業担当者", "起業家", "運動選手", "芸能人"]
    },
    famous: {
      ko: ["도널드 트럼프", "어니스트 헤밍웨이", "마돈나"],
      en: ["Donald Trump", "Ernest Hemingway", "Madonna"],
      ja: ["ドナルド・トランプ", "アーネスト・ヘミングウェイ", "マドンナ"]
    }
  },
  ESFP: {
    type: "ESFP",
    name: {
      ko: "연예인",
      en: "The Entertainer",
      ja: "エンターテイナー"
    },
    description: {
      ko: "밝고 사교적인 엔터테이너입니다. 사람들과 함께 있을 때 가장 행복하며, 긍정적인 에너지로 주변을 즐겁게 만들고 순간을 즐기며 삽니다.",
      en: "A bright and sociable entertainer. You're happiest when with people, making others happy with positive energy and living in the moment.",
      ja: "明るく社交的なエンターテイナーです。人々と一緒にいる時が最も幸せで、ポジティブなエネルギーで周りを楽しくさせ瞬間を楽しんで生きます。"
    },
    traits: {
      ko: ["사교적", "낙관적", "친근함", "융통성"],
      en: ["Sociable", "Optimistic", "Friendly", "Flexible"],
      ja: ["社交的", "楽観的", "親しみやすい", "融通性"]
    },
    careers: {
      ko: ["연예인", "교사", "상담사", "이벤트플래너"],
      en: ["Entertainer", "Teacher", "Counselor", "Event Planner"],
      ja: ["エンターテイナー", "教師", "カウンセラー", "イベントプランナー"]
    },
    famous: {
      ko: ["엘비스 프레슬리", "마릴린 먼로", "윌 스미스"],
      en: ["Elvis Presley", "Marilyn Monroe", "Will Smith"],
      ja: ["エルビス・プレスリー", "マリリン・モンロー", "ウィル・スミス"]
    }
  }
};

export default function MBTITest() {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [mbtiType, setMbtiType] = useState<string>('');

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
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setMbtiType('');
  };

  const shareResult = () => {
    const result = mbtiResults[mbtiType];
    const shareText = `내 MBTI는 ${result.type} - ${result.name[i18n.language as keyof typeof result.name]}입니다! ToolHub.tools에서 확인해보세요!`;
    
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

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentLang = i18n.language as 'ko' | 'en' | 'ja';

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
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {currentLang === 'ko' ? '주요 특성' : 
                     currentLang === 'ja' ? '主要特性' : 'Key Traits'}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {result.traits[currentLang].map((trait, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                        {trait}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold mb-4">
                    {currentLang === 'ko' ? '추천 직업' : 
                     currentLang === 'ja' ? '推奨職業' : 'Recommended Careers'}
                  </h3>
                  <ul className="space-y-2">
                    {result.careers[currentLang].map((career, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {career}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    {currentLang === 'ko' ? '유명인' : 
                     currentLang === 'ja' ? '有名人' : 'Famous People'}
                  </h3>
                  <ul className="space-y-2 mb-6">
                    {result.famous[currentLang].map((person, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {person}
                      </li>
                    ))}
                  </ul>

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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AdSense */}
          <div className="flex justify-center mb-8">
            <AdSense adSlot="1234567893" className="w-full max-w-4xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLang === 'ko' ? 'MBTI 성격유형 테스트' : 
             currentLang === 'ja' ? 'MBTI性格タイプテスト' : 'MBTI Personality Test'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLang === 'ko' ? '15가지 상황별 질문으로 당신의 성격유형을 찾아보세요' : 
             currentLang === 'ja' ? '15の状況別質問であなたの性格タイプを見つけてください' : 
             'Discover your personality type through 15 situation-based questions'}
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
                {questions[currentQuestion].text[currentLang]}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {getAnswerOptions(questions[currentQuestion].id, currentLang).map((option) => (
                <Button
                  key={option.value}
                  variant={answers[questions[currentQuestion].id] === option.value ? "default" : "outline"}
                  className="w-full justify-start p-4 h-auto text-left"
                  onClick={() => handleAnswer(questions[currentQuestion].id, option.value)}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-current mr-3 flex items-center justify-center flex-shrink-0">
                    {answers[questions[currentQuestion].id] === option.value && (
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
                disabled={answers[questions[currentQuestion].id] === undefined}
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

        {/* AdSense */}
        <div className="flex justify-center mt-8">
          <AdSense adSlot="1234567894" className="w-full max-w-2xl" />
        </div>
      </div>
    </div>
  );
}