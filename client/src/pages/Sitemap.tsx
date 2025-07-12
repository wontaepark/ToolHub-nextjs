import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Timer, 
  Clock, 
  Hash, 
  Download, 
  Key, 
  Shuffle, 
  Calendar,
  Brain,
  Users,
  ExternalLink,
  Home,
  Mail,
  Shield,
  FileText,
  TrendingUp,
  Wrench
} from 'lucide-react';
import { toolsSearchData } from '../lib/searchData';

interface SitemapItem {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export default function Sitemap() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'ko' | 'en' | 'ja';

  // 메인 페이지들
  const mainPages: SitemapItem[] = [
    {
      title: currentLang === 'ko' ? '홈' : currentLang === 'en' ? 'Home' : 'ホーム',
      description: currentLang === 'ko' ? 'ToolHub.tools 메인 페이지' : currentLang === 'en' ? 'ToolHub.tools main page' : 'ToolHub.tools メインページ',
      path: '/',
      icon: <Home className="h-5 w-5" />,
      category: currentLang === 'ko' ? '메인' : currentLang === 'en' ? 'Main' : 'メイン'
    },
    {
      title: currentLang === 'ko' ? '사이트맵' : currentLang === 'en' ? 'Sitemap' : 'サイトマップ',
      description: currentLang === 'ko' ? '전체 사이트 구조 및 페이지 목록' : currentLang === 'en' ? 'Complete site structure and page list' : '全サイト構造とページリスト',
      path: '/sitemap',
      icon: <FileText className="h-5 w-5" />,
      category: currentLang === 'ko' ? '정보' : currentLang === 'en' ? 'Information' : '情報'
    },
    {
      title: currentLang === 'ko' ? '문의하기' : currentLang === 'en' ? 'Contact' : 'お問い合わせ',
      description: currentLang === 'ko' ? '개발진에게 연락하기' : currentLang === 'en' ? 'Contact the development team' : '開発チームに連絡',
      path: '/contact',
      icon: <Mail className="h-5 w-5" />,
      category: currentLang === 'ko' ? '정보' : currentLang === 'en' ? 'Information' : '情報'
    },
    {
      title: currentLang === 'ko' ? '개인정보 처리방침' : currentLang === 'en' ? 'Privacy Policy' : 'プライバシーポリシー',
      description: currentLang === 'ko' ? '개인정보 보호 정책' : currentLang === 'en' ? 'Personal information protection policy' : '個人情報保護ポリシー',
      path: '/privacy',
      icon: <Shield className="h-5 w-5" />,
      category: currentLang === 'ko' ? '정책' : currentLang === 'en' ? 'Policy' : 'ポリシー'
    },
    {
      title: currentLang === 'ko' ? '이용약관' : currentLang === 'en' ? 'Terms of Service' : '利用規約',
      description: currentLang === 'ko' ? '서비스 이용 약관' : currentLang === 'en' ? 'Terms of service' : 'サービス利用規約',
      path: '/terms',
      icon: <FileText className="h-5 w-5" />,
      category: currentLang === 'ko' ? '정책' : currentLang === 'en' ? 'Policy' : 'ポリシー'
    }
  ];

  // 도구 데이터를 SitemapItem으로 변환
  const toolPages: SitemapItem[] = toolsSearchData.map(tool => {
    let icon;
    switch (tool.id) {
      case 'pomodoro':
        icon = <Timer className="h-5 w-5" />;
        break;
      case 'timer':
        icon = <Clock className="h-5 w-5" />;
        break;
      case 'raffle':
        icon = <Hash className="h-5 w-5" />;
        break;
      case 'thumbnail':
        icon = <Download className="h-5 w-5" />;
        break;
      case 'password':
        icon = <Key className="h-5 w-5" />;
        break;
      case 'converter':
        icon = <Shuffle className="h-5 w-5" />;
        break;
      case 'date-calculator':
        icon = <Calendar className="h-5 w-5" />;
        break;
      case 'mbti':
        icon = <Brain className="h-5 w-5" />;
        break;
      case 'teto-egen':
        icon = <Users className="h-5 w-5" />;
        break;
      default:
        icon = <FileText className="h-5 w-5" />;
    }

    return {
      title: tool.title[currentLang],
      description: tool.description[currentLang],
      path: tool.path,
      icon,
      category: tool.category[currentLang],
      isPopular: tool.popularity > 90,
      isNew: tool.id === 'teto-egen' // 테토-에겐 테스트는 신규
    };
  });

  // 카테고리별로 그룹화
  const groupedTools = toolPages.reduce((acc, tool) => {
    const category = tool.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, SitemapItem[]>);

  // 인기도순으로 정렬
  Object.keys(groupedTools).forEach(category => {
    groupedTools[category].sort((a, b) => {
      const toolA = toolsSearchData.find(t => t.path === a.path);
      const toolB = toolsSearchData.find(t => t.path === b.path);
      return (toolB?.popularity || 0) - (toolA?.popularity || 0);
    });
  });

  const allPages = [...mainPages, ...toolPages];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {currentLang === 'ko' ? '사이트맵' : currentLang === 'en' ? 'Sitemap' : 'サイトマップ'}
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          {currentLang === 'ko' 
            ? 'ToolHub.tools의 모든 페이지와 도구를 한눈에 확인하세요' 
            : currentLang === 'en' 
            ? 'View all pages and tools on ToolHub.tools at a glance'
            : 'ToolHub.toolsのすべてのページとツールを一覧で確認'
          }
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">
              {currentLang === 'ko' ? '인기 도구' : currentLang === 'en' ? 'Popular Tools' : '人気ツール'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">
              {currentLang === 'ko' ? '신규 도구' : currentLang === 'en' ? 'New Tools' : '新規ツール'}
            </span>
          </div>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">{allPages.length}</CardTitle>
            <CardDescription>
              {currentLang === 'ko' ? '총 페이지 수' : currentLang === 'en' ? 'Total Pages' : '総ページ数'}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">{toolPages.length}</CardTitle>
            <CardDescription>
              {currentLang === 'ko' ? '사용 가능한 도구' : currentLang === 'en' ? 'Available Tools' : '利用可能ツール'}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">{Object.keys(groupedTools).length}</CardTitle>
            <CardDescription>
              {currentLang === 'ko' ? '도구 카테고리' : currentLang === 'en' ? 'Tool Categories' : 'ツールカテゴリ'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* 메인 페이지들 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Home className="h-6 w-6" />
          {currentLang === 'ko' ? '메인 페이지' : currentLang === 'en' ? 'Main Pages' : 'メインページ'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainPages.map((page, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {page.icon}
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                  </div>
                  <Badge variant="outline">{page.category}</Badge>
                </div>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={page.path}>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {currentLang === 'ko' ? '페이지 이동' : currentLang === 'en' ? 'Go to Page' : 'ページに移動'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-12" />

      {/* 도구들 (카테고리별) */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Wrench className="h-6 w-6" />
          {currentLang === 'ko' ? '도구 목록' : currentLang === 'en' ? 'Tools List' : 'ツール一覧'}
        </h2>
        
        {Object.entries(groupedTools).map(([category, tools]) => (
          <div key={category} className="mb-10">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-primary rounded"></div>
              {category}
              <Badge variant="secondary" className="ml-2">
                {tools.length}{currentLang === 'ko' ? '개' : currentLang === 'en' ? ' tools' : '個'}
              </Badge>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {tool.icon}
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        {tool.isPopular && (
                          <div className="w-3 h-3 bg-red-500 rounded-full" title={currentLang === 'ko' ? '인기 도구' : currentLang === 'en' ? 'Popular Tool' : '人気ツール'} />
                        )}
                        {tool.isNew && (
                          <div className="w-3 h-3 bg-green-500 rounded-full" title={currentLang === 'ko' ? '신규 도구' : currentLang === 'en' ? 'New Tool' : '新規ツール'} />
                        )}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Link href={tool.path}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {currentLang === 'ko' ? '사용하기' : currentLang === 'en' ? 'Use Tool' : 'ツール使用'}
                        </Button>
                      </Link>
                      {tool.isPopular && (
                        <Badge variant="destructive">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {currentLang === 'ko' ? '인기' : currentLang === 'en' ? 'Popular' : '人気'}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-muted-foreground/20 text-center">
        <p className="text-sm text-muted-foreground">
          {currentLang === 'ko' 
            ? '모든 도구는 무료로 제공되며, 정기적으로 새로운 도구가 추가됩니다.'
            : currentLang === 'en'
            ? 'All tools are provided for free, and new tools are added regularly.'
            : 'すべてのツールは無料で提供され、定期的に新しいツールが追加されます。'
          }
        </p>
        <Link href="/">
          <Button variant="ghost" className="mt-4">
            <Home className="h-4 w-4 mr-2" />
            {currentLang === 'ko' ? '홈으로 돌아가기' : currentLang === 'en' ? 'Back to Home' : 'ホームに戻る'}
          </Button>
        </Link>
      </div>
    </div>
  );
}