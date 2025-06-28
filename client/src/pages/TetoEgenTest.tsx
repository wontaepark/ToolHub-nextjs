import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Share2, Heart, Users, Star, BookOpen, CheckCircle, HelpCircle, Lightbulb } from 'lucide-react';
import AdSense from '@/components/AdSense';
import SEOHead from '@/components/SEOHead';

interface Question {
  id: number;
  text: {
    ko: string;
    en: string;
    ja: string;
  };
  options: {
    text: {
      ko: string;
      en: string;
      ja: string;
    };
    weight: 'T' | 'E'; // T for 테토, E for 에겐
    intensity: number; // 1-3 강도
  }[];
}

interface TestResult {
  type: 'TETO_MALE' | 'TETO_FEMALE' | 'EGEN_MALE' | 'EGEN_FEMALE';
  title: {
    ko: string;
    en: string;
    ja: string;
  };
  subtitle: {
    ko: string;
    en: string;
    ja: string;
  };
  description: {
    ko: string;
    en: string;
    ja: string;
  };
  personality: {
    ko: string[];
    en: string[];
    ja: string[];
  };
  loveStyle: {
    ko: string;
    en: string;
    ja: string;
  };
  compatibility: {
    best: {
      ko: string;
      en: string;
      ja: string;
    };
    avoid: {
      ko: string;
      en: string;
      ja: string;
    };
  };
  percentage: number;
  emoji: string;
  shareText: {
    ko: string;
    en: string;
    ja: string;
  };
}

const questions: Question[] = [
  {
    id: 1,
    text: {
      ko: "새로운 사람들이 있는 모임에 갔을 때 당신의 행동은?",
      en: "What do you do when you go to a gathering with new people?",
      ja: "新しい人がいる集まりに行った時、あなたの行動は？"
    },
    options: [
      { 
        text: {
          ko: "조용히 구석에서 아는 사람들과만 대화한다",
          en: "Quietly chat only with people I know in the corner",
          ja: "静かに隅で知っている人とだけ会話する"
        }, 
        weight: 'T', intensity: 3 
      },
      { 
        text: {
          ko: "처음 보는 사람들에게도 먼저 말을 건다",
          en: "Approach strangers first to start conversations",
          ja: "初めて会う人にも先に話しかける"
        }, 
        weight: 'E', intensity: 3 
      },
      { 
        text: {
          ko: "아는 사람이 소개해주면 대화를 시작한다",
          en: "Start conversations when someone I know introduces me",
          ja: "知り合いが紹介してくれたら会話を始める"
        }, 
        weight: 'T', intensity: 1 
      },
      { 
        text: {
          ko: "분위기를 보고 적당히 섞인다",
          en: "Read the atmosphere and naturally blend in",
          ja: "雰囲気を見て適度に混ざる"
        }, 
        weight: 'E', intensity: 1 
      }
    ]
  },
  {
    id: 2,
    text: {
      ko: "친구가 고민을 털어놓을 때 당신의 반응은?",
      en: "How do you react when a friend shares their worries?",
      ja: "友達が悩みを打ち明けた時のあなたの反応は？"
    },
    options: [
      { 
        text: {
          ko: "조용히 들어주고 공감해준다",
          en: "Listen quietly and empathize",
          ja: "静かに聞いて共感してあげる"
        }, 
        weight: 'T', intensity: 2 
      },
      { 
        text: {
          ko: "적극적으로 해결책을 제시한다",
          en: "Actively suggest solutions",
          ja: "積極的に解決策を提示する"
        }, 
        weight: 'E', intensity: 2 
      },
      { 
        text: {
          ko: "비슷한 경험담을 들려준다",
          en: "Share similar experiences",
          ja: "似たような経験談を聞かせる"
        }, 
        weight: 'E', intensity: 1 
      },
      { 
        text: {
          ko: "그냥 옆에 있어준다",
          en: "Just be there for them",
          ja: "ただそばにいてあげる"
        }, 
        weight: 'T', intensity: 3 
      }
    ]
  },
  {
    id: 3,
    text: {
      ko: "SNS에 올리는 게시물의 스타일은?",
      en: "What's your style for social media posts?",
      ja: "SNSに投稿する時のスタイルは？"
    },
    options: [
      { 
        text: {
          ko: "일상 사진을 간단한 멘트와 함께",
          en: "Daily photos with simple captions",
          ja: "日常写真を簡単なコメントと一緒に"
        }, 
        weight: 'T', intensity: 2 
      },
      { 
        text: {
          ko: "재미있는 밈이나 유머 게시물",
          en: "Funny memes or humorous posts",
          ja: "面白いミームやユーモア投稿"
        }, 
        weight: 'E', intensity: 2 
      },
      { 
        text: {
          ko: "감성적인 글과 함께 인생샷",
          en: "Life shots with emotional captions",
          ja: "感性的な文章と一緒に人生ショット"
        }, 
        weight: 'T', intensity: 1 
      },
      { 
        text: {
          ko: "거의 올리지 않는다",
          en: "Rarely post anything",
          ja: "ほとんど投稿しない"
        }, 
        weight: 'T', intensity: 3 
      }
    ]
  },
  {
    id: 4,
    text: {
      ko: "이상형을 만났을 때 당신의 어프로치 방식은?",
      en: "How do you approach someone you're interested in?",
      ja: "理想のタイプに会った時のあなたのアプローチ方法は？"
    },
    options: [
      { 
        text: {
          ko: "눈치를 주면서 상대방이 알아채길 기다린다",
          en: "Give subtle hints and wait for them to notice",
          ja: "サインを出しながら相手が気づくのを待つ"
        }, 
        weight: 'T', intensity: 3 
      },
      { 
        text: {
          ko: "직접적으로 호감을 표현한다",
          en: "Express interest directly",
          ja: "直接的に好意を表現する"
        }, 
        weight: 'E', intensity: 3 
      },
      { 
        text: {
          ko: "자연스럽게 대화를 늘려간다",
          en: "Naturally increase conversations",
          ja: "自然に会話を増やしていく"
        }, 
        weight: 'E', intensity: 1 
      },
      { 
        text: {
          ko: "친구를 통해 간접적으로 접근한다",
          en: "Approach indirectly through friends",
          ja: "友達を通して間接的にアプローチする"
        }, 
        weight: 'T', intensity: 2 
      }
    ]
  },
  {
    id: 5,
    text: {
      ko: "주말에 가장 하고 싶은 활동은?",
      en: "What do you most want to do on weekends?",
      ja: "週末に最もしたい活動は？"
    },
    options: [
      { 
        text: {
          ko: "집에서 넷플릭스 보며 혼자만의 시간",
          en: "Watch Netflix at home, enjoying alone time",
          ja: "家でネットフリックスを見ながら一人の時間"
        }, 
        weight: 'T', intensity: 3 
      },
      { 
        text: {
          ko: "친구들과 신나게 놀러 나가기",
          en: "Go out and have fun with friends",
          ja: "友達と楽しく遊びに出かける"
        }, 
        weight: 'E', intensity: 3 
      },
      { 
        text: {
          ko: "카페에서 책 읽거나 공부하기",
          en: "Read books or study at a cafe",
          ja: "カフェで本を読んだり勉強したり"
        }, 
        weight: 'T', intensity: 2 
      },
      { 
        text: {
          ko: "새로운 맛집이나 장소 탐방하기",
          en: "Explore new restaurants or places",
          ja: "新しいグルメスポットや場所を探検"
        }, 
        weight: 'E', intensity: 2 
      }
    ]
  },
  {
    id: 6,
    text: {
      ko: "갑작스럽게 계획이 바뀌었을 때 당신의 반응은?",
      en: "How do you react when plans suddenly change?",
      ja: "突然計画が変わった時のあなたの反応は？"
    },
    options: [
      { 
        text: {
          ko: "스트레스를 받지만 적응하려고 노력한다",
          en: "Feel stressed but try to adapt",
          ja: "ストレスを受けるが適応しようと努力する"
        }, 
        weight: 'T', intensity: 2 
      },
      { 
        text: {
          ko: "오히려 더 재미있을 것 같다고 생각한다",
          en: "Think it might be more fun instead",
          ja: "むしろもっと面白そうだと思う"
        }, 
        weight: 'E', intensity: 2 
      },
      { 
        text: {
          ko: "차라리 집에 가고 싶어진다",
          en: "Would rather just go home",
          ja: "むしろ家に帰りたくなる"
        }, 
        weight: 'T', intensity: 3 
      },
      { 
        text: {
          ko: "새로운 계획을 적극적으로 제안한다",
          en: "Actively suggest new plans",
          ja: "新しい計画を積極的に提案する"
        }, 
        weight: 'E', intensity: 3 
      }
    ]
  },
  {
    id: 7,
    text: {
      ko: "연인과의 데이트에서 선호하는 스타일은?",
      en: "What's your preferred style for dates with your partner?",
      ja: "恋人とのデートで好むスタイルは？"
    },
    options: [
      { 
        text: {
          ko: "둘만의 조용하고 아늑한 분위기",
          en: "Quiet and cozy atmosphere for just the two of us",
          ja: "二人だけの静かで居心地の良い雰囲気"
        }, 
        weight: 'T', intensity: 3 
      },
      { 
        text: {
          ko: "활동적이고 다양한 경험을 할 수 있는 곳",
          en: "Active places with various experiences",
          ja: "活動的で様々な経験ができる場所"
        }, 
        weight: 'E', intensity: 3 
      },
      { 
        text: {
          ko: "맛있는 음식을 함께 즐기는 시간",
          en: "Time enjoying delicious food together",
          ja: "美味しい食べ物を一緒に楽しむ時間"
        }, 
        weight: 'T', intensity: 1 
      },
      { 
        text: {
          ko: "사람들이 많은 핫플레이스",
          en: "Popular places with lots of people",
          ja: "人が多い人気スポット"
        }, 
        weight: 'E', intensity: 2 
      }
    ]
  },
  {
    id: 8,
    text: {
      ko: "친구들 사이에서 당신의 포지션은?",
      en: "What's your position among friends?",
      ja: "友達の間でのあなたのポジションは？"
    },
    options: [
      { 
        text: {
          ko: "조용하지만 든든한 조력자",
          en: "Quiet but reliable supporter",
          ja: "静かだが頼もしい協力者"
        }, 
        weight: 'T', intensity: 3 
      },
      { 
        text: {
          ko: "분위기 메이커이자 리더",
          en: "Mood maker and leader",
          ja: "ムードメーカーでありリーダー"
        }, 
        weight: 'E', intensity: 3 
      },
      { 
        text: {
          ko: "좋은 리스너이자 상담사",
          en: "Good listener and counselor",
          ja: "良いリスナーでありカウンセラー"
        }, 
        weight: 'T', intensity: 2 
      },
      { 
        text: {
          ko: "아이디어 뱅크이자 계획자",
          en: "Idea bank and planner",
          ja: "アイデアバンクであり計画者"
        }, 
        weight: 'E', intensity: 2 
      }
    ]
  },
  {
    id: 9,
    text: {
      ko: "스트레스를 받을 때 당신의 해소 방법은?",
      en: "How do you relieve stress?",
      ja: "ストレスを受けた時のあなたの解消方法は？"
    },
    options: [
      { 
        text: {
          ko: "혼자만의 시간을 가지며 충전한다",
          en: "Have alone time to recharge",
          ja: "一人の時間を持って充電する"
        }, 
        weight: 'T', intensity: 3 
      },
      { 
        text: {
          ko: "친구들과 만나서 수다를 떤다",
          en: "Meet friends and chat",
          ja: "友達と会っておしゃべりする"
        }, 
        weight: 'E', intensity: 3 
      },
      { 
        text: {
          ko: "좋아하는 음악을 들으며 감정을 정리한다",
          en: "Listen to favorite music and process emotions",
          ja: "好きな音楽を聞きながら感情を整理する"
        }, 
        weight: 'T', intensity: 2 
      },
      { 
        text: {
          ko: "운동이나 활동적인 것으로 에너지를 발산한다",
          en: "Release energy through exercise or activities",
          ja: "運動や活動的なことでエネルギーを発散する"
        }, 
        weight: 'E', intensity: 2 
      }
    ]
  },
  {
    id: 10,
    text: {
      ko: "새로운 환경에 적응하는 당신의 스타일은?",
      en: "What's your style for adapting to new environments?",
      ja: "新しい環境に適応するあなたのスタイルは？"
    },
    options: [
      { 
        text: {
          ko: "천천히 관찰하면서 조심스럽게 적응한다",
          en: "Observe slowly and adapt carefully",
          ja: "ゆっくり観察しながら慎重に適応する"
        }, 
        weight: 'T', intensity: 3 
      },
      { 
        text: {
          ko: "적극적으로 새로운 사람들과 친해진다",
          en: "Actively make friends with new people",
          ja: "積極的に新しい人と親しくなる"
        }, 
        weight: 'E', intensity: 3 
      },
      { 
        text: {
          ko: "필요한 것들부터 차근차근 해결한다",
          en: "Solve necessary things step by step",
          ja: "必要なことから着実に解決する"
        }, 
        weight: 'T', intensity: 2 
      },
      { 
        text: {
          ko: "일단 뛰어들고 부딪히면서 배운다",
          en: "Jump in and learn by experiencing",
          ja: "とりあえず飛び込んでぶつかりながら学ぶ"
        }, 
        weight: 'E', intensity: 2 
      }
    ]
  }
];

const results: Record<string, TestResult> = {
  TETO_MALE: {
    type: 'TETO_MALE',
    title: {
      ko: '테토남',
      en: 'Teto Male',
      ja: 'テト男'
    },
    subtitle: {
      ko: '조용한 매력의 소유자',
      en: 'Owner of Quiet Charm',
      ja: '静かな魅力の持ち主'
    },
    description: {
      ko: '차분하고 신중한 성격으로 깊이 있는 대화를 좋아하는 당신. 겉으로는 조용해 보이지만 속에는 따뜻한 마음을 품고 있어요. 진짜 친해지면 의외로 재미있고 다정한 면을 보여주는 반전 매력의 소유자입니다.',
      en: 'You have a calm and thoughtful personality who enjoys deep conversations. While you appear quiet on the outside, you have a warm heart within. You are someone with surprising charm who shows an unexpectedly fun and caring side once you become truly close.',
      ja: '落ち着いて慎重な性格で、深い会話を好むあなた。外見は静かに見えますが、心の中には温かい気持ちを持っています。本当に親しくなると、意外にも面白くて優しい一面を見せる反転魅力の持ち主です。'
    },
    personality: {
      ko: ['내향적', '신중함', '깊이 있음', '진정성', '안정감'],
      en: ['Introverted', 'Cautious', 'Deep', 'Authentic', 'Stable'],
      ja: ['内向的', '慎重', '深み', '真正性', '安定感']
    },
    loveStyle: {
      ko: '천천히 마음을 열지만 한번 사랑하면 진심으로 대해주는 스타일. 화려한 이벤트보다는 소소하지만 의미 있는 시간을 함께 보내는 것을 좋아해요.',
      en: 'You open your heart slowly, but once you love, you treat them with sincerity. You prefer spending quiet but meaningful time together rather than flashy events.',
      ja: 'ゆっくりと心を開くが、一度愛すると真心で接するスタイル。華やかなイベントよりも、ささやかだが意味のある時間を一緒に過ごすことを好みます。'
    },
    compatibility: {
      best: {
        ko: '에겐녀 - 활발한 에너지로 당신의 조용한 매력을 끌어내줄 수 있어요',
        en: 'Egen Female - Can draw out your quiet charm with lively energy',
        ja: 'エゲン女 - 活発なエネルギーであなたの静かな魅力を引き出してくれます'
      },
      avoid: {
        ko: '테토녀 - 둘 다 조용해서 관계 발전이 어려울 수 있어요',
        en: 'Teto Female - Both being quiet might make relationship progress difficult',
        ja: 'テト女 - 二人とも静かで関係発展が難しい可能性があります'
      }
    },
    percentage: 23,
    emoji: '🤫',
    shareText: {
      ko: '나는 조용한 매력의 테토남! 친구들은 어떤 유형일까?',
      en: 'I am a Teto Male with quiet charm! What type are my friends?',
      ja: '私は静かな魅力のテト男！友達はどんなタイプかな？'
    }
  },
  TETO_FEMALE: {
    type: 'TETO_FEMALE',
    title: {
      ko: '테토녀',
      en: 'Teto Female',
      ja: 'テト女'
    },
    subtitle: {
      ko: '신비로운 매력의 여신',
      en: 'Goddess of Mysterious Charm',
      ja: '神秘的な魅力の女神'
    },
    description: {
      ko: '조용하지만 독특한 개성을 가진 당신. 많은 사람들과 어울리기보다는 진짜 통하는 소수의 사람들과 깊은 관계를 맺는 것을 선호해요. 신비로운 분위기로 사람들의 호기심을 자극하는 매력적인 존재입니다.',
      en: 'You are quiet but have a unique personality. You prefer building deep relationships with a few people who truly understand you rather than mixing with many people. You are an attractive presence that stimulates people\'s curiosity with your mysterious atmosphere.',
      ja: '静かだが独特な個性を持つあなた。多くの人と付き合うよりも、本当に通じ合う少数の人と深い関係を築くことを好みます。神秘的な雰囲気で人々の好奇心を刺激する魅力的な存在です。'
    },
    personality: {
      ko: ['신비로움', '독립적', '예술적', '섬세함', '직관적'],
      en: ['Mysterious', 'Independent', 'Artistic', 'Delicate', 'Intuitive'],
      ja: ['神秘的', '独立的', '芸術的', '繊細', '直感的']
    },
    loveStyle: {
      ko: '로맨틱하고 감성적인 연애를 꿈꾸지만 쉽게 마음을 내보이지 않는 스타일. 상대방이 당신의 진짜 모습을 알아가는 과정을 중요하게 생각해요.',
      en: 'You dream of romantic and emotional relationships but don\'t easily show your heart. You value the process of your partner getting to know your true self.',
      ja: 'ロマンチックで感性的な恋愛を夢見るが、簡単に心を見せないスタイル。相手があなたの本当の姿を知っていく過程を大切に思います。'
    },
    compatibility: {
      best: {
        ko: '에겐남 - 적극적인 어프로치로 당신의 마음을 열어줄 수 있어요',
        en: 'Egen Male - Can open your heart with active approach',
        ja: 'エゲン男 - 積極的なアプローチであなたの心を開いてくれます'
      },
      avoid: {
        ko: '테토남 - 서로 조심스러워서 진전이 없을 수 있어요',
        en: 'Teto Male - Both being cautious might lead to no progress',
        ja: 'テト男 - お互い慎重で進展がない可能性があります'
      }
    },
    percentage: 19,
    emoji: '🌙',
    shareText: {
      ko: '나는 신비로운 매력의 테토녀! 친구들 중에 누가 에겐남일까?',
      en: 'I am a Teto Female with mysterious charm! Who among my friends is Egen Male?',
      ja: '私は神秘的な魅力のテト女！友達の中で誰がエゲン男かな？'
    }
  },
  EGEN_MALE: {
    type: 'EGEN_MALE',
    title: {
      ko: '에겐남',
      en: 'Egen Male',
      ja: 'エゲン男'
    },
    subtitle: {
      ko: '활발한 에너지의 리더',
      en: 'Leader with Vibrant Energy',
      ja: '活発なエネルギーのリーダー'
    },
    description: {
      ko: '사교적이고 활발한 성격으로 어디서든 인기가 많은 당신. 새로운 사람들과 만나는 것을 좋아하고 분위기를 이끄는 능력이 뛰어나요. 긍정적인 에너지로 주변 사람들을 즐겁게 만드는 매력적인 존재입니다.',
      en: 'You have a sociable and active personality that makes you popular everywhere. You love meeting new people and have excellent ability to lead the atmosphere. You are an attractive presence who makes people around you happy with positive energy.',
      ja: '社交的で活発な性格でどこでも人気のあるあなた。新しい人と会うことを好み、雰囲気を導く能力に優れています。ポジティブなエネルギーで周りの人を楽しませる魅力的な存在です。'
    },
    personality: {
      ko: ['외향적', '리더십', '유머감각', '적극적', '사교적'],
      en: ['Extroverted', 'Leadership', 'Sense of Humor', 'Active', 'Social'],
      ja: ['外向的', 'リーダーシップ', 'ユーモア感覚', '積極的', '社交的']
    },
    loveStyle: {
      ko: '직진형 연애 스타일로 좋아하면 적극적으로 표현하는 타입. 연인과 함께 다양한 경험을 하며 활동적인 데이트를 선호해요.',
      en: 'Straightforward dating style who actively expresses when they like someone. You prefer active dates with various experiences together with your partner.',
      ja: '直進型の恋愛スタイルで、好きになると積極的に表現するタイプ。恋人と一緒に様々な経験をしながら活動的なデートを好みます。'
    },
    compatibility: {
      best: {
        ko: '테토녀 - 조용한 매력에 끌리며 서로 보완적인 관계가 될 수 있어요',
        en: 'Teto Female - Attracted to quiet charm and can form complementary relationship',
        ja: 'テト女 - 静かな魅力に惹かれ、お互い補完的な関係になれます'
      },
      avoid: {
        ko: '에겐녀 - 둘 다 활발해서 가끔 충돌할 수 있어요',
        en: 'Egen Female - Both being active might sometimes lead to conflicts',
        ja: 'エゲン女 - 二人とも活発で時々衝突する可能性があります'
      }
    },
    percentage: 31,
    emoji: '🔥',
    shareText: {
      ko: '나는 활발한 에너지의 에겐남! 테토녀는 어디 있나요?',
      en: 'I am an Egen Male with vibrant energy! Where are the Teto Females?',
      ja: '私は活発なエネルギーのエゲン男！テト女はどこにいますか？'
    }
  },
  EGEN_FEMALE: {
    type: 'EGEN_FEMALE',
    title: {
      ko: '에겐녀',
      en: 'Egen Female',
      ja: 'エゲン女'
    },
    subtitle: {
      ko: '밝고 긍정적인 분위기 메이커',
      en: 'Bright and Positive Mood Maker',
      ja: '明るくポジティブなムードメーカー'
    },
    description: {
      ko: '밝고 활발한 성격으로 모든 모임의 중심이 되는 당신. 누구와도 쉽게 친해지는 능력이 있고 항상 긍정적인 에너지를 발산해요. 사람들과 함께 있을 때 가장 빛나는 타고난 분위기 메이커입니다.',
      en: 'You become the center of every gathering with your bright and active personality. You have the ability to easily get along with anyone and always radiate positive energy. You are a natural mood maker who shines brightest when with people.',
      ja: '明るく活発な性格ですべての集まりの中心となるあなた。誰とでも簡単に親しくなる能力があり、常にポジティブなエネルギーを発散します。人と一緒にいる時に最も輝く生まれながらのムードメーカーです。'
    },
    personality: {
      ko: ['활발함', '긍정적', '사교적', '재미있음', '적응력'],
      en: ['Active', 'Positive', 'Social', 'Fun', 'Adaptable'],
      ja: ['活発', 'ポジティブ', '社交的', '面白い', '適応力']
    },
    loveStyle: {
      ko: '솔직하고 직접적인 표현을 좋아하는 스타일. 연인과 함께 새로운 도전을 하고 재미있는 추억을 만드는 것을 중요하게 생각해요.',
      en: 'You prefer honest and direct expression. You value taking on new challenges with your partner and creating fun memories together.',
      ja: '率直で直接的な表現を好むスタイル。恋人と一緒に新しい挑戦をし、楽しい思い出を作ることを大切に思います。'
    },
    compatibility: {
      best: {
        ko: '테토남 - 조용한 상대방의 매력을 발견하고 끌어내는 능력이 있어요',
        en: 'Teto Male - Have the ability to discover and draw out quiet partner\'s charm',
        ja: 'テト男 - 静かな相手の魅力を発見し引き出す能力があります'
      },
      avoid: {
        ko: '에겐남 - 둘 다 주목받기를 좋아해서 경쟁이 될 수 있어요',
        en: 'Egen Male - Both like attention, so it might become competitive',
        ja: 'エゲン男 - 二人とも注目されることを好むので競争になる可能性があります'
      }
    },
    percentage: 27,
    emoji: '✨',
    shareText: {
      ko: '나는 밝고 긍정적인 에겐녀! 누가 테토남인지 궁금해!',
      en: 'I am a bright and positive Egen Female! Curious who is Teto Male!',
      ja: '私は明るくポジティブなエゲン女！誰がテト男か気になる！'
    }
  }
};

export default function TetoEgenTest() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  const progress = questions.length > 0 ? ((currentQuestion + 1) / (questions.length + 1)) * 100 : 0;

  const handleGenderSelect = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
    setCurrentQuestion(0);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = { ...answers, [currentQuestion]: optionIndex };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<number, number>) => {
    let tetoScore = 0;
    let egenScore = 0;

    questions.forEach((question, index) => {
      const answerIndex = finalAnswers[index];
      if (answerIndex !== undefined) {
        const selectedOption = question.options[answerIndex];
        if (selectedOption.weight === 'T') {
          tetoScore += selectedOption.intensity;
        } else {
          egenScore += selectedOption.intensity;
        }
      }
    });

    let resultType: string;
    if (tetoScore > egenScore) {
      resultType = gender === 'male' ? 'TETO_MALE' : 'TETO_FEMALE';
    } else {
      resultType = gender === 'male' ? 'EGEN_MALE' : 'EGEN_FEMALE';
    }

    setResult(results[resultType]);
    setShowResult(true);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
    setGender(null);
  };

  const shareResult = () => {
    if (result) {
      const shareUrl = window.location.href;
      const shareText = `${result.shareText[i18n.language as keyof typeof result.shareText]} ${shareUrl}`;
      
      if (navigator.share) {
        navigator.share({
          title: '테토-에겐 성격유형 테스트',
          text: shareText,
          url: shareUrl
        });
      } else {
        navigator.clipboard.writeText(shareText);
        alert('결과가 클립보드에 복사되었습니다!');
      }
    }
  };

  if (!gender) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <SEOHead toolId="teto-egen" />
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🔥 {i18n.language === 'ko' ? '테토-에겐 성격유형 테스트' : 
                   i18n.language === 'ja' ? 'テト-エゲン性格タイプテスト' : 
                   'Teto-Egen Personality Test'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              {i18n.language === 'ko' ? '나는 테토? 에겐? 나의 진짜 성격유형을 찾아보세요!' : 
               i18n.language === 'ja' ? '私はテト？エゲン？本当の性格タイプを見つけよう！' : 
               'Am I Teto? Egen? Find your true personality type!'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {i18n.language === 'ko' ? '이미 50만명이 참여한 화제의 성격테스트 ✨' : 
               i18n.language === 'ja' ? '既に50万人が参加した話題の性格テスト ✨' : 
               'The viral personality test that 500K people have already taken ✨'}
            </p>
          </div>

          <div className="space-y-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-blue-200 hover:border-blue-400"
              onClick={() => handleGenderSelect('male')}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">👨</div>
                <CardTitle className="text-xl text-blue-600">
                  {i18n.language === 'ko' ? '남성' : i18n.language === 'ja' ? '男性' : 'Male'}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-pink-200 hover:border-pink-400"
              onClick={() => handleGenderSelect('female')}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">👩</div>
                <CardTitle className="text-xl text-pink-600">
                  {i18n.language === 'ko' ? '여성' : i18n.language === 'ja' ? '女性' : 'Female'}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* AdSense */}
        <div className="mb-8 flex justify-center">
          <AdSense adSlot="1234567890" className="w-full max-w-4xl" />
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* 테토-에겐 테스트란 무엇인가요? */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '테토-에겐 성격유형 테스트란 무엇인가요?' : 
               currentLang === 'ja' ? 'テト-エゲン性格タイプテストとは何ですか？' : 
               'What is the Teto-Egen Personality Type Test?'}
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                {currentLang === 'ko' ? 
                  '테토-에겐 성격유형 테스트는 최근 SNS에서 화제가 된 바이럴 성격 분석 도구입니다. "테토"와 "에겐"이라는 두 가지 주요 성향으로 사람들을 분류하며, 성별에 따라 총 4가지 유형(테토남, 테토녀, 에겐남, 에겐녀)으로 나누어집니다. 테토는 내향적이고 신중한 성향을, 에겐은 외향적이고 활발한 성향을 나타냅니다. 이 테스트는 연애 성향, 사회적 관계, 일상적 행동 패턴 등을 종합적으로 분석하여 재미있고 직관적인 결과를 제공합니다.' :
                 currentLang === 'ja' ? 
                  'テト-エゲン性格タイプテストは、最近SNSで話題になったバイラル性格分析ツールです。「テト」と「エゲン」という2つの主要傾向で人々を分類し、性別によって計4つのタイプ（テト男、テト女、エゲン男、エゲン女）に分けられます。テトは内向的で慎重な傾向を、エゲンは外向的で活発な傾向を表します。このテストは恋愛傾向、社会的関係、日常的行動パターンなどを総合的に分析し、面白くて直感的な結果を提供します。' :
                  'The Teto-Egen personality type test is a viral personality analysis tool that recently became popular on social media. It classifies people into two main tendencies, "Teto" and "Egen," and divides them into four types based on gender (Teto Male, Teto Female, Egen Male, Egen Female). Teto represents introverted and cautious tendencies, while Egen represents extroverted and active tendencies. This test comprehensively analyzes romantic tendencies, social relationships, and daily behavioral patterns to provide fun and intuitive results.'
                }
              </p>
              <p>
                {currentLang === 'ko' ? 
                  '특히 젊은 세대 사이에서 큰 인기를 얻고 있으며, 친구들과 함께 테스트하고 결과를 비교하는 것이 하나의 트렌드가 되었습니다. 각 유형별로 궁합 분석, 연애 스타일, 성격 특성 등을 상세히 제공하여 자신과 타인을 이해하는 새로운 방법을 제시합니다. 결과는 희귀도와 함께 제공되어 특별함을 느낄 수 있도록 설계되었습니다.' :
                 currentLang === 'ja' ? 
                  '特に若い世代の間で大きな人気を得ており、友達と一緒にテストして結果を比較することが一つのトレンドになりました。各タイプ別に相性分析、恋愛スタイル、性格特性などを詳しく提供し、自分と他人を理解する新しい方法を提示します。結果は希少度と一緒に提供され、特別感を感じられるよう設計されています。' :
                  'It has gained great popularity especially among younger generations, and testing together with friends and comparing results has become a trend. It provides detailed compatibility analysis, love styles, and personality traits for each type, offering a new way to understand yourself and others. Results are provided with rarity percentages to create a sense of uniqueness.'
                }
              </p>
            </div>
          </section>

          {/* 주요 기능 및 특징 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '주요 기능 및 특징' : 
               currentLang === 'ja' ? '主要機能と特徴' : 
               'Key Features and Characteristics'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {currentLang === 'ko' ? '연애 성향 분석' : 
                       currentLang === 'ja' ? '恋愛傾向分析' : 
                       'Love Style Analysis'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? 
                        '각 유형별 연애 스타일과 어프로치 방법을 상세히 분석하여 제공' :
                       currentLang === 'ja' ? 
                        '各タイプ別の恋愛スタイルとアプローチ方法を詳しく分析して提供' :
                        'Detailed analysis of dating styles and approach methods for each type'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {currentLang === 'ko' ? '궁합 매칭 시스템' : 
                       currentLang === 'ja' ? '相性マッチングシステム' : 
                       'Compatibility Matching System'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? 
                        '최고 궁합과 주의할 궁합을 분석하여 관계 개선에 도움' :
                       currentLang === 'ja' ? 
                        '最高の相性と注意すべき相性を分析して関係改善に役立つ' :
                        'Analyzes best matches and cautionary matches to help improve relationships'
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {currentLang === 'ko' ? '희귀도 시스템' : 
                       currentLang === 'ja' ? '希少度システム' : 
                       'Rarity System'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? 
                        '각 유형별 희귀도 퍼센트로 특별함과 재미 요소 추가' :
                       currentLang === 'ja' ? 
                        '各タイプ別希少度パーセントで特別感と楽しさ要素追加' :
                        'Adds uniqueness and fun factor with rarity percentages for each type'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Share2 className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {currentLang === 'ko' ? '바이럴 공유 기능' : 
                       currentLang === 'ja' ? 'バイラル共有機能' : 
                       'Viral Sharing Feature'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? 
                        '친구들을 유도하는 공유 메시지로 바이럴 확산 최적화' :
                       currentLang === 'ja' ? 
                        '友達を誘導する共有メッセージでバイラル拡散最適化' :
                        'Optimized for viral spread with share messages that encourage friends to participate'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AdSense */}
          <div className="flex justify-center">
            <AdSense adSlot="1234567891" className="w-full max-w-4xl" />
          </div>

          {/* 상세 사용법 가이드 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '상세 사용법 가이드' : 
               currentLang === 'ja' ? '詳細使用法ガイド' : 
               'Detailed Usage Guide'}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '1. 성별 선택' : 
                   currentLang === 'ja' ? '1. 性別選択' : 
                   '1. Gender Selection'}
                </h3>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? 
                    '테스트 시작 시 자신의 성별을 선택합니다. 이는 결과 분석에서 성별별 특성과 연애 성향을 더 정확하게 제공하기 위한 것입니다. 남성과 여성 버튼 중 해당하는 것을 클릭하여 테스트를 시작하세요.' :
                   currentLang === 'ja' ? 
                    'テスト開始時に自分の性別を選択します。これは結果分析で性別別特性と恋愛傾向をより正確に提供するためです。男性と女性ボタンの中から該当するものをクリックしてテストを開始してください。' :
                    'At the start of the test, select your gender. This is to provide more accurate gender-specific traits and romantic tendencies in the result analysis. Click the appropriate button between male and female to start the test.'
                  }
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '2. 질문 응답하기' : 
                   currentLang === 'ja' ? '2. 質問への回答' : 
                   '2. Answering Questions'}
                </h3>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? 
                    '총 10개의 질문에 답합니다. 각 질문은 일상생활, 사회적 상황, 스트레스 대처법 등 다양한 상황에서의 선택을 다룹니다. 가장 자연스럽고 솔직하게 자신의 성향에 맞는 답변을 선택하세요. 진행률 바를 통해 테스트 진행 상황을 확인할 수 있습니다.' :
                   currentLang === 'ja' ? 
                    '合計10の質問に答えます。各質問は日常生活、社会的状況、ストレス対処法など様々な状況での選択を扱います。最も自然で正直に自分の傾向に合った答えを選択してください。進行率バーでテストの進行状況を確認できます。' :
                    'Answer a total of 10 questions. Each question deals with choices in various situations such as daily life, social situations, and stress coping methods. Choose the most natural and honest answers that match your tendencies. You can check test progress through the progress bar.'
                  }
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '3. 결과 확인 및 공유' : 
                   currentLang === 'ja' ? '3. 結果確認と共有' : 
                   '3. Checking and Sharing Results'}
                </h3>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? 
                    '테스트 완료 후 자신의 유형(테토남/테토녀/에겐남/에겐녀)과 상세 분석을 확인합니다. 성격 특성, 연애 스타일, 궁합 분석, 희귀도 등의 정보를 제공받습니다. "결과 공유하기" 버튼을 통해 친구들에게 테스트를 권유하고 서로의 유형을 비교해보세요.' :
                   currentLang === 'ja' ? 
                    'テスト完了後、自分のタイプ（テト男/テト女/エゲン男/エゲン女）と詳細分析を確認します。性格特性、恋愛スタイル、相性分析、希少度などの情報を提供されます。「結果をシェア」ボタンで友達にテストを勧めてお互いのタイプを比較してみてください。' :
                    'After completing the test, check your type (Teto Male/Teto Female/Egen Male/Egen Female) and detailed analysis. You will receive information about personality traits, love style, compatibility analysis, and rarity. Use the "Share Results" button to recommend the test to friends and compare each other\'s types.'
                  }
                </p>
              </div>
            </div>
          </section>

          {/* 활용 예시 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '활용 예시' : 
               currentLang === 'ja' ? '活用例' : 
               'Usage Examples'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '친구들과 함께' : 
                   currentLang === 'ja' ? '友達と一緒に' : 
                   'With Friends'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    '친구들과 함께 테스트를 하고 서로의 유형을 비교하며 재미있는 시간을 보낼 수 있습니다. 궁합 분석을 통해 친구 관계를 더 잘 이해하고, 각자의 성향에 맞는 소통 방법을 찾을 수 있습니다. SNS에 결과를 공유하여 더 많은 친구들의 참여를 유도할 수 있습니다.' :
                   currentLang === 'ja' ? 
                    '友達と一緒にテストをしてお互いのタイプを比較しながら楽しい時間を過ごせます。相性分析を通じて友人関係をより良く理解し、それぞれの傾向に合ったコミュニケーション方法を見つけることができます。SNSに結果をシェアしてより多くの友達の参加を促すことができます。' :
                    'You can have fun taking the test with friends and comparing each other\'s types. Through compatibility analysis, you can better understand friendships and find communication methods that suit each person\'s tendencies. Share results on social media to encourage more friends to participate.'
                  }
                </p>
              </div>
              <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '연애와 관계' : 
                   currentLang === 'ja' ? '恋愛と関係' : 
                   'Dating and Relationships'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    '연인이나 관심 있는 상대와 함께 테스트하여 서로의 성향을 파악하고 더 나은 관계를 만들어갈 수 있습니다. 각 유형별 연애 스타일과 궁합 분석을 통해 상대를 이해하고 적절한 어프로치 방법을 찾을 수 있습니다.' :
                   currentLang === 'ja' ? 
                    '恋人や気になる相手と一緒にテストしてお互いの傾向を把握し、より良い関係を築いていけます。各タイプ別の恋愛スタイルと相性分析を通じて相手を理解し、適切なアプローチ方法を見つけることができます。' :
                    'Take the test with your partner or someone you\'re interested in to understand each other\'s tendencies and build better relationships. Through dating styles and compatibility analysis for each type, you can understand your partner and find appropriate approach methods.'
                  }
                </p>
              </div>
            </div>
          </section>

          {/* AdSense */}
          <div className="flex justify-center">
            <AdSense adSlot="1234567892" className="w-full max-w-4xl" />
          </div>

          {/* 자주 묻는 질문 FAQ */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '자주 묻는 질문 (FAQ)' : 
               currentLang === 'ja' ? 'よくある질問 (FAQ)' : 
               'Frequently Asked Questions (FAQ)'}
            </h2>
            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  {currentLang === 'ko' ? 'Q. 테토와 에겐의 차이점은 무엇인가요?' : 
                   currentLang === 'ja' ? 'Q. テトとエゲンの違いは何ですか？' : 
                   'Q. What is the difference between Teto and Egen?'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    'A. 테토는 내향적이고 신중한 성향을 가진 유형으로, 혼자만의 시간을 중시하고 깊이 있는 관계를 선호합니다. 에겐은 외향적이고 활발한 성향으로, 사람들과의 만남을 즐기고 에너지가 넘치는 특성을 가집니다.' :
                   currentLang === 'ja' ? 
                    'A. テトは内向的で慎重な傾向を持つタイプで、一人の時間を重視し深い関係を好みます。エゲンは外向的で活発な傾向で、人との出会いを楽しみエネルギーに満ちた特性を持ちます。' :
                    'A. Teto is an introverted and cautious type that values alone time and prefers deep relationships. Egen is an extroverted and active type that enjoys meeting people and has energetic characteristics.'
                  }
                </p>
              </div>
              <div className="border-b border-border pb-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  {currentLang === 'ko' ? 'Q. 궁합 분석이 실제로 맞나요?' : 
                   currentLang === 'ja' ? 'Q. 相性分析は実際に当たりますか？' : 
                   'Q. Is the compatibility analysis actually accurate?'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    'A. 궁합 분석은 일반적인 성향을 바탕으로 한 재미있는 참고 자료입니다. 실제 관계는 개인의 성격, 경험, 상황 등 다양한 요소에 의해 결정되므로, 절대적인 기준보다는 흥미로운 관점으로 활용하시기 바랍니다.' :
                   currentLang === 'ja' ? 
                    'A. 相性分析は一般的な傾向に基づく楽しい参考資料です。実際の関係は個人の性格、経験、状況など様々な要素によって決まるため、絶対的な基準よりも興味深い観点として活用してください。' :
                    'A. Compatibility analysis is fun reference material based on general tendencies. Actual relationships are determined by various factors such as individual personality, experience, and situations, so please use it as an interesting perspective rather than an absolute standard.'
                  }
                </p>
              </div>
              <div className="border-b border-border pb-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  {currentLang === 'ko' ? 'Q. 희귀도는 어떻게 계산되나요?' : 
                   currentLang === 'ja' ? 'Q. 希少度はどのように計算されますか？' : 
                   'Q. How is the rarity calculated?'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    'A. 희귀도는 기존 테스트 참여자들의 결과 분포를 바탕으로 계산된 통계적 수치입니다. 더 적은 사람들이 해당하는 유형일수록 높은 희귀도를 가지며, 이는 재미와 특별함을 위한 요소로 제공됩니다.' :
                   currentLang === 'ja' ? 
                    'A. 希少度は既存のテスト参加者の結果分布に基づいて計算された統計的数値です。より少ない人が該当するタイプほど高い希少度を持ち、これは楽しさと特別感のための要素として提供されます。' :
                    'A. Rarity is a statistical figure calculated based on the result distribution of existing test participants. Types that fewer people fall into have higher rarity, and this is provided as an element for fun and uniqueness.'
                  }
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  {currentLang === 'ko' ? 'Q. 테스트 결과가 시간이 지나면 바뀔 수 있나요?' : 
                   currentLang === 'ja' ? 'Q. テスト結果は時間が経つと変わることがありますか？' : 
                   'Q. Can test results change over time?'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    'A. 네, 개인의 성장이나 환경 변화에 따라 성향이 변할 수 있습니다. 특히 인생의 중요한 변화나 새로운 경험을 통해 답변이 달라질 수 있으니, 주기적으로 다시 테스트해보시는 것도 재미있을 것입니다.' :
                   currentLang === 'ja' ? 
                    'A. はい、個人の成長や環境変化によって傾向が変わることがあります。特に人生の重要な変化や新しい経験を通じて答えが変わることがあるので、定期的に再テストしてみるのも面白いでしょう。' :
                    'A. Yes, tendencies can change due to personal growth or environmental changes. Especially through important life changes or new experiences, answers may differ, so it would be interesting to retake the test periodically.'
                  }
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (showResult && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-3xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="text-6xl mb-4">{result.emoji}</div>
              <CardTitle className="text-3xl text-purple-600 dark:text-purple-400">
                {result.title[i18n.language as keyof typeof result.title]}
              </CardTitle>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                {result.subtitle[i18n.language as keyof typeof result.subtitle]}
              </h2>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-3 rounded-lg mt-4">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {i18n.language === 'ko' ? `전체 인구의 ${result.percentage}%에 해당하는 희귀한 유형입니다!` : 
                   i18n.language === 'ja' ? `全人口の${result.percentage}%に該当する希少なタイプです！` : 
                   `A rare type representing ${result.percentage}% of the population!`}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  {i18n.language === 'ko' ? '성격 분석' : i18n.language === 'ja' ? '性格分析' : 'Personality Analysis'}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {result.description[i18n.language as keyof typeof result.description]}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {i18n.language === 'ko' ? '주요 특성' : i18n.language === 'ja' ? '主要特性' : 'Key Traits'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.personality[i18n.language as keyof typeof result.personality].map((trait, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  {i18n.language === 'ko' ? '연애 성향' : i18n.language === 'ja' ? '恋愛傾向' : 'Love Style'}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {result.loveStyle[i18n.language as keyof typeof result.loveStyle]}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-green-500" />
                  {i18n.language === 'ko' ? '궁합 분석' : i18n.language === 'ja' ? '相性分析' : 'Compatibility Analysis'}
                </h3>
                <div className="space-y-2">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-green-700 dark:text-green-300">
                      <strong>
                        {i18n.language === 'ko' ? '최고 궁합:' : i18n.language === 'ja' ? '最高の相性:' : 'Best Match:'}
                      </strong> {result.compatibility.best[i18n.language as keyof typeof result.compatibility.best]}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <p className="text-red-700 dark:text-red-300">
                      <strong>
                        {i18n.language === 'ko' ? '주의할 궁합:' : i18n.language === 'ja' ? '注意すべき相性:' : 'Caution Match:'}
                      </strong> {result.compatibility.avoid[i18n.language as keyof typeof result.compatibility.avoid]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm text-center">
                    💡 {i18n.language === 'ko' ? '친구들도 테스트해보고 누가 어떤 유형인지 비교해보세요!' : 
                         i18n.language === 'ja' ? '友達もテストして誰がどのタイプか比較してみよう！' : 
                         'Have your friends take the test too and compare who is what type!'}
                  </p>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <Button onClick={shareResult} variant="default" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    {i18n.language === 'ko' ? '결과 공유하기' : i18n.language === 'ja' ? '結果をシェア' : 'Share Results'}
                  </Button>
                  <Button onClick={resetTest} variant="outline" className="flex-1">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {i18n.language === 'ko' ? '다시 테스트' : i18n.language === 'ja' ? 'もう一度テスト' : 'Test Again'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={resetTest}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {i18n.language === 'ko' ? '처음으로' : i18n.language === 'ja' ? '最初に戻る' : 'Back to Start'}
          </Button>
          <div className="text-sm text-gray-500">
            {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        <Progress value={progress} className="mb-8" />

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {i18n.language === 'ko' ? `질문 ${currentQuestion + 1}` : 
               i18n.language === 'ja' ? `質問 ${currentQuestion + 1}` : 
               `Question ${currentQuestion + 1}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-center font-medium">
              {currentQ.text[i18n.language as keyof typeof currentQ.text]}
            </p>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  variant="outline"
                  className="w-full p-6 h-auto text-left justify-start hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  {option.text[i18n.language as keyof typeof option.text]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}