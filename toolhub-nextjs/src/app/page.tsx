import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Clock, 
  Brain, 
  Key, 
  Calculator,
  Calendar,
  Youtube,
  Shuffle,
  ArrowRight,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';
import { getCompletedTools } from '@/lib/tools';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ToolHub.tools - 무료 웹 도구 모음',
  description: '포모도로 타이머, MBTI 테스트, 비밀번호 생성기 등 일상과 업무에 필요한 다양한 도구들을 무료로 제공합니다.',
  keywords: '웹 도구, 포모도로 타이머, MBTI 테스트, 무료 유틸리티, 온라인 도구, toolhub',
  openGraph: {
    title: 'ToolHub.tools - 무료 웹 도구 모음',
    description: '포모도로 타이머, MBTI 테스트, 비밀번호 생성기 등 일상과 업무에 필요한 다양한 도구들을 무료로 제공합니다.',
    url: 'https://toolhub.tools',
  },
  alternates: {
    canonical: 'https://toolhub.tools',
  },
};

export default function HomePage() {
  const tools = getCompletedTools();

  const toolIcons = {
    'pomodoro': Clock,
    'mbti': Brain,
    'password-generator': Key,
    'unit-converter': Calculator,
    'date-calculator': Calendar,
    'thumbnail-downloader': Youtube,
    'number-raffle': Shuffle,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                🛠️ ToolHub.tools
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                홈
              </Link>
              <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                문의하기
              </Link>
              <Link href="/sitemap" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                사이트맵
              </Link>
            </nav>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            일상에 필요한 모든 도구를 한 곳에서
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            포모도로 타이머부터 MBTI 테스트까지, 생산성과 재미를 동시에 잡는 무료 웹 도구 모음
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            지금 바로 인기 도구 사용하기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/30 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">10,000+</div>
              <div className="text-gray-600 dark:text-gray-400">사용자</div>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">50,000+</div>
              <div className="text-gray-600 dark:text-gray-400">월간 사용량</div>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-12 w-12 text-yellow-600 dark:text-yellow-400 mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">98%</div>
              <div className="text-gray-600 dark:text-gray-400">만족도</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              인기 도구들
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              일상과 업무에 필요한 다양한 도구들을 무료로 이용해보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.slice(0, 6).map((tool) => {
              const IconComponent = toolIcons[tool.id as keyof typeof toolIcons] || Calculator;
              
              return (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      <Badge variant="secondary">
                        {tool.category}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name.ko}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {tool.description.ko}
                    </p>
                    <Link href={`/tools/${tool.id}`}>
                      <Button className="w-full" variant="outline">
                        사용하기
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">🛠️ ToolHub.tools</div>
              <p className="text-gray-400">
                일상에 필요한 모든 도구를 한 곳에서
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">인기 도구</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/tools/pomodoro" className="hover:text-white">포모도로 타이머</Link></li>
                <li><Link href="/tools/mbti" className="hover:text-white">MBTI 테스트</Link></li>
                <li><Link href="/tools/password-generator" className="hover:text-white">비밀번호 생성기</Link></li>
                <li><Link href="/tools/unit-converter" className="hover:text-white">단위 변환기</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">정보</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white">문의하기</Link></li>
                <li><Link href="/privacy" className="hover:text-white">개인정보처리방침</Link></li>
                <li><Link href="/terms" className="hover:text-white">이용약관</Link></li>
                <li><Link href="/sitemap" className="hover:text-white">사이트맵</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">테마</h3>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <span className="text-gray-400 text-sm">다크/라이트 모드</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ToolHub.tools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}