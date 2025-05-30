import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ko: {
    translation: {
      "common": {
        "home": "홈",
        "tools": "도구",
        "github": "GitHub",
        "newTools": "새로운 도구들이 계속 추가됩니다",
        "available": "사용 가능",
        "new": "새로운",
        "download": "다운로드",
        "processing": "처리 중..."
      },
      "header": {
        "title": "ToolHub.tools",
        "lightMode": "라이트 모드로 전환",
        "darkMode": "다크 모드로 전환"
      },
      "home": {
        "title": "ToolHub.tools",
        "subtitle": "일상을 더 편리하게 만드는 도구 모음",
        "description": "계산기부터 포모도로 타이머까지, 생산성을 높이고 일상을 편리하게 만드는 다양한 웹 도구들을 한 곳에서 만나보세요.",
        "availableTools": "사용 가능한 도구들"
      },
      "tools": {
        "calculator": {
          "title": "계산기"
        },
        "pomodoro": {
          "title": "포모도로 타이머"
        },
        "timer": {
          "title": "범용 타이머"
        },
        "raffle": {
          "title": "번호 추첨기"
        },
        "thumbnail": {
          "title": "썸네일 다운로더"
        }
      }
    }
  },
  en: {
    translation: {
      "common": {
        "home": "Home",
        "tools": "Tools",
        "github": "GitHub",
        "newTools": "New tools are continuously being added",
        "available": "Available",
        "new": "New",
        "download": "Download",
        "processing": "Processing..."
      },
      "header": {
        "title": "ToolHub.tools",
        "lightMode": "Switch to light mode",
        "darkMode": "Switch to dark mode"
      },
      "home": {
        "title": "ToolHub.tools",
        "subtitle": "A collection of tools to make your daily life more convenient",
        "description": "From calculators to pomodoro timers, discover various web tools that enhance productivity and convenience.",
        "availableTools": "Available Tools"
      },
      "tools": {
        "calculator": {
          "title": "Calculator"
        },
        "pomodoro": {
          "title": "Pomodoro Timer"
        },
        "timer": {
          "title": "Universal Timer"
        },
        "raffle": {
          "title": "Number Raffle"
        },
        "thumbnail": {
          "title": "Thumbnail Downloader"
        }
      }
    }
  },
  ja: {
    translation: {
      "common": {
        "home": "ホーム",
        "tools": "ツール",
        "github": "GitHub",
        "newTools": "新しいツールが継続的に追加されています",
        "available": "利用可能",
        "new": "新規",
        "download": "ダウンロード",
        "processing": "処理中..."
      },
      "header": {
        "title": "ToolHub.tools",
        "lightMode": "ライトモードに切り替え",
        "darkMode": "ダークモードに切り替え"
      },
      "home": {
        "title": "ToolHub.tools",
        "subtitle": "日常をより便利にするツールコレクション",
        "description": "計算機からポモドーロタイマーまで、生産性を向上させる様々なWebツールを一箇所で見つけてください。",
        "availableTools": "利用可能なツール"
      },
      "tools": {
        "calculator": {
          "title": "計算機"
        },
        "pomodoro": {
          "title": "ポモドーロタイマー"
        },
        "timer": {
          "title": "汎用タイマー"
        },
        "raffle": {
          "title": "番号抽選機"
        },
        "thumbnail": {
          "title": "サムネイルダウンローダー"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;