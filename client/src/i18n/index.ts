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
        "newTools": "새로운 도구들이 지속적으로 추가되고 있습니다",
        "available": "사용 가능",
        "comingSoon": "출시 예정"
      },
      "nav": {
        "calculator": "계산기",
        "pomodoro": "포모도로 타이머",
        "timer": "범용 타이머",
        "raffle": "번호 추첨기",
        "thumbnail": "썸네일 다운로더"
      },
      "home": {
        "title": "도구 허브",
        "subtitle": "일상에 유용한 도구들을 한 곳에서",
        "description": "다양한 유틸리티 도구들을 간편하게 사용하세요. 계산기, 타이머, 추첨기 등 실용적인 기능들을 제공합니다.",
        "openTool": "도구 열기",
        "comingSoonTitle": "출시 예정 도구",
        "comingSoonDesc": "더 많은 도구들이 개발 중입니다",
        "unitConverter": "단위 변환기",
        "unitConverterDesc": "길이, 무게, 온도 등 다양한 단위 변환",
        "passwordGen": "비밀번호 생성기", 
        "passwordGenDesc": "안전한 비밀번호 자동 생성",
        "qrGenerator": "QR 코드 생성기",
        "qrGeneratorDesc": "텍스트를 QR 코드로 변환",
        "weather": "날씨 정보",
        "weatherDesc": "실시간 날씨 및 예보 정보"
      },
      "calculator": {
        "title": "계산기",
        "clear": "지우기",
        "clearEntry": "입력 지우기",
        "backspace": "백스페이스",
        "negate": "부호 변경",
        "divide": "나누기",
        "multiply": "곱하기", 
        "subtract": "빼기",
        "add": "더하기",
        "equals": "계산",
        "decimal": "소수점",
        "history": "기록",
        "clearHistory": "기록 지우기",
        "keyboardShortcuts": "키보드 단축키",
        "useResult": "결과 사용"
      },
      "thumbnail": {
        "title": "YouTube 썸네일 다운로더",
        "description": "YouTube 동영상의 썸네일을 다양한 해상도로 다운로드하세요",
        "urlPlaceholder": "YouTube URL을 입력하세요",
        "getImages": "이미지 가져오기",
        "downloadAll": "모든 이미지 다운로드",
        "noImages": "썸네일을 찾을 수 없습니다",
        "invalidUrl": "유효하지 않은 YouTube URL입니다",
        "loading": "로딩 중...",
        "download": "다운로드"
      },
      "timer": {
        "title": "범용 타이머",
        "setTimer": "타이머 설정",
        "start": "시작",
        "pause": "일시정지",
        "reset": "초기화",
        "finished": "완료!",
        "presets": "프리셋",
        "cooking": "요리",
        "exercise": "운동",
        "study": "공부",
        "break": "휴식"
      },
      "raffle": {
        "title": "번호 추첨기",
        "numberRange": "번 중 추첨",
        "settings": "설정",
        "maxNumber": "최대 번호",
        "drawCount": "추첨 개수",
        "soundEffect": "효과음",
        "volumeControl": "볼륨 조절",
        "reset": "초기화",
        "drawNumbers": "번호 추첨",
        "winningNumbers": "당첨 번호",
        "drawHistory": "추첨 기록",
        "remaining": "남은 번호",
        "drawn": "추첨된 번호",
        "drawCounts": {
          "one": "1개",
          "two": "2개", 
          "three": "3개"
        },
        "soundStatus": {
          "on": "🔊 ON",
          "off": "🔇 OFF"
        }
      },
      "pomodoro": {
        "title": "포모도로 타이머",
        "work": "작업",
        "shortBreak": "짧은 휴식",
        "longBreak": "긴 휴식",
        "idle": "대기 중",
        "start": "시작",
        "pause": "일시정지",
        "stop": "정지",
        "skip": "건너뛰기",
        "settings": "설정",
        "tasks": "할일 목록",
        "addTask": "할일 추가",
        "taskPlaceholder": "할일 내용을 입력하세요...",
        "currentTask": "현재 작업",
        "completedPomodoros": "완료된 포모도로",
        "todaysProgress": "오늘의 진행상황",
        "cycle": "사이클",
        "sessionComplete": "세션 완료!",
        "timeToBreak": "휴식 시간입니다!",
        "backToWork": "다시 작업을 시작하세요!",
        "workTime": "작업 시간 (분)",
        "shortBreakTime": "짧은 휴식 (분)",
        "longBreakTime": "긴 휴식 (분)",
        "autoStart": "다음 세션 자동 시작",
        "soundEnabled": "알림음 활성화",
        "taskBasedTiming": "작업 기반 타이밍"
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
        "comingSoon": "Coming Soon"
      },
      "nav": {
        "calculator": "Calculator",
        "pomodoro": "Pomodoro Timer",
        "timer": "Universal Timer",
        "raffle": "Number Raffle",
        "thumbnail": "Thumbnail Downloader"
      },
      "home": {
        "title": "Tool Hub",
        "subtitle": "Useful tools for everyday life in one place",
        "description": "Use various utility tools conveniently. We provide practical features like calculator, timer, raffle, and more.",
        "openTool": "Open Tool",
        "comingSoonTitle": "Coming Soon Tools",
        "comingSoonDesc": "More tools are in development",
        "unitConverter": "Unit Converter",
        "unitConverterDesc": "Convert various units like length, weight, temperature",
        "passwordGen": "Password Generator",
        "passwordGenDesc": "Generate secure passwords automatically",
        "qrGenerator": "QR Code Generator", 
        "qrGeneratorDesc": "Convert text to QR codes",
        "weather": "Weather Info",
        "weatherDesc": "Real-time weather and forecast information"
      },
      "calculator": {
        "title": "Calculator",
        "clear": "Clear",
        "clearEntry": "Clear Entry",
        "backspace": "Backspace",
        "negate": "Negate",
        "divide": "Divide",
        "multiply": "Multiply",
        "subtract": "Subtract", 
        "add": "Add",
        "equals": "Equals",
        "decimal": "Decimal",
        "history": "History",
        "clearHistory": "Clear History",
        "keyboardShortcuts": "Keyboard Shortcuts",
        "useResult": "Use Result"
      },
      "thumbnail": {
        "title": "YouTube Thumbnail Downloader",
        "description": "Download YouTube video thumbnails in various resolutions",
        "urlPlaceholder": "Enter YouTube URL",
        "getImages": "Get Images",
        "downloadAll": "Download All Images",
        "noImages": "No thumbnails found",
        "invalidUrl": "Invalid YouTube URL",
        "loading": "Loading...",
        "download": "Download"
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
        "numberRange": " numbers to draw from",
        "settings": "Settings",
        "maxNumber": "Max Number",
        "drawCount": "Draw Count",
        "soundEffect": "Sound Effect",
        "volumeControl": "Volume Control",
        "reset": "Reset",
        "drawNumbers": "Draw Numbers",
        "winningNumbers": "Winning Numbers",
        "drawHistory": "Draw History",
        "remaining": "Remaining",
        "drawn": "Drawn",
        "drawCounts": {
          "one": "1 number",
          "two": "2 numbers",
          "three": "3 numbers"
        },
        "soundStatus": {
          "on": "🔊 ON",
          "off": "🔇 OFF"
        }
      },
      "pomodoro": {
        "title": "Pomodoro Timer",
        "work": "Work",
        "shortBreak": "Short Break",
        "longBreak": "Long Break",
        "idle": "Ready",
        "start": "Start",
        "pause": "Pause",
        "stop": "Stop",
        "skip": "Skip",
        "settings": "Settings",
        "tasks": "Tasks",
        "addTask": "Add Task",
        "taskPlaceholder": "Enter task description...",
        "currentTask": "Current Task",
        "completedPomodoros": "Completed Pomodoros",
        "todaysProgress": "Today's Progress",
        "cycle": "Cycle",
        "sessionComplete": "Session Complete!",
        "timeToBreak": "Time for a break!",
        "backToWork": "Back to work!",
        "workTime": "Work Time (minutes)",
        "shortBreakTime": "Short Break (minutes)",
        "longBreakTime": "Long Break (minutes)",
        "autoStart": "Auto-start next session",
        "soundEnabled": "Sound notifications",
        "taskBasedTiming": "Task-based timing"
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
        "comingSoon": "近日公開"
      },
      "nav": {
        "calculator": "電卓",
        "pomodoro": "ポモドーロタイマー",
        "timer": "汎用タイマー",
        "raffle": "番号抽選機",
        "thumbnail": "サムネイルダウンローダー"
      },
      "home": {
        "title": "ツールハブ",
        "subtitle": "日常に役立つツールを一箇所で",
        "description": "様々なユーティリティツールを便利に使用できます。電卓、タイマー、抽選機など実用的な機能を提供します。",
        "openTool": "ツールを開く",
        "comingSoonTitle": "近日公開ツール",
        "comingSoonDesc": "より多くのツールが開発中です",
        "unitConverter": "単位変換器",
        "unitConverterDesc": "長さ、重量、温度など様々な単位変換",
        "passwordGen": "パスワード生成器",
        "passwordGenDesc": "安全なパスワードを自動生成",
        "qrGenerator": "QRコード生成器",
        "qrGeneratorDesc": "テキストをQRコードに変換",
        "weather": "天気情報",
        "weatherDesc": "リアルタイム天気と予報情報"
      },
      "calculator": {
        "title": "電卓",
        "clear": "クリア",
        "clearEntry": "エントリクリア",
        "backspace": "バックスペース",
        "negate": "符号変更",
        "divide": "割り算",
        "multiply": "掛け算",
        "subtract": "引き算",
        "add": "足し算",
        "equals": "計算",
        "decimal": "小数点",
        "history": "履歴",
        "clearHistory": "履歴クリア",
        "keyboardShortcuts": "キーボードショートカット",
        "useResult": "結果を使用"
      },
      "thumbnail": {
        "title": "YouTube サムネイルダウンローダー",
        "description": "YouTube動画のサムネイルを様々な解像度でダウンロード",
        "urlPlaceholder": "YouTube URLを入力",
        "getImages": "画像を取得",
        "downloadAll": "全画像ダウンロード",
        "noImages": "サムネイルが見つかりません",
        "invalidUrl": "無効なYouTube URL",
        "loading": "読み込み中...",
        "download": "ダウンロード"
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
        "numberRange": "番の中から抽選",
        "settings": "設定",
        "maxNumber": "最大番号",
        "drawCount": "抽選数",
        "soundEffect": "効果音",
        "volumeControl": "音量調節",
        "reset": "リセット",
        "drawNumbers": "番号抽選",
        "winningNumbers": "当選番号",
        "drawHistory": "抽選履歴",
        "remaining": "残り番号",
        "drawn": "抽選済み番号",
        "drawCounts": {
          "one": "1個",
          "two": "2個",
          "three": "3個"
        },
        "soundStatus": {
          "on": "🔊 ON",
          "off": "🔇 OFF"
        }
      },
      "pomodoro": {
        "title": "ポモドーロタイマー",
        "work": "作業",
        "shortBreak": "短い休憩",
        "longBreak": "長い休憩",
        "idle": "待機中",
        "start": "開始",
        "pause": "一時停止",
        "stop": "停止",
        "skip": "スキップ",
        "settings": "設定",
        "tasks": "タスク",
        "addTask": "タスク追加",
        "taskPlaceholder": "タスクの説明を入力...",
        "currentTask": "現在のタスク",
        "completedPomodoros": "完了したポモドーロ",
        "todaysProgress": "今日の進捗",
        "cycle": "サイクル",
        "sessionComplete": "セッション完了！",
        "timeToBreak": "休憩時間です！",
        "backToWork": "作業に戻りましょう！",
        "workTime": "作業時間（分）",
        "shortBreakTime": "短い休憩（分）",
        "longBreakTime": "長い休憩（分）",
        "autoStart": "次のセッションを自動開始",
        "soundEnabled": "音声通知",
        "taskBasedTiming": "タスク基準タイミング"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;