import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Zap, Shield, Globe, Heart, CheckCircle, ArrowRight, Clock, Calculator, Timer, Lock, Youtube, Palette, Shuffle, Calendar, QrCode, TestTube, Users, Cpu, Gauge, Eye, Languages, Smartphone } from "lucide-react";
import AdSense from "@/components/AdSense";
import SEOHead from "@/components/SEOHead";

export default function Home() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  
  return (
    <div>
      <SEOHead />
      
      {/* Hero Section */}
      <div className="text-center mb-16 md:mb-20 relative px-4 py-8 md:py-12">
        <div className="absolute -top-4 -left-4 w-16 h-16 md:w-24 md:h-24 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -right-8 w-20 h-20 md:w-32 md:h-32 bg-secondary/10 rounded-full blur-xl"></div>
        
        <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
          <Sparkles className="w-4 h-4 mr-2" />
          {currentLang === 'ko' ? '14가지 유용한 도구' : 
           currentLang === 'ja' ? '14の便利なツール' : 
           '14 Useful Tools'}
        </Badge>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
          ToolHub<span className="text-primary">.tools</span>
        </h1>
        
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-foreground px-2">
          {currentLang === 'ko' ? '누구나 쉽고 빠르게 사용할 수 있는' : 
           currentLang === 'ja' ? '誰でも簡単で迅速に使用できる' : 
           'Easy and fast tools for everyone'}
          <br />
          <span className="text-primary">
            {currentLang === 'ko' ? '웹 기반 유틸리티 도구 모음' : 
             currentLang === 'ja' ? 'ウェブベースユーティリティツール集' : 
             'Web-based utility toolkit'}
          </span>
        </h2>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed px-2">
          {currentLang === 'ko' ? 
            '설치나 회원가입 없이 브라우저에서 바로 실행 가능한 무료 도구들을 통해 사용자 여러분의 생산성과 편의성을 높이는 것이 ToolHub.tools의 궁극적인 목표입니다.' :
           currentLang === 'ja' ? 
            'インストールや会員登録なしにブラウザで即座に実行可能な無料ツールを通じて、ユーザーの皆様の生産性と利便性を向上させることがToolHub.toolsの最終目標です。' :
            'Our ultimate goal is to enhance your productivity and convenience through free tools that can be executed directly in your browser without installation or registration.'
          }
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            {currentLang === 'ko' ? '즉시 사용 가능' : 
             currentLang === 'ja' ? '即座に使用可能' : 
             'Instant Access'}
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-secondary" />
            {currentLang === 'ko' ? '100% 무료' : 
             currentLang === 'ja' ? '100% 無料' : 
             '100% Free'}
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" />
            {currentLang === 'ko' ? '다국어 지원' : 
             currentLang === 'ja' ? '多言語対応' : 
             'Multi-language'}
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            {currentLang === 'ko' ? '보안 보장' : 
             currentLang === 'ja' ? 'セキュリティ保証' : 
             'Secure'}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-3" asChild>
            <Link href="#tools">
              <ArrowRight className="w-5 h-5 mr-2" />
              {currentLang === 'ko' ? '도구 둘러보기' : 
               currentLang === 'ja' ? 'ツールを見る' : 
               'Explore Tools'}
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-3" asChild>
            <Link href="/contact">
              <Heart className="w-5 h-5 mr-2" />
              {currentLang === 'ko' ? '문의하기' : 
               currentLang === 'ja' ? 'お問い合わせ' : 
               'Contact Us'}
            </Link>
          </Button>
        </div>
      </div>

      {/* Service Introduction Section */}
      <div className="mb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {currentLang === 'ko' ? 'ToolHub.tools 서비스 소개' : 
               currentLang === 'ja' ? 'ToolHub.tools サービス紹介' : 
               'About ToolHub.tools'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
              {currentLang === 'ko' ? 
                '복잡한 도구는 이제 그만, 간단하고 효과적인 웹 도구로 모든 사람의 일상을 편리하게' :
               currentLang === 'ja' ? 
                '複雑なツールはもう不要、シンプルで効果的なウェブツールで全ての人の日常を便利に' :
                'No more complex tools - making everyone\'s daily life convenient with simple and effective web tools'
              }
            </p>
            
            {/* Detailed Service Overview */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 mb-12 border border-primary/10">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                {currentLang === 'ko' ? '서비스 개요' : 
                 currentLang === 'ja' ? 'サービス概要' : 
                 'Service Overview'}
              </h3>
              <div className="text-left space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  {currentLang === 'ko' ? 
                    'ToolHub.tools는 누구나 쉽고 빠르게 사용할 수 있는 웹 기반 유틸리티 도구 모음입니다. 계산기, 포모도로 타이머, 번호 추첨기, 유튜브 썸네일 다운로더, 비밀번호 생성기, 단위 변환기 등 일상과 업무에 유용한 14가지 도구를 하나의 웹사이트에서 제공합니다.' :
                   currentLang === 'ja' ? 
                    'ToolHub.toolsは誰でも簡単で迅速に使用できるウェブベースユーティリティツール集です。計算機、ポモドーロタイマー、番号抽選器、YouTubeサムネイルダウンローダー、パスワード生成器、単位変換器など日常と業務に有用な14のツールを一つのウェブサイトで提供します。' :
                    'ToolHub.tools is a collection of web-based utility tools that anyone can use easily and quickly. We provide 14 useful tools for daily life and work in one website, including calculators, Pomodoro timers, number raffles, YouTube thumbnail downloaders, password generators, unit converters, and more.'
                  }
                </p>
                <p className="text-lg">
                  {currentLang === 'ko' ? 
                    '설치나 회원가입 없이 브라우저에서 바로 실행 가능한 무료 도구들을 통해 사용자 여러분의 생산성과 편의성을 높이는 것이 ToolHub.tools의 궁극적인 목표입니다.' :
                   currentLang === 'ja' ? 
                    'インストールや会員登録なしにブラウザで即座に実行可能な無料ツールを通じて、ユーザーの皆様の生産性と利便性を向上させることがToolHub.toolsの最終目標です。' :
                    'Our ultimate goal is to enhance your productivity and convenience through free tools that can be executed directly in your browser without installation or registration.'
                  }
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-foreground flex items-center">
                      <Heart className="w-6 h-6 text-primary mr-3" />
                      {currentLang === 'ko' ? '현대인들의 고민 해결' : 
                       currentLang === 'ja' ? '現代人の悩み解決' : 
                       'Solving Modern Challenges'}
                    </h4>
                    <p className="text-base">
                      {currentLang === 'ko' ? 
                        '현대인들은 다양한 계산, 시간 관리, 변환 작업 등을 위해 여러 애플리케이션을 설치하고 관리해야 하는 번거로움을 겪고 있습니다. 각각의 작은 작업을 위해 별도의 앱을 찾고 설치하는 것은 시간 낭비이며, 저장 공간도 차지합니다.' :
                       currentLang === 'ja' ? 
                        '現代人は様々な計算、時間管理、変換作業などのために複数のアプリケーションをインストールし管理しなければならない煩わしさを経験しています。それぞれの小さな作業のために別途のアプリを探してインストールすることは時間の無駄であり、ストレージスペースも占有します。' :
                        'Modern people experience the hassle of having to install and manage multiple applications for various calculations, time management, and conversion tasks. Finding and installing separate apps for each small task is a waste of time and takes up storage space.'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-foreground flex items-center">
                      <Zap className="w-6 h-6 text-secondary mr-3" />
                      {currentLang === 'ko' ? '즉시 사용 가능한 해결책' : 
                       currentLang === 'ja' ? '即座に使用可能なソリューション' : 
                       'Instant Solution'}
                    </h4>
                    <p className="text-base">
                      {currentLang === 'ko' ? 
                        'ToolHub.tools는 이러한 불편함을 해결하고, 언제 어디서나 브라우저만으로 필요한 도구를 즉시 사용할 수 있는 환경을 제공합니다. 북마크 하나로 모든 유틸리티에 접근할 수 있으며, 업데이트나 설치 걱정도 없습니다.' :
                       currentLang === 'ja' ? 
                        'ToolHub.toolsはこのような不便さを解決し、いつでもどこでもブラウザだけで必要なツールを即座に使用できる環境を提供します。ブックマーク一つで全てのユーティリティにアクセスでき、アップデートやインストールの心配もありません。' :
                        'ToolHub.tools solves these inconveniences by providing an environment where you can instantly use the tools you need with just a browser, anytime, anywhere. Access all utilities with a single bookmark, without worrying about updates or installations.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Mission Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {currentLang === 'ko' ? '우리의 미션' : 
                       currentLang === 'ja' ? '私たちのミッション' : 
                       'Our Mission'}
                    </h3>
                    <p className="text-primary font-semibold">
                      {currentLang === 'ko' ? '복잡한 도구는 이제 그만!' : 
                       currentLang === 'ja' ? '複雑なツールはもう終わり！' : 
                       'No more complex tools!'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="text-lg font-medium text-foreground">
                    {currentLang === 'ko' ? '"간단하고 효과적인 웹 도구로 모든 사람의 일상을 편리하게"' : 
                     currentLang === 'ja' ? '"シンプルで効果的なウェブツールで全ての人の日常を便利に"' : 
                     '"Making everyone\'s daily life convenient with simple and effective web tools"'}
                  </p>
                  <p>
                    {currentLang === 'ko' ? 
                      '현대인들은 계산, 시간 관리, 변환 작업을 위해 여러 애플리케이션을 설치하고 관리해야 하는 번거로움을 겪고 있습니다. 각각의 작은 작업을 위해 별도의 앱을 찾고 설치하는 것은 시간 낭비이며, 저장 공간과 시스템 자원을 불필요하게 소모합니다.' :
                     currentLang === 'ja' ? 
                      '現代人は計算、時間管理、変換作業のために複数のアプリケーションをインストールし管理しなければならない煩わしさを経験しています。それぞれの小さな作業のために別途のアプリを探してインストールすることは時間の無駄であり、ストレージスペースとシステムリソースを不必要に消耗します。' :
                      'Modern people experience the hassle of having to install and manage multiple applications for calculations, time management, and conversion tasks. Finding and installing separate apps for each small task is a waste of time and unnecessarily consumes storage space and system resources.'
                    }
                  </p>
                  <p>
                    {currentLang === 'ko' ? 
                      'ToolHub.tools는 이러한 불편함을 근본적으로 해결하여, 언제 어디서나 브라우저만으로 필요한 모든 도구를 즉시 사용할 수 있는 통합 환경을 제공합니다.' :
                     currentLang === 'ja' ? 
                      'ToolHub.toolsはこのような不便さを根本的に解決し、いつでもどこでもブラウザだけで必要な全てのツールを即座に使用できる統合環境を提供します。' :
                      'ToolHub.tools fundamentally solves these inconveniences by providing an integrated environment where you can instantly use all the tools you need with just a browser, anytime, anywhere.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vision Card */}
            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mr-4">
                    <Eye className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {currentLang === 'ko' ? '우리의 비전' : 
                       currentLang === 'ja' ? '私たちのビジョン' : 
                       'Our Vision'}
                    </h3>
                    <p className="text-secondary font-semibold">
                      {currentLang === 'ko' ? '웹 유틸리티의 새로운 표준' : 
                       currentLang === 'ja' ? 'ウェブユーティリティの新基準' : 
                       'New standard for web utilities'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    {currentLang === 'ko' ? 
                      '앞으로 더 많은 유용한 도구들을 지속적으로 추가하여 사용자들의 디지털 라이프를 더욱 편리하고 효율적으로 만들어가겠습니다. 단순한 도구 제공을 넘어서 사용자의 일상을 혁신하는 플랫폼이 되고자 합니다.' :
                     currentLang === 'ja' ? 
                      '今後さらに多くの有用なツールを継続的に追加し、ユーザーのデジタルライフをより便利で効率的にしていきます。単純なツール提供を超えて、ユーザーの日常を革新するプラットフォームになりたいと思います。' :
                      'We will continue to add more useful tools to make users\' digital lives more convenient and efficient. We aim to become a platform that revolutionizes users\' daily lives beyond simply providing tools.'
                    }
                  </p>
                  <p>
                    {currentLang === 'ko' ? 
                      '인공지능 기반 도구, 더욱 정교한 계산기, 고급 시간 관리 도구, 창의적 디자인 도구 등 혁신적인 기능들을 통해 웹 기반 유틸리티의 새로운 표준을 제시하고자 합니다.' :
                     currentLang === 'ja' ? 
                      '人工知能基盤ツール、より精密な計算機、高級時間管理ツール、創造的デザインツールなど革新的な機能を通じて、ウェブベースユーティリティの新しい標準を提示したいと思います。' :
                      'We aim to set new standards for web-based utilities through innovative features such as AI-based tools, more sophisticated calculators, advanced time management tools, and creative design tools.'
                    }
                  </p>
                  <p>
                    {currentLang === 'ko' ? 
                      '전 세계 사용자들이 언어와 문화의 장벽 없이 동일한 품질의 서비스를 경험할 수 있도록 하며, 접근성과 포용성을 최우선으로 하는 글로벌 플랫폼으로 성장해 나가겠습니다.' :
                     currentLang === 'ja' ? 
                      '世界中のユーザーが言語と文化の障壁なく同じ品質のサービスを体験できるようにし、アクセシビリティと包容性を最優先とするグローバルプラットフォームとして成長していきます。' :
                      'We will grow as a global platform that prioritizes accessibility and inclusivity, enabling users worldwide to experience the same quality of service without language and cultural barriers.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Core Values Section */}
          <div className="mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
              {currentLang === 'ko' ? '핵심 가치와 원칙' : 
               currentLang === 'ja' ? '核心価値と原則' : 
               'Core Values & Principles'}
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Shield className="w-8 h-8 text-accent mr-4" />
                    <h4 className="text-xl font-bold">
                      {currentLang === 'ko' ? '1. 완전 무료 서비스' : 
                       currentLang === 'ja' ? '1. 完全無料サービス' : 
                       '1. Completely Free Service'}
                    </h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentLang === 'ko' ? 
                      '모든 도구는 영구적으로 무료로 제공됩니다. 숨겨진 비용이나 프리미엄 플랜은 존재하지 않으며, 모든 사용자가 동등하게 모든 기능을 이용할 수 있습니다. 광고나 구독료 없이도 지속 가능한 서비스를 제공하는 것이 우리의 약속입니다.' :
                     currentLang === 'ja' ? 
                      '全てのツールは永続的に無料で提供されます。隠れた費用やプレミアムプランは存在せず、全てのユーザーが平等に全ての機能をご利用いただけます。広告や購読料なしでも持続可能なサービスを提供することが私たちの約束です。' :
                      'All tools are provided permanently free. There are no hidden costs or premium plans, and all users can equally use all features. Our promise is to provide sustainable service without ads or subscription fees.'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/10 dark:to-green-800/10 dark:border-green-800/30">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Shield className="w-8 h-8 text-green-600 mr-4" />
                    <h4 className="text-xl font-bold">
                      {currentLang === 'ko' ? '2. 보안과 프라이버시 최우선' : 
                       currentLang === 'ja' ? '2. セキュリティとプライバシー最優先' : 
                       '2. Security & Privacy First'}
                    </h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentLang === 'ko' ? 
                      '사용자의 개인정보 보호를 최우선으로 합니다. 모든 데이터는 사용자의 브라우저에만 저장되며, 외부 서버로 전송되지 않아 완전한 프라이버시를 보장합니다. 계산 결과, 생성된 비밀번호, 개인 정보 등 어떠한 데이터도 수집하거나 저장하지 않습니다.' :
                     currentLang === 'ja' ? 
                      'ユーザーの個人情報保護を最優先とします。全てのデータはユーザーのブラウザにのみ保存され、外部サーバーに送信されないため完全なプライバシーを保証します。計算結果、生成されたパスワード、個人情報など、いかなるデータも収集・保存いたしません。' :
                      'We prioritize user privacy protection above all. All data is stored only in the user\'s browser and is never transmitted to external servers, ensuring complete privacy. We do not collect or store any data including calculation results, generated passwords, or personal information.'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/10 dark:to-blue-800/10 dark:border-blue-800/30">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Globe className="w-8 h-8 text-blue-600 mr-4" />
                    <h4 className="text-xl font-bold">
                      {currentLang === 'ko' ? '3. 접근성과 포용성' : 
                       currentLang === 'ja' ? '3. アクセシビリティと包容性' : 
                       '3. Accessibility & Inclusivity'}
                    </h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentLang === 'ko' ? 
                      '한국어, 영어, 일본어를 지원하며, 향후 더 많은 언어를 추가할 예정입니다. 모바일과 데스크톱 모든 환경에서 최적화된 반응형 디자인을 통해 언제 어디서나 편리하게 사용할 수 있습니다. 시각 장애인을 위한 스크린 리더 호환성도 고려하여 개발하고 있습니다.' :
                     currentLang === 'ja' ? 
                      '韓国語、英語、日本語をサポートし、今後さらに多くの言語を追加予定です。モバイルとデスクトップ全ての環境で最適化されたレスポンシブデザインを通じて、いつでもどこでも便利にご利用いただけます。視覚障害者のためのスクリーンリーダー互換性も考慮して開発しています。' :
                      'We support Korean, English, and Japanese, with plans to add more languages. Through responsive design optimized for all mobile and desktop environments, you can use it conveniently anytime, anywhere. We also develop with screen reader compatibility for visually impaired users in mind.'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/10 dark:to-purple-800/10 dark:border-purple-800/30">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Heart className="w-8 h-8 text-purple-600 mr-4" />
                    <h4 className="text-xl font-bold">
                      {currentLang === 'ko' ? '4. 사용자 중심 디자인' : 
                       currentLang === 'ja' ? '4. ユーザー中心デザイン' : 
                       '4. User-Centered Design'}
                    </h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentLang === 'ko' ? 
                      '복잡한 기능보다는 직관적이고 사용하기 쉬운 인터페이스를 추구합니다. 최소한의 클릭으로 원하는 결과를 얻을 수 있도록 UX/UI를 지속적으로 개선하고 있습니다. 사용자 피드백을 적극적으로 수렴하여 실제 필요에 맞는 기능을 개발합니다.' :
                     currentLang === 'ja' ? 
                      '複雑な機能よりは直感的で使いやすいインターフェースを追求します。最小限のクリックで望む結果を得られるようUX/UIを継続的に改善しています。ユーザーフィードバックを積極的に収集し、実際のニーズに合った機能を開発します。' :
                      'We pursue intuitive and easy-to-use interfaces rather than complex features. We continuously improve UX/UI so that desired results can be achieved with minimal clicks. We actively collect user feedback to develop features that meet actual needs.'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {currentLang === 'ko' ? '100% 무료' : 
                 currentLang === 'ja' ? '100% 無料' : 
                 '100% Free'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? '모든 도구를 영구적으로 무료 제공' : 
                 currentLang === 'ja' ? '全てのツールを永続的に無料提供' : 
                 'All tools permanently free'}
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {currentLang === 'ko' ? '보안 보장' : 
                 currentLang === 'ja' ? 'セキュリティ保証' : 
                 'Secure'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? '데이터는 브라우저에만 저장' : 
                 currentLang === 'ja' ? 'データはブラウザにのみ保存' : 
                 'Data stored only in browser'}
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {currentLang === 'ko' ? '모든 기기' : 
                 currentLang === 'ja' ? '全てのデバイス' : 
                 'All Devices'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 'PC, 모바일, 태블릿 최적화' : 
                 currentLang === 'ja' ? 'PC、モバイル、タブレット最適化' : 
                 'PC, mobile, tablet optimized'}
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Languages className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {currentLang === 'ko' ? '다국어 지원' : 
                 currentLang === 'ja' ? '多言語サポート' : 
                 'Multi-language'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? '한국어, 영어, 일본어 지원' : 
                 currentLang === 'ja' ? '韓国語、英語、日本語対応' : 
                 'Korean, English, Japanese'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Categories Section */}
      <div id="tools" className="mb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {currentLang === 'ko' ? '제공 서비스 소개' : 
               currentLang === 'ja' ? '提供サービス紹介' : 
               'Our Services'}
            </h2>
            <p className="text-xl text-muted-foreground">
              {currentLang === 'ko' ? '생산성부터 재미까지, 다양한 카테고리의 유용한 도구들' : 
               currentLang === 'ja' ? '生産性から楽しさまで、様々なカテゴリの便利なツール' : 
               'From productivity to fun, useful tools in various categories'}
            </p>
          </div>

          {/* Productivity Tools */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Gauge className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">
                {currentLang === 'ko' ? '생산성 도구' : 
                 currentLang === 'ja' ? '生産性ツール' : 
                 'Productivity Tools'}
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/calculator">
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700/30">
                  <CardContent className="p-6 text-center">
                    <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="font-bold mb-2">
                      {currentLang === 'ko' ? '고급 계산기' : 
                       currentLang === 'ja' ? '高級計算機' : 
                       'Advanced Calculator'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? '메모리 기능과 계산 기록이 포함된 전문 계산기' : 
                       currentLang === 'ja' ? 'メモリ機能と計算履歴が含まれた専門計算機' : 
                       'Professional calculator with memory and history'}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-700/30">
                <CardContent className="p-6 text-center">
                  <Timer className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h4 className="font-bold mb-2">
                    {currentLang === 'ko' ? '포모도로 타이머' : 
                     currentLang === 'ja' ? 'ポモドーロタイマー' : 
                     'Pomodoro Timer'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentLang === 'ko' ? '25분 집중 + 5분 휴식으로 생산성 극대화' : 
                     currentLang === 'ja' ? '25分集中+5分休憩で生産性最大化' : 
                     'Maximize productivity with 25min focus + 5min break'}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">
                    {currentLang === 'ko' ? '곧 출시 예정' : 
                     currentLang === 'ja' ? '近日リリース予定' : 
                     'Coming Soon'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20 dark:border-emerald-700/30">
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h4 className="font-bold mb-2">
                    {currentLang === 'ko' ? '범용 타이머' : 
                     currentLang === 'ja' ? '汎用タイマー' : 
                     'Universal Timer'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentLang === 'ko' ? '자유롭게 시간 설정이 가능한 맞춤형 타이머' : 
                     currentLang === 'ja' ? '自由に時間設定可能なカスタマイズタイマー' : 
                     'Customizable timer with flexible time settings'}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">
                    {currentLang === 'ko' ? '곧 출시 예정' : 
                     currentLang === 'ja' ? '近日リリース予定' : 
                     'Coming Soon'}
                  </p>
                </CardContent>
              </Card>

              <Link href="/date-calculator">
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700/30">
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h4 className="font-bold mb-2">
                      {currentLang === 'ko' ? '날짜 계산기' : 
                       currentLang === 'ja' ? '日付計算機' : 
                       'Date Calculator'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? '두 날짜 간의 차이 계산 및 날짜 연산' : 
                       currentLang === 'ja' ? '二つの日付間の差異計算および日付演算' : 
                       'Calculate date differences and date arithmetic'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Utility Tools */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4">
                <Cpu className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold">
                {currentLang === 'ko' ? '유틸리티 도구' : 
                 currentLang === 'ja' ? 'ユーティリティツール' : 
                 'Utility Tools'}
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-700/30">
                <CardContent className="p-6 text-center">
                  <Gauge className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h4 className="font-bold mb-2">
                    {currentLang === 'ko' ? '단위 변환기' : 
                     currentLang === 'ja' ? '単位変換器' : 
                     'Unit Converter'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentLang === 'ko' ? '길이, 무게, 온도, 부피 등 다양한 단위 변환' : 
                     currentLang === 'ja' ? '長さ、重さ、温度、体積など様々な単位変換' : 
                     'Convert length, weight, temperature, volume and more'}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">
                    {currentLang === 'ko' ? '곧 출시 예정' : 
                     currentLang === 'ja' ? '近日リリース予定' : 
                     'Coming Soon'}
                  </p>
                </CardContent>
              </Card>

              <Link href="/password-generator">
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700/30">
                  <CardContent className="p-6 text-center">
                    <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h4 className="font-bold mb-2">
                      {currentLang === 'ko' ? '비밀번호 생성기' : 
                       currentLang === 'ja' ? 'パスワード生成器' : 
                       'Password Generator'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? '보안성이 뛰어난 랜덤 비밀번호 생성' : 
                       currentLang === 'ja' ? 'セキュリティに優れたランダムパスワード生成' : 
                       'Generate secure random passwords'}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/number-raffle">
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 dark:from-pink-900/20 dark:to-pink-800/20 dark:border-pink-700/30">
                  <CardContent className="p-6 text-center">
                    <Shuffle className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                    <h4 className="font-bold mb-2">
                      {currentLang === 'ko' ? '번호 추첨기' : 
                       currentLang === 'ja' ? '番号抽選器' : 
                       'Number Raffle'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? '공정한 랜덤 번호 생성 및 추첨 도구' : 
                       currentLang === 'ja' ? '公正なランダム番号生成および抽選ツール' : 
                       'Fair random number generation and raffle tool'}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 dark:from-indigo-900/20 dark:to-indigo-800/20 dark:border-indigo-700/30">
                <CardContent className="p-6 text-center">
                  <QrCode className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                  <h4 className="font-bold mb-2">
                    {currentLang === 'ko' ? 'QR 코드 생성기' : 
                     currentLang === 'ja' ? 'QRコード生成器' : 
                     'QR Code Generator'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentLang === 'ko' ? '텍스트, URL을 QR 코드로 변환' : 
                     currentLang === 'ja' ? 'テキスト、URLをQRコードに変換' : 
                     'Convert text and URLs to QR codes'}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">
                    {currentLang === 'ko' ? '곧 출시 예정' : 
                     currentLang === 'ja' ? '近日リリース予定' : 
                     'Coming Soon'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Media & Fun Tools */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mr-4">
                <Palette className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">
                {currentLang === 'ko' ? '미디어 & 재미 도구' : 
                 currentLang === 'ja' ? 'メディア&楽しいツール' : 
                 'Media & Fun Tools'}
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-700/30">
                <CardContent className="p-6 text-center">
                  <Youtube className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h4 className="font-bold mb-2">
                    {currentLang === 'ko' ? '유튜브 썸네일 다운로더' : 
                     currentLang === 'ja' ? 'YouTube サムネイルダウンローダー' : 
                     'YouTube Thumbnail Downloader'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentLang === 'ko' ? '유튜브 영상의 썸네일 이미지를 고화질로 다운로드' : 
                     currentLang === 'ja' ? 'YouTube動画のサムネイル画像を高画質でダウンロード' : 
                     'Download YouTube video thumbnails in high quality'}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">
                    {currentLang === 'ko' ? '곧 출시 예정' : 
                     currentLang === 'ja' ? '近日リリース予定' : 
                     'Coming Soon'}
                  </p>
                </CardContent>
              </Card>

              <Link href="/mbti-test">
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 dark:from-cyan-900/20 dark:to-cyan-800/20 dark:border-cyan-700/30">
                  <CardContent className="p-6 text-center">
                    <TestTube className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                    <h4 className="font-bold mb-2">
                      {currentLang === 'ko' ? 'MBTI 성격유형 테스트' : 
                       currentLang === 'ja' ? 'MBTI性格タイプテスト' : 
                       'MBTI Personality Test'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? '16가지 성격유형 분석을 통한 자기 이해' : 
                       currentLang === 'ja' ? '16の性格タイプ分析による自己理解' : 
                       'Self-understanding through 16 personality type analysis'}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 dark:from-teal-900/20 dark:to-teal-800/20 dark:border-teal-700/30">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                  <h4 className="font-bold mb-2">
                    {currentLang === 'ko' ? '테토-에겐 테스트' : 
                     currentLang === 'ja' ? 'テト-エゲンテスト' : 
                     'Teto-Egen Test'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentLang === 'ko' ? '독창적인 성격 분석 및 궁합 테스트' : 
                     currentLang === 'ja' ? '独창적な性격分析および相性テスト' : 
                     'Creative personality analysis and compatibility test'}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">
                    {currentLang === 'ko' ? '곧 출시 예정' : 
                     currentLang === 'ja' ? '近日リリース予定' : 
                     'Coming Soon'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Features Section */}
      <div className="mb-20 px-4 bg-muted/30 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {currentLang === 'ko' ? '기술적 특징' : 
               currentLang === 'ja' ? '技術的特徴' : 
               'Technical Features'}
            </h2>
            <p className="text-xl text-muted-foreground">
              {currentLang === 'ko' ? '최신 웹 기술로 구현된 안정적이고 빠른 서비스' : 
               currentLang === 'ja' ? '最新ウェブ技術で実装された安定的で迅速なサービス' : 
               'Stable and fast service built with cutting-edge web technology'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Zap className="w-8 h-8 text-primary mr-4" />
                  <h3 className="text-xl font-bold">
                    {currentLang === 'ko' ? '빠른 로딩' : 
                     currentLang === 'ja' ? '高速ローディング' : 
                     'Fast Loading'}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? '최적화된 코드로 즉시 실행되며, 네트워크 연결 없이도 기본 기능을 사용할 수 있습니다.' : 
                   currentLang === 'ja' ? '最適化されたコードで即座に実行され、ネットワーク接続なしでも基本機能を使用できます。' : 
                   'Instant execution with optimized code, and basic functions work even without network connection.'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Globe className="w-8 h-8 text-secondary mr-4" />
                  <h3 className="text-xl font-bold">
                    {currentLang === 'ko' ? '크로스 플랫폼' : 
                     currentLang === 'ja' ? 'クロスプラットフォーム' : 
                     'Cross Platform'}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? '모든 주요 브라우저와 iOS, Android 터치 인터페이스를 완벽 지원합니다.' : 
                   currentLang === 'ja' ? '全ての主要ブラウザとiOS、Androidタッチインターフェースを完全サポートします。' : 
                   'Full support for all major browsers and iOS, Android touch interfaces.'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Shield className="w-8 h-8 text-green-500 mr-4" />
                  <h3 className="text-xl font-bold">
                    {currentLang === 'ko' ? '프라이버시 보호' : 
                     currentLang === 'ja' ? 'プライバシー保護' : 
                     'Privacy Protection'}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? '모든 데이터는 사용자의 브라우저에만 저장되며, 외부로 전송되지 않습니다.' : 
                   currentLang === 'ja' ? '全てのデータはユーザーのブラウザにのみ保存され、外部に送信されません。' : 
                   'All data is stored only in your browser and never transmitted externally.'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Languages className="w-8 h-8 text-purple-500 mr-4" />
                  <h3 className="text-xl font-bold">
                    {currentLang === 'ko' ? '다국어 지원' : 
                     currentLang === 'ja' ? '多言語サポート' : 
                     'Multi-language'}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? '한국어, 영어, 일본어를 지원하며, 향후 더 많은 언어를 추가할 예정입니다.' : 
                   currentLang === 'ja' ? '韓国語、英語、日本語をサポートし、今後さらに多くの言語を追加予定です。' : 
                   'Supports Korean, English, and Japanese, with more languages planned.'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-8 h-8 text-accent mr-4" />
                  <h3 className="text-xl font-bold">
                    {currentLang === 'ko' ? '정확성 검증' : 
                     currentLang === 'ja' ? '正確性検証' : 
                     'Accuracy Verified'}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? '모든 계산 도구는 다양한 테스트를 통해 정확성을 검증받았습니다.' : 
                   currentLang === 'ja' ? '全ての計算ツールは様々なテストを通じて正確性が検証されています。' : 
                   'All calculation tools have been verified for accuracy through extensive testing.'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Heart className="w-8 h-8 text-red-500 mr-4" />
                  <h3 className="text-xl font-bold">
                    {currentLang === 'ko' ? '사용자 중심' : 
                     currentLang === 'ja' ? 'ユーザー中心' : 
                     'User Centered'}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? '직관적이고 사용하기 쉬운 인터페이스로 최소한의 클릭으로 원하는 결과를 얻을 수 있습니다.' : 
                   currentLang === 'ja' ? '直感的で使いやすいインターフェースで最小限のクリックで望む結果を得ることができます。' : 
                   'Get desired results with minimal clicks through intuitive and easy-to-use interface.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {currentLang === 'ko' ? '문의 및 지원' : 
             currentLang === 'ja' ? 'お問い合わせとサポート' : 
             'Contact & Support'}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {currentLang === 'ko' ? '문의나 제안이 있으시면 언제든지 연락해주세요' : 
             currentLang === 'ja' ? 'ご質問やご提案がございましたら、いつでもお気軽にお問い合わせください' : 
             'Feel free to contact us anytime with questions or suggestions'}
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">
                  {currentLang === 'ko' ? '무료 기술 지원' : 
                   currentLang === 'ja' ? '無料技術サポート' : 
                   'Free Tech Support'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '모든 사용자에게 무료 기술 지원 제공' : 
                   currentLang === 'ja' ? '全てのユーザーに無料技術サポート提供' : 
                   'Free technical support for all users'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-bold mb-2">
                  {currentLang === 'ko' ? '24시간 이내 응답' : 
                   currentLang === 'ja' ? '24時間以内の返答' : 
                   '24h Response Time'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '영업일 기준 24시간 이내 답변' : 
                   currentLang === 'ja' ? '営業日基準24時間以内回答' : 
                   'Response within 24 hours on business days'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Languages className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-bold mb-2">
                  {currentLang === 'ko' ? '다국어 지원' : 
                   currentLang === 'ja' ? '多言語サポート' : 
                   'Multi-language Support'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '한국어, 영어, 일본어로 고객 지원' : 
                   currentLang === 'ja' ? '韓国語、英語、日本語で顧客サポート' : 
                   'Customer support in Korean, English, Japanese'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Button size="lg" className="text-lg px-8 py-3" asChild>
            <Link href="/contact">
              <Heart className="w-5 h-5 mr-2" />
              {currentLang === 'ko' ? '문의하기' : 
               currentLang === 'ja' ? 'お問い合わせ' : 
               'Contact Us'}
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-border">
        <p className="text-muted-foreground mb-4">
          {currentLang === 'ko' ? '© 2025 ToolHub.tools. 모든 권리 보유.' : 
           currentLang === 'ja' ? '© 2025 ToolHub.tools. 全ての権利保有。' : 
           '© 2025 ToolHub.tools. All rights reserved.'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
            {currentLang === 'ko' ? '개인정보 처리방침' : 
             currentLang === 'ja' ? 'プライバシーポリシー' : 
             'Privacy Policy'}
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
            {currentLang === 'ko' ? '이용약관' : 
             currentLang === 'ja' ? '利用規約' : 
             'Terms of Service'}
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
            {currentLang === 'ko' ? '문의하기' : 
             currentLang === 'ja' ? 'お問い合わせ' : 
             'Contact'}
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/sitemap" className="text-muted-foreground hover:text-primary transition-colors">
            {currentLang === 'ko' ? '사이트맵' : 
             currentLang === 'ja' ? 'サイトマップ' : 
             'Sitemap'}
          </Link>
        </div>
      </div>

      {/* AdSense */}
      <div className="mt-8">
        <AdSense 
          adSlot="1234567890"
          style={{ display: 'block', textAlign: 'center' }}
        />
      </div>
    </div>
  );
}