import { Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-4 md:py-6">
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
