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
          "title": "계산기",
          "description": "기본 사칙연산과 고급 기능을 지원하는 계산기입니다. 키보드 입력도 지원합니다."
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
      },
      "calculator": {
        "title": "계산기",
        "clear": "지우기",
        "clearEntry": "CE",
        "backspace": "뒤로",
        "equals": "계산",
        "history": "히스토리",
        "clearHistory": "히스토리 지우기",
        "keyboardShortcuts": "키보드 단축키",
        "shortcuts": {
          "numbers": "숫자 입력: 0-9",
          "operators": "연산자: +, -, *, /",
          "equals": "계산: Enter 또는 =",
          "clear": "지우기: Escape",
          "backspace": "뒤로: Backspace"
        }
      },
      "pomodoro": {
        "title": "포모도로 타이머",
        "work": "작업",
        "shortBreak": "짧은 휴식",
        "longBreak": "긴 휴식",
        "start": "시작",
        "pause": "일시정지",
        "reset": "리셋",
        "skip": "건너뛰기",
        "settings": "설정",
        "tasks": "할 일",
        "addTask": "할 일 추가",
        "taskPlaceholder": "할 일을 입력하세요...",
        "completedTasks": "완료된 작업",
        "session": "세션",
        "minutes": "분",
        "seconds": "초"
      },
      "timer": {
        "title": "범용 타이머",
        "setTimer": "타이머 설정",
        "start": "시작",
        "pause": "일시정지",
        "reset": "리셋",
        "finished": "완료!",
        "presets": "프리셋",
        "cooking": "요리",
        "exercise": "운동",
        "study": "공부",
        "break": "휴식"
      },
      "raffle": {
        "title": "번호 추첨기",
        "minNumber": "최소 번호",
        "maxNumber": "최대 번호",
        "drawCount": "추첨 개수",
        "excludeDuplicates": "중복 제거",
        "drawNumbers": "번호 추첨",
        "reset": "리셋",
        "winningNumbers": "당첨 번호",
        "volume": "볼륨",
        "soundEnabled": "사운드 활성화"
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
          "title": "Calculator",
          "description": "A complete calculator supporting everything from basic arithmetic to advanced calculations. Provides keyboard shortcuts and calculation history features."
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
      },
      "calculator": {
        "title": "Calculator",
        "clear": "Clear",
        "clearEntry": "CE",
        "backspace": "Back",
        "equals": "Calculate",
        "history": "History",
        "clearHistory": "Clear History",
        "keyboardShortcuts": "Keyboard Shortcuts",
        "shortcuts": {
          "numbers": "Number input: 0-9",
          "operators": "Operators: +, -, *, /",
          "equals": "Calculate: Enter or =",
          "clear": "Clear: Escape",
          "backspace": "Back: Backspace"
        }
      },
      "pomodoro": {
        "title": "Pomodoro Timer",
        "work": "Work",
        "shortBreak": "Short Break",
        "longBreak": "Long Break",
        "start": "Start",
        "pause": "Pause",
        "reset": "Reset",
        "skip": "Skip",
        "settings": "Settings",
        "tasks": "Tasks",
        "addTask": "Add Task",
        "taskPlaceholder": "Enter a task...",
        "completedTasks": "Completed Tasks",
        "session": "Session",
        "minutes": "minutes",
        "seconds": "seconds"
      },
      "timer": {
        "title": "Universal Timer",
        "setTimer": "Set Timer",
        "start": "Start",
        "pause": "Pause",
        "reset": "Reset",
        "finished": "Finished!",
        "presets": "Presets",
        "cooking": "Cooking",
        "exercise": "Exercise",
        "study": "Study",
        "break": "Break"
      },
      "raffle": {
        "title": "Number Raffle",
        "minNumber": "Min Number",
        "maxNumber": "Max Number",
        "drawCount": "Draw Count",
        "excludeDuplicates": "Exclude Duplicates",
        "drawNumbers": "Draw Numbers",
        "reset": "Reset",
        "winningNumbers": "Winning Numbers",
        "volume": "Volume",
        "soundEnabled": "Sound Enabled"
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
      },
      "calculator": {
        "title": "計算機",
        "clear": "クリア",
        "clearEntry": "CE",
        "backspace": "戻る",
        "equals": "計算",
        "history": "履歴",
        "clearHistory": "履歴をクリア",
        "keyboardShortcuts": "キーボードショートカット",
        "shortcuts": {
          "numbers": "数字入力: 0-9",
          "operators": "演算子: +, -, *, /",
          "equals": "計算: Enter または =",
          "clear": "クリア: Escape",
          "backspace": "戻る: Backspace"
        }
      },
      "pomodoro": {
        "title": "ポモドーロタイマー",
        "work": "作業",
        "shortBreak": "短い休憩",
        "longBreak": "長い休憩",
        "start": "開始",
        "pause": "一時停止",
        "reset": "リセット",
        "skip": "スキップ",
        "settings": "設定",
        "tasks": "タスク",
        "addTask": "タスク追加",
        "taskPlaceholder": "タスクを入力...",
        "completedTasks": "完了したタスク",
        "session": "セッション",
        "minutes": "分",
        "seconds": "秒"
      },
      "timer": {
        "title": "汎用タイマー",
        "setTimer": "タイマー設定",
        "start": "開始",
        "pause": "一時停止",
        "reset": "リセット",
        "finished": "完了！",
        "presets": "プリセット",
        "cooking": "料理",
        "exercise": "運動",
        "study": "勉強",
        "break": "休憩"
      },
      "raffle": {
        "title": "番号抽選機",
        "minNumber": "最小番号",
        "maxNumber": "最大番号",
        "drawCount": "抽選数",
        "excludeDuplicates": "重複除去",
        "drawNumbers": "番号抽選",
        "reset": "リセット",
        "winningNumbers": "当選番号",
        "volume": "音量",
        "soundEnabled": "サウンド有効"
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