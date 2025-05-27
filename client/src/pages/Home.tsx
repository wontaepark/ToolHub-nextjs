import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Zap } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16 relative px-4">
        <div className="absolute -top-4 -left-4 w-16 h-16 md:w-24 md:h-24 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -right-8 w-20 h-20 md:w-32 md:h-32 bg-secondary/10 rounded-full blur-xl"></div>
        
        <Badge variant="secondary" className="mb-4 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm">
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
          새로운 도구들이 계속 추가됩니다
        </Badge>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
          ToolHub<span className="text-primary">.io</span>
        </h1>
        
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-foreground px-2">
          일상을 더 편리하게 만드는 <span className="text-primary">도구 모음</span>
        </h2>
        
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl md:max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed px-2">
          계산기부터 포모도로 타이머까지, 생산성을 높이고 일상을 편리하게 만드는 
          다양한 웹 도구들을 한 곳에서 만나보세요. 모든 기기에서 빠르고 간편하게 사용할 수 있습니다.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            빠른 접근
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Star className="w-3 h-3 md:w-4 md:h-4 text-secondary" />
            무료 사용
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-accent" />
            모든 기기 지원
          </div>
        </div>
      </div>
      
      {/* Tools Section */}
      <div className="mb-10 md:mb-12 px-4">
        <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">사용 가능한 도구들</h3>
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
                  <h3 className="font-bold text-lg md:text-xl leading-tight">계산기</h3>
                  <Badge variant="default" className="bg-primary/10 text-primary text-xs flex-shrink-0 ml-2">
                    사용 가능
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  기본 사칙연산부터 고급 계산까지 지원하는 완전한 계산기입니다. 
                  키보드 단축키와 계산 히스토리 기능을 제공합니다.
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">사칙연산</Badge>
                  <Badge variant="outline" className="text-xs">키보드 지원</Badge>
                  <Badge variant="outline" className="text-xs">히스토리</Badge>
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
                  <h3 className="font-bold text-lg md:text-xl leading-tight">포모도로 타이머</h3>
                  <Badge variant="default" className="bg-red-500/10 text-red-600 text-xs flex-shrink-0 ml-2">
                    사용 가능
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  25분 집중 + 5분 휴식의 포모도로 기법으로 생산성을 극대화하세요. 
                  할 일 관리와 진행률 시각화 기능을 제공합니다.
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">25분 타이머</Badge>
                  <Badge variant="outline" className="text-xs">할 일 관리</Badge>
                  <Badge variant="outline" className="text-xs">진행률 표시</Badge>
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
                  <h3 className="font-bold text-lg md:text-xl leading-tight">범용 타이머</h3>
                  <Badge variant="default" className="bg-blue-500/10 text-blue-600 text-xs flex-shrink-0 ml-2">
                    사용 가능
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  원하는 시간을 자유롭게 설정할 수 있는 카운트다운 타이머입니다. 
                  요리, 운동, 휴식 등 다양한 용도로 활용하세요.
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">자유 설정</Badge>
                  <Badge variant="outline" className="text-xs">브라우저 알림</Badge>
                  <Badge variant="outline" className="text-xs">빠른 프리셋</Badge>
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
                  <h3 className="font-bold text-lg md:text-xl leading-tight">번호 추첨기</h3>
                  <Badge variant="default" className="bg-primary/10 text-primary text-xs flex-shrink-0 ml-2">
                    새로운
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                  공정하고 재미있는 번호 추첨을 위한 도구입니다. 
                  슬롯머신 애니메이션과 함께 시각적으로 즐거운 추첨 경험을 제공합니다.
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <Badge variant="outline" className="text-xs">슬롯머신 효과</Badge>
                  <Badge variant="outline" className="text-xs">중복 제거</Badge>
                  <Badge variant="outline" className="text-xs">추첨 기록</Badge>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="mb-12 md:mb-16 px-4">
        <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">곧 출시될 도구들</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Unit Converter Card (Coming Soon) */}
          <div className="tool-card bg-card rounded-2xl shadow-lg overflow-hidden opacity-75 cursor-not-allowed border border-border/30">
            <div className="h-32 md:h-40 bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
              <i className="ri-scales-3-line text-muted-foreground text-4xl md:text-6xl"></i>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg md:text-xl text-muted-foreground leading-tight">단위 변환기</h3>
                <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs flex-shrink-0 ml-2">
                  준비 중
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                길이, 무게, 온도 등 다양한 측정 단위 간 변환을 쉽고 빠르게 할 수 있습니다.
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                <Badge variant="outline" className="text-xs opacity-50">길이 변환</Badge>
                <Badge variant="outline" className="text-xs opacity-50">무게 변환</Badge>
                <Badge variant="outline" className="text-xs opacity-50">온도 변환</Badge>
              </div>
            </div>
          </div>
          
          {/* Weather Card (Coming Soon) */}
          <div className="tool-card bg-card rounded-2xl shadow-lg overflow-hidden opacity-75 cursor-not-allowed border border-border/30">
            <div className="h-32 md:h-40 bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
              <i className="ri-sun-cloudy-line text-muted-foreground text-4xl md:text-6xl"></i>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg md:text-xl text-muted-foreground leading-tight">날씨 정보</h3>
                <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs flex-shrink-0 ml-2">
                  준비 중
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                현재 날씨와 주간 일기예보를 한눈에 확인할 수 있는 날씨 도구입니다.
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                <Badge variant="outline" className="text-xs opacity-50">현재 날씨</Badge>
                <Badge variant="outline" className="text-xs opacity-50">주간 예보</Badge>
                <Badge variant="outline" className="text-xs opacity-50">날씨 알림</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* About Section */}
      <Card className="mt-8 md:mt-16 mx-4">
        <CardContent className="p-6 md:p-8">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4">ToolHub.io에 대하여</h3>
            <p className="text-muted-foreground text-sm md:text-base mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed">
              ToolHub.io는 일상생활에 도움이 되는 실용적인 웹 도구들을 모아놓은 플랫폼입니다. 
              간단하고 빠르며 무료로 사용할 수 있는 유틸리티를 모든 기기에서 원활하게 제공하는 것이 우리의 목표입니다.
            </p>
            <p className="text-muted-foreground text-sm md:text-base">
              새로운 도구들을 지속적으로 추가하고 있습니다. 제안이나 피드백이 있으시면 언제든 알려주세요!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}