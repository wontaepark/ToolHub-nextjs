import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
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
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('raffle-volume');
    return saved ? parseFloat(saved) : 0.8;
  });
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const slowdownRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const drumAudioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef<boolean>(false);

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

  useEffect(() => {
    localStorage.setItem('raffle-volume', volume.toString());
    if (drumAudioRef.current) {
      drumAudioRef.current.volume = volume;
    }
  }, [volume]);

  // 드럼 오디오 초기화
  useEffect(() => {
    if (!drumAudioRef.current) {
      drumAudioRef.current = new Audio();
      // Vite의 assets 처리 방식에 맞춰 import 사용
      import('@assets/Drum_org.mp3').then((module) => {
        if (drumAudioRef.current) {
          drumAudioRef.current.src = module.default;
          drumAudioRef.current.preload = 'auto';
          drumAudioRef.current.volume = volume;
          
          // 재생 완료 시 플래그 리셋
          drumAudioRef.current.addEventListener('ended', () => {
            isPlayingRef.current = false;
          });
        }
      }).catch(() => {

      });
    }
  }, [volume]);

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

  // 멋진 드럼 사운드 재생 (중복 재생 방지)
  const playDrumSound = async () => {
    if (!soundEnabled || !drumAudioRef.current || isPlayingRef.current) return;
    
    try {
      isPlayingRef.current = true;
      // 오디오를 처음부터 재생하기 위해 currentTime 리셋
      drumAudioRef.current.currentTime = 0;
      drumAudioRef.current.volume = volume;
      await drumAudioRef.current.play();
    } catch (error) {
      isPlayingRef.current = false;

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
    
    const speed = 100; // 일정한 속도 유지
    
    const animate = () => {
      setAnimationNumbers(prev => 
        prev.map(() => Math.floor(Math.random() * maxNumber) + 1)
      );
    };

    // 일정한 속도로 애니메이션 유지
    animationRef.current = setInterval(animate, speed);

    // 드럼 사운드 길이에 맞춰 애니메이션 지속 (약 3.35초)
    setTimeout(() => {
      if (animationRef.current) clearInterval(animationRef.current);
      finalizeNumber();
    }, 3350);
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
    
    // 당첨 순간 드럼 사운드 (판과 동시에)
    playDrumSound();
    
    // 여러 개의 결과를 추가 (판과 동시에)
    const newResults: RaffleResult[] = selectedNumbers.map((num, index) => ({
      number: num,
      order: drawnNumbers.length + index + 1,
      timestamp: Date.now() + index
    }));
    
    setDrawnNumbers(prev => [...newResults, ...prev]);
    
    // 판 색상 변경과 동시에 당첨 번호 설정
    setTimeout(() => {
      setCurrentNumbers(selectedNumbers);
      setIsDrawing(false);
    }, 100);
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
            {t('numberRaffle.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg">
            {t('numberRaffle.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
{t('numberRaffle.settings.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">{t('numberRaffle.settings.maxNumber')}</label>
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
                  <label className="text-sm font-medium mb-2 block text-foreground">{t('numberRaffle.settings.drawCount')}</label>
                  <select
                    value={drawCount}
                    onChange={(e) => setDrawCount(parseInt(e.target.value))}
                    disabled={isDrawing}
                    className="w-full px-3 py-2 border border-border rounded-md text-lg font-medium bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value={1}>1개</option>
                    <option value={2}>2개</option>
                    <option value={3}>3개</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">{t('numberRaffle.settings.sound')}</label>
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

                {soundEnabled && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
{t('numberRaffle.settings.volume')} ({Math.round(volume * 100)}%)
                    </label>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs">🔇</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        disabled={isDrawing}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <span className="text-xs">🔊</span>
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                  disabled={isDrawing || drawnNumbers.length === 0}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
{t('numberRaffle.buttons.reset')}
                </Button>

                {/* Statistics */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('numberRaffle.stats.totalNumbers')}</span>
                    <Badge variant="secondary">{maxNumber}개</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('numberRaffle.stats.drawnNumbers')}</span>
                    <Badge variant="default">{drawnCount}개</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('numberRaffle.stats.remainingNumbers')}</span>
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
{currentNumbers.length === 1 ? t('numberRaffle.results.winningNumber') : t('numberRaffle.results.winningNumbers', { count: currentNumbers.length })}
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
                        <span className="text-sm">{t('numberRaffle.buttons.drawing')}</span>
                      </div>
                    ) : availableNumbers.length < drawCount ? (
                      <div className="flex flex-col items-center text-xs">
                        <span>{t('numberRaffle.messages.notEnough')}</span>
                        <span>{t('numberRaffle.messages.remaining')}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Shuffle className="w-8 h-8 mb-1" />
                        <span className="text-sm">{t('numberRaffle.buttons.drawNumbers', { count: drawCount })}</span>
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
                  <CardTitle>{t('numberRaffle.history.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-64 overflow-y-auto">
                    {drawnNumbers.map((result, index) => (
                      <div
                        key={result.timestamp}
                        className={`p-4 rounded-lg text-center transition-all duration-300 ${
                          index === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
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

      {/* Detailed Content Section */}
      <div className="space-y-8 mt-12">
        {/* 번호 추첨기 소개 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '공정한 번호 추첨기' : 
             currentLang === 'ja' ? '公正な番号抽選機' : 
             'Fair Number Raffle'}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {currentLang === 'ko' ? 
              '완전히 랜덤한 번호 추첨을 통해 공정하고 투명한 선택을 도와주는 온라인 도구입니다. 이벤트, 게임, 추첨, 순서 정하기 등 다양한 상황에서 편견 없는 무작위 선택이 필요할 때 사용하세요. 암호학적으로 안전한 난수 생성기를 사용하여 예측 불가능하고 공정한 결과를 보장합니다.' :
             currentLang === 'ja' ? 
              '完全にランダムな番号抽選により公正で透明な選択をサポートするオンラインツールです。イベント、ゲーム、抽選、順番決めなど様々な状況で偏見のない無作為選択が必要な時にご利用ください。暗号学的に安全な乱数生成器を使用して予測不可能で公正な結果を保証します。' :
              'An online tool that helps with fair and transparent selection through completely random number drawing. Use it when you need unbiased random selection in various situations such as events, games, raffles, and ordering. It uses cryptographically secure random number generators to ensure unpredictable and fair results.'
            }
          </p>
        </section>

        {/* 주요 기능 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '주요 기능' : 
             currentLang === 'ja' ? '主要機能' : 
             'Main Features'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '추첨 옵션' : 
                 currentLang === 'ja' ? '抽選オプション' : 
                 'Raffle Options'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  {currentLang === 'ko' ? '• 범위 설정 (최소값 ~ 최대값)' : 
                   currentLang === 'ja' ? '• 範囲設定（最小値～最大値）' : 
                   '• Range Setting (Min ~ Max values)'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 추첨 개수 선택' : 
                   currentLang === 'ja' ? '• 抽選数選択' : 
                   '• Number of draws selection'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 중복 허용/비허용 설정' : 
                   currentLang === 'ja' ? '• 重複許可/非許可設定' : 
                   '• Allow/Disallow duplicates setting'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 즉시 결과 표시' : 
                   currentLang === 'ja' ? '• 即座に結果表示' : 
                   '• Instant result display'}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '결과 관리' : 
                 currentLang === 'ja' ? '結果管理' : 
                 'Result Management'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  {currentLang === 'ko' ? '• 추첨 기록 저장' : 
                   currentLang === 'ja' ? '• 抽選記録保存' : 
                   '• Save raffle history'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 시간 순서별 정렬' : 
                   currentLang === 'ja' ? '• 時間順ソート' : 
                   '• Sort by time order'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 결과 복사 기능' : 
                   currentLang === 'ja' ? '• 結果コピー機能' : 
                   '• Copy result function'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 기록 초기화' : 
                   currentLang === 'ja' ? '• 記録初期化' : 
                   '• Clear history'}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 활용 예시 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '활용 예시' : 
             currentLang === 'ja' ? '活用例' : 
             'Usage Examples'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '이벤트 및 게임' : 
                 currentLang === 'ja' ? 'イベント・ゲーム' : 
                 'Events & Games'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  '경품 추첨, 팀 나누기, 발표 순서 정하기, 보드게임 순서 결정, 벌칙 게임 등에 활용할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '景品抽選、チーム分け、発表順決め、ボードゲーム順番決定、罰ゲームなどに活用できます。' :
                  'Perfect for prize draws, team divisions, presentation order, board game turns, penalty games, and more.'
                }
              </p>
            </div>
            <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '업무 및 학습' : 
                 currentLang === 'ja' ? '業務・学習' : 
                 'Work & Study'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  '무작위 샘플링, 실험 설계, 설문 대상자 선정, 업무 분배, 회의 순서 등 공정한 선택이 필요한 상황에 사용하세요.' :
                 currentLang === 'ja' ? 
                  'ランダムサンプリング、実験設計、アンケート対象者選定、業務分担、会議順番など公正な選択が必要な状況でご利用ください。' :
                  'Use for random sampling, experiment design, survey participant selection, task distribution, meeting order, and other situations requiring fair selection.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* 사용 팁 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '사용 팁' : 
             currentLang === 'ja' ? '使用ヒント' : 
             'Usage Tips'}
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              {currentLang === 'ko' ? 
                '• 중복을 허용하지 않는 경우 추첨 개수가 범위를 초과하지 않도록 주의하세요' :
               currentLang === 'ja' ? 
                '• 重複を許可しない場合、抽選数が範囲を超えないよう注意してください' :
                '• When not allowing duplicates, ensure the number of draws doesn\'t exceed the range'}
            </li>
            <li>
              {currentLang === 'ko' ? 
                '• 공정성이 중요한 상황에서는 모든 참가자가 보는 앞에서 추첨하세요' :
               currentLang === 'ja' ? 
                '• 公평性が重要な状況では全ての参加者が見ている前で抽選してください' :
                '• In situations where fairness is important, conduct the draw in front of all participants'}
            </li>
            <li>
              {currentLang === 'ko' ? 
                '• 추첨 기록을 통해 투명성을 확보할 수 있습니다' :
               currentLang === 'ja' ? 
                '• 抽선記録により透明性を確保できます' :
                '• Transparency can be ensured through draw records'}
            </li>
            <li>
              {currentLang === 'ko' ? 
                '• 큰 범위에서의 추첨도 즉시 처리됩니다' :
               currentLang === 'ja' ? 
                '• 大きな範囲での抽选も即座に処理されます' :
                '• Draws from large ranges are also processed instantly'}
            </li>
          </ul>
        </section>

        {/* 핵심 기능과 특징 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-star-line text-primary"></i>
              {currentLang === 'ko' ? '핵심 기능과 특징' :
               currentLang === 'ja' ? '主要機能と特徴' :
               'Key Features'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-settings-line text-blue-500"></i>
                  {currentLang === 'ko' ? '고급 추첨 설정' :
                   currentLang === 'ja' ? '高度な抽選設定' :
                   'Advanced Draw Settings'}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <i className="ri-arrow-right-s-line text-green-500 mt-0.5"></i>
                    <span>
                      {currentLang === 'ko' ? '유연한 범위 설정: 1부터 원하는 최대 번호까지 자유롭게 설정 가능' :
                       currentLang === 'ja' ? '柔軟な範囲設定：1から希望する最大番号まで自由に設定可能' :
                       'Flexible range setting: freely set from 1 to any desired maximum number'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-arrow-right-s-line text-green-500 mt-0.5"></i>
                    <span>
                      {currentLang === 'ko' ? '다중 번호 추첨: 한 번에 여러 개의 번호를 동시에 추첨' :
                       currentLang === 'ja' ? '複数番号抽选：一度に複数の番号を同時に抽选' :
                       'Multiple number drawing: draw several numbers simultaneously at once'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-arrow-right-s-line text-green-500 mt-0.5"></i>
                    <span>
                      {currentLang === 'ko' ? '중복 방지 시스템: 이미 추첨된 번호는 자동으로 제외하여 중복 없는 공정한 선택' :
                       currentLang === 'ja' ? '重複防止システム：既に抽选された番号は自動的に除外して重複のない公正な選択' :
                       'Duplicate prevention system: automatically excludes already drawn numbers for fair selection'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-arrow-right-s-line text-green-500 mt-0.5"></i>
                    <span>
                      {currentLang === 'ko' ? '즉시 결과 표시: 실시간으로 추첨 결과를 시각적으로 확인' :
                       currentLang === 'ja' ? '即時結果表示：リアルタイムで抽选結果を視覚的に確認' :
                       'Instant result display: visually confirm draw results in real-time'}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-user-heart-line text-purple-500"></i>
                  {currentLang === 'ko' ? '사용자 경험 최적화' :
                   currentLang === 'ja' ? 'ユーザー体験の最適化' :
                   'User Experience Optimization'}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <i className="ri-arrow-right-s-line text-purple-500 mt-0.5"></i>
                    <span>
                      {currentLang === 'ko' ? '드럼 사운드 효과: 실제 추첨 상황과 같은 몰입감 있는 사운드' :
                       currentLang === 'ja' ? 'ドラムサウンド効果：実際の抽선状況のような没入감のあるサウンド' :
                       'Drum sound effects: immersive sounds like real draw situations'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-arrow-right-s-line text-purple-500 mt-0.5"></i>
                    <span>
                      {currentLang === 'ko' ? '볼륨 조절: 환경에 맞게 0-100% 세밀한 볼륨 컨트롤' :
                       currentLang === 'ja' ? 'ボリューム調整：環境に合わせて0-100%の細かいボリュームコントロール' :
                       'Volume control: fine 0-100% volume control suited to environment'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-arrow-right-s-line text-purple-500 mt-0.5"></i>
                    <span>
                      {currentLang === 'ko' ? '시각적 피드백: 화려한 애니메이션과 색상으로 당첨 번호 강조' :
                       currentLang === 'ja' ? '視覚的フィードバック：華やかなアニメーションと色彩で当选番号を強調' :
                       'Visual feedback: highlight winning numbers with colorful animations'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-arrow-right-s-line text-purple-500 mt-0.5"></i>
                    <span>
                      {currentLang === 'ko' ? '직관적 인터페이스: 누구나 쉽게 사용할 수 있는 간단한 조작법' :
                       currentLang === 'ja' ? '直感的インターフェース：誰でも簡単に使える操作方法' :
                       'Intuitive interface: simple operation that anyone can easily use'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 상세 사용법 가이드 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-book-open-line text-primary"></i>
              {currentLang === 'ko' ? '상세 사용법 가이드' :
               currentLang === 'ja' ? '詳細使用法ガイド' :
               'Detailed Usage Guide'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center">1</span>
                  {currentLang === 'ko' ? '기본 설정 방법' :
                   currentLang === 'ja' ? '基本設定方法' :
                   'Basic Setup Method'}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-3 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      {currentLang === 'ko' ? '최대 번호 설정' :
                       currentLang === 'ja' ? '最大番号設定' :
                       'Maximum Number Setting'}
                    </h4>
                    <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                      <li>• {currentLang === 'ko' ? '슬라이더를 사용하여 1부터 원하는 최대값까지 설정' :
                              currentLang === 'ja' ? 'スライダーを使用して1から希望する最大値まで設定' :
                              'Use slider to set from 1 to desired maximum value'}</li>
                      <li>• {currentLang === 'ko' ? '숫자 입력창에 직접 값을 입력하여 정확한 범위 지정' :
                              currentLang === 'ja' ? '数字入力欄に直接値を入力して正確な範囲指定' :
                              'Enter values directly in number input field for precise range'}</li>
                      <li>• {currentLang === 'ko' ? '일반적으로 참가자 수나 선택 항목 수에 맞춰 설정' :
                              currentLang === 'ja' ? '一般的に参加者数や選択項目数に合わせて設定' :
                              'Generally set according to number of participants or selection items'}</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 rounded-lg border border-green-200/50 dark:border-green-800/30">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
                      {currentLang === 'ko' ? '추첨 개수 선택' :
                       currentLang === 'ja' ? '抽选個数選択' :
                       'Draw Count Selection'}
                    </h4>
                    <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                      <li>• {currentLang === 'ko' ? '1개, 2개, 3개 또는 더 많은 개수를 한 번에 추첨 가능' :
                              currentLang === 'ja' ? '1個、2個、3個またはより多くの個数を一度に抽选可能' :
                              'Draw 1, 2, 3 or more numbers at once'}</li>
                      <li>• {currentLang === 'ko' ? '경품 개수나 필요한 선택 항목 수에 맞춰 조정' :
                              currentLang === 'ja' ? '景品個数や必要な選択項目数に合わせて調整' :
                              'Adjust according to number of prizes or required selections'}</li>
                      <li>• {currentLang === 'ko' ? '남은 번호보다 많은 개수는 자동으로 제한됨' :
                              currentLang === 'ja' ? '残りの番号より多い個数は自動的に制限される' :
                              'Numbers exceeding remaining count are automatically limited'}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full text-sm flex items-center justify-center">2</span>
                  {currentLang === 'ko' ? '사운드 및 효과 설정' :
                   currentLang === 'ja' ? 'サウンドと効果設定' :
                   'Sound and Effects Settings'}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-3 rounded-lg border border-orange-200/50 dark:border-orange-800/30">
                    <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-1">
                      {currentLang === 'ko' ? '효과음 제어' :
                       currentLang === 'ja' ? '効果音制御' :
                       'Sound Effects Control'}
                    </h4>
                    <ul className="text-sm text-orange-600 dark:text-orange-400 space-y-1">
                      <li>• {currentLang === 'ko' ? 'ON/OFF 스위치로 사운드 효과 활성화/비활성화' :
                              currentLang === 'ja' ? 'ON/OFFスイッチでサウンド効果を有効/無効' :
                              'Enable/disable sound effects with ON/OFF switch'}</li>
                      <li>• {currentLang === 'ko' ? '조용한 환경이나 회의실에서는 OFF로 설정 권장' :
                              currentLang === 'ja' ? '静かな環境や会議室ではOFFに設定を推奨' :
                              'Recommend OFF setting in quiet environments or meeting rooms'}</li>
                      <li>• {currentLang === 'ko' ? '이벤트나 파티에서는 ON으로 설정하여 분위기 연출' :
                              currentLang === 'ja' ? 'イベントやパーティーではONに設定して雰囲気演出' :
                              'Set ON at events or parties to create atmosphere'}</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-3 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
                    <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-1">
                      {currentLang === 'ko' ? '볼륨 조절' :
                       currentLang === 'ja' ? 'ボリューム調整' :
                       'Volume Control'}
                    </h4>
                    <ul className="text-sm text-purple-600 dark:text-purple-400 space-y-1">
                      <li>• {currentLang === 'ko' ? '0-100% 범위에서 환경에 맞는 적절한 볼륨 설정' :
                              currentLang === 'ja' ? '0-100%範囲で環境に適した適切なボリューム設定' :
                              'Set appropriate volume from 0-100% range for environment'}</li>
                      <li>• {currentLang === 'ko' ? '사전 테스트를 통해 적정 볼륨 확인 권장' :
                              currentLang === 'ja' ? '事前テストで適正ボリューム確認を推奨' :
                              'Recommend testing to confirm appropriate volume'}</li>
                      <li>• {currentLang === 'ko' ? '모바일 기기에서는 기기 볼륨과 연동하여 작동' :
                              currentLang === 'ja' ? 'モバイル機器では機器ボリュームと連動して動作' :
                              'Works in conjunction with device volume on mobile devices'}</li>
                    </ul>
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
              {currentLang === 'ko' ? '다양한 활용 사례와 실제 예시' :
               currentLang === 'ja' ? '様々な活用事例と実際の例' :
               'Various Use Cases and Real Examples'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <i className="ri-gift-line text-red-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-foreground">
                  {currentLang === 'ko' ? '이벤트 및 행사 관리' :
                   currentLang === 'ja' ? 'イベントと行事管理' :
                   'Event and Occasion Management'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '공정한 경품 추첨과 참가자 선정' :
                   currentLang === 'ja' ? '公正な景品抽선と参加者選定' :
                   'Fair prize draws and participant selection'}
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• {currentLang === 'ko' ? '경품 추첨: 참가자 번호를 부여하여 공정한 경품 추첨 진행' :
                          currentLang === 'ja' ? '景品抽选：参加者番号を付与して公正な景品抽选進行' :
                          'Prize draws: fair prize drawings by assigning participant numbers'}</li>
                  <li>• {currentLang === 'ko' ? '선착순 이벤트: 동시 신청자 중 무작위 선별로 공정한 기회 제공' :
                          currentLang === 'ja' ? '先着順イベント：同時申請者の中から無作為選別で公正な機会提供' :
                          'First-come events: fair opportunities through random selection among simultaneous applicants'}</li>
                  <li>• {currentLang === 'ko' ? 'SNS 이벤트: 댓글 순서나 참가자 번호로 당첨자 선정' :
                          currentLang === 'ja' ? 'SNSイベント：コメント順序や参加者番号で当选者選定' :
                          'SNS events: winner selection by comment order or participant numbers'}</li>
                  <li>• {currentLang === 'ko' ? '할인 쿠폰 지급: 한정 수량 쿠폰을 무작위로 배포' :
                          currentLang === 'ja' ? '割引クーポン支給：限定数量クーポンを無作為に配布' :
                          'Discount coupon distribution: random distribution of limited quantity coupons'}</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <i className="ri-school-line text-blue-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-foreground">
                  {currentLang === 'ko' ? '교육 및 학습 환경' :
                   currentLang === 'ja' ? '教育と学習環境' :
                   'Education and Learning Environment'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '공정한 학습 활동과 참여 기회 제공' :
                   currentLang === 'ja' ? '公正な学習活動と参加機会提供' :
                   'Fair learning activities and participation opportunities'}
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• {currentLang === 'ko' ? '발표자 선정: 수업 시간 발표자를 무작위로 선택' :
                          currentLang === 'ja' ? '発表者選定：授業時間の発表者を無作為に選択' :
                          'Presenter selection: randomly choose presenters during class'}</li>
                  <li>• {currentLang === 'ko' ? '조 편성: 공정한 팀 구성을 위한 무작위 배정' :
                          currentLang === 'ja' ? 'グループ編成：公正なチーム構成のための無作為配定' :
                          'Group formation: random assignment for fair team composition'}</li>
                  <li>• {currentLang === 'ko' ? '순서 정하기: 실험 순서나 활동 순서를 랜덤하게 결정' :
                          currentLang === 'ja' ? '順序決め：実験順序や活動順序をランダムに決定' :
                          'Order determination: randomly decide experiment or activity order'}</li>
                  <li>• {currentLang === 'ko' ? '퀴즈 게임: 문제 순서나 답변자 선정에 활용' :
                          currentLang === 'ja' ? 'クイズゲーム：問題順序や回答者選定に活用' :
                          'Quiz games: use for question order or respondent selection'}</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <i className="ri-gamepad-line text-green-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-foreground">
                  {currentLang === 'ko' ? '게임 및 엔터테인먼트' :
                   currentLang === 'ja' ? 'ゲームとエンターテインメント' :
                   'Games and Entertainment'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '재미있고 공정한 게임 진행' :
                   currentLang === 'ja' ? '楽しく公正なゲーム進行' :
                   'Fun and fair game progression'}
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• {currentLang === 'ko' ? '게임 순서: 첫 번째 플레이어나 턴 순서 결정' :
                          currentLang === 'ja' ? 'ゲーム順序：最初のプレイヤーやターン順序決定' :
                          'Game order: determine first player or turn sequence'}</li>
                  <li>• {currentLang === 'ko' ? '역할 배정: 마피아 게임 등에서 역할을 비밀리에 배정' :
                          currentLang === 'ja' ? '役割配定：マフィアゲームなどで役割を秘密裏に配定' :
                          'Role assignment: secretly assign roles in games like Mafia'}</li>
                  <li>• {currentLang === 'ko' ? '벌칙 게임: 공정한 벌칙 대상자 선정' :
                          currentLang === 'ja' ? '罰ゲーム：公正な罰ゲーム対象者選定' :
                          'Penalty games: fair selection of penalty targets'}</li>
                  <li>• {currentLang === 'ko' ? '팀 나누기: 밸런스를 위한 무작위 팀 구성' :
                          currentLang === 'ja' ? 'チーム分け：バランスのための無作為チーム構成' :
                          'Team division: random team composition for balance'}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 공정성과 보안성 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-shield-check-line text-green-500"></i>
              {currentLang === 'ko' ? '공정성과 보안성' :
               currentLang === 'ja' ? '公正性とセキュリティ' :
               'Fairness and Security'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-lock-line text-blue-500"></i>
                  {currentLang === 'ko' ? '암호학적 안전성' :
                   currentLang === 'ja' ? '暗号学的安全性' :
                   'Cryptographic Security'}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                      {currentLang === 'ko' ? '진정한 무작위성' :
                       currentLang === 'ja' ? '真の無作為性' :
                       'True Randomness'}
                    </h4>
                    <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                      <li>• {currentLang === 'ko' ? '고품질 난수 생성: 컴퓨터의 하드웨어 기반 엔트로피 소스 활용' :
                              currentLang === 'ja' ? '高品質乱数生成：コンピューターのハードウェアベースエントロピーソース活用' :
                              'High-quality random generation: utilizing computer hardware-based entropy sources'}</li>
                      <li>• {currentLang === 'ko' ? '예측 불가능성: 이전 결과로는 다음 결과를 예측할 수 없음' :
                              currentLang === 'ja' ? '予測不可能性：以前の結果では次の結果を予測できない' :
                              'Unpredictability: next results cannot be predicted from previous results'}</li>
                      <li>• {currentLang === 'ko' ? '균등 분포: 모든 번호가 선택될 확률이 완전히 동일' :
                              currentLang === 'ja' ? '均等分布：全ての番号が選択される確率が完全に同一' :
                              'Uniform distribution: all numbers have completely equal selection probability'}</li>
                      <li>• {currentLang === 'ko' ? '독립성: 각 추첨은 완전히 독립적이며 이전 결과의 영향을 받지 않음' :
                              currentLang === 'ja' ? '独立性：各抽选は完全に独立的で以前の結果の影響を受けない' :
                              'Independence: each draw is completely independent and unaffected by previous results'}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-eye-line text-green-500"></i>
                  {currentLang === 'ko' ? '투명성 보장' :
                   currentLang === 'ja' ? '透明性保証' :
                   'Transparency Guarantee'}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg border border-green-200/50 dark:border-green-800/30">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                      {currentLang === 'ko' ? '완전 공개 프로세스' :
                       currentLang === 'ja' ? '完全公開プロセス' :
                       'Fully Open Process'}
                    </h4>
                    <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                      <li>• {currentLang === 'ko' ? '실시간 프로세스: 모든 추첨 과정이 실시간으로 화면에 표시' :
                              currentLang === 'ja' ? 'リアルタイムプロセス：全ての抽选過程がリアルタイムで画面に表示' :
                              'Real-time process: all draw processes displayed on screen in real-time'}</li>
                      <li>• {currentLang === 'ko' ? '조작 불가능: 사용자나 운영자가 결과를 조작할 수 없는 구조' :
                              currentLang === 'ja' ? '操作不可能：ユーザーや運営者が結果を操作できない構造' :
                              'Manipulation impossible: structure prevents users or operators from manipulating results'}</li>
                      <li>• {currentLang === 'ko' ? '오픈 소스 알고리즘: 업계 표준 난수 생성 방식 사용' :
                              currentLang === 'ja' ? 'オープンソースアルゴリズム：業界標準乱数生成方式使用' :
                              'Open source algorithm: uses industry standard random generation methods'}</li>
                      <li>• {currentLang === 'ko' ? '감사 가능: 모든 추첨 기록이 시간순으로 저장되어 검증 가능' :
                              currentLang === 'ja' ? '監査可能：全ての抽选記録が時間順に保存されて検証可能' :
                              'Auditable: all draw records saved chronologically for verification'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 자주 묻는 질문 (FAQ) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-question-line text-primary"></i>
              {currentLang === 'ko' ? '자주 묻는 질문 (FAQ)' :
               currentLang === 'ja' ? 'よくある質問 (FAQ)' :
               'Frequently Asked Questions (FAQ)'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-foreground mb-2">
                  {currentLang === 'ko' ? 'Q1. 추첨 결과가 정말 무작위인가요?' :
                   currentLang === 'ja' ? 'Q1. 抽选結果は本当に無作為ですか？' :
                   'Q1. Are the draw results truly random?'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '네, 암호학적으로 안전한 난수 생성 알고리즘을 사용합니다. 각 번호가 선택될 확률이 완전히 동일하며, 이전 결과가 다음 결과에 영향을 주지 않습니다. 업계 표준 무작위성 테스트를 통과한 검증된 방식입니다.' :
                   currentLang === 'ja' ? 'はい、暗号学的に安全な乱数生成アルゴリズムを使用しています。各番号が選択される確率が完全に同一で、以前の結果が次の結果に影響を与えません。業界標準の無作為性テストを通過した検証済みの方式です。' :
                   'Yes, we use cryptographically secure random number generation algorithms. Each number has completely equal selection probability, and previous results do not influence next results. This is a verified method that passes industry standard randomness tests.'}
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-foreground mb-2">
                  {currentLang === 'ko' ? 'Q2. 추첨 결과를 조작할 수 있나요?' :
                   currentLang === 'ja' ? 'Q2. 抽선結果を操作できますか？' :
                   'Q2. Can the draw results be manipulated?'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '불가능합니다. 모든 추첨 과정은 실시간으로 화면에 표시되며, 사용자나 운영자가 결과를 미리 알거나 조작할 수 없는 구조로 설계되었습니다. 추첨은 버튼을 누르는 순간 시작되어 즉시 결과가 생성됩니다.' :
                   currentLang === 'ja' ? '不可能です。全ての抽선過程はリアルタイムで画面に表示され、ユーザーや運営者が結果を事前に知ったり操作したりできない構造で設計されています。抽选はボタンを押した瞬間に開始され、即座に結果が生成されます。' :
                   'Impossible. All draw processes are displayed on screen in real-time, and the system is designed so that users or operators cannot know or manipulate results in advance. The draw starts the moment the button is pressed and results are generated instantly.'}
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-foreground mb-2">
                  {currentLang === 'ko' ? 'Q3. 같은 번호가 계속 나오는 것 같은데요?' :
                   currentLang === 'ja' ? 'Q3. 同じ番号がずっと出ているようですが？' :
                   'Q3. It seems like the same numbers keep coming up?'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '진정한 무작위에서는 같은 번호가 연속으로 나올 수도 있습니다. 이는 정상적인 현상입니다. 중복을 원하지 않는다면 "중복 방지" 설정을 활용하시거나, 장기간 사용 시 통계적으로 모든 번호가 고르게 선택되는 것을 확인할 수 있습니다.' :
                   currentLang === 'ja' ? '真の無作為では同じ番号が連続で出ることもあります。これは正常な現象です。重複を望まない場合は「重複防止」設定を活用するか、長期間使用時に統計的に全ての番号が均等に選択されることを確認できます。' :
                   'In true randomness, the same numbers can appear consecutively. This is a normal phenomenon. If you don\'t want duplicates, use the "duplicate prevention" setting, or you can verify that all numbers are selected evenly statistically over long-term use.'}
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-foreground mb-2">
                  {currentLang === 'ko' ? 'Q4. 최대 몇 명까지 추첨할 수 있나요?' :
                   currentLang === 'ja' ? 'Q4. 最大何名まで抽选できますか？' :
                   'Q4. What is the maximum number of people that can be drawn?'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '기술적으로는 매우 큰 수까지 가능하지만, 실용적으로는 1만 명 이하를 권장합니다. 대규모 추첨의 경우 여러 단계로 나누어 진행하는 것이 효과적입니다.' :
                   currentLang === 'ja' ? '技術的には非常に大きな数まで可能ですが、実用的には1万名以下を推奨します。大規模抽选の場合は複数段階に分けて進行することが効果的です。' :
                   'Technically very large numbers are possible, but practically we recommend 10,000 or fewer. For large-scale draws, it\'s effective to proceed in multiple stages.'}
                </p>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-foreground mb-2">
                  {currentLang === 'ko' ? 'Q5. 추첨 기록이 저장되나요?' :
                   currentLang === 'ja' ? 'Q5. 抽选記録は保存されますか？' :
                   'Q5. Are draw records saved?'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '현재 세션 동안만 브라우저에 임시 저장됩니다. 페이지를 새로고침하거나 닫으면 기록이 삭제됩니다. 중요한 추첨의 경우 결과를 별도로 복사하여 보관하시기 바랍니다.' :
                   currentLang === 'ja' ? '現在のセッション中のみブラウザに一時保存されます。ページを更新したり閉じたりすると記録が削除されます。重要な抽选の場合は結果を別途コピーして保管してください。' :
                   'Records are temporarily saved in the browser only during the current session. Records are deleted when the page is refreshed or closed. For important draws, please copy and save the results separately.'}
                </p>
              </div>
              
              <div className="border-l-4 border-cyan-500 pl-4">
                <h4 className="font-semibold text-foreground mb-2">
                  {currentLang === 'ko' ? 'Q6. 모바일에서도 사용할 수 있나요?' :
                   currentLang === 'ja' ? 'Q6. モバイルでも使用できますか？' :
                   'Q6. Can it be used on mobile devices?'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '네, 모바일과 태블릿에 완전히 최적화되어 있습니다. 터치 인터페이스와 사운드 기능 모두 정상 작동하며, 화면 크기에 맞춰 자동으로 조정됩니다.' :
                   currentLang === 'ja' ? 'はい、モバイルとタブレットに完全に最適化されています。タッチインターフェースとサウンド機能がすべて正常に動作し、画面サイズに合わせて自動調整されます。' :
                   'Yes, it is fully optimized for mobile and tablet devices. Both touch interface and sound functions work normally, and automatically adjust to screen size.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 기술적 사양과 호환성 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-settings-line text-primary"></i>
              {currentLang === 'ko' ? '기술적 사양과 호환성' :
               currentLang === 'ja' ? '技術仕様と互換性' :
               'Technical Specifications and Compatibility'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-global-line text-blue-500"></i>
                  {currentLang === 'ko' ? '브라우저 지원' :
                   currentLang === 'ja' ? 'ブラウザサポート' :
                   'Browser Support'}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-500"></i>
                    <span>
                      {currentLang === 'ko' ? '데스크톱: Chrome, Firefox, Safari, Edge 최신 버전' :
                       currentLang === 'ja' ? 'デスクトップ：Chrome、Firefox、Safari、Edge最新バージョン' :
                       'Desktop: Chrome, Firefox, Safari, Edge latest versions'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-500"></i>
                    <span>
                      {currentLang === 'ko' ? '모바일: iOS Safari, Android Chrome 완벽 지원' :
                       currentLang === 'ja' ? 'モバイル：iOS Safari、Android Chrome完全サポート' :
                       'Mobile: iOS Safari, Android Chrome full support'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-500"></i>
                    <span>
                      {currentLang === 'ko' ? '사운드: 모든 주요 브라우저에서 오디오 재생 지원' :
                       currentLang === 'ja' ? 'サウンド：全ての主要ブラウザでオーディオ再生サポート' :
                       'Sound: audio playback support in all major browsers'}
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-speed-line text-green-500"></i>
                  {currentLang === 'ko' ? '성능 최적화' :
                   currentLang === 'ja' ? 'パフォーマンス最適化' :
                   'Performance Optimization'}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-500"></i>
                    <span>
                      {currentLang === 'ko' ? '빠른 처리: 대용량 추첨도 즉시 처리' :
                       currentLang === 'ja' ? '高速処理：大容量抽选も即座に処理' :
                       'Fast processing: instant processing even for large-scale draws'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-500"></i>
                    <span>
                      {currentLang === 'ko' ? '메모리 효율: 장시간 사용해도 안정적 성능' :
                       currentLang === 'ja' ? 'メモリ効率：長時間使用しても安定したパフォーマンス' :
                       'Memory efficient: stable performance even with long-term use'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-500"></i>
                    <span>
                      {currentLang === 'ko' ? '배터리 절약: 모바일 기기의 배터리 소모 최소화' :
                       currentLang === 'ja' ? 'バッテリー節約：モバイル機器のバッテリー消費最小化' :
                       'Battery saving: minimal battery consumption on mobile devices'}
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-accessibility-line text-purple-500"></i>
                  {currentLang === 'ko' ? '접근성 지원' :
                   currentLang === 'ja' ? 'アクセシビリティサポート' :
                   'Accessibility Support'}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-500"></i>
                    <span>
                      {currentLang === 'ko' ? '키보드 내비게이션: 마우스 없이도 완전한 기능 사용' :
                       currentLang === 'ja' ? 'キーボードナビゲーション：マウスなしでも完全な機能使用' :
                       'Keyboard navigation: full functionality without mouse'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-500"></i>
                    <span>
                      {currentLang === 'ko' ? '스크린 리더: 시각 장애인을 위한 접근성 지원' :
                       currentLang === 'ja' ? 'スクリーンリーダー：視覚障害者のためのアクセシビリティサポート' :
                       'Screen reader: accessibility support for visually impaired'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-500"></i>
                    <span>
                      {currentLang === 'ko' ? '고대비 모드: 명확한 시각적 구분 제공' :
                       currentLang === 'ja' ? 'ハイコントラストモード：明確な視覚的区別提供' :
                       'High contrast mode: clear visual distinction'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 마무리 섹션 */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-8 border border-blue-200/50 dark:border-blue-800/30">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            {currentLang === 'ko' ? '공정하고 투명한 선택의 시작' :
             currentLang === 'ja' ? '公正で透明な選択の始まり' :
             'The Beginning of Fair and Transparent Selection'}
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
            {currentLang === 'ko' ? 'ToolHub.tools 번호 추첨기와 함께 완전히 공정하고 투명한 선택을 경험해보세요. 이벤트부터 게임, 업무까지 모든 상황에서 신뢰할 수 있는 무작위 선택을 제공합니다.' :
             currentLang === 'ja' ? 'ToolHub.tools番号抽选機と一緒に完全に公正で透明な選択を体験してください。イベントからゲーム、業務まで全ての状況で信頼できる無作為選択を提供します。' :
             'Experience completely fair and transparent selection with ToolHub.tools Number Raffle. We provide reliable random selection for all situations from events to games to work.'}
          </p>
          <div className="flex justify-center">
            <div className="animate-pulse">
              <i className="ri-shuffle-line text-primary text-4xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}