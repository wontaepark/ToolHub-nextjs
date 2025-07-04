import { Link } from "wouter";
import { useTranslation } from "react-i18next";

interface Tool {
  path: string;
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
  icon: string;
  color: string;
}

interface RelatedToolsProps {
  currentTool: string;
  category?: 'productivity' | 'utility' | 'multimedia' | 'fun' | 'all';
  maxItems?: number;
}

export default function RelatedTools({ currentTool, category = 'all', maxItems = 4 }: RelatedToolsProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'ko' | 'en' | 'ja';

  const allTools: Tool[] = [
    {
      path: '/pomodoro',
      name: {
        ko: '포모도로 타이머',
        en: 'Pomodoro Timer',
        ja: 'ポモドーロタイマー'
      },
      description: {
        ko: '25분 집중 + 5분 휴식의 생산성 향상 도구',
        en: '25min focus + 5min break productivity tool',
        ja: '25分集中+5分休憩の生産性向上ツール'
      },
      icon: 'ri-timer-line',
      color: 'red'
    },
    {
      path: '/timer',
      name: {
        ko: '범용 타이머',
        en: 'General Timer',
        ja: '汎用タイマー'
      },
      description: {
        ko: '요리, 운동, 공부 등 다양한 용도의 타이머',
        en: 'Timer for cooking, exercise, study and more',
        ja: '料理、運動、勉強など多様な用途のタイマー'
      },
      icon: 'ri-time-line',
      color: 'blue'
    },
    {
      path: '/raffle',
      name: {
        ko: '번호 추첨기',
        en: 'Number Raffle',
        ja: '番号抽選機'
      },
      description: {
        ko: '공정한 랜덤 번호 생성 및 추첨 도구',
        en: 'Fair random number generation and raffle tool',
        ja: '公正なランダム番号生成・抽選ツール'
      },
      icon: 'ri-shuffle-line',
      color: 'purple'
    },
    {
      path: '/thumbnail',
      name: {
        ko: '유튜브 썸네일 다운로더',
        en: 'YouTube Thumbnail Downloader',
        ja: 'YouTubeサムネイルダウンローダー'
      },
      description: {
        ko: '유튜브 비디오 썸네일을 고화질로 다운로드',
        en: 'Download YouTube video thumbnails in high quality',
        ja: 'YouTube動画サムネイルを高画質でダウンロード'
      },
      icon: 'ri-download-line',
      color: 'red'
    },
    {
      path: '/password',
      name: {
        ko: '비밀번호 생성기',
        en: 'Password Generator',
        ja: 'パスワード生成器'
      },
      description: {
        ko: '안전하고 강력한 비밀번호 생성 도구',
        en: 'Generate secure and strong passwords',
        ja: '安全で強力なパスワード生成ツール'
      },
      icon: 'ri-lock-line',
      color: 'green'
    },
    {
      path: '/converter',
      name: {
        ko: '단위 변환기',
        en: 'Unit Converter',
        ja: '単位変換器'
      },
      description: {
        ko: '길이, 무게, 온도 등 다양한 단위 변환',
        en: 'Convert length, weight, temperature and more',
        ja: '長さ、重さ、温度など様々な単位変換'
      },
      icon: 'ri-exchange-line',
      color: 'blue'
    },
    {
      path: '/date-calculator',
      name: {
        ko: '날짜 계산기',
        en: 'Date Calculator',
        ja: '日付計算機'
      },
      description: {
        ko: '날짜 간 차이 계산 및 날짜 연산',
        en: 'Calculate date differences and perform date operations',
        ja: '日付間の差計算・日付演算'
      },
      icon: 'ri-calendar-line',
      color: 'green'
    },
    {
      path: '/mbti',
      name: {
        ko: 'MBTI 성격유형 테스트',
        en: 'MBTI Personality Test',
        ja: 'MBTI性格タイプテスト'
      },
      description: {
        ko: '16가지 성격유형 중 당신의 유형을 찾아보세요',
        en: 'Discover your personality type among 16 types',
        ja: '16の性格タイプからあなたのタイプを見つけよう'
      },
      icon: 'ri-user-heart-line',
      color: 'purple'
    },
    {
      path: '/teto-egen-test',
      name: {
        ko: '테토-에겐 성격유형 테스트',
        en: 'Teto-Egen Personality Test',
        ja: 'テト-エゲン性格タイプテスト'
      },
      description: {
        ko: '화제의 테토-에겐 성격유형으로 나를 알아보자',
        en: 'Discover yourself through the trending Teto-Egen test',
        ja: '話題のテト-エゲン性格タイプで自分を知ろう'
      },
      icon: 'ri-emotion-happy-line',
      color: 'pink'
    }
  ];

  // 현재 도구를 제외한 관련 도구들을 필터링
  const relatedTools = allTools
    .filter(tool => tool.path !== currentTool)
    .slice(0, maxItems);

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: 'border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-950/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-950/30',
      blue: 'border-blue-200 dark:border-blue-800/30 bg-blue-50 dark:bg-blue-950/20 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-950/30',
      green: 'border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-950/20 text-green-600 hover:bg-green-100 dark:hover:bg-green-950/30',
      purple: 'border-purple-200 dark:border-purple-800/30 bg-purple-50 dark:bg-purple-950/20 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-950/30',
      pink: 'border-pink-200 dark:border-pink-800/30 bg-pink-50 dark:bg-pink-950/20 text-pink-600 hover:bg-pink-100 dark:hover:bg-pink-950/30'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="mt-8 p-6 bg-muted/30 rounded-xl border">
      <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
        <i className="ri-link text-muted-foreground"></i>
        {currentLang === 'ko' ? '다른 유용한 도구들' :
         currentLang === 'ja' ? '他の便利なツール' :
         'Other Useful Tools'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedTools.map((tool) => (
          <Link key={tool.path} href={tool.path}>
            <div className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${getColorClasses(tool.color)}`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <i className={`${tool.icon} text-xl`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1 truncate">
                    {tool.name[currentLang]}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tool.description[currentLang]}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <i className="ri-arrow-right-s-line text-muted-foreground"></i>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Link href="/sitemap">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {currentLang === 'ko' ? '전체 도구 보기 →' :
             currentLang === 'ja' ? '全てのツールを見る →' :
             'View All Tools →'}
          </button>
        </Link>
      </div>
    </div>
  );
}