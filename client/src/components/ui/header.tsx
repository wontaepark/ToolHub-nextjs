import { useState } from 'react';
import { Link, useLocation } from "wouter";
import { useTheme } from "../ThemeProvider";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, Github } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("Toggling theme from", theme, "to", newTheme);
    setTheme(newTheme);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                <i className="ri-tools-fill text-white text-xl"></i>
              </div>
              <h1 className="text-xl font-bold">ToolHub<span className="text-primary">.io</span></h1>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="hidden md:flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors"
            >
              <i className="ri-home-line text-lg"></i>
              <span>홈</span>
            </Button>
          </Link>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors"
          >
            <Github className="h-5 w-5" />
            <span>GitHub</span>
          </a>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
            className="flex items-center justify-center border border-border hover:bg-accent"
            title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
          >
            {theme === 'light' ? (
              <Sun className="h-5 w-5 transition-all" />
            ) : (
              <Moon className="h-5 w-5 transition-all" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <nav className="container mx-auto px-4 py-3">
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className={`block py-2 px-4 rounded-lg transition-colors ${location === "/" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/calculator">
                  <a className={`block py-2 px-4 rounded-lg transition-colors ${location === "/calculator" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                    Calculator
                  </a>
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
