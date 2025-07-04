import { Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Popular Tools Links Section */}
        <div className="mb-6 pb-6 border-b border-border">
          <h3 className="text-sm font-semibold mb-3 text-foreground">
            {t('footer.popularTools', '인기 도구')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Link href="/pomodoro">
              <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer block py-1">
                {t('tools.pomodoro', '포모도로 타이머')}
              </span>
            </Link>
            <Link href="/raffle">
              <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer block py-1">
                {t('tools.raffle', '번호 추첨기')}
              </span>
            </Link>
            <Link href="/password">
              <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer block py-1">
                {t('tools.password', 'Password Generator')}
              </span>
            </Link>
            <Link href="/converter">
              <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer block py-1">
                {t('tools.converter', '단위 변환기')}
              </span>
            </Link>
            <Link href="/thumbnail">
              <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer block py-1">
                {t('tools.thumbnail', '썸네일 다운로더')}
              </span>
            </Link>
            <Link href="/mbti">
              <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer block py-1">
                {t('tools.mbti', 'MBTI 테스트')}
              </span>
            </Link>
            <Link href="/timer">
              <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer block py-1">
                {t('tools.timer', '범용 타이머')}
              </span>
            </Link>
            <Link href="/date-calculator">
              <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer block py-1">
                {t('tools.dateCalculator', '날짜 계산기')}
              </span>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm text-muted-foreground">
              © {new Date().getFullYear()} Toolhub.tools. {t('footer.allRightsReserved')}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 mt-2">
              <Link href="/privacy">
                <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  {t('privacy.title')}
                </span>
              </Link>
              <span className="text-xs text-muted-foreground">•</span>
              <Link href="/terms">
                <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  {t('terms.title')}
                </span>
              </Link>
              <span className="text-xs text-muted-foreground">•</span>
              <Link href="/contact">
                <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  {t('contact.title')}
                </span>
              </Link>
              <span className="text-xs text-muted-foreground">•</span>
              <Link href="/sitemap">
                <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  {t('sitemap.title', '사이트맵')}
                </span>
              </Link>
            </div>
          </div>
          <div className="flex space-x-4 md:space-x-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-lg"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4 md:h-5 md:w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-lg"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4 md:h-5 md:w-5" />
            </a>
            <Link href="/contact">
              <span className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-lg cursor-pointer inline-block">
                <Mail className="h-4 w-4 md:h-5 md:w-5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
