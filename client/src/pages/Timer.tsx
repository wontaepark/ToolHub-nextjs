import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, RotateCcw, Clock, Timer as TimerIcon, Mic, MicOff, Volume2, Settings, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const [initialTime, setInitialTime] = useState(0);
  const [activeCategory, setActiveCategory] = useState('basic');
  const [volume, setVolume] = useState(0.7);
  const [selectedSound, setSelectedSound] = useState('chime');
  const [isListening, setIsListening] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customPresets, setCustomPresets] = useState(() => {
    const saved = localStorage.getItem('timer-custom-presets');
    return saved ? JSON.parse(saved) : {
      라면: { minutes: 3, seconds: 0 },
      플랭크: { minutes: 1, seconds: 0 },
      집중: { minutes: 25, seconds: 0 },
      계란: { minutes: 6, seconds: 0 }
    };
  });
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [favoritePresets, setFavoritePresets] = useState(() => {
    const saved = localStorage.getItem('timer-favorite-presets');
    return saved ? JSON.parse(saved) : [];
  });
  const [customizedPresets, setCustomizedPresets] = useState(() => {
    const saved = localStorage.getItem('timer-customized-presets');
    return saved ? JSON.parse(saved) : {};
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Load saved timer state on component mount
  useEffect(() => {
    const savedTimerState = localStorage.getItem('universalTimerState');
    if (savedTimerState) {
      const timerData = JSON.parse(savedTimerState);
      const timePassed = Date.now() - timerData.timestamp;
      
      if (timerData.state === 'running' && timePassed < timerData.timeLeft * 1000) {
        // Calculate remaining time
        const remainingTime = Math.max(0, timerData.timeLeft - Math.floor(timePassed / 1000));
        if (remainingTime > 0) {
          setMinutes(timerData.minutes);
          setSeconds(timerData.seconds);
          setTimeLeft(remainingTime);
          setInitialTime(timerData.initialTime);
          setState('running');
          setSelectedPreset(timerData.selectedPreset);
        }
      } else if (timerData.state === 'paused') {
        setMinutes(timerData.minutes);
        setSeconds(timerData.seconds);
        setTimeLeft(timerData.timeLeft);
        setInitialTime(timerData.initialTime);
        setState('paused');
        setSelectedPreset(timerData.selectedPreset);
      }
    }
  }, []);

  // Save timer state to localStorage when running or paused
  useEffect(() => {
    if (state === 'running' || state === 'paused') {
      const timerData = {
        state,
        minutes,
        seconds,
        timeLeft,
        initialTime,
        selectedPreset,
        timestamp: Date.now()
      };
      localStorage.setItem('universalTimerState', JSON.stringify(timerData));
    } else if (state === 'idle') {
      localStorage.removeItem('universalTimerState');
    }
  }, [state, minutes, seconds, timeLeft, initialTime, selectedPreset]);

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
              new Notification(t('timer.notification.title'), {
                body: t('timer.notification.body'),
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
        const command = event.results[0][0].transcript.toLowerCase().trim();

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
    
    // 프리셋 명령 확인 (더 정확한 매칭)
    const allPresets = Object.values(TIMER_PRESETS).flat();
    const matchedPreset = allPresets.find(preset => {
      const presetName = preset.name.toLowerCase();
      // 정확한 매칭 또는 포함 관계 확인
      return command === presetName || 
             convertedCommand === presetName ||
             command.includes(presetName) || 
             convertedCommand.includes(presetName) ||
             // 유사한 발음 매칭
             (presetName === '라면' && (command.includes('라') || command.includes('면'))) ||
             (presetName === '플랭크' && (command.includes('플랭') || command.includes('플랑'))) ||
             (presetName === '계란 (반숙)' && (command.includes('계란') && command.includes('반'))) ||
             (presetName === '계란 (완숙)' && (command.includes('계란') && command.includes('완'))) ||
             (presetName === '커피 추출' && (command.includes('커피'))) ||
             (presetName === '차 우리기' && (command.includes('차')));
    });
    
    if (matchedPreset && state === 'idle') {

      
      // 해당 프리셋이 속한 카테고리로 전환
      const presetCategory = Object.keys(TIMER_PRESETS).find(category => 
        TIMER_PRESETS[category as keyof typeof TIMER_PRESETS].includes(matchedPreset)
      );
      if (presetCategory) {
        setActiveCategory(presetCategory);

      }
      
      setMinutes(matchedPreset.minutes);
      setSeconds(matchedPreset.seconds);
      setSelectedPreset(matchedPreset.name);
      
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
    if (!recognitionRef.current) {

      return;
    }
    
    if (isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);

      } catch (error) {
        console.error('음성 인식 중지 오류:', error);
        setIsListening(false);
      }
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);

      } catch (error) {
        console.error('음성 인식 시작 오류:', error);
        setIsListening(false);
        
        // 재초기화 시도
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = 'ko-KR';
          
          recognitionRef.current.onresult = (event: any) => {
            const command = event.results[0][0].transcript.toLowerCase().trim();

            handleVoiceCommand(command);
            setIsListening(false);
          };
          
          recognitionRef.current.onerror = (event: any) => {
            console.error('음성 인식 오류:', event.error);
            setIsListening(false);
          };
          
          recognitionRef.current.onend = () => {

            setIsListening(false);
          };
          
          // 재시도
          try {
            recognitionRef.current.start();
            setIsListening(true);

          } catch (retryError) {
            console.error('음성 인식 재시작 실패:', retryError);
          }
        }
      }
    }
  };

  const startTimer = () => {
    if (state === 'idle') {
      const totalSeconds = minutes * 60 + seconds;
      setTimeLeft(totalSeconds);
      setInitialTime(totalSeconds);
    }
    setState('running');
    // 타이머 시작 시 선택된 프리셋 해제
    setSelectedPreset(null);
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
      setSelectedPreset(preset.name);
    }
  };

  // 커스텀 프리셋 저장
  const saveCustomPresets = (newPresets: any) => {
    setCustomPresets(newPresets);
    localStorage.setItem('timer-custom-presets', JSON.stringify(newPresets));
  };

  // 커스텀 프리셋 적용
  const applyCustomPreset = (name: string) => {
    const preset = customPresets[name];
    if (preset && state === 'idle') {
      setMinutes(preset.minutes);
      setSeconds(preset.seconds);
      setSelectedPreset(name);
    }
  };

  // 커스텀 프리셋 수정
  const updateCustomPreset = (name: string, minutes: number, seconds: number) => {
    const newPresets = {
      ...customPresets,
      [name]: { minutes, seconds }
    };
    saveCustomPresets(newPresets);
    setEditingPreset(null);
  };

  // 즐겨찾기 프리셋 토글
  const toggleFavoritePreset = (presetName: string) => {
    let newFavorites;
    if (favoritePresets.includes(presetName)) {
      newFavorites = favoritePresets.filter((name: string) => name !== presetName);
    } else {
      newFavorites = [...favoritePresets, presetName];
    }
    setFavoritePresets(newFavorites);
    localStorage.setItem('timer-favorite-presets', JSON.stringify(newFavorites));
  };

  // 커스터마이징된 프리셋 저장
  const saveCustomizedPreset = (presetName: string, minutes: number, seconds: number) => {
    const newCustomized = {
      ...customizedPresets,
      [presetName]: { minutes, seconds }
    };
    setCustomizedPresets(newCustomized);
    localStorage.setItem('timer-customized-presets', JSON.stringify(newCustomized));
  };

  // 프리셋 데이터 가져오기 (커스터마이징 적용)
  const getPresetData = (presetName: string) => {
    const allPresets = Object.values(TIMER_PRESETS).flat();
    const defaultPreset = allPresets.find((preset: Preset) => preset.name === presetName);
    
    if (defaultPreset) {
      // 커스터마이징된 데이터가 있으면 적용
      const customized = customizedPresets[presetName];
      return customized ? { ...defaultPreset, ...customized } : defaultPreset;
    }
    
    return null;
  };

  // 즐겨찾기된 프리셋들의 실제 데이터 가져오기
  const getFavoritePresetsData = () => {
    return favoritePresets.map((name: string) => {
      return getPresetData(name);
    }).filter(Boolean);
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
          {t('timer.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('timer.description')}
        </p>
      </div>

      {/* 메인 타이머 디스플레이 */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* 시간 설정 (idle 상태에서만) */}
            {state === 'idle' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('timer.timeSetup')}</h3>
                <div className="flex justify-center items-center gap-4 max-w-xs mx-auto">
                  <div className="flex flex-col items-center gap-2">
                    <label className="text-sm font-medium text-muted-foreground">{t('timer.minutes')}</label>
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
                    <label className="text-sm font-medium text-muted-foreground">{t('timer.seconds')}</label>
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
                    {t('timer.status.waiting')}
                  </Badge>
                )}
                {state === 'running' && (
                  <Badge variant="default" className="px-4 py-2 bg-green-500">
                    <Play className="w-4 h-4 mr-2" />
                    {t('timer.status.running')}
                  </Badge>
                )}
                {state === 'paused' && (
                  <Badge variant="outline" className="px-4 py-2">
                    <Pause className="w-4 h-4 mr-2" />
                    {t('timer.status.paused')}
                  </Badge>
                )}
                {state === 'finished' && (
                  <Badge variant="destructive" className="px-4 py-2">
                    <Square className="w-4 h-4 mr-2" />
                    {t('timer.status.finished')}
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
                    {t('timer.buttons.start')}
                  </Button>
                )}
                
                {state === 'running' && (
                  <Button onClick={pauseTimer} size="lg" className="px-8" variant="outline">
                    <Pause className="w-5 h-5 mr-2" />
                    {t('timer.buttons.pause')}
                  </Button>
                )}
                
                {state === 'paused' && (
                  <>
                    <Button onClick={startTimer} size="lg" className="px-8">
                      <Play className="w-5 h-5 mr-2" />
                      {t('timer.buttons.resume')}
                    </Button>
                    <Button onClick={resetTimer} size="lg" variant="outline">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      {t('timer.buttons.reset')}
                    </Button>
                  </>
                )}

                {(state === 'running' || state === 'paused' || state === 'finished') && (
                  <Button onClick={stopTimer} size="lg" variant="destructive">
                    <Square className="w-5 h-5 mr-2" />
                    {t('timer.buttons.stop')}
                  </Button>
                )}
              </div>
              
              {/* 빠른 프리셋 버튼들 */}
              {state === 'idle' && (
                <div className="space-y-3 mt-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('timer.quickSetup')}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {getFavoritePresetsData().map((preset: any) => (
                      <div key={preset.name} className="relative">
                        <Button
                          onClick={() => applyPreset(preset)}
                          variant="outline"
                          size="sm"
                          className="text-xs h-12 w-full relative group"
                        >
                          <div className="text-center">
                            <div className="text-sm">
                              {preset.name === '라면' && '🍜'} 
                              {preset.name === '플랭크' && '💪'} 
                              {preset.name === '집중시간' && '📚'} 
                              {preset.name === '계란 (반숙)' && '🥚'} 
                              {preset.name === '스탠드업' && '👥'} 
                              {preset.name === '발표 시간' && '🎤'} 
                              {preset.name === '브레이크아웃' && '🏃'} 
                              {preset.name === '푸쉬업' && '💪'} 
                              {preset.name === '커피 추출' && '☕'} 
                              {preset.name === '차 우리기' && '🍵'} 
                              {t(`timer.presets.${preset.name}`)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {preset.minutes}{t('timer.minutes')} {preset.seconds > 0 && `${preset.seconds}${t('timer.seconds')}`}
                            </div>
                          </div>
                        </Button>
                      </div>
                    ))}
                  </div>
                  {getFavoritePresetsData().length === 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {t('timer.favoriteInstructions')}
                    </p>
                  )}
                </div>
              )}

              {/* 음성 명령 버튼 (접을 수 있게) */}
              <details className="group mt-3">
                <summary className="list-none cursor-pointer">
                  <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <Mic className="w-3 h-3 mr-1" />
                    {t('timer.voiceCommand.title')}
                    <ChevronDown className="w-3 h-3 ml-1 group-open:rotate-180 transition-transform" />
                  </div>
                </summary>
                <div className="mt-2">
                  <Button
                    onClick={toggleVoiceRecognition}
                    variant={isListening ? "default" : "outline"}
                    size="sm"
                    className={`w-full ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    disabled={!recognitionRef.current}
                  >
                    {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                    {isListening ? t('timer.voiceCommand.listening') : t('timer.voiceCommand.button')}
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    {t('timer.voiceCommand.examples')}
                  </p>
                </div>
              </details>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 프리셋 타이머 */}
      {state === 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('timer.quickSetup')}</CardTitle>
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
                  {t(`timer.categories.${category}`)}
                </Button>
              ))}
            </div>
            
            {/* 선택된 카테고리의 프리셋들 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TIMER_PRESETS[activeCategory as keyof typeof TIMER_PRESETS]?.map((preset: Preset, index: number) => {
                const customized = customizedPresets[preset.name];
                const displayMinutes = customized ? customized.minutes : preset.minutes;
                const displaySeconds = customized ? customized.seconds : preset.seconds;
                
                return (
                  <div key={index} className="relative">
                    {editingPreset === preset.name ? (
                      <div className="p-2 border rounded-lg space-y-1 h-16 flex flex-col justify-center bg-blue-50 dark:bg-blue-900/30">
                        <div className="text-xs font-medium text-center">{preset.name}</div>
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            min="0"
                            max="99"
                            value={displayMinutes}
                            onChange={(e) => {
                              const newMinutes = parseInt(e.target.value) || 0;
                              saveCustomizedPreset(preset.name, newMinutes, displaySeconds);
                            }}
                            className="h-5 text-xs"
                            placeholder={t('timer.minutes')}
                          />
                          <Input
                            type="number"
                            min="0"
                            max="59"
                            value={displaySeconds}
                            onChange={(e) => {
                              const newSeconds = parseInt(e.target.value) || 0;
                              saveCustomizedPreset(preset.name, displayMinutes, newSeconds);
                            }}
                            className="h-5 text-xs"
                            placeholder={t('timer.seconds')}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0"
                            onClick={() => setEditingPreset(null)}
                          >
                            ✓
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant={selectedPreset === preset.name ? "default" : "outline"}
                        onClick={() => {
                          const presetToApply = customized 
                            ? { ...preset, minutes: displayMinutes, seconds: displaySeconds }
                            : preset;
                          applyPreset(presetToApply);
                        }}
                        onDoubleClick={() => setEditingPreset(preset.name)}
                        className={`h-16 w-full flex flex-col items-center justify-center gap-1 transition-all ${
                          selectedPreset === preset.name 
                            ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                            : 'hover:bg-primary/10'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${
                          selectedPreset === preset.name ? 'bg-white' : preset.color
                        }`} />
                        <span className="font-semibold text-xs">{t(`timer.presets.${preset.name}`)}</span>
                        <span className="text-xs opacity-70">
                          {displayMinutes}{t('timer.minutes')} {displaySeconds > 0 && `${displaySeconds}${t('timer.seconds')}`}
                          {customized && <span className="text-blue-500"> ✓</span>}
                        </span>
                        {!editingPreset && (
                          <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Settings className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                      </Button>
                    )}
                    
                    {/* 즐겨찾기 체크박스 */}
                    <div 
                      className="absolute top-2 right-2 cursor-pointer z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoritePreset(preset.name);
                      }}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        favoritePresets.includes(preset.name) 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                      }`}>
                        {favoritePresets.includes(preset.name) && (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 사운드 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className={`w-5 h-5 ${(state === 'running' || state === 'paused') ? 'opacity-50' : ''}`} />
            {t('timer.settings.title')}
            {(state === 'running' || state === 'paused') && (
              <span className="text-xs text-muted-foreground ml-2">({t('timer.settings.disabled')})</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className={`space-y-4 ${(state === 'running' || state === 'paused') ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* 볼륨 조절 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                {t('timer.settings.volume')}
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
            <label className="text-sm font-medium">{t('timer.settings.alarmSound')}</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'chime', name: t('timer.settings.sounds.chime') },
                { id: 'bell', name: t('timer.settings.sounds.bell') },
                { id: 'beep', name: t('timer.settings.sounds.beep') },
                { id: 'gentle', name: t('timer.settings.sounds.gentle') },
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
            {t('timer.settings.testSound')}
          </Button>
        </CardContent>
      </Card>

      {/* 사용 팁 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('timer.tips.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• {t('timer.tips.tip1')}</p>
          <p>• {t('timer.tips.tip2')}</p>
          <p>• {t('timer.tips.tip3')}</p>
          <p>• {t('timer.tips.tip4')}</p>
          <p>• {t('timer.tips.tip5')}</p>
        </CardContent>
      </Card>

      {/* 상세 사용법 가이드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <i className="ri-book-open-line text-primary"></i>
            {t('timer.detailedGuide.title', '상세 사용법 가이드')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center">1</span>
                {t('timer.basicSetup.title', '기본 타이머 설정')}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <i className="ri-time-line text-blue-500 mt-0.5"></i>
                  <span>{t('timer.basicSetup.step1', '시간 입력: 분과 초 필드에 원하는 시간을 직접 입력하세요')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ri-play-line text-green-500 mt-0.5"></i>
                  <span>{t('timer.basicSetup.step2', '시작 버튼: 설정 완료 후 "시작" 버튼을 클릭하여 카운트다운 시작')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ri-eye-line text-purple-500 mt-0.5"></i>
                  <span>{t('timer.basicSetup.step3', '진행 확인: 화면에 표시되는 큰 숫자로 남은 시간을 실시간 확인')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ri-notification-line text-orange-500 mt-0.5"></i>
                  <span>{t('timer.basicSetup.step4', '완료 알림: 시간이 끝나면 선택한 알람음과 함께 시각적 알림 표시')}</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full text-sm flex items-center justify-center">2</span>
                {t('timer.quickSetup.title', '빠른 설정 활용법')}
              </h3>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-3 rounded-lg border border-red-200/50 dark:border-red-800/30">
                  <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">{t('timer.cooking.title', '요리용')}</h4>
                  <p className="text-sm text-red-600 dark:text-red-400">{t('timer.cooking.desc', '음식별 최적 조리 시간이 미리 설정되어 있어 요리 실수를 방지')}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-3 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">{t('timer.workout.title', '운동용')}</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{t('timer.workout.desc', '휴식 시간, 운동 세트 간격 등을 정확히 측정')}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-3 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
                  <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-1">{t('timer.study.title', '학습용')}</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400">{t('timer.study.desc', '집중 학습 시간, 휴식 시간 관리에 활용')}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 다양한 활용 사례 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <i className="ri-lightbulb-line text-yellow-500"></i>
            {t('timer.useCases.title', '다양한 활용 사례')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <i className="ri-restaurant-line text-red-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-foreground">{t('timer.useCases.cooking.title', '요리와 베이킹')}</h3>
              <p className="text-sm text-muted-foreground">{t('timer.useCases.cooking.desc', '요리에서 정확한 시간 측정은 맛과 안전의 핵심입니다')}</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• {t('timer.useCases.cooking.item1', '파스타 삶기: 면 종류별 최적 삶는 시간 준수')}</li>
                <li>• {t('timer.useCases.cooking.item2', '스테이크 굽기: 원하는 익힘 정도에 맞는 정확한 시간')}</li>
                <li>• {t('timer.useCases.cooking.item3', '베이킹: 오븐 요리의 정확한 조리 시간으로 완벽한 결과')}</li>
                <li>• {t('timer.useCases.cooking.item4', '발효: 빵 반죽, 요거트 등의 발효 시간 관리')}</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <i className="ri-run-line text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-foreground">{t('timer.useCases.fitness.title', '운동과 피트니스')}</h3>
              <p className="text-sm text-muted-foreground">{t('timer.useCases.fitness.desc', '효과적인 운동을 위한 시간 관리')}</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• {t('timer.useCases.fitness.item1', '인터벌 트레이닝: 고강도 운동과 휴식의 정확한 시간 배분')}</li>
                <li>• {t('timer.useCases.fitness.item2', '플랭크: 코어 운동의 지속 시간 측정')}</li>
                <li>• {t('timer.useCases.fitness.item3', '스트레칭: 각 동작별 충분한 스트레칭 시간 확보')}</li>
                <li>• {t('timer.useCases.fitness.item4', '휴식 시간: 세트 간 적절한 휴식으로 운동 효과 극대화')}</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <i className="ri-book-line text-green-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-foreground">{t('timer.useCases.study.title', '학습과 업무')}</h3>
              <p className="text-sm text-muted-foreground">{t('timer.useCases.study.desc', '생산성 향상을 위한 시간 관리')}</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• {t('timer.useCases.study.item1', '집중 학습: 25분 집중 + 5분 휴식의 포모도로 기법')}</li>
                <li>• {t('timer.useCases.study.item2', '독서: 정해진 시간 동안 집중 독서로 독서 습관 형성')}</li>
                <li>• {t('timer.useCases.study.item3', '회의 관리: 안건별 토론 시간 제한으로 효율적 회의 진행')}</li>
                <li>• {t('timer.useCases.study.item4', '프레젠테이션: 발표 연습 시 시간 배분 확인')}</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <i className="ri-home-line text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-foreground">{t('timer.useCases.lifestyle.title', '일상생활 관리')}</h3>
              <p className="text-sm text-muted-foreground">{t('timer.useCases.lifestyle.desc', '다양한 생활 패턴 관리')}</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• {t('timer.useCases.lifestyle.item1', '파워 낮잠: 20분 이내의 효과적인 낮잠')}</li>
                <li>• {t('timer.useCases.lifestyle.item2', '명상: 정해진 시간 동안의 집중 명상')}</li>
                <li>• {t('timer.useCases.lifestyle.item3', '게임 시간: 자녀의 게임 시간 관리')}</li>
                <li>• {t('timer.useCases.lifestyle.item4', '화상 통화: 통화 시간 제한으로 효율적 소통')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <i className="ri-question-line text-primary"></i>
            {t('timer.faq.title', '자주 묻는 질문 (FAQ)')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-foreground mb-2">{t('timer.faq.q1', 'Q1. 타이머가 정확한가요?')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('timer.faq.a1', '네, 브라우저의 고정밀 타이머 API를 사용하여 초 단위까지 정확한 시간 측정을 보장합니다. 컴퓨터의 시계와 동일한 정확도를 제공합니다.')}
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-foreground mb-2">{t('timer.faq.q2', 'Q2. 다른 탭에서 작업해도 타이머가 계속 실행되나요?')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('timer.faq.a2', '네, 백그라운드에서 계속 실행되어 다른 탭이나 프로그램을 사용하는 중에도 정확히 작동합니다. 타이머 완료 시 브라우저 알림으로 알려드립니다.')}
              </p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-foreground mb-2">{t('timer.faq.q3', 'Q3. 브라우저를 닫으면 타이머가 어떻게 되나요?')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('timer.faq.a3', '브라우저나 탭을 닫으면 타이머가 중단됩니다. 중요한 타이머는 브라우저를 열어둔 상태로 유지하시기 바랍니다.')}
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-foreground mb-2">{t('timer.faq.q4', 'Q4. 음성 명령이 작동하지 않는데요?')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('timer.faq.a4', '음성 명령은 실험적 기능으로, 브라우저의 마이크 권한을 허용해야 합니다. Chrome, Firefox 최신 버전에서 가장 잘 작동합니다.')}
              </p>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-foreground mb-2">{t('timer.faq.q5', 'Q5. 알람음을 들을 수 없어요.')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('timer.faq.a5', '브라우저의 소리 설정과 컴퓨터 볼륨을 확인하세요. 또한 "사운드 테스트" 버튼으로 미리 알람음을 확인할 수 있습니다.')}
              </p>
            </div>
            
            <div className="border-l-4 border-cyan-500 pl-4">
              <h4 className="font-semibold text-foreground mb-2">{t('timer.faq.q6', 'Q6. 타이머를 여러 개 동시에 실행할 수 있나요?')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('timer.faq.a6', '현재는 한 번에 하나의 타이머만 실행 가능합니다. 여러 개의 타이머가 필요한 경우 여러 브라우저 탭을 사용하시면 됩니다.')}
              </p>
            </div>
            
            <div className="border-l-4 border-pink-500 pl-4">
              <h4 className="font-semibold text-foreground mb-2">{t('timer.faq.q7', 'Q7. 모바일에서도 사용할 수 있나요?')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('timer.faq.a7', '네, 모바일과 태블릿에 완전히 최적화되어 있습니다. 터치 인터페이스와 모바일 브라우저의 백그라운드 실행도 지원합니다.')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 기술적 특징과 호환성 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <i className="ri-settings-line text-primary"></i>
            {t('timer.technical.title', '기술적 특징과 호환성')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <i className="ri-global-line text-blue-500"></i>
                {t('timer.technical.browser.title', '브라우저 호환성')}
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-500"></i>
                  <span>{t('timer.technical.browser.desktop', '데스크톱: Chrome, Firefox, Safari, Edge 모든 최신 버전 지원')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-500"></i>
                  <span>{t('timer.technical.browser.mobile', '모바일: iOS Safari, Android Chrome 완벽 지원')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-500"></i>
                  <span>{t('timer.technical.browser.voice', '음성 명령: Chrome, Firefox에서 최적 성능')}</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <i className="ri-speed-line text-green-500"></i>
                {t('timer.technical.performance.title', '성능 최적화')}
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-500"></i>
                  <span>{t('timer.technical.performance.lightweight', '경량 설계: 빠른 로딩과 부드러운 애니메이션')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-500"></i>
                  <span>{t('timer.technical.performance.battery', '배터리 효율: 모바일 기기의 배터리 소모 최소화')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-500"></i>
                  <span>{t('timer.technical.performance.memory', '메모리 관리: 장시간 사용해도 안정적인 성능 유지')}</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <i className="ri-accessibility-line text-purple-500"></i>
                {t('timer.technical.accessibility.title', '접근성 지원')}
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-500"></i>
                  <span>{t('timer.technical.accessibility.keyboard', '키보드 네비게이션: 마우스 없이도 모든 기능 사용 가능')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-500"></i>
                  <span>{t('timer.technical.accessibility.screen', '스크린 리더: 시각 장애인을 위한 접근성 지원')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-500"></i>
                  <span>{t('timer.technical.accessibility.contrast', '고대비 모드: 시각적 구분이 어려운 사용자를 위한 배려')}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 업데이트와 개선 계획 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <i className="ri-roadmap-line text-primary"></i>
            {t('timer.roadmap.title', '업데이트와 개선 계획')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <i className="ri-star-line text-green-500"></i>
                {t('timer.roadmap.recent.title', '최근 추가된 기능')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <i className="ri-mic-line text-green-600 mt-0.5"></i>
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-300">{t('timer.roadmap.recent.voice', '음성 명령 지원 (실험적)')}</h4>
                    <p className="text-sm text-green-600 dark:text-green-400">{t('timer.roadmap.recent.voiceDesc', '음성으로 타이머를 제어할 수 있는 혁신적 기능')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <i className="ri-volume-up-line text-blue-600 mt-0.5"></i>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">{t('timer.roadmap.recent.sounds', '다양한 알람음 옵션')}</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{t('timer.roadmap.recent.soundsDesc', '4가지 알람음과 볼륨 조절 기능')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <i className="ri-rocket-line text-purple-500"></i>
                {t('timer.roadmap.future.title', '향후 개발 계획')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <i className="ri-timer-2-line text-purple-600 mt-0.5"></i>
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-300">{t('timer.roadmap.future.multi', '다중 타이머')}</h4>
                    <p className="text-sm text-purple-600 dark:text-purple-400">{t('timer.roadmap.future.multiDesc', '여러 타이머 동시 실행 기능')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <i className="ri-save-line text-orange-600 mt-0.5"></i>
                  <div>
                    <h4 className="font-medium text-orange-800 dark:text-orange-300">{t('timer.roadmap.future.presets', '타이머 프리셋 저장')}</h4>
                    <p className="text-sm text-orange-600 dark:text-orange-400">{t('timer.roadmap.future.presetsDesc', '사용자 맞춤 설정 저장 기능')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                  <i className="ri-bar-chart-line text-cyan-600 mt-0.5"></i>
                  <div>
                    <h4 className="font-medium text-cyan-800 dark:text-cyan-300">{t('timer.roadmap.future.stats', '통계 기능')}</h4>
                    <p className="text-sm text-cyan-600 dark:text-cyan-400">{t('timer.roadmap.future.statsDesc', '타이머 사용 패턴 분석 및 통계')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 마무리 섹션 */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-8 border border-blue-200/50 dark:border-blue-800/30">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          {t('timer.conclusion.title', '효율적인 시간 관리의 시작')}
        </h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
          {t('timer.conclusion.description', 'ToolHub.tools 범용 타이머와 함께 더욱 체계적이고 효율적인 시간 관리를 시작해보세요. 요리부터 운동, 학습까지 모든 순간이 더욱 의미있어집니다.')}
        </p>
        <div className="flex justify-center">
          <div className="animate-pulse">
            <i className="ri-time-line text-primary text-4xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
}