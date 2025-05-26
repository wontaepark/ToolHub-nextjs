import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Your Essential <span className="text-primary">Toolkit</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Access a collection of useful tools designed to make your life easier. All in one place, always at your fingertips.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Calculator Card */}
        <Link href="/calculator">
          <div className="tool-card bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl cursor-pointer transition-all duration-300 hover:scale-105">
            <div className="h-32 gradient-bg flex items-center justify-center">
              <i className="ri-calculator-line text-white text-5xl"></i>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-2">계산기</h3>
              <p className="text-muted-foreground text-sm">기본 사칙연산과 고급 계산 기능을 제공합니다.</p>
            </div>
          </div>
        </Link>
        
        {/* Timer Card (Coming Soon) */}
        <div className="tool-card bg-card rounded-xl shadow-lg overflow-hidden opacity-80 cursor-not-allowed">
          <div className="h-32 bg-muted flex items-center justify-center">
            <i className="ri-timer-line text-muted-foreground text-5xl"></i>
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-lg mb-2">타이머</h3>
            <p className="text-muted-foreground text-sm mb-4">작업을 위한 타이머와 카운트다운을 설정합니다.</p>
            <div className="w-full py-2 px-4 bg-muted text-muted-foreground rounded-lg text-center">
              준비 중
            </div>
          </div>
        </div>
        
        {/* Unit Converter Card (Coming Soon) */}
        <div className="tool-card bg-card rounded-xl shadow-lg overflow-hidden opacity-80 cursor-not-allowed">
          <div className="h-32 bg-muted flex items-center justify-center">
            <i className="ri-scales-3-line text-muted-foreground text-5xl"></i>
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-lg mb-2">단위 변환기</h3>
            <p className="text-muted-foreground text-sm mb-4">다양한 측정 단위 간 변환을 제공합니다.</p>
            <div className="w-full py-2 px-4 bg-muted text-muted-foreground rounded-lg text-center">
              준비 중
            </div>
          </div>
        </div>
        
        {/* Weather Card (Coming Soon) */}
        <div className="tool-card bg-card rounded-xl shadow-lg overflow-hidden opacity-80 cursor-not-allowed">
          <div className="h-32 bg-muted flex items-center justify-center">
            <i className="ri-sun-cloudy-line text-muted-foreground text-5xl"></i>
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-lg mb-2">날씨</h3>
            <p className="text-muted-foreground text-sm mb-4">현재 날씨와 일기예보를 확인합니다.</p>
            <div className="w-full py-2 px-4 bg-muted text-muted-foreground rounded-lg text-center">
              준비 중
            </div>
          </div>
        </div>
      </div>
      
      <Card className="mt-16">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">About ToolHub.io</h3>
          <p className="text-card-foreground mb-4">
            ToolHub.io is a growing collection of practical web tools designed to help you with everyday tasks. 
            Our mission is to provide simple, fast, and free utilities that work seamlessly across all your devices.
          </p>
          <p className="text-card-foreground">
            We're constantly adding new tools to our collection. If you have any suggestions or feedback, we'd love to hear from you!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
