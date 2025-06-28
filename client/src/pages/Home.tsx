import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Zap } from "lucide-react";
import AdSense from "@/components/AdSense";

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16 relative px-4">
        <div className="absolute -top-4 -left-4 w-16 h-16 md:w-24 md:h-24 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -right-8 w-20 h-20 md:w-32 md:h-32 bg-secondary/10 rounded-full blur-xl"></div>
        
        <Badge variant="secondary" className="mb-4 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm">
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
        <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border p-8 md:p-12 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            ToolHub.tools 소개
          </h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              ToolHub.tools는 일상생활과 업무에서 자주 사용하는 다양한 도구들을 한 곳에 모아놓은 
              종합 온라인 툴킷입니다. 복잡한 설치나 회원가입 없이 웹브라우저에서 바로 사용할 수 있는 
              실용적인 도구들을 제공합니다.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">🎯 우리의 목적</h3>
                <p>
                  사용자의 시간을 절약하고 일상의 불편함을 해소하기 위해 꼭 필요한 도구들을 
                  선별하여 제공합니다. 학생, 직장인, 개발자 등 모든 사용자가 쉽고 빠르게 
                  활용할 수 있도록 직관적인 인터페이스로 설계되었습니다.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">✨ 제공 서비스</h3>
                <ul className="space-y-2">
                  <li>• 계산기 및 단위 변환기</li>
                  <li>• 타이머 및 포모도로 생산성 도구</li>
                  <li>• 비밀번호 생성기 및 보안 도구</li>
                  <li>• 유튜브 썸네일 다운로더</li>
                  <li>• MBTI 성격 테스트</li>
                  <li>• 추첨 및 랜덤 생성 도구</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
              <h3 className="text-xl font-semibold mb-3 text-foreground">🌟 사용자 혜택</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-primary font-bold text-lg mb-2">100% 무료</div>
                  <p className="text-sm">모든 도구를 제한 없이 무료로 이용</p>
                </div>
                <div className="text-center">
                  <div className="text-primary font-bold text-lg mb-2">즉시 사용</div>
                  <p className="text-sm">설치나 가입 없이 바로 접속하여 사용</p>
                </div>
                <div className="text-center">
                  <div className="text-primary font-bold text-lg mb-2">모든 기기</div>
                  <p className="text-sm">PC, 모바일, 태블릿 어디서나 최적화</p>
                </div>
              </div>
            </div>
            
            <p className="text-center text-lg font-medium text-foreground">
              ToolHub.tools와 함께 더욱 효율적이고 편리한 디지털 라이프를 경험해보세요! 🚀
            </p>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="mb-10 md:mb-12 px-4">
        <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">{t('home.availableTools')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Calculator Card */}
          <Link href="/calculator">
            <div className="group tool-card bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] md:hover:scale-105 border border-border/50 hover:border-primary/30 active:scale-[0.98]">
              <div className="h-32 md:h-40 gradient-bg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                <i className="ri-calculator-line text-white text-4xl md:text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg md:text-xl leading-tight">{t('tools.calculator.title')}</h3>
                  <Badge variant="default" className="bg-primary/10 text-primary text-xs flex-shrink-0 ml-2">
                    {t('common.available')}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  {t('tools.calculator.description')}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">{t('tools.calculator.tags.0')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.calculator.tags.1')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('tools.calculator.tags.2')}</Badge>
                </div>
              </div>
            </div>
          </Link>
          
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

      {/* Coming Soon Section */}
      <div className="mb-12 md:mb-16 px-4">
        <div className="text-center mb-8">
          <h3 className="text-xl md:text-2xl font-bold mb-3">{t('home.nextWeekRelease')}</h3>
          <p className="text-sm md:text-base text-muted-foreground">{t('home.weeklyUpdates')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {/* QR Code Generator - Week 3 */}
          <div className="tool-card bg-card rounded-2xl shadow-lg overflow-hidden border border-purple-200 relative opacity-75">
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="outline" className="bg-purple-100 text-purple-600 text-xs">{t('common.week3')}</Badge>
            </div>
            <div className="h-24 md:h-32 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <i className="ri-qr-code-line text-white text-3xl md:text-5xl"></i>
            </div>
            <div className="p-3 md:p-4">
              <h4 className="font-bold text-sm md:text-base mb-2">{t('tools.qrGenerator.title')}</h4>
              <p className="text-xs md:text-sm text-muted-foreground mb-2">
                {t('tools.qrGenerator.description')}
              </p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">{t('tools.qrGenerator.tags.0')}</Badge>
                <Badge variant="outline" className="text-xs">{t('tools.qrGenerator.tags.1')}</Badge>
              </div>
            </div>
          </div>

          
        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs md:text-sm text-muted-foreground">
            📅 {t('home.regularUpdates')}
          </p>
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
            <h3 className="text-xl md:text-2xl font-bold mb-4">{t('home.aboutTitle')}</h3>
            <p className="text-muted-foreground text-sm md:text-base mb-4 md:mb-6 max-w-3xl mx-auto leading-relaxed">
              {t('home.aboutDescription')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-rocket-line text-blue-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold mb-2">{t('home.mission.title')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('home.mission.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-check-line text-green-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold mb-2">{t('home.security.title')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('home.security.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-global-line text-purple-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold mb-2">{t('home.accessibility.title')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('home.accessibility.description')}
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {t('home.contact.description')}
              </p>
              <Link href="/contact">
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                  {t('home.contact.button')}
                </button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}