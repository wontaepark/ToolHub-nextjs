import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Zap } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
        
        <Badge variant="secondary" className="mb-4 px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          새로운 도구들이 계속 추가됩니다
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          ToolHub<span className="text-primary">.io</span>
        </h1>
        
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">
          일상을 더 편리하게 만드는 <span className="text-primary">도구 모음</span>
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          계산기부터 포모도로 타이머까지, 생산성을 높이고 일상을 편리하게 만드는 
          다양한 웹 도구들을 한 곳에서 만나보세요. 모든 기기에서 빠르고 간편하게 사용할 수 있습니다.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            빠른 접근
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-secondary" />
            무료 사용
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            모든 기기 지원
          </div>
        </div>
      </div>
      
      {/* Tools Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-center mb-8">사용 가능한 도구들</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Calculator Card */}
          <Link href="/calculator">
            <div className="group tool-card bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 border border-border/50 hover:border-primary/30">
              <div className="h-40 gradient-bg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                <i className="ri-calculator-line text-white text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xl">계산기</h3>
                  <Badge variant="default" className="bg-primary/10 text-primary">
                    사용 가능
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  기본 사칙연산부터 고급 계산까지 지원하는 완전한 계산기입니다. 
                  키보드 단축키와 계산 히스토리 기능을 제공합니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">사칙연산</Badge>
                  <Badge variant="outline" className="text-xs">키보드 지원</Badge>
                  <Badge variant="outline" className="text-xs">히스토리</Badge>
                </div>
              </div>
            </div>
          </Link>
          
          {/* Pomodoro Timer Card */}
          <Link href="/pomodoro">
            <div className="group tool-card bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 border border-border/50 hover:border-red-500/30">
              <div className="h-40 bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>
                <i className="ri-timer-line text-white text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xl">포모도로 타이머</h3>
                  <Badge variant="default" className="bg-red-500/10 text-red-600">
                    사용 가능
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  25분 집중 + 5분 휴식의 포모도로 기법으로 생산성을 극대화하세요. 
                  할 일 관리와 진행률 시각화 기능을 제공합니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">25분 타이머</Badge>
                  <Badge variant="outline" className="text-xs">할 일 관리</Badge>
                  <Badge variant="outline" className="text-xs">진행률 표시</Badge>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-center mb-8">곧 출시될 도구들</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Unit Converter Card (Coming Soon) */}
          <div className="tool-card bg-card rounded-2xl shadow-lg overflow-hidden opacity-75 cursor-not-allowed border border-border/30">
            <div className="h-40 bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
              <i className="ri-scales-3-line text-muted-foreground text-6xl"></i>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-xl text-muted-foreground">단위 변환기</h3>
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  준비 중
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                길이, 무게, 온도 등 다양한 측정 단위 간 변환을 쉽고 빠르게 할 수 있습니다.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs opacity-50">길이 변환</Badge>
                <Badge variant="outline" className="text-xs opacity-50">무게 변환</Badge>
                <Badge variant="outline" className="text-xs opacity-50">온도 변환</Badge>
              </div>
            </div>
          </div>
          
          {/* Weather Card (Coming Soon) */}
          <div className="tool-card bg-card rounded-2xl shadow-lg overflow-hidden opacity-75 cursor-not-allowed border border-border/30">
            <div className="h-40 bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
              <i className="ri-sun-cloudy-line text-muted-foreground text-6xl"></i>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-xl text-muted-foreground">날씨 정보</h3>
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  준비 중
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                현재 날씨와 주간 일기예보를 한눈에 확인할 수 있는 날씨 도구입니다.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs opacity-50">현재 날씨</Badge>
                <Badge variant="outline" className="text-xs opacity-50">주간 예보</Badge>
                <Badge variant="outline" className="text-xs opacity-50">날씨 알림</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* About Section */}
      <Card className="mt-16">
        <CardContent className="p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">ToolHub.io에 대하여</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              ToolHub.io는 일상생활에 도움이 되는 실용적인 웹 도구들을 모아놓은 플랫폼입니다. 
              간단하고 빠르며 무료로 사용할 수 있는 유틸리티를 모든 기기에서 원활하게 제공하는 것이 우리의 목표입니다.
            </p>
            <p className="text-muted-foreground">
              새로운 도구들을 지속적으로 추가하고 있습니다. 제안이나 피드백이 있으시면 언제든 알려주세요!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}