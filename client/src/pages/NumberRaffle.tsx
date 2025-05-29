import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shuffle, RotateCcw, Settings } from 'lucide-react';

interface RaffleResult {
  number: number;
  order: number;
  timestamp: number;
}

export default function NumberRaffle() {
  const [maxNumber, setMaxNumber] = useState(() => {
    const saved = localStorage.getItem('raffle-max-number');
    return saved ? parseInt(saved) : 100;
  });
  const [drawCount, setDrawCount] = useState(() => {
    const saved = localStorage.getItem('raffle-draw-count');
    return saved ? parseInt(saved) : 1;
  });
  const [currentNumbers, setCurrentNumbers] = useState<number[]>(() => {
    const saved = localStorage.getItem('raffle-current-numbers');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnNumbers, setDrawnNumbers] = useState<RaffleResult[]>(() => {
    const saved = localStorage.getItem('raffle-drawn-numbers');
    return saved ? JSON.parse(saved) : [];
  });
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [animationNumbers, setAnimationNumbers] = useState<number[]>(() => {
    const saved = localStorage.getItem('raffle-animation-numbers');
    return saved ? JSON.parse(saved) : [0, 0, 0, 0, 0, 0];
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('raffle-sound-enabled');
    return saved ? JSON.parse(saved) : true;
  });
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const slowdownRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const drumAudioRef = useRef<HTMLAudioElement | null>(null);

  // localStorage에 상태 저장
  useEffect(() => {
    localStorage.setItem('raffle-max-number', maxNumber.toString());
  }, [maxNumber]);

  useEffect(() => {
    localStorage.setItem('raffle-draw-count', drawCount.toString());
  }, [drawCount]);

  useEffect(() => {
    localStorage.setItem('raffle-current-numbers', JSON.stringify(currentNumbers));
  }, [currentNumbers]);

  useEffect(() => {
    localStorage.setItem('raffle-drawn-numbers', JSON.stringify(drawnNumbers));
  }, [drawnNumbers]);

  useEffect(() => {
    localStorage.setItem('raffle-animation-numbers', JSON.stringify(animationNumbers));
  }, [animationNumbers]);

  useEffect(() => {
    localStorage.setItem('raffle-sound-enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // 드럼 오디오 초기화
  useEffect(() => {
    if (!drumAudioRef.current) {
      drumAudioRef.current = new Audio();
      drumAudioRef.current.src = '/attached_assets/Drum_org.mp3';
      drumAudioRef.current.preload = 'auto';
      drumAudioRef.current.volume = 0.7;
    }
  }, []);

  // 오디오 컨텍스트 초기화
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // 스네어 드럼 사운드 (긴장감 있는 롤링 효과)
  const playSnareRoll = () => {
    if (!soundEnabled) return;
    const audioContext = initAudioContext();
    
    // 노이즈 생성 (스네어 효과)
    const bufferSize = audioContext.sampleRate * 0.1;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.3;
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;
    
    // 하이패스 필터 (스네어 특성)
    const highpass = audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 1000;
    
    // 밴드패스 필터
    const bandpass = audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 200;
    bandpass.Q.value = 1;
    
    // 게인 조절
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    // 연결
    noise.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    noise.start();
    noise.stop(audioContext.currentTime + 0.1);
  };

  // 심벌즈 크래시 (당첨 시)
  const playCymbalCrash = () => {
    if (!soundEnabled) return;
    const audioContext = initAudioContext();
    
    // 여러 주파수의 사인파 조합 (심벌즈 효과)
    const frequencies = [523, 659, 784, 987, 1174, 1397];
    const duration = 1.5;
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = freq + (Math.random() * 50 - 25);
      
      // 크래시 효과를 위한 엔벨로프
      gainNode.gain.setValueAtTime(0.1 / frequencies.length, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      // 하이패스 필터 (밝은 소리)
      const highpass = audioContext.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 500;
      
      oscillator.connect(highpass);
      highpass.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(audioContext.currentTime + index * 0.01);
      oscillator.stop(audioContext.currentTime + duration);
    });
  };

  // 틱 사운드 (애니메이션 중)
  const playTickSound = () => {
    if (!soundEnabled) return;
    const audioContext = initAudioContext();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.value = 800;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
  };

  // 제공해주신 드럼 사운드 재생
  const playDrumSound = async () => {
    if (!soundEnabled || !drumAudioRef.current) return;
    
    try {
      // 오디오를 처음부터 재생하기 위해 currentTime 리셋
      drumAudioRef.current.currentTime = 0;
      await drumAudioRef.current.play();
    } catch (error) {
      console.log('드럼 사운드 재생 실패:', error);
      // 실패 시 기본 스네어 드럼으로 대체
      playSnareRoll();
    }
  };

  // Initialize available numbers when maxNumber changes
  useEffect(() => {
    const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
    const remaining = numbers.filter(num => !drawnNumbers.map(r => r.number).includes(num));
    setAvailableNumbers(remaining);
  }, [maxNumber, drawnNumbers]);

  // Slot machine animation effect
  const startSlotAnimation = () => {
    // 시작 시 멋진 드럼 사운드 재생
    playDrumSound();
    
    let speed = 50; // Start fast
    let tickCount = 0;
    
    const animate = () => {
      setAnimationNumbers(prev => 
        prev.map(() => Math.floor(Math.random() * maxNumber) + 1)
      );
      
      // 주기적으로 틱 사운드 재생
      tickCount++;
      if (tickCount % 4 === 0) {
        playTickSound();
      }
    };

    // Fast animation phase
    animationRef.current = setInterval(animate, speed);

    // Gradually slow down
    setTimeout(() => {
      if (animationRef.current) clearInterval(animationRef.current);
      playDrumSound(); // 속도 변경 시 드럼 사운드
      speed = 100;
      animationRef.current = setInterval(animate, speed);
      
      setTimeout(() => {
        if (animationRef.current) clearInterval(animationRef.current);
        playDrumSound(); // 더 느려질 때 드럼 사운드
        speed = 200;
        animationRef.current = setInterval(animate, speed);
        
        setTimeout(() => {
          if (animationRef.current) clearInterval(animationRef.current);
          speed = 400;
          animationRef.current = setInterval(() => {
            setAnimationNumbers(prev => 
              prev.map(() => Math.floor(Math.random() * maxNumber) + 1)
            );
            playTickSound(); // 마지막 단계에서 매번 틱 소리
          }, speed);
          
          setTimeout(() => {
            if (animationRef.current) clearInterval(animationRef.current);
            finalizeNumber();
          }, 800);
        }, 600);
      }, 400);
    }, 800);
  };

  // 번호별 색상 반환 함수
  const getNumberColor = (number: number, selectedNumbers: number[]) => {
    const colors = [
      'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-400',
      'bg-gradient-to-br from-blue-400 to-indigo-500 border-blue-400',
      'bg-gradient-to-br from-green-400 to-emerald-500 border-green-400'
    ];
    
    const index = selectedNumbers.indexOf(number);
    return index !== -1 ? colors[index] : 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-400';
  };

  const finalizeNumber = () => {
    if (availableNumbers.length < drawCount) {
      setIsDrawing(false);
      return;
    }

    // 선택할 번호들을 무작위로 뽑기
    const shuffled = [...availableNumbers].sort(() => Math.random() - 0.5);
    const selectedNumbers = shuffled.slice(0, drawCount).sort((a, b) => a - b);
    
    setCurrentNumbers(selectedNumbers);
    
    // 6개 슬롯에 번호 배치
    let finalSlots: number[] = [];
    
    if (drawCount === 1) {
      // 1개: 모든 슬롯에 같은 번호
      finalSlots = Array(6).fill(selectedNumbers[0]);
    } else if (drawCount === 2) {
      // 2개: 각각 3슬롯씩
      finalSlots = [
        selectedNumbers[0], selectedNumbers[0], selectedNumbers[0],
        selectedNumbers[1], selectedNumbers[1], selectedNumbers[1]
      ];
    } else if (drawCount === 3) {
      // 3개: 각각 2슬롯씩
      finalSlots = [
        selectedNumbers[0], selectedNumbers[0],
        selectedNumbers[1], selectedNumbers[1],
        selectedNumbers[2], selectedNumbers[2]
      ];
    }
    
    setAnimationNumbers(finalSlots);
    
    setTimeout(() => {
      // 당첨 순간 심벌즈 크래시 사운드
      playCymbalCrash();
      
      // 여러 개의 결과를 추가
      const newResults: RaffleResult[] = selectedNumbers.map((num, index) => ({
        number: num,
        order: drawnNumbers.length + index + 1,
        timestamp: Date.now() + index
      }));
      
      setDrawnNumbers(prev => [...newResults, ...prev]);
      setIsDrawing(false);
    }, 1000);
  };

  const handleDraw = () => {
    if (availableNumbers.length < drawCount) return;
    
    setIsDrawing(true);
    setCurrentNumbers([]);
    startSlotAnimation();
  };

  const handleReset = () => {
    setDrawnNumbers([]);
    setCurrentNumbers([]);
    setAnimationNumbers([0, 0, 0, 0, 0, 0]);
  };

  const handleMaxNumberChange = (value: string) => {
    const num = parseInt(value);
    if (num && num > 0 && num <= 10000) {
      setMaxNumber(num);
      // Reset if new max is smaller than existing draws
      const invalidDraws = drawnNumbers.filter(r => r.number > num);
      if (invalidDraws.length > 0) {
        setDrawnNumbers(prev => prev.filter(r => r.number <= num));
      }
    }
  };

  const remainingCount = availableNumbers.length;
  const drawnCount = drawnNumbers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            번호 추첨기
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg">
            1~{maxNumber}번 중 추첨
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">최대 번호</label>
                  <Input
                    type="number"
                    min="1"
                    max="10000"
                    value={maxNumber}
                    onChange={(e) => handleMaxNumberChange(e.target.value)}
                    className="text-lg"
                    disabled={isDrawing}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">추첨 개수</label>
                  <select
                    value={drawCount}
                    onChange={(e) => setDrawCount(parseInt(e.target.value))}
                    disabled={isDrawing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value={1}>1개</option>
                    <option value={2}>2개</option>
                    <option value={3}>3개</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">효과음</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      disabled={isDrawing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    <span className="ml-3 text-sm text-gray-600">
                      {soundEnabled ? '🔊 ON' : '🔇 OFF'}
                    </span>
                  </label>
                </div>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                  disabled={isDrawing || drawnNumbers.length === 0}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  초기화
                </Button>

                {/* Statistics */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">전체 번호</span>
                    <Badge variant="secondary">{maxNumber}개</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">추첨된 번호</span>
                    <Badge variant="default">{drawnCount}개</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">남은 번호</span>
                    <Badge variant="outline">{remainingCount}개</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Drawing Area */}
          <div className="lg:col-span-2">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-8">
                {/* Slot Machine Display */}
                <div className="text-center mb-8">
                  <div className="flex justify-center items-center gap-2 mb-6">
                    {animationNumbers.map((num, index) => (
                      <div
                        key={index}
                        className={`w-16 h-20 md:w-20 md:h-24 rounded-lg border-2 flex items-center justify-center text-2xl md:text-3xl font-bold transition-all duration-300 ${
                          isDrawing
                            ? 'bg-gray-100 border-gray-300 text-gray-700'
                            : currentNumbers.length > 0
                            ? `${getNumberColor(num, currentNumbers)} text-white shadow-lg scale-110`
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                        style={{
                          transform: isDrawing ? `translateY(${Math.sin(Date.now() * 0.01 + index) * 5}px)` : undefined,
                          animation: isDrawing ? 'pulse 0.5s infinite' : undefined
                        }}
                      >
                        {num || '?'}
                      </div>
                    ))}
                  </div>

                  {/* Current Result Display */}
                  {currentNumbers.length > 0 && !isDrawing && (
                    <div className="mb-6">
                      <div className="flex flex-wrap justify-center gap-4 mb-4">
                        {currentNumbers.map((num, index) => {
                          const colors = [
                            'from-yellow-400 via-orange-500 to-red-500',
                            'from-blue-400 via-indigo-500 to-purple-500', 
                            'from-green-400 via-emerald-500 to-teal-500'
                          ];
                          return (
                            <div key={index} className={`text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r ${colors[index]} bg-clip-text animate-bounce`}>
                              {num}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xl text-gray-600">
                        {currentNumbers.length === 1 ? '당첨 번호!' : `${currentNumbers.length}개 당첨 번호!`}
                      </p>
                    </div>
                  )}

                  {/* Draw Button */}
                  <Button
                    onClick={handleDraw}
                    disabled={isDrawing || availableNumbers.length < drawCount}
                    size="lg"
                    className={`w-32 h-32 rounded-full text-xl font-bold transition-all duration-300 ${
                      isDrawing
                        ? 'bg-gray-400 animate-spin'
                        : availableNumbers.length < drawCount
                        ? 'bg-gray-300'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isDrawing ? (
                      <div className="flex flex-col items-center">
                        <Shuffle className="w-8 h-8 mb-1" />
                        <span className="text-sm">추첨중...</span>
                      </div>
                    ) : availableNumbers.length < drawCount ? (
                      <div className="flex flex-col items-center text-xs">
                        <span>남은 번호</span>
                        <span>부족</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Shuffle className="w-8 h-8 mb-1" />
                        <span className="text-sm">{drawCount}개 추첨</span>
                      </div>
                    )}
                  </Button>

                  {availableNumbers.length === 0 && drawnNumbers.length > 0 && (
                    <p className="text-lg text-gray-600 mt-4">모든 번호가 추첨되었습니다!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results History */}
            {drawnNumbers.length > 0 && (
              <Card className="bg-white/95 backdrop-blur-sm shadow-2xl mt-6">
                <CardHeader>
                  <CardTitle>추첨된 번호들</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-64 overflow-y-auto">
                    {drawnNumbers.map((result, index) => (
                      <div
                        key={result.timestamp}
                        className={`p-4 rounded-lg text-center transition-all duration-300 ${
                          index === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <div className="text-2xl font-bold">{result.number}</div>
                        <div className="text-xs opacity-75">#{result.order}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}