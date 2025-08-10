'use client';

import React, { useState, useEffect, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { AdBannerInline } from '@/components/AdBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Square, RotateCcw, Clock, Volume2, VolumeX, Settings } from 'lucide-react';
import { Timer, formatTime, SoundManager } from '@/utils/timer';
import { getRelatedTools } from '@/lib/tools';

type TimerState = 'idle' | 'running' | 'paused' | 'finished';

interface Preset {
  name: string;
  minutes: number;
  seconds: number;
  color: string;
  category: string;
}

const TIMER_PRESETS: Record<string, Preset[]> = {
  basic: [
    { name: '5분', minutes: 5, seconds: 0, color: 'bg-blue-500', category: '기본' },
    { name: '10분', minutes: 10, seconds: 0, color: 'bg-green-500', category: '기본' },
    { name: '15분', minutes: 15, seconds: 0, color: 'bg-orange-500', category: '기본' },
    { name: '30분', minutes: 30, seconds: 0, color: 'bg-purple-500', category: '기본' },
  ],
  workout: [
    { name: 'HIIT 라운드', minutes: 0, seconds: 30, color: 'bg-red-500', category: '운동' },
    { name: 'HIIT 휴식', minutes: 0, seconds: 10, color: 'bg-orange-500', category: '운동' },
    { name: '스트레칭', minutes: 5, seconds: 0, color: 'bg-green-500', category: '운동' },
    { name: '플랭크', minutes: 1, seconds: 0, color: 'bg-yellow-500', category: '운동' },
  ],
  cooking: [
    { name: '라면', minutes: 3, seconds: 0, color: 'bg-red-500', category: '요리' },
    { name: '계란 (반숙)', minutes: 6, seconds: 0, color: 'bg-yellow-500', category: '요리' },
    { name: '계란 (완숙)', minutes: 10, seconds: 0, color: 'bg-orange-500', category: '요리' },
    { name: '차 우리기', minutes: 3, seconds: 0, color: 'bg-green-500', category: '요리' },
  ],
  study: [
    { name: '집중 45분', minutes: 45, seconds: 0, color: 'bg-purple-500', category: '학습' },
    { name: '딥워크 90분', minutes: 90, seconds: 0, color: 'bg-indigo-500', category: '학습' },
    { name: '복습 20분', minutes: 20, seconds: 0, color: 'bg-blue-500', category: '학습' },
    { name: '휴식 15분', minutes: 15, seconds: 0, color: 'bg-green-500', category: '학습' },
  ],
};

export default function TimerPage() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const [initialTime, setInitialTime] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeCategory, setActiveCategory] = useState('basic');

  const timerRef = useRef<Timer | null>(null);
  const soundManagerRef = useRef<SoundManager | null>(null);

  // 관련 도구 가져오기
  const relatedTools = getRelatedTools('timer').map(tool => ({
    id: tool.id,
    name: tool.name.ko,
    emoji: tool.emoji,
    href: `/tools/${tool.id}`
  }));

  // 사운드 매니저 초기화
  useEffect(() => {
    soundManagerRef.current = new SoundManager();
  }, []);

  // localStorage에서 설정 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMinutes = localStorage.getItem('timer-minutes');
      const savedSeconds = localStorage.getItem('timer-seconds');
      const savedSoundEnabled = localStorage.getItem('timer-sound-enabled');
      
      if (savedMinutes) setMinutes(parseInt(savedMinutes));
      if (savedSeconds) setSeconds(parseInt(savedSeconds));
      if (savedSoundEnabled) setSoundEnabled(JSON.parse(savedSoundEnabled));
    }
  }, []);

  // 설정을 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer-minutes', minutes.toString());
      localStorage.setItem('timer-seconds', seconds.toString());
      localStorage.setItem('timer-sound-enabled', JSON.stringify(soundEnabled));
    }
  }, [minutes, seconds, soundEnabled]);

  // 타이머 시작
  const startTimer = () => {
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds <= 0) return;

    setInitialTime(totalSeconds);
    setTimeLeft(totalSeconds);
    setState('running');

    timerRef.current = new Timer(
      totalSeconds,
      (timerState) => {
        setTimeLeft(timerState.timeLeft);
      },
      () => {
        setState('finished');
        if (soundEnabled) {
          soundManagerRef.current?.playSuccessSound();
        }
      }
    );

    timerRef.current.start();
  };

  // 타이머 일시정지/재개
  const togglePause = () => {
    if (!timerRef.current) return;

    if (state === 'running') {
      timerRef.current.pause();
      setState('paused');
    } else if (state === 'paused') {
      timerRef.current.start();
      setState('running');
    }
  };

  // 타이머 정지
  const stopTimer = () => {
    if (timerRef.current) {
      timerRef.current.stop();
      timerRef.current = null;
    }
    setState('idle');
    setTimeLeft(0);
  };

  // 타이머 리셋
  const resetTimer = () => {
    stopTimer();
    setSelectedPreset(null);
  };

  // 프리셋 선택
  const selectPreset = (preset: Preset) => {
    setMinutes(preset.minutes);
    setSeconds(preset.seconds);
    setSelectedPreset(preset.name);
    if (state !== 'idle') {
      stopTimer();
    }
  };

  // 시간 입력 파싱
  const handleTimeInput = (input: string, type: 'minutes' | 'seconds') => {
    const value = parseInt(input) || 0;
    if (type === 'minutes') {
      setMinutes(Math.max(0, Math.min(999, value)));
    } else {
      setSeconds(Math.max(0, Math.min(59, value)));
    }
    setSelectedPreset(null);
  };

  // 진행률 계산
  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

  // 상태별 색상
  const getStateColor = () => {
    switch (state) {
      case 'running': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'finished': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <>
      
      <ToolLayout
        title="범용 타이머"
        description="사용자 지정 시간으로 설정 가능한 범용 타이머"
        category="productivity"
        relatedTools={relatedTools}
      >
        {/* 타이머 디스플레이 */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              {/* 시간 표시 */}
              <div className="mb-8">
                <div className={`text-6xl md:text-8xl font-mono font-bold ${getStateColor()}`}>
                  {state === 'idle' ? formatTime(minutes * 60 + seconds) : formatTime(timeLeft)}
                </div>
                <div className="text-lg text-gray-500 mt-2">
                  {state === 'idle' && '시작을 기다리고 있습니다'}
                  {state === 'running' && '타이머가 실행 중입니다'}
                  {state === 'paused' && '타이머가 일시정지되었습니다'}
                  {state === 'finished' && '시간이 완료되었습니다!'}
                </div>
              </div>

              {/* 진행률 바 */}
              {state !== 'idle' && (
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* 컨트롤 버튼 */}
              <div className="flex justify-center space-x-4">
                {state === 'idle' && (
                  <Button
                    onClick={startTimer}
                    disabled={minutes === 0 && seconds === 0}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    시작
                  </Button>
                )}
                
                {(state === 'running' || state === 'paused') && (
                  <>
                    <Button
                      onClick={togglePause}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3"
                    >
                      {state === 'running' ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          일시정지
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          재개
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={stopTimer}
                      variant="outline"
                      className="px-6 py-3"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      정지
                    </Button>
                  </>
                )}

                {state === 'finished' && (
                  <Button
                    onClick={resetTimer}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    새로 시작
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 시간 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                시간 설정
              </span>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="outline"
                size="sm"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="ml-2">{soundEnabled ? '사운드 켜짐' : '사운드 꺼짐'}</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div>
                <Label htmlFor="minutes">분</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="999"
                  value={minutes}
                  onChange={(e) => handleTimeInput(e.target.value, 'minutes')}
                  disabled={state === 'running'}
                  className="text-center text-lg"
                />
              </div>
              <div>
                <Label htmlFor="seconds">초</Label>
                <Input
                  id="seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => handleTimeInput(e.target.value, 'seconds')}
                  disabled={state === 'running'}
                  className="text-center text-lg"
                />
              </div>
            </div>

            {selectedPreset && (
              <div className="text-center mt-4">
                <Badge variant="outline" className="text-blue-600">
                  선택된 프리셋: {selectedPreset}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 프리셋 타이머 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              프리셋 타이머
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">기본</TabsTrigger>
                <TabsTrigger value="workout">운동</TabsTrigger>
                <TabsTrigger value="cooking">요리</TabsTrigger>
                <TabsTrigger value="study">학습</TabsTrigger>
              </TabsList>
              
              {Object.entries(TIMER_PRESETS).map(([category, presets]) => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {presets.map((preset) => (
                      <Button
                        key={preset.name}
                        onClick={() => selectPreset(preset)}
                        variant={selectedPreset === preset.name ? "default" : "outline"}
                        disabled={state === 'running'}
                        className="h-auto p-4 flex flex-col items-center"
                      >
                        <div className={`w-4 h-4 rounded-full ${preset.color} mb-2`} />
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-sm text-gray-500">
                          {formatTime(preset.minutes * 60 + preset.seconds)}
                        </div>
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* 광고 */}
        <AdBannerInline />

        {/* 사용법 안내 */}
        <Card>
          <CardHeader>
            <CardTitle>사용법</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">⏰ 기본 기능</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 분과 초를 직접 입력하여 타이머 설정</li>
                  <li>• 프리셋을 선택하여 빠른 설정</li>
                  <li>• 일시정지 및 재개 기능</li>
                  <li>• 완료 시 사운드 알림</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💡 활용 팁</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 운동 인터벌 트레이닝</li>
                  <li>• 요리 시간 관리</li>
                  <li>• 학습 세션 관리</li>
                  <li>• 휴식 시간 조절</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </ToolLayout>
    </>
  );
}