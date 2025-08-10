'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const languages = {
  ko: '한국어',
  en: 'English',
  ja: '日本語'
};

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    // 현재 경로에서 로케일 부분을 새로운 로케일로 교체
    const segments = pathname.split('/');
    segments[1] = newLocale; // 첫 번째 세그먼트가 로케일
    const newPath = segments.join('/');
    
    router.push(newPath);
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="icon">
        <Globe className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">언어 변경</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">언어 변경</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={locale === code ? 'bg-accent' : ''}
          >
            {name}
            {locale === code && ' ✓'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}