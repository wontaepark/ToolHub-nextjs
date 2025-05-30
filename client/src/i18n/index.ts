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
          "title": "썸네일 다운로더",
          "description": "YouTube 동영상의 고화질 썸네일 이미지를 간편하게 다운로드하세요. 다양한 해상도 옵션을 제공합니다."
        }
      },
      "thumbnailDownloader": {
        "urlInput": "YouTube URL 입력",
        "urlPlaceholder": "https://www.youtube.com/watch?v=...",
        "urlDescription": "YouTube 동영상 URL을 붙여넣으세요 (youtube.com, youtu.be, 또는 shorts)",
        "getThumbnails": "썸네일 가져오기",
        "videoId": "동영상 ID",
        "qualities": {
          "maxres": "최대 해상도",
          "hq": "고화질",
          "mq": "중간 화질",
          "sd": "표준",
          "default": "기본"
        },
        "pixels": "픽셀",
        "thumbnailNotAvailable": "이 화질의 썸네일을 사용할 수 없습니다",
        "loadedSuccess": "썸네일을 성공적으로 불러왔습니다! 원하는 해상도의 다운로드 버튼을 클릭하세요.",
        "howToUse": "사용 방법",
        "instructions": [
          "브라우저에서 YouTube 동영상 URL을 복사하세요",
          "위의 입력 필드에 붙여넣으세요",
          "'썸네일 가져오기'를 클릭하여 모든 해상도를 불러오세요",
          "원하는 화질을 선택하고 '다운로드'를 클릭하세요",
          "youtube.com, youtu.be, YouTube Shorts URL을 지원합니다"
        ],
        "errors": {
          "enterUrl": "YouTube URL을 입력해주세요",
          "invalidUrl": "유효하지 않은 YouTube URL입니다. 올바른 YouTube 동영상 URL을 입력해주세요.",
          "processingFailed": "URL 처리에 실패했습니다. 다시 시도해주세요.",
          "downloadFailed": "썸네일 다운로드에 실패했습니다. 다시 시도해주세요."
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
          "title": "Thumbnail Downloader",
          "description": "Easily download high-quality thumbnail images from YouTube videos. Provides various resolution options."
        }
      },
      "thumbnailDownloader": {
        "urlInput": "Enter YouTube URL",
        "urlPlaceholder": "https://www.youtube.com/watch?v=...",
        "urlDescription": "Paste any YouTube video URL (youtube.com, youtu.be, or shorts)",
        "getThumbnails": "Get Thumbnails",
        "videoId": "Video ID",
        "qualities": {
          "maxres": "Maximum Resolution",
          "hq": "High Quality",
          "mq": "Medium Quality",
          "sd": "Standard",
          "default": "Default"
        },
        "pixels": "pixels",
        "thumbnailNotAvailable": "Thumbnail not available in this quality",
        "loadedSuccess": "Thumbnails loaded successfully! Click the download button for any resolution you need.",
        "howToUse": "How to Use",
        "instructions": [
          "Copy any YouTube video URL from your browser",
          "Paste it in the input field above",
          "Click 'Get Thumbnails' to load all available resolutions",
          "Choose your preferred quality and click 'Download'",
          "Supports youtube.com, youtu.be, and YouTube Shorts URLs"
        ],
        "errors": {
          "enterUrl": "Please enter a YouTube URL",
          "invalidUrl": "Invalid YouTube URL. Please enter a valid YouTube video URL.",
          "processingFailed": "Failed to process the URL. Please try again.",
          "downloadFailed": "Failed to download thumbnail. Please try again."
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
          "title": "サムネイルダウンローダー",
          "description": "YouTube動画の高画質サムネイル画像を簡単にダウンロードできます。様々な解像度オプションを提供します。"
        }
      },
      "thumbnailDownloader": {
        "urlInput": "YouTube URL入力",
        "urlPlaceholder": "https://www.youtube.com/watch?v=...",
        "urlDescription": "YouTube動画URLを貼り付けてください（youtube.com、youtu.be、またはshorts）",
        "getThumbnails": "サムネイル取得",
        "videoId": "動画ID",
        "qualities": {
          "maxres": "最大解像度",
          "hq": "高画質",
          "mq": "中画質",
          "sd": "標準",
          "default": "デフォルト"
        },
        "pixels": "ピクセル",
        "thumbnailNotAvailable": "この画質のサムネイルは利用できません",
        "loadedSuccess": "サムネイルの読み込みが完了しました！必要な解像度のダウンロードボタンをクリックしてください。",
        "howToUse": "使用方法",
        "instructions": [
          "ブラウザからYouTube動画URLをコピーしてください",
          "上の入力フィールドに貼り付けてください",
          "'サムネイル取得'をクリックして全ての解像度を読み込んでください",
          "お好みの画質を選択して'ダウンロード'をクリックしてください",
          "youtube.com、youtu.be、YouTube Shorts URLに対応しています"
        ],
        "errors": {
          "enterUrl": "YouTube URLを入力してください",
          "invalidUrl": "無効なYouTube URLです。有効なYouTube動画URLを入力してください。",
          "processingFailed": "URLの処理に失敗しました。再度お試しください。",
          "downloadFailed": "サムネイルのダウンロードに失敗しました。再度お試しください。"
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