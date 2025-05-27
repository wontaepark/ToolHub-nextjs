import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, RotateCcw, Clock, Timer as TimerIcon, Mic, MicOff, Volume2, Settings } from 'lucide-react';

type TimerState = 'idle' | 'running' | 'paused' | 'finished';

interface Preset {
  name: string;
  minutes: number;
  seconds: number;
  color: string;
  category: string;
}

const TIMER_PRESETS = {
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
    { name: '휴식', minutes: 2, seconds: 0, color: 'bg-blue-500', category: '운동' },
  ],
  cooking: [
    { name: '라면', minutes: 3, seconds: 0, color: 'bg-red-500', category: '요리' },
    { name: '계란 (반숙)', minutes: 6, seconds: 0, color: 'bg-yellow-500', category: '요리' },
    { name: '계란 (완숙)', minutes: 10, seconds: 0, color: 'bg-orange-500', category: '요리' },
    { name: '차 우리기', minutes: 3, seconds: 0, color: 'bg-green-500', category: '요리' },
    { name: '커피 추출', minutes: 4, seconds: 0, color: 'bg-amber-600', category: '요리' },
  ],
  study: [
    { name: '집중 45분', minutes: 45, seconds: 0, color: 'bg-purple-500', category: '학습' },
    { name: '딥워크 90분', minutes: 90, seconds: 0, color: 'bg-indigo-500', category: '학습' },
    { name: '복습 20분', minutes: 20, seconds: 0, color: 'bg-blue-500', category: '학습' },
    { name: '휴식 15분', minutes: 15, seconds: 0, color: 'bg-green-500', category: '학습' },
  ],
  meeting: [
    { name: '스탠드업', minutes: 15, seconds: 0, color: 'bg-cyan-500', category: '회의' },
    { name: '발표 시간', minutes: 10, seconds: 0, color: 'bg-purple-500', category: '회의' },
    { name: '브레인스톰', minutes: 30, seconds: 0, color: 'bg-pink-500', category: '회의' },
    { name: '피드백', minutes: 5, seconds: 0, color: 'bg-orange-500', category: '회의' },
  ],
};

export default function Timer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const [initialTime, setInitialTime] = useState(0);
  const [activeCategory, setActiveCategory] = useState('basic');
  const [volume, setVolume] = useState(0.7);
  const [selectedSound, setSelectedSound] = useState('chime');
  const [isListening, setIsListening] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (state === 'running' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setState('finished');
            // 완료 사운드 재생
            playCompletionSound();
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

  // 알림 권한 요청 및 음성 인식 초기화
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // 음성 인식 초기화
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ko-KR';
      
      recognitionRef.current.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(command);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // 사운드 재생 함수
  const playCompletionSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 선택된 사운드에 따라 다른 주파수 패턴
    const soundPatterns: Record<string, number[]> = {
      chime: [523.25, 659.25, 783.99], // C-E-G
      bell: [440, 554.37, 659.25], // A-C#-E
      beep: [800, 800, 800], // Simple beep
      gentle: [261.63, 329.63, 392.00], // C-E-G lower octave
    };
    
    const pattern = soundPatterns[selectedSound] || soundPatterns.chime;
    
    pattern.forEach((frequency, index) => {
      setTimeout(() => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.5);
      }, index * 200);
    });
  };

  // 음성 명령 처리
  const handleVoiceCommand = (command: string) => {
    console.log('음성 명령:', command);
    
    // 한글 숫자를 아라비아 숫자로 변환
    const convertKoreanNumbers = (text: string) => {
      const koreanNumbers: Record<string, string> = {
        '십': '10', '일': '1', '이': '2', '삼': '3', '사': '4', '오': '5',
        '육': '6', '칠': '7', '팔': '8', '구': '9', '영': '0'
      };
      
      let converted = text;
      Object.entries(koreanNumbers).forEach(([korean, number]) => {
        converted = converted.replace(new RegExp(korean, 'g'), number);
      });
      return converted;
    };
    
    const convertedCommand = convertKoreanNumbers(command);
    
    // 프리셋 명령 확인
    const allPresets = Object.values(TIMER_PRESETS).flat();
    const matchedPreset = allPresets.find(preset => 
      convertedCommand.includes(preset.name) || 
      command.includes(preset.name)
    );
    
    if (matchedPreset && state === 'idle') {
      console.log('프리셋 선택:', matchedPreset.name);
      
      // 해당 프리셋이 속한 카테고리로 전환
      const presetCategory = Object.keys(TIMER_PRESETS).find(category => 
        TIMER_PRESETS[category as keyof typeof TIMER_PRESETS].includes(matchedPreset)
      );
      if (presetCategory) {
        setActiveCategory(presetCategory);
        console.log('카테고리 전환:', presetCategory);
      }
      
      setMinutes(matchedPreset.minutes);
      setSeconds(matchedPreset.seconds);
      
      // "플랭크 시작" 같은 명령이면 바로 시작
      if (command.includes('시작') || command.includes('start')) {
        setTimeout(() => {
          const totalSeconds = matchedPreset.minutes * 60 + matchedPreset.seconds;
          setTimeLeft(totalSeconds);
          setInitialTime(totalSeconds);
          setState('running');
        }, 100);
      }
      return;
    }
    
    if (command.includes('시작') || command.includes('start')) {
      // "10분 타이머 시작" 같은 명령 처리
      const minuteMatch = convertedCommand.match(/(\d+)분/);
      const secondMatch = convertedCommand.match(/(\d+)초/);
      
      if (minuteMatch && state === 'idle') {
        const mins = parseInt(minuteMatch[1]);
        setMinutes(mins);
        setSeconds(0);
        setTimeout(() => {
          const totalSeconds = mins * 60;
          setTimeLeft(totalSeconds);
          setInitialTime(totalSeconds);
          setState('running');
        }, 100);
      } else if (secondMatch && state === 'idle') {
        const secs = parseInt(secondMatch[1]);
        setMinutes(Math.floor(secs / 60));
        setSeconds(secs % 60);
        setTimeout(() => {
          setTimeLeft(secs);
          setInitialTime(secs);
          setState('running');
        }, 100);
      } else if (state === 'idle' || state === 'paused') {
        startTimer();
      }
    } else if (command.includes('정지') || command.includes('stop')) {
      stopTimer();
    } else if (command.includes('일시정지') || command.includes('pause')) {
      if (state === 'running') {
        pauseTimer();
      }
    } else if (convertedCommand.includes('분') && !command.includes('시작')) {
      // "10분" 이라고만 말했을 때
      const minuteMatch = convertedCommand.match(/(\d+)분/);
      if (minuteMatch && state === 'idle') {
        const mins = parseInt(minuteMatch[1]);
        setMinutes(mins);
        setSeconds(0);
      }
    } else if (convertedCommand.includes('초')) {
      // "30초", "십 초" 같은 명령 처리
      const secondMatch = convertedCommand.match(/(\d+)초/);
      if (secondMatch && state === 'idle') {
        const secs = parseInt(secondMatch[1]);
        if (secs < 60) {
          setMinutes(0);
          setSeconds(secs);
        } else {
          setMinutes(Math.floor(secs / 60));
          setSeconds(secs % 60);
        }
      }
    } else if (command.includes('운동') || command.includes('요리') || command.includes('학습') || command.includes('회의')) {
      // 카테고리 변경
      if (command.includes('운동')) setActiveCategory('workout');
      else if (command.includes('요리')) setActiveCategory('cooking');
      else if (command.includes('학습')) setActiveCategory('study');
      else if (command.includes('회의')) setActiveCategory('meeting');
    }
  };

  // 음성 인식 시작/중지
  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

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
            <div className="flex flex-col items-center gap-4">
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
              
              {/* 음성 명령 버튼 */}
              <Button
                onClick={toggleVoiceRecognition}
                variant={isListening ? "default" : "outline"}
                size="sm"
                className={`${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
                disabled={!recognitionRef.current}
              >
                {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                {isListening ? '음성 인식 중...' : '음성 명령'}
              </Button>
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
          <CardContent className="space-y-4">
            {/* 카테고리 선택 */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(TIMER_PRESETS).map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="capitalize"
                >
                  {category === 'basic' && '기본'}
                  {category === 'workout' && '운동'}
                  {category === 'cooking' && '요리'}
                  {category === 'study' && '학습'}
                  {category === 'meeting' && '회의'}
                </Button>
              ))}
            </div>
            
            {/* 선택된 카테고리의 프리셋들 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TIMER_PRESETS[activeCategory as keyof typeof TIMER_PRESETS]?.map((preset: Preset, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => applyPreset(preset)}
                  className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-primary/10"
                >
                  <div className={`w-3 h-3 rounded-full ${preset.color}`} />
                  <span className="font-semibold text-xs">{preset.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 사운드 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            사운드 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 볼륨 조절 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                볼륨
              </label>
              <span className="text-sm text-muted-foreground">{Math.round(volume * 100)}%</span>
            </div>
            <Input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          {/* 사운드 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">알람음</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'chime', name: '차임' },
                { id: 'bell', name: '벨' },
                { id: 'beep', name: '비프' },
                { id: 'gentle', name: '부드러운' },
              ].map((sound) => (
                <Button
                  key={sound.id}
                  variant={selectedSound === sound.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSound(sound.id)}
                  className="text-xs"
                >
                  {sound.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* 사운드 테스트 */}
          <Button
            variant="outline"
            size="sm"
            onClick={playCompletionSound}
            className="w-full"
          >
            사운드 테스트
          </Button>
        </CardContent>
      </Card>

      {/* 사용 팁 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">사용 팁</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• 브라우저 알림을 허용하면 타이머 완료 시 알림을 받을 수 있습니다</p>
          <p>• 카테고리별 프리셋으로 용도에 맞는 타이머를 빠르게 설정하세요</p>
          <p>• 음성 명령으로 "시작", "정지", "10분 타이머" 등을 말해보세요</p>
          <p>• 볼륨과 알람음을 취향에 맞게 조절할 수 있습니다</p>
          <p>• 타이머가 실행 중일 때도 다른 탭에서 작업할 수 있습니다</p>
        </CardContent>
      </Card>
    </div>
  );
}