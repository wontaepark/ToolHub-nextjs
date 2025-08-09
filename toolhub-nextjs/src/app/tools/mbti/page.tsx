'use client';

import { useState } from 'react';
import { Seo, SeoPresets } from '@/components/Seo';
import { AdBannerInline } from '@/components/AdBanner';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    dimension: 'EI' | 'SN' | 'TF' | 'JP';
    value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "파티나 모임에서 당신은?",
    options: [
      { text: "여러 사람과 대화하며 에너지를 얻는다", dimension: 'EI', value: 'E' },
      { text: "소수의 친한 사람과 깊은 대화를 선호한다", dimension: 'EI', value: 'I' }
    ]
  },
  {
    id: 2,
    text: "새로운 정보를 접할 때 당신은?",
    options: [
      { text: "구체적인 사실과 세부사항에 주목한다", dimension: 'SN', value: 'S' },
      { text: "전체적인 의미와 가능성을 먼저 생각한다", dimension: 'SN', value: 'N' }
    ]
  },
  {
    id: 3,
    text: "중요한 결정을 내릴 때 당신은?",
    options: [
      { text: "논리적 분석과 객관적 기준을 중시한다", dimension: 'TF', value: 'T' },
      { text: "사람들의 감정과 관계를 우선 고려한다", dimension: 'TF', value: 'F' }
    ]
  },
  {
    id: 4,
    text: "계획을 세울 때 당신은?",
    options: [
      { text: "미리 체계적으로 계획하고 일정을 정한다", dimension: 'JP', value: 'J' },
      { text: "상황에 따라 유연하게 대응하는 편이다", dimension: 'JP', value: 'P' }
    ]
  },
  {
    id: 5,
    text: "휴일을 보낼 때 당신은?",
    options: [
      { text: "친구들과 활동적인 시간을 보내고 싶다", dimension: 'EI', value: 'E' },
      { text: "혼자만의 시간으로 재충전하고 싶다", dimension: 'EI', value: 'I' }
    ]
  },
  {
    id: 6,
    text: "업무를 처리할 때 당신은?",
    options: [
      { text: "검증된 방법과 경험을 활용한다", dimension: 'SN', value: 'S' },
      { text: "새로운 아이디어와 혁신을 추구한다", dimension: 'SN', value: 'N' }
    ]
  },
  {
    id: 7,
    text: "갈등 상황에서 당신은?",
    options: [
      { text: "객관적 사실에 근거해 해결하려 한다", dimension: 'TF', value: 'T' },
      { text: "모든 사람의 입장을 이해하려 노력한다", dimension: 'TF', value: 'F' }
    ]
  },
  {
    id: 8,
    text: "여행을 떠날 때 당신은?",
    options: [
      { text: "세세한 일정과 예약을 미리 완료한다", dimension: 'JP', value: 'J' },
      { text: "대략적인 계획만 세우고 현지에서 결정한다", dimension: 'JP', value: 'P' }
    ]
  }
];

const mbtiTypes: Record<string, { name: string; description: string; traits: string[] }> = {
  'INTJ': {
    name: '전략가',
    description: '상상력이 풍부하고 전략적인 사고를 하는 완벽주의자',
    traits: ['독립적', '분석적', '창의적', '결단력 있음']
  },
  'INTP': {
    name: '논리술사',
    description: '지식을 추구하는 혁신적이고 독립적인 사색가',
    traits: ['논리적', '창의적', '객관적', '유연한']
  },
  'ENTJ': {
    name: '지휘관',
    description: '대담하고 상상력이 풍부한 의지가 강한 리더',
    traits: ['리더십', '전략적', '효율적', '자신감']
  },
  'ENTP': {
    name: '변론가',
    description: '똑똑하고 호기심이 많은 사색가이자 끊임없는 도전자',
    traits: ['혁신적', '열정적', '유연한', '창의적']
  },
  'INFJ': {
    name: '옹호자',
    description: '선의를 가지고 있는 신비롭고 영감을 주는 이상주의자',
    traits: ['이상주의', '공감능력', '창의적', '결단력']
  },
  'INFP': {
    name: '중재자',
    description: '항상 선을 행할 준비가 되어 있는 시적이고 친절한 이타주의자',
    traits: ['이상주의', '충성심', '적응력', '호기심']
  },
  'ENFJ': {
    name: '선도자',
    description: '카리스마 있고 영감을 주는 리더로 듣는 사람을 매혹시킴',
    traits: ['카리스마', '이타적', '신뢰할 수 있는', '자연스러운 리더']
  },
  'ENFP': {
    name: '활동가',
    description: '열정적이고 창의적인 사교적이며 자유로운 영혼',
    traits: ['열정적', '창의적', '사교적', '낙관적']
  },
  'ISTJ': {
    name: '논리주의자',
    description: '사실을 중요하게 여기는 신뢰할 수 있고 실용적인 현실주의자',
    traits: ['책임감', '신뢰할 수 있는', '체계적', '성실한']
  },
  'ISFJ': {
    name: '수호자',
    description: '따뜻한 마음을 가진 헌신적인 수호자이자 항상 도울 준비가 된 사람',
    traits: ['배려심', '책임감', '온화한', '협력적']
  },
  'ESTJ': {
    name: '경영자',
    description: '뛰어난 관리자로 사물이나 사람을 관리하는 데 타고난 재능이 있음',
    traits: ['조직적', '실용적', '논리적', '결단력']
  },
  'ESFJ': {
    name: '집정관',
    description: '사교적이고 인기가 많으며 항상 남을 도우려 하는 마음 씨 좋은 사람',
    traits: ['사교적', '배려심', '협력적', '충성심']
  },
  'ISTP': {
    name: '장인',
    description: '대담하고 실용적인 탐구형 사고를 가진 만능 재주꾼',
    traits: ['실용적', '유연한', '관찰력', '차분한']
  },
  'ISFP': {
    name: '모험가',
    description: '유연하고 매력적인 예술가로 항상 새로운 가능성을 탐구할 준비가 됨',
    traits: ['예술적', '유연한', '매력적', '민감한']
  },
  'ESTP': {
    name: '사업가',
    description: '똑똑하고 에너지 넘치며 매우 뛰어난 지각력을 가진 사람',
    traits: ['활동적', '현실적', '사교적', '자발적']
  },
  'ESFP': {
    name: '연예인',
    description: '즉흥적이고 열정적이며 사교적인 자유로운 영혼',
    traits: ['열정적', '친근한', '즉흥적', '협력적']
  }
};

export default function MBTIPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (dimension: string, value: string) => {
    const newAnswers = { ...answers, [dimension]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<string, string>) => {
    const dimensions = ['EI', 'SN', 'TF', 'JP'];
    let mbtiType = '';

    dimensions.forEach(dim => {
      if (finalAnswers[dim]) {
        mbtiType += finalAnswers[dim];
      } else {
        // 기본값 설정
        mbtiType += dim[0];
      }
    });

    setResult(mbtiType);
    setShowResult(true);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setShowResult(false);
  };

  const shareResult = () => {
    if (result) {
      const text = `나의 MBTI 유형은 ${result} (${mbtiTypes[result].name})입니다! ToolHub.tools에서 테스트해보세요.`;
      const url = 'https://toolhub.tools/tools/mbti';
      
      if (navigator.share) {
        navigator.share({
          title: 'MBTI 테스트 결과',
          text: text,
          url: url
        });
      } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        alert('결과가 클립보드에 복사되었습니다!');
      }
    }
  };

  if (showResult && result) {
    const resultData = mbtiTypes[result];
    
    return (
      <>
        <Seo {...SeoPresets.mbti} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🧠 MBTI 테스트 결과
            </h1>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {result}
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {resultData.name}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {resultData.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {resultData.traits.map((trait, index) => (
                <div key={index} className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3">
                  <span className="text-blue-800 dark:text-blue-200 font-medium">
                    {trait}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={shareResult}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                결과 공유하기
              </button>
              <button
                onClick={resetTest}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                다시 테스트하기
              </button>
            </div>
          </div>

          <AdBannerInline />

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              MBTI란?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              MBTI(Myers-Briggs Type Indicator)는 개인의 선호도를 파악하여 16가지 성격유형 중 하나로 분류하는 성격 검사입니다. 
              자신을 이해하고 타인과의 관계를 개선하는 데 도움이 됩니다.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo {...SeoPresets.mbti} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🧠 MBTI 성격유형 테스트
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            8개의 질문으로 알아보는 나의 성격 유형
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* 진행률 바 */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>진행률</span>
              <span>{currentQuestion + 1}/{questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* 질문 */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {questions[currentQuestion].text}
            </h2>
            
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.dimension, option.value)}
                  className="w-full p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <span className="text-gray-900 dark:text-white">
                    {option.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 이전 버튼 */}
          {currentQuestion > 0 && (
            <div className="text-center">
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← 이전 질문으로
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            MBTI 4가지 선호 지표
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">에너지 방향</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">외향(E) vs 내향(I)</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">인식 기능</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">감각(S) vs 직관(N)</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">판단 기능</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">사고(T) vs 감정(F)</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">생활 양식</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">판단(J) vs 인식(P)</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}