import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, RotateCcw, Clock, Timer as TimerIcon } from 'lucide-react';

type TimerState = 'idle' | 'running' | 'paused' | 'finished';

interface Preset {
  name: string;
  minutes: number;
  seconds: number;
  color: string;
}

const TIMER_PRESETS: Preset[] = [
  { name: '5분', minutes: 5, seconds: 0, color: 'bg-blue-500' },
  { name: '10분', minutes: 10, seconds: 0, color: 'bg-green-500' },
  { name: '15분', minutes: 15, seconds: 0, color: 'bg-orange-500' },
  { name: '30분', minutes: 30, seconds: 0, color: 'bg-purple-500' },
  { name: '45분', minutes: 45, seconds: 0, color: 'bg-pink-500' },
  { name: '1시간', minutes: 60, seconds: 0, color: 'bg-red-500' },
];

export default function Timer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const [initialTime, setInitialTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state === 'running' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setState('finished');
            // 타이머 완료 알림
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('타이머 완료!', {
                body: '설정한 시간이 완료되었습니다.',
                icon: '/favicon.ico'
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state, timeLeft]);

  // 알림 권한 요청
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const startTimer = () => {
    if (state === 'idle') {
      const totalSeconds = minutes * 60 + seconds;
      setTimeLeft(totalSeconds);
      setInitialTime(totalSeconds);
    }
    setState('running');
  };

  const pauseTimer = () => {
    setState('paused');
  };

  const stopTimer = () => {
    setState('idle');
    setTimeLeft(0);
    setInitialTime(0);
  };

  const resetTimer = () => {
    setState('idle');
    setTimeLeft(initialTime);
  };

  const applyPreset = (preset: Preset) => {
    if (state === 'idle') {
      setMinutes(preset.minutes);
      setSeconds(preset.seconds);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (initialTime === 0) return 0;
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  const displayTime = state === 'idle' ? minutes * 60 + seconds : timeLeft;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-3">
          <TimerIcon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          범용 타이머
        </h1>
        <p className="text-muted-foreground">
          원하는 시간을 설정하고 카운트다운을 시작하세요
        </p>
      </div>

      {/* 메인 타이머 디스플레이 */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* 시간 설정 (idle 상태에서만) */}
            {state === 'idle' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">시간 설정</h3>
                <div className="flex justify-center items-center gap-4 max-w-xs mx-auto">
                  <div className="flex flex-col items-center gap-2">
                    <label className="text-sm font-medium text-muted-foreground">분</label>
                    <Input
                      type="number"
                      min="0"
                      max="999"
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 text-center text-lg"
                    />
                  </div>
                  <div className="text-2xl font-bold mt-6">:</div>
                  <div className="flex flex-col items-center gap-2">
                    <label className="text-sm font-medium text-muted-foreground">초</label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={seconds}
                      onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      className="w-20 text-center text-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 타이머 디스플레이 */}
            <div className="relative">
              <div className="text-6xl md:text-8xl font-mono font-bold text-center mb-4">
                {formatTime(displayTime)}
              </div>
              
              {/* 진행률 바 */}
              {state !== 'idle' && (
                <div className="w-full bg-muted rounded-full h-3 mb-4">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              )}

              {/* 상태 배지 */}
              <div className="flex justify-center">
                {state === 'idle' && (
                  <Badge variant="secondary" className="px-4 py-2">
                    <Clock className="w-4 h-4 mr-2" />
                    대기 중
                  </Badge>
                )}
                {state === 'running' && (
                  <Badge variant="default" className="px-4 py-2 bg-green-500">
                    <Play className="w-4 h-4 mr-2" />
                    실행 중
                  </Badge>
                )}
                {state === 'paused' && (
                  <Badge variant="outline" className="px-4 py-2">
                    <Pause className="w-4 h-4 mr-2" />
                    일시정지
                  </Badge>
                )}
                {state === 'finished' && (
                  <Badge variant="destructive" className="px-4 py-2">
                    <Square className="w-4 h-4 mr-2" />
                    완료
                  </Badge>
                )}
              </div>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="flex justify-center gap-3">
              {state === 'idle' && (
                <Button 
                  onClick={startTimer} 
                  size="lg" 
                  className="px-8"
                  disabled={minutes === 0 && seconds === 0}
                >
                  <Play className="w-5 h-5 mr-2" />
                  시작
                </Button>
              )}
              
              {state === 'running' && (
                <Button onClick={pauseTimer} size="lg" className="px-8" variant="outline">
                  <Pause className="w-5 h-5 mr-2" />
                  일시정지
                </Button>
              )}
              
              {state === 'paused' && (
                <>
                  <Button onClick={startTimer} size="lg" className="px-8">
                    <Play className="w-5 h-5 mr-2" />
                    재개
                  </Button>
                  <Button onClick={resetTimer} size="lg" variant="outline">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    리셋
                  </Button>
                </>
              )}

              {(state === 'running' || state === 'paused' || state === 'finished') && (
                <Button onClick={stopTimer} size="lg" variant="destructive">
                  <Square className="w-5 h-5 mr-2" />
                  정지
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 프리셋 타이머 */}
      {state === 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">빠른 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TIMER_PRESETS.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => applyPreset(preset)}
                  className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-primary/10"
                >
                  <div className={`w-3 h-3 rounded-full ${preset.color}`} />
                  <span className="font-semibold">{preset.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 사용 팁 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">사용 팁</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• 브라우저 알림을 허용하면 타이머 완료 시 알림을 받을 수 있습니다</p>
          <p>• 빠른 설정 버튼으로 자주 사용하는 시간을 쉽게 설정할 수 있습니다</p>
          <p>• 타이머가 실행 중일 때도 다른 탭에서 작업할 수 있습니다</p>
          <p>• 일시정지 후 리셋하면 원래 설정 시간으로 돌아갑니다</p>
        </CardContent>
      </Card>
    </div>
  );
}