'use client';

import { useState } from 'react';
// import { AdBannerInline } from '@/components/AdBanner'; // 사용 예정

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    score: { teto: number; egen: number };
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "친구가 고민을 털어놨을 때 나는?",
    options: [
      { text: "진심으로 공감하며 같이 슬퍼해준다", score: { teto: 2, egen: 0 } },
      { text: "현실적인 해결방안을 제시한다", score: { teto: 0, egen: 2 } }
    ]
  },
  {
    id: 2,
    text: "새로운 사람들과의 모임에서 나는?",
    options: [
      { text: "먼저 다가가서 분위기를 밝게 만든다", score: { teto: 2, egen: 0 } },
      { text: "조용히 관찰하며 필요할 때만 대화한다", score: { teto: 0, egen: 2 } }
    ]
  },
  {
    id: 3,
    text: "연인과 데이트할 때 나는?",
    options: [
      { text: "달콤한 말과 스킨십을 자주한다", score: { teto: 2, egen: 0 } },
      { text: "함께 있는 시간 자체로 충분하다", score: { teto: 0, egen: 2 } }
    ]
  },
  {
    id: 4,
    text: "화가 났을 때 나는?",
    options: [
      { text: "감정을 바로 표현하고 푼다", score: { teto: 2, egen: 0 } },
      { text: "혼자만의 시간으로 정리한다", score: { teto: 0, egen: 2 } }
    ]
  },
  {
    id: 5,
    text: "좋아하는 사람에게 고백할 때 나는?",
    options: [
      { text: "로맨틱하고 감성적으로 표현한다", score: { teto: 2, egen: 0 } },
      { text: "솔직하고 담백하게 말한다", score: { teto: 0, egen: 2 } }
    ]
  },
  {
    id: 6,
    text: "스트레스 해소법은?",
    options: [
      { text: "친구들과 수다떨며 해결한다", score: { teto: 2, egen: 0 } },
      { text: "혼자 취미생활에 몰입한다", score: { teto: 0, egen: 2 } }
    ]
  },
  {
    id: 7,
    text: "선물을 받았을 때 나는?",
    options: [
      { text: "크게 기뻐하며 바로 반응한다", score: { teto: 2, egen: 0 } },
      { text: "고마워하지만 차분하게 받는다", score: { teto: 0, egen: 2 } }
    ]
  },
  {
    id: 8,
    text: "연예인을 좋아할 때 나는?",
    options: [
      { text: "팬카페 활동과 굿즈 수집을 한다", score: { teto: 2, egen: 0 } },
      { text: "조용히 응원하며 작품을 감상한다", score: { teto: 0, egen: 2 } }
    ]
  },
  {
    id: 9,
    text: "친구의 생일파티에서 나는?",
    options: [
      { text: "분위기 메이커 역할을 자처한다", score: { teto: 2, egen: 0 } },
      { text: "조용히 축하해주고 즐긴다", score: { teto: 0, egen: 2 } }
    ]
  },
  {
    id: 10,
    text: "이별 후 나는?",
    options: [
      { text: "감정을 표현하며 주변에 의지한다", score: { teto: 2, egen: 0 } },
      { text: "혼자서 조용히 극복한다", score: { teto: 0, egen: 2 } }
    ]
  }
];

const resultTypes = {
  teto_male: {
    name: "테토남",
    emoji: "🌟",
    description: "감성적이고 다정다감한 로맨티스트",
    traits: ["감수성이 풍부함", "표현력이 뛰어남", "로맨틱함", "사교적"],
    compatibility: "에겐녀",
    rarity: "25%"
  },
  teto_female: {
    name: "테토녀",
    emoji: "💖",
    description: "애교 많고 표현력 풍부한 사랑둥이",
    traits: ["애교가 많음", "감정 표현이 자유로움", "다정함", "친화력 좋음"],
    compatibility: "에겐남",
    rarity: "30%"
  },
  egen_male: {
    name: "에겐남",
    emoji: "🌙",
    description: "차분하고 신중한 깊이 있는 남성",
    traits: ["차분함", "신중함", "깊이 있는 사고", "안정감"],
    compatibility: "테토녀",
    rarity: "20%"
  },
  egen_female: {
    name: "에겐녀",
    emoji: "✨",
    description: "독립적이고 쿨한 매력의 여성",
    traits: ["독립적", "쿨한 매력", "현실적", "개성 있음"],
    compatibility: "테토남",
    rarity: "25%"
  }
};

export default function TetoEgenPage() {
  const [step, setStep] = useState<'gender' | 'test' | 'result'>('gender');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<keyof typeof resultTypes | null>(null);

  const handleGenderSelect = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
    setStep('test');
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: number[]) => {
    let tetoScore = 0;
    let egenScore = 0;

    finalAnswers.forEach((answerIndex, questionIndex) => {
      const question = questions[questionIndex];
      const answer = question.options[answerIndex];
      tetoScore += answer.score.teto;
      egenScore += answer.score.egen;
    });

    let resultKey: keyof typeof resultTypes;
    
    if (tetoScore > egenScore) {
      resultKey = gender === 'male' ? 'teto_male' : 'teto_female';
    } else {
      resultKey = gender === 'male' ? 'egen_male' : 'egen_female';
    }

    setResult(resultKey);
    setStep('result');
  };

  const resetTest = () => {
    setStep('gender');
    setGender(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const shareResult = () => {
    if (result) {
      const resultData = resultTypes[result];
      const text = `나는 ${resultData.name}${resultData.emoji}! ${resultData.description} ToolHub.tools에서 테스트해보세요!`;
      const url = 'https://toolhub.tools/tools/teto-egen';
      
      if (navigator.share) {
        navigator.share({
          title: '테토-에겐 테스트 결과',
          text: text,
          url: url
        });
      } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        alert('결과가 클립보드에 복사되었습니다!');
      }
    }
  };

  // 성별 선택 화면
  if (step === 'gender') {
    return (
      <>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              테토-에겐 성격 테스트
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              성별을 선택해주세요
            </p>
          </div>
        </div>
      </>
    );
  }

  // 결과 화면
  if (step === 'result' && result) {
    const resultData = resultTypes[result];
    
    return (
      <>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              테토-에겐 테스트 결과
            </h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                친구들은 어떤 유형일까요?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                친구들과 함께 테스트하고 서로의 성향을 알아보세요. 
                궁합도 확인할 수 있어서 더욱 재미있답니다!
              </p>
              <button
                onClick={() => shareResult()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                친구들에게 공유하기
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 테스트 진행 화면
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            테토-에겐 성격 테스트
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            질문에 답해주세요
          </p>
        </div>
      </div>
    </>
  );
}