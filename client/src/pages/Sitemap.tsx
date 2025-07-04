import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
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
  Wrench,
  Search,
  Filter,
  Globe
} from 'lucide-react';
import { toolsSearchData, getToolsByCategory } from '../lib/searchData';
import SEOHead from '../components/SEOHead';

export default function Sitemap() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'ko' | 'en' | 'ja';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 도구 아이콘 매핑
  const getToolIcon = (toolId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'pomodoro': <Timer className="h-5 w-5" />,
      'timer': <Clock className="h-5 w-5" />,
      'raffle': <Hash className="h-5 w-5" />,
      'thumbnail': <Download className="h-5 w-5" />,
      'password': <Key className="h-5 w-5" />,
      'converter': <Shuffle className="h-5 w-5" />,
      'date-calculator': <Calendar className="h-5 w-5" />,
      'mbti': <Brain className="h-5 w-5" />,
      'teto-egen-test': <Users className="h-5 w-5" />,
      'weather': <Globe className="h-5 w-5" />
    };
    return iconMap[toolId] || <Wrench className="h-5 w-5" />;
  };

  // 카테고리별 도구 그룹화
  const categorizedTools = useMemo(() => {
    return getToolsByCategory(currentLang);
  }, [currentLang]);

  // 검색 및 필터링된 도구들
  const filteredTools = useMemo(() => {
    let allTools = toolsSearchData.map(tool => ({
      id: tool.id,
      title: tool.title[currentLang],
      description: tool.description[currentLang],
      path: tool.path,
      category: tool.category[currentLang],
      icon: getToolIcon(tool.id),
      popularity: tool.popularity
    }));

    // 검색 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      allTools = allTools.filter(tool => 
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
      );
    }

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      allTools = allTools.filter(tool => 
        tool.category === selectedCategory
      );
    }

    return allTools.sort((a, b) => b.popularity - a.popularity);
  }, [searchQuery, selectedCategory, currentLang]);

  // 통계 계산
  const stats = {
    totalTools: toolsSearchData.length,
    totalCategories: Object.keys(categorizedTools).length,
    supportedLanguages: 3,
    totalPages: toolsSearchData.length + 5 // 도구들 + 정적 페이지들
  };

  return (
    <>
      <SEOHead toolId="sitemap" />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('sitemap.title', '사이트맵')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {currentLang === 'ko' ? 
                'ToolHub.tools의 모든 도구와 페이지를 한눈에 확인하고 쉽게 탐색해보세요' :
                currentLang === 'en' ?
                'Discover and navigate all tools and pages on ToolHub.tools at a glance' :
                'ToolHub.toolsのすべてのツールとページを一目で確認し、簡単にナビゲートしてください'
              }
            </p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalTools}</div>
                <div className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '총 도구' : currentLang === 'en' ? 'Total Tools' : '総ツール'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalCategories}</div>
                <div className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '카테고리' : currentLang === 'en' ? 'Categories' : 'カテゴリ'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.supportedLanguages}</div>
                <div className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '지원 언어' : currentLang === 'en' ? 'Languages' : '対応言語'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalPages}</div>
                <div className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '총 페이지' : currentLang === 'en' ? 'Total Pages' : '総ページ'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 검색 및 필터 */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={currentLang === 'ko' ? '도구 또는 카테고리 검색...' : 
                           currentLang === 'en' ? 'Search tools or categories...' : 
                           'ツールまたはカテゴリを検索...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">
                  {currentLang === 'ko' ? '전체 카테고리' : currentLang === 'en' ? 'All Categories' : '全カテゴリ'}
                </option>
                {Object.keys(categorizedTools).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 도구 그리드 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Wrench className="h-6 w-6" />
              {currentLang === 'ko' ? '도구 목록' : currentLang === 'en' ? 'Tools' : 'ツール一覧'}
              <Badge variant="secondary">{filteredTools.length}</Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map(tool => (
                <Card key={tool.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {tool.icon}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                      {tool.popularity > 8 && (
                        <Badge variant="default" className="bg-orange-500">
                          {currentLang === 'ko' ? '인기' : currentLang === 'en' ? 'Popular' : '人気'}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-3">{tool.description}</CardDescription>
                    <Link href={tool.path}>
                      <Button variant="outline" size="sm" className="w-full">
                        {currentLang === 'ko' ? '사용하기' : currentLang === 'en' ? 'Use Tool' : 'ツールを使用'}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          {/* 정적 페이지들 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              {currentLang === 'ko' ? '기타 페이지' : currentLang === 'en' ? 'Other Pages' : 'その他のページ'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: currentLang === 'ko' ? '홈' : currentLang === 'en' ? 'Home' : 'ホーム',
                  description: currentLang === 'ko' ? 'ToolHub.tools 메인 페이지' : currentLang === 'en' ? 'ToolHub.tools main page' : 'ToolHub.tools メインページ',
                  path: '/',
                  icon: <Home className="h-5 w-5" />
                },
                {
                  title: currentLang === 'ko' ? '문의하기' : currentLang === 'en' ? 'Contact' : 'お問い合わせ',
                  description: currentLang === 'ko' ? '개발진에게 연락하기' : currentLang === 'en' ? 'Contact the development team' : '開発チームに連絡',
                  path: '/contact',
                  icon: <Mail className="h-5 w-5" />
                },
                {
                  title: currentLang === 'ko' ? '개인정보처리방침' : currentLang === 'en' ? 'Privacy Policy' : 'プライバシーポリシー',
                  description: currentLang === 'ko' ? '개인정보 보호 정책' : currentLang === 'en' ? 'Personal information protection policy' : '個人情報保護ポリシー',
                  path: '/privacy',
                  icon: <Shield className="h-5 w-5" />
                },
                {
                  title: currentLang === 'ko' ? '이용약관' : currentLang === 'en' ? 'Terms of Service' : '利用規約',
                  description: currentLang === 'ko' ? '서비스 이용 약관' : currentLang === 'en' ? 'Terms of service' : 'サービス利용規약',
                  path: '/terms',
                  icon: <FileText className="h-5 w-5" />
                }
              ].map(page => (
                <Card key={page.path} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {page.icon}
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-3">{page.description}</CardDescription>
                    <Link href={page.path}>
                      <Button variant="outline" size="sm" className="w-full">
                        {currentLang === 'ko' ? '방문하기' : currentLang === 'en' ? 'Visit' : '訪問する'}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 하단 정보 */}
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              {currentLang === 'ko' ? 
                '마지막 업데이트:' : 
                currentLang === 'en' ? 
                'Last updated:' : 
                '最終更新:'
              } {new Date().toLocaleDateString(currentLang === 'ko' ? 'ko-KR' : currentLang === 'en' ? 'en-US' : 'ja-JP')}
            </p>
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← {currentLang === 'ko' ? '홈으로 돌아가기' : currentLang === 'en' ? 'Back to Home' : 'ホームに戻る'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}