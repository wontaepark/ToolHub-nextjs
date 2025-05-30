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
        console.log('원본 음성 인식:', event.results[0][0].transcript);
        console.log('처리할 명령:', command);
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
      console.log('음성 인식이 지원되지 않거나 초기화되지 않았습니다.');
      return;
    }
    
    if (isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        console.log('음성 인식 중지');
      } catch (error) {
        console.error('음성 인식 중지 오류:', error);
        setIsListening(false);
      }
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        console.log('음성 인식 시작');
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
            console.log('원본 음성 인식:', event.results[0][0].transcript);
            console.log('처리할 명령:', command);
            handleVoiceCommand(command);
            setIsListening(false);
          };
          
          recognitionRef.current.onerror = (event: any) => {
            console.error('음성 인식 오류:', event.error);
            setIsListening(false);
          };
          
          recognitionRef.current.onend = () => {
            console.log('음성 인식 종료');
            setIsListening(false);
          };
          
          // 재시도
          try {
            recognitionRef.current.start();
            setIsListening(true);
            console.log('음성 인식 재시작 성공');
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
                              {preset.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {preset.minutes}분 {preset.seconds > 0 && `${preset.seconds}초`}
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
                            placeholder="분"
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
                            placeholder="초"
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
    </div>
  );
}