import { Link, useLocation } from "wouter";
import { useTranslation } from 'react-i18next';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export default function Breadcrumb() {
  const [location] = useLocation();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'ko' | 'en' | 'ja';

  const pathNames: Record<string, { ko: string; en: string; ja: string }> = {
    '/': { ko: '홈', en: 'Home', ja: 'ホーム' },
    '/pomodoro': { ko: '포모도로 타이머', en: 'Pomodoro Timer', ja: 'ポモドーロタイマー' },
    '/timer': { ko: '범용 타이머', en: 'General Timer', ja: '汎用タイマー' },
    '/raffle': { ko: '번호 추첨기', en: 'Number Raffle', ja: '番号抽選機' },
    '/thumbnail': { ko: '유튜브 썸네일 다운로더', en: 'YouTube Thumbnail Downloader', ja: 'YouTubeサムネイルダウンローダー' },
    '/password': { ko: '비밀번호 생성기', en: 'Password Generator', ja: 'パスワード生成器' },
    '/converter': { ko: '단위 변환기', en: 'Unit Converter', ja: '単位変換器' },
    '/date-calculator': { ko: '날짜 계산기', en: 'Date Calculator', ja: '日付計算機' },
    '/mbti': { ko: 'MBTI 성격유형 테스트', en: 'MBTI Personality Test', ja: 'MBTI性格タイプテスト' },
    '/teto-egen-test': { ko: '테토-에겐 성격유형 테스트', en: 'Teto-Egen Personality Test', ja: 'テト-エゲン性格タイプテスト' },
    '/sitemap': { ko: '사이트맵', en: 'Sitemap', ja: 'サイトマップ' },
    '/contact': { ko: '문의하기', en: 'Contact', ja: 'お問い合わせ' },
    '/privacy': { ko: '개인정보처리방침', en: 'Privacy Policy', ja: 'プライバシーポリシー' },
    '/terms': { ko: '이용약관', en: 'Terms of Service', ja: '利用規約' }
  };

  // 홈페이지인 경우 빵부스러기를 표시하지 않음
  if (location === '/') {
    return null;
  }

  const currentPageName = pathNames[location];
  if (!currentPageName) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-foreground transition-colors">
        <div className="flex items-center gap-1">
          <i className="ri-home-line text-sm"></i>
          <span>{pathNames['/'][currentLang]}</span>
        </div>
      </Link>
      <i className="ri-arrow-right-s-line text-xs"></i>
      <span className="text-foreground font-medium">
        {currentPageName[currentLang]}
      </span>
    </nav>
  );
}