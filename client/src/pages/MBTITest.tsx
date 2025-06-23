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
  // Questions will be added here
};

// Function to get style-specific answer options
const getAnswerOptions = (questionId: number, style: string, lang: 'ko' | 'en' | 'ja') => {
  const styleAnswers: Record<string, { value: number; label: Record<'ko' | 'en' | 'ja', string> }[]> = {
    // Ready for new answer options
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
  }
  // Add other MBTI results as needed
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
        // Score calculation logic here
        if (answer >= 4) {
          newScores[question.weight]++;
        } else if (answer <= 2) {
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
      </div>
    </div>
  );
}