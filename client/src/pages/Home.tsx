import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Zap } from "lucide-react";
import AdSense from "@/components/AdSense";
import SEOHead from "@/components/SEOHead";

export default function Home() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  
  return (
    <div>
      <SEOHead />
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16 relative px-4">
        <div className="absolute -top-4 -left-4 w-16 h-16 md:w-24 md:h-24 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -right-8 w-20 h-20 md:w-32 md:h-32 bg-secondary/10 rounded-full blur-xl"></div>
        
        <Badge 
          variant="secondary" 
          className="mb-4 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => {
            const toolsSection = document.getElementById('tools-section');
            if (toolsSection) {
              toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
          {t('common.newTools')}
        </Badge>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
          ToolHub<span className="text-primary">.tools</span>
        </h1>
        
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-foreground px-2">
          {t('home.subtitle')} <span className="text-primary">{t('common.tools')}</span>
        </h2>
        
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl md:max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed px-2">
          {t('home.description')}
        </p>
        
        {/* Social Proof Section */}
        <div className="bg-card/50 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 max-w-4xl mx-auto border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
                <i className="ri-user-line text-primary text-xl"></i>
              </div>
              <div className="text-xl md:text-2xl font-bold text-primary">{t('home.stats.users')}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{t('home.stats.usersLabel')}</div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mb-2">
                <i className="ri-bar-chart-line text-secondary text-xl"></i>
              </div>
              <div className="text-xl md:text-2xl font-bold text-secondary">{t('home.stats.usage')}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{t('home.stats.usageLabel')}</div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-2">
                <i className="ri-star-line text-accent text-xl"></i>
              </div>
              <div className="text-xl md:text-2xl font-bold text-accent">{t('home.stats.satisfaction')}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{t('home.stats.satisfactionLabel')}</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            {t('home.features.fastAccess')}
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Star className="w-3 h-3 md:w-4 md:h-4 text-secondary" />
            {t('home.features.freeUse')}
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-accent" />
            {t('home.features.allDevices')}
          </div>
        </div>
      </div>
      
      {/* Site Introduction Section */}
      <div className="mb-16 px-4">
        <div className="max-w-6xl mx-auto bg-card rounded-2xl border border-border p-8 md:p-12 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            {currentLang === 'ko' ? 'ToolHub.tools 소개' : 
             currentLang === 'ja' ? 'ToolHub.tools 紹介' : 
             'About ToolHub.tools'}
          </h2>
          
          <div className="space-y-8 text-muted-foreground leading-relaxed">
            {/* Service Overview */}
            <div className="text-center">
              <p className="text-lg mb-6">
                {currentLang === 'ko' ? 
                  'ToolHub.tools는 누구나 쉽고 빠르게 사용할 수 있는 웹 기반 유틸리티 도구 모음입니다. 포모도로 타이머, 번호 추첨기, 유튜브 썸네일 다운로더, 비밀번호 생성기, 단위 변환기, MBTI 테스트 등 일상과 업무에 유용한 13가지 도구를 하나의 웹사이트에서 제공합니다.' :
                 currentLang === 'ja' ? 
                  'ToolHub.toolsは誰でも簡単かつ迅速に使用できるウェブベースのユーティリティツール集です。ポモドーロタイマー、番号抽選機、YouTubeサムネイルダウンローダー、パスワード生成器、単位変換器、MBTIテストなど、日常と業務に役立つ13種類のツールを一つのウェブサイトで提供します。' :
                  'ToolHub.tools is a collection of web-based utility tools that anyone can use easily and quickly. We provide 13 useful tools for daily life and work, including Pomodoro timer, number raffle, YouTube thumbnail downloader, password generator, unit converter, MBTI test, and more on a single website.'
                }
              </p>
              <p className="text-base">
                {currentLang === 'ko' ? 
                  '설치나 회원가입 없이 브라우저에서 바로 실행 가능한 무료 도구들을 통해 사용자 여러분의 생산성과 편의성을 높이는 것이 ToolHub.tools의 궁극적인 목표입니다.' :
                 currentLang === 'ja' ? 
                  'インストールや会員登録なしにブラウザで直接実行できる無料ツールを通じて、ユーザーの皆様の生産性と利便性を向上させることがToolHub.toolsの究極的な目標です。' :
                  'Our ultimate goal at ToolHub.tools is to enhance your productivity and convenience through free tools that can be executed directly in your browser without installation or registration.'
                }
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/30">
                <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <i className="ri-target-line text-white text-sm"></i>
                  </div>
                  {currentLang === 'ko' ? '미션' : 
                   currentLang === 'ja' ? 'ミッション' : 
                   'Mission'}
                </h3>
                <div className="space-y-3">
                  <p className="font-medium text-blue-800 dark:text-blue-300">
                    {currentLang === 'ko' ? 
                      '"복잡한 도구는 이제 그만, 간단하고 효과적인 웹 도구로 모든 사람의 일상을 편리하게"' :
                     currentLang === 'ja' ? 
                      '"複雑なツールはもう終わり、シンプルで効果的なウェブツールで皆の日常を便利に"' :
                      '"No more complex tools, making everyone\'s daily life convenient with simple and effective web tools"'
                    }
                  </p>
                  <p>
                    {currentLang === 'ko' ? 
                      '현대인들은 다양한 계산, 시간 관리, 변환 작업 등을 위해 여러 애플리케이션을 설치하고 관리해야 하는 번거로움을 겪고 있습니다. ToolHub.tools는 이러한 불편함을 해결하고, 언제 어디서나 브라우저만으로 필요한 도구를 즉시 사용할 수 있는 환경을 제공합니다.' :
                     currentLang === 'ja' ? 
                      '現代人は様々な計算、時間管理、変換作業などのために複数のアプリケーションをインストールして管理しなければならない煩わしさを経験しています。ToolHub.toolsはこのような不便さを解決し、いつでもどこでもブラウザだけで必要なツールを即座に使用できる環境を提供します。' :
                      'Modern people experience the hassle of having to install and manage multiple applications for various calculations, time management, conversion tasks, etc. ToolHub.tools solves these inconveniences and provides an environment where you can instantly use the tools you need anywhere, anytime with just a browser.'
                    }
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/30">
                <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <i className="ri-eye-line text-white text-sm"></i>
                  </div>
                  {currentLang === 'ko' ? '비전' : 
                   currentLang === 'ja' ? 'ビジョン' : 
                   'Vision'}
                </h3>
                <p>
                  {currentLang === 'ko' ? 
                    '앞으로 더 많은 유용한 도구들을 추가하여 사용자들의 디지털 라이프를 더욱 편리하게 만들어가겠습니다. 인공지능 기반 도구, 고급 시간 관리 도구, 더욱 다양한 변환 도구 등을 통해 웹 기반 유틸리티의 새로운 표준을 제시하고자 합니다.' :
                   currentLang === 'ja' ? 
                    '今後、より多くの有用なツールを追加してユーザーのデジタルライフをさらに便利にしていきます。人工知能ベースのツール、高度な時間管理ツール、より多様な変換ツールなどを通じてウェブベースユーティリティの新しい基準を提示したいと考えています。' :
                    'We will continue to add more useful tools to make users\' digital lives even more convenient. We aim to present new standards for web-based utilities through AI-based tools, advanced time management tools, more diverse conversion tools, and more.'
                  }
                </p>
              </div>
            </div>

            {/* Service Categories */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">
                {currentLang === 'ko' ? '제공 서비스 소개' : 
                 currentLang === 'ja' ? '提供サービス紹介' : 
                 'Service Categories'}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card border rounded-xl p-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-3">
                    <i className="ri-bar-chart-line text-green-600 text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    {currentLang === 'ko' ? '생산성 도구' : 
                     currentLang === 'ja' ? '生産性ツール' : 
                     'Productivity Tools'}
                  </h4>
                  <ul className="text-sm space-y-1">

                    <li>{currentLang === 'ko' ? '• 포모도로 타이머' : currentLang === 'ja' ? '• ポモドーロタイマー' : '• Pomodoro Timer'}</li>
                    <li>{currentLang === 'ko' ? '• 범용 타이머' : currentLang === 'ja' ? '• 汎用タイマー' : '• General Timer'}</li>
                    <li>{currentLang === 'ko' ? '• 날짜 계산기' : currentLang === 'ja' ? '• 日付計算機' : '• Date Calculator'}</li>
                  </ul>
                </div>
                
                <div className="bg-card border rounded-xl p-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
                    <i className="ri-tools-line text-blue-600 text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    {currentLang === 'ko' ? '유틸리티 도구' : 
                     currentLang === 'ja' ? 'ユーティリティツール' : 
                     'Utility Tools'}
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>{currentLang === 'ko' ? '• 단위 변환기' : currentLang === 'ja' ? '• 単位変換器' : '• Unit Converter'}</li>
                    <li>{currentLang === 'ko' ? '• 비밀번호 생성기' : currentLang === 'ja' ? '• パスワード生成器' : '• Password Generator'}</li>
                    <li>{currentLang === 'ko' ? '• 번호 추첨기' : currentLang === 'ja' ? '• 番号抽選機' : '• Number Raffle'}</li>
                    <li>{currentLang === 'ko' ? '• QR 코드 생성기' : currentLang === 'ja' ? '• QRコード生成器' : '• QR Code Generator'}</li>
                  </ul>
                </div>
                
                <div className="bg-card border rounded-xl p-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-3">
                    <i className="ri-image-line text-red-600 text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    {currentLang === 'ko' ? '멀티미디어 도구' : 
                     currentLang === 'ja' ? 'マルチメディアツール' : 
                     'Multimedia Tools'}
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>{currentLang === 'ko' ? '• 유튜브 썸네일 다운로더' : currentLang === 'ja' ? '• YouTubeサムネイルダウンローダー' : '• YouTube Thumbnail Downloader'}</li>
                    <li>{currentLang === 'ko' ? '• 이미지 도구' : currentLang === 'ja' ? '• 画像ツール' : '• Image Tools'}</li>
                  </ul>
                </div>
                
                <div className="bg-card border rounded-xl p-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3">
                    <i className="ri-heart-line text-purple-600 text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    {currentLang === 'ko' ? '재미있는 도구' : 
                     currentLang === 'ja' ? '楽しいツール' : 
                     'Fun Tools'}
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>{currentLang === 'ko' ? '• MBTI 성격유형 테스트' : currentLang === 'ja' ? '• MBTI性格タイプテスト' : '• MBTI Personality Test'}</li>
                    <li>{currentLang === 'ko' ? '• 테토 에겐 테스트' : currentLang === 'ja' ? '• テト エゲン テスト' : '• Teto Egen Test'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-xl p-8 border border-orange-200/50 dark:border-orange-800/30">
              <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">
                {currentLang === 'ko' ? '핵심 가치와 원칙' : 
                 currentLang === 'ja' ? '核心価値と原則' : 
                 'Core Values & Principles'}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-money-dollar-circle-line text-green-600 text-2xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    {currentLang === 'ko' ? '완전 무료 서비스' : 
                     currentLang === 'ja' ? '完全無料サービス' : 
                     'Completely Free Service'}
                  </h4>
                  <p className="text-sm">
                    {currentLang === 'ko' ? 
                      '모든 도구는 영구적으로 무료로 제공됩니다. 숨겨진 비용이나 프리미엄 플랜은 존재하지 않습니다.' :
                     currentLang === 'ja' ? 
                      '全てのツールは永続的に無料で提供されます。隠れた費用やプレミアムプランは存在しません。' :
                      'All tools are provided permanently free. There are no hidden costs or premium plans.'
                    }
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-shield-check-line text-blue-600 text-2xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    {currentLang === 'ko' ? '보안과 프라이버시' : 
                     currentLang === 'ja' ? 'セキュリティとプライバシー' : 
                     'Security & Privacy'}
                  </h4>
                  <p className="text-sm">
                    {currentLang === 'ko' ? 
                      '모든 데이터는 사용자의 브라우저에만 저장되며, 외부 서버로 전송되지 않아 완전한 프라이버시를 보장합니다.' :
                     currentLang === 'ja' ? 
                      '全てのデータはユーザーのブラウザにのみ保存され、外部サーバーに送信されないため完全なプライバシーを保証します。' :
                      'All data is stored only in your browser and is not transmitted to external servers, ensuring complete privacy.'
                    }
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-global-line text-purple-600 text-2xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    {currentLang === 'ko' ? '접근성과 포용성' : 
                     currentLang === 'ja' ? 'アクセシビリティと包摂性' : 
                     'Accessibility & Inclusivity'}
                  </h4>
                  <p className="text-sm">
                    {currentLang === 'ko' ? 
                      '한국어, 영어, 일본어를 지원하며, 모바일과 데스크톱 모든 환경에서 최적화된 반응형 디자인을 제공합니다.' :
                     currentLang === 'ja' ? 
                      '韓国語、英語、日本語をサポートし、モバイルとデスクトップ全ての環境で最適化されたレスポンシブデザインを提供します。' :
                      'Supporting Korean, English, and Japanese with responsive design optimized for all mobile and desktop environments.'
                    }
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-user-heart-line text-orange-600 text-2xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    {currentLang === 'ko' ? '사용자 중심 디자인' : 
                     currentLang === 'ja' ? 'ユーザー中心デザイン' : 
                     'User-Centered Design'}
                  </h4>
                  <p className="text-sm">
                    {currentLang === 'ko' ? 
                      '복잡한 기능보다는 직관적이고 사용하기 쉬운 인터페이스를 추구하며, 최소한의 클릭으로 원하는 결과를 얻을 수 있습니다.' :
                     currentLang === 'ja' ? 
                      '複雑な機能よりも直感的で使いやすいインターフェースを追求し、最小限のクリックで望む結果を得ることができます。' :
                      'We pursue intuitive and easy-to-use interfaces rather than complex features, allowing you to achieve desired results with minimal clicks.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Features */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">
                {currentLang === 'ko' ? '기술적 특징' : 
                 currentLang === 'ja' ? '技術的特徴' : 
                 'Technical Features'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <i className="ri-code-s-slash-line text-primary"></i>
                    {currentLang === 'ko' ? '최신 웹 기술 활용' : 
                     currentLang === 'ja' ? '最新ウェブ技術活用' : 
                     'Latest Web Technologies'}
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <i className="ri-check-line text-green-500"></i>
                      {currentLang === 'ko' ? '반응형 웹 디자인: 모든 기기에서 최적화된 화면 제공' : 
                       currentLang === 'ja' ? 'レスポンシブウェブデザイン：全てのデバイスで最適化された画面提供' : 
                       'Responsive Web Design: Optimized display on all devices'}
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ri-check-line text-green-500"></i>
                      {currentLang === 'ko' ? 'PWA: 앱과 같은 사용 경험' : 
                       currentLang === 'ja' ? 'PWA：アプリのような使用体験' : 
                       'PWA: App-like user experience'}
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ri-check-line text-green-500"></i>
                      {currentLang === 'ko' ? '빠른 로딩 속도: 최적화된 코드로 즉시 실행' : 
                       currentLang === 'ja' ? '高速ローディング：最適化されたコードで即座に実行' : 
                       'Fast Loading: Instant execution with optimized code'}
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ri-check-line text-green-500"></i>
                      {currentLang === 'ko' ? '오프라인 지원: 네트워크 연결 없이도 기본 기능 사용 가능' : 
                       currentLang === 'ja' ? 'オフラインサポート：ネットワーク接続なしでも基本機能使用可能' : 
                       'Offline Support: Basic functions available without network connection'}
                    </li>
                  </ul>
                </div>
                
                <div className="bg-card border rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <i className="ri-smartphone-line text-primary"></i>
                    {currentLang === 'ko' ? '크로스 플랫폼 호환성' : 
                     currentLang === 'ja' ? 'クロスプラットフォーム互換性' : 
                     'Cross-Platform Compatibility'}
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <i className="ri-check-line text-green-500"></i>
                      {currentLang === 'ko' ? '모든 주요 브라우저 지원: Chrome, Firefox, Safari, Edge' : 
                       currentLang === 'ja' ? '全ての主要ブラウザサポート：Chrome、Firefox、Safari、Edge' : 
                       'All major browsers supported: Chrome, Firefox, Safari, Edge'}
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ri-check-line text-green-500"></i>
                      {currentLang === 'ko' ? '모바일 최적화: iOS, Android 터치 인터페이스 완벽 지원' : 
                       currentLang === 'ja' ? 'モバイル最適化：iOS、Androidタッチインターフェース完全サポート' : 
                       'Mobile Optimized: Full iOS, Android touch interface support'}
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ri-check-line text-green-500"></i>
                      {currentLang === 'ko' ? '키보드 단축키: 데스크톱 사용자를 위한 효율적인 조작법' : 
                       currentLang === 'ja' ? 'キーボードショートカット：デスクトップユーザーのための効率的な操作法' : 
                       'Keyboard Shortcuts: Efficient controls for desktop users'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quality Assurance */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border border-green-200/50 dark:border-green-800/30">
              <h3 className="text-xl font-semibold mb-4 text-center text-foreground">
                {currentLang === 'ko' ? '품질 보증과 신뢰성' : 
                 currentLang === 'ja' ? '品質保証と信頼性' : 
                 'Quality Assurance & Reliability'}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-verified-badge-line text-green-600 text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    {currentLang === 'ko' ? '정확성 검증' : 
                     currentLang === 'ja' ? '正確性検証' : 
                     'Accuracy Verification'}
                  </h4>
                  <p className="text-sm">
                    {currentLang === 'ko' ? 
                      '모든 계산 도구는 다양한 테스트 케이스를 통해 정확성을 검증받았습니다.' :
                     currentLang === 'ja' ? 
                      '全ての計算ツールは様々なテストケースを通じて正確性が検証されています。' :
                      'All calculation tools have been verified for accuracy through various test cases.'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-refresh-line text-blue-600 text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    {currentLang === 'ko' ? '지속적인 업데이트' : 
                     currentLang === 'ja' ? '継続的なアップデート' : 
                     'Continuous Updates'}
                  </h4>
                  <p className="text-sm">
                    {currentLang === 'ko' ? 
                      '사용자 피드백을 바탕으로 정기적으로 기능을 개선하고 새로운 도구를 추가합니다.' :
                     currentLang === 'ja' ? 
                      'ユーザーフィードバックに基づいて定期的に機能を改善し、新しいツールを追加します。' :
                      'We regularly improve features and add new tools based on user feedback.'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-customer-service-2-line text-purple-600 text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    {currentLang === 'ko' ? '사용자 지원' : 
                     currentLang === 'ja' ? 'ユーザーサポート' : 
                     'User Support'}
                  </h4>
                  <p className="text-sm">
                    {currentLang === 'ko' ? 
                      '문제 발생 시 빠른 해결을 위한 지원 체계를 구축하고 있습니다.' :
                     currentLang === 'ja' ? 
                      '問題発生時の迅速な解決のためのサポート体制を構築しています。' :
                      'We have established a support system for quick resolution when problems occur.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Future Plans */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">
                {currentLang === 'ko' ? '향후 계획' : 
                 currentLang === 'ja' ? '今後の計画' : 
                 'Future Plans'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded text-xs flex items-center justify-center font-bold">3</div>
                    {currentLang === 'ko' ? '단기 계획 (3-6개월)' : 
                     currentLang === 'ja' ? '短期計画（3-6ヶ月）' : 
                     'Short-term Plans (3-6 months)'}
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <i className="ri-add-circle-line text-green-500 mt-0.5"></i>
                      <span>
                        {currentLang === 'ko' ? '새로운 도구 추가: 환율 변환기, 색상 팔레트 생성기, 텍스트 분석 도구' : 
                         currentLang === 'ja' ? '新しいツール追加：為替変換器、カラーパレット生成器、テキスト分析ツール' : 
                         'New Tools: Currency converter, color palette generator, text analysis tools'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-robot-line text-blue-500 mt-0.5"></i>
                      <span>
                        {currentLang === 'ko' ? 'AI 기능 도입: 인공지능 기반 추천 시스템 및 자동화 기능' : 
                         currentLang === 'ja' ? 'AI機能導入：人工知能ベースの推薦システムおよび自動化機能' : 
                         'AI Features: AI-based recommendation system and automation features'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-speed-up-line text-orange-500 mt-0.5"></i>
                      <span>
                        {currentLang === 'ko' ? '성능 최적화: 로딩 속도 개선 및 사용자 경험 향상' : 
                         currentLang === 'ja' ? 'パフォーマンス最適化：ローディング速度改善およびユーザー体験向上' : 
                         'Performance Optimization: Loading speed improvement and enhanced user experience'}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-card border rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded text-xs flex items-center justify-center font-bold">2</div>
                    {currentLang === 'ko' ? '중장기 계획 (6개월-2년)' : 
                     currentLang === 'ja' ? '中長期計画（6ヶ月-2年）' : 
                     'Long-term Plans (6 months-2 years)'}
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <i className="ri-api-line text-purple-500 mt-0.5"></i>
                      <span>
                        {currentLang === 'ko' ? 'API 서비스: 개발자를 위한 ToolHub API 제공' : 
                         currentLang === 'ja' ? 'APIサービス：開発者のためのToolHub API提供' : 
                         'API Service: ToolHub API for developers'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-smartphone-line text-green-500 mt-0.5"></i>
                      <span>
                        {currentLang === 'ko' ? '모바일 앱: 네이티브 모바일 애플리케이션 출시' : 
                         currentLang === 'ja' ? 'モバイルアプリ：ネイティブモバイルアプリケーション発売' : 
                         'Mobile App: Native mobile application launch'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-team-line text-blue-500 mt-0.5"></i>
                      <span>
                        {currentLang === 'ko' ? '협업 기능: 팀 단위 도구 공유 및 협업 기능' : 
                         currentLang === 'ja' ? 'コラボレーション機能：チーム単位のツール共有およびコラボレーション機能' : 
                         'Collaboration Features: Team tool sharing and collaboration functions'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-global-line text-red-500 mt-0.5"></i>
                      <span>
                        {currentLang === 'ko' ? '언어 확장: 중국어, 스페인어, 프랑스어 등 추가 언어 지원' : 
                         currentLang === 'ja' ? '言語拡張：中国語、スペイン語、フランス語など追加言語サポート' : 
                         'Language Expansion: Additional language support including Chinese, Spanish, French'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact & Support */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/30">
              <h3 className="text-xl font-semibold mb-4 text-center text-foreground">
                {currentLang === 'ko' ? '문의 및 지원' : 
                 currentLang === 'ja' ? 'お問い合わせおよびサポート' : 
                 'Contact & Support'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">
                    {currentLang === 'ko' ? '연락 방법' : 
                     currentLang === 'ja' ? '連絡方法' : 
                     'Contact Methods'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      {currentLang === 'ko' ? 
                        '문의나 제안이 있으시면 언제든지 연락해주세요. 사용자 피드백을 반영하여 더욱 편리한 서비스로 발전해 나가겠습니다.' :
                       currentLang === 'ja' ? 
                        'お問い合わせやご提案がございましたら、いつでもご連絡ください。ユーザーフィードバックを反映して、より便利なサービスに発展させていきます。' :
                        'Please feel free to contact us with any inquiries or suggestions. We will continue to develop into a more convenient service by reflecting user feedback.'
                      }
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <i className="ri-mail-line text-blue-500"></i>
                      <span className="font-mono text-blue-600">contact@toolhub.tools</span>
                      <Link href="/contact">
                        <button className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
                          {currentLang === 'ko' ? '문의하기' : 
                           currentLang === 'ja' ? 'お問い合わせ' : 
                           'Contact'}
                        </button>
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-time-line text-green-500"></i>
                      <span>
                        {currentLang === 'ko' ? '응답 시간: 영업일 기준 24시간 이내' : 
                         currentLang === 'ja' ? '応答時間：営業日基準24時間以内' : 
                         'Response Time: Within 24 hours on business days'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">
                    {currentLang === 'ko' ? '지원 정책' : 
                     currentLang === 'ja' ? 'サポートポリシー' : 
                     'Support Policy'}
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <i className="ri-check-line text-green-500"></i>
                      {currentLang === 'ko' ? '무료 기술 지원: 모든 사용자에게 무료로 기술 지원 제공' : 
                       currentLang === 'ja' ? '無料技術サポート：全てのユーザーに無料で技術サポート提供' : 
                       'Free Technical Support: Free technical support for all users'}
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ri-check-line text-green-500"></i>
                      {currentLang === 'ko' ? '접근성 지원: 장애인을 위한 웹 접근성 개선 지속' : 
                       currentLang === 'ja' ? 'アクセシビリティサポート：障害者のためのウェブアクセシビリティ改善継続' : 
                       'Accessibility Support: Continued web accessibility improvements for disabled users'}
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ri-check-line text-green-500"></i>
                      {currentLang === 'ko' ? '다국어 지원: 한국어, 영어, 일본어로 고객 지원 제공' : 
                       currentLang === 'ja' ? '多言語サポート：韓国語、英語、日本語でカスタマーサポート提供' : 
                       'Multilingual Support: Customer support in Korean, English, and Japanese'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="text-center bg-primary/5 rounded-xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                {currentLang === 'ko' ? 
                  'ToolHub.tools와 함께 더욱 효율적이고 편리한 디지털 라이프를 경험해보세요!' :
                 currentLang === 'ja' ? 
                  'ToolHub.toolsで、より効率的で便利なデジタルライフを体験してください！' :
                  'Experience a more efficient and convenient digital life with ToolHub.tools!'
                }
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                {currentLang === 'ko' ? 
                  '지금 바로 아래에서 원하는 도구를 선택하여 사용해보세요. 설치나 가입 없이 즉시 시작할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '今すぐ下から希望するツールを選択して使用してみてください。インストールや登録なしで即座に開始できます。' :
                  'Choose and try the tool you want right below. You can start immediately without installation or registration.'
                }
              </p>
              <div className="flex justify-center">
                <div className="animate-bounce">
                  <i className="ri-arrow-down-line text-primary text-3xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div id="tools-section" className="mb-10 md:mb-12 px-4">
        <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">{t('home.availableTools')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">

          {/* Pomodoro Timer Card */}
          <Link href="/pomodoro">
            <div className="group tool-card bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] md:hover:scale-105 border border-border/50 hover:border-red-500/30 active:scale-[0.98]">
              <div className="h-32 md:h-40 bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>
                <i className="ri-timer-line text-white text-4xl md:text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg md:text-xl leading-tight">{t('tools.pomodoro.title')}</h3>
                  <Badge variant="default" className="bg-red-500/10 text-red-600 text-xs flex-shrink-0 ml-2">
                    {t('common.available')}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  {t('tools.pomodoro.description')}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">{t('tools.pomodoro.tags.0')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.pomodoro.tags.1')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.pomodoro.tags.2')}</Badge>
                </div>
              </div>
            </div>
          </Link>

          {/* Timer Card */}
          <Link href="/timer">
            <div className="group tool-card bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] md:hover:scale-105 border border-border/50 hover:border-blue-500/30 active:scale-[0.98]">
              <div className="h-32 md:h-40 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
                <i className="ri-time-line text-white text-4xl md:text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg md:text-xl leading-tight">{t('tools.timer.title')}</h3>
                  <Badge variant="default" className="bg-blue-500/10 text-blue-600 text-xs flex-shrink-0 ml-2">
                    {t('common.available')}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  {t('tools.timer.description')}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">{t('tools.timer.tags.0')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.timer.tags.1')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.timer.tags.2')}</Badge>
                </div>
              </div>
            </div>
          </Link>
          {/* Number Raffle Card */}
          <Link href="/raffle">
            <div className="group tool-card bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 h-full">
              <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 h-24 md:h-32 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <i className="ri-shuffle-line text-white text-4xl md:text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg md:text-xl leading-tight">{t('tools.raffle.title')}</h3>
                  <Badge variant="default" className="bg-primary/10 text-primary text-xs flex-shrink-0 ml-2">
                    {t('common.new')}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  {t('tools.raffle.description')}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">{t('tools.raffle.tags.0')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.raffle.tags.1')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.raffle.tags.2')}</Badge>
                </div>
              </div>
            </div>
          </Link>

          {/* YouTube Thumbnail Downloader Card */}
          <Link href="/thumbnail">
            <div className="group tool-card bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] md:hover:scale-105 border border-border/50 hover:border-red-500/30 active:scale-[0.98]">
              <div className="h-32 md:h-40 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>
                <i className="ri-image-line text-white text-4xl md:text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg md:text-xl leading-tight">{t('tools.thumbnail.title')}</h3>
                  <Badge variant="default" className="bg-red-500/10 text-red-600 text-xs flex-shrink-0 ml-2">
                    {t('common.new')}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  {t('tools.thumbnail.description')}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">{t('tools.thumbnail.tags.0')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.thumbnail.tags.1')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.thumbnail.tags.2')}</Badge>
                </div>
              </div>
            </div>
          </Link>

          {/* Password Generator */}
          <Link href="/password">
            <div className="group tool-card bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] md:hover:scale-105 border border-border/50 hover:border-orange-500/30 active:scale-[0.98]">
              <div className="h-32 md:h-40 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent"></div>
                <i className="ri-shield-keyhole-line text-white text-4xl md:text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg md:text-xl leading-tight">{t('tools.passwordGenerator.title')}</h3>
                  <Badge variant="default" className="bg-orange-500/10 text-orange-600 text-xs flex-shrink-0 ml-2">
                    {t('common.available')}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  {t('tools.passwordGenerator.description')}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">{t('tools.passwordGenerator.tags.0')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.passwordGenerator.tags.1')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.passwordGenerator.tags.2')}</Badge>
                </div>
              </div>
            </div>
          </Link>

          {/* Unit Converter */}
          <Link href="/converter">
            <div className="group tool-card bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] md:hover:scale-105 border border-border/50 hover:border-blue-500/30 active:scale-[0.98]">
              <div className="h-32 md:h-40 bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
                <i className="ri-scales-3-line text-white text-4xl md:text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg md:text-xl leading-tight">{t('tools.unitConverter.title')}</h3>
                  <Badge variant="default" className="bg-blue-500/10 text-blue-600 text-xs flex-shrink-0 ml-2">
                    {t('common.available')}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  {t('tools.unitConverter.description')}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">{t('tools.unitConverter.tags.0')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.unitConverter.tags.1')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.unitConverter.tags.2')}</Badge>
                </div>
              </div>
            </div>
          </Link>

          {/* Date Calculator */}
          <Link href="/date-calculator">
            <div className="group tool-card bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] md:hover:scale-105 border border-border/50 hover:border-green-500/30 active:scale-[0.98]">
              <div className="h-32 md:h-40 bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent"></div>
                <i className="ri-calendar-line text-white text-4xl md:text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg md:text-xl leading-tight">{t('tools.dateCalculator.title')}</h3>
                  <Badge variant="default" className="bg-green-500/10 text-green-600 text-xs flex-shrink-0 ml-2">
                    {t('common.available')}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  {t('tools.dateCalculator.description')}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">{t('tools.dateCalculator.tags.0')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.dateCalculator.tags.1')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.dateCalculator.tags.2')}</Badge>
                </div>
              </div>
            </div>
          </Link>

          {/* MBTI Test */}
          <Link href="/mbti">
            <div className="group tool-card bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] md:hover:scale-105 border border-border/50 hover:border-purple-500/30 active:scale-[0.98]">
              <div className="h-32 md:h-40 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent"></div>
                <i className="ri-user-heart-line text-white text-4xl md:text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg md:text-xl leading-tight">{t('tools.mbti.title')}</h3>
                  <Badge variant="default" className="bg-purple-500/10 text-purple-600 text-xs flex-shrink-0 ml-2">
                    {t('common.available')}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  {t('tools.mbti.description')}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">{t('tools.mbti.tags.0')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.mbti.tags.1')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.mbti.tags.2')}</Badge>
                </div>
              </div>
            </div>
          </Link>

          {/* Teto-Egen Test */}
          <Link href="/teto-egen-test">
            <div className="group tool-card bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] md:hover:scale-105 border border-border/50 hover:border-pink-500/30 active:scale-[0.98] relative">
              <div className="h-32 md:h-40 bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent"></div>
                <div className="text-white text-4xl md:text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300">🔥</div>
                <Badge className="absolute top-2 right-2 bg-red-500 text-white animate-pulse text-xs">HOT</Badge>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg md:text-xl leading-tight">{t('tools.tetoEgen.title')}</h3>
                  <Badge variant="default" className="bg-pink-500/10 text-pink-600 text-xs flex-shrink-0 ml-2">
                    {t('common.new')}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  {t('tools.tetoEgen.description')}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">{t('tools.tetoEgen.tags.0')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.tetoEgen.tags.1')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.tetoEgen.tags.2')}</Badge>
                </div>
              </div>
            </div>
          </Link>

          
        </div>
      </div>

      

      {/* AdSense Banner */}
      <div className="mt-8 mx-4">
        <AdSense 
          adSlot="1234567890"
          style={{ display: 'block', textAlign: 'center', minHeight: '250px' }}
          className="rounded-lg"
        />
      </div>
      
      {/* About Section */}
      <Card className="mt-8 md:mt-16 mx-4">
        <CardContent className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-foreground">
              <strong>{t('home.aboutTitle')}</strong>
            </h3>
            <p className="text-lg text-foreground font-medium mb-4">
              {t('home.aboutIntro')}
            </p>
            <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-2xl mx-auto leading-relaxed">
              {t('home.aboutSubtitle')}
            </p>
          </div>
          
          <div className="mb-8">
            <h4 className="text-lg font-bold mb-4 text-center text-foreground">
              <strong>{t('home.coreFeatures')}</strong>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-money-dollar-circle-line text-green-600 text-xl"></i>
                </div>
                <div className="text-sm">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <i className="ri-check-line text-green-500 text-sm"></i>
                    <span className="font-semibold text-foreground">{t('home.features.completelyFree')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('home.features.noHiddenCosts')}</p>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-download-line text-blue-600 text-xl"></i>
                </div>
                <div className="text-sm">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <i className="ri-check-line text-green-500 text-sm"></i>
                    <span className="font-semibold text-foreground">{t('home.features.noInstallation')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('home.features.runDirectlyInBrowser')}</p>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-shield-check-line text-purple-600 text-xl"></i>
                </div>
                <div className="text-sm">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <i className="ri-check-line text-green-500 text-sm"></i>
                    <span className="font-semibold text-foreground">{t('home.features.privacyGuaranteed')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('home.features.dataStoredOnlyInBrowser')}</p>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-smartphone-line text-orange-600 text-xl"></i>
                </div>
                <div className="text-sm">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <i className="ri-check-line text-green-500 text-sm"></i>
                    <span className="font-semibold text-foreground">{t('home.features.allDevicesSupported')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('home.features.optimizedForMobileTabletDesktop')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              {t('home.feedbackMessage')}
            </p>
            <Link href="/contact">
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                {t('home.contact.button')}
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}