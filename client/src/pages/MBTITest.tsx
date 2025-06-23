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
  // E vs I questions
  {
    id: 1,
    text: {
      ko: "새로운 사람들과 만나는 것을 즐기며, 대화를 통해 에너지를 얻는다",
      en: "I enjoy meeting new people and gain energy from conversations",
      ja: "新しい人と出会うことを楽しみ、会話からエネルギーを得る"
    },
    dimension: 'EI',
    weight: 'E'
  },
  {
    id: 2,
    text: {
      ko: "혼자 있는 시간이 필요하며, 조용한 환경에서 더 집중할 수 있다",
      en: "I need alone time and can focus better in quiet environments",
      ja: "一人の時間が必要で、静かな環境でより集中できる"
    },
    dimension: 'EI',
    weight: 'I'
  },
  {
    id: 3,
    text: {
      ko: "파티나 모임에서 활발하게 참여하며 많은 사람들과 어울리는 것을 좋아한다",
      en: "I actively participate in parties and gatherings, enjoying being with many people",
      ja: "パーティーや集まりで積極的に参加し、多くの人と一緒にいることを好む"
    },
    dimension: 'EI',
    weight: 'E'
  },
  // S vs N questions
  {
    id: 4,
    text: {
      ko: "현실적이고 구체적인 사실들에 집중하며, 경험을 통해 배우는 것을 선호한다",
      en: "I focus on realistic and concrete facts, preferring to learn through experience",
      ja: "現実的で具体的な事実に集中し、経験を通して学ぶことを好む"
    },
    dimension: 'SN',
    weight: 'S'
  },
  {
    id: 5,
    text: {
      ko: "새로운 아이디어와 가능성을 탐구하며, 상상력을 발휘하는 것을 즐긴다",
      en: "I explore new ideas and possibilities, enjoying the use of imagination",
      ja: "新しいアイデアや可能性を探求し、想像力を発揮することを楽しむ"
    },
    dimension: 'SN',
    weight: 'N'
  },
  {
    id: 6,
    text: {
      ko: "세부사항에 주의를 기울이며, 체계적이고 순서대로 일을 처리한다",
      en: "I pay attention to details and handle tasks systematically and in order",
      ja: "細部に注意を払い、体系的で順序立てて仕事を処理する"
    },
    dimension: 'SN',
    weight: 'S'
  },
  // T vs F questions
  {
    id: 7,
    text: {
      ko: "결정을 내릴 때 논리와 객관적 분석을 중시한다",
      en: "I prioritize logic and objective analysis when making decisions",
      ja: "決定を下す際に論理と客観的分析を重視する"
    },
    dimension: 'TF',
    weight: 'T'
  },
  {
    id: 8,
    text: {
      ko: "다른 사람들의 감정과 가치관을 고려하여 결정을 내린다",
      en: "I make decisions considering other people's emotions and values",
      ja: "他の人の感情や価値観を考慮して決定を下す"
    },
    dimension: 'TF',
    weight: 'F'
  },
  {
    id: 9,
    text: {
      ko: "비판적 사고를 통해 문제를 해결하며, 효율성을 추구한다",
      en: "I solve problems through critical thinking and pursue efficiency",
      ja: "批判的思考を通じて問題を解決し、効率性を追求する"
    },
    dimension: 'TF',
    weight: 'T'
  },
  // J vs P questions
  {
    id: 10,
    text: {
      ko: "계획을 세우고 일정을 지키는 것을 선호하며, 미리 준비하는 편이다",
      en: "I prefer making plans and keeping schedules, preparing in advance",
      ja: "計画を立てて日程を守ることを好み、事前に準備する方だ"
    },
    dimension: 'JP',
    weight: 'J'
  },
  {
    id: 11,
    text: {
      ko: "유연하고 자발적인 것을 좋아하며, 즉흥적으로 행동하는 편이다",
      en: "I like being flexible and spontaneous, tending to act impromptu",
      ja: "柔軟で自発的なことを好み、即興的に行動する方だ"
    },
    dimension: 'JP',
    weight: 'P'
  },
  {
    id: 12,
    text: {
      ko: "결정을 내리기 전에 모든 옵션을 열어두고 싶어한다",
      en: "I want to keep all options open before making a decision",
      ja: "決定を下す前にすべての選択肢を開けておきたい"
    },
    dimension: 'JP',
    weight: 'P'
  }
];

const mbtiResults: Record<string, MBTIResult> = {
  INTJ: {
    type: "INTJ",
    name: {
      ko: "건축가",
      en: "The Architect",
      ja: "建築家"
    },
    description: {
      ko: "상상력이 풍부하고 전략적인 사고를 하는 계획가입니다.",
      en: "Imaginative and strategic thinkers, with a plan for everything.",
      ja: "想像力豊かで戦略的な思考を持つ計画家です。"
    },
    traits: {
      ko: ["독립적", "전략적", "완벽주의", "창의적"],
      en: ["Independent", "Strategic", "Perfectionist", "Creative"],
      ja: ["独立的", "戦略的", "完璧主義", "創造的"]
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
      ko: "논리술사",
      en: "The Thinker",
      ja: "論理学者"
    },
    description: {
      ko: "혁신적인 발명가로, 지식에 대한 끊임없는 갈증을 가지고 있습니다.",
      en: "Innovative inventors with an unquenchable thirst for knowledge.",
      ja: "革新的な発明家で、知識への尽きない渇望を持っています。"
    },
    traits: {
      ko: ["분석적", "객관적", "호기심", "논리적"],
      en: ["Analytical", "Objective", "Curious", "Logical"],
      ja: ["分析的", "客観的", "好奇心", "論理的"]
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
      ko: "통솔자",
      en: "The Commander",
      ja: "指揮官"
    },
    description: {
      ko: "대담하고 상상력이 풍부한 리더로, 길을 찾거나 만들어냅니다.",
      en: "Bold, imaginative and strong-willed leaders, always finding a way or making one.",
      ja: "大胆で想像力豊かな強い意志を持つリーダーで、常に道を見つけるか作り出します。"
    },
    traits: {
      ko: ["리더십", "결단력", "효율성", "야망"],
      en: ["Leadership", "Decisive", "Efficient", "Ambitious"],
      ja: ["リーダーシップ", "決断力", "効率性", "野心"]
    },
    careers: {
      ko: ["CEO", "경영컨설턴트", "변호사", "정치인"],
      en: ["CEO", "Management Consultant", "Lawyer", "Politician"],
      ja: ["CEO", "経営コンサルタント", "弁護士", "政治家"]
    },
    famous: {
      ko: ["스티브 잡스", "고든 램지", "마가렛 대처"],
      en: ["Steve Jobs", "Gordon Ramsay", "Margaret Thatcher"],
      ja: ["スティーブ・ジョブズ", "ゴードン・ラムゼイ", "マーガレット・サッチャー"]
    }
  },
  ENTP: {
    type: "ENTP",
    name: {
      ko: "변론가",
      en: "The Debater",
      ja: "討論者"
    },
    description: {
      ko: "영리하고 호기심이 많은 사색가로, 지적 도전을 거부할 수 없습니다.",
      en: "Smart and curious thinkers who cannot resist an intellectual challenge.",
      ja: "賢くて好奇心旺盛な思想家で、知的挑戦を拒むことができません。"
    },
    traits: {
      ko: ["창의적", "열정적", "다재다능", "카리스마"],
      en: ["Creative", "Enthusiastic", "Versatile", "Charismatic"],
      ja: ["創造的", "情熱的", "多才多能", "カリスマ"]
    },
    careers: {
      ko: ["기업가", "발명가", "마케터", "저널리스트"],
      en: ["Entrepreneur", "Inventor", "Marketer", "Journalist"],
      ja: ["起業家", "発明家", "マーケター", "ジャーナリスト"]
    },
    famous: {
      ko: ["토마스 에디슨", "로버트 다우니 주니어", "마크 트웨인"],
      en: ["Thomas Edison", "Robert Downey Jr.", "Mark Twain"],
      ja: ["トーマス・エジソン", "ロバート・ダウニー・Jr.", "マーク・トウェイン"]
    }
  },
  INFJ: {
    type: "INFJ",
    name: {
      ko: "옹호자",
      en: "The Advocate",
      ja: "提唱者"
    },
    description: {
      ko: "조용하고 신비로우며 동시에 매우 영감을 주는 이상주의자입니다.",
      en: "Quiet and mystical, yet very inspiring and tireless idealists.",
      ja: "静かで神秘的でありながら、非常にインスピレーションを与える理想主義者です。"
    },
    traits: {
      ko: ["통찰력", "이상주의", "결단력", "원칙주의"],
      en: ["Insightful", "Idealistic", "Decisive", "Principled"],
      ja: ["洞察力", "理想主義", "決断力", "原則主義"]
    },
    careers: {
      ko: ["상담사", "작가", "교사", "활동가"],
      en: ["Counselor", "Writer", "Teacher", "Activist"],
      ja: ["カウンセラー", "作家", "教師", "活動家"]
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
      ko: "중재자",
      en: "The Mediator",
      ja: "仲裁者"
    },
    description: {
      ko: "시적이고 친절하며 이타적인 성격으로, 항상 선을 행할 준비가 되어 있습니다.",
      en: "Poetic, kind and altruistic people, always eager to help a good cause.",
      ja: "詩的で親切で利他的な人々で、常に善良な目的を助ける準備ができています。"
    },
    traits: {
      ko: ["공감능력", "창의성", "개방성", "유연성"],
      en: ["Empathetic", "Creative", "Open-minded", "Flexible"],
      ja: ["共感能力", "創造性", "開放性", "柔軟性"]
    },
    careers: {
      ko: ["예술가", "심리학자", "사회복지사", "음악가"],
      en: ["Artist", "Psychologist", "Social Worker", "Musician"],
      ja: ["芸術家", "心理学者", "ソーシャルワーカー", "音楽家"]
    },
    famous: {
      ko: ["윌리엄 셰익스피어", "존 레논", "J.R.R. 톨킨"],
      en: ["William Shakespeare", "John Lennon", "J.R.R. Tolkien"],
      ja: ["ウィリアム・シェイクスピア", "ジョン・レノン", "J.R.R.トールキン"]
    }
  },
  ENFJ: {
    type: "ENFJ",
    name: {
      ko: "주인공",
      en: "The Protagonist",
      ja: "主人公"
    },
    description: {
      ko: "카리스마 있고 영감을 주는 지도자로, 듣는 이들을 매혹시킵니다.",
      en: "Charismatic and inspiring leaders, able to mesmerize their listeners.",
      ja: "カリスマ的でインスピレーションを与えるリーダーで、聞き手を魅了することができます。"
    },
    traits: {
      ko: ["카리스마", "이타주의", "신뢰성", "자연스러운 리더"],
      en: ["Charismatic", "Altruistic", "Reliable", "Natural Leader"],
      ja: ["カリスマ", "利他主義", "信頼性", "自然なリーダー"]
    },
    careers: {
      ko: ["교사", "정치인", "코치", "상담사"],
      en: ["Teacher", "Politician", "Coach", "Counselor"],
      ja: ["教師", "政治家", "コーチ", "カウンセラー"]
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
      ja: "運動家"
    },
    description: {
      ko: "열정적이고 창의적인 성격으로, 긍정적으로 삶을 바라봅니다.",
      en: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.",
      ja: "情熱的で創造的な性格で、人生を前向きに見つめます。"
    },
    traits: {
      ko: ["열정적", "창의적", "사교적", "호기심"],
      en: ["Enthusiastic", "Creative", "Sociable", "Curious"],
      ja: ["情熱的", "創造的", "社交的", "好奇心"]
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
      ko: "논리주의자",
      en: "The Logistician",
      ja: "管理者"
    },
    description: {
      ko: "실용적이고 사실에 근거한 접근을 하는 믿음직한 성격입니다.",
      en: "Practical and fact-oriented reliability, taking a logical approach to their goals.",
      ja: "実用的で事実に基づいたアプローチをする信頼できる性格です。"
    },
    traits: {
      ko: ["책임감", "성실함", "현실적", "체계적"],
      en: ["Responsible", "Sincere", "Practical", "Systematic"],
      ja: ["責任感", "誠実", "現実的", "体系的"]
    },
    careers: {
      ko: ["회계사", "관리자", "법무관", "은행원"],
      en: ["Accountant", "Manager", "Legal Officer", "Banker"],
      ja: ["会計士", "管理者", "法務官", "銀行員"]
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
      ko: "수호자",
      en: "The Protector",
      ja: "擁護者"
    },
    description: {
      ko: "따뜻하고 헌신적인 성격으로, 항상 사랑하는 사람들을 보호할 준비가 되어 있습니다.",
      en: "Warm-hearted and dedicated, always ready to protect their loved ones.",
      ja: "温かく献身的な性格で、常に愛する人々を守る準備ができています。"
    },
    traits: {
      ko: ["배려심", "협조적", "신뢰성", "인내심"],
      en: ["Caring", "Cooperative", "Reliable", "Patient"],
      ja: ["思いやり", "協力的", "信頼性", "忍耐力"]
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
      ja: "幹部"
    },
    description: {
      ko: "훌륭한 관리자로, 사물이나 사람들을 관리하는 데 타고난 재능이 있습니다.",
      en: "Excellent administrators, unsurpassed at managing things or people.",
      ja: "優秀な管理者で、物事や人々を管理することに生まれつきの才能があります。"
    },
    traits: {
      ko: ["조직력", "실용성", "리더십", "결단력"],
      en: ["Organized", "Practical", "Leadership", "Decisive"],
      ja: ["組織力", "実用性", "リーダーシップ", "決断力"]
    },
    careers: {
      ko: ["CEO", "관리자", "판사", "군인"],
      en: ["CEO", "Manager", "Judge", "Military Officer"],
      ja: ["CEO", "管理者", "裁判官", "軍人"]
    },
    famous: {
      ko: ["힐러리 클린턴", "고든 램지", "프랭클린 루즈벨트"],
      en: ["Hillary Clinton", "Gordon Ramsay", "Franklin Roosevelt"],
      ja: ["ヒラリー・クリントン", "ゴードン・ラムゼイ", "フランクリン・ルーズベルト"]
    }
  },
  ESFJ: {
    type: "ESFJ",
    name: {
      ko: "집정관",
      en: "The Consul",
      ja: "領事"
    },
    description: {
      ko: "매우 사교적이고 인기가 많으며, 항상 다른 사람을 도우려 합니다.",
      en: "Extraordinarily caring, social and popular people, always eager to help.",
      ja: "非常に社交的で人気があり、いつも他人を助けようとします。"
    },
    traits: {
      ko: ["사교적", "배려심", "협력적", "책임감"],
      en: ["Social", "Caring", "Cooperative", "Responsible"],
      ja: ["社交的", "思いやり", "協力的", "責任感"]
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
      ko: "만능재주꾼",
      en: "The Virtuoso",
      ja: "巨匠"
    },
    description: {
      ko: "대담하고 실용적인 실험가로, 모든 종류의 도구를 다루는 달인입니다.",
      en: "Bold and practical experimenters, masters of all kinds of tools.",
      ja: "大胆で実用的な実験者で、あらゆる種類の道具の達人です。"
    },
    traits: {
      ko: ["실용적", "유연성", "관찰력", "적응력"],
      en: ["Practical", "Flexible", "Observant", "Adaptable"],
      ja: ["実用的", "柔軟性", "観察力", "適応力"]
    },
    careers: {
      ko: ["엔지니어", "기계공", "파일럿", "프로그래머"],
      en: ["Engineer", "Mechanic", "Pilot", "Programmer"],
      ja: ["エンジニア", "機械工", "パイロット", "プログラマー"]
    },
    famous: {
      ko: ["마이클 조던", "브루스 리", "클리ント 이스트우드"],
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
      ko: "유연하고 매력적인 예술가로, 항상 새로운 가능성을 탐험할 준비가 되어 있습니다.",
      en: "Flexible and charming artists, always ready to explore new possibilities.",
      ja: "柔軟で魅力的な芸術家で、常に新しい可能性を探求する準備ができています。"
    },
    traits: {
      ko: ["예술적", "유연성", "민감함", "독립적"],
      en: ["Artistic", "Flexible", "Sensitive", "Independent"],
      ja: ["芸術的", "柔軟性", "敏感", "独立的"]
    },
    careers: {
      ko: ["예술가", "디자이너", "음악가", "사진작가"],
      en: ["Artist", "Designer", "Musician", "Photographer"],
      ja: ["芸術家", "デザイナー", "音楽家", "写真家"]
    },
    famous: {
      ko: ["마이클 잭슨", "프린스", "볼프강 모차르트"],
      en: ["Michael Jackson", "Prince", "Wolfgang Mozart"],
      ja: ["マイケル・ジャクソン", "プリンス", "ヴォルフガング・モーツァルト"]
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
      ko: "영리하고 에너지 넘치며 지각이 뛰어난 성격으로, 진정으로 삶을 즐깁니다.",
      en: "Smart, energetic and very perceptive people, who truly enjoy living on the edge.",
      ja: "賢くエネルギッシュで非常に知覚力のある性格で、本当に人生を楽しみます。"
    },
    traits: {
      ko: ["에너지", "실용성", "관찰력", "사교적"],
      en: ["Energetic", "Practical", "Observant", "Sociable"],
      ja: ["エネルギッシュ", "実用性", "観察力", "社交的"]
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
      ko: "자발적이고 열정적이며 사교적인 성격으로, 삶과 사람에 대한 사랑이 넘칩니다.",
      en: "Spontaneous, energetic and enthusiastic people – life is never boring around them.",
      ja: "自発的で情熱的で社交的な性格で、人生と人に対する愛に溢れています。"
    },
    traits: {
      ko: ["활발함", "친근함", "협력적", "실용적"],
      en: ["Lively", "Friendly", "Cooperative", "Practical"],
      ja: ["活発", "親しみやすい", "協力的", "実用的"]
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
            {currentLang === 'ko' ? '16가지 성격유형 중 당신의 유형을 찾아보세요' : 
             currentLang === 'ja' ? '16の性格タイプの中からあなたのタイプを見つけてください' : 
             'Discover your personality type among 16 different types'}
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
              {[
                { value: 1, label: currentLang === 'ko' ? '전혀 그렇지 않다' : currentLang === 'ja' ? '全くそうではない' : 'Strongly Disagree' },
                { value: 2, label: currentLang === 'ko' ? '그렇지 않다' : currentLang === 'ja' ? 'そうではない' : 'Disagree' },
                { value: 3, label: currentLang === 'ko' ? '보통이다' : currentLang === 'ja' ? '普通' : 'Neutral' },
                { value: 4, label: currentLang === 'ko' ? '그렇다' : currentLang === 'ja' ? 'そうだ' : 'Agree' },
                { value: 5, label: currentLang === 'ko' ? '매우 그렇다' : currentLang === 'ja' ? '非常にそうだ' : 'Strongly Agree' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={answers[questions[currentQuestion].id] === option.value ? "default" : "outline"}
                  className="w-full justify-start p-4 h-auto"
                  onClick={() => handleAnswer(questions[currentQuestion].id, option.value)}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-current mr-3 flex items-center justify-center">
                    {answers[questions[currentQuestion].id] === option.value && (
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                    )}
                  </div>
                  {option.label}
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