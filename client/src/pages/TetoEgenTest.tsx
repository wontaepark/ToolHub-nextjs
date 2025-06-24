import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Share2, Heart, Users, Star } from 'lucide-react';

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
  title: string;
  subtitle: string;
  description: string;
  personality: string[];
  loveStyle: string;
  compatibility: {
    best: string;
    avoid: string;
  };
  percentage: number;
  emoji: string;
  shareText: string;
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
    title: '테토남',
    subtitle: '조용한 매력의 소유자',
    description: '차분하고 신중한 성격으로 깊이 있는 대화를 좋아하는 당신. 겉으로는 조용해 보이지만 속에는 따뜻한 마음을 품고 있어요. 진짜 친해지면 의외로 재미있고 다정한 면을 보여주는 반전 매력의 소유자입니다.',
    personality: ['내향적', '신중함', '깊이 있음', '진정성', '안정감'],
    loveStyle: '천천히 마음을 열지만 한번 사랑하면 진심으로 대해주는 스타일. 화려한 이벤트보다는 소소하지만 의미 있는 시간을 함께 보내는 것을 좋아해요.',
    compatibility: {
      best: '에겐녀 - 활발한 에너지로 당신의 조용한 매력을 끌어내줄 수 있어요',
      avoid: '테토녀 - 둘 다 조용해서 관계 발전이 어려울 수 있어요'
    },
    percentage: 23,
    emoji: '🤫',
    shareText: '나는 조용한 매력의 테토남! 친구들은 어떤 유형일까?'
  },
  TETO_FEMALE: {
    type: 'TETO_FEMALE',
    title: '테토녀',
    subtitle: '신비로운 매력의 여신',
    description: '조용하지만 독특한 개성을 가진 당신. 많은 사람들과 어울리기보다는 진짜 통하는 소수의 사람들과 깊은 관계를 맺는 것을 선호해요. 신비로운 분위기로 사람들의 호기심을 자극하는 매력적인 존재입니다.',
    personality: ['신비로움', '독립적', '예술적', '섬세함', '직관적'],
    loveStyle: '로맨틱하고 감성적인 연애를 꿈꾸지만 쉽게 마음을 내보이지 않는 스타일. 상대방이 당신의 진짜 모습을 알아가는 과정을 중요하게 생각해요.',
    compatibility: {
      best: '에겐남 - 적극적인 어프로치로 당신의 마음을 열어줄 수 있어요',
      avoid: '테토남 - 서로 조심스러워서 진전이 없을 수 있어요'
    },
    percentage: 19,
    emoji: '🌙',
    shareText: '나는 신비로운 매력의 테토녀! 친구들 중에 누가 에겐남일까?'
  },
  EGEN_MALE: {
    type: 'EGEN_MALE',
    title: '에겐남',
    subtitle: '활발한 에너지의 리더',
    description: '사교적이고 활발한 성격으로 어디서든 인기가 많은 당신. 새로운 사람들과 만나는 것을 좋아하고 분위기를 이끄는 능력이 뛰어나요. 긍정적인 에너지로 주변 사람들을 즐겁게 만드는 매력적인 존재입니다.',
    personality: ['외향적', '리더십', '유머감각', '적극적', '사교적'],
    loveStyle: '직진형 연애 스타일로 좋아하면 적극적으로 표현하는 타입. 연인과 함께 다양한 경험을 하며 활동적인 데이트를 선호해요.',
    compatibility: {
      best: '테토녀 - 조용한 매력에 끌리며 서로 보완적인 관계가 될 수 있어요',
      avoid: '에겐녀 - 둘 다 활발해서 가끔 충돌할 수 있어요'
    },
    percentage: 31,
    emoji: '🔥',
    shareText: '나는 활발한 에너지의 에겐남! 테토녀는 어디 있나요?'
  },
  EGEN_FEMALE: {
    type: 'EGEN_FEMALE',
    title: '에겐녀',
    subtitle: '밝고 긍정적인 분위기 메이커',
    description: '밝고 활발한 성격으로 모든 모임의 중심이 되는 당신. 누구와도 쉽게 친해지는 능력이 있고 항상 긍정적인 에너지를 발산해요. 사람들과 함께 있을 때 가장 빛나는 타고난 분위기 메이커입니다.',
    personality: ['활발함', '긍정적', '사교적', '재미있음', '적응력'],
    loveStyle: '솔직하고 직접적인 표현을 좋아하는 스타일. 연인과 함께 새로운 도전을 하고 재미있는 추억을 만드는 것을 중요하게 생각해요.',
    compatibility: {
      best: '테토남 - 조용한 상대방의 매력을 발견하고 끌어내는 능력이 있어요',
      avoid: '에겐남 - 둘 다 주목받기를 좋아해서 경쟁이 될 수 있어요'
    },
    percentage: 27,
    emoji: '✨',
    shareText: '나는 밝고 긍정적인 에겐녀! 누가 테토남인지 궁금해!'
  }
};

export default function TetoEgenTest() {
  const { t, i18n } = useTranslation();
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
      const shareText = `${result.shareText} ${shareUrl}`;
      
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
                {result.title}
              </CardTitle>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                {result.subtitle}
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
                  성격 분석
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {result.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">주요 특성</h3>
                <div className="flex flex-wrap gap-2">
                  {result.personality.map((trait, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  연애 성향
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {result.loveStyle}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-green-500" />
                  궁합 분석
                </h3>
                <div className="space-y-2">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-green-700 dark:text-green-300">
                      <strong>최고 궁합:</strong> {result.compatibility.best}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <p className="text-red-700 dark:text-red-300">
                      <strong>주의할 궁합:</strong> {result.compatibility.avoid}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm text-center">
                    💡 친구들도 테스트해보고 누가 어떤 유형인지 비교해보세요!
                  </p>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <Button onClick={shareResult} variant="default" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    결과 공유하기
                  </Button>
                  <Button onClick={resetTest} variant="outline" className="flex-1">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    다시 테스트
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