import { useState } from 'react';
import { Link, useLocation } from "wouter";
import { useTheme } from "../ThemeProvider";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LanguageSelector from "../LanguageSelector";
import SearchBox from "../SearchBox";
import { Sun, Moon, Menu, Github, Search } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [location] = useLocation();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <i className="ri-tools-fill text-white text-lg md:text-xl"></i>
              </div>
              <h1 className="text-lg md:text-xl font-bold">ToolHub<span className="text-primary">.tools</span></h1>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="hidden md:flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors"
            >
              <i className="ri-home-line text-lg"></i>
              <span>{t('common.home')}</span>
            </Button>
          </Link>
          
          <Link href="/sitemap">
            <Button 
              variant="ghost" 
              className="hidden md:flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors"
            >
              <i className="ri-sitemap-line text-lg"></i>
              <span>{t('common.sitemap')}</span>
            </Button>
          </Link>
          
          <Link href="/contact">
            <Button 
              variant="ghost" 
              className="hidden md:flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors"
            >
              <i className="ri-mail-line text-lg"></i>
              <span>{t('common.contact')}</span>
            </Button>
          </Link>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors"
          >
            <Github className="h-4 w-4 md:h-5 md:w-5" />
            <span>{t('common.github')}</span>
          </a>
          
          {/* Search Button */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                aria-label={t('common.search', '검색')}
                className="flex items-center justify-center border border-border hover:bg-accent h-9 w-9 md:h-10 md:w-10"
              >
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full mx-4" aria-describedby="search-description">
              <DialogHeader>
                <DialogTitle>{t('search.title', '도구 검색')}</DialogTitle>
                <div id="search-description" className="sr-only">
                  {t('search.description', '도구를 검색하고 카테고리별로 찾아보세요')}
                </div>
              </DialogHeader>
              <SearchBox 
                onClose={() => setIsSearchOpen(false)}
                autoFocus={true}
                showCategories={true}
              />
            </DialogContent>
          </Dialog>

          <LanguageSelector />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            aria-label={theme === 'light' ? t('header.darkMode') : t('header.lightMode')}
            className="flex items-center justify-center border border-border hover:bg-accent h-9 w-9 md:h-10 md:w-10"
            title={theme === 'light' ? t('header.darkMode') : t('header.lightMode')}
          >
            {theme === 'light' ? (
              <Sun className="h-4 w-4 md:h-5 md:w-5 transition-all" />
            ) : (
              <Moon className="h-4 w-4 md:h-5 md:w-5 transition-all" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-9 w-9" 
            onClick={toggleMobileMenu}
            aria-label={t('header.openMenu')}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-t">
          <nav className="container mx-auto px-4 py-3">
            <ul className="space-y-1">
              <li>
                <Link href="/">
                  <div 
                    className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${location === "/" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="ri-home-line text-lg"></i>
                    <span className="font-medium">{t('common.home')}</span>
                  </div>
                </Link>
              </li>

              <li>
                <Link href="/pomodoro">
                  <div 
                    className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${location === "/pomodoro" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="ri-timer-line text-lg"></i>
                    <span className="font-medium">{t('tools.pomodoro.title')}</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/timer">
                  <div 
                    className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${location === "/timer" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="ri-time-line text-lg"></i>
                    <span className="font-medium">{t('tools.timer.title')}</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/raffle">
                  <div 
                    className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${location === "/raffle" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="ri-shuffle-line text-lg"></i>
                    <span className="font-medium">{t('tools.raffle.title')}</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/thumbnail">
                  <div 
                    className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${location === "/thumbnail" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="ri-image-line text-lg"></i>
                    <span className="font-medium">{t('tools.thumbnail.title')}</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div 
                    className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${location === "/contact" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="ri-mail-line text-lg"></i>
                    <span className="font-medium">{t('common.contact')}</span>
                  </div>
                </Link>
              </li>
              <li className="border-t pt-2 mt-2">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-muted transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span className="font-medium">{t('common.github')}</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
